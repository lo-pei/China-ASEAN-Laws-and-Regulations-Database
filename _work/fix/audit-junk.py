# -*- coding: utf-8 -*-
"""
收紧无效法规判定，并逐条审计

强信号（任一命中即判无效，这些字符串只可能出现在采集元数据里）：
  本文件为自动采集的元数据头 / 原始文件未被改写 / 无法内嵌前置元数据页 /
  侧车文件 / 逐字照录未作改写
次级信号（需 ≥3 个才判无效）：
  原文标题 / 法案编号 / SHA256 / 抓取日期 / 页数 / 去重情况 / 官方来源 …
"""
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype", "data", "laws")

STRONG = [
    "本文件为自动采集的元数据头",
    "原始文件未被改写",
    "无法内嵌前置元数据页",
    "侧车文件",
    "逐字照录未作改写",
    "逐字照录于同目录下的原始文件",
]
FIELDS = [
    "原文标题", "法案编号", "SHA256", "抓取日期", "页数", "去重情况",
    "官方来源", "中文译名", "英文译名", "来源URL", "颁布日期", "生效日期",
    "修订日期", "官方页面标注标题",
]


def article_text(a):
    t = a.get("text") or {}
    return " ".join(str(v) for v in t.values() if v)


rows = []
for f in sorted(os.listdir(LAWS)):
    if not f.endswith(".json") or f == "index.json":
        continue
    lid = f[:-5]
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    arts = o.get("articles") or []
    if not arts or len(arts) > 2:
        continue
    blob = " ".join(article_text(a) for a in arts)
    if len(blob) >= 3000:
        continue
    ns = sum(1 for m in STRONG if m in blob)
    nf = sum(1 for m in FIELDS if m in blob)
    if ns == 0 and nf < 3:
        continue
    T = o.get("title") or {}
    zh = (T.get("zh") if isinstance(T, dict) else None) or lid
    rows.append({"id": lid, "country": o.get("country"), "articles": len(arts),
                 "chars": len(blob), "strong": ns, "fields": nf,
                 "title": str(zh)[:50], "head": blob[:110].replace("\n", " ")})

print("  判定无效: %d 部" % len(rows))
by_c = {}
for r in rows:
    by_c.setdefault(r["country"], []).append(r)
print("  按国别: %s" % {k: len(v) for k, v in sorted(by_c.items())})
print("")
print("  === 逐条审计（strong=强信号数 fields=字段标记数）===")
for r in rows:
    print("    %-16s %-3s 条%d %4d字  s=%d f=%-2d  %s" % (
        r["id"], r["country"], r["articles"], r["chars"], r["strong"], r["fields"], r["title"]))
    print("        头: " + r["head"])

json.dump(rows, io.open(os.path.join(ROOT, "_work/fix/junk-final.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("")
print("  待删清单已写入 _work/fix/junk-final.json")
