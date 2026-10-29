# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"D:\A项目\Database_China–ASEAN Laws and Regulations Database\_work\pylibs")
for mod in ["fastapi","uvicorn","starlette","pydantic","httpx"]:
    try:
        m = __import__(mod); print("  OK  %-12s %s" % (mod, getattr(m,"__version__","")))
    except Exception as e:
        print("  --  %-12s %s" % (mod, e))
