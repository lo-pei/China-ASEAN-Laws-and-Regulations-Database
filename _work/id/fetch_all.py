# -*- coding: utf-8 -*-
"""下载并检查印尼候选资料 PDF（Kemnaker 等）"""
import os, sys, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

PDF = os.path.join(HERE, "pdf")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(PDF, exist_ok=True)
os.makedirs(SRC, exist_ok=True)

jobs = {
    "ID-LABOR-PP-2021": "https://jdih.kemnaker.go.id/asset/data_puu/PP352021.pdf",
    "ID-LABOR-2003": "https://jdih.kemnaker.go.id/asset/data_puu/2003uu013.pdf",
    "ID-CIPTA-2020": "https://jdih.kemnaker.go.id/asset/data_puu/uu_11_2020_cipta_kerja.pdf",
    "ID-CIPTA-2023": "https://jdih.kemnaker.go.id/asset/data_puu/2023UU06_Klaster%20Ketenagakerjaan.pdf",
}
report = {}
for tag, u in jobs.items():
    dest = os.path.join(PDF, tag + ".pdf")
    try:
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            H.download(u, dest, retries=2, timeout=300)
        txt, pages = H.pdf_text(dest)
        raw = txt
        txt = H.strip_page_noise(txt)
        H.save_text(os.path.join(SRC, tag + ".raw.txt"), raw)
        H.save_text(os.path.join(SRC, tag + ".txt"), txt)
        rep = {
            "bytes": os.path.getsize(dest), "pages": pages, "chars": len(txt),
            "pasal1": txt.find("Pasal 1"),
            "last200": txt[-200:],
            "head200": txt[:200],
        }
        report[tag] = rep
        print("== %s pages=%s chars=%d Pasal1@%s" % (tag, pages, len(txt), rep["pasal1"]))
    except Exception as e:
        print("== ERR", tag, str(e)[:140])
json.dump(report, open(os.path.join(HERE, "pdf_report.json"), "w"), ensure_ascii=False, indent=1)
