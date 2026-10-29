'use strict';
// SG 尾段附注事项译名：第 7 批（H–I 段，85 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Hazardous Waste（2） ───────────────────────────────────────
  'Control of Export, Import and Transit': p('Kiểm soát xuất khẩu, nhập khẩu và quá cảnh', 'การควบคุมการส่งออก การนำเข้า และการขนถ่ายผ่านแดน', 'Pengendalian Ekspor, Impor dan Transit', 'Kawalan Eksport, Import dan Transit'),

  // ── Health Products（7） ──────────────────────────────────────
  'Good Manufacturing Practice Certificate — Cosmetic Products': p('Giấy chứng nhận thực hành sản xuất tốt — Sản phẩm mỹ phẩm', 'หนังสือรับรองหลักเกณฑ์วิธีการผลิตที่ดี — ผลิตภัณฑ์เครื่องสำอาง', 'Sertifikat Cara Pembuatan yang Baik — Produk Kosmetik', 'Sijil Amalan Pengilangan Baik — Produk Kosmetik'),
  'Licensing of Retail Pharmacies': p('Cấp phép nhà thuốc bán lẻ', 'การออกใบอนุญาตร้านขายยา', 'Perizinan Apotek Ritel', 'Pelesenan Farmasi Runcit'),
  'Medical Devices and Therapeutic Products for World Aquatics Delegations — Exemption': p('Trang thiết bị y tế và sản phẩm trị liệu cho đoàn đại biểu World Aquatics — Miễn trừ', 'อุปกรณ์การแพทย์และผลิตภัณฑ์บำบัดสำหรับคณะผู้แทน World Aquatics — การยกเว้น', 'Perangkat Medis dan Produk Terapeutik bagi Delegasi World Aquatics — Pembebasan', 'Peranti Perubatan dan Produk Terapeutik bagi Delegasi World Aquatics — Pengecualian'),
  'Medical Devices': p('Trang thiết bị y tế', 'อุปกรณ์การแพทย์', 'Perangkat Medis', 'Peranti Perubatan'),
  'Oral Dental Gums': p('Kẹo cao su nha khoa', 'หมากฝรั่งทางทันตกรรม', 'Permen Karet Gigi', 'Gula-gula Getah Pergigian'),
  'Supply of Medical Devices — Exemption': p('Cung cấp trang thiết bị y tế — Miễn trừ', 'การจัดหาอุปกรณ์การแพทย์ — การยกเว้น', 'Pasokan Perangkat Medis — Pembebasan', 'Pembekalan Peranti Perubatan — Pengecualian'),
  'Therapeutic Products': p('Sản phẩm trị liệu', 'ผลิตภัณฑ์บำบัด', 'Produk Terapeutik', 'Produk Terapeutik'),

  // ── Healthcare Services（9） ──────────────────────────────────
  'Exemption for Influenza Vaccination at Approved Retail Pharmacies': p('Miễn trừ cho tiêm phòng cúm tại nhà thuốc bán lẻ được chấp thuận', 'การยกเว้นสำหรับการฉีดวัคซีนไข้หวัดใหญ่ที่ร้านขายยาที่ได้รับอนุมัติ', 'Pembebasan bagi Vaksinasi Influenza di Apotek Ritel yang Disetujui', 'Pengecualian bagi Vaksinasi Influenza di Farmasi Runcit yang Diluluskan'),
  'Human Tissue Banking Service': p('Dịch vụ ngân hàng mô người', 'บริการธนาคารเนื้อเยื่อมนุษย์', 'Layanan Bank Jaringan Manusia', 'Perkhidmatan Bank Tisu Manusia'),
  'Institute of Mental Health': p('Viện Sức khỏe Tâm thần', 'สถาบันสุขภาพจิต', 'Institut Kesehatan Jiwa', 'Institut Kesihatan Mental'),
  'National University Hospital (Singapore) Pte Ltd — Exemption': p('National University Hospital (Singapore) Pte Ltd — Miễn trừ', 'National University Hospital (Singapore) Pte Ltd — การยกเว้น', 'National University Hospital (Singapore) Pte Ltd — Pembebasan', 'National University Hospital (Singapore) Pte Ltd — Pengecualian'),
  'Nuclear Medicine Service': p('Dịch vụ y học hạt nhân', 'บริการเวชศาสตร์นิวเคลียร์', 'Layanan Kedokteran Nuklir', 'Perkhidmatan Perubatan Nuklear'),
  'Nursing Home Service': p('Dịch vụ nhà dưỡng lão', 'บริการสถานพยาบาลผู้สูงอายุ', 'Layanan Panti Jompo', 'Perkhidmatan Rumah Jagaan'),
  'Outpatient Dental Service': p('Dịch vụ nha khoa ngoại trú', 'บริการทันตกรรมผู้ป่วยนอก', 'Layanan Gigi Rawat Jalan', 'Perkhidmatan Pergigian Pesakit Luar'),
  'Outpatient Medical Service': p('Dịch vụ y tế ngoại trú', 'บริการทางการแพทย์ผู้ป่วยนอก', 'Layanan Medis Rawat Jalan', 'Perkhidmatan Perubatan Pesakit Luar'),
  'Outpatient Renal Dialysis Service': p('Dịch vụ lọc thận ngoại trú', 'บริการฟอกไตผู้ป่วยนอก', 'Layanan Dialisis Ginjal Rawat Jalan', 'Perkhidmatan Dialisis Buah Pinggang Pesakit Luar'),

  // ── Healthcare Services Act 2020（2） ─────────────────────────
  'Saving and Transitional Provisions': p('Quy định bảo lưu và chuyển tiếp', 'บทบัญญัติการสงวนสิทธิและเฉพาะกาล', 'Ketentuan Penyimpanan Hak dan Peralihan', 'Peruntukan Pemeliharaan dan Peralihan'),

  // ── High Court（1） ───────────────────────────────────────────
  'Admiralty Jurisdiction': p('Thẩm quyền hàng hải', 'เขตอำนาจทางทะเล', 'Yurisdiksi Kelautan', 'Bidang Kuasa Admiraliti'),

  // ── Hire-Purchase（1） ────────────────────────────────────────
  'Motor Vehicles': p('Xe cơ giới', 'ยานยนต์', 'Kendaraan Bermotor', 'Kenderaan Bermotor'),

  // ── Home Affairs Uniformed Services（2） ──────────────────────
  'INVEST Fund': p('Quỹ INVEST', 'กองทุน INVEST', 'Dana INVEST', 'Dana INVEST'),
  'INVEST Plan': p('Kế hoạch INVEST', 'แผน INVEST', 'Rencana INVEST', 'Pelan INVEST'),

  // ── Home Team Corps（2） ──────────────────────────────────────
  'Long Service Medal': p('Huân chương phục vụ lâu năm', 'เหรียญราชการยาวนาน', 'Medali Pengabdian Lama', 'Pingat Perkhidmatan Lama'),
  'Service Medal': p('Huân chương phục vụ', 'เหรียญราชการ', 'Medali Pengabdian', 'Pingat Perkhidmatan'),

  // ── Home Team Science and Technology Agency（1） ──────────────
  'Transfer Date': p('Ngày chuyển giao', 'วันที่โอน', 'Tanggal Pengalihan', 'Tarikh Pindahan'),

  // ── Housing and Development（17） ─────────────────────────────
  'Exemptions from Section 50(1) of Act': p('Miễn trừ theo Điều 50(1) của Luật', 'การยกเว้นตามมาตรา 50(1) แห่งพระราชบัญญัติ', 'Pembebasan dari Pasal 50(1) Undang-Undang', 'Pengecualian daripada Seksyen 50(1) Akta'),
  'Interest and Penalties for Late Payment of Improvement Contributions': p('Lãi và tiền phạt do chậm nộp khoản đóng góp cải thiện', 'ดอกเบี้ยและค่าปรับสำหรับการชำระเงินสมทบปรับปรุงล่าช้า', 'Bunga dan Denda atas Keterlambatan Pembayaran Iuran Perbaikan', 'Faedah dan Penalti bagi Kelewatan Bayaran Sumbangan Penambahbaikan'),
  'Jurong Town Corporation': p('Tổng công ty Thị trấn Jurong', 'บรรษัทเมืองจูร่ง', 'Korporasi Kota Jurong', 'Perbadanan Bandar Jurong'),
  'Maintenance Fees and Rent — Commercial Properties and Hawker Stalls': p('Phí bảo trì và tiền thuê — Bất động sản thương mại và quầy hàng rong', 'ค่าบำรุงรักษาและค่าเช่า — อสังหาริมทรัพย์เชิงพาณิชย์และแผงลอย', 'Biaya Pemeliharaan dan Sewa — Properti Komersial dan Kios Pedagang Kaki Lima', 'Fi Penyelenggaraan dan Sewa — Hartanah Komersial dan Gerai Penjaja'),
  'Mortgage to Lender': p('Thế chấp cho bên cho vay', 'การจำนองแก่ผู้ให้กู้', 'Hipotek kepada Pemberi Pinjaman', 'Gadai Janji kepada Pemberi Pinjaman'),
  'NTUC Income Insurance Co-operative Limited': p('NTUC Income Insurance Co-operative Limited', 'NTUC Income Insurance Co-operative Limited', 'NTUC Income Insurance Co-operative Limited', 'NTUC Income Insurance Co-operative Limited'),
  'Penalties for Late Payment — Markets and Food Centres': p('Tiền phạt do chậm nộp — Chợ và trung tâm thực phẩm', 'ค่าปรับสำหรับการชำระล่าช้า — ตลาดและศูนย์อาหาร', 'Denda atas Keterlambatan Pembayaran — Pasar dan Pusat Makanan', 'Penalti bagi Kelewatan Bayaran — Pasaran dan Pusat Makanan'),
  'Penalties for Late Payment': p('Tiền phạt do chậm nộp', 'ค่าปรับสำหรับการชำระล่าช้า', 'Denda atas Keterlambatan Pembayaran', 'Penalti bagi Kelewatan Bayaran'),
  'Penalties — Rental Flats': p('Tiền phạt — Căn hộ cho thuê', 'ค่าปรับ — แฟลตเช่า', 'Denda — Flat Sewa', 'Penalti — Flat Sewa'),
  'Polling for Upgrading Works': p('Bỏ phiếu về công trình nâng cấp', 'การลงคะแนนเสียงสำหรับงานปรับปรุง', 'Pemungutan Suara untuk Pekerjaan Peningkatan', 'Pengundian untuk Kerja Naik Taraf'),
  'Precincts for Upgrading Works': p('Khu vực thực hiện công trình nâng cấp', 'เขตพื้นที่งานปรับปรุง', 'Kawasan Pekerjaan Peningkatan', 'Kawasan Kerja Naik Taraf'),
  'Revitalisation of Shops Scheme': p('Chương trình làm mới cửa hàng', 'โครงการฟื้นฟูร้านค้า', 'Skema Revitalisasi Toko', 'Skim Pemulihan Kedai'),
  'Renovation Control': p('Kiểm soát cải tạo', 'การควบคุมการตกแต่งใหม่', 'Pengendalian Renovasi', 'Kawalan Pengubahsuaian'),
  'Singapore Labour Foundation': p('Quỹ Lao động Singapore', 'มูลนิธิแรงงานสิงคโปร์', 'Yayasan Tenaga Kerja Singapura', 'Yayasan Buruh Singapura'),
  'Variation of Maintenance Fees for Pre-war shops in Tiong Bahru Housing Estate': p('Điều chỉnh phí bảo trì đối với cửa hàng thời kỳ trước chiến tranh tại khu nhà ở Tiong Bahru', 'การเปลี่ยนแปลงค่าบำรุงรักษาสำหรับร้านค้าสมัยก่อนสงครามในนิคมที่อยู่อาศัยเตียงบาห์รู', 'Perubahan Biaya Pemeliharaan untuk Toko Era Prawar di Perumahan Tiong Bahru', 'Perubahan Fi Penyelenggaraan untuk Kedai Zaman Praperang di Perumahan Tiong Bahru'),
  'Variation of Maintenance Fees for Residential Properties': p('Điều chỉnh phí bảo trì đối với bất động sản nhà ở', 'การเปลี่ยนแปลงค่าบำรุงรักษาสำหรับอสังหาริมทรัพย์ที่อยู่อาศัย', 'Perubahan Biaya Pemeliharaan untuk Properti Hunian', 'Perubahan Fi Penyelenggaraan untuk Hartanah Kediaman'),

  // ── Housing Developers（3） ───────────────────────────────────
  'Project Account': p('Tài khoản dự án', 'บัญชีโครงการ', 'Akun Proyek', 'Akaun Projek'),
  'Show Unit': p('Nhà mẫu', 'ห้องตัวอย่าง', 'Unit Contoh', 'Unit Contoh'),

  // ── Human Biomedical Research（4） ────────────────────────────
  'Requirements for Appropriate Consent — Exemption': p('Yêu cầu về sự đồng ý phù hợp — Miễn trừ', 'ข้อกำหนดเกี่ยวกับความยินยอมที่เหมาะสม — การยกเว้น', 'Persyaratan Persetujuan yang Layak — Pembebasan', 'Keperluan Persetujuan yang Wajar — Pengecualian'),
  'Restricted Research': p('Nghiên cứu bị hạn chế', 'การวิจัยที่ถูกจำกัด', 'Penelitian Terbatas', 'Penyelidikan Terhad'),
  'Tissue Banking and Notification — Exemption': p('Ngân hàng mô và thông báo — Miễn trừ', 'ธนาคารเนื้อเยื่อและการแจ้ง — การยกเว้น', 'Bank Jaringan dan Pemberitahuan — Pembebasan', 'Bank Tisu dan Pemberitahuan — Pengecualian'),
  'Tissue Banking': p('Ngân hàng mô', 'ธนาคารเนื้อเยื่อ', 'Bank Jaringan', 'Bank Tisu'),

  // ── Human Organ Transplant（1） ───────────────────────────────
  'Specified Products': p('Sản phẩm được chỉ định', 'ผลิตภัณฑ์ที่ระบุ', 'Produk Tertentu', 'Produk Tertentu'),

  // ── Hydrogen Cyanide（2） ─────────────────────────────────────
  'Fumigation': p('Xông hơi khử trùng', 'การอบด้วยแก๊ส', 'Fumigasi', 'Pengasapan'),

  // ── Immigration（11） ─────────────────────────────────────────
  'Exemption from Section 36(1)': p('Miễn trừ theo Điều 36(1)', 'การยกเว้นตามมาตรา 36(1)', 'Pembebasan Pasal 36(1)', 'Pengecualian Seksyen 36(1)'),
  'Exemption from Section 6': p('Miễn trừ theo Điều 6', 'การยกเว้นตามมาตรา 6', 'Pembebasan Pasal 6', 'Pengecualian Seksyen 6'),
  'Exemption from Singapore Visa — IEA Regional Cooperation Centre': p('Miễn trừ thị thực Singapore — Trung tâm Hợp tác Khu vực IEA', 'การยกเว้นวีซ่าสิงคโปร์ — ศูนย์ความร่วมมือระดับภูมิภาค IEA', 'Pembebasan Visa Singapura — Pusat Kerja Sama Regional IEA', 'Pengecualian Visa Singapura — Pusat Kerjasama Serantau IEA'),
  'Exemption from Singapore Visa': p('Miễn trừ thị thực Singapore', 'การยกเว้นวีซ่าสิงคโปร์', 'Pembebasan Visa Singapura', 'Pengecualian Visa Singapura'),
  'Immigration Depots': p('Trạm quản lý xuất nhập cảnh', 'ด่านตรวจคนเข้าเมือง', 'Depo Imigrasi', 'Depoh Imigresen'),
  'International Tribunal for the Law of the Sea — Exemption from Section 6': p('Tòa án Quốc tế về Luật Biển — Miễn trừ theo Điều 6', 'ศาลระหว่างประเทศว่าด้วยกฎหมายทะเล — การยกเว้นตามมาตรา 6', 'Pengadilan Internasional untuk Hukum Laut — Pembebasan Pasal 6', 'Tribunal Antarabangsa bagi Undang-Undang Laut — Pengecualian Seksyen 6'),
  'Prescribed Law Enforcement Agencies': p('Cơ quan thực thi pháp luật theo quy định', 'หน่วยงานบังคับใช้กฎหมายตามที่กำหนด', 'Lembaga Penegak Hukum yang Ditetapkan', 'Agensi Penguatkuasaan Undang-Undang yang Ditetapkan'),
  'Prohibition of Entry': p('Cấm nhập cảnh', 'การห้ามเข้าเมือง', 'Larangan Masuk', 'Larangan Masuk'),
  'Section 57(1)(d) — Exemption': p('Điều 57(1)(d) — Miễn trừ', 'มาตรา 57(1)(d) — การยกเว้น', 'Pasal 57(1)(d) — Pembebasan', 'Seksyen 57(1)(d) — Pengecualian'),
  'Special Entry and Clearance Arrangements': p('Thỏa thuận nhập cảnh và thông quan đặc biệt', 'ข้อตกลงการเข้าเมืองและการตรวจปล่อยพิเศษ', 'Pengaturan Masuk dan Pengeluaran Khusus', 'Pengaturan Masuk dan Pelepasan Khas'),
  'Temporary Authorised Place of Entry and Departure — Singapore Airshow 2024': p('Địa điểm nhập cảnh và xuất cảnh được ủy quyền tạm thời — Triển lãm Hàng không Singapore 2024', 'สถานที่เข้าและออกที่ได้รับอนุญาตชั่วคราว — งานแสดงการบินสิงคโปร์ 2024', 'Tempat Masuk dan Keluar yang Diberi Wewenang Sementara — Pameran Dirgantara Singapura 2024', 'Tempat Masuk dan Keluar yang Dibenarkan Sementara — Pameran Udara Singapura 2024'),

  // ── Industrial Relations（3） ─────────────────────────────────
  'Recognition of a Platform Work Association of Platform Workers': p('Công nhận hiệp hội lao động nền tảng của người lao động nền tảng', 'การรับรองสมาคมงานแพลตฟอร์มของผู้ทำงานแพลตฟอร์ม', 'Pengakuan Asosiasi Kerja Platform Pekerja Platform', 'Pengiktirafan Persatuan Kerja Platform Pekerja Platform'),
  'Recognition of a Trade Union of Employees': p('Công nhận công đoàn của người lao động', 'การรับรองสหภาพแรงงานของลูกจ้าง', 'Pengakuan Serikat Pekerja Karyawan', 'Pengiktirafan Kesatuan Sekerja Pekerja'),
  'Referee Appeal': p('Kháng nghị lên trọng tài', 'การอุทธรณ์ต่อผู้ชี้ขาด', 'Banding kepada Wasit', 'Rayuan kepada Penimbang Tara'),

  // ── Infectious Diseases（7） ──────────────────────────────────
  'Infected Areas': p('Khu vực nhiễm bệnh', 'พื้นที่ติดเชื้อ', 'Daerah Terinfeksi', 'Kawasan Berjangkit'),
  'Measures to Prevent Spread of Infectious Diseases': p('Biện pháp ngăn ngừa lây lan bệnh truyền nhiễm', 'มาตรการป้องกันการแพร่ระบาดของโรคติดต่อ', 'Tindakan Pencegahan Penyebaran Penyakit Menular', 'Langkah Pencegahan Penyebaran Penyakit Berjangkit'),
  'Notification of Infectious Diseases': p('Khai báo bệnh truyền nhiễm', 'การแจ้งโรคติดต่อ', 'Pemberitahuan Penyakit Menular', 'Pemberitahuan Penyakit Berjangkit'),
  'Notification of Prescribed Infectious Diseases': p('Khai báo bệnh truyền nhiễm theo quy định', 'การแจ้งโรคติดต่อตามที่กำหนด', 'Pemberitahuan Penyakit Menular yang Ditetapkan', 'Pemberitahuan Penyakit Berjangkit yang Ditetapkan'),
  'Prescribed Entities and Institutions': p('Pháp nhân và tổ chức theo quy định', 'นิติบุคคลและสถาบันตามที่กำหนด', 'Entitas dan Institusi yang Ditetapkan', 'Entiti dan Institusi yang Ditetapkan'),
  'Quarantine': p('Cách ly', 'การกักกัน', 'Karantina', 'Kuarentin'),
  'Undetectable HIV Viral Load': p('Tải lượng virus HIV không phát hiện được', 'ปริมาณไวรัสเอชไอวีที่ตรวจไม่พบ', 'Beban Virus HIV yang Tidak Terdeteksi', 'Beban Virus HIV yang Tidak Dikesan'),

  // ── Info-communications Media Development Authority（4） ──────
  'Interest on Late Payment of Financial Penalties': p('Lãi do chậm nộp tiền phạt', 'ดอกเบี้ยสำหรับการชำระค่าปรับล่าช้า', 'Bunga atas Keterlambatan Pembayaran Sanksi Finansial', 'Faedah bagi Kelewatan Bayaran Penalti Kewangan'),
  'Prescribed Transactions under Section 65': p('Giao dịch theo quy định tại Điều 65', 'ธุรกรรมตามที่กำหนดภายใต้มาตรา 65', 'Transaksi yang Ditetapkan menurut Pasal 65', 'Transaksi yang Ditetapkan di bawah Seksyen 65'),
  'Regulated Persons': p('Đối tượng được quản lý', 'บุคคลที่ถูกกำกับ', 'Orang yang Diatur', 'Orang yang Dikawal'),

  // ── Infrastructure Protection（5） ────────────────────────────
  'Photography of Protected Areas and Protected Places — Exemption': p('Chụp ảnh khu vực được bảo vệ và địa điểm được bảo vệ — Miễn trừ', 'การถ่ายภาพพื้นที่คุ้มครองและสถานที่คุ้มครอง — การยกเว้น', 'Fotografi Kawasan Dilindungi dan Tempat Dilindungi — Pembebasan', 'Fotografi Kawasan Dilindungi dan Tempat Dilindungi — Pengecualian'),
  'Prescribed Laws under Section 4(1)(l)': p('Luật theo quy định tại Điều 4(1)(l)', 'กฎหมายตามที่กำหนดภายใต้มาตรา 4(1)(l)', 'Undang-Undang yang Ditetapkan menurut Pasal 4(1)(l)', 'Undang-Undang yang Ditetapkan di bawah Seksyen 4(1)(l)'),
  'Protected Areas and Protected Places': p('Khu vực được bảo vệ và địa điểm được bảo vệ', 'พื้นที่คุ้มครองและสถานที่คุ้มครอง', 'Kawasan Dilindungi dan Tempat Dilindungi', 'Kawasan Dilindungi dan Tempat Dilindungi'),
  'Photography': p('Chụp ảnh', 'การถ่ายภาพ', 'Fotografi', 'Fotografi'),
  'Special Developments and Special Infrastructures': p('Công trình đặc biệt và hạ tầng đặc biệt', 'การพัฒนาพิเศษและโครงสร้างพื้นฐานพิเศษ', 'Pengembangan Khusus dan Infrastruktur Khusus', 'Pembangunan Khas dan Infrastruktur Khas'),

  // ── Inheritance（1） ──────────────────────────────────────────
  'Family Provision': p('Trợ cấp gia đình', 'การเลี้ยงดูครอบครัว', 'Penyediaan Keluarga', 'Peruntukan Keluarga'),
};

module.exports = mod;
