// 标题质量校验（规范 §7）：结构 / 字符集 / 语义 / 长度比
// 用法：
//   node _work/title-multi/chk-titles.js <批次JSON>    校验批次
//   node _work/title-multi/chk-titles.js --all         校验全库（只报错，慢）
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAWS = path.join(ROOT, 'prototype', 'data', 'laws');
const UI_LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const ALL = UI_LANGS.concat(['orig']);

const RE = {
  han: /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/,
  thai: /[\u0E00-\u0E7F]/,
  khmer: /[\u1780-\u17FF\u19E0-\u19FF]/,
  myanmar: /[\u1000-\u109F\uAA60-\uAA7F]/,
  lao: /[\u0E80-\u0EFF]/,
  latin: /[A-Za-z]/,
  viMark: /[ăâđêôơưĂÂĐÊÔƠƯàảãáạằẳẵắặầẩẫấậèẻẽéẹềểễếệìỉĩíịòỏõóọồổỗốộờởỡớợùủũúụừửữứựỳỷỹýỵ]/,
  placeholder: /\b(TBD|TODO|FIXME|XXX|\?\?\?|待补|待定|待译)\b/i,
  bookMarks: /[《》]/
};

function latinRatio(s) {
  const chars = Array.from(s);
  if (!chars.length) return 0;
  const n = chars.filter(c => /[A-Za-z\u00C0-\u024F]/.test(c)).length;
  return n / chars.length;
}

const errors = [], warns = [];
function err(id, k, msg) { errors.push(id + ' / ' + k + '：' + msg); }
function warn(id, k, msg) { warns.push(id + ' / ' + k + '：' + msg); }

function checkOne(id, t, strict, only) {
  if (!t || typeof t !== 'object') { err(id, 'title', '不是对象'); return; }
  const scope = only && only.length ? only : ALL;
  for (const k of scope) {
    const v = t[k];
    if (v === null || v === undefined || String(v).trim() === '') {
      if (strict) err(id, k, '缺失');
      continue;
    }
    const s = String(v).trim();
    if (s.length < 2) err(id, k, '长度 < 2');
    /* 长度上限随源文放宽：泰国/印尼部分法定全称本身就有 350–500 字符，
       忠实对译必然超 300。基准取 max(300, 源文长度 × 1.2)，仍可拦住灌水译名。 */
    // base 取 en 与 orig 的较大者：理论上 en 已译，但原文本身超长时（印尼法定全称
    // 有 361 字符的实例），上限须按原文放宽，否则会把 orig 本身判成超长。
    const base = Math.max(
      String(t.en || '').trim().length,
      String(t.orig || '').trim().length,
    );
    const cap = Math.max(300, Math.round(base * 1.2));
    // orig / id 是原文层（id 为原文照抄），不受译名长度上限约束
    if (k !== 'orig' && k !== 'id' && s.length > cap) {
      err(id, k, '长度 > ' + cap + ' (源文 ' + base + ' / 实际 ' + s.length + ')');
    }
    if (RE.placeholder.test(s)) err(id, k, '含占位符');
    /* §5.4 口径（2026-10-28 定）：中文标点仅 zh 可用，书名号《》同列，
       zh 放行；其余五种界面语种与 orig 一律禁。 */
    if (RE.bookMarks.test(s) && k !== 'orig' && k !== 'zh') err(id, k, '含书名号');
    if (/\uFFFD/.test(s)) err(id, k, '含替换字符 U+FFFD');

    if (k === 'zh') {
      if (!RE.han.test(s)) err(id, k, '不含汉字');
      if (RE.thai.test(s) || RE.khmer.test(s) || RE.myanmar.test(s) || RE.lao.test(s)) err(id, k, '含他国文字');
      if (latinRatio(s) > 0.6) err(id, k, '拉丁字母占比过高 (' + (latinRatio(s) * 100).toFixed(0) + '%)');
    }
    if (k === 'en') {
      if (RE.han.test(s)) err(id, k, '含汉字');
      if (RE.thai.test(s) || RE.khmer.test(s) || RE.myanmar.test(s) || RE.lao.test(s)) err(id, k, '含东南亚文字');
      if (!RE.latin.test(s)) err(id, k, '不含拉丁字母');
    }
    if (k === 'vi') {
      if (RE.han.test(s)) err(id, k, '含汉字');
      if (RE.thai.test(s) || RE.khmer.test(s)) err(id, k, '含东南亚文字');
      if (!RE.viMark.test(s) && !/[àáảãạăằẳẵắặâầẩẫấậèéẻẽẹêềểễếệìíỉĩịòóỏõọôồổỗốộơờởỡớợùúủũụưừửữứựỳýỷỹỵđ]/i.test(s)) warn(id, k, '未见越南语声调字符');
    }
    if (k === 'th') {
      if (!RE.thai.test(s)) err(id, k, '不含泰文');
      if (RE.han.test(s) || RE.khmer.test(s)) err(id, k, '含汉字/高棉文');
    }
    if (k === 'id' || k === 'ms') {
      if (RE.han.test(s)) err(id, k, '含汉字');
      if (RE.thai.test(s) || RE.khmer.test(s)) err(id, k, '含东南亚文字');
      if (!RE.latin.test(s)) err(id, k, '不含拉丁字母');
    }
  }
  /* 同一法域不得 zh === en 且 en 含汉字（已在上面判错）；重复判定略 */
  if (scope.includes('zh') && scope.includes('en') && t.zh && t.en && t.zh === t.en) err(id, 'zh/en', '完全相同');
  /* 长度比：译名 / 英文 */
  if (t.en && scope.includes('en')) {
    for (const k of ['zh', 'vi', 'id', 'ms']) {
      if (!t[k] || !scope.includes(k)) continue;
      const r = Array.from(String(t[k])).length / Array.from(String(t.en)).length;
      if (r < 0.4 || r > 3.0) warn(id, k, '长度比异常 ' + r.toFixed(2) + '（对 en）');
    }
  }
}

/* ---- 批次模式 ----
   默认按「laws 现值 + 批次增量」合并后校验，只对批次涉及的键要求存在；
   加 --full 则要求合并后 7 个键齐全（用于整部法规一次补齐的批次）。 */
const arg = process.argv[2];
const FULL = process.argv.includes('--full');
const oi = process.argv.indexOf('--only');
const ONLY = oi > 0 ? String(process.argv[oi + 1]).split(',').map(s => s.trim()).filter(Boolean) : null;
if (arg && arg !== '--all') {
  const doc = JSON.parse(fs.readFileSync(path.resolve(arg), 'utf8'));
  const items = doc.items || doc;
  let merged = 0;
  for (const [id, rec] of Object.entries(items)) {
    const file = path.join(LAWS, id + '.json');
    let cur = {};
    if (fs.existsSync(file)) {
      const o = JSON.parse(fs.readFileSync(file, 'utf8'));
      cur = (o.title && typeof o.title === 'object') ? o.title : (o.title ? { zh: o.title } : {});
      merged++;
    } else {
      err(id, 'id', 'laws 中不存在该 id');
    }
    const view = Object.assign({}, cur, rec);
    checkOne(id, view, FULL, ONLY);
  }
  console.log('批次 ' + (doc.batch || path.basename(arg)) + '：' + Object.keys(items).length +
    ' 条（合并既有标题 ' + merged + ' 条' +
    (ONLY ? '，仅校验 ' + ONLY.join('/') : (FULL ? '，要求 7 键齐全' : '，仅校验本批涉及的键')) + '）');
} else if (arg === '--all') {
  let n = 0;
  for (const f of fs.readdirSync(LAWS)) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    let o; try { o = JSON.parse(fs.readFileSync(path.join(LAWS, f), 'utf8')); } catch (e) { continue; }
    if (o.duplicateOf) continue;
    n++;
    checkOne(o.id, o.title, false);
  }
  console.log('全库 ' + n + ' 部');
} else {
  console.error('用法：node chk-titles.js <批次JSON> | --all');
  process.exit(1);
}

console.log('  错误 ' + errors.length + ' / 告警 ' + warns.length);
/* 错误明细默认只列前 40 条；CHK_LIMIT 可放开（CHK_LIMIT=99999 用于分类统计）*/
const LIMIT = Number(process.env.CHK_LIMIT || 40);
errors.slice(0, LIMIT).forEach(e => console.log('  ✗ ' + e));
if (errors.length > LIMIT) console.log('  … 另有 ' + (errors.length - LIMIT) + ' 条错误');
const agg = {};
warns.forEach(w => { const k = w.split('：')[1] || w; agg[k] = (agg[k] || 0) + 1; });
Object.keys(agg).sort((a, b) => agg[b] - agg[a]).slice(0, 8).forEach(k => console.log('  ! ' + k + ' ×' + agg[k]));
if (errors.length) process.exitCode = 1;
