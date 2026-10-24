/* ==========================================================================
   CALR · views/terms.js —— 多语种法律术语即时翻译（M4）
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

  views.terms = {
    render: function (main, params, query) {
      var q = query.q || '';
      var domain = query.domain || '';
      var list = CALR.terms.search(q, domain, 120);
      var all = S().terms();
      var multi = all.filter(function (x) { return Object.keys(x.translations || {}).length >= 5; }).length;

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('法律术语库') }]) +
        '<div class="page-head"><h1>' + esc(t('多语种法律术语即时翻译')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('基于法律平行语料与术语库，提供法律术语在东盟各国语言中的对照译法与释义；无直接对应译法的概念提供“概念解释”模式。')) + '</p></div>' +

        '<div class="card card--pad" style="margin-bottom:16px">' +
          '<div class="row">' +
            '<div class="searchbox searchbox--sm" style="flex:1;min-width:240px">' +
              '<span class="searchbox__icon">' + CALR.ui.icon('globe') + '</span>' +
              '<input class="searchbox__input" id="term-q" value="' + esc(q) + '" placeholder="' + esc(t('输入中文、英文或东盟语言术语…')) + '" aria-label="' + esc(t('术语检索')) + '">' +
            '</div>' +
            '<select class="select" id="term-domain" style="width:auto">' +
              '<option value="">' + esc(t('全部领域')) + '</option>' +
              S().topics().map(function (tp) {
                return '<option value="' + esc(tp.id) + '"' + (tp.id === domain ? ' selected' : '') + '>' + esc(tr(tp.name)) + '</option>';
              }).join('') +
            '</select>' +
            '<button class="btn" id="term-search">' + esc(t('检索')) + '</button>' +
            '<button class="btn btn--outline" id="term-export">' + esc(t('导出全部术语（CSV）')) + '</button>' +
          '</div>' +
          '<div class="row mini muted" style="margin-top:10px">' +
            '<span>' + esc(t('术语总量')) + '：' + all.length + ' ' + esc(t('条')) + '</span>' +
            '<span>' + esc(t('含 ≥5 个语种译本')) + '：' + multi + ' ' + esc(t('条')) + '</span>' +
            '<span>' + esc(t('语种')) + '：' + esc(CALR.i18n.langs().map(function (l) { return l.native; }).join('、')) + '</span>' +
          '</div>' +
        '</div>' +

        (list.length
          ? '<div class="grid grid--3">' + list.map(termCard).join('') + '</div>'
          : C().emptyState(CALR.ui.icon('globe'), t('未找到相关术语'), t('可尝试更换关键词，或浏览下方按领域分组的结果。'),
              '<p><a class="btn btn--outline" href="#/terms">' + esc(t('查看全部术语')) + '</a></p>')) +

        '<section class="section">' +
          C().section(t('按领域浏览'), '') +
          '<div class="grid grid--3">' + S().topics().map(function (tp) {
            var n = all.filter(function (x) { return x.domain === tp.id; }).length;
            if (!n) return '';
            return '<div class="card card--pad"><h3 style="font-size:var(--fs-h3)">' + esc(tr(tp.name)) + ' <span class="mini muted">' + n + ' ' + esc(t('条')) + '</span></h3>' +
              '<div class="row" style="margin-top:8px">' + all.filter(function (x) { return x.domain === tp.id; }).slice(0, 8).map(function (x) {
                return '<span class="tag tag--blue tag--clickable" data-term-open="' + esc(x.id) + '">' + esc(x.zh) + '</span>';
              }).join('') + '</div>' +
              '<p style="margin:10px 0 0"><a class="btn btn--ghost btn--sm" href="#/terms?domain=' + esc(tp.id) + '">' + esc(t('查看该领域全部术语')) + ' →</a></p></div>';
          }).join('') + '</div>' +
        '</section>' +
      '</div>';

      U().on(U().$('#term-search', main), 'click', doSearch);
      U().on(U().$('#term-q', main), 'keydown', function (e) { if (e.key === 'Enter') doSearch(); });
      U().on(U().$('#term-domain', main), 'change', doSearch);
      U().on(U().$('#term-export', main), 'click', function () {
        var langs = ['zh', 'en', 'vi', 'th', 'id', 'ms', 'my'];
        var rows = [['术语（中文）', 'English'].concat(langs.slice(2).map(function (c) { return CALR.i18n.nativeName(c); })).concat(['领域', '译法确定性', '释义'])];
        all.forEach(function (tm) {
          rows.push([tm.zh, tm.en || ''].concat(langs.slice(2).map(function (c) { return (tm.translations || {})[c] || ''; }))
            .concat([CALR.terms.domainName(tm.domain), { high: t('确定'), medium: t('较确定'), concept: t('概念解释') }[tm.confidence] || t('确定'), (tm.definition && tm.definition.zh) || '']));
        });
        U().download('CALR-法律术语对照表.csv', U().toCsv(rows), 'text/csv;charset=utf-8');
        U().toast(t('术语对照表已导出（CSV）'), 'ok');
      });

      U().$$('[data-term-open]', main).forEach(function (el) {
        U().on(el, 'click', function () { openTerm(el.getAttribute('data-term-open')); });
      });
      U().$$('[data-term-card]', main).forEach(function (el) {
        U().on(el, 'click', function (e) {
          if (e.target.tagName === 'A') return;
          openTerm(el.getAttribute('data-term-card'));
        });
      });

      function doSearch() {
        CALR.router.go(CALR.router.buildUrl('/terms', { q: U().$('#term-q', main).value.trim(), domain: U().$('#term-domain', main).value }));
      }
    }
  };

  function openTerm(id) {
    var tm = S().term(id);
    if (!tm) return;
    var rows = CALR.terms.rows(tm);
    U().modal({
      title: tm.zh + ' · ' + (tm.en || ''),
      body: '<div class="row" style="margin-bottom:10px"><span class="tag tag--blue">' + esc(CALR.terms.domainName(tm.domain)) + '</span>' +
        '<span class="tag tag--outline">' + esc({ high: t('译法确定'), medium: t('译法较确定'), concept: t('无直接对应译法') }[tm.confidence] || '') + '</span></div>' +
        '<table class="table"><thead><tr><th style="width:120px">' + esc(t('语言')) + '</th><th>' + esc(t('对应译法')) + '</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td>' + esc(r.name) + ' <span class="mini muted">' + esc(r.native) + '</span></td><td>' + esc(r.value) + '</td></tr>';
        }).join('') + '</tbody></table>' +
        (tm.definition && tm.definition.zh ? '<h3 style="margin-top:16px">' + esc(t('释义')) + '</h3><p class="small">' + esc(tm.definition.zh) + '</p>' : '') +
        (tm.definition && tm.definition.en ? '<p class="small muted">' + esc(tm.definition.en) + '</p>' : '') +
        (tm.confidence === 'concept' && tm.conceptNote && tm.conceptNote.zh ? '<h3>' + esc(t('概念解释')) + '</h3><p class="small">' + esc(tm.conceptNote.zh) + '</p>' : '') +
        ((tm.lawIds || []).length ? '<h3>' + esc(t('相关法规与条约')) + '</h3><div class="row">' + tm.lawIds.map(function (lid) {
          var l = S().law(lid);
          if (l) return '<a class="tag tag--blue tag--clickable" href="#/law/' + esc(lid) + '">' + esc(tr(l.title)) + '</a>';
          var x = S().treaty(lid);
          if (x) return '<span class="tag tag--outline">' + esc(tr(x.name)) + '</span>';
          return '';
        }).join('') + '</div>' : ''),
      foot: '<button class="btn btn--outline" data-modal-close>' + esc(t('关闭')) + '</button>'
    });
  }

  function termCard(tm) {
    var rows = CALR.terms.rows(tm).filter(function (r) { return r.code !== 'zh' && r.code !== 'en'; });
    return '<div class="term-card" data-term-card="' + esc(tm.id) + '" style="cursor:pointer">' +
      '<div class="term-card__zh">' + esc(tm.zh) + '</div>' +
      '<div class="term-card__en">' + esc(tm.en || '') + '</div>' +
      '<div class="term-card__langs">' + rows.slice(0, 5).map(function (r) {
        return '<span><b>' + esc(r.name) + '</b>' + esc(U().truncate(r.value, 34)) + '</span>';
      }).join('') + '</div>' +
      '<div class="row" style="margin-top:8px"><span class="tag tag--outline">' + esc(CALR.terms.domainName(tm.domain)) + '</span>' +
        '<span class="tag tag--outline">' + esc({ high: t('译法确定'), medium: t('较确定'), concept: t('概念解释') }[tm.confidence] || '') + '</span>' +
        (rows.length < 3 && tm.confidence === 'concept' ? '<span class="tag tag--gold">' + esc(t('无直接对应译法')) + '</span>' : '') +
      '</div></div>';
  }
})(typeof window !== 'undefined' ? window : globalThis);
