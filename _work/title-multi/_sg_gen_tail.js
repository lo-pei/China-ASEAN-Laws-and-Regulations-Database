// SG 尾段组合引擎：体裁 + 母法 + 括注 + 年份，四语同构
// 用法：node _sg_gen_tail.js --out batches/sg-p1-b10.json [--only RULE] [--show]
'use strict';
const fs = require('fs');
const path = require('path');

const P0 = require('./_sg_parents.json');
const DICT = require('./_sg_dict.js');
const P = Object.assign({}, P0, DICT.parentExtra || {});
const { groups } = require('./_sg_tail.json');

// 已四语齐备的条目跳过（_sg_tail.json 是快照，写库后需按现状过滤）
const DOCS = path.join(__dirname, '../../prototype/data/laws');
const done = new Set();
for (const f of fs.readdirSync(DOCS).filter(f => f.startsWith('SG-') && f.endsWith('.json'))) {
  const t = JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8')).title || {};
  if (t.vi && t.th && t.id && t.ms) done.add(f.replace('.json', ''));
}

const LANGS = ['vi', 'th', 'id', 'ms'];

// 个别条目结构异常（母法名以破折号收尾、括注与母法语义重复），逐条改写
const OVERRIDE = {
  // Darjah Utama Bakti Cemerlang (Tentera) — (The Distinguished Service Order — Military) Rules 1981
  // 中文层作「卓越服务勋章（军事）规则 1981」，四语同一句式，不重复勋章名
  'SG-H1079': {
    vi: 'Quy tắc Huân chương Phục vụ Xuất sắc (Quân sự) 1981',
    th: 'กฎเครื่องราชอิสริยาภรณ์บริการดีเด่น (ฝ่ายทหาร) 1981',
    id: 'Peraturan Tanda Jasa Pelayanan Istimewa (Militer) 1981',
    ms: 'Kaedah Darjah Perkhidmatan Cemerlang (Tentera) 1981',
  },
};

// 体裁词：全部取自库内既有四语记录，不新造
const G = {
  Act: ['Luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'],
  Regulations: ['Quy chế', 'ข้อบังคับ', 'Peraturan', 'Peraturan'],
  Rules: ['Quy tắc', 'กฎ', 'Peraturan', 'Kaedah'],
  Order: ['Lệnh', 'คำสั่ง', 'Perintah', 'Perintah'],
  Orders: ['Lệnh', 'คำสั่ง', 'Perintah', 'Perintah'],
  Notification: ['Thông báo', 'ประกาศ', 'Pemberitahuan', 'Pemberitahuan'],
  'By-laws': ['Điều lệ', 'ข้อกำหนด', 'Peraturan Kecil', 'Undang-Undang Kecil'],
  Scheme: ['Chương trình', 'โครงการ', 'Skema', 'Skim'],
  Direction: ['Chỉ thị', 'คำแนะนำ', 'Arahan', 'Arahan'],
  Directions: ['Chỉ thị', 'คำแนะนำ', 'Arahan', 'Arahan'],
};

function thGlue(s) {
  return s
    .replace(/([A-Za-z0-9])[\u0E00-\u0E7F]/g, '$1 $2')
    .replace(/([\u0E00-\u0E7F])([A-Za-z0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

// mods4：数组，每项是 {vi,th,id,ms}，对应一个括号
function compose(genre, parentEn, mods4, year) {
  const g = G[genre];
  const par = P[parentEn];
  if (!g || !par) return null;
  const out = {};
  for (const [i, L] of LANGS.entries()) {
    let s;
    if (L === 'th') {
      s = g[1] + par.th;
      if (mods4.length) s += ' (' + mods4.map(m => m.th).join(') (') + ')';
      if (year) s += ' ' + year;
      s = thGlue(s);
    } else {
      s = g[i];
      if (genre === 'Act' && L === 'id') s += ' tentang';
      s += ' ' + par[L];
      if (mods4.length) s += ' (' + mods4.map(m => m[L]).join(') (') + ')';
      if (year) s += ' ' + year;
      s = s.replace(/\s+/g, ' ').trim();
    }
    out[L] = s;
  }
  return out;
}

// ── 模板族 ──────────────────────────────────────────────
const EX = ['Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian'];
const RM = ['Giảm thuế', 'การลดหย่อนภาษี', 'Keringanan Pajak', 'Pelepasan Cukai'];
const SECW = [' theo Điều ', 'ตามมาตรา ', ' menurut Pasal ', ' menurut Seksyen '];

// 公司名 / 机构名原样保留（与 zh 层保留拉丁名的做法一致），只译条文号豁免部分
const RULES = [
  {
    name: 'CO-SEC',
    re: /^(.+?)\s+[—–]\s+Section\s+(\d+[A-Z]?(?:\([0-9A-Za-z]+\))*)\s+(Exemption|Remission)$/i,
    build(m) {
      const name = m[1].trim();
      // 名称里出现英文虚词 = 描述性短语而非专名，不套模板（留给逐条翻译）
      if (/(?<![A-Za-z\u00C0-\u024F])(?:of|for|from|to|in|on|under|and|the)(?![A-Za-z\u00C0-\u024F])/i.test(name)) return null;
      const sec = m[2];
      const tail = /Remission/i.test(m[3]) ? RM : EX;
      const o = {};
      LANGS.forEach((L, i) => { o[L] = name + ' — ' + tail[i] + SECW[i] + sec; });
      return [o];
    },
  },
];

// 词典：DICT.mod[key] = {vi,th,id,ms} 或 [{...},{...}]
// 多层括号优先查合并键（合并译法可能与逐层拼接不同），查不到再逐层各自查词后并联，
// 这样「Relief from Income Tax / Assignment … / No. 2」这类组合不必穷举合并键。
function fromDict(mods) {
  // 括注常直接复用母法名（Fees (Estate Duty) 之类），故母法词典也作为兜底
  const look = (k) => DICT.mod[k] || DICT.parentExtra[k];
  const d = DICT.mod[mods.join(' / ')];
  if (d) return Array.isArray(d) ? d : [d];
  if (mods.length > 1) {
    const parts = mods.map(look);
    if (parts.every((x) => x && !Array.isArray(x))) return parts;
  }
  const solo = look(mods[0]);
  return mods.length === 1 && solo && !Array.isArray(solo) ? [solo] : null;
}

// ── 质量闸（与 _sg_gen_admin.js 共用同一份，避免 EN_OK 漂移）──────
const { gate } = require('./_sg_gate.js');

function main() {
  const argv = process.argv.slice(2);
  const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
  const out = arg('--out');
  const only = arg('--only');
  const show = argv.includes('--show');

  const items = {};
  const stat = {};
  const bump = (k) => { stat[k] = (stat[k] || 0) + 1; };

  for (const [parent, arr] of Object.entries(groups)) {
    for (const x of arr) {
      if (items[x.id] || done.has(x.id)) continue;
      if (OVERRIDE[x.id]) {
        const o = OVERRIDE[x.id];
        const bad0 = gate(o);
        if (bad0) bump('gate:' + bad0); else { items[x.id] = o; bump('override'); }
        continue;
      }
      if (!P[parent]) { bump('no-parent'); continue; }

      let mods4 = null, rule = null;
      for (const R of RULES) {
        if (only && R.name !== only) continue;
        if (x.p.mods.length !== 1) continue;
        const m = x.p.mods[0].match(R.re);
        if (m) { mods4 = R.build(m); rule = R.name; break; }
      }
      if (!mods4) {
        mods4 = fromDict(x.p.mods);
        if (mods4) rule = 'dict';
      }
      if (!mods4) { bump('untranslated'); continue; }

      const t = compose(x.p.genre, parent, mods4, x.p.year);
      if (!t) { bump('compose-fail'); continue; }
      const bad = gate(t);
      if (bad) { bump('gate:' + bad); if (show && stat['gate:' + bad] <= 2) console.log('GATE', bad, x.id, '|', (t.vi || '').slice(0, 160)); continue; }
      items[x.id] = t;
      bump(rule);
    }
  }

  console.log('selected', Object.keys(items).length);
  console.log(Object.entries(stat).sort((a, b) => b[1] - a[1]).map(([k, v]) => '  ' + k + ' ' + v).join('\n'));

  if (out) {
    const batch = (out.split(/[\\/]/).pop() || '').replace('.json', '');
    fs.writeFileSync(path.resolve(__dirname, out),
      JSON.stringify({ batch, note: 'SG 尾段：体裁 + 母法 + 括注 组合合成', count: Object.keys(items).length, items }, null, 1), 'utf8');
    console.log('written', out);
  }
}

main();
