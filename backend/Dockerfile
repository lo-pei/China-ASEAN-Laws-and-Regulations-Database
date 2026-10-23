# CALR 后端镜像（Phase A）
# 构建： docker build -f backend/Dockerfile -t calr-api:phaseA .
# 运行： docker run -p 8000:8000 -v "$PWD/backend/data:/app/backend/data:ro" calr-api:phaseA

FROM python:3.12-slim

LABEL org.opencontainers.image.title="CALR API" \
      org.opencontainers.image.description="中国—东盟法律法规数据库 后端服务" \
      org.opencontainers.image.version="0.1.0-phaseA"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    CALR_DB=/app/backend/data/calr.db

WORKDIR /app

# 依赖层（单独 COPY 以便缓存）
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 代码与静态站点
COPY backend /app/backend
COPY prototype /app/prototype

# 数据库由 build_db.py 生成，镜像不内置（数据约 1.5GB）
# 运行时用 -v 挂载到 /app/backend/data
VOLUME ["/app/backend/data"]

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health',timeout=3).status==200 else 1)"

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
