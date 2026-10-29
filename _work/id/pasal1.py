# -*- coding: utf-8 -*-
"""检查官方 PDF 中 Pasal 1 原文（用于补齐被懒加载的首页条文）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")

for lawid in ["ID-COPYRIGHT-2014", "ID-PDP-2022", "ID-SCIENCE-2019", "ID-INVEST-2007",
              "ID-LABOR-2003", "ID-COMPANY-2007", "ID-ARBITRATION-1999", "ID-TRADE-2014"]:
    p = os.path.join(SRC, lawid + ".pdf.txt")
    t = open(p, encoding="utf-8").read()
    m = re.search(r"(?m)^\s*PENJELASAN\s*$", t)
    body = t[:m.start()] if m else t
    marks = [(mm.start(), mm.group(1)) for mm in MARK.finditer(body)]
    idx = [i for i, (pos, lbl) in enumerate(marks) if lbl == "1"]
    print("=" * 80)
    print(lawid, "Pasal1 出现次数:", len(idx), "总标记:", len(marks))
    if idx:
        i = idx[0]
        s = marks[i][0]
        e = marks[i + 1][0] if i + 1 < len(marks) else min(len(body), s + 1500)
        print(body[s:e][:1200])
