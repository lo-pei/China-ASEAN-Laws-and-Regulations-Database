# -*- coding: utf-8 -*-
"""测试 jdih.kemenkeu.go.id 可达性（重要：提供 fulltext HTML）"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

urls = [
    "https://jdih.kemenkeu.go.id/",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2007/25TAHUN2007UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2007/40TAHUN2007UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2003/13TAHUN2003UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2014/28TAHUN2014UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2022/27TAHUN2022UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/1999/30TAHUN1999UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2020/11TAHUN2020UU.htm",
]
for u in urls:
    try:
        raw = H.get(u, retries=2, timeout=25, cache=False)
        print("OK  ", u, len(raw), H.decode(raw)[:80].replace("\n", " "))
        fn = os.path.join(HERE, "probe", "kemenkeu_" + u.rstrip("/").split("/")[-1])
        open(fn, "wb").write(raw)
    except Exception as e:
        print("ERR ", u, str(e)[:90])
