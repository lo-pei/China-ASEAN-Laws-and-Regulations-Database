# -*- coding: utf-8 -*-
"""调研三件事"""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype", "data", "laws")

# ---------------- 1) 找出「正文是元数据侧车文件」的无效法规 ----------------
print("=" * 78)
print("  1) 无效法规排查（正文是 .meta.md 侧车元数据，不是法条）")
print("=" * 78)
JUNK_MARKERS = [
    "原文标题：", "原文标题:", "法案编号：", "SHA256:", "SHA256：",
    "抓取日期：", "页数：", "去重情况：", "官方来源：", "官方来源 URL",
    "无法内嵌前置元数据页", "侧车文件", "逐字照录未作改写",
]
hits = []
for f in os.listdir(LAWS):
    if not f.endswith(".json") or f == "index.json":
        continue
    lid = f[:-5]
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    arts = o.get("articles") or []
    if not arts:
        continue
    # 统计有多少条正文含元数据标记
    bad = 0
    total_chars = 0
    for a in arts:
        t = a.get("text") or {}
        blob = " ".join(str(v) for v in t.values() if v)
        total_chars += len(blob)
        if sum(1 for m in JUNK_MARKERS if m in blob) >= 2:
            bad += 1
    if bad and bad >= len(arts) * 0.6:
        title = o.get("title") or {}
        zh = (title.get("zh") if isinstance(title, dict) else None) or lid
        hits.append({"id": lid, "articles": len(arts), "bad": bad,
                     "chars": total_chars, "title": str(zh)[:60],
                     "country": o.get("country")})

print("  命中 %d 部（正文 ≥60%% 条含元数据标记）：" % len(hits))
for h in sorted(hits, key=lambda x: -x["articles"])[:20]:
    print("    %-28s %-3s 条文 %4d  含元数据 %4d  共 %7d 字  %s" % (
        h["id"], h["country"], h["articles"], h["bad"], h["chars"], h["title"]))

json.dump(hits, io.open(os.path.join(ROOT, "_work/fix/junk-laws.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

# ---------------- 2) 引用按钮现状 ----------------
print("")
print("=" * 78)
print("  2) 引用按钮现状（law.js / views.css）")
print("=" * 78)
lawjs = io.open(os.path.join(ROOT, "prototype/assets/js/views/law.js"), encoding="utf-8").read()
for m in re.finditer(r"[^\n]*article__cite[^\n]*", lawjs):
    print("  law.js: " + m.group(0).strip()[:110])
css = io.open(os.path.join(ROOT, "prototype/assets/css/views.css"), encoding="utf-8").read()
for m in re.finditer(r"[^\n]*\.article__cite[^{]*\{[^}]*\}", css):
    print("  css: " + re.sub(r"\s+", " ", m.group(0))[:140])

# ---------------- 3) 条文渲染函数 ----------------
print("")
print("=" * 78)
print("  3) 条文渲染（paraHtml）与断行情况")
print("=" * 78)
i = lawjs.find("function paraHtml")
print("  " + re.sub(r"\s+", " ", lawjs[i:i+700])[:640])
