# -*- coding: utf-8 -*-
"""Kemnaker 搜索 PP 35/2021；Komdigi 搜索 PP 71/2019"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
qs = [
    ("kn_pp35_a", "https://jdih.kemnaker.go.id/peraturan?keyword=perjanjian+kerja+waktu+tertentu"),
    ("kn_pp35_b", "https://jdih.kemnaker.go.id/peraturan?keyword=alih+daya"),
    ("kn_pp35_c", "https://jdih.kemnaker.go.id/peraturan?keyword=pp+35+tahun+2021"),
    ("kn_pp35_d", "https://jdih.kemnaker.go.id/peraturan?tahun=2021&keyword=35"),
    ("komdigi_pp71_a", "https://jdih.komdigi.go.id/produk_hukum/inventarisasi?q=71+tahun+2019"),
    ("komdigi_pp71_b", "https://jdih.komdigi.go.id/produk_hukum/pencarian-teks?keyword=penyelenggaraan+sistem+dan+transaksi+elektronik"),
]
for tag, u in qs:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        hits = sorted(set(re.findall(r'href="([^"]*(?:detail|view/id)[^"]*)"', t)))
        print("==", tag, len(t), "hits", len(hits))
        for h in hits[:12]:
            print("    ", h[:140])
    except Exception as e:
        print("== ERR", tag, str(e)[:90])
