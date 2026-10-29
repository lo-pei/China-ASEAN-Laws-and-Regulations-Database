# -*- coding: utf-8 -*-
"""第四批：尝试绕过 Cloudflare 的 bpk 站点、查找 setneg 详情页、测试其他门户"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
HDR = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    "Upgrade-Insecure-Requests": "1",
}
tests = [
    ("bpk_home", "https://peraturan.bpk.go.id/", HDR),
    ("bpk_detail", "https://peraturan.bpk.go.id/Details/39903/uu-no-25-tahun-2007", HDR),
    ("bpk_m", "https://m.peraturan.bpk.go.id/Details/39903", HDR),
    ("setneg_hukum_produk", "https://jdih.setneg.go.id/api/hukumproduk/1", HDR),
    ("setneg_uu_page", "https://jdih.setneg.go.id/produk-hukum/instrumen/peraturan/uu-no-25-tahun-2007", HDR),
]
for tag, u, h in tests:
    try:
        raw = H.get(u, headers=h, retries=1, timeout=30, cache=False)
        t = H.decode(raw)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        print("OK  %-22s %7d  %s" % (tag, len(raw), t[:110].replace("\n", " ")))
    except Exception as e:
        print("ERR %-22s %s" % (tag, str(e)[:100]))
