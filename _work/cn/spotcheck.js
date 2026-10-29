'use strict';
/* 抽查：重新抓取 sourceUrl，与已录入正文逐字比对首条/末条 */
const fs = require('fs');
const vm = require('vm');
const https = require('https');
const zlib = require('zlib');
const path = require('path');
const { readDocx, paragraphs } = require('./docx');
const { parseArticles } = require('./parse');
const { toText } = require('./htmltext');

const UA = 'Mozilla/5.0';
function getBuf(url) {
  return new Promise(r => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return r(getBuf(new URL(res.headers.location, url).href));
      }
      const ch = []; res.on('data', c => ch.push(c));
      res.on('end', () => r(Buffer.concat(ch)));
    }).on('error', e => r(Buffer.from('ERR')));
  });
}

const c = { window: {} };
vm.createContext(c);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../../prototype/data/fulltext/cn.js'), 'utf8'), c);
const m = c.window.CALR_FULLTEXT;

(async () => {
  const ids = process.argv.slice(2);
  const list = ids.length ? ids : ['CN-CIVILCODE-2020', 'CN-FIL-2019'];
  for (const id of list) {
    const e = m[id];
    const buf = await getBuf(e.sourceUrl);
    const dir = path.join(__dirname, 'recheck');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let fresh;
    if (buf.slice(0, 2).toString() === 'PK') {
      const f = path.join(dir, id + '.docx');
      fs.writeFileSync(f, buf);
      fresh = parseArticles(paragraphs(readDocx(f)), {});
    } else {
      const f = path.join(dir, id + '.html');
      fs.writeFileSync(f, buf);
      fresh = parseArticles(toText(buf.toString('utf8')).split('\n'), {});
    }
    const a = e.articles;
    const f = fresh.articles;
    const checks = [
      ['条数', a.length === f.length, a.length + ' vs ' + f.length],
      ['首条条号', a[0].noLabel.zh === f[0].label, a[0].noLabel.zh + ' vs ' + f[0].label],
      ['末条条号', a[a.length - 1].noLabel.zh === f[f.length - 1].label,
        a[a.length - 1].noLabel.zh + ' vs ' + f[f.length - 1].label],
      ['首条正文逐字一致', a[0].text.zh === f[0].text, diff(a[0].text.zh, f[0].text)],
      ['末条正文逐字一致', a[a.length - 1].text.zh === f[f.length - 1].text,
        diff(a[a.length - 1].text.zh, f[f.length - 1].text)],
      ['全部条文逐字一致', a.every((x, i) => x.text.zh === f[i].text), '逐条比对']
    ];
    console.log('### ' + id + '  (' + e.sourceName + ')');
    console.log('    URL: ' + e.sourceUrl);
    checks.forEach(([n, ok, d]) => console.log('    ' + (ok ? 'PASS' : 'FAIL') + '  ' + n + (ok ? '' : '  [' + d + ']')));
    console.log('    首条前 40 字: ' + a[0].text.zh.slice(0, 40));
    console.log('    末条前 40 字: ' + a[a.length - 1].text.zh.slice(0, 40));
  }
})();

function diff(x, y) {
  x = x || ''; y = y || '';
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) return '首个差异在第' + i + '字: 录入=' + JSON.stringify(x.slice(i, i + 12)) + ' 官方=' + JSON.stringify(y.slice(i, i + 12));
  }
  return '长度 ' + x.length + ' vs ' + y.length;
}
