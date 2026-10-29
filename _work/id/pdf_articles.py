# -*- coding: utf-8 -*-
"""抽取官方 PDF 中的 PASAL 正文，用于补齐/交叉校验"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

PASAL_RE = re.compile(r"(?m)^\s*Pasal\s+(\d+[A-Z]?)\s*$")

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".pdf.txt"):
        continue
    t = open(os.path.join(SRC, f), encoding="utf-8").read()
    marks = [(m.start(), m.group(1)) for m in PASAL_RE.finditer(t)]
    if not marks:
        print("%-28s 无 Pasal 行标记" % f); continue
    print("=" * 90)
    print(f, "标记数", len(marks))
    for lbl in ("1", "2", "8"):
        hit = [i for i, l in marks if l == lbl]
        if not hit:
            print("   Pasal %s 未找到（行首标记）" % lbl); continue
        i = hit[0]
        j = marks[[k for k, (p, l) in enumerate(marks) if p == i][0] + 1][0] if True else len(t)
        print("--- Pasal %s ---" % lbl)
        print(t[i:min(j, i + 700)].replace("\n", " / ")[:700])
