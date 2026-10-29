/* ==========================================================================
   _ext_import.js —— 收外部译稿（*.out.jsonl），过闸门，打成可入库的批次 JSON

   用法：
     node _ext_import.js <文件或目录> [--dry] [--min 0.5]
       文件：单个 .out.jsonl
       目录：递归收该目录下全部 .out.jsonl
       --dry   只校验不写批次
       --min   通过率门槛（默认 0.5，低于此值提示「可能整批不合规」）

   过闸门顺序：结构 → 字符集 → 占位/兜底 → 数字 → 残句/区划 → 长度
   产物：
     _ext_batches/<原名>.<批号>.json   apply-multi.js 可直接吃
     _ext_bad.txt                      逐条退回原因（按 key 分组，便于退回重译）
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const MASTER = path.join(__dirname, '_ext_master.json');
const OUTDIR = path.join(__dirname, '_ext_batches');
const BAD = path.join(__dirname, '_ext_bad.txt');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const TARGET = args.find((a) => !a.startsWith('--'));
const iMin = args.indexOf('--min');
const MIN = iMin >= 0 ? +args[iMin + 1] : 0.5;
/* --skip ID,MY：整国别隔离。用于「该批系统性不合格、整体退回重译」的情形，
   被隔离的条目不再逐条报错，单独计数，避免淹没真正需要修的条目。 */
const iSkip = args.findIndex((a) => a.startsWith('--skip'));
const SKIP = new Set(iSkip >= 0 ? String(args[iSkip].split('=')[1] || args[iSkip + 1] || '').split(',').map((x) => x.trim().toUpperCase()).filter(Boolean) : []);
if (!TARGET) { console.error('用法：node _ext_import.js <文件或目录> [--dry]'); process.exit(1); }

const master = JSON.parse(fs.readFileSync(MASTER, 'utf8')).idx;
const LANGS = ['zh', 'en', 'vi', 'th', 'id', 'ms'];
const DROP = new Set(['key', 'co', 'src', 'lang', 'need', 'note', 'dn', 'have', 'trunc']);

const RE = {
  han: /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/,
  thai: /[\u0E00-\u0E7F]/,
  khmer: /[\u1780-\u17FF\u19E0-\u19FF]/,
  myanmar: /[\u1000-\u109F\uAA60-\uAA7F]/,
  lao: /[\u0E80-\u0EFF]/,
  latin: /[A-Za-z\u00C0-\u024F]/,
  viMark: /[ăâđêôơưĂÂĐÊÔƠƯàảãáạằẳẵắặầẩẫấậèẻẽéẹềểễếệìỉĩíịòỏõóọồổỗốộờởỡớợùủũúụừửữứựỳỷỹýỵ]/,
  placeholder: /(\bTBD\b|\bTODO\b|FIXME|待补|待定|待译|xxx+|\?\?\?)/i,
  fallbackBar: /\|\|/,
  bookMark: /[《》]/,
};
/* 残留英文虚词：译名里出现「 and 」「 of 」「 the 」这类独立词，说明句子没译完 */
const RESIDUE = [
  /\b(the|and|of|for|with|from|that|which|shall|therefor)\b/i,
  /\b(dan|untuk|dengan|yang|dari|pada|serta|oleh|ini|itu)\b/i,     // 印尼/马来虚词……在 id/ms 里是正常的
];

/* 印尼语/马来语标记词（源文全大写，故只按大写匹配）；中文层残留、目标层未译都靠它识别 */
const IDSTOP = /\b(DAN|ATAU|TENTANG|YANG|UNTUK|DENGAN|PADA|ATAS|DARI|NOMOR|TAHUN|UNDANG|PERATURAN|MENTERI|PRESIDEN|PEMBENTUKAN|PENETAPAN|PENGESAHAN|PENUNJUKAN|PEMUNGUTAN|PENGELOLAAN|PENGGUNAAN|KEPUTUSAN|PERUBAHAN|PENGANGKATAN|PEMBAGIAN|PENYELENGGARAAN|PENANAMAN|PEMERINTAH|DAERAH|KABUPATEN|PROVINSI|PAJAK|IZIN|USAHA|NEGARA|HUKUM|KEPALA|BADAN|LEMBAGA|SUSUNAN|PENERBITAN|PENGANGKUTAN|PERHUBUNGAN|KESEHATAN|PENDIDIKAN)\b/;
const capsWords = (s) => s.match(/\b[A-Z][A-Z0-9]{2,}\b/g) || [];

const latinRatio = (s) => {
  const a = Array.from(s);
  return a.length ? a.filter((c) => RE.latin.test(c)).length / a.length : 0;
};

/* ---------- 单条校验 -------------------------------------------------------- */
function checkItem(rec) {
  const errs = [], warns = [];
  const m = master[rec.key];
  if (!m) return { errs: ['key 不在清单里'] , warns, out: null };

  const out = {};
  for (const k of Object.keys(rec)) {
    if (k === 'key') continue;
    if (!LANGS.includes(k)) { if (!DROP.has(k)) warns.push('多余字段 ' + k + ' 已忽略'); continue; }
    if (!m.need.includes(k) && !LANGS.some((x) => x === k)) { warns.push('清单未要求的语种 ' + k + ' 已忽略'); continue; }
    if (!m.need.includes(k)) { warns.push('本条不需要 ' + k + '，已忽略'); continue; }
    const v = String(rec[k] == null ? '' : rec[k]).replace(/\s+/g, ' ').trim();
    if (!v) { errs.push(k + ' 为空'); continue; }
    out[k] = v;
  }
  for (const k of m.need) if (!out[k]) errs.push(k + ' 缺失');

  for (const [k, v] of Object.entries(out)) {
    const n = Array.from(v).length;
    /* 上限按语种分档：库内实测 zh 最长 203；vi/th/id/ms 最长 742–859（长题的直译本就长），
       早期统一 300 是凭空设的护栏，会把合法长题全退掉。 */
    const maxLen = k === 'zh' ? 300 : 900;
    if (n < 2 || n > maxLen) errs.push(k + ' 长度 ' + n + '，超出 2–' + maxLen);
    if (RE.placeholder.test(v)) errs.push(k + ' 含占位符');
    if (RE.fallbackBar.test(v)) errs.push(k + ' 含「|| 原文」兜底');

    if (k === 'zh') {
      if (!RE.han.test(v)) errs.push('zh 无汉字');
      if (RE.thai.test(v) || RE.khmer.test(v) || RE.myanmar.test(v) || RE.lao.test(v)) errs.push('zh 混入其他文字');
      const nOpen = (v.match(/《/g) || []).length, nClose = (v.match(/》/g) || []).length;
      if (nOpen !== nClose) errs.push('zh 书名号不成对');
      else if (nOpen && (/^《/.test(v) || /》$/.test(v))) warns.push('zh 以书名号整体包裹');
      /* 拉丁字母本身不判罪：地名/人名/机构名保留拉丁是库内既定做法。
         只有当「出现全大写残留词且占比偏高」或「整体几乎全是拉丁」时才判未译。 */
      const capsZh = capsWords(v), lr = latinRatio(v);
      if (IDSTOP.test(v) || (capsZh.length >= 1 && lr > 0.3) || lr > 0.75) {
        errs.push('zh 疑未译（拉丁占比 ' + (lr * 100).toFixed(0) + '%，残留 ' + capsZh.slice(0, 2).join('、') + '）');
      }
      if (/^(一部|一项|关于的)/.test(v)) errs.push('zh 以「一部/一项」开头');
    } else if (k === 'th') {
      if (!RE.thai.test(v)) errs.push('th 无泰文');
      if (RE.han.test(v)) errs.push('th 含汉字');
      if (RE.khmer.test(v)) errs.push('th 含高棉文');
      if (/ {2,}/.test(v)) warns.push('th 有多余空格');
    } else if (k === 'en') {
      if (RE.han.test(v) || RE.thai.test(v) || RE.khmer.test(v)) errs.push('en 混入非拉丁文字');
    } else {
      if (RE.han.test(v) || RE.thai.test(v) || RE.khmer.test(v) || RE.myanmar.test(v) || RE.lao.test(v)) errs.push(k + ' 混入其他文字');
      if (latinRatio(v) < 0.5) warns.push(k + ' 拉丁字母占比偏低');
      if (k === 'vi' && !RE.viMark.test(v)) errs.push('vi 无声调符号（疑非越南文）');
      if (k === 'ms' && /\b(Undang-Undang|Kotamadya|Pribadi|Peraturan Pemerintah)\b/.test(v)) warns.push('ms 疑用印尼语对照名');
      if (k === 'id' && /\b(Akta|Perbandaran|Peribadi|Wilayah)\b/.test(v)) warns.push('id 疑用马来语对照名');
      if (k === 'id' && RE.thai.test(v)) errs.push('id 含泰文');
      const caps = capsWords(v);
      if (caps.length >= 3 || (caps.length >= 2 && IDSTOP.test(v))) {
        errs.push(k + ' 疑保留原文未译（' + caps.slice(0, 3).join('、') + '）');
      }
    }
    /* 残句：只剩虚词的碎片 */
    if (RESIDUE[0].test(v) && Array.from(v.split(/\s+/).filter((w) => !RESIDUE[0].test(w))).join('').length < 6) {
      errs.push(k + ' 疑似残句（只剩英文虚词）');
    }
    if (/[,;，；]\s*$/.test(v)) warns.push(k + ' 以标点结尾');
  }

  /* ---------- 数字闸门 ---------------------------------------------------- */
  const toks = (t) => String(t).match(/\d+/g) || [];
  const nums = toks(m.src).filter((x) => x.length >= 2);
  const dnNums = toks(m.dn || '');
  const year = (m.src.match(/\b(1[89]\d{2}|20[0-4]\d)\b/) || [])[1];

  let dnMissAll = false;
  for (const n of (m.co === 'ID' ? dnNums : [])) {
    const miss = [];
    for (const k of ['en', 'vi', 'th', 'id', 'ms']) {
      if (!out[k]) continue;
      if (m.co === 'ID' && k === 'zh') continue;                 // ID 的中文层不带文号
      const okThai = k === 'th' && toks(out[k]).includes(String(+n + 543));
      if (!toks(out[k]).includes(n) && !okThai) miss.push(k);
    }
    if (miss.length === ['en', 'vi', 'th', 'id', 'ms'].filter((k) => out[k]).length) dnMissAll = true;
    else if (miss.length) warns.push('以下语种未出现文号数字 ' + n + '（' + m.dn + '）：' + miss.join('/'));
  }
  if (dnMissAll) errs.push('全部语种都丢了文号数字（' + m.dn + '）');

  if (year) {
    const missing = ['en', 'vi', 'th', 'id', 'ms'].filter((k) => out[k] && !toks(out[k]).some((x) => x.length === 4));
    if (missing.length === ['en', 'vi', 'th', 'id', 'ms'].filter((k) => out[k]).length) warns.push('四语均无年份，源含 ' + year);
  }
  /* 造数：出现了源与文号都没有的四位数 */
  const known = new Set([...nums, ...dnNums]);
  for (const [k, v] of Object.entries(out)) {
    for (const n of toks(v)) {
      if (n.length < 4) continue;
      if (!known.has(n) && !(k === 'th' && known.has(String(+n - 543)))) {
        warns.push(k + ' 出现源文没有的四位数 ' + n + '（可能译错或臆造）');
      }
    }
  }
  return { errs, warns, out };
}

/* ---------- 读入 ------------------------------------------------------------ */
function collect(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  const out = [];
  for (const f of fs.readdirSync(p)) {
    const q = path.join(p, f);
    const s = fs.statSync(q);
    if (s.isDirectory()) out.push(...collect(q));
    else if (f.endsWith('.out.jsonl')) out.push(q);
  }
  return out;
}

const files = collect(path.resolve(TARGET));
if (!files.length) { console.error('没找到 *.out.jsonl'); process.exit(1); }

if (!DRY) fs.mkdirSync(OUTDIR, { recursive: true });
const badLines = [];
const errRows = [];
let totOk = 0, totBad = 0, totWarn = 0, totSkip = 0;

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const items = {};
  let ok = 0, bad = 0, warn = 0, n = 0, skipped = 0;
  lines.forEach((line, i) => {
    const s = line.trim();
    if (!s) return;
    n++;
    let rec;
    try { rec = JSON.parse(s.replace(/^```(?:json)?/i, '').replace(/```$/, '')); }
    catch (e) { bad++; badLines.push([path.basename(f) + ':' + (i + 1), '(无法解析的 JSON)', [e.message]]); return; }
    const key = rec.key || rec.id || rec.id_;
    if (!key) { bad++; badLines.push([path.basename(f) + ':' + (i + 1), '(无 key)', ['缺 key']]); return; }
    rec.key = key;
    const co = (master[key] || {}).co;
    if (co && SKIP.has(co)) { skipped++; return; }
    const { errs, warns, out } = checkItem(rec);
    if (warns.length) { warn++; totWarn += warns.length; }
    if (errs.length) { bad++; errRows.push([path.basename(f), key, errs.join(' | ')]); badLines.push([key, String(rec.vi || rec.zh || rec.th || '').slice(0, 80), errs]); return; }
    if (warns.length) badLines.push([key, '（仅提醒，已收）', warns]);
    items[key] = out;
    ok++;
  });

  const name = path.basename(f).replace(/\.out\.jsonl$/, '');
  if (!DRY && ok) {
    fs.writeFileSync(path.join(OUTDIR, name + '.json'),
      JSON.stringify({ batch: 'ext-' + name, source: path.basename(f), items }, null, 0), 'utf8');
  }
  const rate = (n - skipped) ? ok / (n - skipped) : 0;
  console.log(path.basename(f) + '：' + n + ' 条 → 通过 ' + ok + '，退回 ' + bad + '，提醒 ' + warn +
    (skipped ? '，隔离 ' + skipped : '') +
    '（通过率 ' + (rate * 100).toFixed(0) + '%）' + (!skipped && rate < MIN ? '  ⚠ 低于门槛，可能整批不合规' : ''));
  totOk += ok; totBad += bad; totSkip += skipped;
}

const rep = ['# 外部译稿校验报告 ' + new Date().toISOString(), '', '通过 ' + totOk + ' 条，退回 ' + totBad + ' 条，提醒 ' + totWarn + ' 处', ''];
for (const [id, sample, errs] of badLines) rep.push('## ' + id + '\n' + sample + '\n' + errs.map((e) => '- ' + e).join('\n') + '\n');
fs.writeFileSync(BAD, rep.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, '_ext_errs.tsv'), errRows.map((r) => r.join('\t')).join('\n'), 'utf8');

console.log('\n合计：通过 ' + totOk + '，退回 ' + totBad + (totSkip ? '，隔离 ' + totSkip : ''));
console.log('批次目录：' + (DRY ? '(dry run，未写)' : OUTDIR));
console.log('退回明细：' + BAD);
if (totOk) console.log('\n下一步：node apply-multi.js ' + path.join(OUTDIR, '<批次>.json') + ' --dry');
