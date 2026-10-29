# -*- coding: utf-8 -*-
"""在多个地区 JDIH 站点中搜索目标国家法律"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
sites = {
    "semarang": "https://jdih.semarangkota.go.id",
    "surabaya": "https://jdih.surabaya.go.id",
    "banten": "https://jdih.bantenprov.go.id",
    "sulsel": "https://jdih.sulselprov.go.id",
    "balikpapan": "https://jdih.balikpapan.go.id",
    "sumut": "https://jdih.sumutprov.go.id",
    "bali": "https://jdih.baliprov.go.id",
}
paths = [
    "/sitemap.xml",
    "/robots.txt",
    "/search?q=penanaman+modal",
    "/pencarian?q=penanaman+modal",
    "/?s=penanaman+modal",
    "/produk-hukum?q=penanaman+modal",
]
for tag, base in sites.items():
    for p in paths:
        u = base + p
        try:
            t = H.get_text(u, retries=1, timeout=20, cache=False)
            head = t[:120].replace("\n", " ")
            print("OK  %-10s %-34s %7d  %s" % (tag, p, len(t), head))
            if p.endswith(".xml") or p.endswith(".txt"):
                open(os.path.join(OUT, "%s%s" % (tag, p.replace("/", "_"))), "w", encoding="utf-8").write(t)
        except Exception as e:
            print("ERR %-10s %-34s %s" % (tag, p, str(e)[:60]))
