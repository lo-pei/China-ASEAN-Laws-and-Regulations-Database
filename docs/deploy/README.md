# 部署文档（docs/deploy/）

四份部署文档按"平台 + 形态"分组。**先按本页选路线，再读对应文档。**

---

## 一、路线选择

| 场景 | 平台 | 形态 | 文档 |
| :--- | :--- | :--- | :--- |
| 通用云服务器，要 Nginx / HTTPS / systemd | Linux | A / B / B+ | [07-部署指南.md](07-部署指南.md) |
| 在 B 之上加 bge-m3 模型（语义检索 + AI 问答） | Linux | B+ | [08-部署-B+完整版.md](08-部署-B+完整版.md) |
| 阿里云 Windows Server 2022，仅 IP 访问，答辩演示 | Windows | B+ | [09-部署-Windows服务器.md](09-部署-Windows服务器.md) |
| 同上，但按**实际部署踩坑**执行 | Windows | B+ | [10-部署-Windows阿里云实测复盘.md](10-部署-Windows阿里云实测复盘.md) ← 最新 |
| 部署/校验 C 阶段条文切片索引 | 均可 | B+ / C | [11-C索引产物与部署.md](11-C索引产物与部署.md) |

**选择建议**

- 有 Docker、要长期运行 → 07（+ 需要 AI 问答再加 08）。
- 没有 Docker / 只有 Windows 机器 / 临时演示 → 09，并**同时对照 10**：10 是 09 实际执行后的复盘，修正了 09 中 `onnxruntime-directml` 的判断。
- 后端单目录视角（Docker 命令、接口、故障排查）另见 [backend/DEPLOY.md](../../backend/DEPLOY.md)。

---

## 二、前置产物

部署包此前由 `_out/pack.ps1` 生成（原顶层 `_out/`，2026-10-29 归档；约 2.2 GB，不入库）。
该归档已随 2026-10-29 的 `_work` 清理删除；如需重新打包，按下列包结构自行生成/使用后端 Docker 镜像：

| 包 | 内容 |
| :--- | :--- |
| `calr-runtime.tar.gz` | 站点 `prototype/` + 后端代码 + `calr.db` + 向量 |
| `calr-model.tar.gz` | bge-m3 模型（可选，没有则检索降级为 BM25） |
| `calr-patch.tar.gz` / `calr-patch-py.tar.gz` | 增量补丁 |

[09](09-部署-Windows服务器.md) 中写死了两个包的体积与 SHA256；**重新打包后必须重算并更新该节**。归档说明已随 2026-10-29 清理删除，恢复时请以本目录与 `backend/DEPLOY.md` 为准。

---

## 三、部署后验证

各文档的验证清单以 07 §6 最全；09 §5 与 10 的结果对照适用于 Windows。
最小验证：`/api/health` 返回 200，且站点首页、检索、详情页可打开。

---

## 四、实测高频坑（按出现频率）

1. **onnxruntime 版本**：无独显的 Windows Server 上 `onnxruntime-directml` 可能 `DLL load failed`，应改装纯 CPU 版 `onnxruntime` 并安装 VC++ 运行库（以 10 为准）。
2. **中文/空格路径**：PowerShell 命令中的含中文或空格路径必须加双引号。
3. **编码**：安装依赖前设 `$env:PYTHONUTF8=1`，避免 pip 读文件触发 GBK 报错。
4. **端口占用**：重新部署前先停任务计划并结束进程，否则解压覆盖失败。
5. **模型缺失静默降级**：容器/服务需显式设置 `CALR_MODEL`，路径不存在时检索会自动退化为 BM25（不报错）。
