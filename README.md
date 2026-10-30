# 中国—东盟法律法规数据库（CALR）

**东盟法律，一库通查**

面向东盟 11 国的多语种、AI 驱动的跨境法律法规数据库平台。
2026 年中国（广西）—东盟“AI+法律”应用创新大赛 · 高校学生赛道 · 面向东盟法律服务方向。
参赛队伍：上海对外经贸大学 一粒橡子队。

---

## 一、产品概述

一个**可交互的 Web 产品**，把中国、东盟十国与东帝汶共 **12 个法域**的官方法规文本，做成可检索、可溯源、可多语种阅读、可规范引注的一站式工具。

> **版本说明**：2026-10-29 起不再提供独立的“跨语言条款比对”和“术语库”页面。比对能力收敛为检索/详情中的多语阅读与规范引注，术语改为正文内联释义卡片。

**核心理念**：不是“把法规堆在网页上”，而是把三件事做成工程约束：

| 约束 | 含义 |
| :--- | :--- |
| **可溯源** | 每部法规都能回答“从哪来、什么时候抓的、是否完整”，可点回官方页面核验 |
| **跨语言** | 中文用户能读到泰文、越南文、印尼文法规；反之亦然 |
| **AI 可解释** | 问答每条结论都附条文出处，可逐条回溯原文，不做推测性回答 |

### 数据规模

| 指标 | 数值 |
| :--- | ---: |
| 法域 | **12**（中国 + 东盟十国 + 东帝汶） |
| 法规 | **42,121** 部 |
| 条文 | **564,579** 条 |
| 正文字符 | **6.02 亿**（602,209,705） |
| 译文层 | **5,633** 部 / **90,627** 条 / **47** 分卷（英 5,632 部 / 85,263 条；中 40 部 / 5,364 条） |
| 中文标题覆盖 | **72.80%**（30,664 部） |
| 界面语言 | 中 / 英 / 越 / 泰 / 印尼 / 马来 |

---

## 二、快速开始

### 方式一：纯静态（零依赖，最快）
直接用浏览器打开 `prototype/index.html` 即可。不装任何东西、不联网。

### 方式二：后端形态（推荐，检索质量与性能都更好）

```bash
# 1) 建库（42,121 部，首次约 12 分钟，产出 backend/data/calr.db 约 2.1 GB）
python backend/build_db.py

# 2) 装依赖并起服务
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# 3) 浏览器打开
#    http://47.96.144.11:8000/#/
注：同一套前端代码自动识别运行环境。http(s):// 打开走后端，file:// 打开走纯静态。

可选：向量检索与语义问答
后端形态下的混合检索与条文级问答依赖 bge-m3 向量索引（旧索引约 310 MB，不入库）。

注意：当前仓库的向量索引是 10-23/24 旧库产物（18,861 部 / 334,779 条，条文覆盖约 58.5%），尚未覆盖 10-28 新增的 MY/ID 等法域；未重建前，语义检索对新增法域会降级为 BM25。

bash
python _work/phaseb/download.py                 # 下载模型
python _work/phaseb/embed.py --level law        # 法规级（GPU 约 20 分钟）
python _work/phaseb/embed.py --level article    # 条文级（GPU 约 4 小时）
注：没有向量索引时，检索自动降级为纯 BM25，功能不受影响。

三、功能矩阵
功能	入口	说明
法规检索	#/search	关键词 / 自然语言 / 条号三种方式；国别、层级、时效性、主题筛选；主题筛选置于侧栏底部；高级检索以弹窗呈现
法规详情	#/law/:id	标题（当前语言 + 原文名称）、基本信息条、原文/译文对照、左侧条文目录（随界面语言切换）、版本与变迁（可跳转历史版本）
术语解释	详情正文	专业术语虚线下划线，单击弹出当前界面语言的释义卡片（不再单设术语库页面）
AI 智能问答	#/assistant	条文级引用，每条结论可回溯原文；非法律问题/无结果时给出明确边界与操作建议；支持 BYOK
规范引注	详情页复制引用	GB/T 7714-2015 · Bluebook · 简化式 · 完整式
数据来源核验	#/sources	逐条标注官方来源、入库日期与收录形态
四、技术亮点
亮点	说明
零构建零依赖 SPA	全部 classic <script>，无打包器；file:// 可直接运行，评委只需浏览器
混合检索	检索页 BM25 + bge-m3 向量 + RRF；/api/qa 2026-10-29 起改为 BM25 条文候选 + 向量候选 + RRF + 余弦阈值 + 国别前置过滤（离线测试 5/5）。旧库 106 题 P@3 5.7% → 16.7%，国别准确 99.1%；42k 新库向量夜间按 _work/rag/VECTOR-UPGRADE-PLAN.md 增量重建后复测
多语种界面与标题	6 种界面语言；检索结果标题按当前语言展示，并附小号浅色【原文名称】；条文目录、条号、机构与来源均随界面语言本地化
数据规模与自足	42,121 部 / 564,579 条全部落在 prototype/data/laws/，可整目录拷走运行；译文层物理分离
ONNX 而非 PyTorch	省掉 2.5 GB 依赖；配 DirectML 可直接用任意 DX12 显卡，无需装 CUDA
权威存储单一化	laws/<法规ID>.json 是唯一权威，数据库与向量均为派生视图，随时可重建
数据自足检查	prototype/ 单独拷走即可完整运行，不引用任何外部路径（有 11 项自动检查守门）
首屏 0.68 秒	按打开方式决定加载内容：API 模式跳过 15.9 MB catalog 与 3.7 MB IDF 表，首屏由 4.45 s 降到 0.68 s
完整校验体系	7 数据校验器 + 全量语法检查（含后端 13 项自测），前 7 项已接入 CI
移动端适配	390px / 768px 两档断点，5 个视图横向溢出为 0
五、目录结构
完整说明与边界约定见 docs/00-目录结构与维护指南.md。

text
prototype/            前端（零构建、零依赖，约 2 GB，可单独拷走运行）
  index.html          入口；按打开方式决定是否加载完整 catalog
  assets/js/          app.js + core/（store/search/qa/api/fulltext/i18n/router）+ views/ + ui/
  assets/css/         tokens / base / components / views / home-v2 / mobile
  assets/img/         站点图片与各国系统配图
  data/laws/          权威存储：42,121 部 <法规ID>.json + index.json
  data/{cn,intl,fulltext}/   条文分卷（按需加载）
  data/trans/         译文层（47 分卷，与原文物理分离）
  data/title-zh/      中文标题档案（30,664 部，含来源与引擎）
  data/*.js           前端数据入口（dataset-core/extra、catalog、i18n、bm25-idf 等）

backend/              后端（FastAPI + SQLite + ONNX 向量）
  build_db.py         laws/*.json → calr.db（约 2.1 GB）
  app/                main / db / search / vectors / hybrid / embedder / security
  test_api.py         13 项后端自测
  DEPLOY.md           后端 Docker 部署说明

tools/                校验器、抓取脚本、评测快照与模板（正本；见 tools/README.md）
rules/                数据契约与项目红线（7 份 SKILL-* 为权威；历史归档已标记）
docs/                 工程文档（00 指南 + 01–04 交付 + deploy/ 07–10 运维 + _archive-* 历史）
materials/            比赛材料（05 演示脚本 / 06 申报书 / 报告与申报 docx / 提交 PDF）
.github/workflows/    CI：data-checks（7 个数据校验器 + 全量 JS 语法）
_work/                本地工作区（模型、批次、历史脚本与归档的 _audit/_out；不入库）
六、文档索引
文档与比赛材料共 12 份。工程文档 10 份在 docs/（00 指南 + 01–04 交付 + 03a RAG 评估 + 07–10 部署运维），比赛材料 05/06 在 materials/。

完整索引：docs/README.md / materials/README.md

docx 交付版：materials/reports/（01–04、06、附件2）与 materials/roadshow/（05）

部署与提交：见 docs/deploy/ 与 materials/submission/

文档	内容	docx
00 · 目录结构与维护指南	目录用途与边界、命名规范、归档规则、关键文件清单	—
01 · 项目总览	定位、数据规模、功能矩阵、两种运行形态、六个关键设计取舍	有
02 · 数据规范与治理	数据模型、入库流程、9 条质量硬约束、五类已治理缺陷的完整记录、6 条数据红线	有
03 · 技术架构与检索	架构图、三条检索链路、性能实测与瓶颈分析、安全设计、部署	有
03a · RAG 检索评估与优化建议	向量覆盖实测、现有指标、算法缺陷、按 ROI 排序的改进路线	—
04 · 交付验收与后续规划	校验体系、评测指标、已知问题、路线图、5 分钟复现步骤	有
05 · 演示视频脚本	4 分 30 秒分镜脚本、旁白全稿、答辩 PPT 大纲	有
06 · 项目申报书正文	大赛申报书五段正文（评分材料）	有
07 · 云服务器部署	A/B/B+ 三形态、Docker、systemd、Nginx、验证清单	—
08 · B+ 完整部署	含 bge-m3 模型的增量部署与性能预期	—
09 · Windows 服务器部署	Windows Server 2022 计划态部署步骤	—
10 · Windows 实测复盘	实际部署后的修正与避坑（最新）	—
七、数据校验
bash
# 7 个数据校验器 + 后端自测，全部应通过；前 7 项已接入 CI
node tools/verify.js                  # 数据与引用完整性
node tools/verify-data.js             # 逐文件统计一致性
node tools/verify-data-home.js        # 11 项数据自足性（A1–A11）
node tools/verify-fulltext.js         # 分卷与权威存储逐条比对
node tools/test-trans-layer.js        # 译文层结构
node tools/check-i18n.js              # 5 语种 × 870 键
node tools/scan-forbidden2.js         # 项目红线禁用表述
python backend/test_api.py            # 后端 13 项自测（需先起服务）
CI 流程见 .github/workflows/data-checks.yml。

工具索引见 tools/README.md。

八、数据红线
逐字照录：不节选、不改写、不摘要原文。

不编造：不生成原文中不存在的内容；机器翻译必须标注引擎。

来源可追溯：每部法规必须有官方来源链接。

译文与原文物理分离：译文绝不写回原文正文。

AI 辅助生成标注：AI 生成内容必须标注「AI 辅助生成，仅供参考」。

数据自足：prototype/ 单独拷走即可运行。

详见 rules/ 与 docs/02-数据规范与治理.md。

九、许可与免责
本数据库仅用于学术研究与比赛演示。法规文本以各国官方公布版本为准；译文由 AI 辅助生成，仅供参考，不构成法律意见。使用前请核对官方原文。

联系方式：carl_kent26@163.com
