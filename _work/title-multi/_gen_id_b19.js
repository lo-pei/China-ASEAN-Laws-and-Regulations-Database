// b19：ID 长标题族「国家资本参与增资（PMN）」前 25 个唯一标题。
// ⚠ 关键教训：分桶标题在 85 字符处被截断，`PT I` / `PT B` / `PT S` 各自覆盖多家不同公司
// （PT Industri Sandang II / PT Indonesia Farma / PT Inhutani I / PT Indonesia Asahan
// Aluminium …）。按标题批量套译名会把 13 家公司写成同一家 —— 故一律以**正文 Pasal 1**
// 的实体名为准，逐条落 id。
// 专名处理：zh 给中文名，en/vi/th/ms 保留拉丁原名（印尼公司名在泰/越公文中惯用原名），
// 不硬造音译。
const fs = require('fs');
const path = require('path');

// 公司名：zh 中文名 / 拉丁原名（en、ms、vi、th 直用）
const CO = {
  BANK4: ['印尼国家银行、印尼人民银行、国家储蓄银行与万自立银行',
    'Bank Negara Indonesia, Bank Rakyat Indonesia, Bank Tabungan Negara and Bank Mandiri'],
  IS2: ['第二纺织工业公司', 'PT Industri Sandang II'],
  INDOFARMA: ['印尼制药公司', 'PT Indonesia Farma'],
  IKA: ['铁路工业公司', 'PT Industri Kereta Api'],
  IPTN: ['努山塔拉航空工业公司', 'PT Industri Pesawat Terbang Nusantara'],
  INHUTANI1: ['第一林业公司', 'PT Inhutani I'],
  IKI: ['印尼造船工业公司', 'PT Industri Kapal Indonesia'],
  INALUM: ['印尼阿萨汉铝业公司', 'PT Indonesia Asahan Aluminium'],
  BTN: ['国家储蓄银行', 'PT Bank Tabungan Negara'],
  BIOFARMA: ['生物制药公司', 'PT Bio Farma'],
  BKI: ['印尼船级社', 'PT Biro Klasifikasi Indonesia'],
  BATANTEK: ['巴坦技术公司', 'PT Batan Teknologi'],
  BNI: ['印尼国家银行', 'PT Bank Negara Indonesia'],
  EKSIM: ['印尼进出口银行', 'PT Bank Ekspor Impor Indonesia'],
  BOMA: ['博马比斯马英德拉公司', 'PT Boma Bisma Indra'],
  BRANTAS: ['布兰塔斯阿比普拉亚公司', 'PT Brantas Abipraya'],
  BAHANA: ['巴哈纳企业发展公司', 'PT Bahana Pembinaan Usaha Indonesia'],
  AVIASI: ['印尼航空旅游公司', 'PT Aviasi Pariwisata Indonesia'],
  AP1: ['第一机场管理公司', 'PT Angkasa Pura I'],
  AP2: ['第二机场管理公司', 'PT Angkasa Pura II'],
  ADHI: ['阿迪卡里亚公司', 'PT Adhi Karya'],
  ASKRINDO: ['印尼信贷保险公司', 'PT Asuransi Kredit Indonesia'],
  ASDP: ['印尼渡轮公司', 'PT ASDP Indonesia Ferry'],
  SEMEN: ['印尼水泥公司', 'PT Semen Indonesia'],
  SHS: ['桑祥塞里种子公司', 'PT Sang Hyang Seri'],
  SEMENPADANG: ['巴东水泥公司', 'PT Semen Padang'],
  SMI: ['基础设施多元融资公司', 'PT Sarana Multi Infrastruktur'],
  SMF: ['多元住房融资公司', 'PT Sarana Multigriya Finansial'],
  TIMAH: ['锡矿公司', 'PT Tambang Timah'],
  TELKOM: ['印尼电信公司', 'PT Telekomunikasi Indonesia'],
  PTBA: ['布吉阿萨姆煤矿公司', 'PT Tambang Batubara Bukit Asam'],
  RNI: ['拉贾瓦利努山塔拉公司', 'PT Rajawali Nusantara Indonesia'],
  PKP: ['合作社金融发展公营公司', 'Perum Pengembangan Keuangan Koperasi'],
  BUKOPIN: ['印尼合作社大众银行', 'PT Bank Umum Koperasi Indonesia'],
  MERPATI: ['努山塔拉鸽航空公司', 'PT Merpati Nusantara Airlines'],
  DAMRI: ['达姆里公营公司', 'Perum DAMRI'],
  JASATIRTA2: ['第二蒂尔塔水务公营公司', 'Perum Jasa Tirta II'],
  PPD: ['雅加达客运公营公司', 'Perum Pengangkutan Penumpang Djakarta'],
  DANAREKSA: ['达纳雷克萨公司', 'PT Danareksa'],
  DOKSURABAYA: ['泗水造船与船坞公司', 'PT Dok dan Perkapalan Surabaya'],
  DIRGANTARA: ['印尼宇航公司', 'PT Dirgantara Indonesia'],
  DHARMA: ['达摩商社', 'PT Dharma Niaga'],
  KONEBA: ['科内巴公司', 'PT Koneba'],
  KIMIA: ['金化制药公司', 'PT Kimia Farma'],
  KBI: ['印尼期货清算公司', 'PT Kliring Berjangka Indonesia'],
  KAI: ['印尼铁路公司', 'PT Kereta Api Indonesia'],
  ASDP2: ['河湖与渡运公司', 'PT Angkutan Sungai, Danau dan Penyeberangan'],
  KKBK: ['商品交易所清算与担保公司', 'PT Kliring dan Jaminan Bursa Komoditi'],
  JASARAHARJA: ['贾萨拉哈贾保险公司', 'PT Jasa Raharja'],
  JASAMARGA: ['贾萨马尔加公路公司', 'PT Jasa Marga'],
  KEHUTANAN: ['国家林业公营公司', 'Perum Kehutanan Negara'],
  PTPN3: ['努山塔拉第三种植园公司', 'PT Perkebunan Nusantara III'],
  AIF: ['东盟基础设施基金', 'ASEAN Infrastructure Fund'],
  ADB: ['亚洲开发银行', 'Asian Development Bank'],
};

// 冠词只进英文句（'in the ASEAN Infrastructure Fund'），其余语种不带冠词
const NEED_THE = new Set(['AIF', 'ADB']);

function title(key) {
  const [zh, lat] = CO[key];
  return {
    zh: '向' + zh + '增加国家资本参与法',
    en: 'Law on the Addition of State Capital Participation in ' + (NEED_THE.has(key) ? 'the ' : '') + lat,
    vi: 'Luật về Việc Bổ sung Vốn Góp Nhà nước vào ' + lat,
    th: 'พระราชบัญญัติว่าด้วยการเพิ่มทุนร่วมของรัฐใน' + lat,
    ms: 'Akta tentang Penambahan Penyertaan Modal Negara dalam ' + lat,
  };
}

// id → 公司（全部取自正文 Pasal 1）
const IDS = {
  'ID-H1091': 'BANK4',
  'ID-H1095': 'IS2', 'ID-H893': 'IS2',
  'ID-H1218': 'INDOFARMA', 'ID-H1368': 'INDOFARMA',
  'ID-H1546': 'IKA',
  'ID-H839': 'IPTN',
  'ID-H2061': 'INHUTANI1',
  'ID-H2168': 'IKI', 'ID-H2458': 'IKI',
  'ID-H2633': 'INALUM',
  'ID-H1211': 'BTN', 'ID-H1366': 'BTN',
  'ID-H2791': 'BIOFARMA', 'ID-H891': 'BIOFARMA', 'ID-H2887': 'BIOFARMA',
  'ID-H3305': 'BKI',
  'ID-H1216': 'BATANTEK',
  'ID-H838': 'BNI',
  'ID-H962': 'EKSIM',
  'ID-H1649': 'BOMA', 'ID-H2562': 'BOMA',
  'ID-H1959': 'BRANTAS',
  'ID-H2454': 'BAHANA', 'ID-H3147': 'BAHANA',
  'ID-H2981': 'AVIASI',
  'ID-H1094': 'AP1', 'ID-H1215': 'AP1', 'ID-H697': 'AP1', 'ID-H2059': 'AP1', 'ID-H765': 'AP1',
  'ID-H1365': 'AP2', 'ID-H2453': 'AP2',
  'ID-H890': 'ADHI', 'ID-H961': 'ADHI',
  'ID-H2165': 'ASKRINDO', 'ID-H2251': 'ASKRINDO', 'ID-H2353': 'ASKRINDO',
  'ID-H2711': 'ASDP',
  'ID-H3072': 'SEMEN',
  'ID-H1550': 'SHS', 'ID-H897': 'SHS',
  'ID-H766': 'SEMENPADANG',
  'ID-H1961': 'SMI', 'ID-H2171': 'SMI', 'ID-H2461': 'SMI', 'ID-H2564': 'SMI',
  'ID-H2064': 'SMF', 'ID-H2354': 'SMF', 'ID-H2984': 'SMF', 'ID-H3228': 'SMF',
  'ID-H698': 'TIMAH',
  'ID-H1221': 'TELKOM',
  'ID-H965': 'PTBA',
  'ID-H896': 'RNI', 'ID-H3149': 'RNI', 'ID-H2983': 'RNI',
  'ID-H1092': 'PKP', 'ID-H695': 'PKP',
  'ID-H1093': 'BUKOPIN',
  'ID-H1096': 'MERPATI', 'ID-H1548': 'MERPATI', 'ID-H2062': 'MERPATI',
  'ID-H1212': 'DAMRI', 'ID-H1364': 'DAMRI', 'ID-H1543': 'DAMRI', 'ID-H2160': 'DAMRI', 'ID-H2449': 'DAMRI',
  'ID-H1213': 'JASATIRTA2',
  'ID-H1214': 'PPD', 'ID-H1544': 'PPD', 'ID-H2250': 'PPD',
  'ID-H1217': 'DANAREKSA', 'ID-H3070': 'DANAREKSA',
  'ID-H1367': 'DOKSURABAYA', 'ID-H892': 'DOKSURABAYA',
  'ID-H1545': 'DIRGANTARA', 'ID-H2060': 'DIRGANTARA', 'ID-H2166': 'DIRGANTARA', 'ID-H2455': 'DIRGANTARA',
  'ID-H963': 'DHARMA',
  'ID-H1219': 'KONEBA',
  'ID-H1370': 'KIMIA',
  'ID-H1547': 'KBI',
  'ID-H2169': 'KAI', 'ID-H2459': 'KAI', 'ID-H1494': 'KAI',
  'ID-H1223': 'ASDP2',
  'ID-H1224': 'KKBK',
  'ID-H1369': 'JASARAHARJA',
  'ID-H894': 'JASAMARGA',
  'ID-H2351': 'KEHUTANAN',
  'ID-H2352': 'PTPN3',
  'ID-H2355': 'AIF', 'ID-H2254': 'AIF',
  'ID-H2356': 'ADB', 'ID-H2065': 'ADB', 'ID-H2172': 'ADB', 'ID-H2255': 'ADB',
};

// 跳译：正文缺 Pasal 1，实体名不可知（orig 只到 `PT I` / `PT K`）
const SKIP = {
  'ID-H1650': '缺 Pasal 1，实体不可知（orig 截断于 PT I）',
  'ID-H3225': '缺 Pasal 1，实体不可知（orig 截断于 PT I）',
  'ID-H1651': '缺 Pasal 1，实体不可知（orig 截断于 PT K）',
};

const items = {};
for (const [id, key] of Object.entries(IDS)) {
  if (!CO[key]) throw new Error('未定义公司 ' + key);
  items[id] = title(key);
}

// 校验：25 个唯一标题（族索引 0–7、10–25）的全部 id 要么写、要么显式跳译
const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const fam = buckets.long.filter((u) => /^PENAMBAHAN PENYERTAAN MODAL/.test(u.s));
const IDX = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const scope = new Set();
for (const i of IDX) for (const id of fam[i].ids) scope.add(id);
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

fs.writeFileSync(path.join(__dirname, '_id_b19.json'), JSON.stringify({ items }, null, 1), 'utf8');
fs.writeFileSync(path.join(__dirname, '_id_b19.skip.json'), JSON.stringify(SKIP, null, 1), 'utf8');
console.log('写出 _id_b19.json');
