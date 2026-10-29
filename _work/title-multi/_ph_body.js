const LX = require('./_ph_lex.js');
const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const want = process.argv[2] || 'slot-establish';
const out = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== want) continue;
  out.push({ id: x.id, en: (x.title.en || '').replace(/\s+/g, ' ').trim() });
}
console.log(want, out.length);
// 打印前 30 条的「核心名词短语」候选：最后一个大写开头段
out.slice(0, 26).forEach((x) => {
  let b = x.en.replace(/^(?:An?\s+)?Act\s+\w+\s+(?:the\s+|a\s+|an\s+)?/i, '');
  b = b.split(/,?\s+(?:and\s+)?(?:Appropriating|Providing|Defining|and\s+for\s+Other|Amending)/i)[0];
  console.log('  · ' + b.slice(0, 150));
});
