# -*- coding: utf-8 -*-
"""解析 pasal.id 单条条文的结构（标题、款、项、章）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH
import json

p = os.path.join(HERE, "probe", "pasal_uu25.html")
doc = LH.parse(p).getroot()

for pid in ("pasal-1", "pasal-3", "pasal-18"):
    art = doc.get_element_by_id(pid, None) if hasattr(doc, "get_element_by_id") else None
    art = art or (doc.xpath('//*[@id="%s"]' % pid) or [None])[0]
    if art is None:
        print("missing", pid); continue
    print("=" * 90)
    print("ARTICLE", pid)
    # 直接子元素概览
    for ch in art:
        if not isinstance(ch.tag, str):
            continue
        cls = (ch.get("class") or "")[:60]
        txt = (ch.text_content() or "").strip()
        txt = re.sub(r"\s+", " ", txt)
        print("  <%s class='%s'> len=%d :: %s" % (ch.tag, cls, len(txt), txt[:200]))
