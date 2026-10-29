# -*- coding: utf-8 -*-
"""在多个可达 JDIH 站点批量搜索目标法规，汇总命中的详情页链接"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
# (站点, 搜索URL模板)
SITES = {
    "kemlu": "https://jdih.kemlu.go.id/?s={q}",
    "brin": "https://jdih.brin.go.id/?s={q}",
    "kemenpora": "https://jdih.kemenpora.go.id/?s={q}",
    "kkp": "https://jdih.kkp.go.id/?s={q}",
    "kemenkopmk": "https://jdih.kemenkopmk.go.id/?s={q}",
    "kemendag": "https://jdih.kemendag.go.id/peraturan?q={q}",
    "komdigi": "https://jdih.komdigi.go.id/produk_hukum/inventarisasi?q={q}",
}
QUERIES = {
    "uu25_2007": "penanaman+modal",
    "uu13_2003": "ketenagakerjaan",
    "uu28_2014": "hak+cipta",
    "uu27_2022": "pelindungan+data+pribadi",
    "uu40_2007": "perseroan+terbatas",
    "uu30_1999": "arbitrase",
    "pp71_2019": "sistem+dan+transaksi+elektronik",
    "uu7_2014": "perdagangan",
    "uu11_2019": "sistem+ilmiah",
}
DETAIL = re.compile(r'href="([^"]*(?:detail|/view/id|dokumen/view|peraturan/detail)[^"]*)"', re.I)
PDFL = re.compile(r'(https?://[^"\'\s]+\.pdf)', re.I)

summary = {}
for qname, q in QUERIES.items():
    for sname, tpl in SITES.items():
        u = tpl.format(q=q)
        try:
            t = H.get_text(u, retries=1, timeout=20)
        except Exception as e:
            continue
        hits = [h for h in sorted(set(DETAIL.findall(t))) if re.search(r"(uu|undang|penanaman|modal|cipta|data|arbitrase|perseroan|dagang|elektronik|ilmiah|ketenagakerjaan|nomor)", h, re.I)]
        if hits:
            print("== %-10s %-12s hits=%d" % (qname, sname, len(hits)))
            for h in hits[:10]:
                print("      ", h[:150])
