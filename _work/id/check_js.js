/* 校验：id.js 中 text/paragraphs 一致性 + 结构统计 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/fulltext/id.js'), 'utf8'), ctx);
const FT = ctx.window.CALR_FULLTEXT;
let bad = 0, total = 0, chars = 0;
Object.keys(FT).forEach(id => {
  const e = FT[id];
  if (e.articleCount !== e.articles.length) { console.log('COUNT MISMATCH', id); bad++; }
  e.articles.forEach(a => {
    total++;
    if (a.paragraphs && a.paragraphs.join('\n') !== a.text.id) { console.log('TEXT MISMATCH', id, a.noLabel.id); bad++; }
    if (!a.id.startsWith(id + '-A')) { console.log('ID BAD', a.id); bad++; }
    chars += a.text.id.length;
  });
  console.log('%s | %s | %d 条 | sourceUrl=%s', id, e.language, e.articles.length, e.sourceUrl);
});
console.log('条文合计', total, '正文字符', chars, '问题', bad);
