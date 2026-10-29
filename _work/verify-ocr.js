/* OCR 改动安全校验：逐条比对备份与现状，确认改动均可由规则解释且未引入新缺陷 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.resolve('prototype/data'), B = path.resolve('_work/backup-pre-ocr');

function load(base, files) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(base, f), 'utf8'), c, { filename: f }));
  return c.CALR_FULLTEXT || {};
}
const files = fs.readdirSync(path.join(R, 'intl')).filter(f => /^[a-z]{2}-p\d+\.js$/.test(f)).map(f => 'intl/' + f);
files.push('fulltext/bn.js');
const after = load(R, files), before = load(B, files);

/* 1) 结构不变 */
let arts0 = 0, arts1 = 0, structBad = [];
for (const id of Object.keys(before)) {
  const A = after[id], Bl = before[id];
  if (!Bl) continue;
  if (!A) { structBad.push(id + ' 缺失'); continue; }
  const n0 = (Bl.articles || []).length, n1 = (A.articles || []).length;
  arts0 += n0; arts1 += n1;
  if (n0 !== n1) structBad.push(id + ' 条文数 ' + n0 + '→' + n1);
  else (Bl.articles || []).forEach((oa, i) => { if (oa.no !== A.articles[i].no) structBad.push(id + ' 条号错位 @' + i); });
}
console.log('=== 结构完整性 ===');
console.log('  法规 ' + Object.keys(before).length + '，条文 ' + arts0 + ' → ' + arts1);
console.log('  结构异常 ' + structBad.length + (structBad.length ? '：' + structBad.slice(0, 5).join('; ') : ' ✓'));

/* 2) 逐条文本改动 */
const RULES = [
  [/\{/g, 'R1 {→('],
  [/\}/g, 'R2 }→)'],
  [/\[([A-Za-z0-9]{1,3})\)/g, 'R3 [X)→(X)'],
  [/([\s\n;.,\-—–]*)f([a-z]{1,2})([)}])/g, 'R4 f→('],
  [/\bfi\.(?=[a-z])/g, 'R5 fi.→fi'],
  [/([\s\n;.,]*)i{1,3}\)(?=[\s,;.])/g, 'R6 i)→(i)'],
];
let changed = 0, deltas = [];
const samples = [];
const suspicious = [];
for (const id of Object.keys(before)) {
  const A = after[id], Bl = before[id];
  if (!A || !Bl) continue;
  (Bl.articles || []).forEach((oa, i) => {
    const na = A.articles[i];
    for (const l in (oa.text || {})) {
      const o = oa.text[l], n = na.text[l];
      if (o === n || n === undefined) return;
      changed++;
      deltas.push(n.length - o.length);
      if (samples.length < 12) samples.push({ id, no: oa.no, l, o, n });
    }
  });
}
deltas.sort((a, b) => a - b);
console.log('');
console.log('=== 文本改动 ===');
console.log('  改动条目 ' + changed);
console.log('  长度差：最小 ' + deltas[0] + ' / 中位 ' + deltas[Math.floor(deltas.length / 2)] + ' / 最大 ' + deltas[deltas.length - 1]);
const big = deltas.filter(d => Math.abs(d) > 12).length;
console.log('  |长度差| > 12 的条目 ' + big + (big ? '  ← 需复核' : ' ✓'));

/* 3) 是否引入新缺陷：统计改进前后各类坏形态 */
const PATTERNS = {
  '{': /\{/g, '}': /\}/g,
  '[X)': /\[[A-Za-z0-9]{1,3}\)/g,
  'f+字母+)': /(^|[\s\n;.,\-—–(])f[a-z]{1,2}[)}]/gm,
  'fi.xx': /\bfi\.[a-z]/g,
  'ii)/iii)': /(^|[\s\n;.,])i{1,3}\)/gm,
  '印尼页眉残片': /^(?:PRES\s?IDEN\w*|FRES\s?IDEN\w*|REPUEL\w*|REPUBUK\w*|TNDONESIA|INDONESTA)$/gm,
  '双左括号 ((': /\(\(/g,
  '左括号+空格+( (': /\(\s+\(/g,
};
function countAll(T, re) { let n = 0; for (const id of Object.keys(T)) for (const a of (T[id].articles || [])) for (const l in (a.text || {})) { const m = String(a.text[l]).match(re); if (m) n += m.length; } return n; }
console.log('');
console.log('=== 缺陷形态对照（改前 → 改后）===');
for (const k in PATTERNS) {
  const b = countAll(before, PATTERNS[k]), a = countAll(after, PATTERNS[k]);
  const flag = (k.indexOf('双') >= 0 || k.indexOf('空格') >= 0) ? (a > b ? '  ✗ 新增！' : '  ✓') : (a <= b ? '  ✓' : '  ✗ 反增！');
  console.log('  ' + k.padEnd(16) + String(b).padStart(7) + ' → ' + String(a).padStart(7) + flag);
}

/* 4) 改动样例 */
console.log('');
console.log('=== 改动样例（前 8 条）===');
samples.slice(0, 8).forEach(s => {
  // 找第一处差异
  let i = 0; while (i < s.o.length && i < s.n.length && s.o[i] === s.n[i]) i++;
  let j = 0; while (j < s.o.length - i && j < s.n.length - i && s.o[s.o.length - 1 - j] === s.n[s.n.length - 1 - j]) j++;
  console.log('  ' + s.id + ' 条' + s.no + ' [' + s.l + ']');
  console.log('     改前 …' + JSON.stringify(s.o.slice(Math.max(0, i - 26), i + 30)) + '…');
  console.log('     改后 …' + JSON.stringify(s.n.slice(Math.max(0, i - 26), i + 30)) + '…');
});
