# -*- coding: utf-8 -*-
"""探测候选来源：jdih.setneg API / jdih.kemenkeu fulltext / jdih.mahkamahagung"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

def show(tag, u, **kw):
    try:
        raw = H.get(u, **kw)
        t = H.decode(raw)
        open(os.path.join(OUT, tag), "w", encoding="utf-8").write(t)
        print("OK  ", tag, u, len(raw), t[:200].replace("\n", " ")[:200])
        return t
    except Exception as e:
        print("ERR ", tag, u, str(e)[:130])
        return None

show("kemenkeu_uu25_2007.htm", "https://jdih.kemenkeu.go.id/api/download/fulltext/2007/25TAHUN2007UU.htm")
show("setneg_api_jenis.json", "https://jdih.setneg.go.id/api/hukumproduk/jeniscount")
show("setneg_api_produk.json", "https://jdih.setneg.go.id/api/hukumproduk/produkhukum?page=1&limit=5")
show("ma_detail.html", "https://jdih.mahkamahagung.go.id/index.php/legal-product/uu-nomor-25-tahun-2007doc/detail", retries=1, timeout=30)
