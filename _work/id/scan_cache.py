# -*- coding: utf-8 -*-
"""在 _work/cache 中查找是否已有印尼法规文本缓存"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.abspath(os.path.join(HERE, ".."))
CACHE = os.path.join(WORK, "cache")

keys = [
    (b"Penanaman Modal", "UU25/2007"),
    (b"Ketenagakerjaan", "UU13/2003"),
    (b"Cipta Kerja", "UU11/2020"),
    (b"Hak Cipta", "UU28/2014"),
    (b"Pelindungan Data Pribadi", "UU27/2022"),
    (b"Perseroan Terbatas", "UU40/2007"),
    (b"Arbitrase dan Alternatif", "UU30/1999"),
    (b"Pasal 1", "pasal"),
]
files = os.listdir(CACHE)
print("cache files", len(files))
for f in files:
    p = os.path.join(CACHE, f)
    try:
        with open(p, "rb") as fh:
            b = fh.read()
    except Exception:
        continue
    if b[:4] == b"%PDF":
        continue
    hits = [tag for k, tag in keys if k in b]
    if hits:
        # 找来源 URL 线索
        t = b[:200000].decode("utf-8", "ignore")
        m = re.findall(r"(?:og:url|canonical)[^>]{0,200}", t)[:2]
        title = re.search(r"<title[^>]*>(.{0,120}?)</title>", t, re.S)
        print(f, len(b), hits, "|", (title.group(1).strip().replace("\n", " ") if title else ""), "|", m)
