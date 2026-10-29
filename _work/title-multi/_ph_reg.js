'use strict';
// 回归：把已入库的 PH 译文用当前引擎重跑，与库内值比对。
// 用法：node _work/title-multi/_ph_reg.js [--show N] [--out <文件>]
const fs = require('fs');
const path = require('path');
const G = require('./_ph_gen2.js');
const { nom } = require('./_ph_nom.js');
const FR = require('./_ph_fr.js');
const LANGS = ['vi', 'th', 'id', 'ms'];
const ROOT = path.resolve(__dirname, '..', '..');
const DATADIR = path.join(ROOT, 'prototype', 'data', 'laws');

function solve(en) {
  const p = G.parse(en);
  if (p && p.out) return { out: p.out, frame: p.frame, via: 'gen2' };
  const c = nom(en);
  if (c) { const p2 = G.parse(c); if (p2 && p2.out) return { out: p2.out, frame: p2.frame, via: 'nom' }; }
  const r = FR.parse(en);
  if (r && r.out) return { out: r.out, frame: r.frame, via: 'fr' };
  return null;
}

function main() {
  const argv = process.argv.slice(2);
  // 批次模式：重跑历史批次，检查已交付译文是否被当前改动改变
  const bm = argv.indexOf('--batches');
  if (bm >= 0) {
    const dir = path.join(__dirname, 'batches');
    let tot = 0, same = 0, diff = 0, gone = 0;
    const rows = [];
    for (const f of fs.readdirSync(dir)) {
      if (!/^ph-.*\.json$/.test(f) || /\.badids/.test(f)) continue;
      let j;
      try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
      const items = j.items || {};
      let fDiff = 0;
      for (const id of Object.keys(items)) {
        const law = path.join(DATADIR, id + '.json');
        if (!fs.existsSync(law)) continue;
        let L2;
        try { L2 = JSON.parse(fs.readFileSync(law, 'utf8')); } catch (e) { continue; }
        const en = ((L2.title || {}).en || (L2.title || {}).orig || '').replace(/\s+/g, ' ').trim();
        tot++;
        const r = solve(en);
        if (!r) { gone++; continue; }
        let bad = false;
        for (const Lan of LANGS) {
          if (items[id][Lan] !== r.out[Lan]) { rows.push({ batch: f, id: id, L: Lan, en: en, old: items[id][Lan], neu: r.out[Lan] }); bad = true; }
        }
        if (bad) { diff++; fDiff++; } else same++;
      }
      console.log('  ' + f.padEnd(26) + Object.keys(items).length + ' 条，其中变化 ' + fDiff);
    }
    console.log('批次回归：条目 ' + tot + ' | 完全一致 ' + same + ' | 变化 ' + diff + ' | 现在解析不出 ' + gone);
    const oi2 = argv.indexOf('--out');
    if (oi2 >= 0) fs.writeFileSync(path.join(ROOT, argv[oi2 + 1]), JSON.stringify(rows, null, 1), 'utf8');
    const sn = Number(argv[argv.indexOf('--show') + 1]) || 0;
    if (sn) rows.slice(0, sn).forEach((r) => {
      console.log('\n· ' + r.batch + ' ' + r.id + ' [' + r.L + '] ' + r.en.slice(0, 140));
      console.log('  旧 ' + r.old);
      console.log('  新 ' + r.neu);
    });
    return;
  }
  const showIdx = argv.indexOf('--show');
  const showN = showIdx >= 0 ? Number(argv[showIdx + 1]) : 0;
  let tot = 0, same = 0, diff = 0, nou = 0, nowHave = 0;
  const rows = [];
  for (const f of fs.readdirSync(DATADIR)) {
    if (!f.startsWith('PH-')) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(DATADIR, f), 'utf8')); } catch (e) { continue; }
    const t = j.title || {};
    if (!t.vi && !t.th && !t.id && !t.ms) continue;
    const en = (t.en || t.orig || '').replace(/\s+/g, ' ').trim();
    if (!en) continue;
    tot++;
    const r = solve(en);
    if (!r) { nou++; continue; }
    nowHave++;
    let bad = false;
    for (const L of LANGS) {
      if (!t[L]) continue;
      if (t[L] !== r.out[L]) { bad = true; rows.push({ id: j.id, L: L, en: en, old: t[L], neu: r.out[L] }); }
    }
    if (bad) diff++; else same++;
  }
  console.log('已入库可比对', tot, '| 当前引擎能解析', nowHave, '| 完全一致', same, '| 存在差异', diff, '| 引擎解析不出', nou);
  const byLang = {};
  for (const r of rows) byLang[r.L] = (byLang[r.L] || 0) + 1;
  console.log('差异按语种', JSON.stringify(byLang));
  if (showN) rows.slice(0, showN).forEach((r) => {
    console.log('\n· ' + r.id + ' [' + r.L + '] ' + r.en.slice(0, 150));
    console.log('  旧 ' + r.old);
    console.log('  新 ' + r.neu);
  });
  const oi = argv.indexOf('--out');
  if (oi >= 0) {
    fs.writeFileSync(path.join(ROOT, argv[oi + 1]), JSON.stringify(rows, null, 1), 'utf8');
    console.log('差异清单 → ' + argv[oi + 1]);
  }
}
main();
