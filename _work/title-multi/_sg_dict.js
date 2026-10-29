// SG 尾段人工词典：key 为 _sg_tail.js 解析出的 mods 以 ' / ' 拼接，
// value 为一个或一组 {vi,th,id,ms}，每个对应一层括号。
'use strict';

const p = (vi, th, id, ms) => ({ vi, th, id, ms });

// 通用次要括注
const CONSOLIDATION = p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan');
const NO = (n) => p('Số ' + n, 'ฉบับที่ ' + n, 'Nomor ' + n, 'No. ' + n);

// 所得税族词根
const CONC = [
  // vi, th, id, ms  —— 「X 的优惠税率」
  (x) => p('Thuế suất ưu đãi đối với ' + x[0], 'อัตราภาษีผ่อนปรนสำหรับ ' + x[1], 'Tarif Pajak Konsesi untuk ' + x[2], 'Kadar Cukai Konsesi bagi ' + x[3]),
];
const conc = (vi, th, id, ms) => p('Thuế suất ưu đãi đối với ' + vi, 'อัตราภาษีผ่อนปรนสำหรับ ' + th, 'Tarif Pajak Konsesi untuk ' + id, 'Kadar Cukai Konsesi bagi ' + ms);

const mod = {
  // ── Income Tax：优惠税率（Concessionary Rate of Tax for …） ──────────
  'Concessionary Rate of Tax for Aircraft Investment Manager / Prescribed Activities': [
    conc('nhà quản lý đầu tư máy bay', 'ผู้จัดการลงทุนด้านอากาศยาน', 'Manajer Investasi Pesawat', 'Pengurus Pelaburan Pesawat'),
    p('hoạt động theo quy định', 'กิจกรรมตามที่กำหนด', 'Kegiatan yang Ditetapkan', 'Aktiviti yang Ditetapkan'),
  ],
  'Concessionary Rate of Tax for Aircraft Leasing Company / Prescribed Activities': [
    conc('công ty cho thuê máy bay', 'บริษัทให้เช่าเครื่องบิน', 'Perusahaan Sewa Pesawat', 'Syarikat Pajakan Pesawat'),
    p('hoạt động theo quy định', 'กิจกรรมตามที่กำหนด', 'Kegiatan yang Ditetapkan', 'Aktiviti yang Ditetapkan'),
  ],
  'Concessionary Rate of Tax for Approved Finance and Treasury Centre': conc(
    'trung tâm tài chính và ngân quỹ được chấp thuận', 'ศูนย์การเงินและการคลังที่ได้รับอนุมัติ',
    'Pusat Keuangan dan Perbendaharaan yang Disetujui', 'Pusat Kewangan dan Perbendaharaan yang Diluluskan'),
  'Concessionary Rate of Tax for Approved Headquarters Company': conc(
    'công ty trụ sở chính được chấp thuận', 'บริษัทสำนักงานใหญ่ที่ได้รับอนุมัติ',
    'Perusahaan Kantor Pusat yang Disetujui', 'Syarikat Ibu Pejabat yang Diluluskan'),
  'Concessionary Rate of Tax for Approved Insurance Brokers': conc(
    'nhà môi giới bảo hiểm được chấp thuận', 'นายหน้าประกันภัยที่ได้รับอนุมัติ',
    'Pialang Asuransi yang Disetujui', 'Broker Insurans yang Diluluskan'),
  'Concessionary Rate of Tax for Approved Qualifying Companies': conc(
    'công ty đủ điều kiện được chấp thuận', 'บริษัทที่เข้าเกณฑ์ที่ได้รับอนุมัติ',
    'Perusahaan Memenuhi Syarat yang Disetujui', 'Syarikat Layak yang Diluluskan'),
  'Concessionary Rate of Tax for Approved Trustee Companies': conc(
    'công ty được ủy thác được chấp thuận', 'บริษัทผู้จัดการมรดกที่ได้รับอนุมัติ',
    'Perusahaan Wali Amanat yang Disetujui', 'Syarikat Pemegang Amanah yang Diluluskan'),
  'Concessionary Rate of Tax for Container Investment Manager': conc(
    'nhà quản lý đầu tư container', 'ผู้จัดการลงทุนตู้คอนเทนเนอร์',
    'Manajer Investasi Peti Kemas', 'Pengurus Pelaburan Kontena'),
  'Concessionary Rate of Tax for Financial Sector Incentive Companies': conc(
    'công ty ưu đãi khu vực tài chính', 'บริษัทส่งเสริมภาคการเงิน',
    'Perusahaan Insentif Sektor Keuangan', 'Syarikat Insentif Sektor Kewangan'),
  'Concessionary Rate of Tax for Foreign Income of Approved Container Investment Enterprise': conc(
    'thu nhập nước ngoài của doanh nghiệp đầu tư container được chấp thuận',
    'รายได้ต่างประเทศของวิสาหกิจลงทุนตู้คอนเทนเนอร์ที่ได้รับอนุมัติ',
    'penghasilan luar negeri dari perusahaan investasi peti kemas yang disetujui',
    'pendapatan luar negara bagi perusahaan pelaburan kontena yang diluluskan'),
  'Concessionary Rate of Tax for Global Trading Companies': conc(
    'công ty thương mại toàn cầu', 'บริษัทการค้าระดับโลก',
    'Perusahaan Perdagangan Global', 'Syarikat Perdagangan Global'),
  'Concessionary Rate of Tax for Income Derived from Managing Qualifying Registered Business Trust or Company': conc(
    'thu nhập từ việc quản lý quỹ tín thác kinh doanh đã đăng ký đủ điều kiện hoặc công ty đủ điều kiện',
    'รายได้จากการจัดการกองทรัสต์ธุรกิจที่จดทะเบียนตามเกณฑ์หรือบริษัทที่เข้าเกณฑ์',
    'penghasilan dari pengelolaan unit perwalian usaha terdaftar yang memenuhi syarat atau perusahaan yang memenuhi syarat',
    'pendapatan daripada pengurusan amanah pelaburan perniagaan berdaftar yang layak atau syarikat yang layak'),
  'Concessionary Rate of Tax for Income of Life Insurers Apportioned to Policyholders': conc(
    'thu nhập của doanh nghiệp bảo hiểm nhân thọ được phân bổ cho chủ hợp đồng',
    'รายได้ของผู้รับประกันชีวิตที่จัดสรรให้ผู้ถือกรมธรรม์',
    'penghasilan penanggung asuransi jiwa yang dialokasikan kepada pemegang polis',
    'pendapatan penanggung insurans hayat yang diperuntukkan kepada pemegang polisi'),
  'Concessionary Rate of Tax for Intellectual Property Income': conc(
    'thu nhập sở hữu trí tuệ', 'รายได้ทรัพย์สินทางปัญญา',
    'Penghasilan Kekayaan Intelektual', 'Pendapatan Harta Intelek'),
  'Concessionary Rate of Tax for International Growth Company': conc(
    'công ty tăng trưởng quốc tế', 'บริษัทเติบโตระหว่างประเทศ',
    'Perusahaan Pertumbuhan Internasional', 'Syarikat Pertumbuhan Antarabangsa'),
  'Concessionary Rate of Tax for Provision of Processing Services to Financial Institutions': conc(
    'việc cung cấp dịch vụ chế biến cho các tổ chức tài chính',
    'การให้บริการแปรรูปแก่สถาบันการเงิน',
    'penyediaan jasa pengolahan kepada lembaga keuangan',
    'penyediaan perkhidmatan pemprosesan kepada institusi kewangan'),
  'Concessionary Rate of Tax for Shipping Investment Manager': conc(
    'nhà quản lý đầu tư vận tải biển', 'ผู้จัดการลงทุนด้านการเดินเรือ',
    'Manajer Investasi Pelayaran', 'Pengurus Pelaburan Perkapalan'),
  'Concessionary Rate of Tax for Shipping-related Support Services': conc(
    'dịch vụ hỗ trợ liên quan đến vận tải biển', 'บริการสนับสนุนที่เกี่ยวข้องกับการเดินเรือ',
    'jasa pendukung terkait pelayaran', 'perkhidmatan sokongan berkaitan perkapalan'),
  'Concessionary Rate of Tax or Exemption for Income Derived from Debt Securities': p(
    'Thuế suất ưu đãi hoặc miễn trừ đối với thu nhập từ chứng khoán nợ',
    'อัตราภาษีผ่อนปรนหรือการยกเว้นสำหรับรายได้จากหลักทรัพย์หนี้',
    'Tarif Pajak Konsesi atau Pembebasan atas Penghasilan dari Efek Utang',
    'Kadar Cukai Konsesi atau Pengecualian bagi Pendapatan daripada Sekuriti Hutang'),
  'Concessionary Rate of Tax on Dividends — Aircraft Leasing Company': p(
    'Thuế suất ưu đãi đối với cổ tức — công ty cho thuê máy bay',
    'อัตราภาษีผ่อนปรนสำหรับเงินปันผล — บริษัทให้เช่าเครื่องบิน',
    'Tarif Pajak Konsesi atas Dividen — Perusahaan Sewa Pesawat',
    'Kadar Cukai Konsesi atas Dividen — Syarikat Pajakan Pesawat'),

  // ── Income Tax：贷款利息豁免 ─────────────────────────────────────
  'Exemption of Interest and Other Payments for Economic and Technological Development Loans': p(
    'Miễn trừ lãi và các khoản thanh toán khác đối với các khoản vay phát triển kinh tế và công nghệ',
    'การยกเว้นดอกเบี้ยและการชำระเงินอื่นสำหรับเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยี',
    'Pembebasan Bunga dan Pembayaran Lain atas Pinjaman Pembangunan Ekonomi dan Teknologi',
    'Pengecualian Faedah dan Pembayaran Lain bagi Pinjaman Pembangunan Ekonomi dan Teknologi'),
  'Exemption of Interest and Other Payments for Economic and Technological Development Loans / Consolidation': [
    p('Miễn trừ lãi và các khoản thanh toán khác đối với các khoản vay phát triển kinh tế và công nghệ',
      'การยกเว้นดอกเบี้ยและการชำระเงินอื่นสำหรับเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยี',
      'Pembebasan Bunga dan Pembayaran Lain atas Pinjaman Pembangunan Ekonomi dan Teknologi',
      'Pengecualian Faedah dan Pembayaran Lain bagi Pinjaman Pembangunan Ekonomi dan Teknologi'),
    CONSOLIDATION],
  ...['No. 2', 'No. 3', 'No. 8', 'No. 11'].reduce((o, k) => {
    o['Exemption of Interest and Other Payments for Economic and Technological Development Loans / ' + k] = [
      p('Miễn trừ lãi và các khoản thanh toán khác đối với các khoản vay phát triển kinh tế và công nghệ',
        'การยกเว้นดอกเบี้ยและการชำระเงินอื่นสำหรับเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยี',
        'Pembebasan Bunga dan Pembayaran Lain atas Pinjaman Pembangunan Ekonomi dan Teknologi',
        'Pengecualian Faedah dan Pembayaran Lain bagi Pinjaman Pembangunan Ekonomi dan Teknologi'),
      NO(k.replace('No. ', ''))];
    return o;
  }, {}),
  'Exemption of Interest and Other Payments on Economic and Technological Development Loans and Finance Leases / No. 4': [
    p('Miễn trừ lãi và các khoản thanh toán khác đối với các khoản vay phát triển kinh tế và công nghệ và thuê tài chính',
      'การยกเว้นดอกเบี้ยและการชำระเงินอื่นสำหรับเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยีและการเช่าการเงิน',
      'Pembebasan Bunga dan Pembayaran Lain atas Pinjaman Pembangunan Ekonomi dan Teknologi dan Sewa Pembiayaan',
      'Pengecualian Faedah dan Pembayaran Lain bagi Pinjaman Pembangunan Ekonomi dan Teknologi dan Pajakan Kewangan'),
    NO('4')],
  'Exemption of Interest on Economic and Technological Development Loans': p(
    'Miễn trừ lãi đối với các khoản vay phát triển kinh tế và công nghệ',
    'การยกเว้นดอกเบี้ยเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยี',
    'Pembebasan Bunga atas Pinjaman Pembangunan Ekonomi dan Teknologi',
    'Pengecualian Faedah bagi Pinjaman Pembangunan Ekonomi dan Teknologi'),
  'Exemption of Interest on Economic and Technological Development Loans / Consolidation': [
    p('Miễn trừ lãi đối với các khoản vay phát triển kinh tế và công nghệ',
      'การยกเว้นดอกเบี้ยเงินกู้เพื่อการพัฒนาทางเศรษฐกิจและเทคโนโลยี',
      'Pembebasan Bunga atas Pinjaman Pembangunan Ekonomi dan Teknologi',
      'Pengecualian Faedah bagi Pinjaman Pembangunan Ekonomi dan Teknologi'),
    CONSOLIDATION],

  // ── Income Tax：国际税务合规协议 ─────────────────────────────────
  'International Tax Compliance Agreements / Common Reporting Standard': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Tiêu chuẩn báo cáo chung', 'มาตรฐานการรายงานร่วม',
      'Standar Pelaporan Bersama', 'Standard Pelaporan Bersama')],
  'International Tax Compliance Agreements / United States of America': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Hợp chúng quốc Hoa Kỳ', 'สหรัฐอเมริกา', 'Amerika Serikat', 'Amerika Syarikat')],
  'International Tax Compliance Agreements / Competent Authority Agreement — United States of America': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Hiệp định cơ quan có thẩm quyền — Hợp chúng quốc Hoa Kỳ',
      'ข้อตกลงหน่วยงานผู้มีอำนาจ — สหรัฐอเมริกา',
      'Persetujuan Otoritas Berwenang — Amerika Serikat',
      'Perjanjian Pihak Berkuasa Berwibawa — Amerika Syarikat')],
  'International Tax Compliance Agreements / Competent Authority Agreements / No. 2': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Các hiệp định cơ quan có thẩm quyền', 'ข้อตกลงหน่วยงานผู้มีอำนาจ',
      'Persetujuan Otoritas Berwenang', 'Perjanjian Pihak Berkuasa Berwibawa'),
    NO('2')],
  'International Tax Compliance Agreements / Country-By-Country Reporting': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Báo cáo theo từng quốc gia', 'การรายงานแยกตามประเทศ',
      'Pelaporan per Negara', 'Pelaporan Mengikut Negara')],
  'International Tax Compliance Agreements / Multilateral Competent Authority Agreement on Automatic Exchange of Financial Account Information': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Hiệp định đa phương giữa các cơ quan có thẩm quyền về trao đổi tự động thông tin tài khoản tài chính',
      'ข้อตกลงพหุภาคีระหว่างหน่วยงานผู้มีอำนาจว่าด้วยการแลกเปลี่ยนข้อมูลบัญชีการเงินโดยอัตโนมัติ',
      'Persetujuan Multilateral Otoritas Berwenang tentang Pertukaran Otomatis Informasi Rekening Keuangan',
      'Perjanjian Multilateral Pihak Berkuasa Berwibawa tentang Pertukaran Automatik Maklumat Akaun Kewangan')],
  'International Tax Compliance Agreements / Multilateral Competent Authority Agreement on the Exchange of Country-By-Country Reports': [
    p('Thỏa thuận tuân thủ thuế quốc tế', 'ข้อตกลงการปฏิบัติตามภาษีระหว่างประเทศ',
      'Perjanjian Kepatuhan Pajak Internasional', 'Perjanjian Pematuhan Cukai Antarabangsa'),
    p('Hiệp định đa phương giữa các cơ quan có thẩm quyền về trao đổi báo cáo theo từng quốc gia',
      'ข้อตกลงพหุภาคีระหว่างหน่วยงานผู้มีอำนาจว่าด้วยการแลกเปลี่ยนรายงานแยกตามประเทศ',
      'Persetujuan Multilateral Otoritas Berwenang tentang Pertukaran Laporan per Negara',
      'Perjanjian Multilateral Pihak Berkuasa Berwibawa tentang Pertukaran Laporan Mengikut Negara')],

  // ── Income Tax：计算基础变更的调整 ───────────────────────────────
  'Adjustment for Change of Basis of Computing Profit, Loss or Expense from Financial Instruments of Insurers': p(
    'Điều chỉnh khi thay đổi căn cứ tính lợi nhuận, lỗ hoặc chi phí từ công cụ tài chính của doanh nghiệp bảo hiểm',
    'การปรับปรุงเมื่อเปลี่ยนฐานในการคำนวณกำไร ขาดทุน หรือค่าใช้จ่ายจากเครื่องมือทางการเงินของผู้รับประกัน',
    'Penyesuaian atas Perubahan Dasar Penghitungan Laba, Rugi atau Beban dari Instrumen Keuangan Penanggung Asuransi',
    'Pelarasan atas Perubahan Asas Pengiraan Untung, Rugi atau Perbelanjaan daripada Instrumen Kewangan Penanggung Insurans'),
  'Adjustment for Change of Basis of Computing Profit, Loss or Expense of Financial Instruments resulting from FRS 109 or SFRS(I) 9': p(
    'Điều chỉnh khi thay đổi căn cứ tính lợi nhuận, lỗ hoặc chi phí của công cụ tài chính do FRS 109 hoặc SFRS(I) 9',
    'การปรับปรุงเมื่อเปลี่ยนฐานในการคำนวณกำไร ขาดทุน หรือค่าใช้จ่ายของเครื่องมือทางการเงินอันเนื่องมาจาก FRS 109 หรือ SFRS(I) 9',
    'Penyesuaian atas Perubahan Dasar Penghitungan Laba, Rugi atau Beban Instrumen Keuangan akibat FRS 109 atau SFRS(I) 9',
    'Pelarasan atas Perubahan Asas Pengiraan Untung, Rugi atau Perbelanjaan Instrumen Kewangan berikutan FRS 109 atau SFRS(I) 9'),
  'Adjustment on Change of Basis of Computing Profits of Financial Instruments': p(
    'Điều chỉnh khi thay đổi căn cứ tính lợi nhuận của công cụ tài chính',
    'การปรับปรุงเมื่อเปลี่ยนฐานในการคำนวณกำไรของเครื่องมือทางการเงิน',
    'Penyesuaian atas Perubahan Dasar Penghitungan Laba Instrumen Keuangan',
    'Pelarasan atas Perubahan Asas Pengiraan Untung Instrumen Kewangan'),
  'Adjustment on Change of Basis of Computing Taxable Surplus of Life Insurers': p(
    'Điều chỉnh khi thay đổi căn cứ tính thặng dư chịu thuế của doanh nghiệp bảo hiểm nhân thọ',
    'การปรับปรุงเมื่อเปลี่ยนฐานในการคำนวณส่วนเกินที่ต้องเสียภาษีของผู้รับประกันชีวิต',
    'Penyesuaian atas Perubahan Dasar Penghitungan Surplus Kena Pajak Penanggung Asuransi Jiwa',
    'Pelarasan atas Perubahan Asas Pengiraan Lebihan Bercukai Penanggung Insurans Hayat'),

  // ── Income Tax：条文豁免 / 外国所得豁免 ─────────────────────────
  'Exemption from section 19B(10A)': p(
    'Miễn trừ theo Điều 19B(10A)', 'การยกเว้นตามมาตรา 19B(10A)',
    'Pembebasan menurut Pasal 19B(10A)', 'Pengecualian menurut Seksyen 19B(10A)'),
  'Exemption from Section 19B(10A)': p(
    'Miễn trừ theo Điều 19B(10A)', 'การยกเว้นตามมาตรา 19B(10A)',
    'Pembebasan menurut Pasal 19B(10A)', 'Pengecualian menurut Seksyen 19B(10A)'),
  'Exemption of Foreign Income of Approved International Shipping Enterprises': p(
    'Miễn trừ thu nhập nước ngoài của doanh nghiệp vận tải biển quốc tế được chấp thuận',
    'การยกเว้นรายได้ต่างประเทศของวิสาหกิจการเดินเรือระหว่างประเทศที่ได้รับอนุมัติ',
    'Pembebasan Penghasilan Luar Negeri dari Perusahaan Pelayaran Internasional yang Disetujui',
    'Pengecualian Pendapatan Luar Negara bagi Perusahaan Perkapalan Antarabangsa yang Diluluskan'),
  'Exemption of Foreign Income of Approved Shipping Investment Enterprise': p(
    'Miễn trừ thu nhập nước ngoài của doanh nghiệp đầu tư vận tải biển được chấp thuận',
    'การยกเว้นรายได้ต่างประเทศของวิสาหกิจลงทุนด้านการเดินเรือที่ได้รับอนุมัติ',
    'Pembebasan Penghasilan Luar Negeri dari Perusahaan Investasi Pelayaran yang Disetujui',
    'Pengecualian Pendapatan Luar Negara bagi Perusahaan Pelaburan Perkapalan yang Diluluskan'),
  'Exemption of Foreign Income — REITs and Other Special Cases': p(
    'Miễn trừ thu nhập nước ngoài — REIT và các trường hợp đặc biệt khác',
    'การยกเว้นรายได้ต่างประเทศ — REIT และกรณีพิเศษอื่น ๆ',
    'Pembebasan Penghasilan Luar Negeri — REIT dan Kasus Khusus Lainnya',
    'Pengecualian Pendapatan Luar Negara — REIT dan Kes Khas Lain'),

  // ── Central Provident Fund 中央公积金 ────────────────────────────
  'Approved HDB-HUDC Housing Scheme': p(
    'Chương trình nhà ở HDB-HUDC được chấp thuận', 'โครงการที่อยู่อาศัย HDB-HUDC ที่ได้รับอนุมัติ',
    'Skema Perumahan HDB-HUDC yang Disetujui', 'Skim Perumahan HDB-HUDC yang Diluluskan'),
  'Approved Housing Schemes': p(
    'Các chương trình nhà ở được chấp thuận', 'โครงการที่อยู่อาศัยที่ได้รับอนุมัติ',
    'Skema Perumahan yang Disetujui', 'Skim Perumahan yang Diluluskan'),
  'Approved Middle-Income Housing Scheme': p(
    'Chương trình nhà ở cho người thu nhập trung bình được chấp thuận',
    'โครงการที่อยู่อาศัยสำหรับผู้มีรายได้ปานกลางที่ได้รับอนุมัติ',
    'Skema Perumahan Berpenghasilan Menengah yang Disetujui',
    'Skim Perumahan Berpendapatan Sederhana yang Diluluskan'),
  'Approved Mortgagees': p(
    'Các bên nhận thế chấp được chấp thuận', 'ผู้รับจำนองที่ได้รับอนุมัติ',
    'Penerima Gadai yang Disetujui', 'Pemegang Gadai yang Diluluskan'),
  'Closure of Special Account': p(
    'Đóng Tài khoản Đặc biệt', 'การปิดบัญชีพิเศษ', 'Penutupan Akun Khusus', 'Penutupan Akaun Khas'),
  'Contribute As You Earn Scheme': p(
    'Chương trình đóng góp theo thu nhập', 'โครงการสมทบตามรายได้',
    'Skema Iuran Sesuai Penghasilan', 'Skim Caruman Mengikut Pendapatan'),
  'Contributions to Community Fund — CDAC': p(
    'Đóng góp vào Quỹ Cộng đồng — CDAC', 'การสมทบเข้ากองทุนชุมชน — CDAC',
    'Iuran untuk Dana Masyarakat — CDAC', 'Caruman kepada Dana Komuniti — CDAC'),
  'Contributions to Community Fund — Eurasian Association': p(
    'Đóng góp vào Quỹ Cộng đồng — Hiệp hội người Á-Âu', 'การสมทบเข้ากองทุนชุมชน — สมาคมยูเรเชียน',
    'Iuran untuk Dana Masyarakat — Perhimpunan Eurasia', 'Caruman kepada Dana Komuniti — Persatuan Eurasia'),
  'Contributions to Community Fund — SINDA': p(
    'Đóng góp vào Quỹ Cộng đồng — SINDA', 'การสมทบเข้ากองทุนชุมชน — SINDA',
    'Iuran untuk Dana Masyarakat — SINDA', 'Caruman kepada Dana Komuniti — SINDA'),
  'Declaration of Rates of Interest / No. 4': [
    p('Công bố lãi suất', 'การประกาศอัตราดอกเบี้ย', 'Pernyataan Tingkat Bunga', 'Pengisytiharan Kadar Faedah'),
    NO('4')],
  "Dependants' Protection Insurance Scheme": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc', 'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ',
    'Skema Asuransi Perlindungan Tanggungan', 'Skim Insurans Perlindungan Tanggungan'),
  "Dependants' Protection Insurance Scheme — Transfer of Liabilities": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc — Chuyển giao nghĩa vụ',
    'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ — การโอนภาระผูกพัน',
    'Skema Asuransi Perlindungan Tanggungan — Pengalihan Kewajiban',
    'Skim Insurans Perlindungan Tanggungan — Pemindahan Liabiliti'),
  "Dependants' Protection Insurance Scheme — Uninsured Member": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc — Thành viên chưa được bảo hiểm',
    'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ — สมาชิกที่ไม่มีประกัน',
    'Skema Asuransi Perlindungan Tanggungan — Anggota Tanpa Asuransi',
    'Skim Insurans Perlindungan Tanggungan — Anggota Tanpa Insurans'),
  "Dependants\u2019 Protection Insurance Scheme": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc', 'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ',
    'Skema Asuransi Perlindungan Tanggungan', 'Skim Insurans Perlindungan Tanggungan'),
  "Dependants\u2019 Protection Insurance Scheme — Transfer of Liabilities": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc — Chuyển giao nghĩa vụ',
    'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ — การโอนภาระผูกพัน',
    'Skema Asuransi Perlindungan Tanggungan — Pengalihan Kewajiban',
    'Skim Insurans Perlindungan Tanggungan — Pemindahan Liabiliti'),
  "Dependants\u2019 Protection Insurance Scheme — Uninsured Member": p(
    'Chương trình bảo hiểm bảo vệ người phụ thuộc — Thành viên chưa được bảo hiểm',
    'โครงการประกันคุ้มครองผู้อยู่ในอุปการะ — สมาชิกที่ไม่มีประกัน',
    'Skema Asuransi Perlindungan Tanggungan — Anggota Tanpa Asuransi',
    'Skim Insurans Perlindungan Tanggungan — Anggota Tanpa Insurans'),
  'Designated Shares': p(
    'Cổ phần được chỉ định', 'หุ้นที่กำหนด', 'Saham yang Ditunjuk', 'Saham yang Ditetapkan'),
  'Division of Fund-Related Assets in Matrimonial Proceedings': p(
    'Phân chia tài sản liên quan đến quỹ trong thủ tục hôn nhân',
    'การแบ่งทรัพย์สินที่เกี่ยวข้องกับกองทุนในการดำเนินคดีเกี่ยวกับการสมรส',
    'Pembagian Aset Terkait Dana dalam Perkara Perkawinan',
    'Pembahagian Aset Berkaitan Dana dalam Prosiding Perkahwinan'),
  'Education Scheme': p(
    'Chương trình giáo dục', 'โครงการการศึกษา', 'Skema Pendidikan', 'Skim Pendidikan'),
  'Exemption for Protection of Benefits under Part V Assurance': p(
    'Miễn trừ đối với việc bảo vệ quyền lợi theo bảo hiểm Phần V',
    'การยกเว้นสำหรับการคุ้มครองสิทธิประโยชน์ตามการประกันภาค 5',
    'Pembebasan atas Perlindungan Manfaat menurut Asuransi Bagian V',
    'Pengecualian bagi Perlindungan Faedah menurut Insurans Bahagian V'),
  'Government Employees': p(
    'Nhân viên chính phủ', 'ข้าราชการ', 'Pegawai Pemerintah', 'Kakitangan Kerajaan'),
  'Home Protection Insurance Scheme': p(
    'Chương trình bảo hiểm bảo vệ nhà ở', 'โครงการประกันคุ้มครองที่อยู่อาศัย',
    'Skema Asuransi Perlindungan Rumah', 'Skim Insurans Perlindungan Rumah'),
  'Home Protection Insurance Scheme — Exemption': p(
    'Chương trình bảo hiểm bảo vệ nhà ở — Miễn trừ', 'โครงการประกันคุ้มครองที่อยู่อาศัย — การยกเว้น',
    'Skema Asuransi Perlindungan Rumah — Pembebasan', 'Skim Insurans Perlindungan Rumah — Pengecualian'),
  'Investment Schemes': p(
    'Các chương trình đầu tư', 'โครงการลงทุน', 'Skema Investasi', 'Skim Pelaburan'),
  'Lifelong Income Scheme': p(
    'Chương trình thu nhập trọn đời', 'โครงการรายได้ตลอดชีพ',
    'Skema Penghasilan Seumur Hidup', 'Skim Pendapatan Seumur Hidup'),
  'Long Service Awards': p(
    'Giải thưởng phục vụ lâu năm', 'รางวัลการทำงานยาวนาน',
    'Penghargaan Pengabdian Lama', 'Anugerah Perkhidmatan Lama'),
  'Medisave Account Transfers': p(
    'Chuyển Tài khoản Medisave', 'การโอนบัญชีเมดิเซฟ',
    'Pemindahan Akun Medisave', 'Pemindahan Akaun Medisave'),
  'Medisave Account Withdrawals': p(
    'Rút Tài khoản Medisave', 'การถอนบัญชีเมดิเซฟ',
    'Penarikan Akun Medisave', 'Pengeluaran Akaun Medisave'),
  'Medisave Account Withdrawals — Medical Insurance Premiums': p(
    'Rút Tài khoản Medisave — Phí bảo hiểm y tế', 'การถอนบัญชีเมดิเซฟ — เบี้ยประกันสุขภาพ',
    'Penarikan Akun Medisave — Premi Asuransi Kesehatan', 'Pengeluaran Akaun Medisave — Premium Insurans Perubatan'),
  'Mental Capacity': p(
    'Năng lực tinh thần', 'ความสามารถทางจิต', 'Kapasitas Mental', 'Keupayaan Mental'),
  'Ministry of Defence Housing Scheme': p(
    'Chương trình nhà ở của Bộ Quốc phòng', 'โครงการที่อยู่อาศัยของกระทรวงกลาโหม',
    'Skema Perumahan Kementerian Pertahanan', 'Skim Perumahan Kementerian Pertahanan'),
  'Modifications to Act for Design-Build-and-Sell Scheme': p(
    'Sửa đổi Luật áp dụng cho Chương trình thiết kế-xây dựng-bán',
    'การแก้ไขพระราชบัญญัติสำหรับโครงการออกแบบ-ก่อสร้าง-ขาย',
    'Perubahan Undang-Undang untuk Skema Rancang-Bangun-Jual',
    'Pindaan Akta bagi Skim Reka-Bina-Jual'),
  'New Retirement Sum Scheme': p(
    'Chương trình Tổng hưu trí mới', 'โครงการเงินบำนาญใหม่',
    'Skema Jumlah Pensiun Baru', 'Skim Jumlah Persaraan Baharu'),
  'Nominations': p(
    'Chỉ định', 'การระบุผู้รับ', 'Penunjukan', 'Penamaan'),
  'Nominations and Nominee Accounts': p(
    'Chỉ định và tài khoản người được chỉ định', 'การระบุผู้รับและบัญชีผู้รับ',
    'Penunjukan dan Akun Penerima Manfaat', 'Penamaan dan Akaun Penama'),
  'Non-Residential Properties Scheme': p(
    'Chương trình bất động sản phi nhà ở', 'โครงการอสังหาริมทรัพย์ที่ไม่ใช่ที่อยู่อาศัย',
    'Skema Properti Non-Hunian', 'Skim Hartanah Bukan Kediaman'),
  'Platform Earnings — Excluded Payments': p(
    'Thu nhập nền tảng — Các khoản thanh toán bị loại trừ',
    'รายได้จากแพลตฟอร์ม — การชำระเงินที่ยกเว้น',
    'Penghasilan Platform — Pembayaran yang Dikecualikan',
    'Pendapatan Platform — Bayaran yang Dikecualikan'),
  'Prescribed Applicable Person': p(
    'Người áp dụng theo quy định', 'บุคคลที่เกี่ยวข้องตามที่กำหนด',
    'Orang yang Berlaku sebagaimana Ditetapkan', 'Orang yang Berkenaan sebagaimana Ditetapkan'),
  'Prescribed Circumstances under Section 13C': p(
    'Trường hợp theo quy định tại Điều 13C', 'สถานการณ์ตามที่กำหนดตามมาตรา 13C',
    'Keadaan sebagaimana Ditetapkan menurut Pasal 13C', 'Keadaan sebagaimana Ditetapkan menurut Seksyen 13C'),
  'Public Sector Employees': p(
    'Nhân viên khu vực công', 'ข้าราชการและลูกจ้างภาครัฐ',
    'Pegawai Sektor Publik', 'Kakitangan Sektor Awam'),
  'Refunds': p(
    'Hoàn trả', 'การคืนเงิน', 'Pengembalian Dana', 'Bayaran Balik'),
  'Relevant Individual': p(
    'Cá nhân liên quan', 'บุคคลที่เกี่ยวข้อง', 'Individu yang Relevan', 'Individu yang Berkenaan'),
  'Relevant Transactions — Exemption': p(
    'Giao dịch liên quan — Miễn trừ', 'ธุรกรรมที่เกี่ยวข้อง — การยกเว้น',
    'Transaksi Relevan — Pembebasan', 'Transaksi Berkenaan — Pengecualian'),
  'Reserved Amount': p(
    'Số tiền dự trữ', 'จำนวนเงินสำรอง', 'Jumlah yang Dicadangkan', 'Jumlah yang Dikhaskan'),
  'Residential Properties Scheme': p(
    'Chương trình bất động sản nhà ở', 'โครงการอสังหาริมทรัพย์ที่อยู่อาศัย',
    'Skema Properti Hunian', 'Skim Hartanah Kediaman'),
  'Retirement Sum Plus Scheme': p(
    'Chương trình Tổng hưu trí Plus', 'โครงการเงินบำนาญพลัส',
    'Skema Jumlah Pensiun Plus', 'Skim Jumlah Persaraan Plus'),
  'Retirement Sum Scheme': p(
    'Chương trình Tổng hưu trí', 'โครงการเงินบำนาญ',
    'Skema Jumlah Pensiun', 'Skim Jumlah Persaraan'),
  'Retirement Sum Scheme Nominations': p(
    'Chỉ định theo Chương trình Tổng hưu trí', 'การระบุผู้รับตามโครงการเงินบำนาญ',
    'Penunjukan Skema Jumlah Pensiun', 'Penamaan Skim Jumlah Persaraan'),
  'Retirement Sum Topping-Up Scheme': p(
    'Chương trình bổ sung Tổng hưu trí', 'โครงการเติมเงินบำนาญ',
    'Skema Penambahan Jumlah Pensiun', 'Skim Penambahan Jumlah Persaraan'),
  'Revised Retirement Sum Scheme': p(
    'Chương trình Tổng hưu trí sửa đổi', 'โครงการเงินบำนาญฉบับแก้ไข',
    'Skema Jumlah Pensiun yang Direvisi', 'Skim Jumlah Persaraan yang Disemak'),
  'Revised Workfare Income Supplement Scheme': p(
    'Chương trình bổ sung thu nhập Workfare sửa đổi', 'โครงการเสริมรายได้เวิร์กแฟร์ฉบับแก้ไข',
    'Skema Suplemen Penghasilan Workfare yang Direvisi', 'Skim Tambahan Pendapatan Workfare yang Disemak'),
  'Self-Employed Persons': p(
    'Người tự kinh doanh', 'ผู้ประกอบอาชีพอิสระ', 'Orang yang Bekerja Sendiri', 'Orang yang Bekerja Sendiri'),
  'Specified Employment': p(
    'Việc làm được chỉ định', 'การจ้างงานที่กำหนด',
    'Pekerjaan yang Ditentukan', 'Pekerjaan yang Ditetapkan'),
  'Topping-Up of Special Account': p(
    'Bổ sung Tài khoản Đặc biệt', 'การเติมเงินบัญชีพิเศษ',
    'Penambahan Akun Khusus', 'Penambahan Akaun Khas'),
  'Voluntary Contributions and Annual Limits': p(
    'Đóng góp tự nguyện và giới hạn hằng năm', 'การสมทบโดยสมัครใจและวงเงินรายปี',
    'Iuran Sukarela dan Batas Tahunan', 'Caruman Sukarela dan Had Tahunan'),
  'Wages — Excluded Payments': p(
    'Tiền lương — Các khoản thanh toán bị loại trừ', 'ค่าจ้าง — การชำระเงินที่ยกเว้น',
    'Upah — Pembayaran yang Dikecualikan', 'Upah — Bayaran yang Dikecualikan'),
  'Workfare Income Supplement Scheme': p(
    'Chương trình bổ sung thu nhập Workfare', 'โครงการเสริมรายได้เวิร์กแฟร์',
    'Skema Suplemen Penghasilan Workfare', 'Skim Tambahan Pendapatan Workfare'),

  // ── 跨母法通用术语（单括注，直接命中） ───────────────────────
  'Commencement': p('Ngày bắt đầu có hiệu lực', 'วันเริ่มมีผลใช้บังคับ', 'Mulai Berlaku', 'Mula Berkuat Kuasa'),
  'Effective Date': p('Ngày có hiệu lực', 'วันที่มีผลใช้บังคับ', 'Tanggal Berlaku', 'Tarikh Berkuat Kuasa'),
  'Exemption': p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian'),
  'Exemptions': p('Các trường hợp miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian'),
  'Composition of Offences': p('Hòa giải tội phạm', 'การประนีประนอมความผิด', 'Penyelesaian Perkara Pidana', 'Penyelesaian Kesalahan'),
  'Consolidation': p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan'),
  'Fees': p('Phí', 'ค่าธรรมเนียม', 'Biaya', 'Fi'),
  'Prescribed Form': p('Mẫu quy định', 'แบบฟอร์มที่กำหนด', 'Formulir yang Ditetapkan', 'Borang yang Ditetapkan'),
  'Licence Fees': p('Phí giấy phép', 'ค่าธรรมเนียมใบอนุญาต', 'Biaya Lisensi', 'Fi Lesen'),
  'Prescribed Fees': p('Phí theo quy định', 'ค่าธรรมเนียมตามที่กำหนด', 'Biaya yang Ditetapkan', 'Fi yang Ditetapkan'),
  'General': p('Chung', 'ทั่วไป', 'Umum', 'Am'),
  'Appeals': p('Kháng cáo', 'การอุทธรณ์', 'Banding', 'Rayuan'),
  'Prohibition': p('Cấm', 'การห้าม', 'Larangan', 'Larangan'),
  'Incorporation': p('Thành lập pháp nhân', 'การจดทะเบียนเป็นนิติบุคคล', 'Inkorporasi', 'Penginkorporasian'),
  'Penalties': p('Chế tài', 'บทลงโทษ', 'Sanksi', 'Penalti'),
  'Electronic Service': p('Dịch vụ điện tử', 'บริการอิเล็กทรอนิกส์', 'Layanan Elektronik', 'Perkhidmatan Elektronik'),
  'Transitional Provision': p('Quy định chuyển tiếp', 'บทเฉพาะกาล', 'Ketentuan Peralihan', 'Peruntukan Peralihan'),
  'Corporatisation': p('Cổ phần hóa', 'การจัดตั้งเป็นองค์กรมหาชน', 'Korporatisasi', 'Pengkorporatan'),
  'Employment': p('Việc làm', 'การจ้างงาน', 'Ketenagakerjaan', 'Pekerjaan'),
  'Delegation of Powers': p('Phân cấp thẩm quyền', 'การมอบอำนาจ', 'Pelimpahan Wewenang', 'Penguntukan Kuasa'),
  'Registration': p('Đăng ký', 'การจดทะเบียน', 'Pendaftaran', 'Pendaftaran'),
  'Licensing': p('Cấp phép', 'การออกใบอนุญาต', 'Perizinan', 'Pelesenan'),
  'Application': p('Áp dụng', 'การบังคับใช้', 'Penerapan', 'Penggunaan'),
  'Designation': p('Chỉ định', 'การกำหนด', 'Penunjukan', 'Penetapan'),
  'Amendment': p('Sửa đổi', 'การแก้ไข', 'Perubahan', 'Pindaan'),
  'Repeal': p('Bãi bỏ', 'การยกเลิก', 'Pencabutan', 'Pemansuhan'),
  'Revocation': p('Thu hồi', 'การเพิกถอน', 'Pencabutan', 'Pembatalan'),
  'Interpretation': p('Giải thích', 'การตีความ', 'Penafsiran', 'Tafsiran'),
  'Savings': p('Bảo lưu', 'การสงวนสิทธิ', 'Penyimpanan', 'Pemeliharaan'),
  'Class Licence': p('Giấy phép theo nhóm', 'ใบอนุญาตประเภท', 'Lisensi Kelas', 'Lesen Kelas'),
};

// 存量四语 Act 记录里没有的母法：人工译名（只收名称无歧义的）
const parentExtra = {
  'International Organisations': p('Tổ chức quốc tế', 'องค์การระหว่างประเทศ', 'Organisasi Internasional', 'Pertubuhan Antarabangsa'),
  'Criminal Procedure Code': p('Bộ luật Tố tụng hình sự', 'ประมวลกฎหมายวิธีพิจารณาความอาญา', 'Kitab Undang-Undang Hukum Acara Pidana', 'Kanun Prosedur Jenayah'),
  'COVID-19': p('COVID-19', 'โควิด-19', 'COVID-19', 'COVID-19'),
  'Online Safety': p('An toàn trực tuyến', 'ความปลอดภัยออนไลน์', 'Keamanan Daring', 'Keselamatan Dalam Talian'),
  'Consumer Protection': p('Bảo vệ người tiêu dùng', 'การคุ้มครองผู้บริโภค', 'Perlindungan Konsumen', 'Perlindungan Pengguna'),
  'Building Maintenance and Strata Management': p('Bảo trì tòa nhà và quản lý nhà chung cư', 'การบำรุงรักษาอาคารและการจัดการอาคารชุด', 'Pemeliharaan Bangunan dan Pengelolaan Strata', 'Penyelenggaraan Bangunan dan Pengurusan Strata'),
  'Liquor Control': p('Kiểm soát rượu', 'การควบคุมสุรา', 'Pengendalian Minuman Keras', 'Kawalan Minuman Keras'),
  'Maintenance Orders': p('Lệnh cấp dưỡng', 'คำสั่งค่าอุปการะเลี้ยงดู', 'Perintah Nafkah', 'Perintah Nafkah'),
  'Economic Expansion Incentives': p('Ưu đãi mở rộng kinh tế', 'สิ่งจูงใจการขยายตัวทางเศรษฐกิจ', 'Insentif Ekspansi Ekonomi', 'Insentif Pengembangan Ekonomi'),
  'Endangered Species': p('Các loài nguy cấp', 'ชนิดพันธุ์ที่ใกล้สูญพันธุ์', 'Spesies Terancam', 'Spesies Terancam'),
  'Common Gaming Houses': p('Nhà cái cờ bạc công cộng', 'บ่อนการพนันทั่วไป', 'Rumah Judi Umum', 'Rumah Perjudian Awam'),
  'Deposit Insurance': p('Bảo hiểm tiền gửi', 'การประกันเงินฝาก', 'Penjaminan Simpanan', 'Insurans Deposit'),
  'Miscellaneous Offences': p('Các tội nhẹ khác', 'ความผิดเบ็ดเตล็ด', 'Pelanggaran Lain-lain', 'Kesalahan Pelbagai'),
  'Constitution of the Republic of Singapore': p('Hiến pháp Cộng hòa Singapore', 'รัฐธรรมนูญแห่งสาธารณรัฐสิงคโปร์', 'Konstitusi Republik Singapura', 'Perlembagaan Republik Singapura'),
  'Control of Rent': p('Kiểm soát tiền thuê', 'การควบคุมค่าเช่า', 'Pengendalian Sewa', 'Kawalan Sewa'),
  'Corruption, Drug Trafficking and Other Serious Crimes': p('Tham nhũng, buôn bán ma túy và các tội nghiêm trọng khác', 'การทุจริต การค้ายาเสพติด และอาชญากรรมร้ายแรงอื่น ๆ', 'Korupsi, Perdagangan Narkotika dan Kejahatan Serius Lainnya', 'Rasuah, Pengedaran Dadah dan Jenayah Serius Lain'),
  // 修正案法令：母法名带「(Amendment) Act 年份」，体裁词与年份已由拆解器剥离，此处只译名称主体
  'Energy Conservation (Amendment) Act 2026': p('Bảo tồn Năng lượng (Sửa đổi)', 'การอนุรักษ์พลังงาน (แก้ไขเพิ่มเติม)', 'Konservasi Energi (Perubahan)', 'Pemuliharaan Tenaga (Pindaan)'),
  // 遗产税豁免：母法名自带破折号列举项，译文不再重复破折号
  'Estate Duty Exemptions — Asian Dollar Bonds —': p('Miễn trừ thuế di sản — Trái phiếu Đô la châu Á', 'การยกเว้นภาษีมรดก — พันธบัตรดอลลาร์เอเชีย', 'Pembebasan Bea Warisan — Obligasi Dolar Asia', 'Pengecualian Duti Harta Pusaka — Bon Dolar Asia'),
  'Estate Duty Exemptions — Government Bonds and Stocks —': p('Miễn trừ thuế di sản — Trái phiếu và cổ phiếu chính phủ', 'การยกเว้นภาษีมรดก — พันธบัตรและหุ้นรัฐบาล', 'Pembebasan Bea Warisan — Obligasi dan Saham Pemerintah', 'Pengecualian Duti Harta Pusaka — Bon dan Saham Kerajaan'),
  // 第 6 批新增母法（原缺词典）
  'Employment of Foreign Workers': p('Sử dụng lao động nước ngoài', 'การจ้างแรงงานต่างชาติ', 'Penggunaan Pekerja Asing', 'Penggajian Pekerja Asing'),
  'Exchanges': p('Sở giao dịch chứng khoán', 'ตลาดหลักทรัพย์', 'Bursa', 'Bursa'),
  'Factories': p('Nhà máy', 'โรงงาน', 'Pabrik', 'Kilang'),
  'Family Justice Reform Act 2023': p('Cải cách Tư pháp Gia đình', 'การปฏิรูปกระบวนการยุติธรรมครอบครัว', 'Reformasi Keadilan Keluarga', 'Pembaharuan Keadilan Keluarga'),
  'Federal Lands Commissioner, Malaysia': p('Ủy viên Đất đai Liên bang, Malaysia', 'ข้าหลวงที่ดินสหพันธรัฐ มาเลเซีย', 'Komisioner Tanah Federal, Malaysia', 'Pesuruhjaya Tanah Persekutuan, Malaysia'),
  'Foreign Interference': p('Can thiệp nước ngoài', 'การแทรกแซงจากต่างประเทศ', 'Intervensi Asing', 'Campur Tangan Asing'),
  'Foreign National Emblems': p('Quốc huy nước ngoài', 'ตราแผ่นดินต่างประเทศ', 'Lambang Negara Asing', 'Lambang Negara Asing'),
  'Government Hospitals': p('Bệnh viện công lập', 'โรงพยาบาลของรัฐ', 'Rumah Sakit Pemerintah', 'Hospital Kerajaan'),
  'Government Securities': p('Chứng khoán chính phủ', 'หลักทรัพย์รัฐบาล', 'Surat Berharga Pemerintah', 'Sekuriti Kerajaan'),
  // 第 7 批新增母法（原缺词典）
  'Hazardous Waste': p('Chất thải nguy hại', 'ของเสียอันตราย', 'Limbah Bahan Berbahaya', 'Sisa Berbahaya'),
  'Healthcare Services Act 2020': p('Dịch vụ chăm sóc sức khỏe', 'บริการสุขภาพ', 'Layanan Kesehatan', 'Perkhidmatan Penjagaan Kesihatan'),
  'High Court': p('Tòa án Tối cao', 'ศาลสูง', 'Pengadilan Tinggi', 'Mahkamah Tinggi'),
  'Home Affairs Uniformed Services': p('Dịch vụ đồng phục Bộ Nội vụ', 'บริการเครื่องแบบกระทรวงมหาดไทย', 'Layanan Berseragam Dalam Negeri', 'Perkhidmatan Beruniform Hal Ehwal Dalam Negeri'),
  'Housing Developers': p('Chủ đầu tư nhà ở', 'ผู้พัฒนาที่อยู่อาศัย', 'Pengembang Perumahan', 'Pemaju Perumahan'),
  'Hydrogen Cyanide': p('Xyanua hydro', 'ไฮโดรเจนไซยาไนด์', 'Hidrogen Sianida', 'Hidrogen Sianida'),
  'Info-communications Media Development Authority (Amendment) Act 2026': p('Cơ quan phát triển truyền thông và thông tin (Sửa đổi)', 'หน่วยงานพัฒนาสื่อสารสนเทศและสื่อ (แก้ไขเพิ่มเติม)', 'Otoritas Pengembangan Media dan Info-komunikasi (Perubahan)', 'Pihak Berkuasa Pembangunan Media dan Info-komunikasi (Pindaan)'),
  // 第 10 批新增母法（原缺词典）
  'Judicial Committee': p('Ủy ban Tư pháp', 'คณะกรรมการตุลาการ', 'Komite Yudisial', 'Jawatankuasa Kehakiman'),
  'Judicial Proceedings': p('Tố tụng tư pháp', 'กระบวนพิจารณาคดี', 'Proses Peradilan', 'Prosiding Kehakiman'),
  'Judicial Service': p('Dịch vụ Tư pháp', 'บริการตุลาการ', 'Layanan Yudisial', 'Perkhidmatan Kehakiman'),
  'Land Transport and Related Matters Act 2026': p('Giao thông Đường bộ và Các vấn đề Liên quan', 'การขนส่งทางบกและเรื่องที่เกี่ยวข้อง', 'Angkutan Darat dan Hal Terkait', 'Pengangkutan Darat dan Perkara Berkaitan'),
  'Legal Profession Act': p('Nghề luật', 'วิชาชีพกฎหมาย', 'Profesi Hukum', 'Profesion Undang-Undang'),
  'Legal Service': p('Dịch vụ Pháp lý', 'บริการกฎหมาย', 'Layanan Hukum', 'Perkhidmatan Undang-Undang'),
  'Limited Partnerships': p('Hợp danh hữu hạn', 'ห้างหุ้นส่วนจำกัด', 'Persekutuan Komanditer', 'Perkongsian Terhad'),
  'Loans': p('Các khoản vay', 'เงินกู้', 'Pinjaman', 'Pinjaman'),
  'Local Forces': p('Lực lượng địa phương', 'กองกำลังท้องถิ่น', 'Pasukan Lokal', 'Angkatan Tempatan'),
  'Martial Arts Instruction': p('Dạy võ thuật', 'การสอนศิลปะการต่อสู้', 'Pengajaran Seni Bela Diri', 'Pengajaran Seni Mempertahankan Diri'),
  'Medals': p('Huân chương', 'เหรียญ', 'Medali', 'Pingat'),
  'Media Development Authority of Singapore': p('Cơ quan Phát triển Truyền thông Singapore', 'หน่วยงานพัฒนาสื่อสิงคโปร์', 'Otoritas Pengembangan Media Singapura', 'Pihak Berkuasa Pembangunan Media Singapura'),
  'Medical': p('Y học', 'การแพทย์', 'Kedokteran', 'Perubatan'),
  // 第 11 批新增母法（原缺词典）
  'Mental Health': p('Sức khỏe tâm thần', 'สุขภาพจิต', 'Kesehatan Jiwa', 'Kesihatan Mental'),
  'Minister for Finance': p('Bộ trưởng Tài chính', 'รัฐมนตรีว่าการกระทรวงการคลัง', 'Menteri Keuangan', 'Menteri Kewangan'),
  'Motor Vehicles': p('Xe cơ giới', 'ยานยนต์', 'Kendaraan Bermotor', 'Kenderaan Bermotor'),
  'Multi-Level Marketing and Pyramid Selling': p('Tiếp thị đa cấp và bán hàng kim tự tháp', 'การตลาดแบบหลายชั้นและการขายแบบปีระมิด', 'Pemasaran Berjenjang dan Penjualan Piramida', 'Pemasaran Berperingkat dan Jualan Piramid'),
  'Multinational Enterprise': p('Doanh nghiệp đa quốc gia', 'วิสาหกิจข้ามชาติ', 'Perusahaan Multinasional', 'Perusahaan Multinasional'),
  'Multinational Enterprise (Minimum Tax) Act 2024': p('Doanh nghiệp đa quốc gia (Thuế tối thiểu)', 'วิสาหกิจข้ามชาติ (ภาษีขั้นต่ำ)', 'Perusahaan Multinasional (Pajak Minimum)', 'Perusahaan Multinasional (Cukai Minimum)'),
  'Municipal': p('Thành phố', 'เทศบาล', 'Kotamadya', 'Perbandaran'),
  // 第 12 批新增母法（原缺词典）
  'Nanyang Polytechnic Students’ Union and Constituent Bodies': p("Hội sinh viên và các tổ chức thành viên Trường Bách khoa Nanyang", "สหภาพนักศึกษาและองค์กรในสังกัดของวิทยาลัยโปลีเทคนิคนานยาง", "Persatuan Mahasiswa dan Badan Konstituen Politeknik Nanyang", "Kesatuan Pelajar dan Badan Juzuk Politeknik Nanyang"),
  'Nanyang Technological University': p("Đại học Công nghệ Nanyang", "มหาวิทยาลัยเทคโนโลยีนานยาง", "Universitas Teknologi Nanyang", "Universiti Teknologi Nanyang"),
  'Nanyang Technological University Students’ Union and Constituent Bodies': p("Hội sinh viên và các tổ chức thành viên Đại học Công nghệ Nanyang", "สหภาพนักศึกษาและองค์กรในสังกัดของมหาวิทยาลัยเทคโนโลยีนานยาง", "Persatuan Mahasiswa dan Badan Konstituen Universitas Teknologi Nanyang", "Kesatuan Pelajar dan Badan Juzuk Universiti Teknologi Nanyang"),
  'National Council of Social Service (Amendment) Act 2026': p("Hội đồng Dịch vụ Xã hội Quốc gia (Sửa đổi)", "สภาบริการสังคมแห่งชาติ (แก้ไขเพิ่มเติม)", "Dewan Layanan Sosial Nasional (Perubahan)", "Majlis Perkhidmatan Sosial Nasional (Pindaan)"),
  'National Servicemen': p("Quân nhân nghĩa vụ quốc gia", "ทหารกองประจำการ", "Prajurit Wajib Militer", "Prajurit Kerahan"),
  'National University of Singapore': p("Đại học Quốc gia Singapore", "มหาวิทยาลัยแห่งชาติสิงคโปร์", "Universitas Nasional Singapura", "Universiti Nasional Singapura"),
  'National University of Singapore Students’ Union and Constituent Bodies': p("Hội sinh viên và các tổ chức thành viên Đại học Quốc gia Singapore", "สหภาพนักศึกษาและองค์กรในสังกัดของมหาวิทยาลัยแห่งชาติสิงคโปร์", "Persatuan Mahasiswa dan Badan Konstituen Universitas Nasional Singapura", "Kesatuan Pelajar dan Badan Juzuk Universiti Nasional Singapura"),
  'Parliament': p("Quốc hội", "รัฐสภา", "Parlemen", "Parlimen"),
  'Payment and Settlement Systems': p("Hệ thống thanh toán và quyết toán", "ระบบการชำระเงินและการหักบัญชี", "Sistem Pembayaran dan Penyelesaian", "Sistem Pembayaran dan Penyelesaian"),
  'Pingat Bakti Setia': p("Pingat Bakti Setia", "Pingat Bakti Setia", "Pingat Bakti Setia", "Pingat Bakti Setia"),
  'Pingat Berkebolehan (Tentera) —': p("Pingat Berkebolehan (Tentera)", "Pingat Berkebolehan (Tentera)", "Pingat Berkebolehan (Tentera)", "Pingat Berkebolehan (Tentera)"),
  'Pingat Gagah Perkasa (Tentera) —': p("Pingat Gagah Perkasa (Tentera)", "Pingat Gagah Perkasa (Tentera)", "Pingat Gagah Perkasa (Tentera)", "Pingat Gagah Perkasa (Tentera)"),
  'Pingat Jasa Gemilang (Tentera) —': p("Pingat Jasa Gemilang (Tentera)", "Pingat Jasa Gemilang (Tentera)", "Pingat Jasa Gemilang (Tentera)", "Pingat Jasa Gemilang (Tentera)"),
  'Pingat Penghargaan (Tentera) —': p("Pingat Penghargaan (Tentera)", "Pingat Penghargaan (Tentera)", "Pingat Penghargaan (Tentera)", "Pingat Penghargaan (Tentera)"),
  'Pingat Pentadbiran Awam (Tentera) —': p("Pingat Pentadbiran Awam (Tentera)", "Pingat Pentadbiran Awam (Tentera)", "Pingat Pentadbiran Awam (Tentera)", "Pingat Pentadbiran Awam (Tentera)"),
  'Precious Stones and Precious Metals': p("Đá quý và kim loại quý", "อัญมณีและโลหะมีค่า", "Batu Mulia dan Logam Mulia", "Batu Permata dan Logam Berharga"),
  'Public Order and Safety': p("Trật tự và An toàn Công cộng", "ความสงบเรียบร้อยและความปลอดภัยสาธารณะ", "Ketertiban dan Keselamatan Umum", "Ketenteraman dan Keselamatan Awam"),
  'Public Sector': p("Khu vực Công", "ภาครัฐ", "Sektor Publik", "Sektor Awam"),
  'Public Service': p("Dịch vụ Công", "บริการสาธารณะ", "Layanan Publik", "Perkhidmatan Awam"),
  // 第 13 批新增母法（原缺词典）
  'Administration of Justice': p("Quản lý tư pháp", "การบริหารงานยุติธรรม", "Penyelenggaraan Peradilan", "Pentadbiran Keadilan"),
  'Administration of Muslim Law (Amendment) Act 2024': p("Quản lý Luật Hồi giáo (Sửa đổi)", "การบริหารกฎหมายอิสลาม (แก้ไขเพิ่มเติม)", "Penyelenggaraan Hukum Islam (Perubahan)", "Pentadbiran Undang-Undang Islam (Pindaan)"),
  'Appointments of Registrar and Deputy Registrar': p("Bổ nhiệm Cơ quan đăng ký và Phó Cơ quan đăng ký", "การแต่งตั้งนายทะเบียนและรองนายทะเบียน", "Pengangkatan Registrar dan Wakil Registrar", "Pelantikan Pendaftar dan Timbalan Pendaftar"),
  'Approved Finance Companies': p("Công ty tài chính được chấp thuận", "บริษัทการเงินที่ได้รับอนุมัติ", "Perusahaan Pembiayaan yang Disetujui", "Syarikat Kewangan yang Diluluskan"),
  'Approved Qualifications for Veterinary Surgeons': p("Trình độ được chấp thuận cho bác sĩ thú y", "คุณสมบัติที่ได้รับอนุมัติสำหรับสัตวแพทย์", "Kualifikasi yang Disetujui bagi Dokter Hewan", "Kelayakan yang Diluluskan bagi Doktor Veterinar"),
  'Arms and Explosives': p("Vũ khí và vật liệu nổ", "อาวุธและวัตถุระเบิด", "Senjata dan Bahan Peledak", "Senjata dan Bahan Letupan"),
  'Betting': p("Cá cược", "การพนัน", "Taruhan", "Pertaruhan"),
  'Building': p("Xây dựng", "อาคาร", "Bangunan", "Bangunan"),
  'Building Maintenance': p("Bảo trì tòa nhà", "การบำรุงรักษาอาคาร", "Pemeliharaan Bangunan", "Penyelenggaraan Bangunan"),
  'Inheritance': p('Thừa kế', 'มรดก', 'Warisan', 'Pewarisan'),
  'Insolvency, Restructuring and Dissolution Act 2018': p('Mất khả năng thanh toán, Tái cơ cấu và Giải thể', 'การล้มละลาย การปรับโครงสร้าง และการเลิกนิติบุคคล', 'Insolvensi, Restrukturisasi dan Pembubaran', 'Insolvensi, Penstrukturan Semula dan Pembubaran'),
  'Insolvency, Restructuring and Dissolution (Amendment) Act 2023': p('Mất khả năng thanh toán, Tái cơ cấu và Giải thể (Sửa đổi)', 'การล้มละลาย การปรับโครงสร้าง และการเลิกนิติบุคคล (แก้ไขเพิ่มเติม)', 'Insolvensi, Restrukturisasi dan Pembubaran (Perubahan)', 'Insolvensi, Penstrukturan Semula dan Pembubaran (Pindaan)'),
};

// 活跃通勤组单独成模块，合并进同一条词典
Object.assign(mod, require('./_sg_dict_am.js'));
Object.assign(mod, require('./_sg_dict_a.js'));
Object.assign(mod, require('./_sg_dict_b.js'));
Object.assign(mod, require('./_sg_dict_c.js'));
Object.assign(mod, require('./_sg_dict_d.js'));
Object.assign(mod, require('./_sg_dict_e.js'));
Object.assign(mod, require('./_sg_dict_f.js'));
Object.assign(mod, require('./_sg_dict_g.js'));
Object.assign(mod, require('./_sg_dict_h.js'));
Object.assign(mod, require('./_sg_dict_i.js'));
Object.assign(mod, require('./_sg_dict_j.js'));
Object.assign(mod, require('./_sg_dict_k.js'));
Object.assign(mod, require('./_sg_dict_l.js'));
Object.assign(mod, require('./_sg_dict_m.js'));
Object.assign(mod, require('./_sg_dict_n.js'));
Object.assign(parentExtra, require('./_sg_parents_n.js'));

module.exports = { mod, parentExtra, p, NO, CONSOLIDATION };
