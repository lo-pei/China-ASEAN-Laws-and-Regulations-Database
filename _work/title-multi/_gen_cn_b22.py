# -*- coding: utf-8 -*-
"""CN 标题多语种批次生成器（第 22 批：按条文数 19–18 条段 60 部）。

语义基准：title.zh（中文原本，权威）。主体译名沿用既有批次。
"""
import json, io, os

items = {}


def put(lid, vi, th, id_, ms):
    items[lid] = {"vi": vi, "th": th, "id": id_, "ms": ms}


# ============ 行政法规 ============
put("CN-REG-0134",
    "Quy định về kiểm dịch y tế trong giao thông nội địa",
    "ข้อบังคับว่าด้วยการกักกันโรคทางการแพทย์ในการคมนาคมภายในประเทศ",
    "Peraturan tentang Karantina Kesehatan dalam Angkutan Domestik",
    "Peraturan mengenai Kuarantin Kesihatan dalam Pengangkutan Dalam Negara")

put("CN-REG-0160",
    "Thông báo của Quốc vụ viện về một số vấn đề liên quan đến việc áp dụng các quy định tạm thời "
    "về thuế giá trị gia tăng, thuế tiêu thụ đặc biệt, thuế doanh thu và các loại thuế khác "
    "đối với doanh nghiệp có vốn đầu tư nước ngoài và doanh nghiệp nước ngoài",
    "ประกาศของคณะรัฐมนตรีว่าด้วยปัญหาบางประการเกี่ยวกับการใช้ข้อบังคับชั่วคราวว่าด้วยภาษีมูลค่าเพิ่ม "
    "ภาษีสรรพสามิต ภาษีธุรกิจเฉพาะ และภาษีอื่น ๆ กับวิสาหกิจที่ลงทุนจากต่างประเทศและวิสาหกิจต่างประเทศ",
    "Pemberitahuan Dewan Negara tentang Beberapa Masalah Terkait Penerapan Peraturan Sementara "
    "tentang Pajak Pertambahan Nilai, Pajak Barang Mewah, Pajak Penjualan, dan Pajak Lainnya bagi "
    "Perusahaan Penanaman Modal Asing dan Perusahaan Asing",
    "Pemberitahuan Majlis Negara mengenai Beberapa Isu Berkaitan Penggunaan Peraturan Sementara "
    "tentang Cukai Nilai Tambah, Cukai Barang Mewah, Cukai Jualan dan Cukai Lain bagi Syarikat "
    "Pelaburan Asing dan Syarikat Asing")

put("CN-REG-0163",
    "Quy định của Quốc vụ viện về một số vấn đề dịch vụ công trực tuyến",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยปัญหาหลายประการเกี่ยวกับบริการภาครัฐออนไลน์",
    "Ketentuan Dewan Negara tentang Beberapa Masalah Pelayanan Publik Daring",
    "Peruntukan Majlis Negara mengenai Beberapa Isu Perkhidmatan Awam Dalam Talian")

put("CN-REG-0203",
    "Quy định về khen thưởng thành tích giảng dạy",
    "ข้อบังคับว่าด้วยการให้รางวัลผลงานการสอน",
    "Peraturan tentang Penghargaan Hasil Pengajaran",
    "Peraturan mengenai Anugerah Hasil Pengajaran")

put("CN-REG-0246",
    "Quy định tạm thời về quản lý chuyến bay không theo lịch trong vận tải hàng không dân dụng",
    "ข้อกำหนดชั่วคราวว่าด้วยการบริหารเที่ยวบินไม่ประจำในการขนส่งการบินพลเรือน",
    "Ketentuan Sementara tentang Pengelolaan Penerbangan Tidak Berjadwal dalam Angkutan Udara Sipil",
    "Peruntukan Sementara mengenai Pengurusan Penerbangan Tidak Berjadual dalam Pengangkutan Udara Awam")

put("CN-REG-0263",
    "Quy định đặc biệt về bảo vệ lao động nữ",
    "ข้อกำหนดพิเศษว่าด้วยการคุ้มครองแรงงานสตรี",
    "Ketentuan Khusus tentang Perlindungan Tenaga Kerja Perempuan",
    "Peruntukan Khas mengenai Perlindungan Pekerja Wanita")

put("CN-REG-0327",
    "Quy định về bảo hộ biểu trưng hội chợ triển lãm thế giới",
    "ข้อบังคับว่าด้วยการคุ้มครองสัญลักษณ์งานมหกรรมโลก",
    "Peraturan tentang Perlindungan Lambang Pameran Dunia",
    "Peraturan mengenai Perlindungan Lambang Pameran Dunia")

put("CN-REG-0356",
    "Biện pháp đăng ký việc người nước ngoài nhận nuôi con nuôi tại nước Cộng hòa Nhân dân Trung Hoa",
    "มาตรการขึ้นทะเบียนการรับบุตรบุญธรรมของชาวต่างชาติในสาธารณรัฐประชาชนจีน",
    "Tindakan Pendaftaran Pengangkatan Anak oleh Orang Asing di Republik Rakyat Tiongkok",
    "Langkah Pendaftaran Pengangkatan Anak oleh Warga Asing di Republik Rakyat China")

put("CN-REG-0365",
    "Biện pháp quản lý việc thu chương trình truyền hình do vệ tinh nước ngoài truyền tới "
    "bằng thiết bị thu mặt đất",
    "มาตรการบริหารการรับรายการโทรทัศน์ที่ส่งผ่านดาวเทียมต่างประเทศด้วยสถานีรับภาคพื้นดิน",
    "Tindakan Pengelolaan Penerimaan Program Televisi yang Disiarkan Satelit Asing melalui "
    "Fasilitas Penerima Bumi",
    "Langkah Pengurusan Penerimaan Program Televisyen yang Dihantar Satelit Asing melalui "
    "Kemudahan Penerima Bumi")

put("CN-REG-0439",
    "Biện pháp đăng ký việc công dân Trung Quốc nhận nuôi con nuôi",
    "มาตรการขึ้นทะเบียนการรับบุตรบุญธรรมของพลเมืองจีน",
    "Tindakan Pendaftaran Pengangkatan Anak oleh Warga Negara Tiongkok",
    "Langkah Pendaftaran Pengangkatan Anak oleh Warganegara China")

put("CN-REG-0064",
    "Biện pháp thực hiện việc thu thuế thu nhập cá nhân đối với thu nhập từ lãi tiền gửi tiết kiệm",
    "มาตรการดำเนินการจัดเก็บภาษีเงินได้บุคคลธรรมดาจากรายได้ดอกเบี้ยเงินฝากออมทรัพย์",
    "Tindakan Pelaksanaan Pemungutan Pajak Penghasilan Pribadi atas Penghasilan Bunga Simpanan",
    "Langkah Pelaksanaan Pemungutan Cukai Pendapatan Peribadi atas Pendapatan Faedah Simpanan")

put("CN-REG-0139",
    "Quy định tạm thời của Quốc vụ viện về việc tính thâm niên công tác khi công chức cơ quan "
    "nhà nước thôi việc hoặc nghỉ hưu",
    "ข้อกำหนดชั่วคราวของคณะรัฐมนตรีว่าด้วยการคำนวณอายุงานเมื่อข้าราชการหน่วยงานของรัฐลาออก"
    "หรือเกษียณอายุ",
    "Ketentuan Sementara Dewan Negara tentang Penghitungan Masa Kerja saat Pegawai Badan Negara "
    "Berhenti atau Pensiun",
    "Peruntukan Sementara Majlis Negara mengenai Pengiraan Tempoh Perkhidmatan apabila Pegawai "
    "Badan Kerajaan Berhenti atau Bersara")

put("CN-REG-0161",
    "Quy định của Quốc vụ viện về việc tặng và nhận quà trong hoạt động công vụ đối ngoại",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการให้และการรับของขวัญในกิจกรรมราชการต่างประเทศ",
    "Ketentuan Dewan Negara tentang Pemberian dan Penerimaan Hadiah dalam Kegiatan Dinas Luar Negeri",
    "Peruntukan Majlis Negara mengenai Pemberian dan Penerimaan Hadiah dalam Aktiviti Tugas Luar Negara")

put("CN-REG-0610",
    "Biện pháp thu phí trọng tài của ủy ban trọng tài",
    "มาตรการการเรียกเก็บค่าธรรมเนียมอนุญาโตตุลาการของคณะอนุญาโตตุลาการ",
    "Tindakan Pemungutan Biaya Arbitrase oleh Komite Arbitrase",
    "Langkah Pemungutan Bayaran Timbang Tara oleh Jawatankuasa Timbang Tara")

put("CN-REG-0068",
    "Biện pháp sử dụng hình quốc huy trong quan hệ đối ngoại",
    "มาตรการการใช้รูปตราแผ่นดินในความสัมพันธ์กับต่างประเทศ",
    "Tindakan Penggunaan Gambar Lambang Negara dalam Hubungan Luar Negeri",
    "Langkah Penggunaan Gambar Lambang Negara dalam Hubungan Luar Negara")

put("CN-REG-0083",
    "Biện pháp quản lý an ninh trật tự ngành thu mua kim loại phế liệu",
    "มาตรการบริหารความสงบเรียบร้อยในธุรกิจรับซื้อโลหะเศษ",
    "Tindakan Pengelolaan Ketertiban dan Keamanan Usaha Pembelian Logam Bekas",
    "Langkah Pengurusan Ketenteraman dan Keselamatan Perniagaan Pembelian Logam Terpakai")

put("CN-REG-0092",
    "Quy định tạm thời của Bộ Công an về việc quản lý một số loại dao",
    "ข้อกำหนดชั่วคราวของกระทรวงความมั่นคงสาธารณะว่าด้วยการควบคุมมีดบางประเภท",
    "Ketentuan Sementara Kementerian Keamanan Publik tentang Pengendalian Sebagian Jenis Pisau",
    "Peruntukan Sementara Kementerian Keselamatan Awam mengenai Kawalan Sebahagian Jenis Pisau")

put("CN-REG-0111",
    "Quy định về việc thực hiện chế độ bổ nhiệm chức danh chuyên môn kỹ thuật",
    "ข้อกำหนดว่าด้วยการดำเนินการตามระบบการแต่งตั้งตำแหน่งวิชาชีพเฉพาะทาง",
    "Ketentuan tentang Pelaksanaan Sistem Pengangkatan Jabatan Profesional Teknis",
    "Peruntukan mengenai Pelaksanaan Sistem Pelantikan Jawatan Profesional Teknikal")

put("CN-REG-0112",
    "Quy định tạm thời về quản lý biểu mẫu thống kê",
    "ข้อกำหนดชั่วคราวว่าด้วยการบริหารแบบรายงานสถิติ",
    "Ketentuan Sementara tentang Pengelolaan Formulir Laporan Statistik",
    "Peruntukan Sementara mengenai Pengurusan Borang Laporan Statistik")

put("CN-REG-0129",
    "Quy định về quản lý kinh phí bồi thường nhà nước",
    "ข้อบังคับว่าด้วยการบริหารงบประมาณค่าชดเชยของรัฐ",
    "Peraturan tentang Pengelolaan Anggaran Kompensasi Negara",
    "Peraturan mengenai Pengurusan Peruntukan Pampasan Negara")

put("CN-REG-0177",
    "Quy định về việc báo cáo thông tin liên quan đến thuế của doanh nghiệp nền tảng Internet",
    "ข้อกำหนดว่าด้วยการยื่นรายงานข้อมูลเกี่ยวกับภาษีของวิสาหกิจแพลตฟอร์มอินเทอร์เน็ต",
    "Ketentuan tentang Pelaporan Informasi Perpajakan oleh Perusahaan Platform Internet",
    "Peruntukan mengenai Pelaporan Maklumat Percukaian oleh Syarikat Platform Internet")

put("CN-REG-0195",
    "Quy định tạm thời về tăng cường quản lý hoạt động xuất bản hợp tác với nước ngoài",
    "ข้อกำหนดชั่วคราวว่าด้วยการเสริมสร้างการบริหารการพิมพ์เผยแพร่โดยความร่วมมือกับต่างประเทศ",
    "Ketentuan Sementara tentang Penguatan Pengelolaan Penerbitan Kerja Sama dengan Luar Negeri",
    "Peruntukan Sementara mengenai Pengukuhan Pengurusan Penerbitan Kerjasama dengan Luar Negara")

put("CN-REG-0213",
    "Quy định về cấm sử dụng lao động trẻ em",
    "ข้อกำหนดว่าด้วยการห้ามใช้แรงงานเด็ก",
    "Ketentuan tentang Larangan Penggunaan Pekerja Anak",
    "Peruntukan mengenai Larangan Penggunaan Pekerja Kanak-Kanak")

put("CN-REG-0357",
    "Quy định tạm thời về quản lý phòng thương mại nước ngoài",
    "ข้อกำหนดชั่วคราวว่าด้วยการบริหารหอการค้าต่างประเทศ",
    "Ketentuan Sementara tentang Pengelolaan Kamar Dagang Asing",
    "Peruntukan Sementara mengenai Pengurusan Dewan Perniagaan Asing")

put("CN-REG-0404",
    "Biện pháp quản lý thuốc độc dùng trong y tế",
    "มาตรการบริหารยาพิษที่ใช้ทางการแพทย์",
    "Tindakan Pengelolaan Obat Beracun untuk Keperluan Medis",
    "Langkah Pengurusan Ubat Beracun untuk Kegunaan Perubatan")

# ============ 司法解释 ============
put("CN-JI-0017",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về trộm cắp",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการลักทรัพย์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Pencurian",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Kecurian")

put("CN-JI-0066",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về tổ chức, cưỡng bức, dụ dỗ, chứa chấp, "
    "giới thiệu mại dâm",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการจัดตั้ง การบังคับ การชักจูง การให้ที่พักพิง และการแนะนำการค้าประเวณี",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Penyelenggaraan, Pemaksaan, Membujuk, "
    "Menampung, dan Memfasilitasi Pelacuran",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Penganjuran, Paksaan, Memujuk, Menempatkan "
    "dan Memperkenalkan Pelacuran")

put("CN-JI-0103",
    "Quy định của Tòa án Nhân dân Tối cao về vấn đề thẩm tra việc thi hành phần hình phạt về tài sản "
    "trong xử lý vụ án giảm án, tạm tha",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการตรวจสอบการบังคับคดีในส่วนโทษเกี่ยวกับทรัพย์สิน"
    "ในการดำเนินคดีลดโทษและพักโทษ",
    "Ketentuan Mahkamah Rakyat Agung tentang Pemeriksaan Pelaksanaan Putusan Bersifat Harta "
    "dalam Penanganan Perkara Pengurangan Hukuman dan Pembebasan Bersyarat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pemeriksaan Pelaksanaan Perintah Bersifat Harta "
    "dalam Pengendalian Kes Pengurangan Hukuman dan Pembebasan Bersyarat")

put("CN-JI-0173",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề điều tra viên kỹ thuật tham gia "
    "hoạt động tố tụng trong vụ án sở hữu trí tuệ",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการเข้าร่วมกิจกรรมกระบวนการ"
    "พิจารณาคดีของผู้สอบสวนทางเทคนิคในคดีทรัพย์สินทางปัญญา",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Keikutsertaan Penyidik Teknis "
    "dalam Kegiatan Litigasi Perkara Kekayaan Intelektual",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penyertaan Penyiasat Teknikal "
    "dalam Aktiviti Litigasi Kes Harta Intelek")

put("CN-JI-0285",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng cụ thể pháp luật "
    "trong xét xử vụ án hình sự về huy động vốn trái phép",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการพิจารณาคดีอาญาเกี่ยวกับการระดมทุนโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum secara Khusus "
    "dalam Pemeriksaan Perkara Pidana Penghimpunan Dana secara Melawan Hukum",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang secara Khusus "
    "dalam Perbicaraan Kes Jenayah Pengumpulan Dana secara Menyalahi Undang-Undang")

put("CN-JI-0340",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp hợp đồng cho thuê tài chính",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดี"
    "ข้อพิพาทสัญญาเช่าการเงิน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Perjanjian Sewa Guna Usaha",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Perjanjian Pajakan Kewangan")

put("CN-JI-0353",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án hành chính "
    "liên quan đến đất đai tập thể nông thôn",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีปกครองที่เกี่ยวกับ"
    "ที่ดินส่วนรวมในชนบท",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Tata "
    "Usaha Negara terkait Tanah Kolektif Pedesaan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pentadbiran "
    "berkaitan Tanah Kolektif Luar Bandar")

put("CN-JI-0379",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án giao hàng không có vận đơn gốc",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดี"
    "การส่งมอบสินค้าโดยไม่มีใบตราส่งต้นฉบับ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Penyerahan Barang tanpa Bill of Lading Asli",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Penyerahan Barang tanpa Bil Muatan Asli")

put("CN-JI-0391",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án hành chính về công khai thông tin chính phủ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีปกครอง"
    "เกี่ยวกับการเปิดเผยข้อมูลภาครัฐ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Tata Usaha Negara tentang Keterbukaan Informasi Pemerintah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pentadbiran mengenai Keterbukaan Maklumat Kerajaan")

put("CN-JI-0400",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thực hiện chế độ hồi tỵ của người "
    "tiến hành tố tụng trong hoạt động tố tụng",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ระบบการถอนตัวจากการพิจารณาคดี"
    "ของตุลาการในกิจกรรมกระบวนการพิจารณาคดี",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Sistem Penarikan Diri "
    "Hakim dalam Kegiatan Litigasi",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pelaksanaan Sistem Pengunduran Diri "
    "Hakim dalam Aktiviti Litigasi")

put("CN-JI-0456",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề ủy thác thi hành án",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการมอบหมายการบังคับคดี",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penugasan Pelaksanaan Putusan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pengamanahan Pelaksanaan")

put("CN-JI-0465",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề người phụ trách cơ quan hành chính "
    "ra tòa tham gia tố tụng",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการขึ้นศาลเพื่อต่อสู้คดี"
    "ของผู้รับผิดชอบหน่วยงานปกครอง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Kehadiran Pejabat Badan Administratif "
    "di Persidangan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Kehadiran Pegawai Badan Pentadbiran "
    "di Mahkamah")

put("CN-JI-0467",
    "Quy định của Tòa án Nhân dân Tối cao về trình tự thụ lý vụ án hành chính có đơn đề nghị xét xử lại",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยกระบวนการรับคดีปกครองที่มีคำร้องขอพิจารณาใหม่",
    "Ketentuan Mahkamah Rakyat Agung tentang Prosedur Pendaftaran Perkara Tata Usaha Negara "
    "dengan Permohonan Peninjauan Kembali",
    "Peruntukan Mahkamah Rakyat Agung mengenai Prosedur Pendaftaran Kes Pentadbiran dengan "
    "Permohonan Semakan Semula")

put("CN-JI-0038",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về hủy hoại nguồn tài nguyên đất đen",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการทำลายทรัพยากรดินดำ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Perusakan Sumber Daya Tanah Hitam",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Sumber Tanah Hitam")

put("CN-JI-0240",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong công tác thi hành án của "
    "tòa án nhân dân (thí điểm)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในงานบังคับคดีของศาลประชาชน (ทดลองใช้)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Kerja Pelaksanaan Putusan "
    "Pengadilan Rakyat (Uji Coba)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Kerja Pelaksanaan Mahkamah "
    "Rakyat (Percubaan)")

put("CN-JI-0277",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án phạm tội về ma túy",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดี"
    "ความผิดเกี่ยวกับยาเสพติด",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Tindak Pidana Narkotika",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Kesalahan Dadah")

put("CN-JI-0283",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án về đăng ký nhà ở",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีเกี่ยวกับการจดทะเบียนที่อยู่อาศัย",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara "
    "Pendaftaran Rumah",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pendaftaran Rumah")

put("CN-JI-0291",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong việc xác định "
    "trách nhiệm bồi thường thiệt hại về tinh thần khi xét xử vụ án bồi thường nhà nước",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการกำหนดความรับผิด"
    "ชดเชยความเสียหายทางจิตใจในการพิจารณาคดีชดเชยของรัฐ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penetapan "
    "Tanggung Jawab Ganti Kerugian Immateriel pada Pemeriksaan Perkara Kompensasi Negara",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Penetapan Tanggungjawab Pampasan Kerugian Mental dalam Perbicaraan Kes Pampasan Negara")

put("CN-JI-0334",
    "Giải thích của Tòa án Nhân dân Tối cao về việc áp dụng bồi thường mang tính trừng phạt "
    "trong xét xử vụ án tranh chấp dân sự về xâm phạm quyền sở hữu trí tuệ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการใช้การชดเชยค่าเสียหายเชิงลงโทษในการพิจารณาคดี"
    "ข้อพิพาทแพ่งเกี่ยวกับการละเมิดสิทธิทรัพย์สินทางปัญญา",
    "Penafsiran Mahkamah Rakyat Agung tentang Penerapan Ganti Kerugian Bersifat Hukuman dalam "
    "Pemeriksaan Perkara Sengketa Perdata Pelanggaran Hak Kekayaan Intelektual",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penggunaan Pampasan Bersifat Hukuman dalam "
    "Perbicaraan Kes Pertikaian Sivil Pelanggaran Hak Harta Intelek")

put("CN-JI-0348",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp dân sự liên quan đến bảo hộ nhãn hiệu nổi tiếng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดี"
    "ข้อพิพาทแพ่งที่เกี่ยวกับการคุ้มครองเครื่องหมายการค้าที่มีชื่อเสียงเป็นที่รู้จัก",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Perdata terkait Perlindungan Merek Terkenal",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Sivil berkaitan Perlindungan Cap Dagangan Terkenal")

put("CN-JI-0360",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án dân sự tranh chấp "
    "quyền sáng chế liên quan đến dược phẩm nộp đơn đăng ký",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีแพ่งข้อพิพาทสิทธิบัตร"
    "ที่เกี่ยวกับยาที่ขอขึ้นทะเบียน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Perdata "
    "Sengketa Hak Paten terkait Obat yang Dimohonkan Pendaftaran",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Sivil Pertikaian "
    "Hak Paten berkaitan Ubat yang Dimohon Pendaftaran")

put("CN-JI-0361",
    "Giải thích của Tòa án Nhân dân Tối cao về việc áp dụng bồi thường mang tính trừng phạt "
    "trong xét xử vụ án tranh chấp xâm phạm môi trường sinh thái",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการใช้การชดเชยค่าเสียหายเชิงลงโทษในการพิจารณาคดี"
    "ข้อพิพาทการละเมิดสิ่งแวดล้อมเชิงนิเวศ",
    "Penafsiran Mahkamah Rakyat Agung tentang Penerapan Ganti Kerugian Bersifat Hukuman dalam "
    "Pemeriksaan Perkara Sengketa Pelanggaran Lingkungan Ekologis",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penggunaan Pampasan Bersifat Hukuman dalam "
    "Perbicaraan Kes Pertikaian Pelanggaran Alam Sekitar Ekologi")

put("CN-JI-0364",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp dân sự về an toàn thực phẩm (I)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดี"
    "ข้อพิพาทแพ่งเกี่ยวกับความปลอดภัยอาหาร (ฉบับที่ 1)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Perdata tentang Keamanan Pangan (I)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Sivil mengenai Keselamatan Makanan (I)")

put("CN-JI-0035",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc áp dụng cụ thể "
    "pháp luật trong xử lý vụ án hình sự về sử dụng Internet, thiết bị đầu cuối thông tin di động, "
    "tổng đài thoại để sản xuất, sao chép, xuất bản, buôn bán, truyền bá thông tin điện tử khiêu dâm (II)",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการดำเนินคดีอาญาเกี่ยวกับการใช้อินเทอร์เน็ต เครื่องปลายทางสื่อสารเคลื่อนที่ และศูนย์บริการเสียง "
    "ในการผลิต ทำสำเนา จัดพิมพ์ ขาย และเผยแพร่ข้อมูลอิเล็กทรอนิกส์ลามก (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penerapan Hukum secara "
    "Khusus dalam Penanganan Perkara Pidana Penggunaan Internet, Terminal Komunikasi Bergerak, "
    "dan Pusat Layanan Suara untuk Memproduksi, Memperbanyak, Menerbitkan, Menjual, dan "
    "Menyebarkan Informasi Elektronik Cabul (II)",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang "
    "secara Khusus dalam Pengendalian Kes Jenayah Penggunaan Internet, Terminal Komunikasi Mudah "
    "Alih dan Pusat Perkhidmatan Suara untuk Menghasilkan, Menyalin, Menerbitkan, Menjual dan "
    "Menyebarkan Maklumat Elektronik Lucah (II)")

put("CN-JI-0042",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về xâm phạm thông tin cá nhân của công dân",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการละเมิดข้อมูลส่วนบุคคลของพลเมือง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Pelanggaran Informasi Pribadi Warga Negara",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Pelanggaran Maklumat Peribadi Warganegara")

put("CN-JI-0055",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về tấn công cảnh sát",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการทำร้ายเจ้าหน้าที่ตำรวจ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Penyerangan terhadap Polisi",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Serangan terhadap Anggota Polis")

put("CN-JI-0056",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về rửa tiền",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการฟอกเงิน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Pencucian Uang",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Pengubahan Wang Haram")

put("CN-JI-0058",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc áp dụng cụ thể "
    "pháp luật trong xử lý vụ án hình sự về đưa hối lộ",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการดำเนินคดีอาญาเกี่ยวกับการให้สินบน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penerapan Hukum secara "
    "Khusus dalam Penanganan Perkara Pidana Pemberian Suap",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang "
    "secara Khusus dalam Pengendalian Kes Jenayah Pemberian Rasuah")

put("CN-JI-0078",
    "Quyết định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc sửa đổi "
    "Giải thích về một số vấn đề áp dụng cụ thể pháp luật trong xử lý vụ án hình sự về cản trở "
    "quản lý thẻ tín dụng",
    "มติของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการแก้ไขเพิ่มเติมการตีความว่าด้วย"
    "ปัญหาหลายประการในการใช้กฎหมายอย่างเฉพาะเจาะจงในการดำเนินคดีอาญาเกี่ยวกับการขัดขวาง"
    "การบริหารบัตรเครดิต",
    "Keputusan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Perubahan atas Penafsiran "
    "tentang Beberapa Masalah Penerapan Hukum secara Khusus dalam Penanganan Perkara Pidana "
    "Penghambatan Pengelolaan Kartu Kredit",
    "Keputusan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Pindaan Tafsiran tentang "
    "Beberapa Isu Penggunaan Undang-Undang secara Khusus dalam Pengendalian Kes Jenayah "
    "Penghalangan Pengurusan Kad Kredit")

put("CN-JI-0104",
    "Quy định của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật trong xử lý vụ án về lệnh "
    "bảo vệ an toàn thân thể",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายในการดำเนินคดีเกี่ยวกับคำสั่งคุ้มครอง"
    "ความปลอดภัยของบุคคล",
    "Ketentuan Mahkamah Rakyat Agung tentang Penerapan Hukum dalam Penanganan Perkara Perintah "
    "Perlindungan Keselamatan Pribadi",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang dalam Pengendalian Kes "
    "Perintah Perlindungan Keselamatan Diri")

put("CN-JI-0108",
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền thụ lý vụ án của Tòa án Tài chính Bắc Kinh",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจการรับคดีของศาลการเงินปักกิ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Yurisdiksi Perkara Pengadilan Keuangan Beijing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Mahkamah Kewangan Beijing")

put("CN-JI-0156",
    "Quy định của Tòa án Nhân dân Tối cao về việc công bố thông tin danh sách người phải thi hành án "
    "mất tín nhiệm",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการเปิดเผยข้อมูลรายชื่อลูกหนี้ตามคำพิพากษาที่ขาดความน่าเชื่อถือ",
    "Ketentuan Mahkamah Rakyat Agung tentang Publikasi Informasi Daftar Pihak yang Wajib Dieksekusi "
    "yang Tidak Dapat Dipercaya",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penerbitan Maklumat Senarai Pihak yang Wajib "
    "Dilaksanakan yang Tidak Boleh Dipercayai")

# ============ 法律决定 / 数据合规 ============
put("CN-LAW-0041",
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về việc sửa đổi "
    "Luật An ninh mạng nước Cộng hòa Nhân dân Trung Hoa",
    "มติของคณะกรรมาธิการสามัญสภาผู้แทนประชาชนแห่งชาติว่าด้วยการแก้ไขเพิ่มเติมกฎหมายความมั่นคง"
    "ปลอดภัยไซเบอร์แห่งสาธารณรัฐประชาชนจีน",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Perubahan atas Undang-Undang Keamanan "
    "Siber Republik Rakyat Tiongkok",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan tentang Pindaan Undang-Undang "
    "Keselamatan Siber Republik Rakyat China")

put("CN-PIA-009",
    "Quy định về thúc đẩy và chuẩn mực hóa dòng chảy dữ liệu xuyên biên giới",
    "ข้อกำหนดว่าด้วยการส่งเสริมและกำหนดมาตรฐานการไหลของข้อมูลข้ามพรมแดน",
    "Ketentuan tentang Pendorongan dan Standardisasi Arus Data Lintas Batas",
    "Peruntukan mengenai Penggalakan dan Penyeragaman Aliran Data Merentas Sempadan")

put("CN-PIA-018",
    "Biện pháp quản lý báo cáo sự cố an ninh mạng quốc gia",
    "มาตรการบริหารการรายงานเหตุการณ์ความมั่นคงปลอดภัยไซเบอร์แห่งชาติ",
    "Tindakan Pengelolaan Pelaporan Insiden Keamanan Siber Nasional",
    "Langkah Pengurusan Pelaporan Insiden Keselamatan Siber Kebangsaan")

doc = {
    "batch": "cn-p1-b22",
    "scope": "CN 按条文数 19–18 条段 60 部（司法解释 28、行政法规 27、法律决定 1、数据合规办法 2、省级 2）",
    "note": "语义基准 title.zh；主体译名沿用既有批次。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "cn-p1-b22.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
