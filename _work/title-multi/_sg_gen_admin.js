// SG 行政令 / 公告 / 委任状引擎：处理不进「体裁 + 母法 + 括注」结构的独立标题
// 用法：node _sg_gen_admin.js --out batches/sg-p1-b24.json [--show]
'use strict';
const fs = require('fs');
const path = require('path');
const { gate } = require('./_sg_gate.js');
const { M, BY_ID } = require('./_sg_admin_dict.js');
const { groups } = require('./_sg_tail.json');

const DOCS = path.join(__dirname, '../../prototype/data/laws');
const inG = new Set();
for (const a of Object.values(groups)) for (const x of a) inG.add(x.id);

// ── 泰文与拉丁/括号之间的空格 ─────────────────────────────
function thGlue(s) {
  return s
    .replace(/([A-Za-z0-9])[\u0E00-\u0E7F]/g, '$1 $2')
    .replace(/([\u0E00-\u0E7F])([A-Za-z0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── 日期 ─────────────────────────────────────────────────
const MON_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const MON_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MON_MS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai',
  'Ogos', 'September', 'Oktober', 'November', 'Disember'];
const MON_TH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function parseDate(s) {
  s = (s || '').trim();
  let m = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(s);
  if (m) return { d: +m[1], mo: +m[2], y: +m[3] };
  m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/.exec(s);
  if (m) {
    const mo = MON_EN.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1;
    if (mo) return { d: +m[1], mo, y: +m[3] };
  }
  return null;
}

function dateOut(dt) {
  if (!dt) return { vi: '', th: '', id: '', ms: '' };
  return {
    vi: `ngày ${dt.d} tháng ${dt.mo} năm ${dt.y}`,
    th: `วันที่ ${dt.d} ${MON_TH[dt.mo - 1]} ${dt.y}`,
    id: `${dt.d} ${MON_ID[dt.mo - 1]} ${dt.y}`,
    ms: `${dt.d} ${MON_MS[dt.mo - 1]} ${dt.y}`,
  };
}

// ── 族 1：Commission（依《调查委员会法》作出的委任令，标题原文只有 Commission）──
function commission(doc) {
  const m = /-N(\d+)\s*$/.exec(doc || '');
  if (!m) return null;
  const n = m[1];
  return {
    vi: `Lệnh Ủy ban Điều tra (N ${n})`,
    th: `คำสั่งคณะกรรมการสอบสวน (N ${n})`,
    id: `Perintah Komisi Penyelidikan (N ${n})`,
    ms: `Perintah Suruhanjaya Siasatan (N ${n})`,
  };
}

// ── 族 2：货币面额与特征公告（Currency Act 项下）────────────
// 变体：Denomination(s) and Characteristics of (the) Coin(s)/Currency Note(s) [to Be Issued] [on <date>]
//       亦有无前缀者，如 Coins to Be Issued on 22nd September 1998
function denomination(orig) {
  const s = orig.trim();
  const ACT = /^Currency Act\s*[—–-]\s*/i.test(s);
  let rest = s.replace(/^Currency Act\s*[—–-]\s*/i, '');

  const m = /^(?:(Denominations? and Characteristics of )?)(?:the )?(Coins?|Currency Notes?)\b(.*)$/i.exec(rest);
  if (!m) return null;
  const hasDenom = !!m[1];
  const note = /Note/i.test(m[2]);
  const plural = /s$/i.test(m[2]);
  const tail = m[3] || '';

  const issued = /to\s+be\s+issued/i.test(tail);
  const dm = /\bon\s+(.+)$/i.exec(tail);
  const dt = dm ? parseDate(dm[1]) : null;
  if (dm && !dt) return null; // 有日期但解析不了，宁可不出
  const D = dateOut(dt);

  // 无「面额与特征」前缀、只剩「Coins to Be Issued on …」时按纯发行公告处理
  if (!hasDenom && !issued && !dt) return null;

  const head = {
    vi: 'Mệnh giá và đặc điểm của ',
    th: 'มูลค่าและลักษณะของ',
    id: 'Pecahan dan Ciri ',
    ms: 'Nilai Muka dan Ciri ',
  };
  const unit = {
    vi: note ? 'tiền giấy' : 'tiền xu',
    th: note ? 'ธนบัตร' : 'เหรียญ',
    id: note ? 'Uang Kertas' : 'Koin',
    ms: note ? 'Wang Kertas' : 'Syiling',
  };
  const actPfx = {
    vi: 'Luật Tiền tệ — ',
    th: 'พระราชบัญญัติเงินตรา — ',
    id: 'Undang-Undang Mata Uang — ',
    ms: 'Akta Mata Wang — ',
  };
  const out = {};
  for (const L of ['vi', 'th', 'id', 'ms']) {
    let body;
    if (hasDenom) {
      body = head[L] + unit[L];
      if (issued) body += L === 'vi' ? ' sẽ phát hành' : L === 'th' ? 'ที่จะออก' : ' yang Akan Dikeluarkan';
      if (dt) body += L === 'vi' ? ` vào ${D[L]}` : L === 'th' ? `เมื่อ${D[L]}` : ` pada ${D[L]}`;
    } else {
      // 仅「Coins to Be Issued on …」：中文层作「<日期>发行的硬币」，四语同构
      const bare = { vi: note ? 'Tiền giấy' : 'Tiền xu', th: note ? 'ธนบัตร' : 'เหรียญ', id: note ? 'Uang Kertas' : 'Koin', ms: note ? 'Wang Kertas' : 'Syiling' };
      if (dt) {
        body = L === 'vi' ? `${bare[L]} phát hành ${D[L]}`
          : L === 'th' ? `${bare[L]}ที่จะออก${D[L]}`
            : `${bare[L]} yang Akan Dikeluarkan pada ${D[L]}`;
      } else {
        body = bare[L] + (issued ? (L === 'vi' ? ' sẽ phát hành' : L === 'th' ? 'ที่จะออก' : ' yang Akan Dikeluarkan') : '');
      }
    }
    out[L] = (ACT ? actPfx[L] : '') + body;
    if (L === 'th') out[L] = thGlue(out[L]);
  }
  return out;
}

function resolve(r) {
  if (r.orig === 'Commission') return commission(r.doc);
  const dn = denomination(r.orig);
  if (dn) return dn;
  if (BY_ID[r.id]) return BY_ID[r.id];
  if (M[r.orig]) return M[r.orig];
  return null;
}

function main() {
  const argv = process.argv.slice(2);
  const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
  const out = arg('--out');
  const show = argv.includes('--show');

  const recs = [];
  for (const f of fs.readdirSync(DOCS).filter((f) => f.startsWith('SG-') && f.endsWith('.json'))) {
    const d = JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8'));
    const t = d.title || {};
    const id = f.replace('.json', '');
    if (t.vi && t.th && t.id && t.ms) continue;   // 已四语齐备
    if (inG.has(id)) continue;                     // 归 _sg_gen_tail.js 管
    recs.push({ id, orig: t.orig || t.en || '', doc: d.docNumber || '' });
  }

  const items = {};
  const stat = {};
  const bump = (k) => { stat[k] = (stat[k] || 0) + 1; };
  const miss = [];

  for (const r of recs) {
    const t = resolve(r);
    if (!t) { bump('unresolved'); miss.push(r.id + '  ' + r.orig); continue; }
    const bad = gate(t);
    if (bad) { bump('gate:' + bad); miss.push('[' + bad + '] ' + r.id + '  ' + r.orig); continue; }
    items[r.id] = t;
    bump('ok');
  }

  console.log('候选', recs.length, '→ 可生成', Object.keys(items).length);
  console.log(Object.entries(stat).map(([k, v]) => '  ' + k + ' ' + v).join('\n'));
  if (miss.length) {
    console.log('未覆盖 ' + miss.length + '：');
    miss.slice(0, show ? miss.length : 20).forEach((x) => console.log('  ' + x));
  }

  if (out) {
    const batch = (out.split(/[\\/]/).pop() || '').replace('.json', '');
    fs.writeFileSync(path.resolve(__dirname, out),
      JSON.stringify({ batch, note: 'SG 行政令 / 公告 / 委任状：独立标题直译', count: Object.keys(items).length, items }, null, 1), 'utf8');
    console.log('written', out);
  }
}

main();
