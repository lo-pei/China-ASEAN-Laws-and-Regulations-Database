# -*- coding: utf-8 -*-
import io, os, json, glob, sys
from collections import Counter
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
tot=0; zh=0; byb=Counter(); byc=Counter(); zh_by_c=Counter(); tot_by_c=Counter()
for f in glob.glob("prototype/data/laws/*.json"):
    if os.path.basename(f)=="index.json": continue
    o=json.load(io.open(f,encoding="utf-8"))
    tot+=1
    c=o.get("country","?")
    tot_by_c[c]+=1
    t=o.get("title") or {}
    if t.get("zh"):
        zh+=1
        zh_by_c[c]+=1
        tt=o.get("titleTranslation") or {}
        byb[tt.get("batch") or "(无批次)"]+=1
    # 无标题
print("全库 %d 部，有中文标题 %d 部（%.1f%%）" % (tot, zh, zh*100.0/tot))
print()
print("按国别：")
for c,n in sorted(tot_by_c.items(), key=lambda x:-x[1]):
    print("  %-4s %5d 部，中文 %5d（%5.1f%%）" % (c, n, zh_by_c[c], zh_by_c[c]*100.0/n))
print()
print("按入库批次：")
for b,n in byb.most_common():
    print("  %-40s %6d" % (b, n))
