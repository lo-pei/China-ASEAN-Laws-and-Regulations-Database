// 删死链前核对：这些 id 是否已被 CALR_FULLTEXT_META / fulltext manifest 覆盖
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.cwd();
const PD = path.join(ROOT, 'prototype/data');
const LAWS = path.join(PD, 'laws');

function load(rel) {
  const src = fs.readFileSync(path.join(PD, rel), 'utf8');
  const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
  vm.runInContext(src, sb, { filename: rel });
  return sb;
}

const laws = new Set();
for (const f of fs.readdirSync(LAWS)) {
  if (f.endsWith('.json') && f !== 'index.json') laws.add(f.slice(0, -5));
}

const inl = load('intl-catalog.js').CALR_INTL_CATALOG || { laws: [] };
const dead = (inl.laws || []).filter(x => !laws.has(x.id)).map(x => x.id);
console.log('  intl-catalog 死链: ' + dead.length);

// 覆盖来源
const meta = load('fulltext/manifest.js');
const META = meta.CALR_FULLTEXT_META || {};
const FT = load('fulltext/cn.js');
// 也看 intl manifest
const im = load('intl/manifest.js');
const IM = im.CALR_INTL_MANIFEST || {};
const byLaw = IM.byLaw || (IM.meta && IM.meta.byLaw) || {};
console.log('  CALR_FULLTEXT_META 条目: ' + Object.keys(META).length);
console.log('  intl manifest byLaw  : ' + Object.keys(byLaw).length);

let covered = 0, notCovered = [];
for (const id of dead) {
  if (META[id] || byLaw[id]) covered++;
  else notCovered.push(id);
}
console.log('');
console.log('  死链中已被 META/manifest 覆盖: ' + covered);
console.log('  删除后会彻底消失的         : ' + notCovered.length);
if (notCovered.length) {
  console.log('    样例（前 20）:');
  notCovered.slice(0, 20).forEach(x => console.log('      ' + x));
  // 再查这些 id 是否在 intl 分卷里（有正文但元数据缺失）
  console.log('');
  console.log('    检查这些 id 是否有正文分卷...');
  const hit = [];
  for (const sub of ['intl', 'fulltext', 'cn']) {
    const d = path.join(PD, sub);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter(x => x.endsWith('.js'))) {
      const src = fs.readFileSync(path.join(d, f), 'utf8');
      for (const id of notCovered) {
        if (src.indexOf("'" + id + "'") >= 0 || src.indexOf('"' + id + '"') >= 0) { hit.push(id + '@' + sub + '/' + f); break; }
      }
    }
  }
  console.log('      有正文分卷的: ' + hit.length);
  hit.slice(0, 10).forEach(x => console.log('        ' + x));
  // 看一条死链的完整记录，判断是否为重复/失效
  if (notCovered.length) {
    const sample = (inl.laws || []).find(x => x.id === notCovered[0]);
    console.log('');
    console.log('    死链样例完整记录: ' + JSON.stringify(sample).slice(0, 400));
  }
}
