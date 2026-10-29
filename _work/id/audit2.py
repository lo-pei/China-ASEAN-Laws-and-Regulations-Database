# -*- coding: utf-8 -*-
"""逐字核验：id.js 中条文的 text 与来源文本逐字比对（Pasal 1 / 末条）"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH
import harvest as H

BLOCK = "text-base leading-relaxed whitespace-pre-wrap"
SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))


def norm(s):
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


def fetch_source(url, num):
    t = H.get_text(url, retries=2, timeout=60, cache=False)
    doc = LH.fromstring(t)
    nodes = doc.xpath('//article[@id="pasal-%s"]' % num)
    if not nodes:
        return None, t
    paras = []
    for div in nodes[0].xpath('.//div[contains(@class,"%s")]' % BLOCK):
        x = norm(div.text_content())
        if x and (not paras or paras[-1] != x):
            paras.append(x)
    return paras, t


def pdf_seg(lawid, num):
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    m = re.search(r"(?m)^\s*PENJELASAN\s*$", t)
    body = t[:m.start()] if m else t
    marks = [(mm.start(), mm.group(1)) for mm in
             re.finditer(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$", body)]
    for i, (s, lbl) in enumerate(marks):
        if lbl == str(num):
            e = marks[i + 1][0] if i + 1 < len(marks) else len(body)
            return body[s:e]
    return None


def squash(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


CASES = [
    ("ID-INVEST-2007", "uu/uu-no-25-tahun-2007", 1, 40),
    ("ID-ARBITRATION-1999", "uu/uu-no-30-tahun-1999", 1, 82),
    ("ID-LABOR-2003", "uu/uu-no-13-tahun-2003", 1, 193),
    ("ID-TRADE-2014", "uu/uu-no-7-tahun-2014", 1, 122),
]
out = []
for lawid, slug, first, last in CASES:
    d = json.load(open(os.path.join(HERE, "final2", lawid + ".json"), encoding="utf-8"))
    arts = {a["label"]: a for a in d["articles"]}
    out.append("=" * 100)
    out.append("%s（%d 条）" % (lawid, len(arts)))
    for lbl in (str(first), str(last)):
        rec = "\n".join(arts[lbl]["paragraphs"])
        rec_s = squash(rec)
        got, _ = fetch_source("https://pasal.id/peraturan/%s" % slug, lbl)
        if got:
            gs = squash("\n".join(got))
            verdict = "逐字一致（来源页 HTML 与录入文本完全相同）" if gs == rec_s else "不一致"
            out.append("  Pasal %-4s [来源：pasal.id 转录页] %s" % (lbl, verdict))
            if gs != rec_s:
                out.append("     来源: " + gs[:200])
                out.append("     录入: " + rec_s[:200])
        else:
            seg = pdf_seg(lawid, lbl)
            if seg is None:
                out.append("  Pasal %-4s [来源页未渲染；官方 PDF 中该条未匹配]" % lbl)
                continue
            ss = squash(seg)
            inside = rec_s in ss
            out.append("  Pasal %-4s [来源：官方 PDF 文字层] 录入文本完整包含于官方 PDF 文本：%s" % (lbl, inside))
            if not inside:
                out.append("     录入: " + rec_s[:260])
                out.append("     官方: " + ss[:260])
        out.append("     录入实文（前 200 字）: " + rec[:200])
open(os.path.join(HERE, "audit_report.txt"), "w", encoding="utf-8").write("\n".join(out))
print("\n".join(out))
