# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
L = io.open("prototype/assets/js/core/store.js", encoding="utf-8").read().split("\n")
print("  总行数 %d" % len(L))
i = next(k for k,ln in enumerate(L) if "function merge" in ln)
for j in range(i, min(len(L), i+70)):
    print("  L%-4d %s" % (j+1, L[j].rstrip()[:126]))
