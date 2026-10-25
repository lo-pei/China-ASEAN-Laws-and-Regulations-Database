# CALR 阿里云 Windows 服务器完整部署指南（终极避坑版）

## 环境信息

- **操作系统**：Windows Server 2022 Datacenter (纯净版)
- **配置**：2 vCPU / 8 GB 内存（纯 CPU 推理）
- **部署目录**：`C:\calr`
- **服务端口**：`8000`

------

## 核心避坑指南（⚠️ 必读）

1. **路径带中文**：本地拷文件时，如果路径包含中文或空格，PowerShell 命令里**必须加双引号**。
2. **Python 环境变量**：安装时**必须勾选** `Add python.exe to PATH`，否则命令全报错。
3. **中文编码报错**：装依赖前必须执行 `$env:PYTHONUTF8=1`，否则 pip 读文件会触发 GBK 报错。
4. **AI 模型加载失败（DLL缺失）**：**不要用** `onnxruntime-directml`，必须卸载换成纯 CPU 版 `onnxruntime`，并安装微软 VC++ 运行库。
5. **服务占用端口**：重新部署前，必须先 `Stop-ScheduledTask` 并杀进程，否则解压覆盖会失败。

------

## 第 1 步：开放端口（极其关键！）

必须同时开放**阿里云安全组**和**Windows 防火墙**。

### 1.1 阿里云安全组

1. 登录阿里云控制台 → 云服务器 ECS → 安全组 → 配置规则。
2. 在 **“入方向”** 点击 **“增加规则”**：
   - 协议类型：自定义 TCP
   - 端口范围：`8000/8000`
   - 授权对象：`0.0.0.0/0`

### 1.2 Windows 防火墙

在服务器上以**管理员身份**打开 PowerShell，执行：

powershell

```
New-NetFirewallRule -DisplayName "CALR 8000" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
```



------

## 第 2 步：安装 Python 3.12

> ⚠️ **绝对避坑**：用华为云镜像下载，别去官网死等！

1. 浏览器打开下载：
   `https://mirrors.huaweicloud.com/python/3.12.9/python-3.12.9-amd64.exe`

2. 双击安装，**第一屏必须勾选** 👉 **`Add python.exe to PATH`** 👈，然后点击 `Install Now`。

3. 安装完重新打开 PowerShell，验证：

   powershell

   ```
   python --version
   pip --version
   ```

   

------

## 第 3 步：传输文件与完整性校验

> 使用 RDP 的本地磁盘映射传输。

1. 本地电脑打开 `mstsc`，输入 IP，点击 **“显示选项”** → **“本地资源”** → **“详细信息”** → 勾选本地 D 盘 → **“连接”**。

2. 在服务器上新建目录：

   powershell

   ```
   New-Item -ItemType Directory C:\calr -Force
   ```

   

3. 复制文件（带中文的路径必须加引号）：

   powershell

   ```
   Copy-Item "\\tsclient\D\A项目\Database_China–ASEAN Laws and Regulations Database\_out\calr-runtime.tar.gz" C:\calr\ -Force
   Copy-Item "\\tsclient\D\A项目\Database_China–ASEAN Laws and Regulations Database\_out\calr-model.tar.gz"   C:\calr\ -Force
   ```

   

4. **务必校验 Hash（防丢包损坏）**：

   powershell

   ```
   Get-FileHash C:\calr\calr-runtime.tar.gz -Algorithm SHA256
   Get-FileHash C:\calr\calr-model.tar.gz -Algorithm SHA256
   ```

   

------

## 第 4 步：解压与模型完整性检查

1. 解压代码包：

   powershell

   ```
   cd C:\calr
   tar -xzf calr-runtime.tar.gz
   ```

   

2. 解压模型包：

   powershell

   ```
   mkdir models
   tar -xzf calr-model.tar.gz -C models
   ```

   

3. **关键检查**：

   powershell

   ```
   Get-ChildItem C:\calr\models\bge-m3 | Select Name, @{n='MB';e={[math]::Round($_.Length/1MB,1)}}
   ```

   

   *必须看到 `model.onnx_data` (2161.8 MB)，少了这个 AI 就用不了。*

------

## 第 5 步：安装依赖（防编码报错）

1. 建虚拟环境并激活：

   powershell

   ```
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

   

2. **强制开启 UTF-8 模式（避大坑）**：

   powershell

   ```
   $env:PYTHONUTF8=1
   ```

   

3. 用阿里云镜像安装（依赖包比较多，耐心等）：

   powershell

   ```
   pip install -r backend\requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
   ```

   

------

## 第 6 步：修复 AI 引擎（解决 500 与 DLL 缺失报错）

> 服务器没显卡，原先的 `onnxruntime-directml` 会报 `DLL load failed`。

1. **卸载错误的包，换纯 CPU 版**：

   powershell

   ```
   pip uninstall onnxruntime-directml -y
   pip install onnxruntime -i https://mirrors.aliyun.com/pypi/simple/
   ```

   

2. **补装微软 VC++ 运行库**（必做，否则依然缺 DLL）：
   浏览器下载并安装：`https://aka.ms/vs/17/release/vc_redist.x64.exe`

------

## 第 7 步：创建一键启动脚本

在 `C:\calr` 下新建 `start-calr.bat`，内容如下：

bat

```
@echo off
cd /d C:\calr
set CALR_DB=C:\calr\backend\data\calr.db
set CALR_VEC=C:\calr\backend\data\vectors
set CALR_MODEL=C:\calr\models\bge-m3
set CALR_THREADS=2
".venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 1
```



------

## 第 8 步：配置开机自启（Windows 任务计划）

> 必须做！否则关了远程桌面，服务就停了。

以**管理员身份**打开 PowerShell，执行：

powershell

```
$action  = New-ScheduledTaskAction -Execute "C:\calr\start-calr.bat"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 999 `
  -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit (New-TimeSpan -Days 0)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "CALR" -Action $action -Trigger $trigger -Settings $settings -Principal $principal
Start-ScheduledTask -TaskName "CALR"
```



------

## 第 9 步：终极验证

等 20 秒后，执行以下验证：

**① 健康检查（数据库是否最新）：**

powershell

```
curl.exe -s http://127.0.0.1:8000/api/health
```



*(看 `builtAt` 时间，且 `articles` 应为 339351)*

**② 向量引擎状态（必须全绿）：**

powershell

```
curl.exe -s http://127.0.0.1:8000/api/vectors
```



*(看 `"ready": true`，且 `"modelError": null`)*

**③ AI 语义检索测试（最关键）：**

powershell

```
curl.exe -s -X POST http://127.0.0.1:8000/api/qa -H "Content-Type: application/json" -d '{\"question\":\"数据合规\",\"topk\":3}'
```



*(必须返回 `"mode":"article-vector"` 并且分数 `score` 有具体数值)*

------

## 附录：日常维护与排错

- **改代码/打补丁后重启**：

  powershell

  ```
  Stop-ScheduledTask -TaskName "CALR"
  # ... 解压补丁 ...
  Start-ScheduledTask -TaskName "CALR"
  ```

  

- **确认服务在跑**：`Get-ScheduledTask -TaskName "CALR" | Select State`（应为 `Running`）

- **如果服务起不来**：查 `netstat -ano | findstr :8000`，如果被占用，用 `Stop-Process -Id <PID> -Force` 杀掉。

- **前端页面没更新**：强制按 `Ctrl + F5` 刷新浏览器缓存。

|      |      |
| :--- | :--- |
|      |      |
|      |      |
|      |      |
|      |      |
|      |      |