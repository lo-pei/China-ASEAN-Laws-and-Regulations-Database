# backend/data

存放 SQLite 数据库 `calr.db`（约 1.2 GB）与向量索引 `vectors/`（约 310 MB），**均不入 git**。

生成方式：

```bash
python backend/build_db.py
```

数据源是 `prototype/data/laws/*.json`（18,785 部法规 / 339,351 条条文）。
建库耗时约 7 分钟。

部署时用 scp 或对象存储单独上传到服务器，见 [backend/DEPLOY.md](../DEPLOY.md)
与 [docs/deploy/](../../docs/deploy/)。
