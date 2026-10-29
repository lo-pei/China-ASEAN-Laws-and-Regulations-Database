/* ==========================================================================
   CALR · 从权威存储重建分卷 JS（App 运行时加载单元）

   输入：prototype/data/laws/*.json（唯一权威）
   输出：prototype/data/{fulltext,cn,intl}/<pack>.js + fulltext/manifest.js + intl/manifest.js

   说明：分卷是**派生构建产物**，请勿手工编辑。App 行为与旧分卷保持一致：
   分卷内每个法规对象仍提供 sourceName / sourceUrl / articles 等字段。
   按 pack 逐个处理，避免一次性载入 17,616 个 JSON。

   用法：node _work/merge/build-packs.js --dry
         node _work/merge/build-packs.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const LAWS = path.join(PD, 'laws');
const DRY = process.argv.includes('--dry');

const LAYER_DIR = { fulltext: 'fulltext', cn: 'cn', intl: 'intl' };

/* ---------- 1. 读索引，按 层/分卷 分组 ---------- */
const idx = JSON.parse(fs.readFileSync(path.join(LAWS, 'index.json'), 'utf8'));
const groups = {};      // "layer|pack" -> [id]
for (const l of idx.laws) {
  const k = l.layer + '|' + l.pack;
  (groups[k] = groups[k] || []).push(l.id);
}
console.log('  权威存储 ' + idx.laws.length + ' 部，分卷 ' + Object.keys(groups).length + ' 个');

/* ---------- 2. 字段顺序（可读性） ---------- */
const LAW_ORDER = ['id', 'coverage', 'language', 'sourceName', 'sourceUrl', 'fetchedAt', 'articleCount',
  'structureMode', 'title', 'level', 'category', 'status', 'topics', 'docNumber', 'issuingBody',
  'promulgatedDate', 'effectiveDate', 'versionDate', 'amendedNote', 'officialCode', 'pdfs',
  'completenessNote', 'textQuality', 'ocrNoisySections', 'sourceFile', 'country', 'countryName', 'layer', 'articles'];
const ART_ORDER = ['id', 'no', 'noLabel', 'chapter', 'heading', 'text', 'paragraphs', 'sourceUrl', 'status', 'amendedNote'];

function orderKeys(o, order) {
  const out = {};
  /* noLabel 是 SKILL 规定的必填字段（verify-data 的 ARTICLE_REQUIRED 会查），
     即便值为空对象也必须原样写出，否则整条分卷条目会被判「缺少 noLabel」。 */
  for (const k of order) if (k === 'noLabel' ? o[k] !== undefined && o[k] !== null : (o[k] !== undefined && o[k] !== null && !(Array.isArray(o[k]) && o[k].length === 0) && !(typeof o[k] === 'object' && !Array.isArray(o[k]) && Object.keys(o[k]).length === 0))) out[k] = o[k];
  for (const k of Object.keys(o)) if (!(k in out) && k !== 'articles' && k !== 'chars') {
    const v = o[k];
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
    out[k] = v;
  }
  return out;
}

/* JSON 记录 → 分卷内法规对象（source 还原为扁平 sourceName/sourceUrl） */
function toPackLaw(rec) {
  const o = Object.assign({}, rec);
  o.sourceName = (rec.source && rec.source.name) || '';
  o.sourceUrl = (rec.source && rec.source.url) || '';
  delete o.source;
  delete o.duplicateOf;
  o.articles = (rec.articles || []).map(a => orderKeys(a, ART_ORDER));
  return orderKeys(o, LAW_ORDER);
}

/* ---------- 3. 逐分卷写出 ---------- */
const written = {};
const manifestIntl = { files: [], byLaw: {} };
const manifestFt = { byLaw: {} };
let nLaw = 0, nArt = 0, nMeta = 0;

for (const key of Object.keys(groups).sort()) {
  const [layer, pack] = key.split('|');
  const dir = LAYER_DIR[layer];
  if (!dir) { console.error('  ✗ 未知层 ' + layer); continue; }
  const ids = groups[key].sort();
  const lines = [];
  const metaLines = [];
  let arts = 0;
  let country = null;

  for (const id of ids) {
    const rec = JSON.parse(fs.readFileSync(path.join(LAWS, id + '.json'), 'utf8'));
    const pl = toPackLaw(rec);
    if (rec.fulltextMeta) { nMeta++; metaLines.push('  META[' + JSON.stringify(id) + '] = ' + JSON.stringify(rec.fulltextMeta) + ';'); }
    lines.push('  FT["' + id + '"] = ' + JSON.stringify(pl) + ';');
    arts += (rec.articles || []).length;
    if (!country && rec.country) country = rec.country;
    nLaw++; nArt += (rec.articles || []).length;
  }

  const isCn = layer === 'cn';
  const header =
    '/* CALR · ' + layer + ' 分卷 ' + pack + '（由 _work/merge/build-packs.js 从 prototype/data/laws/ 自动生成，请勿手工编辑） */\n' +
    '(function (root) {\n  \'use strict\';\n  var FT = root.CALR_FULLTEXT = root.CALR_FULLTEXT || {};\n' +
    (metaLines.length ? '  var META = root.CALR_FULLTEXT_META = root.CALR_FULLTEXT_META || {};\n' : '');
  const footer = '})(typeof window !== \'undefined\' ? window : globalThis);\n';
  const body = header + (metaLines.length ? metaLines.join('\n') + '\n' : '') + lines.join('\n') + '\n' + footer;

  const outFile = path.join(PD, dir, pack + '.js');
  if (!DRY) fs.writeFileSync(outFile, body, 'utf8');
  written[layer] = (written[layer] || 0) + 1;

  if (layer === 'intl') {
    manifestIntl.files.push({ file: pack, country: country, laws: ids, articles: arts });
    ids.forEach(id => { manifestIntl.byLaw[id] = pack; });
  } else if (layer === 'fulltext') {
    manifestFt.files = manifestFt.files || [];
    manifestFt.files.push(pack);
    ids.forEach(id => { manifestFt.byLaw[id] = pack; });
  }
}

/* ---------- 3b. 清理不再生成的分卷（否则会残留旧分卷，App 可能加载到已归档法规） ---------- */
let removedPacks = 0;
if (!DRY) {
  const expect = {};
  for (const key of Object.keys(groups)) {
    const [layer, pack] = key.split('|');
    if (LAYER_DIR[layer]) expect[LAYER_DIR[layer] + '/' + pack] = true;
  }
  for (const dir of ['intl', 'cn', 'fulltext']) {
    const d = path.join(PD, dir);
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.js') || f === 'manifest.js') continue;
      if (!expect[dir + '/' + f.replace(/\.js$/, '')]) { fs.unlinkSync(path.join(d, f)); removedPacks++; }
    }
  }
}

/* ---------- 4. manifest ---------- */
if (!DRY) {
  manifestIntl.files.sort((a, b) => a.file < b.file ? -1 : 1);
  const intlOut =
    '/* CALR · 东盟法律全文分卷索引（由 _work/merge/build-packs.js 自动生成） */\n' +
    '(function (root) {\n  \'use strict\';\n  root.CALR_INTL_MANIFEST = ' +
    JSON.stringify(manifestIntl, null, 1) + ';\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
  fs.writeFileSync(path.join(PD, 'intl', 'manifest.js'), intlOut, 'utf8');

  manifestFt.files.sort();
  const ftOut =
    '/* ==========================================================================\n' +
    '   CALR · data/fulltext/manifest.js\n' +
    '   官方全文文件索引（由 _work/merge/build-packs.js 自动生成，请勿手工编辑）\n' +
    '   规范见 docs/06-全文数据规范.md\n' +
    '   ========================================================================== */\n' +
    '(function (root) {\n  \'use strict\';\n  root.CALR_FULLTEXT_MANIFEST = ' +
    JSON.stringify({ version: '1.0.0', updatedAt: new Date().toISOString().slice(0, 10), files: manifestFt.files, byLaw: manifestFt.byLaw }, null, 1) +
    ';\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
  fs.writeFileSync(path.join(PD, 'fulltext', 'manifest.js'), ftOut, 'utf8');
}

console.log('');
console.log(DRY ? '【试运行，未写盘】' : '【已写盘】');
console.log('  分卷写出 ' + JSON.stringify(written) + (removedPacks ? '，清理废弃分卷 ' + removedPacks + ' 个' : ''));
console.log('  法规 ' + nLaw + ' / 条文 ' + nArt + ' / CALR_FULLTEXT_META ' + nMeta + ' 条');
console.log('  intl/manifest.js：' + manifestIntl.files.length + ' 个分卷，byLaw ' + Object.keys(manifestIntl.byLaw).length);
console.log('  fulltext/manifest.js：' + (manifestFt.files || []).length + ' 个文件，byLaw ' + Object.keys(manifestFt.byLaw).length);
