// PH 设立类（学校 / 医院 / 机构）四语合成
// 用法：node _gen_ph_est2.js [--limit N] [--out 文件名] [--show 20]
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./_ph_lex.js');

const GAP = JSON.parse(fs.readFileSync(path.join(__dirname, '_gap.json'), 'utf8')).gaps;
const ARG = process.argv.slice(2);
const arg = (n, d) => { const i = ARG.indexOf('--' + n); return i >= 0 ? ARG[i + 1] : d; };
const LIMIT = parseInt(arg('limit', '300'), 10);
const SKIP = parseInt(arg('skip', '0'), 10);
const OUT = arg('out', 'ph-p1-b12.json');
const SHOW = parseInt(arg('show', '0'), 10);

const HEAD = L.HEAD;
const BARRIO = [
  ['các Barrio', 'บาริโอหลายแห่ง', 'beberapa Barrio', 'beberapa Barrio'],
  ['các Sitio', 'ซิติโอหลายแห่ง', 'beberapa Sitio', 'beberapa Sitio'],
  ['các Barangay', 'บารังไกย์หลายแห่ง', 'beberapa Barangay', 'beberapa Barangay'],
];
const V = L.VERB;

function parse(title) {
  let t = L.ENT(title);
  if (!/^An Act\b/i.test(t)) return null;
  t = t.replace(/^An Act\s+/i, '');
  t = t.replace(/\b(?:located|situated)\s+in\b/gi, 'in');
  let verb = 'establish';
  const vm = t.match(/^(Establishing|Creating|Constituting|Converting|Renaming)\b/i);
  if (!vm) return null;
  const w = vm[1].toLowerCase();
  verb = w === 'establishing' ? 'establish' : w === 'creating' ? 'create' : w === 'constituting' ? 'constitute' : w === 'converting' ? 'convert' : 'rename';
  let rest = t.slice(vm[0].length).trim();

  // 名称从句
  let name = null;
  const nm = rest.match(/,?\s*(?:to\s+be\s+known|known|kwown|to\s+be\s+renamed)\s+as\s+(.+)$/i)
          || rest.match(/,?\s+into\s+(?:a\s+|an\s+|the\s+)?(.+)$/i);
  if (nm) { name = nm[1]; rest = rest.slice(0, nm.index); }
  rest = rest.replace(/[,;\s]+$/, '');
  // 前置剥离：by integrating / out of the integration of / both located in
  rest = rest.replace(/\s*\b(?:by|By)\s+(?:integrating|Integrating)\b.*$/i, '')
             .replace(/\s*\bOut\s+of\s+the\s+Integration\s+of\b.*$/i, '')
             .replace(/\s*,?\s*\bboth\s+located\s+in\b.*$/i, '')
             .replace(/\s*,?\s*\b(?:with|With)\s+station\s+at\b.*$/i, '')
             .replace(/[,;\s]+$/, '');

  // 地点起点
  const locRe = /(?:,\s*)?\b(?:in|at|In|At)\s+(?:the\s+)?(?:Barangay|Barrio|City|Municipality|Province|Subprovince|Island|Region|District|Municipalities|Cities|Provinces)\b/i;
  let locRaw = null, genus = rest;
  const lm = rest.match(locRe);
  if (lm) {
    genus = rest.slice(0, lm.index).replace(/[,;\s]+$/, '');
    locRaw = rest.slice(lm.index + lm[0].length - lm[0].replace(/^(?:,\s*)?\b(?:in|at)\s+(?:the\s+)?/i, '').length);
    locRaw = rest.slice(lm.index).replace(/^(?:,\s*)?\b(?:in|at)\s+/i, '').replace(/^the\s+/i, '');
  } else {
    // 退一步：in <地名>, Province of X
    const lm2 = rest.match(/(?:,\s*)?\b(?:in|at)\s+(?:the\s+)?([A-Z][^,]*),\s*(?:Province|City|Municipality)\s+of\b/i);
    if (lm2) {
      genus = rest.slice(0, lm2.index).replace(/[,;\s]+$/, '');
      locRaw = rest.slice(lm2.index).replace(/^(?:,\s*)?\b(?:in|at)\s+/i, '').replace(/^the\s+/i, '');
    }
  }
  if (locRaw) {
    // 砍掉地点后面的拨款/整合等附句
    locRaw = locRaw.split(/\s*(?:,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Providing|Author\S{0,4}ing|Mandating|Defining|Prescribing|Integrating|Creating|Establishing|Including|By\s+Integrating|Out\s+of|Located|located|Situated|Amending\s+for\s+(?:This|the)\s+Purpose)|\bed\s+in\b|,\s*(?:to\s+be|which|the\s+same)|;)/i)[0];
    locRaw = locRaw.replace(/[,;\s]+$/, '').replace(/\bed\s+/gi, '');
  }
  genus = genus.replace(/^(?:a|an|the)\s+/i, '').replace(/[,;\s]+$/, '').trim();
  if (!genus) return null;

  const fundsA = /Appropriat|Providing\s+(?:the\s+Necessary\s+)?Funds|Provision\s+of\s+Funds|Authorizing\s+the\s+Appropriation/i.test(title);
  const fundsB = /Authorizing\s+the\s+Appropriation\s+of\s+(?:the\s+Necessary\s+)?Funds/i.test(title);
  const other = /and\s+for\s+Other\s+Purposes/i.test(title);

  let loc = locRaw ? L.parseLoc(L.trimLoc(locRaw)) : [];
  if (locRaw && loc.length) {
    const red = L.reduceLoc(locRaw);
    if (red === null) loc = [];
    else if (red) loc = [red];
    else loc = loc.slice(-3);
  }
  // 「a College of Medicine in the X State University」→ 主体 + 隶属机构
  let host = null;
  const hm = genus.match(/^(.+?)\s+in\s+the\s+(.+)$/i);
  if (hm && L.trGenus(hm[2]).core) { genus = hm[1].trim(); host = hm[2].trim(); }
  // 「创建若干 Barrio / Sitio」
  const barrio = /^(?:Certain\s+|Additional\s+)?(Barrios?|Sitios?|Barangays?)$/i.test(genus);
  // 兜底：正文里出现「located in the Province of X」→ 取省
  if (!loc.length) {
    const fb = title.match(/(?:located\s+in|Located\s+in|,\s*in)\s+the\s+Province\s+of\s+([A-Z][A-Za-z.'\- ]{2,40})/);
    if (fb) loc = [{ type: 'Province', name: fb[1].replace(/[,\s]+$/, '').trim() }];
  }
  // 去掉无类型词的首段（多为村名，缺类型易误判为省）
  while (loc.length && loc[0].inferred) loc.shift();
  return { verb, genus, host, barrio, name: name ? L.cleanName(name) : null, loc, funds: fundsA, funds2: fundsB, other };
}

function compose(p) {
  const gGeneric = L.trGenus(p.genus);
  const gName = p.name ? L.trGenus(p.name) : null;
  const ART = ['một ', '', 'sebuah ', 'sebuah '];
  const out = {};
  const isConv = (p.verb === 'convert' || p.verb === 'rename') && gName;
  for (let i = 0; i < 4; i++) {
    // 无专名时补不定冠词，避免「设立 国立高中 在……」读作确指
    const needArt = !gName && !gGeneric.proper && ['establish', 'create', 'constitute'].includes(p.verb);
    const src = gGeneric[i];
    const tgt = gName ? gName[i] : null;
    let ent = (needArt ? ART[i] : '') + (tgt || src);
    if (p.barrio) {
      const b = p.genus.toLowerCase();
      ent = b.startsWith('sitio') ? BARRIO[1][i] : b.startsWith('barangay') ? BARRIO[2][i] : BARRIO[0][i];
    }
    const nameHasHost = !!(gName && p.host && L.cleanName(p.name).toLowerCase().includes(L.cleanName(p.host).toLowerCase()));
    const hostT = (p.host && !nameHasHost) ? L.trGenus(p.host)[i] : null;
    const loc = L.locText(p.loc, i);
    const head = HEAD[i];
    const verb = V[p.verb][i];
    const at = L.TAIL.at[i];
    const to = L.TAIL.to[i];
    const isThai = i === 1;
    let s;
    if (isConv) {
      // 转换/改名：源 → 目标
      const a = (/^[A-Za-z]/.test(src) && isThai) ? ' ' + src : src;
      const b = (/^[A-Za-z]/.test(tgt) && isThai) ? ' ' + tgt : tgt;
      s = isThai
        ? head + verb + a + ' ' + to + ' ' + b
        : head + ' ' + verb + ' ' + a + ' ' + to + ' ' + b;
    } else {
      const verbEnt = (/^[A-Za-z]/.test(ent) && isThai) ? verb + ' ' + ent : verb + (isThai ? '' : ' ') + ent;
      s = isThai ? head + verbEnt : head + ' ' + verb + ' ' + ent;
    }
    if (hostT) s += ' ' + at + (isThai ? '' : ' ') + hostT;
    if (loc) s += ' ' + at + (isThai ? '' : ' ') + loc;
    if (p.funds) s += isThai ? ' ' + L.TAIL.funds[1] : ', ' + L.TAIL.funds[i];
    if (p.other) s += isThai ? ' ' + L.TAIL.other[1] : ', ' + L.TAIL.other[i];
    s = isThai ? L.thFix(s) : s.replace(/\s+/g, ' ').trim();
    out[['vi', 'th', 'id', 'ms'][i]] = s;
  }
  return out;
}

// ── 选取 ───────────────────────────────────────────────────────────
const RE_EST = /^An Act (?:Establishing|Creating|Constituting|Converting)/i;
const RE_SKIP = /Trial Court|Judicial Region|Court Branches|Additional Branches|Sandiganbayan|Court of Appeals|Shari'?ah/i;
const pool = GAP.filter(x => x.country === 'PH' && RE_EST.test((x.title.en || '').trim()) && !RE_SKIP.test(x.title.en));

// 专名可信度：残留的英文虚词过多说明还有未拆净的从句
function plausible(g) {
  if (!g) return false;
  if (!g.core) return false;
  const p = g.proper || '';
  if (p) {
    if (/\b(?:the|of|and|in|under|its|with|for|such|thereof|therewith|a|an)\b/i.test(p)) return false;
    if (p.split(/\s+/).length > 6) return false;
  }
  if (g.topic && g.topicKind === 'raw') {
    const tp = g.topic.replace(/^the\s+/i, '');
    if (/\b(?:its|this|such|thereof|therewith|the|and|of)\b/i.test(tp)) return false;
    if (tp.split(/\s+/).length > 7) return false;
  }
  return true;
}

const items = {};
const skipped = [];
let taken = 0;
for (const x of pool) {
  if (Object.keys(items).length >= LIMIT) break;
  const p = parse(x.title.en);
  if (!p) { skipped.push([x.id, 'parse']); continue; }
  if (!p.loc.length) { skipped.push([x.id, 'noloc']); continue; }
  const gG = L.trGenus(p.genus);
  const gN = p.name ? L.trGenus(p.name) : null;
  if (!p.barrio && !plausible(gG)) { skipped.push([x.id, 'genus']); continue; }
  if (p.name && !plausible(gN)) { skipped.push([x.id, 'name']); continue; }
  if ((p.verb === 'convert' || p.verb === 'rename') && !gN) { skipped.push([x.id, 'conv-notarget']); continue; }
  const c = compose(p);
  let bad = null;
  for (const k of ['vi', 'th', 'id', 'ms']) {
    if (/["《》]/.test(c[k])) bad = k + ':quote';
    if (c[k].length < 8 || c[k].length > 300) bad = k + ':len' + c[k].length;
  }
  if (bad) { skipped.push([x.id, bad]); continue; }
  // 长度比闸门（规范 §7.3.4）：与英文原文比过短，说明剥掉的从句过多
  const L0 = x.title.en.length;
  if (c.vi.length / L0 < 0.40) { skipped.push([x.id, 'ratio']); continue; }
  if (taken++ < SKIP) continue;
  items[x.id] = c;
}

const batch = {
  batch: path.basename(OUT, '.json'),
  scope: 'PH 设立类（学校 / 医院 / 机构）四语合成：Establishing|Creating + 机构名 + 地点链 + 拨款附句',
  items,
};
fs.writeFileSync(path.join(__dirname, 'batches', OUT), JSON.stringify(batch, null, 1), 'utf8');
console.log('pool', pool.length, 'kept', Object.keys(items).length, 'skipped', skipped.length);
const c = {};
for (const s of skipped) c[s[1]] = (c[s[1]] || 0) + 1;
console.log('skip reasons', c);
if (SHOW) {
  let n = 0;
  for (const [id, v] of Object.entries(items)) {
    const src = pool.find(p => p.id === id).title.en;
    console.log('\n' + id + ' | ' + src.slice(0, 170));
    for (const k of ['vi', 'th', 'id', 'ms']) console.log('  ' + k + ' ' + v[k]);
    if (++n >= SHOW) break;
  }
}
