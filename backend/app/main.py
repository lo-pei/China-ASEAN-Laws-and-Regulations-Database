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

import json
import os
import sys
from typing import Any, Dict, List, Optional

# 让 app 包可独立运行
_BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ROOT = os.path.dirname(_BACKEND)
for p in (_BACKEND, _ROOT):
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import db, search as search_mod, vectors as vec_mod, hybrid as hybrid_mod, embedder, qa as qa_mod
from . import security

APP_VERSION = "0.1.0-phaseA"
PROTO = os.path.join(_ROOT, "prototype")

app = FastAPI(
    title="CALR · 中国—东盟法律法规数据库 API",
    description="法规检索与数据服务",
    version=APP_VERSION,
)

# ── 安全中间件：请求体上限 + 按 IP 限流（见 app/security.py） ────────────
app.middleware("http")(security.security_middleware)

# ── gzip 压缩 ────────────────────────────────────────────────────────────
# 静态数据文件很大（intl-catalog.js 原始 15.9 MB），但压缩率极高：
# 实测 21.1 MB 静态资源 gzip 后仅 3.40 MB（压掉 84%），
# 其中 intl-catalog.js 15.9 MB → 1.73 MB。
app.add_middleware(GZipMiddleware, minimum_size=1024, compresslevel=6)

app.add_middleware(
    CORSMiddleware,
    # 不再放开 "*"：默认仅同源 + file:// 的 "null"，可用 CALR_CORS_ORIGINS 显式追加域名
    allow_origins=security.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
    max_age=600,
)


# ---------------------------------------------------------------- 基础
@app.get("/api/health", summary="健康检查")
def health() -> Dict[str, Any]:
    try:
        m = db.meta()
        return {"ok": True, "version": APP_VERSION,
                "db": {"laws": m.get("laws"), "articles": m.get("articles"),
                       "builtAt": m.get("built_at")},
                "security": security.status()}
    except Exception as e:
        return JSONResponse(status_code=503,
                            content={"ok": False, "error": str(e)})


@app.get("/api/stats", summary="数据规模统计")
def stats() -> Dict[str, Any]:
    return db.stats()


@app.get("/api/bootstrap", summary="首屏元数据（统计/国别/层级/主题/示例问题）")
def bootstrap() -> Dict[str, Any]:
    """一次返回首屏所需的全部元数据。

    前端在 API 模式下不再下载 15.9 MB 的 intl-catalog.js，改为请求这个接口，
    拿到渲染首页、筛选面板、下拉选项所需的全部内容。
    """
    st = db.stats()
    levels = [{"id": r["level"], "count": r["n"]} for r in db.rows(
        "SELECT level, COUNT(*) n FROM laws GROUP BY level ORDER BY n DESC")]
    statuses = [{"id": r["status"], "count": r["n"]} for r in db.rows(
        "SELECT status, COUNT(*) n FROM laws GROUP BY status ORDER BY n DESC")]
    # topics 存在 laws.topics 的 JSON 数组里，用 Python 侧聚合（SQLite 没有 json_each 的稳定支持）
    topic_count: Dict[str, int] = {}
    for r in db.rows("SELECT topics FROM laws WHERE topics IS NOT NULL"):
        try:
            arr = json.loads(r["topics"])
        except Exception:
            continue
        if isinstance(arr, list):
            for t in arr:
                if isinstance(t, str) and t:
                    topic_count[t] = topic_count.get(t, 0) + 1
    topics = [{"id": k, "count": v}
              for k, v in sorted(topic_count.items(), key=lambda x: -x[1])]
    # 语言分布（法规级 language 字段）
    lang_count: Dict[str, int] = {}
    for r in db.rows("SELECT language FROM laws WHERE language IS NOT NULL"):
        try:
            arr = json.loads(r["language"]) if isinstance(r["language"], str) else r["language"]
        except Exception:
            arr = [r["language"]]
        if isinstance(arr, str):
            arr = [arr]
        for x in (arr or []):
            if isinstance(x, str) and x:
                lang_count[x] = lang_count.get(x, 0) + 1
    return {
        "ok": True,
        "version": APP_VERSION,
        "stats": st,
        "countries": [{"code": k, "count": v} for k, v in st["countries"].items()],
        "levels": levels,
        "statuses": statuses,
        "topics": topics,
        "languages": [{"id": k, "count": v}
                      for k, v in sorted(lang_count.items(), key=lambda x: -x[1])],
        "source": "api",
    }


@app.get("/api/laws/compact", summary="轻量法规列表（供前端后台补齐全量法规）")
def laws_compact(page: int = Query(1, ge=1),
                 size: int = Query(2000, ge=1, le=5000),
                 country: Optional[str] = None) -> Dict[str, Any]:
    """只返回列表页/统计/比对挑选所需的字段，比完整 law_dict 小很多。"""
    where, params = [], []
    if country:
        where.append("country=?")
        params.append(country.upper())
    w = ("WHERE " + " AND ".join(where)) if where else ""
    total = db.one("SELECT COUNT(*) FROM laws " + w, params, 0)
    rs = db.rows(
        "SELECT id,country,country_name,title_zh,title_en,title_orig,level,status,"
        "topics,promulgated,effective,article_count,coverage,pack "
        "FROM laws " + w + " ORDER BY id LIMIT ? OFFSET ?",
        params + [size, (page - 1) * size])
    items = []
    for r in rs:
        try:
            topics = json.loads(r["topics"]) if r["topics"] else []
        except Exception:
            topics = []
        items.append({
            "id": r["id"],
            "country": r["country"],
            "countryName": r["country_name"],
            "title": {"zh": r["title_zh"], "en": r["title_en"], "orig": r["title_orig"]},
            "level": r["level"],
            "status": r["status"],
            "topics": topics,
            "promulgatedDate": r["promulgated"],
            "effectiveDate": r["effective"],
            "articleCount": r["article_count"],
            "coverage": r["coverage"],
            "pack": r["pack"],
        })
    return {"total": total, "page": page, "size": size,
            "pages": (total + size - 1) // size if total else 0,
            "items": items}


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


@app.get("/api/laws/{law_id}/history", summary="法规版本与变迁（法规级）")
def law_history(law_id: str) -> Dict[str, Any]:
    """返回一部法的生命周期时间线，以及同标题的其他记录。

    数据现实：全库没有条文级修订记录（revisions / history / amendedBy 均为 0 部），
    所以这里只做**法规级**时间线，且只使用已入库的元数据字段，不做任何推断。
    """
    row = db.row("SELECT * FROM laws WHERE id=?", [law_id])
    if not row:
        raise HTTPException(status_code=404, detail="法规不存在")
    law = db.law_dict(row)

    events = []
    for key, label, kind in (
        ("promulgatedDate", "公布", "promulgate"),
        ("effectiveDate", "施行", "effective"),
        ("amendedNote", "修正", "amend"),
        ("versionDate", "版本", "version"),
    ):
        val = law.get(key)
        if not val:
            continue
        if isinstance(val, dict):
            val = val.get("zh") or val.get("en") or ""
        val = str(val).strip()
        if not val or val in ("—", "-", "不详"):
            continue
        events.append({"kind": kind, "label": label, "value": val})

    # 同标题的其他记录：只做并列，不下「是否为同一部法不同版本」的结论
    title = law.get("title") or {}
    zh = (title.get("zh") if isinstance(title, dict) else None) or ""
    siblings = []
    if zh:
        for r in db.rows(
                "SELECT id,country,country_name,title_zh,status,promulgated,article_count "
                "FROM laws WHERE title_zh=? AND id<>? ORDER BY promulgated LIMIT 20", [zh, law_id]):
            siblings.append({
                "id": r["id"], "country": r["country"], "countryName": r["country_name"],
                "title": r["title_zh"], "status": r["status"],
                "promulgatedDate": r["promulgated"], "articleCount": r["article_count"],
            })

    return {
        "id": law["id"],
        "title": title,
        "status": law.get("status"),
        "final": law.get("status") in ("repealed",),
        "events": events,
        "siblings": siblings,
        "note": ("同名不等于同法。下列记录仅是按标题文字匹配到的其他法规，"
                 "可能是同一部法的不同版本，也可能是不同的单行法（例如各国每年一部《经费拨款法》）。"
                 "本系统没有条文级修订记录，无法判断哪一条在何时被改过。"),
    }


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
            "modelDir": embedder.DEFAULT_MODEL,
            "modelError": embedder.last_error()}


@app.get("/api/search/articles", summary="在指定法规内检索条文")
def search_articles(q: str, law_id: str, limit: int = Query(3, ge=1, le=20)) -> Dict[str, Any]:
    return {"lawId": law_id, "hits": search_mod.article_hits(q, law_id, limit)}


# ---------------------------------------------------------------- 问答（占位）
class QARequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    country: Optional[str] = None
    topk: int = Field(5, ge=1, le=20)


def _label_of(raw, no) -> str:
    """no_label 列存的是 JSON（{"zh":"第21条"}），取中文优先，退英文，再退合成。"""
    if raw:
        v = raw
        if isinstance(raw, str):
            try:
                import json as _j
                v = _j.loads(raw)
            except Exception:
                v = raw
        label = None
        if isinstance(v, dict):
            for k in ("zh", "en", "orig"):
                if v.get(k):
                    label = str(v[k])
                    break
            if label is None:
                for x in v.values():
                    if x:
                        label = str(x)
                        break
        elif isinstance(v, str) and v.strip():
            label = v.strip()
        # 长度守卫：部分泰国/缅甸记录把「整段正文」错写进了 no_label，
        # 这类不是标签，长度超过 24 字符一律丢弃，退回合成标签。
        if label and len(label) <= 24:
            return label
    if no is None:
        return ""
    return "第" + _fmt_no(no) + "条"


def _num_no(no):
    """条号整数化（REAL 存的 21.0 → 21）。"""
    if no is None:
        return None
    try:
        f = float(no)
        return int(f) if f == int(f) else f
    except (TypeError, ValueError):
        return no


def _fmt_no(no) -> str:
    if no is None:
        return ""
    try:
        f = float(no)
        return str(int(f)) if f == int(f) else str(no)
    except (TypeError, ValueError):
        return str(no)


@app.post("/api/qa", summary="问答（BM25+向量 RRF 条文召回）",
         dependencies=[Depends(security.require_api_key)])
def qa(req: QARequest) -> Dict[str, Any]:
    """条文级混合召回：BM25 条文候选 + 向量候选 + RRF + 国别前置过滤 + 阈值。"""
    return qa_mod.retrieve(req.question, country=req.country, topk=req.topk)


# ---------------------------------------------------------------- 错误可观测性
# 默认只返回异常类型与一句话消息（不泄漏堆栈）；
# 需要完整堆栈时设 CALR_DEBUG=1，仅本地排查用。
import traceback as _tb


@app.exception_handler(Exception)
async def _calr_unhandled(request, exc):
    detail = {"error": type(exc).__name__, "message": str(exc)[:400], "path": str(request.url.path)}
    if os.environ.get("CALR_DEBUG", "").strip() in ("1", "true", "yes"):
        detail["trace"] = _tb.format_exc()[-2000:]
    return JSONResponse(status_code=500, content=detail)


# ---------------------------------------------------------------- 静态站点
if os.path.isdir(PROTO):
    app.mount("/", StaticFiles(directory=PROTO, html=True), name="prototype")
