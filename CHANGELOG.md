# 变更记录

## 2026-10-25 · 两份 PDF 提交物（产品解决方案 Demo + 产品使用说明书）

- 提交物：`solution/提交物/产品解决方案Demo.pdf`（13 页演示动线）、
  `solution/提交物/产品使用说明书.pdf`（17 页使用手册）。两份定位不同，均只提交 PDF。
- Demo：演示目标/准备、四幕操作（检索→详情→比对→问答）、补充场景、3/5/8 分钟讲解话术、
  可复现与兜底；采用真实界面截图（含“中越外商投资准入对比”真实报告）。
- 使用说明书：打开方式、界面总览、逐功能操作、数据口径、10 条 FAQ、部署维护、已知限制。
- 原 22 页《产品解决方案说明书》保留为参考，不作为提交物；`index.html` 方案讲解页保留为非提交参考。
- 来源页截图隐去随构建批次变化的旧统计列，避免与 18,785/339,351 口径冲突。

## 2026-10-25 · 产品解决方案包（新增）

- 新增 `solution/`：交互 Demo（`index.html`，零依赖、可离线）、说明书 `产品解决方案说明书.md/.docx/.pdf`、
  可复现构建脚本 `solution/tools/`。
- Demo：10 个章节、6 个功能 Tab、25 部真实法规样本、真实法条引用；数据全部来自 `prototype/data/`。
- 说明书：22 页，摘要 + 13 章 + 附录 A/B，15 张表、3 张真实界面截图；面向比赛评审。
- 项目入口新增 `solution/` 指引（README / docs/00 / docs/README）。

## 2026-10-25 · 目录整理、缓存清理与文档口径同步

### 目录结构

- `docs/07–09` 移入 `docs/deploy/`（保留编号）；根目录未入库的《阿里云 Windows 部署指南》编号为
  `docs/deploy/10-部署-Windows阿里云实测复盘.md` 并正式入库。
- `rules/` 6 个旧文件移入 `rules/_archive-2026-10-25/`，新增契约索引 `rules/README.md`。
- `tools/` 5 个评测/补抓快照移入 `tools/reports/`，脚本与数据分离。
- 新增索引/说明：`docs/00-目录结构与维护指南.md`、`docs/README.md`、`docs/deploy/README.md`、
  `deliverables/README.md`、`tools/README.md`、`prototype/data/README.md`、`backend/README.md`。
- `_work/` 根目录从 530 个文件精简到 11 个入口脚本；68 个一次性任务目录 + 519 个一次性脚本归档到
  `_work/_archive-2026-10-25/`（不入库）。

### 本地清理（`_work/`，不入库）

- `_work` 从 **12.85 GB → 3.24 GB**，释放 **9.61 GB**：`hf-cache`、两个 `calr.db.before-*` 快照、
  `pylibs*`、`dockersim`、`backup-d1`（`key/` 已先保留）、`git-backup`。
- 删除 0 字节日志、空结果 JSON、临时 `width-test*.docx`、`__pycache__` 等明确垃圾。
- 逐项核验、依赖 freeze 与恢复方式：`_work/_archive-2026-10-25/deleted-2026-10-25.md`。

### 修复

- **CI**：`tools/verify.js`、`tools/verify-fulltext.js` 写报告前 `mkdirSync`，修复全新 checkout 必挂的问题。
- `.gitignore` 改为显式排除，新建顶层目录不再被静默忽略。
- `README.md` / `docs/` 的校验命令统一指向 `tools/` 正本；`docs/09` 修正 `onnxruntime-directml`
  判断并指向 `deploy/10` 实测复盘。
- `tools/crawl-lawphil-batch.py` 的补抓清单路径改为 `tools/reports/recrawl-tasks.csv`。

### 文档口径同步（md 与 docx 同步）

- 01–05：条文 **339,351** / 正文字符 **270,627,557** / 中文标题 **18,746（99.79%）** / 缺标题 **39 部** /
  i18n **870 键** / SQLite 约 **1.22 GB** / 向量约 **310 MB** / 文档 **11 份**。
- `docs/06` 申报书为评分材料，口径（334,681 / 18,854 / 13,450）待 owner 确认，本次未改。

### 验证

- 8 项 CI 检查全绿（382 个 JS 语法 + 7 个数据校验器）。
- 模拟全新 checkout（临时隐藏 `_work/`）后 `verify.js`、`verify-fulltext.js` 均 exit 0。
- 85 条 Markdown 相对链接 0 断链。
