'use strict';
// SG 尾段附注事项译名：第 9 批（I 段，90 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Inland Revenue Authority of Singapore（2） ─────────────────
  'Prescribed Interest Rate for Section 17D': p('Lãi suất theo quy định cho Điều 17D', 'อัตราดอกเบี้ยตามที่กำหนดสำหรับมาตรา 17D', 'Suku Bunga yang Ditetapkan untuk Pasal 17D', 'Kadar Faedah yang Ditetapkan bagi Seksyen 17D'),
  'Wage Credit Scheme — Fees': p('Chương trình tín dụng tiền lương — Lệ phí', 'โครงการเครดิตค่าจ้าง — ค่าธรรมเนียม', 'Skema Kredit Upah — Biaya', 'Skim Kredit Gaji — Fi'),

  // ── Insolvency, Restructuring and Dissolution（27） ───────────
  'Exemption from Section 412(1)(d)': p('Miễn trừ theo Điều 412(1)(d)', 'การยกเว้นตามมาตรา 412(1)(d)', 'Pembebasan Pasal 412(1)(d)', 'Pengecualian Seksyen 412(1)(d)'),
  'Extension of Prescribed Periods for Parts 5A and 10A': p('Gia hạn thời hạn theo quy định cho Phần 5A và 10A', 'การขยายระยะเวลาตามที่กำหนดสำหรับภาค 5A และ 10A', 'Perpanjangan Periode yang Ditetapkan untuk Bagian 5A dan 10A', 'Pelanjutan Tempoh yang Ditetapkan bagi Bahagian 5A dan 10A'),
  'Further Extension of Prescribed Periods for Parts 5A and 10A': p('Gia hạn thêm thời hạn theo quy định cho Phần 5A và 10A', 'การขยายระยะเวลาเพิ่มเติมตามที่กำหนดสำหรับภาค 5A และ 10A', 'Perpanjangan Lanjutan Periode yang Ditetapkan untuk Bagian 5A dan 10A', 'Pelanjutan Lanjut Tempoh yang Ditetapkan bagi Bahagian 5A dan 10A'),
  'Filing, Lodgment and Submission of Documents': p('Nộp, đăng ký và trình tài liệu', 'การยื่น การจดทะเบียน และการส่งเอกสาร', 'Penyampaian, Pendaftaran dan Pengajuan Dokumen', 'Pemfailan, Pendaftaran dan Penyerahan Dokumen'),
  'Insolvency Practitioners': p('Người hành nghề phá sản', 'ผู้ประกอบวิชาชีพด้านการล้มละลาย', 'Praktisi Insolvensi', 'Pengamal Insolvensi'),
  'Judicial Management': p('Quản lý tư pháp', 'การบริหารจัดการโดยศาล', 'Manajemen Yudisial', 'Pengurusan Kehakiman'),
  'Late Lodgment Penalties': p('Tiền phạt do nộp muộn', 'ค่าปรับการยื่นล่าช้า', 'Denda Keterlambatan Pendaftaran', 'Penalti Kelewatan Pendaftaran'),
  'Maximum Amount Payable in Priority': p('Số tiền tối đa được thanh toán ưu tiên', 'จำนวนเงินสูงสุดที่ต้องชำระตามลำดับบุริมสิทธิ', 'Jumlah Maksimum yang Dibayarkan Secara Prioritas', 'Jumlah Maksimum yang Dibayar Secara Keutamaan'),
  'Modifications to Specified Acts under Section 72U': p('Sửa đổi các Luật được chỉ định theo Điều 72U', 'การแก้ไขกฎหมายที่ระบุตามมาตรา 72U', 'Modifikasi Undang-Undang Tertentu menurut Pasal 72U', 'Pengubahsuaian Akta Tertentu di bawah Seksyen 72U'),
  'Official Assignee’s Fees': p('Lệ phí của Quản thủ chính thức', 'ค่าธรรมเนียมผู้จัดการทรัพย์สินอย่างเป็นทางการ', 'Biaya Wali Pailit Resmi', 'Fi Pemegang Harta Rasmi'),
  'Personal Insolvency': p('Phá sản cá nhân', 'การล้มละลายส่วนบุคคล', 'Insolvensi Perorangan', 'Insolvensi Individu'),
  'Prescribed Arrangements and Proceedings': p('Thỏa thuận và tố tụng theo quy định', 'ข้อตกลงและกระบวนพิจารณาตามที่กำหนด', 'Pengaturan dan Proses yang Ditetapkan', 'Pengaturan dan Prosiding yang Ditetapkan'),
  'Prescribed Companies and Entities': p('Công ty và pháp nhân theo quy định', 'บริษัทและนิติบุคคลตามที่กำหนด', 'Perusahaan dan Entitas yang Ditetapkan', 'Syarikat dan Entiti yang Ditetapkan'),
  'Prescribed Companies for Purposes of Sections 72A and 250A': p('Công ty theo quy định cho các mục đích của Điều 72A và 250A', 'บริษัทตามที่กำหนดเพื่อวัตถุประสงค์ของมาตรา 72A และ 250A', 'Perusahaan yang Ditetapkan untuk Keperluan Pasal 72A dan 250A', 'Syarikat yang Ditetapkan bagi Tujuan Seksyen 72A dan 250A'),
  'Prescribed Companies under Section 440': p('Công ty theo quy định tại Điều 440', 'บริษัทตามที่กำหนดภายใต้มาตรา 440', 'Perusahaan yang Ditetapkan menurut Pasal 440', 'Syarikat yang Ditetapkan di bawah Seksyen 440'),
  'Prescribed Contracts under Section 440': p('Hợp đồng theo quy định tại Điều 440', 'สัญญาตามที่กำหนดภายใต้มาตรา 440', 'Kontrak yang Ditetapkan menurut Pasal 440', 'Kontrak yang Ditetapkan di bawah Seksyen 440'),
  'Prescribed Criteria and Circumstances under Sections 72F and 250F': p('Tiêu chí và hoàn cảnh theo quy định tại Điều 72F và 250F', 'เกณฑ์และสถานการณ์ตามที่กำหนดภายใต้มาตรา 72F และ 250F', 'Kriteria dan Keadaan yang Ditetapkan menurut Pasal 72F dan 250F', 'Kriteria dan Keadaan yang Ditetapkan di bawah Seksyen 72F dan 250F'),
  'Prescribed Periods for Parts 5A and 10A': p('Thời hạn theo quy định cho Phần 5A và 10A', 'ระยะเวลาตามที่กำหนดสำหรับภาค 5A และ 10A', 'Periode yang Ditetapkan untuk Bagian 5A dan 10A', 'Tempoh yang Ditetapkan bagi Bahagian 5A dan 10A'),
  'Proofs of Debt in Schemes of Arrangement': p('Chứng từ công nợ trong phương án thỏa thuận', 'หลักฐานการเป็นหนี้ในแผนข้อตกลง', 'Bukti Utang dalam Skema Pengaturan', 'Bukti Hutang dalam Skim Pengaturan'),
  'Receivership': p('Tiếp nhận tài sản', 'การเป็นผู้ควบคุมทรัพย์สิน', 'Penerimaan Aset', 'Penerimaan Aset'),
  'Reciprocal Recognition of Official Assignees': p('Công nhận tương hỗ quản thủ chính thức', 'การรับรองผู้จัดการทรัพย์สินอย่างเป็นทางการซึ่งกันและกัน', 'Pengakuan Timbal Balik Wali Pailit Resmi', 'Pengiktirafan Timbal Balik Pemegang Harta Rasmi'),
  'Repeal of Bankruptcy Act': p('Bãi bỏ Luật Phá sản', 'การยกเลิกพระราชบัญญัติล้มละลาย', 'Pencabutan Undang-Undang Kepailitan', 'Pemansuhan Akta Kebankrapan'),
  'Simplified Debt Restructuring': p('Tái cơ cấu nợ đơn giản hóa', 'การปรับโครงสร้างหนี้แบบง่าย', 'Restrukturisasi Utang Sederhana', 'Penstrukturan Semula Hutang Dipermudah'),
  'Simplified Winding Up': p('Thanh lý đơn giản hóa', 'การชำระบัญชีแบบง่าย', 'Likuidasi Sederhana', 'Penggulungan Dipermudah'),
  'Voluntary Arrangements': p('Thỏa thuận tự nguyện', 'ข้อตกลงโดยสมัครใจ', 'Pengaturan Sukarela', 'Pengaturan Sukarela'),
  'Voluntary Winding Up': p('Thanh lý tự nguyện', 'การชำระบัญชีโดยสมัครใจ', 'Likuidasi Sukarela', 'Penggulungan Sukarela'),

  // ── Insurance（13） ───────────────────────────────────────────
  'Exemption from Deadlines for Submission of Returns': p('Miễn trừ thời hạn nộp báo cáo', 'การยกเว้นกำหนดเวลาการยื่นรายงาน', 'Pembebasan dari Tenggat Penyampaian Laporan', 'Pengecualian daripada Tarikh Akhir Penyerahan Laporan'),
  'Financial Guarantee Insurance': p('Bảo hiểm bảo lãnh tài chính', 'การประกันภัยค้ำประกันทางการเงิน', 'Asuransi Jaminan Keuangan', 'Insurans Jaminan Kewangan'),
  'General Provisions and Exemptions for Captive Insurers': p('Quy định chung và miễn trừ cho doanh nghiệp tự bảo hiểm', 'บทบัญญัติทั่วไปและการยกเว้นสำหรับผู้รับประกันภัยแบบแคปทีฟ', 'Ketentuan Umum dan Pembebasan bagi Penanggung Asuransi Captive', 'Peruntukan Am dan Pengecualian bagi Penanggung Insurans Captive'),
  'General Provisions and Exemptions for Marine Mutual Insurers': p('Quy định chung và miễn trừ cho doanh nghiệp bảo hiểm tương hỗ hàng hải', 'บทบัญญัติทั่วไปและการยกเว้นสำหรับผู้รับประกันภัยทางทะเลแบบช่วยเหลือซึ่งกันและกัน', 'Ketentuan Umum dan Pembebasan bagi Penanggung Asuransi Bahari Timbal Balik', 'Peruntukan Am dan Pengecualian bagi Penanggung Insurans Marin Bersama'),
  'General Provisions and Exemptions for Special Purpose Reinsurance Vehicles': p('Quy định chung và miễn trừ cho phương tiện tái bảo hiểm có mục đích đặc biệt', 'บทบัญญัติทั่วไปและการยกเว้นสำหรับนิติบุคคลเฉพาะกิจรับประกันภัยต่อ', 'Ketentuan Umum dan Pembebasan bagi Kendaraan Reasuransi Tujuan Khusus', 'Peruntukan Am dan Pengecualian bagi Wahana Insurans Semula Tujuan Khas'),
  'General Provisions': p('Quy định chung', 'บทบัญญัติทั่วไป', 'Ketentuan Umum', 'Peruntukan Am'),
  'Intermediaries': p('Trung gian bảo hiểm', 'ตัวกลาง', 'Perantara', 'Pengantara'),
  'Lloyd’s Asia Scheme': p('Chương trình Lloyd’s châu Á', 'โครงการ Lloyd’s เอเชีย', 'Skema Lloyd’s Asia', 'Skim Lloyd’s Asia'),
  'Lloyd’s Scheme': p('Chương trình Lloyd’s', 'โครงการ Lloyd’s', 'Skema Lloyd’s', 'Skim Lloyd’s'),
  'Nomination of Beneficiaries': p('Chỉ định người thụ hưởng', 'การระบุผู้รับผลประโยชน์', 'Penunjukan Penerima Manfaat', 'Penamaan Penerima Manfaat'),
  'Prescribed Interests under Section 34(6)': p('Quyền lợi theo quy định tại Điều 34(6)', 'ผลประโยชน์ตามที่กำหนดภายใต้มาตรา 34(6)', 'Kepentingan yang Ditetapkan menurut Pasal 34(6)', 'Kepentingan yang Ditetapkan di bawah Seksyen 34(6)'),
  'Valuation and Capital': p('Định giá và vốn', 'การประเมินมูลค่าและเงินกองทุน', 'Penilaian dan Modal', 'Penilaian dan Modal'),
  'Web Aggregator Fees': p('Lệ phí nền tảng tổng hợp trực tuyến', 'ค่าธรรมเนียมผู้รวบรวมข้อมูลทางเว็บ', 'Biaya Agregator Web', 'Fi Pengagregat Web'),

  // ── Internal Security（4） ────────────────────────────────────
  'Injury Allowances': p('Trợ cấp thương tật', 'เงินช่วยเหลือผู้บาดเจ็บ', 'Tunjangan Cedera', 'Elaun Kecederaan'),
  'Prohibition of Documents': p('Cấm tài liệu', 'การห้ามเอกสาร', 'Larangan Dokumen', 'Larangan Dokumen'),
  'Prohibition of Emblems': p('Cấm biểu tượng', 'การห้ามตราสัญลักษณ์', 'Larangan Lambang', 'Larangan Lambang'),
  'Prohibition of Publications': p('Cấm ấn phẩm', 'การห้ามสิ่งพิมพ์', 'Larangan Terbitan', 'Larangan Penerbitan'),

  // ── Intoxicating Substances（2） ──────────────────────────────
  'Treatment and Rehabilitation': p('Điều trị và phục hồi', 'การบำบัดและการฟื้นฟู', 'Perawatan dan Rehabilitasi', 'Rawatan dan Pemulihan'),
  'Use of Information in Register and DNA Database': p('Sử dụng thông tin trong sổ đăng ký và cơ sở dữ liệu DNA', 'การใช้ข้อมูลในทะเบียนและฐานข้อมูลดีเอ็นเอ', 'Penggunaan Informasi dalam Register dan Basis Data DNA', 'Penggunaan Maklumat dalam Daftar dan Pangkalan Data DNA'),

  // ── Interpretation（9） ───────────────────────────────────────
  'Fee for Traffic Rights Application Certificate': p('Lệ phí cấp giấy chứng nhận xin quyền vận chuyển', 'ค่าธรรมเนียมใบรับรองการขอสิทธิการจราจรทางอากาศ', 'Biaya Sertifikat Permohonan Hak Angkut', 'Fi Sijil Permohonan Hak Trafik'),
  'Gazette': p('Công báo', 'ราชกิจจานุเบกษา', 'Berita Negara', 'Warta Kerajaan'),
  'Health Sciences Authority Act — Fees': p('Luật Cơ quan Khoa học Y tế — Lệ phí', 'พระราชบัญญัติหน่วยงานวิทยาศาสตร์สุขภาพ — ค่าธรรมเนียม', 'Undang-Undang Badan Ilmu Kesehatan — Biaya', 'Akta Pihak Berkuasa Sains Kesihatan — Fi'),
  'Housing and Development Board — Fees': p('Ủy ban Nhà ở và Phát triển — Lệ phí', 'คณะกรรมการที่อยู่อาศัยและการพัฒนา — ค่าธรรมเนียม', 'Badan Perumahan dan Pembangunan — Biaya', 'Lembaga Perumahan dan Pembangunan — Fi'),
  'Price Control (Rice) Order — Fees': p('Lệnh Kiểm soát Giá (Gạo) — Lệ phí', 'คำสั่งควบคุมราคา (ข้าว) — ค่าธรรมเนียม', 'Perintah Pengendalian Harga (Beras) — Biaya', 'Perintah Kawalan Harga (Beras) — Fi'),
  'Remission of Fees under Hotels Licensing Regulations': p('Giảm lệ phí theo Quy chế Cấp phép Khách sạn', 'การลดหย่อนค่าธรรมเนียมตามข้อบังคับการออกใบอนุญาตโรงแรม', 'Keringanan Biaya menurut Peraturan Perizinan Hotel', 'Pelepasan Fi di bawah Peraturan Pelesenan Hotel'),
  'Singapore Food Agency — Fees for Certificates for Export': p('Cơ quan Thực phẩm Singapore — Lệ phí giấy chứng nhận xuất khẩu', 'สำนักงานอาหารสิงคโปร์ — ค่าธรรมเนียมใบรับรองการส่งออก', 'Badan Pangan Singapura — Biaya Sertifikat Ekspor', 'Agensi Makanan Singapura — Fi Sijil Eksport'),
  'Singapore Food Agency — Fees': p('Cơ quan Thực phẩm Singapore — Lệ phí', 'สำนักงานอาหารสิงคโปร์ — ค่าธรรมเนียม', 'Badan Pangan Singapura — Biaya', 'Agensi Makanan Singapura — Fi'),

  // ── International Organisations（31） ─────────────────────────
  'Immunities and Privileges': p('Quyền miễn trừ và đặc quyền', 'ความคุ้มกันและเอกสิทธิ์', 'Kekebalan dan Hak Istimewa', 'Kekebalan dan Keistimewaan'),
  'APEC Secretariat': p('Ban Thư ký APEC', 'สำนักเลขาธิการ APEC', 'Sekretariat APEC', 'Sekretariat APEC'),
  'ASEAN+3 Macroeconomic Research Office': p('Văn phòng Nghiên cứu Kinh tế Vĩ mô ASEAN+3', 'สำนักงานวิจัยเศรษฐกิจมหภาคอาเซียน+3', 'Kantor Riset Makroekonomi ASEAN+3', 'Pejabat Penyelidikan Makroekonomi ASEAN+3'),
  'Asian Development Bank': p('Ngân hàng Phát triển Châu Á', 'ธนาคารพัฒนาเอเชีย', 'Bank Pembangunan Asia', 'Bank Pembangunan Asia'),
  'Bank for International Settlements': p('Bank for International Settlements', 'Bank for International Settlements', 'Bank for International Settlements', 'Bank for International Settlements'),
  'Colombo Plan Staff College for Technician Education': p('Trường Cao đẳng Nhân viên Kế hoạch Colombo về Giáo dục Kỹ thuật viên', 'วิทยาลัยเจ้าหน้าที่แผนโคลัมโบด้านการศึกษาช่างเทคนิค', 'Sekolah Tinggi Staf Rencana Colombo untuk Pendidikan Teknisi', 'Kolej Staf Pelan Colombo bagi Pendidikan Juruteknik'),
  'Commonwealth Secretariat': p('Ban Thư ký Khối Thịnh vượng chung', 'สำนักเลขาธิการเครือจักรภพ', 'Sekretariat Persemakmuran', 'Sekretariat Komanwel'),
  'Food and Agriculture Organization': p('Tổ chức Lương thực và Nông nghiệp', 'องค์การอาหารและเกษตร', 'Organisasi Pangan dan Pertanian', 'Pertubuhan Makanan dan Pertanian'),
  'ICPO-INTERPOL': p('ICPO-INTERPOL', 'ICPO-INTERPOL', 'ICPO-INTERPOL', 'ICPO-INTERPOL'),
  'IEA Regional Cooperation Centre': p('Trung tâm Hợp tác Khu vực IEA', 'ศูนย์ความร่วมมือระดับภูมิภาค IEA', 'Pusat Kerja Sama Regional IEA', 'Pusat Kerjasama Serantau IEA'),
  'IMF-Singapore Regional Training Institute': p('Viện Đào tạo Khu vực IMF-Singapore', 'สถาบันฝึกอบรมระดับภูมิภาค IMF-สิงคโปร์', 'Institut Pelatihan Regional IMF-Singapura', 'Institut Latihan Serantau IMF-Singapura'),
  'INTELSAT': p('INTELSAT', 'INTELSAT', 'INTELSAT', 'INTELSAT'),
  'International Atomic Energy Agency': p('Cơ quan Năng lượng Nguyên tử Quốc tế', 'ทบวงการพลังงานปรมาณูระหว่างประเทศ', 'Badan Tenaga Atom Internasional', 'Agensi Tenaga Atom Antarabangsa'),
  'International Civil Aviation Organization': p('Tổ chức Hàng không Dân dụng Quốc tế', 'องค์การการบินพลเรือนระหว่างประเทศ', 'Organisasi Penerbangan Sipil Internasional', 'Pertubuhan Penerbangan Awam Antarabangsa'),
  'International Labour Organization': p('Tổ chức Lao động Quốc tế', 'องค์การแรงงานระหว่างประเทศ', 'Organisasi Buruh Internasional', 'Pertubuhan Buruh Antarabangsa'),
  'International Monetary Fund': p('Quỹ Tiền tệ Quốc tế', 'กองทุนการเงินระหว่างประเทศ', 'Dana Moneter Internasional', 'Tabung Kewangan Antarabangsa'),
  'International Rubber Study Group': p('Nhóm Nghiên cứu Cao su Quốc tế', 'กลุ่มศึกษายางระหว่างประเทศ', 'Kelompok Studi Karet Internasional', 'Kumpulan Kajian Getah Antarabangsa'),
  'International Telecommunications Union': p('Liên minh Viễn thông Quốc tế', 'สหภาพโทรคมนาคมระหว่างประเทศ', 'Persatuan Telekomunikasi Internasional', 'Kesatuan Telekomunikasi Antarabangsa'),
  'International Tribunal for the Law of the Sea': p('Tòa án Quốc tế về Luật Biển', 'ศาลระหว่างประเทศว่าด้วยกฎหมายทะเล', 'Pengadilan Internasional untuk Hukum Laut', 'Tribunal Antarabangsa bagi Undang-Undang Laut'),
  'Multilateral Investment Guarantee Agency': p('Cơ quan Bảo lãnh Đầu tư Đa phương', 'หน่วยงานค้ำประกันการลงทุนพหุภาคี', 'Badan Penjaminan Investasi Multilateral', 'Agensi Jaminan Pelaburan Multilateral'),
  'Permanent Court of Arbitration': p('Tòa án Trọng tài Thường trực', 'ศาลอนุญาโตตุลาการถาวร', 'Pengadilan Arbitrase Permanen', 'Mahkamah Timbang Tara Kekal'),
  'ReCAAP Information Sharing Centre': p('Trung tâm Chia sẻ Thông tin ReCAAP', 'ศูนย์แลกเปลี่ยนข้อมูล ReCAAP', 'Pusat Berbagi Informasi ReCAAP', 'Pusat Perkongsian Maklumat ReCAAP'),
  'Southeast Asian Fisheries Development Centre': p('Trung tâm Phát triển Nghề cá Đông Nam Á', 'ศูนย์พัฒนาการประมงเอเชียตะวันออกเฉียงใต้', 'Pusat Pengembangan Perikanan Asia Tenggara', 'Pusat Pembangunan Perikanan Asia Tenggara'),
  'Southeast Asian Ministers of Education Organization': p('Tổ chức Bộ trưởng Giáo dục Đông Nam Á', 'องค์การรัฐมนตรีศึกษาแห่งเอเชียตะวันออกเฉียงใต้', 'Organisasi Menteri Pendidikan Asia Tenggara', 'Pertubuhan Menteri Pendidikan Asia Tenggara'),
  'United Nations and International Court of Justice': p('Liên Hợp Quốc và Tòa án Công lý Quốc tế', 'สหประชาชาติและศาลยุติธรรมระหว่างประเทศ', 'Perserikatan Bangsa-Bangsa dan Mahkamah Internasional', 'Pertubuhan Bangsa-Bangsa Bersatu dan Mahkamah Keadilan Antarabangsa'),
  'United Nations Development Programme': p('Chương trình Phát triển Liên Hợp Quốc', 'โครงการพัฒนาแห่งสหประชาชาติ', 'Program Pembangunan Perserikatan Bangsa-Bangsa', 'Program Pembangunan Pertubuhan Bangsa-Bangsa Bersatu'),
  'United Nations Educational, Scientific and Cultural Organization': p('Tổ chức Giáo dục, Khoa học và Văn hóa Liên Hợp Quốc', 'องค์การการศึกษา วิทยาศาสตร์ และวัฒนธรรมแห่งสหประชาชาติ', 'Organisasi Pendidikan, Ilmu Pengetahuan dan Kebudayaan Perserikatan Bangsa-Bangsa', 'Pertubuhan Pendidikan, Saintifik dan Kebudayaan Pertubuhan Bangsa-Bangsa Bersatu'),
  'Universal Postal Union': p('Liên minh Bưu chính Thế giới', 'สหภาพไปรษณีย์สากล', 'Persatuan Pos Universal', 'Kesatuan Pos Sejagat'),
  'World Bank Group Organisations': p('Các tổ chức thuộc Nhóm Ngân hàng Thế giới', 'องค์กรในกลุ่มธนาคารโลก', 'Organisasi Kelompok Bank Dunia', 'Pertubuhan Kumpulan Bank Dunia'),
  'World Health Organization': p('Tổ chức Y tế Thế giới', 'องค์การอนามัยโลก', 'Organisasi Kesehatan Dunia', 'Pertubuhan Kesihatan Sedunia'),
  'World Intellectual Property Organization': p('Tổ chức Sở hữu Trí tuệ Thế giới', 'องค์การทรัพย์สินทางปัญญาโลก', 'Organisasi Kekayaan Intelektual Dunia', 'Pertubuhan Harta Intelek Sedunia'),
  'World Meteorological Organization': p('Tổ chức Khí tượng Thế giới', 'องค์การอุตุนิยมวิทยาโลก', 'Organisasi Meteorologi Dunia', 'Pertubuhan Meteorologi Sedunia'),
};

module.exports = mod;
