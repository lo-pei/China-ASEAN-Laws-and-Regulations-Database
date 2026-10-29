# -*- coding: utf-8 -*-
"""下载 jdih.maritim 的 UU 27/2022 PDF；检查 komdigi 是否有全文 HTML 视图"""
import os, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

PDF = os.path.join(HERE, "pdf")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(PDF, exist_ok=True)
os.makedirs(SRC, exist_ok=True)

u = "https://jdih.maritim.go.id/cfind/source/files/uu/uu-nomor-27-tahun-2022.pdf"
dest = os.path.join(PDF, "ID-PDP-2022.maritim.pdf")
try:
    if not os.path.exists(dest):
        H.download(u, dest, retries=2, timeout=180)
    print("size", os.path.getsize(dest))
    txt, pages = H.pdf_text(dest)
    txt = H.strip_page_noise(txt)
    H.save_text(os.path.join(SRC, "ID-PDP-2022.txt"), txt)
    print("pages", pages, "chars", len(txt))
    print("HEAD:", txt[:400].replace("\n", " | "))
    print("TAIL:", txt[-300:].replace("\n", " | "))
    print("Pasal1 idx", txt.find("Pasal 1"))
except Exception as e:
    print("ERR", str(e)[:200])
