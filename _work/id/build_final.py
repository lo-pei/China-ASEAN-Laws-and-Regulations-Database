# -*- coding: utf-8 -*-
"""
生成最终数据：
- 主源：pasal.id 忠实转录（网页 HTML）
- 缺条：官方 PDF/JDIHN 副本中抽取（标注来源）
- 交叉校验：与官方 PDF 文本做归一化相似度比较，记录 scores
输出 _work/id/final/<lawId>.json
"""
import json
import os
import re
import sys
import collections
import difflib

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
FINAL = os.path.join(HERE, "final")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(FINAL, exist_ok=True)

sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))

STAMP = [
    r"^SK No\s*[0-9OIl]+\s*A?$",
    r"^PRESIDEN$", r"^REPUBLIK INDONESIA$", r"^REP[UB]L?I?K? INDONESIA$",
    r"^BIROHUKUM$", r"^S\. kmart\.- Jendenl$",
    r"^KEMENTERIAN TENAGA KERJA DAN TRAHSMIGRASI RI$",
    r"^-?\d{1,3}-?$", r"^\(?\d{1,3}\)?$",
    r"^FRESIDEN$", r"^REPUBUK INDONESIA$", r"^REPUEUK INDONESTA$",
    r"^KEMENTER]AN SEKRETARIAT NEGARA$", r"^Salinan sesuai dengan aslinya$",
    r"^TAMBAHAN LEMBARAN NEGARA.*$",
]


def norm(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def pdf_text(lawid):
    p = os.path.join(SRC, lawid + ".pdf.txt")
    if not os.path.exists(p):
        return None
    return open(p, encoding="utf-8").read()


MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")


def pdf_articles(txt, body_only=True):
    """按行首 Pasal 标记切分；body_only 只保留第一次出现的连续主体区间"""
    marks = [(m.start(), m.end(), m.group(1)) for m in MARK.finditer(txt)]
    segs = []
    for i, (s, e, lbl) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(txt)
        segs.append((lbl, txt[s:end]))
    # 去掉重复的“Penjelasan 部分”：保留每个 label 的第一次出现（主体在前）
    first = {}
    for lbl, seg in segs:
        if lbl not in first:
            first[lbl] = seg
    return first


def clean_pdf_segment(seg):
    lines = []
    for raw in seg.split("\n"):
        s = raw.strip()
        if not s:
            continue
        if any(re.match(p, s) for p in STAMP):
            continue
        if re.match(r"^Pasal\s+\d+[A-Z]?$", s):
            continue
        lines.append(s)
    txt = "\n".join(lines)
    # 合并被 OCR 换行拆断的句子（行尾无标点且下一行小写开头）
    out = []
    for line in lines:
        if out and out[-1] and out[-1][-1] not in ".!:;?)\"'" and line[:1].islower():
            out[-1] = out[-1] + " " + line
        else:
            out.append(line)
    return out


def main():
    rep = {}
    for fn in sorted(os.listdir(OUT)):
        if not fn.endswith(".json") or fn.startswith("_"):
            continue
        lawid = fn[:-5]
        d = json.load(open(os.path.join(OUT, fn), encoding="utf-8"))
        ptext = pdf_text(lawid)
        pcheck = pdf_articles(ptext) if ptext else {}
        filled, scores, low = [], {}, []
        for art in d["articles"]:
            t = "\n".join(art["paragraphs"])
            key = art["label"]
            art["source"] = "pasal.id"
            if key in pcheck:
                r = difflib.SequenceMatcher(None, norm(t), norm(pcheck[key])).ratio()
                scores[key] = round(r, 3)
                threshold = 0.93 if len(norm(t)) > 200 else 0.80
                if r < threshold:
                    low.append((key, round(r, 3), len(norm(t)), len(norm(pcheck[key]))))
        # 缺条从官方 PDF 补
        for key in d.get("missing", []):
            if key in pcheck:
                paras = clean_pdf_segment(pcheck[key])
                if paras:
                    d["articles"].append({"label": key, "title": "Pasal %s" % key,
                                          "paragraphs": paras, "penjelasan": [],
                                          "source": "official-pdf"})
                    filled.append(key)
        d["similarity"] = scores
        d["lowSimilarity"] = low
        d["filledFromPdf"] = filled
        json.dump(d, open(os.path.join(FINAL, lawid + ".json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        rep[lawid] = {"articles": len(d["articles"]), "filled": len(filled),
                      "missing": [k for k in d.get("missing", []) if k not in filled],
                      "low": len(low), "avg": round(sum(scores.values()) / len(scores), 3) if scores else None}
    json.dump(rep, open(os.path.join(FINAL, "_report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    for k, v in rep.items():
        print("%-24s %s" % (k, json.dumps(v, ensure_ascii=False)))


if __name__ == "__main__":
    main()
