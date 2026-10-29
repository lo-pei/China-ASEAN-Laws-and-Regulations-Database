/* Prototype screenshot helper for the PDF deliverables (QA/local only).
   Usage: node shot_proto.js <index.html> <hash> <width> <height> <out.png> [clickSelectorsCsv] [waitAfterMs]
*/
'use strict';
const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [, , HTML, HASH, WIDTH, HEIGHT, OUT, CLICK, WAIT] = process.argv;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9551;

(async () => {
  if (!OUT) throw new Error('usage: node shot_proto.js <index.html> <hash> <w> <h> <out.png> [selectors] [waitMs]');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'calr-proto-'));
  const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--window-size=1440,1000', 'about:blank'],
  { stdio: 'ignore' });
  const cleanup = () => {
    try { child.kill(); } catch (_) {}
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  };
  try {
    let list;
    for (let i = 0; i < 80; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (res.ok) { list = await res.json(); if (list.length) break; }
      } catch (_) {}
      await sleep(150);
    }
    const page = list.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });
    let id = 0;
    const pending = new Map();
    const errors = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); p(m.result); }
      if (m.method === 'Runtime.exceptionThrown') errors.push('exception');
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error');
    });
    const send = (method, params = {}) => new Promise((res) => {
      const mid = ++id; pending.set(mid, res);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: Number(WIDTH), height: Number(HEIGHT), deviceScaleFactor: 1, mobile: Number(WIDTH) <= 480
    });
    const url = pathToFileURL(path.resolve(HTML)).href + (HASH || '');
    await send('Page.navigate', { url });
    await sleep(2800);
    if (CLICK) {
      for (const sel of CLICK.split(',').map((s) => s.trim()).filter(Boolean)) {
        const cr = await send('Runtime.evaluate', {
          expression: `(function(){var el=document.querySelector(${JSON.stringify(sel)}); if(el){el.click(); return 'clicked:'+el.textContent.slice(0,20);} return 'not-found';})()`,
          returnByValue: true
        });
        console.log('CLICK', sel, '=>', JSON.stringify(cr.result && cr.result.value));
        await sleep(800);
      }
      await sleep(Number(WAIT || 2000));
      const hr = await send('Runtime.evaluate', { returnByValue: true, expression: 'location.hash' });
      console.log('HASH AFTER', JSON.stringify(hr.result && hr.result.value));
    }
    if (process.env.PRE_JS) {
      await send('Runtime.evaluate', { expression: process.env.PRE_JS });
      await sleep(400);
    }
    // Headless 下 .page 的 fadeIn 可能一直停在 opacity:0，截图前强制结束动画
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('.page').forEach(function(el){el.style.animation='none';el.style.opacity='1';el.style.transform='none';})`
    });
    await sleep(350);
    const res = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(path.resolve(OUT), Buffer.from(res.data, 'base64'));
    const info = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `({url: location.hash, title: (document.querySelector('h1')||{}).textContent || '', errors: ${JSON.stringify(errors.length)}, scrollWidth: document.documentElement.scrollWidth, innerWidth: innerWidth})`
    });
    console.log(JSON.stringify({ out: path.basename(OUT), info: info.result.value }));
    ws.close();
  } finally {
    cleanup();
  }
})().catch((e) => { console.error('SHOT FAILED: ' + e.message); process.exit(1); });
