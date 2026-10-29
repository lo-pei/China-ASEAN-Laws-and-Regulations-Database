# -*- coding: utf-8 -*-
"""在 smg/?s= 页面与 sulsel sitemap 中查找 UU 全文链接"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")

t = H.get_text("https://jdih.semarangkota.go.id/?s=penanaman+modal", timeout=45)
open(os.path.join(OUT, "smg_raw.html"), "w", encoding="utf-8").write(t)
print("smg len", len(t))
pats = {}
for m in re.findall(r'href="([^"]+)"', t):
    k = re.sub(r"\d+", "N", m)[:70]
    pats[k] = pats.get(k, 0) + 1
for k, v in sorted(pats.items(), key=lambda x: -x[1])[:20]:
    print("  ", v, k)
for m in re.findall(r'href="([^"]*(?:uu|undang|penanaman|\.pdf)[^"]*)"', t, re.I)[:20]:
    print("  HIT", m[:150])

sm = open(os.path.join(OUT, "sulsel_sitemap.xml"), encoding="utf-8").read()
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
print("sulsel sitemap locs", len(locs), locs[:10])
