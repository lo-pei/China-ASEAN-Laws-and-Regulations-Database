# backend

FastAPI + SQLite + ONNX 向量后端。静态前端在 [prototype/](../prototype/)，可直接 `file://` 打开；
本目录提供检索质量更好的服务形态。

---

## 一、目录

| 路径 | 职责 |
| :--- | :--- |
| `build_db.py` | `prototype/data/laws/*.json` → `backend/data/calr.db` |
| `app/main.py` | FastAPI 入口、路由、静态站挂载 |
| `app/db.py` | SQLite 访问层 |
| `app/search.py` | BM25 / 关键词检索 |
| `app/vectors.py` / `embedder.py` / `hybrid.py` | 向量检索、bge-m3 嵌入、RRF 融合 |
| `app/security.py` | 限流 / 安全中间件 |
| `test_api.py` | 13 项后端自测 |
| `DEPLOY.md` | 后端 Docker 部署说明（与 docs/deploy/ 互指） |
| `data/` | `calr.db` + `vectors/`（均不入库，由脚本生成） |

---

## 二、本地运行

```bash
python backend/build_db.py                      # 建库，约 7 分钟，产出约 1.2 GB
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
python backend/test_api.py                      # 另开终端，13 项自测
```

可选向量能力：模型放在 `_work/models/bge-m3`，按 `_work/phaseb/` 的脚本生成索引；
没有向量索引时自动降级为纯 BM25，功能不受影响。

---

## 三、数据产物

| 产物 | 体积 | 来源 |
| :--- | ---: | :--- |
| `data/calr.db` | 约 1.2 GB | `build_db.py` |
| `data/vectors/` | 约 310 MB | `_work/phaseb/embed.py` |
| `_work/models/bge-m3` | 约 2.2 GB | `_work/phaseb/download.py` |

## 四、更多文档

- 部署：本目录 [DEPLOY.md](DEPLOY.md)、[docs/deploy/](../docs/deploy/)
- 架构与检索实现：[docs/03-技术架构与检索.md](../docs/03-技术架构与检索.md)
