// PH 标题句框合成引擎（第二代）
// 只做句法级重写，不虚构事实。严格锚定：整个标题必须被句框完整消费，否则跳过、留待人工。
'use strict';
const fs = require('fs');
const path = require('path');
const LX = require('./_ph_lex.js');
const ACTS = require('./_ph_acts.js');
const { gate } = require('./_sg_gate.js');

const DOCS = path.join(__dirname, '../../prototype/data/laws');
const LANGS = ['vi', 'th', 'id', 'ms'];
const TH = 1;
const H = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const AND = ['và', 'และ', 'dan', 'serta'];

const norm = (s) => LX.ENT(String(s || '')).replace(/\s+/g, ' ').trim();

// ── 数字 ────────────────────────────────────────────────────────────
const ONES = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
function words2num(s) {
  let total = 0, cur = 0;
  const ws = String(s).toLowerCase().replace(/[-,]/g, ' ').split(/\s+/).filter(Boolean);
  for (const w of ws) {
    if (w in ONES) cur += ONES[w];
    else if (w === 'hundred') cur = (cur || 1) * 100;
    else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; }
    else if (w === 'million') { total += (cur || 1) * 1e6; cur = 0; }
    else if (/^\d+$/.test(w)) cur += Number(w);
  }
  return total + cur;
}
function numOf(s) {
  if (!s) return null;
  const m = /\(\s*([\d][\d,.]*)\s*\)/.exec(s);
  if (m) return m[1].replace(/[,.]/g, '');
  const bare = String(s).replace(/\b(?:beds?|pesos?|years?)\b/gi, ' ').replace(/[^A-Za-z ]/g, ' ');
  const n = words2num(bare);
  return n ? String(n) : null;
}

// 老法把年份拼成英文：「Nineteen Hundred and Forty-Eight」→ 1948
// 「Twenty Hundred and Five」→ 2005
function spellYear(x) {
  return x
    .replace(/\b(Nineteen|Twenty)\s+[Hh]undred(?:\s+and)?\s+([A-Za-z][A-Za-z\-]*(?:\s+[A-Za-z][A-Za-z\-]*)?)/g,
      (m, pre, rest) => {
        const base = pre.toLowerCase() === 'nineteen' ? 1900 : 2000;
        const n = words2num(rest);
        return n && n < 100 ? String(base + n) : m;
      })
    // 「Nineteen Fifty-Five」这种省略 Hundred 的写法
    .replace(/\bNineteen\s+([A-Za-z][A-Za-z\-]*)(?=\s*(?:,|\.|\s+Act\b|\s+Code\b|\s+Law\b|$))/g,
      (m, rest) => {
        const n = words2num(rest);
        return n && n >= 1 && n < 100 ? String(1900 + n) : m;
      });
}
// 抽取残渣：「In Act …」「N Act …」「Fan Act …」「An Acting …」都是 An Act
function fixOcr(x) {
  return x.replace(/^(?:In|N|Fan|And|An Acting)\s+Act\b/i, 'An Act')
    // 扫描件把 l/I 认成 1：「Province1 of」「1locos」「Qapac1ty」
    .replace(/\bProvince1\b/g, 'Province')
    .replace(/\b1locos\b/g, 'Ilocos')
    .replace(/\bQapac1ty\b/gi, 'Capacity')
    .replace(/\bMunicipality1\b/g, 'Municipality')
    .replace(/\bBarangay1\b/g, 'Barangay');
}

// ── 地点 ────────────────────────────────────────────────────────────
const LOOKSLOC = /^(?:Barangay|Barrio|City|Municipality|Municipalities|Province|Subprovince|Region|District|Island|Metro|Lone\s+District|Legislative\s+District|Congressional\s+District)\b/i;
const LOCTOK = '(?:Legislative\\\\s+District|Congressional\\\\s+District|Lone\\\\s+District|Barangay|Barrio|Cities|City|Municipalities|Municipality|Provinces|Province|Subprovince|Region|District|Island|Metro\\\\s+Manila)';
function looksLoc(s) {
  return !!s && (LOOKSLOC.test(s) || /\b(?:City|Province)\s*$/i.test(s));
}
// 严格区划链：「(the) <区划词> of <专名>」若干段用逗号连接，或者「<专名> City / Metro Manila」。
// 用于 declare_day：辖区内不能夹带其它从句。
const LP = '(?:Legislative\\s+District|Congressional\\s+District|Lone\\s+District|Barangay|Barrio|Municipal\\s+District|Island\\s+Garden\\s+City|City|Municipalit(?:y|ies)|Provinces?|Sub-?[Pp]rovince|Region|District|Island)';
// 专名里只允许「大写词 + 少量连接词」（of/de/del/y…）；
// 放小写自由词进来会把「Province of Davao Oriental to Be Known as …」整个吞进地名。
const NAME1 = "[A-Z][A-Za-z'’\\u00C0-\\u024F.\\-]*(?:[\\s-]+(?:(?:of|de|del|los|las|y|e|van|von|da|dos|das)\\b|[A-Z][A-Za-z'’\\u00C0-\\u024F.\\-]*))*";
const LOCPART = new RegExp(`^(?:the\\s+)?${LP}\\s+of\\s+${NAME1}$`);
const LOCNAME = new RegExp(`^(?:the\\s+)?${NAME1}\\s+(?:City|Province)$`);
function strictLoc(s) {
  const t = String(s || '').trim();
  if (!t) return false;
  if (/^Metro\s+Manila$/i.test(t)) return true;
  const flat = t.replace(/^(?:the\s+)?(?:Entire|Whole)\s+/i, '');
  return flat.split(/\s*,\s*/).every((p) => {
    const q = p.trim();
    if (!q) return false;
    return LOCPART.test(q) || LOCNAME.test(q);
  });
}
// 从「机构名 + 地点」中切出地点
function splitLoc(s) {
  const T = LOCTOK;
  const pats = [
    // 「in Dagupan City, Province of Pangasinan」——先于通用 in-the 模式，避免只切到 City 就停
    /^(.*?)[,\s]+(?:located\s+|situated\s+)?in\s+(?:the\s+)?([A-Z][\w.'’\-]*(?:\s+[A-Za-z.'’\-]+)*?\s+City,[\s\S]+)$/,
    new RegExp('^(.*?)[,\\s]+(?:located\\s+|situated\\s+|situtated\\s+)?(?:in|within)\\s+(?:the\\s+)?(' + T + '\\s+of\\s+[\\s\\S]+)$', 'i'),
    /^(.*?)[,\s]+(?:located\s+|situated\s+)?in\s+(?:the\s+)?((?:Metro\s+Manila|[A-Z][\w.'’\-]*(?:\s+[A-Za-z.'’\-]+)*?\s+(?:City|Province)))$/,
    new RegExp('^(.*?)[,\\s]+(?:located\\s+|situated\\s+)?in\\s+(?:the\\s+)?(' + T + '\\s+[\\s\\S]+)$', 'i'),
    // 「Sitio of Danawan, Municipality of Cuyo, Province of Palawan」——不带 in 的逗号链地点。
    // 必须整段通过 strictLoc：否则会把从句当成地名吃掉（见 declare_day 那条教训）。
    new RegExp('^(.*?)\\s*,\\s*(' + T + '[\\s\\S]+)$', 'i'),
  ];
  for (let k = 0; k < pats.length; k++) {
    const m = s.match(pats[k]);
    if (!m) continue;
    const last = k === pats.length - 1;
    if (last) { if (!strictLoc(m[2])) continue; }
    // 第 0 个模式捕获的是「X City, Province of Y」，不以区划词开头，故单独判
    const ok = k === 0 ? /\bCity\b/i.test(m[2]) : looksLoc(m[2]);
    if (ok) return { thing: m[1].replace(/[,\s]+$/, ''), loc: m[2] };
  }
  return { thing: s, loc: '' };
}
// 「in the City of X, Province of Y, a Tertiary Hospital」式前置地点
function thingLoc(rest) {
  const fm = rest.match(/^in\s+(?:the\s+)?([\s\S]+?),\s+(?:a|an|the)\s+([\s\S]+)$/i);
  if (fm && looksLoc(fm[1])) return { thing: fm[2], loc: fm[1] };
  return splitLoc(rest);
}

const AT = ['tại', '', 'di', 'di'];
// 泰文名称紧跟在 ในชื่อ / ในนาม 之后时不加空格（泰文词间本无空格），
// 但是列举型短语（กำหนดวัตถุประสงค์ อำนาจ และหน้าที่）的空格要保留，故只在此处判断。
// ── 多项列举：「the Barrios of A, B and C」──────────────────────────
// 默认会把整个「A, B and C」当成专名保留，英文 and 就这样漏进四语标题。
// 只处理「纯专名列举」：含 Island/City/Province 等区划角色的（如
// 「Barrio of San Jose, Maricaban Island」）不是并列，必须拒收。
const ADM_UNIT = /^(?:Barrio|Barangay|Sitio|Municipality|Municipal District|Province|City|Region)$/i;
const CONJ = [' và ', ' และ ', ' dan ', ' dan '];
function enumItems(topic) {
  if (!topic) return null;
  const items = String(topic).split(/\s*,\s*|\s+and\s+/i).map((s) => s.trim()).filter(Boolean);
  if (items.length < 2) return null;
  // Osmeña 这类带附加拉丁字母的专名也要算进来，否则整段连词漏译
  const ok = items.every((x) => /^[A-Z][A-Za-z'’\u00C0-\u024F.\-]*(?:[\s-]+[A-Za-z'’\u00C0-\u024F.\-]+)*$/.test(x)
    && !/\b(?:Island|City|Province|Region|District|Mountain|River|Bay)\b/i.test(x)
    && !/^(?:All|Each|Any|Both|Others?|Respectively|Same)$/i.test(x));
  return ok ? items : null;
}
function isEnumList(s) {
  const g = LX.trGenus(s);
  if (!g || !g.core || !ADM_UNIT.test(g.core) || !g.topicRaw) return false;
  return !!enumItems(g.topicRaw);
}
const thName = (pre, body) => (/^[\u0E00-\u0E7F]/.test(body) ? pre + body : pre + ' ' + body);function locPhrase(loc, i) {
  if (!loc) return '';
  const list = LX.parseLoc(loc);
  if (!list.length) return '';
  const t = LX.locText(list, i);
  if (!t) return '';
  if (i === 1) return ' ใน' + t;
  return ' ' + AT[i] + ' ' + t;
}

// ── 尾部套语：从右向左剥离 ───────────────────────────────────────────
const SUFFIX = [
  { re: /,?\s*(?:and\s+)?for\s+Other\s+Purposes?(?:\s+Thereof)?\s*$/i, k: 'other' },
  { re: /,?\s*and\s+to\s+Authorize\s+the\s+Appropriations?\s+of\s+(?:the\s+)?(?:Necessary\s+|Additional\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  // 「and to Appropriate the Necessary Funds Therefor」「and to Authorize Appropriation of Funds Therefor」
  { re: /,?\s*and\s+to\s+(?:Appropriate|Authorize)\s+(?:the\s+)?(?:Appropriations?\s+of\s+)?(?:the\s+)?(?:Necessary\s+|Additional\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  // 「and to Authorize the Appropriation of Seventy Thousand Pesos for the Purpose」
  { re: /,?\s*and\s+to\s+(?:Appropriate|Authorize)\s+(?:the\s+)?(?:Appropriations?\s+of\s+)?(?:the\s+)?(?:Sum\s+of\s+)?[A-Z][\s\S]{0,80}?(?:Pesos|Centavos)\b[\s\S]*$/i, k: 'funds' },
  { re: /,?\s*(?:and\s+)?(?:Appropriating|Providing)\s+(?:the\s+)?(?:Necessary\s+)?(?:Additional\s+)?Funds?\s+Therefor\s+and\s+for\s+Other\s+Purposes\s*$/i, k: 'funds_other' },
  { re: /,?\s*(?:and\s+)?Authorizing\s+the\s+(?:Additional\s+)?Appropriations?\s+of\s+(?:the\s+)?(?:Necessary\s+|Additional\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  // 「and Authorizing the Appropriation of Two Hundred Fifty Thousand Pesos for the Purpose…」
  { re: /,?\s*(?:and\s+)?Authorizing\s+the\s+Appropriations?\s+of\s+(?:the\s+)?(?:Sum\s+of\s+)?[A-Z][\s\S]{0,80}?(?:Pesos|Centavos)\b[\s\S]*$/i, k: 'funds' },
  { re: /,?\s*(?:and\s+)?Appropriating\s+(?:the\s+)?(?:Sum\s+of\s+)?[A-Z][\s\S]{0,80}?(?:Pesos|Centavos)\b[\s\S]*$/i, k: 'funds' },
  { re: /,?\s*(?:and\s+)?(?:Appropriating|Providing|Authorizing|Mandating|Earmarking)\s+(?:the\s+)?(?:Necessary\s+)?(?:Additional\s+)?(?:Appropriations?\s+of\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  { re: /,?\s*Prescribing\s+the\s+Implementing\s+Rules\s+and\s+Regulations\s+Therefor\s*$/i, k: 'irr' },
  { re: /,?\s*Defining\s+Its\s+Objectives?,?\s+Powers,?\s+and\s+Functions\s*$/i, k: 'define' },
  { re: /,?\s*Defining\s+Its\s+Powers,?\s+Functions,?\s+and\s+Duties\s*$/i, k: 'define' },
  { re: /,?\s*Defining\s+Its\s+Purposes?\s+and\s+Objectives\s*$/i, k: 'define' },
  { re: /,?\s*as\s+Amended\s*$/i, k: 'drop' },
  { re: /,?\s*amending\s+for\s+(?:the\s+)?Purpose\b[\s\S]*$/i, k: 'drop' },
  { re: /,?\s*and\s+for\s+the\s+Purpose\s+of\b[\s\S]*$/i, k: 'drop' },
];
const TAILTXT = {
  funds: ['và phân bổ kinh phí cho mục đích này', 'และจัดสรรเงินทุนสำหรับการนี้', 'dan mengalokasikan dana untuk itu', 'dan memperuntukkan dana untuk itu'],
  other: ['và cho các mục đích khác', 'และเพื่อวัตถุประสงค์อื่น', 'dan untuk tujuan lain', 'dan untuk tujuan lain'],
  funds_other: ['phân bổ kinh phí cho mục đích này và cho các mục đích khác', 'จัดสรรเงินทุนสำหรับการนี้และเพื่อวัตถุประสงค์อื่น', 'mengalokasikan dana untuk itu dan untuk tujuan lain', 'memperuntukkan dana untuk itu dan untuk tujuan lain'],
  irr: ['và quy định các văn bản hướng dẫn thi hành', 'และกำหนดกฎระเบียบการดำเนินการ', 'dan menetapkan peraturan pelaksanaannya', 'dan menetapkan peraturan pelaksanaannya'],
  define: ['quy định mục tiêu, thẩm quyền và chức năng của tổ chức này', 'กำหนดวัตถุประสงค์ อำนาจ และหน้าที่ขององค์กรนี้', 'menetapkan tujuan, kewenangan, dan fungsinya', 'menetapkan objektif, kuasa, dan fungsinya'],
};

function peelTails(s) {
  let cur = s, kinds = [], guard = 0;
  while (guard++ < 8) {
    let hit = null;
    for (const { re, k } of SUFFIX) {
      const m = cur.match(re);
      if (m && m.index > 20) { hit = { m, k }; break; }
    }
    if (!hit) break;
    cur = cur.slice(0, hit.m.index).replace(/[,\s]+$/, '');
    if (hit.k !== 'drop') kinds.unshift(hit.k);
  }
  return { core: cur, kinds };
}
const DEDUP_KIND = new Set(['funds', 'other', 'funds_other', 'irr', 'define']);
function tailText(kinds, i) {
  const out = [];
  const seen = new Set();
  for (const k of kinds) {
    if (!k) continue;
    if (DEDUP_KIND.has(k) && seen.has(k)) continue;
    seen.add(k);
    out.push(TAILTXT[k][i]);
  }
  return out;
}

// ── 名词短语 ────────────────────────────────────────────────────────
// 合成过程中注入的专名（机构名/公司名）登记在此，供质量闸按条放行
let CUR_ALLOW = [];
const BADPROPER = /^(?:Portion|Part|Parcel|Said|Certain|All|Two|Three|Four|Five|Additional|Several|Existing|New|Old|Former|Present|Various|Other|Campus|Campuses|Office|Laboratory|Maternity|Marine|Children|Research|Breeding|Fisheries|Agricultural|Experimental|Demonstration|Pilot|Integrated|Special|Regular|Technical|Vocational|General|Public|Private|National|State|City|Municipal|Central|Regional|Provincial|District|Extension|Satellite|Annex)\b/;

function thing4(s) {
  if (!s) return null;
  const g = LX.trGenus(s);
  if (!g || !g.core) return null;        // 必须认出机构通名，否则交人工
  if (g.proper && BADPROPER.test(g.proper)) return null;   // 「Portion of …」这类不是专名
  // 「National Road」应为「Quốc lộ」，修饰语在前，槽位合成做不到
  if (g.mods && g.mods.some((m) => /^(?:National|State)$/.test(m)) && /^(?:Road|Highway|Street|Avenue|Boulevard)$/i.test(g.core)) return null;
  const out = [g[0], g[1], g[2], g[3]];
  if (out.some((x) => !x)) return null;
  // 区划类的多项列举：目标语连词替换掉英文 and
  if (ADM_UNIT.test(g.core) && g.topicRaw) {
    const items = enumItems(g.topicRaw);
    if (items) {
      for (let i = 0; i < 4; i++) {
        const tail = items.slice(0, -1).join(', ') + CONJ[i] + items[items.length - 1];
        out[i] = out[i].replace(g.topicRaw, tail);
      }
    }
  }
  if (g.proper && g.proper.length > 2) CUR_ALLOW.push(g.proper);
  return out;
}

// 「of Said Municipality / of the Same Municipality」——不译就变成「Barrio Said Municipality」，
// 把「上述某市」这个事实丢掉了。
const SAID = {
  Municipality: ['của thị trấn nói trên', 'ของเทศบาลดังกล่าว', 'dari kotamadya tersebut', 'daripada perbandaran tersebut'],
  City:         ['của thành phố nói trên', 'ของเมืองดังกล่าว', 'dari kota tersebut', 'daripada bandar tersebut'],
  Province:     ['của tỉnh nói trên', 'ของจังหวัดดังกล่าว', 'dari provinsi tersebut', 'daripada wilayah tersebut'],
  'Municipal District': ['của khu tự trị nói trên', 'ของเขตเทศบาลดังกล่าว', 'dari distrik kotamadya tersebut', 'daripada daerah perbandaran tersebut'],
};
function stripSaid(s) {
  const m = String(s || '').match(/^([\s\S]*?)\s+of\s+(?:Said|the\s+Same)\s+(Municipal\s+District|Municipality|City|Province)$/i);
  if (!m) return { core: s, said: null };
  const key = Object.keys(SAID).find((k) => k.toLowerCase() === m[2].toLowerCase().replace(/\s+/g, ' '));
  return { core: m[1].replace(/[,\s]+$/, ''), said: key || null };
}
function addSaid(arr, said, i) {
  return said ? (i === 1 ? arr[1] + SAID[said][1] : arr[i] + ' ' + SAID[said][i]) : arr[i];
}

// ── 句框 ────────────────────────────────────────────────────────────
const FRAMES = [];
const frame = (name, re, build) => FRAMES.push({ name, re, build });

// 1. 床位容量
frame('bedcap',
  /^(Increasing|Decreasing)\s+the\s+Bed\s+Capacity\s+of\s+([\s\S]+)$/i,
  (m) => {
    const inc = /^increas/i.test(m[1]);
    let rest = m[2].replace(/[,\s]+$/, '');
    let a = null, b = null;
    const rng = rest.match(/[\s,]+from\s+([\s\S]+?)\s+to\s+([\s\S]+?)\s+Beds?\s*$/i);
    if (rng) { a = numOf(rng[1]); b = numOf(rng[2]); rest = rest.slice(0, rng.index); }
    const { thing, loc } = splitLoc(rest);
    const t = thing4(thing);
    if (!t) return null;
    const out = [];
    for (let i = 0; i < 4; i++) {
      let s;
      if (i === 0) s = `${H[i]} ${inc ? 'tăng' : 'giảm'} sức chứa giường bệnh của ${t[i]}`;
      else if (i === 1) s = `${H[i]}${inc ? 'เพิ่ม' : 'ลด'}จำนวนเตียงของ${t[i]}`;
      else if (i === 2) s = `${H[i]} ${inc ? 'meningkatkan' : 'mengurangi'} kapasitas tempat tidur ${t[i]}`;
      else s = `${H[i]} ${inc ? 'meningkatkan' : 'mengurangkan'} kapasiti katil ${t[i]}`;
      s += locPhrase(loc, i);
      if (a && b) {
        if (i === 0) s += ` từ ${a} lên ${b} giường`;
        else if (i === 1) s += ` จาก ${a} เป็น ${b} เตียง`;
        else if (i === 2) s += ` dari ${a} menjadi ${b} tempat tidur`;
        else s += ` daripada ${a} kepada ${b} katil`;
      }
      out.push(s);
    }
    return out;
  });

// 2. 授予菲律宾公民身份
frame('citizen',
  /^Granting\s+Philippine\s+Citizenship\s+to\s+([\s\S]+)$/i,
  (m) => {
    const nm = m[1].replace(/[,\s]+$/, '');
    if (!/^[A-Z]/.test(nm)) return null;
    return [
      `${H[0]} trao quốc tịch Philippines cho ${nm}`,
      `${H[1]}ให้สัญชาติฟิลิปปินส์แก่ ${nm}`,
      `${H[2]} memberikan kewarganegaraan Filipina kepada ${nm}`,
      `${H[3]} memberikan kewarganegaraan Filipina kepada ${nm}`,
    ];
  });

// 3. 改地名 / 机构名
frame('chgname',
  /^Changing\s+the\s+Names?\s+of\s+([\s\S]+)$/i,
  (m) => {
    let rest = m[1].replace(/[,\s]+$/, '');
    const nm = rest.match(/^(.*?)[,\s]+to\s+([\s\S]+)$/i);
    if (!nm) return null;
    const { thing, loc } = splitLoc(nm[1]);
    const nw = nm[2].replace(/[,\s]+$/, '');
    const t = thing4(thing);
    const nt = thing4(nw);
    if (!t) return null;
    const useNt = nt || [nw, nw, nw, nw];
    const out = [];
    for (let i = 0; i < 4; i++) {
      let s;
      if (i === 0) s = `${H[0]} đổi tên ${t[0]} thành ${useNt[0]}`;
      else if (i === 1) s = `${H[1]}เปลี่ยนชื่อ${t[1]}เป็น ${useNt[1]}`;
      else if (i === 2) s = `${H[2]} mengubah nama ${t[2]} menjadi ${useNt[2]}`;
      else s = `${H[3]} menukar nama ${t[3]} kepada ${useNt[3]}`;
      // 地点插在旧名之后
      s = s.replace(' thành ', ' thành ');
      out.push(s);
    }
    // 地点：放在旧名与新名之间
    const res = [];
    for (let i = 0; i < 4; i++) {
      let before, after;
      if (i === 0) { before = `${H[0]} đổi tên ${t[0]}`; after = ` thành ${useNt[0]}`; }
      else if (i === 1) { before = `${H[1]}เปลี่ยนชื่อ${t[1]}`; after = ` เป็น ${useNt[1]}`; }
      else if (i === 2) { before = `${H[2]} mengubah nama ${t[2]}`; after = ` menjadi ${useNt[2]}`; }
      else { before = `${H[3]} menukar nama ${t[3]}`; after = ` kepada ${useNt[3]}`; }
      res.push(before + locPhrase(loc, i) + after);
    }
    return res;
  });

// 4. 更名（Renaming）
frame('rename',
  /^Renaming\s+([\s\S]+)$/i,
  (m) => {
    let rest = m[1].replace(/[,\s]+$/, '');
    const nm = rest.match(/^(.*?)[,\s]+(?:to|as|into)\s+([\s\S]+)$/i);
    if (!nm) return null;
    const { thing, loc } = splitLoc(nm[1]);
    const nw = nm[2].replace(/[,\s]+$/, '');
    if (/(?:formerly|presently|heretofore|now)\s+known\s+as/i.test(thing + ' ' + nw)) return null;
    const t = thing4(thing);
    if (!t) return null;
    const nt = thing4(nw);
    const useNt = nt || [nw, nw, nw, nw];
    const res = [];
    for (let i = 0; i < 4; i++) {
      let before, after;
      if (i === 0) { before = `${H[0]} đổi tên ${t[0]}`; after = ` thành ${useNt[0]}`; }
      else if (i === 1) { before = `${H[1]}เปลี่ยนชื่อ${t[1]}`; after = ` เป็น ${useNt[1]}`; }
      else if (i === 2) { before = `${H[2]} mengubah nama ${t[2]}`; after = ` menjadi ${useNt[2]}`; }
      else { before = `${H[3]} menukar nama ${t[3]}`; after = ` kepada ${useNt[3]}`; }
      res.push(before + locPhrase(loc, i) + after);
    }
    return res;
  });

// 5. 分立
frame('separate',
  /^Separating\s+([\s\S]+)$/i,
  (m) => {
    let rest = m[1].replace(/[,\s]+$/, '');
    // 「Separating X From Y, to Be Known as Z」——新名称漏掉就是丢事实，必须先取出
    let known = null;
    const km = rest.match(/[,\s]+to\s+be\s+known\s+as\s+(?:the\s+)?([\s\S]+)$/i);
    if (km) { known = km[1].replace(/[,\s]+$/, ''); rest = rest.slice(0, km.index); }
    const sp = rest.match(/^(.*?)[,\s]+from\s+([\s\S]+)$/i);
    if (!sp) return null;
    const { thing, loc } = splitLoc(sp[1]);
    const from = sp[2].replace(/[,\s]+$/, '');
    const t = thing4(thing);
    if (!t) return null;
    const f = thing4(from);
    if (!f) { if (global.__DBG) global.__DBG.push(['nofrom', from]); return null; }
    const kn = known ? thing4(known) : null;
    if (known && !kn) { if (global.__DBG) global.__DBG.push(['noknown', known]); return null; }
    const res = [];
    for (let i = 0; i < 4; i++) {
      let s;
      if (i === 0) s = `${H[0]} tách ${t[0]}` + locPhrase(loc, i) + ` khỏi ${f[0]}`;
      else if (i === 1) s = `${H[1]}แยก${t[1]}` + locPhrase(loc, i) + `ออกจาก${f[1]}`;
      else if (i === 2) s = `${H[2]} memisahkan ${t[2]}` + locPhrase(loc, i) + ` dari ${f[2]}`;
      else s = `${H[3]} mengasingkan ${t[3]}` + locPhrase(loc, i) + ` daripada ${f[3]}`;
      if (kn) {
        const kv = kn[i];
        if (i === 0) s += ` với tên gọi ${kv}`;
        else if (i === 1) s += thName(' ในชื่อ', kv);
        else s += ` dengan nama ${kv}`;
      }
      res.push(s);
    }
    return res;
  });

// 6. 升格 / 转制
frame('convert',
  /^Converting\s+([\s\S]+)$/i,
  (m) => {
    let rest = m[1].replace(/[,\s]+$/, '');
    let known = null;
    const km = rest.match(/[,\s]+to\s+be\s+(?:known|named)\s+as\s+(?:the\s+)?([\s\S]+)$/i);
    if (km) { known = km[1].replace(/[,\s]+$/, ''); rest = rest.slice(0, km.index); }
    const into = rest.match(/^(.*?)[,\s]+into\s+(?:a\s+|an\s+|the\s+)?([\s\S]+)$/i);
    if (!into) return null;
    const { thing, loc } = thingLoc(into[1]);
    // 宾语里还留着逗号，若不是「纯专名列举」就说明结构没切开
    // （「…, All in the …」「Corporation, Defining Its Powers…」），硬翻会漏/塞英文
    if (/[,]/.test(thing) && !isEnumList(thing)) { if (global.__DBG) global.__DBG.push(['commaObj', thing]); return null; }
    const ts = stripSaid(into[2].replace(/[,\s]+$/, ''));
    const target = ts.core;
    const t = thing4(thing);
    if (!t) return null;
    // 目标认不出通名时不能原样塞英文——那会让「National Road」直接漏进四语标题
    const tg = thing4(target);
    if (!tg) { if (global.__DBG) global.__DBG.push(['notarget', target]); return null; }
    const ks = stripSaid(known || '');
    const kn = ks.core ? thing4(ks.core) : null;
    if (ks.core && !kn) { if (global.__DBG) global.__DBG.push(['noknown', known]); return null; }
    const res = [];
    for (let i = 0; i < 4; i++) {
      let s;
      if (i === 0) s = `${H[0]} chuyển đổi ${t[0]}` + locPhrase(loc, i) + ` thành ${addSaid(tg, ts.said, 0)}`;
      else if (i === 1) s = `${H[1]}เปลี่ยนสถานะ${t[1]}` + locPhrase(loc, i) + ` เป็น ${addSaid(tg, ts.said, 1)}`;
      else if (i === 2) s = `${H[2]} mengubah ${t[2]}` + locPhrase(loc, i) + ` menjadi ${addSaid(tg, ts.said, 2)}`;
      else s = `${H[3]} menukar status ${t[3]}` + locPhrase(loc, i) + ` kepada ${addSaid(tg, ts.said, 3)}`;
      if (kn) {
        const kv = addSaid(kn, ks.said, i);
        if (i === 0) s += ` với tên gọi ${kv}`;
        else if (i === 1) s += thName(' ในชื่อ', kv);
        else s += ` dengan nama ${kv}`;
      }
      res.push(s);
    }
    return res;
  });

// 7. 设立 / 创建
frame('establish',
  /^(Establishing|Creating)\s+([\s\S]+)$/i,
  (m) => {
    let rest = m[2].replace(/[,\s]+$/, '');
    // 「… in the Municipality of A in the Province of B」两级地点要拆成逗号分段
    // 只折叠第二个及以后的地点标记：首个「in the X of」是机构名与地点的分界，必须保留
    {
      const re = /\s+in\s+the\s+(?=(?:City|Municipality|Municipalities|Province|Provinces|Barangay|Barrio|Island|District)\s+of\b)/gi;
      let seen = 0;
      rest = rest.replace(re, (mm) => (seen++ === 0 ? mm : ', '));
    }
    // 「in Each of the Municipalities of …」「in Any Municipality」不定指，落不到具体地名，交人工
    if (/\bin\s+(?:Each|Any|All|Every|Both)\b/i.test(rest)) { if (global.__DBG) global.__DBG.push(['indef', rest]); return null; }
    // 多地点并列：合成的并列链会把「和」读成「及」，交人工
    if (/\band\s+(?:in\s+)?the\s+(?:City|Municipality|Municipalities|Province|Barangay|Barrio|Island)\s+of\b/i.test(rest)) { if (global.__DBG) global.__DBG.push(['multiloc', rest]); return null; }
    let known = null, locKnown = '';
    const km = rest.match(/[,\s]+to\s+be\s+known\s+as\s+(?:the\s+)?([\s\S]+)$/i);
    if (km) {
      known = km[1].replace(/[,\s]+$/, '');
      rest = rest.slice(0, km.index);
      // 名称后面还可能挂着地点：「… to Be Known as Barangay X in the Municipality of Y」
      const sl = splitLoc(known);
      if (sl.loc) { known = sl.thing; locKnown = sl.loc; }
    }
    const { thing, loc: locBody } = thingLoc(rest);
    const loc = locBody || locKnown;
    if (/[,]/.test(thing) && !isEnumList(thing)) { if (global.__DBG) global.__DBG.push(['commaObj', thing]); return null; }
    if (/to\s+be\s+known\s+as/i.test(thing)) { if (global.__DBG) global.__DBG.push(['known', thing]); return null; }
    // 分割后地点为空，机构名里却还挂着「in <大写>」——说明地名链没切开，整条交人工
    if (!loc && /\b(?:in|at|within)\s+[A-Z][a-z]/.test(thing)) { if (global.__DBG) global.__DBG.push(['unsplit', thing]); return null; }
    if (/\band\s+in\s+(?:the\s+)?(?:City|Municipality|Province|Barangay)\b/i.test(loc)) { if (global.__DBG) global.__DBG.push(['multiloc', loc]); return null; }
    if (/\b(?:Branch|Extension|Annex|Satellite|Sub-?office)\b/i.test(thing) && /\bof\s+(?:the\s+)?[A-Z]/.test(thing)) {
      if (global.__DBG) global.__DBG.push(['branch', thing]); return null;
    }
    // 「<通名> of <专名>」里的后半段认不出（如 School Division of Tagbilaran City），
    // 说明通名本身没收录，强拼会得到「Trường Thành phố Division of」这种残句
    const raw0 = LX.trGenus(thing);
    // 区划通名（Barrio/Sitio/Municipality…）本来就「通名 of 专名」，
    // 只有非区划类（如 School Division of Tagbilaran City）才说明通名没收录。
    const ADMKIND = /^(?:Barrio|Barangay|Sitio|City|Municipality|Municipal District|Municipalities|Province|Provinces|Subprovince|Sub-?[Pp]rovince|Region|Island|District|Lone District)$/i;
    if (raw0 && raw0.topicRaw && !(ADMKIND.test(raw0.core || ''))) { if (global.__DBG) global.__DBG.push(['topicraw', thing]); return null; }
    // proper 里还留着 of（「a Division of City Schools」），说明通名没认出来、结构没切开
    if (raw0 && /\bof\b/i.test(raw0.proper || '')) { if (global.__DBG) global.__DBG.push(['properof', thing]); return null; }
    const t = thing4(thing);
    if (!t) { if (global.__DBG) global.__DBG.push(['nocore', thing + ' || ' + loc]); return null; }
    const res = [];
    for (let i = 0; i < 4; i++) {
      let s;
      if (i === 0) s = `${H[0]} thành lập ${t[0]}`;
      else if (i === 1) s = `${H[1]}จัดตั้ง${t[1]}`;
      else if (i === 2) s = `${H[2]} membentuk ${t[2]}`;
      else s = `${H[3]} menubuhkan ${t[3]}`;
      s += locPhrase(loc, i);
      if (known) {
        const kn = thing4(known);
        const kv = kn ? kn[i] : known;
        if (i === 0) s += ` với tên gọi ${kv}`;
        else if (i === 1) s += thName(' ในชื่อ', kv);
        else s += ` dengan nama ${kv}`;
      }
      res.push(s);
    }
    return res;
  });

// 8. 拨款 —— 停用
// 「Appropriating <金额> to Defray the Expenses of …」的宾语是动名词短语，机构名槽位放不进去；
// 实测输出把 purpose 误当机构名（「cho Cục Adjustments of the Salaries…」），故该族 225 条全部交人工。

// 9. 特许经营权续期 / 延期
frame('franchise_renew',
  /^(?:Renewing|Extending) for (?:Another )?([\s\S]+?)\s+Years?\s+(?:the|its)\s+Franchise\s+(?:Granted|Issued|Conferred)\s+to\s+([\s\S]+)$/i,
  (m) => {
    const n = numOf(m[1]);
    if (!n) return null;
    let rest = m[2].replace(/[,\s]+$/, '');
    // 掐掉「Under Republic Act No. …」「Presently Known as …」等后续说明
    const cut = rest.split(/[,\s]+(?:Under\s+Republic\s+Act|Presently\s+Known\s+as|Under\s+Republic\s+Act\s+No)/i)[0];
    const co = cut.replace(/[,\s]+$/, '');
    if (!/^[A-Z]/.test(co)) return null;
    const res = [];
    for (let i = 0; i < 4; i++) {
      if (i === 0) res.push(`${H[0]} gia hạn thêm ${n} năm quyền khai thác đã cấp cho ${co}`);
      else if (i === 1) res.push(`${H[1]}ต่ออายุสัมปทานที่ให้แก่ ${co} อีก ${n} ปี`);
      else if (i === 2) res.push(`${H[2]} memperpanjang waralaba yang diberikan kepada ${co} selama ${n} tahun lagi`);
      else res.push(`${H[3]} memperbaharui francais yang diberikan kepada ${co} selama ${n} tahun lagi`);
    }
    return res;
  });

// 10. 授予特许经营权
frame('franchise_grant',
  /^Granting\s+([\s\S]+?)\s+a\s+(?:Franchise|Temporary\s+Permit)\s+to\s+([\s\S]+)$/i,
  (m) => {
    const co = m[1].replace(/[,\s]+$/, '');
    if (!/^[A-Z]/.test(co)) return null;
    const pred = m[2].replace(/[,\s]+$/, '');
    const p = PRED(pred);
    if (!p) return null;
    const res = [];
    for (let i = 0; i < 4; i++) {
      if (i === 0) res.push(`${H[0]} cấp quyền khai thác cho ${co} để ${p[0]}`);
      else if (i === 1) res.push(`${H[1]}ให้สัมปทานแก่ ${co} เพื่อ${p[1]}`);
      else if (i === 2) res.push(`${H[2]} memberikan waralaba kepada ${co} untuk ${p[2]}`);
      else res.push(`${H[3]} memberikan francais kepada ${co} untuk ${p[3]}`);
    }
    return res;
  });

// 营运行为短语（特许经营类）
const PV = [
  ['construct', 'xây dựng', 'ก่อสร้าง', 'membangun', 'membina'],
  ['establish', 'thiết lập', 'จัดตั้ง', 'mendirikan', 'menubuhkan'],
  ['install', 'lắp đặt', 'ติดตั้ง', 'memasang', 'memasang'],
  ['operate', 'vận hành', 'ดำเนินการ', 'mengoperasikan', 'mengendalikan'],
  ['maintain', 'duy trì', 'บำรุงรักษา', 'memelihara', 'menyelenggara'],
  ['provide', 'cung cấp', 'ให้บริการ', 'menyediakan', 'menyediakan'],
  ['extend', 'mở rộng', 'ขยาย', 'memperluas', 'meluaskan'],
];
const OBJ = [
  ['Radio and Television Broadcasting Stations', 'hệ thống phát thanh và truyền hình', 'สถานีวิทยุกระจายเสียงและวิทยุโทรทัศน์', 'stasiun penyiaran radio dan televisi', 'stesen penyiaran radio dan televisyen'],
  ['Radio Broadcasting Stations', 'hệ thống phát thanh', 'สถานีวิทยุกระจายเสียง', 'stasiun penyiaran radio', 'stesen penyiaran radio'],
  ['Television Broadcasting Stations', 'hệ thống truyền hình', 'สถานีวิทยุโทรทัศน์', 'stasiun penyiaran televisi', 'stesen penyiaran televisyen'],
  ['Broadcasting Stations', 'hệ thống phát thanh truyền hình', 'สถานีกระจายเสียงและแพร่ภาพ', 'stasiun penyiaran', 'stesen penyiaran'],
  ['Waterworks System and Sewerage and Sanitation Services', 'hệ thống cấp nước và dịch vụ thoát nước, vệ sinh', 'ระบบประปาและบริการระบายน้ำเสียและสุขาภิบาล', 'sistem air bersih serta layanan saluran air limbah dan sanitasi', 'sistem bekalan air serta perkhidmatan pembetungan dan sanitasi'],
  ['Waterworks System', 'hệ thống cấp nước', 'ระบบประปา', 'sistem air bersih', 'sistem bekalan air'],
  ['Electric Power Distribution', 'phân phối điện năng', 'การจำหน่ายไฟฟ้า', 'distribusi tenaga listrik', 'pengagihan tenaga elektrik'],
  ['Telecommunications System', 'hệ thống viễn thông', 'ระบบโทรคมนาคม', 'sistem telekomunikasi', 'sistem telekomunikasi'],
];
const WHERE = [
  ['throughout the Philippines', 'trên toàn lãnh thổ Philippines', 'ทั่วประเทศฟิลิปปินส์', 'di seluruh wilayah Filipina', 'di seluruh wilayah Filipina'],
  ['in the Philippines', 'tại Philippines', 'ในฟิลิปปินส์', 'di Filipina', 'di Filipina'],
];
function PRED(s) {
  let x = s.trim();
  let where = null;
  for (const w of WHERE) {
    const re = new RegExp('[,\\s]+' + w[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    if (re.test(x)) { where = w; x = x.replace(re, ''); break; }
  }
  x = x.replace(/[,\s]+$/, '');
  // 拆动词序列
  const parts = x.split(/\s*,\s*(?:and\s+)?|\s+and\s+/i).map((t) => t.trim()).filter(Boolean);
  if (!parts.length) return null;
  const vs = [];
  for (const p of parts) {
    const hit = PV.find((v) => v[0].toLowerCase() === p.toLowerCase());
    if (!hit) return null;
    vs.push(hit);
  }
  // 宾语
  const last = parts[parts.length - 1];
  let obj = null;
  for (const o of OBJ) {
    if (new RegExp(o[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i').test(x)) { obj = o; break; }
  }
  if (!obj) {
    // 「Establish, Operate, and Maintain a Waterworks System ...」宾语也可在末句
    for (const o of OBJ) {
      if (new RegExp('(?:a|an|the)\\s+' + o[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(x)) { obj = o; break; }
    }
  }
  if (!obj) return null;
  const res = [];
  for (let i = 0; i < 4; i++) {
    const vsTxt = vs.map((v) => v[i + 1]);
    let t;
    if (i === 0) t = vsTxt.join(', ') + ' ' + obj[1];
    else if (i === 1) t = vsTxt.join(' ') + obj[2];
    else t = vsTxt.join(', ') + ' ' + obj[i + 1];
    if (where) t += (i === 1 ? ' ' : ' ') + where[i + 1];
    res.push(t);
  }
  return res;
}

// 11. 宣告纪念日 / 特别假日
const MON = {
  january: ['1', 'มกราคม', 'Januari', 'Januari'], february: ['2', 'กุมภาพันธ์', 'Februari', 'Februari'],
  march: ['3', 'มีนาคม', 'Maret', 'Mac'], april: ['4', 'เมษายน', 'April', 'April'],
  may: ['5', 'พฤษภาคม', 'Mei', 'Mei'], june: ['6', 'มิถุนายน', 'Juni', 'Jun'],
  july: ['7', 'กรกฎาคม', 'Juli', 'Julai'], august: ['8', 'สิงหาคม', 'Agustus', 'Ogos'],
  september: ['9', 'กันยายน', 'September', 'September'], october: ['10', 'ตุลาคม', 'Oktober', 'Oktober'],
  november: ['11', 'พฤศจิกายน', 'November', 'November'], december: ['12', 'ธันวาคม', 'Desember', 'Disember'],
};
const HOLKIND = [
  [/^(?:special\s+)?non-?working\s+holiday/i, ['ngày nghỉ lễ đặc biệt', 'วันหยุดพิเศษ', 'hari libur khusus', 'hari cuti khas']],
  [/^special\s+working\s+holiday/i, ['ngày làm việc lễ đặc biệt', 'วันทำงานพิเศษ', 'hari kerja khusus', 'hari bekerja khas']],
  [/^special\s+(?:public\s+)?holiday/i, ['ngày lễ đặc biệt', 'วันหยุดพิเศษ', 'hari libur khusus', 'hari cuti khas']],
  [/^regular\s+holiday/i, ['ngày lễ thường lệ', 'วันหยุดตามปกติ', 'hari libur reguler', 'hari cuti biasa']],
  [/^local\s+holiday/i, ['ngày lễ địa phương', 'วันหยุดท้องถิ่น', 'hari libur lokal', 'hari cuti tempatan']],
];
// ── 主流程 ──────────────────────────────────────────────────────────
const COMM_AT_END = [
  [/[,\s]+(?:in\s+[Cc]ommemoration\s+of|to\s+[Cc]ommemorate)\s+its\s+Found(?:ation|ing)\s+(?:Day|Anniversary)\s*$/i, 'found'],
  [/[,\s]+(?:in\s+[Cc]ommemoration\s+of|to\s+[Cc]ommemorate)\s+the\s+Birth\s+Anniversary\s+of\s+([\s\S]+)$/i, 'birth'],
  [/[,\s]+(?:in\s+[Cc]ommemoration\s+of|to\s+[Cc]ommemorate)\s+the\s+Death\s+Anniversary\s+of\s+([\s\S]+)$/i, 'death'],
];
function stripComm(s) {
  for (const [re, k] of COMM_AT_END) {
    const m = s.match(re);
    if (m) return { rest: s.slice(0, m.index), kind: k, name: m[1] ? m[1].replace(/[,\s]+$/, '') : null };
  }
  return null;
}
const KNOWNRE = /[,\s]+to\s+be\s+[Kk]nown\s+as\s+/i;
function buildDeclare(mon, day, body) {
  let rest = body.replace(/[,\s]+$/, '');
  let known = null, comm = null, commName = null;
  const ki = rest.search(KNOWNRE);
  if (ki >= 0) {
    const head = rest.slice(0, ki);
    const tail = rest.slice(ki).replace(KNOWNRE, '').replace(/^[,\s]+/, '');
    // 名称只有两种合法形态：① 引号串 ② 到第一个逗号为止的裸名。
    // 闭合后仍挂着的从句（and in Recognition of … / Repealing for the Purpose …）
    // 只能用 stripComm 认领，认不出来就整条拒收——把它塞进名称里就是吞事实。
    let leftover = '';
    // 「to Be Known as "A" or "B"」——两个并列名称，不能只取第一个把另一个丢了
    const two = tail.match(/^[\u201C\u2018"']([^\u201C\u201D\u2018\u2019"']{1,120})[\u201D\u2019"']\s+(?:or|and)\s+[\u201C\u2018"']([^\u201C\u201D\u2018\u2019"']{1,120})[\u201D\u2019"']$/i);
    const qm = tail.match(/^[\u201C\u2018"']([^\u201C\u201D\u2018\u2019"']{1,120})[\u201D\u2019"']([\s\S]*)$/);
    if (two) { known = '"' + two[1].trim() + '" or "' + two[2].trim() + '"'; leftover = ''; }
    else if (qm) { known = qm[1].trim(); leftover = qm[2]; }
    else {
      const ci = tail.search(/,/);
      if (ci >= 0) { known = tail.slice(0, ci); leftover = tail.slice(ci); }
      else { known = tail; leftover = ''; }
    }
    known = known.replace(/^[,\s]+|[,\s]+$/g, '');
    leftover = leftover.replace(/^[,\s]+/, '');
    // COMM_AT_END 要求从句前面有逗号分隔（「…, in Commemoration of …」），
    // 这里已在提取名称时把逗号剥掉了，要补回来再匹配，否则会把正常句子误判成多余从句。
    const c1 = stripComm(leftover ? ', ' + leftover : '');
    if (c1) {
      if (!comm) { comm = c1.kind; commName = c1.name; }
      leftover = c1.rest.replace(/^[,\s]+|[,\s]+$/g, '');
    } else leftover = leftover.replace(/[,\s]+$/, '');
    if (leftover.trim()) return null;
    const c2 = stripComm(head);
    if (!comm && c2) { comm = c2.kind; commName = c2.name; rest = c2.rest; }
    else rest = head;
  } else {
    const c3 = stripComm(rest);
    if (c3) { comm = c3.kind; commName = c3.name; rest = c3.rest; }
  }
  rest = rest.replace(/[,\s]+$/, '');
  // 假日类型
  rest = rest.replace(/^(?:as\s+)?(?:a\s+|an\s+)?/i, '');
  let kind = null;
  for (const [re, t] of HOLKIND) {
    const hm = rest.match(re);
    if (hm) { kind = t; rest = rest.slice(hm[0].length); break; }
  }
  // 直接给名称：「as "National Press Freedom Day"」
  if (!kind && !known) {
    const qm = rest.match(/^as\s+["“]([^"”]+)["”]$/i);
    if (qm) { known = qm[1]; rest = ''; }
  }
  let loc = '';
  const lm = rest.match(/^[,\s]*in\s+(?:the\s+)?([\s\S]+)$/i);
  if (lm) {
    const cand = lm[1].replace(/[,\s]+$/, '');
    // 整串必须被「区划链」完整消费：`, in Commemoration of the Surrender of …`
    // 这类从句里也含 Province，含糊放行就是把从句当成地名写进标题（丢字段、多事实）。
    if (strictLoc(cand)) { loc = cand; rest = ''; }
    else return null;
  }
  if (rest.replace(/[,\s]+$/, '').trim()) return null;
  if (!kind && !known) return null;
  if (known && known.length > 120) return null;
  // 名称若已带引号则原样保留，避免出现双层引号。
  // 「To Be Known as the "X"」里的前导冠词不能进名称，否则会变成 `"the "X""`。
  let kn = null;
  if (known) {
    let kh = known.replace(/^(?:The|A|An)\s+/i, '');
    // 并列两名（「"A" or "B"」）时不能剥外层引号，否则中间的引号会破掉
    if (!/"\s+or\s+"/i.test(kh)) kh = kh.replace(/^[\u201C\u2018"']([\s\S]*)[\u201D\u2019"']$/, '$1');
    kn = (/^[\u201C\u2018"']/.test(kh) && /[\u201D\u2019"']$/.test(kh)) ? kh : '"' + kh + '"';
    known = kh;
  }
  const out = [];
  for (let i = 0; i < 4; i++) {
    const d = i === 0 ? `ngày ${day} tháng ${mon[0]} hằng năm`
      : i === 1 ? `วันที่ ${day} ${mon[1]}ของทุกปี`
        : i === 2 ? `tanggal ${day} ${mon[2]} setiap tahun`
          : `${day} ${mon[3]} setiap tahun`;
    let s;
    if (i === 0) s = `${H[0]} tuyên bố ${d}`;
    else if (i === 1) s = `${H[1]}ประกาศให้${d}`;
    else if (i === 2) s = `${H[2]} menetapkan ${d}`;
    else s = `${H[3]} mengisytiharkan ${d}`;
    const asWord = i === 0 ? ' là ' : i === 1 ? 'เป็น' : ' sebagai ';
    const KN = kn ? kn.replace(/\s+or\s+/gi, [' hoặc ', ' หรือ ', ' atau ', ' atau '][i]) : kn;
    s += asWord + (kind ? kind[i] : KN);
    if (loc) s += locPhrase(loc, i);
    if (known && kind) {
      if (i === 0) s += ` với tên gọi ${KN}`;
      else if (i === 1) s += thName(' ในชื่อ', KN);
      else s += ` dengan nama ${KN}`;
    }
    if (comm === 'found') s += [' , nhân kỷ niệm Ngày Thành lập của địa phương', ' เนื่องในโอกาสวันสถาปนา', ', dalam rangka memperingati Hari Jadi', ', sempena memperingati Hari Penubuhan'][i].replace(/^ ,/, ',');
    if (comm === 'birth' && commName) s += [`, nhân kỷ niệm ngày sinh của ${commName}`, ` เนื่องในโอกาสครบรอบวันเกิดของ ${commName}`, `, dalam rangka memperingati hari lahir ${commName}`, `, sempena memperingati hari kelahiran ${commName}`][i];
    if (comm === 'death' && commName) s += [`, nhân kỷ niệm ngày mất của ${commName}`, ` เนื่องในโอกาสครบรอบการถึงแก่อสัญกรรมของ ${commName}`, `, dalam rangka memperingati hari wafat ${commName}`, `, sempena memperingati hari kematian ${commName}`][i];
    out.push(s);
  }
  if (known) CUR_ALLOW.push(known.replace(/["“”]/g, ''));
  if (commName) CUR_ALLOW.push(commName);
  return out;
}
frame('declare_day',
  /^Declaring\s+([A-Za-z]+)\s+(\d{1,2})\s+of\s+Every\s+Year\s+([\s\S]+)$/i,
  (m) => {
    const mon = MON[m[1].toLowerCase()];
    if (!mon) return null;
    const r = buildDeclare(mon, m[2], m[3]);
    if (!r) return null;
    // 泰文词间不加空格：两端均为泰文字符的空格去掉
    r[1] = r[1].replace(/([\u0E00-\u0E7F])\s+(?=[\u0E00-\u0E7F])/g, '$1');
    return r;
  });




function parse(title) {
  CUR_ALLOW = [];
  let s = fixOcr(spellYear(norm(title)));
  if (!s) return { why: 'empty' };
  // 单纯法名（《司法重组法 1980》一类）在拆句框之前先查表
  const act0 = ACTS.lookup(s);
  if (act0) {
    return { frame: 'acts', allow: [], out: { vi: LX.thFix(act0.vi), th: LX.thFix(act0.th), id: LX.thFix(act0.id), ms: LX.thFix(act0.ms) } };
  }
  const lead = s.match(/^(?:An?\s+|THE\s+|The\s+)?(?:Act|Republic\s+Act|Batas\s+Pambansa)\s+(?:No\.?\s*\d+\s*)?(?:to\s+)?/i);
  if (!lead) return { why: 'noact' };
  let body = s.slice(lead[0].length).replace(/^\s+/, '');
  if (!body) return { why: 'nobody' };
  if (/^(An?\s+)?Act\b/i.test(body)) return { why: 'dup' };
  // 动词原形归一：老法常写「An Act Provide for …」「An Act Create the …」
  const VING = {
    provide: 'Providing', create: 'Creating', establish: 'Establishing', convert: 'Converting',
    change: 'Changing', extend: 'Extending', increase: 'Increasing', separate: 'Separating',
    rename: 'Renaming', authorize: 'Authorizing', appropriate: 'Appropriating', declare: 'Declaring',
    grant: 'Granting', constitute: 'Constituting', reappropriate: 'Reappropriating',
    renew: 'Renewing', name: 'Naming', transfer: 'Transferring', upgrade: 'Upgrading',
    fix: 'Fixing', exempt: 'Exempting', amend: 'Amending', prohibit: 'Prohibiting',
    divide: 'Dividing', integrate: 'Integrating', recognize: 'Recognizing', prescribe: 'Prescribing',
  };
  body = body.replace(/^([A-Za-z]+)\b/, (m, w) => VING[w.toLowerCase()] || m);
  // 动词后的不定/定冠词不属于实体名，统一剥掉（Establishing the X / Creating a Barangay）
  body = body.replace(/^([A-Za-z]+)\s+(?:the|a|an)\s+/i, (m, w) => (/^(?:Establishing|Creating|Converting|Separating|Renaming|Changing|Naming|Constituting|Upgrading|Extending|Increasing|Expanding|Dividing|Transferring|Declaring|Fixing|Standardizing|Authorizing|Providing)$/i.test(w) ? w + ' ' : m));
  const { core, kinds } = peelTails(body);
  // 单纯法名（《司法重组法 1980》一类）走对照表
  const act = ACTS.lookup(core);
  if (act) {
    const res = [];
    for (let i = 0; i < 4; i++) {
      let line = act[LANGS[i]];
      for (const t of tailText(kinds, i)) line += (i === 1 ? ' ' : ', ') + t;
      res.push(LX.thFix(line));
    }
    return { frame: 'acts', allow: CUR_ALLOW.slice(), out: { vi: res[0], th: res[1], id: res[2], ms: res[3] } };
  }
  for (const f of FRAMES) {
    const m = core.match(f.re);
    if (!m) continue;
    const out = f.build(m);
    if (!out) return { why: 'slot-' + f.name };
    const tails = tailText(kinds, 0);
    const res = [];
    for (let i = 0; i < 4; i++) {
      const tt = tailText(kinds, i);
      let line = out[i];
      for (const t of tt) line += (i === 1 ? ' ' : ', ') + t;
      res.push(LX.thFix(line));
    }
    return { frame: f.name, allow: CUR_ALLOW.slice(), out: { vi: res[0], th: res[1], id: res[2], ms: res[3] } };
  }
  return { why: 'noframe' };
}

function main() {
  const argv = process.argv.slice(2);
  const outIdx = argv.indexOf('--out');
  const outPath = outIdx >= 0 ? argv[outIdx + 1] : null;
  const show = argv.includes('--show');
  const list = require('./_ph_rest.json');
  const items = {};
  const stat = {};
  const pushed = [];
  for (const x of list) {
    const r = parse(x.title.en || x.title.orig || '');
    if (r.out) {
      const bad = gate(r.out, r.allow);
      if (bad) { stat['gate:' + bad] = (stat['gate:' + bad] || 0) + 1; continue; }
      items[x.id] = r.out;
      stat['ok:' + r.frame] = (stat['ok:' + r.frame] || 0) + 1;
      pushed.push({ id: x.id, en: x.title.en, out: r.out });
    } else {
      stat[r.why] = (stat[r.why] || 0) + 1;
    }
  }
  console.log('候选', list.length, '| 产出', Object.keys(items).length);
  Object.entries(stat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k.padEnd(24), v));
  if (show) pushed.slice(0, Number(show === true ? 8 : show)).forEach((p) => {
    console.log('\n· ' + p.en.slice(0, 160));
    for (const L of LANGS) console.log('   ' + L + ': ' + p.out[L]);
  });
  if (outPath) {
    fs.writeFileSync(path.join(__dirname, outPath), JSON.stringify({ items }, null, 1), 'utf8');
    console.log('写出', outPath);
  }
}

if (require.main === module) main();
module.exports = { parse, FRAMES, thingLoc, thing4, peelTails };
