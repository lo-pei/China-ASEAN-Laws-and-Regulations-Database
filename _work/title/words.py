# -*- coding: utf-8 -*-
import io, os, json, glob, re, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")
STOP = set("the of and to for in on a an or by with from as at is are be that this its it their not under into other such any all shall may".split())
rows = []
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f) == "index.json": continue
    try: o = json.load(io.open(f, encoding="utf-8"))
    except: continue
    t = o.get("title") or {}
    if t.get("zh"): continue
    txt = t.get("en") or next((v for v in t.values() if v), None)
    if txt: rows.append((o.get("country"), txt.strip()))
eng = [(c,t) for c,t in rows if re.search(r"[A-Za-z]", t) and not re.search(r"[\u0e00-\u0e7f\u1000-\u109f]", t)]
print("  英文标题 %d 条" % len(eng))
w = Counter()
for _, t in eng:
    for x in re.findall(r"[A-Za-z][A-Za-z\-']+", t):
        xl = x.lower()
        if len(xl) > 2 and xl not in STOP:
            w[xl] += 1
print("  不同词 %d 个；出现 ≥5 次的有 %d 个" % (len(w), sum(1 for k,v in w.items() if v>=5)))
print("")
print("=== 出现 ≥8 次的词（%d 个）===" % sum(1 for k,v in w.items() if v>=8))
line = []
for k, v in w.most_common():
    if v < 8: break
    line.append("%s:%d" % (k, v))
for i in range(0, len(line), 6):
    print("  " + "  ".join(line[i:i+6]))
