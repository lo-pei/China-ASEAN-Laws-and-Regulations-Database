/* 生成「无本地条文原文」完整清单（CSV + Markdown）
   字段：国家 / 公布日期 / 施行日期 / 修改日期 / 制定机关 / 条文总数 / 条文内容 / 法律层级 / 有效性 / 数据来源 … */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const R = path.resolve('prototype/data');

function load(files) {
  const ctx = { window: {}, document: {} };
  ctx.window = ctx;
  vm.createContext(ctx);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), ctx, { filename: f }));
  return ctx;
}
const ctx = load(['dataset-core.js', 'dataset-extra.js', 'fulltext/manifest.js',
                  'cn-catalog.js', 'intl-catalog.js', 'intl/manifest.js']);
const core = ctx.CALR_DATA_CORE, ex = ctx.CALR_DATA_EXTRA;
const ftmf = ctx.CALR_FULLTEXT_MANIFEST, cnc = ctx.CALR_CN_CATALOG;
const ic = ctx.CALR_INTL_CATALOG, im = ctx.CALR_INTL_MANIFEST;

const CN_NAME = { CN: '中国', VN: '越南', TH: '泰国', ID: '印度尼西亚', MY: '马来西亚', SG: '新加坡',
  PH: '菲律宾', BN: '文莱', KH: '柬埔寨', LA: '老挝', MM: '缅甸', TL: '东帝汶' };
const LEVEL = { constitution: '宪法', law: '法律', code: '法典', decree: '行政法规/政令',
  regulation: '法规', subdecree: '部门规章/通告', local: '地方性法规', judicial: '司法解释/判例',
  amendment: '修正案' };
const STATUS = { active: '现行有效', amended: '已修订', repealed: '已废止', pending: '尚未生效' };
const CAT = { '法律': 'law', '行政法规': 'decree', '监察法规': 'subdecree', '司法解释': 'judicial', '宪法': 'constitution' };

const rows = [];
function push(o) { rows.push(o); }

// A) dataset-core 中缺少全文分卷的法规
(core.laws || []).filter(l => !(ftmf.byLaw || {})[l.id]).forEach(l => push({
  layer: 'data/fulltext/<cc>.js', kind: '法规', id: l.id, country: CN_NAME[l.country] || l.country,
  titleZh: (l.title || {}).zh || '', titleEn: (l.title || {}).en || '',
  level: LEVEL[l.level] || l.level || '', status: STATUS[l.status] || l.status || '',
  promulgated: l.promulgatedDate || '', effective: l.effectiveDate || '',
  amended: (l.amendedNote || '').slice(0, 60), organ: (l.issuingBody || {}).zh || '',
  docNumber: l.docNumber || '', articleCount: 0, hasText: '否',
  source: (l.source || {}).name || '', url: (l.source || {}).url || ''
}));

// B) intl-catalog 中缺少分卷的法规
(ic.laws || []).filter(l => !(im.byLaw || {})[l.id]).forEach(l => push({
  layer: 'data/intl/<cc>-pNN.js', kind: l.level === 'amendment' ? '修正案' : '法规', id: l.id,
  country: CN_NAME[l.country] || l.country,
  titleZh: (l.title || {}).zh || '', titleEn: (l.title || {}).en || '',
  level: LEVEL[l.level] || l.level || '', status: STATUS[l.status] || l.status || '',
  promulgated: l.promulgatedDate || '', effective: l.effectiveDate || '',
  amended: (l.amendedNote || '').slice(0, 60), organ: (l.issuingBody || {}).zh || '',
  docNumber: l.docNumber || '', articleCount: 0, hasText: '否',
  source: (l.source || {}).name || '', url: (l.source || {}).url || ''
}));

// C) 条约（全部无条文）
(ex.treaties || []).forEach(t => push({
  layer: 'data/treaty/<id>.js（尚无此层）', kind: '条约', id: t.id, country: '多边',
  titleZh: (t.name && t.name.zh) || t.name || '', titleEn: (t.name && t.name.en) || '',
  level: '条约', status: STATUS[t.status] || t.status || '',
  promulgated: t.signedDate || '', effective: t.effectiveDate || '', amended: '',
  organ: (t.parties || []).join(' / ').slice(0, 80), docNumber: '',
  articleCount: 0, hasText: '否', source: '', url: ''
}));

// ---- CSV ----
const head = ['序号', '所属存储层', '类型', '条目ID', '国家/地区', '中文名称', '原文名称', '法律层级',
  '有效性', '公布日期', '施行日期', '修改日期', '制定机关', '文号', '本地条文数', '有本地原文', '数据来源名称', '数据来源链接'];
const lines = [head.join(',')];
rows.forEach((r, i) => {
  lines.push([i + 1, r.layer, r.kind, r.id, r.country, r.titleZh, r.titleEn, r.level, r.status,
    r.promulgated, r.effective, r.amended, r.organ, r.docNumber, r.articleCount, r.hasText, r.source, r.url]
    .map(c => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(','));
});
fs.mkdirSync('deliverables', { recursive: true });
fs.writeFileSync('deliverables/无本地原文清单.csv', '\ufeff' + lines.join('\n'), 'utf8');
fs.writeFileSync('_work/no-fulltext-inventory.csv', '\ufeff' + lines.join('\n'), 'utf8');

// ---- Markdown ----
const byKind = {};
rows.forEach(r => { byKind[r.kind] = (byKind[r.kind] || 0) + 1; });
const byCountry = {};
rows.forEach(r => { byCountry[r.country] = (byCountry[r.country] || 0) + 1; });
const md = [];
md.push('# 无本地条文原文清单（仅链接 / 需前往官方渠道获取）');
md.push('');
md.push('> 本清单由 `_work/build-no-fulltext-inventory.js` 从数据层实时生成，与数据库保持一致。');
md.push('> 新增条文后重新生成即可，不要手工编辑本文件。');
md.push('');
md.push('## 汇总');
md.push('');
md.push('| 类型 | 条数 |');
md.push('| :--- | ---: |');
Object.keys(byKind).sort((a, b) => byKind[b] - byKind[a]).forEach(k => md.push('| ' + k + ' | ' + byKind[k] + ' |'));
md.push('| **合计** | **' + rows.length + '** |');
md.push('');
md.push('| 国家/地区 | 条数 |');
md.push('| :--- | ---: |');
Object.keys(byCountry).sort((a, b) => byCountry[b] - byCountry[a]).forEach(k => md.push('| ' + k + ' | ' + byCountry[k] + ' |'));
md.push('');
md.push('## 明细');
md.push('');
['法规', '修正案', '条约'].forEach(kind => {
  const sub = rows.filter(r => r.kind === kind);
  if (!sub.length) return;
  md.push('### ' + kind + '（' + sub.length + '）');
  md.push('');
  md.push('| # | 条目ID | 国家/地区 | 中文名称 | 原文名称 | 层级 | 有效性 | 公布 | 施行 | 制定机关 | 文号 | 官方链接 |');
  md.push('| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
  sub.forEach((r, i) => {
    const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md.push('| ' + (i + 1) + ' | `' + r.id + '` | ' + esc(r.country) + ' | ' + esc(r.titleZh) + ' | ' +
      esc(r.titleEn) + ' | ' + esc(r.level) + ' | ' + esc(r.status) + ' | ' + esc(r.promulgated) + ' | ' +
      esc(r.effective) + ' | ' + esc(r.organ) + ' | ' + esc(r.docNumber) + ' | ' +
      (r.url ? '[' + (String(r.url).replace(/^https?:\/\//, '').split('/')[0]) + '](' + r.url + ')' : '') + ' |');
  });
  md.push('');
});
fs.writeFileSync('docs/11-无本地原文清单.md', md.join('\n'), 'utf8');

console.log('清单生成：' + rows.length + ' 条');
console.log('  类型分布: ' + JSON.stringify(byKind));
console.log('  国家分布: ' + JSON.stringify(byCountry));
console.log('  → deliverables/无本地原文清单.csv');
console.log('  → docs/11-无本地原文清单.md');
