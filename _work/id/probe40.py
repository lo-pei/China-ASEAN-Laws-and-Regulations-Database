# -*- coding: utf-8 -*-
"""探测 KYRI 文件下载的真实路径"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

name = "UNDANG-UNDANG_NOMOR_28_TAHUN_2014_TENTANG_HAK_CIPTA.pdf"
base = "https://jdih.komisiyudisial.go.id"
ref = base + "/produk-hukum-peraturan/undang-undang-nomor-28-tahun-2014-tentang-hak-cipta/289"
hdrs = {"Referer": ref, "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}
cands = [
    base + "/produk-hukum-berkas-download/289?path=produk_hukum%2F" + name,
    base + "/produk-hukum-berkas-download/289?path=" + name,
    base + "/produk_hukum/" + name,
    base + "/storage/produk_hukum/" + name,
    base + "/storage/" + name,
    base + "/uploads/produk_hukum/" + name,
    base + "/file/produk_hukum/" + name,
    base + "/assets/produk_hukum/" + name,
    base + "/produk-hukum-berkas/289",
    base + "/produk-hukum-berkas-download/289",
]
for u in cands:
    try:
        raw = H.get(u, headers=hdrs, retries=1, timeout=25, cache=False)
        sig = raw[:8]
        print("OK  %-110s %8d %s" % (u[:110], len(raw), sig))
        if raw[:4] == b"%PDF":
            open(os.path.join(HERE, "pdf", "ID-COPYRIGHT-2014.kyri.pdf"), "wb").write(raw)
            print("     >>> saved PDF")
            break
    except Exception as e:
        print("ERR %-110s %s" % (u[:110], str(e)[:60]))
