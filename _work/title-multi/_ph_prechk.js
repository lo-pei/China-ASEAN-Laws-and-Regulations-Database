// 批次预检：专名一致性（防捏造）+ 长度比 + 结构完整性。
// 用法：node _work/title-multi/_ph_prechk.js <批次json> <源json>
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const LANGS = ['vi', 'th', 'id', 'ms'];

const [batchRel, srcRel] = process.argv.slice(2);
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, batchRel), 'utf8')).items;
const src = JSON.parse(fs.readFileSync(path.join(ROOT, srcRel || '_work/title-multi/_ph_norm_src.json'), 'utf8'));
const m = new Map(src.map((x) => [x.id, x]));

// 专名 token：连续大写词（允许 of/de/del/y/and 等小连接词）
const PROPER = /\b[A-Z][A-Za-z'’.\-]+(?:\s+(?:of|de|del|dela|y|and|the|upon|on|in)\s+[A-Z][A-Za-z'’.\-]+|\s+[A-Z][A-Za-z'’.\-]+)*/g;
// 目标语通名（出现在译文中属正常，跳过）
const GENERIC = new Set(['Province', 'Municipality', 'Municipal', 'City', 'Barrio', 'Barangay', 'Sitio', 'District', 'National', 'High', 'School', 'Hospital', 'College', 'University', 'Institute', 'Center', 'Centre', 'Act', 'An', 'Republic', 'Philippines', 'Emergency', 'Memorial', 'Regional', 'State', 'Science', 'Sciences', 'Technology', 'Arts', 'Trades', 'Agricultural', 'Agriculture', 'Fisheries', 'Health', 'Medical', 'General', 'Public', 'Elementary', 'Central', 'Community', 'Rural', 'Vocational', 'Technical', 'Polytechnic', 'Academy', 'Foundation', 'Research', 'Development', 'Authority', 'Board', 'Office', 'Bureau', 'Commission', 'Court', 'The', 'And', 'Of', 'In', 'To', 'Be', 'Known', 'As', 'Into', 'Establishing', 'Creating', 'Converting', 'Providing', 'Establishment', 'Appropriating', 'Authorizing', 'Funds', 'Therefor', 'Name', 'Changing', 'Provincial', 'Sub-Province', 'Sub', 'South', 'North', 'East', 'West', 'Comprehensive', 'Charter', 'Chartered', 'Purpose', 'Purposes', 'Ten', 'Bed', 'Beds', 'Capacity', 'Integrated', 'Special', 'Pilot', 'Experimental', 'Model', 'Training', 'Extension', 'Annex', 'Main', 'New', 'Old', 'Upper', 'Lower', 'Proper', 'Poblacion', 'Santo', 'Santa', 'San', 'Sto', 'Sta']);

const issues = [];
const lens = [];
for (const [id, t] of Object.entries(batch)) {
  const x = m.get(id);
  if (!x) { issues.push([id, 'source-missing', '']); continue; }
  const en = x.title.en;
  // 源侧专名（过滤通名）
  const properEn = new Set();
  for (const mm of en.matchAll(PROPER)) {
    const s = mm[0].trim();
    const head = s.split(/\s+/)[0];
    if (GENERIC.has(head)) continue;
    if (s.length < 3) continue;
    properEn.add(s);
  }
  for (const L of LANGS) {
    const s = t[L] || '';
    if (!s) { issues.push([id, L + ':empty', '']); continue; }
    lens.push([L, en.length, s.length]);
    // 每个源专名的首词应出现在译文中（拉丁字母，英文残留已被闸门挡，这里只看是否丢失）
    const missing = [];
    for (const p of properEn) {
      const head = p.split(/\s+/)[0];
      if (head.length < 4) continue;
      if (!s.includes(head)) missing.push(head);
    }
    if (missing.length) issues.push([id, L + ':proper-missing', missing.join('|') + ' << ' + s.slice(0, 90)]);
  }
}

console.log('批次', Object.keys(batch).length, '| 问题', issues.length);
issues.slice(0, 40).forEach((i) => console.log('  · ' + i[0] + ' ' + i[1] + '  ' + i[2]));

// 长度比分布（译文/英文）
for (const L of LANGS) {
  const a = lens.filter((x) => x[0] === L).map((x) => x[2] / x[1]).sort((p, q) => p - q);
  if (!a.length) continue;
  const q = (p) => a[Math.floor(p * (a.length - 1))].toFixed(2);
  console.log(L, '长度比 p05', q(0.05), 'p50', q(0.5), 'p95', q(0.95));
}
