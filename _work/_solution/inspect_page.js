'use strict';
const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [, , HTML, HASH] = process.argv;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9552;
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'calr-inspect-'));
  const child = spawn(EDGE, ['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${PORT}`,`--user-data-dir=${dir}`,'--window-size=1440,1000','about:blank'], { stdio: 'ignore' });
  const cleanup = () => { try { child.kill(); } catch (_) {} spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); };
  try {
    let list;
    for (let i = 0; i < 80; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); if (r.ok) { list = await r.json(); if (list.length) break; } } catch (_) {} await sleep(150); }
    const page = list.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res, {once:true}); ws.addEventListener('error', rej, {once:true}); });
    let id = 0; const pending = new Map();
    ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); p(m.result); } });
    const send = (method, params={}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({id:mid,method,params})); });
    await send('Page.enable'); await send('Runtime.enable');
    await send('Page.navigate', { url: pathToFileURL(path.resolve(HTML)).href + HASH });
    await sleep(3000);
    const r = await send('Runtime.evaluate', { returnByValue: true, expression: `(function(){
      var pg=document.querySelector('.page');
      var cs=pg?getComputedStyle(pg):null;
      var fixed=[].slice.call(document.querySelectorAll('body *')).filter(function(el){var s=getComputedStyle(el);return (s.position==='fixed'||s.position==='absolute') && parseFloat(s.opacity)>0.01 && el.getBoundingClientRect().width>window.innerWidth*0.8 && el.getBoundingClientRect().height>window.innerHeight*0.5;}).slice(0,8).map(function(el){var s=getComputedStyle(el);return {cls:String(el.className).slice(0,80),pos:s.position,op:s.opacity,bg:s.backgroundColor,z:s.zIndex};});
      return {bodyClass:document.body.className, pageOpacity:cs&&cs.opacity, animation:cs&&cs.animationName, animDur:cs&&cs.animationDuration, playState:cs&&cs.animationPlayState, fixed:fixed, htmlOpacity:getComputedStyle(document.documentElement).opacity, bodyOpacity:getComputedStyle(document.body).opacity, overlay:[].slice.call(document.querySelectorAll('[class*=mask],[class*=overlay],[class*=loading],[class*=drawer]')).map(function(el){return {cls:String(el.className).slice(0,60),op:getComputedStyle(el).opacity,disp:getComputedStyle(el).display};}).slice(0,10)};
    })()` });
    console.log(JSON.stringify(r.result.value, null, 1));
    ws.close();
  } finally { cleanup(); }
})().catch(e => { console.error('FAIL', e.stack); process.exit(1); });
