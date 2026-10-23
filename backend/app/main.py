# -*- coding: utf-8 -*-
"""
CALR 后端 · FastAPI 应用（Phase A）

提供：
  GET  /api/health                健康检查
  GET  /api/stats                 数据规模统计
  GET  /api/countries             法域列表
  GET  /api/laws                  法规列表（支持 country/level/status/q/分页）
  GET  /api/laws/{law_id}         法规详情（含全部条文）
  GET  /api/laws/{law_id}/articles 仅条文
  GET  /api/search                检索（keyword / semantic）
  POST /api/qa                    问答（Phase A 为检索式占位，Phase B/C 接模型）

同时把 prototype/ 作为静态站点挂到 / ，方便前后端同源联调。

启动：
    uvicorn backend.app.main:app --reload --port 8000
文档：
    http://127.0.0.1:8000/docs
"""
from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional

# 让 app 包可独立运行
_BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ROOT = os.path.dirname(_BACKEND)
for p in (_BACKEND, _ROOT):
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import db, search as search_mod, vectors as vec_mod, hybrid as hybrid_mod, embedder

APP_VERSION = "0.1.0-phaseA"
PROTO = os.path.join(_ROOT, "prototype")

app = FastAPI(
    title="CALR · 中国—东盟法律法规数据库 API",
    description="法规检索与数据服务（Phase A：数据可达性 + API 骨架）",
    version=APP_VERSION,
)

# ── gzip 压缩 ────────────────────────────────────────────────────────────
# 静态数据文件很大（intl-catalog.js 原始 15.9 MB），但压缩率极高：
# 实测 21.1 MB 静态资源 gzip 后仅 3.40 MB（压掉 84%），
# 其中 intl-catalog.js 15.9 MB → 1.73 MB。
# 这一项把首屏从 5.6 秒压到 1 秒级，而且前端代码一行不用改。
app.add_middleware(GZipMiddleware, minimum_size=1024, compresslevel=6)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # 静态页以 file:// 打开时也需要跨域
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------- 基础
@app.get("/api/health", summary="健康检查")
def health() -> Dict[str, Any]:
    try:
        m = db.meta()
        return {"ok": True, "version": APP_VERSION,
                "db": {"laws": m.get("laws"), "articles": m.get("articles"),
                       "builtAt": m.get("built_at")}}
    except Exception as e:
        return JSONResponse(status_code=503,
                            content={"ok": False, "error": str(e)})


@app.get("/api/stats", summary="数据规模统计")
def stats() -> Dict[str, Any]:
    return db.stats()


@app.get("/api/countries", summary="法域列表")
def countries() -> Dict[str, Any]:
    st = db.stats()
    return {"items": [{"code": k, "count": v} for k, v in st["countries"].items()]}


# ---------------------------------------------------------------- 法规
@app.get("/api/laws", summary="法规列表")
def laws(
    country: Optional[str] = None,
    level: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
) -> Dict[str, Any]:
    return db.list_laws(country=country, level=level, status=status,
                        q=q, page=page, size=size)


@app.get("/api/laws/{law_id}", summary="法规详情（含条文）")
def law(law_id: str) -> Dict[str, Any]:
    r = db.row("SELECT * FROM laws WHERE id=?", (law_id,))
    if not r:
        raise HTTPException(status_code=404, detail="法规不存在: " + law_id)
    return db.law_dict(r, with_articles=True)


@app.get("/api/laws/{law_id}/articles", summary="法规条文")
def articles(law_id: str) -> Dict[str, Any]:
    r = db.row("SELECT id,title_zh,article_count FROM laws WHERE id=?", (law_id,))
    if not r:
        raise HTTPException(status_code=404, detail="法规不存在: " + law_id)
    return {"id": law_id, "title": r["title_zh"],
            "count": r["article_count"], "items": db.article_list(law_id)}


# ---------------------------------------------------------------- 检索
@app.get("/api/search", summary="法规检索")
def search(
    q: str = "",
    mode: str = Query("keyword", pattern="^(keyword|semantic|exact|hybrid)$"),
    country: Optional[str] = None,
    level: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
) -> Dict[str, Any]:
    if mode == "hybrid":
        return hybrid_mod.hybrid_search(q=q, mode="hybrid", country=country,
                                        level=level, status=status,
                                        page=page, size=size)
    return search_mod.search(q=q, mode=mode, country=country, level=level,
                             status=status, page=page, size=size)


@app.get("/api/vectors", summary="向量索引状态")
def vectors_status() -> Dict[str, Any]:
    return {"embeddings": vec_mod.info(), "model": embedder.available(),
            "modelDir": embedder.DEFAULT_MODEL}


@app.get("/api/search/articles", summary="在指定法规内检索条文")
def search_articles(q: str, law_id: str, limit: int = Query(3, ge=1, le=20)) -> Dict[str, Any]:
    return {"lawId": law_id, "hits": search_mod.article_hits(q, law_id, limit)}


# ---------------------------------------------------------------- 问答（占位）
class QARequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    country: Optional[str] = None
    topk: int = Field(5, ge=1, le=20)


@app.post("/api/qa", summary="问答（Phase A 检索式占位）")
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
    }


# ---------------------------------------------------------------- 静态站点
if os.path.isdir(PROTO):
    app.mount("/", StaticFiles(directory=PROTO, html=True), name="prototype")
