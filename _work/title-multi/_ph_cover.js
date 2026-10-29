// 覆盖统计：各语种标题齐全度（只读）
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'prototype', 'data', 'laws');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const TARGET = ['vi', 'th', 'id', 'ms'];

const cnt = {};
const tot = {};
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { continue; }
  const co = j.country || j.jurisdiction || '?';
  tot[co] = (tot[co] || 0) + 1;
  cnt[co] = cnt[co] || {};
  const t = j.title || {};
  for (const k of LANGS) if (t[k]) cnt[co][k] = (cnt[co][k] || 0) + 1;
}

let allN = 0, allFull = 0;
const rows = [];
for (const co of Object.keys(tot).sort()) {
  const n = tot[co];
  const full = Math.min(...TARGET.map((k) => cnt[co][k] || 0));
  allN += n; allFull += full;
  rows.push([co, n, full, n - full, TARGET.map((k) => k + ':' + (cnt[co][k] || 0)).join(' ')]);
}
console.log('国别   总数  四语齐全   缺口   各语种');
for (const r of rows) {
  console.log(String(r[0]).padEnd(5), String(r[1]).padStart(6), String(r[2]).padStart(8), String(r[3]).padStart(7), '  ', r[4]);
}
console.log('\n全库', allN, '| 四语齐全', allFull, '| 覆盖', (allFull / allN * 100).toFixed(1) + '%');
