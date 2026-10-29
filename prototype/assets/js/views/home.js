/* ==========================================================================
   CALR · views/home.js —— 首页（极简主义，对标 data.worldbank.org）
   结构：① 主视觉（左对齐标题 + 固定英文 + 居中加长检索栏）
         ② 法律体系介绍区（12 法域卡片，含 16:10 预留图片位 + 法系筛选）
         ③ 数据库介绍区（关键数字 + 三个入口）
         ④ 关于我们区
   页脚由 app.js 统一渲染。
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

  /* 法律体系介绍区图片位：assets/img/systems/<法域代码小写>.{jpg,jpeg,png,webp} */
  var SYS_EXT = ['jpg', 'jpeg', 'png', 'webp'];

  /* 法系 → 中文/英文标签键 */
  var FAMILY_KEY = { civil: '大陆法系', common: '普通法系', mixed: '混合法系' };

  /* 卡片呈现顺序：中国优先，其后按已收录规模降序的东盟十国 */
  var ORDER = ['CN', 'TH', 'BN', 'MY', 'VN', 'MM', 'LA', 'ID', 'PH', 'SG', 'KH', 'TL'];

  /* ---------------- 统计 ---------------- */
  function artsOf(law) {
    if (law.articles && law.articles.length) return law.articles.length;
    return law.articleCount || 0;
  }

  function countryStats() {
    var by = {};
    S().laws().forEach(function (l) {
      var b = by[l.country] || (by[l.country] = { laws: 0, articles: 0 });
      b.laws++;
      b.articles += artsOf(l);
    });
    return by;
  }

  /* ---------------- ① 主视觉 ---------------- */
  function heroHtml() {
    var lang = CALR.i18n.lang();
    return '' +
      '<section class="hero-lite">' +
        '<div class="container">' +
          /* 标题块：左对齐 */
          '<h1 class="hero-lite__title">' + esc(t('中国—东盟法律法规数据库')) + '</h1>' +
          /* 小英文：固定英文，不随语言切换；英文界面下与主标题重复，故隐藏 */
          (lang === 'en' ? '' :
            '<p class="hero-lite__en">China–ASEAN Laws and Regulations Database</p>') +
          /* 检索栏左对齐，右侧一行说明补白 */
          '<div class="hero-lite__row">' +
            '<form class="hero-lite__search" id="hero-search-form" role="search">' +
              '<div class="searchbox searchbox--xl">' +
                '<span class="searchbox__icon" aria-hidden="true">' + CALR.ui.icon('search') + '</span>' +
                '<input class="searchbox__input" id="hero-q" name="q" autocomplete="off" ' +
                  'placeholder="' + esc(t('输入法规名称、文号或关键词')) + '" aria-label="' + esc(t('检索')) + '">' +
                '<button class="btn btn--lg" type="submit">' + esc(t('检索')) + '</button>' +
              '</div>' +
            '</form>' +
            '<p class="hero-lite__note">' + esc(t('支持按法规名称、文号或关键词检索，覆盖中国与东盟十国共十二个法域的官方法规文本；结果可按国家、主题、法律层级与时效性进一步筛选。')) + '</p>' +
          '</div>' +
          heroStatsHtml() +
        '</div>' +
      '</section>';
  }

  /** 数据规模：把最硬的四个数字摆在首屏。数值全部来自 store 统计，不写死。 */
  function heroStatsHtml() {
    var st = S().stats() || {};
    var items = [
      { n: st.laws, label: t('部法规') },
      { n: st.articlesTotal || st.articles, label: t('条条文') },
      { n: st.countries, label: t('个法域') },
      /* 注意：st.languages 是「数据语种」（10 种原文语言），不是界面语言。
         界面语言数应取 i18n 支持的语种数，两者不要混用。 */
      { n: (CALR.i18n.langs && CALR.i18n.langs().length) || 6, label: t('种界面语言') }
    ];
    return '<dl class="hero-stats">' + items.map(function (it) {
      return '<div class="hero-stats__item">' +
        '<dd class="hero-stats__n">' + esc(formatNum(it.n)) + '</dd>' +
        '<dt class="hero-stats__l">' + esc(it.label) + '</dt>' +
      '</div>';
    }).join('') + '</dl>';
  }

  /* ---------------- ② 法律体系介绍区 ---------------- */
  function systemCard(c, st) {
    var code = c.code;
    var fam = FAMILY_KEY[c.legalSystem] || c.legalSystem || '';
    var tags = (c.legalSystemTags || []).map(function (x) {
      return '<span class="tag tag--outline">' + esc(t(x)) + '</span>';
    }).join('');
    var src = (c.sources && c.sources[0]) || null;
    var desc = (c.summary && (c.summary[CALR.i18n.lang()] || c.summary.en || c.summary.zh)) || '';
    return '' +
      '<article class="sys-card" data-family="' + esc(c.legalSystem || '') + '" data-code="' + esc(code) + '">' +
        '<a class="sys-card__media" href="#/country/' + esc(code) + '" aria-label="' + esc(tr(c.name)) + '">' +
          /* 预留图片位：无图时显示 旗帜 + 法系渐变 + 法域名 */
          '<span class="sys-card__ph" data-code="' + esc(code) + '">' +
            C().flagSvg(code, 'flag sys-card__flag') +
            '<span class="sys-card__phname">' + esc(tr(c.name)) + '</span>' +
          '</span>' +
        '</a>' +
        '<div class="sys-card__body">' +
          '<h3 class="sys-card__name"><a href="#/country/' + esc(code) + '">' + esc(tr(c.name)) + '</a></h3>' +
          '<div class="sys-card__tags"><span class="tag tag--blue">' + esc(chipLabel(t(fam))) + '</span>' + tags + '</div>' +
          '<p class="sys-card__desc">' + esc(desc) + '</p>' +
          '<div class="sys-card__meta">' + esc(t('法规')) + ' <b>' + formatNum(st.laws) + '</b> ' + esc(t('部')) +
            ' · ' + esc(t('条文')) + ' <b>' + formatNum(st.articles) + '</b> ' + esc(t('条')) + '</div>' +
          (src ? '<a class="sys-card__src" href="' + U().attr(src.url) + '" target="_blank" rel="noopener noreferrer">' +
            esc(t('官方来源')) + '：' + esc(portalShortName(src)) + ' ' + extArrow() + '</a>' : '') +
        '</div>' +
      '</article>';
  }

  function portalShortName(src) {
    /* 优先用中英对照表，保证英文界面不出现中文来源名 */
    if (CALR.ui && CALR.ui.portalLabel) {
      var lab = CALR.ui.portalLabel(src.url, null);
      if (lab) return lab;
    }
    var s = typeof src.name === 'string' ? src.name : ((src.name && (src.name.zh || src.name.en)) || '');
    return s.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim() || src.url;
  }

  function extArrow() {
    return '<svg class="ext-icon" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">' +
      '<path d="M9 1h6v6h-2V4.4L7.7 9.7 6.3 8.3 11.6 3H9V1z" fill="currentColor"/>' +
      '<path d="M2 3h5v2H4v7h7V9h2v6H2V3z" fill="currentColor"/></svg>';
  }

  function formatNum(n) {
    return String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /** 英文界面下把法系标签首字母大写（中文/泰文等无影响） */
  function chipLabel(s) {
    s = String(s || '');
    if (CALR.i18n.lang() !== 'en' || !s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function systemsHtml() {
    var st = countryStats();
    var countries = S().countries().slice().sort(function (a, b) {
      var ia = ORDER.indexOf(a.code), ib = ORDER.indexOf(b.code);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    return '' +
      '<section class="section home-sec home-sec--band" id="home-systems">' +
        '<div class="container">' +
          '<div class="home-sec__head">' +
            '<h2 class="home-sec__title">' + esc(t('法律体系')) + '</h2>' +
            '<p class="home-sec__sub">' + esc(t('12 个法域、三大法系，成文法与判例法并行的区域法律图景')) + '</p>' +
            '<a class="home-sec__more" href="#/systems">' + esc(t('查看完整法律体系')) + ' →</a>' +
          '</div>' +
          '<div class="sys-grid" id="sys-grid">' +
            countries.map(function (c) { return systemCard(c, st[c.code] || { laws: 0, articles: 0 }); }).join('') +
          '</div>' +
        '</div>' +
      '</section>';
  }
  /* ---------------- ②b 东盟成员国地图（真实国界 · Natural Earth 公有领域数据） ---------------- */
  var MAP_W = 1000, MAP_H = 800, MAP_PAD = 8;
  var MAP_LON0 = 91.0, MAP_LON1 = 143.0, MAP_LAT0 = -12.5, MAP_LAT1 = 30.0;

  /* 标签像素偏移：地图缩小后需重新避让，避免标签互相遮挡或越界 */
  var MAP_TAG_OFFSET = {
    CN: [120, 24], MM: [-16, -16], VN: [42, -2], LA: [24, -4], KH: [24, 12],
    MY: [-34, 10], SG: [-44, 24], BN: [6, -28], ID: [4, 6], PH: [0, -8], TL: [0, -4]
  };

  function mapProject(lon, lat) {
    return [
      (lon - MAP_LON0) / (MAP_LON1 - MAP_LON0) * (MAP_W - 2 * MAP_PAD) + MAP_PAD,
      (MAP_LAT1 - lat) / (MAP_LAT1 - MAP_LAT0) * (MAP_H - 2 * MAP_PAD) + MAP_PAD
    ];
  }

  /** 经纬网（每 5 度） */
  function mapGraticule() {
    var out = [];
    for (var lon = 95; lon <= 140; lon += 5) {
      var a = mapProject(lon, MAP_LAT1), b = mapProject(lon, MAP_LAT0);
      out.push('<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) +
        '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>');
    }
    for (var lat = -10; lat <= 30; lat += 5) {
      var c = mapProject(MAP_LON0, lat), d = mapProject(MAP_LON1, lat);
      out.push('<line x1="' + c[0].toFixed(1) + '" y1="' + c[1].toFixed(1) +
        '" x2="' + d[0].toFixed(1) + '" y2="' + d[1].toFixed(1) + '"/>');
    }
    return out.join('');
  }

  function mapHtml() {
    var M = root.CALR_ASEAN_MAP;
    if (!M || !M.countries || !M.countries.length) return '';
    var st = countryStats();

    var shapes = M.countries.map(function (c) {
      var isRef = (c.code === 'CN');
      return '<path class="map-country' + (isRef ? ' map-country--ref' : '') + '" ' +
        'd="' + c.d + '" data-code="' + esc(c.code) + '"><title>' +
        U().attr(S().countryName(c.code)) + '</title></path>';
    }).join('');

    var tags = M.countries.map(function (c) {
      var country = S().country(c.code);
      if (!country) return '';
      var off = MAP_TAG_OFFSET[c.code] || [0, 0];
      var left = (c.cx / MAP_W) * 100;
      var top = (c.cy / MAP_H) * 100;
      var n = st[c.code] || { laws: 0, articles: 0 };
      var isRef = (c.code === 'CN');
      return '<a class="map-tag' + (isRef ? ' map-tag--ref' : '') + '" href="#/country/' + esc(c.code) + '" ' +
        'style="left:' + left.toFixed(2) + '%;top:' + top.toFixed(2) + '%;' +
        'transform:translate(calc(-50% + ' + off[0] + 'px), calc(-50% + ' + off[1] + 'px))" ' +
        'title="' + U().attr(tr(country.name)) + '　' + formatNum(n.laws) + ' ' + esc(t('部')) + '">' +
        C().flagSvg(c.code, 'map-tag__flag') +
        '<span class="map-tag__name">' + esc(tr(country.name)) + '</span>' +
        '<span class="map-tag__n">' + formatNum(n.laws) + '</span>' +
        '</a>';
    }).join('');

    return '' +
      '<section class="section home-sec home-sec--surface" id="home-map">' +
        '<div class="container">' +
          '<div class="home-sec__head">' +
            '<h2 class="home-sec__title">' + esc(t('东盟成员国')) + '</h2>' +
            '<p class="home-sec__sub">' + esc(t('东盟十国与中国共同构成本库的十二个法域。下图按真实经纬位置绘出各国疆域，点击任一国家可进入该国法律体系页。')) + '</p>' +
          '</div>' +
          '<div class="asean-map">' +
            '<svg class="asean-map__svg" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '" ' +
              'preserveAspectRatio="xMidYMid meet" role="img" ' +
              'aria-label="' + U().attr(t('东盟成员国分布地图')) + '">' +
              '<g class="map-grat">' + mapGraticule() + '</g>' +
              '<g class="map-land">' + shapes + '</g>' +
            '</svg>' +
            '<div class="asean-map__tags">' + tags + '</div>' +
          '</div>' +
          '<p class="asean-map__note">' + esc(t('地图数据来源：Natural Earth 1:50m 国界（公有领域），仅供位置示意，不代表官方立场与精确边界。')) + '</p>' +
        '</div>' +
      '</section>';
  }

  /* ---------------- ③ 数据库介绍区 ---------------- */
  function dbHtml() {
    var st = S().stats();
    var tiles = [
      [st.countries, '法域'],
      [st.laws, '法规'],
      [st.articlesTotal, '条文'],
      [st.languages || CALR.i18n.langs().length, '界面语言']
    ];
    var entries = [
      ['法律检索', '按国家、主题、法律层级、时效性与制定机关筛选，定位中国与东盟各国法规。', '#/search'],
      ['AI 智能查询', '基于库内法条做检索增强问答，每条结论附条文出处，可逐条回溯原文。', '#/assistant'],
      ['数据来源', '逐条标注官方来源、入库日期与收录形态，可回访官方页面核验。', '#/sources']
    ];
    return '' +
      '<section class="section home-sec home-sec--band" id="home-db">' +
        '<div class="container">' +
          '<div class="home-sec__head">' +
            '<h2 class="home-sec__title">' + esc(t('数据库')) + '</h2>' +
            '<p class="home-sec__sub">' + esc(t('本数据库收录中国与东盟十国共十二个法域的官方法规文本，条文取自各国官方发布渠道，保留来源链接与入库日期，可逐条回访核验。')) + '</p>' +
          '</div>' +
          '<div class="stat-row">' +
            tiles.map(function (x) {
              return '<div class="stat-tile"><div class="stat-tile__n">' + formatNum(x[0]) + '</div>' +
                '<div class="stat-tile__l">' + esc(t(x[1])) + '</div></div>';
            }).join('') +
          '</div>' +
          '<div class="entry-row">' +
            entries.map(function (e) {
              return '<a class="entry-card" href="' + U().attr(e[2]) + '">' +
                '<h3 class="entry-card__t">' + esc(t(e[0])) + '</h3>' +
                '<p class="entry-card__d">' + esc(t(e[1])) + '</p>' +
                '<span class="entry-card__go">' + esc(t('进入')) + ' →</span></a>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>';
  }

  /* ---------------- ④ 关于我们区（四块内容直接写在主页，不再跳转） ---------------- */
  function aboutHtml() {
    var st = S().stats();
    var list = function (items) {
      return '<ol class="faq__list">' + items.map(function (x) {
        return '<li>' + esc(t(x)) + '</li>';
      }).join('') + '</ol>';
    };

    /* 关于我们 */
    var pAbout =
      '<p>' + esc(t('面向中国与东盟十国共十二个法域（含多边条约）的法律法规检索平台，提供法规与条约检索、法律体系对照、规范引注导出，以及基于检索增强生成的智能问答，为跨境法律实务、合规审查与比较法研究提供数据支持。')) + '</p>' +
      '<p>' + esc(t('平台有三种使用形态：直接用浏览器打开本地文件即可离线运行的纯静态形态；由后端服务托管、启用混合检索与条文级语义问答的后端形态；以及面向移动设备的自适应界面。三种形态共用同一套前端代码。')) + '</p>' +
      '<p class="mini muted">' + esc(t('项目为 2026 年中国（广西）—东盟“AI+法律”应用创新大赛参赛作品，由上海对外经贸大学一粒橡子队建设，仅供学术研究与竞赛演示使用。')) + '</p>';

    /* 数据来源 */
    var pSources =
      '<div class="stat-row stat-row--tight">' +
        [[st.countries, '法域'], [st.laws, '法规'], [st.articlesTotal, '条文'],
         [(CALR.i18n.langs && CALR.i18n.langs().length) || 6, '界面语言']]
          .map(function (x) {
            return '<div class="stat-tile"><div class="stat-tile__n">' + formatNum(x[0]) + '</div>' +
              '<div class="stat-tile__l">' + esc(t(x[1])) + '</div></div>';
          }).join('') +
      '</div>' +
      '<h4 class="faq__sub">' + esc(t('官方来源')) + '</h4>' +
      '<p>' + esc(t('法规文本取自各国官方法律信息门户与公开法律汇编，涉中国政府网、国家法律法规数据库、全国人大网；文莱总检察长署法律在线；柬埔寨法律与司法部；印度尼西亚法律文书与法规数据库；老挝官方公报；马来西亚总检察署法律在线；缅甸法律事务部；菲律宾官方公报；新加坡法规在线；泰国政府公报；越南法律数据库；东帝汶司法部；以及东盟条约官网等。')) + '</p>' +
      '<p>' + esc(t('每部法规记录官方来源名称与地址、抓取与入库日期、收录形态（全文／仅条目）以及原文语种，可在详情页一键回访官方页面核验。')) + '</p>' +
      '<h4 class="faq__sub">' + esc(t('规模口径')) + '</h4>' +
      '<p>' + esc(t('截至 2026 年 10 月 29 日：12 个法域、42,121 部法规、564,579 条条文、正文约 6.02 亿字符；译文层独立收录 5,633 部法规的 90,627 条逐条译文；中文标题覆盖 30,512 部（72.44%），其余保留官方原文标题。')) + '</p>' +
      '<p class="mini muted">' + esc(t('法规原文属于官方公开文件的范畴。多数国家的法律、法规及国家机关的决议、决定、命令等官方文件不属于著作权保护范围，但官方公报的版式、数据库编排及第三方译文可能受保护。本平台仅收录官方已公开发布的法规文本正文，不复制其版式与第三方译文；若权利人提出异议，我们将及时核实并处理。译文层中标注为机器翻译的条目由开源模型生成，未经人工校对，仅供参考。')) + '</p>' +
      '<p class="mini muted">' + esc(t('技术组件许可：语义检索使用 MIT 许可的开源模型 BAAI/bge-m3；标题翻译使用 CC-BY-NC-4.0 许可的 facebook/nllb-200-distilled-600M，仅用于非商业性的学术研究与竞赛演示。')) + '</p>';

    /* 使用条款与隐私政策 */
    var pTerms =
      '<h4 class="faq__sub">' + esc(t('使用条款')) + '</h4>' + list([
        '本平台提供的法规文本、译文与检索结果仅供法律研究与实务参考，正式引用请以各国官方公布的文本为准。',
        '用户可基于本平台数据进行检索、阅读与合理引用，引用时请注明出处为对应官方来源；平台同时提供符合 GB/T 7714-2015 与 Bluebook 规范的引注格式便于直接使用。',
        '未经许可，不得批量抓取、镜像、转售本平台数据，不得用于规避官方查询渠道的用途；后端服务对接口调用设有频率限制，请勿绕过。',
        '平台提供人工智能辅助生成内容，该等内容可能存在偏差，用户应结合官方文本自行判断。',
        '平台中的机器翻译（含法规标题与条文译文）由开源模型生成，未经人工校对，不得作为正式译本使用。',
        '“模型增强（自带 API Key）”为可选功能：由您自行向所选大模型服务商申请 API Key，并自行承担由此产生的 Token 费用；本平台不代收费用、不提供模型服务、不参与您与服务商之间的结算。',
        '启用该功能即表示您同意遵守所选服务商的服务条款与使用政策，并自行确认所在地区与服务商条款允许该等使用；因违反服务商条款产生的后果由您自行承担。',
        '因使用本平台内容产生的任何法律后果由用户自行承担。'
      ]) +
      '<h4 class="faq__sub">' + esc(t('隐私政策')) + '</h4>' + list([
        '本平台不采集与法律法规检索无关的个人信息，无需注册登录。',
        '界面语言、深浅色模式、字号等偏好设置保存在用户浏览器本地，不会上传。',
        '纯静态形态下，检索与阅读完全在浏览器内完成，平台不接收任何数据。',
        '后端形态下，服务端仅记录必要的运行日志（访问时间、接口路径、响应状态、请求来源的匿名网络地址），用于故障排查与频率限制。这些日志不包含您的提问正文与检索词，仅保留有限时长，不用于识别个人身份，不向任何第三方提供。',
        '“模型增强”功能中，API Key 仅保存在当前标签页的浏览器会话存储中，关闭标签页即失效；该密钥不会被发送至本平台后端，后端也无法读取。',
        '启用该功能后，您的提问与经本地检索得到的条文材料会发送给您自行填写的接口地址（通常为您选定的大模型服务商）；该等数据在该服务商处的处理适用其隐私政策，请自行评估后使用。',
        '除您填写的接口地址外，本平台不向任何第三方发送您的数据。',
        '如您通过页面所列联系方式与我们联系，我们仅在回复您的咨询所必需的范围内使用您提供的信息。'
      ]);

    /* 免责声明 */
    var pStatement = list([
      '本平台法规文本来自各国官方法律信息门户与公开法律汇编，平台力求准确，但不排除存在录入或更新时差；正式引用请以官方公布文本为准。',
      '本平台不提供法律意见，不构成任何形式的委托代理关系。',
      '标注为“条目信息”的法规，平台尚未收录其条文文本，仅提供条目信息。',
      '平台中的中文标题为便于检索而整理，部分由机器翻译生成，与官方中文译名可能不一致；法规正文的中文译文同样可能未经人工校对。',
      '人工智能辅助生成内容可能不准确或存在偏差，请以检索到的法条原文为准。所有 AI 生成内容均标注“AI 辅助生成，仅供参考”。',
      '“模型增强”模式下，答案由您自选的大模型生成，本平台不控制其内容，亦不对其准确性、完整性或适用性作出任何保证，不构成对模型输出的背书。',
      '本平台会对模型输出执行引用校验并剔除无法回溯至本地条文的句子；校验不通过时自动降级为本地检索结果。该机制用于降低风险，但不等同于人工法律审阅。',
      '平台未收录条文级修订记录，详情页的“版本与变迁”仅呈现法规层面的公布、施行、修正与版本日期；同名法规不代表同一部法的不同版本。',
      '本平台免费开放，无需注册登录；如遇内容问题，欢迎通过页脚联系方式反馈。'
    ]);

    var panels = [
      ['关于我们', true, pAbout],
      ['数据来源', true, pSources],
      ['使用条款与隐私政策', true, pTerms],
      ['免责声明', true, pStatement]
    ];

    return '' +
      '<section class="section home-sec home-sec--surface" id="home-about">' +
        '<div class="container">' +
          '<div class="home-sec__head">' +
            '<h2 class="home-sec__title">' + esc(t('关于我们')) + '</h2>' +
          '</div>' +
          '<div class="faq">' +
            panels.map(function (x) {
              return '<details class="faq__item"' + (x[1] ? ' open' : '') + '>' +
                '<summary class="faq__q">' + esc(t(x[0])) + '<span class="faq__mark" aria-hidden="true"></span></summary>' +
                '<div class="faq__a">' + x[2] + '</div>' +
                '</details>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>';
  }

  /* ---------------- 侧边快速跳转（滚动一定距离后出现） ---------------- */
  var TOC_ITEMS = [
    ['home-systems', '法律体系'],
    ['home-map', '全球布局'],
    ['home-db', '数据库概况'],
    ['home-about', '关于我们']
  ];

  function tocHtml() {
    return '<nav class="home-toc" id="home-toc" aria-label="' + esc(t('快速跳转')) + '">' +
      '<div class="home-toc__title">' + esc(t('快速跳转')) + '</div>' +
      TOC_ITEMS.map(function (it) {
        return '<a class="home-toc__item" href="#' + it[0] + '" data-toc="' + it[0] + '">' +
          '<span class="home-toc__dot" aria-hidden="true"></span>' +
          '<span class="home-toc__label">' + esc(t(it[1])) + '</span>' +
        '</a>';
      }).join('') +
    '</nav>';
  }

  var tocTimer = null;
  function wireToc(main) {
    var toc = U().$('#home-toc', main);
    if (!toc) return;

    function onScroll() {
      /* 页面已切走则停止轮询，避免残留定时器 */
      if (!document.body.contains(toc)) {
        if (tocTimer) { clearInterval(tocTimer); tocTimer = null; }
        return;
      }
      var y = root.scrollY || document.documentElement.scrollTop || 0;
      /* 下滚 420px 后才出现 */
      toc.classList.toggle('is-visible', y > 420);

      /* scroll-spy：取最后一个「顶部已越过视口上 1/3」的区块 */
      var probeY = y + (root.innerHeight || 800) * 0.33;
      var active = null;
      TOC_ITEMS.forEach(function (it) {
        var el = U().$('#' + it[0], main);
        if (!el) return;
        if (el.getBoundingClientRect().top + y <= probeY) active = it[0];
      });
      U().$$('.home-toc__item', toc).forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-toc') === active);
      });
    }

    /* 点击平滑滚动到目标区块 */
    U().$$('.home-toc__item', toc).forEach(function (a) {
      U().on(a, 'click', function (e) {
        e.preventDefault();
        var el = U().$('#' + a.getAttribute('data-toc'), main);
        if (!el) return;
        var targetTop = el.getBoundingClientRect().top + (root.scrollY || 0) - 76;
        var before = root.scrollY || 0;
        try { root.scrollTo({ top: targetTop, behavior: 'smooth' }); }
        catch (err) { root.scrollTo(0, targetTop); }
        /* 兜底：某些环境（含无头浏览器）不执行平滑动画，700ms 后仍未移动就直接跳 */
        setTimeout(function () {
          var now = root.scrollY || 0;
          if (Math.abs(now - before) < 8) root.scrollTo(0, targetTop);
        }, 700);
        el.classList.add('is-jump-target');
        setTimeout(function () { el.classList.remove('is-jump-target'); }, 1400);
      });
    });

    /* 用轮询而非 scroll 事件：scroll 事件在无头环境/嵌套滚动容器下可能不触发 */
    if (tocTimer) { clearInterval(tocTimer); tocTimer = null; }
    tocTimer = setInterval(onScroll, 160);
    onScroll();
  }

  /* ---------------- 渲染 ---------------- */
  views.home = {
    render: function (main) {
      main.innerHTML = heroHtml() + systemsHtml() + mapHtml() + dbHtml() + aboutHtml() + tocHtml();

      /* 首页仅一个检索入口：筛选条件全部在结果页内 */
      U().on(U().$('#hero-search-form', main), 'submit', function (e) {
        e.preventDefault();
        var q = U().$('#hero-q', main).value.trim();
        CALR.router.go(CALR.router.buildUrl('/search', { q: q }));
      });

      probeSystemImages(main);
      wireToc(main);
    }
  };

  /** 探测法律体系卡片图片位；无图时保留占位样式 */
  function probeSystemImages(main) {
    if (typeof root.Image !== 'function') return;
    var hosts = main.querySelectorAll('.sys-card__ph');
    Array.prototype.forEach.call(hosts, function (host) {
      var code = (host.getAttribute('data-code') || '').toLowerCase();
      if (!code) return;
      var i = 0;
      (function probe() {
        if (i >= SYS_EXT.length) return;      /* 全部未命中 → 保留占位 */
        var url = 'assets/img/systems/' + code + '.' + SYS_EXT[i++];
        var img = new root.Image();
        img.onload = function () {
          if (!document.body.contains(host)) return;
          host.style.backgroundImage = 'url("' + url + '")';
          host.classList.add('is-loaded');
        };
        img.onerror = probe;
        img.src = url;
      })();
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
