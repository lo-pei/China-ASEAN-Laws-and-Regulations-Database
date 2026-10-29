// b35：ID 长标题族「PENETAPAN PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG …」（将 Perppu 定为法律）20 条全收官。
// 该族 20 条此前五语全空。标题一律为
//   PENETAPAN PERPPU NOMOR {no} TAHUN {year} TENTANG {主题} MENJADI UNDANG-UNDANG
// 其中 15 条标题在 110 字符处被 OCR 截断，主题须按正文 `Pasal 1` 的
//   「Peraturan Pemerintah Pengganti Undang-Undang Nomor … tentang … (Lembaran Negara …)」
// 逐条还原；4 条正文残缺（ID-H2635 的 Pasal 1 只剩解释、ID-H2474/H2893/ID-H1454 需深查），
// 已分别从附录页眉、序言与 Pasal 1 补齐，无一凭标题猜测。
//
// 句式（与 b33 的 Perppu 条款保持一致）：
//   zh  将{年}年第{号}号关于{主题}的代替法律的政府条例定为法律
//   en  Law on the Enactment of Government Regulation in Lieu of Law No. {号} of {年} on {主题} into Law
//   vi  Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số {号} năm {年} về {主题} thành Luật
//   th  พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ {号} ปี {年} ว่าด้วย{主题}เป็นกฎหมาย
//   ms  Akta tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. {号} Tahun {年} tentang {主题} menjadi Undang-Undang
'use strict';
const fs = require('fs');
const path = require('path');

const FR = (no, year, s) => ({
  zh: `将${year}年第${no}号关于${s.zh}的代替法律的政府条例定为法律`,
  en: `Law on the Enactment of Government Regulation in Lieu of Law No. ${no} of ${year} on ${s.en} into Law`,
  vi: `Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số ${no} năm ${year} về ${s.vi} thành Luật`,
  th: `พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ ${no} ปี ${year} ว่าด้วย${s.th}เป็นกฎหมาย`,
  ms: `Akta tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. ${no} Tahun ${year} tentang ${s.ms} menjadi Undang-Undang`,
});

// 主题槽
const S = {
  pilkada: {
    zh: '选举省长、县长和市长',
    en: 'the Election of Governors, Regents and Mayors',
    vi: 'Bầu cử Thống đốc, Bupati và Wali Kota',
    th: 'การเลือกตั้งผู้ว่าราชการจังหวัด หัวหน้าเขต และนายกเทศมนตรี',
    ms: 'Pemilihan Gabenor, Bupati dan Wali Kota',
  },
  ciptaKerja: {
    zh: '创造就业',
    en: 'Job Creation',
    vi: 'Tạo việc làm',
    th: 'การสร้างงาน',
    ms: 'Penciptaan Kerja',
  },
  brr: {
    zh: '亚齐达鲁萨兰省与北苏门答腊省尼亚斯群岛地区及社区生活恢复与重建机构',
    en: 'the Rehabilitation and Reconstruction Agency for the Region and Community Life of Nanggroe Aceh Darussalam Province and the Nias Islands of North Sumatra Province',
    vi: 'Cơ quan Phục hồi và Tái thiết Vùng lãnh thổ và Đời sống Cộng đồng Tỉnh Nanggroe Aceh Darussalam và Quần đảo Nias Tỉnh Bắc Sumatra',
    th: 'องค์การฟื้นฟูและบูรณะพื้นที่และชีวิตชุมชนจังหวัดนังโกรอาเจะดารุสซาลามและหมู่เกาะนีอัสจังหวัดสุมาตราเหนือ',
    ms: 'Badan Pemulihan dan Pembinaan Semula Wilayah dan Kehidupan Masyarakat Wilayah Nanggroe Aceh Darussalam dan Kepulauan Nias Wilayah Sumatera Utara',
  },
  pemilu2017: {
    zh: '修改2017年第7号《选举法》',
    en: 'the Amendment to Law No. 7 of 2017 on General Elections',
    vi: 'Sửa đổi Luật số 7 năm 2017 về Tổng tuyển cử',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 7 ปี 2017 ว่าด้วยการเลือกตั้งทั่วไป',
    ms: 'Pindaan kepada Undang-Undang No. 7 Tahun 2017 tentang Pilihan Raya Umum',
  },
  aksesKeuangan: {
    zh: '为税收目的获取金融信息',
    en: 'Access to Financial Information for Taxation Purposes',
    vi: 'Tiếp cận Thông tin Tài chính vì Mục đích Thuế',
    th: 'การเข้าถึงข้อมูลทางการเงินเพื่อประโยชน์ทางภาษี',
    ms: 'Akses Maklumat Kewangan untuk Kepentingan Percukaian',
  },
  ormas: {
    zh: '修改2013年第17号《社会组织法》',
    en: 'the Amendment to Law No. 17 of 2013 on Mass Organisations',
    vi: 'Sửa đổi Luật số 17 năm 2013 về Tổ chức Xã hội',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 17 ปี 2013 ว่าด้วยองค์กรทางสังคม',
    ms: 'Pindaan kepada Undang-Undang No. 17 Tahun 2013 tentang Organisasi Kemasyarakatan',
  },
  covid: {
    zh: '国家财政政策与金融体系稳定，以应对2019冠状病毒病疫情及/或应对危及国民经济及/或金融体系稳定的威胁',
    en: 'State Financial Policy and Financial System Stability for Handling the COVID-19 Pandemic and/or in Facing Threats Endangering the National Economy and/or Financial System Stability',
    vi: 'Chính sách Tài chính Nhà nước và Ổn định Hệ thống Tài chính để Ứng phó Đại dịch COVID-19 và/hoặc nhằm Đối phó Các Mối đe dọa Gây nguy hại cho Nền kinh tế Quốc gia và/hoặc Sự ổn định Hệ thống Tài chính',
    th: 'นโยบายการเงินการคลังของรัฐและเสถียรภาพของระบบการเงินเพื่อรับมือการระบาดของโรคโควิด-19 และ/หรือเพื่อเผชิญกับภัยคุกคามที่คุกคามเศรษฐกิจแห่งชาติและ/หรือเสถียรภาพของระบบการเงิน',
    ms: 'Dasar Kewangan Negara dan Kestabilan Sistem Kewangan bagi Penanganan Pandemik COVID-19 dan/atau Menghadapi Ancaman yang Membahayakan Ekonomi Negara dan/atau Kestabilan Sistem Kewangan',
  },
  pemda2004: {
    zh: '修改2004年第32号《地方政府法》',
    en: 'the Amendment to Law No. 32 of 2004 on Regional Government',
    vi: 'Sửa đổi Luật số 32 năm 2004 về Chính quyền Địa phương',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 32 ปี 2004 ว่าด้วยการปกครองท้องถิ่น',
    ms: 'Pindaan kepada Undang-Undang No. 32 Tahun 2004 tentang Pemerintahan Daerah',
  },
  ftz2000: {
    zh: '修改2000年第36号《关于将2000年第1号自由贸易区与自由港代替法律的政府条例定为法律的法律》',
    en: 'the Amendment to Law No. 36 of 2000 on the Enactment of Government Regulation in Lieu of Law No. 1 of 2000 on Free Trade Zones and Free Ports into Law',
    vi: 'Sửa đổi Luật số 36 năm 2000 về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2000 về Khu Thương mại Tự do và Cảng Tự do thành Luật',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 36 ปี 2000 ว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2000 ว่าด้วยเขตการค้าเสรีและท่าเรือเสรีเป็นกฎหมาย',
    ms: 'Pindaan kepada Undang-Undang No. 36 Tahun 2000 tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2000 tentang Kawasan Perdagangan Bebas dan Pelabuhan Bebas',
  },
  pemda2014: {
    zh: '修改2014年第23号《地方政府法》',
    en: 'the Amendment to Law No. 23 of 2014 on Regional Government',
    vi: 'Sửa đổi Luật số 23 năm 2014 về Chính quyền Địa phương',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 23 ปี 2014 ว่าด้วยการปกครองท้องถิ่น',
    ms: 'Pindaan kepada Undang-Undang No. 23 Tahun 2014 tentang Pemerintahan Daerah',
  },
  kpk: {
    zh: '修改2002年第30号《腐败犯罪根除委员会法》',
    en: 'the Amendment to Law No. 30 of 2002 on the Corruption Eradication Commission',
    vi: 'Sửa đổi Luật số 30 năm 2002 về Ủy ban Xóa bỏ Tội phạm Tham nhũng',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 30 ปี 2002 ว่าด้วยคณะกรรมการปราบปรามอาชญากรรมทุจริต',
    ms: 'Pindaan kepada Undang-Undang No. 30 Tahun 2002 tentang Komisi Pemberantasan Tindak Pidana Korupsi',
  },
  tundaBPHTB: {
    zh: '推迟1997年第21号《土地与建筑物权利取得税法》生效',
    en: 'the Postponement of the Entry into Force of Law No. 21 of 1997 on the Duty on the Acquisition of Rights over Land and Buildings',
    vi: 'Việc Hoãn Hiệu lực của Luật số 21 năm 1997 về Thuế Chuyển nhượng Quyền Đối với Đất đai và Nhà cửa',
    th: 'การเลื่อนการมีผลบังคับใช้ของกฎหมายฉบับที่ 21 ปี 1997 ว่าด้วยภาษีการได้มาซึ่งสิทธิในที่ดินและอาคาร',
    ms: 'Penangguhan Permulaan Berkuatkuasa Undang-Undang No. 21 Tahun 1997 tentang Duti Perolehan Hak atas Tanah dan Bangunan',
  },
  ftz: {
    zh: '自由贸易区与自由港',
    en: 'Free Trade Zones and Free Ports',
    vi: 'Khu Thương mại Tự do và Cảng Tự do',
    th: 'เขตการค้าเสรีและท่าเรือเสรี',
    ms: 'Kawasan Perdagangan Bebas dan Pelabuhan Bebas',
  },
  kehutanan: {
    zh: '修改1999年第41号《林业法》',
    en: 'the Amendment to Law No. 41 of 1999 on Forestry',
    vi: 'Sửa đổi Luật số 41 năm 1999 về Lâm nghiệp',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 41 ปี 1999 ว่าด้วยการป่าไม้',
    ms: 'Pindaan kepada Undang-Undang No. 41 Tahun 1999 tentang Perhutanan',
  },
  tundaPPHI: {
    zh: '推迟2004年第2号《劳资关系纠纷解决法》生效',
    en: 'the Postponement of the Entry into Force of Law No. 2 of 2004 on the Settlement of Industrial Relations Disputes',
    vi: 'Việc Hoãn Hiệu lực của Luật số 2 năm 2004 về Giải quyết Tranh chấp Quan hệ Lao động',
    th: 'การเลื่อนการมีผลบังคับใช้ของกฎหมายฉบับที่ 2 ปี 2004 ว่าด้วยการระงับข้อพิพาทแรงงานสัมพันธ์',
    ms: 'Penangguhan Permulaan Berkuatkuasa Undang-Undang No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Perindustrian',
  },
  pemilu2003: {
    zh: '第二次修改2003年第12号《人民代表会议、地方代表会议与地方人民代表会议议员选举法》',
    en: 'the Second Amendment to Law No. 12 of 2003 on the Election of Members of the House of Representatives, the Regional Representatives Council and the Regional House of Representatives',
    vi: 'Sửa đổi Lần thứ hai Luật số 12 năm 2003 về Bầu cử Thành viên Hạ viện, Hội đồng Đại diện Khu vực và Hội đồng Đại diện Nhân dân Khu vực',
    th: 'การแก้ไขเพิ่มเติมครั้งที่สองแห่งกฎหมายฉบับที่ 12 ปี 2003 ว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร สภาผู้แทนระดับภาค และสภาผู้แทนราษฎรระดับภาค',
    ms: 'Pindaan Kedua kepada Undang-Undang No. 12 Tahun 2003 tentang Pemilihan Umum Anggota Dewan Perwakilan Rakyat, Dewan Perwakilan Daerah dan Dewan Perwakilan Rakyat Daerah',
  },
  papua: {
    zh: '修改2001年第21号《巴布亚省特别自治法》',
    en: 'the Amendment to Law No. 21 of 2001 on Special Autonomy for the Province of Papua',
    vi: 'Sửa đổi Luật số 21 năm 2001 về Quyền Tự trị Đặc biệt cho Tỉnh Papua',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 21 ปี 2001 ว่าด้วยการปกครองตนเองพิเศษสำหรับจังหวัดปาปัว',
    ms: 'Pindaan kepada Undang-Undang No. 21 Tahun 2001 tentang Autonomi Khas bagi Wilayah Papua',
  },
  lps: {
    zh: '修改2004年第24号《存款保险机构法》',
    en: 'the Amendment to Law No. 24 of 2004 on the Deposit Insurance Agency',
    vi: 'Sửa đổi Luật số 24 năm 2004 về Cơ quan Bảo hiểm Tiền gửi',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 24 ปี 2004 ว่าด้วยองค์การประกันเงินฝาก',
    ms: 'Pindaan kepada Undang-Undang No. 24 Tahun 2004 tentang Lembaga Penjamin Simpanan',
  },
  // 标题作 PERUBAHAN KETIGA ATAS UU 1/2015；该法本身即「将 Perppu 1/2014 定为法律」，
  // 此处只写到被修改法的通行简称，不再套一层「关于将…定为法律的法律」。
  pilkada2015: {
    zh: '第三次修改2015年第1号关于省长、县长和市长选举的法律',
    en: 'the Third Amendment to Law No. 1 of 2015 on the Election of Governors, Regents and Mayors',
    vi: 'Sửa đổi Lần thứ ba Luật số 1 năm 2015 về Bầu cử Thống đốc, Bupati và Wali Kota',
    th: 'การแก้ไขเพิ่มเติมครั้งที่สามแห่งกฎหมายฉบับที่ 1 ปี 2015 ว่าด้วยการเลือกตั้งผู้ว่าราชการจังหวัด หัวหน้าเขต และนายกเทศมนตรี',
    ms: 'Pindaan Ketiga kepada Undang-Undang No. 1 Tahun 2015 tentang Pemilihan Gabenor, Bupati dan Wali Kota',
  },
};

// [id, Perppu 号, Perppu 年, 主题槽]
const ROWS = [
  ['ID-H2473', 1, 2014, 'pilkada'],
  ['ID-H3152', 2, 2022, 'ciptaKerja'],
  ['ID-H1500', 2, 2005, 'brr'],
  ['ID-H3151', 1, 2022, 'pemilu2017'],
  ['ID-H2634', 1, 2017, 'aksesKeuangan'],
  ['ID-H2635', 2, 2017, 'ormas'],
  ['ID-H2892', 1, 2020, 'covid'],
  ['ID-H1501', 3, 2005, 'pemda2004'],
  ['ID-H1662', 1, 2007, 'ftz2000'],
  ['ID-H2475', 2, 2014, 'pemda2014'],
  ['ID-H2474', 1, 2015, 'kpk'],
  ['ID-H973', 1, 1997, 'tundaBPHTB'],
  ['ID-H1253', 1, 2000, 'ftz'],
  ['ID-H1254', 1, 2000, 'ftz'],
  ['ID-H1454', 1, 2004, 'kehutanan'],
  ['ID-H1499', 1, 2005, 'tundaPPHI'],
  ['ID-H1555', 1, 2006, 'pemilu2003'],
  ['ID-H1780', 1, 2008, 'papua'],
  ['ID-H1871', 3, 2008, 'lps'],
  ['ID-H2893', 2, 2020, 'pilkada2015'],
];

const items = {};
const over = [];
for (const [id, no, year, key] of ROWS) {
  const t = FR(no, year, S[key]);
  items[id] = t;
  for (const [k, v] of Object.entries(t)) if (v.length > 300) over.push(id + '/' + k + ' ' + v.length);
}
const n = Object.keys(items).length;
if (n !== 20) throw new Error('条目数应为 20，实为 ' + n);
if (over.length) throw new Error('超长（>300）：' + over.join(', '));

const out = path.join(__dirname, '_id_b35.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b35', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((s) => s.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
