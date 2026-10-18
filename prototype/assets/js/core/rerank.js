/* ==========================================================================
   CALR · assets/js/core/rerank.js —— BYOK 重排（Day4 / B1）
   作用：检索给出 top N 候选条文后，用用户自己的模型判断「哪些真正能回答问题」，
         只保留被选中的，降低「词面命中但语义无关」的引用噪声。
   设计约束：
     · 只在用户已配置 API Key 时启用；未配置/调用失败 → 返回 null，调用方保持原序（不降级体验）
     · 不缓存、不落盘；候选条文按原文截断后发送，不额外上传数据库内容
     · 解析失败一律视为「重排不可用」，绝不猜测
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var rr = CALR.rerank = CALR.rerank || {};

  var MAX_CANDIDATES = 20;      /* 送进模型的候选上限 */
  var EXCERPT = 180;            /* 每条候选送出的正文长度 */
  var MAX_PICK = 3;             /* 最多保留几条 */

  function trim(s, n) {
    s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  function buildPrompt(question, cands) {
    var lines = [];
    lines.push('你是法律检索结果裁判。下面有 ' + cands.length + ' 条候选法条，请判断哪些**真正能回答**用户问题。');
    lines.push('');
    lines.push('用户问题：' + question);
    lines.push('');
    lines.push('候选法条：');
    cands.forEach(function (c, i) {
      var head = [c.countryName, c.lawTitle, c.noLabel].filter(Boolean).join(' · ');
      lines.push('[' + (i + 1) + '] ' + head + '：' + trim(c.text, EXCERPT));
    });
    lines.push('');
    lines.push('要求：');
    lines.push('1. 只输出最能回答问题的条文编号，按相关性从高到低，最多 ' + MAX_PICK + ' 个，英文逗号分隔，例如：2,5,7');
    lines.push('2. 只依据候选法条判断，不要使用候补材料以外的知识');
    lines.push('3. 若没有任何一条能回答问题，只输出：NONE');
    lines.push('4. 不要输出任何解释文字');
    return lines.join('\n');
  }

  /** 解析模型输出 → 索引数组（0 基）；无法解析返回 null */
  function parsePick(text, n) {
    var s = String(text == null ? '' : text).trim();
    if (!s) return null;
    if (/^NONE\b/i.test(s)) return [];
    var nums = s.match(/\d{1,2}/g);
    if (!nums) return null;
    var out = [], seen = Object.create(null);
    for (var i = 0; i < nums.length && out.length < MAX_PICK; i++) {
      var k = parseInt(nums[i], 10);
      if (!(k >= 1 && k <= n)) continue;
      if (seen[k]) continue;
      seen[k] = 1;
      out.push(k - 1);
    }
    return out.length ? out : null;
  }

  /**
   * 重排候选条文
   * @param {string} question 用户问题
   * @param {Array}  candidates [{countryName, lawTitle, noLabel, text}, ...]
   * @param {object} opts { maxPick, timeoutMs, complete }  complete 仅用于测试注入
   * @returns {Promise<{picked:number[], order:number[], stats:object}|null>}
   */
  rr.rank = function (question, candidates, opts) {
    opts = opts || {};
    var cands = (candidates || []).slice(0, MAX_CANDIDATES);
    if (!cands.length) return Promise.resolve(null);

    var llm = CALR.llm;
    var cfg = llm && llm.config ? llm.config() : null;
    var injected = typeof opts.complete === 'function';
    var usable = injected || !!(cfg && cfg.apiKey && cfg.baseUrl && cfg.model && cfg.enabled);
    if (!usable) {
      return Promise.resolve(null);       /* 未配置 → 不重排，调用方保持原序 */
    }

    var messages = [
      { role: 'system', content: '你是严谨的法律检索结果裁判，只输出要求的编号，不作解释。' },
      { role: 'user', content: buildPrompt(question, cands) }
    ];

    var call = injected
      ? opts.complete(cfg, messages, opts)
      : llm.complete(cfg, messages, { temperature: 0, maxTokens: 24 });

    return Promise.resolve(call).then(function (res) {
      var text = '';
      if (typeof res === 'string') text = res;
      else if (res && typeof res.text === 'string') text = res.text;
      else if (res && res.choices && res.choices[0] && res.choices[0].message) text = res.choices[0].message.content || '';
      var picked = parsePick(text, cands.length);
      if (picked === null) return null;   /* 解析失败 → 视为不可用，不猜测 */
      if (!picked.length) {
        /* 模型判定「都不相关」：仍保留第 1 条，避免答案完全没有依据 */
        return { picked: [], order: cands.map(function (_, i) { return i; }), stats: { total: cands.length, picked: 0, note: 'model-none' } };
      }
      var rest = [];
      for (var i = 0; i < cands.length; i++) if (picked.indexOf(i) < 0) rest.push(i);
      return {
        picked: picked,
        order: picked.concat(rest),       /* 选中的排前，其余保持在后（供需要更多依据时回退） */
        stats: { total: cands.length, picked: picked.length, raw: trim(text, 40) }
      };
    }).catch(function () {
      return null;                        /* 任何失败都不影响主流程 */
    });
  };

  rr.parsePick = parsePick;
  rr.buildPrompt = buildPrompt;
  rr.MAX_CANDIDATES = MAX_CANDIDATES;
  rr.MAX_PICK = MAX_PICK;
})(typeof window !== 'undefined' ? window : this);
