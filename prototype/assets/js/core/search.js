/* ==========================================================================
   CALR · core/search.js —— 多语种检索引擎（关键词 / 法条编号精确 / 自然语言语义）
   相关度公式见 docs/00-项目基线.md 第 7 节
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };

  /* 主题同义扩展（用于“伪语义”召回；生产环境由 BGE-M3 向量召回替代） */
  /* 检索打分引擎开关：置 true 退回 2026-10-18 之前的「命中计数」打分（便于对比与回滚） */
  var CALR_SEARCH_LEGACY = !!(root && root.CALR && root.CALR.SEARCH_LEGACY);

  var SYNONYMS = {
    '外资': ['外商投资', '外商', 'foreign investment', 'đầu tư nước ngoài', 'penanaman modal asing'],
    '外商投资': ['外资', 'foreign investment', 'FDI'],
    '准入': ['市场准入', 'market access', '准入负面清单'],
    '负面清单': ['negative list', '投资准入', '禁止和限制清单'],
    '注册资本': ['最低注册资本', 'minimum capital', 'charter capital', 'vốn điều lệ'],
    '劳动': ['劳动合同', '用工', 'labour', 'labor', 'lao động', 'ketenagakerjaan'],
    '劳动合同': ['劳动关系', 'labour contract', 'employment contract', 'hợp đồng lao động'],
    '解除': ['解除劳动合同', '终止', 'termination', 'chấm dứt hợp đồng lao động'],
    '补偿': ['经济补偿', '赔偿金', 'severance', 'compensation', 'trợ cấp thôi việc'],
    '知识产权': ['专利', '商标', '著作权', 'intellectual property', 'IP', 'sở hữu trí tuệ'],
    '数据': ['个人数据', '数据合规', 'data', 'personal data', 'dữ liệu cá nhân'],
    '数据本地化': ['本地存储', 'data localization', 'localisation'],
    '个人信息': ['个人数据', 'personal information', 'personal data', 'thông tin cá nhân'],
    '仲裁': ['仲裁协议', 'arbitration', 'trọng tài'],
    '争端解决': ['争议解决', 'dispute resolution', 'ISDS', 'giải quyết tranh chấp'],
    '公司': ['企业', '公司法', 'company', 'enterprise', 'công ty', 'perusahaan'],
    '合同': ['契约', 'contract', 'hợp đồng', 'kontrak', 'perjanjian'],
    '不可抗力': ['force majeure', 'bất khả kháng'],
    '税收': ['税务', '企业所得税', 'tax', 'thuế', 'pajak']
  };

  var STOP = ['的', '了', '是', '在', '和', '与', '及', '或', '对', '我', '有', '请问', '什么', '如何', '怎么', '哪些', '要求', '规定', '法律', '法规', 'the', 'a', 'an', 'of', 'to', 'is', 'are', 'what', 'how'];

  var lastRun = null;

  function normTokens(text) {
    return U().tokenize(text).filter(function (t) { return STOP.indexOf(t) < 0; });
  }

  /** 跨语言扩展：命中术语表 / 同义词表后，补充其他语种写法 */
  function expand(query) {
    var expansions = [];
    var terms = S().terms();
    var qLow = String(query || '').toLowerCase();
    terms.forEach(function (t) {
      var hit = false;
      var bucket = [t.zh, t.en].concat(Object.keys(t.translations || {}).map(function (k) { return t.translations[k]; }));
      bucket.forEach(function (v) {
        if (!v) return;
        v = String(v).toLowerCase();
        if (v.length >= 2 && (qLow.indexOf(v) >= 0 || v.indexOf(qLow) >= 0 && qLow.length >= 2)) hit = true;
      });
      if (hit) {
        bucket.forEach(function (v) { if (v && expansions.indexOf(v) < 0) expansions.push(v); });
        expansions.push(t.zh);
      }
    });
    Object.keys(SYNONYMS).forEach(function (k) {
      if (qLow.indexOf(k) >= 0) SYNONYMS[k].forEach(function (v) { if (expansions.indexOf(v) < 0) expansions.push(v); });
    });
    return U().uniq(expansions).slice(0, 24);
  }

  /** 精确编号解析：第N条 / Article N / Điều N / Section N / 文号 */
  function parseExact(q) {
    var out = { articleNo: null, docNumber: null, raw: q };
    var s = String(q || '').trim();
    var m = s.match(/第\s*([0-9一二三四五六七八九十百]+)\s*条/);
    if (m) out.articleNo = cn2num(m[1]);
    if (out.articleNo === null) {
      m = s.match(/(?:article|art\.?|điều|dieu|section|sec\.?|pasal|มาตรา|มาตรา)\s*([0-9]+)/i);
      if (m) out.articleNo = parseInt(m[1], 10);
    }
    m = s.match(/([0-9]{1,4}\s*\/\s*[0-9]{4}\s*\/\s*[A-Za-zĐđ\-]+)/);
    if (m) out.docNumber = m[1].replace(/\s+/g, '');
    if (out.docNumber === null) {
      m = s.match(/\b(\d{4}\s*年第\s*\d+\s*号)/);
      if (m) out.docNumber = m[1].replace(/\s+/g, '');
    }
    if (out.docNumber === null) {
      m = s.match(/\b(No\.?\s*\d+\s*(?:of\s*\d{4})?)/i);
      if (m) out.docNumber = m[1];
    }
    return out;
  }

  function cn2num(s) {
    if (/^[0-9]+$/.test(s)) return parseInt(s, 10);
    var map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
    var m = s.match(/^十([一二三四五六七八九])?$/);
    if (m) return 10 + (m[1] ? map[m[1]] : 0);
    m = s.match(/^([一二三四五六七八九])十([一二三四五六七八九])?$/);
    if (m) return map[m[1]] * 10 + (m[2] ? map[m[2]] : 0);
    if (map[s]) return map[s];
    return null;
  }

  /* ---------------- 排序辅助 ---------------- */
  /* 国家优先序：检索页「默认优先展示中国法律」。
     返回 0 表示优先（中国），1 表示其他法域。只作为**同分时的次级排序键**，
     不影响相关度打分本身，也不改变显式选择的「日期 / 状态」排序语义。 */
  var PRIORITY_COUNTRY = 'CN';
  function countryRank(law) {
    return (law && law.country === PRIORITY_COUNTRY) ? 0 : 1;
  }

  /* ---------------- 主检索 ---------------- */
  function run(params) {
    params = params || {};
    var q = (params.q || '').trim();
    var mode = params.mode || 'keyword';
    var page = parseInt(params.page || 1, 10);
    var size = parseInt(params.size || 20, 10);

    var filters = {
      country: toArr(params.country),
      level: toArr(params.level),
      status: toArr(params.status),
      topic: toArr(params.topic),
      issuer: toArr(params.issuer),
      lang: toArr(params.lang),
      from: params.from || '',
      to: params.to || '',
      effFrom: params.effFrom || '',
      effTo: params.effTo || ''
    };

    var laws = S().laws();
    var tokens = normTokens(q);
    var expansions = q ? expand(q) : [];
    var exact = mode === 'exact' ? parseExact(q) : { articleNo: null, docNumber: null };
    var results = [];

    laws.forEach(function (law) {
      if (!passFilter(law, filters)) return;
      var r = scoreLaw(law, q, tokens, expansions, mode, exact);
      if (r) results.push(r);
    });

    /* 排序 */
    var sort = params.sort || (mode === 'exact' ? 'relevance' : 'relevance');
    results.sort(function (a, b) {
      if (sort === 'date') return String(b.law.promulgatedDate || '').localeCompare(String(a.law.promulgatedDate || ''));
      if (sort === 'status') {
        var order = { active: 0, amended: 1, pending: 2, repealed: 3 };
        var d = (order[a.law.status] || 9) - (order[b.law.status] || 9);
        return d !== 0 ? d : b.score - a.score || countryRank(a.law) - countryRank(b.law);
      }
      /* 相关度（默认排序）：同分时**中国法律优先**，再按公布日期倒序 */
      return b.score - a.score ||
        countryRank(a.law) - countryRank(b.law) ||
        String(b.law.promulgatedDate || '').localeCompare(String(a.law.promulgatedDate || ''));
    });

    /* 未输入查询词时：所有结果同分（score=1），此时**中国法律优先**，其次按公布日期倒序。
       这样检索页首次打开即优先呈现中国法律，而不是被最新发布的东盟各国法规占满首屏。 */
    if (!q && sort === 'relevance') {
      results.sort(function (a, b) {
        return countryRank(a.law) - countryRank(b.law) ||
          String(b.law.promulgatedDate || '').localeCompare(String(a.law.promulgatedDate || ''));
      });
    }

    var total = results.length;
    var start = (page - 1) * size;
    lastRun = {
      q: q, mode: mode, filters: filters, total: total,
      items: results.slice(start, start + size),
      facets: facets(results),
      terms: U().uniq(tokens.concat(expansions)).filter(function (t) { return t.length >= 2; }).slice(0, 12)
    };
    return lastRun;
  }

  function toArr(v) {
    if (v === undefined || v === null || v === '') return [];
    return Array.isArray(v) ? v : String(v).split(/[,|]/).filter(Boolean);
  }

  function passFilter(law, f) {
    if (f.country.length && f.country.indexOf(law.country) < 0) return false;
    if (f.level.length && f.level.indexOf(law.level) < 0) return false;
    if (f.status.length && f.status.indexOf(law.status) < 0) return false;
    if (f.topic.length && !f.topic.some(function (t) { return (law.topics || []).indexOf(t) >= 0; })) return false;
    if (f.issuer.length && f.issuer.indexOf(U().tr(law.issuingBody)) < 0) return false;
    if (f.lang.length) {
      var langs = (law.languages || []).concat(law.fullText && law.fullText.language ? [law.fullText.language] : []);
      if (!f.lang.some(function (x) { return langs.indexOf(x) >= 0; })) return false;
    }
    var d = law.promulgatedDate || '';
    if (f.from && d && d < f.from) return false;
    if (f.to && d && d > f.to) return false;
    var e = law.effectiveDate || '';
    if (f.effFrom && e && e < f.effFrom) return false;
    if (f.effTo && e && e > f.effTo) return false;
    return true;
  }

  /* ---------------- 条约检索 ---------------- */
  function runTreaties(params) {
    params = params || {};
    var q = (params.q || '').trim();
    var tokens = normTokens(q);
    var fTopic = toArr(params.topic);
    var fStatus = toArr(params.status);
    var items = S().treaties().filter(function (x) {
      if (fStatus.length && fStatus.indexOf(x.status) < 0) return false;
      if (fTopic.length && !fTopic.some(function (t) { return (x.topics || []).indexOf(t) >= 0; })) return false;
      return true;
    }).map(function (x) {
      var text = [U().tr(x.name), (x.parties || []).join(' '), U().tr(x.summary), x.id].join(' ');
      var tok = U().tokenize(text);
      var score = tokens.length ? countHit(tokens, tok) : 1;
      return { item: x, score: score, snippet: snippetOf(U().tr(x.summary), tokens, 160) };
    }).filter(function (x) { return !q || x.score > 0; });

    items.sort(function (a, b) {
      return b.score - a.score || String(b.item.effectiveDate || '').localeCompare(String(a.item.effectiveDate || ''));
    });
    return finalizeRun(items, params, tokens);
  }

  function finalizeRun(items, params, tokens) {
    var page = parseInt(params.page || 1, 10);
    var size = parseInt(params.size || 20, 10);
    var total = items.length;
    var start = (page - 1) * size;
    return {
      q: (params.q || '').trim(), total: total,
      items: items.slice(start, start + size),
      terms: U().uniq(tokens).filter(function (x) { return x.length >= 2; }).slice(0, 12)
    };
  }

  /* ==================== BM25 ==================== */
  /* 语料 = 全部法规的「标题 + 主题 + 文号」，首次检索时构建并缓存。
     为什么不直接用条文正文建 IDF：334,681 条 × 分词，构建要几十秒且占数百 MB，
     在 file:// 静态页里不可接受；法规元数据的 df 已足以区分「法/规定」与「补偿/遣散费」这类词。 */
  var _bm = { idf: null, N: 0, avgLen: 120, memo: Object.create(null) };
  var BM25_K1 = 1.2, BM25_B = 0.75;

  function titleDocOf(law) {
    var t = '';
    if (law.title && typeof law.title === 'object') {
      Object.keys(law.title).forEach(function (k) { if (law.title[k]) t += ' ' + law.title[k]; });
    } else if (law.title) { t += ' ' + law.title; }
    if (law.shortTitle) t += ' ' + U().tr(law.shortTitle);
    t += ' ' + (law.topics || []).map(function (x) { return S().topicName(x); }).join(' ');
    t += ' ' + (law.docNumber || '');
    return t;
  }

  function buildBm25() {
    /* 优先使用构建期预生成的 IDF 表（覆盖全库 353,217 个文档，含各语种条文）。
       浏览器端按需加载分卷，运行时永远拿不到完整 df，所以必须预计算。 */
    var pre = root.CALR_BM25_IDF;
    if (pre && pre.df) {
      _bm.idf = pre.df;
      _bm.N = pre.N;
      _bm.avgLen = pre.avgLen || 180;
      _bm.maxIdf = Math.log(1 + (pre.N + 0.5) / 0.5);
      _bm.source = 'precomputed';
      return _bm;
    }


    if (_bm.idf) return _bm;
    var laws = S().laws();
    var df = Object.create(null), total = 0, docs = 0;
    /* 只建在标题上会严重偏向中文/英文标题（泰、越法规标题多为中文），
       导致泰文/越南文词在 IDF 表里缺失并被当成"最稀有词"加权，反而压掉正确条文。
       改为「标题 + 条文正文抽样」：每部法规取最多 12 条，法规间按步长抽样，控制耗时。 */
    var step = Math.max(1, Math.floor(laws.length / 4000));
    for (var i = 0; i < laws.length; i += step) {
      var law = laws[i];
      var docs2 = [titleDocOf(law)];
      var arts = law.articles || [];
      for (var a = 0; a < arts.length && a < 12; a++) {
        docs2.push(U().tr(arts[a].text));
      }
      for (var d = 0; d < docs2.length; d++) {
        var toks = U().tokenizeStrict(docs2[d]);
        if (!toks.length) continue;
        total += toks.length; docs++;
        var seen = Object.create(null);
        for (var j = 0; j < toks.length; j++) {
          var tk = toks[j];
          if (seen[tk]) continue;
          seen[tk] = 1;
          df[tk] = (df[tk] || 0) + 1;
        }
      }
    }
    _bm.idf = df;
    _bm.N = Math.max(1, docs);
    _bm.avgLen = total / Math.max(1, docs);
    _bm.maxIdf = Math.log(1 + (docs + 0.5) / 0.5);
    return _bm;
  }

  function idfOf(term) {
    if (!_bm.idf) buildBm25();
    if (_bm.memo[term] !== undefined) return _bm.memo[term];
    var d = _bm.idf[term] || 0;
    var v = d > 0
      ? Math.log(1 + (_bm.N - d + 0.5) / (d + 0.5))
      : _bm.maxIdf;                     /* 未见于元数据：按最稀有处理（更可能是专业词） */
    _bm.memo[term] = v;
    return v;
  }

  /** BM25 打分：qTerms 为查询词，toks 为目标文档分词，avgLen 为该字段的典型长度 */
  function bm25(qTerms, toks, avgLen) {
    if (!qTerms.length || !toks.length) return 0;
    var tf = Object.create(null), n = toks.length;
    for (var i = 0; i < n; i++) tf[toks[i]] = (tf[toks[i]] || 0) + 1;
    var s = 0, seen = Object.create(null);
    for (var k = 0; k < qTerms.length; k++) {
      var t = qTerms[k];
      if (!t || seen[t]) continue;
      seen[t] = 1;
      var f = tf[t];
      if (!f) continue;
      var denom = f + BM25_K1 * (1 - BM25_B + BM25_B * n / Math.max(1, avgLen || 120));
      s += idfOf(t) * (f * (BM25_K1 + 1)) / denom;
    }
    return s;
  }

  /** 查询词：严格分词 + 去停用词，长度≥2 */
  function qTermsOf(list) {
    var out = [], seen = Object.create(null);
    for (var i = 0; i < list.length; i++) {
      var t = list[i];
      if (!t || t.length < 2) continue;
      if (STOP.indexOf(t) >= 0) continue;
      if (seen[t]) continue;
      seen[t] = 1; out.push(t);
    }
    return out;
  }

  function scoreLaw(law, q, tokens, expansions, mode, exact) {
    var titleText = [law.title, law.shortTitle].map(function (x) { return U().tr(x); }).join(' ');
    var titleAll = '';
    if (law.title && typeof law.title === 'object') {
      Object.keys(law.title).forEach(function (k) { titleAll += ' ' + law.title[k]; });
    }
    var countryName = S().countryName(law.country);
    var tags = (law.topics || []).map(function (t) { return S().topicName(t); }).join(' ') + ' ' + S().levelName(law.level) + ' ' + law.docNumber;
    /* 有条文文本的法规（官方全文或平台整理稿）参与正文匹配 */
    var bodySearchable = (law.coverage === 'full' || law.coverage === 'excerpt') && law.articles.length > 0;
    var bodyText = bodySearchable ? law.articles.map(function (a) {
      return [U().tr(a.text), U().tr(a.heading), U().tr(a.summary)].join(' ');
    }).join(' ') : '';

    var titleTok = U().tokenize(titleAll + ' ' + titleText + ' ' + countryName);
    var tagTok = U().tokenize(tags);
    var bodyTok = U().tokenize(bodyText);
    /* BM25 用的严格分词（CJK 仅二元组，去掉单字噪声） */
    var bodyTokStrict = U().tokenizeStrict(bodyText);

    var reasons = [];
    var score = 0;
    var matchedTerms = [];

    /* --- 编号精确模式 --- */
    if (mode === 'exact') {
      var docHit = exact.docNumber && law.docNumber && String(law.docNumber).replace(/\s+/g, '').indexOf(exact.docNumber.replace(/\s+/g, '')) >= 0;
      var artHit = null;
      if (bodySearchable && exact.articleNo !== null) {
        law.articles.forEach(function (a) { if (a.no === exact.articleNo) artHit = a; });
      }
      if (!docHit && !artHit && q && titleAll.toLowerCase().indexOf(q.toLowerCase()) < 0) return null;
      score = docHit ? 120 : (artHit ? 100 : 40);
      if (docHit) reasons.push('文号精确匹配：' + law.docNumber);
      if (artHit) {
        reasons.push('条文定位：第 ' + artHit.no + ' 条');
        matchedTerms = normTokens(q);
      }
      if (!docHit && !artHit) reasons.push('标题包含检索串');
      return { law: law, score: score, reasons: reasons, snippet: artHit ? snippetOf(artHit_text(artHit), matchedTerms) : lawSnippet(law), hitArticle: artHit || null };
    }

    /* --- 关键词模式 --- */
    if (mode === 'keyword') {
      if (!q) return { law: law, score: 1, reasons: [], snippet: lawSnippet(law), hitArticle: null };
      var qT = qTermsOf(tokens);
      var tHit, gHit, bHit;
      if (CALR_SEARCH_LEGACY) {
        tHit = countHit(tokens, titleTok); gHit = countHit(tokens, tagTok); bHit = countHit(tokens, bodyTok);
      } else {
        tHit = bm25(qT, U().tokenizeStrict(titleAll + ' ' + titleText + ' ' + countryName), 14);
        gHit = bm25(qT, U().tokenizeStrict(tags), 8);
        bHit = bm25(qT, bodyTokStrict, 120);
      }
      if (!tHit && !gHit && !bHit) return null;
      score = CALR_SEARCH_LEGACY ? (3 * tHit + 2 * gHit + 1 * bHit) : (3 * tHit + 2 * gHit + 1 * bHit);
      if (tHit) reasons.push('标题命中 ' + (CALR_SEARCH_LEGACY ? tHit + ' 个检索词' : tHit.toFixed(2) + ' 分'));
      if (gHit) reasons.push('分类/文号命中 ' + (CALR_SEARCH_LEGACY ? gHit + ' 个' : gHit.toFixed(2) + ' 分'));
      if (bHit) reasons.push('正文命中 ' + (CALR_SEARCH_LEGACY ? bHit + ' 个' : bHit.toFixed(2) + ' 分'));
      matchedTerms = tokens;
      var hit = bodySearchable ? bestArticle(law, tokens) : null;
      return { law: law, score: score, reasons: reasons, snippet: hit ? snippetOf(hit.text, tokens) : lawSnippet(law), hitArticle: hit ? hit.article : null };
    }

    /* --- 自然语言语义模式（伪语义：同义扩展 + 概念覆盖） --- */
    var all = tokens.concat(expansions.map(function (x) { return String(x).toLowerCase(); }));
    var qTermsBM = qTermsOf(all);
    var semTitle, semTag;
    if (CALR_SEARCH_LEGACY) {
      semTitle = countHit(all, titleTok); semTag = countHit(all, tagTok);
    } else {
      semTitle = bm25(qTermsBM, U().tokenizeStrict(titleAll + ' ' + titleText + ' ' + countryName), 14);
      semTag = bm25(qTermsBM, U().tokenizeStrict(tags), 8);
    }

    /* 正文相关度必须做「单条条文 × 长度归一化」：
       原写法 `countHit(all, bodyTok)` 统计的是「整部法规命中多少个查询词」，
       长法规几乎必然全命中 —— 加载分卷后无关长法（个人信息保护法、外国人经营法等）
       会反超真正相关的法规。改为取「单条条文覆盖查询词的比例」的最大值。 */
    var qTerms = U().uniq(all.filter(function (t) { return t && t.length >= 2; }));
    var bestRatio = 0, bestArtByRatio = null;
    if (bodySearchable && qTerms.length) {
      law.articles.forEach(function (a) {
        var toks = U().tokenize(artHit_text(a));
        if (!toks.length) return;
        var hitN = 0;
        for (var qi = 0; qi < qTerms.length; qi++) {
          if (toks.indexOf(qTerms[qi]) >= 0) hitN++;
        }
        if (!hitN) return;
        /* 覆盖率 ÷ 条文长度惩罚（相对 120 字基准），兼顾「覆盖多」与「够聚焦」 */
        var ratio = (hitN / qTerms.length) / Math.sqrt(Math.max(1, toks.length / 60));
        if (ratio > bestRatio) { bestRatio = ratio; bestArtByRatio = a; }
      });
    }
    var semBody;
    if (CALR_SEARCH_LEGACY) {
      semBody = bestRatio ? Math.min(30, bestRatio * 30) : 0;
    } else {
      /* BM25 over 每条条文，取最佳一条；天然带长度归一化 */
      var bestBm = 0, bestBmArt = null;
      if (bodySearchable && qTermsBM.length) {
        law.articles.forEach(function (a) {
          var bodyOnly2 = U().plain(U().tr(a.text));
          if (TITLE_CLAUSE.test(bodyOnly2) && bodyOnly2.length < 160) return;
          var sc2 = bm25(qTermsBM, U().tokenizeStrict(artHit_text(a)), 120);
          if (sc2 > bestBm) { bestBm = sc2; bestBmArt = a; }
        });
      }
      semBody = Math.min(30, bestBm);
      if (bestBmArt) bestArtByRatio = bestBmArt;
    }
    var concept = U().uniq(all.filter(function (t) { return bodyTok.indexOf(t) >= 0 || titleTok.indexOf(t) >= 0; })).length;
    if (!semTitle && !semTag && !semBody && concept === 0) return null;
    /* 标题命中权重最高（法规名直接对应问题），正文覆盖率次之 */
    score = 3 * semTitle + 2 * semTag + semBody + 0.5 * Math.min(concept, 12);
    if (concept) reasons.push('语义概念覆盖 ' + concept + ' 项');
    if (bestRatio) reasons.push('条文覆盖 ' + Math.round(bestRatio * 100) + '%');
    if (expansions.length) reasons.push('跨语言扩展 ' + Math.min(expansions.length, 8) + ' 个同义表达');
    matchedTerms = all;
    var sh = bodySearchable ? (bestArticle(law, all) || (bestArtByRatio ? { article: bestArtByRatio, text: artHit_text(bestArtByRatio), score: semBody } : null)) : null;
    return { law: law, score: score, reasons: reasons, snippet: sh ? snippetOf(sh.text, tokens) : lawSnippet(law), hitArticle: sh ? sh.article : null };
  }

  /** 条目摘要：有条文文本的法规使用条文摘要 */
  function lawSnippet(law) {
    return law.articles.length ? snippetOf(U().tr(law.summary), []) : '';
  }

  function artHit_text(a) { return [U().tr(a.heading), U().tr(a.text)].join(' '); }

  function countHit(tokens, target) {
    var n = 0;
    tokens.forEach(function (t) { if (t && target.indexOf(t) >= 0) n++; });
    return n;
  }

  /* 「标题条款」特征：第 1 条常为「本法称为《XX法》…」「本条例自…施行」之类，
     与具体问题无关。命中它会让引用退化成无信息量的「第 1 条」
     （2026-10-17 基线实测：41% 的引用都是这种）。 */
  var TITLE_CLAUSE = /^\s*(本法|本条例|本规定|本办法|本细则|本决定)\s*(称为|所称|的制定|自[^，。]{0,30}施行)|^\s*(This|These)\s+(Act|Law|Order|Regulation|Rules?)\s+(may be cited|is cited|comes? into|shall come)/i;

  function bestArticle(law, tokens) {
    var best = null, bestScore = 0;
    law.articles.forEach(function (a) {
      var raw = artHit_text(a);
      var txt = CALR_SEARCH_LEGACY ? U().tokenize(raw + ' ' + U().tr(a.summary)) : U().tokenizeStrict(raw + ' ' + U().tr(a.summary));
      var s = CALR_SEARCH_LEGACY ? countHit(tokens, txt) : bm25(qTermsOf(tokens), txt, 120);
      if (!s) return;
      var plain = U().plain(raw);
      /* 纯标题条款直接排除：引「本法称为《XX法》」作为问题依据毫无信息量。
         注意与「本法规定…」「本法旨在…」区分——后者是真实的适用范围/立法目的条款，应予保留。
         必须对「正文」判断而非 artHit_text（后者是 heading+text 拼接，^ 锚点会失效）。 */
      var bodyOnly = U().plain(U().tr(a.text));
      if (TITLE_CLAUSE.test(bodyOnly) && bodyOnly.length < 160) return;
      /* 长度归一化：同等命中数下优选更聚焦的条文，避免长条文靠篇幅取胜 */
      if (CALR_SEARCH_LEGACY) s = s / Math.sqrt(Math.max(1, plain.length / 80));
      if (s > bestScore) { bestScore = s; best = a; }
    });
    return best ? { article: best, text: artHit_text(best), score: bestScore } : null;
  }

  /** 返回命中度最高的前 n 条条文（供问答生成多条引用；bestArticle 只返回 1 条） */
  function bestArticles(law, tokens, n) {
    var list = [];
    (law.articles || []).forEach(function (a) {
      var raw = artHit_text(a);
      var txt = U().tokenize(raw + ' ' + U().tr(a.summary));
      var sc = countHit(tokens, txt);
      if (!sc) return;
      var plain = U().plain(raw);
      /* 纯标题条款不参与引用（同 bestArticle 的判定） */
      if (TITLE_CLAUSE.test(U().plain(U().tr(a.text))) && U().plain(U().tr(a.text)).length < 160) return;
      sc = sc / Math.sqrt(Math.max(1, plain.length / 80));
      list.push({ article: a, text: raw, score: sc });
    });
    list.sort(function (x, y) { return y.score - x.score; });
    return list.slice(0, n || 3);
  }

  function snippetOf(text, terms, len) {
    text = U().plain(text || '');
    len = len || 150;
    if (!terms || !terms.length) return U().highlight(U().truncate(text, len), []);
    var low = text.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length; i++) {
      var p = low.indexOf(String(terms[i]).toLowerCase());
      if (p >= 0 && (pos < 0 || p < pos)) pos = p;
    }
    var start = pos > 40 ? pos - 30 : 0;
    var cut = text.slice(start, start + len);
    return (start > 0 ? '…' : '') + U().highlight(cut, terms) + (start + len < text.length ? '…' : '');
  }

  function facets(results) {
    var f = { country: {}, level: {}, status: {}, topic: {} };
    results.forEach(function (r) {
      f.country[r.law.country] = (f.country[r.law.country] || 0) + 1;
      f.level[r.law.level] = (f.level[r.law.level] || 0) + 1;
      f.status[r.law.status] = (f.status[r.law.status] || 0) + 1;
      (r.law.topics || []).forEach(function (t) { f.topic[t] = (f.topic[t] || 0) + 1; });
    });
    return f;
  }

  /* ---------------- 联想建议 ---------------- */
  function suggest(q, n) {
    q = String(q || '').trim();
    if (!q) return [];
    var out = [];
    S().laws().forEach(function (l) {
      var t = U().tr(l.title);
      if (t.toLowerCase().indexOf(q.toLowerCase()) >= 0) out.push({ type: 'law', text: t, id: l.id });
    });
    S().terms().forEach(function (tm) {
      if (tm.zh.indexOf(q) >= 0 || (tm.en || '').toLowerCase().indexOf(q.toLowerCase()) >= 0) {
        out.push({ type: 'term', text: tm.zh + ' · ' + tm.en, id: tm.id });
      }
    });
    return out.slice(0, n || 8);
  }

  CALR.search = {
    bestArticles: bestArticles,
    run: run,
    runTreaties: runTreaties,
    last: function () { return lastRun; },
    suggest: suggest,
    parseExact: parseExact,
    expand: expand,
    synonyms: SYNONYMS
  };
})(typeof window !== 'undefined' ? window : globalThis);
