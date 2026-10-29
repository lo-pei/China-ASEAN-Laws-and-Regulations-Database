# -*- coding: utf-8 -*-
"""探索 jdih.komisiyudisial 的列表与搜索；尝试多条 PDF 下载路径"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
cands = [
    ("ky_list", "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan"),
    ("ky_list2", "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan?jenis=undang-undang"),
    ("ky_list3", "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan?search=ketenagakerjaan"),
    ("ky_list4", "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan/kategori/1"),
]
for tag, u in cands:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        links = sorted(set(re.findall(r'href="(/produk-hukum-peraturan/[^"]+)"', t)))
        print("== OK", tag, len(t), "links", len(links))
        for l in links[:15]:
            print("    ", l[:150])
        for m in sorted(set(re.findall(r'href="([^"]*(?:berkas|download)[^"]*)"', t)))[:8]:
            print("    DL", m[:170])
    except Exception as e:
        print("== ERR", tag, str(e)[:110])
