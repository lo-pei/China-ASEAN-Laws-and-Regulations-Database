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
        return d !== 0 ? d : b.score - a.score;
      }
      return b.score - a.score || String(b.law.promulgatedDate || '').localeCompare(String(a.law.promulgatedDate || ''));
    });

    /* 未输入查询词时按公布日期倒序，避免空结果页 */
    if (!q && sort === 'relevance') {
      results.sort(function (a, b) { return String(b.law.promulgatedDate || '').localeCompare(String(a.law.promulgatedDate || '')); });
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
      var tHit = countHit(tokens, titleTok);
      var gHit = countHit(tokens, tagTok);
      var bHit = countHit(tokens, bodyTok);
      if (!tHit && !gHit && !bHit) return null;
      score = 3 * tHit + 2 * gHit + 1 * bHit;
      if (tHit) reasons.push('标题命中 ' + tHit + ' 个检索词');
      if (gHit) reasons.push('分类/文号命中 ' + gHit + ' 个');
      if (bHit) reasons.push('正文命中 ' + bHit + ' 个');
      matchedTerms = tokens;
      var hit = bodySearchable ? bestArticle(law, tokens) : null;
      return { law: law, score: score, reasons: reasons, snippet: hit ? snippetOf(hit.text, tokens) : lawSnippet(law), hitArticle: hit ? hit.article : null };
    }

    /* --- 自然语言语义模式（伪语义：同义扩展 + 概念覆盖） --- */
    var all = tokens.concat(expansions.map(function (x) { return String(x).toLowerCase(); }));
    var semTitle = countHit(all, titleTok);
    var semTag = countHit(all, tagTok);
    var semBody = countHit(all, bodyTok);
    var concept = U().uniq(all.filter(function (t) { return bodyTok.indexOf(t) >= 0 || titleTok.indexOf(t) >= 0; })).length;
    if (!semTitle && !semTag && !semBody && concept === 0) return null;
    score = 3 * semTitle + 2 * semTag + 1 * semBody + 0.5 * Math.min(concept, 12);
    if (concept) reasons.push('语义概念覆盖 ' + concept + ' 项');
    if (semBody) reasons.push('相关条文 ' + semBody + ' 处');
    if (expansions.length) reasons.push('跨语言扩展 ' + Math.min(expansions.length, 8) + ' 个同义表达');
    matchedTerms = all;
    var sh = bodySearchable ? bestArticle(law, all) : null;
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

  function bestArticle(law, tokens) {
    var best = null, bestScore = 0;
    law.articles.forEach(function (a) {
      var txt = U().tokenize(artHit_text(a) + ' ' + U().tr(a.summary));
      var s = countHit(tokens, txt);
      if (s > bestScore) { bestScore = s; best = a; }
    });
    return best ? { article: best, text: artHit_text(best), score: bestScore } : null;
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
    run: run,
    runTreaties: runTreaties,
    last: function () { return lastRun; },
    suggest: suggest,
    parseExact: parseExact,
    expand: expand,
    synonyms: SYNONYMS
  };
})(typeof window !== 'undefined' ? window : globalThis);
