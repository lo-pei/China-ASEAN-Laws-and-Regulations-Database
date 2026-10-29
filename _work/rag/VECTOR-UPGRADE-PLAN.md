# 夜间向量升级计划（2026-10-29）

## 实际执行记录（2026-10-29 夜）

- **B 已完成（22:47）**：`embed.py --level law --law-content --batch 8`，42,121 部法规向量，`lawContent=title+summary+first2+chapters`；旧索引备份在 `backend/data/vectors.before-upgrade/`。
- **A 正在执行（23:33 约 17%）**：`embed_missing.py --level article --batch 8`，目标 234,624 条；约 16 条/秒，ETA 约 3.4 小时；parts/ckpt 在 `backend/data/vectors/article_missing.*`，中断可续跑。
- 硬件限制：DirectML 在 512 token / batch32 下触发 `887A0005`（设备移除），因此 B/A 改用 **maxLen=160、batch=8**；C 的 512 切片必须改用更稳的 provider/分批策略，不能复用本次 batch。
- **C 未开始**：等 A 完成后单独做 schema + 重嵌，预计 20 小时。

> 状态：`/api/qa` 的 BM25+向量 RRF、国别前置过滤、阈值已完成并测试。

## 0. 前置

- 模型：`_work/models/bge-m3/`（已存在，`model.onnx_data` 约 2.27 GB）
- 运行依赖：本机已补 `onnxruntime`、`tokenizers`，后端查询路径已验证可加载
- 数据库：`backend/data/calr.db` 已是 **42,121 部 / 564,579 条**
- 输出：`backend/data/vectors/`；增量脚本写入前自动复制 `.before-incremental` 备份

## 0.1 三个任务的先后顺序（推荐）

**先备份，再按 B → A → C 串行执行，不要并行。**

| 顺序 | 任务 | 命令 | 耗时 | 为什么这个顺序 |
| :---: | :--- | :--- | :---: | :--- |
| 0 | 备份当前向量 | `Copy-Item backend/data/vectors backend/data/vectors.before-upgrade -Recurse` | 1 分钟 | 三步都会改同一目录；`embed.py` 不自动备份 |
| 1 | **B 法规内容升级** | `python _work/phaseb/embed.py --level law --law-content` | 约 45 分钟 | 先完成法规级全量升级；否则 A 先补的 23,349 部法规向量会被 B 全表覆盖，白跑约 24 分钟 |
| 2 | **A 只补条文向量** | `python _work/phaseb/embed_missing.py --level article --dry`<br>`python _work/phaseb/embed_missing.py --level article` | 约 3.4 小时 | 法规已由 B 覆盖，A 不必再跑 `--level both`；只补 234,624 条缺失条文，MY/ID/VN 立即进入召回 |
| 3 | **C 条文 512 + 单语种 + 切片** | 见第 4 步（需先加 `article_chunks` 元数据） | 约 20 小时 | C 会替换整个条文向量结构，必须在 A/B 之后单独做；A 的旧条文向量是过渡方案 |

补充：
- **不建议 A 先跑 `--level both` 再跑 B**：A 的法规部分会被 B 覆盖，损失约 24 分钟；若你更看重「最快恢复覆盖率」，可先 A `--level article`、再 B，两者互不覆盖，但 B 只有 45 分钟，先做更省事。
- A 与 B 都写 `backend/data/vectors/manifest.json`，**串行**执行；C 应使用独立输出目录（或 `CALR_VEC`），不要与 A/B 同时写。
- 每完成一步跑 `python backend/test_qa_hybrid.py`；A/B 后再跑一次 106 题基线；C 后重跑评测并重新标定 `CALR_QA_VEC_MIN`。
- A 的新条文向量默认 `CALR_MAX_LEN=512`，旧条文仍是 160，属过渡态；如希望与旧索引同质，可在 A 前设 `$env:CALR_MAX_LEN="160"`，但 C 最终会统一替换。

## 1. 增量补齐缺失向量（A，约 4 小时；推荐只跑 `--level article`）

如果按 0.1 的顺序先做了 B，**A 只跑条文**（法规已全量升级）：

```powershell
python _work/phaseb/embed_missing.py --level article --dry
python _work/phaseb/embed_missing.py --level article
```

如果按传统顺序先补覆盖、尚未做 B，则可跑 `--level both`（法规 23,349 + 条文 234,624，约 4 小时），随后 B 会覆盖法规部分：

```powershell
python _work/phaseb/embed_missing.py --level both --dry
python _work/phaseb/embed_missing.py --level both
```

dry-run 当前结果：**法规缺 23,349 部、条文缺 234,624 条**。

说明：
- 保留已有向量，只编码库中缺失的 id；库中已删除的向量条目会被过滤；
- 新条文向量使用 `CALR_MAX_LEN`（默认 512），旧条文仍是 160；
  这是「先把覆盖补到接近 100%」的阶段性折中，最终切片见第 4 步；
- 中断后重跑同命令即可续跑（脚本内部按批次写 parts）。

## 2. 法规向量内容升级（约 45 分钟）

```powershell
python _work/phaseb/embed.py --level law --law-content
```

法规向量从「标题 + 摘要」升级为「标题(3 语) + 摘要 + 前两条正文 + 章节标题」；
`embed.py` 已支持 `--law-content`。该步会整表覆盖法规级向量，不影响条文向量。

## 3. 启动/重启后端并验证

```powershell
uvicorn backend.app.main:app --port 8000
python backend/test_qa_hybrid.py
# 或实际请求（需 API key）：
# POST /api/qa {"question":"越南外商投资准入条件","topk":5}
```

预期：
- `mode=hybrid-rrf`；
- `diagnostics.countries=["VN"]`，`vecReady=true`；
- 纯向量结果需过 `CALR_QA_VEC_MIN=0.30`，BM25 命中的条目不丢失；
- 结果 `debug` 带 `bm25Rank / vecRank / cosine`。

## 4. 条文向量 512 + 单语种 + 窗口切片（约 20 小时，需改索引结构）

当前 `vectors.py` 假设「一条文 = 一个向量」（`article_meta` 一对一）。
要真正做窗口切片，需要：

1. 新增 `article_chunks.json`：`{law_id,no,dup_index,chunk_index,text}`；
2. 每条文按 512 token / 128 overlap 切片，单语种（原文优先，中文/英文按需），
   避免 zh+en+orig 拼一条导致的语义稀释；
3. 检索时按条号聚合 chunk 分数（max 或 RRF），再返回条文；
4. 这是大改，**不要和 4h 增量混在同一个晚上做**；先用前两步验证收益。

## 5. 评测扩到 300+（约 1 人天，和向量任务解耦）

- 现有基线 106 题，位于 `_work/rag/phaseb-result.json`；
- 新题按法域分层：CN / VN / TH / MY / ID / PH / SG / LA / KH / MM / BN / TL，
  每个法域至少 20 题；单列「新入库 PH/MY/ID/VN/TH/LA」；
- 保持同一 gold 生成口径与「同口径相对比较」，不要跨版本直接比绝对值；
- 指标：P@3、R@5、MRR、至少命中、国别准确、P50/P90。

## 6. 不建议换 bge-m3

bge-m3 是当前少数同时覆盖中/泰/越/印尼/缅/高棉/老挝的模型；
先把 long-context / sparse / ColBERT 用起来，比换模型 ROI 高。

## 回滚

增量脚本写入前生成：

- `law_vecs.i8.npy.before-incremental`
- `law_scale.npy.before-incremental`
- `law_ids.json.before-incremental`
- 条文对应三个文件同理

如需回滚，覆盖回原文件名并恢复 `manifest.json`。
