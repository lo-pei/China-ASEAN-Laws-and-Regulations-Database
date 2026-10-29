const { parse, thingLoc, thing4, peelTails } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const want = process.argv[2] || 'slot-establish';
const RE = {
  'slot-establish': /^(Establishing|Creating)\s+([\s\S]+)$/i,
  'slot-separate': /^Separating\s+([\s\S]+?)\s+from\s+([\s\S]+?)(?:,?\s+and\s+constituting\s+[\s\S]+)?$/i,
  'slot-convert': /^Converting\s+([\s\S]+?)\s+into\s+([\s\S]+)$/i,
};
const rows = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== want) continue;
  let s = (x.title.en || '').replace(/\s+/g, ' ').trim();
  const lead = s.match(/^(?:An?\s+|THE\s+|The\s+)?(?:Act|Republic\s+Act|Batas\s+Pambansa)\s+(?:No\.?\s*\d+\s*)?(?:to\s+)?/i);
  if (!lead) continue;
  let body = s.slice(lead[0].length);
  const { core } = peelTails(body);
  const re = RE[want];
  if (!re) { console.log('no re'); break; }
  const m = core.match(re);
  if (!m) { rows.push({ why: 'nomatch', en: s }); continue; }
  let rest = m[2].replace(/[,\s]+$/, '');
  const km = rest.match(/[,\s]+to\s+be\s+known\s+as\s+(?:the\s+)?([\s\S]+)$/i);
  if (km) rest = rest.slice(0, km.index);
  const { thing, loc } = thingLoc(rest);
  const t = thing4(thing);
  rows.push({ id: x.id, ok: !!t, thing, loc, en: s });
}
console.log(want, '未产出', rows.length, '| 现在能解析', rows.filter((r) => r.ok).length);
const bad = rows.filter((r) => !r.ok);
console.log('--- 仍失败样例 ---');
bad.slice(0, 10).forEach((r) => console.log('  thing=' + JSON.stringify(r.thing.slice(0, 100)) + ' loc=' + JSON.stringify(r.loc.slice(0, 40))));
const tail = {};
bad.forEach((r) => { const w = (r.thing || '').replace(/[.,;:]+$/, '').split(/\s+/); tail[w[w.length - 1]] = (tail[w[w.length - 1]] || 0) + 1; });
console.log('--- thing 末词 top 30 ---');
Object.entries(tail).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log(String(v).padStart(4), k));
