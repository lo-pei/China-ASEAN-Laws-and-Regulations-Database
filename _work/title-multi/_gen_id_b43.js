// b43：ID 长标题两族「PENGGABUNGAN …」（吸收合并，8 条）与「PEMBUBARAN …」（解散，8 条）共 16 条，
// 此前五语全空。
//
// 甲、PENGGABUNGAN（吸收合并进既有公司）：
//   zh  将{A}并入{B}法
//   en  Law on the Consolidation of {A} into {B}
//   vi  Luật về Việc Hợp nhất {A} vào {B}
//   th  พระราชบัญญัติว่าด้วยการรวม{A}เข้าเป็น{B}
//   ms  Akta tentang Penggabungan {A} ke dalam {B}
//
// 乙、PEMBUBARAN（解散）单式：
//   zh  解散{A}法 ／ en Law on the Dissolution of {A} ／ vi Luật về Việc Giải thể {A}
//   th  พระราชบัญญัติว่าด้วยการเลิก{A} ／ ms Akta tentang Pembubaran {A}
//   复式（解散 + 清算所得追加国家资本参与）另见 FR_BUBAR2。
//
// 三条口径：
//   ① **PELEBURAN ≠ PENGGABUNGAN**：前者（b42）并入**新设**公司，用「合并为」/`into a new …`；
//      后者并入**既有**公司，用「并入」/`Consolidation … into`。二者法律效果不同
//      （前者原公司全部消灭、设立新主体；后者被合并方消灭、接收方存续），混译会掩盖差异。
//   ② PEMBUBARAN 复式里「PENAMBAHAN PENYERTAAN MODAL NEGARA」是**追加国家资本参与**，
//      不是「增资」（penambahan modal）；且资金来源限定为被解散公司清算所得，
//      故列出「源自…清算所得部分国有财产」，不简写为「以清算所得增资」。
//   ③ 标题与正文长度均达 343 字符的 ID-H500 有两个注入对象（PERUM 国家印刷 + PT Pradnya
//      Paramita），二者法律形态不同（公营公司 / 公营有限公司），必须分别标明，不可合并为「等」。
'use strict';
const fs = require('fs');
const path = require('path');

const P = 'Perusahaan Perseroan (PERSERO)';
// zh 层形态前缀：本族主体全部是 PERSERO，中文若不写「公营有限公司」，
// 读者无法与 PT / PERUM 区分，故每个主体名前都要带。
const PZ = '公营有限公司';

// 公司名五语
const C = {
  natour: { zh: '国家酒店与旅游公司（NATOUR）', en: `${P} PT Perusahaan Hotel dan Tourist Nasional (NATOUR LTD)`, vi: `Công ty TNHH Nhà nước (PERSERO) Perusahaan Hotel dan Tourist Nasional (NATOUR LTD)`, th: `บริษัทจำกัดของรัฐ (PERSERO) Perusahaan Hotel dan Tourist Nasional (NATOUR LTD)`, ms: `${P} PT Perusahaan Hotel dan Tourist Nasional (NATOUR LTD)` },
  hotelIndo: { zh: '印度尼西亚国际酒店公司', en: `${P} PT Hotel Indonesia Internasional`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Hotel Indonesia Internasional`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Hotel Indonesia Internasional`, ms: `${P} PT Hotel Indonesia Internasional` },
  soda: { zh: '印尼苏打工业公司', en: `${P} PT Industri Soda Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Industri Soda Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Industri Soda Indonesia`, ms: `${P} PT Industri Soda Indonesia` },
  garam: { zh: '盐业公司', en: `${P} PT Garam`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Garam`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Garam`, ms: `${P} PT Garam` },
  reasUmum: { zh: '印尼一般再保险公司', en: `${P} PT Reasuransi Umum Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Reasuransi Umum Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Reasuransi Umum Indonesia`, ms: `${P} PT Reasuransi Umum Indonesia` },
  reasUtama: { zh: '印尼主再保险公司', en: `${P} PT Reasuransi Indonesia Utama`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Reasuransi Indonesia Utama`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Reasuransi Indonesia Utama`, ms: `${P} PT Reasuransi Indonesia Utama` },
  pelabuhan1: { zh: '印尼港口第一公司', en: `${P} PT Pelabuhan Indonesia I`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Pelabuhan Indonesia I`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Pelabuhan Indonesia I`, ms: `${P} PT Pelabuhan Indonesia I` },
  pelabuhan2: { zh: '印尼港口第二公司', en: `${P} PT Pelabuhan Indonesia II`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Pelabuhan Indonesia II`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Pelabuhan Indonesia II`, ms: `${P} PT Pelabuhan Indonesia II` },
  pelabuhan3: { zh: '印尼港口第三公司', en: `${P} PT Pelabuhan Indonesia III`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Pelabuhan Indonesia III`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Pelabuhan Indonesia III`, ms: `${P} PT Pelabuhan Indonesia III` },
  pelabuhan4: { zh: '印尼港口第四公司', en: `${P} PT Pelabuhan Indonesia IV`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Pelabuhan Indonesia IV`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Pelabuhan Indonesia IV`, ms: `${P} PT Pelabuhan Indonesia IV` },
  dokNusantara: { zh: '努山塔拉船坞与造船公司', en: `${P} PT Dok dan Galangan Kapal Nusantara`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Dok dan Galangan Kapal Nusantara`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Dok dan Galangan Kapal Nusantara`, ms: `${P} PT Dok dan Galangan Kapal Nusantara` },
  kodja: { zh: '科贾·巴哈里船坞与船舶公司', en: `${P} PT Dok dan Perkapalan Kodja Bahari`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Dok dan Perkapalan Kodja Bahari`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Dok dan Perkapalan Kodja Bahari`, ms: `${P} PT Dok dan Perkapalan Kodja Bahari` },
  kawasanKelola: { zh: '印尼保税区管理公司', en: `${P} PT Pengelola Kawasan Berikat Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Pengelola Kawasan Berikat Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Pengelola Kawasan Berikat Indonesia`, ms: `${P} PT Pengelola Kawasan Berikat Indonesia` },
  kawasanNusantara: { zh: '努山塔拉保税区公司', en: `${P} PT Kawasan Berikat Nusantara`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Kawasan Berikat Nusantara`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Kawasan Berikat Nusantara`, ms: `${P} PT Kawasan Berikat Nusantara` },
  bhanda: { zh: '班达·加拉·雷克萨公司', en: `${P} PT Bhanda Ghara Reksa`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Bhanda Ghara Reksa`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Bhanda Ghara Reksa`, ms: `${P} PT Bhanda Ghara Reksa` },
  ppi: { zh: '印尼贸易公司', en: `${P} PT Perusahaan Perdagangan Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perusahaan Perdagangan Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perusahaan Perdagangan Indonesia`, ms: `${P} PT Perusahaan Perdagangan Indonesia` },
  ikanNusantara: { zh: '努山塔拉渔业公司', en: `${P} PT Perikanan Nusantara`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perikanan Nusantara`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perikanan Nusantara`, ms: `${P} PT Perikanan Nusantara` },
  ikanIndo: { zh: '印尼渔业公司', en: `${P} PT Perikanan Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perikanan Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perikanan Indonesia`, ms: `${P} PT Perikanan Indonesia` },
  // 解散族
  krafCilacap: { zh: '芝拉扎牛皮纸公司', en: `${P} PT Kertas Kraf Cilacap`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Kertas Kraf Cilacap`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Kertas Kraf Cilacap`, ms: `${P} PT Kertas Kraf Cilacap` },
  blabak: { zh: '布拉巴克公司', en: `${P} PT Blabak`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Blabak`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Blabak`, ms: `${P} PT Blabak` },
  kebun17: { zh: '第十七种植园公司', en: `${P} PT Perkebunan XVII`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perkebunan XVII`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perkebunan XVII`, ms: `${P} PT Perkebunan XVII` },
  kebun1516: { zh: '第十五至十六种植园公司', en: `${P} PT Perkebunan XV-XVI`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perkebunan XV-XVI`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perkebunan XV-XVI`, ms: `${P} PT Perkebunan XV-XVI` },
  perhotelan: { zh: '印尼酒店与办公物业公司', en: `${P} PT Perhotelan dan Perkantoran Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Perhotelan dan Perkantoran Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Perhotelan dan Perkantoran Indonesia`, ms: `${P} PT Perhotelan dan Perkantoran Indonesia` },
  hotelNatour: { zh: '印度尼西亚纳图尔酒店公司', en: `${P} PT Hotel Indonesia Natour`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Hotel Indonesia Natour`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Hotel Indonesia Natour`, ms: `${P} PT Hotel Indonesia Natour` },
  gitaKarya: { zh: '吉塔·卡尔亚公司', en: `${P} PT Gita Karya`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Gita Karya`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Gita Karya`, ms: `${P} PT Gita Karya` },
  impti: { zh: '印尼机床工业公司', en: `${P} PT Industri Mesin Perkakas Indonesia`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Industri Mesin Perkakas Indonesia`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Industri Mesin Perkakas Indonesia`, ms: `${P} PT Industri Mesin Perkakas Indonesia` },
  krakatau: { zh: '喀拉喀托钢铁公司', en: `${P} PT Krakatau Steel`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Krakatau Steel`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Krakatau Steel`, ms: `${P} PT Krakatau Steel` },
  kertaNiaga: { zh: '卡尔塔·尼亚加公司', en: `${P} PT Kerta Niaga`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Kerta Niaga`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Kerta Niaga`, ms: `${P} PT Kerta Niaga` },
  dharmaNiaga: { zh: '达尔玛·尼亚加公司', en: `${P} PT Dharma Niaga`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Dharma Niaga`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Dharma Niaga`, ms: `${P} PT Dharma Niaga` },
  merpati: { zh: '努山塔拉鸽航公司', en: `${P} PT Merpati Nusantara Airlines`, vi: `Công ty TNHH Nhà nước (PERSERO) PT Merpati Nusantara Airlines`, th: `บริษัทจำกัดของรัฐ (PERSERO) PT Merpati Nusantara Airlines`, ms: `${P} PT Merpati Nusantara Airlines` },
};

// H500 的两个注入对象：一个是 PERUM，一个是 PERSERO，形态不同须分别标明
const H500_TGT = {
  zh: '印度尼西亚共和国国家印刷公营公司（PERUM）与普拉德尼亚·帕拉米塔公司',
  en: 'the Capital of Perusahaan Umum (PERUM) Percetakan Negara Republik Indonesia and into the Share Capital of PT Pradnya Paramita',
  vi: 'Vốn của Công ty Công ích (PERUM) Percetakan Negara Republik Indonesia và vào Vốn Điều lệ của PT Pradnya Paramita',
  th: 'ทุนของรัฐวิสาหกิจ (PERUM) Percetakan Negara Republik Indonesia และเข้าเป็นทุนเรือนหุ้นของ PT Pradnya Paramita',
  ms: 'Modal Perusahaan Umum (PERUM) Percetakan Negara Republik Indonesia dan ke dalam Modal Saham PT Pradnya Paramita',
};

const LIST = {
  zh: { sep: '、', last: '、' },
  en: { sep: ', ', last: ' and ' },
  vi: { sep: ', ', last: ' và ' },
  th: { sep: ' ', last: ' และ' },
  ms: { sep: ', ', last: ' dan ' },
};
const joinList = (arr, k) => {
  if (arr.length === 1) return arr[0];
  const { sep, last } = LIST[k];
  return arr.slice(0, -1).join(sep) + last + arr[arr.length - 1];
};

// 甲：吸收合并
const FR_GABUNG = (srcs, tgt) => ({
  zh: `将${PZ}${joinList(srcs.map((s) => s.zh), 'zh')}并入${PZ}${tgt.zh}法`,
  en: `Law on the Consolidation of ${joinList(srcs.map((s) => s.en), 'en')} into ${tgt.en}`,
  vi: `Luật về Việc Hợp nhất ${joinList(srcs.map((s) => s.vi), 'vi')} vào ${tgt.vi}`,
  th: `พระราชบัญญัติว่าด้วยการรวม${joinList(srcs.map((s) => s.th), 'th')}เข้าเป็น${tgt.th}`,
  ms: `Akta tentang Penggabungan ${joinList(srcs.map((s) => s.ms), 'ms')} ke dalam ${tgt.ms}`,
});

// 乙-1：单纯解散
const FR_BUBAR1 = (x) => ({
  zh: `解散${PZ}${x.zh}法`,
  en: `Law on the Dissolution of ${x.en}`,
  vi: `Luật về Việc Giải thể ${x.vi}`,
  th: `พระราชบัญญัติว่าด้วยการเลิก${x.th}`,
  ms: `Akta tentang Pembubaran ${x.ms}`,
});

// 乙-2：解散 + 清算所得追加国家资本参与。三式按标题实写区分：
//   part  「DARI SEBAGIAN KEKAYAAN NEGARA HASIL LIKUIDASI」→ 部分清算所得（H501 / H653）
//   full  「DARI KEKAYAAN NEGARA HASIL LIKUIDASI」（无 SEBAGIAN）→ 全部清算所得（H500）
//   short 无清算来源从句，只写「PENAMBAHAN PENYERTAAN MODAL NEGARA」（H1363 / H835 / H951）
const FR_BUBAR2 = (x, y, variant) => {
  const out = {};
  if (variant === 'part') {
    out.zh = `解散${PZ}${x.zh}并将源自${PZ}${x.zh}清算所得部分国有财产的国有资本参与追加至${PZ}${y.zh}法`;
    out.en = `Law on the Dissolution of ${x.en} and the Addition of State Capital Participation Originating from Part of the State Assets Resulting from the Liquidation of ${x.en} into ${y.en}`;
    out.vi = `Luật về Việc Giải thể ${x.vi} và Bổ sung Phần vốn Góp của Nhà nước có Nguồn gốc từ Một phần Tài sản Nhà nước do Thanh lý ${x.vi} vào ${y.vi}`;
    out.th = `พระราชบัญญัติว่าด้วยการเลิก${x.th}และการเพิ่มทุนของรัฐซึ่งมาจากส่วนหนึ่งของทรัพย์สินของรัฐที่ได้จากการชำระบัญชี${x.th}เข้าเป็น${y.th}`;
    out.ms = `Akta tentang Pembubaran ${x.ms} dan Penambahan Penyertaan Modal Negara yang Berasal dari Sebahagian Kekayaan Negara Hasil Likuidasi ${x.ms} ke dalam ${y.ms}`;
  } else if (variant === 'full') {
    out.zh = `解散${PZ}${x.zh}并将源自${PZ}${x.zh}清算所得国有财产的国有资本参与追加至${PZ}${y.zh}法`;
    out.en = `Law on the Dissolution of ${x.en} and the Addition of State Capital Participation Originating from the State Assets Resulting from the Liquidation of ${x.en} into ${y.en}`;
    out.vi = `Luật về Việc Giải thể ${x.vi} và Bổ sung Phần vốn Góp của Nhà nước có Nguồn gốc từ Tài sản Nhà nước do Thanh lý ${x.vi} vào ${y.vi}`;
    out.th = `พระราชบัญญัติว่าด้วยการเลิก${x.th}และการเพิ่มทุนของรัฐซึ่งมาจากทรัพย์สินของรัฐที่ได้จากการชำระบัญชี${x.th}เข้าเป็น${y.th}`;
    out.ms = `Akta tentang Pembubaran ${x.ms} dan Penambahan Penyertaan Modal Negara yang Berasal dari Kekayaan Negara Hasil Likuidasi ${x.ms} ke dalam ${y.ms}`;
  } else {
    out.zh = `解散${PZ}${x.zh}并将国有资本参与追加至${PZ}${y.zh}法`;
    out.en = `Law on the Dissolution of ${x.en} and the Addition of State Capital Participation of the Republic of Indonesia into ${y.en}`;
    out.vi = `Luật về Việc Giải thể ${x.vi} và Bổ sung Phần vốn Góp của Nhà nước Cộng hòa Indonesia vào ${y.vi}`;
    out.th = `พระราชบัญญัติว่าด้วยการเลิก${x.th}และการเพิ่มทุนของรัฐสาธารณรัฐอินโดนีเซียเข้าเป็น${y.th}`;
    out.ms = `Akta tentang Pembubaran ${x.ms} dan Penambahan Penyertaan Modal Negara Republik Indonesia ke dalam ${y.ms}`;
  }
  return out;
};

const ROWS = [
  // 甲 吸收合并
  ['gabung', 'ID-H1120', ['natour'], 'hotelIndo'],
  ['gabung', 'ID-H1267', ['soda'], 'garam'],
  ['gabung', 'ID-H2479', ['reasUmum'], 'reasUtama'],
  ['gabung', 'ID-H2991', ['pelabuhan1', 'pelabuhan3', 'pelabuhan4'], 'pelabuhan2'],
  ['gabung', 'ID-H606', ['dokNusantara'], 'kodja'],
  ['gabung', 'ID-H716', ['kawasanKelola'], 'kawasanNusantara'],
  ['gabung', 'ID-H2990', ['bhanda'], 'ppi'],
  ['gabung', 'ID-H2992', ['ikanNusantara'], 'ikanIndo'],
  // 乙-1 单纯解散
  ['bubar', 'ID-H3145', 'merpati'],
  ['bubar', 'ID-H1769', 'soda'],
  // 乙-2 解散 + 追加
  ['bubar2', 'ID-H501', 'krafCilacap', 'blabak', 'part'],
  ['bubar2', 'ID-H653', 'kebun17', 'kebun1516', 'part'],
  ['bubar2', 'ID-H1363', 'perhotelan', 'hotelNatour', 'short'],
  ['bubar2', 'ID-H835', 'impti', 'krakatau', 'short'],
  ['bubar2', 'ID-H951', 'kertaNiaga', 'dharmaNiaga', 'short'],
  ['bubar2x', 'ID-H500', 'gitaKarya', 'H500', 'full'],
];

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const row of ROWS) {
  const [kind, id] = row;
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  if (kind === 'gabung') {
    const [, , srcKeys, tgtKey] = row;
    if (!/^PENGGABUNGAN PERUSAHAAN PERSEROAN/i.test(orig)) bad.push(id + ' 标题非 PENGGABUNGAN：' + orig.slice(0, 60));
    items[id] = FR_GABUNG(srcKeys.map((k) => C[k]), C[tgtKey]);
  } else if (kind === 'bubar') {
    const [, , key] = row;
    if (!/^PEMBUBARAN PERUSAHAAN PERSEROAN/i.test(orig)) bad.push(id + ' 标题非 PEMBUBARAN：' + orig.slice(0, 60));
    items[id] = FR_BUBAR1(C[key]);
  } else if (kind === 'bubar2' || kind === 'bubar2x') {
    const [, , srcKey, tgtKey, variant] = row;
    const y = kind === 'bubar2x' ? H500_TGT : C[tgtKey];
    if (!y) throw new Error('缺目标槽 ' + tgtKey);
    // 自校验：标题实写的清算来源从句须与 variant 一致，防止把「全部」写成「部分」
    const t = orig.toUpperCase();
    const hasPart = /DARI SEBAGIAN KEKAYAAN NEGARA HASIL LIKUIDASI/.test(t);
    const hasFull = /DARI KEKAYAAN NEGARA HASIL LIKUIDASI/.test(t) && !hasPart;
    const want = variant === 'part' ? hasPart : variant === 'full' ? hasFull : !hasPart && !hasFull;
    if (!want) bad.push(id + ' 清算来源句式与标题不符（part=' + hasPart + ' full=' + hasFull + ' 期望 ' + variant + '）');
    items[id] = FR_BUBAR2(C[srcKey], y, variant);
  }
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 16) throw new Error('条目数应为 16，实为 ' + n);
const out = path.join(__dirname, '_id_b43.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b43', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
