# -*- coding: utf-8 -*-
"""
CALR 后端 · 向量检索 + 与 BM25 的 RRF 融合

思路
  1. BM25（法规级，词面匹配）—— 对文号、专有名词、精确表述强
  2. 向量（bge-m3，语义匹配）—— 对同义改写、跨语言、口语化提问强
  3. RRF（Reciprocal Rank Fusion）融合两路排名 —— 不需要调权重、对分数量纲不敏感

向量存储（backend/data/vectors/）
  law_ids.json        id 顺序
  law_vecs.i8.npy     int8 向量（N × 1024）
  law_scale.npy       每行反量化 scale
  article_meta.json   条文元数据
  article_vecs.i8.npy 条文向量
  article_scale.npy
  manifest.json

int8 反量化 + 余弦：
  q · (v * scale) = scale * (q · v)
  由于向量都已 L2 归一化，点积即余弦相似度。
"""
from __future__ import annotations

import json
import os
import threading
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
VEC = os.environ.get("CALR_VEC") or os.path.join(BACKEND, "data", "vectors")

_lock = threading.Lock()
_store: Dict[str, Any] = {}


def _load(name: str):
    return np.load(os.path.join(VEC, name))


def load() -> bool:
    """懒加载向量索引；失败返回 False（调用方降级为纯 BM25）。"""
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
            if "law" in man:
                with open(os.path.join(VEC, "law_ids.json"), encoding="utf-8") as f:
                    _store["law_ids"] = json.load(f)
                _store["law_q"] = _load("law_vecs.i8.npy")
                _store["law_s"] = _load("law_scale.npy")
                _store["law_pos"] = {lid: i for i, lid in enumerate(_store["law_ids"])}
            if "article" in man:
                with open(os.path.join(VEC, "article_meta.json"), encoding="utf-8") as f:
                    _store["art_meta"] = json.load(f)
                _store["art_q"] = _load("article_vecs.i8.npy")
                _store["art_s"] = _load("article_scale.npy")
            _store["manifest"] = man
            _store["ready"] = True
            return True
        except Exception as e:
            _store["error"] = str(e)
            return False


def info() -> Dict[str, Any]:
    if not load():
        return {"ready": False, "error": _store.get("error"), "path": VEC}
    man = _store.get("manifest") or {}
    return {"ready": True, "path": VEC, "manifest": man}


def _cos(q: np.ndarray, Q: np.ndarray, S: np.ndarray) -> np.ndarray:
    """int8 量化向量的近似余弦（q 已归一化，Q 行已归一化后量化）。"""
    # (N, dim) int8 与 (dim,) float32 相乘：先转 float32 再乘 scale
    sims = (Q.astype(np.float32) @ q.astype(np.float32)) * S
    return sims


def search_laws(qvec: np.ndarray, topk: int = 50) -> List[Tuple[str, float]]:
    """返回 [(law_id, 余弦分数)]，按分数降序。"""
    if not load():
        return []
    Q, S, ids = _store["law_q"], _store["law_s"], _store["law_ids"]
    sims = _cos(qvec, Q, S)
    k = min(topk, sims.shape[0])
    if k <= 0:
        return []
    idx = np.argpartition(-sims, k - 1)[:k]
    idx = idx[np.argsort(-sims[idx])]
    return [(ids[int(i)], float(sims[int(i)])) for i in idx]


def search_articles(qvec: np.ndarray, topk: int = 100,
                    law_ids: Optional[List[str]] = None) -> List[Tuple[Dict[str, Any], float]]:
    """返回 [({"law_id","no","dup_index"}, 分数)]；可限定在若干法规内。"""
    if not load() or "art_q" not in _store:
        return []
    Q, S, meta = _store["art_q"], _store["art_s"], _store["art_meta"]
    if law_ids:
        want = set(law_ids)
        rows = [i for i, m in enumerate(meta) if m["law_id"] in want]
        if not rows:
            return []
        sub = np.array(rows, dtype=np.int64)
        sims = _cos(qvec, Q[sub], S[sub])
        k = min(topk, sims.shape[0])
        order = np.argsort(-sims)[:k]
        return [(meta[int(sub[int(j)])], float(sims[int(j)])) for j in order]
    sims = _cos(qvec, Q, S)
    k = min(topk, sims.shape[0])
    if k <= 0:
        return []
    idx = np.argpartition(-sims, k - 1)[:k]
    idx = idx[np.argsort(-sims[idx])]
    return [(meta[int(i)], float(sims[int(i)])) for i in idx]


def rrf(rankings: List[List[str]], k: int = 60, weights: Optional[List[float]] = None) -> List[Tuple[str, float]]:
    """Reciprocal Rank Fusion。

    rankings: 多路排名，每路是 id 的有序列表
    k:        RRF 平滑常数（经典取 60）
    weights:  各路权重，默认等权
    返回 [(id, score)]，按融合分数降序。
    """
    if weights is None:
        weights = [1.0] * len(rankings)
    acc: Dict[str, float] = {}
    for path, w in zip(rankings, weights):
        for rank, cid in enumerate(path):
            acc[cid] = acc.get(cid, 0.0) + w / (k + rank + 1)
    return sorted(acc.items(), key=lambda x: -x[1])


def stats_text() -> str:
    if not load():
        return "vectors: 未加载（%s）" % (_store.get("error") or "无 manifest")
    man = _store.get("manifest") or {}
    parts = []
    for key, label in (("law", "法规"), ("article", "条文")):
        if key in man:
            parts.append("%s %s 条 × %s 维" % (label, man[key].get("count"), man[key].get("dim")))
    return "vectors: " + " / ".join(parts) + "（%s）" % man.get("model")
