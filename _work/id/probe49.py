# -*- coding: utf-8 -*-
"""测试 pasal.id 单条条文页面是否可用（用于补齐被截断的条文）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "tools")))
import harvest as H

OUT = os.path.join(HERE, "probe")
tests = [
    ("p126", "https://pasal.id/peraturan/uu/uu-no-13-tahun-2003/pasal-126"),
    ("p194", "https://pasal.id/peraturan/uu/uu-no-13-tahun-2003/pasal-194"),
]
for tag, u in tests:
    try:
        t = H.get_text(u, retries=1, timeout=45)
        open(os.path.join(OUT, "pasal_single_%s.html" % tag), "w", encoding="utf-8").write(t)
        arts = re.findall(r'<article id="pasal-([^"]+)"', t)
        print("OK  %-8s len=%d articles=%d first=%s last=%s" % (tag, len(t), len(arts), arts[0] if arts else "-", arts[-1] if arts else "-"))
        # 抽取该条正文
        i = t.find('id="pasal-126"')
        if i < 0:
            i = t.find('id="pasal-194"')
        seg = t[i:i + 3000]
        txt = re.sub(r"<[^>]+>", " ", seg)
        print("    ", re.sub(r"\s+", " ", txt)[:400])
    except Exception as e:
        print("ERR %-8s %s" % (tag, str(e)[:100]))
