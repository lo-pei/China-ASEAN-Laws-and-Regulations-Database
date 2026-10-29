// PH 新语料族聚类：剥著录前缀 + 文号前缀，按「动作短语前 4 词」聚类
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));

const PRE = [
  /^MALACAN[AÑ]A?N?G?\s+(?:PMS\s+LIBRARY\s+)?(?:PALACE\s+)?BY\s+THE\s+PRESIDENT'?\s+OF\s+(?:TIE|THE|~?HILIPPINES|THE\s+~?HILIPPINES)\s*/i,
  /^MALACAN[AÑ]A?N?G?\s+(?:PMS\s+LIBRARY\s+)?(?:PALACE\s+)?/i,
  /^BY\s+THE\s+PRESIDENT'?\s+OF\s+(?:THE\s+)?~?HILIPPINES\s*/i,
  /^BATAS\s+PAMBANSA\s+(?:BLG\.?|BILANG)\s*\d+\s*/i,
  /^BATASANG\s+PAMBANSA\s+(?:BLG\.?|BILANG)\s*\d+\s*/i,
];
function strip(t) {
  let s = t.replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 3; i++) {
    let changed = false;
    for (const re of PRE) { const n = s.replace(re, ''); if (n !== s && n.trim()) { s = n; changed = true; } }
    if (!changed) break;
  }
  return s.trim();
}

const rows = src.map((x) => ({ id: x.id, en: ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim() }))
  .map((r) => ({ ...r, s: strip(r.en) }));

let stripped = 0;
for (const r of rows) if (r.s !== r.en) stripped++;
console.log('剥前缀后变化', stripped, '/', rows.length);
console.log('仍全大写', rows.filter((r) => r.s && r.s === r.s.toUpperCase() && /[A-Z]{4,}/.test(r.s)).length);

const m = new Map();
for (const r of rows) {
  const body = r.s.replace(/^(?:AN?\s+ACT|ACT)\s+/i, '').toLowerCase();
  const w = body.split(/[^a-z'\-]+/).filter(Boolean);
  const key = w.slice(0, 4).join(' ');
  if (!m.has(key)) m.set(key, []);
  m.get(key).push(r);
}
const arr = [...m.entries()].sort((a, b) => b[1].length - a[1].length);
console.log('\n族数', arr.length);
for (const [k, v] of arr.slice(0, 35)) {
  console.log(String(v.length).padStart(4), '|', k);
  console.log('     ', v[0].s.slice(0, 120));
}
let cum = 0;
for (const [, v] of arr.slice(0, 60)) cum += v.length;
console.log('\n前 60 族覆盖', cum);
