# 标题中译作业说明（CALR · calr-title-zh-v1 摘编）

依据：`rules/SKILL-法规标题中译规范.md`（项目根 `deliverables/SKILL-法规标题中译规范.docx` 为同一契约）。
你只译**标题**，不译正文、不写摘要、不写评注、不写免责声明。

## 一、硬性判据（校验器会逐条抓，违反即返工）

1. **一条不落、不多、不改 id**。任务片里有几条，回执就几条，id 原样。
2. **长度 2–90 字符**（含空格与标点）。
3. **中文字符 ≥ 2 个**，且**中文占比 ≥ 50%**（汉字数 ÷（汉字数 + 拉丁字母数））。
   → 这是最容易踩的一条：专有名词保留太多英文会导致占比不足，必须把可译的普通词全部译成中文。
4. **不得与英文原文完全相同**。
5. **译文里出现的任何拉丁字母片段，必须能在原文标题中找到**（不区分大小写，子串匹配）。
   → 不得音译/意译/编造公司名、地名、机构名、品牌名；也不得把 `Act` 写成 `Act`、把 `Pte` 拼成 `Pte.` 之类原文没有的形式。
6. **括号必须成对**（用中文括号（）或英文括号（），同一标题内保持一致，优先中文括号）。
7. **禁套话**：免责 / 仅供参考 / 翻译说明 / 待译 / TODO / 待补充 / 占位 / 略 / 无法翻译 / 原文见 / 以下为 / 说明：。

## 二、层级词对照（照此译，不得自创）

| 英文 | 中文 | | 英文 | 中文 |
|---|---|---|---|---|
| Act | 法 | | Notification | 公告 |
| Law | 法 | | Decree | 法令 |
| Code | 法典 | | Ordinance | 条例 |
| Order | 命令 | | Royal Kram | 王室敕令 |
| Rules | 规则 | | Amendment / Amending | 修正 |
| Regulations / Regns / Reg | 条例 | | Constitution | 宪法 |
| Bill | 法案 | | Guidelines | 指南 |

- 年份、文号原样保留，年份与中文之间留一个半角空格：`Companies Act 1967` → `公司法 1967`；`Plant Quarantine Act, B.E. 2507 (1964)` → `植物检疫法，佛历 2507（1964）`。
- 括号结构照搬，改用中文括号：`Family Justice (General) Rules 2024` → `家庭司法（一般）规则 2024`。
- 破折号照搬：`Air Navigation (137 — Aerial Work) Regulations 2018` → `航空导航（137——空中作业）条例 2018`。
- 并列连词 `and` → `与` 或 `及`；三项以上用 `、` + `与`。
- 标题里的 `, and for Other Purposes` → `，并用于其他目的`；`and Appropriating Funds Therefor` → `并为此拨款`。

## 三、专有名词处理（最重要）

- **公司名、人名、商号、学校名、街道名**：一律保留英文原样。`Servotron Industries Inc.` → `Servotron Industries Inc.`。
- **国家/一级政区**：用通行中文名。Singapore 新加坡、Malaysia 马来西亚、Brunei 文莱、Thailand 泰国、Cambodia 柬埔寨、Myanmar 缅甸、the Philippines 菲律宾。
- **新加坡政府机构、法定机构**：用其**官方中文名**（这些属于公认通用译名，允许用中文）：
  Accounting and Corporate Regulatory Authority 会计与企业管制局；Monetary Authority of Singapore 新加坡金融管理局；
  Land Transport Authority 陆路交通管理局；Urban Redevelopment Authority 市区重建局；Housing and Development Board 建屋发展局；
  National Environment Agency 国家环境局；Ministry of Manpower 人力部；Ministry of Health 卫生部；Ministry of Education 教育部；
  Intellectual Property Office of Singapore 新加坡知识产权局；Infocomm Media Development Authority 资讯通信媒体发展局；
  Building and Construction Authority 建设局；Singapore Land Authority 新加坡土地管理局；Public Utilities Board 公用事业局；
  Civil Aviation Authority of Singapore 新加坡民航局；Singapore Food Agency 新加坡食品局；Singapore Police Force 新加坡警察部队；
  Singapore Civil Defence Force 新加坡民防部队；National Parks Board 国家公园局；Accounting Standards Council 会计准则理事会。
  **拿不准的一律保留英文**，不要臆造中文机构名。
- **判据 5 的兜底**：若某个机构名你用了中文，译文里就不会出现对应拉丁片段，不会被判 R8；但若你保留英文而中文占比不足，会被判 R7 —— 此时优先查上面这张表，查不到就把该机构名两侧的普通词（Board / Committee / Council / Department / Office / Authority）译成中文，机构专名保留英文。

## 四、语序与可读性（红线：不得机器直出病句）

- 英文名词堆叠按中文习惯重组，不要逐词硬贴：`Control of Vectors and Pesticides Act 1998` → `媒介与农药管制法 1998`；
  `Prevention of Money Laundering, Terrorism Financing and Proliferation Financing` → `防止洗钱、恐怖主义融资与扩散融资`。
- 定语从句、介词短语前置：`Rules relating to X` → `有关 X 的规则`；`Act to amend the Y Act` → `修订 Y 法的法案`。
- `An Act ...` 开头（菲律宾法案）→ `……法案`，不要译成"关于……的法案，规定了……"这类扩写句。
- 长标题允许用逗号断句，但**必须仍是一个标题**，不得写成句子、不得加"本法规定"。

## 五、输出格式

```json
{
 "jobId": "<任务片里的 jobId>",
 "shard": <任务片里的 shard>,
 "items": [
  { "id": "SG-H004", "zh": "公司法 1967" }
 ]
}
```

- 只写 `id` 与 `zh`，不要写 `note`。
- 用 Python `json.load` 读任务片、`json.dump(..., ensure_ascii=False, indent=1)` 写回执，**UTF-8 无 BOM**。
- 禁止手写 JSON、禁止手打转义。

## 六、交回前必须自检

```
python _work/title/check_zh.py <任务片> <你的回执>
```

必须跑到「结果：通过」（0 错误）。警告（括号不配对）也要修掉。

## 七、文莱（BN）与泰国（TH）专章

### 文莱
1. 原文多为**全大写**，译文按中文标题正常书写，无需保留大写。
2. 文号/编次原样保留在标题里：`R 1 2015 ED PRISONS RULES` → `R 1 2015 版监狱规则`（`ED` = edition，译「版」）；
   `R 4 INSOLVENCY WINDING UP RULES` → `R 4 破产清盘规则`；`Companies Act (Chapter 39)` → `公司法（第 39 章）`；
   `CONTRACTS ACT(1)` → `合同法(1)`（原文的 `(1)` 是版本标记，照搬）。
3. `SEC. 216` / `SEC 153(1)` / `SEC 381 OF ...` 是条文指引，译 `第 216 条` / `第 153(1) 条` / `……第 381 条`。
4. 源文有明显拼写残缺（`E PENAL CODE ACT`、`XCISE ORDER 2006`、`MERCHANT SHIPPING ORER`）时，**不擅自修补原文**：
   按残缺字面可读的部分译，残缺字母本身不保留（不构成专名），例如 `E PENAL CODE ACT` → `刑法典法`、`XCISE ORDER 2006` → `消费税命令 2006`。
5. 马来语法律用语按通行译法处理，不算专名：`Syariah` 伊斯兰教法／伊斯兰法庭，`Mahkamah` 法庭，`Perintah` 命令，
   `Acara` 程序，`Mal` 民事，`Jenayah` 刑事，`Undang-Undang` 法律，`Kanun` 法典，`Perlembagaan` 宪法。
   `SYARIAH COURTS CRIMINAL PROCEDURE CODE` → `伊斯兰法庭刑事程序法典`；`SYARIAH PENAL CODE` → `伊斯兰刑法典`。

### 泰国
1. 佛历纪年照搬并加括注年份：`PLANT QUARANTINE ACT, B.E. 2507 (1964)` → `植物检疫法，佛历 2507（1964）`。
2. `ACT` → 法；`ROYAL DECREE` → 王室法令；`MINISTERIAL REGULATION` → 部级条例；`NOTIFICATION` → 公告。

## 八、菲律宾（PH）专章

1. 句式高度固定，开头 `An Act ...` 一律译为「……法案」，不要扩写成句子。常用动词：
   Granting 授予；Changing the Name 将……更名；Separating 将……分离；Providing for 规定；Creating 设立；
   Amending 修订；Establishing 设立；Increasing 增加；Converting 将……改设为；Declaring 宣布；Authorizing 授权；
   Renewing 续展；Renaming 重新命名；Extending 延长；Upgrading 提升；Constituting 组建；Naming 命名；
   Transferring 移交；Expanding 扩大；Requiring 要求；Postponing 推迟；Revise/Revising 修改。
2. 结尾固定语：`, and for Other Purposes` → `，并为其他目的`；`and Appropriating Funds Therefor` → `并为此拨款`；
   `to Be Known as X` → `名称为 X`。
3. 行政区划通用词译中文，专名保留英文：`City of X` → `X 市`；`Municipality of X` → `X 市镇`；
   `Province of X` → `X 省`；`Barangay X` → `Barangay X`；`Region` → `大区`；`Autonomous Region` → `自治区`。
4. **公认通用中文译名可以用**：马尼拉 Manila、宿务 Cebu、达沃 Davao、伊洛伊洛 Iloilo、卡加延 Cagayan、
   八打雁 Batangas、拉古纳 Laguna、邦板牙 Pampanga、布拉干 Bulacan、莱特 Leyte、萨马 Samar、保和 Bohol、
   三宝颜 Zamboanga、新怡诗夏 Nueva Ecija、邦阿西楠 Pangasinan、南甘马粦 Camarines Sur、北伊罗戈 Ilocos Norte、
   民答那峨 Mindanao、米沙鄢 Visayas。其余地名、学校名、公司名、人名一律保留英文，**不要音译、不要臆造**。
5. 中文占比不足（R7）时的处理顺序：① 先把所有通用词（机关、职务、行为、客体）全部译成中文；
   ② 再用第 4 条列的公认地名；③ 仍不足则精简重复修饰（如 `in the Municipality of X, Province of Y` 可作 `Y 省 X 市镇`），
   但不得删去名称、不得改动原文信息。若三条都做完仍不足 50%，说明该条不适合在本规则下入库，**不要编造中文名**，
   保留原样最简译法并在你回复的自检里报告该 id。

### 附：菲律宾省名与主要城市的中文通用译名（可在译文中使用；未列出的保留英文）

省：Abra 阿布拉、Agusan del Norte 北阿古桑、Agusan del Sur 南阿古桑、Aklan 阿克兰、Albay 阿尔拜、
Antique 安蒂克、Aurora 奥罗拉、Bataan 巴丹、Batanes 巴塔内斯、Batangas 八打雁、Benguet 本格特、
Biliran 比利兰、Bohol 保和、Bukidnon 布基农、Bulacan 布拉干、Cagayan 卡加延、Camarines Norte 北甘马粦、
Camarines Sur 南甘马粦、Camiguin 卡米金、Capiz 卡皮斯、Catanduanes 卡坦端内斯、Cavite 甲米地、Cebu 宿务、
Cotabato 哥打巴托、Davao de Oro 金达沃、Davao del Norte 北达沃、Davao del Sur 南达沃、Davao Oriental 东达沃、
Davao Occidental 西达沃、Dinagat Islands 迪纳加特群岛、Eastern Samar 东萨马、Guimaras 吉马拉斯、Ifugao 伊富高、
Ilocos Norte 北伊罗戈、Ilocos Sur 南伊罗戈、Iloilo 伊洛伊洛、Isabela 伊莎贝拉、Kalinga 卡林加、La Union 拉乌尼翁、
Laguna 拉古纳、Lanao del Norte 北拉瑙、Lanao del Sur 南拉瑙、Leyte 莱特、Maguindanao 马京达瑙、Marinduque 马林杜克、
Masbate 马斯巴特、Misamis Occidental 西米萨米斯、Misamis Oriental 东米萨米斯、Mountain Province 高山省、
Negros Occidental 西内格罗斯、Negros Oriental 东内格罗斯、Northern Samar 北萨马、Nueva Ecija 新怡诗夏、
Nueva Vizcaya 新比斯开、Occidental Mindoro 西明多洛、Oriental Mindoro 东明多洛、Palawan 巴拉望、Pampanga 邦板牙、
Pangasinan 邦阿西楠、Quezon 奎松、Quirino 基里诺、Rizal 黎刹、Romblon 朗布隆、Samar 萨马、Sarangani 萨兰加尼、
Siquijor 锡基霍尔、Sorsogon 索索贡、South Cotabato 南哥打巴托、Southern Leyte 南莱特、Sultan Kudarat 苏丹库达拉特、
Sulu 苏禄、Surigao del Norte 北苏里高、Surigao del Sur 南苏里高、Tarlac 打拉、Tawi-Tawi 塔威塔威、Zambales 三描礼士、
Zamboanga del Norte 北三宝颜、Zamboanga del Sur 南三宝颜、Zamboanga Sibugay 三宝颜锡布格。

市：Manila 马尼拉、Quezon City 奎松市、Caloocan 卡洛奥坎、Makati 马卡蒂、Pasig 帕西格、Taguig 达义、
Parañaque 帕拉尼亚克、Las Piñas 拉斯皮纳斯、Muntinlupa 蒙廷卢帕、Marikina 马里基纳、Valenzuela 巴伦苏埃拉、
Mandaluyong 曼达卢永、Pasay 帕赛、Malabon 马拉邦、Navotas 纳沃塔斯、San Juan 圣胡安、Antipolo 安蒂波洛、
Baguio 碧瑶、Cebu City 宿务市、Lapu-Lapu 拉普拉普、Mandaue 曼达维、Davao City 达沃市、Zamboanga City 三宝颜市、
Iloilo City 伊洛伊洛市、Bacolod 巴科洛德、Cagayan de Oro 卡加延-德奥罗、General Santos 桑托斯将军城、
Tacloban 塔克洛班、Batangas City 八打雁市、Angeles 安赫莱斯、Naga 那牙、Legazpi 黎牙实比、Dagupan 达古潘、
Lucena 卢塞纳、Puerto Princesa 普林塞萨港、Butuan 武端、Iligan 伊利甘、Marawi 马拉维、Cotabato City 哥打巴托市、
Tagum 塔古姆、Dumaguete 杜马格特、Roxas 罗哈斯、Ormoc 奥尔莫克、Laoag 拉瓦格、Vigan 维甘、Tuguegarao 土格加劳、
Malolos 马洛洛斯、San Jose del Monte 圣何塞德尔蒙特、San Fernando 圣费尔南多、Tarlac City 打拉市。
