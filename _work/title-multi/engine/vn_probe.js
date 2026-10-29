// VN 标题结构探查：类型 / 主题 / 编号 / 修正标记
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');

function parseVn(s0) {
  let s = String(s0).replace(/\s+/g, ' ').trim();
  let amend = '';
  const am = s.match(/^(Luật|Bộ luật)\s+(Sửa đổi,?\s*bổ sung|Sửa đổi và bổ sung|Sửa đổi)\b/i);
  if (am) {
    amend = am[2];
    s = s.slice(am[0].length).trim();
    s = s.replace(/^một số điều của\s+/i, '').replace(/^một số điều\s+/i, '').trim();
  }
  let type = '';
  const tm = s.match(/^(Bộ luật|Luật|Pháp lệnh|Nghị định|Quyết định|Thông tư|Hiến pháp|Lệnh|Nghị quyết|Chỉ thị)\s+/i);
  if (tm) { type = tm[1]; s = s.slice(tm[0].length).trim(); }
  let no = '', subject = s;
  const nm = s.match(/\s*số\s+(?:Số hiệu:\s*)?(.+)$/i);
  if (nm) { subject = s.slice(0, nm.index).trim(); no = nm[1].trim(); }
  if (!no || /^Không số$/i.test(no)) no = '';
  return { type, subject, no, amend };
}

const out = [];
for (const f of fs.readdirSync(LAWS)) {
  if (!f.startsWith('VN-')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8'));
  const t = d.title || {};
  if (String(t.zh || '').trim()) continue;
  out.push({ id: d.id, raw: String(t.orig || t.vi || '').replace(/\s+/g, ' ').trim() });
}

const m = {};
for (const x of out) {
  const p = parseVn(x.raw);
  const k = p.type + '|' + p.subject + '|' + (p.amend ? 'A' : '');
  (m[k] = m[k] || []).push(x.id);
}
const rows = Object.entries(m).sort((a, b) => b[1].length - a[1].length);
const uniqSub = new Set(rows.map(r => r[0].split('|')[1]));
console.log('缺口', out.length, '组合', rows.length, '唯一主题', uniqSub.size);
console.log('---- 频次 ≥2 的组合 ----');
rows.filter(r => r[1].length >= 2).forEach(([k, v]) => console.log(String(v.length).padStart(3), k));
console.log('---- 全部唯一主题 ----');
[...uniqSub].sort().forEach((s, i) => console.log(String(i + 1).padStart(3), s));
