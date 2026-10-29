# -*- coding: utf-8 -*-
"""列出 id.js 中可能混入的页码/散页噪声行"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FINAL = os.path.join(HERE, "final2")
LAWS = ["ID-INVEST-2007", "ID-COMPANY-2007", "ID-LABOR-2003", "ID-ARBITRATION-1999",
        "ID-TRADE-2014", "ID-LABOR-PP-2021", "ID-ETRANSACTION-2019", "ID-SCIENCE-2019"]
BAD = [
    (re.compile(r"^\s*-?\s*\d{1,3}\s*-?\s*$"), "孤立页码"),
    (re.compile(r"^\s*\d{1,3}\s*$"), "孤立数字"),
    (re.compile(r"^\s*SK No"), "SK 编号"),
    (re.compile(r"^\s*(PRESIDEN|REPUBLIK INDONESIA|FRESIDEN|REPUEUK|REPUBUK|TNDONESIA)"), "页眉"),
    (re.compile(r"^\s*(Agar|Agar setizrp|Agar setia p)\s*\.\.\.\s*$"), "残留省略"),
    (re.compile(r"\bAgar\b\s*\.\.\."), "残留 Agar..."),
]
for law in LAWS:
    d = json.load(open(os.path.join(FINAL, law + ".json"), encoding="utf-8"))
    for a in d["articles"]:
        for i, p in enumerate(a["paragraphs"]):
            for rx, why in BAD:
                if rx.search(p):
                    print("%-22s Pasal %-5s [%s] %s :: %r" % (law, a["label"], why, a.get("source"), p[:90]))
                    break
