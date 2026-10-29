# 法规标题多语种翻译 · 外发作业规则

> 版本 v1.0（2026-10-29）｜适用：东盟法律数据库标题补齐（vi / th / id / ms / zh / en）
> 本文是唯一作业依据。凡与本文冲突的「更地道」「更通顺」的写法，一律以本文为准。

---

## 0 一句话任务

给你一份 JSONL 清单，每条是一部法规的**已有标题**（英文、印尼文、马来文、泰文或越南文）。请把每条译成清单 `need` 字段里列出、而该条尚缺的语种，**原样回抄 `key`**，按第 2 节格式逐行输出。

**验收口径只有一条**：译名要能直接进数据库、进搜索结果页；不能有半句、不能有英文残句、不能译错数字、不能把机构名瞎音译。宁可原样保留拉丁专名，也不要编一个中文名。

---

## 1 输入格式

每行一个 JSON 对象：

```json
{"key":"PH-H10041","co":"PH","src":"An Act Reconstituting the Lanao Del Norte District Engineering Office ...","lang":"en","need":["vi","th","id","ms"],"dn":"Republic Act No. 11611","have":{"zh":"将北拉瑙省北拉瑙区工程办公室重组为两个单独的区工程办公室并为其拨款"}}
```

> **注意 `key` 与 `id` 的区别**：`key` 是条目编号（`PH-H10041`），`id` 是**印尼语译名**的键名。两者不是一回事，回抄时别混。

| 字段 | 含义 | 怎么用 |
|---|---|---|
| `key` | 条目编号 | **原样回抄**，一个字符都不能改 |
| `co` | 法域（PH/ID/MY/TH/VN/LA/BN…） | 决定第 5 节的国别专项 |
| `src` | 已有标题（源文本） | 翻译依据，**不要改写它**，只输出新语种 |
| `lang` | `src` 的语言（按文字实际判定，可能与 `co` 不一致，例如 TH 的某条只有中文短名，`lang` 就是 `zh`） | 决定从哪种语言起译 |
| `need` | 本条要补的语种 | **只译这些**，不在 `need` 里的语种一个都别输出 |
| `dn` | 文号（如 `Republic Act No. 11611`、`Peraturan Pemerintah Nomor 71 Tahun 2019`） | 数字硬约束的依据，见第 6 节 |
| `have` | 已有译名 | **一致性参照**：已有中文就照它的用词译其余四语；反之亦然。不要推翻 `have` |
| `trunc` | `1` 表示源文本本身没抄全（末尾断在介词/连词上） | 照现有内容译，不加省略号、不猜补全 |
| `note` | 个别条的额外说明 | 只有一条：**源仅有中文短名、无年份无文号**，此时只译名称，不许补年份文号 |

---

## 2 输出格式（硬约束）

**一行一个 JSON，只含 `key` 和 `need` 里的语种键，不要任何其他字段，不要解释，不要代码块围栏，不要行号。**

```json
{"key":"PH-H041","vi":"Đạo luật Cộng hòa Số 7042 (Luật Đầu tư Nước ngoài)","th":"พระราชบัญญัติฉบับที่7042 (พระราชบัญญัติการลงทุนจากต่างประเทศ)","id":"Undang-Undang Republik Nomor 7042 (Undang-Undang Investasi Asing)","ms":"Akta Republik No. 7042 (Akta Pelaburan Asing)"}
```

以上这条 `PH-H041` 是库内定稿，六语齐全，可以照着抄风格。再看三条（同样取自库内定稿，`02-示例-已完成.jsonl` 另有 13 条）：

```json
{"key":"PH-H10000","zh":"授予Bienvenido Morejon Marañon菲律宾公民身份、使其归化为菲律宾公民并享有公民权利的法案","vi":"Đạo luật trao quốc tịch Philippines cho Bienvenido Morejon Marañon","th":"พระราชบัญญัติให้สัญชาติฟิลิปปินส์แก่ Bienvenido Morejon Marañon","id":"Undang-Undang memberikan kewarganegaraan Filipina kepada Bienvenido Morejon Marañon","ms":"Akta memberikan kewarganegaraan Filipina kepada Bienvenido Morejon Marañon"}
{"key":"PH-H10004","zh":"将阿布拉省 Lagangilang 与 Bangued 市镇的阿布拉科学技术国立学院改设为国立大学，名称为阿布拉大学，并为此拨款的法案","vi":"Đạo luật chuyển đổi Abra State Institute of Sciences and Technology thành University of Abra","th":"พระราชบัญญัติเปลี่ยน Abra State Institute of Sciences and Technology เป็น University of Abra","id":"Undang-Undang mengubah Abra State Institute of Sciences and Technology menjadi University of Abra","ms":"Akta menukar Abra State Institute of Sciences and Technology kepada University of Abra"}
{"key":"ID-H069","zh":"电子系统与电子交易运营条例","vi":"Nghị định Chính phủ số 71 năm 2019 về Việc Vận hành Hệ thống và Giao dịch Điện tử","th":"พระราชกฤษฎีกาเลขที่ 71 ปี 2019 ว่าด้วยการดำเนินระบบและธุรกรรมอิเล็กทรอนิกส์","id":"Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik","ms":"Peraturan Kerajaan No. 71 Tahun 2019 tentang Pengendalian Sistem dan Transaksi Elektronik"}
```

**常见违规输出（一律退回）**
- 把译文套在 `{"items":[...]}` 里，或另加 `"confidence"`、`"remark"` 等字段；
- 用 Markdown 表格 / 带序号的列表代替 JSONL；
- 输出 `"vi": "… || An Act Reconstituting …"` 这种「译文 || 原文」兜底——**严禁把原文拼进译名**；
- 只有部分条目（漏条）。漏条可以分多次回复，但每次必须是完整的合法 JSONL 行。

---

## 3 十条铁律

1. **不改原文**：`src`、`have` 只读。只输出 `need` 里的键。
2. **不整句照搬英文**：`zh`/`vi`/`th`/`id`/`ms` 里都不许留英文整句。英文只允许以**专名**形式出现（公司、机构、学校、人名、描笼涯/村名、项目名）。
3. **数字是硬约束**：`dn` 和 `src` 里的编号、年份、条号、金额，必须原样以阿拉伯数字出现（泰语可另有佛历写法）。见第 6 节。
4. **文书类型按术语表**（第 4.2 节），不得自创。同一个类型在同一法域内只许一种译法。
5. **`zh` 不以「一部」「一项」「关于」开头**（「关于」只在第 5.2 节的特定句式里允许，且必须跟「的条例/的决定」收尾）。
6. **`zh` 人名音译并用间隔号**：`Manuel L. Quezon → 曼努埃尔·L·奎松`。**公司、机构、学校名保留拉丁原文**（`Maynilad Water Services, Inc.`、`Blockbuster Broadcasting System, Inc.`），但其中的通用词照译（`Broadcasting System → 广播系统公司`）。
7. **四语（vi/th/id/ms）压缩为题名式短语**：只保留「文书类型 + 核心动作 + 核心对象」。删去 `and Appropriating Funds Therefor`、`for Other Purposes`、`Otherwise Known as …`、逐条列举的节号等枝节。`zh` 相反：**保留全部要件**（对象、范围、例外、拨款），只删节号罗列。
8. **区划通名必须译出**：`Province→省/Tỉnh/จังหวัด/Provinsi/Wilayah`，`Municipality→市镇/…/Kotamadya/Perbandaran`，`City→市/…/Kota/Bandar`，`Barangay→描笼涯`（vi/id/ms 直接写 `Barangay` 属正当写法）。只有它属于机构全名的一部分时才保留英文。
9. **不留残句**：删掉专名后必须重写成通顺完整句。出现 `akan demi di, serta yang oleh` 这类只剩虚词的片段，视为不合格。
10. **长度 2–300 字符**（去首尾空白后）。超长就按第 7 节压缩，不得硬截断在半句上。

---

## 4 语种规则

### 4.1 各语种写法规约

| 语种 | 要求 |
|---|---|
| `zh` | 简体中文。仅在此层允许用《》引简称，且只在括号内：`第10173号共和国法（《数据隐私法》）`。其余层禁止书名号与中文标点 |
| `en` | 英式拼写（organisation / recognise / centre / programme / judgement）。Title Case：实词首字母大写，介词连词小写 |
| `vi` | 带完整声调符号（`Bảo vệ dữ liệu cá nhân`，不许写 `Bao ve du lieu ca nhan`）。Title Case 只在句首与专名 |
| `th` | 泰文连写，**词间不加空格**；只用泰文、阿拉伯数字、拉丁专名；绝不出现汉字。佛历写作 `พ.ศ. ๒๕๖๒`，公历并列写 `(2019)` |
| `id` | 印尼语，不是马来语：`Undang-Undang` / `Perlindungan` / `Data Pribadi` / `Kotamadya` |
| `ms` | 马来语，不是印尼语：`Akta` / `Perlindungan` / `Data Peribadi` / `Perbandaran` / `Wilayah` / `Kerajaan` |

> `id` 与 `ms` 是最容易出错的一对。凡出现 `Peraturan Pemerintah`（id）对 `Peraturan Kerajaan`（ms）、`Undang-Undang`（id）对 `Akta`（ms）、`Pribadi`（id）对 `Peribadi`（ms），不得混用。

### 4.2 文书类型术语表（基准，不得自创）

| 中文 | 英文 | 越南语 | 泰语 | 印尼语 | 马来语 |
|---|---|---|---|---|---|
| 宪法 | Constitution | Hiến pháp | รัฐธรรมนูญ | Undang-Undang Dasar | Perlembagaan |
| 法典 | Code | Bộ luật | ประมวลกฎหมาย | Kitab Undang-Undang | Kanun |
| 法律（议会法） | Act / Law | Luật | พระราชบัญญัติ | Undang-Undang | Akta |
| 法令 | Ordinance | Pháp lệnh | — | — | — |
| 紧急政令 | Emergency Decree | — | พระราชกำหนด | Perppu | — |
| 政府条例 | Government Regulation | Nghị định | พระราชกฤษฎีกา | Peraturan Pemerintah | Peraturan Kerajaan |
| 总统/总理决定 | Decision | Quyết định | คำสั่ง | Keputusan Presiden | Perintah |
| 部长条例 | Ministerial Regulation | Thông tư | กฎกระทรวง | Peraturan Menteri | Peraturan Menteri |
| 通告 | Circular | Thông tư | หนังสือเวียน | Surat Edaran | Pekeliling |
| 公告 | Notification / Proclamation | Thông báo | ประกาศ | Pengumuman | Pemberitahuan |
| 决议 | Resolution | Nghị quyết | มติ | Resolusi | Resolusi |
| 地方条例 | By-law / Local Regulation | Quy chế | ข้อบัญญัติท้องถิ่น | Peraturan Daerah | Undang-Undang Kecil |
| 协定 | Agreement | Hiệp định | ความตกลง | Persetujuan | Perjanjian |
| 公约 | Convention | Công ước | อนุสัญญา | Konvensi | Konvensyen |

### 4.3 菲律宾专属文书类型（PH 量最大，必须严格照此）

| 源（英文） | 中文 | 越南语 | 泰语 | 印尼语 | 马来语 |
|---|---|---|---|---|---|
| Republic Act No. N | 第N号共和国法 | Đạo luật Cộng hòa số N | พระราชบัญญัติฉบับที่ N | Undang-Undang Republik Nomor N | Akta Republik Nombor N |
| Republic Act No. N (简称) | 第N号共和国法（《简称》） | Đạo luật Cộng hòa số N (…) | พระราชบัญญัติฉบับที่ N (…) | Undang-Undang Republik Nomor N (…) | Akta Republik Nombor N (…) |
| Commonwealth Act No. N | 第N号联邦法 | Đạo luật Thịnh vượng chung số N | พระราชบัญญัติเครือจักรภพฉบับที่ N | Undang-Undang Persemakmuran Nomor N | Akta Komanwel Nombor N |
| Presidential Decree No. N | 第N号总统令 | Sắc lệnh Tổng thống số N | พระราชกฤษฎีกาประธานาธิบดีฉบับที่ N | Keputusan Presiden Nomor N | Dekri Presiden Nombor N |
| Executive Order No. N | 第N号行政命令 | Lệnh hành pháp số N | คำสั่งฝ่ายบริหารฉบับที่ N | Perintah Eksekutif Nomor N | Perintah Eksekutif Nombor N |
| Batas Pambansa Blg. N | 第N号国民议会法 | Đạo luật Quốc hội số N | พระราชบัญญัติรัฐสภาฉบับที่ N | Undang-Undang Parlemen Nomor N | Akta Parlimen Nombor N |
| Proclamation No. N | 第N号公告 | Tuyên bố số N | ประกาศฉบับที่ N | Proklamasi Nomor N | Pengisytiharan Nombor N |
| Administrative Order No. N | 第N号行政命令 | Lệnh Hành chính số N | คำสั่งทางปกครองฉบับที่ N | Perintah Administratif Nomor N | Perintah Pentadbiran Nombor N |
| Memorandum Order No. N | 第N号备忘录命令 | Lệnh Bị vong số N | บันทึกคำสั่งฉบับที่ N | Perintah Memorandum Nomor N | Perintah Memorandum Nombor N |
| Municipal Ordinance No. N | 第N号市政条例 | Pháp lệnh Đô thị số N | ข้อบัญญัติเทศบาลฉบับที่ N | Peraturan Kotamadya Nomor N | Peraturan Perbandaran Nombor N |
| Resolution No. N | 第N号决议 | Nghị quyết số N | มติฉบับที่ N | Resolusi Nomor N | Resolusi Nombor N |

区划与机构：`Barangay 描笼涯｜Municipality 市镇｜City 市｜Province 省｜Region 大区｜Sangguniang Panlalawigan 省议会｜Sangguniang Bayan 市镇议会｜Department of … …部｜State University / College 国立大学 / 国立学院｜National High School 国立中学`

---

## 5 分国别专项

### 5.1 PH 菲律宾（源：英文，量最大）

- 长题共同式样：`An Act <动词>ing …, and Appropriating Funds Therefor`。中文写成
  「**〈动宾短语〉，并为此拨款的法案**」，去掉 `An Act` 引导，直接从动词或名词写起。
- 中文**保留要件**，不许压成 8 字泛称。反例：把 `An Act Converting the Abra State Institute … Into a State University, to Be Known as the University of Abra, and Appropriating Funds Therefor` 译成「设立大学法案」——把「阿布拉省」「Lagangilang 与 Bangued 市镇」「阿布拉科学技术国立学院」「改设为国立大学」「名称为阿布拉大学」全丢了。正例见 `02-示例-已完成.jsonl`。
- 四语压缩：只留「文书类型 + 核心动作 + 核心对象」，枝节删净：
  `PH-H10007` 源文 400 余字符 → `vi: Đạo luật gia hạn thêm 25 năm quyền khai thác đã cấp cho Blockbuster Broadcasting System, Inc.`
- 以简称命名的标题（`Data Privacy Act of 2012`、`Foreign Investments Act of 1991`）有约定俗成译名，照用：`2012年数据隐私法`、`1991年外国投资法`。
- 同一部法的不同年份版本，年份必须保留：`1997 年税收改革法` 不等于 `税收改革法`。

### 5.2 ID 印尼（源：印尼文 `id`，需补 zh/en/vi/th/ms）

按源文自称分两种句框，**其余写法一律不合格**：

| 源文开头 | zh | en | vi | th | ms |
|---|---|---|---|---|---|
| `Undang-Undang … tentang X` | `X法`（不带文号） | `Law No. N of YYYY on X` | `Luật số N năm YYYY về X` | `พระราชบัญญัติเลขที่ N ปี YYYY ว่าด้วยX` | `Akta No. N Tahun YYYY tentang X` |
| `Peraturan Pemerintah … tentang X` | `X条例`（不带文号） | `Government Regulation No. N of YYYY on X` | `Nghị định Chính phủ số N năm YYYY về X` | `พระราชกฤษฎีกาเลขที่ N ปี YYYY ว่าด้วยX` | `Peraturan Kerajaan No. N Tahun YYYY tentang X` |

- `zh` **不带文号**，其余四语**带文号**。这是本库的既定口径。
- `zh` 主题为惯用短名（2–12 字）时直译加层级词（`专利法`、`电子商务条例`）；主题为长定语描述（含动作、对象、条件）时用「**关于〈主题〉的〈条例/法〉**」，如 `关于以强制征收令追缴税款中的扣押程序的政府条例`。二者择一，不要混着写。
- 印尼文 `tentang` = `on` / `về` / `ว่าด้วย` / `tentang`；`Nomor N Tahun YYYY` = `No. N of YYYY` / `số N năm YYYY` / `เลขที่ N ปี YYYY` / `No. N Tahun YYYY`。
- **源文多为全大写摘录，可能被截断在半个短语上**（如 `MENETAPKAN UNDANG-UNDANG DARURAT TENTANG HUKUM ACARA`，实际是 `HUKUM ACARA PIDANA`）。照现有内容译，**不猜补全、不加省略号**；能看出缺的是「刑事诉讼法」这类固定搭配时，按最通顺的完整说法译，但不得添加原文没有的年份、文号、条文。

### 5.3 MY 马来西亚（源：马来文或英文，常见全大写）

> **本族最容易犯的错：`vi` 层偷懒照抄马来文。** 马来文与印尼文同源，但与越南文毫无关系。
> `vi` 层必须逐句译成越南文并带声调符号（`Lệnh thu phí và quản lý tư nhân đường liên bang`）；
> 出现 `Peraturan Perbadanan …` 这一类，即判不合格退回。

- 全大写源文先转 Title Case 再译。
- `Akta N` → `Act N` / `第N号法` / `Luật N` / `พระราชบัญญัติ N` / `Akta N`。
- `Perintah …` = Order → `Perintah` / `Order` / `Lệnh` / `คำสั่ง`。
- 各州名称：`Wilayah Persekutuan 联邦直辖区`、`Negeri 州`、`Daerah 县`。

### 5.4 TH 泰国（源：泰文或英文 `B.E. 25xx`）

- 佛历写作 `พ.ศ. ๒๕๖๒ (2019)`。泰文数字与阿拉伯数字**不得混写在同一编号里**。
- `พระราชบัญญัติ`=Act、`พระราชกำหนด`=Emergency Decree、`พระราชกฤษฎีกา`=Royal Decree、`กฎกระทรวง`=Ministerial Regulation、`ประกาศ`=Notification、`คำสั่ง`=Order。
- 若源文是英文（`DISPUTE MEDIATION ACT, B.E. 2562 (2019)`），`th` 层写成泰文标题，`B.E. 2562 (2019)` 保留。

### 5.5 VN 越南（源：越南文）

- `Luật`=Law/Act、`Bộ luật`=Code、`Nghị định`=Decree、`Quyết định`=Decision、`Thông tư`=Circular、`Nghị quyết`=Resolution。
- 编号 `số 65/2006/QH11` 原样照录，不折算。

### 5.6 LA 老挝

- 清单里标 `trunc:1` 的，源文本本身就是截断的（末尾断在 `AND MEDIUM SIZED`、`WILD` 这类词上）。**照现有内容译，不加省略号，不猜补全**。

---

## 6 数字规则（本库翻过车，务必照做）

1. 英文数词先折成阿拉伯数字再译：`Nineteen Hundred and Forty-Six → 1946`、`Two (2) → 2`。
   **翻车实例**：`Nineteen Hundred and Forty` 被译成 `1946 年`——多出了一个 6，整条作废。
2. `dn` 里的编号必须出现在译名里：
   - `Republic Act No. 11611` → 中 `第11611号`、越 `số 11611`、泰 `ฉบับที่ 11611`、印尼 `Nomor 11611`、马来 `Nombor 11611`。
   - `Peraturan Pemerintah Nomor 71 Tahun 2019` → 中不带号（见 5.2），其余四语 `No. 71 of 2019` / `số 71 năm 2019` / `เลขที่ 71 ปี 2019` / `No. 71 Tahun 2019`。
3. 年份一律四位阿拉伯数字。泰语可并列佛历（+543，`2019 → ๒๕๖๒`）。
4. 条款号可以概括（`Amending Sections 5, 6, 24 … and 288` → `修订第5、6、24条等条款`），但 `dn` 里的文号与年份**不可省**。
5. 禁止自行换算货币、禁止把 `Two Hundred Thousand Pesos` 改成约数。

---

## 7 超长标题怎么压

源文超过 300 字符时（PH 常见）：

1. 保留主句（`An Act <动词>ing <核心对象>`）与全部限定成分（地区、机构全名、例外条件）；
2. 删去逐条罗列的节号，改概括：`修订《国家国内税收法》第5、6、24条等条款`；
3. 删去 `and for Other Purposes`、`Otherwise Known as …`、`Approving Funds Therefor` 之类套语；
4. 压缩后仍超 300 字符，删最后的程序性从句，**不得截断在半个词或半个括号上**。

---

## 8 自检清单（交付前逐条过，不合格就自己改）

- [ ] 行数 = 输入条数，`key` 逐条对上，无漏无重
- [ ] 每行只有 `key` + `need` 里的键，没有多余字段（`id` 只在 need 含印尼语时出现）
- [ ] `zh` 没有以「一部」「一项」开头；没有残留「关于的」
- [ ] 四语里没有英文整句；英文只以专名出现
- [ ] **仅 ID 条目**：`dn` 的文号必须出现在 en/vi/th/id/ms 四语里；PH/TH/VN/LA 的标题**不带**文号（库内 8,460 条 PH 中仅 8 条带，文号只存 `dn` 字段）
- [ ] 英文数词已折算成阿拉伯数字，且折算正确
- [ ] 区划通名（Province / City / Municipality / Barangay）没有留英文
- [ ] `id` 层没混进马来语（`Akta`/`Perbandaran`），`ms` 层没混进印尼语（`Undang-Undang`/`Kotamadya`/`Pribadi`）
- [ ] 泰语层没有汉字，词间没有多余空格
- [ ] `vi` 层是**越南文**（必带声调符号）。源文是马来文或英文时也要译成越文，不得直接照抄 `Peraturan …` 这类马来文
- [ ] 任何语种都没有残留源文原词（大写印尼语/马来语词，如 `DARURAT`、`HUKUM ACARA`、`PENGALIHAN`、`KANTOR`）
- [ ] 没有残缺半句（只剩 `dan, serta, yang, oleh` 这类虚词）
- [ ] 长度：`zh` 2–300 字符，其余语种 2–900 字符（长题的直译本就长，别为凑长度删信息）

---

## 9 分批、回填与入库

- 每批 100 条（`批次/<国别>/<国别>-NN.jsonl`）。批号与国别见 `04-批次索引.csv`。
- 一次吃不下就分几次回复，但**每批产出单独存成一个文件**，命名：
  `PH-03.jsonl` → 回填 `PH-03.out.jsonl`。
- 回填文件放同一目录，我会用 `_ext_import.js` 逐行校验（结构 / 字符集 / 数字 / 残句 / 区划），
  通过的自动进库，不通过的会退回具体 `key` 与原因，改好再交。
- 只要 JSONL 本身，不要附说明文字、不要压缩包、不要转成 Excel。

---

## 10 常见退回原因（本库已实际发生）

| 现象 | 处理 |
|---|---|
| `zh` 写成「一部关于××的法律」 | 去掉「一部关于…的」，直接写题名 |
| 人名保留拉丁原文 | 音译并加间隔号；机构名才保留拉丁 |
| 数字被篡改（`Nineteen Hundred and Forty` → 1946 年） | 折算后逐位核对，错了整条重译 |
| `TH` 层混入汉字 | 整条重译 |
| `ms` 照抄印尼文对照名（`Konvensi`） | 改马来语（`Konvensyen`） |
| 输出 `译文 || 原文` | 删除 `|| 原文` 部分，只留译名 |
| 把 `Province of Davao de Oro` 译成 `Tỉnh Davao de Oro` 之外的 `Davao de Oro Province` | 通名前置或后置按该语种习惯，但**必须译出** |
| 用省略号掩盖截断 | 删掉省略号，照现有内容译完整句 |
