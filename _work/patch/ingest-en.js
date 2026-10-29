/* 补译入库：把 _work/patch/out/*.json 合并进 D 层分卷，并回填 manifest.js
 * 用法：node _work/patch/ingest-en.js [--dry]
 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const TR = path.join(ROOT, 'prototype', 'data', 'trans');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const OUT = path.join(__dirname, 'out');
const DRY = process.argv.includes('--dry');
const TODAY = new Date().toISOString().slice(0, 10);

// 1. 读回执
const items = [];
for (const f of fs.readdirSync(OUT).filter(x => x.endsWith('.json'))) {
  items.push(JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')));
}
if (!items.length) { console.log('out/ 为空'); process.exit(0); }

// 2. 按 pack 分组
const packs = {};
for (const it of items) {
  const meta = JSON.parse(fs.readFileSync(path.join(LAWS, it.lawId + '.json'), 'utf8'));
  const pack = it.pack || meta.pack;
  (packs[pack] = packs[pack] || []).push({ it, meta });
}

// 3. 逐分卷写出
const readBack = file => {
  const fp = path.join(TR, file);
  if (!fs.existsSync(fp)) return {};
  const sb = { window: {} }; sb.window = sb; vm.createContext(sb);
  try { vm.runInContext(fs.readFileSync(fp, 'utf8'), sb, {}); return sb.CALR_TRANS || {}; } catch (e) { return {}; }
};

const manifestPath = path.join(TR, 'manifest.js');
const msb = { window: {} }; msb.window = msb; vm.createContext(msb);
vm.runInContext(fs.readFileSync(manifestPath, 'utf8'), msb, {});
const MAN = msb.CALR_TRANS_MANIFEST;

const written = [];
for (const pack of Object.keys(packs).sort()) {
  const file = pack + '.en';
  const old = readBack(file);
  const entries = [];
  for (const { it, meta } of packs[pack].sort((a, b) => a.it.lawId.localeCompare(b.it.lawId))) {
    const prev = old[it.lawId];
    const map = new Map();
    for (const a of ((prev && prev.articles) || [])) map.set(String(a.no), a);
    for (const a of it.articles) map.set(String(a.no), a);
    const articles = [...map.values()].map(a => ({
      no: a.no,
      text: { en: (a.text && a.text.en) || a.en },
      noLabel: { en: (a.noLabel && a.noLabel.en) || a.noLabel || ('Article ' + a.no) },
    }));
    entries.push({
      lawId: it.lawId,
      sourceLang: it.sourceLang,
      targetLang: 'en',
      engine: 'llm',
      model: it.model || 'deepseek-v4.1-flash',
      promptVersion: 'calr-patch-en-v1',
      translatedAt: TODAY,
      reviewed: 'machine',
      completenessNote: '补译缺口条文；条号与原文一一对应。',
      articles,
    });
  }
  // 保留分卷内本次未涉及的既有法规
  for (const [k, v] of Object.entries(old)) {
    if (!entries.find(e => e.lawId === k)) entries.push(v);
  }
  entries.sort((a, b) => a.lawId.localeCompare(b.lawId));

  const total = entries.reduce((s, e) => s + e.articles.length, 0);
  const head =
    '/* ==========================================================================\n' +
    '   CALR · D 译文层（与官方原文物理分离）\n' +
    '   目标语言: en   来源分卷: ' + pack + '\n' +
    '   法规 ' + entries.length + ' 部 / 译文 ' + total + ' 条\n' +
    '   由 _work/patch/ingest-en.js 生成，请勿手工编辑。\n' +
    '   ========================================================================== */\n' +
    "(function (root) {\n  'use strict';\n  var TR = root.CALR_TRANS = root.CALR_TRANS || {};\n\n";
  const body = entries.map(e => '  TR[' + JSON.stringify(e.lawId) + '] = ' +
    JSON.stringify(e, null, 2).split('\n').join('\n  ') + ';\n').join('\n');
  const text = head + body + "\n})(typeof window !== 'undefined' ? window : globalThis);\n";

  if (!DRY) fs.writeFileSync(path.join(TR, file + '.js'), text, 'utf8');

  // manifest：files
  let rec = (MAN.files || []).find(x => x.file === file);
  if (!rec) { rec = { file, pack, country: entries[0].lawId.split('-')[0], sourceLang: entries[0].sourceLang, targetLang: 'en', laws: [], articles: 0, engine: 'llm', model: 'deepseek-v4.1-flash', reviewed: 'machine' }; MAN.files.push(rec); }
  rec.laws = entries.map(e => e.lawId);
  rec.articles = total;
  rec.sourceLang = entries[0].sourceLang;
  // manifest：byLaw
  MAN.byLaw = MAN.byLaw || {};
  for (const e of entries) {
    MAN.byLaw[e.lawId] = Object.assign({}, MAN.byLaw[e.lawId], { en: file });
  }
  written.push({ file, laws: entries.length, articles: total });
  console.log('写出 %s.js  法规 %d 部 / %d 条', file, entries.length, total);
}

if (!DRY) {
  MAN.updatedAt = TODAY;
  const head =
    '/* ==========================================================================\n' +
    '   CALR · D 译文层索引（由 _work/patch/ingest-en.js 维护）\n' +
    '   译文与官方原文物理分离；界面读取时在内存中合并。\n' +
    '   ========================================================================== */\n' +
    "(function (root) {\n  'use strict';\n  root.CALR_TRANS_MANIFEST = " +
    JSON.stringify(MAN, null, 2).split('\n').join('\n  ') +
    ";\n})(typeof window !== 'undefined' ? window : globalThis);\n";
  fs.writeFileSync(manifestPath, head, 'utf8');
  console.log('manifest.js 已回填（files %d / byLaw %d）', MAN.files.length, Object.keys(MAN.byLaw).length);
}
if (DRY) console.log('（试运行，未写文件）');
