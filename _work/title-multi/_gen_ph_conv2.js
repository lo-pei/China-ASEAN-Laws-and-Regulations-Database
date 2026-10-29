// PH 转制类 / 设立类（An Act Converting X into Y / Creating X）标题合成器 v2
'use strict';
const fs = require('fs');
const L = require('./_ph_lex.js');
const GAP = require('./_gap.json').gaps;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FAM = arg('fam', 'both');
const LIMIT = parseInt(arg('limit', '400'), 10);
const SKIP = parseInt(arg('skip', '0'), 10);
const OUT = arg('out', 'conv.json');

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const V_CONV = ['chuyển đổi', 'เปลี่ยนสถานะ', 'mengubah status', 'menukar status'];
const V_NEW = ['thành lập', 'จัดตั้ง', 'membentuk', 'menubuhkan'];
const TO = [' thành ', 'เป็น', ' menjadi ', ' kepada '];
const AT = [' tại ', 'ใน', ' di ', ' di '];
const FUNDS = [', và phân bổ kinh phí', ' และจัดสรรงบประมาณ', ', dan mengalokasikan dana', ', dan memperuntukkan dana'];
const OTHER = [', và cho các mục đích khác', ' และเพื่อวัตถุประสงค์อื่น', ', dan untuk tujuan lain', ', dan untuk tujuan lain'];
const BOTH = [', phân bổ kinh phí và cho các mục đích khác', ' และจัดสรรงบประมาณเพื่อวัตถุประสงค์อื่น',
              ', mengalokasikan dana dan untuk tujuan lain', ', memperuntukkan dana dan untuk tujuan lain'];

// 尾附句：从这些动词起一律截断
const TAIL = /\s*,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Integrating|Amending|Providing|Prescribing|Defining|Giving\s+it|Granting|Repealing|Authorizing|Mandating|Establishing|Including|Transferring|for\s+Other\s+Purposes|Therefor|Abolishing|Renaming|Increasing|Upgrading|Expanding|Extending|Strengthening|Augmenting|Separating|Changing|Declaring|Placing|Fixing|Assigning|Reclassifying|Renaming)\b[\s\S]*$/i;

// 主体名后面的附属成分（its Units and Satellite Campuses 之类）
const UNIT = /\s*,?\s+(?:its|the)\s+(?:Units?|Satellite\s+Campuses|Extension\s+Campuses|Regular\s+Campuses|Branches|Main\s+Campus|Present\s+Sites)\b[\s\S]*$/i;

function cut(s, re) { const m = s.match(re); return m ? s.slice(0, m.index).trim() : s; }

function prep(raw) {
  let x = L.ENT(raw).replace(/\s+/g, ' ').trim();
  x = x.replace(/^(?:the|a|an)\s+/i, '').trim();
  x = x.replace(/^Present\s+/i, '').trim();
  x = x.replace(/[,;:.\s]+$/, '').trim();
  return x;
}

// 名称 + 地点：返回 { name, loc }
function nameLoc(seg) {
  const sp = seg.match(/^(.*?)\s+(?:in|at)\s+(?:the\s+)?([A-Z].*)$/);
  if (sp) {
    const nm = cut(sp[1].trim(), UNIT).replace(/[,;:]+$/, '').trim();
    let loc = L.parseLoc(sp[2]) || [];
    if (loc.length > 1 && loc[0].inferred) loc = loc.slice(1);
    if (nm) return { name: nm, loc };
  }
  const nm = cut(seg, UNIT).replace(/[,;:]+$/, '').replace(/^(?:the\s+)?Present\s+/i, '').trim();
  return { name: nm, loc: [] };
}

// 复数名回退：vi/th 不标复数，id/ms 复数可省，单数化后重试
function gen(name) {
  const g = L.trGenus(name);
  if (g && g.core) return g;
  const s1 = name.replace(/\b([A-Za-z]+)ies$/i, (m, a) => a + 'y')
                 .replace(/\b([A-Za-z]{3,})s$/i, '$1');
  if (s1 !== name) { const g2 = L.trGenus(s1); if (g2 && g2.core) return g2; }
  return g;
}

// ── 转制类 ───────────────────────────────────────────────────
function parseConv(t) {
  const rest = t.replace(/^Converting\s+/i, '');
  let m = rest.match(/\s+[Ii]nto\s+/);
  // 「, to a State College」这一路：to + 不定冠词/定冠词 也算转换连接词
  if (!m) m = rest.match(/\s+to\s+(?:a|an|the)\s+/i);
  if (!m) return null;
  const leftRaw = rest.slice(0, m.index).trim();
  let rightRaw = rest.slice(m.index + m[0].length).trim();

  // 目标名：有 to be known as 就以它为准
  let target = null;
  const kb = rightRaw.match(/[,]?\s*(?:and\s+)?(?:to\s+be\s+known|to\s+Be\s+Known|Known|to\s+be\s+Know?n)\s+as\s+(?:the\s+)?([\s\S]+)$/i);
  if (kb) {
    target = cut(kb[1], TAIL);
    rightRaw = rightRaw.slice(0, kb.index).trim();
  }
  rightRaw = prep(cut(rightRaw, TAIL));
  if (!rightRaw && !target) return null;

  const lft = nameLoc(leftRaw);
  if (!lft.name) return null;
  const tgt = nameLoc(target ? target : rightRaw);
  if (!tgt.name) return null;

  const n1 = gen(lft.name);
  const n2 = gen(tgt.name);
  if (!n1 || !n1.core) return null;
  if (!n2 || !n2.core) return null;
  if (lft.name.split(/\s+/).length > 16 || tgt.name.split(/\s+/).length > 16) return null;
  if (n1.raw.toLowerCase() === n2.raw.toLowerCase()) return null;

  const funds = /Appropriat/i.test(t);
  const other = /for\s+Other\s+Purposes/i.test(t);
  return { kind: 'conv', n1, loc: lft.loc, n2, funds, other };
}

// ── 设立类 ───────────────────────────────────────────────────
function parseNew(t) {
  const rest = cut(t.replace(/^Creating\s+/i, ''), TAIL);
  const nl = nameLoc(rest);
  if (!nl.name) return null;
  const n1 = gen(nl.name);
  if (!n1 || !n1.core) return null;
  if (nl.name.split(/\s+/).length > 14) return null;
  const funds = /Appropriat/i.test(t);
  const other = /for\s+Other\s+Purposes/i.test(t);
  return { kind: 'new', n1, loc: nl.loc, funds, other };
}

function compose(p) {
  const out = {};
  const keys = ['vi', 'th', 'id', 'ms'];
  for (let i = 0; i < 4; i++) {
    const th = i === 1;
    const v = p.kind === 'conv' ? V_CONV[i] : V_NEW[i];
    let s = th ? HEAD[i] + v : HEAD[i] + ' ' + v + ' ';
    s += p.n1[i];
    const lc = L.locText(p.loc, i);
    if (lc) s += AT[i] + lc;
    if (p.kind === 'conv') s += TO[i] + p.n2[i];
    if (p.funds && p.other) s += BOTH[i];
    else if (p.funds) s += FUNDS[i];
    else if (p.other) s += OTHER[i];
    s = th ? L.thFix(s) : s.replace(/\s+/g, ' ').trim();
    out[keys[i]] = s;
  }
  return out;
}

const RESID = /\b(?:the|and|of|in|for|with|by|its|that|which|shall|from|into|as|to|on|under|other|known|shall)\b/i;
const CORE_EN = L.CORE.map(c => c[0]).filter(k => k.length >= 5);
const LEFT = new RegExp('\\b(?:' + CORE_EN.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|') + ')\\b', 'i');

// ── 主流程 ───────────────────────────────────────────────────
const RE = /^An Act\s+(?:to\s+)?(Converting|Creating)\b/i;
const pool = GAP.filter(x => x.country === 'PH' && RE.test((x.title.en || '').trim()));

const items = {};
const skipped = {};
let taken = 0;
for (const x of pool) {
  if (Object.keys(items).length >= LIMIT) break;
  const t = L.ENT((x.title.en || '').replace(/^An Act\s+/i, ''));
  const kind = (t.match(/^(?:to\s+)?(Converting|Creating)\b/i) || [])[1];
  if (!kind) continue;
  if (FAM === 'conv' && !/^convert/i.test(kind)) continue;
  if (FAM === 'new' && !/^creat/i.test(kind)) continue;
  let p = null;
  try { p = /^convert/i.test(kind) ? parseConv(t) : parseNew(t); } catch (e) { p = null; }
  if (!p) { skipped.parse = (skipped.parse || 0) + 1; continue; }
  const c = compose(p);
  let bad = null;
  for (const k of ['vi', 'th', 'id', 'ms']) {
    if (/["\u201c\u201d\u2018\u2019《》]/.test(c[k])) bad = 'quote';
    if (c[k].length < 16 || c[k].length > 320) bad = 'len';
    if (RESID.test(c[k])) bad = 'residue';
    if (LEFT.test(c[k])) bad = 'leftEn';
  }
  if (bad) { skipped[bad] = (skipped[bad] || 0) + 1; continue; }
  if (taken++ < SKIP) continue;
  items[x.id] = c;
}

fs.writeFileSync('batches/' + OUT, JSON.stringify({ batch: OUT.replace(/\.json$/, ''), count: Object.keys(items).length, items }, null, 1), 'utf8');
console.log('pool', pool.length, '→', Object.keys(items).length, JSON.stringify(skipped));
