// b30：ID 长标题族「PENETAPAN PENSIUN POKOK …」（基本养老金确定）31 条全收官。
// 五种标题形态，其中「退伍军人族」标题被截断且各条尾部不同，采用两条判据：
//   ① 标题只写「退伍军人、遗孀/鳏夫、孤儿/遗孤、父母补助」时，不把正文里的兵种（TNI/Polri）写进译名
//      —— 兵种是正文信息、不在标题里，写进去即等于增译；
//   ② 标题明确截断在「ANGGOTA …」的（C2 型），兵种按 Pasal 1 逐条还原（含 1997 年的 ABRI）。
const fs = require('fs');
const path = require('path');

const T = {
  // A：公务员退休人员及遗孀/鳏夫
  A: {
    zh: '公务员退休人员及其遗孀/鳏夫基本养老金的确定',
    en: 'the Determination of the Basic Pension of Retired Civil Servants and Their Widows/Widowers',
    vi: 'Việc Xác định Lương hưu Cơ bản của Công chức Nghỉ hưu và Người vợ hoặc Người chồng góa của họ',
    th: 'การกำหนดบำนาญพื้นฐานของผู้รับบำนาญข้าราชการและม่ายของผู้นั้น',
    ms: 'Penetapan Pencen Pokok Pesara Pegawai Negeri Sipil dan Balu atau Duda',
  },
  // B：前国家官员及遗孀/鳏夫
  B: {
    zh: '前国家官员及其遗孀/鳏夫基本养老金的确定',
    en: 'the Determination of the Basic Pension of Former State Officials and Their Widows/Widowers',
    vi: 'Việc Xác định Lương hưu Cơ bản của Cựu Quan chức Nhà nước và Người vợ hoặc Người chồng góa của họ',
    th: 'การกำหนดบำนาญพื้นฐานของอดีตเจ้าหน้าที่รัฐและม่ายของผู้นั้น',
    ms: 'Penetapan Pencen Pokok Bekas Pegawai Negara dan Balu atau Duda',
  },
  // C1：退伍军人族（含父母补助），标题未写兵种
  C1: {
    zh: '退伍军人基本养老金、遗孀/鳏夫养老金、孤儿与遗孤补助及父母补助的确定',
    en: 'the Determination of the Basic Pension for Veterans, the Pension for Widows/Widowers, the Allowance for Orphans and the Allowance for Parents',
    vi: 'Việc Xác định Lương hưu Cơ bản của Cựu quân nhân, Lương hưu của Người vợ hoặc Người chồng góa, Trợ cấp Trẻ mồ côi và Trợ cấp cho Cha mẹ',
    th: 'การกำหนดบำนาญพื้นฐานของทหารผ่านศึก บำนาญของม่าย เงินช่วยเหลือเด็กกำพร้า และเงินช่วยเหลือบิดามารดา',
    ms: 'Penetapan Pencen Pokok Purnawirawan, Pencen Balu atau Duda, Elaun Anak Yatim Piatu dan Elaun Ibu Bapa',
  },
  // C2a：退伍军人族，标题截断于「ANGGOTA TENTARA NASIONAL INDONESIA」
  C2tni: {
    zh: '国民军成员中退伍军人、遗孀或鳏夫基本养老金及孤儿与遗孤补助的确定',
    en: 'the Determination of the Basic Pension of Veterans and the Pension of Widows or Widowers and the Allowance for Orphans of Members of the Indonesian National Armed Forces',
    vi: 'Việc Xác định Lương hưu Cơ bản của Cựu quân nhân và Lương hưu của Người vợ hoặc Người chồng góa cùng Trợ cấp Trẻ mồ côi của Quân nhân Lực lượng Vũ trang Quốc gia Indonesia',
    th: 'การกำหนดบำนาญพื้นฐานของทหารผ่านศึกและบำนาญของม่ายรวมทั้งเงินช่วยเหลือเด็กกำพร้าของกำลังพลกองทัพแห่งชาติอินโดนีเซีย',
    ms: 'Penetapan Pencen Pokok Purnawirawan dan Pencen Balu atau Duda serta Elaun Anak Yatim Piatu Anggota Tentera Nasional Indonesia',
  },
  // C2b：同上，兵种为国家警察
  C2polri: {
    zh: '国家警察成员中退伍军人、遗孀或鳏夫基本养老金及孤儿与遗孤补助的确定',
    en: 'the Determination of the Basic Pension of Veterans and the Pension of Widows or Widowers and the Allowance for Orphans of Members of the Indonesian National Police',
    vi: 'Việc Xác định Lương hưu Cơ bản của Cựu quân nhân và Lương hưu của Người vợ hoặc Người chồng góa cùng Trợ cấp Trẻ mồ côi của Thành viên Cảnh sát Quốc gia Indonesia',
    th: 'การกำหนดบำนาญพื้นฐานของทหารผ่านศึกและบำนาญของม่ายรวมทั้งเงินช่วยเหลือเด็กกำพร้าของเจ้าหน้าที่ตำรวจแห่งชาติอินโดนีเซีย',
    ms: 'Penetapan Pencen Pokok Purnawirawan dan Pencen Balu atau Duda serta Elaun Anak Yatim Piatu Anggota Polis Negara Republik Indonesia',
  },
  // C2c：同上，1997 年旧制「印度尼西亚共和国武装部队」
  C2abri: {
    zh: '武装部队成员中退伍军人、遗孀或鳏夫基本养老金及孤儿与遗孤补助的确定',
    en: 'the Determination of the Basic Pension of Veterans and the Pension of Widows or Widowers and the Allowance for Orphans of Members of the Armed Forces of the Republic of Indonesia',
    vi: 'Việc Xác định Lương hưu Cơ bản của Cựu quân nhân và Lương hưu của Người vợ hoặc Người chồng góa cùng Trợ cấp Trẻ mồ côi của Thành viên Lực lượng Vũ trang Cộng hòa Indonesia',
    th: 'การกำหนดบำนาญพื้นฐานของทหารผ่านศึกและบำนาญของม่ายรวมทั้งเงินช่วยเหลือเด็กกำพร้าของกำลังพลกองทัพสาธารณรัฐอินโดนีเซีย',
    ms: 'Penetapan Pencen Pokok Purnawirawan dan Pencen Balu atau Duda serta Elaun Anak Yatim Piatu Anggota Angkatan Bersenjata Republik Indonesia',
  },
  // D：三系统退休法官及遗孀/鳏夫
  D: {
    zh: '普通法院、国家行政法院与宗教法院退休法官及其遗孀/鳏夫基本养老金的确定',
    en: 'the Determination of the Basic Pension of Retired Judges of the General Courts, the State Administrative Courts and the Religious Courts and Their Widows/Widowers',
    vi: 'Việc Xác định Lương hưu Cơ bản của Thẩm phán Nghỉ hưu thuộc Tòa án Thường, Tòa án Hành chính Nhà nước và Tòa án Tôn giáo cùng Người vợ hoặc Người chồng góa của họ',
    th: 'การกำหนดบำนาญพื้นฐานของผู้พิพากษาเกษียณอายุในศาลทั่วไป ศาลปกครองของรัฐ และศาลศาสนา รวมทั้งม่ายของผู้นั้น',
    ms: 'Penetapan Pencen Pokok Pesara Hakim Mahkamah Umum, Mahkamah Tata Usaha Negara dan Mahkamah Agama serta Balu atau Duda',
  },
};

const ROWS = [
  ['ID-H658', 'A'], ['ID-H3230', 'A'], ['ID-H1658', 'A'], ['ID-H1970', 'A'],
  ['ID-H2074', 'A'], ['ID-H2267', 'A'], ['ID-H2366', 'A'], ['ID-H2471', 'A'],
  ['ID-H1375', 'A'], ['ID-H1497', 'A'], ['ID-H901', 'A'],
  ['ID-H1250', 'B'],
  ['ID-H2367', 'C1'], ['ID-H2472', 'C1'], ['ID-H3231', 'C1'], ['ID-H1972', 'C1'],
  ['ID-H2076', 'C1'], ['ID-H2183', 'C1'], ['ID-H2268', 'C1'], ['ID-H1659', 'C1'],
  ['ID-H1660', 'C1'], ['ID-H1971', 'C1'], ['ID-H2075', 'C1'],
  ['ID-H1553', 'C2polri'], ['ID-H1376', 'C2tni'], ['ID-H902', 'C2abri'],
  ['ID-H1552', 'C2tni'], ['ID-H1778', 'C2tni'],
  ['ID-H1374', 'D'], ['ID-H1657', 'D'], ['ID-H1251', 'D'],
];

const items = {};
for (const [id, kind] of ROWS) {
  if (items[id]) throw new Error('重复 id ' + id);
  items[id] = { ...T[kind] };
}

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const RE = /^PENETAPAN PENSIUN POKOK/i;
const lawdir = path.join(__dirname, '..', '..', 'prototype', 'data', 'laws');
const scope = new Set();
for (const u of buckets.long.filter((u) => RE.test(u.s))) {
  for (const id of u.ids) {
    const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
    if (['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim())) scope.add(id);
  }
}
const missing = [...scope].filter((id) => !items[id]);
const extra = Object.keys(items).filter((id) => !scope.has(id));
console.log('族内待译', scope.size, '| 写出', Object.keys(items).length);
if (missing.length) console.log('✗ 未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('✗ 越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

fs.writeFileSync(path.join(__dirname, '_id_b30.json'), JSON.stringify({ batch: 'id-p1-b30', items }, null, 1), 'utf8');
console.log('写出 _id_b30.json');
