'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'raw');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
let lastCall = 0;
const MIN_GAP = 2500;
const COOKIES = {};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cookieHeader() {
  const ks = Object.keys(COOKIES);
  return ks.length ? ks.map(k => k + '=' + COOKIES[k]).join('; ') : null;
}

function raw(method, p, body, extraHeaders) {
  return new Promise(resolve => {
    const h = Object.assign({
      'User-Agent': UA,
      'Referer': 'https://flk.npc.gov.cn/',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Origin': 'https://flk.npc.gov.cn'
    }, extraHeaders || {});
    const ck = cookieHeader();
    if (ck) h['Cookie'] = ck;
    let d = null;
    if (body !== undefined && body !== null) {
      d = typeof body === 'string' ? body : JSON.stringify(body);
      h['Content-Type'] = h['Content-Type'] || 'application/json;charset=UTF-8';
      h['Content-Length'] = Buffer.byteLength(d);
    }
    const rq = https.request({ hostname: 'flk.npc.gov.cn', path: p, method, headers: h }, res => {
      const sc = res.headers['set-cookie'];
      if (sc) sc.forEach(c => { const m = /^([^=]+)=([^;]*)/.exec(c); if (m) COOKIES[m[1]] = m[2]; });
      const ch = []; res.on('data', c => ch.push(c));
      res.on('end', () => resolve({ s: res.statusCode, buf: Buffer.concat(ch), headers: res.headers }));
    });
    rq.on('error', e => resolve({ s: 0, buf: Buffer.from(String(e)), headers: {} }));
    if (d) rq.write(d);
    rq.end();
  });
}

/* throttled request with WAF-cookie handling and retries */
async function req(method, p, body, opt) {
  opt = opt || {};
  const tries = opt.tries || 6;
  for (let i = 0; i < tries; i++) {
    const gap = (i === 0 ? 800 : MIN_GAP) - (Date.now() - lastCall);
    if (gap > 0) await sleep(gap);
    lastCall = Date.now();
    const r = await raw(method, p, body);
    const head = r.buf.slice(0, 200).toString('utf8');
    if (r.s === 307 || (r.s === 200 && /307 Temporary/.test(head))) {
      await sleep(600 + i * 600);
      continue; /* cookie now stored; retry same method+body */
    }
    const bad = r.s === 502 || r.s === 503 || r.s === 429 || /CWAP-waf|502 Bad|503 Service/.test(head);
    if (!bad) return r;
    await sleep(3000 + i * 4000);
  }
  return raw(method, p, body);
}

async function search(title, pageSize, searchType) {
  const r = await req('POST', '/law-search/highSearch/highSearch', {
    dataList: [{ fieldName: 'title', values: [title], link: 0, searchType: searchType || 1 }],
    orderByParam: { order: 'gbrq', sort: 'DESC' },
    pageNum: 1, pageSize: pageSize || 10
  });
  let j;
  try { j = JSON.parse(r.buf.toString('utf8')); } catch (e) { return { err: 'non-json:' + r.buf.toString('utf8').slice(0, 60) }; }
  return { total: j.total, rows: (j.rows || []).map(x => ({ bbbs: x.bbbs, title: (x.title || '').replace(/<[^>]*>/g, ''), gbrq: x.gbrq, sxrq: x.sxrq, flxz: x.flxz, zdjgName: x.zdjgName, sxx: x.sxx })) };
}

async function details(bbbs) {
  const r = await req('GET', '/law-search/search/flfgDetails?bbbs=' + bbbs);
  try { return JSON.parse(r.buf.toString('utf8')); } catch (e) { return { code: 0, raw: r.buf.toString('utf8').slice(0, 200) }; }
}

async function download(ossPath, file) {
  const r = await req('GET', '/law-search/file/download?filePath=' + encodeURIComponent(ossPath));
  if (r.s === 200 && r.buf.length > 2000 && r.buf[0] === 0x50 && r.buf[1] === 0x4B) {
    fs.writeFileSync(path.join(OUT, file), r.buf); return r.buf.length;
  }
  return 0;
}

module.exports = { req, search, details, download, sleep, OUT, raw };
