# -*- coding: utf-8 -*-
"""检查官方 PDF 文本层的覆盖情况：哪些条号在目录中有但 PDF 标记中缺失"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
FINAL = os.path.join(HERE, "final2")

for lawid in ["ID-SCIENCE-2019", "ID-LABOR-PP-2021", "ID-ETRANSACTION-2019", "ID-INVEST-2007",
              "ID-COMPANY-2007", "ID-LABOR-2003", "ID-ARBITRATION-1999", "ID-TRADE-2014"]:
    d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
    have = {a["label"] for a in d["articles"]}
    order = set(d["order"])
    miss = sorted(order - have, key=lambda x: (int(re.match(r"\d+", x).group()), x))
    print("%-22s 目录 %3d 已有 %3d 缺 %s" % (lawid, len(order), len(have), miss))
