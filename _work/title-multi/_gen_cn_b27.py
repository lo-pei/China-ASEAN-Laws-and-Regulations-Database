# -*- coding: utf-8 -*-
"""CN 第 27 批：_cn_rest.json 第 480–539 条（60 部）。"""
import io, json, os

ITEMS = {}
ZH_FIX = {}

ITEMS["CN-JI-0122"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về hiệu lực của điều khoản thỏa thuận giữa doanh nghiệp lớn và doanh nghiệp vừa và nhỏ về việc lấy khoản tiền do bên thứ ba thanh toán làm điều kiện thanh toán",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยผลใช้บังคับของข้อสัญญาระหว่างวิสาหกิจขนาดใหญ่กับวิสาหกิจขนาดกลางและขนาดย่อมที่กำหนดให้การชำระเงินโดยบุคคลที่สามเป็นเงื่อนไขของการชำระเงิน",
    "Jawaban Mahkamah Rakyat Agung tentang Kekuatan Berlaku Ketentuan Perjanjian antara Badan Usaha Besar dan Badan Usaha Menengah serta Kecil yang Menetapkan Pembayaran oleh Pihak Ketiga sebagai Prasyarat Pembayaran",
    "Jawapan Mahkamah Rakyat Agung mengenai Kuat Kuasa Peruntukan Persetujuan antara Perusahaan Besar dengan Perusahaan Sederhana dan Kecil yang Menetapkan Pembayaran oleh Pihak Ketiga sebagai Prasyarat Pembayaran",
)
ITEMS["CN-JI-0217"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý khi tòa án phát hiện quyết định bảo toàn tài sản trước khởi kiện hoặc quyết định thi hành án do mình ban hành có sai sót, hoặc khi Viện Kiểm sát kháng nghị quyết định đó",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการเมื่อศาลพบว่าคำสั่งคุ้มครองทรัพย์สินก่อนฟ้องหรือคำสั่งในชั้นบังคับคดีที่ตนออกมีความผิดพลาด หรือเมื่ออัยการยื่นคำคัดค้านคำสั่งนั้น",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan ketika Pengadilan Menemukan Kekeliruan pada Penetapan Penjaminan Harta sebelum Gugatan atau Penetapan Pelaksanaan yang Diterbitkannya, atau ketika Kejaksaan Mengajukan Perlawanan atas Penetapan Tersebut",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian apabila Mahkamah Mendapati Kesilapan pada Penetapan Pemuliharaan Harta sebelum Guaman atau Penetapan Pelaksanaan yang Dikeluarkannya, atau apabila Kejaksaan Mengemukakan Bantahan atas Penetapan Itu",
)
ITEMS["CN-JI-0274"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc xử lý vụ án hình sự về đầu cơ vé tàu",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการที่เกี่ยวข้องกับการพิจารณาคดีอาญาเกี่ยวกับการค้าปลีกตั๋วรถไฟ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penanganan Perkara Pidana Perdagangan Tiket Kereta Api",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Pengendalian Kes Jenayah Perdagangan Tiket Keretapi",
)
ITEMS["CN-JI-0443"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề liên quan đến khoản 2 Điều 225 Bộ luật Tố tụng Hình sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาที่เกี่ยวข้องกับวรรคสองของมาตรา 225 แห่งประมวลกฎหมายวิธีพิจารณาความอาญา",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah terkait Ayat (2) Pasal 225 Kitab Undang-Undang Hukum Acara Pidana",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Berkaitan Fasal (2) Seksyen 225 Kanun Undang-Undang Prosedur Jenayah",
)
ITEMS["CN-JI-0449"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến bảo toàn tài sản trước khởi kiện",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการคุ้มครองทรัพย์สินก่อนฟ้อง",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penjaminan Harta sebelum Gugatan",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Pemuliharaan Harta sebelum Guaman",
)
ITEMS["CN-JI-0466"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thủ tục bồi thường khi nhân viên cơ quan hành chính gây thương vong cho người khác trong khi thi hành công vụ và hành vi đó cấu thành tội phạm",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการชดเชยเมื่อเจ้าหน้าที่หน่วยงานปกครองก่อให้เกิดการบาดเจ็บหรือเสียชีวิตแก่ผู้อื่นในการปฏิบัติหน้าที่และเป็นการกระทำความผิดอาญา",
    "Jawaban Mahkamah Rakyat Agung tentang Tata Cara Ganti Rugi ketika Pegawai Badan Administrasi Menyebabkan Cedera atau Kematian Orang Lain dalam Pelaksanaan Tugas dan Perbuatan Itu Merupakan Tindak Pidana",
    "Jawapan Mahkamah Rakyat Agung mengenai Tatacara Pampasan apabila Pegawai Badan Pentadbiran Menyebabkan Kecederaan atau Kematian Orang Lain semasa Melaksanakan Tugas dan Perbuatan Itu Merupakan Kesalahan Jenayah",
)
ITEMS["CN-JI-0487"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách tính lãi nợ trong thời gian chậm thi hành án khi thực hiện công tác thi hành án",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีคำนวณดอกเบี้ยหนี้ระหว่างระยะเวลาการบังคับคดีล่าช้าในการปฏิบัติงานบังคับคดี",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Penghitungan Bunga Utang selama Tenggang Waktu Pelaksanaan yang Tertunda dalam Pelaksanaan Putusan",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Pengiraan Faedah Hutang sepanjang Tempoh Pelaksanaan yang Lewat dalam Pelaksanaan Penghakiman",
)
ITEMS["CN-JI-0503"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong việc thụ lý, thi hành phán quyết \"trọng tài trước\" hoặc quyết định hòa giải của tổ chức trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาการใช้กฎหมายในการรับคดีและการบังคับตามคำชี้ขาด \"อนุญาโตตุลาการล่วงหน้า\" หรือบันทึกข้อตกลงไกล่เกลี่ยของสถาบันอนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Pendaftaran dan Pelaksanaan Putusan \"Arbitrase Pendahuluan\" atau Akta Perdamaian Lembaga Arbitrase",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Pendaftaran dan Pelaksanaan Award \"Timbang Tara Awal\" atau Akta Perdamaian Institusi Timbang Tara",
)
ITEMS["CN-JI-0509"] = (
    "Trả lời qua điện thoại của Tòa Hành chính Tòa án Nhân dân Tối cao về cách tính thời hạn truy cứu đối với hành vi bán đồ vật khiêu dâm",
    "คำตอบทางโทรศัพท์ของศาลปกครองประจำศาลประชาชนสูงสุดว่าด้วยวิธีการคำนวณอายุความในการดำเนินคดีสำหรับการขายสิ่งของลามกอนาจาร",
    "Jawaban melalui Telepon Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Cara Penghitungan Tenggang Waktu Penuntutan atas Perbuatan Menjual Barang Cabul",
    "Jawapan melalui Telefon Mahkamah Pentadbiran Mahkamah Rakyat Agung mengenai Cara Pengiraan Tempoh Pendakwaan bagi Perbuatan Menjual Barang Lucah",
)
ITEMS["CN-REG-0137"] = (
    "Quyết định của Quốc vụ viện về việc đặt ra giấy phép hành chính đối với các dự án phê duyệt hành chính thực sự cần duy trì",
    "มติของคณะรัฐมนตรีว่าด้วยการกำหนดใบอนุญาตทางปกครองสำหรับโครงการที่ต้องขออนุมัติทางปกครองซึ่งจำเป็นต้องคงไว้จริง",
    "Keputusan Dewan Negara tentang Penetapan Izin Administratif bagi Proyek Persetujuan Administratif yang Benar-Benar Perlu Dipertahankan",
    "Keputusan Majlis Negara mengenai Penetapan Lesen Pentadbiran bagi Projek Kelulusan Pentadbiran yang Benar-Benar Perlu Dikekalkan",
)
ITEMS["CN-JI-0014"] = (
    "Trả lời của Phòng Nghiên cứu Tòa án Nhân dân Tối cao, Viện Kiểm sát Nhân dân Tối cao, Bộ Công an và Bộ Lao động và Nhân sự về việc hủy bỏ quyết định giảm án theo điều khoản pháp luật nào khi tòa án xét xử sơ thẩm phát hiện bản án có sai sót và sửa án đối với phạm nhân tù chung thân đã được giảm án",
    "คำตอบของฝ่ายวิจัยศาลประชาชนสูงสุด อัยการประชาชนสูงสุด กระทรวงความมั่นคงสาธารณะ และกระทรวงแรงงานและทรัพยากรบุคคลว่าด้วยการเพิกถอนคำสั่งลดโทษตามข้อกฎหมายใดเมื่อศาลชั้นต้นพบว่าคำพิพากษามีข้อผิดพลาดและแก้ไขคำพิพากษาสำหรับนักโทษจำคุกตลอดชีวิตที่ได้รับการลดโทษแล้ว",
    "Jawaban Bagian Penelitian Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung, Kementerian Keamanan Publik dan Kementerian Tenaga Kerja serta Sumber Daya Manusia tentang Pencabutan Penetapan Pengurangan Pidana berdasarkan Ketentuan Hukum yang Mana ketika Pengadilan Tingkat Pertama Menemukan Kekeliruan Putusan dan Mengubah Putusan bagi Narapidana Penjara Seumur Hidup yang Telah Memperoleh Pengurangan Pidana",
    "Jawapan Bahagian Penyelidikan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung, Kementerian Keselamatan Awam dan Kementerian Buruh serta Sumber Manusia mengenai Pembatalan Penetapan Pengurangan Hukuman menurut Peruntukan Undang-Undang yang Mana apabila Mahkamah Peringkat Pertama Mendapati Kesilapan Penghakiman dan Mengubah Penghakiman bagi Banduan Penjara Seumur Hidup yang Telah Memperoleh Pengurangan Hukuman",
)
ITEMS["CN-JI-0054"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với vụ án hình sự làm giả, buôn bán giấy chứng nhận học vấn, học vị của trường đại học, cao đẳng bị làm giả",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายในคดีอาญาเกี่ยวกับการปลอมแปลงและการจำหน่ายหนังสือรับรองวุฒิการศึกษาและปริญญาของสถาบันอุดมศึกษาที่ถูกปลอมแปลง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penerapan Hukum dalam Perkara Pidana Pemalsuan dan Penjualan Ijazah serta Sertifikat Gelar Perguruan Tinggi yang Dipalsukan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang dalam Kes Jenayah Pemalsuan dan Penjualan Sijil Kelayakan serta Ijazah Institusi Pengajian Tinggi yang Dipalsukan",
)
ITEMS["CN-JI-0068"] = (
    "Thông cáo của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc không truy cứu nữa đối với hành vi phạm tội của những người đã đi sang Đài Loan trước khi nước Cộng hòa Nhân dân Trung Hoa ra đời",
    "ประกาศของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการไม่ดำเนินคดีต่อไปสำหรับการกระทำความผิดของผู้ที่ไปยังไต้หวันก่อนการสถาปนาสาธารณรัฐประชาชนจีน",
    "Pengumuman Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Tidak Lagi Menuntut Perbuatan Pidana Orang yang Telah Pergi ke Taiwan sebelum Berdirinya Republik Rakyat Tiongkok",
    "Pengumuman Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Tidak Lagi Mendakwa Perbuatan Jenayah Orang yang Telah Pergi ke Taiwan sebelum Penubuhan Republik Rakyat China",
)
ITEMS["CN-JI-0069"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc hành vi quân nhân rời bỏ đơn vị trong thời bình có thể bị định tội và xử phạt hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าการที่ทหารละทิ้งหน่วยในยามปกติจะเป็นความผิดและถูกลงโทษได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Apakah Perbuatan Prajurit Meninggalkan Kesatuan pada Masa Damai Dapat Dinyatakan sebagai Tindak Pidana dan Dihukum",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung sama ada Perbuatan Askar Meninggalkan Unit pada Masa Aman Boleh Diisytiharkan sebagai Kesalahan Jenayah dan Dihukum",
)
ITEMS["CN-JI-0070"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc tòa án có cho phép bị cáo bị tuyên án tử hình đã kháng cáo rút kháng cáo sau khi hết thời hạn kháng cáo và trước khi tuyên án hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าศาลจะอนุญาตให้จำเลยที่ถูกพิพากษาประหารชีวิตซึ่งได้อุทธรณ์แล้วถอนอุทธรณ์ภายหลังสิ้นสุดระยะเวลาอุทธรณ์และก่อนการอ่านคำพิพากษาหรือไม่",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Apakah Pengadilan Mengabulkan Penarikan Banding oleh Terdakwa yang Dijatuhi Hukuman Mati setelah Berakhirnya Tenggang Banding dan sebelum Pembacaan Putusan",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung sama ada Mahkamah Membenarkan Pengunduran Rayuan oleh Tertuduh yang Dijatuhi Hukuman Mati selepas Tamat Tempoh Rayuan dan sebelum Penghakiman Dibacakan",
)
ITEMS["CN-JI-0071"] = (
    "Thông báo của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc bãi bỏ một số giải thích tư pháp đã được hai cơ quan cùng ban hành trước cuối năm 1993",
    "ประกาศของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการยกเลิกคำอธิบายทางตุลาการบางฉบับที่ทั้งสองหน่วยงานร่วมประกาศก่อนสิ้นปี ค.ศ. 1993",
    "Pemberitahuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Pencabutan Sebagian Penafsiran Yudisial yang Diterbitkan Bersama sebelum Akhir Tahun 1993",
    "Pemberitahuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Pembatalan Sebahagian Tafsiran Kehakiman yang Diterbitkan Bersama sebelum Akhir Tahun 1993",
)
ITEMS["CN-JI-0079"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về vấn đề bảo đảm theo pháp luật quyền lựa chọn người bào chữa của người bị tình nghi phạm tội và bị cáo đang bị giam giữ",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาการคุ้มครองตามกฎหมายซึ่งสิทธิในการเลือกทนายความของผู้ต้องหาและจำเลยที่ถูกควบคุมตัว",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Masalah Penjaminan menurut Hukum atas Hak Memilih Penasihat Hukum bagi Tersangka dan Terdakwa yang Ditahan",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Isu Jaminan menurut Undang-Undang bagi Hak Memilih Peguambela oleh Orang Yang Disyaki dan Tertuduh yang Ditahan",
)

# 补充规定系列
def buchong(no_vi, no_th, no_id, no_ms):
    return (
        "Quy định bổ sung của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc xác định tội danh khi thi hành Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa%s" % no_vi,
        "ข้อกำหนดเพิ่มเติมของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการกำหนดฐานความผิดในการใช้ประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน%s" % no_th,
        "Ketentuan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penetapan Nama Tindak Pidana dalam Pelaksanaan Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok%s" % no_id,
        "Peruntukan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penetapan Nama Kesalahan Jenayah dalam Pelaksanaan Kanun Keseksaan Republik Rakyat China%s" % no_ms,
    )

ITEMS["CN-JI-0081"] = buchong("", "", "", "")
ITEMS["CN-JI-0082"] = buchong(" (Phần tám)", " (ฉบับที่ 8)", " (Bagian Kedelapan)", " (Bahagian Kelapan)")
ITEMS["CN-JI-0083"] = buchong(" (Phần hai)", " (ฉบับที่ 2)", " (Bagian Kedua)", " (Bahagian Kedua)")
ITEMS["CN-JI-0085"] = buchong(" (Phần ba)", " (ฉบับที่ 3)", " (Bagian Ketiga)", " (Bahagian Ketiga)")
ITEMS["CN-JI-0086"] = buchong(" (Phần bốn)", " (ฉบับที่ 4)", " (Bagian Keempat)", " (Bahagian Keempat)")

ITEMS["CN-JI-0091"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc phạm nhân được hưởng án treo phạm tội mới trong thời hạn năm năm sau khi hết thời gian thử thách với hình phạt từ tù có thời hạn trở lên có bị coi là tái phạm hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าผู้ได้รับโทษรอลงอาญาซึ่งกระทำความผิดใหม่ภายในห้าปีหลังสิ้นสุดระยะเวลาทดลองซึ่งมีโทษจำคุกมีกำหนดหรือหนักกว่านั้นจะถือเป็นผู้กระทำผิดซ้ำหรือไม่",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Apakah Terpidana Bersyarat yang Melakukan Tindak Pidana Baru dalam Lima Tahun setelah Berakhirnya Masa Percobaan dengan Pidana Penjara Terbatas atau Lebih Berat Dianggap sebagai Pengulangan Tindak Pidana",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung sama ada Pesalah Bersyarat yang Melakukan Kesalahan Jenayah Baharu dalam Tempoh Lima Tahun selepas Tamat Masa Percubaan dengan Hukuman Penjara Terhad atau Lebih Berat Dianggap sebagai Pengulangan Jenayah",
)
ZH_FIX["CN-JI-0091"] = "最高人民法院、最高人民检察院关于缓刑犯在考验期满后五年内再犯应当判处有期徒刑以上刑罚之罪应否认定为累犯问题的批复"
ITEMS["CN-JI-0092"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về vấn đề liên quan đến Điều 344 Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาที่เกี่ยวข้องกับมาตรา 344 แห่งประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Masalah terkait Pasal 344 Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Isu Berkaitan Seksyen 344 Kanun Keseksaan Republik Rakyat China",
)
ZH_FIX["CN-JI-0092"] = "最高人民法院、最高人民检察院关于适用《中华人民共和国刑法》第三百四十四条有关问题的批复"

ITEMS["CN-JI-0093"] = (
    "Thông báo của Văn phòng Tòa án Nhân dân Tối cao về việc chuyển tiếp Công hàm trả lời của Cục Pháp chế Quốc vụ viện về vấn đề áp dụng cụ thể quy định pháp luật đối với phí cảng vụ hàng hóa tại bến chuyên dụng của doanh nghiệp",
    "ประกาศของสำนักงานศาลประชาชนสูงสุดว่าด้วยการส่งต่อหนังสือตอบกลับของสำนักกฎหมายแห่งคณะรัฐมนตรีเกี่ยวกับปัญหาการใช้กฎข้อบังคับโดยเฉพาะสำหรับค่าท่าเรือสินค้าที่ท่าเทียบเรือเฉพาะของวิสาหกิจ",
    "Pemberitahuan Kantor Mahkamah Rakyat Agung tentang Penerusan Surat Jawaban Biro Legislasi Dewan Negara mengenai Masalah Penerapan Khusus Peraturan atas Biaya Kepelabuhanan Barang di Dermaga Khusus Badan Usaha",
    "Pemberitahuan Pejabat Mahkamah Rakyat Agung mengenai Penghantaran Surat Jawapan Biro Penggubalan Undang-Undang Majlis Negara berkenaan Isu Penggunaan Khusus Peraturan bagi Caj Pelabuhan Barang di Jeti Khas Perusahaan",
)
ITEMS["CN-JI-0094"] = (
    "Trả lời của Tòa án Nhân dân Tối cao về việc tòa án nhân dân nên thụ lý và xử lý như thế nào đối với đơn khiếu nại của đương sự đối với vụ án tòa án nhân dân cưỡng chế thi hành hành vi hành chính cụ thể đã có hiệu lực",
    "คำตอบของศาลประชาชนสูงสุดว่าศาลประชาชนควรรับและดำเนินการอย่างไรต่อคำร้องของคู่ความในคดีที่ศาลประชาชนบังคับคดีตามการกระทำทางปกครองเฉพาะที่มีผลใช้บังคับแล้ว",
    "Jawaban Mahkamah Rakyat Agung tentang Bagaimana Pengadilan Rakyat Harus Menerima dan Menangani Permohonan Para Pihak atas Perkara Pelaksanaan Paksa Perbuatan Administratif Konkret yang Telah Berlaku oleh Pengadilan Rakyat",
    "Jawapan Mahkamah Rakyat Agung tentang Bagaimana Mahkamah Rakyat Patut Menerima dan Mengendalikan Permohonan Para Pihak bagi Kes Pelaksanaan Paksa Perbuatan Pentadbiran Konkrit yang Telah Berkuat Kuasa oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0095"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý đối với vụ án mà pháp luật chưa quy định do tòa án thụ lý trước khi Luật Tố tụng Hành chính có hiệu lực",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการต่อคดีที่กฎหมายยังมิได้กำหนดให้ศาลรับไว้ก่อนที่กฎหมายวิธีพิจารณาคดีปกครองจะมีผลใช้บังคับ",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Perkara yang Belum Diatur Undang-Undang untuk Diterima Pengadilan sebelum Berlakunya Undang-Undang Hukum Acara Tata Usaha Negara",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Kes yang Belum Diperuntukkan Undang-Undang untuk Diterima Mahkamah sebelum Berkuat Kuasanya Undang-Undang Prosedur Pentadbiran",
)
ITEMS["CN-JI-0096"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc không áp dụng hồi tố khoản 1 Điều 88 Luật Công ty nước Cộng hòa Nhân dân Trung Hoa",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการไม่ใช้บังคับย้อนหลังของวรรคหนึ่งมาตรา 88 แห่งพระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน",
    "Jawaban Mahkamah Rakyat Agung tentang Tidak Diterapkannya Secara Surut Ayat (1) Pasal 88 Undang-Undang Perseroan Republik Rakyat Tiongkok",
    "Jawapan Mahkamah Rakyat Agung mengenai Tidak Dikuatkuasakan Secara Kebelakangan Fasal (1) Seksyen 88 Akta Syarikat Republik Rakyat China",
)
ITEMS["CN-JI-0109"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc việc bị cáo biện giải về tính chất hành vi có ảnh hưởng đến việc xác lập tự thú hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าการที่จำเลยชี้แจงเกี่ยวกับลักษณะของการกระทำมีผลต่อการรับฟังการสารภาพด้วยตนเองหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pembelaan Terdakwa mengenai Sifat Perbuatan Mempengaruhi Penetapan Penyerahan Diri",
    "Jawapan Mahkamah Rakyat Agung sama ada Pembelaan Tertuduh mengenai Sifat Perbuatan Mempengaruhi Penetapan Penyerahan Diri",
)
ITEMS["CN-JI-0111"] = (
    "Công hàm của Tòa án Nhân dân Tối cao về việc tòa án nhân dân nên thụ lý theo loại vụ án nào khi đương sự khởi kiện không đồng ý với hành vi xác nhận quyền đối với nhà đang tranh chấp của cơ quan chính quyền hoặc cơ quan chủ quản nhà đất",
    "หนังสือของศาลประชาชนสูงสุดว่าศาลประชาชนควรรับคดีในประเภทใดเมื่อคู่ความฟ้องคดีโดยไม่เห็นด้วยกับการกระทำยืนยันสิทธิในบ้านที่พิพาทของหน่วยงานรัฐบาลหรือหน่วยงานบริหารที่อยู่อาศัยและที่ดิน",
    "Surat Mahkamah Rakyat Agung tentang Jenis Perkara yang Harus Diterima Pengadilan Rakyat ketika Para Pihak Mengajukan Gugatan karena Tidak Setuju dengan Perbuatan Penegasan Hak atas Rumah yang Dipersengketakan oleh Badan Pemerintah atau Badan Pengelola Perumahan dan Pertanahan",
    "Surat Mahkamah Rakyat Agung tentang Jenis Kes yang Patut Diterima Mahkamah Rakyat apabila Para Pihak Memfailkan Guaman kerana Tidak Bersetuju dengan Perbuatan Pengesahan Hak atas Rumah yang Dipertikaikan oleh Badan Kerajaan atau Badan Pengurusan Perumahan dan Tanah",
)
ITEMS["CN-JI-0114"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc người bị thiệt hại trong vụ án xâm phạm sản phẩm có thể khởi kiện dân sự với chủ sở hữu nhãn hiệu của sản phẩm đó với tư cách bị đơn hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าผู้เสียหายในคดีละเมิดเกี่ยวกับผลิตภัณฑ์สามารถฟ้องคดีแพ่งโดยมีเจ้าของเครื่องหมายการค้าของผลิตภัณฑ์นั้นเป็นจำเลยได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Korban dalam Perkara Pelanggaran Produk Dapat Mengajukan Gugatan Perdata dengan Pemilik Merek Produk Tersebut sebagai Tergugat",
    "Jawapan Mahkamah Rakyat Agung sama ada Mangsa dalam Kes Pelanggaran Produk Boleh Memfailkan Guaman Sivil dengan Pemilik Cap Dagangan Produk Itu sebagai Defendan",
)
ITEMS["CN-JI-0115"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về hiệu lực pháp lý của việc người vay ký hoặc đóng dấu trên giấy thông báo đòi nợ sau khi đã hết thời hiệu khởi kiện",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยผลทางกฎหมายของการที่ผู้กู้ลงนามหรือประทับตราบนหนังสือแจ้งเรียกให้ชำระหนี้ภายหลังจากสิ้นสุดอายุความฟ้องคดีแล้ว",
    "Jawaban Mahkamah Rakyat Agung tentang Kekuatan Hukum Penandatanganan atau Pembubuhan Cap oleh Peminjam pada Surat Pemberitahuan Penagihan setelah Berakhirnya Tenggang Daluwarsa Gugatan",
    "Jawapan Mahkamah Rakyat Agung mengenai Kuat Kuasa Undang-Undang Penandatanganan atau Penyeteman oleh Peminjam pada Surat Pemberitahuan Tuntutan selepas Tamat Tempoh Had Guaman",
)
ITEMS["CN-JI-0116"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc thời gian tạm giữ của phạm nhân trước khi tuyên án treo có được khấu trừ vào thời hạn chấp hành hình phạt khi hủy án treo hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าสามารถหักระยะเวลาควบคุมตัวก่อนการพิพากษารอลงอาญาของผู้ต้องโทษออกจากระยะเวลาการรับโทษเมื่อเพิกถอนการรอลงอาญาได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Masa Penahanan Terpidana sebelum Penjatuhan Pidana Bersyarat Dapat Diperhitungkan sebagai Pengurangan Masa Menjalani Pidana ketika Pidana Bersyarat Dicabut",
    "Jawapan Mahkamah Rakyat Agung sama ada Tempoh Tahanan Pesalah sebelum Penjatuhan Hukuman Bersyarat Boleh Dikira sebagai Pengurangan Tempoh Menjalani Hukuman apabila Hukuman Bersyarat Dibatalkan",
)
ITEMS["CN-JI-0118"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thời hạn của quyền yêu cầu bồi thường của người vận chuyển đối với người gửi hàng, người nhận hàng hoặc người giữ vận đơn trong vận tải hàng hóa bằng đường biển",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยอายุความของสิทธิเรียกร้องค่าชดเชยของผู้ขนส่งต่อผู้ส่งสินค้า ผู้รับสินค้า หรือผู้ถือใบตราส่งในการขนส่งสินค้าทางทะเล",
    "Jawaban Mahkamah Rakyat Agung tentang Tenggang Waktu Hak Tuntutan Ganti Rugi Pengangkut terhadap Pengirim, Penerima Barang atau Pemegang Bill of Lading dalam Pengangkutan Barang melalui Laut",
    "Jawapan Mahkamah Rakyat Agung mengenai Tempoh Had Hak Tuntutan Pampasan Pengangkut terhadap Penghantar, Penerima Barang atau Pemegang Bil Muatan dalam Pengangkutan Barang melalui Laut",
)
ITEMS["CN-JI-0119"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc xử lý đơn khiếu nại trong vụ án liên quan đến súng, vật liệu nổ",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการที่เกี่ยวข้องกับการดำเนินการต่อคำร้องในคดีที่เกี่ยวกับอาวุธปืนและวัตถุระเบิด",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penanganan Permohonan dalam Perkara Berkaitan Senjata Api dan Bahan Peledak",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Pengendalian Permohonan dalam Kes Berkaitan Senjata Api dan Bahan Letupan",
)
ITEMS["CN-JI-0121"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xác định tính chất hành vi của trưởng nhóm dân cư lợi dụng chức vụ chiếm đoạt trái phép tài sản công",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดลักษณะการกระทำของหัวหน้ากลุ่มหมู่บ้านที่ใช้อำนาจหน้าที่ยึดถือทรัพย์สินสาธารณะโดยมิชอบ"
    ,
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Sifat Perbuatan Kepala Kelompok Warga yang Menyalahgunakan Jabatan untuk Mengambil Alih Harta Publik secara Tidak Sah",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Sifat Perbuatan Ketua Kumpulan Penduduk yang Menyalahgunakan Jawatan untuk Mengambil Alih Harta Awam secara Tidak Sah",
)
ITEMS["CN-JI-0123"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án nhân dân không thụ lý đơn yêu cầu xét xử lại của đương sự không đồng ý với quyết định bác đơn yêu cầu hủy phán quyết trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลประชาชนไม่รับคำขอให้พิจารณาคดีใหม่ของคู่ความที่ไม่เห็นด้วยกับคำสั่งยกคำขอเพิกถอนคำชี้ขาดอนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Tidak Diterimanya Permohonan Pemeriksaan Ulang oleh Pengadilan Rakyat atas Ketidaksetujuan Para Pihak terhadap Penetapan Penolakan Permohonan Pembatalan Putusan Arbitrase",
    "Jawapan Mahkamah Rakyat Agung mengenai Tidak Diterimanya Permohonan Semakan Semula oleh Mahkamah Rakyat atas Ketidaksetujuan Para Pihak terhadap Penetapan Penolakan Permohonan Pembatalan Award Timbang Tara",
)
ITEMS["CN-JI-0124"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án nhân dân có thụ lý hay không đơn yêu cầu xét xử lại của đương sự không đồng ý với quyết định hủy phán quyết trọng tài của tòa án nhân dân",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลประชาชนจะรับคำขอให้พิจารณาคดีใหม่ของคู่ความที่ไม่เห็นด้วยกับคำสั่งเพิกถอนคำชี้ขาดอนุญาโตตุลาการของศาลประชาชนหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Rakyat Menerima Permohonan Pemeriksaan Ulang dari Para Pihak yang Tidak Setuju dengan Penetapan Pembatalan Putusan Arbitrase oleh Pengadilan Rakyat",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Rakyat Menerima Permohonan Semakan Semula daripada Para Pihak yang Tidak Bersetuju dengan Penetapan Pembatalan Award Timbang Tara oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0125"] = (
    "Công hàm trả lời của Tòa án Nhân dân Tối cao về việc tòa án nhân dân nên thụ lý theo loại vụ án hành chính nào khi đương sự khởi kiện không đồng ý với quyết định tách doanh nghiệp công nghiệp quốc doanh của cơ quan hành chính",
    "หนังสือตอบกลับของศาลประชาชนสูงสุดว่าศาลประชาชนควรรับคดีในประเภทคดีปกครองใดเมื่อคู่ความฟ้องคดีโดยไม่เห็นด้วยกับมติแยกวิสาหกิจอุตสาหกรรมของรัฐของหน่วยงานปกครอง",
    "Surat Jawaban Mahkamah Rakyat Agung tentang Jenis Perkara Tata Usaha Negara yang Harus Diterima Pengadilan Rakyat ketika Para Pihak Mengajukan Gugatan karena Tidak Setuju dengan Keputusan Pemecahan Badan Usaha Industri Milik Negara oleh Badan Administrasi",
    "Surat Jawapan Mahkamah Rakyat Agung tentang Jenis Kes Pentadbiran yang Patut Diterima Mahkamah Rakyat apabila Para Pihak Memfailkan Guaman kerana Tidak Bersetuju dengan Keputusan Pemecahan Perusahaan Industri Milik Negara oleh Badan Pentadbiran",
)
ITEMS["CN-JI-0126"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc đương sự có phải chịu trách nhiệm bồi thường khi yêu cầu bảo toàn tài sản có sai sót gây thiệt hại cho người thứ ba hay không",
    "การตีความของศาลประชาชนสูงสุดว่าคู่ความต้องรับผิดชดเชยหรือไม่เมื่อคำขอคุ้มครองทรัพย์สินมีความผิดพลาดและก่อความเสียหายแก่บุคคลภายนอก",
    "Penafsiran Mahkamah Rakyat Agung tentang Apakah Para Pihak Harus Bertanggung Jawab atas Ganti Rugi ketika Permohonan Penjaminan Harta Mengandung Kekeliruan yang Menimbulkan Kerugian bagi Pihak Ketiga",
    "Tafsiran Mahkamah Rakyat Agung sama ada Para Pihak Perlu Bertanggungjawab atas Pampasan apabila Permohonan Pemuliharaan Harta Mengandungi Kesilapan yang Menyebabkan Kerugian kepada Pihak Ketiga",
)
ITEMS["CN-JI-0127"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án nhân dân có nên thụ lý đơn yêu cầu công nhận giấy chứng nhận ly hôn do tòa án Australia cấp hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลประชาชนควรรับคำขอรับรองหนังสือรับรองการหย่าที่ออกโดยศาลออสเตรเลียหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Rakyat Patut Menerima Permohonan Pengakuan Surat Keterangan Perceraian yang Diterbitkan Pengadilan Australia",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Rakyat Patut Menerima Permohonan Pengiktirafan Sijil Perceraian yang Dikeluarkan oleh Mahkamah Australia",
)
ITEMS["CN-JI-0128"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách ghi đương sự trên quyết định dân sự của tòa án cấp phúc thẩm khi phát về xét xử lại do bổ sung hoặc thay đổi đương sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีระบุคู่ความในคำสั่งทางแพ่งของศาลชั้นอุทธรณ์เมื่อส่งคดีกลับให้พิจารณาใหม่เนื่องจากการเพิ่มหรือเปลี่ยนคู่ความ",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Mencantumkan Para Pihak dalam Penetapan Perdata Pengadilan Tingkat Banding ketika Mengembalikan Perkara untuk Diadili Ulang karena Penambahan atau Penggantian Para Pihak",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Mencatat Para Pihak dalam Penetapan Sivil Mahkamah Peringkat Rayuan apabila Memulangkan Kes untuk Dibicarakan Semula kerana Penambahan atau Penggantian Para Pihak",
)
ITEMS["CN-JI-0131"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc khi xét xử theo định kỳ mà hội thẩm nhân dân không thể tham gia vì lý do bất khả kháng thì thẩm phán có thể mở phiên tòa tuyên án hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าเมื่อพิจารณาคดีตามกำหนดนัดแล้วผู้พิพากษาสมทบประชาชนไม่สามารถเข้าร่วมพิจารณาได้ด้วยเหตุสุดวิสัย ผู้พิพากษาจะเปิดศาลอ่านคำพิพากษาได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Hakim Dapat Membuka Sidang Pembacaan Putusan ketika Hakim Rakyat Tidak Dapat Hadir karena Halangan di Luar Kemampuan pada Perkara yang Dijadwalkan Diumumkan Putusannya",
    "Jawapan Mahkamah Rakyat Agung sama ada Hakim Boleh Membuka Sidang Pembacaan Penghakiman apabila Hakim Rakyat Tidak Dapat Hadir atas Halangan di Luar Keupayaan dalam Kes yang Dijadualkan Penghakimannya",
)
ITEMS["CN-JI-0133"] = (
    "Trả lời của Tòa án Nhân dân Tối cao về việc tòa án nhân dân có nên thụ lý khi đương sự khởi kiện hành chính với lý do cơ quan y tế không thực hiện nghĩa vụ pháp định hay không",
    "คำตอบของศาลประชาชนสูงสุดว่าศาลประชาชนควรรับคดีหรือไม่เมื่อคู่ความฟ้องคดีปกครองโดยอ้างว่าหน่วยงานสาธารณสุขไม่ปฏิบัติหน้าที่ตามกฎหมาย",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Rakyat Patut Menerima Gugatan ketika Para Pihak Mengajukan Gugatan Tata Usaha Negara dengan Alasan Badan Kesehatan Tidak Melaksanakan Kewajiban Hukum",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Rakyat Patut Menerima Guaman apabila Para Pihak Memfailkan Guaman Pentadbiran atas Alasan Badan Kesihatan Tidak Melaksanakan Kewajipan Undang-Undang",
)
ITEMS["CN-JI-0135"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thủ tục xét xử đối với vụ án mà bị cáo bị tuyên án tử hình không kháng cáo, nhưng một số bị cáo đồng phạm hoặc nguyên đơn dân sự kèm theo kháng cáo",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการพิจารณาคดีที่จำเลยซึ่งถูกพิพากษาประหารชีวิตไม่อุทธรณ์ แต่จำเลยร่วมบางคนหรือโจทก์แพ่งเกี่ยวเนื่องยื่นอุทธรณ์",
    "Jawaban Mahkamah Rakyat Agung tentang Tata Cara Pemeriksaan Perkara ketika Terdakwa yang Dijatuhi Hukuman Mati Tidak Mengajukan Banding, namun Sebagian Terdakwa Bersama atau Penggugat Perdata yang Melekat Mengajukan Banding",
    "Jawapan Mahkamah Rakyat Agung mengenai Tatacara Pemeriksaan Kes apabila Tertuduh yang Dijatuhi Hukuman Mati Tidak Merayu, tetapi Sebahagian Tertuduh Bersama atau Plaintif Sivil yang Berserta Merayu",
)
ITEMS["CN-JI-0136"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có thể áp dụng biện pháp thi hành án đối với trái phiếu kho bạc dạng chứng chỉ của người phải thi hành án gửi tại ngân hàng hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าสามารถใช้มาตรการบังคับคดีต่อพันธบัตรคลังในรูปแบบหนังสือรับรองของลูกหนี้ตามคำพิพากษาที่ฝากไว้ที่ธนาคารได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Tindakan Pelaksanaan Dapat Dikenakan terhadap Surat Utang Negara Berbentuk Sertifikat Milik Pihak yang Wajib Melaksanakan Putusan yang Disimpan di Bank",
    "Jawapan Mahkamah Rakyat Agung sama ada Tindakan Pelaksanaan Boleh Dikenakan terhadap Bon Perbendaharaan Berbentuk Sijil Milik Pihak yang Wajib Melaksanakan Penghakiman yang Disimpan di Bank",
)
ITEMS["CN-JI-0137"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi làm biến dạng tem thư và buôn bán tem thư đã bị làm biến dạng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการกระทำที่ทำให้แสตมป์ผิดรูปและการค้าแสตมป์ที่ถูกทำให้ผิดรูป",
    "Penafsiran Mahkamah Rakyat Agung tentang Penerapan Hukum atas Perbuatan Mengubah Bentuk Benda Meterai dan Memperdagangkan Benda Meterai yang Telah Diubah Bentuknya",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang terhadap Perbuatan Mengubah Bentuk Setem dan Memperdagangkan Setem yang Telah Diubah Bentuknya",
)
ITEMS["CN-JI-0138"] = (
    "Trả lời của Tòa án Nhân dân Tối cao về thuộc tính của nước nóng dưới lòng đất và vấn đề áp dụng pháp luật đối với nước nóng dưới lòng đất",
    "คำตอบของศาลประชาชนสูงสุดว่าด้วยลักษณะของน้ำร้อนใต้ดินและปัญหาการใช้กฎหมายกับน้ำร้อนใต้ดิน",
    "Jawaban Mahkamah Rakyat Agung tentang Sifat Air Panas Bawah Tanah dan Masalah Penerapan Hukum atas Air Panas Bawah Tanah",
    "Jawapan Mahkamah Rakyat Agung mengenai Sifat Air Panas Bawah Tanah dan Isu Penggunaan Undang-Undang terhadap Air Panas Bawah Tanah",
)
ITEMS["CN-JI-0139"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có thể áp dụng hình phạt bổ sung tước quyền chính trị đối với người phạm tội cố ý gây thương tích, trộm cắp và các tội phạm nghiêm trọng khác phá hoại trật tự xã hội hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าสามารถลงโทษเพิ่มเติมฐานตัดสิทธิทางการเมืองแก่ผู้กระทำความผิดฐานทำร้ายร่างกายโดยเจตนา ลักทรัพย์ และความผิดร้ายแรงอื่นที่ทำลายความสงบเรียบร้อยของสังคมได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Hukuman Tambahan Pencabutan Hak Politik Dapat Dikenakan kepada Pelaku Tindak Pidana Penganiayaan dengan Sengaja, Pencurian dan Tindak Pidana Berat Lain yang Merusak Ketertiban Masyarakat",
    "Jawapan Mahkamah Rakyat Agung sama ada Hukuman Tambahan Perampasan Hak Politik Boleh Dikenakan kepada Pesalah Kesalahan Jenayah Mencederakan dengan Sengaja, Kecurian dan Kesalahan Jenayah Berat Lain yang Merosakkan Ketenteraman Masyarakat",
)
ITEMS["CN-JI-0140"] = (
    "Trả lời của Tòa án Nhân dân Tối cao về việc khai thác cát trên sông có phải nộp phí bồi hoàn tài nguyên khoáng sản hay không",
    "คำตอบของศาลประชาชนสูงสุดว่าการขุดทรายในแม่น้ำต้องชำระค่าชดเชยทรัพยากรแร่ธาตุหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Penambangan Pasir di Sungai Wajib Membayar Biaya Kompensasi Sumber Daya Mineral",
    "Jawapan Mahkamah Rakyat Agung sama ada Pengorekan Pasir di Sungai Wajib Membayar Bayaran Pampasan Sumber Mineral",
)
ITEMS["CN-JI-0141"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc phụ nữ mang thai bị sảy thai tự nhiên trong thời gian bị tạm giữ có thể bị áp dụng hình phạt tử hình khi xét xử hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าหญิงมีครรภ์ที่แท้งเองระหว่างถูกควบคุมตัวสามารถถูกลงโทษประหารชีวิตเมื่อพิจารณาคดีได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Perempuan Hamil yang Mengalami Keguguran Spontan selama Penahanan Dapat Dikenai Hukuman Mati pada Saat Pemeriksaan Perkara",
    "Jawapan Mahkamah Rakyat Agung sama ada Wanita Hamil yang Mengalami Keguguran Spontan semasa Ditahan Boleh Dikenakan Hukuman Mati ketika Pemeriksaan Kes",
)
ITEMS["CN-JI-0142"] = (
    "Công hàm trả lời của Tòa án Nhân dân Tối cao về việc cơ quan lâm nghiệp yêu cầu tòa án nhân dân cưỡng chế thi hành hành vi hành chính cụ thể đã ban hành theo pháp luật",
    "หนังสือตอบกลับของศาลประชาชนสูงสุดว่าด้วยการที่หน่วยงานป่าไม้ขอให้ศาลประชาชนบังคับคดีตามการกระทำทางปกครองเฉพาะที่ได้ออกตามกฎหมาย",
    "Surat Jawaban Mahkamah Rakyat Agung tentang Permohonan Badan Kehutanan kepada Pengadilan Rakyat untuk Melaksanakan Secara Paksa Perbuatan Administratif Konkret yang Telah Diterbitkan menurut Hukum",
    "Surat Jawapan Mahkamah Rakyat Agung mengenai Permohonan Badan Perhutanan kepada Mahkamah Rakyat untuk Melaksanakan Secara Paksa Perbuatan Pentadbiran Konkrit yang Telah Dikeluarkan menurut Undang-Undang",
)
ITEMS["CN-JI-0143"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thời hạn khiếu nại đối với hành vi chấm dứt thi hành án của tòa án nhân dân",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยกำหนดเวลาคัดค้านการกระทำยุติการบังคับคดีของศาลประชาชน",
    "Jawaban Mahkamah Rakyat Agung tentang Tenggang Waktu Keberatan atas Perbuatan Pengakhiran Pelaksanaan oleh Pengadilan Rakyat",
    "Jawapan Mahkamah Rakyat Agung mengenai Tempoh Had Bantahan terhadap Perbuatan Penamatan Pelaksanaan oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0145"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc định tội đối với hành vi bày trò lừa người khác tham gia đánh bạc rồi dùng vũ lực hoặc đe dọa dùng vũ lực đối với người bị lừa đòi lại tiền",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดต่อการกระทำที่ล่อลวงผู้อื่นให้ร่วมเล่นการพนันแล้วใช้กำลังหรือข่มขู่ด้วยกำลังต่อผู้ถูกหลอกเพื่อทวงเงินคืน",
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana atas Perbuatan Menyiapkan Jebakan untuk Membujuk Orang Lain Ikut Berjudi lalu Menggunakan Kekerasan atau Ancaman Kekerasan terhadap Korban untuk Menuntut Kembali Uangnya",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Kesalahan atas Perbuatan Menyediakan Perangkap untuk Memujuk Orang Lain Turut Berjudi kemudian Menggunakan Keganasan atau Ugutan Keganasan terhadap Mangsa untuk Menuntut Semula Wangnya",
)
ITEMS["CN-JI-0146"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc định tội đối với hành vi sử dụng trái phép vốn nhà nước của người được giao quản lý, kinh doanh tài sản nhà nước",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดต่อการกระทำที่ใช้เงินทุนของรัฐโดยมิชอบของผู้ได้รับมอบหมายให้บริหารและดำเนินกิจการทรัพย์สินของรัฐ",
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana atas Perbuatan Penggunaan Dana Negara secara Tidak Sah oleh Pihak yang Ditugaskan Mengelola dan Menjalankan Harta Negara",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Kesalahan atas Perbuatan Penggunaan Dana Negara secara Tidak Sah oleh Pihak yang Ditugaskan Mengurus dan Menjalankan Harta Negara",
)
ITEMS["CN-JI-0147"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc định tội đối với hành vi giam giữ trái phép người khác nhằm đòi khoản nợ mà pháp luật không bảo hộ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดต่อการกักขังผู้อื่นโดยมิชอบเพื่อทวงหนี้ที่กฎหมายไม่คุ้มครอง",
    "Penafsiran Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana atas Perbuatan Penahanan Orang Lain secara Tidak Sah untuk Menuntut Utang yang Tidak Dilindungi Hukum",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penetapan Kesalahan atas Perbuatan Penahanan Orang Lain secara Tidak Sah untuk Menuntut Hutang yang Tidak Dilindungi Undang-Undang",
)
ITEMS["CN-JI-0148"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tổ chức thanh lý đối với trường dân lập bị chấm dứt hoạt động do tài sản không đủ trả nợ và không thể tiếp tục mở trường",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการจัดการชำระบัญชีสำหรับโรงเรียนเอกชนที่ถูกยุติการดำเนินงานเนื่องจากทรัพย์สินไม่พอชำระหนี้และไม่สามารถเปิดสอนต่อได้",
    "Jawaban Mahkamah Rakyat Agung tentang Penyelenggaraan Likuidasi terhadap Sekolah Swasta yang Dihentikan Kegiatannya karena Harta Tidak Cukup untuk Melunasi Utang dan Tidak Dapat Melanjutkan Penyelenggaraan Sekolah",
    "Jawapan Mahkamah Rakyat Agung mengenai Penganjuran Pembubaran terhadap Sekolah Swasta yang Ditamatkan Operasinya kerana Harta Tidak Mencukupi untuk Menjelaskan Hutang dan Tidak Dapat Meneruskan Pengendalian Sekolah",
)
ITEMS["CN-JI-0150"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc không thụ lý kháng nghị đối với quyết định trong thủ tục thi hành án",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการไม่รับคำคัดค้านต่อคำสั่งในขั้นตอนการบังคับคดี",
    "Jawaban Mahkamah Rakyat Agung tentang Tidak Diterimanya Perlawanan terhadap Penetapan dalam Tata Cara Pelaksanaan",
    "Jawapan Mahkamah Rakyat Agung mengenai Tidak Diterimanya Bantahan terhadap Penetapan dalam Tatacara Pelaksanaan",
)
ITEMS["CN-JI-0151"] = (
    "Trả lời của Tòa án Nhân dân Tối cao về việc ngân hàng có thể tự giải tỏa phong tỏa khi tên chủ tài khoản và số tài khoản trong lệnh phong tỏa tài sản của tòa án không khớp nhau hay không",
    "คำตอบของศาลประชาชนสูงสุดว่าธนาคารสามารถปลดอายัดด้วยตนเองได้หรือไม่เมื่อชื่อบัญชีและเลขที่บัญชีในคำสั่งอายัดทรัพย์สินของศาลไม่ตรงกัน",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Bank Dapat Membuka Pembekuan secara Sendiri ketika Nama Pemilik Rekening dan Nomor Rekening dalam Penetapan Pembekuan Harta oleh Pengadilan Tidak Sesuai",
    "Jawapan Mahkamah Rakyat Agung sama ada Bank Boleh Membuka Pembekuan Secara Sendiri apabila Nama Pemilik Akaun dan Nombor Akaun dalam Penetapan Pembekuan Harta oleh Mahkamah Tidak Sepadan",
)
ITEMS["CN-JI-0152"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc cơ quan quản lý nhà đất có thể hủy bỏ hành vi xóa đăng ký thế chấp có sai sót hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าหน่วยงานบริหารที่อยู่อาศัยและที่ดินสามารถเพิกถอนการกระทำลบการจดทะเบียนจำนองที่มีข้อผิดพลาดได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Badan Pengelola Perumahan dan Pertanahan Dapat Membatalkan Perbuatan Penghapusan Pendaftaran Hipotek yang Mengandung Kekeliruan",
    "Jawapan Mahkamah Rakyat Agung sama ada Badan Pengurusan Perumahan dan Tanah Boleh Membatalkan Perbuatan Pemadaman Pendaftaran Gadai Janji yang Mengandungi Kesilapan",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[480:540]]
missing = [i for i in want if i not in ITEMS]
extra = [i for i in ITEMS if i not in want]
assert not missing, "缺条目: %s" % missing
assert not extra, "多余条目: %s" % extra

out = {}
for i in want:
    vi, th, iid, ms = ITEMS[i]
    rec = {"vi": vi, "th": th, "id": iid, "ms": ms}
    if i in ZH_FIX:
        rec["zh"] = ZH_FIX[i]
    out[i] = rec

doc = {
    "batch": "cn-p1-b27",
    "scope": "CN 第 481–540 部（_cn_rest.json 480–539）",
    "note": "语义基准 title.zh；本批多为批复、答复、复函，统一用 Phúc đáp / คำตอบกลับ / Jawaban / Jawapan。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b27.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部，zh 修正 %d 条" % (dst, len(out), len(ZH_FIX)))
