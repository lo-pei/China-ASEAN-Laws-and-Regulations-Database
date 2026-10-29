// Day1-2（v3）：语言感知的金标标注
// v2 的问题：给泰语法域用中文关键词「补偿」——它在泰语语料里只出现 7 次（都是农产品期货），
//            IDF 虚高，把真正正确的泰文词 ค่าชดเชย 压下去了。
// 修法：先判定每个法域语料的**主语言**，只使用该语言对应的关键词；
//       若该语言没有提供关键词，再按 en → zh 回退。
const fs = require('fs');
const path = require('path');
const QS = require(path.join(__dirname, 'questions.js'));

const LAWS = path.resolve(__dirname, '../../prototype/data/laws');
const norm = (s) => String(s || '').toLowerCase();

console.log('  载入法规...');
const t0 = Date.now();
const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const perCC = {};

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  const cc = String(o.country || '').toUpperCase();
  const arts = [];
  for (const a of (o.articles || [])) {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    if (!keys.length) continue;
    arts.push({ id: a.id, no: a.no, noLabel: a.noLabel || {}, text: norm(t[keys[0]]), prim: keys[0], langs: keys });
  }
  (perCC[cc] = perCC[cc] || []).push({ lawId: o.id, lawTitle: o.title || '', articles: arts });
}

// ---------- 每法域主语言 ----------
const domLang = {};
const langStat = {};
for (const cc of Object.keys(perCC)) {
  const cnt = {};
  let tot = 0;
  for (const law of perCC[cc]) for (const a of law.articles) {
    a.langs.forEach(l => cnt[l] = (cnt[l] || 0) + 1);
    tot++;
  }
  const sorted = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  domLang[cc] = sorted.length ? sorted[0][0] : 'en';
  langStat[cc] = sorted.slice(0, 3).map(([l, n]) => l + ':' + (n * 100 / tot).toFixed(0) + '%').join(' ');
}
console.log('  各法域主语言:');
Object.entries(domLang).forEach(([cc, l]) => console.log('    ' + cc.padEnd(4) + '→ ' + l.padEnd(4) + '  (' + langStat[cc] + ')'));

// 关键词种类 ↔ 主语言 映射；主语言若无对应关键词则回退
const KIND_BY_LANG = {
  zh: ['zh', 'en'], en: ['en', 'zh'], th: ['loc', 'en', 'zh'], vi: ['loc', 'en', 'zh'],
  id: ['loc', 'en', 'zh'], ms: ['loc', 'en', 'zh'], pt: ['loc', 'en', 'zh'],
  km: ['en', 'zh'], lo: ['en', 'zh'], my: ['en', 'zh'], fil: ['loc', 'en', 'zh'], tl: ['loc', 'en', 'zh']
};

function dfOf(pool, term) {
  let df = 0;
  for (const law of pool) for (const a of law.articles) if (a.text.indexOf(term) >= 0) df++;
  return df;
}

console.log('');
console.log('  标注中...');
const out = [];
for (const q of QS) {
  const pool = perCC[q.cc] || [];
  const N = pool.reduce((s, l) => s + l.articles.length, 0);
  const order = KIND_BY_LANG[domLang[q.cc]] || ['en', 'zh'];

  // 按回退优先级挑「在语料中确实出现过」的关键词种类
  let chosenKind = null, terms = [];
  for (const kind of order) {
    const cand = [];
    if (kind === 'zh') (q.zh || []).forEach(t => cand.push({ t: norm(t), kind: 'zh' }));
    else if (kind === 'en') (q.en || []).forEach(t => cand.push({ t: norm(t), kind: 'en' }));
    else (q.loc || []).forEach(t => cand.push({ t: norm(t), kind: 'loc' }));
    if (!cand.length) continue;
    cand.forEach(x => { x.df = dfOf(pool, x.t); x.idf = x.df > 0 ? Math.log(1 + N / x.df) : 0; });
    const usable = cand.filter(x => x.df > 0);
    if (usable.length) { chosenKind = kind; terms = usable; break; }
  }
  if (!chosenKind) {
    out.push({ q: q.q, cc: q.cc, topic: q.topic, N, domLang: domLang[q.cc], usedKind: null, goldCount: 0, hitCount: 0, kinds: {}, termDf: [], gold: [] });
    continue;
  }

  const hits = [];
  for (const law of pool) {
    for (const a of law.articles) {
      let score = 0; const matched = [];
      for (const x of terms) if (a.text.indexOf(x.t) >= 0) { score += x.idf; matched.push(x.t); }
      if (score > 0) hits.push({ lawId: law.lawId, lawTitle: law.lawTitle, articleId: a.id, noLabel: a.noLabel, score, matched });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  const maxScore = hits.length ? hits[0].score : 0;
  let gold = hits.filter(h => h.score >= maxScore * 0.75);
  if (gold.length > 100) gold = gold.slice(0, 100);

  out.push({
    q: q.q, cc: q.cc, topic: q.topic, N, domLang: domLang[q.cc], usedKind: chosenKind,
    maxScore: +maxScore.toFixed(3),
    termDf: terms.map(x => ({ t: x.t, kind: x.kind, df: x.df, idf: +x.idf.toFixed(2) })),
    goldCount: gold.length, hitCount: hits.length, kinds: { [chosenKind]: gold.length },
    gold: gold.map(h => ({ lawId: h.lawId, lawTitle: h.lawTitle, articleId: h.articleId, noLabel: h.noLabel, score: +h.score.toFixed(3), matched: h.matched }))
  });
}

fs.writeFileSync(path.join(__dirname, 'gold.json'), JSON.stringify(out, null, 1), 'utf8');

// ---------- 统计 ----------
const zero = out.filter(r => r.goldCount === 0);
const ok = out.filter(r => r.goldCount >= 1 && r.goldCount <= 100);
const tooWide = out.filter(r => r.goldCount >= 100);
const kindStat = {};
out.forEach(r => { if (r.usedKind) kindStat[r.usedKind] = (kindStat[r.usedKind] || 0) + 1; });

console.log('');
console.log('  ═══ 语言感知标注结果 ═══');
console.log('  题目数        : ' + out.length);
console.log('  有金标        : ' + (out.length - zero.length));
console.log('  零金标        : ' + zero.length);
console.log('  金标达上限 100: ' + tooWide.length);
console.log('  平均金标条数  : ' + (out.reduce((s, r) => s + r.goldCount, 0) / out.length).toFixed(1));
console.log('  使用关键词种类: ' + JSON.stringify(kindStat));
if (zero.length) {
  console.log('');
  console.log('  【零金标】');
  zero.forEach(r => console.log('    ' + r.cc + '(主语言 ' + r.domLang + ') · ' + r.q));
}
// 抽查三题
['泰国劳动法关于经济补偿金', '越南外资企业的最低注册资本', '新加坡公司法的年度申报'].forEach(kw => {
  const r = out.find(x => x.q.indexOf(kw) >= 0);
  if (!r) return;
  console.log('');
  console.log('  【抽查】' + r.q);
  console.log('    主语言 ' + r.domLang + '，用 ' + r.usedKind + ' 关键词，金标 ' + r.goldCount + ' 条');
  console.log('    词项: ' + JSON.stringify(r.termDf));
  r.gold.slice(0, 3).forEach(g => console.log('      ' + String(g.lawTitle).slice(0, 28) + ' ' + (g.noLabel.zh || g.noLabel.th || g.noLabel.en || '') + '  score=' + g.score));
});
console.log('');
console.log('  已写出: _work/rag/gold.json');
