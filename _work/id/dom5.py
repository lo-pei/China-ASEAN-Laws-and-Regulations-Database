# -*- coding: utf-8 -*-
"""检查 UU11/2020 页面结构：是否所有条文都在 HTML 中"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "pylibs")))
from lxml import html as LH

p = os.path.join(HERE, "probe", "pasal_uu11_2020.html")
t = open(p, encoding="utf-8").read()
print("html len", len(t))
doc = LH.fromstring(t)
arts = doc.xpath('//article[starts-with(@id,"pasal-")]')
print("article nodes", len(arts))
secs = doc.xpath('//*[starts-with(@id,"bab-")]')
print("bab sections", len(secs), [s.get("id") for s in secs][:20])
# 页面里的 Pasal XXX 标题（h3）
h3 = [re.sub(r"\s+", " ", (x.text_content() or "")).strip() for x in doc.xpath("//h3")]
pa = [x for x in h3 if re.match(r"^Pasal\s", x)]
print("h3 Pasal:", len(pa), pa[:15])
# RSC 块
blocks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)', t, re.S)
import json
parts = []
for b in blocks:
    try:
        parts.append(json.loads(b))
    except Exception:
        parts.append(b)
blob = "".join(parts)
print("rsc blob", len(blob), "pasal- id count", blob.count('\\"id\\":\\"pasal-') + blob.count('"id":"pasal-'))
print("occurrences 'pasal-1\'", blob.count('"pasal-1"'))
i = blob.find('"pasal-')
print(blob[i - 200:i + 400])
