# -*- coding: utf-8 -*-
"""抓取 jdih.setneg Next.js chunk 找 API base"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
os.makedirs(OUT, exist_ok=True)

chunks = [
    "https://jdih.setneg.go.id/_next/static/chunks/pages/peraturan-739910c3ed885b56.js",
    "https://jdih.setneg.go.id/_next/static/chunks/pages/_app-f484f4ad3f5604ee.js",
    "https://jdih.setneg.go.id/_next/static/chunks/main-eee884f8a74d0ba6.js",
]
for u in chunks:
    name = u.split("/")[-1]
    try:
        t = H.get_text(u, retries=2, timeout=30)
        open(os.path.join(OUT, name), "w", encoding="utf-8").write(t)
        print("== ", name, len(t))
        for pat in [r'https?://[a-z0-9\.\-]+\.[a-z]{2,}/[A-Za-z0-9_\-/\.]{0,50}',
                    r'["\']/[a-z0-9_\-/]{2,60}["\']']:
            hits = sorted(set(re.findall(pat, t)))
            interesting = [h for h in hits if any(k in h.lower() for k in
                           ("api", "peraturan", "produk", "v1", "backend", "service", "list", "search", "unduh", "download"))]
            for h in interesting[:40]:
                print("   ", h[:120])
    except Exception as e:
        print("ERR", u, str(e)[:120])
