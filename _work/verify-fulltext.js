/* CALR 官方全文数据审计：逐文件检查完整性、来源标注与疑似编造
   用法：node _work/verify-fulltext.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const FT_DIR = path.join(ROOT, 'prototype', 'data', 'fulltext');
const log = [];
const problems = [];
const warnings = [];

function ok(name, cond, detail) {
  log.push((cond ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  [' + detail + ']' : ''));
  if (!cond) problems.push(name + (detail ? ' :: ' + detail : ''));
}
function warn(name, detail) { warnings.push(name + (detail ? ' :: ' + detail : '')); }

/* 基础数据集（法规元数据 + 原有节选条文，用于比对是否沿用演示文本） */
const coreCtx = { window: {}, document: {} };
vm.createContext(coreCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/dataset-core.js'), 'utf8'), coreCtx);
const core = coreCtx.window.CALR_DATA_CORE;
const coreLaws = {};
core.laws.forEach(l => coreLaws[l.id] = l);

if (!fs.existsSync(FT_DIR)) {
  console.log('未找到 fulltext 目录');
  process.exit(1);
}
const files = fs.readdirSync(FT_DIR).filter(f => f.endsWith('.js') && f !== 'manifest.js').sort();
ok('存在全文数据文件', files.length > 0, files.join(','));

/* 先统一加载所有文件：合并全文与新增法规元数据（CALR_FULLTEXT_META） */
const bundle = {};      /* file -> {lawId: entry} */
const metaAll = {};     /* lawId -> meta */
files.forEach(file => {
  const ctx = { window: {}, document: {}, console: { log() {} } };
  vm.createContext(ctx);
  try {
    vm.runInContext(fs.readFileSync(path.join(FT_DIR, file), 'utf8'), ctx, { filename: file });
  } catch (e) {
    ok(file + ' 语法/加载', false, e.message);
    return;
  }
  const map = ctx.window.CALR_FULLTEXT || {};
  Object.keys(map).forEach(id => { bundle[file] = bundle[file] || {}; bundle[file][id] = map[id]; });
  Object.assign(metaAll, ctx.window.CALR_FULLTEXT_META || {});
});

const BAD_MARKERS = [
  [/……/, '含省略号 ……'],
  [/（略）|\(略\)|（下略）|\(下略\)/, '含“略”标记'],
  [/摘录|节选|待补|节录/, '含节选/待补字样'],
  [/TODO|XXX|待翻译|待补充/, '含占位标记']
];
const NOISE = /(首页|站内检索|版权所有|保留所有权利|分享到|点赞|广告|上一篇|下一篇|打印本页|扫描二维码|关注我们)/;

const summary = [];
let totalLaws = 0, totalArticles = 0, totalChars = 0;

files.forEach(file => {
  const map = bundle[file];
  if (!map) return;                     /* 加载失败的已在上面记录 */
  const ids = Object.keys(map);
  ok(file + ' 含法规条目', ids.length > 0, ids.length + ' 部');

  ids.forEach(id => {
    totalLaws++;
    const e = map[id];
    const coreLaw = coreLaws[id] || (metaAll[id] ? Object.assign({ id: id }, metaAll[id]) : null);
    const tag = file + ' :: ' + id;

    ok(tag + ' 法规元数据可解析（基础数据集或 CALR_FULLTEXT_META）', !!coreLaw);
    ok(tag + ' coverage=full', e.coverage === 'full', String(e.coverage));
    ok(tag + ' 标注来源名称', !!e.sourceName, e.sourceName || '');
    ok(tag + ' 标注来源 URL', /^https?:\/\//.test(e.sourceUrl || ''), e.sourceUrl || '');
    ok(tag + ' 标注抓取日期', /^\d{4}-\d{2}-\d{2}$/.test(e.fetchedAt || ''), e.fetchedAt || '');
    ok(tag + ' 标注官方语种', !!e.language, e.language || '');

    const arts = e.articles || [];
    ok(tag + ' 条文非空', arts.length > 0, arts.length + ' 条');
    ok(tag + ' articleCount 与条数一致', e.articleCount === arts.length, e.articleCount + ' vs ' + arts.length);

    if (!arts.length) return;
    totalArticles += arts.length;

    // 条号连续
    const nos = arts.map(a => a.no);
    let gaps = [];
    for (let i = 1; i < nos.length; i++) {
      if (typeof nos[i] !== 'number' || typeof nos[i - 1] !== 'number') { gaps.push('非数字条号'); break; }
      if (nos[i] !== nos[i - 1] + 1) gaps.push(nos[i - 1] + '→' + nos[i]);
    }
    const gapNote = (e.completenessNote || '').match(/跳号|不连续/);
    ok(tag + ' 条号连续', gaps.length === 0 || !!gapNote, gaps.slice(0, 4).join(','));

    // 条 id / 条号 / 正文
    let idBad = [], noLabelBad = [], emptyText = [], markers = [], noise = [], shortText = [];
    arts.forEach(a => {
      if (a.id !== id + '-A' + a.no) idBad.push((a.id || '') + '≠' + id + '-A' + a.no);
      if (!a.noLabel || !Object.keys(a.noLabel).length) noLabelBad.push(a.no ?? '?');
      const txts = Object.keys(a.text || {}).map(k => String(a.text[k] || '').trim()).filter(Boolean);
      if (!txts.length) emptyText.push(a.no ?? '?');
      const joined = txts.join('\n');
      totalChars += joined.length;
      BAD_MARKERS.forEach(([re, why]) => { if (re.test(joined)) markers.push('第' + a.no + '条:' + why); });
      if (NOISE.test(joined)) noise.push('第' + a.no + '条');
      if (joined.length < 20) shortText.push('第' + a.no + '条(' + joined.length + '字)');
    });
    ok(tag + ' 条 id 命名规范', idBad.length === 0, idBad.slice(0, 3).join(','));
    ok(tag + ' 条号标注完整', noLabelBad.length === 0, noLabelBad.slice(0, 5).join(','));
    ok(tag + ' 无空条文', emptyText.length === 0, emptyText.slice(0, 5).join(','));
    ok(tag + ' 无省略/节选标记', markers.length === 0, markers.slice(0, 5).join(','));
    if (noise.length) warn(tag + ' 疑似网页噪声', noise.slice(0, 5).join(','));
    if (shortText.length) warn(tag + ' 超短条文（请人工确认）', shortText.slice(0, 5).join(','));

    // 与演示节选文本的相似度（防止直接把演示文本当成官方全文）
    if (coreLaw) {
      const coreText = (coreLaw.articles || []).map(a => Object.keys(a.text || {}).map(k => a.text[k]).join(' ')).join(' ');
      const ftText = arts.map(a => Object.keys(a.text || {}).map(k => a.text[k]).join(' ')).join(' ');
      const same = coreText && ftText && coreText.slice(0, 200) && ftText.indexOf(coreText.slice(0, 80)) >= 0;
      if (same) warn(tag + ' 正文疑似沿用演示节选文本', '首段与 dataset-core 完全一致');
      if (ftText.length < coreText.length * 1.2 && arts.length <= (coreLaw.articles || []).length) {
        warn(tag + ' 全文体量未见明显增加', '全文 ' + ftText.length + ' 字 vs 节选 ' + coreText.length + ' 字');
      }
    }

    summary.push({
      file, id,
      laws: coreLaw ? (coreLaw.title && coreLaw.title.zh) || '' : '(未登记)',
      country: coreLaw ? coreLaw.country : '?',
      articles: arts.length,
      chars: arts.reduce((n, a) => n + Object.keys(a.text || {}).map(k => String(a.text[k] || '').length).reduce((x, y) => x + y, 0), 0),
      lang: e.language,
      source: e.sourceName
    });
  });
});

const out = [];
out.push('=== 明细 ===');
summary.sort((a, b) => String(a.country).localeCompare(String(b.country)) || a.id.localeCompare(b.id));
summary.forEach(s => out.push(
  [s.country, s.id, s.articles + '条', s.chars + '字', s.lang, s.source].join(' | ')
));
out.push('');
out.push('合计：全文法规 ' + totalLaws + ' 部 / 条文 ' + totalArticles + ' 条 / 正文 ' + totalChars + ' 字');
out.push('');
out.push('=== 检查项 ===');
out.push(log.join('\n'));
if (warnings.length) {
  out.push('');
  out.push('=== 警告（需人工确认）===');
  out.push(warnings.join('\n'));
}
out.push('');
out.push('FAILED=' + problems.length);
if (problems.length) out.push(problems.map(p => ' - ' + p).join('\n'));

fs.writeFileSync(path.join(ROOT, '_work', 'verify-fulltext-report.txt'), out.join('\n'), 'utf8');
console.log(out.join('\n'));
process.exit(problems.length ? 1 : 0);
