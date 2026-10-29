/* ==========================================================================
   CALR · core/router.js —— 哈希路由
   路由表见 docs/00-项目基线.md 第 3 节
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };

  var routes = [
    { path: '/', view: 'home' },
    { path: '/search', view: 'search' },
    { path: '/systems', view: 'systems' },
    { path: '/country', view: 'country', param: 1 },
    { path: '/law', view: 'law', param: 1 },
    { path: '/treaty', view: 'treatyDetail', param: 1 },
    { path: '/assistant', view: 'assistant' },
    { path: '/about', view: 'about' },
    { path: '/sources', view: 'sources' }
  ];

  function parse(hash) {
    var h = String(hash || '').replace(/^#/, '');
    if (!h) h = '/';
    var qi = h.indexOf('?');
    var path = qi < 0 ? h : h.slice(0, qi);
    var query = U().query(qi < 0 ? '' : h.slice(qi + 1));
    if (path.length > 1 && path.slice(-1) === '/') path = path.slice(0, -1);
    var segs = path.split('/').filter(Boolean);

    var matched = null;
    routes.forEach(function (r) {
      if (matched) return;
      var rSegs = r.path.split('/').filter(Boolean);
      if (r.param) {
        if (segs.length >= rSegs.length + r.param && segs.slice(0, rSegs.length).join('/') === rSegs.join('/')) {
          matched = { view: r.view, params: segs.slice(rSegs.length, rSegs.length + r.param) };
        }
      } else if (segs.length === rSegs.length) {
        var ok = rSegs.every(function (s, i) { return s === segs[i]; });
        if (ok) matched = { view: r.view, params: [] };
      }
    });

    if (!matched) matched = { view: 'notfound', params: [] };
    return { path: path, query: query, view: matched.view, params: matched.params, raw: h };
  }

  var current = parse(location.hash);
  var listeners = [];

  function onChange(fn) { listeners.push(fn); }

  function handle() {
    var prev = current;
    current = parse(location.hash);
    var sameView = prev && prev.view === current.view && prev.path === current.path;
    listeners.forEach(function (fn) {
      try { fn(current, { sameView: sameView, prev: prev }); } catch (e) {
        if (root.console) console.error('[CALR] 视图渲染失败', e);
        var main = U().$('#main');
        if (main) {
          main.innerHTML = '<div class="empty"><div class="empty__icon">' + CALR.ui.icon('alert') + '</div><div class="empty__title">页面渲染出现异常</div>' +
            '<p class="small">' + U().esc(e && e.message ? e.message : String(e)) + '</p>' +
            '<p><a class="btn btn--outline" href="#/">返回首页</a></p></div>';
        }
      }
    });
    if (!sameView) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  var router = {
    parse: parse,
    current: function () { return current; },
    go: function (path) {
      var target = String(path || '/');
      if (target.charAt(0) !== '#') target = '#' + (target.charAt(0) === '/' ? target : '/' + target);
      if (location.hash === target) handle();
      else location.hash = target;
    },
    replace: function (path) {
      var target = String(path || '/');
      if (target.charAt(0) !== '#') target = '#' + (target.charAt(0) === '/' ? target : '/' + target);
      location.replace(location.pathname + location.search + target);
    },
    onChange: onChange,
    start: function () {
      window.addEventListener('hashchange', handle);
      handle();
    },
    buildUrl: function (path, query) {
      var qs = U().toQuery(query);
      return '#' + path + (qs ? '?' + qs : '');
    }
  };

  CALR.router = router;
})(typeof window !== 'undefined' ? window : globalThis);
