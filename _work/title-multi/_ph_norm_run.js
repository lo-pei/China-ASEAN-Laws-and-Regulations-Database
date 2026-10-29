// 只处理被规范化过前缀的子集，跑完整闸门，产出候选批次。
// 用法：node _work/title-multi/_ph_norm_run.js [--out <相对仓库根>] [--show N]
const fs = require('fs');
const path = require('path');
const { solve } = require('./_ph_all.js');
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

const argv = process.argv.slice(2);
const outIdx = argv.indexOf('--out');
const showN = argv.includes('--show') ? Number(argv[argv.indexOf('--show') + 1]) : 0;

const src = JSON.parse(fs.readFileSync(path.join(__dirname, '_ph_norm_src.json'), 'utf8'))
  .filter((x) => x._normFlags && x._normFlags.length);

const items = {};
const rej = [];
const stat = {};
const shown = [];
for (const x of src) {
  const en = x.title.en;
  const r = solve(en);
  if (!r) { rej.push({ id: x.id, why: 'noparse', en }); continue; }
  const why = gate(r.out, null, en);
  if (why.length) { rej.push({ id: x.id, why: why.join(','), en }); stat['gate'] = (stat['gate'] || 0) + 1; continue; }
  items[x.id] = { vi: r.out.vi, th: r.out.th, id: r.out.id, ms: r.out.ms };
  stat['ok:' + r.via + ':' + r.frame] = (stat['ok:' + r.via + ':' + r.frame] || 0) + 1;
  shown.push({ id: x.id, orig: x._enOrig, en, out: r.out });
}
console.log('子集', src.length, '| 通过闸门', Object.keys(items).length, '| 拒收', rej.length);
Object.entries(stat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k.padEnd(30), v));

if (showN) shown.slice(0, showN).forEach((p) => {
  console.log('\n· 原：' + (p.orig || '').slice(0, 110));
  console.log('  规：' + p.en.slice(0, 110));
  for (const L of LANGS) console.log('  ' + L + ': ' + p.out[L]);
});

if (outIdx >= 0) {
  fs.writeFileSync(path.join(ROOT, argv[outIdx + 1]), JSON.stringify({ items }, null, 1), 'utf8');
  console.log('写出', argv[outIdx + 1]);
}
fs.writeFileSync(path.join(__dirname, '_ph_norm_rej.json'), JSON.stringify(rej, null, 0), 'utf8');
