# 部署到 Windows 云服务器（不用宝塔、不用域名）

> 适用：阿里云 ECS / 腾讯云 CVM，**Windows Server 2022**，**2 核 8 GB**，无域名、只用 IP 访问。
> 目标：`http://<公网IP>:8000` 能打开，答辩演示够用。
>
> **实测修正**：本文为计划态步骤；实际部署后遇到的问题与修正（onnxruntime DLL、中文路径、PYTHONUTF8、任务计划等）见同目录 [10-部署-Windows阿里云实测复盘.md](10-部署-Windows阿里云实测复盘.md)，两者冲突时以 10 为准。

---

## 0. 你的机器与需求对照

| 项 | 你的配置 | B+ 需要 | 结论 |
| :--- | :--- | :--- | :--- |
| 系统 | Windows Server 2022 | — | 本文按 Windows 写 |
| CPU | 2 vCPU | 4 核 | ⚠️ 偏少，语义检索会比开发机慢约一倍 |
| 内存 | 8 GiB | 6 GB | ✓ 够 |
| 磁盘 | 40 GiB，已用 53% | 10 GB | ✓ 剩约 19 GB，够 |
| 带宽 | 100 Mbps | 5 Mbps | ✓ 很充裕 |
| 域名 | 无 | — | 用 IP:8000 访问 |

**不需要**：宝塔、Docker、WSL、Nginx、域名备案。
**需要**：Python 3.12、两个压缩包（约 2.8 GB）、开放一个端口。

---

## 1. 开端口（两处都要，漏一处就访问不了）

### 1.1 阿里云安全组

控制台 → 实例 → **网络与安全组** → 安全组 → **配置规则** → **手动添加**：

| 方向 | 协议 | 端口范围 | 授权对象 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 入方向 | TCP | **8000/8000** | 0.0.0.0/0 | 对外提供访问 |

> 答辩演示对外公开没问题。**不要**开 3389 给 0.0.0.0（远程桌面保持白名单）。

### 1.2 Windows 防火墙

远程桌面登录服务器，管理员 PowerShell 里执行：

```powershell
New-NetFirewallRule -DisplayName "CALR 8000" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
```

验证：

```powershell
Get-NetFirewallRule -DisplayName "CALR 8000" | Select DisplayName, Enabled, Direction, Action
```

---

## 2. 装 Python 3.12

服务器上打开浏览器，下载 **Windows installer (64-bit)**：
`https://www.python.org/ftp/python/3.12.10/python-3.12.10-amd64.exe`

安装时**务必勾选**：

- ☑ **Add python.exe to PATH**（在最下面，默认不勾）
- 然后点 **Install Now**

装完新开一个 PowerShell 验证：

```powershell
python --version      # Python 3.12.10
pip --version
```

> 如果 `python` 报「不是内部或外部命令」，说明没勾 PATH。重跑安装包选 **Modify** 勾上即可。

---

## 3. 把两个压缩包传上去

先在**你自己的电脑**上确认已生成（我这边的输出目录是项目的 `_out\`；该目录已于 2026-10-29 归档到 `_work\_archive-2026-10-29\_out\`，下文命令中的 `_out\` 按此替换即可）：

```
calr-runtime.tar.gz    709.7 MB   ← 站点 + 数据库 + 向量（原始 2,891 MB，压到 4:1）
calr-model.tar.gz    1,260.4 MB   ← bge-m3 模型（原始 2,179 MB）
                      ─────────
              合计   1,970.1 MB ≈ 1.92 GB
```

**SHA256（传到服务器后可以校验，防止传坏）**：

```
24A38EF0130B23BE8BF707A519FA0F48551C3A8FB3A0D5ECCD1A56975EF4274E  calr-model.tar.gz
74743A5C1BC6C80930F34B421CD9BC493E33FE6D4EE13E5712564C7024876CA8  calr-runtime.tar.gz
```

服务器上校验（PowerShell）：

```powershell
Get-FileHash C:\calr\calr-runtime.tar.gz -Algorithm SHA256
Get-FileHash C:\calr\calr-model.tar.gz  -Algorithm SHA256
```

哈希不一致就重传，别硬解压——解到一半报错会更难查。

**打包内容已核对**：runtime 包 19,457 个条目（19,381 个文件 + 目录），
model 包内含 `model.onnx_data`。

### 3.1 传输方式（挑一个）

| 方式 | 速度 | 说明 |
| :--- | :--- | :--- |
| **RDP 磁盘映射**（推荐） | 受你上行带宽限制 | 远程桌面连接时 → 显示选项 → **本地资源** → 详细信息 → 勾选你的磁盘；连上后服务器里能看到 `\\tsclient\D`，直接复制 |
| **阿里云 OSS 中转** | **最快** | 先传 OSS，服务器上用内网/公网下载（机房带宽 100 Mbps，几分钟） |
| IIS FTP | 一般 | 要额外配 |

**2.1 GB 用家用上行 10 Mbps 要 30 分钟**，OSS 中转通常能压到 5 分钟以内。

RDP 磁盘映射的做法：

```
远程桌面连接 → 显示选项 → 本地资源 → 详细信息 → 驱动器 → 勾选 D:
连接后，在服务器 PowerShell 里：
  New-Item -ItemType Directory C:\calr
  Copy-Item "\\tsclient\D\_out\calr-runtime.tar.gz" C:\calr\
  Copy-Item "\\tsclient\D\_out\calr-model.tar.gz"   C:\calr\
```

### 3.2 解压

Windows 自带 `tar`（Server 2022 有）：

```powershell
cd C:\calr
tar -xzf calr-runtime.tar.gz
mkdir models
tar -xzf calr-model.tar.gz -C models
```

解压后检查**模型两个文件都在**（这是最容易出问题的一步）：

```powershell
Get-ChildItem C:\calr\models\bge-m3 | Select Name, @{n='MB';e={[math]::Round($_.Length/1MB,1)}}
```

必须看到：

```
config.json                 0
model.onnx                  0.7
model.onnx_data             2161.8    ← 少这个就白装
special_tokens_map.json     0
tokenizer.json              16.3
```

---

## 4. 装 Python 依赖

```powershell
cd C:\calr
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

> 用阿里云 PyPI 镜像，国内装 onnxruntime 这类大包快很多。
> 如果提示「禁止运行脚本」，先执行一次：
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

装完验证：

```powershell
python -c "import fastapi, uvicorn, onnxruntime, numpy, tokenizers; print('依赖 OK', onnxruntime.__version__)"
```

`onnxruntime` 在 Windows 上默认会装到 `onnxruntime-directml` 版（requirements 里按平台选的），
但代码里执行提供者写死为 `CPUExecutionProvider`。**实测注意**：在没有独显的 Windows Server 上，
`onnxruntime-directml` 可能因缺少 DirectML / VC++ 运行库而 `DLL load failed`；
应卸载并改装纯 CPU 版 `onnxruntime`，并安装 VC++ 运行库。详见 [10-部署-Windows阿里云实测复盘.md](10-部署-Windows阿里云实测复盘.md)。

---

## 5. 先手动启动，确认能用

```powershell
cd C:\calr
$env:CALR_DB     = "C:\calr\backend\data\calr.db"
$env:CALR_VEC    = "C:\calr\backend\data\vectors"
$env:CALR_MODEL  = "C:\calr\models\bge-m3"
$env:CALR_THREADS = "2"
.venv\Scripts\uvicorn.exe backend.app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

看到 `Application startup complete.` 就起来了。

**另开一个 PowerShell 验证**：

```powershell
# ① 服务活着
curl.exe -s http://127.0.0.1:8000/api/health

# ② 静态站点
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/

# ③ 数据库挂对了吗（这条最关键，返回 55 条才对，返回 4 条说明库没读对）
curl.exe -s http://127.0.0.1:8000/api/laws/CN-DATA-2021/articles | Select-Object -First 1

# ④ 模型加载了吗（ready 应为 true，model 应为 BAAI/bge-m3）
curl.exe -s http://127.0.0.1:8000/api/vectors

# ⑤ 语义检索能出结果
curl.exe -s "http://127.0.0.1:8000/api/search?q=%E6%95%B0%E6%8D%AE%E5%88%86%E7%B1%BB&mode=semantic&size=3"
```

**浏览器里再走一遍**：

- 打开 `http://127.0.0.1:8000/` → 首页正常
- 检索「数据分类」→ 点《数据安全法》→ **应看到 55 条、7 个章分组**
- 切英文 → 导航与正文变英文
- 切深色 → AI 页内容区也是深色

确认没问题后，**Ctrl+C 停掉**，进入下一步做成服务。

---

## 6. 做成开机自启的服务

Windows 上没有 systemd，用**任务计划程序**（系统自带，不用装 NSSM）。

### 6.1 写启动脚本

`C:\calr\start-calr.bat`：

```bat
@echo off
cd /d C:\calr
set CALR_DB=C:\calr\backend\data\calr.db
set CALR_VEC=C:\calr\backend\data\vectors
set CALR_MODEL=C:\calr\models\bge-m3
set CALR_THREADS=2
set CALR_RATE_PER_MIN=120
set CALR_RATE_BURST=30
".venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

### 6.2 注册任务

```powershell
$action  = New-ScheduledTaskAction -Execute "C:\calr\start-calr.bat"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) `
  -ExecutionTimeLimit (New-TimeSpan -Days 0)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "CALR" -Action $action -Trigger $trigger `
  -Settings $settings -Principal $principal -Description "CALR 法规数据库后端"
```

立即启动：

```powershell
Start-ScheduledTask -TaskName "CALR"
Start-Sleep 20
curl.exe -s http://127.0.0.1:8000/api/health
```

> `-ExecutionTimeLimit (New-TimeSpan -Days 0)` 是「不限时长」，不设的话任务 3 天后会被强杀。
> `-RestartCount 999 -RestartInterval 1分钟` 让它崩了自动拉起。

### 6.3 常用管理命令

```powershell
Start-ScheduledTask  -TaskName "CALR"      # 启动
Stop-ScheduledTask   -TaskName "CALR"      # 停止
Get-ScheduledTask    -TaskName "CALR" | Select State
Unregister-ScheduledTask -TaskName "CALR" -Confirm:$false   # 删除
```

**看日志**：任务计划程序 → CALR → 历史记录。
想看应用输出，可以把第 6.1 节的 bat 改成重定向：

```bat
".venv\Scripts\python.exe" -m uvicorn ... >> C:\calr\app.log 2>&1
```

---

## 7. 从公网访问

浏览器打开：

```
http://47.96.144.11:8000
```

**打不开的话按这个顺序查**：

| 检查 | 命令/位置 |
| :--- | :--- |
| 服务在跑吗 | `Get-ScheduledTask -TaskName "CALR" \| Select State` → `Running` |
| 本机能访问吗 | 服务器上 `curl.exe http://127.0.0.1:8000/api/health` |
| 端口在监听吗 | `netstat -ano \| findstr :8000` → 应有 `0.0.0.0:8000 LISTENING` |
| Windows 防火墙放了吗 | `Get-NetFirewallRule -DisplayName "CALR 8000"` |
| 安全组放了吗 | 阿里云控制台 → 安全组 → 入方向有 8000 |

---

## 8. 性能预期（2 核会比开发机慢）

开发机（8 核）实测：keyword 218 ms / semantic 268 ms / hybrid 520 ms。
你的 2 核机器按 **1.5–2 倍**估：

| 操作 | 预期 |
| :--- | :--- |
| 首页首屏 | 1–2 s |
| keyword 检索 | 300–500 ms |
| semantic 检索 | 500–800 ms |
| hybrid 检索 | 1–1.5 s |
| AI 问答 | 3–8 s |

**答辩演示够用**。如果觉得慢，`CALR_THREADS` 设成 2（已设），不要设更高。

---

## 9. 已知的数据现状（部署后也会是这样）

| 项 | 数值 |
| :--- | :--- |
| 数据库条文 | 564,579 |
| 向量覆盖条文 | 334,779 |
| **差** | **4,572** |

这 4,572 条是新抓/重抓进来的，**语义检索覆盖不到**，但**关键词检索与条文浏览完全正常**。
重建向量要 CPU 跑几小时，没必要为了答辩做。

---

## 10. 一句话流程

```
① 安全组 + Windows 防火墙 放行 8000
② 装 Python 3.12（勾 PATH）
③ 传 calr-runtime.tar.gz + calr-model.tar.gz → C:\calr → tar 解压
④ python -m venv .venv → pip install -r backend\requirements.txt（用阿里云镜像）
⑤ 手动起一次，跑 5 条 curl 验证
⑥ 写 start-calr.bat → 注册任务计划 → 开机自启
⑦ 浏览器开 http://47.96.144.11:8000
```

**总耗时**：传输占大头。OSS 中转约 10 分钟传完，RDP 直连视你上行带宽。
