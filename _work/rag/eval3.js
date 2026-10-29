// Day1-3（v3）：预加载全部分卷后评测
// v2 的问题：askAsync 依赖动态注入 <script> 载分卷，Node 无 DOM → 44 题 noFullText 失真
// v3：先把 intl/cn/fulltext 三个目录的 .js 全部 eval 进沙箱（它们都写 root.CALR_FULLTEXT），
//     再 S().init() 把条文并入 store，此时 qa.ask 才是在全库条文上检索。
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const PROTO = path.join(ROOT, 'prototype');
const QS = require(path.join(__dirname, 'questions.js'));
const GOLD = JSON.parse(fs.readFileSync(path.join(__dirname, 'gold.json'), 'utf8'));
const GOLD_BY_Q = new Map(GOLD.map(g => [g.q, g]));

const sandbox = { console, setTimeout, clearTimeout, Date, Math, JSON, RegExp, String, Number, Array, Object, Boolean, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Map, Set, Promise, Error };
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// ---------- 1) 载入核心脚本 ----------
const html = fs.readFileSync(path.join(PROTO, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x));
for (const rel of srcs) {
  const c = rel.replace(/^\.\//, '').replace(/\?.*$/, '');
  const p = path.join(PROTO, c);
  if (!fs.existsSync(p)) continue;
  // 分卷由下面统一加载，这里跳过，避免重复
  if (/^data\/(intl|cn|fulltext)\//.test(c)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: c }); } catch (e) { }
}

// ---------- 2) 预加载分卷 ----------
const t0 = Date.now();
let packCount = 0, packBytes = 0;
for (const sub of ['fulltext', 'cn', 'intl']) {
  const dir = path.join(PROTO, 'data', sub);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const f of files) {
    const p = path.join(dir, f);
    packBytes += fs.statSync(p).size;
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: sub + '/' + f }); packCount++; }
    catch (e) { console.log('  ! 分卷加载失败 ' + sub + '/' + f + ': ' + e.message); }
  }
}
console.log('  预加载分卷: ' + packCount + ' 个 / ' + (packBytes / 1048576).toFixed(0) + ' MB / ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');

const CALR = sandbox.CALR;
CALR.store.init();
const st = CALR.store.stats();
console.log('  store: 法规 ' + st.laws + ' / 条文 ' + st.articles);
console.log('');

// ---------- 3) 评测 ----------
const rows = [], failures = [];
let sumP3 = 0, sumR5 = 0, sumMrr = 0, n = 0;
let withCite = 0, anyHit = 0, ccRight = 0, ccTotal = 0;

for (let qi = 0; qi < QS.length; qi++) {
  const q = QS[qi];
  const g = GOLD_BY_Q.get(q.q);
  const goldSet = new Set((g && g.gold ? g.gold : []).map(x => x.articleId));
  let res = null, err = null;
  try { res = CALR.qa.ask(q.q); } catch (e) { err = e.message; }
  const cits = (res && res.citations) ? res.citations : [];

  if (cits.length) {
    ccTotal++;
    if (cits.every(c => String(c.country || '') === q.cc)) ccRight++;
  }
  if (qi % 20 === 0) process.stdout.write('    ' + (qi + 1) + '/' + QS.length + '  ');

  if (!cits.length) {
    const why = err ? 'err' : (res ? (res.noFullText ? 'noFullText' : (!res.inScope ? 'outOfScope' : (res.empty ? 'empty' : 'noCite'))) : 'null');
    rows.push({ q: q.q, cc: q.cc, cited: 0, P3: 0, R5: 0, mrr: 0, note: why });
    failures.push({ q: q.q, cc: q.cc, reason: why, err });
    n++; continue;
  }

  withCite++;
  const hitRanks = [];
  cits.forEach((c, i) => { if (goldSet.has(c.articleId)) hitRanks.push(i + 1); });

  const top3 = cits.slice(0, 3);
  const correct3 = top3.filter(c => goldSet.has(c.articleId)).length;
  const P3 = correct3 / Math.min(3, cits.length);
  const top5 = cits.slice(0, 5);
  const hit5 = new Set(top5.filter(c => goldSet.has(c.articleId)).map(c => c.articleId)).size;
  const R5 = goldSet.size ? hit5 / Math.min(goldSet.size, 5) : 0;
  const mrr = hitRanks.length ? 1 / hitRanks[0] : 0;

  sumP3 += P3; sumR5 += R5; sumMrr += mrr; n++;
  if (hitRanks.length) anyHit++;
  else failures.push({ q: q.q, cc: q.cc, reason: 'wrongCite', cited: cits.slice(0, 3).map(c => c.country + '·' + String(c.lawTitle).slice(0, 20) + ' ' + (c.noLabel || '')) });

  rows.push({ q: q.q, cc: q.cc, cited: cits.length, correct: hitRanks.length, P3: +P3.toFixed(3), R5: +R5.toFixed(3), mrr: +mrr.toFixed(3), goldSize: goldSet.size });
}
process.stdout.write('\n\n');

const P3 = sumP3 / n, R5 = sumR5 / n, MRR = sumMrr / n;
console.log('  ═══ 检索基线（全库条文，预加载分卷）═══');
console.log('  题目数            : ' + n);
console.log('  有引用            : ' + withCite + '  (' + (withCite * 100 / n).toFixed(1) + '%)');
console.log('  至少命中 1 条金标  : ' + anyHit + '  (' + (anyHit * 100 / n).toFixed(1) + '%)');
console.log('');
console.log('  P@3               : ' + (P3 * 100).toFixed(1) + '%');
console.log('  R@5（封顶召回）    : ' + (R5 * 100).toFixed(1) + '%');
console.log('  MRR               : ' + MRR.toFixed(3));
console.log('  国别正确率        : ' + ccRight + ' / ' + ccTotal + '  (' + (ccTotal ? (ccRight * 100 / ccTotal).toFixed(1) : '-') + '%)');
console.log('');
const byReason = {};
failures.forEach(f => byReason[f.reason] = (byReason[f.reason] || 0) + 1);
console.log('  失败 ' + failures.length + ' 题: ' + JSON.stringify(byReason));
console.log('');
console.log('  失败题目（前 14）:');
failures.slice(0, 14).forEach(f => {
  console.log('    [' + f.reason + '] ' + f.cc + ' · ' + f.q);
  if (f.cited) f.cited.forEach(c => console.log('        → ' + c));
});

fs.writeFileSync(path.join(__dirname, 'baseline.json'),
  JSON.stringify({ metrics: { P3, R5, MRR, n, withCite, anyHit, ccRight, ccTotal }, rows, failures }, null, 1), 'utf8');
console.log('');
console.log('  已写出: _work/rag/baseline.json');
