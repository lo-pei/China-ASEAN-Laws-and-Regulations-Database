# -*- coding: utf-8 -*-
"""
对比三种检索：BM25 / 纯向量 / RRF 融合（离线直调，不起服务）

用法：
    python _work/phaseb/cmp.py
"""
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
sys.path.insert(0, os.path.join(ROOT, "backend"))

from app import db, search as bm25_mod, vectors as vec_mod, embedder, hybrid  # noqa: E402

QUERIES = [
    "民法典",
    "数据法",
    "个人信息保护",
    "越南外商投资准入",
    "泰国劳动保护",
    "缅甸仲裁",
    "中国公司注册资本",
    "跨境数据传输",
    "外籍员工工作许可",
    "知识产权侵权赔偿",
]


def title_of(it):
    t = it.get("title") or {}
    return t.get("zh") or t.get("en") or t.get("orig") or "(无标题)"


def by_ids(ids, limit=5):
    if not ids:
        return []
    ph = ",".join("?" * len(ids))
    rs = {r["id"]: r for r in db.rows("SELECT * FROM laws WHERE id IN (" + ph + ")", ids)}
    out = []
    for i in ids[:limit]:
        r = rs.get(i)
        if r:
            out.append(db.law_dict(r))
    return out


def show(label, items):
    print("    %s:" % label)
    for k, it in enumerate(items[:5], 1):
        print("      %d. %s %-38s %s" % (k, it["country"].ljust(3), title_of(it)[:38],
                                          it.get("score", "")))


def main():
    print("  向量索引: %s" % vec_mod.stats_text())
    emb = embedder.get()
    print("  嵌入模型: %s" % ("已加载" if emb else "不可用"))
    print("")

    for q in QUERIES:
        print("  ══ %s ══" % q)
        # 1) BM25
        t0 = time.time()
        b = bm25_mod.search(q=q, mode="semantic", size=5)
        tb = (time.time() - t0) * 1000
        show("BM25（%.0fms，共 %d 条）" % (tb, b["total"]), b["items"])

        # 2) 纯向量
        t0 = time.time()
        qv = emb.encode([q])[0] if emb else None
        vs = vec_mod.search_laws(qv, topk=5) if qv is not None else []
        tv = (time.time() - t0) * 1000
        vitems = by_ids([lid for lid, _ in vs], 5)
        for it, (lid, sc) in zip(vitems, vs):
            it["score"] = round(sc, 4)
        show("纯向量（%.0fms）" % tv, vitems)

        # 3) RRF 融合
        t0 = time.time()
        h = hybrid.hybrid_search(q, mode="hybrid", size=5)
        th = (time.time() - t0) * 1000
        show("RRF 融合（%.0fms，共 %d 条）" % (th, h["total"]), h["items"])
        print("")


if __name__ == "__main__":
    main()
