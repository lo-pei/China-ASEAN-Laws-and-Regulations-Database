# -*- coding: utf-8 -*-
"""检查已下载文本的 OCR 质量：行内换行、乱码率、正文连贯性"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".txt") or f.endswith(".raw.txt"):
        continue
    t = open(os.path.join(SRC, f), encoding="utf-8").read()
    lines = [l for l in t.split("\n") if l.strip()]
    avg = sum(len(l) for l in lines) / max(1, len(lines))
    short = sum(1 for l in lines if len(l) < 25) / max(1, len(lines))
    # 单词被拆断的迹象：行尾不是标点且下一行以小写字母开头
    broken = 0
    for i in range(len(lines) - 1):
        a, b = lines[i].rstrip(), lines[i + 1].lstrip()
        if a and b and a[-1] not in ".!:;?)\"'" and b[:1].islower():
            broken += 1
    print("%-24s chars=%7d lines=%5d avgline=%5.1f short%%=%4.1f broken%%=%4.1f" % (
        f, len(t), len(lines), avg, short * 100, broken / max(1, len(lines)) * 100))
    # 展示一段正文
    i = t.find("Pasal 1")
    if i > 0:
        print("    sample:", t[i:i + 220].replace("\n", " / "))
