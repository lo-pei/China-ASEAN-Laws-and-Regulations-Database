# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
L = io.open("prototype/assets/js/core/search.js", encoding="utf-8").read().split("\n")
for i, ln in enumerate(L):
    if "var bodyTok = " in ln:
        for j in range(max(0,i-2), min(len(L), i+4)):
            print("  L%-4d %s" % (j+1, L[j].rstrip()[:120]))
