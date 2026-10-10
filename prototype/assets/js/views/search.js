/* ==========================================================================
   CALR · views/search.js —— 法规 / 条约检索（筛选条件平铺，不单设高级检索入口）
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var views = CALR.views = CALR.views || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };
  var C = function () { return CALR.ui; };
  var t = function (k) { return CALR.i18n.t(k); };
  var esc = function (s) { return CALR.util.esc(s); };
  var tr = function (f) { return CALR.i18n.field(f); };

  /* 检索类型：法规 / 条约两类 */
  var TYPES = [
    { id: 'law', label: '法规', title: '法规检索' },
    { id: 'treaty', label: '条约', title: '条约检索' }
  ];

  /* 每页条数选项：默认 20，可切 50 / 100 */
  var PAGE_SIZES = [20, 50, 100];
  var DEFAULT_PAGE_SIZE = 20;

  /* 制定机关名称的英文对照（常见中国机关 + 「XX官方发布渠道」模式） */
  var ISSUER_EN = {
    '国务院': 'State Council',
    '全国人民代表大会': 'National People\'s Congress',
    '全国人民代表大会常务委员会': 'Standing Committee of the National People\'s Congress',
    '全国人大常务委员会': 'Standing Committee of the National People\'s Congress',
    '最高人民法院': 'Supreme People\'s Court',
    '最高人民检察院': 'Supreme People\'s Procuratorate',
    '国家市场监督管理总局': 'State Administration for Market Regulation',
    '国家税务总局': 'State Taxation Administration',
    '国家互联网信息办公室': 'Cyberspace Administration of China',
    '中国人民银行': 'People\'s Bank of China',
    '外交部': 'Ministry of Foreign Affairs',
    '商务部': 'Ministry of Commerce',
    '公安部': 'Ministry of Public Security',
    '司法部': 'Ministry of Justice',
    '财政部': 'Ministry of Finance',
    '国家发展和改革委员会': 'National Development and Reform Commission'
  };
  var COUNTRY_EN = {
    '中国': 'China', '越南': 'Vietnam', '泰国': 'Thailand', '印度尼西亚': 'Indonesia',
    '马来西亚': 'Malaysia', '新加坡': 'Singapore', '菲律宾': 'the Philippines',
    '文莱': 'Brunei', '柬埔寨': 'Cambodia', '老挝': 'Laos', '缅甸': 'Myanmar', '东帝汶': 'Timor-Leste'
  };

  /** 制定机关名的本地化显示 */
  function issuerLabel(name) {
    if (CALR.i18n.lang() === 'zh' || !name) return name;
    if (ISSUER_EN[name]) return ISSUER_EN[name];
    var m = /^(.+?)官方发布渠道$/.exec(name);
    if (m) return 'Official channel — ' + (COUNTRY_EN[m[1]] || m[1]);
    return name;
  }

  function arr(v) { return v ? String(v).split(',').filter(Boolean) : []; }

  views.search = {
    render: function (main, params, query) {
      var type = query.type || 'law';
      if (['law', 'treaty'].indexOf(type) < 0) type = 'law';
      var q = query.q || '';
      var page = parseInt(query.page || 1, 10);
      /* 每页条数：默认 20，可选 50 / 100；非法值回落到 20 */
      var size = parseInt(query.size || DEFAULT_PAGE_SIZE, 10);
      if (PAGE_SIZES.indexOf(size) < 0) size = DEFAULT_PAGE_SIZE;
      var sort = query.sort || 'relevance';

      var res = type === 'treaty'
        ? CALR.search.runTreaties({ q: q, page: page, size: size, topic: arr(query.topic), status: arr(query.status) })
        : CALR.search.run({
          q: q, mode: query.mode || 'keyword', page: page, size: size, sort: sort,
          country: arr(query.country), level: arr(query.level), status: arr(query.status),
          topic: arr(query.topic), issuer: arr(query.issuer), lang: arr(query.lang),
          from: query.from || '', to: query.to || '', effFrom: query.effFrom || '', effTo: query.effTo || ''
        });

      var totalPages = Math.max(1, Math.ceil(res.total / size));
      var title = (TYPES.filter(function (x) { return x.id === type; })[0] || TYPES[0]).title;

      main.innerHTML = '' +
      '<div class="container container--wide page">' +

        '<div class="card card--pad" style="margin:14px 0 16px">' +
          '<form id="search-form" role="search">' +
            '<div class="searchbox searchbox--sm">' +
              '<span class="searchbox__icon" aria-hidden="true">' + CALR.ui.icon('search') + '</span>' +
              '<input class="searchbox__input" id="s-q" name="q" value="' + esc(q) + '" autocomplete="off" ' +
                'placeholder="' + esc(t('输入名称、文号或关键词')) + '" aria-label="' + esc(t('检索')) + '">' +
              '<button class="btn" type="submit">' + esc(t('检索')) + '</button>' +
            '</div>' +
            '<div class="row" style="margin-top:12px">' +
              '<span class="mini muted">' + esc(t('类型')) + '</span>' +
              '<div class="btn-group">' + TYPES.map(function (x) {
                return '<button type="button" class="btn btn--sm' + (x.id === type ? ' is-active' : '') + '" data-stype="' + x.id + '">' + esc(t(x.label)) + '</button>';
              }).join('') + '</div>' +
              '<span class="mini muted" style="margin-left:8px">' + esc(t('检索方式')) + '</span>' +
              '<select class="select" id="s-mode" style="width:auto;padding:5px 26px 5px 8px">' +
                opt('keyword', '关键词检索', query.mode || 'keyword') +
                opt('semantic', '自然语言检索', query.mode) +
                opt('exact', '法条编号检索', query.mode) +
              '</select>' +
              /* 检索词紧随其后，同一行展示，并带清除按钮 */
              (q ? '<span class="kw-chip">' + esc(q) +
                '<button type="button" class="kw-chip__x" id="kw-clear" title="' +
                U().attr(t('清除检索词')) + '" aria-label="' + U().attr(t('清除检索词')) + '">×</button></span>' : '') +
              /* 侧栏筛选产生的标签与检索词同行显示，不再单独占一行 */
              activeChips(query, true) +
                  '<span class="mini muted" style="margin-left:auto">' + esc(t('排序')) + '</span>' +
              '<select class="select" id="s-sort" style="width:auto;padding:5px 26px 5px 8px">' +
                opt('relevance', '相关度', sort) + opt('date', '日期', sort) +
              '</select>' +
            '</div>' +
          '</form>' +
        '</div>' +

        '<div class="layout-sidebar-left">' +
          '<aside class="col-filter sticky-top" id="filter-panel"><div class="card">' +
            '<div class="filter-drawer__head"><span>' + esc(t('筛选条件')) + '</span>' +
              '<button class="btn btn--ghost btn--sm" id="filter-close" type="button">' + esc(t('关闭')) + ' ×</button></div>' +
            '<div class="card__body">' +
            filterPanel(type, query) +
          '</div></div></aside>' +
          '<div class="filter-drawer-mask" id="filter-mask"></div>' +

          '<div>' +
            '<div class="toolbar">' +
              '<button class="btn btn--outline btn--sm filter-toggle" id="filter-toggle" type="button">' + CALR.ui.icon('filter') + ' ' + esc(t('筛选')) + '<span id="filter-count"></span></button>' +
              '<span class="toolbar__count">' + esc(t('共')) + ' <b>' + U().num(res.total) + '</b> ' + esc(t('条结果')) +
                '</span>' +
              '<div class="toolbar__right">' +
                '<label class="mini muted" for="s-size">' + esc(t('每页')) + '</label>' +
                '<select class="select" id="s-size" style="width:auto;padding:5px 26px 5px 8px" title="' + esc(t('每页条数')) + '">' +
                  PAGE_SIZES.map(function (n) {
                    return '<option value="' + n + '"' + (n === size ? ' selected' : '') + '>' + n + '</option>';
                  }).join('') +
                '</select>' +
                '<a class="btn btn--outline btn--sm" href="#/systems">' + esc(t('法律体系对照')) + '</a>' +
              '</div>' +
            '</div>' +
              '<div id="result-list">' + renderResults(type, res) + '</div>' +
            pager(page, totalPages, size) +
          '</div>' +
        '</div>' +
      '</div>';

      /* --- 事件 --- */
      U().on(U().$('#search-form', main), 'submit', function (e) {
        e.preventDefault();
        go({ q: U().$('#s-q', main).value.trim(), page: 1 });
      });
      U().$$('[data-stype]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          CALR.router.go(CALR.router.buildUrl('/search', { type: b.getAttribute('data-stype') }));
        });
      });
      var modeSel = U().$('#s-mode', main);
      if (modeSel) U().on(modeSel, 'change', function () { go({ mode: modeSel.value, page: 1 }); });
      U().on(U().$('#s-sort', main), 'change', function (e) { go({ sort: e.target.value, page: 1 }); });
      var sizeSel = U().$('#s-size', main);
      if (sizeSel) U().on(sizeSel, 'change', function (e) { go({ size: parseInt(e.target.value, 10), page: 1 }); });
      var kwClear = U().$('#kw-clear', main);
      if (kwClear) U().on(kwClear, 'click', function () {
        var inp = U().$('#s-q', main);
        if (inp) inp.value = '';
        go({ q: '', page: 1 });
      });
      U().$$('[data-filter]', main).forEach(function (input) {
        U().on(input, 'change', function () {
          var k = input.getAttribute('data-filter');
          var v = input.value;
          var cur = arr(query[k]);
          var idx = cur.indexOf(v);
          if (input.checked && idx < 0) cur.push(v);
          if (!input.checked && idx >= 0) cur.splice(idx, 1);
          var next = {}; next[k] = cur.join(','); next.page = 1;
          go(next);
        });
      });
      U().on(U().$('#f-apply', main), 'click', function () {
        go({
          from: U().$('#f-from', main).value, to: U().$('#f-to', main).value,
          effFrom: U().$('#f-eff-from', main).value, effTo: U().$('#f-eff-to', main).value, page: 1
        });
      });
      U().on(U().$('#f-clear', main), 'click', function () {
        CALR.router.go(CALR.router.buildUrl('/search', { type: type, q: q }));
      });
      U().$$('[data-remove-filter]', main).forEach(function (chip) {
        U().on(chip, 'click', function () {
          var parts = chip.getAttribute('data-remove-filter').split(':');
          var k = parts[0], v = parts.slice(1).join(':');
          var cur = arr(query[k]).filter(function (x) { return x !== v; });
          var next = {}; next[k] = cur.join(','); next.page = 1;
          go(next);
        });
      });
      U().$$('[data-page]', main).forEach(function (b) {
        U().on(b, 'click', function () { go({ page: b.getAttribute('data-page') }); });
      });

      /* 移动端筛选抽屉 */
      var panel = U().$('#filter-panel', main);
      var mask = U().$('#filter-mask', main);
      function drawer(open) {
        if (!panel) return;
        panel.classList.toggle('is-open', open);
        if (mask) mask.classList.toggle('is-open', open);
        document.body.classList.toggle('no-scroll', open);
      }
      var ft = U().$('#filter-toggle', main);
      if (ft) U().on(ft, 'click', function () { drawer(!panel.classList.contains('is-open')); });
      var fc = U().$('#filter-close', main);
      if (fc) U().on(fc, 'click', function () { drawer(false); });
      if (mask) U().on(mask, 'click', function () { drawer(false); });

      function go(patch) {
        var next = { type: type, q: q, mode: query.mode, sort: sort, size: size };
        ['country', 'level', 'status', 'topic', 'issuer', 'lang', 'court', 'from', 'to', 'effFrom', 'effTo'].forEach(function (k) {
          if (query[k]) next[k] = query[k];
        });
        next.page = page;
        Object.keys(patch).forEach(function (k) {
          if (patch[k] !== undefined && patch[k] !== null && patch[k] !== '') next[k] = patch[k];
          else delete next[k];
        });
        CALR.router.go(CALR.router.buildUrl('/search', next));
      }
    }
  };

  function opt(v, label, cur) {
    return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(t(label)) + '</option>';
  }

  function group(title, key, items, query) {
    if (!items.length) return '';
    var checked = arr(query[key]);
    return '<div class="filter-group">' +
      '<div class="filter-group__title">' + esc(title) + '</div>' +
      '<div class="filter-group__list">' + items.map(function (it) {
        var dis = it.count === 0 && checked.indexOf(it.v) < 0;
        return '<label class="checkbox"' + (dis ? ' style="opacity:.45"' : '') + '>' +
          '<input type="checkbox" data-filter="' + esc(key) + '" value="' + esc(it.v) + '"' +
            (checked.indexOf(it.v) >= 0 ? ' checked' : '') + (dis ? ' disabled' : '') + '>' +
          '<span>' + esc(it.label) + '</span><span class="checkbox__count">' + (it.count === undefined ? '' : it.count) + '</span></label>';
      }).join('') + '</div></div>';
  }

  /* 筛选条件与检索能力一致：全部条件平铺展示，不另设「高级检索」入口 */
  function filterPanel(type, query) {
    var out = '';

    /* 按国家 / 法域 */
    out += group(t('按国家 / 法域'), 'country', S().countries().map(function (c) {
      return { v: c.code, label: tr(c.name), count: S().lawsOf(c.code).length };
    }), query);

    if (type === 'law') {
      out += group(t('按主题'), 'topic', S().topics().map(function (tp) {
        return { v: tp.id, label: tr(tp.name), count: tp.lawCount || 0 };
      }), query);

      var issuerPool = {};
      S().laws().forEach(function (l) {
        var n = tr(l.issuingBody);
        if (n) issuerPool[n] = (issuerPool[n] || 0) + 1;
      });
      var issuers = Object.keys(issuerPool).sort(function (a, b) { return issuerPool[b] - issuerPool[a]; }).slice(0, 12);

      out += group(t('法律层级'), 'level', S().levels().map(function (l) {
        return { v: l.id, label: tr(l.name), count: undefined };
      }), query);
      out += group(t('时效性'), 'status', S().statuses().map(function (s) {
        return { v: s.id, label: tr(s.name), count: undefined };
      }), query);
      out += group(t('制定机关'), 'issuer', issuers.map(function (n) { return { v: n, label: issuerLabel(n), count: issuerPool[n] }; }), query);
      out += group(t('语言'), 'lang', S().languages().map(function (l) {
        return { v: l.code, label: l.nativeName, count: undefined };
      }), query);

      out += '<div class="filter-group">' +
          '<div class="filter-group__title">' + esc(t('公布日期')) + '</div>' +
          '<div class="row" style="gap:6px">' +
            '<input type="date" class="input" id="f-from" value="' + esc(query.from || '') + '" style="flex:1;min-width:0">' +
            '<span class="mini muted">—</span>' +
            '<input type="date" class="input" id="f-to" value="' + esc(query.to || '') + '" style="flex:1;min-width:0">' +
          '</div>' +
        '</div>' +
        '<div class="filter-group">' +
          '<div class="filter-group__title">' + esc(t('施行日期')) + '</div>' +
          '<div class="row" style="gap:6px">' +
            '<input type="date" class="input" id="f-eff-from" value="' + esc(query.effFrom || '') + '" style="flex:1;min-width:0">' +
            '<span class="mini muted">—</span>' +
            '<input type="date" class="input" id="f-eff-to" value="' + esc(query.effTo || '') + '" style="flex:1;min-width:0">' +
          '</div>' +
        '</div>' +
        '<div class="row" style="margin-top:8px">' +
          '<button class="btn btn--outline btn--sm" id="f-apply" type="button">' + esc(t('应用条件')) + '</button>' +
          '<button class="btn btn--ghost btn--sm" id="f-clear" type="button">' + esc(t('重置筛选')) + '</button>' +
        '</div>';
    } else {
      out += group(t('主题'), 'topic', S().topics().map(function (tp) {
        return { v: tp.id, label: tr(tp.name), count: undefined };
      }), query);
      out += group(t('状态'), 'status', [
        { v: 'active', label: t('现行有效'), count: undefined },
        { v: 'pending', label: t('尚未生效'), count: undefined }
      ], query);
      out += '<div class="row" style="margin-top:8px">' +
        '<button class="btn btn--ghost btn--sm" id="f-clear" type="button">' + esc(t('重置筛选')) + '</button></div>';
    }
    return out;
  }

  function activeChips(query, inline) {
    var chips = [];
    [['country', function (v) { return S().countryName(v); }],
     ['topic', function (v) { return S().topicName(v); }],
     ['level', function (v) { return S().levelName(v); }],
     ['status', function (v) { return S().statusName(v); }]].forEach(function (pair) {
      arr(query[pair[0]]).forEach(function (v) { chips.push({ k: pair[0], v: v, label: pair[1](v) }); });
    });
    ['court', 'issuer', 'lang'].forEach(function (k) {
      arr(query[k]).forEach(function (v) { chips.push({ k: k, v: v, label: v }); });
    });
    [['from', '公布日期自'], ['to', '公布日期至'], ['effFrom', '施行日期自'], ['effTo', '施行日期至']].forEach(function (pair) {
      if (query[pair[0]]) chips.push({ k: pair[0], v: query[pair[0]], label: t(pair[1]) + ' ' + query[pair[0]] });
    });
    if (!chips.length) return '';
    return '<div class="filter-active' + (inline ? ' filter-active--inline' : '') + '">' + chips.map(function (c) {
      return '<span class="chip" data-remove-filter="' + esc(c.k + ':' + c.v) + '">' + esc(c.label) + ' <span class="chip__x">×</span></span>';
    }).join('') + '</div>';
  }

  function renderResults(type, res) {
    if (!res.items.length) {
      return C().emptyState(CALR.ui.icon('search'), t('未找到相关内容'),
        t('建议调整关键词或放宽筛选条件；也可查阅') + ' <a href="#/sources">' + esc(t('数据来源')) + '</a> ' + esc(t('页面列出的各国官方法律数据库。')));
    }
    if (type === 'treaty') {
      return res.items.map(function (it) { return C().treatyItem(it.item, { terms: res.terms }); }).join('');
    }
    return res.items.map(function (it) {
      /* 检索结果页只呈现法规主体信息，不显示标签行与命中说明 */
      return C().lawItem(it.law, { plain: true, terms: res.terms, snippet: it.snippet, hitArticle: it.hitArticle });
    }).join('');
  }

  function pager(page, totalPages, size) {
    if (totalPages <= 1) return '<div class="pager"><span class="mini muted">' + esc(t('共 1 页')) + '</span></div>';
    var out = '<div class="pager">';
    out += '<button type="button" data-page="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>‹</button>';
    var start = Math.max(1, page - 2), end = Math.min(totalPages, start + 4);
    for (var i = start; i <= end; i++) out += '<button type="button" data-page="' + i + '"' + (i === page ? ' class="is-active"' : '') + '>' + i + '</button>';
    out += '<button type="button" data-page="' + (page + 1) + '"' + (page >= totalPages ? ' disabled' : '') + '>›</button>';
    out += '<span class="mini muted" style="margin-left:10px">' + esc(t('共')) + ' ' + totalPages + ' ' + esc(t('页')) + '</span>';
    out += '</div>';
    return out;
  }
})(typeof window !== 'undefined' ? window : globalThis);
