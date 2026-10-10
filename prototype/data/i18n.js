/* ==========================================================================
   CALR · 界面多语种译文表（以中文原文为键）
   各语言条目由 data/i18n-<code>.js 提供，本文件负责合并；
   缺失的键在运行时自动回退中文原文，因此译文可增量补充。
   ========================================================================== */
(function (root) {
  'use strict';
  var table = {};
  var sources = {
    en: root.CALR_I18N_EN,
    vi: root.CALR_I18N_VI,
    th: root.CALR_I18N_TH,
    id: root.CALR_I18N_ID,
    ms: root.CALR_I18N_MS
  };
  Object.keys(sources).forEach(function (code) {
    if (sources[code] && typeof sources[code] === 'object') table[code] = sources[code];
  });
  /* 兼容单文件写法：若外部已直接定义 CALR_I18N，则与其合并（语言文件优先） */
  root.CALR_I18N = Object.assign({}, root.CALR_I18N || {}, table);
})(typeof window !== 'undefined' ? window : globalThis);
