'use strict';
// SG 尾段附注事项译名：第 11 批（M 段，89 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Medicines（14） ──────────────────────────────────────────
  'Export Licence for Psychotropic Substances': p('Giấy phép xuất khẩu chất hướng thần', 'ใบอนุญาตส่งออกวัตถุออกฤทธิ์ต่อจิตและประสาท', 'Izin Ekspor Zat Psikotropika', 'Lesen Eksport Bahan Psikotropik'),
  'General Sale List': p('Danh mục bán thông thường', 'รายการจำหน่ายทั่วไป', 'Daftar Penjualan Umum', 'Senarai Jualan Am'),
  'Good Manufacturing Practice Certificate': p('Giấy chứng nhận thực hành sản xuất tốt', 'หนังสือรับรองหลักเกณฑ์วิธีการผลิตที่ดี', 'Sertifikat Cara Pembuatan yang Baik', 'Sijil Amalan Pengilangan Baik'),
  'Labelling of Chinese Proprietary Medicines': p('Ghi nhãn thuốc đông y thành phẩm', 'การติดฉลากยาจีนสำเร็จรูป', 'Pelabelan Obat Cina Paten', 'Pelabelan Ubat Cina Berpaten'),
  'Labelling': p('Ghi nhãn', 'การติดฉลาก', 'Pelabelan', 'Pelabelan'),
  'Licensing, Standard Provisions and Fees': p('Cấp phép, quy định tiêu chuẩn và lệ phí', 'การออกใบอนุญาต บทบัญญัติมาตรฐาน และค่าธรรมเนียม', 'Perizinan, Ketentuan Standar dan Biaya', 'Pelesenan, Peruntukan Standard dan Fi'),
  'Medical Advertisements': p('Quảng cáo y tế', 'โฆษณาทางการแพทย์', 'Iklan Medis', 'Iklan Perubatan'),
  'Medicinal Products as Clinical Research Materials': p('Sản phẩm thuốc dùng làm vật liệu nghiên cứu lâm sàng', 'ผลิตภัณฑ์ยาในฐานะวัสดุการวิจัยทางคลินิก', 'Produk Obat sebagai Bahan Penelitian Klinis', 'Produk Ubat sebagai Bahan Penyelidikan Klinikal'),
  'Non-Medicinal Products': p('Sản phẩm không phải thuốc', 'ผลิตภัณฑ์ที่ไม่ใช่ยา', 'Produk Non-Obat', 'Produk Bukan Ubat'),
  'Prohibition of Sale, Supply and Importation': p('Cấm bán, cung cấp và nhập khẩu', 'การห้ามจำหน่าย จัดหา และนำเข้า', 'Larangan Penjualan, Pasokan dan Impor', 'Larangan Penjualan, Pembekalan dan Import'),
  'Sale by Automatic Machines': p('Bán bằng máy tự động', 'การจำหน่ายผ่านเครื่องอัตโนมัติ', 'Penjualan melalui Mesin Otomatis', 'Penjualan melalui Mesin Automatik'),
  'Traditional Medicines, Homoeopathic Medicines and other Substances': p('Thuốc y học cổ truyền, thuốc vi lượng đồng căn và các chất khác', 'ยาสมุนไพร ยาโฮมีโอพาธีย์ และสารอื่น ๆ', 'Obat Tradisional, Obat Homeopati dan Zat Lain', 'Ubat Tradisional, Ubat Homeopati dan Bahan Lain'),
  'Veterinary Medicinal Products': p('Sản phẩm thuốc thú y', 'ผลิตภัณฑ์ยาสัตว์', 'Produk Obat Hewan', 'Produk Ubat Veterinar'),
  'Import and Product Licences': p('Giấy phép nhập khẩu và giấy phép sản phẩm', 'ใบอนุญาตนำเข้าและใบอนุญาตผลิตภัณฑ์', 'Izin Impor dan Izin Produk', 'Lesen Import dan Lesen Produk'),

  // ── MediShield Life Scheme（4） ───────────────────────────────
  'Premium Recovery': p('Thu hồi phí bảo hiểm', 'การเรียกคืนเบี้ยประกัน', 'Pemulihan Premi', 'Pemulihan Premium'),
  'Private Medical Insurance Scheme': p('Chương trình bảo hiểm y tế tư nhân', 'โครงการประกันสุขภาพเอกชน', 'Skema Asuransi Kesehatan Swasta', 'Skim Insurans Perubatan Swasta'),
  'Scheme for Overseas Singapore Citizens': p('Chương trình cho công dân Singapore ở nước ngoài', 'โครงการสำหรับพลเมืองสิงคโปร์ในต่างประเทศ', 'Skema bagi Warga Negara Singapura di Luar Negeri', 'Skim bagi Warganegara Singapura di Luar Negara'),
  'Specified Amount for Payment to Proper Claimant': p('Số tiền được chỉ định để thanh toán cho người yêu cầu hợp lệ', 'จำนวนเงินที่ระบุสำหรับการจ่ายให้ผู้เรียกร้องโดยชอบ', 'Jumlah Tertentu untuk Pembayaran kepada Pengklaim yang Sah', 'Jumlah Tertentu bagi Bayaran kepada Penuntut yang Sah'),

  // ── Mental Capacity（3） ─────────────────────────────────────
  'Exemption from Registration as Professional Deputy': p('Miễn trừ đăng ký làm người đại diện chuyên nghiệp', 'การยกเว้นจากการขึ้นทะเบียนเป็นผู้แทนโดยมืออาชีพ', 'Pembebasan dari Pendaftaran sebagai Wakil Profesional', 'Pengecualian daripada Pendaftaran sebagai Wakil Profesional'),
  'Public Guardian Fees': p('Lệ phí của Người giám hộ công', 'ค่าธรรมเนียมผู้พิทักษ์สาธารณะ', 'Biaya Wali Publik', 'Fi Penjaga Awam'),
  'Registration of Professional Deputies': p('Đăng ký người đại diện chuyên nghiệp', 'การขึ้นทะเบียนผู้แทนโดยมืออาชีพ', 'Pendaftaran Wakil Profesional', 'Pendaftaran Wakil Profesional'),

  // ── Mental Health（3） ────────────────────────────────────────
  'Care and Treatment': p('Chăm sóc và điều trị', 'การดูแลและการรักษา', 'Perawatan dan Pengobatan', 'Penjagaan dan Rawatan'),
  'Designated Psychiatric Institution': p('Cơ sở tâm thần được chỉ định', 'สถาบันจิตเวชที่กำหนด', 'Institusi Kejiwaan yang Ditetapkan', 'Institusi Psikiatri yang Ditetapkan'),

  // ── Military Manoeuvres / Miscellaneous Offences（5） ─────────
  'Firing Ground': p('Trường bắn', 'สนามยิงปืน', 'Lapangan Tembak', 'Padang Menembak'),
  'Public Order and Nuisance': p('Trật tự công cộng và phiền toái công cộng', 'ความสงบเรียบร้อยและการก่อความเดือดร้อนรำคาญ', 'Ketertiban Umum dan Gangguan', 'Ketenteraman Awam dan Kacau Ganggu'),
  'Composition of Offences': p('Xử phạt vi phạm', 'การเปรียบเทียบคดีความผิด', 'Penyelesaian Pelanggaran di Luar Pengadilan', 'Penyelesaian Kesalahan di Luar Mahkamah'),
  'Emergency Telephone Numbers': p('Số điện thoại khẩn cấp', 'หมายเลขโทรศัพท์ฉุกเฉิน', 'Nomor Telepon Darurat', 'Nombor Telefon Kecemasan'),
  'Prescribed Weapons and Equipment': p('Vũ khí và trang thiết bị theo quy định', 'อาวุธและอุปกรณ์ตามที่กำหนด', 'Senjata dan Peralatan yang Ditetapkan', 'Senjata dan Peralatan yang Ditetapkan'),

  // ── Misuse of Drugs（3） ─────────────────────────────────────
  'Hair Specimens and Hair Tests': p('Mẫu tóc và xét nghiệm tóc', 'ตัวอย่างเส้นผมและการตรวจเส้นผม', 'Spesimen Rambut dan Uji Rambut', 'Spesimen Rambut dan Ujian Rambut'),
  'Singapore Armed Forces': p('Lực lượng Vũ trang Singapore', 'กองทัพสิงคโปร์', 'Angkatan Bersenjata Singapura', 'Angkatan Tentera Singapura'),
  'Urine Specimens and Urine Tests': p('Mẫu nước tiểu và xét nghiệm nước tiểu', 'ตัวอย่างปัสสาวะและการตรวจปัสสาวะ', 'Spesimen Urin dan Uji Urin', 'Spesimen Air Kencing dan Ujian Air Kencing'),

  // ── Moneylenders（1） ────────────────────────────────────────
  'Prevention of Money Laundering, Terrorism Financing and Proliferation Financing': p('Phòng chống rửa tiền, tài trợ khủng bố và tài trợ phổ biến vũ khí', 'การป้องกันการฟอกเงิน การระดมทุนเพื่อการก่อการร้าย และการระดมทุนเพื่อการแพร่ขยายอาวุธ', 'Pencegahan Pencucian Uang, Pendanaan Terorisme dan Pendanaan Proliferasi', 'Pencegahan Pengubahan Wang Haram, Pembiayaan Keganasan dan Pembiayaan Percambahan'),

  // ── Motor Vehicles（4） ──────────────────────────────────────
  'Third-Party Risks and Compensation': p('Rủi ro và bồi thường cho bên thứ ba', 'ความเสี่ยงและการชดเชยต่อบุคคลที่สาม', 'Risiko dan Kompensasi Pihak Ketiga', 'Risiko dan Pampasan Pihak Ketiga'),
  'Exemption of Power-Assisted Bicycles': p('Miễn trừ xe đạp trợ lực', 'การยกเว้นจักรยานที่ใช้มอเตอร์ช่วย', 'Pembebasan Sepeda Bertenaga Bantuan', 'Pengecualian Basikal Berbantuan Kuasa'),
  'Formula 1 Singapore Airlines Singapore Grand Prix — General Exemption': p('Formula 1 Singapore Airlines Singapore Grand Prix — Miễn trừ chung', 'Formula 1 Singapore Airlines Singapore Grand Prix — การยกเว้นทั่วไป', 'Formula 1 Singapore Airlines Singapore Grand Prix — Pembebasan Umum', 'Formula 1 Singapore Airlines Singapore Grand Prix — Pengecualian Am'),
  'Nanyang Technological University Power-Assisted Bicycles Trial': p('Thử nghiệm xe đạp trợ lực tại Đại học Công nghệ Nanyang', 'การทดลองจักรยานที่ใช้มอเตอร์ช่วยของมหาวิทยาลัยเทคโนโลยีนานยาง', 'Uji Coba Sepeda Bertenaga Bantuan Universitas Teknologi Nanyang', 'Percubaan Basikal Berbantuan Kuasa Universiti Teknologi Nanyang'),

  // ── Multi-Level Marketing / Multimodal / MNE / Municipal（7） ─
  'Excluded Schemes and Arrangements': p('Chương trình và thỏa thuận bị loại trừ', 'โครงการและข้อตกลงที่ได้รับการยกเว้น', 'Skema dan Pengaturan yang Dikecualikan', 'Skim dan Pengaturan yang Dikecualikan'),
  'Prohibition': p('Cấm', 'การห้าม', 'Larangan', 'Larangan'),
  'Singapore Competent National Body': p('Cơ quan quốc gia có thẩm quyền của Singapore', 'หน่วยงานระดับชาติที่มีอำนาจของสิงคโปร์', 'Badan Nasional Kompeten Singapura', 'Badan Nasional Kompeten Singapura'),
  'Minimum Tax': p('Thuế tối thiểu', 'ภาษีขั้นต่ำ', 'Pajak Minimum', 'Cukai Minimum'),
  'Administrative Matters': p('Vấn đề hành chính', 'เรื่องทางปกครอง', 'Hal Administratif', 'Perkara Pentadbiran'),
  'Declaration under Section 1(3)': p('Công bố theo Điều 1(3)', 'การประกาศตามมาตรา 1(3)', 'Deklarasi menurut Pasal 1(3)', 'Pengisytiharan di bawah Seksyen 1(3)'),
  'Provident Fund': p('Quỹ tiết kiệm', 'กองทุนสำรองเลี้ยงชีพ', 'Dana Simpanan', 'Kumpulan Wang Simpanan'),

  // ── Mutual Assistance in Criminal Matters（10） ────────────────
  'French Republic': p('Cộng hòa Pháp', 'สาธารณรัฐฝรั่งเศส', 'Republik Prancis', 'Republik Perancis'),
  'India': p('Ấn Độ', 'อินเดีย', 'India', 'India'),
  'International Criminal Tribunals': p('Tòa án Hình sự Quốc tế', 'ศาลอาญาระหว่างประเทศ', 'Pengadilan Pidana Internasional', 'Tribunal Jenayah Antarabangsa'),
  'Kingdom of Cambodia': p('Vương quốc Campuchia', 'ราชอาณาจักรกัมพูชา', 'Kerajaan Kamboja', 'Kerajaan Kemboja'),
  'Kingdom of Thailand': p('Vương quốc Thái Lan', 'ราชอาณาจักรไทย', 'Kerajaan Thailand', 'Kerajaan Thailand'),
  'Lao People’s Democratic Republic': p('Cộng hòa Dân chủ Nhân dân Lào', 'สาธารณรัฐประชาธิปไตยประชาชนลาว', 'Republik Demokratik Rakyat Laos', 'Republik Demokratik Rakyat Laos'),
  'Prescribed Foreign Countries': p('Quốc gia nước ngoài theo quy định', 'ประเทศต่างประเทศตามที่กำหนด', 'Negara Asing yang Ditetapkan', 'Negara Asing yang Ditetapkan'),
  'Republic of the Philippines': p('Cộng hòa Philippines', 'สาธารณรัฐฟิลิปปินส์', 'Republik Filipina', 'Republik Filipina'),
  'Socialist Republic of Vietnam': p('Cộng hòa Xã hội Chủ nghĩa Việt Nam', 'สาธารณรัฐสังคมนิยมเวียดนาม', 'Republik Sosialis Vietnam', 'Republik Sosialis Vietnam'),
  'Union of Myanmar': p('Liên bang Myanmar', 'สหภาพเมียนมา', 'Uni Myanmar', 'Kesatuan Myanmar'),

  // ── Merchant Shipping（34） ──────────────────────────────────
  'Exemption under Section 222': p('Miễn trừ theo Điều 222', 'การยกเว้นตามมาตรา 222', 'Pembebasan menurut Pasal 222', 'Pengecualian di bawah Seksyen 222'),
  'Limitation of Liability': p('Giới hạn trách nhiệm', 'การจำกัดความรับผิด', 'Pembatasan Tanggung Jawab', 'Penghad Tanggungjawab'),
  'Singapore Currency Equivalents': p('Giá trị tương đương tiền tệ Singapore', 'มูลค่าเทียบเท่าสกุลเงินสิงคโปร์', 'Ekuivalen Mata Uang Singapura', 'Nilai Setara Mata Wang Singapura'),
  'Load Line': p('Dấu chuyên chở', 'ขีดรับน้ำ', 'Garis Muat', 'Garis Muatan'),
  'Maritime Labour Convention': p('Công ước Lao động Hàng hải', 'อนุสัญญาแรงงานทางทะเล', 'Konvensi Ketenagakerjaan Maritim', 'Konvensyen Buruh Maritim'),
  'Definition of Seafarer': p('Định nghĩa thuyền viên', 'บทนิยามของลูกเรือ', 'Definisi Pelaut', 'Takrif Pelaut'),
  'Definition of Ship': p('Định nghĩa tàu biển', 'บทนิยามของเรือ', 'Definisi Kapal', 'Takrif Kapal'),
  'Financial Security': p('Bảo đảm tài chính', 'หลักประกันทางการเงิน', 'Jaminan Keuangan', 'Jaminan Kewangan'),
  'Forms, Certificates and Fees': p('Biểu mẫu, giấy chứng nhận và lệ phí', 'แบบฟอร์ม ใบรับรอง และค่าธรรมเนียม', 'Formulir, Sertifikat dan Biaya', 'Borang, Sijil dan Fi'),
  'Health and Safety Protection and Accident Prevention': p('Bảo vệ sức khỏe, an toàn và phòng ngừa tai nạn', 'การคุ้มครองสุขภาพและความปลอดภัยและการป้องกันอุบัติเหตุ', 'Perlindungan Kesehatan dan Keselamatan serta Pencegahan Kecelakaan', 'Perlindungan Kesihatan dan Keselamatan serta Pencegahan Kemalangan'),
  'Medicines and Medical Equipment': p('Thuốc và trang thiết bị y tế', 'ยาและอุปกรณ์การแพทย์', 'Obat dan Peralatan Medis', 'Ubat dan Peralatan Perubatan'),
  'Repatriation': p('Hồi hương', 'การส่งกลับภูมิลำเนา', 'Repatriasi', 'Pemulangan'),
  'Requirements and Conditions of Employment': p('Yêu cầu và điều kiện tuyển dụng', 'ข้อกำหนดและเงื่อนไขการจ้างงาน', 'Persyaratan dan Kondisi Kerja', 'Keperluan dan Syarat Penggajian'),
  'Seafarer Recruitment and Placement Services': p('Dịch vụ tuyển dụng và bố trí thuyền viên', 'บริการรับสมัครและจัดหาลูกเรือ', 'Layanan Perekrutan dan Penempatan Pelaut', 'Perkhidmatan Pengambilan dan Penempatan Pelaut'),
  'Seafarer’s Employment Agreement, Crew List and Discharge of Seafarers': p('Hợp đồng lao động thuyền viên, danh sách thuyền viên và việc cho thuyền viên rời tàu', 'สัญญาจ้างลูกเรือ รายชื่อลูกเรือ และการปลดลูกเรือ', 'Perjanjian Kerja Pelaut, Daftar Awak Kapal dan Pemberhentian Pelaut', 'Perjanjian Penggajian Pelaut, Senarai Awak Kapal dan Pelepasan Pelaut'),
  'Training and Certification of Cooks and Catering Staff': p('Đào tạo và cấp chứng nhận đầu bếp và nhân viên phục vụ ăn uống', 'การฝึกอบรมและการออกใบรับรองพ่อครัวและพนักงานบริการอาหาร', 'Pelatihan dan Sertifikasi Juru Masak dan Staf Katering', 'Latihan dan Pensijilan Tukang Masak dan Kakitangan Katering'),
  'Wages': p('Tiền lương', 'ค่าจ้าง', 'Upah', 'Upah'),
  'Medical Stores': p('Kho thuốc', 'คลังเวชภัณฑ์', 'Persediaan Medis', 'Stor Perubatan'),
  'Official Log Books': p('Nhật ký chính thức', 'สมุดบันทึกอย่างเป็นทางการ', 'Buku Catatan Resmi', 'Buku Log Rasmi'),
  'Prevention of Collisions at Sea': p('Phòng ngừa va chạm trên biển', 'การป้องกันการชนกันในทะเล', 'Pencegahan Tabrakan di Laut', 'Pencegahan Pelanggaran di Laut'),
  'Property of Deceased Seamen': p('Tài sản của thuyền viên đã mất', 'ทรัพย์สินของลูกเรือที่เสียชีวิต', 'Harta Pelaut yang Meninggal', 'Harta Pelaut yang Meninggal'),
  'Provisions and Water': p('Lương thực và nước uống', 'เสบียงและน้ำ', 'Perbekalan dan Air', 'Bekalan dan Air'),
  'Registration of Ships': p('Đăng ký tàu biển', 'การขึ้นทะเบียนเรือ', 'Pendaftaran Kapal', 'Pendaftaran Kapal'),
  'Returns of Births and Deaths': p('Báo cáo sinh và tử', 'การรายงานการเกิดและการตาย', 'Laporan Kelahiran dan Kematian', 'Laporan Kelahiran dan Kematian'),
  'Safety Convention': p('Công ước an toàn', 'อนุสัญญาความปลอดภัย', 'Konvensi Keselamatan', 'Konvensyen Keselamatan'),
  'Seamen’s Allotments': p('Các khoản trích chuyển lương của thuyền viên', 'การจัดสรรค่าจ้างลูกเรือ', 'Alokasi Upah Pelaut', 'Peruntukan Upah Pelaut'),
  'Seamen’s Wages and Accounts': p('Tiền lương và tài khoản của thuyền viên', 'ค่าจ้างและบัญชีของลูกเรือ', 'Upah dan Akun Pelaut', 'Upah dan Akaun Pelaut'),
  'Shipping Casualties, Appeals and Rehearings': p('Tai nạn hàng hải, kháng nghị và xét xử lại', 'อุบัติเหตุทางการเดินเรือ การอุทธรณ์ และการพิจารณาคดีใหม่', 'Kecelakaan Pelayaran, Banding dan Pemeriksaan Ulang', 'Kemalangan Perkapalan, Rayuan dan Perbicaraan Semula'),
  'Staff Transfer': p('Chuyển nhân sự', 'การโอนเจ้าหน้าที่', 'Pengalihan Staf', 'Pemindahan Kakitangan'),
  'Survey of Passenger Steamers': p('Kiểm tra tàu hơi nước chở khách', 'การสำรวจเรือกลไฟโดยสาร', 'Survei Kapal Uap Penumpang', 'Pemeriksaan Kapal Stim Penumpang'),
  'Survey of Singapore Ships': p('Kiểm tra tàu Singapore', 'การสำรวจเรือสิงคโปร์', 'Survei Kapal Singapura', 'Pemeriksaan Kapal Singapura'),
  'Tonnage': p('Dung tích tàu', 'ระวางเรือ', 'Tonase', 'Tanan'),
  'Training, Certification and Manning': p('Đào tạo, cấp chứng nhận và định biên', 'การฝึกอบรม การออกใบรับรอง และการจัดกำลังคน', 'Pelatihan, Sertifikasi dan Penempatan Awak', 'Latihan, Pensijilan dan Penempatan Awak'),
  'Transit of Cattle by Sea': p('Vận chuyển gia súc quá cảnh bằng đường biển', 'การขนส่งโคกระบือผ่านแดนทางทะเล', 'Transit Sapi melalui Laut', 'Transit Lembu melalui Laut'),
  'Wing-in-Ground Craft': p('Tàu bay sát mặt nước', 'ยานบินเหนือผิวน้ำ', 'Kapal Bersayap Permukaan', 'Kapal Bersayap Permukaan'),
};

module.exports = mod;
