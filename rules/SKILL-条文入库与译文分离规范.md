# SKILL.md — 中国—东盟法律法规数据库 · 条文入库与译文分离规范

> **这份文件是「数据供给方」与「本项目」之间的唯一契约。**
> 任何 agent 在向本库补充法规条文、条约条文或大模型译文之前，必须先完整阅读本文件，
> 并在交付前运行 `tools/verify-data.js` 自检通过。
>
> - 版本：v2.0（替代 `docs/_archive-2026-10-24/06-全文数据规范.md` v1.0，v1.0 仅覆盖法域层，本文件覆盖全部四层）
> - 建立日期：2026-10-06
> - 适用对象：条文抓取 agent、翻译 agent、数据治理 agent
> - 本项目的加载代码：`prototype/assets/js/core/fulltext.js`

---

## 0. 交付前必做的三件事

```bash
# 1) 语法检查（每个新增/修改的 .js 文件）
node --check prototype/data/xxx.js

# 2) 数据层全量校验（会检查字段、条数、一致性、译文分离）
node tools/verify-data.js          # 必须输出「校验结果：全部通过」

# 3) 若新增了「无本地原文」条目，重新生成清单
node _work/build-no-fulltext-inventory.js
```

`tools/verify-data.js` 退出码 `0` = 通过，`1` = 有错误。**有错误不得交付。**

写译文分卷时，先复制模板：

```bash
cp tools/templates/trans-pack.template.js prototype/data/trans/th-p01.zh.js
node tools/test-trans-layer.js     # 译文层机制自测（当前显示「全部通过」）
```

---

## 1. 数据库总览

### 1.1 存储布局：一份权威 + 一份派生

> **2026-10-08 起，唯一权威存储是 `prototype/data/laws/`（每部法规一个 JSON）。**
> 下表的 A/B/C 三层**已改为派生构建产物**，由 `_work/merge/build-packs.js` 从 `laws/` 自动生成，**请勿手工编辑**。
> 完整规范见 §4.7。

| 层 | 目录 | 形态 | 说明 |
| :--- | :--- | :--- | :--- |
| **★ 权威存储层** | `prototype/data/laws/<法规ID>.json` | **每法一个 JSON**（18,854 个） | **唯一真源**。人工修订、采集入库只改这里 |
| 派生的分卷 | `prototype/data/{fulltext,cn,intl}/*.js` | 每卷含多部法 | 供零依赖静态 SPA 用 `<script src>` 按需加载；**由 `laws/` 生成** |
| **元数据层** | `prototype/data/*.js` | 传统脚本 | `CALR_DATA_CORE` / `CALR_DATA_EXTRA` / `CALR_CN_CATALOG` / `CALR_INTL_CATALOG`；法规目录、国家、层级、主题、术语、条约、案例 |
| A 法域全文层（派生） | `prototype/data/fulltext/<cc>.js` | 10 卷 / 61 部 | 精选重点法 |
| B 中国全量层（派生） | `prototype/data/cn/cn-pNN.js` | 20 卷 / 1,540 部 | 中国法规全量 |
| C 东盟分卷层（派生） | `prototype/data/intl/<cc>-pNN.js` | 252 卷 / 17,220 部 | 东盟各国 |
| **D 译文层** | `prototype/data/trans/<pack>.js` | 索引 + 分卷 | **译文与官方原文物理分离**；当前为空表 |

> **A/B/C 三层共用同一个全局变量 `CALR_FULLTEXT`，键都是法规 id。**
> 加载器 `CALR.fulltext.entry(lawId)` 不关心条文来自哪一层，只按 id 取值。
> 因此**同一 id 不得在多层同时出现**（A 层优先，见 §5 与 §4.7）。

### 1.2 当前存量（2026-10-08 实测）

| 项 | 数量 | 复现方式 |
| :--- | ---: | :--- |
| 国家 / 法域 | **12**（CN VN TH ID MY SG PH BN KH LA MM TL） | `laws/index.json` → `byCountry` |
| **法规（权威存储）** | **18,854 部** | `laws/index.json` → `lawCount` |
| **结构化条文** | **334,681 条** | `laws/index.json` → `articleCount` |
| **正文总量** | **270,580,193 字** | `laws/index.json` → `chars` |
| 法规目录条目 | **12,188**（dataset-core 67 ＋ cn-catalog 1,564 ＋ intl-catalog 11,819） | 三张目录表并集 |
| 条文原文语言 | **10 种**（en 15,882 / zh 1,657 / th 741 / pt 230 / km 161 / vi 50 / lo 42 / id 32 / my 31 / ms 8） | `laws/index.json` → `byLanguage` |
| 条约条目 | **18**（**全部无本地条文**） | `CALR_DATA_EXTRA.treaties` |
| 术语 / 案例 / 修订 | 161 / 10 / 12 | `CALR_DATA_EXTRA` |
| **界面语言** | **6**（zh en vi th id ms） | `assets/js/core/i18n.js` → `LANGS` |
| | ⚠️ 缅语（my）、高棉语（km）、老挝语（lo）**尚未实现**，待专业翻译；**不得对外宣称已支持** | `data/i18n-my|km|lo.js` 不存在 |
| 大模型译文 | **0（译文层已建好待填充）** | `trans/manifest.js` → `files: []` |
| 去重归档 | 同内容重复 **63 部** ＋ 跨层同法 **26 部** | `_work/dedup-archive/` |

条文层明细（派生分卷，`laws/` 为源）：

| 层 | 卷数 | 法规 | 条文 | 正文字数 |
| :--- | ---: | ---: | ---: | ---: |
| A 法域全文层 `data/fulltext/` | 10 | 61 | 9,859 | 5,723,365 |
| B 中国全量层 `data/cn/` | 20 | 1,540 | 57,525 | 6,905,338 |
| C 东盟分卷层 `data/intl/` | 252 | 17,220 | 238,314 | 226,391,449 |
| D 译文层 `data/trans/` | 0 | 0 | 0 | 0 |
| **合计** | **282** | **18,854** | **334,681** | **270,580,193** |

### 1.3 无本地条文原文的条目

**共 4,418 条**，只登记了目录信息与官方链接，没有本地条文正文：

| 类型 | 条数 |
| :--- | ---: |
| 法规 | **4,393** |
| 修正案 | **7** |
| 条约 | **18** |

完整名单（含国家、公布日期、施行日期、修改日期、制定机关、法律层级、有效性、官方链接）：

- **`docs/_archive-2026-10-24/11-无本地原文清单.md`** — 可读的 Markdown 表格（按法规/修正案/条约分组）
- **`materials/_archive-2026-10-24/无本地原文清单.csv`** — 18 列完整字段，可直接用于任务分派

> 这两个文件是**自动生成**的，由 `_work/build-no-fulltext-inventory.js` 从数据层实时导出。
> **不要手工编辑**；补入条文后重新运行该脚本即可。

按法域分布：柬埔寨 **3,706** / 老挝 295 / 泰国 186 / 东帝汶 48 / 越南 39 / 马来西亚 39 / 缅甸 31 / 印度尼西亚 26 / 文莱 23 / 多边条约 18 / 新加坡 7。

> 权威层副本：`prototype/data/laws/无本地原文清单.csv`（**无 BOM**）；交付副本 `materials/_archive-2026-10-24/无本地原文清单.csv`（**带 BOM，便于 Excel 打开**；本地归档，不入 git，两者内容一致）。

---

## 2. 目录结构

```
prototype/data/                                    ← laws/ 为唯一权威存储
├── laws/                      ★ 权威存储（人工修订只改这里）
│   ├── index.json             #   总索引：18,854 部 / 334,681 条 / 270,580,193 字
│   ├── 无本地原文清单.csv       #   4,418 条仅目录登记、无本地正文（无 BOM）
│   ├── 条号重复清单.csv         #   305 部 / 2,801 组重复条号（无 BOM）
│   └── <法规ID>.json          #   每法一个文件，18,854 个
│
├── fulltext/                  # 【派生·A 层】10 卷 / 61 部
│   └── manifest.js            #   files[] + byLaw{lawId → 法域代码}
├── cn/                        # 【派生·B 层】20 卷 / 1,540 部（cn-p01 … cn-p20）
├── intl/                      # 【派生·C 层】252 卷 / 17,220 部
│   └── manifest.js            #   files[{file,country,laws[],articles}] + byLaw{lawId → 分卷名}
├── trans/                     # 【D 层】译文，与原文物理分离（当前空表）
│   └── manifest.js
│
├── dataset-core.js            # 元数据核心：国家/层级/时效/主题/语言 + 67 部精选法规
├── dataset-extra.js           # 扩展：术语 161 / 条约 18 / 案例 10 / 修订 12
├── cn-catalog.js              # 中国法规目录（1,564 条），每条指明所属分卷 pack
├── intl-catalog.js            # 东盟法规目录（11,819 条），含溯源信息与去重留痕
├── i18n.js / i18n-<cc>.js     # 界面文案（6 语种：zh 原文 + en/vi/th/id/ms 各 780 词条）
└── asean-map.js               # 东盟地图矢量数据
```

> `fulltext/`、`cn/`、`intl/` 三个目录下的分卷 JS **全部是 `laws/` 的派生产物**，
> 文件头已标注「由 _work/merge/build-packs.js 从 prototype/data/laws/ 自动生成，请勿手工编辑」。

**全部文件都是「零依赖传统脚本」**，必须遵守：

```js
(function (root) {
  'use strict';
  /* ……向 root 上挂全局变量…… */
})(typeof window !== 'undefined' ? window : globalThis);
```

- ✅ 允许：`var` / `function` / 普通对象字面量
- ❌ 禁止：`import` / `export` / `require` / `fetch` / `XMLHttpRequest` / `async` 顶层 await
- ❌ 禁止：修改其他文件的全局变量（禁止改 `dataset-core.js` 来新增法规）

理由：本原型必须能直接以 `file://` 打开运行，不允许构建步骤、不允许网络请求。

---

## 3. 元数据层规范

### 3.1 `dataset-core.js` → `CALR_DATA_CORE`

```js
window.CALR_DATA_CORE = {
  meta:     { version, generatedAt, disclaimer, stats },
  languages:[ { code, name:{zh,en}, nativeName } ],       // 9 种
  topics:   [ { id, name:{zh,en,vi,th,id,ms}, icon, lawCount } ],  // 10 个
  levels:   [ { id, order, name:{zh,en,vi,th,id,ms}, color } ],    // 9 级
  statuses: [ { id, name:{...}, color } ],                // 4 种
  countries:[ …见下… ],                                    // 12 个
  laws:     [ …法规对象… ]
};
```

#### 枚举值（**必须使用这些 id，不得自造**）

**国家代码**：`CN` `VN` `TH` `ID` `MY` `SG` `PH` `BN` `KH` `LA` `MM` `TL`

**法律层级 `level`**（按 `order` 升序）：

| id | 中文 | 英文 |
| :--- | :--- | :--- |
| `constitution` | 宪法 | Constitution |
| `code` | 法典 | Code |
| `law` | 法律 | Law / Act |
| `decree` | 行政法规/政令 | Decree / Royal Decree |
| `regulation` | 法规 | Regulation |
| `subdecree` | 部门规章/通告 | Ministerial Regulation |
| `local` | 地方性法规 | Local Regulation |
| `judicial` | 司法解释/判例 | Judicial Interpretation / Case Law |
| `amendment` | 修正案 | Amendment |

**时效性 `status`**：`active` 现行有效 ｜ `amended` 已修订 ｜ `repealed` 已废止 ｜ `pending` 尚未生效

**主题 `topics[].id`**：`investment` `contract` `labor` `ip` `data` `tax` `env` `dispute` `trade` `company`

**语言代码**：`zh` `en` `vi` `th` `id` `ms` `my` `km` `lo`（另有 `pt` 用于东帝汶葡文原文）

#### 国家对象

```js
{
  code: 'TH',
  name: { zh:'泰国', en:'Thailand', th:'ไทย', vi:'Thái Lan', id:'Thailand', ms:'Thailand' },
  flag: '🇹🇭',
  flagColors: ['#A51931', '#2D2A4A'],
  legalSystem: 'civil',                 // civil | common | mixed
  legalSystemTags: ['成文法'],           // 数据原文，展示时走 i18n
  languages: ['th'],
  capital: '曼谷',
  joinedASEAN: 1967,
  hierarchy: ['constitution','law','decree','subdecree'],   // 该国层级序列
  sources: [ { name: '泰国政府公报（Royal Gazette）', url: 'https://ratchakitcha.soc.go.th' } ],
  summary: { zh: '…', en: '…' },
  featured: true
}
```

> `name` **至少要有 `zh` 与 `en`**；若还能提供 `vi`/`th`/`id`/`ms` 更好。
> 缺少当前界面语言时，`util.tr()` 的回退顺序是「当前语言 → 英文 → 中文」。

### 3.2 `cn-catalog.js` → `CALR_CN_CATALOG`

```js
window.CALR_CN_CATALOG = {
  meta: { generatedAt, sourceDir, laws, articles },
  packs: [...],
  laws: [{
    id: 'CN-LAW-0001',          // 见 §4.4 id 规则
    title: '中华人民共和国…',      // 纯字符串（中国法）
    category: '法律',            // 法律 | 行政法规 | 监察法规 | 司法解释 | 宪法
    level: 'law',               // 对应 §3.1 层级 id
    date: '1980-08-26',         // 公布日期
    issuingBody: '全国人民代表大会常务委员会',
    docNumber: null,
    articles: 26,               // 条文数（冗余字段，便于目录快速筛选）
    chars: 1906,
    pack: 'cn-p01',             // ★ 指向 data/cn/cn-p01.js
    structureMode: 'ARTICLE',   // ARTICLE | ITEM | WHOLE
    alreadyLoaded: false,
    sourceFile: '数据资源\\法律法规（持续更新中）\\法律\\…_19800826.docx'
  }]
};
```

> **注意**：`pack` 字段是 B 层的唯一识别依据（见 §5）。新增中国法规必须同时写 `pack`。

### 3.3 `intl-catalog.js` → `CALR_INTL_CATALOG`

```js
window.CALR_INTL_CATALOG = {
  meta: {...},
  laws: [{
    id: 'TH-H001',
    country: 'TH',
    level: 'law',                    // §3.1 层级 id
    status: 'active',                // §3.1 时效 id
    topics: ['ip'],
    title: { zh:'专利法', en:'Patent Act B.E. 2522', th:'…' },
    docNumber: '…',
    issuingBody: { zh:'…', en:'…' },
    promulgatedDate: '1979-03-11',
    promulgatedDateRaw: '1979',
    promulgatedDatePrecision: 'day',  // day | month | year
    effectiveDate: '1979-03-11',
    amendedNote: '…',
    coverage: 'full',                 // ★ full=有本地条文 | catalog=仅条目信息
    source: { name: '…', url: 'https://…' },
    summary: { zh:'…', en:'…' },
    articleCount: 0,
    textLang: 'th',                   // ★ 官方原文语言
    fulltextKey: 'TH-H001',
    trace: {                          // 溯源信息（可选但强烈建议）
      archive: '东盟法律分类\\泰国\\泰国_Patent Act_1979_th.md',
      matchedBy: 'metadata',
      titleOriginal: '…',
      publisher: '…',
      previous: { zh: '旧名' }
    }
  }]
};
```

**`coverage` 是以下三个取值之一：**

| 值 | 含义 | 界面表现 |
| :--- | :--- | :--- |
| `full` | 有本地条文原文 | 详情页直接可读全文 |
| `catalog` | 仅条目信息，正文需前往官方渠道 | 显示「本条仅收录条目信息」＋官方链接 |
| `excerpt` | 元数据层的精选条目，仅有元数据与摘要（**兜底态**） | 列表页显示摘要片段；详情页不显示全文 |

> ⚠️ `excerpt` 仅用于**元数据层**（`dataset-core.js`）。`docs/00-项目基线.md` §6 已定义该取值
> （`full`（官方全文）｜`catalog`（目录已收录、条文按需加载）｜`excerpt`（节选，仅兜底）），
> 本文件 v2.0 初版漏列，v2.1 补记。三者语义边界：
> `full` ＝ 本地有条文全文；`catalog` ＝ 本地无条文、仅有目录条目；`excerpt` ＝ 本地无条文、但有平台整理的元数据与摘要。
>
> ⚠️ **D 层（条文层 A/B/C）的分卷契约中，`coverage` 仍固定为 `'full'`**（见 §4.1），不得出现 `catalog` 或 `excerpt`。
>
> `coverage` 必须与实际是否存在于 A/B/C 层一致。改成 `full` 却没写分卷，校验器会报错。

### 3.4 `dataset-extra.js` → `CALR_DATA_EXTRA`

```js
window.CALR_DATA_EXTRA = {
  meta, terms, treaties, cases, revisions, qa, demoQueries
};
```

**术语**（多语言译法存放范式，译文层可参照）：

```js
{
  id: 'foreign_invested_enterprise',
  domain: 'investment',
  zh: '外商投资企业',
  en: 'foreign-invested enterprise (FIE)',
  definition: { zh: '…', en: '…' },
  translations: { vi: '…', th: '…', id: '…', ms: '…', my: '…', km: '…', lo: '…' },
  equivalents: [ { country: 'CN', term: '外商投资企业' } ],
  confidence: 'high',
  lawIds: ['VN-INVEST-2020', 'CN-FIL-2019'],
  articleIds: [...]
}
```

**条约**（当前全部无条文）：

```js
{
  id: 'RCEP',
  name: { zh: '区域全面经济伙伴关系协定', en: 'RCEP' },
  parties: ['CN','TH',…],
  signedDate: '2020-11-15',
  effectiveDate: '2022-01-01',
  status: 'active',
  topics: ['investment','trade'],
  summary: { zh: '…', en: '…' },
  conceptNote: '…'
}
```

---

## 4. 条文层规范（A / B / C 三层完全同构）

### 4.1 分卷契约

```js
(function (root) {
  'use strict';
  root.CALR_FULLTEXT = root.CALR_FULLTEXT || {};

  root.CALR_FULLTEXT['TH-H001'] = {
    id: 'TH-H001',                       // ★ 必须与键一致
    coverage: 'full',                    // ★ 固定 'full'
    language: 'th',                      // ★ 官方原文语言，见 §3.1 语言代码
    sourceName: '泰国政府公报（Royal Gazette）',
    sourceUrl: 'https://ratchakitcha.soc.go.th/…',
    fetchedAt: '2026-10-06',             // 抓取日期（YYYY-MM-DD）
    articleCount: 3,                     // ★ 必须 === articles.length
    structureMode: 'ARTICLE',            // ARTICLE | ITEM | WHOLE | CHAPTER
    completenessNote: '全文，共 3 条；逐字未改写。',
    structure: [                          // ⭕ 章节目录（可选）
      { th: 'หมวด 1', articles: [1, 2] }
    ],
    articles: [ /* 见 4.2 */ ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
```

| 字段 | 必填 | 约束 |
| :--- | :---: | :--- |
| `id` | ✅ | 与对象键完全相同 |
| `coverage` | ✅ | 固定 `'full'`。**节选一律不得写入本层** |
| `language` | ✅ | 官方原文语言，必须是 §3.1 语言代码之一 |
| `sourceName` | ✅ | 官方来源名称 |
| `sourceUrl` | ✅ | 实际抓取的正文页 URL |
| `fetchedAt` | ✅ | `YYYY-MM-DD` |
| `articleCount` | ✅ | **必须等于 `articles.length`**，校验器会强制检查 |
| `articles` | ✅ | 条文数组，见 4.2 |
| `structureMode` | ⭕ | 切分模式，默认 `ARTICLE` |
| `completenessNote` | ⭕（强烈建议） | 完整性说明 |
| `structure` | ⭕ | 章节目录；`articles` 是**条号数组** |
| `sourceFile` | ⭕ | 原始文件相对路径（B 层常用） |
| `viewerUrl` | ⭕ | 官方阅读页（A 层常用） |

### 4.2 条文契约

```js
{
  id: 'TH-H001-A8',              // 规则：<lawId>-A<条号数字>
  no: 8,                          // ★ 阿拉伯数字，用于排序与跨层对齐
  noLabel: { th: 'มาตรา 8' },     // ★ 官方条号写法，按语言分键
  chapter: { th: 'หมวด 1' },      // ★ 所属章/节；官方无章节写 {}
  heading: { th: '…' },           // ⭕ 官方条文标题；官方无标题则省略，不得自拟
  text: { th: '…' },              // ★ 官方原文，逐字
  paragraphs: ['第一款', '第二款'], // ⭕ 分款原文（与 text 合并后应与完整条文一致）
  sourceUrl: 'https://…'          // ⭕ 条文级链接
}
```

| 字段 | 必填 | 说明 |
| :--- | :---: | :--- |
| `id` | ✅ | `<lawId>-A<no>` |
| `no` | ✅ | **必须是数字**（不是字符串），且同一部法内唯一 |
| `noLabel` | ✅ | 官方条号写法，按语言分键 |
| `text` | ✅ | **只放官方原文那一种语言**（见 §4.3） |
| `chapter` | ✅ | 无章节时为 `{}` |
| `heading` | ⭕ | 官方无标题不得自拟 |
| `paragraphs` | ⭕ | 与 `text` 二选一或并存 |
| `sourceUrl` | ⭕ | 条文级链接 |

### 4.3 ★ 最重要的红线：`text` 里只放官方原文
```js
/* ✅ 正确：官方泰文原文，text 只有 th 一个键 */
text: { th: 'มาตรา 8 …' }

/* ❌ 错误：把机器译文塞进同一个 text 对象 */
text: { th: 'มาตรา 8 …', zh: '第八条 …' }
```

**为什么**：译文与官方原文混在一个字段里，会导致「译文冒充原文」，也会污染引用与导出。
大模型译文**必须**写入独立的 D 层（见 §6）。

> 例外：**官方本身发布的多语种版本**（如香港双语法例、加拿大双语法律）属于官方原文，
> 可以在 `text` 中并列多个语言键，但必须在 `sourceName` 中注明「官方双语版本」。
> 判断标准：**这个语言版本是官方发布的，还是模型生成的？** 官方→可并列，模型→必须分离。

`tools/verify-data.js` 会对「`text` 含多个语言键」发出警告，提醒复核是否属于上述例外。

### 4.4 条文正文版式：一行一段、不留版式噪声

从 PDF 或网页抽取的条文常带两类版式残留，必须在入库前清理，否则界面上一条完整法条会被渲染成多个段落。

**（1）硬折行** —— 原文按纸张宽度断行，`text` 中留下大量 `\n`：

```js
/* ❌ 改前：一句被拆成三行，前端会渲染成三个段落 */
"registry of the new office location no later than two weeks following \n\nsuch establishment."

/* ✅ 改后：软折行合并为空格，真实分段保留单个 \n */
"registry of the new office location no later than two weeks following such establishment.\n(2) For circumstances …"
```

合并规则：

| 判定 | 处理 |
| :--- | :--- |
| 下一行以条/款/项标记开头（`(1)` `(a)` `Article N` `第N条` `Ayat (n)` `Pasal N` `Điều N` `มาตรา N`…） | **真实分段**，保留 `\n` |
| 上一行为题名式短行（Title Case 或全大写、≤60 字符、无句末标点） | **真实分段**，保留 `\n` |
| 上一行不以句末标点（`.。;；:：!?`）结尾 | 软折行，合并 |
| 下一行以小写字母开头 | 软折行，合并 |
| 行尾为 `-` 且下一行小写开头 | 去掉换行，**连字符一律保留，不删字符** |

> **连字符不删**：实测 1019 处 `X-\nY` 中，去掉连字符后能在语料词表命中的为 **0** 处——
> 该形态绝大多数是 `which—(a)` 被抽成 `which-\nfa)` 的残缺标记，而非英文断词。删字符会违反「逐字」红线。
>
> **CJK 相邻不加空格**；英文之间补一个半角空格。

**（2）页码与页眉** —— 从 PDF 抓取时会把页面装饰一并抽进正文：

| 类型 | 示例 | 处理 |
| :--- | :--- | :--- |
| 页码（成对短横线） | `- 31 -` | 删除 |
| 裸页码 | 独立成行的 `264`、`265`… | 仅当同一部法出现 ≥3 个、基本递增且首尾跨度 ≥5 时判为页码并删除 |
| 运行页眉 | `LAWS OF BRUNEI`、`REPUBLIK INDONESIA`、`BRUNEI DARUSSALAM GOVERNMENT GAZETTE` | 同一部法内重复 ≥4 次且形态为全大写拉丁（≥8 字符）或纯中文（≤12 字）时删除 |
| 来源站水印 | `法通网 法通网 法通网` | 删除 |

**不处理的两类（经实测误删风险高于收益）**：

- 「页码＋日期」如 `264 26th. FEBRUARY, 2000`
- 「页码＋小节标题」如 `267 Published editions.`

它们会一并删掉修正记录里形如 `23 May 2017`、`1 1 October 2017` 的**合法日期行**，
以及菲律宾法条中的 `P.50`、`P.10`（比索金额）。**宁可保留少量版式噪声，也不改动任何有效字符。**

**（3）校验口径** —— 版式规范化只允许「删除整行 + 改变行间空白」，**不得增删任何非空白字符**。
交付前用以下方式自证：

```bash
node _work/fix-text-layout.js --dry     # 试运行，只会报告将删除多少行、合并多少处
node _work/prove-layout.js              # 可复现性证明：用改前文本重建，应与改后完全一致
```

当前结果：**155,417 / 155,417 条完全一致，0 条不一致**；另有 255 条因结果过短而保留原文、
6 条单行文本按设计跳过。

> 规范化脚本：`_work/fix-text-layout.js`（`--dry` 只统计不改文件）。


#### 4.4.3 OCR 级字符缺陷

PDF 转文字还会产生**字符级**错误，需在入库前修复。已实测并固化的规则：

| 编号 | 形态 | 修正 | 命中数 | 风险 |
| :--- | :--- | :--- | ---: | :--- |
| R0 | `{}`、`{{}`、`({}`、`{(}` | `(f)` / `(` | 9 | 低 |
| R1 / R2 | `{` / `}` | `(` / `)` | 940 / 704 | 低 |
| R3 | `[` + 1~3 位字母数字 + `)` | `(X)` | 32 | 低 |
| R4 | 词首 `f` + 1~2 位小写字母 + `)`/`}` | `(X)` | 133 | 低 |
| R5 | `fi.` 后接小写字母（`fi.rst`、`fi.lm`） | `fi` | 57 | 低 |
| R6 | 罗马数字 / 叠字母 + `)` 缺左括号 | 补 `(` | 1047 | 中 |
| R7 | 整行的印尼页眉残片（`PRES IDEN`、`REPUELIK`、`TNDONESIA`…） | 删除该行 | 182 | 中 |

**三条上下文守卫**（缺一不可，否则会把正确文本改坏）：

1. **已存在左括号**：形如 `( i)`、`( fa)` 的前缀若含 `(`，一律原样保留，否则会变成 `( (i)`；
2. **位于词中**：标记左侧紧邻字母数字时不处理，否则 `Nairobi)` → `Nairo(i)`、`form)` → `(orm)`；
3. **不得清空**：任何规则都不得把一条条文改成空串；同时单条文本的净改动量不得超过
   `max(40 字符, 原长 25%)`，超出即判为误伤并回退原文。

**明确不处理的形态**（无法判定合法性，宁可保留）：

- 裸 `a)` / `b)` / `c)` … 约 **2.5 万处** —— 部分法域本就写作 `a)` 而非 `(a)`；
- `~` 代替字母（`busin~ss`、`ex~nsion`、`d~ne`）—— 替换字符各不相同，需词典才能判定；
- `[` / `]` 全局替换 —— `[Section 6]`、`[Sabah Cap. 2]` 等为合法的编者插入语；
- `|` 替换 —— 实测全部命中缅甸法律网站域名 `jy|mef`。

**执行与校验**：

```bash
node _work/fix-ocr.js --dry      # 试运行
node _work/fix-ocr.js --log      # 写回，并导出逐条改动日志 _work/ocr-changelog.json
node _work/verify-ocr.js         # 安全校验：结构完整性 + 缺陷形态前后对照 + 改动样例
```

当前结果（2026-10-07）：改动 **1,252** 条文本，法规数 11,942 与条文数 156,342 **未变**，
结构异常 0，未新增任何 `((` 形态；各类缺陷同步下降（`{` 1051→97、`}` 863→154、
`f+字母+)` 356→228、`fi.xx` 67→10、`ii)/iii)` 828→10、印尼页眉残片 126→0）。
逐条改动日志见 `_work/ocr-changelog.json`（707 KB）。


| 层 | 规则 | 示例 |
| :--- | :--- | :--- |
| A 法域层（精选） | `{国家代码}-{主题缩写}-{年份}` | `CN-FIL-2019`、`VN-INVEST-2020`、`TH-LABOR-1998` |
| B 中国全量层 — 法律 | `CN-LAW-{4位序号}` | `CN-LAW-0001` |
| B 中国全量层 — 行政法规 | `CN-REG-{4位序号}` | `CN-REG-0477` |
| B 中国全量层 — 精选条目 | `CN-{主题}-{年份}` | `CN-FOREIGN-TRADE-2025` |
| C 东盟层 | `{国家代码}-H{3位序号}` | `TH-H001`、`BN-H080` |

### 4.5 法规 id 规则

**硬性约束**：

1. 同一目录层内 `id` **不得重复**（校验器强制检查）。
2. **同一部法的不同修订版必须用不同 id**，年份取该版本的公布/修订年。
   > 曾经出过的事故：`对外贸易法` 的 2022 与 2025 两版共用 `CN-FOREIGN-TRADE-2025`，
   > 导致分卷里后写入的版本覆盖前者。已修复为 `CN-FOREIGN-TRADE-2022` / `CN-FOREIGN-TRADE-2025`。
   > 若确实需要改名，请加 `idRenamedFrom` 字段保留旧 id，便于回溯。
3. id 一旦发布**不得随意变更**（外部可能已引用）。确需变更时保留 `idRenamedFrom`。

### 4.6 存储形式建议

| 情形 | 做法 |
| :--- | :--- |
| 单部法规条文 ≤ 300 条 | 直接放入所属分卷 |
| 单部法规条文 > 1,000 条（如民法典、税法） | 单独开一卷，文件名加 `-big`，并在索引中登记 |
| 新增东盟法规 | 追加到该国**最后一个分卷**；超过 80 部则新建 `<cc>-pNN.js` 并更新 `intl/manifest.js` |
| 新增中国法规 | 追加到 `cn-p20.js` 或新建 `cn-p21.js` 并在 `cn-catalog.js` 中登记 `pack` |

---

### 4.7 存储布局与构建流程（2026-10-08 起）

**唯一权威存储**：`prototype/data/laws/` —— **每部法规一个 JSON**，文件名 = 法规 ID。

```
prototype/data/
├── laws/                         ← ★ 唯一权威存储（人工修订只改这里）
│   ├── index.json                   总索引（法规数 / 条文数 / 字数 / 分层分布）
│   ├── 无本地原文清单.csv            仅目录登记、无本地正文的条目（无 BOM）
│   └── <法规ID>.json            17,616 个
├── intl/  cn/  fulltext/         ← 派生分卷 JS（App 运行时加载单元，勿手工编辑）
├── trans/                            译文层（与官方原文物理分离）
├── dataset-core.js  dataset-extra.js  基础数据集（元数据 + 条文 + 术语/条约/案例）
├── cn-catalog.js  intl-catalog.js     目录层
└── i18n-*.js  asean-map.js            界面文案与地图
```

**为什么是双轨**：App 是零依赖静态 SPA，`file://` 下不能 `fetch()` JSON，
靠 `<script src>` 注入分卷懒加载（`assets/js/core/fulltext.js`）。
因此 JSON 作权威存储、JS 分卷作构建产物，二者由脚本保持同步。

**构建流程**（改动 `laws/` 后必须依次执行）：

```bash
node _work/merge/build-canonical.js   # 可选：从旧分卷重建 laws/（--dry 试运行）
node _work/merge/build-packs.js       # 从 laws/ 重建 intl|cn|fulltext 分卷 + manifest
node _work/merge/fix-catalog.js       # 去重留痕同步到 intl-catalog.js（仅去重时需要）
node _work/build-no-fulltext-inventory.js   # 重建无本地原文清单
```

**单法 JSON 契约**（超集：dataset 骨架 + 原四层增量）：

```jsonc
{
  "id": "BN-COMPANIES-CAP39",
  "title": { "zh": null, "en": "Companies Act (Chapter 39)", "orig": null },
  "country": "BN", "countryName": "文莱",
  "layer": "fulltext",        // fulltext(A 法域全文层) | cn(B 中国全量层) | intl(C 东盟分卷层)
  "pack": "bn",               // 派生分卷名
  "language": "en", "level": "law", "category": null, "status": "active",
  "promulgatedDate": "1956-01-01", "effectiveDate": "1956-01-01",
  "versionDate": null, "amendedNote": null,
  "issuingBody": "文莱苏丹陛下政府", "docNumber": "Chapter 39",
  "officialCode": null, "topics": [], "structure": null,
  "summary": null,            // 检索用摘要（可多语种对象）
  "fulltextMeta": null,       // App 兼容：分卷 CALR_FULLTEXT_META 的原文
  "coverage": "full", "structureMode": null,
  "articleCount": 384, "chars": 491413,
  "source": { "name": "文莱总检察署法规库（AGC Brunei）", "url": "https://…" },
  "sourceFile": null, "fetchedAt": "2026-10-02",
  "completenessNote": "全文：Section 1–324…",
  "textQuality": "official-pdf-ocr-minor-repaired", "ocrNoisySections": [], "pdfs": null,
  "duplicateOf": null,        // 去重留痕：非 null 表示本条为重复登记
  "articles": [
    { "id": "BN-COMPANIES-CAP39-A1", "no": 1,
      "noLabel": { "en": "Section 1" }, "chapter": { "en": "…" }, "heading": { "en": "Citation" },
      "text": { "en": "This Act may be cited as the Companies Act." },
      "paragraphs": [], "sourceUrl": null, "status": null, "amendedNote": null }
  ]
}
```

**类型约定**：`title` / `noLabel` / `chapter` / `heading` / `text` **一律为按语种分键的对象**
（`text` 保持对象是译文层 `mergeTrans` 的前提，见 §6）；其余标量字段为字符串或 `null`。

**兼容性要求**：改动 `laws/` 后必须重建分卷，并确认

```bash
node _work/merge/check-resolve.js   # 每部法都能被 packFor() 解析到实际存在的分卷
node _work/verify-fulltext.js       # FAILED=0
tools/verify-data.js                # 通过
```


## 5. 识别条件：本项目如何找到一部法的条文

加载器 `prototype/assets/js/core/fulltext.js` 的 `packFor(lawId)` **按固定顺序**查找：

```js
function packFor(lawId) {
  // ① 法域层：fulltext/manifest.js
  if (CALR_FULLTEXT_MANIFEST.byLaw[lawId]) return { kind:'jurisdiction', file: byLaw[lawId] };
  // ② 中国全量层：cn-catalog.js 中该条目的 pack 字段
  for (law in CALR_CN_CATALOG.laws)
    if (law.id === lawId && law.pack) return { kind:'cn', file: law.pack };
  // ③ 东盟层：intl/manifest.js
  if (CALR_INTL_MANIFEST.byLaw[lawId]) return { kind:'intl', file: byLaw[lawId] };
  return null;   // ④ 查不到 → 界面显示「本条仅收录条目信息」
}
```

**实际文件路径**：

| kind | 加载路径 |
| :--- | :--- |
| `jurisdiction` | `data/fulltext/<file>.js` |
| `cn` | `data/cn/<file>.js` |
| `intl` | `data/intl/<file>.js` |
| 译文（独立通道） | `data/trans/<file>.js` |

**新增一部法时，必须同时更新对应的索引**，否则条文文件存在但永远加载不到：

| 加到哪一层 | 要更新 |
| :--- | :--- |
| A 法域层 | `data/fulltext/manifest.js` 的 `files[]`（若新法域）与 `byLaw{}` |
| B 中国全量层 | `data/cn-catalog.js` 中该法规对象的 `pack` 字段 |
| C 东盟层 | `data/intl/manifest.js` 的 `files[]`（该卷的 `laws[]`、`articles`）与 `byLaw{}` |
| D 译文层 | `data/trans/manifest.js` 的 `files[]` 与 `byLaw{}` |

### 索引文件格式

```js
/* data/fulltext/manifest.js */
root.CALR_FULLTEXT_MANIFEST = {
  version: '1.0.0',
  updatedAt: '2026-10-06',
  files: ['bn','cn','la','my','my-2','ph','ph-2','th'],   // 法域代码 / 文件名（不含 .js）
  byLaw: { 'CN-FIL-2019': 'cn', 'BN-H001': 'bn' }         // lawId → 文件名
};

/* data/intl/manifest.js */
root.CALR_INTL_MANIFEST = {
  files: [ { file:'bn-p01', country:'BN', laws:['BN-H001',…], articles: 1189 } ],
  byLaw: { 'BN-H001': 'bn-p01' }
};
```

---

## 6. ★ 译文层规范（D 层，与官方原文分离）

> **本节定义「译文存进哪里、长什么样」（存储契约）。**
> **「怎么把原始数据交给翻译 agent、它必须回传什么」（生产契约）另见
> [`rules/SKILL-多国法律文本译本生产规范.md`](./SKILL-多国法律文本译本生产规范.md)（`calr-trans-v2`）。**
>
> 分工：
>
> | | 文件 / 工具 | 回答的问题 |
> | :--- | :--- | :--- |
> | 存储契约 | 本节（§6） | 译文最终以什么结构落在 `prototype/data/trans/` |
> | 生产契约 | [`rules/SKILL-多国法律文本译本生产规范.md`](./SKILL-多国法律文本译本生产规范.md) | 翻译 agent 拿到什么、回传什么、格式如何机检 |
> | 机检工具 | `tools/verify-trans-return.js` | 回执是否合格（翻译 agent 自检 + 入库方收件校验） |
> | 任务包导出 | `_work/trans/export-job.js` | 从 `laws/` 生成可下发的任务包 |
>
> 翻译 agent **必须先读生产契约**；其回执通过 `verify-trans-return.js` 后，
> 再由入库方按本节结构落盘到 D 层。

### 6.1 设计目标

- 官方原文（A/B/C 层）**永不改动**；
- 大模型译文单独成文件，可整批删除而不伤原库；
- 每条译文都记录**引擎、模型、提示词版本、时间、校对状态**，可追溯、可重译；
- 界面读取时在内存中合并，磁盘上始终分离。

### 6.2 文件命名

```
prototype/data/trans/<原分卷名>.<目标语言>.js
```

| 原文位置 | 译文文件 |
| :--- | :--- |
| `data/intl/th-p01.js` | `data/trans/th-p01.zh.js`（译成中文） |
| `data/cn/cn-p01.js` | `data/trans/cn-p01.en.js`（译成英文） |
| `data/fulltext/bn.js` | `data/trans/bn.vi.js` |

> 一个分卷可有多个目标语言版本，互不干扰。
> 若单部法规译文过长（> 2 MB），可单独成卷：`data/trans/<lawId>.<lang>.js`。

### 6.3 译文契约

```js
(function (root) {
  'use strict';
  var TR = root.CALR_TRANS = root.CALR_TRANS || {};

  TR['TH-H001'] = {
    lawId: 'TH-H001',              // ★ 与键一致
    sourceLang: 'th',              // ★ 原文语言，必须与 A/B/C 层的 language 一致
    targetLang: 'zh',              // ★ 译文语言
    engine: 'llm',                 // llm | mt | human
    model: 'deepseek-chat',        // 具体模型名
    promptVersion: 'calr-trans-v1',// 提示词版本，便于重译比对
    translatedAt: '2026-10-06',    // YYYY-MM-DD
    reviewed: 'machine',           // machine | hybrid | human
    glossaryVersion: '2026-10',    // ⭕ 使用的术语表版本（保证术语一致）
    completenessNote: '全篇逐条对译，共 3 条；条文编号与原文一一对应。',
    articles: [
      {
        no: 8,                     // ★ 必须与原文条文的 no 完全对应
        noLabel: { zh: '第八条' },  // ⭕ 译文的条号写法
        heading: { zh: '…' },       // ⭕ 译文的条文标题
        text: { zh: '……' }          // ★ 译文正文，键必须是 targetLang
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
```

| 字段 | 必填 | 约束 |
| :--- | :---: | :--- |
| `lawId` | ✅ | 与对象键一致 |
| `sourceLang` | ✅ | 必须等于原文层该法规的 `language` |
| `targetLang` | ✅ | 译文语言，见 §3.1 语言代码 |
| `engine` / `model` | ✅ | 便于质量追溯与重译 |
| `promptVersion` | ✅ | 提示词版本 |
| `translatedAt` | ✅ | `YYYY-MM-DD` |
| `reviewed` | ✅ | `machine`（未校对）/ `hybrid`（部分人工）/ `human`（已人工校对） |
| `articles[].no` | ✅ | **必须能在原文中找到同号条文**（校验器会警告孤儿条） |
| `articles[].text` | ✅ | 键必须是 `targetLang` |
| `completenessNote` | ⭕ | 完整性说明 |

**条号对齐是硬性要求**：译文的 `no` 必须与官方原文一一对应。
若官方原文跳号（如第 5 条后是第 7 条），译文照抄同样跳号，**不得自行补号**。

### 6.4 译文索引

```js
/* data/trans/manifest.js */
root.CALR_TRANS_MANIFEST = {
  version: '1.0.0',
  updatedAt: '2026-10-06',
  files: [
    { file: 'th-p01.zh', country: 'TH', sourceLang: 'th', targetLang: 'zh',
      laws: ['TH-H001'], articles: 3, engine: 'llm', model: 'deepseek-chat', reviewed: 'machine' }
  ],
  byLaw: { 'TH-H001': { 'zh': 'th-p01.zh' } }   // lawId → { 目标语言: 分卷名 }
};
```

### 6.5 加载与合并（已在代码中实现）

```js
CALR.fulltext.transPackFor(lawId, 'zh')   // → 'th-p01.zh' | null
CALR.fulltext.ensureTrans(lawId, 'zh')    // 加载分卷并合并到内存，返回 Promise<boolean>
CALR.fulltext.transEntry(lawId, 'zh')     // → 译文对象
CALR.fulltext.transMerged(lawId, 'zh')    // → 是否已合并
CALR.fulltext.transStats()                // → { packs, laws, articles, langs }
```

法规详情页在渲染时会自动按当前界面语言调用 `ensureTrans`，
把译文合并进内存中的条文对象（`a.text[目标语言]`），**磁盘文件不变**。
合并后阅读模式「原文＋译文／仅原文／仅译文」即可正常切换。

### 6.6 译文质量红线

1. **不得改写、删节、合并条文**；不得出现 `……`、`（略）`、`待补`。
2. **不得把译文写回 A/B/C 层**（违反 §4.3）。
3. **术语必须与 `dataset-extra.terms` 一致**；新术语先补术语表再翻译。
4. 法条编号、日期、金额、机构名**必须逐字对应**，不得意译。
5. 无法确定的译文宁可留空并在 `completenessNote` 说明，**不得臆造**。
6. 译文中不得出现「以上译文由 AI 生成，仅供参考」之类的免责话术——
   免责声明由界面统一呈现，译文文件只放正文。

---

## 7. 入库工作流

### 7.1 抓取官方原文（补充 A/B/C 层）

```
1. 从 docs/_archive-2026-10-24/11-无本地原文清单.md 或 materials/_archive-2026-10-24/无本地原文清单.csv 认领条目
2. 访问该条目的官方来源（清单中的「官方链接」列）
3. 逐字提取条文 → 按 §4.1 / §4.2 组装对象
4. 判断应落在哪一层：
     · 该国已有 data/intl/<cc>-pNN.js → 追加到该国最后一个分卷
     · 中国法规 → 追加到 data/cn/cn-pXX.js，并在 cn-catalog.js 登记 pack
     · 需要进入精选集 → 新建/追加 data/fulltext/<cc>.js 并更新 manifest
5. 更新索引（§5 的对应表）
6. 把目录条目的 coverage 由 'catalog' 改为 'full'，并补 articleCount / textLang
7. node --check 新增文件
8. node tools/verify-data.js        → 必须「全部通过」
9. node _work/build-no-fulltext-inventory.js   → 刷新无原文清单
```

### 7.2 生成大模型译文（填充 D 层）

> **2026-10-14 起，本节的「怎么译、译成什么结构」已独立成生产契约：**
> [`rules/SKILL-多国法律文本译本生产规范.md`](./SKILL-多国法律文本译本生产规范.md)（`calr-trans-v2`）。
> **翻译 agent 只读那份**；本节只负责「落盘到哪里、长什么样」。

**标准流程（两阶段）**：

```
Phase 0 · 术语表建设（一个目标语言一个 agent）
  1. node _work/trans/build-glossary-v2.js
       → 生成 _work/trans/glossaries/glossary-<lang>.json（schema v2，含 domain/义项/待填标记）
  2. 术语 agent 填满所有 status=pending 的条目 → glossary-<lang>.filled.json
  3. node tools/verify-glossary.js <filled.json>    → 必须「全部通过」（不带 --allow-pending）

Phase 1 · 条文翻译（多 agent 并行）
  4. node _work/trans/export-job.js --lang <lang> --country CN --shard-size 150
       → 生成任务包（自动分片 + sha256 + 挂 Phase 0 的术语表）
  5. 翻译 agent 按生产契约产出回执包
  6. node tools/verify-trans-return.js <回执包> --job <任务包> [--partial]
       → 必须「全部通过」
  7. node _work/trans/build-receipt.js <任务包> <回执包>   （若 agent 未自产 receipt）
  8. node _work/trans/ingest-trans.js  <任务包> <回执包>   → 落 D 层
  9. node tools/verify-data.js        → 必须「全部通过」
 10. node tools/test-trans-layer.js   → 译文层机制自测「全部通过」
```

**关键约束**：

- 原文层（A/B/C）**永不改动**；译文只经 `_work/trans/ingest-trans.js` 写入 D 层
- 回执未通过 `verify-trans-return.js` **不得落盘**（红线）
- 术语表未通过 `verify-glossary.js` **不得开始 Phase 1**——否则各分片会各自发明术语
- 译文的 `provenance`（engine/model/promptVersion/translatedAt/reviewed/glossaryVersion）由
  `ingest-trans.js` 原样带入 D 层，可追溯、可整批重译

---

## 8. 红线（违反即判不合格）

| # | 红线 | 说明 |
| :---: | :--- | :--- |
| 1 | **逐字不节选** | 条文必须与官方来源逐字一致。禁止改写、概括、合并、精简、补全；禁止 `……`、`（略）`、`摘录`、只录前若干条 |
| 2 | **不编造** | 条号、标题、正文、日期都必须来自实际抓取的官方页面。抓不到就**不写入**，登记为未获取 |
| 3 | **来源可追溯** | 每部法必须有 `sourceName` / `sourceUrl` / `fetchedAt` |
| 4 | **语言标注准确** | `language` 必须是官方文本的**实际语言**；**译文不得冒充原文**（§4.3、§6） |
| 5 | **译文分离** | 大模型译文只能进 D 层，绝不能写进 `text[]` |
| 6 | **id 唯一且稳定** | 同层内不重复；不同修订版用不同年份 |
| 7 | **索引同步** | 新增条文必须同步更新对应 manifest / catalog，否则加载不到 |
| 8 | **不引入依赖** | 禁止 `import`/`export`/`require`/`fetch`；必须能在 `file://` 下运行 |
| 9 | **不修改他人文件** | 尤其禁止改 `dataset-core.js` 来新增法规（会造成多文件互相覆盖） |
| 10 | **不复制版式与第三方译文** | 法条正文可收录；官方公报的版式、数据库编排、第三方译文可能受著作权保护，不得复制 |

---

## 9. 交付前自检清单

```
[ ] C1  条号连续：articles.map(a=>a.no) 从首条到末条连续
        （官方跳号者须在 completenessNote 说明）
[ ] C2  条数一致：articleCount === articles.length
[ ] C3  首末条对齐：首条 = 官方第一条，末条 = 官方最后一条
[ ] C4  无省略标记：全文不含 ……、（略）、（下略）、摘录、节选、待补
[ ] C5  无网页噪声：不含导航词、广告、点赞、分享、版权行
[ ] C6  语法合法：node --check 通过
[ ] C7  来源可回访：重新抓取 sourceUrl 能看到同样的首条与末条
[ ] C8  索引已更新：manifest / catalog 中的 byLaw 或 pack 已登记
[ ] C9  目录一致：coverage 已由 catalog 改为 full，articleCount / textLang 已同步
[ ] C10 译文分离：text 内只有官方语言键；译文在 data/trans/ 且 manifest 已登记
[ ] C11 条号对齐：译文每条 no 都能在原文中找到对应条
[ ] C12 全量校验：node tools/verify-data.js 输出「校验结果：全部通过」
[ ] C13 清单刷新：node _work/build-no-fulltext-inventory.js 已重跑
```

---

## 10. 常见错误与排错

| 现象 | 原因 | 处理 |
| :--- | :--- | :--- |
| 条文文件存在，但页面显示「本条仅收录条目信息」 | 索引没登记（`byLaw` / `pack` 缺） | 按 §5 补索引 |
| 校验器报 `articleCount ≠ articles.length` | 手改了条文没改计数 | 同步数字 |
| 校验器报「同一目录层内 id 重复」 | 同名不同版本的法规共用了 id | 按 §4.4 用年份区分，加 `idRenamedFrom` |
| 校验器警告「text 含多个语种」 | 可能把译文写进了原文 | 若是官方双语版，在 `sourceName` 注明；否则移到 D 层 |
| 校验器警告「存在条文缺少原文语言键」 | 某条 `text` 里没有 `language` 声明的语言键 | 补齐该语言原文 |
| 校验器报「译文条文在原文中找不到对应条」 | `no` 对不上 | 按原文条号重排 |
| 页面打开是白屏 | 脚本语法错误或用了 `import` | `node --check` 逐文件排查 |
| 中文界面出现其他语言 | 缺 i18n 键 | 补 `data/i18n-*.js`（与本文件规范无关，见 `docs/08`） |

---

## 11. 参考文件

| 文件 | 用途 |
| :--- | :--- |
| `tools/verify-data.js` | **数据层校验器**（交付前必跑） |
| `tools/templates/trans-pack.template.js` | **译文分卷模板**（复制后填写） |
| `tools/test-trans-layer.js` | 译文层机制自测（验证分离存储与条号合并） |
| `_work/build-no-fulltext-inventory.js` | 生成无本地原文清单 |
| `docs/_archive-2026-10-24/11-无本地原文清单.md` | 无原文条目可读清单（自动生成） |
| `materials/_archive-2026-10-24/无本地原文清单.csv` | 无原文条目 18 列明细（自动生成） |
| `prototype/assets/js/core/fulltext.js` | 条文与译文的加载实现 |
| `prototype/data/fulltext/manifest.js` | A 层索引 |
| `prototype/data/intl/manifest.js` | C 层索引 |
| `prototype/data/trans/manifest.js` | D 层（译文）索引 |
| `docs/_archive-2026-10-24/06-全文数据规范.md` | v1.0 旧规范（仅覆盖 A 层，已被本文件取代） |

---

## 12. 一句话总结

> **元数据说「这部法是什么」，A/B/C 层放「官方原文逐字」，D 层放「大模型译文」，三层靠 id 与 `no` 对齐。**
> **官方原文永不掺入译文；译文永不写回原文层；新增条文必须同步索引并跑通 `tools/verify-data.js`。**
