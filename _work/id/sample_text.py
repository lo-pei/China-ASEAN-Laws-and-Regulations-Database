# -*- coding: utf-8 -*-
"""对官方 PDF OCR 文本做可读性抽样评估"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))

for f in ["ID-LABOR-2003.txt", "ID-CIPTA-2020.txt", "ID-CIPTA-2023.txt", "ID-LABOR-PP-2021.txt"]:
    t = open(os.path.join(SRC, f), encoding="utf-8").read()
    print("=" * 100)
    print(f, len(t))
    i = t.find("Pasal 1")
    # 找 Pasal 1 之后正文（跳过章节目录）
    j = t.find("Pasal 1", i + 10)
    k = t.find("Pasal 2", j + 10)
    print("--- Pasal 1 区域 ---")
    print(t[j:k + 800][:1400])
    print("--- 末段 600 ---")
    print(t[-600:])
