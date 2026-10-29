// 将中国法规标题英译写入权威存储 prototype/data/laws/<id>.json 的 title.en
// 数据源：_work/title-en/titles-en.json（{ id: { en } }）
// 用法：node _work/title-en/apply-title-en.js [--dry]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const SRC = path.join(__dirname, 'titles-en.json');
const DRY = process.argv.includes('--dry');

const map = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const ids = Object.keys(map);
console.log('  待写入英文标题: ' + ids.length);

let written = 0, already = 0, missing = [];

for (const id of ids) {
  const file = path.join(LAWS, id + '.json');
  if (!fs.existsSync(file)) { missing.push(id); continue; }
  const law = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (typeof law.title === 'string') law.title = { zh: law.title };
  if (!law.title || typeof law.title !== 'object') { missing.push(id); continue; }
  const en = String(map[id].en || '').trim();
  if (!en) { missing.push(id); continue; }
  if (law.title.en === en) { already++; continue; }
  law.title.en = en;
  if (!law.title.zh) law.title.zh = null;
  if (!DRY) fs.writeFileSync(file, JSON.stringify(law, null, 1), 'utf8');
  written++;
}

console.log('  已写入: ' + written + '  已存在: ' + already + '  找不到/无效: ' + missing.length);
if (missing.length) console.log('  异常 id: ' + missing.slice(0, 10).join(', '));
if (DRY) console.log('  （--dry 试运行，未写盘）');
