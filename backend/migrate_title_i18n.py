#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给现有 calr.db 回填 title_i18n 列（多语种标题）。

背景：旧 build_db.py 只存 title_zh/en/orig，API 模式丢失 vi/th/id/ms 标题，
语言切换时会回退到中文/英文。这里从 prototype/data/laws/*.json 的 title 字典回填。

用法：
  python backend/migrate_title_i18n.py
  CALR_DB=/opt/calr/backend/data/calr.db python backend/migrate_title_i18n.py
"""
from __future__ import annotations

import glob
import json
import os
import sqlite3
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.environ.get("CALR_DB") or os.path.join(ROOT, "backend", "data", "calr.db")
LAWS = os.path.join(ROOT, "prototype", "data", "laws")


def main():
    con = sqlite3.connect(DB)
    cols = [r[1] for r in con.execute("PRAGMA table_info(laws)")]
    if "title_i18n" not in cols:
        con.execute("ALTER TABLE laws ADD COLUMN title_i18n TEXT")
        print("added column laws.title_i18n", flush=True)
    else:
        print("column exists laws.title_i18n", flush=True)

    n = 0
    batch = []
    for p in sorted(glob.glob(os.path.join(LAWS, "*.json"))):
        if os.path.basename(p) == "index.json":
            continue
        try:
            o = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        lid = o.get("id") or os.path.basename(p)[:-5]
        title = o.get("title") or {}
        if not isinstance(title, dict):
            continue
        batch.append((json.dumps(title, ensure_ascii=False), lid))
        n += 1
        if len(batch) >= 500:
            con.executemany("UPDATE laws SET title_i18n=? WHERE id=?", batch)
            batch = []
    if batch:
        con.executemany("UPDATE laws SET title_i18n=? WHERE id=?", batch)
    con.commit()
    done = con.execute("SELECT COUNT(*) FROM laws WHERE title_i18n IS NOT NULL").fetchone()[0]
    print("updated %d laws; non-null %d" % (n, done), flush=True)
    con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
