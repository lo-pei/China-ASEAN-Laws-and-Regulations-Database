// b46：ID 两族「ANGGARAN PENDAPATAN DAN BELANJA NEGARA TAHUN ANGGARAN …」（国家收支预算，9 条）
// 与「PEMBERIAN GAJI/PENSIUN/TUNJANGAN BULAN KETIGA BELAS …」（第十三个月工资，9 条），共 18 条，
// 此前五语全空。
//
// 甲、APBN：
//   zh  {年1}/{年2} 财政年度国家收支预算法
//   en  Law on the State Budget for the {年1}/{年2} Fiscal Year
//   vi  Luật về Ngân sách Nhà nước năm tài chính {年1}/{年2}
//   th  พระราชบัญญัติงบประมาณรายรับรายจ่ายของรัฐปีงบประมาณ {年1}/{年2}
//   ms  Akta tentang Anggaran Pendapatan dan Belanja Negara Tahun Anggaran {年1}/{年2}
//
// 乙、第十三个月工资：
//   zh  {年}财政年度向{受领人}发放第十三个月工资、养老金或津贴法
//   … 余四语同构，受领人按正文 Pasal 2 ayat (1) 定。
//
// 四条口径：
//   ① **标题里的年份是 OCR 去掉了斜杠的 8 位数**（`19941995` = 1994/1995 财政年度）。
//      拆法由脚本自校验：前四位 + 1 必须等于后四位，不等即抛错，防止把 1991/1992 写成 1991/1993。
//   ② **`BULAN KETIGA BELAS`（第十三个月工资）≠ `TUNJANGAN HARI RAYA`（b38 节日津贴）**：
//      前者是当年第 13 个月工资（含养老金、津贴），后者是开斋节一次性津贴，两者法律依据、
//      受领人范围、计算基数都不同，不可互译。
//   ③ 受领人分两式：8 条标题作 `KEPADA PEGAWAI NEGERI, PEJABAT NEGARA, …`（公务员含军警），
//      2015 年那条作 `KEPADA PEGAWAI NEGERI SIPIL, ANGGOTA TNI, ANGGOTA POLRI, …`（三类分列）。
//      标题既然分列，译名也分列——2015 年之后 PNS 与军警的薪酬体系已分开立法。
//   ④ `GAJIPENSIUNTUNJANGAN` 是 OCR 把 `GAJI/PENSIUN/TUNJANGAN` 的斜杠吃掉后的连写，
//      还原为「工资、养老金或津贴」三项，不当作一个词。
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

/* ---------------- 甲、APBN ---------------- */
const FR_APBN = (y1, y2) => ({
  zh: `${y1}/${y2} 财政年度国家收支预算法`,
  en: `Law on the State Budget for the ${y1}/${y2} Fiscal Year`,
  vi: `Luật về Ngân sách Nhà nước năm tài chính ${y1}/${y2}`,
  th: `พระราชบัญญัติงบประมาณรายรับรายจ่ายของรัฐปีงบประมาณ ${y1}/${y2}`,
  ms: `Akta tentang Anggaran Pendapatan dan Belanja Negara Tahun Anggaran ${y1}/${y2}`,
});

const APBN = [
  'ID-H463', 'ID-H483', 'ID-H552', 'ID-H553', 'ID-H638',
  'ID-H675', 'ID-H789', 'ID-H934', 'ID-H1011',
];

/* ---------------- 乙、第十三个月工资 ---------------- */
// 受领人两式
const R = {
  umum: {
    zh: '公务员、国家官员及养老金与津贴受领人',
    en: 'Civil Servants, State Officials and Recipients of Pensions or Allowances',
    vi: 'Công chức, Quan chức Nhà nước và Người hưởng Lương hưu hoặc Phụ cấp',
    th: 'ข้าราชการ ข้าราชการการเมือง และผู้รับเงินบำนาญหรือเงินช่วยเหลือ',
    ms: 'Pegawai Negeri, Pegawai Negara dan Penerima Pensiun atau Tunjangan',
  },
  terpisah: {
    zh: '公务员、国民军军人、国家警察成员、国家官员及养老金与津贴受领人',
    en: 'Civil Servants, Indonesian National Armed Forces Personnel, Indonesian National Police Personnel, State Officials and Recipients of Pensions or Allowances',
    vi: 'Công chức, Quân nhân Lực lượng Vũ trang Quốc gia Indonesia, Thành viên Cảnh sát Quốc gia Indonesia, Quan chức Nhà nước và Người hưởng Lương hưu hoặc Phụ cấp',
    th: 'ข้าราชการพลเรือน ทหารกองทัพแห่งชาติอินโดนีเซีย เจ้าหน้าที่ตำรวจแห่งชาติอินโดนีเซีย ข้าราชการการเมือง และผู้รับเงินบำนาญหรือเงินช่วยเหลือ',
    ms: 'Pegawai Negeri Sipil, Anggota Tentera Nasional Indonesia, Anggota Polis Negara Indonesia, Pegawai Negara dan Penerima Pensiun atau Tunjangan',
  },
};

const FR_GAJI = (y, r) => ({
  zh: `${y}财政年度向${r.zh}发放第十三个月工资、养老金或津贴法`,
  en: `Law on the Granting of the Thirteenth-Month Salary, Pension or Allowance in the ${y} Fiscal Year to ${r.en}`,
  vi: `Luật về Việc Cấp Lương, Lương hưu hoặc Phụ cấp tháng thứ mười ba trong Năm tài chính ${y} cho ${r.vi}`,
  th: `พระราชบัญญัติว่าด้วยการจ่ายเงินเดือน เงินบำนาญ หรือเงินช่วยเหลือเดือนที่สิบสามในปีงบประมาณ ${y} แก่${r.th}`,
  ms: `Akta tentang Pemberian Gaji, Pensiun atau Tunjangan Bulan Ketiga Belas dalam Tahun Anggaran ${y} kepada ${r.ms}`,
});

// [id, 受领人式]
const GAJI = [
  ['ID-H1491', 'umum'],
  ['ID-H1644', 'umum'],
  ['ID-H1767', 'umum'],
  ['ID-H1863', 'umum'],
  ['ID-H1951', 'umum'],
  ['ID-H2051', 'umum'],
  ['ID-H2157', 'umum'],
  ['ID-H2247', 'umum'],
  ['ID-H2442', 'terpisah'],
];

const items = {};
const bad = [];

for (const id of APBN) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  if (!/^ANGGARAN PENDAPATAN DAN BELANJA NEGARA TAHUN ANGGARAN/i.test(orig)) bad.push(id + ' 标题非 APBN');
  const m = orig.match(/(\d{8})/);
  if (!m) { bad.push(id + ' 标题无 8 位年份串：' + orig); continue; }
  const y1 = m[1].slice(0, 4), y2 = m[1].slice(4);
  if (Number(y2) !== Number(y1) + 1) bad.push(id + ' 年份差不为 1：' + m[1]);
  items[id] = FR_APBN(y1, y2);
}

for (const [id, rk] of GAJI) {
  const r = R[rk];
  if (!r) throw new Error('缺受领人槽 ' + rk);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  if (!/^PEMBERIAN GAJIPENSIUNTUNJANGAN BULAN KETIGA BELAS/i.test(orig)) bad.push(id + ' 标题非第十三个月工资');
  const m = orig.match(/TAHUN ANGGARAN (\d{4})/);
  if (!m) { bad.push(id + ' 标题无年度：' + orig); continue; }
  const y = m[1];
  // 受领人式自校验：标题写 PEGAWAI NEGERI SIPIL 的必须是分列式
  const isSeparate = /PEGAWAI NEGERI SIPIL/i.test(orig);
  if (isSeparate !== (rk === 'terpisah')) bad.push(id + ' 受领人式与标题不符（标题分列=' + isSeparate + '）');
  // 正文 Pasal 2 须同时出现 Penerima Pensiun 与 Tunjangan
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');
  if (!/Penerima Pensiun\s*\/?\s*Tunjangan/i.test(txt)) bad.push(id + ' 正文未见「Penerima Pensiun/Tunjangan」');
  items[id] = FR_GAJI(y, r);
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== 18) throw new Error('条目数应为 18，实为 ' + n);
const over = [];
for (const [id, t] of Object.entries(items)) {
  for (const [k, v] of Object.entries(t)) if (v.length > 300) over.push(id + '/' + k + '=' + v.length);
}
if (over.length) throw new Error('超 300 字符：' + over.join(', '));

const out = path.join(__dirname, '_id_b46.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b46', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
