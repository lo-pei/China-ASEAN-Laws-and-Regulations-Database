// b40：ID 长标题族「PENJUALAN SAHAM MILIK NEGARA REPUBLIK INDONESIA PADA …」（国有股份出售）
// 14 条全收官，此前五语全空。
//
// 句式（只换公司）：
//   zh  印度尼西亚共和国在{公司}的国家股份出售法
//   en  Law on the Sale of Shares Owned by the Republic of Indonesia in {company}
//   vi  Luật về Việc Bán Cổ phần do Nhà nước Cộng hòa Indonesia sở hữu tại {company}
//   th  พระราชบัญญัติว่าด้วยการขายหุ้นที่รัฐสาธารณรัฐอินโดนีเซียถือครองใน{company}
//   ms  Akta tentang Penjualan Saham Milik Negara Republik Indonesia pada {company}
//
// 三条口径：
//   ① 标题里带 `PERUSAHAAN PERSEROAN (PERSERO)` 的 2 条（ID-H2275 萨拉纳·卡尔亚、ID-H2274 普里米西马）
//      是公营有限公司，与普通 PT 不同，故 PERSERO 标记随公司名括注，不省略。
//   ② zh 给中文名，en/vi/th/ms 保留 `PT …` 拉丁原名——公司名属专名，音译进四语会失真。
//   ③ ID-H1567 标题 OCR 作 `PT BANK LTPPO TBK`，正文 Pasal 1 明确为「PT Bank Lippo Tbk」，
//      译名按正文定（力宝银行），标题脏字不采；已在台账记录。
'use strict';
const fs = require('fs');
const path = require('path');

// zh: 中文名（不含「公司」尾词，句框统一补）；lat: 四语沿用的拉丁原名
const C = {
  sarana: { zh: '萨拉纳·卡尔亚公司', lat: 'PT Sarana Karya', persero: true },
  primissima: { zh: '普里米西马公司', lat: 'PT Primissima', persero: true },
  telkom: { zh: '印度尼西亚电信公司', lat: 'PT Telekomunikasi Indonesia Tbk.' },
  socfin: { zh: '苏芬印度尼西亚公司', lat: 'PT Socfin Indonesia' },
  wisma: { zh: '努山塔拉国际大厦公司', lat: 'PT Wisma Nusantara International' },
  permataLippo: { zh: '宝石银行与力宝银行', lat: ['PT Bank Permata Tbk', 'PT Bank Lippo Tbk'] },
  padalarang: { zh: '帕达拉朗造纸公司', lat: 'PT Kertas Padalarang' },
  atelier: { zh: '印度尼西亚机械工坊公司', lat: 'PT Atelier Mechanic Indonesia' },
  intirub: { zh: '印度尼西亚橡胶公司', lat: 'PT Intirub' },
  jihed: { zh: '雅加达国际酒店与开发公司', lat: 'PT Jakarta International Hotels & Development, Tbk' },
  basuki: { zh: '巴苏基·拉赫马特造纸公司', lat: 'PT Kertas Basuki Rachmat' },
  blabak: { zh: '布拉巴克造纸公司', lat: 'PT Kertas Blabak' },
  prasadha: { zh: '工业废料处理服务公司', lat: 'PT Prasadha Pamunah Limbah Industri' },
};

// 多公司时逐语连接，禁用英文 and 混进 vi/th/ms
const JOIN = { en: ' and ', vi: ' và ', th: ' และ ', ms: ' dan ' };
const join = (v, k) => (Array.isArray(v) ? v.join(JOIN[k]) : v);

const FR = (o) => {
  const z = o.persero ? `${o.zh}（PERSERO）` : o.zh;
  const L = (k) => {
    const base = join(o.lat, k);
    return o.persero ? `${base} (PERSERO)` : base;
  };
  const l = L('en');
  return {
    zh: `印度尼西亚共和国在${z}的国家股份出售法`,
    en: `Law on the Sale of Shares Owned by the Republic of Indonesia in ${l}`,
    vi: `Luật về Việc Bán Cổ phần do Nhà nước Cộng hòa Indonesia sở hữu tại ${L('vi')}`,
    th: `พระราชบัญญัติว่าด้วยการขายหุ้นที่รัฐสาธารณรัฐอินโดนีเซียถือครองใน${L('th')}`,
    ms: `Akta tentang Penjualan Saham Milik Negara Republik Indonesia pada ${L('ms')}`,
  };
};

// [id, 公司键, 标题中必须出现的拉丁串（用于自校验，OCR 脏型单独列出）]
const ROWS = [
  ['ID-H2275', 'sarana', 'SARANA KARYA'],
  ['ID-H1122', 'telkom', 'TELEKOMUNIKASI INDONESIA'],
  ['ID-H1389', 'socfin', 'SOCFIN INDONESIA'],
  ['ID-H1390', 'telkom', 'TELEKOMUNIKASI INDONESIA'],
  ['ID-H1391', 'wisma', 'WISMA NUSANTARA INTERNATIONAL'],
  ['ID-H1567', 'permataLippo', null], // 标题 OCR 作 LTPPO，正文为 Lippo
  ['ID-H2274', 'primissima', 'PRIMISSIMA'],
  ['ID-H2276', 'padalarang', 'KERTAS PADALARANG'],
  ['ID-H1792', 'atelier', 'ATELIER MECHANIC INDONESIA'],
  ['ID-H1793', 'intirub', 'INTIRUB'],
  ['ID-H1794', 'jihed', 'JAKARTA INTERNATIONAL HOTELS'],
  ['ID-H1795', 'basuki', 'KERTAS BASUKI RACHMAT'],
  ['ID-H1796', 'blabak', 'KERTAS BLABAK'],
  ['ID-H1797', 'prasadha', 'PRASADHA PAMUNAH LIMBAH INDUSTRI'],
];

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const [id, ck, must] of ROWS) {
  const c = C[ck];
  if (!c) throw new Error('缺公司槽 ' + ck);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '').toUpperCase();
  if (must && !orig.includes(must)) bad.push(id + ' 标题不含「' + must + '」：' + orig);
  items[id] = FR(c);
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 14) throw new Error('条目数应为 14，实为 ' + n);
const out = path.join(__dirname, '_id_b40.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b40', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
