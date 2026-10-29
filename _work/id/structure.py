# -*- coding: utf-8 -*-
"""解析 pasal.id 页面中的 BAB / Bagian 结构"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH


def parse_structure(html_text, babs):
    """返回 {babId: {'number','heading','title'}} 与 pasal->babId 映射"""
    doc = LH.fromstring(html_text)
    out = {}
    for sec in doc.xpath('//section[starts-with(@id,"bab-")]'):
        sid = sec.get("id")
        h2 = sec.xpath(".//h2")
        num = re.sub(r"\s+", " ", "".join(h2[0].itertext())).strip() if h2 else ""
        ps = sec.xpath("./p")
        head = re.sub(r"\s+", " ", "".join(ps[0].itertext())).strip() if ps else ""
        # 从 RSC babs 里取 id 对应的 heading
        out[sid] = {"number": num.replace("BAB", "").strip(), "heading": head, "title": num, "raw": (num + " " + head).strip()}
    return out


if __name__ == "__main__":
    import extract2 as E
    for lawid in ["ID-INVEST-2007", "ID-LABOR-2003", "ID-COMPANY-2007"]:
        t = open(os.path.join(HERE, "pages", lawid + ".main.html"), encoding="utf-8").read()
        pasals, babs = E.parse_toc(E.rsc_blob(t))
        st = parse_structure(t, babs)
        print(lawid, "RSC babs:", len(babs), "DOM sections:", len(st))
        for k, v in list(st.items())[:6]:
            print("   ", k, v)
        # 子节 Bagian?
        doc = LH.fromstring(t)
        bag = doc.xpath('//*[contains(@id,"bagian")]')
        print("   Bagian 元素:", len(bag), [b.get("id") for b in bag[:5]])
