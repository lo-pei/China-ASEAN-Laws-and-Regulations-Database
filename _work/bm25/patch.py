# -*- coding: utf-8 -*-
r"""Day2 / A1：用 BM25 + 停用词 + CJK 仅 bigram 替换自定打分

改动点：
  1) util.js 新增 tokenizeStrict —— CJK 只保留二元组（去掉单字噪声），拉丁词 ≥2 字符
  2) search.js 新增 IDF 表（语料 = 18,854 部法规的「标题+主题+文号」，首次检索时构建并缓存）
     与 bm25() 打分函数（k1=1.2, b=0.75）
  3) keyword / semantic 两种模式的分字段打分由 countHit 换成 bm25
  4) bestArticle 也用 bm25（BM25 自带长度归一化，去掉手动 sqrt 惩罚）
  5) 保留 CALR_SEARCH_LEGACY 开关：置 true 时退回旧打分，便于对比与回滚
"""
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# ============ 1) util.js: tokenizeStrict ============
PU = "prototype/assets/js/core/util.js"
u = io.open(PU, encoding="utf-8").read()
if "util.tokenizeStrict" not in u:
    anchor = "  util.plain = function (html) {"
    add = """  /** 严格分词（检索用）：CJK 只取二元组，去掉单字 —— 单字（的/条/法）噪声极大；
      拉丁词 ≥2 字符。与 tokenize 保持同一字符集范围，保证查询与正文可比。 */
  util.tokenizeStrict = function (text) {
    if (!text) return [];
    var s = String(text).toLowerCase();
    var out = [];
    var cjk = s.match(/[\\u3400-\\u9fff\\u0e00-\\u0e7f\\u1000-\\u109f\\u1780-\\u17ff\\u0e80-\\u0eff]/g);
    if (cjk) {
      for (var i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
    }
    var latin = s.replace(/[^\\w\\u00c0-\\u024f]+/g, ' ').split(' ');
    for (var j = 0; j < latin.length; j++) if (latin[j] && latin[j].length > 1) out.push(latin[j]);
    return out;
  };

""" + anchor
    u = u.replace(anchor, add, 1)
    io.open(PU, "w", encoding="utf-8").write(u)
    print("  ✓ 1) util.tokenizeStrict 已加")
else:
    print("  - 1) 已存在")

# ============ 2) search.js: IDF + bm25 + 接入 ============
PS = "prototype/assets/js/core/search.js"
s = io.open(PS, encoding="utf-8").read()

# 2a 插入 BM25 基础设施（放在 scoreLaw 之前）
anchor2 = "  function scoreLaw(law, q, tokens, expansions, mode, exact) {"
infra = r"""  /* ==================== BM25 ==================== */
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
    if (_bm.idf) return _bm;
    var laws = S().laws();
    var df = Object.create(null), total = 0;
    for (var i = 0; i < laws.length; i++) {
      var toks = U().tokenizeStrict(titleDocOf(laws[i]));
      total += toks.length;
      var seen = Object.create(null);
      for (var j = 0; j < toks.length; j++) {
        var tk = toks[j];
        if (seen[tk]) continue;
        seen[tk] = 1;
        df[tk] = (df[tk] || 0) + 1;
      }
    }
    _bm.idf = df;
    _bm.N = laws.length;
    _bm.avgLen = total / Math.max(1, laws.length);
    _bm.maxIdf = Math.log(1 + (laws.length + 0.5) / 0.5);
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

""" + anchor2
if "var _bm = {" not in s:
    s = s.replace(anchor2, infra, 1)
    print("  ✓ 2a) BM25 基础设施已插入")
else:
    print("  - 2a) 已存在")

# 2b keyword 模式：countHit → bm25
OLD_KW = """      var tHit = countHit(tokens, titleTok);
      var gHit = countHit(tokens, tagTok);
      var bHit = countHit(tokens, bodyTok);
      if (!tHit && !gHit && !bHit) return null;
      score = 3 * tHit + 2 * gHit + 1 * bHit;
      if (tHit) reasons.push('标题命中 ' + tHit + ' 个检索词');
      if (gHit) reasons.push('分类/文号命中 ' + gHit + ' 个');
      if (bHit) reasons.push('正文命中 ' + bHit + ' 个');"""
NEW_KW = """      var qT = qTermsOf(tokens);
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
      if (bHit) reasons.push('正文命中 ' + (CALR_SEARCH_LEGACY ? bHit + ' 个' : bHit.toFixed(2) + ' 分'));"""
if OLD_KW in s:
    s = s.replace(OLD_KW, NEW_KW, 1)
    print("  ✓ 2b) keyword 模式接入 BM25")
else:
    print("  ✗ 2b) keyword 锚点未命中")

# 2c 预计算严格分词（供 keyword/semantic 共用），放在 bodyText 之后
anchor3 = """    var titleTok = U().tokenize(titleAll + ' ' + titleText + ' ' + countryName);
    var tagTok = U().tokenize(tags);
    var bodyTok = U().tokenize(bodyText);"""
add3 = """    var titleTok = U().tokenize(titleAll + ' ' + titleText + ' ' + countryName);
    var tagTok = U().tokenize(tags);
    var bodyTok = U().tokenize(bodyText);
    /* BM25 用的严格分词（CJK 仅二元组） */
    var bodyTokStrict = U().tokenizeStrict(bodyText);"""
if "bodyTokStrict" not in s:
    s = s.replace(anchor3, add3, 1)
    print("  ✓ 2c) 预计算严格分词")
else:
    print("  - 2c) 已存在")

# 2d semantic 模式：换成 BM25
OLD_SEM = """    var semTitle = countHit(all, titleTok);
    var semTag = countHit(all, tagTok);"""
NEW_SEM = """    var qTermsBM = qTermsOf(all);
    var semTitle, semTag;
    if (CALR_SEARCH_LEGACY) {
      semTitle = countHit(all, titleTok); semTag = countHit(all, tagTok);
    } else {
      semTitle = bm25(qTermsBM, U().tokenizeStrict(titleAll + ' ' + titleText + ' ' + countryName), 14);
      semTag = bm25(qTermsBM, U().tokenizeStrict(tags), 8);
    }"""
if OLD_SEM in s:
    s = s.replace(OLD_SEM, NEW_SEM, 1)
    print("  ✓ 2d) semantic 标题/标签接入 BM25")
else:
    print("  ✗ 2d) 锚点未命中")

# 2e semantic 正文：bestRatio → BM25（保留长度归一效果，由 BM25 自带）
OLD_BODY = """    var semBody = bestRatio ? Math.min(30, bestRatio * 30) : 0;"""
NEW_BODY = """    var semBody;
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
    }"""
if OLD_BODY in s:
    s = s.replace(OLD_BODY, NEW_BODY, 1)
    print("  ✓ 2e) semantic 正文接入 BM25")
else:
    print("  ✗ 2e) 锚点未命中")

# 2f bestArticle 用 bm25
OLD_BA = """      var txt = U().tokenize(raw + ' ' + U().tr(a.summary));
      var s = countHit(tokens, txt);"""
NEW_BA = """      var txt = CALR_SEARCH_LEGACY ? U().tokenize(raw + ' ' + U().tr(a.summary)) : U().tokenizeStrict(raw + ' ' + U().tr(a.summary));
      var s = CALR_SEARCH_LEGACY ? countHit(tokens, txt) : bm25(qTermsOf(tokens), txt, 120);"""
if OLD_BA in s:
    s = s.replace(OLD_BA, NEW_BA, 1)
    print("  ✓ 2f) bestArticle 接入 BM25")
else:
    print("  ✗ 2f) 锚点未命中")

# 2g 长度惩罚只在 legacy 下保留
s = s.replace("""      s = s / Math.sqrt(Math.max(1, plain.length / 80));""",
              """      if (CALR_SEARCH_LEGACY) s = s / Math.sqrt(Math.max(1, plain.length / 80));""")

# 2h normTokens 改用严格分词
s = s.replace("""  function normTokens(text) {
    return U().uniq(U().tokenize(text))""",
"""  function normTokens(text) {
    var tk = (U().tokenizeStrict ? U().tokenizeStrict(text) : U().tokenize(text));
    return U().uniq(tk)""")

io.open(PS, "w", encoding="utf-8").write(s)
chk = io.open(PS, encoding="utf-8").read()
print("  复核：bmi25=%s；CALR_SEARCH_LEGACY 出现=%d 次；bodyTokStrict=%s" % (
    "function bm25(" in chk, chk.count("CALR_SEARCH_LEGACY"), "bodyTokStrict" in chk))
