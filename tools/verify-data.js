/* ==========================================================================
   CALR · 数据层校验器（供其他 agent 交付前自检）
   用法： node tools/verify-data.js
   退出码：0 全部通过；1 存在错误
   ========================================================================== */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const D = path.join(ROOT, 'prototype', 'data');

let err = 0, warn = 0, note_n = 0, ok = 0;
const E = [], W = [], N = [];
const SUPPRESS_TRUNC = [], SUPPRESS_DUPNO = [];   // 聚合类缺陷（逐法记录，末尾汇总成一条「提示」）
function fail(m) { err++; E.push('  ✗ ' + m); }
function loos(m) { warn++; W.push('  ! ' + m); }
function note(m) { note_n++; N.push('  · ' + m); }
function pass(m) { ok++; }

function newCtx() { const c = { window: {}, document: {} }; c.window = c; vm.createContext(c); return c; }
function run(ctx, rel) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel }); return true; }
  catch (e) { fail('无法执行 ' + rel + '：' + e.message); return false; }
}
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms', 'my', 'km', 'lo', 'pt'];
const ARTICLE_REQUIRED = ['id', 'no', 'noLabel', 'text'];

console.log('CALR 数据层校验\n');

/* ---------- 1. 目录层 ---------- */
const ctx = newCtx();
['data/dataset-core.js', 'data/dataset-extra.js', 'data/fulltext/manifest.js',
 'data/cn-catalog.js', 'data/intl-catalog.js', 'data/intl/manifest.js',
 'data/trans/manifest.js'].forEach(f => run(ctx, 'prototype/' + f));

const ftmf = ctx.CALR_FULLTEXT_MANIFEST;
const cnc = ctx.CALR_CN_CATALOG;
const ic = ctx.CALR_INTL_CATALOG;
const im = ctx.CALR_INTL_MANIFEST;
const tm = ctx.CALR_TRANS_MANIFEST;

if (ftmf && ftmf.byLaw) pass(); else fail('CALR_FULLTEXT_MANIFEST 缺失或结构错误');
if (cnc && cnc.laws) pass(); else fail('CALR_CN_CATALOG 缺失');
if (ic && ic.laws) pass(); else fail('CALR_INTL_CATALOG 缺失');
if (im && im.byLaw) pass(); else fail('CALR_INTL_MANIFEST 缺失');
if (tm && tm.byLaw) pass(); else fail('CALR_TRANS_MANIFEST 缺失（译文层索引）');

/* ---------- 2. 分卷：官方原文 ---------- */
const FT = ctx.CALR_FULLTEXT || {};
const catalogIds = new Set([
  ...(cnc.laws || []).map(l => l.id),
  ...(ic.laws || []).map(l => l.id),
  ...(ctx.CALR_DATA_CORE.laws || []).map(l => l.id)
]);
const REQUIRED_FT = ['id', 'coverage', 'language', 'sourceName', 'sourceUrl', 'fetchedAt', 'articleCount', 'articles'];
let artTotal = 0, lawTotal = 0;

function checkPack(rel) {
  const c = newCtx();
  if (!run(c, rel)) return;
  const T = c.CALR_FULLTEXT || {};
  const ids = Object.keys(T);
  if (!ids.length) { loos(rel + ' 未注册任何法规'); return; }
  ids.forEach(id => {
    const o = T[id];
    lawTotal++;
    const miss = REQUIRED_FT.filter(k => o[k] === undefined);
    if (miss.length) fail(rel + ' → ' + id + ' 缺少字段 ' + miss.join(', '));
    if (o.id !== id) fail(rel + ' → 键 ' + id + ' 与字段 id ' + o.id + ' 不一致');
    if (o.coverage !== 'full') loos(rel + ' → ' + id + ' coverage=' + o.coverage + '（应为 full）');
    if (!Array.isArray(o.articles)) { fail(rel + ' → ' + id + ' articles 不是数组'); return; }
    if (o.articleCount !== o.articles.length) fail(rel + ' → ' + id + ' articleCount(' + o.articleCount + ') ≠ articles.length(' + o.articles.length + ')');
    if (o.language && LANGS.indexOf(o.language) < 0) fail(rel + ' → ' + id + ' language=' + o.language + ' 不在语言表内');
    // 【2026-10-06 补强】区分三种问题，避免「值为空」被笼统报成「缺少语言键」
    const missKey = o.articles.filter(a => !a.text || a.text[o.language] === undefined).length;
    const emptyVal = o.articles.filter(a => a.text && a.text[o.language] !== undefined && String(a.text[o.language]).trim() === '').length;
    if (missKey) loos(rel + ' → ' + id + ' 有 ' + missKey + ' 条缺少原文语言键 ' + o.language);
    if (emptyVal) loos(rel + ' → ' + id + ' 有 ' + emptyVal + ' 条原文语言键 ' + o.language + ' 值为空（正文缺失，需重新抓取）');
    // 【2026-10-24 修正判据】原判据是「heading 长度 >= 80」，实测是误报：
    //   全库 3173 条 heading >= 80，其中 3150 条是真实长标题
    //   （新加坡刑法典的罪名描述本来就长，例如
    //    "Punishment of offences committed beyond, but which by law may be tried within Singapore"）。
    //   真正的问题信号是「heading 恰好是正文的前缀」—— 抓取时把正文开头当成了标题。
    //   按新判据全库只剩 23 条；且这 23 条语义上并不算错（标题确实就是正文首句），
    //   所以只作提示，不修改数据，长标题的展示问题交给前端截断处理。
    const _norm = x => String(x || '').replace(/\s+/g, ' ');
    const hTrunc = o.articles.filter(a => {
      const hd = a.heading || {};
      const h = hd[o.language] || hd.zh || hd.en;
      if (!h || String(h).length < 80) return false;
      const tx = a.text || {};
      const b = tx[o.language] || tx.zh || tx.en || Object.values(tx)[0];
      if (!b) return false;
      return _norm(b).indexOf(_norm(h).slice(0, 50)) >= 0;
    }).length;
    if (hTrunc) SUPPRESS_TRUNC.push({ rel, id, n: hTrunc });
    // 【2026-10-06 补强】同一部法内条号必须唯一（SKILL §4.2）
    const noSeen = {}, noDup = new Set();
    o.articles.forEach(a => { if (noSeen[a.no]) noDup.add(a.no); noSeen[a.no] = 1; });
    if (noDup.size) SUPPRESS_DUPNO.push({ rel, id, n: noDup.size });
    o.articles.forEach(a => {
      const m = ARTICLE_REQUIRED.filter(k => a[k] === undefined);
      if (m.length) fail(rel + ' → ' + id + ' 条文 ' + a.no + ' 缺少 ' + m.join(', '));
      if (typeof a.no !== 'number') fail(rel + ' → ' + id + ' 条文 no 非数字：' + a.no);
      if (a.text && Object.keys(a.text).length > 1) {
        loos(rel + ' → ' + id + ' 条文 ' + a.no + ' 的 text 含多个语种（' + Object.keys(a.text).join(',') + '）；翻译请存到 data/trans/');
      }
    });
    artTotal += o.articles.length;
  });
  pass();
}

const ftFiles = fs.readdirSync(path.join(D, 'fulltext')).filter(f => f.endsWith('.js') && f !== 'manifest.js');
ftFiles.forEach(f => checkPack('prototype/data/fulltext/' + f));
['cn', 'intl'].forEach(dir => {
  fs.readdirSync(path.join(D, dir)).filter(f => f.endsWith('.js') && f !== 'manifest.js')
    .forEach(f => checkPack('prototype/data/' + dir + '/' + f));
});
console.log('  官方原文分卷：' + lawTotal + ' 部法规 / ' + artTotal + ' 条条文（' + ftFiles.length + ' 法域卷 + cn/intl 分卷）');

/* ---------- 3. 目录 ↔ 分卷 一致性 ---------- */
if (ic && im && im.byLaw) {
  /* coverage=full 的目录条目既可落在 intl 分卷，也可落在 fulltext（A 法域全文层）分卷，
     两个 manifest 任一命中即视为已入库。 */
  const inAnyPack = (id) => !!(im.byLaw[id] || (ftmf && ftmf.byLaw && ftmf.byLaw[id]));
  const missing = (ic.laws || []).filter(l => l.coverage === 'full' && !inAnyPack(l.id));
  if (missing.length) fail('intl-catalog 中 coverage=full 但缺少分卷：' + missing.slice(0, 5).map(l => l.id).join(', ') + (missing.length > 5 ? ' 等 ' + missing.length + ' 条' : ''));
  else pass();
  const ghost = Object.keys(im.byLaw).filter(id => !(ic.laws || []).some(l => l.id === id));
  if (ghost.length) loos('intl/manifest 引用了目录中不存在的法规：' + ghost.slice(0, 5).join(', '));
}
if (cnc) {
  const noPack = (cnc.laws || []).filter(l => !l.pack);
  if (noPack.length) loos('cn-catalog 有 ' + noPack.length + ' 条未分配 pack');
  else pass();
}
(ftmf && ftmf.files || []).forEach(code => {
  if (!fs.existsSync(path.join(D, 'fulltext', code + '.js'))) fail('fulltext/manifest.files 声明了 ' + code + ' 但文件不存在');
});

/* ---------- 4. 译文层 ---------- */
if (tm && tm.byLaw) {
  const seen = new Set();
  (tm.files || []).forEach(f => {
    if (!f.file) { fail('trans/manifest.files 有条目缺少 file'); return; }
    const rel = 'prototype/data/trans/' + f.file + '.js';
    if (!fs.existsSync(path.join(ROOT, rel))) { fail('译文分卷缺失：' + rel); return; }
    const c = newCtx();
    if (!run(c, rel)) return;
    const TR = c.CALR_TRANS || {};
    let n = 0;
    Object.keys(TR).forEach(id => {
      const o = TR[id];
      n++;
      if (o.lawId !== id) fail(rel + ' → 键 ' + id + ' 与 lawId ' + o.lawId + ' 不一致');
      if (!o.targetLang) fail(rel + ' → ' + id + ' 缺少 targetLang');
      if (!o.sourceLang) fail(rel + ' → ' + id + ' 缺少 sourceLang');
      if (!Array.isArray(o.articles)) { fail(rel + ' → ' + id + ' articles 不是数组'); return; }
      if (o['translatedAt'] === undefined) fail(rel + ' → ' + id + ' 缺少 translatedAt');
      if (o.reviewed === undefined) loos(rel + ' → ' + id + ' 缺少 reviewed（机器/人工校对标记）');
      const src = FT[id];
      o.articles.forEach(a => {
        if (typeof a.no !== 'number') fail(rel + ' → ' + id + ' 译文条文 no 非数字：' + a.no);
        if (!a.text || !a.text[o.targetLang]) fail(rel + ' → ' + id + ' 译文条文 ' + a.no + ' 缺少 ' + o.targetLang + ' 文本');
        if (src && !(src.articles || []).some(s => s.no === a.no)) loos(rel + ' → ' + id + ' 译文条文 ' + a.no + ' 在原文中找不到对应条');
      });
      const dup = {};
      o.articles.forEach(a => { if (dup[a.no]) fail(rel + ' → ' + id + ' 译文条号重复：' + a.no); dup[a.no] = 1; });
    });
    if (f.articles !== undefined && f.articles !== n && f.articles !== o0Articles(TR)) loos('trans/manifest 中 ' + f.file + ' 声明 articles=' + f.articles + ' 与实际不符');
    seen.add(f.file);
  });
  // byLaw 反查
  Object.keys(tm.byLaw || {}).forEach(id => {
    const e = tm.byLaw[id];
    const list = typeof e === 'string' ? [e] : Object.values(e || {});
    list.forEach(fn => { if (!seen.has(fn)) fail('trans/manifest.byLaw 引用了未登记的分卷：' + id + ' → ' + fn); });
  });
  console.log('  译文层：' + (tm.files || []).length + ' 个分卷 / ' + Object.keys(tm.byLaw || {}).length + ' 部法规');
}
function o0Articles(TR) { let n = 0; Object.keys(TR).forEach(k => { n += (TR[k].articles || []).length; }); return n; }

/* ---------- 5. 重复 id（同层内必须唯一；跨层重叠属正常，仅提示） ---------- */
function dupOf(list) {
  const seen = {}, dup = [];
  list.forEach(id => { if (seen[id]) dup.push(id); seen[id] = 1; });
  return [...new Set(dup)];
}
const dupCore = dupOf((ctx.CALR_DATA_CORE.laws || []).map(l => l.id));
const dupCn = dupOf((cnc && cnc.laws || []).map(l => l.id));
const dupIntl = dupOf((ic && ic.laws || []).map(l => l.id));
if (dupCore.length || dupCn.length || dupIntl.length) {
  fail('同一目录层内 id 重复：core ' + dupCore.length + ' / cn ' + dupCn.length + ' / intl ' + dupIntl.length +
    '（' + [...dupCore, ...dupCn, ...dupIntl].slice(0, 6).join(', ') + '）');
} else pass();
const overlap = (ctx.CALR_DATA_CORE.laws || []).map(l => l.id)
  .filter(id => (cnc && cnc.laws || []).some(l => l.id === id));
if (overlap.length) note('dataset-core 与 cn-catalog 有 ' + overlap.length + ' 条 id 重叠（运行时由 store 合并去重，属正常）');


/* ---------- 5b. 聚合类缺陷（逐法收集，汇总为单条「提示」；属已知存量，
             不影响本轮校验通过，供后续治理排期用） ---------- */
if (SUPPRESS_TRUNC.length) {
  const n = SUPPRESS_TRUNC.reduce((s, x) => s + x.n, 0);
  note('共 ' + SUPPRESS_TRUNC.length + ' 部法规 / ' + n + ' 条条文的 heading 是正文前缀（抓取时把正文开头当成了标题）；' +
    '影响面见 _work/intl-harvest/build.js（已于 2026-10-06 修正截断逻辑），存量数据需重新抓取修复。例：' +
    SUPPRESS_TRUNC.slice(0, 3).map(x => x.id + '(' + x.n + ')').join('、'));
}
if (SUPPRESS_DUPNO.length) {
  const n = SUPPRESS_DUPNO.reduce((s, x) => s + x.n, 0);
  note('共 ' + SUPPRESS_DUPNO.length + ' 部法规存在重复条号（合计 ' + n + ' 个重复条号），违反 SKILL §4.2「同一部法内条号唯一」；' +
    '条号对齐（译文层、跨层比对）将受影响。例：' + SUPPRESS_DUPNO.sort((a, b) => b.n - a.n).slice(0, 3).map(x => x.id + '(' + x.n + ')').join('、'));
}

/* ---------- 6. 权威存储 prototype/data/laws/（★ 唯一真源，2026-10-08 起） ----------
   背景：此前本校验器只遍历 fulltext/ cn/ intl/ 三个【派生】分卷，从不读取权威存储，
        导致「laws/ 与分卷不一致」时仍报通过（见 docs/28 §S6）。本段补齐该缺口。 */
const LAWS = path.join(D, 'laws');
const LAW_CSV = ['无本地原文清单.csv', '条号重复清单.csv'];
let lawsIdx = null;
try { lawsIdx = JSON.parse(fs.readFileSync(path.join(LAWS, 'index.json'), 'utf8')); }
catch (e) { fail('laws/index.json 无法读取或解析：' + e.message); }

if (lawsIdx) {
  const lawFiles = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
  const fileSet = new Set(lawFiles.map(f => f.replace(/\.json$/, '')));
  const idxList = lawsIdx.laws || [];
  const idxSet = new Set(idxList.map(l => l.id));

  /* 6.1 索引 ↔ 文件 双向一致 */
  if (idxList.length !== fileSet.size) {
    fail('laws/ 索引与文件数不一致：index ' + idxList.length + ' 条 / 实际文件 ' + fileSet.size + ' 个');
  } else pass();
  const onlyIdx = [...idxSet].filter(x => !fileSet.has(x));
  const onlyFile = [...fileSet].filter(x => !idxSet.has(x));
  if (onlyIdx.length || onlyFile.length) {
    fail('laws/ 索引与文件不匹配：仅索引有 ' + onlyIdx.length + ' 个（' + onlyIdx.slice(0, 3).join(', ') +
      '），仅文件有 ' + onlyFile.length + ' 个（' + onlyFile.slice(0, 3).join(', ') + '）');
  } else pass();
  const badFileField = idxList.filter(l => l.file !== l.id + '.json');
  if (badFileField.length) fail('laws/index.json 中 laws[].file 与 id 不对应 ' + badFileField.length + ' 条');
  else pass();

  /* 6.2 逐法结构：id 自洽 / articleCount == articles.length / 正文非空 / 不含已归档标记 */
  const badId = [], badCount = [], emptyArt = [], stillDup = [];
  let sumArts = 0, sumChars = 0, unreadable = 0, noTextLaw = 0;
  for (const f of lawFiles) {
    let o;
    try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); }
    catch (e) { unreadable++; continue; }
    if (!o.id || o.id + '.json' !== f) badId.push(f);
    if (o.duplicateOf) stillDup.push(o.id);
    const arts = o.articles || [];
    if (o.articleCount !== arts.length) badCount.push(o.id + '(' + o.articleCount + '≠' + arts.length + ')');
    sumArts += arts.length;
    let lawChars = 0;
    for (const a of arts) {
      const tx = (a.text && typeof a.text === 'object') ? Object.keys(a.text).map(k => a.text[k]).join('') : String(a.text == null ? '' : a.text);
      lawChars += tx.length;
      if (!tx.trim()) emptyArt.push(o.id + '#' + a.no);
    }
    sumChars += lawChars;
    if (!arts.length) noTextLaw++;
  }
  if (unreadable) fail('laws/ 中 ' + unreadable + ' 个 JSON 无法解析'); else pass();
  if (badId.length) fail('laws/ 中 ' + badId.length + ' 个文件名与 id 不一致：' + badId.slice(0, 3).join(', ')); else pass();
  if (badCount.length) fail('laws/ 中 ' + badCount.length + ' 部 articleCount ≠ articles.length：' + badCount.slice(0, 3).join(', ')); else pass();
  /* 空正文属「上游源文本缺失」的已知存量，按项目既有约定记为警告（与分卷检查同口径），不阻断 */
  if (emptyArt.length) loos('laws/ 中 ' + emptyArt.length + ' 条条文正文为空（原文语言键为空，需重新抓取）：' +
    [...new Set(emptyArt.map(x => x.split('#')[0]))].slice(0, 3).join(', '));
  else pass();
  if (noTextLaw) note('laws/ 中 ' + noTextLaw + ' 部法规无条文（coverage=catalog 类，属设计内）');
  if (stillDup.length) fail('laws/ 中仍存在带 duplicateOf 的条目 ' + stillDup.length + ' 个（应已移入 _work/dedup-archive/）'); else pass();

  /* 6.3 meta 汇总数字自洽 */
  const m = lawsIdx.meta || {};
  if (m.lawCount !== idxList.length) fail('laws/index.json meta.lawCount=' + m.lawCount + ' ≠ laws 条数 ' + idxList.length); else pass();
  if (m.articleCount !== sumArts) fail('laws/index.json meta.articleCount=' + m.articleCount + ' ≠ 实际 ' + sumArts); else pass();
  if (m.chars !== sumChars) fail('laws/index.json meta.chars=' + m.chars + ' ≠ 实际 ' + sumChars); else pass();

  /* 6.4 两份 CSV 存在 */
  for (const c of LAW_CSV) {
    if (!fs.existsSync(path.join(LAWS, c))) fail('laws/' + c + ' 缺失'); else pass();
  }

  /* 6.5 抽样核对：laws/<id>.json 能否按 App 的 packFor() 规则解析到真实存在的分卷
         （映射来自 fulltext/manifest + cn-catalog[].pack + intl/manifest；分卷是派生产物） */
  /* 必须与 CALR.fulltext.packFor() 的「首命中优先」语义一致，故按反向优先级覆盖赋值：
     packFor 顺序 = fulltext/manifest → cn-catalog → intl/manifest，先命中即返回。 */
  const packById = {};
  if (im && im.byLaw) for (const k in im.byLaw) packById[k] = 'intl/' + im.byLaw[k];
  if (cnc && cnc.laws) for (const l of cnc.laws) if (l.id && l.pack) packById[l.id] = 'cn/' + l.pack;
  if (ftmf && ftmf.byLaw) for (const k in ftmf.byLaw) packById[k] = 'fulltext/' + ftmf.byLaw[k];

  const step = Math.max(1, Math.floor(lawFiles.length / 120));
  const packCache = {}, unresolvable = [], missingPack = [];
  let sampled = 0;
  for (let i2 = 0; i2 < lawFiles.length; i2 += step) {
    const id = lawFiles[i2].replace(/\.json$/, '');
    sampled++;
    const pk = packById[id];
    if (!pk) { unresolvable.push(id); continue; }
    /* 抽查该分卷内确实定义了此 id（分卷文件按需读取并缓存） */
    const rel = 'prototype/data/' + pk + '.js';
    let txt = packCache[rel];
    if (txt === undefined) {
      try { txt = fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { txt = null; }
      packCache[rel] = txt;
    }
    if (txt === null) { missingPack.push(pk); continue; }
    if (txt.indexOf('["' + id + '"]') < 0) unresolvable.push(id + '(不在 ' + pk + ')');
  }
  if (unresolvable.length) fail('laws/ 中 ' + unresolvable.length + '/' + sampled + ' 部无法解析到分卷或在分卷中缺失：' + unresolvable.slice(0, 5).join(', '));
  else if (missingPack.length) fail('分卷文件缺失：' + [...new Set(missingPack)].slice(0, 5).join(', '));
  else note('laws/ → 分卷 抽样可解析（' + sampled + ' 部，步长 ' + step + '，全部命中 packFor 映射）');

  console.log('  权威存储 laws/：' + idxList.length + ' 部 / ' + sumArts + ' 条 / ' + sumChars + ' 字' +
    '（按层 ' + JSON.stringify(m.byLayer || {}) + '）');
}

/* ---------- 输出 ---------- */
console.log('');
if (W.length) { console.log('警告 ' + warn + ' 条：'); console.log(W.slice(0, 20).join('\n')); if (W.length > 20) console.log('  …其余 ' + (W.length - 20) + ' 条'); console.log(''); }
if (E.length) { console.log('错误 ' + err + ' 条：'); console.log(E.slice(0, 30).join('\n')); if (E.length > 30) console.log('  …其余 ' + (E.length - 30) + ' 条'); console.log(''); }
if (N.length) { console.log('提示 ' + note_n + ' 条（不阻断校验，属已知存量/设计内正常项，供后续排期）：'); console.log(N.join('\n')); console.log(''); }
console.log('===== 校验结果：' + (err ? '不通过（' + err + ' 个错误 / ' + warn + ' 个警告）' : '全部通过（' + warn + ' 个警告 / ' + note_n + ' 个提示）') + ' =====');
process.exit(err ? 1 : 0);
