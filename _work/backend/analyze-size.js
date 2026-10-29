// 分析 intl-catalog 体积构成 + 检查 harvest/trace 等字段是否真被 App 使用
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.cwd();
const PD = path.join(ROOT, 'prototype/data');

const src = fs.readFileSync(path.join(PD, 'intl-catalog.js'), 'utf8');
console.log('  intl-catalog.js 磁盘大小: ' + (Buffer.byteLength(src) / 1048576).toFixed(2) + ' MB');

const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'intl-catalog.js' });
const I = sb.CALR_INTL_CATALOG || { laws: [] };
const laws = I.laws || [];
console.log('  条目: ' + laws.length);

// 各字段总字节
const fieldBytes = {};
const fieldCount = {};
for (const o of laws) {
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v === null || v === undefined) continue;
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    fieldBytes[k] = (fieldBytes[k] || 0) + s.length;
    fieldCount[k] = (fieldCount[k] || 0) + 1;
  }
}
const total = Object.values(fieldBytes).reduce((a, b) => a + b, 0);
console.log('  字段总字节: ' + (total / 1048576).toFixed(2) + ' MB');
console.log('  %-20s %10s %8s %8s', '字段', 'KB', '占比', '条目数');
Object.entries(fieldBytes).sort((a, b) => b[1] - a[1]).slice(0, 18).forEach(([k, v]) => {
  console.log('  ' + k.padEnd(20) + String((v / 1024).toFixed(0)).padStart(10) +
    String((v * 100 / total).toFixed(1) + '%').padStart(8) + String(fieldCount[k] || 0).padStart(8));
});

// 检查 App 是否用到这些字段
console.log('');
console.log('  === App 代码中对这些字段的引用次数 ===');
const assetsDir = path.join(ROOT, 'prototype/assets');
let all = '';
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.js')) all += fs.readFileSync(p, 'utf8');
  }
}
walk(assetsDir);
for (const k of ['harvest', 'trace', 'completeness', 'titleNote', 'promulgatedDateRaw',
  'promulgatedDatePrecision', 'traceSuperseded', 'titleRaw', 'titleFixed', 'fulltextKey', 'textQuality']) {
  const re = new RegExp('\\.' + k + '\\b', 'g');
  const n = (all.match(re) || []).length;
  console.log('    .' + k.padEnd(24) + n + ' 次');
}
