# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "backend/app/main.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''def _fmt_no(no) -> str:''',
'''def _num_no(no):
    """条号整数化（REAL 存的 21.0 → 21）。"""
    if no is None:
        return None
    try:
        f = float(no)
        return int(f) if f == int(f) else f
    except (TypeError, ValueError):
        return no


def _fmt_no(no) -> str:''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已补 _num_no")
else:
    print("  ! 锚点未命中")
