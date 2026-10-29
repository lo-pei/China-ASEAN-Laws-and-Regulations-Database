// 查清：两个 catalog 的字段集 + store.js 如何消费它们
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.cwd();

function load(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: rel });
  return sb;
}

const c = load('prototype/data/cn-catalog.js');
const C = c.CALR_CN_CATALOG || {};
console.log('=== CALR_CN_CATALOG ===');
console.log('  顶层键: ' + Object.keys(C).join(', '));
console.log('  meta: ' + JSON.stringify(C.meta || {}).slice(0, 300));
console.log('  packs: ' + JSON.stringify(C.packs || {}).slice(0, 300));
const cl = C.laws || [];
console.log('  laws: ' + cl.length);
const cnFields = {};
cl.forEach(x => Object.keys(x).forEach(k => cnFields[k] = (cnFields[k] || 0) + 1));
console.log('  字段出现次数:');
Object.entries(cnFields).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('    ' + k.padEnd(18) + v));

const i = load('prototype/data/intl-catalog.js');
const I = i.CALR_INTL_CATALOG || {};
console.log('');
console.log('=== CALR_INTL_CATALOG ===');
console.log('  顶层键: ' + Object.keys(I).join(', '));
console.log('  meta: ' + JSON.stringify(I.meta || {}).slice(0, 300));
const il = I.laws || [];
console.log('  laws: ' + il.length);
const inFields = {};
il.forEach(x => Object.keys(x).forEach(k => inFields[k] = (inFields[k] || 0) + 1));
console.log('  字段出现次数:');
Object.entries(inFields).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('    ' + k.padEnd(18) + v));

// store.js merge() 如何读
console.log('');
console.log('=== store.js merge() 对 catalog 的处理 ===');
const st = fs.readFileSync(path.join(ROOT, 'prototype/assets/js/core/store.js'), 'utf8').split('\n');
let inMerge = false;
for (let j = 0; j < st.length; j++) {
  const ln = st[j];
  if (/function merge\s*\(/.test(ln)) inMerge = true;
  if (inMerge && /CALR_CN_CATALOG|CALR_INTL_CATALOG|cnCatalog|intlCatalog|\.laws\b/.test(ln)) {
    console.log('  L' + (j + 1) + ': ' + ln.trim().slice(0, 130));
  }
  if (inMerge && /^\s{2}\}/.test(ln) && j > 5) { inMerge = false; }
}
