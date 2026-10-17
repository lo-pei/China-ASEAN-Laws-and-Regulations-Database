#!/usr/bin/env node
/* CALR · 法规标题中译回执校验器
   用法：
     node tools/verify-title-return.js <回执包目录> --job <任务包目录>
     node tools/verify-title-return.js <回执包目录> --job <任务包目录> --partial
   --partial：允许只交一部分（分批交付），但每条 id 仍需合法、不得重复
   退出码：0 全部通过；1 存在错误
*/
'use strict';
const fs = require('fs'), path = require('path');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return (v === undefined || v.startsWith('--')) ? true : v;
}
const RET = process.argv[2];
const JOB = arg('job', null);
const PARTIAL = arg('partial', false) === true;

if (!RET || !JOB) {
  console.error('用法: node tools/verify-title-return.js <回执包目录> --job <任务包目录> [--partial]');
  process.exit(2);
}

let errors = [], warns = [], oks = 0;
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);
const ok = () => oks++;

/* ---------- 读取任务包 ---------- */
let manifest, wanted;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(JOB, 'manifest.json'), 'utf8'));
  const list = JSON.parse(fs.readFileSync(path.join(JOB, 'titles.json'), 'utf8'));
  wanted = new Map(list.map(x => [x.id, x]));
} catch (e) {
  console.error('  ✗ 任务包无法读取: ' + e.message);
  process.exit(2);
}

/* ---------- R1 目录结构 ---------- */
if (!fs.existsSync(RET)) { console.error('  ✗ 回执包目录不存在: ' + RET); process.exit(1); }
const files = fs.readdirSync(RET);
const shardFiles = files.filter(f => /^titles\.\d{3}\.json$/.test(f)).sort();
const hasReceipt = files.indexOf('receipt.json') >= 0;
hasReceipt ? ok() : E('R1 缺少 receipt.json');
shardFiles.length ? ok() : E('R1 缺少 titles.<NNN>.json 分片文件');

/* ---------- R12 分片编号连续 ---------- */
if (shardFiles.length) {
  const nums = shardFiles.map(f => parseInt(f.slice(7, 10), 10));
  let seq = true;
  nums.forEach((n, i) => { if (n !== i + 1) seq = false; });
  seq ? ok() : W('R12 分片编号不连续: ' + nums.join(','));
}

/* ---------- 读取 receipt ---------- */
let receipt = null;
if (hasReceipt) {
  try {
    const raw = fs.readFileSync(path.join(RET, 'receipt.json'), 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) E('R13 receipt.json 含 BOM');
    else ok();
    receipt = JSON.parse(raw);
  } catch (e) { E('R1 receipt.json 解析失败: ' + e.message); }
}

/* ---------- R2 jobId 一致 ---------- */
if (receipt) {
  (receipt.jobId === manifest.jobId) ? ok() : E('R2 receipt.jobId 与任务包不一致（' + receipt.jobId + ' ≠ ' + manifest.jobId + '）');
  if (!receipt.engine) W('R2 receipt 未声明 engine（如 llm）');
  if (!receipt.model) W('R2 receipt 未声明 model');
}

/* ---------- 收集所有条目 ---------- */
const got = new Map();       // id -> {zh, note, shard}
const idSeen = new Map();    // id -> 出现次数
let totalItems = 0;

const CJK = /[\u4e00-\u9fff]/g;
const LATIN = /[A-Za-z][A-Za-z0-9&\-'.]*/g;
/* 「略」只作为独立省略标记时才算套话（原写法裸匹配「略」，会把「战略/策略/简略」误判为套话） */
const FORBID = /(免责|仅供参考|翻译说明|待译|TODO|待补充|占位|[（(]\s*略\s*[）)]|无法翻译|原文见|以下为|说明[:：])/;
const ALLOW_LATIN = /^(?:No|no|B\.E\.|BE|REIT|PPP|MAS|ACRA|MOM|SGD|SDK|LLP|LLPs|Pte|Ltd|Inc|Corp|Co|de|del|la|san|santa|santo|sto|nya)$/;

for (const f of shardFiles) {
  const p = path.join(RET, f);
  const raw = fs.readFileSync(p, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) { E('R13 ' + f + ' 含 BOM'); continue; }
  let j;
  try { j = JSON.parse(raw); } catch (e) { E('R1 ' + f + ' JSON 解析失败: ' + e.message); continue; }
  const items = j.items || (Array.isArray(j) ? j : null);
  if (!items) { E('R1 ' + f + ' 缺少 items 数组'); continue; }
  if (j.jobId && j.jobId !== manifest.jobId) E('R2 ' + f + ' jobId 不一致');
  for (const it of items) {
    totalItems++;
    if (!it || typeof it.id !== 'string') { E('R3 ' + f + ' 存在缺少 id 的条目'); continue; }
    idSeen.set(it.id, (idSeen.get(it.id) || 0) + 1);
    if (!wanted.has(it.id)) { E('R4 ' + f + ' 出现任务包中不存在的 id: ' + it.id); continue; }
    got.set(it.id, { zh: it.zh, note: it.note, shard: f });
  }
}

/* ---------- 逐条规则 ---------- */
const req = wanted.size;
let checked = 0;
for (const [id, v] of got) {
  checked++;
  const src = wanted.get(id).en || '';
  const zh = typeof v.zh === 'string' ? v.zh.trim() : '';
  const tag = v.shard + ' ' + id;

  /* R5 非空 + 长度 */
  if (!zh) { E('R5 ' + tag + ' zh 为空'); continue; }
  if (zh.length < 2) { E('R5 ' + tag + ' zh 过短: ' + zh); continue; }
  if (zh.length > 90) { E('R5 ' + tag + ' zh 过长（' + zh.length + ' > 90）'); continue; }

  /* R6 不得照抄原文 */
  if (zh.toLowerCase() === String(src).trim().toLowerCase()) { E('R6 ' + tag + ' zh 与原文完全相同（未翻译）'); continue; }

  /* R7 中文为主 */
  const cjk = (zh.match(CJK) || []).length;
  const lat = (zh.match(/[A-Za-z]/g) || []).length;
  if (cjk < 2) { E('R7 ' + tag + ' 中文字符过少（' + cjk + '）'); continue; }
  const ratio = cjk / Math.max(1, cjk + lat);
  if (ratio < 0.5) E('R7 ' + tag + ' 中文占比过低（' + (ratio * 100).toFixed(0) + '%）');

  /* R8 保留的拉丁片段必须出现在原文中（防止编造公司/地名） */
  const toks = zh.match(LATIN) || [];
  const srcLow = String(src).toLowerCase();
  for (const t of toks) {
    if (ALLOW_LATIN.test(t)) continue;
    if (srcLow.indexOf(t.toLowerCase()) < 0) {
      E('R8 ' + tag + ' 出现原文中没有的拉丁片段「' + t + '」（不得编造名称）');
      break;
    }
  }

  /* R9 禁止套话/占位 */
  if (FORBID.test(zh)) E('R9 ' + tag + ' 含禁止的套话或占位词: ' + zh);

  /* R10 括号成对（中文/英文括号均可） */
  const pairs = [['（', '）'], ['(', ')'], ['《', '》'], ['「', '」']];
  for (const [a, b] of pairs) {
    const na = zh.split(a).length - 1, nb = zh.split(b).length - 1;
    if (na !== nb) { W('R10 ' + tag + ' 括号不配对: ' + a + '×' + na + ' ' + b + '×' + nb); break; }
  }
}

/* R3 每个请求 id 只出现一次 */
for (const [id, n] of idSeen) if (n > 1) E('R3 id 重复出现 ' + n + ' 次: ' + id);

/* R11 覆盖率 */
const missing = [];
for (const id of wanted.keys()) if (!got.has(id)) missing.push(id);
if (!PARTIAL && missing.length) {
  E('R11 缺少 ' + missing.length + ' 条译文（前 5: ' + missing.slice(0, 5).join(', ') + '）');
} else if (PARTIAL && missing.length) {
  W('R11 --partial 模式：本次未覆盖 ' + missing.length + ' 条');
}

/* R11 receipt 计数自证 */
if (receipt && receipt.counts) {
  const c = receipt.counts;
  const declared = (c.translated || 0) + (c.skipped || 0);
  if (declared !== req) W('R11 receipt.counts 合计 ' + declared + ' ≠ 任务 ' + req + '（--partial 下正常）');
  if ((c.translated || 0) !== got.size) E('R11 receipt.counts.translated=' + c.translated + ' 与实际 ' + got.size + ' 不符');
}

/* ---------- 汇总 ---------- */
console.log('  任务包: ' + manifest.jobId + '（' + req + ' 条，targetLang=' + manifest.targetLang + '）');
console.log('  回执包: ' + path.basename(RET) + '（' + shardFiles.length + ' 个分片，实际解析 ' + totalItems + ' 条）');
console.log('  已覆盖: ' + got.size + ' / ' + req + (PARTIAL ? '（--partial）' : ''));
console.log('  通过检查: ' + oks + ' 项');
if (warns.length) {
  console.log('');
  console.log('  ⚠ 警告 ' + warns.length + ' 条：');
  warns.slice(0, 12).forEach(w => console.log('    - ' + w));
  if (warns.length > 12) console.log('    … 其余 ' + (warns.length - 12) + ' 条');
}
if (errors.length) {
  console.log('');
  console.log('  ✗ 错误 ' + errors.length + ' 条：');
  errors.slice(0, 20).forEach(e => console.log('    - ' + e));
  if (errors.length > 20) console.log('    … 其余 ' + (errors.length - 20) + ' 条');
  console.log('');
  console.log('===== 校验结果：不通过（' + errors.length + ' 个错误 / ' + warns.length + ' 个警告） =====');
  process.exit(1);
}
console.log('');
console.log('===== 校验结果：全部通过（' + warns.length + ' 个警告） =====');
process.exit(0);
