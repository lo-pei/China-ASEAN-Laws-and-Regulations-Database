# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
L = io.open("prototype/assets/js/core/search.js", encoding="utf-8").read().split("\n")
print("=== search.js 结构（%d 行）===" % len(L))
for i, ln in enumerate(L):
    if re.match(r"^\s*(function\s+\w+|var\s+[A-Z_]{2,}\s*=|\w+\s*:\s*function|search\.\w+\s*=)", ln):
        print("  L%-4d %s" % (i+1, ln.strip()[:110]))
