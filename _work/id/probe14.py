# -*- coding: utf-8 -*-
"""批量可达性测试（第二批候选）"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

urls = [
    "https://jdih.go.id/",
    "https://www.jdih.go.id/",
    "https://www.hukumonline.com/pusatdata/",
    "https://peraturan.hukumonline.com/",
    "https://jdih.ekon.go.id/",
    "https://jdih.kemenkopmk.go.id/",
    "https://jdih.kemenparekraf.go.id/",
    "https://jdih.kkp.go.id/",
    "https://jdih.lkpp.go.id/",
    "https://jdih.bsn.go.id/",
    "https://jdih.bappenas.go.id/",
    "https://jdih.asean.org/",
    "https://jdih.komnasham.go.id/",
    "https://jdih.bin.go.id/",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=15, cache=False)
        print("OK  ", u, len(raw))
    except Exception as e:
        print("ERR ", u, str(e)[:90])
