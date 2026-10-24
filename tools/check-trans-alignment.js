/**
 * 量译文对齐错位：用「数字指纹」做启发式比对
 *   法律条文中数字（条号、金额、比例、期限、日期）通常忠实对应。
 *   如果原文与译文的数字集合几乎不重叠，且两者都含数字，基本可以判定错位。
 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.cwd();

function loadPack(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const sb = { window: {}, console };
  vm.createContext(sb);
  vm.runInContext(src, sb, { filename: rel });
  return sb.window;
}
function nums(s) {
  const out = new Set();
  const re = /\d+(?:[.,]\d+)*/g;
  let m;
  while ((m = re.exec(s)) !== null) out.add(m[0].replace(/[.,]/g, ''));
  return out;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return null;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

const DIR = path.join(ROOT, 'prototype/data/trans');
const files = fs.readdirSync(DIR).filter(f => /\.js$/.test(f) && f !== 'manifest.js');

let checked = 0, withNums = 0, bad = 0, good = 0, mid = 0;
const badSamples = [];
const perLaw = new Map();

for (const f of files) {
  const w = loadPack('prototype/data/trans/' + f);
  const T = w.CALR_TRANS;
  if (!T) continue;
  for (const lawId of Object.keys(T)) {
    const arts = (T[lawId] && T[lawId].articles) || [];
    const lp = path.join(ROOT, 'prototype/data/laws', lawId + '.json');
    if (!fs.existsSync(lp)) continue;
    const law = JSON.parse(fs.readFileSync(lp, 'utf8'));
    const oarts = law.articles || [];
    const byNo = {};
    oarts.forEach(a => { byNo[String(a.no)] = a; });
    let lawBad = 0, lawChecked = 0;
    for (const ta of arts) {
      const oa = byNo[String(ta.no)];
      if (!oa) continue;
      const tTxt = (ta.text && (Object.values(ta.text).find(v => v) || '')) || '';
      const oTxt = (oa.text && (Object.values(oa.text).find(v => v) || '')) || '';
      if (!tTxt || !oTxt) continue;
      checked++;
      lawChecked++;
      const A = nums(oTxt), B = nums(tTxt);
      if (A.size < 2 || B.size < 2) continue;   // 数字太少，无法判断
      withNums++;
      const j = jaccard(A, B);
      if (j === null) continue;
      if (j < 0.15) { bad++; lawBad++; if (badSamples.length < 6) badSamples.push({ lawId, no: ta.no, j, oTxt, tTxt }); }
      else if (j > 0.5) good++;
      else mid++;
    }
    if (lawChecked >= 5 && lawBad / lawChecked > 0.3) perLaw.set(lawId, { bad: lawBad, checked: lawChecked });
  }
}

console.log('  比对条文: %d', checked);
console.log('  原文与译文都含足够的数字: %d', withNums);
console.log('    数字重合度 > 0.5（明显对齐）: %d (%.1f%%)', good, good / withNums * 100);
console.log('    0.15 ~ 0.5（存疑）:        %d (%.1f%%)', mid, mid / withNums * 100);
console.log('    < 0.15（疑似错位）:        %d (%.1f%%)', bad, bad / withNums * 100);
console.log('');
console.log('  错位率超过 30%% 的法规: %d 部', perLaw.size);
const top = [...perLaw.entries()].sort((a, b) => b[1].bad - a[1].bad).slice(0, 12);
for (const [id, v] of top) console.log('    %-22s %4d / %4d 条', id, v.bad, v.checked);
console.log('');
console.log('  === 疑似错位样本 ===');
for (const s of badSamples) {
  console.log('  ---- %s 第%s条  数字重合 %.2f ----', s.lawId, s.no, s.j);
  console.log('    原文: %s', s.oTxt.slice(0, 90).replace(/\n/g, ' ⏎ '));
  console.log('    译文: %s', s.tTxt.slice(0, 90));
}
