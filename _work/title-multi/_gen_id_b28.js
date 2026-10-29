// b28：ID 长标题族「PENGALIHAN BENTUK PERUSAHAAN …」（国企改制）23 条全收官。
// 形态：PENGALIHAN BENTUK {PN|PERUM} {公司} MENJADI {PERUM|PERSERO}，全部槽位可合成。
// 三档口径沿用既有译例：PN→国家公司、PERUM→公营公司、PERSERO→公营有限公司。
const fs = require('fs');
const path = require('path');

const DST = {
  PERSERO: {
    zh: '改制为公营有限公司',
    en: 'into a Limited Liability State Company',
    vi: 'thành Công ty Trách nhiệm Hữu hạn Nhà nước',
    th: 'เป็นบริษัทจำกัดของรัฐ',
    ms: 'menjadi Perusahaan Perseroan',
  },
  PERUM: {
    zh: '改制为公营公司',
    en: 'into a Public Corporation',
    vi: 'thành Công ty Công ích',
    th: 'เป็นรัฐวิสาหกิจ',
    ms: 'menjadi Perusahaan Umum',
  },
};

// [id, 目标形态, 源侧名称 ×5]
const ROWS = [
  ['ID-H521', 'PERUM',
    '印度尼西亚共和国国家印刷公司',
    'the State Printing Company of the Republic of Indonesia (PN Percetakan Negara Republik Indonesia)',
    'Công ty In ấn Nhà nước Cộng hòa Indonesia (PN Percetakan Negara Republik Indonesia)',
    'รัฐวิสาหกิจการพิมพ์แห่งรัฐสาธารณรัฐอินโดนีเซีย (PN Percetakan Negara Republik Indonesia)',
    'Perusahaan Negara Percetakan Negara Republik Indonesia'],
  ['ID-H773', 'PERSERO',
    '桑希扬塞里公营公司（PERUM Sang Hyang Seri）',
    'the Public Corporation Sang Hyang Seri (PERUM Sang Hyang Seri)',
    'Công ty Công ích Sang Hyang Seri (PERUM Sang Hyang Seri)',
    'รัฐวิสาหกิจสังหยังเสรี (PERUM Sang Hyang Seri)',
    'Perusahaan Umum Sang Hyang Seri'],
  ['ID-H1377', 'PERSERO',
    '国家林业公营公司（PERUM Perhutani）',
    'the State Forestry Public Corporation (PERUM Perhutani)',
    'Công ty Công ích Lâm nghiệp Nhà nước (PERUM Perhutani)',
    'รัฐวิสาหกิจป่าไม้แห่งรัฐ (PERUM Perhutani)',
    'Perusahaan Umum Kehutanan Negara (PERUM Perhutani)'],
  ['ID-H519', 'PERSERO',
    '布拉巴克国家公司（PN Blabak）',
    'the State Company Blabak (PN Blabak)',
    'Công ty Nhà nước Blabak (PN Blabak)',
    'รัฐวิสาหกิจบลาบัก (PN Blabak)',
    'Perusahaan Negara Blabak'],
  ['ID-H520', 'PERSERO',
    '帕达拉朗国家公司（PN Padalarang）',
    'the State Company Padalarang (PN Padalarang)',
    'Công ty Nhà nước Padalarang (PN Padalarang)',
    'รัฐวิสาหกิจปาดาลารัง (PN Padalarang)',
    'Perusahaan Negara Padalarang'],
  ['ID-H522', 'PERSERO',
    '武装部队社会保险公营公司',
    'the Social Insurance Public Corporation for the Armed Forces of the Republic of Indonesia (PERUM Asuransi Sosial Angkatan Bersenjata Republik Indonesia)',
    'Công ty Công ích Bảo hiểm Xã hội Lực lượng Vũ trang Cộng hòa Indonesia (PERUM Asuransi Sosial Angkatan Bersenjata Republik Indonesia)',
    'รัฐวิสาหกิจประกันสังคมกองทัพสาธารณรัฐอินโดนีเซีย (PERUM Asuransi Sosial Angkatan Bersenjata Republik Indonesia)',
    'Perusahaan Umum Asuransi Sosial Angkatan Bersenjata Republik Indonesia'],
  ['ID-H523', 'PERSERO',
    '达哈纳公营公司（PERUM Dahana）',
    'the Public Corporation Dahana (PERUM Dahana)',
    'Công ty Công ích Dahana (PERUM Dahana)',
    'รัฐวิสาหกิจดาฮานา (PERUM Dahana)',
    'Perusahaan Umum Dahana'],
  ['ID-H524', 'PERSERO',
    '盐业公营公司（PERUM Garam）',
    'the Salt Public Corporation (PERUM Garam)',
    'Công ty Công ích Muối (PERUM Garam)',
    'รัฐวิสาหกิจเกลือ (PERUM Garam)',
    'Perusahaan Umum Garam'],
  ['ID-H525', 'PERSERO',
    '第一港务公营公司（PERUM Pelabuhan I）',
    'the Port I Public Corporation (PERUM Pelabuhan I)',
    'Công ty Công ích Cảng I (PERUM Pelabuhan I)',
    'รัฐวิสาหกิจท่าเรือที่ 1 (PERUM Pelabuhan I)',
    'Perusahaan Umum Pelabuhan I'],
  ['ID-H526', 'PERSERO',
    '第二港务公营公司（PERUM Pelabuhan II）',
    'the Port II Public Corporation (PERUM Pelabuhan II)',
    'Công ty Công ích Cảng II (PERUM Pelabuhan II)',
    'รัฐวิสาหกิจท่าเรือที่ 2 (PERUM Pelabuhan II)',
    'Perusahaan Umum Pelabuhan II'],
  ['ID-H527', 'PERSERO',
    '第三港务公营公司（PERUM Pelabuhan III）',
    'the Port III Public Corporation (PERUM Pelabuhan III)',
    'Công ty Công ích Cảng III (PERUM Pelabuhan III)',
    'รัฐวิสาหกิจท่าเรือที่ 3 (PERUM Pelabuhan III)',
    'Perusahaan Umum Pelabuhan III'],
  ['ID-H528', 'PERSERO',
    '第四港务公营公司（PERUM Pelabuhan IV）',
    'the Port IV Public Corporation (PERUM Pelabuhan IV)',
    'Công ty Công ích Cảng IV (PERUM Pelabuhan IV)',
    'รัฐวิสาหกิจท่าเรือที่ 4 (PERUM Pelabuhan IV)',
    'Perusahaan Umum Pelabuhan IV'],
  ['ID-H529', 'PERSERO',
    '疏浚公营公司（PERUM Pengerukan）',
    'the Dredging Public Corporation (PERUM Pengerukan)',
    'Công ty Công ích Nạo vét (PERUM Pengerukan)',
    'รัฐวิสาหกิจขุดลอก (PERUM Pengerukan)',
    'Perusahaan Umum Pengerukan'],
  ['ID-H530', 'PERSERO',
    '航空勘测公营公司（PENAS）',
    'the Public Corporation for Aerial Survey (PENAS)',
    'Công ty Công ích Khảo sát Hàng không (PENAS)',
    'รัฐวิสาหกิจการสำรวจทางอากาศ (PENAS)',
    'Perusahaan Umum Survai Udara (PENAS)'],
  ['ID-H602', 'PERSERO',
    '第一空港公营公司（PERUM Angkasa Pura I）',
    'the Angkasa Pura I Public Corporation (PERUM Angkasa Pura I)',
    'Công ty Công ích Angkasa Pura I (PERUM Angkasa Pura I)',
    'รัฐวิสาหกิจอังคาสปุระที่ 1 (PERUM Angkasa Pura I)',
    'Perusahaan Umum Angkasa Pura I'],
  ['ID-H603', 'PERSERO',
    '第二空港公营公司（PERUM Angkasa Pura II）',
    'the Angkasa Pura II Public Corporation (PERUM Angkasa Pura II)',
    'Công ty Công ích Angkasa Pura II (PERUM Angkasa Pura II)',
    'รัฐวิสาหกิจอังคาสปุระที่ 2 (PERUM Angkasa Pura II)',
    'Perusahaan Umum Angkasa Pura II'],
  ['ID-H604', 'PERSERO',
    '河湖与渡运公营公司',
    'the River, Lake and Ferry Transport Public Corporation (PERUM Angkutan Sungai, Danau dan Penyeberangan)',
    'Công ty Công ích Vận tải Đường sông, Hồ và Phà (PERUM Angkutan Sungai, Danau dan Penyeberangan)',
    'รัฐวิสาหกิจการขนส่งทางแม่น้ำ ทะเลสาบ และการข้ามฟาก (PERUM Angkutan Sungai, Danau dan Penyeberangan)',
    'Perusahaan Umum Angkutan Sungai, Danau dan Penyeberangan'],
  ['ID-H605', 'PERSERO',
    '胡萨达巴克蒂公营公司（PERUM Husada Bhakti）',
    'the Husada Bhakti Public Corporation (PERUM Husada Bhakti)',
    'Công ty Công ích Husada Bhakti (PERUM Husada Bhakti)',
    'รัฐวิสาหกิจหุสะดาภักติ (PERUM Husada Bhakti)',
    'Perusahaan Umum Husada Bhakti'],
  ['ID-H771', 'PERSERO',
    '印度尼西亚制药公营公司（PERUM Indonesia Farma）',
    'the Indonesian Pharmaceutical Public Corporation (PERUM Indonesia Farma)',
    'Công ty Công ích Dược phẩm Indonesia (PERUM Indonesia Farma)',
    'รัฐวิสาหกิจเภสัชกรรมอินโดนีเซีย (PERUM Indonesia Farma)',
    'Perusahaan Umum Indonesia Farma'],
  ['ID-H772', 'PERSERO',
    '邮政与汇兑公营公司（PERUM Pos dan Giro）',
    'the Post and Giro Public Corporation (PERUM Pos dan Giro)',
    'Công ty Công ích Bưu chính và Chuyển khoản (PERUM Pos dan Giro)',
    'รัฐวิสาหกิจไปรษณีย์และการโอนเงิน (PERUM Pos dan Giro)',
    'Perusahaan Umum Pos dan Giro'],
  ['ID-H841', 'PERSERO',
    '国家图书出版印刷公营公司',
    'the Publishing and Printing Public Corporation Balai Pustaka (PERUM Penerbitan dan Percetakan Balai Pustaka)',
    'Công ty Công ích Xuất bản và In ấn Balai Pustaka (PERUM Penerbitan dan Percetakan Balai Pustaka)',
    'รัฐวิสาหกิจการจัดพิมพ์และการพิมพ์บาลัยปุสตากา (PERUM Penerbitan dan Percetakan Balai Pustaka)',
    'Perusahaan Umum Penerbitan dan Percetakan Balai Pustaka'],
  ['ID-H904', 'PERSERO',
    '生物制药公营公司（PERUM Bio Farma）',
    'the Bio Farma Public Corporation (PERUM Bio Farma)',
    'Công ty Công ích Bio Farma (PERUM Bio Farma)',
    'รัฐวิสาหกิจไบโอฟาร์มา (PERUM Bio Farma)',
    'Perusahaan Umum Bio Farma'],
  ['ID-H659', 'PERSERO',
    '洛卡南塔国家公司（PN Lokananta）',
    'the State Company Lokananta (PN Lokananta)',
    'Công ty Nhà nước Lokananta (PN Lokananta)',
    'รัฐวิสาหกิจโลกานันตา (PN Lokananta)',
    'Perusahaan Negara Lokananta'],
];

const items = {};
for (const [id, dst, zh, en, vi, th, ms] of ROWS) {
  if (items[id]) throw new Error('重复 id ' + id);
  const d = DST[dst];
  items[id] = {
    zh: zh + d.zh,
    en: 'the Conversion of ' + en + ' ' + d.en,
    vi: 'Chuyển đổi ' + vi + ' ' + d.vi,
    th: 'การเปลี่ยนรูปแบบ' + th + ' ' + d.th,
    ms: 'Pengalihan Bentuk ' + ms + ' ' + d.ms,
  };
}

// 覆盖校验
const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const RE = /^PENGALIHAN BENTUK PERUSAHAAN/i;
const lawdir = path.join(__dirname, '..', '..', 'prototype', 'data', 'laws');
const scope = new Set();
for (const u of buckets.long.filter((u) => RE.test(u.s))) {
  for (const id of u.ids) {
    const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
    if (['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim())) scope.add(id);
  }
}
const missing = [...scope].filter((id) => !items[id]);
const extra = Object.keys(items).filter((id) => !scope.has(id));
console.log('族内待译', scope.size, '| 写出', Object.keys(items).length);
if (missing.length) console.log('✗ 未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('✗ 越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

fs.writeFileSync(path.join(__dirname, '_id_b28.json'), JSON.stringify({ batch: 'id-p1-b28', items }, null, 1), 'utf8');
console.log('写出 _id_b28.json');
