// 统计库内既有译文中「修饰语 + 核心词 + 地名」的语序惯例。
// 直接对 vi/th/id/ms 字段做模式计数，不依赖 en。只读。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'prototype', 'data', 'laws');

const PAT = {
  vi: {
    core: 'Trường Trung học',
    mod: 'Quốc gia',
  },
  id: { core: 'Sekolah Menengah', mod: 'Nasional' },
  ms: { core: 'Sekolah Menengah', mod: 'Kebangsaan' },
  th: { core: 'โรงเรียนมัธยมศึกษา', mod: 'แห่งชาติ' },
};

const res = {};
for (const L of Object.keys(PAT)) res[L] = { modFirst: 0, modLast: 0, other: 0, total: 0 };

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { continue; }
  const t = j.title || {};
  for (const L of Object.keys(PAT)) {
    const s = t[L];
    if (!s) continue;
    const { core, mod } = PAT[L];
    if (!s.includes(core)) continue;
    const i = s.indexOf(core);
    const after = s.slice(i + core.length);
    res[L].total++;
    if (after.trimStart().startsWith(mod)) res[L].modFirst++;      // <核心词> <修饰> <地名>
    else if (new RegExp('^[^,]{2,40}' + mod).test(after.trimStart())) res[L].modLast++; // <核心词> <地名> <修饰>
    else res[L].other++;
  }
}
for (const L of Object.keys(res)) {
  const r = res[L];
  console.log(L.padEnd(3), '含核心词', String(r.total).padStart(5),
    '| 修饰紧跟核心词(正序)', String(r.modFirst).padStart(5),
    '| 修饰在名后(倒序)', String(r.modLast).padStart(5),
    '| 其他', r.other);
}
