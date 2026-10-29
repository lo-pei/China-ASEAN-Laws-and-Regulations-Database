# -*- coding: utf-8 -*-
"""下载 pasal.id 的 sourceDocument PDF 并检测可提取性"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

PDF = os.path.join(HERE, "pdf")
os.makedirs(PDF, exist_ok=True)
u = "https://jnnqvmfhkqwfdlzevfao.supabase.co/storage/v1/object/public/regulation-pdfs/uu-no-25-tahun-2007.pdf"
dest = os.path.join(PDF, "ID-INVEST-2007.srcpdf.pdf")
try:
    if not os.path.exists(dest):
        H.download(u, dest, retries=2, timeout=120)
    print("bytes", os.path.getsize(dest))
    txt, pages = H.pdf_text(dest)
    print("pages", pages, "chars", len(txt))
    print("HEAD:", txt[:500].replace("\n", " / "))
    print("Pasal1@", txt.find("Pasal 1"))
    print("TAIL:", txt[-400:].replace("\n", " / "))
    open(os.path.join(PDF, "ID-INVEST-2007.srcpdf.txt"), "w", encoding="utf-8").write(txt)
except Exception as e:
    print("ERR", str(e)[:200])
