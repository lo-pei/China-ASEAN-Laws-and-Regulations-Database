// Phase A-1：修复 catalog 与权威存储脱节
//  · 补齐：laws/ 有、catalog 没有的法规（按 CN / 非 CN 分别采用对应 schema）
//  · 移除：catalog 有、laws/ 没有的死链
//  · 重算：meta 计数、cn packs 清单
// 用法：node _work/backend/fix-catalogs.js [--dry]
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');
const LAWS = path.join(PD, 'laws');
const DRY = process.argv.includes('--dry');

const CN_NAME = { CN: '中国', VN: '越南', TH: '泰国', ID: '印度尼西亚', MY: '马来西亚', SG: '新加坡',
  PH: '菲律宾', BN: '文莱', KH: '柬埔寨', LA: '老挝', MM: '缅甸', TL: '东帝汶', XX: '多边' };

function load(rel) {
  const src = fs.readFileSync(path.join(PD, rel), 'utf8');
  const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: rel });
  return sb;
}

// ---------- 1. 权威存储 ----------
const laws = {};
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  if (o.id) laws[o.id] = o;
}
const lawIds = Object.keys(laws);
console.log('  laws/ 权威法规: ' + lawIds.length);

// ---------- 2. 现有 catalog ----------
const cnSrc = load('cn-catalog.js');
const CN = cnSrc.CALR_CN_CATALOG || { meta: {}, packs: [], laws: [] };
const inlSrc = load('intl-catalog.js');
const INL = inlSrc.CALR_INTL_CATALOG || { meta: {}, laws: [] };

const cnIds = new Set((CN.laws || []).map(x => x.id));
const inlIds = new Set((INL.laws || []).map(x => x.id));
console.log('  现有 cn-catalog  : ' + cnIds.size);
console.log('  现有 intl-catalog: ' + inlIds.size);

// ---------- 3. 死链清理 ----------
const deadCN = (CN.laws || []).filter(x => !laws[x.id]);
const deadINL = (INL.laws || []).filter(x => !laws[x.id]);
console.log('  死链 cn: ' + deadCN.length + '  intl: ' + deadINL.length);
console.log('    样例: ' + deadCN.slice(0, 3).map(x => x.id).concat(deadINL.slice(0, 3).map(x => x.id)).join(', '));

// ---------- 4. 补齐 ----------
const have = new Set([...cnIds, ...inlIds]);
const missing = lawIds.filter(id => !have.has(id));
console.log('  缺失待补: ' + missing.length);

// CN schema：store.js L111-128 消费的扁平字段
function toCNEntry(o) {
  const t = o.title || {};
  const zh = (typeof t === 'object' ? t.zh : t) || o.id;
  return {
    id: o.id,
    title: zh,
    /* 英文标题（英文界面显示「英文（中文原名）」用，见 rules/SKILL-法规标题英译规范.md） */
    titleEn: (typeof t === 'object' && t && t.en) ? t.en : null,
    category: o.category || null,
    level: o.level || 'law',
    date: o.promulgatedDate || null,
    issuingBody: (typeof o.issuingBody === 'object' && o.issuingBody) ? (o.issuingBody.zh || o.issuingBody.en || '') : (o.issuingBody || ''),
    docNumber: o.docNumber || null,
    articles: o.articleCount || (o.articles || []).length || 0,
    chars: o.chars || 0,
    pack: o.pack || null,
    structureMode: o.structureMode || 'ARTICLE',
    alreadyLoaded: false,
    sourceFile: o.sourceFile || null,
    versionDate: o.versionDate || null,
    status: o.status || 'active',
    amendedNote: o.amendedNote || null,
    effectiveDate: o.effectiveDate || null,
  };
}

// INTL schema：store.js L137-155 消费（基本与 laws/ 同构）
function toINTLEntry(o) {
  return {
    id: o.id,
    country: o.country,
    level: o.level || 'law',
    status: o.status || 'active',
    topics: o.topics || [],
    title: o.title || { zh: o.id },
    docNumber: o.docNumber || null,
    issuingBody: o.issuingBody || null,
    promulgatedDate: o.promulgatedDate || null,
    effectiveDate: o.effectiveDate || null,
    coverage: o.coverage || 'catalog',
    articleCount: o.articleCount || (o.articles || []).length || 0,
    source: o.source || null,
    summary: o.summary || { zh: '' },
    harvest: o.harvest || null,
    textLang: o.language || null,
    amendedNote: o.amendedNote || null,
    /* 以下字段在 App 代码中引用次数为 0（实测 grep），不放进 catalog 以缩小体积：
       trace / completeness / titleNote / fulltextKey / promulgatedDatePrecision /
       traceSuperseded / titleRaw / titleFixed / textQuality。
       它们仍完整保留在权威存储 prototype/data/laws/<id>.json 里。 */
  };
}

const addCN = [], addINL = [];
for (const id of missing) {
  const o = laws[id];
  if (o.country === 'CN') addCN.push(toCNEntry(o));
  else addINL.push(toINTLEntry(o));
}
console.log('  待补 cn: ' + addCN.length + '  intl: ' + addINL.length);
const addByC = {};
addINL.forEach(x => addByC[x.country] = (addByC[x.country] || 0) + 1);
console.log('    待补国别: ' + JSON.stringify(addByC));

// ---------- 5. 组装新 catalog ----------
const newCNLaws = (CN.laws || []).filter(x => laws[x.id]).concat(addCN);
newCNLaws.sort((a, b) => String(a.id).localeCompare(String(b.id)));
const newINLLaws = (INL.laws || []).filter(x => laws[x.id]).concat(addINL);
newINLLaws.sort((a, b) => String(a.id).localeCompare(String(b.id)));

// 重算 cn packs（按 laws/ 里的 pack 字段统计）
const packStat = {};
newCNLaws.forEach(x => {
  const pk = x.pack || 'unknown';
  packStat[pk] = packStat[pk] || { id: pk, laws: 0, articles: 0, chars: 0 };
  packStat[pk].laws++;
  packStat[pk].articles += (x.articles || 0);
  packStat[pk].chars += (x.chars || 0);
});
const packs = Object.values(packStat)
  .filter(p => p.id !== 'unknown')
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(p => ({ id: p.id, file: 'cn/' + p.id + '.js', laws: p.laws, articles: p.articles, chars: p.chars }));

const newCNMeta = Object.assign({}, CN.meta || {}, {
  generatedAt: new Date().toISOString().slice(0, 10),
  laws: newCNLaws.length,
  articles: newCNLaws.reduce((s, x) => s + (x.articles || 0), 0),
  chars: newCNLaws.reduce((s, x) => s + (x.chars || 0), 0),
  packs: packs.length,
  note: (CN.meta && CN.meta.note) || '',
  syncedWithLaws: 'Phase A-1 补齐 catalog 与 laws/ 的差异（2026-10-23）',
  removedDeadLinks: deadINL.length,
  removedDeadLinksNote: '这些条目 coverage=catalog、source.url 为空、harvest.files 指向「4乱码数据」，收集失败且无正文分卷，删除以免点进去是空页。完整 id 清单见 _work/backend/removed-dead-links.json',
  addedFromLaws: addINL.length,
});
const newINLMeta = Object.assign({}, INL.meta || {}, {
  generatedAt: new Date().toISOString().slice(0, 10),
  laws: newINLLaws.length,
  syncedWithLaws: 'Phase A-1 补齐 catalog 与 laws/ 的差异（2026-10-23）',
  removedDeadLinks: deadINL.length,
  removedDeadLinksNote: '这些条目 coverage=catalog、source.url 为空、harvest.files 指向「4乱码数据」，收集失败且无正文分卷，删除以免点进去是空页。完整 id 清单见 _work/backend/removed-dead-links.json',
  addedFromLaws: addINL.length,
});

console.log('');
console.log('  ═══ 结果 ═══');
console.log('  cn-catalog  : ' + cnIds.size + ' → ' + newCNLaws.length + '（移除死链 ' + deadCN.length + '，补 ' + addCN.length + '）');
console.log('  intl-catalog: ' + inlIds.size + ' → ' + newINLLaws.length + '（移除死链 ' + deadINL.length + '，补 ' + addINL.length + '）');
console.log('  合计        : ' + (cnIds.size + inlIds.size) + ' → ' + (newCNLaws.length + newINLLaws.length) + ' / laws ' + lawIds.length);

if (DRY) {
  console.log('');
  console.log('  （--dry 试运行，未写盘）');
  process.exit(0);
}

// ---------- 6. 写盘 ----------
function writeCatalog(file, varName, obj, extraDecl) {
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

writeCatalog('cn-catalog.js', 'CALR_CN_CATALOG', { meta: newCNMeta, packs: packs, laws: newCNLaws });
writeCatalog('intl-catalog.js', 'CALR_INTL_CATALOG', { meta: newINLMeta, laws: newINLLaws });
