# -*- coding: utf-8 -*-
"""分析 pasal.id 页面结构与内容质量"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
t = H.get_text("https://pasal.id/peraturan/uu/uu-no-25-tahun-2007", timeout=60)
open(os.path.join(OUT, "pasal_uu25.html"), "w", encoding="utf-8").write(t)
print("html", len(t))
# Next.js data?
m = re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>', t, re.S)
print("NEXT_DATA", bool(m))
if m:
    d = json.loads(m.group(1))
    open(os.path.join(OUT, "pasal_uu25.json"), "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False))
    s = json.dumps(d, ensure_ascii=False)
    print("json len", len(s))
    print("has Pasal 1:", "Pasal 1" in s)
txt = H.html_text(t)
print("text", len(txt), "Pasal1", txt.find("Pasal 1"))
i = txt.find("Pasal 1")
print(txt[max(0, i - 200):i + 1500])
print("...TAIL...")
print(txt[-800:])
