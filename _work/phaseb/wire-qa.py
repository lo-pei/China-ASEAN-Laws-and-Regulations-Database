# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")

# ---- 1) db.py：no 是 REAL，序列化时整数化 ----
p = "backend/app/db.py"
s = io.open(p, encoding="utf-8").read()
o = s
s = s.replace('''def article_dict(r: sqlite3.Row) -> Dict[str, Any]:''',
'''def _num(v):
    """REAL 存的条号整数化：21.0 → 21，保留 21.5 这类小数。"""
    if v is None:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return v
    return int(f) if f == int(f) else f


def article_dict(r: sqlite3.Row) -> Dict[str, Any]:''')
s = s.replace('''        "no": r["no"],''', '''        "no": _num(r["no"]),''')
if s != o:
    io.open(p, "w", encoding="utf-8").write(s)
    print("  ✓ db.py 条号已整数化")
else:
    print("  ! db.py 锚点未命中")

# ---- 2) main.py：/api/qa 改用条文级向量召回，并按「法规标题+条号」去重 ----
p2 = "backend/app/main.py"
s2 = io.open(p2, encoding="utf-8").read()
o2 = s2
s2 = s2.replace('''@app.post("/api/qa", summary="问答（Phase A 检索式占位）")
def qa(req: QARequest) -> Dict[str, Any]:
    """Phase A 只返回检索结果作为「依据」；Phase B/C 接入向量召回与模型生成。"""
    res = search_mod.search(q=req.question, mode="semantic",
                            country=req.country, page=1, size=req.topk)
    cites: List[Dict[str, Any]] = []
    for it in res["items"]:
        hits = search_mod.article_hits(req.question, it["id"], limit=2)
        for h in hits:
            a = h["article"]
            cites.append({
                "lawId": it["id"],
                "lawTitle": it["title"],
                "country": it["country"],
                "no": a["no"],
                "text": a["text"],
            })
            if len(cites) >= req.topk * 2:
                break
        if len(cites) >= req.topk * 2:
            break
    return {
        "question": req.question,
        "mode": "retrieval-only",
        "note": "Phase A 未接生成模型，返回检索到的条文作为依据。",
        "citations": cites,
        "candidates": res["items"],
    }''',
'''def _fmt_no(no) -> str:
    if no is None:
        return ""
    try:
        f = float(no)
        return str(int(f)) if f == int(f) else str(no)
    except (TypeError, ValueError):
        return str(no)


@app.post("/api/qa", summary="问答（条文级向量召回）")
def qa(req: QARequest) -> Dict[str, Any]:
    """用条文级 bge-m3 向量召回真实条文，返回可直接引用的依据列表。

    Phase B：召回 + 引用（未接生成模型）。
    去重键用「法规中文标题 + 条号」：语料里同一部法常有多个记录
    （如《中华人民共和国数据安全法》同时存在 CN-DATA-2021 与 CN-PIA-002），
    不去重会在依据里重复列出同一条。
    """
    if not vec_mod.load() or not embedder.available():
        # 向量不可用时退回法规级检索 + 条文关键词命中
        res = search_mod.search(q=req.question, mode="semantic",
                                country=req.country, page=1, size=req.topk)
        cites: List[Dict[str, Any]] = []
        for it in res["items"]:
            for h in search_mod.article_hits(req.question, it["id"], limit=2):
                a = h["article"]
                cites.append({"lawId": it["id"], "lawTitle": it["title"],
                              "country": it["country"], "no": a["no"],
                              "noLabel": _fmt_no(a["no"]), "text": a["text"], "score": None})
        return {"question": req.question, "mode": "bm25-fallback",
                "note": "向量索引不可用，已退回 BM25 检索。",
                "citations": cites[:req.topk * 2], "candidates": res["items"]}

    emb = embedder.get()
    qv = emb.encode([req.question])[0]
    hits = vec_mod.search_articles(qv, topk=req.topk * 6)

    seen = set()
    cites: List[Dict[str, Any]] = []
    for meta, sc in hits:
        lid = meta["law_id"]
        r = db.row("SELECT country, title_zh, title_en, title_orig FROM laws WHERE id=?", (lid,))
        if not r:
            continue
        if req.country and r["country"] != req.country.upper():
            continue
        title_zh = r["title_zh"] or r["title_en"] or r["title_orig"] or lid
        key = (title_zh, _fmt_no(meta["no"]))
        if key in seen:
            continue
        seen.add(key)
        a = db.row("SELECT text_zh, text_en, text_orig, lang, no_label, heading FROM articles "
                   "WHERE law_id=? AND no=? AND IFNULL(dup_index,1)=IFNULL(?,1)",
                   (lid, meta["no"], meta["dup_index"]))
        if not a:
            continue
        text = {"zh": a["text_zh"], "en": a["text_en"]}
        if a["text_orig"]:
            text[a["lang"] or "orig"] = a["text_orig"]
        cites.append({
            "lawId": lid,
            "lawTitle": {"zh": r["title_zh"], "en": r["title_en"], "orig": r["title_orig"]},
            "country": r["country"],
            "no": _num_no(meta["no"]),
            "noLabel": a["no_label"] or ("第" + _fmt_no(meta["no"]) + "条"),
            "heading": a["heading"],
            "text": text,
            "score": round(float(sc), 4),
        })
        if len(cites) >= req.topk:
            break

    return {
        "question": req.question,
        "mode": "article-vector",
        "note": "Phase B：条文级向量召回，未接生成模型。依据为原文条文，可按 lawId + no 回溯。",
        "citations": cites,
    }''')
if s2 != o2:
    io.open(p2, "w", encoding="utf-8").write(s2)
    print("  ✓ main.py /api/qa 已改为条文级向量召回")
else:
    print("  ! main.py 锚点未命中")
