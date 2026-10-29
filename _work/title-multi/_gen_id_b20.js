// b20：PMN 族索引 8、9 两组（各 9 / 17 条）。
// 同 b19 教训：这两组的 26 条落在 26 家**不同**公司上（Pupuk Sriwijaya / Amarta Karya /
// Kimia Farma / Tirta Raya Mina / Djakarta Lloyd / Pengembangan Pariwisata Bali ×2 /
// Wijaya Karya / Indah Karya / Pertani ×2 / Pelindo I·II·IV / Garuda / Pos Indonesia ×2 /
// Pupuk Sriwidjaja / PPA / PII / Pindad / PTPN III / PLN ×2 / PELNI），
// 全部以正文 Pasal 1 为准逐条落 id。
const fs = require('fs');
const path = require('path');

const CO = {
  PUPUK: ['斯里维贾亚化肥公司', 'PT Pupuk Sriwijaya'],
  AMARTA: ['阿玛塔卡里亚公司', 'PT Amarta Karya'],
  KIMIA: ['金化制药公司', 'PT Kimia Farma'],
  TIRTAMINA: ['蒂尔塔拉亚米纳公司', 'PT Tirta Raya Mina'],
  DJAKARTALLOYD: ['雅加达劳氏远洋航运公司', 'PT Pelayaran Samudera Djakarta Lloyd'],
  BALITOURISM: ['巴厘旅游开发公司', 'PT Pengembangan Pariwisata Bali'],
  WIKA: ['维贾亚卡里亚公司', 'PT Wijaya Karya'],
  INDAHKARYA: ['因达卡里亚公司', 'PT Indah Karya'],
  PERTANI: ['佩尔塔尼公司', 'PT Pertani'],
  PELINDO1: ['印尼第一港务公司', 'PT Pelabuhan Indonesia I'],
  PELINDO2: ['印尼第二港务公司', 'PT Pelabuhan Indonesia II'],
  PELINDO4: ['印尼第四港务公司', 'PT Pelabuhan Indonesia IV'],
  GARUDA: ['印尼鹰航空公司', 'PT Garuda Indonesia'],
  POS: ['印尼邮政公司', 'PT Pos Indonesia'],
  PPA: ['资产管理公司', 'PT Perusahaan Pengelola Aset'],
  PII: ['印尼基础设施担保公司', 'PT Penjaminan Infrastruktur Indonesia'],
  PINDAD: ['平达德公司', 'PT Pindad'],
  PTPN3: ['努山塔拉第三种植园公司', 'PT Perkebunan Nusantara III'],
  PLN: ['印尼国家电力公司', 'PT Perusahaan Listrik Negara'],
  PELNI: ['印尼国家航运公司', 'PT Pelayaran Nasional Indonesia'],
};

function title(key) {
  const [zh, lat] = CO[key];
  return {
    zh: '向' + zh + '增加国家资本参与法',
    en: 'Law on the Addition of State Capital Participation in ' + lat,
    vi: 'Luật về Việc Bổ sung Vốn Góp Nhà nước vào ' + lat,
    th: 'พระราชบัญญัติว่าด้วยการเพิ่มทุนร่วมของรัฐใน' + lat,
    ms: 'Akta tentang Penambahan Penyertaan Modal Negara dalam ' + lat,
  };
}

const IDS = {
  // 族索引 8（原挂「PT Pupuk Sriwijaya」标题，实为 9 家）
  'ID-H898': 'PUPUK',
  'ID-H1098': 'AMARTA',
  'ID-H1222': 'KIMIA',
  'ID-H508': 'TIRTAMINA',
  'ID-H592': 'DJAKARTALLOYD',
  'ID-H657': 'BALITOURISM',
  'ID-H699': 'WIKA',
  'ID-H767': 'INDAHKARYA',
  'ID-H966': 'BALITOURISM',
  // 族索引 9（原挂「PT P…」标题，实为 17 家）
  'ID-H964': 'PUPUK',
  'ID-H1097': 'PERTANI',
  'ID-H1220': 'PELINDO1',
  'ID-H1371': 'GARUDA',
  'ID-H1549': 'PERTANI',
  'ID-H840': 'POS',
  'ID-H895': 'POS',
  'ID-H2252': 'PELINDO2',
  'ID-H1652': 'PUPUK',
  'ID-H1865': 'PPA',
  'ID-H1960': 'PII',
  'ID-H2063': 'PELINDO4',
  'ID-H2170': 'PINDAD',
  'ID-H2460': 'PTPN3',
  'ID-H2563': 'PLN',
  'ID-H2982': 'PLN',
  'ID-H3227': 'PELNI',
};

const items = {};
for (const [id, key] of Object.entries(IDS)) {
  if (!CO[key]) throw new Error('未定义公司 ' + key);
  items[id] = title(key);
}

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const fam = buckets.long.filter((u) => /^PENAMBAHAN PENYERTAAN MODAL/.test(u.s));
const scope = new Set();
for (const i of [8, 9]) for (const id of fam[i].ids) scope.add(id);
const have = Object.keys(items);
const missing = [...scope].filter((id) => !have.includes(id));
const extra = have.filter((id) => !scope.has(id));
console.log('范围内', scope.size, '| 写出', have.length);
if (missing.length) console.log('未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

for (const [id, v] of Object.entries(items)) {
  for (const L of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!v[L] || !String(v[L]).trim()) throw new Error('空值 ' + id + ' ' + L);
  }
}

fs.writeFileSync(path.join(__dirname, '_id_b20.json'), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出 _id_b20.json');
