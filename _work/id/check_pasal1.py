# -*- coding: utf-8 -*-
"""检查 COPYRIGHT/PDP 主页面中 pasal-1 的结构"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

for lawid in ["ID-COPYRIGHT-2014", "ID-PDP-2022"]:
    t = open(os.path.join(HERE, "pages", lawid + ".main.html"), encoding="utf-8").read()
    doc = LH.fromstring(t)
    nodes = doc.xpath('//*[@id="pasal-1"]')
    print("=" * 80)
    print(lawid, "pasal-1 nodes:", len(nodes))
    if nodes:
        s = LH.tostring(nodes[0], encoding="unicode")
        s = re.sub(r"<svg.*?</svg>", "[svg]", s, flags=re.S)
        print(s[:1800])
    print("prewrap divs:", len(re.findall(r"whitespace-pre-wrap", t)))
