# -*- coding: utf-8 -*-
"""文档更新：SKILL.md 新增存储布局规范；docs/06 更新文件布局；dataset/README 注明派生关系"""
import io, os, re

ROOT = r"D:\A项目\Database_China–ASEAN Laws and Regulations Database"
os.chdir(ROOT)

# ---------------- 1. SKILL.md ----------------
P = "提示词/SKILL.md"
s = io.open(P, encoding="utf-8").read()

BLOCK = '''### 4.7 存储布局与构建流程（2026-10-08 起）

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

'''

anchor = "\n## 5. "
if "### 4.7 存储布局与构建流程" not in s:
    i = s.index(anchor)
    s = s[:i] + "\n" + BLOCK + s[i:]
    io.open(P, "w", encoding="utf-8").write(s)
    print("SKILL.md 已新增 §4.7 存储布局与构建流程")
else:
    print("SKILL.md 已存在 §4.7")

io.open("dataset/rules/SKILL-条文入库与译文分离规范.md", "w", encoding="utf-8").write(
    io.open(P, encoding="utf-8").read())
print("dataset/rules 规范副本已同步")

# ---------------- 2. docs/06 文件布局 ----------------
P6 = "docs/06-全文数据规范.md"
s6 = io.open(P6, encoding="utf-8").read()
NOTE = '''
> **2026-10-08 更新（两批数据合并后）**：文件布局已改为「**`prototype/data/laws/<法规ID>.json` 为唯一权威存储，
> `intl/ cn/ fulltext/` 分卷为派生构建产物**」。下文第 2 节的布局图与「必须写入 fulltext 目录」的表述
> 为合并前的历史口径；分卷现由 `_work/merge/build-packs.js` 从 `laws/` 自动生成，**请勿手工编辑分卷**。
> 条文契约（第 3 节）与四条红线（第 1 节）保持不变。完整规范见 `提示词/SKILL.md` §4.7。
'''
if "2026-10-08 更新（两批数据合并后）" not in s6:
    marker = "## 2. 文件布局"
    s6 = s6.replace(marker, NOTE.strip() + "\n\n" + marker, 1)
    io.open(P6, "w", encoding="utf-8").write(s6)
    print("docs/06 已加更新说明")
else:
    print("docs/06 已有更新说明")

# ---------------- 3. dataset/README 注明派生关系 ----------------
PR = "dataset/README.md"
sr = io.open(PR, encoding="utf-8").read()
RNOTE = '''
> **2026-10-08 更新**：项目已完成两批数据合并，**唯一权威存储改为 `prototype/data/laws/`**
> （每部法规一个 JSON）。本目录 `data/` 保留为 2026-10-07 的**派生导出快照**，供数据交换使用；
> 如需最新全量数据，请以 `prototype/data/laws/` 为准，或用
> `node _work/export-law-articles.js <输出目录>` 重新导出。
> 去重口径、字段映射与整合过程见项目内 `docs/26-两批数据对比与统一存储规范（方案）.md`。
'''
if "唯一权威存储改为" not in sr:
    i = sr.index("\n---\n")
    sr = sr[:i] + "\n" + RNOTE + sr[i:]
    io.open(PR, "w", encoding="utf-8").write(sr)
    print("dataset/README.md 已注明派生关系")
else:
    print("dataset/README.md 已有说明")
