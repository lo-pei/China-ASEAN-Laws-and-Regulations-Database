// 历史语料·改名族引擎（独立于 _ph_gen2.js，避免回归风险）
// 只处理结构封闭的两式：
//   A) [AN ACT] [TO] CHANGING THE NAME[S] OF THE <ADMIN> OF <NAME>[, IN THE <ADMIN> OF <NAME>]*, TO [THAT OF] <NEW>
//   B) [AN ACT] [TO] RENAMING <ADMIN> <NAME> IN THE <ADMIN> OF <NAME> AS <NEW>
// 认不出的整条拒收，不做部分合成。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const H = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];
const ADM = {
  Pueblo: ['Thị trấn', 'เทศบาล', 'Kotamadya', 'Perbandaran'],
  Municipality: ['Thị trấn', 'เทศบาล', 'Kotamadya', 'Perbandaran'],
  'Municipal District': ['Quận nội thành', 'เขตเทศบาล', 'Distrik Kotamadya', 'Daerah Perbandaran'],
  City: ['Thành phố', 'เมือง', 'Kota', 'Bandar'],
  Province: ['Tỉnh', 'จังหวัด', 'Provinsi', 'Wilayah'],
  Subprovince: ['Tiểu tỉnh', 'กิ่งจังหวัด', 'Subprovinsi', 'Subwilayah'],
  Barrio: ['Barrio', 'บาริโอ', 'Barrio', 'Barrio'],
  Barangay: ['Barangay', 'บารังไกย์', 'Barangay', 'Barangay'],
  Sitio: ['Sitio', 'ซิติโอ', 'Sitio', 'Sitio'],
  District: ['Quận', 'เขต', 'Distrik', 'Daerah'],
  Island: ['Đảo', 'เกาะ', 'Pulau', 'Pulau'],
  Region: ['Vùng', 'ภูมิภาค', 'Wilayah', 'Wilayah'],
};
const ADMRE = Object.keys(ADM).sort((a, b) => b.length - a.length).join('|');
// 专名：允许 . ' ’ - 与连接词
const NAME = "[A-Za-z\\u00C0-\\u024F\\u1E00-\\u1EFF][A-Za-z'’\\u00C0-\\u024F\\u1E00-\\u1EFF.\\-]*(?:[ ,]+(?:de|del|la|las|los|y|and|the|of|upon|on)?[ ,]*[A-Za-z'’\\u00C0-\\u024F\\u1E00-\\u1EFF][A-Za-z'’\\u00C0-\\u024F\\u1E00-\\u1EFF.\\-]*)*";
const BADNAME = /\b(?:Certain|Several|Various|Other|All|Some|Every|Each|Both|Respective|Said|Same|Former|Latter|Present|Hereinafter)\b/i;
// 这些分词一出现，说明专名里夹了从句（「Roosevelt Avenue Located in …」），
// 说明结构没切开——硬译会把英文从句漏进四语，一律拒收
const CLAUSE = /\b(?:Located|Situated|Stretching|Traversing|Commencing|Beginning|Starting|Ending|Bounded|Composed|Consisting|Covering|Comprising|Being|Having|Made|Known|Lying|Running|Extending|Connecting|Leading|Which|Towards|Passing|Crossing|Forms?|Part|Portion)\b/i;
const SMALLSET = new Set(['de', 'del', 'dela', 'la', 'las', 'los', 'y', 'and', 'the', 'of', 'upon', 'on', 'van', 'von', 'da', 'dos', 'das']);

// ALL CAPS 专名转正体（PINEDA→Pineda，BINANGONAN DE LAMPON→Binangonan de Lampon）
const SMALL = new Set(['de', 'del', 'dela', 'la', 'las', 'los', 'y', 'and', 'the', 'of', 'upon', 'on', 'van', 'von', 'da', 'dos', 'das']);
function fixCase(name) {
  if (!/[A-Z]/.test(name)) return name;
  if (name !== name.toUpperCase()) return name; // 混排保持原样
  return name.split(/\s+/).map((w, i) => {
    const low = w.toLowerCase();
    if (i > 0 && SMALL.has(low.replace(/\.$/, ''))) return low;
    return low.replace(/(^|[-'])([a-zà-ÿ\u1e00-\u1eff])/g, (m, a, b) => a + b.toUpperCase());
  }).join(' ');
}

// 一段 = <ADMIN> of <NAME> / <ADMIN> <NAME> / <NAME>
function nameOk(name) {
  if (CLAUSE.test(name)) return false;
  // 专名里出现区划通名 = 源标题漏了分隔符（「Macaucang Municipality of Naujan」），
  // 再拼下去英文「Municipality of」会直接漏进四语标题
  if (/\b(?:Municipality|Municipal District|Province|Subprovince|City|Barrio|Barangay|Sitio|District|Island|Region|Pueblo)\b/i.test(name)) return false;
  // 「Gumalpong. Municipality of Baco」——源标题用句点当逗号，再拼下去会把
  // 英文「Municipality of」直接漏进四语标题
  if (/\.\s+(?:Municipality|Municipal District|Province|Subprovince|City|Barrio|Barangay|Sitio|District|Island|Region|Pueblo)\b/i.test(name)) return false;
  const toks = name.split(/\s+/);
  if (toks.length > 7) return false;
  for (const t of toks) {
    const bare = t.replace(/[.'’，]/g, '');
    if (!bare) continue;
    // 小写词只允许是连接词（de/la/y…）；出现别的小写词说明夹了从句
    if (/^[a-zà-ÿ\u1e00-\u1eff]/.test(bare) && !SMALLSET.has(bare.toLowerCase())) return false;
  }
  return true;
}
function seg(s) {
  let t = s.trim().replace(/^the\s+/i, '').replace(/[,\s]+$/, '');
  if (!t) return null;
  const m = t.match(new RegExp('^(' + ADMRE + ')\\s+(?:of\\s+)?(' + NAME + ')$', 'i'));
  if (m) {
    const key = Object.keys(ADM).find((k) => k.toLowerCase() === m[1].toLowerCase());
    if (!key) return null;
    if (BADNAME.test(m[2]) || !nameOk(m[2])) return null;
    return { adm: key, name: fixCase(m[2].trim()) };
  }
  if (new RegExp('^(?:' + ADMRE + ')$', 'i').test(t)) return null; // 光有通名没有专名
  if (!new RegExp('^' + NAME + '$').test(t)) return null;
  if (BADNAME.test(t) || !nameOk(t)) return null;
  return { adm: null, name: fixCase(t) };
}
function render(sg, i) {
  if (!sg) return null;
  return sg.adm ? ADM[sg.adm][i] + ' ' + sg.name : sg.name;
}

function parse(raw) {
  let s = raw.replace(/\s+/g, ' ').trim().replace(/^["“]|["”]$/g, '').replace(/\.\s*$/, '');
  s = s.replace(/^AN?\s+ACT\s+/i, '').replace(/^TO\s+/i, '').trim();
  let m = s.match(/^(?:CHANGING|CHANGE)\s+THE\s+NAME[S]?\s+OF\s+(?:THE\s+)?([\s\S]+)$/i);
  if (!m) m = s.match(/^(?:RENAMING|RENAME)\s+(?:THE\s+)?([\s\S]+)$/i);
  if (!m) return { why: 'noframe' };
  let rest = m[1].trim();

  // 切出新旧名：优先最后一个「, to/as/into」，其次「 as/into 」，最后「 to 」
  const cuts = [
    /,\s*(?:to|as|into)\s+/gi,
    /\s+(?:as|into)\s+/gi,
    /\s+to\s+/gi,
  ];
  let cut = null;
  for (const re of cuts) {
    let last = null, mm;
    re.lastIndex = 0;
    while ((mm = re.exec(rest))) last = mm;
    if (last) { cut = { index: last.index, len: last[0].length }; break; }
  }
  if (!cut) return { why: 'nosplit' };
  const left = rest.slice(0, cut.index).trim();
  let right = rest.slice(cut.index + cut.len).trim();
  right = right.replace(/^(?:that|those)\s+of\b\s*/i, '').replace(/^the\s+/i, '').trim();
  // 「… TO THAT OF」后面什么都没有 = 源标题被截断，补不出新名就整条拒收
  if (!right) return { why: 'nonewname' };

  // 左段：逗号或「 in the 」切成 实体 + 地点链
  const parts = left.split(/,\s*|\s+in\s+the\s+/i).map((x) => x.trim()).filter(Boolean);
  if (!parts.length) return { why: 'noentity' };
  const ent = seg(parts[0]);
  if (!ent) return { why: 'badent:' + parts[0].slice(0, 40) };
  // 实体必须带区划通名：不带通名的（「Calapan Central School」）是设施，
  // 归设施改名族，不在本引擎的口径内
  if (!ent.adm) return { why: 'noentadm:' + parts[0].slice(0, 40) };
  const locs = [];
  for (const p of parts.slice(1)) {
    const l = seg(p);
    if (!l || !l.adm) return { why: 'badloc:' + p.slice(0, 40) };
    locs.push(l);
  }
  const nw = seg(right);
  if (!nw) return { why: 'badnew:' + right.slice(0, 40) };

  const out = [];
  for (let i = 0; i < 4; i++) {
    const e = render(ent, i);
    const n = render(nw, i);
    const locTxt = locs.length ? ', ' + locs.map((l) => render(l, i)).join(', ') : '';
    let s2;
    if (i === 0) s2 = `${H[0]} đổi tên ${e}${locTxt} thành ${n}`;
    else if (i === 1) s2 = `${H[1]}เปลี่ยนชื่อ${e}${locTxt} เป็น ${n}`;
    else if (i === 2) s2 = `${H[2]} mengubah nama ${e}${locTxt} menjadi ${n}`;
    else s2 = `${H[3]} menukar nama ${e}${locTxt} kepada ${n}`;
    out.push(s2);
  }
  return { out: { vi: out[0], th: out[1], id: out[2], ms: out[3] }, frame: 'hist-rename' };
}

module.exports = { parse, fixCase };

if (require.main === module) {
  const argv = process.argv.slice(2);
  const iOut = argv.indexOf('--out');
  const iShow = argv.indexOf('--show');
  const srcPath = path.join(ROOT, '_work/title-multi/_ph_rest.json');
  const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const items = {};
  const skipped = [];
  for (const x of src) {
    const en = ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
    if (!en) continue;
    const r = parse(en);
    if (r.out) items[x.id] = r.out;
    else if (/^(?:AN?\s+ACT\s+)?(?:to\s+)?(?:Chang|Renam)/i.test(en)) skipped.push({ id: x.id, en, why: r.why });
  }
  console.log('改名族产出', Object.keys(items).length, '| 拒收', skipped.length);
  const byWhy = {};
  for (const s of skipped) { const k = s.why.split(':')[0]; byWhy[k] = (byWhy[k] || 0) + 1; }
  console.log(byWhy);
  if (iShow >= 0) {
    const n = Number(argv[iShow + 1]);
    Object.entries(items).slice(0, n).forEach(([id, t]) => {
      const e = src.find((y) => y.id === id);
      console.log('\n' + id + '  ' + ((e.title && e.title.en) || '').slice(0, 130));
      ['vi', 'th', 'id', 'ms'].forEach((L) => console.log('  ' + L + ': ' + t[L]));
    });
  }
  if (iOut >= 0) {
    fs.writeFileSync(path.join(ROOT, argv[iOut + 1]), JSON.stringify({ items }, null, 1), 'utf8');
    console.log('已写出', argv[iOut + 1]);
  }
}
