# -*- coding: utf-8 -*-
"""看清 39 部无效法规的完整清单 + paragraphHtml 的换行处理"""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()

print("=" * 78)
print("  39 部无效法规完整清单")
print("=" * 78)
hits = json.load(io.open(os.path.join(ROOT, "_work/fix/junk-laws.json"), encoding="utf-8"))
by_c = {}
for h in hits:
    by_c.setdefault(h["country"], []).append(h)
for c in sorted(by_c):
    print("  %s (%d 部):" % (c, len(by_c[c])))
    for h in by_c[c]:
        print("    %-16s 条文 %2d  %5d 字  %s" % (h["id"], h["articles"], h["chars"], h["title"][:44]))

print("")
print("  总计 %d 部，涉及 %d 个字" % (len(hits), sum(h["chars"] for h in hits)))

# 确认马来西亚那两部
print("")
print("  马来西亚相关：")
for h in hits:
    if h["country"] == "MY":
        print("    %-16s 条文 %2d  %5d 字  %s" % (h["id"], h["articles"], h["chars"], h["title"][:50]))
# 也搜「个人资料保护法」
print("")
print("  全库搜「个人资料保护法 / PERSONAL DATA PROTECTION ACT 2010」：")
LAWS = os.path.join(ROOT, "prototype", "data", "laws")
found = []
for f in os.listdir(LAWS):
    if not f.endswith(".json") or f == "index.json":
        continue
    o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    T = o.get("title") or {}
    blob = " ".join(str(v) for v in (T.values() if isinstance(T, dict) else [T]) if v)
    if "个人资料保护" in blob or "PERSONAL DATA PROTECTION ACT 2010" in blob.upper():
        arts = o.get("articles") or []
        # 看正文是否是元数据
        first = ""
        if arts:
            t = arts[0].get("text") or {}
            first = next((str(v) for v in t.values() if v), "")
        isjunk = sum(1 for m in ["原文标题", "SHA256", "抓取日期", "法案编号"] if m in first) >= 2
        found.append((f[:-5], o.get("country"), len(arts), len(first), isjunk, blob[:50]))
for x in found:
    print("    %-22s %-3s 条文 %3d  首条 %5d 字  %s  %s" % (
        x[0], x[1], x[2], x[3], "✗无效" if x[4] else "✓有正文", x[5]))

# ---------------------------------------------------------------- paragraphHtml
print("")
print("=" * 78)
print("  U().paragraphHtml 实现（决定断行怎么处理）")
print("=" * 78)
u = io.open(os.path.join(ROOT, "prototype/assets/js/core/util.js"), encoding="utf-8").read()
i = u.find("paragraphHtml")
print(re.sub(r"\n\s*\n", "\n", u[max(0, i - 400):i + 1400])[:1700])
