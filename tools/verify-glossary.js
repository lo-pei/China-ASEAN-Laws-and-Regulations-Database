#!/usr/bin/env node
/* ==========================================================================
   CALR · 术语表校验器（Phase 0 用）  schema: calr-glossary-v2
   --------------------------------------------------------------------------
   用法：node tools/verify-glossary.js <glossary-<lang>.json>
         node tools/verify-glossary.js <glossary-<lang>.json> --allow-pending

   不传 --allow-pending 时，任何 status=pending 都算错误
   （Phase 0 交付要求：所有术语必须填满译名）。
   退出码：0 = 全部通过；1 = 有错误。
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
const ALLOW_PENDING = args.includes('--allow-pending');
if (!file) {
  console.error('用法: node tools/verify-glossary.js <glossary-<lang>.json> [--allow-pending]');
  process.exit(1);
}
const P = path.resolve(file);
if (!fs.existsSync(P)) { console.error('✗ 文件不存在: ' + P); process.exit(1); }

const errors = [], warns = [], notes = [];
const fail = m => errors.push(m), warn = m => warns.push(m), note = m => notes.push(m);

const buf = fs.readFileSync(P);
if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) fail('含 UTF-8 BOM');
let txt = buf.toString('utf8');
if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
let G;
try { G = JSON.parse(txt); } catch (e) { console.error('✗ JSON 解析失败: ' + e.message); process.exit(1); }

console.log('===== CALR 术语表校验 =====');
console.log('  文件: ' + path.relative(process.cwd(), P).replace(/\\/g, '/'));
console.log('');

/* ---------- 顶层 ---------- */
const SCHEMA = 'calr-glossary-v2';
if (G.schema !== SCHEMA) fail(`schema 应为 ${SCHEMA}，实际 ${G.schema}`);
if (!G.targetLang) fail('缺 targetLang');
if (!G.sourceLang) fail('缺 sourceLang');
if (!G.glossaryVersion) warn('缺 glossaryVersion');
if (!Array.isArray(G.terms)) { fail('terms 不是数组'); console.log('===== 校验结果：不通过 ====='); process.exit(1); }

const AUTHORITY = ['official', 'treaty', 'legislative-usage', 'fallback', 'pending'];
const seen = new Map();      // src|domain -> tgt
const bySrc = new Map();     // src -> [{domain,tgt,multiSense,sense}]
let pending = 0, confirmed = 0, multi = 0;

for (let i = 0; i < G.terms.length; i++) {
  const t = G.terms[i];
  const at = `terms[${i}]${t && t.src ? ' (' + t.src + ')' : ''}`;
  if (!t || typeof t !== 'object') { fail(at + ': 不是对象'); continue; }
  if (!t.src || typeof t.src !== 'string') fail(at + ': 缺 src');
  if (typeof t.tgt !== 'string') fail(at + ': tgt 必须是字符串（无译名时用空串）');
  if (!t.domain) fail(at + ': 缺 domain（领域标签为必填）');
  if (!t.authority) fail(at + ': 缺 authority');
  else if (!AUTHORITY.includes(t.authority)) fail(at + ': authority 取值非法 → ' + t.authority);
  if (!t.status) fail(at + ': 缺 status（confirmed | pending）');
  else if (!['confirmed', 'pending'].includes(t.status)) fail(at + ': status 取值非法 → ' + t.status);

  const isPending = t.status === 'pending' || !t.tgt;
  if (isPending) {
    pending++;
    if (!ALLOW_PENDING) fail(at + ': 译名为空（Phase 0 交付要求全部填满；调试可加 --allow-pending）');
  } else {
    confirmed++;
    if (t.tgt.trim() === '') fail(at + ': status=confirmed 但 tgt 为空');
    if (/^(待填|TODO|TBD|xxx|—|-|\?+)$/i.test(t.tgt.trim())) fail(at + ': tgt 是占位值 → ' + t.tgt);
    if (t.authority === 'pending') fail(at + ': status=confirmed 但 authority=pending');
  }
  if (t.multiSense) multi++;
  if (t.multiSense && !t.sense) fail(at + ': multiSense=true 但缺 sense（义项说明）');

  const key = String(t.src) + '|' + String(t.domain);
  if (seen.has(key)) fail(`${at}: (src, domain) 重复 —— 同术语同领域只能一条（若为多义项，请给不同 domain 或补 sense）`);
  else seen.set(key, t.tgt);
  if (!bySrc.has(t.src)) bySrc.set(t.src, []);
  bySrc.get(t.src).push(t);
}

/* ---------- 多义项一致性 ---------- */
let sameTgtMulti = 0;
for (const [src, arr] of bySrc) {
  if (arr.length < 2) continue;
  const tgts = new Set(arr.map(x => x.tgt).filter(Boolean));
  if (tgts.size === 1 && arr.some(x => x.multiSense)) {
    warn(`${src}: 标了 multiSense 但各义项译名相同（${[...tgts][0]}）——确认是否真的多义`);
    sameTgtMulti++;
  }
}

/* ---------- 输出 ---------- */
console.log(`  targetLang      : ${G.targetLang}`);
console.log(`  glossaryVersion : ${G.glossaryVersion || '(缺)'}`);
console.log(`  条目            : ${G.terms.length}`);
console.log(`  已确认 / 待填   : ${confirmed} / ${pending}`);
console.log(`  多义项条目      : ${multi}（涉及 ${[...bySrc.values()].filter(a => a.length > 1).length} 个 src）`);
const dupSrc = [...bySrc.entries()].filter(([, a]) => a.length > 1);
if (dupSrc.length) {
  console.log('');
  console.log('  多义项术语：');
  for (const [src, arr] of dupSrc.slice(0, 12)) {
    console.log('    ' + src + '  →  ' + arr.map(x => `[${x.domain}] ${x.tgt || '(待填)'}`).join('  |  '));
  }
}
console.log('');
for (const n of notes) console.log('  · ' + n);
for (const w of warns) console.log('  ! 警告 ' + w);
if (errors.length) {
  console.log('');
  console.log(`错误 ${errors.length} 条：`);
  for (const e of errors.slice(0, 50)) console.log('  ✗ ' + e);
  if (errors.length > 50) console.log(`  …（另有 ${errors.length - 50} 条）`);
}
console.log('');
console.log(errors.length ? '===== 校验结果：不通过 =====' : '===== 校验结果：全部通过 =====');
process.exit(errors.length ? 1 : 0);
