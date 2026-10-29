# -*- coding: utf-8 -*-
"""找出「整部法被塞进 1 条」的法规，并看能否按条文标记重新切分"""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype", "data", "laws")


def article_text(a):
    t = a.get("text") or {}
    return " ".join(str(v) for v in t.values() if v)


# 单条且超长的法规
cand = []
for f in sorted(os.listdir(LAWS)):
    if not f.endswith(".json") or f == "index.json":
        continue
    lid = f[:-5]
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    arts = o.get("articles") or []
    if len(arts) != 1:
        continue
    blob = article_text(arts[0])
    if len(blob) < 3000:
        continue
    T = o.get("title") or {}
    zh = (T.get("zh") if isinstance(T, dict) else None) or lid
    # 估计内部能切出多少条
    n_zh = len(re.findall(r"第[一二三四五六七八九十百千0-9]+条", blob))
    n_sec = len(re.findall(r"(?m)^\s*Section\s+\d+", blob))
    n_num = len(re.findall(r"(?m)^\s*\d+\.\s", blob))
    n_part = len(re.findall(r"第[一二三四五六七八九十]+部分", blob))
    cand.append({"id": lid, "country": o.get("country"), "chars": len(blob),
                 "title": str(zh)[:52], "第N条": n_zh, "Section": n_sec,
                 "数字条": n_num, "第N部分": n_part})

cand.sort(key=lambda x: -x["chars"])
print("  单条且 >3000 字的法规: %d 部" % len(cand))
print("  %-18s %-3s %8s %6s %8s %6s %6s  %s" % ("id", "cc", "字数", "第N条", "Section", "数字", "部分", "标题"))
for c in cand[:40]:
    print("  %-18s %-3s %8d %6d %8d %6d %6d  %s" % (
        c["id"], c["country"], c["chars"], c["第N条"], c["Section"], c["数字条"], c["第N部分"], c["title"]))
print("  ... 共 %d 部" % len(cand))

json.dump(cand, io.open(os.path.join(ROOT, "_work/fix/single-article-laws.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

# 看 MY-H075 与 MY-PDPA-2010 的对比
print("")
print("=" * 78)
print("  MY-H075（截图里「共 1 条」那部）正文前 600 字")
print("=" * 78)
p = os.path.join(LAWS, "MY-H075.json")
if os.path.exists(p):
    o = json.load(io.open(p, encoding="utf-8"))
    a = (o.get("articles") or [{}])[0]
    blob = article_text(a)
    print("  条数 1，字数 %d" % len(blob))
    print("  " + blob[:600].replace("\n", " ⏎ "))

print("")
print("=" * 78)
print("  MY-PDPA-2010（正确分条的那部）前 3 条")
print("=" * 78)
p2 = os.path.join(LAWS, "MY-PDPA-2010.json")
if os.path.exists(p2):
    o2 = json.load(io.open(p2, encoding="utf-8"))
    for a in (o2.get("articles") or [])[:3]:
        print("  第%s条: %s" % (a.get("no"), article_text(a)[:150].replace("\n", " ⏎ ")))
