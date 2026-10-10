/* ==========================================================================
   CALR · views/systems.js —— 法律体系对照视图（M2 可视化）
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

  var DEFAULT_HIER = {
    civil: ['constitution', 'law', 'decree', 'subdecree', 'local', 'judicial'],
    common: ['constitution', 'law', 'decree', 'subdecree', 'judicial'],
    mixed: ['constitution', 'law', 'decree', 'subdecree', 'local', 'judicial']
  };

  /** 列表分隔符：中文用顿号，其他语言用逗号 */
  function langSep() {
    return CALR.i18n.lang() === 'zh' ? '、' : ', ';
  }

  views.systems = {
    render: function (main) {
      var countries = S().countries();
      var levels = S().levels();
      var cols = levels.concat([
        { id: '__case', name: { zh: '判例法', en: 'Case law', vi: 'Án lệ', th: 'คำพิพากษา', id: 'Yurisprudensi', ms: 'Kes undang-undang' } },
        { id: '__islam', name: { zh: '伊斯兰法', en: 'Islamic law', vi: 'Luật Hồi giáo', th: 'กฎหมายอิสลาม', id: 'Hukum Islam', ms: 'Undang-undang Islam' } },
        { id: '__custom', name: { zh: '习惯法', en: 'Customary law', vi: 'Luật tập quán', th: 'กฎหมายจารีตประเพณี', id: 'Hukum adat', ms: 'Undang-undang adat' } }
      ]);

      var rows = countries.map(function (c) {
        var hier = (c.hierarchy && c.hierarchy.length) ? c.hierarchy : (DEFAULT_HIER[c.legalSystem] || []);
        var tags = (c.legalSystemTags || []).join(' ');
        return {
          c: c,
          cells: cols.map(function (col) {
            if (col.id === '__case') return { mark: (c.legalSystem === 'common' || c.legalSystem === 'mixed') ? 'yes' : 'no', note: (c.legalSystem === 'common' ? t('判例具有约束力') : (c.legalSystem === 'mixed' ? t('判例具参考或补充效力') : t('判例不具正式拘束力'))) };
            if (col.id === '__islam') return { mark: tags.indexOf('伊斯兰法') >= 0 ? 'yes' : 'no', note: tags.indexOf('伊斯兰法') >= 0 ? t('适用于穆斯林当事人的特定事项') : t('不适用') };
            if (col.id === '__custom') return { mark: tags.indexOf('习惯法') >= 0 ? 'part' : 'no', note: tags.indexOf('习惯法') >= 0 ? t('在特定族群或地区适用') : t('不适用') };
            var inHier = hier.indexOf(col.id) >= 0;
            var n = S().lawsOf(c.code).filter(function (l) { return l.level === col.id; }).length;
            return { mark: inHier ? (n ? 'yes' : 'part') : 'no', note: inHier ? (n ? n + ' ' + t('部已收录') : t('体系内存在，暂无收录')) : t('该国法律体系中无此层级') };
          })
        };
      });

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('法律体系对照视图') }]) +
        '<div class="page-head"><h1>' + esc(t('法律体系对照视图')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('横向对照 12 个法域的法律层级结构与法源类型，帮助使用者判断某一条文是否具有直接适用效力、是否需要辅以判例或宗教法核查。')) + '</p></div>' +

        '<div class="card card--pad" style="margin-bottom:16px">' +
          '<div class="row" style="justify-content:space-between">' +
            '<div class="systems-legend">' +
              '<span><span class="legend-dot" style="background:var(--calr-success)"></span>' + esc(t('体系内存在且已收录')) + '</span>' +
              '<span><span class="legend-dot" style="background:var(--calr-blue-400)"></span>' + esc(t('体系内存在、暂无收录')) + '</span>' +
              '<span><span class="legend-dot" style="background:var(--calr-gray-300)"></span>' + esc(t('该国体系中无此层级 / 不适用')) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="card" style="overflow:auto">' +
          '<table class="table systems-table">' +
            '<thead><tr><th style="min-width:150px">' + esc(t('法域')) + '</th>' +
              '<th style="min-width:96px">' + esc(t('法律体系')) + '</th>' +
              cols.map(function (col) { return '<th style="min-width:104px">' + esc(tr(col.name)) + '</th>'; }).join('') +
              '<th style="min-width:200px">' + esc(t('法源类型标注')) + '</th></tr></thead>' +
            '<tbody>' + rows.map(function (r) {
              return '<tr' + (r.c.code === 'CN' ? ' style="background:var(--calr-blue-50)"' : '') + '>' +
                '<td><a href="#/country/' + esc(r.c.code) + '">' + esc(tr(r.c.name)) + '</a>' +
                  (r.c.code === 'CN' ? ' <span class="tag tag--gold">' + esc(t('对照基准')) + '</span>' : '') + '</td>' +
                '<td>' + C().sysTag(r.c) + '</td>' +
                r.cells.map(function (cell) {
                  var map = { yes: ['●', 'var(--calr-success)'], part: ['○', 'var(--calr-blue-400)'], no: ['—', 'var(--calr-gray-400)'] };
                  var m = map[cell.mark];
                  return '<td title="' + esc(cell.note) + '"><span style="color:' + m[1] + ';font-size:16px">' + m[0] + '</span> ' +
                    '<span class="mini muted">' + esc(U().truncate(cell.note, 18)) + '</span></td>';
                }).join('') +
                '<td class="mini muted">' + esc((r.c.legalSystemTags || []).map(function (x) { return t(x); }).join(langSep())) + '</td>' +
              '</tr>';
            }).join('') + '</tbody>' +
          '</table>' +
        '</div>' +

        '<section class="section">' +
          C().section(t('对照要点与使用提示'), '') +
          '<div class="grid grid--2">' +
            tipCard(t('大陆法系国家（越南、泰国、印度尼西亚、柬埔寨、老挝、东帝汶、中国）'),
              t('裁判主要依据成文法典与法律条文。检索时应优先定位法律条文，并核对其是否被政令、部门规章细化；条文的适用效力以最新生效版本为准。')) +
            tipCard(t('普通法系国家（新加坡、缅甸）'),
              t('成文法与判例法并行。同一事项可能由成文法规定原则、由判例细化标准；本平台在法域页单独提供“判例 / 案例”模块，并建立判例与条文的双向引用。')) +
            tipCard(t('混合法系国家（马来西亚、文莱、菲律宾）'),
              t('马来西亚、文莱兼有普通法与伊斯兰法：涉及穆斯林当事人的婚姻、继承、宗教捐赠等事项适用伊斯兰法；菲律宾兼采大陆法与普通法，民法典与判例共同构成裁判依据。使用前请确认法源类型。')) +
            tipCard(t('制度衔接要点'),
              t('与我国制度存在差异时，本平台的条款比对功能会给出“制度衔接提示”，包括可援引的条约依据（RCEP、《中国—东盟投资协议》等）与争议解决路径建议。')) +
          '</div>' +
        '</section>' +
      '</div>';
    }
  };

  function tipCard(title, body) {
    return '<div class="card card--pad"><h3 style="font-size:var(--fs-h3)">' + esc(title) + '</h3>' +
      '<p class="small muted" style="margin:0">' + esc(body) + '</p></div>';
  }
})(typeof window !== 'undefined' ? window : globalThis);
