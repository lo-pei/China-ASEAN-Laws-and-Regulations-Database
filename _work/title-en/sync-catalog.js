// 同步英文标题到目录层 prototype/data/cn-catalog.js（新增 titleEn 字段）
// 权威来源：prototype/data/laws/<id>.json 的 title.en
// 用法：node _work/title-en/sync-catalog.js [--dry]
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const LAWS = path.join(PD, 'laws');
const DRY = process.argv.includes('--dry');

const sb = { window: {} }; sb.window = sb; sb.self = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(PD, 'cn-catalog.js'), 'utf8'), sb, { filename: 'cn-catalog.js' });
const CN = sb.CALR_CN_CATALOG;
if (!CN || !Array.isArray(CN.laws)) { console.error('cn-catalog.js 结构异常'); process.exit(1); }

// 读权威存储里的英文标题
const en = {};
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  if (o.country === 'CN' && o.title && typeof o.title === 'object' && o.title.en) en[o.id] = o.title.en;
}

let added = 0, kept = 0, noEn = [];
CN.laws.forEach(function (c) {
  if (en[c.id]) {
    if (c.titleEn !== en[c.id]) { c.titleEn = en[c.id]; added++; } else kept++;
  } else if (!c.titleEn) {
    noEn.push(c.id);
  }
});

console.log('  目录条目: ' + CN.laws.length + '  写入/更新 titleEn: ' + added + '  已是新值: ' + kept);
if (noEn.length) console.log('  无英文标题的条目: ' + noEn.length + '（' + noEn.slice(0, 5).join(', ') + '）');

if (DRY) { console.log('  （--dry 试运行，未写盘）'); process.exit(0); }

CN.meta.titleEnSyncedAt = new Date().toISOString().slice(0, 10);
const json = JSON.stringify(CN);
const html = '/* ==========================================================================\n' +
  '   CALR · cn-catalog.js（由 _work/backend/fix-catalogs.js 从 prototype/data/laws/ 校正生成，请勿手工编辑）\n' +
  '   ========================================================================== */\n' +
  '(function (root) {\n' +
  "  'use strict';\n" +
  '  root.CALR_CN_CATALOG = ' + json + ';\n' +
  '})(typeof window !== "undefined" ? window : this);\n';
fs.writeFileSync(path.join(PD, 'cn-catalog.js'), html, 'utf8');
console.log('  ✓ 写出 cn-catalog.js (' + (Buffer.byteLength(html) / 1048576).toFixed(1) + ' MB)');
