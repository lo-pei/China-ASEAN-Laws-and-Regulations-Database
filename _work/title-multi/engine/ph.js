#!/usr/bin/env node
/* 菲律宾法名骨架引擎
 *
 * 用法：
 *   node ph.js                      覆盖率报告
 *   node ph.js --emit <path>        生成批次
 *   node ph.js --parse "<标题>"     单条调试
 *
 * 设计要点：
 *   菲律宾 9,939 部以 "An Act" 开头，公式化极强（前 15 个动词覆盖 87.5%），
 *   但每条填充物是地名/校名/数字。故不走「主名+片段」词表（新加坡做法），
 *   改走「整句正则模板 + 槽位」（regex + slots）：
 *     - 模板必须 ^...$ 整句锚定，吃不完全句即判失败，绝不产出漏译标题；
 *     - 槽位中的行政区划通用词按四语翻译，专有地名保留原拼写（拉丁转写）；
 *     - 数字转各语种数词写法。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const GAP = path.join(ROOT, '_work/title-multi/_gap.json');

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const has = (k) => process.argv.includes(k);

/* ---------- 行政区划与通用词四语 ---------- */
/* 顺序敏感：长词在前 */
const TERM = [
  ['Highly Urbanized City', 'Thành phố đô thị hóa cao', 'เมืองที่มีความเป็นเมืองสูง', 'Kota Sangat Urban', 'Bandaraya Sangat Membandar'],
  ['Independent Component City', 'Thành phố thành phần độc lập', 'เมืององค์ประกอบอิสระ', 'Kota Komponen Independen', 'Bandaraya Komponen Bebas'],
  ['Component City', 'Thành phố thành phần', 'เมืององค์ประกอบ', 'Kota Komponen', 'Bandaraya Komponen'],
  ['District Hospital', 'Bệnh viện huyện', 'โรงพยาบาลอำเภอ', 'Rumah Sakit Kabupaten', 'Hospital Daerah'],
  ['Provincial Hospital', 'Bệnh viện tỉnh', 'โรงพยาบาลจังหวัด', 'Rumah Sakit Provinsi', 'Hospital Wilayah'],
  ['Memorial Hospital', 'Bệnh viện tưởng niệm', 'โรงพยาบาลอนุสรณ์', 'Rumah Sakit Peringatan', 'Hospital Peringatan'],
  ['Medical Center', 'Trung tâm y tế', 'ศูนย์การแพทย์', 'Pusat Medis', 'Pusat Perubatan'],
  ['National Agricultural School', 'Trường nông nghiệp quốc gia', 'โรงเรียนเกษตรกรรมแห่งชาติ', 'Sekolah Pertanian Nasional', 'Sekolah Pertanian Kebangsaan'],
  ['Agricultural School', 'Trường nông nghiệp', 'โรงเรียนเกษตรกรรม', 'Sekolah Pertanian', 'Sekolah Pertanian'],
  ['National Comprehensive High School', 'Trường trung học phổ thông toàn diện quốc gia', 'โรงเรียนมัธยมศึกษาแบบครบวงจรแห่งชาติ', 'Sekolah Menengah Atas Komprehensif Nasional', 'Sekolah Menengah Komprehensif Kebangsaan'],
  ['National Vocational High School', 'Trường trung học phổ thông dạy nghề quốc gia', 'โรงเรียนมัธยมอาชีวศึกษาแห่งชาติ', 'Sekolah Menengah Kejuruan Nasional', 'Sekolah Menengah Vokasional Kebangsaan'],
  ['National School of Arts and Trades', 'Trường quốc gia nghệ thuật và thủ công', 'โรงเรียนศิลปหัตถกรรมแห่งชาติ', 'Sekolah Seni dan Kerajinan Nasional', 'Sekolah Seni dan Pertukangan Kebangsaan'],
  ['National Science High School', 'Trường trung học phổ thông khoa học quốc gia', 'โรงเรียนมัธยมวิทยาศาสตร์แห่งชาติ', 'Sekolah Menengah Sains Nasional', 'Sekolah Menengah Sains Kebangsaan'],
  ['Technical and Vocational High School', 'Trường trung học phổ thông kỹ thuật và dạy nghề', 'โรงเรียนมัธยมเทคนิคและอาชีวศึกษา', 'Sekolah Menengah Teknik dan Kejuruan', 'Sekolah Menengah Teknik dan Vokasional'],
  ['National Elementary School', 'Trường tiểu học quốc gia', 'โรงเรียนประถมศึกษาแห่งชาติ', 'Sekolah Dasar Nasional', 'Sekolah Rendah Kebangsaan'],
  ['National High School', 'Trường trung học phổ thông quốc gia', 'โรงเรียนมัธยมศึกษาตอนปลายแห่งชาติ', 'Sekolah Menengah Atas Nasional', 'Sekolah Menengah Kebangsaan'],
  ['Integrated School', 'Trường liên cấp', 'โรงเรียนบูรณาการ', 'Sekolah Terpadu', 'Sekolah Bersepadu'],
  ['Secondary School', 'Trường trung học', 'โรงเรียนมัธยมศึกษา', 'Sekolah Menengah', 'Sekolah Menengah'],
  ['Elementary School', 'Trường tiểu học', 'โรงเรียนประถมศึกษา', 'Sekolah Dasar', 'Sekolah Rendah'],
  ['High School', 'Trường trung học phổ thông', 'โรงเรียนมัธยมศึกษา', 'Sekolah Menengah Atas', 'Sekolah Menengah'],
  ['Municipal District', 'Quận nội thị', 'เขตเทศบาล', 'Distrik Kotamadya', 'Daerah Perbandaran'],
  ['Municipality', 'Thị trấn', 'เทศบาล', 'Kotamadya', 'Perbandaran'],
  ['Province', 'Tỉnh', 'จังหวัด', 'Provinsi', 'Wilayah'],
  ['Barangay', 'Barangay', 'บารังไกย์', 'Barangay', 'Barangay'],
  ['Barrio', 'Barrio', 'บารริโอ', 'Barrio', 'Barrio'],
  ['Sitio', 'Sitio', 'ซิติโอ', 'Sitio', 'Sitio'],
  ['Poblacion', 'Poblacion', 'โปบลาซียง', 'Poblacion', 'Poblacion'],
  ['State University', 'Trường đại học quốc gia', 'มหาวิทยาลัยของรัฐ', 'Universitas Negeri', 'Universiti Negeri'],
  ['State College', 'Trường cao đẳng quốc gia', 'วิทยาลัยของรัฐ', 'Sekolah Tinggi Negeri', 'Kolej Negeri'],
  ['University', 'Trường đại học', 'มหาวิทยาลัย', 'Universitas', 'Universiti'],
  ['College', 'Trường cao đẳng', 'วิทยาลัย', 'Sekolah Tinggi', 'Kolej'],
  ['City', 'Thành phố', 'เมือง', 'Kota', 'Bandaraya'],
  ['Capital Town', 'Thị trấn tỉnh lỵ', 'เมืองหลวงของจังหวัด', 'Kota Ibu Kota', 'Pekan Ibu Wilayah'],
  ['Sub-province', 'Tiểu tỉnh', 'กิ่งจังหวัด', 'Subprovinsi', 'Subwilayah'],
];
const TERM_BY_LEN = [...TERM].sort((a, b) => b[0].length - a[0].length);

function term(en, lang) {
  const i = { vi: 1, th: 2, id: 3, ms: 4 }[lang];
  const low = en.trim().toLowerCase();
  for (const row of TERM_BY_LEN) {
    if (row[0].toLowerCase() === low) return row[i];
  }
  return null;
}

/* 地名短语：「Barangay X, Municipality of Y, Province of Z」
   → 逐段识别并翻译通用词，专名原样保留 */
const LOC_PARTS = [
  [/^Capital Town of\s+(.+)$/i, 'Capital Town'],
  [/^Sub-?Province of\s+(.+)$/i, 'Sub-province'],
  [/^Municipality of\s+(.+)$/i, 'Municipality'],
  [/^Municipal District of\s+(.+)$/i, 'Municipal District'],
  [/^City of\s+(.+)$/i, 'City'],
  [/^Province of\s+(.+)$/i, 'Province'],
  [/^District of\s+(.+)$/i, 'District'],
  [/^Region of\s+(.+)$/i, 'Region'],
  [/^Town of\s+(.+)$/i, 'Municipality'],
  [/^Barangay\s+(?:of\s+)?(.+)$/i, 'Barangay'],
  [/^Barrio\s+(?:of\s+)?(.+)$/i, 'Barrio'],
  [/^Sitio\s+(?:of\s+)?(.+)$/i, 'Sitio'],
  [/^Poblacion\s+(?:of\s+(?:the\s+)?)?(.+)$/i, 'Poblacion'],
];

/* 裸类型词 + 专名（Province Nueva Ecija） */
const BARE_KIND = [
  [/^Capital Town\s+(.+)$/i, 'Capital Town'],
  [/^Sub-?Province\s+(.+)$/i, 'Sub-province'],
  [/^Municipality\s+(.+)$/i, 'Municipality'],
  [/^Municipal District\s+(.+)$/i, 'Municipal District'],
  [/^City\s+(.+)$/i, 'City'],
  [/^Province\s+(.+)$/i, 'Province'],
  [/^District\s+(.+)$/i, 'District'],
  [/^Region\s+(.+)$/i, 'Region'],
  [/^(.+?)\s+Province$/i, 'Province'],
  [/^(.+?)\s+Municipality$/i, 'Municipality'],
];

/* 把「A, B, C」拆成段 */
function splitComm(s) {
  const out = [], buf = [];
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(buf.join('').trim()); buf.length = 0; }
    else buf.push(ch);
  }
  if (buf.join('').trim()) out.push(buf.join('').trim());
  return out.filter(Boolean);
}

/* 翻译一段地名，返回 null 表示无法处理 */
function locPart(seg, lang) {
  if (!seg) return null;
  let s = String(seg).trim().replace(/^the\s+/i, '');
  if (!s) return null;
  for (const [re, kind] of LOC_PARTS) {
    const m = s.match(re);
    if (m) {
      const t = term(kind, lang);
      if (!t) return null;
      return t + ' ' + m[1].trim().replace(/^the\s+/i, '');
    }
  }
  /* 裸类型词形态 */
  for (const [re, kind] of BARE_KIND) {
    const m = s.match(re);
    if (m) {
      const t = term(kind, lang);
      if (!t) return null;
      return t + ' ' + m[1].trim().replace(/^the\s+/i, '');
    }
  }
  return s; /* 未识别为行政区划 → 视为专名保留 */
}

function loc(s, lang) {
  let t = String(s || '').trim();
  /* 段内再夹处所：Municipality of A in the Province of B */
  const mi = t.match(/^(.+?)\s+in\s+(?:the\s+)?((?:Province|Municipality|City|District|Region|Barangay|Poblacion|Mountain Province)\b.+)$/i);
  if (mi) {
    const a = loc(mi[1], lang), b = loc(mi[2], lang);
    if (a && b) return a + ' ' + P('in', lang) + ' ' + b;
  }
  const segs = splitComm(t);
  const out = [];
  for (const g of segs) {
    const v = locPart(g, lang);
    if (v == null) return null;
    out.push(v);
  }
  return out.join(', ');
}

/* 机构类型词：四语一律「类型词 + 专名」，故识别尾缀后前置。
   只收能被 TERM 翻译的机构名尾缀。 */
const INST_TAIL = [
  'District Hospital', 'Provincial Hospital', 'Memorial Hospital', 'Medical Center',
  'National Agricultural School', 'Agricultural School',
  'National Comprehensive High School', 'National Vocational High School',
  'National School of Arts and Trades', 'National Science High School',
  'Technical and Vocational High School', 'National Elementary School',
  'National High School', 'Integrated School', 'Secondary School',
  'Elementary School', 'High School',
];

/* 机构名：剥冠词 → 尾缀类型词前置 → 保留专名 */
function instName(s, lang) {
  let t = String(s || '').trim().replace(/^the\s+/i, '');
  for (const k of INST_TAIL) {
    const re = new RegExp('^(.+?)\\s+' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const m = t.match(re);
    if (m) {
      const tr = term(k, lang);
      if (tr) return tr + ' ' + m[1].trim();
    }
  }
  return t;
}

/* 槽位文本：剥冠词；若夹带地点短语（"X in the Municipality of Y, Province of Z"）
   则拆成「机构名 + 处所」，两者分别本地化。整段为行政区划者直接走 loc()。 */
const ADMIN_HEAD = /^(?:Barangay|Barrio|Sitio|Municipality|City|Province|District|Region|Sub-?province)\s+(?:of\s+)?/i;

function slotText(s, lang) {
  let t = String(s || '').trim().replace(/^the\s+/i, '');
  /* 整段即行政区划短语 */
  if (ADMIN_HEAD.test(t)) {
    const L = loc(t, lang);
    if (L) return L;
  }
  /* 从某行政区析出设立：X From the Province of Y */
  const mf = t.match(/^(.+?)\s+From\s+(?:the\s+)?((?:Province|Municipality|City|District|Barangay|Sub-?Province|Region)\s+(?:of\s+)?.+)$/);
  if (mf) {
    const L = loc(mf[2], lang);
    if (L) return instName(mf[1], lang) + ' ' + P('from', lang) + ' ' + L;
  }
  /* 机构 of the 行政区：District Hospital of the Municipality of X */
  const mo = t.match(/^(.+?)\s+of\s+(?:the\s+)?((?:Municipality|City|Province|Barangay|Barrio|Sitio|District|Region|Sub-?Province)\s+(?:of\s+)?.+)$/i);
  if (mo) {
    const L = loc(mo[2], lang);
    const H = instName(mo[1], lang);
    if (L && H) return H + ' ' + P('of', lang) + ' ' + L;
  }
  const m = t.match(/^(.+?)\s+in\s+(?:the\s+)?((?:Municipality|City|Province|Barangay|Barrio|Sitio|District|Region|Capital Town|Sub-?Province|Poblacion)\s+(?:of\s+)?.+|.+\s+(?:Province|Municipality|City))$/i);
  if (m) {
    const L = loc(m[2], lang);
    if (L) return instName(m[1], lang) + ' ' + P('in', lang) + ' ' + L;
  }
  return instName(t, lang);
}

/* 泰文不以空格分词：相邻泰文字符间空格去掉 */
const TH_GAP = /([\u0E00-\u0E7F])\s+(?=[\u0E00-\u0E7F])/g;
function thFix(s) {
  if (typeof s !== 'string') return s;
  let prev = null;
  while (prev !== s) { prev = s; s = s.replace(TH_GAP, '$1'); }
  return s;
}

/* ---------- 槽位性质校验 ----------
 * 这是本引擎的质量闸门。菲律宾标题的槽位若含通用英文短语（"Aid, Relief and
 * Rehabilitation Services to Persons and Areas Affected..."），逐槽保留原文会
 * 产出「骨架已译、正文未译」的半成品，比不译更有害。故槽位必须满足：
 *   1) 去虚词后每个 token 首字母大写（Title Case 专名）；
 *   2) 不含法律/行政通用词黑名单；
 *   3) 长度 ≤ MAXSLOT。
 * 任一不满足即整条拒译，转人工。
 */
const MAXSLOT = 110;

/* 专名中合法的小写虚词、行政区划词、机构通用名词 */
const STOP = new Set([
  'of', 'the', 'in', 'and', 'at', 'on', 'by', 'for', 'to', 'from', 'with',
  'de', 'del', 'la', 'las', 'los', 'ng', 'sa', 'upon', 'into', 'as', 'a', 'an',
  'city', 'municipality', 'province', 'barangay', 'barrio', 'sitio', 'district',
  'region', 'subprovince', 'sub-province', 'formerly', 'both', 'located', 'island',
  'institute', 'college', 'university', 'school', 'hospital', 'center', 'centre',
  'office', 'station', 'academy', 'polytechnic', 'campus', 'branch', 'annex',
  'national', 'philippine', 'philippines', 'memorial', 'general', 'san', 'santa', 'santo',
]);

/* 通用词黑名单：出现即判定槽位含实质正文，不可原样保留。
   只收动词性与功能性词——机构名名词已在 STOP 放行。 */
const BAD = new Set(`
establishing establish granting grant converting convert creating create
changing change renaming rename amending amend providing provide declaring declare
increasing increase authorizing authorize integrating integrate separating separate
extending extend upgrading upgrade transferring transfer constituting constitute
naming name regulating regulate requiring require expanding expand making make
strengthening strengthen institutionalizing institutionalize fixing fix dividing divide
exempting exempt reappropriating defining define prohibiting prohibit standardizing
standardize promoting promote repealing repeal maintaining maintaining operating operate
installing install constructing construct renewing renew further
purposes purpose therefor thereof same such which whose shall may must all any every hereby
act acts section sections republic numbered other others
fund funds sum amount pesos peso million billion thousand hundred
government governmental policy program project services service
relief aid rehabilitation survey repair reconstruction infrastructure damaged
destroyed affected persons areas units unit independent
bed beds capacity
`.trim().split(/\s+/));

function isProperName(s, maxLen) {
  if (s == null) return false;
  const t = String(s).trim();
  if (!t) return false;
  if (t.length > (maxLen || MAXSLOT)) return false;
  /* 括号必须成对 */
  let d = 0;
  for (const ch of t) { if (ch === '(') d++; else if (ch === ')') { d--; if (d < 0) return false; } }
  if (d !== 0) return false;
  /* 逐 token 检查：先放行专名虚词，再拦通用正文词，最后要求首字母大写 */
  const toks = t.split(/[^A-Za-z\u00C0-\u024F'.\-]+/).filter(Boolean);
  if (!toks.length) return false;
  for (const w of toks) {
    const low = w.toLowerCase().replace(/[.']/g, '');
    if (STOP.has(low)) continue;
    if (BAD.has(low)) return false;
    if (!/^[A-Z\u00C0-\u00DE]/.test(w)) return false;
  }
  return true;
}

/* ---------- 数字 ---------- */
const NUM = {
  vi: ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'],
  th: ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
  id: ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'],
  ms: ['sifar', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan'],
};
const DIGITS = { vi: 'số', th: 'เลขที่', id: 'Nomor', ms: 'No.' };

/* ---------- 模板 ---------- */
/* 每个模板：re（整句锚定）+ 四语构造函数。槽位沿用正则捕获组。
   L 提供各语种的骨架词。 */
const PHRASE = {
  anAct: { vi: 'Đạo luật', th: 'พระราชบัญญัติ', id: 'Undang-Undang', ms: 'Akta' },
  establishing: { vi: 'thành lập', th: 'จัดตั้ง', id: 'mendirikan', ms: 'menubuhkan' },
  creating: { vi: 'thành lập', th: 'จัดตั้ง', id: 'membentuk', ms: 'mewujudkan' },
  changingName: { vi: 'đổi tên', th: 'เปลี่ยนชื่อ', id: 'mengubah nama', ms: 'menukar nama' },
  renaming: { vi: 'đổi tên', th: 'เปลี่ยนชื่อ', id: 'mengganti nama', ms: 'menamakan semula' },
  separating: { vi: 'tách', th: 'แยก', id: 'memisahkan', ms: 'mengasingkan' },
  converting: { vi: 'chuyển đổi', th: 'แปลงสภาพ', id: 'mengubah status', ms: 'menukar status' },
  increasing: { vi: 'tăng', th: 'เพิ่ม', id: 'menambah', ms: 'menambah' },
  appropriating: { vi: 'phân bổ', th: 'จัดสรร', id: 'mengalokasikan', ms: 'memperuntukkan' },
  knownAs: { vi: 'được biết đến với tên gọi', th: 'ให้เป็นที่รู้จักในชื่อ', id: 'dikenal sebagai', ms: 'dikenali sebagai' },
  fundsTherefor: { vi: 'và phân bổ kinh phí cho mục đích đó', th: 'และจัดสรรงบประมาณเพื่อการนั้น', id: 'dan mengalokasikan dana untuk itu', ms: 'dan memperuntukkan dana untuk itu' },
  otherPurposes: { vi: 'và cho các mục đích khác', th: 'และเพื่อวัตถุประสงค์อื่น', id: 'dan untuk tujuan lain', ms: 'dan untuk tujuan lain' },
  into: { vi: 'thành', th: 'เป็น', id: 'menjadi', ms: 'menjadi' },
  bedCapacity: { vi: 'số giường bệnh', th: 'จำนวนเตียง', id: 'kapasitas tempat tidur', ms: 'kapasiti katil' },
  from: { vi: 'từ', th: 'จาก', id: 'dari', ms: 'daripada' },
  to: { vi: 'lên', th: 'เป็น', id: 'menjadi', ms: 'kepada' },
  beds: { vi: 'giường', th: 'เตียง', id: 'tempat tidur', ms: 'katil' },
  of: { vi: 'của', th: 'ของ', id: 'dari', ms: 'daripada' },
  in: { vi: 'tại', th: 'ใน', id: 'di', ms: 'di' },
};

const P = (k, lang) => PHRASE[k][lang];

/* 模板定义：build(m, lang) 返回字符串，失败返回 null */
const TEMPLATES = [
  /* 1. 建校：An Act Establishing a National High School in <loc> to be known as <name>[, and Appropriating Funds Therefor] */
  {
    id: 'school',
    re: /^An Act Establishing (?:a|an|the)?\s*(?<kind>National Comprehensive High School|National Vocational High School|National School of Arts and Trades|National Science High School|Technical and Vocational High School|National Elementary School|National High School|Integrated School|Secondary School|Elementary School|High School) in (?<loc>.+?) to be known as (?:the )?(?<name>.+?)(?:,? and Appropriating (?:the necessary )?Funds(?: Therefor)?)?(?:,? and for Other Purposes)?$/i,
    build: (m, L) => `${P('anAct', L)} ${P('establishing', L)} ${term(m.kind, L)} ${P('in', L)} ${loc(m.loc, L)} ${P('knownAs', L)} ${slotText(m.name, L)}`,
  },
  /* 2. 改名：An Act Changing the Name of <old> to <new>[, and for Other Purposes] */
  {
    id: 'rename',
    re: /^An Act (?:Changing|Renaming) the Name of (?<old>.+?) to (?:the )?(?:that of |the name of )?(?<new>.+?)(?:,? and for Other Purposes)?$/i,
    build: (m, L) => `${P('anAct', L)} ${P('changingName', L)} ${slotText(m.old, L)} ${P('into', L)} ${slotText(m.new, L)}`,
  },
  /* 3. 设市/设镇/设省/设区：An Act Creating the City of <X> */
  {
    id: 'createAdmin',
    re: /^An Act Creating the (?<kind>City|Municipality|Province|Municipal District) of (?<name>.+?)(?:,? and for Other Purposes)?$/i,
    build: (m, L) => `${P('anAct', L)} ${P('creating', L)} ${term(m.kind, L)} ${slotText(m.name, L)}`,
  },
  /* 4. 建 Barangay：An Act Creating a Barangay in <loc> to be known as Barangay <X> */
  {
    id: 'createBrgy',
    re: /^An Act Creating (?:a|the|certain) (?:new )?(?<kind>Barangay|Barrio|Sitio) in (?<loc>.+?) to be known as (?<kind2>Barangay|Barrio|Sitio) (?<name>.+?)(?:,? and for Other Purposes)?$/i,
    build: (m, L) => `${P('anAct', L)} ${P('creating', L)} ${term(m.kind, L)} ${P('in', L)} ${loc(m.loc, L)} ${P('knownAs', L)} ${term(m.kind2, L)} ${slotText(m.name, L)}`,
  },
  /* 5. 提高病床数：An Act Increasing the Bed Capacity of <hospital> from <n> to <m> Beds */
  {
    id: 'beds',
    re: /^An Act Increasing the Bed Capacity of (?:the )?(?<hosp>.+?) from (?<n>[A-Za-z\-]+|\d+)\s*\(?\d*\)?\s*to (?<m>[A-Za-z\-]+|\d+)\s*\(?\d*\)?\s*(?:Beds|Bed Capacity)(?:,? and Appropriating Funds Therefor)?(?:,? and for Other Purposes)?$/i,
    build: (m, L) => {
      const a = numWord(m.n, L), b = numWord(m.m, L);
      if (!a || !b) return null;
      return `${P('anAct', L)} ${P('increasing', L)} ${P('bedCapacity', L)} ${P('of', L)} ${slotText(m.hosp, L)} ${P('from', L)} ${a} ${P('to', L)} ${b} ${P('beds', L)}`;
    },
  },
  /* 6. 分设：An Act Separating <X> in <loc> from <Y> and Converting it into <kind> to be known as <Z> */
  {
    id: 'separate',
    re: /^An Act Separating (?<x>.+?) in (?<loc>.+?) from (?:the )?(?<y>.+?)(?:,? and Converting (?:it|the same) (?:in)?to (?:an? )?(?<kind>Independent Component City|Component City|Highly Urbanized City|State College|State University|College|University|City|Municipality) to be known as (?:the )?(?<z>.+?))?(?:,? and Appropriating Funds Therefor)?(?:,? and for Other Purposes)?$/i,
    build: (m, L) => {
      let s = `${P('anAct', L)} ${P('separating', L)} ${slotText(m.x, L)} ${P('in', L)} ${loc(m.loc, L)} ${P('from', L)} ${slotText(m.y, L)}`;
      if (m.kind && m.z) {
        const AND = { vi: 'và', th: 'และ', id: 'dan', ms: 'dan' }[L];
        const CONV = { vi: 'chuyển đổi thành', th: 'แปลงสภาพเป็น', id: 'mengubahnya menjadi', ms: 'menukarnya menjadi' }[L];
        s += ` ${AND} ${CONV} ${term(m.kind, L) || m.kind} ${P('knownAs', L)} ${slotText(m.z, L)}`;
      }
      return s;
    },
  },
  /* 7. 分设简式：An Act Separating <X> from <Y> [and for Other Purposes] */
  {
    id: 'separate2',
    re: /^An Act Separating (?<x>.+?) from (?:the )?(?<y>.+?)(?:,? and for Other Purposes)?$/i,
    build: (m, L) => `${P('anAct', L)} ${P('separating', L)} ${slotText(m.x, L)} ${P('from', L)} ${slotText(m.y, L)}`,
  },
  /* 8. 拨款模板已废弃：其 purpose 槽位必然是长通用短语，无法通过专名校验，
     强行保留原文会产出「骨架已译、正文未译」的半成品。整类转人工。 */
];

/* 模板槽位声明：需通过 isProperName 校验的捕获组 */
const SLOTS = {
  school: ['loc', 'name'],
  rename: ['old', 'new'],
  createAdmin: ['name'],
  createBrgy: ['loc', 'name'],
  beds: ['hosp'],
  separate: ['x', 'loc', 'y', 'z'],
  separate2: ['x', 'y'],
};

/* 数词翻译：英文数词 / 纯数字 → 各语种。不支持复合数词时返回 null。 */
const NUMWORD = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'one hundred': 100, 'two hundred': 200, 'three hundred': 300, 'four hundred': 400,
  'five hundred': 500, 'six hundred': 600, 'seven hundred': 700, 'eight hundred': 800,
  'nine hundred': 900,
};
const NUM_VI = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const NUM_TH = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];

function vnNum(n) {
  /* 0–999 越南语读法 */
  const tram = Math.floor(n / 100), du = n % 100, chuc = Math.floor(du / 10), dv = du % 10;
  const out = [];
  if (tram) out.push(NUM_VI[tram] + ' trăm');
  if (chuc > 1) { out.push(NUM_VI[chuc] + ' mươi'); if (dv) out.push(dv === 1 ? 'mốt' : dv === 5 ? 'lăm' : NUM_VI[dv]); }
  else if (chuc === 1) { out.push('mười'); if (dv) out.push(dv === 5 ? 'lăm' : NUM_VI[dv]); }
  else if (dv) { if (tram) out.push('lẻ'); out.push(NUM_VI[dv]); }
  return out.join(' ') || 'không';
}
function thNum(n) {
  if (n === 0) return 'ศูนย์';
  const tram = Math.floor(n / 100), du = n % 100, chuc = Math.floor(du / 10), dv = du % 10;
  const out = [];
  if (tram) out.push((tram === 1 ? '' : NUM_TH[tram]) + 'ร้อย');
  if (chuc === 1) { out.push('สิบ'); if (dv) out.push(dv === 1 ? 'เอ็ด' : NUM_TH[dv]); }
  else if (chuc === 2) { out.push('ยี่สิบ'); if (dv) out.push(dv === 1 ? 'เอ็ด' : NUM_TH[dv]); }
  else if (chuc > 2) { out.push(NUM_TH[chuc] + 'สิบ'); if (dv) out.push(dv === 1 ? 'เอ็ด' : NUM_TH[dv]); }
  else if (dv) out.push(NUM_TH[dv]);
  return out.join('');
}

/* 印尼语 / 马来语数词 */
const ID_DIGIT = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
const MS_DIGIT = ['sifar', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan'];
const ID_TEEN = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
const MS_TEEN = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'lapan belas', 'sembilan belas'];

function idNum(n, lang) {
  const D = lang === 'id' ? ID_DIGIT : MS_DIGIT;
  const TEEN = lang === 'id' ? ID_TEEN : MS_TEEN;
  if (n < 10) return D[n];
  if (n < 20) return TEEN[n - 10];
  if (n < 100) {
    const c = Math.floor(n / 10), u = n % 10;
    return D[c] + ' puluh' + (u ? ' ' + D[u] : '');
  }
  const h = Math.floor(n / 100), r = n % 100;
  const head = h === 1 ? 'seratus' : D[h] + ' ratus';
  return r ? head + ' ' + idNum(r, lang) : head;
}

function numWord(w, lang) {
  let s = String(w || '').trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
  let n = null;
  if (/^\d+$/.test(s)) n = parseInt(s, 10);
  else if (NUMWORD[s] != null) n = NUMWORD[s];
  else {
    /* 复合数词：twenty five / seventy five */
    const p = s.split(' ');
    if (p.length === 2 && NUMWORD[p[0]] >= 20 && NUMWORD[p[1]] >= 1 && NUMWORD[p[1]] <= 9) {
      n = NUMWORD[p[0]] + NUMWORD[p[1]];
    }
  }
  if (n == null || n < 0 || n > 999) return null;
  if (lang === 'vi') return vnNum(n);
  if (lang === 'th') return thNum(n);
  return idNum(n, lang);
}

/* ---------- 生成 ---------- */
/* 转制类：An Act Converting the Municipality of X in the Province of Y
   Into a Component City to Be Known as the City of X
   934 部同构，单列专用解析，优先级高于通用模板。 */
const WHY = process.argv.includes('--why');
const CONV_KIND = /^(Highly Urbanized City|Independent Component City|Component City|City|Municipality|State College|State University|College|University|National High School|High School|Barangay)$/;

function convertTpl(s) {
  const m = s.match(
    /^An Act Converting (?:the )?(?<head>.+?) Into an? (?<nk>Highly[- ]?[Uu]rbanized City|Independent Component City|Component City|Chartered (?:State College|City|College|University)|City|Municipality|State College|State University|College|University|National High School|High School|Barangay)(?: of the (?<nloc>.+?))?(?:,?\s*to Be Known as (?:the )?(?<nn>.+?))?(?:,?\s*and for Other Purposes)?$/i,
  );
  if (!m) { if (WHY) console.error('regex-miss'); return null; }
  const g = m.groups;
  let nkRaw = g.nk.trim().replace(/Highly[- ]?urbanized/i, 'Highly Urbanized').replace(/^Chartered (.+)$/i, '');
  if (!CONV_KIND.test(nkRaw)) return null;
  if (!isProperName(g.head)) { if (WHY) console.error('head: ' + g.head); return null; }
  if (!isProperName(g.nn || 'x', 120)) { if (WHY) console.error('nn: ' + g.nn); return null; }
  if (g.nloc && !isProperName(g.nloc)) return null;
  const out = {};
  for (const L of ['vi', 'th', 'id', 'ms']) {
    const head = slotText(g.head, L);
    const nk = term(nkRaw, L) || nkRaw;
    if (!head || !nk) return null;
    const AND = { vi: 'và', th: 'และ', id: 'dan', ms: 'dan' }[L];
    let v;
    if (L === 'vi') {
      v = `${P('anAct', L)} chuyển đổi ${head} thành ${nk}`;
      if (g.nloc) { const nl = loc(g.nloc, L); if (!nl) return null; v += ' của ' + nl; }
      if (g.nn) { const nn = slotText(g.nn, L); if (!nn) return null; v += ' được biết đến với tên gọi ' + nn; }
    } else if (L === 'th') {
      /* 泰文与拉丁专名之间保留空格，泰文相邻处由 thFix 合并 */
      v = `${P('anAct', L)} แปลงสภาพ ${head} เป็น ${nk}`;
      if (g.nloc) { const nl = loc(g.nloc, L); if (!nl) return null; v += ' ของ ' + nl; }
      if (g.nn) { const nn = slotText(g.nn, L); if (!nn) return null; v += ' ให้เป็นที่รู้จักในชื่อ ' + nn; }
    } else {
      v = `${P('anAct', L)} mengubah status ${head} menjadi ${nk}`;
      if (g.nloc) { const nl = loc(g.nloc, L); if (!nl) return null; v += ' dari ' + nl; }
      if (g.nn) { const nn = slotText(g.nn, L); if (!nn) return null; v += ' yang dikenali sebagai ' + nn; }
    }
    out[L] = L === 'th' ? thFix(v) : v;
    void AND;
  }
  return { tpl: 'convert', out };
}

function apply(en) {
  const s = String(en || '').replace(/\s+/g, ' ').trim();
  /* 源标题残缺（以连接词/冠词结尾，或未以句点收束的截断串）→ 拒译，避免产出半句 */
  if (/\s(?:and|or|to|the|of|for|in|with|by|as|its|Appropriating)$/i.test(s)) return null;
  /* 转制类专用解析优先 */
  const cv = convertTpl(s);
  if (cv) return cv;
  for (const t of TEMPLATES) {
    const m = s.match(t.re);
    if (!m) continue;
    const g = m.groups || {};
    /* 槽位性质校验：任一槽位含通用正文即整条拒译 */
    const need = SLOTS[t.id] || [];
    let bad = false;
    for (const k of need) {
      if (!isProperName(g[k])) { bad = true; break; }
    }
    if (bad) continue;
    const out = {};
    let ok = true;
    for (const lang of ['vi', 'th', 'id', 'ms']) {
      let v = t.build(g, lang);
      if (!v || /null|undefined/.test(v)) { ok = false; break; }
      if (lang === 'th') v = thFix(v);
      out[lang] = v;
    }
    if (ok) return { tpl: t.id, out };
  }
  return null;
}

/* ---------- 数据集 ---------- */
function gapList(scope) {
  const g = JSON.parse(fs.readFileSync(GAP, 'utf8'));
  return (g.gaps || []).filter((x) => String(x.id).startsWith(scope + '-'));
}

if (has('--parse')) {
  const r = apply(arg('--parse'));
  if (!r) process.exit(0);
  console.log(JSON.stringify({ tpl: r.tpl, ...r.out }, null, 1));
  process.exit(0);
}

const scope = arg('--scope', 'PH');
const rows = gapList(scope);
const parsed = [];
const byTpl = new Map();
for (const x of rows) {
  const r = apply(x.title.en);
  if (r) {
    parsed.push({ id: x.id, ...r });
    byTpl.set(r.tpl, (byTpl.get(r.tpl) || 0) + 1);
  }
}

if (has('--emit')) {
  /* 出库终检：译文不得残留英文骨架或冠词。命中即剔除，宁可少出不可出错。 */
  const RESIDUE = [/An Act/i, /\bthe\b/i, /\bof the\b/i, /to Be Known/i, /Appropriating/i,
    /Therefor/i, /and for Other/i, /Establishing/i, /Converting/i, /Changing/i, /\bFrom the\b/i, /\sin\s+(?:the\s+)?(?:Province|Municipality|City|District|Region|Barangay|Poblacion)\b/];
  const items = {};
  let rejected = 0;
  for (const r of parsed) {
    let bad = false;
    for (const l of ['vi', 'th', 'id', 'ms']) {
      const v = r.out[l] || '';
      if (RESIDUE.some((re) => re.test(v))) { bad = true; break; }
    }
    if (bad) { rejected++; if (process.argv.includes('--showrej') && rejected <= 8) console.error('REJ ' + r.id + ' :: ' + r.out.vi.slice(0, 140)); continue; }
    items[r.id] = r.out;
  }
  const out = { batch: 'ph-gen-' + new Date().toISOString().slice(0, 10), scope, items };
  const p = arg('--emit');
  fs.writeFileSync(p, JSON.stringify(out, null, 2));
  console.log(`生成 ${Object.keys(items).length} 部 / 终检剔除 ${rejected} 部 / 未命中 ${rows.length - parsed.length} 部 → ${p}`);
  process.exit(0);
}

console.log(`法域 ${scope}：${rows.length} 部，模板命中 ${parsed.length} 部（${((parsed.length / rows.length) * 100).toFixed(1)}%）`);
console.log('按模板：');
for (const [k, v] of [...byTpl.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
