'use strict';
// SG 尾段附注事项译名：第 13 批（A–B 段残留，116 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Accountants / ACRA（6） ──────────────────────────────────
  'Prescribed Documents and Information': p('Giấy tờ và thông tin theo quy định', 'เอกสารและข้อมูลตามที่กำหนด', 'Dokumen dan Informasi yang Ditetapkan', 'Dokumen dan Maklumat yang Ditetapkan'),
  'Prescribed Standards and Code of Professional Conduct and Ethics': p('Tiêu chuẩn theo quy định và quy tắc ứng xử, đạo đức nghề nghiệp', 'มาตรฐานตามที่กำหนดและจรรยาบรรณวิชาชีพ', 'Standar yang Ditetapkan dan Kode Etik serta Perilaku Profesional', 'Standard yang Ditetapkan dan Kod Kelakuan serta Etika Profesional'),
  'Public Accountants': p('Kế toán viên công', 'ผู้สอบบัญชีสาธารณะ', 'Akuntan Publik', 'Akauntan Awam'),
  'Information, Documents and Notification': p('Thông tin, giấy tờ và thông báo', 'ข้อมูล เอกสาร และการแจ้ง', 'Informasi, Dokumen dan Pemberitahuan', 'Maklumat, Dokumen dan Pemberitahuan'),
  'Prescribed Accounting Services and Conditions': p('Dịch vụ kế toán theo quy định và các điều kiện', 'บริการบัญชีตามที่กำหนดและเงื่อนไข', 'Layanan Akuntansi yang Ditetapkan dan Syarat', 'Perkhidmatan Perakaunan yang Ditetapkan dan Syarat'),
  'Transfer Date for Singapore Accountancy Commission': p('Ngày chuyển giao cho Ủy ban Kế toán Singapore', 'วันที่โอนสำหรับคณะกรรมการการบัญชีสิงคโปร์', 'Tanggal Pengalihan bagi Komisi Akuntansi Singapura', 'Tarikh Pindahan bagi Suruhanjaya Perakaunan Singapura'),

  // ── Administration of Justice / Muslim Law（13） ──────────────
  'Protection': p('Bảo vệ', 'การคุ้มครอง', 'Perlindungan', 'Perlindungan'),
  'Non‑Publication Directions': p('Chỉ thị không công bố', 'คำสั่งห้ามเผยแพร่', 'Arahan Tidak Menerbitkan', 'Arahan Tidak Menerbitkan'),
  'Fitrah': p('Fitrah', 'ฟิฏเราะฮ์', 'Fitrah', 'Fitrah'),
  'Foreign Halal Certification Bodies': p('Tổ chức chứng nhận halal nước ngoài', 'หน่วยรับรองฮาลาลต่างประเทศ', 'Badan Sertifikasi Halal Asing', 'Badan Pensijilan Halal Asing'),
  'Haj': p('Haj', 'ฮัจญ์', 'Haji', 'Haji'),
  'Halal Certificates': p('Giấy chứng nhận halal', 'หนังสือรับรองฮาลาล', 'Sertifikat Halal', 'Sijil Halal'),
  'Majlis Wakaf': p('Majlis Wakaf', 'Majlis Wakaf', 'Majlis Wakaf', 'Majlis Wakaf'),
  'Mosque Building and Mendaki Fund': p('Quỹ xây dựng nhà thờ Hồi giáo và Quỹ Mendaki', 'กองทุนสร้างมัสยิดและกองทุนเมินดากี', 'Dana Pembangunan Masjid dan Dana Mendaki', 'Tabung Pembinaan Masjid dan Tabung Mendaki'),
  'Muslim Converts': p('Người cải đạo Hồi giáo', 'ผู้เปลี่ยนศาสนาอิสลาม', 'Mualaf', 'Mualaf'),
  'Muslim Religious Schools': p('Trường tôn giáo Hồi giáo', 'โรงเรียนสอนศาสนาอิสลาม', 'Sekolah Agama Islam', 'Sekolah Agama Islam'),
  'Mutawallis and Trustees': p('Mutawalli và người được ủy thác', 'มุตะวัลลีและผู้ดูแลผลประโยชน์', 'Mutawalli dan Wali Amanat', 'Mutawalli dan Pemegang Amanah'),
  'Prescribed Muslim Societies': p('Hội Hồi giáo theo quy định', 'สมาคมมุสลิมตามที่กำหนด', 'Perkumpulan Muslim yang Ditetapkan', 'Persatuan Islam yang Ditetapkan'),
  'Wakaf and Nazar Am': p('Wakaf và Nazar Am', 'วักฟ์และนะซัรอัม', 'Wakaf dan Nazar Am', 'Wakaf dan Nazar Am'),

  // ── Adoption / Allied Health / Amusement Rides（3） ───────────
  'Prescribed Offences': p('Tội theo quy định', 'ความผิดตามที่กำหนด', 'Pelanggaran yang Ditetapkan', 'Kesalahan yang Ditetapkan'),
  'Professional Conduct and Discipline': p('Hành vi và kỷ luật nghề nghiệp', 'ความประพฤติและวินัยวิชาชีพ', 'Perilaku dan Disiplin Profesional', 'Kelakuan dan Disiplin Profesional'),
  'Fire and Rescue Management System': p('Hệ thống quản lý chữa cháy và cứu nạn', 'ระบบการจัดการดับเพลิงและกู้ภัย', 'Sistem Manajemen Kebakaran dan Penyelamatan', 'Sistem Pengurusan Kebakaran dan Penyelamatan'),

  // ── Air Navigation（21） ────────────────────────────────────
  'Exemption for Project HORNET': p('Miễn trừ cho Dự án HORNET', 'การยกเว้นสำหรับโครงการ HORNET', 'Pembebasan bagi Proyek HORNET', 'Pengecualian bagi Projek HORNET'),
  'Exemption for Project KESTREL': p('Miễn trừ cho Dự án KESTREL', 'การยกเว้นสำหรับโครงการ KESTREL', 'Pembebasan bagi Proyek KESTREL', 'Pengecualian bagi Projek KESTREL'),
  'Licensing of Air Services': p('Cấp phép dịch vụ hàng không', 'การออกใบอนุญาตบริการการบิน', 'Perizinan Layanan Angkutan Udara', 'Pelesenan Perkhidmatan Udara'),
  'Paya Lebar and Tengah Aerodrome Fees': p('Lệ phí sân bay Paya Lebar và Tengah', 'ค่าธรรมเนียมสนามบินปายาเลอบาร์และเตองาห์', 'Biaya Bandar Udara Paya Lebar dan Tengah', 'Fi Lapangan Terbang Paya Lebar dan Tengah'),
  'Prohibited Flights': p('Chuyến bay bị cấm', 'เที่ยวบินต้องห้าม', 'Penerbangan Terlarang', 'Penerbangan Larangan'),
  'Protected Areas — Army Division Facilities': p('Khu vực được bảo vệ — cơ sở sư đoàn lục quân', 'พื้นที่คุ้มครอง — สถานที่ของกองพลทหารบก', 'Kawasan Dilindungi — Fasilitas Divisi Angkatan Darat', 'Kawasan Dilindungi — Kemudahan Divisyen Tentera Darat'),
  'Protected Areas — Army Headquarters and Formation Facilities': p('Khu vực được bảo vệ — cơ sở bộ chỉ huy lục quân và đơn vị', 'พื้นที่คุ้มครอง — สถานที่กองบัญชาการทหารบกและหน่วยขึ้นตรง', 'Kawasan Dilindungi — Fasilitas Markas Angkatan Darat dan Formasi', 'Kawasan Dilindungi — Kemudahan Ibu Pejabat Tentera Darat dan Formasi'),
  'Protected Areas — Catchment and Waterways Facilities': p('Khu vực được bảo vệ — cơ sở lưu vực và tuyến thủy', 'พื้นที่คุ้มครอง — สถานที่ลุ่มน้ำและทางน้ำ', 'Kawasan Dilindungi — Fasilitas Daerah Tangkapan Air dan Perairan', 'Kawasan Dilindungi — Kemudahan Kawasan Tadahan dan Saliran'),
  'Protected Areas — Military Offshore Facilities': p('Khu vực được bảo vệ — cơ sở quân sự ngoài khơi', 'พื้นที่คุ้มครอง — สถานที่ทางทหารนอกชายฝั่ง', 'Kawasan Dilindungi — Fasilitas Lepas Pantai Militer', 'Kawasan Dilindungi — Kemudahan Luar Pesisir Tentera'),
  'Protected Areas — Military Training-1 Facilities': p('Khu vực được bảo vệ — cơ sở huấn luyện quân sự 1', 'พื้นที่คุ้มครอง — สถานที่ฝึกทหาร 1', 'Kawasan Dilindungi — Fasilitas Latihan Militer 1', 'Kawasan Dilindungi — Kemudahan Latihan Tentera 1'),
  'Protected Areas — Military Training-2 Facilities': p('Khu vực được bảo vệ — cơ sở huấn luyện quân sự 2', 'พื้นที่คุ้มครอง — สถานที่ฝึกทหาร 2', 'Kawasan Dilindungi — Fasilitas Latihan Militer 2', 'Kawasan Dilindungi — Kemudahan Latihan Tentera 2'),
  'Protected Areas — Military Training-3 Facilities': p('Khu vực được bảo vệ — cơ sở huấn luyện quân sự 3', 'พื้นที่คุ้มครอง — สถานที่ฝึกทหาร 3', 'Kawasan Dilindungi — Fasilitas Latihan Militer 3', 'Kawasan Dilindungi — Kemudahan Latihan Tentera 3'),
  'Protected Areas — Non-Military Places': p('Khu vực được bảo vệ — địa điểm phi quân sự', 'พื้นที่คุ้มครอง — สถานที่ที่ไม่ใช่ทหาร', 'Kawasan Dilindungi — Tempat Non-Militer', 'Kawasan Dilindungi — Tempat Bukan Tentera'),
  'Protected Areas — Public Hospitals': p('Khu vực được bảo vệ — bệnh viện công lập', 'พื้นที่คุ้มครอง — โรงพยาบาลของรัฐ', 'Kawasan Dilindungi — Rumah Sakit Pemerintah', 'Kawasan Dilindungi — Hospital Kerajaan'),
  'Protected Areas — Republic of Singapore Air Force Facilities': p('Khu vực được bảo vệ — cơ sở Không quân Cộng hòa Singapore', 'พื้นที่คุ้มครอง — สถานที่ของกองทัพอากาศสาธารณรัฐสิงคโปร์', 'Kawasan Dilindungi — Fasilitas Angkatan Udara Republik Singapura', 'Kawasan Dilindungi — Kemudahan Tentera Udara Republik Singapura'),
  'Protected Areas — Republic of Singapore Navy Facilities': p('Khu vực được bảo vệ — cơ sở Hải quân Cộng hòa Singapore', 'พื้นที่คุ้มครอง — สถานที่ของกองทัพเรือสาธารณรัฐสิงคโปร์', 'Kawasan Dilindungi — Fasilitas Angkatan Laut Republik Singapura', 'Kawasan Dilindungi — Kemudahan Tentera Laut Republik Singapura'),
  'Protected Areas — Telecommunication Facilities': p('Khu vực được bảo vệ — cơ sở viễn thông', 'พื้นที่คุ้มครอง — สถานที่โทรคมนาคม', 'Kawasan Dilindungi — Fasilitas Telekomunikasi', 'Kawasan Dilindungi — Kemudahan Telekomunikasi'),
  'Protected Areas — Water Supply and Water Reclamation Plants': p('Khu vực được bảo vệ — nhà máy cấp nước và tái chế nước', 'พื้นที่คุ้มครอง — โรงงานประปาและโรงงานผลิตน้ำกลับมาใช้ใหม่', 'Kawasan Dilindungi — Instalasi Penyediaan dan Daur Ulang Air', 'Kawasan Dilindungi — Loji Bekalan dan Penghasilan Semula Air'),
  'Regulated Air Cargo Agents and Known Consignors': p('Đại lý hàng hóa hàng không được quản lý và người gửi hàng đã biết', 'ตัวแทนขนส่งสินค้าทางอากาศที่ถูกกำกับและผู้ส่งสินค้าที่รู้จัก', 'Agen Kargo Udara yang Diatur dan Pengirim Barang Dikenal', 'Ejen Kargo Udara yang Dikawal dan Penghantar Barang Dikenali'),
  'Voluntary Reporting': p('Báo cáo tự nguyện', 'การรายงานโดยสมัครใจ', 'Pelaporan Sukarela', 'Pelaporan Sukarela'),
  'Wreck and Salvage of Aircraft': p('Xác tàu bay và trục vớt máy bay', 'ซากอากาศยานและการกู้ภัยอากาศยาน', 'Reruntuhan dan Penyelamatan Pesawat', 'Serpihan dan Penyelamatan Pesawat'),

  // ── Animals and Birds（12） ─────────────────────────────────
  'Exemption from Section 48(1)': p('Miễn trừ theo Điều 48(1)', 'การยกเว้นตามมาตรา 48(1)', 'Pembebasan Pasal 48(1)', 'Pengecualian Seksyen 48(1)'),
  'Importation': p('Nhập khẩu', 'การนำเข้า', 'Impor', 'Import'),
  'Licensing and Control of Cats and Dogs': p('Cấp phép và kiểm soát chó mèo', 'การออกใบอนุญาตและการควบคุมสุนัขและแมว', 'Perizinan dan Pengendalian Kucing dan Anjing', 'Pelesenan dan Kawalan Kucing dan Anjing'),
  'Licensing of Farms': p('Cấp phép trang trại', 'การออกใบอนุญาตฟาร์ม', 'Perizinan Peternakan', 'Pelesenan Ladang'),
  'Licensing of Premises for Pet Shop and Other Purposes': p('Cấp phép cơ sở cho cửa hàng thú cưng và các mục đích khác', 'การออกใบอนุญาตสถานที่สำหรับร้านขายสัตว์เลี้ยงและวัตถุประสงค์อื่น', 'Perizinan Tempat untuk Toko Hewan dan Tujuan Lain', 'Pelesenan Premis untuk Kedai Haiwan dan Tujuan Lain'),
  'Live Fish': p('Cá sống', 'ปลาเป็น', 'Ikan Hidup', 'Ikan Hidup'),
  'Pigeons': p('Bồ câu', 'นกพิราบ', 'Merpati', 'Merpati'),
  'Piranha': p('Cá piranha', 'ปลาปิรันยา', 'Piranha', 'Piranha'),
  'Prescribed Classes of Animals': p('Các nhóm động vật theo quy định', 'ประเภทสัตว์ตามที่กำหนด', 'Kelas Hewan yang Ditetapkan', 'Kelas Haiwan yang Ditetapkan'),
  'Prevention of Avian Disease in Non-Commercial Poultry': p('Phòng chống bệnh ở gia cầm không thương mại', 'การป้องกันโรคในสัตว์ปีกที่ไม่ใช่เชิงพาณิชย์', 'Pencegahan Penyakit pada Unggas Non-Komersial', 'Pencegahan Penyakit pada Unggas Bukan Komersial'),
  'Prohibition of Live Poultry on Pulau Ubin': p('Cấm gia cầm sống trên đảo Pulau Ubin', 'การห้ามสัตว์ปีกมีชีวิตบนเกาะปูเลาอูบิน', 'Larangan Unggas Hidup di Pulau Ubin', 'Larangan Unggas Hidup di Pulau Ubin'),
  'Veterinary Centres': p('Trung tâm thú y', 'ศูนย์สัตวแพทย์', 'Pusat Veteriner', 'Pusat Veterinar'),

  // ── Arbitration / Architects / Arms（7） ─────────────────────
  'International Investment Disputes': p('Tranh chấp đầu tư quốc tế', 'ข้อพิพาทการลงทุนระหว่างประเทศ', 'Sengketa Investasi Internasional', 'Pertikaian Pelaburan Antarabangsa'),
  'Exemption from Experience Requirements': p('Miễn trừ yêu cầu về kinh nghiệm', 'การยกเว้นข้อกำหนดด้านประสบการณ์', 'Pembebasan dari Persyaratan Pengalaman', 'Pengecualian daripada Keperluan Pengalaman'),
  'Exemption from Practising Certificates': p('Miễn trừ giấy chứng nhận hành nghề', 'การยกเว้นใบอนุญาตประกอบวิชาชีพ', 'Pembebasan dari Sertifikat Praktik', 'Pengecualian daripada Sijil Amalan'),
  'Prescribed Amount of Paid-Up Capital': p('Số vốn điều lệ đã góp theo quy định', 'จำนวนทุนจดทะเบียนที่ชำระแล้วตามที่กำหนด', 'Jumlah Modal Disetor yang Ditetapkan', 'Jumlah Modal Berbayar yang Ditetapkan'),
  'Professional Conduct and Ethics': p('Hành vi và đạo đức nghề nghiệp', 'ความประพฤติและจริยธรรมวิชาชีพ', 'Perilaku dan Etika Profesional', 'Kelakuan dan Etika Profesional'),
  'Arms': p('Vũ khí', 'อาวุธ', 'Senjata', 'Senjata'),

  // ── Banking（12） ───────────────────────────────────────────
  'Exemption from section 29(4) and (5)': p('Miễn trừ theo Điều 29(4) và (5)', 'การยกเว้นตามมาตรา 29(4) และ (5)', 'Pembebasan Pasal 29(4) dan (5)', 'Pengecualian Seksyen 29(4) dan (5)'),
  'Exemption from Section 4A (1) and (2)': p('Miễn trừ theo Điều 4A (1) và (2)', 'การยกเว้นตามมาตรา 4A (1) และ (2)', 'Pembebasan Pasal 4A (1) dan (2)', 'Pengecualian Seksyen 4A (1) dan (2)'),
  'Exemption from Section 4A(1) and (2)': p('Miễn trừ theo Điều 4A(1) và (2)', 'การยกเว้นตามมาตรา 4A(1) และ (2)', 'Pembebasan Pasal 4A(1) dan (2)', 'Pengecualian Seksyen 4A(1) dan (2)'),
  'Financial Penalties under Sections 38 and 39': p('Tiền phạt theo Điều 38 và 39', 'ค่าปรับตามมาตรา 38 และ 39', 'Sanksi Finansial menurut Pasal 38 dan 39', 'Penalti Kewangan di bawah Seksyen 38 dan 39'),
  'Inducement to Use Credit Card or Charge Card for Purchase of Residential Property': p('Xúi giục sử dụng thẻ tín dụng hoặc thẻ chi trả để mua bất động sản nhà ở', 'การชักจูงให้ใช้บัตรเครดิตหรือบัตรเรียกเก็บเงินเพื่อซื้ออสังหาริมทรัพย์ที่อยู่อาศัย', 'Dorongan Penggunaan Kartu Kredit atau Kartu Tagihan untuk Pembelian Properti Hunian', 'Dorongan Penggunaan Kad Kredit atau Kad Caj untuk Pembelian Hartanah Kediaman'),
  'Merchant Banks': p('Ngân hàng thương gia', 'ธนาคารพาณิชย์เพื่อธุรกิจ', 'Bank Pedagang', 'Bank Pedagang'),
  'Professional Relationship': p('Quan hệ nghề nghiệp', 'ความสัมพันธ์ทางวิชาชีพ', 'Hubungan Profesional', 'Hubungan Profesional'),
  'Publication and Provision of Accounts': p('Công bố và cung cấp báo cáo tài chính', 'การเผยแพร่และการจัดหางบการเงิน', 'Publikasi dan Penyediaan Laporan Keuangan', 'Penerbitan dan Penyediaan Akaun'),
  'Qualifying Subsidiary': p('Công ty con đủ điều kiện', 'บริษัทย่อยที่เข้าเกณฑ์', 'Anak Perusahaan yang Memenuhi Syarat', 'Anak Syarikat yang Layak'),

  // ── Betting / Bills of Sale / Biological Agents（4） ──────────
  'Casino Operators — Exemption': p('Nhà điều hành sòng bạc — Miễn trừ', 'ผู้ประกอบการคาสิโน — การยกเว้น', 'Operator Kasino — Pembebasan', 'Pengendali Kasino — Pengecualian'),
  'Singapore Totalisator Board — Exemption': p('Hội đồng Cá cược Singapore — Miễn trừ', 'คณะกรรมการทายผลสิงคโปร์ — การยกเว้น', 'Dewan Totalisator Singapura — Pembebasan', 'Lembaga Totalisator Singapura — Pengecualian'),
  'Removal of Books and Documents': p('Di chuyển sổ sách và giấy tờ', 'การเคลื่อนย้ายสมุดบัญชีและเอกสาร', 'Pemindahan Buku dan Dokumen', 'Pengalihan Buku dan Dokumen'),
  'Proficiency Testing': p('Kiểm tra năng lực', 'การทดสอบความชำนาญ', 'Uji Kemampuan', 'Ujian Kecekapan'),
  'Transportation': p('Vận chuyển', 'การขนส่ง', 'Pengangkutan', 'Pengangkutan'),

  // ── Boundaries / Broadcasting（6） ───────────────────────────
  'Map Production Service': p('Dịch vụ sản xuất bản đồ', 'บริการจัดทำแผนที่', 'Layanan Produksi Peta', 'Perkhidmatan Pengeluaran Peta'),
  'Singapore Land Authority Fees': p('Lệ phí của Cơ quan Đất đai Singapore', 'ค่าธรรมเนียมสำนักงานที่ดินสิงคโปร์', 'Biaya Badan Pertanahan Singapura', 'Fi Pihak Berkuasa Tanah Singapura'),
  'Exemption of Broadcasting Services by Educational Institutions': p('Miễn trừ dịch vụ phát sóng của các cơ sở giáo dục', 'การยกเว้นบริการกระจายเสียงของสถาบันการศึกษา', 'Pembebasan Layanan Penyiaran oleh Institusi Pendidikan', 'Pengecualian Perkhidmatan Penyiaran oleh Institusi Pendidikan'),
  'Online Codes of Practice Procedure': p('Thủ tục quy tắc thực hành trực tuyến', 'กระบวนการจรรยาบรรณปฏิบัติออนไลน์', 'Prosedur Kode Praktik Daring', 'Prosedur Kod Amalan Dalam Talian'),
  'Service of Documents Website': p('Trang web tống đạt tài liệu', 'เว็บไซต์การส่งเอกสาร', 'Situs Web Penyampaian Dokumen', 'Laman Web Penyerahan Dokumen'),
  'TVRO System': p('Hệ thống TVRO', 'ระบบ TVRO', 'Sistem TVRO', 'Sistem TVRO'),

  // ── Building / BCA（3） ─────────────────────────────────────
  'Strata Management': p('Quản lý phân tầng', 'การจัดการอาคารชุด', 'Pengelolaan Strata', 'Pengurusan Strata'),
  'Importers’ Licensing': p('Cấp phép nhà nhập khẩu', 'การออกใบอนุญาตผู้นำเข้า', 'Perizinan Importir', 'Pelesenan Pengimport'),
  'Registration of Construction Personnel': p('Đăng ký nhân sự xây dựng', 'การขึ้นทะเบียนบุคลากรก่อสร้าง', 'Pendaftaran Tenaga Konstruksi', 'Pendaftaran Kakitangan Pembinaan'),

  // ── Building Control（21） ──────────────────────────────────
  'Environmental Sustainability Measures for Existing Buildings': p('Biện pháp bền vững môi trường cho tòa nhà hiện hữu', 'มาตรการความยั่งยืนด้านสิ่งแวดล้อมสำหรับอาคารที่มีอยู่', 'Tindakan Keberlanjutan Lingkungan untuk Bangunan Eksisting', 'Langkah Kelestarian Alam Sekitar bagi Bangunan Sedia Ada'),
  'Environmental Sustainability': p('Bền vững môi trường', 'ความยั่งยืนด้านสิ่งแวดล้อม', 'Keberlanjutan Lingkungan', 'Kelestarian Alam Sekitar'),
  'Estimated Final Price for Class 2 General Builder’s Licence': p('Giá cuối cùng ước tính cho giấy phép nhà thầu xây dựng tổng hợp loại 2', 'ราคาสุดท้ายโดยประมาณสำหรับใบอนุญาตผู้รับเหมาก่อสร้างทั่วไปประเภท 2', 'Perkiraan Harga Akhir untuk Izin Pemborong Umum Kelas 2', 'Anggaran Harga Akhir bagi Lesen Pembina Am Kelas 2'),
  'Exempt Building Works': p('Công trình xây dựng được miễn trừ', 'งานก่อสร้างที่ได้รับการยกเว้น', 'Pekerjaan Bangunan yang Dikecualikan', 'Kerja Bangunan yang Dikecualikan'),
  'Exempt Fixed Installations and Fixed Installation Works': p('Hệ thống lắp đặt cố định và công trình lắp đặt cố định được miễn trừ', 'ระบบติดตั้งถาวรและงานติดตั้งถาวรที่ได้รับการยกเว้น', 'Instalasi Tetap dan Pekerjaan Instalasi Tetap yang Dikecualikan', 'Pepasangan Kekal dan Kerja Pepasangan Kekal yang Dikecualikan'),
  'Exempt Military Buildings and Building Works': p('Công trình quân sự và công trình xây dựng quân sự được miễn trừ', 'อาคารทหารและงานก่อสร้างอาคารทหารที่ได้รับการยกเว้น', 'Bangunan Militer dan Pekerjaan Bangunan Militer yang Dikecualikan', 'Bangunan Tentera dan Kerja Bangunan Tentera yang Dikecualikan'),
  'Exemption from Accredited Checking Organisation Requirements': p('Miễn trừ yêu cầu về tổ chức kiểm tra được công nhận', 'การยกเว้นข้อกำหนดขององค์กรตรวจสอบที่ได้รับการรับรอง', 'Pembebasan dari Persyaratan Organisasi Pemeriksa Terakreditasi', 'Pengecualian daripada Keperluan Organisasi Pemeriksa Bertauliah'),
  'Exemption from section 12 for Buildings Under Construction Used as Workers’ Quarters': p('Miễn trừ Điều 12 đối với tòa nhà đang xây dựng được dùng làm nhà ở công nhân', 'การยกเว้นมาตรา 12 สำหรับอาคารระหว่างก่อสร้างที่ใช้เป็นที่พักคนงาน', 'Pembebasan Pasal 12 bagi Bangunan dalam Pembangunan yang Digunakan sebagai Asrama Pekerja', 'Pengecualian Seksyen 12 bagi Bangunan Dalam Pembinaan yang Digunakan sebagai Kuarters Pekerja'),
  'Fixed Installations': p('Hệ thống lắp đặt cố định', 'ระบบติดตั้งถาวร', 'Instalasi Tetap', 'Pepasangan Kekal'),
  'Licensing of Builders': p('Cấp phép nhà thầu xây dựng', 'การออกใบอนุญาตผู้รับเหมาก่อสร้าง', 'Perizinan Pemborong Bangunan', 'Pelesenan Pembina'),
  'Meaning of Exterior Features': p('Ý nghĩa của các đặc điểm ngoại thất', 'ความหมายของคุณลักษณะภายนอกอาคาร', 'Arti Fitur Eksterior', 'Maksud Ciri Luaran'),
  'Outdoor Advertising': p('Quảng cáo ngoài trời', 'การโฆษณากลางแจ้ง', 'Periklanan Luar Ruang', 'Pengiklanan Luar'),
  'Periodic Inspection of Buildings and Building Façades': p('Kiểm tra định kỳ tòa nhà và mặt tiền tòa nhà', 'การตรวจสอบอาคารและผนังอาคารเป็นระยะ', 'Pemeriksaan Berkala Bangunan dan Fasad Bangunan', 'Pemeriksaan Berkala Bangunan dan Fasad Bangunan'),
  'Prescribed Electronic Service under Section 42AA': p('Tống đạt điện tử theo quy định tại Điều 42AA', 'การส่งเอกสารทางอิเล็กทรอนิกส์ตามที่กำหนดภายใต้มาตรา 42AA', 'Penyampaian Elektronik yang Ditetapkan menurut Pasal 42AA', 'Penyerahan Elektronik yang Ditetapkan di bawah Seksyen 42AA'),
  'Regulating Fixed Installation Contractors': p('Quản lý nhà thầu lắp đặt cố định', 'การกำกับผู้รับเหมาติดตั้งถาวร', 'Pengaturan Kontraktor Instalasi Tetap', 'Pengawalan Kontraktor Pepasangan Kekal'),
  'Reportable Matters': p('Các vấn đề phải báo cáo', 'เรื่องที่ต้องรายงาน', 'Hal yang Wajib Dilaporkan', 'Perkara yang Perlu Dilaporkan'),
  'Retrofitting of Casement Windows': p('Cải tạo cửa sổ mở bản lề', 'การปรับปรุงหน้าต่างบานเปิด', 'Retrofit Jendela Engsel', 'Pengubahsuaian Tingkap Buka'),
  'Temporary Buildings': p('Công trình tạm', 'อาคารชั่วคราว', 'Bangunan Sementara', 'Bangunan Sementara'),
  'Use of Buildings Under Construction as Workers’ Quarters': p('Sử dụng tòa nhà đang xây dựng làm nhà ở công nhân', 'การใช้ประโยชน์อาคารระหว่างก่อสร้างเป็นที่พักคนงาน', 'Penggunaan Bangunan dalam Pembangunan sebagai Asrama Pekerja', 'Penggunaan Bangunan Dalam Pembinaan sebagai Kuarters Pekerja'),
  'Value of Building Works Requiring Accredited Checker from Accredited Checking Organisation': p('Giá trị công trình xây dựng cần kiểm tra viên được công nhận từ tổ chức kiểm tra được công nhận', 'มูลค่างานก่อสร้างที่ต้องมีผู้ตรวจสอบที่ได้รับการรับรองจากองค์กรตรวจสอบที่ได้รับการรับรอง', 'Nilai Pekerjaan Bangunan yang Memerlukan Pemeriksa Terakreditasi dari Organisasi Pemeriksa Terakreditasi', 'Nilai Kerja Bangunan yang Memerlukan Pemeriksa Bertauliah daripada Organisasi Pemeriksa Bertauliah'),
  'Value of Significant General Building Work Projects': p('Giá trị các dự án công trình xây dựng tổng hợp quan trọng', 'มูลค่าโครงการงานก่อสร้างอาคารทั่วไปที่สำคัญ', 'Nilai Proyek Pekerjaan Bangunan Umum Signifikan', 'Nilai Projek Kerja Bangunan Am Penting'),

  // ── Building Maintenance and Strata Management（8） ────────────
  'Exemption of Certain Management Corporations from Section 27(1)': p('Miễn trừ một số tổng công ty quản lý theo Điều 27(1)', 'การยกเว้นนิติบุคคลอาคารชุดบางแห่งตามมาตรา 27(1)', 'Pembebasan Badan Pengelola Tertentu dari Pasal 27(1)', 'Pengecualian Perbadanan Pengurusan Tertentu daripada Seksyen 27(1)'),
  'HDB Privatised Estates — Exemption': p('Khu nhà ở tư nhân hóa của HDB — Miễn trừ', 'นิคมที่แปรรูปเป็นเอกชนของ HDB — การยกเว้น', 'Perumahan Swastanisasi HDB — Pembebasan', 'Estet Diswastakan HDB — Pengecualian'),
  'Lift, Escalator and Building Maintenance': p('Bảo trì thang máy, thang cuốn và tòa nhà', 'การบำรุงรักษาลิฟต์ บันไดเลื่อน และอาคาร', 'Pemeliharaan Lift, Eskalator dan Bangunan', 'Penyelenggaraan Lif, Eskalator dan Bangunan'),
  'Small Management Corporations — Exemption': p('Tổng công ty quản lý quy mô nhỏ — Miễn trừ', 'นิติบุคคลอาคารชุดขนาดเล็ก — การยกเว้น', 'Badan Pengelola Kecil — Pembebasan', 'Perbadanan Pengurusan Kecil — Pengecualian'),
  'Strata Management Accounts — Exemption': p('Tài khoản quản lý nhà chung cư — Miễn trừ', 'บัญชีการจัดการอาคารชุด — การยกเว้น', 'Akun Pengelolaan Strata — Pembebasan', 'Akaun Pengurusan Strata — Pengecualian'),
  'Strata Titles Boards': p('Hội đồng phân chia quyền sở hữu', 'คณะกรรมการสิทธิอาคารชุด', 'Dewan Hak Strata', 'Lembaga Hak Strata'),
  'Strata Units': p('Đơn vị nhà chung cư', 'หน่วยอาคารชุด', 'Unit Strata', 'Unit Strata'),
  'Termination of Management Corporation — Exemption': p('Chấm dứt tổng công ty quản lý — Miễn trừ', 'การสิ้นสุดนิติบุคคลอาคารชุด — การยกเว้น', 'Pengakhiran Badan Pengelola — Pembebasan', 'Penamatan Perbadanan Pengurusan — Pengecualian'),
};

module.exports = mod;
