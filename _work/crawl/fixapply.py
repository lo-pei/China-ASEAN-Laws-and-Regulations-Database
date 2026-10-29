# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "_work/crawl/apply.py"
s = io.open(p, encoding="utf-8").read()
bad = """    if newN := 0:
        pass
"""
if bad in s:
    s = s.replace(bad, "")
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已删除无意义的海象运算符行")
else:
    print("  ! 未找到")
