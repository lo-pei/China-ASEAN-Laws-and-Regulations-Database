import io
p = "_work/title-import/docsync.py"
s = io.open(p, encoding="utf-8").read()
s = s.replace("import io, sys", "import io, os, sys", 1)
io.open(p, "w", encoding="utf-8").write(s)
print("  ✓ 已补 import os")
