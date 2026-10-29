// 由 ID-06.tr.js 生成 ID-06.json：原题从 pending-ID.json 回填，避免手抄出错
'use strict';
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const tr = require(path.join(dir, 'ID-06.tr.js'));
const pend = JSON.parse(fs.readFileSync(path.join(dir, 'pending-ID.json'), 'utf8'));
const src = new Map(pend.map((r) => [r.key, r.have.id]));

const items = {};
const miss = [];
for (const key of Object.keys(tr).sort()) {
  if (!src.has(key)) { miss.push(key); continue; }
  items[key] = {
    zh: tr[key].zh,
    en: tr[key].en,
    id: src.get(key),
    vi: tr[key].vi,
    th: tr[key].th,
    ms: tr[key].ms
  };
}
const out = {
  batch: 'self-ID-06',
  source: '人工自译（原题取自 laws/ID-*.json title.id）',
  items
};
fs.writeFileSync(path.join(dir, 'ID-06.json'), JSON.stringify(out, null, 1), 'utf8');
console.log('条目 ' + Object.keys(items).length + (miss.length ? '，缺源 ' + miss.join(',') : '，无缺源'));
