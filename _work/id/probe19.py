# -*- coding: utf-8 -*-
"""用 Setneg API 检索国家法律列表（含 PDF 直链）"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
HDR = {
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://jdih.setneg.go.id/produk-hukum/instrumen/peraturan",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
}
cands = [
    "https://jdih.setneg.go.id/api/hukumproduk/produkhukum?page=1&per_page=10&jenis=Undang-Undang",
    "https://jdih.setneg.go.id/api/hukumproduk/produkhukum?page=1&limit=10",
    "https://jdih.setneg.go.id/api/hukumproduk/produkhukum",
    "https://jdih.setneg.go.id/api/hukumproduk/tahuncount",
    "https://jdih.setneg.go.id/api/hukumproduk/statuslist",
]
for i, u in enumerate(cands):
    try:
        raw = H.get(u, headers=HDR, retries=1, timeout=30)
        t = H.decode(raw)
        fn = os.path.join(OUT, "setneg_api_%d.json" % i)
        open(fn, "w", encoding="utf-8").write(t)
        print("OK ", u, len(t))
        print("   ", t[:400].replace("\n", " "))
    except Exception as e:
        print("ERR", u, str(e)[:110])
