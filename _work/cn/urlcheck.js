'use strict';
/* 最终自检：sourceUrl 可回访性（HTTP 200 + 内容长度） */
const fs = require('fs');
const vm = require('vm');
const https = require('https');
const path = require('path');

const c = { window: {} };
vm.createContext(c);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../../prototype/data/fulltext/cn.js'), 'utf8'), c);
const m = c.window.CALR_FULLTEXT;

function head(url) {
  return new Promise(r => {
    const rq = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return r(head(new URL(res.headers.location, url).href));
      }
      let n = 0;
      res.on('data', d => { n += d.length; });
      res.on('end', () => r({ s: res.statusCode, n }));
    });
    rq.on('error', e => r({ s: 0, n: 0, e: e.message }));
    rq.setTimeout(15000, () => { rq.destroy(); r({ s: -1, n: 0, e: 'timeout' }); });
  });
}

(async () => {
  let bad = 0;
  for (const id of Object.keys(m)) {
    const r = await head(m[id].sourceUrl);
    const ok = r.s === 200 && r.n > 1000;
    if (!ok) bad++;
    console.log((ok ? 'PASS' : 'FAIL') + '  ' + id + '  http=' + r.s + '  bytes=' + r.n);
  }
  console.log('FAILED=' + bad);
})();
