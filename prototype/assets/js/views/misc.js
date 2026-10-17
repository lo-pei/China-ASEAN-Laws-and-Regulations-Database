/* ==========================================================================
   CALR · views/misc.js —— 关于我们（含使用条款 / 隐私政策 / 免责声明） / 数据来源 / 404
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

  var ABOUT_TABS = [
    { id: 'about', label: '关于我们' },
    { id: 'terms', label: '使用条款' },
    { id: 'privacy', label: '隐私政策' },
    { id: 'statement', label: '免责声明' }
  ];

  views.about = {
    render: function (main, params, query) {
      var tab = query.tab || 'about';
      if (!ABOUT_TABS.some(function (x) { return x.id === tab; })) tab = 'about';
      var st = S().stats();

      main.innerHTML = '' +
      '<div class="container page container--narrow">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('关于我们') }]) +
        '<div class="page-head"><h1>' + esc(t('关于我们')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('中国—东盟法律法规数据库（China–ASEAN Laws and Regulations Database，CALR）')) + '</p></div>' +

        '<div class="row" style="margin-bottom:18px">' + ABOUT_TABS.map(function (x) {
          return '<a class="btn ' + (x.id === tab ? '' : 'btn--outline') + ' btn--sm" href="#/about?tab=' + x.id + '">' + esc(t(x.label)) + '</a>';
        }).join('') + '</div>' +

        (tab === 'about' ? aboutPanel(st) : '') +
        (tab === 'terms' ? termsPanel() : '') +
        (tab === 'privacy' ? privacyPanel() : '') +
        (tab === 'statement' ? statementPanel() : '') +
      '</div>';
    }
  };

  function aboutPanel(st) {
    return '' +
    '<div class="card card--pad" style="margin-bottom:16px">' +
      '<h2>' + esc(t('平台定位')) + '</h2>' +
      '<p class="small muted">' + esc(t('面向东盟十一国与中国共十二个法域的法律法规检索平台，提供法规与条约检索、法律体系对照、跨语言条款比对、法律术语对照与基于检索增强生成的智能问答，为跨境法律实务、合规审查与比较法研究提供数据支持。')) + '</p>' +
      '<div class="grid grid--3">' +
        valueCard(CALR.ui.icon('gavel'), t('权威来源'), t('法规文本取自各国官方法律信息门户与公开法律汇编，逐条标注来源与收录情况。')) +
        valueCard(CALR.ui.icon('globe'), t('多语种'), t('支持中文、英文与东盟主要语种的检索与阅读，并提供法律术语多语对照。')) +
        valueCard(CALR.ui.icon('scales'), t('智能辅助'), t('以检索增强生成为基础，结论附法条出处，便于逐条复核。')) +
      '</div>' +
    '</div>' +

    '<div class="card card--pad" style="margin-bottom:16px">' +
      '<h2>' + esc(t('数据概况')) + '</h2>' +
      '<div class="grid grid--4">' +
        C().stat(U().num(st.countries), t('法域（个）')) +
        C().stat(U().num(st.laws), t('法规与文件（部）')) +
        C().stat(U().num(st.articlesTotal), t('条文（条）')) +
        C().stat(U().num(st.treaties), t('条约与协定（部）')) +
      '</div>' +
      '<p class="mini muted" style="margin:10px 0 0">' + esc(t('数据持续更新，完整来源清单与收录情况见')) + ' <a href="#/sources">' + esc(t('数据来源')) + '</a>。</p>' +
    '</div>' +

    '<div class="card card--pad">' +
      '<h2>' + esc(t('主要功能')) + '</h2>' +
      '<table class="table"><tbody>' +
        row(t('法规检索'), t('按名称、文号、关键词检索，支持按国家、主题、法律层级、时效性、公布日期、施行日期、制定机关与语言筛选。')) +
        row(t('条约检索'), t('检索 RCEP、中国—东盟自贸协定等条约与协定文件。')) +
        row(t('法律体系对照'), t('对照十二个法域的法律层级结构与法源类型差异。')) +
        row(t('跨语言条款比对'), t('选取多个法域的条文并排比对，标注差异并给出制度衔接提示。')) +
        row(t('法律术语对照'), t('查看法律术语在多语种中的对应译法与释义。')) +
        row(t('AI 问答'), t('以检索到的法条为依据生成回答，并附法条出处。')) +
      '</tbody></table>' +
    '</div>';
  }

  function termsPanel() {
    return '<div class="card card--pad">' +
      '<h2>' + esc(t('使用条款')) + '</h2>' +
      '<ol class="small muted" style="line-height:2">' +
        '<li>' + esc(t('本平台提供的法规文本、译文、术语与检索结果仅供法律研究与实务参考，正式引用请以各国官方公布的文本为准。')) + '</li>' +
        '<li>' + esc(t('用户可基于本平台数据进行检索、阅读与合理引用，引用时请注明出处为对应官方来源。')) + '</li>' +
        '<li>' + esc(t('未经许可，不得批量抓取、镜像、转售本平台数据，不得用于规避官方查询渠道的用途。')) + '</li>' +
        '<li>' + esc(t('平台提供人工智能辅助生成内容，该等内容可能存在偏差，用户应结合官方文本自行判断。')) + '</li>' +
        '<li>' + esc(t('“模型增强（自带 API Key）”为可选功能：由您自行向所选大模型服务商申请 API Key，并自行承担由此产生的 Token 费用；本平台不代收费用、不提供模型服务、不参与您与服务商之间的结算。')) + '</li>' +
        '<li>' + esc(t('启用该功能即表示您同意遵守所选服务商的服务条款与使用政策，并自行确认所在地区与服务商条款允许该等使用；因违反服务商条款产生的后果由您自行承担。')) + '</li>' +
        '<li>' + esc(t('因使用本平台内容产生的任何法律后果由用户自行承担。')) + '</li>' +
      '</ol>' +
    '</div>';
  }

  function privacyPanel() {
    return '<div class="card card--pad">' +
      '<h2>' + esc(t('隐私政策')) + '</h2>' +
      '<ol class="small muted" style="line-height:2">' +
        '<li>' + esc(t('本平台不采集与法律法规检索无关的个人信息。')) + '</li>' +
        '<li>' + esc(t('检索记录仅用于当次会话，不用于识别个人身份，也不向第三方提供。')) + '</li>' +
        '<li>' + esc(t('界面语言、深浅色模式等偏好设置保存在用户浏览器本地，不会上传。')) + '</li>' +
        '<li>' + esc(t('“模型增强”功能中，API Key 仅保存在您的浏览器（默认仅本次会话，关闭标签页即失效；您勾选“记住”后写入浏览器本地存储）。本平台无后端服务器，不接收、不存储、也无法读取您的 API Key。')) + '</li>' +
        '<li>' + esc(t('启用该功能后，您的提问与经本地检索得到的条文材料会发送给您自行填写的接口地址（通常为您选定的大模型服务商）；该等数据在该服务商处的处理适用其隐私政策，请自行评估后使用。')) + '</li>' +
        '<li>' + esc(t('除您填写的接口地址外，本平台不向任何第三方发送数据；本平台不具备采集使用记录的能力。')) + '</li>' +
        '<li>' + esc(t('如您通过页面所列联系方式与我们联系，我们仅在回复您的咨询所必需的范围内使用您提供的信息。')) + '</li>' +
      '</ol>' +
    '</div>';
  }

  function statementPanel() {
    return '<div class="card card--pad">' +
      '<h2>' + esc(t('免责声明')) + '</h2>' +
      '<ol class="small muted" style="line-height:2">' +
        '<li>' + esc(t('本平台法规文本来自各国官方法律信息门户与公开法律汇编，平台力求准确，但不排除存在录入或更新时差；正式引用请以官方公布文本为准。')) + '</li>' +
        '<li>' + esc(t('本平台不提供法律意见，不构成任何形式的委托代理关系。')) + '</li>' +
        '<li>' + esc(t('标注为“条目信息”的法规，平台尚未收录其条文文本，仅提供条目信息。')) + '</li>' +
        '<li>' + esc(t('人工智能辅助生成内容可能不准确或存在偏差，请以检索到的法条原文为准。')) + '</li>' +
        '<li>' + esc(t('“模型增强”模式下，答案由您自选的大模型生成，本平台不控制其内容，亦不对其准确性、完整性或适用性作出任何保证，不构成对模型输出的背书。')) + '</li>' +
        '<li>' + esc(t('本平台会对模型输出执行引用校验并剔除无法回溯至本地条文的句子；校验不通过时自动降级为本地检索结果。该机制用于降低风险，但不等同于人工法律审阅。')) + '</li>' +
      '</ol>' +
    '</div>';
  }

  function valueCard(icon, title, body) {
    return '<div class="feature-card" style="cursor:default;transform:none">' +
      '<div class="feature-card__icon">' + icon + '</div>' +
      '<div><p class="feature-card__title">' + esc(title) + '</p><p class="feature-card__desc">' + esc(body) + '</p></div></div>';
  }
  function row(name, desc) {
    return '<tr><td style="width:170px">' + esc(name) + '</td><td class="small muted">' + esc(desc) + '</td></tr>';
  }

  /* ---------------- 数据来源 ---------------- */
  /** 列表分隔符：中文用顿号，其他语言用逗号 */
  function langSep() {
    return CALR.i18n.lang() === 'zh' ? '、' : ', ';
  }

  views.sources = {
    render: function (main) {
      var countries = S().countries();
      var st = S().stats();
      var fullLaws = S().laws().filter(function (l) { return l.coverage === 'full'; });
      /* 真正"无条文文本"的条目：既非按需载入（catalog），也没有任何条文 */
      var pending = S().laws().filter(function (l) {
        return l.coverage !== 'catalog' && !(l.articles && l.articles.length);
      });
      var langs = U().uniq(fullLaws.map(function (l) { return l.fullText && l.fullText.language; }).filter(Boolean));

      var inventory = fullLaws.slice().sort(function (a, b) {
        return String(a.country).localeCompare(String(b.country)) || String(a.id).localeCompare(String(b.id));
      }).slice(0, 400).map(function (l) {
        var m = l.fullText || {};
        return '<tr>' +
          '<td>' + C().flagSvg(l.country, 'flag-mini') + ' ' + esc(S().countryName(l.country)) + '</td>' +
          '<td><a href="#/law/' + esc(l.id) + '">' + esc(tr(l.title)) + '</a><div class="mini muted">' + esc(l.id) + '</div></td>' +
          '<td class="mono">' + l.articles.length + '</td>' +
          '<td class="mini">' + esc(m.language ? CALR.i18n.nativeName(m.language) : '—') + '</td>' +
          '<td class="small">' + (m.sourceUrl
            ? '<a href="' + esc(m.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceLabel(l)) + '</a>'
            : esc(sourceLabel(l))) + '</td>' +
          '<td class="mono mini">' + esc(m.fetchedAt || '—') + '</td>' +
        '</tr>';
      }).join('');

      main.innerHTML = '' +
      '<div class="container page">' +
        C().breadcrumb([{ text: t('首页'), href: '#/' }, { text: t('数据来源') }]) +
        '<div class="page-head"><h1>' + esc(t('数据来源')) + '</h1>' +
          '<p class="page-head__desc">' + esc(t('法规文本来源、收录规模与收录情况公开如下，供逐条核验。')) + '</p></div>' +

        '<div class="card card--pad" style="margin-bottom:16px">' +
          '<div class="grid grid--4">' +
            C().stat(U().num(st.laws), t('法规与文件（部）')) +
            C().stat(U().num(st.articlesTotal), t('条文（条）')) +
            C().stat(U().num(st.fullTextLaws), t('已入库条文文本（部）')) +
            C().stat(U().num(st.countries), t('法域（个）')) +
          '</div>' +
          '<p class="mini muted" style="margin:10px 0 0">' +
            esc(t('条文文本逐条取自官方法律数据库或公开法律汇编，并在条目中标注来源与收录情况。')) +
            (langs.length ? ' ' + esc(t('文本语种：')) + esc(langs.map(function (x) { return CALR.i18n.nativeName(x); }).join(langSep())) + '。' : '') +
          '</p>' +
        '</div>' +

        '<section class="section" style="margin-top:0">' + C().section(t('各国法律信息门户'),
            '<button class="btn btn--ghost btn--sm" id="export-inventory">' + esc(t('导出清单（CSV）')) + '</button>') +
          '<div class="card" style="overflow:auto"><table class="table">' +
            '<thead><tr><th style="min-width:128px;white-space:nowrap">' + esc(t('法域')) + '</th><th style="min-width:110px">' + esc(t('法律体系')) + '</th>' +
              '<th style="min-width:190px">' + esc(t('官方法律信息门户')) + '</th><th style="min-width:110px">' + esc(t('主要语种')) + '</th>' +
              '<th style="min-width:120px">' + esc(t('已收录')) + '</th></tr></thead><tbody>' +
            countries.map(function (c) {
              var n = S().lawsOf(c.code).length;
              var arts = S().lawsOf(c.code).reduce(function (a, l) { return a + (l.articleCount || 0); }, 0);
              return '<tr>' +
                '<td><a href="#/country/' + esc(c.code) + '">' + C().flagSvg(c.code, 'flag-mini') + ' ' + esc(tr(c.name)) + '</a></td>' +
                '<td>' + C().sysTag(c) + '</td>' +
                '<td class="small">' + (c.sources || []).map(function (s) {
                  var nm = CALR.ui.portalLabel ? CALR.ui.portalLabel(s.url, s.name) : s.name;
              return s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(nm) + '</a>' : esc(nm);
                }).join('<br>') + '</td>' +
                '<td class="mini">' + esc((c.languages || []).map(function (l) { return CALR.i18n.nativeName(l); }).join(langSep())) + '</td>' +
                '<td class="small">' + n + ' ' + esc(t('部')) + ' / ' + arts + ' ' + esc(t('条')) + '</td>' +
              '</tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</section>' +

        (fullLaws.length
          ? '<section class="section">' + C().section(t('已入库条文文本清单'),
              '<span class="mini muted">' + fullLaws.length + ' ' + esc(t('部')) + '</span>') +
            '<div class="card" style="overflow:auto"><table class="table">' +
            '<thead><tr><th>' + esc(t('法域')) + '</th><th>' + esc(t('法规')) + '</th><th>' + esc(t('条数')) + '</th>' +
            '<th>' + esc(t('语种')) + '</th><th>' + esc(t('来源')) + '</th><th>' + esc(t('入库日期')) + '</th></tr></thead>' +
            '<tbody>' + inventory + '</tbody></table></div>' +
            (fullLaws.length > 400 ? '<p class="mini muted" style="margin-top:8px">' + esc(t('仅展示前 400 条，完整清单可导出 CSV。')) + '</p>' : '') +
            '<p class="mini muted" style="margin-top:8px">' + esc(t('核验方法：点击来源链接可回到官方页面，逐条比对条文文字与条号。')) + '</p>' +
          '</section>'
          : '') +

        (pending.length
          ? '<section class="section">' + C().section(t('尚未收录条文文本的条目'),
              '<span class="mini muted">' + pending.length + ' ' + esc(t('部')) + '</span>') +
            '<div class="card card--pad"><div class="row">' + pending.slice(0, 60).map(function (l) {
              return '<a class="tag tag--outline tag--clickable" href="#/law/' + esc(l.id) + '">' +
                esc(S().countryName(l.country)) + ' · ' + esc(U().truncate(tr(l.title), 18)) + '</a>';
            }).join('') + '</div>' +
            '<p class="mini muted" style="margin:10px 0 0">' + esc(t('上述法规目前仅提供条目信息，条文文本将在完成来源核验与校核后陆续发布。')) + '</p></div>' +
          '</section>'
          : '') +

        '<section class="section">' + C().section(t('数据类别与更新频率'), '') +
          '<div class="card card--pad"><table class="table">' +
            '<thead><tr><th>' + esc(t('数据类型')) + '</th><th>' + esc(t('来源')) + '</th><th>' + esc(t('更新频率')) + '</th></tr></thead><tbody>' +
            srcRow(t('中国法律法规'), t('国家法律法规数据库（flk.npc.gov.cn）、中国政府网'), t('法规公布后同步')) +
            srcRow(t('东盟各国成文法'), t('各国官方公报与法律信息门户'), t('按官方公布节奏更新')) +
            srcRow(t('国际条约与协定'), t('中国—东盟自贸区官网、条约保存机关官方渠道'), t('按生效情况更新')) +
            srcRow(t('判例与裁判文书'), t('各国最高法院官方发布渠道'), t('定期更新')) +
            srcRow(t('法律术语多语对照'), t('法律术语库与专业译审成果'), t('持续扩充')) +
            '</tbody></table></div>' +
        '</section>' +

        '<section class="section">' + C().section(t('著作权说明'), '') +
          '<div class="card card--pad"><p class="small muted" style="margin:0">' +
            esc(t('多数国家的法律、法规及国家机关的决议、决定、命令等官方文件不属于著作权保护范围，但官方公报的版式、数据库编排及第三方译文可能受保护。本平台仅收录官方已公开发布的法规文本正文，不复制其版式与第三方译文；若权利人提出异议，我们将及时核实并处理。')) +
          '</p></div>' +
        '</section>' +
      '</div>';

      var btn = U().$('#export-inventory', main);
      U().on(btn, 'click', function () {
        var rows = [['法域', '法规ID', '法规名称', '条数', '语种', '来源', '来源URL', '入库日期']];
        fullLaws.forEach(function (l) {
          var m = l.fullText || {};
          rows.push([S().countryName(l.country), l.id, tr(l.title), l.articles.length, m.language || '', sourceLabel(l), m.sourceUrl || '', m.fetchedAt || '']);
        });
        U().download('CALR-条文文本清单.csv', U().toCsv(rows), 'text/csv;charset=utf-8');
        U().toast(t('清单已导出（CSV）'), 'ok');
      });
    }
  };

  function srcRow(a, b, c) {
    return '<tr><td>' + esc(a) + '</td><td class="small muted">' + esc(b) + '</td><td>' + esc(c) + '</td></tr>';
  }

  /* 数据来源显示名：中国法统一显示为「中国国家法律法规数据库」 */
  var CN_SOURCE_NAME = '中国国家法律法规数据库';
  function sourceLabel(law) {
    if (law.country === 'CN') {
      return CALR.ui.portalLabel ? CALR.ui.portalLabel('https://flk.npc.gov.cn', CN_SOURCE_NAME) : CN_SOURCE_NAME;
    }
    return (law.fullText && law.fullText.sourceName) || t('官方来源');
  }

  /* ---------------- 404 ---------------- */
  views.notfound = {
    render: function (main) {
      main.innerHTML = '<div class="container page">' +
        C().emptyState(CALR.ui.icon('docs'), t('未找到该页面'),
          t('您访问的路径不存在或已调整，请通过下方入口重新访问。'),
          '<p style="margin-top:12px">' +
            '<a class="btn" href="#/">' + esc(t('返回首页')) + '</a> ' +
            '<a class="btn btn--outline" href="#/search">' + esc(t('法规检索')) + '</a> ' +
            '<a class="btn btn--outline" href="#/systems">' + esc(t('法律体系')) + '</a>' +
          '</p>') +
        '</div>';
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
