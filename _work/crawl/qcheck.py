# -*- coding: utf-8 -*-
import io, json, os, re, sys, collections
sys.stdout.reconfigure(encoding="utf-8")
OK = "_work/crawl/ok"
fs = sorted(os.listdir(OK))
print("  已采纳 %d 部，抽查 4 部" % len(fs))
for f in fs[:4]:
    p = json.load(io.open(os.path.join(OK, f), encoding="utf-8"))
    arts = p["articles"]
    print("=" * 70)
    print("  %s  %d 条  章 %d" % (p["lawId"], len(arts), len(p.get("chapters") or [])))
    # 条号连续性
    nos = [a["no"] for a in arts]
    gaps = [(nos[i], nos[i+1]) for i in range(len(nos)-1) if nos[i+1] != nos[i]+1]
    print("    条号: %d…%d  跳号 %d 处 %s" % (nos[0], nos[-1], len(gaps), gaps[:3]))
    # 长度分布
    L = [len(a["text"]) for a in arts]
    print("    正文长度: 最短 %d / 中位 %d / 最长 %d" % (min(L), sorted(L)[len(L)//2], max(L)))
    # heading 比例
    wh = sum(1 for a in arts if a.get("heading"))
    print("    有 heading: %d / %d" % (wh, len(arts)))
    # chapter 比例
    wc = sum(1 for a in arts if a.get("chapter"))
    print("    有 chapter: %d / %d" % (wc, len(arts)))
    # 抽一条
    a = arts[len(arts)//2]
    print("    样本 第%s条 章=%r" % (a["no"], (a.get("chapter") or "")[:50]))
    print("      heading=%r" % (a.get("heading") or "")[:50])
    print("      正文: %r" % a["text"][:150].replace("\n", " ⏎ "))
