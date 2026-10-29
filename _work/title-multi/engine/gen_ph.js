// 菲律宾标题组装器（纯指向型）
// 只处理「不含实体专名」的引用型标题：修正/废止某号法令、某几条。
// 结构：〈动词〉[〈条号〉OF] 〈法令类型〉〈编号〉[〈日期〉][AS AMENDED][AND FOR OTHER PURPOSES]
// 任一段未识别 → 整部跳过（不臆造）。含 Entitled "…" 嵌套主题、含地名/机关名的一律不接。
// 用法：node gen_ph.js [--dry] [--out ph-p1-b01] [--stat] [--diag] [--parse "标题"]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const BAT = path.join(ROOT, '_work', 'title-multi', 'batches');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];

/* ---------- 法令类型 ---------- */
const TYPES = {
  'EXECUTIVE ORDER': { zh: '行政命令', en: 'Executive Order', vi: 'Lệnh hành pháp', th: 'คำสั่งฝ่ายบริหาร', id: 'Keputusan Eksekutif', ms: 'Perintah Eksekutif' },
  'PRESIDENTIAL DECREE': { zh: '总统令', en: 'Presidential Decree', vi: 'Sắc lệnh Tổng thống', th: 'กฤษฎีกาประธานาธิบดี', id: 'Dekrit Presiden', ms: 'Dekri Presiden' },
  'REPUBLIC ACT': { zh: '共和国法', en: 'Republic Act', vi: 'Luật Cộng hòa', th: 'พระราชบัญญัติแห่งสาธารณรัฐ', id: 'Undang-Undang Republik', ms: 'Akta Republik' },
  'BATAS PAMBANSA': { zh: '国民议会法', en: 'Batas Pambansa', vi: 'Luật Batasang Pambansa', th: 'พระราชบัญญัติรัฐสภาแห่งชาติ', id: 'Undang-Undang Batasang Pambansa', ms: 'Akta Batasang Pambansa' },
  'COMMONWEALTH ACT': { zh: '自治领法', en: 'Commonwealth Act', vi: 'Luật Thịnh vượng chung', th: 'พระราชบัญญัติเครือรัฐ', id: 'Undang-Undang Persemakmuran', ms: 'Akta Komanwel' },
  'ADMINISTRATIVE ORDER': { zh: '行政令', en: 'Administrative Order', vi: 'Lệnh hành chính', th: 'คำสั่งทางปกครอง', id: 'Perintah Administratif', ms: 'Perintah Pentadbiran' },
  'GENERAL ORDER': { zh: '一般命令', en: 'General Order', vi: 'Lệnh chung', th: 'คำสั่งทั่วไป', id: 'Perintah Umum', ms: 'Perintah Am' },
  'LETTER OF INSTRUCTION': { zh: '指示令', en: 'Letter of Instruction', vi: 'Thư chỉ đạo', th: 'หนังสือสั่งการ', id: 'Surat Instruksi', ms: 'Surat Arahan' },
  'PROCLAMATION': { zh: '公告', en: 'Proclamation', vi: 'Tuyên cáo', th: 'ประกาศ', id: 'Proklamasi', ms: 'Pengisytiharan' },
  'ACT': { zh: '法令', en: 'Act', vi: 'Đạo luật', th: 'พระราชบัญญัติ', id: 'Undang-Undang', ms: 'Akta' },
};
const TYPE_KEYS = Object.keys(TYPES).sort((a, b) => b.length - a.length);

/* ---------- 动词 ---------- */
const VERBS = {
  AMEND: {
    zh: (r) => '修正' + r, en: (r) => 'Amending ' + r, vi: (r) => 'Sửa đổi ' + r,
    th: (r) => 'แก้ไขเพิ่มเติม' + r, id: (r) => 'Mengubah ' + r, ms: (r) => 'Meminda ' + r,
  },
  AMEND_FURTHER: {
    zh: (r) => '再次修正' + r, en: (r) => 'Further amending ' + r, vi: (r) => 'Sửa đổi lần nữa ' + r,
    th: (r) => 'แก้ไขเพิ่มเติมอีกครั้ง' + r, id: (r) => 'Mengubah kembali ' + r, ms: (r) => 'Meminda semula ' + r,
  },
  REPEAL: {
    zh: (r) => '废止' + r, en: (r) => 'Repealing ' + r, vi: (r) => 'Bãi bỏ ' + r,
    th: (r) => 'ยกเลิก' + r, id: (r) => 'Mencabut ' + r, ms: (r) => 'Memansuhkan ' + r,
  },
  REVOKE: {
    zh: (r) => '撤销' + r, en: (r) => 'Revoking ' + r, vi: (r) => 'Thu hồi ' + r,
    th: (r) => 'เพิกถอน' + r, id: (r) => 'Mencabut ' + r, ms: (r) => 'Membatalkan ' + r,
  },
};

/* ---------- 数字 ---------- */
const UNITS = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10,
  ELEVEN: 11, TWELVE: 12, THIRTEEN: 13, FOURTEEN: 14, FIFTEEN: 15, SIXTEEN: 16,
  SEVENTEEN: 17, EIGHTEEN: 18, NINETEEN: 19, TWENTY: 20, THIRTY: 30, FORTY: 40,
  FIFTY: 50, SIXTY: 60, SEVENTY: 70, EIGHTY: 80, NINETY: 90,
};
function wordNum(tokens) {
  let total = 0, cur = 0, seen = false;
  for (const tk of tokens) {
    for (const part of tk.split('-')) {
      if (!part) continue;
      if (part === 'AND') continue;
      if (part === 'HUNDRED') { cur = (cur || 1) * 100; seen = true; continue; }
      if (part === 'THOUSAND') { total += (cur || 1) * 1000; cur = 0; seen = true; continue; }
      if (UNITS[part] !== undefined) { cur += UNITS[part]; seen = true; continue; }
      return null;
    }
  }
  if (!seen) return null;
  return total + cur;
}
/* 从词序列头部取尽可能长的数字串 */
function takeNum(tokens) {
  if (!tokens.length) return null;
  if (/^\d{1,5}$/.test(tokens[0])) return { n: Number(tokens[0]), used: 1 };
  let used = 0;
  while (used < tokens.length && (tokens[used] === 'AND' || UNITS[tokens[used].split('-')[0]] !== undefined ||
    tokens[used] === 'HUNDRED' || tokens[used] === 'THOUSAND' || /^[A-Z]+(?:-[A-Z]+)+$/.test(tokens[used]))) used++;
  if (!used) return null;
  /* 尾部不能留 AND */
  while (used && tokens[used - 1] === 'AND') used--;
  const n = wordNum(tokens.slice(0, used));
  return n === null ? null : { n, used };
}

/* ---------- 日期 ---------- */
const MONTHS = {
  JANUARY: [1, 'มกราคม', 'Januari'], FEBRUARY: [2, 'กุมภาพันธ์', 'Februari'], MARCH: [3, 'มีนาคม', 'Mac'],
  APRIL: [4, 'เมษายน', 'April'], MAY: [5, 'พฤษภาคม', 'Mei'], JUNE: [6, 'มิถุนายน', 'Jun'],
  JULY: [7, 'กรกฎาคม', 'Julai'], AUGUST: [8, 'สิงหาคม', 'Ogos'], SEPTEMBER: [9, 'กันยายน', 'September'],
  OCTOBER: [10, 'ตุลาคม', 'Oktober'], NOVEMBER: [11, 'พฤศจิกายน', 'November'], DECEMBER: [12, 'ธันวาคม', 'Disember'],
};
/* DATED <MONTH> <day>, <year> */
function takeDate(tokens) {
  if (!tokens.length) return null;
  let i = 0;
  if (tokens[0] === 'DATED' || tokens[0] === 'OF' || tokens[0] === 'ON') i = 1;
  if (!MONTHS[tokens[i]]) return null;
  const m = MONTHS[tokens[i]];
  let j = i + 1, day = null;
  const dn = /^(\d{1,2})(?:ST|ND|RD|TH)?,?$/.exec(tokens[j] || '');
  if (dn) { day = Number(dn[1]); j++; }
  else {
    const w = takeNum(tokens.slice(j));
    if (w && w.n >= 1 && w.n <= 31) { day = w.n; j += w.used; }
  }
  if (day === null) return null;
  let year = null;
  const y = /^(\d{4})\.?$/.exec(tokens[j] || '');
  if (y) { year = Number(y[1]); j++; }
  else {
    const w = takeNum(tokens.slice(j));
    if (w && w.n > 1500 && w.n < 2100) { year = w.n; j += w.used; }
  }
  if (year === null) return null;
  return { m: m[0], th: m[1], id: m[2], day, year, used: j };
}

/* ---------- 解析 ---------- */
function preclean(raw) {
  return String(raw)
    .replace(/&#8722;|&minus;/gi, '-')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function parse(raw) {
  const src = preclean(raw);
  let s = src.replace(/\.\s*$/, '').replace(/,$/, '').trim().toUpperCase();

  /* 动词头 */
  let verbKey = null;
  let m;
  if ((m = /^(?:AN|ALL)\s+ACTS?\s+(?:TO\s+)?AMEND(?:ING|S)?\b\.?\s*/.exec(s))) { verbKey = 'AMEND'; s = s.slice(m[0].length); }
  else if ((m = /^(?:TO\s+)?AMEND(?:ING)?\b\.?\s*/.exec(s))) { verbKey = 'AMEND'; s = s.slice(m[0].length); }
  else if ((m = /^FURTHER\s+AMEND(?:ING)?\b\.?\s*/.exec(s))) { verbKey = 'AMEND_FURTHER'; s = s.slice(m[0].length); }
  else if ((m = /^(?:TO\s+)?REPEAL(?:ING)?\b\.?\s*/.exec(s))) { verbKey = 'REPEAL'; s = s.slice(m[0].length); }
  else if ((m = /^(?:TO\s+)?REVOK(?:E|ING)\b\.?\s*/.exec(s))) { verbKey = 'REVOKE'; s = s.slice(m[0].length); }
  if (!verbKey) return null;
  s = s.replace(/^FURTHER\s+/, '');
  if (/^AMEND(?:ING)?\s+FURTHER\b/.test(s)) { verbKey = 'AMEND_FURTHER'; s = s.replace(/^AMEND(?:ING)?\s+FURTHER\b\.?\s*/, ''); }

  /* 条号段：SECTION N, M AND K OF / CERTAIN SECTIONS OF / THE PROVISIONS OF */
  let sec = null;
  if ((m = /^(?:THE\s+)?PROVISIONS\s+OF\s+/.exec(s))) { sec = { kind: 'provisions', list: [] }; s = s.slice(m[0].length); }
  else if ((m = /^CERTAIN\s+(SECTIONS|PROVISIONS)\s+OF\s+/.exec(s))) { sec = { kind: m[1] === 'SECTIONS' ? 'certain' : 'provisions', list: [] }; s = s.slice(m[0].length); }
  else if ((m = /^(SECTIONS?|SECS?\.?)\s+/.exec(s))) {
    let rest = s.slice(m[0].length);
    const list = [];
    for (;;) {
      const t = takeNum(rest.trim().split(' '));
      if (!t) break;
      list.push(t.n);
      rest = rest.trim().split(' ').slice(t.used).join(' ');
      const sep = /^(?:,|AND)\s+/i.exec(rest);
      if (sep) { rest = rest.slice(sep[0].length); continue; }
      break;
    }
    if (!list.length) return null;
    const ofm = /^OF\s+/.exec(rest);
    if (!ofm) return null;
    sec = { kind: 'list', list };
    s = rest.slice(ofm[0].length);
  }
  if (sec && sec.kind === 'list' && sec.list.length > 8) return null;

  /* 法令类型 */
  let tkey = null;
  for (const k of TYPE_KEYS) {
    if (s.startsWith(k + ' ') || s === k) { tkey = k; s = s.slice(k.length).trim(); break; }
  }
  if (!tkey) return null;

  /* 编号 */
  s = s.replace(/^(?:NO|NUMBER|NUMBERED|BLG|BILANG)\b\.?\s*/, '');
  const t = takeNum(s.split(' ').filter(Boolean));
  if (!t) return null;
  let tokens = s.split(' ').filter(Boolean).slice(t.used);

  /* 日期 / 系列 */
  let date = null, series = null;
  while (tokens.length) {
    const d = takeDate(tokens);
    if (d) { date = d; tokens = tokens.slice(d.used); continue; }
    const sm = /^SERIES\s+OF\s+(\d{4})\.?$/.exec(tokens.join(' '));
    if (sm) { series = Number(sm[1]); tokens = []; continue; }
    if (tokens.join(' ') === 'CURRENT SERIES' || tokens.join(' ') === ', CURRENT SERIES') { tokens = []; continue; }
    break;
  }
  /* 尾部套语 */
  let asAmended = false, forOther = false;
  for (let guard = 0; guard < 4 && tokens.length; guard++) {
    const tail = tokens.join(' ');
    if (/^(?:,\s*)?AS\s+AMENDED$/.test(tail)) { asAmended = true; tokens = []; break; }
    if (/^(?:,\s*)?AND\s+FOR\s+OTHER\s+PURPOSES$/.test(tail)) { forOther = true; tokens = []; break; }
    if (/^(?:,\s*)?AS\s+AMENDED\s+AND\s+FOR\s+OTHER\s+PURPOSES$/.test(tail)) { asAmended = true; forOther = true; tokens = []; break; }
    if (/^(?:,\s*)?AS\s+AMENDED(?:,)?\s+AND\s+FOR\s+OTHER\s+PURPOSES$/.test(tail)) { asAmended = true; forOther = true; tokens = []; break; }
    break;
  }
  if (tokens.length) return null;
  if (sec && sec.kind === 'list' && sec.list.length === 0) return null;

  return { verbKey, tkey, num: t.n, sec, date, series, asAmended, forOther, src };
}

/* ---------- 组装 ---------- */
function fmtDate(p, lang) {
  if (p.date) {
    const { m, day, year } = p.date;
    if (lang === 'zh') return `${year}年${m}月${day}日`;
    if (lang === 'vi') return `ngày ${day} tháng ${m} năm ${year}`;
    if (lang === 'th') return `${day} ${p.date.th} ค.ศ. ${year}`;
    return `${day} ${p.date.id} ${year}`;
  }
  if (p.series) {
    if (lang === 'zh') return `${p.series}年系列`;
    if (lang === 'vi') return `loạt năm ${p.series}`;
    if (lang === 'th') return `ชุดปี ค.ศ. ${p.series}`;
    return `siri ${p.series}`;
  }
  return null;
}

function refOf(p, lang) {
  const T = TYPES[p.tkey];
  const n = p.num;
  let head;
  if (lang === 'zh') head = `第${n}号${T.zh}`;
  else if (lang === 'vi') head = `${T.vi} số ${n}`;
  else if (lang === 'th') head = `${T.th} ฉบับที่ ${n}`;
  else if (lang === 'en') head = `${T.en} No. ${n}`;
  else head = `${T[lang]} ${lang === 'ms' ? 'Bilangan' : 'Nomor'} ${n}`;

  let secTxt = '';
  if (p.sec) {
    const L = p.sec.list;
    if (lang === 'zh') {
      if (p.sec.kind === 'list') {
        const nums = L.length > 1 ? L.slice(0, -1).join('、') + '、' + L[L.length - 1] : String(L[0]);
        secTxt = `第${nums}条`;
      } else if (p.sec.kind === 'certain') secTxt = '某些条文';
      else secTxt = '有关规定';
    } else if (lang === 'vi') {
      if (p.sec.kind === 'list') secTxt = (L.length > 1 ? 'các Điều ' + L.join(', ') : 'Điều ' + L[0]);
      else if (p.sec.kind === 'certain') secTxt = 'một số điều';
      else secTxt = 'các quy định';
    } else if (lang === 'th') {
      if (p.sec.kind === 'list') secTxt = (L.length > 1 ? 'มาตรา ' + L.join(', ') : 'มาตรา ' + L[0]);
      else if (p.sec.kind === 'certain') secTxt = 'บางมาตรา';
      else secTxt = 'บทบัญญัติ';
    } else {
      const W = lang === 'en' ? 'Section' : (lang === 'ms' ? 'Seksyen' : 'Pasal');
      if (p.sec.kind === 'list') secTxt = (L.length > 1 ? W + 's ' + L.join(', ') : W + ' ' + L[0]);
      else if (p.sec.kind === 'certain') secTxt = (lang === 'en' ? 'certain sections' : 'beberapa seksyen');
      else secTxt = (lang === 'en' ? 'the provisions' : 'ketentuan');
    }
    if (lang === 'zh') head = head + secTxt;
    else head = head + ' ' + secTxt;
  }
  if (p.asAmended) {
    head += lang === 'zh' ? '（经修正）' : (lang === 'vi' ? ' (đã sửa đổi)' : (lang === 'th' ? ' (ซึ่งแก้ไขเพิ่มเติมแล้ว)' : ' (as amended)'));
  }
  const d = fmtDate(p, lang);
  if (d) head += lang === 'zh' ? `（${d}）` : (lang === 'th' ? ` (${d})` : ` (${d})`);
  return head;
}

function build(p) {
  const out = {};
  for (const lang of LANGS) {
    if (lang === 'en') {
      /* en 保留原题（英文原件），仅规范化空白与句末句点 */
      out.en = p.src.replace(/\s+/g, ' ').trim().replace(/\.\s*$/, '');
      continue;
    }
    const body = refOf(p, lang);
    out[lang] = VERBS[p.verbKey][lang](body);
  }
  return out;
}

/* ---------- 主流程 ---------- */
if (process.argv.includes('--parse')) {
  const q = process.argv[process.argv.indexOf('--parse') + 1];
  const p = parse(q);
  console.log(p ? JSON.stringify(Object.assign({}, p, build(p)), null, 1) : 'null');
  process.exit(0);
}

const rows = [];
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('PH-')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const t = d.title || {};
  if (String(t.zh || '').trim()) continue;
  rows.push({ id: d.id, raw: String(t.en || t.orig || '').replace(/\s+/g, ' ').trim(), no: String(d.docNumber || '') });
}

const items = {}, skip = { empty: [], parse: [] };
const stat = { verb: {}, type: {} };
for (const r of rows) {
  if (!r.raw) { skip.empty.push(r.id + ' | ' + r.no); continue; }
  const p = parse(r.raw);
  if (!p) { skip.parse.push(r.id + ' | ' + r.raw); continue; }
  items[r.id] = build(p);
  stat.verb[p.verbKey] = (stat.verb[p.verbKey] || 0) + 1;
  stat.type[p.tkey] = (stat.type[p.tkey] || 0) + 1;
}

console.log('PH 待补中文标题', rows.length, '→ 可组装', Object.keys(items).length);
console.log('  跳过：空标题', skip.empty.length, '| 结构未识别', skip.parse.length);
if (process.argv.includes('--stat')) {
  console.log('\n动词分布', JSON.stringify(stat.verb));
  console.log('类型分布', JSON.stringify(stat.type));
  console.log('\n---- 未识别样例 ----');
  skip.parse.slice(0, 40).forEach(x => console.log('  ' + x.slice(0, 150)));
}
if (process.argv.includes('--diag')) {
  console.log('\n---- 已组装样例 ----');
  Object.entries(items).slice(0, 30).forEach(([id, v]) => console.log('  ' + id + '\n    zh ' + v.zh + '\n    vi ' + v.vi + '\n    th ' + v.th + '\n    id ' + v.id + '\n    ms ' + v.ms));
  process.exit(0);
}

const outName = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'ph-p1-b01') + '.json';
if (!process.argv.includes('--dry')) {
  fs.writeFileSync(path.join(BAT, outName), JSON.stringify({
    batch: outName.replace(/\.json$/, ''),
    scope: 'PH 法律 · 纯指向型标题组装（修正/废止某号法令、某几条）',
    generatedFrom: '_work/title-multi/engine/gen_ph.js',
    items,
  }, null, 1), 'utf8');
  console.log('写出', path.join(BAT, outName));
}
