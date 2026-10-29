# -*- coding: utf-8 -*-
"""从 final2 中删除自 OCR 严重损坏条文（Pasal 1 of ID-SCIENCE-2019）"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FINAL = os.path.join(HERE, "final2")
p = os.path.join(FINAL, "ID-SCIENCE-2019.json")
d = json.load(open(p, encoding="utf-8"))
before = len(d["articles"])
d["articles"] = [a for a in d["articles"] if not (a["label"] == "1" and a.get("source") == "official-pdf")]
json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ID-SCIENCE-2019:", before, "->", len(d["articles"]), "labels",
      [a["label"] for a in d["articles"]][:5], "...")
