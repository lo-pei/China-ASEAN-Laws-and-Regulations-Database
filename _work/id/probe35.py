# -*- coding: utf-8 -*-
"""抓取指定的 Kemnaker 详情页并列出全部文档链接"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
docs = {
    "kn_pp35_2021": "https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021",
    "kn_uu13_2003": "https://jdih.kemnaker.go.id/peraturan/detail/27/undang-undang-nomor-13-tahun-2003",
    "kn_uu11_2020": "https://jdih.kemnaker.go.id/peraturan/detail/1698/undang-undang-nomor-11-tahun-2020",
    "kn_uu6_2023": "https://jdih.kemnaker.go.id/peraturan/detail/2302/undang-undang-nomor-6-tahun-2023",
}
for tag, u in docs.items():
    try:
        t = H.get_text(u, retries=2, timeout=40)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        links = sorted(set(re.findall(r'https://jdih\.kemnaker\.go\.id/asset/[^"\'#\s]+', t)))
        print("==", tag, len(t))
        for l in links:
            print("    ", l[:170])
    except Exception as e:
        print("== ERR", tag, str(e)[:100])
