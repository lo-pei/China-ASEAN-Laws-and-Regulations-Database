const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'prototype/data/laws');
const TDIR = path.join(ROOT, 'prototype/data/trans');

const cov = new Map();
for (const f of fs.readdirSync(TDIR)) {
  if (!f.endsWith('.js') || f === 'manifest.js') continue;
  const ctx = {}; ctx.globalThis = ctx; vm.createContext(ctx);
  try { vm.runInContext(fs.readFileSync(path.join(TDIR, f), 'utf8'), ctx); } catch (e) { continue; }
  for (const [lawId, pack] of Object.entries(ctx.CALR_TRANS || {})) {
    const per = cov.get(lawId) || {};
    per[pack.targetLang] = (per[pack.targetLang] || 0) + (pack.articles || []).length;
    cov.set(lawId, per);
  }
}

const countries = { CN: '中国', VN: '越南', ID: '印度尼西亚', TH: '泰国', KH: '柬埔寨', LA: '老挝', MM: '缅甸', MY: '马来西亚', PH: '菲律宾', SG: '新加坡', BN: '文莱', TL: '东帝汶' };
const rows = {};
let T = { laws: 0, arts: 0, chars: 0, zhT: 0, enT: 0, enLaws: 0, enArts: 0, zhLaws: 0, zhArts: 0 };
const partial = [], noEn = [], noZhTitle = [], noEnTitle = [];

for (const fn of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  let d; try { d = JSON.parse(fs.readFileSync(path.join(DIR, fn), 'utf8')); } catch (e) { continue; }
  if (!d.country || !d.id) continue;                       // 跳过 index.json 等非法规文件
  const id = d.id, c = d.country, lang = d.language || '??';
  // 实际条文数 = 去重后的 (no, dupIndex) 数，避免「项被抽成条」导致虚高
  const seen = new Set();
  for (const a of (d.articles || [])) seen.add(String(a.no) + '|' + String(a.dupIndex || 1));
  const arts = seen.size;
  const tt = d.title && typeof d.title === 'object' ? d.title : {};
  const tzh = (tt.zh || '').trim(), ten = (tt.en || '').trim();

  rows[c] = rows[c] || { laws: 0, arts: 0, zhT: 0, enT: 0, enLaws: 0, enArts: 0, zhLaws: 0, zhArts: 0, srcLang: {} };
  const r = rows[c];
  r.laws++; r.arts += arts; r.srcLang[lang] = (r.srcLang[lang] || 0) + 1;
  if (tzh) { r.zhT++; T.zhT++; } else noZhTitle.push([id, c, lang, arts, ten.slice(0, 50)]);
  if (ten) { r.enT++; T.enT++; } else noEnTitle.push([id, c, lang, arts, tzh.slice(0, 40)]);
  T.laws++; T.arts += arts;

  const t = cov.get(id) || {};
  if (t.en) { r.enLaws++; r.enArts += t.en; T.enLaws++; T.enArts += t.en; }
  if (t.zh) { r.zhLaws++; r.zhArts += t.zh; T.zhLaws++; T.zhArts += t.zh; }
  if (t.en && t.en < arts) partial.push([id, c, lang, t.en, arts, tzh.slice(0, 34)]);
  if (!t.en && lang !== 'en') noEn.push([id, c, lang, arts, tzh.slice(0, 40)]);
}

const order = ['CN', 'VN', 'ID', 'TH', 'KH', 'LA', 'MM', 'MY', 'PH', 'SG', 'BN', 'TL'];
const pct = (a, b) => (b ? (a / b * 100).toFixed(1) : '0.0');
const pad = (s, n) => { s = String(s); let w = 0; for (const ch of s) w += /[\u4e00-\u9fa5]/.test(ch) ? 2 : 1; return s + ' '.repeat(Math.max(0, n - w)); };

console.log(`=== 全局（分母=去重条号数）===\n法规 ${T.laws} / 条文 ${T.arts}`);
console.log(`标题：中文 ${T.zhT}（${pct(T.zhT, T.laws)}%）英译 ${T.enT}（${pct(T.enT, T.laws)}%）`);
console.log(`法条英译 ${T.enLaws} 部 / ${T.enArts} 条（${pct(T.enArts, T.arts)}%）`);
console.log(`法条中译 ${T.zhLaws} 部 / ${T.zhArts} 条（${pct(T.zhArts, T.arts)}%）`);

console.log('\n=== 按国别 ===');
console.log(pad('国别', 10) + pad('法规', 6) + pad('条文', 7) + pad('中题', 6) + pad('英题', 6) + pad('英译部', 7) + pad('英译条', 8) + pad('覆盖', 7) + pad('中译部', 7) + pad('中译条', 8) + pad('覆盖', 7) + '源语言');
for (const c of order) {
  const r = rows[c]; if (!r) continue;
  console.log(pad(countries[c] || c, 10) + pad(r.laws, 6) + pad(r.arts, 7) + pad(r.zhT, 6) + pad(r.enT, 6) + pad(r.enLaws, 7) + pad(r.enArts, 8) + pad(pct(r.enArts, r.arts) + '%', 7) + pad(r.zhLaws, 7) + pad(r.zhArts, 8) + pad(pct(r.zhArts, r.arts) + '%', 7) + JSON.stringify(r.srcLang));
}

console.log(`\n=== 部分翻译（译条 < 去重条号数）：${partial.length} 部 ===`);
for (const p of partial) console.log('  ' + p.join('\t'));

console.log(`\n=== 源语言非英文且完全无英译：${noEn.length} 部 / ${noEn.reduce((s, x) => s + x[3], 0)} 条 ===`);
const g = {};
for (const m of noEn) { const k = m[1] + '/' + m[2]; (g[k] = g[k] || []).push(m); }
for (const k of Object.keys(g).sort()) {
  console.log(`-- ${k}: ${g[k].length} 部 / ${g[k].reduce((s, x) => s + x[3], 0)} 条`);
  if (['CN/zh', 'VN/vi', 'ID/id'].includes(k)) for (const m of g[k]) console.log('   ' + m[0] + '\t' + m[3] + '条\t' + m[4]);
}

console.log(`\n=== 缺中文标题：${noZhTitle.length} 部 ===`);
for (const m of noZhTitle) console.log('  ' + m.join('\t'));
console.log(`\n=== 缺英文标题：${noEnTitle.length} 部（前 20）===`);
for (const m of noEnTitle.slice(0, 20)) console.log('  ' + m.join('\t'));
const byC = {}; for (const m of noEnTitle) byC[m[1] + '/' + m[2]] = (byC[m[1] + '/' + m[2]] || 0) + 1;
console.log('  分布：' + JSON.stringify(byC));
