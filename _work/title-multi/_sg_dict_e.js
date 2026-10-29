'use strict';
// SG 尾段附注事项译名：第 5 批（E 段，122 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });
const EX = p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian');
const RM = p('Giảm thuế', 'การลดหย่อนภาษี', 'Keringanan Pajak', 'Pelepasan Cukai');

const mod = {
  // ── Economic Expansion Incentives（5） ─────────────────────────
  'Pioneer Industries and Pioneer Products': p('Công nghiệp tiên phong và sản phẩm tiên phong', 'อุตสาหกรรมบุกเบิกและผลิตภัณฑ์บุกเบิก', 'Industri Perintis dan Produk Perintis', 'Industri Perintis dan Produk Perintis'),
  'Relief from Income Tax': p('Miễn giảm thuế thu nhập', 'การลดหย่อนภาษีเงินได้', 'Keringanan Pajak Penghasilan', 'Pelepasan Cukai Pendapatan'),
  'Assignment of Functions and Powers under Section 3A': p('Chuyển giao chức năng và quyền hạn theo Điều 3A', 'การมอบหมายหน้าที่และอำนาจตามมาตรา 3A', 'Pelimpahan Fungsi dan Wewenang menurut Pasal 3A', 'Penguntukan Fungsi dan Kuasa menurut Seksyen 3A'),
  'Intellectual Property Income': p('Thu nhập từ sở hữu trí tuệ', 'รายได้จากทรัพย์สินทางปัญญา', 'Penghasilan Kekayaan Intelektual', 'Pendapatan Harta Intelek'),
  'Qualifying Activity': p('Hoạt động đủ điều kiện', 'กิจกรรมที่เข้าเกณฑ์', 'Kegiatan yang Memenuhi Syarat', 'Aktiviti yang Layak'),

  // ── Education（4） ──────────────────────────────────────────────
  'Exemptions of Religious Schools from Act': p('Miễn trừ trường tôn giáo khỏi Luật', 'การยกเว้นโรงเรียนศาสนาจากพระราชบัญญัติ', 'Pembebasan Sekolah Keagamaan dari Undang-Undang', 'Pengecualian Sekolah Agama daripada Akta'),
  'Grant-in-Aid': p('Trợ cấp ngân sách', 'เงินอุดหนุน', 'Bantuan Hibah', 'Bantuan Geran'),
  'Schools Magazines': p('Tạp chí học đường', 'วารสารโรงเรียน', 'Majalah Sekolah', 'Majalah Sekolah'),
  'Schools': p('Trường học', 'โรงเรียน', 'Sekolah', 'Sekolah'),

  // ── Education Endowment and Savings Schemes（2） ────────────────
  'Grants': p('Khoản tài trợ', 'เงินทุนอุดหนุน', 'Hibah', 'Geran'),
  'Post-secondary Education Scheme': p('Chương trình giáo dục sau trung học', 'โครงการการศึกษาระดับหลังมัธยมศึกษา', 'Skema Pendidikan Pascamenengah', 'Skim Pendidikan Lepas Menengah'),

  // ── Electricity（2） ────────────────────────────────────────────
  'Repurposing of Installations': p('Chuyển mục đích sử dụng công trình điện', 'การเปลี่ยนวัตถุประสงค์การใช้งานระบบไฟฟ้า', 'Perubahan Peruntukan Instalasi', 'Perubahan Peruntukan Pepasangan'),
  'Taser Power Pte. Ltd. — Exemption from Section 6(1)': p('Taser Power Pte. Ltd. — Miễn trừ theo Điều 6(1)', 'Taser Power Pte. Ltd. — การยกเว้นตามมาตรา 6(1)', 'Taser Power Pte. Ltd. — Pembebasan Pasal 6(1)', 'Taser Power Pte. Ltd. — Pengecualian Seksyen 6(1)'),

  // ── Employment（13） ────────────────────────────────────────────
  'Extension of December 2001 Revised Wage Guidelines': p('Gia hạn Hướng dẫn tiền lương sửa đổi tháng 12 năm 2001', 'การขยายระยะเวลาของแนวทางค่าจ้างฉบับแก้ไขเดือนธันวาคม 2544', 'Perpanjangan Pedoman Upah Revisi Desember 2001', 'Pelanjutan Garis Panduan Gaji Semakan Disember 2001'),
  'Female Workmen': p('Lao động nữ', 'คนงานหญิง', 'Pekerja Perempuan', 'Pekerja Wanita'),
  'Notes of Evidence — Fees': p('Biên bản chứng cứ — Lệ phí', 'บันทึกพยานหลักฐาน — ค่าธรรมเนียม', 'Catatan Bukti — Biaya', 'Nota Keterangan — Fi'),
  'Part-Time Employees': p('Người lao động bán thời gian', 'ลูกจ้างทำงานไม่เต็มเวลา', 'Pekerja Paruh Waktu', 'Pekerja Sambilan'),
  'Prescribed Disputes': p('Tranh chấp theo quy định', 'ข้อพิพาทตามที่กำหนด', 'Sengketa yang Ditetapkan', 'Pertikaian yang Ditetapkan'),
  'Procedure-Reciprocal Provisions': p('Thủ tục — Các quy định tương hỗ', 'กระบวนการ — บทบัญญัติตอบแทนซึ่งกันและกัน', 'Prosedur — Ketentuan Timbal Balik', 'Prosedur — Peruntukan Timbal Balik'),
  'Recommendations for Annual Wage Increases': p('Khuyến nghị tăng lương hằng năm', 'ข้อเสนอแนะการขึ้นค่าจ้างประจำปี', 'Rekomendasi Kenaikan Upah Tahunan', 'Syarahan Kenaikan Gaji Tahunan'),
  'Retrenchment Reporting': p('Báo cáo sa thải', 'การรายงานการเลิกจ้าง', 'Pelaporan Pemutusan Hubungan Kerja', 'Pelaporan Pemberhentian Kerja'),
  'Revised Wage Guidelines': p('Hướng dẫn tiền lương sửa đổi', 'แนวทางค่าจ้างฉบับแก้ไข', 'Pedoman Upah Revisi', 'Garis Panduan Gaji Semakan'),
  'Sick Leave — Hospitalisation': p('Nghỉ ốm — Nằm viện', 'การลาป่วย — การรักษาในโรงพยาบาล', 'Cuti Sakit — Rawat Inap', 'Cuti Sakit — Rawatan Hospital'),

  // ── Employment of Foreign Manpower（8） ─────────────────────────
  'Exemption from Section 10': p('Miễn trừ theo Điều 10', 'การยกเว้นตามมาตรา 10', 'Pembebasan Pasal 10', 'Pengecualian Seksyen 10'),
  'Infringement and Appeal Board Proceedings': p('Thủ tục của Ban xử lý vi phạm và kháng nghị', 'กระบวนการของคณะกรรมการวินิจฉัยการละเมิดและการอุทธรณ์', 'Prosedur Badan Pelanggaran dan Banding', 'Prosiding Lembaga Pelanggaran dan Rayuan'),
  'Job Flexibility Work Pass Exemption': p('Miễn trừ giấy phép lao động cho làm việc linh hoạt', 'การยกเว้นใบอนุญาตทำงานสำหรับการทำงานที่ยืดหยุ่น', 'Pembebasan Izin Kerja untuk Fleksibilitas Kerja', 'Pengecualian Permit Kerja bagi Fleksibiliti Pekerjaan'),
  'Levy': p('Phí', 'ค่าธรรมเนียม', 'Retribusi', 'Levi'),
  'Security Measures for Work Place': p('Biện pháp an ninh tại nơi làm việc', 'มาตรการรักษาความปลอดภัยในสถานที่ทำงาน', 'Tindakan Keamanan di Tempat Kerja', 'Langkah Keselamatan di Tempat Kerja'),
  'Work Pass Exemptions for Seamen and Full-time Students': p('Miễn trừ giấy phép lao động cho thuyền viên và sinh viên toàn thời gian', 'การยกเว้นใบอนุญาตทำงานสำหรับลูกเรือและนักศึกษาเต็มเวลา', 'Pembebasan Izin Kerja bagi Pelaut dan Mahasiswa Penuh Waktu', 'Pengecualian Permit Kerja bagi Pelaut dan Pelajar Sepenuh Masa'),
  'Work Pass Exemptions — Specified Activities': p('Miễn trừ giấy phép lao động — Hoạt động được chỉ định', 'การยกเว้นใบอนุญาตทำงาน — กิจกรรมที่ระบุ', 'Pembebasan Izin Kerja — Kegiatan Tertentu', 'Pengecualian Permit Kerja — Aktiviti Tertentu'),
  'Work Passes': p('Giấy phép lao động', 'ใบอนุญาตทำงาน', 'Izin Kerja', 'Permit Kerja'),

  // ── Endangered Species（5） ─────────────────────────────────────
  'Import and Export': p('Nhập khẩu và xuất khẩu', 'การนำเข้าและการส่งออก', 'Impor dan Ekspor', 'Import dan Eksport'),
  'Artificially Propagated Plant — Exemption': p('Thực vật nhân giống nhân tạo — Miễn trừ', 'พืชที่เพาะขยายพันธุ์โดยมนุษย์ — การยกเว้น', 'Tanaman Hasil Perbanyakan Buatan — Pembebasan', 'Tumbuhan Pembiakan Buatan — Pengecualian'),
  'Display of Elephant Ivory — Exemption': p('Trưng bày ngà voi — Miễn trừ', 'การจัดแสดงงาช้าง — การยกเว้น', 'Pameran Gading Gajah — Pembebasan', 'Pameran Gading Gajah — Pengecualian'),
  'Prescribed Documents for Section 2A': p('Giấy tờ theo quy định cho Điều 2A', 'เอกสารตามที่กำหนดสำหรับมาตรา 2A', 'Dokumen yang Ditetapkan untuk Pasal 2A', 'Dokumen yang Ditetapkan bagi Seksyen 2A'),
  'Prescribed Information for Section 5(1)': p('Thông tin theo quy định cho Điều 5(1)', 'ข้อมูลตามที่กำหนดสำหรับมาตรา 5(1)', 'Informasi yang Ditetapkan untuk Pasal 5(1)', 'Maklumat yang Ditetapkan bagi Seksyen 5(1)'),
  'Prohibition of Sale': p('Cấm bán', 'การห้ามจำหน่าย', 'Larangan Penjualan', 'Larangan Penjualan'),

  // ── Energy Conservation（9） ────────────────────────────────────
  'Exemption for New Ventures': p('Miễn trừ cho doanh nghiệp mới', 'การยกเว้นสำหรับกิจการใหม่', 'Pembebasan bagi Usaha Baru', 'Pengecualian bagi Perniagaan Baharu'),
  'Exemption for Regulated Lamps': p('Miễn trừ cho đèn được quản lý', 'การยกเว้นสำหรับหลอดไฟที่ถูกกำกับ', 'Pembebasan bagi Lampu yang Diatur', 'Pengecualian bagi Lampu yang Dikawal'),
  'Exemptions — Sections 23A and 26B': p('Miễn trừ — Điều 23A và 26B', 'การยกเว้น — มาตรา 23A และ 26B', 'Pembebasan — Pasal 23A dan 26B', 'Pengecualian — Seksyen 23A dan 26B'),
  'Fuel Economy and Vehicular Emissions Labelling': p('Dán nhãn mức tiêu thụ nhiên liệu và khí thải xe', 'การติดฉลากการประหยัดเชื้อเพลิงและการปล่อยมลพิษจากยานพาหนะ', 'Pelabelan Ekonomi Bahan Bakar dan Emisi Kendaraan', 'Pelabelan Ekonomi Bahan Api dan Pelepasan Kenderaan'),
  'Motor Vehicles Subject to Fuel Economy and Vehicular Emissions Requirements': p('Xe cơ giới thuộc yêu cầu về mức tiêu thụ nhiên liệu và khí thải', 'ยานยนต์ที่อยู่ภายใต้ข้อกำหนดด้านการประหยัดเชื้อเพลิงและการปล่อยมลพิษ', 'Kendaraan Bermotor yang Tunduk pada Persyaratan Ekonomi Bahan Bakar dan Emisi', 'Kenderaan Bermotor yang Tertakluk pada Keperluan Ekonomi Bahan Api dan Pelepasan'),
  'Prescribed Regulated Goods': p('Hàng hóa được quản lý theo quy định', 'สินค้าที่ถูกกำกับตามที่กำหนด', 'Barang Diatur yang Ditetapkan', 'Barang Dikawal yang Ditetapkan'),
  'Registrable Corporations': p('Doanh nghiệp phải đăng ký', 'นิติบุคคลที่ต้องขึ้นทะเบียน', 'Korporasi yang Wajib Terdaftar', 'Perbadanan yang Wajib Didaftar'),
  'Regulated Goods and Registered Suppliers': p('Hàng hóa được quản lý và nhà cung cấp đã đăng ký', 'สินค้าที่ถูกกำกับและผู้จำหน่ายที่ขึ้นทะเบียน', 'Barang Diatur dan Pemasok Terdaftar', 'Barang Dikawal dan Pembekal Berdaftar'),
  'Transport Facility Operators': p('Đơn vị vận hành cơ sở giao thông', 'ผู้ประกอบการสถานประกอบการขนส่ง', 'Operator Fasilitas Transportasi', 'Pengendali Kemudahan Pengangkutan'),

  // ── Enlistment（3） ──────────────────────────────────────────────
  'Exit Permit': p('Giấy phép xuất cảnh', 'ใบอนุญาตเดินทางออก', 'Izin Keluar', 'Permit Keluar'),
  'Loss of Salaries and Wages — Reimbursement': p('Mất lương và tiền công — Hoàn trả', 'การสูญเสียเงินเดือนและค่าจ้าง — การชดใช้คืน', 'Kehilangan Gaji dan Upah — Penggantian', 'Kehilangan Gaji dan Upah — Pembayaran Balik'),
  'Operationally Ready National Service Orders and Notices': p('Lệnh và thông báo về nghĩa vụ quốc gia sẵn sàng tác chiến', 'คำสั่งและหนังสือแจ้งการรับราชการทหารพร้อมรบ', 'Perintah dan Pemberitahuan Layanan Nasional Siap Operasi', 'Perintah dan Notis Perkhidmatan Negara Sedia Operasi'),

  // ── Enterprise Singapore Board（2） ─────────────────────────────
  'Fees — Registration of Representative Office': p('Lệ phí — Đăng ký văn phòng đại diện', 'ค่าธรรมเนียม — การจดทะเบียนสำนักงานผู้แทน', 'Biaya — Pendaftaran Kantor Perwakilan', 'Fi — Pendaftaran Pejabat Perwakilan'),
  'Textile Levy': p('Phí hàng dệt may', 'ค่าธรรมเนียมสิ่งทอ', 'Retribusi Tekstil', 'Levi Tekstil'),

  // ── Environmental Protection and Management（21） ───────────────
  'Exempted Controlled Works': p('Công trình bị kiểm soát được miễn trừ', 'งานควบคุมที่ได้รับการยกเว้น', 'Pekerjaan Terkendali yang Dikecualikan', 'Kerja Terkawal yang Dikecualikan'),
  'Fees for Controlled Works Applications': p('Lệ phí đối với đơn xin phép công trình bị kiểm soát', 'ค่าธรรมเนียมสำหรับคำขออนุญาตงานควบคุม', 'Biaya untuk Permohonan Pekerjaan Terkendali', 'Fi bagi Permohonan Kerja Terkawal'),
  'Fees for Licences': p('Lệ phí giấy phép', 'ค่าธรรมเนียมใบอนุญาต', 'Biaya Izin', 'Fi Lesen'),
  'Greenhouse Gases': p('Khí nhà kính', 'ก๊าซเรือนกระจก', 'Gas Rumah Kaca', 'Gas Rumah Hijau'),
  'Hazardous Substances': p('Chất độc hại', 'สารอันตราย', 'Bahan Berbahaya', 'Bahan Berbahaya'),
  'Meranti Power Pte. Ltd. — Exemption': p('Meranti Power Pte. Ltd. — Miễn trừ', 'Meranti Power Pte. Ltd. — การยกเว้น', 'Meranti Power Pte. Ltd. — Pembebasan', 'Meranti Power Pte. Ltd. — Pengecualian'),
  'Off-Road Diesel Engine Emissions': p('Khí thải động cơ diesel ngoài đường', 'การปล่อยมลพิษจากเครื่องยนต์ดีเซลนอกถนน', 'Emisi Mesin Diesel Luar Jalan', 'Pelepasan Enjin Diesel Luar Jalan'),
  'Ozone Depleting Substances': p('Chất làm suy giảm tầng ôzôn', 'สารทำลายชั้นโอโซน', 'Bahan Perusak Ozon', 'Bahan Perosak Ozon'),
  'PacificLight Power Pte. Ltd. — Exemption': p('PacificLight Power Pte. Ltd. — Miễn trừ', 'PacificLight Power Pte. Ltd. — การยกเว้น', 'PacificLight Power Pte. Ltd. — Pembebasan', 'PacificLight Power Pte. Ltd. — Pengecualian'),
  'Parallel Import Motor Vehicles — Exemption': p('Xe cơ giới nhập khẩu song song — Miễn trừ', 'ยานยนต์นำเข้าขนาน — การยกเว้น', 'Kendaraan Bermotor Impor Paralel — Pembebasan', 'Kenderaan Bermotor Import Selari — Pengecualian'),
  'Prohibition on the Use of Open Fires': p('Cấm sử dụng lửa trần', 'การห้ามใช้ไฟเปิด', 'Larangan Penggunaan Api Terbuka', 'Larangan Penggunaan Api Terbuka'),
  'Registered GHG Entities and Competent Persons': p('Pháp nhân khí nhà kính đã đăng ký và cá nhân có năng lực chuyên môn', 'นิติบุคคลก๊าซเรือนกระจกที่ขึ้นทะเบียนและผู้มีความสามารถ', 'Entitas Gas Rumah Kaca Terdaftar dan Orang yang Kompeten', 'Entiti Gas Rumah Hijau Berdaftar dan Orang Kompeten'),
  'Regulated GHG Works': p('Công trình khí nhà kính bị kiểm soát', 'งานก๊าซเรือนกระจกที่ถูกกำกับ', 'Pekerjaan Gas Rumah Kaca yang Diatur', 'Kerja Gas Rumah Hijau yang Dikawal'),
  'Regulated Goods — Exemption': p('Hàng hóa được quản lý — Miễn trừ', 'สินค้าที่ถูกกำกับ — การยกเว้น', 'Barang Diatur — Pembebasan', 'Barang Dikawal — Pengecualian'),
  'Senoko Energy Pte. Ltd. — Exemption': p('Senoko Energy Pte. Ltd. — Miễn trừ', 'Senoko Energy Pte. Ltd. — การยกเว้น', 'Senoko Energy Pte. Ltd. — Pembebasan', 'Senoko Energy Pte. Ltd. — Pengecualian'),
  'Trade Effluent': p('Nước thải công nghiệp', 'น้ำทิ้งจากอุตสาหกรรม', 'Limbah Cair Industri', 'Efluen Perdagangan'),
  'US Embassy Vehicles — Exemption': p('Xe của Đại sứ quán Hoa Kỳ — Miễn trừ', 'ยานพาหนะของสถานทูตสหรัฐ — การยกเว้น', 'Kendaraan Kedutaan Amerika Serikat — Pembebasan', 'Kenderaan Kedutaan Amerika Syarikat — Pengecualian'),
  'Vehicular Emissions': p('Khí thải xe cộ', 'การปล่อยมลพิษจากยานพาหนะ', 'Emisi Kendaraan', 'Pelepasan Kenderaan'),
  'YTL PowerSeraya Pte. Limited — Exemption': p('YTL PowerSeraya Pte. Limited — Miễn trừ', 'YTL PowerSeraya Pte. Limited — การยกเว้น', 'YTL PowerSeraya Pte. Limited — Pembebasan', 'YTL PowerSeraya Pte. Limited — Pengecualian'),

  // ── Environmental Public Health（23） ───────────────────────────
  'Excluded Cleaning Work': p('Công việc vệ sinh bị loại trừ', 'งานทำความสะอาดที่ได้รับการยกเว้น', 'Pekerjaan Pembersihan yang Dikecualikan', 'Kerja Pembersihan yang Dikecualikan'),
  'Exemption from Section 67': p('Miễn trừ theo Điều 67', 'การยกเว้นตามมาตรา 67', 'Pembebasan Pasal 67', 'Pengecualian Seksyen 67'),
  'Food Hygiene': p('Vệ sinh thực phẩm', 'สุขลักษณะอาหาร', 'Higiene Pangan', 'Kebersihan Makanan'),
  'Funeral Parlours': p('Nhà tang lễ', 'สถานฌาปนกิจ', 'Rumah Duka', 'Rumah Mayat'),
  'General Cleaning Industry': p('Ngành dịch vụ vệ sinh phổ thông', 'อุตสาหกรรมการทำความสะอาดทั่วไป', 'Industri Pembersihan Umum', 'Industri Pembersihan Am'),
  'General Waste Collection': p('Thu gom rác thải thông thường', 'การเก็บรวบรวมขยะทั่วไป', 'Pengumpulan Sampah Umum', 'Pengumpulan Sisa Am'),
  'General Waste Disposal Facility — Exemption': p('Cơ sở xử lý rác thải thông thường — Miễn trừ', 'สถานที่กำจัดขยะทั่วไป — การยกเว้น', 'Fasilitas Pembuangan Sampah Umum — Pembebasan', 'Kemudahan Pelupusan Sisa Am — Pengecualian'),
  'General Waste Disposal Facility': p('Cơ sở xử lý rác thải thông thường', 'สถานที่กำจัดขยะทั่วไป', 'Fasilitas Pembuangan Sampah Umum', 'Kemudahan Pelupusan Sisa Am'),
  'Licensable Aquatic Facilities': p('Cơ sở thủy sinh phải cấp phép', 'สถานที่เกี่ยวกับน้ำที่ต้องขอใบอนุญาต', 'Fasilitas Perairan yang Wajib Berizin', 'Kemudahan Akuatik yang Wajib Berlesen'),
  'Modification of Licences': p('Sửa đổi giấy phép', 'การแก้ไขใบอนุญาต', 'Perubahan Izin', 'Pindaan Lesen'),
  'Part IV Fees': p('Lệ phí Phần IV', 'ค่าธรรมเนียมภาค 4', 'Biaya Bagian IV', 'Fi Bahagian IV'),
  'Public Cleansing': p('Vệ sinh công cộng', 'การทำความสะอาดสาธารณะ', 'Kebersihan Umum', 'Pembersihan Awam'),
  'Registrable Aerosol-generating Systems': p('Hệ thống tạo sol khí phải đăng ký', 'ระบบสร้างละอองลอยที่ต้องขึ้นทะเบียน', 'Sistem Penghasil Aerosol yang Wajib Terdaftar', 'Sistem Penjana Aerosol yang Wajib Didaftar'),
  'Registration of Environmental Control Coordinators and Environmental Control Officers': p('Đăng ký điều phối viên kiểm soát môi trường và cán bộ kiểm soát môi trường', 'การขึ้นทะเบียนผู้ประสานงานควบคุมสิ่งแวดล้อมและเจ้าหน้าที่ควบคุมสิ่งแวดล้อม', 'Pendaftaran Koordinator Pengendalian Lingkungan dan Petugas Pengendalian Lingkungan', 'Pendaftaran Penyelaras Kawalan Alam Sekitar dan Pegawai Kawalan Alam Sekitar'),
  'Section 31(1) Exemption': p('Miễn trừ theo Điều 31(1)', 'การยกเว้นตามมาตรา 31(1)', 'Pembebasan Pasal 31(1)', 'Pengecualian Seksyen 31(1)'),
  'Specified Construction Sites': p('Công trường được chỉ định', 'สถานที่ก่อสร้างที่ระบุ', 'Lokasi Konstruksi Tertentu', 'Tapak Pembinaan Tertentu'),
  'Specified Premises': p('Cơ sở được chỉ định', 'สถานที่ที่ระบุ', 'Tempat Usaha Tertentu', 'Premis Tertentu'),
  'Toxic Industrial Waste': p('Chất thải công nghiệp độc hại', 'ของเสียอุตสาหกรรมที่เป็นพิษ', 'Limbah Industri Beracun', 'Sisa Industri Toksik'),

  // ── Estate Agents（5） ──────────────────────────────────────────
  'Estate Agency Work': p('Hoạt động môi giới bất động sản', 'งานนายหน้าอสังหาริมทรัพย์', 'Pekerjaan Agen Properti', 'Kerja Ejen Hartanah'),
  'Land Banking': p('Tích lũy đất', 'การสะสมที่ดิน', 'Penimbunan Lahan', 'Penimbunan Tanah'),
  'Licensing and Registration': p('Cấp phép và đăng ký', 'การออกใบอนุญาตและการขึ้นทะเบียน', 'Perizinan dan Pendaftaran', 'Pelesenan dan Pendaftaran'),
  'Prevention of Money Laundering, Proliferation Financing and Terrorism Financing': p('Phòng chống rửa tiền, tài trợ phổ biến vũ khí và tài trợ khủng bố', 'การป้องกันการฟอกเงิน การระดมทุนเพื่อการแพร่ขยายอาวุธ และการระดมทุนเพื่อการก่อการร้าย', 'Pencegahan Pencucian Uang, Pendanaan Proliferasi dan Pendanaan Terorisme', 'Pencegahan Pengubahan Wang Haram, Pembiayaan Percambahan dan Pembiayaan Keganasan'),
  'Transaction Records': p('Hồ sơ giao dịch', 'บันทึกธุรกรรม', 'Catatan Transaksi', 'Rekod Transaksi'),

  // ── Estate Duty（13） ───────────────────────────────────────────
  'Immovable Property': p('Bất động sản', 'อสังหาริมทรัพย์', 'Properti Tidak Bergerak', 'Harta Tak Alih'),
  'Remission': RM,
  'Remission for Deaths in Quick Succession': p('Giảm thuế đối với các trường hợp tử vong liên tiếp', 'การลดหย่อนภาษีสำหรับการเสียชีวิตต่อเนื่องกัน', 'Keringanan Pajak bagi Kematian Beruntun', 'Pelepasan Cukai bagi Kematian Berturutan'),

  // ── Estate Duty Exemptions（6） ─────────────────────────────────
  'Consolidation': p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan'),
};

// 遗产税个案：被继承人姓名原样保留，只译「Deceased」
const DECEASED = {
  'Chan Kee Hwa': ['Chan Kee Hwa'],
  'Chew Chee Thong': ['Chew Chee Thong'],
  'Chua Siew Cheng': ['Chua Siew Cheng'],
  'Koh Choon Joo': ['Koh Choon Joo'],
  'Koh Peng Yam': ['Koh Peng Yam'],
  'Lem Chu Kem also known as Lem Chu Kem Theresa': ['Lem Chu Kem', 'Lem Chu Kem Theresa'],
  'Liauw Lih Sien, Sandy': ['Liauw Lih Sien', 'Sandy'],
  'Liauw Lih Ting, Sindy': ['Liauw Lih Ting', 'Sindy'],
  'Ong Kim York': ['Ong Kim York'],
  'Tang Yu Kan': ['Tang Yu Kan'],
  'Visvanathapuram Mariadoss Jagadisa Raju': ['Visvanathapuram Mariadoss Jagadisa Raju'],
  'Wang Li Li': ['Wang Li Li'],
  'Xu Chue Fern': ['Xu Chue Fern'],
  'Yap Sow Leng': ['Yap Sow Leng'],
};
for (const [key, names] of Object.entries(DECEASED)) {
  const en = names.length > 1 ? names[0] + ', còn gọi là ' + names[1] : names[0];
  const th = names.length > 1 ? names[0] + ' หรือที่รู้จักในชื่อ ' + names[1] : names[0];
  const id = names.length > 1 ? names[0] + ', juga dikenal sebagai ' + names[1] : names[0];
  const ms = names.length > 1 ? names[0] + ', juga dikenali sebagai ' + names[1] : names[0];
  mod[key + ', Deceased'] = p(en + ', đã qua đời', th + ' ผู้ถึงแก่กรรม', id + ', telah meninggal dunia', ms + ', telah meninggal dunia');
}

// 「No. N」作为独立一层括号时也要能查到（此前只作为合并键内部元素存在）
for (let n = 1; n <= 9; n++) {
  mod['No. ' + n] = p('Số ' + n, 'ฉบับที่ ' + n, 'Nomor ' + n, 'No. ' + n);
}

module.exports = mod;
