# -*- coding: utf-8 -*-
"""输出指定法规的条文首尾与来源分布，供人工抽查"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FINAL = os.path.join(HERE, "final2")
for lawid in sys.argv[1:]:
    d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
    arts = d["articles"]
    fill = [a["label"] for a in arts if a.get("source") == "official-pdf"]
    print("=" * 100)
    print(lawid, "条数", len(arts), "| 官方 PDF 补录:", fill)
    print("--- 第 1 条 ---")
    print(arts[0]["paragraphs"][0][:600])
    print("--- 末条 (%s) ---" % arts[-1]["label"])
    print(arts[-1]["paragraphs"][0][:400])
    print("--- 抽查官方 PDF 补录条文示例 ---")
    for lb in fill[:3]:
        a = [x for x in arts if x["label"] == lb][0]
        print("  Pasal %s: %s" % (lb, a["paragraphs"][0][:220].replace("\n", " / ")))
