/* ==========================================================================
   _ph_mt_pack.js —— 把机翻结果 _ph_mt_out.jsonl 打成可入库的批次 JSON
   
   用法：
     node _ph_mt_pack.js                    打包全部未入库的
     node _ph_mt_pack.js --n 300            只打 300 条（按文件顺序）
     node _ph_mt_pack.js --out _ph_mt_b01   指定输出名
   
   只写 zh/vi/th/id/ms 五键，en 与 orig 不动（PH 的 en 是数据源，不得改）。
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWDIR = path.join(ROOT, 'prototype/data/laws');
const SRC = path.join(__dirname, '_ph_mt_out.jsonl');

const args = process.argv.slice(2);
const ni = args.indexOf('--n');
const N = ni >= 0 ? +args[ni + 1] : 0;
const oi = args.indexOf('--out');
const NAME = oi >= 0 ? args[oi + 1] : '_ph_mt_pack';

const need = (d) => ['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim());

/* --------------------------------------------------------------------------
   后处理：区划通名的英文残留
   模型即使被明确要求，仍有约 12% 的 id/ms 把 Municipality / Province / City
   原样留下（尤其是「Municipality of Balbalan」这种专名结构）。逐个退回重译
   不划算，改用规则替换——通名有固定对应词，替换不会产生歧义。
   -------------------------------------------------------------------------- */
const PROPER_HEAD = [
  // 先护住本身就叫 Mountain Province 的省名
  [/\bMountain Province\b/g, { id: 'Provinsi Mountain', ms: 'Wilayah Mountain' }],
  [/\bMountain Province\b/g, { vi: 'Tỉnh Mountain', th: 'จังหวัดเมาน์เทน' }],
];
const FIX = {
  id: [
    [/\bMunicipality of\b/g, 'Kotamadya'],
    [/\bCity of\b/g, 'Kota'],
    [/\bProvince of\b/g, 'Provinsi'],
    [/\bMunicipality\b/g, 'Kotamadya'],
    [/\bProvince\b/g, 'Provinsi'],
    [/\bCity\b/g, 'Kota'],
  ],
  ms: [
    [/\bMunicipality of\b/g, 'Perbandaran'],
    [/\bCity of\b/g, 'Bandar'],
    [/\bProvince of\b/g, 'Wilayah'],
    [/\bMunicipality\b/g, 'Perbandaran'],
    [/\bProvince\b/g, 'Wilayah'],
    [/\bCity\b/g, 'Bandar'],
  ],
};
function postfix(lang, s) {
  let out = String(s || '');
  for (const [re, rep] of PROPER_HEAD) if (rep[lang]) out = out.replace(re, rep[lang]);
  for (const [re, rep] of (FIX[lang] || [])) out = out.replace(re, rep);
  return out.replace(/\s+/g, ' ').trim();
}

const items = {};
let n = 0, skipDone = 0, skipGone = 0;
const seen = new Set();

if (!fs.existsSync(SRC)) { console.error('未找到', SRC); process.exit(1); }
for (const line of fs.readFileSync(SRC, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  let o;
  try { o = JSON.parse(line); } catch (e) { continue; }
  if (!o.key || !o.zh || !o.vi || !o.th || !o.id || !o.ms) continue;
  if (seen.has(o.key)) continue;
  seen.add(o.key);
  const f = path.join(LAWDIR, o.key + '.json');
  if (!fs.existsSync(f)) { skipGone++; continue; }
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!need(d)) { skipDone++; continue; } // 已经有译名了，不覆盖
  items[o.key] = {
    zh: String(o.zh).trim(),
    vi: postfix('vi', o.vi),
    th: postfix('th', o.th),
    id: postfix('id', o.id),
    ms: postfix('ms', o.ms),
  };
  n++;
  if (N && n >= N) break;
}

const out = path.join(__dirname, NAME + '.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'ph-mt-' + NAME.replace(/^_ph_mt_/, ''), items }, null, 0), 'utf8');
console.log(`打包 ${n} 条 → ${path.basename(out)}（已有译名跳过 ${skipDone}，文件缺失 ${skipGone}）`);
