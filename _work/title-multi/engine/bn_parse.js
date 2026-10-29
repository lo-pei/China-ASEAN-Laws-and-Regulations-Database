// BN 标题解析器 v2：迭代剥离类型词，统一大写，输出 {base, instr, wrap, amd, year, sec}
// 例："COMPANIES ACT AMENDMENT ORDER, 2015" → base=COMPANIES instr=ACT wrap=ORDER amd=true year=2015
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const GAP = path.join(ROOT, '_work', 'title-multi', '_gap.json');

// 尾部类型词 → 规范代号
const TYPE_WORDS = [
  ['AMENDMENT', 'AMD'],
  ['AMENDING', 'AMD'],
  ['CONSTITUTION', 'CONST'],
  ['CODE', 'CODE'],
  ['ACT', 'ACT'],
  ['ORDER', 'ORDER'],
  ['REGULATIONS', 'REG'],
  ['REGULATION', 'REG'],
  ['REGNS', 'REG'],
  ['RULES', 'RULES'],
  ['RULE', 'RULES'],
  ['NOTIFICATION', 'NOTICE'],
  ['NOTICE', 'NOTICE'],
  ['PROCLAMATION', 'PROC'],
  ['CONVENTION', 'CONV'],
  ['ARRANGEMENT', 'ARR'],
  ['RESOLUTION', 'RES'],
  ['DECISION', 'DEC'],
  ['GUIDELINES', 'GUIDE'],
  ['CIRCULAR', 'CIRC'],
  ['MEASURES', 'MEAS'],
  ['MEASURE', 'MEAS'],
  ['REPLY', 'REPLY'],
  ['ANNOUNCEMENT', 'ANN'],
  ['CATALOGUE', 'CAT'],
  ['CATALOG', 'CAT'],
  ['ORDER-IN-COUNCIL', 'ORDER'],
];

const OCR_FIX = [
  ['EEXCISE', 'EXCISE'],
  ['XCISE', 'EXCISE'],
  ['FIRSHERIES', 'FISHERIES'],
  ['TRANSATIONS', 'TRANSACTIONS'],
  ['INSOLVENCYJUDICIAL', 'INSOLVENCY JUDICIAL'],
  ['E PENAL CODE ACT', 'PENAL CODE ACT'],
  ['DUCATION ORDER', 'EDUCATION ORDER'],
  ['UCATION ACT', 'EDUCATION ACT'],
  ['MERCHANT SHIPPING ORER', 'MERCHANT SHIPPING ORDER'],
  ['MAHKAMAH MAHKAMAH', 'MAHKAMAH'],
  ['EDEDUCATION', 'EDUCATION'],
  ['DARUSALAM', 'DARUSSALAM'],
  ['POLUTION', 'POLLUTION'],
];

// 出版物编号前缀（宪报/修订版标记），出现在法名之前，一律剥离
const PREFIX = [
  /^CONST\.?\s*[IVX1]+\s+(?:S\.?O\.?\s*\d+\s+)?(?:\d{4}\s+)?(?:RG|R|S)?\s*\d*\s*(?:\d{4})?\s*ED\s+/,
  /^O\d+\s+(?:R\s*\d+\s+)?(?:\d{4}\s+)?ED\s+/,
  /^N\d+\s+(?:\d{4}\s+)?ED\s+/,
  /^(?:RG|R)\s*\d+\s*(?:\d{4})?\s*ED\s+/,
  /^S\s*\d+\s+\d{4}\s+E\s+/,
  /^E\s+\d+\s+\d{4}\s+E\s+/,
  /^\d+\s+(?:\d{4}\s+)?ED\s+/,
];

function parseTitle(raw) {
  const out = { raw: String(raw || '').replace(/\s+/g, ' ').trim(), base: '', instr: '', wrap: [], amd: false, year: '', sec: '', cap: '', no: '', junk: false };
  let s = out.raw.toUpperCase();

  // 括号尾巴
  s = s.replace(/\s*\((?:CHAPTER|CAP\.?)\s*([0-9A-Z]+)\)\s*$/i, (m, n) => { out.cap = n; return ''; });
  s = s.replace(/\s*\((\d+)\)\s*$/, (m, n) => { out.no = n; return ''; });
  // 「NO. 2」序号（必须在剥类型词之前；允许出现在 AMENDMENT 之后的中段）
  s = s.replace(/\s+NO\.?\s*(\d+)(?=\s|$)/g, (m, n) => { out.no = n; return ''; });
  // 年份
  s = s.replace(/\s*,?\s*((?:18|19|20)\d{2})\s*$/, (m, y) => { out.year = y; return ''; });

  // 条级
  const mSecHead = s.match(/^SEC(?:TION|\.)?\s*(\d+[A-Z]?)\s*(?:\(\d+\))?\s*(?:OF\s+(?:THE\s+)?)?/);
  if (mSecHead) { out.sec = mSecHead[1]; s = s.slice(mSecHead[0].length).trim(); }
  const mSecTail = s.match(/\s+SEC\.?\s*(\d+[A-Z]?)(?:\s*\(\d+\))?\s*$/);
  if (mSecTail) { out.sec = out.sec || mSecTail[1]; s = s.slice(0, mSecTail.index).trim(); }

  // 条级剥离后可能又露出年份/序号，二次剥离
  s = s.replace(/\s+NO\.?\s*(\d+)(?=\s|$)/g, (m, n) => { out.no = n; return ''; });
  s = s.replace(/\s*,?\s*((?:18|19|20)\d{2})\s*$/, (m, y) => { out.year = y; return ''; });

  // 出版物编号前缀（宪报/修订版标记）
  for (const re of PREFIX) s = s.replace(re, '').trim();

  // 出版号前缀 R 1 2015 ED / RG 4 2024 ED
  s = s.replace(/^(?:RG|R)\s*\d+\s*(?:\d{4})?\s*(?:ED)?\s+/i, '').trim();
  s = s.replace(/^(?:RG|R)\s*\d+\s+ED\s+/i, '').trim();
  // 单个噪声字母前缀
  s = s.replace(/^[EM]\s+(?=[A-Z])/, '');
  // OCR 修补
  for (const [from, to] of OCR_FIX) if (s.includes(from)) s = s.split(from).join(to);

  // 迭代剥离尾部类型词
  let changed = true;
  let guard = 0;
  const instrs = [];
  while (changed && guard++ < 8) {
    changed = false;
    for (const [w, code] of TYPE_WORDS) {
      const re = new RegExp('(?:^|\\s)' + w.replace(/[-/]/g, '\\$&') + '$');
      if (re.test(s)) {
        if (code === 'AMD') out.amd = true;
        else instrs.push(code);
        s = s.replace(re, '').trim();
        changed = true;
        break;
      }
    }
  }
  // 第一个类型词是本体，其余是包裹（Order amending Act 等），顺序取"最先剥离"为包裹
  if (instrs.length) {
    out.instr = instrs[instrs.length - 1];
    out.wrap = instrs.slice(0, instrs.length - 1).reverse();
  }
  out.base = s.replace(/\s+/g, ' ').trim();
  if (!out.base) out.junk = true;
  return out;
}

function keyOf(p) {
  return p.base + '|' + p.instr + '|' + (p.amd ? 'AMD' : '') + '|' + p.wrap.join('+');
}

function main() {
  const g = JSON.parse(fs.readFileSync(GAP, 'utf8'));
  const bn = g.gaps.filter(x => x.country === 'BN');
  const parsed = bn.map(x => ({ id: x.id, zh: x.title.zh, ...parseTitle(x.title.en) }));
  const m = new Map();
  for (const p of parsed) m.set(keyOf(p), (m.get(keyOf(p)) || 0) + 1);
  const arr = [...m.entries()].sort((a, b) => b[1] - a[1]);
  console.log('BN 条目', bn.length, '｜去重键', arr.length, '｜空 base', parsed.filter(p => p.junk).length);
  console.log('≥2 次键', arr.filter(x => x[1] >= 2).length, '累计', arr.filter(x => x[1] >= 2).reduce((s, x) => s + x[1], 0));
  const T = {};
  parsed.forEach(p => { const k = (p.wrap.length ? p.wrap.join('>') + '>' : '') + (p.instr || '(无)') + (p.amd ? '+AMD' : ''); T[k] = (T[k] || 0) + 1; });
  console.log('结构分布：', Object.entries(T).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => k + '=' + v).join('  '));
  const lim = process.argv.includes('--list') ? arr.length : 40;
  arr.slice(0, lim).forEach(([k, v]) => console.log(String(v).padStart(3), k));
  fs.writeFileSync(path.join(__dirname, '_bn_parsed.json'), JSON.stringify(parsed, null, 1), 'utf8');
}

if (require.main === module) main();
module.exports = { parseTitle, keyOf };
