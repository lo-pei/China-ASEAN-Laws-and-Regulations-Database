# -*- coding: utf-8 -*-
"""探查 jdih.setneg.go.id 的法规列表与 PDF 直链模式"""
import os, re, sys, collections

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tools")))
import harvest as H

t = open(os.path.join(os.path.dirname(__file__), "..", "cache_probe.html"), encoding="utf-8").read()
links = set(re.findall(r'href=["\']([^"\']+)["\']', t))
print("total links", len(links))
pats = collections.Counter()
for l in links:
    pats[re.sub(r"\d+", "N", l)[:100]] += 1
for k, v in pats.most_common(50):
    print(v, k)
