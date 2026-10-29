# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
s = io.open("prototype/data/trans/cn-p01.en.js", encoding="utf-8").read()
print("=== cn-p01.en.js 开头 1200 字符 ===")
print(s[:1200])
