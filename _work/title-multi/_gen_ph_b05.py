# -*- coding: utf-8 -*-
"""PH 批次 5：条文数 30–99 段第 181–240 部（四语，以 en 为语义基准）。"""
import io, json, os

def city(c):
    return ("Hiến chương Thành phố %s" % c, "กฎบัตรเมือง %s" % c,
            "Piagam Kota %s" % c, "Piagam Bandaraya %s" % c)

def dev_auth(x):
    return ("Đạo luật thành lập Cơ quan Phát triển %s, quy định quyền hạn, chức năng và nhiệm vụ của cơ quan này" % x,
            "พระราชบัญญัติจัดตั้งสำนักงานพัฒนาการ%s กำหนดอำนาจ หน้าที่ และความรับผิดชอบ" % x,
            "Undang-Undang membentuk Otoritas Pembangunan %s, menetapkan wewenang, fungsi, dan tugasnya" % x,
            "Akta menubuhkan Pihak Berkuasa Pembangunan %s, menetapkan kuasa, fungsi dan tanggungjawabnya" % x)

def practice(vi, th, idw, msw):
    return ("Đạo luật Quy định Hành nghề %s" % vi,
            "พระราชบัญญัติกำกับการประกอบวิชาชีพ%s" % th,
            "Undang-Undang Pengaturan Praktik %s" % idw,
            "Akta Pengawalseliaan Amalan %s" % msw)

APPR = (
    "Đạo luật Phân bổ Ngân sách Hoạt động của Chính phủ",
    "พระราชบัญญัติจัดสรรงบประมาณการดำเนินงานของรัฐบาล",
    "Undang-Undang Pengalokasian Anggaran Penyelenggaraan Pemerintahan",
    "Akta Peruntukan Wang Pentadbiran Kerajaan",
)

def amend(no):
    return ("Đạo luật sửa đổi Luật Cộng hòa số %s" % no,
            "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ %s" % no,
            "Undang-Undang Perubahan atas Undang-Undang Republik Nomor %s" % no,
            "Akta Pindaan kepada Akta Republik Nombor %s" % no)

ITEMS = {}

ITEMS["PH-H135"] = (
    "Đạo luật Tổng điều tra Dân số năm 1946",
    "พระราชบัญญัติสำมะโนประชากร ค.ศ. 1946",
    "Undang-Undang Sensus Penduduk Tahun 1946",
    "Akta Banci Penduduk 1946",
)

ITEMS["PH-H4902"] = (
    "Đạo luật sửa đổi Luật Cộng hòa số 3844, tức Bộ luật Cải cách Ruộng đất Nông nghiệp",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ 3844 หรือประมวลกฎหมายปฏิรูปที่ดินเพื่อเกษตรกรรม",
    "Undang-Undang mengubah Undang-Undang Republik Nomor 3844, yaitu Kitab Undang-Undang Reformasi Agraria",
    "Akta meminda Akta Republik Nombor 3844, iaitu Kanun Undang-Undang Pembaharuan Tanah Pertanian",
)

ITEMS["PH-H4936"] = (
    "Đạo luật thành lập Tổng công ty Bảo hiểm Tín dụng Xuất khẩu và Bảo lãnh Philippines, xác định quyền hạn, chức năng và mục tiêu",
    "พระราชบัญญัติจัดตั้งบรรษัทประกันสินเชื่อเพื่อการส่งออกและค้ำประกันฟิลิปปินส์ กำหนดอำนาจ หน้าที่ และวัตถุประสงค์",
    "Undang-Undang membentuk Perusahaan Asuransi Kredit Ekspor dan Penjaminan Filipina, menetapkan wewenang, fungsi, dan tujuannya",
    "Akta menubuhkan Perbadanan Insurans Kredit Eksport dan Jaminan Filipina, menetapkan kuasa, fungsi dan objektifnya",
)

ITEMS["PH-H6277"] = (
    "Đạo luật thành lập Cơ quan Giáo dục Kỹ thuật và Phát triển Kỹ năng, quy định quyền hạn và cơ cấu tổ chức",
    "พระราชบัญญัติจัดตั้งสำนักงานการศึกษาด้านเทคนิคและการพัฒนาทักษะ กำหนดอำนาจและโครงสร้าง",
    "Undang-Undang membentuk Otoritas Pendidikan Teknik dan Pengembangan Keterampilan, menetapkan wewenang dan strukturnya",
    "Akta menubuhkan Pihak Berkuasa Pendidikan Teknikal dan Pembangunan Kemahiran, menetapkan kuasa dan strukturnya",
)

ITEMS["PH-H6966"] = (
    "Đạo luật Bảo tàng Quốc gia năm 1998",
    "พระราชบัญญัติพิพิธภัณฑ์แห่งชาติ ค.ศ. 1998",
    "Undang-Undang Museum Nasional Tahun 1998",
    "Akta Muzium Negara 1998",
)

ITEMS["PH-H7014"] = (
    "Đạo luật về Sĩ quan Tàu biển Thương mại Philippines năm 1998",
    "พระราชบัญญัติเจ้าหน้าที่เรือพาณิชย์ฟิลิปปินส์ ค.ศ. 1998",
    "Undang-Undang Perwira Kapal Niaga Filipina Tahun 1998",
    "Akta Pegawai Kapal Dagang Filipina 1998",
)

ITEMS["PH-H7268"] = (
    "Đạo luật về Biện pháp Tự vệ",
    "พระราชบัญญัติมาตรการปกป้อง",
    "Undang-Undang Tindakan Pengamanan",
    "Akta Langkah Perlindungan",
)

ITEMS["PH-H10361"] = (
    "Bộ luật về Hợp tác Công - Tư (PPP) của Philippines",
    "ประมวลกฎหมายความร่วมมือระหว่างภาครัฐและเอกชน (PPP) ของฟิลิปปินส์",
    "Kitab Undang-Undang Kerja Sama Pemerintah dan Badan Usaha (PPP) Filipina",
    "Kanun Undang-Undang Kerjasama Awam-Swasta (PPP) Filipina",
)

ITEMS["PH-H10362"] = (
    "Đạo luật bảo vệ người tiêu dùng và doanh nghiệp trực tuyến trong các giao dịch internet, thành lập Cục Thương mại Điện tử",
    "พระราชบัญญัติคุ้มครองผู้บริโภคและผู้ประกอบการออนไลน์ในการทำธุรกรรมทางอินเทอร์เน็ต จัดตั้งสำนักพาณิชย์อิเล็กทรอนิกส์",
    "Undang-Undang perlindungan konsumen dan pelaku usaha daring dalam transaksi internet, membentuk Biro Perdagangan Elektronik",
    "Akta perlindungan pengguna dan peniaga dalam talian dalam urus niaga internet, menubuhkan Biro Perdagangan Elektronik",
)

ITEMS["PH-H6089"] = (
    "Đại Hiến chương Nông dân Nhỏ",
    "มหากฎบัตรเกษตรกรรายย่อย",
    "Piagam Agung Petani Kecil",
    "Piagam Agung Petani Kecil",
)

ITEMS["PH-H7712"] = (
    "Đạo luật Thư viện Philippines năm 2003",
    "พระราชบัญญัติห้องสมุดฟิลิปปินส์ ค.ศ. 2003",
    "Undang-Undang Perpustakaan Filipina Tahun 2003",
    "Akta Perpustakaan Filipina 2003",
)

ITEMS["PH-H7733"] = (
    "Đạo luật Thú y Philippines năm 2004",
    "พระราชบัญญัติสัตวแพทยศาสตร์ฟิลิปปินส์ ค.ศ. 2004",
    "Undang-Undang Kedokteran Hewan Filipina Tahun 2004",
    "Akta Perubatan Veterinar Filipina 2004",
)

ITEMS["PH-H7745"] = (
    "Luật Cộng hòa số 9853",
    "รัฐบัญญัติฉบับที่ 9853",
    "Undang-Undang Republik Nomor 9853",
    "Akta Republik Nombor 9853",
)

ITEMS["PH-H7818"] = city("Meycauayan")

ITEMS["PH-H9633"] = (
    "Đạo luật quy định bảo vệ đặc biệt đối với trẻ em trong xung đột vũ trang và hình phạt đối với hành vi vi phạm",
    "พระราชบัญญัติกำหนดการคุ้มครองพิเศษสำหรับเด็กในสถานการณ์ความขัดแย้งด้วยอาวุธและโทษสำหรับการฝ่าฝืน",
    "Undang-Undang mengatur perlindungan khusus bagi anak dalam konflik bersenjata dan sanksi atas pelanggaran",
    "Akta mengatur perlindungan khas bagi kanak-kanak dalam konflik bersenjata dan hukuman bagi pelanggaran",
)

ITEMS["PH-H9943"] = amend("10068")

ITEMS["PH-H10452"] = (
    "Đạo luật thể chế hóa Khung Giáo dục và Đào tạo Dựa trên Doanh nghiệp và phân bổ ngân sách",
    "พระราชบัญญัติสถาปนากรอบการศึกษาและการฝึกอบรมฐานสถานประกอบการ และจัดสรรงบประมาณ",
    "Undang-Undang melembagakan Kerangka Pendidikan dan Pelatihan Berbasis Perusahaan dan mengalokasikan anggaran",
    "Akta memperinstitusikan Kerangka Pendidikan dan Latihan Berasaskan Perusahaan dan memperuntukkan wang",
)

ITEMS["PH-H7705"] = (
    "Đạo luật về Phương tiện Quang học",
    "พระราชบัญญัติสื่อออปติคัล",
    "Undang-Undang Media Optik",
    "Akta Media Optik",
)

ITEMS["PH-H7761"] = (
    "Đạo luật Kỹ thuật Hóa học",
    "พระราชบัญญัติวิศวกรรมเคมี",
    "Undang-Undang Teknik Kimia",
    "Akta Kejuruteraan Kimia",
)

ITEMS["PH-H9191"] = (
    "Đạo luật cải cách Sangguniang Kabataan, tạo cơ chế trao quyền thúc đẩy sự tham gia có ý nghĩa của thanh niên vào xây dựng đất nước",
    "พระราชบัญญัติปฏิรูป Sangguniang Kabataan จัดตั้งกลไกเสริมพลังส่งเสริมการมีส่วนร่วมอย่างมีความหมายของเยาวชนในการสร้างชาติ",
    "Undang-Undang reformasi Sangguniang Kabataan, membentuk mekanisme pemberdayaan yang mendorong partisipasi bermakna pemuda dalam pembangunan bangsa",
    "Akta pembaharuan Sangguniang Kabataan, membentuk mekanisme pemerkasaan yang menggalakkan penyertaan bermakna belia dalam pembinaan negara",
)

ITEMS["PH-H9683"] = (
    "Đạo luật Quy định Đăng ký, Cấp phép và Hành nghề Trị liệu Nghề nghiệp",
    "พระราชบัญญัติกำกับการขึ้นทะเบียน การออกใบอนุญาต และการประกอบวิชาชีพกิจกรรมบำบัด",
    "Undang-Undang Pengaturan Pendaftaran, Perizinan, dan Praktik Terapi Okupasi",
    "Akta Pengawalseliaan Pendaftaran, Pelesenan dan Amalan Terapi Pekerjaan",
)

ITEMS["PH-H10078"] = (
    "Đạo luật thiết lập chính sách hòa nhập và cung cấp dịch vụ cho người học khuyết tật, hỗ trợ các trung tâm tài nguyên học tập hòa nhập tại tất cả khu học chính, thị xã và thành phố",
    "พระราชบัญญัติกำหนดนโยบายการเรียนร่วมและการให้บริการสำหรับผู้เรียนพิการ สนับสนุนศูนย์ทรัพยากรการเรียนรู้แบบเรียนร่วมในเขตการศึกษา เทศบาล และเมืองทั้งหมด",
    "Undang-Undang menetapkan kebijakan inklusi dan penyediaan layanan bagi peserta didik penyandang disabilitas, mendukung pusat sumber belajar inklusif di seluruh distrik sekolah, kotamadya, dan kota",
    "Akta menetapkan dasar inklusi dan penyediaan perkhidmatan bagi pelajar kurang upaya, menyokong pusat sumber pembelajaran inklusif di seluruh daerah sekolah, perbandaran dan bandar",
)

ITEMS["PH-H10380"] = (
    "Đạo luật tăng cường và phục hồi ngành muối Philippines, phân bổ ngân sách",
    "พระราชบัญญัติเสริมสร้างและฟื้นฟูอุตสาหกรรมเกลือฟิลิปปินส์ และจัดสรรงบประมาณ",
    "Undang-Undang memperkuat dan merevitalisasi industri garam Filipina, mengalokasikan anggaran",
    "Akta memperkukuh dan menghidupkan semula industri garam Filipina, memperuntukkan wang",
)

ITEMS["PH-H1634"] = APPR
ITEMS["PH-H3159"] = dev_auth("Panay")

ITEMS["PH-H3313"] = (
    "Đạo luật Quy định Hành nghề Kỹ thuật Điều hòa Không khí và Làm lạnh tại Philippines",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพวิศวกรรมเครื่องปรับอากาศและความเย็นในฟิลิปปินส์",
    "Undang-Undang Pengaturan Praktik Teknik Tata Udara dan Pendinginan di Filipina",
    "Akta Pengawalseliaan Amalan Kejuruteraan Penghawa Dingin dan Penyejukan di Filipina",
)

ITEMS["PH-H3644"] = (
    "Đạo luật thành lập Trại Ngựa Giống Quốc gia, quy định quyền hạn và chức năng",
    "พระราชบัญญัติจัดตั้งฟาร์มม้าพันธุ์แห่งชาติ กำหนดอำนาจและหน้าที่",
    "Undang-Undang membentuk Peternakan Kuda Bibit Nasional, menetapkan wewenang dan fungsinya",
    "Akta menubuhkan Ladang Kuda Baka Negara, menetapkan kuasa dan fungsinya",
)

ITEMS["PH-H5842"] = (
    "Đạo luật thành lập Tổng công ty Bưu chính Philippines, xác định quyền hạn, chức năng và trách nhiệm, quy định quản lý ngành",
    "พระราชบัญญัติจัดตั้งบรรษัทไปรษณีย์ฟิลิปปินส์ กำหนดอำนาจ หน้าที่ และความรับผิดชอบ กำหนดการกำกับดูแลอุตสาหกรรม",
    "Undang-Undang membentuk Perusahaan Pos Filipina, menetapkan wewenang, fungsi, dan tanggung jawab, mengatur pengawasan industri",
    "Akta menubuhkan Perbadanan Pos Filipina, menetapkan kuasa, fungsi dan tanggungjawab, mengawal selia penyeliaan industri",
)

ITEMS["PH-H6092"] = (
    "Đạo luật Bảo vệ Đặc biệt Trẻ em khỏi Bị ngược đãi, Bóc lột và Phân biệt đối xử",
    "พระราชบัญญัติคุ้มครองพิเศษเด็กจากการถูกทำร้าย การแสวงหาประโยชน์ และการเลือกปฏิบัติ",
    "Undang-Undang Perlindungan Khusus Anak dari Penganiayaan, Eksploitasi, dan Diskriminasi",
    "Akta Perlindungan Khas Kanak-Kanak daripada Penganiayaan, Eksploitasi dan Diskriminasi",
)

ITEMS["PH-H7007"] = practice("Thiết kế Nội thất", "การออกแบบภายใน", "Desain Interior", "Reka Bentuk Dalaman")

ITEMS["PH-H7521"] = (
    "Đạo luật Kiến trúc Cảnh quan Philippines năm 2000",
    "พระราชบัญญัติสถาปัตยกรรมภูมิทัศน์ฟิลิปปินส์ ค.ศ. 2000",
    "Undang-Undang Arsitektur Lanskap Filipina Tahun 2000",
    "Akta Seni Bina Landskap Filipina 2000",
)

ITEMS["PH-H7723"] = (
    "Đạo luật Hướng dẫn và Tư vấn năm 2004",
    "พระราชบัญญัติการแนะแนวและการให้คำปรึกษา ค.ศ. 2004",
    "Undang-Undang Bimbingan dan Konseling Tahun 2004",
    "Akta Bimbingan dan Kaunseling 2004",
)

ITEMS["PH-H7740"] = (
    "Đạo luật Nước sạch Philippines năm 2004",
    "พระราชบัญญัติน้ำสะอาดฟิลิปปินส์ ค.ศ. 2004",
    "Undang-Undang Air Bersih Filipina Tahun 2004",
    "Akta Air Bersih Filipina 2004",
)

ITEMS["PH-H9497"] = practice("Công nghệ Thực phẩm", "เทคโนโลยีอาหาร", "Teknologi Pangan", "Teknologi Makanan")

ITEMS["PH-H9660"] = (
    "Đạo luật thể chế hóa Chương trình Kiểm soát Ung thư Toàn diện Quốc gia và phân bổ ngân sách",
    "พระราชบัญญัติสถาปนาโครงการควบคุมมะเร็งแบบครบวงจรแห่งชาติ และจัดสรรงบประมาณ",
    "Undang-Undang melembagakan Program Pengendalian Kanker Komprehensif Nasional dan mengalokasikan anggaran",
    "Akta memperinstitusikan Program Kawalan Kanser Komprehensif Kebangsaan dan memperuntukkan wang",
)

ITEMS["PH-H10620"] = (
    "Đạo luật thiết lập khung toàn diện và bao trùm về truyền dữ liệu và kết nối cho Philippines",
    "พระราชบัญญัติกำหนดกรอบการส่งข้อมูลและการเชื่อมต่อแบบครบวงจรและทั่วถึงสำหรับฟิลิปปินส์",
    "Undang-Undang menetapkan kerangka komprehensif dan inklusif untuk transmisi data dan konektivitas bagi Filipina",
    "Akta menetapkan kerangka komprehensif dan inklusif bagi penghantaran data dan konektiviti untuk Filipina",
)

ITEMS["PH-H1819"] = APPR

ITEMS["PH-H3686"] = (
    "Đại Hiến chương Giáo viên Trường Công lập",
    "มหากฎบัตรครูโรงเรียนรัฐบาล",
    "Piagam Agung Guru Sekolah Negeri",
    "Piagam Agung Guru Sekolah Awam",
)

ITEMS["PH-H5652"] = practice("Điều dưỡng", "การพยาบาล", "Keperawatan", "Kejururawatan")

ITEMS["PH-H6910"] = (
    "Đạo luật ủy quyền cho Ủy ban Bầu cử sử dụng hệ thống bầu cử tự động trong cuộc bầu cử ngày 11 tháng 5 năm 1998 và các cuộc bầu cử sau đó",
    "พระราชบัญญัติให้อำนาจคณะกรรมการการเลือกตั้งใช้ระบบการเลือกตั้งอัตโนมัติในการเลือกตั้งวันที่ 11 พฤษภาคม ค.ศ. 1998 และการเลือกตั้งครั้งต่อ ๆ ไป",
    "Undang-Undang memberikan kewenangan kepada Komisi Pemilihan Umum untuk menggunakan sistem pemilihan otomatis dalam pemilu 11 Mei 1998 dan pemilu berikutnya",
    "Akta memberi kuasa kepada Suruhanjaya Pilihan Raya untuk menggunakan sistem pilihan raya automatik dalam pilihan raya 11 Mei 1998 dan pilihan raya seterusnya",
)

ITEMS["PH-H9058"] = (
    "Đạo luật sửa đổi Luật Bảo hiểm Y tế Quốc gia năm 1995",
    "พระราชบัญญัติแก้ไขพระราชบัญญัติประกันสุขภาพแห่งชาติ ค.ศ. 1995",
    "Undang-Undang Perubahan atas Undang-Undang Asuransi Kesehatan Nasional Tahun 1995",
    "Akta Pindaan kepada Akta Insurans Kesihatan Kebangsaan 1995",
)

ITEMS["PH-H9077"] = (
    "Đạo luật tổ chức lại và tăng cường Hệ thống Thống kê Philippines",
    "พระราชบัญญัติปรับโครงสร้างและเสริมสร้างระบบสถิติฟิลิปปินส์",
    "Undang-Undang mereorganisasi dan memperkuat Sistem Statistik Filipina",
    "Akta menyusun semula dan memperkukuh Sistem Statistik Filipina",
)

ITEMS["PH-H9147"] = (
    "Đạo luật phòng chống phổ biến vũ khí hủy diệt hàng loạt thông qua quản lý thương mại hàng hóa được kiểm soát và các dịch vụ liên quan",
    "พระราชบัญญัติป้องกันการแพร่ขยายอาวุธที่มีอำนาจทำลายล้างสูงผ่านการควบคุมการค้าสินค้าควบคุมและบริการที่เกี่ยวข้อง",
    "Undang-Undang mencegah penyebaran senjata pemusnah massal melalui pengelolaan perdagangan barang terkendali dan jasa terkait",
    "Akta mencegah penyebaran senjata pemusnah besar-besaran melalui pengurusan perdagangan barang terkawal dan perkhidmatan berkaitan",
)

ITEMS["PH-H9646"] = (
    "Đạo luật thành lập Bộ Định cư Con người và Phát triển Đô thị, xác định nhiệm vụ, quyền hạn và chức năng",
    "พระราชบัญญัติจัดตั้งกระทรวงการตั้งถิ่นฐานมนุษย์และการพัฒนเมือง กำหนดภารกิจ อำนาจ และหน้าที่",
    "Undang-Undang membentuk Kementerian Permukiman Manusia dan Pembangunan Perkotaan, menetapkan misi, wewenang, dan fungsinya",
    "Akta menubuhkan Kementerian Penempatan Manusia dan Pembangunan Bandar, menetapkan misi, kuasa dan fungsinya",
)

ITEMS["PH-H1198"] = practice("Kỹ thuật Vệ sinh", "วิศวกรรมสุขาภิบาล", "Teknik Sanitasi", "Kejuruteraan Sanitasi")

ITEMS["PH-H2936"] = APPR

ITEMS["PH-H3113"] = (
    "Đạo luật bảo đảm an toàn và tinh khiết của thực phẩm, thuốc và mỹ phẩm cung cấp cho công chúng, thành lập Cục Quản lý Thực phẩm và Dược phẩm",
    "พระราชบัญญัติรับประกันความปลอดภัยและความบริสุทธิ์ของอาหาร ยา และเครื่องสำอางที่ให้แก่สาธารณชน จัดตั้งสำนักงานคณะกรรมการอาหารและยา",
    "Undang-Undang menjamin keamanan dan kemurnian pangan, obat, dan kosmetik yang disediakan bagi publik, membentuk Badan Pengawas Obat dan Makanan",
    "Akta menjamin keselamatan dan ketulenan makanan, ubat dan kosmetik yang dibekalkan kepada orang awam, menubuhkan Pihak Berkuasa Kawalan Makanan dan Dadah",
)

ITEMS["PH-H3576"] = (
    "Đạo luật Quy định Hành nghề Kỹ thuật Trắc địa tại Philippines",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพวิศวกรรมมาตรวิทยาแผ่นดินในฟิลิปปินส์",
    "Undang-Undang Pengaturan Praktik Teknik Geodesi di Filipina",
    "Akta Pengawalseliaan Amalan Kejuruteraan Geodesi di Filipina",
)

ITEMS["PH-H6317"] = (
    "Đạo luật tăng cường quản lý và giám sát hành nghề giảng dạy tại Philippines, quy định kỳ thi cấp chứng chỉ giáo viên",
    "พระราชบัญญัติเสริมสร้างการกำกับดูแลและการนิเทศการประกอบวิชาชีพการสอนในฟิลิปปินส์ กำหนดการสอบใบอนุญาตประกอบวิชาชีพครู",
    "Undang-Undang memperkuat pengaturan dan pengawasan praktik mengajar di Filipina, menetapkan ujian sertifikasi guru",
    "Akta memperkukuh pengawalseliaan dan penyeliaan amalan perguruan di Filipina, menetapkan peperiksaan pensijilan guru",
)

ITEMS["PH-H7030"] = (
    "Đạo luật Kỹ thuật Trắc địa Philippines năm 1998",
    "พระราชบัญญัติวิศวกรรมมาตรวิทยาแผ่นดินฟิลิปปินส์ ค.ศ. 1998",
    "Undang-Undang Teknik Geodesi Filipina Tahun 1998",
    "Akta Kejuruteraan Geodesi Filipina 1998",
)

ITEMS["PH-H8605"] = (
    "Đạo luật thúc đẩy khả năng tài chính và kỷ luật tài khóa của các công ty do nhà nước sở hữu hoặc kiểm soát, tăng cường vai trò của Nhà nước trong quản trị",
    "พระราชบัญญัติส่งเสริมความมั่นคงทางการเงินและวินัยการคลังของรัฐวิสาหกิจ เสริมสร้างบทบาทของรัฐในการกำกับดูแล",
    "Undang-Undang mendorong kelayakan keuangan dan disiplin fiskal perusahaan milik atau dikendalikan negara, memperkuat peran negara dalam tata kelola",
    "Akta menggalakkan kemampanan kewangan dan disiplin fiskal syarikat milik atau dikawal negara, memperkukuh peranan negara dalam tadbir urus",
)

ITEMS["PH-H9503"] = (
    "Đạo luật tăng cường tuân thủ các tiêu chuẩn an toàn và sức khỏe nghề nghiệp và quy định hình phạt đối với hành vi vi phạm",
    "พระราชบัญญัติเสริมสร้างการปฏิบัติตามมาตรฐานความปลอดภัยและอาชีวอนามัย และกำหนดโทษสำหรับการฝ่าฝืน",
    "Undang-Undang memperkuat kepatuhan terhadap standar keselamatan dan kesehatan kerja serta menetapkan sanksi atas pelanggaran",
    "Akta memperkukuh pematuhan standard keselamatan dan kesihatan pekerjaan serta menetapkan hukuman bagi pelanggaran",
)

ITEMS["PH-H9766"] = ITEMS["PH-H6966"]

ITEMS["PH-EODB-2018"] = (
    "Đạo luật về Thuận lợi Kinh doanh và Dịch vụ Chính phủ Hiệu quả",
    "พระราชบัญญัติอำนวยความสะดวกในการประกอบธุรกิจและการให้บริการภาครัฐที่มีประสิทธิภาพ",
    "Undang-Undang Kemudahan Berusaha dan Pelayanan Pemerintah yang Efisien",
    "Akta Kemudahan Berniaga dan Perkhidmatan Kerajaan yang Cekap",
)

ITEMS["PH-H10125"] = (
    "Đạo luật quy định phát triển ngành công nghiệp xe điện",
    "พระราชบัญญัติกำหนดการพัฒนาอุตสาหกรรมยานยนต์ไฟฟ้า",
    "Undang-Undang mengatur pengembangan industri kendaraan listrik",
    "Akta mengatur pembangunan industri kenderaan elektrik",
)

ITEMS["PH-H10268"] = amend("3591")

ITEMS["PH-H10391"] = (
    "Đạo luật bảo vệ phúc lợi của người lao động trong ngành điện ảnh và truyền hình",
    "พระราชบัญญัติคุ้มครองสวัสดิการของแรงงานในอุตสาหกรรมภาพยนตร์และโทรทัศน์",
    "Undang-Undang perlindungan kesejahteraan pekerja industri film dan televisi",
    "Akta perlindungan kebajikan pekerja industri filem dan televisyen",
)

ITEMS["PH-H1806"] = (
    "Đạo luật hợp nhất, điều phối và tăng cường nghiên cứu và phát triển khoa học và công nghệ, thúc đẩy phát minh",
    "พระราชบัญญัติรวบรวม ประสาน และเสริมสร้างการวิจัยและพัฒนาวิทยาศาสตร์และเทคโนโลยี ส่งเสริมสิ่งประดิษฐ์",
    "Undang-Undang menghimpun, mengoordinasikan, dan memperkuat penelitian dan pengembangan ilmu pengetahuan dan teknologi, mendorong invensi",
    "Akta menghimpunkan, menyelaras dan memperkukuh penyelidikan dan pembangunan sains dan teknologi, menggalakkan ciptaan",
)

ITEMS["PH-H2427"] = APPR
ITEMS["PH-H3476"] = practice("Kỹ thuật Khai khoáng", "วิศวกรรมเหมืองแร่", "Teknik Pertambangan", "Kejuruteraan Perlombongan")

ZH_FIX = {
    "PH-H9683": "职业治疗注册、执照与执业规制法",
}

items = {}
for k, v in ITEMS.items():
    d = {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]}
    if k in ZH_FIX:
        d["zh"] = ZH_FIX[k]
    items[k] = d

OUT = {
    "batch": "ph-p1-b07",
    "scope": "PH 条文数 30–99 段第 181–240 部（以 en 为语义基准，含 1 条 zh 订正）",
    "items": items,
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b07.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(json.dumps(OUT, ensure_ascii=False, indent=1))
print("写入", dst, "部数", len(items))
