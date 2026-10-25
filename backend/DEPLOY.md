# CALR 后端部署说明（Phase A）

> 目标：在云服务器（阿里云 / 腾讯云）上用 Docker 跑起 API 服务，
> 并把现有的 `prototype/` 静态站挂到同一个服务上，实现前后端同源。
>
> 部署路线总览见 [docs/deploy/README.md](../docs/deploy/README.md)；Windows 实测修正见
> [docs/deploy/10-部署-Windows阿里云实测复盘.md](../docs/deploy/10-部署-Windows阿里云实测复盘.md)。

## 一、架构

```
                    ┌──────────────────────────────┐
   浏览器 ──────────▶│  Nginx / SLB  (HTTPS 443)    │
                    └──────────────┬───────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │  calr-api (FastAPI + uvicorn)│
                    │   ├ /            → prototype/│  静态站
                    │   ├ /api/*       → JSON      │  API
                    │   └ calr.db      → SQLite    │  1.6 GB 只读
                    └──────────────────────────────┘
```

- **数据源唯一**：`prototype/data/laws/*.json` 是权威存储；`calr.db` 由 `build_db.py` 派生。
- **静态模式保留**：不连后端时，`prototype/index.html` 仍可 `file://` 直接打开（答辩兜底）。

## 二、本地开发

```bash
# 1) 建库（首次约 7 分钟，产出 backend/data/calr.db ≈ 1.6 GB）
python backend/build_db.py

# 2) 起服务
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000

# 3) 自测（13 项）
python backend/test_api.py

# 4) 打开文档
open http://127.0.0.1:8000/docs
```

**前后端联调**：静态页带参数指向后端即可

```
prototype/index.html?api=http://127.0.0.1:8000
```

也可写入 localStorage：`localStorage.setItem('calr.apiBase','http://127.0.0.1:8000')`

## 三、接口一览

| 方法 | 路径 | 说明 |
| :--- | :--- | :--- |
| GET | `/api/health` | 健康检查（含建库时间） |
| GET | `/api/stats` | 法规/条文/词项数、国别与层级分布 |
| GET | `/api/countries` | 12 法域及各自法规数 |
| GET | `/api/laws` | 法规列表，支持 `country/level/status/q/page/size` |
| GET | `/api/laws/{id}` | 法规详情（含全部条文） |
| GET | `/api/laws/{id}/articles` | 仅条文 |
| GET | `/api/search` | 检索，`mode=keyword\|semantic\|exact` |
| GET | `/api/search/articles` | 在指定法规内检索条文 |
| POST | `/api/qa` | 问答（Phase A 为检索式占位） |

交互式文档：`/docs`（Swagger UI）、`/redoc`

## 四、云服务器部署（Docker）

### 4.1 准备

```bash
# 服务器：4 核 8G 起（DB 1.6 GB + BM25 计算，2G 内存是下限）
# 安装 docker 与 compose 插件
curl -fsSL https://get.docker.com | sh
```

### 4.2 上传

数据库 1.6 GB **不进 git**，单独上传：

```bash
# 本机
scp -r backend user@server:/opt/calr/backend
scp docker-compose.yml user@server:/opt/calr/
scp -r prototype user@server:/opt/calr/prototype
scp backend/data/calr.db user@server:/opt/calr/backend/data/calr.db   # 1.6 GB，耗时长
```

### 4.3 启停

```bash
cd /opt/calr
docker compose up -d --build      # 首次构建镜像
docker compose logs -f api        # 看日志
curl http://127.0.0.1:8000/api/health
docker compose down               # 停止
```

### 4.4 Nginx 反代 + HTTPS

```nginx
server {
    listen 80;
    server_name calr.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name calr.example.com;

    ssl_certificate     /etc/letsencrypt/live/calr.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/calr.example.com/privkey.pem;

    # 静态数据文件很大，开 gzip 能压掉 80%+
    gzip on;
    gzip_types application/javascript application/json text/css text/plain;
    gzip_min_length 1024;

    client_max_body_size 8m;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

> **重要**：`gzip` 对 `intl-catalog.js`（15.9 MB）和 `calr.db` 无关（DB 走 API），
> 但能把静态站的 16 MB 目录压到约 1.5 MB，首屏从 5.6 秒降到 1 秒级。

### 4.5 阿里云安全组

放行入方向：`443/tcp`（HTTPS）、`80/tcp`（跳转）。**不要**把 8000 直接暴露公网。

## 五、数据更新流程

法规修订后：

```bash
# 1) 更新权威存储
#    （重新抓取 → prototype/data/laws/<id>.json，或按既有入库脚本）

# 2) 重建 catalog（保持与 laws/ 一致）
node _work/backend/fix-catalogs.js

# 3) 重建数据库
python backend/build_db.py

# 4) 自测 + 重启
python backend/test_api.py
docker compose restart api
```

## 六、当前限制（Phase A）

| 项 | 现状 | 后续 |
| :--- | :--- | :--- |
| 检索粒度 | **法规级** BM25 | Phase B：条文级 + 向量 |
| 语义能力 | 同义词扩展（伪语义） | Phase B：`bge-m3` 向量召回 |
| 问答 | 只返回依据条文 | Phase B/C：接生成模型 |
| 鉴权 | 无 | Phase D：API Key / 账号 |
| 缓存 | 无 | Phase B：Redis 或进程内 LRU |
| 多进程 | 单 worker | Phase B：`--workers 4` 需先做 DB 连接池评估 |

## 七、故障排查

| 现象 | 原因 | 处理 |
| :--- | :--- | :--- |
| `数据库不存在` | 未建库或挂载路径错 | 跑 `build_db.py`，检查 `CALR_DB` |
| `/api/health` 503 | DB 损坏或权限 | 重建 DB；确认挂载为 `:ro` 时文件可读 |
| 检索很慢 | 候选过多或 cache 冷 | 首次查询会建缓存，属正常 |
| 静态站 404 | `prototype/` 未挂载进镜像 | 检查 Dockerfile 的 `COPY prototype` |
| 前端连不上后端 | CORS 或 URL 参数错 | 已在服务端开 `allow_origins=["*"]`；检查 `?api=` |
