# -*- coding: utf-8 -*-
import io, json, os, sys, collections
sys.stdout.reconfigure(encoding="utf-8")
LAWS = "prototype/data/laws"
n = 0
hasSrcUrl = hasFtUrl = hasAny = 0
byCountry = collections.Counter()
for f in os.listdir(LAWS):
    if not f.endswith(".json") or f == "index.json": continue
    o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    n += 1
    s = o.get("source") or {}
    ft = o.get("fullText") or {}
    u1 = s.get("url") if isinstance(s, dict) else ""
    u2 = ft.get("sourceUrl") if isinstance(ft, dict) else ""
    if u1 and u1.startswith("http"): hasSrcUrl += 1
    if u2 and u2.startswith("http"): hasFtUrl += 1
    if (u1 and u1.startswith("http")) or (u2 and u2.startswith("http")):
        hasAny += 1
        byCountry[o.get("country")] += 1
print("  法规总数: %d" % n)
print("  有 source.url: %d (%.1f%%)" % (hasSrcUrl, hasSrcUrl/n*100))
print("  有 fullText.sourceUrl: %d (%.1f%%)" % (hasFtUrl, hasFtUrl/n*100))
print("  至少有一个可访源: %d (%.1f%%)" % (hasAny, hasAny/n*100))
print("  按国别: %s" % dict(byCountry.most_common()))
