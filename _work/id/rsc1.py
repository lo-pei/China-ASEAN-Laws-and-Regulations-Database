# -*- coding: utf-8 -*-
"""解码 Next.js RSC 载荷，检查条文数据结构"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, "probe", "pasal_uu25.html")
t = open(p, encoding="utf-8").read()

blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', t, re.S)
print("blocks", len(blocks))
parts = []
for b in blocks:
    try:
        s = json.loads(b)
    except Exception:
        s = b
    parts.append(s)
blob = "".join(parts)
print("blob len", len(blob))
open(os.path.join(HERE, "probe", "pasal_uu25.rsc.txt"), "w", encoding="utf-8").write(blob)

for kw in ['"Pasal 1"', "Pasal 1", "ayat", "penjelasan", "Penjelasan", "bab", "BAB", "articles", "content"]:
    print("%-14s count=%d" % (kw, blob.count(kw)))

i = blob.find("Pasal 1")
print("---- around first Pasal 1 ----")
print(blob[max(0, i - 800):i + 1200])
