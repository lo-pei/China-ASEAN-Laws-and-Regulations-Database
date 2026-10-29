const fs = require('fs'), path = require('path'), vm = require('vm');
const PROTO = path.join(process.cwd(), 'prototype');
const sb = { console, setTimeout, clearTimeout, Date, Math, JSON, RegExp, String, Number, Array, Object, Boolean, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Map, Set, Promise, Error };
sb.window = sb; sb.self = sb; sb.globalThis = sb; vm.createContext(sb);
const html = fs.readFileSync(path.join(PROTO, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x));
for (const rel of srcs) {
  const c = rel.replace(/^\.\//, '').replace(/\?.*$/, '');
  if (/^data\/(intl|cn|fulltext)\//.test(c)) continue;
  const p = path.join(PROTO, c);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: c }); } catch (e) {}
}
console.log('  CALR_TERMS_BRIDGE: ' + !!sb.CALR_TERMS_BRIDGE);
console.log('  CALR_BM25_IDF    : ' + !!sb.CALR_BM25_IDF);
if (sb.CALR_TERMS_BRIDGE) {
  const keys = Object.keys(sb.CALR_TERMS_BRIDGE);
  console.log('  桥词条数: ' + keys.length);
  ['经济补偿', '注册资本', 'annual return', 'severance'].forEach(k => {
    const e = sb.CALR_TERMS_BRIDGE[k.toLowerCase()];
    console.log('    "' + k + '" → ' + (e ? JSON.stringify({ zh: e.zh, en: e.en, th: e.th, vi: e.vi }) : '未收录'));
  });
}
sb.CALR.store.init();
const r = sb.CALR.search.run({ q: '泰国劳动法关于经济补偿金怎么规定？', mode: 'semantic', size: 5 });
console.log('');
console.log('  泰国经济补偿金 top5:');
r.items.forEach((it, i) => console.log('   [' + (i + 1) + '] ' + it.score.toFixed(2) + '  ' + sb.CALR.util.tr(it.law.title).slice(0, 28)));
