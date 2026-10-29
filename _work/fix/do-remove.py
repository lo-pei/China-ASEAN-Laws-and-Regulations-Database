# -*- coding: utf-8 -*-
import io, os, json, shutil, sys, time
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(os.getcwd())
LAWS = os.path.join("prototype", "data", "laws")
OUT = os.path.join("_work", "removed-junk")
os.makedirs(OUT, exist_ok=True)
rows = json.load(io.open("_work/fix/junk-final.json", encoding="utf-8"))
report = {"removedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
          "reason": "条文数≤2 且总字数<3000，正文为采集元数据（原文标题/来源URL/SHA256/抓取日期/"
                    "“本文件为自动采集的元数据头”等），不含任何法条正文。",
          "count": len(rows), "items": rows}
moved = 0
for r in rows:
    src = os.path.join(LAWS, r["id"] + ".json")
    dst = os.path.join(OUT, r["id"] + ".json")
    if os.path.exists(src):
        shutil.move(src, dst)
        moved += 1
io.open(os.path.join(OUT, "REPORT.json"), "w", encoding="utf-8").write(
    json.dumps(report, ensure_ascii=False, indent=1))
print("  ✓ 已移出 %d 部到 _work/removed-junk/" % moved)
# 剩余法规数
n = len([f for f in os.listdir(LAWS) if f.endswith(".json") and f != "index.json"])
print("  剩余法规文件: %d" % n)
