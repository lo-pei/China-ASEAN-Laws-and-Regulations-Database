// b49：ID「TATA CARA PELAKSANAAN …」9 条 + 「ORGANISASI DAN TATA KELOLA …」1 条，共 10 条。
//
// 这批标题全部**丢了文书类型前缀**：原件是「PERATURAN PEMERINTAH NOMOR … TAHUN … TENTANG
// TATA CARA PELAKSANAAN …」，抓取时只剩 TENTANG 之后的从句。逐条以正文首句
// 「Dalam Peraturan Pemerintah ini yang dimaksud dengan:」确证其性质为**政府条例**，
// 故译名补回「政府条例 / Government Regulation / Quy định của Chính phủ /
// กฎระเบียบรัฐบาล / Peraturan Pemerintah」，属补全文书类型，不是增译。
//
// 另：`docNumber` 一律填的是**被实施的母法**号年（`ID-H1711` 填 UU6-1983、
// `ID-H3295` 填 UU19-2003 即国企法），不是条例自身号年——存量问题，未擅改。
//
// 术语沿用库内既有译法：
//   Ketentuan Umum dan Tata Cara Perpajakan → 《税收一般规定与程序法》（`ID-H070`）
//   Tata Cara Pelaksanaan Hak dan Pemenuhan Kewajiban Perpajakan → 税收权利行使与义务履行程序
//   Penyelenggaraan Negara → 国家治理（`ID-H1500` 一族）
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

const T = {
  'ID-H1164': {
    zh: '关于国家治理中公众参与实施程序的政府条例',
    en: 'Government Regulation on the Procedure for Public Participation in State Administration',
    vi: 'Quy định của Chính phủ về Thủ tục Tham gia của Công chúng trong Quản lý Nhà nước',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการมีส่วนร่วมของประชาชนในการบริหารรัฐ',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Peran Serta Masyarakat dalam Penyelenggaraan Negara',
  },
  'ID-H1711': {
    zh: '关于依据1983年第6号《税收一般规定与程序法》行使税收权利与履行纳税义务程序的政府条例（该法经2007年第28号法律最后修改）',
    en: 'Government Regulation on the Procedure for Exercising Tax Rights and Fulfilling Tax Obligations under Law No. 6 of 1983 on General Provisions and Tax Procedures, as last amended by Law No. 28 of 2007',
    vi: 'Quy định của Chính phủ về Thủ tục Thực hiện Quyền Thuế và Hoàn thành Nghĩa vụ Thuế theo Luật số 6 năm 1983 về Quy định Chung và Thủ tục Thuế, được sửa đổi lần cuối bởi Luật số 28 năm 2007',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการใช้สิทธิทางภาษีและการปฏิบัติตามหน้าที่ทางภาษีตามกฎหมายฉบับที่ 6 ปี 1983 ว่าด้วยบทบัญญัติทั่วไปและวิธีปฏิบัติทางภาษี ซึ่งแก้ไขเพิ่มเติมครั้งล่าสุดโดยกฎหมายฉบับที่ 28 ปี 2007',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Hak dan Kewajiban Perpajakan berdasarkan Undang-Undang No. 6 Tahun 1983 tentang Ketentuan Umum dan Tatacara Perpajakan, sebagaimana telah diubah terakhir dengan Undang-Undang No. 28 Tahun 2007',
  },
  'ID-H1822': {
    zh: '关于印度尼西亚共和国国家警察关系与合作实施程序的政府条例',
    en: 'Government Regulation on the Procedure for Relations and Cooperation of the Indonesian National Police',
    vi: 'Quy định của Chính phủ về Thủ tục Quan hệ và Hợp tác của Cảnh sát Quốc gia Cộng hòa Indonesia',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนความสัมพันธ์และความร่วมมือของตำรวจแห่งชาติสาธารณรัฐอินโดนีเซีย',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Hubungan dan Kerja Sama Kepolisian Negara Republik Indonesia',
  },
  'ID-H2024': {
    zh: '关于省长作为政府在省级区域代表的任务、权限与财政地位实施程序的政府条例',
    en: 'Government Regulation on the Procedure for the Duties, Authorities and Financial Position of Governors as Representatives of the Government in Provincial Regions',
    vi: 'Quy định của Chính phủ về Thủ tục Thực hiện Nhiệm vụ, Thẩm quyền và Địa vị Tài chính của Tỉnh trưởng với tư cách Đại diện Chính phủ tại Địa bàn Tỉnh',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการปฏิบัติหน้าที่ อำนาจ และฐานะทางการเงินของผู้ว่าราชการจังหวัดในฐานะผู้แทนรัฐบาลในเขตจังหวัด',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Tugas dan Wewenang serta Kedudukan Keuangan Gubernur sebagai Wakil Pemerintah di Wilayah Provinsi',
  },
  'ID-H2218': {
    zh: '关于对特别警察、公务员调查员及自助安保形式实施协调、监督与技术指导程序的政府条例',
    en: 'Government Regulation on the Procedure for Coordination, Supervision and Technical Guidance of Special Police, Civil Servant Investigators and Self-Reliant Security Forms',
    vi: 'Quy định của Chính phủ về Thủ tục Phối hợp, Giám sát và Hướng dẫn Kỹ thuật đối với Cảnh sát Đặc biệt, Điều tra viên Công chức và các Hình thức An ninh Tự quản',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการประสานงาน การกำกับดูแล และการแนะนำทางวิชาการต่อตำรวจพิเศษ พนักงานสอบสวนข้าราชการ และรูปแบบการรักษาความปลอดภัยโดยชุมชน',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Koordinasi, Pengawasan, dan Pembinaan Teknis terhadap Kepolisian Khusus, Penyidik Pegawai Negeri Sipil, dan Bentuk-Bentuk Pengamanan Swakarsa',
  },
  'ID-H2308': {
    zh: '关于政府实施印度尼西亚劳工境外安置程序的政府条例',
    en: 'Government Regulation on the Procedure for the Placement of Indonesian Workers Abroad by the Government',
    vi: 'Quy định của Chính phủ về Thủ tục Đưa Người lao động Indonesia ra Nước ngoài do Chính phủ Thực hiện',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการจัดส่งแรงงานอินโดนีเซียไปทำงานต่างประเทศโดยรัฐบาล',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Penempatan Tenaga Kerja Indonesia di Luar Negeri oleh Pemerintah',
  },
  'ID-H2676': {
    zh: '关于少年刑事司法系统协调、监测、评估与报告实施程序的政府条例',
    en: 'Government Regulation on the Procedure for Coordination, Monitoring, Evaluation and Reporting of the Juvenile Criminal Justice System',
    vi: 'Quy định của Chính phủ về Thủ tục Phối hợp, Theo dõi, Đánh giá và Báo cáo Hệ thống Tư pháp Hình sự Người chưa thành niên',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการประสานงาน การติดตาม การประเมิน และการรายงานระบบกระบวนการยุติธรรมทางอาญาสำหรับเด็ก',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Koordinasi, Pemantauan, Evaluasi, dan Pelaporan Sistem Peradilan Pidana Anak',
  },
  'ID-H2753': {
    zh: '关于预防和惩治腐败犯罪中公众参与及给予奖励实施程序的政府条例',
    en: 'Government Regulation on the Procedure for Public Participation and the Granting of Awards in the Prevention and Eradication of Corruption',
    vi: 'Quy định của Chính phủ về Thủ tục Tham gia của Công chúng và Việc Khen thưởng trong Phòng ngừa và Đấu tranh chống Tội phạm Tham nhũng',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการมีส่วนร่วมของประชาชนและการให้รางวัลในการป้องกันและปราบปรามอาชญากรรมการทุจริต',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Peran Serta Masyarakat dan Pemberian Penghargaan dalam Pencegahan dan Pemberantasan Tindak Pidana Korupsi',
  },
  'ID-H3295': {
    zh: '关于达雅阿纳加塔努山塔拉投资管理机构组织与治理的政府条例',
    en: 'Government Regulation on the Organization and Governance of the Daya Anagata Nusantara Investment Management Agency',
    vi: 'Quy định của Chính phủ về Tổ chức và Quản trị Cơ quan Quản lý Đầu tư Daya Anagata Nusantara',
    th: 'กฎระเบียบรัฐบาลว่าด้วยองค์กรและการกำกับดูแลหน่วยงานบริหารการลงทุนดายาอานากาตานูซันตารา',
    ms: 'Peraturan Pemerintah tentang Organisasi dan Tata Kelola Badan Pengelola Investasi Daya Anagata Nusantara',
  },
  'ID-H735': {
    zh: '关于不准出境与不准入境实施程序的政府条例',
    en: 'Government Regulation on the Procedure for Departure Bans and Entry Bans',
    vi: 'Quy định của Chính phủ về Thủ tục Cấm xuất cảnh và Cấm nhập cảnh',
    th: 'กฎระเบียบรัฐบาลว่าด้วยขั้นตอนการห้ามเดินทางออกนอกประเทศและการห้ามเข้าประเทศ',
    ms: 'Peraturan Pemerintah tentang Tatacara Pelaksanaan Pencegahan dan Penangkalan',
  },
};

const HEAD = {
  zh: (s) => /^关于.+的政府条例(（.+）)?$/.test(s),
  en: (s) => s.startsWith('Government Regulation on the '),
  vi: (s) => s.startsWith('Quy định của Chính phủ về '),
  th: (s) => s.startsWith('กฎระเบียบรัฐบาลว่าด้วย'),
  ms: (s) => s.startsWith('Peraturan Pemerintah tentang '),
};

const items = {};
const bad = [];
for (const [id, t] of Object.entries(T)) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' '); // 正文含换行，须压平后再做文书性质判定
  // 文书性质确证：正文须自称「Peraturan Pemerintah」
  // 两条互证路径：
  //   甲 正文自称「Dalam Per(aturan) Pemerintah ini」——OCR 常拼成 Perahrran/Peraturar，按词形放宽；
  //   乙 文末附「PENJELASAN ATAS PERATURAN PEMERINTAH REPUBLIK INDONESIA NOMOR … TAHUN … TENTANG …」
  //      （`ID-H1711` 缺 Pasal 1 定义条，只能走乙；该说明同时复述了本标题全文，可反证标题未残）
  const isPP = /Dalam Per[a-z]{4,} Pemerintah ini/i.test(txt) || /PENJELASAN ATAS PERATURAN PEMERINTAH/i.test(txt);
  if (!isPP) bad.push(id + ' 正文既无「Dalam Per… Pemerintah ini」也无 PENJELASAN ATAS PERATURAN PEMERINTAH，不能确证为政府条例');
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) if (!HEAD[k](t[k])) bad.push(id + ' / ' + k + ' 文书类型头不符：' + t[k].slice(0, 40));
  // ms 以印尼原文为底，须覆盖原题实词（防串行、防臆造主题）
  const ot = [...new Set(orig.toUpperCase().match(/[A-Z]{4,}/g) || [])];
  const msU = t.ms.toUpperCase();
  const miss = ot.filter((w) => !msU.includes(w));
  if (miss.length / Math.max(1, ot.length) > 0.25) bad.push(id + ' ms 与原题偏离过大，缺：' + miss.join(','));
  if (miss.length) console.log('  · ' + id + ' ms 未逐字照录：' + miss.join(','));
  items[id] = t;
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== 10) throw new Error('条目数应为 10，实为 ' + n);
const out = path.join(__dirname, '_id_b49.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b49', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
