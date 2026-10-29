// PH 特许经营权族（franchise）四语合成引擎
// 结构极稳：An Act Granting <受让人> a Franchise to <动词串> <标的> <地点>, and to <次级条款>
// 严格原则：任何一段（动词/标的/地点/次级条款）不在表内即整条放弃，交人工。
'use strict';
const fs = require('fs');
const path = require('path');
const LX = require('./_ph_lex.js');
const { gate } = require('./_sg_gate.js');
const TPD = require('./_ph_tpdict.js');

const LANGS = ['vi', 'th', 'id', 'ms'];
const H = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];

// ── 动词 ────────────────────────────────────────────────────────────
const VERB = {
  construct: ['xây dựng', 'ก่อสร้าง', 'membangun', 'membina'],
  establish: ['thiết lập', 'จัดตั้ง', 'mendirikan', 'menubuhkan'],
  install: ['lắp đặt', 'ติดตั้ง', 'memasang', 'memasang'],
  maintain: ['duy trì', 'บำรุงรักษา', 'memelihara', 'menyelenggarakan'],
  operate: ['vận hành', 'ดำเนินการ', 'mengoperasikan', 'mengendalikan'],
  hold: ['tổ chức', 'จัด', 'menyelenggarakan', 'menganjurkan'],
  conduct: ['tiến hành', 'ดำเนินการ', 'menyelenggarakan', 'menjalankan'],
  own: ['sở hữu', 'เป็นเจ้าของ', 'memiliki', 'memiliki'],
  acquire: ['mua lại', 'ได้มา', 'memperoleh', 'memperoleh'],
  develop: ['phát triển', 'พัฒนา', 'mengembangkan', 'membangun'],
  provide: ['cung cấp', 'ให้บริการ', 'menyediakan', 'menyediakan'],
  render: ['cung cấp', 'ให้บริการ', 'menyediakan', 'menyediakan'],
  run: ['điều hành', 'เดินเครื่อง', 'menjalankan', 'mengendalikan'],
  sell: ['bán', 'จำหน่าย', 'menjual', 'menjual'],
  supply: ['cung cấp', 'ให้', 'menyediakan', 'membekalkan'],
  distribute: ['phân phối', 'กระจาย', 'mendistribusikan', 'mengagihkan'],
  furnish: ['cung cấp', 'ให้', 'menyediakan', 'menyediakan'],
};
const VKEYS = Object.keys(VERB);
function joinVerbs(list, i) {
  const w = list.map((v) => VERB[v][i]);
  if (w.length === 1) return w[0];
  const last = w.pop();
  if (i === 0) return w.join(', ') + ' và ' + last;
  if (i === 1) return w.join(' ') + ' และ' + last;
  if (i === 2) return w.join(', ') + ', dan ' + last;
  return w.join(', ') + ' dan ' + last;
}

// ── 标的词典 ────────────────────────────────────────────────────────
// 键为规范化英文（小写、去冠词、去尾标点、复数归并）
const OBJ = {
  'ice plant and cold storage': ['nhà máy nước đá và kho lạnh', 'โรงงานน้ำแข็งและห้องเย็น', 'pabrik es dan penyimpanan dingin', 'kilang ais dan stor sejuk'],
  'ice and cold storage plant': ['nhà máy nước đá và kho lạnh', 'โรงงานน้ำแข็งและห้องเย็น', 'pabrik es dan penyimpanan dingin', 'kilang ais dan stor sejuk'],
  'ice plant and cold storage facility': ['nhà máy nước đá và cơ sở kho lạnh', 'โรงงานน้ำแข็งและสถานที่ห้องเย็น', 'pabrik es dan fasilitas penyimpanan dingin', 'kilang ais dan kemudahan stor sejuk'],
  'ice plant': ['nhà máy nước đá', 'โรงงานน้ำแข็ง', 'pabrik es', 'kilang ais'],
  'ice flake plant': ['nhà máy nước đá vảy', 'โรงงานน้ำแข็งเกล็ด', 'pabrik es serpih', 'kilang ais serpih'],
  'electric light, heat and power system': ['hệ thống chiếu sáng, sưởi ấm và điện lực', 'ระบบไฟฟ้าแสงสว่าง ความร้อน และพลังงานไฟฟ้า', 'sistem penerangan, pemanas, dan tenaga listrik', 'sistem lampu, haba dan kuasa elektrik'],
  'electric light, heat, power, ice and cold storage plant': ['nhà máy điện chiếu sáng, sưởi ấm, điện lực, nước đá và kho lạnh', 'โรงงานไฟฟ้าแสงสว่าง ความร้อน พลังงานไฟฟ้า น้ำแข็งและห้องเย็น', 'pabrik penerangan, pemanas, tenaga listrik, es dan penyimpanan dingin', 'kilang lampu, haba, kuasa elektrik, ais dan stor sejuk'],
  'waterworks system and sewerage and sanitation services': ['hệ thống cấp nước và dịch vụ thoát nước và vệ sinh', 'ระบบประปาและบริการระบายน้ำและสุขาภิบาล', 'sistem air bersih serta layanan saluran pembuangan dan sanitasi', 'sistem bekalan air serta perkhidmatan pembetungan dan sanitasi'],
  'waterworks and sewerage system': ['hệ thống cấp nước và thoát nước', 'ระบบประปาและระบบระบายน้ำ', 'sistem air bersih dan saluran pembuangan', 'sistem bekalan air dan pembetungan'],
  'water supply system': ['hệ thống cấp nước', 'ระบบจ่ายน้ำ', 'sistem penyediaan air', 'sistem bekalan air'],
  'messenger and delivery express service': ['dịch vụ chuyển phát và giao nhận', 'บริการส่งสารและจัดส่งด่วน', 'layanan kurir dan pengiriman ekspres', 'perkhidmatan kurier dan penghantaran ekspres'],
  'air freight forwarding, messenger and delivery service': ['dịch vụ giao nhận hàng hóa hàng không, chuyển phát và giao hàng', 'บริการรับส่งสินค้าทางอากาศ ส่งสาร และจัดส่ง', 'layanan pengiriman kargo udara, kurir, dan pengiriman', 'perkhidmatan penghantaran kargo udara, kurier dan penghantaran'],
  'ferry service for passengers and freight': ['dịch vụ phà chở khách và hàng hóa', 'บริการเรือข้ามฟากสำหรับผู้โดยสารและสินค้า', 'layanan feri untuk penumpang dan barang', 'perkhidmatan feri untuk penumpang dan kargo'],
  'ferry service for passengers and freight vehicles': ['dịch vụ phà chở khách và xe vận tải', 'บริการเรือข้ามฟากสำหรับผู้โดยสารและยานพาหนะบรรทุกสินค้า', 'layanan feri untuk penumpang dan kendaraan barang', 'perkhidmatan feri untuk penumpang dan kenderaan kargo'],
  'ferry service': ['dịch vụ phà', 'บริการเรือข้ามฟาก', 'layanan feri', 'perkhidmatan feri'],
  'race track for horse racing': ['trường đua ngựa', 'สนามแข่งม้า', 'lintasan pacuan kuda', 'litar lumba kuda'],
  'radio paging system': ['hệ thống nhắn tin vô tuyến', 'ระบบวิทยุเรียกตัว', 'sistem panggilan radio', 'sistem panggilan radio'],
  'radio paging station': ['trạm nhắn tin vô tuyến', 'สถานีวิทยุเรียกตัว', 'stasiun panggilan radio', 'stesen panggilan radio'],
  'radio paging systems and trunked radio systems': ['hệ thống nhắn tin vô tuyến và hệ thống vô tuyến trung kế', 'ระบบวิทยุเรียกตัวและระบบวิทยุทรังค์', 'sistem panggilan radio dan sistem radio trunking', 'sistem panggilan radio dan sistem radio trunking'],
  'commercial radio paging service': ['dịch vụ nhắn tin vô tuyến thương mại', 'บริการวิทยุเรียกตัวเชิงพาณิชย์', 'layanan panggilan radio komersial', 'perkhidmatan panggilan radio komersial'],
  'broadcasting station': ['đài phát thanh và truyền hình', 'สถานีวิทยุกระจายเสียงและวิทยุโทรทัศน์', 'stasiun penyiaran', 'stesen penyiaran'],
  'station for radio': ['đài phát thanh', 'สถานีวิทยุ', 'stasiun radio', 'stesen radio'],
  'national expositions and carnivals': ['triển lãm và hội chợ quốc gia', 'งานนิทรรศการและเทศกาลระดับชาติ', 'pameran dan karnaval nasional', 'pameran dan karnival kebangsaan'],
  'monorail transportation service': ['dịch vụ vận tải một ray', 'บริการขนส่งระบบรางเดี่ยว', 'layanan transportasi monorel', 'perkhidmatan pengangkutan monorel'],
  'communications system for the reception and transmission of messages': ['hệ thống thông tin liên lạc để nhận và truyền tin', 'ระบบการสื่อสารสำหรับรับและส่งข้อความ', 'sistem komunikasi untuk penerimaan dan pengiriman pesan', 'sistem komunikasi untuk penerimaan dan penghantaran mesej'],
  'radio communications system': ['hệ thống thông tin vô tuyến', 'ระบบการสื่อสารทางวิทยุ', 'sistem komunikasi radio', 'sistem komunikasi radio'],
  'radio communication system': ['hệ thống thông tin vô tuyến', 'ระบบการสื่อสารทางวิทยุ', 'sistem komunikasi radio', 'sistem komunikasi radio'],
  'taxi communication system': ['hệ thống thông tin liên lạc cho taxi', 'ระบบการสื่อสารสำหรับแท็กซี่', 'sistem komunikasi taksi', 'sistem komunikasi teksi'],
  'public radiotelephone coastal station': ['trạm điện thoại vô tuyến ven biển công cộng', 'สถานีวิทยุโทรศัพท์ชายฝั่งสาธารณะ', 'stasiun radiotelepon pesisir umum', 'stesen radiotelefon pesisir awam'],
  'radiotelegraph and/or radiotelephone station': ['trạm điện báo và/hoặc điện thoại vô tuyến', 'สถานีวิทยุโทรเลขและ/หรือวิทยุโทรศัพท์', 'stasiun radiotelegraf dan/atau radiotelepon', 'stesen radiotelegraf dan/atau radiotelefon'],
  'floating bonded warehouse and cold storage facility': ['kho ngoại quan nổi và cơ sở kho lạnh', 'คลังสินค้าทัณฑ์บนลอยน้ำและสถานที่ห้องเย็น', 'gudang berikat terapung dan fasilitas penyimpanan dingin', 'gudang berbon terapung dan kemudahan stor sejuk'],
  'natural gas pipeline for the transportation and distribution of natural gas': ['đường ống dẫn khí tự nhiên để vận chuyển và phân phối khí tự nhiên', 'ท่อส่งก๊าซธรรมชาติสำหรับการขนส่งและจำหน่ายก๊าซธรรมชาติ', 'pipa gas alam untuk pengangkutan dan distribusi gas alam', 'saluran paip gas asli untuk pengangkutan dan pengagihan gas asli'],
  'private fixed point-to-point radiotelephone station for the transmission and reception of wireless messages': ['trạm điện thoại vô tuyến cố định điểm-điểm tư nhân để truyền và nhận tin nhắn không dây', 'สถานีวิทยุโทรศัพท์แบบจุดต่อจุดประจำที่ของเอกชนสำหรับส่งและรับข้อความไร้สาย', 'stasiun radiotelepon titik-ke-titik tetap swasta untuk pengiriman dan penerimaan pesan nirkabel', 'stesen radiotelefon titik-ke-titik tetap persendirian untuk penghantaran dan penerimaan mesej tanpa wayar'],
  'fixed point-to-point radiophone and radiotelegraph station for the reception and transmission of radio communications': ['trạm điện thoại và điện báo vô tuyến cố định điểm-điểm để nhận và truyền thông tin vô tuyến', 'สถานีวิทยุโทรศัพท์และวิทยุโทรเลขแบบจุดต่อจุดประจำที่สำหรับรับและส่งการสื่อสารทางวิทยุ', 'stasiun radiotelepon dan radiotelegraf titik-ke-titik tetap untuk penerimaan dan pengiriman komunikasi radio', 'stesen radiotelefon dan radiotelegraf titik-ke-titik tetap untuk penerimaan dan penghantaran komunikasi radio'],
  'public radiotelephone and radiotelegraph station for the reception and transmission of radiotelephone and radiotelegraph communications': ['trạm điện thoại và điện báo vô tuyến công cộng để nhận và truyền thông tin điện thoại và điện báo vô tuyến', 'สถานีวิทยุโทรศัพท์และวิทยุโทรเลขสาธารณะสำหรับรับและส่งการสื่อสารทางวิทยุโทรศัพท์และวิทยุโทรเลข', 'stasiun radiotelepon dan radiotelegraf umum untuk penerimaan dan pengiriman komunikasi radiotelepon dan radiotelegraf', 'stesen radiotelefon dan radiotelegraf awam untuk penerimaan dan penghantaran komunikasi radiotelefon dan radiotelegraf'],
  'radio communications station for the transmission and reception of radio telephone communications': ['trạm thông tin vô tuyến để truyền và nhận liên lạc điện thoại vô tuyến', 'สถานีการสื่อสารทางวิทยุสำหรับส่งและรับการสื่อสารทางวิทยุโทรศัพท์', 'stasiun komunikasi radio untuk pengiriman dan penerimaan komunikasi radiotelepon', 'stesen komunikasi radio untuk penghantaran dan penerimaan komunikasi radiotelefon'],
};

// 次级从句（"and to Sell Ice …"）
const SEC = {
  'sell ice': ['và bán nước đá', 'และจำหน่ายน้ำแข็ง', 'dan menjual es', 'dan menjual ais'],
  'sell ice and supply cold storage': ['và bán nước đá và cung cấp dịch vụ kho lạnh', 'และจำหน่ายน้ำแข็งและให้บริการห้องเย็น', 'dan menjual es serta menyediakan layanan penyimpanan dingin', 'dan menjual ais serta menyediakan perkhidmatan stor sejuk'],
  'sell ice and supply cold storage service': ['và bán nước đá và cung cấp dịch vụ kho lạnh', 'และจำหน่ายน้ำแข็งและให้บริการห้องเย็น', 'dan menjual es serta menyediakan layanan penyimpanan dingin', 'dan menjual ais serta menyediakan perkhidmatan stor sejuk'],
  'sell ice and supply cold storage facility': ['và bán nước đá và cung cấp cơ sở kho lạnh', 'และจำหน่ายน้ำแข็งและให้บริการสถานที่ห้องเย็น', 'dan menjual es serta menyediakan fasilitas penyimpanan dingin', 'dan menjual ais serta menyediakan kemudahan stor sejuk'],
  'sell and supply cold storage': ['và bán nước đá và cung cấp dịch vụ kho lạnh', 'และจำหน่ายน้ำแข็งและให้บริการห้องเย็น', 'dan menjual es serta menyediakan layanan penyimpanan dingin', 'dan menjual ais serta menyediakan perkhidmatan stor sejuk'],
  'sell ice and cold storage': ['và bán nước đá và dịch vụ kho lạnh', 'และจำหน่ายน้ำแข็งและบริการห้องเย็น', 'dan menjual es dan layanan penyimpanan dingin', 'dan menjual ais dan perkhidmatan stor sejuk'],
  'sell and distribute ice': ['và bán và phân phối nước đá', 'และจำหน่ายและกระจายน้ำแข็ง', 'dan menjual serta mendistribusikan es', 'dan menjual serta mengagihkan ais'],
  'sell and distribute ice and supply cold storage': ['và bán, phân phối nước đá và cung cấp dịch vụ kho lạnh', 'และจำหน่าย กระจายน้ำแข็ง และให้บริการห้องเย็น', 'dan menjual, mendistribusikan es serta menyediakan layanan penyimpanan dingin', 'dan menjual, mengagihkan ais serta menyediakan perkhidmatan stor sejuk'],
  'sell and distribute ice and supply cold storage facility': ['và bán, phân phối nước đá và cung cấp cơ sở kho lạnh', 'และจำหน่าย กระจายน้ำแข็ง และให้บริการสถานที่ห้องเย็น', 'dan menjual, mendistribusikan es serta menyediakan fasilitas penyimpanan dingin', 'dan menjual, mengagihkan ais serta menyediakan kemudahan stor sejuk'],
  'distribute and sell ice so manufactured and furnish cold storage': ['và phân phối, bán lượng nước đá sản xuất và cung cấp dịch vụ kho lạnh', 'และกระจาย จำหน่ายน้ำแข็งที่ผลิตขึ้น และให้บริการห้องเย็น', 'dan mendistribusikan, menjual es yang diproduksi serta menyediakan penyimpanan dingin', 'dan mengagihkan, menjual ais yang dihasilkan serta menyediakan stor sejuk'],
  'distribute and sell ice so manufactured and furnish cold storage facility': ['và phân phối, bán lượng nước đá sản xuất và cung cấp cơ sở kho lạnh', 'และกระจาย จำหน่ายน้ำแข็งที่ผลิตขึ้น และให้บริการสถานที่ห้องเย็น', 'dan mendistribusikan, menjual es yang diproduksi serta menyediakan fasilitas penyimpanan dingin', 'dan mengagihkan, menjual ais yang dihasilkan serta menyediakan kemudahan stor sejuk'],
  'distribute and sell ice': ['và phân phối và bán nước đá', 'และกระจายและจำหน่ายน้ำแข็ง', 'dan mendistribusikan serta menjual es', 'dan mengagihkan serta menjual ais'],
  'distribute and sell ice flake': ['và phân phối và bán nước đá vảy', 'และกระจายและจำหน่ายน้ำแข็งเกล็ด', 'dan mendistribusikan serta menjual es serpih', 'dan mengagihkan serta menjual ais serpih'],
  'sell the ice and cold storage service': ['và bán nước đá và dịch vụ kho lạnh', 'และจำหน่ายน้ำแข็งและบริการห้องเย็น', 'dan menjual es dan layanan penyimpanan dingin', 'dan menjual ais dan perkhidmatan stor sejuk'],
  'sell ice and accept commodities for storage': ['và bán nước đá và nhận hàng hóa lưu kho', 'และจำหน่ายน้ำแข็งและรับฝากสินค้า', 'dan menjual es serta menerima barang untuk penyimpanan', 'dan menjual ais serta menerima barangan untuk penyimpanan'],
};

// ── 地点 ────────────────────────────────────────────────────────────
const UNIT = /^(Provinces?|Cities|City|Municipalities|Municipality|Subprovinces?|Subprovince|Regions?|Region|Districts?|District|Islands?|Island|Barangays?|Barangay|Barrios?|Barrio|Sitios?|Sitio)\b\s*(?:of\s+)?/i;
const SING = { provinces: 'Province', cities: 'City', municipalities: 'Municipality', subprovinces: 'Subprovince', regions: 'Region', districts: 'District', islands: 'Island', barangays: 'Barangay', barrios: 'Barrio', sitios: 'Sitio' };
const BADNAME = /^(?:Suburbs?|Province|City|Municipality|Municipalities|Island|Barangay|Barrio|District|Region|All|Both|Said|The|Philippines\s+and)\b/i;

function splitNames(s) {
  let x = s.replace(/\s*&\s*/g, ' and ').replace(/\s+/g, ' ').trim();
  x = x.replace(/\s+and\/or\s+/gi, ', ');
  x = x.replace(/^and\s+/i, '');
  const parts = x.split(/\s*,\s*|\s+and\s+/).map((t) => t.trim()).filter(Boolean);
  return parts;
}

function locParse(raw) {
  let x = String(raw).replace(/\s+/g, ' ').trim();
  x = x.replace(/^(?:in|within|at|Within|In)\s+/i, '').replace(/^the\s+/i, '').trim();
  x = x.replace(/^(?:Each\s+of\s+the|All\s+in\s+the|Both\s+in\s+the|All\s+over\s+the)\s+/i, '').trim();
  if (/\b(?:Between|Betweeen)\b/i.test(x)) return null;   // 渡运航线是区间，不是地点链
  if (/\bor\b/i.test(x)) return null;                     // 择一地点不能拼成并列链
  x = x.replace(/^(?:the\s+)?(?:Whole|Entire|Adjacent|Certain)\s+/i, '');
  x = x.replace(/^(?:the\s+)?Said\s+/i, '');
  // 「the Municipality of Lubao in the Province of Pampanga」→ 逗号分段
  // 「A, All in the Province of B」「A and in the Province of B」都要拆成同级分段
  x = x.replace(/[,;]?\s*\b(?:All|Both)\s+in\s+the\s+(?=(?:City|Municipality|Municipalities|Province|Provinces|Barrio|Barangay|Island|District|Region)\s+of\b)/gi, ', ');
  x = x.replace(/[\s,]+(?:and\s+|or\s+)?in\s+the\s+(?=(?:City|Municipality|Municipalities|Province|Provinces|Barrio|Barangay|Island|District|Region)\s+of\b)/gi, ', ');
  // 「X and the City of Y」「X and in the Province of Y」拆成分段
  x = x.replace(/\s+and\s+(?:in\s+)?(?:the\s+)?(?=(?:City|Municipality|Municipalities|Province|Provinces|Barrio|Barangay|Island|District|Region)\s+of\b)/gi, ', ');
  if (/^(?:the\s+)?Philippines$/i.test(x)) return [{ type: 'Country', names: ['Philippines'] }];
  const allm = x.match(/^All\s+(?:the\s+)?(Municipalities|Barangays|Barrios|Cities|Provinces)[\s,]*(?:in|of|within)?\s*(?:the\s+)?([\s\S]+)$/i);
  if (allm) {
    const inner = locParse(allm[2]);
    if (!inner) return null;
    return [{ type: 'AllOf', sub: SING[allm[1].toLowerCase()] || 'Municipality', inner }];
  }
  const segs = x.split(/\s*,\s*/).filter(Boolean);
  const out = [];
  let lastType = null, listMode = false;
  for (let seg of segs) {
    seg = seg.replace(/^(?:and\s+|&\s+)/i, '').replace(/^(?:All\s+in\s+the|Both\s+in\s+the)\s+/i, '').trim();
    if (!seg) continue;
    if (/^(?:All|Both)\b/.test(seg) === false && /^(?:All|Both)\b/.test(seg)) continue;
    const um = seg.match(UNIT);
    let type = null, namesRaw = null;
    if (um) {
      const w = um[1].toLowerCase();
      type = SING[w] || um[1].replace(/s$/, '').replace(/^./, (c) => c.toUpperCase());
      namesRaw = seg.slice(um[0].length);
      listMode = true;
    } else if (lastType && listMode) {
      type = lastType;
      namesRaw = seg;
    } else if (/\bCity$/i.test(seg)) {
      type = 'City';
      namesRaw = seg.replace(/\s*City$/i, '');
    } else {
      return null;   // 认不出层级，交人工
    }
    if (!namesRaw) return null;
    const names = splitNames(namesRaw).filter((n) => {
      if (!n) return false;
      if (BADNAME.test(n)) return false;
      if (/\b(?:of|the|and|or)\b/i.test(n)) return false;   // 「Banlik of the Municipality of X」不是地名
      return /^[A-Z]/.test(n);
    });
    if (!names.length || names.length !== splitNames(namesRaw).length) return null;
    // 名称里不该再有区划词（"Manila and Suburbs" 一类）
    if (names.some((n) => /\b(?:Suburbs?|and|Province|Municipality|Municipalities)\b/.test(n) && !/^[A-Z][a-z]+ de /.test(n))) {
      if (names.some((n) => /\b(?:Suburbs?|Province|Municipalities)\b/.test(n))) return null;
    }
    out.push({ type, names });
    lastType = type;
  }
  return out.length ? out : null;
}

const ADMIN = LX.ADMIN;
const COUNTRY = ['Philippines', 'ฟิลิปปินส์', 'Filipina', 'Filipina'];
const ALLW = {
  Municipality: ['tất cả các thị trấn', 'เทศบาลทั้งหมด', 'seluruh kotamadya', 'semua perbandaran'],
  City: ['tất cả các thành phố', 'เมืองทั้งหมด', 'seluruh kota', 'semua bandar'],
  Province: ['tất cả các tỉnh', 'จังหวัดทั้งหมด', 'seluruh provinsi', 'semua wilayah'],
  Barangay: ['tất cả các barangay', 'บารังไกย์ทั้งหมด', 'seluruh barangay', 'semua barangay'],
  Barrio: ['tất cả các barrio', 'บาริโอทั้งหมด', 'seluruh barrio', 'semua barrio'],
};
function joinNames(names, i) {
  if (names.length === 1) return names[0];
  const last = names[names.length - 1];
  const head = names.slice(0, -1);
  if (i === 0) return head.join(', ') + ' và ' + last;
  if (i === 1) return head.join(' ') + ' และ' + last;
  if (i === 2) return head.join(', ') + ', dan ' + last;
  return head.join(', ') + ' dan ' + last;
}
function locRender(list, i) {
  const parts = [];
  let k = 0;
  while (k < list.length) {
    const type = list[k].type;
    if (type === 'AllOf') {
      const node = list[k++];
      const innerT = locRender(node.inner, i);
      if (!innerT) return null;
      const w = ALLW[node.sub] || ALLW.Municipality;
      parts.push(i === 0 ? `${w[0]} thuộc ${innerT}` : i === 1 ? `${w[1]}ใน${innerT}` : `${w[i]} di ${innerT}`);
      continue;
    }
    const names = [];
    while (k < list.length && list[k].type === type) { names.push(...list[k].names); k++; }
    if (type === 'Country') { parts.push(COUNTRY[i]); continue; }
    const a = ADMIN[type];
    if (!a) return null;
    const nm = joinNames(names, i);
    parts.push(i === 1 ? a[1] + nm : a[i] + ' ' + nm);
  }
  return i === 1 ? parts.join(' ') : parts.join(', ');
}
const AT = ['tại', 'ใน', 'di', 'di'];
function locPhrase(list, i) {
  if (!list) return '';
  const t = locRender(list, i);
  if (!t) return '';
  return ' ' + AT[i] + (i === 1 ? '' : ' ') + t;
}

// ── 工具 ────────────────────────────────────────────────────────────
const ENT = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const cleanName = (s) => ENT(s)
  .replace(/^the\s+/i, '')
  .replace(/[,\s]+$/, '')
  .replace(/^to\s+/i, '')
  .trim();
const pluralKey = (s) => s.toLowerCase()
  .replace(/^(?:the|a|an)\s+/, '')
  .replace(/[.,;]$/, '')
  .replace(/\s+/g, ' ')
  .replace(/^iceplants?\b/, 'ice plant')
  .trim();
// 受让人只能是机构名/人名：带这些从句说明原文里还有别的话，整条交人工
const BADGRANTEE = /\b(?:Doing\s+Business|Formerly\s+Known|Presently\s+Known|Heretofore|Hereinafter|Under\s+(?:the\s+)?Republic\s+Act|Under\s+RA|as\s+Amended|Represented\s+by|Now\s+Known|Residing|Resident\s+of)\b|\bAnd\s*\/\s*Or\b|,\s*(?:of|residing)\b/i;
const goodName = (g) => !!g && /^[A-Z]/.test(g) && !BADGRANTEE.test(g);
// 复数归并：facilities→facility, stations→station, systems→system, services→service, plants→plant
function singularize(k) {
  const rules = [
    [/\bfacilities\b/g, 'facility'],
    [/\bstations\b/g, 'station'],
    [/\bsystems\b/g, 'system'],
    [/\bservices\b/g, 'service'],
    [/\bplants\b/g, 'plant'],
    [/\btracks\b/g, 'track'],
    [/\bstorages\b/g, 'storage'],
    [/\bwarehouses\b/g, 'warehouse'],
    [/\bflakes\b/g, 'flake'],
    [/\bcommunications systems\b/g, 'communications system'],
  ];
  let x = k;
  for (const [re, to] of rules) x = x.replace(re, to);
  x = x.replace(/\bcold storages\b/g, 'cold storage');
  return x;
}
const objNorm = (s) => String(s)
  .toLowerCase()
  .replace(/^(?:the|a|an)\s+/, '')
  .replace(/\s*,\s*(?:and\s+|&\s*)/g, ' and ')
  .replace(/\s*&\s*/g, ' and ')
  .replace(/\s+to\s+and\s+from\s+(?:the\s+)?said\s+stations?$/, '')
  .replace(/\s+or\s+plants?$/, '')
  .replace(/\bpowers system\b/g, 'power system')
  .replace(/[.,;:]$/, '')
  .replace(/\s+/g, ' ')
  .trim();
const objLook = (k) => {
  const base = objNorm(k);
  return OBJ[base] || OBJ[singularize(base)] || OBJ[base.replace(/\bplants?\b/g, 'plant')] || null;
};
const secLook = (k) => {
  let x = String(k).toLowerCase()
    .replace(/^[,\s]+/, '')
    .replace(/^(?:and\s+)?to\s+/, '')
    .replace(/\s+and\s+to\s+/g, ' and ')
    .replace(/^(?:and\s+)?to\s+/, '')
    .replace(/[,\s]*\band\b[,\s]*$/, '')
    .replace(/\s+/g, ' ')
    .replace(/[.,;]$/, '')
    .trim();
  return SEC[singularize(x)] || SEC[x] || null;
};

// ── 句框 ────────────────────────────────────────────────────────────
const VRE = new RegExp('^(' + VKEYS.map((v) => v[0].toUpperCase() + v.slice(1)).join('|') + ')\\b[\\s,]*(?:and\\s+)?', 'i');
function eatVerbs(s) {
  const out = [];
  let cur = s;
  for (;;) {
    const m = cur.match(VRE);
    if (!m) break;
    out.push(m[1].toLowerCase());
    cur = cur.slice(m[0].length).trim();
  }
  return { vs: out, rest: cur };
}
function cutSecondary(s) {
  const m = s.match(/[,]?\s+(?:and\s+)?to\s+(Sell|Supply|Distribute|Furnish|Accept)\b/i);
  if (m && m.index > 5) {
    return { main: s.slice(0, m.index).trim().replace(/,$/, ''), sec: s.slice(m.index).replace(/^[,\s]+/, '').trim() };
  }
  return { main: s.trim(), sec: '' };
}
function cutLoc(s) {
  // 从右找 in / within / at / Between
  const m = s.match(/[\s,]+(?:in|within|at|Between)\s+([\s\S]+)$/i);
  if (!m || m.index < 3) return { obj: s.trim(), loc: '' };
  return { obj: s.slice(0, m.index).replace(/[,\s]+$/, '').trim(), loc: m[1].trim() };
}

let CUR_ALLOW = [];

// 受让人是「Province of X」「City of Y」这类行政区划时，按目标语的区划词渲染
function granteeText(g, i) {
  // 受让人本身可能是完整地名链（Municipality of Buhi, Province of Camarines Sur），
  // 但必须是「区划词 + of」开头——「Island Transport Company」不是地名
  if (!/^(?:Province|City|Municipality|Subprovince|Barangay|Barrio|Island)\s+of\s/i.test(g)) return g;
  const L = locParse(g);
  if (L && L[0] && L[0].type !== 'Country') {
    const t = locRender(L, i);
    if (t) return t;
  }
  return g;
}
// 泰文里介词/动词后直接接泰文词不加空格
const sp = (i, head, name) => (i === 1 && /^[\u0E00-\u0E7F]/.test(name) ? head + name : head + ' ' + name);

// 「and to Sell Ice [and Supply Cold Storage] [Therein | in Said X | in <地点>]」
function secParse(raw) {
  let x = ENT(raw).replace(/^[,\s]+/, '').replace(/\s+Therein\b/gi, '').trim();
  let loc = null;
  const sm = x.match(/[\s,]+(?:in|within|at)\s+([\s\S]+)$/i);
  if (sm && sm.index > 5) {
    const lraw = sm[1].trim();
    if (!/^(?:the\s+)?Said\b/i.test(lraw)) {
      loc = locParse(lraw);
      if (!loc) return null;
    }
    x = x.slice(0, sm.index);
  }
  const S2 = secLook(x);
  if (!S2) return null;
  return { txt: S2, loc };
}

// 授予对象：特许经营权 / 临时许可，两族共用同一套地点与宾语词表，只换这段措辞
const GRANT = {
  franchise: ['cấp đặc quyền cho', 'ให้สัมปทานแก่', 'memberikan konsesi kepada', 'memberikan konsesi kepada'],
  permit: ['cấp giấy phép tạm thời cho', 'ให้ใบอนุญาตชั่วคราวแก่', 'memberikan izin sementara kepada', 'memberikan permit sementara kepada'],
};

function buildGrant(grantee, body, mode) {
  mode = mode || 'franchise';
  const g = cleanName(grantee);
  if (!goodName(g)) return null;
  const { main, sec } = cutSecondary(body);
  const { vs, rest: after } = eatVerbs(main);
  if (!vs.length) return null;
  if (vs.some((v) => !VERB[v])) return null;
  let { obj, loc } = cutLoc(after);
  loc = loc.replace(/,?\s*(?:and\s+)?for\s+Other\s+Purposes?[\s\S]*$/i, '').replace(/,?\s*and\s+for\s+the\s+Purpose\s+of[\s\S]*$/i, '').replace(/,?\s*for\s+a\s+Period\s+of[\s\S]*$/i, '').trim();
  const O = objLook(obj) || (mode === 'permit' ? TPD.render(obj) : null);
  const DBG = process.env.FRDBG ? (m) => console.error('  [' + m + '] ' + String(obj).slice(0, 60) + ' || ' + String(loc).slice(0, 60) + ' || ' + String(sec).slice(0, 60)) : () => {};
  if (!O) { DBG('noobj'); return null; }
  const L = loc ? locParse(loc) : null;
  if (loc && !L) { DBG('noloc'); return null; }
  let S = null;
  if (sec) {
    S = secParse(sec);
    if (!S) { DBG('nosec'); return null; }
  }
  const out = [];
  const G = [0, 1, 2, 3].map((i) => granteeText(g, i));
  for (let i = 0; i < 4; i++) {
    let s;
    if (i === 0) s = `${H[0]} ${GRANT[mode][0]} ${G[0]} để ${joinVerbs(vs, 0)} ${O[0]}${locPhrase(L, 0)}`;
    else if (i === 1) s = `${H[1]}` + sp(1, GRANT[mode][1], G[1]) + ` ในการ${joinVerbs(vs, 1)}${O[1]}${locPhrase(L, 1)}`;
    else if (i === 2) s = `${H[2]} ${GRANT[mode][2]} ${G[2]} untuk ${joinVerbs(vs, 2)} ${O[2]}${locPhrase(L, 2)}`;
    else s = `${H[3]} ${GRANT[mode][3]} ${G[3]} untuk ${joinVerbs(vs, 3)} ${O[3]}${locPhrase(L, 3)}`;
    if (S) s += (i === 1 ? ' ' : ', ') + S.txt[i] + locPhrase(S.loc, i);
    out.push(LX.thFix(s));
  }
  CUR_ALLOW.push(g);
  return out;
}

const ONES = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function words2num(s) {
  let total = 0, cur = 0;
  const ws = String(s).toLowerCase().replace(/[-,]/g, ' ').split(/\s+/).filter(Boolean);
  for (const w of ws) {
    if (w in ONES) cur += ONES[w];
    else if (w === 'hundred') cur = (cur || 1) * 100;
    else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; }
    else if (/^\d+$/.test(w)) cur += Number(w);
  }
  return total + cur;
}
function numOf(s) {
  const m = /\(\s*([\d][\d,]*)\s*\)/.exec(String(s));
  if (m) return m[1].replace(/,/g, '');
  const w = words2num(String(s).replace(/\b(?:years?|another|a|an)\b/gi, ' '));
  return w ? String(w) : null;
}
// 名称在第一个从句边界处截断
const NAMEBOUND = /\s*(?:,\s*)?(?:(?:Under|Doing\s+Business|Formerly|Presently|Previously|Heretofore|Now\s+(?:Known|Presently)|Presently\s+Held|Successor|Her\s+Successor|Entitled|Amending|Assigning|Regulating)\b|(?:for|to)\s+(?:a\s+Period\s+of\s+)?[Aa]nother\b|(?:for|to)\s+(?:a|an)\s+(?:Electric|Water|Ferry|Ice|Radio|Television|Telephone|Distribution|Transport|Broadcast|Cable|Gas|Power|Communications|Messenger|Monorail|Air)\b|to\s+(?:Establish|Construct|Operate|Install|Maintain|Provide|Sell|Hold|Conduct)\b|That\s+Shall|from\s+the\s+Date|and\s+Later\b|but\s+Subsequently|By\s+Amending|and\s+for\s+Other\s+Purposes|\()/i;
function cutNameTail(s) {
  const x = ENT(s);
  const m = x.match(NAMEBOUND);
  let nm = m && m.index > 2 ? x.slice(0, m.index) : x;
  return nm.replace(/[,\s]+$/, '').replace(/^the\s+/i, '').trim();
}
const RA_RE = /\bUnder\s+(?:the\s+)?(?:Republic\s+)?Act\s*(?:No\.?|Number(?:ed)?)?\s*([\d][\d,]*)/i;

// 续展：Renewing [and amending] the Franchise Granted to X [Under RA No. 8623] [for/to another N Years], …
function buildRenew(body) {
  // 词序两种：Renewing for Another N Years the Franchise Granted to X / Renewing the Franchise Granted to X … to Another N Years
  const lead = body.match(/^(?:for|to)\s+[Aa]nother\s+([\s\S]+?)\s*Years?,?\s+(?=the\b)/i);
  const b = body.replace(/^for\s+[Aa]nother\s+[\s\S]+?\s*(?:\(\s*[\d,]+\s*\))?\s*Years?,?\s+/i, '').replace(/^and\s+amending\s+/i, '');
  const m = b.match(/^the\s+Franchises?\s+Granted\s+[Tt]o\s+([\s\S]+)$/i);
  if (!m) return null;
  const tail = m[1];
  // 年数可能在名称之后，也可能在名称之前
  let N = lead ? numOf(lead[1]) : null;
  if (!N) {
    const nm = tail.match(/[Aa]nother\s+([A-Za-z\-\s]+?)\s*(?:\(\s*[\d,]+\s*\))?\s*Years?/);
    if (nm) N = numOf(nm[0]);
  }
  if (!N) {
    const nm2 = tail.match(/[Aa]nother\s*\(\s*([\d,]+)\s*\)\s*Years?/i);
    if (nm2) N = nm2[1].replace(/,/g, '');
  }
  const raM = tail.match(RA_RE);
  const ra = raM ? raM[1].replace(/,/g, '') : null;
  const g = cutNameTail(tail);
  if (!goodName(g)) return null;
  const out = [];
  for (let i = 0; i < 4; i++) {
    let s;
    if (i === 0) s = `${H[0]} gia hạn` + (N ? ` thêm ${N} năm` : '') + ` đặc quyền đã cấp cho ${g}` + (ra ? ` theo Đạo luật Cộng hòa số ${ra}` : '');
    else if (i === 1) s = `${H[1]}ต่ออายุสัมปทานที่ให้แก่ ${g}` + (ra ? ` ตามพระราชบัญญัติแห่งสาธารณรัฐหมายเลข ${ra}` : '') + (N ? ` อีก ${N} ปี` : '');
    else if (i === 2) s = `${H[2]} memperpanjang` + (N ? ` selama ${N} tahun lagi` : '') + ` konsesi yang diberikan kepada ${g}` + (ra ? ` berdasarkan Undang-Undang Republik Nomor ${ra}` : '');
    else s = `${H[3]} melanjutkan` + (N ? ` selama ${N} tahun lagi` : '') + ` konsesi yang diberikan kepada ${g}` + (ra ? ` di bawah Akta Republik No. ${ra}` : '');
    out.push(LX.thFix(s));
  }
  CUR_ALLOW.push(g);
  return out;
}

// 展期：Extending the [Term of the] [<标的>] Franchise of X for Another Fifty Years
function buildExtend(body) {
  let b = ENT(body)
    .replace(/^[Ff]urther\s+/, '')
    .replace(/^[Aa]mending\s+and\s+/, '')
    .replace(/^[Ee]xtending\s+and\s+/, '')
    .replace(/^[Ee]xtending\s+/, '');
  // 「Extending for Another N Years the Franchise Granted to X」——年数前置
  const lead = b.match(/^for\s+(?:a\s+Period\s+of\s+)?(?:[Aa]nother\s+)?([\s\S]+?)\s*Years?,?\s+(?=(?:the|its)\b)/i);
  if (lead) b = b.slice(lead[0].length);
  const lead2 = b.match(/^to\s+[Aa]nother\s+([\s\S]+?)\s*Years?,?\s+(?=the\b)/i);
  b = b.replace(/^Under\s+Certain\s+Conditions\s+/i, '').replace(/^to\s+[Aa]nother\s+[\s\S]+?\s*Years?,?\s+(?=the\b)/i, '');
  // 年数（可能完全不出现）
  let N = lead ? numOf(lead[1]) : lead2 ? numOf(lead2[1]) : null;
  if (!N) {
    const ny = b.match(/(?:for|to)\s+(?:a\s+Period\s+of\s+)?(?:[Aa]nother\s+)?([A-Za-z0-9\-\s,()]+?)\s*Years?\b/i);
    if (ny) N = numOf(ny[1]);
  }
  const m = b.match(/^(?:the\s+)?(?:Term\s+of\s+the\s+)?(?:Duration\s+of\s+the\s+)?(?:([\s\S]+?)\s+)?Franchises?\s+(?:of|Granted\s+[Tt]o|Assigned\s+[Tt]o)\s+(?:the\s+)?([\s\S]+)$/i);
  if (!m) return null;
  const objRaw = m[1] || null;
  const g = cutNameTail(m[2]);
  if (!goodName(g)) return null;
  const O = objRaw ? objLook(objRaw) : null;
  if (objRaw && !O) return null;
  const out = [];
  for (let i = 0; i < 4; i++) {
    const nTxt = N ? N : '';
    let s;
    if (i === 0) s = `${H[0]} gia hạn` + (N ? ` thêm ${N} năm` : '') + ` đặc quyền` + (O ? ` ${O[0]}` : '') + ` của ${g}`;
    else if (i === 1) s = `${H[1]}ขยาย` + (O ? `${O[1]}` : '') + `สัมปทานของ ${g}` + (N ? ` ออกไปอีก ${N} ปี` : '');
    else if (i === 2) s = `${H[2]} memperpanjang konsesi` + (O ? ` ${O[2]}` : '') + ` milik ${g}` + (N ? ` selama ${N} tahun lagi` : '');
    else s = `${H[3]} melanjutkan konsesi` + (O ? ` ${O[3]}` : '') + ` milik ${g}` + (N ? ` selama ${N} tahun lagi` : '');
    out.push(LX.thFix(s));
  }
  CUR_ALLOW.push(g);
  return out;
}

function parse(title) {
  CUR_ALLOW = [];
  let s = ENT(title).replace(/^(?:In|N|Fan|And)\s+Act\b/i, 'An Act');
  const lead = s.match(/^(?:An?\s+)?Act\s+(?:No\.?\s*\d+\s*)?/i);
  if (!lead) return { why: 'noact' };
  let body = s.slice(lead[0].length).trim();
  if (!/^(?:Further\s+)?(?:Granting|Graniting|to\s+Grant|Renewing|Extending|[Aa]mending\s+and\s+(?:extending|renewing))\b/i.test(body)) return { why: 'noframe' };
  // 统一时态与拼写：to Grant → Granting，Graniting → Granting，amending and extending → Extending
  body = body
    .replace(/^to\s+Grant\b/i, 'Granting')
    .replace(/^Graniting\b/i, 'Granting')
    .replace(/^(?:[Aa]mending\s+and|and)\s+(?:extending|Extending)\b/i, 'Extending')
    .replace(/^Further\s+(?=Extending|Renewing)/i, '')
    .replace(/\sA"\s+/g, ' a ');
  let out = null, frame = null;
  let m;
  if ((m = body.match(/^Granting\s+(?:to\s+)?([\s\S]+?)\s+a?\s*Franchise\s+(?:to\s+|for\s+|of\s+)?([\s\S]+)$/i))) {
    out = buildGrant(m[1], m[2]); frame = 'grant';
    if (!out && /franchise\s+for\s+/i.test(body)) {
      // 「a Franchise for an Electric Light…System in <地点>」：for 后无动词
      const m2 = body.match(/^Granting\s+(?:to\s+)?([\s\S]+?)\s+a?\s*Franchise\s+for\s+([\s\S]+)$/i);
      if (m2) {
        const { obj, loc } = cutLoc(m2[2]);
        const O = objLook(obj);
        const L = loc ? locParse(loc) : null;
        if (O && (!loc || L)) {
          const g = cleanName(m2[1]);
          if (!goodName(g)) return null;
          const G = [0, 1, 2, 3].map((i) => granteeText(g, i));
          out = [];
          for (let i = 0; i < 4; i++) {
            let t;
            if (i === 0) t = `${H[0]} cấp đặc quyền cho ${G[0]} đối với ${O[0]}${locPhrase(L, 0)}`;
            else if (i === 1) t = `${H[1]}` + sp(1, 'ให้สัมปทานแก่', G[1]) + ` สำหรับ${O[1]}${locPhrase(L, 1)}`;
            else if (i === 2) t = `${H[2]} memberikan konsesi kepada ${G[2]} untuk ${O[2]}${locPhrase(L, 2)}`;
            else t = `${H[3]} memberikan konsesi kepada ${G[3]} untuk ${O[3]}${locPhrase(L, 3)}`;
            out.push(LX.thFix(t));
          }
          CUR_ALLOW.push(g);
          frame = 'grant-for';
        }
      }
    }
  } else if ((m = body.match(/^Granting\s+(?:to\s+)?([\s\S]+?)\s+(?:the\s+|a\s+|an\s+)?Temporary\s+Permits?\s+(?:to\s+|for\s+)([\s\S]+)$/i))) {
    // OCR 把 a 认成 A"（Incorporated A" Temporary Permit）
    const body2 = m[2]
      .replace(/^the\s+/i, '')
      .replace(/,?\s*(?:and\s+)?for\s+Other\s+Purposes?[.,\s]*$/i, '')
      .replace(/,\s*(?:and\s+)?Together\s+with\s+Such\s+Other[\s\S]*$/i, '')
      .replace(/[,\s]+$/, '')
      .trim();
    out = buildGrant(m[1], body2, 'permit'); frame = 'permit';
  } else if (/^Renewing\b/i.test(body)) {
    out = buildRenew(body.replace(/^Renewing\s+/i, '')); frame = 'renew';
  } else if (/^Extending\b/i.test(body)) {
    out = buildExtend(body.replace(/^Extending\s+/i, '')); frame = 'extend';
  }
  if (!out) return { why: 'slot-' + (frame || 'x') };
  if (process.env.FRNOGATE) return { frame, out: { vi: out[0], th: out[1], id: out[2], ms: out[3] } };
  const bad = gate({ vi: out[0], th: out[1], id: out[2], ms: out[3] }, CUR_ALLOW);
  if (bad) return { why: 'gate:' + bad };
  return { frame, out: { vi: out[0], th: out[1], id: out[2], ms: out[3] } };
}

function main() {
  const argv = process.argv.slice(2);
  const outIdx = argv.indexOf('--out');
  const outPath = outIdx >= 0 ? argv[outIdx + 1] : null;
  const show = argv.includes('--show');
  const fi = argv.indexOf('--frame');
  const frameOnly = fi >= 0 ? argv[fi + 1] : null;
  const list = require('./_ph_franchise.json').concat(require('./_ph_tp.json'));
  const items = {}, stat = {}, pushed = [];
  for (const x of list) {
    const r = parse(x.title.en || '');
    if (r.out && (!frameOnly || r.frame === frameOnly)) {
      items[x.id] = r.out;
      stat['ok:' + r.frame] = (stat['ok:' + r.frame] || 0) + 1;
      pushed.push({ id: x.id, en: x.title.en, out: r.out });
    } else stat[r.why] = (stat[r.why] || 0) + 1;
  }
  console.log('候选', list.length, '| 产出', Object.keys(items).length);
  Object.entries(stat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k.padEnd(26), v));
  if (show) pushed.slice(0, Number(show === true ? 5 : show)).forEach((p) => {
    console.log('\n· ' + p.en);
    for (const L of LANGS) console.log('   ' + L + ': ' + p.out[L]);
  });
  if (outPath) {
    fs.writeFileSync(path.join(__dirname, outPath), JSON.stringify({ items }, null, 1), 'utf8');
    console.log('写出', outPath);
  }
}
if (require.main === module) main();
module.exports = { parse, objLook, objNorm, locParse, locRender, cutLoc, cutSecondary, eatVerbs, singularize, pluralKey, SEC, secLook };
