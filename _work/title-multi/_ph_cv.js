const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const out = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== 'slot-convert') continue;
  out.push((x.title.en || '').replace(/\s+/g, ' ').trim());
}
console.log('slot-convert', out.length);
out.slice(0, 12).forEach((s) => console.log('  · ' + s.slice(0, 220)));
console.log('--- 是否含 into ---', out.filter((s) => /\binto\b/i.test(s)).length);
console.log('--- 是否含 to be known as ---', out.filter((s) => /to\s+be\s+known\s+as/i.test(s)).length);
