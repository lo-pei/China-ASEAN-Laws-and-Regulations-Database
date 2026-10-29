'use strict';
// PH 批次三项交付质检：① 跨语种串码 ② 剔除专名后的英文残留 ③ 排版
// ② 用词表驱动：候选词若不属于「该语种已入库译文中出现过的拉丁词」，即判残留。
// 用法：node _work/title-multi/_ph_qchk.js <batch.json> [--allow a,b,c] [--list] [--lang vi]
const fs = require('fs');
const path = require('path');
const LANGS = ['vi', 'th', 'id', 'ms'];
const ROOT = path.resolve(__dirname, '..', '..');
const DATADIR = path.join(ROOT, 'prototype', 'data', 'laws');

// —— ① 跨语种串码 ——
// 只查「该语言绝不该出现」的文字。越南语用越南专属字母判定，不用整个拉丁扩展（误伤西语 ñ）
const SCRIPTS = {
  th: /[\u0E00-\u0E7F]/,
  vi: /[ăâđêôơưĂÂĐÊÔƠƯ\u0300\u0301\u0303\u0309\u031B\u0323]/,
  cjk: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  hangul: /[\uAC00-\uD7AF]/,
  kana: /[\u3040-\u30FF]/,
  arab: /[\u0600-\u06FF]/,
  khmer: /[\u1780-\u17FF]/,
  lao: /[\u0E80-\u0EFF]/,
  myanmar: /[\u1000-\u109F]/,
  cyr: /[\u0400-\u04FF]/,
};
const BAN = {
  vi: ['th', 'cjk', 'hangul', 'kana', 'arab', 'khmer', 'lao', 'myanmar', 'cyr'],
  th: ['cjk', 'hangul', 'kana', 'arab', 'khmer', 'lao', 'myanmar', 'cyr', 'vi'],
  id: ['th', 'cjk', 'hangul', 'kana', 'arab', 'khmer', 'lao', 'myanmar', 'cyr', 'vi'],
  ms: ['th', 'cjk', 'hangul', 'kana', 'arab', 'khmer', 'lao', 'myanmar', 'cyr', 'vi'],
};
function crossScript(code, s) {
  for (const k of BAN[code]) {
    const m = s.match(SCRIPTS[k]);
    if (m) return 'crossscript:' + k + '(' + code + ')=' + JSON.stringify(m[0]);
  }
  return null;
}

// —— ② 英文残留 ——
const ESC = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function stripProper(s, allow) {
  let t = s;
  t = t.replace(/[“”"']([^“”"']{1,160})[“”"']/g, ' ');
  t = t.replace(/《[^》]{1,160}》/g, ' ');
  t = t.replace(/\([^()]{1,100}\)/g, ' ');
  t = t.replace(/\b(?:No\.?|Nos\.?)\s*\d+[A-Za-z]?/gi, ' ');
  t = t.replace(/\b\d+(?:[.,]\d+)*\b/g, ' ');
  t = t.replace(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)\b/g, ' ');
  if (allow && allow.length) t = t.replace(new RegExp(allow.filter((x) => x && x.length > 2).map(ESC).join('|'), 'gi'), ' ');
  const NAME = /\b[A-Z][A-Za-z'’\u00C0-\u024F\u1E00-\u1EFF.\-]*(?:\s+(?:of|and|the|de|del|van|von|da|dos|das|y|e|II|III|IV)\s+[A-Za-z'’\u00C0-\u024F\u1E00-\u1EFF.\-]+|\s+[A-Z][A-Za-z'’\u00C0-\u024F\u1E00-\u1EFF.\-]*)*/g;
  t = t.replace(NAME, ' ');
  t = t.replace(/\b[A-Z]{2,8}\b/g, ' ');
  return t;
}
// 英文虚词：单独出现一个就判漏译
const EN_STOP = new Set(['the', 'and', 'of', 'for', 'with', 'by', 'its', 'that', 'which', 'shall', 'from', 'into', 'as', 'to', 'on', 'under', 'other', 'in', 'at', 'an', 'or', 'be', 'known', 'therefor', 'hereby', 'said', 'such', 'each', 'every', 'located', 'situated', 'traversing', 'integrating', 'stretching', 'both', 'pursuant', 'provided', 'amending', 'repealing', 'appropriating', 'authorizing', 'may', 'may be', 'not', 'any', 'all']);
// 常见英文实词（历史上漏进标题的），单个即判漏译
const EN_TERM = new Set(['station', 'stations', 'radio', 'wireless', 'permit', 'permits', 'temporary', 'franchise', 'pesos', 'centavos', 'funds', 'hospital', 'highway', 'barrio', 'barangay', 'municipality', 'province', 'highway', 'road', 'school', 'extension', 'annex', 'district', 'national', 'regional', 'state', 'university', 'college', 'fisheries', 'agricultural', 'memorial', 'general', 'public', 'private']);
const TOK = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]{2,}/g;
let LEX = null, LEXALL = null;
function loadLex() {
  if (LEX) return LEX;
  LEX = { vi: new Set(), th: new Set(), id: new Set(), ms: new Set() };
  LEXALL = new Set();
  // 缓存优先：全扫 4.2 万文件约 3 分钟，缓存后毫秒级。
  // 库内译文有较大增量时用 NO_LEXCACHE=1 重建。
  const cacheFile = path.join(__dirname, '_ph_lexcache.json');
  if (!process.env.NO_LEXCACHE) {
    try {
      const c = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      for (const L of LANGS) for (const w of c[L] || []) { LEX[L].add(w); LEXALL.add(w); }
      return LEX;
    } catch (e) { /* 无缓存则回落到全扫 */ }
  }
  for (const f of fs.readdirSync(DATADIR)) {
    if (!f.endsWith('.json')) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(DATADIR, f), 'utf8')); } catch (e) { continue; }
    const t = j.title || {};
    for (const L of LANGS) {
      const s = t[L];
      if (!s) continue;
      for (const m of String(s).matchAll(TOK)) { LEX[L].add(m[0]); LEXALL.add(m[0]); }
    }
  }
  try {
    const o = {};
    for (const L of LANGS) o[L] = [...LEX[L]];
    fs.writeFileSync(cacheFile, JSON.stringify(o), 'utf8');
  } catch (e) { /* 缓存写失败不影响判定 */ }
  return LEX;
}
const ALLOW = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, '_ph_qallow.json'), 'utf8')); } catch (e) { return { vi: [], th: [], id: [], ms: [] }; } })();
// 目标语里同形的固有词，不当英文虚词处理（越南语 in=印刷、to=大）
const STOP_EXCEPT = { vi: ['in', 'to', 'an'], th: [], id: [], ms: [] };
// 词表已被历史数据污染（into/an/to/be 都混进来了），
// 因此英文虚词一律按「形」判定，不看词表；唯目标语同形词除外。
function residue(code, s, allow) {
  loadLex();
  const exc = new Set(STOP_EXCEPT[code] || []);
  const mine = LEX[code];
  const allowSet = new Set([...(ALLOW[code] || []), ...(allow || [])].map((x) => String(x).toLowerCase()));
  const bare = stripProper(s, allow);
  const toks = [...bare.matchAll(TOK)];
  const susp = [], pend = [];
  let bestRun = 0, bestSeq = [];
  const flush = () => {
    if (pend.length > bestRun) { bestRun = pend.length; bestSeq = pend.slice(); }
    pend.length = 0;
  };
  for (const m of toks) {
    const w = m[0], low = w.toLowerCase();
    if (exc.has(low) || allowSet.has(low)) { flush(); continue; }
    // ① 英文虚词按「形」判定：目标语里不存在这些词，出现即为漏译（越南语同形词除外）
    if (EN_STOP.has(low)) { susp.push(w); pend.push(w); continue; }
    // ② 英文实词：id/ms 有大量同源借词（radio/tv…），故以「本族词表里有没有」为准
    if (EN_TERM.has(low) && !(mine.has(w) || mine.has(low))) { susp.push(w); pend.push(w); continue; }
    if (mine.has(w) || mine.has(low)) { flush(); continue; }
    pend.push(w);
  }
  flush();
  if (susp.length) return 'residue:' + code + '=' + JSON.stringify(susp[0]) + ' @ ' + bare.replace(/\s+/g, ' ').trim().slice(0, 80);
  if (bestRun >= 2) return 'residue:' + code + '=' + JSON.stringify(bestSeq.join(' ')) + ' @ ' + bare.replace(/\s+/g, ' ').trim().slice(0, 80);
  return null;
}

// —— ②b 伪译：英文词被当成「专名」整段保留下来 ——
// 反推词表（见 _ph_mtbuild.js）：这些词在已入库的 PH 对照里几乎都被译走了。
const MT = (() => { try { return require('./_ph_mt.json'); } catch (e) { return { vi: [], th: [], id: [], ms: [] }; } })();
const MTSET = {};
for (const L of LANGS) MTSET[L] = new Set(MT[L] || []);
// 正当保留的专名短语：≥2 词且不以区划/机构通名开头（Mountain Province 是真实省名，
// 「Municipality of Cuyo」这类以通名开头的则是没译出来的结构）
const HEAD0 = /^(?:Barangay|Barrio|Sitio|City|Municipality|Municipalities|Municipal\s+District|Province|Provinces|Sub-?[Pp]rovince|Region|District|Island|Acts?|Republic|Bureau|School|Hospital|Office)$/i;
const PHRASE = /\b[A-Z][A-Za-z'’\u00C0-\u024F.\-]*(?:\s+(?:of|and|the|de|del|van|von|y|e)\s+[A-Za-z'’\u00C0-\u024F.\-]+|\s+[A-Z][A-Za-z'’\u00C0-\u024F.\-]*)+/g;
function properPhrases(en) {
  const out = [];
  for (const m of String(en || '').matchAll(PHRASE)) {
    const w = m[0].trim().split(/\s+/);
    if (w.length < 2) continue;
    if (HEAD0.test(w[0])) continue;
    out.push(m[0].trim());
  }
  return out.sort((a, b) => b.length - a.length);
}
function pseudo(code, s, allow, en) {
  const set = MTSET[code];
  if (!set || !set.size) return null;
  const allowSet = new Set([...(ALLOW[code] || []), ...(allow || [])].map((x) => String(x).toLowerCase()));
  // 标记「属于正当专名短语」的词位，跳过不判
  const okIdx = new Set();
  const toks = [...String(s).matchAll(/[A-Za-z\u00C0-\u024F]{4,}/g)];
  for (const ph of properPhrases(en)) {
    const tail = ' ' + String(s).split(ph).slice(1).join('|' + ph);   // 占位保持偏移
    let pos = 0;
    const parts = String(s).split(ph);
    let cur = 0;
    for (let i = 0; i < parts.length - 1; i++) {
      cur += parts[i].length;
      const end = cur + ph.length;
      for (let k = 0; k < toks.length; k++) {
        if (toks[k].index >= cur && toks[k].index < end) okIdx.add(k);
      }
      cur = end;
    }
  }
  const hit = [];
  for (let i = 0; i < toks.length; i++) {
    if (okIdx.has(i)) continue;
    const w = toks[i][0].toLowerCase();
    if (set.has(w) && !allowSet.has(w)) hit.push(toks[i][0]);
  }
  return hit.length ? 'pseudo:' + code + '=' + JSON.stringify(hit.slice(0, 4).join(' ')) : null;
}

// —— ③ 排版 ——
function typo(s) {
  if (/[ \t]{2,}/.test(s)) return 'doublespace';
  if (/\s+([,.;:!?])/.test(s)) return 'spacebeforepunct';
  if (/([,.;:!?])\s*\1/.test(s)) return 'duppunct';
  if (/\(\s*\)|\[\s*\]/.test(s)) return 'emptybracket';
  // 引号：成对且不得相邻重复（`"the "X""` 这类双层引号=漏事实）
  const qs = s.match(/["“”]/g);
  if (qs) {
    if (qs.length % 2) return 'oddequote';
    if (/"["“”]/.test(s)) return 'dupquote';
  }
  if (/[,;:]$/.test(s.trim())) return 'edgepunct';
  if (/^[,.;:!?]/.test(s.trim())) return 'edgepunct';
  return null;
}

function main() {
  const argv = process.argv.slice(2);
  const file = argv.find((a) => !a.startsWith('-'));
  const ai = argv.indexOf('--allow');
  const allow = ai >= 0 ? argv[ai + 1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  const list = argv.includes('--list');
  const { items } = JSON.parse(fs.readFileSync(file, 'utf8'));
  const bad = [];
  for (const [id, t] of Object.entries(items)) {
    // 批次是增量语义（apply-multi 只覆盖出现的键），库内已有值就先取出来
    const fp = path.join(DATADIR, id + '.json');
    const cur = fs.existsSync(fp) ? ((JSON.parse(fs.readFileSync(fp, 'utf8')).title || {})) : {};
    const en = cur.en || '';
    for (const L of LANGS) {
      // 批次没写该语种就回落到库内既有值；两边都空才算空
      const s = t[L] || cur[L] || '';
      if (!s) { bad.push([id, L, 'empty']); continue; }
      const why = crossScript(L, s) || residue(L, s, allow) || pseudo(L, s, allow, en) || typo(s);
      if (why) bad.push([id, L, why]);
    }
  }
  const ids = new Set(bad.map((b) => b[0]));
  console.log('批次 ' + path.basename(file) + '：' + Object.keys(items).length + ' 条');
  console.log('  三项质检不合格：' + ids.size + ' 条 / ' + bad.length + ' 处');
  const grp = new Map();
  for (const [, L, w] of bad) {
    const k = w.split(':')[0] + ':' + L;
    grp.set(k, (grp.get(k) || 0) + 1);
  }
  [...grp.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('   ', k.padEnd(20), v));
  if (list) {
    const seen = new Set();
    for (const [id, L, w] of bad) {
      const k = id + L;
      if (seen.has(k)) continue;
      seen.add(k);
      console.log('  - ' + id + ' [' + L + '] ' + w);
    }
  }
  if (ids.size) {
    const bfile = file.replace(/\.json$/, '.badids.json');
    fs.writeFileSync(bfile, JSON.stringify([...ids], null, 1), 'utf8');
    console.log('  坏条清单 → ' + path.basename(bfile));
  }
  return ids;
}
if (require.main === module) main();
module.exports = { crossScript, residue, pseudo, typo, stripProper, loadLex };
