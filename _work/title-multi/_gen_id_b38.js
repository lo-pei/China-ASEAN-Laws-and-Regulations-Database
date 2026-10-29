// b38：ID 长标题族「PEMBERIAN TUNJANGAN HARI RAYA …」（节日津贴发放）15 条全收官。
// 该族 15 条此前五语全空。
//
// 四种形态（差异只在「发什么」「给谁」「哪一年」三处）：
//   A  PEMBERIAN TUNJANGAN HARI RAYA TAHUN {年}
//   B  PEMBERIAN TUNJANGAN HARI RAYA DAN GAJI KETIGA BELAS KEPADA APARATUR NEGARA, PENSIUNAN,
//      PENERIMA PENSIUN, DAN PENERIMA TUNJANGAN TAHUN {年}                          （带第十三个月工资）
//   C  PEMBERIAN TUNJANGAN HARI RAYA [DALAM TAHUN ANGGARAN {年}] KEPADA PEGAWAI NEGERI SIPIL,
//      PRAJURIT TNI, ANGGOTA POLRI, PEJABAT NEGARA, PENERIMA PENSIUN, DAN PENERIMA TUNJANGAN
//   D  同上，对象为 PIMPINAN DAN PEGAWAI NONPEGAWAI NEGERI SIPIL PADA LEMBAGA NONSTRUKTURAL
//
// 口径：
//   ① 8 条标题在 110 字符处被 OCR 截断（C/D 两型的受领人名单后半段丢失），
//      受领人按 `Pasal 1` 的定义条与同型完整标题（ID-H2788、ID-H2789）补齐，不自行增删。
//   ② 「TAHUN {年}」是公历年（in 2021），「DALAM TAHUN ANGGARAN {年}」是财政年度
//      （for the 2021 Fiscal Year），二者在五语里都要区分，不能都写成「年」。
//   ③ 「GAJI KETIGA BELAS」= 第十三个月工资（印尼的年度额外薪酬，等同年终奖），
//      不作「十三薪」以外的解释；只出现在 B 型。
'use strict';
const fs = require('fs');
const path = require('path');

// 受领人
const R = {
  aparatur: {
    zh: '国家公职人员、退休人员、养老金领取人和津贴领取人',
    en: 'Aparatur Negara, Pensioners, Pension Recipients and Allowance Recipients',
    vi: 'Aparatur Negara, Người nghỉ hưu, Người nhận Lương hưu và Người nhận Phụ cấp',
    th: 'เจ้าหน้าที่รัฐ ผู้เกษียณอายุ ผู้รับบำนาญ และผู้รับเงินช่วยเหลือ',
    ms: 'Aparatur Negara, Pesara, Penerima Pencen dan Penerima Elaun',
  },
  pns: {
    zh: '公务员、印度尼西亚国民军军人、印度尼西亚共和国国家警察成员、国家官员、养老金领取人和津贴领取人',
    en: 'Civil Servants, Indonesian National Armed Forces Personnel, Members of the Indonesian National Police, State Officials, Pension Recipients and Allowance Recipients',
    vi: 'Công chức, Quân nhân Lực lượng Vũ trang Quốc gia Indonesia, Thành viên Cảnh sát Quốc gia Cộng hòa Indonesia, Quan chức Nhà nước, Người nhận Lương hưu và Người nhận Phụ cấp',
    th: 'ข้าราชการ ทหารกองทัพแห่งชาติอินโดนีเซีย เจ้าหน้าที่ตำรวจแห่งชาติสาธารณรัฐอินโดนีเซีย เจ้าหน้าที่รัฐ ผู้รับบำนาญ และผู้รับเงินช่วยเหลือ',
    ms: 'Pegawai Negeri Sipil, Anggota Tentara Nasional Indonesia, Anggota Polis Negara Republik Indonesia, Pegawai Negara, Penerima Pencen dan Penerima Elaun',
  },
  lns: {
    zh: '非结构性机构的领导与非公务员雇员',
    en: 'the Leaders and Non-Civil-Servant Employees of Non-Structural Institutions',
    vi: 'Lãnh đạo và Nhân viên Không phải Công chức của các Cơ quan Phi cấu trúc',
    th: 'ผู้บริหารและพนักงานที่ไม่ใช่ข้าราชการขององค์กรนอกโครงสร้าง',
    ms: 'Pimpinan dan Pegawai Bukan Pegawai Negeri Sipil pada Lembaga Nonstruktural',
  },
  campur: {
    zh: '公务员、印度尼西亚国民军军人、印度尼西亚共和国国家警察成员、非公务员雇员及养老金或津贴领取人',
    en: 'Civil Servants, Indonesian National Armed Forces Personnel, Members of the Indonesian National Police, Non-Civil-Servant Employees and Recipients of Pensions or Allowances',
    vi: 'Công chức, Quân nhân Lực lượng Vũ trang Quốc gia Indonesia, Thành viên Cảnh sát Quốc gia Cộng hòa Indonesia, Nhân viên Không phải Công chức và Người nhận Lương hưu hoặc Phụ cấp',
    th: 'ข้าราชการ ทหารกองทัพแห่งชาติอินโดนีเซีย เจ้าหน้าที่ตำรวจแห่งชาติสาธารณรัฐอินโดนีเซีย พนักงานที่ไม่ใช่ข้าราชการ และผู้รับบำนาญหรือเงินช่วยเหลือ',
    ms: 'Pegawai Negeri Sipil, Anggota Tentara Nasional Indonesia, Anggota Polis Negara Republik Indonesia, Pegawai Bukan PNS dan Penerima Pencen atau Elaun',
  },
};

const ALLOW = {
  hari: { zh: '节日津贴', en: 'the Hari Raya Allowance', vi: 'Phụ cấp Ngày Raya', th: 'เงินช่วยเหลือวันฮารีรายอ', ms: 'Tunjangan Hari Raya' },
  hari13: { zh: '节日津贴与第十三个月工资', en: 'the Hari Raya Allowance and the Thirteenth-Month Salary', vi: 'Phụ cấp Ngày Raya và Lương Tháng thứ mười ba', th: 'เงินช่วยเหลือวันฮารีรายอและเงินเดือนเดือนที่สิบสาม', ms: 'Tunjangan Hari Raya dan Gaji Bulan Ketiga Belas' },
};

// kind: 'tahun'（公历年）| 'anggaran'（财政年度）| null
function TIME(kind, y) {
  if (!kind) return { zh: '', en: '', vi: '', th: '', ms: '' };
  if (kind === 'tahun') return {
    zh: `${y}年`, en: ` in ${y}`, vi: ` trong năm ${y}`, th: `ในปี ${y}`, ms: ` Tahun ${y}`,
  };
  return {
    zh: `${y}财政年度`, en: ` for the ${y} Fiscal Year`, vi: ` cho Năm Tài khóa ${y}`, th: `สำหรับปีงบประมาณ ${y}`, ms: ` bagi Tahun Anggaran ${y}`,
  };
}

function FR(allow, kind, y, rec) {
  const a = ALLOW[allow], t = TIME(kind, y), r = R[rec];
  return {
    zh: `向${r.zh}发放${t.zh}${a.zh}`,
    en: `the Granting of ${a.en}${t.en} to ${r.en}`,
    vi: `Việc Cấp ${a.vi}${t.vi} cho ${r.vi}`,
    th: `การจ่าย${a.th}${t.th}ให้แก่${r.th}`,
    ms: `Pemberian ${a.ms}${t.ms} kepada ${r.ms}`,
  };
}

// [id, 津贴类型, 时间类型, 年, 受领人]
const ROWS = [
  ['ID-H3303', 'hari13', 'tahun', 2025, 'aparatur'],
  ['ID-H2883', 'hari', 'tahun', 2020, 'campur'],
  ['ID-H2980', 'hari13', 'tahun', 2021, 'aparatur'],
  ['ID-H3142', 'hari13', 'tahun', 2023, 'aparatur'],
  ['ID-H3222', 'hari13', 'tahun', 2024, 'aparatur'],
  ['ID-H3373', 'hari13', 'tahun', 2026, 'aparatur'],
  ['ID-H3068', 'hari13', 'tahun', 2022, 'aparatur'],
  ['ID-H2557', 'hari', 'anggaran', 2016, 'pns'],
  ['ID-H2629', 'hari', 'anggaran', 2017, 'pns'],
  ['ID-H2709', 'hari', 'anggaran', 2018, 'pns'],
  ['ID-H2788', 'hari', null, null, 'pns'],
  ['ID-H2558', 'hari', 'anggaran', 2016, 'lns'],
  ['ID-H2630', 'hari', 'anggaran', 2017, 'lns'],
  ['ID-H2710', 'hari', 'anggaran', 2018, 'lns'],
  ['ID-H2789', 'hari', null, null, 'lns'],
];

const items = {};
const over = [];
for (const [id, allow, kind, y, rec] of ROWS) {
  const t = FR(allow, kind, y, rec);
  items[id] = t;
  for (const [k, v] of Object.entries(t)) if (v.length > 300) over.push(id + '/' + k + '=' + v.length);
}
const n = Object.keys(items).length;
if (n !== 15) throw new Error('条目数应为 15，实为 ' + n);
if (over.length) throw new Error('超长（>300）：' + over.join(', '));

const out = path.join(__dirname, '_id_b38.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b38', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
