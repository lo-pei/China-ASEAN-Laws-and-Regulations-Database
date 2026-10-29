# -*- coding: utf-8 -*-
"""从 pasal.id 页面提取 sourceDocument PDF 链接与全文结构探测"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
PROBE = os.path.join(HERE, "probe")

for f in sorted(os.listdir(PROBE)):
    if not (f.startswith("pasal_") and f.endswith(".html")):
        continue
    t = open(os.path.join(PROBE, f), encoding="utf-8").read()
    pdfs = sorted(set(re.findall(r'https://[^"\\\s]+\.pdf', t)))
    bpk = sorted(set(re.findall(r'https://peraturan\.bpk\.go\.id/[^"\\\s]+', t)))
    print("%-26s pdf=%s" % (f, pdfs[:3]))
    for b in bpk[:2]:
        print("      bpk:", b[:120])
