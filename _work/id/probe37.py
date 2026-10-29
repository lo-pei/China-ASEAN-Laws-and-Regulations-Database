# -*- coding: utf-8 -*-
"""检查 komdigi UU36/1999 页面中全文所在区块（判断是否为 HTML 全文）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

p = os.path.join(HERE, "probe", "komdigi_uu36_1999.html")
t = open(p, encoding="utf-8").read()
txt = H.html_text(t)
i = txt.find("Pasal 1 ")
if i < 0:
    i = txt.find("Pasal 1\n")
print("idx", i)
print(txt[i:i + 2500])
print("\n=== HTML 附近 ===")
j = t.find("Pasal 1")
print(t[max(0, j - 1500):j + 1500])
