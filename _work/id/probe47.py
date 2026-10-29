# -*- coding: utf-8 -*-
"""查找 pasal.id 的分页机制与 API"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
# 1) 在已存页面中寻找分页/接口线索
t = open(os.path.join(OUT, "pasal_uu13.html"), encoding="utf-8").read()
for kw in ["page=", "cursor", "loadMore", "LoadMore", "infinite", "nextPage", "/api/", "supabase", "rpc/", "offset", "limit="]:
    hits = [m.start() for m in re.finditer(re.escape(kw), t)][:3]
    print("%-12s %d %s" % (kw, len(re.findall(re.escape(kw), t)), hits))
    for h in hits[:1]:
        print("      ...%s..." % t[max(0, h - 150):h + 200].replace("\n", " ")[:340])

# 2) 试探分页参数
for u in ["https://pasal.id/peraturan/uu/uu-no-13-tahun-2003?page=2",
          "https://pasal.id/peraturan/uu/uu-no-13-tahun-2003?pasal=126",
          "https://pasal.id/api/regulations/uu-no-13-tahun-2003",
          "https://pasal.id/api/peraturan/uu-no-13-tahun-2003"]:
    try:
        r = H.get(u, retries=1, timeout=30, cache=False)
        print("OK  %-70s %8d %s" % (u, len(r), r[:60]))
    except Exception as e:
        print("ERR %-70s %s" % (u, str(e)[:70]))
