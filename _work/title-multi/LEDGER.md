# 标题多语种批次台账

规范：`docs/07-标题多语种规范.md`
工具：`_work/title-multi/`（audit / apply / chk）

字段口径：`title{zh,en,vi,th,id,ms,orig}`，全库 18,770 部 = 131,390 个字段。

## 批次记录

| 日期 | 批次 | 范围 | 部数 | 写入字段 | 校验 |
|---|---|---|---|---|---|
| 2026-10-27 | p0-orig-backfill | CN→zh、SG/PH/BN→en | 6,560 | orig 6,560 | 错误 0 |
| 2026-10-27 | th-th-from-orig | TH 泰文 orig 即 th | 721 | th 721 | 错误 1（TH-H824 原文 313 字，超长，允许） |
| 2026-10-27 | th-p1-b01 | TH 索引 0–49 | 50 | vi50 / th34 / id50 / ms50 | 错误 0 |
| 2026-10-27 | th-p1-b02 | TH 索引 50–99 | 50 | vi50 / th38 / id50 / ms50 | 错误 0 |
| 2026-10-27 | th-p1-b03 | TH 索引 100–159 | 60 | vi60 / th18 / id60 / ms60 | 错误 0 |
| 2026-10-27 | th-p1-b04 | TH 索引 200–249 | 50 | vi50 / id50 / ms50 | 错误 0 |
| 2026-10-27 | th-p1-b05 | TH 索引 160–199 | 40 | vi40 / id40 / ms40 | 错误 0 |
| 2026-10-27 | th-p1-b05-fix | 补 5 部遗漏 th | 5 | th5 / vi1 / id1 / ms1 | 错误 0 |
| 2026-10-27 | cn-p1-b01 | CN 核心 30 部（含宪法、民法典、刑法） | 30 | vi30 / th30 / id30 / ms30 | 错误 0 |
| 2026-10-28 | th-p1-b06–b15 | TH 余下 565 部 | 565 | vi565 / th565 / id565 / ms565 | 错误 0（长度阈值改 max(300, 源文×1.2)） |
| 2026-10-28 | th-orig-fill + orig-backfill-r2/r3 | orig 补齐 | 230 | orig 230 | 审计缺 orig 0 |
| 2026-10-28 | vn-p1-b01/b02 | VN 全 73 部 | 73 | vi73 / th73 / id73 / ms73 + orig 37 | 错误 0 |
| 2026-10-28 | id-p1-b01 | ID 全 36 部 | 36 | vi36 / th36 / id36 / ms36 + orig 4 | 错误 0 |
| 2026-10-28 | cn-p1-b02–b09 | CN「中华人民共和国」组 | 469 | vi469 / th469 / id469 / ms469 | 错误 0 |
| 2026-10-28 | sg-p1-b01 | SG 词表可生成 | 468 | vi468 / th468 / id468 / ms468 | 错误 0 |
| 2026-10-28 | sg-p1-b02 | SG 修解析后补生成 | 610 | vi610 / th610 / id610 / ms610 | 错误 0 |
| 2026-10-28 | my-p1-b01 | MY 词表可生成 | 14 | vi14 / th14 / id14 / ms14 | 错误 0 |
| 2026-10-28 | ph-p1-b01 | PH 骨架模板（建校/改名/设市/病床） | 1434 | vi1434 / th1434 / id1434 / ms1434 | 错误 0，终检残留 0 |
| 2026-10-28 | ph-p1-b02 | PH 转制模板（Converting）补充 | 144 | vi144 / th144 / id144 / ms144 | 错误 0 |
| 2026-10-28 | cn-p1-b10 | CN 按条文数 1–40 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b11 | CN 按条文数 41–80 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b12 | CN 按条文数 81–120 部（条例/暂行条例） | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b13 | CN 按条文数 121–160 部（含网络数据安全管理条例） | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b14 | CN 按条文数 161–200 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b15 | CN 按条文数 201–240 部（含涉台港澳表述按规范） | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b16 | CN 按条文数 241–280 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b17 | CN 按条文数 281–320 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | cn-p1-b18 | CN 按条文数 321–360 部 | 40 | vi40 / th40 / id40 / ms40 | 错误 0 |
| 2026-10-28 | kh-p2-b01 | KH 第 1 批 48 部（H001–H057 区段）| 48 | vi48 / th48 / id48 / ms48 + zh5 | 错误 0 |
| 2026-10-28 | kh-p2-b02 | KH 第 2 批 47 部（H060–H107）| 47 | vi47 / th47 / id47 / ms47 + zh6 | 错误 0 |
| 2026-10-28 | kh-p2-b03 | KH 第 3 批 48 部（H108–H156）| 48 | vi48 / th48 / id48 / ms48 + zh2 | 错误 0 |
| 2026-10-28 | kh-p2-b04 | KH 末批 44 部（H157–H3906）| 44 | vi44 / th44 / id44 / ms44 + zh1 | 错误 0 |
| 2026-10-28 | la-p2-b01 | LA 全 80 部（整域清零）| 80 | vi80 / th80 / id80 / ms80 + zh2 | 错误 0 |
| 2026-10-28 | mm-p2-b01 | MM 全 80 部（整域清零）| 80 | vi80 / th80 / id80 / ms80 + zh1 | 错误 0 |
| 2026-10-28 | tl-p2-b01 | TL 第 1 批 115 部（TL-CIVIL-2011 … H146）| 115 | vi115 / th115 / id115 / ms115 + zh21 | 错误 0 |
| 2026-10-28 | tl-p2-b02 | TL 第 2 批 115 部（H147 … TL-LABOR-2012）| 115 | vi115 / th115 / id115 / ms115 + zh95 | 错误 0（orig 超长 1 见已知问题）|
| 2026-10-28 | my-p2-b01 | MY 剩余 60 部（四语清零）| 60 | vi60 / th60 / id60 / ms60 + zh6 | 错误 0 |
| 2026-10-28 | my-p3-b01 | MY 附属法规 6 个高频主体（CUSTOMS / FEDERAL ROADS / PRICE CONTROL / INCOME TAX / ROAD TRANSPORT / PRINTING PRESSES） | 1812 | zh1812 / vi1812 / th1812 / id1812 / ms1812 | 错误 0（告警 1354，长度比 0.28–0.38） |
| 2026-10-28 | my-p3-b02 | MY 增补 56 主体 + 34 高频括号（附表修正、管制物品、疫区措施等） | 1361 | zh1361 / vi1361 / th1361 / id1361 / ms1361 | 错误 0（告警同上类型） |

### my-p3 说明（2026-10-28）

- **做法**：`_work/title-multi/engine/gen_my.js` 解析 `〈主体〉（〈限定语〉）…〈类型词〉〈年份〉`，
  查术语表逐段对译后按各语种语序组装；主体或任一括号缺译则**整部跳过**，不臆造。
- **术语表**：`engine/lexicon-my.json`（基础）+ `engine/lexicon-my-add1.json`（增补），
  均为人工翻译，层级词按规范 §5.2。批次只写 `laws/*.json`，再经 `sync-titles-to-catalog.js` 回灌。
- **语序**：zh `2023年道路交通（禁止使用道路）（联邦道路）（第6号）令`；
  ms `Perintah Pengangkutan Jalan (…) (Bilangan 6) 2023`；
  vi `Lệnh về Vận tải đường bộ (…) (số 6) năm 2023`；
  th `คำสั่งการขนส่งทางถนน (…) (ฉบับที่ 6) ค.ศ. 2023`；
  id `Perintah Angkutan Jalan (…) (Nomor 6) Tahun 2023`。
- **长度比告警**：中文对全大写英文长标题普遍 0.28–0.38，低于 §7.3 的 0.4 下限。
  系中文信息密度高于英文所致，非截断或灌水，逐条核对样例信息完整，**留存告警、不阻断**。
- **剩余 3729 部**：主体 2418 部未收录（头部仅剩 10–18 部/个）、括号 1295 部未覆盖，
  已进入长尾，需按 `engine/yield_my.js` 的边际产出排序继续增量。
| 2026-10-28 | my-p3-b03 | MY 边际产出前 668 主体（主题库） | 1726 | zh1726 / vi1726 / th1726 / id1726 / ms1726 | 错误 0 |
| 2026-10-28 | my-p3-b04 | MY 主体增补（机构/委员会） | 136 | zh136 / vi136 / th136 / id136 / ms136 | 错误 0 |
| 2026-10-28 | my-p3-b05 | MY 主体增补（合作社/公司专名） | 199 | zh199 / vi199 / th199 / id199 / ms199 | 错误 0 |
| 2026-10-28 | my-p3-b06 | MY 括号增补（附表修正/疫区措施） | 140 | zh140 / vi140 / th140 / id140 / ms140 | 错误 0 |
| 2026-10-28 | my-p3-b07 | MY 括号增补（管制物品/许可） | 153 | zh153 / vi153 / th153 / id153 / ms153 | 错误 0 |
| 2026-10-28 | my-p3-b08 | MY 主体增补（监管机构） | 129 | zh129 / vi129 / th129 / id129 / ms129 | 错误 0 |
| 2026-10-28 | my-p3-b09 | MY 单缺括号 1-129（教育机构学期/大学章程/安理会决议） | 131 | zh131 / vi131 / th131 / id131 / ms131 | 错误 0 |
| 2026-10-28 | my-p3-b10 | MY 单缺括号 130-259（豁免公司/附表/签证） | 132 | zh132 / vi132 / th132 / id132 / ms132 | 错误 0 |
| 2026-10-28 | my-p3-b11 | MY 单缺括号 260-462（港口/税则/机构） | 207 | zh207 / vi207 / th207 / id207 / ms207 | 错误 0 |
| 2026-10-28 | my-p3-b12 | MY 主体清单 1-131（豁免令/所得税令/印花税令） | 140 | zh140 / vi140 / th140 / id140 / ms140 | 错误 0 |
| 2026-10-28 | my-p3-b13 | MY 末段单缺括号（司法专员/供款/延伸与修改） | 36 | zh36 / vi36 / th36 / id36 / ms36 | 错误 0 |
| 2026-10-28 | my-p3-b14 | MY 主干法主体 129 个（保险/环境质量/消费者保护/紧急状态等） | 304 | zh304 / vi304 / th304 / id304 / ms304 | 错误 0 |
| 2026-10-28 | my-p3-b15 | MY 双缺括号 110 条（大学校名/航空合资/证券指定） | 92 | zh92 / vi92 / th92 / id92 / ms92 | 错误 0 |
| 2026-10-29 | my-p3-b16 | MY 解析器升级后收尾（法院规则/内嵌年份/编号条例） | 64 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | vn-p1-b01 | VN 法律主题术语表组装（Luật/Bộ luật 全量） | 347 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | th-p1-b01 | TH 主题术语表第 1 批（60 个主题，佛历→公历） | 62 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | th-p1-b02 | TH 主题术语表第 2 批（163 主题全量；佛历→公历、已废止标记） | 163 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | th-p1-b01b | TH 首批 zh 纪年格式统一为「佛历X年／公历Y年」 | 62 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | id-p1-b01 | ID 动词前缀＋功能词分层组装（收支预算/政党/林业/采矿等） | 399 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | id-p1-b02 | ID 通用术语增补（医院/公路/法官/标准化/融资等） | 52 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | la-p1-b01 | LA 可读标题逐条真译（艾滋病/矿产/立法/竞争/合作社/民法典） | 12 | zh/en/vi/th/id/ms | 错误 0 |
| 2026-10-29 | ph-p1-b37 | PH 文号前缀剥离后还原题名（`Batas Pambansa Blg. N` → `AN ACT …`） | 263 | vi263 / th263 / id263 / ms263 | 错误 0 / 告警 0；四项质检 0 条 0 处；verify-data 全通过 |
| 2026-10-29 | id-p1-b01 | ID 单词类主题名（专利/商标/航运/保险等）逐条真译 | 110 | zh110 / en110 / vi110 / th110 / ms110 | 错误 0；质检仅存量 id 层问题 |
| 2026-10-29 | id-p1-b02 | ID 短语类 36–85：大学章程、公营企业、选举、医疗 | 54 | zh54 / en54 / vi54 / th54 / ms54 | 错误 0；质检仅存量 id 层问题 |
| 2026-10-29 | id-p1-b03 | ID 短语类 86–135：土地权属、核矿开采、行政法院 | 53 | zh53 / en53 / vi53 / th53 / ms53 | 错误 0；质检仅存量 id 层问题 |

---

## 第七批（b36）：语料换轨后的第一小批 —— 行政区划改名族 22 部

产出 **22 部**（`batches/ph-p1-b36.json`）。PH 7,106 → **7,128 / 23,117（30.8%）**。
全库 22,987 → **23,009 / 42,120（54.6%）**。

### 一、先说最重要的：语料性质变了

本批开工前跑 `_ph_inv.js`，发现 **PH 总量由 10,619 跃至 23,117**，新增 12,488 部。
这 12,488 部与之前译完的 7,106 部**不是同一类东西**：

| | 旧 7,106（已译完） | 新 12,488 |
|---|---|---|
| 文体 | 现代法，混排大小写 | 美治时期历史法规，OCR 扫描件 |
| 题名 | 完整句，可切句框 | 自由立法散文，含金额/地名/目的从句 |
| 既有产出率 | — | 现有多引擎合计 **88 / 16,011（0.55%）** |

所以「沿用第六批的句框继续推」这条路走不通。这不是引擎不够努力，
而是这批标题没有可复用的骨架——每一条的目的从句都是独一份的自由文本。

### 二、新语料体检（12,488 部）

```text
全大写（OCR 原样）            4,564  36.5%
档案馆著录前缀                  938   MALACAÑAN PALACE BY THE PRESIDENT OF … / BY THE PRESIDENT OF …
文号前缀                        851   Batas Pambansa Blg. N（其中 846 部后面跟着完整「AN ACT …」，可还原）
尾部以虚词收尾（明显截断）        423   「… IN THE CITY OF」「… FOR THE PROVINCE OF」
开头被切断                       87   「ANSLATOR IN THE OFFICE OF…」「TY AUDITOR, AND OF THE…」
```

首动词分布：`to` 1,792、`amending` 1,273、`creating` 598、`authorizing` 528、
`providing` 504、`appropriating` 432、`granting` 274、`extending` 197、`making` 173。

前四类（to/amending/creating/authorizing 等）都是**自由散文**；
真正的封闭结构只有改名、设立市镇这类，合计不到 300 条。

### 三、本批做了什么

只做**行政区划改名族**里结构封闭的一支，独立新建 `_ph_hist_rename.js`，
**不动 `_ph_gen2.js`**——历史语料是新文体，改共享引擎必背上 1.6 万条的回归包袱。

两式：

```text
A) [AN ACT] [TO] CHANGING THE NAME OF THE <区划> OF <旧名>[, IN THE <区划> OF <地>], TO [THAT OF] <新名>
B) [AN ACT] [TO] RENAMING <区划> <旧名> IN THE <区划> OF <地> AS <新名>
```

口径直接对齐库内既有 **656 条**改名族译文（不是自创）：

```text
vi  Đạo luật đổi tên <旧名>, <地> thành <新名>
th  พระราชบัญญัติเปลี่ยนชื่อ<旧名>, <地> เป็น <新名>
id  Undang-Undang mengubah nama <旧名>, <地> menjadi <新名>
ms  Akta menukar nama <旧名>, <地> kepada <新名>
```

区划词按库内多数派定：`Municipality→Kotamadya`(2,902)、`ms City→Bandar`(488)、
`vi Municipality→Thị trấn`(1,479)。历史语料的 `Pueblo` 按市镇处理（等同 Municipality）。

### 四、拒收才是主要工作（162 条拒收，产出 22）

判据全部是「宁可少译不可译错」的落地，逐条都踩过坑：

| 坑 | 现象 | 处理 |
|---|---|---|
| 专名吞从句 | `Roosevelt Avenue Located in Legislative District I of Quezon City` 整段当专名，`Located in` 漏进四语 | 专名里出现分词（Located/Stretching/Traversing/Commencing…）或非连接词的小写词 → 拒收 |
| 句点当逗号 | `Barrio of Gumalpong. Municipality of Baco` → 译文里留下英文 `Municipality of` | 专名内出现区划通名 → 拒收 |
| 漏分隔符 | `Barrio of Macaucang Municipality of Naujan`（源缺逗号）→ 同样漏英文 | 同上（**质检闸抓到**，非人工发现） |
| 截断标题 | `… PROVINCE AND ISLAND OF PARAGUA TO THAT OF`（新名被截掉） | 剥 `that of` 后为空 → 拒收 |
| 设施混入 | `Calapan Central School` 无区划通名，会被译成「Barrio Calapan Central School」 | 实体必须带区划通名，否则拒收（属设施族，不在本引擎口径） |
| 不定指 | `Change the Names of Certain Barrios…`、`All`、`Respectively` | 拒收 |

### 五、质量闸这条要记牢

`_ph_qchk.js` 在本批抓到 1 条人工复核时漏掉的**真缺陷**（`Macaucang Municipality of Naujan`），
说明「生成器内置闸门」比「事后抽查」可靠。另 2 条是专名误报
（`Presentacion`、`Brooke's Point`），用 `--allow` 放行并记录理由。

```text
chk-titles（--only vi,th,id,ms）    0 错 0 警
四项质检（串码/残留/伪译/排版）       0 条 0 处（含 2 条专名白名单）
verify-data                          全部通过（829 警告 / 4 提示）
```

### 六、结论：这条路的天花板

按现有规则引擎，16,011 条缺口最多再出一两百条。要真正推进必须换手段：

1. **先修数据源**（需用户裁定，改的是 `title.en` 不是译文）：
   938 条剥档案前缀、846 条剥 `Batas Pambansa Blg. N` 还原成 `AN ACT …`、
   423 条截断标题回源站重抓。修完这些，标题才是「法名」，翻译才有意义。
2. 剩下约 1.4 万条是自由散文，规则合成做不了，只有两条路：
   机器翻译 + 人工审校（需接入 MT 通道，当前仓库内无此能力），或分批人工。

**在数据源修好之前继续堆句框，产出率不会超过 1%。**

---

## 第八批（b37）：剥文号前缀还原题名 263 部 —— 先量后改，不动数据源

### 一、换法的理由

第七批结论是「规则引擎天花板约 1%」。本轮不再堆句框，改为**先量化再动手**：
把「脏数据形态」分桶，逐桶测通过率，看修数据源到底能解锁多少。
**仍不写 `title.en`**——只在解析时用「规范化视图」，写回的只有四语译文。

### 二、分桶实测（PH 缺口 15,986 条）

| 桶 | 条数 | 当前产出 | 剥前缀后 |
|---|---|---|---|
| A 干净（无前缀、非全大写） | 10,508 | 124（1.2%） | — |
| B 全大写 | 3,451 | 12（0.3%） | — |
| C 前缀可剥（文号/著录） | 846 | **0（0%）** | **298 可解** |
| X 仅有著录/文号，无 `AN ACT` 题名 | 1,181 | 0 | 见第五节 |

C 桶现状 0 产出、剥前缀后 100% 可解——说明前缀是**纯阻塞**，不是内容问题。
只有这一桶值得做。

### 三、交付：846 → 298 可解 → 267 过检 → **263 入库**

`_ph_norm_src.js` 生成规范化解析源（849 条里剥离 `Batas Pambansa Blg. N` 846 条），
`_ph_norm_run.js` 跑完整闸门，逐轮剔除：

```text
通过闸门              269
扣 缩写误切             1   PH-H15274  `Municipality of Sergio Osmea, Sr., Province of`
扣 Sub-Province 层级    1   PH-H15170  Sub-Province of Biliran 被并成 Tỉnh
扣 严重丢尾（比<0.45）   4   PH-H15020/15026/15409/15455
入库                  263
```

被闸门直接拦下的 29 条（未计入）：`Capacity` 未译 16、源缺逗号致 `Province of` 吞入专名 4、
多子句崩出 `for this in` / `and therefor.` 5、`sta.` 缩写误判 3。

### 四、两条基建（以后都要用）

1. **_ph_qchk.js 词表缓存**。`loadLex()` 原先每次全扫 4.2 万文件（约 3 分钟），
   多个脚本因此 SIGTERM。现改为优先读 `_ph_lexcache.json`（毫秒级），
   库内译文增量较大时用 `NO_LEXCACHE=1` 重建。缓存写法已回写进 loadLex 末尾。
2. **_ph_prechk.js 预检**。专名一致性（源侧每个专名首词必须出现在译文里）+ 长度比分位。
   注意白名单必须够全，否则 `Municipal`/`Provincial`/`Sub-Province` 这类被正确译走的通名会被误报
   （首版 132 条误报，补白名单后降到 52，剩余全是 `Ten-Bed`→「10 giường」这类正确翻译）。

### 五、X 桶 1,181 条分拣结论：不做

`_ph_short.js` 按「大小写是否破碎」分拣（真乱码特征是 `Tffi`/`RESIDruffi` 这类混排，
不是「全大写」本身）：

```text
全大写题名（行政令体）  1,039    ← ING 开头 754，长度≤70 仅 128，<Ving> THE <纯大写专名> 74
TitleCase 题名             77    含 `TIE`/`T6`/`MALACAN.ANG` 等 OCR 烂字，需逐条看
OCR 乱码                   71    符号/大小写破碎，永不可用
空题名（只有著录行）        49    `BY THE PRESIDENT OF THE PHILIPPINES` 之类
```

**不可做的理由**：那 74 条形如 `REORGANIZING THE PRESIDENTIAL COMMUNICATIONS OFFICE`，
结构上是「动词 + 机构专名」。动作词可译，但机构名（总统通讯办公室…）四语**无权威对照表**，
硬译必错、保留原文又会被残留检测判为半英半译。按「宁可少译不可译错」——放弃。
另 71 条 OCR 乱码只能回源站重抓，不是翻译问题。

### 六、语序疑点（存量，已量化但不擅改）

生成名称形如 `Trường Trung học Diadi Quốc gia`（修饰语在名后）。库内实测：

```text
vi  Trường Trung học：修饰紧跟核心词 39 | 修饰在名后 450
id  Sekolah Menengah：39 | 950
th  โรงเรียนมัธยมศึกษา：39 | 941
ms  Sekolah Menengah：520 | 469     ← 唯一接近对半的
```

vi/id/th 均为「在名后」占绝对多数，故本批**与多数派一致**。
但马来语标准术语是 `Sekolah Menengah Kebangsaan <名>`（缩写 SMK），属「修饰紧跟」，
与库内 469 条倒序冲突。这是**存量不一致**，需要单独立项统一，不在本批擅动。

### 七、口径（重要）

本批 `title.en` 保留 `Batas Pambansa Blg. N` 文号，**四语译名只对应 `AN ACT …` 题名，不含文号**。
理由：文号是编号不是法律名称；库内已完成 7,391 部 PH 的 en 均以 `An Act` 开头、译名均为题名式，
口径一致。若日后要统一带文号，是纯字符串前缀拼接，可低成本回填。

### 八、覆盖变化

```text
PH     7,128 → 7,391 / 23,117（30.8% → 32.0%）
全库  23,009 → 23,272 / 42,121（54.6% → 55.3%）
```

交付链：`chk-titles` 0 错 0 警 → 四项质检 0 条 0 处 → `sync-titles-to-catalog`
（其他语种 vi/th/id/ms 各 263）→ `rebuild-index`（42,120 部 / 564,127 条）→
`verify-data` **全部通过（829 警告 / 4 提示，均为存量）**。

### 九、结论

规则引擎这条路已经走完：PH 剩余 15,726 条里，A+B 桶 13,959 条是自由散文、
X 桶 1,181 条是不可做、其余为已扣。**没有第二桶能再靠剥前缀解锁**。
要继续推进只有两条：接 MT 通道 + 人工审校，或分批人工。

---

## 第九批（id-p1-b01–b03）：ID 整链缺失 2,861 部 —— 逐条真译 217 部

### 一、为什么转做 ID

PH 剩余 15,726 条已判定为「规则引擎不可及、只能 MT + 人工」。
ID 这批是**整条链缺失**：2,861 部只有 `orig`（印尼语），`zh/en/vi/th/ms` 五语全空，
中文用户在这些条目上完全看不到标题。从「0 到可用」的边际价值最高，且体量可控、能逐条过眼。

### 二、语料性质与 PH 完全不同

PH 是长散文（`AN ACT CREATING … TO BE KNOWN AS …`），ID 是**法规主题简称**：

```text
单词类   55   PATEN / MEREK / GRASI / KITAB UNDANG-UNDANG HUKUM PIDANA
短语类  893   PENYELENGGARAAN PERIZINAN BERUSAHA BERBASIS RISIKO
长标题 1,522   PERUBAHAN ATAS UNDANG-UNDANG NOMOR 5 TAHUN 1999 TENTANG …
```

体检：唯一标题 **2,522**（去重后），全大写 82.6%，`level` 几乎全是 `law`（2,857 / 3,348），
重复 159 组 317 条冗余（译文可复用）。
首词 top：PERUBAHAN 270、PENAMBAHAN 223、PEMBENTUKAN 220、PERATURAN 188。

### 三、口径以库内既有 487 部为准（不是另立）

```text
zh        <主题>法        ← 简称式，不带文号
en        Law on <主题>
vi        Luật về <主题>
th        พระราชบัญญัติว่าด้วย<主题>
ms        Akta tentang <主题>
```

**zh 不带文号、其余四语按需带文号**，这是库内 `ID-H002` 等 487 部定下的：
`专利法` / `Law No. 13 of 2016 on Patents`。与 PH 第九批口径相反（PH 是 en 带文号、译名不带）。
非「法」类不套句式：`STATUTA …` → 章程，`Petunjuk Teknis …` → 技术指南。

### 四、交付 217 部

```text
b01  单词类 55 + 短语类前 35      → 89 唯一标题 / 110 条
b02  短语类 36–85                → 50 / 54
b03  短语类 86–135               → 50 / 53
```

`POKOK-POKOK`（要点）信息不全，跳过不译。`KETENAGANUKLIRAN` / `KETENAGAUNUKLIRAN`
是同一法规的两种拼写，译同一主题。

### 五、工具链（新增，可复用）

1. **`_id_clean.js`** 清洗 + 三分类。踩到的数据坑：
   - `PENGESAHAN_2` / `_3` 尾缀是**去重编号**，不是标题；
   - `WABAH.` / `POKOK-POKOK,` 尾部标点；
   - `E N E R G I` / `P E L A Y A R A N` 字母被空格拆开，须还原。
   动词性主题（`PENGESAHAN`、`PENCABUTAN`、`PEMUNGUTAN`）单看词无法成句（「批准」什么？），单列一桶不译。
2. **`_id_expand.js`** 把「标题 → 五语」展开成「条目 id → 五语」，自动处理一条标题对应多条 id。
3. **`_ph_qchk.js` 改增量语义**：批次未出现的语种回落到库内既有值，两边皆空才判 `empty`。
   原先对只写五语中部分键的批次恒报 `empty:id`。

### 六、两个判据要记住

- **chk-titles 的长度比告警对 ID 批不适用**。zh 只译主题（`专利法` 3 字 vs `Law on Patents`），
  比值 0.13–0.25 是口径必然结果。库内 `ID-H002` 的 zh/en 比是 0.103，比这批更低。
- **目标语与英文同形的固有词必须进白名单**，否则 pseudo 判据误报：
  `Mineral`（马来语=矿物）、`TRANSFER`（印尼语借词）、`Đầm lầy`（越南语=沼泽，不在词表）。
  已写入 `_ph_qallow.json`。

### 七、覆盖变化

```text
ID     487 → 704 / 3,348（14.5% → 21.0%）
全库  23,272 → 23,489 / 42,121（55.5% → 55.8%）
```

交付链：`chk-titles` 错误 0 → 质检仅剩存量 `id` 层问题（尾逗号、`TRANSFER`）→
`sync-titles-to-catalog` → `rebuild-index` → `verify-data` **全部通过（829 警告 / 4 提示）**。

### 八、剩余与节奏

ID 还剩 **2,644** 部（2,522 唯一标题里已做 189 个，剩约 2,333 个唯一标题）。
按每批 50 个唯一标题计，还需约 **45 批**。这条链没有捷径：
主题词必须逐条译，规则引擎对印尼语从零起步成本高于收益（PH 的教训）。

---

## 第十批（id-p1-b04–b07）：ID 短语类推进 199 部

### 一、节奏与产出

```text
b04  短语类 136–185   投入 50 / 译 47 / 入库 50 条（3 个标题各含 2 部）
b05  短语类 186–235   投入 50 / 译 50 / 入库 53 条（3 个标题各含 2 部）
b06  短语类 236–285   投入 50 / 译 47 / 入库 49 条（2 个标题各含 2 部）
b07  短语类 286–335   投入 50 / 译 46 / 入库 47 条（1 个标题含 2 部）
```

本批 200 个唯一标题里实际译 **190 个**，入库 **199 部**。四批均一次过检，
无返工，说明「逐条真译 + 展开到 id」的流程已经稳定。

### 二、跳译的 10 条，全部有明确理由（不是偷懒）

| 类型 | 条数 | 例 |
|---|---|---|
| 源标题被截断、缺宾语 | 6 | `NUMBER 7 OF 1996 ON`、`PERJANJIAN INTERNASIONAL MENGENAI`、`SISTEM NASIONAL PENELITIAN, PENGEMBANGAN`、`PENETAPAN UU DARURAT NO. 27 TAHUN 1957 TENTANG` |
| 列举被截、只剩前两项 | 2 | `PEMBENTUKAN KABUPATEN PELALAWAN, KABUPATEN ROKAN`、`PEMBENTUKAN PROPINSI IRIAN JAYA TENGAH, PROPINSI IRIAN` |
| 缺中心词、补则等于猜 | 1 | `KETENTUAN-KETENTUAN POKOK KEKUASAAN`（疑缺 `KEHAKIMAN`，不敢补） |
| 同期重复 | 1 | `PERIMBANGAN KEUANGAN ANTARA`（与 b06 内 `…PUSAT DAN DAERTAH` 同法，只译后者） |

### 三、新发现的数据脏型（已写进批注，供后续批复用）

```text
PEKERJASERIKAT BURUH     两词粘连 → Serikat Pekerja / Serikat Buruh（工会法）
KEUANGANADMINISTRATIF    两词粘连 → Keuangan Administratif（财务行政权利）
DANATAU / DanAtau        两词粘连 → dan/atau（和/或），b06、b07 各一条
PELAKSANAAN … SIMPAN PINJAM I   杂散单字母 I（原文噪声）
Peraturan Perundang-undangan 8 Investasi Pemerintah   标题中混入数字 8
Ekpor / ANGARAN / DAERTAH      拼写错误 → Ekspor / ANGGARAN / DAERAH
PERKUMPULAN KOPERASI'          尾部游离撇号（键名须带撇号才能匹配）
```

### 四、两条口径裁定

1. **`Keputusan` 不套「法」**。`Keputusan 183 Badan Koordinasi Penanaman Modal`
   译为「投资协调委员会第 183 号决定」——决定就是决定，与 b03 的
   `STATUTA`→章程、`Petunjuk Teknis`→技术指南 同一逻辑。
2. **白名单续补**：`Import`（马来语规范用词）、`Legal`（`Metrologi Legal` 为马来语
   通用术语）——两词与英文同形，pseudo 判据会误报，已入 `_ph_qallow.json`。
   `pseudo:id` 剩余命中均为库内既有印尼语原文（如 `METROLOGI LEGAL`、
   `PENGESAHAN STOCKHOLM CONVENTION ON PERSISTENT ORGANIC`），不动原文。

### 五、一处**内部不一致，需单独立项统一**（本批已暴露，未擅改）

印尼三种国有企业形态，本会话内出现了两套译法：

```text
Perjan (Perusahaan Jawatan)   b04 译「公营公司」（设立…医院公营公司法）
                              b07 译「公营局企业」（PERUSAHAAN JAWATAN (PERJAN)）
Perum  (Perusahaan Umum)      b03/b04 均译「公营企业」
Persero(Perusahaan Perseroan) 尚未出现
```

正确对应应为 Perjan→局营、Perum→公营、Persero→公营有限，三档有别。
本批 b07 的「公营局企业」方向正确，b04 的「公营公司」偏宽。
**这是同一批语境内的术语漂移，比词表缺失更危险**，须在 Persero 大批出现前
统一回填（纯字符串替换，成本低）。

### 六、覆盖变化

```text
ID     754 → 903 / 3,348（22.5% → 27.0%）
全库  23,539 → 23,688 / 42,121（55.9% → 56.2%）
```

交付链：`chk-titles` 错误 0（告警 198 条全为 zh 简称所致的长度比，口径必然）→
三项质检仅剩存量 `id` 层命中 → `sync-titles-to-catalog` → `rebuild-index`
（42,120 部 / 564,127 条）→ `verify-data` **全部通过（829 警告 / 4 提示，均为存量）**。

### 七、剩余

ID 剩 **2,445 部**，短语类已推进到第 335 个唯一标题（共 893 个），
其后为长标题 1,522 条（`PERUBAHAN ATAS UNDANG-UNDANG NOMOR X TAHUN Y TENTANG Z` 句式为主）。

---

## 第十一批（id-p1-b08–b10）：ID 短语类再推 144 部

### 一、产出

```text
b08  短语类 336–385   投入 50 / 译 43 / 入库 46
b09  短语类 386–435   投入 50 / 译 48 / 入库 48
b10  短语类 436–485   投入 50 / 译 49 / 入库 50
```

入库 **144 部**。b08 有 3 条源标题被截断且**原文实际包含更多县份**，一律不译：

```text
PEMBENTUKAN KABUPATEN BUOL, KABUPATEN MOROWALI      UU 51/1999 实含 3 县
PEMBENTUKAN KABUPATEN NUNUKAN, KABUPATEN MALINAU    UU 47/1999 实含 4 县
PEMBENTUKAN KABUPATEN DAERAH TINGKAT II WAY KANAN, KABUPATEN   断在「KABUPATEN」
```

另有 `KEDUDUKAN MPRS DAN DPR-GR MENJELANG`（断在 MENJELANG）、
`HAK TANGGUNGAN ATAS TANAH BESERTA BENDA-BENDA YANG`、
`Peraturan Perundang-undangan 3`（只有数字）、
`POS/PERS DENGAN RAHMAT TUHAN YANG MAHA ESA`（题名破碎，两批各一条）不译。

### 二、结构红利：设县设市类可成套处理

b09/b10 里 `PEMBENTUKAN KABUPATEN/KOTA/PROVINSI` 占 30 余条，句式只有五种：

```text
PEMBENTUKAN KABUPATEN <名>                              设立…县法
PEMBENTUKAN KABUPATEN <名> DI PROVINSI <省>             在…省设立…县法
PEMBENTUKAN KOTA/KOTAMADYA DAERAH TINGKAT II <名>       设立二级行政区…市法
PEMBENTUKAN KABUPATEN DAERAH TINGKAT II <名>            设立二级行政区…县法
PEMBENTUKAN DAERAH KABUPATEN <名>                       设立…县法
```

地名用库内既有译名（`Kotamadya`→Kotamadya、`ms City`→Bandar 的旧裁定仍适用），
`Daerah Tingkat II` 一律译「二级行政区」保留层级。**这批是短语类里性价比最高的一段**，
若后续还有同类，可先按句式批量出草稿再逐条校名。

### 三、新脏型

```text
PEMBENTUKANMAJELIS          → PEMBENTUKAN MAJELIS（设立…科学院）
NEGARADAERAH                → NEGARA DAERAH（国家与地方）
KEUANGANADMINISTRATIF       → KEUANGAN ADMINISTRATIF
DANATAU / danatau           → dan/atau
KONPENSI                    → KONVENSI
KABUPATEN DAERAH BOALEMO    → 多一个 DAERAH
BANJAR BARU / BANJARBARU    同一市两种拼写，两条同译
```

### 四、白名单续补

`bôi`、`trơn`（越南语「润滑」，`Dầu bôi trơn` 润滑油）。库内 4.2 万条从未出现过这两词，
residue 判据误报为英文残留。已入 `_ph_qallow.json`。

### 五、⚠ 一处**存量**质量问题（本批发现，未动）

抽查 `ID-H2131` 时发现库内 1,047 部 ID 条目里：

```text
en 以小写字母开头        248 部（23.7%）
典型样本：
  ID-H093   en: change of name Law
  ID-H097   en: establishment Law
  ID-H1005  en: tariff services type non-tax state revenue currently
                applicable at department forestry and plantation Law
  ID-H042   en: the 1945 Constitution of the Republic of Indonesia
```

这不是大小写洁癖问题。`ID-H1005` 那种「词序全乱 + 逐个名词直译」是**早期机翻产物**，
而 **en 是 vi/th/id/ms 的语义基准**——基准若是烂的，另外四语就是照着烂基准译的。
`ms` 与 `orig` 完全相同者仅 4 部，且都是 `Statuta …` 专名，属正常，不必处理。

**这 248 部（约 1/4 的 ID 存量）建议单独立项重做 en，再连带重推四语。**
未获裁定前不动——因为改 `title.en` 属于改数据源，与 PH 那批同一性质。

### 六、覆盖变化

```text
ID     903 → 1,047 / 3,348（27.0% → 31.3%）
全库  23,688 → 23,832 / 42,121（56.2% → 56.6%）
```

交付链：`chk-titles` 错误 0 → 三项质检仅剩库内既有 `id` 层命中（`Metrologi Legal` ×2、尾逗号 ×1）
→ `sync-titles-to-catalog` → `rebuild-index` → `verify-data` **全部通过（829 警告 / 4 提示）**。

### 七、剩余

ID 剩 **2,301 部**，短语类推进到第 485 / 893 个唯一标题；其后长标题 1,522 条。

---

## 第十二批（id-p1-b11–b13）：ID 短语类再推 137 部

### 一、产出

```text
b11  短语类 486–535   投入 50 / 译 47 / 入库 52（设市类密集：PADANG SIDEMPUAN 等）
b12  短语类 536–585   投入 50 / 译 43 / 入库 44（资本市场检查、洗钱犯罪、边境贸易）
b13  短语类 586–635   投入 50 / 译 41 / 入库 41（区划设定法 10 条 + 勋章/预算法）
```

入库 **137 部**，三批均一次过检。

### 二、设市设县的译名依据（本批新增 20 余个地名）

**先查库内既有译名，再补新的**，不另造体系：

```text
复用既有：特尔纳特(Ternate) 登巴萨(Denpasar) 万隆(Bandung) 楠榜(Lampung)
          巴布亚(Papua) 西爪哇(Jawa Barat) 兰尼查亚(Lanny Jaya) 中曼伯拉莫(Mamberamo Tengah)
新增（按同一音译规则）：巴东西登普安 帕加尔阿拉姆 丹戎槟榔 比通 查亚普拉 马塔兰
          丹格朗 帕卢 肯达里 勿加泗 古邦 打拉根 恩杜加 索龙 班贾尔 兰沙 巴图
```

句式沿用 b09/b10：`PEMBENTUKAN KOTA` → 设立…市法（Thai `นคร`、ms `Bandar`）；
`PEMBENTUKAN KOTAMADYA DAERAH TINGKAT II` → 设立二级行政区…市法；
`… DI PROVINSI X` → 在 X 省设立…县法。

### 三、b13 的 10 条 `KABUPATEN X DI PROVINSI Y` —— 查证后确认**不是截断**

这 10 条题名形如 `KABUPATEN BANDUNG DI PROVINSI JAWA BARAT`，无动词，初看像
`PEMBENTUKAN` 被剥掉的残缺标题。开包核对 `articles` 后确认是**真实完整题名**：

```text
Pasal 1  Dalam Undang-Undang ini yang dimaksud dengan:
         1. Provinsi Jawa Barat adalah bagian dari wilayah NKRI berdasarkan
            Undang-Undang Nomor 10 Tahun 2023 tentang Provinsi Jawa Barat.
         2. Kabupaten Bandung adalah daerah kabupaten yang berada di wilayah
            Provinsi Jawa Barat yang dibentuk berdasarkan UU Nomor 14 Tahun 1950 …
```

这是 2024 年那批「区划设定法」（逐条规定某省/县在国家领土中的定位），
题名本身就是地名。故译为 `西爪哇省万隆县法` / `Law on Bandung Regency in West Java Province`，
**不加「设立」**——加了就是替源数据编动词。同批 `PROVINSI BALI` 同理作「巴厘省法」。

判据记下来：**题名只有地名、无动词时，先开包看 `articles`**。若第 1 条是
「Dalam Undang-Undang ini yang dimaksud dengan …」的定义式，则地名即题名，
不可补动词；若正文在讲设立/变更边界，才按事件译。

### 四、⚠ 发现一处大面积元数据缺陷（3,312 部，未动）

核 b13 时顺带查了 ID 全库 3,348 部：

```text
issuingBody = "泰国国会"        3,312 部（占 98.9%，全部在 pack id-p02）
docNumber 格式不统一             "UU 103/2024" 与 "UU5-1999"、"UU141-2024" 混用
promulgatedDate 多为 "2024"      仅年份，无月日
category 多为 "01_宪法与基础法"   与其内容（预算法、保险法、勋章法）不符
```

印尼法律被标成「泰国国会」，是抓取管道整包写死的默认值，不是逐条错误。
**属元数据、不属标题，且改动面 3,312 个文件，未获裁定不动。** 建议单独立项：
以 `docNumber` 归一到 `UU <n>/<年>` 格式、`issuingBody` 改为 `印度尼西亚国会`、
`category` 按实际内容重分类。

### 五、白名单续补

```text
Legal     印尼语「法定」（Metrologi Legal 是印尼语法定计量），pseudo:id 误报 → 已加 id 白名单
may       越南语「缝制」（Dệt may 纺织缝制），residue:vi 误报 → 已加 vi 白名单
```

### 六、覆盖变化

```text
ID     1,047 → 1,184 / 3,348（31.3% → 35.4%）
全库  23,832 → 23,969 / 42,121（56.6% → 56.9%）
```

交付链：`chk-titles` 错误 0（告警 137 条全为 zh 简称所致的长度比）→
三项质检 0 条 0 处 → `sync-titles-to-catalog` → `rebuild-index`
（42,120 部 / 564,127 条）→ `verify-data` **全部通过（829 警告 / 4 提示，均为存量）**。

### 七、剩余

ID 剩 **2,164 部**，短语类推进到第 635 / 893 个唯一标题。
其后 258 个短语类，再后是长标题 1,522 条。

---

## 第十三批（id-p1-b14–b16）ID 短语类再推 144 部

### 一、产出

```text
b14  短语类 636–685   投入 50 / 译 47 / 入库 47（经济特区、法院、印花税、勋章）
b15  短语类 686–735   投入 50 / 译 45 / 入库 52（14 条判例法院 + 特区 + 计量标志）
b16  短语类 736–785   投入 50 / 译 44 / 入库 45（10 条高等法院设立、7 条预算决算）
```

入库 **144 部**，三批均一次过检。

### 二、**正文还原题名**成为本批主线（与 b13 的判据互补）

b13 的判据是「题名只有地名、先开包看 `articles`」；本批遇到了它的反面：
**题名被截断、但正文里有完整题名**。凡是正文含
`MEMUTUSKAN Menetapkan: UNDANG-UNDANG TENTANG …` 或以
`PEMBENTUKAN PENGADILAN TINGGI …` 起首的，均可逐字还原，**这不是猜**：

```text
ID-H192  PENCABUTAN HAK-HAK ATAS TANAH DAN
      → …DAN BENDA-BENDA YANG ADA DIATASNYA        → 撤销土地权利及地上物权利法
ID-H201  PERUBAHAN ATAU PENAMBAHAN NAMA
      → …NAMA KELUARGA                             → 更改或增加姓氏法
ID-H374  PEMBENTUKAN PENGADILAN TINGGI PALANGKARAYA DAN
      → …DAN PERUBAHAN WILAYAH HUKUM PENGADILAN TINGGI BANJARMASIN
                                                    → 设立…并变更马辰高等法院管辖区法
```

b16 的 10 条法院设立类（ID-H374/375/376/394–400）全部按此法还原，
题名断在 `DAN` 但后一半「变更某高等法院管辖区」在正文首句里完整存在。
若只凭题名，这 10 条只能整批跳译。

**反例（正文对不上，一律不译）**：

```text
ID-H123  KEDUDUKAN KEUANGAN KETUA, WAKIL KETUA DAN
      正文却是「tunjangan kecelakaan pegawai negeri」——标题与正文错配，不译
ID-H127 / ID-H194  正文无 Menetapkan 段，无据可依，不译
```

### 三、跳译 15 条，逐条有据

| 类型 | 条数 | 例 |
|---|---|---|
| 截断且正文无完整题名 | 8 | `TAMBAHAN DAN PERUBAHAN ATAS`、`PERUBAHAN KETIGA ATAS UNDANG-UNDANG`、`PENETAPAN UU DARURAT NO. 6 TAHUN 1958 TENTANG`、`PEMBESARAN MODAL DARI PERSEROAN DAN`、`KEANGGOTAAN REPUBLIK INDONESIA DALAM BANK` / `PADA` |
| 预算追加类 13 条同题 | 13 | 见第四节 |
| 标题与正文错配 | 1 | `ID-H123` |
| 决策文件无中心词 | 1 | — |

### 四、⚠ 13 条 `TAMBAHAN DAN PERHITUNGAN` 预算追加法：可解但**故意不解**

b15 有 13 条同题 `TAMBAHAN DAN PERUBAHAN ATAS ANGGARAN PENDAPATAN DAN`，
docNumber 各带年份（UU3-1979…UU4-1995）。看似「补上年份即可」，实测不可：

```text
ID-H370  doc=UU3-1979   正文「Tahun Anggaran 1978/1979」   ← 文号年 1979，预算年 1978/1979
ID-H414  doc=UU3-1983   正文「Tahun Anggaran 1982/1983」   ← 差一年
ID-H671  doc=UU5-1993   正文「Tahun Anggaran 1992/93」     ← 且记法不统一（两位/四位）
```

**文号年 ≠ 预算年度**，且正文同时出现前后两个年度（比较段），取最高频也会取错。
13 条若强译，只能给出 13 个完全相同的「国家收支预算追加与变更法」，
用户无法区分——这比留空更坏。故整组跳译，留待专批用「正文最高频 Tahun Anggaran」逐条抽取。

### 五、术语：Persero 首次出现，按既定三档落位

b10 已记录印尼国企三形态应作 Perjan→局营、Perum→公营、Persero→公营有限。
本批首次遇到 Persero，按此执行：

```text
PENDIRIAN PERUSAHAAN PERSEROAN (PERSERO) DI BIDANG PERBANKAN
  → 银行业设立公营有限公司法
PEMBUBARAN … (PERSERO) PT KERTAS GOWA / PT KERTAS LECES
  → 解散戈瓦纸业 / 莱塞斯纸业公营有限公司法
OBLIGASI PERUSAHAAN UMUM (PERUM) PEGADAIAN
  → 公营典当公司债券法
```

b04 遗留的「Perjan→公营公司」偏宽问题仍未回填（未获裁定），但本批未再产生新的漂移。

### 六、新脏型

```text
JANDADUDANYA        → JANDA/DUDANYA（遗孀/鳏夫），法官遗属退休金
PERHITUNGAN ANGGARAN NGARA   → NEGARA 漏字
PERHITUNGAN … 19831984 / 19971998 / 199596  → 年份缺斜杠，须还原为 1983/1984 等
ERHITUNGAN …        → PERHITUNGAN 首字母被吞
INDONESISCHE COMPTABILTEITSWET (STAATSBLAD 1925   → 括号未闭，引证号缺失（不补号，只译法名）
```

### 七、覆盖变化

```text
ID     1,184 → 1,328 / 3,348（35.4% → 39.7%）
全库  23,969 → 24,113 / 42,121（56.9% → 57.2%）
```

交付链：`chk-titles` 错误 0（告警全为 zh 简称 + id 层简称的长度比，口径必然）→
三项质检仅剩库内 `id` 层存量（`ID-H759` 尾逗号、`ID-H1875` 原文夹英文条约名）→
`sync-titles-to-catalog` → `rebuild-index`（42,120 部 / 564,127 条）→
`verify-data` **全部通过（829 警告 / 4 提示，均为存量）**。

### 八、剩余

ID 剩 **2,020 部**，短语类推进到第 785 / 893 个唯一标题。**短语类只剩 108 个**，
其后即 1,522 条长标题（`PERUBAHAN ATAS UNDANG-UNDANG NOMOR X TAHUN Y TENTANG Z` 句式）。

---

## 第十四批（id-p1-b17–b18）ID 短语类收官 —— 893 个唯一标题全部处理完 · 117 部

### 一、产出

| 批次 | 条目 | 说明 |
| --- | --- | --- |
| b17 | 59 | 短语 785–834；61 条 id 中跳译 2 条 |
| b18 | 58 | 短语 835–892，**1:1 无跳译** |
| 合计 | **117** | |

交付链：`chk-titles` 错误 0 → 三项质检仅 `id` 层存量 → `apply-multi` → `sync-titles-to-catalog`
→ `rebuild-index`（42,120 部 / 564,127 条）→ `verify-data` **全部通过（829 警告 / 4 提示，均为存量）**。

### 二、口径修正：b17 起改为「按条目 id 直接落盘」，不再走 `_id_expand.js`

b17 遇到 **一标题多 id 但语义各不相同**的组：`PENETAPAN PERATURAN PEMERINTAH PENGGANTI
UNDANG-UNDANG` 挂 11 个 id。`_id_expand.js` 按标题展开，会产出 11 个完全同义的标题——
与 b15「13 条预算追加法强译只得 13 个无法区分」是同一个坑。

故 b17/b18 改为在生成脚本里直接构造 `items`（id → 五语），由脚本自查
「范围内 id 全覆盖 + 无越界」，绕开标题级展开。11 条逐条从正文 `Menetapkan:` 取出台阶对象：

```text
ID-H1867  Perppu 5/2008  → 税收通则与程序法第四次修正代法令升格法
ID-H974   Perppu 1/1998  → 破产法修正代法令升格法
ID-H1255  Perppu 2/2000  → 沙璜自由贸易区与自由港代法令升格法
ID-H1429  Perppu 1/2002  → 恐怖主义犯罪惩治代法令升格法
ID-H1430  Perppu 2/2002  → 巴厘岛爆炸事件适用反恐代法令的代法令升格法
ID-H1453  Perppu 2/2004  → 大选法修正代法令升格法
ID-H1498  Perppu 1/2005  → 劳动关系争议解决法延期施行代法令升格法
ID-H1661  Perppu 1/2007  → 巴淡自由贸易区与自由港法修正代法令升格法
ID-H1663  编号正文未载 → 亚齐与尼亚斯重建法律问题处理代法令升格法（标题内不写编号）
ID-H1779  Perppu 1/2008  → 巴布亚特别自治法修正代法令升格法
ID-H417   编号正文未载 → 增值税法延期施行代法令升格法
```

**判据（新增）**：升格法标题里的 Perppu 编号**只在正文明确出现时才写**。
`ID-H1663`、`ID-H417` 正文未给编号，标题即不写——不按 `docNumber` 反推（文号年 ≠ Perppu 年，b15 已证）。

### 三、四条跳译 / 两条错配

b17 跳译 2 条，均为**标题与正文错配**（同 `ID-H123` 判据）：

```text
ID-H262  title=「外国投资法（1958年国家公报…）」doc=UU78-1958
         正文=Pasal 1 明确「Undang-undang No. 78 tahun 1958 … dicabut」，签署日 1965-08-23
         → 库里挂的是被撤销的原法标题，正文是撤销法。两处元数据互斥，不猜。
ID-H428  title=「设立…自由港」doc=UU4-1970
         正文=Pasal 1「Mencabut Undang-undang Nomor 4 Tahun 1970 …」，签署日 1985-10-02
         → 同上，标题是被撤销法、正文是撤销法。
```

b18 **零跳译**：58 条全部可从正文 `Pasal 1` 直接读出主题，含 18 条预决算（年度由
`Pasal 1` 首句 `Tahun Anggaran YYYY/YYYY` 逐个核对，不靠 `docNumber` 推断）。

### 四、`id` 层存量缺陷（本批暴露 5 条，均非本批引入）

三项质检的 `pseudo:id` 命中全部落在**库内既有 `id` 层**（本批只写 zh/en/vi/th/ms，
质检按增量语义回落库内 `id`）：

```text
ID-H1564 / ID-H1881  → "AGAINST"
ID-H448              → "AMENDING"
ID-H533              → "BETWEEN REPUBLIC"
ID-H714              → "FRAMEWORK"
```

根因：这些条的原文标题本身就是**印尼语框架 + 英文条约名混排**（`PENGESAHAN TREATY OF
MUTUAL RESPECT, FRIENDSHIP AND COOPERATION …`），英文词必然落在 `id` 层。属数据源形态，
不得擅改。与 `ID-H1875`（原文夹英文条约名）同类，一并留待「`id` 层清洗」专批。

### 五、覆盖变化

```text
ID     1,328 → 1,445 / 3,348（39.7% → 43.2%）
全库  24,113 → 24,230 / 42,121（57.2% → 57.5%）
```

### 六、剩余

短语类 **893 / 893 收官**（standalone 55 + verbal 52 + phrase 893 = 1,000 个唯一标题已全部处理）。
ID 剩 **1,903 部**，主体是 **1,522 条长标题**（`PERUBAHAN ATAS UNDANG-UNDANG NOMOR X TAHUN
Y TENTANG Z` 句式）——结构规整，拟先做槽位模板，再逐批填充。

---

## 第十五批（id-p1-b19–b23）ID 长标题首族「国家资本参与增资（PMN）」收官 · 234 部

### 一、产出

| 批次 | 范围（族内索引） | 条目 | 跳译 |
| --- | --- | --- | --- |
| b19 | 0–7、10–25（25 标题） | 99 | 3 |
| b20 | 8、9（2 标题） | 26 | 0 |
| b21 | 26–41（16 标题） | 28 | 0 |
| b22 | 43–55（13 标题） | 17 | 1 |
| b23 | 56–84（29 标题） | 46 | 0 |
| 合计 | **85 / 85 标题** | **216** | 4 |

族内条目共 220 条，交付 216 条。全链 `chk-titles` 错误 0、质检 0 处、`verify-data` 全部通过。

### 二、⚠ 本批最大陷阱：85 字符截断造成「同名不同实体」，按标题批量套译会把 13 家公司写成一家

分桶标题在 85 字符处被硬截，`PENAMBAHAN PENYERTAAN MODAL NEGARA … KE DALAM MODAL
SAHAM PERUSAHAAN PERSEROAN (PERSERO) PT I` 这一条**挂了 12 个 id**，实测是 12 家**不同公司**：

```text
PT Industri Sandang II          PT Indonesia Farma
PT Industri Pesawat Terbang…    PT Inhutani I
PT Industri Kapal Indonesia     PT Indonesia Asahan Aluminium
PT Biro Klasifikasi Indonesia   …
```

同型截断组还有 `PT B`（13 条，含 Bio Farma / Bank Tabungan Negara / Batan Teknologi /
Boma Bisma Indra / Brantas Abipraya / Bahana / Bank Ekspor Impor）、`PT A`（14 条，含 Angkasa
Pura I·II / Adhi Karya / Aviasi / Asuransi Kredit Indonesia / ASDP / Angkutan Sungai）、
`PT S`（12 条，含 Semen Indonesia / Semen Padang / Sang Hyang Seri / Sarana Multi
Infrastruktur / Sarana Multigriya Finansial）、`PT P`（17 条，含 Pupuk Sriwijaya / Pertani /
Pos Indonesia / Pelabuhan I·II·IV / PPA / PII / Pindad / PTPN III / PLN ×2 / PELNI）、
`PT D`（9 条，含 Danareksa / Dirgantara / Dharma Niaga / Dok Surabaya / DAMRI）。

**判据（新增，写入族规范）**：长标题族一律**不按标题套译**，必须逐条读正文 `Pasal 1`
取出实体名；`_id_expand.js` 的标题级展开在长标题族不可用。

### 三、四条跳译

| id | 原因 |
| --- | --- |
| `ID-H1650` | 正文缺 Pasal 1（只有 Pasal 2 起），orig 截断于 `PT I`，实体不可知 |
| `ID-H3225` | 同上（orig 截断于 `PT I`，2024 年度预算） |
| `ID-H1651` | 同上（orig 截断于 `PT K`） |
| `ID-H472` | 标题 `PT. RAJAWALI NUSANTARA INDONESIA`，正文 Pasal 1 是 `Perum Pos dan Giro`，互斥 |

### 四、专名处理口径（本批确立）

```text
印尼国企（PT / Perum 开头）→ zh 给中文名；en/vi/th/ms 保留拉丁原名。
  理由：PT Industri Sandang II 之类硬造音译必错；泰/越公文对印尼公司名本就用原名。
国际金融机构          → 四语全本地化译名，不留拉丁名。
  理由：IBRD / IFAD / ICD 拉丁全称含 for / of 等英文虚词，留在 vi/th/ms 里会被
        质检判为英文残留（实测 13 条 × 3 语 39 处告警）。改用
        「Ngân hàng Tái thiết và Phát triển Quốc tế」/「ธนาคารระหว่างประเทศเพื่อการบูรณะและพัฒนา」/
        「Bank Antarabangsa bagi Pembinaan Semula dan Pembangunan」后告警归零。
冠词 the 只进 en 句：…… in the ASEAN Infrastructure Fund / …… in the International Monetary Fund，
  vi/th/ms 不带（否则 residue 命中 "the"）。
```

### 五、覆盖变化

```text
ID     1,445 → 1,661 / 3,348（43.2% → 49.6%）
全库  24,230 → 24,446 / 42,121（57.5% → 58.0%）
```

### 六、剩余

ID 剩 **1,687 部**。长标题族下一目标：`PERUBAHAN ATAS PERATURAN …`（100 标题）、
`JENIS DAN TARIF …`（66）、`PENGALIHAN BENTUK PERUSAHAAN …`（23）、
`PENETAPAN PERUSAHAAN JAWATAN …`（11）等。

---

## 第十六批（id-p1-b24–b26）ID 长标题第二族「修改政府条例 / 商务部条例」收官 · 98 部

### 一、产出

| 批次 | 族内索引 | 条目 | 跳译 |
| --- | --- | --- | --- |
| b24 | 0–32 | 33 | 0 |
| b25 | 33–65 | 31 | 2 |
| b26 | 66–99 | 34 | 0 |
| 合计 | **100 / 100 标题** | **98** | 2 |

### 二、本族可全程槽位合成，不必开包

标题形态完整：`PERUBAHAN ATAS PERATURAN [PEMERINTAH|MENTERI PERDAGANGAN] NOMOR X TAHUN Y
TENTANG Z`，号 / 年 / 主题三者齐备，故按槽位直接生成，未读正文（仅 2 条因标题截断跳译）。
五语骨架：

```text
zh  修改{Y}年第{X}号{Z}政府条例法
en  Law Amending Government Regulation No. {X} of {Y} on {Z}
vi  Luật Sửa đổi Quy định của Chính phủ số {X} năm {Y} về {Z}
th  พระราชบัญญัติแก้ไขเพิ่มเติมกฎระเบียบรัฐบาลฉบับที่ {X} ปี {Y} ว่าด้วย{Z}
ms  Akta Meminda Peraturan Pemerintah No. {X} Tahun {Y} tentang {Z}
```

商务部条例把 `Government Regulation` 换 `Minister of Trade Regulation`、zh 换「商务部条例」。

### 三、数字 OCR 脏型（本族集中出现）

```text
3I TAHUN 2013 → 31    2OO4 → 2004    2OO5 → 2005
2O18 → 2018          2O17 → 2017     2O1O → 2010
```

另有三条编号是 `M-DAGPER` 编码（`118M-DAGPER122015`、`08M-DAGPER22009`、`62M-DAGPER122009`），
年份与序号被压进同一个编码串，无法可靠拆分 —— 这 3 条标题**只写主题、不写号/年**（b24 两条
`ID-H2933`/`ID-H1916`，b25 三条 `ID-H2014` 等）。

### 四、两条跳译

```text
ID-H1917  orig 截断于「… Tentang Ekspor Barang yang Wajib Menggunaka」→ 出口货物范围不可知
ID-H2015  orig 截断于「… Tentang Kewajiban Pencantuman Label Pada B」→ 标签对象不可知
```

### 五、`chk-titles.js` 口径修正：orig / id 层不受译名长度上限约束

`ID-H2905` 的原文标题本身 **361 字符**（国家经济复苏计划的法定全称），触发：

```text
✗ ID-H2905 / id：长度 > 300 (源文 214 / 实际 361)
✗ ID-H2905 / orig：长度 > 300
```

根因：`base` 取 `t.en || t.orig`，译文一写入，`base` 从 361 掉到 129，`cap` 随之收到 300，
反把 `orig` 卡住。已改为：

```js
const base = Math.max(en.length, orig.length);   // 不再被较短译文拉低
if (k !== 'orig' && k !== 'id') { /* 长度上限 */ }  // 原文层不受译名约束
```

修正后 `ID-H2905` 错误消失；全库回归跑 b17–b26 均仍为错误 0。

### 六、覆盖变化

```text
ID     1,661 → 1,759 / 3,348（49.6% → 52.5%）
全库  24,446 → 24,544 / 42,121（58.0% → 58.3%）
```

### 七、剩余

ID 剩 **1,589 部**。下一目标：`JENIS DAN TARIF ATAS JENIS PENERIMAAN NEGARA BUKAN PAJAK …`
（66 标题）、`PENGALIHAN BENTUK PERUSAHAAN …`（23）、`PENETAPAN PERUSAHAAN JAWATAN …`（11）、
`PEMINDAHAN IBU KOTA …`（14）、`PENJUALAN SAHAM MILIK …`（14）等。

---

## 第十七批（id-p1-b27）ID 长标题第三族「非税国家收入种类与税率」全族收官 · 105 部

### 一、产出

| 批次 | 族内标题 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b27 | 81 | 113 | **105** | 8 |

族内 113 条目此前**一部未译**，本次一次性收官。

### 二、本族是纯槽位族：句框固定、只换机构名

标题骨架只有两种：

```text
JENIS DAN TARIF ATAS JENIS PENERIMAAN NEGARA BUKAN PAJAK YANG BERLAKU PADA {机构}
TARIF ATAS JENIS PENERIMAAN NEGARA BUKAN PAJAK YANG BERLAKU PADA {机构}      （2000–2001 早期，仅税率）
```

故 `_gen_id_b27.js` 写成「机构槽表 + 句框函数」，105 条全部由 `AG`（38 个机构槽）
与 `FRAME`（A 种类与税率 / B 仅税率 / V 波动性 / F 医疗服务 / S 全机构）合成，未逐条手写：

```text
A  zh {机构}非税国家收入种类与税率
   en the Types and Rates of Non-Tax State Revenue Applicable at {机构}
   vi Các Loại và Mức Thu Ngân sách Nhà nước Phi thuế áp dụng tại {机构}
   th ประเภทและอัตรารายได้ของรัฐที่ไม่ใช่ภาษีซึ่งใช้บังคับใน{机构}
   ms Jenis dan Kadar Penerimaan Negara Bukan Cukai yang Berkuat Kuasa di {机构}

B  zh {机构}非税国家收入税率 ／ en the Rates of Non-Tax State Revenue Applicable at {机构}（余三语同法减「种类」）
```

`JENIS DAN TARIF`（种类与税率）与 `TARIF`（仅税率）**必须在译名里区分**：前者管种类又管税率，
后者只调税率，两类混译会掩盖立法差异。B 类共 15 部（`ID-H1311`/`H1402`/`H1405`/`H1309`/
`H1401`/`H1004`/`H1163`/`H1312`/`H1403`/`H1310`/`H1404`/`H1406` 等）。

### 三、标题截断的还原口径：只认 `Pasal 1` 的「yang berlaku pada …」

本族大量标题在机构名中途被 OCR 截断。凡 `Pasal 1` 有同指句的，按正文补齐：

```text
ID-H2426  … TATA RUANGB          → Pasal 1「Kementerian Agraria dan Tata Ruang/ Badan Pertanahan Nasional」
ID-H3124  … KOMUNIKASI DAN INFORMAT → 「Kementerian Komunikasi dan Informatika」
ID-H3193  … LINGKUNGAN HIDUP DAN KE  → 「Kementerian Lingkungan Hidup dan Kehutanan」
ID-H3194  … TELEVISI R              → 「Lembaga Penyiaran Publik Televisi Republik Indonesia」
ID-H2684  … KLIMATOLOGI, DAN        → BMKG（标准缩称）
ID-H2774  … ANTARIKSA N             → LAPAN
ID-H3125  … PENDIDIKAN, KEBUDAYAAN, → 「…, RISET, DAN TEKNOLOGI」（正文序言给出全称）
ID-H2319  … DI LINGKUNGAN K         → 「Kementerian Pertahanan」（医疗服务口径）
ID-H3130  … Pada Kementerian P      → 「Kementerian Perdagangan」（另有 BERSIFAT VOLATIL 限定）
ID-H2320 / ID-H1723  … UNTUK KEPE   → 「Penggunaan Kawasan Hutan untuk Kepentingan Pembangunan
                                       di Luar Kegiatan Kehutanan」（ID-H1723 序言给出全称）
```

`ID-H3190` 正文作「Badan hrsat Statistik」、`ID-H2541` 作「padaLembaga Administrasi Negara
metplti ieneiimaan」、`ID-H1725` 作「Lingkungk€ur Hidup」等 OCR 脏型，机构名以标题为准，不采脏字。

### 四、8 条跳译：标题与 `Pasal 1` 所述主体互斥

```text
ID-H3365  标题 Badan Riset dan Inovasi Nasional ｜ Pasal 1 与全文为国防部（医疗/水海洋学）
ID-H3051  标题 能源与矿产资源部 ｜ Pasal 1 为核能监督局
ID-H2041  标题 国务秘书部        ｜ Pasal 1 为国家核能局
ID-H2230  标题 国家图书馆        ｜ Pasal 1 为国防部水海洋学活动
ID-H1474  标题 法律与人权部      ｜ Pasal 1 为国家档案馆
ID-H1523  标题 通信与信息部      ｜ Pasal 1 为文化与旅游部
ID-H1313  标题 国家航空航天研究院 ｜ Pasal 1 为劳动与移民部
ID-H2616  标题 公共广播电视台    ｜ Pasal 1 为食品药品监督局
```

两类情形恰成对照，判断依据是「`Pasal 1` 里到底写了谁」：

- **不跳译**：`ID-H3122`（内政部）/`ID-H3278`（能源部）等条，
  正文**没有 `Pasal 1`**（OCR 自 `Pasal 2` 起），先前匹配到的机构名只是附录里的偶发同串，
  此时**标题是唯一权威**，按标题译。
- **跳译**：`Pasal 1` 在场且主语是另一个机构，属记录本身失配，实体不可确定，交人工。

### 五、质检：2 处告警均落在 `id` 原文层

```text
ID-H3278  pseudo:id   原文标题含「MINERAL」等拉丁串，属存量
ID-H3125  edgepunct:id 原文标题截断于「… KEBUDAYAAN,」尾逗号
```

`id` 层为原文照抄，改它等于改数据源，故保留。`chk-titles` 错误 0；「长度比异常」105 条
为本族固有形态（zh 机构名 17–25 字 vs en 整句 80–110 字符），与 b26 同型，不阻断。

### 六、覆盖变化

```text
ID     1,759 → 1,864 / 3,348（52.5% → 55.7%）
全库  24,544 → 24,649 / 42,121（58.3% → 58.5%）
```

### 七、剩余

ID 剩 **1,484 部**。下一目标：`PENGALIHAN BENTUK PERUSAHAAN …`（国企改制，23 标题）、
`PENETAPAN PERUSAHAAN JAWATAN …`（11）、`PEMINDAHAN IBU KOTA …`（14）、
`PENJUALAN SAHAM MILIK …`（14）等。

---

## 第十八批（id-p1-b28–b30）三族收官：「国企改制」「第二次修改」「基本养老金确定」 · 94 部

### 一、产出

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b28 | `PENGALIHAN BENTUK PERUSAHAAN …` | 23 | 23 | 0 |
| b29 | `PERUBAHAN KEDUA ATAS …` | 40 | 40 | 0 |
| b30 | `PENETAPAN PENSIUN POKOK …` | 31 | 31 | 0 |
| 合计 | | **94** | **94** | 0 |

三族均为纯槽位族，零跳译。

### 二、b28 国企改制：一档一句框

```text
PENGALIHAN BENTUK {PN|PERUM} {公司} MENJADI {PERUM|PERSERO}

zh  {名称}{改制为公营公司 | 改制为公营有限公司}
en  the Conversion of {…} into a Public Corporation / into a Limited Liability State Company
vi  Chuyển đổi {…} thành Công ty Công ích / thành Công ty Trách nhiệm Hữu hạn Nhà nước
th  การเปลี่ยนรูปแบบ{…} เป็นรัฐวิสาหกิจ / เป็นบริษัทจำกัดของรัฐ
ms  Pengalihan Bentuk {…} menjadi Perusahaan Umum / menjadi Perusahaan Perseroan
```

三档译名沿用既有译例（`ID-H3012`/`ID-H3162`/`ID-H3320`）：**PN→国家公司、PERUM→公营公司、
PERSERO→公营有限公司**；zh 给中文名，en/vi/th/ms 括注拉丁原名（`PERUM Garam`、`PN Blabak`），
`PENAS` 一条沿用 b26 既译「航空勘测公营公司（PENAS）」，不与同族其他条目分叉。

`chk-titles` 首轮 4 条 zh 报「拉丁字母占比过高（61–65%）」——因括注塞了长法定名
（`PERUM Asuransi Sosial Angkatan Bersenjata Republik Indonesia` 等）。
处理办法是**zh 只留中文名、把拉丁全称留给其他四语**，不靠删减语义：

```text
ID-H521  国家印刷公司（PN Percetakan Negara Republik Indonesia） → 印度尼西亚共和国国家印刷公司
ID-H522  武装部队社会保险公营公司（PERUM Asuransi Sosial ABRI）  → 武装部队社会保险公营公司
ID-H604  河湖与渡运公营公司（PERUM Angkutan Sungai, …）          → 河湖与渡运公营公司
ID-H841  图书出版印刷公营公司（PERUM Penerbitan …）              → 国家图书出版印刷公营公司
```

### 三、b29 第二次修改：与 b24–b26 同源，只多一层序数

`PERUBAHAN KEDUA ATAS` 与 `PERUBAHAN ATAS` 共用同一套四语句框，仅在助词位置加序数：

```text
zh  第二次修改…法          en  Law Amending for the Second Time …
vi  Luật Sửa đổi lần thứ hai…  th  พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สอง…
ms  Akta Meminda bagi Kali Kedua …
```

本族同时出现四种被修改法源：`PERATURAN PEMERINTAH`、`UNDANG-UNDANG`、
`PERATURAN MENTERI PERDAGANGAN`（有正式号年的）、以及 5 条 `M-DAG` / `M-DAGPER` 编码串
（`45M-DAG92009`、`08M-DAGPER42011`、`24M-DagPer62008`、`17M-DAGPER52009`、`127M-DAGPER122015`）。
编码串沿 b24 口径**只写主题、不写号年**。

主题译法优先**复用已入库的原条例译名**，避免同一条例在「原版」与「第二次修改版」里叫法不一：

```text
ID-H2586 → ID-H3094  最高法院下属法官的财务权利与便利（PP 94/2012）
ID-H1801 → ID-H3383  印度尼西亚群岛基线点地理坐标表（PP 38/2002）
ID-H2641 → ID-H2724  向公务员、国民军军人、警察…发放工资、养老金或第十三薪（PP 19/2016）
ID-H2282 → ID-H2817  债券利息所得税（PP 16/2009）
ID-H1284 → ID-H2290  财政部长作为…股东大会或股东之职权转移（PP 98/1999，本族扩写「向…部长移交」）
```

5 条 `PMC` 型（编码串）首版把主题写成「…进口的规定」，与句框 `on the … / về …` 撞车成
「on the Provisions on the Import of…」，二轮改为纯主题「资本货物进口」「使用海运与国家保险」
「香蕉与菠萝出口」。

### 四、b30 基本养老金：标题不写兵种，译名也不写

五种形态：

```text
A  PENSIUNAN PEGAWAI NEGERI SIPIL DAN JANDA/DUDANYA            11 条（标题完整）
B  MANTAN PEJABAT NEGARA DAN JANDA/DUDANYA                      1 条
C  PURNAWIRAWAN, WARAKAWURI/DUDA, TUNJANGAN ANAK YATIM PIATU…  16 条（标题截断于 110 字符）
D  PENSIUNAN HAKIM PERADILAN UMUM / TATA USAHA NEGARA / AGAMA   3 条
```

C 族有两条判据必须分清：

1. **标题里没有兵种，译名里就不许有兵种。** TNI / Polri 只出现在 `Pasal 1`，属正文信息；
   13 条标题（C1）只列「退伍军人、遗孀/鳏夫、孤儿/遗孤、父母补助」，译名即止于此，
   写进「国民军」或「国家警察」等于增译。
2. **标题截断在「ANGGOTA …」的（C2，5 条）才补兵种**，且逐条按 `Pasal 1` 定：

```text
ID-H1376 / ID-H1552 / ID-H1778 → Anggota Tentara Nasional Indonesia
ID-H1553                       → Anggota Kepolisian Negara Republik Indonesia
ID-H902（1997 年旧制）          → Anggota Angkatan Bersenjata Republik Indonesia
```

`ID-H2075` 正文残缺（`Pasal 1` 只剩「, ditetapkan」），按其标题形态（与 `ID-H1971` 同组）归 C1，
不必判断兵种 —— 这正是判据 1 的好处：兵种不进标题，残缺也不影响可译性。

### 五、覆盖变化

```text
ID     1,864 → 1,958 / 3,348（55.7% → 58.5%）
全库  24,649 → 24,743 / 42,121（58.5% → 58.7%）
```

### 六、剩余

ID 剩 **1,390 部**。下一目标：`PENYERTAAN MODAL NEGARA …`（27）、
`PERUBAHAN ATAS UNDANG-UNDANG …`（23）、`PENETAPAN HARGA PATOKAN …`（23）、
`PAJAK PENGHASILAN ATAS …`（22）、`PENETAPAN PERATURAN PEMERINTAH …`（20）等。

---

## 第十九批（id-p1-b31–b37）七族收官：国家资本参与 / 基准价格 / 修改法律 / 所得税 / 定 Perppu 为法律 / 第三次修改 / 撤销政府条例 · 149 部

### 一、产出

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b31 | `PENYERTAAN MODAL NEGARA …` 国家资本参与 | 27 | 27 | 0 |
| b32 | `PENETAPAN HARGA PATOKAN …` 基准价格的确定 | 23 | 23 | 0 |
| b33 | `PERUBAHAN ATAS UNDANG-UNDANG …` 修改某部法律 | 23 | 23 | 0 |
| b34 | `PAJAK PENGHASILAN ATAS …` 所得税 | 22 | 22 | 0 |
| b35 | `PENETAPAN PERPPU … MENJADI UNDANG-UNDANG` 将 Perppu 定为法律 | 20 | 20 | 0 |
| b36 | `PERUBAHAN KETIGA ATAS …` 第三次修改 | 17 | 17 | 0 |
| b37 | `PENCABUTAN PERATURAN PEMERINTAH …` 撤销政府条例 | 17 | 17 | 0 |
| 合计 | | **149** | **149** | 0 |

七族此前**全部五语全空**（不只是缺 vi/th/ms），本批首次成篇，故每批都是「zh/en 新写 + 三语新写」。

### 二、b31 国家资本参与：四类句框，zh 不与「公司」叠字

```text
named   UNTUK PENDIRIAN PERUSAHAAN PERSEROAN (PERSERO) {具名公司}
sector  UNTUK PENDIRIAN PERUSAHAAN PERSEROAN (PERSERO) {领域}
ltd     UNTUK PENDIRIAN PERSEROAN TERBATAS DALAM BIDANG {领域}   （PT，非 PERSERO）
into    KE DALAM MODAL / PADA {具名实体}
```

- `PERSERO` 与 `PERSEROAN TERBATAS` **必须在译名里分开**：前者「公营有限公司（PERSERO）」，
  后者「有限责任公司」。二者混译会把国企与普通 PT 混为一谈。
- 具名公司 zh 不再冠「公司」二字：`第三十二种植园` + 公营有限公司，否则成「…公司公营有限公司」。
- 银行名单 3 条按「具名首户 + 等 N 家」缩写，N 由 `Pasal 1` 点数得出：
  `ID-H1131` 8 家商业银行（Lippo/BII/Bali/Bukopin/Universal/Prima Express/Arta Media/Patriot）、
  `ID-H1130` 12 家（10 家地方建设银行 + Lippo + Sembada Artanugroho）、
  `ID-H1132` 10 家地方建设银行。**逐家转写会错**，宁可用计数。
- 两条 chk 返工：`ID-H849`（核能）/`ID-H984`（工业）用「经营…的公营有限公司」不成句，
  改「{领域}领域的公营有限公司」；`ID-H663` 补「茂物县」。

### 三、b32 基准价格：8 种形态、23 条同框

最省的一族——`PENETAPAN HARGA PATOKAN {X}` 只换定语，故「1 帧 × 8 槽」合成：

```text
zh  {对象}基准价格的确定      en  the Determination of {对象}
vi  Việc Xác định {对象}       th  การกำหนด{对象}      ms  Penetapan {对象}
```

两条判据：

1. **标题尾部 `_2` / `_3` 是入库去重后缀，不是法定标题**（`ID-H3024`、`ID-H3023`、`ID-H3022`），
   译名一律不带。这是本族唯一的「脏数据」，出现在原文层，不动数据源。
2. `HPE`（出口基准价格）/ `HPP`（农民基准价格）是**标题自带的缩称**，译名保留并在同句展开一次；
   `PENETAPAN HARGA PATOKAN EKSPOR` 与 `PENETAPAN HARGA PATOKAN`（鱼类、白糖）不是一回事，
   后者是国内基准价，不能译成「出口基准价格」。

### 四、b33 / b36 修改类：号年一律「解析 + 比对」，不手抄

`_gen_id_b33.js` 内置自校验：从 `title.orig` 正则取第一处
`UNDANG-UNDANG NOMOR (\d+) TAHUN (\d{4})`，与表内写死的号年比对，不一致即抛错。
23 条全部一次通过。b36 沿用同一思路对 `PERUBAHAN KETIGA` 加序数：

```text
zh  第{三}次修改{年}年第{号}号关于{主题}的{法律|政府条例|贸易部长条例}
en  Law Amending for the Third Time {instrument} No. {号} of {年} on {主题}
```

三条口径：

- **zh 不用「…{文书}法」收尾**。`ID-H2912` 首版作「第三次修改2003年第24号宪法法院法律法」——
  主题已含「法」字时叠字。改为 `关于{主题}的{文书}`，与 b33 同构。
- 被修改文书三类分取：`UNDANG-UNDANG`→法律、`PERATURAN PEMERINTAH`→政府条例、
  `PERATURAN MENTERI PERDAGANGAN`→贸易部长条例。**旧条目把后者译作「商务部…条例」**
  （`ID-H1916`/`ID-H2014`/`ID-H2120`），商务部是中国机构名，印尼应为贸易部；
  本批统一用「贸易部长条例」，旧条目属存量不一致，未擅改。
- 5 条 Permendag 刊号是 `M-DAGPER` 编码串（`30M-DAGPER52017` 等），不可拆年/号，只写主题。

### 五、b35 定 Perppu 为法律：20 条标题 15 条被截断，全靠 `Pasal 1` 还原

标题在 110 字符处被 OCR 切断，`… TENTANG {主题} MENJADI UNDANG-UNDANG` 的尾巴整段丢失。
还原一律取 `Pasal 1` 的 `Peraturan Pemerintah Pengganti Undang-Undang Nomor … tentang …
(Lembaran Negara …)` 法定全称。四条正文残缺，各自另找依据：

```text
ID-H2635  Pasal 1 只剩「Cukup jelas」→ 取附录页眉：PERPPU 2/2017 修改 UU 17/2013 社会组织法
ID-H2474  Pasal 1 完整：PERPPU 1/2015 修改 UU 30/2002 腐败犯罪根除委员会法
ID-H2893  序言引称：PERPPU 2/2020 第三次修改 UU 1/2015（省长县长市长选举）
ID-H1454  标题仅 62 字符（「…NOMOR 1」即断）→ Pasal 1：PERPPU 1/2004 修改 UU 41/1999 林业法
```

两条 ms 超 300 字符上限（`ID-H2892` 311、`ID-H1662` 317），按「外层句框已含『定为法律』」收紧：
前者删 `dalam Rangka`，后者删内层重复的 `menjadi Undang-Undang`，语义不损。

**`ID-H1254` 是陷阱**：正文 `Pasal 1` 引的是 Perppu 2/2000（Sabang），而本条标题写的是
Perppu **1/2000**（自由贸易区与自由港）。此时标题为准，不采正文偶发引称——与 b27 的
「`Pasal 1` 缺失时标题是唯一权威」同一条理，只是方向相反：**引称 ≠ 本条标的**。

### 六、b37 撤销：三条多文书，一条都不能少

```text
ID-H1101  撤销 3 份：70/1992 商业银行（经 73/1998 最近修改）、71/1992 乡村信贷银行、
                     72/1992 利润分享原则银行 —— 第三份标题已截断，只见于 Pasal 1 第 c 项
ID-H2890  撤销 2 份：34/1991 专利申请程序、11/1993 专利证书形式与内容
ID-H1227  1 份 + 「最近经 PP 48/2000 修改」从句，作括注保留
```

多文书用 `、…及…`（zh）/ `, … and …` 连接，**不合并成「等 3 份」**——撤销类必须逐份列明，
否则读者无法判断哪几份失效。这与 b31 的银行名单相反：那里是出资对象，计数即可；这里是法律效力，须穷举。

### 七、质检

| 批次 | chk 错误 | 三项质检 | 说明 |
| --- | --- | --- | --- |
| b31 | 0 | 2 处 | `pseudo:id`（`ID-H2084`/`ID-H2577` 原文层含 CREDIT/INVESTMENT），存量 |
| b32 | 0 | 0 | — |
| b33 | 0 | 0 | — |
| b34 | 0 | 0 | — |
| b35 | 0 | 1 处 | `edgepunct:id`（`ID-H2473` 原文标题截断于尾逗号），存量 |
| b36 | 0 | 0 | — |
| b37 | 0 | 0 | — |

b31 的 3 处 ms `residue` 经核为**词表未覆盖的马来语固有词**（`pemeriksaan`、`rawatan sisa`、
`sahamnya kemudiannya`），不是英文残留，已登记进 `_ph_qallow.json` 的 ms 允许词（10 个）。

### 八、覆盖变化

```text
ID     1,958 → 2,107 / 3,348（58.5% → 62.9%）
全库  24,743 → 24,892 / 42,121（58.7% → 59.1%）
```

### 九、剩余

ID 剩 **1,241 部**。下一目标：`PEMBERIAN TUNJANGAN HARI …`（15）、`PEMINDAHAN IBU KOTA …`（14）、
`PENJUALAN SAHAM MILIK …`（14）、`PENDIRIAN PERUSAHAAN JAWATAN …`（11）、
`PENGESAHAN PERSETUJUAN ANTARA …`（11）、`PELEBURAN PERUSAHAAN PERSEROAN …`（10）、
`PERUBAHAN NAMA KABUPATEN …`（10），以及 5 组 `PERATURAN PERUNDANG-UNDANGAN …`（共 50）。

---

## 第二十批（id-p1-b38–b39）两族收官：节日津贴发放 / 批准双边协定 · 26 部

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b38 | `PEMBERIAN TUNJANGAN HARI RAYA …` 节日津贴发放 | 15 | 15 | 0 |
| b39 | `PENGESAHAN PERSETUJUAN ANTARA …` 批准双边协定 | 11 | 11 | 0 |

### 一、b38 节日津贴：三处变量（发什么 / 给谁 / 哪一年）

```text
A  PEMBERIAN TUNJANGAN HARI RAYA TAHUN {年}                                   2020
B  … DAN GAJI KETIGA BELAS KEPADA APARATUR NEGARA, PENSIUNAN, PENERIMA
   PENSIUN, DAN PENERIMA TUNJANGAN TAHUN {年}                              2021–2026
C  … [DALAM TAHUN ANGGARAN {年}] KEPADA PNS, PRAJURIT TNI, ANGGOTA POLRI,
   PEJABAT NEGARA, PENERIMA PENSIUN, DAN PENERIMA TUNJANGAN                 2016/2017/2018/2019
D  同上，对象为 PIMPINAN DAN PEGAWAI NONPEGAWAI NEGERI SIPIL PADA LEMBAGA NONSTRUKTURAL
```

两条判据：

1. **`TAHUN {年}` 与 `DALAM TAHUN ANGGARAN {年}` 必须分开译**：前者公历年（in 2021），
   后者财政年度（for the 2021 Fiscal Year）。五语都保留这一区分——若都写「年」，
   预算口径的年与非预算口径的年就混了。
2. 8 条标题在 110 字符处截断，C/D 两型的受领人名单后半段丢失；补齐依据是同型的完整标题
   （`ID-H2788` 无年度版 C 型、`ID-H2789` 无年度版 D 型）与 `Pasal 1` 定义条，
   **不自行增删受领人类别**——津贴类法条的受领人即权利主体，多写少写都是实体错误。

### 二、b39 批准协定：主体与文书性质两处易错

`PENGESAHAN PERSETUJUAN ANTARA …` 11 条（10 个唯一标题，`ID-H1670`/`ID-H1672` 同为 2003 年印尼—越南大陆架协定）。

```text
协定（政府间）：批准印度尼西亚共和国政府与{对方}政府关于{主题}的协定
条约（国家间）：批准印度尼西亚共和国与{对方}关于{主题}的条约   ← 仅 ID-H2639
```

三条口径：

- **`ID-H1386` 原文作「PEMERINTAH REPUBLIK HONGKONG」/「GOVERNMENT OF HONGKONG」**。香港不是共和国，
  译名一律作「中国香港特别行政区政府 / the Hong Kong Special Administrative Region of the People's
  Republic of China」，不照搬原文错误称谓；同条英文原件名「SERRENDER」为原件拼写错误，不据以改名。
- `ID-H2639` 原文用 `TREATY` 且主体是国家（REPUBLIK INDONESIA DAN REPUBLIK RAKYAT CHINA），
  故译「条约」而非「协定」，双方也不加「政府」。
- 8 条标题被截断，协定全称一律取正文首段括注的英文原名回核（大陆架 2003、EEZ 2014、
  引渡、移交逃犯、防务/防务与安全合作活动），不按国名猜主题。

### 三、质检与覆盖

两批 `chk-titles` 错误 0；三项质检仅 b39 有 2 处 `pseudo:id`（`ID-H1386`/`ID-H2639` 原文层夹英文原件名），
`ID-H1670`/`ID-H1672` 属同题重复入库，各自成条，不合并。

```text
ID     2,107 → 2,133 / 3,348（62.9% → 63.7%）
全库  24,892 → 24,918 / 42,121（59.1% → 59.2%）
```

### 四、剩余

ID 剩 **1,215 部**。下一目标按「结构规整度」排序：
`PENJUALAN SAHAM MILIK …`（14）、`PENDIRIAN PERUSAHAAN JAWATAN …`（11）、
`PELEBURAN PERUSAHAAN PERSEROAN …`（10）、`PERUBAHAN NAMA KABUPATEN …`（10）、
`PEMINDAHAN IBU KOTA KABUPATEN …`（14，需先建地名译名表：Tual/Kotamobagu/Langsa/Malang 等），
以及 5 组 `PERATURAN PERUNDANG-UNDANGAN …`（共 50）。

---

## 第二十一批（id-p1-b40–b46）七族收官：国有股份出售 / 局营医院 / 种植园合并 / 吸收合并与解散 / 股权结构变更 / 县名变更 / 预算与十三个月工资 · 93 部

### 一、产出

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b40 | `PENJUALAN SAHAM MILIK NEGARA …` 国有股份出售 | 14 | 14 | 0 |
| b41 | `PENDIRIAN PERUSAHAAN JAWATAN RUMAH SAKIT …` 设立局营医院 | 11 | 11 | 0 |
| b42 | `PELEBURAN … PT PERKEBUNAN …` 种植园公司合并 | 10 | 10 | 0 |
| b43 | `PENGGABUNGAN …` 吸收合并 8 + `PEMBUBARAN …` 解散 8 | 16 | 16 | 0 |
| b44 | `PERUBAHAN STRUKTUR KEPEMILIKAN SAHAM NEGARA …` 国家股权结构变更 | 14 | 14 | 0 |
| b45 | `PERUBAHAN NAMA KABUPATEN …` 县名变更 | 10 | 10 | 0 |
| b46 | `ANGGARAN PENDAPATAN DAN BELANJA NEGARA …` 9 + `… BULAN KETIGA BELAS` 9 | 18 | 18 | 0 |
| 合计 | | **93** | **93** | 0 |

七族此前五语全空，零跳译。

### 二、b42 / b43 三种公司重组必须分开译

印尼国企重组有三个不同词，法律后果各异，本批一次收齐，口径就此固定：

```text
PELEBURAN    合并进**新设**公司（原公司全部消灭、另立新主体）
             zh 将A、B合并为C法        en the Merger of A and B into C
PENGGABUNGAN 并入**既有**公司（被并方消灭、接收方存续）
             zh 将A并入B法             en the Consolidation of A into B
PEMBUBARAN   解散（可能附「清算所得追加为某公司国家资本」）
             zh 解散A法 / 解散A并将…追加至B法
```

若把 PELEBURAN 与 PENGGABUNGAN 都写成「合并」，读者无法判断目标公司是新设还是存续，而这正是
判断债权债务承继关系的前提。b42 的 zh 用「合并为」、b43 用「并入」，en 用 `Merger into` /
`Consolidation into`，ms 用 `menjadi` / `ke dalam`，四层都留了痕。

### 三、b43 解散族的三式：清算所得「部分」与「全部」不可混

`PEMBUBARAN X DAN PENAMBAHAN PENYERTAAN MODAL NEGARA …` 有三种标题写法，脚本按标题实写判式：

```text
part  DARI SEBAGIAN KEKAYAAN NEGARA HASIL LIKUIDASI   → 部分清算所得（ID-H501 / ID-H653）
full  DARI KEKAYAAN NEGARA HASIL LIKUIDASI（无 SEBAGIAN）→ **全部**清算所得（ID-H500）
short 无清算来源从句                                  → 只写追加（ID-H1363 / H835 / H951）
```

`ID-H500` 首版按 `part` 套，被自校验拦下——它比同类少一个 `SEBAGIAN`，注入的是全部而非部分。
这类差一个词的形态**必须逐条读标题实文**，不能按族内多数形态套模板。

同条还有第二个坑：注入对象是 `PERUM Percetakan Negara` **与** `PT Pradnya Paramita` 两个，
形态一为公营公司、一为公营有限公司，译名分别标明，未并作「等」。

### 四、b41 设立局营医院：PERJAN 按台账口径作「局营」

```text
Perjan（PERUSAHAAN JAWATAN）→ 局营公司     en Departmental Undertaking
Perum（PERUSAHAAN UMUM）    → 公营公司     en Public Corporation
Persero                      → 公营有限公司 en Limited Liability State Company
```

11 条医院全部按此译。**同族 `ID-H1231`（广播电台）早前作「公营公司」，属存量不一致，
按既定口径应回填「局营」，仍待用户裁定，本批未擅改。**

zh 层不写 `dr.` 敬称（「…医生医院」不成词），敬称留给 en/vi/th/ms（沿 b28 口径：zh 只留中文名）。

### 五、b44 股权结构变更：A / B / C 三式差在「出售」二字

```text
A  MELALUI PENERBITAN DAN PENJUALAN SAHAM BARU  发行**并出售**新股份（5 条）
B  MELALUI PENERBITAN SAHAM BARU                仅**发行**新股份（5 条）
C  无方式从句（2 条）
```

A 与 B 是两种不同的股本操作，译名分别作「发行并出售」／「发行」。C 式**不补写方式**：
`ID-H3165`（BRI）正文含首发与后续处置，方式非单一，原文既未限定，译名也不加「通过…」。

形态判定另有坑：14 条标题全部截断在 `PADA PERUSAHAAN PERSER…`，PERSERO 标记根本没露出来。
判法是三条：标题明写 `PADA PT` → 非 PERSERO（`ID-H1812`/`ID-H2296`）；标题已露 `PERSERO)` → 是；
其余截断型由正文首句的 `Perusahaan Perseroan (Persero) PT …` 定。

### 六、b45 县名变更：KABUPATEN ≈ 县，旧名新名都要写全

`KEPULAUAN SANGIHE DAN TALAUD → KEPULAUAN SANGIHE` 这类「拆分后保留其一」的，若只写新名
就丢掉了「原县含塔劳群岛」这一事实，故旧名一律照录全称。

行政层级四语对应：`KABUPATEN` 县 / Regency / Huyện / อำเภอ / Daerah；`KOTA` 市；`KECAMATAN` 乡。
`ID-H1516`（Polewali Mamasa → Polewali Mandar）标题无 `PROVINSI`，译名也不加省名。

### 七、b46 预算与十三个月工资：年份与文书性质两处

```text
APBN  TAHUN ANGGARAN 19941995 → 1994/1995 财政年度   （OCR 吃掉了斜杠）
```

拆法写进脚本自校验：前四位 + 1 必须等于后四位，不等即抛错。9 条全部一次通过。

`BULAN KETIGA BELAS`（第十三个月工资）**不是** b38 的 `TUNJANGAN HARI RAYA`（节日津贴）：
前者是当年第 13 个月工资（含养老金、津贴），后者是开斋节一次性津贴，法律依据与计算基数都不同。
`GAJIPENSIUNTUNJANGAN` 是 OCR 吃掉 `GAJI/PENSIUN/TUNJANGAN` 斜杠后的连写，还原为三项。

受领人分两式：8 条作 `PEGAWAI NEGERI, PEJABAT NEGARA, …`（公务员含军警）；2015 年那条作
`PEGAWAI NEGERI SIPIL, ANGGOTA TNI, ANGOLTA POLRI, …`（三类分列）。标题既然分列，译名也分列——
2015 年后 PNS 与军警薪酬已分开立法。

### 八、质检

| 批次 | chk 错误 | 三项质检 |
| --- | --- | --- |
| b40 | 0 | 0 |
| b41 | 0 | 0 |
| b42 | 0 | 0 |
| b43 | 0 | 0 |
| b44 | 0 | 0 |
| b45 | 0 | 0 |
| b46 | 0 | 0 |

七批全绿，本轮无 `pseudo`/`edgepunct` 告警。长度比告警（0.12–0.40）为本族固有形态：
zh 用中文公司名（「布拉巴克造纸公司」），en/vi/th/ms 保留 `Perusahaan Perseroan (PERSERO) PT …`
法定全称，比值必然偏低，不阻断。

### 九、过程中修正

1. b40 的 `ID-H1567` 标题 OCR 作 `PT BANK LTPPO TBK`，正文 `Pasal 1` 明确为 `PT Bank Lippo Tbk`，
   译名按正文定（力宝银行），标题脏字不采——**标题与正文冲突时，公司名以正文为准**
   （与 b27「实体冲突即跳译」不同：此处是同一实体的拼写错误，不是两个实体）。
2. b40 首版 vi/th/ms 用了英文 `and` 连接两家银行，改为逐语连接词（`và` / `และ` / `dan`）。
3. b42 首版 zh 用「第二、第九」以外还混用「与」，统一为顿号；复合编号（`XXI-XXII`）单列，
   不写成「第二十一、第二十二」——原文是一个公司不是两个。
4. b43 首版 zh 只写「XX公司」，丢了 PERSERO 形态；改为「公营有限公司」统摄来源列表。
5. b44 首版按标题判 PERSERO 被自校验拦下（标题截断在 `PERSER…`），改按正文定。

### 十、覆盖变化

```text
ID     2,133 → 2,226 / 3,348（63.7% → 66.5%）
全库  24,918 → 25,011 / 42,121（59.2% → 59.4%）
```

### 十一、剩余

ID 剩 **1,122 部**。下一目标：`PEMINDAHAN IBU KOTA KABUPATEN …`（14，需先建乡镇地名五语表：
Tual/Kei Kecil/Mbay/Aesesa/Bajawa/Kepanjen/Parit Malintang/Kumurkek 等）、
`PELAKSANAAN UNDANG-UNDANG NOMOR …`（12）、`TATA CARA PELAKSANAAN …`（8）、
`PEMINDAHAN SISA KREDIT …`（8）、`ORGANISASI DAN TATA KERJA …`（7）。
`PERATURAN PERUNDANG-UNDANGAN N …` 五组（共 50）是投资类杂题、逐条截断，
不宜整族套模板，留作单独一轮逐条核。

---

## 第二十二批（id-p1-b47）两族收官：某法的实施条例 / 发展预算信贷结余结转 · 20 部

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b47 | `PELAKSANAAN UNDANG-UNDANG NOMOR …` 实施条例 + `PEMINDAHAN SISA KREDIT …` 信贷结余结转 | 20 | 20 | 0 |

### 一、这 12 条的标题是**残缺的**，补的是文书类型而非新信息

原件标题是「PERATURAN PEMERINTAH … TENTANG **PELAKSANAAN UNDANG-UNDANG NOMOR 23 TAHUN 2006**
TENTANG ADMINISTRASI KEPENDUDUKAN」，抓取时把「PERATURAN PEMERINTAH … TENTANG」整段丢了，
只剩从句。12 条正文首句一律作「Dalam Peraturan Pemerintah ini …」，可确证其性质为**政府条例**。

故译名补回「政府条例 / Government Regulation / Quy định của Chính phủ / กฎระเบียบรัฐบาล /
Peraturan Pemerintah」，属补全而非增译。若按字面只译「实施…法」，会把政府条例误标成法律，
层级直接错一档。

`ID-H2707`（礼宾）与 `ID-H491`（印刷作品交存）正文同时出现「Undang-Undang ini」——
那是条例**引述**被实施的法，不改变本条例自身性质，不据此改判。

另注意：这 12 条的 `docNumber` 填的是**被实施法**的号年（如 `UU23-2006`），不是条例自己的号年，
属存量数据问题，未擅改；译名随标题实文，不随 `docNumber`。

### 二、修改沿革只写号年，不重述所引法律全称

5 条 PPN 条目尾部带 `SEBAGAIMANA TELAH [BEBERAPA KALI] DIUBAH [TERAKHIR] DENGAN
UNDANG-UNDANG NOMOR …`：

```text
ID-H687   经 1994 年第 11 号法律修改
ID-H1201  经 2000 年第 18 号法律最后修改
ID-H2149  经 2009 年第 42 号法律最后修改
```

`ID-H2149` 引的那部 42/2009 法，标题本身又完整复述了 8/1983 PPN 法的全称。若照录，
会形成「实施…法（经…关于修改…法…的法修改）」三层嵌套，信息量为零。故沿革统一作括注、
只写号年。zh 括注、en `, as last amended by …`、ms `, sebagaimana telah diubah terakhir dengan …`。

`ID-H1201` 标题 OCR 作「**AJAK** PERTAMBAHAN NILAI」（掉首字母 P）、`ID-H687` 作
「PAJAK PERTAMBAHAN**NILAI**」（掉空格），均按同一主题处理，脏字不采。

### 三、信贷结余结转：年份串有三种长度，靠「后一位 +1」校验

```text
19901991 → 1990/1991      199495 → 1994/1995      199293 → 1992/1993
```

8 位是「四位 + 四位」，6 位是「四位 + 次年末两位」的缩写。解析规则写进脚本：
取前四位 y1，令 y2 = y1+1，尾串必须等于 y2 或 y2 的后两位，否则抛错。
另有承接关系校验：第二段的 y1 必须等于第一段的 y2（结转只能往下一个年度）。

### 四、质检与覆盖

`chk-titles` 错误 0；三项质检 0 条 0 处。

```text
ID     2,226 → 2,246 / 3,348（66.5% → 67.1%）
全库  25,011 → 25,031 / 42,121（59.4%）
```

### 五、剩余

ID 剩 **1,102 部**。下一目标（已侦察、按难度排序）：
`PEMINDAHAN IBU KOTA KABUPATEN …`（14，需乡镇地名五语表）、
`TATA CARA PELAKSANAAN …` + `ORGANISASI DAN TATA …`（15，**文书类型混杂**：4 条部长条例、
7 条政府条例、5 条正文无法判定，须逐条定类型再译）、
`PERATURAN PERUNDANG-UNDANGAN N …` 五组（共 50，投资类杂题、逐条截断）。

## 第二十三批（id-p1-b48–b50）三族收官：县首府迁移（新拼法/旧拼法）/「实施程序」政府条例 · 33 部

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b48 | `PEMINDAHAN IBU KOTA KABUPATEN … DARI … KE …`（新拼法，含起讫地） | 14 | 14 | 0 |
| b49 | `TATA CARA PELAKSANAAN …` + `ORGANISASI DAN TATA KELOLA …`（政府条例） | 10 | 10 | 0 |
| b50 | `PEMINDAHAN IBUKOTA (DAERAH) KABUPATEN …`（旧拼法，含 `DAERAH TINGKAT II`） | 9 | 9 | 0 |

### 一、迁移族：起讫地是标题实有信息，不能删

库里同族旧条目 `ID-H1209`（西龙目县首府迁移法）、`ID-H955`（勿加泗二级行政区县首府迁移法）
只译到县名，是因为**其标题本身止于「KABUPATEN X」**（原件即如此，不是删节）；
`ID-H2813` 标题尾部被 OCR 截断在「DARI WILA」，其译名亦止于县名。
本批 33 部的标题带完整 `DARI … KE …`，故起讫地一律译出，不作删减：

```text
ID-H1955  马迪恩县首府由马迪恩市迁至东爪哇省马迪恩县美雅延镇法
ID-H1772  巴东帕里亚曼县首府由帕里亚曼市迁至西苏门答腊省巴东帕里亚曼县埃南林孔镇帕里特马林唐村法
ID-H2790  马伊布拉特县首府由阿亚马鲁区迁至西巴布亚省马伊布拉特县艾法特区库穆尔凯克法
```

中文按「省→县→镇→村」由大到小，其余四语按「地名→镇→县→省」由小到大。

### 二、起讫方向有交叉印证：1998 年去、2006 年回

`ID-H956`（1998，UU65-1998，旧拼法）作「巴贾瓦 → 姆巴伊」，`ID-H1540`（2006，UU35-2006，新拼法）
作「姆巴伊 → 巴贾瓦」。二者方向相反但**首尾相接**：1998 年那部的终点正是 2006 年那部的起点。
这条承接关系反过来证明两条的 `DARI`/`KE` 没有被译反——单看一条无法自证，成对看即可。

### 三、旧行政区划照旧译，不折算成现行区划

`DAERAH TINGKAT II` 是 1999 年地方自治改革前的二级行政区，与今天的 `KABUPATEN` 不是同一名号。
沿用库内 `ID-H955`/`ID-H1074` 的译法，逐语一一对应，不合并：

| 印尼旧称 | zh | en | vi | th | ms |
| --- | --- | --- | --- | --- | --- |
| KABUPATEN DAERAH TINGKAT II | 二级行政区县 | Second-Level Regency | Huyện Cấp hai | อำเภอระดับสอง | Kabupaten Daerah Tingkat II |
| KOTAMADYA DAERAH TINGKAT II | 二级行政区市 | Second-Level Municipality | Thành phố Cấp hai | นครระดับสอง | Kotamadya Daerah Tingkat II |

英语通名一律后置（`Palu City` / `Agam Second-Level Regency`），与库内 `Bekasi Second-Level Regency` 一致；
泰语、马来语通名前置（`นครปาลู` / `Bandar Palu`），各自依本族语序。

### 四、「实施程序」十条：补文书类型，两条互证

这批标题全部丢了「PERATURAN PEMERINTAH NOMOR … TAHUN … TENTANG」前缀，只剩 `TATA CARA PELAKSANAAN …`。
性质用两条路径互证，任一成立即可判为**政府条例**：

1. 正文自称「Dalam Per(aturan) Pemerintah ini」——OCR 常拼成 `Perahrran`，判定按词形放宽到 `Per…`；
2. 文末附「**PENJELASAN ATAS PERATURAN PEMERINTAH** REPUBLIK INDONESIA NOMOR … TAHUN … TENTANG …」。

`ID-H1711` 缺 `Pasal 1` 定义条，只能走第 2 条。该说明件同时复述了本标题全文
（「… TENTANG TATA CARA PELAKSANAAN HAK DAN KEWAJIBAN PERPAJAKAN BERDASARKAN UNDANG-UNDANG
NOMOR 6 TAHUN 198…」），可**反证标题未残**；并给出该条例为 **2007 年**（Lembaran Negara 2007 No. 169），
但号数被 OCR 吞掉（原文作「NOMOR TAHUN 2OO7」），故不补号。

同批 `docNumber` 一律填的是**被实施的母法**号年（`ID-H1711` = `UU6-1983`、`ID-H3295` = `UU19-2003` 即国企法），
不是条例自身号年——与 b47 同一存量问题，未擅改，译名随标题实文。

术语沿用库内既有译法：`Ketentuan Umum dan Tata Cara Perpajakan` → 《税收一般规定与程序法》（`ID-H070`）；
`Penghargaan` → 奖励；`Kepolisian Khusus` → 特别警察；`Penyidik Pegawai Negeri Sipil` → 公务员调查员；
`Pengamanan Swakarsa` → 自助安保。`ID-H3295` 的 `Daya Anagata Nusantara` 音译「达雅阿纳加塔努山塔拉」，
不采媒体简称「达南塔拉」。

### 五、OCR 连写与错字（不改原文字段，只用于结构自校验）

```text
ID-H958  … KOTA SIBOLGAKE KOTA PANDAN …   KE 粘到前词尾
ID-H958  … KABUPATEN DARAH TINGKAT II …   DARAH ← DAERAH
ID-H1090 … DAERAH KEBUPATEN SIMALUNGUN …  KEBUPATEN ← KABUPATEN
ID-H1090 … KE KECAMATAN RAYA DI WILAYAH … 终点只给到镇，未给镇名
```

### 六、质检与覆盖

`chk-titles` 错误 0；三项质检 0 条 0 处。告警全部是「中文/英文长度比 0.16–0.32」——
中文为「县名 + 起讫地 + 法」的紧凑句式，英文须把起讫地逐层展开，属预期差异。

```text
ID     2,246 → 2,279 / 3,348（67.1% → 68.1%）
全库  25,031 → 25,064 / 42,121（59.4% → 59.5%）
```

### 七、剩余

ID 剩 **1,069 部**。下一目标：`PENGESAHAN UNITED NATIONS …`（6）+ `PENGESAHAN PERJANJIAN ANTARA …`（6）
批准类，公约/协定有官方五语名称，可整族推进；`KETENTUAN ASAL BARANG`（7）、
`PENGURANGAN PENYERTAAN MODAL`（7）、`PENCABUTAN PERATURAN MENTERI`（7）次之。

## 第二十四批（id-p1-b51）批准公约族：五键从零补齐 · 15 部

| 批次 | 族 | 族内条目 | 写出 | 跳译 |
| --- | --- | --- | --- | --- |
| b51 | `PENGESAHAN {公约英文全称} ({印尼文对照})` 多边公约/协定批准法 | 15 | 15 | 0 |

### 一、这批的 `zh`/`en` 原本是空的，要补五个键

标题只有 `id` 一栏（印尼文），结构是「PENGESAHAN + 英文全称 +（印尼文对照）」。
故本轮写 zh/en/vi/th/ms 五键，`id`/`orig` 一字未动。

句式沿用库内两个先例：`ID-H1455`「批准《京都议定书》法」、`ID-H1114`
「批准国际劳工组织第138号最低就业年龄公约法」。多边公约用书名号，ILO 公约按
「批准国际劳工组织第{号}号{主题}公约法」——与 `ID-H1114` 同式，不混用。

```text
zh  批准《消除一切形式种族歧视国际公约》法
en  Law on the Ratification of the International Convention on the Elimination of All Forms of Racial Discrimination, 1965
vi  Luật về Việc Phê chuẩn Công ước Quốc tế về Xóa bỏ mọi Hình thức Phân biệt Chủng tộc, 1965
th  พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาระหว่างประเทศว่าด้วยการขจัดการเลือกปฏิบัติทางเชื้อชาติในทุกรูปแบบ ค.ศ. 1965
ms  Akta tentang Pengesahan Konvensyen Internasional tentang Penghapusan Segala Bentuk Diskriminasi Ras 1965
```

### 二、ms 不能照抄印尼文对照名，要改成马来语词形

初稿把括号内的印尼文官方名直接当 ms，被质检 ② 项按「伪译」拦下（虽然它拦的是 `id` 层，
但同一段文字如果原样进 ms，就是拿印尼语充当马来语）。已统一改写为马来语词形：

```text
Konvensi → Konvensyen          Perserikatan Bangsa-Bangsa → Pertubuhan Bangsa-Bangsa Bersatu
Narkotika → Narkotik           Psikotropika → Psikotropik
Keanekaragaman Hayati → Kepelbagaian Biologi    Korupsi → Rasuah
Organisasi Perdagangan Dunia → Pertubuhan Perdagangan Dunia
Perdagangan Internasional → Perdagangan Antarabangsa
Konvensi Kerangka Kerja → Konvensyen Rangka Kerja   Pestisida → Pestisid
Diskriminasi Rasial → Diskriminasi Ras
```

### 三、质检 ② 项对 `id` 层的告警是**误报**，已按词登记

这 15 部的 `id` 标题本身就是**英印双语**（印尼公报的原写法），因此 `id` 层必然出现
EMPLOYMENT / CHILD / AGAINST / FRAMEWORK / ESTABLISHING 等英文词。`id` 是原文层，
不得为过检而删改。已把这些词登记进 `_ph_qallow.json` 的 `id` 白名单，
并在批次注释里写明理由，避免以后被当成真漏译返工。

### 四、原题英文有拼写错误，译名按正确词义

```text
ID-H1118  ABALITION   ← ABOLITION
ID-H1563  CORUPTION   ← CORRUPTION
ID-H1119  OCUPATION   ← OCCUPATION
ID-H1116  GAVERNMENT  ← GOVERNMENT（本批未收，留待下批）
```

### 五、质检与覆盖

`chk-titles` 错误 0；三项质检 0 条 0 处。告警仍是「中文/英文长度比 0.16–0.27」——
公约中文名短、英文全称长，属预期。

```text
ID     2,279 → 2,294 / 3,348（68.1% → 68.5%）
全库  25,064 → 25,079 / 42,121（59.5%）
```

### 六、剩余

ID 剩 **1,054 部**。批准族还剩约 45 部（多为**双边**协定：印尼—澳大利亚、印尼—韩国、
印尼—越南、印尼—新加坡等，须逐条核对方国名与协定主题），以及 8 部标题只剩
「PENGESAHAN」一词的**残题**（`ID-H132`/`ID-H1565`/`ID-H1566`/`ID-H223`/`ID-H709`/`ID-H1557` 等），
须回原页补全标题后才能译，暂列人工。

## 第二十五批（id-p1-ppa–ppg）提速改造：通用引擎 + 主题表 · 191 部

### 一、先诊断「为什么慢」，不是翻译量的问题

用户指出进度慢。查完存量后确认瓶颈不在译，而在三处：

1. **剩余 1,054 部的 `zh` 与 `en` 全部为空**（统计口径：`zh`/`en` 齐全 0 部，皆无 1,054 部）。
   前 2,294 部有英文可作中介，只需补三语；这 1,054 部是**纯印尼文五键从零建**，
   每条都要印尼文直接产出五个语种。
2. **`docNumber` 不可用**：925 部一律标 `UU`，连「进口规定」「评比指南」都是 `UU`，
   是存量误标。不能靠它判文书类型。
3. **156 部标题是元数据拼接后 110 字符硬截断**（形如 `Peraturan Perundang-undangan 46 Perubahan Atas …`），
   主题本身不完整，无法凭标题判定。

原流程「一族一批、每批十条、每族现写一个生成器」，把成本放大了 100 倍：
1,054 部按此要走七十多批，每批七道命令。

### 二、改成两件工具 + 一张表

**`_id_type.js`（文书类型自动判定）**
按「文首自称 > 文末 PENJELASAN > 正文 `Dalam … ini`」三级判据扫描正文，输出类型与证据片段。
关键修正：兜底规则原先写作 `/Dalam Peraturan (Menteri|Pemerintah|…) /`（空格结尾），
把「sebagaimana diatur dalam Peraturan Pemerintah Nomor 12 Tahun 1998」这类**引述他条**
误判为本条性质，`PP` 一度虚高到 455 部。改为必须带 `ini`，并对命中处前后 300 字符做
`sebagaimana diatur`/`diubah dengan` 邻域排除后，`PP` 落到 412 部。
全量结果：判出 **715/1,054（68%）**，余 339 部判不出，留人工。

**`_id_render.js`（通用句框渲染器）**
输入一张主题表（只写主题五语），按文书类型拼出五键。此后不再为每族写生成器——
省掉的正是过去最耗时的部分。

**主题表 `_t_pp_a.js` … `_t_pp_g.js`**：七组，191 部。

### 三、句框必须与存量对齐，不能「更地道」

初稿把 PP 的越南语写成 `Nghị định Chính phủ về`、泰语写成 `พระราชกฤษฎีกาว่าด้วย`——
这在越南/泰国法系里更地道，但与库内既有 2,294 部不一致。查 `ID-H1711`/`ID-H735` 后改为：

| 类型 | zh | en | vi | th | ms |
| --- | --- | --- | --- | --- | --- |
| UU | 关于…的法 | Law on … | Luật về … | พระราชบัญญัติว่าด้วย… | Akta tentang … |
| PP | 关于…的政府条例 | Government Regulation on … | Quy định của Chính phủ về … | กฎระเบียบรัฐบาลว่าด้วย… | Peraturan Pemerintah tentang … |

**泰语是连写语言**，句框与主题之间不加空格；`vi`/`en`/`ms` 加空格。
`zh` 一律不带文号（ID 既定口径），文号只进另外四语。

### 四、批次内的三处修正

```text
th  「พระราชกฤษฎีกา ว่าด้วย วิธีการ…」空格断词     → 句框去掉 prep，直接黏主题
vi  H1507「thâu tóm」（收购）被判 residue          → 改「mua lại」，同义且不撞词表
th  H2579 混入印尼语「เกณฑ์ tertentu」             → 改「เกณฑ์บางประการ」
th  H1590 混入英文占位「แบบผังวงจรIntegrated」      → 改「แบบผังวงจรของวงจรรวม」
```

### 五、白名单新增（均为原文/专名，非遗漏翻译）

```text
id : mineral, batubara        ← 印尼语原词，国际通用，出现在原文层
vi : gross, split             ← 产量分成合同类型专名 gross split，越语无对应译名
```

### 六、质检与覆盖

七组 `chk-titles` 错误 0；`_ph_qchk` 三项质检 0 条 0 处（修正上述四处后）。
告警一律是「中文/英文长度比 0.18–0.25」——中文为「关于……的政府条例」紧凑句，
英文须把定语层层展开，属预期差异。

```text
ID     2,294 → 2,485 / 3,348（68.5% → 74.2%）
全库  25,079 → 25,240 / 42,121（59.5% → 59.9%）
```

单轮产出 191 部，为前几轮（每轮 30–48 部）的 4–6 倍。

### 七、剩余

ID 剩 **863 部**。其中 `PP` 族余约 208 部主题完整，可继续按主题表推进；
另有三类需单列：①156 部元数据拼接截断题（须回原页补题）；②339 部类型判不出；
③镇设立族与地名族（须逐条核地名五语）。

## 第二十六批（id-p1-pph–ppj、uu-k1–k2）四组并推 · 143 部

| 主题表 | 族 | 部数 |
| --- | --- | --- |
| `_t_pp_h.js` | 残疾人权利、税务、反腐、地税、自由港 | 30 |
| `_t_pp_i.js` | 经济特区、军事法院、社保、金融监管 | 32 |
| `_t_pp_j.js` | 所得税细则、征收、地方自治、国企重组 | 29 |
| `_t_uu_k1.js` | 设立市/县（2001 年设市 + 2007–2013 单县） | 33 |
| `_t_uu_k2.js` | 设立县/市/省（多区合设 + 1996–1999 系列） | 19 |

单轮 143 部，与上一轮 191 部同量级；两轮累计 334 部，是提速前（每轮 30–48 部）的 3–4 倍。

### 一、句框新增 `UU` 与「设立」族的语序

`_id_render.js` 的 `UU` 句框此前未用于批量生产，本轮首次大规模使用：

```text
zh  关于设立巴图市的法
en  Law on the Establishment of the City of Batu
vi  Luật về việc thành lập Thành phố Batu
th  พระราชบัญญัติว่าด้วยการจัดตั้งนครบาตู
ms  Akta tentang Penubuhan Bandar Batu
```

故主题表里 `en` 写 `the Establishment …`（小写起首，与介词连读）、`vi` 写 `việc thành lập …`，
`th` 与 `ms` 写完整名词短语——**同一句框下五语的起首形式并不一致，不能一律首字母大写**。

### 二、地名五语分工：zh/th 音译，vi/ms 保留原名

沿用 `ID-H1955`/`ID-H1772`（马迪恩、巴东帕里亚曼首府迁移）的既有做法：

```text
zh  西加里曼丹省北卡永县          th  อำเภอกายงอูตาราในจังหวัดกาลิมันตันตะวันตก
vi  Huyện Kayong Utara tại Tỉnh Kalimantan Barat     ms  Kabupaten Kayong Utara di Wilayah Kalimantan Barat
```

泰国把 `kabupaten` 作 `อำเภอ`、`kota` 作 `นคร`、`provinsi` 作 `จังหวัด`、`kecamatan` 作 `ตำบล`——
与 `ID-H955`（勿加泗二级行政区县 = อำเภอระดับสองเบกาซี）一致，不另立「เขต」等写法。
马来西亚语把 `provinsi` 作 `Wilayah`（`ID-H1342` 巴布亚省特别自治法作 `Wilayah Papua`）。

### 三、旧行政区划名一律照录，不折算

`KABUPATEN DAERAH TINGKAT II` → 二级行政区县 / Second-Level Regency / Huyện Cấp hai /
อำเภอระดับสอง / Kabupaten Daerah Tingkat II；`KOTAMADYA DAERAH TINGKAT II` → 二级行政区市 /
Second-Level Municipality / Thành phố Cấp hai / นครระดับสอง / Kotamadya Daerah Tingkat II。
`ID-H1056`、`ID-H1078`、`ID-H827`、`ID-H886`、`ID-H949` 均属此类。

### 四、同一部法在库里有多条重复登记，译名各随本文

```text
ID-H1045（UU48-1999）设立比鲁恩县与锡默卢县        ← 双县全称
ID-H1058（UU48-1999）设立比鲁恩县                  ← 只写一县，按本文译
ID-H1046（UU51-1999）布奥尔、莫罗瓦利、邦盖群岛      ID-H1060 只写前两县（标题截断，未译）
ID-H1051（UU47-1999）奴努坎、马利瑙、西/东库台、邦通  ID-H1070 截断（未译）
```

截断的 9 条（`ID-H1060`/`H1066`/`H1070`/`H1071`/`H1072`/`H127`/`H428`/`H467`/`H948`）未译，
留待回原页补题——**不按姊妹条目推测补全**。

### 五、`_id_type.js` 对 1996 年三部的误判已按 `docNumber` 纠正

`ID-H826`/`H827`/`H828`（UU54/52/53-1996）被判为 `PP`，实则正文引述了他条政府条例而触发兜底规则。
判定改为「`docNumber` 前缀为 `UU` 且正文出现『Dalam Undang-undang ini』即定为法」，
前缀优先于兜底命中。

### 六、质检与覆盖

五组 `chk-titles` 错误 0；`_ph_qchk` 三项质检 0 条 0 处（修正 `ID-H979` 的 `thâu tóm` → `mua lại` 后）。
告警一律是「中文/英文长度比 0.20–0.28」——中文紧凑句对英文层层展开的定语，属预期。

```text
ID     2,485 → 2,628 / 3,348（74.2% → 78.5%）
全库  25,270 → 25,413 / 42,121（60.0% → 60.3%）
```

### 七、剩余 720 部：结构已摸清，下一步打「截断题」

```text
156  PERATURAN PERUNDANG-UNDANGAN N …（元数据拼接后 110 字符硬截断）
 34  设立镇族（PEMBENTUKAN … KECAMATAN，含 1991/1992/1995/1996 四个年份群）
 19  PERUBAHAN ATAS …   18  TAMBAHAN DAN …   11  PENGESAHAN PERJANJIAN（双边协定）
  7  PEMBENTUKAN PENGADILAN   7  PENCABUTAN PERATURAN   7  KETENTUAN ASAL BARANG
 其余为单条杂题
```

**156 部截断题已有解法**：抽查六条，正文末尾的 `PENJELASAN ATAS … TENTANG …` 完整复述了
本条的文书类型、号年与主题（`ID-H1003` 还原为「Perubahan Atas Peraturan Pemerintah Nomor 2
Tahun 1996 tentang Kegiatan Perusahaan …」），可从正文抽取全称后再译，不必回原页。
下一轮拟先写抽取器把 156 条全称批量导出，再按主题表推进。

**34 部设立镇族**：正文 `Pasal 1` 逐条列「Membentuk Kecamatan X di wilayah Kabupaten Y」，
可用正则还原县名单（已试跑，34 条中 28 条可抽全，需清洗 `Dacrah`/`Dae-rah` 类 OCR 误字
与夹入的页眉「PRESIDEN REPUBLIK INDONESIA」）。

## 第二十七批（ph-mt）改换通道：PH 机翻 + 三道机器闸门

### 一、先算清「40% 没译」到底在哪

用户说还剩 40%。按国别看，缺口并不在 ID：

```text
国别   总数   四语齐全   缺口      备注
PH    23,117    7,391   15,726    占全库缺口的 94%
ID     3,348    2,628      720
MY     6,976    6,836      140
TH     1,041      982       59
LA       138       92       46
VN       428      420        8
BN     1,275    1,267        8
```

全库 42,121 / 已译 25,413 / 缺 16,708。**PH 一家占 15,726，是 94%**。
此前连推 ID，边际效用极低——ID 全做完也只补 720 条（4%）。

### 二、PH 不能用规则引擎，也不该再手写

台账第八批已判定：PH 剩 15,726 条里 A+B 桶 13,959 条是自由散文，无第二桶可剥。
手写每轮 20–40 部，按此要四百轮。**瓶颈不是译力，是产出通道**。

改用模型批量译。查环境发现 `DASHSCOPE_API_KEY` 在，`api.openai.com` 在本机
ETIMEDOUT（直连不通），阿里云百炼 `dashscope.aliyuncs.com` 可用，Qwen 兼容 OpenAI 协议。

### 三、提示词的三条关键约束，全部取自库内既成译法

不是照教科书写，是照已完成 7,391 部 PH 的实际做法反推：

| 事项 | 库内既成做法 | 依据 |
| --- | --- | --- |
| 人名 | **音译**并加间隔号 | `Manuel L. Quezon`→曼努埃尔·L·奎松；`Tiburcio Tancinco Memorial School`→蒂布尔西奥·坦辛科纪念学校 |
| 公司与机构原名 | **保留拉丁字母**，通用词照译 | `Maynilad Water Services, Inc.`、`Blockbuster` 广播系统公司 |
| 区划通名 | 必须译出 | Municipality→市镇/Kotamadya/Perbandaran、Province→省/Provinsi/Wilayah |
| 文书类型 | Republic Act→第N号共和国法（1,144 部先例）、Commonwealth Act→联邦法（159）、Presidential Decree→第N号总统令（17） | 全库统计 |

初稿把「人名一律保留拉丁原文」写进提示，与库内做法相反，已改正。
**先查存量再定规则，不要凭语感。**

### 四、三道机器闸门（这是机翻能用的前提）

```text
① 数字闸门  _ph_num.js
   英文数词先折成阿拉伯数字（Nineteen Hundred and Forty → 1940），
   把「本条必备数字」明示给模型，译后再逐语核对。
   泰语放行佛历 +543；中文放行汉字数字（一九四〇）。
   ⚠ 首轮实测抓到 PH-H100：「Nineteen Hundred and Forty」被译成 1946 —— 年份被改写。
     手写时人眼能看见，批量机翻必须由机器拦。

② 跨文字闸门  _ph_mt_qchk.js
   th 出现汉字/西里尔/阿拉伯/高棉，vi/id/ms 出现汉字或泰文，含 U+FFFD —— 直接判废。
   实测命中率约 4%（1,130 条里 45 处），集中在泰语。

③ 崩坏闸门  _ph_mt_qchk.js
   模型把长串专名整段删去后，会留下「di , menjadi yang akan dipindahkan ke ,」这类
   只剩虚词与逗号的残句。判据：出现「空格 逗号 空格」或连续逗号。
   另有「实词不足 2 个」兜底（仅对 vi/id/ms，中文没有拉丁实词，不适用）。
```

不合格条目从 `_ph_mt_out.jsonl` 剔除，下一轮自动重译，不进库。

### 五、`_ph_qchk.js` 对机翻不适用，另写一个

现质检器靠本族词表判英文残留。机翻产物里「ngã rẽ」「chôn cất」「satu juta dolar」
「ex officio」都不在词表，275 条一次报二十多处误报，把真错误淹掉。
故 PH 机翻不跑旧质检，只跑上面三道闸门 + 结构质检（`chk-titles`）。
**误报多的检查等于没有检查。**

### 六、后处理代替返工

约 12% 的 id/ms 仍把 `Municipality` / `Province` / `City` 原样留下（多为
`Municipality of Balbalan` 这种专名结构）。逐个退回重译不划算，改在打包时规则替换：

```text
id  Municipality (of) → Kotamadya    Province (of) → Provinsi    City (of) → Kota
ms  Municipality (of) → Perbandaran  Province (of) → Wilayah     City (of) → Bandar
特例 Mountain Province → Provinsi Mountain / Wilayah Mountain（本身是省名，不能倒装）
```

替换后残留从 40 处降到 3 处。

### 七、四个工具（`_work/title-multi/`）

```text
_ph_mt.js       批量译，断点续跑，写 _ph_mt_out.jsonl
_ph_num.js      数词折算 + 五语数字一致性校验
_ph_mt_pack.js  jsonl → 批次 JSON，内含区划通名后处理，只写 zh/vi/th/id/ms 五键
_ph_mt_qchk.js  机翻专用质检（跨文字 / 崩坏 / 区划未译 / 长度）
_ph_mt_purge.js 把不合格条目从结果集剔除，待下一轮重译
```

`en` 与 `orig` 一字不动——PH 的 `en` 是数据源，只补四语与 `zh`。

### 八、踩到的三个坑

```text
① 断点续跑键名不一致：落盘用 id，检查用 idn，导致已完成条目被反复重译。
   145 条里重复翻了三次。
② 模板字符串里写 `nums=` 会提前闭合反引号，整脚本语法错误。
③ matchAll 无捕获组时 m[1] 是 undefined，数字收集函数当场崩。
```

### 九、吞吐

```text
单批 10 条、并发 20：109 秒写 188 条 ≈ 104 条/分
全量 15,700 条约 2.5 小时（手写按每轮 30 部需 400 轮以上）
合格率 94%（1,130 条中 58 条不合格，泰语跨文字占 45）
```

### 十、通道中断：账号欠费（本批到此为止）

跑到 1,348 条时通道停摆，错误码分两类：

```text
qwen-plus / qwen-flash / qwen2.5-7b-instruct
  HTTP 400  "Access denied, please make sure your account is in good standing"
  type=Arrearage  → 账号欠费
qwen-turbo
  HTTP 429  "You have exceeded your current request limit"
  type=limit_requests  → 限流（非欠费，但同样不可用）
```

`api.openai.com` 直连 ETIMEDOUT，本机无代理，故无备用通道。
**用户决定：先不翻译，入库现有。** 已入库 1,348 条，结果集无积压（待入库 0）。

无人值守循环因此有个坑：`_ph_mt_loop.sh` 把「本轮写入 0 条」当成「全部完成」而退出，
实际是 1,500 条全失败。若后续重启循环，**退出条件应改为「连续两轮失败率 > 90%」并告警**，
不能只看写入数。

### 十一、当前覆盖（2026-10-29）

```text
BN   1,267 / 1,275      缺     8   标题即文件名（S-1_2026-E），无实质标题，无法译
CN   1,586 / 1,586      缺     0
ID   2,628 / 3,348      缺   720   主题表法，见第二十三至二十六批
KH     187 /   187      缺     0
LA      92 /   138      缺    46   原题是抬头（LAO PEOPLE'S DEMOCRATIC REPUBLIC），无标题
MM      80 /    80      缺     0
MY   6,836 / 6,976      缺   140
PH   8,739 / 23,117     缺 14,378   机翻通道欠费中断，余量待续
SG   3,714 / 3,714      缺     0
TH     982 / 1,041      缺    59
TL     230 /   230      缺     0
VN     420 /   428      缺     8
全库 26,761 / 42,120    63.5%（本轮 25,413 → 26,761，+1,348）
```

剩余 15,359 条中，PH 14,378 条（94%）必须走模型通道；MY 140、TH 59、LA 46、ID 720、
VN 8、BN 8 共 981 条可人工小批推进，其中 BN 8 条与 LA 部分条目**原件无标题**，
须回原页补题，不属翻译问题。

---

## 第二十八批：外发语料包（交给外部大模型翻译）

### 一、为什么外发

模型通道欠费后，剩余 15,413 条里 94% 是 PH 长题，规则引擎与人工小批都推不动。
用户决定：把清单与规则一起外发，用别的模型翻，回收后走本库闸门入库。
本轮只做「出包 + 回收器」，不产生任何译文，覆盖数字不变（26,761 / 42,121，63.5%）。

### 二、口径上必须解决的一个坑：`id` 被双向占用

记录主键原本叫 `id`，而印尼语键也叫 `id`。写外发格式时
`o[k] = ...; o.id = 印尼语译名` 会把条目编号**整条覆盖**，
表现为示例文件里出现 `{"id":"jalan","zh":"道路法"}` 这种「编号即标题」的畸形。
**定案：外发格式的记录主键改用 `key`，`id` 只表示印尼语。**
`_ph_mt.js` 当年用 `idn` 表示印尼语、`key` 表示编号，是同一原因的另一种解法。
后续任何新增的外发/回收脚本，都不要再让 `id` 兼任两职。

### 三、可译与不可译必须分开

按「源文本本身有没有内容」分档，而不是按「缺不缺语种」分档：

| 档 | 条数 | 处置 |
|---|---|---|
| 可译 | 15,573 | 出包，PH 14,646 / ID 720 / MY 140 / TH 51 / LA 8 / VN 8 |
| 无原文 | 59 | 单列 `03-待补原文-不译.txt`：BN 8（标题即文件名 `S-1_2026-E`）、LA 38（抬头与国训 `Peace Independence Democracy Unity Prosperity`、`LAO PEOPLE'S DEMOCRATIC REPUBLIC`、`Unofficial Translation…`）、TH 8（标题全空）、PH 5（标题全空或 `A`、`:\ .`） |

判定不能用长度门槛了事：中文 3 字（`专利法`）已是完整标题，拉丁文 3 字则不是。
`isJunk` 必须按文字分叉。

### 四、`lang` 要按文字判，不能信键名

库里存在「`th` 键里塞中文」的脏数据（TH-H1086 `1977年促进投资法`）。
若照键名标 `lang:"th"`，译员会以为源文是泰文。改为按 Unicode 区段识别
（泰/高棉/老挝/缅甸/汉字 → 对应语种，其余回落键名），并对「非本国官方语言的源」
加 `note`：只译名称，不许补年份文号。

### 五、四道闸门落到 `_ext_import.js`

| 闸门 | 判据 | 处置 |
|---|---|---|
| 结构 | `key` 不在母版、`need` 缺条、长度不在 2–300 | 退回 |
| 字符集 | `th` 混汉字、`zh` 混泰文、`vi/id/ms` 混汉字 | 退回 |
| 兜底 | 出现 `‖ 原文`（`\|\|`） | 退回 |
| 数字 | 文号数字**全语种都丢** → 退回；个别语种丢 → 提醒；凭空多出源文没有的四位数 → 提醒 | 分级 |
| 残句 | 去掉英文虚词后实词不足 6 字符 | 退回 |

数字比对必须先切词再比：`/\d{4}/g` 会在 `11611` 里匹配出 `1161`，
初次测试就误报了四条「臆造数字」。取 `match(/\d+/g)` 整词比。

### 六、产物

```text
桌面/法规标题待译_外发_20261029/
  00-翻译规则.md            外发规则（源：_work/title-multi/EXT-RULES.md）
  01-总表.jsonl             15,573 行
  02-示例-已完成.jsonl       13 条库内定稿，六语齐全
  03-待补原文-不译.txt       59 条
  04-批次索引.csv           160 批
  05-使用说明（自己看）.md
  批次/<国别>/<国别>-NN.jsonl  每批 100 条
```

脚本：`_ext_export.js`（出包）、`_ext_import.js`（回收入库）。
回收后仍走 `apply-multi.js → sync-titles-to-catalog.js → rebuild-index.js → verify-data.js`。

### 七、外发规则里固化的既有口径（新译名必须与存量同风格）

1. 中文不以「一部」「一项」「关于」开场；「关于…的条例」只在长定语主题时用（存量 358 : 2,270）。
2. 人名音译带间隔号，公司机构保拉丁原名，区划通名必译。
3. `zh` 保留全部要件，四语压缩为「文书类型 + 核心动作 + 核心对象」。
4. ID 的 `zh` 不带文号，其余四语带文号；UU 与 PP 两套句框照存量。
5. TH 佛历并列公历，泰文不空格断词。
6. 英文数词先折阿拉伯数字（`Nineteen Hundred and Forty` 曾被译成 1946 年）。

---

## 第二十九批：外发译稿回收入库（第一批回收，501 条）

### 一、结果

收到 1,247 条（29 个文件，PH 按 `partN` 分批），**入库 501 条**，逐条退回 26 条，整批隔离 ID 720 条。
全库四语齐全 26,761 → **27,262 / 42,121（64.7%）**。
PH 8,739→9,058，MY 6,836→6,951，TH 982→1,033，LA 92→100，VN 420→428（满）。
`verify-data` 829 警告 / 4 提示，与入库前一致，无新增。

### 二、ID 720 条整批不可用（78% 逐词硬套）

```
源 PERATURAN PEMERINTAH NOMOR 48 TAHUN 1994 TENTANG PEMBAYARAN …
译 政府条例第48年1994关于缴纳所得税关于收入从PENGALIHAN土地权利和/或建筑物
```
译员把全大写印尼语当成专名，只换了少量词。**教训：全大写源文必须显式声明「这是印尼语法律标题，逐句译」，否则模型按专名处理。**
新增 `--skip ID,MY` 国别隔离开关，整批退回时不再逐条刷屏。

### 三、本轮发现并修正的四处闸门错误

| 闸门 | 原判据 | 错在哪 | 现判据 |
|---|---|---|---|
| 文号 | 四语都必须出现 `dn` 数字 | PH 库内 8,460 条仅 8 条带文号，把 284 条正常译文全卡住 | 仅 **ID** 强制；其余只存 `dn` |
| 长度 | 统一 2–300 | 库内实测 `vi/th/id/ms` 最长 742–859，长题直译天然超 300 | `zh` 2–300，其余 2–900 |
| 书名号 | 必须写成 `（《…》）` | `修订第136号法案《菲律宾群岛法院组织法》…` 这种句中嵌入是合规的 | 只查成对，不当整体包裹即可 |
| 中文拉丁占比 | > 40% 即退 | PH 旧题地名/人名极多（`Alaminos、Bani、Bolinao、Anda、Agno`），合规译文占比也到 66% | 有全大写残留词且占比 > 30%，或占比 > 75% 才退 |

### 四、新增两道实质拦截

1. **`vi` 层无声调符号 → 退回**。MY 25 条把 `vi` 直接抄成马来文（`Peraturan Perbadanan Insurans Deposit Malaysia`）。马来文与印尼文同源，与越南文无关。
2. **原文残留 → 退回**：`IDSTOP` 词表（DAN/TENTANG/YANG/UNDANG/PERATURAN/…），中文层命中即退；其他语种要求「全大写词 ≥3 个」或「≥2 个且含 `IDSTOP`」。

两条已写回 `EXT-RULES.md` 自检清单，外发包 `00-翻译规则.md` 同步更新。

### 五、一个假警报：`MY-H1091`

回读发现 `title.zh=null`、`ms` 是英文原文，误以为写坏。`git status` 证明该文件本轮**未被触碰**，属存量脏数据（此前某轮把 `src` 写进了 `ms`）。
**教训：怀疑写坏先看 `git status --porcelain <路径>`，别直接改。**

### 六、产物

```text
桌面/退回待重译_20261029/
  00-说明.md            本轮结果 + ID 整批退回的原因与重译要求
  01-退回清单.jsonl      26 条，含 src/need/dn，可直接再外发
  02-退回原因.md         逐条退回原因
_work/title-multi/_ext_batches/*.json   21 个批次（入库用）
_work/title-multi/_ext_retry.js         退回清单生成器
```

---

## 第三十批：印尼语缺口自译（ID 缺口 300 条，分 9 个批包）

2026-10-29。外发路径走到 ID 全批退回之后，用户指示「你把缺的少的自己先翻译」，改为本人补译。ID 是当时剩余缺口中最少的可译大批（607 条）。

### 一、批次与产出

| 批包 | 条数 | 内容重心 |
|---|---|---|
| `_self/ID-01`–`ID-05` | 40+40+33+39+39 | 1999 年前后设区、机构、预算类（本轮开工前已完成前四批） |
| `_self/ID-06` | 36 | 退伍军人/国民委员会津贴历次修正、批准类 |
| `_self/ID-07` | 36 | 贸易部内部规章、BKPM 组织与绩效津贴 |
| `_self/ID-08` | 37 | 贸易部 2019–2021 规章、新冠财税与社限措施 |
| `_self/ID-09` | 32 | 2025–2026 新法、1990 年前后设区法 |
| `_self/ID-10` | 36 | 1994–1996 年税法与设区法 |
| `_self/ID-11` | 27 | 1996–1998 年税务、军事纪律、国有银行/企业 |
| `_self/ID-12` | 38 | 2016–2025 年 BKPM 与贸易部条例 |
| `_self/ID-13` | 19 | 1990–1994 年银行改制、预算追加、投资领域清单 |

合计 **300 条**（另开工首日入库 `ID-05` 39 条）。ID 四语齐全 2,628 → **3,080 / 3,348**，全库覆盖 64.7% → **65.9%**（27,740 / 42,122）。

### 二、流程定式（本轮固化，可复用）

1. `_self_pick.js` 盘点全库缺口 → `_self/pending-<CO>.json`（含 `key/co/need/have/dn`）。
2. 只写译文表 `_self/ID-NN.tr.js`（五语，键为 `ID-H####`），**不手抄印尼语原题**。
3. `node _self/build.js ID-NN` 从 `pending-ID.json` 回填 `title.id` 生成 `ID-NN.json`。
4. `chk-titles.js` → `apply-multi.js`。
5. 每 3–4 批跑 `sync-titles-to-catalog.js → rebuild-index.js → verify-data.js → _ph_cover.js`。

第 3 步是关键改进：原题由脚本回填，彻底消除手抄错字；副作用是把原题里的**内嵌换行折成空格**（`ID-H2718`、`ID-H2896` 各 1 处），属规范化、不改字面，与既有 191 条同口径。

### 三、本轮判定的两条选题红线

1. **110 字硬截断**：抓取层有 110 字符列宽上限，凡原文长度落在 105–113 且以半个词结尾者一律视为**无源**，不译。本轮据此挡下 183 条。
2. **`docNumber` 不可轻信为文号**：ID 库 3,348 条里 2,933 条标 `UU`、仅 101 条标 `PP`，前缀明显错标（大量 `PENETAPAN … SEBAGAI PTN BADAN HUKUM` 实为政府条例却标 `UU`）；且相当一部分 `docNumber` 的数字/年份**直接来自标题内部的「Nomor N Tahun Y」**（如 `UU34-1985` 出现在「修正 PP 34/1985」的标题里）。
   → 现行口径：**仅当标题内不含该数字年份**时，才把 `docNumber` 用作 `Law No. N of YYYY` 类文号；否则只写标的、不加文号。`zh` 层一律不带文号。

### 四、ID 剩余 268 条的定性结论

不是「还没做」，而是**现有源里没有可译的题**：

- **183 条** 原文在 110 字处截断（结尾是 `Pelak`、`Penanama`、`Kement`、`Admini`、`PT PERUSAHAAN PENGE` 这类半个词）；
- 约 **60 条** 标题极短或为空（`PENGESAHAN`、`PENUNJUKAN`、`PENCABUTAN`、`Peraturan Perundang-undangan 2`、`PENGESAHAN_2`）；
- 约 **25 条** 从句中途起点（`TAMBAHAN DAN PERUBAHAN ATAS ANGGARAN PENDAPATAN DAN`）。

**处置**：须回 `peraturan.go.id` / 各部 JDIH 原页补全标题后重译，不在本地猜补。

### 五、闸门表现

9 个批包合计 `chk-titles` 报错 **1 条**：`ID-H2077` 中文拉丁占比 69%（原题把公司名写了两遍，直译后中文里也出现两遍）。改为「地热能源企业 Geo Dipa」后转正。
其余告警全是 `长度比异常 0.10–0.37（对 en）`——中文以字计、英文以词计，短题自然落在 0.2 上下，属噪声，不作处理。

`verify-data`：**829 警告 / 4 提示**，与基线一致，无新增。
