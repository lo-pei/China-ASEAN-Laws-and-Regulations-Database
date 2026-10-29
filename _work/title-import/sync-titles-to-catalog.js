// 把 prototype/data/laws/<id>.json 的 title 回灌进两个目录层
//   · cn-catalog.js   → 扁平 title（中文）+ titleEn
//   · intl-catalog.js → title:{zh,en,orig}
// fix-catalogs.js 只补缺与删死链，不刷新已有条目，故须单独跑本脚本。
// 用法：node _work/title-import/sync-titles-to-catalog.js [--dry]
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const LAWS = path.join(PD, 'laws');
const DRY = process.argv.includes('--dry');

function load(rel) {
  const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(PD, rel), 'utf8'), sb, { filename: rel });
  return sb;
}
function writeCatalog(file, varName, obj) {
  const json = JSON.stringify(obj);
  const html = '/* ==========================================================================\n' +
    '   CALR · ' + file + '（由 _work/backend/fix-catalogs.js 从 prototype/data/laws/ 校正生成，请勿手工编辑）\n' +
    '   ========================================================================== */\n' +
    '(function (root) {\n' +
    "  'use strict';\n" +
    '  root.' + varName + ' = ' + json + ';\n' +
    '})(typeof window !== "undefined" ? window : this);\n';
  fs.writeFileSync(path.join(PD, file), html, 'utf8');
  console.log('  ✓ 写出 ' + file + '  (' + (Buffer.byteLength(html) / 1048576).toFixed(1) + ' MB)');
}

// 权威存储
const laws = {};
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  if (o.id) laws[o.id] = o;
}

// ---- CN ----
/* 标题语种键（规范 07 §8.3）：目录层须同步全部语种，否则 vi/th/id/ms 界面取不到值 */
const TITLE_KEYS = ['zh', 'en', 'vi', 'th', 'id', 'ms', 'orig', 'km', 'lo', 'my', 'pt', 'tet'];
const CN = load('cn-catalog.js').CALR_CN_CATALOG;
let cnZh = 0, cnEn = 0, cnAlt = 0, cnMiss = 0;
const cnSamples = [];
for (const c of CN.laws) {
  const o = laws[c.id];
  if (!o) { cnMiss++; continue; }
  const t = (o.title && typeof o.title === 'object') ? o.title : { zh: o.title };
  const zh = t.zh || null;
  const en = t.en || null;
  if (zh && c.title !== zh) { if (cnSamples.length < 5) cnSamples.push(c.id + ': ' + c.title + ' → ' + zh); c.title = zh; cnZh++; }
  if (en && c.titleEn !== en) { c.titleEn = en; cnEn++; }
  /* 中文以外的语种键挂在 titleI18n（cn-catalog 的 title 是扁平字符串，不能改结构） */
  const alt = {};
  for (const k of TITLE_KEYS) {
    if (k === 'zh') continue;
    if (t[k]) alt[k] = t[k];
  }
  if (Object.keys(alt).length) { c.titleI18n = alt; cnAlt++; }
  else if (c.titleI18n) delete c.titleI18n;
}
console.log('  cn-catalog   : 条目 ' + CN.laws.length + '  改写中文标题 ' + cnZh + '  写入 titleEn ' + cnEn +
  '  其他语种 ' + cnAlt + '  缺权威存储 ' + cnMiss);
cnSamples.forEach(s => console.log('      · ' + s));

// ---- INTL ----
const INL = load('intl-catalog.js').CALR_INTL_CATALOG;
let ilZh = 0, ilEn = 0, ilMiss = 0;
const ilByKey = {};
const ilSamples = [];
for (const c of INL.laws) {
  const o = laws[c.id];
  if (!o) { ilMiss++; continue; }
  const t = (o.title && typeof o.title === 'object') ? o.title : { zh: o.title };
  if (!c.title || typeof c.title !== 'object') c.title = { zh: null, en: null, orig: null };
  for (const k of TITLE_KEYS) {
    if (!t[k]) continue;
    if (k === 'zh' && c.title.zh !== t.zh) {
      if (ilSamples.length < 8) ilSamples.push(c.id + ': ' + c.title.zh + ' → ' + t.zh);
      c.title.zh = t.zh; ilZh++;
    } else if (k === 'en') {
      if (c.title.en !== t.en) { c.title.en = t.en; ilEn++; }
    } else if (c.title[k] !== t[k]) {
      c.title[k] = t[k];
      ilByKey[k] = (ilByKey[k] || 0) + 1;
    }
  }
}
console.log('  intl-catalog : 条目 ' + INL.laws.length + '  改写中文标题 ' + ilZh + '  写入英文 ' + ilEn +
  '  原文标题 ' + (ilByKey.orig || 0) + '  缺权威存储 ' + ilMiss);
const extra = Object.keys(ilByKey).filter(k => k !== 'orig');
if (extra.length) console.log('                 其他语种：' + extra.map(k => k + ' ' + ilByKey[k]).join('  '));
ilSamples.forEach(s => console.log('      · ' + s));

const now = new Date().toISOString().slice(0, 10);
CN.meta.titlesSyncedAt = now;
INL.meta.titlesSyncedAt = now;

if (DRY) { console.log('  （--dry 试运行，未写盘）'); process.exit(0); }
writeCatalog('cn-catalog.js', 'CALR_CN_CATALOG', CN);
writeCatalog('intl-catalog.js', 'CALR_INTL_CATALOG', INL);
