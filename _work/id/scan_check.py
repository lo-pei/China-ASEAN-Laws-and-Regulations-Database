# -*- coding: utf-8 -*-
"""判断 PDF 是数字版还是扫描件：检查页面是否含图像 > 文本"""
import os, io, sys, re
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from pypdf import PdfReader

PDF = os.path.join(HERE, "pdf")
for f in sorted(os.listdir(PDF)):
    if not f.endswith(".pdf"):
        continue
    p = os.path.join(PDF, f)
    try:
        r = PdfReader(p)
        n = len(r.pages)
        img_pages = 0
        fonts = set()
        for i in range(min(n, 25)):
            pg = r.pages[i]
            res = pg.get("/Resources") or {}
            xo = res.get("/XObject")
            has_img = False
            if xo:
                try:
                    for k in xo:
                        o = xo[k].get_object()
                        if o.get("/Subtype") == "/Image":
                            has_img = True
                except Exception:
                    pass
            if has_img:
                img_pages += 1
            fo = res.get("/Font")
            if fo:
                try:
                    for k in fo:
                        fonts.add(str(fo[k].get_object().get("/BaseFont")))
                except Exception:
                    pass
        print("%-28s pages=%4d 含图像页(前25)=%2d 字体=%s" % (f, n, img_pages, sorted(fonts)[:4]))
    except Exception as e:
        print("ERR", f, str(e)[:80])
