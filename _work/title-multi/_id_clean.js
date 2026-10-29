// ID 短标题清洗与可分性判定。只读。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const gap = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_gap.json'), 'utf8'));
const items = gap.gaps.filter((x) => x.country === 'ID');

// 清洗：去重编号后缀、尾标点、拆字空格、多余空格
function clean(raw) {
  let s = String(raw || '').replace(/\s+/g, ' ').trim();
  const flags = [];
  if (/_\d+$/.test(s)) { s = s.replace(/_\d+$/, '').trim(); flags.push('dedup'); }
  if (/[.,;:]+$/.test(s)) { s = s.replace(/[.,;:]+$/, '').trim(); flags.push('tailpunct'); }
  // 字母被空格拆开：「E N E R G I」「P E L A Y A R A N」
  if (/^(?:[A-Za-z] ){2,}[A-Za-z]$/.test(s)) { s = s.replace(/\s+/g, ''); flags.push('split'); }
  return { s, flags };
}

// 动词性主题：单看词无法构成完整法规名（「批准」「撤销」什么？）
const VERBAL = new Set(['PENGESAHAN', 'PENCABUTAN', 'PEMUNGUTAN', 'PENUNJUKAN', 'PENETAPAN', 'PERUBAHAN', 'PENAMBAHAN', 'PENGESAHAN', 'PEMBERIAN', 'PENGGUNAAN', 'PEMBENTUKAN', 'PENGELOLAAN', 'PENYELENGGARAAN', 'PELAKSANAAN', 'PENGAWASAN', 'PEMBINAAN', 'PENYERTAAN', 'PENGALIHAN', 'PEMINDAHAN', 'PENETAPAN']);

const rows = [];
const seen = new Map();
for (const x of items) {
  const { s, flags } = clean(x.title && x.title.orig);
  if (!s) continue;
  const k = s.toUpperCase();
  if (!seen.has(k)) seen.set(k, { s, flags, ids: [x.id], level: x.level });
  else seen.get(k).ids.push(x.id);
}
const uniq = [...seen.values()];

const buckets = { standalone: [], verbal: [], phrase: [], long: [] };
for (const u of uniq) {
  const words = u.s.split(/\s+/);
  const head = words[0].toUpperCase();
  if (u.s.length > 60) { buckets.long.push(u); continue; }
  if (words.length === 1) {
    if (VERBAL.has(head)) buckets.verbal.push(u);
    else buckets.standalone.push(u);
  } else {
    if (VERBAL.has(head) && words.length <= 3) buckets.verbal.push(u);
    else buckets.phrase.push(u);
  }
}
console.log('唯一标题', uniq.length);
console.log('  单词可独立成意', buckets.standalone.length);
console.log('  动词性（信息不全）', buckets.verbal.length);
console.log('  短语（2+ 词，≤60 字）', buckets.phrase.length);
console.log('  长标题（>60）', buckets.long.length);
console.log('\n动词性样本：', buckets.verbal.slice(0, 15).map((u) => u.s).join(' / '));
console.log('\n短语样本：', buckets.phrase.slice(0, 15).map((u) => u.s).join(' / '));

// level 分布
const lv = {};
for (const x of items) lv[x.level || 'null'] = (lv[x.level || 'null'] || 0) + 1;
console.log('\nlevel 分布：', lv);

// 带清洗标记的样本
console.log('\n清洗命中样本：');
uniq.filter((u) => u.flags.length).slice(0, 10).forEach((u) => console.log('  · [' + u.flags.join(',') + '] ' + u.s));

fs.writeFileSync(path.join(__dirname, '_id_buckets.json'), JSON.stringify(buckets, null, 1), 'utf8');
