# -*- coding: utf-8 -*-
"""检查 RSC 载荷中 toc 数据的准确结构"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(HERE, "pages", "ID-INVEST-2007.main.html"), encoding="utf-8").read()
blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', t, re.S)
parts = []
for b in blocks:
    try:
        parts.append(json.loads(b))
    except Exception:
        parts.append(b)
blob = "".join(parts)
i = blob.find('"bab\\":[') if '"bab\\":[' in blob else blob.find('"bab":[')
print("idx", i)
print(blob[max(0, i - 600):i + 1200])
print("...")
j = blob.find('"pasals":[')
print(blob[j:j + 900])
