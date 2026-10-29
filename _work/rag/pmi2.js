const fs = require('fs'), path = require('path'), vm = require('vm');
const PROTO = path.join(process.cwd(), 'prototype');
const LAWS = path.join(PROTO, 'data/laws'), TRANS = path.join(PROTO, 'data/trans');
const CJK = /[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g;

function tokStrict(text) {
  if (!text) return [];
  const s = String(text).toLowerCase(), out = [];
  const cjk = s.match(CJK);
  if (cjk) for (let i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
  const latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
  for (const w of latin) if (w && w.length > 1) out.push(w);
  return out;
}
const STOP_EN = new Set(('the and or of to in for by with as on at from that this which shall may must any all such other ' +
  'be is are was were has have had not no if then than under into its it their his her they them we our you your ' +
  'provided accordance section article paragraph act law regulation rule order case person persons where there ' +
  'been being doing made make within without upon during before after').split(' '));
const STOP_ZH = new Set(['的','了','是','在','和','与','及','或','对','我','有','本条','本法','规定','应当','可以','不得','以及','其他','以下','关于','根据','按照']);

const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
for (const f of fs.readdirSync(TRANS).filter(x => x.endsWith('.js'))) {
  try { vm.runInContext(fs.readFileSync(path.join(TRANS, f), 'utf8'), sb, { filename: f }); } catch (e) {}
}
const T = sb.CALR_TRANS || {};

const coMap = new Map(), dfZh = new Map(), dfEn = new Map();
let pairs = 0, paired = 0;

for (const lawId of Object.keys(T)) {
  const tr = T[lawId], trArts = (tr && tr.articles) || [];
  if (!trArts.length) continue;
  let law = null;
  try { law = JSON.parse(fs.readFileSync(path.join(LAWS, lawId + '.json'), 'utf8')); } catch (e) { continue; }
  const byNo = new Map();
  for (const a of (law.articles || [])) byNo.set(String(a.no), a);
  for (const ta of trArts) {
    const src = byNo.get(String(ta.no));
    if (!src) continue;
    const zhText = src.text && (src.text.zh || Object.values(src.text).filter(Boolean)[0]);
    const enText = (ta.text && typeof ta.text === 'object') ? (ta.text[tr.targetLang] || ta.text.en || '') : ta.text;
    if (!zhText || !enText) continue;
    const zhToks = [...new Set(tokStrict(zhText).filter(t => t.length === 2 && /[\u3400-\u9fff]/.test(t) && !STOP_ZH.has(t)))];
    const enToks = [...new Set(tokStrict(enText).filter(t => /^[a-z]+$/.test(t) && t.length > 3 && !STOP_EN.has(t)))];
    if (!zhToks.length || !enToks.length) continue;
    paired++; pairs++;
    for (const z of zhToks) {
      dfZh.set(z, (dfZh.get(z) || 0) + 1);
      for (const e of enToks) { const k = z + '|' + e; coMap.set(k, (coMap.get(k) || 0) + 1); }
    }
    for (const e of enToks) dfEn.set(e, (dfEn.get(e) || 0) + 1);
  }
}
console.log('  配对成功 ' + paired + ' 组；中文词 ' + dfZh.size + '；英文词 ' + dfEn.size);

const all = [];
for (const [k, c] of coMap.entries()) {
  const [z, e] = k.split('|');
  const dz = dfZh.get(z) || 1, de = dfEn.get(e) || 1;
  const pmi = Math.log((c / pairs) / ((dz / pairs) * (de / pairs)));
  all.push({ z, e, c, pmi: +pmi.toFixed(2) });
}
all.sort((a, b) => b.c - a.c);
console.log('  共现组合 ' + all.length);
console.log('  PMI 分布 min=' + Math.min.apply(null, all.map(x => x.pmi)).toFixed(2) +
            '  max=' + Math.max.apply(null, all.map(x => x.pmi)).toFixed(2));
[0.5, 1, 1.5, 2, 3, 4].forEach(t => {
  console.log('    PMI>= ' + t + ' : ' + all.filter(x => x.pmi >= t).length + ' 对');
});
console.log('');
console.log('  共现最多的 15 对:');
all.slice(0, 15).forEach(x => console.log('    ' + x.z + ' ↔ ' + x.e + '  c=' + x.c + ' pmi=' + x.pmi));
const hi = all.filter(x => x.pmi >= 1.2 && x.c >= 5).sort((a, b) => b.pmi - a.pmi);
console.log('');
console.log('  PMI>=1.2 且 c>=5 的最高 15 对:');
hi.slice(0, 15).forEach(x => console.log('    ' + x.z + ' ↔ ' + x.e + '  c=' + x.c + ' pmi=' + x.pmi));
