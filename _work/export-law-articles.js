/* ==========================================================================
   CALR · 法条正文导出器
   把四层存储中的条文正文导出为「每法一个 JSON + 总索引」。
   用法： node _work/export-law-articles.js [输出目录]
   默认输出： deliverables/law-articles-json/
   ========================================================================== */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const R = path.join(ROOT, 'prototype', 'data');
const OUT = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'deliverables', 'law-articles-json');

const CN_NAME = { CN: '中国', VN: '越南', TH: '泰国', ID: '印度尼西亚', MY: '马来西亚', SG: '新加坡',
  PH: '菲律宾', BN: '文莱', KH: '柬埔寨', LA: '老挝', MM: '缅甸', TL: '东帝汶', XX: '多边' };
const LAYER_NAME = { fulltext: 'A 法域全文层（预加载·重点法）', cn: 'B 中国全量层', intl: 'C 东盟分卷层', trans: 'D 译文层' };

function load(files) {
  const c = { window: {}, document: {} };
  c.window = c;
  vm.createContext(c);
  (Array.isArray(files) ? files : [files]).forEach(f =>
    vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), c, { filename: f }));
  return c;
}
function listPackFiles(dir, re) {
  const d = path.join(R, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter(f => re.test(f));
}

/* ---------- 1. 元数据（按权威度合并：dataset-core > intl-catalog > cn-catalog） ---------- */
const meta = {};
function mergeMeta(id, obj) { meta[id] = Object.assign({}, meta[id] || {}, obj); }
try {
  const core = load(['dataset-core.js', 'dataset-extra.js']);
  (core.CALR_DATA_CORE.laws || []).forEach(l => mergeMeta(l.id, l));
} catch (e) { console.error('dataset-core 载入失败：' + e.message); }
const ic = load('intl-catalog.js').CALR_INTL_CATALOG || { laws: [] };
const icMap = {}; (ic.laws || []).forEach(l => { icMap[l.id] = l; mergeMeta(l.id, l); });
const cnc = load('cn-catalog.js').CALR_CN_CATALOG || { laws: [] };
const cnMap = {}; (cnc.laws || []).forEach(l => { cnMap[l.id] = l; if (!meta[l.id]) mergeMeta(l.id, { id: l.id, title: { zh: l.title } , _cn: l }); else meta[l.id]._cn = l; });

/* ---------- 2. 条文正文（优先级：fulltext > cn > intl，避免重复输出） ---------- */
const texts = {};      // lawId -> { layer, pack, obj }
const layerOrder = ['fulltext', 'cn', 'intl'];
const srcSpec = {
  fulltext: { re: /\.js$/, skip: /^manifest\.js$/ },
  cn: { re: /^cn-p\d+\.js$/ },
  intl: { re: /^[a-z]{2}-p\d+\.js$/ },
};
for (const layer of layerOrder) {
  for (const f of listPackFiles(layer, srcSpec[layer].re)) {
    if (srcSpec[layer].skip && srcSpec[layer].skip.test(f)) continue;
    let FT;
    try { FT = load(path.join(layer, f)).CALR_FULLTEXT || {}; } catch (e) { console.error('载入失败 ' + layer + '/' + f + '：' + e.message); continue; }
    for (const [id, obj] of Object.entries(FT)) {
      if (!obj || !obj.articles) continue;
      if (!texts[id]) texts[id] = { layer, pack: f.replace(/\.js$/, ''), obj };
    }
  }
}

/* ---------- 3. 组装每法 JSON ---------- */
function pick(m, keys) { for (const k of keys) { if (m && m[k] !== undefined && m[k] !== null && m[k] !== '') return m[k]; } return null; }
function firstVal(map, lang) { if (!map) return null; return map[lang] !== undefined ? map[lang] : (map.zh !== undefined ? map.zh : (Object.values(map)[0] || null)); }
/* 严格取键：缺失即返回 null（不做跨语言回退，避免 zh 冒充 en） */
function strict(map, key) { return (map && map[key] !== undefined && map[key] !== null && map[key] !== '') ? map[key] : null; }
function cleanArticles(obj) {
  const lang = obj.language;
  return (obj.articles || []).map(a => {
    const rec = { no: a.no, noLabel: firstVal(a.noLabel, lang) };
    const ch = firstVal(a.chapter, lang);
    if (ch) rec.chapter = ch;
    const hd = a.heading ? firstVal(a.heading, lang) : null;
    if (hd) rec.heading = hd;
    rec.text = (a.text && a.text[lang] !== undefined) ? a.text[lang] : '';
    return rec;
  });
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const index = [];
let totArts = 0, totChars = 0;
const byLayer = {}, byCountry = {}, byLang = {};
const dupOrphans = [];

for (const id of Object.keys(texts).sort()) {
  const t = texts[id], o = t.obj, lang = o.language;
  const m = meta[id] || {};
  const cnRec = m._cn || cnMap[id] || null;
  const country = m.country || (t.layer === 'cn' ? 'CN' : null) ||
    (id.startsWith('CN-') ? 'CN' : (id.slice(0, 2).match(/^[A-Z]{2}$/) ? id.slice(0, 2) : null));
  const articles = cleanArticles(o);
  const chars = articles.reduce((s, a) => s + (a.text ? a.text.length : 0), 0);

  const rec = {
    id: id,
    title: {
      zh: strict(m.title, 'zh') || (cnRec ? cnRec.title : null),
      en: strict(m.title, 'en'),
      orig: strict(m.title, 'orig')
    },
    country: country,
    countryName: CN_NAME[country] || country,
    layer: t.layer,
    pack: t.pack,
    language: lang,
    level: pick(m, ['level']) || (cnRec ? cnRec.level : null),
    category: cnRec ? cnRec.category : null,
    status: pick(m, ['status']),
    promulgatedDate: pick(m, ['promulgatedDate']) || (cnRec ? cnRec.date : null),
    effectiveDate: pick(m, ['effectiveDate']),
    issuingBody: firstVal(m.issuingBody, 'zh') || (cnRec ? cnRec.issuingBody : null),
    docNumber: pick(m, ['docNumber']) || (cnRec ? cnRec.docNumber : null),
    coverage: o.coverage || 'full',
    structureMode: o.structureMode || null,
    articleCount: articles.length,
    chars: chars,
    source: { name: o.sourceName || pick(m, ['source']) && m.source.name || null, url: o.sourceUrl || (m.source && m.source.url) || null },
    sourceFile: cnRec ? cnRec.sourceFile : null,
    fetchedAt: o.fetchedAt || null,
    articles: articles
  };

  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(rec, null, 1), 'utf8');

  index.push({
    id: id, file: id + '.json', title: rec.title.zh || rec.title.en || rec.title.orig,
    titleEn: rec.title.en || null, country: rec.country, countryName: rec.countryName,
    layer: rec.layer, pack: rec.pack, language: rec.language, level: rec.level,
    category: rec.category, status: rec.status,
    promulgatedDate: rec.promulgatedDate, effectiveDate: rec.effectiveDate,
    issuingBody: rec.issuingBody, docNumber: rec.docNumber,
    articleCount: rec.articleCount, chars: rec.chars,
    sourceUrl: rec.source.url
  });

  totArts += articles.length; totChars += chars;
  byLayer[t.layer] = (byLayer[t.layer] || 0) + 1;
  byCountry[rec.countryName] = (byCountry[rec.countryName] || 0) + 1;
  byLang[lang] = (byLang[lang] || 0) + 1;
}

const indexObj = {
  meta: {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'prototype/data（CALR 四层存储：A 法域全文层 / B 中国全量层 / C 东盟分卷层）',
    generator: '_work/export-law-articles.js',
    note: '每部法规一个 JSON（文件名 = 法规ID，与 index.laws[].file 对应）；articles[].text 为该法原文条文正文，逐字未改写。',
    lawCount: index.length,
    articleCount: totArts,
    chars: totChars,
    byLayer: byLayer,
    byCountry: byCountry,
    byLanguage: byLang
  },
  laws: index
};
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(indexObj, null, 1), 'utf8');

console.log('导出完成 → ' + OUT);
console.log('  法规 ' + index.length + ' 部 / 条文 ' + totArts + ' 条 / 正文 ' + totChars + ' 字');
console.log('  按层: ' + JSON.stringify(byLayer));
console.log('  按语言: ' + JSON.stringify(byLang));
console.log('  国家数: ' + Object.keys(byCountry).length);
