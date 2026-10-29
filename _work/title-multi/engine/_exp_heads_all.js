// 导出全部未收录主体（含 ready=0 的），供批量补译
// 用法：node _exp_heads_all.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');

function loadLex() {
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'lexicon-my.json'), 'utf8'));
  const lex = { types: Object.assign({}, base.types), heads: Object.assign({}, base.heads), brackets: Object.assign({}, base.brackets) };
  const adds = fs.readdirSync(__dirname).filter(f => /^lexicon-my-add.*\.json$/.test(f)).sort();
  for (const f of adds) {
    const j = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    Object.assign(lex.types, j.types || {});
    Object.assign(lex.heads, j.heads || {});
    Object.assign(lex.brackets, j.brackets || {});
  }
  return lex;
}
const LEX = loadLex();
const TYPES = Object.keys(LEX.types).sort((a, b) => b.length - a.length);
const NUM_RE = /^N[O0]\.?\s*(\d+)$/;

function norm(s) {
  return String(s)
    .replace(/&#8722;|&minus;/gi, '-')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function parse(raw) {
  let s = String(raw).replace(/\s+/g, ' ').trim();
  let year = '', extra = [], type = '';
  const brs = [];
  for (let pass = 0; pass < 2; pass++) {
    if (!year) {
      const ym = s.match(/\b(19|20)\d{2}\s*(\(\s*AMENDMENT\s*\))?\s*$/i);
      if (ym) {
        year = ym[0].match(/\b(19|20)\d{2}/)[0];
        if (/AMENDMENT/i.test(ym[0])) extra.push('AMENDMENT');
        s = s.slice(0, ym.index).trim();
      }
    }
    if (!type) {
      for (const T of TYPES) {
        const re = new RegExp('\\s' + T.replace(/[-.]/g, '\\$&') + '\\s*$', 'i');
        if (re.test(s)) { type = T; s = s.replace(re, '').trim(); break; }
      }
    }
    while (/\([^()]*\)\s*$/.test(s)) {
      const m = s.match(/\(([^()]*)\)\s*$/);
      brs.unshift(norm(m[1]));
      s = s.replace(/\s*\([^()]*\)\s*$/, '').trim();
    }
  }
  return { head: norm(s), brs: brs.concat(extra), type, year };
}

const map = new Map();
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('MY-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const tt = d.title || {};
  if (String(tt.zh || '').trim()) continue;
  const raw = String(tt.en || tt.orig || '').trim();
  if (!raw) continue;
  const p = parse(raw);
  if (LEX.heads[p.head]) continue;
  if (!p.type) continue;
  const missBr = p.brs.filter(b => !NUM_RE.test(b) && !LEX.brackets[b]).length;
  const cur = map.get(p.head) || { head: p.head, laws: 0, ready: 0, miss: 0 };
  cur.laws++;
  if (missBr === 0) cur.ready++; else cur.miss += missBr;
  map.set(p.head, cur);
}
const rows = [...map.values()].sort((a, b) => b.ready - a.ready || b.laws - a.laws);
fs.writeFileSync(path.join(__dirname, '_need_heads_all.json'), JSON.stringify(rows, null, 1));
console.log('未收录主体', rows.length, '覆盖法规', rows.reduce((s, x) => s + x.laws, 0));
console.log('ready>0', rows.filter(x => x.ready > 0).length, '合计可出', rows.reduce((s, x) => s + x.ready, 0));
rows.forEach((x, i) => console.log(String(i + 1).padStart(3) + ' r' + x.ready + '/' + x.laws + ' m' + x.miss + '  ' + x.head));
