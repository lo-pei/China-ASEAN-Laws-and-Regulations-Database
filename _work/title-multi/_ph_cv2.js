const { parse } = require('./_ph_gen2.js');
const list = require('./_ph_rest.json');
const out = [];
for (const x of list) {
  const r = parse(x.title.en || '');
  if (r.why !== 'slot-convert') continue;
  out.push({ en: (x.title.en || '').replace(/\s+/g, ' ').trim(), zh: x.title.zh || '' });
}
// 统计中文层对 sitios/barrios 的处理
const withSitio = out.filter((x) => /Sitios?\b/i.test(x.en));
console.log('含 Sitio', withSitio.length);
withSitio.slice(0, 6).forEach((x) => {
  console.log('EN:', x.en.slice(0, 150));
  console.log('ZH:', x.zh);
  console.log('');
});
const withBarrio = out.filter((x) => /Barrios?\b/i.test(x.en));
console.log('含 Barrio', withBarrio.length);
