// X 桶分拣 v2：区分「正常题名（全大写/Title Case）」与「OCR 乱码（大小写破碎）」。
// 只读，产出 _ph_short.json。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));

const NUM = /^(?:(?:BATAS(?:ANG)?\s+PAMBANSA|REPUBLIC\s+ACT|COMMONWEALTH\s+ACT|ACT|EXECUTIVE\s+ORDER|PRESIDENTIAL\s+DECREE|PROCLAMATION|ADMINISTRATIVE\s+ORDER|MEMORANDUM\s+(?:ORDER|CIRCULAR))\s*(?:BLG\.?|BILANG|NO\.?)?\s*\d+[A-Z\-]*)\s*[,:]?\s*/i;
const ARCH = /^(?:MALACA[NÑ]AN\s+PALACE|BY\s+THE\s+PRESIDENT|THE\s+PRESIDENT|OFFICE\s+OF\s+THE\s+PRESIDENT|PMS\s+LIBRARY)/i;
// 档案前缀整段（可能连着 "BY THE PRESIDENT OF THE PHILIPPINES"）
const ARCHFULL = /^(?:MALACA[NÑ]AN\s+PALACE|PMS\s+LIBRARY)?[.,\s]*(?:BY\s+THE\s+PRESIDENT\s+OF\s+THE\s+PHILIPPINES)?[.,\s]*/i;

function stripArch(t) {
  let s = t, n = 0;
  for (let i = 0; i < 3; i++) {
    const m = s.match(ARCHFULL);
    if (!m || !m[0].trim()) break;
    s = s.slice(m[0].length).replace(/^[.,:\-\s]+/, '');
    n++;
  }
  return { s, stripped: n > 0 };
}

// 大小写破碎度：连续小写簇被大写打断的次数
function caseNoise(s) {
  const words = s.match(/[A-Za-zÀ-ÿ]{2,}/g) || [];
  let bad = 0;
  for (const w of words) {
    // 内部出现「小写→大写」转折，或「大写→小写→大写」
    if (/[a-z][A-Z]/.test(w)) {
      // 正常复合词豁免：McX / DelaCruz 少见，统一算噪声
      bad++;
    }
  }
  return bad / Math.max(1, words.length);
}
function hardGarbage(s) {
  if (/[?$%{}[\]|~^`©®]/.test(s)) return 'sym';
  if (caseNoise(s) > 0.15) return 'casenoise';
  return null;
}

const B = { upper: [], title: [], garbage: [], skip: [], other: [] };
for (const x of src) {
  const en = ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
  if (!en) continue;
  const { s: a1, stripped } = stripArch(en);
  const nm = a1.match(NUM);
  let rest = nm ? a1.slice(nm[0].length).trim() : a1;
  if (!stripped && !nm) continue;                 // 不在本次范围
  if (/^AN?\s+ACT\b/i.test(rest)) continue;        // 完整 AN ACT 题名，别处已处理
  rest = rest.replace(/^the\s+/i, '').replace(/^[.,:\-\s]+/, '').trim();
  if (!rest) { B.other.push({ id: x.id, en, why: 'empty' }); continue; }
  const g = hardGarbage(rest);
  if (g) { B.garbage.push({ id: x.id, en, why: g }); continue; }
  if (rest.length < 12) { B.other.push({ id: x.id, en, why: 'short' }); continue; }
  if (!/[A-Za-z]{3,}/.test(rest)) { B.other.push({ id: x.id, en, why: 'noletters' }); continue; }
  const letters = rest.replace(/[^A-Za-z]/g, '');
  const isUpper = letters.length > 8 && letters === letters.toUpperCase();
  (isUpper ? B.upper : B.title).push({ id: x.id, en, name: rest });
}

console.log('全大写题名', B.upper.length, '| TitleCase 题名', B.title.length, '| OCR乱码', B.garbage.length, '| 其他', B.other.length);
console.log('\n全大写样本：');
B.upper.slice(0, 10).forEach((b) => console.log('  · ' + b.name.slice(0, 105)));
console.log('\nTitleCase 样本：');
B.title.slice(0, 10).forEach((b) => console.log('  · ' + b.name.slice(0, 105)));
console.log('\n乱码样本：');
B.garbage.slice(0, 5).forEach((b) => console.log('  · [' + b.why + '] ' + b.en.slice(0, 90)));
console.log('\n其他样本：');
B.other.slice(0, 8).forEach((b) => console.log('  · [' + b.why + '] ' + b.en.slice(0, 95)));

fs.writeFileSync(path.join(__dirname, '_ph_short.json'), JSON.stringify(B, null, 1), 'utf8');
