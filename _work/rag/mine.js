// Day3：从「同一条文的多语言文本」里挖取跨语言词对（数据驱动，不靠人工编造译名）
//
// 原理：很多法规条文的 text 同时带 {en, vi}/{en, th}/{en, id} 等多个语种。
//       同一条文里共同出现的英文词与当地语言词，有较高概率互为译名。
//       用 PMI（点互信息）筛出强关联词对，作为跨语言术语桥的候选。
//
// 输出：_work/rag/mined-pairs.json  → { en: { zh?:[], vi:[], th:[], id:[], ms:[], ... } }
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWS = path.join(ROOT, 'prototype/data/laws');

const CJK = /[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g;
const LATIN = /^[a-z\u00c0-\u024f]+$/;

function tokStrict(text) {
  if (!text) return [];
  const s = String(text).toLowerCase();
  const out = [];
  const cjk = s.match(CJK);
  if (cjk) for (let i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
  const latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
  for (const w of latin) if (w && w.length > 1) out.push(w);
  return out;
}
// 当地语言「词」：用空格切的整词（泰语无空格，退化为长串，故泰语单独按 3-6 字子串处理）
function tokWords(text) {
  if (!text) return [];
  return String(text).toLowerCase()
    .replace(/[^\w\u00c0-\u024f\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]+/g, ' ')
    .split(' ')
    .filter(w => w.length > 2);
}

const STOP_EN = new Set(('the and or of to in for by with as on at from that this which shall may must any all such other ' +
  'be is are was were has have had not no if then than under into its it their his her they them we our you your ' +
  'provided accordance section article paragraph act law regulation rule order case person persons').split(' '));

console.log('  扫描多语言平行条文...');
const t0 = Date.now();
const files = fs.readdirSync(LAWS).filter(f => f.endsWith('.json') && f !== 'index.json');

// 统计：co[lang][enWord][localWord] = 共现次数
const co = {};              // lang -> Map('en|local' -> count)
const dfEn = new Map();     // enWord -> 文档数
const dfLoc = {};           // lang -> Map(localWord -> 文档数)
let pairs = 0, used = 0;

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
  for (const a of (o.articles || [])) {
    const t = a.text || {};
    const keys = Object.keys(t).filter(k => t[k]);
    if (keys.length < 2) continue;
    // 以 en 为锚
    const enKey = keys.find(k => k === 'en');
    if (!enKey) continue;
    const enToks = [...new Set(tokStrict(t[enKey]).filter(w => LATIN.test(w) && w.length > 3 && !STOP_EN.has(w)))];
    if (!enToks.length) continue;
    let any = false;
    for (const lk of keys) {
      if (lk === 'en') continue;
      const locToksRaw = tokStrict(t[lk]);
      // 泰/缅/高棉/老挝：按字 3-6 元组（无空格语言）；其他按整词
      let locToks;
      if (['th', 'my', 'km', 'lo'].includes(lk)) {
        const chars = locToksRaw.filter(x => x.length === 2).map(x => x[0]); // 近似取字
        locToks = [];
        for (let i = 0; i + 3 <= chars.length; i++) locToks.push(chars.slice(i, i + 3).join(''));
        locToks = [...new Set(locToks)];
      } else {
        locToks = [...new Set(tokWords(t[lk]).filter(w => w.length > 3))];
      }
      if (!locToks.length) continue;
      any = true;
      co[lk] = co[lk] || new Map();
      dfLoc[lk] = dfLoc[lk] || new Map();
      const m = co[lk];
      for (const e of enToks) {
        dfEn.set(e, (dfEn.get(e) || 0) + 1);
        for (const l of locToks) {
          const k = e + '|' + l;
          m.set(k, (m.get(k) || 0) + 1);
        }
      }
      for (const l of locToks) dfLoc[lk].set(l, (dfLoc[lk].get(l) || 0) + 1);
    }
    if (any) used++;
    pairs++;
  }
}
console.log('  平行条文对 ' + used + ' 组 / 条文 ' + pairs + ' 条 / ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
console.log('  各语种共现词对规模:');
Object.keys(co).forEach(lk => console.log('    ' + lk.padEnd(4) + ' 词对 ' + co[lk].size + '  本地词 ' + dfLoc[lk].size));

// PMI 筛选
const D = used;
const OUT = {};
Object.keys(co).forEach(lk => {
  const res = [];
  for (const [k, c] of co[lk].entries()) {
    if (c < 3) continue;
    const [e, l] = k.split('|');
    const de = dfEn.get(e) || 1, dl = dfLoc[lk].get(l) || 1;
    const pmi = Math.log((c / D) / ((de / D) * (dl / D)));
    if (pmi < 2.5) continue;
    res.push({ e, l, c, pmi: +pmi.toFixed(2) });
  }
  res.sort((a, b) => b.pmi - a.pmi || b.c - a.c);
  OUT[lk] = res.slice(0, 4000);
  console.log('    ' + lk.padEnd(4) + ' PMI≥2.5 候选 ' + res.length + '，保留前 ' + Math.min(4000, res.length));
});

fs.writeFileSync(path.join(__dirname, 'mined-pairs.json'), JSON.stringify(OUT, null, 1), 'utf8');
console.log('');
console.log('  已写出: _work/rag/mined-pairs.json');
console.log('');
// 抽查
['vi', 'th', 'id'].forEach(lk => {
  if (!OUT[lk] || !OUT[lk].length) return;
  console.log('  【' + lk + ' 前 8 对】');
  OUT[lk].slice(0, 8).forEach(p => console.log('    ' + p.e.padEnd(22) + ' ↔ ' + p.l + '   c=' + p.c + ' pmi=' + p.pmi));
});
