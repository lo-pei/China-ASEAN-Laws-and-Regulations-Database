# -*- coding: utf-8 -*-
"""PH 批次 4：条文数 30–99 段第 121–180 部（四语，以 en 为语义基准）。

模板：
- 设立 X 发展管理局 -> 见 dev_auth()
- X 执业规制法     -> 见 practice()
"""
import io, json, os

def dev_auth(x, corp=False):
    if corp:
        return ("Đạo luật thành lập Công ty Phát triển %s, quy định quyền hạn, chức năng và nhiệm vụ của công ty" % x,
                "พระราชบัญญัติจัดตั้งบรรษัทพัฒนาการ %s กำหนดอำนาจ หน้าที่ และความรับผิดชอบ" % x,
                "Undang-Undang membentuk Perusahaan Pembangunan %s, menetapkan wewenang, fungsi, dan tugasnya" % x,
                "Akta menubuhkan Perbadanan Pembangunan %s, menetapkan kuasa, fungsi dan tanggungjawabnya" % x)
    return ("Đạo luật thành lập Cơ quan Phát triển %s, quy định quyền hạn, chức năng và nhiệm vụ của cơ quan này" % x,
            "พระราชบัญญัติจัดตั้งสำนักงานพัฒนาการ%s กำหนดอำนาจ หน้าที่ และความรับผิดชอบ" % x,
            "Undang-Undang membentuk Otoritas Pembangunan %s, menetapkan wewenang, fungsi, dan tugasnya" % x,
            "Akta menubuhkan Pihak Berkuasa Pembangunan %s, menetapkan kuasa, fungsi dan tanggungjawabnya" % x)

def practice(vi, th, idw, msw):
    return ("Đạo luật Quy định Hành nghề %s" % vi,
            "พระราชบัญญัติกำกับการประกอบวิชาชีพ%s" % th,
            "Undang-Undang Pengaturan Praktik %s" % idw,
            "Akta Pengawalseliaan Amalan %s" % msw)

ITEMS = {}

ITEMS["PH-PSA-2022"] = (
    "Đạo luật sửa đổi Đạo luật Dịch vụ Công ích",
    "พระราชบัญญัติแก้ไขพระราชบัญญัติบริการสาธารณะ",
    "Undang-Undang Perubahan atas Undang-Undang Pelayanan Publik",
    "Akta Pindaan kepada Akta Perkhidmatan Awam",
)

ITEMS["PH-DPA-2012"] = (
    "Đạo luật Bảo vệ Dữ liệu Cá nhân năm 2012",
    "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ค.ศ. 2012",
    "Undang-Undang Perlindungan Data Pribadi Tahun 2012",
    "Akta Perlindungan Data Peribadi 2012",
)

ITEMS["PH-H035"] = (
    "Luật Cộng hòa số 10173 (Đạo luật Bảo vệ Dữ liệu Cá nhân)",
    "รัฐบัญญัติฉบับที่ 10173 (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล)",
    "Undang-Undang Republik Nomor 10173 (Undang-Undang Perlindungan Data Pribadi)",
    "Akta Republik Nombor 10173 (Akta Perlindungan Data Peribadi)",
)

ITEMS["PH-H10601"] = (
    "Đạo luật Quy định Hành nghề Nông nghiệp tại Philippines, thành lập Hội đồng Quản lý Chuyên ngành Nông học",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพเกษตรศาสตร์ในฟิลิปปินส์ จัดตั้งคณะกรรมการกำกับวิชาชีพนักเกษตรศาสตร์",
    "Undang-Undang Pengaturan Praktik Profesi Pertanian di Filipina, membentuk Dewan Pengawas Profesi Agronomi",
    "Akta Pengawalseliaan Amalan Profesion Pertanian di Filipina, menubuhkan Lembaga Pengawalseliaan Profesion Agronomi",
)

ITEMS["PH-H260"] = (
    "Đạo luật quy định việc đăng ký và bảo hộ nhãn hiệu, tên thương mại và nhãn hiệu dịch vụ, xác định hành vi cạnh tranh không lành mạnh và ghi nhãn sai, quy định các biện pháp khắc phục",
    "พระราชบัญญัติกำหนดการจดทะเบียนและคุ้มครองเครื่องหมายการค้า ชื่อทางการค้า และเครื่องหมายบริการ กำหนดการแข่งขันที่ไม่เป็นธรรมและการติดฉลากเท็จ และกำหนดมาตรการเยียวยา",
    "Undang-Undang mengatur pendaftaran dan perlindungan merek, nama dagang, dan merek jasa, menetapkan persaingan tidak sehat dan pelabelan palsu, serta menetapkan upaya pemulihan",
    "Akta mengawal selia pendaftaran dan perlindungan tanda dagangan, nama perdagangan dan tanda perkhidmatan, menetapkan persaingan tidak adil dan pelabelan palsu, serta menetapkan remedi",
)

ITEMS["PH-H2640"] = dev_auth("Mindanao")
ITEMS["PH-H3335"] = dev_auth("Samar Bắc")
ITEMS["PH-H3614"] = dev_auth("Catanduanes")
ITEMS["PH-H4663"] = dev_auth("Ilocos Sur")

ITEMS["PH-H6400"] = (
    "Đạo luật quy định việc quản lý toàn diện và kịp thời hơn đối với hành nghề, cấp phép và đăng ký của kỹ sư điện và thợ điện",
    "พระราชบัญญัติกำหนดการกำกับดูแลการประกอบวิชาชีพ การออกใบอนุญาต และการขึ้นทะเบียนของวิศวกรไฟฟ้าและช่างไฟฟ้าอย่างครอบคลุม",
    "Undang-Undang mengatur pengawasan yang lebih komprehensif dan responsif terhadap praktik, perizinan, dan pendaftaran insinyur listrik dan teknisi listrik",
    "Akta mengatur pengawasan yang lebih komprehensif dan responsif terhadap amalan, pelesenan dan pendaftaran jurutera elektrik serta juruteknik elektrik",
)

ITEMS["PH-H8104"] = (
    "Đạo luật Dịch vụ Bất động sản",
    "พระราชบัญญัติบริการอสังหาริมทรัพย์",
    "Undang-Undang Jasa Real Estat",
    "Akta Perkhidmatan Hartanah",
)

ITEMS["PH-H8813"] = (
    "Đạo luật thiết lập chính sách bảo vệ và phúc lợi cho người giúp việc gia đình",
    "พระราชบัญญัติกำหนดนโยบายคุ้มครองและสวัสดิการของคนทำงานบ้าน",
    "Undang-Undang menetapkan kebijakan perlindungan dan kesejahteraan pekerja rumah tangga",
    "Akta menetapkan dasar perlindungan dan kebajikan pekerja rumah tangga",
)

ITEMS["PH-H9042"] = (
    "Đạo luật sửa đổi Luật Cộng hòa số 9189",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ 9189",
    "Undang-Undang Perubahan atas Undang-Undang Republik Nomor 9189",
    "Akta Pindaan kepada Akta Republik Nombor 9189",
)

ITEMS["PH-H9668"] = (
    "Đạo luật thiết lập Chăm sóc Sức khỏe Toàn dân cho mọi người dân Philippines, quy định cải cách hệ thống y tế và phân bổ ngân sách",
    "พระราชบัญญัติจัดตั้งระบบหลักประกันสุขภาพถ้วนหน้าสำหรับชาวฟิลิปปินส์ทุกคน กำหนดการปฏิรูประบบสุขภาพ และจัดสรรงบประมาณ",
    "Undang-Undang membentuk Jaminan Kesehatan Universal bagi seluruh rakyat Filipina, menetapkan reformasi sistem kesehatan, dan mengalokasikan anggaran",
    "Akta menubuhkan Penjagaan Kesihatan Sejagat bagi seluruh rakyat Filipina, menetapkan pembaharuan sistem kesihatan dan memperuntukkan wang",
)

ITEMS["PH-H10600"] = (
    "Đạo luật sửa đổi Bộ luật Thuế Nội địa Quốc gia năm 1997",
    "พระราชบัญญัติแก้ไขประมวลกฎหมายภาษีอากรภายในประเทศ ค.ศ. 1997",
    "Undang-Undang Perubahan atas Kitab Undang-Undang Pajak Dalam Negeri Tahun 1997",
    "Akta Pindaan kepada Kanun Undang-Undang Hasil Dalam Negeri 1997",
)

ITEMS["PH-H6521"] = (
    "Đạo luật thiết lập chính sách việc làm ở nước ngoài và đặt ra tiêu chuẩn cao hơn về bảo vệ và thúc đẩy phúc lợi của người lao động di trú, gia đình họ và người Philippines ở nước ngoài gặp khó khăn",
    "พระราชบัญญัติกำหนดนโยบายการจ้างงานต่างประเทศ และกำหนดมาตรฐานที่สูงขึ้นในการคุ้มครองและส่งเสริมสวัสดิการของแรงงานอพยพ ครอบครัว และชาวฟิลิปปินส์ในต่างประเทศที่ประสบภัย",
    "Undang-Undang menetapkan kebijakan ketenagakerjaan luar negeri dan standar yang lebih tinggi untuk perlindungan serta peningkatan kesejahteraan pekerja migran, keluarga mereka, dan warga Filipina di luar negeri yang dalam kesulitan",
    "Akta menetapkan dasar pekerjaan luar negara dan standard yang lebih tinggi bagi perlindungan dan peningkatan kebajikan pekerja migran, keluarga mereka dan rakyat Filipina di luar negara yang menghadapi kesulitan",
)

ITEMS["PH-H7762"] = practice("Kế toán", "การบัญชี", "Akuntansi", "Perakaunan")
ITEMS["PH-H8621"] = practice("Địa chất", "ธรณีวิทยา", "Geologi", "Geologi")

ITEMS["PH-H9576"] = (
    "Đạo luật thành lập Hội đồng Thi Tội phạm học Philippines",
    "พระราชบัญญัติจัดตั้งคณะกรรมการสอบอาชญาวิทยาฟิลิปปินส์",
    "Undang-Undang membentuk Dewan Ujian Kriminologi Filipina",
    "Akta menubuhkan Lembaga Peperiksaan Kriminologi Filipina",
)

ITEMS["PH-H9831"] = (
    "Đạo luật Quy định Hành nghề Thủy sản tại Philippines, thành lập Hội đồng Quản lý Chuyên ngành Thủy sản",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพประมงในฟิลิปปินส์ จัดตั้งคณะกรรมการกำกับวิชาชีพการประมง",
    "Undang-Undang Pengaturan Praktik Profesi Perikanan di Filipina, membentuk Dewan Pengawas Profesi Perikanan",
    "Akta Pengawalseliaan Amalan Profesion Perikanan di Filipina, menubuhkan Lembaga Pengawalseliaan Profesion Perikanan",
)

ITEMS["PH-CREATE-2021"] = (
    "Đạo luật Phục hồi Doanh nghiệp và Ưu đãi Thuế (CREATE)",
    "พระราชบัญญัติการฟื้นฟูกิจการและสิ่งจูงใจทางภาษี (CREATE)",
    "Undang-Undang Pemulihan Perusahaan dan Insentif Pajak (CREATE)",
    "Akta Pemulihan Perusahaan dan Insentif Cukai (CREATE)",
)

ITEMS["PH-H10532"] = (
    "Đạo luật chuyển Cơ quan Kinh tế và Phát triển Quốc gia thành Bộ Kinh tế, Quy hoạch và Phát triển (DEPDEV), chuyển Hội đồng NEDA thành Hội đồng Kinh tế và Phát triển, sửa đổi các Sắc lệnh Hành pháp số 230 và 292 năm 1987",
    "พระราชบัญญัติเปลี่ยนสำนักงานเศรษฐกิจและการพัฒนาของชาติเป็นกระทรวงเศรษฐกิจ การวางแผน และการพัฒนา (DEPDEV) เปลี่ยนคณะกรรมการ NEDA เป็นคณะกรรมการเศรษฐกิจและการพัฒนา แก้ไขคำสั่งฝ่ายบริหารฉบับที่ 230 และ 292 ค.ศ. 1987",
    "Undang-Undang mengubah Otoritas Ekonomi dan Pembangunan Nasional menjadi Kementerian Ekonomi, Perencanaan, dan Pembangunan (DEPDEV), mengubah Dewan NEDA menjadi Dewan Ekonomi dan Pembangunan, mengubah Perintah Eksekutif Nomor 230 dan 292 Tahun 1987",
    "Akta menukar Pihak Berkuasa Ekonomi dan Pembangunan Negara kepada Kementerian Ekonomi, Perancangan dan Pembangunan (DEPDEV), menukar Majlis NEDA kepada Majlis Ekonomi dan Pembangunan, meminda Perintah Eksekutif Nombor 230 dan 292 Tahun 1987",
)

ITEMS["PH-H4937"] = (
    "Đạo luật về Thuốc gây nghiện Nguy hiểm năm 1972",
    "พระราชบัญญัติยาเสพติดให้โทษอันตราย ค.ศ. 1972",
    "Undang-Undang tentang Obat Berbahaya Tahun 1972",
    "Akta tentang Dadah Berbahaya 1972",
)

ITEMS["PH-H6529"] = practice("Khúc xạ Nhãn khoa", "ทัศนมาตรศาสตร์", "Optometri", "Optometri")

ITEMS["PH-H7756"] = (
    "Đạo luật Hành nghề Kỹ thuật Điện tử năm 2004",
    "พระราชบัญญัติการประกอบวิชาชีพวิศวกรรมอิเล็กทรอนิกส์ ค.ศ. 2004",
    "Undang-Undang Praktik Teknik Elektronika Tahun 2004",
    "Akta Amalan Kejuruteraan Elektronik 2004",
)

ITEMS["PH-H9039"] = practice("Quy hoạch Môi trường", "การวางแผนสิ่งแวดล้อม", "Perencanaan Lingkungan", "Perancangan Alam Sekitar")

ITEMS["PH-H9140"] = (
    "Đạo luật Chuyên ngành Lâm nghiệp",
    "พระราชบัญญัติวิชาชีพป่าไม้",
    "Undang-Undang Profesi Kehutanan",
    "Akta Profesion Perhutanan",
)

ITEMS["PH-H014"] = (
    "Đạo luật Thương mại Điện tử năm 2000",
    "พระราชบัญญัติพาณิชย์อิเล็กทรอนิกส์ ค.ศ. 2000",
    "Undang-Undang Perdagangan Elektronik Tahun 2000",
    "Akta Perdagangan Elektronik 2000",
)

ITEMS["PH-H037"] = (
    "Luật Cộng hòa số 8792 (Đạo luật Thương mại Điện tử)",
    "รัฐบัญญัติฉบับที่ 8792 (พระราชบัญญัติพาณิชย์อิเล็กทรอนิกส์)",
    "Undang-Undang Republik Nomor 8792 (Undang-Undang Perdagangan Elektronik)",
    "Akta Republik Nombor 8792 (Akta Perdagangan Elektronik)",
)

ITEMS["PH-H4532"] = dev_auth("Samar Đông")

ITEMS["PH-H5266"] = (
    "Đạo luật về Thanh tra Quốc hội năm 1989",
    "พระราชบัญญัติผู้ตรวจการแผ่นดิน ค.ศ. 1989",
    "Undang-Undang tentang Ombudsman Tahun 1989",
    "Akta tentang Ombudsman 1989",
)

ITEMS["PH-H5793"] = (
    "Đại Hiến chương Nhân viên Y tế Công cộng",
    "มหากฎบัตรบุคลากรสาธารณสุข",
    "Piagam Agung Tenaga Kesehatan Masyarakat",
    "Piagam Agung Kakitangan Kesihatan Awam",
)

ITEMS["PH-H7831"] = (
    "Đạo luật sửa đổi Luật Cộng hòa số 8436",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ 8436",
    "Undang-Undang Perubahan atas Undang-Undang Republik Nomor 8436",
    "Akta Pindaan kepada Akta Republik Nombor 8436",
)

ITEMS["PH-H816"] = (
    "Đạo luật thành lập thủ phủ mới của tỉnh Cavite và ban hành Hiến chương cho thủ phủ này",
    "พระราชบัญญัติจัดตั้งเมืองหลวงใหม่ของจังหวัด Cavite และกำหนดกฎบัตรสำหรับเมืองหลวงนั้น",
    "Undang-Undang membentuk ibu kota baru Provinsi Cavite dan menetapkan piagam bagi ibu kota tersebut",
    "Akta menubuhkan ibu kota baharu Wilayah Cavite dan menetapkan piagam bagi ibu kota tersebut",
)

ITEMS["PH-H9053"] = (
    "Đạo luật thúc đẩy cơ giới hóa nông nghiệp và thủy sản trong nước",
    "พระราชบัญญัติส่งเสริมการใช้เครื่องจักรกลการเกษตรและการประมงของประเทศ",
    "Undang-Undang mendorong mekanisasi pertanian dan perikanan nasional",
    "Akta menggalakkan mekanisasi pertanian dan perikanan negara",
)

ITEMS["PH-H9063"] = (
    "Đạo luật tăng cường hệ thống quản lý an toàn thực phẩm quốc gia nhằm bảo vệ sức khỏe người tiêu dùng và tạo thuận lợi cho việc tiếp cận thị trường của thực phẩm và sản phẩm thực phẩm trong nước",
    "พระราชบัญญัติเสริมสร้างระบบกำกับดูแลความปลอดภัยอาหารแห่งชาติเพื่อคุ้มครองสุขภาพผู้บริโภคและอำนวยความสะดวกในการเข้าถึงตลาดของอาหารและผลิตภัณฑ์อาหารในประเทศ",
    "Undang-Undang memperkuat sistem pengawasan keamanan pangan nasional untuk melindungi kesehatan konsumen dan memfasilitasi akses pasar pangan dan produk pangan lokal",
    "Akta memperkukuh sistem pengawasan keselamatan makanan kebangsaan untuk melindungi kesihatan pengguna dan memudahkan akses pasaran makanan dan produk makanan tempatan",
)

ITEMS["PH-H10640"] = (
    "Đạo luật thể chế hóa việc chuyển đổi sang chính phủ điện tử, tăng cường Học viện ICT và phân bổ ngân sách",
    "พระราชบัญญัติสถาปนาการเปลี่ยนผ่านสู่รัฐบาลอิเล็กทรอนิกส์ เสริมสร้างสถาบัน ICT และจัดสรรงบประมาณ",
    "Undang-Undang melembagakan transformasi menuju pemerintahan elektronik, memperkuat Akademi TIK, dan mengalokasikan anggaran",
    "Akta memperinstitusikan transformasi ke arah kerajaan elektronik, memperkukuh Akademi ICT dan memperuntukkan wang",
)

ITEMS["PH-H10641"] = (
    "Đạo luật tuyên bố Học viện Hàng không Philippines là cơ sở chuyên ngành hàng không quốc gia và đổi tên thành Học viện Hàng không Quốc gia Philippines",
    "พระราชบัญญัติประกาศให้สถาบันการบินฟิลิปปินส์เป็นสถาบันวิชาชีพการบินแห่งชาติ และเปลี่ยนชื่อเป็นสถาบันการบินแห่งชาติฟิลิปปินส์",
    "Undang-Undang menyatakan Institut Penerbangan Filipina sebagai lembaga profesi penerbangan nasional dan mengubah namanya menjadi Institut Penerbangan Nasional Filipina",
    "Akta mengisytiharkan Institut Penerbangan Filipina sebagai institusi profesional penerbangan kebangsaan dan menukar namanya kepada Institut Penerbangan Kebangsaan Filipina",
)

ITEMS["PH-H4704"] = (
    "Đạo luật thành lập Chương trình Chăm sóc Y tế Philippines và Hội đồng Chăm sóc Y tế Philippines, quy định nhiệm vụ, quyền hạn và chức năng của các cơ quan này",
    "พระราชบัญญัติจัดตั้งโครงการการดูแลทางการแพทย์ฟิลิปปินส์และคณะกรรมการการดูแลทางการแพทย์ฟิลิปปินส์ กำหนดหน้าที่ อำนาจ และหน้าที่ความรับผิดชอบ",
    "Undang-Undang membentuk Program Perawatan Medis Filipina dan Dewan Perawatan Medis Filipina, menetapkan tugas, wewenang, dan fungsinya",
    "Akta menubuhkan Program Penjagaan Perubatan Filipina dan Majlis Penjagaan Perubatan Filipina, menetapkan tugas, kuasa dan fungsinya",
)

ITEMS["PH-H7615"] = (
    "Đạo luật Bảo tồn và Bảo vệ Tài nguyên Động Thực vật Hoang dã",
    "พระราชบัญญัติการอนุรักษ์และคุ้มครองทรัพยากรสัตว์ป่าและพืชป่า",
    "Undang-Undang Konservasi dan Perlindungan Sumber Daya Satwa dan Tumbuhan Liar",
    "Akta Pemuliharaan dan Perlindungan Sumber Hidupan dan Tumbuhan Liar",
)

ITEMS["PH-H7677"] = (
    "Đạo luật quy định việc đóng gói, sử dụng, bán, phân phối và quảng cáo các sản phẩm thuốc lá",
    "พระราชบัญญัติกำหนดการบรรจุ การใช้ การขาย การจำหน่าย และการโฆษณาผลิตภัณฑ์ยาสูบ",
    "Undang-Undang mengatur pengemasan, penggunaan, penjualan, distribusi, dan iklan produk tembakau",
    "Akta mengawal selia pembungkusan, penggunaan, penjualan, pengedaran dan pengiklanan produk tembakau",
)

ITEMS["PH-H8481"] = practice("Liệu pháp Hô hấp", "เวชบำบัดระบบหายใจ", "Terapi Pernapasan", "Terapi Pernafasan")

ITEMS["PH-H8486"] = (
    "Đạo luật Tâm lý học Philippines năm 2009",
    "พระราชบัญญัติจิตวิทยาฟิลิปปินส์ ค.ศ. 2009",
    "Undang-Undang Psikologi Filipina Tahun 2009",
    "Akta Psikologi Filipina 2009",
)

ITEMS["PH-H8803"] = (
    "Đạo luật Quy định và Hiện đại hóa Hành nghề Thiết kế Nội thất",
    "พระราชบัญญัติกำกับและปรับปรุงการประกอบวิชาชีพการออกแบบภายในให้ทันสมัย",
    "Undang-Undang Pengaturan dan Modernisasi Praktik Desain Interior",
    "Akta Pengawalseliaan dan Pemodenan Amalan Reka Bentuk Dalaman",
)

ITEMS["PH-H9148"] = (
    "Đạo luật Quy định và Hiện đại hóa Hành nghề Thiết kế Tàu biển",
    "พระราชบัญญัติกำกับและปรับปรุงการประกอบวิชาชีพการออกแบบเรือให้ทันสมัย",
    "Undang-Undang Pengaturan dan Modernisasi Praktik Desain Kapal",
    "Akta Pengawalseliaan dan Pemodenan Amalan Reka Bentuk Kapal",
)

ITEMS["PH-H10122"] = (
    "Đạo luật tuyên bố Đại học Bang Batangas là đại học kỹ thuật quốc gia và phân bổ ngân sách",
    "พระราชบัญญัติประกาศให้มหาวิทยาลัยรัฐ Batangas เป็นมหาวิทยาลัยวิศวกรรมศาสตร์แห่งชาติ และจัดสรรงบประมาณ",
    "Undang-Undang menyatakan Universitas Negeri Batangas sebagai universitas teknik nasional dan mengalokasikan anggaran",
    "Akta mengisytiharkan Universiti Negeri Batangas sebagai universiti kejuruteraan kebangsaan dan memperuntukkan wang",
)

ITEMS["PH-H10290"] = (
    "Đạo luật Chống Buôn bán Người năm 2003",
    "พระราชบัญญัติต่อต้านการค้ามนุษย์ ค.ศ. 2003",
    "Undang-Undang Pemberantasan Perdagangan Orang Tahun 2003",
    "Akta Anti-Pemerdagangan Orang 2003",
)

ITEMS["PH-H336"] = (
    "Đạo luật sửa đổi một số điều khoản của Luật Liên bang số 408, tức Các Điều khoản Chiến tranh",
    "พระราชบัญญัติแก้ไขบางมาตราแห่งรัฐบัญญัติสหพันธรัฐฉบับที่ 408 หรือข้อกำหนดการสงคราม",
    "Undang-Undang mengubah beberapa ketentuan Undang-Undang Federal Nomor 408, yaitu Artikel Perang",
    "Akta meminda beberapa peruntukan Akta Persekutuan Nombor 408, iaitu Perkara Perang",
)

ITEMS["PH-H4635"] = dev_auth("Sulu", corp=True)

ITEMS["PH-H5212"] = (
    "Đạo luật mở rộng bảo hộ lao động, tăng cường quyền tự tổ chức, thương lượng tập thể và hành động tập thể hòa bình của người lao động, tổ chức lại Ủy ban Quan hệ Lao động Quốc gia, sửa đổi Sắc lệnh Tổng thống số 442",
    "พระราชบัญญัติขยายความคุ้มครองแรงงาน เสริมสร้างสิทธิในการรวมตัว การเจรจาต่อรองร่วม และการดำเนินการร่วมแบบสันติ ปรับโครงสร้างคณะกรรมการแรงงานสัมพันธ์แห่งชาติ แก้ไขพระราชกฤษฎีกาประธานาธิบดีฉบับที่ 442",
    "Undang-Undang memperluas perlindungan tenaga kerja, memperkuat hak pekerja untuk berserikat, berunding bersama, dan bertindak bersama secara damai, mereorganisasi Komisi Hubungan Perburuhan Nasional, mengubah Keputusan Presiden Nomor 442",
    "Akta memperluas perlindungan buruh, memperkukuh hak pekerja untuk berpersatuan, berunding secara kolektif dan bertindak bersama secara aman, menyusun semula Suruhanjaya Hubungan Perburuhan Kebangsaan, meminda Dekri Presiden Nombor 442",
)

ITEMS["PH-H536"] = practice("Kiến trúc", "สถาปัตยกรรม", "Arsitektur", "Seni Bina")

ITEMS["PH-H5654"] = (
    "Đạo luật quy định bầu cử đồng bộ cấp quốc gia và địa phương và cải cách bầu cử, ủy quyền phân bổ ngân sách",
    "พระราชบัญญัติกำหนดการเลือกตั้งทั่วไปและท้องถิ่นพร้อมกันและการปฏิรูปการเลือกตั้ง อนุมัติงบประมาณ",
    "Undang-Undang mengatur pemilihan serentak nasional dan lokal serta reformasi pemilu, memberikan kewenangan pengalokasian anggaran",
    "Akta mengatur pilihan raya serentak kebangsaan dan tempatan serta pembaharuan pilihan raya, membenarkan peruntukan wang",
)

ITEMS["PH-H7232"] = (
    "Đạo luật về Tổng công ty Bảo lãnh Nhà ở năm 2000",
    "พระราชบัญญัติบรรษัทค้ำประกันที่อยู่อาศัย ค.ศ. 2000",
    "Undang-Undang Perusahaan Penjaminan Perumahan Tahun 2000",
    "Akta Perbadanan Jaminan Perumahan 2000",
)

ITEMS["PH-H7640"] = (
    "Đạo luật Điều dưỡng Philippines năm 1991",
    "พระราชบัญญัติการพยาบาลฟิลิปปินส์ ค.ศ. 1991",
    "Undang-Undang Keperawatan Filipina Tahun 1991",
    "Akta Kejururawatan Filipina 1991",
)

ITEMS["PH-H7945"] = practice("Nha khoa", "ทันตกรรม", "Kedokteran Gigi", "Pergigian")

ITEMS["PH-H7973"] = (
    "Đạo luật Năng lượng Tái tạo năm 2008",
    "พระราชบัญญัติพลังงานทดแทน ค.ศ. 2008",
    "Undang-Undang Energi Terbarukan Tahun 2008",
    "Akta Tenaga Boleh Diperbaharui 2008",
)

ITEMS["PH-H9691"] = (
    "Đạo luật Quy định Hành nghề Bệnh học Ngôn ngữ và Lời nói tại Philippines",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพพยาธิวิทยาทางภาษาและการพูดในฟิลิปปินส์",
    "Undang-Undang Pengaturan Praktik Patologi Bahasa dan Wicara di Filipina",
    "Akta Pengawalseliaan Amalan Patologi Bahasa dan Pertuturan di Filipina",
)

ITEMS["PH-H9718"] = (
    "Đạo luật thể chế hóa hiệu quả và tiết kiệm năng lượng, nâng cao hiệu quả sử dụng năng lượng và dành ưu đãi cho các dự án hiệu quả năng lượng",
    "พระราชบัญญัติสถาปนาการใช้พลังงานอย่างมีประสิทธิภาพและการประหยัดพลังงาน เพิ่มประสิทธิภาพการใช้พลังงาน และให้สิ่งจูงใจแก่โครงการพลังงาน",
    "Undang-Undang melembagakan efisiensi dan konservasi energi, meningkatkan efisiensi penggunaan energi, dan memberikan insentif bagi proyek efisiensi energi",
    "Akta memperinstitusikan kecekapan dan pemuliharaan tenaga, meningkatkan kecekapan penggunaan tenaga dan memberikan insentif kepada projek kecekapan tenaga",
)

ITEMS["PH-H9746"] = (
    "Đạo luật xác định hành vi quấy rối tình dục trên đường phố, nơi công cộng, không gian mạng, nơi làm việc và cơ sở giáo dục hoặc đào tạo, quy định biện pháp bảo vệ và hình phạt",
    "พระราชบัญญัติกำหนดการล่วงละเมิดทางเพศบนถนน สถานที่สาธารณะ ไซเบอร์สเปซ สถานที่ทำงาน และสถานศึกษา กำหนดมาตรการคุ้มครองและโทษ",
    "Undang-Undang menetapkan Pelecehan Seksual di Jalanan, Ruang Publik, Dunia Maya, Tempat Kerja, dan Lembaga Pendidikan atau Pelatihan, mengatur perlindungan dan sanksi",
    "Akta menetapkan Gangguan Seksual di Jalanan, Ruang Awam, Ruang Siber, Tempat Kerja dan Institusi Pendidikan atau Latihan, mengatur perlindungan dan hukuman",
)

ITEMS["PH-H10395"] = (
    "Đạo luật cải cách thẩm định và đánh giá bất động sản tại Philippines, tổ chức lại Cục Ngân sách Chính quyền Địa phương, dành ân xá thuế bất động sản và khoản thu đặc biệt",
    "พระราชบัญญัติปฏิรูปการประเมินและกำหนดมูลค่าอสังหาริมทรัพย์ในฟิลิปปินส์ ปรับโครงสร้างสำนักงบประมาณการปกครองท้องถิ่น ให้การนิรโทษภาษีอสังหาริมทรัพย์และการจัดเก็บพิเศษ",
    "Undang-Undang reformasi penilaian dan penetapan nilai properti di Filipina, mereorganisasi Biro Anggaran Pemerintah Daerah, memberikan amnesti pajak properti dan pungutan khusus",
    "Akta pembaharuan penilaian dan penetapan nilai hartanah di Filipina, menyusun semula Biro Belanjawan Kerajaan Tempatan, memberikan pengampunan cukai hartanah dan kutipan khas",
)

OUT = {
    "batch": "ph-p1-b06",
    "scope": "PH 条文数 30–99 段第 121–180 部（以 en 为语义基准）",
    "items": {k: {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]} for k, v in ITEMS.items()},
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b06.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(json.dumps(OUT, ensure_ascii=False, indent=1))
print("写入", dst, "部数", len(OUT["items"]))
