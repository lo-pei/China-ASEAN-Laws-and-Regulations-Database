/**
 * 功能级验收测试（本地运行，需要后端在 8000）
 *
 * 与 smoke-test.js 的区别：
 *   smoke-test 只断言「页面能打开、没有 JS 错误、关键元素在」；
 *   本脚本断言「功能是真的对」——比如译文必须是英文而不是中文、
 *   条文目录必须有章分组、切语言后导航必须变、深色模式下 AI 页不能是白底。
 *
 * 用法：node tools/functional-test.js
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const EDGE = process.env.CALR_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.env.CALR_BASE || 'http://127.0.0.1:8000';

const CASES = [
  {
    name: '法规详情·中文（数据安全法 55 条 7 章）',
    url: '#/law/CN-DATA-2021',
    check: `(function(){
      var body = document.body.innerText || '';
      var m = body.match(/法规正文\\s*共\\s*(\\d+)\\s*条/);
      var law = CALR.store.law('CN-DATA-2021');
      return {
        条文数: m ? +m[1] : -1,
        章分组: document.querySelectorAll('.toc-group__name').length,
        目录合计: [].slice.call(document.querySelectorAll('.toc-group__count'))
                    .reduce(function(a,c){ return a + (parseInt(c.innerText,10)||0); }, 0),
        出现正在校核: /条文文本正在校核/.test(body),
        期望: '条文数=55, 章分组=7, 目录合计=55, 出现正在校核=false'
      };
    })()`,
    expect: { 条文数: 55, 章分组: 7, 目录合计: 55, 出现正在校核: false }
  },
  {
    name: '法规详情·英文（民法典译文必须是英文）',
    url: '#/law/CN-CIVILCODE-2020',
    lang: 'en',
    check: `(function(){
      var law = CALR.store.law('CN-CIVILCODE-2020');
      var a0 = law && law.articles && law.articles[0];
      var en = (a0 && a0.text && a0.text.en) || '';
      var hasZh = /[\\u4e00-\\u9fff]/.test(en);
      var lbl = document.querySelector('.article__lang-label--trans');
      var blk = lbl ? lbl.nextElementSibling : null;
      var pageEn = blk ? (blk.innerText || '').trim() : '';
      return {
        译文语种: en ? (hasZh ? '中文(错)' : '英文') : '空',
        译文前60: en.slice(0, 60),
        页面译文前60: pageEn.slice(0, 60),
        译文层已合并: (function(){ try { return CALR.fulltext.transMerged('CN-CIVILCODE-2020','en'); } catch(e){ return 'err'; } })(),
        期望: '译文语种=英文, 译文层已合并=true'
      };
    })()`,
    expect: { 译文语种: '英文', 译文层已合并: true }
  },
  {
    name: '检索·中文（有结果且条目合法）',
    url: '#/search?q=%E6%95%B0%E6%8D%AE%E5%88%86%E7%B1%A7',
    check: `(function(){
      var items = document.querySelectorAll('.law-item');
      var body = document.body.innerText || '';
      var m = body.match(/共\\s*([\\d,]+)\\s*条结果/);
      return {
        结果卡片: items.length,
        总条数: m ? m[1] : '(未显示)',
        出现渲染异常: /页面渲染出现异常/.test(body),
        侧栏: document.querySelectorAll('.col-filter .card').length,
        期望: '结果卡片>0, 出现渲染异常=false, 侧栏>=1'
      };
    })()`,
    expect: { 结果卡片: '>0', 出现渲染异常: false, 侧栏: '>=1' }
  },
  {
    name: '检索·英文（导航应全英文）',
    url: '#/search?q=civil',
    lang: 'en',
    check: `(function(){
      var nav = [].slice.call(document.querySelectorAll('.nav__item')).map(function(a){return a.innerText.trim();});
      var zhNav = nav.filter(function(t){ return /[\\u4e00-\\u9fff]/.test(t); });
      return {
        导航: nav.join(' | '),
        导航含中文项: zhNav.length,
        结果卡片: document.querySelectorAll('.law-item').length,
        期望: '导航含中文项=0, 结果卡片>0'
      };
    })()`,
    expect: { 导航含中文项: 0, 结果卡片: '>0' }
  },
  {
    name: '首页·英文（界面文案无中文残留）',
    url: '#/',
    lang: 'en',
    check: `(function(){
      var nodes = document.querySelectorAll('h1,h2,h3,h4,p,span,button,a,label,li');
      var zh = [];
      for (var i = 0; i < nodes.length && zh.length < 20; i++) {
        var n = nodes[i];
        if (!n.offsetParent) continue;
        var t = (n.innerText || '').trim();
        if (!t || t.length > 50) continue;
        if (!/[\\u4e00-\\u9fff]/.test(t)) continue;
        if (n.querySelector('*')) continue;
        zh.push(t.slice(0, 24));
      }
      return { 残留中文条数: zh.length, 样例: zh.slice(0, 3).join(' / '), 期望: '残留中文条数<=2（语言选择器里的「中文」本身算 1 条）' };
    })()`,
    expect: { 残留中文条数: '<=2' }
  },
  {
    name: 'AI 页·深色（内容区不能是白底）',
    url: '#/assistant',
    dark: true,
    check: `(function(){
      var el = document.querySelector('.ai-history');
      var cs = el ? getComputedStyle(el) : null;
      var bg = cs ? cs.backgroundColor : '(无元素)';
      var m = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
      var lum = m ? (+m[1] + +m[2] + +m[3]) / 3 : -1;
      return { 侧栏底色: bg, 亮度0到255: Math.round(lum), 期望: '亮度<90（深色）' };
    })()`,
    expect: { 亮度0到255: '<90' }
  },
  {
    name: '条款比对页',
    url: '#/compare',
    check: `(function(){
      var body = document.body.innerText || '';
      return { 文字长度: body.replace(/\\s+/g,'').length, 出现异常: /页面渲染出现异常/.test(body), 期望: '文字长度>300, 出现异常=false' };
    })()`,
    expect: { 文字长度: '>300', 出现异常: false }
  },
  {
    name: '术语页',
    url: '#/terms',
    check: `(function(){
      var body = document.body.innerText || '';
      return { 文字长度: body.replace(/\\s+/g,'').length, 术语卡: document.querySelectorAll('.term-card').length, 期望: '文字长度>1000, 术语卡>3' };
    })()`,
    expect: { 文字长度: '>1000', 术语卡: '>3' }
  }
];

function pad(v, n) { v = String(v); return v.length >= n ? v : v + ' '.repeat(n - v.length); }

function runOne(c, html, probePath) {
  const pre = [];
  if (c.dark) pre.push('<script>try{localStorage.setItem("calr.theme","dark");}catch(e){}</script>');
  const js = `
<script>
window.__t = { errs: [] };
window.addEventListener('error', function(e){ window.__t.errs.push(String(e.message).slice(0,120)); });
setTimeout(function(){
  var r;
  try { r = ${c.check}; } catch (e) { r = { 异常: String(e.message).slice(0, 120) }; }
  r.__errs = window.__t.errs;
  var b = document.createElement('b'); b.id = '__ft'; b.textContent = JSON.stringify(r);
  document.body.appendChild(b);
}, 22000);
</script>`;
  fs.writeFileSync(probePath, html.replace('</head>', pre.join('') + js + '</head>'), 'utf8');
  const udd = fs.mkdtempSync(path.join(os.tmpdir(), 'calr_ft_'));
  let dumped = '';
  try {
    dumped = execFileSync(EDGE, ['--headless', '--disable-gpu', '--no-first-run',
      '--force-device-scale-factor=1', '--user-data-dir=' + udd,
      '--virtual-time-budget=160000', '--window-size=1512,1000', '--dump-dom',
      BASE + '/__ft.html' + (c.lang ? ('?lang=' + c.lang) : '') +
      (c.url.charAt(0) === '#' ? c.url : '#' + c.url)],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 200000, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    return { ok: false, problems: ['打开失败: ' + String(e.message).slice(0, 100)] };
  } finally {
    try { fs.rmSync(udd, { recursive: true, force: true }); } catch (e) {}
  }
  const m = dumped.match(/<b id="__ft">([\s\S]*?)<\/b>/);
  if (!m) return { ok: false, problems: ['探针未返回'] };
  let d;
  try { d = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')); }
  catch (e) { return { ok: false, problems: ['探针解析失败'] }; }

  const problems = [];
  for (const k of Object.keys(c.expect)) {
    const want = c.expect[k];
    const got = d[k];
    if (want === false && got !== false) problems.push(k + ' 应为 false，实际 ' + got);
    else if (typeof want === 'number' && got !== want) problems.push(k + ' 应为 ' + want + '，实际 ' + got);
    else if (typeof want === 'string') {
      const mm = want.match(/^([<>]=?)(-?\d+)$/);
      if (mm) {
        const op = mm[1], num = +mm[2];
        const val = typeof got === 'number' ? got : NaN;
        const ok = op === '>' ? val > num : op === '>=' ? val >= num : op === '<' ? val < num : val <= num;
        if (!ok) problems.push(k + ' 应 ' + op + ' ' + num + '，实际 ' + got);
      } else if (want !== got) problems.push(k + ' 应为 ' + want + '，实际 ' + got);
    }
  }
  if (d.__errs && d.__errs.length) problems.push('JS 错误 ' + d.__errs.length + ' 条: ' + d.__errs[0]);
  return { ok: problems.length === 0, problems: problems, data: d };
}

const html = fs.readFileSync(path.join(ROOT, 'prototype/index.html'), 'utf8');
const probePath = path.join(ROOT, 'prototype/__ft.html');
let failed = 0;
console.log('功能级验收测试（' + CASES.length + ' 项）');
console.log('');
for (const c of CASES) {
  const r = runOne(c, html, probePath);
  if (r.ok) {
    console.log('  ✓ ' + c.name);
    const d = r.data || {};
    Object.keys(c.expect).forEach(function (k) {
      console.log('      ' + pad(k, 14) + ' = ' + JSON.stringify(d[k]));
    });
  } else {
    failed++;
    console.log('  ✗ ' + c.name);
    (r.problems || []).forEach(function (p) { console.log('      · ' + p); });
    if (r.data) console.log('      ' + JSON.stringify(r.data).slice(0, 300));
  }
}
try { fs.unlinkSync(probePath); } catch (e) {}
console.log('');
if (failed) { console.log('===== 功能测试失败：' + failed + ' / ' + CASES.length + ' ====='); process.exit(1); }
console.log('===== 功能测试全部通过（' + CASES.length + ' 项）=====');
