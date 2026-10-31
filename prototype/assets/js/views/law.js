/* ==========================================================================
   CALR · views/law.js —— 法规详情页与阅读体验 + 术语内联释义
   --------------------------------------------------------------------------
   2026-10-29 改版（用户要求）：
     · 左栏只保留「条文目录」，右侧为法律主体内容；容器改用宽版并收窄目录列；
     · 标题区只展示「当前界面语言主标题 + 小号浅色【原文名称】」，不再罗列语言别名；
     · 标题下方新增一行「基本信息」：国旗、时效性、制定机关、文号、公布日期、施行日期；
     · 「版本与变迁」时间线移到右侧正文列，每条历史版本可点击跳转到对应 lawId；
     · 已下线的侧栏卡片及其 JS 事件绑定（导出/引用/术语表/比对入口等）一并移除。
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

  /* 各法域的官方文本语种（用于确定「原文」语种与原文名称） */
  var COUNTRY_ORIG = {
    CN: 'zh', VN: 'vi', TH: 'th', ID: 'id', MY: 'ms', SG: 'en',
    PH: 'en', BN: 'ms', KH: 'km', LA: 'lo', MM: 'my', TL: 'pt'
  };

  /* 少量本页专用标签：数据语言包里没有对应键，按界面语言就地取词，缺当前语言回退英文 */
  var LOCAL_LABELS = {
    basic: { zh: '基本信息', en: 'Basic information', vi: 'Thông tin cơ bản', th: 'ข้อมูลพื้นฐาน', id: 'Informasi dasar', ms: 'Maklumat asas' },
    currentVersion: { zh: '当前版本', en: 'Current version', vi: 'Phiên bản hiện hành', th: 'ฉบับปัจจุบัน', id: 'Versi saat ini', ms: 'Versi semasa' },
    historyVersions: { zh: '历史版本', en: 'Historical versions', vi: 'Phiên bản trước', th: 'ฉบับก่อนหน้า', id: 'Versi sebelumnya', ms: 'Versi terdahulu' },
    revisionLog: { zh: '修订记录', en: 'Revision history', vi: 'Lịch sử sửa đổi', th: 'ประวัติการแก้ไข', id: 'Riwayat revisi', ms: 'Sejarah pindaan' },
    openVersion: { zh: '进入该版本', en: 'Open this version', vi: 'Mở phiên bản này', th: 'เปิดฉบับนี้', id: 'Buka versi ini', ms: 'Buka versi ini' },
    noVersions: { zh: '暂无其他历史版本记录。', en: 'No other historical versions recorded.', vi: 'Chưa ghi nhận phiên bản trước nào.', th: 'ยังไม่มีบันทึกฉบับก่อนหน้า', id: 'Belum ada versi sebelumnya.', ms: 'Tiada versi terdahulu direkodkan.' }
  };
  function L(key) {
    var m = LOCAL_LABELS[key] || {};
    var lang = CALR.i18n.lang();
    return m[lang] || m.en || m.zh || key;
  }

  views.law = {
    render: function (main, params, query) {
      var id = params[0];

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
      /* 条文尚未完整载入：先载入所属分卷/接口，再重新渲染。
         注意守卫是 coverage !== 'full'，不是 === 'catalog' ——
         有一批法规在 dataset-core 里的 coverage 是 'excerpt'（只有几条摘录），
         完整条文在 data/fulltext/*.js 里，以前靠启动时的 loadAll() 合并，
         loadAll 移除后必须在这里按需加载，否则永远只显示那几条摘录。 */
      /* 是否需要按需加载条文：
         不再只看 coverage，而是看「条文是否真的已经在手上」。
         原因：API 模式下 /api/laws/compact 返回 coverage='full' 但**不带 articles**
         （articleCount 有值），一旦某条路径没把它降级成 catalog，
         旧守卫会认为"已经加载好了"，导致条文永远为空、页面显示"条文文本正在校核"。
         这里改为：只要这部法本该有条文（articleCount>0 或有分卷）且当前为空，就尝试加载。 */
      var _hasArts = !!(law.articles && law.articles.length);
      /* 该加载的情形（任一成立）：
           ① coverage 不是 full —— 说明手上最多只有摘录，需要取全文
               （静态 core 里 CN-DATA-2021 就是 4 条摘录、coverage='excerpt'）
           ② 条文为空但声称有条文数 —— API 模式下 compact 只给 articleCount 不给 articles
         不加载的情形：coverage='full' 且已有条文，说明已经加载好了。 */
      var _expectArts = (Number(law.articleCount) || 0) > 0 ||
                        !!(CALR.fulltext && CALR.fulltext.packFor && CALR.fulltext.packFor(id));
      var _needLoad = _expectArts && (law.coverage !== 'full' || !_hasArts);
      if (_needLoad) {
        var pack = (CALR.fulltext && CALR.fulltext.packFor) ? CALR.fulltext.packFor(id) : null;
        if (pack || _expectArts) {
          /* API 模式下 pack 为 null，但 articleCount>0 说明可以通过接口取条文 */
          main.innerHTML = '<div class="container page">' +
            C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: esc(tr(law.title)) }]) +
            '<div class="card card--pad" style="margin-top:16px">' + C().skeletonList(4) +
            '<p class="mini muted center">' + esc(t('正在载入该法规的官方全文…')) + '</p></div></div>';
          CALR.fulltext.ensureLaw(id).then(function (ok) {
            S().init();
            if (ok) { CALR.app.refresh(); }
            else {
              var dir = (pack && pack.kind === 'intl') ? 'prototype/data/intl/' : 'prototype/data/cn/';
              var apiMode = !!(CALR.api && CALR.api.enabled && CALR.api.enabled());
              var msg = apiMode
                ? t('后端条文接口暂时未能返回该法规（可能是限流或网络超时），请稍后重试。')
                : t('该法规的全文分卷未能加载，请检查 ' + dir + ' 目录是否完整。');
              main.innerHTML = '<div class="container page">' + C().emptyState(CALR.ui.icon('alert'), t('全文暂未载入'), msg) + '</div>';
            }
          });
          return;
        }
        /* 没有分卷：若已有摘录条文，继续按正常路径渲染；一条都没有才提示仅收录条目 */
        if (!(law.articles && law.articles.length)) {
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
      /* 从检索结果跳转过来时带的检索词，用于正文自动高亮 */
      var arriveQ = (query.q || '').trim();
      if (['both', 'orig', 'trans'].indexOf(readMode) < 0) readMode = 'both';
      if (readMode === 'trans' && !transLang) readMode = 'orig';
      var fontSize = query.fs || 'normal';
      var revisions = S().revisionsOf(law);
      var chapters = U().uniq(law.articles.map(function (a) { return chapterOf(a); }));
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

      /* ---------- 标题区：当前界面语言主标题 + 原文名称 ---------- */
      var td = titleDisplayOf(law);

      /* ---------- 基本信息表格（用户要求恢复表格形态） ---------- */
      var issuer = (CALR.ui.issuerLabel ? CALR.ui.issuerLabel(law.issuingBody) : tr(law.issuingBody)) || '—';
      var artCount = law.articleCount || (law.articles || []).length || 0;
      var metaRows = [
        [t('国家 / 法域'), '<span class="law-meta__country">' + C().flagSvg(law.country, 'flag-mini') + esc(S().countryName(law.country)) + '</span>'],
        [t('时效性'), C().statusTag(law.status)],
        [t('制定机关'), esc(issuer)],
        [t('文号'), esc(law.docNumber || '—')],
        [t('公布日期'), esc(U().fmtDate(law.promulgatedDate))],
        [t('施行日期'), esc(U().fmtDate(law.effectiveDate))],
        [t('法律层级'), C().levelTag(law.level)],
        [t('条文数量'), esc(artCount + ' ' + t('条'))],
        [t('数据来源'), sourceCell(law)]
      ];
      if (law.versionDate) metaRows.splice(6, 0, [t('版本日期'), esc(U().fmtDate(law.versionDate))]);
      var topicsHtml = C().topicTags(law, 4);

      var mainCol = '' +
        '<div class="law-head">' +
          '<h1 class="law-title-zh">' + esc(td.main) + '</h1>' +
          (td.orig ? '<div class="law-title-orig">【' + esc(td.orig) + '】</div>' : '') +
          '<div class="law-meta-card">' +
            '<div class="law-meta-grid" role="table" aria-label="' + esc(L('basic')) + '">' +
              metaRows.map(function (r) {
                return '<div class="law-meta-cell' + (r[0] === t('数据来源') ? ' law-meta-cell--wide' : '') + '" role="cell">' +
                  '<span class="law-meta-label">' + esc(r[0]) + '</span>' +
                  '<span class="law-meta-value">' + r[1] + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>' +
          (topicsHtml ? '<div class="row law-topics">' + topicsHtml + '</div>' : '') +
        '</div>' +

        /* 已废止 / 尚未生效提示（版本说明已并入「版本与变迁」卡片，不重复展示） */
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
          ? '<div class="reader-toolbar reader-toolbar--compact">' +
              '<span class="reader-toolbar__group">' +
                '<span class="btn-group">' +
                  readModeBtn('both', t('原文+译文'), readMode, !!transLang) +
                  readModeBtn('orig', t('仅原文'), readMode, true) +
                  readModeBtn('trans', t('仅译文'), readMode, !!transLang) +
                '</span>' +
                '<span class="mini muted reader-toolbar__lang">' +
                  esc(LANG_NAME[origLang] || origLang) +
                  (transLang ? ' / ' + esc(LANG_NAME[transLang] || transLang)
                             : ' / ' + esc(t('暂无当前语言译文'))) +
                '</span></span>' +
              '<span class="reader-toolbar__sep"></span>' +
              /* 字号只保留两个：缩小 / 放大。默认档不占按钮，用组标题提示当前档 */
              '<span class="reader-toolbar__group reader-toolbar__fz">' +
                '<button class="btn btn--outline btn--sm law-fz__btn" data-fs-dir="-1" type="button" ' +
                  'title="' + esc(t('缩小字号')) + '" aria-label="' + esc(t('缩小字号')) + '">A−</button>' +
                '<button class="btn btn--outline btn--sm law-fz__btn" data-fs-dir="1" type="button" ' +
                  'title="' + esc(t('放大字号')) + '" aria-label="' + esc(t('放大字号')) + '">A+</button>' +
              '</span>' +
              '<span class="reader-toolbar__sep"></span>' +
              '<span class="reader-toolbar__group reader-toolbar__find">' +
                '<span class="searchbox searchbox--sm law-find">' +
                  '<span class="searchbox__icon" aria-hidden="true">' + CALR.ui.icon('search') + '</span>' +
                  '<input class="searchbox__input" id="law-find-q" type="search" autocomplete="off" ' +
                    'placeholder="' + esc(t('法条号 / 片段 / 关键词')) + '" aria-label="' + esc(t('在本文中查找')) + '">' +
                '</span>' +
                /* 命中计数：1/281 这种浏览器式显示 */
                '<span class="law-find__stat" id="law-find-stat" role="status" aria-live="polite"></span>' +
                /* 上一个 / 下一个 / 关闭 */
                '<span class="law-find__nav" id="law-find-nav" hidden>' +
                  '<button class="law-find__btn" id="law-find-prev" type="button" ' +
                    'title="' + esc(t('上一处')) + '" aria-label="' + esc(t('上一处')) + '">' +
                    '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 12l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
                  '<button class="law-find__btn" id="law-find-next" type="button" ' +
                    'title="' + esc(t('下一处')) + '" aria-label="' + esc(t('下一处')) + '">' +
                    '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
                  '<button class="law-find__btn" id="law-find-close" type="button" ' +
                    'title="' + esc(t('关闭查找')) + '" aria-label="' + esc(t('关闭查找')) + '">' +
                    '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
                '</span>' +
              '</span>' +
            '</div>' +

            '<div class="card card--pad" id="law-body">' +
              '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
                '<h2 style="margin:0;font-size:var(--fs-h2)">' + esc(t('法规正文')) +
                  ' <span class="mini muted">' + esc(t('共')) + ' ' + law.articles.length + ' ' + esc(t('条')) + '</span></h2>' +
                '<span class="mini muted" id="read-stat"></span>' +
              '</div>' +
              chapters.map(function (ch) {
                var list = law.articles.filter(function (a) { return chapterOf(a) === ch; });
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
        '';

      /* ---------- 条文目录（左栏唯一卡片） ---------- */
      var tocCard = '';
      if (showText) {
        tocCard = '<div class="card law-toc-card">' +
          '<div class="card__head"><h3 class="card__title">' + esc(t('条文目录')) + '</h3>' +
            '<span class="mini muted" style="margin-left:auto">' +
              (tocGroups.length && tocGroups[0].title !== t('全部条文')
                ? tocGroups.length + ' ' + esc(t('章')) + ' · '
                : esc(t('原文未提供章节信息')) + ' · ') +
              law.articles.length + ' ' + esc(t('条')) + '</span></div>' +
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
                    var subTag = a.__tocSub
                      ? '<span class="toc__sub" title="' + esc(a.__tocSub) + '">' +
                        esc(U().truncate(a.__tocSub, 20)) + '</span>'
                      : '';
                    return '<li><a href="#/law/' + esc(law.id) + '" data-anchor="' + esc(a.id) +
                      '" title="' + esc(a.__tocSub || '') + '">' +
                      esc(U().articleLabel(a)) + ' ' +
                      esc(U().truncate(tr(a.heading), 16)) + subTag + '</a></li>';
                  }).join('') +
                '</ul>' +
              '</li>';
            }).join('') + '</ul></div></div>';
      }

      main.innerHTML = '' +
      '<div class="container container--wide page law-page">' +
        '<div class="print-header"><strong>' + esc(tr(law.title)) + '</strong> · ' + esc(S().countryName(law.country)) + ' · ' +
          esc(law.docNumber || '') + '<br><span class="mini">' + esc(t('来源：中国—东盟法律法规数据库')) + '</span></div>' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: S().countryName(law.country), href: '#/country/' + law.country },
          { text: S().levelName(law.level), href: '#/search?country=' + law.country + '&level=' + law.level }, { text: tr(law.title) }]) +

        '<div class="law-layout' + (showText ? '' : ' law-layout--single') + '">' +
          (showText ? '<aside class="law-side sticky-col">' + tocCard + historyCard(law, revisions) + relatedCard(law) + '</aside>' : '') +
          '<div class="law-main-col">' + mainCol + '</div>' +
        '</div>' +
        '<button class="law-download" id="law-download" type="button" title="' + esc(t('下载全文')) + '" aria-label="' + esc(t('下载全文')) + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>' +
          '<span>' + esc(t('下载全文')) + '</span></button>' +
      '</div>';

      /* ---------- 交互 ---------- */
      var dlBtn = U().$('#law-download', main);
      if (dlBtn) U().on(dlBtn, 'click', function () {
        var txt = lawPlainText(law, origLang, transLang);
        var ok = U().download('CALR-' + String(law.id).replace(/[\\/:*?"<>|]/g, '_') + '.txt', txt, 'text/plain;charset=utf-8');
        if (ok) U().toast(t('已下载全文（TXT）'), 'ok');
        else U().toast(t('下载失败，请检查浏览器权限'), 'warn');
      });

      /* 字号三档：normal（默认，无按钮）/ large / xlarge。
         A− / A+ 在档位之间步进，到边界就不再变。 */
      var FS_LEVELS = ['normal', 'large', 'xlarge'];
      function applyFontSize(v) {
        fontSize = FS_LEVELS.indexOf(v) >= 0 ? v : 'normal';
        if (fontSize === 'normal') document.documentElement.removeAttribute('data-fontsize');
        else document.documentElement.setAttribute('data-fontsize', fontSize);
        syncFontButtons();
      }
      function syncFontButtons() {
        var i = FS_LEVELS.indexOf(fontSize);
        U().$$('[data-fs-dir]', main).forEach(function (b) {
          var d = parseInt(b.getAttribute('data-fs-dir'), 10);
          var next = i + d;
          var disabled = next < 0 || next >= FS_LEVELS.length;
          b.disabled = disabled;
          b.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        });
      }
      applyFontSize(fontSize);

      U().$$('[data-fs-dir]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          var d = parseInt(b.getAttribute('data-fs-dir'), 10);
          var i = FS_LEVELS.indexOf(fontSize);
          var next = i + d;
          if (next < 0 || next >= FS_LEVELS.length) return;
          var fs = FS_LEVELS[next];
          applyFontSize(fs);
          CALR.router.go(CALR.router.buildUrl('/law/' + law.id, { fs: fs }));
        });
      });
      /* 阅读模式切换：原文+译文 / 仅原文 / 仅译文 */
      U().$$('[data-read]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          CALR.router.go(CALR.router.buildUrl('/law/' + law.id, { read: b.getAttribute('data-read'), fs: fontSize }));
        });
      });

      /* ---------- 文内查找：滚动到匹配位置；重复查找则依次向下 ---------- */
      var findState = { matches: [], idx: -1, query: '', mark: null };

      /* 清除高亮。
         注意：必须清掉**所有** mark，而不是只清最后一个 ——
         查找会在同一篇里反复执行（输入即查、进入即高亮、上下跳），
         只要残留一个 <mark>，正文就被切碎，后续查找会找不到跨节点的词，
         表现为「高亮数 12 但计数 1/9」「高亮 2 处但计数 0/0」。 */
      function clearFindMark() {
        var rootEl = U().$('#law-body', main) || main;
        var all = rootEl.querySelectorAll('.law-find-hit');
        for (var i = all.length - 1; i >= 0; i--) {
          var m = all[i];
          var pa = m.parentNode;
          if (!pa) continue;
          pa.replaceChild(document.createTextNode(m.textContent), m);
          pa.normalize();
        }
        findState.mark = null;
      }

      function collectFindMatches(q) {
        var rootEl = U().$('#law-body', main) || main;
        var out = [], nq = q.toLowerCase();
        var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
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

      function scrollToRange(node, start, end) {
        var r = document.createRange();
        r.setStart(node, start || 0);
        r.setEnd(node, typeof end === 'number' ? end : (node.nodeValue ? node.nodeValue.length : 0));
        var rect = r.getBoundingClientRect();
        var head = U().$('.app-header');
        var off = (head ? head.offsetHeight : 0) + 18;
        var cur = window.pageYOffset || document.documentElement.scrollTop || 0;
        var target = Math.max(0, rect.top + cur - off);
        /* 用即时滚动：跨数千像素时 smooth 又慢又可能被浏览器/无头环境跳过 */
        window.scrollTo(0, target);
      }

      /* dir: 1 = 下一处，-1 = 上一处，0 = 首次（默认下一处） */
      function doFind(dir) {
        var inp = U().$('#law-find-q', main);
        var stat = U().$('#law-find-stat', main);
        var nav = U().$('#law-find-nav', main);
        if (!inp) return;
        var q = (inp.value || '').trim();
        if (!q) {
          clearFindMark();
          findState = { matches: [], idx: -1, query: '', mark: null };
          if (stat) { stat.textContent = ''; stat.classList.remove('is-empty'); }
          if (nav) nav.hidden = true;
          return;
        }
        var same = (q === findState.query);
        var prevIdx = findState.idx;
        /* 每次跳转都重新扫描并重绘 mark。
           旧实现同一检索词只移动游标、复用旧 match 节点；clearFindMark 的
           normalize() 会合并文本节点，旧节点/偏移随即失效，导致跳转落点漂移、
           当前词没有 mark，看起来像“没显示检索词、只能滚轮找”。 */
        clearFindMark();
        findState.matches = collectFindMatches(q);
        findState.query = q;
        var total = findState.matches.length;
        if (!total) {
          findState.idx = -1;
          if (stat) { stat.textContent = '0/0'; stat.classList.add('is-empty'); }
          if (nav) nav.hidden = false;
          U().toast(t('未找到') + '「' + q + '」', 'warn');
          return;
        }
        if (stat) stat.classList.remove('is-empty');
        if (nav) nav.hidden = false;
        var step = (dir === -1) ? -1 : 1;
        if (!same || prevIdx < 0) {
          findState.idx = 0;
        } else {
          findState.idx = (prevIdx + step + total) % total;
        }

        /* 把**全部**命中都标黄（浏览器查找栏的行为），当前处再加深色。
           从后往前包，避免前面的插入改变后面命中的文本偏移。 */
        var curNode = null;
        for (var k = findState.matches.length - 1; k >= 0; k--) {
          var mm = findState.matches[k];
          try {
            expandFindTarget(mm.node);
            var rr = document.createRange();
            rr.setStart(mm.node, mm.start);
            rr.setEnd(mm.node, mm.end);
            var mkEl = document.createElement('mark');
            mkEl.className = 'law-find-hit';
            if (k === findState.idx) mkEl.className += ' is-current';
            rr.surroundContents(mkEl);
            if (k === findState.idx) {
              findState.mark = mkEl;
              curNode = mkEl;
            }
          } catch (e) {
            /* 跨节点等异常：跳过这一处，不影响其余 */
          }
        }
        if (curNode) {
          scrollToRange(curNode.firstChild || curNode, 0, (curNode.firstChild && curNode.firstChild.nodeValue) ? curNode.firstChild.nodeValue.length : 0);
          /* 再兜底把当前命中放到视口中间，保证“下一处”一定看得见，不依赖手动滚轮 */
          try { curNode.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); } catch (e) {}
        } else {
          var mc = findState.matches[findState.idx];
          if (mc) scrollToRange(mc.node, mc.start, mc.end);
        }
        if (stat) stat.textContent = (findState.idx + 1) + '/' + total;
      }

      /* 带着检索词进来：填进查找框并自动高亮第一处 */
      if (arriveQ) {
        var fq0 = U().$('#law-find-q', main);
        if (fq0) {
          fq0.value = arriveQ;
          /* 等布局稳定再扫，否则条文还没展开完，命中数会偏少 */
          setTimeout(function () { findState.query = ''; doFind(0); }, 120);
        }
      }

      var fq = U().$('#law-find-q', main);
      if (fq) {
        U().on(fq, 'keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); doFind(e.shiftKey ? -1 : 1); }
          else if (e.key === 'Escape') { e.preventDefault(); closeFind(); }
        });
        /* 输入即查（浏览器查找栏的行为），防抖 260ms */
        var _t = null;
        U().on(fq, 'input', function () {
          if (_t) clearTimeout(_t);
          _t = setTimeout(function () { findState.query = ''; doFind(0); }, 260);
        });
      }
      var fp = U().$('#law-find-prev', main);
      if (fp) U().on(fp, 'click', function () { doFind(-1); });
      var fn = U().$('#law-find-next', main);
      if (fn) U().on(fn, 'click', function () { doFind(1); });
      var fc = U().$('#law-find-close', main);
      if (fc) U().on(fc, 'click', function () { closeFind(); });

      /** 关闭查找：清除高亮、清空状态，但保留输入框里的词方便再次打开 */
      function closeFind() {
        clearFindMark();
        findState = { matches: [], idx: -1, query: '', mark: null };
        var st = U().$('#law-find-stat', main);
        if (st) { st.textContent = ''; st.classList.remove('is-empty'); }
        var nv = U().$('#law-find-nav', main);
        if (nv) nv.hidden = true;
        var i2 = U().$('#law-find-q', main);
        if (i2) i2.blur();
      }

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

      /* 术语内联释义（仅单击弹出；卡片只展示当前界面语言） */
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
                return '<tr><td>' + esc(a ? U().articleLabel(a) : ch.articleId) + '</td>' +
                  '<td style="background:var(--calr-danger-bg)">' + esc(tr(ch.before)) + '</td>' +
                  '<td style="background:var(--calr-success-bg)">' + esc(tr(ch.after)) + '</td></tr>';
              }).join('') + '</tbody></table>',
            foot: '<button class="btn btn--outline" data-modal-close>' + esc(t('关闭')) + '</button>'
          });
        });
      });
    }
  };

  /* 基本信息行中的一个键值项（valueHtml 需已转义 / 为组件 HTML） */
  function infoItem(label, valueHtml) {
    return '<span class="law-info__item"><span class="law-info__label">' + esc(label) + '</span>' +
      '<span class="law-info__value">' + valueHtml + '</span></span>';
  }

  /**
   * 标题展示：当前界面语言主标题 + 原文名称（仅两个，不罗列语言别名）。
   * 原文名称优先取数据里的 title.orig，其次取该法域官方语种的标题；
   * 与主标题完全一致时不再重复显示。
   */
  function titleDisplayOf(law) {
    var f = law && law.title;
    if (!f) return { main: law ? law.id : '', orig: null };
    if (typeof f === 'string') return { main: f, orig: null };
    var lang = CALR.i18n.lang();
    var main = f[lang] || f.en || f.zh || '';
    if (!main) {
      for (var k in f) { if (Object.prototype.hasOwnProperty.call(f, k) && f[k]) { main = f[k]; break; } }
    }
    var ol = (law.country && COUNTRY_ORIG[law.country]) || null;
    var orig = f.orig || (ol && f[ol]) || null;
    if (orig && String(orig).trim() === String(main).trim()) orig = null;
    return { main: main, orig: orig };
  }

  /* ---------------- 版本与变迁 ---------------- */

  /** 归一化标题：去掉年份/修订说明括号与空白、书名号，用于判断「同名多版本」 */
  function normTitleOf(s) {
    return String(s || '')
      .replace(/[（(][^）)]*[）)]/g, '')
      .replace(/[\s\u3000《》〈〉「」『』"'“”]/g, '')
      .trim();
  }
  /** 版本自身的日期：优先版本日期，其次施行/公布日期 */
  function versionDateOf(l) {
    return (l && (l.versionDate || l.effectiveDate || l.promulgatedDate)) || '';
  }
  /** 判重用的法规原标题（与界面语言无关，保证切换语言后分组稳定） */
  function rawTitleOf(l) {
    var f = l && l.title;
    if (!f) return '';
    if (typeof f === 'string') return f;
    return f.orig || f.zh || f.en || '';
  }
  /**
   * 收集同一部法的历史版本（按日期倒序，当前版本排最前）：
   *   ① 本法 amendedNote 中显式点名的其他版本 lawId；
   *   ② 其他法规的 amendedNote 反向点名的本法（说明本法是其替代版本）；
   *   ③ 同法域、同标题、且带版本日期/已废止标记的记录（修复「同名不等于同法」误并：
   *      要求双方至少一方带版本信息，且标题归一化后完全相等）。
   */
  function versionFamilyOf(law) {
    var byId = {};
    function add(l) { if (l && l.id && !byId[l.id]) byId[l.id] = l; }
    add(law);
    String(law.amendedNote || '').replace(/[A-Z]{2,3}-[A-Za-z0-9-]{2,}/g, function (mid) {
      var l = S().law(mid);
      if (l) add(l);
      return mid;
    });
    var base = normTitleOf(rawTitleOf(law));
    S().laws().forEach(function (l) {
      if (!l || !l.id || l.id === law.id) return;
      if (String(l.amendedNote || '').indexOf(law.id) >= 0) { add(l); return; }
      if (!base || l.country !== law.country) return;
      if (normTitleOf(rawTitleOf(l)) !== base) return;
      if (!(l.versionDate || law.versionDate || l.status === 'repealed' || law.status === 'repealed')) return;
      add(l);
    });
    var list = Object.keys(byId).map(function (k) { return byId[k]; });
    /* 同日期同状态的重复记录（同一版本的重复登记）只保留一条，优先本法自身 */
    var seen = {};
    list = list.filter(function (l) {
      var key = normTitleOf(rawTitleOf(l)) + '|' + versionDateOf(l) + '|' + (l.status || '');
      if (seen[key] && l.id !== law.id) return false;
      seen[key] = 1;
      return true;
    });
    list.sort(function (a, b) { return String(versionDateOf(b)).localeCompare(String(versionDateOf(a))); });
    return list.slice(0, 12);
  }

  /** 「版本与变迁」卡片：历史版本时间线（可点击跳转）+ 修订记录 */
  function historyCard(law, revisions) {
    revisions = revisions || [];
    var versions = versionFamilyOf(law);
    var versionsHtml = '<ul class="law-versions">' + versions.map(function (v) {
      var isCur = v.id === law.id;
      var vd = versionDateOf(v);
      var dateText = vd ? U().fmtDate(vd) : '—';
      return '<li class="law-version' + (isCur ? ' is-current' : '') + '">' +
        '<div class="law-version__head">' +
          '<span class="law-version__date">' + esc(dateText) + '</span>' +
          C().statusTag(v.status) +
          (isCur ? '<span class="tag tag--navy">' + esc(L('currentVersion')) + '</span>' : '') +
        '</div>' +
        '<div class="law-version__body">' +
          (isCur
            ? '<span class="law-version__title">' + esc(S().lawTitle(v)) + '</span>'
            : '<a class="law-version__title" href="#/law/' + esc(v.id) + '" title="' + esc(L('openVersion')) + '">' +
                esc(S().lawTitle(v)) + ' →</a>' +
              '<span class="law-version__id mini muted">' + esc(v.id) + '</span>') +
        '</div>' +
        (v.amendedNote ? '<div class="law-version__note">' + esc(v.amendedNote) + '</div>' : '') +
      '</li>';
    }).join('') + '</ul>' +
      (versions.length > 1 ? '' : '<p class="mini muted" style="margin:8px 0 0">' + esc(L('noVersions')) + '</p>');

    var revisionsHtml = revisions.length
      ? '<div class="law-history__sub">' +
          '<div class="law-history__subtitle">' + esc(L('revisionLog')) + '（' + revisions.length + '）</div>' +
          '<ul class="timeline">' + revisions.map(function (r) {
            var lawId = r.lawId || law.id;
            return '<li><div class="timeline__date">' + esc(r.date || '') + '</div>' +
              '<div class="timeline__text">' + esc(tr(r.summary)) + '</div>' +
              '<div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">' +
                '<a class="btn btn--ghost btn--sm" href="#/law/' + esc(lawId) + '">' + esc(L('openVersion')) + ' →</a>' +
                ((r.changes || []).length
                  ? '<button class="btn btn--ghost btn--sm" data-revision="' + esc(r.id) + '">' + esc(t('查看修订对照')) + '</button>'
                  : '') +
              '</div></li>';
          }).join('') + '</ul>' +
        '</div>'
      : '';

    return '<div class="card card--pad" style="margin-top:16px" id="law-history-card">' +
      '<div class="card__head" style="padding:0 0 8px">' +
        '<h3 style="margin:0">' + esc(t('版本与变迁')) + '</h3>' +
        '<span class="mini muted" style="margin-left:auto">' +
          esc(L('historyVersions')) + ' ' + versions.length + '</span>' +
      '</div>' +
      versionsHtml + revisionsHtml +
    '</div>';
  }

  /* 下载全文：与页面一致，原文优先，附当前可用译文 */
  function lawPlainText(law, origLang, transLang) {
    var L = function (k) { return CALR.i18n.t(k); };
    var out = [];
    out.push(CALR.i18n.field(law.title) || law.id);
    var origTitle = (law.title && (law.title.orig || law.title[origLang])) || '';
    if (origTitle && origTitle !== CALR.i18n.field(law.title)) out.push('【' + origTitle + '】');
    out.push('');
    out.push(L('国家 / 法域') + '：' + S().countryName(law.country));
    out.push(L('时效性') + '：' + S().statusName(law.status));
    out.push(L('制定机关') + '：' + (CALR.ui.issuerLabel ? CALR.ui.issuerLabel(law.issuingBody) : tr(law.issuingBody)));
    out.push(L('文号') + '：' + (law.docNumber || '—'));
    out.push(L('公布日期') + '：' + U().fmtDate(law.promulgatedDate));
    out.push(L('施行日期') + '：' + U().fmtDate(law.effectiveDate));
    out.push(L('法律层级') + '：' + S().levelName(law.level));
    out.push(L('条文数量') + '：' + (law.articleCount || law.articles.length) + ' ' + L('条'));
    if (law.source && law.source.url) out.push(L('数据来源') + '：' + law.source.url);
    out.push('');
    out.push('————————————————————————————————————');
    (law.articles || []).forEach(function (a) {
      var label = U().articleLabel(a);
      var heading = tr(a.heading);
      out.push('');
      out.push(label + (heading ? '  ' + heading : ''));
      var body = tr(a.text, origLang);
      if (body) out.push(body);
      if (transLang && a.text && a.text[transLang]) {
        out.push('');
        out.push('【' + L('译文') + ' · ' + (LANG_NAME[transLang] || transLang) + '】');
        out.push(a.text[transLang]);
      }
    });
    out.push('');
    out.push('—— ' + L('本平台提供的法规文本、译文与检索结果仅供法律研究与实务参考，正式引用请以各国官方公布的文本为准。'));
    return out.join('\n');
  }

  /* 相关法规：沿用 store 的国别/主题/引用关系打分，取前 5 部 */
  function relatedCard(law) {
    var list = (S().related ? S().related(law, 5) : []).filter(function (l) {
      return l && l.id !== law.id;
    }).slice(0, 5);
    if (!list.length) return '';
    return '<div class="card card--pad law-related-card" id="law-related-card">' +
      '<div class="card__head" style="padding:0 0 8px"><h3 style="margin:0">' + esc(t('相关法规')) + '</h3>' +
        '<span class="mini muted" style="margin-left:auto">' + list.length + '</span></div>' +
      '<ul class="law-related-list">' + list.map(function (l) {
        return '<li><a href="#/law/' + esc(l.id) + '">' + esc(S().lawTitle(l)) + '</a>' +
          '<span class="mini muted">' + esc(S().countryName(l.country)) + (l.docNumber ? ' · ' + esc(l.docNumber) : '') + '</span></li>';
      }).join('') + '</ul></div>';
  }

  /* 阅读模式按钮 */
  function readModeBtn(id, label, cur, enabled) {
    return '<button type="button" class="btn btn--sm' + (id === cur ? ' is-active' : '') + '" data-read="' + id + '"' +
      (enabled ? '' : ' disabled title="' + esc(CALR.i18n.t('暂无可用的译文')) + '"') + '>' + esc(label) + '</button>';
  }

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
  /**
   * 译文补分段。
   * 原法文常常分条款（多段落），但译文是一整段 —— 直接显示读者分不清层次。
   * 这里按句子边界把译文切成与原法文相同的段数，视觉上就对齐了。
   * 文字一个字都不动：切分结果去空白后必须严格等于原译文，否则原样返回。
   */
  function splitTransToParagraphs(transText, wantCount) {
    if (!transText || wantCount < 2) return transText;
    if (transText.indexOf('\n') >= 0) return transText;   /* 本来就分段，不动 */
    var marks = [], re = /([.!?])\s+|([。！？])/g, m;
    while ((m = re.exec(transText)) !== null) {
      marks.push(m.index + (m[1] ? m[1].length : m[2].length));
    }
    if (marks.length < wantCount - 1) return transText;   /* 句子数量不够，不切 */
    var cuts = [], total = transText.length, last = 0;
    for (var i = 1; i < wantCount; i++) {
      var target = Math.round(total * i / wantCount);
      var best = -1, bestD = Infinity;
      for (var j = 0; j < marks.length; j++) {
        var pos = marks[j];
        if (pos <= last + 1) continue;
        var d = Math.abs(pos - target);
        if (d < bestD) { bestD = d; best = pos; }
      }
      if (best > 0 && best < total) { cuts.push(best); last = best; }
    }
    if (cuts.length !== wantCount - 1) return transText;
    var out = [], prev = 0;
    cuts.forEach(function (c) { out.push(transText.slice(prev, c).trim()); prev = c; });
    out.push(transText.slice(prev).trim());
    var joined = out.join('\n');
    /* 无损校验：去掉所有空白后必须完全一致 */
    if (joined.replace(/\s+/g, '') !== transText.replace(/\s+/g, '')) return transText;
    return joined;
  }

  function paraHtml(a, lang, origLang) {
    var raw = U().tr(a.text, lang) || '';
    /* 译文（非原文语种）且原文分段更多时，补出同样的段落层次 */
    if (origLang && lang && lang !== origLang && raw && raw.indexOf('\n') < 0) {
      var origRaw = U().tr(a.text, origLang) || '';
      if (origRaw.indexOf('\n') >= 0) {
        var wantN = origRaw.split('\n').filter(function (x) { return x.trim(); }).length;
        raw = splitTransToParagraphs(raw, wantN);
      }
    }
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
        '<span class="article__no">' + esc(U().articleLabel(a)) +
          /* 源文存在两套编号 / 同一编号多次出现时，用本地化标记区分（不改写原文标签） */
          (a.dupIndex ? ' <span class="article__dup">' + esc(t('第{n}处').replace('{n}', a.dupIndex)) + '</span>' : '') +
          (a.partIndex && a.partIndex > 1 ? ' <span class="article__dup">' + esc(t('第{n}套编号').replace('{n}', a.partIndex)) + '</span>' : '') +
        '</span>' +
        '<span class="article__heading">' + esc(tr(a.heading)) + '</span>' +
        '<button class="article__toggle" type="button" data-article-toggle="' + esc(a.id) + '">' + esc(t('收起')) + '</button>' +
      '</div>';

    if (showOrig) {
      html += (showTrans ? '<div class="article__lang-label">' + esc(t('原文')) + ' · ' + esc(LANG_NAME[effOrig] || effOrig) + '</div>' : '') +
        '<div class="article__text">' + paraHtml(a, effOrig, effOrig) + '</div>';
    }
    if (showTrans) {
      html += '<div class="article__lang-label article__lang-label--trans">' + esc(t('译文')) + ' · ' + esc(LANG_NAME[trans] || trans) + '</div>' +
        '<div class="article__text article__text--trans">' + paraHtml(a, trans, effOrig) + '</div>';
    }

    var alts = U().altTitles(a.text, effOrig, 2).filter(function (x) {
      return x.lang !== effOrig && x.lang !== trans;
    });
    if (alts.length) {
      html += '<div class="article__sub">' + alts.map(function (x) {
        return '<div>' + esc(t(LANG_NAME[x.lang] || x.lang)) + '：' + esc(x.text) + '</div>';
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
        '<div class="row" style="margin-top:10px;justify-content:flex-end">' +
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

    U().on(document, 'click', function (e) {
      if (!pinned) return;
      if (pop && (pop.contains(e.target) || e.target.closest && e.target.closest('.term-ref, [data-term]'))) return;
      hideForce();
    });
    U().on(document, 'keydown', function (e) { if (e.key === 'Escape') hideForce(); });
  }

  /* 条文目录分组：按「章」聚合；无章节信息时归入单一分组。
     有些法域的 chapter 是完整层级路径（马来西亚公司法就是
       'PART II FORMATION AND ADMINISTRATION OF COMPANIES — Division 1 Types of Companies'
     这种），直接当分组名会因为太长被截断，看上去像十几个同名分组。
     所以分组键只取顶层（' — ' 之前），Division/Subdivision 留作条目前的简短标记。 */
  function tocTopLevel(title) {
    var parts = String(title).split(/\s+[—–]\s+/);
    return { top: parts[0].trim(), sub: parts.slice(1).join(' · ').trim() };
  }

  /* 章节信息来源不统一：优先 chapter 字段；缺失时从 heading / 正文首行识别「第X章」。
     这样老批次中国法也能显示「第一章」，而不是全部落进「全部条文」。 */
  var CHAPTER_RE = /^(第[一二三四五六七八九十百零〇\d]+章|Chapter\s+[IVXLC\d]+)/i;
  function chapterOf(a) {
    var raw = tr(a && a.chapter) || '';
    if (raw) return raw;
    var h = tr(a && a.heading) || '';
    if (CHAPTER_RE.test(h)) return h;
    var txt = tr(a && a.text) || '';
    var first = String(txt).split(/\r?\n/)[0].trim();
    if (CHAPTER_RE.test(first)) return first;
    return '';
  }
  function buildTocGroups(law) {
    var groups = [], index = {};
    law.articles.forEach(function (a) {
      var raw = chapterOf(a);
      var lv = raw ? tocTopLevel(raw) : { top: t('全部条文'), sub: '' };
      if (!(lv.top in index)) { index[lv.top] = groups.length; groups.push({ title: lv.top, items: [] }); }
      var it = a;
      if (lv.sub) {
        /* 不改动条文对象，只在渲染时带一个副标题 */
        it = Object.create(a);
        it.__tocSub = lv.sub;
      }
      groups[index[lv.top]].items.push(it);
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
      var cnLabel = CALR.ui.sourceLabel
        ? CALR.ui.sourceLabel({ zh: CN_SOURCE_NAME, en: 'National Laws and Regulations Database' }, url)
        : CN_SOURCE_NAME;
      return url
        ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(cnLabel) + '</a>'
        : esc(cnLabel);
    }
    if (/^https?:/i.test(ft.sourceUrl || '')) {
      var ftLabel = CALR.ui.sourceLabel ? CALR.ui.sourceLabel(ft.sourceName, ft.sourceUrl) : (ft.sourceName || t('官方来源'));
      return '<a href="' + esc(ft.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(ftLabel) + '</a>';
    }
    if (law.source && law.source.url) {
      var srcLabel = CALR.ui.sourceLabel ? CALR.ui.sourceLabel(law.source.name, law.source.url) : (law.source.name || '');
      return '<a href="' + esc(law.source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(srcLabel) + '</a>';
    }
    var fallback = CALR.ui.sourceLabel
      ? CALR.ui.sourceLabel((law.source && law.source.name) || ft.sourceName, (law.source && law.source.url) || ft.sourceUrl)
      : ((law.source && law.source.name) || ft.sourceName);
    return esc(fallback || '—');
  }
})(typeof window !== 'undefined' ? window : globalThis);
