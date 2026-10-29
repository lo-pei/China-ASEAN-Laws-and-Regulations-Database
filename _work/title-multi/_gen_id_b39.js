// b39：ID 长标题族「PENGESAHAN PERSETUJUAN ANTARA …」（批准双边协定/条约）11 条全收官。
// 该族 11 条此前五语全空，10 个唯一标题（ID-H1670 与 ID-H1672 同为 2003 年印尼—越南大陆架协定）。
//
// 句式：
//   zh  批准印度尼西亚共和国政府与{对方}政府关于{主题}的{协定|条约}
//   en  Law on the Ratification of the Agreement between the Government of the Republic of Indonesia
//       and the Government of {对方} on {主题}
//   vi  Luật về Việc Phê chuẩn Hiệp định giữa Chính phủ Cộng hòa Indonesia và Chính phủ {对方} về {主题}
//   th  พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างรัฐบาลสาธารณรัฐอินโดนีเซียกับรัฐบาล{对方}ว่าด้วย{主题}
//   ms  Akta tentang Pengesahan Persetujuan antara Pemerintah Republik Indonesia dan Pemerintah {对方} tentang {主题}
//
// 两条口径：
//   ① 8 条标题在 110 字符处被 OCR 截断，协定全称一律取正文首段
//      「Pengesahan Persetujuan antara Pemerintah … dan … tentang …」括注的英文原名核对。
//   ② ID-H1386 原文作「PEMERINTAH REPUBLIK HONGKONG」/「GOVERNMENT OF HONGKONG」，
//      香港非共和国，译名按「中国香港特别行政区政府」出，不照搬原文错误称谓。
//      同条正文括注的英文原件名 "SERRENDER" 亦为原件拼写错误，不据以改动译名。
//   ③ ID-H2639 原文用 TREATY（条约）而非 PERSETUJUAN/AGREEMENT（协定），
//      且主体是国家而非政府，译名随之改为「印度尼西亚共和国与中华人民共和国关于引渡的条约」。
'use strict';
const fs = require('fs');
const path = require('path');

// 对方（政府/国家）
const P = {
  vietnam: {
    zh: '越南社会主义共和国', en: 'the Socialist Republic of Vietnam', vi: 'Cộng hòa Xã hội Chủ nghĩa Việt Nam',
    th: 'สาธารณรัฐสังคมนิยมเวียดนาม', ms: 'Republik Sosialis Vietnam',
  },
  india: {
    zh: '印度共和国', en: 'the Republic of India', vi: 'Cộng hòa Ấn Độ',
    th: 'สาธารณรัฐอินเดีย', ms: 'Republik India',
  },
  hongkong: {
    zh: '中国香港特别行政区', en: 'the Hong Kong Special Administrative Region of the People\'s Republic of China',
    vi: 'Đặc khu Hành chính Hồng Kông thuộc Cộng hòa Nhân dân Trung Hoa',
    th: 'เขตบริหารพิเศษฮ่องกงแห่งสาธารณรัฐประชาชนจีน', ms: 'Wilayah Pentadbiran Khas Hong Kong Republik Rakyat China',
  },
  filipina: {
    zh: '菲律宾共和国', en: 'the Republic of the Philippines', vi: 'Cộng hòa Philippines',
    th: 'สาธารณรัฐฟิลิปปินส์', ms: 'Republik Filipina',
  },
  polandia: {
    zh: '波兰共和国', en: 'the Republic of Poland', vi: 'Cộng hòa Ba Lan',
    th: 'สาธารณรัฐโปแลนด์', ms: 'Republik Poland',
  },
  china: {
    zh: '中华人民共和国', en: 'the People\'s Republic of China', vi: 'Cộng hòa Nhân dân Trung Hoa',
    th: 'สาธารณรัฐประชาชนจีน', ms: 'Republik Rakyat China',
  },
  thailand: {
    zh: '泰王国', en: 'the Kingdom of Thailand', vi: 'Vương quốc Thái Lan',
    th: 'ราชอาณาจักรไทย', ms: 'Kerajaan Thailand',
  },
  korea: {
    zh: '大韩民国', en: 'the Republic of Korea', vi: 'Đại Hàn Dân Quốc',
    th: 'สาธารณรัฐเกาหลี', ms: 'Republik Korea',
  },
};

// 主题
const S = {
  landas: {
    zh: '2003年大陆架界线的划定',
    en: 'the Delimitation of the Continental Shelf Boundary, 2003',
    vi: 'Việc Phân định Ranh giới Thềm Lục địa năm 2003',
    th: 'การกำหนดเขตแดนไหล่ทวีป ค.ศ. 2003',
    ms: 'Penetapan Sempadan Pentas Benua, 2003',
  },
  hankam: {
    zh: '防务与安全领域合作活动',
    en: 'Cooperative Activities in the Field of Defense and Security',
    vi: 'Các Hoạt động Hợp tác trong Lĩnh vực Quốc phòng và An ninh',
    th: 'กิจกรรมความร่วมมือในด้านกลาโหมและความมั่นคง',
    ms: 'Kegiatan Kerjasama di Bidang Pertahanan dan Keamanan',
  },
  hankamID: {
    zh: '防务领域合作活动',
    en: 'Cooperative Activities in the Field of Defence',
    vi: 'Các Hoạt động Hợp tác trong Lĩnh vực Quốc phòng',
    th: 'กิจกรรมความร่วมมือในด้านกลาโหม',
    ms: 'Kegiatan Kerjasama Aktivitas di Bidang Pertahanan',
  },
  ekstradisi: {
    zh: '引渡',
    en: 'Extradition',
    vi: 'Dẫn độ',
    th: 'การส่งผู้ร้ายข้ามแดน',
    ms: 'Ekstradisi',
  },
  fugitive: {
    zh: '移交逃犯',
    en: 'the Surrender of Fugitive Offenders',
    vi: 'Việc Dẫn độ Người phạm tội bỏ trốn',
    th: 'การส่งตัวผู้กระทำผิดที่หลบหนี',
    ms: 'Penyerahan Pesalah yang Melarikan Diri',
  },
  pertahananPL: {
    zh: '防务合作',
    en: 'Co-operation in the Field of Defence',
    vi: 'Hợp tác trong Lĩnh vực Quốc phòng',
    th: 'ความร่วมมือในด้านกลาโหม',
    ms: 'Kerjasama di Bidang Pertahanan',
  },
  kee: {
    zh: '2014年专属经济区界线的划定',
    en: 'the Delimitation of the Exclusive Economic Zone Boundary, 2014',
    vi: 'Việc Phân định Ranh giới Vùng Kinh tế Đặc quyền năm 2014',
    th: 'การกำหนดเขตแดนเขตเศรษฐกิจจำเพาะ ค.ศ. 2014',
    ms: 'Penetapan Sempadan Zon Ekonomi Eksklusif, 2014',
  },
};

// inst: 'persetujuan'（协定）| 'traktat'（条约，主体为国家）
function FR(p, s, inst = 'persetujuan') {
  const out = {};
  if (inst === 'traktat') {
    out.zh = `批准印度尼西亚共和国与${p.zh}关于${s.zh}的条约`;
    out.en = `Law on the Ratification of the Treaty between the Republic of Indonesia and ${p.en} on ${s.en}`;
    out.vi = `Luật về Việc Phê chuẩn Hiệp ước giữa Cộng hòa Indonesia và ${p.vi} về ${s.vi}`;
    out.th = `พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างสาธารณรัฐอินโดนีเซียกับ${p.th}ว่าด้วย${s.th}`;
    out.ms = `Akta tentang Pengesahan Perjanjian antara Republik Indonesia dan ${p.ms} tentang ${s.ms}`;
    return out;
  }
  out.zh = `批准印度尼西亚共和国政府与${p.zh}政府关于${s.zh}的协定`;
  out.en = `Law on the Ratification of the Agreement between the Government of the Republic of Indonesia and the Government of ${p.en} on ${s.en}`;
  out.vi = `Luật về Việc Phê chuẩn Hiệp định giữa Chính phủ Cộng hòa Indonesia và Chính phủ ${p.vi} về ${s.vi}`;
  out.th = `พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างรัฐบาลสาธารณรัฐอินโดนีเซียกับรัฐบาล${p.th}ว่าด้วย${s.th}`;
  out.ms = `Akta tentang Pengesahan Persetujuan antara Pemerintah Republik Indonesia dan Pemerintah ${p.ms} tentang ${s.ms}`;
  return out;
}

const ROWS = [
  ['ID-H1670', 'vietnam', 'landas'],
  ['ID-H1672', 'vietnam', 'landas'],
  ['ID-H1562', 'india', 'hankamID'],
  ['ID-H1386', 'hongkong', 'fugitive'],
  ['ID-H1671', 'filipina', 'hankam'],
  ['ID-H2571', 'polandia', 'pertahananPL'],
  ['ID-H2572', 'china', 'hankamID'],
  ['ID-H2638', 'filipina', 'kee'],
  ['ID-H2639', 'china', 'ekstradisi', 'traktat'],
  ['ID-H2716', 'thailand', 'pertahananPL'],
  ['ID-H2717', 'korea', 'pertahananPL'],
];

const items = {};
const over = [];
for (const [id, pk, sk, inst] of ROWS) {
  const t = FR(P[pk], S[sk], inst);
  items[id] = t;
  for (const [k, v] of Object.entries(t)) if (v.length > 320) over.push(id + '/' + k + '=' + v.length);
}
const n = Object.keys(items).length;
if (n !== 11) throw new Error('条目数应为 11，实为 ' + n);
if (over.length) throw new Error('超长：' + over.join(', '));

const out = path.join(__dirname, '_id_b39.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b39', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
