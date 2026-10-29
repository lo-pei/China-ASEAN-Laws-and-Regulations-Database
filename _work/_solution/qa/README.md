# QA 资产（不提交，`_work/` 已忽略）

本目录只放自检产物与自检脚本，**不属于交付物**。交付物只有 `solution/index.html`、`solution/assets/css/solution.css`、`solution/assets/js/solution.js`。

## 1. 重要：Windows 上 `msedge --headless --window-size=390` 会裁切

Chromium 在 Windows 上把无头窗口的**最小宽度钳制在 ~496 CSS px**。所以：

```powershell
msedge --headless --window-size=390,1800 --screenshot=390.png ".../solution/index.html"
```

实际布局视口是 **496px**，截图只截取左侧 390px → 右侧 106px 被裁掉，看起来像「页面在 390 横向溢出」，其实是截图工具的问题。

证据（`probe.js` 实测）：

| 请求 | 实际 innerWidth | docScrollWidth | 结论 |
| :--- | ---: | ---: | :--- |
| `--window-size=390,1800`（legacy headless） | 496 | 496 | 视口被钳制，无横向溢出 |
| `--window-size=390,1800`（`--headless=new`） | 496 | 496 | 同上 |
| `--window-size=1440,1200` | 1414 | 1414 | 无横向溢出 |

## 2. 正确做法：用 DevTools 设备仿真抓「真 390」

```powershell
# 单张：<html> <宽> <高> <输出> [章节 id] [scrollY]
node _work/_solution/qa/shot.js "D:\...\solution\index.html" 390 1800 "D:\...\qa\390-true.png"
node _work/_solution/qa/shot.js "D:\...\solution\index.html" 390 1800 "D:\...\qa\390-true-product.png" product

# 全页长图（高度传 full）
node _work/_solution/qa/shot.js "D:\...\solution\index.html" 1440 full "D:\...\qa\1440-tall.png"
```

`shot.js` 用 `Emulation.setDeviceMetricsOverride` 把布局视口设为精确宽度，因此截图与布局 1:1。

## 3. 交互 / 溢出 / 控制台自检

```powershell
node _work/_solution/qa/qa.js "D:\...\solution\index.html"
```

最近一次输出（2026-10-25）：

```
=== ASSERTIONS ===
1440 no horizontal overflow: true
768  no horizontal overflow: true
390  (mobile emulation)    : true (scrollWidth=390, innerWidth=390)
390  (desktop emulation)   : true (scrollWidth=390, innerWidth=390)
offenders outside rail     : []
narrow sweep               : 375px:ok, 360px:ok, 320px:ok

=== CONSOLE ERRORS ===
(none)
```

同一次输出里还验证了：6 个 Tab（点击 + ←→/Home/End 键盘）、现场试搜（民法典 5 条 / data 6 条 / 越南 2 条 / 空态 4 条建议）、快捷词、详情抽屉（打开 + Esc 关闭 + deep link `../prototype/index.html#/law/<id>`）、移动端菜单、12 国条形图、比对 2 段真实法条 + 5 个维度、问答 2 例、术语 5 行。

## 4. 截图清单

| 文件 | 说明 |
| :--- | :--- |
| `1440.png` / `768.png` / `390.png` | 首屏，真 1440 / 768 / 390（设备仿真） |
| `1440-tall.png`（1440×12888）、`390-tall.png`（390×21570） | 全页长图 |
| `1440-<section>.png`、`768-*.png`、`390-*.png` | 逐节截图 |
| `1440-tab-1…6.png` | 六个产品 Tab |
| `390-true*.png` | 真 390 补充图（首屏 / 产品 / 差异 / 团队） |
| `1440-search-civil.png`、`1440-search-empty.png`、`1440-drawer.png` | 试搜（有结果 / 空态）、详情抽屉 |
| `390-nav-open.png` | 移动端导航展开 |
| `artifact-cli-390-cropped.png` | **反例**：CLI `--window-size=390` 的 496px 布局被裁成 390px 的产物 |

## 5. 脚本说明

- `qa.js`：CDP 驱动自检 + 全量截图（含断言与控制台错误收集）。
- `shot.js`：任意宽度单张 / 全页截图（设备仿真）。
- `probe.js`：探测 `--window-size` 的真实视口与越界元素，用于定位 390 裁切问题。
