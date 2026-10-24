/**
 * 页面冒烟测试（node + Edge headless）
 *
 * 为什么需要：
 *   现有的 8 个检查器（verify / verify-data / verify-fulltext / check-i18n …）全部只看数据层，
 *   抓不到渲染错误。这一轮我改出过 4 次故障，其中最严重的一次是
 *   ReferenceError: q is not defined —— 检索页整页白屏，而所有检查器全绿。
 *
 * 做什么：
 *   逐条打开每个路由，断言：
 *     ① 没有未捕获的 JS 错误（window.onerror / unhandledrejection）
 *     ② 页面没有出现「页面渲染出现异常」这类错误兜底
 *     ③ 关键元素存在（例如检索页要有筛选栏、详情页要有条文）
 *     ④ 页面不是一片空白（可见文字达到最低字数）
 *
 * 用法：
 *   node tools/smoke-test.js           # 全量
 *   node tools/smoke-test.js --quick   # 只测 4 条主要路由
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const EDGE = process.env.CALR_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.env.CALR_BASE || 'http://127.0.0.1:8000';
const QUICK = process.argv.indexOf('--quick') >= 0;

if (!fs.existsSync(EDGE)) {
  console.error('找不到 Edge: %s（可用 CALR_EDGE 环境变量指定）', EDGE);
  process.exit(2);
}

/* 每条路由：路径、名称、必备选择器、最少可见字数 */
const ROUTES = [
  { h: '#/', name: '首页', sel: ['.hero, .hero-lite'], minText: 200 },
  { h: '#/search?q=%E6%95%B0%E6%8D%AE', name: '检索', sel: ['#result-list, .empty'], minText: 150 },
  { h: '#/law/CN-DATA-2021', name: '法规详情', sel: ['#law-body', '.article'], minText: 300 },
  { h: '#/systems', name: '法律体系', sel: ['.card, .table'], minText: 100 },
  { h: '#/country/CN', name: '国别', sel: ['.law-item, .card'], minText: 100 },
  { h: '#/compare', name: '跨语言比对', sel: ['.page'], minText: 80 },
  { h: '#/terms', name: '术语', sel: ['.page'], minText: 80 },
  { h: '#/assistant', name: 'AI 问答', sel: ['.ai-layout'], minText: 80 },
  { h: '#/about', name: '关于', sel: ['.page'], minText: 200 },
  { h: '#/sources', name: '数据来源', sel: ['.page'], minText: 200 },
  { h: '#/no-such-page', name: '404', sel: ['.empty, .page'], minText: 20 }
];
const USE = QUICK ? [ROUTES[0], ROUTES[1], ROUTES[2], ROUTES[7]] : ROUTES;

const PROBE_JS = `
<script>
window.__smoke = { errs: [], rejections: [] };
window.addEventListener('error', function (e) {
  window.__smoke.errs.push(String(e.message).slice(0, 160));
});
window.addEventListener('unhandledrejection', function (e) {
  window.__smoke.rejections.push(String(e.reason).slice(0, 160));
});
setTimeout(function () {
  var body = (document.body.innerText || '');
  var r = {
    errs: window.__smoke.errs,
    rejections: window.__smoke.rejections,
    textLen: body.replace(/\\s+/g, '').length,
    // 错误兜底层
    errorBanner: /页面渲染出现异常|渲染失败|Something went wrong/i.test(body),
    sels: {},
    title: document.title,
    nodes: document.querySelectorAll('*').length
  };
  (window.__smokeSel || []).forEach(function (s) {
    r.sels[s] = document.querySelectorAll(s).length;
  });
  var b = document.createElement('b');
  b.id = '__smoke_result';
  b.textContent = JSON.stringify(r);
  document.body.appendChild(b);
}, 18000);
</script>`;

/**
 * 注意：选择器要注入到页面里才能统计，所以为每条路由单独生成一份探针 HTML，
 * 把 __smokeSel 提前写进去。
 */
function buildProbe() {
  const idx = path.join(ROOT, 'prototype/index.html');
  const html = fs.readFileSync(idx, 'utf8');
  const probePath = path.join(ROOT, 'prototype/__smoke.html');
  return { html, probePath };
}

function runOne(route, html, probePath) {
  const selJs = '<script>window.__smokeSel = ' + JSON.stringify(route.sel) + ';</script>';
  const out = html.replace('</head>', selJs + PROBE_JS + '</head>');
  fs.writeFileSync(probePath, out, 'utf8');
  const udd = fs.mkdtempSync(path.join(os.tmpdir(), 'calr_smoke_'));
  let dumped = '';
  try {
    dumped = execFileSync(EDGE, [
      '--headless', '--disable-gpu', '--no-first-run',
      '--force-device-scale-factor=1',
      '--user-data-dir=' + udd,
      '--virtual-time-budget=120000',
      '--window-size=1512,1000',
      '--dump-dom',
      BASE + '/__smoke.html' + route.h
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 180000,
         stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    return { ok: false, why: '打开页面失败: ' + String(e.message).slice(0, 120) };
  } finally {
    try { fs.rmSync(udd, { recursive: true, force: true }); } catch (e) {}
  }
  const m = dumped.match(/<b id="__smoke_result">([\s\S]*?)<\/b>/);
  if (!m) return { ok: false, why: '探针未返回（页面可能卡住或脚本报错）' };
  let d;
  try { d = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')); }
  catch (e) { return { ok: false, why: '探针数据解析失败' }; }

  const problems = [];
  if (d.errs && d.errs.length) problems.push('JS 错误 ' + d.errs.length + ' 条: ' + d.errs.slice(0, 2).join(' / '));
  if (d.rejections && d.rejections.length) problems.push('Promise 未捕获 ' + d.rejections.length + ' 条');
  if (d.errorBanner) problems.push('出现「页面渲染出现异常」兜底层');
  Object.keys(d.sels || {}).forEach(function (s) {
    if (d.sels[s] === 0) problems.push('缺少元素 ' + s);
  });
  if ((d.textLen || 0) < route.minText) problems.push('可见文字仅 ' + d.textLen + ' 字（要求 ≥ ' + route.minText + '）');
  return { ok: problems.length === 0, problems: problems, textLen: d.textLen, nodes: d.nodes };
}

/* ------------------------------------------------------------------ 主流程 */
const { html } = buildProbe();
const probePath = path.join(ROOT, 'prototype/__smoke.html');
let failed = 0;
function pad(v, n) { v = String(v); return v.length >= n ? v : v + ' '.repeat(n - v.length); }
console.log('页面冒烟测试（' + USE.length + ' 条路由' + (QUICK ? '，quick' : '') + '）');
console.log('');
USE.forEach(function (r) {
  const res = runOne(r, html, probePath);
  if (res.ok) {
    console.log('  ✓ ' + pad(r.name, 10) + ' ' + pad(r.h, 26) +
      ' 文字 ' + String(res.textLen).padStart(6) + ' 节点 ' + String(res.nodes).padStart(5));
  } else {
    failed++;
    console.log('  ✗ ' + pad(r.name, 10) + ' ' + pad(r.h, 26) + ' ' +
      (res.problems || [res.why]).join('；'));
  }
});
try { fs.unlinkSync(probePath); } catch (e) {}
console.log('');
if (failed) {
  console.log('===== 冒烟测试失败：' + failed + ' / ' + USE.length + ' =====');
  process.exit(1);
} else {
  console.log('===== 冒烟测试全部通过（' + USE.length + ' 条路由）=====');
}
