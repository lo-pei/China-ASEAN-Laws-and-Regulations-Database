// b47：ID 两族「PELAKSANAAN UNDANG-UNDANG NOMOR …」（某法的实施条例，12 条）与
// 「PEMINDAHAN SISA KREDIT ANGGARAN PEMBANGUNAN …」（发展预算信贷结余结转，8 条），共 20 条。
//
// 甲、实施条例：
//   zh  关于实施{年}年第{号}号《{主题}法》的政府条例[（该法经{年}年第{号}号法律最后修改）]
//   en  Government Regulation on the Implementation of Law No. {号} of {年} on {主题}
//   vi  Quy định của Chính phủ về Việc Thực hiện Luật số {号} năm {年} về {主题}
//   th  กฎระเบียบรัฐบาลว่าด้วยการดำเนินการตามกฎหมายฉบับที่ {号} ปี {年} ว่าด้วย{主题}
//   ms  Peraturan Pemerintah tentang Pelaksanaan Undang-Undang No. {号} Tahun {年} tentang {主题}
//
// 乙、信贷结余结转：
//   zh  将{y1}/{y2}财政年度发展预算的信贷结余结转至{y3}/{y4}财政年度法
//   en  Law on the Transfer of the Remaining Development Budget Credits from the {y1}/{y2}
//       Fiscal Year to the {y3}/{y4} Fiscal Year
//
// 三条口径：
//   ① **这 12 条的标题是残缺的**：原件标题是「PERATURAN PEMERINTAH … TENTANG PELAKSANAAN
//      UNDANG-UNDANG NOMOR …」，抓取时把「PERATURAN PEMERINTAH … TENTANG」这一段丢了，
//      只剩下从句。正文首句一律作「Dalam Peraturan Pemerintah ini …」，可确证文书性质是
//      **政府条例**而不是法律——故译名补回「政府条例」这一文书类型，属补全而非增译。
//      `ID-H2707`/`ID-H491` 正文同时出现「Undang-Undang ini」，那是条例里引述被实施的法，
//      不改变本条例自身的性质。
//   ② 5 条 PPN（增值税）条目的标题尾部带「SEBAGAIMANA TELAH [BEBERAPA KALI] DIUBAH
//      [TERAKHIR] DENGAN UNDANG-UNDANG NOMOR …」的修改沿革。沿革一律作括注并**只写号年**，
//      不重述所引法律的完整标题——`ID-H2149` 引的那部 42/2009 法标题本身又复述了 8/1983 法
//      的全称，全写会形成三层嵌套、且不增信息。
//   ③ `ID-H1201` 标题 OCR 作「AJAK PERTAMBAHAN NILAI」（掉首字母 P）、`ID-H687` 作
//      「PAJAK PERTAMBAHANNILAI」（掉了空格），均按同一主题处理，脏字不采。
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

/* ---------------- 甲、实施条例 ---------------- */
// 被实施法的主题五语
const S = {
  adminduk: {
    zh: '居民行政', en: 'Population Administration', vi: 'Hành chính Dân cư',
    th: 'การบริหารงานทะเบียนราษฎร', ms: 'Pentadbiran Kependudukan',
  },
  ormas: {
    zh: '社会组织', en: 'Mass Organizations', vi: 'Tổ chức Xã hội',
    th: 'องค์กรภาคสังคม', ms: 'Pertubuhan Kemasyarakatan',
  },
  resiGudang: {
    zh: '仓单制度', en: 'the Warehouse Receipt System', vi: 'Hệ thống Giấy gửi kho',
    th: 'ระบบใบรับฝากสินค้า', ms: 'Sistem Resi Gudang',
  },
  narkotika: {
    zh: '麻醉品', en: 'Narcotics', vi: 'Ma túy',
    th: 'ยาเสพติด', ms: 'Narkotik',
  },
  keprotokolan: {
    zh: '礼宾', en: 'Protocol', vi: 'Lễ tân',
    th: 'พิธีการ', ms: 'Protokol',
  },
  desainIndustri: {
    zh: '工业品外观设计', en: 'Industrial Designs', vi: 'Kiểu dáng Công nghiệp',
    th: 'การออกแบบอุตสาหกรรม', ms: 'Reka Bentuk Industri',
  },
  haji: {
    zh: '朝觐财务管理', en: 'Hajj Financial Management', vi: 'Quản lý Tài chính Hành hương',
    th: 'การบริหารการเงินฮัจญ์', ms: 'Pengurusan Kewangan Haji',
  },
  ppn: {
    zh: '货物与服务增值税及奢侈品销售税',
    en: 'Value Added Tax on Goods and Services and Sales Tax on Luxury Goods',
    vi: 'Thuế Giá trị Gia tăng đối với Hàng hóa và Dịch vụ và Thuế Bán hàng đối với Hàng hóa Xa xỉ',
    th: 'ภาษีมูลค่าเพิ่มสำหรับสินค้าและบริการและภาษีขายสินค้าฟุ่มเฟือย',
    ms: 'Cukai Pertambahan Nilai Barang dan Perkhidmatan dan Cukai Jualan atas Barang Mewah',
  },
  umkm: {
    zh: '微型、小型和中型企业', en: 'Micro, Small and Medium Enterprises',
    vi: 'Doanh nghiệp Siêu nhỏ, Nhỏ và Vừa', th: 'วิสาหกิจขนาดย่อม ขนาดเล็ก และขนาดกลาง',
    ms: 'Usaha Mikro, Kecil dan Sederhana',
  },
  serahSimpan: {
    zh: '印刷作品与录音作品的交存', en: 'the Deposit of Printed and Recorded Works',
    vi: 'Việc Nộp lưu Chiếu tác phẩm in và tác phẩm ghi âm',
    th: 'การส่งมอบงานสิ่งพิมพ์และงานบันทึกเสียง',
    ms: 'Penyerahan Simpanan Karya Cetak dan Karya Rekam',
  },
};

const FR_IMPL = (no, yr, s, amd) => {
  const tail = {
    zh: amd ? `（该法经${amd.yr}年第${amd.no}号法律最后修改）` : '',
    en: amd ? `, as last amended by Law No. ${amd.no} of ${amd.yr}` : '',
    vi: amd ? `, được sửa đổi lần cuối bởi Luật số ${amd.no} năm ${amd.yr}` : '',
    th: amd ? ` ซึ่งแก้ไขเพิ่มเติมครั้งล่าสุดโดยกฎหมายฉบับที่ ${amd.no} ปี ${amd.yr}` : '',
    ms: amd ? `, sebagaimana telah diubah terakhir dengan Undang-Undang No. ${amd.no} Tahun ${amd.yr}` : '',
  };
  return {
    zh: `关于实施${yr}年第${no}号《${s.zh}法》的政府条例${tail.zh}`,
    en: `Government Regulation on the Implementation of Law No. ${no} of ${yr} on ${s.en}${tail.en}`,
    vi: `Quy định của Chính phủ về Việc Thực hiện Luật số ${no} năm ${yr} về ${s.vi}${tail.vi}`,
    th: `กฎระเบียบรัฐบาลว่าด้วยการดำเนินการตามกฎหมายฉบับที่ ${no} ปี ${yr} ว่าด้วย${s.th}${tail.th}`,
    ms: `Peraturan Pemerintah tentang Pelaksanaan Undang-Undang No. ${no} Tahun ${yr} tentang ${s.ms}${tail.ms}`,
  };
};

// [id, 主题键, 修改沿革 {no,yr}|null]
const IMPL = [
  ['ID-H1616', 'adminduk', null],
  ['ID-H2552', 'ormas', null],
  ['ID-H1617', 'resiGudang', null],
  ['ID-H2237', 'narkotika', null],
  ['ID-H2707', 'keprotokolan', null],
  ['ID-H1485', 'desainIndustri', null],
  ['ID-H2706', 'haji', null],
  ['ID-H2236', 'umkm', null],
  ['ID-H491', 'serahSimpan', null],
  ['ID-H687', 'ppn', { no: '11', yr: '1994' }],
  ['ID-H1201', 'ppn', { no: '18', yr: '2000' }],
  ['ID-H2149', 'ppn', { no: '42', yr: '2009' }],
];

const items = {};
const bad = [];
for (const [id, sk, amd] of IMPL) {
  const s = S[sk];
  if (!s) throw new Error('缺主题槽 ' + sk);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  const m = orig.match(/^PELAKSANAAN UNDANG-UNDANG NOMOR (\d+) TAHUN (\d{4})\b/i);
  if (!m) { bad.push(id + ' 标题头不符：' + orig.slice(0, 70)); continue; }
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');
  // 文书性质确证：正文首句须为「Dalam Peraturan Pemerintah ini」
  if (!/Dalam Peraturan Pemerintah ini/i.test(txt)) bad.push(id + ' 正文未见「Dalam Peraturan Pemerintah ini」，不能确证为政府条例');
  // 修改沿革自校验
  const hasAmd = /SEBAGAIMANA TELAH/i.test(orig);
  if (hasAmd !== !!amd) bad.push(id + ' 修改沿革判定不符（标题含 SEBAGAIMANA TELAH=' + hasAmd + '）');
  if (amd) {
    const am = orig.match(/DIUBAH[\s\S]*?UNDANG-UNDANG NOMOR (\d+) TAHUN (\d{4})/i);
    if (!am) bad.push(id + ' 未取到修改法号年');
    else if (am[1] !== amd.no || am[2] !== amd.yr) bad.push(id + ' 修改法号年不符：标题 ' + am[1] + '/' + am[2] + ' 表内 ' + amd.no + '/' + amd.yr);
  }
  items[id] = FR_IMPL(m[1], m[2], s, amd);
}

/* ---------------- 乙、信贷结余结转 ---------------- */
// 年份串可能是 8 位（19901991）或 6 位（199495 = 1994/95 的缩写）
const parsePair = (tok) => {
  const y1 = tok.slice(0, 4);
  const y2 = String(Number(y1) + 1);
  const rest = tok.slice(4);
  if (rest !== y2 && rest !== y2.slice(2)) return null;
  return [y1, y2];
};

const FR_KREDIT = (a, b) => ({
  zh: `将${a[0]}/${a[1]}财政年度发展预算的信贷结余结转至${b[0]}/${b[1]}财政年度法`,
  en: `Law on the Transfer of the Remaining Development Budget Credits from the ${a[0]}/${a[1]} Fiscal Year to the ${b[0]}/${b[1]} Fiscal Year`,
  vi: `Luật về Việc Chuyển số Dư Tín dụng Ngân sách Phát triển từ Năm tài chính ${a[0]}/${a[1]} sang Năm tài chính ${b[0]}/${b[1]}`,
  th: `พระราชบัญญัติว่าด้วยการโอนยอดคงเหลือวงเงินงบประมาณการพัฒนาจากปีงบประมาณ ${a[0]}/${a[1]} ไปยังปีงบประมาณ ${b[0]}/${b[1]}`,
  ms: `Akta tentang Pemindahan Baki Kredit Anggaran Pembangunan Tahun Anggaran ${a[0]}/${a[1]} ke Tahun Anggaran ${b[0]}/${b[1]}`,
});

const KREDIT = ['ID-H503', 'ID-H589', 'ID-H655', 'ID-H694', 'ID-H763', 'ID-H837', 'ID-H888', 'ID-H959'];

for (const id of KREDIT) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  const m = orig.match(/TAHUN ANGGARAN (\d{6,8}) KE TAHUN ANGGARAN (\d{6,8})/);
  if (!m) { bad.push(id + ' 未取到两组年份：' + orig); continue; }
  const a = parsePair(m[1]), b = parsePair(m[2]);
  if (!a || !b) { bad.push(id + ' 年份串无法解析：' + m[1] + ' / ' + m[2]); continue; }
  // 承接关系自校验：后一年度的首年应为前一年度的次年
  if (b[0] !== a[1]) bad.push(id + ' 年度不衔接：' + a.join('/') + ' → ' + b.join('/'));
  items[id] = FR_KREDIT(a, b);
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== 20) throw new Error('条目数应为 20，实为 ' + n);
const out = path.join(__dirname, '_id_b47.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b47', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
