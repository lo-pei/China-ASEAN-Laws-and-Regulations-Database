# -*- coding: utf-8 -*-
import os, socket, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

hosts = ["jdih.kemenkeu.go.id", "jdih.kemenkoinfra.go.id", "pasal.id", "www.pasal.id",
         "jdih.maritim.go.id", "jdih.komisiyudisial.go.id", "jdihn.go.id"]
for h in hosts:
    try:
        print("DNS", h, socket.getaddrinfo(h, 443)[0][4])
    except Exception as e:
        print("DNS-ERR", h, str(e)[:60])

urls = [
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2007/25TAHUN2007UU.htm",
    "https://jdih.kemenkeu.go.id/api/download/fulltext/2007/40TAHUN2007UU.htm",
    "https://pasal.id/peraturan/uu/uu-no-25-tahun-2007",
]
for u in urls:
    try:
        raw = H.get(u, retries=1, timeout=30, cache=False)
        print("OK ", u, len(raw))
        open(os.path.join(HERE, "probe", "cand_" + u.split("/")[-1]), "wb").write(raw)
    except Exception as e:
        print("ERR", u, str(e)[:100])
