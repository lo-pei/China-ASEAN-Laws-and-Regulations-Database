/* 检查被归档的 63 个 id 是否仍被 catalog / manifest 引用 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const ARCH = path.join(ROOT, '_work', 'dedup-archive');

const arch = fs.readdirSync(ARCH).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
console.log('归档法规 ' + arch.length + ' 部');

/* manifest / catalog 源码里是否出现这些 id */
const targets = ['intl/manifest.js', 'fulltext/manifest.js', 'trans/manifest.js', 'intl-catalog.js', 'cn-catalog.js', 'dataset-core.js', 'dataset-extra.js'];
let totalHit = 0;
for (const t of targets) {
  const p = path.join(PD, t);
  if (!fs.existsSync(p)) { console.log('  (缺失) ' + t); continue; }
  const s = fs.readFileSync(p, 'utf8');
  const hit = arch.filter(id => s.includes('"' + id + '"') || s.includes("'" + id + "'"));
  totalHit += hit.length;
  console.log('  ' + t.padEnd(22) + hit.length + ' 处引用' + (hit.length ? '：' + hit.slice(0, 6).join(', ') : ''));
}
console.log('  合计引用 ' + totalHit + ' 处');

/* 另外：laws/ 与 catalog 的 id 覆盖关系 */
const lawIds = new Set(fs.readdirSync(path.join(PD, 'laws')).filter(f => f.endsWith('.json') && f !== 'index.json').map(f => f.replace(/\.json$/, '')));
function catIds(file, gname) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  try { vm.runInContext(fs.readFileSync(path.join(PD, file), 'utf8'), c, { filename: file }); } catch (e) { return new Set(); }
  const out = new Set();
  const walk = (o, d) => {
    if (!o || typeof o !== 'object' || d > 6) return;
    if (Array.isArray(o)) { o.forEach(x => walk(x, d + 1)); return; }
    if (typeof o.id === 'string' && o.id) out.add(o.id);
    for (const k in o) if (k !== 'id') walk(o[k], d + 1);
  };
  walk(c[gname], 0);
  return out;
}
const CI = catIds('intl-catalog.js', 'CALR_INTL_CATALOG');
const CC = catIds('cn-catalog.js', 'CALR_CN_CATALOG');
console.log('');
console.log('=== laws/ 与 catalog 的覆盖 ===');
console.log('  laws/         ' + lawIds.size);
console.log('  intl-catalog  ' + CI.size + '，cn-catalog ' + CC.size);
const catOnly = [...CI, ...CC].filter(x => !lawIds.has(x));
console.log('  仅目录有（无本地正文，coverage=catalog）: ' + new Set(catOnly).size);
const lawNotCat = [...lawIds].filter(x => !CI.has(x) && !CC.has(x));
console.log('  仅 laws/ 有、目录未登记: ' + lawNotCat.length);
const byC = {}; lawNotCat.forEach(x => { const k = x.slice(0, 2); byC[k] = (byC[k] || 0) + 1; });
console.log('    按国别 ' + JSON.stringify(byC));
