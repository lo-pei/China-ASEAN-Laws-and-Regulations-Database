# 产品解决方案包（solution/）

> 本次比赛**只提交两份 PDF**，都在 [`提交物/`](提交物/) 目录：
> - [`产品解决方案Demo.pdf`](提交物/产品解决方案Demo.pdf)
> - [`产品使用说明书.pdf`](提交物/产品使用说明书.pdf)
>
> 其余文件是源文件/参考材料，**不要上传**。

---

## 一、提交物（仅两份 PDF）

| 文件 | 它是什么 | 给谁看 |
| :--- | :--- | :--- |
| [`提交物/产品解决方案Demo.pdf`](提交物/产品解决方案Demo.pdf) | **演示文档**：演示目标、准备、四幕操作、预期结果、真实截图、3/5/8 分钟讲解话术 | 评委/答辩现场照着演示 |
| [`提交物/产品使用说明书.pdf`](提交物/产品使用说明书.pdf) | **使用手册**：打开方式、界面、逐功能操作、FAQ、部署维护、已知限制 | 使用者/评委/部署者 |

两份是**不同东西**：Demo 讲“怎么把产品演示出来”，说明书讲“产品怎么用”。

---

## 二、源文件（可编辑，不提交）

| 文件 | 说明 |
| :--- | :--- |
| [`产品解决方案Demo.md`](产品解决方案Demo.md) | Demo 文档源文件 |
| [`产品解决方案Demo.docx`](产品解决方案Demo.docx) | Demo 文档 Word 版（由 md 生成） |
| [`产品使用说明书.md`](产品使用说明书.md) | 使用说明书源文件 |
| [`产品使用说明书.docx`](产品使用说明书.docx) | 使用说明书 Word 版（由 md 生成） |
| [`tools/build_docx.py`](tools/build_docx.py) | md → docx 构建脚本（封面/目录/页眉页脚/截图替换） |
| [`tools/md2docx.py`](tools/md2docx.py) | Markdown → DOCX 转换器 |
| [`assets/shots/`](assets/shots/) | 两份 PDF 中使用的真实界面截图 |

### 重新生成

```bash
# 1) 生成 DOCX
python solution/tools/build_docx.py solution/产品解决方案Demo.md solution/产品解决方案Demo.docx "产品解决方案 Demo" "3–8 分钟可复现的产品演示动线"
python solution/tools/build_docx.py solution/产品使用说明书.md solution/产品使用说明书.docx "产品使用说明书" "从打开、检索到比对与问答的完整操作指南"

# 2) DOCX → PDF（LibreOffice）
soffice --headless --convert-to pdf --outdir solution/提交物 solution/产品解决方案Demo.docx solution/产品使用说明书.docx
```

---

## 三、参考材料（非提交）

| 文件 | 说明 |
| :--- | :--- |
| [`产品解决方案说明书.pdf`](产品解决方案说明书.pdf) / [`.docx`](产品解决方案说明书.docx) / [`.md`](产品解决方案说明书.md) | 早期 22 页“方案论证”版，内容更偏背景/技术/价值；**不作为本次提交物** |
| [`index.html`](index.html) | 交互式方案讲解页（答辩备用/大屏展示）；**不是产品，也不作为提交物**；`file://` 可打开 |
| [`../prototype/index.html`](../prototype/index.html) | **真实产品**，双击即可运行；Demo PDF 中的操作都以它为准 |

---

## 四、数据与口径

- 统计数字以 [`../docs/README.md`](../docs/README.md) §三 为准：12 法域 / 18,785 部 / 339,351 条 / 1,566 部译文 / 18,746 部中文标题（99.79%）；
- 截图截自 `prototype/` 真实界面（2026-10-24）；来源页截图中已隐去随构建批次变化的旧统计列；
- 法条引用逐字取自 `prototype/data/laws/`；AI 译文统一标注“AI 辅助生成，仅供参考”；
- 检索评测数字来自 110 题弱标注集，绝对值偏低估，只看相对提升。

---

## 五、免责声明

本方案与数据仅用于学术研究、比赛演示与产品说明，不构成法律意见；法规文本以各国官方公布版本为准，
译文由 AI 辅助生成，仅供参考。使用前请核对官方原文。
