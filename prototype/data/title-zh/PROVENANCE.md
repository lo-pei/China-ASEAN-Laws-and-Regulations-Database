# 法规标题中文译名 · 出处记录（PROVENANCE）

> 本目录随 `prototype/` 一起分发。译名**正文**已写入 `prototype/data/laws/<法规ID>.json` 的 `title.zh`，
> 此处的 `titles.zh.json` 是全量汇总导出，`artifacts/` 是各批交付的原始存档。
> 即使 `_work/` 被清理，译名与过程记录都不会丢失。

## 一、覆盖情况

| 指标 | 数值 |
| :--- | ---: |
| 全库法规 | 18854 部 |
| **有中文标题** | **17985 部（95.4%）** |
| 无中文标题 | 869 部 |

### 按国别

| 国别 | 法规数 | 有中文标题 | 覆盖率 |
| :--- | ---: | ---: | ---: |
| PH | 10619 | 10617 | 100.0% |
| SG | 3714 | 3714 | 100.0% |
| CN | 1586 | 1586 | 100.0% |
| BN | 1298 | 1261 | 97.1% |
| TH | 816 | 162 | 19.9% |
| TL | 230 | 230 | 100.0% |
| KH | 189 | 162 | 85.7% |
| MY | 97 | 68 | 70.1% |
| VN | 91 | 55 | 60.4% |
| MM | 85 | 49 | 57.6% |
| LA | 80 | 44 | 55.0% |
| ID | 49 | 37 | 75.5% |

## 二、交付批次（共 7 批）

| 批次 ID | 条数 | 分片 | 回执包 | 引擎 |
| :--- | ---: | ---: | :--- | :--- |
| `CALR-TITLE-20261017-1732-SG-8` | 8 | 1 | CALR-TITLE-20261017-1732-SG-8-RETURN | llm |
| `CALR-TITLE-20261017-1749-SG-1200` | 1200 | 6 | CALR-TITLE-20261017-1749-SG-1200-RETURN | llm |
| `CALR-TITLE-20261017-1801-BN-1261` | 1261 | 6 | CALR-TITLE-20261017-1801-BN-1261-RETURN | llm |
| `CALR-TITLE-20261017-1801-TH-160` | 160 | 1 | CALR-TITLE-20261017-1801-TH-160-RETURN | llm |
| `CALR-TITLE-20261017-1816-IDS-5` | 5 | 1 | CALR-TITLE-20261017-1816-IDS-5-RETURN | llm |
| `CALR-TITLE-20261017-1818-SG-2467` | 2467 | 13 | CALR-TITLE-20261017-1818-SG-2467-RETURN | llm |
| `CALR-TITLE-20261017-1837-PH-7575` | 7575 | 40 | CALR-TITLE-20261017-1837-PH-7575-RETURN | llm |

## 三、译法约定

- **层级词照搬**：Act / Law → 法，Code → 法典，Order → 命令，Rules → 规则，
  Regulations / Regns → 条例，Notification → 公告，Decree → 法令，Ordinance → 条例，
  Royal Kram → 王室敕令，Amendment → 修正
- **年份与文号原样保留**，与中文之间留一个半角空格（如 `公司法 1967`）；括号改中文括号
- **专名处理**：公司名、人名、学校名、街道名、桥名、机场名保留英文；
  新加坡法定机构用官方中文名（会计与企业管制局、陆路交通管理局等）；
  菲律宾行政地名（省 / 市 / 市镇 / Barangay）用中文音译

## 四、两处判定偏离（需知会）

**1）校验器误判已修**：`tools/verify-title-return.js` 的 `FORBID` 原为裸匹配「略」，
导致「战略 / 策略 / 简略」被判为套话（菲律宾有整条法名含 *Strategic*）。已改为只匹配独立省略标记 `[（(]略[）)]`。

**2）R7（中文占比 ≥50%）与 R4（地名保留原文）在菲律宾长标题上冲突**：
菲律宾法案标题常把「改设城市 + 省 + 市镇 + barangay + 校名」堆在一条里，重复地名多，
严格保留全部专名时 R7 失败率约 10%（746 / 7,575）。最终口径为
**行政地名用中文音译，学校 / 公司 / 人名 / 街道 / 桥 / 机场名保留英文**。
若要求地名也严格保留原文，需放宽 R7 阈值后重跑这 746 条。

## 五、质量事故与纠正（留档）

026–033 片的执行单元曾为凑 R7 占比，擅自添加「原名称同时停止使用」
「并自本法案生效之日起施行」等**原文没有的尾句（165 条）**。
已按分句全部剔除，并由修订单元重译 746 条不达标项，最终 40 片全部 0 错误 0 警告。

## 六、未覆盖的 869 部及原因

| 原因 | 数量 |
| :--- | ---: |
| 泰文标题（`export-title-batch.js` 按设计只处理英文源） | 571 |
| 缅文标题 | 12 |
| 文莱条目 `title` 字段为空（无源可译） | 286 |

## 七、再生成方式

```bash
# 1) 导出任务包
node _work/title/export-title-batch.js --country <XX> --count <N> --skip-existing

# 2) 交回后校验（13 条机检规则）
node tools/verify-title-return.js <回执包> --job <任务包>

# 3) 入库
node _work/title/ingest-titles.js <回执包> --job <任务包>

# 4) 重建分卷
node --max-old-space-size=8192 _work/merge/rebuild-index.js
node --max-old-space-size=8192 _work/merge/build-packs.js

# 5) ★ 同步目录表标题（关键！否则界面列表仍显示外文）
node _work/merge/sync-catalog-titles.js

# 6) 重新生成本目录归档
python _work/title-import/build-title-zh.py
```

## 八、为什么需要第 5 步

标题在数据层有两处副本：

| 位置 | 用途 |
| :--- | :--- |
| `prototype/data/laws/<id>.json` → `title` | **唯一真源**（分卷由它派生） |
| `prototype/data/intl-catalog.js` → `title` | **界面列表直接读取** |

只写第一处、不同步第二处，就会出现「译名已入库但界面仍显示外文」的现象
（2026-10-17 实测：`laws/` 中文覆盖 95.4%，而 `intl-catalog` 仅 42.3%）。
`_work/merge/sync-catalog-titles.js` 即为补上这一步，实测补齐 5,536 条后 `intl-catalog` 覆盖升至 89.0%，界面三个国别筛选实测 20/20、20/20、19/20 显示中文。
