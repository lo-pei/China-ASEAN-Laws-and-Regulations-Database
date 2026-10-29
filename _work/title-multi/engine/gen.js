#!/usr/bin/env node
/**
 * 标题四语生成引擎（模板 + 词表 + 覆盖率打分）
 *
 * 背景：新加坡 3,714 部、菲律宾 10,619 部的标题高度公式化，逐条手译不可行。
 * 但把标题拆成「类型词 + 主名 + 括号限定语 + 年份」后，词条量骤降一个量级
 * （新加坡：3,714 部 → 695 主名 + 1,763 片段）。词表还可跨法域复用。
 *
 * 用法：
 *   node gen.js --scope SG                # 覆盖率报告（不写文件）
 *   node gen.js --scope SG --addrs        # 输出待翻译 token 清单 JSON
 *   node gen.js --scope SG --emit out.json --only vi,id,ms   # 用现有词表生成批次
 *   node gen.js --lex                     # 打印词表统计
 *
 * 设计约束（与 docs/07-标题多语种规范.md 一致）：
 *   - 四语语序均为「类型词前置 + 主名」，与英文「主名 + 类型词后置」相反
 *   - 括号限定语保持原顺序，附在主名之后
 *   - 年份置于末尾，原样数字
 *   - 未命中词条的 token 一律不猜，转人工；引擎只写满分条目
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const LEX = path.join(__dirname, 'lex');

const load = (f) => JSON.parse(fs.readFileSync(path.join(LEX, f), 'utf8'));
const TYPE = load('type.json');
const MAIN = fs.existsSync(path.join(LEX, 'main.json')) ? load('main.json') : {};
const FRAG = fs.existsSync(path.join(LEX, 'frag.json')) ? load('frag.json') : {};
const NATION = fs.existsSync(path.join(LEX, 'nation.json')) ? load('nation.json') : {};

/* 「Singapore — X」双边协定模式：左半 Singapore 按语种本地化，右半查国家表 */
const SG_NAME = { vi: 'Singapore', th: 'สิงคโปร์', id: 'Singapura', ms: 'Singapura' };
function nationLex(frag, lang) {
  const m = frag.trim().match(/^Singapore\s*[—–]\s*(.+)$/);
  if (!m) return null;
  const n = NATION[m[1].trim()];
  if (!n) return null;
  return SG_NAME[lang] + ' — ' + n[lang];
}

/* 类型词按字符数降序，保证 Practice Direction 先于 Direction 命中 */
const TYPE_KEYS = Object.keys(TYPE).filter((k) => !k.startsWith('_'))
  .sort((a, b) => b.length - a.length);

/* 语序与连接词：四语一律类型词前置。
   印尼语仅「法律（Act）关于某事项」用 tentang；法典、条例、宪法等是固定法定名，
   如 Kitab Undang-Undang Hukum Acara Pidana、Undang-Undang Dasar，直接相连。 */
const SYNTAX = {
  vi: { link: () => ' ' },
  th: { link: () => '' },        // 泰文类型词与主名连写
  id: { link: (type) => (type === 'Act' ? ' tentang ' : ' ') },
  ms: { link: () => ' ' },
};

/* ---------- 解析 ---------- */

/* 纯编号片段不需要词表：No. 2 / 3 / No. 10 由程序按语种惯例生成 */
const NUM_RE = /^(No\.\s*(\d+)|(\d+)|Section\s+(\d+[A-Z0-9()]*))$/;
function numLex(frag, lang) {
  const m = frag.trim().match(NUM_RE);
  if (!m) return null;
  if (m[4]) return frag.trim();               // Section 12：原样
  const n = m[2] || m[3];
  return { vi: 'Số ' + n, th: 'ฉบับที่ ' + n, id: 'Nomor ' + n, ms: 'No. ' + n }[lang];
}

/* 破折号形式「Currency Act — Denominations and Characteristics of Coins」：
   左半是法名，右半是子项说明，四语沿用破折号连接。
   **只在括号外切分**——像 Guns, Explosives and Weapons Control (Explosives — Exemption)
   这类标题的破折号在括号内，属于限定语内部结构，不能当法名分隔符。 */
function splitDash(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && (ch === '—' || ch === '–')) {
      const left = s.slice(0, i).trim();
      const right = s.slice(i + 1).trim();
      if (left && right) return [left, right];
    }
  }
  return [s, ''];
}

/* 尾部类型词剥离，返回 {s, type} */
function stripType(s) {
  for (const k of TYPE_KEYS) {
    const re = new RegExp('(?:^|[\\s(])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
    if (re.test(s)) return { s: s.slice(0, s.length - k.length).trim(), type: k };
  }
  return { s, type: '' };
}

/* 顶层括号提取，支持嵌套。
   返回 { rest, frags }：frags 为整段顶层括号内容（嵌套部分原样保留）。
   早期版本用正则 /\([^]*\)/ 贪婪删除，会把 (A — Section 13(12) Exemption)
   首个左括号到末个右括号之间的正文整段吃掉，只剩 (Exemption)，必须逐字符处理。 */
function extractParens(s) {
  const out = [];
  let rest = '', depth = 0, buf = '';
  for (const ch of s) {
    if (ch === '(') {
      if (depth > 0) buf += '(';
      else buf = '';          // 顶层新片段：必须先清空，否则两个相邻括号会粘连
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth > 0) buf += ')';
      else out.push(buf.trim());
    } else if (depth > 0) buf += ch;
    else rest += ch;
  }
  return { rest: rest.replace(/\s+/g, ' ').trim(), frags: out.filter(Boolean) };
}

function parse(en) {
  let s = String(en || '').trim().replace(/\s+/g, ' ');

  /* 尾部年份：末位 4 位数字，或（YYYY） */
  let year = '';
  const my = s.match(/^(.*?)[\s(]+(\d{4})\)?$/);
  if (my) { s = my[1].trim(); year = my[2]; }

  /* 尾部类型词 */
  let type = '';
  ({ s, type } = stripType(s));

  /* 括号外破折号切分。右半常承载类型词（Currency Act — Coins），
     故对左半再做一次类型词剥离。 */
  let dashTail = '';
  const [left, right] = splitDash(s);
  if (right) {
    s = left;
    dashTail = right;
    const again = stripType(s);
    if (!type && again.type) { type = again.type; s = again.s; }
  }

  /* 括号片段（顶层整段，嵌套原样保留） */
  const { rest, frags } = extractParens(s);

  return { main: rest, frags, dashTail, type, year };
}

/* 片段译名统一入口：词表 → 纯编号 → 双边协定国家名 */
function fragLex(fr, lang) {
  if (FRAG[fr]) return FRAG[fr][lang];
  const n = numLex(fr, lang);
  if (n) return n;
  return nationLex(fr, lang);
}

/* ---------- 拼装 ---------- */

function compose(p, lang) {
  const t = TYPE[p.type];
  if (!t) return null;
  const m = MAIN[p.main];
  if (!m) return null;
  let head = t[lang] + SYNTAX[lang].link(p.type) + m[lang];
  for (const fr of p.frags) {
    const v = fragLex(fr, lang);
    if (!v) return null;
    head += ' (' + v + ')';
  }
  if (p.dashTail) {
    const d = fragLex(p.dashTail, lang);
    if (!d) return null;
    head += ' — ' + d;
  }
  if (p.year) head += ' ' + p.year;
  return head;
}

/* ---------- 打分 ---------- */

function score(p) {
  const parts = p.frags.length + (p.dashTail ? 1 : 0);
  const tot = 1 + parts;
  let hit = MAIN[p.main] ? 1 : 0;
  for (const fr of p.frags) if (fragLex(fr, 'vi')) hit++;
  if (p.dashTail && fragLex(p.dashTail, 'vi')) hit++;
  const typeOk = !!TYPE[p.type];
  return { hit, tot, typeOk, pct: typeOk ? Math.round((hit / tot) * 100) : 0 };
}

/* ---------- 数据源 ---------- */

function gapList(scope) {
  const g = require(path.join(__dirname, '..', '_gap.json'));
  return (g.gaps || []).filter((x) => String(x.id).startsWith(scope + '-'));
}

/* ---------- 主流程 ---------- */

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const has = (k) => argv.includes(k);

if (has('--lex')) {
  console.log('类型词', Object.keys(TYPE).filter((k) => !k.startsWith('_')).length);
  console.log('主名词条', Object.keys(MAIN).length);
  console.log('片段词条', Object.keys(FRAG).length);
  process.exit(0);
}

const scope = arg('--scope', 'SG');

if (has('--parse')) {
  const s = arg('--parse');
  console.log(JSON.stringify(parse(s), null, 1));
  process.exit(0);
}

const rows = gapList(scope);
if (!rows.length) { console.error('无缺口：' + scope); process.exit(1); }

const parsed = rows.map((x) => ({ id: x.id, raw: x, p: parse(x.title.en) }));

/* token 统计 */
const mainFreq = new Map();
const fragFreq = new Map();
for (const r of parsed) {
  mainFreq.set(r.p.main, (mainFreq.get(r.p.main) || 0) + 1);
  for (const fr of r.p.frags) { if (!numLex(fr, 'vi') && !nationLex(fr, 'vi')) fragFreq.set(fr, (fragFreq.get(fr) || 0) + 1); }
  if (r.p.dashTail) fragFreq.set(r.p.dashTail, (fragFreq.get(r.p.dashTail) || 0) + 1);
}

const okType = parsed.filter((r) => !!TYPE[r.p.type]).length;
let full = 0, part = 0, none = 0;
for (const r of parsed) {
  const s = score(r.p);
  if (s.pct === 100) full++; else if (s.pct > 0) part++; else none++;
}

if (has('--addrs')) {
  const out = {
    scope,
    main: [...mainFreq.entries()].sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({ en: k, n: v, done: !!MAIN[k] })),
    frag: [...fragFreq.entries()].sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({ en: k, n: v, done: !!FRAG[k] })),
  };
  const p = arg('--out', path.join(__dirname, '_todo_' + scope + '.json'));
  fs.writeFileSync(p, JSON.stringify(out, null, 1));
  console.log('写入 ' + p);
  console.log('主名 ' + out.main.length + '（已译 ' + out.main.filter((x) => x.done).length + '）');
  console.log('片段 ' + out.frag.length + '（已译 ' + out.frag.filter((x) => x.done).length + '）');
  process.exit(0);
}

if (has('--emit')) {
  const only = (arg('--only', 'vi,th,id,ms')).split(',').map((s) => s.trim()).filter(Boolean);
  const items = {};
  const dropped = [];
  let skipped = 0;
  for (const r of parsed) {
    const s = score(r.p);
    if (s.pct < 100) { skipped++; continue; }
    const rec = {};
    let bad = '';
    for (const lang of only) {
      const v = compose(r.p, lang);
      if (!v) { bad = lang + ':null'; break; }
      /* 完整性自检：译名的括号数与原文必须一致。
         括号数不符意味着某个限定语在拼装中丢失（历史上出现过整段被正则吃掉）。 */
      const nEn = (String(r.raw.title.en).match(/\(/g) || []).length;
      const nOut = (v.match(/\(/g) || []).length;
      if (nEn !== nOut) { bad = lang + ':括号 ' + nEn + '→' + nOut; break; }
      rec[lang] = v;
    }
    if (bad) { dropped.push(r.id + ' ' + bad); skipped++; continue; }
    if (Object.keys(rec).length === only.length) items[r.id] = rec;
    else skipped++;
  }
  const out = { batch: 'gen-' + scope + '-' + new Date().toISOString().slice(0, 10), scope, items };
  const p = arg('--emit');
  fs.writeFileSync(p, JSON.stringify(out, null, 2));
  console.log('生成 ' + Object.keys(items).length + ' 部 / 跳过 ' + skipped + ' 部 → ' + p);
  if (dropped.length) {
    console.log('完整性自检剔除 ' + dropped.length + ' 部：');
    for (const d of dropped.slice(0, 10)) console.log('  ' + d);
  }
  process.exit(0);
}

/* 默认：覆盖率报告 */
console.log('法域 ' + scope + '：' + rows.length + ' 部缺口');
console.log('类型词命中 ' + okType + ' / ' + rows.length + '（缺 ' + (rows.length - okType) + '）');
console.log('完整可生成 ' + full + ' 部（' + (full / rows.length * 100).toFixed(1) + '%）');
console.log('部分命中 ' + part + ' 部 / 完全缺词 ' + none + ' 部');
console.log('主名唯一 ' + mainFreq.size + '（已译 ' + Object.keys(MAIN).length + '）');
console.log('片段唯一 ' + fragFreq.size + '（已译 ' + Object.keys(FRAG).length + '）');
{
  const top = [...mainFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log('--- 主名 Top15（缺词）---');
  for (const [k, v] of top) if (!MAIN[k]) console.log('  ' + v + '\t' + k.slice(0, 70));
  const tf = [...fragFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log('--- 片段 Top15（缺词）---');
  for (const [k, v] of tf) if (!FRAG[k]) console.log('  ' + v + '\t' + k.slice(0, 70));
}
const unmatchedType = {};
for (const r of parsed) if (!TYPE[r.p.type]) unmatchedType[r.p.type || '(空)'] = (unmatchedType[r.p.type || '(空)'] || 0) + 1;
const ut = Object.entries(unmatchedType).sort((a, b) => b[1] - a[1]).slice(0, 10);
if (ut.length) {
  console.log('--- 未识别类型词 ---');
  for (const [k, v] of ut) console.log('  ' + v + '\t' + k);
}
