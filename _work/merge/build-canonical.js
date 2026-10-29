/* ==========================================================================
   CALR · 两批数据合并 → 统一权威存储
   决策（已确认）：
     · 方案 A 双轨：laws/<ID>.json 为唯一权威，分卷 JS 由 build-packs.js 派生
     · text 保留对象 {lang:"…"}（不破坏译文层 mergeTrans）
     · 超集 schema：dataset 骨架 + 补回 prototype 的 12 类增量字段
     · 去重：A 层优先 → id 字典序最小；冗余者归档不物理删除
     · 完整执行：补入 314 部 + 去重 + 清理

   用法：node _work/merge/build-canonical.js --dry
         node _work/merge/build-canonical.js
   ========================================================================== */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const DS = path.join(ROOT, 'dataset', 'data');
const OUT = path.join(PD, 'laws');
const ARCHIVE = path.join(ROOT, '_work', 'dedup-archive');
const DRY = process.argv.includes('--dry');

const CN_NAME = { CN: '中国', VN: '越南', TH: '泰国', ID: '印度尼西亚', MY: '马来西亚', SG: '新加坡',
  PH: '菲律宾', BN: '文莱', KH: '柬埔寨', LA: '老挝', MM: '缅甸', TL: '东帝汶', XX: '多边' };
const LAYER_RANK = { fulltext: 0, cn: 1, intl: 2 };

/* ---------- 1. 载入全部分卷 ---------- */
const meta = {};          // id -> { layer, pack, obj }
for (const layer of ['fulltext', 'cn', 'intl']) {
  const d = path.join(PD, layer);
  if (!fs.existsSync(d)) continue;
  const files = fs.readdirSync(d).filter(f => f.endsWith('.js') && f !== 'manifest.js');
  for (const f of files) {
    const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
    try { vm.runInContext(fs.readFileSync(path.join(d, f), 'utf8'), c, { filename: f }); }
    catch (e) { console.error('  ✗ 载入失败 ' + layer + '/' + f + '：' + e.message); continue; }
    const FT = c.CALR_FULLTEXT || {};
    for (const id of Object.keys(FT)) {
      const o = FT[id];
      if (!o || typeof o !== 'object') continue;
      /* 层级优先级：同一 id 在多层出现时保留更高优先层（fulltext > cn > intl） */
      const prev = meta[id];
      if (prev && LAYER_RANK[prev.layer] <= LAYER_RANK[layer]) continue;
      meta[id] = { layer, pack: f.replace(/\.js$/, ''), obj: o };
    }
  }
  console.log('  已载入 ' + layer.padEnd(9) + files.length + ' 个分卷');
}
const ids = Object.keys(meta);
console.log('  源法规合计 ' + ids.length + ' 部（按层优先级去重后）');

/* ---------- 2. 载入 dataset 独有字段 ---------- */
const dsIdx = {};
try {
  const j = JSON.parse(fs.readFileSync(path.join(DS, 'index.json'), 'utf8'));
  (j.laws || []).forEach(l => { dsIdx[l.id] = l; });
  console.log('  dataset 索引 ' + Object.keys(dsIdx).length + ' 部');
} catch (e) { console.error('  dataset index 载入失败：' + e.message); }

/* ---------- 3. 内容指纹去重 ---------- */
const crypto = require('crypto');
const flat = (t) => typeof t === 'string' ? t : (t && typeof t === 'object' ? Object.values(t).filter(Boolean).join('\n') : '');
const canon = (s) => String(s || '').replace(/[\s\u3000]+/g, '').toLowerCase();
function fingerprint(o) {
  const a = (o.articles || []);
  return crypto.createHash('sha1').update((o.language || '') + '¦' + a.length + '¦' + a.map(x => canon(flat(x.text))).join('¦')).digest('hex');
}
const byFp = {};
for (const id of ids) (byFp[fingerprint(meta[id].obj)] = byFp[fingerprint(meta[id].obj)] || []).push(id);
const dupGroups = Object.values(byFp).filter(v => v.length > 1);
const drop = {};   // loserId -> winnerId
for (const g of dupGroups) {
  const sorted = g.slice().sort((a, b) => {
    const ra = LAYER_RANK[meta[a].layer], rb = LAYER_RANK[meta[b].layer];
    if (ra !== rb) return ra - rb;              // A 层优先
    return a < b ? -1 : 1;                      // 再按 id 字典序最小
  });
  const win = sorted[0];
  sorted.slice(1).forEach(x => { drop[x] = win; });
}
console.log('  去重组 ' + dupGroups.length + '，冗余法规 ' + Object.keys(drop).length + ' 部');

/* ---------- 4. 归一化 ---------- */
function asLangMap(v, lang) {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') { const s = v.trim(); return s ? { [lang || 'zh']: s } : null; }
  if (typeof v === 'object' && !Array.isArray(v)) {
    const o = {};
    for (const k of Object.keys(v)) { const s = v[k]; if (s !== undefined && s !== null && String(s).trim()) o[k] = String(s); }
    return Object.keys(o).length ? o : null;
  }
  return null;
}
function firstVal(map, lang) {
  if (!map) return null;
  if (map[lang] !== undefined) return map[lang];
  if (map.zh !== undefined) return map.zh;
  const k = Object.keys(map)[0];
  return k ? map[k] : null;
}
function pick() { for (let i = 0; i < arguments.length; i++) { const v = arguments[i]; if (v !== undefined && v !== null && v !== '') return v; } return null; }

function buildTitle(o, m, ds) {
  let t = { zh: null, en: null, orig: null };
  const lang = o.language;
  const src = asLangMap(o.title, lang);
  if (src) for (const k of Object.keys(src)) { if (t[k] === null) t[k] = src[k]; }
  if (o.titleEn && !t.en) t.en = String(o.titleEn);
  /* dataset 侧补充 */
  if (ds && ds.title) {
    if (!t.zh && ds.title.zh) t.zh = ds.title.zh;
    if (!t.en && ds.title.en) t.en = ds.title.en;
    if (!t.orig && ds.title.orig) t.orig = ds.title.orig;
  }
  /* dataset 索引 titleEn */
  const di = dsIdx[o.id];
  if (di && di.titleEn && !t.en) t.en = di.titleEn;
  if (di && di.title && !t.zh && !t.en && !t.orig) {
    /* index.title 是 zh||en||orig 的择一值，按是否含 CJK 归位 */
    if (/[\u4e00-\u9fff]/.test(di.title)) t.zh = di.title; else t.en = di.title;
  }
  if (t.zh === null && t.en === null && t.orig === null) return { zh: null, en: null, orig: null };
  return t;
}

function normArticles(o, m, ds) {
  const lang = o.language;
  const dsArts = {};
  if (ds && Array.isArray(ds.articles)) ds.articles.forEach(a => { dsArts[a.no] = a; });
  return (o.articles || []).map(a => {
    const rec = { id: a.id || (o.id + '-A' + a.no), no: a.no };
    rec.noLabel = asLangMap(a.noLabel, lang) || (dsArts[a.no] && dsArts[a.no].noLabel ? { [lang]: dsArts[a.no].noLabel } : null);
    const ch = asLangMap(a.chapter, lang) || (dsArts[a.no] && dsArts[a.no].chapter ? { [lang]: dsArts[a.no].chapter } : null);
    if (ch) rec.chapter = ch;
    const hd = asLangMap(a.heading, lang) || (dsArts[a.no] && dsArts[a.no].heading ? { [lang]: dsArts[a.no].heading } : null);
    if (hd) rec.heading = hd;
    let tx = asLangMap(a.text, lang);
    if (!tx && dsArts[a.no] && dsArts[a.no].text) tx = { [lang]: dsArts[a.no].text };
    rec.text = tx || { [lang]: '' };
    if (a.paragraphs && a.paragraphs.length) rec.paragraphs = a.paragraphs;
    if (a.sourceUrl) rec.sourceUrl = a.sourceUrl;
    if (a.status) rec.status = a.status;
    if (a.amendedNote) rec.amendedNote = a.amendedNote;
    return rec;
  });
}

function normLaw(id) {
  const m = meta[id], o = m.obj, layer = m.layer;
  let ds = null;
  const dsf = path.join(DS, id + '.json');
  if (fs.existsSync(dsf)) { try { ds = JSON.parse(fs.readFileSync(dsf, 'utf8')); } catch (e) { } }
  const di = dsIdx[id] || null;
  const articles = normArticles(o, m, ds);
  const lang = o.language;
  const chars = articles.reduce((s, a) => s + (firstVal(a.text, lang) || '').length, 0);
  const country = pick(o.country, ds && ds.country, di && di.country,
    layer === 'cn' ? 'CN' : null, id.startsWith('CN-') ? 'CN' : (/^[A-Z]{2}$/.test(id.slice(0, 2)) ? id.slice(0, 2) : null));

  const rec = {
    id: id,
    title: buildTitle(Object.assign({}, o, { id: id }), m, ds),
    country: country,
    countryName: CN_NAME[country] || country,
    layer: layer,
    pack: m.pack,
    language: lang || null,
    level: pick(o.level, ds && ds.level, di && di.level),
    category: pick(o.category, ds && ds.category, di && di.category),
    status: pick(o.status, ds && ds.status, di && di.status),
    promulgatedDate: pick(o.promulgatedDate, ds && ds.promulgatedDate, di && di.promulgatedDate),
    effectiveDate: pick(o.effectiveDate, ds && ds.effectiveDate, di && di.effectiveDate),
    versionDate: pick(o.versionDate, ds && ds.versionDate, di && di.versionDate),
    amendedNote: pick(o.amendedNote, ds && ds.amendedNote, di && di.amendedNote),
    issuingBody: (function () { const v = asLangMap(o.issuingBody, lang); return v ? firstVal(v, lang) : pick(ds && ds.issuingBody, di && di.issuingBody); })(),
    docNumber: pick(o.docNumber, ds && ds.docNumber, di && di.docNumber),
    officialCode: pick(o.officialCode, null),
    topics: Array.isArray(o.topics) ? o.topics : [],
    coverage: pick(o.coverage, ds && ds.coverage, 'full'),
    structureMode: pick(o.structureMode, ds && ds.structureMode),
    structure: o.structure || null,
    articleCount: articles.length,
    chars: chars,
    source: {
      name: pick(o.sourceName, ds && ds.source && ds.source.name, di && di.sourceUrl ? null : null),
      url: pick(o.sourceUrl, ds && ds.source && ds.source.url, di && di.sourceUrl)
    },
    sourceFile: pick(o.sourceFile, ds && ds.sourceFile, di && di.file ? null : null),
    fetchedAt: pick(o.fetchedAt, ds && ds.fetchedAt),
    completenessNote: pick(o.completenessNote, null),
    textQuality: o.textQuality || null,
    ocrNoisySections: o.ocrNoisySections || null,
    pdfs: o.pdfs || null,
    duplicateOf: drop[id] || null,
    articles: articles
  };
  /* 空值清理：source.name/url 都为 null 时保留 null（与 dataset 一致） */
  return rec;
}

/* ---------- 5. 写出 ---------- */
if (!DRY) {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE, { recursive: true });
}
const index = [];
let totArts = 0, totChars = 0, written = 0, archived = 0;
const byLayer = {}, byCountry = {}, byLang = {};
const noTitle = [];

for (const id of ids.sort()) {
  const rec = normLaw(id);
  if (rec.duplicateOf) {
    archived++;
    if (!DRY) fs.writeFileSync(path.join(ARCHIVE, id + '.json'), JSON.stringify({ duplicateOf: rec.duplicateOf, layer: rec.layer, articleCount: rec.articleCount, source: rec.source }, null, 1), 'utf8');
    continue;
  }
  if (!DRY) fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(rec, null, 1), 'utf8');
  written++;
  totArts += rec.articleCount; totChars += rec.chars;
  byLayer[rec.layer] = (byLayer[rec.layer] || 0) + 1;
  byCountry[rec.countryName] = (byCountry[rec.countryName] || 0) + 1;
  byLang[rec.language] = (byLang[rec.language] || 0) + 1;
  if (!rec.title.zh && !rec.title.en && !rec.title.orig) noTitle.push(id);
  index.push({
    id: id, file: id + '.json',
    title: rec.title.zh || rec.title.en || rec.title.orig,
    titleEn: rec.title.en,
    country: rec.country, countryName: rec.countryName,
    layer: rec.layer, pack: rec.pack, language: rec.language,
    level: rec.level, category: rec.category, status: rec.status,
    promulgatedDate: rec.promulgatedDate, effectiveDate: rec.effectiveDate,
    versionDate: rec.versionDate, amendedNote: rec.amendedNote,
    issuingBody: rec.issuingBody, docNumber: rec.docNumber,
    articleCount: rec.articleCount, chars: rec.chars,
    sourceUrl: rec.source.url
  });
}

const indexObj = {
  meta: {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'prototype/data（A 法域全文层 / B 中国全量层 / C 东盟分卷层）+ dataset/data（2026-10-07 快照）',
    generator: '_work/merge/build-canonical.js',
    note: '每部法规一个 JSON（文件名 = 法规ID）。本目录为唯一权威存储；prototype/data/{intl,cn,fulltext}/*.js 由 _work/merge/build-packs.js 从本目录派生生成，请勿手工编辑那些分卷。',
    lawCount: index.length,
    articleCount: totArts,
    chars: totChars,
    byLayer: byLayer, byCountry: byCountry, byLanguage: byLang,
    dedupArchived: archived
  },
  laws: index
};
if (!DRY) fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(indexObj, null, 1), 'utf8');

console.log('');
console.log(DRY ? '【试运行，未写盘】' : '【已写盘】');
console.log('  写出法规 ' + written + ' 部 → ' + OUT);
console.log('  归档冗余 ' + archived + ' 部 → ' + ARCHIVE);
console.log('  条文 ' + totArts + ' 条 / 正文 ' + totChars + ' 字');
console.log('  按层 ' + JSON.stringify(byLayer));
console.log('  按国别 ' + JSON.stringify(byCountry));
console.log('  按语言 ' + JSON.stringify(byLang));
console.log('  无任何名称的法规 ' + noTitle.length + ' 部' + (noTitle.length ? '（例：' + noTitle.slice(0, 5).join(', ') + '）' : ''));
