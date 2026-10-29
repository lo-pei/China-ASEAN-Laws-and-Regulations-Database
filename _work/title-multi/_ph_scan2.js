const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const rows = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.frame) continue;
  rows.push({ id: x.id, en: (x.title.en || '').replace(/\s+/g, ' ').trim(), why: r.why, zh: x.title.zh || '' });
}
console.log('未产出', rows.length);
const g = {};
for (const x of rows) g[x.why] = (g[x.why] || 0) + 1;
Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(String(v).padStart(5), k));
