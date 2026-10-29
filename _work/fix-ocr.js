/* ==========================================================================
   CALR · OCR 缺陷修复（字符级，带上下文守卫）

   设计原则：
     · 每条规则先过「上下文守卫」——前缀已含左括号、或位于词中时一律不动；
     · 计数与改写共用同一个回调，统计与实际改动一致；
     · 无法判定合法性的形态一律不处理（裸 a)/b) 约 2.5 万处、~ 代字母、[ ] 全局替换）。

   用法：
     node _work/fix-ocr.js --dry
     node _work/fix-ocr.js --log
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'prototype', 'data');
const DRY = process.argv.includes('--dry');
const WANT_LOG = process.argv.includes('--log');

function leftOf(full, off, n) { return full.slice(Math.max(0, off - (n || 3)), off); }
/* off 传入的是「标记本身」的偏移（不含前置分隔符） */
function hasOpenParen(full, off) { return /\(\s*$/.test(leftOf(full, off)); }
function insideWord(full, off) { return /[\w]$/.test(leftOf(full, off, 1)); }

const RULES = [
  {
    id: 'R0', name: '复合花括号先归一', risk: '低',
    note: '先处理 {}、{{}、{{ 三种复合形态，避免先做 {→( 后残留 (( ；实测均为「(f)」或「(」被误识',
    apply(t) {
      let n = 0;
      const bump = () => { n++; };
      let o = t.replace(/\(\{\}/g, () => { bump(); return '(f)'; });   /* ({} → (f) */
      o = o.replace(/\{\(\}/g, () => { bump(); return '(f)'; });       /* {(} → (f) */
      o = o.replace(/\(\{/g, () => { bump(); return '('; });            /* ({ → (  （避免嵌套出 (( */
      o = o.replace(/\{\{?\}/g, () => { bump(); return '(f)'; });      /* {} 或 {{} → (f) */
      o = o.replace(/\{\{/g, () => { bump(); return '('; });            /* {{ → ( */
      return { out: o, count: n };
    }
  },
  {
    id: 'R1', name: '{ 误作左圆括号', risk: '低',
    note: '花括号在法条文本中不作标点，实测全部为圆括号误识',
    apply(t) { let n = 0; return { out: t.replace(/\{/g, () => { n++; return '('; }), count: n }; }
  },
  {
    id: 'R2', name: '} 误作右圆括号', risk: '低',
    note: '同上',
    apply(t) { let n = 0; return { out: t.replace(/\}/g, () => { n++; return ')'; }), count: n }; }
  },
  {
    id: 'R3', name: '[X) 误作 (X)', risk: '低',
    note: '仅命中「[ + 1~3 位字母数字 + )」；[Section 6]、[Sabah Cap. 2] 等成对方括号不受影响',
    apply(t) { let n = 0; return { out: t.replace(/\[([A-Za-z0-9]{1,3})\)/g, (m, x) => { n++; return '(' + x + ')'; }), count: n }; }
  },
  {
    id: 'R4', name: 'f 误作左圆括号', risk: '低',
    note: 'which-fa) → which-(a)、ff) → (f)；前缀已含 ( 或位于词中时不处理，form)/fund) 等真实单词不受影响',
    apply(t) {
      let n = 0, sample = null;
      const out = t.replace(/([\s\n;.,\-—–]*)f([a-z]{1,2})([)}])/g, function (m, pre, tok, br, off, full) {
        const tokOff = off + pre.length;              /* f 的位置 */
        if (hasOpenParen(full, tokOff) || insideWord(full, tokOff)) return m;
        n++;
        if (!sample) sample = full.slice(Math.max(0, off - 28), off + 32).replace(/\n/g, '⏎');
        return pre + '(' + tok + ')';
      });
      return { out, count: n, sample };
    }
  },
  {
    id: 'R5', name: 'fi. 多发点号', risk: '低',
    note: 'fi.rst / fi.lm / fi.fty / fi.xed 等，点号为误插；i.e. 等合法写法不在命中范围',
    apply(t) { let n = 0; return { out: t.replace(/\bfi\.(?=[a-z])/g, () => { n++; return 'fi'; }), count: n }; }
  },
  {
    id: 'R6', name: '罗马数字条款标记缺左括号', risk: '中',
    note: 'i) ii) iii) iv) vi) vii) viii) ix) 与「叠字母 + 空格 + 大写」；前缀已含 ( 或位于词中时不处理；排除单字母 v/x 与 mm/cc 等长度单位',
    apply(t) {
      let n = 0, sample = null;
      const guard = (pre, off, full) => {
        const tokOff = off + pre.length;              /* 标记本身的位置 */
        if (hasOpenParen(full, tokOff) || insideWord(full, tokOff)) return false;
        if (!sample) sample = full.slice(Math.max(0, off - 28), off + 32).replace(/\n/g, '⏎');
        n++; return true;
      };
      let out = t.replace(/([\s\n;.,]*)i{1,3}\)(?=[\s,;.])/g, function (m, pre, off, full) {
        if (!guard(pre, off, full)) return m;
        return pre + '(' + m.slice(pre.length, -1) + ')';
      });
      out = out.replace(/([\s\n;.,]*)(iv|vi{1,3}|ix)\)(?=[\s,;.])/g, function (m, pre, tok, off, full) {
        if (!guard(pre, off, full)) return m;
        return pre + '(' + tok + ')';
      });
      out = out.replace(/([\s\n;.,]*)([a-z])\2\)(?=\s+[A-Z])/g, function (m, pre, ch, off, full) {
        if (!guard(pre, off, full)) return m;
        return pre + '(' + ch + ch + ')';
      });
      return { out, count: n, sample };
    }
  },
  {
    id: 'R7', name: '印尼页眉损坏变体（整行）', risk: '中',
    note: 'PRES IDEN / FRESIDEN / REPUELIK / TNDONESIA / REPUBL|K 等全大写残片，仅整行匹配时删除',
    apply(t) {
      let n = 0, sample = null;
      const kept = t.split('\n').filter(ln => {
        const s = ln.trim();
        if (!s || s.length > 26) return true;
        if (/^(?:PRES\s?IDEN\w*|FRES\s?IDEN\w*|REPUBL\w*|REPUEL\w*|REPUBUK\w*|TNDONESIA|INDONESTA|INIDOI\.?IESIA|REPUBL\|K\s+INDONESTA)$/i.test(s)) {
          n++; if (!sample) sample = s;
          return false;
        }
        return true;
      });
      return { out: kept.join('\n'), count: n, sample };
    }
  }
];

const ENTRY = /^(\s*)FT\["([^"]+)"\]\s*=\s*(\{.*\});\s*$/;
const stats = {}, samples = {};
RULES.forEach(r => { stats[r.id] = 0; samples[r.id] = null; });
const log = [];

function applyAll(text) {
  let out = text, touched = [];
  const counts = {};
  for (const r of RULES) {
    const { out: o, count, sample } = r.apply(out);
    if (count > 0) {
      if (!samples[r.id] && sample) samples[r.id] = sample;
      touched.push(r.id + 'x' + count);
      counts[r.id] = (counts[r.id] || 0) + count;
      out = o;
    }
  }
  if (out === text) return { out, touched: [] };

  /* 兜底一：不得把条文清空 */
  if (!out.replace(/\s/g, '')) { reverted.Empty++; return { out: text, touched: [] }; }
  /* 兜底二：字符净改动不得超过原长的 25%，且不超过 40 字 —— 超出即判为误伤 */
  const net = out.length - text.length;
  if (Math.abs(net) > Math.max(40, text.length * 0.25)) { reverted.BigDelta++; return { out: text, touched: [] }; }

  for (const k in counts) stats[k] += counts[k];
  return { out, touched };
}
const reverted = { Empty: 0, BigDelta: 0 };

function processFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  let changed = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ENTRY);
    if (!m) continue;
    let law; try { law = JSON.parse(m[3]); } catch (e) { continue; }
    let local = 0;
    for (const a of (law.articles || [])) {
      for (const l in (a.text || {})) {
        const raw = a.text[l];
        if (typeof raw !== 'string' || !raw) continue;
        const { out, touched } = applyAll(raw);
        if (out !== raw) {
          if (WANT_LOG && log.length < 6000) log.push({ law: law.id, no: a.no, lang: l, rules: touched.join(','), before: raw.slice(0, 260), after: out.slice(0, 260) });
          a.text[l] = out; local++;
        }
      }
    }
    if (local) { lines[i] = m[1] + 'FT["' + m[2] + '"] = ' + JSON.stringify(law) + ';'; changed++; }
  }
  if (changed && !DRY) fs.writeFileSync(file, lines.join('\n'), 'utf8');
  return changed;
}

const targets = [];
for (const dir of ['intl', 'fulltext']) {
  const d = path.join(DATA, dir);
  if (!fs.existsSync(d)) continue;
  fs.readdirSync(d).filter(f => f.endsWith('.js') && f !== 'manifest.js').forEach(f => targets.push(path.join(d, f)));
}
let laws = 0;
for (const f of targets) laws += processFile(f);

console.log(DRY ? '【试运行，未写盘】' : '【已写盘】');
console.log('  扫描文件 ' + targets.length + '，改动法规 ' + laws);
console.log('');
console.log('  规则命中：');
RULES.forEach(r => {
  console.log('    ' + r.id.padEnd(4) + r.name.padEnd(26) + String(stats[r.id]).padStart(7) + '   风险 ' + r.risk);
  if (samples[r.id]) console.log('         ' + JSON.stringify(samples[r.id]));
});
console.log('    ' + '合计'.padEnd(30) + String(RULES.reduce((a, r) => a + stats[r.id], 0)).padStart(7));
console.log('    兜底回退：清空保护 ' + reverted.Empty + ' 条，改动量超限保护 ' + reverted.BigDelta + ' 条');
if (WANT_LOG && log.length) {
  fs.writeFileSync(path.join(ROOT, '_work', 'ocr-changelog.json'), JSON.stringify(log, null, 1), 'utf8');
  console.log('\n  改动日志（' + log.length + ' 条）→ _work/ocr-changelog.json');
}
