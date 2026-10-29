# -*- coding: utf-8 -*-
import socket, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

hosts = ["www.peraturan.go.id", "api.peraturan.go.id", "cdn.peraturan.go.id",
         "jdih.peraturan.go.id", "sipuu.peraturan.go.id", "peraturan.bpk.go.id"]
for h in hosts:
    try:
        print("DNS", h, socket.getaddrinfo(h, 443)[0][4])
    except Exception as e:
        print("DNS-ERR", h, str(e)[:60])

for u in ["https://www.peraturan.go.id/id/uu-no-25-tahun-2007",
          "https://api.peraturan.go.id/"]:
    try:
        raw = H.get(u, retries=1, timeout=20, cache=False)
        print("OK ", u, len(raw))
    except Exception as e:
        print("ERR", u, str(e)[:110])
