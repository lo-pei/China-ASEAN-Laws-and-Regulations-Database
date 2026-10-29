# -*- coding: utf-8 -*-
"""检查 pasal.id 中 <article id="pasal-N"> 是否含完整条文文本"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

p = os.path.join(HERE, "probe", "pasal_uu25.html")
doc = LH.parse(p).getroot()
arts = doc.xpath('//article[starts-with(@id,"pasal-")]')
print("article nodes:", len(arts))
for a in arts[:3]:
    print("=" * 80)
    print("ID", a.get("id"), "pdfpage", a.get("data-pdf-page"))
    print(LH.tostring(a, encoding="unicode")[:2500])
print("=== 是否有 bab 容器 ===")
for b in doc.xpath('//*[starts-with(@id,"bab-")]')[:3]:
    print(b.tag, b.get("id"), (b.text_content() or "").strip()[:80])
