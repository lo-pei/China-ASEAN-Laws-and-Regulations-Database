/* ==========================================================================
   _ph_num.js —— 标题里的英文数词 → 阿拉伯数字，以及五语数字一致性校验
   
   为什么需要：
     PH 老标题写作 "Beginning July First, Nineteen Hundred and Forty"。
     机翻把它译成「1946 年 7 月 1 日」——年份被改写，这是最危险的错误。
     手写时靠人眼能看出，批量机翻必须由机器拦。
   
   做法：
     ① 送译前把英文数词折成阿拉伯数字，并单独列出「本条的必备数字」；
     ② 译后校验每个必备数字是否出现在五语里（泰语放行 +543 的佛历换算）。
   ========================================================================== */
'use strict';

const ONES = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleventh: 11, eleventh_: 11, eleven: 11, twelfth: 12, twelve: 12, thirteenth: 13,
  thirteen: 13, fourteenth: 14, fourteen: 14, fifteenth: 15, fifteen: 15, sixteenth: 16,
  sixteen: 16, seventeenth: 17, seventeen: 17, eighteenth: 18, eighteen: 18, nineteenth: 19,
  nineteen: 19,
};
const TENS = {
  twenty: 20, twentieth: 20, thirty: 30, thirtieth: 30, forty: 40, fortieth: 40,
  fifty: 50, fiftieth: 50, sixty: 60, sixtieth: 60, seventy: 70, seventieth: 70,
  eighty: 80, eightieth: 80, ninety: 90, ninetieth: 90,
};

/** 把一段英文数词折成数字；认不出返回 null */
function wordsToNum(phrase) {
  const toks = String(phrase).toLowerCase().replace(/[-,]/g, ' ').split(/\s+/)
    .filter((t) => t && t !== 'and');
  if (!toks.length) return null;

  // 年份特例：「Nineteen Forty」= 1940（两个词都在 10–99 且首词 ≥13）
  if (toks.length === 2) {
    const a = ONES[toks[0]] || TENS[toks[0]];
    const b = ONES[toks[1]] || TENS[toks[1]];
    if (a >= 13 && a <= 19 && b && b < 100 && !ONES[toks[0] + '_']) {
      const second = TENS[toks[1]] || ONES[toks[1]];
      if (second >= 10) return a * 100 + second;
    }
  }

  let total = 0, cur = 0, hit = false;
  for (const t of toks) {
    if (ONES[t] != null && t !== 'nineteenth') { cur += ONES[t]; hit = true; }
    else if (ONES[t] != null) { cur += ONES[t]; hit = true; }
    else if (TENS[t] != null) { cur += TENS[t]; hit = true; }
    else if (t === 'hundred') { cur = (cur || 1) * 100; hit = true; }
    else if (t === 'thousand') { total += (cur || 1) * 1000; cur = 0; hit = true; }
    else if (t === 'million') { total += (cur || 1) * 1000000; cur = 0; hit = true; }
    else return null; // 出现非数词（如专名），整段放弃
  }
  return hit ? total + cur : null;
}

/**
 * 把标题里的英文数词解析成阿拉伯数字，返回 { en, nums }
 *   en   替换后的标题（仅替换能确定折出的数词短语）
 *   nums 本条必须原样保留的数字列表（去重、有序）
 */
function normalize(en) {
  const src = String(en || '');
  const nums = new Set();

  // 阿拉伯数字直接收集（含 1,234 这类千分位）
  for (const m of src.matchAll(/\b(\d{1,3}(?:,\d{3})+|\d+)\b/g)) {
    nums.add(m[1].replace(/,/g, ''));
  }

  // 英文数词：贪心匹配最长可折短语（最多 5 个词）
  const WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|thirtieth|fortieth|fiftieth|sixtieth|seventieth|eightieth|ninetieth|hundred|thousand|million|and';
  const re = new RegExp(`\\b((?:${WORDS})(?:[\\s-]+(?:${WORDS})){0,5})\\b`, 'gi');

  let out = src;
  const reps = [];
  for (const m of src.matchAll(re)) {
    const txt = m[1];
    // 去掉尾部的 and，避免 "Nineteen Hundred and Forty and" 之类
    const trimmed = txt.replace(/\s+and$/i, '');
    const v = wordsToNum(trimmed);
    if (v == null || v === 0) continue;
    // 只折年份量级（1900–2100）与序数（1–31），避免把 "one" 之类泛指词改坏
    const isYear = v >= 1500 && v <= 2200 && trimmed.split(/[\s-]+/).length >= 2;
    const isOrd = v >= 1 && v <= 31 && /(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|thirtieth|fortieth|fiftieth|sixtieth|seventieth|eightieth|ninetieth)$/i.test(trimmed.trim());
    if (!isYear && !isOrd) continue;
    reps.push({ from: m[0], to: String(v), v });
    nums.add(String(v));
  }
  // 从后往前替换，避免位移
  for (const r of reps.sort((a, b) => out.lastIndexOf(b.from) - out.lastIndexOf(a.from))) {
    const i = out.lastIndexOf(r.from);
    if (i >= 0) out = out.slice(0, i) + r.to + out.slice(i + r.from.length);
  }

  return { en: out.replace(/\s+/g, ' ').trim(), nums: [...nums] };
}

/** 校验：必备数字是否都出现在译文里（泰语放行佛历 +543，泰文数字先归一） */
function check(lang, text, nums) {
  // 泰文数字 ๐-๙ 与阿拉伯-印度数字 ٠-٩ 归一，避免因字形不同误判缺号
  const s = String(text || '')
    .replace(/[\u0E50-\u0E59]/g, (c) => String(c.charCodeAt(0) - 0x0E50))
    .replace(/[\u0660-\u0669]/g, (c) => String(c.charCodeAt(0) - 0x0660));
  const got = new Set();
  for (const m of s.matchAll(/\d{1,3}(?:,\d{3})+|\d+/g)) got.add(m[0].replace(/,/g, ''));
  const missing = [];
  for (const n of nums) {
    if (got.has(n)) continue;
    if (lang === 'th' && got.has(String(+n + 543))) continue; // 佛历
    if (lang === 'zh') {
      // 汉字数字（一九四〇 / 一千九百四十）
      const cn = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const per = String(n).split('').map((d) => cn[+d]).join('');
      if (s.includes(per)) continue;
    }
    missing.push(n);
  }
  return missing;
}

module.exports = { normalize, check, wordsToNum };

if (require.main === module) {
  const tests = [
    'Beginning July First, Nineteen Hundred and Forty',
    'Two Thousand and Five',
    'Nineteen Forty',
    'Republic Act No. 10173',
    'Section 5, 6, 24 and 25',
    'the twenty-five (25) years',
  ];
  for (const t of tests) console.log(t, '=>', JSON.stringify(normalize(t)));
}
