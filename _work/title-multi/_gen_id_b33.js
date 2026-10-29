// b33：ID 长标题族「PERUBAHAN ATAS UNDANG-UNDANG NOMOR … TAHUN … TENTANG …」23 条全收官。
// 该族 23 条此前五语全空，标题一一对应一部被修改的法律，无重复形态。
//
// 句式（对齐库内既有 ID-H3318 的写法，只补 zh 的「关于…的」使定语成句）：
//   zh  修改{年}年第{号}号关于{主题}的法律[（经{年}年第{号}号法律修改）]
//   en  Law Amending Law No.{号} of {年} on {主题}[ as Amended by Law No.{号} of {年}]
//   vi  Luật Sửa đổi Luật số {号} năm {年} về {主题}[ đã được sửa đổi bởi Luật số {号} năm {年}]
//   th  พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายฉบับที่ {号} ปี {年} ว่าด้วย{主题}[ ซึ่งแก้ไขเพิ่มเติมโดยกฎหมายฉบับที่ {号} ปี {年}]
//   ms  Akta Meminda Undang-Undang No. {号} Tahun {年} tentang {主题}[ sebagaimana telah diubah dengan Undang-Undang No. {号} Tahun {年}]
//
// 两条口径：
//   ① 号年一律从标题解析并与表内写死的值比对，二者不一致即抛错——避免手抄号年出错。
//   ② 两条标题本身含「SEBAGAIMANA TELAH DIUBAH DENGAN …」的（ID-H924 / ID-H1147），
//      该从句在译名里保留为括注，不当作被修改法的一部分吞掉。
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWDIR = path.join(ROOT, 'prototype', 'data', 'laws');

// [id, 号, 年, 主题{zh,en,vi,th,ms}, 经修改号, 经修改年]
const ROWS = [
  ['ID-H2494', 1, 2015, {
    zh: '将2014年第1号《选举省长、县长和市长的代替法律的政府条例》定为法律',
    en: 'the Enactment of Government Regulation in Lieu of Law No. 1 of 2014 on the Election of Governors, Regents and Mayors into Law',
    vi: 'Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2014 về Bầu cử Thống đốc, Bupati và Wali Kota thành Luật',
    th: 'การตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2014 ว่าด้วยการเลือกตั้งผู้ว่าราชการจังหวัด หัวหน้าเขต และนายกเทศมนตรีเป็นกฎหมาย',
    ms: 'Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2014 tentang Pemilihan Gabenor, Bupati dan Wali Kota menjadi Undang-Undang',
  }],
  ['ID-H2394', 23, 2002, {
    zh: '儿童保护', en: 'Child Protection', vi: 'Bảo vệ Trẻ em',
    th: 'การคุ้มครองเด็ก', ms: 'Perlindungan Kanak-Kanak',
  }],
  ['ID-H925', 6, 1989, {
    zh: '专利', en: 'Patents', vi: 'Sáng chế', th: 'สิทธิบัตร', ms: 'Paten',
  }],
  ['ID-H1577', 7, 1989, {
    zh: '宗教法院', en: 'Religious Courts', vi: 'Tòa án Tôn giáo',
    th: 'ศาลศาสนา', ms: 'Mahkamah Agama',
  }],
  ['ID-H2396', 30, 2004, {
    zh: '公证人职务', en: 'the Notarial Office', vi: 'Chức danh Công chứng viên',
    th: 'ตำแหน่งพนักงานรับรองเอกสาร', ms: 'Jawatan Notari',
  }],
  ['ID-H3381', 4, 2023, {
    zh: '金融部门发展与强化', en: 'the Development and Strengthening of the Financial Sector',
    vi: 'Phát triển và Tăng cường Khu vực Tài chính',
    th: 'การพัฒนาและเสริมสร้างภาคการเงิน', ms: 'Pembangunan dan Pengukuhan Sektor Kewangan',
  }],
  ['ID-H2095', 32, 1997, {
    zh: '商品期货交易', en: 'Commodity Futures Trading', vi: 'Giao dịch Hàng hóa Tương lai',
    th: 'การซื้อขายล่วงหน้าสินค้าโภคภัณฑ์', ms: 'Perdagangan Berjangka Komoditi',
  }],
  ['ID-H2288', 23, 2006, {
    zh: '人口行政', en: 'Population Administration', vi: 'Quản lý Dân cư',
    th: 'การบริหารทะเบียนราษฎร', ms: 'Pentadbiran Kependudukan',
  }],
  ['ID-H2093', 24, 2003, {
    zh: '宪法法院', en: 'the Constitutional Court', vi: 'Tòa án Hiến pháp',
    th: 'ศาลรัฐธรรมนูญ', ms: 'Mahkamah Konstitusi',
  }],
  ['ID-H2392', 13, 2006, {
    zh: '证人与被害人保护', en: 'the Protection of Witnesses and Victims',
    vi: 'Bảo vệ Nhân chứng và Nạn nhân', th: 'การคุ้มครองพยานและผู้เสียหาย',
    ms: 'Perlindungan Saksi dan Mangsa',
  }],
  ['ID-H3246', 5, 1990, {
    zh: '生物自然资源及其生态系统保护',
    en: 'the Conservation of Living Natural Resources and Their Ecosystems',
    vi: 'Bảo tồn Nguồn Tài nguyên Thiên nhiên Sinh vật và Hệ sinh thái của chúng',
    th: 'การอนุรักษ์ทรัพยากรธรรมชาติสิ่งมีชีวิตและระบบนิเวศ',
    ms: 'Pemuliharaan Sumber Daya Alam Hayati dan Ekosistemnya',
  }],
  ['ID-H2092', 22, 2004, {
    zh: '司法委员会', en: 'the Judicial Commission', vi: 'Ủy ban Tư pháp',
    th: 'คณะกรรมการตุลาการ', ms: 'Suruhanjaya Kehakiman',
  }],
  // 标题自带「SEBAGAIMANA TELAH DIUBAH DENGAN UNDANG-UNDANG NOMOR 7 TAHUN 1987」
  ['ID-H924', 6, 1982, {
    zh: '著作权', en: 'Copyright', vi: 'Quyền Tác giả', th: 'ลิขสิทธิ์', ms: 'Hak Cipta',
  }, 7, 1987],
  ['ID-H1894', 15, 1997, {
    zh: '移民安置', en: 'Transmigration', vi: 'Chuyển cư',
    th: 'การย้ายถิ่นฐาน', ms: 'Transmigrasi',
  }],
  ['ID-H2097', 9, 2006, {
    zh: '仓库收据制度', en: 'the Warehouse Receipt System',
    vi: 'Hệ thống Giấy chứng nhận Kho hàng', th: 'ระบบใบรับฝากสินค้าในคลัง',
    ms: 'Sistem Resi Gudang',
  }],
  ['ID-H728', 8, 1983, {
    zh: '货物与服务增值税及奢侈品销售税',
    en: 'the Value Added Tax on Goods and Services and the Sales Tax on Luxury Goods',
    vi: 'Thuế Giá trị Gia tăng đối với Hàng hóa và Dịch vụ và Thuế Bán hàng đối với Hàng hóa Xa xỉ',
    th: 'ภาษีมูลค่าเพิ่มสำหรับสินค้าและบริการและภาษีการขายสินค้าฟุ่มเฟือย',
    ms: 'Cukai Nilai Tambah Barang dan Perkhidmatan serta Cukai Jualan Barang Mewah',
  }],
  ['ID-H2289', 56, 2008, {
    zh: '在西巴布亚省设立坦布拉乌县',
    en: 'the Establishment of Tambrauw Regency in West Papua Province',
    vi: 'Việc Thành lập Huyện Tambrauw tại Tỉnh Papua Barat',
    th: 'การจัดตั้งอำเภอทามเบราในจังหวัดปาปัวตะวันตก',
    ms: 'Pembentukan Kabupaten Tambrauw di Wilayah Papua Barat',
  }],
  ['ID-H2723', 15, 2003, {
    zh: '将2002年第1号《打击恐怖主义犯罪的代替法律的政府条例》定为法律',
    en: 'the Enactment of Government Regulation in Lieu of Law No. 1 of 2002 on Combating Criminal Acts of Terrorism into Law',
    vi: 'Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2002 về Đấu tranh chống Tội phạm Khủng bố thành Luật',
    th: 'การตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2002 ว่าด้วยการปราบปรามอาชญากรรมก่อการร้ายเป็นกฎหมาย',
    ms: 'Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2002 tentang Pemberantasan Tindak Pidana Terorisme menjadi Undang-Undang',
  }],
  ['ID-H1287', 21, 1997, {
    zh: '土地与建筑物取得税', en: 'the Acquisition Duty on Land and Buildings',
    vi: 'Thuế Chuyển nhượng Đất đai và Nhà cửa',
    th: 'ภาษีการได้มาซึ่งที่ดินและอาคาร', ms: 'Duti Perolehan Tanah dan Bangunan',
  }],
  ['ID-H3245', 19, 2006, {
    zh: '总统咨询委员会', en: 'the Presidential Advisory Council',
    vi: 'Hội đồng Cố vấn Tổng thống', th: 'คณะกรรมการที่ปรึกษาประธานาธิบดี',
    ms: 'Dewan Pertimbangan Presiden',
  }],
  // 标题自带「SEBAGAIMANA TELAH DIUBAH DENGAN UNDANG-UNDANG NOMOR 7 TAHUN 1998」
  ['ID-H1147', 3, 1998, {
    zh: '1998/1999财政年度国家收支预算',
    en: 'the State Budget for Fiscal Year 1998/1999',
    vi: 'Ngân sách Nhà nước cho Năm Tài khóa 1998/1999',
    th: 'งบประมาณรายจ่ายประจำปีงบประมาณ 1998/1999',
    ms: 'Belanjawan Pendapatan dan Perbelanjaan Negara Tahun Anggaran 1998/1999',
  }, 7, 1998],
  ['ID-H1990', 22, 2002, {
    zh: '特赦', en: 'Clemency', vi: 'Đặc xá', th: 'การอภัยโทษ', ms: 'Grasi',
  }],
  ['ID-H2815', 1, 1974, {
    zh: '婚姻', en: 'Marriage', vi: 'Hôn nhân', th: 'การสมรส', ms: 'Perkawinan',
  }],
];

const items = {};
for (const [id, no, year, s, ano, ayr] of ROWS) {
  // 号年自校验：标题里第一处「UNDANG-UNDANG NOMOR x TAHUN y」必须与表内一致
  const d = JSON.parse(fs.readFileSync(path.join(LAWDIR, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  const m = orig.match(/UNDANG[-\s]UNDANG\s+NOMOR\s+(\d+)\s+TAHUN\s+(\d{4})/i);
  if (!m) throw new Error(id + ' 标题未匹配到号年：' + orig.slice(0, 80));
  if (Number(m[1]) !== no || Number(m[2]) !== year) {
    throw new Error(id + ' 号年不符：标题 ' + m[1] + '/' + m[2] + ' vs 表 ' + no + '/' + year);
  }
  if (ano) {
    const ma = orig.match(/DIUBAH\s+DENGAN\s+UNDANG[-\s]UNDANG\s+NOMOR\s+(\d+)\s+TAHUN\s+(\d{4})/i);
    if (!ma) throw new Error(id + ' 缺「经修改」从句');
    if (Number(ma[1]) !== ano || Number(ma[2]) !== ayr) {
      throw new Error(id + ' 经修改号年不符：' + ma[1] + '/' + ma[2]);
    }
  }
  const tailZh = ano ? `（经${ayr}年第${ano}号法律修改）` : '';
  const tailEn = ano ? ` as Amended by Law No. ${ano} of ${ayr}` : '';
  const tailVi = ano ? ` đã được sửa đổi bởi Luật số ${ano} năm ${ayr}` : '';
  const tailTh = ano ? ` ซึ่งแก้ไขเพิ่มเติมโดยกฎหมายฉบับที่ ${ano} ปี ${ayr}` : '';
  const tailMs = ano ? ` sebagaimana telah diubah dengan Undang-Undang No. ${ano} Tahun ${ayr}` : '';
  items[id] = {
    zh: `修改${year}年第${no}号关于${s.zh}的法律${tailZh}`,
    en: `Law Amending Law No. ${no} of ${year} on ${s.en}${tailEn}`,
    vi: `Luật Sửa đổi Luật số ${no} năm ${year} về ${s.vi}${tailVi}`,
    th: `พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายฉบับที่ ${no} ปี ${year} ว่าด้วย${s.th}${tailTh}`,
    ms: `Akta Meminda Undang-Undang No. ${no} Tahun ${year} tentang ${s.ms}${tailMs}`,
  };
}

const n = Object.keys(items).length;
if (n !== 23) throw new Error('条目数应为 23，实为 ' + n);

const out = path.join(__dirname, '_id_b33.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b33', items, skip: [] }, null, 2), 'utf8');
console.log('写入 ' + n + ' 条 → ' + out);
