# -*- coding: utf-8 -*-
"""提取 pasal -> BAB 归属，写入 final2 JSON；并生成结构目录"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

PAGES = os.path.join(HERE, "pages")
FINAL = os.path.join(HERE, "final2")

for fn in sorted(os.listdir(PAGES)):
    if not fn.endswith(".main.html"):
        continue
    lawid = fn[:-10]
    jp = os.path.join(FINAL, lawid + ".json")
    if not os.path.exists(jp):
        continue
    t = open(os.path.join(PAGES, fn), encoding="utf-8").read()
    doc = LH.fromstring(t)
    mapping, sections = {}, []
    for sec in doc.xpath('//section[starts-with(@id,"bab-")]'):
        h2 = sec.xpath(".//h2")
        num = re.sub(r"\s+", " ", "".join(h2[0].itertext())).strip() if h2 else ""
        ps = sec.xpath("./p")
        head = re.sub(r"\s+", " ", "".join(ps[0].itertext())).strip() if ps else ""
        label = (num + " " + head).strip()
        arts = []
        for a in sec.xpath('.//article[starts-with(@id,"pasal-")]'):
            m = re.match(r"pasal-(.+)$", a.get("id"))
            if m:
                mapping[m.group(1)] = label
                arts.append(m.group(1))
        if arts:
            sections.append({"label": label, "articles": arts})
    d = json.load(open(jp, encoding="utf-8"))
    for art in d["articles"]:
        art["chapter"] = mapping.get(art["label"], "")
    d["sections"] = sections
    json.dump(d, open(jp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("%-24s sections=%2d 有章节条=%3d/%3d" % (
        lawid, len(sections), sum(1 for a in d["articles"] if a["chapter"]), len(d["articles"])))
    if sections:
        print("      第一节:", sections[0]["label"], sections[0]["articles"][:6], "...")
