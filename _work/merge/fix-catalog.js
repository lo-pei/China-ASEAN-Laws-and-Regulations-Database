/* ==========================================================================
   从 intl-catalog.js 中移除已归档（重复）的目录条目，并登记本轮去重留痕

   说明：fulltextKey 字段经实测在 App 代码中未被读取（prototype/assets 下 0 处引用），
        因此不能靠它指向保留项；正确做法是把重复条目的目录登记一并移除，
        并在 meta.mergeDedup 中留痕。
   cn-catalog.js 经实测无任何归档 id 引用，不修改。
   用法：node _work/merge/fix-catalog.js [--dry]
   ========================================================================== */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const DRY = process.argv.includes('--dry');

const archDir = path.join(ROOT, '_work', 'dedup-archive');
const arch = {};
fs.readdirSync(archDir).filter(f => f.endsWith('.json')).forEach(f => {
  const id = f.replace(/\.json$/, '');
  const j = JSON.parse(fs.readFileSync(path.join(archDir, f), 'utf8'));
  arch[id] = j.duplicateOf || null;
});
console.log('  归档法规 ' + Object.keys(arch).length + ' 部');

const FILE = 'intl-catalog.js';
const TOK = 'root.CALR_INTL_CATALOG = ';
const p = path.join(PD, FILE);
const src = fs.readFileSync(p, 'utf8');
const i = src.indexOf(TOK);
if (i < 0) { console.error('  ✗ 未找到 ' + TOK); process.exit(1); }
const bodyStart = i + TOK.length;
const bodyEnd = src.lastIndexOf('};');
console.log('  赋值位置 ' + i + '，对象区间 ' + bodyStart + ' … ' + bodyEnd + '（文件长 ' + src.length + '）');
if (src[bodyStart] !== '{' || src[bodyEnd] !== '}') {
  console.error('  ✗ 区间端点不是花括号：' + JSON.stringify(src[bodyStart]) + ' / ' + JSON.stringify(src[bodyEnd]));
  process.exit(1);
}
const header = src.slice(0, bodyStart);
const footer = src.slice(bodyEnd + 1);
const obj = JSON.parse(src.slice(bodyStart, bodyEnd + 1));

const before = (obj.laws || []).length;
const removed = (obj.laws || []).filter(l => arch[l.id]).map(l => l.id);
obj.laws = (obj.laws || []).filter(l => !arch[l.id]);
console.log('  laws ' + before + ' → ' + obj.laws.length + '（移除 ' + removed.length + '）');
if (removed.length) {
  obj.meta = obj.meta || {};
  obj.meta.mergeDedup = {
    date: new Date().toISOString().slice(0, 10),
    note: '两批数据合并时的去重留痕。同一部法内容完全相同的重复登记被移出目录；' +
          '保留项遵循「A 法域全文层优先 → 再按 id 字典序最小」，被移除者保留原 id 于 _work/dedup-archive/。',
    archivedCount: removed.length,
    archived: arch,
    generatedBy: '_work/merge/fix-catalog.js'
  };
  const out = header + JSON.stringify(obj, null, 1) + footer;
  if (!DRY) fs.writeFileSync(p, out, 'utf8');
  console.log('  ' + (src.length / 1048576).toFixed(1) + ' MB → ' + (out.length / 1048576).toFixed(1) + ' MB');
}

if (!DRY) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  try {
    vm.runInContext(fs.readFileSync(p, 'utf8'), c, { filename: FILE });
    const o = c.CALR_INTL_CATALOG;
    console.log('  ✓ ' + FILE + ' 载入正常：laws = ' + o.laws.length + '，meta.mergeDedup.archivedCount = ' + (o.meta.mergeDedup ? o.meta.mergeDedup.archivedCount : '—'));
    const stillRef = o.laws.filter(l => arch[l.id]).length;
    console.log('  ✓ 仍引用归档 id 的目录条目：' + stillRef + (stillRef === 0 ? '' : ' ✗'));
  } catch (e) { console.error('  ✗ 载入失败：' + e.message); process.exit(1); }
}
