/* ==========================================================================
   CALR · core/qa.js —— AI 法律问答助手（RAG 检索增强 + 强制溯源 + 幻觉防护）
   注：本模块为本地规则化检索增强生成（RAG），实现检索—引用—生成链路；
       生产环境由私有化大模型 + BGE-M3 向量召回 + 重排模型实现，链路一致。
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };

  var DISCLAIMER = 'AI 辅助生成，仅供参考';
  var THRESHOLD = 3;   /* 相关度阈值：低于该值判定为“暂未收录” */

  /** 主题解析模板（“专业解析”段落） */
  var ANALYSIS = {
    investment: '外商投资准入通常由“准入负面清单 + 行业许可”双重机制构成：清单外领域实行备案管理，清单内领域须取得主管部门批准。跨境投资还须关注外资持股比例上限、最低注册资本、土地与厂房取得方式，以及利润汇出的外汇管理要求。',
    labor: '劳动用工关系以书面劳动合同为基础：试用期长度与工资下限、解除条件与经济补偿、加班与休假标准多为强制性规定，不能通过约定排除。聘用外籍员工另需办理工作许可与居留手续，并遵守当地外籍员工比例限制。',
    data: '数据合规的核心义务包括：告知同意、目的限制、最小必要、跨境传输的合法性基础、数据泄露报告以及本地化存储要求。跨境传输通常需要安全评估、标准合同条款或认证之一作为合法性依据。',
    ip: '知识产权保护采取“权利取得—权利行使—侵权救济”三段式：商标与专利需在东道国单独申请确权；权利行使应通过许可合同明确范围与地域；侵权救济包括行政查处与司法诉讼，并可申请临时禁令。',
    contract: '商事合同的成立以意思表示一致为核心，重点条款包括标的与价款、履行期限与地点、违约责任、不可抗力、争议解决与准据法。跨境交易建议明确约定仲裁机构与仲裁地，以提高裁决的跨境执行力。',
    tax: '税务合规需区分直接税与间接税：企业所得税关注常设机构认定与预提所得税税率，增值税/消费税关注注册与申报义务；同时应利用避免双重征税协定申请税收居民身份证明与优惠税率。',
    trade: '贸易合规应包括原产地规则、关税与优惠税率适用、非关税措施（技术标准、检验检疫）以及贸易救济应对。利用 RCEP 累积规则可显著降低区域内关税成本。'
  };

  function classify(text) {
    var topics = [];
    var map = {
      investment: ['投资', '外资', '准入', '负面清单', '注册资本', 'investment', 'FDI'],
      labor: ['劳动', '用工', '员工', '试用期', '解雇', '补偿', '工资', '社保', 'labour', 'labor'],
      data: ['数据', '个人信息', '隐私', '跨境传输', '本地化', 'data', 'privacy'],
      ip: ['知识产权', '专利', '商标', '著作权', '侵权', 'IP'],
      contract: ['合同', '契约', '违约', '买卖', '合伙', '不可抗力', 'contract'],
      tax: ['税', '税收', '所得税', '增值税', 'tax'],
      trade: ['贸易', '关税', '原产地', 'RCEP', '协定', 'tariff']
    };
    Object.keys(map).forEach(function (k) {
      if (map[k].some(function (w) { return text.indexOf(w) >= 0; })) topics.push(k);
    });
    return topics;
  }

  function tokensOf(s) { return U().tokenize(s); }

  function overlap(a, b) {
    var A = U().uniq(tokensOf(a)), B = U().uniq(tokensOf(b));
    if (!A.length) return 0;
    var hit = A.filter(function (x) { return B.indexOf(x) >= 0; }).length;
    return hit / A.length;
  }

  /* 非法律事项特征（用于判定提问是否属于法规检索范围） */
  var NON_LEGAL = [
    /天气|气温|降雨|下雨|空气质量|雾霾|限行/, /股票|股价|基金|汇率|期货|理财收益/,
    /几点|现在时间|今天是星期/, /笑话|唱歌|陪我聊天|讲个故事/, /写(一段)?(代码|程序)|编程题|算法题/,
    /菜谱|怎么做菜|哪家餐厅|外卖/, /电影|电视剧|综艺|明星|游戏攻略|旅游攻略/,
    /感冒|头疼|吃什么药|挂号|体检/
  ];
  /* 法律事项特征：出现任一即视为法律问题，优先按法律问题处理 */
  var LEGAL_HINT = /法规|法律|条例|规定|办法|细则|条款|第\s*[0-9一二三四五六七八九十百]+\s*条|合同|合规|仲裁|诉讼|判决|赔偿|责任|义务|权利|处罚|投资|劳动|知识产权|数据/;

  function isNonLegal(q) {
    if (!q) return false;
    if (LEGAL_HINT.test(q)) return false;
    return NON_LEGAL.some(function (re) { return re.test(q); });
  }

  /**
   * 提问：返回结构化答案对象
   * { inScope, question, answer:{overview, basis:[], analysis, risk}, citations:[], disclaimer, retrieval:{count, topScore} }
   */
  function ask(question) {
    question = String(question || '').trim();
    if (!question) {
      return { inScope: false, empty: true, question: question, disclaimer: DISCLAIMER };
    }

    /* 0) 非法律问题：直接判定为超范围，避免因语料规模扩大而误命中 */
    if (isNonLegal(question)) {
      return {
        inScope: false,
        question: question,
        answer: {
          overview: '该问题不属于法律法规检索范围。',
          basis: [],
          analysis: '本助手仅就法律法规条文及其适用提供检索与说明。' +
            '若您需要查询与气象、金融、医疗等事项相关的法规（例如《气象设施和气象探测环境保护条例》《中华人民共和国证券法》），' +
            '请改用「法规检索」并按国家、主题或法律层级筛选。',
          risk: '在缺少权威法条依据时，本助手不作推测性回答。'
        },
        citations: [],
        disclaimer: DISCLAIMER,
        retrieval: { count: 0, topScore: 0 }
      };
    }

    /* 1) 命中预置高质量问答 */
    var curated = S().qa().curated || [];
    var bestCur = null, bestScore = 0;
    curated.forEach(function (c) {
      var qz = c.question ? (c.question.zh || '') : '';
      var s = overlap(question, qz);
      if (s > bestScore) { bestScore = s; bestCur = c; }
    });

    /* 2) 检索召回 */
    var res = CALR.search.run({ q: question, mode: 'semantic', size: 6 });
    var top = res.items.filter(function (it) { return it.score > 0; });
    var topScore = top.length ? top[0].score : 0;

    var citations = [];
    var basis = [];
    top.slice(0, 4).forEach(function (it) {
      var law = it.law;
      var art = it.hitArticle || law.articles[0];
      if (!art) return;
      citations.push({
        articleId: art.id,
        lawId: law.id,
        country: law.country,
        countryName: S().countryName(law.country),
        lawTitle: U().tr(law.title),
        noLabel: U().tr(art.noLabel) || ('第 ' + art.no + ' 条'),
        heading: U().tr(art.heading),
        excerpt: U().truncate(U().plain(U().tr(art.text)), 160)
      });
      basis.push({
        countryName: S().countryName(law.country),
        lawTitle: U().tr(law.title),
        noLabel: U().tr(art.noLabel) || ('第 ' + art.no + ' 条'),
        heading: U().tr(art.heading),
        excerpt: U().truncate(U().plain(U().tr(art.text)), 180),
        articleId: art.id,
        lawId: law.id
      });
    });

    var inScope = topScore >= THRESHOLD || (bestCur && bestScore >= 0.5);
    var topics = classify(question);

    var answer = {
      overview: '',
      basis: basis,
      analysis: '',
      risk: ''
    };

    if (!inScope) {
      return {
        inScope: false,
        question: question,
        answer: {
          overview: '暂未收录相关法规：数据库中尚未检索到与您的问题直接对应的法规或条文。',
          basis: [],
          analysis: '为避免产生不准确结论，本助手在缺少权威法条依据时不会给出推测性回答。建议您：① 更换或细化关键词（例如补充国别、行业、事项）；② 使用“高级检索”按国别与法律层级筛选；③ 通过页面底部联系方式提交收录建议，我们会优先补充该领域的法规数据。',
          risk: '本提示即为“幻觉防护”机制的体现：无依据不作答。'
        },
        citations: [],
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, topScore: topScore }
      };
    }

    if (bestCur && bestScore >= 0.5) {
      var curatedCites = (bestCur.citationArticleIds || []).map(function (id) {
        var a = S().resolveArticle(id);
        if (!a) return null;
        var law = S().law(a.lawId);
        return {
          articleId: a.id, lawId: law.id, country: law.country,
          countryName: S().countryName(law.country),
          lawTitle: U().tr(law.title),
          noLabel: U().tr(a.noLabel) || ('第 ' + a.no + ' 条'),
          heading: U().tr(a.heading),
          excerpt: U().truncate(U().plain(U().tr(a.text)), 160)
        };
      }).filter(Boolean);
      return {
        inScope: true,
        question: question,
        answer: {
          overview: U().tr(bestCur.answer),
          basis: curatedCites.map(function (c) {
            return { countryName: c.countryName, lawTitle: c.lawTitle, noLabel: c.noLabel, heading: c.heading, excerpt: c.excerpt, articleId: c.articleId, lawId: c.lawId };
          }),
          analysis: topics.length ? ANALYSIS[topics[0]] : ANALYSIS.contract,
          risk: riskText(topics)
        },
        citations: curatedCites.length ? curatedCites : citations,
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, topScore: topScore, matchedCurated: bestCur.id }
      };
    }

    /* 3) 基于检索结果组合答案（模板化生成 + 强制引用） */
    var countries = U().uniq(citations.map(function (c) { return c.countryName; }));
    answer.overview = '根据数据库检索，与您的问题相关的法规条文共 ' + res.total + ' 部法规中的 ' + citations.length +
      ' 条重点条文，主要涉及' + countries.join('、') + '。以下结论均可回溯至原始法条，点击引用可查看原文。';
    answer.analysis = topics.length
      ? topics.map(function (t) { return ANALYSIS[t]; }).slice(0, 2).join(' ')
      : '该问题涉及跨境法律适用，建议结合具体交易结构与当事方所在地法律进一步分析。';
    answer.risk = riskText(topics);

    return {
      inScope: true,
      question: question,
      answer: answer,
      citations: citations,
      disclaimer: DISCLAIMER,
      retrieval: { count: res.total, topScore: topScore }
    };
  }

  function riskText(topics) {
    var base = '跨境事项存在法律与事实双重差异，本回答基于数据库已收录的法规文本生成，仅供检索参考；重大交易或诉讼事项建议取得东道国执业律师的书面意见。';
    if (topics.indexOf('data') >= 0) base += ' 涉及数据跨境的，还须完成我国数据出境安全评估或订立标准合同后再行传输。';
    if (topics.indexOf('investment') >= 0) base += ' 投资准入与优惠政策可能随东道国法律修订而变化，落地前请核验最新生效版本。';
    return base;
  }

  /** 建议问题：优先使用预置问答中的问题，其次使用数据集中的检索式 */
  function suggestions() {
    var out = (S().qa().curated || []).map(function (c) {
      if (!c.question) return '';
      return c.question.zh || c.question.en || '';
    }).filter(Boolean);
    if (out.length < 4) {
      (S().demoQueries() || []).forEach(function (q) {
        var t = typeof q === 'string' ? q : (q.text || (q.label && (q.label.zh || q.label.en)) || '');
        if (t && out.indexOf(t) < 0) out.push(t);
      });
    }
    return U().uniq(out).slice(0, 8);
  }

  CALR.qa = { ask: ask, suggestions: suggestions, DISCLAIMER: DISCLAIMER, THRESHOLD: THRESHOLD, classify: classify };
})(typeof window !== 'undefined' ? window : globalThis);
