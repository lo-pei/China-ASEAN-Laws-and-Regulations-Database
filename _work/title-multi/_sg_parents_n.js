'use strict';
// SG 母法（法名主体）译名：第 14 批补齐，供 _sg_dict.js 的 parentExtra 合并
// 口径：只译「名称主体」，不带体裁词（Luật/Akta…）与年份 —— 体裁与年份由 compose() 补
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

module.exports = {
  // ── 修正法（作生效公告的母法用）──────────────────────────
  'Casino Control (Amendment) Act 2024': p('Kiểm soát Sòng bạc (Sửa đổi)', 'การควบคุมบ่อนการพนัน (แก้ไขเพิ่มเติม)', 'Pengendalian Kasino (Perubahan)', 'Kawalan Kasino (Pindaan)'),
  'Central Provident Fund (Amendment) Act 2024': p('Quỹ Tiết kiệm Trung ương (Sửa đổi)', 'กองทุนสำรองเลี้ยงชีพกลาง (แก้ไขเพิ่มเติม)', 'Dana Simpanan Wajib Pusat (Perubahan)', 'Dana Simpanan Wajib Pusat (Pindaan)'),
  'Civil Aviation Authority of Singapore (Amendment) Act 2025': p('Cơ quan Hàng không Dân dụng Singapore (Sửa đổi)', 'องค์การการบินพลเรือนสิงคโปร์ (แก้ไขเพิ่มเติม)', 'Otoritas Penerbangan Sipil Singapura (Perubahan)', 'Pihak Berkuasa Penerbangan Awam Singapura (Pindaan)'),
  'Coastal Protection and Other Amendments Act 2026': p('Bảo vệ Bờ biển và các Sửa đổi Khác', 'การป้องกันชายฝั่งและการแก้ไขเพิ่มเติมอื่น ๆ', 'Perlindungan Pesisir dan Perubahan Lainnya', 'Perlindungan Pesisir dan Pindaan Lain'),
  'Community Disputes Resolution (Amendment) Act 2024': p('Giải quyết Tranh chấp Cộng đồng (Sửa đổi)', 'การระงับข้อพิพาทชุมชน (แก้ไขเพิ่มเติม)', 'Penyelesaian Sengketa Masyarakat (Perubahan)', 'Penyelesaian Pertikaian Komuniti (Pindaan)'),
  'Constitution of the Republic of Singapore (Amendment) Act 2025': p('Hiến pháp Cộng hòa Singapore (Sửa đổi)', 'รัฐธรรมนูญแห่งสาธารณรัฐสิงคโปร์ (แก้ไขเพิ่มเติม)', 'Konstitusi Republik Singapura (Perubahan)', 'Perlembagaan Republik Singapura (Pindaan)'),
  'Corporate and Accounting Laws (Amendment) Act 2025': p('Luật Doanh nghiệp và Kế toán (Sửa đổi)', 'กฎหมายบริษัทและการบัญชี (แก้ไขเพิ่มเติม)', 'Undang-Undang Perusahaan dan Akuntansi (Perubahan)', 'Undang-Undang Syarikat dan Perakaunan (Pindaan)'),
  'Criminal Law (Miscellaneous Amendments) Act 2025': p('Hình sự (Sửa đổi Tổng hợp)', 'กฎหมายอาญา (แก้ไขเพิ่มเติมเบ็ดเตล็ด)', 'Hukum Pidana (Perubahan Lain-lain)', 'Undang-Undang Jenayah (Pindaan Pelbagai)'),
  'Criminal Procedure (Miscellaneous Amendments) Act 2024': p('Tố tụng Hình sự (Sửa đổi Tổng hợp)', 'วิธีพิจารณาความอาญา (แก้ไขเพิ่มเติมเบ็ดเตล็ด)', 'Hukum Acara Pidana (Perubahan Lain-lain)', 'Prosedur Jenayah (Pindaan Pelbagai)'),
  'Cross-Border Railways Act 2018': p('Đường sắt Xuyên biên giới', 'รถไฟข้ามพรมแดน', 'Kereta Api Lintas Batas', 'Kereta Api Rentas Sempadan'),

  // ── 机构 / 制度名 ──────────────────────────────────────
  'Assignment of Functions to Housing and Development Board': p('Chuyển giao Chức năng cho Ủy ban Nhà ở và Phát triển', 'การมอบหมายหน้าที่ให้แก่คณะกรรมการที่อยู่อาศัยและการพัฒนา', 'Pelimpahan Fungsi kepada Dewan Perumahan dan Pembangunan', 'Penyerahan Fungsi kepada Lembaga Perumahan dan Pembangunan'),
  'Commercial and Industrial Security Corporation': p('Tổng công ty An ninh Thương mại và Công nghiệp', 'บรรษัทความมั่นคงพาณิชย์และอุตสาหกรรม', 'Perusahaan Keamanan Komersial dan Industri', 'Perbadanan Keselamatan Komersial dan Perindustrian'),
  'Copyright Tribunals': p('Tòa án Bản quyền', 'ศาลลิขสิทธิ์', 'Tribunal Hak Cipta', 'Tribunal Hak Cipta'),
  'The Kwong-Wai-Shiu Free Hospital': p('Bệnh viện Miễn phí Kwong-Wai-Shiu', 'โรงพยาบาลฟรี Kwong-Wai-Shiu', 'Rumah Sakit Gratis Kwong-Wai-Shiu', 'Hospital Percuma Kwong-Wai-Shiu'),

  // ── 单行法名（genre=Act，只给名称主体）──────────────────
  'Attorney-General': p('Tổng Chưởng lý', 'อัยการสูงสุด', 'Jaksa Agung', 'Peguam Negara'),
  'Cattle': p('Gia súc', 'ปศุสัตว์', 'Ternak', 'Lembu'),
  'Census of Population and Agriculture': p('Điều tra Dân số và Nông nghiệp', 'การสำมะโนประชากรและการเกษตร', 'Sensus Penduduk dan Pertanian', 'Banci Penduduk dan Pertanian'),
  'Chemical Weapons': p('Vũ khí Hóa học', 'อาวุธเคมี', 'Senjata Kimia', 'Senjata Kimia'),
  'Commodity Futures': p('Hợp đồng Tương lai Hàng hóa', 'สัญญาซื้อขายล่วงหน้าสินค้าโภคภัณฑ์', 'Kontrak Berjangka Komoditas', 'Kontrak Niaga Hadapan Komoditi'),
  'Consular Conventions': p('Công ước Lãnh sự', 'อนุสัญญากงสุล', 'Konvensi Konsuler', 'Konvensyen Konsular'),
  'Contracts': p('Hợp đồng', 'สัญญา', 'Kontrak', 'Kontrak'),
  'Controlled Premises': p('Cơ sở được Kiểm soát', 'สถานที่ที่ถูกควบคุม', 'Tempat yang Dikendalikan', 'Premis yang Dikawal'),
  'Criminal Justice Reform': p('Cải cách Tư pháp Hình sự', 'การปฏิรูปกระบวนการยุติธรรมทางอาญา', 'Reformasi Keadilan Pidana', 'Pembaharuan Keadilan Jenayah'),
  'Criminal Law': p('Hình sự', 'กฎหมายอาญา', 'Hukum Pidana', 'Undang-Undang Jenayah'),
  'Criminal Procedure': p('Tố tụng Hình sự', 'วิธีพิจารณาความอาญา', 'Hukum Acara Pidana', 'Prosedur Jenayah'),
  'Deduction of Income Tax': p('Khấu trừ Thuế Thu nhập', 'การหักภาษีเงินได้', 'Pemotongan Pajak Penghasilan', 'Potongan Cukai Pendapatan'),
  'Departmental Titles': p('Chức danh Cơ quan', 'ชื่อหน่วยงาน', 'Nama Jabatan', 'Gelaran Jabatan'),
  'Destruction of Disease-Bearing Insects': p('Tiêu diệt Côn trùng Truyền bệnh', 'การกำจัดแมลงนำโรค', 'Pemusnahan Serangga Pembawa Penyakit', 'Pemusnahan Serangga Pembawa Penyakit'),
  'Diplomatic and Consular Officers': p('Viên chức Ngoại giao và Lãnh sự', 'เจ้าหน้าที่การทูตและกงสุล', 'Pejabat Diplomatik dan Konsuler', 'Pegawai Diplomatik dan Konsular'),
  'Reciprocal Enforcement of Commonwealth Judgments': p('Thực thi Tương hỗ các Bản án của Khối Thịnh vượng chung', 'การบังคับใช้คำพิพากษาของเครือจักรภพซึ่งกันและกัน', 'Pelaksanaan Timbal Balik Putusan Persemakmuran', 'Penguatkuasaan Timbal Balik Penghakiman Komanwel'),
  'Road Vehicles': p('Xe cơ giới Đường bộ', 'ยานพาหนะทางบก', 'Kendaraan Jalan Raya', 'Kenderaan Jalan Raya'),
  'School Boards': p('Ủy ban Trường học', 'คณะกรรมการโรงเรียน', 'Dewan Sekolah', 'Lembaga Sekolah'),
  'Shared Mobility Enterprises': p('Doanh nghiệp Di chuyển Chia sẻ', 'วิสาหกิจการเดินทางร่วมกัน', 'Perusahaan Mobilitas Bersama', 'Perusahaan Mobiliti Dikongsi'),
  'Singapore Tourism': p('Du lịch Singapore', 'การท่องเที่ยวสิงคโปร์', 'Pariwisata Singapura', 'Pelancongan Singapura'),
  'Small Motorised Vehicles': p('Xe Cơ giới Cỡ nhỏ', 'ยานพาหนะติดเครื่องยนต์ขนาดเล็ก', 'Kendaraan Bermotor Kecil', 'Kenderaan Bermotor Kecil'),
  'Smoking': p('Hút thuốc', 'การสูบบุหรี่', 'Merokok', 'Merokok'),
  'Status of Children': p('Địa vị của Trẻ em', 'สถานะของเด็ก', 'Status Anak', 'Status Kanak-kanak'),
  'Statutory Boards': p('Ủy ban Pháp định', 'คณะกรรมการตามกฎหมาย', 'Badan Statuter', 'Lembaga Berkanun'),
  'Statutory Bodies and Government Companies': p('Cơ quan Pháp định và Công ty Nhà nước', 'หน่วยงานตามกฎหมายและบริษัทของรัฐ', 'Badan Statuter dan Perusahaan Pemerintah', 'Badan Berkanun dan Syarikat Kerajaan'),
  'Statutory Corporations': p('Tổng công ty Pháp định', 'บรรษัทตามกฎหมาย', 'Korporasi Statuter', 'Perbadanan Berkanun'),
  'Straits Settlements and Johore Territorial Waters': p('Eo biển Thuộc địa và Lãnh hải Johore', 'นิคมช่องแคบและน่านน้ำอาณาเขตยะโฮร์', 'Perairan Teritorial Negeri-Negeri Selat dan Johor', 'Perairan Wilayah Negeri-Negeri Selat dan Johor'),
  'Strategic Goods': p('Hàng hóa Chiến lược', 'สินค้ายุทธศาสตร์', 'Barang Strategis', 'Barang Strategik'),
  'Supplementary Supply': p('Bổ sung Ngân sách', 'งบประมาณเพิ่มเติม', 'Anggaran Tambahan', 'Bekalan Tambahan'),
  'Terrorism': p('Khủng bố', 'การก่อการร้าย', 'Terorisme', 'Keganasan'),
  'Third Parties': p('Bên thứ ba', 'บุคคลภายนอก', 'Pihak Ketiga', 'Pihak Ketiga'),
};
