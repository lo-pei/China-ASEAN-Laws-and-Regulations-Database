# -*- coding: utf-8 -*-
import sys, json, time, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding="utf-8")
B = "http://127.0.0.1:8000"

def get(path, params):
    url = B + path + "?" + urllib.parse.urlencode(params)
    t0 = time.time()
    with urllib.request.urlopen(url, timeout=90) as r:
        d = json.loads(r.read().decode("utf-8"))
    return d, round((time.time() - t0) * 1000)

def title_of(it):
    t = it.get("title") or {}
    return (t.get("zh") or t.get("en") or t.get("orig") or "(无标题)")

for mode in ["keyword", "semantic"]:
    d, ms = get("/api/search", {"q": "数据法", "mode": mode, "size": 6})
    print("=== 数据法 / %s   共 %s 条  %sms ===" % (mode, d["total"], ms))
    for i, it in enumerate(d["items"], 1):
        print("  %d. %s %-36s score=%s" % (i, it["country"].ljust(3), title_of(it)[:36], it["score"]))
    print()

print("=== 其它查询（semantic）===")
for q in ["越南外商投资", "泰国劳动法", "缅甸仲裁", "个人信息保护", "民法典"]:
    d, ms = get("/api/search", {"q": q, "mode": "semantic", "size": 3})
    print("  「%s」共 %s 条 %sms" % (q, d["total"], ms))
    for it in d["items"]:
        print("      %s %-34s %s" % (it["country"].ljust(3), title_of(it)[:34], it["score"]))

print()
print("=== POST /api/qa（数据法）===")
body = json.dumps({"question": "数据法", "topk": 4}).encode("utf-8")
req = urllib.request.Request(B + "/api/qa", data=body, headers={"Content-Type": "application/json"})
t0 = time.time()
with urllib.request.urlopen(req, timeout=120) as r:
    d = json.loads(r.read().decode("utf-8"))
print("  %sms  citations=%s  mode=%s" % (round((time.time() - t0) * 1000), len(d["citations"]), d["mode"]))
for c in d["citations"][:8]:
    print("      %s %-30s 第%s条" % (c["country"].ljust(3), title_of(c)[:30], c["no"]))
