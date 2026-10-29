# -*- coding: utf-8 -*-
"""检测：Kemnaker 详情页是否包含法规全文；Komdigi 视图是否含全文"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")

p = os.path.join(OUT, "kn_uu13_2003.html")
t = open(p, encoding="utf-8").read()
txt = H.html_text(t)
print("Kemnaker UU13 detail: html", len(t), "text", len(txt), "Pasal1:", txt.find("Pasal 1"))
i = txt.find("Pasal 1")
if i > 0:
    print(txt[i - 300:i + 800])

p = os.path.join(OUT, "komdigi_pp71b.html")
t = open(p, encoding="utf-8").read()
txt = H.html_text(t)
print("\nKomdigi view: text", len(txt), "Pasal1:", txt.find("Pasal 1"))
i = txt.find("Pasal 1")
if i > 0:
    print(txt[i - 200:i + 600])
# 找是否提及 71 tahun 2019
print("mentions 71/2019:", "71 Tahun 2019" in txt or "71 TAHUN 2019" in txt)
