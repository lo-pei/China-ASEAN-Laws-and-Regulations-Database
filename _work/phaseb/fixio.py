# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
p = "_work/phaseb/embed.py"
s = io.open(p, encoding="utf-8").read()
o = s
if "\nimport io\n" not in s:
    s = s.replace("import argparse\nimport json", "import argparse\nimport io\nimport json", 1)
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ 已补 import io")
else:
    print("  - import io 已存在")
