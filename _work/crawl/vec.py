# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
m = json.load(io.open("backend/data/vectors/manifest.json", encoding="utf-8"))
print("  向量清单: law %s / article %s" % (m.get("lawCount"), m.get("articleCount")))
print("  当前 DB: 法规 18785 / 条文 339351")
