# -*- coding: utf-8 -*-
"""
CALR 后端 · 安全模块

审计发现的问题与对策（全部可用环境变量覆盖）：
  ① CORS 原本是 allow_origins=["*"]，任何人都能从任意站点调用
     → 默认只允许同源 + file:// 的 "null"；生产用 CALR_CORS_ORIGINS 显式列域名
  ② /api/qa 会跑模型推理，容易被刷
     → 设 CALR_API_KEY 后必须带 X-API-Key 头；不设则开放（本地/演示）
  ③ 无限流
     → 进程内令牌桶，按 IP 限速
  ④ 无请求体上限
     → Content-Length 超过 CALR_MAX_BODY（默认 256 KB）直接 413
"""
import os
import time
from typing import Dict, Optional

from fastapi import Header, HTTPException, Request
from fastapi.responses import PlainTextResponse


def _origins():
    raw = os.environ.get("CALR_CORS_ORIGINS", "").strip()
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    # 默认：同源 + 浏览器对 file:// 发送的 "null"（本地演示需要）
    return ["null", "http://127.0.0.1:8000", "http://localhost:8000"]


CORS_ORIGINS = _origins()
API_KEY = os.environ.get("CALR_API_KEY", "").strip()
MAX_BODY = int(os.environ.get("CALR_MAX_BODY", str(256 * 1024)))
RATE_PER_MIN = int(os.environ.get("CALR_RATE_PER_MIN", "600"))
RATE_BURST = int(os.environ.get("CALR_RATE_BURST", "120"))

_buckets: Dict[str, list] = {}


def client_ip(request: Request) -> str:
    # 反代场景优先 X-Forwarded-For 首段
    xff = request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def security_middleware(request: Request, call_next):
    """请求体上限 + 令牌桶限流（只作用于 /api/）。"""
    cl = request.headers.get("content-length")
    if cl:
        try:
            if int(cl) > MAX_BODY:
                return PlainTextResponse("请求体过大", status_code=413)
        except ValueError:
            return PlainTextResponse("Content-Length 非法", status_code=400)

    if request.url.path.startswith("/api/") and RATE_PER_MIN > 0:
        ip = client_ip(request)
        now = time.time()
        b = _buckets.get(ip)
        if b is None:
            b = _buckets[ip] = [float(RATE_BURST), now]
        cap, last = b
        cap = min(RATE_BURST, cap + (now - last) * (RATE_PER_MIN / 60.0))
        if cap < 1:
            _buckets[ip] = [cap, now]
            return PlainTextResponse("请求过于频繁，请稍后再试", status_code=429)
        _buckets[ip] = [cap - 1, now]
        if len(_buckets) > 5000:      # 防止字典无限增长
            for k in list(_buckets.keys())[:2500]:
                _buckets.pop(k, None)

    return await call_next(request)


def require_api_key(x_api_key: Optional[str] = Header(default=None)) -> None:
    if not API_KEY:
        return
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="需要有效的 X-API-Key")


def status() -> dict:
    """供 /api/health 展示（不含任何敏感值）。"""
    return {
        "corsOrigins": len(CORS_ORIGINS),
        "corsMode": "explicit" if os.environ.get("CALR_CORS_ORIGINS", "").strip() else "same-origin+null",
        "qaRequiresKey": bool(API_KEY),
        "ratePerMin": RATE_PER_MIN,
        "rateBurst": RATE_BURST,
        "maxBodyBytes": MAX_BODY,
    }
