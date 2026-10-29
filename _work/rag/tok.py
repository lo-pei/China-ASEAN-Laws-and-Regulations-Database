# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
s = io.open("prototype/assets/js/core/util.js", encoding="utf-8").read()
m = re.search(r"function tokenize\([\s\S]{0,1600}?\n  \}", s)
print("=== tokenize ===")
print(m.group(0) if m else "未找到")
print()
m2 = re.search(r"function plain\([\s\S]{0,400}?\n  \}", s)
print("=== plain ===")
print(m2.group(0)[:400] if m2 else "未找到")
