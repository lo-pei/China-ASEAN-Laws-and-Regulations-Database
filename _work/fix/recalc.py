# -*- coding: utf-8 -*-
import io, os, json, sys
sys.stdout.reconfigure(encoding="utf-8")
LAWS = os.path.join(os.getcwd(), "prototype/data/laws")
fixed = 0
for f in os.listdir(LAWS):
    if not f.endswith(".json") or f == "index.json":
        continue
    p = os.path.join(LAWS, f)
    o = json.load(io.open(p, encoding="utf-8"))
    arts = o.get("articles") or []
    total = 0
    for a in arts:
        t = a.get("text") or {}
        total += sum(len(str(v)) for v in t.values() if v)
    if o.get("chars") != total or o.get("articleCount") != len(arts):
        o["chars"] = total
        o["articleCount"] = len(arts)
        io.open(p, "w", encoding="utf-8").write(json.dumps(o, ensure_ascii=False, indent=1))
        fixed += 1
print("  已重算 chars / articleCount: %d 部" % fixed)
