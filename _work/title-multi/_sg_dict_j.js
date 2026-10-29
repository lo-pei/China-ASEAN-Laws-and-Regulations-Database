'use strict';
// SG 尾段附注事项译名：第 10 批（J–M 段，92 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

const mod = {
  // ── Judicial Committee / Judicial Proceedings / Judicial Service（4） ──
  'Criminal Appeals': p('Kháng cáo hình sự', 'การอุทธรณ์คดีอาญา', 'Banding Pidana', 'Rayuan Jenayah'),
  'Regulation of Reports': p('Quản lý việc đưa tin', 'การควบคุมการรายงานข่าว', 'Pengaturan Pemberitaan', 'Pengawalan Laporan'),
  'Personnel Board': p('Hội đồng Nhân sự', 'คณะกรรมการบุคลากร', 'Dewan Kepegawaian', 'Lembaga Personel'),
  'Personnel Boards': p('Các hội đồng nhân sự', 'คณะกรรมการบุคลากร', 'Dewan-Dewan Kepegawaian', 'Lembaga-Lembaga Personel'),
  'Threshold Grade': p('Cấp bậc ngưỡng', 'ระดับขั้นต่ำ', 'Tingkat Ambang', 'Gred Ambang'),

  // ── Jurong Town Corporation / Land*（10） ─────────────────────
  'Parks': p('Công viên', 'สวนสาธารณะ', 'Taman', 'Taman'),
  'Table of Rates and Valuation Method': p('Bảng mức thu và phương pháp định giá', 'ตารางอัตราและวิธีการประเมินมูลค่า', 'Tabel Tarif dan Metode Penilaian', 'Jadual Kadar dan Kaedah Penilaian'),
  'Investigation Committees': p('Ủy ban điều tra', 'คณะกรรมการสอบสวน', 'Komite Investigasi', 'Jawatankuasa Siasatan'),
  'Strata': p('Phân tầng', 'อาคารชุด', 'Strata', 'Strata'),
  'Application of Sections 84E and 84F to Other Estates': p('Áp dụng Điều 84E và 84F đối với các bất động sản khác', 'การใช้บังคับมาตรา 84E และ 84F กับอสังหาริมทรัพย์อื่น', 'Pemberlakuan Pasal 84E dan 84F pada Estat Lain', 'Penggunaan Seksyen 84E dan 84F kepada Estet Lain'),
  'Designated Lands': p('Đất được chỉ định', 'ที่ดินที่กำหนด', 'Tanah yang Ditetapkan', 'Tanah yang Ditetapkan'),
  'Non-Application of Section 6': p('Không áp dụng Điều 6', 'การไม่ใช้บังคับมาตรา 6', 'Tidak Berlakunya Pasal 6', 'Tidak Menggunakan Seksyen 6'),
  'Notice of Rescission': p('Thông báo hủy bỏ', 'หนังสือบอกเลิกสัญญา', 'Pemberitahuan Pembatalan', 'Notis Pembatalan'),
  'Variation of Initial Period': p('Điều chỉnh thời kỳ ban đầu', 'การเปลี่ยนแปลงระยะเวลาเริ่มต้น', 'Perubahan Periode Awal', 'Perubahan Tempoh Permulaan'),
  'Transitional Provision': p('Quy định chuyển tiếp', 'บทบัญญัติเฉพาะกาล', 'Ketentuan Peralihan', 'Peruntukan Peralihan'),

  // ── Legal Profession（22） ────────────────────────────────────
  'Foreign Practitioner Examinations': p('Kỳ thi hành nghề nước ngoài', 'การสอบผู้ประกอบวิชาชีพต่างประเทศ', 'Ujian Praktisi Asing', 'Peperiksaan Pengamal Asing'),
  'General Meetings': p('Đại hội đồng', 'การประชุมใหญ่', 'Rapat Umum', 'Mesyuarat Agung'),
  'Inadequate Professional Services Complaint Inquiry': p('Điều tra khiếu nại về dịch vụ nghề nghiệp không đạt yêu cầu', 'การสอบสวนข้อร้องเรียนเกี่ยวกับบริการวิชาชีพที่ไม่เพียงพอ', 'Penyelidikan Keluhan Layanan Profesional Tidak Memadai', 'Siasatan Aduan Perkhidmatan Profesional Tidak Memadai'),
  'Law Practice Entities': p('Pháp nhân hành nghề luật', 'นิติบุคคลประกอบกิจการกฎหมาย', 'Entitas Praktik Hukum', 'Entiti Amalan Undang-Undang'),
  'Legal Practice Management Course': p('Khóa học quản lý hành nghề luật', 'หลักสูตรการจัดการการประกอบวิชาชีพกฎหมาย', 'Kursus Manajemen Praktik Hukum', 'Kursus Pengurusan Amalan Undang-Undang'),
  'Mandatory Reporting of Specified Pro Bono Services': p('Báo cáo bắt buộc về dịch vụ trợ giúp pháp lý miễn phí được chỉ định', 'การรายงานภาคบังคับเกี่ยวกับบริการกฎหมายเพื่อสาธารณประโยชน์ที่ระบุ', 'Pelaporan Wajib atas Layanan Pro Bono Tertentu', 'Pelaporan Mandatori bagi Perkhidmatan Pro Bono Tertentu'),
  'Modified Application of Act for International Services': p('Áp dụng sửa đổi của Luật đối với dịch vụ quốc tế', 'การใช้บังคับกฎหมายที่แก้ไขสำหรับบริการระหว่างประเทศ', 'Pemberlakuan Undang-Undang yang Dimodifikasi bagi Layanan Internasional', 'Penggunaan Akta yang Diubah Suai bagi Perkhidmatan Antarabangsa'),
  'Practising Certificate': p('Giấy chứng nhận hành nghề', 'ใบอนุญาตประกอบวิชาชีพ', 'Sertifikat Praktik', 'Sijil Amalan'),
  'Prescribed Statutory Bodies and Law Offices in Public Service': p('Cơ quan luật định theo quy định và văn phòng luật trong dịch vụ công', 'หน่วยงานตามกฎหมายตามที่กำหนดและสำนักงานกฎหมายในบริการสาธารณะ', 'Badan Statuter yang Ditetapkan dan Kantor Hukum dalam Layanan Publik', 'Badan Berkanun yang Ditetapkan dan Pejabat Undang-Undang dalam Perkhidmatan Awam'),
  'Prevention of Money Laundering, Financing of Terrorism and Proliferation Financing': p('Phòng chống rửa tiền, tài trợ khủng bố và tài trợ phổ biến vũ khí', 'การป้องกันการฟอกเงิน การระดมทุนเพื่อการก่อการร้าย และการระดมทุนเพื่อการแพร่ขยายอาวุธ', 'Pencegahan Pencucian Uang, Pendanaan Terorisme dan Pendanaan Proliferasi', 'Pencegahan Pengubahan Wang Haram, Pembiayaan Keganasan dan Pembiayaan Percambahan'),
  'Pro Bono Legal Services': p('Dịch vụ pháp lý miễn phí', 'บริการกฎหมายเพื่อสาธารณประโยชน์', 'Layanan Hukum Pro Bono', 'Perkhidmatan Undang-Undang Pro Bono'),
  'Proceedings before Court of 3 Supreme Court Judges': p('Tố tụng trước Hội đồng 3 thẩm phán Tòa án Tối cao', 'กระบวนพิจารณาต่อหน้าคณะผู้พิพากษาศาลสูง 3 ท่าน', 'Proses di hadapan Majelis 3 Hakim Mahkamah Agung', 'Prosiding di hadapan Panel 3 Hakim Mahkamah Agung'),
  'Professional Conduct': p('Hành vi nghề nghiệp', 'จรรยาบรรณวิชาชีพ', 'Perilaku Profesional', 'Kelakuan Profesional'),
  'Professional Indemnity Insurance': p('Bảo hiểm bồi thường nghề nghiệp', 'การประกันภัยชดเชยความรับผิดวิชาชีพ', 'Asuransi Indemnitas Profesional', 'Insurans Indemniti Profesional'),
  'Provisional Practising Certificate': p('Giấy chứng nhận hành nghề tạm thời', 'ใบอนุญาตประกอบวิชาชีพชั่วคราว', 'Sertifikat Praktik Sementara', 'Sijil Amalan Sementara'),
  'Regulated Individuals': p('Cá nhân được quản lý', 'บุคคลที่ถูกกำกับ', 'Individu yang Diatur', 'Individu yang Dikawal'),
  'Representation in Singapore International Commercial Court': p('Đại diện tại Tòa án Thương mại Quốc tế Singapore', 'การเป็นตัวแทนในศาลพาณิชย์ระหว่างประเทศสิงคโปร์', 'Perwakilan di Pengadilan Niaga Internasional Singapura', 'Perwakilan di Mahkamah Komersial Antarabangsa Singapura'),
  'Solicitors’ Accounts': p('Tài khoản của luật sư', 'บัญชีทนายความ', 'Akun Advokat', 'Akaun Peguamcara'),
  'Solicitors’ Compensation Fund': p('Quỹ bồi thường luật sư', 'กองทุนชดเชยทนายความ', 'Dana Kompensasi Advokat', 'Tabung Pampasan Peguamcara'),
  'Solicitors’ Remuneration': p('Thù lao luật sư', 'ค่าตอบแทนทนายความ', 'Remunerasi Advokat', 'Ganjaran Peguamcara'),
  'Solicitors’ Trust Accounts': p('Tài khoản tín thác của luật sư', 'บัญชีทรัสต์ทนายความ', 'Akun Perwalian Advokat', 'Akaun Amanah Peguamcara'),
  'Unclaimed Money Fund': p('Quỹ tiền không có người nhận', 'กองทุนเงินที่ไม่มีผู้รับ', 'Dana Uang Tak Terklaim', 'Tabung Wang Tidak Dituntut'),

  // ── Legal Profession Act（2） ────────────────────────────────
  'Appointed Day for purposes of Section 75B': p('Ngày được ấn định cho mục đích của Điều 75B', 'วันที่กำหนดขึ้นเพื่อวัตถุประสงค์ของมาตรา 75B', 'Hari yang Ditetapkan untuk Keperluan Pasal 75B', 'Hari yang Ditetapkan bagi Tujuan Seksyen 75B'),
  'Appointed Day for purposes of Section 75C': p('Ngày được ấn định cho mục đích của Điều 75C', 'วันที่กำหนดขึ้นเพื่อวัตถุประสงค์ของมาตรา 75C', 'Hari yang Ditetapkan untuk Keperluan Pasal 75C', 'Hari yang Ditetapkan bagi Tujuan Seksyen 75C'),

  // ── Limited Liability / Limited Partnerships（5） ─────────────
  'Identical Names': p('Tên trùng nhau', 'ชื่อซ้ำกัน', 'Nama yang Sama', 'Nama yang Sama'),
  'Register of Controllers': p('Sổ đăng ký người kiểm soát', 'ทะเบียนผู้ควบคุม', 'Daftar Pengendali', 'Daftar Pengawal'),
  'Striking Off': p('Xóa tên khỏi sổ đăng ký', 'การถอนชื่อออกจากทะเบียน', 'Penghapusan dari Daftar', 'Pemadaman daripada Daftar'),
  'Winding Up': p('Thanh lý', 'การชำระบัญชี', 'Likuidasi', 'Penggulungan'),
  'Direction under section 17A(1)(d)': p('Chỉ thị theo Điều 17A(1)(d)', 'คำสั่งตามมาตรา 17A(1)(d)', 'Arahan menurut Pasal 17A(1)(d)', 'Arahan di bawah Seksyen 17A(1)(d)'),

  // ── Liquor Control（8） ──────────────────────────────────────
  'Supply and Consumption': p('Cung cấp và tiêu thụ', 'การจำหน่ายและการบริโภค', 'Pasokan dan Konsumsi', 'Pembekalan dan Penggunaan'),
  'Appeal Proceedings': p('Tố tụng kháng nghị', 'กระบวนพิจารณาอุทธรณ์', 'Proses Banding', 'Prosiding Rayuan'),
  'Declaration of Liquor Control Zones': p('Công bố khu vực kiểm soát rượu', 'การประกาศเขตควบคุมสุรา', 'Deklarasi Zona Pengendalian Minuman Keras', 'Pengisytiharan Zon Kawalan Minuman Keras'),
  'Exemption from Liquor Licence': p('Miễn trừ giấy phép bán rượu', 'การยกเว้นใบอนุญาตจำหน่ายสุรา', 'Pembebasan Izin Minuman Keras', 'Pengecualian Lesen Minuman Keras'),
  'Liquor Licensing': p('Cấp phép bán rượu', 'การออกใบอนุญาตจำหน่ายสุรา', 'Perizinan Minuman Keras', 'Pelesenan Minuman Keras'),
  'Restrictions on Consumption': p('Hạn chế tiêu thụ', 'ข้อจำกัดการบริโภค', 'Pembatasan Konsumsi', 'Sekatan Penggunaan'),
  'Supply of Liquor — Specified Circumstances': p('Cung cấp rượu — Hoàn cảnh được chỉ định', 'การจำหน่ายสุรา — สถานการณ์ที่ระบุ', 'Pasokan Minuman Keras — Keadaan Tertentu', 'Pembekalan Minuman Keras — Keadaan Tertentu'),
  'Trading Hours': p('Giờ kinh doanh', 'เวลาทำการค้า', 'Jam Operasional', 'Waktu Perniagaan'),

  // ── Loans / Local Forces（2） ────────────────────────────────
  'International Banks': p('Ngân hàng quốc tế', 'ธนาคารระหว่างประเทศ', 'Bank Internasional', 'Bank Antarabangsa'),
  'Relief of Financial Hardship': p('Cứu trợ khó khăn tài chính', 'การบรรเทาความเดือดร้อนทางการเงิน', 'Keringanan Kesulitan Keuangan', 'Pelepasan Kesulitan Kewangan'),

  // ── Maintenance of Parents / Racial / Religious Harmony（5） ──
  'Public Authorities': p('Cơ quan công quyền', 'หน่วยงานรัฐ', 'Otoritas Publik', 'Pihak Berkuasa Awam'),
  'Measures against Foreign Influence': p('Biện pháp chống ảnh hưởng nước ngoài', 'มาตรการต่อต้านอิทธิพลต่างประเทศ', 'Tindakan terhadap Pengaruh Asing', 'Langkah terhadap Pengaruh Asing'),
  'Restraining Orders': p('Lệnh cấm', 'คำสั่งห้าม', 'Perintah Penahanan', 'Perintah Larangan'),
  'Service of Documents': p('Tống đạt tài liệu', 'การส่งเอกสาร', 'Penyampaian Dokumen', 'Penyerahan Dokumen'),

  // ── Maintenance Orders（6） ──────────────────────────────────
  'Reciprocal Enforcement': p('Thi hành tương hỗ', 'การบังคับใช้ซึ่งกันและกัน', 'Penegakan Timbal Balik', 'Penguatkuasaan Timbal Balik'),
  'Designation of Reciprocating Countries': p('Chỉ định các quốc gia đối ứng', 'การกำหนดประเทศที่ให้การตอบแทน', 'Penetapan Negara Timbal Balik', 'Penetapan Negara Timbal Balik'),
  'Designation of Reciprocating Countries — Australia': p('Chỉ định quốc gia đối ứng — Australia', 'การกำหนดประเทศที่ให้การตอบแทน — ออสเตรเลีย', 'Penetapan Negara Timbal Balik — Australia', 'Penetapan Negara Timbal Balik — Australia'),
  'Designation of Reciprocating Countries — Hong Kong SAR': p('Chỉ định quốc gia đối ứng — Khu Hành chính Đặc biệt Hồng Kông', 'การกำหนดประเทศที่ให้การตอบแทน — เขตบริหารพิเศษฮ่องกง', 'Penetapan Negara Timbal Balik — Daerah Administratif Khusus Hong Kong', 'Penetapan Negara Timbal Balik — Wilayah Pentadbiran Khas Hong Kong'),
  'Designation of Reciprocating Countries — New Zealand': p('Chỉ định quốc gia đối ứng — New Zealand', 'การกำหนดประเทศที่ให้การตอบแทน — นิวซีแลนด์', 'Penetapan Negara Timbal Balik — Selandia Baru', 'Penetapan Negara Timbal Balik — New Zealand'),
  'Designation of Reciprocating Countries — Province of Manitoba': p('Chỉ định quốc gia đối ứng — Tỉnh Manitoba', 'การกำหนดประเทศที่ให้การตอบแทน — รัฐแมนิโทบา', 'Penetapan Negara Timbal Balik — Provinsi Manitoba', 'Penetapan Negara Timbal Balik — Wilayah Manitoba'),

  // ── Maritime and Port Authority of Singapore（12） ────────────
  'Fees for Replacement or Certified Copy of Licence': p('Lệ phí cấp lại hoặc bản sao có chứng nhận giấy phép', 'ค่าธรรมเนียมการออกใบอนุญาตใหม่หรือสำเนารับรอง', 'Biaya Penggantian atau Salinan Tersertifikasi Izin', 'Fi Penggantian atau Salinan Bertauliah Lesen'),
  'Harbour Craft Manning Licence Examination': p('Kỳ thi giấy phép định biên tàu trong cảng', 'การสอบใบอนุญาตจัดกำลังคนเรือในท่า', 'Ujian Izin Awak Kapal Pelabuhan', 'Peperiksaan Lesen Awak Kapal Pelabuhan'),
  'Harbour Craft': p('Tàu trong cảng', 'เรือในท่า', 'Kapal Pelabuhan', 'Kapal Pelabuhan'),
  'Pilotage District': p('Khu vực dẫn tàu', 'เขตนำร่อง', 'Distrik Pandu', 'Daerah Pandu'),
  'Pilotage': p('Dẫn tàu', 'การนำร่อง', 'Pemanduan', 'Pemanduan'),
  'Pleasure Craft': p('Tàu giải trí', 'เรือสำราญ', 'Kapal Rekreasi', 'Kapal Rekreasi'),
  'Port Limits — Suspension': p('Giới hạn cảng — Tạm đình chỉ', 'เขตจำกัดท่าเรือ — การระงับ', 'Batas Pelabuhan — Penangguhan', 'Had Pelabuhan — Penggantungan'),
  'Port Limits': p('Giới hạn cảng', 'เขตจำกัดท่าเรือ', 'Batas Pelabuhan', 'Had Pelabuhan'),
  'Port': p('Cảng', 'ท่าเรือ', 'Pelabuhan', 'Pelabuhan'),
  'Prohibited Anchorage Area — Suspension': p('Khu vực cấm neo đậu — Tạm đình chỉ', 'เขตห้ามทอดสมอ — การระงับ', 'Area Berlabuh Terlarang — Penangguhan', 'Kawasan Larangan Berlabuh — Penggantungan'),
  'Registration and Employment of Seamen': p('Đăng ký và tuyển dụng thuyền viên', 'การขึ้นทะเบียนและการจ้างลูกเรือ', 'Pendaftaran dan Penempatan Pelaut', 'Pendaftaran dan Penggajian Pelaut'),
  'Scale of Dues, Rates and General Fees': p('Biểu phí, mức thu và lệ phí chung', 'อัตราค่าธรรมเนียม ค่าบริการ และค่าธรรมเนียมทั่วไป', 'Skala Iuran, Tarif dan Biaya Umum', 'Skala Duti, Kadar dan Fi Am'),

  // ── Medals / Media Development Authority（2） ─────────────────
  'COVID-19': p('COVID-19', 'โควิด-19', 'COVID-19', 'COVID-19'),
  'Code of Practice': p('Quy tắc thực hành', 'จรรยาบรรณปฏิบัติ', 'Kode Praktik', 'Kod Amalan'),

  // ── Medical / Medical Registration（5） ──────────────────────
  'Therapy, Education and Research': p('Trị liệu, giáo dục và nghiên cứu', 'การบำบัด การศึกษา และการวิจัย', 'Terapi, Pendidikan dan Penelitian', 'Terapi, Pendidikan dan Penyelidikan'),
  'Approved Hospitals and Medical Schools': p('Bệnh viện và trường y được chấp thuận', 'โรงพยาบาลและโรงเรียนแพทย์ที่ได้รับอนุมัติ', 'Rumah Sakit dan Sekolah Kedokteran yang Disetujui', 'Hospital dan Sekolah Perubatan yang Diluluskan'),
  'Medifund Committees': p('Ủy ban Medifund', 'คณะกรรมการ Medifund', 'Komite Medifund', 'Jawatankuasa Medifund'),
  'Member of Singapore Medical Council — Exemption': p('Thành viên Hội đồng Y khoa Singapore — Miễn trừ', 'สมาชิกสภาแพทยศาสตร์สิงคโปร์ — การยกเว้น', 'Anggota Dewan Kedokteran Singapura — Pembebasan', 'Ahli Majlis Perubatan Singapura — Pengecualian'),
  'Term of Office': p('Nhiệm kỳ', 'วาระการดำรงตำแหน่ง', 'Masa Jabatan', 'Tempoh Jawatan'),
};

module.exports = mod;
