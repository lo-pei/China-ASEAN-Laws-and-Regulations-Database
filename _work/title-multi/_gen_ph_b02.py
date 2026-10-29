# -*- coding: utf-8 -*-
"""PH 批次 2：条文数 30–99 段的前 60 部（四语）。

模板：
- Charter of the City of X          -> Hiến chương Thành phố X / กฎบัตรเมือง X /
                                        Piagam Kota X / Piagam Bandaraya X
- 修订版                            -> 追加 (sửa đổi) / (ฉบับแก้ไข) / (Revisi) / (Semakan)
- Creating X City                   -> Đạo luật thành lập Thành phố X / พระราชบัญญัติจัดตั้งเมือง X /
                                        Undang-Undang membentuk Kota X / Akta mewujudkan Bandaraya X
"""
import io, json, os

def charter(city, revised=False):
    sfx = (" (sửa đổi)", " (ฉบับแก้ไข)", " (Revisi)", " (Semakan)") if revised else ("", "", "", "")
    return ("Hiến chương Thành phố %s%s" % (city, sfx[0]),
            "กฎบัตรเมือง %s%s" % (city, sfx[1]),
            "Piagam Kota %s%s" % (city, sfx[2]),
            "Piagam Bandaraya %s%s" % (city, sfx[3]))

def newcity(city):
    return ("Đạo luật thành lập Thành phố %s" % city,
            "พระราชบัญญัติจัดตั้งเมือง %s" % city,
            "Undang-Undang membentuk Kota %s" % city,
            "Akta mewujudkan Bandaraya %s" % city)

ITEMS = {}

ITEMS["PH-H10415"] = (
    "Đạo luật về Đại Hiến chương Thuyền viên Philippines năm 2024",
    "พระราชบัญญัติมหากฎบัตรลูกเรือฟิลิปปินส์ ค.ศ. 2024",
    "Undang-Undang Piagam Agung Pelaut Filipina Tahun 2024",
    "Akta Piagam Agung Pelaut Filipina 2024",
)

ITEMS["PH-H4301"] = (
    "Đạo luật sửa đổi Luật Cộng hòa số 3278, tức Hiến chương Thành phố Caloocan",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติฉบับที่ 3278 หรือกฎบัตรเมือง Caloocan",
    "Undang-Undang mengubah Undang-Undang Republik Nomor 3278, yaitu Piagam Kota Caloocan",
    "Akta meminda Akta Republik Nombor 3278, iaitu Piagam Bandaraya Caloocan",
)

ITEMS["PH-H7632"] = (
    "Đạo luật Toàn diện về Thuốc gây nghiện Nguy hiểm năm 2002",
    "พระราชบัญญัติยาเสพติดให้โทษแบบครบวงจร ค.ศ. 2002",
    "Undang-Undang Komprehensif tentang Obat Berbahaya Tahun 2002",
    "Akta Dadah Berbahaya Komprehensif 2002",
)

ITEMS["PH-H7260"] = (
    "Đạo luật Ngân hàng Tổng hợp năm 2000",
    "พระราชบัญญัติการธนาคารทั่วไป ค.ศ. 2000",
    "Undang-Undang Perbankan Umum Tahun 2000",
    "Akta Perbankan Am 2000",
)

ITEMS["PH-H2634"] = newcity("Danao")

ITEMS["PH-H7958"] = (
    "Đạo luật Cơ quan Hàng không Dân dụng năm 2008",
    "พระราชบัญญัติสำนักงานการบินพลเรือน ค.ศ. 2008",
    "Undang-Undang Otoritas Penerbangan Sipil Tahun 2008",
    "Akta Pihak Berkuasa Penerbangan Awam 2008",
)

ITEMS["PH-H5645"] = (
    "Đạo luật Dịch vụ Đối ngoại Philippines năm 1991",
    "พระราชบัญญัติราชการต่างประเทศฟิลิปปินส์ ค.ศ. 1991",
    "Undang-Undang Dinas Luar Negeri Filipina Tahun 1991",
    "Akta Perkhidmatan Luar Negara Filipina 1991",
)

ITEMS["PH-H273"] = newcity("Ormoc")

ITEMS["PH-H430"] = (
    "Đạo luật Quản lý Ngân hàng và Các Tổ chức Ngân hàng",
    "พระราชบัญญัติกำกับดูแลธนาคารและสถาบันการธนาคาร",
    "Undang-Undang Pengaturan Bank dan Lembaga Perbankan",
    "Akta Pengawalan Bank dan Institusi Perbankan",
)

ITEMS["PH-H277"] = newcity("Rizal")

ITEMS["PH-H029"] = (
    "Đạo luật Cải cách Thuế nhằm Tăng tốc và Bao trùm năm 2017 (TRAIN)",
    "พระราชบัญญัติปฏิรูปภาษีเพื่อความรวดเร็วและทั่วถึง ค.ศ. 2017 (TRAIN)",
    "Undang-Undang Reformasi Perpajakan untuk Percepatan dan Inklusi Tahun 2017 (TRAIN)",
    "Akta Pembaharuan Cukai untuk Pemecutan dan Keterangkuman 2017 (TRAIN)",
)

ITEMS["PH-H528"] = charter("Quezon", True)

ITEMS["PH-H6846"] = (
    "Đạo luật Quyền của Người Bản địa năm 1997",
    "พระราชบัญญัติสิทธิของชนพื้นเมือง ค.ศ. 1997",
    "Undang-Undang Hak Masyarakat Adat Tahun 1997",
    "Akta Hak Masyarakat Peribumi 1997",
)

ITEMS["PH-H259"] = (
    "Đạo luật thành lập Cục Sáng chế",
    "พระราชบัญญัติจัดตั้งสำนักงานสิทธิบัตร",
    "Undang-Undang membentuk Kantor Paten",
    "Akta menubuhkan Pejabat Paten",
)

ITEMS["PH-H5465"] = (
    "Đạo luật về Bộ Nội vụ và Chính quyền Địa phương",
    "พระราชบัญญัติกระทรวงมหาดไทยและการปกครองท้องถิ่น",
    "Undang-Undang Kementerian Dalam Negeri dan Pemerintahan Daerah",
    "Akta Kementerian Dalam Negeri dan Kerajaan Tempatan",
)

ITEMS["PH-H7604"] = (
    "Đạo luật Cải cách Ngành Điện lực",
    "พระราชบัญญัติปฏิรูปอุตสาหกรรมไฟฟ้า",
    "Undang-Undang Reformasi Industri Ketenagalistrikan",
    "Akta Pembaharuan Industri Tenaga Elektrik",
)

ITEMS["PH-H9105"] = (
    "Đạo luật Thủy sản năm 2015 (sửa đổi về đánh bắt bất hợp pháp, không khai báo và không được quản lý)",
    "พระราชบัญญัติการประมง ค.ศ. 2015 (ฉบับแก้ไขว่าด้วยการทำประมงผิดกฎหมาย ขาดการรายงาน และไร้การควบคุม)",
    "Undang-Undang Perikanan Tahun 2015 (Perubahan tentang Penangkapan Ikan Ilegal, Tidak Dilaporkan, dan Tidak Diatur)",
    "Akta Perikanan 2015 (Pindaan tentang Penangkapan Ikan Haram, Tidak Dilaporkan dan Tidak Terkawal)",
)

ITEMS["PH-SECURITIES-2000"] = (
    "Bộ luật Quản lý Chứng khoán",
    "ประมวลกฎหมายกำกับหลักทรัพย์",
    "Kitab Undang-Undang Pengaturan Efek",
    "Kanun Undang-Undang Pengawalseliaan Sekuriti",
)

ITEMS["PH-H5154"] = (
    "Đạo luật Cải cách Nông nghiệp Toàn diện năm 1988",
    "พระราชบัญญัติปฏิรูปเกษตรกรรมแบบครบวงจร ค.ศ. 1988",
    "Undang-Undang Reformasi Agraria Komprehensif Tahun 1988",
    "Akta Pembaharuan Agraria Komprehensif 1988",
)

ITEMS["PH-H7635"] = (
    "Đạo luật Bảo hộ Giống Cây trồng Mới",
    "พระราชบัญญัติคุ้มครองพันธุ์พืชใหม่",
    "Undang-Undang Perlindungan Varietas Tanaman Baru",
    "Akta Perlindungan Varieti Tumbuhan Baharu",
)

ITEMS["PH-H7651"] = (
    "Đạo luật Cải cách Mua sắm Chính phủ",
    "พระราชบัญญัติปฏิรูปการจัดซื้อจัดจ้างภาครัฐ",
    "Undang-Undang Reformasi Pengadaan Pemerintah",
    "Akta Pembaharuan Perolehan Kerajaan",
)

ITEMS["PH-H7021"] = (
    "Đạo luật Cải cách và Tái tổ chức Cảnh sát Quốc gia Philippines năm 1998",
    "พระราชบัญญัติปฏิรูปและปรับโครงสร้างตำรวจแห่งชาติฟิลิปปินส์ ค.ศ. 1998",
    "Undang-Undang Reformasi dan Reorganisasi Kepolisian Nasional Filipina Tahun 1998",
    "Akta Pembaharuan dan Penyusunan Semula Polis Negara Filipina 1998",
)

ITEMS["PH-H5566"] = (
    "Đạo luật Dự bị Công dân của Lực lượng Vũ trang Philippines",
    "พระราชบัญญัติกำลังสำรองพลเรือนของกองทัพฟิลิปปินส์",
    "Undang-Undang Cadangan Sipil Angkatan Bersenjata Filipina",
    "Akta Simpanan Awam Angkatan Tentera Filipina",
)

ITEMS["PH-H6144"] = (
    "Đạo luật Phân bổ Ngân sách Tổng hợp năm 1993",
    "พระราชบัญญัติจัดสรรงบประมาณทั่วไป ค.ศ. 1993",
    "Undang-Undang Pengalokasian Anggaran Umum Tahun 1993",
    "Akta Peruntukan Wang Am 1993",
)

ITEMS["PH-H3556"] = charter("Davao", True)

ITEMS["PH-H4010"] = (
    "Đạo luật Cấp phép và Quản lý Cơ sở và Vật liệu Năng lượng Nguyên tử",
    "พระราชบัญญัติการอนุญาตและการกำกับดูแลโรงงานและวัสดุนิวเคลียร์",
    "Undang-Undang Perizinan dan Pengaturan Fasilitas dan Bahan Tenaga Atom",
    "Akta Pelesenan dan Pengawalseliaan Kemudahan dan Bahan Tenaga Atom",
)

ITEMS["PH-H8451"] = (
    "Đạo luật Mở rộng Phúc lợi cho Người cao tuổi năm 2010",
    "พระราชบัญญัติขยายสวัสดิการผู้สูงอายุ ค.ศ. 2010",
    "Undang-Undang Perluasan Kesejahteraan Lanjut Usia Tahun 2010",
    "Akta Pengembangan Kebajikan Warga Emas 2010",
)

ITEMS["PH-H9502"] = (
    "Đạo luật Giao dịch Bảo đảm bằng Động sản năm 2018",
    "พระราชบัญญัติธุรกรรมหลักประกันสังหาริมทรัพย์ ค.ศ. 2018",
    "Undang-Undang Transaksi Jaminan Kebendaan Bergerak Tahun 2018",
    "Akta Urus Niaga Jaminan Harta Alih 2018",
)

ITEMS["PH-H3339"] = (
    "Đạo luật Hợp nhất các Quy định về Vận tải Đường bộ và Luật Giao thông",
    "พระราชบัญญัติรวบรวมกฎหมายว่าด้วยการขนส่งทางบกและกฎจราจร",
    "Undang-Undang Kodifikasi Ketentuan Angkutan Jalan dan Peraturan Lalu Lintas",
    "Akta Pengkodifikasian Peruntukan Pengangkutan Jalan dan Peraturan Trafik",
)

ITEMS["PH-H7274"] = (
    "Đạo luật thành lập Thành phố Sorsogon bằng việc sáp nhập các thị xã Bacon và Sorsogon thuộc tỉnh Sorsogon, và phân bổ ngân sách cho mục đích này",
    "พระราชบัญญัติจัดตั้งเมือง Sorsogon โดยการรวมเทศบาล Bacon และ Sorsogon ในจังหวัด Sorsogon และจัดสรรงบประมาณเพื่อการนั้น",
    "Undang-Undang membentuk Kota Sorsogon dengan menggabungkan Kotamadya Bacon dan Sorsogon di Provinsi Sorsogon, dan mengalokasikan anggaran untuk itu",
    "Akta mewujudkan Bandaraya Sorsogon dengan menggabungkan Perbandaran Bacon dan Sorsogon di Wilayah Sorsogon, dan memperuntukkan wang bagi maksud itu",
)

ITEMS["PH-H7471"] = (
    "Đạo luật Quản lý Chất thải Rắn Sinh thái",
    "พระราชบัญญัติการจัดการขยะมูลฝอยเชิงนิเวศ",
    "Undang-Undang Pengelolaan Sampah Padat Ekologis",
    "Akta Pengurusan Sisa Pepejal Ekologi",
)

ITEMS["PH-H7806"] = (
    "Đạo luật về Hệ thống Tư pháp và Phúc lợi Toàn diện cho Người chưa thành niên",
    "พระราชบัญญัติระบบยุติธรรมและสวัสดิการเยาวชนแบบครบวงจร",
    "Undang-Undang Sistem Peradilan dan Kesejahteraan Anak yang Komprehensif",
    "Akta Sistem Keadilan dan Kebajikan Kanak-Kanak Komprehensif",
)

ITEMS["PH-H7849"] = charter("Navotas")
ITEMS["PH-H7850"] = charter("San Juan")
ITEMS["PH-H7853"] = charter("Catbalogan")
ITEMS["PH-H7866"] = charter("Bayugan")
ITEMS["PH-H7869"] = charter("Mati")
ITEMS["PH-H7870"] = charter("Guihulngan")
ITEMS["PH-H7896"] = charter("El Salvador")
ITEMS["PH-H8198"] = charter("Biñan")

ITEMS["PH-H7456"] = (
    "Đạo luật xác nhận và công nhận việc thành lập Thành phố Vigan theo Sắc lệnh Hoàng gia ngày 7 tháng 9 năm 1757 của Vua Fernando VI của Tây Ban Nha",
    "พระราชบัญญัติรับรองและยอมรับการจัดตั้งเมือง Vigan ตามพระราชกฤษฎีกาวันที่ 7 กันยายน ค.ศ. 1757 ของพระเจ้า Fernando VI แห่งสเปน",
    "Undang-Undang mengesahkan dan mengakui pembentukan Kota Vigan berdasarkan Dekret Kerajaan tanggal 7 September 1757 oleh Raja Fernando VI dari Spanyol",
    "Akta mengesahkan dan mengakui penubuhan Bandaraya Vigan berdasarkan Dekri Diraja bertarikh 7 September 1757 oleh Raja Fernando VI dari Sepanyol",
)

ITEMS["PH-H7851"] = charter("Baybay")
ITEMS["PH-H7852"] = charter("Bogo")
ITEMS["PH-H7854"] = charter("Tandag")
ITEMS["PH-H7855"] = charter("Lamitan")
ITEMS["PH-H7856"] = charter("Borongan")
ITEMS["PH-H7860"] = charter("Tayabas")
ITEMS["PH-H7868"] = charter("Batac")
ITEMS["PH-H7895"] = charter("Cabadbaran")
ITEMS["PH-H7897"] = charter("Carcar")

ITEMS["PH-H10070"] = (
    "Đạo luật Tăng cường Chăm sóc Trẻ em Thay thế và Trình tự Hành chính về Nhận nuôi Trong nước năm 2022",
    "พระราชบัญญัติเสริมสร้างการดูแลเด็กทดแทนและกระบวนการทางปกครองในการรับบุตรบุญธรรมในประเทศ ค.ศ. 2022",
    "Undang-Undang Penguatan Pengasuhan Anak Alternatif dan Prosedur Administratif Adopsi Domestik Tahun 2022",
    "Akta Pengukuhan Penjagaan Kanak-Kanak Alternatif dan Prosedur Pentadbiran Pengambilan Anak Angkat Domestik 2022",
)

ITEMS["PH-H10117"] = charter("Baguio", True)

ITEMS["PH-H6945"] = (
    "Đạo luật hợp nhất ba thị xã Babak, Samal và Kaputian trên Đảo Samal, tỉnh Davao thành một thành phố hợp phần mang tên Thành phố Vườn Đảo Samal",
    "พระราชบัญญัติรวมเทศบาล Babak, Samal และ Kaputian บนเกาะ Samal จังหวัด Davao เป็นเมืององค์ประกอบชื่อเมืองสวนเกาะ Samal",
    "Undang-Undang menggabungkan tiga kotamadya Babak, Samal, dan Kaputian di Pulau Samal, Provinsi Davao menjadi kota komponen bernama Kota Taman Pulau Samal",
    "Akta menggabungkan tiga perbandaran Babak, Samal dan Kaputian di Pulau Samal, Wilayah Davao menjadi bandar komponen bernama Bandaraya Taman Pulau Samal",
)

ITEMS["PH-H7264"] = charter("Maasin")
ITEMS["PH-H7265"] = charter("San Jose del Monte")
ITEMS["PH-H7266"] = charter("Digos")
ITEMS["PH-H7445"] = charter("Muñoz")
ITEMS["PH-H7447"] = charter("Talisay")
ITEMS["PH-H7451"] = charter("Bayawan")
ITEMS["PH-H7452"] = charter("Balanga")

OUT = {
    "batch": "ph-p1-b04",
    "scope": "PH 条文数 30–99 段前 60 部（含市宪章类模板）",
    "items": {k: {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]} for k, v in ITEMS.items()},
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b04.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(json.dumps(OUT, ensure_ascii=False, indent=1))
print("写入", dst, "部数", len(OUT["items"]))
