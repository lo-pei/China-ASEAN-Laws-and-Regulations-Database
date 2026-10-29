// PH 扩床位类（An Act Increasing the Bed Capacity of <医院> in <地点> from N to M）标题合成器
'use strict';
const fs = require('fs');
const L = require('./_ph_lex.js');
const GAP = require('./_gap.json').gaps;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('out', 'bed.json');

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const V = ['tăng', 'เพิ่ม', 'meningkatkan', 'meningkatkan'];
const OBJ = ['sức chứa giường bệnh', 'จำนวนเตียง', 'kapasitas tempat tidur', 'kapasiti katil'];
const OF = [' của ', 'ของ', ' ', ' '];
const AT = [' tại ', 'ใน', ' di ', ' di '];
const FROM = [' từ ', ' จาก ', ' dari ', ' daripada '];
const TO = [' lên ', 'เป็น', ' menjadi ', ' kepada '];
const UNIT = [' giường', ' เตียง', ' tempat tidur', ' katil'];
const RGN = ['Vùng ', 'ภูมิภาค ', 'Wilayah ', 'Wilayah '];
const FUNDS = [', và phân bổ kinh phí', ' และจัดสรรงบประมาณ', ', dan mengalokasikan dana', ', serta memperuntukkan dana'];

function num(seg) {
  const m = seg.match(/\(\s*([\d,]+)\s*\)/);
  if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  const d = seg.match(/([\d,]+)/);
  if (d) return parseInt(d[1].replace(/,/g, ''), 10);
  return null;
}

const TAIL = /\s*,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Amending|Providing|Authorizing|for\s+Other\s+Purposes|Therefor)\b[\s\S]*$/i;

function parse(title) {
  let t = L.ENT(title).replace(/\s+/g, ' ').trim();
  if (!/^An Act\s+(?:to\s+)?Increasing\s+the\s+Bed\s+Capacity\s+(?:of|for\s+[A-Za-z \-]+?\s+of)\s+/i.test(t)) return null;
  const funds = /Appropriat/i.test(t);
  const other = /for\s+Other\s+Purposes/i.test(t);
  let rest = t.replace(/^An Act\s+(?:to\s+)?Increasing\s+the\s+Bed\s+Capacity\s+(?:of|for\s+[A-Za-z \-]+?\s+of)\s+/i, '');

  const fm = rest.match(/\s+[Ff]rom\s+([\s\S]+?)\s+[Tt]o\s+([\s\S]+)$/);
  if (!fm) return null;
  const from = num(fm[1]);
  const to = num(fm[2]);
  if (!from || !to || from >= to) return null;
  let left = rest.slice(0, fm.index).trim();

  // 地点：in/at 之后
  let loc = [];
  const sp = left.match(/^([\s\S]+?)\s+(?:in|at)\s+(?:the\s+)?(.+)$/i);
  let nm = left;
  if (sp) {
    nm = sp[1].trim();
    loc = L.parseLoc(sp[2]) || [];
    if (loc.length > 1 && loc[0].inferred) loc = loc.slice(1);
  }
  nm = L.cleanName(nm.replace(/[,;]+$/, ''));
  // Region N 是常用前缀，直接落地为「Vùng N」这类写法，避免半英半译
  nm = nm.replace(/\bRegion\s+(\d+[A-Z]?)\b/gi, (m0, n) => '\u0001' + n);
  if (!nm) return null;
  const g = L.trGenus(nm);
  if (!g || !g.core) return null;
  return { g, loc, from, to, funds, other };
}

function compose(p) {
  const out = {};
  const keys = ['vi', 'th', 'id', 'ms'];
  for (let i = 0; i < 4; i++) {
    const th = i === 1;
    let s = th ? HEAD[i] + V[i] : HEAD[i] + ' ' + V[i] + ' ';
    s += OBJ[i] + OF[i] + p.g[i].replace(/\u0001(\S+)/g, (m0, n) => RGN[i] + n);
    const lc = L.locText(p.loc, i);
    if (lc) s += AT[i] + lc;
    s += FROM[i] + p.from + TO[i] + p.to + UNIT[i];
    if (p.funds) s += FUNDS[i];
    s = th ? L.thFix(s) : s.replace(/\s+/g, ' ').trim();
    out[keys[i]] = s;
  }
  return out;
}

const RESID = /\b(?:the|and|of|in|for|with|by|its|that|which|shall|from|into|as|to|on|under|other|known)\b/i;
// 马来/印尼语本就沿用 Hospital / Institut / Kampus 等词形，只对 vi、th 检出残留
const CORE_EN = L.CORE.filter(c => !['Barangay', 'Barrio', 'Sitio'].includes(c[0]))
  .filter(c => String(c[1]).toLowerCase() !== String(c[0]).toLowerCase())
  .map(c => c[0]).filter(k => k.length >= 5);
const LEFT = new RegExp('\\b(?:' + CORE_EN.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|') + ')\\b', 'i');

const pool = GAP.filter(x => x.country === 'PH' && /^An Act\s+(?:to\s+)?Increasing\s+the\s+Bed\s+Capacity/i.test((x.title.en || '').trim()));
const items = {}; const skipped = {};
for (const x of pool) {
  let p = null;
  try { p = parse(x.title.en); } catch (e) { p = null; }
  if (!p) { skipped.parse = (skipped.parse || 0) + 1; continue; }
  const c = compose(p);
  let bad = null;
  for (const k of ['vi', 'th', 'id', 'ms']) {
    if (/["\u201c\u201d\u2018\u2019《》]/.test(c[k])) bad = 'quote';
    if (c[k].length < 20 || c[k].length > 300) bad = 'len';
    if (RESID.test(c[k])) bad = 'residue';
    if (k !== 'id' && k !== 'ms' && LEFT.test(c[k])) bad = 'leftEn';
  }
  if (bad) { skipped[bad] = (skipped[bad] || 0) + 1; continue; }
  items[x.id] = c;
}
fs.writeFileSync('batches/' + OUT, JSON.stringify({ batch: OUT.replace(/\.json$/, ''), count: Object.keys(items).length, items }, null, 1), 'utf8');
console.log('pool', pool.length, '→', Object.keys(items).length, JSON.stringify(skipped));
