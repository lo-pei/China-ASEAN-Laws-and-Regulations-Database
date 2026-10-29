# -*- coding: utf-8 -*-
"""CN 第 24 批：_cn_rest.json 第 300–359 条（60 部）。"""
import io, json, os

ITEMS = {}
ZH_FIX = {}

ITEMS["CN-JI-0415"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Bồi thường nhà nước nước Cộng hòa Nhân dân Trung Hoa (Phần một)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยการชดเชยแห่งรัฐแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Ganti Rugi Negara Republik Rakyat Tiongkok (Bagian Pertama)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Pampasan Negara Republik Rakyat China (Bahagian Pertama)",
)
ITEMS["CN-JI-0438"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng hình phạt tài sản",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้โทษปรับและริบทรัพย์สิน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukuman Harta Kekayaan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Hukuman Harta",
)
ITEMS["CN-JI-0444"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng thời hạn khởi kiện trong tố tụng hành chính",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กำหนดเวลาฟ้องคดีในกระบวนการพิจารณาคดีปกครอง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Tenggang Waktu Pengajuan Gugatan dalam Peradilan Tata Usaha Negara",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Tempoh Guaman dalam Kehakiman Pentadbiran",
)
ITEMS["CN-JI-0450"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc người đại diện tố tụng đọc, sao chép tài liệu vụ án dân sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการที่ตัวแทนความอ่านและคัดลอกเอกสารในคดีแพ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Pembacaan dan Penggandaan Dokumen Perkara Perdata oleh Kuasa Hukum",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pembacaan dan Penyalinan Dokumen Kes Sivil oleh Wakil Guaman",
)
ITEMS["CN-JI-0452"] = (
    "Quyết định của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc thống nhất thực hiện quyền phê chuẩn án tử hình",
    "มติของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการใช้อำนาจอนุมัติคำพิพากษาประหารชีวิตอย่างเป็นเอกภาพ",
    "Keputusan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Pelaksanaan Kewenangan Pengesahan Putusan Mati secara Terpadu",
    "Keputusan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Pelaksanaan Bidang Kuasa Pengesahan Hukuman Mati secara Bersepadu",
)
ITEMS["CN-JI-0493"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề của tòa án sở hữu trí tuệ",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการของศาลทรัพย์สินทางปัญญา",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Pengadilan Kekayaan Intelektual",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Mahkamah Harta Intelek",
)
ITEMS["CN-REG-0109"] = (
    "Một số quy định tạm thời về quản lý sử dụng sân bay dùng chung quân dân",
    "ข้อกำหนดชั่วคราวหลายประการว่าด้วยการบริหารการใช้สนามบินที่ใช้ร่วมกันระหว่างทหารและพลเรือน",
    "Beberapa Ketentuan Sementara tentang Pengelolaan Penggunaan Bandar Udara Bersama Sipil dan Militer",
    "Beberapa Peruntukan Sementara mengenai Pengurusan Penggunaan Lapangan Terbang Bersama Awam dan Tentera",
)
ITEMS["CN-REG-0113"] = (
    "Quy định về quản lý việc đi lại của người nước ngoài tại Trung Quốc",
    "ข้อกำหนดว่าด้วยการบริหารการเดินทางของชาวต่างประเทศในประเทศจีน",
    "Ketentuan tentang Pengelolaan Perjalanan Orang Asing di Tiongkok",
    "Peruntukan tentang Pengurusan Perjalanan Orang Asing di China",
)
ITEMS["CN-REG-0361"] = (
    "Quy định tạm thời về thống kê, giám sát nợ nước ngoài",
    "ข้อกำหนดชั่วคราวว่าด้วยการสถิติและการติดตามหนี้ต่างประเทศ",
    "Ketentuan Sementara tentang Statistik dan Pemantauan Utang Luar Negeri",
    "Peruntukan Sementara mengenai Perangkaan dan Pemantauan Hutang Luar Negara",
)
ITEMS["CN-REG-0437"] = (
    "Điều lệ tạm thời về tổ chức Ủy ban bảo vệ an ninh trật tự",
    "ข้อบังคับชั่วคราวว่าด้วยองค์กรคณะกรรมการรักษาความสงบเรียบร้อย",
    "Peraturan Sementara tentang Organisasi Komite Pertahanan Ketertiban Umum",
    "Peraturan Sementara mengenai Organisasi Jawatankuasa Pertahanan Ketenteraman Awam",
)

# 两高解释
ITEMS["CN-JI-0018"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về tội phạm thiếu trách nhiệm (Phần một)",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับความผิดฐานละเลยหน้าที่ (ฉบับที่ 1)",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Kealpaan Tugas (Bagian Pertama)",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Kecuaian Tugas (Bahagian Pertama)",
)
ITEMS["CN-JI-0020"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về cản trở quản lý biên giới quốc gia",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการขัดขวางการบริหารเขตแดนแห่งชาติ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Penghambatan Pengelolaan Perbatasan Negara",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penghalangan Pengurusan Sempadan Negara",
)
ITEMS["CN-JI-0028"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về sản xuất, buôn bán trái phép sản phẩm thuốc lá chuyên doanh",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการผลิตและการจำหน่ายผลิตภัณฑ์ยาสูบผูกขาดโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Produksi dan Penjualan Produk Tembakau Monopoli secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengeluaran dan Penjualan Produk Tembakau Monopoli secara Tidak Sah",
)
ITEMS["CN-JI-0036"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về phỉ báng và các hành vi khác thực hiện qua mạng thông tin",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการหมิ่นประมาทและการกระทำอื่นผ่านเครือข่ายสารสนเทศ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Pencemaran Nama Baik dan Perbuatan Lain melalui Jaringan Informasi",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Fitnah dan Perbuatan Lain melalui Rangkaian Maklumat",
)
ITEMS["CN-JI-0044"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về gây rối trật tự quản lý thông tin vô tuyến điện",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการก่อความวุ่นวายในระเบียบการบริหารการสื่อสารวิทยุ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Pengacauan Ketertiban Pengelolaan Komunikasi Radio",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengacauan Ketenteraman Pengurusan Komunikasi Radio",
)
ITEMS["CN-JI-0087"] = (
    "Quy định bổ sung của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc xác định tội danh khi thi hành Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa (Phần năm)",
    "ข้อกำหนดเพิ่มเติมของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการกำหนดฐานความผิดในการใช้ประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 5)",
    "Ketentuan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penetapan Nama Tindak Pidana dalam Pelaksanaan Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok (Bagian Kelima)",
    "Peruntukan Tambahan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penetapan Nama Kesalahan Jenayah dalam Pelaksanaan Kanun Keseksaan Republik Rakyat China (Bahagian Kelima)",
)
ITEMS["CN-JI-0019"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về đánh bạc",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการพนัน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perjudian",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perjudian",
)
ITEMS["CN-JI-0034"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về việc sử dụng internet, thiết bị đầu cuối thông tin di động và tổng đài thông tin qua điện thoại để sản xuất, sao chép, xuất bản, buôn bán, truyền bá thông tin điện tử khiêu dâm",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการใช้เครือข่ายอินเทอร์เน็ต เครื่องปลายทางการสื่อสารเคลื่อนที่ และศูนย์บริการข้อมูลทางโทรศัพท์ในการผลิต ทำซ้ำ จัดพิมพ์ ค้าขาย และเผยแพร่ข้อมูลอิเล็กทรอนิกส์ลามกอนาจาร",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Penggunaan Internet, Terminal Komunikasi Bergerak dan Pusat Informasi Telepon untuk Memproduksi, Menggandakan, Menerbitkan, Memperdagangkan dan Menyebarluaskan Informasi Elektronik Cabul",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penggunaan Internet, Terminal Komunikasi Mudah Alih dan Pusat Maklumat Telefon untuk Menghasilkan, Menyalin, Menerbitkan, Menjual dan Menyebarkan Maklumat Elektronik Lucah",
)
ITEMS["CN-JI-0041"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về cưỡng đoạt tài sản",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการกรรโชกทรัพย์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Pemerasan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pemerasan",
)

ITEMS["CN-JI-0169"] = (
    "Quy định của Tòa án Nhân dân Tối cao về vấn đề thẩm quyền xét xử trong tố tụng hàng hải",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาว่าด้วยเขตอำนาจศาลในคดีพาณิชย์นาวี",
    "Ketentuan Mahkamah Rakyat Agung tentang Masalah Kewenangan Mengadili dalam Peradilan Maritim",
    "Peruntukan Mahkamah Rakyat Agung mengenai Isu Bidang Kuasa dalam Kehakiman Maritim",
)
ITEMS["CN-JI-0194"] = (
    "Thỏa thuận giữa tòa án nội địa Trung Quốc và tòa án Đặc khu Hành chính Hồng Kông về ủy thác lẫn nhau tống đạt văn bản tố tụng dân sự và thương mại",
    "ความตกลงระหว่างศาลจีนแผ่นดินใหญ่กับศาลเขตบริหารพิเศษฮ่องกงว่าด้วยการมอบหมายซึ่งกันและกันให้ส่งหมายเอกสารในคดีแพ่งและพาณิชย์",
    "Kesepakatan antara Pengadilan Tiongkok Daratan dan Pengadilan Daerah Administratif Khusus Hong Kong tentang Saling Penugasan Penyampaian Dokumen Perkara Perdata dan Dagang",
    "Persetujuan antara Mahkamah Tanah Besar China dan Mahkamah Wilayah Pentadbiran Khas Hong Kong mengenai Saling Pengagihan Penyampaian Dokumen Kes Sivil dan Perdagangan",
)
ITEMS["CN-JI-0237"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về công tác ủy thác thẩm định giá và đấu giá của tòa án nhân dân",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยงานการมอบหมายให้ประเมินราคาและการขายทอดตลาดของศาลประชาชน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penugasan Penilaian Harga dan Lelang oleh Pengadilan Rakyat",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengagihan Penilaian Harga dan Lelongan oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0286"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về sản xuất, mua bán, vận chuyển trái phép súng, đạn, vật liệu nổ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการผลิต ซื้อขาย และขนย้ายอาวุธปืน กระสุน และวัตถุระเบิดโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Produksi, Jual Beli dan Pengangkutan Senjata Api, Amunisi serta Bahan Peledak secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pengeluaran, Jual Beli dan Pengangkutan Senjata Api, Peluru serta Bahan Letupan secara Tidak Sah",
)
ITEMS["CN-JI-0289"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về tội mua bán phụ nữ, trẻ em",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับความผิดฐานค้ามนุษย์หญิงและเด็ก",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perdagangan Perempuan dan Anak",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pemerdagangan Wanita dan Kanak-Kanak",
)
ITEMS["CN-JI-0315"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý khiếu nại về thẩm quyền cấp xét xử vụ án dân sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคำคัดค้านเกี่ยวกับเขตอำนาจศาลชั้นต้นในคดีแพ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Keberatan atas Kewenangan Tingkat Pengadilan dalam Perkara Perdata",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Bantahan atas Bidang Kuasa Peringkat Mahkamah dalam Kes Sivil",
)
ITEMS["CN-JI-0325"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý tranh chấp hợp đồng hàng hóa tương lai (Phần hai)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทสัญญาซื้อขายล่วงหน้า (ฉบับที่ 2)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Sengketa Kontrak Berjangka (Bagian Kedua)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Pertikaian Kontrak Niaga Hadapan (Bahagian Kedua)",
)
ITEMS["CN-JI-0337"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án gây rối trật tự quản lý thị trường viễn thông",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีเกี่ยวกับการก่อความวุ่นวายในระเบียบการบริหารตลาดโทรคมนาคม",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pengacauan Ketertiban Pengelolaan Pasar Telekomunikasi",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Pengacauan Ketenteraman Pengurusan Pasaran Telekomunikasi",
)
ITEMS["CN-JI-0338"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án kháng nghị hình sự do Viện Kiểm sát Nhân dân đề nghị theo thủ tục giám đốc thẩm",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีที่อัยการประชาชนยื่นคำร้องคัดค้านคำพิพากษาอาญาตามกระบวนการกำกับดูแลการพิจารณาคดี",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Perlawanan Pidana yang Diajukan Kejaksaan Rakyat menurut Tata Cara Pengawasan Peradilan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Bantahan Jenayah yang Dikemukakan Kejaksaan Rakyat menurut Tatacara Penyeliaan Kehakiman",
)
ITEMS["CN-JI-0342"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề thẩm quyền và phạm vi áp dụng pháp luật đối với vụ án nhãn hiệu",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาว่าด้วยเขตอำนาจศาลและขอบเขตการใช้กฎหมายในคดีเครื่องหมายการค้า",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Kewenangan Mengadili dan Ruang Lingkup Penerapan Hukum dalam Perkara Merek",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Bidang Kuasa dan Lingkup Penggunaan Undang-Undang dalam Kes Cap Dagangan",
)
ITEMS["CN-JI-0416"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về hiệu lực về thời gian của Luật Hàng hải nước Cộng hòa Nhân dân Trung Hoa",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยผลใช้บังคับด้านเวลาของกฎหมายการเดินเรือพาณิชย์แห่งสาธารณรัฐประชาชนจีน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Kekuatan Berlaku Menurut Waktu Undang-Undang Pelayaran Niaga Republik Rakyat Tiongkok",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Kuat Kuasa Mengikut Masa Undang-Undang Perkapalan Niaga Republik Rakyat China",
)
ITEMS["CN-JI-0442"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề của quy định về hiệu lực về thời gian của Bộ luật Hình sự",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการของข้อกำหนดเกี่ยวกับผลใช้บังคับด้านเวลาของประมวลกฎหมายอาญา",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Ketentuan Kekuatan Berlaku Menurut Waktu Kitab Undang-Undang Hukum Pidana",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Peruntukan Kuat Kuasa Mengikut Masa Kanun Keseksaan",
)
ITEMS["CN-JI-0454"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc tra cứu, phong tỏa tiền gửi của người phải thi hành án qua mạng",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการสืบค้นและการอายัดเงินฝากของลูกหนี้ตามคำพิพากษาผ่านเครือข่าย",
    "Ketentuan Mahkamah Rakyat Agung tentang Penelusuran dan Pembekuan Simpanan Pihak yang Wajib Melaksanakan Putusan melalui Jaringan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penjejakan dan Pembekuan Simpanan Pihak yang Wajib Melaksanakan Penghakiman melalui Rangkaian",
)
ITEMS["CN-JI-0100"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề hiệu lực về thời gian của Luật sửa đổi Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa (lần thứ chín)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาผลใช้บังคับด้านเวลาของพระราชบัญญัติแก้ไขเพิ่มเติมประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 9)",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Kekuatan Berlaku Menurut Waktu Undang-Undang Perubahan atas Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok (Kesembilan)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Kuat Kuasa Mengikut Masa Akta Pindaan Kanun Keseksaan Republik Rakyat China (Kesembilan)",
)
ITEMS["CN-JI-0179"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thẩm quyền của tòa án quân sự đối với vụ án dân sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับเขตอำนาจของศาลทหารในคดีแพ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Kewenangan Pengadilan Militer atas Perkara Perdata",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Bidang Kuasa Mahkamah Tentera atas Kes Sivil",
)
ITEMS["CN-JI-0181"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong việc áp dụng nghiêm ngặt pháp luật về chỉ đạo tái thẩm và phát về xét xử lại theo thủ tục giám đốc thẩm vụ án dân sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายอย่างเคร่งครัดเรื่องการสั่งให้พิจารณาคดีใหม่และการส่งคดีกลับให้พิจารณาใหม่ตามกระบวนการกำกับดูแลการพิจารณาคดีแพ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penerapan Hukum secara Ketat mengenai Perintah Pemeriksaan Ulang dan Pengembalian Perkara untuk Diadili Ulang menurut Tata Cara Pengawasan Peradilan Perdata",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Penggunaan Undang-Undang secara Ketat berkenaan Arahan Semakan Semula dan Pemulangan Kes untuk Dibicarakan Semula menurut Tatacara Penyeliaan Kehakiman Sivil",
)
ITEMS["CN-JI-0232"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến tư cách người tham gia đấu giá nhà ở trong đấu giá tư pháp của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับคุณสมบัติของผู้เข้าร่วมประมูลอสังหาริมทรัพย์ในการขายทอดตลาดทางตุลาการของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Kelayakan Peserta Lelang Properti dalam Lelang Yudisial oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Syarat Peserta Lelongan Hartanah dalam Lelongan Kehakiman oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0253"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề thẩm quyền và áp dụng pháp luật đối với vụ án nhãn hiệu sau khi quyết định sửa đổi Luật Nhãn hiệu có hiệu lực",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาว่าด้วยเขตอำนาจศาลและการใช้กฎหมายในคดีเครื่องหมายการค้าภายหลังมติแก้ไขเพิ่มเติมพระราชบัญญัติเครื่องหมายการค้ามีผลใช้บังคับ",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Kewenangan Mengadili dan Penerapan Hukum dalam Perkara Merek setelah Keputusan Perubahan Undang-Undang Merek Berlaku",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Bidang Kuasa dan Penggunaan Undang-Undang dalam Kes Cap Dagangan selepas Keputusan Pindaan Akta Cap Dagangan Berkuat Kuasa",
)
ITEMS["CN-JI-0259"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thẩm quyền xét xử vụ án dân sự và thương mại có yếu tố nước ngoài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับเขตอำนาจศาลในคดีแพ่งและพาณิชย์ที่มีปัจจัยต่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Kewenangan Mengadili Perkara Perdata dan Dagang yang Mengandung Unsur Asing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Bidang Kuasa Kes Sivil dan Perdagangan yang Mengandungi Unsur Asing",
)
ITEMS["CN-JI-0270"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử tranh chấp liên quan đến chứng chỉ tiền gửi",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทเกี่ยวกับใบรับฝากเงิน",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Sengketa Terkait Sertifikat Deposito",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Berkaitan Sijil Deposit",
)
ITEMS["CN-JI-0287"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án hành chính về bảo hiểm tai nạn lao động",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีปกครองเกี่ยวกับการประกันภัยกรณีประสบอันตรายจากการทำงาน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Tata Usaha Negara tentang Asuransi Kecelakaan Kerja",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pentadbiran tentang Insurans Kemalangan Pekerjaan",
)
ITEMS["CN-JI-0301"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về gây tai nạn giao thông",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการก่ออุบัติเหตุจราจร",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Penyebab Kecelakaan Lalu Lintas",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penyebab Kemalangan Jalan Raya",
)
ITEMS["CN-JI-0302"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về việc từ chối trả thù lao lao động",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการปฏิเสธไม่จ่ายค่าตอบแทนแรงงาน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Penolakan Pembayaran Upah Tenaga Kerja",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penolakan Pembayaran Upah Buruh",
)
ITEMS["CN-JI-0323"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về hủy hoại tài nguyên đất",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการทำลายทรัพยากรที่ดิน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perusakan Sumber Daya Tanah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Sumber Tanah",
)
ITEMS["CN-JI-0357"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng điều ước quốc tế và tập quán quốc tế trong xử lý vụ án dân sự và thương mại có yếu tố nước ngoài",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้สนธิสัญญาระหว่างประเทศและจารีตประเพณีระหว่างประเทศในการพิจารณาคดีแพ่งและพาณิชย์ที่มีปัจจัยต่างประเทศ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Perjanjian Internasional dan Kebiasaan Internasional dalam Penanganan Perkara Perdata dan Dagang yang Mengandung Unsur Asing",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Perjanjian Antarabangsa dan Adat Kebiasaan Antarabangsa dalam Pengendalian Kes Sivil dan Perdagangan yang Mengandungi Unsur Asing",
)
ITEMS["CN-JI-0399"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về buôn lậu, kinh doanh trái phép và sử dụng trái phép chất kích thích",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการลักลอบขนของหนีภาษี การประกอบธุรกิจโดยมิชอบ และการใช้สารกระตุ้นโดยมิชอบ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Penyelundupan, Perdagangan Tidak Sah dan Penggunaan Zat Perangsang secara Tidak Sah",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Penyeludupan, Perniagaan Tidak Sah dan Penggunaan Bahan Perangsang secara Tidak Sah",
)
ITEMS["CN-JI-0432"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Phá sản doanh nghiệp nước Cộng hòa Nhân dân Trung Hoa (Phần một)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยการล้มละลายของวิสาหกิจแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Kepailitan Badan Usaha Republik Rakyat Tiongkok (Bagian Pertama)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Kebankrapan Perusahaan Republik Rakyat China (Bahagian Pertama)",
)
ITEMS["CN-JI-0445"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc tòa án đã niêm phong tài sản trước và tòa án thi hành án có chủ nợ ưu tiên xử lý tài sản đã niêm phong",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการที่ศาลซึ่งอายัดทรัพย์สินก่อนและศาลบังคับคดีซึ่งมีเจ้าหนี้บุริมสิทธิจัดการทรัพย์สินที่อายัดไว้",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Pengadilan yang Menyita Harta Terlebih Dahulu dan Pengadilan Pelaksana yang Memiliki Kreditor Preferen Mengurus Harta yang Disita",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Mahkamah yang Menyita Harta Terlebih Dahulu dan Mahkamah Pelaksana yang Mempunyai Pemiutang Keutamaan Mengurus Harta yang Disita",
)
ITEMS["CN-JI-0460"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về vấn đề thẩm quyền xét xử vụ án của Tòa án Nhân dân Binh đoàn Sản xuất và Xây dựng Tân Cương",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยปัญหาว่าด้วยเขตอำนาจศาลในคดีของศาลประชาชนกองพลผลิตและก่อสร้างซินเจียง",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Masalah Kewenangan Mengadili Perkara Pengadilan Rakyat Korps Produksi dan Konstruksi Xinjiang",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Isu Bidang Kuasa Kes Mahkamah Rakyat Kor Pembangunan dan Pengeluaran Xinjiang",
)
ITEMS["CN-JI-0468"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc rút đơn khởi kiện trong tố tụng hành chính",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการถอนคำฟ้องในกระบวนการพิจารณาคดีปกครอง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Pencabutan Gugatan dalam Peradilan Tata Usaha Negara",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Pengunduran Guaman dalam Kehakiman Pentadbiran",
)
ITEMS["CN-JI-0473"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc siết chặt quản lý vấn đề kéo dài thời hạn xét xử và hoãn phiên tòa trong vụ án dân sự, thương mại",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการกำกับดูแลปัญหาการขยายกำหนดเวลาพิจารณาคดีและการเลื่อนการพิจารณาคดีในคดีแพ่งและพาณิชย์อย่างเข้มงวด",
    "Ketentuan Mahkamah Rakyat Agung tentang Penertiban Masalah Perpanjangan Tenggang Waktu Pemeriksaan dan Penundaan Sidang dalam Perkara Perdata dan Dagang",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pengawalan Ketat Isu Pelanjutan Tempoh Perbicaraan dan Penangguhan Sidang dalam Kes Sivil dan Perdagangan",
)
ITEMS["CN-JI-0504"] = (
    "Quy định của Tòa án Nhân dân Tối cao về vấn đề báo cáo thỉnh thị trong vụ án giám sát tư pháp về trọng tài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาการรายงานขอคำวินิจฉัยในคดีกำกับดูแลทางตุลาการเกี่ยวกับอนุญาโตตุลาการ",
    "Ketentuan Mahkamah Rakyat Agung tentang Masalah Pelaporan Permohonan Petunjuk dalam Perkara Pengawasan Yudisial atas Arbitrase",
    "Peruntukan Mahkamah Rakyat Agung mengenai Isu Pelaporan Permohonan Panduan dalam Kes Penyeliaan Kehakiman atas Timbang Tara",
)
ITEMS["CN-JI-0523"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc ban hành Giải thích về một số vấn đề trong việc tòa án nhân dân thi hành Luật Bồi thường nhà nước nước Cộng hòa Nhân dân Trung Hoa",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการประกาศใช้การตีความเกี่ยวกับปัญหาหลายประการในการที่ศาลประชาชนบังคับใช้กฎหมายว่าด้วยการชดเชยแห่งรัฐแห่งสาธารณรัฐประชาชนจีน",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pengundangan Penafsiran mengenai Beberapa Masalah dalam Pelaksanaan Undang-Undang Ganti Rugi Negara Republik Rakyat Tiongkok oleh Pengadilan Rakyat",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Penguatkuasaan Tafsiran tentang Beberapa Isu dalam Pelaksanaan Undang-Undang Pampasan Negara Republik Rakyat China oleh Mahkamah Rakyat",
)

ITEMS["CN-LAW-0004"] = (
    "Luật Chống ly khai nhà nước",
    "พระราชบัญญัติต่อต้านการแบ่งแยกดินแดน",
    "Undang-Undang Anti-Pemisahan Negara",
    "Akta Anti-Pemisahan Negara",
)
ITEMS["CN-REG-0296"] = (
    "Biện pháp về mẫu và cách đeo phù hiệu cấp hàm của công an nhân dân",
    "มาตรการว่าด้วยแบบและวิธีติดเครื่องหมายชั้นยศของตำรวจประชาชน",
    "Tata Cara tentang Bentuk dan Cara Pemakaian Tanda Kepangkatan Kepolisian Rakyat",
    "Tatacara mengenai Bentuk dan Cara Pemakaian Tanda Pangkat Polis Rakyat",
)
ITEMS["CN-REG-0358"] = (
    "Quy định tạm thời về thuế nhập khẩu đối với đồ vật do người nước ngoài thường trú tại Trung Quốc mang vào",
    "ข้อกำหนดชั่วคราวว่าด้วยภาษีนำเข้าสำหรับสิ่งของที่ชาวต่างประเทศซึ่งพำนักประจำในประเทศจีนนำเข้ามา",
    "Ketentuan Sementara tentang Pajak Impor atas Barang yang Dibawa Masuk oleh Orang Asing yang Berdomisili di Tiongkok",
    "Peruntukan Sementara mengenai Cukai Import bagi Barang yang Dibawa Masuk oleh Orang Asing yang Bermastautin di China",
)
ITEMS["CN-REG-0408"] = (
    "Quy tắc quản lý tạm thời đối với ngành in, đúc và khắc chữ",
    "กฎว่าด้วยการบริหารชั่วคราวสำหรับกิจการการพิมพ์ การหล่อ และการแกะสลักตัวอักษร",
    "Peraturan Pengelolaan Sementara atas Usaha Percetakan, Pengecoran dan Ukiran Huruf",
    "Peraturan Pengurusan Sementara bagi Perusahaan Percetakan, Penuangan dan Ukiran Huruf",
)
ITEMS["CN-REG-0432"] = (
    "Điều lệ về nghỉ phép năm có lương của người lao động",
    "ข้อบังคับว่าด้วยการลาพักผ่อนประจำปีโดยได้รับค่าจ้างของลูกจ้าง",
    "Peraturan tentang Cuti Tahunan Berbayar bagi Pekerja",
    "Peraturan mengenai Cuti Tahunan Berbayar bagi Pekerja",
)
ITEMS["CN-REG-0446"] = (
    "Điều lệ về đại diện quân sự của Quân Giải phóng Nhân dân Trung Quốc tại các cơ quan giao thông dọc tuyến đường sắt và đường thủy",
    "ข้อบังคับว่าด้วยผู้แทนทหารของกองทัพปลดปล่อยประชาชนจีนประจำหน่วยงานคมนาคมตามแนวเส้นทางรถไฟและทางน้ำ",
    "Peraturan tentang Perwakilan Militer Tentara Pembebasan Rakyat Tiongkok pada Instansi Perhubungan di Sepanjang Jalur Kereta Api dan Perairan",
    "Peraturan mengenai Perwakilan Tentera Tentera Pembebasan Rakyat China pada Agensi Pengangkutan di Sepanjang Laluan Keretapi dan Perairan",
)
ITEMS["CN-REG-0609"] = (
    "Biện pháp tạm thời về đăng ký ủy ban trọng tài",
    "มาตรการชั่วคราวว่าด้วยการจดทะเบียนคณะอนุญาโตตุลาการ",
    "Tata Cara Sementara tentang Pendaftaran Komite Arbitrase",
    "Tatacara Sementara mengenai Pendaftaran Jawatankuasa Timbang Tara",
)
ITEMS["CN-REG-0165"] = (
    "Quy định của Quốc vụ viện về giờ làm việc của người lao động",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยเวลาทำงานของลูกจ้าง",
    "Ketentuan Dewan Negara tentang Waktu Kerja Pekerja",
    "Peruntukan Majlis Negara mengenai Masa Bekerja Pekerja",
)

# ---------- 组装 ----------
with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[300:360]]
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
    "batch": "cn-p1-b24",
    "scope": "CN 第 301–360 部（_cn_rest.json 300–359）",
    "note": "语义基准 title.zh；两高联合解释沿用既有「Penafsiran … dan Kejaksaan Rakyat Agung」句式。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b24.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部，zh 修正 %d 条" % (dst, len(out), len(ZH_FIX)))
