'use strict';
// 诊断：grant 句框为何失败（宾语不在表内 / 地点解析不出 / 无动词）
const F = require('./_ph_franchise.json');
const M = require('./_ph_fr.js');
// 复用内部逻辑不便，这里重做一遍最小解析用于定位
const VERBS = ['Construct', 'Establish', 'Install', 'Maintain', 'Operate', 'Hold', 'Conduct', 'Own', 'Acquire', 'Develop', 'Provide', 'Render', 'Run'];
const VRE = new RegExp('^(' + VERBS.join('|') + ')\\b[\\s,]*(?:and\\s+)?', 'i');
function eatVerbs(s) { const out = []; let cur = s; for (;;) { const m = cur.match(VRE); if (!m) break; out.push(m[1].toLowerCase()); cur = cur.slice(m[0].length).trim(); } return { vs: out, rest: cur }; }
const ENT = (s) => String(s || '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const rows = [];
for (const x of F) {
  const t = ENT(x.title.en);
  const m = t.match(/^(?:An Act\s+)?(?:Granting|to Grant)\s+(?:to\s+)?([\s\S]+?)\s+a?\s*Franchise\s+(?:to\s+|for\s+|of\s+)?([\s\S]+)$/i);
  if (!m) continue;
  const r = M.parse(t);
  if (r.out) continue;
  let body = m[2];
  const secM = body.match(/[,]?\s+(?:and\s+)?to\s+(Sell|Supply|Distribute|Furnish|Accept)\b/i);
  let main = body, sec = '';
  if (secM && secM.index > 5) { main = body.slice(0, secM.index).trim(); sec = body.slice(secM.index).trim(); }
  const { vs, rest } = eatVerbs(main);
  const lm = rest.match(/[\s,]+(?:in|within|at|Between)\s+([\s\S]+)$/i);
  const obj = lm && lm.index > 3 ? rest.slice(0, lm.index).trim() : rest.trim();
  const loc = lm && lm.index > 3 ? lm[1].trim() : '';
  rows.push({ id: x.id, vs: vs.join(','), obj, loc, sec, why: r.why });
}
console.log('grant 失败', rows.length);
const byVerb = {};
for (const r of rows) { const k = r.vs || '(无动词)'; byVerb[k] = (byVerb[k] || 0) + 1; }
console.log('--- 按动词串');
Object.entries(byVerb).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(String(v).padStart(4), k));
console.log('--- 前 40 条明细');
rows.slice(0, 40).forEach((r) => console.log(`[${r.id}] ${r.why} | vs=${r.vs || '-'} | OBJ=${r.obj.slice(0, 70)} | LOC=${r.loc.slice(0, 70)} | SEC=${r.sec.slice(0, 40)}`));
