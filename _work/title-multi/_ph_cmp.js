'use strict';
// 本次会话归因：基线引擎 vs 当前引擎，逐条比对产出差异，并按三项质检判优劣。
// 用法：node _work/title-multi/_ph_cmp.js [--show N] [--src _ph_rest.json]
const fs = require('fs');
const path = require('path');
const Q = require('./_ph_qchk.js');
const NOW = require('./_ph_gen2.js');
const BASE = require('./_ph_gen2_base.js');
const { nom } = require('./_ph_nom.js');
const FR = require('./_ph_fr.js');
const LANGS = ['vi', 'th', 'id', 'ms'];
const ROOT = path.resolve(__dirname, '..', '..');
const DATADIR = path.join(ROOT, 'prototype', 'data', 'laws');

function mk(G) {
  return function solve(en) {
    const p = G.parse(en);
    if (p && p.out) return { out: p.out, frame: p.frame, via: 'gen2' };
    const c = nom(en);
    if (c) { const p2 = G.parse(c); if (p2 && p2.out) return { out: p2.out, frame: p2.frame, via: 'nom' }; }
    const r = FR.parse(en);
    if (r && r.out) return { out: r.out, frame: r.frame, via: 'fr' };
    return null;
  };
}
const solveNow = mk(NOW), solveBase = mk(BASE);
const badOf = (t, en) => {
  for (const L of LANGS) {
    const s = t[L];
    if (!s) return L + ':empty';
    const w = Q.crossScript(L, s) || Q.residue(L, s, []) || Q.pseudo(L, s, [], en) || Q.typo(s);
    if (w) return L + ':' + w;
  }
  return null;
};

function main() {
  const argv = process.argv.slice(2);
  const si = argv.indexOf('--src');
  const srcRel = si >= 0 ? argv[si + 1] : null;
  let list;
  if (srcRel) list = JSON.parse(fs.readFileSync(path.join(ROOT, srcRel), 'utf8'));
  else {
    list = [];
    for (const f of fs.readdirSync(DATADIR)) {
      if (!f.startsWith('PH-')) continue;
      let j; try { j = JSON.parse(fs.readFileSync(path.join(DATADIR, f), 'utf8')); } catch (e) { continue; }
      if (!j.title || !j.title.en) continue;
      list.push({ id: j.id, title: j.title });
    }
  }
  let same = 0, onlyNow = 0, onlyBase = 0, diffStr = 0;
  let worse = 0, better = 0, even = 0;
  const rowsW = [], rowsB = [];
  for (const x of list) {
    const en = String(x.title.en || '').replace(/\s+/g, ' ').trim();
    if (!en) continue;
    const a = solveNow(en), b = solveBase(en);
    if (!a && !b) { same++; continue; }
    if (a && !b) { onlyNow++; continue; }
    if (!a && b) { onlyBase++; rowsB.push({ id: x.id, en: en, base: b.out }); continue; }
    let sameStr = true;
    for (const L of LANGS) if (a.out[L] !== b.out[L]) sameStr = false;
    if (sameStr) { same++; continue; }
    diffStr++;
    const ba = badOf(a.out, en), bb = badOf(b.out, en);
    if (ba && !bb) { worse++; rowsW.push({ id: x.id, en: en, why: ba, base: b.out, now: a.out }); }
    else if (!ba && bb) { better++; rowsB.push({ id: x.id, en: en, why: bb, base: b.out, now: a.out }); }
    else even++;
  }
  console.log('比对 ' + list.length + ' 条');
  console.log('  产出一致 ' + same + ' | 仅当前能出 ' + onlyNow + ' | 仅基线能出 ' + onlyBase + ' | 两者都出但串不同 ' + diffStr);
  console.log('  其中：当前更差 ' + worse + ' | 当前更好 ' + better + ' | 都不合格/都合格 ' + even);
  const sn = Number(argv[argv.indexOf('--show') + 1]) || 0;
  if (sn) rowsW.slice(0, sn).forEach((r) => {
    console.log('\n· ' + r.id + ' ' + r.why);
    console.log('  EN  ' + r.en.slice(0, 150));
    console.log('  基线 ' + r.base.vi);
    console.log('  当前 ' + r.now.vi);
  });
  const oi = argv.indexOf('--out');
  if (oi >= 0) fs.writeFileSync(path.join(ROOT, argv[oi + 1]), JSON.stringify(rowsW, null, 1), 'utf8');
}
main();
