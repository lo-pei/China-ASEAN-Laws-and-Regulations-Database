# 数据契约与项目红线（rules/）

本目录是**给数据供给 / 翻译 agent 看的机器可校验契约**，面向"怎么做"；
给人读的治理叙事在 [docs/02-数据规范与治理.md](../docs/02-数据规范与治理.md)。

---

## 一、七份权威契约

| 契约 | 管什么 | 配套校验器 |
| :--- | :--- | :--- |
| [SKILL-条文入库与译文分离规范.md](SKILL-条文入库与译文分离规范.md) | 数据模型、条文入库、译文层物理分离、权威存储（947 行，含 2026-10-08 变更） | `node tools/verify-data.js` |
| [SKILL-多国法律文本译本生产规范.md](SKILL-多国法律文本译本生产规范.md) | 译本生产流程、回执格式、术语一致性（calr-trans-v2.2） | `node tools/verify-trans-return.js`、`node tools/verify-glossary.js` |
| [SKILL-法规标题中译规范.md](SKILL-法规标题中译规范.md) | 法规标题中译规则与来源标注（calr-title-zh-v1） | `node tools/verify-title-return.js` |
| [SKILL-法规标题英译规范.md](SKILL-法规标题英译规范.md) | 中国法规标题中→英（calr-title-en-v1） | `node tools/verify-title-return.js` |
| [SKILL-法规标题多语种规范.md](SKILL-法规标题多语种规范.md) | 跨语种 `title` 字段模型、`orig` 采集、显示规则与验收口径（上位规范；2026-10-29 由 `docs/07-标题多语种规范.md` 迁入） | `node tools/verify-title-return.js`、`node tools/verify-data-home.js`（A10） |
| [SKILL-越南语法规英译规范.md](SKILL-越南语法规英译规范.md) | 越南法规 vi→en 标题与条文（calr-vi2en-v1） | `node tools/verify-trans-return.js` |
| [SKILL-印尼语法规英译规范.md](SKILL-印尼语法规英译规范.md) | 印尼法规 id→en/zh 标题与条文（calr-id-en-v1） | `node tools/verify-trans-return.js` |

**权威版本声明**：数据契约以 `SKILL-条文入库与译文分离规范.md` 为准。
同名的旧快照 `SKILL.md`（v2.0，712 行）已归档，不再维护，两份并存时以本目录的 947 行版为准。
标题类规范的关系：中译/英译/越南语/印尼语四份是**分批翻译任务的回执契约**，
`SKILL-法规标题多语种规范.md` 是**跨语种字段模型与显示口径的上位规范**，两者互补、不合并。

---

## 二、交付前必做

```bash
node tools/verify-data.js          # 数据层一致性
node tools/verify-data-home.js     # prototype/ 自足性 A1–A11
node tools/verify-fulltext.js      # 分卷与权威存储逐条比对
node tools/test-trans-layer.js     # 译文层结构
node tools/check-i18n.js           # 界面语言键完整性
node tools/scan-forbidden2.js      # 项目红线禁用表述
node tools/verify-glossary.js      # 术语表（翻译批次后）
node tools/verify-trans-return.js  # 译文本回执（翻译批次后）
node tools/verify-title-return.js  # 标题中译回执（标题批次后）
```

前 6 条已接入 CI（`.github/workflows/data-checks.yml`）；工具索引见 [tools/README.md](../tools/README.md)。

---

## 三、六条数据红线（摘要）

1. **逐字照录**：不节选、不改写、不摘要原文。
2. **不编造**：不生成原文中不存在的内容；机器翻译必须标注引擎。
3. **来源可追溯**：每部法规必须有官方来源链接。
4. **译文与原文物理分离**：译文绝不写回原文正文。
5. **AI 辅助生成标注**：AI 生成内容必须标注「AI 辅助生成，仅供参考」。
6. **数据自足**：`prototype/` 单独拷走即可运行，不引用外部路径。

> 前 5 条见 docs/02 §八；第 6 条由 `tools/verify-data-home.js` 的 A8 项守门。

---

## 四、历史归档

[\_archive-2026-10-25/](_archive-2026-10-25/) 收纳已被取代的旧文件，**不要作为现行依据**：

| 文件 | 归档原因 |
| :--- | :--- |
| `SKILL-v2.0-旧快照.md` | `SKILL-条文入库…` 的旧版（缺权威存储变更） |
| `03-数据建设方案（与docs归档同源）.md` | 与 docs 归档同哈希，且与现行 docs/03 撞号 |
| `06-全文数据规范-v1.0.md` | 已被 SKILL v2.0 取代 |
| `00-项目需求书（原始输入）.md` | 原始需求输入，非规范 |
| `rectify01-页面调整提示词.md` | 一次性改版提示词 |
| `README-2026-10-09.md` | 旧 README（描述已不存在的 rules/data/） |
