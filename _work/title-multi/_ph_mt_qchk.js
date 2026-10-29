/* ==========================================================================
   _ph_mt_qchk.js —— 专供 PH 机翻产物的质检
   
   为什么不用 _ph_qchk.js：
     那是为「人工逐条译」设计的，靠本族词表判英文残留。机翻产物里
     越南语「ngã rẽ」「chôn cất」、印尼语「satu juta dolar」都不在词表里，
     一个批次就报二十多条误报，压不住真正的错误。
   
   这里只保留**机器能确证**的四类硬伤：
     ① 跨文字污染：th 里出现汉字/西里尔/阿拉伯，或 vi/id/ms 里出现汉字/泰文
     ② 残句崩坏：出现「空格 逗号 空格」「连续逗号」这类专名被删后留下的空洞
     ③ 区划通名没译：id/ms/vi/th 里仍留 Municipality / Province / City / Barangay
     ④ 长度失控：超过原文 1.6 倍或短于 0.15 倍
   
   用法：node _ph_mt_qchk.js <批次JSON>
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWS = path.join(ROOT, 'prototype/data/laws');
const SRC = process.argv[2];
const LIST = process.argv.includes('--list');
if (!SRC) { console.error('用法：node _ph_mt_qchk.js <批次JSON>'); process.exit(1); }

const doc = JSON.parse(fs.readFileSync(path.resolve(SRC), 'utf8'));
const items = doc.items || doc;

const CJK = /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af]/;
const THAI = /[\u0e00-\u0e7f]/;
const CYR = /[\u0400-\u04ff]/;
const ARAB = /[\u0600-\u06ff\u0750-\u077f]/;
const KHMER = /[\u1780-\u17ff]/;

// Barangay 在 vi/id/ms/th 里本就是通行写法（提示词也要求保留），不算漏译故排除；
// 只抓 Municipality / Province / City / Region 这类必须换词的区划通名。
const REGION_EN = /\b(Municipality|Province|City|Region|Sub-?Province|Municipal\s+District)\b/;

const errs = [];
function err(id, lang, kind, detail) { errs.push({ id, lang, kind, detail }); }

for (const [id, rec] of Object.entries(items)) {
  const law = JSON.parse(fs.readFileSync(path.join(LAWS, id + '.json'), 'utf8'));
  const t = law.title || {};
  const en = String(t.en || t.orig || '');

  for (const lang of ['zh', 'vi', 'th', 'id', 'ms']) {
    let s = String(rec[lang] || '').trim();
    if (!s) { err(id, lang, 'empty', '空'); continue; }

    // ① 跨文字污染
    if (lang === 'th') {
      if (CJK.test(s)) err(id, lang, 'cross', '含汉字：' + s.match(CJK)[0]);
      if (CYR.test(s)) err(id, lang, 'cross', '含西里尔：' + s.match(CYR)[0]);
      if (ARAB.test(s)) err(id, lang, 'cross', '含阿拉伯：' + s.match(ARAB)[0]);
      if (KHMER.test(s)) err(id, lang, 'cross', '含高棉：' + s.match(KHMER)[0]);
    } else if (['vi', 'id', 'ms'].includes(lang)) {
      if (CJK.test(s)) err(id, lang, 'cross', '含汉字：' + s.match(CJK)[0]);
      if (THAI.test(s)) err(id, lang, 'cross', '含泰文：' + s.match(THAI)[0]);
    } else if (lang === 'zh') {
      if (THAI.test(s)) err(id, lang, 'cross', '含泰文：' + s.match(THAI)[0]);
    }
    if (/\uFFFD/.test(s)) err(id, lang, 'cross', '含替换字符 U+FFFD');

    // ② 残句崩坏：专名被整段删掉后留下的空洞
    // 中文没有拉丁实词，下面这条只适用于 vi/id/ms
    if (lang !== 'th' && lang !== 'zh') {
      if (/\s,\s|,\s*,|,\s*\.|\s,\./.test(s)) {
        err(id, lang, 'broken', '空洞：' + (s.match(/.{0,22}(\s,\s|,\s*,).{0,18}/) || [''])[0].trim());
      }
      // 只剩虚词的残句：整条里实词（≥3 字母且非虚词）少于 2
      const STOPS = new Set(['dan', 'yang', 'di', 'dari', 'ke', 'untuk', 'bagi', 'dengan', 'atau', 'serta',
        'pada', 'dalam', 'akan', 'telah', 'oleh', 'ini', 'itu', 'sebagai', 'secara', 'sampai', 'hingga',
        'va', 'và', 'của', 'tại', 'đến', 'từ', 'cho', 'các', 'những', 'là', 'theo', 'trong', 'với',
        'dan', 'kepada', 'bagi', 'antara', 'melalui', 'serta']);
      const words = (s.match(/[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]{3,}/g) || [])
        .filter((w) => !STOPS.has(w.toLowerCase()));
      if (words.length < 2 && en.replace(/[^A-Za-z]/g, '').length > 40 && !/\d/.test(s)) {
        err(id, lang, 'broken', '实词不足：' + s.slice(0, 50));
      }
    }

    // ③ 区划通名未译
    if (lang !== 'zh') {
      const m = s.match(REGION_EN);
      if (m) err(id, lang, 'region', '未译区划通名：' + m[0]);
    }

    // ④ 长度失控（泰语连写，按字符数比例放宽）
    const ratio = s.length / Math.max(1, en.length);
    if (ratio > 1.6 || ratio < 0.15) err(id, lang, 'length', '长度比 ' + ratio.toFixed(2));
  }
}

const byKind = {};
for (const e of errs) byKind[e.kind] = (byKind[e.kind] || 0) + 1;
const badIds = [...new Set(errs.map((e) => e.id))];
console.log(`批次 ${path.basename(SRC)}：${Object.keys(items).length} 条
  不合格 ${badIds.length} 条 / ${errs.length} 处  ${JSON.stringify(byKind)}`);
if (LIST) for (const e of errs.slice(0, 60)) console.log(`  - ${e.id} [${e.lang}] ${e.kind}：${e.detail}`);
fs.writeFileSync(path.resolve(SRC).replace(/\.json$/, '.mtbad.json'), JSON.stringify(badIds, null, 0));
if (badIds.length) {
  console.log('  坏条清单 → ' + path.basename(SRC).replace(/\.json$/, '.mtbad.json'));
  process.exitCode = 1;
}
