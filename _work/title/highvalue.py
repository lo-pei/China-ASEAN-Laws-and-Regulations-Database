# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")
groups = Counter()
samples = {}
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    try: o = json.load(io.open(f, encoding="utf-8"))
    except: continue
    t = o.get("title") or {}
    if t.get("zh"): continue
    src = t.get("en") or next((v for v in t.values() if v), None)
    if not src: continue
    n = len(o.get("articles") or [])
    c = o.get("country")
    if n > 0:
        groups["有全文"] += 1
        samples.setdefault(c, []).append((o["id"], n, src))
    else:
        groups["仅目录"] += 1
print("  无中文标题的法规：")
for k, v in groups.items():
    print("    %-8s %5d" % (k, v))
print("")
print("  有全文但无中文标题，按国别：")
for c, lst in sorted(samples.items(), key=lambda x: -len(x[1])):
    print("    %-4s %4d 部" % (c, len(lst)))
print("")
print("  样例（每国前 4 条）：")
for c, lst in list(samples.items())[:12]:
    print("  --- " + c)
    for lid, n, src in lst[:4]:
        print("     %-30s %4d条  %s" % (lid, n, src[:70]))
