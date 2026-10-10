/* ==========================================================================
   CALR · core/terms.js —— 多语种法律术语即时翻译与术语对照表
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };

  /** 术语译文/释义展示语种顺序 */
  var SHOW_LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms', 'my', 'km', 'lo'];

  function domainName(id) {
    var tp = S().topics().filter(function (t) { return t.id === id; })[0];
    return tp ? CALR.i18n.field(tp.name) : id;
  }

  /** 术语的全部语言对照行 */
  function rows(term) {
    var out = [];
    SHOW_LANGS.forEach(function (code) {
      var v = code === 'zh' ? term.zh : (code === 'en' ? term.en : (term.translations || {})[code]);
      if (v) out.push({ code: code, name: CALR.i18n.name(code), native: CALR.i18n.nativeName(code), value: v });
    });
    return out;
  }

  function search(q, domain, limit) {
    q = String(q || '').trim().toLowerCase();
    return S().terms().filter(function (t) {
      if (domain && t.domain !== domain) return false;
      if (!q) return true;
      var hay = [t.zh, t.en, t.definition && t.definition.zh, t.definition && t.definition.en]
        .concat(Object.keys(t.translations || {}).map(function (k) { return t.translations[k]; }))
        .join(' ').toLowerCase();
      return hay.indexOf(q) >= 0;
    }).slice(0, limit || 60);
  }

  function byDomain() {
    var g = {};
    S().terms().forEach(function (t) { (g[t.domain] = g[t.domain] || []).push(t); });
    return g;
  }

  /**
   * 在条文中标注术语（返回插入 term-ref 标记的 HTML）
   * 采用“原文定位 → 分段转义”方式，避免误替换到标记内部
   */
  function annotate(article, lang) {
    var text = U().tr(article.text, lang) || '';
    if (!text) return '';
    var ids = U().uniq((article.termIds || []).concat(S().termIdsOfArticle(article.id)));
    var found = [];
    ids.forEach(function (id) {
      var tm = S().term(id);
      if (!tm) return;
      var needles = [tm.zh, tm.en].filter(Boolean);
      if (tm.translations && tm.translations[lang]) needles.push(tm.translations[lang]);
      needles.forEach(function (n) {
        if (!n || String(n).length < 2) return;
        var low = text.toLowerCase(), ln = String(n).toLowerCase(), from = 0, p;
        while ((p = low.indexOf(ln, from)) >= 0) {
          found.push({ start: p, end: p + String(n).length, term: tm });
          from = p + String(n).length;
        }
      });
    });

    if (!found.length) return U().esc(text);

    /* 重叠消解：优先更长的匹配 */
    found.sort(function (a, b) { return a.start - b.start || (b.end - b.start) - (a.end - a.start); });
    var picked = [], lastEnd = -1;
    found.forEach(function (m) {
      if (m.start >= lastEnd) { picked.push(m); lastEnd = m.end; }
    });

    var html = '', cursor = 0;
    picked.forEach(function (m) {
      html += U().esc(text.slice(cursor, m.start));
      html += '<span class="term-ref" data-term="' + U().attr(m.term.id) + '" tabindex="0" role="button" aria-label="术语：' +
        U().attr(m.term.zh) + '">' + U().esc(text.slice(m.start, m.end)) + '</span>';
      cursor = m.end;
    });
    html += U().esc(text.slice(cursor));
    return html;
  }

  /** 术语弹窗内容 */
  function popupHtml(term) {
    if (!term) return '';
    var rs = rows(term);
    var conf = { high: '译法确定', medium: '译法较确定', concept: '无直接对应译法' }[term.confidence] || '译法确定';
    return '' +
      '<div class="term-pop__head">' +
        '<span class="term-pop__zh">' + U().esc(term.zh) + '</span>' +
        '<span class="term-pop__en">' + U().esc(term.en || '') + '</span>' +
        '<span class="tag tag--blue">' + U().esc(domainName(term.domain)) + '</span>' +
        '<span class="tag tag--outline">' + U().esc(conf) + '</span>' +
      '</div>' +
      '<ul class="term-pop__list">' + rs.map(function (r) {
        var mark = r.code === CALR.i18n.lang() ? ' style="color:var(--calr-blue-600);font-weight:600"' : '';
        return '<li><span class="term-pop__lang">' + U().esc(r.name) + '</span><span' + mark + '>' + U().esc(r.value) + '</span></li>';
      }).join('') + '</ul>' +
      (term.definition && term.definition.zh ? '<div class="term-pop__def"><b>释义：</b>' + U().esc(term.definition.zh) + '</div>' : '') +
      (term.confidence === 'concept' && term.conceptNote && term.conceptNote.zh
        ? '<div class="term-pop__def"><b>概念解释：</b>' + U().esc(term.conceptNote.zh) + '</div>' : '') +
      ((term.lawIds || []).length
        ? '<div class="term-pop__def"><b>相关法规与条约：</b>' + term.lawIds.map(function (id) {
            var l = S().law(id);
            if (l) return '<a href="#/law/' + U().attr(id) + '">' + U().esc(U().tr(l.title)) + '</a>';
            var x = S().treaty(id);
            if (x) return '<span class="tag tag--outline">' + U().esc(U().tr(x.name)) + '</span>';
            return '';
          }).filter(Boolean).join('、') + '</div>'
        : '');
  }

  /** 术语对照表（某法规）：行 = 术语，列 = 语种 */
  function glossaryRows(law, langs) {
    langs = langs || ['zh', 'en', 'vi', 'th', 'id', 'ms'];
    var terms = S().termsOfLaw(law);
    var header = ['序号', '领域'].concat(langs.map(function (c) { return CALR.i18n.name(c); })).concat(['相关条文']);
    var rowsOut = [header];
    terms.forEach(function (t, i) {
      var row = [i + 1, domainName(t.domain)];
      langs.forEach(function (c) {
        row.push(c === 'zh' ? t.zh : (c === 'en' ? (t.en || '') : ((t.translations || {})[c] || '')));
      });
      var arts = (t.articleIds || []).map(function (aid) {
        var a = S().resolveArticle(aid);
        return a ? (a.noLabel ? U().tr(a.noLabel) : ('第 ' + a.no + ' 条')) : '';
      }).filter(Boolean);
      row.push(U().uniq(arts).join('、'));
      rowsOut.push(row);
    });
    return rowsOut;
  }

  CALR.terms = {
    rows: rows,
    search: search,
    byDomain: byDomain,
    annotate: annotate,
    popupHtml: popupHtml,
    glossaryRows: glossaryRows,
    domainName: domainName,
    SHOW_LANGS: SHOW_LANGS
  };
})(typeof window !== 'undefined' ? window : globalThis);
