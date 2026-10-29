/* 校验：新分卷 vs 备份分卷 —— 逐法比对 App 读取的字段与全部条文正文 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const BK = path.join(ROOT, '_work', 'backup-pre-merge');

function loadAll(base) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  for (const dir of ['intl', 'cn', 'fulltext']) {
    const d = path.join(base, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
      try { vm.runInContext(fs.readFileSync(path.join(d, f), 'utf8'), c, { filename: dir + '/' + f }); } catch (e) { console.error('  载入失败 ' + dir + '/' + f + '：' + e.message); }
    }
  }
  return c.CALR_FULLTEXT || {};
}
console.log('  载入备份分卷 …');
const B = loadAll(BK);
console.log('  载入新分卷 …');
const N = loadAll(PD);

const bIds = new Set(Object.keys(B)), nIds = new Set(Object.keys(N));
const arch = new Set(fs.readdirSync(path.join(ROOT, '_work', 'dedup-archive')).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')));

console.log('');
console.log('=== 法规集合 ===');
console.log('  备份 ' + bIds.size + ' / 新 ' + nIds.size);
const missing = [...bIds].filter(x => !nIds.has(x));
const added = [...nIds].filter(x => !bIds.has(x));
console.log('  新缺失 ' + missing.length + '（应 = 归档数 ' + arch.size + '）');
const unexpected = missing.filter(x => !arch.has(x));
console.log('  非归档的意外缺失：' + unexpected.length + (unexpected.length ? ' → ' + unexpected.slice(0, 8).join(', ') : ' ✓'));
console.log('  新增：' + added.length + (added.length === 0 ? ' ✓' : ' → ' + added.slice(0, 8).join(', ')));

const flat = (t) => typeof t === 'string' ? t : (t && typeof t === 'object' ? Object.values(t).filter(Boolean).join('\n') : '');
let ok = 0, diff = 0;
const bad = [];
const FIELD = ['coverage', 'language', 'sourceName', 'sourceUrl', 'fetchedAt', 'completenessNote'];
const fieldDiff = {};
for (const id of bIds) {
  if (!nIds.has(id)) continue;
  const b = B[id], n = N[id];
  let isOk = true;
  for (const k of FIELD) {
    const bv = b[k] === undefined ? null : b[k];
    const nv = n[k] === undefined ? null : n[k];
    if (String(bv || '') !== String(nv || '')) { isOk = false; fieldDiff[k] = (fieldDiff[k] || 0) + 1; }
  }
  const ba = b.articles || [], na = n.articles || [];
  if (ba.length !== na.length) { isOk = false; fieldDiff['articleCount'] = (fieldDiff['articleCount'] || 0) + 1; }
  else {
    for (let i = 0; i < ba.length; i++) {
      if (String(ba[i].no) !== String(na[i].no)) { isOk = false; fieldDiff['article.no'] = (fieldDiff['article.no'] || 0) + 1; break; }
      if (flat(ba[i].text) !== flat(na[i].text)) { isOk = false; fieldDiff['article.text'] = (fieldDiff['article.text'] || 0) + 1; break; }
    }
  }
  if (isOk) ok++; else { diff++; if (bad.length < 8) bad.push(id); }
}
console.log('');
console.log('=== 逐法比对（App 读取字段 + 全部条文正文）===');
console.log('  一致     ' + ok);
console.log('  不一致   ' + diff + (diff === 0 ? '  ✓' : '  ✗'));
if (diff) {
  console.log('  差异字段分布 ' + JSON.stringify(fieldDiff));
  bad.forEach(id => {
    const b = B[id], n = N[id];
    console.log('  -- ' + id + '  备份 ' + (b.articles || []).length + ' 条 → 新 ' + (n.articles || []).length + ' 条');
    for (const k of FIELD) { const bv = b[k], nv = n[k]; if (String(bv || '') !== String(nv || '')) console.log('       ' + k + ': ' + JSON.stringify(bv).slice(0, 70) + ' → ' + JSON.stringify(nv).slice(0, 70)); }
    const ba = (b.articles || [])[0] || {}, na = (n.articles || [])[0] || {};
    if (flat(ba.text) !== flat(na.text)) {
      console.log('       第1条 备份: ' + JSON.stringify(flat(ba.text).slice(0, 90)));
      console.log('       第1条 新  : ' + JSON.stringify(flat(na.text).slice(0, 90)));
    }
  });
}

/* manifest 交叉检查 */
console.log('');
console.log('=== manifest 交叉检查 ===');
const im = (function () { const c = { window: {}, document: {} }; c.window = c; vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(PD, 'intl', 'manifest.js'), 'utf8'), c); return c.CALR_INTL_MANIFEST; })();
const fm = (function () { const c = { window: {}, document: {} }; c.window = c; vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(PD, 'fulltext', 'manifest.js'), 'utf8'), c); return c.CALR_FULLTEXT_MANIFEST; })();
const intlLaws = Object.keys(N).filter(id => /-H\d+/.test(id));
const ftLaws = Object.keys(N).filter(id => im.byLaw[id] === undefined);
console.log('  intl manifest byLaw ' + Object.keys(im.byLaw).length + '，指向不存在的法规 ' + Object.keys(im.byLaw).filter(x => !nIds.has(x)).length);
console.log('  fulltext manifest byLaw ' + Object.keys(fm.byLaw).length + '，指向不存在的法规 ' + Object.keys(fm.byLaw).filter(x => !nIds.has(x)).length);
console.log('  fulltext manifest 覆盖 ' + ftLaws.length + ' 部（应为 61）');
console.log('  intl manifest files ' + im.files.length + '，每个分卷的 laws 是否都存在于分卷内：');
let mErr = 0;
im.files.forEach(f => f.laws.forEach(id => { if (!N[id]) mErr++; }));
console.log('    缺失 ' + mErr + (mErr === 0 ? ' ✓' : ' ✗'));
