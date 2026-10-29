/**
 * 从存量四语记录反挖「母法」实体名（不含体裁词与年份）
 * 用途：SG 母法（附注事项）条例/令 的母法部分直接复用，不必逐条重译。
 */
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', '..', 'prototype', 'data', 'laws');

const TYPES = {
  vi: ['Luật', 'Bộ luật', 'Pháp lệnh', 'Quy chế', 'Quy tắc', 'Lệnh', 'Thông báo', 'Hiến chương', 'Hiến pháp'],
  th: ['พระราชบัญญัติ', 'ประมวลกฎหมาย', 'พระราชกำหนด', 'ข้อบังคับ', 'กฎ', 'คำสั่ง', 'ประกาศ', 'กฎบัตร', 'รัฐธรรมนูญ'],
  id: ['Undang-Undang tentang', 'Undang-Undang', 'Kitab Undang-Undang Hukum', 'Peraturan', 'Perintah', 'Pemberitahuan', 'Piagam', 'Konstitusi'],
  ms: ['Akta', 'Kanun', 'Ordinan', 'Peraturan', 'Kaedah', 'Perintah', 'Pemberitahuan', 'Piagam', 'Perlembagaan'],
};

/** 去掉体裁词前缀与结尾年份，留下实体名 */
function bare(s, lang) {
  let x = String(s || '').trim();
  for (const t of TYPES[lang]) {
    if (x.toLowerCase().startsWith(t.toLowerCase() + ' ')) { x = x.slice(t.length).trim(); break; }
    // 泰文词间不加空格，体裁词直接接实体名
    if (lang === 'th' && x.startsWith(t) && x.length > t.length) { x = x.slice(t.length).trim(); break; }
  }
  x = x.replace(/\s*\b(1[5-9]\d{2}|20\d{2})\s*$/, '').trim();
  return x;
}

const recs = [];
for (const f of fs.readdirSync(DIR)) {
  if (!f.startsWith('SG-') || !f.endsWith('.json')) continue;
  const t = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).title || {};
  recs.push({ id: f.replace(/\.json$/, ''), t });
}

const gaps = recs.filter((r) => !(r.t.vi && r.t.th && r.t.id && r.t.ms));
const RE = /^([^()]+?)\s*((?:\([^()]*\)\s*)+)(Regulations|Rules|Order|Notification|By-laws|Scheme|Directions|Act)\b/;

const parents = [...new Set(gaps.map((g) => { const m = (g.t.en || '').trim().match(RE); return m ? m[1].trim() : null; }).filter(Boolean))];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dict = {};
let hit = 0;
const miss = [];
for (const p of parents) {
  const re = new RegExp('^' + esc(p) + '\\s+Act\\b', 'i');
  const c = recs.find((r) => r.t.vi && r.t.th && r.t.id && r.t.ms && re.test(r.t.en || ''));
  if (!c) { miss.push(p); continue; }
  hit++;
  dict[p] = { vi: bare(c.t.vi, 'vi'), th: bare(c.t.th, 'th'), id: bare(c.t.id, 'id'), ms: bare(c.t.ms, 'ms'), from: c.id };
}

fs.writeFileSync(path.join(__dirname, '_sg_parents.json'), JSON.stringify(dict, null, 1), 'utf8');
console.log('母法 distinct', parents.length, '｜词典命中', hit, '｜缺', miss.length);

// 覆盖率：按条目算
let itemHit = 0, itemMiss = 0;
for (const g of gaps) {
  const m = (g.t.en || '').trim().match(RE);
  if (m && dict[m[1].trim()]) itemHit++; else itemMiss++;
}
console.log('条目覆盖', itemHit, '/', itemHit + itemMiss);
console.log('缺母法样例:', miss.slice(0, 20).join(' | '));
