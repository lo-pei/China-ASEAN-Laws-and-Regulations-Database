# -*- coding: utf-8 -*-
"""检查已提取文本：起止、Pasal 序列、乱码比例"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, "pdf")

for f in sorted(os.listdir(PDF)):
    if not f.endswith(".txt"):
        continue
    t = open(os.path.join(PDF, f), encoding="utf-8").read()
    print("=" * 100)
    print("FILE", f, "chars", len(t), "lines", t.count("\n"))
    print("--- head ---")
    print(t[:700])
    print("--- tail ---")
    print(t[-700:])
    nos = [int(m) for m in re.findall(r"(?:^|\n)\s*Pasal\s+(\d+)\s*(?:\n|\(|$)", t)]
    print("--- Pasal markers:", len(nos), "max", max(nos) if nos else 0)
    # 唯一值序列检查（法规 PDF 中 Pasal 通常递增出现）
    seen, dup, gaps = set(), [], []
    prev = 0
    for n in nos:
        if n in seen:
            dup.append(n)
        seen.add(n)
        if n > prev + 1 and prev > 0:
            gaps.append((prev, n))
        prev = max(prev, n)
    print("     unique", len(seen), "dups", len(dup), "gaps", len(gaps))
    print("     gaps sample", gaps[:12])
    print("     dup sample", dup[:12])
    # 非 ASCII 拉丁乱码比例
    bad = sum(1 for c in t if ord(c) > 0x2100)
    print("     non-latin chars", bad, "ratio %.5f" % (bad / max(1, len(t))))
