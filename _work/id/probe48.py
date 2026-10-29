# -*- coding: utf-8 -*-
"""在 pasal.id 页面中寻找懒加载接口路径"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(HERE, "probe", "pasal_uu13.html"), encoding="utf-8").read()
# 查找包含 pasal 的 API 路径字面量
pats = set()
for m in re.finditer(r'"(/[A-Za-z0-9_\-/\[\]\.]*pasal[A-Za-z0-9_\-/\[\]\.]*)"', t):
    pats.add(m.group(1))
for m in re.finditer(r"'(/[A-Za-z0-9_\-/\[\]\.]*pasal[A-Za-z0-9_\-/\[\]\.]*)'", t):
    pats.add(m.group(1))
for p in sorted(pats)[:40]:
    print("API候选:", p)
print("---- loadMore 附近 ----")
i = t.find("loadMorePasals")
print(t[max(0, i - 1500):i + 1500])
