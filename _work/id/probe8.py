# -*- coding: utf-8 -*-
"""检查 jdih.komisiyudisial.go.id UU13/2003 详情页结构 + iframe/pdf 直链"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

u = "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan/undang-undang-nomor-13-tahun-2003-tentang-ketenagakerjaan/271"
t = H.get_text(u)
open(os.path.join(OUT, "ky_detail.html"), "w", encoding="utf-8").write(t)

# iframe / embed / pdf 链接
for m in sorted(set(re.findall(r'(?:src|href|data-src)=["\']([^"\']+)["\']', t))):
    if any(k in m.lower() for k in ("pdf", "download", "storage", "file", "iframe", "embed", "docs")):
        print("LINK", m)
print("---- text ----")
txt = H.html_text(t)
print(txt[:2000])
