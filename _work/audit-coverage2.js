/* 覆盖率审计 v2：叠加「字符量」判据，识别合并译法造成的结构错配 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const L = 'prototype/data/laws', T = 'prototype/data/trans';

// ---- 1. 收集 D 层 ----
const D = {};   // id -> {lang: {nos:Set, chars:N, n:N}}
for (const f of fs.readdirSync(T).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
  const sb = { window: {} }; sb.window = sb; vm.createContext(sb);
  try { vm.runInContext(fs.readFileSync(path.join(T, f), 'utf8'), sb, {}); } catch (e) { continue; }
  for (const [k, p] of Object.entries(sb.CALR_TRANS || {})) {
    const lang = p.targetLang || 'en';
    const rec = D[k] || (D[k] = {});
    const slot = rec[lang] || (rec[lang] = { nos: new Set(), chars: 0, n: 0 });
    for (const a of (p.articles || [])) {
      const s = String((a.text && a.text[lang]) || '');
      if (!s.trim()) continue;
      slot.nos.add(String(a.no)); slot.chars += s.length; slot.n++;
    }
  }
}

// ---- 2. 逐部比对 ----
const srcCh = a => {
  const t = (a.text && typeof a.text === 'object') ? a.text : {};
  let best = '';
  for (const v of Object.values(t)) if (String(v || '').length > best.length) best = String(v);
  return best.length;
};

const rows = [];
for (const f of fs.readdirSync(L)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const d = JSON.parse(fs.readFileSync(path.join(L, f), 'utf8'));
  if (d.duplicateOf) continue;
  const id = f.replace('.json', '');
  const c = d.country || id.split('-')[0];
  const arts = d.articles || [];
  const n = arts.length;

  let fieldEn = 0, srcChars = 0;
  const nos = new Set();
  for (const a of arts) {
    const t = (a.text && typeof a.text === 'object') ? a.text : {};
    if (String(t.en || '').trim()) fieldEn++;
    srcChars += srcCh(a);
    nos.add(String(a.no));
  }
  const dz = (D[id] || {}).zh || { nos: new Set(), chars: 0, n: 0 };
  const de = (D[id] || {}).en || { nos: new Set(), chars: 0, n: 0 };

  // 条级命中：字段 或 D 层 no 集合
  let hitEn = 0, hitZh = 0;
  for (const a of arts) {
    const t = (a.text && typeof a.text === 'object') ? a.text : {};
    const no = String(a.no);
    if (String(t.en || '').trim() || de.nos.has(no)) hitEn++;
    if (String(t.zh || '').trim() || dz.nos.has(no)) hitZh++;
  }

  // 字符量：D 层英文总量 ÷ 原文总量
  const dummySrc = Math.max(1, srcChars);
  const enChars = de.chars;
  const ratio = enChars / dummySrc;

  rows.push({
    id, c, n, lang: d.language, pack: d.pack,
    fieldEn, dEnN: de.n, enChars, srcChars, ratio,
    hitEn, hitZh, gapEn: n - hitEn, gapZh: n - hitZh,
    // 结构错配判定：条号命中率低但字符量充足
    merged: (n - hitEn) > 0 && ratio >= 1.2 && de.n > 0,
  });
}

// ---- 3. 汇总 ----
function summarise(label, list) {
  const a = {};
  for (const r of list) {
    const k = r.c;
    const o = a[k] || (a[k] = { laws: 0, arts: 0, zh: 0, en: 0, gapEn: 0, gapZh: 0, merged: 0 });
    o.laws++; o.arts += r.n; o.zh += r.hitZh; o.en += r.hitEn; o.gapEn += r.gapEn; o.gapZh += r.gapZh;
    if (r.merged) o.merged++;
  }
  console.log('\n=== ' + label + ' ===');
  console.log('法域  法规     条文    中文     zh%     英文     en%    英文缺  合并译法');
  let T1 = 0, T2 = 0, T3 = 0, T4 = 0, T5 = 0, T6 = 0;
  for (const k of Object.keys(a).sort((x, y) => a[y].arts - a[x].arts)) {
    const o = a[k];
    T1 += o.laws; T2 += o.arts; T3 += o.zh; T4 += o.en; T5 += o.gapEn; T6 += o.merged;
    console.log(k.padEnd(4) + String(o.laws).padStart(6) + String(o.arts).padStart(8) + String(o.zh).padStart(8) +
      (100 * o.zh / Math.max(1, o.arts)).toFixed(1).padStart(6) + '%' + String(o.en).padStart(8) +
      (100 * o.en / Math.max(1, o.arts)).toFixed(1).padStart(6) + '%' + String(o.gapEn).padStart(8) + String(o.merged).padStart(10));
  }
  console.log('合计'.padEnd(4) + String(T1).padStart(6) + String(T2).padStart(8) + String(T3).padStart(8) +
    (100 * T3 / T2).toFixed(1).padStart(6) + '%' + String(T4).padStart(8) +
    (100 * T4 / T2).toFixed(1).padStart(6) + '%' + String(T5).padStart(8) + String(T6).padStart(10));
}

summarise('原始口径（按条号对齐）', rows);

// 剔除合并译法后
const clean = rows.filter(r => !r.merged);
summarise('修正口径（剔除合并译法）', clean);

const gapLaws = clean.filter(r => r.gapEn > 0);
console.log('\n修正后英文缺口：%d 部 / %d 条', gapLaws.length, gapLaws.reduce((s, r) => s + r.gapEn, 0));
gapLaws.sort((a, b) => b.gapEn - a.gapEn);
fs.writeFileSync('_work/_en_gap2.json', JSON.stringify(gapLaws, null, 1));
console.log('\n--- 前 20 部 ---');
for (const r of gapLaws.slice(0, 20))
  console.log(String(r.gapEn).padStart(5) + '/' + String(r.n).padEnd(5) + ' ' + r.id.padEnd(18) + (r.lang || '?').padEnd(4) +
    ' D层en=' + String(r.dEnN).padStart(4) + ' ratio=' + r.ratio.toFixed(2));
