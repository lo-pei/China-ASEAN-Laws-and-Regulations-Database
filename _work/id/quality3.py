# -*- coding: utf-8 -*-
"""逐部评估官方 PDF 文本质量：是否数字文本层、条号序列是否完整"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".pdf.txt"):
        continue
    t = open(os.path.join(SRC, f), encoding="utf-8").read()
    # 条号：行首 "Pasal N"
    nos = [int(m) for m in re.findall(r"(?m)^\s*Pasal\s+(\d+)\s*$", t)]
    uniq = sorted(set(nos))
    # 正文出现顺序（去重后第一个出现顺序）
    seen, order = set(), []
    for n in nos:
        if n not in seen:
            seen.add(n)
            order.append(n)
    missing = [n for n in range(1, (max(uniq) if uniq else 0) + 1) if n not in seen]
    print("%-28s chars=%7d Pasal标记=%4d 唯一=%3d max=%4d 缺号=%2d" % (
        f, len(t), len(nos), len(uniq), max(uniq) if uniq else 0, len(missing)))
    print("      前20条顺序: %s" % order[:20])
    if missing:
        print("      缺号样本: %s" % missing[:20])
    # 末尾
    print("      TAIL: %s" % t[-160:].replace("\n", " / "))
