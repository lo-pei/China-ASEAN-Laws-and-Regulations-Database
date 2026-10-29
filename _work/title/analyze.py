# -*- coding: utf-8 -*-
"""分析待译标题（无中文者）的构词规律，评估可模板化的比例"""
import io, os, json, glob, re, sys
from collections import Counter

sys.stdout.reconfigure(encoding="utf-8")

LAWS = "prototype/data/laws"
rows = []
for f in glob.glob(LAWS + "/*.json"):
    if os.path.basename(f) == "index.json":
        continue
    try:
        o = json.load(io.open(f, encoding="utf-8"))
    except Exception:
        continue
    t = o.get("title") or {}
    if t.get("zh"):
        continue
    txt = t.get("en") or next((v for v in t.values() if v), None)
    if txt:
        rows.append((o.get("country"), txt.strip()))

print("  待译标题 %d 条" % len(rows))
print("")
print("=== 按国别 ===")
for c, n in Counter(r[0] for r in rows).most_common():
    print("  %-4s %5d" % (c, n))

print("")
print("=== 高频词（英文标题）===")
words = Counter()
for _, t in rows:
    for w in re.findall(r"[A-Za-z][A-Za-z\-']+", t):
        if len(w) > 2:
            words[w.lower()] += 1
for w, n in words.most_common(45):
    print("  %-18s %5d" % (w, n))

print("")
print("=== 词尾/结构模式 ===")
pats = Counter()
for _, t in rows:
    tl = t.strip()
    for suf, label in [("Act", "…Act"), ("Law", "…Law"), ("Code", "…Code"),
                       ("Order", "…Order"), ("Decree", "…Decree"),
                       ("Regulation", "…Regulation"), ("Ordinance", "…Ordinance"),
                       ("Rules", "…Rules"), ("Notification", "…Notification"),
                       ("Circular", "…Circular"), ("Amendment", "…Amendment")]:
        if re.search(r"\b" + suf + r"\b", tl):
            pats[label] += 1
            break
    else:
        pats["其他"] += 1
for k, n in pats.most_common():
    print("  %-16s %5d" % (k, n))

print("")
print("=== 各国样例（各 6 条）===")
for c in ["PH", "SG", "BN", "TH", "MY", "KH", "LA", "MM", "ID", "VN", "TL"]:
    s = [t for cc, t in rows if cc == c][:6]
    if not s:
        continue
    print("  --- " + c)
    for t in s:
        print("     " + t[:110])

print("")
print("=== 标题长度分布 ===")
lens = sorted(len(t) for _, t in rows)
print("  最短 %d / 中位 %d / 最长 %d / 平均 %.0f" % (
    lens[0], lens[len(lens) // 2], lens[-1], sum(lens) / len(lens)))
