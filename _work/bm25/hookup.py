# -*- coding: utf-8 -*-
r"""把预生成的 IDF 表接入检索
   1) search.js 的 buildBm25() 优先使用 root.CALR_BM25_IDF（预计算，覆盖全库 353,217 文档，
      含泰/越/印尼等各语种条文，不再偏向中文标题）
   2) index.html 在 core/search.js 之前引入 data/bm25-idf.js
"""
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# ---------- 1) search.js：优先用预生成 IDF ----------
P = "prototype/assets/js/core/search.js"
s = io.open(P, encoding="utf-8").read()
anchor = "  function buildBm25() {"
add = """  function buildBm25() {
    if (_bm.idf) return _bm;
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

"""
if "CALR_BM25_IDF" not in s:
    s = s.replace(anchor, add, 1)
    # 原函数体首行去重
    s = s.replace("""  function buildBm25() {
    if (_bm.idf) return _bm;
    /* 优先使用构建期预生成的 IDF 表""",
"""  function buildBm25() {
    /* 优先使用构建期预生成的 IDF 表""", 1)
    io.open(P, "w", encoding="utf-8").write(s)
    print("  ✓ 1) search.js 优先使用预生成 IDF")
else:
    print("  - 1) 已接入")

# ---------- 2) index.html：引入 bm25-idf.js ----------
PH = "prototype/index.html"
h = io.open(PH, encoding="utf-8").read()
if "bm25-idf.js" in h:
    print("  - 2) index.html 已引入")
else:
    marker = '<script src="assets/js/core/search.js"></script>'
    if marker in h:
        h = h.replace(marker, '<script src="data/bm25-idf.js"></script>\n  ' + marker, 1)
        io.open(PH, "w", encoding="utf-8").write(h)
        print("  ✓ 2) index.html 已引入 data/bm25-idf.js")
    else:
        print("  ✗ 2) 未找到 search.js 的 script 标签")
