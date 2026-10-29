# -*- coding: utf-8 -*-
"""在 BKPM / Kemendag / Komdigi / Kemnaker JDIH 中搜索目标法规"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

cands = [
    ("bkpm_search_uu25", "https://jdih.bkpm.go.id/id/search?q=penanaman+modal&document_type=Undang-Undang"),
    ("bkpm_search2", "https://jdih.bkpm.go.id/id/search?q=25+tahun+2007"),
    ("kemendag_search", "https://jdih.kemendag.go.id/peraturan?q=penanaman+modal"),
    ("kemendag_uu", "https://jdih.kemendag.go.id/peraturan?jenis=undang-undang"),
    ("komdigi_home", "https://jdih.komdigi.go.id/"),
    ("kemnaker_home", "https://jdih.kemnaker.go.id/"),
]
for tag, u in cands:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        print("OK  ", tag, len(t))
        # 抽取文档链接
        hits = sorted(set(re.findall(r'href="([^"]*(?:document|peraturan|produk)[^"]*)"', t, re.I)))
        hits = [h for h in hits if not re.search(r"\.(css|js|png|jpg|svg|ico)$", h)]
        for h in hits[:25]:
            print("    ", h[:140])
    except Exception as e:
        print("ERR ", tag, str(e)[:110])
