// 通用三路派发：gen2 → nom → fr，产出批次 JSON
// 用法：node _work/title-multi/_ph_all.js [--out <相对仓库根路径>] [--src _ph_rest.json] [--show N]
const fs = require('fs');
const path = require('path');
const G = require('./_ph_gen2.js');
const { nom } = require('./_ph_nom.js');
const FR = require('./_ph_fr.js');

const { crossScript, residue, pseudo, typo } = require('./_ph_qchk.js');
const LANGS = ['vi', 'th', 'id', 'ms'];
const ROOT = path.resolve(__dirname, '..', '..');

function gate(t, allow, en) {
  const why = [];
  for (const L of LANGS) {
    const s = t[L] || '';
    if (!s) { why.push(L + ':empty'); continue; }
    const w = crossScript(L, s) || residue(L, s, allow) || pseudo(L, s, allow, en) || typo(s);
    if (w) why.push(L + ':' + w);
  }
  return why;
}

function solve(en) {
  const p = G.parse(en);
  if (p && p.out) return { out: p.out, frame: p.frame, via: 'gen2' };
  const c = nom(en);
  if (c) {
    const p2 = G.parse(c);
    if (p2 && p2.out) return { out: p2.out, frame: p2.frame, via: 'nom' };
  }
  const r = FR.parse(en);
  if (r && r.out) return { out: r.out, frame: r.frame, via: 'fr' };
  return null;
}

function main() {
  const argv = process.argv.slice(2);
  const outIdx = argv.indexOf('--out');
  const si = argv.indexOf('--src');
  const srcRel = si >= 0 ? argv[si + 1] : '_work/title-multi/_ph_rest.json';
  const showIdx = argv.indexOf('--show');
  const src = JSON.parse(fs.readFileSync(path.join(ROOT, srcRel), 'utf8'));
  const items = {};
  const stat = {};
  const pushed = [];
  for (const x of src) {
    const en = ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
    if (!en) continue;
    const r = solve(en);
    if (!r) { stat['miss'] = (stat['miss'] || 0) + 1; continue; }
    const why = gate(r.out, null, en);
    if (why.length) { stat['gate:' + why[0].split(':')[1]] = (stat['gate:' + why[0].split(':')[1]] || 0) + 1; continue; }
    items[x.id] = { vi: r.out.vi, th: r.out.th, id: r.out.id, ms: r.out.ms };
    stat['ok:' + r.via + ':' + r.frame] = (stat['ok:' + r.via + ':' + r.frame] || 0) + 1;
    pushed.push({ id: x.id, en: en, out: r.out });
  }
  console.log('候选', src.length, '| 产出', Object.keys(items).length);
  Object.entries(stat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k.padEnd(28), v));
  const showN = showIdx >= 0 ? Number(argv[showIdx + 1]) : 0;
  if (showN) pushed.slice(0, showN).forEach((p) => {
    console.log('\n· ' + p.en);
    for (const L of LANGS) console.log('   ' + L + ': ' + p.out[L]);
  });
  if (outIdx >= 0) {
    const outPath = path.join(ROOT, argv[outIdx + 1]);
    fs.writeFileSync(outPath, JSON.stringify({ items }, null, 1), 'utf8');
    console.log('写出', argv[outIdx + 1]);
  }
}
if (require.main === module) main();
module.exports = { solve };
