# SKILL · 印尼语法规英译规范（calr-id-en-v1）

> **这份文件是「英译 agent」与本项目（入库方）之间关于印尼法规英译的唯一契约。**
> 产出仅用于数据库展示与检索，**不是**官方译本、**不是**法律意见。
> 但必须做到：**不增、不删、不合并、不编造**；法条语气、层级编号、交叉引用必须与原文严格对应。

- 版本：`calr-id-en-v1`（2026-10-26）
- 适用：中国—东盟法律法规数据库（CALR）· 印度尼西亚法规 `id → en`
- 对象：`title`（标题）与 `articles[].text`（条文正文）
- 中文对照版见 `rules/SKILL-法规标题英译规范.md`（zh → en，仅标题）；本规范为其印尼语对应版本，并扩展到**条文正文**
- 配套脚本目录（随首批任务落地）：`_work/id-en/`，模式参照 `_work/title-en/`

---

## 0. 一句话说清你要做什么

把任务包里的印尼语法律文本**逐条**译成 `manifest.targetLang` 指定的语言（本项目当前为 `en` 与 `zh`），按第 2 节的回执契约交回。

**你不做的事**：不做法律评论、不写摘要、不写免责声明、不"顺手"修正原文、不补充原文没有的条、款、号、机构。

---

## 1. 任务包长什么样（沿用 calr-trans-v2.2，不另立格式）

条文层**不另立格式**，完全复用《多国法律文本译本生产规范》的 `CALR-TRANS-<jobId>/` 任务包：

```
CALR-TRANS-<jobId>/
├── manifest.json      sourceLang="id"；targetLang="en" 或 "zh"；逐法条数与源哈希、shards
├── glossary.json      强制术语表（id→en 或 id→zh，版本写在 manifest）
├── laws/<lawId>.json  单部待译法规，articles[].text.id 为印尼语原文
└── README.txt
```

印尼语特有约定：

- `sourceLang` 固定 `id`；`laws/<lawId>.json` 中 `articles[].text` 的源语言键为 `id`
- 单次回执 ≤ **200 条**、≤ 2 MB（原规范 §1.2 强制分片）
- 标题层单独走 `titles.json`，字段见 §A 的 A1（结构与 CN 的 `CALR-TITLE-*` 一致）

**双语产出 = 两个独立 job**：同一部法分别建立 `targetLang=en` 与 `targetLang=zh` 的任务包，各自独立回执、独立入库。中文译本的总体规则受《多国法律文本译本生产规范》约束；本规范补足印尼语 → 英文的语言规则（A、B 两部分）。

**规模参考（2026-10-26 实测）**：36 部法律，源数据 8,724 条记录、约 443 万字符。其中 19 部「条号连续」的法规存在爬取分段问题——长条文被切成多条却复用同一 `Pasal` 编号，已由 `_work/id-en/normalize-source.js` 按续段合并（如 ID-H032 由 377 条记录还原为 161 条），合并后全部 36 部共 7,840 条待译条文。条号不连续的 17 部（如综合就业法 ID-H012，多个被修正法律的 `Pasal 5` 共用编号）**不得合并**，需先人工确认切分口径，暂缓进入翻译。

**首轮实测修正（2026-10-26）**：条号不连续的 16 部中，有 6 部只是「条号唯一但起始号不为 1 或有跳号」（ID-H016/H020/H067/H068/H069/H070），可按记录 1:1 翻译；其余 10 部（ID-H011/H012/H019/H031/H034/H035/H040/H043/H047/H053）存在真正的重复条号或错序，需先修复源数据。另有 **ID-H002** 标题为《2016 年第 13 号专利法》，但 `articles` 正文实为 1945 年宪法全文，已在 `laws/ID-H002.json` 标记 `translationHold` 并暂停翻译（专利法以 ID-H034 为准）。

---

## 2. 你要交什么（沿用 calr-trans-v2.2 §2）

回执结构、`receipt.json` 覆盖度自证、`returns/<lawId>.<shardId>.json`、`glossary-additions.json`、`unresolved.json` 一律按《多国法律文本译本生产规范》§2 执行，本规范不重复定义，仅补充三条印尼语专属要求：

1. `articles[].text.<targetLang>` 必须保留原文的编号行（`1.` `a.` `(1)`）与分段（`\n\n`）；不得把编号行并入正文段落。
2. `articles[].heading` / `chapter` **原文有才写**；原文的 `BAB` 只填入已存在的 `chapter` 字段，译为 `CHAPTER …`；`Bagian` 同理译为 `Part …`。
3. `noLabel` 原文为 `Pasal 5` 时，目标语文可直接沿用 `Article 5` / `第 5 条`，不另造格式。

**标题层回执**（仅标题任务）：

```
CALR-ID-TITLE-<jobId>-RETURN/
├── receipt.json      {jobId, engine, model, counts{requested,translated,skipped}, selfCheck}
└── titles.001.json   {jobId, shard, items:[{id, en, note?}]}
```

`items[].id` 原样返回；一条不多、一条不少；`translated + skipped = requested`。

---

## 3. A 部分 · 标题英译（A1–A6）

### A1 · 先还原官方印尼语标题，再译
数据库里的 `title.en` 有时是**文件名或缩写**（例如 `UU40-2007PerseroanTerbatas 2007`、`税法税务 harmonisasi`），不是真正的标题。遇到这种情况：

1. 先看 `docNumber` / `title.zh` / 首条正文，还原为规范印尼语标题（如 `Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas`）
2. 再译为英文
3. **不得编造**编号与年份；确实无法还原时，按能确认的部分翻译，并在 `note` 注明依据

### A2 · 官方标题格式
```
[法令类型] No. [编号] of [年份] on [事项]
```
| 印尼语 | 英文 |
| :--- | :--- |
| Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas | Law No. 40 of 2007 on Limited Liability Companies |
| Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 | the 1945 Constitution of the Republic of Indonesia |
| Peraturan Pemerintah Nomor 35 Tahun 2021 tentang … | Government Regulation No. 35 of 2021 on … |
| Peraturan Presiden Nomor 10 Tahun 2021 tentang … | Presidential Regulation No. 10 of 2021 on … |
| Peraturan Menteri … | Ministerial Regulation … |
| Peraturan Otoritas Jasa Keuangan Nomor … | Financial Services Authority Regulation No. … |
| Peraturan Bank Indonesia Nomor … | Bank Indonesia Regulation No. … |
| Peraturan Daerah Nomor … | Regional Regulation No. … |
| Peraturan Mahkamah Agung Nomor … | Supreme Court Regulation No. … |
| Keputusan Presiden Nomor … | Presidential Decree No. … |
| Instruksi Presiden Nomor … | Presidential Instruction No. … |
| Surat Edaran Nomor … | Circular Letter No. … |
| Ketetapan MPR Nomor … | Decree of the People's Consultative Assembly No. … |

### A3 · 修正与更名
| 印尼语 | 英文 |
| :--- | :--- |
| Perubahan Pertama / Kedua / Ketiga | the First / Second / Third Amendment |
| … sebagaimana telah diubah dengan Undang-Undang Nomor X Tahun Y | … as amended by Law No. X of Y |
| … sebagaimana telah diubah terakhir dengan … | … as last amended by … |
| Penetapan Peraturan Pemerintah Pengganti Undang-Undang … menjadi Undang-Undang | the Enactment of Government Regulation in Lieu of Law … into Law |
| Mencabut … | Repealing … |

### A4 · 事项部分
`tentang …` 之后的事项按法律术语直译，保持名词短语，不加动词、不加年份：
- `tentang Perseroan Terbatas` → `on Limited Liability Companies`
- `tentang Cipta Kerja` → `on Job Creation`
- `tentang Pelindungan Data Pribadi` → `on Personal Data Protection`
- `tentang Merek dan Indikasi Geografis` → `on Marks and Geographical Indications`

### A5 · 长度与形态
标题长度 5–300 字符；只输出标题，不输出摘要、不输出条文、不加 "This Law regulates…"。

### A6 · 无标题数据
`id_title` 为空且无法还原时，标题层跳过（计入 `skipped`），**不要**用中文标题机译充数。

---

## 4. B 部分 · 条文正文英译（B1–B8）

### B1 · 一条对一条
任务包有几条就交几条。**不合并相邻条文、不拆分单条、不漏 ayat、不改 id**。
原文一条内含多个编号项（`1.` `a.` `(1)`）时，译文保留同样的编号行。

### B2 · 层级与编号同构
| 印尼语 | 英文 | 说明 |
| :--- | :--- | :--- |
| BAB I | CHAPTER I | 章 |
| Bagian Kesatu | Part One | 节 |
| Paragraf 1 | Paragraph 1 | 段 |
| Pasal 5 | Article 5 | 条 |
| ayat (2) | paragraph (2) | 款 |
| huruf a | letter a | 项 |
| angka 1 | item 1 | 目 |
| Penjelasan | Elucidation | 说明（印尼官译惯例用 Elucidation） |

段落首的 `(1)` `(2)` 原样保留；`a.` `b.` 原样保留；不要在译文中改用中文式"第一款"。

### B3 · 情态动词与规范用语（**最重要**）
| 印尼语 | 英文 | 禁用译法 |
| :--- | :--- | :--- |
| wajib | shall | should / must（除强调义务外不用） |
| harus | must | need to |
| dapat | may | can（法条中统一 may） |
| berhak | is entitled to | has the right |
| dilarang | is prohibited | cannot |
| tidak boleh | may not | must not（除非原文语气更强） |
| diwajibkan | is required to | — |
| berwenang | is authorised to | has authority |
| bertanggung jawab | is responsible | — |
| dikenai sanksi | is subject to sanctions | will be punished |
| paling sedikit / paling banyak | at least / at most | minimum / maximum（作定语时可用） |
| paling lama / paling singkat | for a maximum of / at least | — |
| selambat-lambatnya | no later than | at the latest |
| dalam hal | in the event that / where | in the case of（易歧义） |
| sepanjang | insofar as | as long as |
| kecuali | unless / except | — |
| dengan ketentuan | provided that | — |
| sesuai dengan | in accordance with | according to |
| berdasarkan | based on / under | — |
| sebagaimana dimaksud dalam | as referred to in | as intended in |
| berlaku | shall apply / is valid | — |
| mulai berlaku | shall come into force | — |
| dicabut dan dinyatakan tidak berlaku | is revoked and declared invalid | is cancelled |
| tetap berlaku | shall remain in force | — |
| untuk kepentingan | for the purposes of | — |
| atas permintaan | at the request of | — |
| paling lambat | no later than | — |

### B4 · 交叉引用格式统一
```
sebagaimana dimaksud dalam Pasal 5 ayat (2) huruf a
→ as referred to in Article 5 paragraph (2) letter a

Pasal 10 sampai dengan Pasal 15
→ Articles 10 through 15

Pasal 7 dan Pasal 9
→ Article 7 and Article 9
```
引用自身时用 `this Law` / `this Article`，不用 `the said Law`。

### B5 · 数字、货币、日期
- 数字不规范改写数值：`Rp 1.000.000.000` → `Rp1,000,000,000`（千分位改为英文逗号，数值不变）
- 不换算币种、不折算汇率、不改日期：`31 Desember 2007` → `31 December 2007`
- 印尼语月份：Januari/Februari/Maret/April/Mei/Juni/Juli/Agustus/September/Oktober/November/Desember
- 百分比 `5% (lima persen)` → 保留 `5%`，括号内文字可译为 `(five per cent)` 或省略；**不要**自行加括号

### B6 · 专名处理
- 公司名、人名、地名、案件名：保留印尼语原形，**不音译、不意译**（如 `PT Astra International Tbk`、`Bank Indonesia`）
- 机构名首次出现时用官方英文名，其后用缩写：`Otoritas Jasa Keuangan (OJK)` → `the Financial Services Authority (OJK)`
- 常见机构：DPR = House of Representatives；MPR = People's Consultative Assembly；MA = Supreme Court；MK = Constitutional Court；BI = Bank Indonesia；OJK = Financial Services Authority；BPK = Audit Board；KPPU = Business Competition Supervisory Commission；BPJS = Social Security Administering Body；BKPM = Investment Coordinating Board；DJP = Directorate General of Taxes
- 未在原文出现的英文全称**不得**自行补入

### B7 · 固定套语
| 印尼语 | 英文 |
| :--- | :--- |
| Dengan Rahmat Tuhan Yang Maha Esa | By the Grace of God Almighty |
| PRESIDEN REPUBLIK INDONESIA | PRESIDENT OF THE REPUBLIC OF INDONESIA |
| Menimbang | Whereas |
| Mengingat | Considering |
| Memperhatikan | Observing |
| Memutuskan | Decides |
| Menetapkan | Resolves |
| Disahkan di Jakarta pada tanggal | Enacted in Jakarta on |
| Diundangkan di Jakarta pada tanggal | Promulgated in Jakarta on |
| LEMBARAN NEGARA REPUBLIK INDONESIA TAHUN … NOMOR … | STATE GAZETTE OF THE REPUBLIC OF INDONESIA OF … No. … |
| TAMBAHAN LEMBARAN NEGARA REPUBLIK INDONESIA NOMOR … | SUPPLEMENT TO THE STATE GAZETTE OF THE REPUBLIC OF INDONESIA No. … |
| PENJELASAN ATAS … | ELUCIDATION ON … |
| UMUM | GENERAL |
| PASAL DEMI PASAL | ARTICLE BY ARTICLE |
| Cukup jelas | Sufficiently clear |
| Yang dimaksud dengan … adalah … | The term … means … |

### B8 · 原文残缺
OCR 噪声、截断、缺字：**照实翻译可读部分**，不猜测补全，在该条 `note` 写明"原文残缺，按可读部分翻译"。若整条无法辨认，跳过并计入 `skipped`。

---

## 5. 领域术语表（择要）

| 领域 | 印尼语 → 英文 |
| :--- | :--- |
| 公司法 | Perseroan Terbatas → Limited Liability Company；Perseroan → Company；Direksi → Board of Directors；Dewan Komisaris → Board of Commissioners；Rapat Umum Pemegang Saham (RUPS) → General Meeting of Shareholders；anggaran dasar → articles of association；modal dasar → authorised capital；modal ditempatkan dan disetor → issued and paid-up capital；saham → share；pemegang saham → shareholder；penggabungan → merger；peleburan → consolidation；pengambilalihan → acquisition；pemisahan → spin-off；Tanggung Jawab Sosial dan Lingkungan → Social and Environmental Responsibility |
| 劳动法 | Ketenagakerjaan → Labour；tenaga kerja → workforce；pekerja/buruh → worker；pemberi kerja → employer；perjanjian kerja → employment agreement；PKWT → fixed-term employment agreement；PKWTT → indefinite-term employment agreement；hubungan kerja → employment relationship；upah → wages；pesangon → severance pay；pemutusan hubungan kerja (PHK) → termination of employment；serikat pekerja → trade union；alih daya → outsourcing；kerja lembur → overtime work；jaminan sosial → social security |
| 知识产权 | hak cipta → copyright；paten → patent；merek → mark/trademark；indikasi geografis → geographical indication；desain industri → industrial design；rahasia dagang → trade secret；desain tata letak sirkuit terpadu → layout design of integrated circuits；pencipta → author；pemegang hak → right holder；pelanggaran → infringement；lisensi → licence；royalti → royalty |
| 电子信息 | informasi elektronik → electronic information；dokumen elektronik → electronic document；tanda tangan elektronik → electronic signature；sertifikat elektronik → electronic certificate；sistem elektronik → electronic system；penyelenggara sistem elektronik → electronic system operator；transaksi elektronik → electronic transaction；kontrak elektronik → electronic contract；agen elektronik → electronic agent |
| 个人数据 | data pribadi → personal data；subjek data pribadi → personal data subject；pengendali data pribadi → personal data controller；prosesor data pribadi → personal data processor；persetujuan → consent；pelindungan data pribadi → personal data protection |
| 投资 | penanaman modal → investment；penanam modal → investor；penanaman modal asing (PMA) → foreign investment；penanaman modal dalam negeri (PMDN) → domestic investment；hak guna usaha → right to cultivate；hak guna bangunan → right to build；hak pakai → right to use；hak milik → right of ownership |
| 消费者 | pelaku usaha → business actor；konsumen → consumer；klausula baku → standard clause；ganti rugi → compensation；iklan → advertisement |
| 税务 | pajak penghasilan → income tax；pajak pertambahan nilai (PPN) → value added tax (VAT)；pajak penjualan atas barang mewah (PPnBM) → sales tax on luxury goods；bea meterai → stamp duty；wajib pajak → taxpayer；NPWP → taxpayer identification number；sanksi administratif → administrative sanction |
| 程序 | arbitrase → arbitration；mediasi → mediation；konsiliasi → conciliation；pengadilan negeri → district court；pengadilan tinggi → high court；Mahkamah Agung → Supreme Court；putusan → judgment/decision；gugatan → claim/lawsuit；penggugat → plaintiff；tergugat → defendant |

术语表未覆盖的，按印尼法律通行英文译法处理；同一术语在同一批任务内必须**译法一致**。

---

## 6. 交付前自检（C1–C10）

| # | 检查项 | 判据 |
| :--- | :--- | :--- |
| C1 | `allIdsReturned` | 任务包每个 id 都在回执中出现 |
| C2 | `noExtraIds` | 无任务包之外的 id |
| C3 | `noDuplicateIds` | 同一 id 只出现一次 |
| C4 | `noUntranslated` | 无一条 `en` 与 `id_text` 完全相同 |
| C5 | `allNonEmpty` | 每条 `en` 非空 |
| C6 | `structurePreserved` | `Pasal/ayat/huruf` 层级与编号项数量不变 |
| C7 | `noResidualIndonesian` | 译文中不残留印尼语功能词（`dan` `atau` `yang` `dalam` `dengan` `tersebut` `sebagaimana`） |
| C8 | `noBoilerplate` | 无 `Disclaimer/TBD/TODO/待译/for reference only` |
| C9 | `noAddedNumbers` | 未出现原文没有的条款号、年份、金额 |
| C10 | `jsonValid` | JSON 可解析、UTF-8 无 BOM |

C7 例外：专名（`PT …`、`Bank Indonesia`、`OJK`）与原文引用的印尼语法律名称可保留。

---

## 7. 红线（违反即整批退回）

1. 不得编造条文、款项、编号、年份、金额、机构
2. 不得合并或拆分条文，不得漏 ayat
3. 不得写摘要、评论、免责声明、译注式长文
4. 不得把 `wajib` 译成 `should`、把 `dapat` 译成 `must`（法律效力被改写）
5. 不得不同 id 之间错配译文
6. 不得因 OCR 残缺失真而"猜写"内容；无法辨认就跳过并计入 `skipped`
7. 不得混入第三种语言：`targetLang=en` 时不得输出中文，`targetLang=zh` 时不得输出英文整句；除专名与原文引用的印尼语名称外不得残留印尼语

---

## 8. 入库方会怎么处理你的回执

```bash
# 1) 校验回执包（格式、覆盖度、漏条/串条）
node tools/verify-trans-return.js <回执包目录>

# 2) 入库（写 prototype/data/laws/<lawId>.json 的 title.en 与 articles[].text.en / .zh）
node _work/id-en/apply-id-en.js --dry    # 试运行，不落盘
node _work/id-en/apply-id-en.js

# 3) 同步目录层（prototype/data/intl-catalog.js 的 title.en）
node _work/id-en/sync-catalog.js
```

入库后结构：

```json
"title": { "zh": "公司法", "en": "Law No. 40 of 2007 on Limited Liability Companies" },
"articles": [
  { "id": "ID-H032-A1", "no": 1,
    "text": { "id": "Dalam Undang-Undang ini ...", "en": "In this Law, ..." } }
]
```

界面逻辑与中文法规一致：非中文界面显示 `English（中文原名）`，条文正文按界面语言取 `text.en`。

---

## 9. 开始前的 4 个问题

1. 我拿到的是 `articles.json`（每条形如 `{id, lawId, articleNo, id_text}`）—— 对吗？
2. 我交回的是 `arts.001.json` + `receipt.json`，结构如第 2 节 —— 对吗？
3. 我理解 `wajib→shall`、`dapat→may`、`Pasal/ayat/huruf` 必须同构 —— 对吗？
4. 我理解"不编造、不合并、不加套话、原文残缺照实译" —— 对吗？

四个都是"是"，就可以开始了。
