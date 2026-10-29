// 从存量四语记录里按「括号位置」对齐抽取术语对，建成 zh → 四语 的括注词典
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '../../prototype/data/laws');

const LANGS = ['vi', 'th', 'id', 'ms'];

// 抽取字符串中所有顶层括号内容（支持一层嵌套）
function parens(s) {
  const out = [];
  let depth = 0, buf = '', open = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '（' || c === '(') {
      if (depth === 0) { open = i; buf = ''; } else { buf += c; }
      depth++;
    } else if (c === '）' || c === ')') {
      depth--;
      if (depth === 0) out.push(buf);
      else buf += c;
    } else if (depth > 0) buf += c;
  }
  return out;
}

function main() {
  const dict = {};      // zh term -> {vi,th,id,ms, from}
  const recs = [];
  for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
    let t;
    try { t = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).title || {}; } catch (e) { continue; }
    if (!(t.vi && t.th && t.id && t.ms)) continue;
    recs.push({ id: f.replace('.json', ''), t });
  }

  for (const { id, t } of recs) {
    const zp = parens(t.zh || '');
    if (!zp.length) continue;
    for (const L of LANGS) {
      const lp = parens(t[L] || '');
      if (lp.length !== zp.length) continue;
      for (let i = 0; i < zp.length; i++) {
        const k = zp[i].trim();
        const v = lp[i].trim();
        if (!k || !v) continue;
        // 「第 2 号」「No. 2」这类序号不建条
        if (/^(第\s*[\dA-Za-z]+\s*号|No\.\s*\d+|Số\s*\d+|ฉบับที่\s*\d+|Nomor\s*\d+|Bilangan\s*\d+)$/i.test(k)) continue;
        dict[k] = dict[k] || {};
        if (!dict[k][L]) { dict[k][L] = v; dict[k]['from'] = id; }
      }
    }
  }

  // 只保留四语齐全的
  const full = {};
  for (const [k, v] of Object.entries(dict)) {
    if (LANGS.every(L => v[L])) full[k] = { vi: v.vi, th: v.th, id: v.id, ms: v.ms, from: v.from };
  }
  fs.writeFileSync(path.join(__dirname, '_sg_terms.json'), JSON.stringify(full, null, 1), 'utf8');
  console.log('recs', recs.length, 'zh terms seen', Object.keys(dict).length, 'full 4-lang', Object.keys(full).length);

  // 命中率：缺口里的中文括注是否已在词典中
  const { groups } = require('./_sg_tail.json');
  const all = [];
  for (const [p, arr] of Object.entries(groups)) for (const x of arr) all.push({ parent: p, ...x });
  let hit = 0, miss = 0;
  const missList = [];
  for (const x of all) {
    const zp = parens((x.t.zh || '').replace(/\s*\d{4}\s*$/, ''));
    if (!zp.length) { miss++; continue; }
    if (zp.every(k => full[k.trim()])) hit++;
    else missList.push({ id: x.id, zh: x.t.zh, mods: x.p.mods });
  }
  console.log('gap', all.length, 'zh-paren fully in dict', hit, 'miss', miss);
  if (process.argv[2] === '--miss') missList.slice(0, 30).forEach(m => console.log('·', m.id, '|', m.zh, '|', m.mods.join(' / ').slice(0, 80)));
}

main();
module.exports = { parens };
