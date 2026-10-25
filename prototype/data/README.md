# prototype/data 数据层

**`laws/` 是唯一权威存储，其余都是可重建的派生视图。** 不要手工编辑派生文件。

---

## 一、目录职责

| 路径 | 内容 | 性质 |
| :--- | :--- | :--- |
| `laws/` | 18,785 部法规 `<法规ID>.json` + `index.json` + 2 份清单 CSV | **权威**（一法一文件） |
| `cn/` | 中国条文分卷（20 个文件） | 派生 |
| `intl/` | 境外条文分卷（276 个文件） | 派生 |
| `fulltext/` | 全文分卷（11 个文件 + manifest） | 派生 |
| `trans/` | 译文层 21 分卷 + manifest + PROVENANCE（23 个文件） | 只增不改 |
| `title-zh/` | 中文标题档案 + `artifacts/` 批次留痕（201 个文件） | 只增不改 |

顶层 `data/*.js`（`dataset-core.js`、`dataset-extra.js`、`cn-catalog.js`、`intl-catalog.js`、`i18n-*.js`、`bm25-idf.js`、`terms-bridge.js`、`asean-map.js`）是前端入口与检索索引，同样由构建脚本生成。

`laws/` 里的两份 CSV（`无本地原文清单.csv`、`条号重复清单.csv`）是**质量报告**，随数据更新由脚本重生成，不是运行时必需。

---

## 二、生成与重建

派生文件由 `_work/` 下的构建脚本重生成（这些脚本不入库，属本地工作区）：

```bash
node _work/merge/rebuild-index.js   # laws/index.json 统计
node _work/merge/build-packs.js     # 条文分卷 + manifest
node _work/backend/fix-catalogs.js  # catalog 与 laws/ 对齐
```

**禁止**：手工编辑分卷、catalog、manifest；译文写回原文正文。
**规则**：`trans/`、`title-zh/` 只增不改；译文与原文物理分离（见 [rules/SKILL-条文入库与译文分离规范.md](../../rules/SKILL-条文入库与译文分离规范.md)）。

---

## 三、自足性

`prototype/` 必须能单独拷走运行，不引用任何外部路径（尤其不能指向 `_work/`）。
校验：

```bash
node tools/verify-data-home.js   # A1–A11，含 18,785 部 / 339,351 条一致性
node tools/verify-data.js        # 逐文件统计一致性
node tools/verify-fulltext.js    # 分卷与权威存储逐条比对
```

数据规模与口径见 [docs/README.md §三](../../docs/README.md)。
