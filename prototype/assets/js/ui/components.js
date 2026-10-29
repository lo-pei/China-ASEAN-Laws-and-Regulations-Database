/* ==========================================================================
   CALR · ui/components.js —— 共享 UI 构件（含纯 SVG 国旗，保证离线可渲染）
   ========================================================================== */
(function (root) {
  'use strict';
  var CALR = root.CALR = root.CALR || {};
  var U = function () { return CALR.util; };
  var S = function () { return CALR.store; };
  var esc = function (s) { return CALR.util.esc(s); };
  var tr = function (f) { return CALR.i18n.field(f); };

  /* ---------------- 国旗（简化 SVG，40×27 视口） ---------------- */
  function starPoints(cx, cy, r, inner, n, rot) {
    n = n || 5; inner = inner || r * 0.382; rot = rot === undefined ? -90 : rot;
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var rr = i % 2 ? inner : r;
      var a = (Math.PI / n) * i + (rot * Math.PI) / 180;
      pts.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
    }
    return pts.join(' ');
  }

  var FLAGS = {
    CN: '<rect width="60" height="40" fill="#DE2910"/><polygon points="' + starPoints(10, 10, 6) + '" fill="#FFDE00"/>' +
        '<polygon points="' + starPoints(20, 4, 2) + '" fill="#FFDE00"/><polygon points="' + starPoints(24, 9, 2) + '" fill="#FFDE00"/>' +
        '<polygon points="' + starPoints(24, 15, 2) + '" fill="#FFDE00"/><polygon points="' + starPoints(20, 20, 2) + '" fill="#FFDE00"/>',
    VN: '<rect width="60" height="40" fill="#DA251D"/><polygon points="' + starPoints(30, 20, 11) + '" fill="#FFFF00"/>',
    TH: '<rect width="60" height="40" fill="#A51931"/><rect y="6.67" width="60" height="6.66" fill="#F4F5F8"/><rect y="13.33" width="60" height="13.34" fill="#2D2A4A"/><rect y="26.67" width="60" height="6.66" fill="#F4F5F8"/><rect y="33.33" width="60" height="6.67" fill="#A51931"/>',
    ID: '<rect width="60" height="20" fill="#FF0000"/><rect y="20" width="60" height="20" fill="#FFFFFF"/>',
    MY: (function () {
      var s = '<rect width="60" height="40" fill="#FFFFFF"/>';
      for (var i = 0; i < 14; i++) s += '<rect y="' + (i * 40 / 14).toFixed(2) + '" width="60" height="' + (40 / 14).toFixed(2) + '" fill="' + (i % 2 ? '#FFFFFF' : '#CC0001') + '"/>';
      s += '<rect width="30" height="21.4" fill="#010066"/>' +
           '<circle cx="11" cy="10.7" r="5" fill="#FFCC00"/><circle cx="13" cy="10.7" r="4.2" fill="#010066"/>' +
           '<polygon points="' + starPoints(19, 10.7, 4.2, 1.9, 14) + '" fill="#FFCC00"/>';
      return s;
    })(),
    SG: '<rect width="60" height="20" fill="#EF3340"/><rect y="20" width="60" height="20" fill="#FFFFFF"/>' +
        '<circle cx="13" cy="10" r="6" fill="#FFFFFF"/><circle cx="16.5" cy="10" r="5.2" fill="#EF3340"/>' +
        '<polygon points="' + starPoints(22, 5.5, 2) + '" fill="#FFFFFF"/><polygon points="' + starPoints(27, 8.5, 2) + '" fill="#FFFFFF"/>' +
        '<polygon points="' + starPoints(25, 14, 2) + '" fill="#FFFFFF"/><polygon points="' + starPoints(20, 14, 2) + '" fill="#FFFFFF"/>' +
        '<polygon points="' + starPoints(18, 8.5, 2) + '" fill="#FFFFFF"/>',
    PH: '<rect width="60" height="20" fill="#0038A8"/><rect y="20" width="60" height="20" fill="#CE1126"/>' +
        '<polygon points="0,0 26,20 0,40" fill="#FFFFFF"/><circle cx="8" cy="20" r="3.4" fill="#FCD116"/>' +
        '<polygon points="' + starPoints(12, 9, 2) + '" fill="#FCD116"/><polygon points="' + starPoints(12, 31, 2) + '" fill="#FCD116"/>',
    BN: '<rect width="60" height="40" fill="#F7E017"/>' +
        '<polygon points="0,26 60,6 60,16 0,36" fill="#FFFFFF"/><polygon points="0,30 60,10 60,16 0,36" fill="#231F20"/>' +
        '<circle cx="30" cy="20" r="7.5" fill="#CF1126"/><circle cx="30" cy="20" r="5" fill="#F7E017"/>',
    KH: '<rect width="60" height="40" fill="#032EA1"/><rect y="10" width="60" height="20" fill="#E00025"/>' +
        '<rect x="14" y="12" width="32" height="12" fill="#FFFFFF"/><rect x="20" y="5" width="4" height="9" fill="#FFFFFF"/>' +
        '<rect x="27" y="5" width="6" height="9" fill="#FFFFFF"/><rect x="36" y="5" width="4" height="9" fill="#FFFFFF"/>',
    LA: '<rect width="60" height="40" fill="#CE1126"/><rect y="10" width="60" height="20" fill="#002868"/><circle cx="30" cy="20" r="8" fill="#FFFFFF"/>',
    MM: '<rect width="60" height="13.33" fill="#FECB00"/><rect y="13.33" width="60" height="13.34" fill="#34B233"/><rect y="26.67" width="60" height="13.33" fill="#EA2839"/>' +
        '<polygon points="' + starPoints(30, 20, 9) + '" fill="#FFFFFF"/>',
    TL: '<rect width="60" height="40" fill="#DC241F"/><polygon points="0,0 26,20 0,40" fill="#FFC726"/>' +
        '<polygon points="' + starPoints(9, 20, 5) + '" fill="#FFFFFF"/>'
  };

  function flagSvg(code, cls) {
    var inner = FLAGS[code] || '<rect width="60" height="40" fill="#CBD5E0"/>';
    return '<svg class="' + (cls === undefined ? 'country-card__flag' : cls) + '" viewBox="0 0 60 40" role="img" aria-label="' +
      esc(S().countryName(code)) + '" preserveAspectRatio="none">' + inner + '</svg>';
  }

  /* ---------------- 标签 ---------------- */
  function statusTag(status, extra) {
    var name = S().statusName(status);
    var icon = { active: CALR.ui.icon('check'), amended: CALR.ui.icon('copy'), repealed: CALR.ui.icon('close'), pending: '⏳' }[status] || '●';
    var out = '<span class="status status--' + esc(status) + '"><span class="status__dot"></span>' + esc(name) + '</span>';
    if (extra) out += ' <span class="mini muted">' + esc(extra) + '</span>';
    return out;
  }
  function levelTag(level) {
    return '<span class="level level--' + esc(level) + '">' + esc(S().levelName(level)) + '</span>';
  }
  function sysTag(country) {
    var TT = function (k) { return CALR.i18n.t(k); };
    var label = { civil: '大陆法系', common: '普通法系', mixed: '混合法系' }[country.legalSystem] || country.legalSystem;
    var out = '<span class="sys-tag sys-tag--' + esc(country.legalSystem) + '">' + esc(TT(label)) + '</span>';
    (country.legalSystemTags || []).slice(0, 2).forEach(function (t) {
      if (t && t !== label) out += ' <span class="sys-tag">' + esc(TT(t)) + '</span>';
    });
    return out;
  }
  function topicTags(law, max) {
    return (law.topics || []).filter(function (t) { return t !== 'general'; }).slice(0, max || 3).map(function (t) {
      return '<a class="tag tag--blue tag--clickable" href="#/search?topic=' + esc(t) + '">' + esc(S().topicName(t)) + '</a>';
    }).join(' ');
  }

  /* ---------------- 骨架 ---------------- */
  function breadcrumb(items) {
    return '<nav class="breadcrumb" aria-label="面包屑">' + items.map(function (it, i) {
      var last = i === items.length - 1;
      var node = last || !it.href ? '<span>' + esc(it.text) + '</span>' : '<a href="' + esc(it.href) + '">' + esc(it.text) + '</a>';
      return (i ? '<span class="breadcrumb__sep">›</span>' : '') + node;
    }).join('') + '</nav>';
  }

  function section(title, moreHtml) {
    return '<div class="section__head"><h2 class="section__title">' + esc(title) + '</h2>' +
      (moreHtml ? '<div class="section__more">' + moreHtml + '</div>' : '') + '</div>';
  }

  function emptyState(icon, title, desc, action) {
    return '<div class="empty"><div class="empty__icon">' + icon + '</div><div class="empty__title">' + esc(title) + '</div>' +
      (desc ? '<p class="small">' + desc + '</p>' : '') + (action || '') + '</div>';
  }

  function skeletonList(n) {
    var out = '';
    for (var i = 0; i < (n || 3); i++) {
      out += '<div class="card card--pad" style="margin-bottom:12px">' +
        '<div class="skeleton skeleton--line" style="width:45%;height:18px"></div>' +
        '<div class="skeleton skeleton--line" style="width:75%"></div>' +
        '<div class="skeleton skeleton--line" style="width:60%"></div></div>';
    }
    return out;
  }

  function scoreBar(score, max) {
    var pct = Math.max(6, Math.min(100, Math.round((score / (max || 60)) * 100)));
    return '<span class="score-bar"><span class="score-bar__track"><span class="score-bar__fill" style="width:' + pct + '%"></span></span>' +
      '相关度 ' + Math.round(score) + '</span>';
  }


  /* ---------------- 各国官方门户中英对照 ---------------- */
  var PORTAL_LABELS = {
    'https://vbpl.vn': { zh: '越南法律数据库（VBPL）', en: 'VBPL — Vietnam Legal Database' },
    'https://ratchakitcha.soc.go.th': { zh: '泰国政府公报（Royal Gazette）', en: 'Royal Gazette of Thailand' },
    'https://www.krisd.go.th': { zh: '泰国法律信息门户（KRISD）', en: 'KRISD — Thailand Law Information Portal' },
    'https://peraturan.go.id': { zh: '印度尼西亚法律法规信息网络（JDIHN）', en: 'JDIHN — Indonesian Legal Information Network' },
    'https://www.agc.gov.my': { zh: '马来西亚总检察署法律在线（AGC）', en: 'AGC Malaysia — Laws of Malaysia' },
    'https://sso.agc.gov.sg': { zh: '新加坡法规在线（SSO）', en: 'Singapore Statutes Online' },
    'https://lawphil.net': { zh: '菲律宾法律信息库（LawPhil）', en: 'LawPhil — Philippine Laws and Jurisprudence' },
    'https://www.officialgazette.gov.ph': { zh: '菲律宾官方公报', en: 'Official Gazette of the Philippines' },
    'https://www.agc.gov.bn': { zh: '文莱总检察署法规库', en: 'AGC Brunei — Laws of Brunei Darussalam' },
    'https://www.moc.gov.kh': { zh: '柬埔寨商务部法律与法规门户', en: 'Cambodia Ministry of Commerce — Laws & Regulations' },
    'https://www.laogazette.gov.la': { zh: '老挝政府公报', en: 'Lao Official Gazette' },
    'https://www.moj.gov.mm': { zh: '缅甸司法部', en: 'Myanmar Ministry of Justice' },
    'https://www.mj.gov.tl': { zh: '东帝汶司法部', en: 'Ministério da Justiça, Timor-Leste' },
    'https://flk.npc.gov.cn': { zh: '国家法律法规数据库', en: 'National Laws and Regulations Database' },
    'https://flk.npc.gov.cn/': { zh: '国家法律法规数据库', en: 'National Laws and Regulations Database' },
    'https://cicc.court.gov.cn': { zh: '最高人民法院国际商事法庭', en: 'China International Commercial Court' }
  };

  /* ---------------- 制定机关 / 数据来源的本地化 ----------------
     数据层很多字段只有中文（如「泰国国会」「印度尼西亚法律数据库…」）。
     界面切到非中文时不能把中文原样塞进英文/越南文/泰文页面：
     常见值走对照表，其余按规则回退英文，绝不在非中文界面回退中文。 */
  var COUNTRY_EN = {
    '中国': 'China', '越南': 'Vietnam', '泰国': 'Thailand', '印度尼西亚': 'Indonesia',
    '马来西亚': 'Malaysia', '新加坡': 'Singapore', '菲律宾': 'the Philippines',
    '文莱': 'Brunei', '柬埔寨': 'Cambodia', '老挝': 'Laos', '缅甸': 'Myanmar', '东帝汶': 'Timor-Leste'
  };
  var ISSUER_LABELS = {
    '泰国国会': { en: 'National Assembly of Thailand', vi: 'Quốc hội Thái Lan', th: 'รัฐสภาแห่งประเทศไทย', id: 'Majelis Nasional Thailand', ms: 'Parlimen Thailand' },
    '马来西亚国会（Dewan Rakyat）': { en: 'Parliament of Malaysia (Dewan Rakyat)', vi: 'Nghị viện Malaysia (Dewan Rakyat)', th: 'รัฐสภามาเลเซีย (เดวันรักยัต)', id: 'Parlemen Malaysia (Dewan Rakyat)', ms: 'Parlimen Malaysia (Dewan Rakyat)' },
    '马来西亚国会': { en: 'Parliament of Malaysia', vi: 'Nghị viện Malaysia', th: 'รัฐสภามาเลเซีย', id: 'Parlemen Malaysia', ms: 'Parlimen Malaysia' },
    '泰国国务委员会办公室（OCS）': { en: 'Office of the Council of State (Thailand)', vi: 'Văn phòng Hội đồng Nhà nước (Thái Lan)', th: 'สำนักงานคณะกรรมการกฤษฎีกา', id: 'Kantor Dewan Negara (Thailand)', ms: 'Pejabat Majlis Negara (Thailand)' },
    '国会': { en: 'National Assembly', vi: 'Quốc hội', th: 'รัฐสภา', id: 'Majelis Nasional', ms: 'Parlimen' },
    '东帝汶国民议会': { en: 'National Parliament of Timor-Leste', vi: 'Quốc hội Timor-Leste', th: 'รัฐสภาแห่งติมอร์-เลสเต', id: 'Parlemen Nasional Timor-Leste', ms: 'Parlimen Nasional Timor-Leste' },
    '老挝国会': { en: 'National Assembly of Laos', vi: 'Quốc hội Lào', th: 'รัฐสภาลาว', id: 'Majelis Nasional Laos', ms: 'Parlimen Laos' },
    '越南国会（Quốc hội）': { en: 'National Assembly of Vietnam (Quốc hội)', vi: 'Quốc hội Việt Nam', th: 'รัฐสภาเวียดนาม', id: 'Majelis Nasional Vietnam', ms: 'Parlimen Vietnam' },
    '菲律宾国会': { en: 'Congress of the Philippines', vi: 'Quốc hội Philippines', th: 'รัฐสภาฟิลิปปินส์', id: 'Kongres Filipina', ms: 'Kongres Filipina' },
    '缅甸保险业务监管局（IBRD）': { en: 'Insurance Business Regulatory Board (Myanmar)', vi: 'Cục Quản lý Kinh doanh Bảo hiểm (Myanmar)', th: 'คณะกรรมการกำกับธุรกิจประกันภัย (เมียนมา)', id: 'Dewan Pengawas Usaha Asuransi (Myanmar)', ms: 'Lembaga Pengawal Perniagaan Insurans (Myanmar)' },
    '泰国数字经济与社会部 ETDA 发布；PDPC 为主管机关': { en: 'Ministry of Digital Economy and Society (Thailand) — published by ETDA; PDPC is the competent authority', vi: 'Bộ Kinh tế số và Xã hội Thái Lan — ETDA công bố; PDPC là cơ quan có thẩm quyền', th: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม (ETDA เผยแพร่; PDPC เป็นหน่วยงานกำกับ)', id: 'Kementerian Ekonomi Digital dan Masyarakat Thailand — diterbitkan ETDA; PDPC adalah otoritas berwenang', ms: 'Kementerian Ekonomi Digital dan Masyarakat Thailand — diterbitkan ETDA; PDPC ialah pihak berkuasa' },
    '见 official_source_url 所属机构': { en: 'Issuing body referenced in official_source_url' },
    'king__of_the_kingdom_of_cambodia': { en: 'King of the Kingdom of Cambodia' },
    'national_assembly': { en: 'National Assembly' },
    'office_of_the_prime_minister': { en: 'Office of the Prime Minister' },
    'royal_government_of_cambodia': { en: 'Royal Government of Cambodia' },
    'council_of_ministers': { en: 'Council of Ministers' },
    'royal_palace': { en: 'Royal Palace' },
    'Ministry / Government': { en: 'Ministry / Government' },
    'Implementing agency': { en: 'Implementing agency' },
    'Constitutional Convention / Commission': { en: 'Constitutional Convention / Commission' }
  };
  var SOURCE_LABELS = {
    '印度尼西亚法律数据库（AsianLII / WorldLII 与部委官方 PDF）': {
      en: 'Indonesian legal databases (AsianLII / WorldLII and official ministry PDFs)',
      vi: 'Cơ sở dữ liệu pháp luật Indonesia (AsianLII / WorldLII và PDF chính thức của các bộ)',
      th: 'ฐานข้อมูลกฎหมายอินโดนีเซีย (AsianLII / WorldLII และ PDF ราชการของกระทรวง)',
      id: 'Basis data hukum Indonesia (AsianLII / WorldLII dan PDF resmi kementerian)',
      ms: 'Pangkalan data undang-undang Indonesia (AsianLII / WorldLII dan PDF rasmi kementerian)'
    },
    '泰国数字经济与社会部 ETDA 发布；PDPC 为主管机关': {
      en: 'Ministry of Digital Economy and Society (Thailand) — published by ETDA; PDPC is the competent authority',
      vi: 'Bộ Kinh tế số và Xã hội Thái Lan — ETDA công bố; PDPC là cơ quan có thẩm quyền',
      th: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม (ETDA เผยแพร่; PDPC เป็นหน่วยงานกำกับ)',
      id: 'Kementerian Ekonomi Digital dan Masyarakat Thailand — diterbitkan ETDA; PDPC adalah otoritas berwenang',
      ms: 'Kementerian Ekonomi Digital dan Masyarakat Thailand — diterbitkan ETDA; PDPC ialah pihak berkuasa'
    },
    '泰国国务委员会办公室（Office of the Council of State, สำนักงานคณะกรรมการกฤษฎีกา）法律检索系统': {
      en: 'Office of the Council of State of Thailand — legal search system',
      vi: 'Văn phòng Hội đồng Nhà nước Thái Lan — hệ thống tra cứu pháp luật',
      th: 'สำนักงานคณะกรรมการกฤษฎีกา — ระบบค้นหากฎหมาย',
      id: 'Kantor Dewan Negara Thailand — sistem pencarian hukum',
      ms: 'Pejabat Majlis Negara Thailand — sistem carian undang-undang'
    },
    '泰国法律数据库（law.go.th）': { en: 'Thailand Law Database (law.go.th)', vi: 'Cơ sở dữ liệu pháp luật Thái Lan (law.go.th)', th: 'ฐานข้อมูลกฎหมายไทย (law.go.th)', id: 'Basis Data Hukum Thailand (law.go.th)', ms: 'Pangkalan Data Undang-undang Thailand (law.go.th)' },
    '泰国法律数据库（law.go.th）皇家公报原文': { en: 'Thailand Law Database (law.go.th) — Royal Gazette original', vi: 'Cơ sở dữ liệu pháp luật Thái Lan (law.go.th) — bản Công báo Hoàng gia', th: 'ฐานข้อมูลกฎหมายไทย (law.go.th) — ต้นฉบับราชกิจจานุเบกษา', id: 'Basis Data Hukum Thailand (law.go.th) — naskah asli Berita Negara', ms: 'Pangkalan Data Undang-undang Thailand (law.go.th) — teks asal Warta Kerajaan' },
    '越南法律数据库（vbpl.vn 官方公报文本）': { en: 'Vietnam Legal Database (VBPL, official gazette texts)', vi: 'Cơ sở dữ liệu pháp luật Việt Nam (VBPL, văn bản công báo)', th: 'ฐานข้อมูลกฎหมายเวียดนาม (VBPL, ข้อความราชกิจจานุเบกษา)', id: 'Basis Data Hukum Vietnam (VBPL, teks lembaran resmi)', ms: 'Pangkalan Data Undang-undang Vietnam (VBPL, teks warta rasmi)' },
    '越南政府公报（congbao.chinhphu.vn）': { en: 'Vietnam Government Gazette (congbao.chinhphu.vn)', vi: 'Công báo Chính phủ Việt Nam (congbao.chinhphu.vn)', th: 'ราชกิจจานุเบกษารัฐบาลเวียดนาม (congbao.chinhphu.vn)', id: 'Lembaran Resmi Pemerintah Vietnam (congbao.chinhphu.vn)', ms: 'Warta Kerajaan Vietnam (congbao.chinhphu.vn)' },
    '东帝汶政府公报《Jornal da República》（Série I，司法部 mj.gov.tl/jornal）': { en: 'Timor-Leste Official Gazette “Jornal da República” (Série I, Ministry of Justice)', vi: 'Công báo Timor-Leste “Jornal da República” (Série I, Bộ Tư pháp)', th: 'ราชกิจจานุเบกษาติมอร์-เลสเต “Jornal da República” (Série I, กระทรวงยุติธรรม)', id: 'Lembaran Resmi Timor-Leste “Jornal da República” (Série I, Kementerian Kehakiman)', ms: 'Warta Rasmi Timor-Leste “Jornal da República” (Série I, Kementerian Kehakiman)' },
    '老挝司法部官方公报（Lao Official Gazette, ຈົດໝາຍເຫດທາງລັດຖະການ）': { en: 'Lao Official Gazette (Ministry of Justice)', vi: 'Công báo Lào (Bộ Tư pháp)', th: 'ราชกิจจานุเบกษาลาว (กระทรวงยุติธรรม)', id: 'Lembaran Resmi Laos (Kementerian Kehakiman)', ms: 'Warta Rasmi Laos (Kementerian Kehakiman)' },
    '柬埔寨司法部法律法规检索平台（រាជកិច្ច, moj.gov.kh）': { en: 'Cambodia Ministry of Justice legal database (moj.gov.kh)', vi: 'Cơ sở dữ liệu pháp luật Bộ Tư pháp Campuchia (moj.gov.kh)', th: 'ฐานข้อมูลกฎหมายกระทรวงยุติธรรมกัมพูชา (moj.gov.kh)', id: 'Basis data hukum Kementerian Kehakiman Kamboja (moj.gov.kh)', ms: 'Pangkalan data undang-undang Kementerian Kehakiman Kemboja (moj.gov.kh)' },
    'Open Development Cambodia 法规数据库（data.opendevelopmentcambodia.net，非 .gov.kh 官方域名，属第三方聚合平台）': { en: 'Open Development Cambodia legal database (third-party aggregator, not an official .gov.kh domain)', vi: 'Cơ sở dữ liệu pháp luật Open Development Cambodia (nền tảng tổng hợp bên thứ ba)', th: 'ฐานข้อมูลกฎหมาย Open Development Cambodia (แพลตฟอร์มรวบรวมของบุคคลที่สาม)', id: 'Basis data hukum Open Development Cambodia (agregator pihak ketiga)', ms: 'Pangkalan data undang-undang Open Development Cambodia (agregator pihak ketiga)' },
    'LawPhil 菲律宾法律虚拟图书馆（The LawPhil Project – Arellano Law Foundation）': { en: 'The LawPhil Project — Arellano Law Foundation', vi: 'Dự án LawPhil — Quỹ Luật Arellano', th: 'โครงการ LawPhil — มูลนิธิกฎหมาย Arellano', id: 'Proyek LawPhil — Yayasan Hukum Arellano', ms: 'Projek LawPhil — Yayasan Undang-undang Arellano' },
    'The LawPhil Project — Arellano Law Foundation': { en: 'The LawPhil Project — Arellano Law Foundation' },
    '用户提供的扫描件（Myanmar Law Library 复印件）': { en: 'User-provided scanned copy (Myanmar Law Library)' },
    '既有批次（资源爬取 / 《东盟法律分类》归档）': { en: 'Existing batches (web harvest / ASEAN law classification archive)' },
    '文莱官方发布渠道': { en: 'Official channel — Brunei Darussalam' },
    '缅甸官方发布渠道': { en: 'Official channel — Myanmar' },
    '马来西亚官方发布渠道': { en: 'Official channel — Malaysia' },
    '越南官方发布渠道': { en: 'Official channel — Vietnam' },
    '泰国官方发布渠道': { en: 'Official channel — Thailand' },
    '泰国官方发布渠道（law.go.th）': { en: 'Official channel — Thailand (law.go.th)' },
    '印度尼西亚官方发布渠道': { en: 'Official channel — Indonesia' },
    '老挝官方发布渠道': { en: 'Official channel — Laos' }
  };

  /** 制定机关名的本地化显示（对象/字符串均可；非中文界面不返回中文） */
  function issuerLabel(field) {
    var lang = CALR.i18n.lang();
    if (field === null || field === undefined || field === '') return '';
    var raw = typeof field === 'object'
      ? (field[lang] || field.en || field.zh || '')
      : String(field);
    if (lang === 'zh') return raw;
    var key = typeof field === 'object' ? (field.zh || field.en || raw) : raw;
    if (!key) return '';
    var hit = ISSUER_LABELS[key];
    if (hit) return hit[lang] || hit.en;
    var m = /^(.+?)官方发布渠道/.exec(key);
    if (m) return 'Official channel — ' + (COUNTRY_EN[m[1]] || m[1]);
    if (typeof field === 'object' && field.en) return field.en;
    if (/^[a-z0-9_]+$/i.test(key)) {
      key = key.replace(/_+/g, ' ').replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
    }
    if (/[\u4e00-\u9fff]/.test(key)) return CALR.i18n.t('制定机关');
    return key;
  }

  /** 数据来源名的本地化显示（优先按 URL 命中官方门户对照表） */
  function sourceLabel(field, url) {
    var lang = CALR.i18n.lang();
    var raw = typeof field === 'object'
      ? (field[lang] || field.en || field.zh || '')
      : (field == null ? '' : String(field));
    if (lang === 'zh') return raw;
    if (url) {
      var lab = portalLabel(url, null);
      if (lab && lab !== url) return lab;
    }
    var key = typeof field === 'object' ? (field.zh || field.en || raw) : raw;
    if (!key) return CALR.i18n.t('官方来源');
    var hit = SOURCE_LABELS[key];
    if (hit) return hit[lang] || hit.en;
    var m = /^(.+?)官方发布渠道/.exec(key);
    if (m) return 'Official channel — ' + (COUNTRY_EN[m[1]] || m[1]);
    if (typeof field === 'object' && field.en) return field.en;
    if (/[\u4e00-\u9fff]/.test(key)) return CALR.i18n.t('官方来源');
    return key;
  }

  /** 生成式机构名（如「老挝官方发布渠道」）的本地化显示 */
  function orgLabel(name) {
    if (!name || CALR.i18n.lang() === 'zh') return name;
    var m = /^(.+?)官方发布渠道$/.exec(name);
    if (!m) return name;
    var zh = m[1];
    var list = (CALR.store && CALR.store.countries) ? CALR.store.countries() : [];
    var hit = null;
    list.forEach(function (x) { if (x.name && x.name.zh === zh) hit = x; });
    var label = hit && hit.name && (hit.name.en || hit.name.zh) ? (hit.name.en || hit.name.zh) : zh;
    return 'Official channel — ' + label;
  }

  /** 官方门户名的本地化显示（中/英对照；支持按域名匹配任意路径；其他语种回退英文） */
  var PORTAL_HOSTS = {
    'vbpl.vn': { zh: '越南法律数据库（VBPL）', en: 'VBPL — Vietnam Legal Database' },
    'ratchakitcha.soc.go.th': { zh: '泰国政府公报（Royal Gazette）', en: 'Royal Gazette of Thailand' },
    'krisd.go.th': { zh: '泰国法律信息门户（KRISD）', en: 'KRISD — Thailand Law Information Portal' },
    'law.go.th': { zh: '泰国法律数据库（law.go.th）', en: 'Thailand Law Database (law.go.th)' },
    'peraturan.go.id': { zh: '印度尼西亚法律法规信息网络（JDIHN）', en: 'JDIHN — Indonesian Legal Information Network' },
    'agc.gov.my': { zh: '马来西亚总检察署法律在线（AGC）', en: 'AGC Malaysia — Laws of Malaysia' },
    'sso.agc.gov.sg': { zh: '新加坡法规在线（SSO）', en: 'Singapore Statutes Online' },
    'lawphil.net': { zh: '菲律宾法律信息库（LawPhil）', en: 'LawPhil — Philippine Laws and Jurisprudence' },
    'officialgazette.gov.ph': { zh: '菲律宾官方公报', en: 'Official Gazette of the Philippines' },
    'agc.gov.bn': { zh: '文莱总检察署法规库', en: 'AGC Brunei — Laws of Brunei Darussalam' },
    'moc.gov.kh': { zh: '柬埔寨商务部法律与法规门户', en: 'Cambodia Ministry of Commerce — Laws & Regulations' },
    'laogazette.gov.la': { zh: '老挝政府公报', en: 'Lao Official Gazette' },
    'moj.gov.mm': { zh: '缅甸司法部', en: 'Myanmar Ministry of Justice' },
    'mj.gov.tl': { zh: '东帝汶司法部', en: 'Ministério da Justiça, Timor-Leste' },
    'flk.npc.gov.cn': { zh: '国家法律法规数据库', en: 'National Laws and Regulations Database' },
    'cicc.court.gov.cn': { zh: '最高人民法院国际商事法庭', en: 'China International Commercial Court' }
  };
  function portalLabel(url, fallback) {
    var lab = PORTAL_LABELS[url];
    if (!lab && url) {
      try {
        var host = new URL(url, 'https://example.invalid').hostname.replace(/^www\./i, '');
        lab = PORTAL_HOSTS[host] || PORTAL_HOSTS[host.split('.').slice(-3).join('.')] || PORTAL_HOSTS[host.split('.').slice(-2).join('.')];
      } catch (e) { /* 非绝对 URL 时忽略 */ }
    }
    var zh = CALR.i18n.lang() === 'zh';
    if (lab) return zh ? lab.zh : lab.en;
    return fallback || url;
  }

  /** 取年份；无有效年份时返回占位符 */
  function yearOf(v) {
    var m = /(\d{4})/.exec(String(v == null ? '' : v));
    return m ? m[1] : '—';
  }

  /* ---------------- 法规条目 ---------------- */
  /** 当前显示标题所用语种（用于判断是否需要提示「暂无中文译名」） */
  function titleLangOf(field) {
    if (!field || typeof field !== 'object') return null;
    var ui = CALR.i18n.lang();
    if (field[ui]) return ui;
    if (field.en) return 'en';
    if (field.zh) return 'zh';
    for (var k in field) if (field[k]) return k;
    return null;
  }

  /** 法域的官方文本语种（决定标题括号里放哪份原文），规范 07 §3.2 */
  var ORIG_LANG = {
    CN: 'zh', BN: 'en', ID: 'id', KH: 'km', LA: 'lo', MM: 'my',
    MY: 'ms', PH: 'en', SG: 'en', TH: 'th', TL: 'pt', VN: 'vi'
  };

  /** 法规标题展示形态（规范 07 §6.1）：
      主标题 = 当前界面语种 → 英文 → 中文；【】内 = 该法域原文（title.orig，缺失时回退到原文语种键）。
      用【】而不是（）区分原文标题，避免与译文正文里的括号混同。
      中文界面看中国法、英文界面看英文法域时，主标题与原文相同，不重复显示。 */
  function lawTitleDisplay(law) {
    var f = law && law.title;
    var lang = CALR.i18n.lang();
    if (!f) return { main: '', orig: null, origLang: null };
    if (typeof f === 'string') return { main: f, orig: null, origLang: null };

    var main = f[lang] || f.en || f.zh || '';
    if (!main) {
      for (var k0 in f) if (f[k0]) { main = f[k0]; break; }
    }
    var origLang = (law && law.country && ORIG_LANG[law.country]) || null;
    var orig = f.orig || (origLang && f[origLang]) || null;
    /* 主标题与原文完全一致时不必重复（中文界面看中国法、英文界面看英文法域） */
    if (orig && String(orig).trim() === String(main).trim()) orig = null;
    return { main: main, orig: orig, origLang: origLang };
  }

  function lawItem(law, opts) {
    opts = opts || {};
    var td = lawTitleDisplay(law);
    var title = td.main;
    /* 检索结果只保留标题 + 国家/修正/公布/施行/收录条数，不显示别名标题、摘要、命中说明 */
    var bare = !!opts.plain;
    var alts = bare ? [] : U().altTitles(law.title, CALR.i18n.lang(), 2).filter(function (a) {
      /* 源语言原名已紧跟在译名后的【】里，不再作为并列标题重复展示 */
      return !(td.orig && a.lang === td.origLang);
    });
    var tlang = titleLangOf(law.title);
    var terms = opts.terms || [];
    /* 有条文文本的法规显示摘要；纯目录条目仅呈现条目信息 */
    var snippet = bare ? '' : ((opts.snippet !== undefined ? opts.snippet : null) ||
      ((law.coverage === 'full' || law.coverage === 'excerpt')
        ? U().highlight(U().truncate(U().plain(U().tr(law.summary)), 140), terms) : ''));
    var hit = bare ? null : opts.hitArticle;
    return '' +
      /* 从检索结果进入详情页时把检索词带过去，详情页据此自动高亮（opt.q） */
      '<a class="law-item" href="#/law/' + esc(law.id) +
        (opts.q ? '?q=' + encodeURIComponent(opts.q) : '') + '">' +
        '<div class="law-item__head">' +
          '<div style="min-width:0">' +
            '<h3 class="law-item__title">' + U().highlight(title, terms) +
              (td.orig ? '【' + esc(td.orig) + '】' : '') +
              (tlang && tlang !== CALR.i18n.lang()
                ? ' <span class="tag tag--outline" style="font-size:11px;font-weight:400;vertical-align:middle">' +
                  esc(CALR.i18n.t('原文标题 · 暂无当前语言译名')) + '</span>'
                : '') + '</h3>' +
            (alts.length ? '<p class="law-item__alt">' + alts.map(function (a) { return esc(a.text); }).join(' · ') + '</p>' : '') +
          '</div>' +
        '</div>' +
        /* 元信息：国旗·国家 · 修正 · 公布 · 施行 · 收录条数（缺失一律占位） */
        '<div class="law-item__meta">' +
          '<span class="row" style="gap:5px">' + flagSvg(law.country, 'flag-mini') + esc(S().countryName(law.country)) + '</span>' +
          '<span>' + esc(CALR.i18n.t('修正')) + ' ' + esc(yearOf(law.amendedDate || law.amendedNote)) + '</span>' +
          '<span>' + esc(CALR.i18n.t('公布')) + ' ' + esc(yearOf(law.promulgatedDate || law.promulgatedDateRaw)) + '</span>' +
          '<span>' + esc(CALR.i18n.t('施行')) + ' ' + esc(yearOf(law.effectiveDate)) + '</span>' +
          '<span>' + esc(CALR.i18n.t('收录')) + ' ' + (law.articleCount || (law.articles || []).length || 0) + ' ' + esc(CALR.i18n.t('条')) + '</span>' +
        '</div>' +
        (snippet ? '<div class="law-item__snippet">' + snippet + '</div>' : '') +
        (hit ? '<div class="law-item__snippet mini muted">命中条文：' + esc(U().tr(hit.noLabel) || ('第 ' + hit.no + ' 条')) + ' ' + esc(U().tr(hit.heading)) + '</div>' : '') +
        /* opts.plain = true 时不渲染标签行（层级/时效性/收录标识/主题/命中说明），
           用于检索结果页只保留法规主体信息 */
        (opts.plain ? '' :
        '<div class="law-item__foot">' +
          levelTag(law.level) + statusTag(law.status) +
          coverageTag(law) +
          topicTags(law) +
          (opts.reasons && opts.reasons.length ? '<span class="mini muted" style="margin-left:auto">' + esc(opts.reasons.join(' ｜ ')) + '</span>' : '') +
          (opts.score ? '<span style="margin-left:auto">' + scoreBar(opts.score) + '</span>' : '') +
        '</div>') +
      '</a>';
  }

  /** 收录形态标识：官方全文 / 待载入全文 / 整理稿 */
  function coverageTag(law) {
    if (law.coverage === 'full') {
      return '<span class="tag tag--navy" title="' + esc('条文取自官方法律数据库') + '">' + CALR.ui.icon('book') + ' ' + esc(CALR.i18n.t('官方全文')) + '</span>';
    }
    if (law.coverage === 'catalog') {
      return '<span class="tag tag--blue" title="' + esc('目录已收录，打开后自动载入条文') + '">' + CALR.ui.icon('download') + ' ' + esc(CALR.i18n.t('待载入全文')) + '</span>';
    }
    return '<span class="tag tag--outline" title="' + esc('平台整理的条文与对照译文') + '">' + esc(CALR.i18n.t('整理稿')) + '</span>';
  }

  function countryCard(c, maxLaws) {
    var stats = S().stats();
    var list = S().lawsOf(c.code);
    var count = list.length;
    var arts = list.reduce(function (n, l) { return n + (l.articleCount || 0); }, 0);
    var w = maxLaws ? Math.min(100, Math.round((count / maxLaws) * 100)) : 0;
    return '' +
      '<a class="country-card" href="#/country/' + esc(c.code) + '">' +
        '<div class="country-card__top">' + flagSvg(c.code) +
          '<div class="country-card__id">' +
            '<div class="country-card__name" title="' + esc(tr(c.name)) + '">' + esc(tr(c.name)) + '</div>' +
            '<div class="country-card__native">' + esc(c.name && c.name.en ? c.name.en : '') + '</div>' +
          '</div></div>' +
        '<div class="country-card__tags">' + sysTag(c) + '</div>' +
        '<div class="country-card__stat"><b>' + U().num(count) + '</b> 部已收录 · <b>' + U().num(arts) + '</b> 条条文</div>' +
        '<div class="country-card__bar"><span style="width:' + w + '%"></span></div>' +
        '<div class="mini muted country-card__desc">' + esc(c.capital ? (tr(c.capital) + ' · ') : '') + esc(tr(c.summary) ? U().truncate(tr(c.summary), 46) : '—') + '</div>' +
      '</a>';
  }

  function metaGrid(cells) {
    return '<div class="meta-grid">' + cells.map(function (c) {
      return '<div class="meta-grid__cell"><div class="meta-grid__label">' + esc(c.label) + '</div>' +
        '<div class="meta-grid__value">' + (c.html || esc(c.value || '—')) + '</div></div>';
    }).join('') + '</div>';
  }

  function stat(num, label) {
    return '<div class="stat"><div class="stat__num">' + esc(num) + '</div><div class="stat__label">' + esc(label) + '</div></div>';
  }

  /* ---------------- 条约条目 ---------------- */
  function treatyItem(x, opts) {
    opts = opts || {};
    var terms = opts.terms || [];
    return '<a class="law-item" href="#/treaty/' + esc(x.id) + '">' +
      '<div class="law-item__head"><h3 class="law-item__title">' + U().highlight(tr(x.name), terms) + '</h3></div>' +
      '<div class="law-item__meta">' +
        '<span>' + esc(t_or('多边协定')) + '</span>' +
        (x.signedDate ? '<span>' + esc(t_or('签署')) + ' ' + esc(U().fmtDate(x.signedDate)) + '</span>' : '') +
        (x.effectiveDate ? '<span>' + esc(t_or('生效')) + ' ' + esc(U().fmtDate(x.effectiveDate)) + '</span>' : '') +
        '<span>' + esc(t_or('缔约方')) + ' ' + ((x.parties || []).length) + '</span>' +
      '</div>' +
      '<div class="law-item__snippet">' + U().highlight(U().truncate(U().plain(tr(x.summary)), 200), terms) + '</div>' +
      '<div class="law-item__foot">' + (x.topics || []).slice(0, 3).map(function (tp) {
        return '<span class="tag tag--blue">' + esc(S().topicName(tp)) + '</span>';
      }).join(' ') + '</div>' +
      '</a>';
  }
  function t_or(k) { return CALR.i18n.t(k); }

  CALR.ui = {
    flagSvg: flagSvg,
    portalLabel: portalLabel,
    orgLabel: orgLabel,
    issuerLabel: issuerLabel,
    sourceLabel: sourceLabel,
    treatyItem: treatyItem,
    statusTag: statusTag,
    levelTag: levelTag,
    sysTag: sysTag,
    topicTags: topicTags,
    breadcrumb: breadcrumb,
    section: section,
    emptyState: emptyState,
    skeletonList: skeletonList,
    scoreBar: scoreBar,
    lawItem: lawItem,
    countryCard: countryCard,
    metaGrid: metaGrid,
    stat: stat
  };
})(typeof window !== 'undefined' ? window : globalThis);
