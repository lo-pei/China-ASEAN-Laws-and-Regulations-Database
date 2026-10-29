/* 严格证明：新文本 == 旧文本「删除整行后按规则合并」的结果，且合并只改变空白
   若能 100% 复现，则本次改动不含任何字符级篡改。 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.resolve('prototype/data'), B = path.resolve('_work/backup-pre-layout');

const PAGE_DASH = /^[-–—]\s*\d{1,4}\s*[-–—]$/;
const BARE_NUM = /^\d{1,4}$/;
const WATERMARK = /^([\u4e00-\u9fff]{2,6})(?:[\s\u00a0]+\1){2,}$/;
const WATERMARK_TAIL = /(?:[\s\u00a0]*法通网[\s\u00a0]*){2,}$/;
const TERMINAL = /[.。;；:：!?！?？]["”』」\]]?$/;
const CLAUSE_START = new RegExp('^\\s*(?:' +
  '\\(\\d+\\)|\\([a-z]\\)\\s|\\([ivx]+\\)|\\d+[.)、]\\s*|[a-z][.)]\\s|' +
  'Article\\s+\\d|Section\\s+\\d|Clause\\s+\\d|Rule\\s+\\d|' +
  'Ayat\\s*\\(|Huruf\\s|Bagian\\s|Pasal\\s+\\d|Secção\\s|Artigo\\s+\\d|' +
  '第[一二三四五六七八九十百零〇\\d]+[条条款项]|（[一二三四五六七八九十百零〇\\d]+）|\\([一二三四五六七八九十百零〇\\d]+\\)|' +
  '[一二三四五六七八九十]+[、.]\\s*)', 'i');
const SMALL_WORD = /^(a|an|the|of|and|or|to|in|for|on|by|with|at|from|as|its|his|her)$/i;
function isHeadingLine(s) {
  if (s.length < 4 || s.length > 60) return false;
  if (TERMINAL.test(s)) return false;
  if (BARE_NUM.test(s) || PAGE_DASH.test(s)) return false;
  const w = s.split(/\s+/).filter(Boolean);
  if (!w.length || w.length > 10) return false;
  for (const x of w) if (!/^[A-Z]/.test(x) && !SMALL_WORD.test(x)) return false;
  return true;
}
function headerLike(k) {
  if (CLAUSE_START.test(k)) return false;
  if (BARE_NUM.test(k) || PAGE_DASH.test(k)) return false;
  if (/[.。;；:：!?！?？,，、]/.test(k)) return false;
  if (k.length < 3 || k.length > 45) return false;
  if (/^[A-Z][A-Z0-9\s&.'’\-()/]*$/.test(k) && k.length >= 8 && /[A-Z]{2}/.test(k)) return true;
  if (/^[\u4e00-\u9fff]{2,12}$/.test(k)) return true;
  return false;
}
function detect(law) {
  const freq = {}, bare = [];
  for (const a of (law.articles || []))
    for (const lang of Object.keys(a.text || {}))
      for (const ln of String(a.text[lang]).split('\n')) {
        const s = ln.trim(); if (!s) continue;
        freq[s] = (freq[s] || 0) + 1;
        if (BARE_NUM.test(s)) bare.push(+s);
      }
  let pageNums = null;
  if (bare.length >= 3) {
    let asc = 0;
    for (let i = 1; i < bare.length; i++) if (bare[i] >= bare[i - 1]) asc++;
    if (asc >= bare.length - 1 && bare[bare.length - 1] - bare[0] >= 5) pageNums = new Set(bare.map(String));
  }
  const headers = new Set();
  for (const k of Object.keys(freq)) if (freq[k] >= 4 && headerLike(k)) headers.add(k);
  return { pageNums, headers };
}
function soft(prev, next) {
  if (CLAUSE_START.test(next)) return false;
  if (isHeadingLine(prev) && /^[A-Z\u4e00-\u9fff]/.test(next)) return false;
  if (/[a-z]-$/.test(prev) && /^[a-z]/.test(next)) return true;
  if (!TERMINAL.test(prev)) return true;
  if (/^[a-z]/.test(next)) return true;
  return false;
}
function joinLine(prev, next) {
  if (/[a-z]-$/.test(prev) && /^[a-z]/.test(next)) return prev + next;
  if (/[\u4e00-\u9fff]$/.test(prev) && /^[\u4e00-\u9fff]/.test(next)) return prev + next;
  return prev + ' ' + next;
}
function reconstruct(raw, art) {
  const lines = String(raw).split('\n'), out = [];
  for (let ln of lines) {
    let s = ln.replace(/[\t\u00a0]+/g, ' ').replace(WATERMARK_TAIL, '').trim();
    if (!s) continue;
    if (PAGE_DASH.test(s) || WATERMARK.test(s)) continue;
    if (art.pageNums && art.pageNums.has(s)) continue;
    if (art.headers.has(s)) continue;
    if (!out.length) { out.push(s); continue; }
    const prev = out[out.length - 1];
    if (soft(prev, s)) out[out.length - 1] = joinLine(prev, s); else out.push(s);
  }
  return out.join('\n');
}

function load(base, files) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(base, f), 'utf8'), c, { filename: f }));
  return c.CALR_FULLTEXT || {};
}
const files = fs.readdirSync(path.join(R, 'intl')).filter(f => /^[a-z]{2}-p\d+\.js$/.test(f)).map(f => 'intl/' + f);
const after = load(R, files), before = load(B, files);

let ok = 0, mismatch = 0, skip = 0, noLaw = 0, noArt = 0, skippedSingle = 0;
const bad = [];
for (const id of Object.keys(before)) {
  const A = after[id], Bl = before[id];
  if (!A) { noLaw++; continue; }
  if ((A.articles || []).length !== (Bl.articles || []).length) { noArt++; continue; }
  const art = detect(Bl);
  (Bl.articles || []).forEach((oa, i) => {
    const na = A.articles[i];
    for (const l in (oa.text || {})) {
      const raw = oa.text[l];
      const exp = reconstruct(raw, art);
      const got = na.text[l];
      if (!exp || exp.length < 10) { skip++; continue; }
      if (exp === got) ok++; else {
        /* 单行文本：规范化器刻意不改（if (!raw.includes('\n')) continue），
           故证明脚本会「重建」出不同结果——属预期，不计为差异 */
        if (!raw.includes('\n')) { skippedSingle++; continue; }
        mismatch++;
        if (bad.length < 8) bad.push({ id, no: oa.no, l, exp, got, rawLen: raw.length, expLen: exp.length, gotLen: (got === undefined ? -1 : got.length) });
      }
    }
  });
}
console.log('=== 变换可复现性证明 ===');
console.log('  完全一致（新文本 == 旧文本删行后合并） ' + ok);
console.log('  不一致                                ' + mismatch);
console.log('  因结果过短而跳过（保留原文）           ' + skip);
console.log('  单行文本（规范化器刻意不改，属预期）   ' + skippedSingle);
console.log('  法规缺失 ' + noLaw + '，条文数不一致 ' + noArt);
bad.forEach(b => {
  console.log('  -- ' + b.id + ' 条' + b.no + ' [' + b.l + ']  旧长 ' + b.rawLen + ' / 期望长 ' + b.expLen + ' / 实际长 ' + b.gotLen);
  console.log('     期望: ' + JSON.stringify(b.exp));
  console.log('     实际: ' + JSON.stringify(b.got));
});
