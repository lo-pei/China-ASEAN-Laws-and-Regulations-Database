# -*- coding: utf-8 -*-
import io, os, re, sys, glob
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
for f in glob.glob("prototype/assets/js/**/*.js", recursive=True):
    s = io.open(f, encoding="utf-8").read()
    if "tokenize" in s and ("function tokenize" in s or "tokenize =" in s or "tokenize:" in s):
        for i, ln in enumerate(s.split("\n")):
            if re.search(r"tokenize", ln) and re.search(r"function|[:=]", ln):
                print("  %-46s L%-4d %s" % (f.replace("prototype/assets/js/",""), i+1, ln.strip()[:90]))
