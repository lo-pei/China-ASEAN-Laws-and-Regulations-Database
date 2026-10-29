const { parse, thingLoc, thing4, peelTails } = require('./_ph_gen2.js');
const LX = require('./_ph_lex.js');
const list = require('./_ph_rest.json');
const rows = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== 'slot-establish') continue;
  let s = (x.title.en || '').replace(/\s+/g, ' ').trim();
  const lead = s.match(/^(?:An?\s+|THE\s+|The\s+)?(?:Act|Republic\s+Act|Batas\s+Pambansa)\s+(?:No\.?\s*\d+\s*)?(?:to\s+)?/i);
  let body = s.slice(lead[0].length);
  body = body.replace(/^([A-Za-z]+)\b/, (m, w) => ({ provide:'Providing',create:'Creating',establish:'Establishing',convert:'Converting',separate:'Separating',change:'Changing',extend:'Extending' }[w.toLowerCase()] || m));
  body = body.replace(/^([A-Za-z]+)\s+(?:the|a|an)\s+/i, (m, w) => (/^(?:Establishing|Creating)$/i.test(w) ? w + ' ' : m));
  const { core } = peelTails(body);
  const m = core.match(/^(Establishing|Creating)\s+([\s\S]+)$/i);
  if (!m) { rows.push({ why: 'nomatch', core: core.slice(0, 90) }); continue; }
  let rest = m[2].replace(/[,\s]+$/, '');
  let known = null;
  const km = rest.match(/[,\s]+to\s+be\s+known\s+as\s+(?:the\s+)?([\s\S]+)$/i);
  if (km) { known = km[1]; rest = rest.slice(0, km.index); }
  const { thing, loc } = thingLoc(rest);
  const t = thing4(thing);
  rows.push({ why: t ? 'ok?' : 'nocore', thing, loc, core: core.slice(0, 80) });
}
console.log('剩余', rows.length);
const st = {}; rows.forEach((r) => { st[r.why] = (st[r.why] || 0) + 1; }); console.log(st);
const tail = {};
rows.filter((r) => r.why === 'nocore').forEach((r) => { const w = (r.thing || '').split(/\s+/); const k = w[w.length - 1]; tail[k] = (tail[k] || 0) + 1; });
console.log('--- thing 末词 top 24 ---');
Object.entries(tail).sort((a, b) => b[1] - a[1]).slice(0, 24).forEach(([k, v]) => console.log(String(v).padStart(4), k));
console.log('--- nocore 样例 ---');
rows.filter((r) => r.why === 'nocore').slice(0, 8).forEach((r) => console.log('  thing=' + JSON.stringify((r.thing || '').slice(0, 90)) + ' loc=' + JSON.stringify((r.loc || '').slice(0, 35))));
