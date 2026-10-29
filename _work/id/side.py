# -*- coding: utf-8 -*-
"""并排对比指定条文：pasal.id 文本 vs 官方 PDF 文本"""
import json, os, re, sys, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
import build_final2 as B

lawid = sys.argv[1]
labels = sys.argv[2:]
d = json.load(open(os.path.join(HERE, "final2", lawid + ".json"), encoding="utf-8"))
pdfs = B.pdf_articles(lawid)
for lbl in labels:
    a = [x for x in d["articles"] if x["label"] == lbl]
    if not a:
        print("== %s Pasal %s 未在数据中" % (lawid, lbl)); continue
    a = a[0]
    print("=" * 100)
    print("%s Pasal %s  (source=%s)" % (lawid, lbl, a.get("source")))
    print("--- 录入文本 ---")
    print("\n".join(a["paragraphs"])[:1200])
    print("--- 官方 PDF 文本 ---")
    print((pdfs.get(lbl, "(未匹配)") or "")[:1200])
