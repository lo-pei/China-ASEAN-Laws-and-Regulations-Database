# -*- coding: utf-8 -*-
"""
CALR 后端 · 混合检索（BM25 + 向量 + RRF）

为什么这样融合
  · BM25 强在「字面精确」：文号、专有名词、法规全称、条号
  · 向量强在「语义等价」：同义改写、口语化、跨语言（中文问 → 泰文条文）
  · RRF 只看排名不看分数，避免了 BM25 分数（几十到一百多）与余弦（0~1）
    量纲完全不同、无法直接加权的问题；也不需要为每个查询调参。

融合策略（可调）
  · 默认 1:1 等权
  · 当查询很短（≤4 个字符）时降低向量权重 —— 短查询的 embedding 不稳定
  · 当 BM25 命中标题精确匹配时提高 BM25 权重 —— 说明用户就在找这一部法
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from . import search as bm25_mod
from . import vectors as vec_mod
from . import embedder


def _embed_query(q: str) -> Optional[Any]:
    emb = embedder.get()
    if emb is None:
        return None
    try:
        return emb.encode([q])[0]
    except Exception:
        return None


_COUNTRY_CACHE: Dict[str, Optional[str]] = {}


def _country_of(law_id: str) -> Optional[str]:
    """法规 id → 国别（带缓存，融合排序时会反复问）。"""
    if law_id in _COUNTRY_CACHE:
        return _COUNTRY_CACHE[law_id]
    r = bm25_mod.db.row("SELECT country FROM laws WHERE id=?", (law_id,))
    c = r["country"] if r else None
    _COUNTRY_CACHE[law_id] = c
    return c


def hybrid_search(q: str, mode: str = "hybrid", country: Optional[str] = None,
                  level: Optional[str] = None, status: Optional[str] = None,
                  page: int = 1, size: int = 20,
                  bm25_weight: float = 1.0, vec_weight: float = 1.0) -> Dict[str, Any]:
    """BM25 + 向量 RRF 融合检索。

    返回结构与 search.search 一致，额外带：
      fusion: {bm25Weight, vecWeight, vecReady, candidates}
    """
    q = (q or "").strip()

    # 纯 BM25（作为基础，也是向量不可用时的唯一来源）
    base = bm25_mod.search(q=q, mode=("semantic" if mode in ("hybrid", "semantic") else "keyword"),
                           country=country, level=level, status=status,
                           page=1, size=2000)

    if not q:
        # 空查询直接走列表
        return {**base, "fusion": {"vecReady": False, "reason": "empty-query"}}

    # 向量路
    qvec = _embed_query(q) if vec_mod.load() else None
    vec_scores: List[Tuple[str, float]] = []
    if qvec is not None:
        vec_scores = vec_mod.search_laws(qvec, topk=300)

    if not vec_scores:
        out = bm25_mod.search(q=q, mode=("semantic" if mode in ("hybrid", "semantic") else "keyword"),
                              country=country, level=level, status=status,
                              page=page, size=size)
        out["fusion"] = {"vecReady": False, "candidates": len(base["items"]),
                         "reason": "向量索引不可用，降级为纯 BM25"}
        return out

    # 两路排名
    bm25_rank = [it["id"] for it in base["items"]]
    vec_rank = [lid for lid, _ in vec_scores]

    # 权重策略
    bw, vw = bm25_weight, vec_weight
    if len(q) <= 4:
        vw *= 0.7          # 极短查询 embedding 不稳，略降权

    # 国别意图：问句里明确提到某国（如「越南外商投资准入」）时，
    # 只保留该国结果。否则会出现「问越南，答中国」的错。
    detected = bm25_mod.detect_countries(q)
    if detected and not country:
        want = set(detected)
        keep_b = [lid for lid in bm25_rank
                  if _country_of(lid) in want]
        keep_v = [lid for lid in vec_rank
                  if _country_of(lid) in want]
        if keep_b or keep_v:
            bm25_rank, vec_rank = keep_b, keep_v
        else:
            detected = []          # 该国无任何结果，退回不限制

    fused = vec_mod.rrf([bm25_rank, vec_rank], k=60, weights=[bw, vw])
    total = len(fused)

    # 过滤 + 分页
    if country or level or status:
        keep = []
        for lid, s in fused:
            r = bm25_mod.db.row(
                "SELECT country,level,status FROM laws WHERE id=?", (lid,)) if bm25_mod else None
            if not r:
                continue
            if country and r["country"] != country.upper():
                continue
            if level and r["level"] != level:
                continue
            if status and r["status"] != status:
                continue
            keep.append((lid, s))
        fused = keep
        total = len(fused)

    size = max(1, min(200, size))
    page = max(1, page)
    start = (page - 1) * size
    page_items = fused[start:start + size]

    ids = [lid for lid, _ in page_items]
    items = []
    if ids:
        ph = ",".join("?" * len(ids))
        rs = {r["id"]: r for r in bm25_mod.db.rows(
            "SELECT * FROM laws WHERE id IN (" + ph + ")", ids)}
        vmap = dict(vec_scores)
        bmap = {it["id"]: it.get("score") for it in base["items"]}
        for lid, s in page_items:
            r = rs.get(lid)
            if not r:
                continue
            d = bm25_mod.db.law_dict(r)
            d["score"] = round(float(s), 6)
            d["debug"] = {
                "rrf": round(float(s), 6),
                "bm25": bmap.get(lid),
                "cosine": round(float(vmap.get(lid, 0.0)), 4),
                "bm25Rank": (bm25_rank.index(lid) + 1) if lid in bm25_rank else None,
                "vecRank": (vec_rank.index(lid) + 1) if lid in vec_rank else None,
            }
            items.append(d)

    return {
        "total": total, "page": page, "size": size,
        "pages": (total + size - 1) // size,
        "items": items, "query": q, "mode": mode,
        "fusion": {
            "vecReady": True,
            "bm25Weight": bw, "vecWeight": vw,
            "bm25Candidates": len(bm25_rank),
            "vecCandidates": len(vec_rank),
        },
    }
