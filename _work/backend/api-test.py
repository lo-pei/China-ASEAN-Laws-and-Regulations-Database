# -*- coding: utf-8 -*-
import sys, json, time, urllib.request
sys.stdout.reconfigure(encoding="utf-8")
B = "http://127.0.0.1:8000"
def get(p):
    t0=time.time()
    with urllib.request.urlopen(B+p, timeout=60) as r:
        d=json.loads(r.read().decode("utf-8"))
    return d, round((time.time()-t0)*1000)

print("=== /api/health ===")
try:
    d,ms = get("/api/health"); print("  %sms  %s" % (ms, json.dumps(d, ensure_ascii=False)[:160]))
except Exception as e:
    print("  ✗ %s" % e); sys.exit(1)

print()
print("=== /api/stats ===")
d,ms = get("/api/stats")
print("  %sms  法规 %s / 条文 %s / 词项 %s" % (ms, d["laws"], d["articles"], d["terms"]))
print("  国别: %s" % json.dumps(d["countries"], ensure_ascii=False)[:220])

print()
print("=== /api/search?q=民法典 ===")
d,ms = get("/api/search?q=%E6%B0%91%E6%B3%95%E5%85%B8&size=5")
print("  %sms  共 %s 条" % (ms, d["total"]))
for i,it in enumerate(d["items"],1):
    t=it["title"]
    print("    %d. %-3s %-34s score=%s" % (i, it["country"], (t.get("zh") or t.get("en") or "")[:34], it["score"]))

print()
print("=== /api/search?q=数据法 ===")
d,ms = get("/api/search?q=%E6%95%B0%E6%8D%AE%E6%B3%95&size=5")
print("  %sms  共 %s 条" % (ms, d["total"]))
for i,it in enumerate(d["items"],1):
    t=it["title"]
    print("    %d. %-3s %-34s score=%s" % (i, it["country"], (t.get("zh") or t.get("en") or "")[:34], it["score"]))

print()
print("=== /api/laws/CN-CIVILCODE-2020 ===")
d,ms = get("/api/laws/CN-CIVILCODE-2020")
print("  %sms  %s / 条文 %s" % (ms, (d["title"].get("zh") or "")[:30], len(d["articles"])))
if d["articles"]:
    a=d["articles"][0]
    print("    第一条: %s" % (a["text"].get("zh") or "")[:70])

print()
print("=== /api/laws?country=MM&size=3 ===")
d,ms = get("/api/laws?country=MM&size=3")
print("  %sms  共 %s 条" % (ms, d["total"]))
for it in d["items"]:
    print("    %s  %s" % (it["id"], (it["title"].get("zh") or "")[:30]))
