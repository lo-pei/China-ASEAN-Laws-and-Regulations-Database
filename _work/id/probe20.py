# -*- coding: utf-8 -*-
"""抓 BKPM 法规列表页，找国家法律(UU)入口"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
cands = [
    ("bkpm_reg", "https://jdih.bkpm.go.id/id/regulation?type=undang-undang"),
    ("bkpm_reg2", "https://jdih.bkpm.go.id/id/regulation"),
    ("bkpm_search3", "https://jdih.bkpm.go.id/id/search?q=undang-undang+nomor+25+tahun+2007"),
    ("bkpm_search4", "https://jdih.bkpm.go.id/id/search?keyword=penanaman%20modal"),
]
for tag, u in cands:
    try:
        t = H.get_text(u, retries=1, timeout=35)
        fn = os.path.join(OUT, tag + ".html")
        open(fn, "w", encoding="utf-8").write(t)
        docs = sorted(set(re.findall(r'href="(/id/document/[^"]+)"', t)))
        print("== OK", tag, len(t), "docs", len(docs))
        for d in docs[:12]:
            print("    ", d[:150])
    except Exception as e:
        print("== ERR", tag, str(e)[:110])
