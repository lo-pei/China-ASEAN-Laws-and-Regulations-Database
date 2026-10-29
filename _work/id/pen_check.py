# -*- coding: utf-8 -*-
"""定位官方 PDF 中 Penjelasan 起点，并检查主体是否包含 TOC 中的全部条号"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
FINAL = os.path.join(HERE, "final2")
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")
PEN_PATS = [r"(?m)^\s*PENJELASAN\s*$", r"(?m)^\s*PENJELASAN\b", r"(?m)^\s*I\.\s*UMUM\s*$",
            r"(?m)^\s*PENJELASAN ATAS\b", r"(?m)^\s*UMUM\s*$"]

for lawid in ["ID-TRADE-2014", "ID-ETRANSACTION-2019", "ID-SCIENCE-2019"]:
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    print("=" * 90)
    print(lawid, "len", len(t))
    for pat in PEN_PATS:
        m = re.search(pat, t)
        if m:
            print("   %-28s @%d  ctx=%s" % (pat, m.start(), t[m.start():m.start() + 80].replace("\n", " | ")))
    d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
    have = {a["label"] for a in d["articles"]}
    order = set(d["order"])
    missing = sorted(order - have, key=lambda x: (int(re.match(r"\d+", x).group()), x))
    print("   TOC 缺失:", missing)
    # 在全文（含 Penjelasan）中查这些条号
    allmarks = {}
    for m in MARK.finditer(t):
        allmarks.setdefault(m.group(1), []).append(m.start())
    for lbl in missing:
        print("      Pasal %-5s 全文出现位置: %s" % (lbl, allmarks.get(lbl)))
