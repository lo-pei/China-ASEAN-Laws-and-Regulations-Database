/**
 * SG 条文号类从属法例标题合成（68 部）
 * 这类记录的 zh/en 标题本身不含区分信息（如 Order under Section 11 (3)），
 * 只能按条文号模板落地，不做逐条意译。
 */
const fs = require('fs');
const path = require('path');
const GAP = require('./_gap.json').gaps;
const { splitZh } = require('./_sg_mem.js');

const L = ['vi', 'th', 'id', 'ms'];

// 「第 N(M) 条」四语写法
const SEC = [
  (n) => 'Điều ' + n,
  (n) => 'มาตรา ' + n,
  (n) => 'Pasal ' + n,
  (n) => 'Seksyen ' + n,
];
const ORD = ['Lệnh', 'คำสั่ง', 'Perintah', 'Perintah'];
const NOT = ['Thông báo', 'ประกาศ', 'Pemberitahuan', 'Pemberitahuan'];
const UNDER = [' theo ', 'ตาม', ' menurut ', ' menurut '];
const EXEMPT = ['miễn trừ', 'ยกเว้น', 'pengecualian', 'pengecualian'];
const PLURAL = ['Các ', 'ประกาศต่าง ๆ ', 'Pemberitahuan-pemberitahuan ', 'Pemberitahuan-pemberitahuan '];

// 全角括号统一成半角，供拉丁/泰文标题共用
const norm = (s) => String(s).replace(/（/g, '(').replace(/）/g, ')').replace(/\s+/g, ' ').trim();

// 一次性特例（数量太少，直接落表）
const SPECIAL = {
  '一般命令': ['Lệnh chung', 'คำสั่งทั่วไป', 'Perintah Umum', 'Perintah Am'],
  '人员借用命令': ['Lệnh biệt phái nhân sự', 'คำสั่งยืมตัวบุคลากร', 'Perintah peminjaman personel', 'Perintah pinjam pegawai'],
  '使1990年附属法例修订版生效的命令': [
    'Lệnh đưa Bản hợp nhất pháp luật phụ năm 1990 vào hiệu lực',
    'คำสั่งให้บทบัญญัติแห่งกฎหมายลำดับรองฉบับปรับปรุง 1990 มีผลใช้บังคับ',
    'Perintah pemberlakuan Semakan Perundangan Subsidiari 1990',
    'Perintah penguatkuasaan Semakan Perundangan Subsidiari 1990',
  ],
  '使法律修订版生效的命令': [
    'Lệnh đưa Bản hợp nhất pháp luật vào hiệu lực',
    'คำสั่งให้บทบัญญัติแห่งกฎหมายฉบับปรับปรุงมีผลใช้บังคับ',
    'Perintah pemberlakuan Semakan Perundangan',
    'Perintah penguatkuasaan Semakan Perundangan',
  ],
};
// 活页修订页公告：期号三维
const LOOSE = (issue) => [
  `Thông báo theo Điều 10(6) và 17(6) về việc công bố trang sửa đổi của bản luật phụ dạng tờ rời (số ${issue})`,
  `ประกาศตามมาตรา 10(6) และ 17(6) เกี่ยวกับการประกาศหน้าแก้ไขกฎหมายลำดับรองแบบแผ่นหลุด (ฉบับที่ ${issue})`,
  `Pemberitahuan menurut Pasal 10(6) dan 17(6) tentang penerbitan halaman pindaan perundangan subsidiari bentuk lembaran lepas (No. ${issue})`,
  `Pemberitahuan menurut Seksyen 10(6) dan 17(6) tentang penerbitan halaman pindaan perundangan subsidiari bentuk lembaran lepas (No. ${issue})`,
];

function build(zh) {
  const z = norm(zh).replace(/\s+/g, '');

  if (SPECIAL[z]) return SPECIAL[z];
  const loose = z.match(/^关于发布附属法例活页修订页[（(]第([\d/]+)期[)）]的第10\(6\)与17\(6\)条公告$/);
  if (loose) return LOOSE(loose[1]);

  // 第 N(M) 条 + 体裁
  let m = z.match(/^第([\dA-Za-z]+(?:\([^)]*\))*)条(?:项下|下)的(命令|公告|各项公告|豁免命令)$/);
  if (!m) return null;
  const num = m[1];
  const kind = m[2];

  return L.map((_, i) => {
    // 泰文词间不加空格，其余语种保留空格
    if (kind === '豁免命令') return ORD[i] + (i === 1 ? '' : ' ') + EXEMPT[i] + UNDER[i] + SEC[i](num);
    if (kind === '公告') return NOT[i] + UNDER[i] + SEC[i](num);
    if (kind === '各项公告') return PLURAL[i] + UNDER[i].trimStart() + ' ' + SEC[i](num);
    return ORD[i] + UNDER[i] + SEC[i](num);
  }).map((s) => (s == null ? null : s));
}

const sg = GAP.filter((x) => x.country === 'SG');
const nom = sg.filter((x) => {
  const z = splitZh(x.title.zh);
  return z && !z.mod;
});
const SYL = /条(?:项)?下的(?:命令|公告|各项公告|豁免命令)|下的豁免命令|一般命令|借用命令|使.*生效的命令|活页修订页/;
const pool = nom.filter((x) => SYL.test(x.title.zh || ''));

const items = {};
let skip = [];
for (const x of pool) {
  const r = build(x.title.zh);
  if (!r || r.some((s) => !s)) { skip.push(x.id + ' | ' + x.title.zh); continue; }
  const o = {};
  L.forEach((k, i) => (o[k] = r[i]));
  items[x.id] = o;
}

const out = { batch: 'sg-p1-b05', note: 'SG 条文号类从属法例（模板合成）', count: Object.keys(items).length, items };
fs.writeFileSync(path.join(__dirname, 'batches', 'sg-p1-b05.json'), JSON.stringify(out, null, 1), 'utf8');
console.log('pool', pool.length, 'built', Object.keys(items).length, 'skip', skip.length);
skip.slice(0, 8).forEach((s) => console.log(' skip', s));
