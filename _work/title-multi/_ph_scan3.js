const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const rows = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.frame) continue;
  if (r.why !== 'noframe') continue;
  rows.push((x.title.en || '').replace(/\s+/g, ' ').trim());
}
console.log('noframe', rows.length);
const g = {};
for (const s of rows) {
  const w = s.split(/\s+/).slice(0, 3).join(' ').toLowerCase();
  g[w] = (g[w] || 0) + 1;
}
Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log(String(v).padStart(5), k));
