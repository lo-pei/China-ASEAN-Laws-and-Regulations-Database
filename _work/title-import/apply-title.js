// 通用标题写入器：把 { id: { zh?, en?, orig? } } 写入 prototype/data/laws/<id>.json 的 title.*
// 用法：node _work/title-import/apply-title.js <映射JSON> [--dry]
// 只覆盖映射中出现的字段，其余键（含 my / id 等）原样保留。
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const SRC = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!SRC) { console.error('用法：node apply-title.js <映射JSON> [--dry]'); process.exit(1); }

const map = JSON.parse(fs.readFileSync(path.resolve(SRC), 'utf8'));
const KEYS = ['zh', 'en', 'orig'];
let wrote = 0, skip = 0;
const missing = [];
const changed = {};

for (const [id, rec] of Object.entries(map)) {
  const file = path.join(LAWS, id + '.json');
  if (!fs.existsSync(file)) { missing.push(id); continue; }
  const law = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (typeof law.title === 'string') law.title = { zh: law.title };
  if (!law.title || typeof law.title !== 'object') law.title = {};
  let dirty = false;
  for (const k of KEYS) {
    if (!(k in rec)) continue;
    const v = rec[k] === null ? null : String(rec[k]).trim();
    if (v === (law.title[k] || null)) continue;
    law.title[k] = v || null;
    dirty = true;
    (changed[k] = changed[k] || []).push(id);
  }
  if (!dirty) { skip++; continue; }
  if (!DRY) fs.writeFileSync(file, JSON.stringify(law, null, 1), 'utf8');
  wrote++;
}

console.log('  映射 ' + Object.keys(map).length + ' 部，已写入 ' + wrote + '，无变化 ' + skip + '，找不到 ' + missing.length);
for (const k of KEYS) if (changed[k]) console.log('    ' + k + ': ' + changed[k].length + ' 部');
if (missing.length) console.log('  异常 id: ' + missing.slice(0, 10).join(', '));
if (DRY) console.log('  （--dry 试运行，未写盘）');
