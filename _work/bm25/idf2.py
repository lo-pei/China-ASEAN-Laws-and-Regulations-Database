# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "prototype/assets/js/core/search.js"
s = io.open(p, encoding="utf-8").read()
old = """  function buildBm25() {
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
  }"""
new = """  function buildBm25() {
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
  }"""
if old in s:
    s = s.replace(old, new, 1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ IDF 改为「标题 + 条文正文抽样」")
else:
    print("  ! 锚点未命中")
chk = io.open(p, encoding="utf-8").read()
print("  复核：抽样逻辑=%s" % ("每部法规取最多 12 条" in chk))
