// b22：PMN 族索引 43–55（17 条）——「国有资产划转为增资」型，受资实体在标题中已明示。
// 索引 42（ID-H472）跳译：标题写 PT Rajawali Nusantara Indonesia，正文 Pasal 1 却是
// Perum Pos dan Giro，两者互斥。
const fs = require('fs');
const path = require('path');

const CO = {
  AP1: ['第一机场管理公司', 'Perum Angkasa Pura I'],
  AP2: ['第二机场管理公司', 'Perum Angkasa Pura II'],
  POSGIRO: ['邮电公营公司', 'Perum Pos dan Giro'],
  ASDP2: ['河湖与渡运公营公司', 'Perum Angkutan Sungai, Danau dan Penyeberangan'],
  SHS: ['桑祥塞里种子公营公司', 'Perum Sang Hyang Seri'],
  KEHUTANAN: ['国家林业公营公司', 'Perum Kehutanan Negara'],
  BIOFARMA: ['生物制药公营公司', 'Perum Bio Farma'],
  DAMRI: ['达姆里公营公司', 'Perum DAMRI'],
  INDOFARMA: ['印尼制药公营公司', 'Perum Indonesia Farma'],
  PLN: ['国家电力公营公司', 'Perum Listrik Negara'],
  PPD: ['雅加达客运公营公司', 'Perum Pengangkutan Penumpang Djakarta'],
  PERIKANAN: ['海洋渔业基础设施公营公司', 'Perum Prasarana Perikanan Samudera'],
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
  'ID-H505': 'AP1',
  'ID-H506': 'AP2',
  'ID-H507': 'POSGIRO', 'ID-H656': 'POSGIRO', 'ID-H696': 'POSGIRO',
  'ID-H510': 'ASDP2', 'ID-H594': 'ASDP2',
  'ID-H511': 'SHS',
  'ID-H512': 'KEHUTANAN',
  'ID-H593': 'AP2',
  'ID-H595': 'BIOFARMA',
  'ID-H596': 'DAMRI',
  'ID-H597': 'INDOFARMA',
  'ID-H598': 'PLN',
  'ID-H599': 'PPD',
  'ID-H764': 'PERIKANAN', 'ID-H2164': 'PERIKANAN',
};

const SKIP = { 'ID-H472': '标题（PT Rajawali Nusantara Indonesia）与正文（Perum Pos dan Giro）错配' };

const items = {};
for (const [id, key] of Object.entries(IDS)) {
  if (!CO[key]) throw new Error('未定义 ' + key);
  items[id] = title(key);
}

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const fam = buckets.long.filter((u) => /^PENAMBAHAN PENYERTAAN MODAL/.test(u.s));
const scope = new Set();
for (let i = 43; i <= 55; i++) for (const id of fam[i].ids) scope.add(id);
const have = Object.keys(items);
const missing = [...scope].filter((id) => !have.includes(id) && !SKIP[id]);
const extra = have.filter((id) => !scope.has(id));
console.log('范围内', scope.size, '| 写出', have.length, '| 跳译', Object.keys(SKIP).length);
if (missing.length) console.log('未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

for (const [id, v] of Object.entries(items)) {
  for (const L of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!v[L] || !String(v[L]).trim()) throw new Error('空值 ' + id + ' ' + L);
  }
}

fs.writeFileSync(path.join(__dirname, '_id_b22.json'), JSON.stringify({ items }, null, 1), 'utf8');
fs.writeFileSync(path.join(__dirname, '_id_b22.skip.json'), JSON.stringify(SKIP, null, 1), 'utf8');
console.log('写出 _id_b22.json');
