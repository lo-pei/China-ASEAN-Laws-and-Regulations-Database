# -*- coding: utf-8 -*-
"""提取 pasal.id 的条文目录（toc）信息，确认加载完整条文的办法"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(HERE, "probe", "pasal_uu13.html"), encoding="utf-8").read()
blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', t, re.S)
parts = []
for b in blocks:
    try:
        parts.append(json.loads(b))
    except Exception:
        parts.append(b)
blob = "".join(parts)
i = blob.find("pasalMetadata")
print(blob[max(0, i - 300):i + 900])
print("=== toc keys ===")
for kw in ["toc:props:pasals", '"pasals"', "totalPasals", "pasalCount", '"total"']:
    j = blob.find(kw)
    print("%-20s idx=%s" % (kw, j))
    if j > 0:
        print("   ", blob[max(0, j - 200):j + 400])
