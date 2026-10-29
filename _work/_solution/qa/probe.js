/* Probe: what viewport does a raw `msedge --headless --window-size=W,H --screenshot`
   invocation actually use, and does the page overflow it? (QA only, not shipped) */
'use strict';
const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const HTML = process.argv[2];
const WIDTH = Number(process.argv[3] || 390);
const HEIGHT = Number(process.argv[4] || 1800);
const HIDE = process.argv[5] === 'hide';
const EXTRA = (process.argv[6] || '').split(',').filter(Boolean);
const MODE = process.env.PROBE_MODE || 'legacy';
const PORT = 9444 + (HIDE ? 1 : 0) + EXTRA.length + (MODE === 'new' ? 2 : 0);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'calr-probe-'));
  const args = [MODE === 'new' ? '--headless=new' : '--headless', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${dir}`, `--window-size=${WIDTH},${HEIGHT}`];
  if (HIDE) args.push('--hide-scrollbars');
  for (const extra of EXTRA) args.push(extra);
  args.push('about:blank');
  const child = spawn(EDGE, args, { stdio: 'ignore' });
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
    await send('Page.navigate', { url: pathToFileURL(HTML).href });
    await sleep(3500);
    const out = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(function(){
        var vw = window.innerWidth, vh = window.innerHeight;
        var offenders = [];
        document.querySelectorAll('body *').forEach(function(n){
          var r = n.getBoundingClientRect();
          if (r.right > vw + 1.5 || r.left < -1.5) {
            offenders.push((n.tagName.toLowerCase()) + (n.id ? '#'+n.id : '') + (n.className && typeof n.className === 'string' ? '.'+n.className.trim().split(/\\s+/).join('.') : '') + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + ']');
          }
        });
        return {innerWidth:vw, innerHeight:vh, dpr:window.devicePixelRatio,
          docScrollWidth:document.documentElement.scrollWidth,
          bodyScrollWidth:document.body.scrollWidth,
          docClientWidth:document.documentElement.clientWidth,
          brandNameVisible:getComputedStyle(document.querySelector('.brand-name')).display!=='none',
          heroH1Font:getComputedStyle(document.querySelector('.hero h1')).fontSize,
          offenders:offenders.slice(0, 25),
          offenderCount:offenders.length};
      })()`
    });
    console.log(JSON.stringify({ hideScrollbars: HIDE, requested: [WIDTH, HEIGHT], result: out.result.value }, null, 1));
    ws.close();
  } finally {
    cleanup();
  }
})().catch((e) => { console.error('PROBE FAILED ' + e.message); process.exit(1); });
