const A = require('./_ph_tp.json');
const M = require('./_ph_fr.js');
const objs = {}, locs = {}, no = [];
for (const x of A) {
  let t = x.title.en.replace(/^An?\s+Act\s+/i, '').trim();
  const m = t.match(/^Grant(?:ing)?\s+(?:to\s+)?([\s\S]+?)\s+a\s+Temporary\s+Permit\s+to\s+([\s\S]+)$/i)
    || t.match(/^Granting\s+(?:to\s+)?([\s\S]+?)\s+Temporary\s+Permit\s+to\s+([\s\S]+)$/i)
    || t.match(/^to\s+Grant\s+(?:to\s+)?([\s\S]+?)\s+(?:a\s+)?Temporary\s+Permit\s+to\s+([\s\S]+)$/i);
  if (!m) { no.push(x.id + ' :: ' + t.slice(0, 130)); continue; }
  let body = m[2].replace(/,?\s*(?:and\s+)?for\s+Other\s+Purposes?[\s\S]*$/i, '');
  const cs = M.cutSecondary(body);
  const ev = M.eatVerbs(cs.main);
  if (!ev.vs.length) { no.push(x.id + ' [无动词] :: ' + cs.main.slice(0, 110)); continue; }
  let cl = M.cutLoc(ev.rest);
  let loc = cl.loc.replace(/,?\s*(?:and\s+)?for\s+Other\s+Purposes?[\s\S]*$/i, '').trim();
  const key = M.objNorm(cl.obj);
  objs[key] = (objs[key] || 0) + 1;
  locs[loc || '(无)'] = (locs[loc || '(无)'] || 0) + 1;
}
console.log('未匹配/无动词', no.length);
no.slice(0, 8).forEach((s) => console.log('  ' + s));
console.log('=== 宾语键 ' + Object.keys(objs).length);
Object.entries(objs).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(String(v).padStart(3) + '  ' + k.slice(0, 130)));
console.log('=== 地点 ' + Object.keys(locs).length);
Object.entries(locs).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(String(v).padStart(3) + '  ' + k.slice(0, 100)));
