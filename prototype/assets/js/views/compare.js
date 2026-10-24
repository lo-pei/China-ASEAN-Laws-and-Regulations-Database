/* ==========================================================================
   CALR · views/compare.js —— 跨语言法律条款智能比对（M3）
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
  var MAX_SLOTS = 3;

  /** 快速示例：按“国别 + 主题”在数据集中动态挑选条文，避免硬编码 id 失效 */
  /* 主题关键词：用于在同一部法里挑出「真正讲这个话题」的条文。
     原来直接取 articles[0]，会拿「第一条 立法目的」去比「第一条 调整范围」，
     两条内容毫不相干，相似度只有 2%，对比毫无意义。 */
  var TOPIC_WORDS = {
    investment: ['外商投资', '外资', '准入', '负面清单', '投资', '投资者'],
    labor: ['劳动合同', '解除', '解雇', '雇佣', '职工', '劳动者', '工资'],
    data: ['数据', '个人信息', '跨境', '处理者', '数据主体'],
    company: ['公司', '股东', '董事', '注册资本', '监事', '清算']
  };

  /** 在一部法里按关键词挑最相关的条文；找不到就退回第一篇 */
  function pickArticle(law, topic) {
    var words = TOPIC_WORDS[topic] || [];
    var arts = law.articles || [];
    if (!arts.length) return null;
    var best = null, bestScore = 0;
    for (var i = 0; i < arts.length; i++) {
      var a = arts[i];
      var txt = U().plain(U().tr(a.text) || '') + ' ' + U().plain(U().tr(a.heading) || '');
      if (!txt) continue;
      var sc = 0;
      for (var w = 0; w < words.length; w++) {
        var idx = txt.indexOf(words[w]);
        if (idx >= 0) sc += (w < 3 ? 3 : 1);   /* 靠前的关键词更重要 */
      }
      /* 太短（目录标题）或太长（整章）都不适合作对比样本 */
      if (txt.length < 20) sc -= 2;
      if (txt.length > 800) sc -= 1;
      /* 覆盖的比对维度越多越好：维度多才比得出内容，否则报告全是「不适用」 */
      var cmp = CALR.compare;
      if (cmp && cmp.dimCovered && cmp.dimensions) {
        var dims = cmp.dimensions;
        for (var d = 0; d < dims.length; d++) {
          if (cmp.dimCovered(a, dims[d])) sc += 2;
        }
      }
      if (sc > bestScore) { bestScore = sc; best = a; }
    }
    return (bestScore > 0 ? best : arts[0]);
  }

  function buildPresets() {
    var defs = [
      { name: '中越外商投资准入对比', pairs: [['CN', 'investment'], ['VN', 'investment']] },
      { name: '中泰劳动用工解除对比', pairs: [['TH', 'labor'], ['CN', 'labor']] },
      { name: '新马数据合规要求对比', pairs: [['SG', 'data'], ['MY', 'data']] },
      { name: t('印尼与越南外资门槛对比'), pairs: [['ID', 'investment'], ['VN', 'investment']] },
      { name: t('中马公司治理对比'), pairs: [['CN', 'company'], ['MY', 'company']] }
    ];
    var out = [];
    defs.forEach(function (d) {
      var ids = [];
      d.pairs.forEach(function (p) {
        var law = S().laws().filter(function (l) {
          return l.country === p[0] && (l.topics || []).indexOf(p[1]) >= 0 && l.articles.length;
        })[0];
        if (!law) return;
        var art = pickArticle(law, p[1]);
        if (art) ids.push(art.id);
      });
      if (ids.length >= 2) out.push({ name: d.name, ids: ids });
    });
    return out;
  }

  views.compare = {
    render: function (main, params, query) {
      var PRESETS = buildPresets();
      var slots = [];
      for (var i = 0; i < MAX_SLOTS; i++) slots.push(query['s' + i] || '');
      var filled = slots.filter(Boolean);

      var report = null;
      if (filled.length >= 2) report = CALR.compare.report(filled);

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('跨语言条款比对') }]) +
        '<div class="page-head"><h1>' + esc(t('跨语言法律条款智能比对')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('选取 2–3 个法域的条文，系统自动对齐“适用范围 / 核心概念定义 / 法律后果 / 程序与期限 / 门槛与标准”五个维度，生成差异比对报告并给出制度衔接提示。')) + '</p></div>' +

        '<div class="card card--pad" style="margin-bottom:16px">' +
          '<div class="row" style="justify-content:space-between;margin-bottom:12px">' +
            '<h3 style="margin:0" class="card__title">' + esc(t('第一步：选择比对条文')) + '</h3>' +
            '<div class="row"><span class="mini muted">' + esc(t('快速示例')) + '：</span>' +
              PRESETS.map(function (p, i) { return '<button class="btn btn--ghost btn--sm" data-preset="' + i + '">' + esc(t(p.name)) + '</button>'; }).join('') +
            '</div>' +
          '</div>' +
          '<div class="compare-picker">' +
            slots.map(function (id, i) { return slotHtml(i, id); }).join('') +
          '</div>' +
          '<div class="row" style="margin-top:12px">' +
            '<button class="btn" id="run-compare"' + (filled.length < 2 ? ' disabled' : '') + '>' + esc(t('生成比对报告')) + '</button>' +
            '<button class="btn btn--outline" id="clear-slots">' + esc(t('清空')) + '</button>' +
            '<span class="mini muted">' + esc(t('已选择')) + ' ' + filled.length + ' / ' + MAX_SLOTS + ' ' + esc(t('条')) + '</span>' +
          '</div>' +
        '</div>' +

        (report && report.ok ? reportHtml(report) : (report ? '<div class="banner banner--warn"><span class="banner__icon">' + CALR.ui.icon('alert') + '</span><div>' + esc(report.message || '') + '</div></div>' :
          '<div class="card card--pad"><div class="empty"><div class="empty__icon">' + CALR.ui.icon('scales') + '</div><div class="empty__title">' +
          esc(t('请至少选择两个法域的条文')) + '</div><p class="small">' +
          esc(t('比对维度：条文结构 · 核心概念定义 · 法律后果 · 适用范围 · 程序与期限。也可以先点击上方“快速示例”体验。')) + '</p></div></div>')) +
      '</div>';

      /* --- 事件 --- */
      U().$$('[data-slot-country]', main).forEach(function (sel) {
        U().on(sel, 'change', function () {
          var i = sel.getAttribute('data-slot-country');
          var next = slots.slice(); next[i] = '';
          go(next);
        });
      });
      U().$$('[data-slot-article]', main).forEach(function (sel) {
        U().on(sel, 'change', function () {
          var i = parseInt(sel.getAttribute('data-slot-article'), 10);
          var next = slots.slice(); next[i] = sel.value;
          go(next, true);
        });
      });
      U().on(U().$('#clear-slots', main), 'click', function () { CALR.router.go('#/compare'); });
      U().on(U().$('#run-compare', main), 'click', function () { go(slots, true); });
      U().$$('[data-preset]', main).forEach(function (b) {
        U().on(b, 'click', function () {
          var p = PRESETS[parseInt(b.getAttribute('data-preset'), 10)];
          go([p.ids[0], p.ids[1], p.ids[2] || ''], true);
        });
      });
      U().on(U().$('#print-report', main), 'click', function () { window.print(); });
      U().on(U().$('#export-report', main), 'click', function () {
        if (!report || !report.ok) return;
        var rows = [['维度'].concat(report.items.map(function (it) { return it.countryName + ' ' + it.title + ' ' + it.noLabel; })).concat(['相似度', '差异判定'])];
        report.dimensions.forEach(function (d) {
          rows.push([d.name].concat(d.cells.map(function (c) { return c.text; })).concat([d.similarity + '%', d.level.name]));
        });
        rows.push([]);
        rows.push(['制度衔接提示']);
        report.tips.forEach(function (tip) { rows.push([tip.topicName, tip.text]); });
        U().download('CALR-条款比对报告.csv', U().toCsv(rows), 'text/csv;charset=utf-8');
        U().toast(t('比对报告已导出（CSV）'), 'ok');
      });

      function go(next, run) {
        var q = {};
        next.forEach(function (v, i) { if (v) q['s' + i] = v; });
        CALR.router.go(CALR.router.buildUrl('/compare', q));
      }
    }
  };

  /* ---------------- 选择槽 ---------------- */
  function slotHtml(i, selectedId) {
    var a = selectedId ? S().resolveArticle(selectedId) : null;
    var law = a ? S().law(a.lawId) : null;
    var countryCode = law ? law.country : '';
    var laws = countryCode ? S().lawsOf(countryCode) : [];
    return '<div class="slot' + (a ? ' is-filled' : '') + '">' +
      '<div class="slot__country">' + esc(t('法域')) + ' ' + (i + 1) + '</div>' +
      '<select class="select" data-slot-country="' + i + '" aria-label="' + esc(t('选择法域')) + '">' +
        '<option value="">' + esc(t('请选择法域…')) + '</option>' +
        S().countries().map(function (c) {
          return '<option value="' + esc(c.code) + '"' + (c.code === countryCode ? ' selected' : '') + '>' + esc(tr(c.name)) + '</option>';
        }).join('') +
      '</select>' +
      (countryCode
        ? '<select class="select" data-slot-article="' + i + '" aria-label="' + esc(t('选择条文')) + '">' +
            '<option value="">' + esc(t('请选择条文…')) + '</option>' +
            laws.map(function (l) {
              return '<optgroup label="' + esc(U().truncate(tr(l.title), 20)) + '">' +
                l.articles.map(function (art) {
                  var id = art.id;
                  return '<option value="' + esc(id) + '"' + (id === selectedId ? ' selected' : '') + '>' +
                    esc(tr(art.noLabel) || ('第 ' + art.no + ' 条')) + ' ' + esc(U().truncate(tr(art.heading), 14)) + '</option>';
                }).join('') + '</optgroup>';
            }).join('') +
          '</select>'
        : '<div class="slot__empty">' + esc(t('选择法域后可挑选条文')) + '</div>') +
      (a ? '<div class="slot__law">' + esc(U().truncate(tr(law.title), 22)) + '</div>' +
           '<div class="slot__text">' + esc(U().truncate(U().plain(tr(a.text)), 110)) + '</div>' : '') +
    '</div>';
  }

  /* ---------------- 报告 ---------------- */
  function reportHtml(r) {
    var overview = '<div class="card card--pad" style="margin-bottom:16px">' +
      '<div class="row" style="justify-content:space-between">' +
        '<div><h3 style="margin:0 0 4px">' + esc(t('比对结论')) + '</h3>' +
          '<p class="small muted" style="margin:0">' + esc(t('整体相似度')) + ' <b style="font-family:var(--font-mono);font-size:18px;color:var(--calr-blue-600)">' +
            r.overall + '%</b> · ' + esc(t('综合判定')) + '：' +
            '<span class="status" style="color:' + (r.overallLevel.id === 'same' ? 'var(--calr-success)' : (r.overallLevel.id === 'minor' ? 'var(--calr-warning)' : 'var(--calr-danger)')) + '">' + esc(r.overallLevel.name) + '</span>' +
            ' <span class="tag tag--outline">' + esc(t('可参与比对的维度')) + ' ' + r.comparableDims + ' / ' + r.dimensions.length + '</span>' +
          '</p></div>' +
        '<div class="row">' +
          '<button class="btn btn--outline btn--sm" id="export-report">' + esc(t('导出报告（CSV）')) + '</button>' +
          '<button class="btn btn--outline btn--sm" id="print-report">' + esc(t('打印 / 导出 PDF')) + '</button>' +
        '</div>' +
      '</div>' +

      '<table class="table" style="margin-top:12px"><thead><tr><th></th>' +
        r.items.map(function (it) { return '<th>' + esc(it.countryName) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        '<tr><td>' + esc(t('法规')) + '</td>' + r.items.map(function (it) { return '<td>' + esc(it.title) + '</td>'; }).join('') + '</tr>' +
        '<tr><td>' + esc(t('条文')) + '</td>' + r.items.map(function (it) { return '<td>' + esc(it.noLabel) + ' ' + esc(it.heading) + '</td>'; }).join('') + '</tr>' +
        r.items.map(function (x, i) {
          return '<tr><td>' + esc(t('与')) + ' ' + esc(r.items[(i + 1) % r.items.length].countryName) + esc(t('相似度')) + '</td>' +
            r.matrix[i].map(function (v, j) {
              var lv = CALR.compare.diffLevel(100 - v);
              var color = lv.id === 'same' ? 'var(--calr-success)' : (lv.id === 'minor' ? 'var(--calr-warning)' : 'var(--calr-danger)');
              return '<td style="color:' + color + ';font-family:var(--font-mono)">' + v + '% <span class="mini muted">' + esc(lv.name) + '</span></td>';
            }).join('') + '</tr>';
        }).join('') +
      '</tbody></table>' +
    '</div>';

    var dims = '<section class="section"><div class="section__head"><h2 class="section__title">' + esc(t('五维差异分析')) + '</h2>' +
      '<div class="section__more mini muted">' + esc(t('差异标记：')) +
        '<span class="diff--same" style="padding:0 6px">' + esc(t('基本一致')) + '</span> ' +
        '<span class="diff--minor" style="padding:0 6px">' + esc(t('存在差异')) + '</span> ' +
        '<span class="diff--major" style="padding:0 6px">' + esc(t('显著差异')) + '</span>' +
      '</div></div>' +
      r.dimensions.map(function (d) {
        var simTxt = d.similarity === null ? t('不适用') : (d.similarity + '%');
        return '<div class="card" style="margin-bottom:12px"><div class="card__head">' +
          '<h3 class="card__title">' + esc(d.name) + '</h3>' +
          '<span class="tag tag--outline" style="margin-left:auto">' + esc(t('维度相似度')) + ' ' + esc(simTxt) + '</span>' +
          '<span class="status ' + (d.similarity === null ? 'status--pending' : statusCls(d.level.id)) + '">' + esc(d.level.name) + '</span></div>' +
          '<div class="card__body"><p class="mini muted" style="margin:0 0 8px">' + esc(d.hint) + '</p>' +
          '<div class="grid" style="grid-template-columns:repeat(' + r.items.length + ',minmax(0,1fr))">' +
            d.cells.map(function (cell, i) {
              return '<div class="diff-cell ' + (cell.covered ? cell.level.cls : '') + '" style="padding:8px 10px;background:var(--bg-surface-alt);border-radius:var(--radius-sm)">' +
                '<div class="mini muted">' + esc(r.items[i].countryName) + (cell.covered ? '' : ' · ' + esc(t('未直接涉及'))) + '</div>' +
                '<div class="small">' + U().paragraphHtml(cell.text, null, 'cmp-p') + '</div>' +
                '<div class="mini muted" style="margin-top:6px">' +
                  (cell.covered && cell.similarity !== null
                    ? esc(t('相似度')) + ' ' + cell.similarity + '% · ' + esc(cell.level.name)
                    : esc(t('该维度不适用比对'))) +
                '</div>' +
              '</div>';
            }).join('') +
          '</div></div></div>';
      }).join('') + '</section>';

    var sideBySide = '<section class="section"><div class="section__head"><h2 class="section__title">' + esc(t('条文原文与译文并排展示')) + '</h2>' +
      '<div class="section__more mini muted">' + esc(t('原文语言与中文/英文译文并列，差异处高亮')) + '</div></div>' +
      '<div class="card" style="overflow:auto"><table class="table table--compare"><thead><tr><th style="min-width:120px">' + esc(t('项目')) + '</th>' +
        r.items.map(function (it) { return '<th>' + esc(it.countryName) + ' · ' + esc(it.noLabel) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        '<tr><td>' + esc(t('原文')) + '</td>' + r.items.map(function (it) {
          return '<td class="diff-cell diff--major">' + U().paragraphHtml(it.text, null, 'cmp-p') + '</td>';
        }).join('') + '</tr>' +
        '<tr><td>' + esc(t('其他语言版本')) + '</td>' + r.items.map(function (it) {
          return '<td>' + (it.translations.length
            ? it.translations.map(function (x) {
                return '<div class="mini"><b style="color:var(--text-secondary);font-weight:500">' +
                  esc((r.langLabel && r.langLabel[x.lang]) || x.lang) + '：</b>' + esc(x.text) + '</div>';
              }).join('')
            : '<span class="mini muted">—</span>') + '</td>';
        }).join('') + '</tr>' +
        '<tr><td>' + esc(t('制定机关 / 层级')) + '</td>' + r.items.map(function (it) {
          var law = it.law;
          return '<td class="small">' + esc(tr(law.issuingBody)) + '<br>' + C().levelTag(law.level) + ' ' + C().statusTag(law.status) + '</td>';
        }).join('') + '</tr>' +
      '</tbody></table></div></section>';

    var tips = '<section class="section"><div class="section__head"><h2 class="section__title">' + esc(t('制度衔接辅助')) + '</h2>' +
      '<div class="section__more mini muted">' + esc(t('基于条约框架与制度差异给出的衔接路径提示')) + '</div></div>' +
      r.tips.map(function (tip) {
        return '<div class="chain-tip" style="margin-bottom:10px"><b>' + esc(t('涉及领域')) + '：' + esc(tip.topicName) + '</b><br>' + esc(tip.text) + '</div>';
      }).join('') +
      '<p class="mini muted">' + esc(t('提示内容依据条约框架与制度差异自动生成，具体交易或争议应结合最新生效法律与个案事实判断。')) + '</p></section>';

    return overview + dims + sideBySide + tips;
  }

  function statusCls(id) {
    return 'status--' + (id === 'same' ? 'active' : (id === 'minor' ? 'amended' : 'repealed'));
  }
})(typeof window !== 'undefined' ? window : globalThis);
