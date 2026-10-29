# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "prototype/assets/js/core/search.js"
s = io.open(p, encoding="utf-8").read()
old = """    /* 跨语言术语桥（_work/rag/build-bridge.js 生成）：中文词 ↔ 英文 ↔ 泰/越/印尼/马来 */
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
new = """    /* 跨语言术语桥（_work/rag/build-bridge.js 生成）：中文词 ↔ 英文 ↔ 泰/越/印尼/马来
       必须做两跳：中文「经济补偿」只直连英文 severance pay，泰国语要经英文再查一次才能拿到
       ค่าชดเชย，否则泰文/越南文永远进不了扩展词。 */
    var bridge = root.CALR_TERMS_BRIDGE;
    if (bridge) {
      var LANGS = ['zh', 'en', 'th', 'vi', 'id', 'ms'];
      function collectHits(text) {
        var out = [];
        Object.keys(bridge).forEach(function (k) {
          if (k.length < 2) return;
          if (String(text).toLowerCase().indexOf(k) < 0) return;
          var e = bridge[k];
          if (!e) return;
          LANGS.forEach(function (lang) {
            (e[lang] || []).forEach(function (v) { if (v) out.push(String(v)); });
          });
        });
        return out;
      }
      /* 第 1 跳：直接用查询词 */
      var hop1 = collectHits(qLow);
      hop1.forEach(function (v) { if (expansions.indexOf(v) < 0) expansions.push(v); });
      /* 第 2 跳：用第 1 跳得到的英文/中文本词再查一次，才能连到当地语言 */
      var seen2 = Object.create(null);
      hop1.slice(0, 16).forEach(function (v) {
        var got = collectHits(String(v).toLowerCase());
        got.forEach(function (w) {
          if (seen2[w]) return;
          seen2[w] = 1;
          if (expansions.indexOf(w) < 0) expansions.push(w);
        });
      });
    }
    return U().uniq(expansions).slice(0, 40);"""
if old in s:
    s = s.replace(old, new, 1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ expand() 改为两跳扩展（上限 40）")
else:
    print("  ✗ 锚点未命中")
