// b31：ID 长标题族「PENYERTAAN MODAL NEGARA REPUBLIK INDONESIA …」（国家资本参与）27 条全收官。
// 该族 27 条此前 zh/en/vi/th/ms 五语全空，本批首次成篇。
//
// 四种句框（由标题本身决定，不跨框混用）：
//   named  —— UNTUK PENDIRIAN PERUSAHAAN PERSEROAN (PERSERO) {具名公司}
//   sector —— UNTUK PENDIRIAN PERUSAHAAN PERSEROAN (PERSERO) {领域}
//   ltd    —— UNTUK PENDIRIAN PERSEROAN TERBATAS DALAM BIDANG {领域}（PT，非 PERSERO）
//   into   —— KE DALAM MODAL / PADA {具名实体}
//
// 三条口径：
//   ① 印尼企业 zh 用中文名、en/vi/th/ms 保留拉丁原名；国际机构四语全本地化（AIIB/IDB/CGIF/AIF）。
//   ② 标题在 110 字符处被 OCR 截断的，按 Pasal 1 逐条还原领域，不猜。
//   ③ 银行多主体名单（8/10/12 家）按「具名首户 + 等 N 家」缩写，不逐家转写公司名。
'use strict';
const fs = require('fs');
const path = require('path');

const F = {
  // 设立具名公营有限公司（PERSERO）
  named: (o) => ({
    zh: `为设立${o.cn}公营有限公司（PERSERO）而进行国家资本参与法`,
    en: `Law on State Capital Participation for the Establishment of the State-Owned Limited Liability Company (PERSERO) ${o.lat}`,
    vi: `Luật về Việc Góp Vốn Nhà nước để Thành lập Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO) ${o.lat}`,
    th: `พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้งบริษัทจำกัดของรัฐ (PERSERO) ${o.lat}`,
    ms: `Akta tentang Penyertaan Modal Negara untuk Pendirian Syarikat Sendirian Berhad Milik Negara (PERSERO) ${o.lat}`,
  }),
  // 设立经营某领域的公营有限公司（PERSERO）
  sector: (o) => ({
    zh: o.zhFull || `为设立经营${o.cn}的公营有限公司（PERSERO）而进行国家资本参与法`,
    en: `Law on State Capital Participation for the Establishment of a State-Owned Limited Liability Company (PERSERO) Engaged in ${o.en}`,
    vi: `Luật về Việc Góp Vốn Nhà nước để Thành lập Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO) hoạt động trong lĩnh vực ${o.vi}`,
    th: `พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้งบริษัทจำกัดของรัฐ (PERSERO) ที่ประกอบธุรกิจด้าน${o.th}`,
    ms: `Akta tentang Penyertaan Modal Negara untuk Pendirian Syarikat Sendirian Berhad Milik Negara (PERSERO) yang menjalankan usaha dalam bidang ${o.ms}`,
  }),
  // 设立有限责任公司（PERSEROAN TERBATAS，非 PERSERO）
  ltd: (o) => ({
    zh: `为设立经营${o.cn}的有限责任公司而进行国家资本参与法`,
    en: `Law on State Capital Participation for the Establishment of a Limited Liability Company Engaged in ${o.en}`,
    vi: `Luật về Việc Góp Vốn Nhà nước để Thành lập Công ty Trách nhiệm Hữu hạn hoạt động trong lĩnh vực ${o.vi}`,
    th: `พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้งบริษัทจำกัดที่ประกอบธุรกิจด้าน${o.th}`,
    ms: `Akta tentang Penyertaan Modal Negara untuk Pendirian Syarikat Sendirian Berhad yang menjalankan usaha dalam bidang ${o.ms}`,
  }),
  // 向某具名实体出资
  into: (o) => ({
    zh: `向${o.cn}进行国家资本参与法`,
    en: `Law on State Capital Participation in ${o.lat}`,
    vi: `Luật về Việc Góp Vốn Nhà nước vào ${o.lat}`,
    th: `พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐใน ${o.lat}`,
    ms: `Akta tentang Penyertaan Modal Negara dalam ${o.lat}`,
  }),
};

const ROWS = [
  // —— named：设立具名公营公司 ——
  ['ID-H539', 'named', { cn: '第三十二种植园', lat: 'PT Perkebunan XXXII' }],
  ['ID-H850', 'named', { cn: '第十三努山塔拉种植园', lat: 'PT Perkebunan Nusantara XIII' }],

  // —— sector：设立某领域公营公司（标题截断处均按 Pasal 1 还原） ——
  // Pasal 1: dalam bidang pengusahaan hutan di Sumatera Bagian Utara
  ['ID-H537', 'sector', {
    cn: '北苏门答腊地区森林业',
    en: 'Forestry in Northern Sumatra',
    vi: 'lâm nghiệp tại Bắc Sumatra',
    th: 'การทำป่าไม้ในภาคเหนือของเกาะสุมาตรา',
    ms: 'perusahaan hutan di Sumatera Bahagian Utara',
  }],
  // Pasal 1: bidang usaha elektroteknika profesional dan komponen
  ['ID-H538', 'sector', {
    cn: '专业电工技术与元件',
    en: 'Professional Electrotechnics and Components',
    vi: 'kỹ thuật điện chuyên nghiệp và linh kiện',
    th: 'วิศวกรรมไฟฟ้าอาชีพและชิ้นส่วน',
    ms: 'elektroteknik profesional dan komponen',
  }],
  // Pasal 1: dalam bidang nuklir
  ['ID-H849', 'sector', {
    zhFull: '为设立核能领域的公营有限公司（PERSERO）而进行国家资本参与法',
    cn: '核能',
    en: 'Nuclear Energy',
    vi: 'năng lượng hạt nhân',
    th: 'พลังงานนิวเคลียร์',
    ms: 'tenaga nuklear',
  }],
  // Pasal 1: yang bergerak di bidang industri（标题本身只到「INDUSTRI」，不增写行业）
  ['ID-H984', 'sector', {
    zhFull: '为设立工业领域的公营有限公司（PERSERO）而进行国家资本参与法',
    cn: '工业',
    en: 'Industry',
    vi: 'công nghiệp',
    th: 'อุตสาหกรรม',
    ms: 'industri',
  }],
  // Pasal 1: di bidang pengelolaan kekayaan
  ['ID-H985', 'sector', {
    cn: '资产管理',
    en: 'Asset Management',
    vi: 'quản lý tài sản',
    th: 'การจัดการสินทรัพย์',
    ms: 'pengurusan aset',
  }],
  // Pasal 1: di bidang penjaminan infrastruktur
  ['ID-H1884', 'sector', {
    cn: '基础设施担保',
    en: 'Infrastructure Guarantee',
    vi: 'bảo lãnh cơ sở hạ tầng',
    th: 'การค้ำประกันโครงสร้างพื้นฐาน',
    ms: 'jaminan infrastruktur',
  }],
  // Pasal 1: di Bidang Pertambangan
  ['ID-H3083', 'sector', {
    cn: '矿业',
    en: 'Mining',
    vi: 'khai khoáng',
    th: 'การทำเหมืองแร่',
    ms: 'perlombongan',
  }],
  // Pasal 1: di bidang pembiayaan infrastruktur
  ['ID-H1677', 'sector', {
    cn: '基础设施融资',
    en: 'Infrastructure Financing',
    vi: 'tài trợ cơ sở hạ tầng',
    th: 'การจัดหาเงินทุนโครงสร้างพื้นฐาน',
    ms: 'pembiayaan infrastruktur',
  }],

  // —— ltd：设立有限责任公司 ——
  // Pasal 1: jasa pemeriksaan pra-pengapalan barang-barang impor Indonesia di luar negeri
  ['ID-H536', 'ltd', {
    cn: '印尼进口货物在境外的装运前检验服务',
    en: 'Pre-Shipment Inspection Services for Indonesian Imported Goods Abroad',
    vi: 'dịch vụ giám định trước khi xếp hàng đối với hàng hóa nhập khẩu của Indonesia ở nước ngoài',
    th: 'การตรวจสอบสินค้านำเข้าของอินโดนีเซียก่อนการขนส่งในต่างประเทศ',
    ms: 'perkhidmatan pemeriksaan pra-penghantaran bagi barangan import Indonesia di luar negara',
  }],
  // Pasal 1: jasa pengolahan limbah industri bahan berbahaya dan beracun di Cileungsi - Bogor, Jawa Barat
  ['ID-H663', 'ltd', {
    cn: '西爪哇省茂物县芝勒翁西的危险及有毒工业废料处理服务',
    en: 'Hazardous and Toxic Industrial Waste Treatment Services in Cileungsi, Bogor, West Java',
    vi: 'dịch vụ xử lý chất thải công nghiệp nguy hại và độc hại tại Cileungsi, Bogor, Tây Java',
    th: 'การบำบัดของเสียอุตสาหกรรมอันตรายและมีพิษในเมืองชีเลืองซี โบกอร์ ชวาตะวันตก',
    ms: 'perkhidmatan rawatan sisa industri berbahaya dan toksik di Cileungsi, Bogor, Jawa Barat',
  }],
  // Pasal 1: bidang usaha kawasan industri di Propinsi Lampung
  ['ID-H851', 'ltd', {
    cn: '楠榜省工业园区',
    en: 'Industrial Estates in Lampung Province',
    vi: 'khu công nghiệp tại tỉnh Lampung',
    th: 'นิคมอุตสาหกรรมในจังหวัดลัมปุง',
    ms: 'kawasan industri di Wilayah Lampung',
  }],

  // —— into：向具名实体出资 ——
  ['ID-H662', 'into', { cn: '永恒能源保护公司', lat: 'PT Konservasi Energi Abadi (PT KONEBA)' }],
  ['ID-H721', 'into', { cn: '合作社大众银行有限公司', lat: 'PT Bank Bukopin' }],
  ['ID-H2383', 'into', { cn: '国际橡胶联盟有限公司', lat: 'International Rubber Consortium Limited' }],
  ['ID-H2278', 'into', { cn: '国际橡胶联盟有限公司', lat: 'International Rubber Consortium Limited' }],
];

/* 以下 5 条句框不规整，逐条写全，避免套框出错 */
const EXTRA = {
  // 为将 Merpati 改制为 PERSERO 而出资（Pasal 1 只讲注资，改制写在标题）
  'ID-H914': {
    zh: '为将努山塔拉鸽航空公司改制为公营有限公司而进行国家资本参与法',
    en: 'Law on State Capital Participation for the Conversion of PT Merpati Nusantara Airlines into a State-Owned Limited Liability Company (PERSERO)',
    vi: 'Luật về Việc Góp Vốn Nhà nước nhằm Chuyển đổi PT Merpati Nusantara Airlines thành Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO)',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อเปลี่ยนรูปแบบ PT Merpati Nusantara Airlines เป็นบริษัทจำกัดของรัฐ (PERSERO)',
    ms: 'Akta tentang Penyertaan Modal Negara bagi Pengalihan Bentuk PT Merpati Nusantara Airlines menjadi Syarikat Sendirian Berhad Milik Negara (PERSERO)',
  },
  // 为发展合作社与中小企业设立 PNM（Pasal 1 给出公司名 PT Permodalan Nasional Madani）
  'ID-H1133': {
    zh: '为发展合作社及中小型企业设立国家资本投资公营有限公司（PERSERO）而进行国家资本参与法',
    en: 'Law on State Capital Participation for the Establishment of the State-Owned Limited Liability Company (PERSERO) PT Permodalan Nasional Madani to Develop Cooperatives and Small and Medium Enterprises',
    vi: 'Luật về Việc Góp Vốn Nhà nước để Thành lập PT Permodalan Nasional Madani (PERSERO) nhằm Phát triển Hợp tác xã và Doanh nghiệp Nhỏ và Vừa',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้ง PT Permodalan Nasional Madani (PERSERO) เพื่อพัฒนาสหกรณ์และวิสาหกิจขนาดกลางและขนาดย่อม',
    ms: 'Akta tentang Penyertaan Modal Negara untuk Pendirian PT Permodalan Nasional Madani (PERSERO) bagi Pembangunan Koperasi serta Perusahaan Kecil dan Sederhana',
  },
  // 8 家商业银行（Pasal 1 点得清：Lippo、BII、Bali、Bukopin、Universal、Prima Express、Arta Media、Patriot）
  'ID-H1131': {
    zh: '向印尼力宝银行等 8 家商业银行进行国家资本参与法',
    en: 'Law on State Capital Participation in PT Bank Lippo Tbk. and Seven Other Commercial Banks',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào PT Bank Lippo Tbk. và bảy ngân hàng thương mại khác',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐใน PT Bank Lippo Tbk. และธนาคารพาณิชย์อื่นอีกเจ็ดแห่ง',
    ms: 'Akta tentang Penyertaan Modal Negara dalam PT Bank Lippo Tbk. dan Tujuh Bank Perdagangan Lain',
  },
  // 12 家银行（10 家地方建设银行 + Bank Lippo + Bank Sembada Artanugroho）
  'ID-H1130': {
    zh: '向亚齐特区地方建设银行等 12 家银行进行国家资本参与法',
    en: 'Law on State Capital Participation in Bank Pembangunan Daerah Daerah Istimewa Aceh and Eleven Other Banks',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào Bank Pembangunan Daerah Daerah Istimewa Aceh và mười một ngân hàng khác',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐใน Bank Pembangunan Daerah Daerah Istimewa Aceh และธนาคารอื่นอีกสิบเอ็ดแห่ง',
    ms: 'Akta tentang Penyertaan Modal Negara dalam Bank Pembangunan Daerah Daerah Istimewa Aceh dan Sebelas Bank Lain',
  },
  // 10 家地方建设银行（亚齐、苏北、明古鲁、楠榜、雅加达、中爪哇、东爪哇、西加、西努、东努）
  'ID-H1132': {
    zh: '向亚齐特区地方建设银行等 10 家地方建设银行进行国家资本参与法',
    en: 'Law on State Capital Participation in Bank Pembangunan Daerah Daerah Istimewa Aceh and Nine Other Regional Development Banks',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào Bank Pembangunan Daerah Daerah Istimewa Aceh và chín ngân hàng phát triển vùng khác',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐใน Bank Pembangunan Daerah Daerah Istimewa Aceh และธนาคารพัฒนาภูมิภาคอื่นอีกเก้าแห่ง',
    ms: 'Akta tentang Penyertaan Modal Negara dalam Bank Pembangunan Daerah Daerah Istimewa Aceh dan Sembilan Bank Pembangunan Daerah Lain',
  },
  // 向 Pupuk Iskandar Muda 出资，其后全部股份转入 Pupuk Sriwidjaja（标题即是两段式）
  'ID-H2083': {
    zh: '向伊斯坎达尔·穆达化肥公司出资并将全部股份转入斯里维贾亚化肥公营有限公司的国家资本参与法',
    en: 'Law on State Capital Participation in PT Pupuk Iskandar Muda, All of Whose Shares Are Subsequently Transferred to the State-Owned Limited Liability Company (PERSERO) PT Pupuk Sriwidjaja',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào PT Pupuk Iskandar Muda mà toàn bộ cổ phần sau đó được chuyển vào Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO) PT Pupuk Sriwidjaja',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐใน PT Pupuk Iskandar Muda ซึ่งหุ้นทั้งหมดจะถูกโอนไปยังบริษัทจำกัดของรัฐ (PERSERO) PT Pupuk Sriwidjaja ในภายหลัง',
    ms: 'Akta tentang Penyertaan Modal Negara dalam PT Pupuk Iskandar Muda yang seluruh sahamnya kemudiannya dipindahkan ke dalam Syarikat Sendirian Berhad Milik Negara (PERSERO) PT Pupuk Sriwidjaja',
  },
  // 设立东盟基础设施基金（国际机构，四语本地化）
  'ID-H2082': {
    zh: '为设立东盟基础设施基金而进行国家资本参与法',
    en: 'Law on State Capital Participation for the Establishment of the ASEAN Infrastructure Fund',
    vi: 'Luật về Việc Góp Vốn Nhà nước để Thành lập Quỹ Cơ sở hạ tầng ASEAN',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้งกองทุนโครงสร้างพื้นฐานอาเซียน',
    ms: 'Akta tentang Penyertaan Modal Negara untuk Penubuhan Dana Infrastruktur ASEAN',
  },
  // 设立信用担保与投资便利机制（CGIF，国际机构，四语本地化）
  'ID-H2084': {
    zh: '为设立信用担保与投资便利机制而进行国家资本参与法',
    en: 'Law on State Capital Participation for the Establishment of the Credit Guarantee and Investment Facility',
    vi: 'Luật về Việc Góp Vốn Nhà nước để Thành lập Cơ chế Bảo lãnh Tín dụng và Thuận lợi Đầu tư',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐเพื่อจัดตั้งกลไกค้ำประกันสินเชื่อและอำนวยความสะดวกในการลงทุน',
    ms: 'Akta tentang Penyertaan Modal Negara untuk Penubuhan Kemudahan Jaminan Pinjaman dan Pelaburan',
  },
  // 亚洲基础设施投资银行（AIIB，四语本地化）
  'ID-H2577': {
    zh: '向亚洲基础设施投资银行进行国家资本参与法',
    en: 'Law on State Capital Participation in the Asian Infrastructure Investment Bank',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào Ngân hàng Đầu tư Cơ sở hạ tầng Châu Á',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐในธนาคารเพื่อการลงทุนในโครงสร้างพื้นฐานแห่งเอเชีย',
    ms: 'Akta tentang Penyertaan Modal Negara dalam Bank Pelaburan Infrastruktur Asia',
  },
  // 伊斯兰开发银行（IDB，四语本地化）
  'ID-H611': {
    zh: '向伊斯兰开发银行进行国家资本参与法',
    en: 'Law on State Capital Participation in the Islamic Development Bank',
    vi: 'Luật về Việc Góp Vốn Nhà nước vào Ngân hàng Phát triển Hồi giáo',
    th: 'พระราชบัญญัติว่าด้วยการร่วมทุนของรัฐในธนาคารเพื่อการพัฒนาอิสลาม',
    ms: 'Akta tentang Penyertaan Modal Negara dalam Bank Pembangunan Islam',
  },
};

const items = {};
const skip = [];
for (const [id, kind, o] of ROWS) items[id] = F[kind](o);
for (const [id, t] of Object.entries(EXTRA)) items[id] = t;

// 兜底自检：五语齐全、无空值
for (const [id, t] of Object.entries(items)) {
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!String(t[k] || '').trim()) throw new Error(id + ' 缺 ' + k);
  }
}

const out = path.join(__dirname, '_id_b31.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b31', items, skip }, null, 2), 'utf8');
console.log('写入 ' + Object.keys(items).length + ' 条 → ' + out);
