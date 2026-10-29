// 查库内既有译文里「<地名> National High School」的语序惯例。
// 只读。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'prototype', 'data', 'laws');

const stat = { vi: { before: 0, after: 0, none: 0 }, id: { before: 0, after: 0, none: 0 }, ms: { before: 0, after: 0, none: 0 }, th: { before: 0, after: 0, none: 0 } };
const samples = { vi: [], id: [], ms: [], th: [] };

// 目标语「国立中学」核心词
const CORE = {
  vi: /Trường Trung học Quốc gia|Trường Trung học phổ thông Quốc gia/i,
  id: /Sekolah Menengah Nasional|Sekolah Menengah Atas Nasional/i,
  ms: /Sekolah Menengah Kebangsaan/i,
  th: /โรงเรียนมัธยมศึกษาแห่งชาติ|โรงเรียนมัธยมแห่งชาติ/i,
};

let n = 0;
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { continue; }
  const t = j.title || {};
  const en = t.en || '';
  // 只取 en 形如 "... to Be Known as <Name> National High School" 或独立名称
  const m = en.match(/\b([A-Z][A-Za-z'’.\-]+(?:\s+[A-Z][A-Za-z'’.\-]+){0,3})\s+National High School\b/);
  if (!m) continue;
  const name = m[1];
  n++;
  for (const L of ['vi', 'id', 'ms', 'th']) {
    const s = t[L];
    if (!s) continue;
    const cm = s.match(CORE[L]);
    if (!cm) { stat[L].none++; continue; }
    const idx = s.indexOf(cm[0]);
    const before = s.slice(0, idx);
    const after = s.slice(idx + cm[0].length);
    // 地名出现在核心词前 = before；出现在后 = after
    const inBefore = before.includes(name);
    const inAfter = after.includes(name);
    if (inBefore && !inAfter) { stat[L].before++; if (samples[L].length < 4) samples[L].push([en.slice(0, 90), s]); }
    else if (inAfter && !inBefore) { stat[L].after++; }
    else stat[L].none++;
  }
}
console.log('命中 en 含 "<名> National High School" 的条目', n);
for (const L of ['vi', 'id', 'ms', 'th']) {
  const a = stat[L];
  console.log(L, ' 地名在核心词前', a.before, '| 在后', a.after, '| 无核心词/难判', a.none);
}
console.log('\n「地名在前」样本（vi）：');
samples.vi.forEach(([e, s]) => console.log('  EN: ' + e + '\n  VI: ' + s));
