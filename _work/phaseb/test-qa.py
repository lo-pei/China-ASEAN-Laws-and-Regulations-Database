# -*- coding: utf-8 -*-
import sys, json, time, urllib.request
sys.stdout.reconfigure(encoding="utf-8")
B = "http://127.0.0.1:8000"
def post(path, body):
    req = urllib.request.Request(B+path, data=json.dumps(body).encode("utf-8"),
                                 headers={"Content-Type":"application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=180) as r: d = json.loads(r.read().decode("utf-8"))
    return d, round((time.time()-t0)*1000)
for q in ["数据安全法里关于数据分类分级保护的规定", "仲裁裁决的撤销情形", "泰国个人数据保护法关于跨境传输"]:
    d, ms = post("/api/qa", {"question": q, "topk": 4})
    print("  ▸ %s   (%sms, mode=%s)" % (q, ms, d.get("mode")))
    for c in d.get("citations", []):
        t = c.get("lawTitle") or {}
        ti = t.get("zh") or t.get("en") or ""
        body = (c.get("text") or {}).get("zh") or (c.get("text") or {}).get("en") or ""
        print("      %s %-24s %-8s %s" % (c["country"], ti[:24], c.get("noLabel"), body[:58].replace("\n"," ")))
    print()
