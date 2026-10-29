# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
print("=== prototype/data 下含 \"title\" 的数据文件 ===")
for f in sorted(glob.glob("prototype/data/*.js")):
    s = io.open(f, encoding="utf-8").read(3000000)
    n = len(re.findall(r'"title"\s*:', s))
    zh = len(re.findall(r'"zh"\s*:\s*"[^"]{2,}"', s))
    if n:
        print("  %-38s \"title\" %5d 次  zh非空 %5d  %8.1f KB" % (
            os.path.basename(f), n, zh, os.path.getsize(f)/1024))
print()
print("=== 界面如何取标题：search.js / store.js ===")
for p in ["prototype/assets/js/core/store.js","prototype/assets/js/views/search.js"]:
    L = io.open(p, encoding="utf-8").read().split("\n")
    for i, ln in enumerate(L):
        if re.search(r"\.title|titleOf|catalog|dataset", ln) and re.search(r"title", ln):
            print("  %-22s L%-4d %s" % (os.path.basename(p), i+1, ln.strip()[:130]))
