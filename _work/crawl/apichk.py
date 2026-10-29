# -*- coding: utf-8 -*-
import io, json, sys, urllib.request
sys.stdout.reconfigure(encoding="utf-8")
def api(p):
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000" + p, timeout=60) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"_err": str(e)[:80]}
h = api("/api/health")
print("  health: ok=%s  laws=%s  articles=%s  vectors=%s" % (
    h.get("ok"), h.get("laws"), h.get("articles"), h.get("vectors")))
for lid in ["PH-H359", "PH-H10362", "CN-DATA-2021"]:
    d = api("/api/laws/%s/articles" % lid)
    print("  %-14s API 返回 %s 条" % (lid, d.get("count") if not d.get("_err") else d["_err"]))
