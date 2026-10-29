# 07 · 法规标题多语种规范（Law Title Multilingual Specification）

> 版本：v1.0（2026-10-27）
> 适用范围：`prototype/data/laws/*.json` 的 `title` 字段、`cn-catalog.js` / `intl-catalog.js` 的目录层标题、以及前端搜索结果与详情页的标题呈现。
> 状态：**强制执行**。任何写入标题的脚本、批次、人工校对，均须满足本文件全部条款；不满足者视为未完成。

---

## 1. 目标与验收场景

### 1.1 目标

数据库面向 **12 个法域**（中国 + 东盟十国 + 东帝汶）与 **6 个界面语种**（zh / en / vi / th / id / ms）。
每一条法规目录，必须在**任意界面语种**下都能显示为：

```
〈当前界面语种的法规名称〉（〈该法规的原文名称〉）
```

即：主标题是「读者看得懂的译名」，括号里是「该法域官方原文」，两者缺一不可。

### 1.2 两个基准场景（验收必测）

| # | 操作 | 期望呈现 |
|---|---|---|
| A | 界面切中文 → 搜索「泰国 个人信息保护」 | `个人数据保护法（佛历2562年／2019）（พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. ๒๕๖๒）` |
| B | 界面切越南语（Tiếng Việt）→ 搜索「Hiến pháp Trung Quốc」 | `Hiến pháp nước Cộng hòa Nhân dân Trung Hoa（中华人民共和国宪法）` |

补充基准：

| # | 操作 | 期望呈现 |
|---|---|---|
| C | 界面切英文 → 搜索印尼法规 | `Personal Data Protection Law（Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi）` |
| D | 界面切印尼语 → 搜索文莱法规 | `Akta Perlindungan Data Peribadi（Personal Data Protection Order, 2013）` |
| E | 界面切泰语 → 搜索越南法规 | `รัฐธรรมนูญแห่งสาธารณรัฐสังคมนิยมเวียดนาม（Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam）` |

> 判定口径：括号内必须是**该法规所属法域的官方文本语言**，不得填英文代替（除非该法域官方语言即英文，见 §3.2）。

---

## 2. 字段模型

### 2.1 权威存储

唯一真源：`prototype/data/laws/<lawId>.json` → `title`。

```jsonc
"title": {
  "zh":   "个人数据保护法（佛历2562年／2019）",                 // 中文译名（可读、去书名号）
  "en":   "Personal Data Protection Act, B.E. 2562 (2019)",     // 英文译名
  "vi":   "Luật Bảo vệ dữ liệu cá nhân năm 2019",               // 越南语译名
  "th":   "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. ๒๕๖๒",      // 泰语译名
  "id":   "Undang-Undang Perlindungan Data Pribadi tahun 2019", // 印尼语译名
  "ms":   "Akta Perlindungan Data Peribadi 2019",               // 马来语译名
  "orig": "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. ๒๕๖๒"      // 原文（法域官方语言原文照录）
}
```

### 2.2 字段语义

| 键 | 语义 | 是否必填 | 说明 |
|---|---|---|---|
| `zh` | 中文译名 | 必填 | 简体中文，不含书名号《》，不含「中华人民共和国」等国家前缀（法域由 `country` 字段承载） |
| `en` | 英文译名 | 必填 | 英文，遵循英式拼写（organisation / recognise / centre / judgement / programme） |
| `vi` | 越南语译名 | 必填 | 越南语，带完整声调符号 |
| `th` | 泰语译名 | 必填 | 泰语，佛历年份与公历并列时用 `พ.ศ. ๒๕๖๒ (2019)` |
| `id` | 印尼语译名 | 必填 | 印尼语（Bahasa Indonesia），不是马来语 |
| `ms` | 马来语译名 | 必填 | 马来语（Bahasa Melayu），不是印尼语 |
| `orig` | 原文标题 | 必填 | 法域官方语言原文**照录**，不作任何改写；同语种时允许与 `zh`/`en`/`th`/`vi`/`id`/`ms` 等值 |

### 2.3 冗余但必要

`orig` 与某个语种键「等值」是**设计允许**的正常状态，不是冗余错误：

- 中国法的 `orig` = `zh`（原文即中文）；
- 菲律宾、新加坡、文莱（英文文本）的 `orig` = `en`；
- 泰国法的 `orig` = `th`；越南法的 `orig` = `vi`；印尼法的 `orig` = `id`；马来西亚法的 `orig` = `ms`。

保留两份的理由：`orig` 承担「无论界面切到哪种语言，括号里都要有原文」的职责；语种键承担「界面语种下的显示名」。剥离任一侧都会让呈现逻辑退化。

### 2.4 禁止的旧形态

- `title` 为纯字符串（`"title": "仲裁法"`）→ 必须升级为对象。
- 只有 `{zh, en}` 而无 `orig` → 必须补 `orig`。
- 在 `zh` 里塞外文、在 `en` 里塞中文 → 见 §7 校验，一律判不合格。
- 用 `title.shortTitle`、`law.name` 等旁路字段存放标题 → 不允许，标题只走 `title`。

---

## 3. 语种代码与法域源语言

### 3.1 界面语种（6 个）

| 代码 | 名称 | 备注 |
|---|---|---|
| `zh` | 简体中文 | 默认界面语种，亦是中国法的原文语种 |
| `en` | 英语 | 回退语种（当前语种缺译文时优先回退英文） |
| `vi` | 越南语 | Tiếng Việt |
| `th` | 泰语 | ไทย |
| `id` | 印尼语 | Bahasa Indonesia |
| `ms` | 马来语 | Bahasa Melayu |

### 3.2 法域 → 官方文本语言（决定 `orig` 取哪种文字）

| 法域 | country | 官方文本语言 | `orig` 语种 | 备注 |
|---|---|---|---|---|
| 中国 | CN | 中文 | `zh` | 原文即 `title.zh` |
| 文莱 | BN | 马来语 / 英语 | `ms` 或 `en` | **逐部判定**：`Laws of Brunei` 英文版取 `en`；马来文 `Akta`/`Perintah` 取 `ms` |
| 印尼 | ID | 印尼语 | `id` | `Undang-Undang` / `Peraturan` |
| 柬埔寨 | KH | 高棉语 | `km` | `ច្បាប់` / `ព្រះរាជក្រឹត្យ` |
| 老挝 | LA | 老挝语 | `lo` | `ກົດໝາຍ` / `ດຳລັດ` |
| 缅甸 | MM | 缅甸语 | `my` | `ဥပဒေ` |
| 马来西亚 | MY | 马来语 / 英语 | `ms` 或 `en` | `Akta`/`Enakmen` 取 `ms`；英文本 `Act` 取 `en` |
| 菲律宾 | PH | 英语 | `en` | `Republic Act No. 10173` |
| 新加坡 | SG | 英语 | `en` | `Personal Data Protection Act 2012` |
| 泰国 | TH | 泰语 | `th` | `พระราชบัญญัติ` |
| 东帝汶 | TL | 葡萄牙语 / 德顿语 | `pt` 或 `tet` | 公报 `Jornal da República` 多为葡语，取 `pt` |
| 中国香港/澳门/台湾 | — | — | — | 本库不单列，遇 `HK`/`MO`/`TW` 一律归 `CN` 并保留原文 |

> `km` / `lo` / `my` / `pt` / `tet` 不是界面语种，只出现在 `orig` 中；它们的译名需求由 6 个界面语种覆盖，不为它们单独建语种键。

### 3.3 新增语种的准入

只有同时满足下列条件才允许往 `title` 里加新键：
1. `prototype/data/i18n-<code>.js` 已存在（界面能切到该语种）；
2. `core/i18n.js` 的 `LANGS` 已登记；
3. `core/util.js` 的 `altTitles` 白名单已加入该 code。
否则该键不会被任何界面读取，属无效数据。

---

## 4. `orig` 原文的采集规则

### 4.1 来源优先级

1. **官方公报/数据库的标题行**（`laws/<id>.json` 的 `source.name` 所指站点）；
2. `laws/<id>.json` 已有 `title.orig`（视为已校对，不覆盖）；
3. 正文首行标题（`articles[0].text` 前 3 行内的标题行）；
4. 官方英文页的 `Original title` 字段（仅当同时给出原文时）。

**禁止**用机器回译生成 `orig`；**禁止**把 `orig` 填成英文（该法域官方语言非英文时）。

### 4.2 清洗规则

- 去掉换行，多行标题合并为单行，用单个空格分隔；
- 去掉首尾空白与 `។`、`.`、`။` 之外的重复标点（保留原文句末标点）；
- 保留原文的编号与年份写法，**不作**佛历↔公历换算、**不作**罗马数字↔阿拉伯数字改写；
- 保留原文的引号样式（泰语 `«»`、越南语 `“”`、高棉语 `«»`）；
- 不以官方缩写替代全称，除非官方标题本就使用缩写；
- 长度上限 300 字符；超长（罕见，多为「关于……的公告」附长定语）允许截断到最后一个完整语义单元，并在 `completenessNote` 注明 `title.orig 已截断`。

### 4.3 常见退化与处理

| 现象 | 处理 |
|---|---|
| OCR 把泰文佛历数字识别为阿拉伯数字 | 保留 OCR 结果，但在同语种译名中给出规范写法；`orig` 不改 |
| 高棉文 `ះ`→`៖`、`ជំងឺ`→`ជំរឺ` 等 OCR 错字 | 若可确定原字则订正；不能确定则保留 OCR 原样，**不臆造** |
| 旧版高棉字体（Limon/ABC-Times）乱码，形如 `Rkmrdæb,evNI` | `orig` 置 `null`，`textQuality` 已标 `legacy-font` 的法规不参与标题验收 |
| 标题含 PDF 页码、页眉 | 剔除，只留标题本体 |

---

## 5. 译名构造规则（分语种）

### 5.1 通用结构

```
〈层级词〉〈主题〉〈年份/编号〉
```

- 层级词按 §5.2 的术语表对译，**不逐字直译**；
- 主题词按该语种法律惯用语，**不保留中文语序**（如英文不写 `Personal Information Protection Law`，而写 `Personal Data Protection Act`）；
- 年份紧随其后；官方编号（`No. 27/2022`、`B.E. 2562`、`第 490 号`）保留原编号体系并置于年份前或后，与该语种官方行文一致；
- 修饰语（`关于……的` / `concerning …` / `về …`）用 `关于/on/về/tentang/mengenai` 引导，置于主题之后。

### 5.2 层级词术语表（基准，遇疑义回查官方英文本）

| 中文 | 英文 | 越南语 | 泰语 | 印尼语 | 马来语 |
|---|---|---|---|---|---|
| 宪法 | Constitution | Hiến pháp | รัฐธรรมนูญ | Undang-Undang Dasar | Perlembagaan |
| 法典 | Code | Bộ luật | ประมวลกฎหมาย | Kitab Undang-Undang | Kanun |
| 法律（议会法） | Act / Law | Luật | พระราชบัญญัติ | Undang-Undang | Akta / Undang-Undang |
| 法令（国会常委会） | Ordinance | Pháp lệnh | — | — | — |
| 紧急政令 | Emergency Decree | — | พระราชกำหนด | Perppu | — |
| 政府条例 | Government Regulation | Nghị định | พระราชกฤษฎีกา（Royal Decree） | Peraturan Pemerintah | Peraturan |
| 总理/总统决定 | Decision | Quyết định | คำสั่ง | Keputusan Presiden | Perintah |
| 部长令/部长条例 | Ministerial Regulation | Thông tư | กฎกระทรวง | Peraturan Menteri | Peraturan Menteri |
| 通告 | Circular | Thông tư | หนังสือเวียน | Surat Edaran | Pekeliling |
| 公告 | Notification / Proclamation | Thông báo | ประกาศ | Pengumuman | Pemberitahuan |
| 决议 | Resolution | Nghị quyết | มติ | Keputusan / Resolusi | Resolusi |
| 条例（地方） | By-law / Local Regulation | Quy chế | ข้อบัญญัติท้องถิ่น | Peraturan Daerah | Undang-Undang Kecil |
| 议定书 | Protocol | Nghị định thư | พิธีสาร | Protokol | Protokol |
| 协定/条约 | Agreement / Treaty | Hiệp định / Điều ước | ความตกลง / สนธิสัญญา | Persetujuan / Perjanjian | Perjanjian |
| 公约 | Convention | Công ước | อนุสัญญา | Konvensi | Konvensyen |

> 高棉语（`km`）、老挝语（`lo`）、缅甸语（`my`）、葡语（`pt`）只用于 `orig`，不进译名表；其层级词对照见附录 A，供核对原文用。

### 5.3 年份与编号

| 法域 | 原文写法 | 中文 | 英文 | 越南语 / 印尼语 / 马来语 |
|---|---|---|---|---|
| 泰国 | `พ.ศ. ๒๕๖๒` | `佛历2562年／2019` | `B.E. 2562 (2019)` | `năm 2019` / `tahun 2019` |
| 越南 | `Luật số 24/2018/QH14` | `第24/2018/QH14号` | `No. 24/2018/QH14` | 照录编号 |
| 印尼 | `Nomor 27 Tahun 2022` | `第27号／2022年` | `No. 27 of 2022` | 照录 `Nomor 27 Tahun 2022` |
| 马来西亚 | `Akta 709` | `第709号法` | `Act 709` | `Akta 709` |
| 菲律宾 | `Republic Act No. 10173` | `第10173号共和国法` | `Republic Act No. 10173` | `Đạo luật Cộng hòa số 10173` / `Undang-Undang Republik No. 10173` |
| 中国 | `中华人民共和国宪法` | `宪法` | `Constitution` | `Hiến pháp` |

> 中国法的法域前缀由 `country` 字段体现，标题**不写**「中华人民共和国」；但泰语/越南语等语种的官方惯用行文需要国名时（如 `Hiến pháp nước Cộng hòa Nhân dân Trung Hoa`），允许在译名中保留国名——此情形须在该语种译名内**统一**，不得有的写有的不写。

### 5.4 语言质量红线

| 项 | 要求 |
|---|---|
| 拼写 | 英文用英式拼写；越南语带完整声调（`Bảo vệ dữ liệu cá nhân`，不写 `Bao ve du lieu ca nhan`） |
| 泰语 | 使用规范书面语，不加 `ที่`/`ซึ่ง` 从句；佛历数字用泰文数字（`๒๕๖๒`） |
| 印尼语 vs 马来语 | 严格区分：`Undang-Undang`（id）/ `Akta`（ms）；`Perlindungan`（id）/ `Perlindungan`（ms 亦用）；`Data Pribadi`（id）/ `Data Peribadi`（ms） |
| 大小写 | 英文实词首字母大写（Title Case），介词连词小写；其他语种按各自正字法 |
| 标点 | 不使用中文标点（除 `zh`）；不使用书名号 |
| 缩写 | 首次出现不展开、不添加括号注释 |

---

## 6. 显示规则（前端契约）

### 6.1 主标题 + 括号原文

```js
main  = title[uiLang] || title.en || title.zh   // 当前语种 → 英文 → 中文
orig  = title.orig                              // 原文；缺失时按 §6.3 回退
render: main + (orig && orig !== main ? '（' + orig + '）' : '')
```

判断 `orig !== main` 用**去除首尾空白后的严格比较**，两者相同则不重复显示括号。

### 6.2 并列标题行（可选，仅详情页）

详情页在 `<h1>` 下方另起一行，列出「非当前语种」的 2 条标题，格式 `〈语种名〉：〈标题〉`，用 `·` 分隔。搜索结果列表页**最多 1 条**并列行，避免挤压。

### 6.3 缺失时的回退顺序

| 缺失 | 回退 | 是否加提示标签 |
|---|---|---|
| `title[uiLang]` 缺失 | `title.en` → `title.zh` | 是，`原文标题 · 暂无当前语言译名` |
| `title.orig` 缺失 | 该法域官方语言对应的语种键（CN→`zh`，PH/SG→`en`，TH→`th`，VN→`vi`，ID→`id`，MY→`ms`，KH→`km`…）→ 无则不显示括号 | 否 |
| 全部缺失 | 显示 `lawId` | 是 |

### 6.4 禁止

- 禁止在搜索结果里把原文放在**主标题位置**（原文只能是括号内容或并列行）；
- 禁止主标题与括号内容完全相同却仍显示括号；
- 禁止把 `orig` 当检索权重的主要来源（检索仍以 `zh`+`en`+`orig`+正文合并建索引，但排序权重见 `core/search.js` 现有实现，不得为展示需求改动排序）。

---

## 7. 质量校验（硬性判据）

写入前后各跑一次，任一不过即整批回退。

### 7.1 结构校验

1. `title` 必须是对象，且含 `zh`、`en`、`orig` 三个键；
2. 6 个界面语种键（`zh`/`en`/`vi`/`th`/`id`/`ms`）**全部非空**（`orig` 允许 `null`，仅限 §4.3 允许的情形）；
3. 每个值去空白后长度 ≥ 2，且 ≤ 300。

### 7.2 字符集校验（防「塞错语言」）

| 键 | 必须含 | 不得含 |
|---|---|---|
| `zh` | 汉字 | 泰文 `[\u0E00-\u0E7F]`、高棉文 `[\u1780-\u17FF]`、缅甸文 `[\u1000-\u109F]`、老挝文 `[\u0E80-\u0EFF]`、大量拉丁字母（> 60% 字符数为拉丁） |
| `en` | 拉丁字母 | **任何汉字**、泰文、高棉文、缅甸文、老挝文；越南语声调字符单独放行（允许借 `en` 兜底） |
| `vi` | 拉丁字母 + 越南语声调字符 `[ăâđêôơưàảãáạ…]` | 汉字、泰文、高棉文 |
| `th` | 泰文 `[\u0E00-\u0E7F]` | 汉字、高棉文 |
| `id` / `ms` | 拉丁字母 | 汉字、泰文、高棉文 |

> 判据落地为 `_work/title-multi/chk-titles.js`，实现细节见该文件头注释。

### 7.3 语义校验（抽样人工 + 规则）

1. **不得整段照搬**：`zh` 与 `en` 完全相同（且 `en` 含汉字）→ 不合格；
2. **不得残留占位**：`TBD`、`TODO`、`待补`、`xxx`、`???`、`[?]`；
3. **不得残留模板**：`《`、`》`、`"`、` 的 `、`关于的`；
4. **长度比**：`len(译名) / len(参照)` 落在 `0.4–3.0`（参照：`zh` 对 `en`，`vi`/`id`/`ms` 对 `en`，`th` 对 `orig`）。越界进人工复核队列，不直接判错。

### 7.4 一致性校验

- 同法域同「层级词」的译法必须一致：抽 20 条比对层级词，出现同一层级词两种译法即整批复核（例：泰国 `พระราชบัญญัติ` 一律译 `Act`，不得混用 `Law`）；
- 同法域同主题词必须一致（`Personal Data Protection` 在泰国法域统一，不写 `Personal Information Protection`）。

---

## 8. 写入流程

### 8.1 标准四步

```bash
# 1）写 laws/*.json 的 title（唯一真源）
node _work/title-multi/apply-multi.js <批次JSON> [--dry]

# 2）校验（结构 + 字符集 + 语义）
node _work/title-multi/chk-titles.js <批次JSON>

# 3）回灌目录层（cn-catalog.js / intl-catalog.js）
node _work/title-import/sync-titles-to-catalog.js

# 4）重建索引并全库校验
node _work/merge/rebuild-index.js
node tools/verify-data.js        # 约 85 秒，用后台跑
```

### 8.2 批次文件格式

```json
{
  "batch": "kh-th-2026-10-27",
  "scope": "TH 泰国法 1-200 部",
  "items": {
    "TH-H001": {
      "zh": "仲裁中心法（佛历2550年／2007）",
      "en": "Act on the Arbitration Center, B.E. 2550 (2007)",
      "vi": "Luật về Trung tâm Trọng tài, B.E. 2550 (2007)",
      "th": "พระราชบัญญัติว่าด้วยสถาบันอนุญาโตตุลาการ พ.ศ. ๒๕๕๐",
      "id": "Undang-Undang tentang Pusat Arbitrase, B.E. 2550 (2007)",
      "ms": "Akta mengenai Pusat Timbang Tara, B.E. 2550 (2007)",
      "orig": "พระราชบัญญัติว่าด้วยสถาบันอนุญาโตตุลาการ พ.ศ. ๒๕๕๐"
    }
  }
}
```

- 只覆盖批次里出现的键；未出现的键保持原值（增量友好）；
- 值为 `null` 表示「明确置空」，需在 `note` 里说明理由；
- 批次文件存放 `_work/title-multi/batches/<batch>.json`，**永久留存**，作为可追溯的翻译凭据。

### 8.3 目录层同步

`sync-titles-to-catalog.js` 必须把 `title` 的**全部语种键**写入 `intl-catalog.js`（而不是只写 `zh/en/orig`），否则前端 `util.tr()` 取不到，功能等于没做。

---

## 9. 分批与优先级

按「用户最先看到 → 最后看到」排，不按 lawId 排。

| 批次 | 范围 | 部数 | 理由 |
|---|---|---|---|
| **P0** | 全库 `orig` 规则回填（CN→`zh`、PH/SG→`en`、BN/MY 逐部判定） | ≈6,570 | 括号内容的前提，成本最低 |
| **P1** | TH 816 + VN 73 + ID 36 | 925 | 用户基准场景 A/B/C 所在法域 |
| **P2** | KH 187 + LA 80 + MM 80 + MY 74 + TL 230 + BN 1,275 | 1,926 | 小法域，一次清完 |
| **P3** | CN 1,586 | 1,586 | 越南语页面场景 B 的另一半 |
| **P4** | SG 3,714 | 3,714 | 英文法域，仅需 4 个译名 |
| **P5** | PH 10,619 | 10,619 | 体量最大，英文法域，最后做 |

**每批内部顺序**：`coverage=full`（有全文）→ `catalog`（仅目录）。

---

## 10. 禁止事项

1. **禁止**用英文标题冒充 `orig`（法域官方语言非英文时）；
2. **禁止**用拼音/转写代替译名（`Bao ve du lieu ca nhan` 不算越南语译名）；
3. **禁止**机翻后不审校直接入库：同一法域的层级词必须过 §5.2 术语表；
4. **禁止**为了「有值」而复制其他语种的值（`th` 直接填英文）；
5. **禁止**手工编辑 `cn-catalog.js` / `intl-catalog.js`（由脚本生成，手工改动会被下次同步覆盖）；
6. **禁止**跳过 §8.1 的第 3、4 步——只写 `laws/*.json` 不回灌，前端看不到任何变化；
7. **禁止**在缺 `orig` 的情况下把括号留成 `（）` 空括号。

---

## 11. 验收口径

一个批次算「完成」需同时满足：

1. 该批次内 **6 个界面语种 + `orig` 全部非空**（§7.1）；
2. `chk-titles.js` 报**错误 0**（告警可留存，须逐条给出理由）；
3. `intl-catalog.js` 中对应条目的 `title` 已含新语种键（抽样 10 条验证）；
4. 前端实测 §1.2 的 5 个场景全部符合期望（截图或 DOM 断言留存）；
5. 批次 JSON 已归档到 `_work/title-multi/batches/`，批次台账 `_work/title-multi/LEDGER.md` 已登记部数、语种、校验结果。

全库口径（最终验收）：

```
18,771 部 × {zh, en, vi, th, id, ms, orig} = 131,397 个字段，非空率 100%
```

---

## 附录 A · 原文层级词对照（核对 `orig` 用）

| 法域 | 宪法 | 法律 | 政令/条例 | 部长令 | 公告 |
|---|---|---|---|---|---|
| KH 高棉 | រដ្ឋធម្មនុញ្ញ | ច្បាប់ | ព្រះរាជក្រឹត្យ / អនុក្រឹត្យ | ប្រកាស | ប្រកាស |
| LA 老挝 | ລັດຖະທຳມະນູນ | ກົດໝາຍ | ດຳລັດ | ຂໍ້ຕົກລົງ | ແຈ້ງການ |
| MM 缅甸 | ဖွဲ့စည်းပုံအခြေခံဥပဒေ | ဥပဒေ | အမိန့်ကြော်ငြာစာ | ညွှန်ကြားချက် | အသိပေးအကြောင်းကြားစာ |
| TL 东帝汶 | Constituição | Lei | Decreto-Lei | Portaria | Despacho |

## 附录 B · 本规范涉及的文件

| 文件 | 职责 |
|---|---|
| `prototype/data/laws/*.json` | 标题唯一真源 |
| `_work/title-multi/apply-multi.js` | 批量写入（多语种键） |
| `_work/title-multi/chk-titles.js` | 结构 + 字符集 + 语义校验 |
| `_work/title-multi/audit-titles.js` | 全库缺口矩阵与批次队列 |
| `_work/title-multi/batches/*.json` | 批次翻译凭据（永久留存） |
| `_work/title-multi/LEDGER.md` | 批次台账 |
| `_work/title-import/sync-titles-to-catalog.js` | 回灌 `cn-catalog.js` / `intl-catalog.js` |
| `prototype/assets/js/ui/components.js` | 搜索结果的「主标题（原文）」渲染 |
| `prototype/assets/js/views/law.js` | 详情页并列标题 |

## 附录 C · 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-27 | 初版。确立 6 语种 + orig 的字段模型、分语种术语表、字符集判据、P0–P5 分批 |
