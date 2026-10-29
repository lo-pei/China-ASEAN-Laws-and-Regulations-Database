// PH 修正案类（An Act Amending ...）标题合成器
// 关键难点：1950 年代前的法案把法号写成英文单词（Republic Act Numbered Five Hundred Eighty）
const fs = require('fs');
const L = require('./_ph_lex.js');
const GAP = require('./_gap.json').gaps;

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const LIMIT = parseInt(arg('limit', '300'), 10);
const SKIP = parseInt(arg('skip', '0'), 10);
const OUT = arg('out', 'amend.json');

// ── 拼写数词 ──────────────────────────────────────────────────
const NUMW = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};
function words2num(s) {
  let total = 0, cur = 0, seen = false;
  for (const w of s.toLowerCase().split(/[\s\-,]+/)) {
    if (!w || w === 'and') continue;
    if (NUMW[w] !== undefined) { cur += NUMW[w]; seen = true; }
    else if (w === 'hundred') { cur = (cur || 1) * 100; seen = true; }
    else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; seen = true; }
    else return null;
  }
  return seen ? total + cur : null;
}

// ── 法号识别 ──────────────────────────────────────────────────
// 返回 {kind, num} kind ∈ RA / CA / ACT / PD / BP / EO
const KIND_RE = [
  ['RA', /(?:Republic\s+Act(?:\s+Numbered|\s+Number|\s+No\.?)?|R\.\s?A\.?\s*No\.?)/i],
  ['CA', /Commonwealth\s+Act(?:\s+No\.?|\s+Numbered)?/i],
  ['PD', /Presidential\s+Decree(?:\s+No\.?|\s+Numbered)?/i],
  ['BP', /Batas\s+Pambansa(?:\s+Bilang|\s+Blg\.?|\s+No\.?)?/i],
  ['EO', /Executive\s+Order(?:\s+No\.?|\s+Numbered)?/i],
  ['ACT', /\bAct\s+(?:No\.?|Numbered)/i],
];

// 从「法号前缀」之后读取号码：数字串，或连续的英文数词（Five Hundred Eighty）
function readNum(after) {
  const s = after.replace(/^[\s.:]+/, '');
  const dm = s.match(/^([\d][\d,]*)/);
  if (dm) {
    const n = parseInt(dm[1].replace(/,/g, ''), 10);
    return n > 0 && n < 100000 ? { n, len: dm[0].length } : null;
  }
  const toks = s.split(/([\s\-]+)/); // 保留分隔符以便计算长度
  let acc = '', consumed = 0, open = false;
  for (let i = 0; i < toks.length; i += 2) {
    const w = toks[i].replace(/[,.;:)\]]+$/, '');
    const lw = w.toLowerCase();
    if (!lw) break;
    if (NUMW[lw] !== undefined || lw === 'hundred' || lw === 'thousand' || lw === 'and') {
      // 'and' 只能夹在中间，不能开头
      if (lw === 'and' && !open) break;
      acc += (acc ? ' ' : '') + w;
      consumed += w.length + (toks[i + 1] ? toks[i + 1].length : 0);
      open = true;
    } else break;
  }
  if (!acc) return null;
  const n = words2num(acc);
  return n > 0 && n < 100000 ? { n, len: consumed } : null;
}

// 从标题里找出被修正的法（取第一个）
function findTarget(t) {
  for (const [kind, re] of KIND_RE) {
    const m = t.match(re);
    if (!m) continue;
    const r = readNum(t.slice(m.index + m[0].length));
    if (r) return { kind, num: r.n, at: m.index };
  }
  return null;
}

// ── 法典词表 ──────────────────────────────────────────────────
// [正则, vi, th, id, ms, 短名（用于 vi 补充说明，可空）]
const CODES = [
  [/^Revised\s+Administrative\s+Code/i, 'Bộ luật Hành chính (sửa đổi)', 'ประมวลกฎหมายปกครอง (ฉบับแก้ไข)', 'Kitab Undang-Undang Administrasi (Revisi)', 'Kanun Pentadbiran (Semakan)'],
  [/^Administrative\s+Code/i, 'Bộ luật Hành chính', 'ประมวลกฎหมายปกครอง', 'Kitab Undang-Undang Administrasi', 'Kanun Pentadbiran'],
  [/^National\s+Internal\s+Revenue\s+Code/i, 'Bộ luật Thuế nội địa', 'ประมวลรัษฎากร', 'Kitab Undang-Undang Pajak Dalam Negeri', 'Kanun Hasil Dalam Negeri'],
  [/^Revised\s+Penal\s+Code/i, 'Bộ luật Hình sự (sửa đổi)', 'ประมวลกฎหมายอาญา', 'Kitab Undang-Undang Hukum Pidana (Revisi)', 'Kanun Keseksaan (Semakan)'],
  [/^Revised\s+Election\s+Code|^Omnibus\s+Election\s+Code/i, 'Bộ luật Bầu cử', 'ประมวลกฎหมายการเลือกตั้ง', 'Kitab Undang-Undang Pemilihan', 'Kanun Pilihan Raya'],
  [/^Labor\s+Code/i, 'Bộ luật Lao động', 'ประมวลกฎหมายแรงงาน', 'Kitab Undang-Undang Ketenagakerjaan', 'Kanun Buruh'],
  [/^Local\s+Government\s+Code/i, 'Bộ luật Chính quyền địa phương', 'ประมวลกฎหมายการปกครองท้องถิ่น', 'Kitab Undang-Undang Pemerintahan Daerah', 'Kanun Kerajaan Tempatan'],
  [/^Family\s+Code/i, 'Bộ luật Gia đình', 'ประมวลกฎหมายครอบครัว', 'Kitab Undang-Undang Keluarga', 'Kanun Keluarga'],
  [/^Civil\s+Code/i, 'Bộ luật Dân sự', 'ประมวลกฎหมายแพ่ง', 'Kitab Undang-Undang Hukum Perdata', 'Kanun Undang-Undang Sivil'],
  [/^Tariff\s+and\s+Customs\s+Code/i, 'Bộ luật Thuế quan và Hải quan', 'ประมวลกฎหมายภาษีศุลกากร', 'Kitab Undang-Undang Tarif dan Bea Cukai', 'Kanun Tarif dan Kastam'],
  [/^Insurance\s+Code|^Insurance\s+Act/i, 'Bộ luật Bảo hiểm', 'ประมวลกฎหมายประกันภัย', 'Kitab Undang-Undang Asuransi', 'Kanun Insurans'],
  [/^Judiciary\s+Act/i, 'Đạo luật Tư pháp', 'พระราชบัญญัติตุลาการ', 'Undang-Undang Peradilan', 'Akta Kehakiman'],
  [/^Public\s+Service\s+Act/i, 'Đạo luật Dịch vụ Công cộng', 'พระราชบัญญัติบริการสาธารณะ', 'Undang-Undang Layanan Publik', 'Akta Perkhidmatan Awam'],
  [/^Fisheries\s+Act|^Fisheries\s+Code/i, 'Đạo luật Thủy sản', 'พระราชบัญญัติการประมง', 'Undang-Undang Perikanan', 'Akta Perikanan'],
  [/^Philippine\s+Tariff\s+Act/i, 'Đạo luật Thuế quan Philippines', 'พระราชบัญญัติภาษีศุลกากรฟิลิปปินส์', 'Undang-Undang Tarif Filipina', 'Akta Tarif Filipina'],
  [/^National\s+Defense\s+Act/i, 'Đạo luật Quốc phòng', 'พระราชบัญญัติป้องกันประเทศ', 'Undang-Undang Pertahanan Nasional', 'Akta Pertahanan Negara'],
  [/^Corporation\s+Law|^Corporation\s+Code/i, 'Bộ luật Công ty', 'ประมวลกฎหมายบริษัท', 'Kitab Undang-Undang Perusahaan', 'Kanun Syarikat'],
  [/^Public\s+Land\s+Act/i, 'Đạo luật Đất công', 'พระราชบัญญัติที่ดินสาธารณะ', 'Undang-Undang Tanah Publik', 'Akta Tanah Awam'],
  [/^Mining\s+Act/i, 'Đạo luật Khai khoáng', 'พระราชบัญญัติการทำเหมือง', 'Undang-Undang Pertambangan', 'Akta Perlombongan'],
  [/^Rural\s+Banks\s+Act/i, 'Đạo luật Ngân hàng Nông thôn', 'พระราชบัญญัติธนาคารชนบท', 'Undang-Undang Bank Pedesaan', 'Akta Bank Luar Bandar'],
  [/^Home\s+Financing\s+Act/i, 'Đạo luật Tài trợ Nhà ở', 'พระราชบัญญัติการเงินที่อยู่อาศัย', 'Undang-Undang Pembiayaan Perumahan', 'Akta Pembiayaan Perumahan'],
  [/^Agricultural\s+Tenancy\s+Act/i, 'Đạo luật Tá điền Nông nghiệp', 'พระราชบัญญัติการเช่าที่ดินเกษตร', 'Undang-Undang Penyewaan Pertanian', 'Akta Penyewaan Pertanian'],
  [/^Workmen'?s\s+Compensation\s+Act/i, 'Đạo luật Bồi thường Người lao động', 'พระราชบัญญัติเงินทดแทนแรงงาน', 'Undang-Undang Kompensasi Pekerja', 'Akta Pampasan Pekerja'],
  [/^Eight-Hour\s+Labor\s+Law/i, 'Luật Lao động Tám giờ', 'กฎหมายแรงงานแปดชั่วโมง', 'Undang-Undang Kerja Delapan Jam', 'Undang-Undang Buruh Lapan Jam'],
  [/^Philippine\s+Immigration\s+Act/i, 'Đạo luật Nhập cư Philippines', 'พระราชบัญญัติตรวจคนเข้าเมืองฟิลิปปินส์', 'Undang-Undang Imigrasi Filipina', 'Akta Imigresen Filipina'],
  [/^Bases\s+Conversion\s+and\s+Development\s+Act/i, 'Đạo luật Chuyển đổi và Phát triển Căn cứ Quân sự', 'พระราชบัญญัติการแปลงและพัฒนฐานทัพ', 'Undang-Undang Konversi dan Pengembangan Pangkalan', 'Akta Penukaran dan Pembangunan Pangkalan'],
  [/^Omnibus\s+Investments\s+Code/i, 'Bộ luật Đầu tư Tổng hợp', 'ประมวลกฎหมายการลงทุน', 'Kitab Undang-Undang Investasi', 'Kanun Pelaburan'],
  [/^Pasture\s+Land\s+Act/i, 'Đạo luật Đất Đồng cỏ', 'พระราชบัญญัติที่ดินทุ่งหญ้า', 'Undang-Undang Tanah Padang Rumput', 'Akta Tanah Padang Rumput'],
  [/^Government\s+Service\s+Insurance\s+Act/i, 'Đạo luật Bảo hiểm Dịch vụ Chính phủ', 'พระราชบัญญัติประกันบริการราชการ', 'Undang-Undang Asuransi Layanan Pemerintah', 'Akta Insurans Perkhidmatan Kerajaan'],
  [/^Private\s+Employment\s+Agency\s+Law/i, 'Luật Cơ quan Việc làm Tư nhân', 'กฎหมายสำนักงานจัดหางานเอกชน', 'Undang-Undang Agensi Ketenagakerjaan Swasta', 'Undang-Undang Agensi Pekerjaan Swasta'],
  [/^Export\s+Control\s+Law/i, 'Luật Kiểm soát Xuất khẩu', 'กฎหมายควบคุมการส่งออก', 'Undang-Undang Pengendalian Ekspor', 'Undang-Undang Kawalan Eksport'],
  [/^Residence\s+Tax\s+Law/i, 'Luật Thuế Cư trú', 'กฎหมายภาษีถิ่นที่อยู่', 'Undang-Undang Pajak Domisili', 'Undang-Undang Cukai Kediaman'],
  [/^Savings\s+and\s+Loan\s+Association\s+Act/i, 'Đạo luật Hiệp hội Tiết kiệm và Cho vay', 'พระราชบัญญัติสมาคมออมทรัพย์และเงินกู้', 'Undang-Undang Perhimpunan Tabungan dan Pinjaman', 'Akta Persatuan Simpanan dan Pinjaman'],
];

const YR = [' năm ', ' ค.ศ. ', ' Tahun ', ' Tahun '];
function trCode(name) {
  let n = name.replace(/^the\s+/i, '').replace(/\s+/g, ' ').trim();
  let yr = null;
  const ym = n.match(/\bof\s+(\d{4})$/i);
  if (ym) { yr = ym[1]; n = n.slice(0, ym.index).trim(); }
  for (const [re, ...t] of CODES) {
    if (re.test(n)) return { t: t.map((x, i) => x + (yr ? YR[i] + yr : '')), n };
  }
  return null;
}

// 「Charter of the City of X」→ 四语市宪章
function trCharter(s) {
  const m = s.match(/^(?:the\s+)?Charter\s+of\s+the\s+(City|Municipality)\s+of\s+(.+)$/i);
  if (!m) return null;
  const city = m[2].replace(/[,\s]+$/, '').trim();
  const isCity = /^City$/i.test(m[1]);
  return [
    (isCity ? 'Hiến chương Thành phố ' : 'Hiến chương Đô thị ') + city,
    (isCity ? 'กฎบัตรเมือง' : 'กฎบัตรเทศบาล') + city,
    (isCity ? 'Piagam Kota ' : 'Piagam Kotamadya ') + city,
    (isCity ? 'Piagam Bandar ' : 'Piagam Perbandaran ') + city,
  ];
}

// 把句子里的英文数词串归一为阿拉伯数字（"One Hundred and Eighty-Two" → "182"）
// 规则：and 只有在已出现 hundred/thousand 时才并入数词，否则视为并列连接
function normNumbers(seg) {
  // Eighty-Two 这类连字符数词先拆开，避免整段被当成非数词
  seg = seg.replace(/\b([A-Za-z]+)-([A-Za-z]+)\b/g, (m0, a, b) =>
    (NUMW[a.toLowerCase()] !== undefined && NUMW[b.toLowerCase()] !== undefined) ? a + ' ' + b : m0);
  const words = seg.split(/\s+/);
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w0 = words[i];
    const core = w0.replace(/[,;:]+$/, '');
    const lw = core.toLowerCase();
    if (NUMW[lw] === undefined && lw !== 'hundred' && lw !== 'thousand') { out.push(w0); continue; }
    const run = [core];
    let j = i + 1, hasScale = lw === 'hundred' || lw === 'thousand', endComma = /[,;:]$/.test(w0);
    while (!endComma && j < words.length) {
      const rawNx = words[j];
      const nx = rawNx.replace(/[,;:]+$/, '');
      const nl = nx.toLowerCase();
      const isNum = NUMW[nl] !== undefined || nl === 'hundred' || nl === 'thousand';
      if (isNum) {
        run.push(nx); if (nl === 'hundred' || nl === 'thousand') hasScale = true;
        endComma = /[,;:]$/.test(rawNx); j++;
        if (endComma) break;   // 逗号处一定断开
        continue;
      }
      if (nl === 'and' && hasScale && j + 1 < words.length) {
        const af = words[j + 1].replace(/[,;:]+$/, '').toLowerCase();
        const aft = (words[j + 2] || '').replace(/[,;:]+$/, '').toLowerCase();
        // 「Eleven and Sixteen Hundred」是两个数，不是 27；只有后接小单位才并成一数
        if (NUMW[af] !== undefined && aft !== 'hundred' && aft !== 'thousand') { run.push(nx); j++; continue; }
      }
      break;
    }
    const n = words2num(run.join(' '));
    if (n) { out.push(String(n) + (endComma ? ',' : '')); i = j - 1; }
    else out.push(w0);
  }
  return out.join(' ');
}

// 市/镇宪章作为被修正对象：Charter of the City of X / Revised Charter of X City
function findCharter(t) {
  const m = t.match(/\b(Revised\s+)?Charter\s+of\s+(?:the\s+)?(?:(City|Municipality|Town)\s+of\s+([A-Z][A-Za-z.'\- ]{2,32}?)|([A-Z][A-Za-z.'\- ]{2,32}?)\s+(City))\b/i);
  if (!m) return null;
  const revised = !!m[1];
  const kind = m[2] ? m[2] : 'City';
  const name = (m[3] || m[4] || '').replace(/[,\s]+$/, '').trim();
  if (!name) return null;
  const isCity = /^City$/i.test(kind);
  const sfx = revised ? [' (bản sửa đổi)', ' (ฉบับแก้ไข)', ' (Revisi)', ' (Semakan)'] : ['', '', '', ''];
  const base = [
    (isCity ? 'Hiến chương Thành phố ' : 'Hiến chương Đô thị ') + name,
    (isCity ? 'กฎบัตรเมือง' : 'กฎบัตรเทศบาล') + name,
    (isCity ? 'Piagam Kota ' : 'Piagam Kotamadya ') + name,
    (isCity ? 'Piagam Bandar ' : 'Piagam Perbandaran ') + name,
  ];
  return { t: base.map((x, i) => x + sfx[i]), name, revised };
}

// Republic Acts Numbered A, B and C —— 多法号并列
function findMultiActs(t) {
  const m = t.match(/Republic\s+Acts?\s+Numbered\s+([\s\S]+)/i);
  if (!m) return null;
  let seg = m[1].split(/\s*,?\s*(?:and\s+for\s+Other\s+Purposes|regarding|relative\s+to|providing|appropriating|amending)\b/i)[0];
  seg = seg.replace(/\s+and\s+(?=for\b)/i, '');
  const norm = normNumbers(seg).replace(/,\s*and\s+/gi, ', ');
  const parts = norm.split(/\s*,\s*|\s+and\s+/i).map(x => x.replace(/[^\d\-A-Za-z]/g, '')).filter(Boolean);
  const nums = parts.filter(x => /^\d+/.test(x)).map(x => x.match(/^\d+/)[0]);
  if (nums.length < 2) return null;
  return { nums: [...new Set(nums)] };
}

// ── 范围（条、款、项）──────────────────────────────────────────
const SECW = /^(?:Sections?|Secs?\.?)\s+([\dA-Za-z][\dA-Za-z\-\s,and]*)/i;

const ORD = { first: ['thứ nhất', 'หนึ่ง', 'pertama', 'pertama'], second: ['thứ hai', 'สอง', 'kedua', 'kedua'],
  third: ['thứ ba', 'สาม', 'ketiga', 'ketiga'], fourth: ['thứ tư', 'สี่', 'keempat', 'keempat'],
  fifth: ['thứ năm', 'ห้า', 'kelima', 'kelima'], last: ['cuối cùng', 'สุดท้าย', 'terakhir', 'terakhir'] };

function parseScope(t) {
  // 「First Paragraph of Section 191」这类段级修正，不能笼统说成整条
  const pm = normNumbers(t).match(/\b(First|Second|Third|Fourth|Fifth|Last)\s+Paragraph\s+of\s+Section\s+([\d]+[\-A-Za-z]?(?:\([A-Za-z\d]+\))?)/i);
  if (pm) return { kind: 'para', ord: pm[1].toLowerCase(), nums: [pm[2]] };
  // 「Certain Sections」「Certain Provisions」
  if (/Certain\s+(?:Sections?|Provisions?)/i.test(t)) return { kind: 'some' };
  // 「Section X and Section Y」/「Sections 105, 108 and 110」
  const t2 = normNumbers(t).replace(/,\s*and\s+/gi, ', ');
  const m = t2.match(/Sections?\s+((?:[A-Za-z\d]+[\-A-Za-z]?(?:\([A-Za-z\d]+\))?)(?:\s*(?:,|and)\s*(?:Section\s+)?(?:[A-Za-z\d]+[\-A-Za-z]?(?:\([A-Za-z\d]+\))?))*)/i);
  if (m) {
    const raw = m[1];
    // 只接受纯编号（数字或数词），出现杂词就退回「某些条文」
    const parts = raw.split(/\s*,\s*|\s+and\s+|\s*&\s*/i)
      .map(x => x.replace(/^Section\s+/i, '').trim())
      .filter(x => x && !/^and$/i.test(x));
    const nums = [];
    for (const p of parts) {
      if (/^[\d]+[\-A-Za-z]?(?:\([A-Za-z\d]+\))?$/.test(p)) nums.push(p);
      else {
        const n = words2num(p);
        if (n) nums.push(String(n));
        else { nums.length = 0; break; }
      }
    }
    if (nums.length && nums.length <= 6) return { kind: 'list', nums };
    return { kind: 'some' };   // 列表混入 Paragraph/Subsection 等，退回「某些条文」
  }
  if (/\bTitle\s+([IVXL]+|\d+)\b/i.test(t)) {
    const mm = t.match(/\bTitle\s+([IVXL]+|\d+)\b/i);
    return { kind: 'title', v: mm[1].toUpperCase() };
  }
  if (/\bItem\b/i.test(t)) return { kind: 'item' };
  if (/\bSection\b/i.test(t)) return { kind: 'some' };
  return null;
}

// ── 动词 ──────────────────────────────────────────────────────
function parseVerb(t) {
  const head = t.slice(0, 140);
  const add = /(?:and\s+)?Add(?:ing)?\s+New\s+Sections?/i.test(head);
  const rep = /Repeal/i.test(head);
  const further = /Further\s+Amend|further\s+amend/i.test(head);
  const ext = /Extend|Extending/i.test(head);
  let k = 'amend';
  if (further) k = 'further';
  if (rep && add) k = 'amend_rep_add';
  else if (rep) k = 'amend_rep';
  else if (add) k = 'amend_add';
  else if (ext) k = 'amend_ext';
  return k;
}

const V = {
  amend:         ['sửa đổi',                    'แก้ไขเพิ่มเติม',        'mengubah',        'meminda'],
  further:       ['sửa đổi thêm',               'แก้ไขเพิ่มเติมอีก',      'mengubah lagi',   'meminda lagi'],
  amend_add:     ['sửa đổi và bổ sung',         'แก้ไขเพิ่มเติมและเพิ่ม',  'mengubah dan menambah', 'meminda dan menambah'],
  amend_rep:     ['sửa đổi và bãi bỏ',          'แก้ไขเพิ่มเติมและยกเลิก', 'mengubah dan mencabut', 'meminda dan memansuhkan'],
  amend_rep_add: ['sửa đổi, bãi bỏ và bổ sung', 'แก้ไขเพิ่มเติม ยกเลิก และเพิ่ม', 'mengubah, mencabut, dan menambah', 'meminda, memansuhkan dan menambah'],
  amend_ext:     ['sửa đổi và gia hạn',         'แก้ไขเพิ่มเติมและขยาย',   'mengubah dan memperpanjang', 'meminda dan melanjutkan'],
};

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];

// 法号 → 四语名
function lawName(kind, num) {
  switch (kind) {
    case 'RA':
      return ['Đạo luật Cộng hòa số ' + num, 'พระราชบัญญัติแห่งสาธารณรัฐที่ ' + num,
              'Undang-Undang Republik No. ' + num, 'Akta Republik No. ' + num];
    case 'CA':
      return ['Đạo luật Thịnh vượng chung số ' + num, 'พระราชบัญญัติเครือรัฐที่ ' + num,
              'Undang-Undang Persemakmuran No. ' + num, 'Akta Komanwel No. ' + num];
    case 'PD':
      return ['Sắc lệnh Tổng thống số ' + num, 'พระราชกฤษฎีกาที่ ' + num,
              'Dekrit Presiden No. ' + num, 'Dekri Presiden No. ' + num];
    case 'BP':
      return ['Batas Pambansa số ' + num, 'บาตัสปัมบันซาที่ ' + num,
              'Batas Pambansa No. ' + num, 'Batas Pambansa No. ' + num];
    case 'EO':
      return ['Sắc lệnh Hành pháp số ' + num, 'คำสั่งฝ่ายบริหารที่ ' + num,
              'Perintah Eksekutif No. ' + num, 'Perintah Eksekutif No. ' + num];
    default:
      return ['Đạo luật số ' + num, 'พระราชบัญญัติที่ ' + num,
              'Undang-Undang No. ' + num, 'Akta No. ' + num];
  }
}

// 范围 → 四语
function scopeText(sc) {
  if (!sc) return ['', '', '', ''];
  if (sc.kind === 'some') return ['một số điều', 'บางมาตรา', 'beberapa pasal', 'beberapa seksyen'];
  if (sc.kind === 'item') return ['một số khoản mục', 'บางรายการ', 'beberapa butir', 'beberapa butiran'];
  if (sc.kind === 'title') return ['Tiêu đề ' + sc.v, 'หมวด ' + sc.v, 'Judul ' + sc.v, 'Tajuk ' + sc.v];
  if (sc.kind === 'para') {
    const o = ORD[sc.ord];
    return ['khoản ' + o[0] + ' Điều ' + sc.nums[0], 'วรรค' + o[1] + ' มาตรา ' + sc.nums[0],
            'ayat ' + o[2] + ' Pasal ' + sc.nums[0], 'perenggan ' + o[3] + ' Seksyen ' + sc.nums[0]];
  }
  if (sc.kind === 'list') {
    const j = (a, sep) => {
      const s2 = sep.replace(/^,\s*/, ' ');
      return a.length === 1 ? a[0] : a.length === 2 ? a[0] + s2 + a[1]
        : a.slice(0, -1).join(', ') + sep + a[a.length - 1];
    };
    return [
      (sc.nums.length === 1 ? 'Điều ' : 'các Điều ') + j(sc.nums, ' và '),
      (sc.nums.length === 1 ? 'มาตรา ' : 'มาตรา ') + j(sc.nums, ' และ '),
      (sc.nums.length === 1 ? 'Pasal ' : 'Pasal ') + j(sc.nums, ', dan '),
      (sc.nums.length === 1 ? 'Seksyen ' : 'Seksyen ') + j(sc.nums, ' dan '),
    ];
  }
  return ['', '', '', ''];
}

// 「of」连接：无范围时不加（越语只说「sửa đổi Đạo luật…」）
const OF_WITH = [' của ', 'แห่ง', ' ', ' '];
const OF_NONE = [' ', '', ' ', ' '];

// 尾巴
const T_AS = [' như đã được sửa đổi', ' ซึ่งแก้ไขเพิ่มเติมแล้ว', ' sebagaimana diubah', ' sebagaimana dipinda'];
const T_OTHER = [', và cho các mục đích khác', ' และเพื่อวัตถุประสงค์อื่น', ', dan untuk tujuan lain', ', dan untuk tujuan lain'];

// ── 主解析 ────────────────────────────────────────────────────
function parse(title) {
  let t = L.ENT(title).replace(/\s+/g, ' ').trim();
  if (!/^An Act\b/i.test(t)) return null;
  t = t.replace(/^An Act\s+/i, '');

  const verb = parseVerb(t);
  const scope = parseScope(t);
  const tgt = findTarget(t);
  let code = null;
  if (!tgt) {
    const cm = t.match(/\b(?:of|the)\s+((?:Revised\s+|National\s+|Omnibus\s+|Philippine\s+)?[A-Z][A-Za-z' ,\-]{3,60}?(?:Code|Act|Law)(?:\s+of\s+\d{4})?)/);
    if (cm) code = trCode(cm[1]);
  }
  let charter = null, multi = null;
  if (!tgt && !code) {
    charter = findCharter(t);
    if (!charter) multi = findMultiActs(t);
  }
  if (!tgt && !code && !charter && !multi) return null;

  const asAmended = /\bas\s+Amended\b|\bas\s+amended\s+by\b/i.test(t);
  const other = /and\s+for\s+Other\s+Purposes/i.test(t);

  // 别称：Otherwise Known as / Known as → 括号补充
  let alias = null;
  const am = t.match(/(?:Otherwise\s+[Kk]nown\s+as|[Oo]therwise\s+[Kk]nown\s+as|[Kk]nown\s+as)\s+(?:the\s+)?((?:Charter\s+of\s+the\s+(?:City|Municipality)\s+of\s+[A-Z][A-Za-z' \-]+)|[A-Z][A-Za-z' ,\-]{3,60}?(?:Code|Act|Law)(?:\s+of\s+\d{4})?)/);
  if (am) {
    const raw = am[1].replace(/[,\s]+$/, '').trim();
    const c = trCode(raw);
    if (c) alias = c.t;
    else {
      const ch = trCharter(raw);
      if (ch) alias = ch;
      else if (raw.split(/\s+/).length <= 4 && !/\b(?:of|the|and)\b.*\b(?:of|the|and)\b/i.test(raw)) {
        alias = [raw, raw, raw, raw]; // 不可译的短专名，四语同形引用
      }
    }
  }

  return { verb, scope, tgt, code, charter, multi, asAmended, other, alias };
}

function compose(p) {
  const out = {};
  const keys = ['vi', 'th', 'id', 'ms'];
  const sc = scopeText(p.scope);
  const v = V[p.verb];
  let target;
  if (p.tgt) target = lawName(p.tgt.kind, p.tgt.num);
  else if (p.code) target = p.code.t;
  else if (p.charter) target = p.charter.t;
  else {
    const jn = [' và ', ' และ ', ' dan ', ' dan '];
    const nums = p.multi.nums;
    const join = (n) => n.length === 2 ? n[0] + jn[0] : n.slice(0, -1).join(', ') + jn[0] + n[n.length - 1];
    target = null; // 每语单独拼
  }
  const conj = [' và ', ' และ ', ' dan ', ' dan '];
  for (let i = 0; i < 4; i++) {
    const th = i === 1;
    let tg = target ? target[i] : null;
    if (!tg && p.multi) {
      const forms = p.multi.nums.map(x => lawName('RA', x)[i]);
      tg = forms.length === 2 ? forms[0] + conj[i] + forms[1]
         : forms.slice(0, -1).join(i === 1 ? ' ' : ', ') + conj[i] + forms[forms.length - 1];
    }
    let s = th ? HEAD[i] + v[i] : HEAD[i] + ' ' + v[i];
    if (sc[i]) s += th ? sc[i] : ' ' + sc[i];
    s += (sc[i] ? OF_WITH : OF_NONE)[i] + tg;
    if (p.alias) s += ' (' + p.alias[i] + ')';
    if (p.asAmended) s += T_AS[i];
    if (p.other) s += T_OTHER[i];
    s = th ? L.thFix(s) : s;
    out[keys[i]] = s.replace(/\s+/g, ' ').trim();
  }
  return out;
}

// ── 选取 ──────────────────────────────────────────────────────
const RE_AM = /^An Act\s+(?:[Aa]mending|to\s+[Aa]mend|Further\s+Amending|to\s+Further\s+Amend|Amending)/;
const pool = GAP.filter(x => x.country === 'PH' && RE_AM.test((x.title.en || '').trim()));

const items = {};
const skipped = {};
let taken = 0;
for (const x of pool) {
  if (Object.keys(items).length >= LIMIT) break;
  const p = parse(x.title.en);
  if (!p) { skipped.noparse = (skipped.noparse || 0) + 1; continue; }
  const c = compose(p);
  let bad = null;
  for (const k of ['vi', 'th', 'id', 'ms']) {
    if (/["\u201c\u201d\u2018\u2019《》]/.test(c[k])) bad = 'quote';
    if (c[k].length < 6 || c[k].length > 240) bad = 'len';
    if (/\s{2,}/.test(c[k])) bad = 'space';
  }
  if (bad) { skipped[bad] = (skipped[bad] || 0) + 1; continue; }
  if (taken++ < SKIP) continue;
  items[x.id] = c;
}

const out = { batch: OUT.replace(/\.json$/, ''), count: Object.keys(items).length, items };
fs.writeFileSync('batches/' + OUT, JSON.stringify(out, null, 1), 'utf8');
console.log('pool', pool.length, '→', Object.keys(items).length, JSON.stringify(skipped));
