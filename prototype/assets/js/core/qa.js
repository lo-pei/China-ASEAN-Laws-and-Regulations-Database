/* ==========================================================================
   CALR · core/qa.js —— AI 法律问答助手（RAG 检索增强 + 强制溯源 + 幻觉防护）
   注：本模块为本地规则化检索增强生成（RAG），实现检索—引用—生成链路；
       生产环境由私有化大模型 + BGE-M3 向量召回 + 重排模型实现，链路一致。

   2026-10-17 修订（A1–A5，修正确性问题）：
     A1 国别意图识别 → 检索硬过滤。修「问越南答马来」：问题里点名的国家必须
        作为检索过滤条件；该国无命中时明确说明，绝不拿别国条文充数。
     A2 预置问答必须「主题 + 国别」双重匹配，避免同一条预置答案覆盖不同问题。
     A3 不再套固定模板：从召回条文原文抽取「义务/条件/数值」句组成本条要点，
        每条要点带引用序号；主题模板降级为「背景说明（非条文结论）」。
     A4 召回口径如实：区分「候选法规（模糊命中）」与「取用条文（实际引用）」。
     A5 要点与引用一一绑定，无法对应到条文的表述不进入要点区。
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };

  var DISCLAIMER = 'AI 辅助生成，仅供参考';
  var THRESHOLD = 20;  /* 相关度阈值：低于该值判定为「暂未收录」。
                         2026-10-17 标定：正例 topScore 最低 31.5、负例最高 70，
                         但负例多为「库里没有的国家」，故配合下方法域门禁使用。 */
  var MAX_POINTS = 6;  /* 要点上限 */

  /** 国别别名（中文名/英文名由 store 的 countries 自动补齐，这里只补常见别名） */
  var COUNTRY_ALIAS = {
    CN: ['中华人民共和国', '我国', '国内', '中国大陆', 'Chinese law', 'PRC'],
    VN: ['Viet Nam', 'Vietnam', 'Vietnamese'],
    TH: ['Thailand', 'Thai'],
    ID: ['Indonesia', 'Indonesian'],
    MY: ['Malaysia', 'Malaysian'],
    SG: ['Singapore'],
    PH: ['Philippines', 'Philippine', 'Filipino'],
    BN: ['Brunei', 'Brunei Darussalam'],
    KH: ['Cambodia', 'Cambodian', 'Kampuchea'],
    LA: ['Laos', 'Lao PDR'],
    MM: ['Myanmar', 'Burma', 'Burmese'],
    TL: ['Timor-Leste', 'East Timor', 'Timor Leste']
  };

  /** 主题背景说明（原「专业解析」模板；现仅作背景，不冒充条文结论） */
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

  /* ---------------- A2：预置问答的相似度判据 ----------------
     U().tokenize 产出「单字 + 二元组」，直接用单向重合度会把
     「越南外资企业可以独资吗」与「越南外资企业的最低注册资本是多少」
     判成同一问（重合 0.55，超过原阈值 0.5）。改用**内容二元组的 Jaccard**：
       应命中：0.60 / 1.00     应拒绝：0.455     无关：0.29 / 0.10
     阈值 0.55 可把「共享前缀但问题不同」的误命中挡掉。 */
  var C_STOP = {
    '的': 1, '是': 1, '吗': 1, '呢': 1, '了': 1, '在': 1, '有': 1, '和': 1, '与': 1,
    '及': 1, '或': 1, '对': 1, '从': 1, '到': 1, '为': 1, '以': 1, '可': 1, '可以': 1,
    '需要': 1, '什么': 1, '多少': 1, '多久': 1, '如何': 1, '怎么': 1, '哪些': 1, '是否': 1,
    '要': 1, '要求': 1, '应当': 1, '应': 1, '须': 1, '时': 1, '中': 1, '等': 1
  };

  function contentBigrams(s) {
    var out = {}, ts = U().tokenize(String(s || '')), has = {};
    ts.forEach(function (x) {
      if (!x || x.length < 2 || C_STOP[x]) return;
      for (var i = 0; i < x.length; i++) if (C_STOP[x.charAt(i)]) return;
      out[x] = 1;
    });
    return out;
  }

  function simJaccard(a, b) {
    var A = contentBigrams(a), B = contentBigrams(b);
    var ka = Object.keys(A), kb = Object.keys(B);
    if (!ka.length || !kb.length) return 0;
    var inter = 0;
    ka.forEach(function (k) { if (B[k]) inter++; });
    var uni = ka.length + kb.length - inter;
    return uni ? inter / uni : 0;
  }

  /* ---------------- A1：国别意图识别 ---------------- */
  var ESC_RE = /[.*+?^${}()|[\]\\]/g;
  function wordsOfCountry(c) {
    var out = [];
    Object.keys(c.name || {}).forEach(function (k) { if (c.name[k]) out.push(c.name[k]); });
    (COUNTRY_ALIAS[c.code] || []).forEach(function (w) { out.push(w); });
    return out.filter(function (w) { return w && String(w).length >= 2; });
  }

  /**
   * 从问题中识别国别（返回国家代码数组，按出现顺序去重）。
   * 只认 ≥2 字符的名称：两字母代码（ID/VN…）在自然语言问题里极易误判，故不参与匹配。
   */
  function detectCountries(text) {
    var T = String(text || '');
    if (!T) return [];
    var hits = [];
    (S().countries() || []).forEach(function (c) {
      var ws = wordsOfCountry(c);
      var hit = ws.some(function (w) {
        if (/^[A-Za-z][A-Za-z\s\-.']*$/.test(w)) {
          return new RegExp('\\b' + w.replace(ESC_RE, '\\$&') + '\\b', 'i').test(T);
        }
        return T.indexOf(w) >= 0;
      });
      if (hit) hits.push(c.code);
    });
    return U().uniq(hits);
  }

  /* ---------------- A3：从句组要点 ---------------- */
  var P_DUTY = /(应当|必须|不得|可以|有权|禁止|不少于|不得超过|不超过|须经|须取得|shall|must|may|may not|shall not|is entitled|is required)/i;
  var P_COND = /(下列|以下|如|若|如果|情形|条件|除外|另有规定|情况下|except|where|provided that|if the)/;
  var P_NUM = /(\d[\d,.]*\s*(?:日|天|个月|月|年|%|％|元|万元|万|人|次|倍|小时|days?|months?|years?|hours?|USD|VND|CNY))/i;

  /** 按中英句末标点切句（不用 lookbehind，兼容旧浏览器） */
  function splitSentences(t) {
    var out = [], buf = '', s = String(t || '');
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      buf += ch;
      if (ch === '。' || ch === '；' || ch === ';' || ch === '.' || ch === '！' || ch === '!' || ch === '？' || ch === '?') {
        if (buf.trim()) out.push(buf.trim());
        buf = '';
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  /**
   * 从引用条文中抽取要点句。每条要点绑定引用序号 n（1 起），
   * 保证「要点 ↔ 条文」一一对应（A5）。
   */
  function extractPoints(citations, max) {
    var cand = [];
    (citations || []).forEach(function (c, ci) {
      var full = String(c.fullText || c.excerpt || '');
      var sents = splitSentences(full);
      var picked = [];
      sents.forEach(function (s) {
        if (s.length < 12) return;
        var sc = 0;
        if (P_DUTY.test(s)) sc += 3;
        if (P_NUM.test(s)) sc += 2;
        if (P_COND.test(s)) sc += 1;
        if (sc <= 0) return;
        picked.push({ text: s, score: sc, ci: ci });
      });
      picked.sort(function (a, b) { return b.score - a.score; });
      picked.slice(0, 2).forEach(function (p) { cand.push(p); });
    });
    cand.sort(function (a, b) { return b.score - a.score; });
    return cand.slice(0, max || MAX_POINTS).map(function (p) {
      var c = citations[p.ci];
      return {
        text: U().truncate(String(p.text).replace(/\s+/g, ' '), 150),
        n: p.ci + 1,
        country: c.country,
        countryName: c.countryName,
        lawId: c.lawId,
        articleId: c.articleId,
        lawTitle: c.lawTitle,
        noLabel: c.noLabel
      };
    });
  }

  /* 非法律事项特征（用于判定提问是否属于法规检索范围） */
  /* 不属于本库 12 法域（中国 + 东盟十国 + 东帝汶）的常见国家/地区。
   问题一旦点名这些法域，直接婉拒——绝不能拿库内其他国家法规顶替（会误导用户）。 */
var OUT_JURISDICTIONS = [
  ['美国', 'United States', 'USA', 'American', 'US law'],
  ['欧盟', 'European Union', 'EU ', 'GDPR'],
  ['英国', 'United Kingdom', 'UK ', 'Britain', 'British'],
  ['德国', 'Germany', 'German'], ['法国', 'France', 'French'],
  ['意大利', 'Italy'], ['西班牙', 'Spain'], ['荷兰', 'Netherlands'],
  ['瑞士', 'Switzerland'], ['瑞典', 'Sweden'], ['波兰', 'Poland'],
  ['俄罗斯', 'Russia', 'Russian'], ['乌克兰', 'Ukraine'],
  ['土耳其', 'Turkey', 'Turkish'], ['以色列', 'Israel'],
  ['印度', 'India', 'Indian'], ['巴基斯坦', 'Pakistan'],
  ['孟加拉', 'Bangladesh'], ['斯里兰卡', 'Sri Lanka'], ['尼泊尔', 'Nepal'],
  ['日本', 'Japan', 'Japanese'], ['韩国', 'South Korea', 'Korea', 'Korean'],
  ['澳大利亚', 'Australia', 'Australian'], ['新西兰', 'New Zealand'],
  ['加拿大', 'Canada', 'Canadian'], ['墨西哥', 'Mexico', 'Mexican'],
  ['巴西', 'Brazil', 'Brazilian'], ['阿根廷', 'Argentina', 'Argentine'],
  ['智利', 'Chile', 'Peru'], ['哥伦比亚', 'Colombia'], ['乌拉圭', 'Uruguay'],
  ['南非', 'South Africa'], ['埃及', 'Egypt'], ['尼日利亚', 'Nigeria'],
  ['肯尼亚', 'Kenya'], ['埃塞俄比亚', 'Ethiopia'], ['摩洛哥', 'Morocco'],
  ['阿尔及利亚', 'Algeria'], ['坦桑尼亚', 'Tanzania'],
  ['沙特', 'Saudi Arabia', 'Saudi'], ['阿联酋', 'United Arab Emirates', 'UAE', '迪拜', 'Dubai'],
  ['卡塔尔', 'Qatar'], ['科威特', 'Kuwait'], ['伊朗', 'Iran'], ['伊拉克', 'Iraq'],
  ['塞尔维亚', 'Serbia'], ['哈萨克斯坦', 'Kazakhstan'], ['蒙古', 'Mongolia'],
  ['纳米比亚', 'Namibia'], ['智利', 'Chile'],
];

/** 问题是否点名了本库未收录的法域（已识别出东盟/中国时不算） */
function outOfJurisdiction(text, knownCountries) {
  if (knownCountries && knownCountries.length) return null;
  var T = String(text || '');
  for (var i = 0; i < OUT_JURISDICTIONS.length; i++) {
    var names = OUT_JURISDICTIONS[i];
    for (var j = 0; j < names.length; j++) {
      var n = names[j];
      if (!n) continue;
      /* 英文名要求前后非字母，避免 "Indian" 命中 "India" 之类误判 */
      if (/^[A-Za-z\s]+$/.test(n)) {
        if (new RegExp('(^|[^A-Za-z])' + n.replace(/\s+/g, '\\s+') + '($|[^A-Za-z])', 'i').test(T)) return names[0];
      } else if (T.indexOf(n) >= 0) {
        return names[0];
      }
    }
  }
  return null;
}

var NON_LEGAL = [
    /天气|气温|降雨|下雨|空气质量|雾霾|限行/, /股票|股价|基金|汇率|期货|理财收益/,
    /几点|现在时间|今天是星期/, /笑话|唱歌|陪我聊天|讲个故事/, /写(一段)?(代码|程序)|编程题|算法题/,
    /菜谱|怎么做菜|哪家餐厅|外卖/, /电影|电视剧|综艺|明星|游戏攻略|旅游攻略/,
    /感冒|头疼|吃什么药|挂号|体检/,
    /* 编程 / 技术实现类：用较具体的特征词，避免误伤「诉讼程序」「复议程序」等法律用语 */
    /爬虫|正则表达式|写(一段|一个)?[^\n]{0,6}(代码|脚本)|python|javascript|typescript|\bjava\b|\bsql\b|\bhtml\b|\bcss\b|debug|\bbug\b|报错|装(个)?库|pip install|npm install/i,
    /* 生活服务 / 娱乐 / 闲聊 */
    /翻译一下|计算一下|帮我算|讲个笑话|陪我聊|你是(谁|什么)|你叫什么|你几岁/
  ];
  /* 法律事项特征：出现任一即视为法律问题，优先按法律问题处理 */
  var LEGAL_HINT = /法规|法律|条例|规定|办法|细则|条款|第\s*[0-9一二三四五六七八九十百]+\s*条|合同|合规|仲裁|诉讼|判决|赔偿|责任|义务|权利|处罚|投资|劳动|知识产权|数据/;

  function isNonLegal(q) {
    if (!q) return false;
    if (LEGAL_HINT.test(q)) return false;
    return NON_LEGAL.some(function (re) { return re.test(q); });
  }

  /** 按引用构造 citations / basis（共用） */
  function buildRefs(top, limit) {
    var citations = [], basis = [], related = [], skipped = 0;
    top.slice(0, limit || 4).forEach(function (it) {
      var law = it.law;
      /* 只用真实命中的条文。此前 `|| law.articles[0]` 会在无命中时硬引第 1 条，
         而第 1 条通常是「本法称为《XX法》」这类标题条款，与问题无关，
         等于伪造依据（基线实测 47.1% 的引用都是这么来的）。 */
      var art = it.hitArticle;
      if (!art) {
        skipped++;
        related.push({
          lawId: law.id, country: law.country,
          countryName: S().countryName(law.country),
          lawTitle: U().tr(law.title),
          reason: '标题/分类命中，未定位到具体条文'
        });
        return;
      }
      var fullText = U().plain(U().tr(art.text));
      citations.push({
        articleId: art.id,
        lawId: law.id,
        country: law.country,
        countryName: S().countryName(law.country),
        lawTitle: U().tr(law.title),
        noLabel: U().tr(art.noLabel) || ('第 ' + art.no + ' 条'),
        heading: U().tr(art.heading),
        excerpt: U().truncate(fullText, 160),
        fullText: fullText
      });
      basis.push({
        countryName: S().countryName(law.country),
        lawTitle: U().tr(law.title),
        noLabel: U().tr(art.noLabel) || ('第 ' + art.no + ' 条'),
        heading: U().tr(art.heading),
        excerpt: U().truncate(fullText, 180),
        articleId: art.id,
        lawId: law.id
      });
    });
    return { citations: citations, basis: basis, related: related, skipped: skipped };
  }

  /** 非法律问题被婉拒时，给出「您是不是想问」的相近法规问题（全部来自库内既有条目，不编造） */
  function similarQuestions(question) {
    var pool = [];
    (S().qa().curated || []).forEach(function (c) {
      var t = c.question && (c.question.zh || c.question.en);
      if (t) pool.push(t);
    });
    (S().demoQueries() || []).forEach(function (q) {
      var t = typeof q === 'string' ? q : (q.text || (q.label && (q.label.zh || q.label.en)) || '');
      if (t && pool.indexOf(t) < 0) pool.push(t);
    });
    /* 非法律问题的词与法律问题往往不同，直接算相似度区分度低；
       这里优先回退为「热门法规问题」，并按国别/主题词做一次轻量偏好排序。 */
    var kw = classify(question);
    var scored = pool.map(function (t) {
      var s = 0;
      var tp = classify(t);
      tp.forEach(function (x) { if (kw.indexOf(x) >= 0) s += 2; });
      return { t: t, s: s };
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, 4).map(function (x) { return x.t; });
  }

  /**
   * 异步版检索：先同步召回候选法规，再按需加载这些法规的条文分卷，
   * 然后用带正文的法规重新生成引用。返回与 ask() 同构的自由部分。
   *
   * 为什么需要它：库内 18,854 部法规中，默认只有 59 部的条文在内存里，
   * 其余在分卷中未加载，导致「标题命中但定位不到条文」。
   * @param question 用户问题
   * @param opts { searchQuery, packBudget }  packBudget: 最多加载多少部分卷（默认 6）
   */
  function retrieveWithPacks(question, opts) {
    opts = opts || {};
    var budget = opts.packBudget || 4;
    var searchQ = String(opts.searchQuery || '').trim() || question;
    var detected = detectCountries(question);
    var soloCountry = detected.length === 1 ? detected[0] : null;
    var countryFilter = soloCountry ? [soloCountry] : [];

    function pass(wide) {
      S().init();   /* 载入的分卷并入 store 后才能参与正文匹配 */
      /* 候选挑选需要宽召回：已有条文的法规在语义模式下得分更高，
         只取 top-12 会全是「已有条文」的法规，导致永远不需要加载分卷。 */
      var res = CALR.search.run({ q: searchQ, mode: 'semantic', size: wide ? 80 : 12, country: countryFilter });
      var top = res.items.filter(function (it) { return it.score > 0; });
      return { top: top, res: res, detected: detected, soloCountry: soloCountry };
    }

    var first = pass(true);
    /* 选「值得加载分卷」的候选：库内尚无条文的法规，按得分从前到后取 */
    var need = [];
    for (var i = 0; i < first.top.length && need.length < budget; i++) {
      var law = first.top[i].law;
      if ((law.articles || []).length) continue;
      if (CALR.fulltext && CALR.fulltext.packFor && CALR.fulltext.packFor(law.id)) need.push(law.id);
    }
    if (!need.length || !CALR.fulltext || !CALR.fulltext.ensureLaws) {
      return Promise.resolve(pass(false));
    }
    return CALR.fulltext.ensureLaws(need).then(function () { return pass(false); });
  }

  /**
   * 提问：返回结构化答案对象
   * { inScope, question, countries, country, answer:{overview, basis:[], points:[], analysis, background, risk},
   *   citations:[], disclaimer, retrieval:{count, taken, topScore, countryFilter, matchedCurated} }
   */
  function ask(question, opts) {
    opts = opts || {};
    question = String(question || '').trim();
    if (!question) {
      return { inScope: false, empty: true, question: question, disclaimer: DISCLAIMER };
    }

    /* 允许用「改写后的检索式」去检索，而用原问题做意图识别与预置问答匹配。
       BYOK 模式下由 LLM 先把自然语言问题改写成检索式，再走同一条本地检索链路。 */
    var searchQ = String(opts.searchQuery || '').trim() || question;

    /* 0) 非法律问题：婉拒 + 给出相近的法规检索式建议（不推测作答） */
    if (isNonLegal(question)) {
      return {
        inScope: false,
        offTopic: true,
        question: question,
        countries: [],
        country: null,
        answer: {
          overview: '抱歉，这个问题不在本助手的服务范围内。',
          basis: [],
          points: [],
          analysis: '本助手只回答中国与东盟国家法律法规相关的问题，例如法规名称、条文内容、适用范围、合规义务等。' +
            '您可以把问题换成下面任一种问法，我会在数据库里为您检索法条并逐条溯源。',
          background: '',
          risk: '在缺少权威法条依据时，本助手不作推测性回答，也不提供法律意见。'
        },
        citations: [],
        suggestions: similarQuestions(question),
        disclaimer: DISCLAIMER,
        retrieval: { count: 0, taken: 0, topScore: 0, countryFilter: [], matchedCurated: null }
      };
    }

    var topics = classify(question);

    /* ---------- A0：法域门禁 ---------- */
    /* 问题点名本库未收录的国家/地区时直接婉拒。
       不能拿库内其他国家法规顶替，否则用户会误以为那是该国的规定（基线实测这类问题 100% 被误答）。 */
    var outJ = outOfJurisdiction(question, detectCountries(question));
    if (outJ) {
      return {
        inScope: false,
        outOfJurisdiction: outJ,
        question: question,
        countries: [], country: null,
        answer: {
          overview: '抱歉，本库暂未收录【' + outJ + '】的法规。',
          basis: [],
          points: [],
          analysis: '本库当前覆盖 12 个法域：中国、越南、泰国、印度尼西亚、马来西亚、新加坡、' +
            '菲律宾、文莱、柬埔寨、老挝、缅甸、东帝汶。为避免误导，我不使用其他国家或地区的法规来回答关于【' + outJ + '】的问题。',
          background: '',
          risk: '在缺少该法域权威文本的情况下，本助手不作推测性回答。'
        },
        citations: [], related: [], refsSkipped: 0,
        suggestions: similarQuestions(question),
        disclaimer: DISCLAIMER,
        retrieval: { count: 0, taken: 0, topScore: 0, countryFilter: [], matchedCurated: null }
      };
    }

    /* ---------- A1：国别识别 → 单国硬过滤 ---------- */
    var detected = detectCountries(question);
    var soloCountry = detected.length === 1 ? detected[0] : null;
    var countryFilter = soloCountry ? [soloCountry] : [];

    /* ---------- 检索召回（带国别过滤） ---------- */
    var res = CALR.search.run({ q: searchQ, mode: 'semantic', size: 12, country: countryFilter });
    var top = res.items.filter(function (it) { return it.score > 0; });
    var topScore = top.length ? top[0].score : 0;
    var refs = buildRefs(top, 4);
    var citations = refs.citations;
    var basis = refs.basis;

    /* ---------- A2：预置问答「相似度 + 主题 + 国别」三重门 ---------- */
    var CURATED_MIN_SIM = 0.55;
    var curated = S().qa().curated || [];
    var bestCur = null, bestSim = 0, curOk = false;
    curated.forEach(function (c) {
      var qz = c.question ? (c.question.zh || c.question.en || '') : '';
      var s = simJaccard(question, qz);
      if (s > bestSim) { bestSim = s; bestCur = c; }
    });

    var curatedCites = [];
    if (bestCur && bestSim >= CURATED_MIN_SIM) {
      var curQ = (bestCur.question && (bestCur.question.zh || bestCur.question.en || '')) || '';
      var curTopics = classify(curQ);
      var topicOk = !topics.length || !curTopics.length ||
        curTopics.some(function (x) { return topics.indexOf(x) >= 0; });
      curatedCites = (bestCur.citationArticleIds || []).map(function (id) {
        var a = S().resolveArticle(id);
        if (!a) return null;
        var law = S().law(a.lawId);
        if (!law) return null;
        var full = U().plain(U().tr(a.text));
        return {
          articleId: a.id, lawId: law.id, country: law.country,
          countryName: S().countryName(law.country),
          lawTitle: U().tr(law.title),
          noLabel: U().tr(a.noLabel) || ('第 ' + a.no + ' 条'),
          heading: U().tr(a.heading),
          excerpt: U().truncate(full, 160),
          fullText: full
        };
      }).filter(Boolean);
      /* 引用必须落在问题所指国别内：预置问答里存在跨国误引（如马来西亚劳动题引菲律宾劳动法典），
         指定国别时直接剔除，避免把别国条文挂在答案下。 */
      if (soloCountry) {
        curatedCites = curatedCites.filter(function (c) { return c.country === soloCountry; });
      }
      curOk = !!(topicOk && curatedCites.length);
    }

    var inScope = topScore >= THRESHOLD || curOk;

    /* ---------- 该国无命中：如实说明，不用别国条文充数 ---------- */
    if (soloCountry && !top.length && !curOk) {
      var cnm = S().countryName(soloCountry);
      return {
        inScope: false,
        question: question,
        countries: detected,
        country: soloCountry,
        answer: {
          overview: '暂未收录相关法规：在「' + cnm + '」法规中未检索到与该问题直接对应的条文。',
          basis: [],
          points: [],
          analysis: '为避免把其他国家的规定误当作' + cnm + '法律，本助手不会拿其他法域的条文替代作答。建议您：' +
            '① 更换或细化关键词（例如补充具体事项、行业或法律名称）；② 在「法规检索」中把国家筛选设为' + cnm + '后查阅；' +
            '③ 若确属' + cnm + '法律问题，可通过页面底部联系方式提交收录建议。',
          background: '',
          risk: '本提示即为“幻觉防护”机制的体现：无依据不作答，且不作跨法域替代。'
        },
        citations: [],
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, taken: 0, topScore: topScore, countryFilter: countryFilter, matchedCurated: null }
      };
    }

    /* ---------- 全局未命中 ---------- */
    if (!inScope) {
      return {
        inScope: false,
        question: question,
        countries: detected,
        country: soloCountry,
        answer: {
          overview: '暂未收录相关法规：数据库中尚未检索到与您的问题直接对应的法规或条文。',
          basis: [],
          points: [],
          analysis: '为避免产生不准确结论，本助手在缺少权威法条依据时不会给出推测性回答。建议您：① 更换或细化关键词（例如补充国别、行业、事项）；② 使用“高级检索”按国别与法律层级筛选；③ 通过页面底部联系方式提交收录建议，我们会优先补充该领域的法规数据。',
          background: '',
          risk: '本提示即为“幻觉防护”机制的体现：无依据不作答。'
        },
        citations: [],
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, taken: 0, topScore: topScore, countryFilter: countryFilter, matchedCurated: null }
      };
    }

    /* ---------- 命中法规但无结构化条文全文（仅目录条目）→ 如实说明并给出条目链接 ---------- */
    if (!curOk && top.length && !citations.length) {
      return {
        inScope: true,
        noFullText: true,
        question: question,
        countries: detected,
        country: soloCountry,
        answer: {
          overview: '检索到相关法规（示例见下），但前列法规仅收录目录信息、暂无结构化条文全文，无法逐条引用原文。',
          basis: [],
          points: [],
          analysis: '为避免在缺少条文原文时给出无法核验的结论，本助手不对此类命中作推断性回答。建议前往「法规检索」查看这些法规条目的元数据，或更换关键词检索其他已收录全文的法规。',
          background: '',
          risk: '本提示即为“幻觉防护”机制的体现：无法溯源到条文原文时，不作结论性回答。'
        },
        citations: [],
        matchedLaws: top.slice(0, 6).map(function (it) {
          return {
            lawId: it.law.id,
            countryName: S().countryName(it.law.country),
            lawTitle: U().tr(it.law.title)
          };
        }),
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, taken: 0, topScore: topScore, countryFilter: countryFilter, matchedCurated: null }
      };
    }

    /* ---------- 预置问答命中（三重门通过） ---------- */
    if (curOk) {
      return {
        inScope: true,
        question: question,
        countries: detected,
        country: soloCountry,
        answer: {
          overview: U().tr(bestCur.answer),
          basis: curatedCites.map(function (c) {
            return { countryName: c.countryName, lawTitle: c.lawTitle, noLabel: c.noLabel, heading: c.heading, excerpt: c.excerpt, articleId: c.articleId, lawId: c.lawId };
          }),
          points: extractPoints(curatedCites, MAX_POINTS),
          analysis: '',
          background: '',
          risk: riskText(topics)
        },
        citations: curatedCites,
        disclaimer: DISCLAIMER,
        retrieval: { count: res.total, taken: curatedCites.length, topScore: topScore, countryFilter: countryFilter, matchedCurated: bestCur.id }
      };
    }

    /* ---------- A3/A4：从召回条文组织要点 + 口径如实 ---------- */
    var points = extractPoints(citations, MAX_POINTS);
    var countryNames = U().uniq(citations.map(function (c) { return c.countryName; }));

    /* 说明：这里不报「候选 N 部」——国别过滤后 N 几乎等于该国全部法规（排序是平的），
       报出来既不解释力也容易让用户误以为系统读过 N 部法。只报**实际取用并逐条溯源的条文数**。 */
    var overview;
    if (soloCountry) {
      overview = '已按「' + S().countryName(soloCountry) + '」法规筛选，取用重点条文 ' +
        citations.length + ' 条。以下要点均可在②中逐条溯源。';
    } else if (countryNames.length) {
      overview = '取用重点条文 ' + citations.length + ' 条，涉及' + countryNames.join('、') +
        '。以下要点均可在②中逐条溯源。';
    } else {
      overview = '数据库中未检索到与该问题直接对应的条文。';
    }

    var background = topics.length
      ? topics.map(function (t) { return ANALYSIS[t]; }).slice(0, 1).join(' ')
      : '';

    return {
      inScope: true,
      question: question,
      countries: detected,
      country: soloCountry,
      answer: {
        overview: overview,
        basis: basis,
        points: points,
        analysis: background,
        background: background,
        risk: riskText(topics)
      },
      citations: citations,
      disclaimer: DISCLAIMER,
      retrieval: {
        count: res.total,
        taken: citations.length,
        topScore: topScore,
        countryFilter: countryFilter,
        matchedCurated: null
      }
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

  /* ======================= BYOK 增强通道（默认关闭） =======================
     未配置 API Key 时，askWithLLM 直接返回本地结果，不发起任何网络请求。
     配置后：① LLM 改写检索式 → ② 本地库检索（数据不出浏览器）
             → ③ LLM 组织答案 → ④ 本地引用校验器兜底
     ====================================================================== */

  var SYS_PROMPT = [
    '你只能依据用户提供的【条文材料】回答，不得使用材料之外的任何知识，不得推测。',
    '',
    '规则：',
    '1. 每条结论句必须以引用标记结尾，格式 [n]，n 为材料编号；可并列多个，如 [1][3]。',
    '2. 若材料不足以回答问题，只输出：材料不足以回答该问题。',
    '3. 不得给出法律意见、不得补全材料中没有的内容、不得编造条文编号。',
    '4. 用与用户问题相同的语言作答，不超过 400 字。'
  ].join('\n');

  /** 用 LLM 把自然语言问题改写成更适合关键词检索的查询式；失败即退回原问题 */
  function rewriteQuery(question) {
    if (!CALR.llm || !CALR.llm.hasKey()) {
      return Promise.resolve({ ok: false, query: question, reason: 'nokey' });
    }
    var msgs = [
      {
        role: 'system',
        content: '你是法律检索查询改写器。把用户问题改写成适合关键词检索的查询式：' +
          '只输出关键词，用空格分隔，保留国别、法律名称、事项与法律术语的同义词；' +
          '不要解释、不要标点、不要引号，长度不超过 40 字。'
      },
      { role: 'user', content: question }
    ];
    return CALR.llm.complete(CALR.llm.config(), msgs, { timeout: 20000 }).then(function (r) {
      if (!r.ok) return { ok: false, query: question, error: r.error, kind: r.kind };
      var q = String(r.text || '').replace(/["'「」『』《》\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
      if (!q) return { ok: false, query: question, error: '改写结果为空' };
      return { ok: true, query: q, usage: r.usage };
    });
  }

  /**
   * BYOK 问答：本地检索 + LLM 改写/生成 + 本地引用校验
   * @param question 用户问题
   * @param opts { onDelta(chunk, accumulated) }
   * @returns Promise<{ local, rewrite, llm:{ok,text,raw,usage,model,verification,error} }>
   */
  function askWithLLM(question, opts) {
    opts = opts || {};
    if (!CALR.llm || !CALR.llm.hasKey()) {
      return Promise.resolve({ local: ask(question), llm: { ok: false, reason: 'nokey' } });
    }

    return rewriteQuery(question).then(function (rw) {
      var local = ask(question, { searchQuery: rw.ok ? rw.query : null });

      /* 本地检索没拿到可引用条文时，不调用模型（无材料必然编造） */
      if (!local.inScope || !local.citations || !local.citations.length) {
        return { local: local, rewrite: rw, llm: { ok: false, reason: 'no-materials' } };
      }

      var mats = CALR.citecheck.materials(local.citations);
      var msgs = [
        { role: 'system', content: SYS_PROMPT },
        { role: 'user', content: '【条文材料】\n' + mats + '\n\n【用户问题】\n' + question }
      ];

      return CALR.llm.stream(CALR.llm.config(), msgs, opts.onDelta).then(function (r) {
        if (!r.ok) {
          return { local: local, rewrite: rw, llm: { ok: false, error: r.error, kind: r.kind } };
        }
        var v = CALR.citecheck.verify(r.text, local.citations);
        return {
          local: local,
          rewrite: rw,
          llm: {
            ok: v.ok,
            raw: r.text,
            text: v.ok ? v.cleanText : '',
            usage: r.usage,
            model: (CALR.llm.config() || {}).model,
            verification: v,
            error: v.ok ? null : '生成内容未通过引用校验（缺少可溯源的条文引用），已降级为本地检索摘要'
          }
        };
      });
    });
  }

  /**
   * 异步问答：补充载入候选法规的条文后，再用 ask() 的同一套逻辑生成回答。
   * 与 ask() 返回同构；区别只是引用的条文更可能是真正的实体条文。
   */
  function askAsync(question, opts) {
    opts = opts || {};
    var qq = String(question || '').trim();
    if (!qq) return Promise.resolve(ask(question, opts));
    /* 非法律问题 / 未收录法域这两类不需要加载分卷，直接走同步路径 */
    if (isNonLegal(qq)) return Promise.resolve(ask(question, opts));
    if (outOfJurisdiction(qq, detectCountries(qq))) return Promise.resolve(ask(question, opts));
    if (!CALR.fulltext || !CALR.fulltext.ensureLaws) return Promise.resolve(ask(question, opts));

    var searchQ = String(opts.searchQuery || '').trim() || qq;
    return retrieveWithPacks(qq, { searchQuery: searchQ, packBudget: opts.packBudget })
      .then(function () { return ask(question, opts); })
      .catch(function () { return ask(question, opts); });
  }

  CALR.qa = {
    ask: ask,
    askAsync: askAsync,
    retrieveWithPacks: retrieveWithPacks,
    askWithLLM: askWithLLM,
    rewriteQuery: rewriteQuery,
    SYS_PROMPT: SYS_PROMPT,
    suggestions: suggestions,
    DISCLAIMER: DISCLAIMER,
    THRESHOLD: THRESHOLD,
    classify: classify,
    detectCountries: detectCountries       /* 供检索页/测试复用 */
  };
})(typeof window !== 'undefined' ? window : globalThis);
