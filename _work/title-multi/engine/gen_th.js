// 泰国法律标题组装器
// 结构：〈类型词〉〈主题〉พ.ศ.〈佛历年份〉
// 佛历 → 公历：พ.ศ. − 543
// 主题须在术语表中命中，否则整部跳过（不臆造）
// 用法：node gen_th.js [--dry] [--out th-p1-b01] [--diag] [--parse "标题"]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const BAT = path.join(ROOT, '_work', 'title-multi', 'batches');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];

function loadLex() {
  const lex = { types: {}, subjects: {} };
  for (const f of fs.readdirSync(__dirname).filter(x => /^lexicon-th.*\.json$/.test(x)).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    Object.assign(lex.types, j.types || {});
    Object.assign(lex.subjects, j.subjects || {});
  }
  return lex;
}
const LEX = loadLex();

function normKey(s) {
  return String(s)
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'")
    .replace(/\s*,\s*/g, ', ')
    .trim();
}
const SUBJ = {};
for (const [k, v] of Object.entries(LEX.subjects)) SUBJ[normKey(k)] = v;

const TYPES = Object.keys(LEX.types).sort((a, b) => b.length - a.length);

/* 佛历年份 → 公历 */
function beToCe(y) {
  const n = parseInt(y, 10);
  if (!n) return '';
  return String(n - 543);
}

function parseTh(s0) {
  let s = String(s0).normalize('NFC').replace(/\s+/g, ' ').trim();
  /* 泰文数字 → 阿拉伯数字 */
  s = s.replace(/[๐-๙]/g, c => String(c.charCodeAt(0) - 0x0E50));
  /* 末尾状态标记：〈已废止〉〈修正〉，先取出，年份才在句尾 */
  let repealed = false;
  const rm = s.match(/\s*\(\s*ยกเลิก\s*\)\s*$/);
  if (rm) { repealed = true; s = s.slice(0, rm.index).trim(); }
  let type = '';
  for (const T of TYPES) {
    if (s.startsWith(T)) { type = T; s = s.slice(T.length).trim(); break; }
  }
  /* 年份：พ.ศ. 2514 / พระพุทธศักราช 2461 / พุทธศักราช 2477 / B.E. 2514 / 末尾裸 4 位数 */
  let be = '', ce = '';
  const ym = s.match(/\s*(?:พ\.ศ\.|พ\.ศ|พระพุทธศักราช|พุทธศักราช|B\.E\.|BE)?\s*(\d{4})\s*$/);
  if (ym) {
    be = ym[1];
    ce = beToCe(be);
    s = s.slice(0, ym.index).trim();
  }
  /* 没有年份的残留纪年词 */
  s = s.replace(/\s*(?:พระพุทธศักราช|พุทธศักราช)\s*$/, '').trim();
  /* 主题开头的「ว่าด้วย」（关于）、「สำหรับ」（为…而）是引导词，译名不带 */
  let subject = s.replace(/^ว่าด้วย\s*/, '').replace(/^สำหรับ\s*/, '').trim();
  return { type, subject: normKey(subject), be, ce, repealed, rawTh: s0.replace(/[๐-๙]/g, c => String(c.charCodeAt(0) - 0x0E50)).normalize('NFC').replace(/\s+/g, ' ').trim() };
}

function build(p) {
  const t = LEX.types[p.type];
  const subj = SUBJ[p.subject];
  if (!t || !subj) return null;
  const out = {};
  const tags = (p.repealed ? '（已废止）' : '') + (p.ce ? '（佛历' + p.be + '年／公历' + p.ce + '年）' : '');
  out.zh = subj.zh + t.zh + tags;
  out.en = subj.en + ' ' + t.en + (p.be ? ', B.E. ' + p.be + ' (' + p.ce + ')' : '') + (p.repealed ? ' (repealed)' : '');
  out.th = p.rawTh;
  out.vi = t.vi + ' ' + subj.vi + (p.ce ? ' năm ' + p.ce : '') + (p.repealed ? ' (đã bãi bỏ)' : '');
  out.id = t.id + ' ' + subj.id + (p.ce ? ' Tahun ' + p.ce : '') + (p.repealed ? ' (dicabut)' : '');
  out.ms = t.ms + ' ' + subj.ms + (p.ce ? ' ' + p.ce : '') + (p.repealed ? ' (dimansuhkan)' : '');
  return out;
}

if (process.argv.includes('--parse')) {
  const t = process.argv[process.argv.indexOf('--parse') + 1];
  const p = parseTh(t);
  console.log(JSON.stringify({ parsed: p, built: build(p) }, null, 1));
  process.exit(0);
}

const items = {}, skip = { type: [], subject: [], empty: [] };
let total = 0;
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('TH-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const tt = d.title || {};
  if (String(tt.zh || '').trim()) continue;
  total++;
  const raw = String(tt.orig || tt.th || '').trim();
  if (!raw) { skip.empty.push(d.id); continue; }
  const p = parseTh(raw);
  if (!LEX.types[p.type]) { skip.type.push(d.id + ' | ' + raw); continue; }
  if (!SUBJ[p.subject]) { skip.subject.push(p.subject + ' | ' + d.id); continue; }
  const built = build(p);
  if (!built) { skip.subject.push(p.subject + ' | ' + d.id); continue; }
  items[d.id] = built;
}

const outName = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'th-p1-b01') + '.json';
console.log('TH 待补中文标题', total, '→ 可组装', Object.keys(items).length);
console.log('  跳过：类型词未收录', skip.type.length, '| 主题未收录', skip.subject.length, '| 空标题', skip.empty.length);
if (process.argv.includes('--diag')) {
  console.log('\n---- 主题未收录 ----');
  skip.subject.forEach(x => console.log('  ' + x));
  console.log('\n---- 类型词未收录 ----');
  skip.type.forEach(x => console.log('  ' + x));
  process.exit(0);
}
if (!process.argv.includes('--dry')) {
  fs.writeFileSync(path.join(BAT, outName), JSON.stringify({ batch: outName.replace(/\.json$/, ''), scope: 'TH 法律 · 术语表组装', generatedFrom: '_work/title-multi/engine/gen_th.js', items }, null, 1), 'utf8');
  console.log('写出', path.join(BAT, outName));
}
