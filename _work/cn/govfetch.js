'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const PAGES = {
  'data-export': 'https://www.gov.cn/zhengce/2022-07/07/content_5728937.htm',
  'pipl-scc': 'https://www.gov.cn/zhengce/202311/content_6917770.htm',
  'business-env': 'https://www.gov.cn/zhengce/content/2019-10/23/content_5443963.htm'
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function get(url, redirects) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && (redirects || 0) < 5) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        return resolve(get(next, (redirects || 0) + 1));
      }
      const ch = []; res.on('data', c => ch.push(c));
      res.on('end', () => resolve({ s: res.statusCode, buf: Buffer.concat(ch) }));
    }).on('error', e => resolve({ s: 0, buf: Buffer.from(String(e)) }));
  });
}

(async () => {
  const dir = path.join(__dirname, 'html');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const [name, url] of Object.entries(PAGES)) {
    const r = await get(url, 0);
    fs.writeFileSync(path.join(dir, name + '.html'), r.buf);
    console.log(name, r.s, r.buf.length);
  }
})();
