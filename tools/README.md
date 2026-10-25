# 工具（tools/）

**本目录是校验器与脚本的正本。** `_work/` 下的同名脚本只是本地工作副本，改动请改这里。

---

## 一、校验器矩阵

| 脚本 | 查什么 | 退出码 | CI |
| :--- | :--- | :--- | :---: |
| `verify.js` | 数据完整性、引用完整性、核心检索算法 | 0 全通过 / 1 有问题 | ✅ |
| `verify-data.js` | 逐文件统计一致性（与 index.json 对齐） | 0 / 1 | ✅ |
| `verify-data-home.js` | `prototype/` 数据自足性 A1–A11 | 0 / 1 | ✅ |
| `verify-fulltext.js` | 分卷与权威存储逐条比对 | 0 / 1 | ✅ |
| `test-trans-layer.js` | 译文层端到端（transPackFor / mergeTrans / 条号对齐） | 0 / 1 | ✅ |
| `check-i18n.js` | 界面语言键完整性（vi/th/id/ms） | 固定输出，失败无显式退出码 | ✅ |
| `scan-forbidden2.js` | 项目红线禁用表述 | 输出命中数 / CLEAN | ✅ |
| `verify-glossary.js` | 术语表与译文一致性 | 0 / 1 | — |
| `verify-title-return.js` | 标题中译回执格式与来源 | 0 / 1 | — |
| `verify-trans-return.js` | 译文本回执格式与对齐 | 0 / 1 | — |
| `check-trans-alignment.js` | 译文与原文条号对齐抽查 | 0 / 1 | — |

CI 配置见 [.github/workflows/data-checks.yml](../.github/workflows/data-checks.yml)，实际运行为 7 个数据校验器 + 全量 `node --check`。

> 校验器默认以**仓库根目录**为工作目录；`check-i18n.js`、`scan-forbidden2.js`、`test-trans-layer.js` 使用相对路径，请在根目录运行。

---

## 二、前端测试

| 脚本 | 用途 |
| :--- | :--- |
| `smoke-test.js` | 11 条页面路由冒烟测试 |
| `functional-test.js` | 8 项功能级验收测试 |

两者依赖 Node 内置模块与本地生成的临时 HTML，不修改仓库文件。

---

## 三、抓取与补抓

| 脚本 | 用途 |
| :--- | :--- |
| `crawl-lawphil.py` | 菲律宾 LawPhil 单批抓取 |
| `crawl-lawphil-batch.py` | 按补抓清单批量抓取 |
| `crawl-apply.py` | 抓取结果落库 |
| `build-recrawl-list.py` | 生成补抓清单 |

运行时会读写 `_work/` 下的批次目录；具体路径见各脚本头部注释。

---

## 四、数据快照与报告（reports/）

[tools/reports/](reports/) 是历史评测/补抓的**数据快照**，不是运行时代码：

| 文件 | 内容 |
| :--- | :--- |
| `recrawl-tasks.csv` / `recrawl-summary.md` | 补抓任务清单与汇总 |
| `trans-misaligned.csv` | 译文错位排查结果 |
| `eval-gold-74.json` / `eval-result-74.json` | 74 题评测集与结果 |

---

## 五、模板（templates/）

译文生产与回执模板（`trans-job` / `trans-pack` / `trans-return`），被 rules/ 的 SKILL 契约引用。

---

## 六、约定

1. 新增校验器：放在本目录根、kebab-case 命名、以退出码表达成败，并在 CI 注册。
2. 生成型数据/报告放 `reports/`，不要与脚本混放。
3. 脚本内的仓库根路径优先用 `path.resolve(__dirname, '..')`，避免依赖当前工作目录。
