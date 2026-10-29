/* QA harness (not shipped): drives headless Edge over CDP to verify tabs, search,
   drawer, overflow and console errors, and to capture section screenshots.
   Run: node _work/_solution/qa/qa.js "D:\...\solution\index.html" */
'use strict';

const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const HTML = process.argv[2];
const QA_DIR = path.dirname(path.resolve(__filename));
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const errors = [];
const results = {};

function log(line) { console.log(line); }

async function waitPort() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch (_) { /* retry */ }
    await sleep(150);
  }
  throw new Error('DevTools port did not open');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    const cdp = new CDP(ws);
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && cdp.pending.has(msg.id)) {
        const p = cdp.pending.get(msg.id);
        cdp.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error.message));
        else p.resolve(msg.result);
        return;
      }
      const handler = cdp.listeners.get(msg.method);
      if (handler) handler(msg.params);
    });
    return cdp;
  }
  on(method, fn) { this.listeners.set(method, fn); }
  waitEvent(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout: ' + method)), timeout);
      this.on(method, (params) => { clearTimeout(timer); resolve(params); });
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const out = await this.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true, userGesture: true
    });
    if (out.exceptionDetails) {
      throw new Error('evaluate failed: ' + (out.exceptionDetails.text || '') +
        ' ' + JSON.stringify(out.exceptionDetails.exception || {}));
    }
    return out.result ? out.result.value : undefined;
  }
  async shot(file) {
    const res = await this.send('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: false
    });
    fs.writeFileSync(path.join(QA_DIR, file), Buffer.from(res.data, 'base64'));
    return file;
  }
  close() { try { this.ws.close(); } catch (_) { /* ignore */ } }
}

(async () => {
  if (!HTML) throw new Error('usage: node qa.js <abs index.html>');
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'calr-qa-'));
  const child = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--disable-extensions', '--mute-audio',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${userData}`,
    '--window-size=1440,1000', 'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = () => {
    try { child.kill(); } catch (_) { /* ignore */ }
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  };

  try {
    await waitPort();
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find((t) => t.type === 'page');
    if (!page) throw new Error('no page target');

    const cdp = await CDP.connect(page.webSocketDebuggerUrl);
    cdp.on('Runtime.exceptionThrown', (p) => {
      errors.push('exception: ' + (p.exceptionDetails && p.exceptionDetails.text));
    });
    cdp.on('Runtime.consoleAPICalled', (p) => {
      if (p.type === 'error' || p.type === 'assert') {
        errors.push('console.' + p.type + ': ' +
          (p.args || []).map((a) => a.value || a.description || a.type).join(' '));
      }
    });
    cdp.on('Log.entryAdded', (p) => {
      if (p.entry && p.entry.level === 'error') errors.push('log: ' + p.entry.text);
    });

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');

    const url = pathToFileURL(HTML).href;

    async function setViewport(width, height, mobile) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: 1,
        mobile: typeof mobile === 'boolean' ? mobile : width <= 480
      });
    }
    async function load() {
      const loaded = cdp.waitEvent('Page.loadEventFired');
      await cdp.send('Page.navigate', { url });
      await loaded;
      await sleep(2200);
    }

    async function scrollTo(id) {
      await cdp.evaluate(`(function(){var el=document.getElementById(${JSON.stringify(id)});if(!el)return false;el.scrollIntoView({behavior:'instant',block:'start'});return true;})()`);
      await sleep(900);
    }

    /* ---------- 1440: 首屏 ---------- */
    await setViewport(1440, 1200);
    await load();
    await cdp.shot('1440.png');

    results.desktop = await cdp.evaluate(`(function(){
      function rect(sel){var el=document.querySelector(sel);if(!el)return null;var r=el.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)};}
      return {
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        docHeight: document.documentElement.scrollHeight,
        heroStats: Array.prototype.map.call(document.querySelectorAll('.stat-num'), function(n){return n.textContent;}),
        barItems: document.querySelectorAll('#barChart .bar-item').length,
        chartTotal: document.getElementById('chartTotal').textContent,
        compareClauses: document.querySelectorAll('#compareGrid .clause').length,
        dims: document.querySelectorAll('#dimList li').length,
        qaText: (document.getElementById('qaCard').textContent||'').slice(0,40),
        qaMore: !!document.querySelector('#qaMore details'),
        termRows: document.querySelectorAll('#termsBody tr').length,
        searchResults: document.querySelectorAll('#resultList .result-card').length,
        searchStatus: (document.getElementById('searchStatus').textContent||'').trim(),
        tabs: Array.prototype.map.call(document.querySelectorAll('[role=tab]'), function(t){return t.getAttribute('aria-selected');}),
        panelsVisible: Array.prototype.filter.call(document.querySelectorAll('.tour-panel'), function(p){return !p.hidden;}).length,
        imgs: Array.prototype.map.call(document.images, function(i){return {src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,w:i.naturalWidth};}),
        metaSample: Array.prototype.map.call(document.querySelectorAll('[data-meta]'), function(n){return n.textContent;}).slice(0,8),
        activeNav: (document.querySelector('#navLinks a.is-active')||{}).textContent || null,
        progress: document.getElementById('navProgress').style.width
      };
    })()`);

    /* ---------- 分节截图 1440 ---------- */
    const sections = ['why', 'solution', 'product', 'data', 'tech', 'diff', 'scenarios', 'roadmap', 'team'];
    for (const id of sections) {
      await scrollTo(id);
      await cdp.shot('1440-' + id + '.png');
    }
    await cdp.evaluate(`window.scrollTo(0, document.documentElement.scrollHeight)`);
    await sleep(600);
    await cdp.shot('1440-footer.png');

    /* ---------- 产品 Tab 1..6 ---------- */
    await scrollTo('product');
    const tabShots = [];
    for (let i = 1; i <= 6; i++) {
      await cdp.evaluate(`document.querySelectorAll('[role=tab]')[${i - 1}].click()`);
      await sleep(700);
      tabShots.push(await cdp.shot('1440-tab-' + i + '.png'));
    }
    results.tabs = await cdp.evaluate(`(function(){
      var tabs=document.querySelectorAll('[role=tab]');
      var vis=Array.prototype.filter.call(document.querySelectorAll('.tour-panel'),function(p){return !p.hidden;});
      return {selected:Array.prototype.map.call(tabs,function(t){return t.getAttribute('aria-selected');}),
              visiblePanels:vis.length, visibleId:vis[0]&&vis[0].id,
              count:document.getElementById('tourCount').textContent};
    })()`);

    /* 键盘：← → Home End */
    results.keyboard = await cdp.evaluate(`(function(){
      var tabs=document.querySelectorAll('[role=tab]');
      tabs[0].focus();
      function press(key){var e=new KeyboardEvent('keydown',{key:key,bubbles:true,cancelable:true});tabs[document.activeElement===tabs[0]?0:0].dispatchEvent(e);}
      var out=[];
      tabs[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
      out.push(document.getElementById('tourCount').textContent);
      document.querySelectorAll('[role=tab]')[1].dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}));
      out.push(document.getElementById('tourCount').textContent);
      document.querySelectorAll('[role=tab]')[5].dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));
      out.push(document.getElementById('tourCount').textContent);
      return out;
    })()`);

    /* ---------- 现场试搜 ---------- */
    await scrollTo('livedemo');
    async function typeQuery(q) {
      await cdp.evaluate(`(function(){
        var input=document.getElementById('demoSearch');
        var setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
        setter.call(input, ${JSON.stringify(q)});
        input.dispatchEvent(new Event('input',{bubbles:true}));
      })()`);
      await sleep(450);
    }
    await typeQuery('民法典');
    results.searchCivil = await cdp.evaluate(`(function(){
      return {count:document.querySelectorAll('#resultList .result-card').length,
              first:(document.querySelector('.result-title')||{}).textContent,
              marks:document.querySelectorAll('#resultList mark').length,
              status:document.getElementById('searchStatus').textContent.trim()};
    })()`);
    await cdp.shot('1440-search-civil.png');

    await typeQuery('data');
    results.searchEn = await cdp.evaluate(`(function(){
      return {count:document.querySelectorAll('#resultList .result-card').length,
              titles:Array.prototype.map.call(document.querySelectorAll('.result-title'),function(n){return n.textContent;})};
    })()`);

    await typeQuery('越南');
    results.searchCountry = await cdp.evaluate(`document.querySelectorAll('#resultList .result-card').length`);

    await typeQuery('zzzz不存在');
    results.searchEmpty = await cdp.evaluate(`(function(){
      var e=document.querySelector('.result-empty');
      return {empty:!!e, title:e?e.querySelector('.empty-title').textContent:null,
              sugg:e?e.querySelectorAll('[data-query]').length:0};
    })()`);
    await cdp.shot('1440-search-empty.png');

    /* 快捷词 */
    await cdp.evaluate(`document.querySelector('#quickChips [data-query]').click()`);
    await sleep(400);
    results.quickChip = await cdp.evaluate(`(function(){
      return {value:document.getElementById('demoSearch').value,
              active:document.querySelectorAll('#quickChips .is-active').length,
              count:document.querySelectorAll('#resultList .result-card').length};
    })()`);

    /* 抽屉 */
    await cdp.evaluate(`document.querySelector('#resultList .result-hit').click()`);
    await sleep(600);
    results.drawer = await cdp.evaluate(`(function(){
      var l=document.getElementById('lawDrawer');
      return {open:!l.hidden, title:(document.getElementById('drawerTitle')||{}).textContent,
              rows:document.querySelectorAll('.drawer-meta > div').length,
              link:(document.querySelector('.drawer-actions a')||{}).getAttribute?document.querySelector('.drawer-actions a').getAttribute('href'):null,
              overflow:getComputedStyle(document.body).overflow};
    })()`);
    await cdp.shot('1440-drawer.png');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(400);
    results.drawerClosed = await cdp.evaluate(`document.getElementById('lawDrawer').hidden`);

    /* ---------- 768 ---------- */
    await setViewport(768, 1400);
    await load();
    await cdp.shot('768.png');
    results.tablet = await cdp.evaluate(`(function(){
      var rail=document.querySelector('.tour-rail');
      return {scrollWidth:document.documentElement.scrollWidth, innerWidth:window.innerWidth,
              navToggleVisible:getComputedStyle(document.getElementById('navToggle')).display!=='none',
              railOrientation:document.querySelector('[role=tablist]').getAttribute('aria-orientation'),
              railScroll:rail.scrollWidth, railClient:rail.clientWidth,
              bars:document.querySelectorAll('#barChart .bar-item').length};
    })()`);
    for (const id of ['product', 'data', 'diff', 'team']) {
      await scrollTo(id);
      await cdp.shot('768-' + id + '.png');
    }

    /* ---------- 390 ---------- */
    await setViewport(390, 844);
    await load();
    await cdp.shot('390.png');
    results.mobile = await cdp.evaluate(`(function(){
      var rail=document.querySelector('.tour-rail');
      return {scrollWidth:document.documentElement.scrollWidth, bodyScrollWidth:document.body.scrollWidth,
              innerWidth:window.innerWidth, railScroll:rail.scrollWidth, railClient:rail.clientWidth,
              minFontSize: (function(){var m=99;document.querySelectorAll('p,li,td,dd,dt').forEach(function(n){var s=parseFloat(getComputedStyle(n).fontSize);if(s<m)m=s;});return m;})()};
    })()`);
    results.mobile.assertNoHScroll = results.mobile.scrollWidth <= results.mobile.innerWidth + 1;
    /* 移动端菜单 */
    await cdp.evaluate(`document.getElementById('navToggle').click()`);
    await sleep(500);
    await cdp.shot('390-nav-open.png');
    results.mobileMenu = await cdp.evaluate(`(function(){
      var nav=document.getElementById('siteNav');
      return {open:nav.classList.contains('is-open'), expanded:document.getElementById('navToggle').getAttribute('aria-expanded')};
    })()`);
    await cdp.evaluate(`document.getElementById('navToggle').click()`);
    await sleep(300);

    for (const id of ['why', 'solution', 'product', 'livedemo', 'data', 'tech', 'diff', 'scenarios', 'roadmap', 'team']) {
      await scrollTo(id);
      await cdp.shot('390-' + id + '.png');
    }
    await cdp.evaluate(`window.scrollTo(0, document.documentElement.scrollHeight)`);
    await sleep(600);
    await cdp.shot('390-footer.png');

    /* 移动端横向溢出：逐节检查 */
    results.mobileOverflow = await cdp.evaluate(`(function(){
      var bad=[];var vw=window.innerWidth;
      document.querySelectorAll('section[id], footer, .tour-panel, .livedemo, .chart-card, .code-block, .diff-table').forEach(function(n){
        var r=n.getBoundingClientRect();
        if(r.width>vw+1||n.scrollWidth>n.clientWidth+1) bad.push((n.id||n.className)+' w='+Math.round(r.width)+' sw='+n.scrollWidth+' cw='+n.clientWidth);
      });
      return bad;
    })()`);

    /* ---------- 390 桌面仿真（mobile:false，排除 viewport meta 干扰） ---------- */
    await setViewport(390, 1800, false);
    await load();
    await cdp.shot('390-desktop.png');
    results.narrow = await cdp.evaluate(`(function(){
      var vw=window.innerWidth, sw=document.documentElement.scrollWidth;
      var of=[];
      document.querySelectorAll('body *').forEach(function(n){
        var r=n.getBoundingClientRect();
        if((r.right>vw+1.5||r.left<-1.5) && !n.closest('.tour-rail')){
          of.push(n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+'.'+(typeof n.className==='string'?n.className.trim().split(/\\s+/).join('.'):''));
        }
      });
      return {innerWidth:vw, scrollWidth:sw, assertNoHScroll: sw<=vw+1, offendersNotInRail:of.slice(0,10)};
    })()`);

    /* ---------- 375 / 360 / 320 边界 ---------- */
    results.narrowWidths = [];
    for (const w of [375, 360, 320]) {
      await setViewport(w, 1400, true);
      await load();
      results.narrowWidths.push(await cdp.evaluate(`(function(){
        return {w:window.innerWidth, sw:document.documentElement.scrollWidth,
                ok:document.documentElement.scrollWidth<=window.innerWidth+1};
      })()`));
    }

    log('\n=== ASSERTIONS ===');
    log('1440 no horizontal overflow: ' + (results.desktop.scrollWidth <= results.desktop.innerWidth + 1));
    log('768  no horizontal overflow: ' + (results.tablet.scrollWidth <= results.tablet.innerWidth + 1));
    log('390  (mobile emulation)    : ' + results.mobile.assertNoHScroll + ' (scrollWidth=' + results.mobile.scrollWidth + ', innerWidth=' + results.mobile.innerWidth + ')');
    log('390  (desktop emulation)   : ' + results.narrow.assertNoHScroll + ' (scrollWidth=' + results.narrow.scrollWidth + ', innerWidth=' + results.narrow.innerWidth + ')');
    log('offenders outside rail     : ' + JSON.stringify(results.narrow.offendersNotInRail));
    log('narrow sweep               : ' + results.narrowWidths.map(function(n){return n.w + 'px:' + (n.ok ? 'ok' : 'OVERFLOW ' + n.sw);}).join(', '));

    cdp.close();
    log('\n=== RESULTS ===');
    log(JSON.stringify(results, null, 1));
    log('\n=== CONSOLE ERRORS ===');
    log(errors.length ? errors.join('\n') : '(none)');
  } finally {
    cleanup();
  }
})().catch((err) => {
  console.error('QA FAILED: ' + err.message);
  process.exit(1);
});
