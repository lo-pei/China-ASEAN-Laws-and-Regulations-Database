# -*- coding: utf-8 -*-
"""PH 批次 6：条文数 30–99 段第 241–314 部（共 74 部，四语，以 en 为语义基准）。"""
import io, json, os

def newcity(c):
    return ("Đạo luật thành lập Thành phố %s" % c, "พระราชบัญญัติจัดตั้งเมือง %s" % c,
            "Undang-Undang membentuk Kota %s" % c, "Akta mewujudkan Bandaraya %s" % c)

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

ITEMS = {}

ITEMS["PH-H3679"] = (
    "Đạo luật thành lập Cơ quan Cảng Cagayan de Oro, xác định quyền hạn và chức năng",
    "พระราชบัญญัติจัดตั้งสำนักงานท่าเรือ Cagayan de Oro กำหนดอำนาจและหน้าที่",
    "Undang-Undang membentuk Otoritas Pelabuhan Cagayan de Oro, menetapkan wewenang dan fungsinya",
    "Akta menubuhkan Pihak Berkuasa Pelabuhan Cagayan de Oro, menetapkan kuasa dan fungsinya",
)

ITEMS["PH-H3706"] = (
    "Đạo luật thành lập Công ty Phát triển Bicol, xác định quyền hạn, chức năng và nhiệm vụ",
    "พระราชบัญญัติจัดตั้งบรรษัทพัฒนาการ Bicol กำหนดอำนาจ หน้าที่ และความรับผิดชอบ",
    "Undang-Undang membentuk Perusahaan Pembangunan Bicol, menetapkan wewenang, fungsi, dan tugasnya",
    "Akta menubuhkan Perbadanan Pembangunan Bicol, menetapkan kuasa, fungsi dan tanggungjawabnya",
)

ITEMS["PH-H5143"] = (
    "Đạo luật Cải cách Bầu cử năm 1987",
    "พระราชบัญญัติปฏิรูปการเลือกตั้ง ค.ศ. 1987",
    "Undang-Undang Reformasi Pemilihan Tahun 1987",
    "Akta Pembaharuan Pilihan Raya 1987",
)

ITEMS["PH-H5438"] = (
    "Đạo luật hợp nhất và nâng cao phúc lợi cho cựu chiến binh và người phụ thuộc",
    "พระราชบัญญัติรวบรวมและยกระดับสวัสดิการทหารผ่านศึกและผู้อยู่ในอุปการะ",
    "Undang-Undang menghimpun dan meningkatkan kesejahteraan veteran militer dan tanggungannya",
    "Akta menghimpunkan dan meningkatkan kebajikan veteran tentera dan tanggungan mereka",
)

ITEMS["PH-H5881"] = (
    "Đạo luật tổ chức lại Hội đồng Quỹ Bảo lãnh Quedan, đổi tên thành Công ty Bảo lãnh Quedan và Tín dụng Nông thôn, mở rộng quyền hạn và nguồn lực để hỗ trợ nông dân và doanh nghiệp nông thôn",
    "พระราชบัญญัติปรับโครงสร้างคณะกรรมการกองทุนค้ำประกัน Quedan เปลี่ยนชื่อเป็นบรรษัทค้ำประกัน Quedan และสินเชื่อชนบท ขยายอำนาจและทรัพยากรเพื่อสนับสนุนเกษตรกรและวิสาหกิจชนบท",
    "Undang-Undang mereorganisasi Dewan Dana Penjaminan Quedan, mengubah nama menjadi Perusahaan Penjaminan Quedan dan Kredit Pedesaan, memperluas wewenang dan sumber daya untuk mendukung petani dan usaha pedesaan",
    "Akta menyusun semula Majlis Dana Jaminan Quedan, menukar nama kepada Perbadanan Jaminan Quedan dan Kredit Luar Bandar, memperluas kuasa dan sumber untuk menyokong petani dan perusahaan luar bandar",
)

ITEMS["PH-H7029"] = (
    "Đạo luật Kỹ thuật Nông nghiệp Philippines năm 1998",
    "พระราชบัญญัติวิศวกรรมเกษตรฟิลิปปินส์ ค.ศ. 1998",
    "Undang-Undang Teknik Pertanian Filipina Tahun 1998",
    "Akta Kejuruteraan Pertanian Filipina 1998",
)

ITEMS["PH-H720"] = practice("Điều dưỡng", "การพยาบาล", "Keperawatan", "Kejururawatan")

ITEMS["PH-H8158"] = (
    "Đạo luật tăng cường Chương trình Cải cách Nông nghiệp Toàn diện (CARP), gia hạn việc thu hồi và phân phối mọi đất nông nghiệp, thực hiện các cải cách cần thiết, sửa đổi Luật Cộng hòa số 6657",
    "พระราชบัญญัติเสริมสร้างโครงการปฏิรูปเกษตรกรรมแบบครบวงจร (CARP) ขยายระยะเวลาการได้มาและการจัดสรรที่ดินเกษตรทั้งหมด ดำเนินการปฏิรูปที่จำเป็น แก้ไขรัฐบัญญัติฉบับที่ 6657",
    "Undang-Undang memperkuat Program Reforma Agraria Komprehensif (CARP), memperpanjang perolehan dan distribusi seluruh tanah pertanian, melaksanakan reformasi yang diperlukan, mengubah Undang-Undang Republik Nomor 6657",
    "Akta memperkukuh Program Pembaharuan Agraria Komprehensif (CARP), melanjutkan pemerolehan dan pengagihan semua tanah pertanian, melaksanakan pembaharuan yang perlu, meminda Akta Republik Nombor 6657",
)

ITEMS["PH-H8805"] = (
    "Đạo luật xác định và trừng phạt hành vi cưỡng bức mất tích",
    "พระราชบัญญัติกำหนดและลงโทษการบังคับให้บุคคลสูญหาย",
    "Undang-Undang menetapkan dan menghukum tindak pidana penghilangan orang secara paksa",
    "Akta menetapkan dan menghukum kehilangan orang secara paksa",
)

ITEMS["PH-H9644"] = (
    "Đạo luật An sinh Xã hội năm 1997",
    "พระราชบัญญัติประกันสังคม ค.ศ. 1997",
    "Undang-Undang Jaminan Sosial Tahun 1997",
    "Akta Keselamatan Sosial 1997",
)

ITEMS["PH-H007"] = (
    "Đạo luật Trọng tài",
    "พระราชบัญญัติอนุญาโตตุลาการ",
    "Undang-Undang Arbitrase",
    "Akta Timbang Tara",
)

ITEMS["PH-H040"] = (
    "Luật Cộng hòa số 876 (Đạo luật Trọng tài)",
    "รัฐบัญญัติฉบับที่ 876 (พระราชบัญญัติอนุญาโตตุลาการ)",
    "Undang-Undang Republik Nomor 876 (Undang-Undang Arbitrase)",
    "Akta Republik Nombor 876 (Akta Timbang Tara)",
)

ITEMS["PH-H10027"] = (
    "Đạo luật thành lập Ngân hàng Cựu chiến binh Philippines",
    "พระราชบัญญัติจัดตั้งธนาคารทหารผ่านศึกฟิลิปปินส์",
    "Undang-Undang membentuk Bank Veteran Filipina",
    "Akta menubuhkan Bank Veteran Filipina",
)

ITEMS["PH-H10694"] = (
    "Đạo luật nâng cao phát triển và năng lực cạnh tranh của ngành chăn nuôi, tăng cường Cục Chăn nuôi, thành lập Quỹ Nâng cao Năng lực Cạnh tranh Chăn nuôi",
    "พระราชบัญญัติยกระดับการพัฒนาและความสามารถในการแข่งขันของอุตสาหกรรมปศุสัตว์ เสริมสร้างกรมปศุสัตว์ จัดตั้งกองทุนเสริมสร้างความสามารถในการแข่งขันปศุสัตว์",
    "Undang-Undang meningkatkan pengembangan dan daya saing industri peternakan, memperkuat Direktorat Jenderal Peternakan, membentuk Dana Peningkatan Daya Saing Peternakan",
    "Akta meningkatkan pembangunan dan daya saing industri ternakan, memperkukuh Jabatan Penternakan, menubuhkan Dana Peningkatan Daya Saing Ternakan",
)

ITEMS["PH-H1184"] = APPR

ITEMS["PH-H2114"] = (
    "Đạo luật Y tế năm 1959",
    "พระราชบัญญัติการแพทย์ ค.ศ. 1959",
    "Undang-Undang Kedokteran Tahun 1959",
    "Akta Perubatan 1959",
)

ITEMS["PH-H412"] = (
    "Đạo luật Kỹ thuật Hóa học",
    "พระราชบัญญัติวิศวกรรมเคมี",
    "Undang-Undang Teknik Kimia",
    "Akta Kejuruteraan Kimia",
)

ITEMS["PH-H4326"] = (
    "Đạo luật yêu cầu đăng ký kỹ thuật viên y tế và xác định hành nghề của họ",
    "พระราชบัญญัติกำหนดให้เทคนิคการแพทย์ต้องขึ้นทะเบียน และกำหนดการประกอบวิชาชีพ",
    "Undang-Undang mewajibkan pendaftaran teknisi medis dan menetapkan praktiknya",
    "Akta mewajibkan pendaftaran juruteknik perubatan dan menetapkan amalannya",
)

ITEMS["PH-H5841"] = (
    "Đạo luật Nông thôn năm 1992",
    "พระราชบัญญัติชนบท ค.ศ. 1992",
    "Undang-Undang Pedesaan Tahun 1992",
    "Akta Luar Bandar 1992",
)

ITEMS["PH-H6386"] = (
    "Đạo luật quy định việc thành lập và hoạt động của ngân hàng tiết kiệm",
    "พระราชบัญญัติกำหนดการจัดตั้งและการดำเนินงานของธนาคารออมสิน",
    "Undang-Undang mengatur pendirian dan pengoperasian bank tabungan",
    "Akta mengawal selia penubuhan dan pengendalian bank simpanan",
)

ITEMS["PH-H759"] = (
    "Đạo luật quy định quản lý đường bộ hiệu quả, sửa đổi việc phân bổ quỹ đường bộ và hỗ trợ các tỉnh, thành phố được hiến chương và thị xã xây dựng đường và phố",
    "พระราชบัญญัติกำหนดการบริหารทางหลวงที่มีประสิทธิภาพ แก้ไขการจัดสรรกองทุนทางหลวง และให้ความช่วยเหลือจังหวัด เมืองที่มีกฎบัตร และเทศบาลในการก่อสร้างถนนและตรอก",
    "Undang-Undang mengatur administrasi jalan yang efektif, mengubah pembagian dana jalan, dan memberikan bantuan kepada provinsi, kota berpiagam, dan kotamadya dalam pembangunan jalan dan gang",
    "Akta mengatur pentadbiran jalan yang berkesan, meminda pembahagian dana jalan, dan memberi bantuan kepada wilayah, bandar berpiagam dan perbandaran dalam pembinaan jalan dan lorong",
)

ITEMS["PH-H7656"] = (
    "Đạo luật Bỏ phiếu Vắng mặt Ở nước ngoài năm 2003",
    "พระราชบัญญัติการลงคะแนนเสียงจากต่างประเทศ ค.ศ. 2003",
    "Undang-Undang Pemungutan Suara di Luar Negeri Tahun 2003",
    "Akta Pengundian Luar Negara 2003",
)

ITEMS["PH-H8186"] = newcity("Mariveles")

ITEMS["PH-H8525"] = (
    "Đạo luật Nông nghiệp Hữu cơ năm 2010",
    "พระราชบัญญัติเกษตรกรรมอินทรีย์ ค.ศ. 2010",
    "Undang-Undang Pertanian Organik Tahun 2010",
    "Akta Pertanian Organik 2010",
)

ITEMS["PH-H8620"] = (
    "Đạo luật tăng cường và mở rộng chăm sóc nuôi dưỡng thay thế",
    "พระราชบัญญัติเสริมสร้างและขยายการดูแลแบบอุปถัมภ์",
    "Undang-Undang memperkuat dan memperluas pengasuhan asuh",
    "Akta memperkukuh dan memperluas penjagaan angkat",
)

ITEMS["PH-H8824"] = (
    "Đạo luật sửa đổi Bộ luật Sở hữu Trí tuệ",
    "พระราชบัญญัติแก้ไขประมวลกฎหมายทรัพย์สินทางปัญญา",
    "Undang-Undang Perubahan atas Kitab Undang-Undang Kekayaan Intelektual",
    "Akta Pindaan kepada Kanun Undang-Undang Harta Intelek",
)

ITEMS["PH-H9726"] = (
    "Đạo luật đưa đổi mới sáng tạo thành thành tố quan trọng của chính sách phát triển quốc gia nhằm thúc đẩy phát triển bao trùm, tăng trưởng doanh nghiệp siêu nhỏ, nhỏ và vừa và năng lực cạnh tranh quốc gia",
    "พระราชบัญญัติกำหนดให้นวัตกรรมเป็นองค์ประกอบสำคัญของนโยบายการพัฒนาชาติ เพื่อส่งเสริมการพัฒนาแบบทั่วถึง การเติบโตของวิสาหกิจขนาดย่อม ขนาดเล็ก และขนาดกลาง และความสามารถในการแข่งขันของชาติ",
    "Undang-Undang menetapkan inovasi sebagai komponen penting kebijakan pembangunan nasional untuk mendorong pembangunan inklusif, pertumbuhan usaha mikro, kecil, dan menengah, serta daya saing nasional",
    "Akta menetapkan inovasi sebagai komponen penting dasar pembangunan negara untuk menggalakkan pembangunan inklusif, pertumbuhan perusahaan mikro, kecil dan sederhana serta daya saing negara",
)

ITEMS["PH-H9954"] = (
    "Đạo luật bảo đảm khả năng phục hồi của ngành tài chính Philippines trước đại dịch COVID-19",
    "พระราชบัญญัติรับประกันความยืดหยุ่นของภาคการเงินฟิลิปปินส์ต่อการระบาดของโควิด-19",
    "Undang-Undang menjamin ketahanan sektor keuangan Filipina terhadap pandemi COVID-19",
    "Akta menjamin ketahanan sektor kewangan Filipina terhadap pandemik COVID-19",
)

ITEMS["PH-H996"] = (
    "Đạo luật thiết lập hệ thống an sinh xã hội cung cấp trợ cấp ốm đau, thất nghiệp, hưu trí, khuyết tật và tử tuất cho người lao động",
    "พระราชบัญญัติจัดตั้งระบบประกันสังคมที่ให้ประโยชน์กรณีเจ็บป่วย ว่างงาน ชราภาพ ทุพพลภาพ และเสียชีวิตแก่ลูกจ้าง",
    "Undang-Undang membentuk sistem jaminan sosial yang memberikan tunjangan sakit, pengangguran, pensiun, cacat, dan kematian bagi pekerja",
    "Akta menubuhkan sistem keselamatan sosial yang memberikan faedah sakit, pengangguran, persaraan, hilang upaya dan kematian kepada pekerja",
)

ITEMS["PH-H039"] = (
    "Đạo luật Phòng chống Tội phạm Mạng năm 2012",
    "พระราชบัญญัติป้องกันอาชญากรรมทางไซเบอร์ ค.ศ. 2012",
    "Undang-Undang Pencegahan Kejahatan Siber Tahun 2012",
    "Akta Pencegahan Jenayah Siber 2012",
)

ITEMS["PH-H10069"] = (
    "Đạo luật thành lập Bộ Người lao động Di trú, xác định quyền hạn và chức năng, sắp xếp lại tổ chức và chức năng của các cơ quan liên quan đến việc làm ở nước ngoài và di cư lao động",
    "พระราชบัญญัติจัดตั้งกระทรวงแรงงานต่างด้าว กำหนดอำนาจและหน้าที่ ปรับโครงสร้างองค์กรและหน้าที่ของหน่วยงานที่เกี่ยวข้องกับการจ้างงานต่างประเทศและการย้ายถิ่นแรงงาน",
    "Undang-Undang membentuk Kementerian Pekerja Migran, menetapkan wewenang dan fungsinya, menata ulang organisasi dan fungsi lembaga terkait ketenagakerjaan luar negeri dan migrasi tenaga kerja",
    "Akta menubuhkan Kementerian Pekerja Migran, menetapkan kuasa dan fungsinya, menyusun semula organisasi dan fungsi agensi berkaitan pekerjaan luar negara dan migrasi buruh",
)

ITEMS["PH-H10360"] = (
    "Đạo luật thiết lập chính sách bảo vệ và phúc lợi cho người hành nghề chăm sóc",
    "พระราชบัญญัติกำหนดนโยบายคุ้มครองและสวัสดิการของผู้ประกอบวิชาชีพการดูแล",
    "Undang-Undang menetapkan kebijakan perlindungan dan kesejahteraan praktisi perawatan",
    "Akta menetapkan dasar perlindungan dan kebajikan pengamal penjagaan",
)

ITEMS["PH-H10375"] = (
    "Đạo luật tăng cường Đại học Bang Bulacan, mở rộng chương trình đào tạo và cơ cấu Hội đồng Quản trị",
    "พระราชบัญญัติเสริมสร้างมหาวิทยาลัยรัฐ Bulacan ขยายหลักสูตรและโครงสร้างคณะกรรมการบริหาร",
    "Undang-Undang memperkuat Universitas Negeri Bulacan, memperluas program studi dan komposisi Dewan Pengawas",
    "Akta memperkukuh Universiti Negeri Bulacan, memperluas program pengajian dan komposisi Lembaga Pemegang Amanah",
)

ITEMS["PH-H10676"] = (
    "Đạo luật thiết lập hệ thống nghiên cứu và phát triển phối hợp, bổ trợ về virus học và vắc-xin, thành lập Viện Virus học và Vắc-xin Philippines",
    "พระราชบัญญัติจัดตั้งระบบวิจัยและพัฒนาด้านไวรัสวิทยาและวัคซีนแบบประสานและเสริมกัน จัดตั้งสถาบันไวรัสวิทยาและวัคซีนฟิลิปปินส์",
    "Undang-Undang membentuk sistem penelitian dan pengembangan virologi dan vaksin yang terkoordinasi dan saling melengkapi, membentuk Institut Virologi dan Vaksin Filipina",
    "Akta menubuhkan sistem penyelidikan dan pembangunan virologi dan vaksin yang diselaraskan dan saling melengkapi, menubuhkan Institut Virologi dan Vaksin Filipina",
)

ITEMS["PH-H1134"] = (
    "Đạo luật sửa đổi Hiến chương Ngân hàng Quốc gia Philippines",
    "พระราชบัญญัติแก้ไขกฎบัตรธนาคารแห่งชาติฟิลิปปินส์",
    "Undang-Undang mengubah Piagam Bank Nasional Filipina",
    "Akta meminda Piagam Bank Negara Filipina",
)

ITEMS["PH-H183"] = (
    "Hiến chương Ngân hàng Phát triển Philippines",
    "กฎบัตรธนาคารเพื่อการพัฒนาฟิลิปปินส์",
    "Piagam Bank Pembangunan Filipina",
    "Piagam Bank Pembangunan Filipina",
)

ITEMS["PH-H2371"] = (
    "Đạo luật Quy định Đào tạo và Hành nghề Hộ sinh",
    "พระราชบัญญัติกำกับการฝึกอบรมและการประกอบวิชาชีพผดุงครรภ์",
    "Undang-Undang Pengaturan Pelatihan dan Praktik Kebidanan",
    "Akta Pengawalseliaan Latihan dan Amalan Kebidanan",
)

ITEMS["PH-H2954"] = ITEMS["PH-H10027"]

ITEMS["PH-H3411"] = (
    "Đạo luật Quy định Hành nghề Địa chất tại Philippines và quy định việc cấp phép, đăng ký địa chất gia",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพธรณีวิทยาในฟิลิปปินส์ และกำหนดการออกใบอนุญาตและการขึ้นทะเบียนนักธรณีวิทยา",
    "Undang-Undang Pengaturan Praktik Geologi di Filipina serta perizinan dan pendaftaran ahli geologi",
    "Akta Pengawalseliaan Amalan Geologi di Filipina serta pelesenan dan pendaftaran ahli geologi",
)

ITEMS["PH-H4325"] = (
    "Đạo luật thành lập Hội đồng Nghiên cứu Lâm sản và Phát triển Ngành",
    "พระราชบัญญัติจัดตั้งคณะกรรมการวิจัยผลิตผลป่าไม้และการพัฒนาอุตสาหกรรม",
    "Undang-Undang membentuk Dewan Penelitian Hasil Hutan dan Pengembangan Industri",
    "Akta menubuhkan Majlis Penyelidikan Hasil Hutan dan Pembangunan Industri",
)

ITEMS["PH-H4621"] = (
    "Đạo luật nâng cao tiêu chuẩn hiệu quả và công bằng trong thực thi pháp luật, bảo đảm tốt hơn quyền kiến nghị và khiếu nại của người dân đối với chính phủ, thành lập Văn phòng Cố vấn Công dân",
    "พระราชบัญญัติยกระดับมาตรฐานประสิทธิภาพและความเป็นธรรมในการบังคับใช้กฎหมาย คุ้มครองสิทธิของประชาชนในการร้องทุกข์ต่อรัฐบาลได้ดียิ่งขึ้น จัดตั้งสำนักงานที่ปรึกษาประชาชน",
    "Undang-Undang meningkatkan standar efisiensi dan keadilan dalam penegakan hukum, lebih melindungi hak masyarakat untuk menyampaikan petisi dan keluhan kepada pemerintah, membentuk Kantor Penasihat Warga",
    "Akta meningkatkan standard kecekapan dan keadilan dalam penguatkuasaan undang-undang, lebih melindungi hak rakyat untuk membuat petisyen dan aduan kepada kerajaan, menubuhkan Pejabat Penasihat Rakyat",
)

ITEMS["PH-H6842"] = (
    "Đạo luật về Hiệp hội Tiết kiệm và Cho vay Phi cổ phần (sửa đổi) năm 1997",
    "พระราชบัญญัติสมาคมออมทรัพย์และให้กู้ยืมที่ไม่มีหุ้น (ฉบับปรับปรุง) ค.ศ. 1997",
    "Undang-Undang Perhimpunan Simpan Pinjam Non-saham (Revisi) Tahun 1997",
    "Akta Persatuan Simpanan dan Pinjaman Bukan Saham (Semakan) 1997",
)

ITEMS["PH-H7593"] = (
    "Đạo luật quy định Dãy núi Sierra Madre Bắc thuộc tỉnh Isabela là khu bảo tồn và vùng đệm xung quanh, quy định việc quản lý",
    "พระราชบัญญัติกำหนดเทือกเขา Sierra Madre ตอนเหนือในจังหวัด Isabela เป็นเขตคุ้มครองและพื้นที่กันชนโดยรอบ กำหนดการบริหารจัดการ",
    "Undang-Undang menetapkan Pegunungan Sierra Madre Utara di Provinsi Isabela sebagai kawasan lindung dan zona penyangga di sekelilingnya, mengatur pengelolaannya",
    "Akta menetapkan Banjaran Sierra Madre Utara di Wilayah Isabela sebagai kawasan perlindungan dan zon penampan di sekelilingnya, mengatur pengurusannya",
)

ITEMS["PH-H7649"] = (
    "Đạo luật dành ưu đãi miễn thuế và phí cho các phương tiện đầu tư đặc biệt mua lại hoặc đầu tư vào tài sản xấu, thiết lập khung quản lý",
    "พระราชบัญญัติให้สิทธิยกเว้นภาษีและค่าธรรมเนียมแก่หน่วยลงทุนเฉพาะกิจที่เข้าซื้อหรือลงทุนในสินทรัพย์ด้อยคุณภาพ กำหนดกรอบการกำกับดูแล",
    "Undang-Undang memberikan pembebasan pajak dan biaya bagi kendaraan tujuan khusus yang membeli atau menginvestasikan aset bermasalah, menetapkan kerangka pengaturan",
    "Akta memberikan pengecualian cukai dan fi kepada kenderaan tujuan khas yang membeli atau melabur dalam aset bermasalah, menetapkan kerangka pengawalseliaan",
)

ITEMS["PH-H7674"] = (
    "Đạo luật Chống Buôn bán Người năm 2003",
    "พระราชบัญญัติต่อต้านการค้ามนุษย์ ค.ศ. 2003",
    "Undang-Undang Pemberantasan Perdagangan Orang Tahun 2003",
    "Akta Anti-Pemerdagangan Orang 2003",
)

ITEMS["PH-H7703"] = newcity("Kidapawan")

ITEMS["PH-H7960"] = (
    "Hiến chương Đại học Philippines năm 2008",
    "กฎบัตรมหาวิทยาลัยฟิลิปปินส์ ค.ศ. 2008",
    "Piagam Universitas Filipina Tahun 2008",
    "Piagam Universiti Filipina 2008",
)

ITEMS["PH-H8137"] = (
    "Đạo luật tăng cường hơn nữa Quỹ Tương hỗ Phát triển Nhà ở",
    "พระราชบัญญัติเสริมสร้างกองทุนร่วมเพื่อการพัฒนาที่อยู่อาศัยให้เข้มแข็งยิ่งขึ้น",
    "Undang-Undang lebih memperkuat Dana Bersama Pembangunan Perumahan",
    "Akta lebih memperkukuh Dana Bersama Pembangunan Perumahan",
)

ITEMS["PH-H8820"] = (
    "Đạo luật quy định việc bồi thường và công nhận đối với nạn nhân vi phạm nhân quyền dưới chế độ Marcos, ghi nhận các vi phạm đó",
    "พระราชบัญญัติกำหนดการชดเชยและการยอมรับต่อผู้เสียหายจากการละเมิดสิทธิมนุษยชนในยุค Marcos และบันทึกการละเมิดดังกล่าว",
    "Undang-Undang mengatur kompensasi dan pengakuan bagi korban pelanggaran HAM pada masa rezim Marcos, mencatat pelanggaran tersebut",
    "Akta mengatur pampasan dan pengiktirafan bagi mangsa pelanggaran hak asasi manusia pada era rejim Marcos, merekodkan pelanggaran tersebut",
)

ITEMS["PH-H9137"] = (
    "Đạo luật quy định Hệ thống Tài trợ Thống nhất Toàn diện cho Sinh viên Giáo dục Đại học (UniFAST) và sắp xếp việc tiếp cận",
    "พระราชบัญญัติกำหนดระบบทุนสนับสนุนแบบครบวงจรและเป็นเอกภาพสำหรับนักศึกษาอุดมศึกษา (UniFAST) และปรับปรุงการเข้าถึง",
    "Undang-Undang menetapkan Sistem Pendanaan Terpadu dan Menyeluruh bagi Mahasiswa Pendidikan Tinggi (UniFAST) serta menata aksesnya",
    "Akta menetapkan Sistem Pembiayaan Bersepadu dan Menyeluruh bagi Pelajar Pendidikan Tinggi (UniFAST) serta menyusun aksesnya",
)

ITEMS["PH-H9318"] = (
    "Đạo luật Quy định Ngành Thẻ Tín dụng tại Philippines",
    "พระราชบัญญัติกำกับอุตสาหกรรมบัตรเครดิตในฟิลิปปินส์",
    "Undang-Undang Pengaturan Industri Kartu Kredit di Filipina",
    "Akta Pengawalseliaan Industri Kad Kredit di Filipina",
)

ITEMS["PH-H9797"] = (
    "Đạo luật tổ chức lại và tăng cường Cơ quan Phát triển Hợp tác xã, bãi bỏ Luật Cộng hòa số 6939",
    "พระราชบัญญัติปรับโครงสร้างและเสริมสร้างสำนักงานพัฒนาสหกรณ์ ยกเลิกรัฐบัญญัติฉบับที่ 6939",
    "Undang-Undang mereorganisasi dan memperkuat Otoritas Pengembangan Koperasi, mencabut Undang-Undang Republik Nomor 6939",
    "Akta menyusun semula dan memperkukuh Pihak Berkuasa Pembangunan Koperasi, memansuhkan Akta Republik Nombor 6939",
)

ITEMS["PH-H10074"] = (
    "Đạo luật thúc đẩy sử dụng hệ thống lưới điện siêu nhỏ để đẩy nhanh điện khí hóa toàn diện các khu vực chưa có điện và thiếu điện trên toàn quốc",
    "พระราชบัญญัติส่งเสริมการใช้ระบบไมโครกริดเพื่อเร่งการขยายไฟฟ้าให้ครอบคลุมพื้นที่ที่ยังไม่มีไฟฟ้าและมีไฟฟ้าไม่เพียงพอทั่วประเทศ",
    "Undang-Undang mendorong penggunaan sistem jaringan mikro untuk mempercepat elektrifikasi menyeluruh di daerah belum berlistrik dan kekurangan listrik di seluruh negeri",
    "Akta menggalakkan penggunaan sistem grid mikro untuk mempercepat pengelektrikan menyeluruh di kawasan belum berbekalan elektrik dan kekurangan elektrik di seluruh negara",
)

ITEMS["PH-H10183"] = (
    "Đạo luật chuyển đổi Cao đẳng Bách khoa Bang Ilocos Sur tại thị xã Sta. Maria, tỉnh Ilocos Sur và toàn bộ các cơ sở thành Đại học Bách khoa Bang Ilocos Sur",
    "พระราชบัญญัติเปลี่ยนวิทยาลัยโปลีเทคนิคแห่งรัฐ Ilocos Sur ในเทศบาล Sta. Maria จังหวัด Ilocos Sur และทุกวิทยาเขตเป็นมหาวิทยาลัยโปลีเทคนิคแห่งรัฐ Ilocos Sur",
    "Undang-Undang mengubah Perguruan Tinggi Politeknik Negeri Ilocos Sur di Kotamadya Sta. Maria, Provinsi Ilocos Sur dan seluruh kampusnya menjadi Universitas Politeknik Negeri Ilocos Sur",
    "Akta menukar Kolej Politeknik Negeri Ilocos Sur di Perbandaran Sta. Maria, Wilayah Ilocos Sur dan semua kampusnya menjadi Universiti Politeknik Negeri Ilocos Sur",
)

ITEMS["PH-H10328"] = (
    "Đạo luật quy định việc nhập khẩu, sản xuất, bán, đóng gói, phân phối, sử dụng và truyền thông về sản phẩm nicotine dạng hơi và sản phẩm thuốc lá mới",
    "พระราชบัญญัติกำหนดการนำเข้า การผลิต การขาย การบรรจุ การจำหน่าย การใช้ และการสื่อสารผลิตภัณฑ์นิโคตินแบบสูบไอและผลิตภัณฑ์ยาสูบรูปแบบใหม่",
    "Undang-Undang mengatur impor, produksi, penjualan, pengemasan, distribusi, penggunaan, dan komunikasi produk nikotin uap serta produk tembakau baru",
    "Akta mengawal selia import, pengeluaran, penjualan, pembungkusan, pengedaran, penggunaan dan komunikasi produk nikotin wap serta produk tembakau baharu",
)

ITEMS["PH-H10416"] = (
    "Đạo luật Chống Buôn lậu Nông sản năm 2016",
    "พระราชบัญญัติต่อต้านการลักลอบค้าผลิตผลเกษตร ค.ศ. 2016",
    "Undang-Undang Anti-Penyelundupan Produk Pertanian Tahun 2016",
    "Akta Anti-Penyeludupan Hasil Pertanian 2016",
)

ITEMS["PH-H10535"] = (
    "Đạo luật đổi tên Đại học Bang Don Honorio Ventura thành Đại học Bang Pampanga, mở rộng chương trình đào tạo và cơ cấu hội đồng",
    "พระราชบัญญัติเปลี่ยนชื่อมหาวิทยาลัยรัฐ Don Honorio Ventura เป็นมหาวิทยาลัยรัฐ Pampanga ขยายหลักสูตรและโครงสร้างคณะกรรมการ",
    "Undang-Undang mengubah nama Universitas Negeri Don Honorio Ventura menjadi Universitas Negeri Pampanga, memperluas program studi dan komposisi dewan",
    "Akta menukar nama Universiti Negeri Don Honorio Ventura kepada Universiti Negeri Pampanga, memperluas program pengajian dan komposisi lembaga",
)

ITEMS["PH-H10681"] = newcity("San Miguel")
ITEMS["PH-H10682"] = newcity("Jolo")

ITEMS["PH-H1234"] = (
    "Đạo luật xác định chính sách quyền sử dụng đất, quy định cơ quan thực hiện và phân bổ ngân sách",
    "พระราชบัญญัติกำหนดนโยบายสิทธิถือครองที่ดิน กำหนดหน่วยงานที่ดำเนินการ และจัดสรรงบประมาณ",
    "Undang-Undang menetapkan kebijakan kepemilikan tanah, menetapkan lembaga pelaksana dan mengalokasikan anggaran",
    "Akta menetapkan dasar pemilikan tanah, menetapkan agensi pelaksana dan memperuntukkan wang",
)

ITEMS["PH-H1744"] = practice("Khúc xạ Nhãn khoa", "ทัศนมาตรศาสตร์", "Optometri", "Optometri")
ITEMS["PH-H508"] = practice("Nha khoa", "ทันตกรรม", "Kedokteran Gigi", "Pergigian")

ITEMS["PH-H5456"] = (
    "Đạo luật Thư viện Philippines",
    "พระราชบัญญัติห้องสมุดฟิลิปปินส์",
    "Undang-Undang Perpustakaan Filipina",
    "Akta Perpustakaan Filipina",
)

ITEMS["PH-H5565"] = (
    "Đạo luật Khai thác Khoáng sản Quy mô Nhỏ của Nhân dân năm 1991",
    "พระราชบัญญัติการทำเหมืองแร่ขนาดเล็กโดยประชาชน ค.ศ. 1991",
    "Undang-Undang Pertambangan Rakyat Skala Kecil Tahun 1991",
    "Akta Perlombongan Rakyat Skala Kecil 1991",
)

ITEMS["PH-H5794"] = (
    "Đạo luật thành lập Mạng Truyền hình Nhân dân, xác định quyền hạn và chức năng, quy định nguồn và mục đích sử dụng kinh phí",
    "พระราชบัญญัติจัดตั้งสถานีโทรทัศน์ประชาชน กำหนดอำนาจและหน้าที่ กำหนดแหล่งที่มาและการใช้จ่ายเงิน",
    "Undang-Undang membentuk Jaringan Televisi Rakyat, menetapkan wewenang dan fungsinya, mengatur sumber dan penggunaan dana",
    "Akta menubuhkan Rangkaian Televisyen Rakyat, menetapkan kuasa dan fungsinya, mengatur sumber dan penggunaan dana",
)

ITEMS["PH-H5880"] = (
    "Đạo luật sửa đổi Luật Cộng hòa số 2644, tức Luật Hộ sinh Philippines",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ 2644 หรือพระราชบัญญัติผดุงครรภ์ฟิลิปปินส์",
    "Undang-Undang mengubah Undang-Undang Republik Nomor 2644, yaitu Undang-Undang Kebidanan Filipina",
    "Akta meminda Akta Republik Nombor 2644, iaitu Akta Kebidanan Filipina",
)

ITEMS["PH-H719"] = (
    "Đạo luật Hòa bình Lao động",
    "พระราชบัญญัติสันติภาพแรงงาน",
    "Undang-Undang Perdamaian Perburuhan",
    "Akta Keamanan Perburuhan",
)

ITEMS["PH-H8233"] = (
    "Đạo luật Chống Khiêu dâm Trẻ em năm 2009",
    "พระราชบัญญัติต่อต้านสื่อลามกอนาจารเด็ก ค.ศ. 2009",
    "Undang-Undang Anti-Pornografi Anak Tahun 2009",
    "Akta Anti-Pornografi Kanak-Kanak 2009",
)

ITEMS["PH-H8512"] = (
    "Đạo luật quy định khung và hệ thống hỗ trợ về quyền sở hữu, quản lý, khai thác và thương mại hóa sở hữu trí tuệ từ nghiên cứu và phát triển do nhà nước tài trợ",
    "พระราชบัญญัติกำหนดกรอบและระบบสนับสนุนด้านความเป็นเจ้าของ การบริหาร การใช้ประโยชน์ และการนำทรัพย์สินทางปัญญาไปใช้เชิงพาณิชย์จากการวิจัยและพัฒนาที่รัฐสนับสนุน",
    "Undang-Undang menetapkan kerangka dan sistem dukungan atas kepemilikan, pengelolaan, pemanfaatan, dan komersialisasi kekayaan intelektual dari penelitian dan pengembangan yang didanai pemerintah",
    "Akta menetapkan kerangka dan sistem sokongan pemilikan, pengurusan, penggunaan dan pengkomersialan harta intelek daripada penyelidikan dan pembangunan yang dibiayai kerajaan",
)

ITEMS["PH-H8543"] = (
    "Đạo luật đổi tên Viện Lịch sử Quốc gia thành Ủy ban Lịch sử Quốc gia Philippines và tăng cường quyền hạn, chức năng nhằm nâng cao chủ nghĩa dân tộc thông qua lịch sử Philippines",
    "พระราชบัญญัติเปลี่ยนชื่อสถาบันประวัติศาสตร์แห่งชาติเป็นคณะกรรมการประวัติศาสตร์แห่งชาติฟิลิปปินส์ และเสริมสร้างอำนาจและหน้าที่ เพื่อส่งเสริมชาตินิยมผ่านประวัติศาสตร์ฟิลิปปินส์",
    "Undang-Undang mengubah nama Institut Sejarah Nasional menjadi Komisi Sejarah Nasional Filipina serta memperkuat wewenang dan fungsinya, guna meningkatkan nasionalisme melalui sejarah Filipina",
    "Akta menukar nama Institut Sejarah Negara kepada Suruhanjaya Sejarah Negara Filipina serta memperkukuh kuasa dan fungsinya, bagi meningkatkan semangat kebangsaan melalui sejarah Filipina",
)

ITEMS["PH-H8578"] = (
    "Đạo luật Giảm nhẹ và Quản lý Rủi ro Thiên tai Philippines năm 2010",
    "พระราชบัญญัติการลดและจัดการความเสี่ยงภัยพิบัติฟิลิปปินส์ ค.ศ. 2010",
    "Undang-Undang Pengurangan dan Pengelolaan Risiko Bencana Filipina Tahun 2010",
    "Akta Pengurangan dan Pengurusan Risiko Bencana Filipina 2010",
)

ITEMS["PH-H8806"] = (
    "Đạo luật quy định chính sách quốc gia về cha mẹ có trách nhiệm và sức khỏe sinh sản năm 2012",
    "พระราชบัญญัติกำหนดนโยบายแห่งชาติว่าด้วยความเป็นพ่อแม่ที่มีความรับผิดชอบและอนามัยการเจริญพันธุ์ ค.ศ. 2012",
    "Undang-Undang menetapkan kebijakan nasional tentang orang tua bertanggung jawab dan kesehatan reproduksi Tahun 2012",
    "Akta menetapkan dasar negara tentang ibu bapa bertanggungjawab dan kesihatan reproduktif 2012",
)

ITEMS["PH-H9631"] = newcity("Tangub")

ITEMS["PH-H9658"] = (
    "Đạo luật tăng cường quản lý và thu thuế thông qua việc miễn toàn bộ thuế trong nước còn nợ, gồm thuế thừa kế, thuế trong nước khác và truy thu cho các năm tính thuế 2017 và trước đó",
    "พระราชบัญญัติเสริมสร้างการบริหารและการจัดเก็บภาษีโดยการยกเว้นภาษีภายในประเทศที่ค้างชำระทั้งหมด รวมภาษีมรดก ภาษีภายในประเทศอื่น และภาษีย้อนหลังสำหรับปีภาษี 2017 และก่อนหน้า",
    "Undang-Undang memperkuat administrasi dan pemungutan pajak melalui pengampunan seluruh pajak dalam negeri yang terutang, termasuk pajak warisan, pajak dalam negeri lainnya, dan tunggakan untuk tahun pajak 2017 dan sebelumnya",
    "Akta memperkukuh pentadbiran dan pemungutan cukai melalui pengampunan semua cukai dalam negara yang tertunggak, termasuk cukai pusaka, cukai dalam negara lain dan tunggakan bagi tahun taksiran 2017 dan sebelumnya",
)

ZH_FIX = {
    "PH-H5841": "1992年农村法",
    "PH-H719": "劳资和平法",
    "PH-H10328": "电子烟与新型烟草产品监管法",
    "PH-H10183": "南伊罗戈州立理工学院升格为州立大学法",
}

items = {}
for k, v in ITEMS.items():
    d = {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]}
    if k in ZH_FIX:
        d["zh"] = ZH_FIX[k]
    items[k] = d

OUT = {
    "batch": "ph-p1-b08",
    "scope": "PH 条文数 30–99 段第 241–314 部（74 部，含 4 条 zh 订正）",
    "items": items,
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b08.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(json.dumps(OUT, ensure_ascii=False, indent=1))
print("写入", dst, "部数", len(items))
