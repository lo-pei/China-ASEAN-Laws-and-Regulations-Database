/* 盘点仍缺语种的条目，按国别分文件落到 _self/，并打印摘要
   用法：node _self_pick.js [国别...] */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const OUT = path.join(__dirname, '_self');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const want = process.argv.slice(2).map((x) => x.toUpperCase());

fs.mkdirSync(OUT, { recursive: true });
const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const pool = {};

for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json')) continue;
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  const co = clean(d.country);
  if (want.length && !want.includes(co)) continue;
  const t = d.title || {};
  const miss = LANGS.filter((k) => !clean(t[k]));
  if (!miss.length) continue;
  const have = {};
  for (const k of LANGS) if (clean(t[k])) have[k] = clean(t[k]);
  const rec = { key: d.id, co, need: miss, have };
  if (clean(d.docNumber)) rec.dn = clean(d.docNumber);
  (pool[co] = pool[co] || []).push(rec);
}

let total = 0;
for (const co of Object.keys(pool).sort()) {
  const list = pool[co];
  total += list.length;
  fs.writeFileSync(path.join(OUT, 'pending-' + co + '.json'), JSON.stringify(list, null, 0), 'utf8');
  const byNeed = {};
  for (const r of list) { const s = r.need.join('+'); byNeed[s] = (byNeed[s] || 0) + 1; }
  console.log(co + ' 待补 ' + list.length + '  ' + JSON.stringify(byNeed));
}
console.log('合计 ' + total);
