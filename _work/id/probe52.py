# -*- coding: utf-8 -*-
"""查找 pasal.id 的加载更多接口（offset 参数）"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(HERE, "probe", "pasal_uu13.html"), encoding="utf-8").read()
# 收集引用的 JS chunk
chunks = sorted(set(re.findall(r'src="(/_next/static/[^"]+\.js)"', t)))
print("chunks", len(chunks))
for c in chunks[:40]:
    print("  ", c)
# 找 offset 附近的上下文
for m in list(re.finditer(r"initialOffset", t))[:3]:
    print("----", m.start())
    print(t[max(0, m.start() - 600):m.start() + 400])
