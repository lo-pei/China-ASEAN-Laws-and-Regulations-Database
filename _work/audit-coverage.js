/* 权威覆盖率审计：按 (lawId, no) 去重合并 laws 字段与全部 D 层分卷 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const L = 'prototype/data/laws', T = 'prototype/data/trans';

// 1. 收集 D 层：per-law → Set(no#dup)，分语言
const D = {};   // id -> {zh:Set, en:Set}
const packOf = {};
for (const f of fs.readdirSync(T).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
  const sb = { window: {} }; sb.window = sb; vm.createContext(sb);
  try { vm.runInContext(fs.readFileSync(path.join(T, f), 'utf8'), sb, {}); } catch (e) { continue; }
  for (const [k, p] of Object.entries(sb.CALR_TRANS || {})) {
    const lang = p.targetLang || 'en';
    const rec = D[k] || (D[k] = { zh: new Set(), en: new Set() });
    if (!rec[lang]) rec[lang] = new Set();
    for (const a of (p.articles || [])) {
      const txt = (a.text && a.text[lang]) || '';
      if (!String(txt).trim()) continue;
      rec[lang].add(String(a.no));
    }
    packOf[k] = packOf[k] || [];
    if (!packOf[k].includes(f)) packOf[k].push(f);
  }
}

// 2. 逐法域汇总
const agg = {};
const detail = [];
for (const f of fs.readdirSync(L)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const d = JSON.parse(fs.readFileSync(path.join(L, f), 'utf8'));
  if (d.duplicateOf) continue;
  const id = f.replace('.json', '');
  const c = d.country || id.split('-')[0];
  const arts = d.articles || [];
  const dz = (D[id] || {}).zh || new Set();
  const de = (D[id] || {}).en || new Set();
  let z = 0, e = 0;
  for (const a of arts) {
    const t = (a.text && typeof a.text === 'object') ? a.text : {};
    const no = String(a.no);
    if (String(t.zh || '').trim() || dz.has(no)) z++;
    if (String(t.en || '').trim() || de.has(no)) e++;
  }
  const A = agg[c] || (agg[c] = { laws: 0, arts: 0, zh: 0, en: 0 });
  A.laws++; A.arts += arts.length; A.zh += z; A.en += e;
  if (arts.length && (e < arts.length)) detail.push({ id, c, n: arts.length, e, gap: arts.length - e, lang: d.language, pack: d.pack });
}

const keys = Object.keys(agg).sort((a, b) => agg[b].arts - agg[a].arts);
let TN = 0, TA = 0, TZ = 0, TE = 0;
console.log('法域  法规     条文    中文     zh%     英文     en%');
for (const k of keys) {
  const a = agg[k];
  TN += a.laws; TA += a.arts; TZ += a.zh; TE += a.en;
  console.log(k.padEnd(4) + ' ' + String(a.laws).padStart(5) + ' ' + String(a.arts).padStart(7) + ' ' +
    String(a.zh).padStart(7) + ' ' + (100 * a.zh / Math.max(1, a.arts)).toFixed(1).padStart(5) + '%' + ' ' +
    String(a.en).padStart(7) + ' ' + (100 * a.en / Math.max(1, a.arts)).toFixed(1).padStart(5) + '%');
}
console.log('-'.repeat(58));
console.log('合计 ' + String(TN).padStart(5) + ' ' + String(TA).padStart(7) + ' ' + String(TZ).padStart(7) + ' ' +
  (100 * TZ / TA).toFixed(1).padStart(5) + '%' + ' ' + String(TE).padStart(7) + ' ' + (100 * TE / TA).toFixed(1).padStart(5) + '%');
console.log('\n英文缺 %d 部 / %d 条', detail.length, detail.reduce((s, r) => s + r.gap, 0));

const byc = {};
for (const r of detail) byc[r.c] = (byc[r.c] || 0) + r.gap;
console.log('按法域：', Object.entries(byc).sort((a, b) => b[1] - a[1]).map(x => x[0] + ' ' + x[1]).join(' / '));

detail.sort((a, b) => b.gap - a.gap);
fs.writeFileSync('_work/_en_gap.json', JSON.stringify(detail, null, 1));
console.log('\n--- 缺口前 25 部 ---');
for (const r of detail.slice(0, 25)) console.log(String(r.gap).padStart(5) + '/' + String(r.n).padEnd(5) + ' ' + r.id.padEnd(16) + ' ' + (r.lang || '?').padEnd(3) + ' ' + (r.pack || ''));
