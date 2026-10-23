# backend/data

本目录存放 SQLite 数据库 `calr.db`（约 1.6 GB），**不入 git**。

生成方式：

`ash
python backend/build_db.py
`

数据源是 `prototype/data/laws/*.json`（18,861 部法规 / 334,779 条条文）。
建库耗时约 7 分钟。

部署时用 scp 或对象存储单独上传到服务器，见 `backend/DEPLOY.md`。
