# -*- coding: utf-8 -*-
"""下载全部 12 部法规的官方 PDF 副本（来源：pasal.id 标注的官方直链镜像），并评估文本质量"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

PDF = os.path.join(HERE, "pdf")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(PDF, exist_ok=True)
os.makedirs(SRC, exist_ok=True)

BASE = "https://jnnqvmfhkqwfdlzevfao.supabase.co/storage/v1/object/public/regulation-pdfs/"
DOCS = {
    "ID-INVEST-2007": ("uu-no-25-tahun-2007", "https://peraturan.go.id/id/uu-no-25-tahun-2007"),
    "ID-CIPTA-2020": ("uu-no-11-tahun-2020", "https://peraturan.go.id/id/uu-no-11-tahun-2020"),
    "ID-LABOR-2003": ("uu-no-13-tahun-2003", "https://peraturan.go.id/id/uu-no-13-tahun-2003"),
    "ID-COPYRIGHT-2014": ("uu-no-28-tahun-2014", "https://peraturan.go.id/id/uu-no-28-tahun-2014"),
    "ID-PDP-2022": ("uu-no-27-tahun-2022", "https://peraturan.go.id/id/uu-no-27-tahun-2022"),
    "ID-COMPANY-2007": ("uu-no-40-tahun-2007", "https://peraturan.go.id/id/uu-no-40-tahun-2007"),
    "ID-ARBITRATION-1999": ("uu-no-30-tahun-1999", "https://peraturan.go.id/id/uu-no-30-tahun-1999"),
    "ID-CIPTA-2023": ("uu-no-6-tahun-2023", "https://peraturan.go.id/id/uu-no-6-tahun-2023"),
    "ID-LABOR-PP-2021": ("pp-no-35-tahun-2021", "https://peraturan.go.id/id/pp-no-35-tahun-2021"),
    "ID-ETRANSACTION-2019": ("pp-no-71-tahun-2019", "https://peraturan.go.id/id/pp-no-71-tahun-2019"),
    "ID-TRADE-2014": ("uu-no-7-tahun-2014", "https://peraturan.go.id/id/uu-no-7-tahun-2014"),
    "ID-SCIENCE-2019": ("uu-no-11-tahun-2019", "https://peraturan.go.id/id/uu-no-11-tahun-2019"),
}

rep = {}
for lawid, (slug, offurl) in DOCS.items():
    dest = os.path.join(PDF, lawid + ".pdf")
    try:
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            H.download(BASE + slug + ".pdf", dest, retries=2, timeout=180)
        txt, pages = H.pdf_text(dest)
        clean = H.strip_page_noise(txt)
        H.save_text(os.path.join(SRC, lawid + ".pdf.txt"), clean)
        lines = [l for l in clean.split("\n") if l.strip()]
        short = sum(1 for l in lines if len(l) < 25) / max(1, len(lines))
        weird = len(re.findall(r"[|_~^`{}\[\]<>\\]", clean))
        rep[lawid] = {"bytes": os.path.getsize(dest), "pages": pages, "chars": len(clean),
                      "shortpct": round(short * 100, 1), "weird": weird,
                      "pasal1": clean.find("Pasal 1"), "head": clean[:120]}
        print("%-24s %8d B %4d p %7d ch short%%=%4.1f weird=%5d" % (
            lawid, os.path.getsize(dest), pages, len(clean), short * 100, weird))
    except Exception as e:
        print("ERR %-24s %s" % (lawid, str(e)[:120]))
json.dump(rep, open(os.path.join(HERE, "pdf_report2.json"), "w"), ensure_ascii=False, indent=1)
