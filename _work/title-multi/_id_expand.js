// 把「标题 → 五语」展开成「条目 id → 五语」批次，并对齐清洗后的标题。
// 用法：node _work/title-multi/_id_expand.js <src.json> <out.json>
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const srcRel = process.argv[2];
const outRel = process.argv[3];
if (!srcRel || !outRel) { console.error('用法：node _id_expand.js <src.json> <out.json>'); process.exit(1); }

const srcRaw = JSON.parse(fs.readFileSync(path.resolve(ROOT, srcRel), 'utf8'));
const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const LANGS = ['zh', 'en', 'vi', 'th', 'ms'];

// 所有唯一标题（三桶合集），键为大写清洗标题
const byTitle = new Map();
for (const k of ['standalone', 'verbal', 'phrase', 'long']) {
  for (const u of buckets[k] || []) byTitle.set(u.s.toUpperCase(), u);
}

const items = {};
const problems = [];
let covered = 0;
for (const [rawTitle, v] of Object.entries(srcRaw)) {
  if (rawTitle.startsWith('_')) continue;
  const key = rawTitle.toUpperCase();
  const u = byTitle.get(key);
  if (!u) { problems.push(['标题未匹配', rawTitle]); continue; }
  const miss = LANGS.filter((L) => !v[L] || !String(v[L]).trim());
  if (miss.length) { problems.push(['缺语种', rawTitle, miss.join(',')]); continue; }
  for (const id of u.ids) {
    items[id] = { zh: v.zh, en: v.en, vi: v.vi, th: v.th, ms: v.ms };
    covered++;
  }
}
console.log('源条目（唯一标题）', Object.keys(srcRaw).filter((k) => !k.startsWith('_')).length);
console.log('展开覆盖条目', covered, '| 批次条数', Object.keys(items).length);
if (problems.length) {
  console.log('问题', problems.length);
  problems.slice(0, 20).forEach((p) => console.log('  · ' + p.join('  ')));
}
fs.writeFileSync(path.resolve(ROOT, outRel), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出', outRel);
