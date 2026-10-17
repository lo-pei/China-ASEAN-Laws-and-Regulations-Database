/* ==========================================================================
   CALR · core/citation-check.js —— 生成答案的引用校验器（BYOK 护栏）

   背景：BYOK 模式下答案由**用户自选的模型**生成，质量不可控。
   本模块负责把「每条结论必须能溯源到本地库条文」这件事**由本项目代码保证**，
   而不是交给模型自觉。

   规则：
     1. 逐句扫描模型输出，抽取引用标记 [n] / [n][m] / ［n］
     2. 引用序号必须落在本次召回条文范围内，越界标记视同无引用
     3. 无有效引用的**实质句**一律剔除
     4. 明确的「材料不足」声明句允许无引用（这是正确的拒答行为）
     5. 保留下来的比例过低 → 判定校验不通过，调用方应降级为本地检索摘要
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};

  /* 允许无引用的句子：拒答声明 / 过渡语 / 纯标题 */
  var ALLOW_NO_REF = [
    /材料不足以回答/, /暂未收录/, /未检索到/, /无法(依据|根据)材料/,
    /以下(要点|结论)/, /^(综上|总之|说明|提示|注意)[:：]?$/,
    /^(根据|依据|按照)(上述|以上|前述)/,
    /^[①②③④⑤⑥⑦⑧⑨⑩\d.、\-—\s]{0,4}$/
  ];

  var REF_RE = /\[[\[［]?\s*(\d{1,2})\s*[\]］]?\]/g;
  var REF_RE2 = /［\s*(\d{1,2})\s*］/g;

  function splitSentences(t) {
    var out = [], buf = '', s = String(t || '');
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      buf += ch;
      if (ch === '。' || ch === '；' || ch === ';' || ch === '！' || ch === '!' || ch === '？' || ch === '?' || ch === '\n') {
        if (buf.trim()) out.push(buf.trim());
        buf = '';
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  /** 抽取一句里的引用序号（去重、保序） */
  function refsOf(sentence) {
    var out = [];
    var s = String(sentence || '');
    var m;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(s))) {
      var n = parseInt(m[1], 10);
      if (out.indexOf(n) < 0) out.push(n);
    }
    REF_RE2.lastIndex = 0;
    while ((m = REF_RE2.exec(s))) {
      var k = parseInt(m[1], 10);
      if (out.indexOf(k) < 0) out.push(k);
    }
    return out;
  }

  function allowedNoRef(s) {
    var t = String(s || '').trim();
    if (t.length <= 6) return true;
    for (var i = 0; i < ALLOW_NO_REF.length; i++) if (ALLOW_NO_REF[i].test(t)) return true;
    return false;
  }

  /**
   * 校验模型输出
   * @param text      模型原文
   * @param citations 本次召回的条文数组（长度 = 合法引用上限）
   * @param opts      { minKeepRatio: 0.5, minKept: 1 }
   * @returns { ok, cleanText, kept[], dropped[], usedRefs[], stats }
   */
  function verify(text, citations, opts) {
    opts = opts || {};
    var minKeep = typeof opts.minKeepRatio === 'number' ? opts.minKeepRatio : 0.6;
    var minKept = typeof opts.minKept === 'number' ? opts.minKept : 1;
    var n = (citations || []).length;

    /* 全角数字 / 全角方括号先归一化，避免模型输出「[１]」这类标记漏判 */
    var src = String(text || '')
      .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
      .replace(/［/g, '[').replace(/］/g, ']');

    var sents = splitSentences(src);
    var kept = [], dropped = [], usedRefs = [], invalidRefCount = 0;

    sents.forEach(function (s) {
      var raw = refsOf(s);
      var valid = raw.filter(function (x) { return x >= 1 && x <= n; });
      invalidRefCount += (raw.length - valid.length);

      if (!valid.length) {
        if (allowedNoRef(s)) {
          kept.push({ text: s, refs: [], noRefAllowed: true });
        } else {
          dropped.push({ text: s, reason: 'no-citation' });
        }
        return;
      }
      valid.forEach(function (x) { if (usedRefs.indexOf(x) < 0) usedRefs.push(x); });
      kept.push({ text: s, refs: valid });
    });

    usedRefs.sort(function (a, b) { return a - b; });

    var sub = sents.filter(function (s) { return !allowedNoRef(s); }).length;
    var substantiveKept = kept.filter(function (k) { return !k.noRefAllowed; }).length;
    var keepRatio = sub ? substantiveKept / sub : 0;

    var ok;
    if (substantiveKept === 0) {
      /* 全部是「材料不足以回答」这类合规拒答：有内容、无垃圾句即通过 */
      ok = kept.length > 0 && dropped.length === 0;
    } else {
      ok = substantiveKept >= minKept && keepRatio >= minKeep;
    }

    return {
      ok: ok,
      cleanText: kept.map(function (k) { return k.text; }).join(''),
      kept: kept,
      dropped: dropped,
      usedRefs: usedRefs,
      stats: {
        sentences: sents.length,
        substantive: sub,
        keptSubstantive: substantiveKept,
        droppedSentences: dropped.length,
        keepRatio: Math.round(keepRatio * 100) / 100,
        invalidRefs: invalidRefCount,
        citationPoolSize: n
      }
    };
  }

  /** 把召回条文格式化成 prompt 里的【条文材料】 */
  function materials(citations) {
    return (citations || []).map(function (c, i) {
      var head = '[' + (i + 1) + '] ' + (c.countryName || '') + '《' + (c.lawTitle || '') + '》' +
        (c.noLabel || '') + (c.heading ? '（' + c.heading + '）' : '');
      return head + '：' + String(c.fullText || c.excerpt || '').replace(/\s+/g, ' ').trim();
    }).join('\n');
  }

  CALR.citecheck = {
    verify: verify,
    materials: materials,
    splitSentences: splitSentences,
    refsOf: refsOf
  };
})(typeof window !== 'undefined' ? window : globalThis);
