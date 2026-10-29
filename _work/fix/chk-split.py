# -*- coding: utf-8 -*-
import io, os, json, sys
sys.stdout.reconfigure(encoding="utf-8")
o = json.load(io.open(os.path.join(os.getcwd(), "prototype/data/laws/MY-H075.json"), encoding="utf-8"))
arts = o.get("articles") or []
print("  条文数: %d  (articleCount=%s)" % (len(arts), o.get("articleCount")))
for a in arts[:5]:
    t = a.get("text") or {}
    body = next((str(v) for v in t.values() if v), "")
    print("  第%s条: %s" % (a.get("no"), body[:110].replace("\n", " ⏎ ")))
print("  ...")
for a in arts[-2:]:
    t = a.get("text") or {}
    body = next((str(v) for v in t.values() if v), "")
    print("  第%s条: %s" % (a.get("no"), body[:110].replace("\n", " ⏎ ")))
# 总字数对比
total = sum(len(next((str(v) for v in (a.get("text") or {}).values() if v), "")) for a in arts)
print("  切分后总字数: %d" % total)
