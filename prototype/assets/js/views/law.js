/* ==========================================================================
   CALR · views/law.js —— 法规详情页与阅读体验（M5）+ 术语即时翻译（M4 内联）
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

  var LANG_NAME = { zh: '中文', en: 'English', vi: 'Tiếng Việt', th: 'ไทย', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu', my: 'မြန်မာ', km: 'ខ្មែរ', lo: 'ລາວ' };
  var SPEECH = { zh: 'zh-CN', en: 'en-US', vi: 'vi-VN', th: 'th-TH', id: 'id-ID', ms: 'ms-MY', my: 'my-MM', km: 'km-KH', lo: 'lo-LA' };

  views.law = {
    render: function (main, params, query) {
      var id = params[0];

  /* 版本与变迁（④）：数据现实是没有条文级修订记录，所以只做法规级时间线，
         并列出「同标题的其他记录」—— 明确标注同名不等于同法，不替用户下结论。 */
      function renderHistoryData() {
        /* 注意：本文件下文有 var root = U().$('#law-body', main) || main;
           那个 root 是 DOM 元素，不是 window。这里必须用 window 取 API 模式标记，
           否则 root.__CALR_API_MODE 永远是 undefined，整段逻辑被静默跳过。 */
        if (!((typeof window !== 'undefined' ? window.__CALR_API_MODE : null) &&
              CALR.api && CALR.api.enabled && CALR.api.enabled() && CALR.api.lawHistory)) return;
        CALR.api.lawHistory(id).then(function (h) {
          if (!h) return;
          var box = U().$('#law-history', main);
          if (!box) return;
          var ev = (h.events || []).map(function (e) {
            return '<li class="hist__item"><span class="hist__dot"></span>' +
              '<span class="hist__label">' + esc(e.label) + '</span>' +
              '<span class="hist__val">' + esc(e.value) + '</span></li>';
          }).join('');
          var sib = (h.siblings || []).length ? (
            '<div class="hist__sib"><div class="hist__sibtitle">' + esc(t('同标题的其他记录')) +
            '（' + h.siblings.length + '）</div><ul class="hist__siblist">' +
            h.siblings.map(function (x) {
              return '<li><a href="#/law/' + esc(x.id) + '">' + esc(CALR.store.lawTitle({ title: { zh: x.title } })) +
                '</a> <span class="mini">' + esc(x.id) + (x.promulgatedDate ? ' · ' + esc(String(x.promulgatedDate)) : '') +
                '</span></li>';
            }).join('') + '</ul>' +
            '<p class="hist__note">' + esc(h.note || '') + '</p></div>') : '';
          box.innerHTML = '<div class="card"><div class="card__head"><h2 class="card__title">' +
            esc(t('版本与变迁')) + '</h2></div><div class="card__body">' +
            (ev ? '<ul class="hist">' + ev + '</ul>' : '<p class="mini">' + esc(t('暂无版本时间信息')) + '</p>') +
            sib + '</div></div>';
        }).catch(function () {});
      }


      var law = S().law(id);
      if (!law) {

    /* API 模式兜底：store 里没有（compact 后台补齐尚未完成，或直接访问详情页链接），
       就先向后端要这一部，拿到后写入 store 再重渲染。 */
    if (root.__CALR_API_MODE && CALR.api && CALR.api.enabled && CALR.api.enabled() &&
        CALR.api.law && !main.__calrLawFetching) {
      main.__calrLawFetching = true;
      CALR.api.law(id).then(function (full) {
        if (full && full.id) {
          if (CALR.store.addCompactLaws) CALR.store.addCompactLaws([full]);
          if (CALR.store.addFullArticles) CALR.store.addFullArticles(full.id, full.articles || []);
        }
        main.__calrLawFetching = false;
        views.law.render(main, params, query);
      }).catch(function () {
        main.__calrLawFetching = false;
        views.law.render(main, params, query);
      });
      return;
    }

    main.innerHTML = '<div class="container page">' + C().emptyState(CALR.ui.icon('print'), t('未找到该法规'), '', '<p><a class="btn" href="#/search">' + esc(t('返回检索')) + '</a></p>') + '</div>';
        return;
      }
      /* 目录已收录但条文尚未载入：先载入所属分卷，再重新渲染 */
      if (law.coverage === 'catalog' && CALR.fulltext) {
        var pack = CALR.fulltext.packFor ? CALR.fulltext.packFor(id) : null;
        /* 来源中未提供条文正文：如实说明，不报「加载失败」 */
        if (!pack) {
          main.innerHTML = '<div class="container page">' +
            C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: esc(tr(law.title)) }]) +
            '<div style="margin-top:16px">' +
            C().emptyState(CALR.ui.icon('file'), t('本条仅收录条目信息'),
              t('来源目录中未提供该法规的条文正文，平台已登记其名称、文号、公布与施行日期、制定机关与官方来源链接，条文将在完成来源核验与结构化后陆续发布。'),
              '<p>' + (law.source && law.source.url
                ? '<a class="btn" href="' + U().attr(law.source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(t('前往官方来源')) + '</a> '
                : '') +
              '<a class="btn btn--outline" href="#/sources">' + esc(t('查看数据来源')) + '</a></p>') +
            '</div></div>';
          return;
        }
        main.innerHTML = '<div class="container page">' +
          C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: esc(tr(law.title)) }]) +
          '<div class="card card--pad" style="margin-top:16px">' + C().skeletonList(4) +
          '<p class="mini muted center">' + esc(t('正在载入该法规的官方全文…')) + '</p></div></div>';
        CALR.fulltext.ensureLaw(id).then(function (ok) {
          S().init();
          if (ok) { CALR.app.refresh(); }
          else {
            var dir = pack.kind === 'intl' ? 'prototype/data/intl/' : 'prototype/data/cn/';
            main.innerHTML = '<div class="container page">' + C().emptyState(CALR.ui.icon('alert'), t('全文暂未载入'),
              t('该法规的全文分卷未能加载，请检查 ' + dir + ' 目录是否完整。')) + '</div>';
          }
        });
        return;
      }
      var country = S().country(law.country);
      /* 有条文即渲染正文（官方全文与平台整理稿均可阅读） */
      var showText = law.articles.length > 0;

      var avail = U().uniq([].concat.apply([], law.articles.map(function (a) { return Object.keys(a.text || {}); })));
      if (!avail.length) avail = ['zh'];

      /* 原文语种：以法规声明的官方文本语种为准；译文语种：当前界面语言（缺失时退英文） */
      var uiLang = CALR.i18n.lang();
      var origLang = originalLangOf(law, avail);

      /* 译文层：按下面 transLang 的同一选法加载 data/trans 并合并到内存（原文文件不动）。
         注意：不能直接用界面语言去找分卷——界面语言等于原文语言时（如中文界面看中文法）
         分卷是注册在「译文语言」下的，用界面语言查会取不到，导致译文永远不加载、
         「原文+译文 / 仅译文」两个按钮一直是禁用态。 */
      (function () {
        if (!CALR.fulltext.transPackFor) return;
        var want = null;
        if (uiLang !== origLang && CALR.fulltext.transPackFor(id, uiLang)) want = uiLang;
        else if (origLang !== 'en' && CALR.fulltext.transPackFor(id, 'en')) want = 'en';
        if (!want || CALR.fulltext.transMerged(id, want)) return;
        CALR.fulltext.ensureTrans(id, want).then(function (ok) { if (ok) CALR.app.refresh(); });
      })();

      var transLang = null;
      if (uiLang !== origLang && avail.indexOf(uiLang) >= 0) transLang = uiLang;
      else if (uiLang !== 'en' && origLang !== 'en' && avail.indexOf('en') >= 0) transLang = 'en';
      var readMode = query.read || (transLang ? 'both' : 'orig');
      if (['both', 'orig', 'trans'].indexOf(readMode) < 0) readMode = 'both';
      if (readMode === 'trans' && !transLang) readMode = 'orig';
      var dl = origLang;   /* 保留给打印与引用 */
      var fontSize = query.fs || 'normal';
      var related = S().related(law, 5);
      var citedBy = S().citedByLaws(law);
      var revisions = S().revisionsOf(law);
      var terms = S().termsOfLaw(law);
      var chapters = U().uniq(law.articles.map(function (a) { return tr(a.chapter) || ''; }));
      /* 条文目录分组：优先展示「章」，点击章再展开其下的条 */
      var tocGroups = buildTocGroups(law);

      /* 阅读进度条 */
      var bar = document.createElement('div');
      bar.className = 'reader-bar';
      bar.innerHTML = '<div class="reader-bar__fill" id="reader-fill"></div>';
      document.body.appendChild(bar);
      function onScroll() {
        if (!document.body.contains(bar)) { window.removeEventListener('scroll', onScroll); return; }
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        var fill = U().$('#reader-fill');
        if (fill) fill.style.width = pct.toFixed(1) + '%';
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      setTimeout(onScroll, 60);

      var altTitles = U().altTitles(law.title, CALR.i18n.lang());

      /* 信息表字段：多版本记录（携带 versionDate）额外列出「版本日期」，用于区分同标题的新旧版本 */
      var metaCells = [
        { label: t('制定机关'), value: (CALR.ui.orgLabel ? CALR.ui.orgLabel(tr(law.issuingBody)) : tr(law.issuingBody)) },
        { label: t('文号'), value: law.docNumber || '—' },
        { label: t('公布日期'), value: U().fmtDate(law.promulgatedDate) },
        { label: t('施行日期'), value: U().fmtDate(law.effectiveDate) }
      ];
      if (law.versionDate) metaCells.push({ label: t('版本日期'), value: U().fmtDate(law.versionDate) });
      metaCells = metaCells.concat([
        { label: t('时效性'), html: C().statusTag(law.status) },
        { label: t('法律层级'), html: C().levelTag(law.level) },
        { label: t('条文数量'), value: law.coverage === 'full' || law.coverage === 'catalog' ? (law.articleCount || law.articles.length) + ' ' + t('条') : '—' },
        { label: t('数据来源'), html: sourceCell(law) }
      ]);

      main.innerHTML = '' +
      '<div class="container page">' +
        '<div class="print-header"><strong>' + esc(tr(law.title)) + '</strong> · ' + esc(S().countryName(law.country)) + ' · ' +
          esc(law.docNumber || '') + '<br><span class="mini">' + esc(t('来源：中国—东盟法律法规数据库')) + '</span></div>' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: S().countryName(law.country), href: '#/country/' + law.country },
          { text: S().levelName(law.level), href: '#/search?country=' + law.country + '&level=' + law.level }, { text: tr(law.title) }]) +

        '<div class="layout-2col">' +
          '<div>' +
            '<div class="law-head">' +
              '<h1 class="law-title-zh">' + esc(tr(law.title)) + '</h1>' +
              (altTitles.length ? '<div class="law-title-alt">' + altTitles.map(function (a) {
                return '<span>' + esc(LANG_NAME[a.lang] || a.lang) + '：' + esc(a.text) + '</span>';
              }).join('') + '</div>' : '') +
              '<div class="row">' +
                /* 层级 / 时效性 / 收录形态已在下方信息表中列明，此处不再重复 */
                C().topicTags(law, 4) +
              '</div>' +
            '</div>' +

            C().metaGrid(metaCells) +
            /* 条文完整性说明条已按要求移除；收录情况在「数据来源」字段与数据来源页呈现 */
            (law.coverage === 'excerpt'
              ? '<div class="banner" style="margin-bottom:14px"><span class="banner__icon">' + CALR.ui.icon('info') + '</span><div>' +
                    '</div></div>'
              : '') +

            /* 版本说明：多版本记录（B 层，携带 amendedNote）展示版本关系与施行信息 */
            (law.amendedNote
              ? '<div class="banner" style="margin-bottom:14px"><span class="banner__icon">' + CALR.ui.icon('info') + '</span><div>' +
                esc(t('版本说明') + '：' + law.amendedNote) + '</div></div>'
              : '') +

            (law.status === 'repealed' && law.repealedDate
              ? '<div class="banner banner--warn" style="margin-bottom:14px"><span class="banner__icon">' + CALR.ui.icon('alert') + '</span><div>' +
                esc(t('本法规已于') + U().fmtDate(law.repealedDate) + t('废止，请在引用前核验现行有效版本。')) +
                (law.repealedBy ? ' ' + esc(t('废止依据：')) + esc(law.repealedBy) : '') + '</div></div>'
              : '') +
            (law.status === 'pending'
              ? '<div class="banner" style="margin-bottom:14px"><span class="banner__icon">⏳</span><div>' +
                esc(t('尚未生效：预计') + U().fmtDate(law.effectiveDate) + t('施行（') + U().countdown(law.effectiveDate) + t('）。当前引用请以现行法为准。')) + '</div></div>'
              : '') +

            (showText
              ? '<div class="reader-toolbar">' +
                  '<span class="reader-toolbar__group"><span class="mini muted">' + esc(t('阅读模式')) + '</span>' +
                    '<span class="btn-group">' +
                      readModeBtn('both', t('原文+译文'), readMode, !!transLang) +
                      readModeBtn('orig', t('仅原文'), readMode, true) +
                      readModeBtn('trans', t('仅译文'), readMode, !!transLang) +
                    '</span>' +
                    '<span class="mini muted" style="margin-left:8px">' +
                      esc(t('原文')) + '：' + esc(LANG_NAME[origLang] || origLang) +
                      (transLang ? '　' + esc(t('译文')) + '：' + esc(LANG_NAME[transLang] || transLang)
                                 : '　' + esc(t('暂无当前语言译文'))) +
                    '</span></span>' +
                  '<span class="reader-toolbar__sep"></span>' +
                  '<span class="reader-toolbar__group"><span class="mini muted">' + esc(t('字号')) + '</span>' +
                    '<button class="btn btn--outline btn--sm" data-fs="normal">A</button>' +
                    '<button class="btn btn--outline btn--sm" data-fs="large">A+</button>' +
                    '<button class="btn btn--outline btn--sm" data-fs="xlarge">A++</button></span>' +
                  '<span class="reader-toolbar__sep"></span>' +
                  '<span class="reader-toolbar__group">' +
                    '<button class="btn btn--outline btn--sm" id="toggle-all">' + esc(t('展开全部条文')) + '</button>' +
                    '<button class="btn btn--outline btn--sm" id="theme-toggle">' + esc(t('深色模式')) + '</button>' +
                    '<button class="btn btn--outline btn--sm" id="tts-btn">' + CALR.ui.icon('volume') + ' ' + esc(t('全文朗读')) + '</button>' +
                  '</span>' +
                  '<span class="reader-toolbar__sep"></span>' +
                  '<span class="reader-toolbar__group">' +
                          '<button class="btn btn--outline btn--sm" id="export-pdf">' + esc(t('导出 PDF')) + '</button>' +
                    '<button class="btn btn--outline btn--sm" id="export-terms">' + esc(t('术语对照表')) + '</button>' +
                  '</span>' +
                  '<span class="reader-toolbar__sep"></span>' +
                  '<span class="reader-toolbar__group reader-toolbar__find">' +
                    '<span class="searchbox searchbox--sm law-find">' +
                      '<span class="searchbox__icon" aria-hidden="true">' + CALR.ui.icon('search') + '</span>' +
                      '<input class="searchbox__input" id="law-find-q" type="search" autocomplete="off" ' +
                        'placeholder="' + esc(t('法条号 / 片段 / 关键词')) + '" aria-label="' + esc(t('在本文中查找')) + '">' +
                    '</span>' +
                    '<button class="btn btn--outline btn--sm" id="law-find-btn" type="button">' + esc(t('查找')) + '</button>' +
                    '<span class="mini muted law-find__stat" id="law-find-stat" role="status" aria-live="polite"></span>' +
                  '</span>' +
                '</div>' +

                '<div class="card card--pad" id="law-body">' +
                  '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
                    '<h2 style="margin:0;font-size:var(--fs-h2)">' + esc(t('法规正文')) +
                      ' <span class="mini muted">' + esc(t('共')) + ' ' + law.articles.length + ' ' + esc(t('条')) + '</span></h2>' +
                    '<span class="mini muted" id="read-stat"></span>' +
                  '</div>' +
                  chapters.map(function (ch) {
                    var list = law.articles.filter(function (a) { return (tr(a.chapter) || '') === ch; });
                    return (ch ? '<h3 style="margin-top:18px;color:var(--calr-blue-600)">' + esc(ch) + '</h3>' : '') +
                      list.map(function (a) { return articleHtml(a, origLang, transLang, readMode); }).join('');
                  }).join('') +
                '</div>'
              : '') +

            '<div class="card card--pad" style="margin-top:16px">' +
              '<h3>' + esc(t('法规说明')) + '</h3>' +
              '<p class="small muted">' + esc(tr(law.summary)) + '</p>' +
              '<p class="mini muted" style="margin:0">' + esc(showText
                ? t('本文本取自官方法律数据库；如与官方最新公布版本存在差异，以官方公布文本为准。')
                : t('本平台已收录该法规的条目信息，条文文本正在校核，正式引用请以官方公布文本为准。')) + '</p>' +
            '</div>' +
          '</div>' +

          '<aside class="col-sidebar sticky-col">' +
            (showText
              ? '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('条文目录')) + '</h3>' +
                  '<span class="mini muted" style="margin-left:auto">' + tocGroups.length + ' ' + esc(t('章')) + ' · ' + law.articles.length + ' ' + esc(t('条')) + '</span></div>' +
                  '<div class="card__body"><ul class="toc" id="toc">' +
                    tocGroups.map(function (g, gi) {
                      return '<li class="toc-group' + (tocGroups.length === 1 ? ' is-open' : '') + '" data-group="' + gi + '">' +
                        '<button type="button" class="toc-group__head" aria-expanded="' + (tocGroups.length === 1 ? 'true' : 'false') + '">' +
                          '<span class="toc-group__caret" aria-hidden="true">▸</span>' +
                          '<span class="toc-group__name">' + esc(g.title) + '</span>' +
                          '<span class="toc-group__count">' + g.items.length + '</span>' +
                        '</button>' +
                        '<ul class="toc-group__list">' +
                          g.items.map(function (a) {
                            return '<li><a href="#/law/' + esc(law.id) + '" data-anchor="' + esc(a.id) + '">' +
                              esc(tr(a.noLabel) || ('第 ' + a.no + ' 条')) + ' ' + esc(U().truncate(tr(a.heading), 16)) + '</a></li>';
                          }).join('') +
                        '</ul>' +
                      '</li>';
                    }).join('') + '</ul></div></div>'
              : '') +

            /* 法规工具：跨语言条款比对与术语翻译入口（按规范由首页迁移至此） */
            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('法规工具')) + '</h3></div>' +
              '<div class="card__body"><div class="col">' +
                '<a class="btn btn--outline btn--sm" href="' + esc('#/compare' + (showText && law.articles[0] ? '?s0=' + law.articles[0].id : '')) + '">' + CALR.ui.icon('scales') + ' ' + esc(t('加入跨语言条款比对')) + '</a>' +
                '<a class="btn btn--outline btn--sm" href="#/terms">' + CALR.ui.icon('globe') + ' ' + esc(t('法律术语对照')) + '</a>' +
                (showText ? '<button class="btn btn--outline btn--sm" id="export-terms3">' + CALR.ui.icon('list') + ' ' + esc(t('导出本法术语对照表')) + '</button>' : '') +
              '</div>' +
              '<p class="mini muted" style="margin:10px 0 0">' + esc(t('可与东盟其他国家条文并排比对，或查看法律术语在各国语言中的对照译法。')) + '</p></div></div>' +

            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('相关法规推荐')) + '</h3></div>' +
              '<div class="card__body">' + (related.length ? related.map(function (l) {
                return '<div style="margin-bottom:10px"><a href="#/law/' + esc(l.id) + '">' + esc(tr(l.title)) + '</a>' +
                  '<div class="mini muted">' + esc(S().countryName(l.country)) + ' · ' + esc(S().levelName(l.level)) + ' · ' + esc(U().fmtDate(l.promulgatedDate, false)) + '</div></div>';
              }).join('') : '<p class="mini muted">' + esc(t('暂无相关法规')) + '</p>') + '</div></div>' +

            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('被引用情况')) + '</h3>' +
              '<span class="tag tag--outline" style="margin-left:auto">' + (law.citationCount || 0) + ' ' + esc(t('次')) + '</span></div>' +
              '<div class="card__body">' + (citedBy.length ? citedBy.map(function (l) {
                return '<div style="margin-bottom:8px"><a href="#/law/' + esc(l.id) + '">' + esc(tr(l.title)) + '</a></div>';
              }).join('') : '<p class="mini muted">' + esc(t('暂未收录引用本法条的法规。')) + '</p>') + '</div></div>' +

            '<div class="card" style="margin-bottom:16px" id="law-history-card"><div class="card__head"><h3 class="card__title">' + esc(t('版本与变迁')) + '</h3></div>' +
              '<div class="card__body" id="law-history">' + (revisions.length
                ? '<ul class="timeline">' + revisions.map(function (r) {
                    return '<li><div class="timeline__date">' + esc(r.date || '') + '</div>' +
                      '<div class="timeline__text">' + esc(tr(r.summary)) + '</div>' +
                      ((r.changes || []).length ? '<button class="btn btn--ghost btn--sm" data-revision="' + esc(r.id) + '" style="margin-top:6px">' + esc(t('查看修订对照')) + '</button>' : '') + '</li>';
                  }).join('') + '</ul>'
                : '<p class="mini muted">' + esc(law.status === 'amended'
                    ? t('本法已修订，修订对照记录将随官方公报版本同步补充；当前展示的为最新生效版本文本。')
                    : t('暂无修订记录。')) + '</p>') + '</div></div>' +

            '<div class="card" style="margin-bottom:16px"><div class="card__head"><h3 class="card__title">' + esc(t('本法术语')) + '</h3>' +
              '<span class="mini muted" style="margin-left:auto">' + terms.length + ' ' + esc(t('条')) + '</span></div>' +
              '<div class="card__body"><div class="row">' + terms.slice(0, 12).map(function (tm) {
                return '<span class="tag tag--blue tag--clickable" data-term="' + esc(tm.id) + '">' + esc(tm.zh) + '</span>';
              }).join('') + '</div>' +
              '<p class="mini muted" style="margin:10px 0 0">' + esc(showText
                ? t('正文中带下划虚线的词可悬停或点击查看东盟各国语言译法与释义。')
                : t('可通过“法律术语对照”查看相关术语在各语种中的译法。')) + '</p></div></div>' +

            '<div class="card"><div class="card__head"><h3 class="card__title">' + esc(t('下载与引用')) + '</h3></div>' +
              '<div class="card__body"><div class="col">' +
                '<button class="btn btn--outline btn--sm" id="export-pdf2">' + CALR.ui.icon('print') + ' ' + esc(t('导出 PDF（原文版/翻译版）')) + '</button>' +
                '<button class="btn btn--outline btn--sm" id="export-terms2">' + CALR.ui.icon('list') + ' ' + esc(t('导出术语对照表（CSV）')) + '</button>' +
                '<button class="btn btn--outline btn--sm" id="copy-cite2">' + CALR.ui.icon('copy') + ' ' + esc(t('复制本法规引用格式')) + '</button>' +
              '</div>' +
              /* 引注格式选择：四种规范/常用格式 */
              '<div class="row" style="margin-top:12px;gap:6px;flex-wrap:wrap" id="cite-forms">' +
                CITE_FORMS.map(function (f2) {
                  return '<button class="btn btn--ghost btn--sm' + (f2.id === 'gbt' ? ' is-active' : '') +
                    '" data-cite-form="' + f2.id + '" title="' + esc(f2.hint) + '">' + esc(f2.label) + '</button>';
                }).join('') +
              '</div>' +
              '<div class="citation-box" style="margin-top:8px" id="cite-text">' + esc(citeOf(law, 'gbt')) + '</div>' +
              '<p class="mini muted" style="margin:6px 0 0" id="cite-hint">' + esc(CITE_FORMS[0].hint) + '</p>' +
              '</div></div>' +
          '</aside>' +
        '</div>' +
      '</div>';

      /* 版本与变迁：接口是异步的，HTML 就位后填进侧栏卡片 */
      renderHistoryData();

      /* ---------- 交互 ---------- */
      if (fontSize !== 'normal') document.documentElement.setAttribute('data-fontsize', fontSize);

      U().$$('[data-fs]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          var fs = b.getAttribute('data-fs');
          document.documentElement.setAttribute('data-fontsize', fs);
          CALR.router.go(CALR.router.buildUrl('/law/' + law.id, { lang: dl, fs: fs }));
        });
      });
      /* 阅读模式切换：原文+译文 / 仅原文 / 仅译文 */
      U().$$('[data-read]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          CALR.router.go(CALR.router.buildUrl('/law/' + law.id, { read: b.getAttribute('data-read'), fs: fontSize }));
        });
      });
      U().on(U().$('#theme-toggle', main), 'click', function () { CALR.app.toggleTheme(); });
      U().on(U().$('#export-pdf', main), 'click', function () { window.print(); });
      U().on(U().$('#export-pdf2', main), 'click', function () { window.print(); });
      var curForm = 'gbt';

      /* 引注格式切换 */
      var citeBox = U().$('#cite-text', main);
      var citeHint = U().$('#cite-hint', main);
      U().$$('[data-cite-form]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          curForm = b.getAttribute('data-cite-form');
          U().$$('[data-cite-form]', main).forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          if (citeBox) citeBox.textContent = citeOf(law, curForm);
          var hit = CITE_FORMS.filter(function (f2) { return f2.id === curForm; })[0];
          if (citeHint && hit) citeHint.textContent = hit.hint;
        });
      });
      U().on(U().$('#copy-cite', main), 'click', doCopy);
      U().on(U().$('#copy-cite2', main), 'click', doCopy);
      U().on(U().$('#export-terms', main), 'click', exportTerms);
      U().on(U().$('#export-terms2', main), 'click', exportTerms);
      var terms3 = U().$('#export-terms3', main);
      if (terms3) U().on(terms3, 'click', exportTerms);

      /* ---------- 文内查找：滚动到匹配位置；重复查找则依次向下 ---------- */
      var findState = { matches: [], idx: -1, query: '', mark: null };

      function clearFindMark() {
        var mk = findState.mark;
        if (mk && mk.parentNode) {
          var pa = mk.parentNode;
          pa.replaceChild(document.createTextNode(mk.textContent), mk);
          pa.normalize();
        }
        findState.mark = null;
      }

      function collectFindMatches(q) {
        var root = U().$('#law-body', main) || main;
        var out = [], nq = q.toLowerCase();
        var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: function (n) {
            if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            var tag = n.parentNode && n.parentNode.nodeName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'BUTTON' || tag === 'MARK' ||
                tag === 'INPUT' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        var n;
        while ((n = w.nextNode())) {
          var v = n.nodeValue.toLowerCase(), i = v.indexOf(nq);
          while (i >= 0) { out.push({ node: n, start: i, end: i + nq.length }); i = v.indexOf(nq, i + nq.length); }
        }
        return out;
      }

      /* 命中若落在已折叠的条文内，先展开 */
      function expandFindTarget(node) {
        var el = node.parentNode;
        while (el && el !== main) {
          if (el.classList && el.classList.contains('article') && el.classList.contains('is-collapsed')) {
            el.classList.remove('is-collapsed');
            var btn = U().$('[data-article-toggle="' + el.id + '"]', main);
            if (btn) btn.textContent = t('收起');
          }
          el = el.parentNode;
        }
      }

      function scrollToRange(node) {
        var r = document.createRange();
        r.setStart(node, 0);
        r.setEnd(node, node.nodeValue ? node.nodeValue.length : 0);
        var rect = r.getBoundingClientRect();
        var head = U().$('.app-header');
        var off = (head ? head.offsetHeight : 0) + 18;
        var cur = window.pageYOffset || document.documentElement.scrollTop || 0;
        var target = Math.max(0, rect.top + cur - off);
        /* 用即时滚动：跨数千像素时 smooth 又慢又可能被浏览器/无头环境跳过 */
        window.scrollTo(0, target);
      }

      function doFind() {
        var inp = U().$('#law-find-q', main);
        var stat = U().$('#law-find-stat', main);
        if (!inp) return;
        var q = (inp.value || '').trim();
        if (!q) {
          clearFindMark();
          findState = { matches: [], idx: -1, query: '', mark: null };
          if (stat) stat.textContent = '';
          return;
        }
        var same = (q === findState.query);
        var prevIdx = findState.idx;
        clearFindMark();
        findState.matches = collectFindMatches(q);
        findState.query = q;
        var total = findState.matches.length;
        if (!total) {
          findState.idx = -1;
          if (stat) stat.textContent = '';
          U().toast(t('未找到') + '「' + q + '」', 'warn');
          return;
        }
        /* 同一检索词再次查找 → 下一处；换了检索词 → 从第一处开始 */
        findState.idx = (same && prevIdx >= 0) ? (prevIdx + 1) % total : 0;
        var m = findState.matches[findState.idx];
        expandFindTarget(m.node);
        try {
          var r = document.createRange();
          r.setStart(m.node, m.start);
          r.setEnd(m.node, m.end);
          var mk = document.createElement('mark');
          mk.className = 'law-find-hit';
          r.surroundContents(mk);
          findState.mark = mk;
          scrollToRange(mk.firstChild || mk);
        } catch (e) {
          scrollToRange(m.node);   /* 跨节点等异常情形：至少滚动到位 */
        }
        if (stat) stat.textContent = (findState.idx + 1) + ' / ' + total;
      }

      var fq = U().$('#law-find-q', main);
      if (fq) {
        U().on(fq, 'keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); doFind(); }
        });
      }
      var fb = U().$('#law-find-btn', main);
      if (fb) U().on(fb, 'click', function () { doFind(); });
      U().on(U().$('#toggle-all', main), 'click', function () {
        var collapsed = U().$$('.article.is-collapsed', main).length > 0;
        U().$$('.article', main).forEach(function (el) { el.classList.toggle('is-collapsed', !collapsed); });
        U().$$('[data-article-toggle]', main).forEach(function (b) { b.textContent = collapsed ? t('收起') : t('展开'); });
        this.textContent = collapsed ? t('折叠全部条文') : t('展开全部条文');
      });

      /* 条文折叠 */
      U().$$('[data-article-toggle]', main).forEach(function (btn) {
        U().on(btn, 'click', function (e) {
          e.preventDefault();
          var art = U().$('#' + btn.getAttribute('data-article-toggle'), main);
          if (!art) return;
          var collapsed = art.classList.toggle('is-collapsed');
          btn.textContent = collapsed ? t('展开') : t('收起');
        });
      });

      /* 条文目录：点击「章」展开／收起该章下的条文 */
      U().$$('.toc-group__head', main).forEach(function (btn) {
        U().on(btn, 'click', function () {
          var group = btn.parentNode;
          var open = group.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });

      /* 目录滚动定位（若目标条所属章节处于收起状态，先展开） */
      U().$$('[data-anchor]', main).forEach(function (a) {
        U().on(a, 'click', function (e) {
          e.preventDefault();
          var el = U().$('#' + a.getAttribute('data-anchor'), main);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          U().$$('#toc a', main).forEach(function (x) { x.classList.remove('is-active'); });
          a.classList.add('is-active');
        });
      });

      /* 深链定位到具体法条：#/law/<lawId>?art=<articleId>
         AI 问答中的引用链接会带 art 参数，跳转后自动展开该条、滚动到位并短暂高亮。 */
      if (query.art) {
        (function () {
          var want = String(query.art);
          var el = null;
          try { el = U().$('#' + want, main); } catch (e) { el = null; }
          if (!el) {
            /* 兜底：允许只传条号（"105"）或 "A105"，按 lawId-A<no> 拼出元素 id */
            var m = want.match(/(\d+)\s*$/);
            if (m) { try { el = U().$('#' + law.id + '-A' + m[1], main); } catch (e2) { el = null; } }
          }
          if (!el) return;
          if (el.classList.contains('is-collapsed')) {
            el.classList.remove('is-collapsed');
            var tb = U().$('[data-article-toggle="' + el.id + '"]', main);
            if (tb) tb.textContent = t('收起');
          }
          setTimeout(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('is-target');
            setTimeout(function () { el.classList.remove('is-target'); }, 2800);
          }, 60);
        })();
      }

      /* 术语弹窗（悬停 / 聚焦 / 点击） */
      bindTermPopups(main);

      /* 修订对照 */
      U().$$('[data-revision]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          var r = revisions.filter(function (x) { return x.id === b.getAttribute('data-revision'); })[0];
          if (!r) return;
          U().modal({
            title: t('修订对照') + ' · ' + (r.date || ''),
            wide: true,
            body: '<p class="small muted">' + esc(tr(r.summary)) + '</p>' +
              '<table class="table"><thead><tr><th>' + esc(t('条文')) + '</th><th>' + esc(t('修订前')) + '</th><th>' + esc(t('修订后')) + '</th></tr></thead><tbody>' +
              (r.changes || []).map(function (ch) {
                var a = S().resolveArticle(ch.articleId);
                return '<tr><td>' + esc(a ? (tr(a.noLabel) || ('第 ' + a.no + ' 条')) : ch.articleId) + '</td>' +
                  '<td style="background:var(--calr-danger-bg)">' + esc(tr(ch.before)) + '</td>' +
                  '<td style="background:var(--calr-success-bg)">' + esc(tr(ch.after)) + '</td></tr>';
              }).join('') + '</tbody></table>',
            foot: '<button class="btn btn--outline" data-modal-close>' + esc(t('关闭')) + '</button>'
          });
        });
      });

      /* TTS */
      var ttsBtn = U().$('#tts-btn', main);
      var speaking = false;
      U().on(ttsBtn, 'click', function () {
        if (!('speechSynthesis' in window)) { U().toast(t('当前浏览器不支持语音朗读'), 'warn'); return; }
        if (speaking) {
          window.speechSynthesis.cancel();
          speaking = false;
          ttsBtn.innerHTML = CALR.ui.icon('volume') + ' ' + esc(t('全文朗读'));
          return;
        }
        var lang = dl === 'auto' ? CLang(avail) : dl;
        var text = tr(law.title) + '。' + law.articles.map(function (a) {
          return (tr(a.noLabel) || '') + (tr(a.heading) || '') + '。' + (U().tr(a.text, lang) || '');
        }).join(' ');
        var u = new SpeechSynthesisUtterance(U().truncate(text, 4000));
        u.lang = SPEECH[lang] || 'zh-CN';
        u.rate = 0.95;
        u.onend = function () { speaking = false; ttsBtn.innerHTML = CALR.ui.icon('volume') + ' ' + esc(t('全文朗读')); };
        speaking = true; ttsBtn.textContent = '⏹ ' + t('停止朗读');
        window.speechSynthesis.speak(u);
      });

      function CLang(availList) {
        var ui = CALR.i18n.lang();
        return availList.indexOf(ui) >= 0 ? ui : (availList.indexOf('zh') >= 0 ? 'zh' : availList[0]);
      }

      function doCopy() {
        U().copy(citationText(law)).then(function (ok) {
          U().toast(ok ? t('引用格式已复制到剪贴板') : t('复制失败，请手动选择文本复制'), ok ? 'ok' : 'warn');
        });
      }

      function exportTerms() {
        var rows = CALR.terms.glossaryRows(law, ['zh', 'en', 'vi', 'th', 'id', 'ms']);
        if (rows.length <= 1) { U().toast(t('本法暂无可导出的术语'), 'warn'); return; }
        U().download('CALR-术语对照表-' + law.id + '.csv', U().toCsv(rows), 'text/csv;charset=utf-8');
        U().toast(t('术语对照表已导出（CSV）'), 'ok');
      }
    }
  };

  /* 阅读模式按钮 */
  function readModeBtn(id, label, cur, enabled) {
    return '<button type="button" class="btn btn--sm' + (id === cur ? ' is-active' : '') + '" data-read="' + id + '"' +
      (enabled ? '' : ' disabled title="' + esc(CALR.i18n.t('暂无可用的译文')) + '"') + '>' + esc(label) + '</button>';
  }

  /* 各法域的官方文本语种（用于确定「原文」语种） */
  var COUNTRY_ORIG = {
    CN: 'zh', VN: 'vi', TH: 'th', ID: 'id', MY: 'ms', SG: 'en',
    PH: 'en', BN: 'ms', KH: 'km', LA: 'lo', MM: 'my', TL: 'en'
  };

  /* ---------------- 条文 HTML ---------------- */
  /** 在可用语种中挑选一个最合适的原文语种 */
  function available(law, avail, prefer) {
    var order = [prefer, 'vi', 'th', 'id', 'ms', 'lo', 'my', 'km', 'en', 'zh'];
    for (var i = 0; i < order.length; i++) { if (order[i] && avail.indexOf(order[i]) >= 0) return order[i]; }
    return avail[0];
  }

  /** 原文语种：官方全文以声明语种为准；其余按法域官方语言推定 */
  function originalLangOf(law, avail) {
    if (law.fullText && law.fullText.language && avail.indexOf(law.fullText.language) >= 0) {
      return law.fullText.language;
    }
    var guess = COUNTRY_ORIG[law.country];
    if (guess && avail.indexOf(guess) >= 0) return guess;
    return available(law, avail, guess);
  }

  /** 实际渲染所用的语言（回退后），用于避免"原文/译文"重复展示同一段文字 */
  function effectiveLang(text, requested) {
    if (!text || typeof text === 'string') return requested;
    if (text[requested]) return requested;
    var order = ['vi', 'th', 'id', 'ms', 'lo', 'my', 'km', 'en', 'zh'].concat(Object.keys(text));
    for (var i = 0; i < order.length; i++) { if (text[order[i]]) return order[i]; }
    return requested;
  }

  /**
   * 按「款」分段渲染：每个自然段独立成 <p>，使每一段都获得首行缩进
   * （此前整条文本作为一个块 ＋ white-space:pre-line，换行不会触发 text-indent，
   *   因此只有第一句缩进、后续各款顶格。）
   */
  function paraHtml(a, lang) {
    var raw = U().tr(a.text, lang) || '';
    return U().paragraphHtml(raw, function (paragraph) {
      var probe = {};
      Object.keys(a).forEach(function (k) { probe[k] = a[k]; });
      probe.text = {};
      probe.text[lang] = paragraph;
      return CALR.terms.annotate(probe, lang);
    }, 'article__p');
  }

  /**
   * 原文 + 译文对照渲染
   * @param a      条文
   * @param orig   原文语种（法规的官方文本语种）
   * @param trans  译文语种（当前界面语言，可能为空）
   * @param mode   'both' 原文+译文 | 'orig' 仅原文 | 'trans' 仅译文
   */
  function articleHtml(a, orig, trans, mode) {
    var hasOrig = !!(a.text && a.text[orig]);
    var hasTrans = !!(trans && a.text && a.text[trans]);

    /* 无原文时退回到任意可用语种 */
    var effOrig = hasOrig ? orig : effectiveLang(a.text, orig);
    var showOrig = (mode !== 'trans') && (hasOrig || !hasTrans);
    var showTrans = hasTrans && (mode === 'trans' || mode === 'both');

    var html = '<div class="article" id="' + esc(a.id) + '">' +
      '<div class="article__head">' +
        '<span class="article__no">' + esc(tr(a.noLabel) || ('第 ' + a.no + ' 条')) +
          /* 源文存在两套编号 / 同一编号多次出现时，用本地化标记区分（不改写原文标签） */
          (a.dupIndex ? ' <span class="article__dup">' + esc(t('第{n}处').replace('{n}', a.dupIndex)) + '</span>' : '') +
          (a.partIndex && a.partIndex > 1 ? ' <span class="article__dup">' + esc(t('第{n}套编号').replace('{n}', a.partIndex)) + '</span>' : '') +
        '</span>' +
        '<span class="article__heading">' + esc(tr(a.heading)) + '</span>' +
        '<button class="article__toggle" type="button" data-article-toggle="' + esc(a.id) + '">' + esc(t('收起')) + '</button>' +
      '</div>';

    if (showOrig) {
      html += (showTrans ? '<div class="article__lang-label">' + esc(t('原文')) + ' · ' + esc(LANG_NAME[effOrig] || effOrig) + '</div>' : '') +
        '<div class="article__text">' + paraHtml(a, effOrig) + '</div>';
    }
    if (showTrans) {
      html += '<div class="article__lang-label article__lang-label--trans">' + esc(t('译文')) + ' · ' + esc(LANG_NAME[trans] || trans) + '</div>' +
        '<div class="article__text article__text--trans">' + paraHtml(a, trans) + '</div>';
    }

    var alts = U().altTitles(a.text, effOrig, 2).filter(function (x) {
      return x.lang !== effOrig && x.lang !== trans;
    });
    if (alts.length) {
      html += '<div class="article__sub">' + alts.map(function (x) {
        return '<div>' + esc(LANG_NAME[x.lang] || x.lang) + '：' + esc(x.text) + '</div>';
      }).join('') + '</div>';
    }
    return html + '</div>';
  }

  /* ---------------- 术语弹窗绑定 ---------------- */
  function bindTermPopups(main) {
    /* 清理上一次渲染残留的术语弹窗，避免叠加 */
    U().$$('.term-pop').forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
    var pop = null, pinned = false, currentId = null;

    function show(target, termId) {
      var tm = S().term(termId);
      if (!tm) return;
      currentId = termId;
      if (!pop) {
        pop = document.createElement('div');
        pop.className = 'term-pop';
        document.body.appendChild(pop);
      }
      pop.innerHTML = CALR.terms.popupHtml(tm) +
        '<div class="row" style="margin-top:10px"><a class="btn btn--ghost btn--sm" href="#/terms?q=' + esc(tm.zh) + '">' + esc(t('在术语库中查看更多语言')) + '</a>' +
        '<button class="btn btn--ghost btn--sm" data-close-pop>' + esc(t('关闭')) + '</button></div>';
      var r = target.getBoundingClientRect();
      var top = r.bottom + window.scrollY + 8;
      var left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - 440);
      pop.style.top = Math.max(8, top) + 'px';
      pop.style.left = Math.max(8, left) + 'px';
      pop.style.display = 'block';
      U().on(U().$('[data-close-pop]', pop), 'click', hide);
    }
    function hide() {
      if (pinned) return;
      if (pop) pop.style.display = 'none';
    }
    function hideForce() { pinned = false; if (pop) pop.style.display = 'none'; }

    U().$$('.term-ref', main).forEach(function (el) {
      var id = el.getAttribute('data-term');
      /* 只在「鼠标单击」时展示术语释义；悬停与单纯聚焦都不弹窗 */
      function open(e) {
        if (e) e.preventDefault();
        /* 再次单击同一术语 → 收起（切换语义） */
        if (pinned && currentId === id) { hideForce(); return; }
        pinned = false;
        show(el, id);
        pinned = true;
      }
      U().on(el, 'click', open);
      /* 键盘可达：Enter / Space 等同单击，但 Tab 聚焦不会自动弹窗 */
      U().on(el, 'keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') open(e);
      });
    });

    var cards = U().$$('.tag--clickable[data-term]', main);
    cards.forEach(function (el) {
      U().on(el, 'click', function (e) { e.preventDefault(); pinned = false; show(el, el.getAttribute('data-term')); pinned = true; });
    });

    U().on(document, 'click', function (e) {
      if (!pinned) return;
      if (pop && (pop.contains(e.target) || e.target.closest && e.target.closest('.term-ref, [data-term]'))) return;
      hideForce();
    });
    U().on(document, 'keydown', function (e) { if (e.key === 'Escape') hideForce(); });
  }

  /* 条文目录分组：按「章」聚合；无章节信息时归入单一分组 */
  function buildTocGroups(law) {
    var groups = [], index = {};
    law.articles.forEach(function (a) {
      var title = tr(a.chapter) || t('全部条文');
      if (!(title in index)) { index[title] = groups.length; groups.push({ title: title, items: [] }); }
      groups[index[title]].items.push(a);
    });
    return groups;
  }

  /* 数据来源单元格：中国法统一显示为「中国国家法律法规数据库」 */
  var CN_SOURCE_NAME = '中国国家法律法规数据库';
  function sourceCell(law) {
    var ft = law.fullText || {};
    if (law.country === 'CN') {
      var url = /^https?:/i.test(ft.sourceUrl || '') ? ft.sourceUrl
        : (/^https?:/i.test((law.source && law.source.url) || '') ? law.source.url : '');
      return url
        ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(CN_SOURCE_NAME) + '</a>'
        : esc(CN_SOURCE_NAME);
    }
    if (/^https?:/i.test(ft.sourceUrl || '')) {
      return '<a href="' + esc(ft.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(CALR.ui.orgLabel(ft.sourceName) || t('官方来源')) + '</a>' +
        '';
    }
    if (law.source && law.source.url) {
      return '<a href="' + esc(law.source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(law.source.name) + '</a>';
    }
    return esc(CALR.ui.orgLabel((law.source && law.source.name) || ft.sourceName) || '—');
  }

  /* ==================== 规范引注格式 ====================
     原来只有一句自然语言（且会重复国名：「中国《中华人民共和国民法典》」），
     不符合任何学术规范。这里提供四种常用格式，并支持条级（第 X 条）引用。 */

  var CITE_FORMS = [
    { id: 'gbt',    label: 'GB/T 7714-2015', hint: '中文学术标准（法学论文、裁判文书）' },
    { id: 'blue',   label: 'Bluebook',       hint: '英美法系（涉外业务、国际仲裁）' },
    { id: 'short',  label: '简化式',          hint: '日常执业书写' },
    { id: 'full',   label: '完整式',          hint: '含来源链接与访问日期，便于核验' }
  ];

  /** 去掉标题里的书名号与重复国名前缀，避免「中国《中华人民共和国民法典》」 */
  function bareTitle(law) {
    var T = law.title || {};
    var name = tr(T);
    if (name === null || name === undefined || name === '') name = law.id;
    name = String(name).replace(/^[\s《]+|[\s》]+$/g, '');
    /* 标题本身已含国名时不再前置 */
    return name;
  }

  /** 带国名的书名号标题：标题本身已含国名时不重复前置，避免「中国《中华人民共和国民法典》」 */
  function titled(law, name) {
    var cn = S().countryName(law.country);
    if (/^(中华人民共和国|中国)/.test(name) || name.indexOf(cn) === 0) {
      return '《' + name + '》';
    }
    return cn + '《' + name + '》';
  }

  function podDate(d) {
    if (!d) return '';
    var m = String(d).match(/^(\d{4})[-年/]?(\d{2})?[-月/]?(\d{2})?/);
    if (!m) return String(d);
    return m[1] + (m[2] ? '-' + m[2] : '') + (m[3] ? '-' + m[3] : '');
  }

  function cnDate(d) {
    if (!d) return '';
    var m = String(d).match(/^(\d{4})[-年/]?(\d{2})?[-月/]?(\d{2})?/);
    if (!m) return String(d);
    var out = m[1] + '年';
    if (m[2]) out += parseInt(m[2], 10) + '月';
    if (m[3]) out += parseInt(m[3], 10) + '日';
    return out;
  }

  function accessDate() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
      '-' + String(d.getDate()).padStart(2, '0');
  }

  /**
   * 生成引注文本
   * @param {object} law 法规对象
   * @param {string} form gbt | blue | short | full
   * @param {object} opt  { no: 条号, noLabel: '第三十二条', heading: '立法目的' }
   */
  function citeOf(law, form, opt) {
    form = form || 'gbt';
    opt = opt || {};
    var name = bareTitle(law);
    var cn = S().countryName(law.country);
    var T = law.title || {};
    var en = (T.en && T.en !== name) ? String(T.en) : '';
    var org = tr(law.issuingBody) || cn + '立法机关';
    var promul = podDate(law.promulgatedDate);
    var effect = podDate(law.effectiveDate);
    var docNo = law.docNumber ? String(law.docNumber) : '';
    var art = opt.noLabel ? String(opt.noLabel) : (opt.no ? ('第' + opt.no + '条') : '');
    var url = 'https://calr.example.org/#/law/' + law.id;

    if (form === 'gbt') {
      /* GB/T 7714-2015：主要责任者. 题名[文献类型标志]. 出版地: 出版者, 出版年: 引文页码.
         法规按「[Z] 其他」处理（法学界通行做法） */
      var g = org + '. ' + name + '[Z]';
      if (promul) g += '. ' + promul;
      if (art) g += ': ' + art;
      return g + '.';
    }

    if (form === 'blue') {
      /* Bluebook 21st ed. 外国法/法规：Title (Year), art. N. */
      var b = en || name;
      var yr = promul ? promul.slice(0, 4) : (effect ? effect.slice(0, 4) : '');
      var bb = b + (yr ? ' (' + yr + ')' : '');
      if (art) bb += ', ' + (opt.no ? 'art. ' + opt.no : 'art. ' + art);
      return bb + '.';
    }

    if (form === 'short') {
      /* 简化式：国名 + 书名号标题 + 条 + 文号（标题已含国名时不重复） */
      var sh = titled(law, name);
      if (docNo) sh += '（' + docNo + '）';
      if (art) sh += art;
      return sh + '。';
    }

    /* 完整式：含公布/施行、来源与访问日期 */
    var f = titled(law, name) + (en ? '（' + en + '）' : '');
    if (docNo) f += '，' + docNo;
    if (promul) f += '，' + cnDate(promul) + '公布';
    if (effect) f += '，' + cnDate(effect) + '施行';
    if (art) f += '，' + art;
    f += '。来源：中国—东盟法律法规数据库（CALR），' + url + '，访问日期 ' + accessDate() + '。';
    return f;
  }

  /** 兼容旧调用点：默认给 GB/T 7714 */
  function citationText(law) {
    return citeOf(law, 'gbt');
  }
})(typeof window !== 'undefined' ? window : globalThis);
