# -*- coding: utf-8 -*-
"""在 jdih.setneg 页面中找 API 端点"""
import os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "probe")
t = open(os.path.join(OUT, "list0.html"), encoding="utf-8").read()
# 所有 js chunk
chunks = sorted(set(re.findall(r'src=["\']([^"\']*_next/static/[^"\']+\.js)["\']', t)))
print("chunks", len(chunks))
for c in chunks[:40]:
    print("  ", c)
# 直接找 api 字样
for m in set(re.findall(r'["\'](/api/[^"\']{0,80})["\']', t)):
    print("api:", m)
for m in set(re.findall(r'(https?://[^"\'\s]*api[^"\'\s]{0,60})', t))[:20]:
    print("abs api:", m)
# buildId
bid = re.search(r'"buildId":"([^"]+)"', t)
print("buildId", bid.group(1) if bid else None)
