'use strict';
// SG 尾段附注事项译名：第 6 批（E–G 段，121 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

// 部委名（Fees 族括注全是部委）
const MIN = {
  'Ministry of Defence': p('Bộ Quốc phòng', 'กระทรวงกลาโหม', 'Kementerian Pertahanan', 'Kementerian Pertahanan'),
  'Ministry of Education': p('Bộ Giáo dục', 'กระทรวงศึกษาธิการ', 'Kementerian Pendidikan', 'Kementerian Pendidikan'),
  'Ministry of Health': p('Bộ Y tế', 'กระทรวงสาธารณสุข', 'Kementerian Kesehatan', 'Kementerian Kesihatan'),
  'Ministry of Home Affairs': p('Bộ Nội vụ', 'กระทรวงมหาดไทย', 'Kementerian Dalam Negeri', 'Kementerian Dalam Negeri'),
  'Ministry of Law': p('Bộ Pháp luật', 'กระทรวงกฎหมาย', 'Kementerian Hukum', 'Kementerian Undang-Undang'),
  'Ministry of Manpower': p('Bộ Nhân lực', 'กระทรวงแรงงาน', 'Kementerian Tenaga Kerja', 'Kementerian Tenaga Manusia'),
  'Ministry of Social and Family Development': p('Bộ Phát triển Xã hội và Gia đình', 'กระทรวงการพัฒนาสังคมและครอบครัว', 'Kementerian Pembangunan Sosial dan Keluarga', 'Kementerian Pembangunan Sosial dan Keluarga'),
  'Ministry of the Environment': p('Bộ Môi trường', 'กระทรวงสิ่งแวดล้อม', 'Kementerian Lingkungan Hidup', 'Kementerian Alam Sekitar'),
};

const mod = Object.assign({}, MIN, {
  // ── Employment of Foreign Workers（1） ──────────────────────────
  'Fees': p('Lệ phí', 'ค่าธรรมเนียม', 'Biaya', 'Fi'),

  // ── Evidence（1） ──────────────────────────────────────────────
  'Restrictions on Questions and Evidence in Criminal Proceedings': p('Hạn chế về câu hỏi và chứng cứ trong tố tụng hình sự', 'ข้อจำกัดเกี่ยวกับคำถามและพยานหลักฐานในกระบวนการพิจารณาความอาญา', 'Pembatasan Pertanyaan dan Bukti dalam Perkara Pidana', 'Sekatan Pertanyaan dan Keterangan dalam Prosiding Jenayah'),

  // ── Exchanges（3） ─────────────────────────────────────────────
  'Designated Companies': p('Công ty được chỉ định', 'บริษัทที่กำหนด', 'Perusahaan yang Ditetapkan', 'Syarikat yang Ditetapkan'),
  'Value of Transferee Holding Company’s Shares': p('Giá trị cổ phần của công ty cổ phần nhận chuyển nhượng', 'มูลค่าหุ้นของบริษัทโฮลดิ้งผู้รับโอน', 'Nilai Saham Perusahaan Induk Penerima Pengalihan', 'Nilai Saham Syarikat Pegangan Penerima Pindahan'),

  // ── Extradition（8） ────────────────────────────────────────────
  'Hong Kong Special Administrative Region of the People’s Republic of China': p('Khu Hành chính Đặc biệt Hồng Kông thuộc Cộng hòa Nhân dân Trung Hoa', 'เขตบริหารพิเศษฮ่องกงแห่งสาธารณรัฐประชาชนจีน', 'Daerah Administratif Khusus Hong Kong Republik Rakyat Tiongkok', 'Wilayah Pentadbiran Khas Hong Kong Republik Rakyat China'),
  'International Convention against Taking of Hostages': p('Công ước quốc tế về chống bắt cóc con tin', 'อนุสัญญาระหว่างประเทศว่าด้วยการต่อต้านการจับตัวประกัน', 'Konvensi Internasional tentang Pemberantasan Penculikan Sandera', 'Konvensyen Antarabangsa menentang Penculikan Tebusan'),
  'International Convention for Suppression of Terrorist Bombings': p('Công ước quốc tế về trấn áp các vụ đánh bom khủng bố', 'อนุสัญญาระหว่างประเทศว่าด้วยการปราบปรามการก่อการร้ายด้วยระเบิด', 'Konvensi Internasional tentang Pemberantasan Pengeboman Teroris', 'Konvensyen Antarabangsa bagi Penindasan Pengeboman Pengganas'),
  'International Convention for the Suppression of Acts of Nuclear Terrorism': p('Công ước quốc tế về trấn áp hành vi khủng bố hạt nhân', 'อนุสัญญาระหว่างประเทศว่าด้วยการปราบปรามการกระทำการก่อการร้ายทางนิวเคลียร์', 'Konvensi Internasional tentang Pemberantasan Tindakan Terorisme Nuklir', 'Konvensyen Antarabangsa bagi Penindasan Perbuatan Keganasan Nuklear'),
  'International Convention for the Suppression of the Financing of Terrorism': p('Công ước quốc tế về trấn áp việc tài trợ cho khủng bố', 'อนุสัญญาระหว่างประเทศว่าด้วยการปราบปรามการสนับสนุนทางการเงินแก่การก่อการร้าย', 'Konvensi Internasional tentang Pemberantasan Pendanaan Terorisme', 'Konvensyen Antarabangsa bagi Penindasan Pembiayaan Keganasan'),
  'Republic of Indonesia': p('Cộng hòa Indonesia', 'สาธารณรัฐอินโดนีเซีย', 'Republik Indonesia', 'Republik Indonesia'),
  'Republic of Korea': p('Đại Hàn Dân Quốc', 'สาธารณรัฐเกาหลี', 'Republik Korea', 'Republik Korea'),
  'United Nations Convention against Transnational Organised Crime': p('Công ước Liên Hợp Quốc về chống tội phạm có tổ chức xuyên quốc gia', 'อนุสัญญาสหประชาชาติว่าด้วยการต่อต้านอาชญากรรมข้ามชาติที่จัดตั้งในลักษณะองค์กร', 'Konvensi Perserikatan Bangsa-Bangsa menentang Kejahatan Terorganisasi Transnasional', 'Konvensyen Pertubuhan Bangsa-Bangsa Bersatu menentang Jenayah Terancang Merentas Sempadan'),

  // ── Factories（3） ─────────────────────────────────────────────
  'Registration and Other Services — Fees and Forms': p('Đăng ký và các dịch vụ khác — Lệ phí và biểu mẫu', 'การขึ้นทะเบียนและบริการอื่น ๆ — ค่าธรรมเนียมและแบบฟอร์ม', 'Pendaftaran dan Layanan Lain — Biaya dan Formulir', 'Pendaftaran dan Perkhidmatan Lain — Fi dan Borang'),
  'Safety Training Courses': p('Khóa huấn luyện an toàn', 'หลักสูตรฝึกอบรมความปลอดภัย', 'Kursus Pelatihan Keselamatan', 'Kursus Latihan Keselamatan'),
  'Work of Engineering Construction': p('Công việc xây dựng kỹ thuật', 'งานก่อสร้างทางวิศวกรรม', 'Pekerjaan Konstruksi Teknik', 'Kerja Pembinaan Kejuruteraan'),

  // ── Family Justice（5） ─────────────────────────────────────────
  'Family Proceedings before Family Division of High Court': p('Tố tụng gia đình tại Phòng Gia đình của Tòa án Tối cao', 'คดีครอบครัวต่อแผนกคดีครอบครัวของศาลสูง', 'Perkara Keluarga di Divisi Keluarga Pengadilan Tinggi', 'Prosiding Keluarga di Bahagian Keluarga Mahkamah Tinggi'),
  'Probate and Other Matters': p('Thủ tục di sản và các vấn đề khác', 'การจัดการมรดกและเรื่องอื่น ๆ', 'Probate dan Hal Lain', 'Probate dan Perkara Lain'),
  'Protection from Harassment': p('Bảo vệ khỏi quấy rối', 'การคุ้มครองจากการคุกคาม', 'Perlindungan dari Perundungan', 'Perlindungan daripada Gangguan'),
  'Seals of the Family Justice Courts': p('Ấn triện của Tòa án Tư pháp Gia đình', 'ตราประทับของศาลยุติธรรมครอบครัว', 'Segel Pengadilan Keadilan Keluarga', 'Mohor Mahkamah Keadilan Keluarga'),
  'Specified Date for Probate Proceedings': p('Ngày được chỉ định cho thủ tục di sản', 'วันที่กำหนดสำหรับกระบวนการจัดการมรดก', 'Tanggal Tertentu untuk Perkara Probate', 'Tarikh Tertentu bagi Prosiding Probate'),

  // ── Family Justice Reform Act 2023（1） ─────────────────────────
  'Cessation of Application of Section 45(13)': p('Chấm dứt áp dụng Điều 45(13)', 'การสิ้นสุดการใช้บังคับมาตรา 45(13)', 'Berakhirnya Pemberlakuan Pasal 45(13)', 'Pemberhentian Penggunaan Seksyen 45(13)'),

  // ── Federal Lands Commissioner, Malaysia（1） ───────────────────
  'Incorporation': p('Thành lập pháp nhân', 'การจัดตั้งเป็นนิติบุคคล', 'Pendirian Badan Hukum', 'Penubuhan Perbadanan'),

  // ── Feeding Stuffs（1） ─────────────────────────────────────────
  'Licensing, Analysis and Fees': p('Cấp phép, phân tích và lệ phí', 'การออกใบอนุญาต การวิเคราะห์ และค่าธรรมเนียม', 'Perizinan, Analisis dan Biaya', 'Pelesenan, Analisis dan Fi'),

  // ── Fees（25） ─────────────────────────────────────────────────
  'Estate Duty': p('Thuế di sản thừa kế', 'อากรที่ดินและมรดก', 'Bea Warisan', 'Duti Harta Pusaka'),
  'Goods and Services Tax': p('Thuế hàng hóa và dịch vụ', 'ภาษีสินค้าและบริการ', 'Pajak Barang dan Jasa', 'Cukai Barang dan Perkhidmatan'),
  'Income Tax': p('Thuế thu nhập', 'ภาษีเงินได้', 'Pajak Penghasilan', 'Cukai Pendapatan'),
  'Government Columbaria': p('Nhà lưu tro cốt công lập', 'ที่เก็บอัฐิของรัฐ', 'Kolumbarium Pemerintah', 'Kolumbarium Kerajaan'),
  'Immigration & Checkpoints Authority — Supply of Copies of Reports and Statements': p('Cục Xuất nhập cảnh và Cửa khẩu — Cung cấp bản sao báo cáo và lời khai', 'สำนักงานตรวจคนเข้าเมืองและด่านตรวจคนเข้าเมือง — การจัดส่งสำเนารายงานและถ้อยคำ', 'Lembaga Imigrasi dan Pos Pemeriksaan — Penyediaan Salinan Laporan dan Keterangan', 'Lembaga Imigresen dan Pusat Pemeriksaan — Pembekalan Salinan Laporan dan Perakuan'),
  'Payment by Revenue Stamps': p('Thanh toán bằng tem thuế', 'การชำระด้วยแสตมป์อากร', 'Pembayaran dengan Meterai Bea', 'Pembayaran dengan Setem Hasil'),
  'Police Services': p('Dịch vụ cảnh sát', 'บริการตำรวจ', 'Layanan Kepolisian', 'Perkhidmatan Polis'),
  'Private Lotteries': p('Xổ số tư nhân', 'สลากส่วนบุคคล', 'Lotere Swasta', 'Loteri Persendirian'),
  'Property Tax': p('Thuế tài sản', 'ภาษีทรัพย์สิน', 'Pajak Properti', 'Cukai Harta'),
  'Recording of Fingerprint Impressions': p('Ghi nhận dấu vân tay', 'การบันทึกรอยพิมพ์นิ้วมือ', 'Perekaman Sidik Jari', 'Perekodan Cap Jari'),
  'Registrar of Criminals': p('Cơ quan đăng ký tội phạm', 'นายทะเบียนอาชญากร', 'Registrar Pelaku Kejahatan', 'Pendaftar Penjenayah'),
  'Remission of Public Trustee Fees': p('Giảm lệ phí của Quản thủ công', 'การลดหย่อนค่าธรรมเนียมผู้จัดการมรดกของรัฐ', 'Keringanan Biaya Wali Amanat Publik', 'Pelepasan Fi Pemegang Amanah Awam'),
  'Singapore Civil Defence Force': p('Lực lượng Phòng vệ Dân sự Singapore', 'กองกำลังป้องกันพลเรือนสิงคโปร์', 'Pasukan Pertahanan Sipil Singapura', 'Pasukan Pertahanan Awam Singapura'),
  'State Courts — Criminal Jurisdiction': p('Tòa án cấp bang — Thẩm quyền hình sự', 'ศาลชั้นต้น — เขตอำนาจทางอาญา', 'Pengadilan Negara — Yurisdiksi Pidana', 'Mahkamah Rendah — Bidang Kuasa Jenayah'),
  'Statistics': p('Thống kê', 'สถิติ', 'Statistik', 'Statistik'),
  'Testing of Private Security Dog Handlers': p('Kiểm tra người huấn luyện chó nghiệp vụ an ninh tư nhân', 'การทดสอบผู้ควบคุมสุนัขรักษาความปลอดภัยเอกชน', 'Pengujian Penangan Anjing Keamanan Swasta', 'Pengujian Pengendali Anjing Keselamatan Swasta'),
  'Translation of Documents — Ministry of Manpower': p('Dịch tài liệu — Bộ Nhân lực', 'การแปลเอกสาร — กระทรวงแรงงาน', 'Penerjemahan Dokumen — Kementerian Tenaga Kerja', 'Terjemahan Dokumen — Kementerian Tenaga Manusia'),
  'Winding up, Restructuring and Dissolution of Companies and Other Bodies': p('Giải thể, tái cơ cấu và thanh lý công ty và các tổ chức khác', 'การชำระบัญชี การปรับโครงสร้าง และการเลิกนิติบุคคลของบริษัทและองค์กรอื่น', 'Likuidasi, Restrukturisasi dan Pembubaran Perusahaan dan Badan Lain', 'Penggulungan, Penstrukturan Semula dan Pembubaran Syarikat dan Badan Lain'),

  // ── Films（6） ─────────────────────────────────────────────────
  'Film Content Assessor — Exempt Films': p('Người thẩm định nội dung phim — Phim được miễn trừ', 'ผู้ประเมินเนื้อหาภาพยนตร์ — ภาพยนตร์ที่ได้รับการยกเว้น', 'Penilai Konten Film — Film yang Dikecualikan', 'Penilai Kandungan Filem — Filem yang Dikecualikan'),
  'Film Content Assessor': p('Người thẩm định nội dung phim', 'ผู้ประเมินเนื้อหาภาพยนตร์', 'Penilai Konten Film', 'Penilai Kandungan Filem'),
  'Licence — Exemption': p('Giấy phép — Miễn trừ', 'ใบอนุญาต — การยกเว้น', 'Izin — Pembebasan', 'Lesen — Pengecualian'),
  'Presidential Election Campaign Recordings — Exemption': p('Bản ghi chiến dịch bầu cử tổng thống — Miễn trừ', 'การบันทึกการรณรงค์หาเสียงเลือกตั้งประธานาธิบดี — การยกเว้น', 'Rekaman Kampanye Pemilihan Presiden — Pembebasan', 'Rakaman Kempen Pilihan Raya Presiden — Pengecualian'),
  'Prohibited Film': p('Phim bị cấm', 'ภาพยนตร์ที่ต้องห้าม', 'Film Terlarang', 'Filem Larangan'),

  // ── Finance Companies（3） ─────────────────────────────────────
  'Exemption from section 25(2)': p('Miễn trừ theo Điều 25(2)', 'การยกเว้นตามมาตรา 25(2)', 'Pembebasan Pasal 25(2)', 'Pengecualian Seksyen 25(2)'),
  'Exemption from sections 23(1) and 25(2)': p('Miễn trừ theo các Điều 23(1) và 25(2)', 'การยกเว้นตามมาตรา 23(1) และ 25(2)', 'Pembebasan Pasal 23(1) dan 25(2)', 'Pengecualian Seksyen 23(1) dan 25(2)'),
  'Maintenance of Reserves': p('Duy trì dự trữ', 'การดำรงเงินสำรอง', 'Pemeliharaan Cadangan', 'Penyelenggaraan Rizab'),

  // ── Financial Advisers（7） ────────────────────────────────────
  'Exemption for Cross-Border Arrangements': p('Miễn trừ cho thỏa thuận xuyên biên giới', 'การยกเว้นสำหรับข้อตกลงข้ามพรมแดน', 'Pembebasan bagi Pengaturan Lintas Batas', 'Pengecualian bagi Pengaturan Rentas Sempadan'),
  'Foreign Offices': p('Văn phòng nước ngoài', 'สำนักงานต่างประเทศ', 'Kantor Luar Negeri', 'Pejabat Luar Negara'),
  'Foreign Related Corporations': p('Công ty liên kết nước ngoài', 'บริษัทในเครือต่างประเทศ', 'Korporasi Terkait Asing', 'Perbadanan Berkaitan Asing'),
  'Exemption from Requirement to Hold Financial Adviser’s Licence': p('Miễn trừ yêu cầu phải có giấy phép tư vấn tài chính', 'การยกเว้นจากข้อกำหนดในการถือใบอนุญาตที่ปรึกษาทางการเงิน', 'Pembebasan dari Persyaratan Memegang Izin Penasihat Keuangan', 'Pengecualian daripada Keperluan Memegang Lesen Penasihat Kewangan'),
  'Exemption from Sections 25 to 29 and 36': p('Miễn trừ theo các Điều 25 đến 29 và Điều 36', 'การยกเว้นตามมาตรา 25 ถึง 29 และมาตรา 36', 'Pembebasan Pasal 25 sampai 29 dan Pasal 36', 'Pengecualian Seksyen 25 hingga 29 dan Seksyen 36'),
  'Insurance Broking Premium Accounts': p('Tài khoản phí bảo hiểm môi giới', 'บัญชีเบี้ยประกันภัยนายหน้า', 'Akun Premi Pialang Asuransi', 'Akaun Premium Broker Insurans'),
  'Transitional and Savings Provisions': p('Quy định chuyển tiếp và bảo lưu', 'บทบัญญัติเฉพาะกาลและการสงวนสิทธิ', 'Ketentuan Peralihan dan Penyimpanan Hak', 'Peruntukan Peralihan dan Pemeliharaan'),
  'Remuneration': p('Thù lao', 'ค่าตอบแทน', 'Remunerasi', 'Ganjaran'),
  'Structured Deposits — Prescribed Investment Product and Exemption': p('Tiền gửi có cấu trúc — Sản phẩm đầu tư theo quy định và miễn trừ', 'เงินฝากแบบมีโครงสร้าง — ผลิตภัณฑ์การลงทุนตามที่กำหนดและการยกเว้น', 'Deposito Terstruktur — Produk Investasi yang Ditetapkan dan Pembebasan', 'Deposit Berstruktur — Produk Pelaburan yang Ditetapkan dan Pengecualian'),

  // ── Financial Holding Companies（1） ───────────────────────────
  'Withdrawal of Designation': p('Thu hồi chỉ định', 'การถอนการกำหนด', 'Pencabutan Penetapan', 'Penarikan Balik Penetapan'),

  // ── Financial Services and Markets（12） ───────────────────────
  'Information Sharing Scheme for Prescribed Financial Institutions': p('Chương trình chia sẻ thông tin cho tổ chức tài chính theo quy định', 'โครงการแบ่งปันข้อมูลสำหรับสถาบันการเงินตามที่กำหนด', 'Skema Berbagi Informasi bagi Lembaga Keuangan yang Ditetapkan', 'Skim Perkongsian Maklumat bagi Institusi Kewangan yang Ditetapkan'),
  'Opportunity to be Heard': p('Quyền được lắng nghe', 'โอกาสในการชี้แจง', 'Kesempatan untuk Didengar', 'Peluang untuk Didengar'),
  'Prescribed Financial Institutions under Section 49': p('Tổ chức tài chính theo quy định tại Điều 49', 'สถาบันการเงินตามที่กำหนดภายใต้มาตรา 49', 'Lembaga Keuangan yang Ditetapkan menurut Pasal 49', 'Institusi Kewangan yang Ditetapkan di bawah Seksyen 49'),
  'Resolution of Financial Institutions': p('Xử lý tổ chức tài chính', 'การแก้ไขสถาบันการเงิน', 'Resolusi Lembaga Keuangan', 'Resolusi Institusi Kewangan'),
  'Democratic Republic of the Congo': p('Cộng hòa Dân chủ Congo', 'สาธารณรัฐประชาธิปไตยคองโก', 'Republik Demokratik Kongo', 'Republik Demokratik Congo'),
  'South Sudan': p('Nam Sudan', 'ซูดานใต้', 'Sudan Selatan', 'Sudan Selatan'),
  'Sudan': p('Sudan', 'ซูดาน', 'Sudan', 'Sudan'),
  'Yemen': p('Yemen', 'เยเมน', 'Yaman', 'Yaman'),
  'Democratic People’s Republic of Korea': p('Cộng hòa Dân chủ Nhân dân Triều Tiên', 'สาธารณรัฐประชาธิปไตยประชาชนเกาหลี', 'Republik Demokratik Rakyat Korea', 'Republik Demokratik Rakyat Korea'),
  'Iran': p('Iran', 'อิหร่าน', 'Iran', 'Iran'),
  'Libya': p('Libya', 'ลิเบีย', 'Libya', 'Libya'),
  'Somalia': p('Somalia', 'โซมาเลีย', 'Somalia', 'Somalia'),

  // ── Fire Safety（5） ───────────────────────────────────────────
  'Temporary Buildings in Construction Sites': p('Công trình tạm tại công trường', 'อาคารชั่วคราวในสถานที่ก่อสร้าง', 'Bangunan Sementara di Lokasi Konstruksi', 'Bangunan Sementara di Tapak Pembinaan'),
  'Fire Certificate — Designated Buildings': p('Giấy chứng nhận phòng cháy — Tòa nhà được chỉ định', 'หนังสือรับรองการป้องกันอัคคีภัย — อาคารที่กำหนด', 'Sertifikat Kebakaran — Bangunan yang Ditetapkan', 'Sijil Kebakaran — Bangunan yang Ditetapkan'),
  'Code of Professional Conduct and Ethics': p('Quy tắc ứng xử và đạo đức nghề nghiệp', 'จรรยาบรรณและจริยธรรมวิชาชีพ', 'Kode Etik dan Perilaku Profesional', 'Kod Kelakuan dan Etika Profesional'),
  'Fire Safety Engineers': p('Kỹ sư an toàn phòng cháy', 'วิศวกรความปลอดภัยด้านอัคคีภัย', 'Insinyur Keselamatan Kebakaran', 'Jurutera Keselamatan Kebakaran'),
  'Fire Safety Managers': p('Quản lý an toàn phòng cháy', 'ผู้จัดการความปลอดภัยด้านอัคคีภัย', 'Manajer Keselamatan Kebakaran', 'Pengurus Keselamatan Kebakaran'),

  // ── Foreign Interference / Foreign National Emblems（2） ────────
  'Countermeasures': p('Biện pháp đối phó', 'มาตรการตอบโต้', 'Tindakan Penangkalan', 'Langkah Menangani'),
  'Control of Display': p('Kiểm soát việc trưng bày', 'การควบคุมการจัดแสดง', 'Pengendalian Penampilan', 'Kawalan Pemaparan'),

  // ── Geographical Indications（1） ──────────────────────────────
  'Prescribed Goods under Section 10': p('Hàng hóa theo quy định tại Điều 10', 'สินค้าตามที่กำหนดภายใต้มาตรา 10', 'Barang yang Ditetapkan menurut Pasal 10', 'Barang yang Ditetapkan di bawah Seksyen 10'),

  // ── Goods and Services Tax（7） ────────────────────────────────
  'Excluded Transactions': p('Giao dịch bị loại trừ', 'ธุรกรรมที่ได้รับการยกเว้น', 'Transaksi yang Dikecualikan', 'Transaksi yang Dikecualikan'),
  'Imports Relief': p('Miễn giảm đối với hàng nhập khẩu', 'การลดหย่อนสำหรับการนำเข้า', 'Keringanan Impor', 'Pelepasan Import'),
  'International Arrangements Relief': p('Miễn giảm theo thỏa thuận quốc tế', 'การลดหย่อนตามข้อตกลงระหว่างประเทศ', 'Keringanan menurut Pengaturan Internasional', 'Pelepasan menurut Pengaturan Antarabangsa'),
  'International Services': p('Dịch vụ quốc tế', 'บริการระหว่างประเทศ', 'Jasa Internasional', 'Perkhidmatan Antarabangsa'),
  'Mode of Payment for Refunds': p('Phương thức hoàn trả', 'วิธีการคืนเงิน', 'Cara Pembayaran Pengembalian', 'Cara Pembayaran Bayaran Balik'),
  'Non-taxable Public Agency Supplies': p('Cung ứng của cơ quan công quyền không chịu thuế', 'การจัดหาของหน่วยงานรัฐที่ไม่ต้องเสียภาษี', 'Pasokan Badan Publik yang Tidak Kena Pajak', 'Bekalan Agensi Awam yang Tidak Bercukai'),
  'Prescribed Information': p('Thông tin theo quy định', 'ข้อมูลตามที่กำหนด', 'Informasi yang Ditetapkan', 'Maklumat yang Ditetapkan'),

  // ── Government Hospitals（2） ─────────────────────────────────
  'Delegation of Powers — Ministry of Health': p('Ủy quyền — Bộ Y tế', 'การมอบอำนาจ — กระทรวงสาธารณสุข', 'Pelimpahan Wewenang — Kementerian Kesehatan', 'Penguntukan Kuasa — Kementerian Kesihatan'),

  // ── Government Securities（3） ────────────────────────────────
  'Debt Market and Investment': p('Thị trường nợ và đầu tư', 'ตลาดตราสารหนี้และการลงทุน', 'Pasar Utang dan Investasi', 'Pasaran Hutang dan Pelaburan'),
  'Financial Penalty': p('Phạt tiền', 'ค่าปรับทางการเงิน', 'Sanksi Finansial', 'Penalti Kewangan'),

  // ── Guns, Explosives and Weapons Control（23） ─────────────────
  'Explosive Precursor Disposal — Class Licence': p('Xử lý tiền chất nổ — Giấy phép theo nhóm', 'การกำจัดสารตั้งต้นวัตถุระเบิด — ใบอนุญาตประเภทกลุ่ม', 'Pembuangan Prekursor Bahan Peledak — Izin Kelas', 'Pelupusan Prekursor Bahan Letupan — Lesen Kelas'),
  'Explosives and Explosive Precursors': p('Vật liệu nổ và tiền chất nổ', 'วัตถุระเบิดและสารตั้งต้นวัตถุระเบิด', 'Bahan Peledak dan Prekursor Bahan Peledak', 'Bahan Letupan dan Prekursor Bahan Letupan'),
  'Explosives — Exemption': p('Vật liệu nổ — Miễn trừ', 'วัตถุระเบิด — การยกเว้น', 'Bahan Peledak — Pembebasan', 'Bahan Letupan — Pengecualian'),
  'General Matters': p('Các vấn đề chung', 'เรื่องทั่วไป', 'Hal Umum', 'Perkara Am'),
  'Gun Disposal — Class Licence': p('Xử lý súng — Giấy phép theo nhóm', 'การกำจัดอาวุธปืน — ใบอนุญาตประเภทกลุ่ม', 'Pembuangan Senjata Api — Izin Kelas', 'Pelupusan Senjata Api — Lesen Kelas'),
  'Guns': p('Súng', 'อาวุธปืน', 'Senjata Api', 'Senjata Api'),
  'Manufacture, Trading, Supply, Carriage and Disposal of Type 2 Weapons — Class Licence': p('Sản xuất, mua bán, cung cấp, vận chuyển và xử lý vũ khí loại 2 — Giấy phép theo nhóm', 'การผลิต การค้า การจัดหา การขนส่ง และการกำจัดอาวุธประเภท 2 — ใบอนุญาตประเภทกลุ่ม', 'Pembuatan, Perdagangan, Pasokan, Pengangkutan dan Pembuangan Senjata Tipe 2 — Izin Kelas', 'Pembuatan, Perdagangan, Pembekalan, Pengangkutan dan Pelupusan Senjata Jenis 2 — Lesen Kelas'),
  'Maritime Industry — Exemption': p('Ngành hàng hải — Miễn trừ', 'อุตสาหกรรมทางทะเล — การยกเว้น', 'Industri Maritim — Pembebasan', 'Industri Maritim — Pengecualian'),
  'Ornamental Use — Class Licence': p('Sử dụng làm đồ trang trí — Giấy phép theo nhóm', 'การใช้เป็นเครื่องประดับ — ใบอนุญาตประเภทกลุ่ม', 'Penggunaan sebagai Ornamen — Izin Kelas', 'Penggunaan sebagai Hiasan — Lesen Kelas'),
  'Religious Use of Weapons — Class Licence': p('Sử dụng vũ khí cho mục đích tôn giáo — Giấy phép theo nhóm', 'การใช้อาวุธเพื่อวัตถุประสงค์ทางศาสนา — ใบอนุญาตประเภทกลุ่ม', 'Penggunaan Senjata untuk Keperluan Keagamaan — Izin Kelas', 'Penggunaan Senjata untuk Tujuan Keagamaan — Lesen Kelas'),
  'School Uniformed Corps — Exemption': p('Đoàn thể đồng phục học đường — Miễn trừ', 'กองกำลังนักเรียนในเครื่องแบบ — การยกเว้น', 'Korps Berseragam Sekolah — Pembebasan', 'Kor Keseragaman Sekolah — Pengecualian'),
  'School Use — Class Licence': p('Sử dụng trong trường học — Giấy phép theo nhóm', 'การใช้ในโรงเรียน — ใบอนุญาตประเภทกลุ่ม', 'Penggunaan di Sekolah — Izin Kelas', 'Penggunaan di Sekolah — Lesen Kelas'),
  'Security Clearance': p('Kiểm tra an ninh', 'การตรวจสอบความปลอดภัย', 'Kelayakan Keamanan', 'Pelepasan Keselamatan'),
  'Shooting and Paintball Ranges': p('Trường bắn và sân bắn sơn', 'สนามยิงปืนและสนามเพนต์บอล', 'Lapangan Tembak dan Lapangan Paintball', 'Padang Menembak dan Padang Paintball'),
  'Special Workers of Licensees — Class Licence': p('Nhân viên đặc biệt của chủ giấy phép — Giấy phép theo nhóm', 'เจ้าหน้าที่พิเศษของผู้ถือใบอนุญาต — ใบอนุญาตประเภทกลุ่ม', 'Pekerja Khusus Pemegang Izin — Izin Kelas', 'Pekerja Khas Pemegang Lesen — Lesen Kelas'),
  'Sporting or Recreational Use — Class Licence': p('Sử dụng cho thể thao hoặc giải trí — Giấy phép theo nhóm', 'การใช้เพื่อการกีฬาหรือนันทนาการ — ใบอนุญาตประเภทกลุ่ม', 'Penggunaan untuk Olahraga atau Rekreasi — Izin Kelas', 'Penggunaan untuk Sukan atau Rekreasi — Lesen Kelas'),
  'Temporary Exemption': p('Miễn trừ tạm thời', 'การยกเว้นชั่วคราว', 'Pembebasan Sementara', 'Pengecualian Sementara'),
  'Theatrical Use — Class Licence': p('Sử dụng trong biểu diễn sân khấu — Giấy phép theo nhóm', 'การใช้ในการแสดงละคร — ใบอนุญาตประเภทกลุ่ม', 'Penggunaan untuk Pertunjukan Teater — Izin Kelas', 'Penggunaan untuk Persembahan Teater — Lesen Kelas'),
  'Transporting Explosive Precursors — Class Licence': p('Vận chuyển tiền chất nổ — Giấy phép theo nhóm', 'การขนส่งสารตั้งต้นวัตถุระเบิด — ใบอนุญาตประเภทกลุ่ม', 'Pengangkutan Prekursor Bahan Peledak — Izin Kelas', 'Pengangkutan Prekursor Bahan Letupan — Lesen Kelas'),
  'Transporting for Animal Management — Class Licence': p('Vận chuyển phục vụ quản lý động vật — Giấy phép theo nhóm', 'การขนส่งเพื่อการจัดการสัตว์ — ใบอนุญาตประเภทกลุ่ม', 'Pengangkutan untuk Pengelolaan Hewan — Izin Kelas', 'Pengangkutan untuk Pengurusan Haiwan — Lesen Kelas'),
  'Transporting Lower-risk Explosives — Class Licence': p('Vận chuyển vật liệu nổ có rủi ro thấp — Giấy phép theo nhóm', 'การขนส่งวัตถุระเบิดที่มีความเสี่ยงต่ำ — ใบอนุญาตประเภทกลุ่ม', 'Pengangkutan Bahan Peledak Berisiko Rendah — Izin Kelas', 'Pengangkutan Bahan Letupan Berisiko Rendah — Lesen Kelas'),
  'Type 3 Weapons — Exemption': p('Vũ khí loại 3 — Miễn trừ', 'อาวุธประเภท 3 — การยกเว้น', 'Senjata Tipe 3 — Pembebasan', 'Senjata Jenis 3 — Pengecualian'),
  'Weapons and Noxious Substances': p('Vũ khí và chất độc hại', 'อาวุธและสารอันตราย', 'Senjata dan Zat Berbahaya', 'Senjata dan Bahan Berbahaya'),
});

// 金服法冻结/制裁条款：国名与动作同处一层括号，需拼成整串键
const FSC = {
  'Democratic Republic of the Congo': p('Cộng hòa Dân chủ Congo', 'สาธารณรัฐประชาธิปไตยคองโก', 'Republik Demokratik Kongo', 'Republik Demokratik Congo'),
  'South Sudan': p('Nam Sudan', 'ซูดานใต้', 'Sudan Selatan', 'Sudan Selatan'),
  'Sudan': p('Sudan', 'ซูดาน', 'Sudan', 'Sudan'),
  'Yemen': p('Yemen', 'เยเมน', 'Yaman', 'Yaman'),
  'Democratic People’s Republic of Korea': p('Cộng hòa Dân chủ Nhân dân Triều Tiên', 'สาธารณรัฐประชาธิปไตยประชาชนเกาหลี', 'Republik Demokratik Rakyat Korea', 'Republik Demokratik Rakyat Korea'),
  'Iran': p('Iran', 'อิหร่าน', 'Iran', 'Iran'),
  'Libya': p('Libya', 'ลิเบีย', 'Libya', 'Libya'),
  'Somalia': p('Somalia', 'โซมาเลีย', 'Somalia', 'Somalia'),
};
const FREEZE = p('Phong tỏa tài sản của cá nhân', 'การอายัดทรัพย์สินของบุคคล', 'Pembekuan Aset Orang', 'Pembekuan Aset Orang');
const SANCTION = p('Trừng phạt và phong tỏa tài sản của cá nhân', 'การลงโทษและการอายัดทรัพย์สินของบุคคล', 'Sanksi dan Pembekuan Aset Orang', 'Sanksi dan Pembekuan Aset Orang');
for (const [cname, c] of Object.entries(FSC)) {
  const join = (head) => p(head.vi + ' — ' + c.vi, head.th + ' — ' + c.th, head.id + ' — ' + c.id, head.ms + ' — ' + c.ms);
  mod['Freezing of Assets of Persons — ' + cname] = join(FREEZE);
  mod['Sanctions and Freezing of Assets of Persons — ' + cname] = join(SANCTION);
}

module.exports = mod;
