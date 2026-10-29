# -*- coding: utf-8 -*-
"""尝试用不同 UA / Referer 下载 KYRI PDF"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

PDF = os.path.join(HERE, "pdf")
os.makedirs(PDF, exist_ok=True)
u = ("https://jdih.komisiyudisial.go.id/produk-hukum-berkas-download/289"
     "?path=produk_hukum%2FUNDANG-UNDANG_NOMOR_28_TAHUN_2014_TENTANG_HAK_CIPTA.pdf")
hdrs = {
    "Referer": "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan/undang-undang-nomor-28-tahun-2014-tentang-hak-cipta/289",
    "Accept": "application/pdf,*/*",
}
for cache in (False, True):
    try:
        raw = H.get(u, headers=hdrs, retries=1, timeout=60, cache=cache)
        print("OK", cache, len(raw), raw[:8])
        if raw[:4] == b"%PDF":
            open(os.path.join(PDF, "ID-COPYRIGHT-2014.kyri.pdf"), "wb").write(raw)
            break
    except Exception as e:
        print("ERR", cache, str(e)[:150])
