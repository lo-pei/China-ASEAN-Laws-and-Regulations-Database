// PH 分立类（An Act Separating X in … from Y [and Converting It Into Z]）标题合成器
const fs = require('fs');
const L = require('./_ph_lex.js');
const GAP = require('./_gap.json').gaps;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const LIMIT = parseInt(arg('limit', '300'), 10);
const SKIP = parseInt(arg('skip', '0'), 10);
const OUT = arg('out', 'sep.json');

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const V = ['tách', 'แยก', 'Memisahkan', 'Memisahkan'];
const FROM = [' khỏi ', 'ออกจาก', ' dari ', ' daripada '];
const AT = [' tại ', 'ใน', ' di ', ' di '];
const AND = [' và ', 'และ', ' dan ', ' dan '];
const CONV = [' chuyển thành ', 'ยกฐานะเป็น', ' menjadi ', ' menjadi '];
const NAME_AS = [' với tên gọi ', 'ชื่อ', ' dengan nama ', ' dengan nama '];
const FUNDS = [', và bố trí kinh phí', ' และจัดสรรงบประมาณ', ', dan mengalokasikan dana', ', dan memperuntukkan dana'];
const OTHER = [', và cho các mục đích khác', ' และเพื่อวัตถุประสงค์อื่น', ', dan untuk tujuan lain', ', dan untuk tujuan lain'];

const TAIL = /\s*,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Integrating|Amending|Providing|Repealing|Authorizing|Mandating|for\s+Other\s+Purposes|Therefor)\b[\s\S]*$/i;
const REL = /\b(?:Which|That|Where|Connecting|Traversing|Leads)\b/i;

function cleanName(x) {
  let s = L.ENT(x).replace(/\s+/g, ' ').trim();
  s = s.replace(/^the\s+/i, '').replace(/[,;:\s]+$/, '');
  s = s.replace(/\s*\([A-Z]{2,8}\)\s*/g, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

// 「Mankayan National High School, Bedbed Extension」= Bedbed 分校，拆成 母体 + 分校名
function splitBranch(nm) {
  const m = nm.match(/^(.+?)\s*[,\-–]\s*([A-Z][\w.'\- ]{1,28}?)\s+(Annex|Extension)(?:\s+School)?$/i);
  if (m) return { base: m[1].trim(), branch: m[2].trim(), kind: m[3] };
  const m2 = nm.match(/^(.+?)\s+(Annex|Extension)$/i);
  if (m2) return { base: m2[1].trim(), branch: null, kind: m2[2] };
  return null;
}

const BR = [
  ['Phân hiệu', 'วิทยาเขต', 'Kampus', 'Kampus'],
  [' của ', 'ของ', ', ', ', '],
];

function splitLoc(seg) {
  const pos = [];
  const re = /\s+(?:in|at)\s+(?:the\s+)?/gi;
  let m;
  while ((m = re.exec(seg))) pos.push(m.index);
  for (let k = pos.length - 1; k >= 0; k--) {
    const name = seg.slice(0, pos[k]).trim();
    const locRaw = seg.slice(pos[k]).replace(/^\s+(?:in|at)\s+(?:the\s+)?/i, '').trim();
    if (!name) continue;
    let loc = L.parseLoc(locRaw) || [];
    if (loc.length > 1 && loc[0].inferred) loc = loc.slice(1);
    if (loc.length) return { name, loc };
  }
  return { name: seg.trim(), loc: [] };
}

function parse(title) {
  let t = L.ENT(title).replace(/\s+/g, ' ').trim();
  if (!/^An Act\b/i.test(t)) return null;
  t = t.replace(/^An Act\s+/i, '');
  if (!/^Separating\s+/i.test(t)) return null;
  let rest = t.replace(/^Separating\s+/i, '');
  if (REL.test(rest)) return null;

  // 首段：the X in loc
  const fm = rest.match(/^([\s\S]+?)\s*,?\s+[Ff]rom\s+([\s\S]+)$/);
  if (!fm) return null;
  const leftRaw = fm[1].trim();
  let rightRaw = fm[2].trim();

  // 右段里的「and Converting it into Z to be known as W」拆出来
  let convType = null, newName = null;
  const cm = rightRaw.match(/\s*,?\s*(?:and\s+)?Converting\s+(?:it|the\s+same)\s+into\s+([\s\S]+)$/i);
  if (cm) {
    let conv = cm[1];
    rightRaw = rightRaw.slice(0, cm.index).trim();
    const kb = conv.match(/(?:to\s+be\s+known|to\s+Be\s+Known)\s+as\s+(?:the\s+)?([\s\S]+)$/i);
    if (kb) { newName = cleanName(kb[1].replace(TAIL, '')); conv = conv.slice(0, kb.index).trim(); }
    conv = conv.replace(TAIL, '').replace(/^an?\s+/i, '').replace(/[,;:\s]+$/, '').trim();
    convType = conv || null;
  }
  rightRaw = rightRaw.replace(TAIL, '').replace(/[,;:\s]+$/, '').trim();

  const other = /and\s+for\s+Other\s+Purposes/i.test(t);
  const funds = /Appropriating|Appropriation\s+of\s+Funds/i.test(t);

  const sp = splitLoc(leftRaw);
  let n1 = L.trGenus(sp.name);
  let branch = null;
  if (!n1 || !n1.core) {
    const br = splitBranch(cleanName(sp.name));
    if (br) {
      const b = L.trGenus(br.base);
      if (b && b.core) {
        branch = { base: b, name: br.branch };
        n1 = { core: 'branch' };
      }
    }
  }
  // 母体名后面常带地点（the X in the Municipality of Y），先剥掉再译
  const rp = splitLoc(rightRaw);
  const n2 = L.trGenus(rp.name);
  if (!n1 || !n1.core) return null;
  // 母体只以缩写指称（SPAMAST）时没有通名，可原样引用
  const n2bare = !n2.core && rp.name.split(/\s+/).length <= 4 && !/\b[a-z]{3,}\b/.test(rp.name);
  if (!n2 || (!n2.core && !n2bare)) return null;
  if (sp.name.split(/\s+/).length > 14 || rp.name.split(/\s+/).length > 14) return null;

  // 「Separating the Subprovince of X from the Province of Y」这类行政区划分立不走本引擎
  if (/^(?:Subprovince|Province|Municipality|City|Barangay|Barrio)\b/i.test(cleanName(sp.name))) return null;

  let conv = null;
  if (convType) {
    const ct = L.trGenus(convType);
    if (!ct || !ct.core) return null;
    const nn = newName ? L.trGenus(newName) : null;
    conv = { type: ct, name: nn && nn.core ? nn : null };
  }

  return { n1, branch, loc: sp.loc, n2, conv, funds, other };
}

function compose(p) {
  const out = {};
  const keys = ['vi', 'th', 'id', 'ms'];
  for (let i = 0; i < 4; i++) {
    const th = i === 1;
    let s = th ? HEAD[i] + V[i] : HEAD[i] + ' ' + V[i] + ' ';
    if (p.branch) {
      s += BR[0][i] + (p.branch.name ? ' ' + p.branch.name : '') + BR[1][i] + p.branch.base[i];
    } else {
      s += p.n1[i];
    }
    const lc = L.locText(p.loc, i);
    if (lc) s += AT[i] + lc;
    s += FROM[i] + p.n2[i];
    if (p.conv) {
      s += AND[i] + CONV[i] + p.conv.type[i];
      if (p.conv.name) s += NAME_AS[i] + p.conv.name[i];
    }
    if (p.funds) s += FUNDS[i];
    if (p.other) s += OTHER[i];
    s = th ? L.thFix(s) : s.replace(/\s+/g, ' ').trim();
    out[keys[i]] = s;
  }
  return out;
}

// ── 选取 ──────────────────────────────────────────────────────
const RE = /^An Act\s+Separating\s+/i;
const pool = GAP.filter(x => x.country === 'PH' && RE.test((x.title.en || '').trim()));

const items = {};
const skipped = {};
let taken = 0;
for (const x of pool) {
  if (Object.keys(items).length >= LIMIT) break;
  const p = parse(x.title.en);
  if (!p) { skipped.parse = (skipped.parse || 0) + 1; continue; }
  const c = compose(p);
  let bad = null;
  for (const k of ['vi', 'th', 'id', 'ms']) {
    if (/["\u201c\u201d\u2018\u2019《》]/.test(c[k])) bad = 'quote';
    if (c[k].length < 14 || c[k].length > 380) bad = 'len';
    if (/\b(?:the|and|of|in|for|with|by)\b/.test(c[k])) bad = 'residue';
  }
  if (bad) { skipped[bad] = (skipped[bad] || 0) + 1; continue; }
  if (taken++ < SKIP) continue;
  items[x.id] = c;
}

fs.writeFileSync('batches/' + OUT, JSON.stringify({ batch: OUT.replace(/\.json$/, ''), count: Object.keys(items).length, items }, null, 1), 'utf8');
console.log('pool', pool.length, '→', Object.keys(items).length, JSON.stringify(skipped));
