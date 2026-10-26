/* ==========================================================================
   CALR · core/store.js —— 数据装载、索引与查询
   数据来源：prototype/data/dataset-core.js（法规元数据）＋ dataset-extra.js（术语/条约/案例/问答）
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };

  var state = {
    ready: false,
    missing: false,
    countries: [],
    laws: [],
    articles: [],
    terms: [],
    treaties: [],
    cases: [],
    revisions: [],
    topics: [],
    levels: [],
    statuses: [],
    languages: [],
    qa: { curated: [], outOfScope: '' },
    demoQueries: [],
    meta: {}
  };

  var idx = {
    countryByCode: {},
    lawById: {},
    articleById: {},
    termById: {},
    treatyById: {},
    articlesByLaw: {},
    lawsByCountry: {},
    termRefsByArticle: {}
  };

  function merge() {
    var core = root.CALR_DATA_CORE || {};
    var extra = root.CALR_DATA_EXTRA || {};
    var flat = root.CALR_DATA || {};
    return {
      meta: core.meta || flat.meta || {},
      languages: core.languages || flat.languages || [],
      topics: core.topics || flat.topics || [],
      levels: core.levels || flat.levels || [],
      statuses: core.statuses || flat.statuses || [],
      countries: core.countries || flat.countries || [],
      /* API 模式下 intl-catalog.js 不再加载，法规由 /api/laws/compact 后台补齐，
         暂存在 root.CALR_API_LAWS 里，这里合并进来，build() 会一并建索引。 */
      laws: (core.laws || flat.laws || []).concat(root.CALR_API_LAWS || []),
      terms: extra.terms || flat.terms || [],
      treaties: extra.treaties || flat.treaties || [],
      cases: extra.cases || flat.cases || [],
      revisions: extra.revisions || flat.revisions || [],
      qa: extra.qa || flat.qa || { curated: [], outOfScope: '' },
      demoQueries: extra.demoQueries || flat.demoQueries || []
    };
  }

  function build() {
    var raw = merge();
    var missing = !(raw.countries.length && raw.laws.length);

    state.meta = raw.meta || {};
    state.languages = raw.languages;
    state.topics = raw.topics;
    state.levels = raw.levels;
    state.statuses = raw.statuses;
    state.countries = raw.countries || [];
    state.treaties = raw.treaties || [];
    state.cases = raw.cases || [];
    state.revisions = raw.revisions || [];
    state.terms = raw.terms || [];
    state.qa = raw.qa || { curated: [], outOfScope: '' };
    state.demoQueries = raw.demoQueries || [];

    /* 法规规范化：若该法规已有官方全文（data/fulltext/*.js），以官方全文替换条文 */
    var fullTextMap = root.CALR_FULLTEXT || {};
    var metaOnly = root.CALR_FULLTEXT_META || {};
    var catalog = root.CALR_CN_CATALOG || null;
    var baseLaws = (raw.laws || []).slice();
    /* 允许 fulltext 文件补充「只登记元数据 + 全文」的新法规，避免多个数据文件互相改写 */
    Object.keys(metaOnly).forEach(function (id) {
      if (!baseLaws.some(function (l) { return l.id === id; })) {
        baseLaws.push(Object.assign({ id: id }, metaOnly[id]));
      }
    });
    /* 全量法规目录（如中国 1500+ 部）：仅登记元数据，条文按分卷在打开时加载 */
    var catalogIndex = {};
    if (catalog && catalog.laws) {
      catalog.laws.forEach(function (c) {
        catalogIndex[c.id] = c;
        /* 目录为权威元数据来源：若该 id 已被占位记录（分卷 META / A 层 META）先行登记，
           则回填目录字段而非跳过——否则分卷按需加载后，目录的版本字段会被 META 遮蔽
           （META 的 status 为固定的 'active'，会导致已公布未施行/已废止记录显示错误）。 */
        var existing = null;
        for (var i = 0; i < baseLaws.length; i++) {
          if (baseLaws[i].id === c.id) { existing = baseLaws[i]; break; }
        }
        if (existing) {
          if (c.status) existing.status = c.status;
          if (c.versionDate) existing.versionDate = c.versionDate;
          if (c.amendedNote) existing.amendedNote = c.amendedNote;
          if (c.effectiveDate) existing.effectiveDate = c.effectiveDate;
          if (c.category && !existing.category) existing.category = c.category;
          if (c.chars && !existing.chars) existing.chars = c.chars;
          /* 目录层的英文标题补进已登记的记录（英文界面显示「英文（中文原名）」） */
          if (c.titleEn) {
            if (typeof existing.title === 'string') existing.title = { zh: existing.title, en: c.titleEn };
            else if (existing.title && !existing.title.en) existing.title.en = c.titleEn;
          }
          return;
        }
        baseLaws.push({
          id: c.id, country: 'CN', level: c.level || 'law', status: c.status || 'active',
          topics: ['general'], title: c.titleEn ? { zh: c.title, en: c.titleEn } : { zh: c.title },
          docNumber: c.docNumber || null,
          issuingBody: c.issuingBody ? { zh: c.issuingBody } : null,
          promulgatedDate: c.date || null,
          /* 施行日期：版本记录（带 versionDate）只采用「本版施行日」，不以原法公布日充当
             ——否则 2012 版会显示「施行 1993」这类错值，且与详情页（分卷加载后为「—」）矛盾。
             非版本记录维持原有回退口径：无显式施行日时以公布日计。 */
          effectiveDate: c.effectiveDate || (c.versionDate ? null : c.date) || null,
          languages: ['zh'], coverage: 'catalog',
          source: { name: '中国法律法规汇编（项目数据资源）', url: '' },
          summary: { zh: '' }, articles: [],
          /* 同标题多版本记录的版本区分字段（详见 docs/22；无此字段的记录保持默认） */
          category: c.category || null,
          chars: c.chars || 0,
          versionDate: c.versionDate || null,
          amendedNote: c.amendedNote || null
        });
      });
    }

    /* 东盟法律目录层（来源：资源爬取）：含全文者按分卷在打开时加载 */
    var intl = root.CALR_INTL_CATALOG || null;
    if (intl && intl.laws) {
      intl.laws.forEach(function (c) {
        if (baseLaws.some(function (l) { return l.id === c.id; })) return;
        baseLaws.push({
          id: c.id,
          country: c.country,
          level: c.level || 'law',
          status: c.status || 'active',
          topics: c.topics || ['trade'],
          title: c.title || { zh: c.id },
          docNumber: c.docNumber || null,
          issuingBody: c.issuingBody || null,
          promulgatedDate: c.promulgatedDate || null,
          effectiveDate: c.effectiveDate || null,
          languages: c.textLang ? [c.textLang] : (c.harvest && c.harvest.lang ? [c.harvest.lang] : ['en']),
          coverage: c.coverage === 'full' ? 'catalog' : (c.coverage || 'catalog'),
          articleCount: c.articleCount || 0,
          source: c.source || null,
          summary: c.summary || { zh: '' },
          harvest: c.harvest || null,
          articles: []
        });
      });
    }
    var fullCount = 0, fullArticles = 0, catalogCount = 0;
    state.laws = baseLaws.map(function (law) {
      var ft = fullTextMap[law.id];
      var isFull = !!(ft && ft.articles && ft.articles.length);
      var source = isFull ? ft.articles : (law.articles || []);
      /* 以官方全文替换基础条目时，按条号继承基础数据集中的检索/比对/术语等标注字段 */
      var baseByNo = {};
      (law.articles || []).forEach(function (a) { if (a && a.no !== undefined) baseByNo[a.no] = a; });
      var arts = source.map(function (a, i) {
        var out = Object.assign({}, a, {
          lawId: law.id,
          country: law.country,
          level: law.level,
          order: (a.no && typeof a.no === 'number') ? a.no : (i + 1)
        });
        var base = (isFull && a.no !== undefined) ? baseByNo[a.no] : null;
        if (base) {
          if (!out.termIds && base.termIds) out.termIds = base.termIds;
          if (!out.compareTags && base.compareTags) out.compareTags = base.compareTags;
          if (!out.keywords && base.keywords) out.keywords = base.keywords;
          if (!out.summary && base.summary) out.summary = base.summary;
          if (!out.heading && base.heading) out.heading = base.heading;
          if (!out.chapter && base.chapter) out.chapter = base.chapter;
        }
        return out;
      });
      if (isFull) { fullCount++; fullArticles += arts.length; }
      var cat = catalogIndex[law.id] || null;
      if (cat && !isFull) catalogCount++;
      return Object.assign({}, law, {
        articles: arts,
        articleCount: arts.length || (cat ? cat.articles : (law.articleCount || 0)),
        citationCount: law.citationCount || (law.citedBy || []).length,
        coverage: isFull ? 'full' : (cat ? 'catalog' : (law.coverage || 'excerpt')),
        catalog: cat ? {
          category: cat.category, pack: cat.pack, chars: cat.chars,
          structureMode: cat.structureMode, sourceFile: cat.sourceFile
        } : null,
        fullText: isFull ? {
          language: ft.language || 'zh',
          sourceName: ft.sourceName || '',
          sourceUrl: ft.sourceUrl || '',
          fetchedAt: ft.fetchedAt || '',
          articleCount: ft.articleCount || arts.length,
          completenessNote: ft.completenessNote || '',
          structure: ft.structure || null
        } : null,
        languages: isFull ? [ft.language || 'zh'] : law.languages
      });
    });
    state.fullTextStats = { laws: fullCount, articles: fullArticles, catalogOnly: catalogCount };

    state.articles = [];
    state.laws.forEach(function (law) {
      law.articles.forEach(function (a) { state.articles.push(a); });
    });

    /* 索引 */
    idx.countryByCode = {}; idx.lawById = {}; idx.articleById = {};
    idx.termById = {}; idx.treatyById = {}; idx.articlesByLaw = {}; idx.lawsByCountry = {}; idx.termRefsByArticle = {};

    state.countries.forEach(function (c) {
      idx.countryByCode[c.code] = c;
      idx.lawsByCountry[c.code] = [];
    });
    state.laws.forEach(function (l) {
      idx.lawById[l.id] = l;
      idx.articlesByLaw[l.id] = l.articles;
      if (!idx.lawsByCountry[l.country]) idx.lawsByCountry[l.country] = [];
      idx.lawsByCountry[l.country].push(l);
    });
    state.articles.forEach(function (a) { idx.articleById[a.id] = a; });
    state.terms.forEach(function (t) {
      idx.termById[t.id] = t;
      (t.articleIds || []).forEach(function (aid) {
        (idx.termRefsByArticle[aid] = idx.termRefsByArticle[aid] || []).push(t.id);
      });
    });
    state.treaties.forEach(function (x) { idx.treatyById[x.id] = x; });

    state.ready = true;
    state.missing = missing;

    /* 主题法规数回填 */
    state.topics.forEach(function (t) {
      t.lawCount = state.laws.filter(function (l) { return (l.topics || []).indexOf(t.id) >= 0; }).length;
    });
    return state;
  }

  /* ---------------- 查询接口 ---------------- */
  var store = {
    init: function () { return build(); },
    state: function () { return state; },
    meta: function () { return state.meta; },
    countries: function () { return state.countries; },
    languages: function () { return state.languages; },
    laws: function () { return state.laws; },
    articles: function () { return state.articles; },
    terms: function () { return state.terms; },
    topics: function () { return state.topics; },
    levels: function () { return state.levels; },
    statuses: function () { return state.statuses; },
    treaties: function () { return state.treaties; },
    cases: function () { return state.cases; },
    revisions: function () { return state.revisions; },
    qa: function () { return state.qa; },
    demoQueries: function () { return state.demoQueries; },
    missing: function () { return state.missing; },

    country: function (code) { return idx.countryByCode[code] || null; },
    law: function (id) { return idx.lawById[id] || null; },
    article: function (id) { return idx.articleById[id] || null; },
    term: function (id) { return idx.termById[id] || null; },
    treaty: function (id) { return idx.treatyById[id] || null; },
    articlesOf: function (lawId) { return idx.articlesByLaw[lawId] || []; },
    lawsOf: function (code) { return idx.lawsByCountry[code] || []; },
    termIdsOfArticle: function (articleId) { return idx.termRefsByArticle[articleId] || []; },

    lawTitle: function (law) { return law ? CALR.i18n.field(law.title) : ''; },
    countryName: function (code) {
      var c = idx.countryByCode[code];
      return c ? CALR.i18n.field(c.name) : code;
    },
    levelName: function (id) {
      var lv = state.levels.filter(function (x) { return x.id === id; })[0];
      return lv ? CALR.i18n.field(lv.name) : id;
    },
    statusName: function (id) {
      var st = state.statuses.filter(function (x) { return x.id === id; })[0];
      return st ? CALR.i18n.field(st.name) : id;
    },
    statusColor: function (id) {
      var st = state.statuses.filter(function (x) { return x.id === id; })[0];
      return st ? st.color : 'var(--calr-gray-500)';
    },
    topicName: function (id) {
      var tp = state.topics.filter(function (x) { return x.id === id; })[0];
      return tp ? CALR.i18n.field(tp.name) : id;
    },

    /** 条文 id 解析：支持 "VN-INVEST-2020-A1" / "VN-INVEST-2020#1" / "1"（配合 lawId） */
    resolveArticle: function (ref, lawId) {
      if (ref === null || ref === undefined) return null;
      ref = String(ref);
      if (idx.articleById[ref]) return idx.articleById[ref];
      var m = ref.match(/^(.+?)[-#]A?(\d+)$/);
      if (m) return idx.articleById[m[1] + '-A' + m[2]] || null;
      if (lawId && /^\d+$/.test(ref)) return idx.articleById[lawId + '-A' + ref] || null;
      return null;
    },

    /** 用 /api/bootstrap 的结果初始化统计与筛选维度（API 模式首屏调用） */
    seedFromApi: function (bs) {
      if (!bs) return false;
      root.CALR_API_STATS = bs.stats || null;
      root.CALR_API_COUNTRIES = bs.countries || [];
      root.CALR_API_TOPICS = bs.topics || [];
      root.CALR_API_LEVELS = bs.levels || [];
      root.CALR_API_STATUSES = bs.statuses || [];
      root.CALR_API_LANGS = bs.languages || [];
      return true;
    },

    /** 把某一部法的完整条文写进 store（详情页 API 兜底用），并重建索引 */
    addFullArticles: function (lawId, articles) {
      if (!lawId || !articles || !articles.length) return 0;
      var arr = root.CALR_API_FULL = root.CALR_API_FULL || {};
      arr[lawId] = articles;
      /* build() 会在 fullTextMap 之后处理；这里直接把条文挂到法规对象上再重建 */
      var laws = state.laws || [];
      for (var i = 0; i < laws.length; i++) {
        if (laws[i].id === lawId) { laws[i].articles = articles; laws[i].coverage = 'full'; break; }
      }
      build();
      return articles.length;
    },

    /** 把 /api/laws/compact 的轻量法规并入 store，并重建索引 */
    addCompactLaws: function (items) {
      if (!items || !items.length) return 0;
      var arr = root.CALR_API_LAWS = root.CALR_API_LAWS || [];
      var have = {};
      /* 必须把 store 里已有的法规也登记进去：dataset-core / cn-catalog 里已经有 1,600 多部，
         只对 CALR_API_LAWS 内部去重会让这些法规重复计入，国别卡片数字会偏大
         （实测中国 1,594 而真实 1,586）。 */
      var cur = state.laws || [];
      for (var i = 0; i < cur.length; i++) if (cur[i] && cur[i].id) have[cur[i].id] = 1;
      for (var i2 = 0; i2 < arr.length; i2++) have[arr[i2].id] = 1;
      var added = 0;
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (!it || !it.id || have[it.id]) continue;
        /* 补上 build() 需要的字段（compact 接口已给大部分，这里补齐默认值） */
        it.articles = it.articles || [];
        it.languages = it.languages || [];
        it.summary = it.summary || { zh: '' };
        it.source = it.source || null;
        arr.push(it);
        have[it.id] = 1;
        added++;
      }
      if (added) build();
      return added;
    },

    /** 统计（用于首页与文档口径）
        API 模式下只加载了少量法规也能拿到真实总数 —— 直接采用 /api/bootstrap 给的统计，
        否则按 state.laws 算出来的数字会明显偏小（例如只载入 dataset-core 的几百部）。 */
    stats: function () {
      var api = root.CALR_API_STATS;
      if (api && api.laws) {
        var bc = {};
        (root.CALR_API_COUNTRIES || []).forEach(function (c) { bc[c.code] = c.count; });
        return {
          countries: (root.CALR_API_COUNTRIES || []).length || api.countries || 0,
          laws: api.laws,
          articles: api.articles,
          articlesTotal: api.articles,
          terms: api.terms || state.terms.length,
          treaties: state.treaties.length,
          cases: state.cases.length,
          revisions: state.revisions.length,
          languages: (root.CALR_API_LANGS || []).length || api.languages || 7,
          topicCount: (root.CALR_API_TOPICS || []).length || state.topics.length,
          lawsByCountry: bc,
          fullTextLaws: api.laws,
          fullTextArticles: api.articles,
          catalogLaws: 0,
          fromApi: true
        };
      }
      var byCountry = {};
      state.countries.forEach(function (c) { byCountry[c.code] = idx.lawsByCountry[c.code].length; });
      var full = state.laws.filter(function (l) { return l.coverage === 'full'; });
      var catalogOnly = state.laws.filter(function (l) { return l.coverage === 'catalog'; });
      return {
        countries: state.countries.length,
        laws: state.laws.length,
        articles: state.articles.length,
        /** 已收录条文总数（含按需加载的分卷目录条文） */
        articlesTotal: state.articles.length + catalogOnly.reduce(function (n, l) { return n + (l.articleCount || 0); }, 0),
        terms: state.terms.length,
        treaties: state.treaties.length,
        cases: state.cases.length,
        revisions: state.revisions.length,
        languages: state.languages.length || 7,
        topicCount: state.topics.length,
        lawsByCountry: byCountry,
        fullTextLaws: full.length,
        fullTextArticles: full.reduce(function (n, l) { return n + l.articles.length; }, 0),
        catalogLaws: catalogOnly.length,
        excerptLaws: state.laws.filter(function (l) { return l.coverage === 'excerpt'; }).length
      };
    },

    /** 首页“新法速递”：按公布日期倒序 */
    latestLaws: function (n, filter) {
      return state.laws
        .filter(function (l) { return filter ? filter(l) : true; })
        .slice()
        .sort(function (a, b) { return String(b.promulgatedDate || '').localeCompare(String(a.promulgatedDate || '')); })
        .slice(0, n || 6);
    },

    /** 相关法规推荐：同国同主题优先，其次相关领域 */
    related: function (law, n) {
      if (!law) return [];
      var score = function (o) {
        if (o.id === law.id) return -1;
        var s = 0;
        if (o.country === law.country) s += 3;
        (law.topics || []).forEach(function (t) { if ((o.topics || []).indexOf(t) >= 0) s += 2; });
        if ((law.relatedLawIds || []).indexOf(o.id) >= 0) s += 5;
        if ((law.citedBy || []).indexOf(o.id) >= 0) s += 4;
        return s;
      };
      return state.laws.slice().sort(function (a, b) { return score(b) - score(a); })
        .filter(function (o) { return score(o) > 0; }).slice(0, n || 5);
    },

    /** 引用该法规的其他法规 */
    citedByLaws: function (law) {
      if (!law) return [];
      return (law.citedBy || []).map(function (id) { return idx.lawById[id]; }).filter(Boolean);
    },
    revisionsOf: function (law) {
      if (!law) return [];
      return state.revisions.filter(function (r) { return r.lawId === law.id; });
    },
    /** 该法规涉及的术语 */
    termsOfLaw: function (law) {
      if (!law) return [];
      var ids = [];
      law.articles.forEach(function (a) { ids = ids.concat(a.termIds || []); });
      return U().uniq(ids).map(function (id) { return idx.termById[id]; }).filter(Boolean);
    }
  };

  CALR.store = store;
})(typeof window !== 'undefined' ? window : globalThis);
