/* 读取一批法规的 dataset-core 元数据，输出 JSON */
'use strict';
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const ids = process.argv.slice(2);
const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/dataset-core.js'), 'utf8'), ctx);
const core = ctx.window.CALR_DATA_CORE;
const out = {};
ids.forEach(id => {
  const l = core.laws.find(x => x.id === id);
  if (!l) { console.log('NOT FOUND ' + id); return; }
  out[id] = {
    country: l.country, level: l.level, status: l.status, topics: l.topics,
    title: l.title, docNumber: l.docNumber, issuingBody: l.issuingBody,
    promulgatedDate: l.promulgatedDate, effectiveDate: l.effectiveDate,
    repealedDate: l.repealedDate || null
  };
});
fs.writeFileSync(path.join(ROOT, '_work/id/core_meta2.json'), JSON.stringify(out, null, 1), 'utf8');
console.log(JSON.stringify(out, null, 1));
