// 合并英译回执 → _work/title-en/titles-en.json（并做完整性/格式校验）
// 用法：node _work/title-en/merge-return.js <回执目录或 out-*.json 文件...>
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TASKS = path.join(__dirname, 'tasks.json');
const OUT = path.join(__dirname, 'titles-en.json');

const args = process.argv.slice(2);
if (!args.length) {
  console.error('用法：node _work/title-en/merge-return.js <回执目录或 out-*.json 文件...>');
  process.exit(1);
}

// 收集输入文件：目录取其下 titles.*.json / out-*.json；文件直接用
const files = [];
for (const a of args) {
  const p = path.resolve(a);
  if (!fs.existsSync(p)) { console.error('路径不存在: ' + a); process.exit(1); }
  if (fs.statSync(p).isDirectory()) {
    fs.readdirSync(p)
      .filter(f => /^(titles\.\d{3}|out-\d+)\.json$/.test(f))
      .sort()
      .forEach(f => files.push(path.join(p, f)));
  } else {
    files.push(p);
  }
}
if (!files.length) { console.error('未找到回执文件'); process.exit(1); }

const tasks = JSON.parse(fs.readFileSync(TASKS, 'utf8'));
const zhById = {};
const pending = new Set();
tasks.forEach(t => {
  zhById[t.id] = t.zh;
  if (!t.en) pending.add(t.id);
});

const out = {};
const problems = [];

for (const f of files) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    problems.push('JSON 无法解析: ' + f + ' — ' + e.message);
    continue;
  }
  // 兼容纯数组 与 { items: [...] } 两种回执结构
  const items = Array.isArray(data) ? data : (data.items || []);
  if (!Array.isArray(items)) { problems.push('结构异常: ' + f); continue; }
  for (const it of items) {
    if (!it || !it.id) { problems.push('缺少 id: ' + f); continue; }
    if (!pending.has(it.id)) { problems.push('任务包外或已有英文的 id: ' + it.id + ' @ ' + path.basename(f)); continue; }
    if (out[it.id]) { problems.push('重复 id: ' + it.id); continue; }
    const en = String(it.en || '').trim();
    if (/[\u4e00-\u9fff]/.test(en)) problems.push('译文含汉字: ' + it.id + ' — ' + en);
    if (en.length < 3) problems.push('译文过短: ' + it.id);
    if (/Disclaimer|for reference only|translation note|TBD|TODO|待译|占位/i.test(en)) problems.push('含套话: ' + it.id);
    if (en === zhById[it.id]) problems.push('与原文相同: ' + it.id);
    out[it.id] = { en: en };
  }
}

const missing = [...pending].filter(id => !out[id]);

console.log('  回执文件: ' + files.length + '  已译: ' + Object.keys(out).length + ' / 待译: ' + pending.size);
if (missing.length) console.log('  缺失 id: ' + missing.length + '（' + missing.slice(0, 5).join(', ') + '…）');
if (problems.length) {
  console.log('  ✗ 问题 ' + problems.length + ' 项，未写盘：');
  problems.slice(0, 20).forEach(p => console.log('    - ' + p));
  process.exit(1);
}
if (missing.length) { console.log('  存在缺失，未写盘'); process.exit(1); }

// 保留已有英文的条目，避免覆盖历史数据
tasks.forEach(t => { if (t.en && !out[t.id]) out[t.id] = { en: t.en }; });

fs.writeFileSync(OUT, JSON.stringify(out, null, 1), 'utf8');
console.log('  ✓ 写出 ' + path.relative(ROOT, OUT) + '（' + Object.keys(out).length + ' 条）');
