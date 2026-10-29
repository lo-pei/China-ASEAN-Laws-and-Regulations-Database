// 改名族可套框比例测算：纯槽位型 vs 自由文本型
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));

const ADMIN = 'Municipality|Municipal District|City|Province|Subprovince|Barrio|Barangay|Sitio|Pueblo|District|Island|Region';
const NAME = "[A-Z][A-Za-z'’\\u00C0-\\u024F.\\-]*(?:[ ,]+(?:de|del|la|las|los|y|and|the|of)?[ ,]*[A-Z][A-Za-z'’\\u00C0-\\u024F.\\-]*)*";

// 纯槽位型：CHANGING THE NAME OF THE <ADMIN> OF <NAME>[, IN THE <ADMIN> OF <NAME>], TO [THAT OF] <NAME>
const CLEAN = new RegExp(
  '^(?:An?\\s+Act\\s+)?(?:to\\s+)?Chang(?:ing|e)\\s+the\\s+Names?\\s+of\\s+' +
  '(?:the\\s+)?(?:(?:' + ADMIN + ')\\s+of\\s+)?(' + NAME + ')' +
  '(?:\\s*,\\s*(?:in\\s+the\\s+)?(?:' + ADMIN + ')\\s+of\\s+(' + NAME + '))?' +
  '\\s*,?\\s*(?:to|into)\\s+(?:that\\s+of\\s+)?(?:the\\s+)?(' + NAME + ')\\s*\\.?$', 'i');

const fam = src.filter((x) => /^(?:AN?\s+ACT\s+)?(?:to\s+)?(?:Chang|Renam)/i.test(((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim()));
const clean = [], dirty = [];
for (const x of fam) {
  const t = ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
  // 先剥「AN ACT / to」再判
  if (CLEAN.test(t)) clean.push({ id: x.id, t });
  else dirty.push({ id: x.id, t });
}
console.log('改名族', fam.length, '| 纯槽位可套框', clean.length, '| 其余', dirty.length);
console.log('\n--- 可套框样本 ---');
clean.slice(0, 10).forEach((r) => console.log('  ', r.t.slice(0, 150)));
console.log('\n--- 不可套框样本 ---');
dirty.slice(0, 12).forEach((r) => console.log('  ', r.t.slice(0, 140)));
fs.writeFileSync(path.join(ROOT, '_work/title-multi/_ph_rename_clean.json'), JSON.stringify(clean, null, 1), 'utf8');
