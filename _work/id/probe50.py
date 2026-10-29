# -*- coding: utf-8 -*-
"""检查 pasal-194 页面内容（末条是否渲染）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(HERE, "probe", "pasal_single_p194.html")
t = open(p, encoding="utf-8").read()
print("len", len(t))
for kw in ["pasal-194", "Pasal 194", "Ketentuan Peralihan", "tidak ditemukan", "404", "Not Found"]:
    print("%-22s %d" % (kw, t.count(kw)))
i = t.find("pasal-194")
print(t[max(0, i - 400):i + 1500])
