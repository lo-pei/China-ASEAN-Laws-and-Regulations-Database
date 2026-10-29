# -*- coding: utf-8 -*-
"""测试多个印尼法规站点的可达性"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

urls = [
    "https://jdihn.go.id/",
    "http://www.bphn.go.id/",
    "https://bphn.go.id/",
    "https://peraturan.bpk.go.id/",
    "https://jdih.kemnaker.go.id/",
    "https://jdih.komdigi.go.id/",
    "https://jdih.kemenkum.go.id/",
    "https://peraturan.go.id/id/uu-no-25-tahun-2007",
    "https://www.peraturan.go.id/id/uu-no-25-tahun-2007",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=20, cache=False)
        print("OK  ", u, len(raw))
    except Exception as e:
        print("ERR ", u, str(e)[:110])
