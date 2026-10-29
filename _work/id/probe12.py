# -*- coding: utf-8 -*-
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H
for u in ["http://peraturan.go.id/id/uu-no-25-tahun-2007",
          "https://103.145.96.87/id/uu-no-25-tahun-2007",
          "http://jdihn.go.id/",
          "https://jdihn.go.id/",
          ]:
    try:
        raw = H.get(u, retries=1, timeout=15, cache=False)
        print("OK ", u, len(raw))
    except Exception as e:
        print("ERR", u, str(e)[:100])
