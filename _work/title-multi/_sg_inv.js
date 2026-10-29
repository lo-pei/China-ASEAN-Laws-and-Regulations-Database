// SG 剩余缺口按母法分组清单（按现状重算，不依赖快照）
const fs = require('fs'), path = require('path');
const DOCS = path.join(__dirname, '../../prototype/data/laws');
const { groups } = require('./_sg_tail.json');
const P0 = require('./_sg_parents.json');
const DICT = require('./_sg_dict.js');
const P = Object.assign({}, P0, DICT.parentExtra || {});

const done = new Set();
for (const f of fs.readdirSync(DOCS).filter(f => f.startsWith('SG-') && f.endsWith('.json'))) {
  const t = JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8')).title || {};
  if (t.vi && t.th && t.id && t.ms) done.add(f.replace('.json', ''));
}
const rows = [];
let noParent = 0, noDict = 0;
for (const [parent, arr] of Object.entries(groups)) {
  const rest = arr.filter(x => !done.has(x.id));
  if (!rest.length) continue;
  if (!P[parent]) noDict += rest.length; else noParent += rest.length;
  rows.push({ parent, n: rest.length, has: !!P[parent] });
}
rows.sort((a, b) => a.parent.localeCompare(b.parent));
console.log('余 ' + rows.reduce((s, r) => s + r.n, 0) + ' 条 / ' + rows.length + ' 组；无词典母法 ' + noDict + ' 条');
const from = process.argv[2] || 'E';
const sel = rows.filter(r => r.parent[0].toUpperCase() >= from.toUpperCase());
for (const r of sel) console.log((r.has ? '✓' : '✗') + ' ' + String(r.n).padStart(3) + '  ' + r.parent);
