# SKILL · 越南语法规英译规范（calr-vi2en-v1）

> **这份文件是「英译 agent」与本项目（入库方）之间关于越南法规英译的唯一契约。**
> 产出仅用于数据库展示与检索，**不是**官方译本、**不是**法律意见。
> 但必须做到：**不增、不删、不合并、不编造**；法条语气、层级编号、交叉引用必须与原文严格对应。

- 版本：`calr-vi2en-v1`（2026-10-26）
- 适用：中国—东盟法律法规数据库（CALR）· 越南法规 `vi → en`
- 对象：`title`（标题）与 `articles[].text`（条文正文）
- 同构先例：`rules/SKILL-印尼语法规英译规范.md`（id → en）；通用契约见 `rules/SKILL-多国法律文本译本生产规范.md`（calr-trans-v2.2）
- 配套目录：`_work/vi2en/`（清单、任务包、回执、应用脚本）

---

## 0. 一句话说清你要做什么

把任务包里的越南语法律文本**逐条**译成英文，按第 2 节的回执契约交回。

**你不做的事**：不做法律评论、不写摘要、不写免责声明、不"顺手"修正原文、不补充原文没有的条、款、号、机构。

**交付顺序**（本项目已定）：**先全部标题（§3），再条文正文（§4）**。标题层是一份独立小任务包，可与条文并行，但验收先于条文。

---

## 1. 任务包长什么样（沿用 calr-trans-v2.2，不另立格式）

```
CALR-TRANS-<jobId>/
├── manifest.json      sourceLang="vi"；targetLang="en"；逐法条数与源哈希、shards
├── glossary.json      强制术语表（vi→en，版本写在 manifest）
├── laws/<lawId>.json  单部待译法规，articles[].text.vi 为越南语原文
└── README.txt
```

越南语特有约定：

- `sourceLang` 固定 `vi`；`laws/<lawId>.json` 中 `articles[].text` 的源语言键为 `vi`
- 单次回执 ≤ **200 条**、≤ 2 MB（通用规范 §1.2 强制分片）
- 标题层单独走 `titles.json`，结构与印尼语 `CALR-ID-TITLE-*` 一致

**规模参考（2026-10-26 实测 `prototype/data/laws/`）**：

| 指标 | 数值 |
| :--- | :--- |
| 越南法规 | **88 部**（全部 `VN-H0xx`，layer=intl，分 5 个分卷 vn-p01…vn-p05）|
| 条文合计 | **10,959 条** |
| 正文字符合计 | 约 939 万字符 |
| `text` 语言键分布 | `vi` 6,831 条 / `en` 2,838 条 / `zh` 1,290 条（每条仅一个语言键）|
| 含章节条文 | 7,603 条 |
| 重复条号的法规 | 12 部（见 §6.2）|

**先做哪一部分**：`text` 已有 `en` 的 2,838 条属既有英文（官方或历史机译），**不重译**，仅在校验中标注来源；`text` 为 `zh` 的 1,290 条属中文先行稿，按 §6.5 处理（以越文原件为准，缺越文时按中文回译并标注）。

---

## 2. 你要交什么（沿用 calr-trans-v2.2 §2）

`receipt.json`、`returns/<lawId>.<shardId>.json`、`glossary-additions.json`、`unresolved.json` 的结构一律按通用规范 §2 执行，本规范只补三条越南语专属要求：

1. `articles[].text.en` 必须保留原文的编号行（`1.` `a.` `(1)`）与分段（`\n\n`）；不得把编号行并入正文段落。
2. `articles[].heading` / `chapter` **原文有才写**；`CHƯƠNG I` 只填入已存在的 `chapter` 字段，译为 `CHAPTER I`；`Mục 1` → `Section 1`；`Phần thứ nhất` → `Part One`。
3. `noLabel` 原文为 `Điều 5` 时，目标语直接用 `Article 5`，不另造格式。

**标题层回执**：

```
CALR-VI-TITLE-<jobId>-RETURN/
├── receipt.json      {jobId, engine, model, counts{requested,translated,skipped}, selfCheck}
└── titles.001.json   {jobId, shard, items:[{id, en, basis?, note?}]}
```

`items[].id` 原样返回；一条不多、一条不少；`translated + skipped = requested`。
`basis` 取 `vi` / `zh` / `existing-en` / `docNumber` 之一，声明该条英文标题的**依据来源**；缺依据则 `skipped`。

---

## 3. A 部分 · 标题英译（A1–A7）

### A1 · 先还原官方越南语标题，再译

库内 `title.orig` 污染率高（2026-10-26 实测：88 部中 63 部为空、为文件名、或为**去变音符串**）。按以下顺序取源，不得凭猜：

1. `title.orig` 正常越南语（含完整变音符 `ă â đ ê ô ơ ư` 及声调符号）
2. `docNumber` + `level` + `promulgatedDate`（如 `59/2020/QH14` + `law` + `2020`）
3. `articles[0].text.vi` 首条（常含 `Luật này quy định về …`，可反推事项）
4. `title.zh`（中文标题，多为越文标题的准确对译）
5. 以上皆无 → `skipped`，并在 `note` 写明"缺越南语标题，无法还原"

**必须剥离的前缀/后缀噪声**：

| 噪声 | 处理 |
| :--- | :--- |
| `TOÀN VĂN:` / `Toàn văn:` / `TOAN VAN` | 删除 |
| `Văn bản hợp nhất` | 保留语义，译为 `consolidated text`（见 A4）|
| `_2005_vi_official` / `_vi_p1` / `_2013_vi_official` | 删除（抓取标记）|
| `Hien-phap-2013-Constitution` / `Law-74-2025-QH15-Employment` | 视为文件名，按 A1 顺序还原，**不得**直译文件名 |
| 去变音符串 `Lut Doanh nghip` / `B lut Dn s` | 视为**污染**，不得直译；按 `docNumber`/`zh` 还原为 `Luật Doanh nghiệp` / `Bộ luật Dân sự` 后英译 |

### A2 · 官方标题格式（统一句法）

```
<文件类型> No. <文号> [on <事项>]
```

- 文号原样保留：`59/2020/QH14`、`13/2023/NĐ-CP`、`134/VBHN-VPQH`
- **`NĐ-CP` 在英文标题中写作 `ND-CP`**（越南官方英译惯例，便于检索）；`QH`、`UBTVQH`、`TT-BCT`、`VBHN-VPQH` 等保持原样
- `Luật … về …` / `Nghị định … về …` → `Law/Decree No. … on …`；`về` 译 `on`
- 法典类（`Bộ luật`）标题自身即事项，**不加** `on …`：`Bộ luật Dân sự số 91/2015/QH13` → `Civil Code No. 91/2015/QH13`
- 无文号时：`<文件类型> on <事项> <年份>`，如 `Law on Cybersecurity 2018`；**不得**编造文号

| 越南语 | 英文 |
| :--- | :--- |
| Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam | Constitution of the Socialist Republic of Vietnam |
| Bộ luật Dân sự | Civil Code |
| Bộ luật Hình sự | Penal Code |
| Bộ luật Tố tụng dân sự | Civil Procedure Code |
| Bộ luật Tố tụng hình sự | Criminal Procedure Code |
| Bộ luật Lao động | Labour Code |
| Bộ luật Hàng hải | Maritime Code |
| Luật Doanh nghiệp | Law on Enterprises |
| Luật Đầu tư | Law on Investment |
| Luật Thương mại | Law on Commerce |
| Luật Sở hữu trí tuệ | Law on Intellectual Property |
| Luật An ninh mạng | Law on Cybersecurity |
| Luật Giao dịch điện tử | Law on Electronic Transactions |
| Luật Thương mại điện tử | Law on E-Commerce |
| Nghị định | Decree |
| Nghị quyết | Resolution |
| Quyết định | Decision |
| Thông tư | Circular |
| Chỉ thị | Directive |
| Pháp lệnh | Ordinance |
| Lệnh | Order |
| Văn bản hợp nhất | consolidated text |

### A3 · 修正、合并与废止

| 越南语 | 英文 |
| :--- | :--- |
| Luật sửa đổi, bổ sung một số điều của Luật … | Law Amending and Supplementing a Number of Articles of the Law on … |
| … được sửa đổi, bổ sung bởi … | … as amended and supplemented by … |
| … hợp nhất … | … consolidated … |
| Bãi bỏ … / Hết hiệu lực | Repealing … / Expired |
| Thay thế … | Replacing … |

标题中**不得**写入「已被某法取代」「已废止」等数据库注解；此类信息只进 `note` 或库内 `status` 字段。

### A4 · 合并文本

`văn bản hợp nhất số 134/VBHN-VPQH` → `(consolidated text No. 134/VBHN-VPQH)`，置于标题末尾括号内。

### A5 · 事项部分

`về …` 之后按法律术语译名词短语，不加动词、不加年份重复：
- `về bảo vệ dữ liệu cá nhân` → `on Personal Data Protection`
- `về đăng ký doanh nghiệp` → `on Enterprise Registration`
- `về xử lý vi phạm hành chính` → `on Handling of Administrative Violations`

### A6 · 长度与形态

5–300 字符；只输出标题；不输出摘要、条文、免责声明；不加 `This Law regulates …`。

### A7 · 同一法规多副本

库内存在同法多副本（例：`VN-H007`／`VN-H026` 均为企业法 59/2020/QH14；`VN-H002`／`VN-H119` 均为民法典 91/2015/QH13）。**各副本标题必须完全一致**，便于查重与合并；差异只在条文完整度。

---

## 4. B 部分 · 条文正文英译（B1–B9）

### B1 · 一条对一条

任务包有几条就交几条。**不合并相邻条文、不拆分单条、不漏 khoản、不改 `no`**。
原文一条内含多个编号项（`1.` `a.` `(1)`）时，译文保留同样的编号行与行数。

### B2 · 层级与编号同构

| 越南语 | 英文 | 说明 |
| :--- | :--- | :--- |
| Phần thứ nhất | Part One | 编 |
| Chương I | Chapter I | 章 |
| Mục 1 | Section 1 | 节 |
| Tiểu mục 1 | Subsection 1 | 小节 |
| Điều 5 | Article 5 | 条 |
| khoản 2 | clause 2 | 款 |
| điểm a | point a | 项 |
| Phụ lục | Appendix | 附录 |
| Lời nói đầu | Preamble | 序言 |

**交叉引用中款的写法**：`khoản 2 Điều 5` → `clause 2 of Article 5`；`Điều 5 khoản 2 điểm a` → `clause 2 point a of Article 5`。条内自引 `Điều này` → `this Article`，`Luật này` → `this Law`。

段落首的 `1.` `a)` `(1)` **原样保留**，不要改写成 `第一款` 式表述。

### B3 · 情态动词与规范用语（**最重要**）

| 越南语 | 英文 | 禁用译法 |
| :--- | :--- | :--- |
| phải | shall | should（弱化义务）|
| có nghĩa vụ | is obliged to | must（与 phải 混同）|
| không được | may not | must not（除原文语气更强）|
| được | may | can（法条中统一 may）|
| có quyền | has the right to / is entitled to | can |
| có trách nhiệm | is responsible for | shall（把职责写成义务）|
| bắt buộc | is mandatory / compulsory | is required |
| cấm / nghiêm cấm | is prohibited from / is strictly prohibited | cannot |
| không được phép | is not permitted to | — |
| được phép | is permitted to | — |
| phải bảo đảm | shall ensure | must guarantee |
| có thể | may / can（按语境，一次性行为用 may）| — |
| không nhất thiết | is not required to | must not |
| tương ứng | corresponding / respectively | — |
| theo quy định của pháp luật | in accordance with law | according to the law |
| trừ trường hợp | except where / unless | — |
| trong trường hợp | in the event that / where | in case of（易歧义）|
| đối với | in respect of / for | to |
| bao gồm | includes | consists of（除非穷尽列举）|
| chậm nhất là | no later than | at the latest |
| có hiệu lực thi hành | shall take effect | is effective |
| hết hiệu lực | expires / ceases to be in force | — |

### B4 · 交叉引用与转致

```
theo quy định tại khoản 2 Điều 5 Luật này
→ as provided for in clause 2 of Article 5 of this Law

từ Điều 10 đến Điều 15
→ Articles 10 to 15

Điều 7 và Điều 9
→ Article 7 and Article 9

dẫn chiếu theo quy định tại văn bản quy phạm pháp luật khác
→ by reference to other legislative documents
```

引用自身用 `this Law` / `this Article` / `this Clause`，**不用** `the said Law`。

### B5 · 数字、货币、日期

- 数字不改值：`1.000.000.000 đồng` → `VND 1,000,000,000`（越南语用 `.` 作千分位、`,` 作小数点，译文改为英文逗号/句点；数值不变）
- 币种不换算、不折算：`đồng` → `VND`（首次可写 `Vietnamese dong (VND)`）
- 日期不改：`ngày 01 tháng 01 năm 2021` → `1 January 2021`
- 月份：tháng 1…12 → January…December
- 百分比 `5%` 保留；原文 `năm phần trăm (5%)` 可译 `five per cent (5%)`，**不要**自行加括号
- 年龄、期限、比例一律照抄，不做「约等于」处理

### B6 · 专名与机构

- 人名、地名、企业名：**保留越南语原形含变音符**，不音译、不意译（`Công ty cổ phần Sữa Việt Nam`、`Hà Nội`、`Nguyễn Văn A`）
- 机构名首次出现用官方英文名，其后用缩写或简称：
  - Quốc hội → the National Assembly
  - Ủy ban Thường vụ Quốc hội → the Standing Committee of the National Assembly
  - Chủ tịch nước → the President
  - Chính phủ → the Government
  - Thủ tướng Chính phủ → the Prime Minister
  - Bộ Tư pháp → the Ministry of Justice
  - Ủy ban nhân dân → the People's Committee
  - Hội đồng nhân dân → the People's Council
  - Tòa án nhân dân → the People's Court
  - Viện kiểm sát nhân dân → the People's Procuracy
  - Mặt trận Tổ quốc Việt Nam → the Vietnam Fatherland Front
  - Tổng cục / Cục / Vụ → General Department / Department / Department (Vụ 用 Department 或 Legal Affairs Department，按语境)
- 原文未出现的英文全称**不得**补入

### B7 · 固定套语

| 越南语 | 英文 |
| :--- | :--- |
| Căn cứ Hiến pháp … | Pursuant to the Constitution … |
| Căn cứ Luật … | Pursuant to the Law on … |
| Theo đề nghị của … | At the proposal of … |
| QUỐC HỘI | NATIONAL ASSEMBLY |
| CHÍNH PHỦ | GOVERNMENT |
| LUẬT: | ENACTS: |
| NGHỊ ĐỊNH: | DECREES: |
| NGHỊ QUYẾT: | RESOLVES: |
| QUYẾT ĐỊNH: | DECIDES: |
| Phạm vi điều chỉnh | Scope of regulation |
| Đối tượng áp dụng | Subjects of application |
| Giải thích từ ngữ | Interpretation of terms |
| Nguyên tắc | Principles |
| Hiệu lực thi hành | Effective date |
| Điều khoản chuyển tiếp | Transitional provisions |
| Tổ chức thực hiện | Organisation of implementation |
| Trách nhiệm thi hành | Responsibility for implementation |
| Điều khoản thi hành | Implementation provisions |
| Nay ban hành | hereby promulgates |
| Đã ký | Signed |
| Nơi nhận: | Recipients: |
| Lưu: VT, … | File: … |

### B8 · 原文残缺

OCR 噪声、截断、缺字、去变音符：**照实翻译可读部分**，不猜测补全，在该条 `note` 写明「原文残缺，按可读部分翻译」。整条无法辨认 → `skipped`。

### B9 · 中文先行稿（`text.zh`）的处理

库内 1,290 条条文只有中文（无越文原文）。处理顺序：

1. 若该法另有含 `vi` 的副本（见 §A7）→ 以越文副本为准，对齐条号后翻译
2. 无越文副本 → 按中文稿回译，`basis` 记 `zh`，并在 `note` 写「无越文原文，据中文先行稿回译」
3. **不得**把中文稿当作原文引用条文号以外的内容

---

## 5. 术语表（择要）

| 领域 | 越南语 → 英文 |
| :--- | :--- |
| 主体 | doanh nghiệp → enterprise；hộ kinh doanh → household business；hợp tác xã → cooperative；tổ chức → organisation；cá nhân → individual；cơ quan → agency；người đại diện theo pháp luật → legal representative |
| 公司 | công ty trách nhiệm hữu hạn (TNHH) → limited liability company (LLC)；công ty cổ phần → joint-stock company；công ty hợp danh → partnership；doanh nghiệp tư nhân → sole proprietorship；vốn điều lệ → charter capital；vốn pháp định → legal capital；cổ đông → shareholder；Hội đồng quản trị → Board of Directors；Hội đồng thành viên → Members' Council；Đại hội đồng cổ đông → General Meeting of Shareholders；điều lệ → charter；góp vốn → capital contribution；chào bán → offering；sáp nhập → merger；hợp nhất → consolidation；chia tách → split；tách → demerger；giải thể → dissolution；phá sản → bankruptcy |
| 投资 | đầu tư → investment；nhà đầu tư → investor；dự án đầu tư → investment project；đầu tư nước ngoài → foreign investment；đầu tư trong nước → domestic investment；ưu đãi đầu tư → investment incentives；khu công nghiệp → industrial park；khu kinh tế → economic zone；chấp thuận chủ trương đầu tư → approval of investment policy；Giấy chứng nhận đăng ký đầu tư → Investment Registration Certificate |
| 土地 | đất đai → land；quyền sử dụng đất → land use right；giấy chứng nhận quyền sử dụng đất → land use right certificate；thu hồi đất → land recovery；bồi thường → compensation；giao đất → land allocation；cho thuê đất → land lease；quy hoạch → planning；thửa đất → land parcel |
| 合同 | hợp đồng → contract；hợp đồng dân sự → civil contract；giao kết hợp đồng → conclusion of a contract；thực hiện hợp đồng → performance of a contract；vi phạm hợp đồng → breach of contract；phạt vi phạm → penalty for breach；bồi thường thiệt hại → compensation for damage；vô hiệu → invalid；đặt cọc → deposit；bảo lãnh → guarantee |
| 民事 | năng lực hành vi dân sự → civil act capacity；quyền nhân thân → personal right；tài sản → property；quyền sở hữu → ownership right；thừa kế → inheritance；di chúc → will；hôn nhân → marriage；ly hôn → divorce；giám hộ → guardianship；nghĩa vụ → obligation |
| 刑事 | tội phạm → crime；hình phạt → penalty；tù có thời hạn → fixed-term imprisonment；tù chung thân → life imprisonment；tử hình → death penalty；án treo → suspended sentence；cải tạo không giam giữ → non-custodial reform；phạt tiền → fine；khởi tố → prosecution；điều tra → investigation；truy tố → indictment；xét xử → trial；bị can → the accused；bị cáo → the defendant |
| 程序 | nguyên đơn → plaintiff；bị đơn → defendant；người có quyền lợi, nghĩa vụ liên quan → person with related rights and obligations；khởi kiện → initiate a lawsuit；thụ lý → accept for settlement；hòa giải → mediation；sơ thẩm → first instance；phúc thẩm → appellate；giám đốc thẩm → cassation；tái thẩm → reopening；thi hành án → judgment enforcement |
| 数据与网络 | dữ liệu cá nhân → personal data；chủ thể dữ liệu → data subject；bên kiểm soát dữ liệu cá nhân → personal data controller；bên xử lý dữ liệu cá nhân → personal data processor；sự đồng ý → consent；an ninh mạng → cybersecurity；thông tin cá nhân → personal information；hệ thống thông tin → information system；xử lý dữ liệu → data processing；rò rỉ dữ liệu → data breach |
| 财税 | thuế → tax；thuế giá trị gia tăng (GTGT) → value added tax (VAT)；thuế thu nhập doanh nghiệp → corporate income tax；thuế thu nhập cá nhân → personal income tax；thuế xuất khẩu, nhập khẩu → export and import duty；người nộp thuế → taxpayer；quản lý thuế → tax administration；hoàn thuế → tax refund；miễn thuế → tax exemption；giảm thuế → tax reduction |
| 劳动 | người lao động → employee；người sử dụng lao động → employer；hợp đồng lao động → labour contract；tiền lương → wages；bảo hiểm xã hội → social insurance；bảo hiểm y tế → health insurance；chấm dứt hợp đồng lao động → termination of a labour contract；trợ cấp thôi việc → severance allowance；làm thêm giờ → overtime work；công đoàn → trade union；tranh chấp lao động → labour dispute |
| 知识产权 | quyền tác giả → copyright；quyền liên quan → related rights；nhãn hiệu → trademark；sáng chế → invention；kiểu dáng công nghiệp → industrial design；chỉ dẫn địa lý → geographical indication；bí mật kinh doanh → trade secret；thiết kế bố trí → layout design；chuyển nhượng → assignment；chuyển giao quyền sử dụng → licence；xâm phạm → infringement |
| 行政 | vi phạm hành chính → administrative violation；xử phạt vi phạm hành chính → administrative penalty；biện pháp khắc phục hậu quả → remedial measures；tước quyền sử dụng giấy phép → deprivation of the right to use a licence；đình chỉ hoạt động → suspension of operations；cưỡng chế → coercive enforcement |

术语表未覆盖的，按越南法律通行英文译法处理；同一术语在同一批任务内必须**译法一致**。

---

## 6. 本项目特有问题与处置

### 6.1 源文本抓取噪声

`title.orig` 大面积污染：空值、文件名（`Hien-phap-2013-Constitution 2013`）、去变音符串（`Lut Doanh nghip`）、抓取标记（`_2005_vi_official`、`_vi_p1`）。按 A1 的五级取源处理，**禁止**直译文件名与去变音符串。

### 6.2 条号可能重复或跳号

实测 12 部越南法规存在重复条号。处置：

1. 先按 `no` 排序核对，确认是「长条文被切段复用同一 `Điều`」还是「多个被修正法律的条号共用」
2. 前者按续段合并回一条再译（合并后条数写入 `unresolved.json` 备查）
3. 后者**不得合并**，需人工确认切分口径后暂停该部，`note` 记「条号重复，待确认切分口径」

### 6.3 同法多副本

见 §A7。多副本各自独立翻译，条号对齐后译文应一致；若副本条数不同，以条数完整者为准，另一副本标 `note`。

### 6.4 超长法规

民法典 757 条、企业法 865 条、宪法 244 条等，必须分片（≤200 条/片），片间保持一致性与术语一致。

### 6.5 中文先行稿

见 §B9。

### 6.6 标题与正文语言不一致

部分法规 `language=en` 但 `title.orig` 为越南语；部分 `language=zh` 而 `title.orig` 为中文。**以条文实际语言判定翻译方向**，标题按 A1 取源，不相冲突。

---

## 7. 交付前自检（C1–C10）

| # | 检查项 | 判据 |
| :--- | :--- | :--- |
| C1 | `allIdsReturned` | 任务包每个 id 都在回执中出现 |
| C2 | `noExtraIds` | 无任务包之外的 id |
| C3 | `noDuplicateIds` | 同一 id 只出现一次 |
| C4 | `noUntranslated` | 无一条 `en` 与 `vi` 原文完全相同 |
| C5 | `allNonEmpty` | 每条 `en` 非空 |
| C6 | `structurePreserved` | `Chương/Mục/Điều/khoản/điểm` 层级与编号项数量不变，`\n` 数一致 |
| C7 | `noResidualVietnamese` | 译文不残留越南语功能词（`và` `hoặc` `của` `các` `những` `trong` `theo` `đối với` `quy định` `trường hợp` `được` `phải`）|
| C8 | `noBoilerplate` | 无 `Disclaimer/TBD/TODO/待译/for reference only` |
| C9 | `noAddedNumbers` | 未出现原文没有的条款号、年份、金额 |
| C10 | `jsonValid` | JSON 可解析、UTF-8 无 BOM |

C7 例外：专名（`Hà Nội`、`Nguyễn Văn A`、`Công ty …`）与原文引用的越南语法规名称可保留。

标题层另有：

| # | 检查项 | 判据 |
| :--- | :--- | :--- |
| T1 | `titleFormat` | 形如 `<Type> No. <文号> [on <事项>]` 或 `<Type> on <事项> <年份>` |
| T2 | `noFilename` | 不含 `_vi_official` `_vi_p1` `-Constitution` `_2005_` 等抓取标记 |
| T3 | `noLostDiacritics` | 标题中若出现越南语词，必须含正确变音符；否则不保留越南语词（见 T4）|
| T4 | `noBilingualTail` | 不得保留 `(Luật Doanh nghiệp)` 式括号越南语尾注（与印尼语规范不同，本项目英文标题**不**附越南语原名）|
| T5 | `consistentDuplicates` | 同法多副本标题完全一致 |

---

## 8. 红线（违反即整批退回）

1. 不得编造条文、款项、编号、年份、金额、机构、文号
2. 不得合并或拆分条文，不得漏 `khoản`、`điểm`
3. 不得写摘要、评论、免责声明、译注式长文
4. 不得把 `phải` 译成 `should`、把 `được` 译成 `must`（法律效力被改写）
5. 不得不同 id 之间错配译文
6. 不得因 OCR 残缺失真而"猜写"内容；无法辨认就跳过并计入 `skipped`
7. 不得直译文件名或去变音符串当标题
8. 不得混入第三种语言：`targetLang=en` 时不得输出中文或整句越南语；除专名与原文引用的越南语名称外不得残留越南语

---

## 9. 入库方会怎么处理你的回执

```bash
# 1) 校验回执包（格式、覆盖度、漏条/串条）
node tools/verify-trans-return.js <回执包目录> --job <任务包目录> --partial

# 2) 标题层应用（写 prototype/data/laws/<lawId>.json 的 title.en）
python _work/vi2en/apply_titles.py --dry
python _work/vi2en/apply_titles.py

# 3) 条文层入库（写 data/trans/vn-pXX.en.js，不改 laws/）
node _work/trans/ingest-trans.js <任务包> <回执包>

# 4) 重建索引与分卷
node _work/merge/rebuild-index.js
node _work/merge/build-packs.js
```

入库后结构：

```json
"title": { "zh": "企业法", "en": "Law No. 59/2020/QH14 on Enterprises", "orig": "Luật Doanh nghiệp số 59/2020/QH14" },
"articles": [
  { "id": "VN-H007-A1", "no": 1,
    "text": { "vi": "Luật này quy định về ...", "en": "This Law provides for ..." } }
]
```

界面逻辑与其他法域一致：非中文界面显示 `English`，条文正文按界面语言取 `text.en`。

---

## 10. 开始前的 4 个问题

1. 我拿到的是 `laws/<lawId>.json`（`articles[].text.vi` 为原文、`noLabel.vi` 形如 `Điều 5`）—— 对吗？
2. 我交回的是 `returns/<lawId>.<shard>.json` + `receipt.json`，结构如第 2 节 —— 对吗？
3. 我理解 `phải→shall`、`được→may`、`Chương/Điều/khoản/điểm` 必须同构 —— 对吗？
4. 我理解"不编造、不合并、不加套话、原文残缺照实译、标题不附越南语原名" —— 对吗？

四个都是"是"，就可以开始了。
