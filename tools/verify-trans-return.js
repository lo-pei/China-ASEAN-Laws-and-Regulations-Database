#!/usr/bin/env node
/* ==========================================================================
   CALR · 译本回执校验器  (calr-trans-v2)
   --------------------------------------------------------------------------
   用法：
     node tools/verify-trans-return.js <回执包目录>
     node tools/verify-trans-return.js <回执包目录> --job <任务包目录>

   传 --job 时会做交叉校验（条数对账、sourceSha256 对账、shard 覆盖对账）。

   退出码：0 = 全部通过；1 = 有错误。
   本脚本同时被翻译 agent（交付前自检）和入库方（收件校验）使用。
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const retDir = args.find(a => !a.startsWith('--'));
const jobIdx = args.indexOf('--job');
const jobDir = jobIdx >= 0 ? args[jobIdx + 1] : null;
// --partial：分批交付时用。只校验回执中实际出现的法规/分片，未交付的记为提示而非错误。
const PARTIAL = args.includes('--partial');

if (!retDir) {
  console.error('用法: node tools/verify-trans-return.js <回执包目录> [--job <任务包目录>] [--partial]');
  console.error('  --partial  分批交付：未出现在回执中的法规/分片不算错误（记为提示）');
  process.exit(1);
}

const errors = [];
const warns = [];
const notes = [];
const fail = (m) => errors.push(m);
const warn = (m) => warns.push(m);
const note = (m) => notes.push(m);

/* ---------- 工具 ---------- */
const FORMAT = 'calr-trans-v2';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const LEDGER = ['calr-trans-v2'];
const MODAL_LANGS = ['zh', 'th', 'vi', 'id', 'ms', 'en'];
// R7 截断/占位：分两类
//  ① 无条件：这些是 agent 的产物，正式法律文本不会出现
const PLACEHOLDER_HARD = [/\(略\)/, /（略）/, /待补/, /\bTODO\b/, /\bTBD\b/, /\[待译\]/, /\[待补\]/, /\[未译\]/];
//  ② 源相对：省略号与点线在法律文本里是合法的（如填空线 "Name: ......"、中文列举 "……"），
//     只有「译文中出现、而原文同处没有」才算截断。需要 --job 才能判定，否则降级为警告。
const PLACEHOLDER_REL = [/…+/g, /\.{4,}/g, /\*{3,}/g];
function relHits(s) {
  const out = [];
  for (const re of PLACEHOLDER_REL) {
    const m = String(s).match(re);
    if (m) out.push(...m);
  }
  return out;
}
// R8 免责/译注话术（译文文件里不得出现）
const DISCLAIMER = [/以上.{0,6}(由|系).{0,4}AI/i, /AI\s*生成/, /仅供参考/, /不构成法律意见/, /机器翻译/, /译者注/, /译注[:：]/, /机器译文/];
// R21/R22/R27 只适用于「中译外」任务（§4.11 是为中文法律层级量身定的）。
// 其他源语言（如英译泰）的层级词随源文结构与目标法域惯例，不做强制，只提示。
let SOURCE_IS_ZH = false;

// R23 拼写体系（§4.11.3）：由任务包 manifest.spelling 声明，未声明则不判定（只提示）。
//   依据：《民法典》官方英译本实测用 **美式**（organization / authorization / center …）；
//   而文莱、新加坡等法域官方文本用英式（organisation / authorisation / centre …）。
//   故不能全库统一，必须按 job 声明。
const SPELL_RULES = {
  'en-US': {
    hard: [/\borganisation/i, /\borganise[ds]?\b/i, /\brecognise[ds]?\b/i, /\bauthorisation\b/i, /\bfulfilment\b/i],
    soft: [/\bdefence\b/i, /\boffence\b/i, /\bcentre\b/i, /\bjudgement\b/i, /\bauthorise[ds]?\b/i, /\bfavour\b/i, /\bcolour\b/i, /\blabour\b/i]
  },
  'en-GB': {
    hard: [/\borganization/i, /\borganize[ds]?\b/i, /\brecognize[ds]?\b/i, /\bauthorization\b/i, /\bfulfillment\b/i],
    soft: [/\bdefense\b/i, /\boffense\b/i, /\bcenter\b/i, /\bjudgement\b/i, /\bauthorize[ds]?\b/i, /\bfavor\b/i, /\bcolor\b/i, /\blabor\b/i]
  }
};
let SPELL = null;        // 当前 job 声明的拼写体系规则；null = 未声明
let SPELL_NAME = '';     // 'en-US' | 'en-GB' | ''
// 专名保留官方拼写，不参与拼写体系判定（如 ISO 的官方英文名用 -z）
const SPELL_PROPER = [/International Organization for Standardization/g, /International Labour Organization/g, /World Trade Organization/gi, /World Health Organization/g];
function spellCheck(v, tag, label) {
  if (!SPELL || !v) return;
  let s = v;
  for (const re of SPELL_PROPER) s = s.replace(re, '');
  for (const re of SPELL.hard) if (re.test(s)) fail(`${tag}${label}: 拼写不符声明的 ${SPELL_NAME}（${re}）→ §4.11.3`);
  for (const re of SPELL.soft) if (re.test(s)) warn(`${tag}${label}: 疑似不符声明的 ${SPELL_NAME}（${re}）→ §4.11.3`);
}

function readJson(p) {
  const buf = fs.readFileSync(p);
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    fail(`${rel(p)}: 含 UTF-8 BOM（R1 要求无 BOM）`);
  }
  let txt = buf.toString('utf8');
  if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
  try {
    return JSON.parse(txt);
  } catch (e) {
    fail(`${rel(p)}: JSON 解析失败 — ${e.message}`);
    return null;
  }
}
const ROOT = path.resolve(retDir);
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/') || path.basename(p);
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

console.log('===== CALR 译本回执校验 =====');
console.log('  回执包: ' + ROOT);
if (jobDir) console.log('  任务包: ' + path.resolve(jobDir));
console.log('');

/* ---------- 0. 目录结构 ---------- */
if (!fs.existsSync(ROOT) || !fs.statSync(ROOT).isDirectory()) {
  console.error('✗ 回执包目录不存在: ' + ROOT);
  process.exit(1);
}
const receiptPath = path.join(ROOT, 'receipt.json');
if (!fs.existsSync(receiptPath)) fail('缺少 receipt.json（§2.1，缺此项视为未交付）');
if (!fs.existsSync(path.join(ROOT, 'unresolved.json'))) fail('缺少 unresolved.json（R18，可为空 items）');
const returnsDir = path.join(ROOT, 'returns');
if (!fs.existsSync(returnsDir)) fail('缺少 returns/ 目录');

/* ---------- 1. 任务包（可选） ---------- */
let job = null;
const jobItems = new Map();
if (jobDir) {
  const jm = readJson(path.join(jobDir, 'manifest.json'));
  if (!jm) fail('任务包 manifest.json 无法读取');
  else {
    job = jm;
    for (const it of jm.items || []) jobItems.set(it.lawId, it);
    if (jm.formatVersion !== FORMAT) fail(`任务包 formatVersion 不是 ${FORMAT}`);
    if (!/^CALR-TRANS-/.test(String(jm.jobId || ''))) warn('任务包 jobId 命名不符合 CALR-TRANS-<...> 约定');
    SOURCE_IS_ZH = jm.sourceLang === 'zh' || (Array.isArray(jm.sourceLang) && jm.sourceLang.includes('zh'));
    if (jm.spelling) {
      if (SPELL_RULES[jm.spelling]) { SPELL = SPELL_RULES[jm.spelling]; SPELL_NAME = jm.spelling; }
      else warn(`任务包 spelling="${jm.spelling}" 不是支持的取值（en-US | en-GB），拼写检查已跳过`);
    } else {
      note('任务包未声明 spelling，拼写体系检查已跳过（§4.11.3 建议在 manifest 里声明 en-US 或 en-GB）');
    }
  }
}

/* ---------- 2. receipt.json ---------- */
let receipt = null;
if (fs.existsSync(receiptPath)) {
  receipt = readJson(receiptPath);
  if (receipt) {
    const R = receipt;
    if (R.formatVersion !== FORMAT) fail(`receipt.formatVersion 应为 ${FORMAT}，实际 ${R.formatVersion}`);
    if (!R.jobId) fail('receipt.jobId 缺失');
    if (!R.targetLang) fail('receipt.targetLang 缺失');
    if (job && R.jobId !== job.jobId) fail(`receipt.jobId (${R.jobId}) 与任务包 (${job.jobId}) 不一致`);
    if (job && R.targetLang !== job.targetLang) fail(`receipt.targetLang (${R.targetLang}) 与任务包 (${job.targetLang}) 不一致`);

    const p = R.provenance || {};
    // engine=official 表示「官方译本直接入库」，此时不需要 model（没有模型生成它）
    const isOfficial = p.engine === 'official';
    for (const k of ['engine', 'promptVersion', 'translatedAt', 'reviewed']) {
      if (!p[k]) fail(`receipt.provenance.${k} 缺失（§2.1 必填）`);
    }
    if (!isOfficial && !p.model) fail('receipt.provenance.model 缺失（§2.1 必填；engine=official 时可省略）');
    if (isOfficial && !p.sourceDocument) warn('engine=official 但未填 provenance.sourceDocument（建议记录官方译本文件与 sha256）');
    if (p.engine && !['llm', 'mt', 'human', 'official'].includes(p.engine)) fail(`provenance.engine 取值非法: ${p.engine}`);
    if (p.reviewed && !['machine', 'hybrid', 'human'].includes(p.reviewed)) fail(`provenance.reviewed 取值非法: ${p.reviewed}`);
    if (p.translatedAt && !ISO_DATE.test(p.translatedAt)) fail(`provenance.translatedAt 必须是 YYYY-MM-DD，实际 ${p.translatedAt}`);
    if (p.model && /^(ai|llm|模型|model)$/i.test(String(p.model))) warn('provenance.model 写的是泛称，应写具体模型名');

    const cov = Array.isArray(R.coverage) ? R.coverage : [];
    if (!cov.length) fail('receipt.coverage 缺失或为空（§2.1 覆盖度自证为必填）');
    for (const c of cov) {
      const tag = `coverage[${c.lawId || '?'}]`;
      if (!c.lawId) { fail(`${tag}: 缺 lawId`); continue; }
      for (const k of ['sourceSha256', 'sourceArticleCount', 'returnedArticleCount', 'shards']) {
        if (c[k] === undefined || c[k] === null) fail(`${tag}: 缺 ${k}`);
      }
      if (Array.isArray(c.missingNos) && c.missingNos.length) fail(`${tag}: missingNos 非空（漏条）→ ${JSON.stringify(c.missingNos.slice(0, 12))}`);
      if (Array.isArray(c.extraNos) && c.extraNos.length) fail(`${tag}: extraNos 非空（多条/改号）→ ${JSON.stringify(c.extraNos.slice(0, 12))}`);
      if (c.sourceArticleCount !== c.returnedArticleCount) {
        fail(`${tag}: 条数不符 source=${c.sourceArticleCount} returned=${c.returnedArticleCount}（R2）`);
      }
      if (job) {
        const it = jobItems.get(c.lawId);
        if (!it) fail(`${tag}: 该 lawId 不在任务包 manifest.items 中`);
        else {
          if (it.articleCount !== c.sourceArticleCount) {
            // 分批交付（--partial）时，sourceArticleCount 是「本批交付范围」的条数，
            // 与整法条数不等是正常的；只在全量交付时要求相等。
            if (PARTIAL) note(`${tag}: 本批 sourceArticleCount=${c.sourceArticleCount}，该法全量 ${it.articleCount} 条（--partial）`);
            else fail(`${tag}: sourceArticleCount (${c.sourceArticleCount}) 与任务包 (${it.articleCount}) 不一致`);
          }
          if (it.sourceSha256 && c.sourceSha256 !== it.sourceSha256) fail(`${tag}: sourceSha256 与任务包不一致（R16，可能串包）`);
          const need = new Set((it.shards || []).map(s => String(s.shardId)));
          const got = new Set((c.shards || []).map(String));
          const missShard = [...need].filter(s => !got.has(s));
          if (missShard.length) {
            if (PARTIAL) note(`${tag}: 本批未交付分片 ${missShard.join(',')}（--partial，不计为错误）`);
            else fail(`${tag}: 缺分片 ${missShard.join(',')}（任务包要求 ${[...need].join(',')}）`);
          }
          for (const s of got) if (!need.has(s)) warn(`${tag}: 回传了任务包未要求的分片 ${s}`);
        }
      }
    }
    if (!R.selfCheck) warn('receipt.selfCheck 缺失（§7 要求附自检结果）');
    else if (R.selfCheck.exitCode === null || R.selfCheck.exitCode === undefined) {
      warn('receipt.selfCheck.exitCode 未填（译者尚未自跑校验器；本校验器结果为准）');
    } else if (String(R.selfCheck.exitCode) !== '0') {
      fail(`receipt.selfCheck.exitCode = ${R.selfCheck.exitCode}，自检未通过`);
    }
  }
}

/* ---------- 3. returns/*.json ---------- */
/* 源文缓存（源相对截断检测用） */
/* 源分片条号顺序缓存（R4 的对账基准）：
   部分印尼法规的源数据 `no` 本身不升序（如《中央银行法》释义段把被释义条文的 Pasal 号当作记录号），
   此时「严格升序」不是正确约束；正确约束是「回执条号序列与源分片逐位一致」。 */
const srcOrderCache = new Map();
function srcOrderOf(lawId, shardId) {
  if (!jobDir) return null;
  const key = lawId + '.' + shardId;
  if (srcOrderCache.has(key)) return srcOrderCache.get(key);
  let order = null;
  const sp = path.join(jobDir, 'shards', key + '.json');
  if (fs.existsSync(sp)) {
    const S = readJson(sp);
    if (S && Array.isArray(S.articles)) order = S.articles.map(a => a.no);
  }
  srcOrderCache.set(key, order);
  return order;
}

const srcCache = new Map();
function srcTextOf(lawId) {
  if (srcCache.has(lawId)) return srcCache.get(lawId);
  let m = null;
  if (jobDir) {
    const lp = path.join(jobDir, 'laws', lawId + '.json');
    if (fs.existsSync(lp)) {
      const L = readJson(lp);
      if (L && Array.isArray(L.articles)) {
        m = new Map();
        for (const a of L.articles) {
          const t = (a.text && (a.text[L.sourceLang] || Object.values(a.text)[0])) || '';
          m.set(a.no, t);
        }
      }
    }
  }
  srcCache.set(lawId, m);
  return m;
}

const files = walk(returnsDir).filter(f => f.endsWith('.json'));
if (!files.length) fail('returns/ 下没有任何 .json');
const seenLaw = new Map();      // lawId -> Set(no)
const shardSpan = new Map();    // lawId -> [{shardId,min,max,count}]
const langsUsed = new Set();
const modelSeen = new Set();
const officialSeen = new Set();

for (const f of files) {
  const o = readJson(f);
  if (!o) continue;
  const tag = rel(f);
  if (o.formatVersion !== FORMAT) fail(`${tag}: formatVersion 应为 ${FORMAT}`);
  for (const k of ['jobId', 'lawId', 'shardId', 'sourceLang', 'targetLang']) {
    if (!o[k]) fail(`${tag}: 缺 ${k}`);
  }
  if (receipt && o.jobId && o.jobId !== receipt.jobId) fail(`${tag}: jobId 与 receipt 不一致`);
  const tgt = o.targetLang;
  const srcText = srcTextOf(o.lawId);
  langsUsed.add(tgt);
  if (receipt && tgt !== receipt.targetLang) fail(`${tag}: targetLang (${tgt}) 与 receipt.targetLang 不一致`);
  if (o.provenance && o.provenance.model) modelSeen.add(o.provenance.model);
  if (o.provenance && o.provenance.model && /^(ai|llm|模型)$/i.test(String(o.provenance.model))) warn(`${tag}: provenance.model 写的是泛称`);
  if (o.provenance && o.provenance.engine === 'official') officialSeen.add(o.lawId);

  const arts = o.articles;
  if (!Array.isArray(arts)) { fail(`${tag}: articles 不是数组`); continue; }
  if (arts.length === 0) fail(`${tag}: articles 为空`);
  if (arts.length > 200) fail(`${tag}: articles 数量 ${arts.length} > 200（R14，必须分片）`);
  const sz = fs.statSync(f).size;
  if (sz > 2 * 1024 * 1024) fail(`${tag}: 文件 ${(sz / 1048576).toFixed(2)} MB > 2 MB（R14）`);

  const nos = [];
  let prev = -Infinity;
  const srcOrder = srcOrderOf(o.lawId, o.shardId);
  for (let i = 0; i < arts.length; i++) {
    const a = arts[i];
    const at = `${tag}#${i}`;
    if (typeof a.no !== 'number' || !Number.isFinite(a.no)) { fail(`${at}: no 必须是数字，实际 ${JSON.stringify(a.no)}`); continue; }
    // 插入条（第X条之一）：任务包源文本身就用非整数条号编码（如 17.1 = 第十七条之一）。
    // 此时允许非整数，但必须与源文条号逐字一致（R19 不得改号）；
    // 源文为整数而回执给了小数，仍按改号处理。
    if (!Number.isInteger(a.no)) {
      const srcM = srcTextOf(o.lawId);
      if (!srcM || !srcM.has(a.no)) {
        fail(`${at}: no 必须是整数，实际 ${JSON.stringify(a.no)}（源文无此插入条号，R19 不得改号）`);
        continue;
      }
    }
    nos.push(a.no);
    if (srcOrder) {
      // R4（源顺序基准）：源文本身不升序时，要求回执与源分片逐位同序
      if (srcOrder[i] !== a.no) {
        fail(`${at}: no 与源分片第 ${i + 1} 条不一致（源 ${srcOrder[i]} → 回执 ${a.no}，R4 不得改号/乱序）`);
      }
    } else if (a.no <= prev) {
      fail(`${at}: no 未严格升序（${prev} → ${a.no}，R4）`);
    }
    prev = a.no;

    // R21/R22/R27 层级字段格式（chapter / heading）—— 仅中译外任务
    for (const fld of ['chapter', 'heading']) {
      const v = a[fld] && a[fld][tgt];
      if (v === undefined || v === null) continue;
      if (typeof v !== 'string' || !v.trim()) { fail(`${at} (no=${a.no}).${fld}: 为空字符串（要么省略该键，要么给非空值）`); continue; }
      if (SOURCE_IS_ZH) {
        // R21: U+3000 只能作层级分隔符
        //   层级最多 3 级（编/分编 + 章 + 节）→ 分隔符最多 2 个
        //   每段必须以合法层级词开头，且层级顺序必须递增
        const segs = v.split('\u3000');
        if (segs.length > 3) {
          fail(`${at} (no=${a.no}).${fld}: 含 ${segs.length - 1} 个 U+3000，层级最多 3 级（编+章+节）（R21）`);
        }
        const LEVEL_RE = /^(Book|Part|Sub-part|Chapter|Section|Article)\b/;
        const ORDER = { 'Book': 1, 'Part': 2, 'Sub-part': 3, 'Chapter': 4, 'Section': 5, 'Article': 6 };
        let lastRank = 0;
        for (let si = 0; si < segs.length; si++) {
          const seg = segs[si].trim();
          if (!seg) { fail(`${at} (no=${a.no}).${fld}: U+3000 分隔出空段（R21）`); continue; }
          const m = seg.match(LEVEL_RE);
          if (!m) {
            fail(`${at} (no=${a.no}).${fld}: 段「${seg.slice(0, 24)}」未以合法层级词开头（Book|Part|Chapter|Section|Article）（R21）`);
            continue;
          }
          const rank = ORDER[m[1]];
          if (rank <= lastRank) {
            fail(`${at} (no=${a.no}).${fld}: 层级顺序错误（${m[1]} 出现在第 ${si + 1} 段，应递增）（R21）`);
          }
          lastRank = rank;
        }
        if (/\u3000\s|\s\u3000/.test(v)) warn(`${at} (no=${a.no}).${fld}: U+3000 与普通空格相邻（R21）`);
        if (/ {2,}/.test(v)) fail(`${at} (no=${a.no}).${fld}: 标题内出现连串空格（源文的对齐填充必须还原）（R21）`);
        // 只有「逗号/大于号紧跟层级词」才算用错分隔符；标题内部的逗号不算
        if (/[,>]\s*(Book|Part|Chapter|Section|Article)\b/.test(v)) {
          warn(`${at} (no=${a.no}).${fld}: 层级之间疑似用逗号/大于号分隔（R21 要求用 U+3000）→ ${v.slice(0, 60)}`);
        }
        // R22: 层级对应词（以民法典官方英译本为准：编=Book，分编=Part）
        if (/\b(Title|Volume)\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|[IVXLC]+)\b/.test(v)) {
          fail(`${at} (no=${a.no}).${fld}: 用了 Title/Volume，编应为 Book、分编应为 Part（R22）→ ${v.slice(0, 60)}`);
        }
        if (/^\s*Part\s+[A-Z][a-z]+\b/.test(v)) warn(`${at} (no=${a.no}).${fld}: 起首用 Part，「编」应为 Book（分编才用 Part）（R22）→ ${v.slice(0, 60)}`);
        if (/\bChapter\s+\d+/.test(v)) fail(`${at} (no=${a.no}).${fld}: 章号用了阿拉伯数字，应为罗马数字（R22）→ ${v.slice(0, 60)}`);
        if (/\bBook\s+[IVXLC]+\b/.test(v)) warn(`${at} (no=${a.no}).${fld}: 「编」的编号应为英文序数词（Book One），不是罗马数字（R22）`);
      }
      if (tgt === 'en') spellCheck(v, at + ` (no=${a.no}).${fld}:`, '');
    }

    // R5/R6 译文键与内容
    if (!a.text || typeof a.text !== 'object' || Array.isArray(a.text)) { fail(`${at} (no=${a.no}): 缺 text 对象`); continue; }
    const keys = Object.keys(a.text);
    if (!keys.includes(tgt)) fail(`${at} (no=${a.no}): text 缺少目标语言键 "${tgt}"，实际键 ${JSON.stringify(keys)}（R5）`);
    const extra = keys.filter(k => k !== tgt);
    if (extra.length) fail(`${at} (no=${a.no}): text 含额外语言键 ${JSON.stringify(extra)}（R5，只能有 targetLang）`);
    const s = a.text[tgt];
    if (typeof s !== 'string' || !s.trim()) fail(`${at} (no=${a.no}): text["${tgt}"] 为空（R6）`);
    else {
      for (const re of PLACEHOLDER_HARD) if (re.test(s)) fail(`${at} (no=${a.no}): 译文含占位/截断字样 ${re}（R7）`);
      for (const re of DISCLAIMER) if (re.test(s)) fail(`${at} (no=${a.no}): 译文含免责/译注话术 ${re}（R8）`);
      if (tgt === 'en') spellCheck(s, at + ` (no=${a.no}): `, '');
      // 源相对截断检测
      if (srcText) {
        const srcV = srcText.get(a.no) || '';
        const nSrc = relHits(srcV).length, nTr = relHits(s).length;
        if (nTr > nSrc) fail(`${at} (no=${a.no}): 译文新增省略/点线 ${nTr - nSrc} 处（原文 ${nSrc} 处）→ 疑似截断（R7）`);
      }
    }
    // noLabel / heading / chapter 的语言键
    for (const fld of ['noLabel', 'heading', 'chapter']) {
      if (a[fld] === undefined) continue;
      if (typeof a[fld] !== 'object' || Array.isArray(a[fld])) { fail(`${at}.${fld} 必须是语言键对象`); continue; }
      const ks = Object.keys(a[fld]);
      if (!ks.includes(tgt)) fail(`${at} (no=${a.no}).${fld}: 缺目标语言键 "${tgt}"`);
    }
    // 条号数字部分不得改（noLabel 里的数字应与 no 一致，若含数字）
    // 插入条（no 为 17.1）的 noLabel 写作 "Article 17bis."，只含整数部分，故同时接受取整值。
    if (a.noLabel && typeof a.noLabel[tgt] === 'string') {
      const m = String(a.noLabel[tgt]).match(/\d+/g);
      const okNos = [String(a.no), String(Math.floor(a.no))];
      if (m && !m.some(x => okNos.includes(x))) {
        warn(`${at} (no=${a.no}): noLabel "${a.noLabel[tgt]}" 中的数字与 no 不一致（R10 请人工确认）`);
      }
    }
  }
  // 同片去重
  const dup = nos.filter((n, i) => nos.indexOf(n) !== i);
  if (dup.length) fail(`${tag}: 片内重复条号 ${JSON.stringify([...new Set(dup)].slice(0, 10))}`);

  if (!seenLaw.has(o.lawId)) seenLaw.set(o.lawId, new Set());
  for (const n of nos) seenLaw.get(o.lawId).add(n);
  if (!shardSpan.has(o.lawId)) shardSpan.set(o.lawId, []);
  shardSpan.get(o.lawId).push({ shardId: o.shardId, nos, min: Math.min(...nos), max: Math.max(...nos), count: nos.length });
}

/* ---------- 4. 分片间不重叠、不留缝（与任务包 shards 对账） ---------- */
for (const [lawId, spans] of shardSpan) {
  if (job) {
    // 有任务包时用「逐片条号集合精确对账」代替 min/max 区间启发：
    // 源 `no` 不升序的法规（如 ID-H067/H068）用区间判断会误报重叠。
    const it = jobItems.get(lawId);
    if (it) {
      for (const sh of it.shards || []) {
        const sp = spans.find(s => String(s.shardId) === String(sh.shardId));
        if (!sp) continue;
        const expect = srcOrderOf(lawId, sh.shardId);
        if (expect) {
          const gotSet = sp.nos.slice().sort((a, b) => a - b);
          const expSet = expect.slice().sort((a, b) => a - b);
          const miss = expSet.filter(n => !gotSet.includes(n));
          const extra = gotSet.filter(n => !expSet.includes(n));
          if (miss.length) fail(`${lawId}.${sh.shardId}: 漏条 ${JSON.stringify(miss.slice(0, 12))}（R2）`);
          if (extra.length) fail(`${lawId}.${sh.shardId}: 多条/改号 ${JSON.stringify(extra.slice(0, 12))}（R19）`);
        } else if (sp.min !== sh.fromNo || sp.max !== sh.toNo) {
          warn(`${lawId}.${sh.shardId}: 实际条号范围 ${sp.min}-${sp.max} 与任务包 ${sh.fromNo}-${sh.toNo} 不符（若非空条文则需确认）`);
        }
      }
    }
    continue;
  }
  const sorted = spans.slice().sort((a, b) => a.min - b.min);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].min <= sorted[i - 1].max) {
      fail(`${lawId}: 分片 ${sorted[i - 1].shardId} 与 ${sorted[i].shardId} 条号重叠（${sorted[i - 1].max} / ${sorted[i].min}，R4）`);
    }
  }
  if (job) {
    const it = jobItems.get(lawId);
    if (it) {
      for (const sh of it.shards || []) {
        const sp = sorted.find(s => String(s.shardId) === String(sh.shardId));
        if (sp && (sp.min !== sh.fromNo || sp.max !== sh.toNo)) {
          warn(`${lawId}.${sh.shardId}: 实际条号范围 ${sp.min}-${sp.max} 与任务包 ${sh.fromNo}-${sh.toNo} 不符（若非空条文则需确认）`);
        }
      }
    }
  }
}

/* ---------- 5. 与任务包逐条对账 no 集合 ---------- */
if (job) {
  let notDelivered = 0;
  for (const [lawId, it] of jobItems) {
    const got = seenLaw.get(lawId);
    if (!got) {
      notDelivered++;
      if (!PARTIAL) fail(`${lawId}: 任务包要求但回执中完全没有该法规`);
      continue;
    }
    if (jobDir) {
      const lp = path.join(jobDir, 'laws', lawId + '.json');
      if (fs.existsSync(lp)) {
        const L = readJson(lp);
        if (L && Array.isArray(L.articles)) {
          let want;
          if (PARTIAL) {
            // 只在该法「本次实际交付的分片范围」内对账
            const deliveredIds = new Set((shardSpan.get(lawId) || []).map(s => String(s.shardId)));
            const ranges = (it.shards || []).filter(s => deliveredIds.has(String(s.shardId)));
            want = new Set(L.articles.filter(a => ranges.some(r => a.no >= r.fromNo && a.no <= r.toNo)).map(a => a.no));
          } else {
            want = new Set(L.articles.map(a => a.no));
          }
          const missing = [...want].filter(n => !got.has(n));
          const extra = [...got].filter(n => !want.has(n));
          if (missing.length) fail(`${lawId}: 漏条 ${missing.length} 个 → ${JSON.stringify(missing.slice(0, 12))}（R2/R3）`);
          if (extra.length) fail(`${lawId}: 多出条号 ${extra.length} 个 → ${JSON.stringify(extra.slice(0, 12))}（R3）`);
          if (!missing.length && !extra.length) note(`${lawId}: 条号集合与原文完全一致（${want.size} 条${PARTIAL ? '，本批范围' : ''}）`);
        }
      } else {
        warn(`${lawId}: 任务包缺少 laws/${lawId}.json，无法逐条对账`);
      }
    }
  }
  if (notDelivered) {
    if (PARTIAL) note(`本批未交付法规 ${notDelivered} 部（--partial，不计为错误）`);
    else note(`未交付法规 ${notDelivered} 部`);
  }
}

/* ---------- 6. 语言纯净性（R15）抽样 ---------- */
if (langsUsed.size > 1) fail(`回执中出现多个 targetLang: ${JSON.stringify([...langsUsed])}（R15/§4.10 一次任务只能一种目标语言）`);
if (modelSeen.size > 1) warn(`回执中出现多个 provenance.model: ${JSON.stringify([...modelSeen])}（同一批建议一致）`);

/* ---------- 7. unresolved.json ---------- */
const up = path.join(ROOT, 'unresolved.json');
if (fs.existsSync(up)) {
  const U = readJson(up);
  if (U) {
    if (U.formatVersion && U.formatVersion !== FORMAT) fail(`unresolved.formatVersion 应为 ${FORMAT}`);
    const items = Array.isArray(U.items) ? U.items : [];
    for (const it of items) {
      if (!it.lawId || typeof it.no !== 'number' || !it.reason) fail(`unresolved 项缺 lawId/no/reason: ${JSON.stringify(it).slice(0, 120)}`);
      if (!['keptSource', 'inlineMarker'].includes(it.action)) fail(`unresolved 项 action 非法（应为 keptSource|inlineMarker）: ${JSON.stringify(it).slice(0, 120)}`);
      if (!seenLaw.has(it.lawId) || !seenLaw.get(it.lawId).has(it.no)) {
        fail(`unresolved 声明的 ${it.lawId} no=${it.no} 在回执中找不到对应条文`);
      }
    }
    note(`unresolved 项: ${items.length}`);
  }
}

/* ---------- 8. glossary-additions ---------- */
const ga = path.join(ROOT, 'glossary-additions.json');
if (fs.existsSync(ga)) {
  const G = readJson(ga);
  if (G && Array.isArray(G.additions)) {
    for (const a of G.additions) {
      if (!a.src || !a.tgt) fail(`glossary-additions 项缺 src/tgt: ${JSON.stringify(a).slice(0, 100)}`);
      if (a.authority && !['official', 'treaty', 'legislative-usage', 'fallback'].includes(a.authority)) {
        fail(`glossary-additions.authority 取值非法: ${a.authority}`);
      }
    }
    note(`新增术语: ${G.additions.length}`);
    // 跨分片术语一致性：同 src 必须同 tgt
    const m = new Map();
    for (const a of G.additions) {
      const k = String(a.src).toLowerCase();
      if (m.has(k) && m.get(k) !== a.tgt) fail(`术语 "${a.src}" 在同一回执内出现两种译法："${m.get(k)}" / "${a.tgt}"（R11）`);
      m.set(k, a.tgt);
    }
  } else warn('glossary-additions.json 无 additions 数组');
} else warn('缺少 glossary-additions.json（§2.3，无新术语时也应给空表）');

/* ---------- 9. 输出 ---------- */
console.log('  回执文件: %d 个分片；涉及法规 %d 部；目标语言 %s', files.length, seenLaw.size, [...langsUsed].join(',') || '(无)');
if (officialSeen.size) console.log('  其中官方译本（engine=official）：%d 部 → %s', officialSeen.size, [...officialSeen].join(', '));
for (const [lawId, nos] of seenLaw) console.log('    ' + lawId.slice(0, 58).padEnd(58) + ' ' + String(nos.size).padStart(5) + ' 条');
console.log('');
for (const n of notes) console.log('  · ' + n);
for (const w of warns) console.log('  ! 警告 ' + w);
if (errors.length) {
  console.log('');
  console.log(`错误 ${errors.length} 条：`);
  for (const e of errors.slice(0, 60)) console.log('  ✗ ' + e);
  if (errors.length > 60) console.log(`  …（另有 ${errors.length - 60} 条）`);
}
console.log('');
console.log(errors.length ? '===== 校验结果：不通过 =====' : '===== 校验结果：全部通过 =====');
process.exit(errors.length ? 1 : 0);
