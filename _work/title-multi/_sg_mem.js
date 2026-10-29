// SG 译法记忆库：从库内 928 条已四语齐备的 SG 记录中挖「母法 / 附注事项 / 文件类型」对照
// 用途：新标题按同一套既有译法拼装，避免自创术语、保证与存量一致
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '..', 'prototype', 'data', 'laws');
const TYPES = ['法典', '条例', '规例', '规则', '命令', '令', '公告', '通知', '附例', '章程', '宪章', '宪法', '法', '办法', '公约', '安排', '计划', '守则', '训令', '文告'];

function splitZh(zh) {
  let z = String(zh || '').replace(/\s+/g, ' ').trim();
  z = z.replace(/《|》/g, '');
  z = z.replace(/\s*修订版\s*$/, '').trim();
  const ym = z.match(/^(.*?)[\s,]*(1[5-9]\d{2}|20\d{2})\s*(?:年)?\s*$/);
  let year = null;
  if (ym) { z = ym[1].trim(); year = ym[2]; }
  let type = null;
  for (const t of TYPES) { if (z.endsWith(t) && z.length > t.length) { type = t; z = z.slice(0, z.length - t.length); break; } }
  if (!type) return null;
  let parent = z.trim(), mod = null;
  const pm = z.match(/^(.*?)\s*（(.+)）\s*$/);
  if (pm) { parent = pm[1].trim(); mod = pm[2].trim(); }
  return { parent, mod, type, year };
}

// 目标语：去类型词前缀、去年份尾、括号内为附注事项
function splitTarget(s, head) {
  let x = String(s || '').replace(/\s+/g, ' ').trim();
  x = x.replace(/[\s,]*((?:19|20)\d{2})\s*$/, '').trim();
  let mod = null;
  const pm = x.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (pm) { x = pm[1].trim(); mod = pm[2].trim(); }
  x = x.replace(/^(?:Luật|Bộ luật|Pháp lệnh|Nghị định|Quy chế|Quy tắc|Quy định|Thông báo|Hiến chương|Hiến pháp|Sắc lệnh|Lệnh|Công ước|Nghị quyết|Quyết định)\s+/i, '');
  x = x.replace(/^(?:พระราชบัญญัติ|ประมวลกฎหมาย|พระราชกำหนด|พระราชกฤษฎีกา|กฎกระทรวง|ข้อบังคับ|กฎ|ประกาศ|คำสั่ง|รัฐธรรมนูญ|กฎบัตร|อนุสัญญา)\s*/u, '');
  x = x.replace(/^(?:Undang-Undang|Kitab Undang-Undang|Peraturan|Perintah|Pemberitahuan|Keputusan|Konstitusi|Piagam|Ordonansi|Undang-undang)\s+(?:tentang\s+)?/i, '');
  x = x.replace(/^(?:Akta|Kanun|Peraturan|Perintah|Pemberitahuan|Keputusan|Perlembagaan|Piagam|Ordinan)\s+/i, '');
  return { parent: x.trim(), mod };
}

function mine() {
  const files = fs.readdirSync(DIR).filter(f => f.startsWith('SG-') && f.endsWith('.json'));
  const P = {}, M = {}, T = {};
  const add = (bag, k, langs) => {
    if (!k) return;
    if (!bag[k]) bag[k] = {};
    for (const l of ['vi', 'th', 'id', 'ms']) if (!bag[k][l] && langs[l]) bag[k][l] = langs[l];
  };
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    const t = j.title || {};
    if (!(t.zh && t.vi && t.th && t.id && t.ms)) continue;
    const z = splitZh(t.zh);
    if (!z) continue;
    const L = {};
    let ok = true;
    for (const l of ['vi', 'th', 'id', 'ms']) {
      const r = splitTarget(t[l]);
      if (!r.parent) { ok = false; break; }
      L[l] = r;
      if (z.mod && !r.mod) { ok = false; break; }
    }
    if (!ok) continue;
    add(P, z.parent, { vi: L.vi.parent, th: L.th.parent, id: L.id.parent, ms: L.ms.parent });
    if (z.mod) add(M, z.mod, { vi: L.vi.mod, th: L.th.mod, id: L.id.mod, ms: L.ms.mod });
    if (!T[z.type]) T[z.type] = {};
    for (const l of ['vi', 'th', 'id', 'ms']) {
      const head = String(t[l]).trim().split(/\s+/)[0];
      if (!T[z.type][l]) T[z.type][l] = head;
    }
  }
  return { P, M, T };
}

if (require.main === module) {
  const { P, M, T } = mine();
  console.log('母法词条', Object.keys(P).length, '附注事项词条', Object.keys(M).length);
  console.log('类型词', JSON.stringify(T));
  fs.writeFileSync(path.join(__dirname, '_sg_mem.json'), JSON.stringify({ P, M, T }, null, 0), 'utf8');
}
module.exports = { mine, splitZh, splitTarget, TYPES };
