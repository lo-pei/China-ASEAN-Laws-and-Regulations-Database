/* ==========================================================================
   CALR · views/country.js —— 国家（法域）详情页（M2）
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

  var SYS_DESC = {
    civil: '大陆法系：以体系化成文法典为核心，裁判以适用法律条文为主要依据。法律层级通常为宪法—法律—政令/行政法规—部门规章—地方性法规。',
    common: '普通法系：成文法与判例法并行，上级法院判决对下级法院具有约束力。检索时须同时呈现成文法条与判例要旨，并建立双向引用关系。',
    mixed: '混合法系：兼采成文法、判例法与宗教法或习惯法。同一事项可能因法源不同而产生不同结论，条目须标注法源类型。'
  };


  /* 首都名中英对照（数据集里为中文，英文界面需另配） */
  var CAPITALS = {
    CN: { zh: '北京', en: 'Beijing' }, VN: { zh: '河内', en: 'Hanoi' },
    TH: { zh: '曼谷', en: 'Bangkok' }, ID: { zh: '雅加达', en: 'Jakarta' },
    MY: { zh: '吉隆坡', en: 'Kuala Lumpur' }, SG: { zh: '新加坡', en: 'Singapore' },
    PH: { zh: '马尼拉', en: 'Manila' }, BN: { zh: '斯里巴加湾市', en: 'Bandar Seri Begawan' },
    KH: { zh: '金边', en: 'Phnom Penh' }, LA: { zh: '万象', en: 'Vientiane' },
    MM: { zh: '内比都', en: 'Naypyidaw' }, TL: { zh: '帝力', en: 'Dili' }
  };

  function capitalName(code, fallback) {
    var c = CAPITALS[code];
    if (!c) return fallback || '';
    return CALR.i18n.lang() === 'zh' ? c.zh : c.en;
  }

  views.country = {
    render: function (main, params, query) {
      var code = params[0];
      var c = S().country(code);
      if (!c) {
        main.innerHTML = '<div class="container page">' + C().emptyState(CALR.ui.icon('globe'), t('未找到该法域'), '', '<p><a class="btn" href="#/systems">' + esc(t('返回国家列表')) + '</a></p>') + '</div>';
        return;
      }
      var laws = S().lawsOf(code);
      var tab = query.tab || 'all';
      var treaties = S().treaties().filter(function (x) { return (x.parties || []).indexOf(code) >= 0; });
      var levels = S().levels().map(function (lv) {
        return { lv: lv, laws: laws.filter(function (l) { return l.level === lv.id; }) };
      }).filter(function (g) { return g.laws.length; });
      var topics = U().uniq([].concat.apply([], laws.map(function (l) { return l.topics || []; })));

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('法律体系'), href: '#/systems' }, { text: tr(c.name) }]) +

        '<div class="card card--pad" style="margin:12px 0 18px">' +
          '<div class="row" style="align-items:flex-start;gap:18px">' +
            '<div style="flex:0 0 96px">' + C().flagSvg(c.code, 'flag-lg') + '</div>' +
            '<div style="flex:1;min-width:0">' +
              '<h1 style="margin-bottom:2px">' + esc(tr(c.name)) + '</h1>' +
              '<p class="small muted" style="margin-bottom:8px">' +
                esc(c.name && c.name.en ? c.name.en : '') +
                (c.name && c.name[Object.keys(c.name).filter(function (k) { return ['zh', 'en'].indexOf(k) < 0 && c.name[k]; })[0]] ? ' · ' + esc(c.name[Object.keys(c.name).filter(function (k) { return ['zh', 'en'].indexOf(k) < 0 && c.name[k]; })[0]]) : '') +
              '</p>' +
              '<div class="row">' + C().sysTag(c) +
                (c.languages || []).map(function (l) { return '<span class="tag tag--outline">' + esc(CALR.i18n.nativeName(l)) + '</span>'; }).join('') +
                '<span class="tag tag--outline">' + esc(t('首都')) + '：' + esc(capitalName(c.code, tr(c.capital))) + '</span>' +
                (c.joinedASEAN ? '<span class="tag tag--outline">' + esc(t('加入东盟')) + ' ' + c.joinedASEAN + '</span>' : '') +
              '</div>' +
              '<p class="small muted" style="margin-top:10px;margin-bottom:0">' + esc(tr(c.summary)) + '</p>' +
            '</div>' +
            '<div style="flex:0 0 260px">' +
              '<div class="grid grid--2">' +
                C().stat(laws.length, t('已收录法规')) +
                C().stat(laws.reduce(function (a, l) { return a + (l.articleCount || 0); }, 0), t('结构化条文')) +
                C().stat(treaties.length, t('相关条约')) +
                C().stat((c.languages || []).length, t('官方语种')) +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="layout-2col">' +
          '<div>' +
            '<div class="toolbar">' +
              '<div class="btn-group">' +
                tabBtn('all', t('全部法规') + '（' + laws.length + '）', tab) +
                (treaties.length ? tabBtn('treaty', t('相关条约') + '（' + treaties.length + '）', tab) : '') +
              '</div>' +
              '<div class="toolbar__right">' +
                '<a class="btn btn--outline btn--sm" href="#/search?country=' + esc(code) + '">' + esc(t('在检索中查看')) + '</a>' +
                '<a class="btn btn--outline btn--sm" href="#/compare">' + esc(t('选取条文比对')) + '</a>' +
              '</div>' +
            '</div>' +
            (tab === 'treaty' ? renderTreaties(treaties) : renderLaws(levels, code, parseInt(query.page || 1, 10))) +
          '</div>' +

          '<aside class="col-sidebar">' +
            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('法律体系与法源')) + '</h3></div>' +
              '<div class="card__body"><p class="small muted">' + esc(t(SYS_DESC[c.legalSystem] || '')) + '</p>' +
              '<ul class="hierarchy-tree">' + S().levels().map(function (lv) {
                var n = laws.filter(function (l) { return l.level === lv.id; }).length;
                var inHier = (c.hierarchy || []).indexOf(lv.id) >= 0;
                return '<li><div class="hierarchy-tree__name">' + esc(tr(lv.name)) + (inHier ? '' : ' <span class="mini muted">' + esc(t('（暂无收录）')) + '</span>') + '</div>' +
                  '<div class="hierarchy-tree__desc">' + n + ' ' + esc(t('部已收录')) + '</div></li>';
              }).join('') + '</ul></div>' +
            '</div>' +

            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('数据来源')) + '</h3></div>' +
              '<div class="card__body"><ul class="small muted" style="padding-left:16px">' +
                (c.sources || []).map(function (s) {
                  var nm = CALR.ui.portalLabel ? CALR.ui.portalLabel(s.url, s.name) : s.name;
      return '<li>' + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(nm) + '</a>' : esc(nm)) + '</li>';
                }).join('') +
              '</ul><p class="mini muted" style="margin:0">' + esc(t('法规文本以各国官方公布版本为准。')) + '</p></div>' +
            '</div>' +

            '<div class="card"><div class="card__head"><h3 class="card__title">' + esc(t('相关主题')) + '</h3></div>' +
              '<div class="card__body"><div class="row">' + topics.map(function (tp) {
                return '<a class="tag tag--blue tag--clickable" href="#/search?country=' + esc(code) + '&topic=' + esc(tp) + '">' + esc(S().topicName(tp)) + '</a>';
              }).join('') + '</div></div>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';

      U().$$('[data-ctab]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          CALR.router.go(CALR.router.buildUrl('/country/' + code, { tab: b.getAttribute('data-ctab') }));
        });
      });
      U().$$('[data-cpage]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          CALR.router.go(CALR.router.buildUrl('/country/' + code, { page: b.getAttribute('data-cpage') }));
        });
      });
    }
  };

  function tabBtn(id, label, cur) {
    return '<button type="button" class="btn btn--sm' + (id === cur ? ' is-active' : '') + '" data-ctab="' + esc(id) + '">' + esc(label) + '</button>';
  }

  function renderLaws(levels, code, page) {
    if (!levels.length) return C().emptyState(CALR.ui.icon('docs'), t('暂未收录该国法规'), '', '<p><a class="btn" href="#/systems">' + esc(t('返回国家列表')) + '</a></p>');
    /* 法规数量大（如中国 1500+ 部）时分页展示，避免单页渲染过长 */
    var total = levels.reduce(function (n, g) { return n + g.laws.length; }, 0);
    var PER = 40;
    var pages = Math.max(1, Math.ceil(total / PER));
    page = Math.min(Math.max(1, page || 1), pages);
    var flat = [];
    levels.forEach(function (g) {
      g.laws.forEach(function (l) { flat.push({ law: l, levelName: tr(g.lv.name), levelId: g.lv.id }); });
    });
    var slice = flat.slice((page - 1) * PER, page * PER);

    var head = '';
    if (pages > 1) {
      head = '<div class="toolbar"><span class="toolbar__count">' + esc(t('共')) + ' <b>' + total + '</b> ' + esc(t('部法规')) +
        '　<span title="' + U().attr(t('页')) + '">' + page + ' / ' + pages + '</span></span>' +
        '<div class="toolbar__right">' +
        '<a class="btn btn--outline btn--sm" href="#/search?country=' + esc(code) + '">' + esc(t('在检索中查看全部')) + '</a>' +
        '</div></div>';
    }

    var body = slice.map(function (x) {
      return '<div style="margin-bottom:10px">' +
        '<div class="mini muted" style="margin-bottom:2px">' + esc(x.levelName) + '</div>' +
        '<a class="law-item" href="#/law/' + esc(x.law.id) + '" style="margin-bottom:0">' +
          '<div class="law-item__head"><h3 class="law-item__title">' + esc(tr(x.law.title)) + '</h3></div>' +
          '<div class="law-item__meta">' +
            '<span>' + esc(S().levelName(x.law.level)) + '</span>' +
            '<span>' + esc(x.law.docNumber || '—') + '</span>' +
            '<span>' + esc(U().fmtDate(x.law.promulgatedDate)) + '</span>' +
            '<span>' + esc(t('共')) + ' ' + (x.law.articleCount || 0) + ' ' + esc(t('条')) + '</span>' +
            '<span>' + (x.law.coverage === 'full' ? '' + CALR.ui.icon('book') + ' ' + esc(t('全文')) : (x.law.coverage === 'catalog' ? '' + CALR.ui.icon('download') + ' ' + esc(t('待载入全文')) : esc(t('条目')))) + '</span>' +
          '</div>' +
        '</a></div>';
    }).join('');

    if (pages > 1) {
      var pager = '<div class="pager">';
      pager += '<button type="button" data-cpage="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>‹</button>';
      var start = Math.max(1, page - 3), end = Math.min(pages, start + 6);
      for (var i = start; i <= end; i++) pager += '<button type="button" data-cpage="' + i + '"' + (i === page ? ' class="is-active"' : '') + '>' + i + '</button>';
      pager += '<button type="button" data-cpage="' + (page + 1) + '"' + (page >= pages ? ' disabled' : '') + '>›</button></div>';
      body += pager;
    }
    return head + body;
  }

  function renderCases(cases, c) {
    if (!cases.length) {
      return C().emptyState(CALR.ui.icon('scales'), t('暂未收录该国判例'),
        t('普通法系与混合法系国家需单列判例模块。本平台尚未收录该国判例，将通过各国最高法院官方渠道持续采集。'));
    }
    return '<div class="card card--pad">' +
      '<div class="banner" style="margin-bottom:14px"><span class="banner__icon">' + CALR.ui.icon('scales') + '</span><div>' +
        esc(t('该国属') + t({ civil: '大陆法系', common: '普通法系', mixed: '混合法系' }[c.legalSystem]) + t('，判例在裁判中的作用与成文法不同，使用时请结合法源类型判断。')) +
      '</div></div>' +
      cases.map(function (x) {
        return '<div class="news-item"><div class="news-item__date">' + esc(x.date || '') + '</div>' +
          '<div class="news-item__body"><p class="news-item__title">' + esc(tr(x.name)) + '</p>' +
          '<div class="row mini muted"><span>' + esc(x.court || '') + '</span>' + (x.caseNo ? '<span>' + esc(x.caseNo) + '</span>' : '<span>' + esc(t('案号未公开')) + '</span>') + '</div>' +
          '<p class="small muted" style="margin:6px 0 0">' + esc(tr(x.summary)) + '</p>' +
          '<div class="row" style="margin-top:6px">' + (x.relatedLawIds || []).map(function (id) {
            var l = S().law(id);
            return l ? '<a class="tag tag--blue tag--clickable" href="#/law/' + esc(id) + '">' + esc(tr(l.title)) + '</a>' : '';
          }).join('') + '</div>' +
          '</div></div>';
      }).join('') + '</div>';
  }

  function renderTreaties(treaties) {
    return '<div class="card card--pad">' + treaties.map(function (x) {
      return '<div class="news-item"><div class="news-item__date">' + esc(x.signedDate || '') + '</div>' +
        '<div class="news-item__body"><p class="news-item__title">' + esc(tr(x.name)) + '</p>' +
        '<div class="row mini muted"><span>' + esc(t('签署')) + ' ' + esc(x.signedDate || '—') + '</span><span>' + esc(t('生效')) + ' ' + esc(x.effectiveDate || '—') + '</span>' +
        '<span>' + esc(t('缔约方')) + ' ' + (x.parties || []).length + ' ' + esc(t('方')) + '</span></div>' +
        '<p class="small muted" style="margin:6px 0 0">' + esc(tr(x.summary)) + '</p></div></div>';
    }).join('') + '</div>';
  }
})(typeof window !== 'undefined' ? window : globalThis);
