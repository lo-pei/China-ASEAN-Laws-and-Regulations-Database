# -*- coding: utf-8 -*-
"""抓取 Kemnaker 详情页，查看文档形态"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
docs = {
    "kn_uu13_2003": "https://jdih.kemnaker.go.id/peraturan/detail/27/undang-undang-nomor-13-tahun-2003",
    "kn_uu11_2020": "https://jdih.kemnaker.go.id/peraturan/detail/1698/undang-undang-nomor-11-tahun-2020",
    "kn_uu6_2023": "https://jdih.kemnaker.go.id/peraturan/detail/2302/undang-undang-nomor-6-tahun-2023",
    "kn_pp36_2021": "https://jdih.kemnaker.go.id/peraturan/detail/1724/peraturan-pemerintah-nomor-36-tahun-2021",
}
for tag, u in docs.items():
    try:
        t = H.get_text(u, retries=2, timeout=40)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        print("== OK", tag, len(t))
        for m in sorted(set(re.findall(r'(?:href|src|data-[a-z]+)="([^"]*(?:pdf|download|file|embed|docs|storage)[^"]*)"', t, re.I)))[:15]:
            print("    LINK", m[:170])
        # 文本预览
        txt = H.html_text(t)
        print("    TXT", txt[:300].replace("\n", " | ")[:300])
    except Exception as e:
        print("== ERR", tag, str(e)[:110])
