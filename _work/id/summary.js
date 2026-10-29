/* 汇总 id.js 的最终交付统计 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/fulltext/id.js'), 'utf8'), ctx);
const FT = ctx.window.CALR_FULLTEXT;
const META = ctx.window.CALR_FULLTEXT_META || {};
const rows = [];
let total = 0, chars = 0, fill = 0;
Object.keys(FT).forEach(id => {
  const e = FT[id];
  const n = e.articles.length;
  total += n;
  chars += e.articles.reduce((s, a) => s + a.text.id.length, 0);
  const pdf = e.articles.filter(a => /\.pdf/.test(a.sourceUrl || '')).length;
  fill += pdf;
  rows.push([id, n, pdf, e.sourceUrl, (e.articles[0].noLabel.id + '–' + e.articles[n - 1].noLabel.id)].join(' | '));
});
console.log(rows.join('\n'));
console.log('合计 ' + Object.keys(FT).length + ' 部 / ' + total + ' 条 / ' + chars + ' 字符；其中自官方 PDF 补录 ' + fill + ' 条');
console.log('新登记元数据: ' + Object.keys(META).join(', '));
