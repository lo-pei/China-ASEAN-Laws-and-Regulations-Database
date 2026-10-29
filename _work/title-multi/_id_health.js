// ID 缺口 2,861 部体检：长度/结构/重复/首词分布。只读。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const gap = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_gap.json'), 'utf8'));
const items = gap.gaps.filter((x) => x.country === 'ID');

const T = (x) => String((x.title && (x.title.orig || x.title.en)) || '').replace(/\s+/g, ' ').trim();

const stat = { total: items.length, empty: 0, tentang: 0, allcaps: 0, withNum: 0, dup: 0 };
const lenBins = { '<=25': 0, '26-50': 0, '51-90': 0, '91-150': 0, '>150': 0 };
const firstWords = new Map();
const norms = new Map();
const samples = [];
for (const x of items) {
  const t = T(x);
  if (!t) { stat.empty++; continue; }
  if (/\bTENTANG\b/i.test(t)) stat.tentang++;
  const letters = t.replace(/[^A-Za-z]/g, '');
  if (letters.length > 6 && letters === letters.toUpperCase()) stat.allcaps++;
  if (/\bNOMOR\b|\bNO\.?\s*\d|\bTAHUN\s*\d{4}/i.test(t)) stat.withNum++;
  const n = t.length;
  if (n <= 25) lenBins['<=25']++;
  else if (n <= 50) lenBins['26-50']++;
  else if (n <= 90) lenBins['51-90']++;
  else if (n <= 150) lenBins['91-150']++;
  else lenBins['>150']++;
  const w = (t.match(/^[A-Za-z-]+/) || [''])[0].toUpperCase();
  firstWords.set(w, (firstWords.get(w) || 0) + 1);
  const key = t.toUpperCase();
  norms.set(key, (norms.get(key) || 0) + 1);
  if (samples.length < 400) samples.push(t);
}
let dupGroups = 0, dupExtra = 0;
for (const [, v] of norms) if (v > 1) { dupGroups++; dupExtra += v - 1; }
stat.dup = dupExtra;

console.log('ID 缺口', stat.total);
console.log('  空标题', stat.empty, '| 含 TENTANG', stat.tentang, '| 全大写', stat.allcaps, '| 含文号/年份', stat.withNum);
console.log('  唯一标题', norms.size, '| 重复组', dupGroups, '| 冗余重复', dupExtra);
console.log('  长度分布', lenBins);
console.log('\n首词 top20：');
console.log([...firstWords.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k, v]) => k + ':' + v).join('  '));

// 长度分层的随机样本
console.log('\n=== 短标题样本（<=25）===');
samples.filter((s) => s.length <= 25).slice(0, 10).forEach((s) => console.log('  · ' + s));
console.log('\n=== 中标题样本（26-90）===');
samples.filter((s) => s.length > 25 && s.length <= 90).slice(0, 10).forEach((s) => console.log('  · ' + s));
console.log('\n=== 长标题样本（>90）===');
samples.filter((s) => s.length > 90).slice(0, 6).forEach((s) => console.log('  · ' + s.slice(0, 200)));
