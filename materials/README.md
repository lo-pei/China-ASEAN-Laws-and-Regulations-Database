# 比赛材料（materials/）

本目录集中存放**面向比赛、评审、申报与路演**的全部材料。
工程文档在 [`docs/`](../docs/README.md)，数据契约在 [`rules/`](../rules/README.md)，本目录不放代码与数据。

> 全局编号约定：`docs/` 00–04（工程文档）· `materials/` 05–06（演示与申报）· `docs/deploy/` 07–10（运维）。
> 编号在全仓库唯一，md 与 docx 同号。

---

## 一、目录一览

| 目录 | 放什么 | 入库 | 约体积 |
| :--- | :--- | :---: | ---: |
| [`submission/`](submission/) | **官方提交物**：仅两份 PDF（上传系统用） | ✅ | 2.5 MB |
| [`reports/`](reports/) | 项目报告书、申报书、申报附件（docx 交付版 + 申报书 md 源） | ✅ | 0.3 MB |
| [`roadshow/`](roadshow/) | 路演与演示：演示视频脚本、交互方案页、产品 Demo/说明书源文件与渲染件 | ✅ | 3.1 MB |
| [`_archive-2026-10-24/`](_archive-2026-10-24/) | 历史 docx/pdf（**不入 git**，仅本地追溯） | ❌ | 62.5 MB |

---

## 二、提交物（`submission/`，**只上传这两份**）

| 文件 | 页数/定位 | 给谁看 |
| :--- | :--- | :--- |
| [`产品解决方案Demo.pdf`](submission/产品解决方案Demo.pdf) | 演示文档：演示目标、四幕操作、预期结果、真实截图、3/5/8 分钟讲解话术 | 评委 / 答辩现场 |
| [`产品使用说明书.pdf`](submission/产品使用说明书.pdf) | 使用手册：打开方式、界面、逐功能操作、FAQ、部署维护、已知限制 | 使用者 / 评委 / 部署者 |

两份是不同东西：Demo 讲“怎么把产品演示出来”，说明书讲“产品怎么用”。
可编辑源文件与重新生成方法在 [`roadshow/`](roadshow/README.md)。

---

## 三、报告与申报材料（`reports/`）

| 文件 | md 源 | 用途 |
| :--- | :--- | :--- |
| [`01-项目总览.docx`](reports/01-项目总览.docx) | [`docs/01-项目总览.md`](../docs/01-项目总览.md) | 评审材料 |
| [`02-数据规范与治理.docx`](reports/02-数据规范与治理.docx) | [`docs/02-数据规范与治理.md`](../docs/02-数据规范与治理.md) | 评审材料 |
| [`03-技术架构与检索.docx`](reports/03-技术架构与检索.docx) | [`docs/03-技术架构与检索.md`](../docs/03-技术架构与检索.md) | 评审材料 |
| [`04-交付验收与后续规划.docx`](reports/04-交付验收与后续规划.docx) | [`docs/04-交付验收与后续规划.md`](../docs/04-交付验收与后续规划.md) | 评审材料 |
| [`06-项目申报书正文.md`](reports/06-项目申报书正文.md) | **本目录源文件** | 大赛申报书五段正文（评分材料） |
| [`06-项目申报书正文.docx`](reports/06-项目申报书正文.docx) | 同上 | 申报系统提交用 |
| [`附件2-项目申报书（填写稿）.docx`](reports/附件2-项目申报书（填写稿）.docx) | **无 md 源** | 官方附件 2 原始填写稿 |

> 编号 05 是演示视频脚本，属路演材料，见 [`roadshow/05-演示视频脚本.md`](roadshow/05-演示视频脚本.md)（docx 渲染版同在 roadshow/）。
> 01–04 的 md 源是工程文档，留在 `docs/`；本目录只放对外交付的 docx 渲染版。

---

## 四、路演与演示（`roadshow/`）

| 文件 | 说明 |
| :--- | :--- |
| [`05-演示视频脚本.md`](roadshow/05-演示视频脚本.md) / [`.docx`](roadshow/05-演示视频脚本.docx) | 4 分 30 秒分镜脚本、旁白全稿、答辩 PPT 大纲 |
| [`index.html`](roadshow/index.html) | 交互式方案讲解页（答辩备用/大屏展示），`file://` 可打开；**不是产品** |
| [`产品解决方案Demo.md`](roadshow/产品解决方案Demo.md) / `.docx` | Demo 文档源文件与 Word 版（PDF 提交物在 `submission/`） |
| [`产品使用说明书.md`](roadshow/产品使用说明书.md) / `.docx` | 使用说明书源文件与 Word 版（PDF 提交物在 `submission/`） |
| [`产品解决方案说明书.md`](roadshow/产品解决方案说明书.md) / `.docx` / `.pdf` | 早期 22 页“方案论证”版，**不作为提交物**，仅参考 |
| [`assets/shots/`](roadshow/assets/shots/) | 两份 PDF 中使用的真实界面截图 |
| [`tools/build_docx.py`](roadshow/tools/build_docx.py) / [`tools/md2docx.py`](roadshow/tools/md2docx.py) | md → docx 构建脚本 |

详细说明见 [`roadshow/README.md`](roadshow/README.md)。
真实产品入口是 [`prototype/index.html`](../prototype/index.html)。

---

## 五、重新生成

```bash
# 1) 路演文档 DOCX（在仓库根目录执行）
python materials/roadshow/tools/build_docx.py materials/roadshow/产品解决方案Demo.md materials/roadshow/产品解决方案Demo.docx "产品解决方案 Demo" "3–8 分钟可复现的产品演示动线"
python materials/roadshow/tools/build_docx.py materials/roadshow/产品使用说明书.md materials/roadshow/产品使用说明书.docx "产品使用说明书" "从打开、检索到比对与问答的完整操作指南"

# 2) DOCX → PDF（LibreOffice），产物拷入 submission/
soffice --headless --convert-to pdf --outdir materials/submission materials/roadshow/产品解决方案Demo.docx materials/roadshow/产品使用说明书.docx
```

- `reports/01–06` 的 docx 由 `docs/01–06` 的 md 渲染；当前**没有一条命令可跑通**的批量流水线
  （旧脚本 `_work/build_docs.py` 的 JOBS 映射已过期），重出前先修映射。
- 改 `reports/06` 申报书（评分材料）或 `roadshow/05` 演示脚本后，**必须重出对应 docx**。

---

## 六、命名与归档约定

1. **命名**：`NN-中文名.<ext>`，编号与全仓库一致；官方附件保留原名（如 `附件2-…`）。禁止空格与 `副本/copy/final/v2` 等无信息后缀。
2. **新增材料**：先在本页登记，再放入对应子目录；两类以上用途不清时放 `roadshow/` 并在本页注明。
3. **过期材料**：移入 `_archive-YYYY-MM-DD/`，不要删除；归档目录不入 git。
4. **边界**：md 工程文档放 `docs/`；数据契约放 `rules/`；本目录只放“给人看/给评委看”的材料。

---

## 七、遗留说明

- `reports/06` 与 `roadshow/` 中部分统计数字仍是旧口径（18,785 部 / 339,351 条），
  最新数据口径见 [`docs/README.md` §三](../docs/README.md)；评分材料重出时统一同步。
- `reports/附件2-项目申报书（填写稿）.docx` 为官方表格原样，**不重编、不改名**（仅去掉历史编号 `07-` 以避免与 `docs/deploy/07` 撞号）。
