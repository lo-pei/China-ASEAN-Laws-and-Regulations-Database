# -*- coding: utf-8 -*-
"""尝试下载 KYRI PDF（不同参数）"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "pdf")
os.makedirs(OUT, exist_ok=True)
base = "https://jdih.komisiyudisial.go.id/produk-hukum-berkas-download/336"
variants = [
    base + "?path=produk_hukum%2FUNDANG-UNDANG_NOMOR_27_TAHUN_2022_TENTANG_PELINDUNGAN_DATA_PRIBADI.pdf",
    base + "?path=produk_hukum/UNDANG-UNDANG_NOMOR_27_TAHUN_2022_TENTANG_PELINDUNGAN_DATA_PRIBADI.pdf",
    "https://jdih.komisiyudisial.go.id/produk_hukum/UNDANG-UNDANG_NOMOR_27_TAHUN_2022_TENTANG_PELINDUNGAN_DATA_PRIBADI.pdf",
]
for u in variants:
    try:
        raw = H.get(u, retries=1, timeout=60, cache=False)
        print("OK ", len(raw), raw[:8], u[:130])
        if raw[:4] == b"%PDF":
            open(os.path.join(OUT, "probe_ky.pdf"), "wb").write(raw)
            break
    except Exception as e:
        print("ERR", str(e)[:120], u[:130])
