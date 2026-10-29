/* 读取 dataset-core.js 中印尼法规元数据，输出 JSON 供生成器使用 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/dataset-core.js'), 'utf8'), ctx);
const core = ctx.window.CALR_DATA_CORE;
const ids = ['ID-INVEST-2007', 'ID-CIPTA-2020', 'ID-LABOR-2003', 'ID-COPYRIGHT-2014',
  'ID-PDP-2022', 'ID-COMPANY-2007', 'ID-ARBITRATION-1999'];
const out = {};
ids.forEach(id => {
  const l = core.laws.find(x => x.id === id);
  if (!l) return;
  out[id] = {
    country: l.country, level: l.level, status: l.status, topics: l.topics,
    title: l.title, docNumber: l.docNumber, issuingBody: l.issuingBody,
    promulgatedDate: l.promulgatedDate, effectiveDate: l.effectiveDate,
    repealedDate: l.repealedDate || null,
    source: l.source, summary: l.summary,
    coreArticles: (l.articles || []).map(a => ({ no: a.no, noLabel: a.noLabel, chapter: a.chapter }))
  };
});
fs.writeFileSync(path.join(ROOT, '_work/id/core_meta.json'), JSON.stringify(out, null, 1), 'utf8');
console.log(Object.keys(out).join(','));
