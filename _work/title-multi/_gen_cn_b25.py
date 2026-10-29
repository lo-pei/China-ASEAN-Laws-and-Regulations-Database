# -*- coding: utf-8 -*-
"""CN 第 25 批：_cn_rest.json 第 360–419 条（60 部）。"""
import io, json, os

ITEMS = {}
ZH_FIX = {}

ITEMS["CN-REG-0211"] = (
    "Biện pháp quản lý phim nhập khẩu",
    "มาตรการบริหารภาพยนตร์นำเข้า",
    "Tata Cara Pengelolaan Film Impor",
    "Tatacara Pengurusan Filem Import",
)
ITEMS["CN-JI-0013"] = (
    "Thông báo của Tòa án Nhân dân Tối cao, Viện Kiểm sát Nhân dân Tối cao, Bộ Công an và Ủy ban Kế hoạch Nhà nước về việc thống nhất công tác thẩm định giá tang vật",
    "ประกาศของศาลประชาชนสูงสุด อัยการประชาชนสูงสุด กระทรวงความมั่นคงสาธารณะ และคณะกรรมการวางแผนแห่งชาติว่าด้วยการรวมงานการประเมินราคาของกลางให้เป็นเอกภาพ",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung, Kementerian Keamanan Publik dan Komisi Perencanaan Negara tentang Penyeragaman Pekerjaan Penilaian Harga Barang Bukti",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung, Kementerian Keselamatan Awam dan Suruhanjaya Perancangan Negara mengenai Penyeragaman Kerja Penilaian Harga Barang Kes",
)
ITEMS["CN-JI-0024"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về việc lấy, cung cấp máu trái phép",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการรับและการจัดหาโลหิตโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pengambilan dan Penyediaan Darah secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengambilan dan Pembekalan Darah secara Tidak Sah",
)
ITEMS["CN-JI-0060"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về gây rối trật tự công cộng",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการก่อเหตุวิวาทชุลมุน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Perbuatan Rusuh",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perbuatan Rusuhan",
)
ITEMS["CN-JI-0099"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề hiệu lực về thời gian của Luật sửa đổi Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa (lần thứ tám)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาผลใช้บังคับด้านเวลาของพระราชบัญญัติแก้ไขเพิ่มเติมประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 8)",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Kekuatan Berlaku Menurut Waktu Undang-Undang Perubahan atas Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok (Kedelapan)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Kuat Kuasa Mengikut Masa Akta Pindaan Kanun Keseksaan Republik Rakyat China (Kelapan)",
)
ITEMS["CN-JI-0107"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án của Tòa án Sở hữu trí tuệ Bắc Kinh, Thượng Hải và Quảng Châu",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีของศาลทรัพย์สินทางปัญญาปักกิ่ง เซี่ยงไฮ้ และกว่างโจว",
    "Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Pengadilan Kekayaan Intelektual Beijing, Shanghai dan Guangzhou",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Mahkamah Harta Intelek Beijing, Shanghai dan Guangzhou",
)
ITEMS["CN-JI-0113"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc dẫn chiếu pháp luật, pháp quy và các văn bản quy phạm pháp luật khác trong bản án, quyết định của tòa án",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการอ้างอิงกฎหมาย กฎ และเอกสารกฎหมายเชิงบรรทัดฐานอื่นในคำพิพากษาและคำวินิจฉัยของศาล",
    "Ketentuan Mahkamah Rakyat Agung tentang Pengutipan Undang-Undang, Peraturan dan Dokumen Hukum Normatif Lain dalam Putusan dan Penetapan Pengadilan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pengutipan Undang-Undang, Peraturan dan Dokumen Perundangan Normatif Lain dalam Penghakiman dan Penetapan Mahkamah",
)
ITEMS["CN-JI-0149"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền và việc thụ lý vụ án kiện liên quan đến chức năng giám sát của sở giao dịch chứng khoán",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลและการรับคดีฟ้องที่เกี่ยวข้องกับหน้าที่กำกับดูแลของตลาดหลักทรัพย์",
    "Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili dan Penerimaan Perkara Gugatan terkait Fungsi Pengawasan Bursa Efek",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa dan Penerimaan Kes Guaman Berkaitan Fungsi Penyeliaan Bursa Sekuriti",
)
ITEMS["CN-JI-0280"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án xảy ra tại vùng biển thuộc quyền tài phán của Trung Quốc (Phần một)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีที่เกิดขึ้นในน่านน้ำภายใต้เขตอำนาจของจีน (ฉบับที่ 1)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara yang Terjadi di Perairan yang Berada di Bawah Yurisdiksi Tiongkok (Bagian Pertama)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes yang Berlaku di Perairan di Bawah Bidang Kuasa China (Bahagian Pertama)",
)
ITEMS["CN-JI-0316"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về tội tham ô, biển thủ công quỹ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับความผิดฐานยักยอกเงินหลวง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Penggelapan Dana Publik",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penyelewengan Dana Awam",
)
ITEMS["CN-JI-0317"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về mua ngoại hối bằng gian dối và mua bán ngoại hối trái phép",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการซื้อเงินตราต่างประเทศโดยฉ้อฉลและการซื้อขายเงินตราต่างประเทศโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pembelian Valuta Asing secara Curang dan Jual Beli Valuta Asing secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pembelian Mata Wang Asing secara Curang dan Jual Beli Mata Wang Asing secara Tidak Sah",
)
ITEMS["CN-JI-0321"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về phá hoại công trình phát thanh, truyền hình",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการทำลายสิ่งอำนวยความสะดวกด้านการกระจายเสียงและโทรทัศน์",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perusakan Sarana Penyiaran Radio dan Televisi",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Kemudahan Penyiaran Radio dan Televisyen",
)
ITEMS["CN-JI-0335"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý tranh chấp về xâm phạm quyền đối với giống cây trồng mới",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทเรื่องการละเมิดสิทธิในพันธุ์พืชใหม่",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Sengketa Pelanggaran Hak atas Varietas Tanaman Baru",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Pertikaian Pelanggaran Hak atas Varieti Tanaman Baharu",
)
ITEMS["CN-JI-0414"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về hiệu lực về thời gian của Luật Công ty nước Cộng hòa Nhân dân Trung Hoa",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยผลใช้บังคับด้านเวลาของพระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Kekuatan Berlaku Menurut Waktu Undang-Undang Perseroan Republik Rakyat Tiongkok",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Kuat Kuasa Mengikut Masa Akta Syarikat Republik Rakyat China",
)
ITEMS["CN-JI-0448"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong thủ tục xét xử vụ án tử hình có án treo và hạn chế giảm án",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในขั้นตอนการพิจารณาคดีกรณีรอลงอาญาประหารชีวิตและการจำกัดการลดโทษ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Tata Cara Pemeriksaan Perkara Hukuman Mati dengan Percobaan dan Pembatasan Pengurangan Hukuman",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Tatacara Pemeriksaan Kes Hukuman Mati dengan Percubaan dan Sekatan Pengurangan Hukuman",
)
ITEMS["CN-JI-0471"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật đối với vụ án chưa kết thúc khi Bộ luật Tố tụng dân sự sửa đổi có hiệu lực",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายกับคดีที่ยังไม่ยุติเมื่อประมวลกฎหมายวิธีพิจารณาความแพ่งฉบับแก้ไขเพิ่มเติมมีผลใช้บังคับ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum terhadap Perkara yang Belum Selesai ketika Kitab Undang-Undang Hukum Acara Perdata yang Diubah Berlaku",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang bagi Kes yang Belum Selesai apabila Kanun Undang-Undang Prosedur Sivil yang Dipinda Berkuat Kuasa",
)
ITEMS["CN-JI-0483"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Công đoàn nước Cộng hòa Nhân dân Trung Hoa trong công tác xét xử dân sự",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายสหภาพแรงงานแห่งสาธารณรัฐประชาชนจีนในงานพิจารณาคดีแพ่ง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Serikat Pekerja Republik Rakyat Tiongkok dalam Pekerjaan Peradilan Perdata",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Kesatuan Sekerja Republik Rakyat China dalam Kerja Kehakiman Sivil",
)
ITEMS["CN-JI-0491"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề xác định đúng tư cách bị đơn trong tố tụng hành chính của chính quyền nhân dân địa phương cấp huyện trở lên",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการกำหนดคุณสมบัติผู้ถูกฟ้องคดีในกระบวนการพิจารณาคดีปกครองของรัฐบาลประชาชนท้องถิ่นระดับอำเภอขึ้นไปอย่างถูกต้อง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penetapan Secara Tepat Kedudukan Tergugat dalam Peradilan Tata Usaha Negara Pemerintah Rakyat Daerah Tingkat Kabupaten ke Atas",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penetapan Secara Tepat Kedudukan Defendan dalam Kehakiman Pentadbiran Kerajaan Rakyat Tempatan Peringkat Daerah ke Atas",
)
ITEMS["CN-JI-0499"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về các điều khoản bảo hộ khi áp dụng biện pháp cưỡng chế đối với tàu thuyền của quốc gia cử đi trong việc thi hành điều ước lãnh sự",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยข้อบทคุ้มครองเมื่อใช้มาตรการบังคับกับเรือของประเทศผู้ส่งในระหว่างการปฏิบัติตามสนธิสัญญากงสุล",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Ketentuan Perlindungan ketika Menerapkan Tindakan Paksa terhadap Kapal Negara Pengirim dalam Pelaksanaan Perjanjian Konsuler",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Peruntukan Perlindungan ketika Mengenakan Tindakan Paksa terhadap Kapal Negara Penghantar dalam Pelaksanaan Perjanjian Konsular",
)
ITEMS["CN-JI-0552"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc xử lý khi người bị tình nghi phạm tội bỏ trốn hoặc mắc bệnh nặng trong thời gian thẩm tra khởi tố",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการดำเนินการเมื่อผู้ต้องหาหลบหนีหรือป่วยหนักระหว่างการตรวจสอบเพื่อฟ้องคดี",
    "Jawaban Kejaksaan Rakyat Agung tentang Penanganan ketika Tersangka Melarikan Diri atau Menderita Penyakit Berat selama Pemeriksaan untuk Penuntutan",
    "Jawapan Kejaksaan Rakyat Agung mengenai Pengendalian apabila Orang Yang Disyaki Melarikan Diri atau Mengidap Penyakit Tenat semasa Pemeriksaan untuk Pendakwaan",
)
ITEMS["CN-REG-0141"] = (
    "Quy định tạm thời của Quốc vụ viện về một số vấn đề nghỉ hưu của chuyên gia cao cấp",
    "ข้อกำหนดชั่วคราวของคณะรัฐมนตรีว่าด้วยปัญหาหลายประการเกี่ยวกับการเกษียณอายุของผู้เชี่ยวชาญระดับสูง",
    "Ketentuan Sementara Dewan Negara tentang Beberapa Masalah Pensiun Pakar Senior",
    "Peruntukan Sementara Majlis Negara mengenai Beberapa Isu Persaraan Pakar Kanan",
)
ITEMS["CN-REG-0173"] = (
    "Quy định về việc nhân viên hải quan sử dụng vũ khí và công cụ cưỡng chế",
    "ข้อกำหนดว่าด้วยการใช้ศาสตราวุธและเครื่องมือบังคับของเจ้าหน้าที่ศุลกากร",
    "Ketentuan tentang Penggunaan Senjata dan Alat Pemaksa oleh Pegawai Bea dan Cukai",
    "Peruntukan tentang Penggunaan Senjata dan Alat Paksa oleh Pegawai Kastam",
)
ITEMS["CN-REG-0174"] = (
    "Biện pháp về mẫu và cách đeo phù hiệu cấp hàm hải quan",
    "มาตรการว่าด้วยแบบและวิธีติดเครื่องหมายชั้นยศศุลกากร",
    "Tata Cara tentang Bentuk dan Cara Pemakaian Tanda Kepangkatan Kepabeanan",
    "Tatacara mengenai Bentuk dan Cara Pemakaian Tanda Pangkat Kastam",
)
ITEMS["CN-REG-0283"] = (
    "Biện pháp về nghỉ lễ, ngày kỷ niệm toàn quốc",
    "มาตรการว่าด้วยวันหยุดเทศกาลและวันสำคัญทั่วประเทศ",
    "Tata Cara tentang Hari Libur Nasional dan Hari Peringatan",
    "Tatacara mengenai Cuti Perayaan dan Hari Peringatan Kebangsaan",
)
ITEMS["CN-JI-0022"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về gây rối trật tự quản lý quân phục, biển số xe của lực lượng vũ trang",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการก่อความวุ่นวายในระเบียบการบริหารเครื่องแบบและป้ายทะเบียนยานพาหนะของกองทัพ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pengacauan Ketertiban Pengelolaan Pakaian Seragam dan Plat Nomor Kendaraan Angkatan Bersenjata",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengacauan Ketenteraman Pengurusan Pakaian Seragam dan Nombor Plat Kenderaan Angkatan Bersenjata",
)
ITEMS["CN-JI-0040"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về cướp giật tài sản",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการชิงทรัพย์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Perampasan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Peragut",
)
ITEMS["CN-JI-0048"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về vi phạm an toàn bay dân dụng",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการละเมิดความปลอดภัยในการบินพลเรือน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana yang Membahayakan Keselamatan Penerbangan Sipil",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah yang Membahayakan Keselamatan Penerbangan Awam",
)
ITEMS["CN-JI-0101"] = (
    "Quy định bổ sung của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án giảm án, tạm tha",
    "ข้อกำหนดเพิ่มเติมของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการพิจารณาคดีลดโทษและการพักการลงโทษ",
    "Ketentuan Tambahan Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pengurangan Hukuman dan Pembebasan Bersyarat",
    "Peruntukan Tambahan Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Pengurangan Hukuman dan Pelepasan Bersyarat",
)
ITEMS["CN-JI-0120"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý việc tự thú và lập công",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายเกี่ยวกับการสารภาพด้วยตนเองและการสร้างความชอบความดี",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum mengenai Penyerahan Diri dan Berjasa",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang berkenaan Penyerahan Diri dan Jasa Baik",
)
ITEMS["CN-JI-0231"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc cảnh sát tư pháp của tòa án nhân dân thực hiện chức quyền theo pháp luật",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการที่ตำรวจตุลาการของศาลประชาชนปฏิบัติหน้าที่ตามกฎหมาย",
    "Ketentuan Mahkamah Rakyat Agung tentang Pelaksanaan Wewenang oleh Polisi Yudisial Pengadilan Rakyat menurut Hukum",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pelaksanaan Kuasa oleh Polis Kehakiman Mahkamah Rakyat menurut Undang-Undang",
)
ITEMS["CN-JI-0260"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thẩm quyền xét xử vụ án dân sự và thương mại có yếu tố nước ngoài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับเขตอำนาจศาลในคดีแพ่งและพาณิชย์ที่มีปัจจัยต่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Kewenangan Mengadili Perkara Perdata dan Dagang yang Mengandung Unsur Asing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Bidang Kuasa Kes Sivil dan Perdagangan yang Mengandungi Unsur Asing",
)
ITEMS["CN-JI-0296"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về tội phạm có tổ chức mang tính xã hội đen",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับองค์กรอาชญากรรมที่มีลักษณะมาเฟีย",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Organisasi Kriminal Bersifat Mafia",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Organisasi Jenayah Bersifat Mafia",
)
ITEMS["CN-JI-0319"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về phá hoại tài nguyên đồng cỏ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการทำลายทรัพยากรทุ่งหญ้า",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perusakan Sumber Daya Padang Rumput",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Sumber Padang Rumput",
)
ITEMS["CN-JI-0346"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án tranh chấp liên quan đến sính lễ",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทเกี่ยวกับสินสอด",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Sengketa terkait Mahar Perkahwinan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pertikaian Berkaitan Mas Kahwin",
)
ITEMS["CN-JI-0349"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử vụ án dân sự liên quan đến hoạt động công chứng",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีแพ่งที่เกี่ยวข้องกับกิจกรรมการรับรองเอกสาร",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara Perdata Terkait Kegiatan Notaris",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes Sivil Berkaitan Kegiatan Notari",
)
ITEMS["CN-JI-0352"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp dân sự liên quan đến tên miền trên mạng máy tính",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีแพ่งข้อพิพาทที่เกี่ยวข้องกับชื่อโดเมนบนเครือข่ายคอมพิวเตอร์",
    "Penafsiran Mahkamah Rakyat Agung tentang Penanganan Sengketa Perdata Terkait Nama Domain pada Jaringan Komputer",
    "Tafsiran Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Sivil Berkaitan Nama Domain pada Rangkaian Komputer",
)
ITEMS["CN-JI-0374"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về gây nguy hại cho thông tin liên lạc quân sự",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการก่ออันตรายต่อการสื่อสารทางทหาร",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana yang Membahayakan Komunikasi Militer",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah yang Membahayakan Komunikasi Tentera",
)
ITEMS["CN-JI-0375"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về làm giả tiền tệ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการปลอมแปลงเงินตรา",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pemalsuan Mata Uang",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pemalsuan Mata Wang",
)
ITEMS["CN-JI-0377"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về việc đánh cắp, thăm dò, mua chuộc, cung cấp trái phép bí mật nhà nước và tình báo cho nước ngoài",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการลักลอบ สอดแนม รับสินบน หรือจัดหาให้ต่างประเทศซึ่งความลับของรัฐและข่าวกรองโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pencurian, Penyelidikan, Penyuapan dan Pemberian Rahasia Negara serta Intelijen kepada Pihak Asing secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pencurian, Pengintipan, Rasuah dan Pembekalan Rahsia Negara serta Perisikan kepada Pihak Asing secara Tidak Sah",
)
ITEMS["CN-JI-0434"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Đầu tư nước ngoài nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยการลงทุนต่างประเทศแห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Penanaman Modal Asing Republik Rakyat Tiongkok",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Pelaburan Asing Republik Rakyat China",
)
ITEMS["CN-JI-0451"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về phạm vi thẩm quyền xét xử vụ án của tòa án vận tải đường sắt",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยขอบเขตเขตอำนาจศาลในคดีของศาลการขนส่งทางรถไฟ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Ruang Lingkup Kewenangan Mengadili Perkara Pengadilan Pengangkutan Kereta Api",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Lingkup Bidang Kuasa Kes Mahkamah Pengangkutan Keretapi",
)
ITEMS["CN-JI-0481"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách diễn đạt điều khoản của Bộ luật Hình sự trước và sau khi sửa đổi trong bản án, quyết định của tòa án",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีการระบุข้อบทของประมวลกฎหมายอาญาก่อนและหลังการแก้ไขเพิ่มเติมในคำพิพากษาและคำวินิจฉัยของศาล",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Merumuskan Pasal Kitab Undang-Undang Hukum Pidana sebelum dan sesudah Perubahan dalam Putusan dan Penetapan Pengadilan",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Merumuskan Fasal Kanun Keseksaan sebelum dan selepas Pindaan dalam Penghakiman dan Penetapan Mahkamah",
)
ITEMS["CN-JI-0496"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật khi tính lãi nợ trong thời gian chậm thi hành án",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการคำนวณดอกเบี้ยหนี้ระหว่างระยะเวลาการบังคับคดีล่าช้า",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penghitungan Bunga Utang selama Tenggang Waktu Pelaksanaan yang Tertunda",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengiraan Faedah Hutang sepanjang Tempoh Pelaksanaan yang Lewat",
)
ITEMS["CN-LAW-0016"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về khoản 2 Điều 93 Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยวรรคสองของมาตรา 93 แห่งประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Ayat (2) Pasal 93 Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Fasal (2) Seksyen 93 Kanun Keseksaan Republik Rakyat China",
)
ITEMS["CN-PIA-014"] = (
    "Quy định về phạm vi thông tin cá nhân thiết yếu của các loại ứng dụng di động phổ biến",
    "ข้อกำหนดว่าด้วยขอบเขตข้อมูลส่วนบุคคลที่จำเป็นของแอปพลิเคชันอินเทอร์เน็ตเคลื่อนที่ประเภทที่พบได้ทั่วไป",
    "Ketentuan tentang Ruang Lingkup Informasi Pribadi yang Diperlukan bagi Jenis Aplikasi Internet Bergerak yang Umum",
    "Peruntukan tentang Lingkup Maklumat Peribadi yang Perlu bagi Jenis Aplikasi Internet Mudah Alih yang Lazim",
)
ITEMS["CN-REG-0020"] = (
    "Quy định tạm thời về miễn thuế nhập khẩu đối với đồ dùng chuyên dụng của người khuyết tật",
    "ข้อกำหนดชั่วคราวว่าด้วยการยกเว้นภาษีนำเข้าสำหรับสิ่งของใช้เฉพาะของผู้พิการ",
    "Ketentuan Sementara tentang Pembebasan Pajak Impor atas Barang Khusus Penyandang Disabilitas",
    "Peruntukan Sementara mengenai Pengecualian Cukai Import bagi Barang Khas Orang Kurang Upaya",
)
ITEMS["CN-REG-0106"] = (
    "Quy định về hạn mức bồi thường hàng hải đối với tàu dưới 300 tổng dung tích và tàu vận tải ven biển, tàu hoạt động ven biển",
    "ข้อกำหนดว่าด้วยวงเงินค่าชดเชยทางทะเลสำหรับเรือที่มีน้ำหนักรวมต่ำกว่า 300 ตันกรอส เรือขนส่งชายฝั่ง และเรือปฏิบัติงานชายฝั่ง",
    "Ketentuan tentang Batas Ganti Rugi Maritim bagi Kapal di Bawah 300 Tonase Bruto, Kapal Pengangkutan Pesisir dan Kapal Operasi Pesisir",
    "Peruntukan tentang Had Pampasan Maritim bagi Kapal Bawah 300 Tan Berat Kasar, Kapal Pengangkutan Pesisir dan Kapal Operasi Pesisir",
)
ITEMS["CN-REG-0153"] = (
    "Quy định của Quốc vụ viện về tiêu chuẩn khai báo tập trung kinh tế",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยเกณฑ์การแจ้งการรวมธุรกิจ",
    "Ketentuan Dewan Negara tentang Ambang Pemberitahuan Pemusatan Usaha",
    "Peruntukan Majlis Negara mengenai Ambang Pemberitahuan Pemusatan Perniagaan",
)
ITEMS["CN-JI-0001"] = (
    "Giải thích về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về hành nghề y trái phép",
    "การตีความว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการประกอบวิชาชีพเวชกรรมโดยมิชอบ",
    "Penafsiran tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Praktik Kedokteran secara Tidak Sah",
    "Tafsiran mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Amalan Perubatan secara Tidak Sah",
)
ITEMS["CN-JI-0016"] = (
    "Thông báo của Tòa án Nhân dân Tối cao, Viện Kiểm sát Nhân dân Tối cao và Bộ Công an về việc ban hành Giải đáp một số vấn đề áp dụng pháp luật cụ thể trong xử lý vụ án phạm tội có tổ chức hiện nay",
    "ประกาศของศาลประชาชนสูงสุด อัยการประชาชนสูงสุด และกระทรวงความมั่นคงสาธารณะว่าด้วยการประกาศใช้คำตอบเกี่ยวกับปัญหาหลายประการในการใช้กฎหมายโดยเฉพาะในการดำเนินคดีอาชญากรรมแบบองค์กรในปัจจุบัน",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung dan Kementerian Keamanan Publik tentang Pengundangan Tanya Jawab mengenai Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Tindak Pidana Terorganisasi pada Masa Kini",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung dan Kementerian Keselamatan Awam mengenai Penguatkuasaan Soal Jawab tentang Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Terancang pada Masa Kini",
)
ITEMS["CN-JI-0027"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về sản xuất, buôn bán, sử dụng trái phép thuốc bị cấm dùng trong thức ăn chăn nuôi và nước uống cho động vật",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการผลิต จำหน่าย และใช้ยาเวชภัณฑ์ที่ห้ามใช้ในอาหารสัตว์และน้ำดื่มของสัตว์โดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Produksi, Penjualan dan Penggunaan Obat yang Dilarang dalam Pakan dan Air Minum Ternak secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengeluaran, Penjualan dan Penggunaan Ubat yang Dilarang dalam Makanan Ternak dan Air Minuman Haiwan secara Tidak Sah",
)
ITEMS["CN-JI-0030"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về sản xuất, mua bán, vận chuyển, tàng trữ các hóa chất cực độc bị cấm như thuốc diệt chuột mạnh",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการผลิต ซื้อขาย ขนย้าย และเก็บรักษาสารเคมีอันตรายร้ายแรงที่ถูกห้าม เช่น ยาเบื่อหนูชนิดรุนแรง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Produksi, Jual Beli, Pengangkutan dan Penyimpanan Bahan Kimia Sangat Beracun yang Dilarang seperti Racun Tikus Kuat",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengeluaran, Jual Beli, Pengangkutan dan Penyimpanan Bahan Kimia Amat Beracun yang Dilarang seperti Racun Tikus Kuat",
)
ITEMS["CN-JI-0031"] = (
    "Quy định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề trong xử lý vụ án công ích về tài nguyên thiên nhiên biển và môi trường sinh thái",
    "ข้อกำหนดของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีเพื่อประโยชน์สาธารณะเกี่ยวกับทรัพยากรธรรมชาติทางทะเลและสิ่งแวดล้อมเชิงนิเวศ",
    "Ketentuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Kepentingan Publik tentang Sumber Daya Alam Laut dan Lingkungan Ekologi",
    "Peruntukan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Kepentingan Awam tentang Sumber Asli Laut dan Alam Sekitar Ekologi",
)
ITEMS["CN-JI-0062"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự liên quan đến trộm cắp, cướp, lừa đảo, cướp giật xe cơ giới",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาที่เกี่ยวข้องกับการลักทรัพย์ ปล้น ชิงทรัพย์ ฉ้อโกงยานยนต์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Terkait Pencurian, Perampokan, Penipuan dan Perampasan Kendaraan Bermotor",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Berkaitan Kecurian, Rompakan, Penipuan dan Peragutan Kenderaan Bermotor",
)
ITEMS["CN-JI-0106"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án yêu cầu xét xử lại theo thủ tục hành chính",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีคำขอให้พิจารณาคดีใหม่ตามกระบวนการปกครอง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Permohonan Pemeriksaan Ulang dalam Perkara Tata Usaha Negara",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Permohonan Semakan Semula dalam Perkara Pentadbiran",
)
ITEMS["CN-JI-0130"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án dân sự và hành chính về sở hữu trí tuệ ở cấp sơ thẩm",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีแพ่งและคดีปกครองเกี่ยวกับทรัพย์สินทางปัญญาในชั้นต้น",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Perdata dan Tata Usaha Negara tentang Kekayaan Intelektual pada Tingkat Pertama",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Sivil dan Pentadbiran tentang Harta Intelek pada Peringkat Pertama",
)
ITEMS["CN-JI-0204"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc xác định trách nhiệm bồi thường thiệt hại về tinh thần trong xâm phạm quyền dân sự",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการกำหนดความรับผิดชดเชยความเสียหายทางจิตใจในกรณีละเมิดสิทธิทางแพ่ง",
    "Penafsiran Mahkamah Rakyat Agung tentang Penetapan Tanggung Jawab Ganti Rugi Kerugian Immaterial dalam Pelanggaran Hak Perdata",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penetapan Tanggungjawab Pampasan Kerosakan Mental dalam Pelanggaran Hak Sivil",
)
ITEMS["CN-JI-0219"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc tòa án nhân dân niêm phong hàng hóa vận chuyển bằng đường sắt",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการที่ศาลประชาชนอายัดสินค้าที่ขนส่งทางรถไฟ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penyitaan Barang Angkutan Kereta Api oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Penyitaan Barang Angkutan Keretapi oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0248"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc học tập, tuyên truyền và triển khai Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa đã được sửa đổi",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการศึกษา เผยแพร่ และดำเนินการตามประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีนฉบับแก้ไขเพิ่มเติม",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pembelajaran, Penyebarluasan dan Pelaksanaan Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok yang Telah Diubah",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Pembelajaran, Penyebaran dan Pelaksanaan Kanun Keseksaan Republik Rakyat China yang Telah Dipinda",
)
ITEMS["CN-JI-0262"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong tranh chấp xâm phạm sở hữu trí tuệ trên mạng",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในข้อพิพาทการละเมิดทรัพย์สินทางปัญญาบนเครือข่าย",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Sengketa Pelanggaran Kekayaan Intelektual di Jaringan",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pertikaian Pelanggaran Harta Intelek di Rangkaian",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[360:420]]
missing = [i for i in want if i not in ITEMS]
extra = [i for i in ITEMS if i not in want]
assert not missing, "缺条目: %s" % missing
assert not extra, "多余条目: %s" % extra

out = {}
for i in want:
    vi, th, iid, ms = ITEMS[i]
    out[i] = {"vi": vi, "th": th, "id": iid, "ms": ms}

doc = {
    "batch": "cn-p1-b25",
    "scope": "CN 第 361–420 部（_cn_rest.json 360–419）",
    "note": "语义基准 title.zh；涉港澳台按中国表述；主体译名沿用既有批次。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b25.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部" % (dst, len(out)))
