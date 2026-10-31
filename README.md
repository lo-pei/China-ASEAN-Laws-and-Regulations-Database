<div align="center">

# CALR · 中国—东盟法律法规数据库

**东盟法律，一库通查**

面向中国、东盟十国与东帝汶共 **12 个法域**的多语种、可溯源、AI 增强法律检索平台

[![Data Checks](https://github.com/lo-pei/China-ASEAN-Laws-and-Regulations-Database/actions/workflows/data-checks.yml/badge.svg)](https://github.com/lo-pei/China-ASEAN-Laws-and-Regulations-Database/actions/workflows/data-checks.yml)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![ONNX Runtime](https://img.shields.io/badge/ONNX%20Runtime-DirectML-005CED)
![Status](https://img.shields.io/badge/RAG-C%20index%20complete-brightgreen)

[项目概览](#1-项目概览) · [数据资产](#2-数据资产) · [功能矩阵](#3-功能矩阵) · [系统架构](#4-系统架构) · [快速开始](#5-快速开始) · [目录结构](#6-目录结构) · [质量保障](#7-质量保障) · [文档导航](#8-文档导航)

</div>

> 2026 年中国（广西）—东盟“AI+法律”应用创新大赛 · 高校学生赛道 · 面向东盟法律服务方向  
> 参赛队：上海对外经贸大学 · 一粒橡子队

---

## 1. 项目概览

CALR（China–ASEAN Laws and Regulations Database）是一个可直接在浏览器运行的**多语种法律法规数据库**。它把中国、东盟十国与东帝汶的官方法规文本整理为统一的法条级结构，提供检索、详情阅读、正文术语释义与带引用的 AI 问答。

项目不追求简单“把法规堆到网页上”，而是把三条约束做成系统能力：

| 约束 | 工程实现 |
| :--- | :--- |
| **可溯源** | 每部法规带官方来源、抓取时间与收录形态，详情页可回到来源核验 |
| **可阅读** | 6 种界面语言；条文目录、条号、机构与来源随界面语言本地化 |
| **可核查** | AI 问答先检索后回答，逐条绑定条号与原文位置；依据不足时明确拒答 |

### 1.1 项目状态

| 模块 | 状态 | 说明 |
| :--- | :---: | :--- |
| 法规 / 条文数据 | ✅ 已完成 | 42,121 部 / 564,579 条 / 12 法域 |
| 译文层 | ✅ 已完成 | 5,633 部 / 90,627 条 / 47 分卷 |
| A 条文向量 | ✅ 已完成 | 564,578 条条文向量 |
| B 法规向量 | ✅ 已完成 | 42,121 部法规向量，内容为标题 + 摘要 + 前两条 + 章节 |
| C 条文切片向量 | ✅ 已完成 | 512-token / stride 128 / 单条最多 3 块；623,915 块，覆盖 563,794 个唯一条文键 |
| 混合 RAG 问答 | ✅ 可用 | BM25 + 向量 + RRF + 国别前置过滤 + 余弦阈值；优先使用 C 切片索引，缺失时回退 A 条文向量 |

> C 索引已完成；若切片文件缺失或设置 `CALR_QA_CHUNKS=0`，检索/问答会自动回退到 A 条文向量，不会不可用。

---

## 2. 数据资产

### 2.1 规模

| 指标 | 数值 |
| :--- | ---: |
| 法域 | **12**（中国、东盟十国、东帝汶） |
| 法规 | **42,121** 部 |
| 条文 | **564,579** 条 |
| 正文字符 | **602,209,705**（约 6.02 亿） |
| 中文标题 | **30,664** 部（72.80%） |
| 译文层 | **5,633** 部 / **90,627** 条 / **47** 分卷 |
| 界面语言 | **6** 种：中、英、越、泰、印尼、马来 |
| 官方来源渠道 | **14** 个 |

### 2.2 数据原则

1. **原文与译文物理分离**：译文独立成卷，按条号与原文合并渲染，引用永远可区分。
2. **一部法规一个 JSON**：`prototype/data/laws/<法规ID>.json` 是唯一权威存储。
3. **派生数据可重建**：SQLite、目录分卷、BM25 倒排与向量索引均由权威 JSON 重新生成。
4. **缺口如实公开**：缺失原文逐部标注，并提供官方链接，不把目录记录伪装成全文。
5. **每条数据可核验**：来源、抓取日期、收录形态、条号与版本均可追溯。

---

## 3. 功能矩阵

| 功能 | 入口 | 说明 |
| :--- | :--- | :--- |
| **法规检索** | `#/search` | 关键词 / 自然语言 / 法条编号三种模式；国别、层级、时效、主题、日期筛选；结果卡展示国家、时效性、制定机关、文号、公布/施行日期与条文数量 |
| **法规详情** | `#/law/:id` | 左栏条文目录随界面语言切换；右侧表格化基本信息；下方版本与变迁时间线，历史版本可跳转；推荐 3–5 部相关法规；支持下载全文 TXT |
| **正文术语** | 详情正文 | 专业术语虚线下划线，单击弹出当前界面语言释义；不设独立术语库页面 |
| **AI 智能问答** | `#/assistant` | 先检索候选条文，再在受控上下文中作答；每条结论绑定条号与原文位置；相关度不足时明确说明；支持用户自带 OpenAI 兼容接口 |
| **多语种界面** | 右上角语言菜单 | 中 / 英 / 越 / 泰 / 印尼 / 马来 6 种界面语言 |
| **数据来源核验** | `#/sources` | 按法域查看官方来源与数据说明 |

> 2026-10-29 起，产品不再提供独立的“跨语言条款比对”和“术语库”页面：阅读与对照能力收敛到检索结果、详情页和正文内联术语中。

---

## 4. 系统架构

### 4.1 总体结构

```text
浏览器（原生 JS SPA，零构建、零框架）
│
├─ file:// ─────────────▶ prototype/data
│                        JSON + 分卷（离线运行）
│
└─ http(s):// ──────────▶ FastAPI
                         │
                         ├─ SQLite（calr.db，约 2.1 GB）
                         ├─ BM25 倒排索引
                         └─ bge-m3 ONNX（DirectML / CPU）
                                │
                                ▼
                           A/B/C 向量索引
                                │
                                ▼
                    RRF 融合 + 阈值 + 国别过滤
                                │
                                ▼
                        带条号引用的回答
```

两条路径共用同一套前端：`file://` 直接读取本地 JSON，`http(s)://` 通过后端 API 查询 SQLite、BM25 与向量索引。

- **前端**：原生 JavaScript 单页应用，没有打包器；`file://` 可直接离线运行。
- **后端**：FastAPI + SQLite，提供检索、详情、问答与数据接口；可选 API Key、限流、请求体上限。
- **推理**：bge-m3 使用 ONNX Runtime，DirectML 可调用任意 DirectX 12 显卡，无需 CUDA/PyTorch。
- **部署**：纯静态、单机后端、Docker 三种形态。

### 4.2 检索与问答链路

```text
用户问题
  → 识别 / 前置国别过滤
  → BM25 条文候选
  → 条文切片向量候选（C）或条文向量候选（A）
  → RRF 融合（k=60）
  → 纯向量结果过余弦阈值（默认 0.30）
  → 按正文前 80 字去重
  → 回查原文与条号
  → 生成带引用回答
```

关键参数：

| 参数 | 默认值 | 作用 |
| :--- | ---: | :--- |
| `CALR_QA_VEC_MIN` | 0.30 | 向量结果最低余弦相似度 |
| `CALR_QA_RRF_K` | 60 | RRF 融合常数 |
| `CALR_QA_CHUNKS` | 1 | 是否优先使用 C 条文切片索引 |
| C 切片长度 | 512 token | 单条条文窗口 |
| C 切片步长 | 128 token | 窗口重叠 |
| C 单条上限 | 3 块 | 控制索引体积 |

### 4.3 技术栈

| 层 | 技术 |
| :--- | :--- |
| 前端 | 原生 HTML / CSS / JavaScript，零构建 |
| 后端 | Python、FastAPI、Uvicorn |
| 数据库 | SQLite（只读连接、参数化查询） |
| 检索 | BM25 + bge-m3 向量 + RRF |
| 向量推理 | ONNX Runtime + DirectML（可选 CPU） |
| 数据校验 | Node.js 校验脚本 + GitHub Actions |

---

## 5. 快速开始

### 5.1 方式一：纯静态（最快，零依赖）

```bash
git clone https://github.com/lo-pei/China-ASEAN-Laws-and-Regulations-Database.git
cd China-ASEAN-Laws-and-Regulations-Database
# 直接用浏览器打开：
# prototype/index.html
```

静态模式不安装任何依赖、不联网，适合评审现场演示。

### 5.2 方式二：后端形态（推荐）

```bash
# 1) 建库：42,121 部法规 → backend/data/calr.db（约 2.1 GB，首次约 12 分钟）
python backend/build_db.py

# 2) 安装依赖并启动
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# 3) 浏览器访问
# http://47.96.144.11:8000/#/
```

同一套前端会自动识别运行方式：`http(s)://` 走后端 API，`file://` 走本地静态数据。

### 5.3 可选：重建向量索引

向量索引体积较大，默认不随 Git 仓库分发。需要语义检索/混合问答时：

```bash
python _work/phaseb/download.py                         # 下载 bge-m3 ONNX 模型
python _work/phaseb/embed.py --level law --law-content  # B：法规向量
python _work/phaseb/embed_missing.py --level article    # A：条文增量向量
# PowerShell：
$env:CALR_MAX_LEN="512"
python _work/phaseb/embed_chunks.py --batch 8           # C：512-token 条文切片
```

没有向量索引时，检索自动降级为 BM25，详情与数据浏览功能不受影响。C 索引已生成；如需回退 A 条文向量，设置 `CALR_QA_CHUNKS=0`。

### 5.4 部署文档

- [07 · 通用云服务器部署](docs/deploy/07-部署指南.md)
- [08 · B+ 完整部署（含模型）](docs/deploy/08-部署-B+完整版.md)
- [09 · Windows 服务器部署](docs/deploy/09-部署-Windows服务器.md)
- [10 · Windows 阿里云实测复盘](docs/deploy/10-部署-Windows阿里云实测复盘.md)
- [11 · C 索引产物与部署](docs/deploy/11-C索引产物与部署.md)

---

## 6. 目录结构

```text
.
├── prototype/                  # 前端：零构建 SPA + 权威数据
│   ├── index.html              # 入口
│   ├── assets/js/              # core / views / ui
│   ├── assets/css/             # tokens / base / components / views
│   └── data/
│       ├── laws/               # 42,121 部法规 JSON + index.json
│       ├── cn/ intl/ fulltext/ # 条文分卷（按需加载）
│       ├── trans/              # 译文层（47 分卷）
│       ├── title-zh/           # 中文标题档案
│       └── *.js                # catalog / i18n / BM25 等数据入口
├── backend/                    # FastAPI + SQLite + 向量检索
│   ├── build_db.py             # laws/*.json → calr.db
│   ├── app/                    # main / db / search / vectors / qa / security
│   ├── test_api.py             # 后端自测
│   └── requirements.txt
├── tools/                      # 校验器、抓取与评测脚本
├── rules/                      # 数据契约与项目红线
├── docs/                       # 工程文档 + deploy/
├── materials/                  # 比赛材料、说明书、摘要
├── .github/workflows/          # CI：数据校验
└── _work/                      # 本地工作区：模型、批次日志、脚本归档
```

> `backend/data/`、`_work/models/` 与向量文件体积较大，不纳入 Git；请按第 5 节本地重建。

---

## 7. 质量保障

### 7.1 校验与测试

```bash
node tools/verify.js             # 数据与引用完整性
node tools/verify-data.js        # 逐文件统计一致性
node tools/verify-data-home.js   # 数据自足性检查
node tools/verify-fulltext.js    # 分卷与权威存储逐条比对
node tools/test-trans-layer.js   # 译文层结构
node tools/check-i18n.js         # 界面语言键完整性
node tools/scan-forbidden2.js    # 项目红线禁用表述
python backend/test_api.py       # 后端 13 项自测（需先启动服务）
```

| 保障项 | 当前结果 |
| :--- | :--- |
| 数据校验器 | 7 项，接入 GitHub Actions |
| 后端接口自测 | 13 项 |
| 混合问答离线测试 | 5/5 通过 |
| 数据自足性 | `prototype/` 可独立拷走运行 |
| 文档链接 | 相对链接检查通过 |

### 7.2 评测基线（旧库 106 题）

旧库 106 题自建评测集上：

| 指标 | BM25 | BM25 + 向量 + RRF |
| :--- | ---: | ---: |
| P@3 | 5.7% | **16.7%** |
| 国别准确率 | 26.4% | **99.1%** |

> 旧库数字仅作为方法对比基线，不作为 42k 新库绝对值。

### 7.3 新库 346 题混合评测（2026-10-31）

346 题 = 106 道既有题 + 240 道 12 法域分层合成题（合成题不是人工标注，分开解读）：

| 配置 | P@3 | R@5 | MRR | Hit@5 | ArticleHit@5 |
| :--- | ---: | ---: | ---: | ---: | ---: |
| BM25 | **34.87%** | 41.72% | 40.04% | 43.93% | 38.44% |
| A 条文向量 + RRF | 32.66% | 58.25% | 52.04% | **65.03%** | **53.76%** |
| C 切片向量 + RRF | 32.47% | **58.63%** | 51.52% | 64.74% | 53.18% |

结论：**C 已可用，但在当前混合集上与 A 基本持平，尚未观察到稳定增益**；不应对外宣称“C 显著提升准确率”。详见 [03b · 新库 RAG 评测](docs/03b-新库RAG评测.md)。

---

## 8. 文档导航

| 文档 | 内容 |
| :--- | :--- |
| [00 · 目录结构与维护指南](docs/00-目录结构与维护指南.md) | 目录用途、命名规范、归档规则 |
| [01 · 项目总览](docs/01-项目总览.md) | 定位、数据规模、功能矩阵、关键设计取舍 |
| [02 · 数据规范与治理](docs/02-数据规范与治理.md) | 数据模型、入库流程、质量硬约束、缺陷治理记录 |
| [03 · 技术架构与检索](docs/03-技术架构与检索.md) | 架构图、检索链路、性能实测、安全设计 |
| [03a · RAG 检索评估与优化建议](docs/03a-RAG检索评估与优化建议.md) | 向量覆盖、评测指标、改进路线 |
| [03b · 新库 RAG 评测](docs/03b-新库RAG评测.md) | 346 题混合评测，BM25/A/C 对比与限制 |
| [04 · 交付验收与后续规划](docs/04-交付验收与后续规划.md) | 校验体系、复现步骤、已知问题与路线图 |
| [05 · 演示视频脚本](materials/roadshow/05-演示视频脚本.md) | 分镜、旁白与答辩大纲 |
| [06 · 项目申报书正文](materials/reports/06-项目申报书正文.md) | 大赛申报书正文 |
| [07–10 · 部署运维](docs/deploy/) | 云服务器、B+ 完整版、Windows 部署与实测复盘 |

比赛材料索引：[materials/README.md](materials/README.md)  
文档索引：[docs/README.md](docs/README.md)

---

## 9. 路线图

- [x] 42k 法规 / 564k 条文全量入库
- [x] 译文层与中文标题层补齐
- [x] A 条文向量、B 法规向量重建
- [x] C 512-token 条文切片索引（623,915 块，2026-10-31 完成）
- [x] 42k 新库 346 题混合评测（106 curated + 240 synthetic；C 与 A 接近）
- [ ] 人工/半人工 300+ 题评测与长条文专项评测
- [ ] 生产部署的监控、限流与 SLA 完善

## 10. 数据来源、许可与免责

- 法规原文来自中国法律法规数据库及东盟各国官方公报/法律门户，逐部标注来源链接。
- 译文由 AI 辅助生成并标明引擎，未经人工逐条校对；引用前请核对官方原文。
- 本项目仅用于学术研究、教学与竞赛演示，不构成法律意见，也不替代执业律师的专业判断。
- 第三方模型（bge-m3、NLLB 等）遵循各自开源许可证；使用前请自行确认许可范围。

## 11. 团队与联系

**上海对外经贸大学 · 一粒橡子队**  
负责人：王勃森  
联系邮箱：carl_kent26@163.com

---

<div align="center">

**CALR · 让每一条法条都能被读到、读懂、引用**

</div>
