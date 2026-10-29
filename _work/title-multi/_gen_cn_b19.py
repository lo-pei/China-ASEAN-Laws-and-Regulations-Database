# -*- coding: utf-8 -*-
"""CN 标题多语种批次生成器（第 19 批：按条文数 28 条段起的 60 部）。

语义基准：title.zh（中文原本，权威）与 title.en（官方英译，用于交叉核对）。
层级词：条例 → Regulations / 规定 → Provisions / 办法 → Measures /
决议 → Resolution / 决定 → Decision / 安排 → Arrangement / 补充规定 → Supplementary Provisions。
涉台港澳表述按一个中国口径：
  台湾地区 → vi `vùng Đài Loan (Trung Quốc)` / th `เขตไต้หวัน (จีน)` /
             id `Wilayah Taiwan (Tiongkok)` / ms `Wilayah Taiwan (China)`
  香港/澳门特别行政区 → `... Hồng Kông (Trung Quốc)` / `ฮ่องกง (จีน)` /
             `Hong Kong (Tiongkok)` / `Hong Kong (China)`
"""
import json, io, os

items = {}


def put(lid, vi, th, id_, ms, zh=None):
    d = {"vi": vi, "th": th, "id": id_, "ms": ms}
    if zh:
        d["zh"] = zh
    items[lid] = d


SPC = {"vi": "Tòa án Nhân dân Tối cao", "th": "ศาลประชาชนสูงสุด",
       "id": "Mahkamah Rakyat Agung", "ms": "Mahkamah Rakyat Agung"}
SPC_SPP = {"vi": "Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao",
           "th": "ศาลประชาชนสูงสุดและอัยการประชาชนสูงสุด",
           "id": "Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung",
           "ms": "Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung"}


def interp(court, subj):
    """…关于（审理/办理）X 适用法律若干问题的解释"""
    return {
        "vi": "Giải thích của %s về một số vấn đề áp dụng pháp luật trong %s" % (court["vi"], subj["vi"]),
        "th": "การตีความของ%sว่าด้วยปัญหาหลายประการในการใช้กฎหมายใน%s" % (court["th"], subj["th"]),
        "id": "Penafsiran %s tentang Beberapa Masalah Penerapan Hukum dalam %s" % (court["id"], subj["id"]),
        "ms": "Tafsiran %s mengenai Beberapa Isu Penggunaan Undang-Undang dalam %s" % (court["ms"], subj["ms"]),
    }


def prov(court, subj):
    """…关于 X 若干问题的规定"""
    return {
        "vi": "Quy định của %s về một số vấn đề %s" % (court["vi"], subj["vi"]),
        "th": "ข้อกำหนดของ%sว่าด้วยปัญหาหลายประการ%s" % (court["th"], subj["th"]),
        "id": "Ketentuan %s tentang Beberapa Masalah %s" % (court["id"], subj["id"]),
        "ms": "Peruntukan %s mengenai Beberapa Isu %s" % (court["ms"], subj["ms"]),
    }


def reg(subj):
    """…条例"""
    return {"vi": "Quy định về %s" % subj["vi"],
            "th": "ข้อบังคับว่าด้วย%s" % subj["th"],
            "id": "Peraturan tentang %s" % subj["id"],
            "ms": "Peraturan mengenai %s" % subj["ms"]}


def interim(d):
    return {k: d[k].replace("Quy định về", "Quy định tạm thời về")
            .replace("ข้อบังคับว่าด้วย", "ข้อบังคับชั่วคราวว่าด้วย")
            .replace("Peraturan tentang", "Peraturan Sementara tentang")
            .replace("Peraturan mengenai", "Peraturan Sementara mengenai") for k in d}


def meas(subj):
    """…管理办法"""
    return {"vi": "Biện pháp quản lý %s" % subj["vi"],
            "th": "มาตรการบริหาร%s" % subj["th"],
            "id": "Tindakan Pengelolaan %s" % subj["id"],
            "ms": "Langkah Pengurusan %s" % subj["ms"]}


def rule(subj):
    """专业领域「…规定」（非法院）"""
    return {"vi": "Quy định về %s" % subj["vi"],
            "th": "ข้อกำหนดว่าด้วย%s" % subj["th"],
            "id": "Ketentuan tentang %s" % subj["id"],
            "ms": "Peruntukan mengenai %s" % subj["ms"]}


# ============ 国务院条例 / 办法 ============
RULES = [
    ("CN-REG-0427", "công tác thanh tra của chính phủ", "งานตรวจราชการของรัฐบาล",
     "Pekerjaan Inspeksi Pemerintah", "Kerja Pemeriksaan Kerajaan"),
    ("CN-REG-0045", "quản lý hướng dẫn viên du lịch", "การบริหารมัคคุเทศก์",
     "Pengelolaan Pemandu Wisata", "Pengurusan Pemandu Pelancong"),
    ("CN-REG-0100", "thẩm tra cạnh tranh công bằng", "การทบทวนการแข่งขันที่เป็นธรรม",
     "Peninjauan Persaingan Usaha yang Adil", "Semakan Persaingan Adil"),
    ("CN-REG-0116", "bảo vệ các công trình phát thanh và truyền hình",
     "การคุ้มครองสถานที่วิทยุกระจายเสียงและโทรทัศน์",
     "Perlindungan Fasilitas Penyiaran Radio dan Televisi",
     "Perlindungan Kemudahan Penyiaran Radio dan Televisyen"),
    ("CN-REG-0204", "thanh tra giáo dục", "การกำกับดูแลการศึกษา",
     "Pengawasan Pendidikan", "Penyeliaan Pendidikan"),
    ("CN-REG-0382", "bảo hộ quyền truyền đạt qua mạng thông tin",
     "การคุ้มครองสิทธิการเผยแพร่ผ่านเครือข่ายสารสนเทศ",
     "Perlindungan Hak Penyebaran melalui Jaringan Informasi",
     "Perlindungan Hak Penyebaran melalui Rangkaian Maklumat"),
    ("CN-REG-0385", "quản lý phân chia hành chính", "การบริหารเขตการปกครอง",
     "Pengelolaan Pembagian Wilayah Administratif", "Pengurusan Pembahagian Wilayah Pentadbiran"),
    ("CN-REG-0415", "quản lý khai thác cát trên lòng sông Trường Giang",
     "การบริหารการขุดทรายในลำน้ำแยงซี",
     "Pengelolaan Penambangan Pasir di Alur Sungai Yangtze",
     "Pengurusan Perlombongan Pasir di Alur Sungai Yangtze"),
    ("CN-REG-0043", "quản lý an toàn hoạt động quần chúng quy mô lớn",
     "การบริหารความปลอดภัยของกิจกรรมมวลชนขนาดใหญ่",
     "Pengelolaan Keselamatan Kegiatan Massa Berskala Besar",
     "Pengurusan Keselamatan Aktiviti Massa Berskala Besar"),
    ("CN-REG-0056", "quản lý tài liệu địa chất", "การบริหารเอกสารธรณีวิทยา",
     "Pengelolaan Data Geologi", "Pengurusan Data Geologi"),
    ("CN-REG-0070", "đăng ký và thẩm tra văn bản quy phạm pháp luật",
     "การขึ้นทะเบียนและการทบทวนกฎหมายและข้อบังคับ",
     "Pendaftaran dan Peninjauan Peraturan Perundang-undangan",
     "Pendaftaran dan Semakan Undang-Undang serta Peraturan"),
    ("CN-REG-0279", "bảo vệ công trình khí tượng và môi trường quan trắc khí tượng",
     "การคุ้มครองสถานที่อุตุนิยมวิทยาและสภาพแวดล้อมการตรวจวัดอุตุนิยมวิทยา",
     "Perlindungan Fasilitas Meteorologi dan Lingkungan Pengamatan Meteorologi",
     "Perlindungan Kemudahan Meteorologi dan Persekitaran Pemerhatian Meteorologi"),
    ("CN-REG-0397", "quản lý và bảo vệ nguồn dược liệu hoang dã",
     "การบริหารและคุ้มครองทรัพยากรสมุนไพรป่า",
     "Pengelolaan dan Perlindungan Sumber Daya Tanaman Obat Liar",
     "Pengurusan dan Perlindungan Sumber Herba Liar"),
    ("CN-REG-0448", "Ủy ban Chính sách Tiền tệ của Ngân hàng Nhân dân Trung Quốc",
     "คณะกรรมการนโยบายการเงินของธนาคารประชาชนจีน",
     "Komite Kebijakan Moneter Bank Rakyat Tiongkok",
     "Jawatankuasa Dasar Monetari Bank Rakyat China"),
    ("CN-REG-0608", "bảo hộ các chủng loại thuốc y học cổ truyền",
     "การคุ้มครองตำรับยาจีน",
     "Perlindungan Varietas Obat Tradisional Tiongkok",
     "Perlindungan Varieti Ubat Tradisional China"),
    ("CN-REG-0219", "thiết bị và công trình then chốt phục vụ công nghiệp quốc phòng",
     "อุปกรณ์และสถานที่สำคัญทางอุตสาหกรรมกลาโหม",
     "Peralatan dan Fasilitas Utama Industri Pertahanan",
     "Peralatan dan Kemudahan Utama Industri Pertahanan"),
]
for lid, vi, th, id_, ms in RULES:
    items[lid] = reg({"vi": vi, "th": th, "id": id_, "ms": ms})

# 暂行条例
items["CN-REG-0171"] = interim(reg({
    "vi": "ban kiểm soát của các tổ chức tài chính trọng điểm thuộc sở hữu nhà nước",
    "th": "คณะกรรมการกำกับดูแลของสถาบันการเงินสำคัญที่รัฐเป็นเจ้าของ",
    "id": "Dewan Pengawas Lembaga Keuangan Penting Milik Negara",
    "ms": "Lembaga Penyelia Institusi Kewangan Penting Milik Negara"}))
items["CN-REG-0214"] = interim(reg({
    "vi": "việc cấm phân bổ chi phí cho doanh nghiệp",
    "th": "การห้ามเรียกเก็บเงินจากวิสาหกิจ",
    "id": "Larangan Pembebanan Biaya kepada Perusahaan",
    "ms": "Larangan Pengenaan Caj kepada Syarikat"}))
items["CN-REG-0277"] = interim(reg({
    "vi": "công bố thông tin doanh nghiệp", "th": "การเปิดเผยข้อมูลวิสาหกิจ",
    "id": "Keterbukaan Informasi Perusahaan", "ms": "Pendedahan Maklumat Syarikat"}))
items["CN-REG-0289"] = interim(reg({
    "vi": "công tác lao động học tập trong các trường tiểu học và trung học toàn quốc",
    "th": "งานการเรียนรู้ควบคู่การทำงานในโรงเรียนประถมและมัธยมทั่วประเทศ",
    "id": "Kerja Belajar Sambil Bekerja di Sekolah Dasar dan Menengah Nasional",
    "ms": "Kerja Belajar Sambil Bekerja di Sekolah Rendah dan Menengah Kebangsaan"}))
items["CN-REG-0254"] = reg({
    "vi": "công tác bảo trợ năm loại đối tượng ở nông thôn",
    "th": "งานสนับสนุนผู้ยากไร้ห้าประเภทในชนบท",
    "id": "Kerja Penyelenggaraan Lima Jaminan di Pedesaan",
    "ms": "Kerja Penyediaan Lima Jaminan di Luar Bandar"})

# 管理办法
MEAS = [
    ("CN-REG-0081", "dược phẩm phóng xạ", "ยารังสี", "Obat Radioaktif", "Ubat Radioaktif"),
    ("CN-REG-0179", "dịch vụ thông tin Internet", "บริการข้อมูลอินเทอร์เน็ต",
     "Layanan Informasi Internet", "Perkhidmatan Maklumat Internet"),
    ("CN-REG-0302", "khai thác và tái sinh rừng", "การตัดฟันและการฟื้นฟูป่า",
     "Penebangan dan Regenerasi Hutan", "Penebangan dan Penjanaan Semula Hutan"),
    ("CN-REG-0131", "các dự án xây dựng trọng điểm quốc gia", "โครงการก่อสร้างสำคัญแห่งชาติ",
     "Proyek Konstruksi Prioritas Nasional", "Projek Pembinaan Utama Negara"),
    ("CN-PIA-017", "đánh giá rủi ro an toàn dữ liệu mạng", "การประเมินความเสี่ยงด้านความปลอดภัยของข้อมูลเครือข่าย",
     "Penilaian Risiko Keamanan Data Jaringan", "Penilaian Risiko Keselamatan Data Rangkaian"),
    ("CN-REG-0194", "bảo vệ an ninh đối với việc kết nối quốc tế mạng thông tin máy tính",
     "การคุ้มครองความมั่นคงของการเชื่อมต่อระหว่างประเทศของเครือข่ายข้อมูลคอมพิวเตอร์",
     "Perlindungan Keamanan atas Penyambungan Internasional Jaringan Informasi Komputer",
     "Perlindungan Keselamatan bagi Penyambungan Antarabangsa Rangkaian Maklumat Komputer"),
]
for lid, vi, th, id_, ms in MEAS:
    items[lid] = meas({"vi": vi, "th": th, "id": id_, "ms": ms})

# 规定（非法院）
RULZ = [
    ("CN-REG-0274", "quản lý đăng ký tên doanh nghiệp", "การบริหารการจดทะเบียนชื่อวิสาหกิจ",
     "Pengelolaan Pendaftaran Nama Perusahaan", "Pengurusan Pendaftaran Nama Syarikat"),
    ("CN-REG-0196", "xử phạt hành chính đối với hành vi vi phạm pháp luật về giá",
     "การลงโทษทางปกครองสำหรับการกระทำที่ฝ่าฝืนกฎหมายเกี่ยวกับราคา",
     "Sanksi Administratif atas Pelanggaran Hukum di Bidang Harga",
     "Hukuman Pentadbiran bagi Pelanggaran Undang-Undang Harga"),
    ("CN-REG-0320", "bồi thường thiệt hại do thăm dò địa chấn dầu khí",
     "การชดเชยความเสียหายจากการสำรวจคลื่นไหวสะเทือนเพื่อหาปิโตรเลียม",
     "Kompensasi Kerugian akibat Eksplorasi Seismik Minyak dan Gas",
     "Pampasan Kerosakan akibat Eksplorasi Seismik Petroleum"),
]
for lid, vi, th, id_, ms in RULZ:
    items[lid] = rule({"vi": vi, "th": th, "id": id_, "ms": ms})

# 长标题（保留主体与机关）
put("CN-REG-0149",
    "Quy định của Quốc vụ viện về quản lý con dấu của cơ quan hành chính nhà nước, doanh nghiệp, đơn vị sự nghiệp và tổ chức xã hội",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการบริหารตราประทับขององค์กรปกครองแห่งรัฐ วิสาหกิจ หน่วยงานสาธารณะ และองค์กรทางสังคม",
    "Ketentuan Dewan Negara tentang Pengelolaan Cap Lembaga Administrasi Negara, Perusahaan, Unit Usaha, dan Organisasi Sosial",
    "Peruntukan Majlis Negara mengenai Pengurusan Cap Organ Pentadbiran Negara, Perusahaan, Unit Perkhidmatan dan Pertubuhan Sosial")
put("CN-REG-0066",
    "Quy định tạm thời về văn phòng đại diện đặc phái của Bộ Kinh tế và Thương mại Đối ngoại",
    "ข้อบังคับชั่วคราวว่าด้วยสำนักงานผู้แทนพิเศษของกระทรวงเศรษฐกิจและการค้าต่างประเทศ",
    "Peraturan Sementara tentang Kantor Perwakilan Khusus Kementerian Ekonomi dan Perdagangan Luar Negeri",
    "Peraturan Sementara mengenai Pejabat Perwakilan Khas Kementerian Ekonomi dan Perdagangan Luar Negeri")
put("CN-REG-0167",
    "Quy định về quản lý việc thành lập và biên chế các cơ quan hành chính của Quốc vụ viện",
    "ข้อบังคับว่าด้วยการบริหารการจัดตั้งและอัตรากำลังขององค์กรปกครองของคณะรัฐมนตรี",
    "Peraturan tentang Pengelolaan Pembentukan dan Formasi Lembaga Administrasi Dewan Negara",
    "Peraturan mengenai Pengurusan Penubuhan dan Perjawatan Organ Pentadbiran Majlis Negara")

# ============ 司法解释 ============
items["CN-JI-0072"] = interp(SPC_SPP, {
    "vi": "các vụ án tố tụng công ích do viện kiểm sát khởi kiện",
    "th": "คดีฟ้องคดีสาธารณะโดยอัยการ",
    "id": "Perkara Gugatan Kepentingan Publik oleh Kejaksaan",
    "ms": "Kes Saman Kepentingan Awam oleh Pendakwa Raya"})
items["CN-JI-0389"] = interp(SPC, {
    "vi": "xét xử tranh chấp dân sự về tiêu dùng trả trước",
    "th": "การพิจารณาข้อพิพาทแพ่งเกี่ยวกับการบริโภคแบบชำระล่วงหน้า",
    "id": "pemeriksaan sengketa perdata konsumsi prabayar",
    "ms": "perbicaraan pertikaian sivil penggunaan prabayar"})
items["CN-JI-0051"] = interp(SPC_SPP, {
    "vi": "xử lý vụ án hình sự gây nguy hại an toàn thực phẩm",
    "th": "การดำเนินคดีอาญาที่เป็นอันตรายต่อความปลอดภัยอาหาร",
    "id": "penanganan perkara pidana yang membahayakan keamanan pangan",
    "ms": "pengendalian kes jenayah yang membahayakan keselamatan makanan"})
items["CN-JI-0275"] = interp(SPC, {
    "vi": "xét xử vụ án bồi thường thiệt hại do tai nạn giao thông đường bộ",
    "th": "การพิจารณาคดีชดเชยความเสียหายจากอุบัติเหตุจราจรทางบก",
    "id": "pemeriksaan perkara kompensasi kerugian akibat kecelakaan lalu lintas jalan",
    "ms": "perbicaraan kes pampasan kerosakan akibat kemalangan jalan raya"})
items["CN-JI-0386"] = interp(SPC, {
    "vi": "xét xử vụ án tranh chấp trách nhiệm bồi thường thiệt hại y tế",
    "th": "การพิจารณาคดีข้อพิพาทความรับผิดในความเสียหายทางการแพทย์",
    "id": "pemeriksaan perkara sengketa tanggung jawab kerugian medis",
    "ms": "perbicaraan kes pertikaian tanggungjawab kerosakan perubatan"})
items["CN-JI-0064"] = interp(SPC_SPP, {
    "vi": "xử lý vụ án hình sự buôn lậu",
    "th": "การดำเนินคดีอาญาการลักลอบขนของหนีภาษี",
    "id": "penanganan perkara pidana penyelundupan",
    "ms": "pengendalian kes jenayah penyeludupan"})
items["CN-JI-0429"] = {
    "vi": "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Tố tụng Dân sự nước Cộng hòa Nhân dân Trung Hoa trong thủ tục thi hành án",
    "th": "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายวิธีพิจารณาความแพ่งแห่งสาธารณรัฐประชาชนจีนในกระบวนการบังคับคดี",
    "id": "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum Acara Perdata Republik Rakyat Tiongkok dalam Prosedur Pelaksanaan",
    "ms": "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Tatacara Sivil Republik Rakyat China dalam Prosedur Pelaksanaan",
}
items["CN-JI-0350"] = {
    "vi": "Giải thích của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong xét xử vụ án tranh chấp hợp đồng liên quan đến quyền sử dụng đất nhà nước",
    "th": "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาในการใช้กฎหมายเพื่อพิจารณาคดีข้อพิพาทสัญญาเกี่ยวกับสิทธิการใช้ที่ดินของรัฐ",
    "id": "Penafsiran Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Pemeriksaan Perkara Sengketa Kontrak terkait Hak Guna Tanah Negara",
    "ms": "Tafsiran Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Perbicaraan Kes Pertikaian Kontrak berkaitan Hak Guna Tanah Negara",
}
items["CN-JI-0355"] = {
    "vi": "Giải thích của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong xét xử vụ án tranh chấp liên quan đến khoán đất nông thôn",
    "th": "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาในการใช้กฎหมายเพื่อพิจารณาคดีข้อพิพาทเกี่ยวกับการรับเหมาที่ดินในชนบท",
    "id": "Penafsiran Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Pemeriksaan Perkara Sengketa terkait Kontrak Tanah Pedesaan",
    "ms": "Tafsiran Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Perbicaraan Kes Pertikaian berkaitan Kontrak Tanah Luar Bandar",
}
# 规定（法院）
items["CN-JI-0162"] = prov(SPC, {
    "vi": "của thủ tục giám đốc việc bồi thường nhà nước",
    "th": "ของกระบวนการกำกับดูแลการชดเชยของรัฐ",
    "id": "Prosedur Pengawasan Kompensasi Negara",
    "ms": "Prosedur Penyeliaan Pampasan Negara"})
items["CN-JI-0185"] = prov(SPC, {
    "vi": "điều tra tài sản trong thi hành án dân sự",
    "th": "การสืบทรัพย์ในกระบวนการบังคับคดีแพ่ง",
    "id": "Penyelidikan Harta dalam Pelaksanaan Perdata",
    "ms": "Siasatan Harta dalam Pelaksanaan Sivil"})
items["CN-JI-0278"] = prov(SPC, {
    "vi": "xét xử vụ án tranh chấp bảo lãnh độc lập",
    "th": "การพิจารณาคดีข้อพิพาทเกี่ยวกับหนังสือค้ำประกันอิสระ",
    "id": "pemeriksaan perkara sengketa jaminan independen",
    "ms": "perbicaraan kes pertikaian jaminan bebas"})
items["CN-JI-0158"] = prov(SPC, {
    "vi": "thi hành văn bản công chứng về nghĩa vụ nợ",
    "th": "การบังคับคดีตามเอกสารหนี้ที่รับรองโดยโนตารี",
    "id": "Pelaksanaan Akta Notaris mengenai Utang",
    "ms": "Pelaksanaan Akta Notari bagi Hutang"})
items["CN-JI-0180"] = prov(SPC, {
    "vi": "áp dụng pháp luật đối với việc giữ tàu và bán đấu giá tàu",
    "th": "การใช้กฎหมายเกี่ยวกับการยึดเรือและการขายทอดตลาดเรือ",
    "id": "Penerapan Hukum atas Penahanan dan Pelelangan Kapal",
    "ms": "Penggunaan Undang-Undang bagi Penahanan dan Lelongan Kapal"})
items["CN-JI-0411"] = prov(SPC, {
    "vi": "áp dụng Luật Công ty nước Cộng hòa Nhân dân Trung Hoa (IV)",
    "th": "การใช้พระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 4)",
    "id": "Penerapan Undang-Undang Perusahaan Republik Rakyat Tiongkok (IV)",
    "ms": "Penggunaan Akta Syarikat Republik Rakyat China (IV)"})
items["CN-JI-0405"] = {
    "vi": "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Bảo hiểm nước Cộng hòa Nhân dân Trung Hoa (III)",
    "th": "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายประกันภัยแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 3)",
    "id": "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Asuransi Republik Rakyat Tiongkok (III)",
    "ms": "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Akta Insurans Republik Rakyat China (III)",
}
items["CN-JI-0422"] = {
    "vi": "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Phần Trách nhiệm bồi thường thiệt hại ngoài hợp đồng của Bộ luật Dân sự nước Cộng hòa Nhân dân Trung Hoa (I)",
    "th": "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ภาคความรับผิดทางละเมิดแห่งประมวลกฎหมายแพ่งของสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "id": "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Bagian Tanggung Jawab Perbuatan Melawan Hukum Kitab Undang-Undang Hukum Perdata Republik Rakyat Tiongkok (I)",
    "ms": "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Bahagian Liabiliti Tort Kanun Undang-Undang Sivil Republik Rakyat China (I)",
}
items["CN-JI-0225"] = {
    "vi": "Quy định của Tòa án Nhân dân Tối cao về việc ủy ban bồi thường áp dụng thủ tục chất vấn đối chất để xét xử vụ án bồi thường nhà nước",
    "th": "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการที่คณะกรรมการชดเชยใช้กระบวนการซักถามพยานในการพิจารณาคดีชดเชยของรัฐ",
    "id": "Ketentuan Mahkamah Rakyat Agung tentang Penerapan Prosedur Pemeriksaan Silang oleh Komisi Kompensasi dalam Pemeriksaan Perkara Kompensasi Negara",
    "ms": "Peruntukan Mahkamah Rakyat Agung mengenai Penggunaan Prosedur Pemeriksaan Balas oleh Jawatankuasa Pampasan dalam Perbicaraan Kes Pampasan Negara",
}
items["CN-JI-0336"] = {
    "vi": "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xét xử vụ án tranh chấp xâm phạm quyền đối với giống cây trồng mới (II)",
    "th": "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาที่เฉพาะเจาะจงหลายประการในการใช้กฎหมายเพื่อพิจารณาคดีข้อพิพาทการละเมิดสิทธิในพันธุ์พืชใหม่ (ฉบับที่ 2)",
    "id": "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Pemeriksaan Perkara Sengketa Pelanggaran Hak Varietas Tanaman Baru (II)",
    "ms": "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Perbicaraan Kes Pertikaian Pelanggaran Hak Varieti Tanaman Baharu (II)",
}
items["CN-JI-0560"] = {
    "vi": "Quy định của Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cử, mời người có chuyên môn tham gia xử lý vụ án (áp dụng thử)",
    "th": "ข้อกำหนดของอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการแต่งตั้งและเชิญผู้มีความรู้เฉพาะทางเข้าร่วมดำเนินคดี (ทดลองใช้)",
    "id": "Ketentuan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penugasan dan Pengangkatan Orang dengan Pengetahuan Khusus untuk Ikut Menangani Perkara (Uji Coba)",
    "ms": "Peruntukan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penugasan dan Pelantikan Orang Berpengetahuan Khusus untuk Turut Mengendalikan Kes (Percubaan)",
}
items["CN-JI-0075"] = {
    "vi": "Quy định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề của thủ tục tịch thu thu nhập bất hợp pháp trong vụ án có người bị tình nghi hoặc bị cáo bỏ trốn, chết",
    "th": "ข้อกำหนดของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการของกระบวนการริบทรัพย์ที่ได้มาโดยมิชอบในคดีที่ผู้ต้องสงสัยหรือจำเลยหลบหนีหรือเสียชีวิต",
    "id": "Ketentuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Prosedur Perampasan Hasil Kejahatan dalam Perkara yang Tersangka atau Terdakwanya Melarikan Diri atau Meninggal",
    "ms": "Peruntukan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Prosedur Perampasan Hasil Jenayah dalam Kes yang Suspek atau Tertuduhnya Melarikan Diri atau Meninggal Dunia",
}
items["CN-JI-0080"] = {
    "vi": "Quy định bổ sung của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc xác định tội danh khi thi hành Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa (VII)",
    "th": "ข้อกำหนดเพิ่มเติมของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการกำหนดฐานความผิดในการใช้ประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 7)",
    "id": "Ketentuan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penetapan Nama Tindak Pidana dalam Pelaksanaan Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok (VII)",
    "ms": "Peruntukan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penetapan Nama Kesalahan Jenayah dalam Pelaksanaan Kanun Keseksaan Republik Rakyat China (VII)",
    "zh": "最高人民法院、最高人民检察院关于执行《中华人民共和国刑法》确定罪名的补充规定（七）",
}
items["CN-JI-0470"] = {
    "vi": "Quyết định của Tòa án Nhân dân Tối cao về việc sửa đổi Nội quy phòng xử án của Tòa án Nhân dân nước Cộng hòa Nhân dân Trung Hoa",
    "th": "คำสั่งของศาลประชาชนสูงสุดว่าด้วยการแก้ไขข้อบังคับห้องพิจารณาคดีของศาลประชาชนแห่งสาธารณรัฐประชาชนจีน",
    "id": "Keputusan Mahkamah Rakyat Agung tentang Perubahan Tata Tertib Ruang Sidang Pengadilan Rakyat Republik Rakyat Tiongkok",
    "ms": "Keputusan Mahkamah Rakyat Agung mengenai Pindaan Peraturan Bilik Mahkamah Mahkamah Rakyat Republik Rakyat China",
}

# ============ 双边安排（涉港澳，按一个中国口径） ============
items["CN-JI-0186"] = {
    "vi": "Thỏa thuận giữa Tòa án Đại lục và Tòa án Đặc khu Hành chính Ma Cao (Trung Quốc) về ủy thác lẫn nhau tống đạt văn bản tư pháp và thu thập chứng cứ trong các vụ án dân sự và thương mại",
    "th": "ข้อตกลงระหว่างศาลจีนแผ่นดินใหญ่กับศาลเขตบริหารพิเศษมาเก๊า (จีน) ว่าด้วยการมอบหมายซึ่งกันและกันในการส่งเอกสารศาลและการรวบรวมพยานหลักฐานในคดีแพ่งและพาณิชย์",
    "id": "Kesepakatan antara Pengadilan Tiongkok Daratan dan Pengadilan Daerah Administratif Khusus Makau (Tiongkok) tentang Saling Penugasan Penyampaian Dokumen Peradilan dan Pengambilan Bukti dalam Perkara Perdata dan Komersial",
    "ms": "Persetujuan antara Mahkamah Tanah Besar China dan Mahkamah Wilayah Pentadbiran Khas Macau (China) mengenai Saling Pengamanahan Penyampaian Dokumen Kehakiman dan Pengambilan Bukti dalam Kes Sivil dan Komersial",
}
items["CN-JI-0195"] = {
    "vi": "Thỏa thuận giữa Tòa án Đại lục và Đặc khu Hành chính Hồng Kông (Trung Quốc) về thi hành lẫn nhau phán quyết trọng tài",
    "th": "ข้อตกลงระหว่างศาลจีนแผ่นดินใหญ่กับเขตบริหารพิเศษฮ่องกง (จีน) ว่าด้วยการบังคับตามคำชี้ขาดอนุญาโตตุลาการซึ่งกันและกัน",
    "id": "Kesepakatan antara Pengadilan Tiongkok Daratan dan Daerah Administratif Khusus Hong Kong (Tiongkok) tentang Saling Pelaksanaan Putusan Arbitrase",
    "ms": "Persetujuan antara Mahkamah Tanah Besar China dan Wilayah Pentadbiran Khas Hong Kong (China) mengenai Saling Pelaksanaan Award Timbang Tara",
}
items["CN-JI-0246"] = {
    "vi": "Quy định của Tòa án Nhân dân Tối cao về công nhận và thi hành bản án dân sự của tòa án vùng Đài Loan (Trung Quốc)",
    "th": "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการรับรองและการบังคับคดีตามคำพิพากษาแพ่งของศาลในเขตไต้หวัน (จีน)",
    "id": "Ketentuan Mahkamah Rakyat Agung tentang Pengakuan dan Pelaksanaan Putusan Perdata Pengadilan di Wilayah Taiwan (Tiongkok)",
    "ms": "Peruntukan Mahkamah Rakyat Agung mengenai Pengiktirafan dan Pelaksanaan Penghakiman Sivil Mahkamah di Wilayah Taiwan (China)",
}

# ============ 决议 ============
items["CN-LAW-0001"] = {
    "vi": "Nghị quyết của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc khóa V về việc phê chuẩn Quy định về đặc khu kinh tế tỉnh Quảng Đông",
    "th": "มติของคณะกรรมาธิการสามัญสภาผู้แทนประชาชนแห่งชาติชุดที่ 5 ว่าด้วยการรับรองข้อบังคับว่าด้วยเขตเศรษฐกิจพิเศษมณฑลกวางตุ้ง",
    "id": "Resolusi Komite Tetap Kongres Rakyat Nasional Ke-5 tentang Pengesahan Peraturan tentang Kawasan Ekonomi Khusus Provinsi Guangdong",
    "ms": "Resolusi Jawatankuasa Tetap Kongres Rakyat Nasional Ke-5 mengenai Pengesahan Peraturan mengenai Zon Ekonomi Khas Wilayah Guangdong",
}

doc = {
    "batch": "cn-p1-b19",
    "scope": "CN 按条文数 28 条段 60 部（含司法解释、行政法规）",
    "note": "语义基准 title.zh 与官方 title.en；涉台港澳按一个中国口径括注国名；"
            "另修 1 处 zh 多余字符（CN-JI-0080 的「+」）。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "cn-p1-b19.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
