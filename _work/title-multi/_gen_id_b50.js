// b50：ID「PEMINDAHAN IBUKOTA (DAERAH) KABUPATEN …」（县首府迁移，旧拼法 IBUKOTA，9 条）。
// 与 b48 同一模板，差异有三：
//   ① 旧拼法 IBUKOTA（b48 为 IBU KOTA），且两条作「IBUKOTA DAERAH KABUPATEN …」；
//   ② 四条用旧行政区划「DAERAH TINGKAT II」（二级行政区），市称 KOTAMADYA；
//   ③ 终点有的写成「KOTA {镇名} KECAMATAN {镇}」，即"某镇上的县城"，须两层都留。
//
// 五语：
//   zh  {县}首府由{起点}迁至{终点}法
//   en  Law on the Relocation of the Capital of {县} from {起点} to {终点}
//   vi  Luật về Việc Di dời Thủ phủ {县} từ {起点} đến {终点}
//   th  พระราชบัญญัติว่าด้วยการย้ายที่ตั้งเมืองหลวงของ{县} จาก{起点} ไปยัง{终点}
//   ms  Akta tentang Pemindahan Ibu Pejabat {县} dari {起点} ke {终点}
//
// 旧区划对照（沿用库内 `ID-H955`/`ID-H1074` 译法）：
//   KABUPATEN DAERAH TINGKAT II → 二级行政区县 / Second-Level Regency / Huyện Cấp hai /
//     อำเภอระดับสอง / Kabupaten Daerah Tingkat II
//   KOTAMADYA DAERAH TINGKAT II → 二级行政区市 / Second-Level Municipality /
//     Thành phố Cấp hai / นครระดับสอง / Kotamadya Daerah Tingkat II
'use strict';
const fs = require('fs');
const path = require('path');
const lawdir = path.resolve(__dirname, '../../prototype/data/laws');

/* 专名表：e 英文/拉丁形，i 印尼原形（ms 用），v 越语形（缺省同 e），z 中文，t 泰文 */
const D = {
  /* 县 */
  Donggala: { z: '栋加拉', e: 'Donggala', t: 'ดงกาลา' },
  Simalungun: { z: '西马隆贡', e: 'Simalungun', t: 'ซีมาลุงกุน' },
  Jayapura: { z: '查亚普拉', e: 'Jayapura', t: 'จายาปูรา' },
  MusiRawas: { z: '穆西拉瓦斯', e: 'Musi Rawas', t: 'มูซีราวัซ' },
  Kupang: { z: '古邦', e: 'Kupang', t: 'กูปัง' },
  Agam: { z: '阿加姆', e: 'Agam', t: 'อากัม' },
  Ngada: { z: '恩加达', e: 'Ngada', t: 'งาดา' },
  Sukabumi: { z: '苏加武眉', e: 'Sukabumi', t: 'ซูกาบูมี' },
  TapanuliTengah: { z: '中塔帕努利', e: 'Central Tapanuli', i: 'Tapanuli Tengah', v: 'Trung Tapanuli', t: 'ตาปานูลีกลาง' },
  /* 市 / 镇 */
  Palu: { z: '帕卢', e: 'Palu', t: 'ปาลู' },
  Banawa: { z: '巴纳瓦', e: 'Banawa', t: 'บานาวา' },
  PematangSiantar: { z: '佩马唐西安塔尔', e: 'Pematang Siantar', t: 'เปอมาตังเซียนตาร์' },
  Raya: { z: '拉雅', e: 'Raya', t: 'รายา' },
  Sentanidi: { z: '森塔尼迪', e: 'Sentanidi', t: 'เซนตานีดี' },
  LubukLinggau: { z: '卢布林高', e: 'Lubuk Linggau', t: 'ลูบุกลิงเกา' },
  MuaraBeliti: { z: '穆阿拉贝利蒂', e: 'Muara Beliti', t: 'มูอาราเบอลีตี' },
  Oelamasi: { z: '奥拉马西', e: 'Oelamasi', t: 'อูเอลามาซี' },
  Bukittinggi: { z: '武吉丁宜', e: 'Bukittinggi', t: 'บูคิตติงกี' },
  LubukBasung: { z: '卢布巴松', e: 'Lubuk Basung', t: 'ลูบุกบาซุง' },
  Bajawa: { z: '巴贾瓦', e: 'Bajawa', t: 'บาจาวา' },
  Ngadabawa: { z: '恩加达巴瓦', e: 'Ngadabawa', t: 'งาดาบาวา' },
  Mbay: { z: '姆巴伊', e: 'Mbay', t: 'เอมไบ' },
  Aesesa: { z: '阿埃塞萨', e: 'Aesesa', t: 'อาเอเซซา' },
  PalabuhanRatu: { z: '帕拉布汉拉图', e: 'Palabuhan Ratu', t: 'ปาลาบูฮันราตู' },
  Sibolga: { z: '西博尔加', e: 'Sibolga', t: 'ซีบอลกา' },
  Pandan: { z: '潘丹', e: 'Pandan', t: 'ปันดัน' },
};

const U = {
  kab: { zh: '县', en: 'Regency', vi: 'Huyện', th: 'อำเภอ', ms: 'Kabupaten' },
  kab2: { zh: '二级行政区县', en: 'Second-Level Regency', vi: 'Huyện Cấp hai', th: 'อำเภอระดับสอง', ms: 'Kabupaten Daerah Tingkat II' },
  kota: { zh: '市', en: 'City', vi: 'Thành phố', th: 'นคร', ms: 'Bandar' },
  kot2: { zh: '二级行政区市', en: 'Second-Level Municipality', vi: 'Thành phố Cấp hai', th: 'นครระดับสอง', ms: 'Kotamadya Daerah Tingkat II' },
  kec: { zh: '镇', en: 'District', vi: 'xã', th: 'ตำบล', ms: 'Kecamatan' },
};
const nm = (k) => { const d = D[k]; if (!d) throw new Error('缺专名 ' + k); return d; };
const MI = (k) => nm(k).i || nm(k).e;
const MV = (k) => nm(k).v || nm(k).e;

// o = { reg, rk:'kab'|'kab2', dist, name, unit:'kota'|'kot2' }
function zh(o) {
  let s = '';
  if (o.reg) s += nm(o.reg).z + U[o.rk || 'kab'].zh;
  if (o.dist) s += nm(o.dist).z + U.kec.zh;
  if (o.name) s += nm(o.name).z + (o.unit ? U[o.unit].zh : '');
  return s;
}
function en(o) {
  // 英语通名后置：Palu City / Agam Second-Level Regency（与库内「Bekasi Second-Level Regency」一致）
  const un = o.unit ? ' ' + U[o.unit].en : '';
  let head;
  if (o.name && o.dist) head = `${nm(o.name).e}${un} in ${nm(o.dist).e} ${U.kec.en}`;
  else if (o.name) head = `${nm(o.name).e}${un}`;
  else head = `${nm(o.dist).e} ${U.kec.en}`;
  if (o.reg) head += ', ' + nm(o.reg).e + ' ' + U[o.rk || 'kab'].en;
  return head;
}
function vi(o) {
  let head;
  if (o.name && o.dist) head = `${nm(o.name).e} thuộc xã ${nm(o.dist).e}`;
  else if (o.name) head = nm(o.name).e;
  else head = `xã ${nm(o.dist).e}`;
  const u = o.unit ? U[o.unit].vi + ' ' : '';
  let s = u ? u + head : head;
  if (o.reg) s += ', ' + U[o.rk || 'kab'].vi.toLowerCase() + ' ' + MV(o.reg);
  return s;
}
function th(o) {
  let head;
  if (o.name && o.dist) head = `${nm(o.name).t}ในตำบล${nm(o.dist).t}`;
  else if (o.name) head = nm(o.name).t;
  else head = `ตำบล${nm(o.dist).t}`;
  const u = o.unit ? U[o.unit].th : '';
  let s = u ? u + head : head;
  if (o.reg) s += ' ' + U[o.rk || 'kab'].th + nm(o.reg).t;
  return s;
}
function ms(o) {
  let head;
  if (o.name && o.dist) head = `${MI(o.name)} di Kecamatan ${MI(o.dist)}`;
  else if (o.name) head = MI(o.name);
  else head = `Kecamatan ${MI(o.dist)}`;
  const u = o.unit ? U[o.unit].ms + ' ' : '';
  let s = u ? u + head : head;
  if (o.reg) s += ', ' + U[o.rk || 'kab'].ms + ' ' + MI(o.reg);
  return s;
}

/* ---------------- 逐条 ---------------- */
const ITEMS = [
  { id: 'ID-H1089', reg: 'Donggala', fr: { name: 'Palu', unit: 'kota' }, to: { name: 'Donggala', unit: 'kota', dist: 'Banawa', reg: 'Donggala' }, chk: ['DONGGALA', 'PALU', 'BANAWA'] },
  { id: 'ID-H1090', reg: 'Simalungun', fr: { name: 'PematangSiantar', unit: 'kota' }, to: { dist: 'Raya', reg: 'Simalungun' }, chk: ['SIMALUNGUN', 'PEMATANG SIANTAR', 'RAYA'] },
  { id: 'ID-H1208', reg: 'Jayapura', fr: { name: 'Jayapura', unit: 'kota' }, to: { name: 'Sentanidi', reg: 'Jayapura' }, chk: ['JAYAPURA', 'SENTANIDI'] },
  { id: 'ID-H1493', reg: 'MusiRawas', fr: { name: 'LubukLinggau', unit: 'kota' }, to: { dist: 'MuaraBeliti', reg: 'MusiRawas' }, chk: ['MUSI RAWAS', 'LUBUK LINGGAU', 'MUARA BELITI'] },
  { id: 'ID-H1541', reg: 'Kupang', fr: { name: 'Kupang', unit: 'kota' }, to: { name: 'Oelamasi', reg: 'Kupang' }, chk: ['KUPANG', 'OELAMASI'] },
  { id: 'ID-H954', reg: 'Agam', rk: 'kab2', fr: { name: 'Bukittinggi', unit: 'kot2' }, to: { name: 'LubukBasung', unit: 'kota', dist: 'LubukBasung', reg: 'Agam', rk: 'kab2' }, chk: ['AGAM', 'BUKITTINGGI', 'LUBUK BASUNG'] },
  { id: 'ID-H956', reg: 'Ngada', rk: 'kab2', fr: { name: 'Bajawa', unit: 'kota', dist: 'Ngadabawa' }, to: { name: 'Mbay', unit: 'kota', dist: 'Aesesa' }, chk: ['NGADA', 'BAJAWA', 'NGADABAWA', 'MBAY', 'AESESA'] },
  { id: 'ID-H957', reg: 'Sukabumi', rk: 'kab2', fr: { name: 'Sukabumi', unit: 'kot2' }, to: { name: 'PalabuhanRatu', unit: 'kota', dist: 'PalabuhanRatu' }, chk: ['SUKABUMI', 'PALABUHAN RATU', 'PALABUHANRATU'] },
  { id: 'ID-H958', reg: 'TapanuliTengah', rk: 'kab2', fr: { name: 'Sibolga', unit: 'kot2' }, to: { name: 'Pandan', unit: 'kota', dist: 'Sibolga', reg: 'TapanuliTengah', rk: 'kab2' }, chk: ['TAPANULI TENGAH', 'SIBOLGA', 'PANDAN'] },
];

const items = {};
const bad = [];
// OCR 连写修复（只用于结构自校验，不改原文字段）：
//   ID-H958 标题「…DAERAH KOTA SIBOLGAKE KOTA PANDAN…」把 KE 粘到前一个词尾；
//   同条另有「KABUPATEN DARAH TINGKAT II」之误（DARAH←DAERAH），不影响结构判定。
const OCR_FIX = [[/SIBOLGAKE\b/g, 'SIBOLGA KE']];
for (const it of ITEMS) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, it.id + '.json'), 'utf8'));
  let orig = String((d.title || {}).orig || '').toUpperCase().replace(/\s+/g, ' ');
  for (const [re, to] of OCR_FIX) orig = orig.replace(re, to);
  if (!/^PEMINDAHAN IBUKOTA /.test(orig)) { bad.push(it.id + ' 标题头不符：' + orig.slice(0, 50)); continue; }
  for (const c of it.chk) if (!orig.includes(c)) bad.push(it.id + ' 原文缺片段「' + c + '」');
  const iDari = orig.indexOf(' DARI '), iKe = orig.indexOf(' KE ');
  if (iDari < 0 || iKe < 0 || iDari > iKe) bad.push(it.id + ' DARI/KE 结构异常');
  const frS = zh(it.fr), toS = zh(it.to);
  if (frS === toS) bad.push(it.id + ' 起点与终点相同：' + frS);
  // 旧区划用词自校验：原文含 TINGKAT II ⇔ 本条标 kab2
  const t2 = /DAERAH TINGKAT II/.test(orig);
  if (t2 !== (it.rk === 'kab2')) bad.push(it.id + ' 二级行政区判定不符（原文 TINGKAT II=' + t2 + '）');
  items[it.id] = {
    zh: `${nm(it.reg).z}${U[it.rk || 'kab'].zh}首府由${frS}迁至${toS}法`,
    en: `Law on the Relocation of the Capital of ${nm(it.reg).e} ${U[it.rk || 'kab'].en} from ${en(it.fr)} to ${en(it.to)}`,
    vi: `Luật về Việc Di dời Thủ phủ ${U[it.rk || 'kab'].vi.toLowerCase()} ${MV(it.reg)} từ ${vi(it.fr)} đến ${vi(it.to)}`,
    th: `พระราชบัญญัติว่าด้วยการย้ายที่ตั้งเมืองหลวงของ${U[it.rk || 'kab'].th}${nm(it.reg).t} จาก${th(it.fr)} ไปยัง${th(it.to)}`,
    ms: `Akta tentang Pemindahan Ibu Pejabat ${U[it.rk || 'kab'].ms} ${MI(it.reg)} dari ${ms(it.fr)} ke ${ms(it.to)}`,
  };
}

if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));
const n = Object.keys(items).length;
if (n !== ITEMS.length) throw new Error('条目数不符：' + n + '/' + ITEMS.length);
const out = path.join(__dirname, '_id_b50.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b50', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
for (const [id, t] of Object.entries(items)) console.log(id, '|', t.zh);
