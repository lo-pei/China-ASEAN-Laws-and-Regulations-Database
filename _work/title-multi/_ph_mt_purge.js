/* ==========================================================================
   _ph_mt_purge.js —— 把质检不合格的条目从 _ph_mt_out.jsonl 里剔除
   
   剔除后这些 key 就不再算「已完成」，下一轮 _ph_mt.js 会自动重译。
   用法：node _ph_mt_purge.js <坏条JSON>
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '_ph_mt_out.jsonl');
const BAD = process.argv[2];
if (!BAD) { console.error('用法：node _ph_mt_purge.js <坏条JSON>'); process.exit(1); }

const bad = new Set(JSON.parse(fs.readFileSync(path.resolve(BAD), 'utf8')));
const lines = fs.readFileSync(SRC, 'utf8').split('\n').filter(Boolean);
const keep = [];
let removed = 0;
const seen = new Set();
for (const l of lines) {
  let o;
  try { o = JSON.parse(l); } catch (e) { continue; }
  if (bad.has(o.key)) { if (!seen.has(o.key)) { removed++; seen.add(o.key); } continue; }
  keep.push(l);
}
fs.writeFileSync(SRC, keep.join('\n') + (keep.length ? '\n' : ''), 'utf8');
console.log(`剔除 ${removed} 条，剩余 ${keep.length} 条`);
