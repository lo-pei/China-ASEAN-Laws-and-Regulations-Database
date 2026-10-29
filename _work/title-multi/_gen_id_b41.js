// b41：ID 长标题族「PENDIRIAN PERUSAHAAN JAWATAN RUMAH SAKIT …」（设立局营公司医院）11 条全收官。
// 同族另有 ID-H1231（广播电台）早前已入库，不在本批。
//
// 句式（只换医院名）：
//   zh  设立{医院}局营公司法
//   en  Law on the Establishment of {hospital} as a Departmental Undertaking
//   vi  Luật về Việc Thành lập {hospital} thành Doanh nghiệp trực thuộc Cục
//   th  พระราชบัญญัติว่าด้วยการจัดตั้ง{hospital}เป็นรัฐวิสาหกิจสังกัดกรม
//   ms  Akta tentang Penubuhan {hospital} sebagai Perusahaan Jawatan
//
// 三条口径：
//   ① PERUSAHAAN JAWATAN 按台账既定三档口径译「局营公司」（Perjan→局营、Perum→公营、
//      Persero→公营有限），不并作「公营」。同族 ID-H1231 作「公营公司」属存量不一致，
//      待用户裁定回填，本批不擅改。
//   ② zh 不写「dr.」敬称（「…医生医院」不成词），敬称留给 en/vi/th/ms——沿 b28 口径：
//      zh 只留中文名，原文细节留在其余四语。
//   ③ 医院名属专名：音译部分用常用译名（芝普托·芒贡库苏莫、哈桑·萨迪金、萨尔吉托、
//      瓦希丁·苏迪罗胡索多、达尔迈斯），通用词（妇产儿童/心脏与血管/癌症/友谊）按义译。
'use strict';
const fs = require('fs');
const path = require('path');

// 医院名五语（zh 省敬称；其余四语保留 Dr./ดร.）
const H = {
  harapanAnak: {
    zh: '雅加达哈拉潘基塔妇产儿童医院',
    en: 'Harapan Kita Maternal and Child Hospital Jakarta',
    vi: 'Bệnh viện Nhi và Sản Harapan Kita Jakarta',
    th: 'โรงพยาบาลแม่และเด็กฮาราปันกีตา จาการ์ตา',
    ms: 'Hospital Kanak-Kanak dan Bersalin Harapan Kita Jakarta',
  },
  cipto: {
    zh: '雅加达芝普托·芒贡库苏莫医院',
    en: 'Dr. Cipto Mangunkusumo Hospital Jakarta',
    vi: 'Bệnh viện Bác sĩ Cipto Mangunkusumo Jakarta',
    th: 'โรงพยาบาลดร.จิปโต มังกุนกูซูโม จาการ์ตา',
    ms: 'Hospital Dr. Cipto Mangunkusumo Jakarta',
  },
  hasan: {
    zh: '万隆哈桑·萨迪金医院',
    en: 'Dr. Hasan Sadikin Hospital Bandung',
    vi: 'Bệnh viện Bác sĩ Hasan Sadikin Bandung',
    th: 'โรงพยาบาลดร.ฮาซัน ซาดีกิน บันดุง',
    ms: 'Hospital Dr. Hasan Sadikin Bandung',
  },
  kariadi: {
    zh: '三宝垄卡里亚迪医院',
    en: 'Dr. Kariadi Hospital Semarang',
    vi: 'Bệnh viện Bác sĩ Kariadi Semarang',
    th: 'โรงพยาบาลดร.การีอาดี เซอมารัง',
    ms: 'Hospital Dr. Kariadi Semarang',
  },
  djamil: {
    zh: '巴东穆罕默德·贾米尔医院',
    en: 'Dr. M. Djamil Hospital Padang',
    vi: 'Bệnh viện Bác sĩ M. Djamil Padang',
    th: 'โรงพยาบาลดร.ม. จามิล ปาดัง',
    ms: 'Hospital Dr. M. Djamil Padang',
  },
  hoesin: {
    zh: '巨港穆罕默德·胡辛医院',
    en: 'Dr. Mohammad Hoesin Hospital Palembang',
    vi: 'Bệnh viện Bác sĩ Mohammad Hoesin Palembang',
    th: 'โรงพยาบาลดร.โมฮัมหมัด ฮูเซน ปาเล็มบัง',
    ms: 'Hospital Dr. Mohammad Hoesin Palembang',
  },
  sardjito: {
    zh: '日惹萨尔吉托医院',
    en: 'Dr. Sardjito Hospital Yogyakarta',
    vi: 'Bệnh viện Bác sĩ Sardjito Yogyakarta',
    th: 'โรงพยาบาลดร.ซาร์จีโต โยกยาการ์ตา',
    ms: 'Hospital Dr. Sardjito Yogyakarta',
  },
  wahidin: {
    zh: '望加锡瓦希丁·苏迪罗胡索多医院',
    en: 'Dr. Wahidin Sudirohusodo Hospital Makassar',
    vi: 'Bệnh viện Bác sĩ Wahidin Sudirohusodo Makassar',
    th: 'โรงพยาบาลดร.วาฮีดิน ซูดีโรฮูโซโด มากัสซาร์',
    ms: 'Hospital Dr. Wahidin Sudirohusodo Makassar',
  },
  harapanJantung: {
    zh: '雅加达哈拉潘基塔心脏与血管医院',
    en: 'Harapan Kita Heart and Blood Vessel Hospital Jakarta',
    vi: 'Bệnh viện Tim và Mạch máu Harapan Kita Jakarta',
    th: 'โรงพยาบาลหัวใจและหลอดเลือดฮาราปันกีตา จาการ์ตา',
    ms: 'Hospital Jantung dan Pembuluh Darah Harapan Kita Jakarta',
  },
  dharmais: {
    zh: '雅加达达尔迈斯癌症医院',
    en: 'Dharmais Cancer Hospital Jakarta',
    vi: 'Bệnh viện Ung thư Dharmais Jakarta',
    th: 'โรงพยาบาลมะเร็งดาร์ไมส์ จาการ์ตา',
    ms: 'Hospital Kanser Dharmais Jakarta',
  },
  persahabatan: {
    zh: '雅加达友谊医院',
    en: 'Persahabatan Hospital Jakarta',
    vi: 'Bệnh viện Persahabatan Jakarta',
    th: 'โรงพยาบาลเปอร์ซาฮาบาตัน จาการ์ตา',
    ms: 'Hospital Persahabatan Jakarta',
  },
};

const FR = (h) => ({
  zh: `设立${h.zh}局营公司法`,
  en: `Law on the Establishment of ${h.en} as a Departmental Undertaking`,
  vi: `Luật về Việc Thành lập ${h.vi} thành Doanh nghiệp trực thuộc Cục`,
  th: `พระราชบัญญัติว่าด้วยการจัดตั้ง${h.th}เป็นรัฐวิสาหกิจสังกัดกรม`,
  ms: `Akta tentang Penubuhan ${h.ms} sebagai Perusahaan Jawatan`,
});

// [id, 医院键, 标题中须出现的拉丁串（自校验）]
const ROWS = [
  ['ID-H1232', 'harapanAnak', 'HARAPAN KITA JAKARTA'],
  ['ID-H1233', 'cipto', 'CIPTO MANGUNKUSUMO'],
  ['ID-H1234', 'hasan', 'HASAN SADIKIN BANDUNG'],
  ['ID-H1235', 'kariadi', 'KARIADI SEMARANG'],
  ['ID-H1236', 'djamil', 'DJAMIL PADANG'],
  ['ID-H1237', 'hoesin', 'HOESIN PALEMBANG'],
  ['ID-H1238', 'sardjito', 'SARDJITO YOGYAKARTA'],
  ['ID-H1239', 'wahidin', 'WAHIDIN SUDIROHUSODO MAKASSAR'],
  ['ID-H1241', 'harapanJantung', 'JANTUNG DAN PEMBULUH DARAH'],
  ['ID-H1242', 'dharmais', 'KANKER DHARMAIS'],
  ['ID-H1243', 'persahabatan', 'PERSAHABATAN JAKARTA'],
];

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const [id, hk, must] of ROWS) {
  const h = H[hk];
  if (!h) throw new Error('缺医院槽 ' + hk);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '').toUpperCase();
  if (!orig.includes(must)) bad.push(id + ' 标题不含「' + must + '」：' + orig);
  if (!/^PENDIRIAN PERUSAHAAN JAWATAN/i.test(orig)) bad.push(id + ' 标题非 PENDIRIAN PERUSAHAAN JAWATAN：' + orig);
  items[id] = FR(h);
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 11) throw new Error('条目数应为 11，实为 ' + n);
const out = path.join(__dirname, '_id_b41.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b41', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
