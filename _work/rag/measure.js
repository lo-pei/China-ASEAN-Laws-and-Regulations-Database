// 量化语料结构：多少法规真有结构化条文？条文长度分布？元数据头/噪声占比？
const fs = require('fs');
const path = require('path');

const DIR = path.join(process.cwd(), 'prototype/data/laws');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
console.log('  法规文件数: ' + files.length);

let withArt = 0, noArt = 0;
let totalArt = 0;
let lenBuckets = { '<60': 0, '60-200': 0, '200-800': 0, '>800': 0 };
let metaLike = 0;
let shortArt = 0;
let langPrim = {};
const sampleStep = Math.max(1, Math.floor(files.length / 4000));
let scanned = 0;

for (let i = 0; i < files.length; i += sampleStep) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(DIR, files[i]), 'utf8')); } catch (e) { continue; }
  scanned++;
  const arts = o.articles || [];
  if (!arts.length) { noArt++; continue; }
  withArt++;
  totalArt += arts.length;
  for (const a of arts) {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    if (!keys.length) continue;
    const prim = keys[0];
    langPrim[prim] = (langPrim[prim] || 0) + 1;
    const s = String(t[prim] || '');
    const L = s.length;
    if (L < 60) { lenBuckets['<60']++; shortArt++; }
    else if (L < 200) lenBuckets['60-200']++;
    else if (L < 800) lenBuckets['200-800']++;
    else lenBuckets['>800']++;
    if (/^#/.test(s.trim()) || s.indexOf('本文件为自动采集的元数据头') >= 0 ||
        s.indexOf('表格编号') >= 0 || s.indexOf('尊敬的') >= 0) metaLike++;
  }
}

const pct = (n, d) => d ? (n * 100 / d).toFixed(1) + '%' : '-';
console.log('');
console.log('  抽样法规数      : ' + scanned + '（步长 ' + sampleStep + '）');
console.log('  有结构化条文    : ' + withArt + '  (' + pct(withArt, scanned) + ')');
console.log('  仅目录/无条文   : ' + noArt + '  (' + pct(noArt, scanned) + ')');
console.log('  条文总数(抽样)  : ' + totalArt);
const totLen = Object.values(lenBuckets).reduce((a, b) => a + b, 0);
console.log('');
console.log('  条文长度分布（按主语言文本）:');
for (const k of Object.keys(lenBuckets)) {
  console.log('    ' + k.padEnd(8) + ' ' + String(lenBuckets[k]).padStart(7) + '  ' + pct(lenBuckets[k], totLen));
}
console.log('');
console.log('  疑似元数据头/表单模板 : ' + metaLike + '  (' + pct(metaLike, totLen) + ')');
console.log('  主语言分布（前 6）    :');
Object.entries(langPrim).sort((a, b) => b[1] - a[1]).slice(0, 6)
  .forEach(([k, v]) => console.log('    ' + k.padEnd(6) + String(v).padStart(8) + '  ' + pct(v, totLen)));
