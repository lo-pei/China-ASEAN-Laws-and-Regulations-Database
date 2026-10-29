# -*- coding: utf-8 -*-
"""把 docs/26 从「方案稿」升级为「方案 + 执行实录」"""
import io, os
ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(ROOT)

REC = '''

---

# 附表：执行实录（2026-10-08）

> 本节记录 §一–§九 方案的实际执行过程与结果。方案中的 12 项决策，
> 前 5 项经确认采用推荐口径，其余 7 项按 §八 建议默认值执行。

## A. 已确认的五项决策

| # | 决策 | 采用 |
| :--- | :--- | :--- |
| 1 | 目标形态 | **方案 A 双轨**：`laws/<ID>.json` 唯一权威 + 派生分卷 JS 供 App |
| 2 | 字段口径 | **超集**：dataset 骨架 + 补回 prototype 的 12 类增量字段 |
| 3 | `text` 类型 | **保留对象** `{lang:"…"}`（不破坏译文层 `mergeTrans`） |
| 4 | 去重保留规则 | **A 层优先 → id 字典序最小**；冗余者归档不物理删除 |
| 5 | 执行范围 | **完整执行**：形态统一 + 补入 314 部 + 去重 + 清理残留 |

## B. 最终 `prototype/data` 数据组织方式

```
prototype/data/                                    741.8 MB（合并前 402.9 MB）
├── laws/                        ★ 唯一权威存储
│   ├── index.json                13.8 MB  17,616 部法规的总索引
│   ├── 无本地原文清单.csv          2.1 MB  4,418 条仅目录登记、无本地正文（无 BOM）
│   └── <法规ID>.json             17,616 个，每法一个独立文件，文件名 = 法规 ID
├── intl/                        253 个分卷 + manifest.js    305.3 MB
├── cn/                           20 个分卷                  27.2 MB
├── fulltext/                     10 个分卷 + manifest.js     11.5 MB
├── trans/                         1 个（译文层，空表待填充）
├── cn-catalog.js                 707 KB   中国法规目录（1,564 条）
├── intl-catalog.js            14.8 MB    东盟法规目录（10,583 条，已去重）
├── dataset-core.js / dataset-extra.js     基础数据集（元数据 + 条文 + 术语/条约/案例/问答）
├── i18n-*.js / asean-map.js              界面文案（9 语种）与地图
```

**权威与派生的边界**：所有人工修订、采集入库**只改 `laws/`**；`intl/ cn/ fulltext/` 由
`_work/merge/build-packs.js` 自动生成，文件头已标注「请勿手工编辑」。

## C. 合并前后规模对照

| 项 | 合并前 prototype | dataset 快照 | **合并后 laws/** |
| :--- | ---: | ---: | ---: |
| 法规 | 17,679 | 17,365 | **17,616** |
| 条文 | 311,886 | 279,390 | **305,032** |
| 正文 | 245,088,030 字 | 212,243,232 字 | **238,374,556 字** |
| 分层 | intl 16,078 / cn 1,540 / fulltext 61 | intl 15,764 / cn 1,540 / fulltext 61 | intl 16,015 / cn 1,540 / fulltext 61 |

合并后条文 = 311,886 − 6,854（重复条文）= 305,032 ✓ 数字完全对得上。

## D. 去重结果

| 项 | 数值 |
| :--- | ---: |
| 内容完全相同的组 | 57 组 |
| 涉及法规 | 120 部 |
| **归档（移出权威存储）** | **63 部** |
| 减少条文 | 6,854 条 |
| 归档位置 | `_work/dedup-archive/<ID>.json`（**未物理删除**，可回溯） |
| 留痕 | `intl-catalog.js` → `meta.mergeDedup`（63 条 id → 保留项映射） |

保留规则：A 法域全文层优先 → 再按 id 字典序最小。
去重附带收益：`tools/verify-data.js` 的重复条号警告由 **342 部 / 4,007 处**降至 **312 部 / 2,901 处**；
`ID-H012`/`ID-H030` 的空正文警告消失（重复项已归档）。

## E. 关键改动与数据映射

| 改动 | 内容 |
| :--- | :--- |
| 拆卷为单法文件 | `intl/<cc>-pNN.js`、`cn/cn-pNN.js`、`fulltext/<cc>.js` 内的每个法规 → `laws/<ID>.json` |
| 新增 `country`/`countryName`/`layer`/`pack`/`chars` | 从代码推断 → 显式落盘（采用 dataset 形态） |
| 新增 `effectiveDate`/`versionDate`/`amendedNote`/`category` | 采用 dataset 形态 |
| `sourceName` + `sourceUrl` → `source:{name,url}` | 扁平 → 嵌套（采用 dataset 形态） |
| `title` 字符串 → 对象 `{zh,en,orig}` | 类型统一；`titleEn` 并入 `title.en` |
| **补回 12 类增量字段** | `completenessNote`(17,663)、`topics`、条文 `id`(305,032)、条文 `sourceUrl`、`paragraphs`、`status`、`amendedNote`、`officialCode`、`pdfs`、`structure`、`textQuality`、`ocrNoisySections` |
| `text`/`noLabel`/`chapter`/`heading` | **保持按语种分键对象** |
| 补入 dataset 独有取值 | 12 部法规补上了原本为空的 `sourceUrl` |
| 新增 `duplicateOf` | 去重留痕 |
| 新增 `fulltextMeta` | App 兼容字段（见 §G） |

## F. 执行过程中发现并修复的两个缺陷

### F.1 分卷重建时 `articles` 被丢弃（已修复）

首版 `build-packs.js` 的 `orderKeys()` 白名单未含 `articles`，且兜底分支显式跳过该键，
导致生成的 283 个分卷**全部不含条文**（`intl/` 体积从 314 MB 掉到 22 MB）。
通过体积比对立即发现，将 `articles` 加入白名单后重建。**已用 `_work/merge/verify-packs.js` 逐法复核。**

### F.2 `CALR_FULLTEXT_META` 丢失导致 `verify-fulltext.js` FAILED=32（已修复）

原分卷除 `CALR_FULLTEXT[id]` 外还有 **1,580 个 `CALR_FULLTEXT_META[id]`**（cn 1,540 + fulltext 40），
存放 A/B 层法规的元数据（`summary`、双语 `title`、`topics`、`issuingBody` 等），
`store.js` 依赖它构建基础条目。首版 `build-packs.js` 只写 `CALR_FULLTEXT`，导致该验证器 **FAILED=32**。

修复方式：
1. 新增 `_work/merge/restore-meta.js`：从备份分卷中取出 1,580 个 META 对象，
   **原样存入 `laws/<ID>.json` 的 `fulltextMeta` 字段**，并把缺失的顶层字段并入 records；
2. `build-packs.js` 重建分卷时按 `fulltextMeta` 逐字回写 `root.CALR_FULLTEXT_META['ID']`。

**副带修复的静默数据缺失**：并入 META 时补上了

| 字段 | 补入法规数 |
| :--- | ---: |
| `topics` | **1,580**（原为空数组） |
| `summary` | **1,564** |
| `status` | 1,526 |
| `effectiveDate` | 24 |
| `docNumber` | 17 |
| `level` / `promulgatedDate` | 各 16 |
| `title.en` / `title.zh` / `title.ms` / `title.lo` | 32 / 16 / 3 / 1 |
| `issuingBody` | 19 |

> 教训：**「派生」必须逐字段对齐源形态**。仅比对法规数与条文数不足以发现问题，
> 必须把「App 实际读取的字段」与「全局 `CALR_*` 表」都纳入比对。

## G. 验证结果

| 检查 | 结果 |
| :--- | :--- |
| 全量 JS `node --check` | **0 失败**（prototype + tools 全部） |
| `_work/verify.js` | **全部通过** |
| `_work/verify-fulltext.js` | **FAILED=0**（修复前 32） |
| `tools/verify-data.js` | **全部通过**（1 警告 / 3 提示） |
| 分卷语义复核（vs 备份） | 法规集 17,679 → 17,616，**缺失 63 = 归档数，意外缺失 0，新增 0**；逐法比对 **17,604 一致**，12 部仅 `sourceUrl` 由空补为实测值；**条文数、条号、全部正文逐字一致** |
| `packFor()` 可解析性 | **17,616 / 17,616 全部可解析且分卷内确实存在**；分卷内无孤立 id |
| manifest 交叉检查 | intl byLaw 16,015 / fulltext byLaw 61，**指向不存在的法规 0**；分卷 laws 列表缺失 0 |
| 浏览器实测 | 首页 + A 层（BN-COMPANIES-CAP39）+ B 层（CN-CONST-0001）+ C 层（KH-H011）**全部正常渲染，关键内容命中** |
| i18n | keys=689 **missing=0** |
| 禁用项扫描 | **CLEAN** |
| 临时文件 | 无残留 |

## H. 清理与体积

| 动作 | 结果 |
| :--- | ---: |
| 删除 5 个备份残留（`intl-catalog.js.{bak-25,kh-bak,la-bak,ph-bak,th-bak}`） | **−29.6 MB** |
| 新增 `laws/` 权威存储 | +379.1 MB |
| `prototype/` 总体积 | 402.9 MB → **741.8 MB** |

> 体积说明：双轨形态下同一份数据以「JSON 权威 + JS 派生」各存一份，故总量上升。
> 若后续可接受「仅 JSON + 构建时生成分卷」，可把分卷移出交付物以节省约 344 MB，
> 但 App 将无法直接离线运行，需一并调整打包流程。

## I. 复现命令

```bash
# 0. 全量备份（执行前）
#    prototype/data → _work/backup-pre-merge/

# 1. 拆卷 + 合并 dataset 独有字段 + 去重 + 归一化 → laws/
node --max-old-space-size=8192 _work/merge/build-canonical.js        # 加 --dry 试运行

# 2. 补回 CALR_FULLTEXT_META
node --max-old-space-size=8192 _work/merge/restore-meta.js

# 3. 从 laws/ 重建分卷与 manifest
node --max-old-space-size=8192 _work/merge/build-packs.js            # 加 --dry 试运行

# 4. 目录去重留痕
node --max-old-space-size=8192 _work/merge/fix-catalog.js            # 加 --dry 试运行

# 5. 重建清单与校验
node --max-old-space-size=8192 _work/build-no-fulltext-inventory.js
node --max-old-space-size=8192 _work/merge/verify-packs.js
node --max-old-space-size=8192 _work/merge/check-resolve.js
node _work/verify.js && node _work/verify-fulltext.js && node tools/verify-data.js
```

## J. 遗留事项（如实说明）

| # | 事项 | 现状 |
| :--- | :--- | :--- |
| 1 | **302 部法规无任何名称** | `title.{zh,en,orig}` 全为 `null`（源数据即无名称），例 `BN-H018`/`BN-H020`。未做任何填充或臆造 |
| 2 | **666 组同名异容** | 本轮**未合并**（多为菲律宾修正法与被修正法），仅出报告 |
| 3 | **跨层同法 13 部** | 本轮未按「A 层优先」专项处置；跨语言匹配需另行开发（标题精确匹配实测 0 对） |
| 4 | **9,831 部法规未登记目录** | 其中菲律宾 9,806 部 —— 与 `dataset/README` 已知事项 15「PH 目录精选 817 条」口径相符，**属设计如此**，本轮未改动目录展示集 |
| 5 | **`fulltextKey` 为死字段** | `prototype/assets` 下 0 处引用；本轮未删除，仅记录 |
| 6 | **`BN-H011` 的 `sourceUrl` 含双斜杠** | `https://www.agc.gov.bn//wp-content/…`，源自 dataset，未擅自改写 |
| 7 | **312 部法规有重复条号（2,901 处）** | 已按原文如实保留，未重排；建议单列专项治理 |
| 8 | **dataset/ 目录为 2026-10-07 快照** | 已在 `dataset/README.md` 注明派生关系与最新数据位置 |
'''

P = "docs/26-两批数据对比与统一存储规范（方案）.md"
s = io.open(P, encoding="utf-8").read()
if "附表：执行实录" not in s:
    s = s.replace("# 26 · 两批数据对比与统一存储规范（**方案稿，待确认后执行**）",
                  "# 26 · 两批数据对比与统一存储规范（方案 + 执行实录）", 1)
    s = s.replace("> **本文件只出方案，不执行任何写操作。** 文末 §八 列出 12 项需决策事项与建议，待确认后执行。",
                  "> **2026-10-08 已执行完毕。** §一–§九 为方案原文（保留以存决策依据），文末附执行实录（实际结果、\n> 两个中途发现并修复的缺陷、验证数据与遗留事项）。", 1)
    io.open(P, "w", encoding="utf-8").write(s.rstrip() + "\n" + REC)
    print("docs/26 已追加执行实录")
else:
    print("docs/26 已存在执行实录")
