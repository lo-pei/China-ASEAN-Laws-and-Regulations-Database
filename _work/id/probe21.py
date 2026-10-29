# -*- coding: utf-8 -*-
"""检查 jdih.komisiyudisial UU27/2022 页面是否含全文 HTML"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
u = "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan/undang-undang-nomor-27-tahun-2022-tentang-pelindungan-data-pribadi/336"
t = H.get_text(u, retries=2, timeout=40)
open(os.path.join(OUT, "ky_uu27_2022.html"), "w", encoding="utf-8").write(t)
print("len", len(t))
for m in sorted(set(re.findall(r'(?:href|src|data-[a-z]+)="([^"]*(?:pdf|download|berkas|file)[^"]*)"', t, re.I)))[:20]:
    print("LINK", m[:180])
txt = H.html_text(t)
print("txtlen", len(txt))
i = txt.find("Pasal 1")
print("Pasal 1 idx", i)
print(txt[:1200])
