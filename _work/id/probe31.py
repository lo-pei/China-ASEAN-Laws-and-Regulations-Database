# -*- coding: utf-8 -*-
"""探测地区/其他 JDIH 站点（第三批）"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

urls = [
    "https://jdih.mahkamahagung.go.id/",
    "https://jdih.komisiyudisial.go.id/",
    "https://jdih.jatengprov.go.id/",
    "https://jdih.jabarprov.go.id/",
    "https://jdih.jatimprov.go.id/",
    "https://jdih.bantenprov.go.id/",
    "https://jdih.sumutprov.go.id/",
    "https://jdih.kaltimprov.go.id/",
    "https://jdih.baliprov.go.id/",
    "https://jdih.sulselprov.go.id/",
    "https://jdih.papua.go.id/",
    "https://jdih.dki.go.id/",
    "https://jdih.semarangkota.go.id/",
    "https://jdih.surabaya.go.id/",
    "https://jdih.medan.go.id/",
    "https://jdih.makassar.go.id/",
    "https://jdih.denpasar.go.id/",
    "https://jdih.balikpapan.go.id/",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=12, cache=False)
        print("OK  ", u, len(raw))
    except Exception as e:
        print("ERR ", u, str(e)[:80])
