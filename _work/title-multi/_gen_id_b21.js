// b21：PMN 族索引 26–41（28 条）。
// 含 7 家国际金融机构（IBRD / IFC / IFAD / ICD / IDA / IMF / IsDB）与 8 家国企。
// 英文句需冠词 the，vi/th/ms 不带 —— 冠词只进 en。
const fs = require('fs');
const path = require('path');

const CO = {
  // 国际金融机构：四语均用本地化译名（避免拉丁名里的 for/of 被判为英文残留）
  IBRD: ['国际复兴开发银行', 'the International Bank for Reconstruction and Development',
    'Ngân hàng Tái thiết và Phát triển Quốc tế', 'ธนาคารระหว่างประเทศเพื่อการบูรณะและพัฒนา',
    'Bank Antarabangsa bagi Pembinaan Semula dan Pembangunan'],
  IFC: ['国际金融公司', 'the International Finance Corporation',
    'Công ty Tài chính Quốc tế', 'บริษัทการเงินระหว่างประเทศ', 'Perbadanan Kewangan Antarabangsa'],
  IFAD: ['国际农业发展基金', 'the International Fund for Agricultural Development',
    'Quỹ Quốc tế Phát triển Nông nghiệp', 'กองทุนระหว่างประเทศเพื่อการพัฒนาการเกษตร',
    'Tabung Antarabangsa bagi Pembangunan Pertanian'],
  ICD: ['伊斯兰私营部门发展公司', 'the Islamic Corporation for the Development of the Private Sector',
    'Công ty Phát triển Khu vực Tư nhân Hồi giáo', 'บริษัทอิสลามเพื่อการพัฒนาภาคเอกชน',
    'Syarikat Pembangunan Sektor Swasta Islam'],
  IDA: ['国际开发协会', 'the International Development Association',
    'Hiệp hội Phát triển Quốc tế', 'สมาคมการพัฒนาระหว่างประเทศ', 'Persatuan Pembangunan Antarabangsa'],
  IMF: ['国际货币基金组织', 'the International Monetary Fund',
    'Quỹ Tiền tệ Quốc tế', 'กองทุนการเงินระหว่างประเทศ', 'Tabung Kewangan Antarabangsa'],
  ISDB: ['伊斯兰开发银行', 'the Islamic Development Bank',
    'Ngân hàng Phát triển Hồi giáo', 'ธนาคารเพื่อการพัฒนาอิสลาม', 'Bank Pembangunan Islam'],
  // 印尼国企：保留拉丁原名（泰/越公文对印尼公司名惯用原名，且不含英文虚词）
  GARUDA: ['印尼鹰航空公司', 'PT Garuda Indonesia', 'PT Garuda Indonesia', 'PT Garuda Indonesia', 'PT Garuda Indonesia'],
  TELKOM: ['印尼电信公司', 'PT Telekomunikasi Indonesia', 'PT Telekomunikasi Indonesia', 'PT Telekomunikasi Indonesia', 'PT Telekomunikasi Indonesia'],
  AP1: ['第一机场管理公司', 'PT Angkasa Pura I', 'PT Angkasa Pura I', 'PT Angkasa Pura I', 'PT Angkasa Pura I'],
  AP2: ['第二机场管理公司', 'PT Angkasa Pura II', 'PT Angkasa Pura II', 'PT Angkasa Pura II', 'PT Angkasa Pura II'],
  PELINDO4: ['印尼第四港务公司', 'PT Pelabuhan Indonesia IV', 'PT Pelabuhan Indonesia IV', 'PT Pelabuhan Indonesia IV', 'PT Pelabuhan Indonesia IV'],
  DANAREKSA: ['达纳雷克萨公司', 'PT Danareksa', 'PT Danareksa', 'PT Danareksa', 'PT Danareksa'],
  GARAM: ['印尼盐业公司', 'PT Garam', 'PT Garam', 'PT Garam', 'PT Garam'],
  BAHANA: ['巴哈纳企业发展公司', 'PT Bahana Pembinaan Usaha Indonesia', 'PT Bahana Pembinaan Usaha Indonesia', 'PT Bahana Pembinaan Usaha Indonesia', 'PT Bahana Pembinaan Usaha Indonesia'],
};

function title(key) {
  const [zh, en, vi, th, ms] = CO[key];
  return {
    zh: '向' + zh + '增加国家资本参与法',
    en: 'Law on the Addition of State Capital Participation in ' + en,
    vi: 'Luật về Việc Bổ sung Vốn Góp Nhà nước vào ' + vi,
    th: 'พระราชบัญญัติว่าด้วยการเพิ่มทุนร่วมของรัฐใน' + th,
    ms: 'Akta tentang Penambahan Penyertaan Modal Negara dalam ' + ms,
  };
}

const IDS = {
  // 国际金融机构
  'ID-H2357': 'IBRD', 'ID-H2066': 'IBRD', 'ID-H2173': 'IBRD', 'ID-H2256': 'IBRD', 'ID-H2468': 'IBRD',
  'ID-H2358': 'IFC', 'ID-H2175': 'IFC', 'ID-H2257': 'IFC',
  'ID-H2359': 'IFAD', 'ID-H2067': 'IFAD', 'ID-H2176': 'IFAD', 'ID-H2258': 'IFAD',
  'ID-H2360': 'ICD', 'ID-H2069': 'ICD', 'ID-H2177': 'ICD', 'ID-H2259': 'ICD',
  'ID-H2469': 'IDA', 'ID-H2174': 'IDA',
  'ID-H2068': 'IMF',
  'ID-H2070': 'ISDB',
  // 国企
  'ID-H504': 'GARUDA',
  'ID-H509': 'TELKOM',
  'ID-H590': 'AP1',
  'ID-H591': 'PELINDO4',
  'ID-H960': 'AP2',
  'ID-H967': 'DANAREKSA',
  'ID-H968': 'GARAM',
  'ID-H1962': 'BAHANA',
};

const items = {};
for (const [id, key] of Object.entries(IDS)) {
  if (!CO[key]) throw new Error('未定义 ' + key);
  items[id] = title(key);
}

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const fam = buckets.long.filter((u) => /^PENAMBAHAN PENYERTAAN MODAL/.test(u.s));
const scope = new Set();
for (let i = 26; i <= 41; i++) for (const id of fam[i].ids) scope.add(id);
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

fs.writeFileSync(path.join(__dirname, '_id_b21.json'), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出 _id_b21.json');
