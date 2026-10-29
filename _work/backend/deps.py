# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"_work/pylibs")
print("=== 后端依赖检查 ===")
for mod in ["fastapi","uvicorn","pydantic","starlette","httpx","jinja2","python_multipart"]:
    try:
        m = __import__(mod)
        print("  OK  %-18s %s" % (mod, getattr(m, "__version__", "")))
    except Exception:
        print("  --  %-18s 未安装" % mod)
print()
import sqlite3
print("  sqlite3 版本: %s" % sqlite3.sqlite_version)
con = sqlite3.connect(":memory:")
try:
    con.execute("CREATE VIRTUAL TABLE t USING fts5(x)")
    print("  FTS5: 可用")
except Exception as e:
    print("  FTS5: 不可用 (%s)" % e)
con.close()
print()
print("  python: %s" % sys.version.split()[0])
