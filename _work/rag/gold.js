// Day1-2：自动标注金标条文
// 口径：该法域内某条文正文包含该题任一概念关键词（zh / en / loc）→ 记为可能相关
// 这是**机械可复现的弱标注**，不是人工精标。会分别统计 zh/en/loc 命中，并输出可疑题目供人工复核。
const fs = require('fs');
const path = require('path');
const QS = require(path.join(__dirname, 'questions.js'));

const ROOT = path.resolve(__dirname, '../..');
const LAWS = path.join(ROOT, 'prototype/data/laws');

// 国家代码 → 目录里 law.country 的取值形态（兼容 code / name）
const CC = ['CN', 'VN', 'TH', 'MY', 'SG', 'ID', 'PH', 'KH', 'LA', 'MM', 'BN', 'TL'];

function norm(s) { return String(s || '').toLowerCase(); }

console.log('  载入法规...');
const t0 = Date.now();
const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const perCC = {};   // cc -> [{lawId, lawTitle, articles:[{id,noLabel,text}]}]
let totalArt = 0;
let loaded = 0;

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  loaded++;
  const cc = String(o.country || '').toUpperCase();
  const arts = (o.articles || []).map(a => {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    const prim = keys[0];
    return {
      id: a.id,
      no: a.no,
      noLabel: a.noLabel || {},
      text: prim ? String(t[prim]) : '',
      langs: keys
    };
  }).filter(a => a.text);
  totalArt += arts.length;
  (perCC[cc] = perCC[cc] || []).push({ lawId: o.id, lawTitle: o.title || o.id, articles: arts });
}
console.log('  载入 ' + loaded + ' 部法规 / ' + totalArt + ' 条条文（' + ((Date.now() - t0) / 1000).toFixed(1) + 's）');
console.log('');
console.log('  按国家分布:');
CC.forEach(cc => {
  const arr = perCC[cc] || [];
  const art = arr.reduce((s, l) => s + l.articles.length, 0);
  console.log('    ' + cc.padEnd(4) + ' 法规 ' + String(arr.length).padStart(6) + '  条文 ' + String(art).padStart(7));
});

// ---------- 标注 ----------
function labelFor(q) {
  const pool = perCC[q.cc] || [];
  const terms = [];
  (q.zh || []).forEach(t => terms.push({ t: norm(t), kind: 'zh' }));
  (q.en || []).forEach(t => terms.push({ t: norm(t), kind: 'en' }));
  (q.loc || []).forEach(t => terms.push({ t: norm(t), kind: 'loc' }));
  const hits = [];
  for (const law of pool) {
    for (const a of law.articles) {
      const txt = norm(a.text);
      let n = 0; const kinds = {}; const matched = [];
      for (const term of terms) {
        if (!term.t) continue;
        if (txt.indexOf(term.t) >= 0) { n++; kinds[term.kind] = (kinds[term.kind] || 0) + 1; matched.push(term.t); }
      }
      if (n > 0) hits.push({ lawId: law.lawId, lawTitle: law.lawTitle, articleId: a.id, no: a.no, noLabel: a.noLabel, n, kinds, matched });
    }
  }
  // 收紧：优先要求「至少命中 2 个不同概念词」；若没有，再退回单关键词（并标记为弱）
  const maxN = hits.reduce((m, h) => Math.max(m, h.n), 0);
  let strong = hits.filter(h => h.n >= 2);
  let weak = false;
  if (!strong.length) { strong = hits.slice(); weak = true; }
  // 若仍过宽（>120），按命中数降序取前 80，避免"泛泛提及"主导
  let gold = strong;
  if (gold.length > 120) {
    gold = strong.slice().sort((a, b) => b.n - a.n || a.articleId.localeCompare(b.articleId)).slice(0, 80);
  }
  return { hits, gold, maxN, weak };
}

console.log('');
console.log('  标注中...');
const report = [];
const out = [];
for (const q of QS) {
  const r = labelFor(q);
  const kinds = {};
  r.gold.forEach(h => Object.keys(h.kinds).forEach(k => kinds[k] = (kinds[k] || 0) + 1));
  const rec = {
    q: q.q, cc: q.cc, topic: q.topic,
    maxN: r.maxN,
    weak: !!r.weak,
    goldCount: r.gold.length,
    hitCount: r.hits.length,
    kinds,
    gold: r.gold.slice(0, 300).map(h => ({ lawId: h.lawId, lawTitle: h.lawTitle, articleId: h.articleId, noLabel: h.noLabel, matched: h.matched }))
  };
  out.push(rec);
  report.push(rec);
}

fs.writeFileSync(path.join(__dirname, 'gold.json'), JSON.stringify(out, null, 1), 'utf8');

// ---------- 统计与可疑项 ----------
const zero = report.filter(r => r.goldCount === 0);
const huge = report.filter(r => r.goldCount > 120);
const tiny = report.filter(r => r.goldCount > 0 && r.goldCount <= 2);
const mid = report.filter(r => r.goldCount >= 3 && r.goldCount <= 120);
const locOnly = report.filter(r => r.goldCount > 0 && !(r.kinds.zh || r.kinds.en));

console.log('');
console.log('  ═══ 标注结果 ═══');
console.log('  题目数            : ' + report.length);
console.log('  有金标            : ' + report.filter(r => r.goldCount > 0).length);
console.log('  金标 1-2 条（偏窄）: ' + tiny.length);
console.log('  金标 3-120 条（合理）: ' + mid.length);
console.log('  金标 >120 条（过宽）: ' + huge.length + (huge.length ? '  ← 需人工收紧' : ''));
console.log('  零金标（题目可能不匹配语料）: ' + zero.length);
console.log('  仅靠当地语言命中: ' + locOnly.length + (locOnly.length ? '  ← 需母语者核验' : ''));
console.log('');
if (zero.length) {
  console.log('  【零金标题目】');
  zero.forEach(r => console.log('    ' + r.cc + ' · ' + r.q));
}
if (huge.length) {
  console.log('');
  console.log('  【金标过宽题目（前 8）】');
  huge.slice(0, 8).forEach(r => console.log('    ' + r.cc + ' · ' + r.q + '  → ' + r.goldCount + ' 条'));
}
const avgGold = report.reduce((s, r) => s + r.goldCount, 0) / report.length;
console.log('');
console.log('  平均金标条数: ' + avgGold.toFixed(1));
console.log('  已写出: _work/rag/gold.json');
