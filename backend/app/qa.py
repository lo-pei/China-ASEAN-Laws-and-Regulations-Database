# -*- coding: utf-8 -*-
"""
CALR 后端 · 问答检索（BM25 条文候选 + 向量候选 + RRF + 阈值）

设计目标（ROI 优先，不做重嵌也能先改善）：
  1. 国别前置：问句/请求明确法域时，先取该国 law_id，BM25 与向量都只在该国召回；
  2. BM25 条文候选：法规级 BM25 取候选法，再在法内做条文打分，补住向量未覆盖的新法；
  3. RRF 融合：两路按排名融合，不做分数归一化；
  4. 阈值：只有 BM25 命中，或向量余弦 >= CALR_QA_VEC_MIN 的条文才保留；
     没有任何候选时返回空 citations + 说明，不硬塞低相关条文。

环境变量：
  CALR_QA_VEC_MIN     向量余弦阈值，默认 0.30
  CALR_QA_RRF_K       RRF 常数，默认 60
  CALR_QA_BM25_LAWS   法规级 BM25 候选法数，默认 20
  CALR_QA_BM25_ARTS   每部候选法取几条条文，默认 3
  CALR_QA_VEC_TOPK    向量条文 topk 倍数，默认 10（乘 topk）
"""
from __future__ import annotations

import json
import os
import re
import threading
from typing import Any, Dict, List, Optional, Tuple

from . import db, search as search_mod, vectors as vec_mod, embedder
from . import chunk_vectors as chunk_mod

VEC_MIN = float(os.environ.get("CALR_QA_VEC_MIN", "0.30"))
RRF_K = int(os.environ.get("CALR_QA_RRF_K", "60"))
BM25_LAWS = int(os.environ.get("CALR_QA_BM25_LAWS", "20"))
BM25_ARTS = int(os.environ.get("CALR_QA_BM25_ARTS", "3"))

_CACHE_LOCK = threading.Lock()
_LAW_IDS_BY_COUNTRY: Dict[str, List[str]] = {}
_BM25_ERROR = ""


def _fmt_no(no) -> str:
    if no is None:
        return ""
    try:
        f = float(no)
        return str(int(f)) if f == int(f) else str(no)
    except (TypeError, ValueError):
        return str(no)


def _label(raw, no) -> str:
    v = raw
    if isinstance(v, str):
        try:
            v = json.loads(v)
        except Exception:
            v = raw
    if isinstance(v, dict):
        for k in ("zh", "en", "orig"):
            s = str(v.get(k) or "").strip()
            # no_label 偶尔被写成条标题/句子（如 "3. The market access..."），
            # 这种情况回退到条号，避免依据列表显示成一句话。
            if s and len(s) <= 48 and not re.search(r"[。.!?;；]", s):
                return s
    return _fmt_no(no)


def _body_key(text: Dict[str, Any]) -> str:
    """跨重复法规记录收敛同一条文：正文前 80 字。"""
    for k in ("zh", "en", "orig"):
        v = (text or {}).get(k)
        if v:
            return " ".join(str(v).split())[:80]
    return ""


def _law_ids_for(countries: List[str]) -> List[str]:
    """国别前置过滤用：返回这些国家的全部 law_id（缓存）。"""
    if not countries:
        return []
    key = "|".join(sorted(set(countries)))
    with _CACHE_LOCK:
        if key in _LAW_IDS_BY_COUNTRY:
            return _LAW_IDS_BY_COUNTRY[key]
    ph = ",".join("?" * len(countries))
    rows = db.rows("SELECT id FROM laws WHERE country IN (" + ph + ")", [c.upper() for c in countries])
    ids = [r["id"] for r in rows]
    with _CACHE_LOCK:
        _LAW_IDS_BY_COUNTRY[key] = ids
    return ids


def _bm25_article_rank(q: str, countries: List[str]) -> List[Tuple[Tuple[str, Any, Any], int]]:
    """BM25 条文候选：法规级 BM25 → 法内 article_hits → 去重排名。"""
    global _BM25_ERROR
    order: List[Tuple[str, Any, Any]] = []
    seen = set()
    errors: List[str] = []

    def take(items):
        for it in items:
            for h in search_mod.article_hits(q, it["id"], limit=BM25_ARTS):
                a = h["article"]
                key = (it["id"], a.get("no"), a.get("dupIndex"))
                if key in seen:
                    continue
                seen.add(key)
                order.append(key)

    if countries:
        # 每个明确法域取候选，避免“问越南、中国法占满前 20”
        for c in countries:
            try:
                res = search_mod.search(q=q, mode="semantic", country=c, page=1, size=BM25_LAWS)
                take(res.get("items") or [])
            except Exception as e:
                errors.append("%s:%s" % (c, type(e).__name__))
                continue
    else:
        try:
            res = search_mod.search(q=q, mode="semantic", page=1, size=BM25_LAWS)
            take(res.get("items") or [])
        except Exception as e:
            errors.append(type(e).__name__)
    _BM25_ERROR = ";".join(errors)
    return [(k, i + 1) for i, k in enumerate(order)]


def _vector_articles(q: str, countries: List[str], topk: int) -> Tuple[List[Tuple[Tuple[str, Any, Any], float]], bool, str]:
    """向量条文候选；优先 C 阶段 chunk 索引，未构建时回退 A 索引。"""
    use_chunks = os.environ.get("CALR_QA_CHUNKS", "1") != "0" and chunk_mod.load()
    if not use_chunks and not vec_mod.load():
        return [], False, "vector-index-unavailable"
    emb = embedder.get()
    if emb is None:
        return [], False, "embedder-unavailable"
    try:
        qv = emb.encode([q])[0]
        law_ids = _law_ids_for(countries) if countries else None
        if countries and not law_ids:
            return [], True, "country-no-laws"
        if use_chunks:
            hits = chunk_mod.search_articles(qv, topk=max(topk, 1), law_ids=law_ids)
        else:
            hits = vec_mod.search_articles(qv, topk=max(topk, 1), law_ids=law_ids)
        return [((m["law_id"], m.get("no"), m.get("dup_index")), float(s)) for m, s in hits], True, ""
    except Exception as e:
        return [], True, "vector-error:%s" % type(e).__name__


def _cite(key: Tuple[str, Any, Any], fused: float, debug: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    lid, no, dup = key
    r = db.row("SELECT country,title_zh,title_en,title_orig FROM laws WHERE id=?", (lid,))
    if not r:
        return None
    a = db.row("SELECT text_zh,text_en,text_orig,lang,no_label,heading FROM articles "
               "WHERE law_id=? AND no=? AND IFNULL(dup_index,1)=IFNULL(?,1)",
               (lid, no, dup))
    if not a:
        return None
    text = {}
    if a["text_zh"]:
        text["zh"] = a["text_zh"]
    if a["text_en"]:
        text["en"] = a["text_en"]
    if a["text_orig"]:
        text[a["lang"] or "orig"] = a["text_orig"]
    return {
        "lawId": lid,
        "lawTitle": {"zh": r["title_zh"], "en": r["title_en"], "orig": r["title_orig"]},
        "country": r["country"],
        "no": no,
        "noLabel": _label(a["no_label"], no),
        "heading": a["heading"],
        "text": text,
        "score": round(float(fused), 6),
        "debug": debug,
    }


def retrieve(question: str, country: Optional[str] = None, topk: int = 5,
             use_vectors: bool = True) -> Dict[str, Any]:
    """问答检索入口；返回结构兼容旧 /api/qa：citations + mode + note。"""
    q = (question or "").strip()
    topk = max(1, min(20, int(topk or 5)))
    if not q:
        return {"question": question, "mode": "empty", "citations": [], "note": "问题为空。"}

    # 国别前置：显式 country 优先，否则识别问句中的国家
    if country:
        countries = [country.upper()]
    else:
        try:
            countries = search_mod.detect_countries(q)
        except Exception:
            countries = []

    bm25_rank = _bm25_article_rank(q, countries)
    bm25_pos = {k: i + 1 for k, i in bm25_rank}
    bm25_keys = list(bm25_pos)

    vec_hits: List[Tuple[Tuple[str, Any, Any], float]] = []
    vec_ready = False
    vec_reason = "disabled"
    if use_vectors:
        vec_hits, vec_ready, vec_reason = _vector_articles(q, countries, topk * 10)
    vec_pos = {k: i + 1 for i, (k, _) in enumerate(vec_hits)}
    vec_score = {k: s for k, s in vec_hits}

    # RRF：两路都按排名；没有向量的路不参与分母
    fused: Dict[Tuple[str, Any, Any], float] = {}
    for k in bm25_keys:
        fused[k] = fused.get(k, 0.0) + 1.0 / (RRF_K + bm25_pos[k])
    for k in vec_pos:
        # 阈值：BM25 没命中的纯向量结果必须过余弦门槛
        if k not in bm25_pos and vec_score.get(k, 0.0) < VEC_MIN:
            continue
        fused[k] = fused.get(k, 0.0) + 1.0 / (RRF_K + vec_pos[k])

    ranked = sorted(fused.items(), key=lambda x: -x[1])
    cites: List[Dict[str, Any]] = []
    seen_body = set()
    for k, s in ranked:
        dbg = {"bm25Rank": bm25_pos.get(k), "vecRank": vec_pos.get(k),
               "cosine": round(float(vec_score.get(k, 0.0)), 4)}
        c = _cite(k, s, dbg)
        if not c:
            continue
        bk = _body_key(c.get("text") or {})
        if bk and bk in seen_body:
            continue
        if bk:
            seen_body.add(bk)
        cites.append(c)
        if len(cites) >= topk:
            break

    if cites:
        mode = "hybrid-rrf" if use_vectors and vec_ready else "bm25-article"
        note = ("BM25 条文候选 + 向量候选 RRF 融合；国别前置过滤，纯向量结果需过阈值 %.2f。" % VEC_MIN) \
            if mode == "hybrid-rrf" else "BM25 条文候选（向量不可用或已关闭，仍有国别前置过滤）。"
    else:
        mode = "no-hit"
        note = "未检索到达到阈值的相关条文；请补充法域或换关键词。" if use_vectors else "未检索到相关条文。"
        if vec_reason:
            note += "（%s）" % vec_reason

    return {
        "question": question,
        "mode": mode,
        "note": note,
        "citations": cites,
        "diagnostics": {
            "countries": countries,
            "bm25Candidates": len(bm25_keys),
            "vecCandidates": len(vec_hits),
            "vecReady": vec_ready,
            "vecReason": vec_reason,
            "vecMin": VEC_MIN,
            "rrfK": RRF_K,
            "bm25Error": _BM25_ERROR,
        },
    }
