'use strict';
// SG 尾段附注事项译名：第 14 批（C–Z 段剩余 225 个最细括注名）
// 只做「原子名」——多层括号由 fromDict 的三级查找自动拼成数组，不写合并键
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const EX = p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian');
const CON = p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan');
const REV = p('Thu hồi', 'การเพิกถอน', 'Pencabutan', 'Pembatalan');
const TM = p('Biện pháp Tạm thời', 'มาตรการชั่วคราว', 'Tindakan Sementara', 'Langkah Sementara');
const FT = p('Thương mại Công bằng', 'การค้าที่เป็นธรรม', 'Perdagangan yang Adil', 'Perdagangan Adil');
const SAV = p('Quy định bảo lưu và chuyển tiếp', 'บทบัญญัติการสงวนสิทธิและเฉพาะกาล', 'Ketentuan Penyimpanan Hak dan Peralihan', 'Peruntukan Pemeliharaan dan Peralihan');

const mod = {
  // ── 取消 / 生效 / 变更 ─────────────────────────────────
  'Cancellation of Contracts': p('Hủy bỏ Hợp đồng', 'การยกเลิกสัญญา', 'Pembatalan Kontrak', 'Pembatalan Kontrak'),
  'Cessation of Section 28 for Certain Proceedings': p('Chấm dứt Điều 28 đối với một số thủ tục tố tụng', 'การยุติมาตรา 28 สำหรับการดำเนินคดีบางประเภท', 'Penghentian Pasal 28 untuk Proses Hukum Tertentu', 'Pemberhentian Seksyen 28 bagi Prosiding Tertentu'),
  'Cessation of Section 28 for Syariah Court': p('Chấm dứt Điều 28 đối với Tòa án Syariah', 'การยุติมาตรา 28 สำหรับศาลชะรีอะฮ์', 'Penghentian Pasal 28 untuk Mahkamah Syariah', 'Pemberhentian Seksyen 28 bagi Mahkamah Syariah'),
  'Modification': p('Sửa đổi', 'การแก้ไข', 'Modifikasi', 'Pengubahsuaian'),
  'Modification of Co-operative Societies Rules under Section 97': p('Sửa đổi Quy tắc Hợp tác xã theo Điều 97', 'การแก้ไขกฎสหกรณ์ตามมาตรา 97', 'Modifikasi Peraturan Koperasi menurut Pasal 97', 'Pengubahsuaian Kaedah Koperasi di bawah Seksyen 97'),
  'Modification of Definition of “Surplus”': p('Sửa đổi Định nghĩa “Thặng dư”', 'การแก้ไขคำนิยาม “เงินส่วนเกิน”', 'Modifikasi Definisi “Surplus”', 'Pengubahsuaian Takrif “Lebihan”'),
  'Modification of Part 2 Provisions': p('Sửa đổi các Quy định Phần 2', 'การแก้ไขบทบัญญัติภาค 2', 'Modifikasi Ketentuan Bagian 2', 'Pengubahsuaian Peruntukan Bahagian 2'),
  'Modification of Section 59(6)': p('Sửa đổi Điều 59(6)', 'การแก้ไขมาตรา 59(6)', 'Modifikasi Pasal 59(6)', 'Pengubahsuaian Seksyen 59(6)'),
  'Modification of section 66(1) in respect of NTUC Eldercare Co-operative Limited': p('Sửa đổi Điều 66(1) đối với Hợp tác xã NTUC Eldercare', 'การแก้ไขมาตรา 66(1) สำหรับสหกรณ์ NTUC Eldercare', 'Modifikasi Pasal 66(1) sehubungan dengan Koperasi NTUC Eldercare', 'Pengubahsuaian Seksyen 66(1) berkenaan Koperasi NTUC Eldercare'),
  'Modification under Section 97': p('Sửa đổi theo Điều 97', 'การแก้ไขตามมาตรา 97', 'Modifikasi menurut Pasal 97', 'Pengubahsuaian di bawah Seksyen 97'),

  // ── 指定 / 设立 ────────────────────────────────────────
  'Designated Development Areas': p('Khu Phát triển được Chỉ định', 'เขตพัฒนาที่กำหนด', 'Kawasan Pembangunan yang Ditetapkan', 'Kawasan Pembangunan yang Ditentukan'),
  'Establishment': p('Thành lập', 'การจัดตั้ง', 'Pendirian', 'Penubuhan'),
  'Review Board': p('Ủy ban Xem xét', 'คณะกรรมการทบทวน', 'Dewan Peninjauan', 'Lembaga Semakan'),
  'Sector Administrators': p('Cơ quan Quản lý Ngành', 'ผู้บริหารภาคส่วน', 'Administrator Sektor', 'Pentadbir Sektor'),
  'Senior Diplomatic Officers': p('Viên chức Ngoại giao Cấp cao', 'เจ้าหน้าที่การทูตอาวุโส', 'Pejabat Diplomatik Senior', 'Pegawai Diplomatik Kanan'),
  'Mayor': p('Thị trưởng', 'นายกเทศมนตรี', 'Wali Kota', 'Datuk Bandar'),
  'Ministerial Responsibility': p('Trách nhiệm của Bộ trưởng', 'ความรับผิดชอบของรัฐมนตรี', 'Tanggung Jawab Menteri', 'Tanggungjawab Menteri'),

  // ── 费用 / 税 / 征收 ───────────────────────────────────
  'Entry Levy': p('Phí Nhập cảnh', 'ค่าธรรมเนียมเข้า', 'Retribusi Masuk', 'Levi Masuk'),
  'Exemptions relating to Pre-Paid Entry Levies': p('Miễn trừ liên quan đến Phí Nhập cảnh Trả trước', 'การยกเว้นเกี่ยวกับค่าธรรมเนียมเข้าที่ชำระล่วงหน้า', 'Pembebasan terkait Retribusi Masuk Prabayar', 'Pengecualian berkaitan Levi Masuk Prabayar'),
  'Fees and Late Lodgment Penalties': p('Lệ phí và Tiền phạt Nộp muộn', 'ค่าธรรมเนียมและค่าปรับการยื่นล่าช้า', 'Biaya dan Denda Keterlambatan Penyerahan', 'Fi dan Penalti Penyerahan Lewat'),
  'Fees for First Information and Accused’s Criminal Records': p('Lệ phí đối với Thông tin Ban đầu và Lý lịch Hình sự của Bị cáo', 'ค่าธรรมเนียมสำหรับข้อมูลเบื้องต้นและประวัติอาชญากรรมของผู้ถูกกล่าวหา', 'Biaya untuk Informasi Pertama dan Catatan Kriminal Terdakwa', 'Fi bagi Maklumat Pertama dan Rekod Jenayah Tertuduh'),
  'Miscellaneous Fees and Rates': p('Lệ phí và Mức thu Khác', 'ค่าธรรมเนียมและอัตราต่าง ๆ', 'Biaya dan Tarif Lain-lain', 'Fi dan Kadar Pelbagai'),
  'Oaths and Fees': p('Lời Tuyên thệ và Lệ phí', 'คำปฏิญาณและค่าธรรมเนียม', 'Sumpah dan Biaya', 'Sumpah dan Fi'),
  'Service Charge': p('Phí Dịch vụ', 'ค่าบริการ', 'Biaya Layanan', 'Caj Perkhidmatan'),
  'Late Payment Interest Rate': p('Lãi suất Chậm thanh toán', 'อัตราดอกเบี้ยการชำระล่าช้า', 'Suku Bunga Keterlambatan Pembayaran', 'Kadar Faedah Bayaran Lewat'),
  'Motor Vehicles Special Tax': p('Thuế Đặc biệt đối với Xe cơ giới', 'ภาษีพิเศษยานยนต์', 'Pajak Khusus Kendaraan Bermotor', 'Cukai Khas Kenderaan Bermotor'),
  'Rebate on Motor Cars': p('Giảm trừ đối với Xe hơi', 'การลดหย่อนสำหรับรถยนต์นั่ง', 'Rabat atas Mobil', 'Rebat bagi Kereta'),
  'Sustainable Aviation Fuel Levy': p('Phí Nhiên liệu Hàng không Bền vững', 'ค่าธรรมเนียมเชื้อเพลิงการบินที่ยั่งยืน', 'Retribusi Bahan Bakar Penerbangan Berkelanjutan', 'Levi Bahan Api Penerbangan Lestari'),

  // ── 豁免（一般）────────────────────────────────────────
  'Exempt Charities': p('Tổ chức Từ thiện được Miễn trừ', 'องค์กรการกุศลที่ได้รับยกเว้น', 'Badan Amal yang Dibebaskan', 'Badan Amal yang Dikecualikan'),
  'Exempt Private Companies': p('Công ty Tư nhân được Miễn trừ', 'บริษัทเอกชนที่ได้รับยกเว้น', 'Perusahaan Swasta yang Dibebaskan', 'Syarikat Persendirian yang Dikecualikan'),
  'Exemption — Housing and Development Board': p('Miễn trừ — Ủy ban Nhà ở và Phát triển', 'การยกเว้น — คณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Pembebasan — Dewan Perumahan dan Pembangunan', 'Pengecualian — Lembaga Perumahan dan Pembangunan'),
  'Exemption — Statutory Bodies': p('Miễn trừ — Cơ quan Pháp định', 'การยกเว้น — หน่วยงานตามกฎหมาย', 'Pembebasan — Badan Statuter', 'Pengecualian — Badan Berkanun'),
  'Exemption — Tanjong Pagar': p('Miễn trừ — Tanjong Pagar', 'การยกเว้น — ตันจงปาการ์', 'Pembebasan — Tanjong Pagar', 'Pengecualian — Tanjong Pagar'),
  'Exemption for Biodiesel Blends': p('Miễn trừ đối với Hỗn hợp Diesel Sinh học', 'การยกเว้นสำหรับส่วนผสมไบโอดีเซล', 'Pembebasan bagi Campuran Biodiesel', 'Pengecualian bagi Campuran Biodiesel'),
  'Exemption from Exclusion from Casino, etc.': p('Miễn trừ việc Bị loại khỏi Sòng bạc, v.v.', 'การยกเว้นจากการถูกห้ามเข้าบ่อนการพนัน ฯลฯ', 'Pembebasan dari Pengecualian Masuk Kasino, dll.', 'Pengecualian daripada Dikecualikan daripada Kasino, dll.'),
  'Exemption from Permit for Fund-raising Appeal': p('Miễn trừ Giấy phép Gây quỹ', 'การยกเว้นใบอนุญาตระดมทุน', 'Pembebasan dari Izin Imbauan Penggalangan Dana', 'Pengecualian daripada Permit Rayuan Pengumpulan Dana'),
  'Exemption from Registration': p('Miễn trừ Đăng ký', 'การยกเว้นการจดทะเบียน', 'Pembebasan dari Pendaftaran', 'Pengecualian daripada Pendaftaran'),
  'Exemption from Responsible Gambling Requirements': p('Miễn trừ các Yêu cầu về Cờ bạc Có trách nhiệm', 'การยกเว้นข้อกำหนดการพนันอย่างมีความรับผิดชอบ', 'Pembebasan dari Persyaratan Perjudian yang Bertanggung Jawab', 'Pengecualian daripada Keperluan Perjudian Bertanggungjawab'),
  'Exemption from Scheme Membership': p('Miễn trừ Tư cách Thành viên Chương trình', 'การยกเว้นการเป็นสมาชิกโครงการ', 'Pembebasan dari Keanggotaan Skema', 'Pengecualian daripada Keahlian Skim'),
  'Exemption from Section 136(1)': p('Miễn trừ theo Điều 136(1)', 'การยกเว้นตามมาตรา 136(1)', 'Pembebasan menurut Pasal 136(1)', 'Pengecualian menurut Seksyen 136(1)'),
  'Exemption from Section 15(2) — Free Trade Agreements, etc.': p('Miễn trừ theo Điều 15(2) — Hiệp định Thương mại Tự do, v.v.', 'การยกเว้นตามมาตรา 15(2) — ความตกลงการค้าเสรี ฯลฯ', 'Pembebasan menurut Pasal 15(2) — Perjanjian Perdagangan Bebas, dll.', 'Pengecualian menurut Seksyen 15(2) — Perjanjian Perdagangan Bebas, dll.'),
  'Exemption from Section 25(1)': p('Miễn trừ theo Điều 25(1)', 'การยกเว้นตามมาตรา 25(1)', 'Pembebasan menurut Pasal 25(1)', 'Pengecualian menurut Seksyen 25(1)'),
  'Exemption from Section 67D(1)(g) and (h)': p('Miễn trừ theo Điều 67D(1)(g) và (h)', 'การยกเว้นตามมาตรา 67D(1)(g) และ (h)', 'Pembebasan menurut Pasal 67D(1)(g) dan (h)', 'Pengecualian menurut Seksyen 67D(1)(g) dan (h)'),
  'Exemption from Section 7(1)(c) — Singapore LNG Corporation Pte. Ltd.': p('Miễn trừ theo Điều 7(1)(c) — Công ty TNHH Singapore LNG', 'การยกเว้นตามมาตรา 7(1)(c) — บริษัท Singapore LNG จำกัด', 'Pembebasan menurut Pasal 7(1)(c) — Singapore LNG Corporation Pte. Ltd.', 'Pengecualian menurut Seksyen 7(1)(c) — Singapore LNG Corporation Pte. Ltd.'),
  'Exemption from Section 7(3) and (5)': p('Miễn trừ theo Điều 7(3) và (5)', 'การยกเว้นตามมาตรา 7(3) และ (5)', 'Pembebasan menurut Pasal 7(3) dan (5)', 'Pengecualian menurut Seksyen 7(3) dan (5)'),
  'Exemptions for Banks, etc.': p('Miễn trừ đối với Ngân hàng, v.v.', 'การยกเว้นสำหรับธนาคาร ฯลฯ', 'Pembebasan bagi Bank, dll.', 'Pengecualian bagi Bank, dll.'),
  'Licensed Warehouses for Petroleum — Exemption': p('Kho Xăng dầu được Cấp phép — Miễn trừ', 'คลังน้ำมันที่ได้รับอนุญาต — การยกเว้น', 'Gudang Berlisensi untuk Minyak Bumi — Pembebasan', 'Gudang Berlesen bagi Petroleum — Pengecualian'),
  'Manufacturing Licence': p('Giấy phép Sản xuất', 'ใบอนุญาตผลิต', 'Izin Produksi', 'Lesen Pengilangan'),
  'Motor Vehicles with Special Purpose Licences': p('Xe cơ giới có Giấy phép Mục đích Đặc biệt', 'ยานยนต์ที่มีใบอนุญาตเพื่อวัตถุประสงค์พิเศษ', 'Kendaraan Bermotor dengan Izin Tujuan Khusus', 'Kenderaan Bermotor dengan Lesen Tujuan Khas'),
  'Home-Brewing of Fermented Liquors': p('Nấu Rượu Lên men tại Nhà', 'การต้มเหล้าหมักที่บ้าน', 'Pembuatan Minuman Fermentasi di Rumah', 'Pembuatan Minuman Fermentasi di Rumah'),
  'Private Bodies — Exemption': p('Tổ chức Tư nhân — Miễn trừ', 'องค์กรเอกชน — การยกเว้น', 'Badan Swasta — Pembebasan', 'Badan Persendirian — Pengecualian'),
  'Retail Food Establishments — Exemption': p('Cơ sở Kinh doanh Thực phẩm Bán lẻ — Miễn trừ', 'สถานประกอบการอาหารค้าปลีก — การยกเว้น', 'Usaha Makanan Eceran — Pembebasan', 'Premis Makanan Runcit — Pengecualian'),
  'Specified Mosquito Control Work — Exemption': p('Công tác Kiểm soát Muỗi được Chỉ định — Miễn trừ', 'งานควบคุมยุงที่กำหนด — การยกเว้น', 'Pekerjaan Pengendalian Nyamuk Tertentu — Pembebasan', 'Kerja Kawalan Nyamuk Ditentukan — Pengecualian'),
  'Listed Foreign Companies — Exemption from Section 379': p('Công ty Nước ngoài Niêm yết — Miễn trừ theo Điều 379', 'บริษัทต่างประเทศที่จดทะเบียนในตลาด — การยกเว้นตามมาตรา 379', 'Perusahaan Asing Tercatat — Pembebasan menurut Pasal 379', 'Syarikat Asing Tersenarai — Pengecualian menurut Seksyen 379'),
  'Specified Companies — Exemption from Part 11A': p('Công ty được Chỉ định — Miễn trừ Phần 11A', 'บริษัทที่กำหนด — การยกเว้นภาค 11A', 'Perusahaan Tertentu — Pembebasan Bagian 11A', 'Syarikat Ditentukan — Pengecualian Bahagian 11A'),
  'Member of Singapore Dental Council — Exemption': p('Thành viên Hội đồng Nha khoa Singapore — Miễn trừ', 'สมาชิกสภาการทันตกรรมสิงคโปร์ — การยกเว้น', 'Anggota Dewan Kedokteran Gigi Singapura — Pembebasan', 'Ahli Majlis Pergigian Singapura — Pengecualian'),
  'NTUC Enterprise Co-operative Limited — Exemption under Section 97': p('Hợp tác xã NTUC Enterprise — Miễn trừ theo Điều 97', 'สหกรณ์ NTUC Enterprise — การยกเว้นตามมาตรา 97', 'Koperasi NTUC Enterprise — Pembebasan menurut Pasal 97', 'Koperasi NTUC Enterprise — Pengecualian di bawah Seksyen 97'),
  'NTUC Income Insurance Co-operative Limited — Exemption from Section 88': p('Hợp tác xã Bảo hiểm NTUC Income — Miễn trừ theo Điều 88', 'สหกรณ์ประกันภัย NTUC Income — การยกเว้นตามมาตรา 88', 'Koperasi Asuransi NTUC Income — Pembebasan menurut Pasal 88', 'Koperasi Insurans NTUC Income — Pengecualian menurut Seksyen 88'),

  // ── 排除 / 禁止 ────────────────────────────────────────
  'Exclusion from Casino, etc. — Social Assistance Programme and Subsidy Scheme': p('Loại khỏi Sòng bạc, v.v. — Chương trình Hỗ trợ Xã hội và Chương trình Trợ cấp', 'การห้ามเข้าบ่อนการพนัน ฯลฯ — โครงการช่วยเหลือสังคมและโครงการอุดหนุน', 'Pengecualian Masuk Kasino, dll. — Program Bantuan Sosial dan Skema Subsidi', 'Pengecualian daripada Kasino, dll. — Program Bantuan Sosial dan Skim Subsidi'),
  'Exclusion from Convention': p('Loại trừ khỏi Công ước', 'การยกเว้นจากอนุสัญญา', 'Pengecualian dari Konvensi', 'Pengecualian daripada Konvensyen'),
  'Prohibition in Certain Places': p('Cấm tại Một số Địa điểm', 'การห้ามในสถานที่บางแห่ง', 'Larangan di Tempat Tertentu', 'Larangan di Tempat-tempat Tertentu'),
  'Prohibition of Fund-raising Appeal': p('Cấm Gây quỹ', 'การห้ามระดมทุน', 'Larangan Imbauan Penggalangan Dana', 'Larangan Rayuan Pengumpulan Dana'),
  'Prohibition of Fund-Raising Appeal': p('Cấm Gây quỹ', 'การห้ามระดมทุน', 'Larangan Imbauan Penggalangan Dana', 'Larangan Rayuan Pengumpulan Dana'),
  'Restriction of Fund-raising Appeal': p('Hạn chế Gây quỹ', 'การจำกัดการระดมทุน', 'Pembatasan Imbauan Penggalangan Dana', 'Sekatan Rayuan Pengumpulan Dana'),
  'Suspension of Fund-Raising Appeal': p('Đình chỉ Gây quỹ', 'การระงับการระดมทุน', 'Penangguhan Imbauan Penggalangan Dana', 'Penggantungan Rayuan Pengumpulan Dana'),
  'Fund-raising Appeals for Local and Foreign Charitable Purposes': p('Gây quỹ cho Mục đích Từ thiện Trong nước và Nước ngoài', 'การระดมทุนเพื่อการกุศลในประเทศและต่างประเทศ', 'Imbauan Penggalangan Dana untuk Tujuan Amal Dalam dan Luar Negeri', 'Rayuan Pengumpulan Dana bagi Tujuan Amal Dalam dan Luar Negara'),
  'Prohibition of Imports': p('Cấm Nhập khẩu', 'การห้ามนำเข้า', 'Larangan Impor', 'Larangan Import'),
  'Protection of Secrecy': p('Bảo vệ Bí mật', 'การคุ้มครองความลับ', 'Perlindungan Kerahasiaan', 'Perlindungan Kerahsiaan'),

  // ── 公平交易 / 消费者保护 ──────────────────────────────
  'Fair Trading': FT,
  'Motor Vehicle Dealer Deposits': p('Tiền đặt cọc của Đại lý Xe cơ giới', 'เงินมัดจำของผู้แทนจำหน่ายยานยนต์', 'Deposito Dealer Kendaraan Bermotor', 'Deposit Pengedar Kenderaan Bermotor'),
  'Notifiable Events': p('Sự kiện Phải khai báo', 'เหตุการณ์ที่ต้องแจ้ง', 'Peristiwa yang Wajib Diberitahukan', 'Peristiwa yang Wajib Dimaklumkan'),
  'Opt-Out Practices': p('Thực hành Chọn không tham gia', 'แนวปฏิบัติการเลือกไม่รับ', 'Praktik Penolakan', 'Amalan Penolakan'),
  'Regulated Financial Products and Services': p('Sản phẩm và Dịch vụ Tài chính được Quản lý', 'ผลิตภัณฑ์และบริการทางการเงินที่อยู่ภายใต้การกำกับ', 'Produk dan Layanan Keuangan yang Diatur', 'Produk dan Perkhidmatan Kewangan yang Dikawal'),
  'Safety Requirements': p('Yêu cầu An toàn', 'ข้อกำหนดด้านความปลอดภัย', 'Persyaratan Keselamatan', 'Keperluan Keselamatan'),
  'Trade Descriptions and Safety Requirements': p('Mô tả Thương mại và Yêu cầu An toàn', 'คำบรรยายสินค้าและข้อกำหนดด้านความปลอดภัย', 'Keterangan Perdagangan dan Persyaratan Keselamatan', 'Perihalan Perdagangan dan Keperluan Keselamatan'),

  // ── 程序 / 审理 ────────────────────────────────────────
  'Procedure': p('Thủ tục', 'วิธีพิจารณา', 'Prosedur', 'Prosedur'),
  'Proceedings of Authority': p('Thủ tục Tố tụng của Cơ quan', 'การดำเนินการของหน่วยงาน', 'Proses di Otoritas', 'Prosiding Pihak Berkuasa'),
  'Patron Dispute Resolution': p('Giải quyết Tranh chấp của Khách hàng', 'การระงับข้อพิพาทของผู้ใช้บริการ', 'Penyelesaian Sengketa Patron', 'Penyelesaian Pertikaian Pelanggan'),
  'Section 122 Reconsideration and Appeals': p('Xem xét lại và Kháng cáo theo Điều 122', 'การพิจารณาใหม่และการอุทธรณ์ตามมาตรา 122', 'Peninjauan Kembali dan Banding menurut Pasal 122', 'Pertimbangan Semula dan Rayuan menurut Seksyen 122'),
  'Review by Authority': p('Xem xét bởi Cơ quan', 'การทบทวนโดยหน่วยงาน', 'Peninjauan oleh Otoritas', 'Semakan oleh Pihak Berkuasa'),
  'Junior Officers Disciplinary Proceedings': p('Thủ tục Kỷ luật Sĩ quan Cấp dưới', 'การดำเนินการทางวินัยของเจ้าหน้าที่ชั้นผู้น้อย', 'Proses Disiplin Perwira Junior', 'Prosiding Tatatertib Pegawai Junior'),
  'Staff Disciplinary Proceedings': p('Thủ tục Kỷ luật Nhân viên', 'การดำเนินการทางวินัยของพนักงาน', 'Proses Disiplin Staf', 'Prosiding Tatatertib Kakitangan'),
  'Production of Document or Other Thing': p('Xuất trình Tài liệu hoặc Vật khác', 'การยื่นเอกสารหรือสิ่งอื่น', 'Penyerahan Dokumen atau Benda Lain', 'Penyerahan Dokumen atau Benda Lain'),
  'Service on Singapore Prison Service for Application relating to Stay of Execution': p('Tống đạt cho Cục Trại giam Singapore đối với Đơn xin Hoãn thi hành án', 'การส่งหมายแก่หน่วยงานราชทัณฑ์สิงคโปร์สำหรับคำร้องเกี่ยวกับการทุเลาการบังคับคดี', 'Penyampaian kepada Layanan Penjara Singapura untuk Permohonan Penangguhan Eksekusi', 'Penyampaian kepada Perkhidmatan Penjara Singapura bagi Permohonan Penangguhan Pelaksanaan'),
  'Viewing of Exhibits': p('Xem Vật chứng', 'การตรวจดูพยานวัตถุ', 'Peninjauan Barang Bukti', 'Penelitian Barang Kes'),
  'Witnesses’ Allowances': p('Phụ cấp Nhân chứng', 'ค่าเบี้ยเลี้ยงพยาน', 'Tunjangan Saksi', 'Elaun Saksi'),
  'Expert Opinion': p('Ý kiến Chuyên gia', 'ความเห็นผู้เชี่ยวชาญ', 'Pendapat Ahli', 'Pendapat Pakar'),
  'Notice Requirements to Admit Hearsay Evidence': p('Yêu cầu Thông báo để Chấp nhận Chứng cứ Truyền đạt', 'ข้อกำหนดการแจ้งเพื่อรับฟังพยานบอกเล่า', 'Persyaratan Pemberitahuan untuk Menerima Keterangan Hearsay', 'Keperluan Notis untuk Menerima Keterangan Dengar Cakap'),
  'Pleading Guilty by Electronic Means': p('Nhận tội bằng Phương thức Điện tử', 'การรับสารภาพด้วยวิธีการทางอิเล็กทรอนิกส์', 'Mengaku Bersalah melalui Sarana Elektronik', 'Mengaku Bersalah melalui Cara Elektronik'),
  'Prescribed Offences for Mandatory Treatment Orders': p('Tội theo Quy định đối với Lệnh Điều trị Bắt buộc', 'ความผิดตามที่กำหนดสำหรับคำสั่งบำบัดภาคบังคับ', 'Tindak Pidana yang Ditetapkan untuk Perintah Pengobatan Wajib', 'Kesalahan yang Ditetapkan bagi Perintah Rawatan Mandatori'),
  'Reformative Training': p('Huấn luyện Cải tạo', 'การฝึกอบรมแก้ไขฟื้นฟู', 'Pelatihan Pembinaan', 'Latihan Pemulihan'),
  'Relevant Law Enforcement Agencies': p('Cơ quan Thực thi Pháp luật Liên quan', 'หน่วยงานบังคับใช้กฎหมายที่เกี่ยวข้อง', 'Lembaga Penegak Hukum Terkait', 'Agensi Penguatkuasaan Undang-Undang Berkaitan'),
  'Prescribed Law Enforcement Agency — Computer Access': p('Cơ quan Thực thi Pháp luật theo Quy định — Truy cập Máy tính', 'หน่วยงานบังคับใช้กฎหมายตามที่กำหนด — การเข้าถึงคอมพิวเตอร์', 'Lembaga Penegak Hukum yang Ditetapkan — Akses Komputer', 'Agensi Penguatkuasaan Undang-Undang Ditetapkan — Akses Komputer'),
  'Prescribed Law Enforcement Agency — Lawful Custody of Persons': p('Cơ quan Thực thi Pháp luật theo Quy định — Giam giữ Hợp pháp Người', 'หน่วยงานบังคับใช้กฎหมายตามที่กำหนด — การควบคุมตัวบุคคลโดยชอบด้วยกฎหมาย', 'Lembaga Penegak Hukum yang Ditetapkan — Penahanan Sah atas Orang', 'Agensi Penguatkuasaan Undang-Undang Ditetapkan — Jagaan Sah Orang'),
  'Specified Serious Offence': p('Tội Nghiêm trọng được Chỉ định', 'ความผิดร้ายแรงที่กำหนด', 'Tindak Pidana Berat Tertentu', 'Kesalahan Serius Ditentukan'),
  'Obligations on Person Subject to Supervision': p('Nghĩa vụ của Người chịu Sự Giám sát', 'หน้าที่ของบุคคลที่อยู่ภายใต้การควบคุมดูแล', 'Kewajiban Orang yang Tunduk pada Pengawasan', 'Kewajipan Orang yang Tertakluk pada Penyeliaan'),
  'Saving and Transitional Provisions — Disclosure': p('Quy định Bảo lưu và Chuyển tiếp — Công bố Thông tin', 'บทบัญญัติการสงวนสิทธิและเฉพาะกาล — การเปิดเผย', 'Ketentuan Penyimpanan Hak dan Peralihan — Pengungkapan', 'Peruntukan Pemeliharaan dan Peralihan — Pendedahan'),

  // ── 公司 / 会计 ────────────────────────────────────────
  'Filing of Documents': p('Nộp Tài liệu', 'การยื่นเอกสาร', 'Penyerahan Dokumen', 'Pemfailan Dokumen'),
  'Model Constitutions': p('Điều lệ Mẫu', 'ข้อบังคับแบบอย่าง', 'Anggaran Dasar Model', 'Tataurusan Contoh'),
  'Registers of Controllers, Nominee Directors, Nominee Shareholders, and Members of Foreign Companies': p('Sổ đăng ký Người Kiểm soát, Giám đốc Được chỉ định, Cổ đông Được chỉ định và Thành viên của Công ty Nước ngoài', 'ทะเบียนผู้ควบคุม กรรมการผู้ถูกระบุ ผู้ถือหุ้นผู้ถูกระบุ และสมาชิกของบริษัทต่างประเทศ', 'Daftar Pengendali, Direktur Nominee, Pemegang Saham Nominee, dan Anggota Perusahaan Asing', 'Daftar Pengawal, Pengarah Nominee, Pemegang Saham Nominee, dan Ahli Syarikat Asing'),
  'Revision of Defective Financial Statements, or Consolidated Financial Statements or Balance-sheet': p('Sửa đổi Báo cáo Tài chính Khiếm khuyết, hoặc Báo cáo Tài chính Hợp nhất hoặc Bảng cân đối kế toán', 'การแก้ไขงบการเงินที่มีข้อบกพร่อง หรืองบการเงินรวมหรืองบดุล', 'Revisi Laporan Keuangan Cacat, atau Laporan Keuangan Konsolidasi atau Neraca', 'Semakan Penyata Kewangan Cacat, atau Penyata Kewangan Disatukan atau Kunci Kira-kira'),
  'Revocation of Appointments of Approved Liquidators': p('Thu hồi Bổ nhiệm các Thanh lý viên được Chấp thuận', 'การเพิกถอนการแต่งตั้งผู้ชำระบัญชีที่ได้รับอนุมัติ', 'Pencabutan Pengangkatan Likuidator yang Disetujui', 'Pembatalan Pelantikan Pelikuidasi yang Diluluskan'),
  'Relief for Company Directors under section 202(2)': p('Giảm nhẹ cho Giám đốc Công ty theo Điều 202(2)', 'การผ่อนปรนสำหรับกรรมการบริษัทตามมาตรา 202(2)', 'Keringanan bagi Direktur Perusahaan menurut Pasal 202(2)', 'Pelepasan bagi Pengarah Syarikat di bawah Seksyen 202(2)'),
  'Summary Financial Statement': p('Báo cáo Tài chính Tóm tắt', 'งบการเงินโดยสรุป', 'Laporan Keuangan Ringkas', 'Penyata Kewangan Ringkasan'),
  'Transfer of Registration': p('Chuyển Đăng ký', 'การโอนการจดทะเบียน', 'Pemindahan Pendaftaran', 'Pemindahan Pendaftaran'),
  'Requirements for Members of Committee and Officers of Credit Society': p('Yêu cầu đối với Thành viên Ủy ban và Viên chức của Hợp tác xã Tín dụng', 'ข้อกำหนดสำหรับสมาชิกคณะกรรมการและเจ้าหน้าที่ของสหกรณ์ออมทรัพย์', 'Persyaratan bagi Anggota Komite dan Pejabat Koperasi Kredit', 'Keperluan bagi Ahli Jawatankuasa dan Pegawai Koperasi Kredit'),
  'Limits on Chit Fund Business': p('Giới hạn đối với Hoạt động Kinh doanh Quỹ Hụi', 'ข้อจำกัดธุรกิจแชร์', 'Batas atas Usaha Dana Arisan', 'Had bagi Perniagaan Kutu'),

  // ── 规划 / 土地使用权 ──────────────────────────────────
  'Marina Bay Common Services Tunnel Area Protection Zone': p('Vùng Bảo vệ Khu Đường hầm Dịch vụ Chung Marina Bay', 'เขตคุ้มครองพื้นที่อุโมงค์บริการร่วมมารีนาเบย์', 'Zona Perlindungan Area Terowongan Layanan Umum Marina Bay', 'Zon Perlindungan Kawasan Terowong Perkhidmatan Umum Marina Bay'),
  'National Heritage Board Collections': p('Bộ sưu tập của Ủy ban Di sản Quốc gia', 'คอลเลกชันของคณะกรรมการมรดกแห่งชาติ', 'Koleksi Dewan Warisan Nasional', 'Koleksi Lembaga Warisan Negara'),
  'National Primary Schools': p('Trường Tiểu học Quốc gia', 'โรงเรียนประถมศึกษาแห่งชาติ', 'Sekolah Dasar Nasional', 'Sekolah Rendah Kebangsaan'),
  'Prescribed Reasons': p('Lý do theo Quy định', 'เหตุผลตามที่กำหนด', 'Alasan yang Ditetapkan', 'Sebab yang Ditetapkan'),

  // ── 植物 / 检疫 ────────────────────────────────────────
  'Import and Transhipment of Fresh Fruits and Vegetables': p('Nhập khẩu và Chuyển tải Rau quả Tươi', 'การนำเข้าและการถ่ายลำผักและผลไม้สด', 'Impor dan Transhipmen Buah dan Sayuran Segar', 'Import dan Pindah Kapal Buah-buahan dan Sayur-sayuran Segar'),
  'Phytosanitary Certification': p('Chứng nhận Kiểm dịch Thực vật', 'การรับรองสุขอนามัยพืช', 'Sertifikasi Fitokarantina', 'Pensijilan Fitosanitari'),
  'Plant Importation': p('Nhập khẩu Thực vật', 'การนำเข้าพืช', 'Impor Tanaman', 'Import Tumbuhan'),
  'Registration of Pesticides': p('Đăng ký Thuốc Bảo vệ Thực vật', 'การขึ้นทะเบียนสารกำจัดศัตรูพืช', 'Pendaftaran Pestisida', 'Pendaftaran Racun Perosak'),
  'Registration of Pesticides and Vector Repellents': p('Đăng ký Thuốc Bảo vệ Thực vật và Chất Xua Côn trùng Truyền bệnh', 'การขึ้นทะเบียนสารกำจัดศัตรูพืชและสารไล่แมลงนำโรค', 'Pendaftaran Pestisida dan Penolak Vektor', 'Pendaftaran Racun Perosak dan Penghalau Vektor'),
  'Registration, Licensing and Certification': p('Đăng ký, Cấp phép và Chứng nhận', 'การขึ้นทะเบียน การออกใบอนุญาต และการรับรอง', 'Pendaftaran, Perizinan dan Sertifikasi', 'Pendaftaran, Pelesenan dan Pensijilan'),

  // ── 卫生 / 医疗 / 社会 ─────────────────────────────────
  'Government Homes': p('Nhà của Chính phủ', 'สถานสงเคราะห์ของรัฐ', 'Panti Pemerintah', 'Rumah Kerajaan'),
  'Remand Home': p('Trại Tạm giam', 'สถานพินิจ', 'Rumah Tahanan', 'Rumah Tahanan'),
  'Place of Detention': p('Nơi Giam giữ', 'สถานที่กักขัง', 'Tempat Penahanan', 'Tempat Tahanan'),
  'Juvenile Case Conference': p('Hội nghị Vụ án Vị thành niên', 'การประชุมคดีเด็กและเยาวชน', 'Konferensi Kasus Anak', 'Persidangan Kes Kanak-kanak'),
  'Juvenile Rehabilitation Centres and Places of Safety': p('Trung tâm Phục hồi Vị thành niên và Nơi An toàn', 'ศูนย์ฟื้นฟูเด็กและเยาวชนและสถานที่ปลอดภัย', 'Pusat Rehabilitasi Anak dan Tempat Aman', 'Pusat Pemulihan Kanak-kanak dan Tempat Selamat'),
  'Leave and Visits': p('Nghỉ phép và Thăm viếng', 'การลาพักและการเยี่ยม', 'Cuti dan Kunjungan', 'Cuti dan Lawatan'),
  'Voluntary Care Agreement': p('Thỏa thuận Chăm sóc Tự nguyện', 'ข้อตกลงการดูแลโดยสมัครใจ', 'Perjanjian Pengasuhan Sukarela', 'Perjanjian Jagaan Sukarela'),
  'Weekend Detention': p('Giam giữ Cuối tuần', 'การกักขังในวันหยุดสุดสัปดาห์', 'Penahanan Akhir Pekan', 'Tahanan Hujung Minggu'),
  'Welfare Homes': p('Nhà Phúc lợi', 'สถานสงเคราะห์', 'Panti Sosial', 'Rumah Kebajikan'),
  'Leave and Benefits': p('Nghỉ phép và Phúc lợi', 'การลาพักและสิทธิประโยชน์', 'Cuti dan Tunjangan', 'Cuti dan Faedah'),
  'Long-Term Care Support Fund — Prescribed Public Schemes': p('Quỹ Hỗ trợ Chăm sóc Dài hạn — Chương trình Công được Quy định', 'กองทุนสนับสนุนการดูแลระยะยาว — โครงการสาธารณะตามที่กำหนด', 'Dana Dukungan Perawatan Jangka Panjang — Skema Publik yang Ditetapkan', 'Dana Sokongan Penjagaan Jangka Panjang — Skim Awam yang Ditetapkan'),
  'Supplement Scheme': p('Chương trình Bổ sung', 'โครงการเสริม', 'Skema Suplemen', 'Skim Tambahan'),
  'Policy Owners’ Protection Scheme': p('Chương trình Bảo vệ Chủ hợp đồng', 'โครงการคุ้มครองเจ้าของกรมธรรม์', 'Skema Perlindungan Pemegang Polis', 'Skim Perlindungan Pemilik Polisi'),
  'Policy Owners’ Protection': p('Bảo vệ Chủ hợp đồng', 'การคุ้มครองเจ้าของกรมธรรม์', 'Perlindungan Pemegang Polis', 'Perlindungan Pemilik Polisi'),
  'Maximum Compensation': p('Mức Bồi thường Tối đa', 'การชดเชยสูงสุด', 'Kompensasi Maksimum', 'Pampasan Maksimum'),
  'Withdrawal from DI Fund in Support of Resolution Measures': p('Rút vốn từ Quỹ Bảo hiểm Tiền gửi để Hỗ trợ các Biện pháp Xử lý', 'การถอนเงินจากกองทุนประกันเงินฝากเพื่อสนับสนุนมาตรการแก้ไข', 'Penarikan dari Dana Penjaminan Simpanan untuk Mendukung Langkah Resolusi', 'Pengeluaran daripada Dana Insurans Deposit bagi Menyokong Langkah Resolusi'),
  'Remuneration of Assessors': p('Thù lao của Hội thẩm', 'ค่าตอบแทนของผู้ประเมิน', 'Remunerasi Asesor', 'Ganjaran Penilai'),
  'Minister’s Certificate': p('Giấy chứng nhận của Bộ trưởng', 'หนังสือรับรองของรัฐมนตรี', 'Sertifikat Menteri', 'Sijil Menteri'),
  'Records Retention': p('Lưu giữ Hồ sơ', 'การเก็บรักษาบันทึก', 'Penyimpanan Catatan', 'Penyimpanan Rekod'),

  // ── 博彩 / 赌场 ────────────────────────────────────────
  'Evaluation Panel': p('Hội đồng Đánh giá', 'คณะผู้ประเมิน', 'Panel Evaluasi', 'Panel Penilaian'),
  'Gaming Equipment': p('Thiết bị Trò chơi', 'อุปกรณ์การเล่นเกม', 'Peralatan Permainan', 'Peralatan Permainan'),
  'Internal Controls': p('Kiểm soát Nội bộ', 'การควบคุมภายใน', 'Pengendalian Internal', 'Kawalan Dalaman'),
  'Licensing of Special Employees': p('Cấp phép cho Nhân viên Đặc biệt', 'การออกใบอนุญาตพนักงานพิเศษ', 'Perizinan Pegawai Khusus', 'Pelesenan Pekerja Khas'),
  'Main Shareholder — Marina Bay Sands Pte. Ltd.': p('Cổ đông Chính — Marina Bay Sands Pte. Ltd.', 'ผู้ถือหุ้นรายใหญ่ — Marina Bay Sands Pte. Ltd.', 'Pemegang Saham Utama — Marina Bay Sands Pte. Ltd.', 'Pemegang Saham Utama — Marina Bay Sands Pte. Ltd.'),
  'Main Shareholder — Resorts World at Sentosa Pte. Ltd.': p('Cổ đông Chính — Resorts World at Sentosa Pte. Ltd.', 'ผู้ถือหุ้นรายใหญ่ — Resorts World at Sentosa Pte. Ltd.', 'Pemegang Saham Utama — Resorts World at Sentosa Pte. Ltd.', 'Pemegang Saham Utama — Resorts World at Sentosa Pte. Ltd.'),
  'Maximum Gaming Area': p('Diện tích Trò chơi Tối đa', 'พื้นที่เล่นเกมสูงสุด', 'Area Permainan Maksimum', 'Keluasan Permainan Maksimum'),
  'Maximum Number of Gaming Machines and Gaming Programs': p('Số lượng Tối đa Máy Trò chơi và Chương trình Trò chơi', 'จำนวนสูงสุดของเครื่องเล่นเกมและโปรแกรมเกม', 'Jumlah Maksimum Mesin Permainan dan Program Permainan', 'Bilangan Maksimum Mesin Permainan dan Program Permainan'),
  'Notifiable Contracts': p('Hợp đồng Phải khai báo', 'สัญญาที่ต้องแจ้ง', 'Kontrak yang Wajib Diberitahukan', 'Kontrak yang Wajib Dimaklumkan'),
  'Prescribed Casino Chips': p('Chip Sòng bạc theo Quy định', 'ชิปคาสิโนตามที่กำหนด', 'Chip Kasino yang Ditetapkan', 'Cip Kasino yang Ditetapkan'),
  'Problem Gambling — Council and Committee of Assessors': p('Cờ bạc Có vấn đề — Hội đồng và Ủy ban Hội thẩm', 'การพนันที่มีปัญหา — สภาและคณะกรรมการผู้ประเมิน', 'Perjudian Bermasalah — Dewan dan Komite Asesor', 'Perjudian Bermasalah — Majlis dan Jawatankuasa Penilai'),
  'Problem Gambling — Saving and Transitional Provisions': p('Cờ bạc Có vấn đề — Quy định Bảo lưu và Chuyển tiếp', 'การพนันที่มีปัญหา — บทบัญญัติการสงวนสิทธิและเฉพาะกาล', 'Perjudian Bermasalah — Ketentuan Penyimpanan Hak dan Peralihan', 'Perjudian Bermasalah — Peruntukan Pemeliharaan dan Peralihan'),
  'Responsible Gambling': p('Cờ bạc Có trách nhiệm', 'การพนันอย่างมีความรับผิดชอบ', 'Perjudian yang Bertanggung Jawab', 'Perjudian Bertanggungjawab'),
  'Surveillance': p('Giám sát', 'การเฝ้าระวัง', 'Pengawasan', 'Pengawasan'),
  'Variation of Entry Levies': p('Điều chỉnh Phí Nhập cảnh', 'การปรับเปลี่ยนค่าธรรมเนียมเข้า', 'Perubahan Retribusi Masuk', 'Pindaan Levi Masuk'),

  // ── 航空 / 交通 ────────────────────────────────────────
  'Licensing of Airport Operators': p('Cấp phép cho Đơn vị Khai thác Sân bay', 'การออกใบอนุญาตผู้ดำเนินการท่าอากาศยาน', 'Perizinan Operator Bandar Udara', 'Pelesenan Pengendali Lapangan Terbang'),
  'Price Control of Aeronautical Charges': p('Kiểm soát Giá Phí Hàng không', 'การควบคุมราคาค่าธรรมเนียมการบิน', 'Pengendalian Harga Biaya Aeronautika', 'Kawalan Harga Caj Aeronautik'),
  'Seletar Airport': p('Sân bay Seletar', 'ท่าอากาศยานเซเลตาร์', 'Bandar Udara Seletar', 'Lapangan Terbang Seletar'),
  'Non-Regular Route Service': p('Dịch vụ Tuyến không Thường xuyên', 'บริการเส้นทางไม่ประจำ', 'Layanan Rute Tidak Tetap', 'Perkhidmatan Laluan Tidak Tetap'),
  'Prescribed Bilateral Railway Agreement': p('Hiệp định Đường sắt Song phương theo Quy định', 'ความตกลงรถไฟทวิภาคีตามที่กำหนด', 'Perjanjian Kereta Api Bilateral yang Ditetapkan', 'Perjanjian Kereta Api Dua Hala yang Ditetapkan'),
  'Offices and Stations': p('Văn phòng và Trạm', 'สำนักงานและสถานี', 'Kantor dan Stasiun', 'Pejabat dan Stesen'),
  'Permits to Remove Goods': p('Giấy phép Di chuyển Hàng hóa', 'ใบอนุญาตเคลื่อนย้ายสินค้า', 'Izin Pemindahan Barang', 'Permit Mengalih Barang'),

  // ── 海关 ───────────────────────────────────────────────
  'Fuel Tank — Minimum Amount': p('Bình nhiên liệu — Số lượng Tối thiểu', 'ถังน้ำมัน — จำนวนขั้นต่ำ', 'Tangki Bahan Bakar — Jumlah Minimum', 'Tangki Bahan Api — Jumlah Minimum'),
  'Fuel Tank — Prescribed Places': p('Bình nhiên liệu — Địa điểm theo Quy định', 'ถังน้ำมัน — สถานที่ตามที่กำหนด', 'Tangki Bahan Bakar — Tempat yang Ditetapkan', 'Tangki Bahan Api — Tempat yang Ditetapkan'),
  'Valuation of Locally-Manufactured Goods for Excise Duty': p('Định giá Hàng hóa Sản xuất Trong nước để Tính Thuế Tiêu thụ Đặc biệt', 'การประเมินราคาสินค้าที่ผลิตในประเทศเพื่อเสียภาษีสรรพสามิต', 'Penilaian Barang Produksi Dalam Negeri untuk Bea Cukai', 'Penilaian Barang Buatan Tempatan bagi Duti Eksais'),
  'Valuation': p('Định giá', 'การประเมินราคา', 'Penilaian', 'Penilaian'),

  // ── 网络 / 通信 ────────────────────────────────────────
  'Provider-Owned Critical Information Infrastructure': p('Cơ sở Hạ tầng Thông tin Trọng yếu do Nhà cung cấp Sở hữu', 'โครงสร้างพื้นฐานสารสนเทศสำคัญที่ผู้ให้บริการเป็นเจ้าของ', 'Infrastruktur Informasi Kritis Milik Penyedia', 'Infrastruktur Maklumat Kritikal Milik Penyedia'),
  'Providers of Essential Service Responsible for Cybersecurity of Third-Party-Owned Critical Information Infrastructure': p('Nhà cung cấp Dịch vụ Thiết yếu chịu Trách nhiệm về An ninh mạng của Cơ sở Hạ tầng Thông tin Trọng yếu do Bên thứ ba Sở hữu', 'ผู้ให้บริการที่จำเป็นซึ่งรับผิดชอบความมั่นคงปลอดภัยไซเบอร์ของโครงสร้างพื้นฐานสารสนเทศสำคัญที่บุคคลภายนอกเป็นเจ้าของ', 'Penyedia Layanan Esensial yang Bertanggung Jawab atas Keamanan Siber Infrastruktur Informasi Kritis Milik Pihak Ketiga', 'Penyedia Perkhidmatan Penting yang Bertanggungjawab atas Keselamatan Siber Infrastruktur Maklumat Kritikal Milik Pihak Ketiga'),
  'Systems of Temporary Cybersecurity Concern': p('Hệ thống Thuộc Diện Lo ngại An ninh mạng Tạm thời', 'ระบบที่ก่อความกังวลด้านความมั่นคงปลอดภัยไซเบอร์ชั่วคราว', 'Sistem yang Menjadi Perhatian Keamanan Siber Sementara', 'Sistem yang Menjadi Perhatian Keselamatan Siber Sementara'),

  // ── 号码 / 技术性附表 ──────────────────────────────────
  'Identity Cards': p('Thẻ Căn cước', 'บัตรประจำตัว', 'Kartu Identitas', 'Kad Pengenalan'),
  'Full Colour Copying Machines': p('Máy Photocopy Màu Hoàn chỉnh', 'เครื่องถ่ายเอกสารสีเต็มรูปแบบ', 'Mesin Fotokopi Warna Penuh', 'Mesin Penyalin Warna Penuh'),
  'Measurement, Reporting and Verification': p('Đo lường, Báo cáo và Xác minh', 'การวัด การรายงาน และการทวนสอบ', 'Pengukuran, Pelaporan dan Verifikasi', 'Pengukuran, Pelaporan dan Pengesahan'),
  'Registration and General Matters': p('Đăng ký và các Vấn đề Chung', 'การจดทะเบียนและเรื่องทั่วไป', 'Pendaftaran dan Hal Umum', 'Pendaftaran dan Perkara Umum'),
  'Registration of Charities': p('Đăng ký Tổ chức Từ thiện', 'การจดทะเบียนองค์กรการกุศล', 'Pendaftaran Badan Amal', 'Pendaftaran Badan Amal'),
  'Institutions of A Public Character': p('Cơ sở Mang Tính Chất Công', 'สถาบันที่เป็นสาธารณประโยชน์', 'Institusi Berkarakter Publik', 'Institusi Berwatak Awam'),
  'Large Charities': p('Tổ chức Từ thiện Quy mô Lớn', 'องค์กรการกุศลขนาดใหญ่', 'Badan Amal Besar', 'Badan Amal Besar'),

  // ── 时效 / 期限 ────────────────────────────────────────
  'Prescribed Period': p('Thời hạn theo Quy định', 'ระยะเวลาที่กำหนด', 'Periode yang Ditetapkan', 'Tempoh yang Ditetapkan'),
  'Prescribed Period under Section 6(1)(c)(ii)': p('Thời hạn theo Quy định tại Điều 6(1)(c)(ii)', 'ระยะเวลาที่กำหนดตามมาตรา 6(1)(c)(ii)', 'Periode yang Ditetapkan menurut Pasal 6(1)(c)(ii)', 'Tempoh yang Ditetapkan di bawah Seksyen 6(1)(c)(ii)'),
  'Specified Period': p('Thời hạn được Chỉ định', 'ระยะเวลาที่กำหนดไว้', 'Periode Tertentu', 'Tempoh Ditentukan'),
  'Substitution of Period': p('Thay thế Thời hạn', 'การแทนที่ระยะเวลา', 'Penggantian Periode', 'Penggantian Tempoh'),
  'Specified Amount under Section 15(3)': p('Số tiền được Chỉ định tại Điều 15(3)', 'จำนวนเงินที่กำหนดตามมาตรา 15(3)', 'Jumlah Tertentu menurut Pasal 15(3)', 'Jumlah Ditentukan di bawah Seksyen 15(3)'),
  'Prescribed Percentage under Section 76B(3) and (3B)': p('Tỷ lệ Phần trăm theo Quy định tại Điều 76B(3) và (3B)', 'ร้อยละตามที่กำหนดตามมาตรา 76B(3) และ (3B)', 'Persentase yang Ditetapkan menurut Pasal 76B(3) dan (3B)', 'Peratusan yang Ditetapkan di bawah Seksyen 76B(3) dan (3B)'),
  'Prescribed Rate of Contribution under Section 71(2)(a)': p('Tỷ lệ Đóng góp theo Quy định tại Điều 71(2)(a)', 'อัตราเงินสมทบตามที่กำหนดตามมาตรา 71(2)(a)', 'Tingkat Iuran yang Ditetapkan menurut Pasal 71(2)(a)', 'Kadar Sumbangan yang Ditetapkan di bawah Seksyen 71(2)(a)'),
  'Prescribed Rate of Contribution under Section 71(2)(b)': p('Tỷ lệ Đóng góp theo Quy định tại Điều 71(2)(b)', 'อัตราเงินสมทบตามที่กำหนดตามมาตรา 71(2)(b)', 'Tingkat Iuran yang Ditetapkan menurut Pasal 71(2)(b)', 'Kadar Sumbangan yang Ditetapkan di bawah Seksyen 71(2)(b)'),
  'Prescribed Forms': p('Mẫu theo Quy định', 'แบบฟอร์มตามที่กำหนด', 'Formulir yang Ditetapkan', 'Borang yang Ditetapkan'),
  'Prescribed Matters for Second Schedule': p('Vấn đề theo Quy định đối với Phụ lục Thứ hai', 'เรื่องตามที่กำหนดสำหรับตารางที่สอง', 'Hal yang Ditetapkan untuk Jadwal Kedua', 'Perkara yang Ditetapkan bagi Jadual Kedua'),
  'Prescribed Matters for Third Schedule': p('Vấn đề theo Quy định đối với Phụ lục Thứ ba', 'เรื่องตามที่กำหนดสำหรับตารางที่สาม', 'Hal yang Ditetapkan untuk Jadwal Ketiga', 'Perkara yang Ditetapkan bagi Jadual Ketiga'),

  // ── 临时措施（COVID-19 组）──────────────────────────────
  'Temporary Measures': TM,
  'Temporary Measures for Conduct of Collective Sale of Property': p('Biện pháp Tạm thời về Việc Bán Tập thể Bất động sản', 'มาตรการชั่วคราวสำหรับการขายทรัพย์สินแบบรวม', 'Tindakan Sementara untuk Pelaksanaan Penjualan Kolektif Properti', 'Langkah Sementara bagi Pelaksanaan Penjualan Kolektif Harta'),
  'Temporary Measures for Solemnization and Registration of Marriages': p('Biện pháp Tạm thời về Cử hành Hôn lễ và Đăng ký Kết hôn', 'มาตรการชั่วคราวสำหรับการประกอบพิธีสมรสและการจดทะเบียนสมรส', 'Tindakan Sementara untuk Pelaksanaan dan Pencatatan Perkawinan', 'Langkah Sementara bagi Upacara dan Pendaftaran Perkahwinan'),
  'Part 8 Relief': p('Giảm nhẹ theo Phần 8', 'การผ่อนปรนตามภาค 8', 'Keringanan Bagian 8', 'Pelepasan Bahagian 8'),
  'Part 8B Relief': p('Giảm nhẹ theo Phần 8B', 'การผ่อนปรนตามภาค 8B', 'Keringanan Bagian 8B', 'Pelepasan Bahagian 8B'),
  'Part 10 Relief': p('Giảm nhẹ theo Phần 10', 'การผ่อนปรนตามภาค 10', 'Keringanan Bagian 10', 'Pelepasan Bahagian 10'),
  'Rental and Related Measures': p('Biện pháp về Tiền thuê và các Biện pháp Liên quan', 'มาตรการค่าเช่าและมาตรการที่เกี่ยวข้อง', 'Tindakan Sewa dan Tindakan Terkait', 'Langkah Sewa dan Langkah Berkaitan'),
  'Rental Waiver Due to COVID-19 Event in 2021': p('Miễn Tiền thuê do Sự kiện COVID-19 năm 2021', 'การยกเว้นค่าเช่าเนื่องจากเหตุการณ์ COVID-19 ในปี 2021', 'Pembebasan Sewa akibat Peristiwa COVID-19 pada 2021', 'Pelepasan Sewa akibat Peristiwa COVID-19 pada 2021'),
  'Temporary Relief for Inability to Perform Contracts': p('Giảm nhẹ Tạm thời đối với Việc Không thể Thực hiện Hợp đồng', 'การผ่อนปรนชั่วคราวสำหรับการไม่สามารถปฏิบัติตามสัญญา', 'Keringanan Sementara atas Ketidakmampuan Melaksanakan Kontrak', 'Pelepasan Sementara bagi Ketidakupayaan Melaksanakan Kontrak'),
  'Transfer of Benefit of Property Tax Remission': p('Chuyển giao Lợi ích từ Việc Miễn Thuế Bất động sản', 'การโอนสิทธิประโยชน์จากการยกเว้นภาษีทรัพย์สิน', 'Pengalihan Manfaat Pembebasan Pajak Properti', 'Pemindahan Faedah Pelepasan Cukai Harta'),
  'Valuation Review Panel': p('Hội đồng Xem xét Định giá', 'คณะกรรมการทบทวนการประเมินราคา', 'Panel Peninjauan Penilaian', 'Panel Semakan Penilaian'),

  // ── 协定 / 公约 ────────────────────────────────────────
  'Montreal Convention, 1999': p('Công ước Montreal, 1999', 'อนุสัญญามอนทรีออล ค.ศ. 1999', 'Konvensi Montreal, 1999', 'Konvensyen Montreal, 1999'),
  'Parties to Conventions': p('Các Bên của Công ước', 'ภาคีอนุสัญญา', 'Pihak-pihak pada Konvensi', 'Pihak-pihak kepada Konvensyen'),
  'Powers of Consular Officers': p('Quyền hạn của Viên chức Lãnh sự', 'อำนาจของเจ้าหน้าที่กงสุล', 'Kewenangan Pejabat Konsuler', 'Kuasa Pegawai Konsular'),

  // ── 其他 ───────────────────────────────────────────────
  'FY 2025': p('Năm tài chính 2025', 'ปีงบประมาณ 2025', 'Tahun Anggaran 2025', 'Tahun Fiskal 2025'),
  'Taxable Services': p('Dịch vụ Chịu thuế', 'บริการที่ต้องเสียภาษี', 'Jasa Kena Pajak', 'Perkhidmatan Bercukai'),
  'Special Provisions': p('Quy định Đặc biệt', 'บทบัญญัติพิเศษ', 'Ketentuan Khusus', 'Peruntukan Khas'),

  // ── 补遗（第一批漏项）────────────────────────────────────
  'Limitation of Powers and Duties': p('Giới hạn Quyền hạn và Nghĩa vụ', 'การจำกัดอำนาจและหน้าที่', 'Pembatasan Kewenangan dan Kewajiban', 'Had Kuasa dan Kewajipan'),
  'Payment to Successful Subscriber': p('Thanh toán cho Người đăng ký Thành công', 'การชำระเงินให้ผู้จองที่ประสบความสำเร็จ', 'Pembayaran kepada Pelanggan yang Berhasil', 'Bayaran kepada Pelanggan yang Berjaya'),
  'Remission of Fee for Radio Licence': p('Miễn giảm Lệ phí Giấy phép Vô tuyến', 'การลดหย่อนค่าธรรมเนียมใบอนุญาตวิทยุ', 'Pembebasan Biaya Izin Radio', 'Pelepasan Fi Lesen Radio'),
  'Retention and Disposal of Instruments and Objects': p('Lưu giữ và Xử lý Công cụ và Vật dụng', 'การเก็บรักษาและการจำหน่ายเครื่องมือและสิ่งของ', 'Penyimpanan dan Pemusnahan Instrumen dan Benda', 'Penyimpanan dan Pelupusan Instrumen dan Benda'),
  'Rights Against Insurers': p('Quyền đối với Công ty Bảo hiểm', 'สิทธิเรียกร้องต่อผู้รับประกันภัย', 'Hak terhadap Penanggung', 'Hak terhadap Penanggung Insurans'),
  'Rights of Third Parties': p('Quyền của Bên thứ ba', 'สิทธิของบุคคลภายนอก', 'Hak Pihak Ketiga', 'Hak Pihak Ketiga'),
  'Royalties for Musical Records': p('Tiền bản quyền đối với Bản ghi Âm nhạc', 'ค่าลิขสิทธิ์สำหรับแผ่นเสียงเพลง', 'Royalti untuk Rekaman Musik', 'Royalti bagi Rakaman Muzik'),
  'Safety': p('An toàn', 'ความปลอดภัย', 'Keselamatan', 'Keselamatan'),
  'Savings and Transitional': SAV,
  'Savings and Transitional Provisions': SAV,
  'Suppression of Bombings': p('Trấn áp Đánh bom', 'การปราบปรามการวางระเบิด', 'Penindasan Pengeboman', 'Penindasan Pengebomanan'),
  'Suppression of Financing': p('Trấn áp Tài trợ', 'การปราบปรามการสนับสนุนทางการเงิน', 'Penindasan Pendanaan', 'Penindasan Pembiayaan'),
  'Suppression of Misuse of Radioactive Material': p('Trấn áp Việc Sử dụng Sai Vật liệu Phóng xạ', 'การปราบปรามการใช้วัสดุกัมมันตรังสีในทางที่ผิด', 'Penindasan Penyalahgunaan Bahan Radioaktif', 'Penindasan Penyalahgunaan Bahan Radioaktif'),
  'Temporary Provisions': p('Quy định Tạm thời', 'บทบัญญัติชั่วคราว', 'Ketentuan Sementara', 'Peruntukan Sementara'),
  'The Distinguished Service Order — Military': p('Huân chương Phục vụ Xuất sắc — Quân sự', 'เครื่องราชอิสริยาภรณ์บริการดีเด่น — ฝ่ายทหาร', 'Tanda Jasa Pelayanan Istimewa — Militer', 'Darjah Perkhidmatan Cemerlang — Tentera'),
  'Third-Party Funding': p('Tài trợ Bên thứ ba', 'การสนับสนุนทางการเงินโดยบุคคลภายนอก', 'Pendanaan Pihak Ketiga', 'Pembiayaan Pihak Ketiga'),
  'Transfer of Undertaking and Dissolution': p('Chuyển giao Doanh nghiệp và Giải thể', 'การโอนกิจการและการเลิกนิติบุคคล', 'Pengalihan Usaha dan Pembubaran', 'Pemindahan Perniagaan dan Pembubaran'),
  'Transitional Provisions for Section 34 Prohibition': p('Quy định Chuyển tiếp đối với Lệnh cấm theo Điều 34', 'บทบัญญัติเฉพาะกาลสำหรับการห้ามตามมาตรา 34', 'Ketentuan Peralihan untuk Larangan Pasal 34', 'Peruntukan Peralihan bagi Larangan Seksyen 34'),
  'Transitional Provisions for former ElderShield Scheme and former ElderShield Supplement Scheme': p('Quy định Chuyển tiếp đối với Chương trình ElderShield Trước đây và Chương trình Bổ sung ElderShield Trước đây', 'บทบัญญัติเฉพาะกาลสำหรับโครงการ ElderShield เดิมและโครงการเสริม ElderShield เดิม', 'Ketentuan Peralihan untuk Skema ElderShield Sebelumnya dan Skema Suplemen ElderShield Sebelumnya', 'Peruntukan Peralihan bagi Skim ElderShield Terdahulu dan Skim Tambahan ElderShield Terdahulu'),
  'Transitional Provisions — Confined Persons of Unsound Mind': p('Quy định Chuyển tiếp — Người Bị Giam giữ có Tâm trí Không lành mạnh', 'บทบัญญัติเฉพาะกาล — บุคคลที่ถูกควบคุมตัวซึ่งมีจิตไม่ปกติ', 'Ketentuan Peralihan — Orang yang Ditahan dengan Gangguan Jiwa', 'Peruntukan Peralihan — Orang Ditahan yang Tidak Siuman'),
  'Transitional Provisions — Further Proceedings and Joint Trials': p('Quy định Chuyển tiếp — Tố tụng Tiếp theo và Xét xử Chung', 'บทบัญญัติเฉพาะกาล — การดำเนินคดีต่อไปและการพิจารณาคดีร่วม', 'Ketentuan Peralihan — Proses Hukum Lanjutan dan Sidang Bersama', 'Peruntukan Peralihan — Prosiding Lanjutan dan Perbicaraan Bersama'),
  'Transitional and Savings Provision': p('Quy định Chuyển tiếp và Bảo lưu', 'บทบัญญัติเฉพาะกาลและการสงวนสิทธิ', 'Ketentuan Peralihan dan Penyimpanan Hak', 'Peruntukan Peralihan dan Pemeliharaan'),
  'United Nations Convention': p('Công ước Liên Hợp Quốc', 'อนุสัญญาสหประชาชาติ', 'Konvensi Perserikatan Bangsa-Bangsa', 'Konvensyen Pertubuhan Bangsa-Bangsa Bersatu'),
  'Unrestricted Areas': p('Khu vực Không Hạn chế', 'พื้นที่ที่ไม่จำกัด', 'Kawasan Tanpa Batasan', 'Kawasan Tanpa Sekatan'),
  'Withdrawals': p('Rút vốn', 'การถอนเงิน', 'Penarikan', 'Pengeluaran'),
};

module.exports = mod;
