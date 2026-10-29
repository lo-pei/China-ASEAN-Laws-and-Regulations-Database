/* 按 App 的 packFor() 逻辑，逐个验证 laws/ 中每部法是否可解析到分卷 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const PD = path.join(ROOT, 'prototype', 'data');

function boot(files) {
  const c = { window: {}, document: {} }; c.window = c; vm.createContext(c);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(PD, f), 'utf8'), c, { filename: f });
  return c;
}
const c = boot(['fulltext/manifest.js', 'cn-catalog.js', 'intl/manifest.js']);
const fm = c.CALR_FULLTEXT_MANIFEST || {};
const cat = c.CALR_CN_CATALOG || { laws: [] };
const im = c.CALR_INTL_MANIFEST || {};
const catByLaw = {};
(cat.laws || []).forEach(l => { catByLaw[l.id] = l; });

function packFor(lawId) {
  if (fm.byLaw && fm.byLaw[lawId]) return { kind: 'jurisdiction', file: fm.byLaw[lawId] };
  for (let i = 0; i < (cat.laws || []).length; i++) if (cat.laws[i].id === lawId && cat.laws[i].pack) return { kind: 'cn', file: cat.laws[i].pack };
  const f = (im.byLaw) ? im.byLaw[lawId] : null;
  if (f) return { kind: 'intl', file: f };
  return null;
}
/* 分卷内实际存在的 id */
const inPack = {
  fulltext: {}, cn: {}, intl: {}
};
function scan(dir) {
  const out = {};
  const d = path.join(PD, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.js') && x !== 'manifest.js')) {
    const src = fs.readFileSync(path.join(d, f), 'utf8');
    let m; const re = /FT\["([^"]+)"\]/g;
    while ((m = re.exec(src))) out[m[1]] = f.replace(/\.js$/, '');
  }
  return out;
}
inPack.fulltext = scan('fulltext'); inPack.cn = scan('cn'); inPack.intl = scan('intl');

const idx = JSON.parse(fs.readFileSync(path.join(PD, 'laws', 'index.json'), 'utf8'));
let ok = 0, unresolved = [], wrongPack = [];
for (const l of idx.laws) {
  const p = packFor(l.id);
  if (!p) { unresolved.push(l.id); continue; }
  const dirKey = p.kind === 'jurisdiction' ? 'fulltext' : p.kind;
  const present = inPack[dirKey][l.id];
  if (present === undefined) { wrongPack.push({ id: l.id, kind: dirKey, wants: p.file }); continue; }
  ok++;
}
console.log('=== packFor 可解析性（' + idx.laws.length + ' 部）===');
console.log('  可解析且分卷内确实存在：' + ok);
console.log('  无法解析（packFor 返回 null）：' + unresolved.length + (unresolved.length ? ' → ' + unresolved.slice(0, 8).join(', ') : ' ✓'));
console.log('  解析到分卷但该分卷内查无此法：' + wrongPack.length);
wrongPack.slice(0, 10).forEach(x => console.log('    ' + x.id + '  → ' + x.kind + '/' + x.wants));
const byC = {};
wrongPack.forEach(x => { const k = x.id.slice(0, 2); byC[k] = (byC[k] || 0) + 1; });
if (wrongPack.length) console.log('    按国别 ' + JSON.stringify(byC));

/* 分卷内存在但 laws/ 没有的 id（反向） */
const lawSet = new Set(idx.laws.map(l => l.id));
const orphan = [];
for (const k of ['fulltext', 'cn', 'intl']) for (const id of Object.keys(inPack[k])) if (!lawSet.has(id)) orphan.push(k + '/' + id);
console.log('');
console.log('  分卷内存在但权威存储没有的 id：' + orphan.length + (orphan.length ? ' → ' + orphan.slice(0, 6).join(', ') : ' ✓'));
