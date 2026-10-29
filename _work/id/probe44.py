# -*- coding: utf-8 -*-
"""检查 pasal.id 页面是否标注官方来源链接"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, "probe", "pasal_uu25.html")
t = open(p, encoding="utf-8").read()
for kw in ["peraturan.go.id", "jdih", "sumber", "Sumber", "resmi", "Lembaran", "BN ", "TLN", "dpr.go.id"]:
    for m in re.finditer(re.escape(kw), t):
        s = max(0, m.start() - 120)
        print("[%s] ...%s..." % (kw, t[s:m.start() + 160].replace("\n", " ")[:290]))
        break
print("--- 所有外链 ---")
links = sorted(set(re.findall(r'href="(https?://[^"]+)"', t)))
for l in links:
    if not re.search(r"(pasal\.id|google|facebook|twitter|instagram|linkedin|youtube|cdn|fonts|schema\.org|w3\.org)", l):
        print("   ", l[:150])
