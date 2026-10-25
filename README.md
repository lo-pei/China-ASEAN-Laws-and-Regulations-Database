# 中国—东盟法律法规数据库（CALR）

> **东盟法律，一库通查** —— 面向东盟 11 国的多语种、AI 驱动的跨境法律法规数据库平台
> 2026 年中国（广西）—东盟"AI+法律"应用创新大赛 · 高校学生赛道 · 面向东盟法律服务方向
> 参赛队伍：上海对外经贸大学 一粒橡子队

---


> 部署到云服务器：见 [docs/deploy/](docs/deploy/)（[07 通用云服务器](docs/deploy/07-部署指南.md) · 08 B+ 完整版 · 09 Windows 服务器 · 10 Windows 实测复盘）。
> 产品解决方案 Demo + 说明书：见 [solution/](solution/)（HTML 交互演示 / DOCX / PDF，面向评审与答辩）。

## 一、这是什么

一个**可交互的 Web 产品**，把中国、东盟十国与东帝汶共 **12 个法域**的官方法规文本，做成可检索、可溯源、
可跨语言对照、可规范引注的一站式工具。

**核心理念**：不是"把法规堆在网页上"，而是把三件事做成工程约束 ——

| 约束 | 含义 |
| :--- | :--- |
| **可溯源** | 每部法规都能回答"从哪来、什么时候抓的、是否完整"，可点回官方页面核验 |
| **跨语言** | 中文用户能读到泰文、越南文、印尼文法规；反之亦然 |
| **AI 可解释** | 问答每条结论都附条文出处，可逐条回溯原文，不做推测性回答 |

### 数据规模

| 指标 | 数值 |
| :--- | ---: |
| 法域 | **12**（中国 + 东盟十国 + 多边条约） |
| 法规 | **18,785** 部 |
| 条文 | **339,351** 条 |
| 正文字符 | **2.71 亿** |
| 译文 | 1,566 部 / **60,084** 条 |
| 中文标题覆盖 | **99.79%**（18,746 部） |
| 界面语言 | 中 / 英 / 越 / 泰 / 印尼 / 马来 |

---

## 二、快速开始

### 方式一：纯静态（零依赖，最快）

直接用浏览器打开 `prototype/index.html` 即可。不装任何东西、不联网。

### 方式二：后端形态（推荐，检索质量与性能都更好）

```bash
# 1) 建库（首次约 7 分钟，产出 backend/data/calr.db 约 1.2 GB）
python backend/build_db.py

# 2) 装依赖并起服务
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# 3) 浏览器打开
#    http://127.0.0.1:8000/
```

**同一套前端代码自动识别**：`http(s)://` 打开走后端，`file://` 打开走纯静态。

### 可选：向量检索与语义问答

后端形态下的混合检索与条文级问答依赖 bge-m3 向量索引（约 310 MB，不入库）：

```bash
python _work/phaseb/download.py                 # 下载模型
python _work/phaseb/embed.py --level law        # 法规级（GPU 约 20 分钟）
python _work/phaseb/embed.py --level article    # 条文级（GPU 约 4 小时）
```

没有向量索引时，检索自动降级为纯 BM25，功能不受影响。

---

## 三、功能

| 功能 | 入口 | 说明 |
| :--- | :--- | :--- |
| **法规检索** | `#/search` | 关键词 / 自然语言 / 条号三种方式；12 法域、主题、层级、时效性筛选 |
| **法规详情** | `#/law/:id` | 原文 + 译文对照、条文目录、文内查找、全文朗读、导出 PDF |
| **跨语言条款比对** | `#/compare` | 选 2–3 法域条文，按「适用范围 / 核心概念 / 法律后果 / 程序与期限 / 门槛与标准」五维并排比对 |
| **AI 智能问答** | `#/assistant` | 条文级引用，每条结论可回溯原文；支持用户自带模型（BYOK） |
| **法律术语对照** | `#/terms` | 术语在多国语言中的对照译法 |
| **规范引注导出** | 详情页「下载与引用」 | GB/T 7714-2015 · Bluebook · 简化式 · 完整式 |
| **数据来源核验** | `#/sources` | 逐条标注官方来源、入库日期与收录形态 |

---

## 四、技术亮点

| 亮点 | 说明 |
| :--- | :--- |
| **零构建零依赖 SPA** | 全部 classic `<script>`，无打包器；`file://` 可直接运行，评委只需浏览器 |
| **混合检索** | BM25 + bge-m3 向量 + RRF 融合。实测 P@3 由 5.7% 提升到 **16.7%**，跨语言召回由 40.6% 提升到 **99.1%** |
| **条文级语义召回** | 334,779 条条文向量化，中文提问能精确命中泰文法规的具体条文（如问"泰国数据法跨境传输"命中 TH Section 29） |
| **ONNX 而非 PyTorch 推理** | 省掉 2.5 GB 依赖；配 DirectML 可直接用任意 DX12 显卡，无需装 CUDA |
| **权威存储单一化** | `laws/<法规ID>.json` 是唯一权威，数据库与向量均为派生视图，随时可重建 |
| **数据自足** | `prototype/` 单独拷走即可完整运行，不引用任何外部路径（有 11 项自动检查守门） |
| **首屏 0.68 秒** | 按打开方式决定加载内容：API 模式跳过 15.9 MB catalog 与 3.7 MB IDF 表，首屏由 4.45 s 降到 0.68 s |
| **7 数据校验器 + 全量语法检查** | 数据完整性、自足性、译文层一致性、i18n 完整性、项目红线；另有后端 13 项自测。前 7 项已接入 CI |
| **移动端适配** | 390px / 768px 两档断点，5 个视图横向溢出为 0 |

---

## 五、目录结构

> 完整说明与边界约定见 [docs/00-目录结构与维护指南.md](docs/00-目录结构与维护指南.md)。

```
prototype/            前端（零构建、零依赖，约 913 MB，可单独拷走运行）
  index.html          入口；按打开方式决定是否加载完整 catalog
  assets/js/          app.js + core/（store/search/qa/api/fulltext/i18n/router）+ views/ + ui/
  assets/css/         tokens / base / components / views / home-v2 / mobile
  assets/img/         站点图片与各国系统配图
  data/laws/          权威存储：18,785 部 <法规ID>.json + index.json
  data/{cn,intl,fulltext}/   条文分卷（按需加载）
  data/trans/         译文层（21 分卷，与原文物理分离）
  data/title-zh/      中文标题档案（含来源与引擎）
  data/*.js           前端数据入口（dataset-core/extra、catalog、i18n、bm25-idf 等）

backend/              后端（FastAPI + SQLite + ONNX 向量）
  build_db.py         laws/*.json → calr.db（约 1.2 GB）
  app/                main / db / search / vectors / hybrid / embedder / security
  test_api.py         13 项后端自测
  DEPLOY.md           后端 Docker 部署说明

tools/                校验器、抓取脚本、评测快照与模板（正本；见 tools/README.md）
rules/                数据契约与项目红线（3 份 SKILL-* 为权威；历史归档已标记）
docs/                 项目文档（00 指南 + 01–06 交付 + deploy/ 07–10 运维 + _archive-* 历史）
deliverables/         对外交付 docx（01–06 + 07 附件2 填写稿）
solution/             产品解决方案包（交互 Demo + 说明书 DOCX/PDF；面向评审/答辩）
.github/workflows/    CI：data-checks（7 个数据校验器 + 全量 JS 语法）
_out/                 部署打包产物（4 个 tarball，约 2.2 GB；不入库）
_work/                本地工作区（模型、批次、历史脚本；约 3.2 GB，缓存/备份已清理；不入库）
```

---

## 六、文档

文档共 **11 份**（00 目录指南 + 01–06 交付文档 + 07–10 部署文档），均在 [`docs/`](docs/)；有 docx 交付版的见 [`deliverables/`](deliverables/)。
完整索引见 [docs/README.md](docs/README.md)，目录结构与维护规则见 [docs/00-目录结构与维护指南.md](docs/00-目录结构与维护指南.md)。

| 文档 | 内容 | docx |
| :--- | :--- | :---: |
| [00 · 目录结构与维护指南](docs/00-目录结构与维护指南.md) | 目录用途与边界、命名规范、归档规则、关键文件清单 | — |
| [01 · 项目总览](docs/01-项目总览.md) | 定位、数据规模、功能矩阵、两种运行形态、六个关键设计取舍 | ✅ |
| [02 · 数据规范与治理](docs/02-数据规范与治理.md) | 数据模型、入库流程、9 条质量硬约束、五类已治理缺陷的完整记录、6 条数据红线 | ✅ |
| [03 · 技术架构与检索](docs/03-技术架构与检索.md) | 架构图、三条检索链路、性能实测与瓶颈分析、安全设计、部署 | ✅ |
| [04 · 交付验收与后续规划](docs/04-交付验收与后续规划.md) | 校验体系、评测指标、已知问题、路线图、5 分钟复现步骤 | ✅ |
| [05 · 演示视频脚本](docs/05-演示视频脚本.md) | 4 分 30 秒分镜脚本、旁白全稿、答辩 PPT 大纲 | ✅ |
| [06 · 项目申报书正文](docs/06-项目申报书正文.md) | 大赛申报书五段正文（评分材料） | ✅ |
| [07 · 云服务器部署](docs/deploy/07-部署指南.md) | A/B/B+ 三形态、Docker、systemd、Nginx、验证清单 | — |
| [08 · B+ 完整部署](docs/deploy/08-部署-B+完整版.md) | 含 bge-m3 模型的增量部署与性能预期 | — |
| [09 · Windows 服务器部署](docs/deploy/09-部署-Windows服务器.md) | Windows Server 2022 计划态部署步骤 | — |
| [10 · Windows 实测复盘](docs/deploy/10-部署-Windows阿里云实测复盘.md) | 实际部署后的修正与避坑（最新） | — |

---

## 七、校验

```bash
# 7 个数据校验器 + 后端自测，全部应通过；前 7 项已接入 CI
node tools/verify.js                  # 数据与引用完整性
node tools/verify-data.js             # 逐文件统计一致性
node tools/verify-data-home.js        # 11 项数据自足性（A1–A11）
node tools/verify-fulltext.js         # 分卷与权威存储逐条比对
node tools/test-trans-layer.js        # 译文层结构
node tools/check-i18n.js              # 5 语种 × 870 键
node tools/scan-forbidden2.js         # 项目红线禁用表述
python backend/test_api.py            # 后端 13 项自测（需先起服务）
```

CI 见 [.github/workflows/data-checks.yml](.github/workflows/data-checks.yml)；工具索引见 [tools/README.md](tools/README.md)。

---

## 八、数据红线

1. **逐字照录**：不节选、不改写、不摘要原文
2. **不编造**：不生成原文中不存在的内容；机器翻译必须标注引擎
3. **来源可追溯**：每部法规必须有官方来源链接
4. **译文与原文物理分离**：译文绝不写回原文正文
5. **AI 辅助生成标注**：AI 生成内容必须标注「AI 辅助生成，仅供参考」
6. **数据自足**：`prototype/` 单独拷走即可运行

详见 [`rules/`](rules/) 与 [`docs/02-数据规范与治理.md`](docs/02-数据规范与治理.md)。

---

## 九、许可与免责

本数据库仅用于学术研究与比赛演示。法规文本以各国官方公布版本为准；译文由 AI 辅助生成，
仅供参考，不构成法律意见。使用前请核对官方原文。
