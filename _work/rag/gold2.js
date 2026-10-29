// Day1-2（v2）：用 IDF 加权标注金标，替代「≥2 个概念词」的硬规则
// 动机：上一版把「泰国劳动保护法 第118条」判成非金标 —— 它只命中 1 个泰文词 ค่าชดเชย，
//       但那恰恰是最精确的匹配。硬性要求命中 2 个词会误杀单语种精确条文。
// 新口径：score = Σ idf(term)；idf = ln(1 + N / df)，N=该法域条文数，df=命中该词的条文数
//       保留 score 最高一档中、且 score ≥ 阈值的条文（阈值取最大 score 的 60%，至少 1 条）
const fs = require('fs');
const path = require('path');
const QS = require(path.join(__dirname, 'questions.js'));

const LAWS = path.resolve(__dirname, '../../prototype/data/laws');

function norm(s) { return String(s || '').toLowerCase(); }

console.log('  载入法规...');
const t0 = Date.now();
const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const perCC = {};
let totalArt = 0;

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  const cc = String(o.country || '').toUpperCase();
  const arts = [];
  for (const a of (o.articles || [])) {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    if (!keys.length) continue;
    arts.push({ id: a.id, no: a.no, noLabel: a.noLabel || {}, text: norm(t[keys[0]]), langs: keys });
  }
  totalArt += arts.length;
  (perCC[cc] = perCC[cc] || []).push({ lawId: o.id, lawTitle: o.title || o.id, articles: arts });
}
console.log('  载入 ' + files.length + ' 部 / ' + totalArt + ' 条（' + ((Date.now() - t0) / 1000).toFixed(1) + 's）');

// ---------- 预计算每个法域的 df（按题目用到的词逐个算，避免全量笛卡尔） ----------
function dfOf(pool, term) {
  let df = 0;
  for (const law of pool) for (const a of law.articles) if (a.text.indexOf(term) >= 0) df++;
  return df;
}

console.log('  标注中...');
const out = [];
for (const q of QS) {
  const pool = perCC[q.cc] || [];
  const N = pool.reduce((s, l) => s + l.articles.length, 0);
  const terms = [];
  (q.zh || []).forEach(t => terms.push({ t: norm(t), kind: 'zh' }));
  (q.en || []).forEach(t => terms.push({ t: norm(t), kind: 'en' }));
  (q.loc || []).forEach(t => terms.push({ t: norm(t), kind: 'loc' }));
  // 计算 idf
  terms.forEach(x => {
    x.df = dfOf(pool, x.t);
    x.idf = x.df > 0 ? Math.log(1 + N / x.df) : 0;
  });
  const usable = terms.filter(x => x.df > 0);

  const hits = [];
  for (const law of pool) {
    for (const a of law.articles) {
      let score = 0; const matched = []; const kinds = {};
      for (const x of usable) {
        if (a.text.indexOf(x.t) >= 0) {
          score += x.idf; matched.push(x.t);
          kinds[x.kind] = (kinds[x.kind] || 0) + 1;
        }
      }
      if (score > 0) hits.push({ lawId: law.lawId, lawTitle: law.lawTitle, articleId: a.id, noLabel: a.noLabel, score, matched, kinds });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  const maxScore = hits.length ? hits[0].score : 0;
  const thr = maxScore * 0.6;
  let gold = hits.filter(h => h.score >= thr);
  // 上限保护：金标超过 100 条说明关键词太泛，取前 100
  if (gold.length > 100) gold = gold.slice(0, 100);

  const kinds = {};
  gold.forEach(h => Object.keys(h.kinds).forEach(k => kinds[k] = (kinds[k] || 0) + 1));

  out.push({
    q: q.q, cc: q.cc, topic: q.topic,
    N, maxScore: +maxScore.toFixed(3),
    termDf: usable.map(x => ({ t: x.t, kind: x.kind, df: x.df, idf: +x.idf.toFixed(2) })),
    goldCount: gold.length,
    hitCount: hits.length,
    kinds,
    gold: gold.map(h => ({ lawId: h.lawId, lawTitle: h.lawTitle, articleId: h.articleId, noLabel: h.noLabel, score: +h.score.toFixed(3), matched: h.matched }))
  });
}

fs.writeFileSync(path.join(__dirname, 'gold.json'), JSON.stringify(out, null, 1), 'utf8');

// ---------- 统计 ----------
const zero = out.filter(r => r.goldCount === 0);
const narrow = out.filter(r => r.goldCount > 0 && r.goldCount <= 2);
const ok = out.filter(r => r.goldCount >= 3 && r.goldCount <= 100);
const locOnly = out.filter(r => r.goldCount > 0 && !(r.kinds.zh || r.kinds.en));
const noTerm = out.filter(r => r.termDf.every(x => x.df === 0));

console.log('');
console.log('  ═══ IDF 标注结果 ═══');
console.log('  题目数        : ' + out.length);
console.log('  有金标        : ' + out.filter(r => r.goldCount > 0).length);
console.log('  金标 1-2 条   : ' + narrow.length);
console.log('  金标 3-100 条 : ' + ok.length);
console.log('  零金标        : ' + zero.length);
console.log('  全部关键词在语料中不存在: ' + noTerm.length);
console.log('  仅当地语言命中: ' + locOnly.length);
console.log('  平均金标条数  : ' + (out.reduce((s, r) => s + r.goldCount, 0) / out.length).toFixed(1));
console.log('');
if (noTerm.length) {
  console.log('  【关键词在语料中完全不存在】');
  noTerm.forEach(r => console.log('    ' + r.cc + ' · ' + r.q));
}
if (zero.length) {
  console.log('');
  console.log('  【零金标】');
  zero.forEach(r => console.log('    ' + r.cc + ' · ' + r.q + '  (maxScore=' + r.maxScore + ')'));
}
// 抽查：泰国经济补偿金题
const th = out.find(r => r.q.indexOf('泰国劳动法关于经济补偿金') >= 0);
if (th) {
  console.log('');
  console.log('  【抽查】' + th.q);
  console.log('    金标 ' + th.goldCount + ' 条，前 3:');
  th.gold.slice(0, 3).forEach(g => console.log('      ' + g.lawTitle + ' ' + (g.noLabel.zh || g.noLabel.th || '') + '  score=' + g.score + '  matched=' + JSON.stringify(g.matched)));
  console.log('    词项: ' + JSON.stringify(th.termDf));
}
console.log('');
console.log('  已写出: _work/rag/gold.json');
