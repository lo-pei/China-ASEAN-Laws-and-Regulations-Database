'use strict';
/* CALR 全文数据集生成器（中国法域）
   输入：_work/cn/raw/*.docx（国家法律法规数据库官方文本）
        _work/cn/html/*.html（中国政府网官方全文页）
   输出：prototype/data/fulltext/cn.js
*/
const fs = require('fs');
const path = require('path');
const { readDocx, paragraphs } = require('./docx');
const { parseArticles } = require('./parse');
const { toText } = require('./htmltext');
const meta = JSON.parse(fs.readFileSync(__dirname + '/meta.json', 'utf8'));

const FETCHED_AT = '2026-10-02';
const RAW = __dirname + '/raw';
const HTML = __dirname + '/html';

const flkUrl = bbbs => 'https://flk.npc.gov.cn/detail2.html?bbbs=' + bbbs;
/* 实际抓取到的正文（官方 docx 文本）下载地址：国家法律法规数据库公开文件接口 */
const flkFileUrl = ossPath => 'https://flk.npc.gov.cn/law-search/file/download?filePath=' + encodeURIComponent(ossPath);

/* ------------------------------------------------------------------ */
/* 文档清单                                                            */
/* ------------------------------------------------------------------ */

const FLK_DOCS = [
  {
    id: 'CN-FIL-2019', file: 'fil', key: '中华人民共和国外商投资法',
    title: { zh: '中华人民共和国外商投资法', en: 'Foreign Investment Law of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['investment'],
    issuingBody: { zh: '全国人民代表大会', en: 'National People\'s Congress' },
    note: '全文，第一条至第四十二条，共 42 条。官方文本分章，无节。'
  },
  {
    id: 'CN-CIVILCODE-2020', file: 'civilcode', key: '中华人民共和国民法典',
    title: { zh: '中华人民共和国民法典', en: 'Civil Code of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['contract'],
    issuingBody: { zh: '全国人民代表大会', en: 'National People\'s Congress' },
    note: '全文，第一条至第一千二百六十条，共 1260 条（含第一编至第七编及附则；条号连续）。官方文本分编、章、节。'
  },
  {
    id: 'CN-LABORCONTRACT-2007', file: 'laborcontract', key: '中华人民共和国劳动合同法',
    title: { zh: '中华人民共和国劳动合同法', en: 'Labour Contract Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['labor'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第九十八条，共 98 条（2012 年修正文本）。'
  },
  {
    id: 'CN-DATA-2021', file: 'dsl', key: '中华人民共和国数据安全法',
    title: { zh: '中华人民共和国数据安全法', en: 'Data Security Law of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['data'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第五十五条，共 55 条。'
  },
  {
    id: 'CN-PIPL-2021', file: 'pipl', key: '中华人民共和国个人信息保护法',
    title: { zh: '中华人民共和国个人信息保护法', en: 'Personal Information Protection Law of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['data'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第七十四条，共 74 条。'
  },
  {
    id: 'CN-COPYRIGHT-2020', file: 'copyright', key: '中华人民共和国著作权法',
    title: { zh: '中华人民共和国著作权法', en: 'Copyright Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['ip'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第六十七条，共 67 条（2020 年修正文本）。'
  },
  {
    id: 'CN-LAW-APPLICATION-2010', file: 'lawapp', key: '中华人民共和国涉外民事关系法律适用法',
    title: { zh: '中华人民共和国涉外民事关系法律适用法', en: 'Law of the People\'s Republic of China on the Application of Laws to Foreign-related Civil Relations' },
    level: 'law', status: 'active', topics: ['dispute'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第五十二条，共 52 条。官方文本分章，无节。'
  },
  {
    id: 'CN-COMPANY-2023', file: 'company', key: '中华人民共和国公司法',
    title: { zh: '中华人民共和国公司法', en: 'Company Law of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['company'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第二百六十六条，共 266 条（2023 年修订文本）。官方文本分章，无节。'
  },

  /* ---------------- B 组新增（国家法律法规数据库） ---------------- */
  {
    id: 'CN-NETDATA-2024', file: 'netdata', key: '网络数据安全管理条例',
    title: { zh: '网络数据安全管理条例', en: 'Regulations on the Administration of Network Data Security' },
    level: 'decree', status: 'active', topics: ['data'],
    issuingBody: { zh: '国务院', en: 'State Council' },
    note: '全文，第一条至第六十四条，共 64 条。'
  },
  {
    id: 'CN-LABOR-DISPUTE-2007', file: 'laborarb', key: '中华人民共和国劳动争议调解仲裁法',
    title: { zh: '中华人民共和国劳动争议调解仲裁法', en: 'Law of the People\'s Republic of China on Labor Dispute Mediation and Arbitration' },
    level: 'law', status: 'active', topics: ['labor', 'dispute'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第五十四条，共 54 条。'
  },
  {
    id: 'CN-SOCIAL-INSURANCE-2018', file: 'socialins', key: '中华人民共和国社会保险法',
    title: { zh: '中华人民共和国社会保险法', en: 'Social Insurance Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['labor'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第九十八条，共 98 条（2018 年修正文本）。'
  },
  {
    id: 'CN-EIT-2018', file: 'eit', key: '中华人民共和国企业所得税法',
    title: { zh: '中华人民共和国企业所得税法', en: 'Enterprise Income Tax Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['tax'],
    issuingBody: { zh: '全国人民代表大会', en: 'National People\'s Congress' },
    note: '全文，第一条至第六十条，共 60 条（2018 年修正文本）。'
  },
  {
    id: 'CN-PATENT-2020', file: 'patent', key: '中华人民共和国专利法',
    title: { zh: '中华人民共和国专利法', en: 'Patent Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['ip'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第八十二条，共 82 条（2020 年第四次修正文本）。'
  },
  {
    id: 'CN-TRADEMARK-2026', file: 'trademark2026', key: '中华人民共和国商标法(2026)',
    title: { zh: '中华人民共和国商标法', en: 'Trademark Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['ip'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第八十七条，共 87 条（2026 年 6 月 26 日公布，自 2027 年 1 月 1 日起施行）。'
  },
  {
    id: 'CN-TRADEMARK-2019', file: 'trademark2019', key: '中华人民共和国商标法(2019)',
    title: { zh: '中华人民共和国商标法（2019 年修正）', en: 'Trademark Law of the People\'s Republic of China (2019 Amendment)' },
    level: 'law', status: 'active', topics: ['ip'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第七十三条，共 73 条（2019 年 4 月 23 日第四次修正，现行有效的商标法版本）。'
  },
  {
    id: 'CN-ARBITRATION-2025', file: 'arb2025', key: '中华人民共和国仲裁法(2025)',
    title: { zh: '中华人民共和国仲裁法', en: 'Arbitration Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['dispute'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第九十六条，共 96 条（2025 年 9 月 12 日修订公布，自 2026 年 3 月 1 日起施行）。'
  },
  {
    id: 'CN-ARBITRATION-2017', file: 'arb2017', key: '中华人民共和国仲裁法(2017)',
    title: { zh: '中华人民共和国仲裁法（2017 年修正）', en: 'Arbitration Law of the People\'s Republic of China (2017 Amendment)' },
    level: 'law', status: 'active', topics: ['dispute'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第八十条，共 80 条（2017 年修正，现行有效的仲裁法版本）。'
  },
  {
    id: 'CN-FOREIGN-TRADE-2025', file: 'ft2025', key: '中华人民共和国对外贸易法(2025)',
    title: { zh: '中华人民共和国对外贸易法', en: 'Foreign Trade Law of the People\'s Republic of China' },
    level: 'law', status: 'amended', topics: ['trade'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第八十三条，共 83 条（2025 年 12 月 27 日修订公布，自 2026 年 3 月 1 日起施行）。'
  },
  {
    id: 'CN-FOREIGN-TRADE-2022', file: 'ft2022', key: '中华人民共和国对外贸易法(2022)',
    title: { zh: '中华人民共和国对外贸易法（2022 年修正）', en: 'Foreign Trade Law of the People\'s Republic of China (2022 Amendment)' },
    level: 'law', status: 'active', topics: ['trade'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第六十九条，共 69 条（2022 年修正，现行有效的对外贸易法版本）。'
  },
  {
    id: 'CN-HAINAN-FTP-2021', file: 'hainan', key: '中华人民共和国海南自由贸易港法',
    title: { zh: '中华人民共和国海南自由贸易港法', en: 'Hainan Free Trade Port Law of the People\'s Republic of China' },
    level: 'law', status: 'active', topics: ['investment', 'trade'],
    issuingBody: { zh: '全国人民代表大会常务委员会', en: 'Standing Committee of the National People\'s Congress' },
    note: '全文，第一条至第五十七条，共 57 条。'
  },
  {
    id: 'CN-FIL-REG-2019', file: 'fil-reg', key: '中华人民共和国外商投资法实施条例',
    title: { zh: '中华人民共和国外商投资法实施条例', en: 'Regulations for the Implementation of the Foreign Investment Law of the People\'s Republic of China' },
    level: 'decree', status: 'active', topics: ['investment'],
    issuingBody: { zh: '国务院', en: 'State Council' },
    note: '全文，第一条至第四十九条，共 49 条。'
  },
  {
    id: 'CN-MARKET-REG-2021', file: 'marketreg', key: '中华人民共和国市场主体登记管理条例',
    title: { zh: '中华人民共和国市场主体登记管理条例', en: 'Regulations of the People\'s Republic of China on the Administration of Market Entity Registration' },
    level: 'decree', status: 'active', topics: ['company', 'investment'],
    issuingBody: { zh: '国务院', en: 'State Council' },
    note: '全文，第一条至第五十五条，共 55 条。'
  },
  {
    id: 'CN-LAW-APPLICATION-J2-2023', file: 'lawapp-j2', key: '最高人民法院关于适用《中华人民共和国涉外民事关系法律适用法》若干问题的解释（二）',
    title: { zh: '最高人民法院关于适用《中华人民共和国涉外民事关系法律适用法》若干问题的解释（二）', en: 'Interpretation (II) of the Supreme People\'s Court on Several Issues concerning the Application of the Law of the People\'s Republic of China on the Application of Laws to Foreign-related Civil Relations' },
    level: 'judicial', status: 'active', topics: ['dispute'],
    issuingBody: { zh: '最高人民法院', en: 'Supreme People\'s Court' },
    note: '全文，第一条至第十三条，共 13 条。官方文本未分章。'
  }
];

const GOV_DOCS = [
  {
    id: 'CN-DATA-EXPORT-2022', file: 'data-export',
    url: 'https://www.gov.cn/zhengce/2022-07/07/content_5728937.htm',
    sourceName: '中国政府网（国家网信办网站）',
    title: { zh: '数据出境安全评估办法', en: 'Measures for the Security Assessment of Data Export' },
    level: 'subdecree', status: 'active', topics: ['data'],
    issuingBody: { zh: '国家互联网信息办公室', en: 'Cyberspace Administration of China' },
    promulgatedDate: '2022-07-07', effectiveDate: '2022-09-01',
    summary: {
      zh: '规定数据处理者向境外提供重要数据和个人信息应当申报数据出境安全评估的情形、申报材料、评估流程、评估重点与评估结果有效期，由国家互联网信息办公室公布。',
      en: 'Measures issued by the Cyberspace Administration of China setting out when a data export security assessment must be filed, the filing materials, the assessment procedure and focus, and the validity period of assessment results.'
    },
    note: '全文，第一条至第二十条，共 20 条。官方文本未分章。'
  },
  {
    id: 'CN-PIPL-SCC-2023', file: 'pipl-scc',
    url: 'https://www.gov.cn/zhengce/202311/content_6917770.htm',
    sourceName: '中国政府网（国家网信办网站）',
    title: { zh: '个人信息出境标准合同办法', en: 'Measures for the Standard Contract for Cross-border Transfer of Personal Information' },
    level: 'subdecree', status: 'active', topics: ['data'],
    issuingBody: { zh: '国家互联网信息办公室', en: 'Cyberspace Administration of China' },
    promulgatedDate: '2023-02-22', effectiveDate: '2023-06-01',
    summary: {
      zh: '规定个人信息处理者通过订立标准合同向境外提供个人信息的适用情形、个人信息保护影响评估、备案与重新备案要求。',
      en: 'Measures governing the transfer of personal information abroad by way of a standard contract, including applicable conditions, personal information protection impact assessment, and filing and re-filing requirements.'
    },
    note: '全文，第一条至第十三条，共 13 条。官方文本未分章；本办法附件《个人信息出境标准合同》（PDF，约 6 页）未收录于本数据集。'
  },
  {
    id: 'CN-BUSINESS-ENV-2019', file: 'business-env',
    url: 'https://www.gov.cn/zhengce/content/2019-10/23/content_5443963.htm',
    sourceName: '中国政府网',
    title: { zh: '优化营商环境条例', en: 'Regulation on Optimizing the Business Environment' },
    level: 'decree', status: 'active', topics: ['investment'],
    issuingBody: { zh: '国务院', en: 'State Council' },
    promulgatedDate: '2019-10-22', effectiveDate: '2020-01-01',
    summary: {
      zh: '中国优化营商环境的基础性行政法规，就市场主体保护、市场环境、政务服务、监管执法和法治保障作出规定。',
      en: 'China\'s basic administrative regulation on optimizing the business environment, covering protection of market entities, the market environment, government services, supervision and enforcement, and rule-of-law safeguards.'
    },
    note: '全文，第一条至第七十二条，共 72 条。'
  }
];

/* ------------------------------------------------------------------ */
/* 抽取                                                               */
/* ------------------------------------------------------------------ */

function fromDocx(f) {
  const p = paragraphs(readDocx(path.join(RAW, f + '.docx')));
  return parseArticles(p, {});
}

function fromHtml(f) {
  const t = toText(fs.readFileSync(path.join(HTML, f + '.html'), 'utf8'));
  return parseArticles(t.split('\n'), {});
}

/* 中文数字（规范写法，用于官方条号核对） */
function zhNum(no) {
  const d = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (no <= 0) return '零';
  if (no < 10) return d[no];
  if (no < 20) return '一十' + (no % 10 ? d[no % 10] : '');
  if (no < 100) return d[Math.floor(no / 10)] + '十' + (no % 10 ? d[no % 10] : '');
  const units = [[1000, '千'], [100, '百'], [10, '十'], [1, '']];
  let out = '';
  let rem = no;
  let started = false;
  let zeroPending = false;
  for (const [div, unit] of units) {
    const q = Math.floor(rem / div);
    rem %= div;
    if (q > 0) {
      if (zeroPending && started) out += '零';
      out += d[q] + unit;
      started = true;
      zeroPending = false;
    } else if (started) {
      zeroPending = true;
    }
  }
  return out;
}

/* 条号中文写法：10–19 写作"第十X条"（而非"第一十条"） */
function zhArticleNum(no) {
  if (no < 10) return zhNum(no);
  if (no < 20) return '十' + (no % 10 ? zhNum(no % 10) : '');
  return zhNum(no);
}

/* ------------------------------------------------------------------ */
/* 生成                                                               */
/* ------------------------------------------------------------------ */

const problems = [];
const report = [];
const metaEntries = [];

function buildEntry(spec, parsed, sourceName, sourceUrl, extraMeta, altUrl) {
  const arts = parsed.articles;
  if (!arts.length) { problems.push(spec.id + ': 无条文'); return null; }

  /* 条号连续性 */
  const nos = arts.map(a => a.no);
  const gaps = [];
  for (let i = 1; i < nos.length; i++) if (nos[i] !== nos[i - 1] + 1) gaps.push(nos[i - 1] + '→' + nos[i]);
  if (gaps.length && !/跳号|不连续/.test(spec.note || '')) problems.push(spec.id + ': 条号不连续 ' + gaps.join(','));

  /* 首条必须为第一条 */
  if (nos[0] !== 1) problems.push(spec.id + ': 首条不是第一条（实际 ' + nos[0] + '）');

  /* 官方条号写法核对 */
  const labelMismatch = [];
  arts.forEach(a => {
    const canonical = '第' + zhArticleNum(a.no) + '条';
    if (!a.label) labelMismatch.push(a.no + ':缺官方条号');
    else if (a.label !== canonical) labelMismatch.push('官方 ' + a.label + ' vs 规范 ' + canonical);
  });
  if (labelMismatch.length) problems.push(spec.id + ': 官方条号写法异常 ' + labelMismatch.slice(0, 5).join(' ; '));

  /* 空正文检查 */
  arts.forEach(a => { if (!a.text.trim()) problems.push(spec.id + ': 第' + a.no + '条正文为空'); });

  /* paragraphs 与 text 一致性 */
  arts.forEach(a => { if (a.paragraphs.join('\n') !== a.text) problems.push(spec.id + ': 第' + a.no + '条 paragraphs/text 不一致'); });

  /* 省略/节选标记 */
  const BAD = [
    [/……/, '省略号'],
    [/（略）|\(略\)|（下略）|\(下略\)/, '略标记'],
    [/摘录|节选|待补|节录/, '节选/待补字样'],
    [/TODO|XXX|待翻译|待补充/, '占位标记']
  ];
  arts.forEach(a => BAD.forEach(([re, why]) => { if (re.test(a.text)) problems.push(spec.id + ': 第' + a.no + '条含' + why); }));

  /* 网页噪声 */
  const NOISE = /(首页｜|站内检索|版权所有|保留所有权利|分享到|点赞|打印本页|扫描二维码|关注我们|主办单位：国务院办公厅)/;
  arts.forEach(a => { if (NOISE.test(a.text)) problems.push(spec.id + ': 第' + a.no + '条含网页噪声'); });

  const structure = (parsed.structure || []).map(t => ({ zh: t, articles: [] }));

  /* 结构里的 articles 数组：按条号归属章节（章项含其下各节的全部条文） */
  if (structure.length) {
    const key = s => String(s || '').replace(/[\s\u3000]/g, '');
    const byTitle = new Map();
    structure.forEach((s, i) => { if (!byTitle.has(s.zh)) byTitle.set(s.zh, i); });
    const byKey = new Map();
    structure.forEach((s, i) => { if (!byKey.has(key(s.zh))) byKey.set(key(s.zh), i); });
    const buckets = structure.map(() => []);
    arts.forEach(a => {
      const c = a.chapter || '';
      let i = -1;
      if (c && byTitle.has(c)) i = byTitle.get(c);
      if (i < 0 && c && byKey.has(key(c))) i = byKey.get(key(c));
      if (i < 0 && c) {
        /* 回退：取该条文所属章节链中最深的已收录项 */
        const hit = structure.reduce((best, s, j) => {
          if (c === s.zh || c.startsWith(s.zh + '\u3000') || key(c).startsWith(key(s.zh))) {
            return s.zh.length > (best < 0 ? -1 : structure[best].zh.length) ? j : best;
          }
          return best;
        }, -1);
        i = hit;
      }
      if (i >= 0) buckets[i].push(a.no);
      else problems.push(spec.id + ': 第' + a.no + '条章节未归属（' + c + '）');
    });
    buckets.forEach((b, i) => { if (b.length) structure[i].articles = b; });
  }

  const entry = {
    id: spec.id,
    coverage: 'full',
    language: 'zh',
    sourceName,
    sourceUrl,
    fetchedAt: FETCHED_AT,
    articleCount: arts.length,
    completenessNote: spec.note,
    articles: arts.map(a => {
      const o = {
        id: spec.id + '-A' + a.no,
        no: a.no,
        noLabel: { zh: a.label || '第' + zhArticleNum(a.no) + '条' },
        chapter: a.chapter ? { zh: a.chapter } : {}
      };
      o.text = { zh: a.text };
      if (a.paragraphs.length > 1) o.paragraphs = a.paragraphs.slice();
      return o;
    })
  };
  if (altUrl) entry.viewerUrl = altUrl;
  if (structure.length) entry.structure = structure;

  metaEntries.push(extraMeta);
  report.push([spec.id, (spec.title && spec.title.zh) || '', arts.length, sourceName, sourceUrl,
    arts.filter(a => a.paragraphs.length > 1).length, structure.length]);
  return entry;
}

const entries = [];

for (const spec of FLK_DOCS) {
  const m = meta[spec.key];
  if (!m) { problems.push(spec.id + ': meta.json 缺少 ' + spec.key); continue; }
  const parsed = fromDocx(spec.file);
  const extraMeta = {
    id: spec.id,
    country: 'CN',
    level: spec.level,
    status: spec.status,
    topics: spec.topics,
    title: spec.title,
    issuingBody: spec.issuingBody,
    promulgatedDate: m.gbrq,
    effectiveDate: m.sxrq || m.gbrq
  };
  const e = buildEntry(spec, parsed, '国家法律法规数据库（全国人大常委会办公厅）',
    flkFileUrl(m.ossFile.ossWordPath), extraMeta, flkUrl(m.bbbs));
  if (e) entries.push(e);
}

for (const spec of GOV_DOCS) {
  const parsed = fromHtml(spec.file);
  const extraMeta = {
    id: spec.id,
    country: 'CN',
    level: spec.level,
    status: spec.status,
    topics: spec.topics,
    title: spec.title,
    issuingBody: spec.issuingBody,
    promulgatedDate: spec.promulgatedDate,
    effectiveDate: spec.effectiveDate
  };
  if (spec.summary) extraMeta.summary = spec.summary;
  const e = buildEntry(spec, parsed, spec.sourceName, spec.url, extraMeta);
  if (e) entries.push(e);
}

/* ------------------------------------------------------------------ */
/* 写文件                                                             */
/* ------------------------------------------------------------------ */

const A_GROUP = new Set(['CN-FIL-2019', 'CN-CIVILCODE-2020', 'CN-LABORCONTRACT-2007', 'CN-DATA-2021',
  'CN-PIPL-2021', 'CN-COPYRIGHT-2020', 'CN-LAW-APPLICATION-2010', 'CN-COMPANY-2023']);

const lines = [];
lines.push('/* ==========================================================================');
lines.push('   CALR · data/fulltext/cn.js');
lines.push('   中国法域官方全文（依据 docs/06-全文数据规范.md v1.0）');
lines.push('   来源：国家法律法规数据库 https://flk.npc.gov.cn/');
lines.push('         中国政府网 https://www.gov.cn/');
lines.push('   抓取日期：' + FETCHED_AT);
lines.push('   本文件由脚本生成（_work/cn/gen.js），逐条照录官方文本，未作改写、合并或省略。');
lines.push('   ========================================================================== */');
lines.push('(function (root) {');
lines.push("  'use strict';");
lines.push('  root.CALR_FULLTEXT = root.CALR_FULLTEXT || {};');
lines.push('  root.CALR_FULLTEXT_META = root.CALR_FULLTEXT_META || {};');
lines.push('');
lines.push('  /* ---- 新增法规元数据（不在 dataset-core.js 中的法规） ---- */');

for (const m of metaEntries) {
  if (A_GROUP.has(m.id)) continue;
  lines.push('  root.CALR_FULLTEXT_META[' + JSON.stringify(m.id) + '] = ' + JSON.stringify(m, null, 2).replace(/\n/g, '\n  ') + ';');
  lines.push('');
}

lines.push('  /* ---- 全文 ---- */');
for (const e of entries) {
  lines.push('  root.CALR_FULLTEXT[' + JSON.stringify(e.id) + '] = ' + JSON.stringify(e, null, 2).replace(/\n/g, '\n  ') + ';');
  lines.push('');
}

lines.push("})(typeof window !== 'undefined' ? window : globalThis);");
lines.push('');

const out = lines.join('\n');
const outPath = path.resolve(__dirname, '../../prototype/data/fulltext/cn.js');
fs.writeFileSync(outPath, out, 'utf8');

console.log('written ' + outPath + '  ' + (out.length / 1024).toFixed(0) + ' KB');
console.log('');
console.log('id | title | articles | source | url | 分款条数 | 章节数');
report.forEach(r => console.log(r.join(' | ')));
console.log('');
if (problems.length) {
  console.log('PROBLEMS (' + problems.length + '):');
  problems.forEach(p => console.log(' - ' + p));
} else {
  console.log('PROBLEMS: none');
}
