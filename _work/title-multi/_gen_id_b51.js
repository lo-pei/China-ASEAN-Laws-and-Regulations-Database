// b51：ID「PENGESAHAN …」（批准条约/公约法，15 部，均为多边公约/协定）。
//
// 这批条目的 `zh`/`en` 原本为空，只有 `id`（印尼文标题，英文全称在括号前、印尼文对照在括号内），
// 因此本批要补 zh/en/vi/th/ms 五个键。
//
// 句式（沿用库内 `ID-H1455` 批准《京都议定书》法、`ID-H1114` 批准国际劳工组织第138号…公约法）：
//   zh  批准《{公约名}》法（ILO 公约作「批准国际劳工组织第{号}号{主题}公约法」，与 ID-H1114 一致）
//   en  Law on the Ratification of {instrument}
//   vi  Luật về Việc Phê chuẩn {instrument}
//   th  พระราชบัญญัติว่าด้วยการให้สัตยาบัน{instrument}
//   ms  Akta tentang Pengesahan {instrument}
//
// 三条口径：
//   ① 公约名用**中文正式译名**（《消除一切形式种族歧视国际公约》《联合国反腐败公约》
//      《关于持久性有机污染物的斯德哥尔摩公约》等），不自创简称。
//   ② ms 直接沿用标题括号内**印尼文官方对照名**——马来语与印尼语在条约名称上几无差异，
//      照录比另译更稳，只把首字母与连接词规整为马来语习惯。
//   ③ 原题英文部分有拼写错误（`ABALITION`←ABOLITION、`CORUPTION`←CORRUPTION、
//      `OCUPATION`←OCCUPATION、`GAVERNMENT`←GOVERNMENT），译名按正确词义，脏字不采。
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

// must：原文必须出现的大写片段，防串行/防臆造
const T = {
  'ID-H1115': {
    must: ['RACIAL DISCRIMINATION', '1965'],
    zh: '批准《消除一切形式种族歧视国际公约》法',
    en: 'Law on the Ratification of the International Convention on the Elimination of All Forms of Racial Discrimination, 1965',
    vi: 'Luật về Việc Phê chuẩn Công ước Quốc tế về Xóa bỏ mọi Hình thức Phân biệt Chủng tộc, 1965',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาระหว่างประเทศว่าด้วยการขจัดการเลือกปฏิบัติทางเชื้อชาติในทุกรูปแบบ ค.ศ. 1965',
    ms: 'Akta tentang Pengesahan Konvensyen Internasional tentang Penghapusan Segala Bentuk Diskriminasi Ras 1965',
  },
  'ID-H1118': {
    must: ['105', 'FORCED LABOUR'],
    zh: '批准国际劳工组织第105号废止强迫劳动公约法',
    en: 'Law on the Ratification of the ILO Convention No. 105 concerning the Abolition of Forced Labour',
    vi: 'Luật về Việc Phê chuẩn Công ước số 105 của ILO về Xóa bỏ Lao động Cưỡng bức',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญา ILO ฉบับที่ 105 ว่าด้วยการเลิกการใช้แรงงานบังคับ',
    ms: 'Akta tentang Pengesahan Konvensyen ILO No. 105 tentang Penghapusan Kerja Paksa',
  },
  'ID-H1119': {
    must: ['111', 'EMPLOYMENT'],
    zh: '批准国际劳工组织第111号就业和职业歧视公约法',
    en: 'Law on the Ratification of the ILO Convention No. 111 concerning Discrimination in Respect of Employment and Occupation',
    vi: 'Luật về Việc Phê chuẩn Công ước số 111 của ILO về Phân biệt đối xử trong Việc làm và Nghề nghiệp',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญา ILO ฉบับที่ 111 ว่าด้วยการเลือกปฏิบัติในด้านการจ้างงานและอาชีพ',
    ms: 'Akta tentang Pengesahan Konvensyen ILO No. 111 tentang Diskriminasi dalam Hal Pekerjaan dan Jabatan',
  },
  'ID-H1266': {
    must: ['182', 'CHILD LABOUR'],
    zh: '批准国际劳工组织第182号禁止和立即行动消除最恶劣形式童工劳动公约法',
    en: 'Law on the Ratification of the ILO Convention No. 182 concerning the Prohibition and Immediate Action for the Elimination of the Worst Forms of Child Labour',
    vi: 'Luật về Việc Phê chuẩn Công ước số 182 của ILO về Cấm và Hành động Ngay lập tức nhằm Xóa bỏ các Hình thức Lao động Trẻ em Tồi tệ nhất',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญา ILO ฉบับที่ 182 ว่าด้วยการห้ามและการดำเนินการโดยทันทีเพื่อขจัดการใช้แรงงานเด็กในรูปแบบที่เลวร้ายที่สุด',
    ms: 'Akta tentang Pengesahan Konvensyen ILO No. 182 tentang Pelarangan dan Tindakan Segera Penghapusan Bentuk-Bentuk Pekerjaan Terburuk untuk Anak',
  },
  'ID-H1563': {
    must: ['CORUPTION', '2003'],
    zh: '批准《联合国反腐败公约》法',
    en: 'Law on the Ratification of the United Nations Convention against Corruption, 2003',
    vi: 'Luật về Việc Phê chuẩn Công ước Liên hợp quốc về Chống Tham nhũng, 2003',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านการทุจริต ค.ศ. 2003',
    ms: 'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu Anti Rasuah, 2003',
  },
  'ID-H1880': {
    must: ['STOCKHOLM', 'PERSISTENT ORGANIC'],
    zh: '批准《关于持久性有机污染物的斯德哥尔摩公约》法',
    en: 'Law on the Ratification of the Stockholm Convention on Persistent Organic Pollutants',
    vi: 'Luật về Việc Phê chuẩn Công ước Stockholm về các Chất Ô nhiễm Hữu cơ Khó phân hủy',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสตอกโฮล์มว่าด้วยสารมลพิษที่ตกค้างยาวนาน',
    ms: 'Akta tentang Pengesahan Konvensyen Stockholm tentang Bahan Pencemar Organik yang Persisten',
  },
  'ID-H2272': {
    must: ['NAGOYA', 'GENETIC RESOURCES'],
    zh: '批准《生物多样性公约关于获取遗传资源和公正公平分享其利用所产生惠益的名古屋议定书》法',
    en: 'Law on the Ratification of the Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits Arising from Their Utilization to the Convention on Biological Diversity',
    vi: 'Luật về Việc Phê chuẩn Nghị định thư Nagoya về Tiếp cận Nguồn gen và Chia sẻ Công bằng, Hợp lý các Lợi ích Phát sinh từ Việc Sử dụng Nguồn gen thuộc Công ước về Đa dạng Sinh học',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันพิธีสารนาโกย่าว่าด้วยการเข้าถึงทรัพยากรพันธุกรรมและการแบ่งปันผลประโยชน์อย่างเป็นธรรมและเท่าเทียมจากการใช้ประโยชน์ภายใต้อนุสัญญาว่าด้วยความหลากหลายทางชีวภาพ',
    ms: 'Akta tentang Pengesahan Protokol Nagoya tentang Akses pada Sumber Daya Genetik dan Pembagian Keuntungan yang Adil dan Seimbang yang Timbul dari Pemanfaatannya atas Konvensyen Kepelbagaian Biologi',
  },
  'ID-H2273': {
    must: ['ROTTERDAM', 'PRIOR INFORMED CONSENT'],
    zh: '批准《关于在国际贸易中对某些危险化学品和农药采用事先知情同意程序的鹿特丹公约》法',
    en: 'Law on the Ratification of the Rotterdam Convention on the Prior Informed Consent Procedure for Certain Hazardous Chemicals and Pesticides in International Trade',
    vi: 'Luật về Việc Phê chuẩn Công ước Rotterdam về Thủ tục Đồng ý Trước trên cơ sở Thông tin Đầy đủ đối với một số Hóa chất và Thuốc trừ sâu Nguy hiểm trong Thương mại Quốc tế',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญารอตเทอร์ดัมว่าด้วยขั้นตอนการให้ความยินยอมล่วงหน้าบนพื้นฐานข้อมูลสำหรับสารเคมีและสารกำจัดศัตรูพืชอันตรายบางชนิดในการค้าระหว่างประเทศ',
    ms: 'Akta tentang Pengesahan Konvensyen Rotterdam tentang Prosedur Persetujuan atas Dasar Informasi Awal untuk Bahan Kimia dan Pestisid Berbahaya Tertentu dalam Perdagangan Antarabangsa',
  },
  'ID-H2570': {
    must: ['PARIS AGREEMENT', 'CLIMATE CHANGE'],
    zh: '批准《巴黎协定》法',
    en: 'Law on the Ratification of the Paris Agreement to the United Nations Framework Convention on Climate Change',
    vi: 'Luật về Việc Phê chuẩn Hiệp định Paris về Biến đổi Khí hậu thuộc Công ước Khung của Liên hợp quốc về Biến đổi Khí hậu',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงปารีสภายใต้อนุสัญญากรอบสหประชาชาติว่าด้วยการเปลี่ยนแปลงสภาพภูมิอากาศ',
    ms: 'Akta tentang Pengesahan Persetujuan Paris atas Konvensyen Kerangka Kerja Pertubuhan Bangsa-Bangsa Bersatu mengenai Perubahan Iklim',
  },
  'ID-H910': {
    must: ['SOUTHEAST ASIA NUCLEAR WEAPON FREE ZONE'],
    zh: '批准《东南亚无核武器区条约》法',
    en: 'Law on the Ratification of the Treaty on the Southeast Asia Nuclear Weapon Free Zone',
    vi: 'Luật về Việc Phê chuẩn Hiệp ước về Khu vực Không Vũ khí Hạt nhân Đông Nam Á',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาว่าด้วยเขตปลอดอาวุธนิวเคลียร์ในเอเชียตะวันออกเฉียงใต้',
    ms: 'Akta tentang Pengesahan Traktat Kawasan Bebas Senjata Nuklir di Asia Tenggara',
  },
  'ID-H912': {
    must: ['ILLICIT TRAFFIC', '1988'],
    zh: '批准《联合国禁止非法贩运麻醉药品和精神药物公约》法',
    en: 'Law on the Ratification of the United Nations Convention against Illicit Traffic in Narcotic Drugs and Psychotropic Substances, 1988',
    vi: 'Luật về Việc Phê chuẩn Công ước Liên hợp quốc về Chống Buôn bán Bất hợp pháp Thuốc gây nghiện và Chất hướng thần, 1988',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านการลักลอบค้ายาเสพติดและวัตถุออกฤทธิ์ต่อจิตและประสาท ค.ศ. 1988',
    ms: 'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu tentang Pemberantasan Peredaran Gelap Narkotik dan Psikotropik, 1988',
  },
  'ID-H845': {
    must: ['PSYCHOTROPIC SUBSTANCES', '1971'],
    zh: '批准《1971年精神药物公约》法',
    en: 'Law on the Ratification of the Convention on Psychotropic Substances, 1971',
    vi: 'Luật về Việc Phê chuẩn Công ước về các Chất hướng thần, 1971',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาว่าด้วยวัตถุออกฤทธิ์ต่อจิตและประสาท ค.ศ. 1971',
    ms: 'Akta tentang Pengesahan Konvensyen Psikotropik 1971',
  },
  'ID-H713': {
    must: ['BIOLOGICAL DIVERSITY'],
    zh: '批准《生物多样性公约》法',
    en: 'Law on the Ratification of the United Nations Convention on Biological Diversity',
    vi: 'Luật về Việc Phê chuẩn Công ước Liên hợp quốc về Đa dạng Sinh học',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยความหลากหลายทางชีวภาพ',
    ms: 'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu mengenai Kepelbagaian Biologi',
  },
  'ID-H715': {
    must: ['FRAMEWORK CONVENTION ON CLIMATE CHANGE'],
    zh: '批准《联合国气候变化框架公约》法',
    en: 'Law on the Ratification of the United Nations Framework Convention on Climate Change',
    vi: 'Luật về Việc Phê chuẩn Công ước Khung của Liên hợp quốc về Biến đổi Khí hậu',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญากรอบสหประชาชาติว่าด้วยการเปลี่ยนแปลงสภาพภูมิอากาศ',
    ms: 'Akta tentang Pengesahan Konvensyen Kerangka Kerja Pertubuhan Bangsa-Bangsa Bersatu mengenai Perubahan Iklim',
  },
  'ID-H710': {
    must: ['WORLD TRADE ORGANIZATION'],
    zh: '批准《建立世界贸易组织协定》法',
    en: 'Law on the Ratification of the Agreement Establishing the World Trade Organization',
    vi: 'Luật về Việc Phê chuẩn Hiệp định Thành lập Tổ chức Thương mại Thế giới',
    th: 'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงจัดตั้งองค์การการค้าโลก',
    ms: 'Akta tentang Pengesahan Persetujuan Pembentukan Pertubuhan Perdagangan Dunia',
  },
};

const HEAD = {
  zh: (s) => s.startsWith('批准'),
  en: (s) => s.startsWith('Law on the Ratification of the '),
  vi: (s) => s.startsWith('Luật về Việc Phê chuẩn '),
  th: (s) => s.startsWith('พระราชบัญญัติว่าด้วยการให้สัตยาบัน'),
  ms: (s) => s.startsWith('Akta tentang Pengesahan '),
};

const items = {};
const bad = [];
for (const [id, t] of Object.entries(T)) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '').toUpperCase().replace(/\s+/g, ' ');
  if (!orig.startsWith('PENGESAHAN ')) bad.push(id + ' 标题头不符：' + orig.slice(0, 40));
  for (const m of t.must) if (!orig.includes(m)) bad.push(id + ' 原文缺片段「' + m + '」');
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!HEAD[k](t[k])) bad.push(id + ' / ' + k + ' 句式头不符：' + t[k].slice(0, 30));
    if (/[《》]/.test(t[k]) && k !== 'zh') bad.push(id + ' / ' + k + ' 含书名号');
  }
  // 原题英文缩写与译名号数一致（ILO 三条）
  const noM = orig.match(/NO\.?\s*(\d+)/);
  if (noM && !t.en.includes('No. ' + noM[1])) bad.push(id + ' 公约号不符：原文 ' + noM[1]);
  items[id] = { zh: t.zh, en: t.en, vi: t.vi, th: t.th, ms: t.ms };
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== Object.keys(T).length) throw new Error('条目数不符');
const out = path.join(__dirname, '_id_b51.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b51', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
