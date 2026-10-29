# -*- coding: utf-8 -*-
"""批量测试更多印尼 JDIH 站点可达性"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

urls = [
    "https://jdih.setneg.go.id/",
    "https://jdih.kemendag.go.id/",
    "https://jdih.bkpm.go.id/",
    "https://jdih.kemenkumham.go.id/",
    "https://jdih.komdigi.go.id/",
    "https://jdih.kemnaker.go.id/",
    "https://jdih.esdm.go.id/",
    "https://jdih.pertanian.go.id/",
    "https://jdih.maritim.go.id/",
    "https://jdih.dephub.go.id/",
    "https://jdih.kejaksaan.go.id/",
    "https://jdih.mkri.id/",
    "https://www.mkri.id/",
    "https://jdihn.go.id/pencarian/produk-hukum",
    "https://sipuu.setkab.go.id/",
    "https://www.dpr.go.id/",
    "https://legislasi.mpr.go.id/",
    "https://jdih.komisiyudisial.go.id/",
    "https://jdih.ojk.go.id/",
    "https://jdih.bssn.go.id/",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=15, cache=False)
        print("OK  ", u, len(raw))
    except Exception as e:
        print("ERR ", u, str(e)[:90])
