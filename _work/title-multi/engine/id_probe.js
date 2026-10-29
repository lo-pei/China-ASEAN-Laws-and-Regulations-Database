/* ID 标题结构探查：剥动词前缀 → 统计唯一主语短语与频次 */
const fs = require('fs'), path = require('path');
const LAWS = 'prototype/data/laws';

const VERBS = [
  'PENYELENGGARAAN', 'PENYELESAIAN', 'PEMBERHENTIAN', 'PENYELENGGARAAN',
  'PENETAPAN', 'PEMBENTUKAN', 'PENAMBAHAN', 'PENGESAHAN', 'PEMBERIAN',
  'PERHITUNGAN', 'PEMINDAHAN', 'PENGALIHAN', 'PENGELOLAAN', 'PELAKSANAAN',
  'PENYERTAAN', 'PENCABUTAN', 'PENDIRIAN', 'PENJUALAN', 'PEMBUBARAN',
  'PENGENAAN', 'PEMBINAAN', 'PENYERAHAN', 'PEMBAYARAN', 'PENGGUNAAN',
  'PENGADAAN', 'PENGANGKATAN', 'PENGHAPUSAN', 'PERUBAHAN', 'PERPANJANGAN',
  'PENGEMBALIAN', 'PENETAPAN', 'PEMBEBASAN', 'PENANGGUNGAN', 'PENYIMPANAN',
  'PENGIRIMAN', 'PEMASUKAN', 'PENGELUARAN', 'PEMUNGUTAN', 'PENARIKAN',
  'PEMUTUSAN', 'PENUNDAAN', 'PENGECUALIAN', 'PENYIDIKAN', 'PENUNTUTAN',
  'PENGGANTIAN', 'PEMERIKSAAN', 'PENILAIAN', 'PEMANFAATAN', 'PENATAAN',
];

function norm(s) {
  let x = String(s).replace(/\s+/g, ' ').trim().toUpperCase();
  /* 抓取丢空格：PEMBENTUKANMAJELIS / LAHIRDAN / MENTERIKEUANGAN */
  x = x.replace(/^(PEMBENTUKAN|PERUBAHAN|PENAMBAHAN|PENETAPAN|PENGESAHAN|PEMBERIAN|PENGGANTIAN|PENETAPAN)(?=[A-Z]{3,})/, '$1 ');
  x = x.replace(/\b(LAHIR|SURAT KENAL)(DAN)\b/g, '$1 $2');
  x = x.replace(/\b(MENTERI)(KEUANGAN)\b/g, '$1 $2');
  return x;
}

const BAD_TAIL = /\b(DAN|ATAU|YANG|UNTUK|DARI|PADA|DALAM|ATAS|DENGAN|BAGI|SERTA|NOMOR|TAHUN|NR|NO|TENTANG|MENGENAI|SERTA|YANG|PER)\s*$/;
const BAD_TAIL2 = /\([^)]*$/;   /* 括号未闭合 */

const rows = [];
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('ID-')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const t = d.title || {};
  if (String(t.zh || '').trim()) continue;
  rows.push({ id: d.id, raw: String(t.id || t.orig || '').replace(/\s+/g, ' ').trim(), no: String(d.docNumber || '').trim() });
}

const sorted = VERBS.slice().sort((a, b) => b.length - a.length);
const objCnt = {}, verbCnt = {};
let truncated = 0, verbed = 0;
const detail = [];
for (const r of rows) {
  let s = norm(r.raw);
  if (BAD_TAIL.test(s) || BAD_TAIL2.test(s)) { truncated++; continue; }
  let verb = '';
  for (const V of sorted) {
    if (s.startsWith(V + ' ')) { verb = V; s = s.slice(V.length).trim(); break; }
  }
  if (verb) { verbed++; verbCnt[verb] = (verbCnt[verb] || 0) + 1; }
  /* 侧边类型词：X TENTANG Y → 剥出主体与主题 */
  objCnt[s] = (objCnt[s] || 0) + 1;
  detail.push({ id: r.id, verb, obj: s, no: r.no });
}

console.log('总缺口', rows.length, '| 截断/残片跳过', truncated, '| 带动词前缀', verbed, '| 可用', detail.length);
console.log('唯一主语短语', Object.keys(objCnt).length);
const top = Object.entries(objCnt).sort((a, b) => b[1] - a[1]);
console.log('出现≥2次的主语', top.filter(x => x[1] >= 2).length, '覆盖部数', top.filter(x => x[1] >= 2).reduce((a, b) => a + b[1], 0));
fs.writeFileSync(path.join(__dirname, '_id_detail.json'), JSON.stringify(detail, null, 0), 'utf8');
fs.writeFileSync(path.join(__dirname, '_id_obj.json'), JSON.stringify(top.map(([k, v]) => ({ obj: k, n: v })), null, 0), 'utf8');
console.log('已写 _id_detail.json / _id_obj.json');
