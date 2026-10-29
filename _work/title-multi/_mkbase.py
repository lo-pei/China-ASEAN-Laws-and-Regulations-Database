# -*- coding: utf-8 -*-
# 把本次会话对 _ph_gen2.js 的改动反向还原，生成 _ph_gen2_base.js（会话前基线），
# 用于归因：判断某处差异是本次改动造成的，还是更早会话遗留的。
import io

SRC = r'_work/title-multi/_ph_gen2.js'
DST = r'_work/title-multi/_ph_gen2_base.js'

P = []

# 1. SUFFIX：还原「to Authorize the Appropriation of Funds」，删掉新增两条
P.append((
    r'''  { re: /,?\s*and\s+to\s+Authorize\s+the\s+Appropriations?\s+of\s+(?:the\s+)?(?:Necessary\s+|Additional\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  // 「and to Appropriate the Necessary Funds Therefor」「and to Authorize Appropriation of Funds Therefor」
  { re: /,?\s*and\s+to\s+(?:Appropriate|Authorize)\s+(?:the\s+)?(?:Appropriations?\s+of\s+)?(?:the\s+)?(?:Necessary\s+|Additional\s+)?Funds?\s+Therefor\s*$/i, k: 'funds' },
  // 「and to Authorize the Appropriation of Seventy Thousand Pesos for the Purpose」
  { re: /,?\s*and\s+to\s+(?:Appropriate|Authorize)\s+(?:the\s+)?(?:Appropriations?\s+of\s+)?(?:the\s+)?(?:Sum\s+of\s+)?[A-Z][\s\S]{0,80}?(?:Pesos|Centavos)\b[\s\S]*$/i, k: 'funds' },''',
    r'''  { re: /,?\s*and\s+to\s+Authorize\s+the\s+Appropriation\s+of\s+Funds\s+Therefor\s*$/i, k: 'funds' },''',
))

# 2. buildDeclare：known 名称加引号
P.append((
    r'''  let kn = null;
  if (known) {
    let kh = known.replace(/^(?:The|A|An)\s+/i, '');
    // 并列两名（「"A" or "B"」）时不能剥外层引号，否则中间的引号会破掉
    if (!/"\s+or\s+"/i.test(kh)) kh = kh.replace(/^[\u201C\u2018"']([\s\S]*)[\u201D\u2019"']$/, '$1');
    kn = (/^[\u201C\u2018"']/.test(kh) && /[\u201D\u2019"']$/.test(kh)) ? kh : '"' + kh + '"';
    known = kh;
  }''',
    r'''  const kn = known ? (/^["\u201C]/.test(known) ? known : '"' + known + '"') : null;''',
))

# 3. buildDeclare：名称后尾随从句的处置
P.append((
    r'''    const head = rest.slice(0, ki);
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
    const c2 = stripComm(head);''',
    r'''    const head = rest.slice(0, ki);
    let tail = rest.slice(ki).replace(KNOWNRE, '').trim();
    // 名称后可能还挂着追念句
    const c1 = stripComm(tail);
    if (c1) { comm = c1.kind; commName = c1.name; tail = c1.rest; }
    known = tail.replace(/^[,\s]+|[,\s]+$/g, '');
    const c2 = stripComm(head);''',
))

# 4. declare_day：地点判定
P.append((
    r'''    if (strictLoc(cand)) { loc = cand; rest = ''; }
    else return null;''',
    r'''    if (looksLoc(cand) || /\b(?:City|Province|Municipality|Barangay)\b/i.test(cand)) { loc = cand; rest = ''; }
    else return null;''',
))

# 5. splitLoc：不带 in 的逗号链地点
P.append((
    r'''    // 「Sitio of Danawan, Municipality of Cuyo, Province of Palawan」——不带 in 的逗号链地点。
    // 必须整段通过 strictLoc：否则会把从句当成地名吃掉（见 declare_day 那条教训）。
    new RegExp('^(.*?)\\s*,\\s*(' + T + '[\\s\\S]+)$', 'i'),
  ];
  for (let k = 0; k < pats.length; k++) {
    const m = s.match(pats[k]);
    if (!m) continue;
    const last = k === pats.length - 1;
    if (last) { if (!strictLoc(m[2])) continue; }''',
    r'''  ];
  for (let k = 0; k < pats.length; k++) {
    const m = s.match(pats[k]);
    if (!m) continue;''',
))

# 6. establish：topicraw 收窄
P.append((
    r'''    const ADMKIND = /^(?:Barrio|Barangay|Sitio|City|Municipality|Municipal District|Municipalities|Province|Provinces|Subprovince|Sub-?[Pp]rovince|Region|Island|District|Lone District)$/i;
    if (raw0 && raw0.topicRaw && !(ADMKIND.test(raw0.core || ''))) {''',
    r'''    if (raw0 && raw0.topicRaw) {''',
))

# 7. convert：said 处理与「宾语夹带区划」拒收
P.append((
    r'''    const { thing, loc } = thingLoc(into[1]);
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
    if (ks.core && !kn) { if (global.__DBG) global.__DBG.push(['noknown', known]); return null; }''',
    r'''    const { thing, loc } = thingLoc(into[1]);
    const target = into[2].replace(/[,\s]+$/, '');
    const t = thing4(thing);
    if (!t) return null;
    // 目标认不出通名时不能原样塞英文——那会让「National Road」直接漏进四语标题
    const tg = thing4(target);
    if (!tg) { if (global.__DBG) global.__DBG.push(['notarget', target]); return null; }
    const kn = known ? thing4(known) : null;
    if (known && !kn) { if (global.__DBG) global.__DBG.push(['noknown', known]); return null; }''',
))

# 8a. convert：渲染 said
P.append((
    r'''      if (i === 0) s = `${H[0]} chuyển đổi ${t[0]}` + locPhrase(loc, i) + ` thành ${addSaid(tg, ts.said, 0)}`;
      else if (i === 1) s = `${H[1]}เปลี่ยนสถานะ${t[1]}` + locPhrase(loc, i) + ` เป็น ${addSaid(tg, ts.said, 1)}`;
      else if (i === 2) s = `${H[2]} mengubah ${t[2]}` + locPhrase(loc, i) + ` menjadi ${addSaid(tg, ts.said, 2)}`;
      else s = `${H[3]} menukar status ${t[3]}` + locPhrase(loc, i) + ` kepada ${addSaid(tg, ts.said, 3)}`;
      if (kn) {
        const kv = addSaid(kn, ks.said, i);''',
    r'''      if (i === 0) s = `${H[0]} chuyển đổi ${t[0]}` + locPhrase(loc, i) + ` thành ${tg[0]}`;
      else if (i === 1) s = `${H[1]}เปลี่ยนสถานะ${t[1]}` + locPhrase(loc, i) + ` เป็น ${tg[1]}`;
      else if (i === 2) s = `${H[2]} mengubah ${t[2]}` + locPhrase(loc, i) + ` menjadi ${tg[2]}`;
      else s = `${H[3]} menukar status ${t[3]}` + locPhrase(loc, i) + ` kepada ${tg[3]}`;
      if (kn) {
        const kv = kn[i];''',
))

# 8b. thing4：列举连词替换
P.append((
    r'''  // 区划类的多项列举：目标语连词替换掉英文 and
  if (ADM_UNIT.test(g.core) && g.topicRaw) {
    const items = enumItems(g.topicRaw);
    if (items) {
      for (let i = 0; i < 4; i++) {
        const tail = items.slice(0, -1).join(', ') + CONJ[i] + items[items.length - 1];
        out[i] = out[i].replace(g.topicRaw, tail);
      }
    }
  }
  if (g.proper && g.proper.length > 2) CUR_ALLOW.push(g.proper);''',
    r'''  if (g.proper && g.proper.length > 2) CUR_ALLOW.push(g.proper);''',
))

# 8c. establish：宾语夹带区划
P.append((
    r'''    const loc = locBody || locKnown;
    if (/[,]/.test(thing) && !isEnumList(thing)) { if (global.__DBG) global.__DBG.push(['commaObj', thing]); return null; }''',
    r'''    const loc = locBody || locKnown;''',
))

s = io.open(SRC, encoding='utf-8').read()
n0 = len(s)
ok = 0
for i, (new, old) in enumerate(P):
    if new in s:
        s = s.replace(new, old, 1)
        ok += 1
    else:
        print('!! 第 %d 组未命中' % (i + 1))
print('反向还原 %d/%d' % (ok, len(P)))
io.open(DST, 'w', encoding='utf-8').write(s)
print('写出 %s（%d → %d 字符）' % (DST, n0, len(s)))
