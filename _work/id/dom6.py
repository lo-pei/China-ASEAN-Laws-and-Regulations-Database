# -*- coding: utf-8 -*-
"""统计每个 pasal.id 页面渲染出的条文数，判断是否分页截断"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROBE = os.path.join(HERE, "probe")

for f in sorted(os.listdir(PROBE)):
    if not (f.startswith("pasal_") and f.endswith(".html")):
        continue
    t = open(os.path.join(PROBE, f), encoding="utf-8").read()
    arts = re.findall(r'<article id="pasal-([^"]+)"', t)
    # 页面内最大的 Pasal 号
    h3 = [re.sub(r"\s+", " ", m).strip() for m in re.findall(r"Pasal<!-- --> <!-- -->([\w]+)", t)]
    # 分页/加载更多提示
    more = len(re.findall(r"load more|Muat|Selanjutnya|Halaman", t, re.I))
    print("%-26s articles=%3d  h3Pasals=%3d  maxno=%s  more=%d" % (
        f, len(arts), len(h3), (h3[-1] if h3 else "-"), more))
    if arts:
        print("      first/last article ids: %s ... %s" % (arts[0], arts[-1]))
