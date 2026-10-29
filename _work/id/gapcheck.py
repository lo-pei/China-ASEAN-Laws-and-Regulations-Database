# -*- coding: utf-8 -*-
"""列出 final2 中各法的条号，检查缺号"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
FINAL = os.path.join(HERE, "final2")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")

for lawid in ["ID-TRADE-2014", "ID-ETRANSACTION-2019", "ID-SCIENCE-2019"]:
    d = json.load(open(os.path.join(FINAL, lawid + ".json"), encoding="utf-8"))
    labels = [a["label"] for a in sorted(d["articles"],
              key=lambda x: (int(re.match(r"\d+", x["label"]).group()), x["label"]))]
    nums = [int(re.match(r"\d+", l).group()) for l in labels]
    gaps = [(nums[i], nums[i + 1]) for i in range(len(nums) - 1) if nums[i + 1] != nums[i] + 1]
    print("=" * 80)
    print(lawid, "条数", len(labels), "首", labels[:3], "末", labels[-3:])
    print("  缺号区间:", gaps)
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    have = set(labels)
    for a, b in gaps:
        for n in range(a + 1, b):
            lbl = str(n)
            pat = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+%d[ \t]*$" % n)
            cnt = len(pat.findall(t))
            print("     Pasal %-4s 在官方PDF中出现 %d 次" % (lbl, cnt))
