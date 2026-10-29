const LX = require('./_ph_lex.js');
const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const want = process.argv[2] || 'slot-establish';
const H = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== want) continue;
  H.push((x.title.en || '').replace(/\s+/g, ' ').trim());
}
console.log(want, H.length);
H.slice(0, 6).forEach((s) => console.log('  · ' + s.slice(0, 210)));
// 末尾名词短语统计
const tail = {};
for (const s of H) {
  let body = s.replace(/^(?:An?\s+)?Act\s+\w+\s+(?:the\s+|a\s+|an\s+)?/i, '');
  body = body.split(/,?\s+(?:and\s+)?(?:Appropriating|Providing|Defining|Amending|Located|Situated)/i)[0];
  body = body.split(/\s+in\s+(?:the\s+)?(?:Barangay|Barrio|City|Municipality|Province|Region|District)\b/i)[0];
  const w = body.replace(/[.,;:]+$/, '').split(/\s+/);
  for (const n of [3, 2, 1]) {
    const k = w.slice(-n).join(' ');
    if (/^[A-Z]/.test(k)) { tail[k] = (tail[k] || 0) + 1; break; }
  }
}
console.log('--- 末尾名词短语 top 30 ---');
Object.entries(tail).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log(String(v).padStart(4), k));
