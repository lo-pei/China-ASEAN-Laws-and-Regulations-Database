# -*- coding: utf-8 -*-
"""C 阶段条文切片向量检索（独立于 vectors.py 的 A 索引）。

输出目录默认 backend/data/vectors-chunks/：
  chunk_meta.json       [{law_id,no,dup_index,chunk_index,lang}, ...]
  chunk_vecs.i8.npy
  chunk_scale.npy
  manifest.json

查询时计算 chunk 余弦，按 (law_id,no,dup_index) 聚合取 max，返回条文级结果。
"""
from __future__ import annotations

import json
import os
import threading
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
VEC = os.environ.get("CALR_CHUNK_VEC") or os.path.join(BACKEND, "data", "vectors-chunks")

_lock = threading.Lock()
_store: Dict[str, Any] = {}


def load() -> bool:
    if _store.get("ready"):
        return True
    with _lock:
        if _store.get("ready"):
            return True
        try:
            man_path = os.path.join(VEC, "manifest.json")
            if not os.path.exists(man_path):
                return False
            with open(man_path, encoding="utf-8") as f:
                man = json.load(f)
            with open(os.path.join(VEC, "chunk_meta.json"), encoding="utf-8") as f:
                _store["meta"] = json.load(f)
            _store["q"] = np.load(os.path.join(VEC, "chunk_vecs.i8.npy"))
            _store["s"] = np.load(os.path.join(VEC, "chunk_scale.npy"))
            _store["manifest"] = man
            _store["ready"] = True
            return True
        except Exception as e:
            _store["error"] = str(e)
            return False


def info() -> Dict[str, Any]:
    if not load():
        return {"ready": False, "error": _store.get("error"), "path": VEC}
    return {"ready": True, "path": VEC, "manifest": _store.get("manifest")}


def search_articles(qvec: np.ndarray, topk: int = 100,
                    law_ids: Optional[List[str]] = None) -> List[Tuple[Dict[str, Any], float]]:
    """返回条文级 [(meta, max cosine)]；同一 (law_id,no,dup_index) 取最高分。"""
    if not load():
        return []
    Q, S, meta = _store["q"], _store["s"], _store["meta"]
    if law_ids:
        want = set(law_ids)
        rows = np.array([i for i, m in enumerate(meta) if m["law_id"] in want], dtype=np.int64)
        if rows.size == 0:
            return []
        sub_q, sub_s = Q[rows], S[rows]
        sims = (sub_q.astype(np.float32) @ qvec.astype(np.float32)) * sub_s
        k = min(max(topk, 1), sims.shape[0])
        idx = np.argsort(-sims)[:k]
        pairs = [(int(rows[int(i)]), float(sims[int(i)])) for i in idx]
    else:
        sims = (Q.astype(np.float32) @ qvec.astype(np.float32)) * S
        k = min(max(topk, 1), sims.shape[0])
        idx = np.argpartition(-sims, k - 1)[:k]
        idx = idx[np.argsort(-sims[idx])]
        pairs = [(int(i), float(sims[int(i)])) for i in idx]
    best: Dict[Tuple[str, Any, Any], Tuple[Dict[str, Any], float]] = {}
    for i, sc in pairs:
        m = meta[i]
        key = (m["law_id"], m.get("no"), m.get("dup_index"))
        if key not in best or sc > best[key][1]:
            best[key] = (m, sc)
    return sorted(best.values(), key=lambda x: -x[1])
