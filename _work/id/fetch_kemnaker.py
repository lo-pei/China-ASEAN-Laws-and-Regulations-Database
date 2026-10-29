# -*- coding: utf-8 -*-
"""下载 Kemnaker 官方 PDF 并用 pypdf 检测可提取性"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "pdf")
os.makedirs(OUT, exist_ok=True)

pdfs = {
    "ID-LABOR-2003.kemnaker": "https://jdih.kemnaker.go.id/asset/data_puu/2003uu013.pdf",
    "ID-LABOR-2003.kemnaker.en": "https://jdih.kemnaker.go.id/asset/data_puue/UU_NO_13_Thn_2003.pdf",
    "ID-CIPTA-2020.kemnaker": "https://jdih.kemnaker.go.id/asset/data_puu/uu_11_2020_cipta_kerja.pdf",
    "ID-CIPTA-2023.kemnaker": "https://jdih.kemnaker.go.id/asset/data_puu/2023UU06_Klaster%20Ketenagakerjaan.pdf",
    "ID-LABOR-PP-2021.kemnaker": "https://jdih.kemnaker.go.id/asset/data_puu/PP362021.pdf",
}
for tag, u in pdfs.items():
    dest = os.path.join(OUT, tag + ".pdf")
    try:
        if not os.path.exists(dest):
            H.download(u, dest, retries=2, timeout=120)
        size = os.path.getsize(dest)
        with open(dest, "rb") as f:
            head = f.read(5)
        txt, pages = H.pdf_text(dest)
        txt = H.strip_page_noise(txt)
        open(os.path.join(OUT, tag + ".txt"), "w", encoding="utf-8").write(txt)
        alnum = sum(c.isalnum() or c.isspace() for c in txt[:4000])
        print("%-30s %8d bytes pdf=%s pages=%s chars=%d head='%s'" % (
            tag, size, head == b"%PDF-", pages, len(txt), txt[:90].replace("\n", " ")))
        for kw in ["Pasal 1", "Pasal 2", "Menimbang", "Ketentuan Penutup"]:
            print("      %-18s %s" % (kw, kw in txt))
    except Exception as e:
        print("ERR", tag, str(e)[:130])
