# -*- coding: utf-8 -*-
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
files = ["ID-LABOR-2003.pasal-1.html", "ID-COMPANY-2007.pasal-10.html",
         "ID-TRADE-2014.pasal-84.html", "ID-PDP-2022.pasal-60.html",
         "ID-LABOR-PP-2021.pasal-31.html"]
for f in files:
    p = os.path.join(HERE, "pages", f)
    if not os.path.exists(p):
        print(f, "MISSING")
        continue
    t = open(p, encoding="utf-8").read()
    has404 = ("tidak ditemukan" in t)
    pre = len(re.findall(r"whitespace-pre-wrap", t))
    arts = re.findall(r'<article id="pasal-([^"]+)"', t)
    print("%-38s len=%7d 404=%s prewrap=%d articles=%s" % (f, len(t), has404, pre, arts))
