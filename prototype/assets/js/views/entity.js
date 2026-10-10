/* ==========================================================================
   CALR · views/entity.js —— 条约详情页
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

  /* ---------------- 条约详情 ---------------- */
  views.treatyDetail = {
    render: function (main, params) {
      var id = params[0];
      var x = S().treaty(id);
      if (!x) {
        main.innerHTML = '<div class="container page">' + C().emptyState(CALR.ui.icon('list'), t('未找到该条约'), '', '<p><a class="btn" href="#/search?type=treaty">' + esc(t('返回条约检索')) + '</a></p>') + '</div>';
        return;
      }
      var parties = (x.parties || []).map(function (code) {
        var c = S().country(code);
        return c ? '<a class="tag tag--outline tag--clickable" href="#/country/' + esc(code) + '">' + esc(tr(c.name)) + '</a>' : '<span class="tag tag--outline">' + esc(code) + '</span>';
      }).join(' ');

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('条约检索'), href: '#/search?type=treaty' }, { text: U().truncate(tr(x.name), 24) }]) +
        '<div class="layout-2col" style="margin-top:12px">' +
          '<div>' +
            '<h1 class="law-title-zh">' + esc(tr(x.name)) + '</h1>' +
            (x.name && x.name.en ? '<div class="law-title-alt"><span>English：' + esc(x.name.en) + '</span></div>' : '') +
            C().metaGrid([
              { label: t('签署日期'), value: U().fmtDate(x.signedDate) },
              { label: t('生效日期'), value: U().fmtDate(x.effectiveDate) },
              { label: t('状态'), html: C().statusTag(x.status === 'pending' ? 'pending' : 'active') },
              { label: t('缔约方数量'), value: (x.parties || []).length + ' ' + t('方') }
            ]) +
            '<div class="card card--pad" style="margin-top:16px">' +
              '<h2 style="font-size:var(--fs-h2)">' + esc(t('协定概要')) + '</h2>' +
              '<p>' + esc(tr(x.summary)) + '</p>' +
            '</div>' +
            '<div class="card card--pad" style="margin-top:16px">' +
              '<h2 style="font-size:var(--fs-h2)">' + esc(t('缔约方')) + '</h2>' +
              '<div class="row">' + parties + '</div>' +
            '</div>' +
          '</div>' +
          '<aside class="col-sidebar">' +
            '<div class="card"><div class="card__head"><h3 class="card__title">' + esc(t('主题')) + '</h3></div>' +
              '<div class="card__body"><div class="row">' + (x.topics || []).map(function (tp) {
                return '<span class="tag tag--blue">' + esc(S().topicName(tp)) + '</span>';
              }).join('') + '</div></div></div>' +
            '<div class="card" style="margin-top:16px"><div class="card__head"><h3 class="card__title">' + esc(t('文本获取')) + '</h3></div>' +
              '<div class="card__body"><p class="mini muted" style="margin:0">' +
                esc(t('条约正式文本请以保存机关公布的作准文本为准，可通过') ) + ' <a href="#/sources">' + esc(t('数据来源')) + '</a> ' +
                esc(t('页面列出的官方渠道获取。')) + '</p></div></div>' +
          '</aside>' +
        '</div>' +
      '</div>';
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
