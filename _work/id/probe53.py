# -*- coding: utf-8 -*-
"""第六批：核对马来/其他可达站点能否提供印尼国家法律 HTML 全文"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
tests = [
    ("komdigi_uu27", "https://jdih.komdigi.go.id/produk_hukum/inventarisasi?q=pelindungan+data+pribadi"),
    ("komdigi_kategori", "https://jdih.komdigi.go.id/produk_hukum/kategori"),
    ("komdigi_statistik", "https://jdih.komdigi.go.id/produk_hukum/statistik"),
    ("kemendag_peraturan", "https://jdih.kemendag.go.id/peraturan?jenis%5B0%5D=undang-undang"),
    ("kemnaker_all", "https://jdih.kemnaker.go.id/peraturan?jenis%5B0%5D=0&per_page=100"),
    ("kemnaker_uu", "https://jdih.kemnaker.go.id/peraturan?jenis%5B0%5D=0"),
]
for tag, u in tests:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        links = sorted(set(re.findall(r'href="([^"]*(?:peraturan/detail|produk_hukum/view)[^"]*)"', t)))
        uu = [l for l in links if re.search(r"undang-undang|uu", l, re.I)]
        print("== %-20s len=%7d links=%3d UU链接=%2d" % (tag, len(t), len(links), len(uu)))
        for l in uu[:12]:
            print("     ", l[:140])
    except Exception as e:
        print("== ERR %-20s %s" % (tag, str(e)[:90]))
