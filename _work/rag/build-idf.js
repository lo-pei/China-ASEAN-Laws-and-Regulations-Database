// 生成 BM25 的 IDF 表（构建期预计算，运行时直接读）
// 为什么预生成：浏览器端只按需加载分卷，永远拿不到全部 334,681 条条文的 df；
//               而 IDF 若只建在法规标题上，会把泰文/越南文词误判为"最稀有"→ 权重虚高。
// 输出：prototype/data/bm25-idf.js → root.CALR_BM25_IDF = { N, avgLen, df:{term:df} }
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWS = path.join(ROOT, 'prototype/data/laws');
const OUT = path.join(ROOT, 'prototype/data/bm25-idf.js');

const CJK = /[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g;
function tokenizeStrict(text) {
  if (!text) return [];
  const s = String(text).toLowerCase();
  const out = [];
  const cjk = s.match(CJK);
  if (cjk) for (let i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
  const latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
  for (const w of latin) if (w && w.length > 1) out.push(w);
  return out;
}

console.log('  扫描全库条文...');
const t0 = Date.now();
const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const df = new Map();
let docs = 0, totalLen = 0;

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  const docsOfLaw = [];
  // 标题也算一个文档
  let title = '';
  if (o.title && typeof o.title === 'object') title = Object.values(o.title).filter(Boolean).join(' ');
  else title = String(o.title || '');
  if (title) docsOfLaw.push(title);
  for (const a of (o.articles || [])) {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    if (!keys.length) continue;
    // 多语言条文：每个语言各算一个文档（这样跨语言词都能拿到正确 df）
    for (const k of keys) docsOfLaw.push(String(t[k]));
  }
  for (const d of docsOfLaw) {
    const toks = tokenizeStrict(d);
    if (!toks.length) continue;
    docs++; totalLen += toks.length;
    const seen = new Set();
    for (const tk of toks) {
      if (seen.has(tk)) continue;
      seen.add(tk);
      df.set(tk, (df.get(tk) || 0) + 1);
    }
  }
}
console.log('  文档数 ' + docs + ' / 词项 ' + df.size + ' / ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');

// 只保留有区分度的词：出现 ≥2 次，且不超过 50% 文档（超高频词 IDF 接近 0，留着也占体积）
const maxDf = Math.floor(docs * 0.5);
const kept = [...df.entries()].filter(([t, d]) => d >= 2 && d <= maxDf);
kept.sort((a, b) => b[1] - a[1]);
console.log('  保留 ' + kept.length + ' 个词项（df 2..' + maxDf + '）');

const obj = {};
for (const [t, d] of kept) obj[t] = d;
const payload = JSON.stringify({ N: docs, avgLen: +(totalLen / docs).toFixed(1), df: obj });
const js = '/* CALR · BM25 IDF 表（由 _work/rag/build-idf.js 从 prototype/data/laws/ 预计算，请勿手工编辑） */\n'
  + '(function (root) {\n'
  + "  'use strict';\n"
  + '  root.CALR_BM25_IDF = ' + payload + ';\n'
  + '})(typeof window !== "undefined" ? window : this);\n';
fs.writeFileSync(OUT, js, 'utf8');
const kb = (Buffer.byteLength(js) / 1024).toFixed(0);
console.log('  已写出: prototype/data/bm25-idf.js  (' + kb + ' KB)');
console.log('  avgLen = ' + (totalLen / docs).toFixed(1));
