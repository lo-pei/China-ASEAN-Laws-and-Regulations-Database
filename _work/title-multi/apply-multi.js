// 多语种标题批量写入器：把批次 JSON 的 items 写入 prototype/data/laws/<id>.json 的 title.*
// 用法：node _work/title-multi/apply-multi.js <批次JSON> [--dry]
// 只覆盖批次中出现的键，其余键（含未列语种）原样保留（增量友好）。
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const SRC = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!SRC) { console.error('用法：node apply-multi.js <批次JSON> [--dry]'); process.exit(1); }

const KEYS = ['zh', 'en', 'vi', 'th', 'id', 'ms', 'orig', 'km', 'lo', 'my', 'pt', 'tet'];

const doc = JSON.parse(fs.readFileSync(path.resolve(SRC), 'utf8'));
const items = doc.items || doc;
const changed = {};
let wrote = 0, same = 0;
const missing = [];
const badKey = [];

for (const [id, rec] of Object.entries(items)) {
  const file = path.join(LAWS, id + '.json');
  if (!fs.existsSync(file)) { missing.push(id); continue; }
  const law = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (typeof law.title === 'string') law.title = { zh: law.title };
  if (!law.title || typeof law.title !== 'object') law.title = {};
  let dirty = false;
  for (const [k, vRaw] of Object.entries(rec)) {
    if (!KEYS.includes(k)) { badKey.push(id + '.' + k); continue; }
    const v = vRaw === null ? null : String(vRaw).replace(/\s+/g, ' ').trim();
    const cur = law.title[k] === undefined ? null : law.title[k];
    if ((v === null ? null : (v || null)) === (cur === null ? null : (cur || null))) continue;
    law.title[k] = v === null ? null : (v || null);
    dirty = true;
    (changed[k] = changed[k] || []).push(id);
  }
  if (!dirty) { same++; continue; }
  if (!DRY) fs.writeFileSync(file, JSON.stringify(law, null, 1), 'utf8');
  wrote++;
}

console.log('  批次 ' + (doc.batch || '(未命名)') + '：条目 ' + Object.keys(items).length +
  '，写入 ' + wrote + '，无变化 ' + same + '，找不到 ' + missing.length);
for (const k of KEYS) if (changed[k]) console.log('    ' + k + ': ' + changed[k].length + ' 部');
if (badKey.length) console.log('  ✗ 非法键 ' + badKey.length + ' 处：' + badKey.slice(0, 8).join(', '));
if (missing.length) console.log('  ✗ 异常 id：' + missing.slice(0, 10).join(', '));
if (DRY) console.log('  （--dry 试运行，未写盘）');
if (badKey.length || missing.length) process.exitCode = 2;
