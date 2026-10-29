'use strict';
// SG 尾段附注事项译名：第 12 批（N–P 段，82 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Nanyang / National（10） ──────────────────────────────────
  'Corporatisation': p('Chuyển thành pháp nhân tự chủ', 'การจัดตั้งเป็นนิติบุคคล', 'Korporatisasi', 'Pengkorporatan'),
  'Sector Membership': p('Tư cách thành viên ngành', 'การเป็นสมาชิกภาคส่วน', 'Keanggotaan Sektor', 'Keahlian Sektor'),
  'Micrographic and Reprographic Fees': p('Lệ phí vi phim và sao chép', 'ค่าธรรมเนียมการถ่ายไมโครฟิล์มและการทำสำเนา', 'Biaya Mikrografis dan Reproduksi', 'Fi Mikrografik dan Reprodugrafi'),
  'Museum Admission Fees': p('Lệ phí vào bảo tàng', 'ค่าธรรมเนียมเข้าพิพิธภัณฑ์', 'Biaya Masuk Museum', 'Fi Masuk Muzium'),
  'Fees and Charges': p('Lệ phí và các khoản thu', 'ค่าธรรมเนียมและค่าบริการ', 'Biaya dan Pungutan', 'Fi dan Caj'),
  'Prescribed Websites': p('Trang web theo quy định', 'เว็บไซต์ตามที่กำหนด', 'Situs Web yang Ditetapkan', 'Laman Web yang Ditetapkan'),
  'Photographs': p('Ảnh chân dung', 'รูปถ่าย', 'Foto', 'Gambar Foto'),
  'Prescribed Institutions': p('Tổ chức theo quy định', 'สถาบันตามที่กำหนด', 'Institusi yang Ditetapkan', 'Institusi yang Ditetapkan'),
  'Dissolution Date': p('Ngày giải thể', 'วันที่เลิก', 'Tanggal Pembubaran', 'Tarikh Pembubaran'),
  'Initial Appointments and Other Transitional Provisions': p('Bổ nhiệm ban đầu và các quy định chuyển tiếp khác', 'การแต่งตั้งครั้งแรกและบทบัญญัติเฉพาะกาลอื่น ๆ', 'Pengangkatan Awal dan Ketentuan Peralihan Lain', 'Pelantikan Awal dan Peruntukan Peralihan Lain'),

  // ── National Registry of Diseases（5） ────────────────────────
  'Liver — Post Hepatic Resection (Donor) Notification': p('Gan — Khai báo sau cắt gan (người hiến)', 'ตับ — การแจ้งหลังการตัดตับ (ผู้บริจาค)', 'Hati — Pemberitahuan Pascareseksi Hati (Donor)', 'Hati — Pemberitahuan Selepas Reseksi Hati (Penderma)'),
  'Single Kidney — Post Nephrectomy (Donor) Notification': p('Thận đơn — Khai báo sau cắt thận (người hiến)', 'ไตข้างเดียว — การแจ้งหลังการตัดไต (ผู้บริจาค)', 'Ginjal Tunggal — Pemberitahuan Pascanefrektomi (Donor)', 'Buah Pinggang Tunggal — Pemberitahuan Selepas Nefrektomi (Penderma)'),
  'Specified Entity for Acute Myocardial Infarction': p('Tổ chức được chỉ định cho nhồi máu cơ tim cấp', 'หน่วยงานที่ระบุสำหรับกล้ามเนื้อหัวใจตายเฉียบพลัน', 'Entitas Tertentu untuk Infark Miokard Akut', 'Entiti Tertentu bagi Infarksi Miokardium Akut'),
  'Specified Entity for Cancer': p('Tổ chức được chỉ định cho bệnh ung thư', 'หน่วยงานที่ระบุสำหรับโรคมะเร็ง', 'Entitas Tertentu untuk Kanker', 'Entiti Tertentu bagi Kanser'),
  'Specified Entity for Chronic Kidney Failure': p('Tổ chức được chỉ định cho suy thận mạn', 'หน่วยงานที่ระบุสำหรับภาวะไตวายเรื้อรัง', 'Entitas Tertentu untuk Gagal Ginjal Kronis', 'Entiti Tertentu bagi Kegagalan Buah Pinggang Kronik'),

  // ── National Servicemen（3） ──────────────────────────────────
  'Employment': p('Việc làm', 'การจ้างงาน', 'Ketenagakerjaan', 'Pekerjaan'),
  'Private Employers and Statutory Bodies': p('Người sử dụng lao động tư nhân và cơ quan luật định', 'นายจ้างเอกชนและหน่วยงานตามกฎหมาย', 'Pemberi Kerja Swasta dan Badan Statuter', 'Majikan Swasta dan Badan Berkanun'),

  // ── Newspaper and Printing Presses（4） ───────────────────────
  'Exemption from Part III of Act': p('Miễn trừ Phần III của Luật', 'การยกเว้นภาค III แห่งพระราชบัญญัติ', 'Pembebasan Bagian III Undang-Undang', 'Pengecualian Bahagian III Akta'),
  'Exemption — Sin Chew Jit Poh (Singapore) Limited': p('Miễn trừ — Sin Chew Jit Poh (Singapore) Limited', 'การยกเว้น — Sin Chew Jit Poh (Singapore) Limited', 'Pembebasan — Sin Chew Jit Poh (Singapore) Limited', 'Pengecualian — Sin Chew Jit Poh (Singapore) Limited'),
  'Events approved by Singapore Tourist Promotion Board': p('Sự kiện được Hội đồng Xúc tiến Du lịch Singapore chấp thuận', 'กิจกรรมที่ได้รับอนุมัติจากคณะกรรมการส่งเสริมการท่องเที่ยวสิงคโปร์', 'Acara yang Disetujui Badan Promosi Pariwisata Singapura', 'Acara yang Diluluskan Lembaga Promosi Pelancongan Singapura'),
  'Reuters, Jiji Press Ltd and Kyodo News Service': p('Reuters, Jiji Press Ltd và Kyodo News Service', 'Reuters, Jiji Press Ltd และ Kyodo News Service', 'Reuters, Jiji Press Ltd dan Kyodo News Service', 'Reuters, Jiji Press Ltd dan Kyodo News Service'),

  // ── Nurses / Oaths / Organised Crime（3） ─────────────────────
  'Exemption for Approved Pharmacists': p('Miễn trừ cho dược sĩ được chấp thuận', 'การยกเว้นสำหรับเภสัชกรที่ได้รับอนุมัติ', 'Pembebasan bagi Apoteker yang Disetujui', 'Pengecualian bagi Ahli Farmasi yang Diluluskan'),
  'Prescribed Persons': p('Người theo quy định', 'บุคคลตามที่กำหนด', 'Orang yang Ditetapkan', 'Orang yang Ditetapkan'),
  'Prescribed Law Enforcement Agency': p('Cơ quan thực thi pháp luật theo quy định', 'หน่วยงานบังคับใช้กฎหมายตามที่กำหนด', 'Lembaga Penegak Hukum yang Ditetapkan', 'Agensi Penguatkuasaan Undang-Undang yang Ditetapkan'),

  // ── Online Criminal Harms（3） ────────────────────────────────
  'Reconsideration Application and Appeal Fee': p('Lệ phí xin xem xét lại và kháng nghị', 'ค่าธรรมเนียมการขอทบทวนและการอุทธรณ์', 'Biaya Permohonan Peninjauan Ulang dan Banding', 'Fi Permohonan Semakan Semula dan Rayuan'),
  'Reviewing Tribunals': p('Hội đồng xem xét', 'คณะกรรมการทบทวน', 'Tribunal Peninjau', 'Tribunal Semakan'),
  'Service': p('Tống đạt', 'การส่งหมาย', 'Penyampaian', 'Penyerahan'),

  // ── Online Safety（9） ────────────────────────────────────────
  'Relief and Accountability': p('Biện pháp khắc phục và trách nhiệm giải trình', 'การเยียวยาและความรับผิดชอบ', 'Pemulihan dan Akuntabilitas', 'Pelepasan dan Akauntabiliti'),
  'Damages in Court Proceedings': p('Thiệt hại trong tố tụng tòa án', 'ค่าเสียหายในกระบวนพิจารณาของศาล', 'Ganti Rugi dalam Proses Pengadilan', 'Ganti Rugi dalam Prosiding Mahkamah'),
  'End-User Identity': p('Danh tính người dùng cuối', 'ตัวตนผู้ใช้ปลายทาง', 'Identitas Pengguna Akhir', 'Identiti Pengguna Akhir'),
  'Exclusion of Liability': p('Loại trừ trách nhiệm', 'การยกเว้นความรับผิด', 'Pengecualian Tanggung Jawab', 'Pengecualian Liabiliti'),
  'Online Harm Notice': p('Thông báo tác hại trực tuyến', 'หนังสือแจ้งอันตรายออนไลน์', 'Pemberitahuan Bahaya Daring', 'Notis Bahaya Dalam Talian'),
  'Prescribed Online Service Providers': p('Nhà cung cấp dịch vụ trực tuyến theo quy định', 'ผู้ให้บริการออนไลน์ตามที่กำหนด', 'Penyedia Layanan Daring yang Ditetapkan', 'Penyedia Perkhidmatan Dalam Talian yang Ditetapkan'),
  'Parts 10 to 14': p('Phần 10 đến 14', 'ภาค 10 ถึง 14', 'Bagian 10 sampai 14', 'Bahagian 10 hingga 14'),
  'Parts 5 and 6': p('Phần 5 và 6', 'ภาค 5 และ 6', 'Bagian 5 dan 6', 'Bahagian 5 dan 6'),
  'Reconsideration and Appeal': p('Xem xét lại và kháng nghị', 'การทบทวนและการอุทธรณ์', 'Peninjauan Ulang dan Banding', 'Semakan Semula dan Rayuan'),
  'Reports to Commissioner': p('Báo cáo gửi Ủy viên', 'รายงานต่อผู้ตรวจการ', 'Laporan kepada Komisioner', 'Laporan kepada Pesuruhjaya'),

  // ── Optometrists and Opticians（4） ───────────────────────────
  'Investigation of Complaints': p('Điều tra khiếu nại', 'การสอบสวนข้อร้องเรียน', 'Investigasi Keluhan', 'Siasatan Aduan'),
  'Practice, Conduct, Ethics and Publicity': p('Hành nghề, hành vi, đạo đức và quảng bá', 'การประกอบวิชาชีพ ความประพฤติ จริยธรรม และการโฆษณา', 'Praktik, Perilaku, Etika dan Publisitas', 'Amalan, Kelakuan, Etika dan Publisiti'),
  'Registration and Practising Certificates': p('Đăng ký và giấy chứng nhận hành nghề', 'การขึ้นทะเบียนและใบอนุญาตประกอบวิชาชีพ', 'Pendaftaran dan Sertifikat Praktik', 'Pendaftaran dan Sijil Amalan'),

  // ── Parking Places（8） ──────────────────────────────────────
  'Exemption from Part 3': p('Miễn trừ Phần 3', 'การยกเว้นภาค 3', 'Pembebasan Bagian 3', 'Pengecualian Bahagian 3'),
  'Licensing and Control of Private Parking Places for Heavy Vehicles': p('Cấp phép và kiểm soát bãi đỗ xe tư nhân cho xe hạng nặng', 'การออกใบอนุญาตและการควบคุมสถานที่จอดรถเอกชนสำหรับรถยนต์ขนาดหนัก', 'Perizinan dan Pengendalian Tempat Parkir Swasta untuk Kendaraan Berat', 'Pelesenan dan Kawalan Tempat Letak Kereta Persendirian bagi Kenderaan Berat'),
  'Parking of Heavy Vehicles — Exemption': p('Đỗ xe hạng nặng — Miễn trừ', 'การจอดรถยนต์ขนาดหนัก — การยกเว้น', 'Parkir Kendaraan Berat — Pembebasan', 'Meletak Kenderaan Berat — Pengecualian'),
  'Parking of Heavy Vehicles — Lodgement': p('Đỗ xe hạng nặng — Khai báo', 'การจอดรถยนต์ขนาดหนัก — การยื่นเรื่อง', 'Parkir Kendaraan Berat — Pendaftaran', 'Meletak Kenderaan Berat — Pemfailan'),
  'Parking of Heavy Vehicles': p('Đỗ xe hạng nặng', 'การจอดรถยนต์ขนาดหนัก', 'Parkir Kendaraan Berat', 'Meletak Kenderaan Berat'),
  'Provision of Parking Places and Parking Lots': p('Cung cấp bãi đỗ xe và ô đỗ xe', 'การจัดหาสถานที่จอดรถและช่องจอดรถ', 'Penyediaan Tempat Parkir dan Petak Parkir', 'Penyediaan Tempat Letak Kereta dan Petak Letak Kereta'),
  'Surcharge': p('Phụ phí', 'ค่าธรรมเนียมเพิ่ม', 'Biaya Tambahan', 'Caj Tambahan'),
  'Vehicle Removal, Storage and Release Charges': p('Phí di dời, lưu giữ và trả xe', 'ค่าธรรมเนียมการเคลื่อนย้าย การเก็บรักษา และการปล่อยรถ', 'Biaya Pemindahan, Penyimpanan dan Pengeluaran Kendaraan', 'Caj Pengalihan, Penyimpanan dan Pelepasan Kenderaan'),

  // ── Parks and Trees（5） ─────────────────────────────────────
  'Heritage Road Green Buffers': p('Dải cây xanh đường di sản', 'แนวกันชนสีเขียวถนนมรดก', 'Penyangga Hijau Jalan Warisan', 'Penampan Hijau Jalan Warisan'),
  'Marine Parks': p('Công viên biển', 'อุทยานทางทะเล', 'Taman Laut', 'Taman Laut'),
  'Planting Areas': p('Khu vực trồng cây', 'พื้นที่ปลูกต้นไม้', 'Area Penanaman', 'Kawasan Penanaman'),
  'Preservation of Trees': p('Bảo tồn cây xanh', 'การอนุรักษ์ต้นไม้', 'Pelestarian Pohon', 'Pemeliharaan Pokok'),

  // ── Parliament / Payment and Settlement / Pensions（3） ───────
  'Privileges, Immunities and Powers': p('Đặc quyền, miễn trừ và quyền hạn', 'เอกสิทธิ์ ความคุ้มกัน และอำนาจ', 'Hak Istimewa, Kekebalan dan Kekuasaan', 'Keistimewaan, Kekebalan dan Kuasa'),
  'Finality and Netting': p('Tính chung thẩm và bù trừ', 'ความสิ้นสุดและการหักกลบลบหนี้', 'Kepastian dan Pengiraan Bersih', 'Kemuktamadan dan Pengiraan Bersih'),
  'Expatriate Officers': p('Cán bộ người nước ngoài', 'เจ้าหน้าที่ชาวต่างประเทศ', 'Pejabat Ekspatriat', 'Pegawai Ekspatriat'),

  // ── Pingat 系列（7）：奖章马来语原名保留，只译军警分支与英文奖章名 ──
  'Polis': p('Cảnh sát', 'ตำรวจ', 'Polisi', 'Polis'),
  'Tentera': p('Quân đội', 'ทหาร', 'Militer', 'Tentera'),
  'The Long Service Medal — Police': p('Huân chương Phục vụ Lâu năm — Cảnh sát', 'เหรียญราชการยาวนาน — ตำรวจ', 'Medali Pengabdian Lama — Polisi', 'Pingat Perkhidmatan Lama — Polis'),
  'The Long Service Medal –– Military': p('Huân chương Phục vụ Lâu năm — Quân đội', 'เหรียญราชการยาวนาน — ทหาร', 'Medali Pengabdian Lama — Militer', 'Pingat Perkhidmatan Lama — Tentera'),
  'the Efficiency Medal — Military': p('Huân chương Hiệu quả — Quân đội', 'เหรียญประสิทธิภาพ — ทหาร', 'Medali Efisiensi — Militer', 'Pingat Kecekapan — Tentera'),
  'The Conspicuous Gallantry Medal — Military': p('Huân chương Dũng cảm Xuất sắc — Quân đội', 'เหรียญกล้าหาญดีเด่น — ทหาร', 'Medali Keberanian Terkemuka — Militer', 'Pingat Keberanian Cemerlang — Tentera'),
  'the Meritorious Service Medal — Military': p('Huân chương Phục vụ Công trạng — Quân đội', 'เหรียญราชการดีเด่น — ทหาร', 'Medali Pengabdian Berjasa — Militer', 'Pingat Perkhidmatan Berjasa — Tentera'),
  'Commendation Medal — Military': p('Huân chương Tuyên dương — Quân đội', 'เหรียญชมเชย — ทหาร', 'Medali Pujian — Militer', 'Pingat Kepujian — Tentera'),
  'the Public Administration Medal — Military': p('Huân chương Hành chính Công — Quân đội', 'เหรียญบริหารราชการ — ทหาร', 'Medali Administrasi Publik — Militer', 'Pingat Pentadbiran Awam — Tentera'),

  // ── Pioneer Generation（1） ──────────────────────────────────
  'Pioneer Generation and Merdeka Generation Benefits': p('Phúc lợi Thế hệ Tiên phong và Thế hệ Merdeka', 'สิทธิประโยชน์ของรุ่นผู้บุกเบิกและรุ่นเมอร์เดกา', 'Manfaat Generasi Perintis dan Generasi Merdeka', 'Faedah Generasi Perintis dan Generasi Merdeka'),

  // ── Planning（8） ────────────────────────────────────────────
  'Housing and Development Board Commercial Premises and Living Quarters Authorisation': p('Cho phép cơ sở thương mại và nhà ở của Ủy ban Nhà ở và Phát triển', 'การอนุญาตสถานที่เชิงพาณิชย์และที่พักอาศัยของคณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Otorisasi Tempat Komersial dan Tempat Tinggal Badan Perumahan dan Pembangunan', 'Kebenaran Premis Komersial dan Tempat Kediaman Lembaga Perumahan dan Pembangunan'),
  'Housing and Development Board Flats Authorisation': p('Cho phép căn hộ của Ủy ban Nhà ở và Phát triển', 'การอนุญาตแฟลตของคณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Otorisasi Flat Badan Perumahan dan Pembangunan', 'Kebenaran Flat Lembaga Perumahan dan Pembangunan'),
  'Housing and Development Board Home-Office Scheme': p('Chương trình làm việc tại nhà của Ủy ban Nhà ở và Phát triển', 'โครงการทำงานที่บ้านของคณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Skema Kantor Rumah Badan Perumahan dan Pembangunan', 'Skim Pejabat Rumah Lembaga Perumahan dan Pembangunan'),
  'Housing and Development Board Outdoor Refreshment Areas': p('Khu giải khát ngoài trời của Ủy ban Nhà ở và Phát triển', 'พื้นที่รับประทานอาหารกลางแจ้งของคณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Area Rekreasi Luar Ruang Badan Perumahan dan Pembangunan', 'Kawasan Jamuan Luar Lembaga Perumahan dan Pembangunan'),
  'Leases and Disposal of Land': p('Cho thuê và định đoạt đất', 'การเช่าและการจำหน่ายที่ดิน', 'Sewa dan Pelepasan Tanah', 'Pajakan dan Pelupusan Tanah'),
  'Master Plan': p('Quy hoạch tổng thể', 'ผังเมืองรวม', 'Rencana Induk', 'Pelan Induk'),
  'Subdivision of Land and Building — Authorisation': p('Phân chia đất và công trình — Cho phép', 'การแบ่งที่ดินและอาคาร — การอนุญาต', 'Pemecahan Tanah dan Bangunan — Otorisasi', 'Pembahagian Tanah dan Bangunan — Kebenaran'),
  'Use Classes': p('Nhóm mục đích sử dụng', 'ประเภทการใช้ประโยชน์', 'Kelas Penggunaan', 'Kelas Penggunaan'),

  // ── Platform Workers（3） ────────────────────────────────────
  'Notification of Commissioner': p('Thông báo của Ủy viên', 'การแจ้งของผู้ตรวจการ', 'Pemberitahuan Komisioner', 'Pemberitahuan Pesuruhjaya'),
  'Platform Work Associations — Expenditure of Funds': p('Hiệp hội lao động nền tảng — Chi tiêu quỹ', 'สมาคมงานแพลตฟอร์ม — การใช้จ่ายเงินทุน', 'Asosiasi Kerja Platform — Pengeluaran Dana', 'Persatuan Kerja Platform — Perbelanjaan Dana'),
  'Platform Work Associations': p('Hiệp hội lao động nền tảng', 'สมาคมงานแพลตฟอร์ม', 'Asosiasi Kerja Platform', 'Persatuan Kerja Platform'),

  // ── Public Order and Safety / Public Sector / Public Service（4） ──
  'Special Powers': p('Quyền hạn đặc biệt', 'อำนาจพิเศษ', 'Kekuasaan Khusus', 'Kuasa Khas'),
  'Governance': p('Quản trị', 'การกำกับดูแล', 'Tata Kelola', 'Tadbir Urus'),
  'Monthly Variable Component and Non-pensionable Annual Allowance': p('Thành phần biến đổi hằng tháng và phụ cấp thường niên không tính lương hưu', 'ส่วนประกอบผันแปรรายเดือนและเงินช่วยเหลือประจำปีที่ไม่นำไปคำนวณบำนาญ', 'Komponen Variabel Bulanan dan Tunjangan Tahunan Tidak Berpensiun', 'Komponen Boleh Ubah Bulanan dan Elaun Tahunan Tidak Berpencen'),
  'Service Commissions': p('Các ủy ban dịch vụ công', 'คณะกรรมการบริการ', 'Komisi Layanan', 'Suruhanjaya Perkhidmatan'),
};

module.exports = mod;
