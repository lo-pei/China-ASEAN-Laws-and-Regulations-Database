/* ==========================================================================
   CALR · core/i18n.js —— 界面多语种（以中文原文为键，缺失回退中文）
   译文表位于 prototype/data/i18n.js（window.CALR_I18N）
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};

  var STORE_KEY = 'calr.lang';

  /** 界面支持语言（顺序即切换菜单顺序） */
  var LANGS = [
    { code: 'zh', label: '中文', native: '中文' },
    { code: 'en', label: '英语', native: 'English' },
    { code: 'vi', label: '越南语', native: 'Tiếng Việt' },
    { code: 'th', label: '泰语', native: 'ไทย' },
    { code: 'id', label: '印尼语', native: 'Bahasa Indonesia' },
    { code: 'ms', label: '马来语', native: 'Bahasa Melayu' }
  ];

  var current = 'zh';
  try {
    var saved = root.localStorage && root.localStorage.getItem(STORE_KEY);
    if (saved && LANGS.some(function (l) { return l.code === saved; })) current = saved;
  } catch (e) { /* file:// 下 localStorage 可能不可用 */ }

  var listeners = [];

  var i18n = {
    langs: function () { return LANGS.slice(); },
    lang: function () { return current; },
    langInfo: function (code) {
      var hit = LANGS.filter(function (l) { return l.code === (code || current); })[0];
      return hit || LANGS[0];
    },
    setLang: function (code) {
      if (!LANGS.some(function (l) { return l.code === code; })) return;
      current = code;
      /* 界面语言包按需加载：非中文且该语言的包还没合并进来时，先注入。
         注入完成后 loader 会调 CALR_I18N_MERGE 并再次触发 setLang，完成重渲染。 */
      if (code !== 'zh' && root.__CALR_ENSURE_LANG &&
          !((root.CALR_I18N || {})[code])) {
        try { root.__CALR_ENSURE_LANG(code); } catch (e) { /* 忽略 */ }
      }
      try { root.localStorage && root.localStorage.setItem(STORE_KEY, code); } catch (e) { /* 忽略 */ }
      document.documentElement.setAttribute('lang', code === 'zh' ? 'zh-CN' : code);
      document.documentElement.setAttribute('data-ui-lang', code);
      listeners.forEach(function (fn) { try { fn(code); } catch (e) { /* 忽略 */ } });
    },
    onChange: function (fn) { listeners.push(fn); },

    /** 译文查表：当前语言 → 英语 → 中文原文 */
    t: function (key) {
      var table = (root.CALR_I18N || {});
      if (current === 'zh') return key;
      var cur = table[current] || {};
      if (cur[key]) return cur[key];
      var en = table.en || {};
      if (en[key]) return en[key];
      return key;
    },

    /** 取多语言数据字段（法规标题、国家名、术语…） */
    field: function (field) {
      if (CALR.util && CALR.util.tr) return CALR.util.tr(field, current);
      if (typeof field === 'string') return field;
      return field ? (field[current] || field.zh || field.en || '') : '';
    },

    /** 语言代码的中文名 */
    name: function (code) {
      var hit = LANGS.filter(function (l) { return l.code === code; })[0];
      return hit ? hit.label : code;
    },
    nativeName: function (code) {
      var hit = LANGS.filter(function (l) { return l.code === code; })[0];
      return hit ? hit.native : code;
    }
  };

  CALR.i18n = i18n;
  /** 全局简写：t('中文原文') */
  root.t = function (k) { return i18n.t(k); };
})(typeof window !== 'undefined' ? window : globalThis);
