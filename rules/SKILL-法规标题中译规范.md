# SKILL · 法规标题中译规范（calr-title-zh-v1）

> **这份文件是「翻译 agent」与「本项目（入库方）」之间的唯一契约。**
> 你（翻译 agent）拿到的是一个**任务包**，交回的是一个**回执包**。
> 入库方只用脚本校验回执包，**格式不符即整批退回**，不做人工修补。

- 版本：`calr-title-zh-v1`（2026-10-17）
- 适用：中国—东盟法律法规数据库（CALR）· 法规**标题**中文翻译
- 校验器：`tools/verify-title-return.js`
- 入库器：`_work/title/ingest-titles.js`
- 任务包导出：`_work/title/export-title-batch.js`

---

## 0. 一句话说清你要做什么

把任务包 `titles.json` 里**每一条**的 `en`（英文法规标题）译成**简体中文标题**，按第 4 节的固定 JSON 结构交回。

你输出的**不是**官方译本、**不是**法律意见，只是一个便于中文用户识别的标题译名；但你必须做到：**不增、不删、不合并、不编造**。

**你不做的事**：不译条文正文、不写摘要、不写评注、不写免责声明、不"顺手"修正原文、不补充原文没有的名称。

---

## 1. 任务包长什么样（你会收到什么）

```
CALR-TITLE-<时间戳>-<范围>-<条数>/
├── manifest.json     任务清单（jobId、sourceLang、targetLang、条数、源哈希）
├── titles.json       ★ 唯一数据源：[{ id, country, en, hint }]
└── README.txt        一页说明
```

`titles.json` 示例：

```json
[
  { "id": "SG-H3637", "country": "SG", "en": "Securities and Futures Act 2001", "hint": "236 条" },
  { "id": "SG-H004",  "country": "SG", "en": "Companies Act 1967",            "hint": "435 条" },
  { "id": "BN-CAP-39-2015-COMPANIES-ACT", "country": "BN", "en": "COMPANIES ACT", "hint": "397 条" }
]
```

- `id` —— 法规唯一编号，**回执中原样返回，禁止改动**
- `en` —— 英文标题，**唯一翻译依据**
- `country` —— 国别代码（PH 菲律宾 / SG 新加坡 / BN 文莱 / TH 泰国 / KH 柬埔寨 / MM 缅甸）
- `hint` —— 该法规条文数量，仅供参考，**不必写进译文**

---

## 2. 你要交什么（回执包结构）

目录名：`CALR-TITLE-<同一时间戳>-<范围>-<条数>-RETURN/`

```
CALR-TITLE-....-RETURN/
├── receipt.json          总回执（必须有）
├── titles.001.json       第 1 片（必须有）
├── titles.002.json       第 2 片（多了就继续，三位数编号、从 001 连续）
└── ...
```

### 2.1 `titles.<NNN>.json`

```json
{
  "jobId": "CALR-TITLE-20261017-1732-SG-8",
  "shard": 1,
  "items": [
    { "id": "SG-H3637", "zh": "证券与期货法 2001" },
    { "id": "SG-H004",  "zh": "公司法 1967" },
    { "id": "BN-CAP-39-2015-COMPANIES-ACT", "zh": "公司法" }
  ]
}
```

| 字段 | 必填 | 说明 |
| :--- | :--- | :--- |
| `jobId` | ✓ | 与任务包 `manifest.json` 的 `jobId` **完全一致** |
| `shard` | ✓ | 分片序号，从 1 开始 |
| `items[].id` | ✓ | 任务包中的 `id`，**原样**，不得增删改 |
| `items[].zh` | ✓ | 中文标题，**2–90 字符** |
| `items[].note` | 选填 | 译法说明（如专有名词处理），**不要写成免责声明** |

### 2.2 `receipt.json`

```json
{
  "jobId": "CALR-TITLE-20261017-1732-SG-8",
  "engine": "llm",
  "model": "<你的模型名>",
  "generatedAt": "2026-10-17T18:00:00+08:00",
  "counts": { "requested": 150, "translated": 150, "skipped": 0 },
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
`en` 是标题，译文也必须是标题。**不要**把标题扩写成一句话、不要加"本法规定…"。

### R3 · 中文为主
- 中文字符 ≥ 2 个，且**中文占比 ≥ 50%**
- 长度 **2–90 字符**（含空格与标点）
- 不得与英文原文完全相同（那是没译）

### R4 · 专有名词"保留原文"，绝不音译/意译/编造
公司名、地名、人名、机构名、品牌名——**原样保留英文**，不要音译成中文，也不要自己造中文名。

- ✅ `An Act Granting Manila Electric Company a Franchise…` → `关于授予 Manila Electric Company 特许经营权的法案`
- ❌ `关于授予马尼拉电力公司特许经营权的法案`（擅自音译公司名，**不允许**）
- ❌ `关于授予 FakeCorp 特许经营权的法案`（原名里没有 `FakeCorp`，**编造**，校验器会抓）

**硬性约束**：译文里出现的任何拉丁字母片段，**必须能在原文标题中找到**（校验器 R8 逐词比对）。
例外白名单：`No` `B.E.` `REIT` `PPP` `MAS` `ACRA` `MOM` `SDK` `LLP` `Pte` `Ltd` `Inc` `Corp` `Co` 等常见缩写。

### R5 · 结构与年份照搬
- 年份、文号原样保留：`2004` `2025` `B.E. 2535 (1992)` `No. 1021/009`
- 层级词对应：
  | 英文 | 中文 |
  | :--- | :--- |
  | `Act` | 法 |
  | `Law` | 法 |
  | `Code` | 法典 |
  | `Order` | 命令 |
  | `Rules` | 规则 |
  | `Regulations` | 条例 |
  | `Notification` | 公告 |
  | `Decree` | 法令 |
  | `Ordinance` | 条例 |
  | `Royal Kram` | 王室敕令 |
  | `Amendment / Amending` | 修正 |
- 括号结构照搬：`A (B) Regulations 2025` → `A（B）条例 2025`（**用中文括号**）

### R6 · 禁止套话与占位
译文里**不得出现**：`免责` `仅供参考` `翻译说明` `待译` `TODO` `待补充` `占位` `略` `无法翻译` `原文见` `以下为` `说明：`
（这些由入库方在界面上统一标注，你不需要也不允许写进标题。）

---

## 4. 正误对照（照这些例子判断）

| 原文 | ✅ 正确 | ❌ 错误 | 错在哪 |
| :--- | :--- | :--- | :--- |
| `Competition Act 2004` | `竞争法 2004` | `Competition Act 2004` | R3 未翻译 |
| `Companies Act` | `公司法` | `关于公司的法案，规定了公司设立与运营等事项` | R2 扩写成句子 |
| `Copyright (Collective Management Organisations) Regulations 2023` | `著作权（集体管理组织）条例 2023` | `著作权(集体管理组织)条例2023` | 格式不统一（可接受但建议用中文括号） |
| `Income Tax (Digital Core REIT — Section 13(12) Exemption) Order 2026` | `所得税（数字核心 REIT—第13(12)条豁免）命令 2026` | `所得税（数字核心房地产投资信托—第13(12)条豁免）命令 2026` | REIT 是通用缩写，保留更准确；两种均可，但**不要编造原文没有的名称** |
| `An Act Granting the Boy Scouts of the Philippines Ten Thousand Hectares…` | `关于向 Boy Scouts of the Philippines 授予一万公顷…的法案` | `关于向菲律宾童军会授予…` | R4 擅自意译机构名 |
| `THE PENAL CODE` | `刑法典` | `刑法典（仅供参考）` | R6 含套话 |
| `Jurong Town Corporation Act 1968` | `Jurong Town Corporation 法 1968` | `裕廊镇公司法 1968` | ⚠ 见下方说明 |

> **关于地名/机构名的例外**：少数名称已有**约定俗成的中文通用译名**（如 `Jurong Town Corporation` = 裕廊镇公司、`Sentosa` = 圣淘沙）。若你**确信**该译名是公认通用译法，可以用中文；否则一律保留原文。
> 但**校验器只检查"原文没有的拉丁片段"**，用中文通用译名不会被拦截——请自行把握，**宁可保留原文，不要臆造**。

---

## 5. 交付前自检（C1–C8）

在 `receipt.json` 的 `selfCheck` 里逐项确认（真实核对，不要照抄 true）：

| # | 检查项 | 判据 |
| :--- | :--- | :--- |
| C1 | `allIdsReturned` | 任务包每个 id 都在回执中出现 |
| C2 | `noExtraIds` | 回执中没有任务包之外的 id |
| C3 | `noDuplicateIds` | 同一 id 只出现一次 |
| C4 | `allNonEmpty` | 每条 `zh` 非空、长度 2–90 |
| C5 | `noSourceCopies` | 没有一条 `zh` 与原文完全相同 |
| C6 | `noInventedNames` | 未编造原文不存在的公司/地名 |
| C7 | `noBoilerplate` | 无 `免责/仅供参考/待译/TODO` 等 |
| C8 | `jsonValid` | 所有 JSON 可解析、UTF-8 无 BOM |

---

## 6. 红线（违反即整批退回）

1. **不得编造**任何原文不存在的名称、条文、机构
2. **不得增删条目**、不得改 `id`
3. **不得**输出非标题内容（摘要、评注、免责声明）
4. **不得**用「机器翻译直出」而不做中文语序调整（会产生"登记的宾客法"这类病句）
5. **不得**把不同 `id` 的译文错配
6. 遇到**确实无法翻译**的条目（例如纯泰文/缅文标题），**跳过并在 `receipt.skipped` 计数**，`items` 里**不要**放该 id 的空译文

---

## 7. 分批交付

任务量大时可分多次交付：

- 每次交付一个**独立的回执包**（不同时间戳），`counts.requested` 仍填任务包总数，`translated` 填本次条数
- 入库方用 `--partial` 校验：`node tools/verify-title-return.js <回执包> --job <任务包> --partial`
- 分批时**不得**重复交付同一 id（重复会被 R3 判错）

---

## 8. 入库方会怎么处理你的回执

```bash
# 1) 校验（任何错误即中止，不写盘）
node tools/verify-title-return.js <回执包目录> --job <任务包目录>

# 2) 预览写入结果（不落盘）
node _work/title/ingest-titles.js <回执包目录> --job <任务包目录> --dry

# 3) 正式入库（写入 prototype/data/laws/<id>.json 的 title.zh）
node _work/title/ingest-titles.js <回执包目录> --job <任务包目录>

# 4) 重建分卷 + 全量校验
node --max-old-space-size=8192 _work/merge/rebuild-index.js
node --max-old-space-size=8192 _work/merge/build-packs.js
node _work/verify.js && node tools/verify-data.js && node _work/verify-fulltext.js
```

入库后每条记录会带上：

```json
"titleTranslation": {
  "engine": "llm",
  "model": "<你的模型名>",
  "reviewed": false,
  "batch": "<jobId>",
  "source": "<英文原标题>",
  "note": "由翻译 agent 按《法规标题中译规范》产出，经机器校验后入库；尚未人工复核。"
}
```

界面会在标题旁显示「原文标题 · 暂无当前语言译名」标记来区分**已译/未译**，所以你**不需要**在译文里做任何标注。

---

## 9. 校验器会抓的 13 条（对应错误清单）

| 规则 | 检查内容 |
| :--- | :--- |
| R1 | 目录结构：`receipt.json` + `titles.NNN.json`，JSON 可解析 |
| R2 | `jobId` 与任务包一致；`receipt` 声明 `engine`/`model` |
| R3 | 每个请求 id 恰好出现一次；无重复 |
| R4 | 无任务包之外的 id |
| R5 | `zh` 非空、长度 2–90 |
| R6 | `zh` 不与原文完全相同 |
| R7 | 中文字符 ≥ 2，中文占比 ≥ 50% |
| R8 | 译文中的拉丁片段必须出现在原文中（防编造） |
| R9 | 无 `免责/仅供参考/翻译说明/待译/TODO/占位` 等 |
| R10 | 括号成对（警告级） |
| R11 | 覆盖率与 `receipt.counts` 自洽 |
| R12 | 分片编号从 001 连续（警告级） |
| R13 | UTF-8 **无 BOM** |

**实测有效性**：用 9 类错误回执（漏条、id 不存在、重复 id、空译文、照抄原文、全英文、编造公司名、含免责套话、超长）测试，**9 类全部被拦截**。

---

## 10. 开始前的 3 个问题（请先自答）

1. 我拿到的是 `titles.json`，里面每条都有 `id` 和 `en` —— 对吗？
2. 我要交回的是 `titles.001.json` + `receipt.json`，结构如第 2 节 —— 对吗？
3. 我理解"公司名/地名保留原文、不编造、不加套话" —— 对吗？

三个都是"是"，就可以开始了。
