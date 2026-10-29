// PH 缺口清单重建：按 laws/ 现状重算，写出 _ph_rest.json（格式与旧快照一致）
// 旧 _ph_rest.json 是快照，各引擎只从中取数，写库后必然重复计算 → 每轮开工前先跑本脚本
'use strict';
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '../../prototype/data/laws');
const LANGS = ['vi', 'th', 'id', 'ms'];

const rest = [];
const stat = { total: 0, done: 0, partial: {} };

for (const f of fs.readdirSync(DOCS).filter((x) => x.startsWith('PH-') && x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8'));
  const t = d.title || {};
  stat.total++;
  const miss = LANGS.filter((L) => !t[L]);
  if (!miss.length) { stat.done++; continue; }
  if (miss.length !== LANGS.length) stat.partial[miss.join(',')] = (stat.partial[miss.join(',')] || 0) + 1;
  rest.push({
    id: d.id,
    country: d.country || 'PH',
    level: d.level || null,
    coverage: d.coverage || null,
    articleCount: d.articleCount || (d.articles ? d.articles.length : 0),
    p: null,
    miss,
    origLang: d.language || (t.orig && /[^\x00-\x7F]/.test(t.orig) ? 'orig' : 'en'),
    title: { zh: t.zh || '', en: t.en || '', orig: t.orig || '' },
  });
}

rest.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(path.join(__dirname, '_ph_rest.json'), JSON.stringify(rest, null, 0), 'utf8');

console.log('PH 总', stat.total, '| 四语齐备', stat.done, '| 余', rest.length);
if (Object.keys(stat.partial).length) console.log('部分缺失：', JSON.stringify(stat.partial));
console.log('已写出 _ph_rest.json');
