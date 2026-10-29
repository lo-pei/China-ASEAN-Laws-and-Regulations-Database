'use strict';
const { readDocx, paragraphs } = require('./docx');
const { parseArticles } = require('./parse');
const files = ['civilcode', 'company', 'pipl', 'arb2017', 'fil', 'lawapp', 'netdata', 'trademark2019', 'marketreg', 'fil-reg', 'laborcontract', 'socialins', 'eit', 'copyright', 'dsl', 'hainan', 'ft2022', 'arb2025', 'patent', 'laborarb', 'lawapp-j2'];
let bad = 0;
for (const f of files) {
  const r = parseArticles(paragraphs(readDocx(__dirname + '/raw/' + f + '.docx')), {});
  const inStruct = new Set(r.structure);
  const missing = r.articles.filter(a => a.chapter && !inStruct.has(a.chapter));
  const assigned = new Set();
  r.structure.forEach(t => { });
  const covered = new Set();
  r.articles.forEach(a => { if (inStruct.has(a.chapter)) covered.add(a.chapter); });
  const emptyStruct = r.structure.filter(t => !covered.has(t));
  console.log(f, 'n=' + r.articles.length, 'struct=' + r.structure.length,
    '章节未在结构=' + missing.length,
    '结构项未被条文引用=' + emptyStruct.length,
    missing.length ? JSON.stringify(missing.slice(0, 2).map(a => a.no + '@' + a.chapter)) : '',
    emptyStruct.length ? JSON.stringify(emptyStruct.slice(0, 2)) : '');
  if (missing.length) bad++;
}
console.log('files with issues: ' + bad);
