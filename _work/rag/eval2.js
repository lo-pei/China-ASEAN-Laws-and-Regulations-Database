// Day1-3（v2）：检索评测基线 —— 走 askAsync（会按需载入全文分卷）
// 上一版用 qa.ask（同步），只载入了 302 条条文 → 48 题无引用，基线失真。
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
const html = fs.readFileSync(path.join(PROTO, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x));
for (const rel of srcs) {
  const c = rel.replace(/^\.\//, '').replace(/\?.*$/, '');
  const p = path.join(PROTO, c);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: c }); } catch (e) { }
}
const CALR = sandbox.CALR;

(async function () {
  console.log('  载入法规索引...');
  CALR.store.init();
  const st = CALR.store.stats();
  console.log('  法规 ' + st.laws + ' / 条文 ' + st.articles);
  console.log('');

  const rows = [], failures = [];
  let sumP3 = 0, sumR5 = 0, sumMrr = 0, n = 0;
  let withCite = 0, anyHit = 0, ccRight = 0, ccTotal = 0;

  for (let qi = 0; qi < QS.length; qi++) {
    const q = QS[qi];
    const g = GOLD_BY_Q.get(q.q);
    const goldSet = new Set((g && g.gold ? g.gold : []).map(x => x.articleId));

    let res = null, err = null;
    try { res = await CALR.qa.askAsync(q.q, { packBudget: 8 }); }
    catch (e) { err = e.message; }

    const cits = (res && res.citations) ? res.citations : [];
    if (cits.length) {
      ccTotal++;
      if (cits.every(c => String(c.country || '') === q.cc)) ccRight++;
    }
    if (qi % 10 === 0) process.stdout.write('    ' + (qi + 1) + '/' + QS.length + '  ');

    if (!cits.length) {
      rows.push({ q: q.q, cc: q.cc, cited: 0, P3: 0, R5: 0, mrr: 0, note: res ? (res.noFullText ? 'noFullText' : (!res.inScope ? 'outOfScope' : (res.empty ? 'empty' : 'noCite'))) : 'err' });
      failures.push({ q: q.q, cc: q.cc, reason: res ? (res.noFullText ? 'noFullText' : (!res.inScope ? 'outOfScope' : 'noCite')) : 'err' });
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
    else failures.push({ q: q.q, cc: q.cc, reason: 'wrongCite', cited: cits.slice(0, 3).map(c => c.country + '·' + String(c.lawTitle).slice(0, 22) + ' ' + (c.noLabel || '')) });

    rows.push({ q: q.q, cc: q.cc, cited: cits.length, correct: hitRanks.length, P3: +P3.toFixed(3), R5: +R5.toFixed(3), mrr: +mrr.toFixed(3), goldSize: goldSet.size });
  }
  process.stdout.write('\n\n');

  const P3 = sumP3 / n, R5 = sumR5 / n, MRR = sumMrr / n;
  console.log('  ═══ 检索基线（askAsync，会载入分卷）═══');
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
  console.log('  失败题目（前 16）:');
  failures.slice(0, 16).forEach(f => {
    console.log('    [' + f.reason + '] ' + f.cc + ' · ' + f.q);
    if (f.cited) f.cited.forEach(c => console.log('        → ' + c));
  });

  fs.writeFileSync(path.join(__dirname, 'baseline.json'),
    JSON.stringify({ metrics: { P3, R5, MRR, n, withCite, anyHit, ccRight, ccTotal }, rows, failures }, null, 1), 'utf8');
  console.log('');
  console.log('  已写出: _work/rag/baseline.json');
  process.exit(0);
})();
