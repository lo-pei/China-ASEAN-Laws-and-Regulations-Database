// 新增 PH 语料体检：只统计无中文标题的 12,498 条（新导入）
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));
const neu = src.filter((x) => !(x.title && x.title.zh));
console.log('新增语料', neu.length);

const T = (x) => ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
const cnt = {
  全大写: 0,
  档案前缀: 0,
  文号前缀: 0,
  尾部以虚词结束: 0,
  开头被切断: 0,
};
for (const x of neu) {
  const t = T(x);
  if (t && t === t.toUpperCase() && /[A-Z]{4,}/.test(t)) cnt.全大写++;
  if (/^(?:MALACAN|BY\s+THE\s+PRESIDENT)/i.test(t)) cnt.档案前缀++;
  if (/^(?:BATAS\s+PAMBANSA|BATASANG\s+PAMBANSA|REPUBLIC\s+ACT\s+NO|ACT\s+NO)/i.test(t)) cnt.文号前缀++;
  if (/\b(?:of|the|and|in|to|for|by|with|on|as|its)\s*\.?$/i.test(t)) cnt.尾部以虚词结束++;
  // 首词明显是残词（小写开头 / 词中断裂）
  if (/^[a-z]/.test(t) || /^[A-Z]{2,}[a-z]{3,}/.test(t) === false && /^[A-Z]{3,}?[a-z]/.test(t)) cnt.开头被切断++;
}
console.log(cnt);

// 文号前缀剥离后能否还原成 "AN ACT ..."
let recoverable = 0;
for (const x of neu) {
  const t = T(x);
  if (/^(?:BATAS\s+PAMBANSA|BATASANG\s+PAMBANSA)\s+(?:BLG\.?|BILANG)\s*\d+\s+(?:AN?\s+ACT)/i.test(t)) recoverable++;
}
console.log('BP 文号 + 完整 AN ACT 题名（可还原）', recoverable);

// 首动词分布（剥掉 AN ACT 后）
const vm = new Map();
for (const x of neu) {
  const t = T(x).replace(/^(?:AN?\s+ACT|ACT)\s+/i, '');
  const w = (t.match(/^[A-Za-z-]+/) || [''])[0].toLowerCase();
  vm.set(w, (vm.get(w) || 0) + 1);
}
console.log('\n首动词 top20:');
console.log([...vm.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k, v]) => k + ':' + v).join('  '));
