// PH 特许经营权类标题四语模板引擎（v2）
// 修正：① 地域支持「City of X, Province of Y」多级；② 广播客体区分 radio / television / both；
//       ③ 电力客体区分 distribution / transmission / both。
'use strict';
const fs = require('fs');
const path = require('path');

const rest = JSON.parse(fs.readFileSync(path.join(__dirname, '_ph_rest.json'), 'utf8'));

const UNIT = {
  city: ['Thành phố', 'เมือง', 'Kota', 'Bandaraya'],
  municipality: ['thị xã', 'เทศบาล', 'Kotamadya', 'Perbandaran'],
  province: ['tỉnh', 'จังหวัด', 'Provinsi', 'Wilayah'],
  region: ['vùng', 'ภูมิภาค', 'wilayah', 'wilayah'],
};

function unitKey(w) {
  const s = w.toLowerCase();
  if (s.startsWith('cit')) return 'city';
  if (s.startsWith('municipal')) return 'municipality';
  if (s.startsWith('prov')) return 'province';
  return 'region';
}

/* 地域：一条或多条「<Unit> of <Name>」，可被 and / comma / 以及 in 连接 */
function extractArea(e) {
  if (/throughout\s+the\s+Philippines/i.test(e)) {
    return { vi: 'trên toàn lãnh thổ Philippines', th: 'ทั่วประเทศฟิลิปปินส์',
             id: 'di seluruh wilayah Filipina', ms: 'di seluruh wilayah Filipina' };
  }
  const re = /\b(City|Municipality|Province|Region|Municipalities|Cities|Provinces)\s+of\s+([A-Z][A-Za-zñÑ.\-' ]*?)(?=\s*(?:,|and\s+the\s+|and\s+in\s+|in\s+the\s+|$|;|\.))/g;
  const found = [];
  let m;
  while ((m = re.exec(e)) !== null) {
    const name = m[2].trim().replace(/\s+(and|in|for)$/i, '')
      .replace(/\s*\band\s+(?:all\s+)?the\s+(?:Cities|Municipalities|Provinces)\s+(?:Therein|Thereof)\b.*$/i, '')
      .replace(/\s*\band\s+its\s+Suburbs\b.*$/i, '')
    if (name) found.push({ k: unitKey(m[1]), name });
  }
  if (!found.length) return null;
  // 只取前两级，避免把列举的长串全塞进标题
  const use = found.slice(0, 2);
  const AND = [' và ', ' และ ', ' dan ', ' dan '];
  const join = (lang) => use.map((x) => {
    const u = UNIT[x.k][lang];
    const nm = x.name.replace(/\s+and\s+/gi, AND[lang]);
    return `${u} ${nm}`;
  }).join(', ');
  return {
    vi: 'tại ' + join(0) + (use.length === 1 ? '' : ''),
    th: 'ใน' + join(1),
    id: 'di ' + join(2),
    ms: 'di ' + join(3),
  };
}

/* 客体：按最具体的先匹配 */
const OBJ = [
  { key: 'broadcast_both', re: /radio[^.;]{0,40}television|television[^.;]{0,40}radio|mass\s*media/i,
    vi: 'hệ thống phát thanh và truyền hình', th: 'ระบบวิทยุกระจายเสียงและวิทยุโทรทัศน์',
    id: 'sistem penyiaran radio dan televisi', ms: 'sistem penyiaran radio dan televisyen' },
  { key: 'radio', re: /radio\s*broadcasting\s*(?:station|service|system)|broadcasting\s*station[s]?\s*for\s*radio|radio\s*station/i,
    vi: 'hệ thống phát thanh', th: 'ระบบวิทยุกระจายเสียง', id: 'sistem penyiaran radio', ms: 'sistem penyiaran radio' },
  { key: 'tv', re: /television\s*(?:broadcasting\s*)?(?:station|service|system)|television\s*station/i,
    vi: 'hệ thống truyền hình', th: 'ระบบโทรทัศน์', id: 'sistem penyiaran televisi', ms: 'sistem penyiaran televisyen' },
  { key: 'telecom', re: /telecommunication|telephone\s*(?:system|service)|local\s*exchange\s*network|transmission\s*network|data\s*transmission/i,
    vi: 'hệ thống viễn thông', th: 'ระบบโทรคมนาคม', id: 'sistem telekomunikasi', ms: 'sistem telekomunikasi' },
  { key: 'power_dist', re: /distribution\s*system|distributed\s*energy|microgrid/i,
    vi: 'hệ thống phân phối điện', th: 'ระบบจำหน่ายไฟฟ้า', id: 'sistem distribusi tenaga listrik', ms: 'sistem pengagihan tenaga elektrik' },
  { key: 'power_trans', re: /transmission\s*system|transmission\s*line/i,
    vi: 'hệ thống truyền tải điện', th: 'ระบบส่งกระแสไฟฟ้า', id: 'sistem transmisi tenaga listrik', ms: 'sistem penghantaran tenaga elektrik' },
  { key: 'power', re: /electric\s*(?:power|energy)|power\s*(?:generation|plant|system)/i,
    vi: 'hệ thống điện', th: 'ระบบไฟฟ้า', id: 'sistem tenaga listrik', ms: 'sistem tenaga elektrik' },
  { key: 'air', re: /air\s*transport|airline|airport/i,
    vi: 'dịch vụ vận tải hàng không', th: 'บริการขนส่งทางอากาศ', id: 'jasa angkutan udara', ms: 'perkhidmatan pengangkutan udara' },
  { key: 'water', re: /water\s*(?:system|supply|distribution|utility)/i,
    vi: 'hệ thống cấp nước', th: 'ระบบประปา', id: 'sistem penyediaan air', ms: 'sistem bekalan air' },
];

function extractGrantee(e) {
  let m = e.match(/^An Act Granting\s+(?:a\s+Franchise\s+to\s+)?(?:the\s+)?(.+?)\s*,?\s+(?:a\s+Franchise|to\s+(?:Construct|Establish|Install|Operate|Maintain|Own|Develop|Provide|Extend|Supply|Generate|Import|Sell))/i);
  if (m) return m[1].trim().replace(/,$/, '').replace(/^To\s+the\s+/i, '');
  m = e.match(/^An Act Granting\s+(?:a\s+Franchise\s+to\s+)?(?:the\s+)?(.+?),?\s+a\s+Franchise/i);
  if (m) return m[1].trim().replace(/,$/, '');
  return null;
}

const items = {};
let skipped = 0;
const reasons = {};

for (const r of rest) {
  const e = (r.title.en || '').trim();
  if (!/^An Act Granting/i.test(e)) continue;
  if (!/franchise/i.test(e)) { skipped++; reasons['no-franchise-word'] = (reasons['no-franchise-word'] || 0) + 1; continue; }

  const o = OBJ.find((x) => x.re.test(e));
  if (!o) { skipped++; reasons['no-obj'] = (reasons['no-obj'] || 0) + 1; continue; }

  const grantee = extractGrantee(e);
  if (!grantee || grantee.length < 3) { skipped++; reasons['no-grantee'] = (reasons['no-grantee'] || 0) + 1; continue; }

  const area = extractArea(e) || { vi: 'tại Philippines', th: 'ในฟิลิปปินส์', id: 'di Filipina', ms: 'di Filipina' };

  const ENT = (x) => x.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const gname = ENT(grantee);

  items[r.id] = {
    vi: `Đạo luật cấp quyền khai thác cho ${gname} để xây dựng, lắp đặt, vận hành và duy trì ${o.vi} ${area.vi}`,
    th: `พระราชบัญญัติให้สัมปทานแก่ ${gname} เพื่อก่อสร้าง ติดตั้ง ดำเนินการ และบำรุงรักษา${o.th}${area.th}`,
    id: `Undang-Undang memberikan waralaba kepada ${gname} untuk membangun, memasang, mengoperasikan, dan memelihara ${o.id} ${area.id}`,
    ms: `Akta memberikan francais kepada ${gname} untuk membina, memasang, mengendalikan dan menyelenggara ${o.ms} ${area.ms}`,
  };
}

const OUT = {
  batch: 'ph-p1-b09',
  scope: `PH 特许经营权类 ${Object.keys(items).length} 部（模板 v2：受让人 + 客体细分 + 多级地域）`,
  items,
};
const dst = path.join(__dirname, 'batches', 'ph-p1-b09.json');
fs.writeFileSync(dst, JSON.stringify(OUT, null, 1), 'utf8');
console.log('部数', Object.keys(items).length, '| 跳过', skipped, JSON.stringify(reasons));
