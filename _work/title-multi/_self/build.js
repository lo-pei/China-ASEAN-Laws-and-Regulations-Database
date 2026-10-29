// 通用生成器：node build.js ID-07
// 读 ID-07.tr.js（仅五语译文），原题从 pending-ID.json 回填，输出 ID-07.json
'use strict';
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const tag = process.argv[2];
if (!tag) { console.error('用法：node build.js ID-07'); process.exit(1); }
const tr = require(path.join(dir, tag + '.tr.js'));
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
fs.writeFileSync(
  path.join(dir, tag + '.json'),
  JSON.stringify({ batch: 'self-' + tag, source: '人工自译（原题取自 laws/ID-*.json title.id）', items }, null, 1),
  'utf8'
);
console.log(tag + '：条目 ' + Object.keys(items).length + (miss.length ? '，缺源 ' + miss.join(',') : '，无缺源'));
