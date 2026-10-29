# -*- coding: utf-8 -*-
import io, json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
rows = json.load(io.open("_work/recrawl/tasks.json", encoding="utf-8"))
p3 = [r for r in rows if r["priority"] == 3]
print("=== 收紧后 P3 = %d 部，抽查前 5 ===" % len(p3))
for r in p3[:5]:
    print("  %-22s %-3s 条文 %4d  %s" % (r["lawId"], r["country"], r["articles"], r["reasons"]))
print()
print("=== 抽样看一处实际命中的行首条号 ===")
RE = re.compile(r"(?m)^[ \t]*(?:第\s*[一二三四五六七八九十百千零〇0-9]{1,6}\s*条|Article\s+\d{1,5}|Section\s+\d{1,5})[ \t\u3000]+\S")
for r in p3[:3]:
    o = json.load(io.open("prototype/data/laws/%s.json" % r["lawId"], encoding="utf-8"))
    for a in (o.get("articles") or []):
        body = next((str(v) for v in (a.get("text") or {}).values() if v), "")
        ms = list(RE.finditer(body))
        if len(ms) >= 2:
            m = ms[0]
            print("  ---- %s 第%s条（命中 %d 处行首条号）----" % (r["lawId"], a.get("no"), len(ms)))
            print("     …%s…" % body[max(0,m.start()-50):m.end()+60].replace("\n", " ⏎ ")[:200])
            break
