// b23：PMN 族索引 56–84（46 条）——本族收官。
// 受资实体多数在标题中已明示；标题截断的（PT H / PT L / PERUM PEMBANGUNAN PERUM…）
// 按同标题组内已核实的正文推定，属「同标题即同实体」，不是猜。
// 索引 66 是特例：向印度尼西亚银行（央行）增资以划转政府配额，需单独成句。
const fs = require('fs');
const path = require('path');

const CO = {
  SARANA: ['企业发展公营公司', 'Perum Sarana Pengembangan Usaha'],
  LPEI: ['印尼出口融资机构', 'Lembaga Pembiayaan Ekspor Indonesia'],
  JAMKRINDO: ['印尼信贷担保公营公司', 'Perum Jaminan Kredit Indonesia'],
  ANTARA: ['国家通讯社安塔拉公营公司', 'Perum Lembaga Kantor Berita Nasional Antara'],
  JASATIRTA1: ['第一蒂尔塔水务公营公司', 'Perum Jasa Tirta I'],
  PERCETAKAN: ['国家印刷公营公司', 'Perum Percetakan Negara Republik Indonesia'],
  GARAM: ['印尼盐业公司', 'PT Garam'],
  PTPN1: ['努山塔拉第一种植园公司', 'PT Perkebunan Nusantara I'],
  PTPN7: ['努山塔拉第七种植园公司', 'PT Perkebunan Nusantara VII'],
  PTPN9: ['努山塔拉第九种植园公司', 'PT Perkebunan Nusantara IX'],
  PTPN10: ['努山塔拉第十种植园公司', 'PT Perkebunan Nusantara X'],
  PTPN11: ['努山塔拉第十一种植园公司', 'PT Perkebunan Nusantara XI'],
  PTPN12: ['努山塔拉第十二种植园公司', 'PT Perkebunan Nusantara XII'],
  DAMRI: ['达姆里公营公司', 'Perum DAMRI'],
  ASDP: ['印尼渡轮公司', 'PT ASDP Indonesia Ferry'],
  BPJS: ['医疗保障执行机构', 'Badan Penyelenggara Jaminan Sosial Kesehatan'],
  BULOG: ['国家粮食后勤公营公司', 'Perum BULOG'],
  PERUMNAS: ['国家住房建设公营公司', 'Perum Pembangunan Perumahan Nasional'],
  PERIKANAN: ['印尼渔业公营公司', 'Perum Perikanan Indonesia'],
  HUTAMA: ['胡塔玛卡里亚公司', 'PT Hutama Karya'],
  WASKITA: ['瓦斯基塔卡里亚公司', 'PT Waskita Karya'],
  RNI: ['拉贾瓦利努山塔拉公司', 'PT Rajawali Nusantara Indonesia'],
  LPPNPI: ['航空导航服务公营公司', 'Perum Lembaga Penyelenggara Pelayanan Navigasi Penerbangan Indonesia'],
  LEN: ['伦工业公司', 'PT Len Industri'],
  TUBAN: ['图班石化工业公司', 'PT Tuban Petrochemical Industries'],
  KAI: ['印尼铁路公司', 'PT Kereta Api Indonesia'],
  DANANTARA: ['达雅阿纳加塔努山塔拉投资管理机构', 'Badan Pengelola Investasi Daya Anagata Nusantara'],
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
  'ID-H1648': 'SARANA',
  'ID-H1957': 'LPEI', 'ID-H2447': 'LPEI', 'ID-H2885': 'LPEI', 'ID-H3223': 'LPEI',
  'ID-H1958': 'JAMKRINDO', 'ID-H2057': 'JAMKRINDO', 'ID-H2161': 'JAMKRINDO',
  'ID-H2249': 'JAMKRINDO', 'ID-H2350': 'JAMKRINDO', 'ID-H2450': 'JAMKRINDO',
  'ID-H2058': 'ANTARA',
  'ID-H2162': 'JASATIRTA1',
  'ID-H2163': 'PERCETAKAN',
  'ID-H2167': 'GARAM', 'ID-H2456': 'GARAM',
  'ID-H2253': 'PTPN1',
  'ID-H2361': 'DAMRI',
  'ID-H2362': 'ASDP',
  'ID-H2446': 'BPJS', 'ID-H2561': 'BPJS',
  'ID-H2448': 'BULOG',
  'ID-H2451': 'PERUMNAS', 'ID-H1864': 'PERUMNAS',
  'ID-H2452': 'PERIKANAN',
  'ID-H2457': 'HUTAMA', 'ID-H2888': 'HUTAMA', 'ID-H3224': 'HUTAMA', 'ID-H2792': 'HUTAMA',
  'ID-H2462': 'WASKITA', 'ID-H2985': 'WASKITA', 'ID-H3073': 'WASKITA',
  'ID-H2463': 'PTPN9',
  'ID-H2464': 'PTPN7',
  'ID-H2465': 'PTPN10',
  'ID-H2466': 'PTPN11',
  'ID-H2467': 'PTPN12',
  'ID-H2565': 'RNI',
  'ID-H2886': 'LPPNPI',
  'ID-H3148': 'LEN', 'ID-H3226': 'LEN', 'ID-H3071': 'LEN',
  'ID-H2793': 'TUBAN',
  'ID-H3229': 'KAI',
  'ID-H3304': 'DANANTARA',
};

const items = {};
for (const [id, key] of Object.entries(IDS)) {
  if (!CO[key]) throw new Error('未定义 ' + key);
  items[id] = title(key);
}

// 特例：向央行增资以划转政府配额（标题含 DALAM RANGKA PENGALIHAN KUOTA PEMERINTAH）
items['ID-H2445'] = {
  zh: '为划转政府配额向印度尼西亚银行增加国家资本参与法',
  en: 'Law on the Addition of State Capital Participation in Bank Indonesia for the Transfer of the Government Quota',
  vi: 'Luật về Việc Bổ sung Vốn Góp Nhà nước vào Ngân hàng Indonesia nhằm Chuyển giao Hạn ngạch của Chính phủ',
  th: 'พระราชบัญญัติว่าด้วยการเพิ่มทุนร่วมของรัฐในธนาคารอินโดนีเซียเพื่อการโอนโควตาของรัฐบาล',
  ms: 'Akta tentang Penambahan Penyertaan Modal Negara dalam Bank Indonesia bagi Pemindahan Kuota Kerajaan',
};

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const fam = buckets.long.filter((u) => /^PENAMBAHAN PENYERTAAN MODAL/.test(u.s));
const scope = new Set();
for (let i = 56; i <= 84; i++) for (const id of fam[i].ids) scope.add(id);
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

fs.writeFileSync(path.join(__dirname, '_id_b23.json'), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出 _id_b23.json');
