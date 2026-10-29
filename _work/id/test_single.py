# -*- coding: utf-8 -*-
"""测试其它法规的单条页是否可用"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
import extract2 as E
from lxml import html as LH

tests = [("ID-LABOR-2003", "uu/uu-no-13-tahun-2003", "126"),
         ("ID-COMPANY-2007", "uu/uu-no-40-tahun-2007", "130"),
         ("ID-COPYRIGHT-2014", "uu/uu-no-28-tahun-2014", "40"),
         ("ID-SCIENCE-2019", "uu/uu-no-11-tahun-2019", "3")]
for lawid, path, num in tests:
    try:
        t = E.pasal_html(lawid, path, num)
        got = E.collect(t)
        print("%-20s pasal-%s -> 采集=%s keys=%s" % (lawid, num, len(got), list(got)[:4]))
        if got:
            k = list(got)[0]
            print("      ", got[k]["paragraphs"][0][:200])
    except Exception as e:
        print("ERR", lawid, num, str(e)[:80])
