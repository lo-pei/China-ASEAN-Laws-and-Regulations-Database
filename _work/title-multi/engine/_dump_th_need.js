/* 导出 TH 未收录主题（与 gen_th.js 同一份解析规则） */
const fs = require('fs'), path = require('path');
const ENG = __dirname;
const ROOT = path.resolve(ENG, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');

const lex = { types: {}, subjects: {} };
for (const f of fs.readdirSync(ENG).filter(x => /^lexicon-th.*\.json$/.test(x)).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(ENG, f), 'utf8'));
  Object.assign(lex.types, j.types || {});
  Object.assign(lex.subjects, j.subjects || {});
}
const TYPES = Object.keys(lex.types).sort((a, b) => b.length - a.length);
function normKey(s) {
  return String(s).normalize('NFC').replace(/\s+/g, ' ').replace(/[’‘]/g, "'").replace(/\s*,\s*/g, ', ').trim();
}
const SUBJ = {};
for (const [k, v] of Object.entries(lex.subjects)) SUBJ[normKey(k)] = v;

const out = [];
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('TH-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const t = d.title || {};
  if (String(t.zh || '').trim()) continue;
  const raw = String(t.orig || t.th || '').trim();
  if (!raw) continue;
  let s = raw.normalize('NFC').replace(/\s+/g, ' ').trim().replace(/[๐-๙]/g, c => String(c.charCodeAt(0) - 0x0E50));
  s = s.replace(/\s*\(\s*ยกเลิก\s*\)\s*$/, '').trim();
  for (const T of TYPES) { if (s.startsWith(T)) { s = s.slice(T.length).trim(); break; } }
  const ym = s.match(/\s*(?:พ\.ศ\.|พ\.ศ|พระพุทธศักราช|พุทธศักราช|B\.E\.|BE)?\s*(\d{4})\s*$/);
  if (ym) s = s.slice(0, ym.index).trim();
  s = s.replace(/\s*(?:พระพุทธศักราช|พุทธศักราช)\s*$/, '').trim();
  s = s.replace(/^ว่าด้วย\s*/, '').replace(/^สำหรับ\s*/, '').trim();
  const k = normKey(s);
  if (SUBJ[k]) continue;
  out.push({ id: d.id, subj: k, raw });
}
fs.writeFileSync(path.join(ENG, '_th_need.json'), JSON.stringify(out, null, 1), 'utf8');
console.log('未收录主题', out.length);
out.forEach((x, i) => console.log(String(i + 1).padStart(3), x.id, '|', x.subj));
