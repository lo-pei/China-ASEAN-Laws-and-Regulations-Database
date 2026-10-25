/* ==========================================================================
   CALR · 产品解决方案 Demo · 交互脚本
   依赖：window.CALR_SOLUTION_DATA（assets/data/sample-laws.js，普通 script 引入）
   零外部依赖：不使用 fetch / XHR / 远程资源。
   ========================================================================== */
(function () {
  'use strict';

  var D = window.CALR_SOLUTION_DATA;
  var doc = document;
  var root = doc.documentElement;

  var LEVEL_LABEL = { law: '法律', code: '法典', regulation: '法规' };
  var TERM_SCENE = {
    '外商投资': '投资准入',
    '注册资本': '公司设立',
    '营业执照': '公司设立',
    '不可抗力': '合同履行',
    '仲裁裁决': '争议解决'
  };
  var NAV_OFFSET = 96;

  function $(id) { return doc.getElementById(id); }
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmtNum(n) {
    return Number(n).toLocaleString('en-US');
  }
  function prefersReduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function on(target, type, handler, opts) {
    if (target) target.addEventListener(type, handler, opts || false);
  }
  function revealAll() {
    var items = doc.querySelectorAll('.reveal');
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
  }

  /* ----------------------------------------------------------------------
     1. 数据驱动的数字（meta）—— 所有统计数字的唯一来源
     ---------------------------------------------------------------------- */
  function fillMeta() {
    if (!D || !D.meta) return;
    var meta = D.meta;
    var nodes = doc.querySelectorAll('[data-meta]');

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-meta');
      var value;

      if (key === 'sampleCount') {
        value = (D.laws && D.laws.length) || 0;
      } else {
        value = meta[key];
      }
      if (value === undefined || value === null || value === '') continue;

      var mode = node.getAttribute('data-format');
      if (mode === 'yi' && typeof value === 'number') {
        node.textContent = (value / 1e8).toFixed(2) + ' 亿';
      } else if (typeof value === 'number') {
        node.textContent = fmtNum(value);
      } else {
        node.textContent = String(value);
      }

      if (node.hasAttribute('data-counter') && typeof value === 'number') {
        node.setAttribute('data-target', String(value));
      }
    }
  }

  /* ----------------------------------------------------------------------
     2. Hero 数字滚动动画（IntersectionObserver + prefers-reduced-motion）
     ---------------------------------------------------------------------- */
  function initCounters() {
    var nodes = doc.querySelectorAll('[data-counter][data-target]');
    if (!nodes.length) return;

    function setFinal(node) {
      var target = Number(node.getAttribute('data-target')) || 0;
      node.textContent = fmtNum(target);
    }

    if (prefersReduced() || !('IntersectionObserver' in window) || !window.requestAnimationFrame) {
      for (var i = 0; i < nodes.length; i++) setFinal(nodes[i]);
      return;
    }

    function animate(node) {
      var target = Number(node.getAttribute('data-target')) || 0;
      var started = null;
      var duration = 1450;
      var done = false;

      function finish() {
        done = true;
        node.textContent = fmtNum(target);
      }

      function step(now) {
        if (done) return;
        if (started === null) started = now;
        var p = Math.min(1, (now - started) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = fmtNum(Math.round(target * eased));
        if (p < 1) {
          window.requestAnimationFrame(step);
        } else {
          finish();
        }
      }
      window.requestAnimationFrame(step);
      /* 兜底：标签页被节流或帧回调被挂起时，也一定落到最终值 */
      window.setTimeout(finish, duration + 160);
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animate(entries[i].target);
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.4 });

    for (var j = 0; j < nodes.length; j++) {
      setFinal(nodes[j]);
      io.observe(nodes[j]);
    }
  }

  /* ----------------------------------------------------------------------
     3. 进场动画 / 条形图启动
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = doc.querySelectorAll('.reveal');
    var bars = $('barChart');

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      revealAll();
      if (bars) bars.classList.add('is-in');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-in');
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    for (var j = 0; j < items.length; j++) io.observe(items[j]);
    if (bars) io.observe(bars);
  }

  /* ----------------------------------------------------------------------
     4. 顶部导航：阅读进度 / 当前章节高亮 / 移动端折叠
     ---------------------------------------------------------------------- */
  function initNav() {
    var nav = $('siteNav');
    var links = $('navLinks');
    var toggle = $('navToggle');
    var progress = $('navProgress');
    if (!nav) return;

    var anchors = links ? links.querySelectorAll('a[href^="#"]') : [];
    var sections = [];
    for (var i = 0; i < anchors.length; i++) {
      var id = anchors[i].getAttribute('href').slice(1);
      var section = $(id);
      if (section) sections.push({ id: id, el: section });
    }

    function setActive(id) {
      for (var k = 0; k < anchors.length; k++) {
        var isActive = anchors[k].getAttribute('href') === '#' + id;
        anchors[k].classList.toggle('is-active', isActive);
        if (isActive) {
          anchors[k].setAttribute('aria-current', 'true');
        } else {
          anchors[k].removeAttribute('aria-current');
        }
      }
    }

    function update() {
      var top = window.pageYOffset || doc.documentElement.scrollTop || 0;
      var height = doc.documentElement.scrollHeight - window.innerHeight;
      if (progress) {
        var ratio = height > 0 ? Math.min(1, Math.max(0, top / height)) : 0;
        progress.style.width = (ratio * 100).toFixed(2) + '%';
      }
      var current = '';
      for (var k = 0; k < sections.length; k++) {
        var rect = sections[k].el.getBoundingClientRect();
        if (rect.top - NAV_OFFSET <= 0) current = sections[k].id;
      }
      setActive(current);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '收起章节导航' : '打开章节导航');
      });

      for (var n = 0; n < anchors.length; n++) {
        anchors[n].addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', '打开章节导航');
        });
      }

      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }
  }

  /* ----------------------------------------------------------------------
     5. 产品演示 Tabs（点击 + 键盘 ←/→/Home/End）
     ---------------------------------------------------------------------- */
  function initTabs() {
    var tabs = doc.querySelectorAll('[role="tab"]');
    if (!tabs.length) return;

    var count = $('tourCount');
    var rail = doc.querySelector('[role="tablist"]');
    var mq = window.matchMedia ? window.matchMedia('(max-width: 980px)') : null;

    function setOrientation() {
      if (rail && mq) rail.setAttribute('aria-orientation', mq.matches ? 'horizontal' : 'vertical');
    }
    setOrientation();
    if (mq && mq.addEventListener) mq.addEventListener('change', setOrientation);

    function select(index, moveFocus) {
      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var panel = $(tab.getAttribute('aria-controls'));
        var active = i === index;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.setAttribute('tabindex', active ? '0' : '-1');
        if (panel) panel.hidden = !active;
      }
      if (count) {
        count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(tabs.length).padStart(2, '0');
      }
      if (moveFocus && tabs[index]) tabs[index].focus();
    }

    for (var i = 0; i < tabs.length; i++) {
      (function (index) {
        var tab = tabs[index];
        tab.addEventListener('click', function () { select(index, false); });
        tab.addEventListener('keydown', function (e) {
          var next = -1;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % tabs.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = tabs.length - 1;
          if (next < 0) return;
          e.preventDefault();
          select(next, true);
        });
      })(i);
    }
  }

  /* ----------------------------------------------------------------------
     6. 真实法条渲染：跨语言比对 / AI 问答 / 术语对照
     ---------------------------------------------------------------------- */
  function lawHref(id) {
    return '../prototype/index.html#/law/' + encodeURIComponent(String(id || ''));
  }

  function renderCompare() {
    var grid = $('compareGrid');
    var dimList = $('dimList');
    var data = D && D.compare;
    if (!grid || !data) return;

    var sides = [data.left, data.right];
    var langs = ['zh-CN', 'vi'];
    var html = '';

    for (var i = 0; i < sides.length; i++) {
      var side = sides[i];
      if (!side) continue;
      html += '<article class="clause">' +
        '<div class="clause-head">' +
          '<span class="clause-lang">' + esc(side.lang || '原文') + '</span>' +
          '<span class="clause-country">' + esc(side.country || '') + '</span>' +
        '</div>' +
        '<h4 class="clause-law">' + esc(side.lawTitle || '') + '</h4>' +
        '<p class="clause-no">' + esc(side.noLabel || '') + '</p>' +
        '<blockquote class="clause-text" lang="' + langs[i] + '">' + esc(side.text || '') + '</blockquote>' +
        '<p class="clause-source">来源：' + esc(side.source || '') +
          ' · <a href="' + lawHref(side.lawId) + '">在真实产品中查看原文</a></p>' +
      '</article>';
    }
    grid.innerHTML = html;

    if (dimList && data.dimensions) {
      dimList.innerHTML = data.dimensions.map(function (name, index) {
        return '<li><span>' + String(index + 1).padStart(2, '0') + '</span>' + esc(name) + '</li>';
      }).join('');
    }
  }

  function citeChips(item) {
    var chips = '<span class="cite-chip">' + esc(item.lawTitle || '') + '</span>';
    if (item.noLabel) chips += '<span class="cite-chip">' + esc(item.noLabel) + '</span>';
    if (item.chapter) chips += '<span class="cite-chip cite-chip--ghost">' + esc(item.chapter) + '</span>';
    chips += '<a class="cite-link" href="' + lawHref(item.lawId) + '">查看原文 →</a>';
    return chips;
  }

  function translationLabel(item) {
    var meta = item.translationMeta || {};
    var bits = [];
    if (meta.engine) bits.push('引擎 ' + meta.engine);
    if (meta.model) bits.push(meta.model);
    if (meta.reviewed) bits.push('机器生成');
    var suffix = bits.length ? '（' + esc(bits.join(' · ')) + '）' : '';
    return 'AI 译文 · AI 辅助生成，仅供参考' + suffix;
  }

  function qaBlock(item) {
    var html = '<div class="qa-card">' +
      '<p class="qa-q"><span class="qa-badge" aria-hidden="true">问</span>' + esc(item.q || '') + '</p>' +
      '<div class="qa-a">' +
        '<p class="qa-label">引用条文原文 · 出处见下方</p>' +
        '<blockquote class="qa-quote" lang="zh-CN">' + esc(item.quote || '') + '</blockquote>';

    if (item.translation) {
      html += '<div class="qa-trans"><span class="qa-trans-label">' + translationLabel(item) + '</span>' +
        '<span lang="en">' + esc(item.translation) + '</span></div>';
    }

    html += '<div class="qa-cite">' + citeChips(item) + '</div>' +
      '<span class="disclaimer-inline">AI 辅助生成，仅供参考 · 不构成法律意见</span>' +
      '</div></div>';
    return html;
  }

  function renderQA() {
    var card = $('qaCard');
    var more = $('qaMore');
    var qa = D && D.qa;
    if (!card || !qa || !qa.length) return;

    card.innerHTML = qaBlock(qa[0]);

    if (more && qa[1]) {
      more.innerHTML = '<details class="qa-more">' +
        '<summary>再看一例：' + esc(qa[1].q || '') + '</summary>' +
        '<div class="qa-more-body">' +
          '<blockquote class="qa-quote" lang="zh-CN">' + esc(qa[1].quote || '') + '</blockquote>' +
          '<div class="qa-cite">' + citeChips(qa[1]) + '</div>' +
          '<span class="disclaimer-inline">AI 辅助生成，仅供参考 · 不构成法律意见</span>' +
        '</div></details>';
    }
  }

  function renderTerms() {
    var body = $('termsBody');
    var terms = D && D.terms;
    if (!body || !terms) return;

    body.innerHTML = terms.map(function (term) {
      var scene = TERM_SCENE[term.zh] || '法律术语';
      return '<tr>' +
        '<td class="term-zh" lang="zh-CN">' + esc(term.zh) + '</td>' +
        '<td class="term-en" lang="en">' + esc(term.en) + '</td>' +
        '<td class="term-scene">' + esc(scene) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ----------------------------------------------------------------------
     7. 按法域的法规数条形图（countryCounts，等比缩放）
     ---------------------------------------------------------------------- */
  function renderChart() {
    var chart = $('barChart');
    var totalNode = $('chartTotal');
    var counts = D && D.countryCounts;
    if (!chart || !counts) return;

    var entries = Object.keys(counts).map(function (name) {
      return { name: name, value: Number(counts[name]) || 0 };
    }).sort(function (a, b) { return b.value - a.value; });

    var max = entries.length ? entries[0].value : 1;
    var total = entries.reduce(function (sum, item) { return sum + item.value; }, 0);

    chart.innerHTML = entries.map(function (item, index) {
      var pct = max > 0 ? (item.value / max * 100).toFixed(2) : '0';
      var cls = item.name === '中国' ? ' is-cn' : '';
      return '<li class="bar-item' + cls + '" style="--i:' + index + '" ' +
        'aria-label="' + esc(item.name) + ' ' + fmtNum(item.value) + ' 部法规">' +
        '<span class="bar-name">' + esc(item.name) + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="--bar:' + pct + '%"></span></span>' +
        '<span class="bar-value">' + fmtNum(item.value) + '</span>' +
      '</li>';
    }).join('');

    if (totalNode) totalNode.textContent = fmtNum(total);
  }

  /* ----------------------------------------------------------------------
     8. 现场试搜：25 部真实样本 + 详情抽屉
     ---------------------------------------------------------------------- */
  function initSearch() {
    var input = $('demoSearch');
    var clearBtn = $('demoClear');
    var chipsWrap = $('quickChips');
    var status = $('searchStatus');
    var list = $('resultList');
    if (!input || !list || !D || !Array.isArray(D.laws)) return;

    var laws = D.laws;
    var queries = (D.sampleQueries || []).slice();
    var state = { q: '' };
    var lastFocus = null;

    /* 快捷词 */
    if (chipsWrap && queries.length) {
      chipsWrap.innerHTML = queries.map(function (q) {
        return '<button type="button" class="chip-btn" data-query="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('');
    }

    function syncChips() {
      if (!chipsWrap) return;
      var chips = chipsWrap.querySelectorAll('[data-query]');
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.toggle('is-active', chips[i].getAttribute('data-query') === state.q);
      }
    }

    function highlight(text, query) {
      var source = text == null ? '' : String(text);
      if (!query) return esc(source);
      var lower = source.toLowerCase();
      var needle = query.toLowerCase();
      var out = '';
      var pos = 0;
      var hit = lower.indexOf(needle, pos);
      while (hit !== -1) {
        out += esc(source.slice(pos, hit)) + '<mark>' + esc(source.slice(hit, hit + needle.length)) + '</mark>';
        pos = hit + needle.length;
        hit = lower.indexOf(needle, pos);
      }
      out += esc(source.slice(pos));
      return out;
    }

    function matches(law, query) {
      if (!query) return true;
      var fields = [law.title, law.titleEn, law.countryName];
      for (var i = 0; i < fields.length; i++) {
        if (fields[i] && String(fields[i]).toLowerCase().indexOf(query) !== -1) return true;
      }
      return false;
    }

    function levelLabel(law) {
      return LEVEL_LABEL[law.level] || '未标注层级';
    }

    function resultItem(law) {
      var chips = '<span class="result-chip result-chip--country">' + esc(law.countryName) + '</span>' +
        '<span class="result-chip">' + esc(levelLabel(law)) + '</span>';
      if (law.date) chips += '<span class="result-chip">公布 ' + esc(law.date) + '</span>';
      chips += '<span class="result-chip">' + fmtNum(law.articles || 0) + ' 条</span>';

      var en = law.titleEn ? '<span class="result-en" lang="en">' + highlight(law.titleEn, state.q) + '</span>' : '';
      return '<li class="result-card">' +
        '<button type="button" class="result-hit" data-law="' + esc(law.id) + '">' +
          '<span class="result-title">' + highlight(law.title, state.q) + '</span>' +
          en +
          '<span class="result-meta">' + chips + '</span>' +
        '</button></li>';
    }

    function emptyState(query) {
      var suggestions = queries.slice(0, 4).map(function (q) {
        return '<button type="button" class="chip-btn" data-query="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('');
      return '<li class="result-empty">' +
        '<p class="empty-title">在这 ' + laws.length + ' 部样本中没有匹配「' + esc(query) + '」的法规</p>' +
        '<p class="empty-hint">本页只内置样本；完整库覆盖 12 法域、' +
          fmtNum((D.meta && D.meta.laws) || 0) + ' 部法规，可在真实产品中继续检索。</p>' +
        '<div class="empty-sugg">' + suggestions + '</div>' +
      '</li>';
    }

    function render() {
      var raw = state.q;
      var query = raw.trim();
      var q = query.toLowerCase();
      var results = laws.filter(function (law) { return matches(law, q); });

      if (status) {
        if (!query) {
          status.innerHTML = '样本共 <strong>' + laws.length + '</strong> 部法规 · 覆盖 ' +
            Object.keys(D.countryCounts || {}).length + ' 个法域 · 点选任一结果查看元数据';
        } else {
          status.innerHTML = '找到 <strong>' + results.length + '</strong> 部匹配法规（样本共 ' +
            laws.length + ' 部）';
        }
      }

      if (!results.length) {
        list.innerHTML = emptyState(query);
        return;
      }

      var html = '';
      for (var i = 0; i < results.length; i++) html += resultItem(results[i]);
      list.innerHTML = html;
    }

    function setQuery(value, focusInput) {
      state.q = value;
      input.value = value;
      if (clearBtn) clearBtn.hidden = value.length === 0;
      syncChips();
      render();
      if (focusInput) input.focus();
    }

    /* 抽屉 */
    var drawerLayer = $('lawDrawer');
    var drawerBody = $('drawerBody');
    var drawerClose = $('drawerClose');
    var drawerOverlay = $('drawerOverlay');

    function drawerRow(label, value) {
      return '<div><dt>' + esc(label) + '</dt><dd>' + value + '</dd></div>';
    }

    function openDrawer(id) {
      var law = null;
      for (var i = 0; i < laws.length; i++) {
        if (laws[i].id === id) { law = laws[i]; break; }
      }
      if (!law || !drawerLayer || !drawerBody) return;

      lastFocus = doc.activeElement;
      var rows = '';
      rows += drawerRow('国别 / 法域', esc(law.countryName));
      rows += drawerRow('法律层级', esc(LEVEL_LABEL[law.level] || '未标注'));
      rows += drawerRow('时效性', esc(law.status === 'active' ? '现行有效' : '未标注'));
      rows += drawerRow('公布日期', esc(law.date || '未标注'));
      rows += drawerRow('条文数', fmtNum(law.articles || 0) + ' 条');
      rows += drawerRow('法规 ID', '<code>' + esc(law.id) + '</code>');

      var en = law.titleEn ? '<p class="drawer-en" lang="en">' + esc(law.titleEn) + '</p>' : '';

      drawerBody.innerHTML =
        '<p class="drawer-kicker">样本法规 · 真实数据</p>' +
        '<h3 class="drawer-title" id="drawerTitle">' + esc(law.title) + '</h3>' +
        en +
        '<dl class="drawer-meta">' + rows + '</dl>' +
        '<p class="drawer-note">该条目为库内真实样本，未做改写；完整库中每部法规均带官方来源链接与入库批次信息。</p>' +
        '<div class="drawer-actions">' +
          '<a class="btn btn-primary btn-sm" href="' + lawHref(law.id) + '">在真实产品中打开<span aria-hidden="true">→</span></a>' +
          '<span class="drawer-link-note">file:// 打开时同样可用</span>' +
        '</div>';

      drawerLayer.hidden = false;
      doc.body.style.overflow = 'hidden';
      if (drawerClose) drawerClose.focus();
      doc.addEventListener('keydown', onDrawerKey);
    }

    function closeDrawer() {
      if (!drawerLayer || drawerLayer.hidden) return;
      drawerLayer.hidden = true;
      doc.body.style.overflow = '';
      doc.removeEventListener('keydown', onDrawerKey);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onDrawerKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab' || !drawerLayer) return;
      var focusables = drawerLayer.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    /* 事件 */
    input.addEventListener('input', function () {
      setQuery(input.value, false);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () { setQuery('', true); });
    }

    if (chipsWrap) {
      chipsWrap.addEventListener('click', function (e) {
        var chip = e.target.closest ? e.target.closest('[data-query]') : null;
        if (chip) setQuery(chip.getAttribute('data-query'), true);
      });
    }

    list.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('[data-law]') : null;
      if (target) {
        openDrawer(target.getAttribute('data-law'));
        return;
      }
      var sugg = e.target.closest ? e.target.closest('[data-query]') : null;
      if (sugg) setQuery(sugg.getAttribute('data-query'), true);
    });

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    render();
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function boot() {
    root.classList.add('js');

    if (!D) {
      revealAll();
      return;
    }

    fillMeta();
    renderCompare();
    renderQA();
    renderTerms();
    renderChart();
    initSearch();
    initTabs();
    initNav();
    initCounters();
    initReveal();
  }

  try {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  } catch (err) {
    /* 静默降级：保证内容可读，不向控制台输出错误 */
    revealAll();
  }
})();
