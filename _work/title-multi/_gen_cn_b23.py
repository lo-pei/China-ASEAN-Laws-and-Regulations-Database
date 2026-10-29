# -*- coding: utf-8 -*-
"""CN 第 23 批：_cn_rest.json 第 240–299 条（60 部）。
主体译名沿用既有批次：最高人民法院 / 最高人民检察院 / 常委会 / 国务院。
"""
import io, json, os

SPC = {
    "vi": "Tòa án Nhân dân Tối cao", "th": "ศาลประชาชนสูงสุด",
    "id": "Mahkamah Rakyat Agung", "ms": "Mahkamah Rakyat Agung",
}
SPP = {
    "vi": "Viện Kiểm sát Nhân dân Tối cao", "th": "อัยการประชาชนสูงสุด",
    "id": "Kejaksaan Rakyat Agung", "ms": "Kejaksaan Rakyat Agung",
}

ITEMS = {}
ZH_FIX = {}

# ---------- 最高人民法院 民商事/程序类 ----------
ITEMS["CN-JI-0206"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về thủ tục xác nhận tư pháp đối với thỏa thuận hòa giải nhân dân",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการรับรองทางตุลาการของข้อตกลงไกล่เกลี่ยของประชาชน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Tata Cara Pengesahan Yudisial atas Kesepakatan Mediasi Rakyat",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Tatacara Pengesahan Kehakiman bagi Persetujuan Pengantaraan Rakyat",
)
ITEMS["CN-JI-0257"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc tống đạt văn bản tố tụng trong vụ án dân sự và thương mại liên quan đến Hồng Kông và Ma Cao",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการส่งหมายเอกสารทางกฎหมายในคดีแพ่งและพาณิชย์ที่เกี่ยวข้องกับฮ่องกงและมาเก๊า",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penyampaian Dokumen Hukum dalam Perkara Perdata dan Dagang yang Berkaitan dengan Hong Kong dan Makau",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Penyampaian Dokumen Perundangan dalam Kes Sivil dan Perdagangan yang Berkaitan dengan Hong Kong dan Makau",
)
ITEMS["CN-JI-0295"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp bồi thường thiệt hại tài nguyên thiên nhiên biển và môi trường sinh thái",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทเรื่องค่าชดเชยความเสียหายต่อทรัพยากรธรรมชาติทางทะเลและสิ่งแวดล้อมเชิงนิเวศ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Sengketa Ganti Rugi Kerusakan Sumber Daya Alam Laut dan Lingkungan Ekologi",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Pampasan Kerosakan Sumber Asli Laut dan Alam Sekitar Ekologi",
)
ITEMS["CN-JI-0308"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử tranh chấp dân sự về xâm phạm quyền nhân thân thông qua mạng thông tin",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีแพ่งเกี่ยวกับการละเมิดสิทธิในความเป็นบุคคลผ่านเครือข่ายสารสนเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Perdata atas Pelanggaran Hak Pribadi melalui Jaringan Informasi",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Sivil atas Pelanggaran Hak Peribadi melalui Rangkaian Maklumat",
)
ITEMS["CN-JI-0351"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử vụ án bồi thường thiệt hại ngoài hợp đồng liên quan đến công ty kiểm toán trong hoạt động kiểm toán",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีชดเชยความเสียหายทางแพ่งที่มิได้เกิดจากสัญญาซึ่งเกี่ยวข้องกับบริษัทตรวจสอบบัญชีในการประกอบกิจการตรวจสอบบัญชี",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara Ganti Rugi Perdata di Luar Kontrak yang Melibatkan Kantor Akuntan Publik dalam Kegiatan Audit",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes Pampasan Sivil di Luar Kontrak yang Melibatkan Firma Audit dalam Kegiatan Audit",
)
ITEMS["CN-JI-0368"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng chế độ thời hiệu yêu cầu trong việc xét xử vụ án bồi thường tư pháp",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ระบบอายุความในการยื่นคำขอในคดีชดเชยทางตุลาการ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Rezim Daluwarsa Permohonan dalam Penanganan Perkara Ganti Rugi Yudisial",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Rejim Had Masa Permohonan dalam Pengendalian Kes Pampasan Kehakiman",
)
ITEMS["CN-JI-0370"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp bồi thường thiệt hại về thân thể trong vận tải đường sắt",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทเรื่องค่าชดเชยความเสียหายต่อร่างกายในการขนส่งทางรถไฟ",
    "Penafsiran Mahkamah Rakyat Agung tentang Penanganan Sengketa Ganti Rugi Kerusakan Fisik dalam Pengangkutan Kereta Api",
    "Tafsiran Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Pampasan Kerosakan Fizikal dalam Pengangkutan Keretapi",
)
ITEMS["CN-JI-0447"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về bảo đảm quyền và lợi ích hợp pháp của đương sự trong thủ tục xem xét lại án tử hình và thi hành án",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการคุ้มครองสิทธิและผลประโยชน์โดยชอบด้วยกฎหมายของคู่ความในขั้นตอนการทบทวนคำพิพากษาประหารชีวิตและการบังคับโทษ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Perlindungan Hak dan Kepentingan Hukum Para Pihak dalam Tata Cara Peninjauan Kembali Putusan Mati dan Pelaksanaannya",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Perlindungan Hak dan Kepentingan Sah Para Pihak dalam Tatacara Semakan Semula Hukuman Mati dan Pelaksanaannya",
)
ITEMS["CN-JI-0472"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử vụ án của tòa án lưu động",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีของศาลเคลื่อนที่",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara oleh Pengadilan Keliling",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes oleh Mahkamah Bergerak",
)
ITEMS["CN-JI-0506"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về công tác kiến nghị tư pháp trong lĩnh vực quản lý xã hội tổng hợp",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยงานข้อเสนอแนะทางตุลาการด้านการบริหารสังคมแบบองค์รวม",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Pekerjaan Rekomendasi Yudisial di Bidang Penataan Sosial Terpadu",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Kerja Cadangan Kehakiman dalam Bidang Pengurusan Sosial Bersepadu",
)
ITEMS["CN-JI-0559"] = (
    "Một số quy định của Viện Kiểm sát Nhân dân Tối cao về việc gửi qua đường bưu điện bằng dịch vụ chuyển phát chuyên dụng của ngành kiểm sát các văn bản pháp luật liên quan đến công tác kiểm sát",
    "ข้อกำหนดหลายประการของอัยการประชาชนสูงสุดว่าด้วยการส่งเอกสารทางกฎหมายที่เกี่ยวกับงานอัยการโดยทางไปรษณีย์ผ่านบริการส่งด่วนพิเศษของสำนักงานอัยการ",
    "Beberapa Ketentuan Kejaksaan Rakyat Agung tentang Penyampaian Dokumen Hukum Terkait Kejaksaan melalui Pos dengan Layanan Kurir Khusus Kejaksaan",
    "Beberapa Peruntukan Kejaksaan Rakyat Agung mengenai Penyampaian Dokumen Perundangan Berkaitan Kejaksaan melalui Pos dengan Perkhidmatan Kurier Khas Kejaksaan",
)
ITEMS["CN-LAW-0044"] = (
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về chế độ cấp bậc của binh sĩ tại ngũ thuộc Quân Giải phóng Nhân dân Trung Quốc",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยระบบชั้นยศของทหารประจำการแห่งกองทัพปลดปล่อยประชาชนจีน",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Sistem Kepangkatan Prajurit Aktif Tentara Pembebasan Rakyat Tiongkok",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Sistem Pangkat Askar Aktif Tentera Pembebasan Rakyat China",
)
ITEMS["CN-LAW-APPLICATION-J2-2023"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Áp dụng pháp luật đối với quan hệ dân sự có yếu tố nước ngoài của nước Cộng hòa Nhân dân Trung Hoa (Phần hai)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยการใช้กฎหมายกับความสัมพันธ์ทางแพ่งที่มีปัจจัยต่างประเทศแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang tentang Penerapan Hukum terhadap Hubungan Perdata yang Mengandung Unsur Asing Republik Rakyat Tiongkok (Bagian Kedua)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang tentang Penggunaan Undang-Undang bagi Hubungan Sivil yang Mengandungi Unsur Asing Republik Rakyat China (Bahagian Kedua)",
)

# ---------- 部门规章 ----------
for _id in ("CN-PIA-011", "CN-PIPL-SCC-2023"):
    ITEMS[_id] = (
        "Biện pháp hợp đồng tiêu chuẩn về chuyển thông tin cá nhân ra nước ngoài",
        "มาตรการสัญญามาตรฐานการส่งข้อมูลส่วนบุคคลออกนอกประเทศ",
        "Tata Cara Kontrak Standar Pengiriman Informasi Pribadi ke Luar Negeri",
        "Tatacara Kontrak Standard bagi Pemindahan Maklumat Peribadi ke Luar Negara",
    )
ITEMS["CN-REG-0130"] = (
    "Quy định về việc cấm cơ quan hành chính nhà nước và nhân viên của cơ quan này tặng, nhận quà trong hoạt động công vụ trong nước",
    "ข้อกำหนดว่าด้วยการห้ามหน่วยงานบริหารราชการแผ่นดินและเจ้าหน้าที่ของหน่วยงานดังกล่าวให้หรือรับของกำนัลในการปฏิบัติราชการภายในประเทศ",
    "Ketentuan tentang Larangan Pemberian dan Penerimaan Hadiah oleh Badan Administrasi Negara dan Pegawainya dalam Kegiatan Dinas di Dalam Negeri",
    "Peruntukan tentang Larangan Pemberian dan Penerimaan Hadiah oleh Badan Pentadbiran Negara dan Pegawainya dalam Kegiatan Rasmi di Dalam Negara",
)
ITEMS["CN-REG-0136"] = (
    "Quy định của Quốc vụ viện và Quân ủy Trung ương về bảo vệ tuyến thông tin liên lạc",
    "ข้อกำหนดของคณะรัฐมนตรีและคณะกรรมาธิการการทหารกลางว่าด้วยการคุ้มครองสายการสื่อสาร",
    "Ketentuan Dewan Negara dan Komisi Militer Pusat tentang Perlindungan Jalur Komunikasi",
    "Peruntukan Majlis Negara dan Suruhanjaya Ketenteraan Pusat mengenai Perlindungan Laluan Komunikasi",
)
ITEMS["CN-REG-0154"] = (
    "Biện pháp thực hiện phong trào trồng cây nghĩa vụ toàn dân",
    "มาตรการดำเนินการขบวนการปลูกต้นไม้ตามหน้าที่ของประชาชนทั้งมวล",
    "Tata Cara Pelaksanaan Gerakan Penanaman Pohon Wajib bagi Seluruh Rakyat",
    "Tatacara Pelaksanaan Gerakan Penanaman Pokok Wajib Seluruh Rakyat",
)
ITEMS["CN-REG-0158"] = (
    "Quy định của Quốc vụ viện về thực hiện chế độ quản lý đăng ký vốn điều lệ theo Luật Công ty nước Cộng hòa Nhân dân Trung Hoa",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการดำเนินการตามระบบการบริหารการจดทะเบียนทุนจดทะเบียนแห่งพระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน",
    "Ketentuan Dewan Negara tentang Pelaksanaan Sistem Pengelolaan Pendaftaran Modal Terdaftar menurut Undang-Undang Perseroan Republik Rakyat Tiongkok",
    "Peruntukan Majlis Negara mengenai Pelaksanaan Sistem Pengurusan Pendaftaran Modal Berdaftar menurut Akta Syarikat Republik Rakyat China",
)
ITEMS["CN-REG-0366"] = (
    "Quy định về quản lý thiết bị thu tín hiệu truyền hình vệ tinh trên mặt đất",
    "ข้อกำหนดว่าด้วยการบริหารอุปกรณ์รับสัญญาณโทรทัศน์ผ่านดาวเทียมภาคพื้นดิน",
    "Ketentuan tentang Pengelolaan Perangkat Penerima Siaran Televisi Satelit di Permukaan Bumi",
    "Peruntukan tentang Pengurusan Peranti Penerima Siaran Televisyen Satelit di Permukaan Bumi",
)
ITEMS["CN-REG-0419"] = (
    "Quy định tạm thời về việc thu phụ thu giáo dục",
    "ข้อกำหนดชั่วคราวว่าด้วยการจัดเก็บค่าธรรมเนียมเพิ่มเติมเพื่อการศึกษา",
    "Ketentuan Sementara tentang Pengenaan Pungutan Tambahan Pendidikan",
    "Peruntukan Sementara mengenai Pengenaan Caj Tambahan Pendidikan",
)

# ---------- 两高联合解释 ----------
def both(s_vi, s_th, s_id, s_ms):
    return (s_vi, s_th, s_id, s_ms)

ITEMS["CN-JI-0045"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về sản xuất, buôn bán hàng hóa giả, kém chất lượng",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการผลิตและการจำหน่ายสินค้าปลอมหรือด้อยคุณภาพ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Produksi dan Penjualan Barang Palsu atau Bermutu Rendah",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengeluaran dan Penjualan Barang Palsu atau Bermutu Rendah",
)
ITEMS["CN-JI-0050"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về vi phạm an toàn sản xuất (Phần hai)",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการละเมิดความปลอดภัยในการผลิต (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana yang Membahayakan Keselamatan Produksi (Bagian Kedua)",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah yang Membahayakan Keselamatan Pengeluaran (Bahagian Kedua)",
)
ITEMS["CN-JI-0059"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về tố tụng giả tạo",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการฟ้องร้องอันเป็นเท็จ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana tentang Gugatan Palsu",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah tentang Guaman Palsu",
)
ITEMS["CN-JI-0061"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về việc che giấu, giấu giếm tài sản do phạm tội mà có và lợi ích sinh ra từ tài sản đó",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการปกปิดหรือปิดบังทรัพย์สินที่ได้มาจากการกระทำความผิดและผลประโยชน์ที่เกิดจากทรัพย์สินนั้น",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana tentang Penyembunyian atau Penutupan Harta Kekayaan Hasil Tindak Pidana dan Keuntungan yang Berasal dari Harta Kekayaan Tersebut",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah tentang Penyembunyian atau Penyorokan Harta Kekayaan Hasil Jenayah dan Keuntungan yang Berasal daripada Harta Kekayaan Tersebut",
)
ITEMS["CN-JI-0090"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về hoạt động thanh toán, quyết toán vốn trái phép và mua bán ngoại hối trái phép",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการประกอบธุรกิจการชำระบัญชีเงินทุนโดยมิชอบและการซื้อขายเงินตราต่างประเทศโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Kegiatan Penyelesaian Pembayaran Dana secara Tidak Sah dan Jual Beli Valuta Asing secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Kegiatan Penyelesaian Pembayaran Dana secara Tidak Sah dan Jual Beli Mata Wang Asing secara Tidak Sah",
)
ZH_FIX["CN-JI-0090"] = "最高人民法院、最高人民检察院关于办理非法从事资金支付结算业务、非法买卖外汇刑事案件适用法律若干问题的解释"

# ---------- 管辖、协助、执行 ----------
ITEMS["CN-JI-0175"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc tăng cường hơn nữa trách nhiệm của hội đồng xét xử",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการเสริมสร้างความรับผิดชอบของคณะผู้พิพากษาให้เข้มแข็งยิ่งขึ้น",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Peningkatan Tanggung Jawab Majelis Hakim",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengukuhan Tanggungjawab Panel Hakim",
)
ITEMS["CN-JI-0188"] = (
    "Thỏa thuận giữa nội địa Trung Quốc và Đặc khu Hành chính Ma Cao về tương trợ bảo toàn trong thủ tục trọng tài",
    "ความตกลงระหว่างจีนแผ่นดินใหญ่กับเขตบริหารพิเศษมาเก๊าว่าด้วยการช่วยเหลือกันในการคุ้มครองทรัพย์สินในขั้นตอนอนุญาโตตุลาการ",
    "Kesepakatan antara Tiongkok Daratan dan Daerah Administratif Khusus Makau tentang Saling Bantu Penjaminan dalam Tata Cara Arbitrase",
    "Persetujuan antara Tanah Besar China dan Wilayah Pentadbiran Khas Makau mengenai Bantuan Bersama Pemuliharaan dalam Tatacara Timbang Tara",
)
ITEMS["CN-JI-0190"] = (
    "Thỏa thuận giữa tòa án nội địa Trung Quốc và tòa án Đặc khu Hành chính Hồng Kông về ủy thác lẫn nhau thu thập chứng cứ trong vụ án dân sự và thương mại",
    "ความตกลงระหว่างศาลจีนแผ่นดินใหญ่กับศาลเขตบริหารพิเศษฮ่องกงว่าด้วยการมอบหมายซึ่งกันและกันให้รวบรวมพยานหลักฐานในคดีแพ่งและพาณิชย์",
    "Kesepakatan antara Pengadilan Tiongkok Daratan dan Pengadilan Daerah Administratif Khusus Hong Kong tentang Saling Penugasan Pengumpulan Bukti dalam Perkara Perdata dan Dagang",
    "Persetujuan antara Mahkamah Tanah Besar China dan Mahkamah Wilayah Pentadbiran Khas Hong Kong mengenai Saling Pengagihan Pengumpulan Bukti dalam Kes Sivil dan Perdagangan",
)
ITEMS["CN-JI-0191"] = (
    "Thỏa thuận giữa nội địa Trung Quốc và Đặc khu Hành chính Hồng Kông về tương trợ bảo toàn trong thủ tục trọng tài",
    "ความตกลงระหว่างจีนแผ่นดินใหญ่กับเขตบริหารพิเศษฮ่องกงว่าด้วยการช่วยเหลือกันในการคุ้มครองทรัพย์สินในขั้นตอนอนุญาโตตุลาการ",
    "Kesepakatan antara Tiongkok Daratan dan Daerah Administratif Khusus Hong Kong tentang Saling Bantu Penjaminan dalam Tata Cara Arbitrase",
    "Persetujuan antara Tanah Besar China dan Wilayah Pentadbiran Khas Hong Kong mengenai Bantuan Bersama Pemuliharaan dalam Tatacara Timbang Tara",
)
ITEMS["CN-JI-0255"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án của Tòa án Tài chính Thượng Hải",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีของศาลการเงินเซี่ยงไฮ้",
    "Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Pengadilan Keuangan Shanghai",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Mahkamah Kewangan Shanghai",
)
ITEMS["CN-JI-0117"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án của Tòa án Tài chính Thành Đô – Trùng Khánh",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีของศาลการเงินเฉิงตู–ฉงชิ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Pengadilan Keuangan Chengdu–Chongqing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Mahkamah Kewangan Chengdu–Chongqing",
)
ITEMS["CN-JI-0276"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử vụ án bồi thường thiệt hại do tai nạn giao thông đường bộ (Phần hai)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีชดเชยความเสียหายจากอุบัติเหตุจราจรทางบก (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Ganti Rugi akibat Kecelakaan Lalu Lintas Jalan (Bagian Kedua)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pampasan akibat Kemalangan Jalan Raya (Bahagian Kedua)",
)
ITEMS["CN-JI-0281"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử vụ án hành chính về chống trợ cấp",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีปกครองเกี่ยวกับการตอบโต้การอุดหนุน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Tata Usaha Negara tentang Tindakan Imbalan Subsidi",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pentadbiran tentang Tindakan Balas Subsidi",
)
ITEMS["CN-JI-0282"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử vụ án hành chính về chống bán phá giá",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีปกครองเกี่ยวกับการตอบโต้การทุ่มตลาด",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Tata Usaha Negara tentang Tindakan Imbalan Dumping",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pentadbiran tentang Tindakan Balas Lambakan",
)
ITEMS["CN-JI-0290"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án hành chính về thương mại quốc tế",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีปกครองเกี่ยวกับการค้าระหว่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Tata Usaha Negara tentang Perdagangan Internasional",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pentadbiran tentang Perdagangan Antarabangsa",
)
ITEMS["CN-JI-0354"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc xét xử vụ án hòa giải, trọng tài tranh chấp liên quan đến hợp đồng khoán kinh doanh đất nông thôn",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีไกล่เกลี่ยและอนุญาโตตุลาการในข้อพิพาทเกี่ยวกับการรับเหมาดำเนินการที่ดินชนบท",
    "Penafsiran Mahkamah Rakyat Agung tentang Penanganan Perkara Mediasi dan Arbitrase Sengketa Terkait Kontrak Usaha Tanah Pedesaan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Pengendalian Kes Pengantaraan dan Timbang Tara Pertikaian Berkaitan Kontrak Usaha Tanah Luar Bandar",
)
ITEMS["CN-JI-0371"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án bồi thường thiệt hại trong vận tải đường sắt",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีชดเชยความเสียหายในการขนส่งทางรถไฟ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Ganti Rugi dalam Pengangkutan Kereta Api",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pampasan dalam Pengangkutan Keretapi",
)
ITEMS["CN-JI-0458"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về hạn chế chi tiêu cao và các chi tiêu liên quan của người phải thi hành án",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการจำกัดการใช้จ่ายระดับสูงและการใช้จ่ายที่เกี่ยวข้องของลูกหนี้ตามคำพิพากษา",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Pembatasan Pengeluaran Tinggi dan Pengeluaran Terkait bagi Pihak yang Wajib Melaksanakan Putusan",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Sekatan Perbelanjaan Tinggi dan Perbelanjaan Berkaitan bagi Pihak yang Wajib Melaksanakan Penghakiman",
)
ITEMS["CN-JI-0475"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc thực hiện yêu cầu tương trợ tư pháp về tống đạt văn bản tố tụng và thu thập chứng cứ trong vụ án dân sự, thương mại theo công ước quốc tế và hiệp định tương trợ tư pháp song phương",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการดำเนินการตามคำขอความช่วยเหลือทางตุลาการเรื่องการส่งหมายเอกสารทางกฎหมายและการรวบรวมพยานหลักฐานในคดีแพ่งและพาณิชย์ตามอนุสัญญาระหว่างประเทศและสนธิสัญญาว่าด้วยความช่วยเหลือทางตุลาการทวิภาคี",
    "Ketentuan Mahkamah Rakyat Agung tentang Pelaksanaan Permohonan Bantuan Hukum Timbal Balik mengenai Penyampaian Dokumen Hukum dan Pengumpulan Bukti dalam Perkara Perdata dan Dagang berdasarkan Konvensi Internasional dan Perjanjian Bantuan Hukum Timbal Balik Bilateral",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pelaksanaan Permohonan Bantuan Kehakiman mengenai Penyampaian Dokumen Perundangan dan Pengumpulan Bukti dalam Kes Sivil dan Perdagangan menurut Konvensyen Antarabangsa dan Perjanjian Bantuan Kehakiman Dua Hala",
)
ITEMS["CN-JI-0477"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc tống đạt văn bản tố tụng dân sự qua đường bưu điện bằng dịch vụ chuyển phát chuyên dụng của tòa án",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการส่งหมายเอกสารในคดีแพ่งทางไปรษณีย์ผ่านบริการส่งด่วนพิเศษของศาล",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penyampaian Dokumen Perkara Perdata melalui Pos dengan Layanan Kurir Khusus Pengadilan",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Penyampaian Dokumen Kes Sivil melalui Pos dengan Perkhidmatan Kurier Khas Mahkamah",
)
ITEMS["CN-JI-0484"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về các vấn đề liên quan đến dấu hiệu tội phạm kinh tế trong xét xử vụ án tranh chấp kinh tế",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยประเด็นที่เกี่ยวข้องกับพฤติการณ์อันควรสงสัยว่าเป็นอาชญากรรมทางเศรษฐกิจในการพิจารณาคดีข้อพิพาททางเศรษฐกิจ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Masalah Terkait Dugaan Tindak Pidana Ekonomi dalam Penanganan Perkara Sengketa Ekonomi",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Isu Berkaitan Syak Tindak Jenayah Ekonomi dalam Pengendalian Kes Pertikaian Ekonomi",
)
ITEMS["CN-LAW-0029"] = (
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về trừng trị tội mua ngoại hối bằng gian dối, tội chuyển ngoại hối ra nước ngoài và tội mua bán ngoại hối trái phép",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยการลงโทษความผิดเกี่ยวกับการซื้อเงินตราต่างประเทศโดยฉ้อฉล การยักย้ายเงินตราต่างประเทศออกนอกประเทศ และการซื้อขายเงินตราต่างประเทศโดยมิชอบ",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Penghukuman Tindak Pidana Pembelian Valuta Asing secara Curang, Pelarian Valuta Asing ke Luar Negeri, dan Jual Beli Valuta Asing secara Tidak Sah",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Penghukuman Jenayah Pembelian Mata Wang Asing secara Curang, Pelarian Mata Wang Asing ke Luar Negara dan Jual Beli Mata Wang Asing secara Tidak Sah",
)

# ---------- 行政法规（续） ----------
ITEMS["CN-REG-0023"] = (
    "Biện pháp xử lý tạm thời đối với việc kiểm tra, phát hiện ngoại tệ hoặc giấy tờ có giá bằng ngoại tệ giấu trong bưu phẩm",
    "มาตรการดำเนินการชั่วคราวว่าด้วยการตรวจค้นและพบเงินตราต่างประเทศหรือตั๋วเงินตราต่างประเทศที่ซุกซ่อนในสิ่งส่งทางไปรษณีย์",
    "Tata Cara Penanganan Sementara atas Pemeriksaan dan Penemuan Valuta Asing atau Surat Berharga Valuta Asing yang Diselipkan dalam Kiriman Pos",
    "Tatacara Pengendalian Sementara bagi Pemeriksaan dan Penemuan Mata Wang Asing atau Surat Berharga Mata Wang Asing yang Diselitkan dalam Kiriman Pos",
)
ITEMS["CN-REG-0088"] = (
    "Quy định về chế độ đứng tên thật đối với tài khoản tiền gửi cá nhân",
    "ข้อกำหนดว่าด้วยระบบชื่อจริงสำหรับบัญชีเงินฝากส่วนบุคคล",
    "Ketentuan tentang Sistem Nama Sebenarnya bagi Rekening Simpanan Perseorangan",
    "Peruntukan tentang Sistem Nama Sebenar bagi Akaun Simpanan Peribadi",
)
ITEMS["CN-REG-0108"] = (
    "Quy định tạm thời về việc quản lý, sử dụng kinh phí phúc lợi của nhân viên cơ quan nhà nước",
    "ข้อกำหนดชั่วคราวว่าด้วยการบริหารและการใช้จ่ายเงินสวัสดิการของเจ้าหน้าที่หน่วยงานของรัฐ",
    "Ketentuan Sementara tentang Pengelolaan dan Penggunaan Dana Kesejahteraan Pegawai Badan Negara",
    "Peruntukan Sementara mengenai Pengurusan dan Penggunaan Dana Kebajikan Pegawai Badan Negara",
)
ITEMS["CN-REG-0151"] = (
    "Một số quy định của Quốc vụ viện về việc hoàn thiện hơn nữa chính sách kinh tế văn hóa",
    "ข้อกำหนดหลายประการของคณะรัฐมนตรีว่าด้วยการปรับปรุงนโยบายเศรษฐกิจวัฒนธรรมให้สมบูรณ์ยิ่งขึ้น",
    "Beberapa Ketentuan Dewan Negara tentang Penyempurnaan Kebijakan Ekonomi Budaya",
    "Beberapa Peruntukan Majlis Negara mengenai Penyempurnaan Dasar Ekonomi Budaya",
)
ITEMS["CN-REG-0155"] = (
    "Quy định tạm thời của Quốc vụ viện về quản lý cấp phát kinh phí khoa học và công nghệ",
    "ข้อกำหนดชั่วคราวของคณะรัฐมนตรีว่าด้วยการบริหารการจัดสรรงบประมาณวิทยาศาสตร์และเทคโนโลยี",
    "Ketentuan Sementara Dewan Negara tentang Pengelolaan Pengalokasian Anggaran Ilmu Pengetahuan dan Teknologi",
    "Peruntukan Sementara Majlis Negara mengenai Pengurusan Peruntukan Anggaran Sains dan Teknologi",
)
ITEMS["CN-REG-0351"] = (
    "Quy tắc quản lý tàu thuyền phi quân sự mang quốc tịch nước ngoài khi đi qua eo biển Quỳnh Châu",
    "กฎว่าด้วยการบริหารเรือที่มิใช่เรือทหารสัญชาติต่างประเทศที่ผ่านช่องแคบฉงโจว",
    "Peraturan Pengelolaan Kapal Nonmiliter Berkebangsaan Asing yang Melintasi Selat Qiongzhou",
    "Peraturan Pengurusan Kapal Bukan Tentera Berwarganegara Asing yang Melalui Selat Qiongzhou",
)
ITEMS["CN-REG-0359"] = (
    "Quy định về quản lý nhân viên quốc tịch Trung Quốc của cơ quan ngoại giao, lãnh sự nước ngoài tại Trung Quốc",
    "ข้อกำหนดว่าด้วยการบริหารลูกจ้างสัญชาติจีนของสถานทูตและสถานกงสุลต่างประเทศประจำจีน",
    "Ketentuan tentang Pengelolaan Pegawai Berkebangsaan Tiongkok pada Perwakilan Diplomatik dan Konsuler Asing di Tiongkok",
    "Peruntukan tentang Pengurusan Pekerja Berwarganegara China pada Perwakilan Diplomatik dan Konsular Asing di China",
)

# ---------- 两高解释（续） ----------
ITEMS["CN-JI-0037"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về giao dịch nội gián và làm lộ thông tin nội bộ",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการซื้อขายหลักทรัพย์โดยใช้ข้อมูลภายในและการเปิดเผยข้อมูลภายใน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perdagangan Orang Dalam dan Pembocoran Informasi Orang Dalam",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Dagang Dalaman dan Pembocoran Maklumat Dalaman",
)
ITEMS["CN-JI-0047"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về xâm phạm an toàn hệ thống thông tin máy tính",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการคุกคามความปลอดภัยของระบบสารสนเทศคอมพิวเตอร์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana yang Membahayakan Keamanan Sistem Informasi Komputer",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah yang Membahayakan Keselamatan Sistem Maklumat Komputer",
)
ITEMS["CN-JI-0063"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về lừa đảo",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการฉ้อโกง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Penipuan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penipuan",
)
ITEMS["CN-JI-0089"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về thao túng thị trường chứng khoán và thị trường hàng hóa tương lai",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการปั่นตลาดหลักทรัพย์และตลาดซื้อขายล่วงหน้า",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Manipulasi Pasar Efek dan Pasar Berjangka",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Manipulasi Pasaran Sekuriti dan Pasaran Niaga Hadapan",
)
ZH_FIX["CN-JI-0089"] = "最高人民法院、最高人民检察院关于办理操纵证券、期货市场刑事案件适用法律若干问题的解释"

ITEMS["CN-JI-0105"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xử lý vụ án yêu cầu Tòa án Nhân dân cưỡng chế thi hành quyết định bồi thường khi thu hồi nhà ở trên đất thuộc sở hữu nhà nước",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการดำเนินคดีคำขอให้ศาลประชาชนบังคับคดีตามคำวินิจฉัยชดเชยการเวนคืนอาคารบนที่ดินของรัฐ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara Permohonan Pelaksanaan Paksa oleh Pengadilan terhadap Keputusan Ganti Rugi Pengambilalihan Rumah di atas Tanah Milik Negara",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes Permohonan Pelaksanaan Paksa oleh Mahkamah bagi Keputusan Pampasan Pengambilan Balik Rumah di atas Tanah Milik Negara",
)
ITEMS["CN-JI-0161"] = (
    "Quy định của Tòa án Nhân dân Tối cao về công tác thụ lý vụ án bồi thường nhà nước",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยงานการรับคดีชดเชยแห่งรัฐ",
    "Ketentuan Mahkamah Rakyat Agung tentang Pekerjaan Pendaftaran Perkara Ganti Rugi Negara",
    "Peruntukan Mahkamah Rakyat Agung mengenai Kerja Pendaftaran Kes Pampasan Negara",
)
ITEMS["CN-JI-0209"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc tòa án nhân dân xử lý vụ án tiếp nhận cư dân đại lục đang chấp hành hình phạt tại khu vực Đài Loan (Trung Quốc) về đại lục chấp hành hình phạt",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการดำเนินคดีของศาลประชาชนในการรับตัวผู้อยู่อาศัยในจีนแผ่นดินใหญ่ที่กำลังรับโทษในเขตไต้หวัน (จีน) กลับไปรับโทษในจีนแผ่นดินใหญ่",
    "Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara oleh Pengadilan Rakyat dalam Penerimaan Penduduk Daratan yang Menjalani Hukuman di Wilayah Taiwan (Tiongkok) untuk Menjalani Hukuman di Daratan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes oleh Mahkamah Rakyat dalam Penerimaan Penduduk Tanah Besar yang Menjalani Hukuman di Wilayah Taiwan (China) untuk Menjalani Hukuman di Tanah Besar",
)
ITEMS["CN-JI-0258"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc tống đạt văn bản tố tụng dân sự liên quan đến Đài Loan (Trung Quốc)",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการส่งหมายเอกสารในคดีแพ่งที่เกี่ยวข้องกับไต้หวัน (จีน)",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penyampaian Dokumen Perkara Perdata yang Berkaitan dengan Taiwan (Tiongkok)",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Penyampaian Dokumen Kes Sivil yang Berkaitan dengan Taiwan (China)",
)
ITEMS["CN-JI-0268"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp về đâm va tàu biển",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทเรื่องเรือชนกัน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Sengketa Tabrakan Kapal",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Pelanggaran Kapal",
)
ITEMS["CN-JI-0303"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp liên quan đến doanh nghiệp do quân đội, lực lượng cảnh sát vũ trang, cơ quan chính pháp chuyển giao hoặc giải thể và doanh nghiệp tách khỏi cơ quan đảng, nhà nước",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทที่เกี่ยวข้องกับวิสาหกิจที่กองทัพ กองกำลังตำรวจติดอาวุธ และหน่วยงานยุติธรรมโอนหรือยุบเลิก และวิสาหกิจที่แยกตัวออกจากหน่วยงานพรรคและรัฐ",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Sengketa Terkait Badan Usaha yang Dialihkan atau Dibubarkan oleh Militer, Kepolisian Bersenjata dan Aparat Penegak Hukum serta Badan Usaha yang Melepaskan Diri dari Badan Partai dan Pemerintah",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Berkaitan Perusahaan yang Dipindahkan atau Dibubarkan oleh Tentera, Pasukan Polis Bersenjata dan Badan Kehakiman serta Perusahaan yang Berpisah daripada Badan Parti dan Kerajaan",
)

# ---------- 组装 ----------
rest_path = os.path.join("_work", "title-multi", "_cn_rest.json")
with io.open(rest_path, encoding="utf-8") as f:
    rest = json.load(f)
chunk = rest[240:300]
want = [r["id"] for r in chunk]

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
    "batch": "cn-p1-b23",
    "scope": "CN 第 241–300 部（_cn_rest.json 240–299）",
    "note": "语义基准 title.zh；主体译名沿用既有批次（Tòa án Nhân dân Tối cao / Mahkamah Rakyat Agung / Kejaksaan Rakyat Agung）；台湾、香港、澳门按中国表述。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b23.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部，zh 修正 %d 条" % (dst, len(out), len(ZH_FIX)))
