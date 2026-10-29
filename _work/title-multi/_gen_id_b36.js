// b36：ID 长标题族「PERUBAHAN KETIGA ATAS …」（第三次修改）17 条全收官。
// 该族 17 条此前五语全空。与 b24–b26（第二次修改）、b33（修改法律）同源，只多一层序数。
//
// 被修改的文书有三类，须分别取词：
//   UNDANG-UNDANG            → 法律 / Law / Luật / กฎหมาย / Undang-Undang
//   PERATURAN PEMERINTAH     → 政府条例 / Government Regulation / Quy định của Chính phủ /
//                              กฎระเบียบรัฐบาล / Peraturan Pemerintah
//   PERATURAN MENTERI PERDAGANGAN → 贸易部长条例 / the Minister of Trade Regulation /
//                              Quy định của Bộ trưởng Thương mại / กฎระเบียบรัฐมนตรีว่าการกระทรวงพาณิชย์ /
//                              Peraturan Menteri Perdagangan
//
// 两条口径：
//   ① 5 条 Permendag 的刊号为 M-DAGPER 编码串（30M-DAGPER52017 等），不可拆年/号，
//      沿 b24 口径只写主题、不写号年；另 2 条（84/2019、24/2018）有正式号年，照写。
//   ② 5 条标题在 110 字符处被 OCR 截断，主题按正文补齐：
//      ID-H2747 Produk Hortikultura（Pasal 1 定义条）、ID-H2748 Besi atau Baja（同）、
//      ID-H2842 Bahan Berbahaya（正文引称「…tentang Pengadaan, Distribusi dan Pengawasan
//      Bahan Berbahaya」）、ID-H2937 Limbah Non Bahan Berbahaya dan Beracun（附录 II 页眉全称）、
//      ID-H2938 Surat Keterangan Asal（Pasal 1 定义条）。
'use strict';
const fs = require('fs');
const path = require('path');

const INS = {
  uu: { zh: '法律', en: 'Law', vi: 'Luật', th: 'กฎหมาย', ms: 'Undang-Undang' },
  pp: { zh: '政府条例', en: 'Government Regulation', vi: 'Quy định của Chính phủ', th: 'กฎระเบียบรัฐบาล', ms: 'Peraturan Pemerintah' },
  permendag: { zh: '贸易部长条例', en: 'the Minister of Trade Regulation', vi: 'Quy định của Bộ trưởng Thương mại', th: 'กฎระเบียบรัฐมนตรีว่าการกระทรวงพาณิชย์', ms: 'Peraturan Menteri Perdagangan' },
};

// no 为 null 时（M-DAGPER 编码串）不写号年
function FR(kind, no, year, s) {
  const i = INS[kind];
  const id = no ? `${year}年第${no}号` : '';
  const idEn = no ? ` No. ${no} of ${year}` : '';
  const idVi = no ? ` số ${no} năm ${year}` : '';
  const idTh = no ? `ฉบับที่ ${no} ปี ${year}` : '';
  const idMs = no ? ` No. ${no} Tahun ${year}` : '';
  return {
    zh: `第三次修改${id}关于${s.zh}的${i.zh}`,
    en: `Law Amending for the Third Time ${i.en}${idEn} on ${s.en}`,
    vi: `Luật Sửa đổi lần thứ ba ${i.vi}${idVi} về ${s.vi}`,
    th: `พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สาม${i.th}${idTh} ว่าด้วย${s.th}`,
    ms: `Akta Meminda bagi Kali Ketiga ${i.ms}${idMs} tentang ${s.ms}`,
  };
}

// [id, 文书类型, 号, 年, 主题]
const ROWS = [
  ['ID-H3330', 'uu', 8, 2019, {
    zh: '朝觐与副朝功修的举办',
    en: 'the Organisation of the Hajj and Umrah Pilgrimage',
    vi: 'Việc Tổ chức Hành hương Haji và Umrah',
    th: 'การจัดดำเนินการประกอบพิธีฮัจญ์และอุมเราะห์',
    ms: 'Pengendalian Ibadah Haji dan Umrah',
  }],
  ['ID-H1809', 'pp', 6, 2005, {
    zh: '地方首脑与副地方首脑的选举、任命批准与免职',
    en: 'the Election, Ratification of Appointment and Dismissal of Regional Heads and Deputy Regional Heads',
    vi: 'Việc Bầu cử, Phê chuẩn Bổ nhiệm và Miễn nhiệm Người đứng đầu Địa phương và Phó Người đứng đầu Địa phương',
    th: 'การเลือกตั้ง การรับรองการแต่งตั้ง และการถอดถอนหัวหน้าท้องถิ่นและรองหัวหน้าท้องถิ่น',
    ms: 'Pemilihan, Pengesahan Pelantikan dan Pemberhentian Ketua Daerah dan Timbalan Ketua Daerah',
  }],
  ['ID-H2747', 'permendag', null, null, {
    zh: '园艺产品进口',
    en: 'the Provisions on the Import of Horticultural Products',
    vi: 'Quy định Nhập khẩu Sản phẩm Rau quả',
    th: 'ข้อกำหนดการนำเข้าผลิตภัณฑ์พืชสวน',
    ms: 'Ketentuan Import Produk Hortikultura',
  }],
  ['ID-H2748', 'permendag', null, null, {
    zh: '钢铁进口',
    en: 'the Provisions on the Import of Iron or Steel',
    vi: 'Quy định Nhập khẩu Sắt hoặc Thép',
    th: 'ข้อกำหนดการนำเข้าเหล็กหรือเหล็กกล้า',
    ms: 'Ketentuan Import Besi atau Baja',
  }],
  ['ID-H2912', 'uu', 24, 2003, {
    zh: '宪法法院', en: 'the Constitutional Court', vi: 'Tòa án Hiến pháp',
    th: 'ศาลรัฐธรรมนูญ', ms: 'Mahkamah Konstitusi',
  }],
  ['ID-H1899', 'uu', 8, 1983, {
    zh: '货物与服务增值税及奢侈品销售税',
    en: 'the Value Added Tax on Goods and Services and the Sales Tax on Luxury Goods',
    vi: 'Thuế Giá trị Gia tăng đối với Hàng hóa và Dịch vụ và Thuế Bán hàng đối với Hàng hóa Xa xỉ',
    th: 'ภาษีมูลค่าเพิ่มสำหรับสินค้าและบริการและภาษีการขายสินค้าฟุ่มเฟือย',
    ms: 'Cukai Nilai Tambah Barang dan Perkhidmatan serta Cukai Jualan Barang Mewah',
  }],
  ['ID-H2842', 'permendag', null, null, {
    zh: '危险材料的采购、分销与监督',
    en: 'the Procurement, Distribution and Supervision of Hazardous Materials',
    vi: 'Việc Mua sắm, Phân phối và Giám sát Vật liệu Nguy hiểm',
    th: 'การจัดซื้อ การจำหน่าย และการกำกับดูแลวัสดุอันตราย',
    ms: 'Perolehan, Pengagihan dan Penyeliaan Bahan Berbahaya',
  }],
  ['ID-H2937', 'permendag', 84, 2019, {
    zh: '非危险及有毒废物进口',
    en: 'the Provisions on the Import of Non-Hazardous and Non-Toxic Waste',
    vi: 'Quy định Nhập khẩu Chất thải Không Nguy hiểm và Không Độc hại',
    th: 'ข้อกำหนดการนำเข้าของเสียที่ไม่เป็นอันตรายและไม่มีพิษ',
    ms: 'Ketentuan Import Sisa Bukan Bahan Berbahaya dan Beracun',
  }],
  ['ID-H3249', 'pp', 94, 2012, {
    zh: '最高法院下属法官的财务权利与便利',
    en: 'the Financial Rights and Facilities of Judges under the Supreme Court',
    vi: 'Quyền Tài chính và Các Tiện nghi của Thẩm phán trực thuộc Tòa án Tối cao',
    th: 'สิทธิทางการเงินและสิ่งอำนวยความสะดวกของผู้พิพากษาในสังกัดศาลฎีกา',
    ms: 'Hak Kewangan dan Kemudahan Hakim di Bawah Mahkamah Agung',
  }],
  ['ID-H1291', 'pp', 17, 1999, {
    zh: '国家银行重组机构',
    en: 'the National Banking Restructuring Agency',
    vi: 'Cơ quan Tái cơ cấu Ngân hàng Quốc gia',
    th: 'องค์การปรับโครงสร้างธนาคารแห่งชาติ',
    ms: 'Badan Penyehatan Perbankan Nasional',
  }],
  ['ID-H1808', 'pp', 48, 1994, {
    zh: '土地和/或建筑物权利转让所得的所得税缴纳',
    en: 'the Payment of Income Tax on Income from the Transfer of Rights over Land and/or Buildings',
    vi: 'Việc Nộp Thuế Thu nhập đối với Thu nhập từ Chuyển nhượng Quyền Đối với Đất đai và/hoặc Nhà cửa',
    th: 'การชำระภาษีเงินได้จากรายได้จากการโอนสิทธิในที่ดินและ/หรืออาคาร',
    ms: 'Pembayaran Cukai Pendapatan atas Pendapatan daripada Pemindahan Hak atas Tanah dan/atau Bangunan',
  }],
  ['ID-H2820', 'pp', 19, 2016, {
    zh: '向公务员、国民军军人、国家警察成员、国家官员及养老金或津贴领取人发放工资、养老金或第十三个月津贴',
    en: 'the Granting of Salaries, Pensions or Thirteenth-Month Allowances to Civil Servants, Indonesian National Armed Forces Personnel, Indonesian National Police Personnel, State Officials and Recipients of Pensions or Allowances',
    vi: 'Việc Cấp Lương, Lương hưu hoặc Phụ cấp Tháng thứ mười ba cho Công chức, Quân nhân Lực lượng Vũ trang Quốc gia Indonesia, Thành viên Cảnh sát Quốc gia Indonesia, Quan chức Nhà nước và Người nhận Lương hưu hoặc Phụ cấp',
    th: 'การจ่ายเงินเดือน บำนาญ หรือเงินช่วยเหลือเดือนที่สิบสามให้แก่ข้าราชการ ทหารกองทัพแห่งชาติอินโดนีเซีย เจ้าหน้าที่ตำรวจแห่งชาติอินโดนีเซีย เจ้าหน้าที่รัฐ และผู้รับบำนาญหรือเงินช่วยเหลือ',
    ms: 'Pemberian Gaji, Pencen atau Elaun Bulan Ketiga Belas kepada Pegawai Negeri Sipil, Anggota Tentera Nasional Indonesia, Anggota Polis Negara Republik Indonesia, Pegawai Negara dan Penerima Pencen atau Elaun',
  }],
  ['ID-H2938', 'permendag', 24, 2018, {
    zh: '原产地证书签发的条件与程序',
    en: 'the Requirements and Procedures for the Issuance of Certificates of Origin',
    vi: 'Các Điều kiện và Thủ tục Cấp Giấy chứng nhận Xuất xứ',
    th: 'เงื่อนไขและขั้นตอนการออกหนังสือรับรองถิ่นกำเนิดสินค้า',
    ms: 'Syarat dan Tatacara Pengeluaran Surat Keterangan Asal',
  }],
  ['ID-H1690', 'pp', 12, 2001, {
    zh: '进口和/或交付免征增值税的特定战略性应税货物',
    en: 'the Import and/or Delivery of Certain Strategic Taxable Goods Exempt from Value Added Tax',
    vi: 'Việc Nhập khẩu và/hoặc Giao Hàng hóa Chịu thuế Nhất định mang Tính chiến lược được Miễn Thuế Giá trị Gia tăng',
    th: 'การนำเข้าและ/หรือการส่งมอบสินค้าที่ต้องเสียภาษีบางประเภทที่มีลักษณะเชิงยุทธศาสตร์ซึ่งได้รับการยกเว้นภาษีมูลค่าเพิ่ม',
    ms: 'Import dan/atau Penyerahan Barang Kena Cukai Tertentu yang Bersifat Strategik yang Dikecualikan daripada Pengenaan Cukai Nilai Tambah',
  }],
  ['ID-H2590', 'pp', 55, 2014, {
    zh: '最高法院法官与宪法法院法官的财务权利与便利',
    en: 'the Financial Rights and Facilities of Supreme Court Judges and Constitutional Court Judges',
    vi: 'Quyền Tài chính và Các Tiện nghi của Thẩm phán Tòa án Tối cao và Thẩm phán Tòa án Hiến pháp',
    th: 'สิทธิทางการเงินและสิ่งอำนวยความสะดวกของผู้พิพากษาศาลฎีกาและผู้พิพากษาศาลรัฐธรรมนูญ',
    ms: 'Hak Kewangan dan Kemudahan Hakim Mahkamah Agung dan Hakim Mahkamah Konstitusi',
  }],
  ['ID-H2650', 'pp', 15, 2005, {
    zh: '收费公路', en: 'Toll Roads', vi: 'Đường cao tốc có thu phí',
    th: 'ทางด่วนที่เก็บค่าผ่านทาง', ms: 'Lebuh Raya Bertol',
  }],
  ['ID-H3386', 'pp', 36, 2023, {
    zh: '自然资源开发、管理与/或加工活动出口所得外汇',
    en: 'Export Proceeds from Natural Resource Exploration, Management and/or Processing Activities',
    vi: 'Ngoại tệ từ Xuất khẩu của Hoạt động Khai thác, Quản lý và/hoặc Chế biến Tài nguyên Thiên nhiên',
    th: 'เงินตราต่างประเทศจากผลการส่งออกของกิจกรรมการประกอบการ การจัดการ และ/หรือการแปรรูปทรัพยากรธรรมชาติ',
    ms: 'Devisa Hasil Eksport daripada Aktiviti Pengusahaan, Pengurusan dan/atau Pemprosesan Sumber Asli',
  }],
];

const items = {};
const over = [];
for (const [id, kind, no, year, s] of ROWS) {
  const t = FR(kind, no, year, s);
  items[id] = t;
  for (const [k, v] of Object.entries(t)) if (v.length > 300) over.push(id + '/' + k + '=' + v.length);
}
const n = Object.keys(items).length;
if (n !== 17) throw new Error('条目数应为 17，实为 ' + n);
if (over.length) throw new Error('超长（>300）：' + over.join(', '));

const out = path.join(__dirname, '_id_b36.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b36', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
