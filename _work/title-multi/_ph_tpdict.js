// 临时许可族（Temporary Permit）电台设施词表
// 结构与特许经营权族（_ph_fr.js）同源：这套算术om + 属性词 + 中心词，
// 目标语里「中心词在前、属性词在后、公私属性放最后」。
// 现有全部写法以 _ph_fr.js 里已经入库的 146 部为准，
// 例：private fixed point-to-point radiotelephone station
//     vi  trạm điện thoại vô tuyến cố định điểm-điểm tư nhân
//     th  สถานีวิทยุโทรศัพท์แบบจุดต่อจุดประจำที่ของเอกชน
//     id  stasiun radiotelepon titik-ke-titik tetap swasta
//     ms  stesen radiotelefon titik-ke-titik tetap persendirian

// ── 中心词 ──────────────────────────────────────────────────────────
const HEAD = [
  ['radio broadcasting station', ['đài phát thanh', 'สถานีวิทยุกระจายเสียง', 'stasiun penyiaran radio', 'stesen penyiaran radio']],
  ['radio receiving station', ['trạm thu vô tuyến', 'สถานีรับวิทยุ', 'stasiun penerima radio', 'stesen penerima radio']],
  ['radiotelephone station', ['trạm điện thoại vô tuyến', 'สถานีวิทยุโทรศัพท์', 'stasiun radiotelepon', 'stesen radiotelefon']],
  ['radiotelegraph station', ['trạm điện báo vô tuyến', 'สถานีวิทยุโทรเลข', 'stasiun radiotelegraf', 'stesen radiotelegraf']],
  ['radiophone station', ['trạm điện thoại vô tuyến', 'สถานีวิทยุโทรศัพท์', 'stasiun radiotelepon', 'stesen radiotelefon']],
  ['radio communications station', ['trạm thông tin vô tuyến', 'สถานีการสื่อสารทางวิทยุ', 'stasiun komunikasi radio', 'stesen komunikasi radio']],
  ['television station', ['đài truyền hình', 'สถานีโทรทัศน์', 'stasiun televisi', 'stesen televisyen']],
  ['station for television', ['đài truyền hình', 'สถานีโทรทัศน์', 'stasiun televisi', 'stesen televisyen']],
  ['radio station', ['trạm vô tuyến', 'สถานีวิทยุ', 'stasiun radio', 'stesen radio']],
  ['relay station', ['trạm tiếp sóng', 'สถานีถ่ายทอดสัญญาณ', 'stasiun relai', 'stesen geganti']],
  ['base station', ['trạm gốc', 'สถานีฐาน', 'stasiun basis', 'stesen bes']],
];

// ── 属性词 ──────────────────────────────────────────────────────────
const MOD = [
  ['fixed point to point', ['cố định điểm-điểm', 'แบบจุดต่อจุดประจำที่', 'titik-ke-titik tetap', 'titik-ke-titik tetap']],
  ['point to point', ['điểm-điểm', 'แบบจุดต่อจุด', 'titik-ke-titik', 'titik-ke-titik']],
  ['marine coastal service', ['dịch vụ ven biển hàng hải', 'บริการชายฝั่งทางทะเล', 'layanan pesisir maritim', 'perkhidmatan pesisir marin']],
  ['coastal marine service', ['dịch vụ ven biển hàng hải', 'บริการชายฝั่งทางทะเล', 'layanan pesisir maritim', 'perkhidmatan pesisir marin']],
  ['coastal ship to shore', ['ven biển tàu-bờ', 'ชายฝั่งเรือถึงฝั่ง', 'pesisir kapal-ke-pantai', 'pesisir kapal-ke-pantai']],
  ['ship to shore', ['tàu-bờ', 'เรือถึงฝั่ง', 'kapal-ke-pantai', 'kapal-ke-pantai']],
  ['boat to shore', ['thuyền-bờ', 'เรือถึงฝั่ง', 'kapal-ke-pantai', 'kapal-ke-pantai']],
  ['coast to ship', ['bờ-tàu', 'ฝั่งถึงเรือ', 'pantai-ke-kapal', 'pantai-ke-kapal']],
  ['aeronautical fixed', ['hàng không cố định', 'การบินประจำที่', 'penerbangan tetap', 'penerbangan tetap']],
  ['land based', ['trên mặt đất', 'ภาคพื้นดิน', 'berbasis darat', 'berasas darat']],
  ['land mobile', ['di động mặt đất', 'เคลื่อนที่ภาคพื้นดิน', 'mudah alih darat', 'mudah alih darat']],
  ['aeronautical', ['hàng không', 'การบิน', 'penerbangan', 'penerbangan']],
  ['coastal', ['ven biển', 'ชายฝั่ง', 'pesisir', 'pesisir']],
  ['mobile', ['di động', 'เคลื่อนที่', 'mudah alih', 'mudah alih']],
  ['fixed', ['cố định', 'ประจำที่', 'tetap', 'tetap']],
  ['relay', ['tiếp sóng', 'ถ่ายทอดสัญญาณ', 'relai', 'geganti']],
  ['base', ['gốc', 'ฐาน', 'basis', 'bes']],
  ['based', ['gốc', 'ฐาน', 'basis', 'bes']],
];

// ── 公私属性（放最后） ──────────────────────────────────────────────
const OWN = [
  ['non commercial', ['phi thương mại', 'ไม่เชิงพาณิชย์', 'nonkomersial', 'bukan komersial']],
  ['privatized', ['tư nhân', 'ของเอกชน', 'swasta', 'persendirian']],
  ['private', ['tư nhân', 'ของเอกชน', 'swasta', 'persendirian']],
  ['commercial', ['thương mại', 'เชิงพาณิชย์', 'komersial', 'komersial']],
  ['public', ['công cộng', 'สาธารณะ', 'umum', 'awam']],
];

// ── 目的从句 for the <接收与发送> of ────────────────────────────────
const RC_RADIO = ['thông tin vô tuyến', 'การสื่อสารทางวิทยุ', 'komunikasi radio', 'komunikasi radio'];
const PURP = {
  'reception and transmission of radio communications': ['nhận và truyền ' + RC_RADIO[0], 'รับและส่ง' + RC_RADIO[1], 'penerimaan dan pengiriman ' + RC_RADIO[2], 'penerimaan dan penghantaran ' + RC_RADIO[3]],
  'transmission and reception of radio communications': ['truyền và nhận ' + RC_RADIO[0], 'ส่งและรับ' + RC_RADIO[1], 'pengiriman dan penerimaan ' + RC_RADIO[2], 'penghantaran dan penerimaan ' + RC_RADIO[3]],
  'reception and transmission of radio communication': ['nhận và truyền ' + RC_RADIO[0], 'รับและส่ง' + RC_RADIO[1], 'penerimaan dan pengiriman ' + RC_RADIO[2], 'penerimaan dan penghantaran ' + RC_RADIO[3]],
  'transmission and reception of wireless messages': ['truyền và nhận tin nhắn không dây', 'ส่งและรับข้อความไร้สาย', 'pengiriman dan penerimaan pesan nirkabel', 'penghantaran dan penerimaan mesej tanpa wayar'],
  'reception and transmission of wireless messages': ['nhận và truyền tin nhắn không dây', 'รับและส่งข้อความไร้สาย', 'penerimaan dan pengiriman pesan nirkabel', 'penerimaan dan penghantaran mesej tanpa wayar'],
  'transmission of wireless messages': ['truyền tin nhắn không dây', 'ส่งข้อความไร้สาย', 'pengiriman pesan nirkabel', 'penghantaran mesej tanpa wayar'],
  'reception and transmission of inter office radio communications': ['nhận và truyền thông tin vô tuyến liên cơ quan', 'รับและส่งการสื่อสารทางวิทยุระหว่างสำนักงาน', 'penerimaan dan pengiriman komunikasi radio antar kantor', 'penerimaan dan penghantaran komunikasi radio antara pejabat'],
  'reception and transmission of radio telephone or radio telegraphic communications': ['nhận và truyền thông tin điện thoại vô tuyến hoặc điện báo vô tuyến', 'รับและส่งการสื่อสารทางวิทยุโทรศัพท์หรือวิทยุโทรเลข', 'penerimaan dan pengiriman komunikasi radiotelepon atau radiotelegraf', 'penerimaan dan penghantaran komunikasi radiotelefon atau radiotelegraf'],
  'reception and transmission of radiotelephonic or radiotelegraphic communications': ['nhận và truyền thông tin điện thoại vô tuyến hoặc điện báo vô tuyến', 'รับและส่งการสื่อสารทางวิทยุโทรศัพท์หรือวิทยุโทรเลข', 'penerimaan dan pengiriman komunikasi radiotelepon atau radiotelegraf', 'penerimaan dan penghantaran komunikasi radiotelefon atau radiotelegraf'],
  'reception and transmission of radiotelephone and radiotelegraph communications': ['nhận và truyền thông tin điện thoại và điện báo vô tuyến', 'รับและส่งการสื่อสารทางวิทยุโทรศัพท์และวิทยุโทรเลข', 'penerimaan dan pengiriman komunikasi radiotelepon dan radiotelegraf', 'penerimaan dan penghantaran komunikasi radiotelefon dan radiotelegraf'],
  'reception and transmission of radio and telephone communications': ['nhận và truyền thông tin vô tuyến và điện thoại', 'รับและส่งการสื่อสารทางวิทยุและโทรศัพท์', 'penerimaan dan pengiriman komunikasi radio dan telepon', 'penerimaan dan penghantaran komunikasi radio dan telefon'],
  'reception and transmission of wireless intelligence': ['nhận và truyền tin tức không dây', 'รับและส่งข่าวสารไร้สาย', 'penerimaan dan pengiriman berita nirkabel', 'penerimaan dan penghantaran berita tanpa wayar'],
  'transmission and reception of wireless radiotelegraph or radiotelephone': ['truyền và nhận tin điện báo hoặc điện thoại vô tuyến', 'ส่งและรับวิทยุโทรเลขหรือวิทยุโทรศัพท์', 'pengiriman dan penerimaan radiotelegraf atau radiotelepon', 'penghantaran dan penerimaan radiotelegraf atau radiotelefon'],
};

// 目的从句之外还挂着别的定语（not at Present Served by …）→ 一律拒收
const PURPTAIL = /^\s*(?:to\s+and\s+from\s+(?:the\s+)?said\s+stations?)?\s*[.,;]?\s*$/i;

// ── 匹配 ────────────────────────────────────────────────────────────
// 每个别名按词生成正则：词间允许空白或连字符，词尾允许复数
function mkRe(alias) {
  const words = alias.split(/[\s-]+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:s|es)?');
  return new RegExp('^' + words.join('[\\s\\-,\\u2013]+'), 'i');
}
function build(list) {
  return list.map(([a, tr]) => ({ re: mkRe(a), tr, n: a.split(/[\s-]+/).length })).sort((a, b) => b.n - a.n);
}
const A_HEAD = build(HEAD);
const A_MOD = build(MOD);
const A_OWN = build(OWN);

function firstHit(list, x) {
  for (const e of list) {
    const m = x.match(e.re);
    if (m) return { tr: e.tr, m };
  }
  return null;
}

// 解析宾语核心：<own> <修饰词…> <中心词> [and …]
// 返回 { groups:[{own,mods,head}], own } 或 null
function parseCore(raw) {
  const x0 = String(raw).toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[\u2019']/g, '')
    .replace(/\s+and\s*\/\s*or\s+/g, ' and ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,;]+|[.,;]+$/g, '')
    .trim();
  if (!x0 || /\//.test(x0)) return null;              // 「land mobile/portable」这类写法不合成
  let x = x0;
  const groups = [];
  let cur = { own: null, mods: [], head: null };
  let guard = 0;
  const push = () => { groups.push(cur); cur = { own: null, mods: [], head: null }; };
  while (x && guard++ < 80) {
    if (guard === 1 && /^stations?\b/.test(x)) return null;  // 「stations for …」开头，缺修饰
    const hd = firstHit(A_HEAD, x);
    const ow = firstHit(A_OWN, x);
    const md = firstHit(A_MOD, x);
    // 优先取匹配最长的那个
    const best = [hd, ow, md].filter(Boolean).sort((a, b) => b.m[0].length - a.m[0].length)[0];
    if (!best) {
      const sep = x.match(/^[\s,;]*(?:and|&)\b[\s,;]*/i);
      if (sep) { x = x.slice(sep[0].length); continue; }
      return null;
    }
    const kind = best === ow ? 'own' : best === hd ? 'head' : 'mod';
    if (kind === 'own') {
      // 「Private X and Private Y Radio Stations」：重复的公私属性只是强调，
      // 中心词还在后面，不能当成另一个并列item（那会合成出没有中心词的残句）
      if (cur.head) push();
      cur.own = ow.tr;
    } else if (kind === 'mod') {
      if (cur.head) push();
      cur.mods.push(md.tr);
    } else {
      if (cur.head) push();
      cur.head = hd.tr;
    }
    x = x.slice(best.m[0].length).replace(/^[\s,;]+/, '');
  }
  if (cur.head || cur.mods.length || cur.own) groups.push(cur);
  if (!groups.length) return null;
  for (const g of groups) if (!g.head) return null;   // 有修饰语无中心词 → 合成不出
  return { groups };
}

// 解析目的从句 for the reception and transmission of …
function parsePurp(raw) {
  const x = String(raw).toLowerCase()
    .replace(/\bcommunications\b/g, 'communications')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,;]+|[.,;]+$/g, '')
    .trim();
  if (!x) return { purp: null, rest: '' };
  if (PURP[x]) return { purp: PURP[x], rest: '' };
  // 命中的可能是前缀，尾部允许挂着「to and from Said Stations」
  for (const k of Object.keys(PURP)) {
    if (x.indexOf(k) === 0) {
      const tail = x.slice(k.length);
      if (PURPTAIL.test(tail)) return { purp: PURP[k], rest: '' };
    }
  }
  return { purp: null, rest: x };
}

// 渲染：返回 [vi, th, id, ms] 或 null
function render(raw) {
  const x = String(raw).replace(/\s+/g, ' ').trim();
  const pm = x.match(/[\s,]+for\s+(?:the\s+)?([\s\S]+)$/i);
  let core = pm ? x.slice(0, pm.index) : x;
  let purp = null;
  if (pm) {
    const p = parsePurp(pm[1]);
    if (p.purp) purp = p.purp;
    else core = x;   // 「stations for television」里的 for 是中心词的一部分，不是目的从句
  }
  const node = parseCore(core);
  if (!node) return null;
  const out = [];
  for (let i = 0; i < 4; i++) {
    const parts = node.groups.map((g) => {
      let s = g.head[i];
      const mods = g.mods.map((m) => m[i]);
      if (mods.length) {
        // 泰语不用空格分词，多个属性并列会连成一团，改用顿号分段
        if (i === 1) s += mods.slice(0, -1).join('、') + (mods.length > 1 ? 'และ' : '') + mods[mods.length - 1];
        else if (i === 0) s += ' ' + (mods.length > 1 ? mods.slice(0, -1).join(', ') + ' và ' + mods[mods.length - 1] : mods[0]);
        else s += ' ' + (mods.length > 1 ? mods.slice(0, -1).join(', ') + ' dan ' + mods[mods.length - 1] : mods[0]);
      }
      if (g.own) s += (i === 1 ? g.own[i] : ' ' + g.own[i]);
      return s;
    });
    const conj = i === 1 ? 'และ' : i === 0 ? ' và ' : ' dan ';
    let s = parts.join(conj);
    if (purp) {
      if (i === 0) s += ' để ' + purp[i];
      else if (i === 1) s += 'สำหรับ' + purp[i];
      else s += ' untuk ' + purp[i];
    }
    out.push(s.replace(/\s{2,}/g, ' ').trim());
  }
  return out;
}

module.exports = { render, parseCore, parsePurp };
