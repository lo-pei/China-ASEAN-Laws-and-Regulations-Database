// b45：ID 长标题族「PERUBAHAN NAMA KABUPATEN … MENJADI KABUPATEN …」（县名变更）10 条全收官，
// 此前五语全空。
//
// 句式：
//   zh  {旧}县更名为{新}县（{省}）法
//   en  Law on the Change of the Name of {old} Regency to {new} Regency in the Province of {prov}
//   vi  Luật về Việc Đổi tên Huyện {old} thành Huyện {new} thuộc tỉnh {prov}
//   th  พระราชบัญญัติว่าด้วยการเปลี่ยนชื่ออำเภอ{old}เป็นอำเภอ{new} จังหวัด{prov}
//   ms  Akta tentang Perubahan Nama Daerah {old} menjadi Daerah {new} di Wilayah {prov}
//
// 三条口径：
//   ① **KABUPATEN 译「县」**，与 KOTA（市）、KECAMATAN（乡/区）、PROVINSI（省）分层；
//      泰国语层用 อำเภอ、越南语层用 Huyện、马来语层用 Daerah，各语各用本国对应层级词。
//   ② **旧名与新名都要写全**：`KEPULAUAN SANGIHE DAN TALAUD → KEPULAUAN SANGIHE` 这类
//      「拆分后保留其一」的情形，若只写新名就丢失了「原县含塔劳群岛」这一事实。
//   ③ `ID-H1516`（Polewali Mamasa → Polewali Mandar）标题**没有** PROVINSI 限定，
//      译名也不加省名——其余 9 条有省名的照录。
'use strict';
const fs = require('fs');
const path = require('path');

// 地名五语（县名不带「县/Regency」，省名不带「省/Province」）
const PL = {
  kepRiau: { zh: '廖内群岛', en: 'Riau Islands', vi: 'Quần đảo Riau', th: 'หมู่เกาะเรียว', ms: 'Kepulauan Riau' },
  bintan: { zh: '民丹', en: 'Bintan', vi: 'Bintan', th: 'บินตัน', ms: 'Bintan' },
  polewaliMamasa: { zh: '波莱瓦利·马马萨', en: 'Polewali Mamasa', vi: 'Polewali Mamasa', th: 'โปเลวาลี มามาซา', ms: 'Polewali Mamasa' },
  polewaliMandar: { zh: '波莱瓦利·曼达尔', en: 'Polewali Mandar', vi: 'Polewali Mandar', th: 'โปเลวาลี มันดาร์', ms: 'Polewali Mandar' },
  mamujuUtara: { zh: '北马穆朱', en: 'North Mamuju', vi: 'Bắc Mamuju', th: 'มามูจูเหนือ', ms: 'Mamuju Utara' },
  pasangkayu: { zh: '帕桑卡尤', en: 'Pasangkayu', vi: 'Pasangkayu', th: 'ปาซังกายู', ms: 'Pasangkayu' },
  sangiheTalaud: { zh: '桑义赫与塔劳群岛', en: 'Sangihe and Talaud Islands', vi: 'Quần đảo Sangihe và Talaud', th: 'หมู่เกาะซางีเฮและตาลาอุด', ms: 'Kepulauan Sangihe dan Talaud' },
  sangihe: { zh: '桑义赫群岛', en: 'Sangihe Islands', vi: 'Quần đảo Sangihe', th: 'หมู่เกาะซางีเฮ', ms: 'Kepulauan Sangihe' },
  pontianak: { zh: '坤甸', en: 'Pontianak', vi: 'Pontianak', th: 'ปนเตียนัก', ms: 'Pontianak' },
  mempawah: { zh: '文巴瓦', en: 'Mempawah', vi: 'Mempawah', th: 'เมมปาวา', ms: 'Mempawah' },
  pasir: { zh: '帕西尔', en: 'Pasir', vi: 'Pasir', th: 'ปาซีร์', ms: 'Pasir' },
  paser: { zh: '帕塞尔', en: 'Paser', vi: 'Paser', th: 'ปาเซอร์', ms: 'Paser' },
  sawahlunto: { zh: '沙哇伦多·西朱尼荣', en: 'Sawahlunto Sijunjung', vi: 'Sawahlunto Sijunjung', th: 'ซาวาห์ลุนโตซีจุนจุง', ms: 'Sawahlunto Sijunjung' },
  sijunjung: { zh: '西朱尼荣', en: 'Sijunjung', vi: 'Sijunjung', th: 'ซีจุนจุง', ms: 'Sijunjung' },
  yapenWaropen: { zh: '亚彭·瓦罗彭', en: 'Yapen Waropen', vi: 'Yapen Waropen', th: 'ยาเปนวาโรเปน', ms: 'Yapen Waropen' },
  kepYapen: { zh: '亚彭群岛', en: 'Yapen Islands', vi: 'Quần đảo Yapen', th: 'หมู่เกาะยาเปน', ms: 'Kepulauan Yapen' },
  mtb: { zh: '西南马鲁古', en: 'West Southeast Maluku', vi: 'Tây Nam Maluku', th: 'มาลูกูตะวันออกเฉียงใต้ตะวันตก', ms: 'Maluku Tenggara Barat' },
  tanimbar: { zh: '塔宁巴尔群岛', en: 'Tanimbar Islands', vi: 'Quần đảo Tanimbar', th: 'หมู่เกาะตานิมบาร์', ms: 'Kepulauan Tanimbar' },
  tobaSamosir: { zh: '多巴·萨莫西尔', en: 'Toba Samosir', vi: 'Toba Samosir', th: 'โทบาซาโมซีร์', ms: 'Toba Samosir' },
  toba: { zh: '多巴', en: 'Toba', vi: 'Toba', th: 'โทบา', ms: 'Toba' },
  // 省
  pKepRiau: { zh: '廖内群岛省', en: 'the Riau Islands', vi: 'Quần đảo Riau', th: 'หมู่เกาะเรียว', ms: 'Kepulauan Riau' },
  pSulbar: { zh: '西苏拉威西省', en: 'West Sulawesi', vi: 'Tây Sulawesi', th: 'สุลาเวสีตะวันตก', ms: 'Sulawesi Barat' },
  pSulut: { zh: '北苏拉威西省', en: 'North Sulawesi', vi: 'Bắc Sulawesi', th: 'สุลาเวสีเหนือ', ms: 'Sulawesi Utara' },
  pKalbar: { zh: '西加里曼丹省', en: 'West Kalimantan', vi: 'Tây Kalimantan', th: 'กาลิมันตันตะวันตก', ms: 'Kalimantan Barat' },
  pKaltim: { zh: '东加里曼丹省', en: 'East Kalimantan', vi: 'Đông Kalimantan', th: 'กาลิมันตันตะวันออก', ms: 'Kalimantan Timur' },
  pSumbar: { zh: '西苏门答腊省', en: 'West Sumatra', vi: 'Tây Sumatra', th: 'สุมาตราตะวันตก', ms: 'Sumatera Barat' },
  pPapua: { zh: '巴布亚省', en: 'Papua', vi: 'Papua', th: 'ปาปัว', ms: 'Papua' },
  pMaluku: { zh: '马鲁古省', en: 'Maluku', vi: 'Maluku', th: 'มาลูกู', ms: 'Maluku' },
  pSumut: { zh: '北苏门答腊省', en: 'North Sumatra', vi: 'Bắc Sumatra', th: 'สุมาตราเหนือ', ms: 'Sumatera Utara' },
};

const FR = (oldK, newK, provK) => {
  const o = PL[oldK], n = PL[newK], p = provK ? PL[provK] : null;
  return {
    zh: p ? `${o.zh}县更名为${n.zh}县（${p.zh}）法` : `${o.zh}县更名为${n.zh}县法`,
    en: p
      ? `Law on the Change of the Name of ${o.en} Regency to ${n.en} Regency in the Province of ${p.en}`
      : `Law on the Change of the Name of ${o.en} Regency to ${n.en} Regency`,
    vi: p
      ? `Luật về Việc Đổi tên Huyện ${o.vi} thành Huyện ${n.vi} thuộc tỉnh ${p.vi}`
      : `Luật về Việc Đổi tên Huyện ${o.vi} thành Huyện ${n.vi}`,
    th: p
      ? `พระราชบัญญัติว่าด้วยการเปลี่ยนชื่ออำเภอ${o.th}เป็นอำเภอ${n.th} จังหวัด${p.th}`
      : `พระราชบัญญัติว่าด้วยการเปลี่ยนชื่ออำเภอ${o.th}เป็นอำเภอ${n.th}`,
    ms: p
      ? `Akta tentang Perubahan Nama Daerah ${o.ms} menjadi Daerah ${n.ms} di Wilayah ${p.ms}`
      : `Akta tentang Perubahan Nama Daerah ${o.ms} menjadi Daerah ${n.ms}`,
  };
};

// [id, 旧名, 新名, 省键|null, 标题须含的拉丁串]
const ROWS = [
  ['ID-H1581', 'kepRiau', 'bintan', 'pKepRiau', 'KABUPATEN BINTAN'],
  ['ID-H1516', 'polewaliMamasa', 'polewaliMandar', null, 'POLEWALI MANDAR'],
  ['ID-H2651', 'mamujuUtara', 'pasangkayu', 'pSulbar', 'PASANGKAYU'],
  ['ID-H2401', 'sangiheTalaud', 'sangihe', 'pSulut', 'KEPULAUAN SANGIHE'],
  ['ID-H2402', 'pontianak', 'mempawah', 'pKalbar', 'MEMPAWAH'],
  ['ID-H1692', 'pasir', 'paser', 'pKaltim', 'PASER'],
  ['ID-H1810', 'sawahlunto', 'sijunjung', 'pSumbar', 'SIJUNJUNG'],
  ['ID-H1811', 'yapenWaropen', 'kepYapen', 'pPapua', 'KEPULAUAN YAPEN'],
  ['ID-H2821', 'mtb', 'tanimbar', 'pMaluku', 'TANIMBAR'],
  ['ID-H2913', 'tobaSamosir', 'toba', 'pSumut', 'KABUPATEN TOBA'],
];

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const [id, ok, nk, pk, must] of ROWS) {
  if (!PL[ok] || !PL[nk] || (pk && !PL[pk])) throw new Error('缺地名槽 ' + ok + '/' + nk + '/' + pk);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  if (!orig.includes(must)) bad.push(id + ' 标题不含「' + must + '」');
  if (!/^PERUBAHAN NAMA KABUPATEN/i.test(orig)) bad.push(id + ' 标题非 PERUBAHAN NAMA KABUPATEN');
  // 省名自校验：标题有 PROVINSI 就必须给省，没有就不给
  const hasProv = /PROVINSI/i.test(orig);
  if (hasProv !== !!pk) bad.push(id + ' 省名判定不符（标题 PROVINSI=' + hasProv + '，表内 ' + (pk || '无') + '）');
  items[id] = FR(ok, nk, pk);
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 10) throw new Error('条目数应为 10，实为 ' + n);
const out = path.join(__dirname, '_id_b45.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b45', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
