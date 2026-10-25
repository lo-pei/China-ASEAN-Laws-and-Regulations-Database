/* CALR 交付前校验：数据完整性 + 核心算法逻辑（Node 环境，无浏览器） */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const log = [];
const problems = [];
function ok(name, cond, detail) {
  log.push((cond ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  [' + detail + ']' : ''));
  if (!cond) problems.push(name + (detail ? ' :: ' + detail : ''));
}

/* --- 构造浏览器最小环境 --- */
global.window = global;
global.document = {
  documentElement: { setAttribute() {}, removeAttribute() {}, getAttribute() { return 'zh-CN'; } },
  querySelector() { return null; }, querySelectorAll() { return []; },
  createElement() { return { style: {}, classList: { add() {}, toggle() {} }, appendChild() {}, setAttribute() {}, addEventListener() {} }; },
  addEventListener() {}, body: { appendChild() {}, removeChild() {}, contains() { return false; } }
};

function load(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { problems.push('缺失文件: ' + rel); return false; }
  vm.runInThisContext(fs.readFileSync(file, 'utf8'), { filename: rel });
  return true;
}

['prototype/data/dataset-core.js', 'prototype/data/dataset-extra.js', 'prototype/data/i18n.js',
 'prototype/assets/js/core/util.js', 'prototype/assets/js/core/i18n.js', 'prototype/assets/js/core/store.js',
 'prototype/assets/js/core/search.js', 'prototype/assets/js/core/compare.js', 'prototype/assets/js/core/terms.js',
 'prototype/assets/js/core/qa.js'].forEach(load);

/* 官方全文层与全量法规目录：与原型 index.html 的加载顺序保持一致 */
load('prototype/data/fulltext/manifest.js');
const _manifest = (global.CALR_FULLTEXT_MANIFEST || {}).files || [];
_manifest.forEach(f => load('prototype/data/fulltext/' + (/\.js$/.test(f) ? f : f + '.js')));
load('prototype/data/cn-catalog.js');

const CALR = global.CALR || {};
const has = (o) => o && typeof o === 'object';

ok('核心模块已加载', !!(CALR.util && CALR.store && CALR.search && CALR.compare && CALR.terms && CALR.qa));

const store = CALR.store;
store.init();
const st = store.stats();

/* ---------- 1. 数据规模 ---------- */
ok('countries = 12', st.countries === 12, '实际 ' + st.countries);
ok('laws >= 60', st.laws >= 60, '实际 ' + st.laws);
ok('articles >= 240', st.articles >= 240, '实际 ' + st.articles);
ok('terms >= 120', st.terms >= 120, '实际 ' + st.terms);
ok('treaties >= 6', st.treaties >= 6, '实际 ' + st.treaties);
ok('cases >= 8', st.cases >= 8, '实际 ' + st.cases);
ok('revisions >= 8', st.revisions >= 8, '实际 ' + st.revisions);

const qa = store.qa();
ok('qa.curated >= 12', (qa.curated || []).length >= 12, '实际 ' + (qa.curated || []).length);
ok('qa.outOfScope 非空', !!qa.outOfScope);

/* ---------- 2. 引用完整性 ---------- */
const codes = {};
store.countries().forEach(c => codes[c.code] = c);
const lawIds = {};
store.laws().forEach(l => lawIds[l.id] = l);
const artIds = {};
store.articles().forEach(a => artIds[a.id] = a);

let badCountry = [], badRelated = [], badCited = [], badRevLaw = [], badRevArt = [], badTerm = [], badQaCite = [], noText = [], missingField = [];
store.countries().forEach(c => { if (!c.code || !c.name) missingField.push('country:' + c.code); });
store.laws().forEach(l => {
  if (!codes[l.country]) badCountry.push(l.id);
  ['id', 'country', 'level', 'status', 'title', 'promulgatedDate'].forEach(f => { if (l[f] === undefined || l[f] === null || l[f] === '') missingField.push(l.id + '.' + f); });
  (l.relatedLawIds || []).forEach(x => { if (!lawIds[x]) badRelated.push(l.id + '->' + x); });
  (l.citedBy || []).forEach(x => { if (!lawIds[x]) badCited.push(l.id + '->' + x); });
  (l.articles || []).forEach(a => {
    if (!a.text || !Object.keys(a.text).length) noText.push(a.id);
    if (a.no === undefined || a.no === null) missingField.push(a.id + '.no');
    (a.termIds || []).forEach(t => { if (!store.term(t)) badTerm.push(a.id + '->' + t); });
  });
});
store.revisions().forEach(r => {
  if (!lawIds[r.lawId]) badRevLaw.push(r.id + '->' + r.lawId);
  (r.changes || []).forEach(ch => {
    const resolved = store.resolveArticle(ch.articleId, r.lawId);
    if (!resolved) badRevArt.push(r.id + '->' + ch.articleId);
  });
});
(qa.curated || []).forEach(c => (c.citationArticleIds || []).forEach(id => {
  if (!store.resolveArticle(id)) badQaCite.push(c.id + '->' + id);
}));

ok('所有法规的 country 均存在', badCountry.length === 0, badCountry.slice(0, 5).join(','));
ok('relatedLawIds 全部可解析', badRelated.length === 0, badRelated.slice(0, 5).join(','));
ok('citedBy 全部可解析', badCited.length === 0, badCited.slice(0, 5).join(','));
ok('revision.lawId 全部可解析', badRevLaw.length === 0, badRevLaw.slice(0, 5).join(','));
ok('revision.changes.articleId 全部可解析', badRevArt.length === 0, badRevArt.slice(0, 5).join(','));
ok('article.termIds 全部可解析', badTerm.length === 0, badTerm.slice(0, 5).join(','));
ok('qa 引用条文全部可解析', badQaCite.length === 0, badQaCite.slice(0, 5).join(','));
ok('每条条文均有文本', noText.length === 0, noText.slice(0, 5).join(','));
ok('关键字段无缺失', missingField.length === 0, missingField.slice(0, 8).join(','));

const multi = store.articles().filter(a => a.text && a.text.zh && a.text.en && Object.keys(a.text).length >= 3).length;
ok('三语（含本国语）条文 >= 60', multi >= 60, '实际 ' + multi);
const multiTerms = store.terms().filter(t => Object.keys(t.translations || {}).length >= 5).length;
ok('>=5 语种译文的术语 >= 40', multiTerms >= 40, '实际 ' + multiTerms);

const mvp = ['VN', 'TH', 'ID', 'MY', 'SG'];
const mvpBad = mvp.filter(c => (st.lawsByCountry[c] || 0) < 6);
ok('MVP 五国每家 >= 6 部法规', mvpBad.length === 0, mvpBad.map(c => c + '=' + (st.lawsByCountry[c] || 0)).join(','));
const zero = store.countries().filter(c => (st.lawsByCountry[c.code] || 0) === 0).map(c => c.code);
ok('每个法域至少 1 部法规', zero.length === 0, zero.join(','));

/* ---------- 3. 检索逻辑 ---------- */
function search(q, mode, extra) {
  return CALR.search.run(Object.assign({ q: q, mode: mode || 'keyword', size: 50 }, extra || {}));
}
const s1 = search('外商投资 准入');
ok('关键词检索有结果', s1.total > 0, 'total=' + s1.total);
const s2 = search('越南外资企业最低注册资本', 'semantic');
ok('自然语言检索有结果', s2.total > 0, 'total=' + s2.total);
ok('语义检索返回相关度', s2.items.length > 0 && s2.items[0].score > 0, 'top=' + (s2.items[0] && s2.items[0].score));
const s3 = search('第 1 条', 'exact');
ok('法条编号精确检索（第 1 条）有结果', s3.total > 0, 'total=' + s3.total);
const docNo = (store.laws().filter(l => l.docNumber)[0] || {}).docNumber;
const s4 = search(docNo, 'exact');
ok('文号精确检索命中', s4.total > 0, docNo + ' total=' + s4.total);
const s5 = search('', 'keyword', { country: ['VN'] });
ok('空查询 + 国别筛选可用', s5.total > 0 && s5.items.every(i => i.law.country === 'VN'), 'total=' + s5.total);
const s6 = search('', 'keyword', { status: ['active'] });
ok('时效性筛选生效', s6.total > 0 && s6.items.every(i => i.law.status === 'active'), 'total=' + s6.total);
const s7 = search('company', 'keyword');
ok('英文检索有结果', s7.total > 0, 'total=' + s7.total);
const s8 = search('đầu tư', 'keyword');
log.push('INFO  越南语检索（đầu tư）命中 ' + s8.total + ' 部');

/* ---------- 4. 比对逻辑 ---------- */
const pair = [];
store.laws().slice(0, 12).forEach(l => { if (l.articles[0]) pair.push(l.articles[0].id); });
const rep = CALR.compare.report(pair.slice(0, 2));
ok('比对报告可生成（2 条）', rep.ok === true, JSON.stringify(rep).slice(0, 120));
ok('比对包含 5 个维度', rep.ok && rep.dimensions.length === 5, '实际 ' + (rep.dimensions || []).length);
ok('比对包含相似度矩阵', rep.ok && Array.isArray(rep.matrix) && rep.matrix.length === 2);
ok('比对包含制度衔接提示', rep.ok && rep.tips.length > 0, 'tips=' + (rep.tips || []).length);
const rep3 = CALR.compare.report(pair.slice(0, 3));
ok('比对报告可生成（3 条）', rep3.ok === true);
const badRep = CALR.compare.report(['NOT-EXIST-1']);
ok('无效条文比对被拒绝', badRep.ok === false);

/* ---------- 5. 术语逻辑 ---------- */
const lawWithTerms = store.laws().filter(l => store.termsOfLaw(l).length > 0)[0];
ok('存在含术语的法规', !!lawWithTerms, lawWithTerms && lawWithTerms.id);
if (lawWithTerms) {
  const rows = CALR.terms.glossaryRows(lawWithTerms, ['zh', 'en', 'vi', 'th', 'id', 'ms']);
  ok('术语对照表有数据行', rows.length > 1, 'rows=' + rows.length);
  const html = CALR.terms.annotate(lawWithTerms.articles[0], 'zh');
  ok('条文术语标注生成 HTML', typeof html === 'string' && html.length > 0);
}
const term = store.terms()[0];
ok('术语详情弹窗可生成', !!term && CALR.terms.popupHtml(term).indexOf('term-pop__zh') > 0);

/* ---------- 6. AI 问答逻辑 ---------- */
const cases = [
  { q: '越南外资企业的最低注册资本要求是什么？', expect: true },
  { q: '马来西亚劳动合同试用期如何规定？', expect: true },
  { q: '印度尼西亚对个人数据本地化有哪些要求？', expect: true },
  { q: '新加坡公司注册需要哪些条件？', expect: true },
  { q: '今天北京天气怎么样？', expect: false }
];
let qaBad = [];
cases.forEach(c => {
  const r = CALR.qa.ask(c.q);
  log.push('INFO  问答「' + c.q + '」inScope=' + r.inScope + ' 引用=' + (r.citations || []).length + ' top=' + (r.retrieval || {}).topScore);
  if (c.expect && !r.inScope) qaBad.push('应命中却未命中: ' + c.q);
  if (!c.expect && r.inScope) qaBad.push('应超范围却命中: ' + c.q);
  if (r.inScope && !(r.citations || []).length) qaBad.push('命中但无引用: ' + c.q);
  if (r.disclaimer !== 'AI 辅助生成，仅供参考') qaBad.push('缺少免责标识: ' + c.q);
});
ok('AI 问答：溯源与幻觉防护全部符合预期', qaBad.length === 0, qaBad.join(' | '));

/* ---------- 7. 首页与详情数据可用性 ---------- */
ok('新法速递有数据', store.latestLaws(6).length === 6);
const someLaw = store.laws()[0];
ok('相关法规推荐可生成', store.related(someLaw, 5).length >= 0);
ok('国家名称可取值', store.countryName('VN') !== 'VN');
ok('层级/状态名称可取值', store.levelName('law') !== 'law' && store.statusName('active') !== 'active');

/* ---------- 输出 ---------- */
const out = path.join(ROOT, '_work', 'verify-report.txt');
fs.mkdirSync(path.dirname(out), { recursive: true }); // CI 的全新 checkout 没有 _work/，先建目录
fs.writeFileSync(out, log.join('\n') + '\n\nFAILED=' + problems.length + '\n' + problems.map(p => ' - ' + p).join('\n') + '\n', 'utf8');
console.log(log.join('\n'));
console.log('\n===== 校验结果：' + (problems.length ? problems.length + ' 项未通过 =====' : '全部通过 ====='));
if (problems.length) console.log(problems.map(p => ' - ' + p).join('\n'));
process.exit(problems.length ? 1 : 0);
