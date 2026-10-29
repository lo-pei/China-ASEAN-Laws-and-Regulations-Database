# -*- coding: utf-8 -*-
"""统计官方 PDF 主体中不同 Pasal 的数量，以及 Penjelasan 起点"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")

for fn in sorted(os.listdir(SRC)):
    if not fn.endswith(".pdf.txt"):
        continue
    t = open(os.path.join(SRC, fn), encoding="utf-8").read()
    marks = [(m.start(), m.group(1)) for m in MARK.finditer(t)]
    # Penjelasan 起点
    pen = None
    for pat in [r"(?m)^\s*PENJELASAN\s*$", r"(?m)^\s*PENJELASAN\b", r"(?m)^\s*I\.\s*UMUM\s*$"]:
        m = re.search(pat, t)
        if m:
            pen = m.start(); break
    body = t[:pen] if pen else t
    bodymarks = [l for p, l in marks if p < (pen or len(t))]
    uniq = sorted(set(bodymarks), key=lambda x: (int(re.match(r"\d+", x).group()), x))
    print("%-30s 主体标记=%4d 唯一=%4d Penjelasan@%s 首=%s 末=%s" % (
        fn, len(bodymarks), len(set(bodymarks)), pen, bodymarks[:3], bodymarks[-3:]))
