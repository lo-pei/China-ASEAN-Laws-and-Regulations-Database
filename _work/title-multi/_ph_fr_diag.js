// 诊断：franchise 族的结构分解，用于确定词典规模
'use strict';
const F = require('./_ph_franchise.json');
const VERBS = ['Construct', 'Constructing', 'Establish', 'Install', 'Maintain', 'Operate', 'Hold', 'Conduct', 'Own', 'Acquire', 'Run', 'Develop', 'Generate', 'Provide', 'Render', 'Engage', 'Purchase', 'Lease'];

function cutSecondary(s) {
  // 次级从句：", and to Sell Ice ..." / "and to Sell ..." / ", to Sell ..."
  const m = s.match(/[,]?\s+(?:and\s+)?to\s+(?:Sell|Supply|Distribute|Furnish|Provide|Lease|Charge|Collect)\b/i);
  if (m && m.index > 5) return { main: s.slice(0, m.index).trim(), sec: s.slice(m.index).replace(/^[,\s]+/, '').trim() };
  return { main: s.trim(), sec: '' };
}
function eatVerbs(s) {
  const vs = [];
  let cur = s;
  for (;;) {
    const m = cur.match(/^([A-Z][a-z]+)\b\s*(?:,\s*(?:and\s+)?|and\s+|\s+)?/);
    if (!m) break;
    if (!VERBS.some((v) => v.toLowerCase() === m[1].toLowerCase())) break;
    vs.push(m[1]);
    cur = cur.slice(m[0].length);
  }
  return { vs, rest: cur };
}
const stat = {};
const secStat = {};
const verbSets = {};
const rows = [];
for (const x of F) {
  const t = x.title.en.trim();
  const g = t.match(/^(?:An Act )?(Granting|to Grant)\s+(?:to\s+)?([\s\S]+?)\s+a\s+franchise\s+(?:to\s+|for\s+|of\s+)?([\s\S]+)$/i);
  if (!g) { stat['__noframe__'] = (stat['__noframe__'] || 0) + 1; continue; }
  let rest = g[3];
  const { main, sec } = cutSecondary(rest);
  const { vs, rest: after } = eatVerbs(main);
  verbSets[vs.join(',')] = (verbSets[vs.join(',')] || 0) + 1;
  let obj = after;
  // 切地点：in / within / between
  let loc = '';
  const lm = obj.match(/[\s,]+(?:in|within|at|Between)\s+([\s\S]+)$/i);
  if (lm && lm.index > 3) { obj = obj.slice(0, lm.index); loc = lm[1]; }
  const key = obj.toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/[.,]$/, '').trim();
  stat[key] = (stat[key] || 0) + 1;
  if (sec) {
    const k2 = sec.toLowerCase().replace(/^(and\s+)?to\s+/, '').split(/\s+in\s+|\s+within\s+|\s+therein/)[0].trim();
    secStat[k2] = (secStat[k2] || 0) + 1;
  }
  rows.push({ id: x.id, g: g[2], vs: vs.join(','), obj, loc, sec });
}
console.log('=== 分解成功', rows.length);
console.log('=== 宾语种类', Object.keys(stat).length);
Object.entries(stat).sort((a, b) => b[1] - a[1]).slice(0, 60).forEach(([k, v]) => console.log(String(v).padStart(4), k.slice(0, 110)));
console.log('=== 动词组合');
Object.entries(verbSets).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(String(v).padStart(4), k));
console.log('=== 次级从句', Object.keys(secStat).length);
Object.entries(secStat).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(String(v).padStart(4), k.slice(0, 110)));
