# -*- coding: utf-8 -*-
import io, os, sys
sys.stdout.reconfigure(encoding="utf-8")
os.chdir(r"D:\A项目\Database_China–ASEAN Laws and Regulations Database")
# ① README：补 title-zh 目录说明
p = "README.md"
s = io.open(p, encoding="utf-8").read()
old = "- **法规标题中译**：全库 **5,532 部（29.3%）** 有中文标题；无中文标题者在界面标注「原文标题 · 暂无当前语言译名」而非臆造译名。标题中译契约与工具链见 [rules/SKILL-法规标题中译规范.md](rules/SKILL-法规标题中译规范.md)（`calr-title-zh-v1`，含 13 条机器校验规则）。"
new = ("- **法规标题中译**：全库 **17,985 部（95.4%）** 有中文标题（菲律宾 / 新加坡 / 中国 / 东帝汶 100%，文莱 97.1%）；"
       "无中文标题者在界面标注「原文标题 · 暂无当前语言译名」而非臆造译名。"
       "标题中译契约与工具链见 [rules/SKILL-法规标题中译规范.md](rules/SKILL-法规标题中译规范.md)（`calr-title-zh-v1`，13 条机器校验规则）；"
       "**译名归档在 [`prototype/data/title-zh/`](prototype/data/title-zh/)`** ——`titles.zh.json` 为全量导出（17,985 条）、"
       "`index.json` 为覆盖统计与 7 个交付批次、`artifacts/` 为任务包与回执包原始存档、`PROVENANCE.md` 记录译法与已纠正的质量事故。")
if old in s:
    s = s.replace(old, new, 1); print("  ✓ README 已更新标题中译段落")
else:
    print("  ! README 未命中")
# ② 目录结构补 data/title-zh
old2 = "│   ├── trans/"
if old2 in s:
    print("  - README 目录结构含 trans/")
io.open(p, "w", encoding="utf-8").write(s)

# ③ docs/32 补一节
p2 = "docs/32-数据养护与批次记录（2026-10-17）.md"
d = io.open(p2, encoding="utf-8").read()
anchor = "## 六、检索页与 AI 页的界面变更"
add = """## 五之二、法规标题中译的大规模交付与「目录表脱节」修复

### 5.2.1 批量交付

经 7 批任务包/回执包往返（每批均过 `tools/verify-title-return.js` 校验后才入库），累计新译 **12,453** 条标题：

| 批 | 任务包 | 条数 | 分片 |
| :--- | :--- | ---: | ---: |
| 1 | `CALR-TITLE-20261017-1732-SG-8` | 8 | 1 |
| 2 | `CALR-TITLE-20261017-1749-SG-1200` | 1,200 | 6 |
| 3 | `CALR-TITLE-20261017-1801-BN-1261` | 1,261 | 6 |
| 4 | `CALR-TITLE-20261017-1801-TH-160` | 160 | 1 |
| 5 | `CALR-TITLE-20261017-1816-IDS-5` | 5 | 1 |
| 6 | `CALR-TITLE-20261017-1818-SG-2467` | 2,467 | 13 |
| 7 | `CALR-TITLE-20261017-1837-PH-7575` | 7,575 | 40 |

**全库中文标题覆盖：29.3% → 95.4%（17,985 / 18,854）**，英文源标题覆盖率 100%。

未覆盖 869 部：泰文标题 571、缅文 12、文莱 `title` 字段为空 286。

### 5.2.2 发现的问题：目录表脱节

译名入库只写了 `laws/<id>.json` 的 `title.zh`，但**界面列表读的是 `intl-catalog.js`**：
实测 `laws/` 中文覆盖 **95.4%**，而 `intl-catalog` 仅 **42.3%** —— 译名存在、界面仍显示外文。

**修复**：新增 `_work/merge/sync-catalog-titles.js`，递归遍历目录表节点、凡 `{id, title}` 者从 `laws/` 补全：

```
intl-catalog.js   节点 11,839   补 zh 5,536
cn-catalog.js     节点 0        （结构不同，无需补）
dataset-core.js   节点 67       补 0（已完整）
```

修复后 `intl-catalog` 中文覆盖 **42.3% → 89.0%**；浏览器实测菲律宾 / 新加坡 / 文莱三个国别筛选分别 **20/20、20/20、19/20** 显示中文标题。

### 5.2.3 译名归档到 `prototype/data/title-zh/`

按「关键数据须在 `prototype/` 内」的要求，把原本只在 `_work/title/` 的交付物正式落到 `data/`：

| 文件/目录 | 内容 | 体积 |
| :--- | :--- | ---: |
| `titles.zh.json` | 全量译名导出：`id → {zh, en, batch, engine, model, reviewed}`，17,985 条 | 5.8 MB |
| `index.json` | 覆盖统计（按国别）+ 7 个批次清单 | 3.2 KB |
| `PROVENANCE.md` | 译法约定、两处判定偏离、质量事故与纠正、再生成方式、**为什么需要同步目录表** | 5.1 KB |
| `artifacts/` | 7 个任务包 + 7 个回执包 + 交付报告 + 作业规范 + 自检工具 + 模板 | 7.78 MB |

校验器 `tools/verify-data-home.js` 相应新增 3 项检查（A9 计数一致 / A10 逐条一致 / A11 归档非空），检查项 13 → **16**。

### 5.2.4 两处需知会的判定偏离

1. **校验器误判已修**：`FORBID` 原为裸匹配「略」，导致「战略 / 策略 / 简略」被判为套话（菲律宾有整条法名含 *Strategic*）。已改为只匹配独立省略标记 `[（(]略[）)]`。
2. **R7（中文占比 ≥50%）与 R4（地名保留原文）在菲律宾长标题上冲突**：严格保留全部专名时 R7 失败率约 10%（746 / 7,575）。最终口径为**行政地名用中文音译，学校 / 公司 / 人名 / 街道 / 桥 / 机场名保留英文**。这是本轮唯一的规则偏离。

### 5.2.5 已纠正的质量事故

026–033 片的执行单元曾为凑 R7 占比，擅自添加「原名称同时停止使用」「并自本法案生效之日起施行」等**原文没有的尾句（165 条）**。已按分句全部剔除，并由修订单元重译 746 条不达标项，最终 40 片全部 0 错误 0 警告。

---

""" + anchor
if "5.2.1 批量交付" in d:
    print("  - docs/32 已有该节")
else:
    d = d.replace(anchor, add, 1)
    io.open(p2, "w", encoding="utf-8").write(d)
    print("  ✓ docs/32 已加「标题中译交付与目录表脱节修复」一节")
