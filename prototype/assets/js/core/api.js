/* ==========================================================================
   CALR · 后端 API 适配层（Phase A）
   --------------------------------------------------------------------------
   作用：让现有静态 SPA 能在「静态数据」与「后端 API」两种数据源之间切换，
        而不改动各视图的调用方式。

   启用方式（三选一，优先级从高到低）：
     1) URL 参数     index.html?api=http://127.0.0.1:8000
     2) 全局变量     <script>window.CALR_API_BASE='http://...';</script>
     3) localStorage  localStorage.setItem('calr.apiBase','http://...')

   关闭（默认，纯静态）：
     不设置以上任何一项，或 ?api=0

   设计原则：
     · 后端不可用时**自动降级**到静态数据，不抛错、不白屏
     · 只做数据接入，不做业务逻辑（检索算法仍在 search.js）
     · 逐项迁移：Phase A 先接 stats / countries / laws / law 详情 与 search
   ========================================================================== */
(function (root) {
  'use strict';

  var CALR = root.CALR = root.CALR || {};
  var LS_KEY = 'calr.apiBase';

  function detectBase() {
    try {
      var m = /[?&]api=([^&#]*)/.exec(root.location ? root.location.search : '');
      if (m) {
        var v = decodeURIComponent(m[1]);
        if (v === '0' || v === 'false' || v === '') return null;
        if (v === '1' || v === 'true') return 'http://127.0.0.1:8000';
        return v.replace(/\/+$/, '');
      }
    } catch (e) {}
    if (root.CALR_API_BASE) return String(root.CALR_API_BASE).replace(/\/+$/, '');
    try {
      var ls = root.localStorage && root.localStorage.getItem(LS_KEY);
      if (ls) return String(ls).replace(/\/+$/, '');
    } catch (e) {}
    /* 同源自动识别：后端托管静态站时，页面本身就是从 http(s)://host:port 打开的，
       此时 /api/* 就在同源下，无需任何参数。
       file:// 打开时 origin 为 "null" 或 "file://"，保持纯静态模式（答辩兜底）。 */
    try {
      var loc = root.location || {};
      var proto = String(loc.protocol || '');
      var host = String(loc.host || '');
      if ((proto === 'http:' || proto === 'https:') && host) {
        return proto + '//' + host;
      }
    } catch (e) {}
    return null;
  }

  var BASE = detectBase();
  var HEALTH = { ok: null, checkedAt: 0 };

  /** 是否启用了后端 */
  function enabled() { return !!BASE; }
  function base() { return BASE; }

  /** 健康检查（带 30s 缓存）；失败返回 false，调用方据此降级 */
  function health() {
    if (!BASE) return Promise.resolve(false);
    var now = Date.now();
    if (HEALTH.ok !== null && now - HEALTH.checkedAt < 30000) return Promise.resolve(HEALTH.ok);
    return fetch(BASE + '/api/health', { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        HEALTH.ok = !!(j && j.ok);
        HEALTH.checkedAt = Date.now();
        if (HEALTH.ok && root.console) console.info('[CALR] 已连接后端：' + BASE);
        return HEALTH.ok;
      })
      .catch(function () {
        HEALTH.ok = false; HEALTH.checkedAt = Date.now();
        if (root.console) console.warn('[CALR] 后端不可用，降级为静态数据：' + BASE);
        return false;
      });
  }

  function get(path, params) {
    var qs = [];
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v === undefined || v === null || v === '') return;
      qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    var url = BASE + path + (qs.length ? (path.indexOf('?') >= 0 ? '&' : '?') + qs.join('&') : '');
    return fetch(url, { method: 'GET' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
      return r.json();
    });
  }

  function post(path, body) {
    return fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
      return r.json();
    });
  }

  var api = {
    enabled: enabled,
    base: base,
    health: health,

    /* ---- 数据源切换说明：以下方法返回 Promise；调用方需自行降级 ---- */
    stats: function () { return get('/api/stats'); },
    /* 首屏元数据（统计/国别/层级/主题/语言）：约 2.7 KB，替代 15.9 MB 的 intl-catalog.js */
    bootstrap: function () { return get('/api/bootstrap'); },
    /* 轻量法规列表：只含列表页需要的字段，供后台补齐全量法规 */
    lawsCompact: function (opt) { return get('/api/laws/compact', opt); },
    countries: function () { return get('/api/countries'); },
    laws: function (opt) { return get('/api/laws', opt); },
    law: function (id) { return get('/api/laws/' + encodeURIComponent(id)); },
    articles: function (id) { return get('/api/laws/' + encodeURIComponent(id) + '/articles'); },
    search: function (opt) { return get('/api/search', opt); },
    searchArticles: function (q, id, limit) {
      return get('/api/search/articles', { q: q, law_id: id, limit: limit });
    },
    qa: function (body) { return post('/api/qa', body); }
  };

  CALR.api = api;

  if (root.console) {
    console.info('[CALR] 数据源：' + (BASE ? ('后端 ' + BASE) : '静态文件（默认）'));
  }
})(typeof window !== 'undefined' ? window : this);
