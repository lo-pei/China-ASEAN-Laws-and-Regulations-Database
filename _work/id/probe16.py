# -*- coding: utf-8 -*-
"""Kemnaker / Komdigi 搜索目标法律"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
cands = [
    ("kemnaker_search13", "https://jdih.kemnaker.go.id/peraturan?keyword=ketenagakerjaan&jenis=undang-undang"),
    ("kemnaker_search2", "https://jdih.kemnaker.go.id/peraturan?keyword=13+tahun+2003"),
    ("kemnaker_search3", "https://jdih.kemnaker.go.id/peraturan?keyword=cipta+kerja"),
    ("komdigi_inv", "https://jdih.komdigi.go.id/produk_hukum/inventarisasi"),
    ("komdigi_search_pdp", "https://jdih.komdigi.go.id/produk_hukum/pencarian-teks?q=pelindungan+data+pribadi"),
    ("setneg_tentang", "https://jdih.setneg.go.id/tentangkami/tentang"),
]
for tag, u in cands:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        print("== OK", tag, len(t))
        hits = sorted(set(re.findall(r'href="([^"]*(?:detail|view|peraturan)[^"]*)"', t, re.I)))
        for h in hits[:20]:
            print("    ", h[:140])
    except Exception as e:
        print("== ERR", tag, str(e)[:110])
