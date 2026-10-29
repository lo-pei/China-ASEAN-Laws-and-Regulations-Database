// b48：ID「PEMINDAHAN IBU KOTA KABUPATEN …」（县首府迁移，14 条）。
//
// 标题结构高度一致：
//   PEMINDAHAN IBU KOTA KABUPATEN {X} DARI [WILAYAH] {KOTA A | A KECAMATAN B | DISTRIK A}
//     KE [WILAYAH] [NAGARI|KECAMATAN] {C} [KECAMATAN D] KABUPATEN {X} [PROVINSI {P}]
//
// 五语：
//   zh  {X}县首府由{起点}迁至{终点}法
//   en  Law on the Relocation of the Capital of {X} Regency from {起点} to {终点}
//   vi  Luật về Việc Di dời Thủ phủ huyện {X} từ {起点} đến {终点}
//   th  พระราชบัญญัติว่าด้วยการย้ายที่ตั้งเมืองหลวงของอำเภอ{X} จาก{起点} ไปยัง{终点}
//   ms  Akta tentang Pemindahan Ibu Pejabat Kabupaten {X} dari {起点} ke {终点}
//
// 三条口径：
//   ① **起点与终点都要译**。库里同族的 `ID-H1209`（西龙目县首府迁移法）、`ID-H955`
//      （勿加泗二级行政区县首府迁移法）只译到县名，是因为其标题本身止于「KABUPATEN X」
//      （原件即如此，非删节）；本条 14 部标题带完整 DARI … KE …，属标题实有信息，
//      不据此删。`ID-H2813` 标题尾部被 OCR 截断（「DARI WILA」），故其译名亦止于县名。
//   ② 行政层级对照固定：kabupaten→县/Regency/Huyện/อำเภอ/Kabupaten，
//      kota→市/City/Thành phố/นคร/Bandar，kecamatan→镇/District/xã/ตำบล/Kecamatan，
//      nagari→村/Nagari/Nagari/นาการี/Nagari，distrik（巴布亚）→区/District/Distrik/เขต/Distrik。
//      中文按「省→县→镇→村」由大到小排列，其余四语按「地名→镇→县→省」由小到大排列。
//   ③ ms 沿用库内既有写法「Ibu Pejabat」（同族 `ID-H1209`），不另立「Ibu Kota」。
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

/* ---------------- 专名表 ----------------
   id 用于回查原文拼写（部分条目原文拼写与通名不同，如 SUNGAIPENUH），
   z/e/v/t 分别为中/英/越/泰写法，v 缺省同 e。 */
const D = {
  /* 省 */
  SumateraBarat: { z: '西苏门答腊', e: 'West Sumatra', i: 'Sumatera Barat', v: 'Tây Sumatera', t: 'สุมาตราตะวันตก' },
  JawaTimur: { z: '东爪哇', e: 'East Java', i: 'Jawa Timur', v: 'Đông Java', t: 'ชวาตะวันออก' },
  SulawesiUtara: { z: '北苏拉威西', e: 'North Sulawesi', i: 'Sulawesi Utara', v: 'Bắc Sulawesi', t: 'สุลาเวสีเหนือ' },
  Jambi: { z: '占碑', e: 'Jambi', t: 'จัมบี' },
  Maluku: { z: '马鲁古', e: 'Maluku', t: 'มาลูกู' },
  Banten: { z: '万丹', e: 'Banten', t: 'บันเต็น' },
  SumateraUtara: { z: '北苏门答腊', e: 'North Sumatra', i: 'Sumatera Utara', v: 'Bắc Sumatera', t: 'สุมาตราเหนือ' },
  PapuaBarat: { z: '西巴布亚', e: 'West Papua', i: 'Papua Barat', v: 'Tây Papua', t: 'ปาปัวตะวันตก' },
  /* 县 */
  Ngada: { z: '恩加达', e: 'Ngada', t: 'งาดา' },
  AcehTimur: { z: '东亚齐', e: 'East Aceh', i: 'Aceh Timur', v: 'Đông Aceh', t: 'อาเจะฮ์ตะวันออก' },
  Malang: { z: '玛琅', e: 'Malang', t: 'มาลัง' },
  PadangPariaman: { z: '巴东帕里亚曼', e: 'Padang Pariaman', t: 'ปาดังปารีอามัน' },
  Blitar: { z: '勿里达', e: 'Blitar', t: 'บลิตาร์' },
  BolaangMongondow: { z: '博朗蒙贡多', e: 'Bolaang Mongondow', t: 'โบลาอังมองกนโดว์' },
  Madiun: { z: '马迪恩', e: 'Madiun', t: 'มาดิอุน' },
  Probolinggo: { z: '庞越', e: 'Probolinggo', t: 'โปรโบลิงโก' },
  Kerinci: { z: '葛林芝', e: 'Kerinci', t: 'เกอรินจี' },
  MalukuTenggara: { z: '东南马鲁古', e: 'Southeast Maluku', i: 'Maluku Tenggara', v: 'Đông Nam Maluku', t: 'มาลูกูตะวันออกเฉียงใต้' },
  Serang: { z: '西冷', e: 'Serang', t: 'เซอรัง' },
  Nias: { z: '尼亚斯', e: 'Nias', t: 'นีอัส' },
  Pasuruan: { z: '巴苏鲁安', e: 'Pasuruan', t: 'ปาซูรูอัน' },
  Maybrat: { z: '马伊布拉特', e: 'Maybrat', t: 'มัยบรัต' },
  /* 市 / 镇 / 村 / 区 */
  Langsa: { z: '兰沙', e: 'Langsa', t: 'ลังซา' },
  Pariaman: { z: '帕里亚曼', e: 'Pariaman', t: 'ปารีอามัน' },
  Kotamobagu: { z: '哥打莫巴古', e: 'Kotamobagu', t: 'โกตามอบากู' },
  SungaiPenuh: { z: '双溪佩努', e: 'Sungai Penuh', t: 'สูไงเปอนุฮ์' },
  Tual: { z: '图阿尔', e: 'Tual', t: 'ตูอัล' },
  Gunungsitoli: { z: '古农西托利', e: 'Gunungsitoli', t: 'กูนุงซีโตลี' },
  Aesesa: { z: '阿埃塞萨', e: 'Aesesa', t: 'อาเอเซซา' },
  Mbay: { z: '姆巴伊', e: 'Mbay', t: 'เอมไบ' },
  Bajawa: { z: '巴贾瓦', e: 'Bajawa', t: 'บาจาวา' },
  IdiRayeuk: { z: '伊迪拉耶克', e: 'Idi Rayeuk', t: 'อีดีรายึก' },
  Kepanjen: { z: '克潘真', e: 'Kepanjen', t: 'เกอปันเจิน' },
  ParitMalintang: { z: '帕里特马林唐', e: 'Parit Malintang', t: 'ปาริตมาลินตัง' },
  EnamLingkung: { z: '埃南林孔', e: 'Enam Lingkung', t: 'เออนัมลิงกุง' },
  Kanigoro: { z: '卡尼戈罗', e: 'Kanigoro', t: 'กานีโกโร' },
  Lolak: { z: '洛拉克', e: 'Lolak', t: 'โลลัก' },
  Mejayan: { z: '美雅延', e: 'Mejayan', t: 'เมอจายัน' },
  Kraksaan: { z: '克拉坎', e: 'Kraksaan', t: 'ครักซาอัน' },
  Siulak: { z: '西乌拉克', e: 'Siulak', t: 'ซีอูลัก' },
  KeiKecil: { z: '小凯伊', e: 'Kei Kecil', t: 'เกย์เกอจิล' },
  Ciruas: { z: '芝鲁阿斯', e: 'Ciruas', t: 'จีรูอัส' },
  Gido: { z: '吉多', e: 'Gido', t: 'กีโด' },
  Bangil: { z: '邦吉尔', e: 'Bangil', t: 'บางิล' },
  Ayamaru: { z: '阿亚马鲁', e: 'Ayamaru', t: 'อายามารู' },
  Aifat: { z: '艾法特', e: 'Aifat', t: 'ไอฟัต' },
  Kumurkek: { z: '库穆尔凯克', e: 'Kumurkek', t: 'กูมูร์เกก' },
};

// 行政通名：{zh, en, vi, th, ms}
const U = {
  kab: { zh: '县', en: 'Regency', vi: 'Huyện', th: 'อำเภอ', ms: 'Kabupaten' },
  kota: { zh: '市', en: 'City', vi: 'Thành phố', th: 'นคร', ms: 'Bandar' },
  kec: { zh: '镇', en: 'District', vi: 'xã', th: 'ตำบล', ms: 'Kecamatan' },
  nag: { zh: '村', en: 'Nagari', vi: 'Nagari', th: 'นาการี', ms: 'Nagari' },
  dis: { zh: '区', en: 'District', vi: 'Distrik', th: 'เขต', ms: 'Distrik' },
  prov: { zh: '省', en: 'Province', vi: 'Tỉnh', th: 'จังหวัด', ms: 'Wilayah' },
};

const nm = (k) => { const d = D[k]; if (!d) throw new Error('缺专名 ' + k); return d; };

// o = { prov, reg, dist, kind:'kec'|'dis', name, unit:'kota'|'nag' }
function zh(o) {
  let s = '';
  if (o.prov) s += nm(o.prov).z + U.prov.zh;
  if (o.reg) s += nm(o.reg).z + U.kab.zh;
  if (o.dist) s += nm(o.dist).z + U[o.kind || 'kec'].zh;
  if (o.name) s += nm(o.name).z + (o.unit ? U[o.unit].zh : '');
  return s;
}
function en(o) {
  let head;
  if (o.name && o.dist) head = `${nm(o.name).e} in ${nm(o.dist).e} ${U[o.kind || 'kec'].en}`;
  else if (o.name) head = `${nm(o.name).e}${o.unit ? ' ' + U[o.unit].en : ''}`;
  else head = `${nm(o.dist).e} ${U[o.kind || 'kec'].en}`;
  const tail = [];
  if (o.reg) tail.push(`${nm(o.reg).e} ${U.kab.en}`);
  if (o.prov) tail.push(`${nm(o.prov).e} ${U.prov.en}`);
  return tail.length ? head + ', ' + tail.join(', ') : head;
}
const L = (d, f) => (d.v || d.e);
function vi(o) {
  let head;
  if (o.name && o.dist) head = `${nm(o.name).e} thuộc ${U[o.kind || 'kec'].vi} ${nm(o.dist).e}`;
  else if (o.name) head = `${o.unit ? U[o.unit].vi + ' ' : ''}${nm(o.name).e}`;
  else head = `${U[o.kind || 'kec'].vi} ${nm(o.dist).e}`;
  const tail = [];
  if (o.reg) tail.push(`${U.kab.vi} ${nm(o.reg).v || nm(o.reg).e}`);
  if (o.prov) tail.push(`${U.prov.vi} ${nm(o.prov).v || nm(o.prov).e}`);
  return tail.length ? head + ', ' + tail.join(', ') : head;
}
function th(o) {
  let head;
  if (o.name && o.dist) head = `${nm(o.name).t}ใน${U[o.kind || 'kec'].th}${nm(o.dist).t}`;
  else if (o.name) head = `${o.unit ? U[o.unit].th : ''}${nm(o.name).t}`;
  else head = `${U[o.kind || 'kec'].th}${nm(o.dist).t}`;
  const tail = [];
  if (o.reg) tail.push(`${U.kab.th}${nm(o.reg).t}`);
  if (o.prov) tail.push(`${U.prov.th}${nm(o.prov).t}`);
  return tail.length ? head + ' ' + tail.join(' ') : head;
}
const MI = (k) => { const d = nm(k); return d.i || d.e; };
function ms(o) {
  let head;
  if (o.name && o.dist) head = `${MI(o.name)} di ${U[o.kind || 'kec'].ms} ${MI(o.dist)}`;
  else if (o.name) head = `${o.unit ? U[o.unit].ms + ' ' : ''}${MI(o.name)}`;
  else head = `${U[o.kind || 'kec'].ms} ${MI(o.dist)}`;
  const tail = [];
  if (o.reg) tail.push(`${U.kab.ms} ${MI(o.reg)}`);
  if (o.prov) tail.push(`${U.prov.ms} ${MI(o.prov)}`);
  return tail.length ? head + ', ' + tail.join(', ') : head;
}

/* ---------------- 逐条 ---------------- */
// chk：原文必须出现的大写片段（防串行、防臆造地名）
const ITEMS = [
  { id: 'ID-H1540', reg: 'Ngada', fr: { name: 'Mbay', dist: 'Aesesa' }, to: { name: 'Bajawa' }, chk: ['NGADA', 'MBAY', 'AESESA', 'BAJAWA'] },
  { id: 'ID-H1647', reg: 'AcehTimur', fr: { name: 'Langsa', unit: 'kota' }, to: { dist: 'IdiRayeuk', reg: 'AcehTimur' }, chk: ['ACEH TIMUR', 'LANGSA', 'IDI RAYEUK'] },
  { id: 'ID-H1771', reg: 'Malang', fr: { name: 'Malang', unit: 'kota' }, to: { dist: 'Kepanjen', reg: 'Malang' }, chk: ['KABUPATEN MALANG', 'KOTA MALANG', 'KEPANJEN'] },
  { id: 'ID-H1772', reg: 'PadangPariaman', prov: 'SumateraBarat', fr: { name: 'Pariaman', unit: 'kota' }, to: { name: 'ParitMalintang', unit: 'nag', dist: 'EnamLingkung', reg: 'PadangPariaman' }, chk: ['PADANG PARIAMAN', 'PARIAMAN', 'PARIT MALINTANG', 'ENAM LINGKUNG', 'SUMATERA BARAT'] },
  { id: 'ID-H1953', reg: 'Blitar', prov: 'JawaTimur', fr: { name: 'Blitar', unit: 'kota' }, to: { dist: 'Kanigoro', reg: 'Blitar' }, chk: ['KABUPATEN BLITAR', 'KOTA BLITAR', 'KANIGORO', 'JAWA TIMUR'] },
  { id: 'ID-H1954', reg: 'BolaangMongondow', prov: 'SulawesiUtara', fr: { name: 'Kotamobagu', unit: 'kota' }, to: { dist: 'Lolak', reg: 'BolaangMongondow' }, chk: ['BOLAANG MONGONDOW', 'KOTAMOBAGU', 'LOLAK', 'SULAWESI UTARA'] },
  { id: 'ID-H1955', reg: 'Madiun', prov: 'JawaTimur', fr: { name: 'Madiun', unit: 'kota' }, to: { dist: 'Mejayan', reg: 'Madiun' }, chk: ['KABUPATEN MADIUN', 'KOTA MADIUN', 'MEJAYAN', 'JAWA TIMUR'] },
  { id: 'ID-H1956', reg: 'Probolinggo', prov: 'JawaTimur', fr: { name: 'Probolinggo', unit: 'kota' }, to: { dist: 'Kraksaan', reg: 'Probolinggo' }, chk: ['KABUPATEN PROBOLINGGO', 'KOTA PROBOLINGGO', 'KRAKSAAN', 'JAWA TIMUR'] },
  { id: 'ID-H2054', reg: 'Kerinci', prov: 'Jambi', fr: { name: 'SungaiPenuh', unit: 'kota' }, to: { dist: 'Siulak', reg: 'Kerinci' }, chk: ['KERINCI', 'SUNGAIPENUH', 'SIULAK', 'JAMBI'] },
  { id: 'ID-H2055', reg: 'MalukuTenggara', prov: 'Maluku', fr: { name: 'Tual', unit: 'kota' }, to: { dist: 'KeiKecil', reg: 'MalukuTenggara' }, chk: ['MALUKU TENGGARA', 'TUAL', 'KEI KECIL', 'PROVINSI MALUKU'] },
  { id: 'ID-H2159', reg: 'Serang', prov: 'Banten', fr: { name: 'Serang', unit: 'kota' }, to: { dist: 'Ciruas', reg: 'Serang' }, chk: ['KABUPATEN SERANG', 'KOTA SERANG', 'CIRUAS', 'BANTEN'] },
  { id: 'ID-H2559', reg: 'Nias', prov: 'SumateraUtara', fr: { name: 'Gunungsitoli', unit: 'kota' }, to: { dist: 'Gido', reg: 'Nias' }, chk: ['KABUPATEN NIAS', 'GUNUNGSITOLI', 'GIDO', 'SUMATERA UTARA'] },
  { id: 'ID-H2560', reg: 'Pasuruan', prov: 'JawaTimur', fr: { name: 'Pasuruan', unit: 'kota' }, to: { dist: 'Bangil', reg: 'Pasuruan' }, chk: ['KABUPATEN PASURUAN', 'KOTA PASURUAN', 'BANGIL', 'JAWA TIMUR'] },
  { id: 'ID-H2790', reg: 'Maybrat', prov: 'PapuaBarat', fr: { dist: 'Ayamaru', kind: 'dis' }, to: { name: 'Kumurkek', dist: 'Aifat', kind: 'dis', reg: 'Maybrat' }, chk: ['MAYBRAT', 'AYAMARU', 'KUMURKEK', 'AIFAT', 'PAPUA BARAT'] },
];

const items = {};
const bad = [];
for (const it of ITEMS) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, it.id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '').toUpperCase().replace(/\s+/g, ' ');
  if (!/^PEMINDAHAN IBU KOTA KABUPATEN /.test(orig)) { bad.push(it.id + ' 标题头不符：' + orig.slice(0, 60)); continue; }
  for (const c of it.chk) if (!orig.includes(c)) bad.push(it.id + ' 原文缺片段「' + c + '」');
  // 结构自校验：DARI 之后紧跟起点，KE 之后紧跟终点，且 DARI 在 KE 之前
  const iDari = orig.indexOf(' DARI '), iKe = orig.indexOf(' KE ');
  if (iDari < 0 || iKe < 0 || iDari > iKe) bad.push(it.id + ' DARI/KE 结构异常');
  // 起点不得与终点相同
  // 省级只在标题尾部出现一次（PROVINSI X），并入终点
  const to = it.prov ? Object.assign({}, it.to, { prov: it.prov }) : it.to;
  const frS = zh(it.fr), toS = zh(to);
  if (frS === toS) bad.push(it.id + ' 起点与终点相同：' + frS);
  // 终点若含县名，须与本条县名一致
  if (it.to.reg && it.to.reg !== it.reg) bad.push(it.id + ' 终点县名与本条县名不符');
  items[it.id] = {
    zh: `${nm(it.reg).z}${U.kab.zh}首府由${frS}迁至${toS}法`,
    en: `Law on the Relocation of the Capital of ${nm(it.reg).e} ${U.kab.en} from ${en(it.fr)} to ${en(to)}`,
    vi: `Luật về Việc Di dời Thủ phủ ${U.kab.vi.toLowerCase()} ${nm(it.reg).v || nm(it.reg).e} từ ${vi(it.fr)} đến ${vi(to)}`,
    th: `พระราชบัญญัติว่าด้วยการย้ายที่ตั้งเมืองหลวงของ${U.kab.th}${nm(it.reg).t} จาก${th(it.fr)} ไปยัง${th(to)}`,
    ms: `Akta tentang Pemindahan Ibu Pejabat ${U.kab.ms} ${MI(it.reg)} dari ${ms(it.fr)} ke ${ms(to)}`,
  };
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== ITEMS.length) throw new Error('条目数不符：' + n + '/' + ITEMS.length);
const out = path.join(__dirname, '_id_b48.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b48', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
for (const [id, t] of Object.entries(items)) console.log(id, '|', t.zh);
