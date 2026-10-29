#!/usr/bin/env node
/* CALR · 法规标题中译回执入库
   用法：
     node _work/title/ingest-titles.js <回执包目录> --job <任务包目录> [--dry] [--reviewed]
   行为：
     1. 先调用 tools/verify-title-return.js 校验（任何错误即中止，不写盘）
     2. 通过后把 zh 写入 prototype/data/laws/<id>.json 的 title.zh
     3. 同时写入 titleTranslation{engine,model,reviewed,batch,source}
   注意：
     · 只在 title.zh 为空时写入；已有中文标题的不覆盖（除非 --force）
     · 不触碰 articles / 分卷派生文件；写完后需重建分卷
*/
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return (v === undefined || v.startsWith('--')) ? true : v;
}
const RET = process.argv[2];
const JOB = arg('job', null);
const DRY = arg('dry', false) === true;
const FORCE = arg('force', false) === true;
const REVIEWED = arg('reviewed', false) === true;

if (!RET || !JOB) {
  console.error('用法: node _work/title/ingest-titles.js <回执包目录> --job <任务包目录> [--dry] [--force] [--reviewed]');
  process.exit(2);
}

const ROOT = process.cwd();
const LAWS = path.join(ROOT, 'prototype/data/laws');

/* ---------- 1) 先校验 ---------- */
console.log('--- 1) 校验回执包 ---');
try {
  const out = execFileSync(process.execPath, [path.join(ROOT, 'tools/verify-title-return.js'), RET, '--job', JOB],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  process.stdout.write(out);
} catch (e) {
  if (e.stdout) process.stdout.write(e.stdout);
  if (e.stderr) process.stderr.write(e.stderr);
  console.error('\n  ✗ 校验未通过，已中止入库（未写盘）');
  process.exit(1);
}

/* ---------- 2) 读取回执 ---------- */
const manifest = JSON.parse(fs.readFileSync(path.join(JOB, 'manifest.json'), 'utf8'));
const titles = JSON.parse(fs.readFileSync(path.join(JOB, 'titles.json'), 'utf8'));
const srcById = new Map(titles.map(x => [x.id, x.en]));

const retFiles = fs.readdirSync(RET).filter(f => /^titles\.\d{3}\.json$/.test(f)).sort();
const items = [];
for (const f of retFiles) {
  const j = JSON.parse(fs.readFileSync(path.join(RET, f), 'utf8'));
  (j.items || []).forEach(it => items.push(it));
}
let receipt = null;
try { receipt = JSON.parse(fs.readFileSync(path.join(RET, 'receipt.json'), 'utf8')); } catch (e) { /* 已校验过 */ }

/* ---------- 3) 写盘 ---------- */
console.log('--- 2) 写入 laws/ ---');
let written = 0, skipped = 0, kept = 0;
const byCountry = {};

for (const it of items) {
  const id = it.id;
  if (!srcById.has(id)) { skipped++; continue; }
  const p = path.join(LAWS, id + '.json');
  if (!fs.existsSync(p)) { skipped++; continue; }
  let o;
  try { o = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { skipped++; continue; }

  const t = o.title || {};
  if (t.zh && !FORCE) { kept++; continue; }

  t.zh = String(it.zh).trim();
  o.title = t;
  o.titleTranslation = {
    engine: (receipt && receipt.engine) || 'llm',
    model: (receipt && receipt.model) || null,
    reviewed: REVIEWED,
    batch: manifest.jobId,
    source: srcById.get(id) || null,
    note: '由翻译 agent 按《法规标题中译规范》产出，经 tools/verify-title-return.js 机器校验后入库；'
        + (REVIEWED ? '已人工复核。' : '尚未人工复核。')
  };

  if (!DRY) fs.writeFileSync(p, JSON.stringify(o, null, 1), 'utf8');
  written++;
  const c = o.country || '?';
  byCountry[c] = (byCountry[c] || 0) + 1;
}

console.log('  ' + (DRY ? '[dry] ' : '') + '写入/更新标题: ' + written + ' 条');
console.log('  已有中文标题（未覆盖）: ' + kept + ' 条');
console.log('  跳过（文件缺失/不在任务包）: ' + skipped + ' 条');
console.log('  按国别: ' + JSON.stringify(byCountry));

/* ---------- 4) 覆盖率 ---------- */
let tot = 0, zh = 0;
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  tot++;
  if ((o.title || {}).zh) zh++;
}
console.log('');
console.log('  全库中文标题覆盖: ' + zh + ' / ' + tot + ' = ' + (zh * 100 / tot).toFixed(1) + '%');

if (!DRY && written) {
  console.log('');
  console.log('  下一步（必须执行，否则页面读不到新标题）：');
  console.log('    node --max-old-space-size=8192 _work/merge/rebuild-index.js');
  console.log('    node --max-old-space-size=8192 _work/merge/build-packs.js');
  console.log('    node _work/verify.js && node tools/verify-data.js && node _work/verify-fulltext.js');
}
