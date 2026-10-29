'use strict';
// SG 尾段附注事项译名：第 1 批（A 开头，120 条）
const p = (vi, th, id, ms) => ({ vi, th, id, ms });
const NO = (n) => p('Số ' + n, 'ฉบับที่ ' + n, 'Nomor ' + n, 'No. ' + n);

const mixin = {
  '101 — Unmanned Aircraft Operations': p('101 — Hoạt động của máy bay không người lái', '101 — การปฏิบัติการอากาศยานไร้คนขับ', '101 — Operasi Pesawat Udara Nirawak', '101 — Operasi Pesawat Udara Tanpa Pemandu'),
  '119 — Air Operator Certification': p('119 — Chứng nhận người khai thác hàng không', '119 — การรับรองผู้ประกอบการเดินอากาศ', '119 — Sertifikasi Operator Udara', '119 — Pensijilan Pengendali Udara'),
  '121 — Commercial Air Transport by Large Aeroplanes': p('121 — Vận tải hàng không thương mại bằng máy bay lớn', '121 — การขนส่งทางอากาศเชิงพาณิชย์ด้วยเครื่องบินขนาดใหญ่', '121 — Pengangkutan Udara Komersial dengan Pesawat Besar', '121 — Pengangkutan Udara Komersial dengan Pesawat Besar'),
  '125 — Complex General Aviation': p('125 — Hàng không tổng quát phức tạp', '125 — การบินทั่วไปแบบซับซ้อน', '125 — Penerbangan Umum Kompleks', '125 — Penerbangan Am Kompleks'),
  '129 — Foreign Operator’s Permit': p('129 — Giấy phép người khai thác nước ngoài', '129 — ใบอนุญาตผู้ประกอบการเดินอากาศต่างประเทศ', '129 — Izin Operator Asing', '129 — Permit Pengendali Asing'),
  '135 — Commercial Air Transport by Helicopters and Small Aeroplanes': p('135 — Vận tải hàng không thương mại bằng trực thăng và máy bay nhỏ', '135 — การขนส่งทางอากาศเชิงพาณิชย์ด้วยเฮลิคอปเตอร์และเครื่องบินขนาดเล็ก', '135 — Pengangkutan Udara Komersial dengan Helikopter dan Pesawat Kecil', '135 — Pengangkutan Udara Komersial dengan Helikopter dan Pesawat Kecil'),
  '137 — Aerial Work': p('137 — Công tác trên không', '137 — งานทางอากาศ', '137 — Pekerjaan Udara', '137 — Kerja Udara'),
  '139 — Aerodromes': p('139 — Sân bay', '139 — สนามบิน', '139 — Bandar Udara', '139 — Lapangan Terbang'),
  '47 — Aircraft Registration': p('47 — Đăng ký tàu bay', '47 — การจดทะเบียนอากาศยาน', '47 — Pendaftaran Pesawat Udara', '47 — Pendaftaran Pesawat Udara'),
  '67 — Aviation Medical Certification': p('67 — Chứng nhận y tế hàng không', '67 — การรับรองทางการแพทย์การบิน', '67 — Sertifikasi Medis Penerbangan', '67 — Pensijilan Perubatan Penerbangan'),
  '91 — General Operating Rules': p('91 — Quy tắc khai thác chung', '91 — กฎการปฏิบัติการทั่วไป', '91 — Peraturan Operasi Umum', '91 — Kaedah Operasi Am'),
  '92 — Carriage of Dangerous Goods': p('92 — Vận chuyển hàng hóa nguy hiểm', '92 — การขนส่งสินค้าอันตราย', '92 — Pengangkutan Barang Berbahaya', '92 — Pengangkutan Barang Berbahaya'),
  '96 — Aerial Activities and Dangerous Lights': p('96 — Hoạt động trên không và đèn nguy hiểm', '96 — กิจกรรมทางอากาศและไฟที่เป็นอันตราย', '96 — Kegiatan Udara dan Lampu Berbahaya', '96 — Aktiviti Udara dan Lampu Berbahaya'),
  '98 — Special Operations': p('98 — Khai thác đặc biệt', '98 — การปฏิบัติการพิเศษ', '98 — Operasi Khusus', '98 — Operasi Khas'),
  '99 — Breath Testing for Alcohol': p('99 — Kiểm tra hơi thở đối với rượu', '99 — การตรวจวัดแอลกอฮอล์จากลมหายใจ', '99 — Uji Napas untuk Alkohol', '99 — Ujian Nafas untuk Alkohol'),

  'Abolition': p('Bãi bỏ', 'การยกเลิก', 'Penghapusan', 'Penghapusan'),
  'Access Control Measures — Prescribed Exceptions': p('Biện pháp kiểm soát truy cập — Ngoại lệ theo quy định', 'มาตรการควบคุมการเข้าถึง — ข้อยกเว้นตามที่กำหนด', 'Tindakan Pengendalian Akses — Pengecualian yang Ditetapkan', 'Langkah Kawalan Akses — Pengecualian yang Ditetapkan'),
  'Accountant’s Report': p('Báo cáo của kế toán viên', 'รายงานของผู้ทำบัญชี', 'Laporan Akuntan', 'Laporan Akauntan'),
  'Accounting Corporations, Accounting Firms and Accounting LLPs': p('Công ty kế toán, hãng kế toán và công ty trách nhiệm hữu hạn hợp danh kế toán', 'บรรษัทการบัญชี สำนักงานบัญชี และห้างหุ้นส่วนจำกัดความรับผิดทางการบัญชี', 'Korporasi Akuntansi, Kantor Akuntansi dan Persekutuan Terbatas Akuntansi', 'Perbadanan Perakaunan, Firma Perakaunan dan Perkongsian Liabiliti Terhad Perakaunan'),
  'Accounts and Annual Report': p('Sổ sách kế toán và báo cáo thường niên', 'บัญชีและรายงานประจำปี', 'Akun dan Laporan Tahunan', 'Akaun dan Laporan Tahunan'),
  'Accounts and Statements': p('Sổ sách kế toán và báo biểu', 'บัญชีและงบการเงิน', 'Akun dan Laporan Keuangan', 'Akaun dan Penyata'),
  'Accounts of Registered Business Trusts / Substitution of Period': [
    p('Sổ sách kế toán của quỹ tín thác kinh doanh đã đăng ký', 'บัญชีของทรัสต์ธุรกิจที่จดทะเบียน', 'Akun Perwalian Bisnis Terdaftar', 'Akaun Amanah Perniagaan Berdaftar'),
    p('Thay thế kỳ kế toán', 'การแทนที่ระยะเวลา', 'Penggantian Periode', 'Penggantian Tempoh')],
  'Accreditation Marks': p('Dấu công nhận', 'เครื่องหมายการรับรอง', 'Tanda Akreditasi', 'Tanda Akreditasi'),
  'Accreditation, Certification and Inspection Marks': p('Dấu công nhận, chứng nhận và kiểm tra', 'เครื่องหมายการรับรอง การออกใบรับรอง และการตรวจสอบ', 'Tanda Akreditasi, Sertifikasi dan Inspeksi', 'Tanda Akreditasi, Pensijilan dan Pemeriksaan'),
  'Accredited Checkers and Accredited Checking Organisations': p('Kiểm tra viên được công nhận và tổ chức kiểm tra được công nhận', 'ผู้ตรวจสอบที่ได้รับการรับรองและองค์กรตรวจสอบที่ได้รับการรับรอง', 'Pemeriksa Terakreditasi dan Organisasi Pemeriksa Terakreditasi', 'Pemeriksa Terakreditasi dan Organisasi Pemeriksaan Terakreditasi'),
  'Active Ingredients': p('Thành phần hoạt tính', 'ส่วนผสมออกฤทธิ์', 'Bahan Aktif', 'Bahan Aktif'),
  'Actuaries': p('Chuyên viên tính toán bảo hiểm', 'นักคณิตศาสตร์ประกันภัย', 'Aktuaris', 'Aktuari'),
  'Acute Hospital Service': p('Dịch vụ bệnh viện cấp tính', 'บริการโรงพยาบาลผู้ป่วยเฉียบพลัน', 'Layanan Rumah Sakit Akut', 'Perkhidmatan Hospital Akut'),
  'Acute Myocardial Infarction Notification': p('Khai báo nhồi máu cơ tim cấp', 'การแจ้งข้อมูลกล้ามเนื้อหัวใจตายเฉียบพลัน', 'Pemberitahuan Infark Miokard Akut', 'Pemberitahuan Infarksi Miokardium Akut'),
  'Ad Hoc Admissions': p('Kết nạp đột xuất', 'การรับเข้าเป็นกรณีพิเศษ', 'Penerimaan Ad Hoc', 'Penerimaan Ad Hoc'),
  'Additional Functions': p('Chức năng bổ sung', 'หน้าที่เพิ่มเติม', 'Fungsi Tambahan', 'Fungsi Tambahan'),
  'Additional Premium Contribution': p('Khoản đóng phí bảo hiểm bổ sung', 'การส่งเงินสมทบเบี้ยประกันเพิ่มเติม', 'Kontribusi Premi Tambahan', 'Sumbangan Premium Tambahan'),
  'Adjudication of Stamp Duty / Remission': [
    p('Phán quyết thuế trước bạ', 'การวินิจฉัยอากรแสตมป์', 'Penetapan Bea Meterai', 'Penghakiman Duti Setem'),
    p('Miễn giảm', 'การลดหย่อน', 'Keringanan', 'Pelepasan')],
  'Administrative Fees': p('Phí hành chính', 'ค่าธรรมเนียมทางปกครอง', 'Biaya Administratif', 'Fi Pentadbiran'),
  'Administrative Penalties': p('Chế tài hành chính', 'บทลงโทษทางปกครอง', 'Sanksi Administratif', 'Penalti Pentadbiran'),
  'Admiralty Jurisdiction': p('Thẩm quyền hàng hải', 'เขตอำนาจทางทะเล', 'Yurisdiksi Kelautan', 'Bidang Kuasa Admiraliti'),
  'Admission': p('Kết nạp', 'การรับเข้า', 'Penerimaan', 'Kemasukan'),
  'Advertisement': p('Quảng cáo', 'การโฆษณา', 'Iklan', 'Pengiklanan'),
  'Advertisement — Exemption': p('Quảng cáo — Miễn trừ', 'การโฆษณา — การยกเว้น', 'Iklan — Pembebasan', 'Pengiklanan — Pengecualian'),
  'Advertisement / Exemption': [
    p('Quảng cáo', 'การโฆษณา', 'Iklan', 'Pengiklanan'),
    p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian')],
  'Advertisement and Sale': p('Quảng cáo và bán hàng', 'การโฆษณาและการขาย', 'Iklan dan Penjualan', 'Pengiklanan dan Penjualan'),
  'Advertisement and Sale / Exemption': [
    p('Quảng cáo và bán hàng', 'การโฆษณาและการขาย', 'Iklan dan Penjualan', 'Pengiklanan dan Penjualan'),
    p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian')],
  'Advertisement of Specified Health Products': p('Quảng cáo sản phẩm sức khỏe được chỉ định', 'การโฆษณาผลิตภัณฑ์สุขภาพที่กำหนด', 'Iklan Produk Kesehatan Tertentu', 'Pengiklanan Produk Kesihatan Tertentu'),
  'Advertisements': p('Các quảng cáo', 'การโฆษณา', 'Iklan-Iklan', 'Pengiklanan'),
  'Advertisements for Licensable Healthcare Services / Exemption': [
    p('Quảng cáo cho dịch vụ chăm sóc sức khỏe phải cấp phép', 'การโฆษณาบริการสุขภาพที่ต้องขอใบอนุญาต', 'Iklan untuk Layanan Kesehatan yang Wajib Berlisensi', 'Pengiklanan bagi Perkhidmatan Penjagaan Kesihatan yang Boleh Dilesenkan'),
    p('Miễn trừ', 'การยกเว้น', 'Pembebasan', 'Pengecualian')],
  'Advertising': p('Hoạt động quảng cáo', 'การโฆษณา', 'Periklanan', 'Pengiklanan'),
  'Advisory Boards': p('Hội đồng tư vấn', 'คณะกรรมการที่ปรึกษา', 'Dewan Penasihat', 'Lembaga Penasihat'),
  'Advisory Committees': p('Ủy ban tư vấn', 'คณะกรรมการที่ปรึกษา', 'Komite Penasihat', 'Jawatankuasa Penasihat'),
  'Agreement': p('Hiệp định', 'ความตกลง', 'Persetujuan', 'Perjanjian'),
  'Agreements for Sale and Purchase': p('Hợp đồng mua bán', 'สัญญาซื้อขาย', 'Perjanjian Jual Beli', 'Perjanjian Jual Beli'),
  'AI Standalone Mobile Application — Exemption': p('Ứng dụng di động AI độc lập — Miễn trừ', 'แอปพลิเคชันมือถือ AI แบบอิสระ — การยกเว้น', 'Aplikasi Seluler AI Mandiri — Pembebasan', 'Aplikasi Mudah Alih AI Berdiri Sendiri — Pengecualian'),
  'Air Impurities': p('Tạp chất trong không khí', 'สิ่งเจือปนในอากาศ', 'Kotoran Udara', 'Kekotoran Udara'),
  'Airport Development Levy': p('Lệ phí phát triển sân bay', 'ค่าธรรมเนียมการพัฒนาสนามบิน', 'Retribusi Pengembangan Bandar Udara', 'Levi Pembangunan Lapangan Terbang'),
  'Airport Master Plan': p('Quy hoạch tổng thể sân bay', 'แผนแม่บทสนามบิน', 'Rencana Induk Bandar Udara', 'Pelan Induk Lapangan Terbang'),
  'Alarm Monitoring Services': p('Dịch vụ giám sát báo động', 'บริการเฝ้าระวังสัญญาณเตือน', 'Layanan Pemantauan Alarm', 'Perkhidmatan Pemantauan Penggera'),
  'Allowances — Assignment of Functions and Powers': p('Hạn ngạch — Chuyển giao chức năng và quyền hạn', 'โควตา — การมอบหมายหน้าที่และอำนาจ', 'Kuota — Pelimpahan Fungsi dan Wewenang', 'Kuota — Penyerahan Fungsi dan Kuasa'),
  'Allowances — Prescribed Date': p('Hạn ngạch — Ngày theo quy định', 'โควตา — วันที่กำหนด', 'Kuota — Tanggal yang Ditetapkan', 'Kuota — Tarikh yang Ditetapkan'),
  'Alteration': p('Thay đổi', 'การเปลี่ยนแปลง', 'Perubahan', 'Perubahan'),
  'Alteration of Boundaries / Consolidation': [
    p('Thay đổi ranh giới', 'การเปลี่ยนแปลงเขตแดน', 'Perubahan Batas', 'Perubahan Sempadan'),
    p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan')],
  'Amalgamation of Companies': p('Sáp nhập công ty', 'การควบรวมบริษัท', 'Penggabungan Perusahaan', 'Penggabungan Syarikat'),
  'Ambulatory Surgical Centre Service': p('Dịch vụ trung tâm phẫu thuật ngoại trú', 'บริการศูนย์ศัลยกรรมผู้ป่วยนอก', 'Layanan Pusat Bedah Rawat Jalan', 'Perkhidmatan Pusat Pembedahan Ambulatori'),
  'Analysis and Inspection Service Fees': p('Phí dịch vụ phân tích và kiểm tra', 'ค่าธรรมเนียมบริการวิเคราะห์และตรวจสอบ', 'Biaya Layanan Analisis dan Inspeksi', 'Fi Perkhidmatan Analisis dan Pemeriksaan'),
  'Animal Management — Exemption': p('Quản lý động vật — Miễn trừ', 'การจัดการสัตว์ — การยกเว้น', 'Pengelolaan Hewan — Pembebasan', 'Pengurusan Haiwan — Pengecualian'),
  'Animals': p('Động vật', 'สัตว์', 'Hewan', 'Haiwan'),
  'Annual Pensionable Salary': p('Tiền lương hằng năm được tính lương hưu', 'เงินเดือนประจำปีที่คำนวณบำนาญ', 'Gaji Tahunan yang Dapat Dipensiunkan', 'Gaji Tahunan yang Layak Pencen'),
  'Appeal Advisory Board': p('Hội đồng tư vấn kháng nghị', 'คณะกรรมการที่ปรึกษาการอุทธรณ์', 'Dewan Penasihat Banding', 'Lembaga Penasihat Rayuan'),
  'Appeals against Financial Penalties': p('Kháng nghị đối với chế tài tài chính', 'การอุทธรณ์ต่อบทลงโทษทางการเงิน', 'Banding terhadap Sanksi Finansial', 'Rayuan terhadap Penalti Kewangan'),
  'Appeals Board': p('Hội đồng kháng nghị', 'คณะกรรมการอุทธรณ์', 'Dewan Banding', 'Lembaga Rayuan'),
  'Appeals Board — Fees': p('Hội đồng kháng nghị — Phí', 'คณะกรรมการอุทธรณ์ — ค่าธรรมเนียม', 'Dewan Banding — Biaya', 'Lembaga Rayuan — Fi'),
  'Appeals Panel': p('Ban kháng nghị', 'คณะผู้อุทธรณ์', 'Panel Banding', 'Panel Rayuan'),
  'Appeals Procedure for Board of Review': p('Thủ tục kháng nghị đối với Hội đồng xét duyệt', 'วิธีพิจารณาอุทธรณ์สำหรับคณะกรรมการทบทวน', 'Prosedur Banding untuk Dewan Peninjau', 'Prosedur Rayuan bagi Lembaga Semakan'),
  'Appeals to Minister': p('Kháng nghị lên Bộ trưởng', 'การอุทธรณ์ต่อรัฐมนตรี', 'Banding kepada Menteri', 'Rayuan kepada Menteri'),
  'Appeals under Part 3': p('Kháng nghị theo Phần 3', 'การอุทธรณ์ตามภาค 3', 'Banding menurut Bagian 3', 'Rayuan menurut Bahagian 3'),
  'Appeals under Section 13W': p('Kháng nghị theo Điều 13W', 'การอุทธรณ์ตามมาตรา 13W', 'Banding menurut Pasal 13W', 'Rayuan menurut Seksyen 13W'),
  'Application for Warrant': p('Đơn xin cấp lệnh', 'การขอหมาย', 'Permohonan Surat Perintah', 'Permohonan Waran'),
  'Application of Customs Act 1960 / Provisions on Trials, Proceedings, Offences and Penalties': [
    p('Áp dụng Luật Hải quan 1960', 'การใช้บังคับพระราชบัญญัติศุลกากร ค.ศ. 1960', 'Penerapan Undang-Undang Kepabeanan 1960', 'Penggunaan Akta Kastam 1960'),
    p('Các quy định về xét xử, tố tụng, tội phạm và chế tài', 'บทบัญญัติว่าด้วยการพิจารณาคดี กระบวนพิจารณา ความผิด และบทลงโทษ', 'Ketentuan tentang Persidangan, Proses Hukum, Pelanggaran dan Sanksi', 'Peruntukan tentang Perbicaraan, Prosiding, Kesalahan dan Penalti')],
  'Application of Employment Act Provisions': p('Áp dụng các quy định của Luật Việc làm', 'การใช้บังคับบทบัญญัติแห่งพระราชบัญญัติการจ้างงาน', 'Penerapan Ketentuan Undang-Undang Ketenagakerjaan', 'Penggunaan Peruntukan Akta Pekerjaan'),
  'Application of Legislation relating to Customs and Excise Duties': p('Áp dụng pháp luật về thuế hải quan và thuế tiêu thụ đặc biệt', 'การใช้บังคับกฎหมายเกี่ยวกับภาษีศุลกากรและภาษีสรรพสามิต', 'Penerapan Peraturan Perundang-undangan tentang Bea Masuk dan Cukai', 'Penggunaan Perundangan berkaitan Duti Kastam dan Eksais'),
  'Application of Legislation relating to Legal Aid and Legal Advice': p('Áp dụng pháp luật về trợ giúp pháp lý và tư vấn pháp lý', 'การใช้บังคับกฎหมายเกี่ยวกับความช่วยเหลือทางกฎหมายและคำแนะนำทางกฎหมาย', 'Penerapan Peraturan Perundang-undangan tentang Bantuan Hukum dan Nasihat Hukum', 'Penggunaan Perundangan berkaitan Bantuan Guaman dan Nasihat Guaman'),
  'Application of Part IV to Design-Build-And-Sell Scheme': p('Áp dụng Phần IV đối với Chương trình Thiết kế — Xây dựng — Bán', 'การใช้บังคับภาค IV แก่โครงการออกแบบ-ก่อสร้าง-ขาย', 'Penerapan Bagian IV pada Skema Rancang-Bangun-Jual', 'Penggunaan Bahagian IV bagi Skim Reka-Bina-Jual'),
  'Application of Sections 16D and 16E': p('Áp dụng Điều 16D và 16E', 'การใช้บังคับมาตรา 16D และ 16E', 'Penerapan Pasal 16D dan 16E', 'Penggunaan Seksyen 16D dan 16E'),
  'Application to Legal Profession': p('Áp dụng đối với nghề luật', 'การใช้บังคับแก่วิชาชีพกฎหมาย', 'Penerapan pada Profesi Hukum', 'Penggunaan pada Profesion Guaman'),
  'Applications and Licences': p('Đơn và giấy phép', 'คำขอและใบอนุญาต', 'Permohonan dan Lisensi', 'Permohonan dan Lesen'),
  'Applications and Permits': p('Đơn và giấy phép', 'คำขอและใบอนุญาต', 'Permohonan dan Izin', 'Permohonan dan Permit'),
  'Appointed Day for Manpower Programmes': p('Ngày được ấn định cho các chương trình nhân lực', 'วันที่กำหนดสำหรับโครงการกำลังคน', 'Hari yang Ditetapkan untuk Program Tenaga Kerja', 'Hari yang Ditetapkan bagi Program Tenaga Kerja'),
  'Appointed Day for purposes of Section 75B': p('Ngày được ấn định cho mục đích Điều 75B', 'วันที่กำหนดเพื่อวัตถุประสงค์ของมาตรา 75B', 'Hari yang Ditetapkan untuk keperluan Pasal 75B', 'Hari yang Ditetapkan bagi maksud Seksyen 75B'),
  'Appointed Day for purposes of Section 75C': p('Ngày được ấn định cho mục đích Điều 75C', 'วันที่กำหนดเพื่อวัตถุประสงค์ของมาตรา 75C', 'Hari yang Ditetapkan untuk keperluan Pasal 75C', 'Hari yang Ditetapkan bagi maksud Seksyen 75C'),
  'Appointed Persons under Section 19C / Consolidation': [
    p('Người được chỉ định theo Điều 19C', 'บุคคลที่ได้รับแต่งตั้งตามมาตรา 19C', 'Orang yang Ditetapkan menurut Pasal 19C', 'Orang yang Ditetapkan menurut Seksyen 19C'),
    p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan')],
  'Appointed Persons under Section 59A / Consolidation': [
    p('Người được chỉ định theo Điều 59A', 'บุคคลที่ได้รับแต่งตั้งตามมาตรา 59A', 'Orang yang Ditetapkan menurut Pasal 59A', 'Orang yang Ditetapkan menurut Seksyen 59A'),
    p('Hợp nhất', 'การรวมฉบับ', 'Konsolidasi', 'Penyatuan')],
  'Approved Centres': p('Trung tâm được chấp thuận', 'ศูนย์ที่ได้รับอนุมัติ', 'Pusat yang Disetujui', 'Pusat yang Diluluskan'),
  'Approved Company Auditors / Transitional and Savings Provisions': [
    p('Kiểm toán viên công ty được chấp thuận', 'ผู้สอบบัญชีบริษัทที่ได้รับอนุมัติ', 'Auditor Perusahaan yang Disetujui', 'Juruaudit Syarikat yang Diluluskan'),
    p('Quy định chuyển tiếp và bảo lưu', 'บทเฉพาะกาลและบทสงวนสิทธิ', 'Ketentuan Peralihan dan Penyimpanan', 'Peruntukan Peralihan dan Pemeliharaan')],
  'Approved Hospitals': p('Bệnh viện được chấp thuận', 'โรงพยาบาลที่ได้รับอนุมัติ', 'Rumah Sakit yang Disetujui', 'Hospital yang Diluluskan'),
  'Approved Institutions': p('Cơ sở được chấp thuận', 'สถาบันที่ได้รับอนุมัติ', 'Institusi yang Disetujui', 'Institusi yang Diluluskan'),
  'Approved Institutions / Discipline': [
    p('Cơ sở được chấp thuận', 'สถาบันที่ได้รับอนุมัติ', 'Institusi yang Disetujui', 'Institusi yang Diluluskan'),
    p('Kỷ luật', 'วินัย', 'Disiplin', 'Disiplin')],
  'Approved Institutions, Medical Observation and Treatment and Rehabilitation': p('Cơ sở được chấp thuận, quan sát y tế và điều trị phục hồi', 'สถาบันที่ได้รับอนุมัติ การสังเกตทางการแพทย์ และการบำบัดฟื้นฟู', 'Institusi yang Disetujui, Pengamatan Medis serta Perawatan dan Rehabilitasi', 'Institusi yang Diluluskan, Pemerhatian Perubatan serta Rawatan dan Pemulihan'),
  'Approved Liquidators / Transitional and Savings Provisions': [
    p('Người thanh lý được chấp thuận', 'ผู้ชำระบัญชีที่ได้รับอนุมัติ', 'Likuidator yang Disetujui', 'Pelikuidasi yang Diluluskan'),
    p('Quy định chuyển tiếp và bảo lưu', 'บทเฉพาะกาลและบทสงวนสิทธิ', 'Ketentuan Peralihan dan Penyimpanan', 'Peruntukan Peralihan dan Pemeliharaan')],
  'Approved Marine, Aviation and Transit Insurance Brokers and Approved Reinsurance Brokers': p('Môi giới bảo hiểm hàng hải, hàng không và quá cảnh được chấp thuận và môi giới tái bảo hiểm được chấp thuận', 'นายหน้าประกันภัยทางทะเล การบิน และการขนส่งผ่านแดนที่ได้รับอนุมัติ และนายหน้าประกันภัยต่อที่ได้รับอนุมัติ', 'Pialang Asuransi Kelautan, Penerbangan dan Transit yang Disetujui serta Pialang Reasuransi yang Disetujui', 'Broker Insurans Marin, Penerbangan dan Transit yang Diluluskan serta Broker Insurans Semula yang Diluluskan'),
  'Approved Marine, Aviation and Transit Insurers': p('Doanh nghiệp bảo hiểm hàng hải, hàng không và quá cảnh được chấp thuận', 'ผู้รับประกันภัยทางทะเล การบิน และการขนส่งผ่านแดนที่ได้รับอนุมัติ', 'Penanggung Asuransi Kelautan, Penerbangan dan Transit yang Disetujui', 'Penanggung Insurans Marin, Penerbangan dan Transit yang Diluluskan'),
  'Approved Medical Institutions': p('Cơ sở y tế được chấp thuận', 'สถาบันการแพทย์ที่ได้รับอนุมัติ', 'Institusi Medis yang Disetujui', 'Institusi Perubatan yang Diluluskan'),
  'Approved Pension Schemes': p('Chương trình lương hưu được chấp thuận', 'โครงการบำนาญที่ได้รับอนุมัติ', 'Skema Pensiun yang Disetujui', 'Skim Pencen yang Diluluskan'),
  'Approved Qualifications': p('Trình độ được chấp thuận', 'คุณวุฒิที่ได้รับอนุมัติ', 'Kualifikasi yang Disetujui', 'Kelayakan yang Diluluskan'),
  'Approved Unit Trust': p('Quỹ tín thác đơn vị được chấp thuận', 'ทรัสต์หน่วยลงทุนที่ได้รับอนุมัติ', 'Perwalian Unit yang Disetujui', 'Amanah Unit yang Diluluskan'),
  'Approving Authority': p('Cơ quan phê duyệt', 'หน่วยงานผู้อนุมัติ', 'Otoritas Pemberi Persetujuan', 'Pihak Berkuasa Pelulus'),
  'Argosy Pte. Ltd. — Section 13(4) Exemption / No. 2': [
    p('Argosy Pte. Ltd. — Miễn trừ theo Điều 13(4)', 'Argosy Pte. Ltd. — การยกเว้นตามมาตรา 13(4)', 'Argosy Pte. Ltd. — Pembebasan menurut Pasal 13(4)', 'Argosy Pte. Ltd. — Pengecualian menurut Seksyen 13(4)'),
    NO('2')],
  'Arms / Revocation': [
    p('Vũ khí', 'อาวุธ', 'Senjata', 'Senjata'),
    p('Thu hồi', 'การเพิกถอน', 'Pencabutan', 'Pembatalan')],
  'Arms Exhibitions — Class Licence': p('Triển lãm vũ khí — Giấy phép theo nhóm', 'การแสดงอาวุธ — ใบอนุญาตประเภท', 'Pameran Senjata — Lisensi Kelas', 'Pameran Senjata — Lesen Kelas'),
  'Arrests, Searches, Investigation and Trial of Offences': p('Bắt giữ, khám xét, điều tra và xét xử tội phạm', 'การจับกุม การค้น การสอบสวน และการพิจารณาคดีความผิด', 'Penangkapan, Penggeledahan, Penyidikan dan Persidangan Pelanggaran', 'Penangkapan, Penggeledahan, Siasatan dan Perbicaraan Kesalahan'),
};

// 教育储蓄缴款额：2014–2026，键名大小写不统一，两种都登记
for (let y = 2014; y <= 2026; y++) {
  const v = p('Mức đóng góp Edusave năm ' + y, 'จำนวนเงินสมทบ Edusave ประจำปี ' + y,
    'Jumlah Kontribusi Edusave Tahun ' + y, 'Jumlah Sumbangan Edusave bagi Tahun ' + y);
  mixin['Amount of Edusave Contribution for ' + y] = v;
  mixin['Amount of Edusave Contribution For ' + y] = v;
}

module.exports = mixin;
