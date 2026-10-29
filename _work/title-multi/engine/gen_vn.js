// 越南法律标题组装器
// 结构：〈类型〉〈主题〉số〈编号〉；修正型：Luật Sửa đổi, bổ sung một số điều của 〈类型〉〈主题〉
// 主题须在术语表中命中，否则整部跳过（不臆造）
// 用法：node gen_vn.js [--dry] [--out vn-p1-b01] [--diag] [--parse "标题"]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const BAT = path.join(ROOT, '_work', 'title-multi', 'batches');

const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];

/* 术语表：lexicon-vn.json + lexicon-vn-add*.json（后加载覆盖） */
function loadLex() {
  const lex = { types: {}, subjects: {} };
  const files = fs.readdirSync(__dirname).filter(f => /^lexicon-vn.*\.json$/.test(f)).sort();
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    Object.assign(lex.types, j.types || {});
    Object.assign(lex.subjects, j.subjects || {});
  }
  return lex;
}
const LEX = loadLex();

/* 主题归一化：NFC（越南文常被拆成组合字符）、弯撇号、逗号后补空格 */
function normKey(s) {
  return String(s)
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'")
    .replace(/\s*,\s*/g, ', ')
    .trim();
}
const SUBJ = {};
for (const [k, v] of Object.entries(LEX.subjects)) SUBJ[normKey(k).toLowerCase()] = v;

function parseVn(s0) {
  let s = String(s0).normalize('NFC').replace(/\s+/g, ' ').trim();
  let amend = '', amendType = '';
  const am = s.match(/^(Luật|Bộ luật)\s+(Sửa đổi,?\s*bổ sung|Sửa đổi và bổ sung|Sửa đổi)\b/i);
  if (am) {
    amend = 'amend';
    amendType = am[1];
    s = s.slice(am[0].length).trim();
    s = s.replace(/^một số điều của\s+/i, '').replace(/^một số điều\s+/i, '').trim();
  }
  let type = '';
  const tm = s.match(/^(Bộ luật|Luật|Pháp lệnh|Nghị định|Quyết định|Thông tư|Hiến pháp|Lệnh|Nghị quyết|Chỉ thị|Sắc lệnh)\s+/i);
  if (tm) { type = tm[1]; s = s.slice(tm[0].length).trim(); }
  /* 修正对象直接是条文（Điều 73 của …）：类型沿用修正法本身 */
  if (!type && amendType) type = amendType;
  let no = '', subject = s;
  const nm = s.match(/\s*số\s+(?:Số hiệu:\s*)?(.+)$/i);
  if (nm) { subject = s.slice(0, nm.index).trim(); no = nm[1].trim(); }
  if (!no || /^Không số$/i.test(no)) no = '';
  /* 编号里常见的重复与前后缀噪声 */
  no = no.replace(/^Số hiệu:\s*/i, '').replace(/\.$/, '').trim();
  if (/^Không số$/i.test(no)) no = '';
  /* 主题末尾的游离年份（如「khám bệnh, chữa bệnh 2023」）不属主题本体 */
  subject = subject.replace(/[\s,.]+\b(19|20)\d{2}$/, '').replace(/[.\s]+$/, '').trim();
  return { type, subject: normKey(subject), no, amend };
}

function typeEntry(t) {
  const key = normKey(t).toLowerCase();
  for (const [k, v] of Object.entries(LEX.types)) {
    if (k.toLowerCase() === key) return v;
  }
  return null;
}

function build(p) {
  const t = typeEntry(p.type);
  const subj = SUBJ[p.subject.toLowerCase()];
  if (!t || !subj) return null;
  const out = {};
  const amendZh = p.amend ? '修正案' : '';
  const amendEn = p.amend ? ' amending and supplementing a number of articles of the' : '';
  /* zh：〈主题〉〈类型名〉；主题译名已含「法」时不再叠加 */
  const zhBase = /法$|法典$|条例$/.test(subj.zh) ? subj.zh : subj.zh + t.zh;
  out.zh = zhBase + amendZh;
  /* en */
  const enBase = p.amend
    ? t.en + (p.no ? ' No. ' + p.no : '') + amendEn + ' ' + t.en + ' on ' + subj.en
    : t.en + (p.no ? ' No. ' + p.no : '') + ' on ' + subj.en;
  out.en = enBase;
  /* vi：原文（保留编号写法） */
  out.vi = (p.amend ? t.vi + ' sửa đổi, bổ sung một số điều của ' : '') +
    t.vi + ' ' + p.subject + (p.no ? ' số ' + p.no : '');
  /* th */
  out.th = p.amend
    ? t.th + 'แก้ไขเพิ่มเติม' + subj.th + (p.no ? ' เลขที่ ' + p.no : '')
    : t.th + subj.th + (p.no ? ' เลขที่ ' + p.no : '');
  /* id */
  out.id = p.amend
    ? t.id + ' Perubahan atas ' + t.id + ' ' + subj.id + (p.no ? ' No. ' + p.no : '')
    : t.id + ' ' + subj.id + (p.no ? ' No. ' + p.no : '');
  /* ms */
  out.ms = p.amend
    ? t.ms + ' ' + subj.ms + ' (Pindaan)' + (p.no ? ' No. ' + p.no : '')
    : t.ms + ' ' + subj.ms + (p.no ? ' No. ' + p.no : '');
  return out;
}

/* 调试：node gen_vn.js --parse "标题" */
if (process.argv.includes('--parse')) {
  const t = process.argv[process.argv.indexOf('--parse') + 1];
  const p = parseVn(t);
  console.log(JSON.stringify({ parsed: p, built: build(p) }, null, 1));
  process.exit(0);
}

const items = {}, skip = { type: [], subject: [], empty: [] };
let total = 0;
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('VN-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const tt = d.title || {};
  if (String(tt.zh || '').trim()) continue;
  total++;
  const raw = String(tt.orig || tt.vi || '').trim();
  if (!raw) { skip.empty.push(d.id); continue; }
  const p = parseVn(raw);
  if (!typeEntry(p.type)) { skip.type.push(d.id + ' | ' + raw); continue; }
  if (!SUBJ[p.subject.toLowerCase()]) { skip.subject.push(p.subject + ' | ' + d.id); continue; }
  const built = build(p);
  if (!built) { skip.subject.push(p.subject + ' | ' + d.id); continue; }
  for (const L of LANGS) if (!String(built[L] || '').trim()) { skip.subject.push('空白' + L + ' | ' + d.id); }
  items[d.id] = built;
}

const outName = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'vn-p1-b01') + '.json';
const doc = {
  batch: outName.replace(/\.json$/, ''),
  scope: 'VN 法律（Luật/Bộ luật）· 术语表组装 · 主题 ' + Object.keys(SUBJ).length + ' 条',
  generatedFrom: '_work/title-multi/engine/gen_vn.js',
  items
};

console.log('VN 待补中文标题', total, '→ 可组装', Object.keys(items).length);
console.log('  跳过：类型词未收录', skip.type.length, '| 主题未收录', skip.subject.length, '| 空标题', skip.empty.length);
const sc = {};
for (const x of skip.subject) { const k = x.split('|')[0].trim(); sc[k] = (sc[k] || 0) + 1; }
if (process.argv.includes('--diag')) {
  console.log('\n---- 未收录主题 ----');
  Object.keys(sc).sort((a, b) => sc[b] - sc[a]).forEach(k => console.log('  ' + sc[k] + '  ' + k));
  console.log('\n---- 类型词未收录 ----');
  skip.type.forEach(x => console.log('  ' + x));
  process.exit(0);
}
if (!process.argv.includes('--dry')) {
  fs.writeFileSync(path.join(BAT, outName), JSON.stringify(doc, null, 1), 'utf8');
  console.log('写出', path.join(BAT, outName), '·', Object.keys(items).length, '条');
}
