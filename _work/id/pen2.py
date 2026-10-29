# -*- coding: utf-8 -*-
"""确定各法官方 PDF 中 Penjelasan 的真实起点（用 'PENJELASAN\nATAS' 模式）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
PAT = re.compile(r"(?m)^[ \t]*PENJELASAN[ \t]*\r?\n[ \t]*ATAS\b")

for fn in sorted(os.listdir(SRC)):
    if not fn.endswith(".pdf.txt"):
        continue
    t = open(os.path.join(SRC, fn), encoding="utf-8").read()
    hits = [m.start() for m in PAT.finditer(t)]
    loose = [m.start() for m in re.finditer(r"(?m)^\s*PENJELASAN\s*$", t)]
    print("%-30s STRICT=%s  loose=%s" % (fn, hits[:3], loose[:3]))
    if hits:
        i = hits[0]
        print("      ctx: %s" % t[i - 160:i + 120].replace("\n", " | ")[:300])
