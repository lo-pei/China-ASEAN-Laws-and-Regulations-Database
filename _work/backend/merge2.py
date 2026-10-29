# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
L = io.open("prototype/assets/js/core/store.js", encoding="utf-8").read().split("\n")
for j in range(108, min(len(L), 175)):
    print("  L%-4d %s" % (j+1, L[j].rstrip()[:126]))
