# -*- coding: utf-8 -*-
"""解析 pasal.id 页面的 DOM 结构，定位条文容器"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

p = os.path.join(HERE, "probe", "pasal_uu25.html")
doc = LH.parse(p).getroot()
body = doc.find("body")

def walk(node, depth=0, maxdepth=4):
    if depth > maxdepth:
        return
    for ch in node:
        if not isinstance(ch.tag, str):
            continue
        cls = ch.get("class") or ""
        idv = ch.get("id") or ""
        txt = (ch.text_content() or "").strip().replace("\n", " ")[:70]
        print("%s<%s id=%s class='%s'> %s" % ("  " * depth, ch.tag, idv, cls[:60], txt))
        walk(ch, depth + 1, maxdepth)

walk(body, 0, 3)
