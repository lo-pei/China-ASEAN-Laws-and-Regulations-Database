# -*- coding: utf-8 -*-
"""检查 pasal-1 的渲染结构（为何正文块未匹配）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

t = open(os.path.join(HERE, "pages", "ID-INVEST-2007.main.html"), encoding="utf-8").read()
doc = LH.fromstring(t)
for n in ("pasal-1", "pasal-5"):
    nodes = doc.xpath('//*[@id="%s"]' % n)
    print("=" * 80)
    print(n, "found", len(nodes))
    if not nodes:
        continue
    s = LH.tostring(nodes[0], encoding="unicode")
    s = re.sub(r"<svg.*?</svg>", "[svg]", s, flags=re.S)
    print(s[:2200])
