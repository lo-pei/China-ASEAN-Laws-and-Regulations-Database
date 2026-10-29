# -*- coding: utf-8 -*-
"""PH 批次 3：条文数 30–99 段的第 61–120 部（四语）。

本批以 en 为语义基准（PH 官方文本为英文），zh 仅参考；
并对 4 条 zh 错译作订正（见 ZH_FIX）。
"""
import io, json, os

def city(c):
    return ("Hiến chương Thành phố %s" % c, "กฎบัตรเมือง %s" % c,
            "Piagam Kota %s" % c, "Piagam Bandaraya %s" % c)

def province(c):
    return ("Hiến chương Tỉnh %s" % c, "กฎบัตรจังหวัด %s" % c,
            "Piagam Provinsi %s" % c, "Piagam Wilayah %s" % c)

ITEMS = {}

ITEMS["PH-H7453"] = city("Valencia")

ITEMS["PH-H7760"] = (
    "Bộ luật Kiểm nghiệm Thịt Philippines",
    "ประมวลกฎหมายการตรวจสอบเนื้อสัตว์ฟิลิปปินส์",
    "Kitab Undang-Undang Inspeksi Daging Filipina",
    "Kanun Undang-Undang Pemeriksaan Daging Filipina",
)

ITEMS["PH-H7834"] = (
    "Đạo luật An ninh Con người năm 2007",
    "พระราชบัญญัติความมั่นคงของมนุษย์ ค.ศ. 2007",
    "Undang-Undang Keamanan Manusia Tahun 2007",
    "Akta Keselamatan Manusia 2007",
)

ITEMS["PH-H8287"] = (
    "Bộ luật Dịch vụ Pre-Need của Philippines",
    "ประมวลกฎหมายบริการ Pre-Need ของฟิลิปปินส์",
    "Kitab Undang-Undang Layanan Pre-Need Filipina",
    "Kanun Undang-Undang Perkhidmatan Pre-Need Filipina",
)

ITEMS["PH-H10691"] = (
    "Đạo luật về Khung pháp lý Toàn diện cho An toàn, An ninh và Bảo đảm Hạt nhân trong Sử dụng Năng lượng Hạt nhân vì Mục đích Hòa bình, thành lập Cơ quan Quản lý Năng lượng Nguyên tử Philippines",
    "พระราชบัญญัติกรอบกฎหมายแบบครบวงจรด้านความปลอดภัย ความมั่นคง และการประกันนิวเคลียร์ในการใช้นิวเคลียร์เพื่อสันติ จัดตั้งสำนักงานกำกับดูแลพลังงานปรมาณูฟิลิปปินส์",
    "Undang-Undang Kerangka Hukum Komprehensif untuk Keselamatan, Keamanan, dan Jaminan Nuklir dalam Pemanfaatan Nuklir untuk Tujuan Damai, membentuk Otoritas Pengawas Energi Atom Filipina",
    "Akta Kerangka Undang-Undang Komprehensif bagi Keselamatan, Keselamatan Nuklear dan Jaminan Nuklear dalam Penggunaan Nuklear untuk Tujuan Aman, menubuhkan Pihak Berkuasa Pengawalseliaan Tenaga Atom Filipina",
)

ITEMS["PH-H9249"] = (
    "Đạo luật Quy định Việc Điều hành và Quản lý Cục Phúc lợi Người lao động Ở nước ngoài",
    "พระราชบัญญัติกำหนดการดำเนินงานและการบริหารสำนักงานสวัสดิการแรงงานต่างประเทศ",
    "Undang-Undang Mengatur Penyelenggaraan dan Pengelolaan Badan Kesejahteraan Pekerja Luar Negeri",
    "Akta Mengawal Selia Operasi dan Pengurusan Lembaga Kebajikan Pekerja Luar Negara",
)

ITEMS["PH-H9367"] = (
    "Đạo luật thành lập Đại học Khoa học và Công nghệ miền Nam Philippines (USTSP) trên cơ sở hợp nhất Đại học Khoa học và Công nghệ Mindanao (MUST) và Cao đẳng Nông nghiệp và Công nghệ Bang Misamis Oriental (MOSCAT)",
    "พระราชบัญญัติจัดตั้งมหาวิทยาลัยวิทยาศาสตร์และเทคโนโลยีภาคใต้ฟิลิปปินส์ (USTSP) โดยการรวมมหาวิทยาลัยวิทยาศาสตร์และเทคโนโลยี Mindanao (MUST) และวิทยาลัยเกษตรและเทคโนโลยีแห่งรัฐ Misamis Oriental (MOSCAT)",
    "Undang-Undang pembentukan Universitas Sains dan Teknologi Filipina Selatan (USTSP) dengan menggabungkan Universitas Sains dan Teknologi Mindanao (MUST) dan Perguruan Tinggi Pertanian dan Teknologi Negeri Misamis Oriental (MOSCAT)",
    "Akta penubuhan Universiti Sains dan Teknologi Filipina Selatan (USTSP) dengan menggabungkan Universiti Sains dan Teknologi Mindanao (MUST) dan Kolej Pertanian dan Teknologi Negeri Misamis Oriental (MOSCAT)",
)

ITEMS["PH-H1034"] = (
    "Đạo luật Quy định Quan hệ giữa Địa chủ Nông nghiệp và Tá điền",
    "พระราชบัญญัติกำหนดความสัมพันธ์ระหว่างเจ้าของที่ดินเกษตรกับผู้เช่า",
    "Undang-Undang Mengatur Hubungan antara Pemilik Tanah Pertanian dan Penyewa",
    "Akta Mengawal Selia Hubungan antara Pemilik Tanah Pertanian dan Penyewa",
)

ITEMS["PH-H5224"] = (
    "Đạo luật Hợp lý hóa Tiền lương",
    "พระราชบัญญัติการปรับโครงสร้างค่าจ้างให้สมเหตุสมผล",
    "Undang-Undang Rasionalisasi Upah",
    "Akta Rasionalisasi Gaji",
)

ITEMS["PH-H5327"] = (
    "Đạo luật Phân bổ Ngân sách Tổng hợp năm 1990",
    "พระราชบัญญัติจัดสรรงบประมาณทั่วไป ค.ศ. 1990",
    "Undang-Undang Pengalokasian Anggaran Umum Tahun 1990",
    "Akta Peruntukan Wang Am 1990",
)

ITEMS["PH-H6355"] = (
    "Đạo luật thiết lập Chương trình Bảo hiểm Y tế Quốc gia cho toàn bộ người dân Philippines và thành lập Tổng công ty Bảo hiểm Y tế Philippines",
    "พระราชบัญญัติจัดตั้งโครงการประกันสุขภาพแห่งชาติสำหรับชาวฟิลิปปินส์ทุกคน และจัดตั้งบรรษัทประกันสุขภาพฟิลิปปินส์",
    "Undang-Undang membentuk Program Asuransi Kesehatan Nasional bagi seluruh rakyat Filipina dan mendirikan Perusahaan Asuransi Kesehatan Filipina",
    "Akta menubuhkan Program Insurans Kesihatan Kebangsaan bagi seluruh rakyat Filipina dan menubuhkan Perbadanan Insurans Kesihatan Filipina",
)

ITEMS["PH-H9698"] = (
    "Đạo luật chia tỉnh Palawan thành ba tỉnh mới, lần lượt mang tên Palawan Bắc, Palawan Đông và Palawan Nam",
    "พระราชบัญญัติแบ่งจังหวัด Palawan ออกเป็นสามจังหวัดใหม่ คือ Palawan เหนือ Palawan ตะวันออก และ Palawan ใต้",
    "Undang-Undang membagi Provinsi Palawan menjadi tiga provinsi baru, yaitu Palawan Utara, Palawan Timur, dan Palawan Selatan",
    "Akta membahagikan Wilayah Palawan kepada tiga wilayah baharu, iaitu Palawan Utara, Palawan Timur dan Palawan Selatan",
)

ITEMS["PH-H10352"] = (
    "Đạo luật thành lập Quỹ Đầu tư Maharlika, quy định việc quản lý, đầu tư và sử dụng lợi nhuận của Quỹ",
    "พระราชบัญญัติจัดตั้งกองทุนการลงทุน Maharlika กำหนดการบริหาร การลงทุน และการใช้ผลประโยชน์ของกองทุน",
    "Undang-Undang membentuk Dana Investasi Maharlika, mengatur pengelolaan, investasi, dan pemanfaatan hasil Dana",
    "Akta menubuhkan Dana Pelaburan Maharlika, mengawal selia pengurusan, pelaburan dan penggunaan hasil Dana",
)

ITEMS["PH-H6396"] = (
    "Đạo luật quy định khung pháp lý và cơ chế thành lập, vận hành, quản lý và điều phối các khu kinh tế đặc biệt tại Philippines, thành lập Cơ quan Quản lý Khu kinh tế Philippines (PEZA)",
    "พระราชบัญญัติกำหนดกรอบกฎหมายและกลไกการจัดตั้ง การดำเนินงาน การบริหาร และการประสานงานเขตเศรษฐกิจพิเศษในฟิลิปปินส์ จัดตั้งสำนักงานบริหารเขตเศรษฐกิจฟิลิปปินส์ (PEZA)",
    "Undang-Undang menetapkan kerangka hukum dan mekanisme pendirian, pengoperasian, pengelolaan, dan koordinasi kawasan ekonomi khusus di Filipina, membentuk Otoritas Kawasan Ekonomi Filipina (PEZA)",
    "Akta menetapkan kerangka undang-undang dan mekanisme penubuhan, pengendalian, pengurusan dan penyelarasan zon ekonomi khas di Filipina, menubuhkan Pihak Berkuasa Zon Ekonomi Filipina (PEZA)",
)

ITEMS["PH-H7865"] = city("Tabuk")

ITEMS["PH-H9911"] = (
    "Đạo luật Phòng ngừa, Cấm và Trừng phạt Khủng bố, bãi bỏ Luật Cộng hòa số 9372 tức Đạo luật An ninh Con người năm 2007",
    "พระราชบัญญัติป้องกัน ห้าม และลงโทษการก่อการร้าย ยกเลิกรัฐบัญญัติฉบับที่ 9372 หรือพระราชบัญญัติความมั่นคงของมนุษย์ ค.ศ. 2007",
    "Undang-Undang Pencegahan, Pelarangan, dan Penindakan Terorisme, mencabut Undang-Undang Republik Nomor 9372 yaitu Undang-Undang Keamanan Manusia Tahun 2007",
    "Akta Pencegahan, Larangan dan Hukuman Keganasan, memansuhkan Akta Republik Nombor 9372 iaitu Akta Keselamatan Manusia 2007",
)

ITEMS["PH-H10022"] = (
    "Đạo luật thiết lập khung quản lý an toàn cho hoạt động của ngành khí dầu mỏ hóa lỏng (LPG), xác định thẩm quyền và chức năng của các cơ quan nhà nước, xác định và xử phạt một số hành vi bị cấm",
    "พระราชบัญญัติกำหนดกรอบการกำกับดูแลความปลอดภัยในการประกอบกิจการก๊าซปิโตรเลียมเหลว (LPG) กำหนดอำนาจและหน้าที่ของหน่วยงานรัฐ กำหนดและลงโทษการกระทำต้องห้ามบางประการ",
    "Undang-Undang menetapkan kerangka pengawasan keselamatan operasi industri gas minyak bumi cair (LPG), menetapkan kewenangan dan fungsi lembaga pemerintah, menetapkan dan menghukum perbuatan terlarang tertentu",
    "Akta menetapkan kerangka pengawasan keselamatan operasi industri gas petroleum cecair (LPG), menetapkan kuasa dan fungsi agensi kerajaan, menetapkan dan menghukum perbuatan larangan tertentu",
)

ITEMS["PH-H9611"] = (
    "Đạo luật Phòng chống HIV/AIDS Philippines năm 1998",
    "พระราชบัญญัติป้องกันเอชไอวีและเอดส์ฟิลิปปินส์ ค.ศ. 1998",
    "Undang-Undang Penanggulangan HIV/AIDS Filipina Tahun 1998",
    "Akta Pencegahan HIV/AIDS Filipina 1998",
)

ITEMS["PH-H036"] = (
    "Đạo luật Giải quyết Tranh chấp Thay thế năm 2004",
    "พระราชบัญญัติการระงับข้อพิพาททางเลือก ค.ศ. 2004",
    "Undang-Undang Penyelesaian Sengketa Alternatif Tahun 2004",
    "Akta Penyelesaian Pertikaian Alternatif 2004",
)

ITEMS["PH-H5185"] = (
    "Đạo luật Phân bổ Ngân sách Hoạt động của Chính phủ",
    "พระราชบัญญัติจัดสรรงบประมาณการดำเนินงานของรัฐบาล",
    "Undang-Undang Pengalokasian Anggaran Penyelenggaraan Pemerintahan",
    "Akta Peruntukan Wang Pentadbiran Kerajaan",
)

ITEMS["PH-H9118"] = (
    "Đạo luật Chính sách Cạnh tranh Quốc gia năm 2015",
    "พระราชบัญญัติแนวนโยบายการแข่งขันแห่งชาติ ค.ศ. 2015",
    "Undang-Undang Kebijakan Persaingan Nasional Tahun 2015",
    "Akta Dasar Persaingan Kebangsaan 2015",
)

ITEMS["PH-H6965"] = (
    "Bộ luật về Quốc kỳ và Huy hiệu Philippines",
    "ประมวลกฎหมายว่าด้วยธงชาติและตราแผ่นดินฟิลิปปินส์",
    "Kitab Undang-Undang tentang Bendera dan Lambang Filipina",
    "Kanun Undang-Undang tentang Bendera dan Jata Filipina",
)

ITEMS["PH-H7218"] = (
    "Đạo luật Không khí Sạch Philippines năm 1999",
    "พระราชบัญญัติอากาศบริสุทธิ์ฟิลิปปินส์ ค.ศ. 1999",
    "Undang-Undang Udara Bersih Filipina Tahun 1999",
    "Akta Udara Bersih Filipina 1999",
)

ITEMS["PH-H7441"] = province("Zamboanga Sibugay")

ITEMS["PH-H8523"] = (
    "Đạo luật quy định việc bảo vệ và bảo tồn Di sản Văn hóa Quốc gia, tăng cường Ủy ban Quốc gia về Văn hóa và Nghệ thuật (NCCA) cùng các cơ quan văn hóa trực thuộc",
    "พระราชบัญญัติกำหนดการคุ้มครองและอนุรักษ์มรดกวัฒนธรรมแห่งชาติ เสริมสร้างคณะกรรมการแห่งชาติว่าด้วยวัฒนธรรมและศิลปะ (NCCA) และหน่วยงานวัฒนธรรมในกำกับ",
    "Undang-Undang mengatur perlindungan dan pelestarian Warisan Budaya Nasional, memperkuat Komisi Nasional Kebudayaan dan Kesenian (NCCA) serta lembaga kebudayaan di bawahnya",
    "Akta mengawal selia perlindungan dan pemuliharaan Warisan Budaya Kebangsaan, memperkukuh Suruhanjaya Kebangsaan Kebudayaan dan Kesenian (NCCA) serta agensi kebudayaan di bawahnya",
)

ITEMS["PH-H9294"] = (
    "Đạo luật hoàn thiện khung xử lý và thanh lý ngân hàng, sửa đổi Luật Cộng hòa số 3591 và các luật liên quan khác",
    "พระราชบัญญัติปรับปรุงกรอบการแก้ไขและชำระบัญชีธนาคาร แก้ไขรัฐบัญญัติฉบับที่ 3591 และกฎหมายอื่นที่เกี่ยวข้อง",
    "Undang-Undang menyempurnakan kerangka penanganan dan likuidasi bank, mengubah Undang-Undang Republik Nomor 3591 dan undang-undang terkait lainnya",
    "Akta menyempurnakan kerangka pengendalian dan pembubaran bank, meminda Akta Republik Nombor 3591 dan undang-undang berkaitan yang lain",
)

ITEMS["PH-H10289"] = (
    "Đạo luật cấp thêm phúc lợi cho cha mẹ đơn thân, sửa đổi Luật Cộng hòa số 8972 về phúc lợi và đặc quyền của cha mẹ đơn thân và con cái họ",
    "พระราชบัญญัติให้สวัสดิการเพิ่มเติมแก่พ่อแม่เลี้ยงเดี่ยว แก้ไขรัฐบัญญัติฉบับที่ 8972 ว่าด้วยสวัสดิการและสิทธิพิเศษของพ่อแม่เลี้ยงเดี่ยวและบุตร",
    "Undang-Undang pemberian tunjangan tambahan bagi orang tua tunggal, mengubah Undang-Undang Republik Nomor 8972 tentang kesejahteraan dan hak istimewa orang tua tunggal serta anak-anak mereka",
    "Akta pemberian faedah tambahan kepada ibu bapa tunggal, meminda Akta Republik Nombor 8972 tentang kebajikan dan keistimewaan ibu bapa tunggal serta anak-anak mereka",
)

ITEMS["PH-H10371"] = (
    "Đạo luật đưa vào cải cách thuế hành chính, sửa đổi các điều 21, 22, 51 và các điều khác của Bộ luật Thuế Quốc gia năm 1997, bãi bỏ Điều 34(K)",
    "พระราชบัญญัตินำการปฏิรูปภาษีด้านการบริหารมาใช้ แก้ไขมาตรา 21 22 51 และมาตราอื่นของประมวลกฎหมายภาษีอากรแห่งชาติ ค.ศ. 1997 ยกเลิกมาตรา 34(K)",
    "Undang-Undang memberlakukan reformasi perpajakan administratif, mengubah Pasal 21, 22, 51 dan pasal lain Kitab Undang-Undang Pajak Nasional Tahun 1997, mencabut Pasal 34(K)",
    "Akta melaksanakan pembaharuan cukai pentadbiran, meminda Seksyen 21, 22, 51 dan seksyen lain Kanun Undang-Undang Hasil Negara 1997, memansuhkan Seksyen 34(K)",
)

ITEMS["PH-H10507"] = (
    "Đạo luật thúc đẩy phát triển ngành công nghiệp khí tự nhiên Philippines, hợp nhất các luật về truyền tải, phân phối và cung cấp khí tự nhiên",
    "พระราชบัญญัติส่งเสริมการพัฒนาอุตสาหกรรมก๊าซธรรมชาติฟิลิปปินส์ รวบรวมกฎหมายว่าด้วยการขนส่ง การจำหน่าย และการจัดหาก๊าซธรรมชาติ",
    "Undang-Undang mendorong pengembangan industri gas alam Filipina, menghimpun undang-undang tentang transmisi, distribusi, dan pasokan gas alam",
    "Akta menggalakkan pembangunan industri gas asli Filipina, menghimpunkan undang-undang tentang penghantaran, pengagihan dan pembekalan gas asli",
)

ITEMS["PH-H5338"] = (
    "Hiến chương Ngân hàng Đầu tư Hồi giáo Al-Amanah Philippines",
    "กฎบัตรธนาคารเพื่อการลงทุนอิสลาม Al-Amanah ฟิลิปปินส์",
    "Piagam Bank Investasi Syariah Al-Amanah Filipina",
    "Piagam Bank Pelaburan Islam Al-Amanah Filipina",
)

ITEMS["PH-H7732"] = (
    "Đạo luật Chứng khoán hóa năm 2004",
    "พระราชบัญญัติการแปลงสินทรัพย์เป็นหลักทรัพย์ ค.ศ. 2004",
    "Undang-Undang Sekuritisasi Tahun 2004",
    "Akta Sekuritisasi 2004",
)

ITEMS["PH-H9366"] = (
    "Đạo luật Hiện đại hóa Hoạt động Hành nghề Dược",
    "พระราชบัญญัติการปรับปรุงการประกอบวิชาชีพเภสัชกรรมให้ทันสมัย",
    "Undang-Undang Modernisasi Praktik Kefarmasian",
    "Akta Pemodenan Amalan Farmasi",
)

ITEMS["PH-H6667"] = (
    "Đạo luật Đăng ký Cử tri năm 1996",
    "พระราชบัญญัติการลงทะเบียนผู้มีสิทธิเลือกตั้ง ค.ศ. 1996",
    "Undang-Undang Pendaftaran Pemilih Tahun 1996",
    "Akta Pendaftaran Pengundi 1996",
)

ITEMS["PH-H6978"] = ITEMS["PH-H9611"]

ITEMS["PH-H2357"] = (
    "Đạo luật Công ty Đầu tư",
    "พระราชบัญญัติบริษัทลงทุน",
    "Undang-Undang Perusahaan Investasi",
    "Akta Syarikat Pelaburan",
)

ITEMS["PH-H3761"] = (
    "Đạo luật sửa đổi một số điều khoản của Luật Cộng hòa số 3068, tức Hiến chương Thành phố Tacloban đã được sửa đổi",
    "พระราชบัญญัติแก้ไขบางมาตราแห่งรัฐบัญญัติฉบับที่ 3068 หรือกฎบัตรเมือง Tacloban ที่แก้ไขเพิ่มเติมแล้ว",
    "Undang-Undang mengubah beberapa ketentuan Undang-Undang Republik Nomor 3068, yaitu Piagam Kota Tacloban sebagaimana telah diubah",
    "Akta meminda beberapa peruntukan Akta Republik Nombor 3068, iaitu Piagam Bandaraya Tacloban sebagaimana yang telah dipinda",
)

ITEMS["PH-H5139"] = (
    "Đạo luật Phân bổ Ngân sách Tổng hợp năm 1988",
    "พระราชบัญญัติจัดสรรงบประมาณทั่วไป ค.ศ. 1988",
    "Undang-Undang Pengalokasian Anggaran Umum Tahun 1988",
    "Akta Peruntukan Wang Am 1988",
)

ITEMS["PH-H9108"] = (
    "Đạo luật Quy định và Hiện đại hóa Hành nghề Hóa học tại Philippines, bãi bỏ Luật Cộng hòa số 754",
    "พระราชบัญญัติกำกับและปรับปรุงการประกอบวิชาชีพเคมีในฟิลิปปินส์ให้ทันสมัย ยกเลิกรัฐบัญญัติฉบับที่ 754",
    "Undang-Undang Pengaturan dan Modernisasi Praktik Kimia di Filipina, mencabut Undang-Undang Republik Nomor 754",
    "Akta Pengawalseliaan dan Pemodenan Amalan Kimia di Filipina, memansuhkan Akta Republik Nombor 754",
)

ITEMS["PH-H5765"] = (
    "Đạo luật về Phục hồi chức năng, Tự phát triển và Tự lập của Người khuyết tật và Hòa nhập vào Đời sống Xã hội",
    "พระราชบัญญัติว่าด้วยการฟื้นฟูสมรรถภาพ การพัฒนาตนเอง และการพึ่งพาตนเองของผู้พิการ และการกลับสู่กระแสสังคม",
    "Undang-Undang tentang Rehabilitasi, Pengembangan Diri, dan Kemandirian Penyandang Disabilitas serta Integrasi ke Arus Utama Masyarakat",
    "Akta tentang Pemulihan, Pembangunan Diri dan Berdikari Orang Kurang Upaya serta Integrasi ke dalam Arus Perdana Masyarakat",
)

ITEMS["PH-H7727"] = (
    "Đạo luật xác định Bạo lực đối với Phụ nữ và Con cái họ, quy định các biện pháp bảo vệ nạn nhân và hình phạt tương ứng",
    "พระราชบัญญัติกำหนดความรุนแรงต่อสตรีและบุตร กำหนดมาตรการคุ้มครองผู้เสียหายและโทษที่เกี่ยวข้อง",
    "Undang-Undang menetapkan Kekerasan terhadap Perempuan dan Anak-anak Mereka, mengatur perlindungan korban dan sanksi pidana",
    "Akta menetapkan Keganasan terhadap Wanita dan Anak-anak Mereka, mengatur perlindungan mangsa dan hukuman yang berkaitan",
)

ITEMS["PH-H7931"] = (
    "Đạo luật Lưu trữ Quốc gia Philippines năm 2007",
    "พระราชบัญญัติหอจดหมายเหตุแห่งชาติฟิลิปปินส์ ค.ศ. 2007",
    "Undang-Undang Arsip Nasional Filipina Tahun 2007",
    "Akta Arkib Negara Filipina 2007",
)

ITEMS["PH-H9980"] = (
    "Đạo luật chia tỉnh Maguindanao thành hai tỉnh, là Maguindanao Bắc và Maguindanao Nam",
    "พระราชบัญญัติแบ่งจังหวัด Maguindanao ออกเป็นสองจังหวัด คือ Maguindanao เหนือ และ Maguindanao ใต้",
    "Undang-Undang membagi Provinsi Maguindanao menjadi dua provinsi, yaitu Maguindanao Utara dan Maguindanao Selatan",
    "Akta membahagikan Wilayah Maguindanao kepada dua wilayah, iaitu Maguindanao Utara dan Maguindanao Selatan",
)

ITEMS["PH-H5767"] = (
    "Đạo luật quy định Chương trình Phát triển Đô thị và Nhà ở Toàn diện và Liên tục, thiết lập cơ chế thực hiện",
    "พระราชบัญญัติกำหนดโครงการพัฒนาที่อยู่อาศัยและเมืองแบบครบวงจรและต่อเนื่อง จัดตั้งกลไกการดำเนินการ",
    "Undang-Undang mengatur Program Pembangunan Perumahan dan Perkotaan Komprehensif dan Berkelanjutan, membentuk mekanisme pelaksanaan",
    "Akta mengatur Program Pembangunan Perumahan dan Bandar Komprehensif dan Berterusan, menubuhkan mekanisme pelaksanaan",
)

ITEMS["PH-H9481"] = (
    "Đạo luật thiết lập Chính sách Sức khỏe Tâm thần Quốc gia, tăng cường cung cấp dịch vụ sức khỏe tâm thần toàn diện, bảo vệ quyền của người sử dụng dịch vụ tâm lý xã hội",
    "พระราชบัญญัติกำหนดนโยบายสุขภาพจิตแห่งชาติ เสริมสร้างการให้บริการสุขภาพจิตแบบครบวงจร คุ้มครองสิทธิของผู้ใช้บริการสุขภาพจิตสังคม",
    "Undang-Undang menetapkan Kebijakan Kesehatan Jiwa Nasional, memperkuat penyediaan layanan kesehatan jiwa komprehensif, melindungi hak pengguna layanan psikososial",
    "Akta menetapkan Dasar Kesihatan Mental Kebangsaan, memperkukuh penyediaan perkhidmatan kesihatan mental komprehensif, melindungi hak pengguna perkhidmatan psikososial",
)

ITEMS["PH-H9656"] = (
    "Đạo luật mới về Ngân hàng Trung ương",
    "พระราชบัญญัติธนาคารกลางฉบับใหม่",
    "Undang-Undang Baru Bank Sentral",
    "Akta Baharu Bank Pusat",
)

ITEMS["PH-H649"] = (
    "Đạo luật sửa đổi Luật Liên bang số 186 về việc thành lập Hệ thống Bảo hiểm Dịch vụ Chính phủ và quy định chế độ hưu trí",
    "พระราชบัญญัติแก้ไขรัฐบัญญัติสหพันธรัฐฉบับที่ 186 ว่าด้วยการจัดตั้งระบบประกันราชการและกำหนดบำนาญ",
    "Undang-Undang mengubah Undang-Undang Federal Nomor 186 tentang pembentukan Sistem Asuransi Pelayanan Pemerintah dan mengatur pensiun",
    "Akta meminda Akta Persekutuan Nombor 186 tentang penubuhan Sistem Insurans Perkhidmatan Kerajaan dan mengatur pencen",
)

ITEMS["PH-H6969"] = (
    "Đạo luật Quy định Hành nghề Kỹ thuật Cơ khí",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพวิศวกรรมเครื่องกล",
    "Undang-Undang Pengaturan Praktik Teknik Mesin",
    "Akta Pengawalseliaan Amalan Kejuruteraan Mekanikal",
)

ITEMS["PH-H7962"] = (
    "Đạo luật về Thuốc Thiết yếu Giá rẻ và Chất lượng năm 2008",
    "พระราชบัญญัติยาที่จำเป็นเข้าถึงได้ ราคาถูก และมีคุณภาพ ค.ศ. 2008",
    "Undang-Undang Obat Esensial Terjangkau dan Berkualitas Tahun 2008",
    "Akta Ubat Penting Mampu Milik dan Berkualiti 2008",
)

ITEMS["PH-H1995"] = (
    "Đạo luật sửa đổi và cải cách các luật về Chế độ Công vụ Philippines",
    "พระราชบัญญัติแก้ไขและปรับปรุงกฎหมายว่าด้วยระบบราชการพลเรือนฟิลิปปินส์",
    "Undang-Undang mengubah dan mereformasi undang-undang tentang Kepegawaian Negeri Filipina",
    "Akta meminda dan membaharui undang-undang tentang Perkhidmatan Awam Filipina",
)

ITEMS["PH-H278"] = (
    "Đạo luật Quy định Hành nghề Kỹ thuật Điện",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพวิศวกรรมไฟฟ้า",
    "Undang-Undang Pengaturan Praktik Teknik Elektro",
    "Akta Pengawalseliaan Amalan Kejuruteraan Elektrik",
)

ITEMS["PH-H7731"] = (
    "Đạo luật Quy định Hành nghề Kiến trúc",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพสถาปัตยกรรม",
    "Undang-Undang Pengaturan Praktik Arsitektur",
    "Akta Pengawalseliaan Amalan Seni Bina",
)

ITEMS["PH-H8168"] = (
    "Đại Hiến chương Phụ nữ",
    "มหากฎบัตรสตรี",
    "Piagam Agung Perempuan",
    "Piagam Agung Wanita",
)

ITEMS["PH-H8524"] = (
    "Đạo luật quy định Khu Công viên Tự nhiên Rạn san hô Tubbataha thuộc tỉnh Palawan là khu bảo tồn theo Luật NIPAS (số 7586) và Luật Chương trình Môi trường Palawan (số 7611)",
    "พระราชบัญญัติกำหนดอุทยานธรรมชาติแนวปะการัง Tubbataha ในจังหวัด Palawan เป็นเขตคุ้มครองตามกฎหมาย NIPAS (ฉบับที่ 7586) และกฎหมายโครงการสิ่งแวดล้อม Palawan (ฉบับที่ 7611)",
    "Undang-Undang menetapkan Taman Alam Terumbu Karang Tubbataha di Provinsi Palawan sebagai kawasan lindung berdasarkan Undang-Undang NIPAS (Nomor 7586) dan Undang-Undang Program Lingkungan Palawan (Nomor 7611)",
    "Akta menetapkan Taman Alam Terumbu Karang Tubbataha di Wilayah Palawan sebagai kawasan perlindungan di bawah Akta NIPAS (Nombor 7586) dan Akta Program Alam Sekitar Palawan (Nombor 7611)",
)

ITEMS["PH-H9043"] = (
    "Đạo luật quy định toàn diện về súng và đạn dược, quy định hình phạt đối với hành vi vi phạm",
    "พระราชบัญญัติกำหนดกฎหมายแบบครบวงจรว่าด้วยอาวุธปืนและเครื่องกระสุน กำหนดโทษสำหรับการฝ่าฝืน",
    "Undang-Undang mengatur secara komprehensif tentang senjata api dan amunisi, menetapkan sanksi atas pelanggaran",
    "Akta mengawal selia secara komprehensif tentang senjata api dan peluru, menetapkan hukuman bagi pelanggaran",
)

ITEMS["PH-H9138"] = (
    "Đạo luật Quy định Hành nghề Kỹ thuật Luyện kim",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพวิศวกรรมโลหะการ",
    "Undang-Undang Pengaturan Praktik Teknik Metalurgi",
    "Akta Pengawalseliaan Amalan Kejuruteraan Metalurgi",
)

ITEMS["PH-H9363"] = (
    "Đạo luật tăng cường, hiện đại hóa và điều chỉnh hành nghề kỹ thuật nông nghiệp trong nước phù hợp với thông lệ quốc tế về kỹ thuật nông nghiệp và hệ thống sinh học",
    "พระราชบัญญัติเสริมสร้าง ปรับปรุงให้ทันสมัย และปรับการประกอบวิชาชีพวิศวกรรมเกษตรของประเทศให้สอดคล้องกับแนวปฏิบัติสากลด้านวิศวกรรมเกษตรและระบบชีวภาพ",
    "Undang-Undang memperkuat, memodernisasi, dan menyelaraskan praktik teknik pertanian nasional dengan praktik internasional teknik pertanian dan sistem hayati",
    "Akta memperkukuh, memodenkan dan menyelaraskan amalan kejuruteraan pertanian negara dengan amalan antarabangsa kejuruteraan pertanian dan sistem biologi",
)

ITEMS["PH-H10455"] = (
    "Đạo luật sửa đổi một số điều và bổ sung các điều mới của Bộ luật Thuế Nội địa Quốc gia năm 1997",
    "พระราชบัญญัติแก้ไขบางมาตราและเพิ่มมาตราใหม่ของประมวลกฎหมายภาษีอากรภายในประเทศ ค.ศ. 1997",
    "Undang-Undang mengubah beberapa pasal dan menambahkan pasal baru dalam Kitab Undang-Undang Pajak Dalam Negeri Tahun 1997",
    "Akta meminda beberapa seksyen dan menambah seksyen baharu dalam Kanun Undang-Undang Hasil Dalam Negeri 1997",
)

ITEMS["PH-H4533"] = (
    "Đạo luật Quy định Hành nghề Dược và thiết lập Tiêu chuẩn Giáo dục Dược Philippines",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพเภสัชกรรมและกำหนดมาตรฐานการศึกษเภสัชกรรมฟิลิปปินส์",
    "Undang-Undang Pengaturan Praktik Farmasi dan Penetapan Standar Pendidikan Farmasi Filipina",
    "Akta Pengawalseliaan Amalan Farmasi dan Penetapan Standard Pendidikan Farmasi Filipina",
)

ITEMS["PH-H4631"] = (
    "Đạo luật tuyên bố mục tiêu chính sách quốc gia về điện khí hóa toàn diện theo phương thức tiếp cận theo khu vực, quy định việc thành lập, thúc đẩy và phát triển Cơ quan Điện khí hóa Quốc gia và các hợp tác xã điện lực, bãi bỏ Luật Cộng hòa số 2717",
    "พระราชบัญญัติประกาศเป้าหมายนโยบายแห่งชาติว่าด้วยการขยายไฟฟ้าให้ครอบคลุมทุกพื้นที่ กำหนดการจัดตั้ง การส่งเสริม และการพัฒนาสำนักงานการไฟฟ้าแห่งชาติและสหกรณ์ไฟฟ้า ยกเลิกรัฐบัญญัติฉบับที่ 2717",
    "Undang-Undang menyatakan tujuan kebijakan nasional untuk elektrifikasi menyeluruh berdasarkan cakupan wilayah, mengatur pembentukan, promosi, dan pengembangan Otoritas Elektrifikasi Nasional serta koperasi listrik, mencabut Undang-Undang Republik Nomor 2717",
    "Akta mengisytiharkan matlamat dasar negara bagi pengelektrikan menyeluruh mengikut liputan wilayah, mengatur penubuhan, promosi dan pembangunan Pihak Berkuasa Pengelektrikan Negara serta koperasi elektrik, memansuhkan Akta Republik Nombor 2717",
)

ITEMS["PH-H9310"] = (
    "Đạo luật Quy định Hành nghề Dinh dưỡng và Ăn kiêng",
    "พระราชบัญญัติกำกับการประกอบวิชาชีพโภชนาการและอาหารบำบัด",
    "Undang-Undang Pengaturan Praktik Gizi dan Dietetika",
    "Akta Pengawalseliaan Amalan Pemakanan dan Dietetik",
)

# zh 错译订正（以 en 为准）
ZH_FIX = {
    "PH-H5765": "残疾人康复、自强与融入社会法",
    "PH-H7760": "菲律宾肉类检验法典",
    "PH-H7731": "建筑执业规制法",
    "PH-H10455": "修订1997年国家国内税收法典若干条文并增列新条文的法案",
}

items = {}
for k, v in ITEMS.items():
    d = {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]}
    if k in ZH_FIX:
        d["zh"] = ZH_FIX[k]
    items[k] = d

OUT = {
    "batch": "ph-p1-b05",
    "scope": "PH 条文数 30–99 段第 61–120 部（以 en 为基准，含 4 条 zh 订正）",
    "items": items,
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b05.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(json.dumps(OUT, ensure_ascii=False, indent=1))
print("写入", dst, "部数", len(items), "| zh 订正", len(ZH_FIX))
