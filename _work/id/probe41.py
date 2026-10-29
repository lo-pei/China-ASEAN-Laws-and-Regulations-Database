# -*- coding: utf-8 -*-
"""第五批：更多部委 JDIH 可达性 + 直接搜索 UU 25/2007"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
sites = [
    ("kemenkum", "https://jdih.kemenkum.go.id"),
    ("kemenkeu2", "https://jdih.kemenkeu.go.id"),
    ("setkab", "https://jdih.setkab.go.id"),
    ("kejaksaan", "https://jdih.kejaksaan.go.id"),
    ("ojk", "https://jdih.ojk.go.id"),
    ("bssn", "https://jdih.bssn.go.id"),
    ("bappenas", "https://jdih.bappenas.go.id"),
    ("komnasham", "https://jdih.komnasham.go.id"),
    ("kemenag", "https://jdih.kemenag.go.id"),
    ("kemdikbud", "https://jdih.kemdikbud.go.id"),
    ("kemkes", "https://jdih.kemkes.go.id"),
    ("kemlu", "https://jdih.kemlu.go.id"),
    ("kemenperin", "https://jdih.kemenperin.go.id"),
    ("kemenkop", "https://jdih.kemenkopukm.go.id"),
    ("bpkp", "https://jdih.bpkp.go.id"),
    ("kppu", "https://jdih.kppu.go.id"),
    ("lapan", "https://jdih.brin.go.id"),
    ("kemenpora", "https://jdih.kemenpora.go.id"),
]
for tag, base in sites:
    try:
        raw = H.get(base + "/", retries=1, timeout=12, cache=False)
        print("OK  %-12s %-40s %7d" % (tag, base, len(raw)))
    except Exception as e:
        print("ERR %-12s %-40s %s" % (tag, base, str(e)[:70]))
