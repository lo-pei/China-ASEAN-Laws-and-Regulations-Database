// SG 尾段：把剩余缺口拆成「母法 / 附注事项 / 体裁 / 年份」四段，按母法分组
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../../prototype/data/laws');
const P = require('./_sg_parents.json');

const GENRES = ['Regulations', 'Regulation', 'Rules', 'Rule', 'Orders', 'Order',
  'Notifications', 'Notification', 'By-laws', 'Bye-laws', 'Scheme', 'Directions', 'Direction', 'Act'];

function parse(en) {
  let s = String(en || '').replace(/\u00AD/g, '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  // 尾巴上的年份
  let year = null;
  const ym = s.match(/[,\s]+((?:1[5-9]|20)\d{2})\s*$/);
  if (ym) { year = ym[1]; s = s.slice(0, ym.index).trim(); }

  // 尾巴上的体裁词（允许前面有逗号）
  let genre = null;
  for (const g of GENRES) {
    const re = new RegExp('[,\\s]+' + g.replace(/[-/]/g, '\\$&') + '$', 'i');
    const m = s.match(re);
    if (m) { genre = g; s = s.slice(0, m.index).trim(); break; }
  }
  if (!genre) return null;

  // 依次剥掉尾部括号（可能多层，括号内允许一层嵌套）
  const mods = [];
  for (;;) {
    const m = s.match(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)$/);
    if (!m) break;
    mods.unshift(m[1].trim());
    s = s.slice(0, m.index).trim();
  }
  if (!mods.length) return null;
  if (!s) return null;
  return { parent: s, mods, genre, year };
}

function main() {
  const gap = [];
  for (const f of fs.readdirSync(DIR).filter(f => f.startsWith('SG-'))) {
    const t = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).title || {};
    if (!(t.vi && t.th && t.id && t.ms)) gap.push({ id: f.replace('.json', ''), t });
  }

  const groups = {};
  const unparsed = [];
  for (const g of gap) {
    const p = parse(g.t.en);
    if (!p) { unparsed.push(g); continue; }
    (groups[p.parent] = groups[p.parent] || []).push({ id: g.id, t: g.t, p });
  }

  const ord = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  const inDict = ord.filter(([k]) => P[k]);
  console.log('gap', gap.length, 'parsed', gap.length - unparsed.length, 'unparsed', unparsed.length, 'groups', ord.length);
  console.log('parent in dict', inDict.length, 'covering', inDict.reduce((s, e) => s + e[1].length, 0));
  console.log('--- top groups');
  ord.slice(0, 20).forEach(([k, v]) => console.log('  ' + v.length + '  ' + k + (P[k] ? '  ✓' : '')));

  if (process.argv[2] === '--dump') {
    fs.writeFileSync(path.join(__dirname, '_sg_tail.json'), JSON.stringify({ groups, unparsed: unparsed.map(u => ({ id: u.id, zh: u.t.zh, en: u.t.en })) }, null, 1), 'utf8');
    console.log('dumped _sg_tail.json');
  }
  if (process.argv[2] === '--unparsed') {
    unparsed.slice(0, 60).forEach(u => console.log('·', u.id, '|', u.t.zh, '|', (u.t.en || '').slice(0, 100)));
  }
}

main();
module.exports = { parse };
