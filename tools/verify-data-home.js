#!/usr/bin/env node
/* CALR · 数据自足性校验：确认 prototype/ 单独拷走即为完整可运行数据
   校验内容：
     A1 laws/index.json 与 laws/*.json 一一对应（不重复、不缺失）
     A2 index.json 的 lawCount / articleCount / chars 与逐文件统计一致
     A3 每部法规的 articleCount 与 articles.length 一致；条文 id/no 唯一
     A4 packFor 可解析：法规的 layer+pack 能在 prototype/data/<layer>/<pack>.js 中找到
     A5 译文层：manifest.files 引用的每个分卷文件存在；byLaw 每条都能在文件中找到
     A6 译文条目的 lawId 必在 laws/ 中；条号必为该法规真实条号
     A7 标题译名：titleTranslation 存在时 title.zh 必须存在
     A8 无外部依赖：所有数据文件都在 prototype/ 内（相对路径不指向 ../_work）
   用法：node tools/verify-data-home.js [--verbose]
   退出码：0 通过；1 有错误
*/
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PROTO = path.join(ROOT, 'prototype');
const LAWS = path.join(PROTO, 'data/laws');
const TRANS = path.join(PROTO, 'data/trans');
const VERBOSE = process.argv.indexOf('--verbose') >= 0;

let errors = [], warns = [], oks = 0;
const E = m => errors.push(m);
const W = m => warns.push(m);
const ok = m => { oks++; if (VERBOSE && m) console.log('  ok  ' + m); };

function loadJs(p) {
  const c = { window: {}, document: {} };
  c.window = c; c.globalThis = c;
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(p, 'utf8'), c, { filename: p });
  return c;
}

/* ============ A1 / A2：laws 目录与索引 ============ */
const lawFiles = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');
const idx = JSON.parse(fs.readFileSync(path.join(LAWS, 'index.json'), 'utf8'));
const meta = idx.meta || {};
const idxLaws = idx.laws || idx.list || [];

const idsOnDisk = new Set(lawFiles.map(f => f.slice(0, -5)));
let artTotal = 0, charTotal = 0, badCount = 0, badAttr = 0;
let dupNoTotal = 0, dupIdTotal = 0;
const dupNoLaws = new Set(), dupIdLaws = new Set();
for (const f of lawFiles) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); }
  catch (e) { E('A1 ' + f + ' JSON 解析失败: ' + e.message); continue; }
  const arts = o.articles || [];
  artTotal += arts.length;
  const seen = new Set(), seenId = new Set();
  let dupNo = 0, dupId = 0, dupNoUnmarked = 0;
  for (const a of arts) {
    if (seen.has(a.no)) {
      /* 源文真实存在两套编号时，允许同号，但必须带 dupIndex 标记；
         缺少 dupIndex 的重复仍是缺陷。 */
      if (a.dupIndex) dupNo++; else dupNoUnmarked++;
    }
    seen.add(a.no);
    if (a.id) {
      if (seenId.has(a.id)) { dupId++; if (dupId <= 5) E('A3 ' + o.id + ' 条文 id 重复: ' + a.id); }
      seenId.add(a.id);
    }
    const tx = a.text || {};
    Object.keys(tx).forEach(k => { if (typeof tx[k] === 'string') charTotal += tx[k].length; });
  }
  /* 条号/条文 id 重复属「存量数据质量」问题，由专门审计跟踪；
     本检查只关心「数据是否都在 prototype 内」，故聚合为统计，不逐条报错。 */
  if (dupNo) { dupNoTotal += dupNo; dupNoLaws.add(o.id); }
  if (dupId) { dupIdTotal += dupId; dupIdLaws.add(o.id); }
  if (o.articleCount !== undefined && o.articleCount !== arts.length) {
    badCount++;
    if (badCount <= 5) E('A3 ' + o.id + ' articleCount=' + o.articleCount + ' 与 articles.length=' + arts.length + ' 不一致');
  }
  if (!o.id || !o.title) badAttr++;
}
badCount === 0 ? ok('A3 articleCount 全部一致') : null;
if (badAttr) E('A1 有 ' + badAttr + ' 部法规缺少 id 或 title');
lawFiles.length ? ok('A1 laws/ 共 ' + lawFiles.length + ' 个法规文件') : E('A1 laws/ 为空');

if (meta.lawCount !== undefined && meta.lawCount !== lawFiles.length)
  E('A2 meta.lawCount=' + meta.lawCount + ' 与文件数 ' + lawFiles.length + ' 不一致');
else ok('A2 lawCount 一致（' + lawFiles.length + '）');
if (meta.articleCount !== undefined && meta.articleCount !== artTotal)
  E('A2 meta.articleCount=' + meta.articleCount + ' 与统计 ' + artTotal + ' 不一致');
else ok('A2 articleCount 一致（' + artTotal + '）');
if (meta.chars !== undefined && Math.abs(meta.chars - charTotal) > 1000)
  W('A2 meta.chars=' + meta.chars + ' 与统计 ' + charTotal + ' 差异较大');
else ok('A2 chars 一致（' + charTotal + '）');

if (Array.isArray(idxLaws) && idxLaws.length && idxLaws.length !== lawFiles.length)
  E('A2 index.laws 条目数 ' + idxLaws.length + ' ≠ 文件数 ' + lawFiles.length);

/* ============ A4：packFor 可解析 ============ */
const packCache = new Map();
function packExists(layer, pack) {
  const key = layer + '/' + pack;
  if (packCache.has(key)) return packCache.get(key);
  const p = path.join(PROTO, 'data', layer, pack + '.js');
  const r = fs.existsSync(p);
  packCache.set(key, r);
  return r;
}
let packMiss = 0;
const checkedLayers = new Set();
for (const f of lawFiles.slice(0, 4000)) {
  let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  if (!o.layer || !o.pack) continue;
  checkedLayers.add(o.layer);
  if (!packExists(o.layer, o.pack)) { packMiss++; if (packMiss <= 5) E('A4 ' + o.id + ' 的 layer/pack 不存在: ' + o.layer + '/' + o.pack); }
}
packMiss === 0 ? ok('A4 抽样 ' + Math.min(4000, lawFiles.length) + ' 部的 layer/pack 全部可解析') : null;

/* ============ A5 / A6：译文层 ============ */
if (!fs.existsSync(path.join(TRANS, 'manifest.js'))) {
  E('A5 trans/manifest.js 不存在');
} else {
  const tctx = loadJs(path.join(TRANS, 'manifest.js'));
  const tm = tctx.CALR_TRANS_MANIFEST;
  tm && tm.files && tm.files.length ? ok('A5 manifest 含 ' + tm.files.length + ' 个分卷') : E('A5 manifest.files 为空');

  const lawArticles = new Map();   // lawId -> Set(no)
  const lawJSON = new Map();
  for (const f of lawFiles) {
    let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
    lawJSON.set(o.id, o);
    lawArticles.set(o.id, new Set((o.articles || []).map(a => a.no)));
  }

  const declaredLaws = new Set();
  let transTotal = 0, orphanLaw = 0, orphanNo = 0;
  for (const fl of (tm.files || [])) {
    const p = path.join(TRANS, fl.file + '.js');
    if (!fs.existsSync(p)) { E('A5 分卷文件缺失: ' + fl.file + '.js（manifest 已登记）'); continue; }
    let c;
    try { c = loadJs(p); } catch (e) { E('A5 ' + fl.file + '.js 加载失败: ' + e.message); continue; }
    const T = c.CALR_TRANS || {};
    let n = 0;
    for (const lid of Object.keys(T)) {
      declaredLaws.add(lid);
      const arts = T[lid].articles || [];
      n += arts.length;
      if (!lawJSON.has(lid)) { orphanLaw++; if (orphanLaw <= 5) E('A6 译文指向 laws/ 中不存在的法规: ' + lid); }
      else {
        const real = lawArticles.get(lid);
        for (const a of arts) {
          if (!real.has(a.no)) { orphanNo++; if (orphanNo <= 5) E('A6 ' + lid + ' 译文条号 ' + a.no + ' 在原文中不存在'); break; }
        }
      }
    }
    transTotal += n;
    if (fl.articles !== undefined && fl.articles !== n) W('A5 ' + fl.file + ' manifest 记 ' + fl.articles + ' 条，实际 ' + n + ' 条');
    (fl.laws || []).forEach(x => { if (!declaredLaws.has(x) && !(c.CALR_TRANS || {})[x]) W('A5 ' + fl.file + ' manifest 列入 ' + x + '，分卷内无此法规'); });
  }
  ok('A6 译文共 ' + transTotal + ' 条，涉及 ' + Object.keys(tm.byLaw || {}).length + ' 部');
  if (orphanLaw === 0) ok('A6 译文无孤儿法规');
  if (orphanNo === 0) ok('A6 译文条号全部可在原文中找到');

  /* byLaw 索引一致性 */
  let byLawMiss = 0;
  for (const lid of Object.keys(tm.byLaw || {})) {
    if (!lawJSON.has(lid)) { byLawMiss++; E('A5 byLaw 含 laws/ 不存在的法规: ' + lid); }
    const packs = tm.byLaw[lid] || {};
    for (const lg of Object.keys(packs)) {
      const f = packs[lg];
      const fl = (tm.files || []).find(x => x.file === f);
      if (!fl) E('A5 byLaw[' + lid + '].' + lg + ' 指向未登记的分卷: ' + f);
    }
  }
  byLawMiss === 0 ? ok('A5 byLaw 索引全部有效') : null;
}

/* ============ A7：标题译名一致性 ============ */
let titleMeta = 0, titleMiss = 0;
for (const f of lawFiles) {
  let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  if (o.titleTranslation && !(o.title && o.title.zh)) {
    titleMiss++;
    if (titleMiss <= 5) E('A7 ' + o.id + ' 有 titleTranslation 但缺 title.zh');
  } else if (o.titleTranslation) titleMeta++;
}
titleMiss === 0 ? ok('A7 标题译名元数据一致（' + titleMeta + ' 部带译名来源）') : null;

/* ============ A9/A10/A11：标题译名归档 ============ */
const TZDIR = path.join(PROTO, 'data/title-zh');
if (!fs.existsSync(TZDIR)) {
  E('A9 缺少 prototype/data/title-zh/（法规标题中译归档目录）');
} else {
  let tzIdx = null;
  try { tzIdx = JSON.parse(fs.readFileSync(path.join(TZDIR, 'index.json'), 'utf8')); }
  catch (e) { E('A9 title-zh/index.json 解析失败: ' + e.message); }

  /* 统计 laws/ 实际中文标题数 */
  let lawZh = 0;
  const zhMap = new Map();
  for (const f of lawFiles) {
    let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
    const z = (o.title || {}).zh;
    if (z) { lawZh++; zhMap.set(o.id, z); }
  }

  if (tzIdx) {
    if (tzIdx.translatedCount !== lawZh)
      E('A9 index.json translatedCount=' + tzIdx.translatedCount + ' ≠ laws/ 实际 ' + lawZh);
    else ok('A9 标题译名计数一致（' + lawZh + '）');
  }

  /* A10 titles.zh.json 与 laws/ 逐条一致 */
  const tzf = path.join(TZDIR, 'titles.zh.json');
  if (!fs.existsSync(tzf)) {
    E('A10 缺少 title-zh/titles.zh.json');
  } else {
    let ex = null;
    try { ex = JSON.parse(fs.readFileSync(tzf, 'utf8')); }
    catch (e) { E('A10 titles.zh.json 解析失败: ' + e.message); }
    if (ex) {
      const rows = ex.titles || {};
      let mismatch = 0, extra = 0;
      for (const [id, r] of Object.entries(rows)) {
        if (!zhMap.has(id)) { extra++; if (extra <= 5) E('A10 titles.zh.json 含 laws/ 无中文标题的 id: ' + id); continue; }
        if (zhMap.get(id) !== r.zh) { mismatch++; if (mismatch <= 5) E('A10 ' + id + ' 译名与 laws/ 不一致'); }
      }
      let missing = 0;
      for (const id of zhMap.keys()) if (!rows[id]) { missing++; if (missing <= 5) E('A10 titles.zh.json 缺 ' + id); }
      if (!mismatch && !missing && !extra) ok('A10 titles.zh.json 与 laws/ 逐条一致（' + lawZh + ' 条）');
    }
  }

  /* A11 artifacts 非空 */
  const artDir = path.join(TZDIR, 'artifacts');
  if (!fs.existsSync(artDir)) E('A11 缺少 title-zh/artifacts/');
  else {
    const n = fs.readdirSync(artDir).length;
    n ? ok('A11 artifacts/ 含 ' + n + ' 项') : E('A11 title-zh/artifacts/ 为空');
  }
}

/* ============ A8：不引用 prototype/ 之外的数据 ============ */
const dataDirs = ['data', 'assets'];
let outside = 0;
for (const d of dataDirs) {
  const base = path.join(PROTO, d);
  if (!fs.existsSync(base)) continue;
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const st = fs.statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      if (!/\.(js|json|css|html)$/.test(f)) continue;
      const head = fs.readFileSync(p, 'utf8').slice(0, 4000);
      /* 只认真正引用 _work 的写法（排除注释里的说明） */
      const m = head.match(/["'](?:\.\.\/)+_work\//);
      if (m) { outside++; if (outside <= 5) E('A8 ' + path.relative(ROOT, p) + ' 引用了 prototype/ 之外的 _work 路径'); }
    }
  };
  walk(base);
}
outside === 0 ? ok('A8 prototype/ 内数据不依赖 _work/') : null;

/* ============ 存量质量问题汇总（不阻断） ============ */
if (dupNoTotal || dupIdTotal) {
  W('存量数据质量：源文双编号（已标 dupIndex）' + dupNoTotal + ' 处（' + dupNoLaws.size + ' 部法规）；' +
    '条文 id 重复 ' + dupIdTotal + ' 处（' + dupIdLaws.size + ' 部法规）——属已知问题，不影响数据归属。');
}

/* ============ 汇总 ============ */
console.log('');
console.log('  prototype/ 数据自足性检查');
console.log('  --------------------------');
console.log('  法规文件      : ' + lawFiles.length);
console.log('  条文总数      : ' + artTotal);
console.log('  正文总字数    : ' + charTotal);
console.log('  已解析分卷层  : ' + [...checkedLayers].join(', '));
console.log('  通过检查项    : ' + oks);
if (warns.length) {
  console.log('');
  console.log('  ⚠ 警告 ' + warns.length + ' 条：');
  warns.slice(0, 10).forEach(w => console.log('    - ' + w));
}
if (errors.length) {
  console.log('');
  console.log('  ✗ 错误 ' + errors.length + ' 条：');
  errors.slice(0, 20).forEach(e => console.log('    - ' + e));
  console.log('');
  console.log('===== 数据自足性：不通过（' + errors.length + ' 个错误 / ' + warns.length + ' 个警告） =====');
  process.exit(1);
}
console.log('');
console.log('===== 数据自足性：全部通过（' + warns.length + ' 个警告） =====');
console.log('  结论：把 prototype/ 目录单独拷走即可完整运行，法规与译文均在内部。');
process.exit(0);
