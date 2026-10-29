# -*- coding: utf-8 -*-
"""查看单条页 pasal-1 的实际 DOM 内容"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

for f in ["ID-INVEST-2007.pasal-1.html", "ID-ARBITRATION-1999.pasal-1.html"]:
    p = os.path.join(HERE, "pages", f)
    t = open(p, encoding="utf-8").read()
    doc = LH.fromstring(t)
    nodes = doc.xpath('//*[@id="pasal-1"]')
    print("=" * 90)
    print(f, "nodes", len(nodes))
    if nodes:
        s = LH.tostring(nodes[0], encoding="unicode")
        s = re.sub(r"<svg.*?</svg>", "[svg]", s, flags=re.S)
        print(s[:3000])
