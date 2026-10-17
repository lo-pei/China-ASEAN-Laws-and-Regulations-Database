# 译文层出处记录（PROVENANCE）

> 本文件随 `prototype/` 一起分发。译文**正文**已物化在本目录的 `cn*.js` 分卷里，
> 即使 `_work/` 被清理也不会丢失；此处仅记录生成来源，便于追溯与复核。

## 一、当前译文层规模

| 项目 | 数值 |
| :--- | :--- |
| 分卷数 | 13 |
| 覆盖法规 | 255 部 |
| 译文条目 | 5814 条 |
| 最近更新 | 2026-10-17 |

## 二、分卷清单

| 分卷文件 | 语向 | 法规数 | 条目数 | 生成引擎 |
| :--- | :--- | ---: | ---: | :--- |
| `cn-p01.en.js` | zh→en | 26 | 26 | llm |
| `cn-p02.en.js` | zh→en | 3 | 421 | llm |
| `cn-p03.en.js` | zh→en | 1 | 306 | llm |
| `cn-p04.en.js` | zh→en | 3 | 507 | llm |
| `cn-p05.en.js` | zh→en | 14 | 796 | llm |
| `cn-p06.en.js` | zh→en | 52 | 510 | llm |
| `cn-p07.en.js` | zh→en | 46 | 46 | llm |
| `cn-p08.en.js` | zh→en | 16 | 16 | llm |
| `cn-p09.en.js` | zh→en | 3 | 3 | llm |
| `cn-p10.en.js` | zh→en | 3 | 3 | llm |
| `cn-p11.en.js` | zh→en | 16 | 16 | llm |
| `cn-p12.en.js` | zh→en | 48 | 190 | llm |
| `cn.en.js` | zh→en | 24 | 2974 | llm |

## 三、入库批次

| 批次 | 引擎 | 模型 | 生成日期 | 复核 |
| :--- | :--- | :--- | :--- | :--- |
| `CALR-TRANS-CN-EN-2026-10-14-1430` | llm | deepseek-v4.1-flash | 2026-10-14 | machine |
| `CALR-TRANS-CN-EN-OFFICIAL-CC` | official | — | 2020-12-31 | human |

## 四、再入库方式（若需重放）

```bash
# 校验回执包
node tools/verify-trans-return.js <回执包目录>

# 落盘到本目录（会重写 cn*.js 与 manifest.js）
node _work/trans/ingest-trans.js <任务包目录> <回执包目录>
```

## 五、与原文层的分离原则

- 原文（A/B/C 层）存于 `prototype/data/laws/`，是**唯一权威源**
- 译文（D 层）存于本目录，**从不写回原文**；界面读取时在内存中合并
- 每条译文保留 `provenance{engine, model, promptVersion, translatedAt, reviewed, glossaryVersion}`

## 六、已知数据瑕疵

- `CN-LAW-0293`（中华人民共和国刑法）译文含 53 处「之一」式条号（如 `308.1`）
  - 这是刑法的真实条号形式（第三百零八条之一），非错误
  - `tools/verify-trans-return.js` 的 R19 规则暂不识别此类插入条号，会误报；
    阅读层按 `no` 精确匹配，显示不受影响
