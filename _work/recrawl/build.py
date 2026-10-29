# -*- coding: utf-8 -*-
"""
生成「需重抓原文」清单

分五类，按修复价值排序：
  P1 条文正文为空        —— 用户点进去看到空白，最严重
  P2 heading 是正文前缀   —— 抓取时把正文开头当成了标题（verify-data 一直在报警）
  P3 切分不足            —— 一条里塞了多个「第 N 条」
  P4 无中文标题          —— 标题为空或语言标错
  P5 无章结构但条文很多   —— 目录只能显示「全部条文」，条文越多影响越大

输出：
  _work/recrawl/tasks.csv    逐条任务（法规 ID、国别、优先级、原因、源地址、现状数字）
  _work/recrawl/summary.md   汇总
"""
import io
import json
import os
import re
import sys
import collections

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.getcwd()
LAWS = os.path.join(ROOT, "prototype/data/laws")
OUT = os.path.join(ROOT, "_work/recrawl")

ATEXT = lambda a: next((str(v) for v in (a.get("text") or {}).values() if v), "")
CN_NUM = {'零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
          '六': 6, '七': 7, '八': 8, '九': 9}
CN_UNIT = {'十': 10, '百': 100, '千': 1000}
RE_NO = re.compile(r"第\s*([一二三四五六七八九十百千零〇0-9]{1,6})\s*条")
RE_CH = re.compile(r"(?m)^\s*(?:第\s*[一二三四五六七八九十百零〇0-9]{1,4}\s*[编章部节]"
                   r"|PART\s+(?:[IVXLC]+|\d+)"
                   r"|CHAPTER\s+(?:[IVXLC]+|\d+)|Chapter\s+(?:[IVXLC]+|\d+))")


def cn2int(s):
    if s.isdigit():
        return int(s)
    tot = cur = 0
    for ch in s:
        if ch in CN_NUM:
            cur = CN_NUM[ch]
        elif ch in CN_UNIT:
            tot += (cur if cur else 1) * CN_UNIT[ch]
            cur = 0
        else:
            return None
    return tot + cur


# 真正的漏切：条号出现在行首，且后面跟着空白 + 标题（「第五条  公司章程要求」）
# 而「第一百零三条、第一百零四条、第一百零五条」这种是引用，条号后面直接是顿号，不算。
RE_HEADING_MARK = re.compile(
    r"(?m)^[ \t]*(?:第\s*[一二三四五六七八九十百千零〇0-9]{1,6}\s*条"
    r"|Article\s+\d{1,5}|Section\s+\d{1,5})[ \t\u3000]+\S")


def has_consecutive(text):
    """判定「一条里塞了多条」。
    第一版只看连续递增的条号，结果把「第 103 条、第 104 条、第 105 条」这种
    连续引用全判成漏切 —— 抽查 6 部里 5 部是误判。
    改为：必须同时满足
      ① 行首出现条号
      ② 条号后跟空白 + 标题（正文引用不会带标题）
      ③ 至少两处这样的行首条号（单处可能只是排版巧合）
    """
    marks = RE_HEADING_MARK.findall(text)
    if len(marks) < 2:
        return False
    return True


def title_text(o):
    T = o.get("title") or {}
    if not isinstance(T, dict):
        return str(T or "")
    return (T.get("zh") or T.get("en") or T.get("orig") or "").strip()


def src_url(o):
    s = o.get("source") or {}
    if isinstance(s, dict) and isinstance(s.get("url"), str) and s["url"].startswith("http"):
        return s["url"]
    ft = o.get("fullText") or {}
    if isinstance(ft, dict) and isinstance(ft.get("sourceUrl"), str) and ft["sourceUrl"].startswith("http"):
        return ft["sourceUrl"]
    return ""


rows = []
stats = collections.Counter()
for f in sorted(os.listdir(LAWS)):
    if not f.endswith(".json") or f == "index.json":
        continue
    try:
        o = json.load(io.open(os.path.join(LAWS, f), encoding="utf-8"))
    except Exception:
        continue
    lid = f[:-5]
    arts = o.get("articles") or []
    reasons, prio = [], 99

    # P1 空正文
    empty = sum(1 for a in arts if not ATEXT(a).strip())
    if empty:
        reasons.append("空正文条文 %d 条" % empty)
        prio = min(prio, 1)

    # P2 heading 是正文前缀
    pref = 0
    for a in arts:
        h = a.get("heading")
        h = (h.get("zh") or h.get("en") or "") if isinstance(h, dict) else str(h or "")
        body = ATEXT(a)
        if h and body and h.strip() and body.startswith(h.strip()) and len(body) > len(h) + 8:
            pref += 1
    if pref:
        reasons.append("heading 是正文前缀 %d 条" % pref)
        prio = min(prio, 2)

    # P3 切分不足
    badsplit = sum(1 for a in arts if has_consecutive(ATEXT(a)))
    if badsplit:
        reasons.append("切分不足 %d 条" % badsplit)
        prio = min(prio, 3)

    # P4 无标题
    if not title_text(o) and arts:
        reasons.append("无中文标题")
        prio = min(prio, 4)

    # P5 无章结构且条文多
    if arts and not any(a.get("chapter") for a in arts):
        if len(arts) >= 20:
            reasons.append("无章结构（%d 条）" % len(arts))
            prio = min(prio, 5)
        else:
            # 条文少的也记一笔，但不进主清单
            stats["no_chapter_small"] += 1

    if not reasons:
        stats["ok"] += 1
        continue

    stats["need_%d" % prio] += 1
    rows.append({
        "lawId": lid,
        "country": o.get("country") or "",
        "priority": prio,
        "reasons": "; ".join(reasons),
        "articles": len(arts),
        "chars": o.get("chars") or 0,
        "title": title_text(o)[:60],
        "sourceUrl": src_url(o),
        "level": o.get("level") or "",
        "coverage": o.get("coverage") or "",
    })

rows.sort(key=lambda r: (r["priority"], -r["articles"]))
os.makedirs(OUT, exist_ok=True)

# CSV（带 BOM，Excel 直接开不乱码）
import csv
with io.open(os.path.join(OUT, "tasks.csv"), "w", encoding="utf-8-sig", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["priority", "lawId", "country", "articles", "chars",
                                       "reasons", "title", "sourceUrl", "level", "coverage"])
    w.writeheader()
    for r in rows:
        w.writerow(r)

json.dump(rows, io.open(os.path.join(OUT, "tasks.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

# 汇总
byp = collections.Counter(r["priority"] for r in rows)
bynosrc = sum(1 for r in rows if not r["sourceUrl"])
bycountry = collections.Counter(r["country"] for r in rows)
lines = [
    "# 需重抓原文清单",
    "",
    "按优先级排列，源地址取自 `source.url`（没有的标为「无源地址」，需人工补）。",
    "",
    "| 优先级 | 判断依据 | 法规数 |",
    "| :--- | :--- | ---: |",
    "| P1 | 有条文正文为空 | %d |" % byp.get(1, 0),
    "| P2 | heading 是正文前缀（抓取时把正文开头当成标题） | %d |" % byp.get(2, 0),
    "| P3 | 切分不足（一条里塞了多个条号） | %d |" % byp.get(3, 0),
    "| P4 | 无中文标题 | %d |" % byp.get(4, 0),
    "| P5 | 无章结构且条文 ≥ 20（目录只能显示「全部条文」） | %d |" % byp.get(5, 0),
    "| — | **合计** | **%d** |" % len(rows),
    "",
    "- 有可访源地址: %d / %d（%.1f%%）" % (len(rows) - bynosrc, len(rows),
                                    (len(rows) - bynosrc) / max(1, len(rows)) * 100),
    "- 无源地址（需人工补）: %d 部" % bynosrc,
    "- 其余无需重抓: %d 部" % stats.get("ok", 0),
    "- 条文少于 20 且无章结构的: %d 部（影响小，暂不列入）" % stats.get("no_chapter_small", 0),
    "",
    "## 按国别",
    "",
    "| 国别 | 法规数 |",
    "| :--- | ---: |",
]
for cc, n in bycountry.most_common():
    lines.append("| %s | %d |" % (cc, n))
lines += ["", "## P1 / P2 / P3 逐条", "", "| 优先级 | 法规 ID | 国别 | 条款 | 原因 | 源地址 |", "| :--- | :--- | :--- | ---: | :--- | :--- |"]
for r in rows:
    if r["priority"] <= 3:
        u = r["sourceUrl"] or "（无）"
        lines.append("| P%d | %s | %s | %d | %s | %s |" % (
            r["priority"], r["lawId"], r["country"], r["articles"], r["reasons"], u[:80]))

io.open(os.path.join(OUT, "summary.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")

print("  需重抓合计: %d 部" % len(rows))
for p in [1, 2, 3, 4, 5]:
    print("    P%d: %d" % (p, byp.get(p, 0)))
print("  有源地址: %d / %d" % (len(rows) - bynosrc, len(rows)))
print("  无需重抓: %d 部" % stats.get("ok", 0))
print("  条文<20 且无章（不计）: %d 部" % stats.get("no_chapter_small", 0))
print("")
print("  已写出:")
print("    _work/recrawl/tasks.csv     逐条任务（%d 行）" % len(rows))
print("    _work/recrawl/tasks.json    同上，JSON")
print("    _work/recrawl/summary.md    汇总（含 P1-P3 逐条表）")
