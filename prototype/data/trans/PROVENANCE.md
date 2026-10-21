# 译文层出处记录（PROVENANCE）

> 本文件随 `prototype/` 一起分发。译文**正文**已物化在本目录的 `cn*.js` 分卷里，
> 即使 `_work/` 被清理也不会丢失；此处仅记录生成来源，便于追溯与复核。

## 一、当前译文层规模

| 项目 | 数值 |
| :--- | :--- |
| 分卷数 | 21 |
| 覆盖法规 | 1219 部 |
| 译文条目 | 31396 条 |
| 语向 | zh → en |
| 最近更新 | 2026-10-21 |

## 二、分卷清单

| 分卷文件 | 语向 | 法规数 | 条目数 |
| :--- | :--- | ---: | ---: |
| `cn-p01.en.js` | zh→en | 80 | 2659 |
| `cn-p02.en.js` | zh→en | 33 | 1530 |
| `cn-p03.en.js` | zh→en | 26 | 1191 |
| `cn-p04.en.js` | zh→en | 26 | 1125 |
| `cn-p05.en.js` | zh→en | 39 | 1740 |
| `cn-p06.en.js` | zh→en | 80 | 912 |
| `cn-p07.en.js` | zh→en | 80 | 536 |
| `cn-p08.en.js` | zh→en | 80 | 1006 |
| `cn-p09.en.js` | zh→en | 80 | 1561 |
| `cn-p10.en.js` | zh→en | 80 | 1641 |
| `cn-p11.en.js` | zh→en | 76 | 880 |
| `cn-p12.en.js` | zh→en | 74 | 771 |
| `cn-p13.en.js` | zh→en | 60 | 1880 |
| `cn-p14.en.js` | zh→en | 67 | 1469 |
| `cn-p15.en.js` | zh→en | 60 | 1857 |
| `cn-p16.en.js` | zh→en | 61 | 1942 |
| `cn-p17.en.js` | zh→en | 57 | 1745 |
| `cn-p18.en.js` | zh→en | 57 | 1526 |
| `cn-p19.en.js` | zh→en | 52 | 1530 |
| `cn-p20.en.js` | zh→en | 26 | 908 |
| `cn.en.js` | zh→en | 25 | 2987 |

## 三、生成方式与校验

- 生成：`_work/trans/ingest-trans.js`（把回执按 `calr-trans-v2` 契约写入分卷）
- 索引：`manifest.js` 的 `byLaw` 记录每部法规的译文在哪个分卷，界面按需加载该分卷
- 校验：`_work/mm/verify-trans-full.py` 做全量一致性检查（manifest↔分卷↔法规库↔回执）

## 四、一致性校验结果

| 检查 | 结果 |
| :--- | :--- |
| A manifest 声明 → 分卷内容 | ✓ 通过 |
| B 分卷内容 → manifest 登记 | ✓ 通过 |
| C 译文对应法规存在于 laws/ | ✓ 通过 |
| D 与 returns 回执条文数一致 | ✓ 通过 |

## 五、红线说明

- 译文与官方原文**物理分离**：译文只写在 `data/trans/`，绝不写回 `data/laws/`
- 界面读取时在内存中合并，磁盘上的原文文件保持逐字原样
- 每条译文记录带 `provenance`（engin / model / promptVersion / translatedAt / reviewed）
