# -*- coding: utf-8 -*-
r"""Day3：把跨语言术语桥接入 expand()

做法：除现有术语表 / SYNONYMS 两条扩展来源外，新增第三条 —— CALR_TERMS_BRIDGE。
  查询里命中桥中任一条目（中文词/英文词/当地语言词）→ 把所有语言写法加入扩展词。
  这样中文问「经济补偿金」时，会自动带上 severance pay / ค่าชดเชย / trợ cấp thôi việc 等，
  BM25 才有机会命中泰文/越南文条文。
"""
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# 1) search.js：expand() 增加术语桥来源
P = "prototype/assets/js/core/search.js"
s = io.open(P, encoding="utf-8").read()
old = """    Object.keys(SYNONYMS).forEach(function (k) {
      if (qLow.indexOf(k) >= 0) SYNONYMS[k].forEach(function (v) { if (expansions.indexOf(v) < 0) expansions.push(v); });
    });
    return U().uniq(expansions).slice(0, 24);"""
new = """    Object.keys(SYNONYMS).forEach(function (k) {
      if (qLow.indexOf(k) >= 0) SYNONYMS[k].forEach(function (v) { if (expansions.indexOf(v) < 0) expansions.push(v); });
    });
    /* 跨语言术语桥（_work/rag/build-bridge.js 生成）：中文词 ↔ 英文 ↔ 泰/越/印尼/马来 */
    var bridge = root.CALR_TERMS_BRIDGE;
    if (bridge) {
      var bkeys = null;
      Object.keys(bridge).forEach(function (k) {
        if (k.length < 2) return;
        if (qLow.indexOf(k) < 0) return;
        var e = bridge[k];
        if (!e) return;
        ['zh', 'en', 'th', 'vi', 'id', 'ms'].forEach(function (lang) {
          (e[lang] || []).forEach(function (v) {
            if (v && expansions.indexOf(v) < 0) expansions.push(String(v));
          });
        });
      });
    }
    return U().uniq(expansions).slice(0, 32);"""
if old in s:
    s = s.replace(old, new, 1)
    io.open(P, "w", encoding="utf-8").write(s)
    print("  ✓ 1) expand() 接入术语桥")
else:
    print("  ✗ 1) 锚点未命中")

# 2) index.html：引入 terms-bridge.js（在 search.js 之前）
PH = "prototype/index.html"
h = io.open(PH, encoding="utf-8").read()
if "terms-bridge.js" in h:
    print("  - 2) 已引入")
else:
    marker = '<script src="data/bm25-idf.js"></script>'
    if marker in h:
        h = h.replace(marker, marker + '\n  <script src="data/terms-bridge.js"></script>', 1)
        io.open(PH, "w", encoding="utf-8").write(h)
        print("  ✓ 2) index.html 引入 terms-bridge.js")
    else:
        print("  ✗ 2) 未找到 bm25-idf.js 标签")

# 3) 复核
chk = io.open(P, encoding="utf-8").read()
print("  复核：CALR_TERMS_BRIDGE 引用=%d；扩展上限 slice(0, 32)=%s" % (
    chk.count("CALR_TERMS_BRIDGE"), "slice(0, 32)" in chk))
