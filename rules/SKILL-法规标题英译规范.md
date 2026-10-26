# SKILL · 法规标题英译规范（calr-title-en-v1）

> **这份文件是「英译 agent」与「本项目（入库方）」之间关于中国法规标题英译的唯一契约。**
> 英译产出仅用于界面显示（页面切换英文时展示 `English (中文原名)`），**不是**官方译本、**不是**法律意见；
> 但必须做到：**不增、不删、不合并、不编造**，并优先采用已公开的官方英文名称。

- 版本：`calr-title-en-v1`（2026-10-25）
- 适用：中国—东盟法律法规数据库（CALR）· 中国法规**标题**英文翻译（zh → en）
- 方向与 `calr-title-zh-v1`（en → zh）互逆，本规范只约束 zh → en
- 入库器：`_work/title-en/apply-title-en.js`
- 目录同步：`_work/title-en/sync-catalog.js`

---

## 0. 一句话说清你要做什么

把任务包 `titles.json` 里**每一条**的 `zh`（中文法规标题）译成**英文标题**，按第 4 节固定 JSON 结构交回。

英文标题是给英文界面用户识别用的译名，不是官方文本；但你必须做到：**不增、不删、不合并、不编造**。

**你不做的事**：不译条文正文、不写摘要、不写评注、不写免责声明、不"顺手"修正原文、不补充原文没有的名称。

---

## 1. 任务包长什么样（你会收到什么）

```
CALR-TITLE-EN-<时间戳>-<范围>-<条数>/
├── manifest.json     任务清单（jobId、sourceLang、targetLang、条数、源哈希）
├── titles.json       ★ 唯一数据源：[{ id, country, zh, hint }]
└── README.txt        一页说明
```

`titles.json` 示例：

```json
[
  { "id": "CN-LAW-0001", "country": "CN", "zh": "中华人民共和国仲裁法", "hint": "80 条" },
  { "id": "CN-LAW-0002", "country": "CN", "zh": "优化营商环境条例",     "hint": "62 条" }
]
```

- `id` —— 法规唯一编号，**回执中原样返回，禁止改动**
- `zh` —— 中文标题，**唯一翻译依据**
- `country` —— 国别代码（本规范面向 CN，但规则同样适用于标题为中文的其他国别记录）
- `hint` —— 条文数量，仅供参考，**不必写进译文**

---

## 2. 你要交什么（回执包结构）

目录名：`CALR-TITLE-EN-<同一时间戳>-<范围>-<条数>-RETURN/`

```
CALR-TITLE-EN-....-RETURN/
├── receipt.json          总回执（必须有）
├── titles.001.json       第 1 片（必须有）
└── titles.002.json       第 2 片（多了就继续，三位数编号、从 001 连续）
```

### 2.1 `titles.<NNN>.json`

```json
{
  "jobId": "CALR-TITLE-EN-20261025-1000-CN-1560",
  "shard": 1,
  "items": [
    { "id": "CN-LAW-0001", "en": "Arbitration Law of the People's Republic of China" },
    { "id": "CN-LAW-0002", "en": "Regulations on Optimizing the Business Environment" }
  ]
}
```

| 字段 | 必填 | 说明 |
| :--- | :--- | :--- |
| `jobId` | ✓ | 与任务包 `manifest.json` 的 `jobId` **完全一致** |
| `shard` | ✓ | 分片序号，从 1 开始 |
| `items[].id` | ✓ | 任务包中的 `id`，**原样**，不得增删改 |
| `items[].en` | ✓ | 英文标题，**3–200 字符** |
| `items[].note` | 选填 | 译法说明（如官方译名来源），**不要写成免责声明** |

### 2.2 `receipt.json`

```json
{
  "jobId": "CALR-TITLE-EN-20261025-1000-CN-1560",
  "engine": "llm",
  "model": "<你的模型名>",
  "generatedAt": "2026-10-25T10:00:00+08:00",
  "counts": { "requested": 1560, "translated": 1560, "skipped": 0 },
  "shards": ["titles.001.json"],
  "selfCheck": {
    "allIdsReturned": true,
    "noExtraIds": true,
    "noDuplicateIds": true,
    "noBoilerplate": true
  }
}
```

- `requested` 必须等于任务包条数
- `translated + skipped` 必须等于 `requested`（正常情况 `skipped = 0`）
- `translated` 必须等于**回执里实际条目数**

---

## 3. 翻译规则（R1–R6）

### R1 · 一进一出，不多不少
任务包有几条，回执就必须有**同样多条**，`id` 一一对应。
**不允许**漏条、多条、改 id、合并条目、拆分条目。

### R2 · 只译标题，不译正文
`zh` 是标题，译文也必须是标题。**不要**把标题扩写成一句话、不要加 "This Law provides that…"。

### R3 · 英文为主，结构完整
- 拉丁字母 ≥ 5 个，且拉丁字符占比 ≥ 60%
- 长度 **3–400 字符**（含空格与标点；联合发文的长标题允许更长，以不删减原文要素为准）
- 不得与中文原文完全相同（那是没译）
- 必须可被英文用户理解为一个**法规标题**，而非散句

### R4 · 优先官方译名；无官方译名时按结构直译，不臆造
中国重要法律的英文名称已有官方或通行译法，**优先采用**：

| 中文 | ✅ 英文（官方/通行） |
| :--- | :--- |
| 中华人民共和国民法典 | Civil Code of the People's Republic of China |
| 中华人民共和国刑法 | Criminal Law of the People's Republic of China |
| 中华人民共和国公司法 | Company Law of the People's Republic of China |
| 中华人民共和国仲裁法 | Arbitration Law of the People's Republic of China |
| 中华人民共和国宪法 | Constitution of the People's Republic of China |

- 无官方译名时，按第 5 节结构模板**逐词忠实直译**，**不得**替换、省略或虚构机构名/罪名/事项
- 中文机构名用其正式英文名：最高人民法院 = Supreme People's Court、最高人民检察院 = Supreme People's Procuratorate、全国人民代表大会常务委员会 = Standing Committee of the National People's Congress、国务院 = State Council 等
- 例外白名单：`No.` `B.E.` 等常见缩写可直接使用

### R5 · 结构与年份照搬
- 年份、文号原样保留：`1986` `2019` `第 X 条` → `Article X`、`第（X）号` → `No. (X)`
- 层级词对应（中文 → 英文）：

  | 中文 | 英文 |
  | :--- | :--- |
  | 法 | Law |
  | 法典 | Code |
  | 条例 | Regulations |
  | 办法 | Measures |
  | 规定 | Provisions |
  | 规则 | Rules |
  | 实施细则 | Implementing Rules |
  | 解释 | Interpretation |
  | 决定 | Decision |
  | 批复 | Reply |
  | 通知 | Notice |
  | 公告 | Announcement |
  | 意见 | Opinions |
  | 修正案 | Amendment |

- 括号结构照搬：`……（……）` → `…… (……)`（**英文半角括号**；界面回显中文原名时才用中文括号）

### R6 · 禁止套话与占位
译文里**不得出现**：`Disclaimer` `for reference only` `translation note` `TBD` `TODO` `待译` `占位` `略` `unable to translate` `original text see` 等
（这些由入库方在界面上统一标注，你不需要也不允许写进标题。）

---

## 4. 正误对照（照这些例子判断）

| 原文 | ✅ 正确 | ❌ 错误 | 错在哪 |
| :--- | :--- | :--- | :--- |
| 中华人民共和国仲裁法 | Arbitration Law of the People's Republic of China | Arbitration Law | R4 漏译"中华人民共和国" |
| 优化营商环境条例 | Regulations on Optimizing the Business Environment | Regulations about the optimizing business environment | R3 语序/结构不当 |
| 数据出境安全评估办法 | Measures for Security Assessment of Data Export | Measures for Data Exit Security Assessment 2025 | 年份是编造的（原文没有） |
| 最高人民法院关于审理非法行医刑事案件具体应用法律若干问题的解释 | Interpretation of the Supreme People's Court on Several Issues concerning the Specific Application of Law in the Trial of Criminal Cases of Unlicensed Medical Practice | Judicial Interpretation on Illegal Medical Practice | R2 过度概括、丢结构词 |
| 中华人民共和国公司法 | Company Law of the People's Republic of China | PRC Company Law（可接受） | 均属通行译法；保持同一法规库内风格统一即可 |

---

## 5. 结构模板（R4 的直译骨架）

| 中文骨架 | 英文骨架 |
| :--- | :--- |
| `中华人民共和国《X》` | `X of the People's Republic of China` |
| `《X》法` | `X Law`（如《民法典》→ Civil Code） |
| `关于《X》的决定` | `Decision on X` |
| `关于修改《X》的决定` | `Decision on Amending X` |
| `最高人民法院关于……的解释` | `Interpretation of the Supreme People's Court on ……` |
| `最高人民法院、最高人民检察院关于……的批复` | `Reply of the Supreme People's Court and the Supreme People's Procuratorate on ……` |
| `全国人民代表大会常务委员会关于……的决定` | `Decision of the Standing Committee of the National People's Congress on ……` |
| `……施行日期：自 X 年 Y 月 Z 日起` | 不译正文，只译标题本身 |

模板不足以覆盖的复杂标题（多部门联合发文、特定罪名、特定事项），**按原文字面逐段直译**，宁可译得长，不可省略原文要素。

---

## 6. 交付前自检（C1–C8）

| # | 检查项 | 判据 |
| :--- | :--- | :--- |
| C1 | `allIdsReturned` | 任务包每个 id 都在回执中出现 |
| C2 | `noExtraIds` | 回执中没有任务包之外的 id |
| C3 | `noDuplicateIds` | 同一 id 只出现一次 |
| C4 | `allNonEmpty` | 每条 `en` 非空、长度 3–400 |
| C5 | `noSourceCopies` | 没有一条 `en` 与原文完全相同 |
| C6 | `noChineseResidue` | 译文中不残留中文汉字（专名音译除外，见 R4） |
| C7 | `noBoilerplate` | 无 `Disclaimer/TBD/待译/TODO` 等 |
| C8 | `jsonValid` | 所有 JSON 可解析、UTF-8 无 BOM |

---

## 7. 红线（违反即整批退回）

1. **不得编造**任何原文不存在的名称、年份、条文、机构
2. **不得增删条目**、不得改 `id`
3. **不得**输出非标题内容（摘要、评注、免责声明）
4. **不得**用「机器直译」不做结构整理（会产生 "of the on the" 这类病句）
5. **不得**把不同 `id` 的译文错配
6. 遇到**确实无法翻译**的条目（例如纯文言/纯外文标题），**跳过并在 `receipt.skipped` 计数**，`items` 里**不要**放该 id 的空译文

---

## 8. 入库方会怎么处理你的回执

```bash
# 1) 合并回执分片 → _work/title-en/titles-en.json（自带 id 完整性、汉字残留、套话校验）
node _work/title-en/merge-return.js <回执包目录>

# 2) 预览写入结果（不落盘）
node _work/title-en/apply-title-en.js --dry

# 3) 正式入库（写入 prototype/data/laws/<id>.json 的 title.en）
node _work/title-en/apply-title-en.js

# 4) 同步目录层（新增 titleEn 字段，供前端英文界面读取）
node _work/title-en/sync-catalog.js
```

入库后，`prototype/data/laws/<id>.json` 形成双语标题：

```json
"title": { "zh": "中华人民共和国公司法", "en": "Company Law of the People's Republic of China" }
```

界面在英文语言下将中国法规标题显示为 `English（中文原名）`（全角括号），用于区分**英文译名**与**中文原名**；中文界面仍只显示原名。

---

## 9. 开始前的 3 个问题（请先自答）

1. 我拿到的是 `titles.json`，里面每条都有 `id` 和 `zh` —— 对吗？
2. 我要交回的是 `titles.001.json` + `receipt.json`，结构如第 2 节 —— 对吗？
3. 我理解"优先官方译名、无则结构直译、不编造、不加套话" —— 对吗？

三个都是"是"，就可以开始了。
