# -*- coding: utf-8 -*-
import io, json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
rows = json.load(io.open("_work/title/worklist.json", encoding="utf-8"))
# 排除：菲国「私人特许经营权 / 建校 / 建医院 / 授予个人公民身份」类法案
EXCL = re.compile(r"\b(franchise|citizenship to|high school|elementary school|hospital|barangay|appropriating funds|appropriating the sum)\b", re.I)
HIGH = {"数据/隐私","数字/AI","竞争/消保","知识产权","投资/经贸","合同/商事","争议解决","破产","劳动","金融","公司/企业"}
sel = [r for r in rows
       if set(r["tags"]) & HIGH
       and not EXCL.search(r["src"])
       and len(r["src"]) <= 190]
# 去重（同标题不同 id 只保留条数最多的）
seen = {}
for r in sel:
    k = r["src"].lower()
    if k not in seen or r["articles"] > seen[k]["articles"]:
        seen[k] = r
sel = sorted(seen.values(), key=lambda r: (-r["score"], -r["articles"]))
print("  高价值可译标题：%d 条" % len(sel))
for i, r in enumerate(sel[:150], 1):
    print("%d|%s|%s" % (i, r["id"], r["src"]))
json.dump(sel[:150], io.open("_work/title/batch1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
