# -*- coding: utf-8 -*-
import io, json, sys
sys.stdout.reconfigure(encoding="utf-8")
rows = json.load(io.open("_work/recrawl/tasks.json", encoding="utf-8"))
print("=== P1（条文正文为空）%d 部 ===" % sum(1 for r in rows if r["priority"] == 1))
for r in rows:
    if r["priority"] == 1:
        print("  %-22s %-3s 条文 %3d  %s" % (r["lawId"], r["country"], r["articles"], r["reasons"]))
        print("     标题: %s" % (r["title"] or "(空)"))
        print("     源:   %s" % (r["sourceUrl"] or "(无)"))
print()
print("=== P2 前 8 部 ===")
n = 0
for r in rows:
    if r["priority"] == 2:
        print("  %-22s %-3s 条文 %4d  %s" % (r["lawId"], r["country"], r["articles"], r["reasons"]))
        n += 1
        if n >= 8: break
print()
print("=== P3 前 8 部 ===")
n = 0
for r in rows:
    if r["priority"] == 3:
        print("  %-22s %-3s 条文 %4d  %s" % (r["lawId"], r["country"], r["articles"], r["reasons"]))
        n += 1
        if n >= 8: break
print()
print("=== 有源地址的分布（按国别/优先级）===")
import collections
c = collections.Counter()
for r in rows:
    if r["sourceUrl"]:
        c[(r["priority"], r["country"])] += 1
for k in sorted(c):
    print("  P%d %-3s %d" % (k[0], k[1], c[k]))
