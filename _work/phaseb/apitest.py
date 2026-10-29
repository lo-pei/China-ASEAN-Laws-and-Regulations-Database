# -*- coding: utf-8 -*-
import sys, json, time, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")
B = "http://127.0.0.1:8000"
def get(path, params=None):
    u = B + path + ("?" + urllib.parse.urlencode(params) if params else "")
    t0 = time.time()
    with urllib.request.urlopen(u, timeout=120) as r: d = json.loads(r.read().decode("utf-8"))
    return d, round((time.time()-t0)*1000)
d, ms = get("/api/vectors"); print("  /api/vectors  %sms  %s" % (ms, json.dumps(d.get("embeddings",{}).get("manifest",{}), ensure_ascii=False)[:150]))
for mode in ["keyword","hybrid"]:
    d, ms = get("/api/search", {"q":"数据法","mode":mode,"size":5})
    print()
    print("  === %s（%sms，共 %s 条）===" % (mode, ms, d["total"]))
    for i,it in enumerate(d["items"],1):
        t=it["title"]; ti=t.get("zh") or t.get("en") or "(无标题)"
        print("    %d. %s %-38s %s" % (i, it["country"].ljust(3), ti[:38], it.get("score")))
    if d.get("fusion"): print("    fusion: %s" % json.dumps(d["fusion"], ensure_ascii=False))
