# -*- coding: utf-8 -*-
"""
CALR 后端 · 数据库访问层

设计
  · 只读连接（SQLite WAL，多线程共享只读池）
  · laws / articles / postings / doc_len 四张表，见 build_db.py
  · 不在本层做检索逻辑，检索见 search.py
"""
from __future__ import annotations

import json
import os
import sqlite3
import threading
from typing import Any, Dict, Iterable, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
DB_PATH = os.environ.get("CALR_DB") or os.path.join(BACKEND, "data", "calr.db")

_local = threading.local()


def conn() -> sqlite3.Connection:
    """每线程一个只读连接。"""
    c = getattr(_local, "conn", None)
    if c is None:
        if not os.path.exists(DB_PATH):
            raise RuntimeError(
                "数据库不存在：%s\n请先运行：python backend/build_db.py" % DB_PATH)
        c = sqlite3.connect(DB_PATH, check_same_thread=False)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA query_only=ON")
        c.execute("PRAGMA cache_size=-64000")     # 64MB 页缓存
        _local.conn = c
    return c


def rows(sql: str, params: Iterable[Any] = ()) -> List[sqlite3.Row]:
    return conn().execute(sql, tuple(params)).fetchall()


def row(sql: str, params: Iterable[Any] = ()) -> Optional[sqlite3.Row]:
    return conn().execute(sql, tuple(params)).fetchone()


def one(sql: str, params: Iterable[Any] = (), default: Any = None) -> Any:
    r = row(sql, params)
    if r is None:
        return default
    return r[0]


def meta() -> Dict[str, str]:
    try:
        return {r["k"]: r["v"] for r in rows("SELECT k,v FROM meta")}
    except sqlite3.Error:
        return {}


# ---------------------------------------------------------------- 序列化
def _j(v, default):
    if v is None or v == "":
        return default
    if isinstance(v, (dict, list)):
        return v
    try:
        return json.loads(v)
    except Exception:
        return v


def law_dict(r: sqlite3.Row, with_articles: bool = False) -> Dict[str, Any]:
    d = {
        "id": r["id"],
        "country": r["country"],
        "countryName": r["country_name"],
        "title": {"zh": r["title_zh"], "en": r["title_en"], "orig": r["title_orig"]},
        "layer": r["layer"],
        "pack": r["pack"],
        "language": _j(r["language"], None),
        "level": r["level"],
        "category": r["category"],
        "status": r["status"],
        "promulgatedDate": r["promulgated"],
        "effectiveDate": r["effective"],
        "versionDate": r["version_date"],
        "amendedNote": _j(r["amended_note"], None),
        "issuingBody": _j(r["issuing_body"], None),
        "docNumber": _j(r["doc_number"], None),
        "officialCode": _j(r["official_code"], None),
        "topics": _j(r["topics"], []),
        "coverage": r["coverage"],
        "structureMode": r["structure_mode"],
        "articleCount": r["article_count"],
        "chars": r["chars"],
        "source": _j(r["source"], None),
        "summary": _j(r["summary"], None),
        "textQuality": _j(r["text_quality"], None),
        "numberingConflict": _j(r["numbering_conflict"], None),
    }
    if with_articles:
        d["articles"] = article_list(r["id"])
    return d


def article_dict(r: sqlite3.Row) -> Dict[str, Any]:
    text = {}
    if r["text_zh"]:
        text["zh"] = r["text_zh"]
    if r["text_en"]:
        text["en"] = r["text_en"]
    if r["text_orig"]:
        text[r["lang"] or "orig"] = r["text_orig"]
    d = {
        "no": r["no"],
        "dupIndex": r["dup_index"],
        "noLabel": _j(r["no_label"], None),
        "heading": _j(r["heading"], None),
        "chapter": _j(r["chapter"], None),
        "partIndex": r["part_index"],
        "text": text,
    }
    return d


def article_list(law_id: str) -> List[Dict[str, Any]]:
    return [article_dict(r) for r in rows(
        "SELECT * FROM articles WHERE law_id=? ORDER BY no, IFNULL(dup_index,1)", (law_id,))]


def list_laws(country: Optional[str] = None, level: Optional[str] = None,
              status: Optional[str] = None, q: Optional[str] = None,
              page: int = 1, size: int = 20) -> Dict[str, Any]:
    where, params = [], []
    if country:
        where.append("country=?")
        params.append(country.upper())
    if level:
        where.append("level=?")
        params.append(level)
    if status:
        where.append("status=?")
        params.append(status)
    if q:
        like = "%" + q.strip() + "%"
        where.append("(title_zh LIKE ? OR title_en LIKE ? OR title_orig LIKE ? OR doc_number LIKE ?)")
        params += [like, like, like, like]
    w = ("WHERE " + " AND ".join(where)) if where else ""
    total = one("SELECT COUNT(*) FROM laws " + w, params, 0)
    size = max(1, min(200, size))
    page = max(1, page)
    rs = rows("SELECT * FROM laws " + w + " ORDER BY id LIMIT ? OFFSET ?",
              params + [size, (page - 1) * size])
    return {
        "total": total, "page": page, "size": size,
        "pages": (total + size - 1) // size,
        "items": [law_dict(r) for r in rs],
    }


def stats() -> Dict[str, Any]:
    m = meta()
    by_country = {r["country"]: r["n"] for r in rows(
        "SELECT country, COUNT(*) n FROM laws GROUP BY country ORDER BY n DESC")}
    by_level = {r["level"]: r["n"] for r in rows(
        "SELECT level, COUNT(*) n FROM laws GROUP BY level ORDER BY n DESC")}
    return {
        "laws": int(m.get("laws") or one("SELECT COUNT(*) FROM laws", default=0)),
        "articles": int(m.get("articles") or one("SELECT COUNT(*) FROM articles", default=0)),
        "terms": int(m.get("terms") or 0),
        "tokens": int(m.get("tokens") or 0),
        "countries": by_country,
        "levels": by_level,
        "builtAt": m.get("built_at"),
        "source": m.get("source"),
    }
