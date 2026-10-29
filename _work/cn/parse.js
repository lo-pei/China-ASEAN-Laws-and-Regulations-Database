'use strict';
/* 法条解析：把官方文书段落数组解析为 {chapter, articles} */
const CN_DIGITS = { '〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
const CN_UNITS = { '十': 10, '百': 100, '千': 1000 };

function cnNum(s) {
  s = String(s).trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (!s) return NaN;
  let total = 0, section = 0, num = 0;
  for (const ch of s) {
    if (CN_DIGITS[ch] !== undefined) { num = CN_DIGITS[ch]; }
    else if (CN_UNITS[ch] !== undefined) {
      const u = CN_UNITS[ch];
      if (u === 10) { section += (num || 1) * 10; }
      else { section += (num || 1) * u; }
      num = 0;
    } else return NaN;
  }
  return total + section + num;
}

const RE_ARTICLE = /^第\s*([〇零一二三四五六七八九十百千0-9]+)\s*条(?:[\s\u3000]*)([\s\S]*)$/;
const RE_CHAPTER = /^第\s*([〇零一二三四五六七八九十百千0-9]+)\s*([章节编])(?:[\s\u3000]+([\s\S]*))?$/;
/** 章/节/编标题（含正文中的重复出现） */
const RE_HEAD_TITLE = /^第\s*[〇零一二三四五六七八九十百千0-9]+\s*[章节编](?:[\s\u3000]|$)/;

/* 停抓：这些行出现即认为正文结束 */
const STOP_EXACT = [
  '附件', '【打印】', '【关闭窗口】', '点击查看全文', '上一篇', '下一篇', '返回顶部',
  '网站纠错', '主办单位：国务院办公厅 运行维护单位：中国政府网运行中心',
  '版权所有：中国政府网', '网站标识码', '相关稿件', '相关政策', '解读', '扫一扫在手机打开当前页'
];
const STOP_PREFIX = [
  '相关稿件', '相关链接', '责任编辑', '京ICP备', '国家规章库', '视频下载', '打印', '字号',
  '来源：', '【字体：', '链接：', '政策解读', '附件：', '附件:', '扫一扫'
];
const NOISE_EXACT = ['首页', '简', '繁', 'EN', '登录', '注册', '退出', '邮箱', '无障碍', '个人中心', '收藏', '客户端', '电脑版', '小程序', '微博', '微信', '网站纠错'];
const NOISE_PREFIX = ['https://www.gov.cn', 'http://www.gov.cn'];
const META_RE = /^(索\s*引\s*号|主题分类|发文机关|成文日期|标\s*题|发文字号|发布日期)[:：]?/;
/* 网页页头（正文之前）出现的行 */
const HEADER_RE = /^(首页|简|繁|EN|登录|个人中心|退出|邮箱|无障碍|来源|【字体|字号|打印|收藏|视频下载|分享|国家规章库|解读|扫一扫|链接|相关稿件|相关政策|国务院公报|国家法律法规数据库|当前位置)/;

function normalize(s) {
  return String(s == null ? '' : s)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function isStop(p) {
  if (STOP_EXACT.includes(p)) return true;
  return STOP_PREFIX.some(x => p.startsWith(x));
}
function isNoise(p) {
  if (NOISE_EXACT.includes(p)) return true;
  if (NOISE_PREFIX.some(x => p.startsWith(x))) return true;
  if (META_RE.test(p)) return true;
  if (/^国家互联网信息办公室$|^中国政府网$|^国务院$/.test(p)) return true;
  return false;
}

const TOC_ENTRY_MAX = 12;

/* 正文起点：目录块（连续递增的短条文条目）之后 */
function findBodyStart(clean) {
  let bestEnd = -1;
  let runPrev = null, runCount = 0;
  for (let i = 0; i < clean.length; i++) {
    const p = clean[i];
    if (!p) continue;
    const ma = RE_ARTICLE.exec(p);
    if (ma) {
      const rest = normalize(ma[2]);
      const no = cnNum(ma[1]);
      if (rest.length <= TOC_ENTRY_MAX && !isNaN(no)) {
        if (runPrev !== null && no === runPrev + 1) runCount++;
        else runCount = 1;
        runPrev = no;
        if (runCount >= 3) bestEnd = i;
        continue;
      }
    }
    if (bestEnd >= 0 && p.length > TOC_ENTRY_MAX && !RE_CHAPTER.test(p)) break;
  }
  return bestEnd >= 0 ? bestEnd + 1 : 0;
}

/* 从目录区收集编/章/节标题 */
function collectTocHeadings(clean, bodyStart) {
  const out = [];
  for (let i = 0; i < bodyStart; i++) {
    const p = clean[i];
    if (!p || RE_ARTICLE.test(p)) continue;
    const mc = RE_CHAPTER.exec(p);
    if (mc) {
      const title = normalize('第' + mc[1] + mc[2] + ' ' + (mc[3] || ''));
      if (!out.includes(title)) out.push(title);
    }
  }
  return out;
}

/* 找"第一条"所在下标（用于跳过网页页头等前置内容） */
function findFirstArticle(clean, from) {
  for (let i = from || 0; i < clean.length; i++) {
    const ma = RE_ARTICLE.exec(clean[i]);
    if (ma && cnNum(ma[1]) === 1) return i;
  }
  return -1;
}

/**
 * @param {string[]} paras 段落文本
 * @param {object} opt { noBodyStart }
 */
function parseArticles(paras, opt) {
  opt = opt || {};
  const DBG = opt.debug ? (m => console.error('[parse] ' + m)) : (() => {});
  const clean = paras.map(normalize);
  let start = opt.noBodyStart ? 0 : findBodyStart(clean);
  const firstArticle = findFirstArticle(clean, start);
  if (firstArticle >= 0 && firstArticle - start > 3) {
    /* 首条之前为页头/公文头，正文从这里开始 */
    start = Math.max(start, firstArticle - 3);
  }
  const tocHeadings = opt.noBodyStart ? [] : collectTocHeadings(clean, firstArticle >= 0 ? firstArticle : start);

  const articles = [];
  const bodyChapters = [];
  const preHeadings = [];
  const pending = [];
  const stopLines = [];
  let curPart = '';
  let curChapter = '';
  let curSection = '';
  let cur = null;

  const flush = () => {
    if (!cur) return;
    articles.push({
      no: cur.no, label: cur.label, text: cur.paras.join('\n'), paragraphs: cur.paras.slice(),
      part: cur.part, chap: cur.chap, sec: cur.sec, chapter: cur.chap
    });
    cur = null;
  };

  for (let i = start; i < clean.length; i++) {
    const p = clean[i];
    if (!p) continue;
    const started = articles.length > 0 || !!cur;
    if (!started) {
      /* 正文之前：跳过网页页头/公文头，不视为正文结束 */
      if (HEADER_RE.test(p) || META_RE.test(p) || isNoise(p)) continue;
    } else if (isStop(p)) {
      stopLines.push(p);
      break;
    }
    if (started && isNoise(p)) continue;

    const ma = RE_ARTICLE.exec(p);
    if (ma) {
      const no = cnNum(ma[1]);
      if (!isNaN(no) && no > 0 && no < 10000) {
        flush();
        const rest = normalize(ma[2]);
        cur = { no, label: '第' + ma[1] + '条', part: curPart, chap: curChapter, sec: curSection, paras: rest ? [rest] : [] };
        continue;
      }
    }

    const mc = RE_CHAPTER.exec(p);
    if (mc) {
      const kind = mc[2];
      const title = normalize('第' + mc[1] + kind + ' ' + (mc[3] || ''));
      if (kind === '编') {
        curPart = title;
        curChapter = '';
        curSection = '';
        (cur ? bodyChapters : preHeadings).push({ title, kind, part: title, chapter: '', section: '', afterArticle: articles.length ? articles[articles.length - 1].no : 0 });
      } else if (kind === '章') {
        curChapter = title;
        curSection = '';
        (cur ? bodyChapters : preHeadings).push({ title, kind, part: curPart, chapter: title, section: '', afterArticle: articles.length ? articles[articles.length - 1].no : 0 });
      } else {
        curSection = title;
        (cur ? bodyChapters : preHeadings).push({ title, kind, part: curPart, chapter: curChapter, section: title, afterArticle: articles.length ? articles[articles.length - 1].no : 0 });
      }
      continue;
    }

    if (cur) cur.paras.push(p);
    else pending.push(p);
  }
  flush();

  /* 章节结构：采用正文（含文首标题）中出现的顺序，标题含编/章/节层级（全角空格分隔）。
     同一部法律的"第一章"可能在不同编中重复出现，因此按出现顺序保留，不去重。 */
  const structure = [];
  const chapterList = [];
  [...preHeadings, ...bodyChapters].forEach(h => {
    const title = [h.part, h.chapter, h.section].filter(Boolean).join('\u3000') || h.title;
    structure.push(title);
    if (!chapterList.some(x => x.title === title)) chapterList.push({ title, kind: h.kind });
  });
  articles.forEach(a => {
    a.part = a.part || '';
    a.section = a.sec || '';
    a.chapter = [a.part, a.chap, a.sec].filter(Boolean).join('\u3000') || a.chap || '';
  });

  return { articles, structure, tocHeadings, preHeadings, bodyChapters, chapterList, bodyStart: start, firstArticle, pending, stopLines };
}

module.exports = {
  parseArticles, cnNum, normalize, findBodyStart,
  RE_ARTICLE, RE_CHAPTER, isStop, isNoise
};
