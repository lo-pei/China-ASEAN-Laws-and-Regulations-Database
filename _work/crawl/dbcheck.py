# -*- coding: utf-8 -*-
import io, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
for f in ["backend/build_db.py", "backend/app/db.py"]:
    if not os.path.exists(f): continue
    s = io.open(f, encoding="utf-8").read()
    print("  === %s (%d 字节) ===" % (f, len(s)))
    for m in re.finditer(r"CREATE TABLE[^;]{0,200}", s, re.I):
        print("    " + m.group(0).split("\n")[0][:100])
    print()
