// 按母法名 dump 剩余条目：id | 体裁 | 年 | 括注 | zh
const fs = require('fs'), path = require('path');
const DOCS = path.join(__dirname, '../../prototype/data/laws');
const { groups } = require('./_sg_tail.json');
const done = new Set();
for (const f of fs.readdirSync(DOCS).filter(f => f.startsWith('SG-') && f.endsWith('.json'))) {
  const t = JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8')).title || {};
  if (t.vi && t.th && t.id && t.ms) done.add(f.replace('.json', ''));
}
const want = process.argv.slice(2);
for (const [parent, arr] of Object.entries(groups)) {
  const hit = want.some(w => parent.toLowerCase() === w.toLowerCase() || parent.toLowerCase().startsWith(w.toLowerCase() + ' ') && w.split(' ').length > 1);
  if (!hit) continue;
  const rest = arr.filter(x => !done.has(x.id));
  if (!rest.length) continue;
  console.log('### ' + parent + ' (' + rest.length + ')');
  for (const x of rest) {
    console.log([x.id, x.p.genre, x.p.year || '', x.p.mods.join(' | ')].join('§'));
  }
}
