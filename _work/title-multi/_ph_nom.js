// 「Providing for the <名词化> of X」→「<动词>ing X」归一化，复用 _ph_gen2 句框
const G = require('./_ph_gen2.js');
const NOM = {
  Establishment: 'Establishing', Construction: 'Constructing', Creation: 'Creating',
  Conversion: 'Converting', Separation: 'Separating', Reapportionment: 'Reapportioning',
  Modernization: 'Modernizing', Standardization: 'Standardizing', Adjustment: 'Adjusting',
  Acquisition: 'Acquiring', Regulation: 'Regulating', Reconstruction: 'Reconstructing',
  Incorporation: 'Incorporating', Importation: 'Importing', Election: 'Electing',
  Composition: 'Composing', Expropriation: 'Expropriating', Issuance: 'Issuing',
  Payment: 'Paying', Holding: 'Holding', Attachment: 'Attaching',
  Reorganization: 'Reorganizing', Conversion2: 'Converting', Abolition: 'Abolishing',
  Reversion: 'Reverting', Extension: 'Extending', Repeal: 'Repealing',
  Exemption: 'Exempting', Suspension: 'Suspending', Grant: 'Granting'
};
function nom(title) {
  const t = String(title).trim().replace(/^An?\s+Act\s+/i, '');
  const m = t.match(/^[Pp]rovid(?:ing|e)\s+[Ff]or\s+the\s+([A-Za-z]+)\s+of\s+([\s\S]+)$/);
  if (!m || !NOM[m[1]]) return null;
  return 'An Act ' + NOM[m[1]] + ' ' + m[2];
}
module.exports = { nom, NOM };

if (require.main === module) {
  const r = require('./_ph_rest.json');
  const outIdx = process.argv.indexOf('--out');
  if (outIdx > 0) {
    const G2 = G, fs = require('fs');
    const items = {};
    let n = 0;
    for (const x of r) {
      const c = nom(x.title.en);
      if (!c) continue;
      const p2 = G2.parse(c);
      if (!p2 || !p2.out) continue;
      items[x.id] = { vi: p2.out.vi, th: p2.out.th, id: p2.out.id, ms: p2.out.ms };
      n++;
    }
    fs.writeFileSync(process.argv[outIdx + 1], JSON.stringify({ items }, null, 1));
    console.log('已写出 ' + n + ' 条 → ' + process.argv[outIdx + 1]);
    return;
  }
  const ok = [], bad = [];
  for (const x of r) {
    const c = nom(x.title.en);
    if (!c) continue;
    const p = G.parse(c);
    if (p && p.out) ok.push({ id: x.id, cand: c, frame: p.frame, out: p.out });
    else bad.push({ id: x.id, cand: c, why: p && p.why });
  }
  console.log('命中', ok.length, '未命中', bad.length);
  const RESID = /(?<![A-Za-z\u00C0-\u024F])(in|at|of|the|and|for|with|to|from|by|on|into)(?![A-Za-z\u00C0-\u024F])/;
  const susp = [];
  for (const o of ok) for (const L of ['vi', 'th', 'id', 'ms']) {
    const s = o.out[L];
    // 剥掉专名后再看虚词与拉丁词
    const bare = s.replace(/[A-Z][A-Za-z.'&()\/\-\u00C0-\u024F]+(\s+[A-Z][A-Za-z.'&()\/\-\u00C0-\u024F]+)*/g, '');
    if (RESID.test(bare)) susp.push(o.id + ' ' + L + ' :: ' + s.slice(0, 170));
  }
  console.log('虚词残留', susp.length);
  susp.slice(0, 25).forEach((s) => console.log('  - ' + s));
  if (process.argv.includes('--dump')) require('fs').writeFileSync('_ph_nom_ok.json', JSON.stringify(ok, null, 1));
}
