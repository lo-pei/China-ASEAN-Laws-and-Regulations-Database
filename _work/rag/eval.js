// Day1-3：检索评测基线
// 指标口径：
//   P@3     = 前 3 条引用中命中金标的比例（无引用记 0）
//   R@5     = 前 5 条引用覆盖的金标条数 / min(|gold|, 5)   ← 封顶召回，避免金标大集把分数压死
//   MRR     = 1 / 第一条命中金标的引用的排名
//   有引用率 / 引用命中率 / 国别正确率
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const PROTO = path.join(ROOT, 'prototype');
const QS = require(path.join(__dirname, 'questions.js'));
const GOLD = JSON.parse(fs.readFileSync(path.join(__dirname, 'gold.json'), 'utf8'));
const GOLD_BY_Q = new Map(GOLD.map(g => [g.q, g]));

// ---------- 载入 CALR ----------
const sandbox = { console, setTimeout, clearTimeout, Date, Math, JSON, RegExp, String, Number, Array, Object, Boolean, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Map, Set, Promise };
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const html = fs.readFileSync(path.join(PROTO, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x));
for (const rel of srcs) {
  const c = rel.replace(/^\.\//, '').replace(/\?.*$/, '');
  const p = path.join(PROTO, c);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: c }); } catch (e) { }
}
const CALR = sandbox.CALR;
const U = () => CALR.util;
const S = () => CALR.store;

console.log('  载入法规索引...');
S().init();
const st = S().stats();
console.log('  法规 ' + st.laws + ' / 条文 ' + st.articles);
console.log('');

// ---------- 取引用（本地确定性检索路径） ----------
function citationsOf(q) {
  let res;
  try { res = CALR.qa.ask(q); } catch (e) { return { err: e.message, cits: [], res: null }; }
  if (!res) return { err: 'null', cits: [], res: null };
  return { err: null, cits: res.citations || [], res };
}

// ---------- 评测 ----------
const rows = [];
let sumP3 = 0, sumR5 = 0, sumMrr = 0, n = 0;
let withCite = 0, anyHit = 0, ccRight = 0, ccTotal = 0;
const failures = [];

for (const q of QS) {
  const g = GOLD_BY_Q.get(q.q);
  const goldSet = new Set((g && g.gold ? g.gold : []).map(x => x.articleId));
  const { err, cits, res } = citationsOf(q.q);

  // 国别正确率：引用里国家与题目一致的比例（只看有引用的题）
  if (cits.length) {
    ccTotal++;
    if (cits.every(c => String(c.country || '') === q.cc)) ccRight++;
  }

  if (!cits.length) {
    rows.push({ q: q.q, cc: q.cc, err, cited: 0, correct: 0, P3: 0, R5: 0, mrr: 0, note: res && res.noFullText ? 'noFullText' : (res && !res.inScope ? 'outOfScope' : (res && res.empty ? 'empty' : 'noCite')) });
    failures.push({ q: q.q, cc: q.cc, reason: 'noCite' });
    n++; continue;
  }

  withCite++;
  const hitRanks = [];
  const goldHits = [];
  cits.forEach((c, i) => {
    const id = c.articleId;
    if (goldSet.has(id)) { hitRanks.push(i + 1); goldHits.push(id); }
  });

  const top3 = cits.slice(0, 3);
  const correct3 = top3.filter(c => goldSet.has(c.articleId)).length;
  const P3 = correct3 / Math.min(3, cits.length || 1);
  const top5 = cits.slice(0, 5);
  const hit5 = new Set(top5.filter(c => goldSet.has(c.articleId)).map(c => c.articleId)).size;
  const R5 = goldSet.size ? hit5 / Math.min(goldSet.size, 5) : 0;
  const mrr = hitRanks.length ? 1 / hitRanks[0] : 0;

  sumP3 += P3; sumR5 += R5; sumMrr += mrr; n++;
  if (hitRanks.length) anyHit++;
  else failures.push({ q: q.q, cc: q.cc, reason: 'wrongCite', cited: cits.slice(0, 3).map(c => c.country + '·' + c.lawTitle + ' ' + c.noLabel) });

  rows.push({ q: q.q, cc: q.cc, err, cited: cits.length, correct: hitRanks.length, P3: +P3.toFixed(3), R5: +R5.toFixed(3), mrr: +mrr.toFixed(3), goldSize: goldSet.size, weak: !!(g && g.weak) });
}

// ---------- 汇总 ----------
const P3 = sumP3 / n, R5 = sumR5 / n, MRR = sumMrr / n;
console.log('  ═══ 检索基线（本地确定性路径）═══');
console.log('  题目数            : ' + n);
console.log('  有引用            : ' + withCite + '  (' + (withCite * 100 / n).toFixed(1) + '%)');
console.log('  至少命中 1 条金标  : ' + anyHit + '  (' + (anyHit * 100 / n).toFixed(1) + '%)');
console.log('');
console.log('  P@3               : ' + (P3 * 100).toFixed(1) + '%');
console.log('  R@5（封顶召回）    : ' + (R5 * 100).toFixed(1) + '%');
console.log('  MRR               : ' + MRR.toFixed(3));
console.log('  国别正确率        : ' + ccRight + ' / ' + ccTotal + '  (' + (ccTotal ? (ccRight * 100 / ccTotal).toFixed(1) : '-') + '%)');
console.log('');
console.log('  失败明细: ' + failures.length + ' 题');
const byReason = {};
failures.forEach(f => byReason[f.reason] = (byReason[f.reason] || 0) + 1);
Object.entries(byReason).forEach(([k, v]) => console.log('    ' + k + ': ' + v));
console.log('');
console.log('  失败题目（前 20）:');
failures.slice(0, 20).forEach(f => {
  console.log('    [' + f.reason + '] ' + f.cc + ' · ' + f.q);
  if (f.cited) f.cited.forEach(c => console.log('        → ' + c));
});

const outPath = path.join(__dirname, 'baseline.json');
fs.writeFileSync(outPath, JSON.stringify({ metrics: { P3, R5, MRR, n, withCite, anyHit, ccRight, ccTotal }, rows, failures }, null, 1), 'utf8');
console.log('');
console.log('  已写出: _work/rag/baseline.json');
