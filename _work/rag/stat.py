# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
d = json.load(io.open("_work/rag/baseline.json", encoding="utf-8"))
m = d["metrics"]
print("=== 基线（全库条文）===")
print("  题目数        : %s" % m["n"])
print("  有引用        : %s (%.1f%%)" % (m["withCite"], m["withCite"]*100.0/m["n"]))
print("  至少命中金标  : %s (%.1f%%)" % (m["anyHit"], m["anyHit"]*100.0/m["n"]))
print("  P@3           : %.1f%%" % (m["P3"]*100))
print("  R@5           : %.1f%%" % (m["R5"]*100))
print("  MRR           : %.3f" % m["MRR"])
print("  国别正确率    : %s/%s (%.1f%%)" % (m["ccRight"], m["ccTotal"], m["ccRight"]*100.0/max(1,m["ccTotal"])))
print()
# 按法域统计
from collections import defaultdict
bycc = defaultdict(lambda: {"n":0,"cite":0,"hit":0,"p3":0.0})
for r in d["rows"]:
    b = bycc[r["cc"]]
    b["n"] += 1
    if r["cited"]: b["cite"] += 1
    if r.get("correct",0) > 0: b["hit"] += 1
    b["p3"] += r["P3"]
print("  按法域:")
print("  %-5s %4s %6s %6s %7s" % ("cc","题数","有引用","命中","P@3"))
for cc in sorted(bycc, key=lambda k: -bycc[k]["n"]):
    b = bycc[cc]
    print("  %-5s %4d %5d %6d %6.1f%%" % (cc, b["n"], b["cite"], b["hit"], b["p3"]*100.0/b["n"]))
