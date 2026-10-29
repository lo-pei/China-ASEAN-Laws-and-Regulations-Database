# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
L = io.open("prototype/assets/js/core/search.js", encoding="utf-8").read().split("\n")
def show(a, b, tag):
    print("=== %s (L%d-%d) ===" % (tag, a+1, b))
    for j in range(a, min(len(L), b)):
        print("  L%-4d %s" % (j+1, L[j].rstrip()[:126]))
    print()
show(109, 135, "run 入口")
show(337, 372, "countHit / bestArticle")
