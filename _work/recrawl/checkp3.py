# -*- coding: utf-8 -*-
import io, json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
CN_NUM = {'零':0,'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9}
CN_UNIT = {'十':10,'百':100,'千':1000}
RE_NO = re.compile(r"第\s*([一二三四五六七八九十百千零〇0-9]{1,6})\s*条")
def cn2int(s):
    if s.isdigit(): return int(s)
    tot = cur = 0
    for ch in s:
        if ch in CN_NUM: cur = CN_NUM[ch]
        elif ch in CN_UNIT: tot += (cur if cur else 1) * CN_UNIT[ch]; cur = 0
        else: return None
    return tot + cur
def atext(a):
    return next((str(v) for v in (a.get("text") or {}).values() if v), "")
rows = json.load(io.open("_work/recrawl/tasks.json", encoding="utf-8"))
p3 = [r for r in rows if r["priority"] == 3]
print("  P3 共 %d 部，抽查 6 部的具体条文：" % len(p3))
for r in p3[:6]:
    o = json.load(io.open("prototype/data/laws/%s.json" % r["lawId"], encoding="utf-8"))
    for a in (o.get("articles") or []):
        body = atext(a)
        expect, run = None, 0
        hit = None
        for m in RE_NO.finditer(body):
            n = cn2int(m.group(1))
            if n is None: continue
            if expect is not None and n == expect: run += 1
            else: run = 1
            expect = n + 1
            if run >= 3:
                hit = m
                break
        if hit:
            st = max(0, hit.start() - 90)
            print("  ---- %s 第%s条 ----" % (r["lawId"], a.get("no")))
            print("     …%s…" % body[st:hit.end()+40].replace("\n", " ⏎ ")[:220])
            break
