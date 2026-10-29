# -*- coding: utf-8 -*-
"""对比 UU11/2020 官方 PDF 与 pasal.id 的条文覆盖"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
t = open(os.path.join(SRC, "ID-CIPTA-2020.pdf.txt"), encoding="utf-8").read()

print("chars", len(t))
# BAB 标题
for m in re.finditer(r"(?m)^\s*BAB\s+([IVXL]+)\s*$", t):
    print("BAB", m.group(1).strip(), "at", m.start())
# Angka / perubahan 标记
print("Angka markers:", len(re.findall(r"(?m)^\s*Angka\s+\d+", t)))
print("'diubah sehingga' :", len(re.findall(r"diubah sehingga", t)))
print("'Pasal ... dihapus':", len(re.findall(r"(?m)^\s*\d+\.\s*Pasal", t)))
# 抽取形如 "N. Pasal M" 的编号
nums = re.findall(r"(?m)^\s*(\d{1,4})\.\s*Pasal\s+([\dA-Z]+)", t)
print("编号项数", len(nums), nums[:20])
print("最大编号", max(int(n) for n, _ in nums) if nums else None)
PY = os.path.abspath(os.path.join(HERE, "probe"))
p2 = os.path.join(PY, "pasal_uu11_2020.html")
t2 = open(p2, encoding="utf-8").read()
print("pasal.id html article nodes:", len(re.findall(r'<article id="pasal-', t2)))
print("pasal.id Angka markers:", len(re.findall(r"Angka\s+\d+", t2)))
