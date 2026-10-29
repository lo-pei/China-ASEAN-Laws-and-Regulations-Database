// 印尼法规标题通用渲染器：输入一张主题表，输出批次 JSON（五键）
// 用法：node _work/title-multi/_id_render.js <表文件.js> <输出前缀>
// 表文件导出形如：
//   module.exports = { type:'PP', items:[ {id:'ID-H1006', num:'', zh:'…', en:'…', vi:'…', th:'…', ms:'…'} ] }
// 句框按 type 取；num 有则拼号年，无则略（不猜）。
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const lawdir = path.join(root, 'prototype/data/laws');

// 文书类型五语词形。zh 用「关于{主题}的{类型}」语序；其余三语用「类型 + 介词 + 主题」
// 句框必须与库内既有 2,294 部一致（例 ID-H1711/ID-H735 的 PP 作「Quy định của Chính phủ về」
// 与「กฎระเบียบรัฐบาลว่าด้วย」），不能另起一套更地道的说法，否则新旧不一致。
// th 为连写语言，句中不加空格，故 th 句框自带「ว่าด้วย」并直接黏主题。
const T = {
  UU: { zh: '法', en: 'Law', vi: 'Luật', th: 'พระราชบัญญัติว่าด้วย', ms: 'Akta', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PP: { zh: '政府条例', en: 'Government Regulation', vi: 'Quy định của Chính phủ', th: 'กฎระเบียบรัฐบาลว่าด้วย', ms: 'Peraturan Pemerintah', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PERPRES: { zh: '总统条例', en: 'Presidential Regulation', vi: 'Quy định của Tổng thống', th: 'กฎระเบียบประธานาธิบดีว่าด้วย', ms: 'Peraturan Presiden', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PERMEN: { zh: '部长条例', en: 'Ministerial Regulation', vi: 'Quy định của Bộ trưởng', th: 'กฎระเบียบรัฐมนตรีว่าด้วย', ms: 'Peraturan Menteri', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  KEPPRES: { zh: '总统决定', en: 'Presidential Decree', vi: 'Quyết định của Tổng thống', th: 'คำสั่งประธานาธิบดีว่าด้วย', ms: 'Keputusan Presiden', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  KEPMEN: { zh: '部长决定', en: 'Ministerial Decree', vi: 'Quyết định của Bộ trưởng', th: 'คำสั่งรัฐมนตรีว่าด้วย', ms: 'Keputusan Menteri', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PERDA: { zh: '地方条例', en: 'Regional Regulation', vi: 'Quy định địa phương', th: 'ข้อบัญญัติท้องถิ่นว่าด้วย', ms: 'Peraturan Daerah', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PBI: { zh: '印度尼西亚银行条例', en: 'Bank Indonesia Regulation', vi: 'Quy định của Ngân hàng Indonesia', th: 'กฎระเบียบธนาคารอินโดนีเซียว่าด้วย', ms: 'Peraturan Bank Indonesia', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PERBADAN: { zh: '机构条例', en: 'Agency Regulation', vi: 'Quy định của cơ quan', th: 'กฎระเบียบหน่วยงานว่าด้วย', ms: 'Peraturan Badan', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
  PERDIR: { zh: '公司条例', en: 'Board Regulation', vi: 'Quy định của Hội đồng quản trị', th: 'กฎระเบียบคณะกรรมการบริษัทว่าด้วย', ms: 'Peraturan Direksi', prep: { en: 'on', vi: 'về', th: '', ms: 'tentang' } },
};

const tableFile = process.argv[2];
const outPrefix = process.argv[3] || '_id_gen';
const tb = require(path.resolve(tableFile));
const ty = tb.type;
const def = T[ty];
if (!def) throw new Error('未知文书类型 ' + ty);

const items = {};
const bad = [];
for (const it of tb.items) {
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, it.id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '').replace(/\s+/g, ' ').trim();
  // 自校验：主题五语必须齐全，且不含中文括注残留
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!String(it[k] || '').trim()) bad.push(it.id + ' 缺 ' + k);
  }
  if (/[\u4e00-\u9fa5]/.test(it.en + it.vi + it.th + it.ms)) bad.push(it.id + ' 非 zh 层含汉字');
  const no = it.num ? ' ' + it.num : '';
  const y = it.num && it.num.includes('/') ? it.num.split('/')[1] : '';
  const n = it.num && it.num.includes('/') ? it.num.split('/')[0] : '';
  const noEn = n ? ` No. ${n} of ${y}` : '';
  const noVi = n ? ` số ${n} năm ${y}` : '';
  const noTh = n ? ` ฉบับที่ ${n} ปี ${y}` : '';
  const noMs = n ? ` Nomor ${n} Tahun ${y}` : '';
  items[it.id] = {
    // ID 口径：zh 只译主题不带文号
    zh: `关于${it.zh}的${def.zh}`,
    en: `${def.en}${noEn} ${def.prep.en} ${it.en}`,
    vi: `${def.vi}${noVi} ${def.prep.vi} ${it.vi}`,
    // 泰语连写：类型+号年+「ว่าด้วย」+主题，全句不加空格
    th: `${def.th}${n ? 'ฉบับที่ ' + n + ' ปี ' + y : ''}${it.th}`,
    ms: `${def.ms}${noMs} ${def.prep.ms} ${it.ms}`,
  };
}

const outJson = path.join(__dirname, outPrefix + '.json');
const outBad = path.join(__dirname, outPrefix + '.badids.json');
fs.writeFileSync(outJson, JSON.stringify({ items }, null, 0));
fs.writeFileSync(outBad, JSON.stringify(bad, null, 0));
console.log('写出', Object.keys(items).length, '| 自校验异常', bad.length);
if (bad.length) console.log(bad.slice(0, 10).join('\n'));
