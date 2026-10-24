# CALR 后端镜像（Phase A）
# 构建： docker build -f backend/Dockerfile -t calr-api:phaseA .
# 运行： docker run -p 8000:8000 -v "$PWD/backend/data:/app/backend/data:ro" calr-api:phaseA
#
# ── 关于嵌入模型（重要，请读完） ────────────────────────────────────────
# 本镜像**不内置** bge-m3 模型（约 2.18 GB）。原因有二：
#   1) 模型放在 _work/models/ 下，而 _work/ 被 .gitignore 排除，不在构建上下文里；
#   2) 把它打进镜像会让体积翻十几倍，而它完全可以外挂。
#
# 没有模型时**功能不受影响**，只是语义能力降级：
#   · /api/search?mode=semantic|hybrid → 自动退回法规级检索
#   · /api/qa → 自动退回法规级检索 + 条文关键词命中
#   实测（把 CALR_MODEL 指到不存在的目录）：health / vectors / keyword / semantic /
#   hybrid 五个接口与 /api/qa 全部返回 200；问答仍给出 6 条带条号的引用
#   （如《中华人民共和国数据安全法》第 21 条）。
#
# 需要完整语义能力时，把模型目录挂进来并保持 CALR_MODEL 指向它：
#   docker run -p 8000:8000 \
#     -v "$PWD/backend/data:/app/backend/data:ro" \
#     -v "$PWD/_work/models/bge-m3:/models/bge-m3:ro" \
#     calr-api:phaseA
# 向量索引在 backend/data/vectors 下，随 backend/data 一起挂载即可。

FROM python:3.12-slim

LABEL org.opencontainers.image.title="CALR API" \
      org.opencontainers.image.description="中国—东盟法律法规数据库 后端服务" \
      org.opencontainers.image.version="0.1.0-phaseA"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    CALR_DB=/app/backend/data/calr.db \
    CALR_VEC=/app/backend/data/vectors \
    CALR_MODEL=/models/bge-m3

WORKDIR /app

# 依赖层（单独 COPY 以便缓存）
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 代码与静态站点
COPY backend /app/backend
COPY prototype /app/prototype

# 数据库与向量索引由 build_db.py / embed.py 生成，镜像不内置
# （约 1.6 GB + 0.35 GB），运行时用 -v 挂载到 /app/backend/data
VOLUME ["/app/backend/data"]

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health',timeout=3).status==200 else 1)"

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
