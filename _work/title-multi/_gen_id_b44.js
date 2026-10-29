// b44：ID 长标题族「PERUBAHAN STRUKTUR KEPEMILIKAN SAHAM NEGARA …」（国家股权结构变更）14 条全收官，
// 此前五语全空。族内 6 个唯一标题被 OCR 截断在 110 字符，公司实体一律取 `Pasal 1` 首句定。
//
// 三种句框（差在「通过什么方式」）：
//   A  MELALUI PENERBITAN DAN PENJUALAN SAHAM BARU   发行**并出售**新股份
//   B  MELALUI PENERBITAN SAHAM BARU                 仅**发行**新股份
//   C  无方式从句，只写 PADA {公司}                    股权结构变更（可为大宗转让/首发等）
//
// 三条口径：
//   ① **A ≠ B**：「PENERBITAN DAN PENJUALAN」（发行 + 出售两道）与「PENERBITAN」（仅发行）是
//      两种不同的股本操作，译名必须分开写「发行并出售」／「发行」，不可都作「发行新股」。
//   ② C 式**不得补写方式**。`ID-H3165` 正文含首发（IPO）与后续处置，方式非单一，
//      原文既未在标题限定，译名也不加「通过…」。
//   ③ 标题写 `PERUSAHAAN PERSEROAN (PERSERO)` 的 12 条带公营有限公司形态；
//      `ID-H1812`（PP 4/2008，原 PERUM 改制后）与 `ID-H2296`（PT Kertas Padalarang）标题只写 `PT`，
//      不补 PERSERO——形态是法律身份，不可想当然。
'use strict';
const fs = require('fs');
const path = require('path');

const P = 'Perusahaan Perseroan (PERSERO)';
const PZ = '公营有限公司';

// 公司：zh 中文名；lat 拉丁名（不含 PERSERO 前缀）；persero 是否公营有限公司
const C = {
  jasaMarga: { zh: '贾萨·马尔加公司', lat: 'PT Jasa Marga', persero: true },
  garuda: { zh: '印度尼西亚鹰航公司', lat: 'PT Perusahaan Penerbangan Garuda Indonesia', persero: true },
  btn: { zh: '国家储蓄银行（Tbk）', lat: 'PT Bank Tabungan Negara Tbk', persero: true },
  waskita: { zh: '瓦斯基塔·卡尔亚公司', lat: 'PT Waskita Karya', persero: true },
  semenBaturaja: { zh: '巴图拉贾水泥公司', lat: 'PT Semen Baturaja', persero: true },
  djakartaLloyd: { zh: '雅加达·劳埃德远洋航运公司', lat: 'PT Pelayaran Samudera Djakarta Lloyd', persero: true },
  nindya: { zh: '宁迪亚·卡尔亚公司', lat: 'PT Nindya Karya', persero: true },
  krakatau: { zh: '喀拉喀托钢铁公司', lat: 'PT Krakatau Steel', persero: true },
  kertasPadalarang: { zh: '帕达拉朗造纸公司', lat: 'PT Kertas Padalarang', persero: false },
  bri: { zh: '印度尼西亚人民银行（Tbk）', lat: 'PT Bank Rakyat Indonesia Tbk', persero: true },
  kertasBasuki: { zh: '巴苏基·拉赫马特造纸公司', lat: 'PT Kertas Basuki Rachmat', persero: false },
};

const zName = (c) => (c.persero ? PZ + c.zh : c.zh);
const lName = (c) => (c.persero ? `${P} ${c.lat}` : c.lat);

const FR = (c, mode) => {
  const z = zName(c);
  const l = lName(c);
  if (mode === 'A') {
    return {
      zh: `${z}通过发行并出售新股份的国家股权结构变更法`,
      en: `Law on the Change in the Structure of State Share Ownership of ${l} through the Issuance and Sale of New Shares`,
      vi: `Luật về Việc Thay đổi Cơ cấu Sở hữu Cổ phần Nhà nước của ${l} thông qua Việc Phát hành và Bán Cổ phần Mới`,
      th: `พระราชบัญญัติว่าด้วยการเปลี่ยนแปลงโครงสร้างการถือหุ้นของรัฐใน${l}โดยการออกและจำหน่ายหุ้นใหม่`,
      ms: `Akta tentang Perubahan Struktur Pemilikan Saham Negara pada ${l} melalui Penerbitan dan Penjualan Saham Baru`,
    };
  }
  if (mode === 'B') {
    return {
      zh: `${z}通过发行新股份的国家股权结构变更法`,
      en: `Law on the Change in the Structure of State Share Ownership of ${l} through the Issuance of New Shares`,
      vi: `Luật về Việc Thay đổi Cơ cấu Sở hữu Cổ phần Nhà nước của ${l} thông qua Việc Phát hành Cổ phần Mới`,
      th: `พระราชบัญญัติว่าด้วยการเปลี่ยนแปลงโครงสร้างการถือหุ้นของรัฐใน${l}โดยการออกหุ้นใหม่`,
      ms: `Akta tentang Perubahan Struktur Pemilikan Saham Negara pada ${l} melalui Penerbitan Saham Baru`,
    };
  }
  // C：无方式从句
  return {
    zh: `印度尼西亚共和国在${z}的国家股权结构变更法`,
    en: `Law on the Change in the Structure of State Share Ownership of the Republic of Indonesia in ${l}`,
    vi: `Luật về Việc Thay đổi Cơ cấu Sở hữu Cổ phần Nhà nước của Cộng hòa Indonesia tại ${l}`,
    th: `พระราชบัญญัติว่าด้วยการเปลี่ยนแปลงโครงสร้างการถือหุ้นของรัฐสาธารณรัฐอินโดนีเซียใน${l}`,
    ms: `Akta tentang Perubahan Struktur Pemilikan Saham Negara Republik Indonesia pada ${l}`,
  };
};

// [id, 公司键, 句框, 正文须出现的公司串（自校验）]
const ROWS = [
  ['ID-H1694', 'jasaMarga', 'A', 'Jasa Marga'],
  ['ID-H2100', 'garuda', 'A', 'Garuda Indonesia'],
  ['ID-H2200', 'btn', 'A', 'Bank Tabungan Negara'],
  ['ID-H2201', 'waskita', 'A', 'Waskita Karya'],
  ['ID-H1900', 'btn', 'A', 'Bank Tabungan Negara'],
  ['ID-H1993', 'krakatau', 'A', 'Krakatau Steel'],
  ['ID-H2295', 'semenBaturaja', 'A', 'Semen Baturaja'],
  ['ID-H2500', 'djakartaLloyd', 'B', 'Djakarta Lloyd'],
  ['ID-H2202', 'nindya', 'B', 'Nindya Karya'],
  ['ID-H1994', 'waskita', 'B', 'Waskita Karya'],
  ['ID-H2101', 'garuda', 'B', 'Garuda Indonesia'],
  ['ID-H2296', 'kertasPadalarang', 'B', 'Kertas Padalarang'],
  ['ID-H3165', 'bri', 'C', 'Bank Rakyat Indonesia'],
  ['ID-H1812', 'kertasBasuki', 'C', 'Kertas Basuki Rachmat'],
];

const lawdir = path.resolve(__dirname, '../../prototype/data/laws');
const items = {};
const bad = [];
for (const [id, ck, mode, must] of ROWS) {
  const c = C[ck];
  if (!c) throw new Error('缺公司槽 ' + ck);
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
  const orig = String((d.title || {}).orig || '');
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');
  if (!txt.includes(must)) bad.push(id + ' 正文未见「' + must + '」');
  // 标题实写的方式从句须与 mode 一致
  const hasSale = /PENERBITAN DAN PENJUALAN SAHAM BARU/i.test(orig);
  const hasIssue = /MELALUI PENERBITAN SAHAM BARU/i.test(orig);
  if (mode === 'A' && !hasSale) bad.push(id + ' 标题无「DAN PENJUALAN」');
  if (mode === 'B' && !hasIssue) bad.push(id + ' 标题无「MELALUI PENERBITAN SAHAM BARU」');
  if (mode === 'C' && (hasSale || hasIssue)) bad.push(id + ' C 式标题却含方式从句');
  // 形态自校验：标题多半截断在「PADA PERUSAHAAN PERSER…」，故按两条判：
  //   ① 标题明写「PADA PT …」→ 不是 PERSERO（H1812 / H2296）；
  //   ② 标题已露「PERSERO)」→ 必须是 PERSERO；
  //   ③ 其余截断型由正文首句的「Perusahaan Perseroan (Persero) PT …」定。
  const titlePlainPT = /PADA PT\b/i.test(orig);
  const titlePersero = /PERSERO\)/i.test(orig);
  const bodyPersero = /Perusahaan Perseroan \(Persero\)/i.test(txt);
  const derived = titlePlainPT ? false : titlePersero ? true : bodyPersero;
  if (derived !== c.persero) bad.push(id + ' 形态判定不符（标题 PT=' + titlePlainPT + ' PERSERO=' + titlePersero + ' 正文=' + bodyPersero + '，表内 ' + c.persero + '）');
  items[id] = FR(c, mode);
}
if (bad.length) throw new Error('自校验失败：\n' + bad.join('\n'));

const n = Object.keys(items).length;
if (n !== 14) throw new Error('条目数应为 14，实为 ' + n);
const out = path.join(__dirname, '_id_b44.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b44', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
