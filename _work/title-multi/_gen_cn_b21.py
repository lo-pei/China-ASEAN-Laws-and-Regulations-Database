# -*- coding: utf-8 -*-
"""CN 标题多语种批次生成器（第 21 批：按条文数 20–19 条段 60 部）。

语义基准：title.zh（中文原本，权威）。
主体译名沿用既有批次（见 _gen_cn_b20.py 头部）。
本批另修 1 处 zh 缺陷：CN-JI-0088 的「最高人民法院++最高人民检察院」多出两个加号。
"""
import json, io, os

items = {}


def put(lid, vi, th, id_, ms, zh=None):
    d = {"vi": vi, "th": th, "id": id_, "ms": ms}
    if zh:
        d["zh"] = zh
    items[lid] = d


# ============ 司法解释 ============
put("CN-JI-0284",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng cụ thể pháp luật "
    "trong xét xử vụ án hình sự về ấn phẩm bất hợp pháp",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการพิจารณาคดีอาญาเกี่ยวกับสิ่งพิมพ์ผิดกฎหมาย",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum secara Khusus "
    "dalam Pemeriksaan Perkara Pidana Terbitan Ilegal",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang secara Khusus "
    "dalam Perbicaraan Kes Jenayah Penerbitan Haram")

put("CN-JI-0326",
    "Quy định của Tòa án Nhân dân Tối cao về việc xác định thù lao của người quản lý tài sản "
    "trong xét xử vụ án phá sản doanh nghiệp",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการกำหนดค่าตอบแทนของผู้บริหารทรัพย์สิน"
    "ในการพิจารณาคดีล้มละลายของวิสาหกิจ",
    "Ketentuan Mahkamah Rakyat Agung tentang Penetapan Imbalan Pengurus Harta Pailit "
    "dalam Pemeriksaan Perkara Kepailitan Perusahaan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penetapan Imbalan Pengurus Harta "
    "dalam Perbicaraan Kes Kebankrapan Syarikat")

put("CN-JI-0382",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp thư tín dụng",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทเลตเตอร์ออฟเครดิต",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara "
    "Sengketa Letter of Credit",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes "
    "Pertikaian Surat Kredit")

put("CN-JI-0049",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về gây nguy hại an toàn sản xuất",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการเป็นอันตรายต่อความปลอดภัยในการผลิต",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana yang Membahayakan Keselamatan Produksi",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah yang Membahayakan Keselamatan Pengeluaran")

put("CN-JI-0132",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề phong tỏa, đấu giá cổ phần nhà nước "
    "và cổ phần pháp nhân xã hội của công ty niêm yết",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการอายัดและการประมูลหุ้นของรัฐ"
    "และหุ้นนิติบุคคลของบริษัทจดทะเบียน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Pembekuan dan Lelang Saham Negara "
    "serta Saham Badan Hukum pada Perusahaan Terbuka",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pembekuan dan Lelongan Saham Negara "
    "serta Saham Badan Berkanun pada Syarikat Tersenarai")

put("CN-JI-0235",
    "Quy định của Tòa án Nhân dân Tối cao về việc tòa án nhân dân công khai thông tin quy trình "
    "xét xử qua Internet",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการเปิดเผยข้อมูลกระบวนการพิจารณาคดีของศาลประชาชน"
    "ทางอินเทอร์เน็ต",
    "Ketentuan Mahkamah Rakyat Agung tentang Keterbukaan Informasi Proses Peradilan "
    "Pengadilan Rakyat melalui Internet",
    "Peruntukan Mahkamah Rakyat Agung mengenai Keterbukaan Maklumat Proses Perbicaraan "
    "Mahkamah Rakyat melalui Internet")

put("CN-JI-0292",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp bảo hiểm hàng hải",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทประกันภัยทางทะเล",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara "
    "Sengketa Asuransi Maritim",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes "
    "Pertikaian Insurans Marin")

put("CN-JI-0385",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án về giấy phép hành chính",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีเกี่ยวกับการอนุญาตทางปกครอง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Perizinan "
    "Administratif",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Perlesenan "
    "Pentadbiran")

put("CN-JI-0463",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thi hành phần liên quan đến tài sản "
    "trong bản án hình sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการบังคับคดีส่วนที่เกี่ยวกับทรัพย์สิน"
    "ในคำพิพากษาอาญา",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Pelaksanaan Bagian yang Berkaitan "
    "dengan Harta dalam Putusan Pidana",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pelaksanaan Bahagian Berkaitan Harta "
    "dalam Penghakiman Jenayah")

put("CN-JI-0522",
    "Thông báo của Tòa án Nhân dân Tối cao về việc ban hành Một số ý kiến về chuẩn mực hóa việc "
    "thụ lý án tái thẩm của tòa án nhân dân (thí điểm)",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการประกาศใช้ความเห็นหลายประการเกี่ยวกับการกำหนดมาตรฐาน"
    "การรับคดีพิจารณาใหม่ของศาลประชาชน (ทดลองใช้)",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Penerbitan Beberapa Pendapat mengenai "
    "Standardisasi Pendaftaran Perkara Peninjauan Kembali Pengadilan Rakyat (Uji Coba)",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Penerbitan Beberapa Pendapat tentang "
    "Penyeragaman Pendaftaran Kes Semakan Semula Mahkamah Rakyat (Percubaan)")

put("CN-JI-0025",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về khai thác khoáng sản trái phép, "
    "khai thác khoáng sản phá hoại",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการขุดแร่โดยมิชอบและการขุดแร่แบบทำลายล้าง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Penambangan Mineral secara Melawan Hukum "
    "dan Penambangan Bersifat Merusak",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Perlombongan Mineral secara Menyalahi "
    "Undang-Undang dan Perlombongan Bersifat Memusnahkan")

put("CN-JI-0033",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về việc không chấp hành bản án, quyết định",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการไม่ปฏิบัติตามคำพิพากษาและคำสั่ง",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Tidak Melaksanakan Putusan dan Penetapan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Kegagalan Melaksanakan Penghakiman dan Perintah")

put("CN-JI-0065",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về tổ chức, lợi dụng tổ chức tà giáo "
    "để phá hoại việc thực thi pháp luật",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการจัดตั้งและใช้ประโยชน์จากองค์กรลัทธินอกรีตเพื่อทำลาย"
    "การบังคับใช้กฎหมาย",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Pendirian dan Pemanfaatan Organisasi Aliran "
    "Sesat untuk Merusak Pelaksanaan Hukum",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Penubuhan dan Penggunaan Organisasi Ajaran Sesat "
    "untuk Merosakkan Pelaksanaan Undang-Undang")

put("CN-JI-0088",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về hiếp dâm, dâm ô người chưa thành niên",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการข่มขืนกระทำชำเราและการล่วงละเมิดทางเพศผู้เยาว์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah "
    "Penerapan Hukum dalam Penanganan Perkara Pidana Pemerkosaan dan Pencabulan terhadap Anak",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Rogol dan Pencabulan terhadap Kanak-Kanak",
    "最高人民法院、最高人民检察院关于办理强奸、猥亵未成年人刑事案件适用法律若干问题的解释")

put("CN-JI-0098",
    "Quy định của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật đối với vụ án phá sản doanh nghiệp "
    "chưa kết thúc xét xử khi Luật Phá sản doanh nghiệp nước Cộng hòa Nhân dân Trung Hoa có hiệu lực",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายกับคดีล้มละลายของวิสาหกิจที่ยังพิจารณาไม่เสร็จ"
    "เมื่อกฎหมายว่าด้วยการล้มละลายวิสาหกิจแห่งสาธารณรัฐประชาชนจีนมีผลใช้บังคับ",
    "Ketentuan Mahkamah Rakyat Agung tentang Penerapan Hukum terhadap Perkara Kepailitan Perusahaan "
    "yang Belum Selesai Diperiksa saat Undang-Undang Kepailitan Perusahaan Republik Rakyat Tiongkok "
    "Mulai Berlaku",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang bagi Kes Kebankrapan Syarikat "
    "yang Belum Selesai Dibicara apabila Undang-Undang Kebankrapan Syarikat Republik Rakyat China "
    "Mula Berkuat Kuasa")

put("CN-JI-0176",
    "Quy định của Tòa án Nhân dân Tối cao về việc hội thẩm nhân dân có kiến thức chuyên môn "
    "tham gia xét xử vụ án về môi trường và tài nguyên",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการเข้าร่วมพิจารณาคดีด้านสิ่งแวดล้อมและทรัพยากร"
    "ของผู้พิพากษาสมทบประชาชนที่มีความรู้เฉพาะทาง",
    "Ketentuan Mahkamah Rakyat Agung tentang Keikutsertaan Juri Rakyat Berlatar Keahlian Khusus "
    "dalam Pemeriksaan Perkara Lingkungan dan Sumber Daya",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penyertaan Juri Rakyat Berlatar Kepakaran Khas "
    "dalam Perbicaraan Kes Alam Sekitar dan Sumber")

put("CN-JI-0189",
    "Thỏa thuận giữa Tòa án Đại lục và Đặc khu Hành chính Ma Cao (Trung Quốc) về công nhận "
    "và thi hành lẫn nhau phán quyết trọng tài",
    "ข้อตกลงระหว่างศาลจีนแผ่นดินใหญ่กับเขตบริหารพิเศษมาเก๊า (จีน) ว่าด้วยการรับรองและ"
    "การบังคับตามคำชี้ขาดอนุญาโตตุลาการซึ่งกันและกัน",
    "Kesepakatan antara Pengadilan Tiongkok Daratan dan Daerah Administratif Khusus Makau "
    "(Tiongkok) tentang Saling Pengakuan dan Pelaksanaan Putusan Arbitrase",
    "Persetujuan antara Mahkamah Tanah Besar China dan Wilayah Pentadbiran Khas Macau (China) "
    "mengenai Saling Pengiktirafan dan Pelaksanaan Award Timbang Tara")

put("CN-JI-0238",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong công tác ủy thác thẩm định giá, "
    "đấu giá và bán tài sản của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในงานมอบหมายการประเมินราคา การประมูล "
    "และการขายทรัพย์สินของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Kerja Penugasan Penilaian, "
    "Lelang, dan Penjualan Aset oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Kerja Pengamanahan Penilaian, "
    "Lelongan dan Penjualan Harta oleh Mahkamah Rakyat")

put("CN-JI-0261",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề tống đạt văn bản tư pháp "
    "trong vụ án dân sự hoặc thương mại có yếu tố nước ngoài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการส่งเอกสารศาลในคดีแพ่ง"
    "หรือคดีพาณิชย์ที่เกี่ยวข้องกับต่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penyampaian Dokumen Peradilan "
    "dalam Perkara Perdata atau Niaga yang Melibatkan Unsur Asing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penyampaian Dokumen Kehakiman "
    "dalam Kes Sivil atau Perdagangan yang Melibatkan Unsur Asing")

put("CN-JI-0265",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng cụ thể pháp luật "
    "trong xét xử vụ án tranh chấp hợp đồng thuê nhà ở đô thị",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการพิจารณาคดีข้อพิพาทสัญญาเช่าที่อยู่อาศัยในเขตเมือง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum secara Khusus "
    "dalam Pemeriksaan Perkara Sengketa Perjanjian Sewa Rumah di Perkotaan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang secara Khusus "
    "dalam Perbicaraan Kes Pertikaian Perjanjian Sewa Rumah di Bandar")

put("CN-JI-0279",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử các vụ án xảy ra "
    "tại vùng biển thuộc quyền tài phán của nước ta (II)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีที่เกิดขึ้นในน่านน้ำ"
    "ภายใต้เขตอำนาจของประเทศ (ฉบับที่ 2)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara yang "
    "Terjadi di Perairan Yurisdiksi Nasional (II)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes yang Berlaku "
    "di Perairan Bidang Kuasa Negara (II)")

put("CN-JI-0293",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp "
    "đại lý vận tải hàng hóa đường biển",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาท"
    "ตัวแทนขนส่งสินค้าทางทะเล",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Sengketa "
    "Agen Pengangkutan Kargo Laut",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pertikaian "
    "Ejen Pengangkutan Kargo Laut")

put("CN-JI-0333",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp dân sự về xâm phạm quyền truyền đạt qua mạng thông tin",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทแพ่ง"
    "เกี่ยวกับการละเมิดสิทธิการเผยแพร่ผ่านเครือข่ายสารสนเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Perdata Pelanggaran Hak Penyebaran melalui Jaringan Informasi",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Sivil Pelanggaran Hak Penyebaran melalui Rangkaian Maklumat")

put("CN-JI-0367",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án dân sự liên quan đến việc xử lý thông tin cá nhân bằng công nghệ nhận dạng khuôn mặt",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีแพ่ง"
    "ที่เกี่ยวกับการประมวลผลข้อมูลส่วนบุคคลด้วยเทคโนโลยีการจดจำใบหน้า",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Perdata terkait Pemrosesan Informasi Pribadi dengan Teknologi Pengenalan Wajah",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Sivil berkaitan Pemprosesan Maklumat Peribadi dengan Teknologi Pengecaman Wajah")

put("CN-JI-0387",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp dân sự "
    "về thẻ ngân hàng",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทแพ่งเกี่ยวกับบัตรธนาคาร",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Sengketa "
    "Perdata Kartu Bank",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pertikaian Sivil "
    "Kad Bank")

put("CN-JI-0431",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Phá sản doanh nghiệp "
    "nước Cộng hòa Nhân dân Trung Hoa (III)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยการล้มละลายวิสาหกิจ"
    "แห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 3)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Kepailitan "
    "Perusahaan Republik Rakyat Tiongkok (III)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Kebankrapan "
    "Syarikat Republik Rakyat China (III)")

put("CN-JI-0497",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề bảo đảm trong thi hành án",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการค้ำประกันในการบังคับคดี",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penjaminan dalam Pelaksanaan Putusan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Jaminan dalam Pelaksanaan")

put("CN-JI-0507",
    "Quy định về quản lý việc tòa án nhân dân ủy thác giám định tư pháp ra bên ngoài",
    "ข้อกำหนดว่าด้วยการบริหารการมอบหมายการตรวจพิสูจน์ทางตุลาการภายนอกของศาลประชาชน",
    "Ketentuan tentang Pengelolaan Penugasan Pemeriksaan Forensik Yudisial kepada Pihak Luar "
    "oleh Pengadilan Rakyat",
    "Peruntukan mengenai Pengurusan Pengamanahan Pemeriksaan Forensik Kehakiman kepada Pihak Luar "
    "oleh Mahkamah Rakyat")

# ============ 行政法规 ============
put("CN-REG-0003",
    "Quy định về bảo hộ biểu trưng Olympic",
    "ข้อบังคับว่าด้วยการคุ้มครองสัญลักษณ์โอลิมปิก",
    "Peraturan tentang Perlindungan Lambang Olimpiade",
    "Peraturan mengenai Perlindungan Lambang Olimpik")

put("CN-REG-0010",
    "Quy định tạm thời về khu thí điểm phát triển công nghiệp công nghệ mới Bắc Kinh",
    "ข้อบังคับชั่วคราวว่าด้วยเขตทดลองพัฒนาอุตสาหกรรมเทคโนโลยีใหม่ปักกิ่ง",
    "Peraturan Sementara tentang Kawasan Percobaan Pengembangan Industri Teknologi Baru Beijing",
    "Peraturan Sementara mengenai Zon Percubaan Pembangunan Industri Teknologi Baharu Beijing")

put("CN-REG-0032",
    "Biện pháp quản lý cứu trợ người lang thang, ăn xin không nơi nương tựa trong đô thị",
    "มาตรการบริหารการสงเคราะห์คนเร่ร่อนขอทานที่ไร้ที่พึ่งในเมือง",
    "Tindakan Pengelolaan Bantuan bagi Gelandangan dan Pengemis Tanpa Penghidupan di Perkotaan",
    "Langkah Pengurusan Bantuan bagi Gelandangan dan Pengemis Tanpa Kehidupan di Bandar")

put("CN-REG-0093",
    "Quy định về công tác thanh tra giám sát của cơ quan công an",
    "ข้อบังคับว่าด้วยการตรวจราชการของหน่วยงานตำรวจ",
    "Peraturan tentang Pengawasan Internal Badan Kepolisian",
    "Peraturan mengenai Penyeliaan Dalaman Badan Polis")

put("CN-REG-0133",
    "Biện pháp quản lý tàu thuyền mang quốc tịch nước ngoài trên sông biên giới",
    "มาตรการบริหารเรือสัญชาติต่างประเทศในแม่น้ำชายแดน",
    "Tindakan Pengelolaan Kapal Berkebangsaan Asing di Sungai Perbatasan",
    "Langkah Pengurusan Kapal Berkerakyatan Asing di Sungai Sempadan")

put("CN-REG-0157",
    "Quy định của Quốc vụ viện về xử lý tranh chấp sở hữu trí tuệ có yếu tố nước ngoài",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการจัดการข้อพิพาททรัพย์สินทางปัญญาที่เกี่ยวข้องกับต่างประเทศ",
    "Ketentuan Dewan Negara tentang Penanganan Sengketa Kekayaan Intelektual yang Melibatkan "
    "Unsur Asing",
    "Peruntukan Majlis Negara mengenai Pengendalian Pertikaian Harta Intelek yang Melibatkan "
    "Unsur Asing")

put("CN-REG-0168",
    "Quy định về việc sắp xếp lao động dôi dư của doanh nghiệp nhà nước",
    "ข้อกำหนดว่าด้วยการจัดวางบุคลากรส่วนเกินของรัฐวิสาหกิจ",
    "Ketentuan tentang Penempatan Pekerja Berlebih pada Badan Usaha Milik Negara",
    "Peruntukan mengenai Penempatan Pekerja Berlebihan dalam Syarikat Milik Negara")

put("CN-REG-0217",
    "Quy định về việc quân đội tham gia cứu hộ, cứu nạn và khắc phục thảm họa",
    "ข้อบังคับว่าด้วยการเข้าร่วมของกองทัพในการกู้ภัยและบรรเทาสาธารณภัย",
    "Peraturan tentang Keikutsertaan Tentara dalam Penanggulangan Bencana dan Pertolongan Darurat",
    "Peraturan mengenai Penyertaan Tentera dalam Bantuan Bencana dan Penyelamatan Kecemasan")

put("CN-REG-0223",
    "Biện pháp quản lý trạm cung cấp lương thực, thực phẩm và trạm cấp nước quân sự",
    "มาตรการบริหารสถานีจัดหาอาหารและสถานีจ่ายน้ำของทหาร",
    "Tindakan Pengelolaan Stasiun Penyediaan Makanan dan Stasiun Penyediaan Air Militer",
    "Langkah Pengurusan Stesen Bekalan Makanan dan Stesen Bekalan Air Tentera")

put("CN-REG-0338",
    "Biện pháp quản lý việc chuyển nhượng quyền thăm dò khoáng sản và quyền khai thác khoáng sản",
    "มาตรการบริหารการโอนสิทธิสำรวจแร่และสิทธิขุดแร่",
    "Tindakan Pengelolaan Pengalihan Hak Penyelidikan dan Hak Penambangan Mineral",
    "Langkah Pengurusan Pemindahan Hak Carigali dan Hak Melombong Mineral")

put("CN-REG-0377",
    "Biện pháp xin cấp và cấp chứng minh nhân dân cho quân nhân tại ngũ và cảnh sát vũ trang nhân dân",
    "มาตรการการยื่นขอและการออกบัตรประจำตัวประชาชนสำหรับทหารประจำการและตำรวจติดอาวุธประชาชน",
    "Tindakan Permohonan dan Penerbitan Kartu Tanda Penduduk bagi Prajurit Aktif dan Polisi "
    "Bersenjata Rakyat",
    "Langkah Permohonan dan Pengeluaran Kad Pengenalan bagi Anggota Tentera Aktif dan Polis "
    "Bersenjata Rakyat")

put("CN-REG-0413",
    "Biện pháp thu và sử dụng phí bảo vệ, tái tạo nguồn lợi thủy sản",
    "มาตรการการจัดเก็บและการใช้ค่าธรรมเนียมการคุ้มครองและเพาะขยายพันธุ์ทรัพยากรประมง",
    "Tindakan Pemungutan dan Penggunaan Biaya Perlindungan dan Pengembangan Sumber Daya Perikanan",
    "Langkah Pemungutan dan Penggunaan Bayaran Perlindungan dan Pembiakan Sumber Perikanan")

put("CN-REG-0436",
    "Quy định tạm thời về việc ngăn chặn hành vi trục lợi siêu lợi nhuận",
    "ข้อกำหนดชั่วคราวว่าด้วยการระงับการแสวงหากำไรเกินควร",
    "Ketentuan Sementara tentang Penghentian Pengambilan Keuntungan Berlebihan",
    "Peruntukan Sementara mengenai Penghentian Pengambilan Keuntungan Berlebihan")

put("CN-REG-0620",
    "Quy định về quản lý việc sử dụng súng của nhân viên bảo vệ, hộ tống chuyên trách",
    "ข้อบังคับว่าด้วยการบริหารการใช้ปืนของเจ้าหน้าที่รักษาความปลอดภัยและคุ้มกันประจำ",
    "Peraturan tentang Pengelolaan Penggunaan Senjata Api oleh Petugas Pengamanan dan Pengawalan Khusus",
    "Peraturan mengenai Pengurusan Penggunaan Senjata Api oleh Petugas Keselamatan dan Pengiring Khas")

put("CN-SUP-0001",
    "Quy định về công khai thông tin công tác giám sát",
    "ข้อบังคับว่าด้วยการเปิดเผยข้อมูลงานกำกับดูแล",
    "Peraturan tentang Keterbukaan Informasi Kerja Pengawasan",
    "Peraturan mengenai Keterbukaan Maklumat Kerja Penyeliaan")

put("CN-REG-0029",
    "Quy định về bảo đảm mức sống tối thiểu của cư dân đô thị",
    "ข้อบังคับว่าด้วยการประกันการดำรงชีพขั้นต่ำของผู้อยู่อาศัยในเมือง",
    "Peraturan tentang Jaminan Penghidupan Minimum Penduduk Perkotaan",
    "Peraturan mengenai Jaminan Kehidupan Minimum Penduduk Bandar")

put("CN-REG-0047",
    "Quy định tạm thời về phạm vi trách nhiệm của cơ quan quản lý cửa khẩu địa phương",
    "ข้อกำหนดชั่วคราวว่าด้วยขอบเขตหน้าที่ของหน่วยงานบริหารด่านชายแดนท้องถิ่น",
    "Ketentuan Sementara tentang Lingkup Tugas Badan Pengelola Pelabuhan Perbatasan Daerah",
    "Peruntukan Sementara mengenai Skop Tanggungjawab Badan Pengurusan Pintu Sempadan Tempatan")

put("CN-REG-0069",
    "Biện pháp thực hiện việc tách quyết định xử phạt khỏi việc thu nộp tiền phạt",
    "มาตรการดำเนินการแยกการออกคำสั่งปรับออกจากการจัดเก็บค่าปรับ",
    "Tindakan Pelaksanaan Pemisahan Keputusan Denda dari Pemungutan Denda",
    "Langkah Pelaksanaan Pengasingan Keputusan Denda daripada Pemungutan Denda")

put("CN-REG-0071",
    "Quy định về quản lý biên tập và xuất bản tuyển tập văn bản quy phạm pháp luật",
    "ข้อกำหนดว่าด้วยการบริหารการรวบรวมและจัดพิมพ์ประมวลกฎหมายและข้อบังคับ",
    "Ketentuan tentang Pengelolaan Penyuntingan dan Penerbitan Himpunan Peraturan Perundang-undangan",
    "Peruntukan mengenai Pengurusan Penyuntingan dan Penerbitan Himpunan Undang-Undang serta Peraturan")

put("CN-REG-0117",
    "Biện pháp tạm thời về việc trả thù lao cho việc phát sóng bản ghi âm của đài phát thanh "
    "và đài truyền hình",
    "มาตรการชั่วคราวว่าด้วยการจ่ายค่าตอบแทนการออกอากาศสิ่งบันทึกเสียงของสถานีวิทยุและสถานีโทรทัศน์",
    "Tindakan Sementara tentang Pembayaran Imbalan atas Penyiaran Rekaman Suara oleh Stasiun Radio "
    "dan Stasiun Televisi",
    "Langkah Sementara mengenai Pembayaran Imbalan bagi Penyiatan Rakaman Bunyi oleh Stesen Radio "
    "dan Stesen Televisyen")

put("CN-REG-0124",
    "Biện pháp kiểm tra tại cửa khẩu đối với tàu thuyền chạy tuyến quốc tế ra vào cảng "
    "nước Cộng hòa Nhân dân Trung Hoa",
    "มาตรการตรวจสอบ ณ ด่านชายแดนสำหรับเรือเดินระหว่างประเทศที่เข้าและออกท่าเรือ"
    "แห่งสาธารณรัฐประชาชนจีน",
    "Tindakan Pemeriksaan di Pelabuhan bagi Kapal Pelayaran Internasional yang Masuk dan Keluar "
    "Pelabuhan Republik Rakyat Tiongkok",
    "Langkah Pemeriksaan di Pintu Sempadan bagi Kapal Pelayaran Antarabangsa yang Masuk dan Keluar "
    "Pelabuhan Republik Rakyat China")

put("CN-REG-0272",
    "Biện pháp quản lý đăng ký quyền sở hữu tài sản nhà nước của doanh nghiệp",
    "มาตรการบริหารการขึ้นทะเบียนสิทธิในทรัพย์สินของรัฐของวิสาหกิจ",
    "Tindakan Pengelolaan Pendaftaran Hak atas Aset Negara Perusahaan",
    "Langkah Pengurusan Pendaftaran Hak Harta Negara Syarikat")

put("CN-REG-0295",
    "Quy định về tổ chức của ủy ban hòa giải nhân dân",
    "ข้อบังคับว่าด้วยองค์กรของคณะกรรมการไกล่เกลี่ยประชาชน",
    "Peraturan tentang Organisasi Komite Mediasi Rakyat",
    "Peraturan mengenai Organisasi Jawatankuasa Pengantaraan Rakyat")

put("CN-REG-0300",
    "Quy định về công tác xóa mù chữ",
    "ข้อบังคับว่าด้วยงานการขจัดการไม่รู้หนังสือ",
    "Peraturan tentang Kerja Pemberantasan Buta Huruf",
    "Peraturan mengenai Kerja Pembasmian Buta Huruf")

put("CN-REG-0304",
    "Biện pháp quản lý khu bảo tồn thiên nhiên loại rừng và động vật hoang dã",
    "มาตรการบริหารเขตอนุรักษ์ธรรมชาติประเภทป่าไม้และสัตว์ป่า",
    "Tindakan Pengelolaan Kawasan Suaka Alam Jenis Hutan dan Satwa Liar",
    "Langkah Pengurusan Kawasan Perlindungan Alam Jenis Hutan dan Hidupan Liar")

put("CN-REG-0360",
    "Quy định về quản lý doanh nghiệp viễn thông có vốn đầu tư nước ngoài",
    "ข้อกำหนดว่าด้วยการบริหารวิสาหกิจโทรคมนาคมที่ลงทุนจากต่างประเทศ",
    "Ketentuan tentang Pengelolaan Perusahaan Telekomunikasi Penanaman Modal Asing",
    "Peruntukan mengenai Pengurusan Syarikat Telekomunikasi Pelaburan Asing")

put("CN-REG-0424",
    "Biện pháp quản lý tạm thời quỹ dự phòng rủi ro của sở giao dịch chứng khoán",
    "มาตรการบริหารกองทุนสำรองความเสี่ยงของตลาดหลักทรัพย์ชั่วคราว",
    "Tindakan Pengelolaan Sementara Dana Risiko Bursa Efek",
    "Langkah Pengurusan Sementara Dana Risiko Bursa Sekuriti")

put("CN-REG-0434",
    "Quy định về định hướng đầu tư nước ngoài",
    "ข้อกำหนดว่าด้วยแนวทางการลงทุนจากต่างประเทศ",
    "Ketentuan tentang Pedoman Arah Penanaman Modal Asing",
    "Peruntukan mengenai Panduan Hala Tuju Pelaburan Asing")

put("CN-REG-0107",
    "Quy định về kết cấu tổng quỹ tiền lương",
    "ข้อกำหนดว่าด้วยองค์ประกอบของค่าจ้างรวม",
    "Ketentuan tentang Komposisi Jumlah Upah Keseluruhan",
    "Peruntukan mengenai Komposisi Jumlah Gaji Keseluruhan")

put("CN-REG-0110",
    "Quy định tạm thời về xử lý hành chính hoặc kỷ luật đối với các hành vi vi phạm quy định "
    "quản lý ngoại hối như mua ngoại hối bằng gian dối, kinh doanh chênh lệch ngoại hối trái phép, "
    "chuyển ngoại hối ra nước ngoài trái phép, mua bán ngoại hối trái phép",
    "ข้อกำหนดชั่วคราวว่าด้วยการลงโทษทางปกครองหรือทางวินัยสำหรับการกระทำที่ฝ่าฝืนข้อกำหนด"
    "การบริหารเงินตราต่างประเทศ เช่น การซื้อเงินตราต่างประเทศโดยทุจริต การเก็งกำไรค่าเงินโดยมิชอบ "
    "การยักย้ายเงินตราต่างประเทศออกนอกประเทศ และการซื้อขายเงินตราต่างประเทศโดยมิชอบ",
    "Ketentuan Sementara tentang Sanksi Administratif atau Disipliner atas Perbuatan yang Melanggar "
    "Ketentuan Pengelolaan Devisa seperti Pembelian Devisa secara Curang, Arbitrase Valuta Asing "
    "secara Melawan Hukum, Pelarian Devisa, dan Jual Beli Devisa secara Melawan Hukum",
    "Peruntukan Sementara mengenai Hukuman Pentadbiran atau Tatatertib bagi Perbuatan yang Melanggar "
    "Peruntukan Pengurusan Pertukaran Asing seperti Pembelian Pertukaran Asing secara Curang, "
    "Arbitraj Pertukaran Asing secara Menyalahi Undang-Undang, Pelarian Pertukaran Asing dan "
    "Jual Beli Pertukaran Asing secara Menyalahi Undang-Undang")

put("CN-REG-0126",
    "Quy định về việc tiếp tế của tàu du lịch quốc tế khi cập cảng nước Cộng hòa Nhân dân Trung Hoa",
    "ข้อกำหนดว่าด้วยการเติมเสบียงของเรือสำราญระหว่างประเทศเมื่อเทียบท่าแห่งสาธารณรัฐประชาชนจีน",
    "Ketentuan tentang Pengisian Bekal Kapal Pesiar Internasional saat Bersandar di Pelabuhan "
    "Republik Rakyat Tiongkok",
    "Peruntukan mengenai Pengisian Bekalan Kapal Persiaran Antarabangsa semasa Berlabuh di "
    "Pelabuhan Republik Rakyat China")

put("CN-REG-0127",
    "Quy định về chế độ đãi ngộ sinh hoạt của công chức cơ quan nhà nước trong thời gian nghỉ ốm",
    "ข้อกำหนดว่าด้วยสวัสดิการการดำรงชีพของข้าราชการระหว่างลาป่วย",
    "Ketentuan tentang Tunjangan Penghidupan Pegawai Negeri selama Cuti Sakit",
    "Peruntukan mengenai Elaun Kehidupan Pegawai Kerajaan semasa Cuti Sakit")

doc = {
    "batch": "cn-p1-b21",
    "scope": "CN 按条文数 20–19 条段 60 部（司法解释 23、行政法规 37）",
    "note": "语义基准 title.zh；主体译名沿用既有批次。另修 1 处 zh 缺陷："
            "CN-JI-0088 原为「最高人民法院++最高人民检察院」，拆成正确顿号表述。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "cn-p1-b21.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
