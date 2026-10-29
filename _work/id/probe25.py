# -*- coding: utf-8 -*-
"""查看 komdigi view 页的 HTML 结构（是否内嵌全文）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

p = os.path.join(HERE, "probe", "komdigi_pp71b.html")
t = open(p, encoding="utf-8").read()
i = t.find("Navigasi Pasal")
print("idx", i)
print(t[max(0, i - 3000):i + 3000])
