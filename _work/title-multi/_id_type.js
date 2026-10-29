// 印尼法规文书类型自动判定（只为提速：把「回原文判类型」从手工改为机器）
// 用法：node _work/title-multi/_id_type.js [--list] [--fam=UU] [--json]
// 判据优先级：文首自称 > 文末 PENJELASAN 标题 > 正文「Dalam … ini」
// 只读正文，不改任何数据；判不出即弃（不猜）
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const lawdir = path.join(root, 'prototype/data/laws');

const need = (d) => ['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim());

// 顺序即优先级：越具体的放前面（PERATURAN MENTERI 必须先于 PERATURAN）
const RULES = [
  ['UU', /UNDANG[- ]UNDANG REPUBLIK INDONESIA|\bUNDANG[- ]UNDANG NOMOR\b.*\bTENTANG\b/],
  ['PP', /PERATURAN PEMERINTAH (?:PENGGANTI )?REPUBLIK INDONESIA/],
  ['PERPRES', /PERATURAN PRESIDEN REPUBLIK INDONESIA/],
  ['PERMEN', /PERATURAN MENTERI ([A-Z][A-Z ]{3,40}?) REPUBLIK INDONESIA/],
  ['PERMEN', /PERATURAN MENTERI ([A-Z][A-Z ]{3,40}?) NOMOR/],
  ['KEPPRES', /KEPUTUSAN PRESIDEN REPUBLIK INDONESIA/],
  ['KEPMEN', /KEPUTUSAN MENTERI ([A-Z][A-Z ]{3,40}?) (?:REPUBLIK INDONESIA )?NOMOR/],
  ['PERDA', /PERATURAN DAERAH (?:PROVINSI|KABUPATEN|KOTA)/],
  ['PBI', /PERATURAN BANK INDONESIA/],
  ['PERBADAN', /PERATURAN (?:KEPALA |BADAN |LEMBAGA )([A-Z][A-Z ]{3,40}?) (?:REPUBLIK INDONESIA )?NOMOR/],
  ['PERDIR', /PERATURAN DIREKSI|PERATURAN DIREKTUR/],
  ['PERBPOM', /PERATURAN BADAN PENGAWAS OBAT DAN MAKANAN/],
];

function classify(txt) {
  // 取文首（自称常在第一条前的抬头）与文末（PENJELASAN 复述标题）
  const head = txt.slice(0, 4000);
  const tail = txt.slice(-6000);
  for (const seg of [head, tail]) {
    for (const [code, re] of RULES) {
      const m = seg.match(re);
      if (!m) continue;
      // 邻域校验：命中处前后 300 字符内若在引述他条（sebagaimana diatur / diubah dengan / dicabut dengan），
      // 则这不是本条自称，跳过继续找。
      const i = seg.indexOf(m[0]);
      const win = seg.slice(Math.max(0, i - 300), i + 300).toLowerCase();
      if (/sebagaimana (diatur|dimaksud)|diubah dengan|dicabut dengan|berdasarkan peraturan/.test(win)) continue;
      return { code, dept: (m[1] || '').trim(), ev: m[0].slice(0, 70) };
    }
  }
  // 兜底：必须是「Dalam Peraturan X ini」——指本条自身。
  // 不能放宽成「Dalam Peraturan X 」，否则「sebagaimana diatur dalam Peraturan Pemerintah Nomor 12/1998」
  // 这类引述他条的句子会被误判为本条的性质（存量里 PP 一度虚高到 455 部即由此）。
  const m = txt.match(/Dalam Peraturan (Menteri|Pemerintah|Presiden|Daerah|Bank Indonesia) ini\b/i);
  if (m) {
    const map = { Menteri: 'PERMEN', Pemerintah: 'PP', Presiden: 'PERPRES', Daerah: 'PERDA' };
    const code = map[m[1]] || (m[1] === 'Bank Indonesia' ? 'PBI' : null);
    if (code) return { code, dept: '', ev: m[0] };
  }
  return null;
}

const rows = [];
for (const f of fs.readdirSync(lawdir)) {
  if (!f.startsWith('ID-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(lawdir, f), 'utf8'));
  if (!need(d)) continue;
  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');
  const t = classify(txt);
  rows.push({
    id: f.slice(0, -5),
    type: t ? t.code : '-',
    dept: t ? t.dept : '',
    ev: t ? t.ev : '',
    len: txt.length,
    orig: String((d.title || {}).orig || '').replace(/\s+/g, ' ').trim(),
  });
}

const argList = process.argv.includes('--list');
const argJson = process.argv.includes('--json');
const famArg = (process.argv.find((a) => a.startsWith('--fam=')) || '').slice(6);

if (argJson) {
  fs.writeFileSync(path.join(__dirname, '_id_type.json'), JSON.stringify(rows, null, 0));
}
if (famArg) {
  const sub = rows.filter((r) => r.type === famArg);
  console.log(sub.length);
  for (const r of sub) console.log(r.id + '\t' + r.orig.slice(0, 100));
} else {
  const c = {};
  for (const r of rows) c[r.type] = (c[r.type] || 0) + 1;
  console.log('待译', rows.length, '判定结果：', JSON.stringify(c));
  const unk = rows.filter((r) => r.type === '-');
  console.log('判不出', unk.length, '，其中正文 <200 字的', unk.filter((r) => r.len < 200).length);
  if (argList) for (const r of unk.slice(0, 40)) console.log(r.id + '\t' + r.len + '\t' + r.orig.slice(0, 80));
}
