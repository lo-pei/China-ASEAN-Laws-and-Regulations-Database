// PH 院校升格类标题四语模板引擎
// 句式：An Act Converting the <原机构> [in ...] Into a <新形态>[,] to Be Known as [the] <新名称> [, and ...]
'use strict';
const fs = require('fs');
const path = require('path');

const rest = JSON.parse(fs.readFileSync(path.join(__dirname, '_ph_rest.json'), 'utf8'));
const skip = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, 'batches', 'ph-p1-b09.json'), 'utf8')).items));

const ENT = (x) => x.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function levelWord(e, lang) {
  const L = {
    university: ['Đại học Bang', 'มหาวิทยาลัยรัฐ', 'Universitas Negeri', 'Universiti Negeri'],
    college: ['Cao đẳng Bang', 'วิทยาลัยรัฐ', 'Perguruan Tinggi Negeri', 'Kolej Negeri'],
    highschool: ['Trường trung học phổ thông', 'โรงเรียนมัธยมศึกษา', 'Sekolah Menengah Atas', 'Sekolah Menengah'],
    school: ['Trường', 'โรงเรียน', 'Sekolah', 'Sekolah'],
  };
  let k = 'school';
  if (/state\s+university/i.test(e)) k = 'university';
  else if (/state\s+college/i.test(e)) k = 'college';
  else if (/high\s+school/i.test(e)) k = 'highschool';
  else if (/\buniversity\b/i.test(e)) k = 'university';
  else if (/\bcollege\b/i.test(e)) k = 'college';
  return L[k][lang];
}

function extractSource(e) {
  let m = e.match(/^An Act\s+(?:to\s+)?Convert(?:ing|s)?\s+(?:the\s+)?(.+?)\s+(?:in|Located\s+in|into|Into|,)\s/i);
  if (!m) m = e.match(/^An Act\s+(?:to\s+)?Convert(?:ing|s)?\s+(?:the\s+)?(.+?)\s+into\s/i);
  if (!m) return null;
  let s = m[1].trim().replace(/,$/, '').replace(/^(?:and\s+)?Integrating\s+(?:the\s+)?/i, '');
  // 去掉末尾的地点/扩展校区修饰
  s = s.replace(/\s+(?:and\s+)?(?:All\s+)?(?:its\s+)?(?:Existing\s+)?(?:Extension\s+|Satellite\s+)?Campuses?\b.*$/i, '');
  s = s.replace(/\s+in\s+the\s+(?:Municipality|City|Province|Municipalities|Cities|Provinces)\b.*$/i, '');
  s = s.replace(/\s+in\s+[A-Z][A-Za-zñÑ.\- ]+$/i, '');
  return s.trim().replace(/,$/, '') || null;
}

function extractTarget(e) {
  let m = e.match(/to\s+be\s+known\s+as\s+(?:the\s+)?(.+?)(?:\s*,?\s+(?:and\s+)?(?:Appropriating|for\s+Other|Integrating|Providing|Authorizing|Therewith)|,|$)/i);
  if (m) return ENT(m[1].trim().replace(/,$/, ''));
  return null;
}

const items = {};
let skipped = 0;
const reasons = {};

for (const r of rest) {
  if (skip.has(r.id)) continue;
  const e = (r.title.en || '').trim();
  if (!/^An Act/i.test(e)) continue;
  if (!/convert/i.test(e)) continue;
  if (!/into\s+an?\s+/i.test(e)) { skipped++; reasons['no-into'] = (reasons['no-into'] || 0) + 1; continue; }
  if (!/\b(School|College|University|Institute|Academy)\b/i.test(e)) { skipped++; reasons['not-school'] = (reasons['not-school'] || 0) + 1; continue; }

  const src = extractSource(e);
  if (!src || src.length < 4) { skipped++; reasons['no-source'] = (reasons['no-source'] || 0) + 1; continue; }

  const tgt = extractTarget(e);
  const lv = levelWord(e, 0), lv1 = levelWord(e, 1), lv2 = levelWord(e, 2), lv3 = levelWord(e, 3);
  const srcE = ENT(src).replace(/\s+and\s+the\s+/gi, ' and ');
  // 泰文：拉丁专名前留一个空格
  const sp = (x) => (/^[A-Za-z]/.test(x) ? ' ' + x : x);
  const sp2 = (x) => (/[A-Za-z]$/.test(x) ? x + ' ' : x);

  let vi, th, id, ms;
  if (tgt) {
    vi = `Đạo luật chuyển đổi ${srcE} thành ${tgt}`;
    th = `พระราชบัญญัติเปลี่ยนสถานะ ${srcE} เป็น ${tgt}`;
    id = `Undang-Undang mengubah ${srcE} menjadi ${tgt}`;
    ms = `Akta menukar ${srcE} kepada ${tgt}`;
  } else {
    vi = `Đạo luật chuyển đổi ${srcE} thành ${lv}`;
    th = `พระราชบัญญัติเปลี่ยนสถานะ ${srcE} เป็น ${lv1}`;
    id = `Undang-Undang mengubah ${srcE} menjadi ${lv2}`;
    ms = `Akta menukar ${srcE} kepada ${lv3}`;
  }

  if (Math.max(vi.length, th.length, id.length, ms.length) > 300) { skipped++; reasons['too-long'] = (reasons['too-long'] || 0) + 1; continue; }
  items[r.id] = { vi, th, id, ms };
}

const OUT = {
  batch: 'ph-p1-b10',
  scope: `PH 院校升格类 ${Object.keys(items).length} 部（Converting ... into ... to be known as ...）`,
  items,
};
fs.writeFileSync(path.join(__dirname, 'batches', 'ph-p1-b10.json'), JSON.stringify(OUT, null, 1), 'utf8');
console.log('部数', Object.keys(items).length, '| 跳过', skipped, JSON.stringify(reasons));
