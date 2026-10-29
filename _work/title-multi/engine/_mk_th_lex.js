/* 由 _th_rows.js（按 ID）生成 lexicon-th-addN.json（按原文主题为键） */
const fs = require('fs'), path = require('path');
const ENG = __dirname;
const need = JSON.parse(fs.readFileSync(path.join(ENG, '_th_need.json'), 'utf8'));
const rows = require('./_th_rows.js');

const byId = {};
for (const [id, zh, en, vi, id_, ms] of rows) {
  for (const L of ['zh', 'en', 'vi', 'id', 'ms']) void 0;
  byId[id] = { zh, en, vi, id: id_, ms };
}

const subjects = {};
const miss = [], dup = [];
for (const n of need) {
  const tr = byId[n.id];
  if (!tr) { miss.push(n.id + ' | ' + n.subj); continue; }
  for (const L of ['zh', 'en', 'vi', 'id', 'ms']) {
    if (!String(tr[L] || '').trim()) throw new Error('缺译 ' + n.id + '/' + L);
  }
  if (subjects[n.subj]) {
    const a = JSON.stringify(subjects[n.subj]), b = JSON.stringify(tr);
    if (a !== b) dup.push(n.id + ' | ' + n.subj);
    continue;
  }
  subjects[n.subj] = tr;
}
const extra = rows.filter(r => !need.some(n => n.id === r[0]));

console.log('主题条目', Object.keys(subjects).length, '| 未映射', miss.length, '| 同键异译', dup.length, '| 多余行', extra.length);
miss.forEach(x => console.log('  M', x));
dup.forEach(x => console.log('  D', x));

const keys = Object.keys(subjects);
const CHUNK = 56;
let n = 2;
for (let i = 0; i < keys.length; i += CHUNK) {
  const part = {};
  for (const k of keys.slice(i, i + CHUNK)) part[k] = subjects[k];
  const p = path.join(ENG, 'lexicon-th-add' + n + '.json');
  fs.writeFileSync(p, JSON.stringify({ _note: 'TH 主题增补（' + (i + 1) + '–' + Math.min(i + CHUNK, keys.length) + '）', subjects: part }, null, 1), 'utf8');
  console.log('写出', path.basename(p), Object.keys(part).length, '条');
  n++;
}
