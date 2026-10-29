'use strict';
// SG 尾段附注事项译名：第 4 批（D–E 开头，110 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });
const NO = (n) => p('Số ' + n, 'ฉบับที่ ' + n, 'Nomor ' + n, 'No. ' + n);
const EX = p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian');
const HB = p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan');

// 各部部长
const MIN = {
  'Defence': p('Bộ trưởng Quốc phòng', 'รัฐมนตรีว่าการกระทรวงกลาโหม', 'Menteri Pertahanan', 'Menteri Pertahanan'),
  'Education': p('Bộ trưởng Giáo dục', 'รัฐมนตรีว่าการกระทรวงศึกษาธิการ', 'Menteri Pendidikan', 'Menteri Pendidikan'),
  'Energy, Trade and Industry (Energy and Industry)': p('Bộ trưởng Năng lượng, Thương mại và Công nghiệp (Năng lượng và Công nghiệp)', 'รัฐมนตรีว่าการกระทรวงพลังงาน การค้า และอุตสาหกรรม (พลังงานและอุตสาหกรรม)', 'Menteri Energi, Perdagangan dan Industri (Energi dan Industri)', 'Menteri Tenaga, Perdagangan dan Industri (Tenaga dan Industri)'),
  'Finance': p('Bộ trưởng Tài chính', 'รัฐมนตรีว่าการกระทรวงการคลัง', 'Menteri Keuangan', 'Menteri Kewangan'),
  'Health': p('Bộ trưởng Y tế', 'รัฐมนตรีว่าการกระทรวงสาธารณสุข', 'Menteri Kesehatan', 'Menteri Kesihatan'),
  'Home Affairs': p('Bộ trưởng Nội vụ', 'รัฐมนตรีว่าการกระทรวงมหาดไทย', 'Menteri Dalam Negeri', 'Menteri Dalam Negeri'),
  'Law': p('Bộ trưởng Pháp luật', 'รัฐมนตรีว่าการกระทรวงยุติธรรม', 'Menteri Hukum', 'Menteri Undang-Undang'),
  'Manpower': p('Bộ trưởng Nhân lực', 'รัฐมนตรีว่าการกระทรวงแรงงาน', 'Menteri Tenaga Kerja', 'Menteri Tenaga Manusia'),
  'National Development': p('Bộ trưởng Phát triển Quốc gia', 'รัฐมนตรีว่าการกระทรวงการพัฒนาชาติ', 'Menteri Pembangunan Nasional', 'Menteri Pembangunan Negara'),
  'Social and Family Development': p('Bộ trưởng Phát triển Xã hội và Gia đình', 'รัฐมนตรีว่าการกระทรวงการพัฒนาสังคมและครอบครัว', 'Menteri Pembangunan Sosial dan Keluarga', 'Menteri Pembangunan Sosial dan Keluarga'),
  'Transport': p('Bộ trưởng Giao thông', 'รัฐมนตรีว่าการกระทรวงคมนาคม', 'Menteri Perhubungan', 'Menteri Pengangkutan'),
};

const mixin = {
  'Deduction for Special Reserves of Approved General Insurers': p('Khấu trừ đối với dự phòng đặc biệt của doanh nghiệp bảo hiểm phi nhân thọ được chấp thuận', 'การหักลดหย่อนสำหรับเงินสำรองพิเศษของผู้รับประกันภัยทั่วไปที่ได้รับอนุมัติ', 'Pengurangan atas Cadangan Khusus Penanggung Asuransi Umum yang Disetujui', 'Potongan bagi Rizab Khas Penanggung Insurans Am yang Diluluskan'),
  'Deduction under Section 14ZH / Prescribed Percentages': [
    p('Khấu trừ theo Điều 14ZH', 'การหักลดหย่อนตามมาตรา 14ZH', 'Pengurangan menurut Pasal 14ZH', 'Potongan menurut Seksyen 14ZH'),
    p('Tỷ lệ phần trăm theo quy định', 'ร้อยละตามที่กำหนด', 'Persentase yang Ditetapkan', 'Peratusan yang Ditetapkan')],
  'Deferment': p('Hoãn', 'การเลื่อนเวลา', 'Penangguhan', 'Penangguhan'),
  'Deficiency Charge — Exemption': p('Phí thiếu hụt — Miễn trừ', 'ค่าธรรมเนียมส่วนขาด — การยกเว้น', 'Biaya Kekurangan — Pembebasan', 'Caj Kekurangan — Pengecualian'),
  'Definition of Designated Unit Trust': p('Định nghĩa quỹ tín thác đơn vị được chỉ định', 'บทนิยามของทรัสต์หน่วยลงทุนที่กำหนด', 'Definisi Perwalian Unit yang Ditetapkan', 'Takrif Amanah Unit yang Ditetapkan'),
  'Delegation of Powers — Ministry of Health': p('Ủy quyền — Bộ Y tế', 'การมอบอำนาจ — กระทรวงสาธารณสุข', 'Pelimpahan Wewenang — Kementerian Kesehatan', 'Penguntukan Kuasa — Kementerian Kesihatan'),
  'Demutualisation and Merger': p('Phi tương hỗ hóa và sáp nhập', 'การเปลี่ยนจากระบบสมาชิกและการควบรวม', 'Demutualisasi dan Penggabungan', 'Nyapuswaian dan Penggabungan'),
  'Demutualisation and Merger / Designated Companies': [
    p('Phi tương hỗ hóa và sáp nhập', 'การเปลี่ยนจากระบบสมาชิกและการควบรวม', 'Demutualisasi dan Penggabungan', 'Nyapuswaian dan Penggabungan'),
    p('Công ty được chỉ định', 'บริษัทที่กำหนด', 'Perusahaan yang Ditetapkan', 'Syarikat yang Ditetapkan')],
  'Demutualisation and Merger / Value of Transferee Holding Company’s Shares': [
    p('Phi tương hỗ hóa và sáp nhập', 'การเปลี่ยนจากระบบสมาชิกและการควบรวม', 'Demutualisasi dan Penggabungan', 'Nyapuswaian dan Penggabungan'),
    p('Giá trị cổ phần của công ty cổ phần nhận chuyển nhượng', 'มูลค่าหุ้นของบริษัทโฮลดิ้งผู้รับโอน', 'Nilai Saham Perusahaan Induk Penerima Pengalihan', 'Nilai Saham Syarikat Pegangan Penerima Pindahan')],
  'Denominations and Characteristics of Currency Notes': p('Mệnh giá và đặc điểm của tiền giấy', 'มูลค่าและลักษณะของธนบัตร', 'Pecahan dan Ciri Uang Kertas', 'Nilai Muka dan Ciri Wang Kertas'),
  'Deposit Insurance': p('Bảo hiểm tiền gửi', 'การประกันเงินฝาก', 'Penjaminan Simpanan', 'Insurans Deposit'),
  'Deposit Insurance / Composition of Offences': [
    p('Bảo hiểm tiền gửi', 'การประกันเงินฝาก', 'Penjaminan Simpanan', 'Insurans Deposit'),
    p('Hòa giải tội phạm', 'การประนีประนอมความผิด', 'Penyelesaian Perkara Pidana', 'Penyelesaian Kesalahan')],
  'Deposit Interest': p('Lãi tiền gửi', 'ดอกเบี้ยเงินฝาก', 'Bunga Simpanan', 'Faedah Deposit'),
  'Deposits of Percentage of Paid-up Capital and of Security': p('Nộp tỷ lệ phần trăm vốn đã góp và tiền bảo đảm', 'การนำส่งร้อยละของทุนชำระแล้วและหลักประกัน', 'Penyetoran Persentase Modal Disetor dan Jaminan', 'Deposit Peratusan Modal Berbayar dan Sekuriti'),
  'Design-Build-and-Sell Scheme — Form of Contract': p('Chương trình Thiết kế — Xây dựng — Bán — Mẫu hợp đồng', 'โครงการออกแบบ-ก่อสร้าง-ขาย — รูปแบบสัญญา', 'Skema Rancang-Bangun-Jual — Bentuk Kontrak', 'Skim Reka-Bina-Jual — Bentuk Kontrak'),
  'Design-Build-And-Sell Scheme — Vesting': p('Chương trình Thiết kế — Xây dựng — Bán — Chuyển giao quyền sở hữu', 'โครงการออกแบบ-ก่อสร้าง-ขาย — การโอนสิทธิในทรัพย์สิน', 'Skema Rancang-Bangun-Jual — Pemberian Hak', 'Skim Reka-Bina-Jual — Pemberian Hak'),
  'Designated Buildings': p('Tòa nhà được chỉ định', 'อาคารที่กำหนด', 'Bangunan yang Ditetapkan', 'Bangunan yang Ditetapkan'),
  'Designated Equity Interest Holder': p('Người nắm giữ lợi ích cổ phần được chỉ định', 'ผู้ถือส่วนได้เสียในทุนที่กำหนด', 'Pemegang Kepentingan Ekuitas yang Ditetapkan', 'Pemegang Kepentingan Ekuiti yang Ditetapkan'),
  'Designated Financial Holding Companies': p('Công ty cổ phần tài chính được chỉ định', 'บริษัทโฮลดิ้งการเงินที่กำหนด', 'Perusahaan Induk Finansial yang Ditetapkan', 'Syarikat Pegangan Kewangan yang Ditetapkan'),
  'Designated First Site': p('Địa điểm thứ nhất được chỉ định', 'สถานที่แห่งแรกที่กำหนด', 'Lokasi Pertama yang Ditetapkan', 'Tapak Pertama yang Ditetapkan'),
  'Designated Licensee': p('Người được cấp phép được chỉ định', 'ผู้รับใบอนุญาตที่กำหนด', 'Pemegang Lisensi yang Ditetapkan', 'Pemegang Lesen yang Ditetapkan'),
  'Designated Management Body — Gardens by the Bay': p('Cơ quan quản lý được chỉ định — Gardens by the Bay', 'หน่วยงานบริหารที่กำหนด — การ์เด้นส์บายเดอะเบย์', 'Badan Pengelola yang Ditetapkan — Gardens by the Bay', 'Badan Pengurusan yang Ditetapkan — Gardens by the Bay'),
  'Designated Operating Entities': p('Tổ chức điều hành được chỉ định', 'หน่วยงานปฏิบัติการที่กำหนด', 'Entitas Operasi yang Ditetapkan', 'Entiti Operasi yang Ditetapkan'),
  'Designated Public Licensee': p('Người được cấp phép công được chỉ định', 'ผู้รับใบอนุญาตสาธารณะที่กำหนด', 'Pemegang Lisensi Publik yang Ditetapkan', 'Pemegang Lesen Awam yang Ditetapkan'),
  'Designated Second Site': p('Địa điểm thứ hai được chỉ định', 'สถานที่แห่งที่สองที่กำหนด', 'Lokasi Kedua yang Ditetapkan', 'Tapak Kedua yang Ditetapkan'),
  'Designation of Deposit Insurance Agency': p('Chỉ định cơ quan bảo hiểm tiền gửi', 'การกำหนดหน่วยงานประกันเงินฝาก', 'Penunjukan Badan Penjaminan Simpanan', 'Penetapan Agensi Insurans Deposit'),
  'Designation of Deposit Insurance and Policy Owners’ Protection Fund Agency': p('Chỉ định cơ quan Quỹ bảo hiểm tiền gửi và bảo vệ chủ hợp đồng', 'การกำหนดหน่วยงานกองทุนประกันเงินฝากและการคุ้มครองผู้ถือกรมธรรม์', 'Penunjukan Badan Dana Penjaminan Simpanan dan Perlindungan Pemegang Polis', 'Penetapan Agensi Kumpulan Wang Insurans Deposit dan Perlindungan Pemegang Polisi'),
  'Designation of Forces for National Service': p('Chỉ định lực lượng phục vụ nghĩa vụ quốc gia', 'การกำหนดกำลังพลสำหรับการรับราชการทหาร', 'Penunjukan Pasukan untuk Wajib Militer', 'Penetapan Angkatan untuk Perkhidmatan Negara'),
  'Designation of Sectors': p('Chỉ định các ngành', 'การกำหนดภาคส่วน', 'Penunjukan Sektor', 'Penetapan Sektor'),
  'Designation of Special Developments': p('Chỉ định các dự án phát triển đặc biệt', 'การกำหนดโครงการพัฒนาพิเศษ', 'Penunjukan Pengembangan Khusus', 'Penetapan Pembangunan Khas'),
  'Designation of Specified Premises': p('Ấn định cơ sở được chỉ định', 'การกำหนดสถานที่ที่ระบุ', 'Penetapan Premis yang Ditentukan', 'Penetapan Premis yang Ditentukan'),
  'Designation of Specified Premises — Shopping Malls': p('Ấn định cơ sở được chỉ định — Trung tâm mua sắm', 'การกำหนดสถานที่ที่ระบุ — ศูนย์การค้า', 'Penetapan Premis yang Ditentukan — Pusat Perbelanjaan', 'Penetapan Premis yang Ditentukan — Pusat Beli-Belah'),
  'Detained Persons': p('Người bị tạm giữ', 'ผู้ถูกกักตัว', 'Orang yang Ditahan', 'Orang yang Ditahan'),
  'Detained Persons Advisory Board': p('Hội đồng tư vấn về người bị tạm giữ', 'คณะกรรมการที่ปรึกษาผู้ถูกกักตัว', 'Dewan Penasihat Orang yang Ditahan', 'Lembaga Penasihat Orang yang Ditahan'),
  'Detention': p('Tạm giữ', 'การกักตัว', 'Penahanan', 'Penahanan'),
  'Determination and Certification of Death': p('Xác định và chứng nhận tử vong', 'การวินิจฉัยและการรับรองการตาย', 'Penetapan dan Sertifikasi Kematian', 'Penentuan dan Pensijilan Kematian'),
  'Development': p('Phát triển', 'การพัฒนา', 'Pengembangan', 'Pembangunan'),
  'Development of Land — Lodgment Authorisation': p('Phát triển đất — Cho phép nộp hồ sơ', 'การพัฒนาที่ดิน — การอนุญาตให้ยื่นเรื่อง', 'Pengembangan Tanah — Otorisasi Penyerahan', 'Pembangunan Tanah — Kebenaran Penyerahan'),
  'Development of Land Authorisation': p('Cho phép phát triển đất', 'การอนุญาตพัฒนาที่ดิน', 'Otorisasi Pengembangan Tanah', 'Kebenaran Pembangunan Tanah'),
  'Development of Land Authorisation for Housing and Development Board and Jurong Town Corporation': p('Cho phép phát triển đất đối với Ủy ban Nhà ở và Phát triển và Tổng công ty Thị trấn Jurong', 'การอนุญาตพัฒนาที่ดินสำหรับคณะกรรมการที่อยู่อาศัยและการพัฒนาและบรรษัทเมืองจูร่ง', 'Otorisasi Pengembangan Tanah untuk Dewan Perumahan dan Pengembangan serta Perusahaan Kota Jurong', 'Kebenaran Pembangunan Tanah bagi Lembaga Perumahan dan Pembangunan serta Perbadanan Bandar Jurong'),
  'Development of Land Authorisation for Last Approved Use': p('Cho phép phát triển đất theo mục đích sử dụng được chấp thuận cuối cùng', 'การอนุญาตพัฒนาที่ดินตามการใช้ประโยชน์ที่ได้รับอนุมัติครั้งสุดท้าย', 'Otorisasi Pengembangan Tanah untuk Penggunaan Terakhir yang Disetujui', 'Kebenaran Pembangunan Tanah bagi Penggunaan Terakhir yang Diluluskan'),
  'Development of Land Authorisation for Medical Clinics': p('Cho phép phát triển đất đối với phòng khám y tế', 'การอนุญาตพัฒนาที่ดินสำหรับคลินิกการแพทย์', 'Otorisasi Pengembangan Tanah untuk Klinik Medis', 'Kebenaran Pembangunan Tanah bagi Klinik Perubatan'),
  'Development of Land Authorisation for National Parks Board': p('Cho phép phát triển đất đối với Ủy ban Công viên Quốc gia', 'การอนุญาตพัฒนาที่ดินสำหรับคณะกรรมการอุทยานแห่งชาติ', 'Otorisasi Pengembangan Tanah untuk Dewan Taman Nasional', 'Kebenaran Pembangunan Tanah bagi Lembaga Taman Negara'),
  'Development of Land Authorisation for Specified Property': p('Cho phép phát triển đất đối với bất động sản được chỉ định', 'การอนุญาตพัฒนาที่ดินสำหรับอสังหาริมทรัพย์ที่ระบุ', 'Otorisasi Pengembangan Tanah untuk Properti yang Ditentukan', 'Kebenaran Pembangunan Tanah bagi Harta yang Ditentukan'),
  'Development of Land for Agricultural Use — Lodgment Authorisation': p('Phát triển đất cho mục đích nông nghiệp — Cho phép nộp hồ sơ', 'การพัฒนาที่ดินเพื่อการใช้ประโยชน์ทางการเกษตร — การอนุญาตให้ยื่นเรื่อง', 'Pengembangan Tanah untuk Penggunaan Pertanian — Otorisasi Penyerahan', 'Pembangunan Tanah untuk Penggunaan Pertanian — Kebenaran Penyerahan'),
  'Digital Payment — Parking Charges': p('Thanh toán kỹ thuật số — Phí đỗ xe', 'การชำระเงินดิจิทัล — ค่าจอดรถ', 'Pembayaran Digital — Biaya Parkir', 'Pembayaran Digital — Caj Letak Kereta'),
  'Digital Token Service Providers': p('Nhà cung cấp dịch vụ token kỹ thuật số', 'ผู้ให้บริการโทเคนดิจิทัล', 'Penyedia Layanan Token Digital', 'Pembekal Perkhidmatan Token Digital'),
  'Diphtheria and Measles Vaccination': p('Tiêm chủng bạch hầu và sởi', 'การฉีดวัคซีนคอตีบและหัด', 'Vaksinasi Difteri dan Campak', 'Vaksinasi Difteria dan Campak'),
  'Direction under section 17(1)(d)': p('Chỉ thị theo Điều 17(1)(d)', 'คำสั่งตามมาตรา 17(1)(d)', 'Arahan menurut Pasal 17(1)(d)', 'Arahan menurut Seksyen 17(1)(d)'),
  'Direction under section 17A(1)(d)': p('Chỉ thị theo Điều 17A(1)(d)', 'คำสั่งตามมาตรา 17A(1)(d)', 'Arahan menurut Pasal 17A(1)(d)', 'Arahan menurut Seksyen 17A(1)(d)'),
  'Direction under section 19A(1)(d)': p('Chỉ thị theo Điều 19A(1)(d)', 'คำสั่งตามมาตรา 19A(1)(d)', 'Arahan menurut Pasal 19A(1)(d)', 'Arahan menurut Seksyen 19A(1)(d)'),
  'Direction under Section 32M(1)': p('Chỉ thị theo Điều 32M(1)', 'คำสั่งตามมาตรา 32M(1)', 'Arahan menurut Pasal 32M(1)', 'Arahan menurut Seksyen 32M(1)'),
  'Direction under Section 386AN(1)': p('Chỉ thị theo Điều 386AN(1)', 'คำสั่งตามมาตรา 386AN(1)', 'Arahan menurut Pasal 386AN(1)', 'Arahan menurut Seksyen 386AN(1)'),
  'Disability Assessment Fees': p('Phí đánh giá khuyết tật', 'ค่าธรรมเนียมการประเมินความพิการ', 'Biaya Penilaian Disabilitas', 'Fi Penilaian Kecacatan'),
  'Discharge Books': p('Sổ rời tàu của thuyền viên', 'สมุดปลดประจำการลูกเรือ', 'Buku Pemberhentian Pelaut', 'Buku Pelepasan Pelaut'),
  'Disciplinary Commission and Disciplinary Tribunal': p('Ủy ban kỷ luật và Tòa án kỷ luật', 'คณะกรรมการวินัยและศาลวินัย', 'Komisi Disiplin dan Tribunal Disiplin', 'Suruhanjaya Disiplin dan Tribunal Disiplin'),
  'Disciplinary Offences': p('Các vi phạm kỷ luật', 'ความผิดทางวินัย', 'Pelanggaran Disiplin', 'Kesalahan Disiplin'),
  'Disciplinary Proceedings': p('Thủ tục kỷ luật', 'กระบวนพิจารณาทางวินัย', 'Proses Disiplin', 'Prosiding Disiplin'),
  'Disciplinary Tribunal': p('Tòa án kỷ luật', 'ศาลวินัย', 'Tribunal Disiplin', 'Tribunal Disiplin'),
  'Discipline in Approved Centres': p('Kỷ luật tại các trung tâm được chấp thuận', 'วินัยในศูนย์ที่ได้รับอนุมัติ', 'Disiplin di Pusat yang Disetujui', 'Disiplin di Pusat yang Diluluskan'),
  'Disclosure of Documents and Information': p('Tiết lộ tài liệu và thông tin', 'การเปิดเผยเอกสารและข้อมูล', 'Pengungkapan Dokumen dan Informasi', 'Pendedahan Dokumen dan Maklumat'),
  'Disclosure of Information': p('Tiết lộ thông tin', 'การเปิดเผยข้อมูล', 'Pengungkapan Informasi', 'Pendedahan Maklumat'),
  'Disease': p('Bệnh', 'โรค', 'Penyakit', 'Penyakit'),
  'Dispute Resolution Scheme': p('Chương trình giải quyết tranh chấp', 'โครงการระงับข้อพิพาท', 'Skema Penyelesaian Sengketa', 'Skim Penyelesaian Pertikaian'),
  'Dispute Resolution Schemes': p('Các chương trình giải quyết tranh chấp', 'โครงการระงับข้อพิพาท', 'Skema-Skema Penyelesaian Sengketa', 'Skim-Skim Penyelesaian Pertikaian'),
  'Disregarded Interests': p('Lợi ích không được tính đến', 'ส่วนได้เสียที่ไม่นำมาพิจารณา', 'Kepentingan yang Diabaikan', 'Kepentingan yang Diabaikan'),
  'Donation Reporting and Foreign Influence Disclosure': p('Báo cáo quyên góp và tiết lộ ảnh hưởng nước ngoài', 'การรายงานการบริจาคและการเปิดเผยอิทธิพลต่างประเทศ', 'Pelaporan Donasi dan Pengungkapan Pengaruh Asing', 'Pelaporan Derma dan Pendedahan Pengaruh Asing'),
  'Drawback': p('Hoàn thuế', 'การคืนอากร', 'Pengembalian Bea', 'Pengembalian Duti'),
  'Duties': p('Thuế quan', 'อากร', 'Bea', 'Duti'),
  'Duties — Exemption': p('Thuế quan — Miễn trừ', 'อากร — การยกเว้น', 'Bea — Pembebasan', 'Duti — Pengecualian'),
  'Duties / Exemption for Officials of International Organisations': [
    p('Thuế quan', 'อากร', 'Bea', 'Duti'),
    p('Miễn trừ cho quan chức tổ chức quốc tế', 'การยกเว้นสำหรับเจ้าหน้าที่องค์การระหว่างประเทศ', 'Pembebasan bagi Pejabat Organisasi Internasional', 'Pengecualian bagi Pegawai Pertubuhan Antarabangsa')],
  'Edusave Pupils Fund': p('Quỹ học sinh Edusave', 'กองทุนนักเรียน Edusave', 'Dana Siswa Edusave', 'Kumpulan Wang Pelajar Edusave'),
  'Efficient Pollution Control Equipment': p('Thiết bị kiểm soát ô nhiễm hiệu quả', 'อุปกรณ์ควบคุมมลพิษประสิทธิภาพสูง', 'Peralatan Pengendalian Pencemaran Efisien', 'Peralatan Kawalan Pencemaran Cekap'),
  'ElderShield Scheme': p('Chương trình ElderShield', 'โครงการ ElderShield', 'Skema ElderShield', 'Skim ElderShield'),
  'Election Campaign Recordings — Exemption': p('Bản ghi chiến dịch bầu cử — Miễn trừ', 'การบันทึกการหาเสียงเลือกตั้ง — การยกเว้น', 'Rekaman Kampanye Pemilu — Pembebasan', 'Rakaman Kempen Pilihan Raya — Pengecualian'),
  'Election of Board Members': p('Bầu cử thành viên hội đồng', 'การเลือกตั้งกรรมการ', 'Pemilihan Anggota Dewan', 'Pemilihan Anggota Lembaga'),
  'Electronic Filing and Service for State Courts and Youth Courts': p('Nộp và tống đạt điện tử đối với Tòa án Nhà nước và Tòa án Vị thành niên', 'การยื่นและการส่งหมายอิเล็กทรอนิกส์สำหรับศาลรัฐและศาลเยาวชน', 'Pengajuan dan Penyampaian Elektronik untuk Pengadilan Negeri dan Pengadilan Anak', 'Pemfailan dan Penyampaian Elektronik bagi Mahkamah Negeri dan Mahkamah Juvana'),
  'Electronic Filing and Service for Supreme Court': p('Nộp và tống đạt điện tử đối với Tòa án Tối cao', 'การยื่นและการส่งหมายอิเล็กทรอนิกส์สำหรับศาลสูงสุด', 'Pengajuan dan Penyampaian Elektronik untuk Mahkamah Agung', 'Pemfailan dan Penyampaian Elektronik bagi Mahkamah Agung'),
  'Electronic Filing for Coroners’ Courts': p('Nộp hồ sơ điện tử đối với Tòa án Điều tra tử thi', 'การยื่นเรื่องอิเล็กทรอนิกส์สำหรับศาลชันสูตร', 'Pengajuan Elektronik untuk Pengadilan Koroner', 'Pemfailan Elektronik bagi Mahkamah Koroner'),
  'Electronic Lodgment': p('Nộp hồ sơ điện tử', 'การยื่นเรื่องทางอิเล็กทรอนิกส์', 'Penyerahan Elektronik', 'Penyerahan Elektronik'),
  'Electronic Meeting and Resolution by Correspondence': p('Họp điện tử và nghị quyết bằng thư', 'การประชุมอิเล็กทรอนิกส์และข้อมติโดยการติดต่อทางจดหมาย', 'Rapat Elektronik dan Resolusi melalui Korespondensi', 'Mesyuarat Elektronik dan Resolusi melalui Surat-Menyurat'),
  'Electronic Service System': p('Hệ thống tống đạt điện tử', 'ระบบส่งหมายอิเล็กทรอนิกส์', 'Sistem Penyampaian Elektronik', 'Sistem Penyampaian Elektronik'),
  'Electronic Transactions Service': p('Dịch vụ giao dịch điện tử', 'บริการธุรกรรมอิเล็กทรอนิกส์', 'Layanan Transaksi Elektronik', 'Perkhidmatan Transaksi Elektronik'),
  'Electronic Transmission': p('Truyền điện tử', 'การส่งผ่านอิเล็กทรอนิกส์', 'Transmisi Elektronik', 'Penghantaran Elektronik'),
  'Eligibility': p('Điều kiện đủ', 'คุณสมบัติ', 'Kelayakan', 'Kelayakan'),
  'Eligible Courses in Section 14ZG(5)': p('Các khóa học đủ điều kiện tại Điều 14ZG(5)', 'หลักสูตรที่มีคุณสมบัติในมาตรา 14ZG(5)', 'Kursus yang Memenuhi Syarat dalam Pasal 14ZG(5)', 'Kursus Layak dalam Seksyen 14ZG(5)'),
  'Emergency Ambulance Service and Medical Transport Service': p('Dịch vụ xe cứu thương khẩn cấp và dịch vụ vận chuyển y tế', 'บริการรถพยาบาลฉุกเฉินและบริการขนส่งทางการแพทย์', 'Layanan Ambulans Darurat dan Layanan Transportasi Medis', 'Perkhidmatan Ambulans Kecemasan dan Perkhidmatan Pengangkutan Perubatan'),
  'Emergency Response Plan': p('Kế hoạch ứng phó khẩn cấp', 'แผนตอบโต้เหตุฉุกเฉิน', 'Rencana Tanggap Darurat', 'Pelan Tindak Balas Kecemasan'),
  'Employees for the Purposes of the Act': p('Người lao động cho mục đích của Luật', 'ลูกจ้างเพื่อวัตถุประสงค์ของพระราชบัญญัติ', 'Pekerja untuk Keperluan Undang-Undang', 'Pekerja bagi Maksud Akta'),
  'Employment / Private Employers and Statutory Bodies': [
    p('Việc làm', 'การจ้างงาน', 'Ketenagakerjaan', 'Pekerjaan'),
    p('Người sử dụng lao động tư nhân và các cơ quan luật định', 'นายจ้างเอกชนและองค์กรตามกฎหมาย', 'Pemberi Kerja Swasta dan Badan Statuter', 'Majikan Swasta dan Badan Berkanun')],
  'Employment Gains or Profits — Furniture and Fittings in Place of Residence': p('Thu nhập hoặc lợi nhuận từ việc làm — Đồ đạc và thiết bị cố định tại nơi ở', 'รายได้หรือกำไรจากการจ้างงาน — เฟอร์นิเจอร์และเครื่องติดตั้งในที่พักอาศัย', 'Penghasilan atau Keuntungan Kerja — Perabot dan Perlengkapan di Tempat Tinggal', 'Pendapatan atau Keuntungan Pekerjaan — Perabot dan Kelengkapan di Tempat Kediaman'),
  'Employment Records, Key Employment Terms and Pay Slips': p('Hồ sơ việc làm, điều khoản việc làm chính và phiếu lương', 'บันทึกการจ้างงาน เงื่อนไขการจ้างงานหลัก และสลิปเงินเดือน', 'Catatan Ketenagakerjaan, Ketentuan Kerja Utama dan Slip Gaji', 'Rekod Pekerjaan, Terma Pekerjaan Utama dan Slip Gaji'),
  'Employments': p('Các quan hệ việc làm', 'การจ้างงาน', 'Hubungan Kerja', 'Pekerjaan'),
  'Energy Management Practices': p('Thực hành quản lý năng lượng', 'แนวปฏิบัติการจัดการพลังงาน', 'Praktik Manajemen Energi', 'Amalan Pengurusan Tenaga'),
  'Energy Management Practices for Transport Facility Operators': p('Thực hành quản lý năng lượng đối với đơn vị vận hành cơ sở giao thông', 'แนวปฏิบัติการจัดการพลังงานสำหรับผู้ประกอบการสถานประกอบการขนส่ง', 'Praktik Manajemen Energi untuk Operator Fasilitas Transportasi', 'Amalan Pengurusan Tenaga bagi Pengendali Kemudahan Pengangkutan'),
  'Enterprise District — Lodgment Authorisation': p('Khu doanh nghiệp — Cho phép nộp hồ sơ', 'ย่านวิสาหกิจ — การอนุญาตให้ยื่นเรื่อง', 'Distrik Perusahaan — Otorisasi Penyerahan', 'Daerah Perusahaan — Kebenaran Penyerahan'),
};

// 「Delegations by Minister for X」
for (const [name, m] of Object.entries(MIN)) {
  mixin['Delegations by Minister for ' + name] = p(
    'Ủy quyền của ' + m.vi, 'การมอบอำนาจของ' + m.th,
    'Pelimpahan Wewenang oleh ' + m.id, 'Penguntukan Kuasa oleh ' + m.ms);
}

// 「硬币面额与特征」第 2 号
mixin['Denominations And Characteristics Of Coins / No. 2'] = [
  p('Mệnh giá và đặc điểm của tiền xu', 'มูลค่าและลักษณะของเหรียญกษาปณ์', 'Pecahan dan Ciri Uang Logam', 'Nilai Muka dan Ciri Wang Logam'),
  NO('2')];

// Elite Commercial REIT 第 2、3 号
for (const n of ['2', '3']) {
  mixin['Elite Commercial REIT — Section 13(12) Exemption / No. ' + n] = [
    p('Elite Commercial REIT — Miễn trừ theo Điều 13(12)', 'Elite Commercial REIT — การยกเว้นตามมาตรา 13(12)', 'Elite Commercial REIT — Pembebasan menurut Pasal 13(12)', 'Elite Commercial REIT — Pengecualian menurut Seksyen 13(12)'),
    NO(n)];
}

module.exports = mixin;
