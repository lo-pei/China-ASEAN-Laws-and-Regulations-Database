# -*- coding: utf-8 -*-
"""查看单个条文在 RSC 载荷中的完整表示"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
blob = open(os.path.join(HERE, "probe", "pasal_uu25.rsc.txt"), encoding="utf-8").read()

i = blob.find('"id":"pasal-1"')
print("idx", i)
print(blob[i - 200:i + 3000])
