# -*- coding: utf-8 -*-
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
for f in ["ID-INVEST-2007.pasal-1.html", "ID-INVEST-2007.pasal-8.html",
          "ID-INVEST-2007.pasal-37.html", "ID-ARBITRATION-1999.pasal-1.html"]:
    p = os.path.join(HERE, "pages", f)
    if not os.path.exists(p):
        print(f, "MISSING"); continue
    t = open(p, encoding="utf-8").read()
    arts = re.findall(r'<article id="pasal-([^"]+)"', t)
    pre = len(re.findall(r"whitespace-pre-wrap", t))
    print("%-40s len=%7d articles=%s prewrap=%d notfound=%s" % (f, len(t), arts, pre, "tidak ditemukan" in t))
