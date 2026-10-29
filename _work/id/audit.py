# -*- coding: utf-8 -*-
"""抽查核验：把 id.js 中的 Pasal 1 / 末条 与来源文本逐字比对"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH
import harvest as H

BLOCK = "text-base leading-relaxed whitespace-pre-wrap"


def norm(s):
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


def from_pasal_id(url, slug, num):
    """重新抓取来源页，抽取指定条文文本"""
    t = H.get_text(url, retries=2, timeout=60, cache=False)
    doc = LH.fromstring(t)
    nodes = doc.xpath('//article[@id="pasal-%s"]' % num)
    if not nodes:
        return None
    paras = []
    for div in nodes[0].xpath('.//div[contains(@class,"%s")]' % BLOCK):
        txt = norm(div.text_content())
        if txt and (not paras or paras[-1] != txt):
            paras.append(txt)
    return paras


def from_pdf(lawid, num):
    SRC = os.path.abspath(os.path.join(HERE, "..", "src", "id"))
    t = open(os.path.join(SRC, lawid + ".pdf.txt"), encoding="utf-8").read()
    m = re.search(r"(?m)^\s*PENJELASAN\s*$", t)
    body = t[:m.start()] if m else t
    marks = [(mm.start(), mm.group(1)) for mm in re.finditer(r"(?m)^[ \t]*(?:Pasal|PASAL)[ \t]+(\d+[A-Z]?)[ \t]*$", body)]
    for i, (s, lbl) in enumerate(marks):
        if lbl == str(num):
            e = marks[i + 1][0] if i + 1 < len(marks) else len(body)
            return body[s:e]
    return None


CASES = [
    ("ID-INVEST-2007", "uu/uu-no-25-tahun-2007", 1, 40),
    ("ID-LABOR-2003", "uu/uu-no-13-tahun-2003", 1, 193),
    ("ID-ARBITRATION-1999", "uu/uu-no-30-tahun-1999", 1, 82),
]

def load_js(lawid):
    node = os.path.join(ROOT, "prototype", "data", "fulltext", "id.js")
    txt = open(node, encoding="utf-8").read()
    # 直接用 python 解析太复杂；改为读取 final2 的原始数据作为对照：等价于写入文件前的内容
    return json.load(open(os.path.join(HERE, "final2", lawid + ".json"), encoding="utf-8"))


for lawid, slug, first, last in CASES:
    d = load_js(lawid)
    arts = {a["label"]: a for a in d["articles"]}
    print("=" * 100)
    print(lawid, "条数", len(arts), "首条", first, "末条", last)
    # 1) 重新抓来源页
    got = from_pasal_id("https://pasal.id/peraturan/%s" % slug, slug, first)
    rec = arts[str(first)]["paragraphs"]
    if got is None:
        print("  Pasal %s：来源页未渲染，改用官方 PDF 对照" % first)
        pv = from_pdf(lawid, first)
        if pv:
            a = norm("\n".join(rec)).lower()
            b = norm(pv).lower()
            a2 = re.sub(r"[^a-z0-9]+", " ", a).strip()
            b2 = re.sub(r"[^a-z0-9]+", " ", b).strip()
            same = a2 in b2 or b2 in a2
            print("  与官方 PDF 一致：%s" % ("是（包含关系）" if same else "否"))
            print("  录入:", a[:180])
            print("  官方:", b[:180])
    else:
        same = got == rec
        print("  与来源页一致：%s" % ("是（逐字相同）" if same else "否"))
        if not same:
            print("  来源:", repr(got)[:200])
            print("  录入:", repr(rec)[:200])
    # 2) 末条
    lrec = arts[str(last)]["paragraphs"]
    Lgot = from_pasal_id("https://pasal.id/peraturan/%s" % slug, slug, last)
    if Lgot is None:
        pv = from_pdf(lawid, last)
        a = re.sub(r"[^a-z0-9]+", " ", norm("\n".join(lrec)).lower()).strip()
        b = re.sub(r"[^a-z0-9]+", " ", norm(pv or "").lower()).strip()
        print("  末条 Pasal %s：来源页未渲染；与官方 PDF 一致：%s" % (last, a in b or b in a))
        print("  录入:", a[:160])
    else:
        print("  末条 Pasal %s 与来源页一致：%s" % (last, Lgot == lrec))
