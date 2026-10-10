/* ==========================================================================
   CALR · core/compare.js —— 跨语言条款智能比对
   对齐 → 四维差异 → 相似度分档 → 制度衔接提示
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };

  var DIMENSIONS = [
    { id: 'scope', name: '适用范围', tag: 'scope', hint: '适用主体、地域范围与事项范围' },
    { id: 'definition', name: '核心概念定义', tag: 'definition', hint: '关键术语的法定含义与构成要件' },
    { id: 'liability', name: '法律后果', tag: 'liability', hint: '违反义务的行政、民事与刑事责任' },
    { id: 'procedure', name: '程序与期限', tag: 'procedure', hint: '办理流程、审批环节与时限要求' },
    { id: 'threshold', name: '门槛与标准', tag: 'threshold', hint: '资金、比例、人数等量化门槛' }
  ];

  /** 制度衔接提示规则库（按主题） */
  var CHAIN_RULES = [
    { topic: 'investment', text: '中国与相关国家均受《区域全面经济伙伴关系协定》(RCEP) 与《中国—东盟投资协议》约束：若东道国措施与协定承诺不一致，投资者可依协定主张国民待遇、最惠国待遇及公平公正待遇，并循“当地救济—国际仲裁”路径解决争议。' },
    { topic: 'labor', text: '跨境用工须同时满足东道国劳动基准与我国对外劳务合作管理规定；建议在劳动合同中约定准据法与争议解决条款，并注意东道国关于外籍员工比例、工作许可的强制性要求。' },
    { topic: 'data', text: '数据跨境流动应做“双向合规”：既满足东道国数据本地化与跨境传输要求，也要符合我国《数据安全法》《个人信息保护法》关于数据出境的安全评估、标准合同或认证要求。' },
    { topic: 'ip', text: '知识产权保护应“先确权、后出海”：利用 RCEP 知识产权章节与《中国—东盟知识产权合作谅解备忘录》框架，在东道国完成商标、专利布局后再开展市场投放与许可谈判。' },
    { topic: 'contract', text: '跨境商事合同的准据法选择应审慎：建议采用《联合国国际货物销售合同公约》(CISG) 或中立第三国法，并约定新加坡或中国香港仲裁，以降低判决承认与执行的障碍。' },
    { topic: 'tax', text: '税收安排应结合中国与东盟各国避免双重征税协定，关注常设机构认定、预提税税率与转让定价同期资料要求，必要时申请事先裁定。' }
  ];

  function diffLevel(pct) {
    if (pct < 15) return { id: 'same', name: '基本一致', cls: 'diff--same' };
    if (pct <= 45) return { id: 'minor', name: '存在差异', cls: 'diff--minor' };
    return { id: 'major', name: '显著差异', cls: 'diff--major' };
  }

  function cellText(article, dim, lang) {
    if (!article) return { text: '', covered: false };
    var tags = article.compareTags || [];
    var covered = tags.indexOf(dim.tag) >= 0;
    var base = U().tr(article.summary, lang) || U().tr(article.text, lang);
    if (!covered) return { text: '本条未直接涉及该维度；需结合该国配套法规或实施细则进一步核查。', covered: false };
    return { text: base, covered: true };
  }

  /**
   * 生成比对报告
   * @param {Array<string|{id:string}>} refs 2–3 个条文引用
   */
  function report(refs) {
    var items = [];
    (refs || []).forEach(function (r) {
      var id = typeof r === 'string' ? r : r.id;
      var a = S().resolveArticle(id);
      if (!a) return;
      var law = S().law(a.lawId);
      items.push({
        article: a,
        law: law,
        country: law ? law.country : a.country,
        countryName: S().countryName(law ? law.country : a.country),
        title: law ? U().tr(law.title) : '',
        no: a.no,
        noLabel: U().tr(a.noLabel) || ('第 ' + a.no + ' 条'),
        heading: U().tr(a.heading),
        text: U().tr(a.text),
        translations: U().altTitles(a.text, CALR.i18n.lang())
      });
    });

    if (items.length < 2) {
      return { ok: false, message: '请至少选择 2 个法域的条文后再进行比对。', items: items };
    }

    /* 维度对齐 */
    var LANG_LABEL = { zh: '中文', en: 'English', vi: 'Tiếng Việt', th: 'ไทย', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu', my: 'မြန်မာ', km: 'ខ្មែរ', lo: 'ລາວ' };
    var NA_LEVEL = { id: 'na', name: '未涉及，不适用比对', cls: '' };
    var NOT_COVERED = '本条未直接涉及该维度；需结合该国配套法规或实施细则进一步核查。';

    var dims = DIMENSIONS.map(function (dim) {
      var prepared = items.map(function (it) {
        var c = cellText(it.article, dim);
        return { text: c.text, covered: c.covered };
      });
      var coveredIdx = [];
      prepared.forEach(function (p, i) { if (p.covered) coveredIdx.push(i); });

      /* 少于两个法域的条文涉及该维度时，不给出相似度，避免“100% 一致”的误读 */
      var comparable = coveredIdx.length >= 2;
      var cells = prepared.map(function (p, i) {
        if (!p.covered) return { text: NOT_COVERED, covered: false, similarity: null, level: NA_LEVEL };
        var others = prepared.filter(function (q, j) { return q.covered && j !== i; }).map(function (q) { return q.text; });
        var sim = others.length ? Math.round(others.reduce(function (acc, o) { return acc + U().similarity(p.text, o); }, 0) / others.length) : 100;
        return { text: p.text, covered: true, similarity: sim, level: diffLevel(100 - sim) };
      });
      var sims = cells.filter(function (c) { return c.covered && c.similarity !== null; }).map(function (c) { return c.similarity; });
      var avgSim = sims.length ? Math.round(sims.reduce(function (a, b) { return a + b; }, 0) / sims.length) : null;
      return {
        id: dim.id, name: dim.name, hint: dim.hint, cells: cells,
        similarity: avgSim, comparable: comparable,
        level: comparable && avgSim !== null ? diffLevel(100 - avgSim) : NA_LEVEL
      };
    });

    /* 两两相似度矩阵 */
    var matrix = items.map(function (a) {
      return items.map(function (b) {
        if (a === b) return 100;
        return U().similarity(U().tr(a.article.summary) + U().tr(a.article.text), U().tr(b.article.summary) + U().tr(b.article.text));
      });
    });

    /* 共同主题 */
    var topicCount = {};
    items.forEach(function (it) { (it.law.topics || []).forEach(function (t) { topicCount[t] = (topicCount[t] || 0) + 1; }); });
    var shared = Object.keys(topicCount).filter(function (t) { return topicCount[t] >= 2; });

    var tips = [];
    shared.forEach(function (t) {
      CHAIN_RULES.forEach(function (r) { if (r.topic === t) tips.push({ topic: t, topicName: S().topicName(t), text: r.text }); });
    });
    if (!tips.length && items.length >= 2) {
      tips.push({
        topic: shared[0] || 'general',
        topicName: shared.length ? S().topicName(shared[0]) : '通用',
        text: '两国制度差异需要通过配套法规与司法实践进一步核实；建议在交易文件中约定准据法、争议解决方式与合规承诺条款，并留存法律意见书作为依据。'
      });
    }

    var overall = (function () {
      var sims = dims.filter(function (d) { return d.similarity !== null; }).map(function (d) { return d.similarity; });
      return sims.length ? Math.round(sims.reduce(function (a, b) { return a + b; }, 0) / sims.length) : 0;
    })();

    return {
      ok: true,
      items: items,
      dimensions: dims,
      matrix: matrix,
      overall: overall,
      overallLevel: diffLevel(100 - overall),
      comparableDims: dims.filter(function (d) { return d.similarity !== null; }).length,
      sharedTopics: shared,
      tips: tips,
      langLabel: LANG_LABEL,
      generatedAt: '2026-10-01'
    };
  }

  /** 比对候选条文（用于选择器） */
  function candidates(keyword, country, limit) {
    var out = [];
    S().laws().forEach(function (law) {
      if (country && law.country !== country) return;
      law.articles.forEach(function (a) {
        var txt = U().tr(a.heading) + U().tr(a.text) + U().tr(a.summary);
        if (keyword && txt.indexOf(keyword) < 0 && U().tr(law.title).indexOf(keyword) < 0) return;
        out.push({
          id: a.id, lawId: law.id, country: law.country,
          countryName: S().countryName(law.country),
          lawTitle: U().tr(law.title),
          noLabel: U().tr(a.noLabel) || ('第 ' + a.no + ' 条'),
          heading: U().tr(a.heading),
          preview: U().truncate(U().plain(U().tr(a.text)), 90)
        });
      });
    });
    return out.slice(0, limit || 40);
  }

  CALR.compare = { report: report, dimensions: DIMENSIONS, diffLevel: diffLevel, chainRules: CHAIN_RULES, candidates: candidates };
})(typeof window !== 'undefined' ? window : globalThis);
