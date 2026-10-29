# -*- coding: utf-8 -*-
import os, socket, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

for host in ["jdih.kemenkeu.go.id", "kemenkeu.go.id", "www.kemenkeu.go.id",
             "jdih.mahkamahagung.go.id", "jdih.komisiyudisial.go.id",
             "web.archive.org", "peraturan.go.id"]:
    try:
        print("DNS", host, socket.getaddrinfo(host, 443)[0][4])
    except Exception as e:
        print("DNS-ERR", host, e)

urls = [
    "https://web.archive.org/web/2023/https://peraturan.go.id/id/uu-no-25-tahun-2007",
    "http://archive.org/wayback/available?url=peraturan.go.id/id/uu-no-25-tahun-2007",
    "https://jdih.komisiyudisial.go.id/produk-hukum-peraturan/undang-undang-nomor-13-tahun-2003-tentang-ketenagakerjaan/271",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=30, cache=False)
        print("OK  ", u, len(raw))
        print("     ", H.decode(raw)[:300].replace("\n", " "))
    except Exception as e:
        print("ERR ", u, str(e)[:130])
