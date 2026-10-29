// PH 改名类（An Act Changing the Name of X to Y / Renaming X into Y）标题合成器
const fs = require('fs');
const L = require('./_ph_lex.js');
const GAP = require('./_gap.json').gaps;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const LIMIT = parseInt(arg('limit', '300'), 10);
const SKIP = parseInt(arg('skip', '0'), 10);
const OUT = arg('out', 'rename.json');

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const V = [
  ['đổi tên', 'เปลี่ยนชื่อ', 'Mengubah Nama', 'Menukar Nama'],
];
// 「把 X 改为 Y」的连接词：vi 用「thành」，泰文「เป็น」，印尼/马来「menjadi / kepada」
const TO = [' thành ', 'เป็น', ' menjadi ', ' kepada '];
const AT = [' tại ', 'ใน', ' di ', ' di '];
const TH_CHANGE = 'เปลี่ยนชื่อ';

// 切掉名称后面的附句
const TAIL = /\s*,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Integrating|Amending|Providing|Repealing|Converting|Authorizing|Mandating|for\s+Other\s+Purposes|Therefor)\b[\s\S]*$/i;

// 相对从句出现说明这条不是简单的 A→B，直接放弃
const REL = /\b(?:Which|That|Where|Connecting|Traversing|Leads|Extending|Beginning|Starting)\b/i;

function cleanName(x) {
  let s = L.ENT(x).replace(/\s+/g, ' ').trim();
  s = s.replace(/^the\s+/i, '').replace(/[,;:\s]+$/, '');
  s = s.replace(/\s*\([A-Z]{2,8}\)\s*/g, ' ');          // 去 (PPSC-RTS 7) 之类缩写
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// 在 old 段里切出「名称 + 地点」：取最后一个能解析成地名的「 in 」
function splitLoc(seg) {
  const out = [];
  const re = /\s+(?:in|at)\s+(?:the\s+)?/gi;
  let m;
  while ((m = re.exec(seg))) out.push(m.index);
  for (let k = out.length - 1; k >= 0; k--) {
    const name = seg.slice(0, out[k]).trim();
    const locRaw = seg.slice(out[k]).replace(/^\s+(?:in|at)\s+(?:the\s+)?/i, '').trim();
    if (!name) continue;
    let loc = L.parseLoc(locRaw) || [];
    // 首段没有类型词（裸地名）时无法判定层级，丢掉，免得把市说成省
    if (loc.length > 1 && loc[0].inferred) loc = loc.slice(1);
    if (loc.length) return { name, loc, locRaw };
  }
  return { name: seg.trim(), loc: [], locRaw: '' };
}

function parse(title) {
  let t = L.ENT(title).replace(/\s+/g, ' ').trim();
  if (!/^An Act\b/i.test(t)) return null;
  t = t.replace(/^An Act\s+/i, '');
  const vm = t.match(/^(?:to\s+)?(?:Chang(?:e|ing)\s+the\s+Name\s+of|Renam(?:e|ing))\s+/i);
  if (!vm) return null;
  let rest = t.slice(vm[0].length).trim();
  // 复数、无新名的（Changing the Names of Certain Barrios ...）不收
  if (/^Names\b/i.test(rest)) return null;
  if (REL.test(rest.split(/\s+(?:to|into|as)\s+/i)[0] || '')) return null;

  // from A to B：A 是现名，B 是新名
  let oldPart, newPart;
  const fw = rest.match(/^([\s\S]+?)\s*,?\s+from\s+([\s\S]+?)\s+to\s+([\s\S]+)$/i);
  if (fw) {
    oldPart = fw[2].trim();
    newPart = fw[3].trim();
  } else {
    const m = rest.match(/^([\s\S]+?)\s*,?\s+(?:to|into|as)\s+(?:the\s+)?([\s\S]+)$/i);
    if (!m) return null;
    oldPart = m[1].trim();
    newPart = m[2].trim();
  }
  // 「… to Be Known as X」里的 X 才是正式新名
  const kb = newPart.match(/(?:to\s+be\s+known|to\s+Be\s+Known|to\s+be\s+renamed)\s+as\s+(?:the\s+)?([\s\S]+)$/i);
  if (kb) newPart = kb[1];
  newPart = newPart.replace(TAIL, '').replace(/[,;:\s]+$/, '').trim();
  if (!newPart || newPart.length < 3) return null;

  const sp = splitLoc(oldPart);
  const oldN = L.trGenus(sp.name);
  const newN = L.trGenus(newPart);
  if (!oldN || !oldN.core) return null;
  if (!newN || (!newN.core && newPart.split(/\s+/).length > 6)) return null;
  if (!sp.name || sp.name.split(/\s+/).length > 12) return null;

  return { oldN, newN, loc: sp.loc, other: /and\s+for\s+Other\s+Purposes/i.test(t) };
}

function compose(p) {
  const out = {};
  const keys = ['vi', 'th', 'id', 'ms'];
  const loc = L.locText(p.loc, -1);
  for (let i = 0; i < 4; i++) {
    const th = i === 1;
    let s = th ? HEAD[i] + TH_CHANGE : HEAD[i] + ' ' + V[0][i] + ' ';
    s += p.oldN[i];
    const lc = L.locText(p.loc, i);
    if (lc) s += AT[i] + lc;
    s += TO[i] + p.newN[i];
    if (p.other) s += [', và cho các mục đích khác', ' และเพื่อวัตถุประสงค์อื่น', ', dan untuk tujuan lain', ', dan untuk tujuan lain'][i];
    out[keys[i]] = th ? L.thFix(s) : s.replace(/\s+/g, ' ').trim();
  }
  return out;
}

// ── 选取 ──────────────────────────────────────────────────────
const RE = /^An Act\s+(?:to\s+)?(?:Chang(?:e|ing)\s+the\s+Name|Renam)/i;
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
    if (c[k].length < 10 || c[k].length > 240) bad = 'len';
    if (/\b(?:the|and|of|in|for|with|by)\b/.test(c[k])) bad = 'residue';
  }
  if (bad) { skipped[bad] = (skipped[bad] || 0) + 1; continue; }
  if (taken++ < SKIP) continue;
  items[x.id] = c;
}

fs.writeFileSync('batches/' + OUT, JSON.stringify({ batch: OUT.replace(/\.json$/, ''), count: Object.keys(items).length, items }, null, 1), 'utf8');
console.log('pool', pool.length, '→', Object.keys(items).length, JSON.stringify(skipped));
