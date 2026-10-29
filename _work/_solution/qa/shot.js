/* True-viewport screenshot helper (QA only, not shipped).
   Chromium on Windows clamps headless windows to ~496 CSS px, so
   `msedge --headless --window-size=390,...` renders a 496px layout and then
   crops the PNG to 390px — which looks like horizontal overflow. This helper
   uses DevTools device emulation instead, so the layout viewport is exactly
   the requested width.

   Usage:
     node shot.js <abs/index.html> <width> <height> <out.png> [sectionId] [scrollY]
*/
'use strict';
const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [, , HTML, WIDTH, HEIGHT, OUT, SECTION, SCROLLY] = process.argv;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9550;

(async () => {
  if (!OUT) throw new Error('usage: node shot.js <index.html> <w> <h> <out.png> [sectionId] [scrollY]');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'calr-shot-'));
  const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--window-size=1440,1000', 'about:blank'],
  { stdio: 'ignore' });
  const cleanup = () => {
    try { child.kill(); } catch (_) { /* ignore */ }
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  };
  try {
    let list;
    for (let i = 0; i < 80; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (res.ok) { list = await res.json(); if (list.length) break; }
      } catch (_) { /* retry */ }
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
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); p(m.result); }
    });
    const send = (method, params = {}) => new Promise((res) => {
      const mid = ++id; pending.set(mid, res);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    const FULL = String(HEIGHT).toLowerCase() === 'full';
    await send('Emulation.setDeviceMetricsOverride', {
      width: Number(WIDTH), height: FULL ? 1800 : Number(HEIGHT), deviceScaleFactor: 1,
      mobile: Number(WIDTH) <= 480
    });
    await send('Page.navigate', { url: pathToFileURL(path.resolve(HTML)).href });
    await sleep(2600);
    if (SECTION) {
      await send('Runtime.evaluate', {
        expression: `document.getElementById(${JSON.stringify(SECTION)}).scrollIntoView({behavior:'instant',block:'start'})`
      });
      await sleep(900);
    } else if (SCROLLY) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${Number(SCROLLY)})` });
      await sleep(700);
    }
    const res = await send('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: FULL
    });
    fs.writeFileSync(path.resolve(OUT), Buffer.from(res.data, 'base64'));
    const info = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, innerHeight: innerHeight})`
    });
    console.log(JSON.stringify({ out: path.basename(OUT), requested: [Number(WIDTH), Number(HEIGHT)], actual: info.result.value }));
    ws.close();
  } finally {
    cleanup();
  }
})().catch((e) => { console.error('SHOT FAILED: ' + e.message); process.exit(1); });
