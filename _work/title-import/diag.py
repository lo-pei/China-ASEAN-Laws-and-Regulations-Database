# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
TARGETS = ["An Act Enhancing Animal Industry Development",
           "Providing for a Comprehensive Legal Framework for Nuclear",
           "An Act Granting the Pampanga Rural Electric Service"]
found = []
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f)=="index.json": continue
    o = json.load(io.open(f, encoding="utf-8"))
    t = o.get("title") or {}
    zh = t.get("zh") or ""
    for tg in TARGETS:
        if tg.lower() in zh.lower() or tg.lower() in (t.get("en") or "").lower():
            found.append((o["id"], t.get("zh"), t.get("en")))
            break
print("  命中 %d 部" % len(found))
for lid, zh, en in found[:10]:
    print("  --- " + lid)
    print("      zh = %r" % (zh[:110] if zh else None))
    print("      en = %r" % (en[:110] if en else None))
print()
# 统计：有多少 law 的 title.zh 里不含中文
tot=0; noCJK=0; samples=[]
CJK = re.compile(r"[\u4e00-\u9fff]")
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f)=="index.json": continue
    o = json.load(io.open(f, encoding="utf-8"))
    t = o.get("title") or {}
    zh = t.get("zh")
    if not zh: continue
    tot += 1
    if not CJK.search(zh):
        noCJK += 1
        if len(samples) < 12:
            samples.append((o["id"], zh[:80], (o.get("titleTranslation") or {}).get("batch")))
print("  title.zh 非空 %d 部；其中**完全不含中文** %d 部" % (tot, noCJK))
for lid, zh, b in samples:
    print("     %-32s %-30s 批次=%s" % (lid, zh[:28], b))
