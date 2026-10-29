#!/usr/bin/env node
/* CALR · 把 prototype/data/laws/ 的标题同步到各「目录表」JS 数据文件
   背景：标题译名入库时只写了 laws/<id>.json 的 title.zh，
         而界面列表读的是 intl-catalog / cn-catalog / dataset-core 里的 title，
         两边不同步 → 译名存在但界面仍显示外文。
   做法：递归遍历目标对象的每个节点，凡是「有 id 且有 title」的对象，
         用 laws/<id>.json 的 title 补全（zh 优先，en 仅在空时补）。
   用法：node _work/merge/sync-catalog-titles.js [--dry]
*/
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'prototype/data');
const LAWS = path.join(DATA, 'laws');
const DRY = process.argv.indexOf('--dry') >= 0;

/* ---------- 1) 建 id → title 映射 ---------- */
const lawTitle = new Map();
let lawFiles = 0;
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  lawFiles++;
  if (o.id && o.title) lawTitle.set(o.id, o.title);
}
console.log('  laws/ 载入 ' + lawFiles + ' 部，含标题 ' + lawTitle.size + ' 部');

/* ---------- 2) 目标文件 ---------- */
const TARGETS = [
  { file: 'intl-catalog.js', var: 'CALR_INTL_CATALOG' },
  { file: 'cn-catalog.js', var: 'CALR_CN_CATALOG' },
  { file: 'dataset-core.js', var: 'CALR_DATASET' },
  { file: 'dataset-extra.js', var: 'CALR_DATASET_EXTRA' },
];

function loadJs(p) {
  const c = { window: {}, document: {} };
  c.window = c; c.globalThis = c;
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(p, 'utf8'), c, { filename: p });
  return c;
}

let grandZh = 0, grandEn = 0, grandNodes = 0, touchedFiles = 0;

for (const t of TARGETS) {
  const p = path.join(DATA, t.file);
  if (!fs.existsSync(p)) { console.log('  - ' + t.file + ' 不存在，跳过'); continue; }
  const c = loadJs(p);
  /* 找到挂载的对象：优先约定变量名，否则取第一个 CALR_* 对象 */
  let root = c[t.var];
  if (!root || typeof root !== 'object') {
    const k = Object.keys(c).find(k => /^CALR_/.test(k) && c[k] && typeof c[k] === 'object');
    if (!k) { console.log('  ! ' + t.file + ' 未找到 CALR_* 对象，跳过'); continue; }
    root = c[k];
    t.var = k;
  }

  let zhFill = 0, enFill = 0, nodes = 0;

  (function walk(node, depth) {
    if (!node || typeof node !== 'object' || depth > 8) return;
    if (Array.isArray(node)) { node.forEach(x => walk(x, depth + 1)); return; }
    if (typeof node.id === 'string' && node.title && typeof node.title === 'object') {
      nodes++;
      const src = lawTitle.get(node.id);
      if (src) {
        if (src.zh && !node.title.zh) { node.title.zh = src.zh; zhFill++; }
        if (src.en && !node.title.en) { node.title.en = src.en; enFill++; }
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'title') continue;
      const v = node[k];
      if (v && typeof v === 'object') walk(v, depth + 1);
    }
  })(root, 0);

  console.log('  ' + t.file.padEnd(20) + ' 节点 ' + String(nodes).padStart(6) +
    '  补 zh ' + String(zhFill).padStart(6) + '  补 en ' + String(enFill).padStart(5));

  if ((zhFill || enFill) && !DRY) {
    const head = '/* CALR · ' + t.file.replace('.js', '') + '（由 _work/merge/sync-catalog-titles.js 从 laws/ 同步标题后的快照） */\n';
    fs.writeFileSync(p, head + 'window.' + t.var + ' = ' + JSON.stringify(root) + ';\n', 'utf8');
    touchedFiles++;
  }
  grandZh += zhFill; grandEn += enFill; grandNodes += nodes;
}

console.log('');
console.log('  ' + (DRY ? '[dry] ' : '') + '合计：节点 ' + grandNodes + '，补中文标题 ' + grandZh +
  '，补英文标题 ' + grandEn + '，重写文件 ' + touchedFiles + ' 个');
