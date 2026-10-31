# -*- coding: utf-8 -*-
"""C 阶段条文切片索引的离线结构测试。

不做 embedding，只验证：
  · manifest / chunk_meta / 向量 / scale 的数量一致；
  · 向量维度与 int8 量化格式；
  · search_articles 能返回合法的 (law_id,no,dup_index) 且按分数降序。

运行：
  python backend/test_chunk_vectors.py

若本机没有 C 索引（仓库默认不含大文件），打印 SKIP 并以 0 退出；
部署机/CI 制件检查时再设置 CALR_CHUNK_VEC 指向产物目录。
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.app import chunk_vectors  # noqa: E402


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + ((" · " + detail) if detail else ""))
    return 1 if cond else 0


def main():
    if not chunk_vectors.load():
        print("SKIP C 索引不存在或未就绪：%s" % chunk_vectors.VEC)
        return 0

    man = chunk_vectors._store["manifest"]
    meta = chunk_vectors._store["meta"]
    q = chunk_vectors._store["q"]
    s = chunk_vectors._store["s"]

    passed = total = 0
    total += 1
    passed += check("manifest 与 meta 数量一致", man.get("count") == len(meta),
                    "manifest=%s meta=%s" % (man.get("count"), len(meta)))
    total += 1
    passed += check("向量矩阵行数一致", q.shape[0] == man.get("count"), str(q.shape))
    total += 1
    passed += check("scale 长度一致", s.shape[0] == man.get("count"), str(s.shape))
    total += 1
    passed += check("向量维度 1024、int8", q.shape[1:] == (1024,) and q.dtype == np.int8,
                    "%s %s" % (q.shape, q.dtype))

    rng = np.random.default_rng(7)
    qv = rng.normal(size=1024).astype(np.float32)
    qv /= np.linalg.norm(qv)
    hits = chunk_vectors.search_articles(qv, topk=20)
    total += 1
    passed += check("search_articles 返回非空", bool(hits), "n=%d" % len(hits))
    total += 1
    keys_ok = all(isinstance(m, dict) and m.get("law_id") for m, _ in hits)
    passed += check("结果含合法条文键", keys_ok)
    total += 1
    scores = [sc for _, sc in hits]
    passed += check("结果按分数降序", scores == sorted(scores, reverse=True),
                    str([round(x, 4) for x in scores[:3]]))

    print("\n%d/%d passed" % (passed, total))
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
