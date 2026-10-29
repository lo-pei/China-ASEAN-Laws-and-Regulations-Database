'use strict';
// 「该译走的英文词」反向词表：从已入库的 PH 英-<目标语> 对照里反推。
// 判据：某个英文词在 en 里出现过 ≥4 次，且其中 ≥92% 的记录在目标语里找不到它
//       （说明前人一致把它译掉了）→ 这个词就该译，留着就是伪译/漏译。
// 用法：node _work/title-multi/_ph_mtbuild.js
const fs = require('fs');
const path = require('path');
const LANGS = ['vi', 'th', 'id', 'ms'];
const ROOT = path.resolve(__dirname, '..', '..');
const DATADIR = path.join(ROOT, 'prototype', 'data', 'laws');
const ENTOK = /[A-Za-z]{4,}/g;

const stat = {};
for (const L of LANGS) stat[L] = new Map();   // w -> {tot, gone}
for (const f of fs.readdirSync(DATADIR)) {
  if (!f.startsWith('PH-')) continue;
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DATADIR, f), 'utf8')); } catch (e) { continue; }
  const t = j.title || {};
  const en = t.en || t.orig;
  if (!en) continue;
  const enSet = new Set([...String(en).matchAll(ENTOK)].map((m) => m[0].toLowerCase()));
  if (!enSet.size) continue;
  for (const L of LANGS) {
    const s = t[L];
    if (!s) continue;
    const low = String(s).toLowerCase();
    for (const w of enSet) {
      const e = stat[L].get(w) || { tot: 0, gone: 0 };
      e.tot++;
      if (!low.includes(w)) e.gone++;
      stat[L].set(w, e);
    }
  }
}
const out = {};
for (const L of LANGS) {
  const list = [];
  for (const [w, e] of stat[L]) {
    if (e.tot >= 4 && e.gone / e.tot >= 0.92) list.push(w);
  }
  list.sort();
  out[L] = list;
  console.log(L, '词表', list.length, '|', list.slice(0, 40).join(' '));
}
fs.writeFileSync(path.join(__dirname, '_ph_mt.json'), JSON.stringify(out, null, 1), 'utf8');
console.log('写出 _ph_mt.json');
