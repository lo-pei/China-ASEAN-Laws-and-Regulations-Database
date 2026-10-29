# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
o = json.load(io.open("prototype/data/laws/PH-H359.json", encoding="utf-8"))
arts = o.get("articles") or []
print("  条文 %d  chars %d  重抓标记: %s" % (len(arts), o.get("chars", 0), o.get("recrawled", "-")[:70]))
import collections
ch = collections.Counter()
for a in arts:
    c = a.get("chapter") or {}
    ch[(c.get("en") if isinstance(c, dict) else c) or "(无)"] += 1
print("  章分组 %d 个:" % len(ch))
for k, v in list(ch.items())[:6]:
    print("    %-52s %d 条" % (k or "(无)", v))
a = arts[0]
print("  第1条 heading=%r" % ((a.get("heading") or {}).get("en") or ""))
print("  正文: %r" % list(a["text"].values())[0][:120])
