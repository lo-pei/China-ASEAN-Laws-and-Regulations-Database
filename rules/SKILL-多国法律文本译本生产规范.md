# SKILL.md — 中国—东盟法律法规数据库 · 多国法律文本非官方译本生产规范

> **这份文件是「翻译 agent」与「本项目（入库方）」之间的唯一契约。**
> 你（翻译 agent）拿到的是一个**任务包**，交付的是一个**回执包**；
> 入库方只用脚本校验回执包，**格式不符即整批退回，不做人工修补**。
>
> - 版本：`calr-trans-v2.2`（2026-10-15 依《民法典》官方英译本校正：编=`Book`、拼写按 job 声明、`engine=official`）
> - 建立日期：2026-10-11（`calr-trans-v2.0`）
> - 适用范围：**中译外任务适用全部章节**；非中文源语言的任务请读 §4.11 开头的适用性说明
> - 上游依赖：`rules/SKILL-条文入库与译文分离规范.md` §6（D 译文层契约）
> - 入库方校验器：`tools/verify-trans-return.js`（**你必须先自跑通过再交付**）
> - 术语表校验器：`tools/verify-glossary.js`（Phase 0 用）
> - 输入包模板：`tools/templates/trans-job.template.json`
> - 回执包模板：`tools/templates/trans-return.template.json`

---

## 0. 一句话说清你要做什么

> 把任务包里 `<sourceLang>` 的法律条文，**逐条**译成 `targetLang`，
> 按本文档第 3 节的**固定 JSON 结构**回传。
> 你输出的**不是官方法律文本、不是法律意见**，只是参考译本；
> 但你必须做到：**不增、不删、不改结构、不缺条、不臆造**。

**你不做的事**：不做摘要、不做评注、不做合规建议、不"顺手修正"原文、不合并或拆分条文、不补条文编号。

---

## 1. 任务包长什么样（你会收到什么）

```
CALR-TRANS-<JOBID>/
├── manifest.json          任务清单（含 jobId、目标语言、法规列表、每部法的条数与源哈希）
├── glossary.json          术语表（强制使用；版本号写在 manifest 里）
├── laws/
│   ├── <lawId>.json       单部待译法规（结构见 §1.1）
│   └── …
└── README.txt             交付说明（指向本 SKILL）
```

### 1.1 `laws/<lawId>.json` — 待译原文（**只读，不得改动**）

```jsonc
{
  "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT",
  "sourceLang": "en",
  "title": { "en": "E PENAL CODE ACT" },
  "country": "BN",
  "textQuality": "ocr-scanned",        // ★ 见 §6.1：源文本可能有 OCR 噪声
  "articles": [
    {
      "no": 1,                            // ★ 条文编号，整数，原样保留，禁止改动
      "noLabel": { "en": "Section 1." },   // 原文的条号写法
      "chapter": { "en": "PART I" },       // 可能没有
      "heading": { "en": "Citation" },     // 可能没有
      "text": { "en": "…" }                // ★ 原文正文，含 \n\n 分段
    }
  ]
}
```

### 1.2 `manifest.json`

```jsonc
{
  "formatVersion": "calr-trans-v2",
  "jobId": "BN-TH-2026-10-11-001",
  "targetLang": "th",
  "targetCountry": "TH",
  "sourceLang": "en",
  "glossaryVersion": "2026-10",
  "createdAt": "2026-10-11",
  "items": [
    {
      "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT",
      "articleCount": 442,                 // ★ 你必须回传同样条数
      "sourceSha256": "…",                  // ★ 原文指纹，回执里要原样带回
      "textQuality": "ocr-scanned",
      "shards": [                          // ★ 建议分片；你可自行细分，但不得漏片
        { "shardId": "001", "fromNo": 1,  "toNo": 150 },
        { "shardId": "002", "fromNo": 151, "toNo": 300 },
        { "shardId": "003", "fromNo": 301, "toNo": 442 }
      ]
    }
  ]
}
```

> **分片是强制的**。单条回执的 `articles` 总数不得超过 **200 条**、单文件不得超过 **2 MB**。
> 超长法规必须按 `shards` 分多次回传，每次一个 `shardId`。

### 1.3 `glossary.json`（schema v2）

```jsonc
{
  "schema": "calr-glossary-v2",
  "glossaryVersion": "calr-terms-2026-10-v2",
  "sourceLang": "zh",
  "targetLang": "en",
  "counts": { "total": 870, "confirmed": 227, "pending": 643, "multiSense": 14 },
  "terms": [
    { "src": "合同",   "tgt": "contract",  "authority": "legislative-usage",
      "domain": "民法-合同", "status": "confirmed", "freq": 12345, "laws": 800 },

    { "src": "承诺",   "tgt": "acceptance", "authority": "legislative-usage",
      "domain": "民法-合同", "sense": "受要约人同意要约的意思表示（acceptance）",
      "status": "confirmed", "multiSense": true },

    { "src": "承诺",   "tgt": "promise",   "authority": "fallback",
      "domain": "民法-总则", "sense": "作出保证、允诺（promise/undertake），非合同法上的 acceptance",
      "status": "confirmed", "multiSense": true },

    { "src": "保理合同", "tgt": "", "authority": "pending",
      "domain": "民法-合同", "status": "pending", "freq": 42, "laws": 3 }
  ]
}
```

| 字段 | 必填 | 说明 |
| :--- | :---: | :--- |
| `src` | ✅ | 源语言术语（本项目源=中文） |
| `tgt` | ✅ | 目标语言译名；`status=pending` 时为空串 |
| `authority` | ✅ | `official` / `treaty` / `legislative-usage` / `fallback` / `pending` |
| `domain` | ✅ | **领域标签**，见 §4.11.5 |
| `sense` | ⭕ | **义项说明**。同一 `src` 有多个义项时必填 |
| `status` | ✅ | `confirmed`（译名已定）/ `pending`（**译名待你自建**） |
| `multiSense` | ⭕ | `true` 表示该 `src` 在表中有多个义项，**必须按上下文选** |
| `freq` / `laws` | ⭕ | 该术语在中国法规语料中的频次/覆盖法数，供你判断优先级 |

**三条硬规则**：

1. **`confirmed` 术语是强制的**——表里出现的 `src`，全文一律用其 `tgt`，不得同义替换。
2. **`pending` 术语你必须自建译名**——按 §4.4 的优先级选词，全文保持一致，并**逐条登记到 `glossary-additions.json`**（`authority` 填你依据的来源等级）。
3. **`multiSense: true` 的术语必须按领域选义项**——例如 `试用期` 在「劳动与社会保障」下是 `probation period`，在「民法-合同」的试用买卖下是 `trial period`。选不准则走 §4.8 上报，**不得含糊套用其中一个**。

---

### 1.4 术语表建设（**Phase 0，放量前必做**）

> **为什么单独成阶段**：术语表是跨分片一致性的**唯一**保障。
> 实测教训：民法典 9 个分片并行翻译时，6 个 agent 各自为「融资租赁合同」「保理合同」
> 「承揽合同」等术语定了不同译名——因为它们**不在术语表里**。放量前必须先把术语表填满。

**两阶段流程**：

```
Phase 0  术语表建设（一个语言一个 agent）
  输入：_work/trans/terms-candidates-zh.json（中文侧清单，含领域/频次/例句）
        _work/trans/glossaries/glossary-<lang>.json（v2，含 confirmed + pending）
  任务：把所有 status=pending 的术语填上 tgt，产出 glossary-<lang>.filled.json
  自检：node tools/verify-glossary.js <filled.json>
        必须输出「校验结果：全部通过」

Phase 1  条文翻译（多个 agent 并行）
  输入：任务包（glossary 用 Phase 0 的产物）
  任务：按本 SKILL 翻译
  硬要求：glossary 中 confirmed 的 src 一律用其 tgt；同 src 多义项按 domain 选
```

**Phase 0 的 term agent 必须遵守**：

- 逐条给 `tgt`，不得留空、不得跳条（`pending` 必须先填满才能进 Phase 1）
- 同一 `src` 的不同 `domain` **可以是不同译名**（这正是 `domain` 的作用）
- `authority` 按 §4.4 的优先级如实标注：`official`（目标法域官方术语）> `treaty`（条约官方译本）>
  `legislative-usage`（目标法域立法惯用）> `fallback`（无官方对应，自定）
- 术语表填完后**不要动条文**——术语表建设与条文翻译是两个独立任务

**可选工具**（术语抽取，供人工筛选）：`_work/trans/extract-terms.py`（语料后缀规则抽取）+
`_work/trans/terms-inventory.py`（按领域整理的中国法律术语清单，含语料频次验证）。

---

## 2. 你必须交付什么（回执包）

```
CALR-TRANS-<JOBID>-RETURN/
├── receipt.json           总回执（覆盖度自证，见 §2.1）
├── returns/
│   ├── <lawId>.<shardId>.json     译文分片（结构见 §2.2）
│   └── …
├── glossary-additions.json        你新确立的术语（见 §2.3）
└── unresolved.json                未决项汇总（见 §2.4）
```

### 2.1 `receipt.json` — 覆盖度自证（★ 缺此项视为未交付）

```jsonc
{
  "formatVersion": "calr-trans-v2",
  "jobId": "BN-TH-2026-10-11-001",
  "targetLang": "th",
  "provenance": {
    "engine": "llm",                    // ★ llm | mt | human | official
    "model": "deepseek-chat",           // ★ 实际模型名，不要写"AI"；engine=official 时可省略/为 null
    "promptVersion": "calr-trans-v2",
    "translatedAt": "2026-10-11",       // YYYY-MM-DD
    "reviewed": "machine",              // machine | hybrid | human
    "sourceDocument": {                 // ⭕ 仅 engine=official：记录官方译本出处
      "file": "民法典英文版....pdf", "sha256": "sha256:…", "pages": 229
    }
  },
  "coverage": [
    {
      "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT",
      "sourceSha256": "…",              // ★ 与任务包逐字一致，用于证明没拿错源
      "sourceArticleCount": 442,        // ★ 与任务包一致
      "returnedArticleCount": 442,      // ★ 必须相等
      "shards": ["001", "002", "003"],  // ★ 覆盖任务包 shards 的全部 shardId
      "missingNos": [],                 // ★ 必须为空数组
      "extraNos": [],                   // ★ 必须为空数组
      "unresolvedCount": 3
    }
  ]
}
```

`missingNos` / `extraNos` **非空即整批退回**——这是入库方判定"漏条/串条"的唯一依据。

### 2.2 `returns/<lawId>.<shardId>.json` — 译文分片

```jsonc
{
  "formatVersion": "calr-trans-v2",
  "jobId": "BN-TH-2026-10-11-001",
  "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT",
  "shardId": "001",
  "sourceLang": "en",
  "targetLang": "th",
  "provenance": { "engine": "llm", "model": "deepseek-chat",
                  "promptVersion": "calr-trans-v2",
                  "translatedAt": "2026-10-11", "reviewed": "machine",
                  "glossaryVersion": "2026-10" },
  "articles": [
    {
      "no": 1,                                  // ★ 与原文完全一致
      "noLabel": { "th": "มาตรา 1" },            // ⭕ 目标法域条号习惯写法
      "heading": { "th": "…" },                  // ⭕ 原文有 heading 才写，没有就整个省略
      "text": { "th": "…" }                      // ★ 键必须是 targetLang；分段用 \n\n
    }
  ]
}
```

**逐字段约束**

| 字段 | 必填 | 约束 |
| :--- | :---: | :--- |
| `formatVersion` | ✅ | 固定 `calr-trans-v2` |
| `jobId` / `lawId` / `shardId` | ✅ | 必须能在任务包里找到 |
| `targetLang` | ✅ | 必须等于 `manifest.targetLang` |
| `provenance.model` | ✅ | 具体模型标识 |
| `articles[].no` | ✅ | 整数；与原文同号；**不得新增、删除、重排、改号** |
| `articles[].text.<targetLang>` | ✅ | 非空字符串；语言键**必须**是 `targetLang` |
| `articles[].noLabel` | ⭕ | 有则写，无则省略 |
| `articles[].heading` | ⭕ | **原文有才写**；原文没有而译文自造标题 = 红线 |
| `articles[].chapter` | ⭕ | 原文有才写 |
| 其他字段 | ❌ | 不要加。不要加 `confidence`、`note`、`alt`、`explanation` 之类 |

### 2.3 `glossary-additions.json` — 你新增的术语

```jsonc
{
  "glossaryVersion": "2026-10",
  "targetLang": "th",
  "additions": [
    { "src": "Syariah Court", "tgt": "ศาลชะรีอะฮ์ (Syariah Court)",
      "authority": "fallback",
      "reason": "目标法域无官方对应机构，按 §4.5 采用「译名（原文）」格式",
      "firstSeenAt": { "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT", "no": 12 } }
  ]
}
```

**用途**：入库方会把这份表合并进项目术语表，**再交给你或下一个 agent 时作为强制术语**。
所以：**同一术语在不同分片、不同法规里必须同名**。分片之间不一致 = 退回。

### 2.4 `unresolved.json` — 未决项汇总

```jsonc
{
  "formatVersion": "calr-trans-v2",
  "jobId": "BN-TH-2026-10-11-001",
  "items": [
    {
      "lawId": "BN-CAP-22-2021-E-PENAL-CODE-ACT",
      "no": 57,
      "span": "the amount of $10,000",
      "reason": "源文本该处为 OCR 残损，金额数字形态可疑（`S10,OOO`），无法确定币种与数值",
      "action": "keptSource",            // keptSource | inlineMarker
      "text": "…{{UNRESOLVED:1}}…"        // 仅 action=inlineMarker 时给
    }
  ]
}
```

---

## 3. 硬性格式规则（可机检；违反任一 = 整批退回）

| # | 规则 |
| :--- | :--- |
| **R1** | 回执必须是**合法 UTF-8 JSON**，无 BOM；不得用 Markdown 代码块包裹后混在说明文字里交付 |
| **R2** | 每一部法的 `returnedArticleCount` 必须**等于** `sourceArticleCount` |
| **R3** | `articles[].no` 集合必须与原文**完全相等**（允许原文跳号；你也照抄跳号，**不得补号**） |
| **R4** | `articles[].no` 在分片内**升序**，且分片间**不重叠、不留缝** |
| **R5** | `text` 的语言键**必须**是 `targetLang`，**绝不得**是 `en`/`zh`/`orig` 等 |
| **R6** | `text[targetLang]` **非空**；不得为 `null`、`""`、"待补"、"（略）"、"……"、"N/A" |
| **R7** | 不得出现以下**截断/占位**字样：`……`、`(略)`、`（略）`、`待补`、`TODO`、`TBD`、`[待译]`、`<...>` |
| **R8** | 不得在译文中写免责/说明话术（如"以上由 AI 生成""仅供参考""本译文不构成法律意见"）。免责由界面统一呈现 |
| **R9** | 不得新增/删除/合并/拆分条文；不得把两条并成一条，也不得把一条拆成两条 |
| **R10** | 不得改动 `no`、`noLabel` 的数字部分、日期、金额、比例、期限、法案编号、案号 |
| **R11** | 术语表中出现的 `src`，全文必须一律用其 `tgt`（**术语一致性**，跨分片、跨法规都要一致） |
| **R12** | 不得把源国法律概念直接等同于目标国概念；无官方对应时按 §4.5 加原文括注 |
| **R13** | 情态动词按 §4.6 映射，**不得互换**（shall / may / must / shall not / should 各有固定对译） |
| **R14** | 单文件 ≤ 2 MB；单文件 `articles` ≤ 200 条；超限必须分片 |
| **R15** | 输出**只能**是 `targetLang`；除 JSON 字段名、`[[UNRESOLVED:…]]` 标记、术语原文括注外，不得混入其他语言 |
| **R16** | 必须回传 `sourceSha256`（与任务包逐字一致）——证明你译的是给定的那份源，没有串包 |
| **R17** | `missingNos` 与 `extraNos` 必须是**空数组** |
| **R18** | `unresolved.json` 必须存在（可以为空 `items: []`），且其中每个 `no` 必须在对应回执里真的有一条 `action` |
| **R19** | 不得改动任务包 `laws/*.json` 的任何内容；不得把这些文件混进回执包 |
| **R20** | 交付前必须自跑 `node tools/verify-trans-return.js <回执包目录>` 并**通过**；回执里附上命令输出 |
| **R21** | `chapter`/`heading` 的层级分隔符只能是 **U+3000（全角空格）**，最多 2 个（对应最多 3 级）；**每段必须以合法层级词开头且层级顺序递增**；**标题内不得含 U+3000 或连串空格**（源文的对齐填充必须还原）——§4.11.2 |
| **R22** | 层级对应词与编号形式固定：**`Book`+英文序数词（编）/ `Part`+英文序数词（分编）/ `Chapter`+罗马数字 / `Section`+阿拉伯数字 / `Article`+阿拉伯数字**；**不得用 `Title`/`Volume`，不得把「编」写成 `Part`**——§4.11.1 |
| **R23** | 拼写体系按**任务包 `manifest.spelling` 声明**（`en-US` \| `en-GB`）判定，未声明则不判定；不得在同一 job 内混用两种体系——§4.11.3 |
| **R24** | `provenance.model` 必须是**确切模型标识**，且**同一 `jobId` 内所有分片完全相同**——§4.11.6 |
| **R25** | 术语 `multiSense: true` 时必须按 `domain` 选义项；选不准走 §4.8 上报，不得含糊套用——§4.11.5 |
| **R26** | 日期：元数据字段保留 ISO `YYYY-MM-DD`；**条文正文内日期译为目标语言格式且日/月/年数值不变**——§4.11.4 |
| **R27** | `chapter.en`/`heading.en` **只在源有对应 `chapter.zh`/`heading.zh` 时才写**；源没有而自造 = 红线 |
| **R28** | `glossary.json` 中 `status: "confirmed"` 的术语必须 100% 命中且用其 `tgt`；`status: "pending"` 的术语必须自建译名并**逐条登记 `glossary-additions.json`** |

---

## 4. 翻译规则（对你原始 10 条的修订版）

> 你给的 10 条总体是对的，但有 6 处落到本项目会出问题。修订如下，
> **加粗**处是对原始版本的实质改动。逐条对照见 §8。

### 4.1 只译不改
只翻译，不解释、不总结、不评论、**不做合规提示**、不添加原文没有的内容。

### 4.2 结构逐级保留
编、章、节、条、款、项、目、标题、但书、附件、表格、脚注、编号、括号、引用层级**全部保留**。
原文用 `\n\n` 分段，译文**分段数必须相同**（分段可机检：`\n\n` 个数相等）。

### 4.3 不译项（**新增，原文未规定**）
以下内容**原样保留，不翻译**：条文编号数字、法案编号（`CAP. 39`、`S 92/2006`）、
案号、货币代码、条款交叉引用编号（`section 12(3)` 中的数字）。
其**外围词**按目标语言译（`Section 12(3)` → `มาตรา 12(3)`）。
**日期分两种**：元数据字段保留 ISO `YYYY-MM-DD`；**条文正文内的日期要译**为目标语言格式
（英式 `4 December 1982`），数值不得改动 —— 详见 §4.11.4。

### 4.4 术语一致
优先：① 任务包 `glossary.json` → ② 目标法域**官方术语** → ③ 目标法域官方**译本**用语 →
④ 目标法域法律文本**惯用译法** → ⑤ 无对应则走 §4.5。
**同一术语全文一致**；你新定的术语写入 `glossary-additions.json`。

### 4.5 无对应概念（**细化原文第 5 条**）
采用 `目标语言译名（源语言原文）` 格式。**只在每个法规内首次出现时加括注**，
之后仅用译名；若同一术语在不同法规中首次出现，各法规内各加一次。
并**必须**同时登记到 `glossary-additions.json`。

> 反例（错）：全文每次都写 `ศาลชะรีอะฮ์ (Syariah Court)` → 译文臃肿且不像法律文本。
> 正例：首次 `ศาลชะรีอะฮ์ (Syariah Court)`，其后仅 `ศาลชะรีอะฮ์`。

### 4.6 情态动词（**按目标法域立法习惯，而非逐词对齐**）
源语言的规范效力差异**必须保持**，但**对译词按目标法域立法习惯选**：

| 源（en） | 效力 | 目标（zh） | 目标（th） | 目标（vi） | 目标（id/ms） |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `shall` | 强制 | 应当 | ต้อง | phải | wajib |
| `must` | 强制（更强/条件前置） | 必须 | ต้อง | phải | harus |
| `shall not` | 禁止 | 不得 | ต้องไม่ | không được | dilarang |
| `may` | 授权/裁量 | 可以 | อาจ | có thể | boleh |
| `may not` | 不作为的授权 | 可以不 / 不得（按语境） | อาจไม่ | có thể không | boleh tidak |
| `should` | 建议（立法文本罕见） | 宜 / 应当（按目标法域惯例） | ควร | nên | sebaiknya |

> **注意**：`should` 在立法文本中通常不出现；若源文出现 `should`，
> 说明该文本可能是**指南/建议性文件**而非强制性法律，**必须在 `unresolved.json` 报告**，
> 不要擅自按 `shall` 处理。
> 目标语言不在上表时，**不要猜**：在 `unresolved.json` 报告并保留源语情态动词。

### 4.7 不做跨法域等同
不得把源国概念直接等同于目标国概念，除非术语表或官方译本明确指定。
例：`Syariah Court` ≠ 目标国的"宗教法庭"；`Chief Executive Officer`（文莱特定职位）≠ 通用 CEO。

### 4.8 歧义处理（**改动原文第 8 条**）
遇到歧义、缺术语表、源文残损：
1. **优先**：该条正文**保留源语言原样**，并在 `unresolved.json` 记 `action: "keptSource"`；
2. **仅当**歧义只涉及**一个短语**时，才用内联标记 `[[UNRESOLVED: 原因]]`，
   同时**必须**在 `unresolved.json` 记 `action: "inlineMarker"`。

> **为什么**：`[[UNRESOLVED: …]]` 会直接显示给最终用户；整条无法翻译时留着它
> 会让整条看起来是残的。结构化上报更可控。**绝不猜测**。

### 4.9 输出语言纯净
输出必须是目标语言。除 JSON 字段名、`[[UNRESOLVED:…]]` 标记、术语原文括注外，
不得混入其他语言。**专有名词（人名、地名、机构名）按目标法域惯例音译或保留原文**，不违规。

### 4.10 多官方语言
目标国家有多个官方语言时（见 §5），**按 `manifest.targetLang` 只译一种**，
一次任务一个目标语言，**不得混合**。同一批数据需要多语言时，会拆成多个 jobId 分别下发。

### 4.11 ★ 结构与用词统一约定（**跨分片一致性的强制标准**）

> **适用范围**：§4.11.1 / §4.11.2 / R21 / R22 / R27 是为**中文法律的层级结构**量身定的，
> **只适用于 `manifest.sourceLang === "zh"`（中译外）的任务**。
> 非中文源语言（如英译泰）时，层级对应词随**源文自身的层级体系**与**目标法域惯例**处理，
> 校验器不做强制（此时 §4.11.1 的对应表仅供参考）。
> **§4.11.3 拼写、§4.11.6 model 一致性、§4.11.7 机构名** 对**所有**任务都适用。

> **为什么必须有这一节**：并行分片翻译时，各 agent 会各自发明一套写法。
> 实测教训：民法典 9 个分片里出现 `Book Two Property, Chapter VIII` 与
> `Part Two Real Rights　Chapter VIII` 两套编名、罗马数字与阿拉伯数字混用章号、
> `organisation` 与 `organization` 混用。**同一部法内就会自相矛盾。**
> 以下约定是**硬性的**，违反按 §8 红线退回。

#### 4.11.1 中国法律层级 → 目标语言对应词（以英语为例，其他语言按 §5 类推）

| 中文层级 | 英文对应词 | 编号形式 | 示例 |
| :--- | :--- | :--- | :--- |
| 编 | **`Book`** | **英文序数词**（One/Two/Three…） | `Book Two Real Rights` |
| 分编 | **`Part`** | 英文序数词 | `Part Five Possession` |
| 章 | `Chapter` | **罗马数字**（I/II/III…） | `Chapter XX Possession` |
| 节 | `Section` | **阿拉伯数字** | `Section 1 General Rules` |
| 条 | `Article` | 阿拉伯数字 | `Article 458` |
| 款 | `paragraph` | 小写，正文内引用 | `paragraph 2 of this Article` |
| 项 | `subparagraph` | 小写 | `subparagraph (a)` |
| 目 | `item` | 小写 | `item (i)` |

**禁止同义词替换**：`Book` 不得写成 `Title` / `Volume` / `Part`（`Part` 专用于**分编**）；
`Section` 不得写成 `Article`（节与条必须区分）。**同一部法内必须完全一致**。

> **本表以《中华人民共和国民法典》官方英译本的实际用法为准**（按 §4.4「官方术语优先」）。
> 实测该官方译本用 **`Book One`**（而非 `Part One`）表示「编」，用 **`Part One…Part Five`** 表示「分编」
> —— 如第二编物权下分 `Part One General Provisions` … `Part Five Possession`。

> ⚠ **层级数量要与原文一致**：本项目 `laws/` 的 `articles[].chapter.zh` **只记到「章/节」，不含「分编」**
> （实测民法典 1,260 条：编 1,056 / 章 1,260 / 节 357，分编 0）。
> 为保证阅读器「原文＋译文」两侧层级对齐，**`chapter.en` 也按「编＋章（＋节）」三级书写**。
> 官方译本里额外的「分编」信息**不要塞进 `chapter.en`**，否则译文层级会多于原文、两侧错位。

#### 4.11.2 `chapter.en` / `heading.en` 的书写格式（可机检）

```
单层章        Chapter <罗马数字> <章标题>
章 + 节       Chapter <罗马数字> <章标题>　Section <阿拉伯数字> <节标题>
编            Book <序数词> <编标题>
编 + 章       Book <序数词> <编标题>　Chapter <罗马数字> <章标题>
编 + 章 + 节  Book <序数词> <编标题>　Chapter <罗马数字> <章标题>　Section <阿拉伯数字> <节标题>
（若原文含分编）Book <序数词> <编标题>　Part <序数词> <分编标题>　Chapter <罗马数字> <章标题>　Section <…>
```

**硬规则**：

1. **层级之间用 U+3000（全角空格）分隔**，层级数最多 3 级（编/分编 + 章 + 节），
   因此 **U+3000 最多 2 个**。**每个被分隔出的段必须以合法层级词开头**
   （`Part` / `Sub-part` / `Chapter` / `Section` / `Article`），且**层级顺序必须递增**
   （编 → 分编 → 章 → 节）。**不得**用逗号、顿号、`>`、`-` 等分隔层级。
2. **标题内不得残留 U+3000 或连串空格**。源文用它们做对齐填充
   （例如源 `第一章 总　　则`、`第六章 执　　行`），译文必须还原为干净标题
   （`Chapter I General Provisions`、`Chapter VI Enforcement`）。
3. 源 `chapter` 字段本身可能是嵌套的（实测：源文里 `第N章 …　第M节 …` 已用 U+3000 连接），
   **照其层级结构翻译**，不得拆成两条，也不得把「节」提升为「章」。
4. **源没有 `chapter.zh` 就不要写 `chapter.en`**；源没有 `heading.zh` 就不要写 `heading.en`。
   **自造标题 = 红线**。

#### 4.11.3 拼写与数字格式

**拼写体系由任务包 `manifest.spelling` 声明**（`en-US` 或 `en-GB`），**不得全库统一**：

> **实测依据**：《中华人民共和国民法典》**官方英译本**用 **美式**（`organization` / `authorization` / `center`）；
> 而文莱、新加坡等普通法法域的官方文本用**英式**（`organisation` / `authorisation` / `centre`）。
> 二者都是"官方"，故必须以 job 为单位声明。

| 项 | 约定 |
| :--- | :--- |
| `spelling: "en-US"` | `organization` `recognize` `authorization` `defense` `center` `fulfillment` |
| `spelling: "en-GB"` | `organisation` `recognise` `authorisation` `defence` `centre` `fulfilment` |
| 未声明 | 校验器**不判定拼写**，仅提示应在 `manifest` 里声明 |
| 千分位 | 逗号：`1,000,000` |
| 小数点 | `.`：`3.5%` |
| 百分比 | `50%`（数字与 `%` 之间无空格） |
| 罗马数字 | 章号用大写罗马数字：`Chapter IV`（**不是** `Chapter 4`） |
| 条内编号 | 阿拉伯数字：`Article 12(3)`（**保持源文的括号层级**，不得改写成 `Article 12.3`） |
| 序号列举 | `(a) (b) (c)` / `(i) (ii) (iii)`，与源文 `（一）（二）`/`1. 2.` 层级对应 |

#### 4.11.4 日期的两种处理（**区分元数据与正文**）

| 位置 | 处理 |
| :--- | :--- |
| **元数据字段**（`promulgatedDate` / `effectiveDate` / `versionDate` 等） | **原样保留 ISO 格式** `YYYY-MM-DD`，不译 |
| **条文正文内的日期文本**（如「1982年12月4日」） | **译为目标语言惯例格式**，数值不得改动：英式 `4 December 1982` |

> 这是对 §4.3「不译项」的**精确化**：日期在元数据里是数据、在正文里是文本。
> 正文里的日期必须译，但**日/月/年三个数值一个都不能变**。

#### 4.11.5 多义词的领域选择（`domain`）

`glossary.json` 的每个术语带 `domain` 标签。**同一 `src` 在不同 `domain` 下可以是不同译名**，
你必须**按当前条文所属领域选义项**：

| `src` | `domain` | 正确译名 | 常见误译 |
| :--- | :--- | :--- | :--- |
| 试用期 | 劳动与社会保障 | `probation period` | 买卖合同里误用 probation |
| 试用期 | 民法-合同 | `trial period` | 劳动法里误用 trial |
| 承诺 | 民法-合同 | `acceptance` | 悬赏/担保语境误用 acceptance |
| 承诺 | 民法-总则 | `promise` / `undertake` | — |
| 许可 | 知识产权 | `licence` | 行政许可误用 licence |
| 许可 | 行政法 | `administrative licence` | — |
| 保证 | 民法-物权 | `suretyship` | 一般担保语境误用 suretyship |
| 保证 | 民法-合同 | `guarantee` | — |
| 执行 | 民事诉讼 | `enforcement` | 行政执行误用 enforcement |
| 执行 | 行政法 | `administrative execution` | — |

**选不准时**：走 §4.8 → `unresolved.json` 记 `reason: "术语义项无法确定：<term> 在 <domain> 下"`，
**不得含糊套用其中一个**。

#### 4.11.6 `provenance.model` 必须精确且批次内一致

- 必须写**确切模型标识**（如 `deepseek-chat` / `deepseek-v3.2`），不得写 `AI`、`llm`、`模型`
- **同一 jobId 内所有分片必须写完全相同的字符串**
  （实测事故：同一批里出现 `deepseek-flash` 与 `deepseek-v3.2 (deepseek-flash)` 两种写法，
  校验器报警告、入库后无法按模型追溯）
- 同一批次用了多个模型时，**拆成不同 jobId**，不要混在一个回执包里

#### 4.11.7 机构名与专有名词

1. **目标语言已有官方定名的，一律用官方定名**（例：全国人民代表大会 = `National People's Congress`；
   最高人民法院 = `Supreme People's Court`）。**已在官方译本中固定的，不再加中文括注**。
2. **无官方定名的中国特有机构/概念**，按 §4.5 用「译名（中文原文）」格式，
   **且只在该法规内首次出现时加括注**，其后仅用译名。
3. **同一机构在同一法规内必须同名**；跨分片时，若该机构出现在多个分片，
   **每个分片各自首次出现处加一次括注**（分片是独立交付单元），但译名必须完全一致。

---

## 5. 目标语言与法域对照表

| 国家/法域 | 代码 | 官方语言 | 本项目语言代码 | 界面语言已支持？ |
| :--- | :--- | :--- | :--- | :---: |
| 中国 | CN | 汉语 | `zh` | ✅ |
| 越南 | VN | 越南语 | `vi` | ✅ |
| 泰国 | TH | 泰语 | `th` | ✅ |
| 印度尼西亚 | ID | 印尼语 | `id` | ✅ |
| 马来西亚 | MY | 马来语（另有英语） | `ms` / `en` | ✅ |
| 新加坡 | SG | 英语、马来语、华语、泰米尔语 | `en` / `ms` / `zh` / `ta`⚠ | 部分 |
| 菲律宾 | PH | 菲律宾语、英语 | `fil`⚠ / `en` | 部分 |
| 文莱 | BN | 马来语（英语通用） | `ms` / `en` | ✅ |
| 柬埔寨 | KH | 高棉语 | `km` | ❌ **尚未实现** |
| 老挝 | LA | 老挝语 | `lo` | ❌ **尚未实现** |
| 缅甸 | MM | 缅甸语 | `my` | ❌ **尚未实现** |
| 东帝汶 | TL | 葡萄牙语、德顿语 | `pt` / `tet`⚠ | ❌ |

⚠ = 本项目尚未定义该语言代码，需先与入库方确认再加。
❌ = 译文**可以入库**（译文层不限语言），但**界面无法作为界面语言展示**，
需先补 `prototype/data/i18n-<code>.js` 才能让用户在阅读器里切到该语言。
**这不是你不能译，而是入库方要提前知道的事**——照译即可。

---

## 6. 本项目特有问题与处置（**这段是你原提示词里完全没有的**）

### 6.1 源文本可能带 OCR 噪声

本项目 **1,186 部法规**的正文来自扫描件 OCR（`textQuality` 为
`ocr-scanned` / `ocr-windows-zh-Hans` / `official-pdf-ocr-*`）。
这批文本**本身就有字符级误差**（形近字、粘连、大小写、`0/o`、`l/1`）。

**你必须**：
1. 读任务包里的 `textQuality`；非 `clean` 时提高警惕；
2. **不要**"顺手修正"原文再翻译——你译的是给定的那份文本；
3. 遇到**因 OCR 导致语义不可确定的**地方（尤其**金额、期限、比例、条号**），
   一律走 §4.8 → `unresolved.json`，**绝不猜数字**；
4. 在 `receipt.json` 的 `coverage[]` 里如实填写 `unresolvedCount`。

> 这一条是**本项目最重要的特殊要求**：法律数据里一个错数字比一句蹩脚译文严重得多。

### 6.2 条号可能重复或跳号

本项目 **325 部法规存在重复条号**（合计 2,985 个），且部分法规跳号。
**你照抄源数据的条号序列**，重复就重复、跳号就跳号。
**不要**去重、不要补号、不要重排。`no` 是入库对齐的唯一锚点。

### 6.3 可能存在空条文

极少数法规有条号为空的条目。遇到时：`text` 保留**原文语言**，
`unresolved.json` 记 `reason: "源条文正文为空"`。**不要自己写一句占位**。

### 6.4 超长法规

本项目最大单法 **1,079 条**。必须按 `manifest.items[].shards` 分片回传（§1.2）。
分片之间术语必须一致 —— 建议**先通读全书生成术语表**，再逐片翻译。

### 6.5 一部法的标题与正文可能语言不同

部分法规 `title` 与 `countryName` 是中文（编目语），而 `articles[].text` 是英文（原文）。
**只译 `articles` 与 `sourceTextLang` 为源语言的字段**；
`title` 若已是目标语言则原样保留，若是第三种语言则按 §4.9 处理并在回执中说明。

---

## 7. 交付前自检清单（**必须逐项执行，并把结果写进 `receipt.json` 的 `selfCheck`**）

```bash
# 1) 结构校验（入库方的同一个校验器，你先自跑）
node tools/verify-trans-return.js <回执包目录>
#    必须输出「校验结果：全部通过」，退出码 0

# 2) JSON 合法性
python -c "import json,glob;[json.load(open(f,encoding='utf-8')) for f in glob.glob('**/*.json',recursive=True)]"

# 3) 条数对账（抽样或全量）
#    逐法比对 returnedArticleCount == sourceArticleCount
```

| # | 自检项 | 判据 |
| :--- | :--- | :--- |
| C1 | `verify-trans-return.js` 通过 | 退出码 0 |
| C2 | 每部法条数相等 | `returnedArticleCount == sourceArticleCount` |
| C3 | `missingNos` / `extraNos` 均空 | `[]` |
| C4 | 无 R7 占位字样 | 全文 grep 无命中 |
| C5 | 无 R8 免责话术 | 全文 grep 无命中 |
| C6 | 所有 `text` 键 === `targetLang` | 逐条检查 |
| C7 | 分段数与原文一致 | `\n\n` 计数相等 |
| C8 | 术语表 100% 命中且一致 | 逐术语 grep |
| C9 | `unresolved.json` 与回执一致 | 每个 `no` 都能对上 |
| C10 | `sourceSha256` 与任务包一致 | 逐字比对 |
| C11 | **层级分隔符合规** | `chapter`/`heading` 按 U+3000 分段后：段数 ≤3、每段以 `Part\|Sub-part\|Chapter\|Section\|Article` 开头、层级顺序递增；标题内无连串空格（R21） |
| C12 | **层级对应词与编号形式合规** | 正则检查 `Part [A-Z][a-z]+` / `Chapter [IVXLC]+` / `Section \d+`；无 `Book`/`Title`（R22） |
| C13 | **拼写体系一致** | 全文不出现 `organization`/`recognize`/`defense`/`center`/`judgement`（R23） |
| C14 | **`provenance.model` 批内一致** | 所有分片同一字符串（R24） |
| C15 | **`confirmed` 术语 100% 命中** | `tools/verify-glossary.js` + 逐术语 grep |
| C16 | **`pending` 术语已登记** | `glossary-additions.json` 条数 ≥ 实际遇到的 pending 术语数（R28） |
| C17 | **多义项术语按 domain 取义** | 抽样核对「试用期/承诺/许可/保证/执行」等（R25） |

`receipt.json` 里追加：

```jsonc
"selfCheck": {
  "ranAt": "2026-10-11T20:00:00+08:00",
  "command": "node tools/verify-trans-return.js CALR-TRANS-...-RETURN",
  "result": "全部通过",
  "exitCode": 0,
  "C1": true, "C2": true, "C3": true, "C4": true, "C5": true,
  "C6": true, "C7": true, "C8": true, "C9": true, "C10": true
}
```

---

## 8. 红线（违反任一 = 整批退回，不协商）

1. 漏条、多条、串条、改号、重排（R2/R3/R4/R17）。
2. 译文语言键写错（写成 `en`/`zh`/`orig`）或译文为空/占位（R5/R6/R7）。
3. 把官方原文改写了再译，或把译文写回原文层（R19）。
4. 在译文里写免责话术或译注（R8）。
5. **猜测**数字、金额、期限、比例、机构名（§6.1）。
6. **跨分片写法不一致**：编/章/节对应词不同（`Part` vs `Book`）、章号形式不同（`Chapter IV` vs `Chapter 4`）、
   层级分隔符不同（U+3000 vs 逗号）、拼写体系混用（美式 vs 英式）、`provenance.model` 不同写法（§4.11）。
7. **自造 `chapter`/`heading`**（源无而译文有）（R27）。
8. **`confirmed` 术语未用其 `tgt`**，或 `pending` 术语未登记（R28）。
9. **多义项术语含糊套用单一译名**，未按 `domain` 取义（R25）。
6. 术语前后不一致（R11）。
7. 交付物里混入解释性文字、Markdown 代码围栏套 JSON、或多语言混杂（R1/R15）。

---

## 9. 附：与你原始提示词的逐条对照

| 你的原文 | 本项目的问题 | 本 SKILL 的处置 |
| :--- | :--- | :--- |
| 1 只翻译不解释 | ✅ 可直接用 | §4.1 保留，并**增加"不做合规提示"** |
| 2 严格保留结构 | ✅ 方向对，但**不可机检** | §4.2 增加**可机检判据**（分段数相等） |
| 3 保留日期/金额/编号 | ✅ 但**没说到底译不译** | **新增 §4.3「不译项」白名单**：数字保留、外围词翻译 |
| 4 术语一致 | ✅ 但**没有术语表载体** | **新增 `glossary.json` 强制输入 + `glossary-additions.json` 强制输出**，形成闭环 |
| 5 译名（原文）格式 | ⚠ **没说用几次** → 全文会臃肿 | §4.5 **限定为每法规首次出现加括注** |
| 6 情态动词不互换 | ⚠ **没给对译表** → agent 只能猜 | **新增 §4.6 五语言情态动词对照表**；目标语言不在表内 → 上报，不猜 |
| 7 不做跨法域等同 | ✅ 可直接用 | §4.7 保留 + 举例 |
| 8 保留原文 + `[[UNRESOLVED]]` | ⚠ **内联标记会污染用户可见正文** | §4.8 **改为"整条保留源语 + 结构化 `unresolved.json`"，内联标记仅限短语** |
| 9 输出必须目标语言 | ✅ 可直接用 | §4.9 保留 + **明确专有名词音译不算违规** |
| 10 多官方语言分译 | ✅ 可直接用 | §4.10 保留 + **新增 §5 国别语言对照表**（含本项目代码与界面支持状态） |
| — | ❌ **完全没有输出格式定义** | **新增 §2 回执契约 + §3 二十条机检规则** |
| — | ❌ **没有来源核验机制** | **新增 `sourceSha256` 与 `receipt.coverage` 覆盖度自证** |
| — | ❌ **没有分片协议** | **新增 §1.2 分片 + R14** |
| — | ❌ **没考虑源文本本身有噪声** | **新增 §6.1（本项目 1,186 部 OCR 文本）** |
| — | ❌ **没说明免责声明放哪** | **新增 R8：免责由界面呈现，译文文件只放正文** |
| — | ❌ **没有术语表建设阶段** | **新增 §1.3（schema v2）与 §1.4 Phase 0；`tools/verify-glossary.js`** |
| — | ❌ **未处理同一术语的多义项** | **新增 `domain` + `sense` + `multiSense`；§4.11.5 + R25** |
| — | ❌ **未约定结构与拼写** | **新增 §4.11（层级对应词/编号形式/分隔符/拼写/日期/机构名）；R21–R27** |
| — | ❌ **未约定模型标识写法** | **新增 §4.11.6 + R24（同一 jobId 内 model 必须一致）** |

---

## 9.1 版本变更记录

### `calr-trans-v2.2`（2026-10-15）—— 依《民法典》官方英译本校正

用户提供《中华人民共和国民法典》官方英译本（229 页 / 1,260 条），已入 D 译文层
（`prototype/data/trans/cn.en.js`，`engine: "official"`）。**该官方译本推翻了本 SKILL 的两条自定惯例**，
故据官方用法校正（§4.4「官方优先」）：

| 项 | v2.1 的错误惯例 | 官方译本实际用法 | 本版处置 |
| :--- | :--- | :--- | :--- |
| 「编」的英文 | `Part`（且禁止 `Book`） | **`Book One`** | §4.11.1/R22 改为 **编=`Book`、分编=`Part`** |
| 拼写体系 | 统一**英式** | **美式**（`organization`/`authorization`/`center`） | §4.11.3/R23 改为**由 `manifest.spelling` 按 job 声明**（`en-US`/`en-GB`）|
| 官方译本入库 | 未定义 | `engine: official`，无 model | §2.1 增加 `official` 取值与 `sourceDocument` 字段 |
| 层级词顺序 | `Part→Chapter→Section` | `Book→Part→Chapter→Section` | 校验器 `ORDER` 同步更新 |

**同时新增的实测知识**：

- 该项目 `laws/` 的 `articles[].chapter.zh` **只记到「章/节」，不含「分编」**（实测民法典 1,260 条：
  编 1,056 / 章 1,260 / 节 357，分编 0）。故 `chapter.en` 也按「编＋章（＋节）」三级书写，
  **官方译本里额外的「分编」不要塞进 `chapter.en`**，否则译文层级多于原文、阅读器两侧错位。
- 中文 `chapter.zh` 里 **U+3000 既作层级分隔、也作标题内对齐填充**（如 `第七章 代　　理`）。
  解析时必须"只对以 `第N编/章/节` 开头的片段开启新层级"，否则会把「代理」拆成「代」「理」。
- 官方译本 PDF 自身的结构标记有变体（`Chapter XX.` 带句点），解析正则须容忍尾随句点。
- 官方英译本已作为**权威术语来源**回填术语表：抽取 113 个编/章/节标题对照，
  术语表 `glossary-en.json` 由 227 → **270 条 `authority: official`**（共 858 条）。

### `calr-trans-v2.1`（2026-10-14）—— 放量前的一致性加固

依据**第一次并行试译（宪法 + 民法典 7 片 + 公司法，共 1,343 条，9 个分片）**的实测问题修订。
那批成稿经本版校验器回测，报出 **1,203 条不一致**，全部属下列三类，故**未留在 D 层**：

| 实测问题 | 具体表现 | 本版处置 |
| :--- | :--- | :--- |
| **编名不统一** | 同为民法典物权编，分片 003/005 写 `Book Two Property`，002/004/008 写 `Part Two Real Rights` | §4.11.1 固定 `Part`；R22 禁止 `Book`/`Title`/`Volume` |
| **编号形式不统一** | 分片 006 写 `Chapter 15`，003/005 写 `Chapter XV` | §4.11.1 固定章号用**罗马数字**；R22 |
| **层级分隔符不统一** | 部分用 U+3000，部分用 `, ` | §4.11.2 固定 **U+3000，最多 2 个，每段必须以合法层级词开头且顺序递增**；R21 |
| **拼写体系不统一** | `organization`（003）vs `organisation`（其余 6 片） | §4.11.3 统一**英式**；R23 |
| **`provenance.model` 不统一** | `deepseek-flash` vs `deepseek-v3.2 (deepseek-flash)` | §4.11.6 + R24（同一 jobId 内必须完全一致） |
| **术语表撑不住** | 民法典核心术语（融资租赁合同/保理合同/承揽合同…）不在 161 条表内，6 个 agent 各自定译名 | §1.4 Phase 0 强制先建表；术语表扩至 **799 条** |
| **多义词被误套** | `试用期`（买卖 ≠ 劳动）、`承诺`（悬赏 ≠ 承诺）、`许可`（行政 ≠ IP）、`保证条款`（保证合同 ≠ warranty） | §1.3 加 `domain`/`sense`/`multiSense`；§4.11.5 + R25 |
| **日期规则含糊** | 原 §4.3 说"日期保留"，但正文里的 `1982年12月4日` 到底译不译没写清 | §4.11.4 区分元数据（保留 ISO）与正文（译为目标语言格式，数值不变）；R26 |

> **本版还修正了校验器自身的两个问题**（回测时发现）：
> ① R7 原先把源文里合法的 `......`（填空线）误判为截断 → 改为**源相对判定**；
> ② R21 初版写"最多 1 个 U+3000"，与 §4.11.2 的 3 级格式自相矛盾 → 改为**最多 2 个 + 层级词与顺序校验**。

### `calr-trans-v2.0`（2026-10-11）—— 建立

首个版本，定义了任务包/回执包结构、20 条机检规则、分片协议与覆盖度自证。

---

## 10. 入库方拿到回执后做什么（让你知道格式为什么这么定）

```
1. node tools/verify-trans-return.js <回执包> --job <任务包>   ← 不过就退回
2. node _work/trans/ingest-trans.js <任务包> <回执包>
     → 按 lawId 汇总，落到 prototype/data/trans/<原分卷名>.<targetLang>.js
     → 自动更新 prototype/data/trans/manifest.js（files[] + byLaw{}）
3. glossary-additions.json → 合并进术语表，作为下一批的强制术语
4. node tools/verify-data.js        ← 必须全部通过
5. node tools/test-trans-layer.js   ← 译文层机制自测必须全部通过
6. 界面读译文：内存合并，磁盘上原文与译文始终分离
```

**关键**：入库靠的是 `lawId` + `articles[].no` 这一个二维锚点。
`no` 错一个，后面全错位。所以 §3 里条号相关的规则是最硬的。
