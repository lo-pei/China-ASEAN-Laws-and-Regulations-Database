/* ==========================================================================
   _ext_export.js —— 导出「待译标题清单」（外发他人/他模型翻译用）

   用法：
     node _ext_export.js                 导出到桌面默认目录
     node _ext_export.js --out <dir>     指定输出目录
     node _ext_export.js --n 60          每批条数（默认 100）

   产物：
     <out>/00-翻译规则.md          规则（取自 _work/title-multi/EXT-RULES.md）
     <out>/01-总表.jsonl           全部待译条目，一行一条
     <out>/02-示例-已完成.jsonl     库内既成译法，供对风格
     <out>/03-待补原文-不译.txt     源文本是文件名/抬头的，翻译解决不了，需回原页补题
     <out>/04-批次索引.csv          批次清单与状态栏
     <out>/批次/<国别>/<批次>.jsonl 每批 n 条

   同时写 _ext_master.json（id → need/have），供 _ext_import.js 校验回填件。
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWDIR = path.join(ROOT, 'prototype/data/laws');
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const SRC_ORDER = ['en', 'orig', 'id', 'ms', 'th', 'vi', 'zh'];
/* orig 的文字语种，按法域推定（orig 只是「原文」的位置，不给语种代码） */
const SRC_LANG = { PH: 'en', SG: 'en', BN: 'ms', ID: 'id', MY: 'ms', TH: 'th', VN: 'vi', LA: 'lo', KH: 'km', MM: 'my', CN: 'zh', TL: 'pt' };
/* docNumber 里没有这些标记词的，是内部流水码（UU6-1950）或占位（-），不能给译者当文号 */
const DN_OK = /(\bNo\b|Nomor|Tahun|B\.E\.|Blg|số\s|เลขที่|ฉบับที่|Akta\s*\d|\bAct\s*\d)/i;

const args = process.argv.slice(2);
const argOf = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(argOf('--out', path.join(process.env.USERPROFILE || 'C:/Users/lenovo', 'OneDrive/Desktop/法规标题待译_外发_20261029')));
const PER = +argOf('--n', 100);

const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

/* ---- 按文字判定 src 实际语种（库里有 th 键塞中文、id 键塞英文的情况） -------- */
const SCRIPT = [
  [/[\u0E00-\u0E7F]/, 'th'],
  [/[\u1780-\u17FF]/, 'km'],
  [/[\u0E80-\u0EFF]/, 'lo'],
  [/[\u1000-\u109F]/, 'my'],
  [/[\u3400-\u4DBF\u4E00-\u9FFF]/, 'zh'],
];
const detectLang = (s, fallback) => {
  for (const [re, code] of SCRIPT) if (re.test(s)) return code;
  return fallback;
};

/* ---- 源文本是「文件名/抬头/页脚」的，不能当标题译，单列 -------------------- */
const JUNK = [
  /^S[-_]?\d{1,4}[-_]/i,                        // BN 的文件名式标题 S-1_2026-E
  /^S\d{3,4}$/i,                                 // BN 的 S542001
  /^LAO\s+PEOPLE['’]?S\s+DEMOCRATIC\s+REPUBLIC/i,
  /^Lao\s+People['’]s\s+Democratic\s+Repubic/i,  // 原文如此
  /^Peace\s+Ind(ependent|ependence)\s+Democr/i,  // 老挝国训抬头
  /^Unofficial\s+translat/i,
  /^Ministry\s+of\s+[\w\s]+$/i,                  // 只有发文机关
  /^Order\s+on\s+Approval\.?$/i,
  /^General\s+of\s+the\s*Departmentof/i,
];
const HAN = /[\u3400-\u4DBF\u4E00-\u9FFF]/;
/* 中文 3 字（「专利法」）已是有意义的标题，不能套用拉丁文的长度门槛 */
const isJunk = (s) => {
  if (!s) return true;
  if (JUNK.some((r) => r.test(s))) return true;
  if (HAN.test(s)) return Array.from(s).length < 3;
  return s.length < 8;
};

/* ---- 截断标题：以连词/介词结尾，说明源文本本身没抄全 ---------------------- */
const isTrunc = (s) => /(\b(and|of|the|to|for|with|on|in|by|or|as|into|from|that|which)|\/)\s*$/i.test(s)
  || /\b(SMALL AND MEDIUM SIZED|WILD|insu)$/i.test(s);

const rows = [];
const junk = [];
const idx = {};

for (const f of fs.readdirSync(LAWDIR)) {
  if (!f.endsWith('.json') || f === 'index.json') continue;
  const id = f.slice(0, -5);
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(LAWDIR, f), 'utf8')); } catch (e) { continue; }
  if (!d || typeof d !== 'object' || !d.id) continue;   // 目录索引等非法规文件
  const t = d.title && typeof d.title === 'object' ? d.title : {};
  const need = LANGS.filter((k) => !clean(t[k]));
  if (!need.length) continue;

  let src = '', lang = '';
  for (const k of SRC_ORDER) {
    if (!clean(t[k])) continue;
    src = clean(t[k]);
    lang = detectLang(src, k === 'orig' ? (SRC_LANG[clean(d.country)] || 'orig') : k);
    break;
  }

  /* 与 src 重复的键不再重复给，省一半体积 */
  const have = {};
  for (const k of LANGS) if (clean(t[k]) && clean(t[k]) !== src) have[k] = clean(t[k]);

  const co = clean(d.country) || '??';
  if (isJunk(src)) { junk.push({ id, co, src: src || '(标题全空)', need }); continue; }

  const rec = { key: id, co, src, lang, need };
  if (clean(d.docNumber) && DN_OK.test(clean(d.docNumber))) rec.dn = clean(d.docNumber);
  if (Object.keys(have).length) rec.have = have;
  if (isTrunc(src)) rec.trunc = 1;
  /* 源文本不是该法域的官方语言（少数条目只录过中文短名）：提醒不要虚构年份文号 */
  if (lang === 'zh' && co !== 'CN') rec.note = '源仅有中文短名，无年份与文号；只译名称，不要补年份或文号';
  rows.push(rec);
  idx[id] = { co, need, src, lang, dn: rec.dn || null };
}

/* ---- 分国别、按 id 排序、切批 ---------------------------------------------- */
rows.sort((a, b) => (a.co === b.co ? a.key.localeCompare(b.key) : a.co.localeCompare(b.co)));
const byCo = {};
for (const r of rows) (byCo[r.co] = byCo[r.co] || []).push(r);

fs.mkdirSync(path.join(OUT, '批次'), { recursive: true });

const lines = [rows.map((r) => JSON.stringify(r)).join('\n')];
fs.writeFileSync(path.join(OUT, '01-总表.jsonl'), lines.join(''), 'utf8');

const csv = [['批次文件', '国别', '条数', '语种需求', '状态']];
let total = 0;
for (const co of Object.keys(byCo).sort()) {
  const dir = path.join(OUT, '批次', co);
  fs.mkdirSync(dir, { recursive: true });
  const list = byCo[co];
  for (let i = 0; i < list.length; i += PER) {
    const part = list.slice(i, i + PER);
    const no = String(Math.floor(i / PER) + 1).padStart(2, '0');
    const name = co + '-' + no + '.jsonl';
    fs.writeFileSync(path.join(dir, name), part.map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf8');
    const mix = {};
    for (const r of part) { const k = r.need.join('+'); mix[k] = (mix[k] || 0) + 1; }
    csv.push(['批次/' + co + '/' + name, co, part.length,
      Object.entries(mix).map(([k, v]) => k + '×' + v).join(' '), '待译']);
    total += part.length;
  }
}
fs.writeFileSync(path.join(OUT, '04-批次索引.csv'), '\ufeff' + csv.map((r) => r.join(',')).join('\n') + '\n', 'utf8');

/* ---- 待补原文清单 ---------------------------------------------------------- */
const jl = ['# 这批不是「翻译问题」，是「原文没抄全」。送译也译不出内容，须回原页取标题后再入库。', ''];
for (const j of junk) jl.push([j.id, j.co, '缺:' + j.need.join('/'), '现有标题原文：「' + j.src + '」'].join('\t'));
fs.writeFileSync(path.join(OUT, '03-待补原文-不译.txt'), jl.join('\n') + '\n', 'utf8');

/* ---- 示例：库内既成译法（人工挑过的定稿条目，风格与质量都有保证） ------------- */
const SAMPLE_IDS = [
  'PH-H041', 'PH-H10000', 'PH-H10004', 'PH-H10007', 'PH-DPA-2012',   // 短名 / 长题 / 拨款式 / 简称式
  'ID-H002', 'ID-H020', 'ID-H069', 'ID-H1054',                      // UU 与 PP 两种句框
  'MY-H197', 'TH-H892', 'VN-H112', 'VN-H636',
];
const sample = [];
for (const id of SAMPLE_IDS) {
  const p = path.join(LAWDIR, id + '.json');
  if (!fs.existsSync(p)) continue;
  const t = JSON.parse(fs.readFileSync(p, 'utf8')).title || {};
  if (LANGS.some((k) => !clean(t[k]))) continue;
  const o = { key: id };
  for (const k of LANGS) o[k] = clean(t[k]);
  sample.push(o);
}
fs.writeFileSync(path.join(OUT, '02-示例-已完成.jsonl'), sample.map((s) => JSON.stringify(s)).join('\n') + '\n', 'utf8');

/* ---- 规则文档 -------------------------------------------------------------- */
for (const [src, dst] of [['EXT-RULES.md', '00-翻译规则.md'], ['EXT-README.md', '05-使用说明（自己看）.md']]) {
  const p = path.join(__dirname, src);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(OUT, dst));
  else console.warn('警告：缺少 ' + src);
}

/* ---- 校验用母版（不进外发包） ---------------------------------------------- */
fs.writeFileSync(path.join(__dirname, '_ext_master.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), per: PER, total: rows.length, idx }, null, 0), 'utf8');

/* ---- 汇总 ------------------------------------------------------------------ */
console.log('输出目录：' + OUT);
console.log('待译 ' + rows.length + ' 条，' + Object.keys(byCo).length + ' 个法域，每批 ' + PER + ' 条：');
for (const co of Object.keys(byCo).sort()) {
  const n = byCo[co].length;
  console.log('  ' + co.padEnd(3) + String(n).padStart(6) + '  批数 ' + Math.ceil(n / PER));
}
console.log('待补原文 ' + junk.length + ' 条（见 03-待补原文-不译.txt）');
console.log('示例 ' + sample.length + ' 条');
