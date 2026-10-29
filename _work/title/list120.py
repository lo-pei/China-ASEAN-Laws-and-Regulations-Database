# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
rows = json.load(io.open("_work/title/worklist.json", encoding="utf-8"))
sel = rows[:120]
for i, r in enumerate(sel, 1):
    print("%d|%s|%s" % (i, r["id"], r["src"].replace("\n", " ")))
