# 标题四语生成引擎

把公式化的英文法名拆成「类型词 + 主名 + 括号限定语 + 年份」，用词表拼装 vi/th/id/ms 四语标题。
目的不是替代翻译，而是把「逐部翻译」压缩成「逐词条翻译」。

## 适用范围（2026-10-28 实测，勿重复探路）

| 法域 | 总数 | 引擎可生成 | 占比 | 判断 |
|---|---|---|---|---|
| SG | 3,714 | 1,078 | 29% | 有效，已用尽 |
| MY | 74 | 14 | 19% | 有效，量小 |
| BN | 1,275 | 8 | 0.6% | 无效 |
| KH | 187 | 0 | 0% | 无效 |
| LA | 80 | 0 | 0% | 无效 |
| MM | 80 | 0 | 0% | 无效 |
| TL | 230 | 0 | 0% | 无效 |
| CN | 1,087 | 0 | 0% | 无效 |
| PH | 10,619 | 0 | 0% | 无效 |

**为什么只有新加坡适用**：新加坡法规标题是 `主名（限定语）类型词 年份`（`Income Tax (Exemption) Order 2019`），
类型词稳定后置，主名与限定语高度复用（3,714 部只对应 717 主名 + 1,796 片段）。

其余法域不符合这个结构：

- **BN / KH / LA / MM / TL**：类型词前置或中置（`Law on Negotiable Instruments`、`Civil Code 2018`、`Child Rights Law`），
  主名与描述连成一体的名词短语，无稳定切分点。
- **PH**：10,619 部中 9,867 部是 `An Act to ...` 立法长句，长度中位 173 字符、最长 1,029，逐条唯一。
  主名唯一值 10,303（97%），词表法完全失效。
- **CN**：`最高人民法院关于 X 的解释/规定/批复` 形式上可模板化，但 X 是信息主体
  （`海事法院受理案件范围`、`审理企业破产案件若干问题`），模板只能省套话，省不了实质工作量。

新加坡内部也有天花板：片段分布是幂律长尾，1,796 个片段里第 1 名只出现 13 次，
补词表的边际收益在第 100 个片段后骤降。1,078 部（29%）已接近词表法极限，
其余 2,636 部标题各含专有主体名（`Steppe Capital Pte Ltd`、`Elite Commercial REIT`），必须逐条翻译。

## 用法

```bash
# 覆盖率报告（默认，不写文件）
node gen.js --scope SG

# 导出待译清单（按频次排序，标出已译）
node gen.js --scope SG --addrs --out _todo_SG.json

# 生成批次（只写满分条目，其余跳过）
node gen.js --scope SG --emit ../batches/sg-p1-b03.json --only vi,th,id,ms

# 单条解析调试
node gen.js --parse "Income Tax (Singapore — Lithuania) (Avoidance of Double Taxation Agreement) Order 2019"

# 词表统计
node gen.js --lex
```

生成后照常走 `chk-titles.js` → `apply-multi.js` → `sync-titles-to-catalog.js`。

## 词表

`lex/type.json` — 30 个类型词四语对照。四语一律类型词前置，与英文后置相反。
`lex/main.json` — 主名四语。键为剥离类型词、限定语、年份后的原文。
`lex/frag.json` — 括号限定语四语。
`lex/nation.json` — `Singapore — X` 双边协定里的国家名四语。涉台条目不入表，转人工。

印尼语连接词规则：只有 `Act → Undang-Undang tentang X` 用 `tentang`；
`Code`、`Ordinance`、宪法等是固定法定名（`Kitab Undang-Undang Hukum Acara Pidana`、`Undang-Undang Dasar`），直接相连。

纯编号片段（`No. 2`、`3`、`Section 12`）不入表，由 `numLex()` 按语种惯例生成
（`Số 2` / `ฉบับที่ 2` / `Nomor 2` / `No. 2`）。

## 三个已修的解析缺陷（回归时注意）

1. **嵌套括号截断**：早期用正则 `/\([^]*\)/g` 贪婪删除括号段，
   `Income Tax (Steppe Capital Pte Ltd — Section 13(12) Exemption) Order 2022` 会只剩 `(Exemption)`，
   中间正文全丢。现改为 `extractParens()` 逐字符处理，顶层片段整段保留嵌套原文。
2. **相邻括号粘连**：`buf` 在 push 后未清空，
   `(Precincts for Upgrading Works) (Home Improvement Programme)` 会粘成一段查不到词表。
   现于顶层 `(` 处重置 `buf = ''`。
3. **括号内破折号误切**：`Guns, Explosives and Weapons Control (Explosives — Exemption) Order 2025`
   的破折号在括号内，被当作「法名 — 子项」分隔符后整条解析错位。
   现 `splitDash()` 只在不处于括号内时切分。

配套的**完整性自检**：`--emit` 会比对原文与译名的 `(` 数量，不等则剔除该条并报告。
这条自检是第 1 个缺陷的兜底——当时 1,228 条「生成成功」里有 760 条是残缺译名。

## 菲律宾：骨架模板（ph.js）

菲律宾走的是与新加坡完全不同的路子。新加坡是「主名 + 括号片段」的词表拼装；
菲律宾是 `An Act <动词> <长句>`，**整句必须用锚定正则吃掉**，槽位只允许填专名。

用法：`node ph.js`（覆盖率）/ `--emit <path>`（生成）/ `--parse "<标题>"` / `--why`（诊断拒译原因）

已建模板：建校（school）、改名（rename）、设市（createAdmin）、建 Barangay（createBrgy）、
病床数（beds）、分设（separate/separate2）、转制（convert，单列专用解析）。
产出 **1,578 / 10,619 = 14.9%**。

关键约束——**槽位必须过 `isProperName()` 校验**：

1. 剥虚词与行政区划词后，每个 token 必须首字母大写（专名）；
2. 不得命中通用词黑名单（establishing / appropriating / purposes / funds …）；
3. 长度 ≤ 110。

任一不满足即整条拒译，转人工。

这条闸门是从错误里长出来的：不加校验时能「生成」2,179 部，但抽查发现
`An Act Appropriating the Sum of Ten Billion Pesos for Aid, Relief…`
会把**骨架译掉、正文整段保留英文**，产出半英半译的废品。
加校验后降到 1,434 部，但每一条都干净。

### 地名处理口径

- 行政区划通用词按语种翻译（Barangay 保留原词、Municipality→Thị trấn/เทศบาล/Kotamadya/Perbandaran、
  Province→Tỉnh/จังหวัด/Provinsi/Wilayah）；
- 专有地名**保留拉丁转写**，四语均如此；
- 机构名尾缀前置（`Abuyog High School` → `Trường trung học phổ thông Abuyog`）；
- 泰文不以空格分词，相邻泰文之间的空格由 `thFix()` 合并，**但与拉丁专名之间保留空格**；
- 数词转各语种读法（25 → `hai mươi lăm` / `ยี่สิบห้า`（不是 สองสิบ）/ `dua puluh lima`）。

### 出库终检

`--emit` 收尾再扫一遍译文，命中英文骨架残留（`An Act` / `the` / `to Be Known` /
`Appropriating` / `in Province…` 等）的一律剔除。宁可少出，不可出半成品。
`ph-p1-b01` 靠此拦下 18 部，`ph-p1-b02` 拦下 15 部。

## 教训

引擎的价值取决于**结构的复用率**，不是标题的整齐程度。
新加坡看似杂乱，但切分点稳定（695 个主名覆盖 3,714 部），词表法可用；
菲律宾看似统一（`An Act ...`），主名唯一值却高达 97%，**词表法完全失效**，
只有改成「整句锚定正则 + 槽位专名校验」才吃下 14.9%。

判断用哪个指标：**主名唯一值 / 总数** 判词表法，**句首动词集中度** 判骨架法
（菲律宾前 15 个动词覆盖 87.5%）。指标选错，方向就全错。
