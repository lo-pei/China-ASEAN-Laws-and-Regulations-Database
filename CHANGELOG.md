# 变更记录

## 2026-10-29 · 工程文档与比赛材料分离（materials/）

> 说明：本日期之前的条目记录的是当时路径（如 `solution/`、`deliverables/`），
> 这些目录已于本次归并到 `materials/`，历史条目不回改。

### 目录结构

- **工程文档与比赛材料分离**：`docs/` 只保留工程文档（00–04 + `deploy/` 07–10 + `_archive-*`）；比赛材料集中到新建 `materials/`。
- 文档迁移：`docs/05-演示视频脚本.md` → `materials/roadshow/`；`docs/06-项目申报书正文.md` → `materials/reports/`；
  `docs/07-标题多语种规范.md` → `rules/SKILL-法规标题多语种规范.md`（跨语种标题上位规范，与中译/英译/越南语/印尼语 SKILL 互补、非重复；rules 权威契约 6 → 7 份）。
- 交付物归并：`deliverables/01`–`04`、`06` docx 与 `附件2-项目申报书（填写稿）.docx` → `materials/reports/`；
  `05-演示视频脚本.docx` → `materials/roadshow/`（与 md 同目录）；`附件2` 去掉历史编号 `07-`（原与 `docs/deploy/07` 撞号）；
  `deliverables/_archive-2026-10-24/` → `materials/_archive-2026-10-24/`；`deliverables/` 删除。
- 路演材料归并：`solution/` → `materials/roadshow/`（index.html、assets、tools、产品 Demo/说明书 md/docx/pdf）；
  `solution/提交物/*.pdf` → `materials/submission/`（仅两份提交物）；`solution/` 删除。
- 临时目录归档：`_audit/`、`_out/` → `_work/_archive-2026-10-29/`（不入库）；27 条移动记录见
  `_work/_archive-2026-10-29/repo-org/move-manifest-2026-10-29.csv`，旧交付物索引见同目录 `superseded-indexes/`。
- 新增 `materials/README.md`（材料总索引）与 `materials/roadshow/README.md`（由 `solution/README.md` 改写）。
- `.gitignore`：归档规则 `deliverables/_archive-*/` → `materials/_archive-*/`；顶部跟踪说明同步。

### 引用与索引

- 更新 `README.md`、`docs/README.md`、`docs/00-目录结构与维护指南.md`、`docs/01`、`docs/02`、`docs/04`、
  `docs/deploy/README.md`、`rules/README.md`、`rules/SKILL-条文入库与译文分离规范.md` 的路径与目录说明。
- `materials/roadshow/tools/build_docx.py`：截图目录改为按脚本位置解析（`materials/roadshow/assets/shots/`），docstring 同步。
- 路演文档中的 `../docs`、`../prototype`、`提交物/` 等相对链接按新层级修正；`docs/00` 的调整记录补充 2026-10-29 批次。

### 验证

- Markdown 相对链接检查：79 个 md、176 条相对链接，**活动目录 0 断链**；
  `docs/_archive-2026-10-24/` 与 `rules/_archive-2026-10-25/` 历史归档内 11 条旧链接保持原样（归档冻结，不作修改）。
- `python -m py_compile materials/roadshow/tools/build_docx.py materials/roadshow/tools/md2docx.py` 通过；`index.html` 资源引用仍为相对路径。
- 未改 `prototype/`、`backend/` 的代码与数据；未提交、未推送。

## 2026-10-29 · 新法规/译文/标题入库（42,120 部）与检索页修复

- **法规**：新增 23,335 部，法规总数 18,785 → **42,120**，条文 335,689 → **564,127**，
  正文字符 → **602,143,441**；主要来自 PH +12,498、MY +6,902、ID +3,312、VN +340、TH +225、LA +58。
- **译文**：D 层 47 卷 / **5,633 部 / 90,627 条**（英 5,632、中 40），返回包全部落盘。
- **标题**：`title-multi` 已接受 149 批；`titles.zh.json` 从旧 18,785 条同步为 **28,319 条（67.23%）**，
  覆盖 PH 45.9%、ID 63.7% 等；标题长尾仍待补。
- **数据修复**：784 个重复 `article.id` 改为唯一后缀（161 部法规），`verify-data-home` 通过。
- **派生层**：index、intl/cn/fulltext 分卷、catalog、manifest 全部重建；
  校验：check-resolve 42,120 全部解析，verify-data/fulltext/trans-layer/i18n/forbidden 全部通过。
- **检索页修复**：非中文界面机构/来源/条号标签本地化；结果卡只保留标题+国家/修正/公布/施行/收录；
  新增结果区筛选/排序条（制定机关、时效性、层级、排序）；原文标题改用【】。
- **待办**：MY 281、TH 592、VN 244 份扫描件 OCR；标题长尾（PH 16,102、ID 1,364 条次）；
  `backend/data/calr.db` 与向量索引需按 42,120 部重建；docs/01–06 与 docx 数字待同步。

## 2026-10-26 · 印尼语/越南语译文与英译标题入库

- **译文层**：新增越南语→英语 4 部（VN-H086/093/121/123），越→英累计 17 部 / 2,682 条；
  印尼语译文回执 29 部（英 28 部 / 中 29 部）从 `laws.text` 迁入 D 层，共 8,860 条；
  译文层合计 **1,612 部 / 71,626 条 / 31 分卷**。
- **标题**：1,560 部中国法规、88 部越南法规补英文标题；印尼语批次 29 部中文标题变更、2 部新增；
  `title-zh` 档案同步为 **18,748 部（99.80%）**。
- **数据校正**：印尼法规正文按清洗后源重建（36 部），源文只保留单一语种；条文总数
  339,351 → **335,689**，正文字符 → **269,474,033**；`index.json`、分卷、catalog 全部重建。
- **校验**：verify-data / verify-data-home / verify-fulltext / test-trans-layer / check-i18n /
  scan-forbidden2 全部通过（6 警告 / 4 提示，为已知存量问题）。
- **待办**：越南语 6 部译文中途（H002/H007/H087/H092/H100/H112）、17 部未开始；
  H012 中文译文缺 30 条；`docs/01–06` 与 docx 的数字待同步。

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
