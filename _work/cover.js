const fs = require('fs'), vm = require('vm'), path = require('path');
const L = 'prototype/data/laws', T = 'prototype/data/trans';
const snap = {};
for (const f of fs.readdirSync(T).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
  const sb = { window: {} }; sb.window = sb; vm.createContext(sb);
  try { vm.runInContext(fs.readFileSync(path.join(T, f), 'utf8'), sb, {}); } catch (e) { continue; }
  for (const [k, p] of Object.entries(sb.CALR_TRANS || {})) {
    const per = snap[k] || (snap[k] = {});
    per[p.targetLang || 'en'] = (per[p.targetLang || 'en'] || 0) + (p.articles || []).length;
  }
}
const PREFIX = process.argv[2] || 'VN-';
const rows = [];
for (const f of fs.readdirSync(L)) {
  if (!f.startsWith(PREFIX)) continue;
  const d = JSON.parse(fs.readFileSync(path.join(L, f), 'utf8'));
  if (d.duplicateOf) continue;            // 已标注重复：不入目录层，不参与覆盖率
  const id = f.replace('.json', '');
  const arts = d.articles || [];
  const n = arts.length;
  const cnt = { zh: 0, en: 0 };
  for (const a of arts) {
    for (const l of ['zh', 'en']) if (a.text && a.text[l]) cnt[l]++;
  }
  const s = snap[id] || {};
  cnt.zh += s.zh || 0; cnt.en += s.en || 0;
  rows.push({ id, n, zh: cnt.zh, en: cnt.en, lang: d.language });
}
const sum = k => rows.reduce((s, r) => s + r[k], 0);
console.log(PREFIX, '法规', rows.length, '条', sum('n'), '| zh', sum('zh'), '| en', sum('en'));
for (const l of ['zh', 'en']) {
  const miss = rows.filter(r => r[l] < r.n).sort((a, b) => (b.n - b[l]) - (a.n - a[l]));
  console.log('[' + l + '] 缺', miss.length, '部 /', miss.reduce((s, r) => s + r.n - r[l], 0), '条');
  console.log(miss.slice(0, 30).map(r => '  ' + r.id + ' ' + r[l] + '/' + r.n).join('\n'));
}
