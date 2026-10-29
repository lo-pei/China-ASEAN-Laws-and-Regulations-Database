# -*- coding: utf-8 -*-
"""解析 BKPM Next.js 搜索页中的文档数据"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "probe")
t = open(os.path.join(OUT, "bkpm_search_uu25.html"), encoding="utf-8").read()

# 查找文档对象特征
for kw in ["/id/document/", "regulation_number", "penanaman modal", "Penanaman Modal",
           "nomor-25-tahun-2007", "document_type"]:
    idxs = [m.start() for m in re.finditer(re.escape(kw), t)][:5]
    print("KW %-22s count=%d idx=%s" % (kw, len(re.findall(re.escape(kw), t)), idxs))

# 提取 self.__next_f 数据块
blocks = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)', t, re.S)
print("next_f blocks", len(blocks))
blob = "".join(blocks)
blob = blob.encode().decode("unicode_escape", "ignore")
print("blob len", len(blob))
open(os.path.join(OUT, "bkpm_blob.txt"), "w", encoding="utf-8").write(blob)
for m in re.findall(r'/id/document/[a-z0-9\-]+', blob)[:30]:
    print("  doc", m)
for m in re.findall(r'\{[^{}]{0,200}"regulation_number"[^{}]{0,200}\}', blob)[:5]:
    print("  obj", m[:300])
