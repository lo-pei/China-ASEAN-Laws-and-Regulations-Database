# -*- coding: utf-8 -*-
import io, json, glob, os, sys
sys.stdout.reconfigure(encoding="utf-8")
print("=== 已译样例（含来源英文）===")
for lid in ["SG-H795","SG-H1566","BN-CAP-39-2015-COMPANIES-ACT","SG-H2931","PH-H10361","SG-H850"]:
    o = json.load(io.open("prototype/data/laws/%s.json" % lid, encoding="utf-8"))
    t = o.get("title") or {}
    print("  %-34s %s" % (lid, t.get("zh")))
    print("     ← %s" % str(t.get("en"))[:88])
print("")
print("=== 中文标题覆盖（按国别）===")
from collections import Counter, defaultdict
d = defaultdict(lambda: [0,0])
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    o = json.load(io.open(f, encoding="utf-8"))
    c = o.get("country","?")
    d[c][0] += 1
    if (o.get("title") or {}).get("zh"): d[c][1] += 1
print("  %-4s %6s %8s %8s" % ("国别","总数","有中文","覆盖率"))
tot=[0,0]
for c,(n,z) in sorted(d.items(), key=lambda x:-x[1][0]):
    print("  %-4s %6d %8d %7.1f%%" % (c, n, z, z*100.0/n))
    tot[0]+=n; tot[1]+=z
print("  %-4s %6d %8d %7.1f%%" % ("合计", tot[0], tot[1], tot[1]*100.0/tot[0]))
print("")
print("=== 剩余待译结构（英文 vs 非英文）===")
import re
eng=0; noneng=0
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    o = json.load(io.open(f, encoding="utf-8"))
    t = o.get("title") or {}
    if t.get("zh"): continue
    src = t.get("en") or next((v for v in t.values() if v), None)
    if re.search(r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]", str(src)): noneng += 1
    else: eng += 1
print("  英文标题待译: %d 条（可用同一批次流程继续）" % eng)
print("  泰/缅/高棉文待译: %d 条（缺源语言资料，需另行处理）" % noneng)
