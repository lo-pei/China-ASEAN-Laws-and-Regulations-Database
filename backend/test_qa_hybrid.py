# -*- coding: utf-8 -*-
"""离线验证 /api/qa 的混合召回逻辑（不加载向量模型）。

运行：
  python backend/test_qa_hybrid.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.app import qa  # noqa: E402


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" · " + detail) if detail else ""))
    return cond


def main():
    passed = 0
    total = 0

    total += 1
    r = qa.retrieve("越南外商投资准入条件", topk=3, use_vectors=False)
    cs = r.get("citations") or []
    passed += check("国别前置：越南", bool(cs) and all(c["country"] == "VN" for c in cs),
                    "mode=%s n=%d countries=%s" % (r.get("mode"), len(cs), r.get("diagnostics", {}).get("countries")))

    total += 1
    r = qa.retrieve("马来西亚个人数据保护", topk=3, use_vectors=False)
    cs = r.get("citations") or []
    passed += check("国别前置：马来西亚", bool(cs) and all(c["country"] == "MY" for c in cs),
                    "mode=%s n=%d" % (r.get("mode"), len(cs)))

    total += 1
    r = qa.retrieve("数据法", country="CN", topk=3, use_vectors=False)
    cs = r.get("citations") or []
    passed += check("BM25 条文候选", bool(cs) and all(c["country"] == "CN" for c in cs),
                    "mode=%s n=%d" % (r.get("mode"), len(cs)))

    total += 1
    r = qa.retrieve("", topk=3)
    passed += check("空问题", r.get("mode") == "empty" and not r.get("citations"))

    # RRF：伪造向量路，验证融合后 mode 与 debug 字段；不依赖实际向量模型
    orig = qa._vector_articles

    def fake_vec(q, countries, topk):
        hit = qa.db.row("SELECT law_id,no,IFNULL(dup_index,1) dup FROM articles LIMIT 1")
        if not hit:
            return [], True, "empty"
        return [((hit["law_id"], hit["no"], hit["dup"]), 0.99)], True, ""

    try:
        qa._vector_articles = fake_vec
        total += 1
        r = qa.retrieve("数据法", topk=3, use_vectors=True)
        cs = r.get("citations") or []
        passed += check("RRF 融合路径", r.get("mode") in ("hybrid-rrf", "bm25-article"),
                        "mode=%s n=%d" % (r.get("mode"), len(cs)))
    finally:
        qa._vector_articles = orig

    print("\n%d/%d passed" % (passed, total))
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
