# -*- coding: utf-8 -*-
"""统计每个 law 的 TOC 与首页正文覆盖（不抓单条页，快速评估缺口）"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH
import extract2 as E

for lawid, path in E.LAWS.items():
    fn = os.path.join(HERE, "pages", lawid + ".main.html")
    if not os.path.exists(fn):
        print("%-24s 未缓存" % lawid); continue
    t = open(fn, encoding="utf-8").read()
    arts = E.collect(t)
    pasals, babs = E.parse_toc(E.rsc_blob(t))
    order = [str(p["number"]) for p in pasals]
    miss = [n for n in order if n not in arts]
    print("%-24s TOC=%4d 正文=%4d 缺=%4d %s" % (lawid, len(order), len(arts), len(miss), miss[:25]))
