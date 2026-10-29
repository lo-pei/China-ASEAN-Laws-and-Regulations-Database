# 项目数据入库与一致性核查（2026-10-29 收尾）

> 本报告记录本轮“标题翻译入库、法律(1) DOCX 章节重切、i18n 补齐、_work 清理”的核查依据。
> 数据事实以 `prototype/data/laws/index.json` 为准；派生库完成后由 `backend/data/calr.db` 复核。

## 一、权威数据

| 项 | 值 | 来源 |
| :--- | ---: | :--- |
| 法域 | 12 | `index.json meta` |
| 法规 | 42,121 | 同上 |
| 条文 | 564,579 | 同上 |
| 正文字符 | 602,209,705 | 同上 |
| 中文标题 | 30,664（72.80%） | `title-zh/titles.zh.json` |
| 译文层 | 5,633 部 / 90,627 条 / 47 分卷 | `prototype/data/trans/manifest.js` |
| 界面语言键 | 898（en/vi/th/id/ms 缺失 0） | `node tools/check-i18n.js` |

## 二、法律(1) DOCX 重切

- 源文件：`C:\Users\lenovo\OneDrive\Desktop\法律(1)\`（373 份 `.docx`）。
- 逐文件解析“章/条”，按标题与 `versionDate/promulgatedDate` 匹配现有中国法：
  - **316 部就地更新**：148 部同版本修正 + 167 部补版本日期；
  - **1 部作为新版本入库**：`CN-LAW-9001`《中华人民共和国刑法》2020-12-26 版，452 条；
  - **55 份跳过**：52 份刑法修正案/法律解释没有“第X条”正文结构；3 份为旧版本/其他（最新库已有更新的 2026-03-12 版）；
  - 民法典修复为 **1,260 条 / 79 章**。
- 重切脚本：`_work/toc-redo/apply_toc.py`；计划与统计：`_work/toc-redo/plan.txt`。
- 新版本保留旧版本，旧版本 `amendedNote` 记录替代关系。

## 三、标题批次

- `_work/title-multi/_self` 的 `ID-01`–`ID-13`、`MY-01` 及 `_ext_batches` 已全部执行 `apply-multi.js --dry`：
  **写入 0、无变化**，说明均已入库。
- `_self/_rest-ID.json` 为“待译清单”（287 条），不是未入库译文；`pending-ID.json` 同理。
- 标题档案已同步：`titles.zh.json` 30,664 部。

## 四、界面翻译

- 新增术语/条款/首页/详情页缺失 key；5 语（en/vi/th/id/ms）全部补齐。
- 首页免责声明（用户指出项）已逐语写入，`node tools/check-i18n.js`：**898 键，missing 0**。
- 首页“截至 2026-10-29”数据口径已改为 42,121 / 564,579 / 6.02 亿，与 README/docs 一致。

## 五、_work 清理

- 清理前 29.52 GB → 2.30 GB；第二轮备份清理后约 **2.30 GB**。
- 删除：`ingest-archive`、`_archive-2026-10-29`、各国 `*_ingest`、旧 `_work/toc`、`toc-redo/backup`、`title-import/catalog-backup`、`fix/law-backup` 等。
- 保留：`models/`（bge-m3）、`merge/`、`backend/`、`fix/`、`title-multi/`、`toc-redo/`、`i18n-audit/`、`_ui_qa/`、`_solution/`。
- 清单：`_work/CLEANUP-2026-10-29.md`。

## 六、校验记录

- `node tools/verify.js`：通过。
- `node tools/verify-data.js`：通过（829 警告为已知存量问题）。
- `node tools/verify-data-home.js`：通过（1 条已知重复条号警告）。
- `node tools/verify-fulltext.js`、`test-trans-layer.js`、`check-i18n.js`、`scan-forbidden2.js`、`_work/merge/check-resolve.js`：通过。
- 全量 JS `node --check`：0 失败。
- SQLite：`backend/build_db.py` 已重建并核对 **42,121 部 / 564,579 条**，`built_at=2026-10-29T21:13:57`，DB 约 2,092 MiB（见 `docs/README.md §三`）。

## 七、仍待处理

- 向量索引仍为 18,861 部 / 334,779 条，未覆盖新增法规；优化建议见 `docs/03a`。
- 55 份 DOCX 是修正案/解释，未按“整部法”入库；若需要应单独建“修正案/解释”类型。
- 比赛材料 `materials/reports/06`、`materials/roadshow/` 的旧数字未重排；工程文档已更新，重出 PDF 时统一。
