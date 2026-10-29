# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")
rows = []
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    try: o = json.load(io.open(f, encoding="utf-8"))
    except: continue
    t = o.get("title") or {}
    if t.get("zh"): continue
    src = t.get("en")
    if src and not re.search(r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]", src):
        rows.append((o.get("country"), src.strip()))
ph = [t for c,t in rows if c == "PH"]
print("  菲律宾英文标题 %d 条" % len(ph))
print("")
print("=== 「An Act ___」后第一个动词分布 ===")
c = Counter()
for t in ph:
    m = re.match(r"^An?\s+Act\s+([A-Za-z\-]+)", t)
    if m: c[m.group(1).lower()] += 1
    else: c["(非 An Act 开头)"] += 1
tot = 0
for k, v in c.most_common(30):
    print("  %-22s %5d" % (k, v)); tot += v
print("  ---- 前 30 项已覆盖 %d / %d" % (tot, len(ph)))
print("")
print("=== 非「An Act」开头的菲律宾标题（前 25）===")
others = [t for t in ph if not re.match(r"^An?\s+Act\b", t)]
print("  共 %d 条" % len(others))
for t in others[:25]:
    print("     " + t[:105])
print("")
print("=== 「An Act」类标题骨架抽样（前 12）===")
for t in ph[:12]:
    print("     " + t[:115])
