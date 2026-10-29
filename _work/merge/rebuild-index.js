/* 从 laws/*.json 重建 laws/index.json（权威存储被增删后必须重跑） */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const DRY = process.argv.includes('--dry');

const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const index = [];
let totArts = 0, totChars = 0;
const byLayer = {}, byCountry = {}, byLang = {};
for (const f of files.sort()) {
  const rec = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  if (rec.duplicateOf) continue;
  index.push({
    id: rec.id, file: rec.id + '.json',
    title: (rec.title && (rec.title.zh || rec.title.en || rec.title.orig)) || null,
    titleEn: (rec.title && rec.title.en) || null,
    country: rec.country, countryName: rec.countryName,
    layer: rec.layer, pack: rec.pack, language: rec.language,
    level: rec.level, category: rec.category, status: rec.status,
    promulgatedDate: rec.promulgatedDate, effectiveDate: rec.effectiveDate,
    versionDate: rec.versionDate, amendedNote: rec.amendedNote,
    issuingBody: rec.issuingBody, docNumber: rec.docNumber,
    articleCount: rec.articleCount, chars: rec.chars,
    sourceUrl: rec.source ? rec.source.url : null
  });
  totArts += rec.articleCount || 0; totChars += rec.chars || 0;
  byLayer[rec.layer] = (byLayer[rec.layer] || 0) + 1;
  byCountry[rec.countryName] = (byCountry[rec.countryName] || 0) + 1;
  byLang[rec.language] = (byLang[rec.language] || 0) + 1;
}
let prev = null;
try { prev = JSON.parse(fs.readFileSync(path.join(LAWS, 'index.json'), 'utf8')).meta; } catch (e) { }
const indexObj = {
  meta: {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: prev ? prev.source : 'prototype/data（A 法域全文层 / B 中国全量层 / C 东盟分卷层）+ dataset/data',
    generator: '_work/merge/rebuild-index.js',
    note: '每部法规一个 JSON（文件名 = 法规ID）。本目录为唯一权威存储；prototype/data/{intl,cn,fulltext}/*.js 由 _work/merge/build-packs.js 从本目录派生生成，请勿手工编辑那些分卷。',
    lawCount: index.length,
    articleCount: totArts,
    chars: totChars,
    byLayer: byLayer, byCountry: byCountry, byLanguage: byLang,
    dedupArchived: prev ? prev.dedupArchived : null,
    crossLayerDedup: (function () { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'prototype', 'data', 'intl-catalog.js'), 'utf8')).meta; } catch (e) { return null; } })() ? undefined : undefined
  },
  laws: index
};
/* 记录跨层治理数量 */
try {
  const c = { window: {}, document: {} }; c.window = c; require('vm').createContext(c);
  require('vm').runInContext(fs.readFileSync(path.join(ROOT, 'prototype', 'data', 'intl-catalog.js'), 'utf8'), c);
  const cl = c.CALR_INTL_CATALOG.meta.crossLayerDedup;
  if (cl) indexObj.meta.crossLayerArchived = cl.archivedCount;
} catch (e) { }
if (!DRY) fs.writeFileSync(path.join(LAWS, 'index.json'), JSON.stringify(indexObj, null, 1), 'utf8');
console.log(DRY ? '【试运行】' : '【已写盘】');
console.log('  laws/index.json：法规 ' + index.length + ' / 条文 ' + totArts + ' / 正文 ' + totChars);
console.log('  按层 ' + JSON.stringify(byLayer));
console.log('  按国别 ' + JSON.stringify(byCountry));
