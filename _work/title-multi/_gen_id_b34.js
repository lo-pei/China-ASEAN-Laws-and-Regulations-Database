// b34：ID 长标题族「PAJAK PENGHASILAN ATAS …」（所得税）22 条全收官。
// 该族 22 条此前五语全空，18 种形态，全部为「PAJAK PENGHASILAN ATAS {对象}」。
//
// 句式沿用库内既有 ID-H1196（PAJAK PENGHASILAN ATAS HADIAH UNDIAN）的定型译法：
//   zh  {对象}所得税法
//   en  Law on Income Tax on {对象}
//   vi  Luật về Thuế Thu nhập đối với {对象}
//   th  พระราชบัญญัติว่าด้วยภาษีเงินได้จาก{对象}
//   ms  Akta tentang Cukai Pendapatan atas {对象}
//
// 一条口径：zh 的对象槽不带「所得」二字（否则成「…所得所得税法」）；
// 印尼文里 PENGHASILAN DARI … 的「所得」由「所得税」的「所得」承担，语义不丢。
'use strict';
const fs = require('fs');
const path = require('path');

const FR = (o) => ({
  zh: `${o.zh}所得税法`,
  en: `Law on Income Tax on ${o.en}`,
  vi: `Luật về Thuế Thu nhập đối với ${o.vi}`,
  th: `พระราชบัญญัติว่าด้วยภาษีเงินได้จาก${o.th}`,
  ms: `Akta tentang Cukai Pendapatan atas ${o.ms}`,
});

const OBJ = {
  konstruksi: {
    zh: '建筑业服务业务',
    en: 'Income from Construction Services Business',
    vi: 'Thu nhập từ Hoạt động Kinh doanh Dịch vụ Xây dựng',
    th: 'รายได้จากการประกอบธุรกิจบริการก่อสร้าง',
    ms: 'Pendapatan daripada Perniagaan Perkhidmatan Pembinaan',
  },
  peredaran: {
    zh: '特定营业额纳税人的业务',
    en: 'Income from Business Received or Obtained by Taxpayers with a Certain Gross Turnover',
    vi: 'Thu nhập từ Hoạt động Kinh doanh mà Người nộp thuế có Doanh thu Gộp Nhất định nhận được hoặc thu được',
    th: 'รายได้จากการประกอบธุรกิจที่ผู้เสียภาษีซึ่งมีรายได้รวมหมุนเวียนตามที่กำหนดได้รับหรือได้มา',
    ms: 'Pendapatan daripada Perniagaan yang Diterima atau Diperoleh Pembayar Cukai yang Mempunyai Pusing Ganti Kasar Tertentu',
  },
  deposito: {
    zh: '存款与储蓄利息及印度尼西亚银行存单贴现',
    en: 'Interest on Deposits and Savings and Discount on Bank Indonesia Certificates',
    vi: 'Tiền lãi Tiền gửi và Tiết kiệm cùng Chiết khấu Chứng chỉ Ngân hàng Indonesia',
    th: 'ดอกเบี้ยเงินฝากและเงินออมรวมทั้งส่วนลดของใบรับฝากเงินธนาคารอินโดนีเซีย',
    ms: 'Faedah Deposit dan Simpanan serta Diskaun Sertifikat Bank Indonesia',
  },
  obligasiBursa: {
    zh: '在证券交易所交易的债券',
    en: 'Income from Bonds Traded on the Stock Exchange',
    vi: 'Thu nhập từ Trái phiếu được Giao dịch trên Sở Giao dịch Chứng khoán',
    th: 'รายได้จากพันธบัตรที่ซื้อขายในตลาดหลักทรัพย์',
    ms: 'Pendapatan daripada Bon yang Diperdagangkan di Bursa Saham',
  },
  jamsos: {
    zh: '社会保险管理机构举办的社会保险项目',
    en: 'Social Security Programmes Organised by the Social Security Administering Body',
    vi: 'Chương trình Bảo hiểm Xã hội do Cơ quan Quản lý Bảo hiểm Xã hội tổ chức',
    th: 'โครงการประกันสังคมที่จัดดำเนินการโดยองค์กรบริหารประกันสังคม',
    ms: 'Program Jaminan Sosial yang Dikendalikan oleh Badan Penyelenggara Jaminan Sosial',
  },
  bungaObligasiJual: {
    zh: '在证券交易所出售债券的利息或贴现',
    en: 'Income in the Form of Interest or Discount on Bonds Sold on the Stock Exchange',
    vi: 'Thu nhập dưới Hình thức Tiền lãi hoặc Chiết khấu Trái phiếu được Bán trên Sở Giao dịch Chứng khoán',
    th: 'รายได้ในรูปดอกเบี้ยหรือส่วนลดของพันธบัตรที่ขายในตลาดหลักทรัพย์',
    ms: 'Pendapatan dalam Bentuk Faedah atau Diskaun Bon yang Dijual di Bursa Saham',
  },
  derivatif: {
    zh: '在交易所交易的期货合约形式的衍生交易',
    en: 'Income from Derivative Transactions in the Form of Futures Contracts Traded on an Exchange',
    vi: 'Thu nhập từ Giao dịch Phái sinh dưới Hình thức Hợp đồng Tương lai được Giao dịch trên Sở Giao dịch',
    th: 'รายได้จากธุรกรรมอนุพันธ์ในรูปสัญญาซื้อขายล่วงหน้าซึ่งซื้อขายในตลาด',
    ms: 'Pendapatan daripada Transaksi Derivatif dalam Bentuk Kontrak Niaga Hadapan yang Diperdagangkan di Bursa',
  },
  sahamBursa: {
    zh: '证券交易所股票出售交易',
    en: 'Income from Share Sale Transactions on the Stock Exchange',
    vi: 'Thu nhập từ Giao dịch Bán Cổ phiếu trên Sở Giao dịch Chứng khoán',
    th: 'รายได้จากธุรกรรมการขายหุ้นในตลาดหลักทรัพย์',
    ms: 'Pendapatan daripada Transaksi Jualan Saham di Bursa Saham',
  },
  upahMinimum: {
    zh: '不超过省或县/市最低工资的劳动者工资',
    en: 'Income Received by Workers up to the Provincial Minimum Wage or Regency/City Minimum Wage',
    vi: 'Thu nhập mà Người lao động nhận được đến mức Tiền lương Tối thiểu Cấp tỉnh hoặc Tiền lương Tối thiểu Cấp huyện/thành phố',
    th: 'รายได้ที่ลูกจ้างได้รับไม่เกินค่าจ้างขั้นต่ำระดับจังหวัดหรือค่าจ้างขั้นต่ำระดับอำเภอ/เทศบาล',
    ms: 'Pendapatan yang Diterima oleh Pekerja sehingga Setinggi Upah Minimum Wilayah atau Upah Minimum Kabupaten/Bandar',
  },
  bungaKoperasi: {
    zh: '合作社向自然人社员支付的储蓄利息',
    en: 'Interest on Savings Paid by Cooperatives to Individual Members of Cooperatives',
    vi: 'Tiền lãi Tiền gửi do Hợp tác xã Trả cho Thành viên Hợp tác xã là Cá nhân',
    th: 'ดอกเบี้ยเงินออมที่สหกรณ์จ่ายให้แก่สมาชิกสหกรณ์ที่เป็นบุคคลธรรมดา',
    ms: 'Faedah Simpanan yang Dibayar oleh Koperasi kepada Anggota Koperasi Orang Persendirian',
  },
  dividen: {
    zh: '国内自然人纳税人取得或收到的股息',
    en: 'Dividends Received or Obtained by Domestic Individual Taxpayers',
    vi: 'Cổ tức mà Người nộp thuế Cá nhân Trong nước nhận được hoặc thu được',
    th: 'เงินปันผลที่ผู้เสียภาษีบุคคลธรรมดาในประเทศได้รับหรือได้มา',
    ms: 'Dividen yang Diterima atau Diperoleh Pembayar Cukai Orang Persendirian Dalam Negeri',
  },
  bungaObligasiDN: {
    zh: '国内纳税人与常设机构取得或收到的债券利息',
    en: 'Income in the Form of Bond Interest Received or Obtained by Domestic Taxpayers and Permanent Establishments',
    vi: 'Thu nhập dưới Hình thức Tiền lãi Trái phiếu mà Người nộp thuế Trong nước và Cơ sở Thường trú nhận được hoặc thu được',
    th: 'รายได้ในรูปดอกเบี้ยพันธบัตรที่ผู้เสียภาษีในประเทศและสถานประกอบการถาวรได้รับหรือได้มา',
    ms: 'Pendapatan dalam Bentuk Faedah Bon yang Diterima atau Diperoleh Pembayar Cukai Dalam Negeri dan Bentuk Usaha Tetap',
  },
  modalVentura: {
    zh: '风险投资公司出售股份或转让合伙公司出资的交易',
    en: 'Income of Venture Capital Companies from Share Sale Transactions or Transfers of Capital Participation in Their Partner Companies',
    vi: 'Thu nhập của Công ty Đầu tư Mạo hiểm từ Giao dịch Bán Cổ phiếu hoặc Chuyển nhượng Vốn góp tại Công ty Đối tác của mình',
    th: 'รายได้ของบริษัทร่วมทุนเสี่ยงจากธุรกรรมการขายหุ้นหรือการโอนการร่วมทุนในบริษัทคู่ค้าของตน',
    ms: 'Pendapatan Syarikat Modal Teroka daripada Transaksi Jualan Saham atau Pemindahan Penyertaan Modal dalam Syarikat Rakan Usahanya',
  },
  konstruksiKonsultan: {
    zh: '建筑业服务与咨询服务业务',
    en: 'Income from Construction Services and Consultancy Services Business',
    vi: 'Thu nhập từ Hoạt động Kinh doanh Dịch vụ Xây dựng và Dịch vụ Tư vấn',
    th: 'รายได้จากการประกอบธุรกิจบริการก่อสร้างและบริการที่ปรึกษา',
    ms: 'Pendapatan daripada Perniagaan Perkhidmatan Pembinaan dan Perkhidmatan Perunding',
  },
  industriTertentu: {
    zh: '特定工业业务的法人纳税人',
    en: 'Income of Corporate Taxpayers from Certain Industrial Businesses',
    vi: 'Thu nhập của Người nộp thuế Pháp nhân từ Hoạt động Kinh doanh Công nghiệp Nhất định',
    th: 'รายได้ของผู้เสียภาษีนิติบุคคลจากธุรกิจอุตสาหกรรมบางประเภท',
    ms: 'Pendapatan Pembayar Cukai Badan bagi Perniagaan Industri Tertentu',
  },
  sewaTanah: {
    zh: '土地和/或建筑物租赁',
    en: 'Income from the Rental of Land and/or Buildings',
    vi: 'Thu nhập từ Việc Cho thuê Đất và/hoặc Nhà cửa',
    th: 'รายได้จากการให้เช่าที่ดินและ/หรืออาคาร',
    ms: 'Pendapatan daripada Penyewaan Tanah dan/atau Bangunan',
  },
  realEstat: {
    zh: '特定集体投资合约计划下的不动产转让',
    en: 'Income from the Transfer of Real Estate under Certain Collective Investment Contract Schemes',
    vi: 'Thu nhập từ Việc Chuyển nhượng Bất động sản theo Mô hình Hợp đồng Đầu tư Tập thể Nhất định',
    th: 'รายได้จากการโอนอสังหาริมทรัพย์ภายใต้รูปแบบสัญญาการลงทุนร่วมบางประเภท',
    ms: 'Pendapatan daripada Pemindahan Hartanah dalam Skim Kontrak Pelaburan Kolektif Tertentu',
  },
  depositoBerjangka: {
    zh: '定期存款、印度尼西亚银行存单、存款凭证与储蓄的利息',
    en: 'Interest on Time Deposits, Bank Indonesia Certificates, Deposit Certificates and Savings',
    vi: 'Tiền lãi Tiền gửi Có kỳ hạn, Chứng chỉ Ngân hàng Indonesia, Chứng chỉ Tiền gửi và Tiết kiệm',
    th: 'ดอกเบี้ยเงินฝากประจำ ใบรับฝากเงินธนาคารอินโดนีเซีย ใบรับฝากเงิน และเงินออม',
    ms: 'Faedah Deposit Bertempoh, Sertifikat Bank Indonesia, Sertifikat Deposit dan Simpanan',
  },
};

const MAP = {
  konstruksi: ['ID-H1733', 'ID-H1198'],
  peredaran: ['ID-H2235', 'ID-H2703'],
  deposito: ['ID-H683', 'ID-H1195'],
  obligasiBursa: ['ID-H1197'],
  jamsos: ['ID-H2550'],
  bungaObligasiJual: ['ID-H802'],
  derivatif: ['ID-H1856'],
  sahamBursa: ['ID-H685'],
  upahMinimum: ['ID-H1344', 'ID-H881'],
  bungaKoperasi: ['ID-H1853'],
  dividen: ['ID-H1854'],
  bungaObligasiDN: ['ID-H2976'],
  modalVentura: ['ID-H745'],
  konstruksiKonsultan: ['ID-H803'],
  industriTertentu: ['ID-H804'],
  sewaTanah: ['ID-H2621'],
  realEstat: ['ID-H2549'],
  depositoBerjangka: ['ID-H490'],
};

const items = {};
for (const [k, ids] of Object.entries(MAP)) {
  const t = FR(OBJ[k]);
  for (const id of ids) items[id] = { ...t };
}

const n = Object.keys(items).length;
if (n !== 22) throw new Error('条目数应为 22，实为 ' + n);
for (const [id, t] of Object.entries(items)) {
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!String(t[k] || '').trim()) throw new Error(id + ' 缺 ' + k);
  }
}

const out = path.join(__dirname, '_id_b34.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b34', items, skip: [] }, null, 2), 'utf8');
console.log('写入 ' + n + ' 条 → ' + out);
