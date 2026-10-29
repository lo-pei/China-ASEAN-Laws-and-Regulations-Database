// 印尼法律标题组装器
// 结构：〈动词前缀〉〈中心语〉〈功能词〉〈修饰语〉——印尼语中心语在前，中文须倒装
// 术语表驱动：任一词未登录 → 整部跳过（不臆造）；修饰嵌套超过一层 → 跳过
// 用法：node gen_id.js [--dry] [--out id-p1-b01] [--diag] [--miss] [--parse "标题"]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const BAT = path.join(ROOT, '_work', 'title-multi', 'batches');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];

function loadLex() {
  const lex = { types: {}, verbs: {}, terms: {} };
  for (const f of fs.readdirSync(__dirname).filter(x => /^lexicon-id.*\.json$/.test(x)).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    Object.assign(lex.types, j.types || {});
    Object.assign(lex.verbs, j.verbs || {});
    Object.assign(lex.terms, j.terms || {});
  }
  /* id / ms 缺省回填：印尼语与马来语大量术语同形 */
  for (const [k, v] of Object.entries(lex.terms)) {
    if (!v.id) v.id = k.toLowerCase();
    if (!v.ms) v.ms = v.id;
  }
  return lex;
}
const LEX = loadLex();

const GLUE = [
  [/^PEMBENTUKAN(?=[A-Z]{3,})/, 'PEMBENTUKAN '],
  [/^PERUBAHAN(?=[A-Z]{3,})/, 'PERUBAHAN '],
  [/^PENAMBAHAN(?=[A-Z]{3,})/, 'PENAMBAHAN '],
  [/^PENETAPAN(?=[A-Z]{3,})/, 'PENETAPAN '],
  [/^PENGESAHAN(?=[A-Z]{3,})/, 'PENGESAHAN '],
  [/\bLAHIR(DAN)\b/, 'LAHIR $1'],
  [/\b(MENTERI)(KEUANGAN)\b/, '$1 $2'],
  [/\b(JANDA)(DUDANYA)\b/, '$1 $2'],
  [/\b(WARAKAWURI)(DUDA)\b/, '$1 $2'],
  [/\b(ANAK)(YATIM)/, '$1 $2'],
  [/\b(YATIM)(PIATU)\b/, '$1 $2'],
  [/\b(SURAT)(KENAL)\b/, '$1 $2'],
];
function norm(s) {
  let x = String(s)
    .replace(/&#8722;|&minus;/gi, '-')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  for (const [re, to] of GLUE) x = x.replace(re, to);
  return x;
}

/* 尾部噪声：编号、年份、册号、重复标记、残缺括号 */
function stripTail(s0) {
  let s = s0, year = '';
  s = s.replace(/_\d+$/, '').trim();
  s = s.replace(/\s*\((?:LEMBARAN NEGARA|STAATSBLAD|TAMBAHAN LEMBARAN)[^)]*\)?\s*$/i, '').trim();
  for (let i = 0; i < 5; i++) {
    const y = s.match(/[,]?\s*\bTAHUN ANGGARAN\s+(\d{4})(?:\s*[\/-]\s*\d{2,4})?\s*$/i);
    if (y) { if (!year) year = y[1]; s = s.slice(0, y.index).trim(); continue; }
    const y2 = s.match(/[,]?\s*\bTAHUN\s+(\d{4})\s*$/i);
    if (y2) { if (!year) year = y2[1]; s = s.slice(0, y2.index).trim(); continue; }
    const n = s.match(/[,]?\s*\b(?:NOMOR|NO\.?|NR\.?)\s*([0-9IVXL]+)\s*$/i);
    if (n) { s = s.slice(0, n.index).trim(); continue; }
    const p = s.match(/\s*\(\s*$/);
    if (p) { s = s.slice(0, p.index).trim(); continue; }
    break;
  }
  return { s: s.replace(/[,\s]+$/, '').trim(), year };
}

const TYPE_HEAD = [
  'PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG',
  'UNDANG-UNDANG DARURAT',
  'PERATURAN PEMERINTAH',
  'PERATURAN PRESIDEN',
  'KEPUTUSAN PRESIDEN',
  'KEPUTUSAN MENTERI',
  'UNDANG-UNDANG',
];

/* 功能词（术语表里也可覆盖） */
const FUNC = ['ATAS', 'TENTANG', 'MENGENAI', 'DALAM', 'PADA', 'KEPADA', 'UNTUK', 'BAGI',
  'DARI', 'DENGAN', 'SECARA', 'KE', 'DI', 'TERHADAP', 'MENURUT', 'SEBAGAI', 'OLEH',
  'ANTARA', 'YANG', 'SERTA', 'SELAMA', 'HINGGA'];
const CONJ = ['DAN', 'ATAU'];

const TERMS = Object.keys(LEX.terms).sort((a, b) => b.split(' ').length - a.split(' ').length);
const MAXW = Math.max(...TERMS.map(t => t.split(' ').length), 1);
const FUNCSET = new Set(FUNC), CONJSET = new Set(CONJ);

let MISS = null;
/* 最长匹配分词 → 键数组（含功能词/连词）；未登录返回 null */
function segment(words) {
  const out = [];
  for (let i = 0; i < words.length;) {
    let hit = null;
    for (let n = Math.min(MAXW, words.length - i); n >= 1; n--) {
      const k = words.slice(i, i + n).join(' ');
      if (LEX.terms[k] || FUNCSET.has(k) || CONJSET.has(k)) { hit = { key: k, n }; break; }
    }
    if (!hit) { if (MISS) MISS.push(words.slice(i).join(' ')); return null; }
    out.push(hit.key);
    i += hit.n;
  }
  return out;
}

/* 中文渲染：键序列倒装（修饰在前），连词按原序 */
function zhNp(keys) {
  if (!keys.length) return null;
  /* 连词合并：仅当两侧各为单个术语时才合并，否则判为结构不明 */
  let ks = keys.slice();
  let guard = 0;
  while (ks.some(k => CONJSET.has(k))) {
    if (guard++ > 6) return null;
    const i = ks.findIndex(k => CONJSET.has(k));
    const L = ks[i - 1], R = ks[i + 1];
    if (!L || !R || FUNCSET.has(L) || FUNCSET.has(R) || CONJSET.has(L) || CONJSET.has(R)) return null;
    const j = ks[i] === 'DAN' ? '与' : '或';
    ks.splice(i - 1, 3, { comp: L + j + R });
  }
  const parts = [];
  for (let i = ks.length - 1; i >= 0; i--) {
    const k = ks[i];
    if (typeof k === 'object') { parts.push(k.comp.split(/([与或])/).map(x => /^[与或]$/.test(x) ? x : (LEX.terms[x] ? LEX.terms[x].zh : null)).join('')); }
    else if (!LEX.terms[k]) return null;
    else parts.push(LEX.terms[k].zh);
  }
  if (parts.some(x => x === null || x === undefined)) return null;
  return parts.join('');
}

/* 其余语种：保持印尼语序，逐键直译 */
function seqNp(keys, lang) {
  const parts = [];
  for (const k of keys) {
    if (CONJSET.has(k)) { parts.push(lang === 'en' ? (k === 'DAN' ? 'and' : 'or') : (k === 'DAN' ? 'dan' : 'atau')); continue; }
    if (!LEX.terms[k]) return null;
    parts.push(LEX.terms[k][lang]);
  }
  return parts.join(' ');
}

const FUNC_ZH = {
  ATAS: '的', TENTANG: '关于|的', MENGENAI: '关于|的', DALAM: '|中的', PADA: '|的',
  KEPADA: '向|的', UNTUK: '用于|的', BAGI: '为|的', DARI: '|的', DENGAN: '以|的',
  SECARA: '|', KE: '|的', DI: '|的', TERHADAP: '对|的', MENURUT: '依|的',
  SEBAGAI: '作为|的', OLEH: '由|的', ANTARA: '|之间的', YANG: '|的', SERTA: '以及',
  SELAMA: '在|期间', HINGGA: '至',
};
/* 各语种功能词（除中文外均保持中心语在前） */
const FUNC_SEQ = {
  en: {
    ATAS: 'on', TENTANG: 'on', MENGENAI: 'concerning', DALAM: 'in', PADA: 'at',
    KEPADA: 'to', UNTUK: 'for', BAGI: 'for', DARI: 'of', DENGAN: 'with',
    SECARA: 'by way of', KE: 'to', DI: 'in', TERHADAP: 'against', MENURUT: 'under',
    SEBAGAI: 'as', OLEH: 'by', ANTARA: 'between', YANG: 'which', SERTA: 'and',
    SELAMA: 'during', HINGGA: 'until',
  },
  vi: {
    ATAS: 'về', TENTANG: 'về', MENGENAI: 'về', DALAM: 'trong', PADA: 'tại',
    KEPADA: 'cho', UNTUK: 'cho', BAGI: 'cho', DARI: 'của', DENGAN: 'với',
    SECARA: 'theo', KE: 'đến', DI: 'tại', TERHADAP: 'đối với', MENURUT: 'theo',
    SEBAGAI: 'như', OLEH: 'bởi', ANTARA: 'giữa', YANG: 'mà', SERTA: 'và',
    SELAMA: 'trong', HINGGA: 'đến',
  },
  th: {
    ATAS: 'เกี่ยวกับ', TENTANG: 'เกี่ยวกับ', MENGENAI: 'เกี่ยวกับ', DALAM: 'ใน', PADA: 'ณ',
    KEPADA: 'แก่', UNTUK: 'สำหรับ', BAGI: 'สำหรับ', DARI: 'ของ', DENGAN: 'ด้วย',
    SECARA: 'โดย', KE: 'ไปยัง', DI: 'ใน', TERHADAP: 'ต่อ', MENURUT: 'ตาม',
    SEBAGAI: 'เป็น', OLEH: 'โดย', ANTARA: 'ระหว่าง', YANG: 'ซึ่ง', SERTA: 'และ',
    SELAMA: 'ในระหว่าง', HINGGA: 'จนถึง',
  },
  id: {
    ATAS: 'atas', TENTANG: 'tentang', MENGENAI: 'mengenai', DALAM: 'dalam', PADA: 'pada',
    KEPADA: 'kepada', UNTUK: 'untuk', BAGI: 'bagi', DARI: 'dari', DENGAN: 'dengan',
    SECARA: 'secara', KE: 'ke', DI: 'di', TERHADAP: 'terhadap', MENURUT: 'menurut',
    SEBAGAI: 'sebagai', OLEH: 'oleh', ANTARA: 'antara', YANG: 'yang', SERTA: 'serta',
    SELAMA: 'selama', HINGGA: 'hingga',
  },
};
FUNC_SEQ.ms = FUNC_SEQ.id;

/* 将键序列切成 [np, func, np]，超过一个功能词则放弃 */
function splitOnce(keys) {
  const idx = [];
  keys.forEach((k, i) => { if (FUNCSET.has(k)) idx.push(i); });
  if (!idx.length) return { head: keys, fn: '', mod: [] };
  if (idx.length > 1) return null;
  const i = idx[0];
  const head = keys.slice(0, i), mod = keys.slice(i + 1);
  if (!head.length || !mod.length) return null;
  return { head, fn: keys[i], mod };
}

function build(segKeys, verb, docType, p) {
  const st = splitOnce(segKeys);
  if (!st) return null;
  /* ANTARA（之间）要求修饰语本身是并列结构，否则语义不明 */
  if (st.fn === 'ANTARA' && !st.mod.some(k => k === 'DAN' || k === 'ATAU')) return null;
  /* 条约/协定类：缔约对方国名无法在此逐条核实时不组装 */
  if ((st.fn === 'ANTARA' || st.head.includes('PERJANJIAN')) && st.mod.some(k => /^(PEMERINTAH|KERAJAAN|NEGARA|REPUBLIK)$/.test(k))) return null;
  const v = verb ? LEX.verbs[verb] : null;
  if (verb && !v) return null;
  const ordZh = p && p.ord ? ORD_ZH[p.ord] : '';
  const ty = LEX.types[docType] || LEX.types.DEFAULT;
  if (!ty) return null;
  const toLaw = !!(p && p.toLaw);
  const out = {};

  /* 中文 */
  const hz = zhNp(st.head), mz = st.fn ? zhNp(st.mod) : '';
  if (hz === null || mz === null) return null;
  let body;
  if (!st.fn) body = hz;
  else {
    const [pre, post] = FUNC_ZH[st.fn].split('|');
    body = (pre || '') + mz + (post || '') + hz;
  }
  if (toLaw) out.zh = '将' + body.replace(/^关于/, '') + '确定为法律';
  else out.zh = (v ? ordZh + v.zh : '') + body + (/(法|条例|决定|法令|章程|公约|协定)$/.test(body) ? '' : ty.zh);

  /* 英文 */
  const he = seqNp(st.head, 'en'), me = st.fn ? seqNp(st.mod, 'en') : '';
  if (he === null || me === null) return null;
  const core = he + (st.fn ? ' ' + FUNC_SEQ.en[st.fn] + ' ' + me : '');
  if (toLaw) out.en = 'Enactment of ' + core + ' into Law';
  else out.en = (v ? v.en + ' ' : '') + core + ' ' + ty.en;

  /* 越南语 / 泰语 / 印尼语 / 马来语：中心语在前 */
  for (const lang of ['vi', 'th', 'id', 'ms']) {
    const h = seqNp(st.head, lang), m = st.fn ? seqNp(st.mod, lang) : '';
    if (h === null || m === null) return null;
    const c = h + (st.fn ? ' ' + FUNC_SEQ[lang][st.fn] + ' ' + m : '');
    const prefix = lang === 'vi' ? ty.vi : (lang === 'th' ? ty.th : (lang === 'ms' ? ty.ms : ''));
    const vb = v ? v[lang] + ' ' : '';
    out[lang] = toLaw ? c + (lang === 'vi' ? ' thành luật' : ' menjadi undang-undang') : (prefix ? prefix + ' ' : '') + vb + c;
  }
  return out;
}

const ORDINAL = ['KEDUA', 'KETIGA', 'KEEMPAT', 'KELIMA', 'KEENAM', 'KETUJUH', 'KEDELAPAN'];
const ORD_ZH = { KEDUA: '第二', KETIGA: '第三', KEEMPAT: '第四', KELIMA: '第五', KEENAM: '第六', KETUJUH: '第七', KEDELAPAN: '第八' };

/* 内嵌法规引用：「PERATURAN PEMERINTAH NOMOR 5 TAHUN 2003」→ 单一引用术语 */
const REF_TYPES = [
  ['PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG', 'PERPPU'],
  ['UNDANG-UNDANG DARURAT', 'UUD'],
  ['PERATURAN PEMERINTAH', 'PP'],
  ['PERATURAN PRESIDEN', 'PERPRES'],
  ['PERATURAN MENTERI', 'PERMEN'],
  ['KEPUTUSAN PRESIDEN', 'KEPPRES'],
  ['UNDANG-UNDANG', 'UU'],
];
let refSeq = 0;
function registerRef(typeHead, num, year) {
  const key = 'REF' + (++refSeq);
  const t = LEX.types[(REF_TYPES.find(x => x[0] === typeHead) || [])[1]] || LEX.types.DEFAULT;
  const be = String(parseInt(year, 10) + 543);
  LEX.terms[key] = {
    zh: year + '年第' + num + '号' + t.zh,
    en: t.en + ' No. ' + num + ' of ' + year,
    vi: t.vi + ' số ' + num + ' năm ' + year,
    th: t.th + ' ฉบับที่ ' + num + ' พ.ศ. ' + be,
    id: t.id + ' Nomor ' + num + ' Tahun ' + year,
    ms: t.ms + ' Bilangan ' + num + ' ' + year,
  };
  return key;
}
function inlineRefs(s) {
  const pat = /(PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG|UNDANG-UNDANG DARURAT|PERATURAN PEMERINTAH|PERATURAN PRESIDEN|PERATURAN MENTERI|KEPUTUSAN PRESIDEN|UNDANG-UNDANG)\s+(?:NOMOR|NO\.?|NR\.?)\s*([0-9]+)\s+TAHUN\s+(\d{4})/g;
  return s.replace(pat, (_, th, num, yr) => registerRef(th, num, yr));
}

function parseId(raw) {
  let s = norm(raw);
  s = s.replace(/^[IVX]+\.\s*/, '');
  s = inlineRefs(s);
  let t = stripTail(s);
  s = t.s;
  let typeHead = '', verb = '', ord = '';
  for (let i = 0; i < 4; i++) {
    let changed = false;
    if (verb && /^ATAS\s+/.test(s)) { s = s.replace(/^ATAS\s+/, '').trim(); changed = true; }
    if (!typeHead) {
      for (const T of TYPE_HEAD) {
        if (s === T) { typeHead = T; s = ''; changed = true; break; }
        if (s.startsWith(T + ' ')) { typeHead = T; s = s.slice(T.length).trim(); changed = true; break; }
      }
    }
    if (!verb) {
      for (const V of Object.keys(LEX.verbs).sort((a, b) => b.length - a.length)) {
        if (!s.startsWith(V + ' ')) continue;
        const rest = s.slice(V.length).trim();
        const nw = rest.split(' ')[0];
        if (LEX.terms[V + ' ' + nw]) continue;      /* 该动词属于更长术语的首词 */
        verb = V; s = rest; changed = true; break;
      }
    }
    if (verb && !ord) {
      const m = s.match(/^(KEDUA|KETIGA|KEEMPAT|KELIMA|KEENAM|KETUJUH|KEDELAPAN)\s+/);
      if (m) { ord = m[1]; s = s.slice(m[0].length).trim(); changed = true; }
    }
    if (!changed) break;
  }
  /* 「… MENJADI UNDANG-UNDANG」= 将临时法令升格为法律 */
  let toLaw = false;
  const ml = s.match(/\s+MENJADI\s+UNDANG-UNDANG\s*$/i);
  if (ml) { toLaw = true; s = s.slice(0, ml.index).trim(); }
  const t2 = stripTail(s);
  s = t2.s;
  return { words: s ? s.split(' ') : [], verb, ord, typeHead, toLaw, year: t.year || t2.year };
}

if (process.argv.includes('--parse')) {
  const p = parseId(process.argv[process.argv.indexOf('--parse') + 1]);
  const keys = p.words.length ? segment(p.words) : null;
  console.log(JSON.stringify({ parsed: p, keys, built: keys ? build(keys, p.verb, 'UU', p) : null }, null, 1));
  process.exit(0);
}

const DOC2TYPE = { UU: 'UU', PP: 'PP' };
const HEAD2TYPE = {
  'UNDANG-UNDANG DARURAT': 'UUD',
  'PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG': 'PERPPU',
  'PERATURAN PEMERINTAH': 'PP',
  'PERATURAN PRESIDEN': 'PERPRES',
  'KEPUTUSAN PRESIDEN': 'KEPPRES',
  'KEPUTUSAN MENTERI': 'KEPMEN',
};
function typeOf(head, docType) { return (head && HEAD2TYPE[head]) || docType; }
const items = {}, skip = { empty: [], chunk: [], term: [], other: [] };
const missCnt = {};
if (process.argv.includes('--miss')) MISS = [];
let total = 0;
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('ID-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const tt = d.title || {};
  if (String(tt.zh || '').trim()) continue;
  total++;
  const raw = String(tt.id || tt.orig || '').trim();
  if (!raw) { skip.empty.push(d.id); continue; }
  const p = parseId(raw);
  if (!p.words.length) { skip.empty.push(d.id + ' | ' + raw); continue; }
  if (MISS) MISS.length = 0;
  const keys = segment(p.words);
  if (!keys) {
    skip.term.push(d.id + ' | ' + raw);
    if (MISS && MISS.length) missCnt[MISS[0]] = (missCnt[MISS[0]] || 0) + 1;
    continue;
  }
  const no = String(d.docNumber || '').trim();
  const m = no.match(/^([A-Za-z]+)/);
  const docType = m && DOC2TYPE[m[1].toUpperCase()] ? DOC2TYPE[m[1].toUpperCase()] : 'UU';
  const built = build(keys, p.verb, typeOf(p.typeHead, docType), p);
  if (!built) { skip.other.push(d.id + ' | ' + raw); continue; }
  items[d.id] = built;
}

const outName = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'id-p1-b01') + '.json';
console.log('ID 待补中文标题', total, '→ 可组装', Object.keys(items).length);
console.log('  跳过：空标题', skip.empty.length, '| 术语缺译', skip.term.length, '| 结构不明', skip.other.length);
if (process.argv.includes('--diag')) {
  console.log('\n---- 结构不明 ----');
  skip.other.slice(0, 120).forEach(x => console.log('  ' + x));
  process.exit(0);
}
if (process.argv.includes('--miss')) {
  const words = {};
  for (const [k, n] of Object.entries(missCnt)) {
    const w = k.split(' ');
    words[w[0]] = (words[w[0]] || 0) + n;
  }
  console.log('\n---- 未登录词（首个未命中词，按阻断部数） ----');
  Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 220)
    .forEach(([w, n]) => console.log(String(n).padStart(4) + '  ' + w));
  process.exit(0);
}
if (!process.argv.includes('--dry')) {
  fs.writeFileSync(path.join(BAT, outName), JSON.stringify({ batch: outName.replace(/\.json$/, ''), scope: 'ID 法律 · 术语表组装', generatedFrom: '_work/title-multi/engine/gen_id.js', items }, null, 1), 'utf8');
  console.log('写出', path.join(BAT, outName));
}
