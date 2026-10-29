/* 生成外发退回清单：把校验退回的条目按母版还原成可再次外发的 JSONL */
'use strict';
const fs = require('fs');
const path = require('path');

const MASTER = path.join(__dirname, '_ext_master.json');
const ERRS = path.join(__dirname, '_ext_errs.tsv');
const OUT = 'C:/Users/lenovo/OneDrive/Desktop/退回待重译_20261029';
const master = JSON.parse(fs.readFileSync(MASTER, 'utf8')).idx;

const rows = fs.readFileSync(ERRS, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'));
const seen = new Set();
const out = [];
const reasons = [];
for (const [file, key, why] of rows) {
  if (seen.has(key)) continue;
  seen.add(key);
  const m = master[key];
  if (!m) continue;
  const rec = { key, co: m.co, src: m.src, lang: m.lang, need: m.need };
  if (m.dn) rec.dn = m.dn;
  out.push(rec);
  reasons.push('| `' + key + '` | ' + m.co + ' | ' + why + ' |');
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, '01-退回清单.jsonl'), out.map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf8');

const md = ['# 退回待重译（' + out.length + ' 条）', '',
  '生成时间：' + new Date().toISOString().slice(0, 19).replace('T', ' '), '',
  '这些条目在入库校验中被退回，其余 501 条已入库。格式同上一轮，仍需 `key` + `need` 里的语种键。', '',
  '## 逐条原因', '', '| key | 国别 | 退回原因 |', '|---|---|---|', ...reasons, ''].join('\n');
fs.writeFileSync(path.join(OUT, '02-退回原因.md'), md, 'utf8');
console.log('退回 ' + out.length + ' 条 → ' + OUT);
