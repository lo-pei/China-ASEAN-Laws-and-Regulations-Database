#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CALR · Phase B 评测（复用 _work/rag/gold.json 的 110 题金标）

gold.json 结构：[ { q, cc, topic, gold:[{lawId, articleId, noLabel, score, matched}], ... }, ... ]

指标（与 Day1-4 口径一致，便于和 11.1% / 5.1% / 0.133 那组历史数字对比）：
    P@3      前 3 条里命中金标法规的比例
    R@5      前 5 条覆盖了多少金标法规
    MRR      首个命中的倒数排名
    至少命中  前 5 里有任意金标的比例
    国别正确  问句提到某国（cc 非空）时，首位是否该国

用法：
    python _work/phaseb/eval.py
    python _work/phaseb/eval.py --only-pais --save phaseb.json
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time

ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
sys.path.insert(0, os.path.join(ROOT, "backend"))

from app import db, search as bm25_mod, vectors as vec_mod, embedder, hybrid  # noqa: E402

RAG = os.path.join(ROOT, "_work", "rag")


def load_gold():
    p = os.path.join(RAG, "gold.json")
    d = json.load(open(p, encoding="utf-8"))
    return d if isinstance(d, list) else (d.get("items") or [])


def run_one(mode: str, q: str, cc: str, topk: int):
    """返回 (ids, ms)。"""
    t0 = time.time()
    if mode == "bm25":
        r = bm25_mod.search(q=q, mode="semantic", size=topk)
        ids = [it["id"] for it in r["items"]]
    elif mode == "vector":
        emb = embedder.get()
        if emb is None:
            return None, 0
        qv = emb.encode([q])[0]
        vs = vec_mod.search_laws(qv, topk=topk)
        ids = [lid for lid, _ in vs]
    elif mode == "hybrid":
        r = hybrid.hybrid_search(q, size=topk)
        ids = [it["id"] for it in r["items"]]
    elif mode == "hybrid+cc":
        r = hybrid.hybrid_search(q, size=topk, country=(cc or None))
        ids = [it["id"] for it in r["items"]]
    else:
        raise ValueError(mode)
    return ids, (time.time() - t0) * 1000


def evaluate(gold, mode: str, topk: int = 5):
    n = 0
    p3 = r5 = mrr = 0.0
    hit1 = 0
    cc_ok = cc_n = 0
    lat = []
    per_topic: dict = {}

    for item in gold:
        q = item.get("q")
        want = {str(g["lawId"]) for g in (item.get("gold") or []) if g.get("lawId")}
        if not q or not want:
            continue            # 负例（无金标）跳过
        cc = item.get("cc") or ""
        ids, ms = run_one(mode, q, cc, topk)
        if ids is None:
            return None
        lat.append(ms)
        n += 1

        top3, top5 = ids[:3], ids[:5]
        h3 = sum(1 for x in top3 if x in want)
        h5 = sum(1 for x in top5 if x in want)
        p3 += h3 / 3.0
        r5 += h5 / len(want)
        first = next((i for i, x in enumerate(top5) if x in want), None)
        if first is not None:
            mrr += 1.0 / (first + 1)
            hit1 += 1

        topic = item.get("topic") or "-"
        d = per_topic.setdefault(topic, {"n": 0, "p3": 0.0})
        d["n"] += 1
        d["p3"] += h3 / 3.0

        # 国别：首位是否 cc
        if cc:
            cc_n += 1
            if ids:
                row = db.row("SELECT country FROM laws WHERE id=?", (ids[0],))
                if row and row["country"] == cc:
                    cc_ok += 1

    if not n:
        return None
    lat.sort()
    return {
        "mode": mode, "n": n, "topk": topk,
        "P@3": p3 / n, "R@5": r5 / n, "MRR": mrr / n,
        "hitRate": hit1 / n,
        "ccAcc": (cc_ok / cc_n) if cc_n else None,
        "ccN": cc_n,
        "latP50": lat[len(lat) // 2],
        "latP90": lat[int(len(lat) * 0.9)],
        "perTopic": {k: {"n": v["n"], "P@3": v["p3"] / v["n"]} for k, v in per_topic.items()},
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topk", type=int, default=5)
    ap.add_argument("--save", default="")
    ap.add_argument("--modes", default="bm25,vector,hybrid,hybrid+cc")
    args = ap.parse_args()

    gold = load_gold()
    with_gold = [x for x in gold if x.get("gold")]
    print("  金标题目 %d 条（总 %d，负例 %d）" % (len(with_gold), len(gold), len(gold) - len(with_gold)))
    print("  向量: %s" % vec_mod.stats_text())
    print("")

    rows = []
    labels = {"bm25": "BM25（词面）", "vector": "纯向量（bge-m3）",
              "hybrid": "RRF 融合", "hybrid+cc": "融合+国别约束"}
    for mode in args.modes.split(","):
        mode = mode.strip()
        if not mode:
            continue
        t0 = time.time()
        r = evaluate(gold, mode, args.topk)
        if r is None:
            print("  %-18s 跳过" % labels.get(mode, mode))
            continue
        r["label"] = labels.get(mode, mode)
        rows.append(r)
        cc = ("%.1f%%" % (r["ccAcc"] * 100)) if r["ccAcc"] is not None else "—"
        print("  %-18s P@3 %5.1f%%  R@5 %5.1f%%  MRR %.3f  至少命中 %5.1f%%  国别 %6s  延迟 P50 %4.0fms  %.0fs" % (
            r["label"], r["P@3"] * 100, r["R@5"] * 100, r["MRR"],
            r["hitRate"] * 100, cc, r["latP50"], time.time() - t0))

    if len(rows) > 1:
        print("")
        b = rows[0]
        print("  ══ 相对 BM25 的变化 ══")
        for r in rows[1:]:
            print("    %-18s P@3 %+5.1fpt  R@5 %+5.1fpt  MRR %+.3f  命中 %+5.1fpt" % (
                r["label"],
                (r["P@3"] - b["P@3"]) * 100,
                (r["R@5"] - b["R@5"]) * 100,
                r["MRR"] - b["MRR"],
                (r["hitRate"] - b["hitRate"]) * 100))

    if args.save:
        out = args.save if os.path.isabs(args.save) else os.path.join(RAG, args.save)
        with open(out, "w", encoding="utf-8") as f:
            json.dump({"at": time.strftime("%Y-%m-%dT%H:%M:%S"), "results": rows},
                      f, ensure_ascii=False, indent=1)
        print("")
        print("  已保存: " + out)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
