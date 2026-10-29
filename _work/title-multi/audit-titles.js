// 全库标题缺口审计：按 §7 口径统计 country × 语种覆盖，并导出待译队列
// 用法：
//   node _work/title-multi/audit-titles.js                 打印矩阵
//   node _work/title-multi/audit-titles.js --queue P1      导出 P1 待译队列到 _work/title-multi/_queue_P1.json
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const OUTDIR = path.join(__dirname);

const UI_LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const ALL_KEYS = UI_LANGS.concat(['orig']);

/* 法域 → 原文语种（§3.2）。用于判定 orig 缺失时应回退到哪个键 */
const ORIG_LANG = {
  CN: 'zh', BN: 'en', ID: 'id', KH: 'km', LA: 'lo', MM: 'my',
  MY: 'ms', PH: 'en', SG: 'en', TH: 'th', TL: 'pt', VN: 'vi'
};

/* 分批优先级（§9） */
const PRIORITY = {
  TH: 'P1', VN: 'P1', ID: 'P1',
  KH: 'P2', LA: 'P2', MM: 'P2', MY: 'P2', TL: 'P2', BN: 'P2',
  CN: 'P3',
  SG: 'P4',
  PH: 'P5'
};

const need = (v) => typeof v === 'string' && v.trim().length > 0;

function readLaws() {
  const out = [];
  for (const f of fs.readdirSync(LAWS)) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    let o;
    try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
    if (o.duplicateOf) continue;
    out.push(o);
  }
  return out;
}

const laws = readLaws();
const countries = {};
const stat = {};
for (const o of laws) {
  const c = o.country || '??';
  countries[c] = (countries[c] || 0) + 1;
  stat[c] = stat[c] || {};
  for (const k of ALL_KEYS) stat[c][k] = stat[c][k] || 0;
  const t = (o.title && typeof o.title === 'object') ? o.title : (o.title ? { zh: o.title } : {});
  for (const k of ALL_KEYS) if (need(t[k])) stat[c][k]++;
}

const pad = (s, n) => String(s).padEnd(n);
const num = (n, w) => String(n).padStart(w);

console.log('法域   总数     ' + ALL_KEYS.map(k => num(k, 7)).join(''));
for (const c of Object.keys(countries).sort()) {
  console.log(pad(c, 7) + num(countries[c], 6) + '   ' + ALL_KEYS.map(k => num(stat[c][k] || 0, 7)).join(''));
}
const tot = { n: laws.length };
for (const k of ALL_KEYS) tot[k] = Object.values(stat).reduce((a, s) => a + (s[k] || 0), 0);
console.log(pad('合计', 7) + num(tot.n, 6) + '   ' + ALL_KEYS.map(k => num(tot[k], 7)).join(''));

/* 缺口：某部法缺哪个键 */
const gaps = [];
for (const o of laws) {
  const t = (o.title && typeof o.title === 'object') ? o.title : (o.title ? { zh: o.title } : {});
  const miss = ALL_KEYS.filter(k => !need(t[k]));
  if (!miss.length) continue;
  gaps.push({
    id: o.id,
    country: o.country || '??',
    level: o.level || null,
    coverage: o.coverage || null,
    articleCount: o.articleCount || 0,
    p: PRIORITY[o.country] || 'P9',
    miss,
    origLang: ORIG_LANG[o.country] || null,
    title: { zh: t.zh || null, en: t.en || null, orig: t.orig || null }
  });
}
/* 排序：批次 → 有全文优先 → 条数降序 */
const PORD = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4, P5: 5, P9: 9 };
gaps.sort((a, b) => (PORD[a.p] - PORD[b.p]) ||
  ((b.coverage === 'full' ? 1 : 0) - (a.coverage === 'full' ? 1 : 0)) ||
  (b.articleCount - a.articleCount));

fs.writeFileSync(path.join(OUTDIR, '_gap.json'), JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), total: laws.length, stat, gaps }, null, 1), 'utf8');
console.log('\n缺口条目 ' + gaps.length + ' 部 → _work/title-multi/_gap.json');

/* 缺 orig 的构成 */
const noOrig = gaps.filter(g => g.miss.includes('orig'));
const byC = {};
noOrig.forEach(g => { byC[g.country] = (byC[g.country] || 0) + 1; });
console.log('缺 orig ' + noOrig.length + ' 部：' + Object.keys(byC).sort().map(c => c + ' ' + byC[c]).join('  '));

/* 队列导出 */
const qIdx = process.argv.indexOf('--queue');
if (qIdx > 0) {
  const p = process.argv[qIdx + 1];
  let list = gaps.filter(g => g.p === p);
  if (p === 'P0') list = noOrig.filter(g => g.country === 'CN' || g.country === 'PH' || g.country === 'SG' || g.country === 'BN' || g.country === 'MY');
  const file = path.join(OUTDIR, '_queue_' + p + '.json');
  fs.writeFileSync(file, JSON.stringify(list, null, 1), 'utf8');
  const byC2 = {};
  list.forEach(g => { byC2[g.country] = (byC2[g.country] || 0) + 1; });
  console.log('队列 ' + p + '：' + list.length + ' 部 → ' + path.basename(file) +
    '  (' + Object.keys(byC2).sort().map(c => c + ' ' + byC2[c]).join(', ') + ')');
}
