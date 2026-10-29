# -*- coding: utf-8 -*-
"""检查 kemenkoinfra 的 UU 页面是否含全文；搜索 komdigi 的 PP 71/2019"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
cands = [
    ("koinfra_uu27", "https://jdih.kemenkoinfra.go.id/uu-no-272022-pelindungan-data-pribadi"),
    ("komdigi_pp71", "https://jdih.komdigi.go.id/produk_hukum/pencarian?q=71+tahun+2019"),
    ("komdigi_pp71b", "https://jdih.komdigi.go.id/produk_hukum/view/id/553/t/peraturan+menteri+komunikasi+dan+informatika+nomor+20+tahun+2016+tanggal+1+desember+2016"),
    ("kemendag_uu7", "https://jdih.kemendag.go.id/peraturan?q=undang-undang+nomor+7+tahun+2014"),
]
for tag, u in cands:
    try:
        t = H.get_text(u, retries=1, timeout=40)
        open(os.path.join(OUT, tag + ".html"), "w", encoding="utf-8").write(t)
        txt = H.html_text(t)
        print("== OK", tag, "html", len(t), "text", len(txt), "| Pasal1:", txt.find("Pasal 1"))
        for m in sorted(set(re.findall(r'href="([^"]*(?:pdf|download|file|view|peraturan)[^"]*)"', t, re.I)))[:12]:
            print("    LINK", m[:150])
    except Exception as e:
        print("== ERR", tag, str(e)[:110])
