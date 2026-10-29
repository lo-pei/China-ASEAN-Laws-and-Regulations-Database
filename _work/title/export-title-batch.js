#!/usr/bin/env node
/* CALR · 法规标题中译任务包导出
   用法：
     node _work/title/export-title-batch.js --country SG --count 150
     node _work/title/export-title-batch.js --country BN --count 150 --skip-existing
     node _work/title/export-title-batch.js --ids-file _work/title/ids.txt --count 0
   产出：_work/title/jobs/<JOBID>/{manifest.json,titles.json,README.txt}
*/
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const ROOT = process.cwd();
const LAWS = path.join(ROOT, 'prototype/data/laws');
const JOBDIR = path.join(ROOT, '_work/title/jobs');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return (v === undefined || v.startsWith('--')) ? true : v;
}

const COUNTRY = arg('country', null);
const COUNT = parseInt(arg('count', '150'), 10);
const IDS_FILE = arg('ids-file', null);
const SKIP_EXISTING = arg('skip-existing', false) !== false;
const LANG = arg('lang', 'zh');

/* ---------- 收集候选 ---------- */
const all = [];
for (const f of fs.readdirSync(LAWS)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  const t = o.title || {};
  if (SKIP_EXISTING && t.zh) continue;
  const src = t.en || t.zh || Object.keys(t).map(k => t[k]).filter(Boolean)[0];
  if (!src) continue;
  /* 只处理英文源；泰/缅/高棉文不在本任务范围 */
  if (/[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]/.test(src)) continue;
  all.push({
    id: o.id,
    country: o.country || '',
    level: o.level || '',
    articleCount: o.articleCount || (o.articles || []).length || 0,
    sourceLang: t.en ? 'en' : 'other',
    en: String(src).trim(),
    existingZh: t.zh || null
  });
}

let picked;
if (IDS_FILE) {
  const ids = fs.readFileSync(path.resolve(ROOT, IDS_FILE), 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
  const set = new Set(ids);
  picked = all.filter(x => set.has(x.id));
} else {
  picked = all.filter(x => !COUNTRY || x.country === COUNTRY);
  /* 优先：条数多的（更有检索价值）→ 标题短的（更好译） */
  picked.sort((a, b) => (b.articleCount - a.articleCount) || (a.en.length - b.en.length) || a.id.localeCompare(b.id));
}
if (COUNT > 0) picked = picked.slice(0, COUNT);

if (!picked.length) {
  console.error('  ✗ 没有可导出的条目');
  process.exit(1);
}

/* ---------- 生成 JOBID ---------- */
const now = new Date();
function pad(n) { return (n < 10 ? '0' : '') + n; }
const stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + pad(now.getHours()) + pad(now.getMinutes());
const scope = COUNTRY || (IDS_FILE ? 'IDS' : 'ALL');
const JOBID = 'CALR-TITLE-' + stamp + '-' + scope + '-' + String(picked.length);
const OUT = path.join(JOBDIR, JOBID);
fs.mkdirSync(OUT, { recursive: true });

/* ---------- titles.json（给 agent 的唯一数据源） ---------- */
const titles = picked.map(x => ({
  id: x.id,
  country: x.country,
  en: x.en,
  hint: x.articleCount ? (x.articleCount + ' 条') : ''
}));
fs.writeFileSync(path.join(OUT, 'titles.json'), JSON.stringify(titles, null, 1), 'utf8');

/* ---------- manifest.json ---------- */
const srcHash = crypto.createHash('sha256').update(JSON.stringify(titles)).digest('hex').slice(0, 16);
const manifest = {
  jobId: JOBID,
  task: 'law-title-translation',
  sourceLang: 'en',
  targetLang: LANG,
  createdAt: now.toISOString(),
  count: titles.length,
  titlesSha256: srcHash,
  scope: COUNTRY || (IDS_FILE ? 'ids-file' : 'all'),
  byCountry: titles.reduce((m, x) => { m[x.country] = (m[x.country] || 0) + 1; return m; }, {}),
  returnFormat: 'return-package',
  contract: 'rules/SKILL-法规标题中译规范.md'
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

/* ---------- README.txt（给 agent 的极简指路） ---------- */
fs.writeFileSync(path.join(OUT, 'README.txt'), [
  'CALR 法规标题中译任务包',
  '=======================',
  '任务编号: ' + JOBID,
  '条目数量: ' + titles.length,
  '',
  '你需要的输入: titles.json（本目录）',
  '你必须遵守的规则: rules/SKILL-法规标题中译规范.md',
  '你应当交回的结构: 回执包（见 SKILL 第 4 节），文件名必须为 titles.<NNN>.json + receipt.json',
  '',
  '一句话: 把 titles.json 里每一条的 en 译成 targetLang 的中文标题，',
  '        按 SKILL 规定的 JSON 结构交回，不要增删 id、不要合并条目、不要写说明性文字。',
  ''
].join('\r\n'), 'utf8');

console.log('  ✓ 任务包已生成');
console.log('    目录   : _work/title/jobs/' + JOBID);
console.log('    条目数 : ' + titles.length + ' 条');
console.log('    国别   : ' + JSON.stringify(manifest.byCountry));
console.log('    源哈希 : ' + srcHash);
console.log('');
console.log('  前 5 条预览:');
titles.slice(0, 5).forEach((x, i) => {
  console.log('    ' + (i + 1) + ') ' + x.id + '  ' + x.en.slice(0, 78));
});
