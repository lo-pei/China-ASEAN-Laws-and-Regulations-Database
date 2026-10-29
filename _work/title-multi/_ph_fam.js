const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const rows = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.frame) continue;
  rows.push({ id: x.id, en: (x.title.en || '').replace(/\s+/g, ' ').trim() });
}
const fam = (name, re, n = 4) => {
  const a = rows.filter((x) => re.test(x.en));
  console.log('=== ' + name + ' (' + a.length + ') ===');
  a.slice(0, n).forEach((x) => console.log('  ' + x.en.slice(0, 200)));
};
fam('upgrading', /^(?:An?\s+)?Act\s+Upgrading\s+/i);
fam('naming', /^(?:An?\s+)?Act\s+Naming\s+/i);
fam('constituting', /^(?:An?\s+)?Act\s+Constituting\s+/i);
fam('extending', /^(?:An?\s+)?Act\s+Extending\s+/i);
fam('fixing', /^(?:An?\s+)?Act\s+Fixing\s+/i);
fam('standardizing', /^(?:An?\s+)?Act\s+Standardizing\s+/i);
fam('further_amending', /^(?:An?\s+)?Act\s+Further\s+Amending\s+/i);
fam('transferring', /^(?:An?\s+)?Act\s+Transferring\s+/i);
