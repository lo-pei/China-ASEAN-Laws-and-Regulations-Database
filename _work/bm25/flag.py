# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "prototype/assets/js/core/search.js"
s = io.open(p, encoding="utf-8").read()
if "var CALR_SEARCH_LEGACY" in s:
    print("  - 已声明")
else:
    anchor = "  var SYNONYMS = {"
    add = """  /* 检索打分引擎开关：置 true 退回 2026-10-18 之前的「命中计数」打分（便于对比与回滚） */
  var CALR_SEARCH_LEGACY = !!(root && root.CALR && root.CALR.SEARCH_LEGACY);

""" + anchor
    if anchor in s:
        s = s.replace(anchor, add, 1)
        io.open(p, "w", encoding="utf-8").write(s)
        print("  ✓ 已声明 CALR_SEARCH_LEGACY")
    else:
        print("  ✗ 锚点未命中")
chk = io.open(p, encoding="utf-8").read()
print("  复核：声明=%s；引用=%d 次" % ("var CALR_SEARCH_LEGACY" in chk, chk.count("CALR_SEARCH_LEGACY")))
