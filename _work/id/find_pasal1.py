# -*- coding: utf-8 -*-
"""在官方 PDF 文本里查找 Pasal 1 文本块"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

for lawid in ["ID-COPYRIGHT-2014", "ID-PDP-2022"]:
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    print("=" * 90)
    print(lawid, "len", len(t))
    i = t.find("Dalam Undang-Undang ini yang dimaksud")
    if i < 0:
        i = t.find("dimaksud dengan")
    print("idx", i)
    print(t[max(0, i - 600):i + 1500])
