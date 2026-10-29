// 无头验证：加载 util/i18n/components，检查检索结果标题在中英文界面下的渲染
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const JS = path.join(ROOT, 'prototype', 'assets', 'js');

const sb = { console };
sb.window = sb; sb.self = sb;
sb.localStorage = { getItem: () => null, setItem: () => {} };
sb.document = { documentElement: { setAttribute: () => {} }, getElementById: () => null, querySelector: () => null };
vm.createContext(sb);
['core/util.js', 'core/i18n.js', 'ui/components.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), sb, { filename: f });
});

const CALR = sb.CALR;
CALR.store = { countryName: () => 'China' };
CALR.ui.icon = () => '';
CALR.i18n.t = (k) => k;

const c2 = {}; c2.window = c2; c2.self = c2;
vm.createContext(c2);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype', 'data', 'cn-catalog.js'), 'utf8'), c2);
const laws = c2.CALR_CN_CATALOG.laws;

console.log('目录条目: ' + laws.length + '  含 titleEn: ' + laws.filter(x => x.titleEn).length);

function titleOf(law, lang) {
  CALR.i18n.setLang(lang);
  const html = CALR.ui.lawItem(law, { plain: true });
  const m = /<h3 class="law-item__title">([\s\S]*?)<\/h3>/.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, '')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : '(none)';
}

const picks = ['CN-CONST-0001', 'CN-LAW-0001', 'CN-LAW-0025', 'CN-REG-0001', 'CN-JI-0001', 'CN-PIA-0001'];
let bad = 0;
picks.forEach(function (id) {
  const c = laws.filter(function (x) { return x.id === id; })[0];
  if (!c) return;
  const law = {
    id: c.id, country: 'CN', level: c.level, status: c.status,
    title: { zh: c.title, en: c.titleEn }, promulgatedDate: c.date,
    effectiveDate: c.effectiveDate, coverage: 'catalog'
  };
  const en = titleOf(law, 'en');
  const zh = titleOf(law, 'zh');
  const okEn = en.indexOf(c.titleEn) === 0 && en.indexOf('（' + c.title + '）') > 0;
  const okZh = zh === c.title;
  if (!okEn || !okZh) bad++;
  console.log('\n[' + c.id + '] ' + (okEn && okZh ? 'OK' : 'FAIL'));
  console.log('  EN → ' + en);
  console.log('  ZH → ' + zh);
});

// 无英文标题的回退行为
const noEn = { id: 'X-TEST', country: 'CN', title: { zh: '某测试法规' }, coverage: 'catalog' };
console.log('\n[无英文标题回退]');
console.log('  EN → ' + titleOf(noEn, 'en'));
console.log('  ZH → ' + titleOf(noEn, 'zh'));

// 非中国法规不应出现「英文（中文）」包装
const sg = { id: 'SG-H004', country: 'SG', title: { zh: '公司法 1967', en: 'Companies Act 1967' }, coverage: 'catalog' };
console.log('\n[非 CN 法规]');
console.log('  EN → ' + titleOf(sg, 'en'));

console.log('\n结果: ' + (bad ? bad + ' 项失败' : '全部通过'));
