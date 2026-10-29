# -*- coding: utf-8 -*-
"""检查 pasal.id 条文内部块结构（款/项/Penjelasan）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

p = os.path.join(HERE, "probe", "pasal_uu25.html")
doc = LH.parse(p).getroot()

def show(pid, depth=3):
    nodes = doc.xpath('//*[@id="%s"]' % pid)
    if not nodes:
        print("missing", pid); return
    art = nodes[0]
    print("=" * 90)
    print("ARTICLE", pid)

    def rec(node, d=0):
        if d > depth:
            return
        for ch in node:
            if not isinstance(ch.tag, str) or ch.tag in ("svg", "path", "circle", "rect"):
                continue
            cls = (ch.get("class") or "")[:55]
            own = "".join(ch.itertext()) if ch.tag in ("p", "div", "li", "h3", "h4", "span") else ""
            print("%s<%s class='%s'>" % ("  " * d, ch.tag, cls))
            if ch.tag in ("p", "h3", "h4", "li", "span") or not len(ch):
                t = re.sub(r"\s+", " ", (ch.text_content() or "")).strip()
                if t:
                    print("%s   TEXT: %s" % ("  " * d, t[:200]))
            else:
                rec(ch, d + 1)
    rec(art, 0)

show("pasal-3")
show("pasal-18", 4)
