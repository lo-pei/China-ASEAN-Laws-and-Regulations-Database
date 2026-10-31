#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""构建 300+ 题评测集并比较 BM25 / A 条文向量 / C 切片向量。

评测集组成：
  · 106 道既有 gold.json 题（人工/半人工，source=curated）
  · 240 道分层合成题（12 法域 × 20，source=synthetic）

合成题从 DB 的真实条文生成，用于覆盖与链路回归；报告必须与 curated 分开，
不能把 synthetic 当成人工标注准确率。
"""
from __future__ import annotations

import argparse
import json
import os
import random
import re
import sqlite3
import sys
import time
from collections import defaultdict

import numpy as np

ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
RAG = os.path.join(ROOT, "_work", "rag")
DB = os.path.join(ROOT, "backend", "data", "calr.db")
QUESTIONS = os.path.join(RAG, "questions-300.json")
RESULT = os.path.join(RAG, "eval-300-result.json")

COUNTRY_NAMES = {
    "CN": "中国", "VN": "越南", "TH": "泰国", "MY": "马来西亚",
    "ID": "印度尼西亚", "PH": "菲律宾", "SG": "新加坡", "LA": "老挝",
    "KH": "柬埔寨", "MM": "缅甸", "BN": "文莱", "TL": "东帝汶",
}
PER_COUNTRY = 20
SEED = 42
TOPK = 5


def norm_no(v):
    if v is None:
        return None
    try:
        f = float(v)
        return int(f) if f.is_integer() else f
    except Exception:
        return v


def clean(s, n=120):
    s = " ".join(str(s or "").split())
    return s[:n].strip()


def json_text(v):
    if not v:
        return ""
    if isinstance(v, str):
        try:
            v = json.loads(v)
        except Exception:
            return v
    if isinstance(v, dict):
        for k in ("zh", "en", "orig"):
            if v.get(k):
                return str(v[k])
        return str(next(iter(v.values()), ""))
    return str(v)


def parse_article_id(aid):
    m = re.search(r"-A(\d+)$", str(aid or ""))
    return int(m.group(1)) if m else None


def load_gold():
    p = os.path.join(RAG, "gold.json")
    raw = json.load(open(p, encoding="utf-8"))
    items = raw if isinstance(raw, list) else (raw.get("items") or raw.get("data") or [])
    return items


def build_questions():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row

    def resolve_keys(law_id, no):
        return [(r["law_id"], norm_no(r["no"]), r["dup_index"])
                for r in con.execute(
                    "SELECT law_id,no,dup_index FROM articles WHERE law_id=? AND no=?",
                    (law_id, no))]

    curated = []
    for i, it in enumerate(load_gold()):
        gold = it.get("gold") or []
        law_ids = sorted({str(g.get("lawId")) for g in gold if g.get("lawId")})
        if not it.get("q") or not law_ids:
            continue
        article_keys = set()
        for g in gold:
            no = parse_article_id(g.get("articleId"))
            if no is not None:
                for k in resolve_keys(g.get("lawId"), no):
                    article_keys.add(k)
        curated.append({
            "id": "curated-%03d" % i,
            "source": "curated",
            "cc": (it.get("cc") or "").upper() or None,
            "topic": it.get("topic") or "",
            "q": it["q"],
            "gold_laws": law_ids,
            "gold_keys": [list(k) for k in sorted(article_keys, key=str)],
        })

    rng = random.Random(SEED)
    synthetic = []
    for cc in COUNTRY_NAMES:
        rows = con.execute(
            "SELECT a.law_id,a.no,a.dup_index,a.heading,a.text_orig,a.text_zh,a.text_en,"
            "l.title_zh,l.title_en,l.title_orig "
            "FROM articles a JOIN laws l ON l.id=a.law_id "
            "WHERE l.country=? AND (a.heading IS NOT NULL OR a.text_orig IS NOT NULL "
            "OR a.text_zh IS NOT NULL OR a.text_en IS NOT NULL) "
            "LIMIT 12000", (cc,)).fetchall()
        by_law = defaultdict(list)
        for r in rows:
            by_law[r["law_id"]].append(r)
        laws = list(by_law)
        rng.shuffle(laws)
        picked = 0
        used = set()
        for lid in laws:
            if picked >= PER_COUNTRY:
                break
            cand = by_law[lid]
            r = cand[rng.randrange(len(cand))]
            key = (r["law_id"], norm_no(r["no"]), r["dup_index"])
            if key in used:
                continue
            raw_heading = json_text(r["heading"])
            body = json_text(r["text_orig"]) or json_text(r["text_zh"]) or json_text(r["text_en"])
            heading = clean(raw_heading, 70)
            if len(heading) < 4:
                heading = clean(body, 60)
            if len(heading) < 4:
                continue
            if not re.search(r"[\w\u4e00-\u9fff]", heading):
                continue
            title = clean(r["title_zh"] or r["title_en"] or r["title_orig"] or lid, 60)
            q = "在%s，《%s》中关于“%s”的规定是什么？" % (COUNTRY_NAMES[cc], title, heading)
            used.add(key)
            synthetic.append({
                "id": "synthetic-%s-%02d" % (cc, picked),
                "source": "synthetic",
                "cc": cc,
                "topic": "synthetic",
                "q": q,
                "gold_laws": [r["law_id"]],
                "gold_keys": [list(key)],
            })
            picked += 1
        if picked < PER_COUNTRY:
            print("WARN %s only %d synthetic questions" % (cc, picked))

    items = curated + synthetic
    meta = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total": len(items),
        "curated": len(curated),
        "synthetic": len(synthetic),
        "perCountrySynthetic": PER_COUNTRY,
        "topk": TOPK,
    }
    with open(QUESTIONS, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "items": items}, f, ensure_ascii=False, indent=1)
    print("questions -> %s total=%d curated=%d synthetic=%d" %
          (QUESTIONS, len(items), len(curated), len(synthetic)))
    return meta


def metrics(rows, key_field):
    """rows: [{gold_laws, gold_keys, citations}]；返回 law/article 级指标。"""
    n = 0
    p3 = r5 = mrr = hit5 = 0.0
    ap3 = ar5 = amrr = ahit5 = 0.0
    cc_ok = cc_n = 0
    for r in rows:
        gl = set(r["gold_laws"])
        gk = {tuple(x) for x in r["gold_keys"]}
        law_cites = []
        art_cites = []
        for c in r["citations"]:
            lid = c.get("lawId")
            if lid:
                law_cites.append(str(lid))
            if lid and c.get("no") is not None:
                art_cites.append((str(lid), norm_no(c.get("no")), c.get("dup_index")))
        if not gl:
            continue
        n += 1
        top3, top5 = law_cites[:3], law_cites[:5]
        h3 = sum(1 for x in top3 if x in gl)
        h5 = sum(1 for x in top5 if x in gl)
        p3 += h3 / 3.0
        r5 += len(gl & set(top5)) / len(gl)
        first = next((i for i, x in enumerate(top5) if x in gl), None)
        if first is not None:
            mrr += 1.0 / (first + 1)
            hit5 += 1
        if gk:
            a3 = sum(1 for x in art_cites[:3] if x in gk)
            a5 = sum(1 for x in art_cites[:5] if x in gk)
            ap3 += a3 / 3.0
            ar5 += len(gk & set(art_cites[:5])) / len(gk)
            afirst = next((i for i, x in enumerate(art_cites[:5]) if x in gk), None)
            if afirst is not None:
                amrr += 1.0 / (afirst + 1)
                ahit5 += 1
        if r.get("cc"):
            cc_n += 1
            if law_cites and law_cites[0] in gl and any(
                    c.get("lawId") == law_cites[0] and (c.get("country") or "").upper() == r["cc"]
                    for c in r["citations"]):
                cc_ok += 1
    return {
        "n": n,
        "P@3": round(p3 / n, 4) if n else 0,
        "R@5": round(r5 / n, 4) if n else 0,
        "MRR": round(mrr / n, 4) if n else 0,
        "Hit@5": round(hit5 / n, 4) if n else 0,
        "ArticleP@3": round(ap3 / n, 4) if n else 0,
        "ArticleR@5": round(ar5 / n, 4) if n else 0,
        "ArticleMRR": round(amrr / n, 4) if n else 0,
        "ArticleHit@5": round(ahit5 / n, 4) if n else 0,
        "CountryAcc": round(cc_ok / cc_n, 4) if cc_n else None,
        "countryN": cc_n,
    }


def run_eval(selected=None):
    sys.path.insert(0, ROOT)
    from backend.app import qa  # noqa: E402

    data = json.load(open(QUESTIONS, encoding="utf-8"))
    items = data["items"]
    configs = [
        ("bm25", False, None),
        ("a_article", True, "0"),
        ("c_chunk", True, "1"),
    ]
    if selected:
        configs = [c for c in configs if c[0] in selected]
    existing = {}
    if os.path.exists(RESULT):
        try:
            existing = json.load(open(RESULT, encoding="utf-8"))
        except Exception:
            existing = {}
    out = existing or {}
    out["meta"] = data["meta"]
    out.setdefault("configs", {})
    for name, use_vec, chunks in configs:
        if chunks is None:
            os.environ.pop("CALR_QA_CHUNKS", None)
        else:
            os.environ["CALR_QA_CHUNKS"] = chunks
        rows = []
        lat = []
        t0 = time.time()
        for i, it in enumerate(items):
            t1 = time.time()
            r = qa.retrieve(it["q"], topk=TOPK, use_vectors=use_vec)
            lat.append((time.time() - t1) * 1000)
            rows.append({
                "id": it["id"], "source": it["source"], "cc": it.get("cc"),
                "gold_laws": it["gold_laws"], "gold_keys": it["gold_keys"],
                "citations": r.get("citations") or [],
                "mode": r.get("mode"),
            })
        allm = metrics(rows, "law")
        by_src = {}
        for src in ("curated", "synthetic"):
            sub = [x for x in rows if x["source"] == src]
            if sub:
                by_src[src] = metrics(sub, "law")
        by_cc = {}
        for cc in sorted({x["cc"] for x in rows if x["cc"]}):
            sub = [x for x in rows if x["cc"] == cc]
            if sub:
                by_cc[cc] = metrics(sub, "law")
        lat_sorted = sorted(lat)
        p50 = lat_sorted[len(lat_sorted) // 2] if lat_sorted else 0
        p90 = lat_sorted[min(len(lat_sorted) - 1, int(len(lat_sorted) * 0.9))] if lat_sorted else 0
        out["configs"][name] = {
            "elapsedSec": round(time.time() - t0, 1),
            "latencyP50ms": round(p50, 1),
            "latencyP90ms": round(p90, 1),
            "all": allm, "bySource": by_src, "byCountry": by_cc,
        }
        print("%-10s n=%d P@3=%.4f R@5=%.4f MRR=%.4f ArticleHit=%.4f P50=%.0fms" %
              (name, allm["n"], allm["P@3"], allm["R@5"], allm["MRR"],
               allm["ArticleHit@5"], p50), flush=True)
        if name == "c_chunk":
            out["sample"] = rows[:2]
    with open(RESULT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print("result -> %s" % RESULT)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--build", action="store_true")
    ap.add_argument("--eval", action="store_true")
    ap.add_argument("--configs", default="")
    args = ap.parse_args()
    if args.build or not os.path.exists(QUESTIONS):
        build_questions()
    if args.eval or True:
        selected = {x.strip() for x in args.configs.split(",") if x.strip()} or None
        run_eval(selected)


if __name__ == "__main__":
    main()
