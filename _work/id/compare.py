# -*- coding: utf-8 -*-
"""评估：官方 PDF 文本 vs pasal.id 文本 的可比对性（归一化后相似度）"""
import os, re, sys, json, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
OUT = os.path.join(HERE, "out")

def norm(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()

def pdf_articles(txt):
    """按行首 Pasal N 切分（仅主体部分，取第一次出现区间）"""
    marks = [(m.start(), m.group(1)) for m in re.finditer(r"(?m)^\s*Pasal\s+(\d+[A-Z]?)\s*$", txt)]
    out = {}
    for i, (pos, lbl) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(txt)
        body = txt[pos:end]
        if lbl not in out:
            out[lbl] = body
    return out

for lawid in ["ID-INVEST-2007", "ID-ARBITRATION-1999", "ID-COMPANY-2007", "ID-TRADE-2014",
              "ID-ETRANSACTION-2019", "ID-SCIENCE-2019", "ID-LABOR-PP-2021"]:
    pdfp = os.path.join(SRC, lawid + ".pdf.txt")
    jp = os.path.join(OUT, lawid + ".json")
    if not (os.path.exists(pdfp) and os.path.exists(jp)):
        print("skip", lawid); continue
    pdf = pdf_articles(open(pdfp, encoding="utf-8").read())
    j = json.load(open(jp, encoding="utf-8"))
    print("=" * 90)
    print(lawid, "PDF pasal:", len(pdf), " pasal.id:", len(j["articles"]))
    # 用 pass1 抽取的 json（若存在）
    for a in j["articles"][:6]:
        lbl = a["label"]
        pj = norm(" ".join(a["paragraphs"]))
        pv = norm(pdf.get(lbl, ""))
        if not pv:
            print("  Pasal %-4s 官方PDF未匹配" % lbl); continue
        r = difflib.SequenceMatcher(None, pj, pv).ratio()
        print("  Pasal %-4s len(pasal.id)=%5d len(pdf)=%5d 相似度=%.3f" % (lbl, len(pj), len(pv), r))
