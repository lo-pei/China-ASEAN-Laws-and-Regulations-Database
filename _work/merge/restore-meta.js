/* ==========================================================================
   补回 CALR_FULLTEXT_META（App 兼容字段）
   背景：分卷里的 root.CALR_FULLTEXT_META['ID'] = {…} 是 A/B 层法规的元数据
        （含 summary、双语 title、topics、issuingBody 等），store.js 依赖它构建基础条目。
        build-packs.js 首版只写 CALR_FULLTEXT，导致 verify-fulltext.js FAILED=32。
   做法：
     1) 从备份分卷中取出全部 1,580 个 META 对象（VM 载入，SOURCE 等常量自动解析）；
     2) 原样存入 laws/<ID>.json 的 fulltextMeta 字段（保证分卷可逐字重建）；
     3) 同时把 META 中缺失的顶层字段并入 records（title/level/status/topics/…/summary）。
   用法：node _work/merge/restore-meta.js [--dry]
   ========================================================================== */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const BK = path.join(ROOT, '_work', 'backup-pre-merge');
const DRY = process.argv.includes('--dry');

/* ---- 1. 采集全部 META ---- */
const META = {};
for (const dir of ['intl', 'cn', 'fulltext']) {
  const d = path.join(BK, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
    const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
    try { vm.runInContext(fs.readFileSync(path.join(d, f), 'utf8'), c, { filename: dir + '/' + f }); }
    catch (e) { console.error('  ✗ ' + dir + '/' + f + '：' + e.message); continue; }
    const m = c.CALR_FULLTEXT_META || {};
    for (const id of Object.keys(m)) META[id] = m[id];
  }
}
console.log('  采集到 CALR_FULLTEXT_META ' + Object.keys(META).length + ' 条');

/* ---- 2. 并入 laws/*.json ---- */
const OUT = path.join(PD, 'laws');
const put = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length);
let touched = 0, added = {}, missing = [];
for (const id of Object.keys(META)) {
  const p = path.join(OUT, id + '.json');
  if (!fs.existsSync(p)) { missing.push(id); continue; }
  const rec = JSON.parse(fs.readFileSync(p, 'utf8'));
  rec.fulltextMeta = META[id];
  /* 并入顶层字段（不覆盖已有值） */
  const map = {
    country: 'country', level: 'level', status: 'status', topics: 'topics',
    docNumber: 'docNumber', promulgatedDate: 'promulgatedDate',
    effectiveDate: 'effectiveDate', coverage: 'coverage', summary: 'summary'
  };
  for (const k of Object.keys(map)) {
    const v = META[id][k];
    if (put(v)) {
      const cur = rec[map[k]];
      if (!put(cur)) { rec[map[k]] = v; added[k] = (added[k] || 0) + 1; }
      else if (k === 'topics' && Array.isArray(v) && Array.isArray(cur) && !cur.length) { rec.topics = v; added[k] = (added[k] || 0) + 1; }
    }
  }
  /* title：按语种补齐 */
  const mt = META[id].title;
  if (mt && typeof mt === 'object') {
    rec.title = rec.title || { zh: null, en: null, orig: null };
    for (const k of Object.keys(mt)) if (put(mt[k]) && !put(rec.title[k])) { rec.title[k] = mt[k]; added['title.' + k] = (added['title.' + k] || 0) + 1; }
  }
  /* issuingBody：META 可能为双语对象，原样保留于 fulltextMeta；顶层保持字符串 */
  if (!put(rec.issuingBody) && META[id].issuingBody) {
    const ib = META[id].issuingBody;
    const sv = typeof ib === 'string' ? ib : (ib.zh || ib.en || Object.values(ib)[0]);
    if (put(sv)) { rec.issuingBody = sv; added['issuingBody'] = (added['issuingBody'] || 0) + 1; }
  }
  /* source：META 的 source 可能带真实 URL，补齐空值 */
  if (META[id].source && typeof META[id].source === 'object') {
    rec.source = rec.source || { name: null, url: null };
    if (!put(rec.source.name) && put(META[id].source.name)) { rec.source.name = META[id].source.name; added['source.name'] = (added['source.name'] || 0) + 1; }
    if (!put(rec.source.url) && put(META[id].source.url)) { rec.source.url = META[id].source.url; added['source.url'] = (added['source.url'] || 0) + 1; }
  }
  if (!DRY) fs.writeFileSync(p, JSON.stringify(rec, null, 1), 'utf8');
  touched++;
}
console.log('  已并入 ' + touched + ' 部记录');
console.log('  补入顶层字段统计：' + JSON.stringify(added));
console.log('  META 存在但 laws/ 无此文件：' + missing.length + (missing.length ? ' → ' + missing.slice(0, 8).join(', ') : ' ✓'));
