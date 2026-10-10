/* ==========================================================================
   CALR · app.js —— 应用外壳：顶栏、页脚、路由分发、主题与语言
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };
  var t = function (k) { return CALR.i18n.t(k); };

  var THEME_KEY = 'calr.theme';        /* 'light' | 'dark' */
  /* 外观仅保留浅色 / 深色；图标为线条风格，风格统一、克制 */
  var THEME_ICON = {
    light: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>',
    dark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/></svg>'
  };
  var THEME_LABEL = { light: '浅色', dark: '深色' };

  /* 顶部导航：仅保留 主页 / 法律检索 / AI 智能查询 */
  var NAV = [
    { path: '/', label: '主页', view: 'home' },
    { path: '/search', label: '法律检索', view: 'search' },
    { path: '/assistant', label: 'AI 智能查询', view: 'assistant' }
  ];

  /* 页脚：中国官方数据库 */
  var CN_PORTALS = [
    { zh: '国家法律法规数据库', en: 'National Laws and Regulations Database', url: 'https://flk.npc.gov.cn/' }
  ];

  /* 页脚：东盟各国官方数据库（分两列，顺序固定以保证各国名称稳定） */
  var ASEAN_COL1 = ['BN', 'KH', 'ID', 'LA', 'MY'];
  var ASEAN_COL2 = ['MM', 'PH', 'SG', 'TH', 'VN', 'TL'];

  /* 页脚：东盟条约与区域机制官网 */
  var REGIONAL_LINKS = [
    { zh: '东盟秘书处', en: 'ASEAN Secretariat', url: 'https://asean.org/' },
    { zh: '东盟法律文书数据库', en: 'ASEAN Legal Instruments Database', url: 'https://asean.org/legal-instruments-database/' },
    { zh: '东盟协定数据库', en: 'ASEAN Agreements Database', url: 'https://agreement.asean.org/' },
    { zh: '中国—东盟中心', en: 'ASEAN-China Centre', url: 'https://www.asean-china-center.org/' },
    { zh: 'RCEP 秘书处', en: 'RCEP Secretariat', url: 'https://rcepsec.org/' },
    { zh: '中国—东盟自贸区', en: 'China–ASEAN Free Trade Area', url: 'https://fta.mofcom.gov.cn/' }
  ];

  /* 页脚：本站链接 */
  var SITE_LINKS = [
    { zh: '关于我们', en: 'About Us', url: '#/about' },
    { zh: '数据来源', en: 'Data Sources', url: '#/sources' },
    { zh: '法律体系', en: 'Legal Systems', url: '#/systems' },
    { zh: '使用条款', en: 'Terms of Use', url: '#/about?tab=terms' },
    { zh: '隐私政策', en: 'Privacy Policy', url: '#/about?tab=privacy' },
    { zh: '免责声明', en: 'Disclaimer', url: '#/about?tab=statement' }
  ];

  /* 页脚联系方式 */
  var FOOTER_EMAIL = 'carl_kent26@163.com';

  /* 兼容旧接口：友情链接 = 中国官方 + 区域机制官网 */
  var FRIEND_LINKS = CN_PORTALS.concat(REGIONAL_LINKS);

  /** 主题模式：仅浅色 / 深色（历史遗留的 system 会在启动时解析为实际值） */
  function themeMode() {
    var v = 'light';
    try { v = (root.localStorage && root.localStorage.getItem(THEME_KEY)) || 'light'; } catch (e) { /* 忽略 */ }
    if (v === 'dark') return 'dark';
    if (v === 'system') {
      var mq = root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)');
      return (mq && mq.matches) ? 'dark' : 'light';
    }
    return 'light';
  }

  function resolvedTheme() { return themeMode(); }

  function applyTheme() {
    var m = themeMode();
    document.documentElement.setAttribute('data-theme', m);
    document.documentElement.setAttribute('data-theme-mode', m);
  }

  function brandTitle() { return t('中国—东盟法律法规数据库'); }

  function renderHeader() {
    var host = U().$('#app-header');
    if (!host) return;
    var cur = CALR.router.current();
    var mode = themeMode();
    host.className = 'app-header';
    host.innerHTML =
      '<div class="app-header__inner">' +
        '<a class="brand" href="#/" aria-label="' + U().attr(brandTitle()) + '">' +
          '<span class="brand__logo" aria-hidden="true">CALR</span>' +
          '<span class="brand__text">' +
            '<span class="brand__name" title="' + U().attr(brandTitle()) + '">' + U().esc(brandTitle()) + '</span>' +
          '</span>' +
        '</a>' +
        '<nav class="nav" id="main-nav" aria-label="' + U().attr(t('主导航')) + '">' + NAV.map(function (n) {
          var active = cur.view === n.view;
          return '<a class="nav__item' + (active ? ' is-active' : '') + '" href="#' + n.path + '">' + U().esc(t(n.label)) + '</a>';
        }).join('') + '</nav>' +
        '<div class="header__tools">' +
          '<button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-label="' + U().attr(t('展开导航')) + '">' + CALR.ui.icon('menu') + '</button>' +
          '<label class="sr-only" for="ui-lang">' + U().esc(t('界面语言')) + '</label>' +
          '<select class="select lang-select" id="ui-lang" title="' + U().attr(t('界面语言')) + '">' +
            CALR.i18n.langs().map(function (l) {
              return '<option value="' + U().esc(l.code) + '"' + (l.code === CALR.i18n.lang() ? ' selected' : '') + '>' + U().esc(l.native) + '</option>';
            }).join('') +
          '</select>' +
          /* 外观切换：单击在 浅色 ⇄ 深色 之间切换 */
          '<button class="icon-btn" id="theme-btn" type="button" ' +
            'title="' + U().attr(t('外观') + '：' + t(THEME_LABEL[mode])) + '" ' +
            'aria-label="' + U().attr(t('外观') + '：' + t(THEME_LABEL[mode])) + '">' +
            THEME_ICON[mode] + '</button>' +
        '</div>' +
      '</div>';

    U().on(U().$('#ui-lang', host), 'change', function (e) { CALR.i18n.setLang(e.target.value); });

    /* 单击循环切换外观：浅色 → 深色 → 跟随系统 → 浅色 */
    U().on(U().$('#theme-btn', host), 'click', cycleTheme);

    var toggle = U().$('#nav-toggle', host);
    var nav = U().$('#main-nav', host);
    U().on(toggle, 'click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    U().on(nav, 'click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function extIcon() {
    return '<svg class="ext-icon" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">' +
      '<path d="M9 1h6v6h-2V4.4L7.7 9.7 6.3 8.3 11.6 3H9V1z" fill="currentColor"/>' +
      '<path d="M2 3h5v2H4v7h7V9h2v6H2V3z" fill="currentColor"/></svg>';
  }

  /** 取某法域的官方门户链接（来自数据集 country.sources） */
  function countryPortals(code) {
    var c = S().country(code);
    if (!c || !c.sources) return [];
    return c.sources.map(function (s) {
      var raw = (typeof s.name === 'string' ? s.name : (s.name && (s.name.zh || s.name.en))) || code;
      var name = CALR.ui.portalLabel ? CALR.ui.portalLabel(s.url, raw) : raw;
      return { zh: name, en: name, url: s.url };
    });
  }

  /** 友情链接：按数量平均分布到三列（不按国家标题分组） */
  function footerLinks(links) {
    return '<ul class="footer__list footer__links footer__links--even">' +
      links.map(function (l) {
        var ext = /^https?:/i.test(l.url);
        var label = CALR.i18n.lang() === 'zh' ? (l.zh || l.en) : (l.en || l.zh);
        return '<li><a href="' + U().attr(l.url) + '"' +
          (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
          U().esc(label) + (ext ? ' ' + extIcon() : '') + '</a></li>';
      }).join('') + '</ul>';
  }

  function renderFooter() {
    var host = U().$('#app-footer');
    if (!host) return;
    host.className = 'app-footer';

    /* 东盟各国官方门户：按固定顺序展平 */
    var asean = [];
    ASEAN_COL1.concat(ASEAN_COL2).forEach(function (c) { asean = asean.concat(countryPortals(c)); });
    /* 菲律宾已有 LawPhil，去掉官方公报重复项，控制页脚长度 */
    asean = asean.filter(function (l) { return String(l.url).indexOf('officialgazette.gov.ph') < 0; });
    /* 全部友情链接按顺序汇成一条流：中国 → 东盟各国 → 东盟条约与区域机制 */
    var all = CN_PORTALS.concat(asean, REGIONAL_LINKS);

    host.innerHTML =
      '<div class="container">' +
        '<div class="footer__main">' +
          '<div class="footer__brand">' +
            '<div class="footer__brandtitle">' + U().esc(t('中国—东盟法律法规数据库')) + '</div>' +
            '<p class="footer__branddesc">' +
              U().esc(t('面向东盟十一国与中国共十二个法域的法律法规检索平台，提供法规查询、跨语言条款比对与法律术语对照。')) +
            '</p>' +
            '<div class="footer__contact">' +
              '<span class="footer__contactlabel">' + U().esc(t('联系方式')) + '</span>' +
              '<a href="mailto:' + U().attr(FOOTER_EMAIL) + '">' + U().esc(FOOTER_EMAIL) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__friend">' +
            '<div class="footer__friendhead">' + U().esc(t('友情链接')) + '</div>' +
            footerLinks(all) +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span>© 2026 ' + U().esc(t('中国—东盟法律法规数据库（CALR）')) + '　' + U().esc(t('版权所有')) + '</span>' +
          '<span>' + U().esc(t('法规文本以各国官方公布版本为准')) + '</span>' +
        '</div>' +
      '</div>';
  }

  function setThemeMode(mode) {
    if (['light', 'dark'].indexOf(mode) < 0) return;
    try { root.localStorage && root.localStorage.setItem(THEME_KEY, mode); } catch (e) { /* 忽略 */ }
    applyTheme();
  }
  /** 单击在浅色 / 深色之间切换 */
  function cycleTheme() {
    setThemeMode(themeMode() === 'dark' ? 'light' : 'dark');
    renderHeader();
  }
  function toggleTheme() { cycleTheme(); }

  function dataWarning() {
    var st = S().stats();
    if (st.laws > 0) return '';
    return '<div class="banner banner--warn" style="margin:16px 0"><span class="banner__icon">' + CALR.ui.icon('alert') + '</span><div>' +
      U().esc(t('未检测到数据集：请确认 data 目录下的数据文件与本页面一同部署。')) +
      '</div></div>';
  }

  function dispatch(cur, opts) {
    var main = U().$('#main');
    if (!main) return;
    if (cur.view !== 'law') document.documentElement.removeAttribute('data-fontsize');
    U().closeModal();
  /* S11 修复：移动端筛选抽屉会给 body 加 no-scroll；抽屉随旧 DOM 被移除后必须一并复位，
     否则 body{overflow:hidden} 会永久生效，整页（含结果列表）无法滚动，只能刷新页面。 */
  if (root.document && root.document.body) root.document.body.classList.remove('no-scroll');
    var view = CALR.views[cur.view] || CALR.views.notfound;
    U().$$('.reader-bar').forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
    U().$$('.term-pop').forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
    if ('speechSynthesis' in root) { try { root.speechSynthesis.cancel(); } catch (e) { /* 忽略 */ } }
    var warn = dataWarning();
    view.render(main, cur.params, cur.query);
    if (warn) main.insertAdjacentHTML('afterbegin', warn);
    if (opts && opts.silent) {
      U().$$('.page', main).forEach(function (el) { el.style.animation = 'none'; });
    }
    renderHeader();
    renderFooter();
  }

  var app = {
    toggleTheme: toggleTheme,
    cycleTheme: cycleTheme,
    setThemeMode: setThemeMode,
    themeMode: themeMode,
    resolvedTheme: resolvedTheme,
    friendLinks: function () { return FRIEND_LINKS.slice(); },
    /* 右下角「回到顶部」：下滚超过一屏后显现，点击平滑回顶 */
    initBackToTop: function () {
      var doc = root.document;
      if (!doc || doc.getElementById('to-top')) return;
      var btn = doc.createElement('button');
      btn.id = 'to-top';
      btn.className = 'to-top';
      btn.type = 'button';
      btn.setAttribute('aria-label', t('回到顶部'));
      btn.title = t('回到顶部');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
        'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
      doc.body.appendChild(btn);

      var shown = false;
      function onScroll() {
        var y = root.pageYOffset || doc.documentElement.scrollTop || 0;
        var on = y > 400;
        if (on === shown) return;
        shown = on;
        btn.classList.toggle('is-on', on);
      }
      /* 直接响应 scroll：onScroll 内部已做「状态未变则返回」，开销极小，
         不必再套 requestAnimationFrame —— 后者在部分环境（无渲染帧时）不触发，会漏更新。 */
      root.addEventListener('scroll', onScroll, { passive: true });
      root.addEventListener('resize', onScroll, { passive: true });
      if (root.document && root.document.addEventListener) {
        root.document.addEventListener('CALR:rendered', onScroll);
      }
      btn.addEventListener('click', function () {
        try { root.scrollTo({ top: 0, behavior: 'smooth' }); }
        catch (e) { root.scrollTo(0, 0); }
        onScroll();
      });
      onScroll();
    },

    refresh: function () { dispatch(CALR.router.current(), { silent: true }); },
    boot: function () {
      /* 支持通过 ?theme=dark|light 深链指定外观；历史值 system 解析为实际明暗 */
      var tm = (root.location && root.location.search || '').match(/[?&]theme=(light|dark|system)/i);
      if (tm) {
        var v = tm[1].toLowerCase();
        if (v === 'system') {
          var mq0 = root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)');
          v = (mq0 && mq0.matches) ? 'dark' : 'light';
        }
        try { root.localStorage && root.localStorage.setItem(THEME_KEY, v); } catch (e) { /* 忽略 */ }
      }
      applyTheme();
      /* 支持通过 ?lang=xx 深链指定界面语言 */
      var lm = (root.location && root.location.search || '').match(/[?&]lang=([A-Za-z-]+)/);
      if (lm) CALR.i18n.setLang(lm[1].toLowerCase());
      /* 静态 HTML 里的「跳到主内容」在语言确定后再写入 */
      var skip = root.document && root.document.querySelector('.skip-link');
      if (skip) skip.textContent = t('跳到主内容');
      var st = S().init();
      renderHeader();
      renderFooter();
      CALR.app.initBackToTop();

      CALR.router.onChange(dispatch);
      CALR.i18n.onChange(function () { dispatch(CALR.router.current(), { silent: true }); });

      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''))) {
          var box = U().$('#hero-q') || U().$('#s-q');
          if (box) { e.preventDefault(); box.focus(); }
        }
      });

      CALR.router.start();

      /* 渐进加载法规全文：每载入一个分卷即重建索引并静默刷新当前页面 */
      if (CALR.fulltext) {
        var refreshTimer = null;
        function scheduleRefresh() {
          if (refreshTimer) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(function () {
            S().init();
            dispatch(CALR.router.current(), { silent: true });
          }, 450);
        }
        CALR.fulltext.loadAll(scheduleRefresh).then(function (res) {
          var loadedCount = (res && res.loaded) ? res.loaded.length : 0;
          if (!loadedCount) return;
          if (refreshTimer) clearTimeout(refreshTimer);
          S().init();
          dispatch(CALR.router.current(), { silent: true });
        });
      }

      if (root.console) {
        console.log('%cCALR', 'color:#2B6CB0;font-weight:bold',
          '\n法域：' + st.countries.length + ' ｜ 法规：' + st.laws.length + ' ｜ 条文：' + st.articlesTotal);
      }
    }
  };

  CALR.app = app;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', app.boot);
  else app.boot();
})(typeof window !== 'undefined' ? window : globalThis);
