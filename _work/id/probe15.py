# -*- coding: utf-8 -*-
"""检查 BKPM 搜索页与文档页，寻找国家法律(UU)全文 HTML/PDF"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
p = os.path.join(OUT, "bkpm_search_uu25.html")
t = open(p, encoding="utf-8").read()
print("== bkpm_search len", len(t))
docs = sorted(set(re.findall(r'href="(/id/document/[^"]+)"', t)))
print("doc links", len(docs))
for d in docs[:40]:
    print("   ", d[:150])
# 是否有 UU 相关
for m in re.findall(r'[Uu]ndang[- ]?[Uu]ndang[^<]{0,120}', t)[:10]:
    print("UU:", m[:150])
# 分页/搜索参数
for m in sorted(set(re.findall(r'href="(/id/search[^"]*)"', t)))[:20]:
    print("search:", m[:150])
