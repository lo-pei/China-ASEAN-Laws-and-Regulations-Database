# -*- coding: utf-8 -*-
"""探测 jdih.setneg.go.id 的 peraturan 列表页与详情页结构"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

urls = [
    "https://jdih.setneg.go.id/produk-hukum/instrumen/peraturan",
    "https://jdih.setneg.go.id/produk-hukum/instrumen/peraturan?tahun=2007",
]
for i, u in enumerate(urls):
    try:
        raw = H.get(u, retries=2, timeout=40)
        txt = H.decode(raw)
        open(os.path.join(OUT, "list%d.html" % i), "w", encoding="utf-8").write(txt)
        print("OK", u, len(raw), "save list%d.html" % i)
        # 找详情/下载链接模式
        links = re.findall(r'href=["\']([^"\']+)["\']', txt)
        pats = sorted(set(re.sub(r"\d+", "N", l) for l in links))
        for p in pats[:60]:
            print("   ", p[:110])
    except Exception as e:
        print("ERR", u, str(e)[:160])
