# -*- coding: utf-8 -*-
"""抓取全部法规主页面并统计覆盖（不补单条页）"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import extract2 as E

for lawid, path in E.LAWS.items():
    fn = os.path.join(HERE, "pages", lawid + ".main.html")
    if os.path.exists(fn) and os.path.getsize(fn) > 10000:
        print("cached", lawid); continue
    try:
        E.main_html(lawid, path)
        print("fetched", lawid)
    except Exception as e:
        print("ERR", lawid, str(e)[:100])
