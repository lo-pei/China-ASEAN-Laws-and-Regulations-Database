# _work/ 本地工作区

> **本目录不入 git**（见根 `.gitignore`）。它是模型、批次数据和历史脚本的本地工作区。
> **2026-10-25 已清理缓存/备份：12.85 GB → 3.24 GB。**
> **2026-10-29 已确认数据入库后清理原始包/旧备份：29.52 GB → 2.32 GB**；
> 删除清单与保留项见 [`CLEANUP-2026-10-29.md`](CLEANUP-2026-10-29.md)。
> 下文的 `_archive-2026-10-25/` 等历史路径已随清理删除，仅作历史记录，不要按路径重跑。
> 交付物不依赖本目录；`prototype/` 必须能单独运行。

---

## 一、当前结构

```
_work/
├── <11 个入口脚本>            # 被文档引用的可重跑脚本（见 §二）
├── <2 个报告 txt>             # verify-report.txt / verify-fulltext-report.txt（可重生成）
├── README.md
├── pipeline 类 14 个目录      # 可重跑的构建步骤（见 §三）
├── data 类 7 个目录           # 原始数据载荷（见 §四）
├── batches 类 9 个目录        # 国家入库批次（见 §五）
├── models/                    # bge-m3 ONNX 模型（2.13 GB，不可删，见 §六）
├── removed-junk/              # 删除条目隔离区（审计留痕，勿删）
└── _archive-2026-10-25/       # 本次整理的归档（见 §七）
    ├── dormant/               # 30 个 10-23 前完结的一次性任务目录
    ├── recent-2026-10/        # 38 个 10-23~25 的一次性任务目录
    ├── scripts/               # 519 个根目录一次性脚本/日志，按 12 类分
    ├── audit-2026-10-25/      # 本次整理的审计证据（7 个文件）
    ├── backup-d1-key/         # 6 个仅存于此的旧前端文件（删除 backup-d1 前抢救）
    └── deleted-2026-10-25.md  # 缓存/备份删除记录
```

> **分桶说明**：§三–§五 的分组是**用途归类**，目录仍在 `_work/` 顶层原位。
> 不物理移动的原因：`_work` 内有 **794 个文件**用 `_work/<dir>` 引用兄弟目录、
> 373 个文件写死绝对路径；移动会大范围破坏历史脚本。

---

## 二、根目录入口脚本（保留）

| 脚本 | 用途 | 文档引用 |
| :--- | :--- | :--- |
| `build-no-fulltext-inventory.js` | 生成"无本地原文清单" | 11 处（最多） |
| `export-law-articles.js` | 条文导出 | 3 处 |
| `fix-ocr.js` / `verify-ocr.js` | OCR 修正/校验 | 各 1–2 处 |
| `fix-text-layout.js` / `prove-layout.js` | 文本版式修正/验证 | 各 1–2 处 |
| `verify.js` / `verify-fulltext.js` / `check-i18n.js` / `scan-forbidden2.js` | 校验器 | 与 `tools/` **逐字节相同**；正本已改为 `tools/` |
| `build_docs.py` | docx 批量生成 | **⚠ 见 §八 已知陷阱** |

---

## 三、pipeline 类：可重跑的构建步骤（14 个，仍在顶层）

| 目录 | MB | 用途 |
| :--- | ---: | :--- |
| `trans/` | 180 | 译文批次流水线与回执（DB 快照已删） |
| `ingest-archive/` | 60 | 卷册抽取 |
| `backend/` | 31 | 后端辅助脚本（`fix-catalogs.js` 被 docs/02 引用） |
| `toc/` | 31 | 目录（TOC）数据 |
| `crawl/` | 9 | 抓取批次（DB 快照已删） |
| `intl-harvest/` | 15 | 境外法规抓取 |
| `title/` | 14 | 标题中译批次 |
| `fix/` | 4.4 | 数据修补（`split-laws.py` 被 docs/02 引用） |
| `rag/` | 1.5 | 评测集（`gold.json` 被 docs/04 引用） |
| `recrawl/` | 0.8 | 补抓任务 |
| `bm25/` / `merge/` / `phaseb/` / `tools/` | <1 | BM25 索引 / 派生重建 / 向量化 / harvest 脚本 |

**被 tracked 文档引用的目录**（移动前必须先改文档）：
`trans`、`crawl`、`merge`、`fix`、`rag`、`backend`、`recrawl`、`phaseb`、`title`、`intl-harvest`、`tools`、`removed-junk`、`dedup-archive`、`models`。

---

## 四、data 类：原始数据载荷（7 个，仍在顶层，约 102 MB）

`bn/`（1,447 个 JSON）· `vn/` · `my/` · `id/` · `cn/`（46 个 docx 抽取）· `tr/` · `dedup-archive/`（跨层去重留痕，2 处文档引用）

## 五、batches 类：国家入库批次（9 个，仍在顶层，约 621 MB）

`kh_ingest/`（含 183 MB 原始 PDF）· `vn_ingest/` · `ph_ingest/` · `tl_ingest/` · `la_ingest/` · `cn-ingest/` · `th_ingest/` · `mm_ingest/` · `title-import/`

## 六、models（保留）

`models/bge-m3/` 约 2.13 GB，ONNX 导出（`model.onnx_data`），被 README、docs/deploy/07–09、
`backend/app/embedder.py` 等 10 处引用。**不是**普通 HF 下载格式，删除后需重新导出，务必保留。

---

## 七、本次归档（_archive-2026-10-25/）

| 子目录 | 内容 | 数量 |
| :--- | :--- | ---: |
| `dormant/` | 10-23 前完结的一次性任务目录（`ui*`、`p0/p4/p7`、`docs-sync` 等） | 30 个目录 |
| `recent-2026-10/` | 10-23~25 的一次性任务目录（`ui3`、`polish`、`mobile`、`sg`、`audit` 等） | 38 个目录 |
| `scripts/` | 根目录一次性脚本/日志，按 12 类分（`gitmsg/` `crop/` `patch/` `fix/` `i18n/` `country/` `logs/` `snapshots/` `misc/` …） | 519 个文件 |
| `audit-2026-10-25/` | 本次整理的审计证据（仓库引用图、文档分级、`_work` 清单及 CSV） | 7 个文件 |
| `backup-d1-key/` | 删除 `backup-d1` 前抢救的 6 个旧前端文件（其中 5 个在仓库中无同哈希副本） | 6 个文件 |

归档里的脚本可能因相对路径变化**不能直接重跑**；需要时按原路径还原，或从 `pipeline/` 对应步骤重新生成。

---

## 八、已知陷阱（重要）

1. **`build_docs.py` 的 JOBS 已整体过期**：仍指向旧文档集，跑一次会把 `deliverables/` 覆盖成旧集合。
   重出 docx 前先修映射，见 [deliverables/README.md](../deliverables/README.md)。
2. **9 个脚本与 `tools/` 逐字节相同**：4 个根入口 + `crawl/{apply,batch,crawl}.py` + `recrawl/build.py` + `two/align-check.js`。
   正本是 `tools/`，改一处要同步。
3. **64 个失效的 `_work/<x>` 目标**（约 4,657 处引用）来自更早一次未同步的清理
   （`_work/cache`、`_work/_backup_20261006`、`_work/archive-oneoff` 等），不要据此重跑脚本。
4. **`_work/ocr-changelog.json` 缺失**：rules 的 SKILL 文档称有 707 KB 改动日志，实际不存在；
   可用 `node _work/fix-ocr.js --log` 重建。

---

## 九、2026-10-25 清理（已执行）

删除约 **9.61 GB**，`_work` 从 **12.85 GB → 3.24 GB**。逐项核验与恢复方式见
[`deleted-2026-10-25.md`](_archive-2026-10-25/deleted-2026-10-25.md)。

| 已删除 | 约大小 |
| :--- | ---: |
| `hf-cache/`（nllb-200 缓存，可重下） | 2.37 GB |
| `trans/calr.db.before-langfix` + `crawl/calr.db.before-recrawl`（被现网库取代） | 3.22 GB |
| `pylibs/` + `pylibs_ml/` + `pylibs_dml/`（freeze 已存 `removed-env-freeze.txt`） | 1.37 GB |
| `dockersim/`（仓库副本 + 一次性 venv） | 1.17 GB |
| `backup-d1/`（`prototype/` 冗余副本，`key/` 已先保留） | 0.91 GB |
| `git-backup/`（提交 `ad30516` 仍在本地分支） | 0.81 GB |

**仍保留（勿删）**：`models/bge-m3`、`kh_ingest/pdf/`、`trans/{cn-en,jobs,returns,glossaries}`、
`dedup-archive/`、`removed-junk/`、以及 pipeline/data/batches 全部目录。

---

## 十、约定

1. 新的一次性脚本 → `_archive-2026-10-25/scripts/<类别>/`，不要堆在根目录。
2. 阶段备份 → `_backup-YYYYMMDD/`；完结任务 → `_archive-YYYY-MM-DD/`。
3. 改动被文档引用的脚本/目录时，同步改 `docs/`、`rules/`、`README.md` 中的路径。
4. `_work` 名称本身不要改（会破坏 1,000+ 处路径引用）。
5. 新增可重建缓存/依赖时，在删除前先记录 `pip freeze`/版本，再单独存放。
