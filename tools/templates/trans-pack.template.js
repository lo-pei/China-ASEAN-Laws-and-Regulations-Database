/* ==========================================================================
   CALR · 译文分卷「模板 + 示例」（本文件只是模板，不会被加载）
   --------------------------------------------------------------------------
   用法：
     1. 把本文件复制到  prototype/data/trans/<原分卷名>.<目标语言>.js
        例：prototype/data/trans/th-p01.zh.js   （把 th-p01 的泰文原文译成中文）
     2. 按下面的结构填写。删掉本注释块与示例条目。
     3. 在 prototype/data/trans/manifest.js 中登记：
          files[] 追加一项；byLaw{} 里为该 lawId 加上 { "<目标语言>": "<分卷名>" }
     4. node --check prototype/data/trans/xxx.js
        node tools/verify-data.js          ← 必须「校验结果：全部通过」

   红线（详见 SKILL.md §6）：
     · 官方原文只存在 data/fulltext、data/cn、data/intl；本目录只放模型译文
     · sourceLang 必须与原文层的 language 完全一致
     · articles[].no 必须与原文条文一一对应，不得增删改号
     · 不得出现 ……、（略）、待补；不得写「AI 生成仅供参考」之类话术
   ========================================================================== */
(function (root) {
  'use strict';
  var TR = root.CALR_TRANS = root.CALR_TRANS || {};

  /* ---------- 示例：把泰文《专利法》译成中文 ---------- */
  /* 原文位于 data/intl/th-p01.js → CALR_FULLTEXT['TH-H001']，language: 'th' */
  TR['TH-H001'] = {
    lawId: 'TH-H001',                    // 与键一致
    sourceLang: 'th',                    // 必须 === 原文层该法规的 language
    targetLang: 'zh',                    // 本卷的目标语言
    engine: 'llm',                       // llm | mt | human
    model: 'deepseek-chat',              // 实际使用的模型
    promptVersion: 'calr-trans-v1',      // 提示词版本，便于日后重译比对
    translatedAt: '2026-10-06',          // YYYY-MM-DD
    reviewed: 'machine',                 // machine | hybrid | human
    glossaryVersion: '2026-10',          // 使用的术语表版本（选填）
    completenessNote: '全篇逐条对译，共 3 条；条号与原文一一对应。',
    articles: [
      {
        no: 1,                           // ★ 必须与原文条文的 no 完全相同
        noLabel: { zh: '第一条' },        // 译文的条号写法
        heading: { zh: '定义' },          // 原文有标题才写；没有就删掉本行
        text: { zh: '在本法中，除上下文另有所指外——' }   // ★ 键必须是 targetLang
      },
      {
        no: 2,
        noLabel: { zh: '第二条' },
        text: { zh: '……完整译文，逐字对应，不得省略……' }
      },
      {
        no: 3,
        noLabel: { zh: '第三条' },
        text: { zh: '……' }
      }
    ]
  };

  /* ---------- 同一卷可以有第二部法规 ---------- */
  /* TR['TH-H002'] = { … }; */

})(typeof window !== 'undefined' ? window : globalThis);
