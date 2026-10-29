# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
try:
    d = json.load(io.open("_work/crawl/batch-result.json", encoding="utf-8"))
    print("  采纳 %d / 拒绝 %d / 失败 %d" % (len(d["ok"]), len(d["rejected"]), len(d["failed"])))
    if d["failed"]:
        print("  失败样例:")
        for f in d["failed"][:5]:
            print("    %-14s %s" % (f["lawId"], f["error"][:80]))
except FileNotFoundError:
    print("  批量结果文件尚未生成（可能还在跑）")
import os
print("  ok 目录: %d 部" % len([f for f in os.listdir("_work/crawl/ok") if f.endswith(".json")]))
