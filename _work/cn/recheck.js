'use strict';
const fs = require('fs');
const vm = require('vm');
const https = require('https');

function get(url) {
  return new Promise(r => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const ch = []; res.on('data', c => ch.push(c));
      res.on('end', () => r(Buffer.concat(ch).toString('utf8')));
    }).on('error', e => r('ERR ' + e.message));
  });
}

const flat = (n, out) => { out.push(n.title); (n.children || []).forEach(c => flat(c, out)); return out; };

(async () => {
  const c = { window: {} };
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(__dirname + '/../../prototype/data/fulltext/cn.js', 'utf8'), c);
  const m = c.window.CALR_FULLTEXT;

  for (const id of ['CN-CIVILCODE-2020', 'CN-FIL-2019', 'CN-COMPANY-2023', 'CN-PIPL-2021']) {
    const e = m[id];
    const html = await get(e.sourceUrl);
    let j;
    try { j = JSON.parse(html); } catch (err) { console.log(id + ' 非 JSON: ' + html.slice(0, 80)); continue; }
    const titles = flat(j.data.content, []);
    const artTitles = titles.filter(t => /^第[〇零一二三四五六七八九十百千0-9]+条$/.test(t));
    const first = e.articles[0], last = e.articles[e.articles.length - 1];
    console.log('== ' + id);
    console.log('   接口 title=' + j.data.title + ' 公布=' + j.data.gbrq + ' 施行=' + j.data.sxrq + ' 文件=' + j.data.ossFile.ossWordPath);
    console.log('   接口条文节点数=' + artTitles.length + '  首=' + artTitles[0] + '  末=' + artTitles[artTitles.length - 1]);
    console.log('   录入 articleCount=' + e.articleCount + '  首条=' + first.noLabel.zh + '  末条=' + last.noLabel.zh);
    console.log('   录入首条前40字: ' + first.text.zh.slice(0, 40));
    console.log('   录入末条前40字: ' + last.text.zh.slice(0, 40));
    console.log('   节点数一致: ' + (artTitles.length === e.articleCount ? '是' : '否'));
  }
})();
