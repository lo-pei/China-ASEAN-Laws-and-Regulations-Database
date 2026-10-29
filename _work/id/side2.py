# -*- coding: utf-8 -*-
"""并排对比（自带 PDF 切分，不依赖 build_final2 的主流程）"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")


def pdf_articles(lawid):
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    m = re.search(r"(?m)^\s*PENJELASAN\s*$", t)
    body = t[:m.start()] if m else t
    marks = [(mm.start(), mm.group(1)) for mm in MARK.finditer(body)]
    first = {}
    for i, (s, lbl) in enumerate(marks):
        e = marks[i + 1][0] if i + 1 < len(marks) else len(body)
        first.setdefault(lbl, body[s:e])
    return first


lawid = sys.argv[1]
d = json.load(open(os.path.join(HERE, "final2", lawid + ".json"), encoding="utf-8"))
pdfs = pdf_articles(lawid)
for lbl in sys.argv[2:]:
    a = [x for x in d["articles"] if x["label"] == lbl]
    print("=" * 100)
    if not a:
        print("%s Pasal %s 不在录入数据中" % (lawid, lbl))
        continue
    a = a[0]
    print("%s Pasal %s (source=%s)" % (lawid, lbl, a.get("source")))
    print("--- 录入文本 ---")
    print("\n".join(a["paragraphs"])[:1000])
    print("--- 官方 PDF 文本 ---")
    print((pdfs.get(lbl) or "(未匹配)")[:1000])
