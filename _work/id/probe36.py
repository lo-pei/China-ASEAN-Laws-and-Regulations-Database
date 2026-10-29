# -*- coding: utf-8 -*-
"""综合检查候选来源（官方 JDIH HTML/PDF）"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

URLS = {
    "kn_uu13_2003": "https://jdih.kemnaker.go.id/peraturan/detail/27/undang-undang-nomor-13-tahun-2003",
    "kn_uu11_2020": "https://jdih.kemnaker.go.id/peraturan/detail/1698/undang-undang-nomor-11-tahun-2020",
    "kn_pp35_2021": "https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021",
    "komdigi_uu36_1999": "https://jdih.komdigi.go.id/produk_hukum/view/id/564/t/undangundang+nomor+36+tahun+1999",
    "komdigi_kp91_1999": "https://jdih.komdigi.go.id/produk_hukum/view/id/496/t/keputusan+presiden+republik+indonesia+nomor+91+tahun+1999",
    "pdp_pasal": "https://pasal.id/peraturan/uu/uu-no-27-tahun-2022",
    "sulsel_tipe1": "https://jdih.sulselprov.go.id/dokumen/tipe/1/peraturan-perundang-undangan",
}
for tag, u in URLS.items():
    try:
        t = H.get_text(u, retries=1, timeout=35)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        txt = H.html_text(t)
        i = txt.find("Pasal 1 ")
        j = txt.find("Pasal 1\n")
        k = min([x for x in (i, j) if x > 0] or [-1])
        print("== %-18s html=%7d text=%7d Pasal1@%s" % (tag, len(t), len(txt), k))
        if k > 0:
            lines = [l for l in txt[k:k + 2000].split("\n") if l.strip()]
            avg = sum(len(l) for l in lines) / max(1, len(lines))
            print("    avgline=%.1f sample=%s" % (avg, " / ".join(lines[:6])[:220]))
    except Exception as e:
        print("== ERR %-18s %s" % (tag, str(e)[:100]))
