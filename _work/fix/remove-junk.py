# -*- coding: utf-8 -*-
"""
删除「正文是 .meta.md 侧车元数据」的无效法规

判定（三条同时满足，宁严不宽）：
  1) 条文数 ≤ 2
  2) 全部条文正文合计 < 3000 字
  3) 正文里出现 ≥2 个元数据标记（原文标题 / 法案编号 / SHA256 / 抓取日期 / 侧车文件 …）

处置：
  · 从 prototype/data/laws/ 移出到 _work/removed-junk/
  · 从 cn-catalog / intl-catalog 中移除（下次 fix-catalogs.js 会自动对齐）
  · 写 _work/removed-junk/REPORT.json 记录原因，可回溯

用法：python _work/fix/remove-junk.py [--dry]
"""
import io
import json
import os
import shutil
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype", "data", "laws")
OUT = os.path.join(ROOT, "_work", "removed-junk")
DRY = "--dry" in sys.argv

MARKERS = [
    "原文标题：", "原文标题:", "法案编号：", "法案编号:", "SHA256:", "SHA256：",
    "抓取日期：", "抓取日期:", "页数：", "页数:", "去重情况：", "去重情况:",
    "官方来源：", "官方来源 URL", "无法内嵌前置元数据页", "侧车文件",
    "逐字照录未作改写", "中文译名：", "英文译名：", "来源URL：", "颁布日期：",
    "生效日期：", "修订日期：", "版本：", "语种：", "备注：",
    # Markdown 表格形式的元数据头（另一批采集产物的写法）
    "本文件为自动采集的元数据头", "原始文件未被改写", "逐字照录于同目录下的原始文件",
    "| 原文标题 |", "| 官方页面标注标题 |", "官方页面标注标题", "| 项目 | 内容 |",
    "| 中文译名 |", "| 英文译名 |", "| 法律领域 |", "| 颁布机构 |",
]


def article_text(a):
    t = a.get("text") or {}
    return " ".join(str(v) for v in t.values() if v)


def main():
    os.makedirs(OUT, exist_ok=True)
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
        if not arts or len(arts) > 2:
            continue
        blob = " ".join(article_text(a) for a in arts)
        if len(blob) >= 3000:
            continue
        nmarks = sum(1 for m in MARKERS if m in blob)
        if nmarks < 2:
            continue
        T = o.get("title") or {}
        zh = (T.get("zh") if isinstance(T, dict) else None) or (T.get("en") if isinstance(T, dict) else None) or lid
        cand.append({"id": lid, "country": o.get("country"), "articles": len(arts),
                     "chars": len(blob), "marks": nmarks, "title": str(zh)[:70],
                     "file": f})

    print("  判定为「元数据侧车文件」的无效法规: %d 部" % len(cand))
    by_c = {}
    for c in cand:
        by_c.setdefault(c["country"], []).append(c)
    for k in sorted(by_c):
        print("    %s: %d 部" % (k, len(by_c[k])))
    print("")
    for c in cand:
        print("    %-16s %-3s 条文 %d  %4d 字  标记 %d  %s" % (
            c["id"], c["country"], c["articles"], c["chars"], c["marks"], c["title"]))

    if DRY:
        print("")
        print("  （--dry 试运行，未改动）")
        return

    report = {"removedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
              "reason": "条文正文是 .meta.md 侧车元数据（来源/编号/SHA256/抓取日期等），"
                        "不含任何法条正文；条文数≤2 且总字数<3000，判定为无效记录。",
              "count": len(cand), "items": cand}
    moved = 0
    for c in cand:
        src = os.path.join(LAWS, c["file"])
        dst = os.path.join(OUT, c["file"])
        if os.path.exists(src):
            shutil.move(src, dst)
            moved += 1
    io.open(os.path.join(OUT, "REPORT.json"), "w", encoding="utf-8").write(
        json.dumps(report, ensure_ascii=False, indent=1))
    print("")
    print("  ✓ 已移出 %d 部到 _work/removed-junk/" % moved)
    print("  报告: _work/removed-junk/REPORT.json")


if __name__ == "__main__":
    main()
