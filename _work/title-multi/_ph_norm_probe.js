// 数据源分级探针：把 PH 缺口按「脏数据形态」分类，分别测规则引擎通过率。
// 目的：量出「修数据源」到底能解锁多少条，而不是凭感觉判断。
// 只读，不写任何数据。
const fs = require('fs');
const path = require('path');
const { solve } = require('./_ph_all.js');

const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));

const T = (x) => ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();

// ---- 形态判定 ----
const RE_ARCH = /^(?:MALACA[NÑ]AN\s+PALACE|BY\s+THE\s+PRESIDENT|THE\s+PRESIDENT(?:'S)?\s+OFFICE|OFFICE\s+OF\s+THE\s+PRESIDENT)/i;
const RE_NUM = /^(?:(?:BATAS(?:ANG)?\s+PAMBANSA|REPUBLIC\s+ACT|COMMONWEALTH\s+ACT|ACT|EXECUTIVE\s+ORDER|PRESIDENTIAL\s+DECREE|PROCLAMATION|ADMINISTRATIVE\s+ORDER|MEMORANDUM\s+(?:ORDER|CIRCULAR))\s*(?:BLG\.?|BILANG|NO\.?)?\s*\d+[A-Z\-]*)\s*[,:]?\s*/i;
const RE_ANACT = /^AN?\s+ACT\b/i;

function classify(t) {
  if (!t) return 'empty';
  const flags = [];
  if (RE_ARCH.test(t)) flags.push('arch');
  let body = t;
  if (RE_ARCH.test(t)) {
    // 档案前缀通常到 "OF THE PHILIPPINES" 或第一个 AN ACT 为止
    const m = t.match(RE_ANACT);
    if (m) body = t.slice(m.index);
    else flags.push('arch-no-body');
  }
  if (RE_NUM.test(body)) {
    const nm = body.match(RE_NUM);
    const rest = body.slice(nm[0].length);
    if (RE_ANACT.test(rest)) { flags.push('num'); body = rest; }
    else flags.push('num-only');
  }
  // 全大写判定（忽略数字/标点）
  const letters = body.replace(/[^A-Za-z]/g, '');
  if (letters.length > 20 && letters === letters.toUpperCase()) flags.push('allcaps');
  // 尾部虚词截断
  if (/\b(?:of|the|and|in|to|for|by|with|on|as|from|its|or|a|an)\s*\.?$/i.test(body)) flags.push('tail-trunc');
  return { flags, body };
}

// ---- 分类桶 ----
const buckets = new Map();
function bucketOf(flags) {
  const has = (f) => flags.includes(f);
  if (has('arch-no-body') || has('num-only')) return 'X 仅有著录/文号，无题名';
  const p = has('arch') || has('num');
  if (p && has('allcaps')) return 'D 前缀 + 全大写';
  if (p) return 'C 前缀（可剥）';
  if (has('allcaps')) return 'B 全大写';
  return 'A 干净';
}

const rows = [];
for (const x of src) {
  const t = T(x);
  if (!t) continue;
  const c = classify(t);
  if (typeof c === 'string') continue;
  const b = bucketOf(c.flags);
  // 用剥过前缀的正文去解，模拟「修好数据源之后」的效果
  const cur = solve(t);
  const fixed = c.body !== t ? solve(c.body) : null;
  const rec = { id: x.id, b, t, body: c.body, flags: c.flags, ok: !!cur, okFixed: fixed ? !!fixed : null };
  rows.push(rec);
  if (!buckets.has(b)) buckets.set(b, { n: 0, ok: 0, okFixed: 0, fixedTried: 0 });
  const s = buckets.get(b);
  s.n++;
  if (rec.ok) s.ok++;
  if (rec.okFixed !== null) { s.fixedTried++; if (rec.okFixed) s.okFixed++; }
}

console.log('PH 源条数（有 en）', rows.length);
console.log('\n桶'.padEnd(24), '条数'.padStart(6), '当前产出'.padStart(10), '修后产出'.padStart(10));
for (const [k, v] of [...buckets.entries()].sort()) {
  console.log(
    k.padEnd(24),
    String(v.n).padStart(6),
    (v.ok + ' (' + ((v.ok / v.n) * 100).toFixed(1) + '%)').padStart(10),
    (v.fixedTried ? v.okFixed + '/' + v.fixedTried : '-').padStart(10)
  );
}

const tot = rows.length;
const totOk = rows.filter((r) => r.ok).length;
const totFixed = rows.filter((r) => r.okFixed === true).length;
const tried = rows.filter((r) => r.okFixed !== null).length;
console.log('\n合计'.padEnd(24), String(tot).padStart(6), (totOk + ' (' + ((totOk / tot) * 100).toFixed(2) + '%)').padStart(10), totFixed + '/' + tried);

// 抽样看「干净」桶里还失败的，确认残差文体
const cleanFail = rows.filter((r) => r.b === 'A 干净' && !r.ok);
console.log('\nA 桶失败样本 10 条：');
cleanFail.slice(0, 10).forEach((r) => console.log('  · ' + r.t.slice(0, 150)));

const capFail = rows.filter((r) => r.b === 'B 全大写' && !r.ok);
console.log('\nB 桶失败样本 5 条：');
capFail.slice(0, 5).forEach((r) => console.log('  · ' + r.t.slice(0, 150)));

fs.writeFileSync(path.join(__dirname, '_ph_norm_probe.json'), JSON.stringify({ buckets: [...buckets.entries()], rows: rows.map(({ t, body, ...x }) => x) }, null, 0), 'utf8');
