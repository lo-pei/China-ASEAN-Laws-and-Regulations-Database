# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
TARGETS = ["PH-H10691","PH-H10692","PH-H10694","SG-H795","BN-CAP-39-2015-COMPANIES-ACT"]

def load_catalog(path, var):
    s = io.open(path, encoding="utf-8").read()
    i = s.index("{", s.index(var))
    j = s.rindex("};")
    return s, i, j

# intl-catalog
s, i, j = load_catalog("prototype/data/intl-catalog.js", "CALR_INTL_CATALOG")
cat = json.loads(s[i:j+1])
print("=== intl-catalog 中这些法规的 title ===")
byid = {l["id"]: l for l in cat["laws"]}
for tid in TARGETS:
    L = byid.get(tid)
    if not L:
        print("  %-34s 不在 intl-catalog" % tid); continue
    t = L.get("title") or {}
    print("  %-34s zh=%r" % (tid, (t.get("zh") or "")[:60]))
    print("  %-34s en=%r" % ("", (t.get("en") or "")[:60]))

print()
# 统计 intl-catalog 中文标题覆盖
zh=0; tot=0
for L in cat["laws"]:
    tot += 1
    if (L.get("title") or {}).get("zh"): zh += 1
print("  intl-catalog: %d 条，有中文标题 %d（%.1f%%）" % (tot, zh, zh*100.0/tot))

# dataset-core
s2 = io.open("prototype/data/dataset-core.js", encoding="utf-8").read()
print()
print("  dataset-core 中 PH-H10691: %s" % ("有" if "PH-H10691" in s2 else "无"))
