# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
for f in ["prototype/assets/js/core/util.js"]:
    s = io.open(f, encoding="utf-8").read()
    L = s.split("\n")
    for i, ln in enumerate(L):
        if re.match(r"\s*(tokenize|plain|tr)\s*[:=]|function\s+(tokenize|plain|tr)\b", ln):
            print("  %s L%-4d %s" % (os.path.basename(f), i+1, ln.strip()[:100]))
    print("  文件行数 %d" % len(L))
