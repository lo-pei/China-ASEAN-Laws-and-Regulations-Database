// b42：ID 长标题族「PELEBURAN PERUSAHAAN PERSEROAN (PERSERO) PT PERKEBUNAN …」（种植园公营公司合并）
// 10 条全收官，此前五语全空。
//
// 句式（只换公司与合并后的目标公司）：
//   zh  将公营有限公司{来源}种植园合并为公营有限公司努山塔拉第{N}种植园法
//   en  Law on the Merger of {A}, {B} and {C} into {target}
//   vi  Luật về Việc Sáp nhập {A}, {B} và {C} thành {target}
//   th  พระราชบัญญัติว่าด้วยการควบรวม{A} {B} และ{C}เข้าเป็น{target}
//   ms  Akta tentang Penggabungan {A}, {B} dan {C} menjadi {target}
//
// 三条口径：
//   ① 标题在 110 字符处被 OCR 截断（10 条里 7 条尾巴丢失，只见「… PT PERKEBUNAN IV, D」），
//      来源公司清单一律取 `Pasal 1 ayat (1)` 的「A, B dan C … dilebur dalam satu … baru
//      dengan nama … PT Perkebunan Nusantara {N}」逐份还原，不按标题前段猜。
//   ② 来源公司必须**逐份列明**：合并使被合并公司消灭，删一家即漏一个失效主体，
//      与 b31 银行名单「具名首户 + 等 N 家」的从宽口径不同（同 b37 撤销类）。
//   ③ 目标公司名与来源公司名同用「第 N 种植园」语序：来源 `PT Perkebunan X` → 第 X 种植园，
//      目标 `PT Perkebunan Nusantara N` → 努山塔拉第 N 种植园，二者不可混。
'use strict';
const fs = require('fs');
const path = require('path');

// 罗马数字 → 中文数字（仅本族用到的 1–31）
const CN = {
  II: '二', III: '三', IV: '四', V: '五', VI: '六', VII: '七', VIII: '八', IX: '九', X: '十',
  XI: '十一', XII: '十二', XIII: '十三', XIV: '十四', XVIII: '十八',
  XIX: '十九', XX: '二十', XXIII: '二十三',
  XXI: '二十一', XXII: '二十二', XXIV: '二十四', XXV: '二十五', XXVI: '二十六',
  XXVII: '二十七', XXVIII: '二十八', XXIX: '二十九', XXXI: '三十一', XXXII: '三十二',
};

const PERSERO = {
  zh: '公营有限公司',
  en: 'Perusahaan Perseroan (PERSERO)',
  vi: 'Công ty TNHH Nhà nước (PERSERO)',
  th: 'บริษัทจำกัดของรัฐ (PERSERO)',
  ms: 'Perusahaan Perseroan (PERSERO)',
};

// 来源公司（PT Perkebunan X 或具名公司）
const SRC = (x) => {
  if (x === 'bina') {
    return {
      zh: '比纳穆利亚畜牧公司',
      en: 'PT Bina Mulya Ternak',
      vi: 'Công ty Bina Mulya Ternak',
      th: 'บริษัทบีนามุลยาเตอร์นัก',
      ms: 'PT Bina Mulya Ternak',
    };
  }
  const cn = CN[x];
  if (!cn) throw new Error('缺中文数字 ' + x);
  return {
    zh: `第${cn}种植园`,
    en: `${PERSERO.en} PT Perkebunan ${x}`,
    vi: `${PERSERO.vi} Đồn điền ${x}`,
    th: `${PERSERO.th} สวน ${x}`,
    ms: `${PERSERO.ms} PT Perkebunan ${x}`,
  };
};

const TGT = (n) => {
  const cn = CN[n];
  if (!cn) throw new Error('缺中文数字 ' + n);
  return {
    zh: `${PERSERO.zh}努山塔拉第${cn}种植园`,
    en: `${PERSERO.en} PT Perkebunan Nusantara ${n}`,
    vi: `${PERSERO.vi} Đồn điền Nusantara ${n}`,
    th: `${PERSERO.th} สวนนูซันตารา ${n}`,
    ms: `${PERSERO.ms} PT Perkebunan Nusantara ${n}`,
  };
};

const LIST = {
  zh: { sep: '、', last: '、' },
  en: { sep: ', ', last: ' and ' },
  vi: { sep: ', ', last: ' và ' },
  th: { sep: ' ', last: ' และ' },
  ms: { sep: ', ', last: ' dan ' },
};

const joinList = (arr, k) => {
  if (arr.length === 1) return arr[0];
  const { sep, last } = LIST[k];
  return arr.slice(0, -1).join(sep) + last + arr[arr.length - 1];
};

const FR = (srcs, tgt) => {
  const zSrc = joinList(srcs.map((s) => (s.zh === '比纳穆利亚畜牧公司' ? s.zh : s.zh)), 'zh');
  // zh 的「公营有限公司」只出现一次，公司类别统摄整个来源列表
  const zHead = srcs.some((s) => s.zh.startsWith('比纳穆利亚'))
    ? `${PERSERO.zh}${zSrc}`
    : `${PERSERO.zh}${zSrc.replace(/种植园/g, '')}种植园`;
  return {
    zh: `将${zHead}合并为${tgt.zh}法`,
    en: `Law on the Merger of ${joinList(srcs.map((s) => s.en), 'en')} into ${tgt.en}`,
    vi: `Luật về Việc Sáp nhập ${joinList(srcs.map((s) => s.vi), 'vi')} thành ${tgt.vi}`,
    th: `พระราชบัญญัติว่าด้วยการควบรวม${joinList(srcs.map((s) => s.th), 'th')}เข้าเป็น${tgt.th}`,
    ms: `Akta tentang Penggabungan ${joinList(srcs.map((s) => s.ms), 'ms')} menjadi ${tgt.ms}`,
  };
};

// [id, [来源公司], 目标公司编号]
const ROWS = [
  ['ID-H807', ['II', 'IX'], 'II'],
  ['ID-H808', ['III', 'IV', 'V'], 'III'],
  ['ID-H809', ['VI', 'VII', 'VIII'], 'IV'],
  ['ID-H810', ['X', 'XXXI'], 'VII'],
  ['ID-H811', ['XI', 'XII', 'XIII'], 'VIII'],
  ['ID-H812', ['XIX', 'XXI-XXII', 'XXVII'], 'X'],
  ['ID-H813', ['XV-XVI', 'XVIII'], 'IX'],
  ['ID-H814', ['XX', 'XXIV-XXV'], 'XI'],
  ['ID-H815', ['XXIII', 'XXVI', 'XXIX'], 'XII'],
  ['ID-H816', ['XXVIII', 'XXXII', 'bina'], 'XIV'],
];

// 复合编号（XXI-XXII / XV-XVI / XXIV-XXV）单独给名
const COMPOUND = {
  'XXI-XXII': {
    zh: '第二十一至二十二种植园',
    en: `${PERSERO.en} PT Perkebunan XXI-XXII`,
    vi: `${PERSERO.vi} Đồn điền XXI-XXII`,
    th: `${PERSERO.th} สวน XXI-XXII`,
    ms: `${PERSERO.ms} PT Perkebunan XXI-XXII`,
  },
  'XV-XVI': {
    zh: '第十五至十六种植园',
    en: `${PERSERO.en} PT Perkebunan XV-XVI`,
    vi: `${PERSERO.vi} Đồn điền XV-XVI`,
    th: `${PERSERO.th} สวน XV-XVI`,
    ms: `${PERSERO.ms} PT Perkebunan XV-XVI`,
  },
  'XXIV-XXV': {
    zh: '第二十四至二十五种植园',
    en: `${PERSERO.en} PT Perkebunan XXIV-XXV`,
    vi: `${PERSERO.vi} Đồn điền XXIV-XXV`,
    th: `${PERSERO.th} สวน XXIV-XXV`,
    ms: `${PERSERO.ms} PT Perkebunan XXIV-XXV`,
  },
};

const build = (x) => (COMPOUND[x] ? COMPOUND[x] : SRC(x));

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const [id, srcKeys, tgtKey] of ROWS) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  // 自校验：标题前段应含第一家来源公司的编号串
  const first = srcKeys[0];
  if (first !== 'bina' && !new RegExp('PERKEBUNAN ' + first + '\\b').test(orig)) {
    bad.push(id + ' 标题前段不含 PERKEBUNAN ' + first + '：' + orig);
  }
  // 自校验：正文 Pasal 1 应点出目标公司 Nusantara {N}
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');
  // OCR 会把「Perkebunan」断成「Perkebun an」（ID-H814），故去空白后比对；
  // 目标号须后接非罗马数字，避免 XI 误命中 XII。
  if (!new RegExp('PerkebunanNusantara' + tgtKey + '(?![IVX])').test(txt.replace(/\s+/g, ''))) {
    bad.push(id + ' 正文未见目标公司 Nusantara ' + tgtKey);
  }
  items[id] = FR(srcKeys.map(build), TGT(tgtKey));
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 10) throw new Error('条目数应为 10，实为 ' + n);
const over = [];
for (const [id, t] of Object.entries(items)) {
  for (const [k, v] of Object.entries(t)) if (v.length > 300) over.push(id + '/' + k + '=' + v.length);
}
if (over.length) throw new Error('超 300 字符：' + over.join(', '));

const out = path.join(__dirname, '_id_b42.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b42', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
