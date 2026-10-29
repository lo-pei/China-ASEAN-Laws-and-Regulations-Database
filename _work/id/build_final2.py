# -*- coding: utf-8 -*-
"""
最终数据构建 v3
- TOC 用修正后的 RSC 解析（完整条号序列）
- 正文用 pasal.id 网页；TOC 中缺失的条用官方 PDF 补齐
- 与官方 PDF 做相似度交叉校验
输出 _work/id/final2/<lawId>.json
"""
import json, os, re, sys, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH
import rsc_fix as R

PAGES = os.path.join(HERE, "pages")
OUT = os.path.join(HERE, "out")
FINAL = os.path.join(HERE, "final2")
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
os.makedirs(FINAL, exist_ok=True)

BLOCK = "text-base leading-relaxed whitespace-pre-wrap"
STAMP = [
    r"^SK No\s*[0-9OIl]+\s*A?$", r"^PRESIDEN$", r"^REPUBLIK INDONESIA$", r"^FRESIDEN$",
    r"^REPUBUK INDONESIA$", r"^REPUEUK INDONESTA$", r"^REP[UB]L?I?K? INDONESIA$",
    r"^BIROHUKUM$", r"^S\. kmart\.- Jendenl$",
    r"^KEMENTERIAN TENAGA KERJA DAN TRAHSMIGRASI RI$",
    r"^-?\d{1,3}-?$", r"^\(?\d{1,3}\)?$",
    r"^KEMENTER]AN SEKRETARIAT NEGARA$", r"^Salinan sesuai dengan aslinya$",
    r"^TAMBAHAN LEMBARAN NEGARA.*$",
]
MARK = re.compile(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$")


def clean_txt(s):
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


def parse_article(node):
    h3 = node.xpath(".//h3")
    title = ""
    if h3:
        title = re.sub(r"\s+", " ", "".join(h3[0].itertext())).strip()
        title = re.sub(r"(Tautan|Salin)+$", "", title).strip()
    paras = []
    for div in node.xpath('.//div[contains(@class,"%s")]' % BLOCK):
        txt = clean_txt(div.text_content())
        if txt and (not paras or paras[-1] != txt):
            paras.append(txt)
    pen = []
    for div in node.xpath('.//div[contains(@class,"mt-2")]//div[contains(@class,"%s")]' % BLOCK):
        txt = clean_txt(div.text_content())
        if txt and txt not in pen:
            pen.append(txt)
    return {"title": title, "paragraphs": paras, "penjelasan": pen}


def collect(html_text):
    doc = LH.fromstring(html_text)
    out = {}
    for a in doc.xpath('//article[starts-with(@id,"pasal-")]'):
        m = re.match(r"pasal-(.+)$", a.get("id"))
        if not m:
            continue
        rec = parse_article(a)
        if rec["paragraphs"]:
            out[m.group(1)] = rec
    return out


def parse_structure(html_text):
    doc = LH.fromstring(html_text)
    out = {}
    for sec in doc.xpath('//section[starts-with(@id,"bab-")]'):
        h2 = sec.xpath(".//h2")
        num = re.sub(r"\s+", " ", "".join(h2[0].itertext())).strip() if h2 else ""
        ps = sec.xpath("./p")
        head = re.sub(r"\s+", " ", "".join(ps[0].itertext())).strip() if ps else ""
        out[sec.get("id")] = {"number": num.replace("BAB", "").strip(), "heading": head,
                              "label": (num + " " + head).strip()}
    return out


def pdf_articles(lawid):
    """返回 (主体系列 dict, 按位置排序的全部系列列表)；主体系列用于相似度核校"""
    p = os.path.join(SRC, lawid + ".pdf.txt")
    if not os.path.exists(p):
        return {}, []
    t = open(p, encoding="utf-8").read()
    pen = None
    ms = list(re.finditer(r"(?m)^[ \t]*PENJELASAN[ \t]*\r?\n[ \t]*ATAS\b", t))
    if ms:
        pen = ms[0].start()
    else:
        m = re.search(r"(?m)^\s*PENJELASAN\s*$", t)
        if m:
            pen = m.start()
    body = t[:pen] if pen else t
    marks = [(mm.start(), mm.group(1)) for mm in MARK.finditer(t)]
    seq = []
    for i, (s, lbl) in enumerate(marks):
        e = marks[i + 1][0] if i + 1 < len(marks) else len(t)
        seq.append((lbl, t[s:e]))
    body_first = {}
    for i, (s, lbl) in enumerate([(x, y) for x, y in [(mm.start(), mm.group(1)) for mm in MARK.finditer(body)]]):
        pass
    bmarks = [(mm.start(), mm.group(1)) for mm in MARK.finditer(body)]
    for i, (s, lbl) in enumerate(bmarks):
        e = bmarks[i + 1][0] if i + 1 < len(bmarks) else len(body)
        if lbl not in body_first:
            body_first[lbl] = body[s:e]
    return body_first, seq


def clean_pdf_segment(seg):
    lines = []
    stop = False
    for raw in seg.split("\n"):
        s = raw.strip()
        if not s or re.match(r"^Pasal\s+\d+[A-Z]?$", s):
            continue
        if re.match(r"^PENJELASAN$", s):
            stop = True
        if stop:
            continue
        if any(re.match(pat, s) for pat in STAMP):
            continue
        lines.append(s)
    out = []
    for line in lines:
        if out and out[-1] and out[-1][-1] not in ".!:;?)\"'" and line[:1].islower():
            out[-1] = out[-1] + " " + line
        else:
            out.append(line)
    return out


def strip_artifacts(s):
    """剔除混入正文的页眉/编号等非条文行"""
    out = []
    for ln in s.split("\n"):
        t = ln.strip()
        if not t:
            out.append("")
            continue
        if re.match(r"^SK No[.:]?\s*[0-9OIl?]+(\s*[0-9OIl?]+)*\s*A?$", t):
            continue
        if re.match(r"^PRESIDEN(\s+REPUBLIK\s+INDONESIA)?[,.]?\s*(ttd\.?)?$", t):
            continue
        if re.match(r"^(REPUBLIK INDONESIA|REPUEUK INDONESIA|REPUBUK INDONESIA|REPUBLIK TNDONESIA)[,.]?\s*(ttd\.?)?$", t):
            continue
        if re.match(r"^Agar\s*(setiap orang mengetahuinya)?\s*\.\.\.\s*$", t):
            continue
        if re.match(r"^[-–—\s]*\d{1,3}[-–—\s]*$", t):
            continue
        out.append(ln)
    txt = "\n".join(out)
    return re.sub(r"\n{2,}", "\n", txt).strip()


def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s.lower())).strip()


def sort_key_num(lbl):
    m = re.match(r"^(\d+)([A-Za-z]*)$", str(lbl))
    return (int(m.group(1)), m.group(2)) if m else (10 ** 6, str(lbl))


OCR_DIGIT = {"O": "0", "o": "0", "I": "1", "l": "1", "S": "5", "B": "8", "Z": "2", "g": "9"}


def fix_label(lbl):
    """修正 OCR 把数字识别成字母的条号（如 1O -> 10）"""
    lbl = str(lbl).strip()
    if re.fullmatch(r"\d+", lbl):
        return lbl
    m = re.fullmatch(r"(\d+)([A-Za-z])", lbl)
    if m and m.group(2) in OCR_DIGIT:
        return m.group(1) + OCR_DIGIT[m.group(2)]
    return lbl


def main():
    rep = {}
    for fn in sorted(os.listdir(PAGES)):
        if not fn.endswith(".main.html"):
            continue
        lawid = fn[:-10]
        t = open(os.path.join(PAGES, fn), encoding="utf-8").read()
        blob = R.rsc_blob(t)
        pasals, babs = R.parse_toc(blob)
        order = list(dict.fromkeys(str(p["number"]) for p in pasals))
        parent = {str(p["number"]): p.get("parent_id") for p in pasals}
        struct = parse_structure(t)
        arts = {k: v for k, v in collect(t).items() if k in order}
        bodypdf, seqpdf = pdf_articles(lawid)
        # 合并条号序列：TOC 顺序 + 官方 PDF 中出现的条号
        pdfkeys = [fix_label(lbl) for lbl, _ in seqpdf]
        allkeys = list(order)
        for lbl in pdfkeys:
            if lbl not in allkeys:
                allkeys.append(lbl)
        allkeys = sorted(set(allkeys), key=lambda x: sort_key_num(x))
        filled, scores, low = [], {}, []
        for lbl in allkeys:
            if lbl not in arts:
                seg = None
                for l2, s2 in seqpdf:
                    if fix_label(l2) == lbl:
                        seg = s2
                        break
                if seg is None:
                    seg = bodypdf.get(lbl)
                if seg:
                    paras = clean_pdf_segment(seg)
                    if paras:
                        arts[lbl] = {"title": "Pasal %s" % lbl, "paragraphs": paras,
                                     "penjelasan": [], "_src": "official-pdf"}
                        filled.append(lbl)
        for lbl in allkeys:
            if lbl in arts and lbl in bodypdf:
                r = difflib.SequenceMatcher(None, norm("\n".join(arts[lbl]["paragraphs"])),
                                            norm(bodypdf[lbl])).ratio()
                scores[lbl] = round(r, 3)
                lim = 0.93 if len(norm("\n".join(arts[lbl]["paragraphs"]))) > 200 else 0.80
                if r < lim:
                    low.append(lbl)
        arts_sorted = []
        for lbl in allkeys:
            if lbl not in arts:
                continue
            a = arts[lbl]
            paras = [strip_artifacts(p) for p in a["paragraphs"]]
            paras = [p for p in paras if p.strip()]
            dedup = []
            for p in paras:
                if not dedup or dedup[-1] != p:
                    dedup.append(p)
            paras = dedup
            if not paras:
                continue
            pid = parent.get(lbl)
            sid = None
            if pid:
                # 找含该 pasal 的 section
                for k in struct:
                    pass
            arts_sorted.append({
                "label": lbl,
                "title": a["title"],
                "paragraphs": paras,
                "penjelasan": [strip_artifacts(p) for p in (a["penjelasan"] or []) if strip_artifacts(p)],
                "parentId": pid,
                "source": a.get("_src", "pasal.id"),
            })
        result = {"lawId": lawid, "order": order, "babs": {str(k): v for k, v in babs.items()},
                  "structure": struct, "articles": arts_sorted}
        json.dump(result, open(os.path.join(FINAL, lawid + ".json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        notfound = [l for l in order if l not in arts]
        rep[lawid] = {"toc": len(order), "articles": len(arts_sorted),
                      "filledFromPdf": filled, "stillMissing": notfound,
                      "lowSim": low[:15], "lowCount": len(low),
                      "avgSim": round(sum(scores.values()) / len(scores), 3) if scores else None}
    json.dump(rep, open(os.path.join(FINAL, "_report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    for k, v in rep.items():
        print("%-24s toc=%3d arts=%3d filled=%2d missing=%2d low=%3d avg=%s" % (
            k, v["toc"], v["articles"], len(v["filledFromPdf"]), len(v["stillMissing"]),
            v["lowCount"], v["avgSim"]))
        if v["stillMissing"]:
            print("       仍缺:", v["stillMissing"][:15])


if __name__ == "__main__":
    main()
