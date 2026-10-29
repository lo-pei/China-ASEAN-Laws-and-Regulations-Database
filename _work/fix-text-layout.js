/* ==========================================================================
   CALR · 条文正文版式规范化
   修复两类 PDF 抽取残留：
     1) 硬折行：正文被按屏幕/页面宽度硬断，渲染时变成独立段落
     2) 页码与页眉：`- 31 -`、裸数字页码、重复页眉（如 LAWS OF BRUNEI）、来源站水印

   用法：
     node _work/fix-text-layout.js --dry          仅统计，不改文件
     node _work/fix-text-layout.js                写回 prototype/data/{intl,fulltext}
   ========================================================================== */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'prototype', 'data');
const DRY = process.argv.includes('--dry');

/* ---------- 正则 ---------- */
const PAGE_DASH = /^[-–—]\s*\d{1,4}\s*[-–—]$/;                   // - 31 -
const BARE_NUM = /^\d{1,4}$/;
const WATERMARK = /^([\u4e00-\u9fff]{2,6})(?:[\s\u00a0]+\1){2,}$/; // 法通网 法通网 法通网
const WATERMARK_TAIL = /(?:[\s\u00a0]*法通网[\s\u00a0]*){2,}$/;
const TERMINAL = /[.。;；:：!?！?？]["”』」\]]?$/;
const CLAUSE_START = new RegExp(
  '^\\s*(?:' +
  '\\(\\d+\\)|\\([a-z]\\)\\s|\\([ivx]+\\)|' +                    // (1) (a) (iv)
  '\\d+[.)、]\\s*|[a-z][.)]\\s|' +                               // 1. a)
  'Article\\s+\\d|Section\\s+\\d|Clause\\s+\\d|Rule\\s+\\d|' +   // Article 12
  'Ayat\\s*\\(|Huruf\\s|Bagian\\s|Pasal\\s+\\d|' +               // 印尼/马来
  'Secção\\s|Artigo\\s+\\d|' +                                   // 葡语（东帝汶）
  '第[一二三四五六七八九十百零〇\\d]+[条条款项]|' +                  // 中文
  '（[一二三四五六七八九十百零〇\\d]+）|\\([一二三四五六七八九十百零〇\\d]+\\)|' +
  '[一二三四五六七八九十]+[、.]\\s*' +
  ')', 'i');

/* 运行页眉判定：全大写拉丁串，或纯中文且不含小写拉丁 */
function headerLike(k) {
  if (CLAUSE_START.test(k)) return false;
  if (BARE_NUM.test(k) || PAGE_DASH.test(k)) return false;
  /* 含任何句读 → 一定是正文，不是页眉 */
  if (/[.。;；:：!?！?？,，、]/.test(k)) return false;
  if (k.length < 3 || k.length > 45) return false;
  /* 情形一：全大写拉丁，且长度 ≥8（排除 PART2 / PARTS / TALIAN 之类短碎片） */
  if (/^[A-Z][A-Z0-9\s&.\'’\-()/]*$/.test(k) && k.length >= 8 && /[A-Z]{2}/.test(k)) return true;
  /* 情形二：纯中文且不超过 12 字（页眉/来源站水印） */
  if (/^[\u4e00-\u9fff]{2,12}$/.test(k)) return true;
  return false;
}

/* ---------- 逐法探测伪影 ---------- */
function detect(law) {
  const freq = {};
  const bare = [];
  for (const a of (law.articles || [])) {
    for (const lang of Object.keys(a.text || {})) {
      for (const ln of String(a.text[lang]).split('\n')) {
        const s = ln.trim();
        if (!s) continue;
        freq[s] = (freq[s] || 0) + 1;
        if (BARE_NUM.test(s)) bare.push(+s);
      }
    }
  }
  // 裸数字页码：≥3 行且基本递增且首尾跨度 ≥5
  let pageNums = null;
  let pageRange = null;
  if (bare.length >= 3) {
    let asc = 0;
    for (let i = 1; i < bare.length; i++) if (bare[i] >= bare[i - 1]) asc++;
    if (asc >= bare.length - 1 && bare[bare.length - 1] - bare[0] >= 5) {
      pageNums = new Set(bare.map(String));
      pageRange = [Math.min.apply(null, bare), Math.max.apply(null, bare)];
    }
  }
  // 运行页眉：同一部法内重复 ≥3 次且形态像页眉
  const headers = new Set();
  for (const k of Object.keys(freq)) {
    if (freq[k] >= 4 && headerLike(k)) headers.add(k);
  }
  return { pageNums, headers, pageRange };
}

/* ---------- 归一化 ---------- */
/* 小节标题识别：Title Case / 全大写，长度 ≤60，无句末标点 */
const SMALL_WORD = /^(a|an|the|of|and|or|to|in|for|on|by|with|at|from|as|its|his|her)$/i;
function isHeadingLine(s) {
  if (s.length < 4 || s.length > 60) return false;
  if (TERMINAL.test(s)) return false;
  if (BARE_NUM.test(s) || PAGE_DASH.test(s)) return false;
  const words = s.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 10) return false;
  for (const w of words) if (!/^[A-Z]/.test(w) && !SMALL_WORD.test(w)) return false;
  return true;
}

function soft(prev, next) {
  if (CLAUSE_START.test(next)) return false;          // 新条 / 新款项 → 真实分段
  if (isHeadingLine(prev) && /^[A-Z\u4e00-\u9fff]/.test(next)) return false;  // 标题行 → 保留分段
  if (/[a-z]-$/.test(prev) && /^[a-z]/.test(next)) return true; // 连字符断词
  if (!TERMINAL.test(prev)) return true;              // 上一行未结束 → 软换行
  if (/^[a-z]/.test(next)) return true;               // 下一行小写开头 → 续行
  return false;
}
function joinLine(prev, next) {
  /* 连字符一律保留（不删字符，符合「逐字」红线）；仅在这里判定是否补空格。
     实测：X-\nY 共 1019 处，去除连字符后能在语料词表命中的为 0，
     说明该模式绝大多数是「which—(a)」被抽成「which-\nfa)」的残缺标记，而非英文断词。 */
  if (/[a-z]-$/.test(prev) && /^[a-z]/.test(next)) return prev + next;
  if (/[\u4e00-\u9fff]$/.test(prev) && /^[\u4e00-\u9fff]/.test(next)) return prev + next;
  return prev + ' ' + next;
}

/* 关于页脚：经实测，「页码+日期」（如 264 26th. FEBRUARY, 2000）与「页码+小节标题」
   （如 267 Published editions.）两类规则的误删风险高于收益——它们会一并删掉
   修正记录里形如「23 May 2017」「1 1 October 2017」的合法日期行与
   「P.50」这类菲律宾比索金额。因此这里不再处理这两类，宁可保留少量版式噪声，
   也不改动任何有效字符。 */

function normalize(raw, art) {
  const lines = String(raw).split('\n');
  const out = [];
  for (let ln of lines) {
    let s = ln.replace(/[\t\u00a0]+/g, ' ').replace(WATERMARK_TAIL, '').trim();
    if (!s) continue;
    if (PAGE_DASH.test(s)) continue;
    if (WATERMARK.test(s)) continue;
    if (art.pageNums && art.pageNums.has(s)) continue;
    if (art.headers.has(s)) { REMOVED_HEADERS.add(s); continue; }
    if (!out.length) { out.push(s); continue; }
    const prev = out[out.length - 1];
    if (soft(prev, s)) out[out.length - 1] = joinLine(prev, s);
    else out.push(s);
  }
  return out.join('\n');
}

/* ---------- 处理分卷文件 ---------- */
const ENTRY = /^(\s*)FT\["([^"]+)"\]\s*=\s*(\{.*\});\s*$/;

function processFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  let changedLines = 0, artTouched = 0, artTotal = 0;
  let removedPage = 0, removedHeader = 0, joined = 0;
  const samples = [];

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ENTRY);
    if (!m) continue;
    let law;
    try { law = JSON.parse(m[3]); } catch (e) { continue; }
    const art = detect(law);
    let localChanged = false;
    let localJoined = 0, localPage = 0, localHdr = 0;

    for (const a of (law.articles || [])) {
      for (const lang of Object.keys(a.text || {})) {
        const raw = a.text[lang];
        if (typeof raw !== 'string' || !raw.includes('\n')) continue;
        artTotal++;
        const beforeLines = raw.split('\n');
        let after = normalize(raw, art);
        if (!after || after.length < 10) continue;   /* 归一化异常则保留原文，绝不抹掉条文 */
        if (after === raw) continue;
        // 统计
        localPage += beforeLines.filter(l => PAGE_DASH.test(l.trim()) || (art.pageNums && art.pageNums.has(l.trim()))).length;
        localHdr += beforeLines.filter(l => art.headers.has(l.trim()) || WATERMARK.test(l.trim())).length;
        localJoined += Math.max(0, beforeLines.filter(l => l.trim()).length - after.split('\n').length);
        a.text[lang] = after;
        artTouched++; localChanged = true;
        if (samples.length < 4 && beforeLines.length > 4) {
          samples.push({ id: law.id, no: a.no, lang, before: raw.slice(0, 180), after: after.slice(0, 180) });
        }
      }
    }
    if (localChanged) {
      lines[i] = m[1] + 'FT["' + m[2] + '"] = ' + JSON.stringify(law) + ';';
      changedLines++;
      removedPage += localPage; removedHeader += localHdr; joined += localJoined;
    }
  }

  if (changedLines && !DRY) fs.writeFileSync(file, lines.join('\n'), 'utf8');
  return { changedLines, artTouched, artTotal, removedPage, removedHeader, joined, samples };
}

const targets = [];
for (const dir of ['intl', 'fulltext']) {
  const d = path.join(DATA, dir);
  if (!fs.existsSync(d)) continue;
  fs.readdirSync(d).filter(f => f.endsWith('.js') && f !== 'manifest.js')
    .forEach(f => targets.push(path.join(d, f)));
}

const REMOVED_HEADERS = new Set();
let T = { changedLines: 0, artTouched: 0, artTotal: 0, removedPage: 0, removedHeader: 0, joined: 0 };
let allSamples = [];
const perFile = [];
for (const f of targets) {
  const r = processFile(f);
  T.changedLines += r.changedLines; T.artTouched += r.artTouched; T.artTotal += r.artTotal;
  T.removedPage += r.removedPage; T.removedHeader += r.removedHeader; T.joined += r.joined;
  if (r.artTouched) perFile.push([path.basename(f), r.artTouched, r.joined, r.removedPage, r.removedHeader]);
  if (allSamples.length < 3 && r.samples.length) allSamples.push(r.samples[0]);
}

console.log(DRY ? '【试运行，未写盘】' : '【已写盘】');
console.log('  扫描文件        ' + targets.length);
console.log('  受影响法规      ' + T.changedLines + ' / ' + T.artTotal + ' 条条文中 ' + T.artTouched + ' 条被改写');
console.log('  删除页码行      ' + T.removedPage);
console.log('  删除页眉/水印行  ' + T.removedHeader);
console.log('  合并软换行      ' + T.joined + ' 处');
console.log('');
console.log('  受影响最多的文件：');
perFile.sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(r =>
  console.log('    ' + r[0].padEnd(14) + ' 条文 ' + String(r[1]).padStart(5) + '  合并 ' + String(r[2]).padStart(6) + '  页码 ' + String(r[3]).padStart(4) + '  页眉 ' + String(r[4]).padStart(4)));
console.log('  被删除的页眉/水印行（按出现法域数）：');
[...REMOVED_HEADERS].slice(0, 30)
  .forEach(k => console.log('    ' + JSON.stringify(k.slice(0, 54))));
console.log('');
for (const s of allSamples) {
  console.log('  样例 ' + s.id + ' 条' + s.no + ' [' + s.lang + ']');
  console.log('    改前: ' + JSON.stringify(s.before));
  console.log('    改后: ' + JSON.stringify(s.after));
  console.log('');
}
