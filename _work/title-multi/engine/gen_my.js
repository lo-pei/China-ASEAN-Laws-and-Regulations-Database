// 马来西亚附属法规标题组装器
// 结构：〈主体〉（〈限定语〉）…〈类型词〉〈年份〉
// 逐部查术语表，主体或任一括号缺译则跳过（不臆造），并记录原因
// 用法：node gen_my.js [--dry] [--out my-p2-b01]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const BAT = path.join(ROOT, '_work', 'title-multi', 'batches');
/* 术语表：基础表 + 增补表（lexicon-my-add*.json 覆盖同名键） */
function loadLex() {
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'lexicon-my.json'), 'utf8'));
  const lex = { types: Object.assign({}, base.types), heads: Object.assign({}, base.heads), brackets: Object.assign({}, base.brackets) };
  const adds = fs.readdirSync(__dirname).filter(f => /^lexicon-my-add.*\.json$/.test(f)).sort();
  for (const f of adds) {
    const j = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    Object.assign(lex.types, j.types || {});
    Object.assign(lex.heads, j.heads || {});
    Object.assign(lex.brackets, j.brackets || {});
  }
  return lex;
}
const LEX = loadLex();

const TYPES = Object.keys(LEX.types).sort((a, b) => b.length - a.length);
const LANGS = ['zh', 'vi', 'th', 'id', 'ms'];

/* 归一化：HTML 实体、各种破折号 → 连字符，折叠空格 */
function norm(s) {
  return String(s)
    .replace(/&#8722;|&minus;/gi, '-')
    .replace(/&#61485;|&#\d+;/g, '-')
    .replace(/&APOS;|&#39;/gi, "'")
    .replace(/&AMP;/gi, '&')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/* 抬头清洗：引用式开头「I. THIS ORDER MAY BE CITED AS THE …」、末尾「- CORRIGENDUM」 */
function preclean(raw) {
  let s = norm(raw);
  s = s.replace(/^[IVX]+\.\s*THIS\s+(ORDER|ACT|REGULATION|RULES?)\s+MAY\s+BE\s+CITED\s+AS\s+(THE\s+)?/i, '');
  s = s.replace(/\s*-\s*CORRIGENDUM\s*$/i, ' (CORRIGENDUM)');
  /* 源文拼写/OCR 讹误（仅限类型词，不影响语义） */
  s = s.replace(/\b0RDER\b/g, 'ORDER')
    .replace(/\bREGULATONS\b/g, 'REGULATIONS')
    .replace(/\bREGULATON\b/g, 'REGULATION');
  return s;
}

const NUM_RE = /^N[O0]\.?\s*(\d+)$/;

function parse(raw) {
  let s = preclean(raw);
  let type = '', typeNo = '';
  const years = [], extra = [], brs = [];
  /* 三轮剥离：末尾年份 → 类型词（句尾或句首）→ 末尾括号链；
     典型需多轮的形态：… REGULATIONS 2016 / RULES OF COURT (AMENDMENT) 2019 /
     ACT 1950-62 / ORDER, 1975 / … RULES 1994 (AMENDMENT) 2021（内嵌基法年份） */
  for (let pass = 0; pass < 3; pass++) {
    /* 末尾年份：允许前导逗号、年份区间 1950-62、并列 1963/67、紧跟 (AMENDMENT) */
    const ym = s.match(/[,]?\s*\b((?:19|20)\d{2}(?:\s*[-/]\s*\d{2,4})?)\s*(\(\s*AMENDMENT\s*\))?\s*$/i);
    if (ym && /\d{4}/.test(ym[1])) {
      years.push(ym[1].replace(/\s*[-/]\s*/, '-'));
      if (ym[2]) extra.push('AMENDMENT');
      s = s.slice(0, ym.index).replace(/[,\s]+$/, '').trim();
    }
    /* 类型词：先在句尾（可带 NO. N 编号），再退到句首（RULES OF COURT 等前置型） */
    if (!type) {
      for (const T of TYPES) {
        const esc = T.replace(/[-.]/g, '\\$&');
        const reTail = new RegExp('[,]?\\s+' + esc + '\\s*(?:NO\\.?\\s*(\\d+))?\\s*$', 'i');
        const m = s.match(reTail);
        if (m) { type = T; typeNo = m[1] || ''; s = s.slice(0, m.index).trim(); break; }
      }
    }
    if (!type) {
      for (const T of TYPES) {
        const esc = T.replace(/[-.]/g, '\\$&');
        const reHead = new RegExp('^' + esc + '(?=\\s|\\(|$)', 'i');
        if (reHead.test(s)) { type = T; s = s.replace(reHead, '').trim(); break; }
      }
    }
    /* 末尾括号链 */
    while (/\([^()]*\)\s*$/.test(s)) {
      const m = s.match(/\(([^()]*)\)\s*$/);
      brs.unshift(norm(m[1]));
      s = s.replace(/\s*\([^()]*\)\s*$/, '').trim();
    }
  }
  /* 年份顺序：years[0] 为外层（修正年），years[1] 为内嵌基法年 */
  return {
    head: norm(s).replace(/^[,.\s]+|[,.\s]+$/g, ''),
    brs: brs.concat(extra), type, typeNo,
    year: years[0] || '', innerYear: years[1] || ''
  };
}

/* 括号渲染 */
function brText(key, lang) {
  const m = key.match(NUM_RE);
  if (m) {
    const n = m[1];
    const map = { zh: '第' + n + '号', vi: 'số ' + n, th: 'ฉบับที่ ' + n, id: 'Nomor ' + n, ms: 'Bilangan ' + n };
    return map[lang];
  }
  /* 内嵌基法年份被提到句首后，外层修正年改为括注 */
  const y = key.match(/^YEAR:(\d{4}(?:-\d{2,4})?)$/);
  if (y) {
    const map = {
      zh: y[1] + '年修正', vi: 'sửa đổi năm ' + y[1], th: 'แก้ไขเพิ่มเติม ค.ศ. ' + y[1],
      id: 'pindaan tahun ' + y[1], ms: 'pindaan ' + y[1]
    };
    return map[lang];
  }
  const e = LEX.brackets[key];
  return e ? e[lang] : null;
}

/* 带编号的类型词（ORDINANCE NO. 32 → 第32号条例） */
function typeText(t, no, lang) {
  if (!no) return t[lang];
  const map = {
    zh: '第' + no + '号' + t.zh, vi: t.vi + ' số ' + no, th: t.th + ' ฉบับที่ ' + no,
    id: t.id + ' Nomor ' + no, ms: t.ms + ' Bil. ' + no
  };
  return map[lang];
}

/* 年份区间补齐：1950-62 → 1950-1962 */
function expandYear(y) {
  const m = String(y).match(/^(\d{4})-(\d{2}|\d{4})$/);
  if (!m) return y;
  return m[2].length === 2 ? m[1] + '-' + m[1].slice(0, 2) + m[2] : y;
}

function build(p) {
  const t = LEX.types[p.type];
  if (!t) return null;
  /* 类型词前置型（RULES OF COURT (AMENDMENT) 2019）：无主体，用类型词自身作中心语 */
  const h = p.head ? LEX.heads[p.head] : { zh: '', vi: '', th: '', id: '', ms: '' };
  if (!h) return null;
  /* 内嵌基法年份：年份取基法年，外层修正年降为括注（排在年份之后） */
  const year = expandYear(p.innerYear || p.year);
  let amendKey = '';
  const brs = p.brs.slice();
  if (p.innerYear && p.year) {
    /* 「(AMENDMENT)」与「(Y年修正)」语义重复，只保留后者 */
    const i = brs.indexOf('AMENDMENT');
    if (i >= 0) brs.splice(i, 1);
    amendKey = 'YEAR:' + p.year;
  }
  const bts = {};
  const amd = {};
  for (const lang of LANGS) {
    const arr = [];
    for (const b of brs) {
      const v = brText(b, lang);
      if (v === null) return null;          // 任一括号缺译 → 整部跳过
      arr.push(v);
    }
    bts[lang] = arr;
    amd[lang] = amendKey ? brText(amendKey, lang) : '';
  }
  const out = {};
  const sep = p.head ? ' ' : '';
  const T = {};
  for (const lang of LANGS) T[lang] = typeText(t, p.typeNo, lang);
  /* zh：年份前置 + 全角括号；类型词前置型（无主体）时类型词排在括号之前 */
  out.zh = (year ? year + '年' : '') + h.zh +
    (p.head
      ? bts.zh.map(x => '（' + x + '）').join('') + T.zh
      : T.zh + bts.zh.map(x => '（' + x + '）').join('')) +
    (amd.zh ? '（' + amd.zh + '）' : '');
  /* vi：〈类型〉về 〈主体〉… năm 〈年〉 */
  out.vi = T.vi + (p.head ? ' về ' + h.vi : '') + bts.vi.map(x => ' (' + x + ')').join('') +
    (year ? ' năm ' + year : '') + (amd.vi ? ' (' + amd.vi + ')' : '');
  /* th：〈类型〉〈主体〉… ค.ศ. 〈年〉 */
  out.th = T.th + (p.head ? ' ' + h.th : '') + bts.th.map(x => ' (' + x + ')').join('') +
    (year ? ' ค.ศ. ' + year : '') + (amd.th ? ' (' + amd.th + ')' : '');
  /* id：〈类型〉 〈主体〉… Tahun 〈年〉 */
  out.id = T.id + sep + h.id + bts.id.map(x => ' (' + x + ')').join('') +
    (year ? ' Tahun ' + year : '') + (amd.id ? ' (' + amd.id + ')' : '');
  /* ms：〈类型〉 〈主体〉… 〈年〉 */
  out.ms = T.ms + sep + h.ms + bts.ms.map(x => ' (' + x + ')').join('') +
    (year ? ' ' + year : '') + (amd.ms ? ' (' + amd.ms + ')' : '');
  return out;
}

/* ---- 主流程 ---- */
/* 调试：node gen_my.js --parse "标题原文" */
if (process.argv.includes('--parse')) {
  const t = process.argv[process.argv.indexOf('--parse') + 1];
  console.log(JSON.stringify(parse(t), null, 1));
  process.exit(0);
}
const items = {}, skip = { head: [], bracket: [], type: [], empty: [] };
let total = 0, hit = 0;

for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('MY-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const tt = d.title || {};
  if (String(tt.zh || '').trim()) continue;        // 已有中文标题，跳过
  total++;
  const raw = String(tt.en || tt.orig || '').trim();
  if (!raw) { skip.empty.push(d.id); continue; }
  const p = parse(raw);
  if (p.head && !LEX.heads[p.head]) { skip.head.push(d.id + ' | ' + p.head + ' | ' + raw); continue; }
  if (!p.type) { skip.type.push(d.id + ' | ' + raw); continue; }
  const built = build(p);
  if (!built) {
    const miss = p.brs.filter(b => !NUM_RE.test(b) && !LEX.brackets[b]);
    skip.bracket.push(d.id + ' | ' + miss.join(' / '));
    continue;
  }
  items[d.id] = built;
  hit++;
}

const outName = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'my-p2-b01') + '.json';
const doc = {
  batch: outName.replace(/\.json$/, ''),
  scope: 'MY 附属法规（P.U.(A)）· 术语表组装 · 主体 ' + Object.keys(LEX.heads).length + ' 个 / 括号 ' + Object.keys(LEX.brackets).length + ' 条',
  generatedFrom: '_work/title-multi/engine/gen_my.js',
  items
};

console.log('MY 待补中文标题', total, '→ 可组装', hit);
console.log('  跳过：主体未收录', skip.head.length, '| 括号未收录', skip.bracket.length,
  '| 无类型词', skip.type.length, '| 空标题', skip.empty.length);
if (process.argv.includes('--diag')) {
  for (const [k, arr] of Object.entries(skip)) {
    if (!arr.length) continue;
    console.log('\n==== ' + k + ' (' + arr.length + ') ====');
    arr.forEach(x => console.log('  ' + x));
  }
  process.exit(0);
}
const hc = {};
for (const x of skip.head) { const k = x.split('|')[1].trim(); hc[k] = (hc[k] || 0) + 1; }
console.log('  未收录主体 Top10：');
Object.entries(hc).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log('   ', v, k.slice(0, 60)));
const bc = {};
for (const x of skip.bracket) { const k = x.split('|')[1].trim(); bc[k] = (bc[k] || 0) + 1; }
console.log('  未收录括号 Top10：');
Object.entries(bc).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log('   ', v, k.slice(0, 70)));

console.log('\n--- 样例 8 条 ---');
Object.entries(items).slice(0, 8).forEach(([id, v]) => {
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, id + '.json'), 'utf8'));
  console.log(id, '|', String(d.title.en || '').slice(0, 78));
  console.log('   zh:', v.zh);
  console.log('   ms:', v.ms);
  console.log('   vi:', v.vi);
  console.log('   th:', v.th);
  console.log('   id:', v.id);
});

if (!process.argv.includes('--dry')) {
  fs.writeFileSync(path.join(BAT, outName), JSON.stringify(doc, null, 1), 'utf8');
  console.log('\n写出', path.join(BAT, outName), '·', Object.keys(items).length, '条');
} else {
  console.log('\n（--dry，未写盘）');
}
