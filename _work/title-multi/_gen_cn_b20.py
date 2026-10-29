# -*- coding: utf-8 -*-
"""CN 标题多语种批次生成器（第 20 批：按条文数 21 条段起的 60 部）。

语义基准：title.zh（中文原本，权威）。
主体译名沿用既有批次：
  最高人民法院 = Tòa án Nhân dân Tối cao / ศาลประชาชนสูงสุด / Mahkamah Rakyat Agung
  最高人民检察院 = Viện Kiểm sát Nhân dân Tối cao / อัยการประชาชนสูงสุด / Kejaksaan Rakyat Agung
  国务院 = Quốc vụ viện / คณะรัฐมนตรี / Dewan Negara / Majlis Negara
  全国人大常委会 = Ủy ban Thường vụ ĐHĐBND Toàn quốc / คณะกรรมาธิการสามัญสภาผู้แทนประชาชนแห่งชาติ /
                  Komite Tetap Kongres Rakyat Nasional / Jawatankuasa Tetap Kongres Rakyat Kebangsaan
  中华人民共和国 = Cộng hòa Nhân dân Trung Hoa / สาธารณรัฐประชาชนจีน /
                  Republik Rakyat Tiongkok / Republik Rakyat China
"""
import json, io, os

items = {}


def put(lid, vi, th, id_, ms):
    items[lid] = {"vi": vi, "th": th, "id": id_, "ms": ms}


# ============ 司法解释（最高人民法院 / 两高） ============
put("CN-JI-0263",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong thẩm tra vụ án "
    "bảo toàn hành vi liên quan đến tranh chấp sở hữu trí tuệ",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการทบทวนคดีมาตรการคุ้มครองชั่วคราว"
    "เกี่ยวกับพฤติการณ์ในข้อพิพาททรัพย์สินทางปัญญา",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Peninjauan Perkara "
    "Pelestarian Perilaku pada Sengketa Kekayaan Intelektual",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Semakan Kes "
    "Pemeliharaan Kelakuan dalam Pertikaian Harta Intelek")

put("CN-JI-0305",
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong xét xử vụ án tranh chấp lao động (II)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทแรงงาน (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Pemeriksaan Perkara "
    "Sengketa Tenaga Kerja (II)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Perbicaraan Kes "
    "Pertikaian Buruh (II)")

put("CN-JI-0314",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng chế định thời hiệu tố tụng "
    "trong xét xử vụ án dân sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ระบบอายุความฟ้องคดีในการพิจารณาคดีแพ่ง",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Lembaga Daluwarsa Gugatan "
    "dalam Pemeriksaan Perkara Perdata",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Institusi Had Masa Saman "
    "dalam Perbicaraan Kes Sivil")

put("CN-JI-0347",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp liên quan đến thuyền viên",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทเกี่ยวกับลูกเรือ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Sengketa "
    "terkait Awak Kapal",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pertikaian "
    "berkaitan Anak Kapal")

put("CN-JI-0404",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Bảo hiểm "
    "nước Cộng hòa Nhân dân Trung Hoa (II)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายประกันภัยแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Asuransi "
    "Republik Rakyat Tiongkok (II)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Insurans "
    "Republik Rakyat China (II)")

put("CN-JI-0406",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Bảo hiểm "
    "nước Cộng hòa Nhân dân Trung Hoa (IV)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายประกันภัยแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 4)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Asuransi "
    "Republik Rakyat Tiongkok (IV)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Insurans "
    "Republik Rakyat China (IV)")

put("CN-JI-0424",
    "Giải thích của Tòa án Nhân dân Tối cao về việc áp dụng Phần Vật quyền của Bộ luật Dân sự "
    "nước Cộng hòa Nhân dân Trung Hoa (I)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการใช้ภาคทรัพย์สินแห่งประมวลกฎหมายแพ่งและพาณิชย์"
    "แห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "Penafsiran Mahkamah Rakyat Agung tentang Penerapan Bagian Hak Kebendaan Kitab Undang-Undang "
    "Hukum Perdata Republik Rakyat Tiongkok (I)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penggunaan Bahagian Hak Harta Kanun Undang-Undang "
    "Sivil Republik Rakyat China (I)")

put("CN-JI-0032",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về ô nhiễm môi trường",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับมลพิษสิ่งแวดล้อม",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan "
    "Hukum dalam Penanganan Perkara Pidana Pencemaran Lingkungan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Pencemaran Alam Sekitar")

put("CN-JI-0039",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về hủy hoại nguồn động vật hoang dã",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการทำลายทรัพยากรสัตว์ป่า",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan "
    "Hukum dalam Penanganan Perkara Pidana Perusakan Sumber Daya Satwa Liar",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Sumber Hidupan Liar")

put("CN-JI-0046",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về tham nhũng, hối lộ",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการทุจริตและการให้สินบน",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan "
    "Hukum dalam Penanganan Perkara Pidana Korupsi dan Penyuapan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Rasuah dan Sogokan")

put("CN-JI-0212",
    "Quy định của Tòa án Nhân dân Tối cao về trình tự xử lý vụ án tự bồi thường của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยกระบวนการดำเนินคดีชดเชยโดยศาลเองของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Prosedur Penanganan Perkara Kompensasi Mandiri "
    "oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Prosedur Pengendalian Kes Pampasan Sendiri "
    "oleh Mahkamah Rakyat")

put("CN-JI-0214",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề đăng ký thụ lý vụ án của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการขึ้นทะเบียนรับคดีของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Pendaftaran Perkara oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pendaftaran Kes oleh Mahkamah Rakyat")

put("CN-JI-0220",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong công tác hòa giải dân sự của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในงานไกล่เกลี่ยคดีแพ่งของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Kerja Mediasi Perdata "
    "Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Kerja Pengantaraan Sivil "
    "Mahkamah Rakyat")

put("CN-JI-0322",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án hình sự về hủy hoại nguồn tài nguyên rừng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีอาญา"
    "เกี่ยวกับการทำลายทรัพยากรป่าไม้",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Pidana Perusakan Sumber Daya Hutan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Jenayah Perosakan Sumber Hutan")

put("CN-JI-0331",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp xâm phạm quyền sáng chế",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาท"
    "การละเมิดสิทธิสิทธิบัตร",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Pelanggaran Hak Paten",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Pelanggaran Hak Paten")

put("CN-JI-0358",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án bồi thường tư pháp liên quan đến thi hành án",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีชดเชย"
    "ทางตุลาการเกี่ยวกับการบังคับคดี",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Kompensasi Yudisial terkait Pelaksanaan Putusan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pampasan Kehakiman berkaitan Pelaksanaan")

put("CN-JI-0373",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xét xử vụ án tranh chấp tiêu dùng trực tuyến (I)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทการบริโภคออนไลน์ (ฉบับที่ 1)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pemeriksaan Perkara Sengketa "
    "Konsumen Daring (I)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Perbicaraan Kes Pertikaian "
    "Pengguna Dalam Talian (I)")

put("CN-JI-0378",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng cụ thể pháp luật trong xét xử "
    "vụ án hình sự đối với người chưa thành niên",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการพิจารณาคดีอาญาที่ผู้กระทำเป็นผู้เยาว์",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum secara Khusus "
    "dalam Pemeriksaan Perkara Pidana dengan Pelaku Anak",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang secara Khusus "
    "dalam Perbicaraan Kes Jenayah Melibatkan Kanak-Kanak")

put("CN-JI-0397",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp sáng chế",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทสิทธิบัตร",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Paten",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Paten")

put("CN-JI-0498",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề hòa giải trong thi hành án",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการประนีประนอมยอมความในการบังคับคดี",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Perdamaian dalam Pelaksanaan Putusan",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Perdamaian dalam Pelaksanaan")

put("CN-JI-0026",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về sử dụng trái phép mạng thông tin, "
    "giúp sức cho hoạt động phạm tội trên mạng thông tin và các hành vi khác",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการใช้เครือข่ายสารสนเทศโดยมิชอบ การช่วยเหลือกิจกรรมอาชญากรรม"
    "ทางเครือข่ายสารสนเทศ และการกระทำอื่น ๆ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan "
    "Hukum dalam Penanganan Perkara Pidana Penggunaan Jaringan Informasi secara Melawan Hukum, "
    "Membantu Kegiatan Tindak Pidana di Jaringan Informasi, dan Perbuatan Lainnya",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Penggunaan Rangkaian Maklumat secara Menyalahi "
    "Undang-Undang, Membantu Aktiviti Jenayah dalam Rangkaian Maklumat, dan Perbuatan Lain")

put("CN-JI-0227",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề cưỡng chế thi hành đối với phần vốn góp",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการบังคับคดีเกี่ยวกับหุ้นส่วนทุน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Eksekusi atas Saham",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Pelaksanaan atas Saham")

put("CN-JI-0234",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề ghi âm, ghi hình phiên tòa của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการบันทึกเสียงและบันทึกภาพ"
    "การพิจารณาคดีของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Perekaman Suara dan Gambar "
    "Sidang Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Rakaman Audio dan Visual "
    "Perbicaraan Mahkamah Rakyat")

put("CN-JI-0256",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề thành lập Tòa án Thương mại Quốc tế",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการจัดตั้งศาลพาณิชย์ระหว่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Pembentukan Pengadilan Niaga Internasional",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penubuhan Mahkamah Perdagangan Antarabangsa")

put("CN-JI-0300",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp quyền sở hữu riêng trong nhà chung cư",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาท"
    "สิทธิความเป็นเจ้าของแยกส่วนในอาคารชุด",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Hak Milik Terpisah pada Bangunan Bertingkat",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Hak Milik Berasingan dalam Bangunan Berbilang Tingkat")

put("CN-JI-0365",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp bồi thường mang tính trừng phạt về thực phẩm và dược phẩm",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาท"
    "การชดเชยค่าเสียหายเชิงลงโทษเกี่ยวกับอาหารและยา",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Ganti Kerugian Bersifat Hukuman atas Pangan dan Obat",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Pampasan Bersifat Hukuman bagi Makanan dan Ubat")

put("CN-JI-0366",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tranh chấp về thực phẩm và dược phẩm",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาท"
    "เกี่ยวกับอาหารและยา",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Sengketa Pangan dan Obat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Pertikaian Makanan dan Ubat")

put("CN-JI-0381",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xét xử "
    "vụ án tố tụng công ích dân sự về tiêu dùng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีฟ้องคดี"
    "สาธารณะทางแพ่งด้านการบริโภค",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Pemeriksaan "
    "Perkara Gugatan Kepentingan Publik Perdata di Bidang Konsumen",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam "
    "Perbicaraan Kes Saman Kepentingan Awam Sivil dalam Bidang Pengguna")

put("CN-JI-0433",
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Hội thẩm nhân dân "
    "nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายว่าด้วยผู้พิพากษาสมทบประชาชน"
    "แห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Juri Rakyat "
    "Republik Rakyat Tiongkok",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Juri Rakyat "
    "Republik Rakyat China")

put("CN-JI-0021",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề "
    "áp dụng pháp luật trong xử lý vụ án hình sự về cản trở quản lý di sản văn hóa và các hành vi khác",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมาย"
    "ในการดำเนินคดีอาญาเกี่ยวกับการขัดขวางการบริหารมรดกวัฒนธรรมและการกระทำอื่น ๆ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan "
    "Hukum dalam Penanganan Perkara Pidana Penghambatan Pengelolaan Warisan Budaya dan Perbuatan Lainnya",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan "
    "Undang-Undang dalam Pengendalian Kes Jenayah Penghalangan Pengurusan Warisan Budaya dan "
    "Perbuatan Lain")

put("CN-JI-0023",
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc áp dụng cụ thể "
    "pháp luật trong xử lý vụ án hình sự về cản trở phòng ngừa, kiểm soát dịch bệnh truyền nhiễm "
    "đột xuất và các thảm họa khác",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายอย่างเฉพาะเจาะจง"
    "ในการดำเนินคดีอาญาเกี่ยวกับการขัดขวางการป้องกันและควบคุมโรคติดเชื้ออุบัติใหม่และภัยพิบัติอื่น ๆ",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penerapan Hukum secara "
    "Khusus dalam Penanganan Perkara Pidana Penghambatan Pencegahan dan Pengendalian Wabah Penyakit "
    "Menular Mendadak dan Bencana Lainnya",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang secara "
    "Khusus dalam Pengendalian Kes Jenayah Penghalangan Pencegahan dan Kawalan Wabak Penyakit "
    "Berjangkit secara Mendadak dan Bencana Lain")

put("CN-JI-0218",
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong công tác của hội đồng xét xử "
    "của tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในงานของคณะผู้พิพากษาของศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Kerja Majelis Hakim "
    "Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Kerja Panel Hakim Mahkamah Rakyat")

put("CN-JI-0239",
    "Quy định của Tòa án Nhân dân Tối cao về việc tòa án nhân dân công bố văn bản phán quyết trên Internet",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการเผยแพร่เอกสารคำพิพากษาของศาลประชาชนบนอินเทอร์เน็ต",
    "Ketentuan Mahkamah Rakyat Agung tentang Publikasi Dokumen Putusan Pengadilan Rakyat di Internet",
    "Peruntukan Mahkamah Rakyat Agung mengenai Penerbitan Dokumen Penghakiman Mahkamah Rakyat "
    "di Internet")

# ============ 法律 / 人大决定 ============
put("CN-LAW-0038",
    "Quy định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về một số vấn đề bầu cử trực tiếp "
    "đại biểu Đại hội Đại biểu Nhân dân cấp huyện và cấp dưới",
    "ข้อกำหนดของคณะกรรมาธิการสามัญสภาผู้แทนประชาชนแห่งชาติว่าด้วยปัญหาหลายประการเกี่ยวกับ"
    "การเลือกตั้งผู้แทนสภาผู้แทนประชาชนระดับอำเภอและต่ำกว่าโดยตรง",
    "Ketentuan Komite Tetap Kongres Rakyat Nasional tentang Beberapa Masalah Pemilihan Langsung "
    "Anggota Kongres Rakyat pada Tingkat Kabupaten dan di Bawahnya",
    "Peruntukan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Beberapa Isu Pilihan Raya "
    "Langsung Wakil Kongres Rakyat Peringkat Daerah dan Ke Bawah")

# ============ 行政法规 ============
put("CN-REG-0269",
    "Quy định về quản lý việc lắp đặt cáp và tuyến ống ngầm dưới biển",
    "ข้อกำหนดว่าด้วยการบริหารการวางสายเคเบิลและท่อใต้ทะเล",
    "Ketentuan tentang Pengelolaan Pemasangan Kabel dan Pipa Bawah Laut",
    "Peruntukan mengenai Pengurusan Pemasangan Kabel dan Paip Dasar Laut")

put("CN-REG-0373",
    "Quy định về công tác của hệ thống nhà thiết kế và hệ thống chỉ huy hành chính "
    "trong nghiên cứu chế tạo vũ khí trang bị",
    "ข้อบังคับว่าด้วยการทำงานของระบบนักออกแบบและระบบบังคับบัญชาทางปกครองในการวิจัยและพัฒนายุทโธปกรณ์",
    "Peraturan tentang Kerja Sistem Perancang dan Sistem Komando Administratif dalam Penelitian "
    "dan Pengembangan Alutsista",
    "Peraturan mengenai Kerja Sistem Pereka dan Sistem Pemerintahan Pentadbiran dalam "
    "Penyelidikan dan Pembangunan Peralatan Persenjataan")

put("CN-REG-0425",
    "Biện pháp thực hiện chế độ cam kết của đương sự trong thực thi pháp luật về chứng khoán "
    "và hợp đồng tương lai",
    "มาตรการดำเนินการตามระบบคำมั่นของคู่กรณีในการบังคับใช้กฎหมายหลักทรัพย์และสัญญาซื้อขายล่วงหน้า",
    "Tindakan Pelaksanaan Sistem Komitmen Pihak dalam Penegakan Hukum Pasar Modal dan "
    "Perdagangan Berjangka",
    "Langkah Pelaksanaan Sistem Komitmen Pihak dalam Penguatkuasaan Undang-Undang Sekuriti dan "
    "Niaga Hadapan")

put("CN-DATA-EXPORT-2022",
    "Biện pháp đánh giá an ninh đối với việc chuyển dữ liệu ra nước ngoài",
    "มาตรการประเมินความมั่นคงปลอดภัยของการส่งข้อมูลออกนอกประเทศ",
    "Tindakan Penilaian Keamanan atas Transfer Data ke Luar Negeri",
    "Langkah Penilaian Keselamatan bagi Pemindahan Data ke Luar Negara")

put("CN-PIA-010",
    "Biện pháp đánh giá an ninh đối với việc chuyển dữ liệu ra nước ngoài",
    "มาตรการประเมินความมั่นคงปลอดภัยของการส่งข้อมูลออกนอกประเทศ",
    "Tindakan Penilaian Keamanan atas Transfer Data ke Luar Negeri",
    "Langkah Penilaian Keselamatan bagi Pemindahan Data ke Luar Negara")

put("CN-PIA-006",
    "Biện pháp quản lý kiểm toán tuân thủ bảo vệ thông tin cá nhân",
    "มาตรการบริหารการตรวจสอบการปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล",
    "Tindakan Pengelolaan Audit Kepatuhan Perlindungan Informasi Pribadi",
    "Langkah Pengurusan Audit Pematuhan Perlindungan Maklumat Peribadi")

put("CN-PIA-007",
    "Biện pháp quản lý an ninh đối với việc ứng dụng công nghệ nhận dạng khuôn mặt",
    "มาตรการบริหารความมั่นคงปลอดภัยในการประยุกต์ใช้เทคโนโลยีการจดจำใบหน้า",
    "Tindakan Pengelolaan Keamanan Penerapan Teknologi Pengenalan Wajah",
    "Langkah Pengurusan Keselamatan Penggunaan Teknologi Pengecaman Wajah")

put("CN-PIA-008",
    "Biện pháp chứng nhận đối với việc chuyển thông tin cá nhân ra nước ngoài",
    "มาตรการรับรองการส่งข้อมูลส่วนบุคคลออกนอกประเทศ",
    "Tindakan Sertifikasi atas Transfer Informasi Pribadi ke Luar Negeri",
    "Langkah Pensijilan bagi Pemindahan Maklumat Peribadi ke Luar Negara")

put("CN-REG-0039",
    "Quy định về bảo vệ mỹ thuật thủ công truyền thống",
    "ข้อบังคับว่าด้วยการคุ้มครองศิลปหัตถกรรมประณีตประเพณี",
    "Peraturan tentang Perlindungan Seni Kriya Tradisional",
    "Peraturan mengenai Perlindungan Seni Kraf Tradisional")

put("CN-REG-0125",
    "Biện pháp khai báo thống kê cán cân thanh toán quốc tế",
    "มาตรการการยื่นรายงานสถิติดุลการชำระเงินระหว่างประเทศ",
    "Tindakan Pelaporan Statistik Neraca Pembayaran Internasional",
    "Langkah Pelaporan Statistik Imbangan Pembayaran Antarabangsa")

put("CN-REG-0150",
    "Quy định đặc biệt của Quốc vụ viện về tăng cường giám sát quản lý an toàn thực phẩm "
    "và các sản phẩm khác",
    "ข้อกำหนดพิเศษของคณะรัฐมนตรีว่าด้วยการเสริมสร้างการกำกับดูแลความปลอดภัยของอาหารและผลิตภัณฑ์อื่น ๆ",
    "Ketentuan Khusus Dewan Negara tentang Penguatan Pengawasan Keamanan Pangan dan Produk Lainnya",
    "Peruntukan Khas Majlis Negara mengenai Pengukuhan Penyeliaan Keselamatan Makanan dan Produk Lain")

put("CN-REG-0218",
    "Quy định về quản lý quân phục",
    "ข้อบังคับว่าด้วยการบริหารเครื่องแบบทหาร",
    "Peraturan tentang Pengelolaan Pakaian Seragam Militer",
    "Peraturan mengenai Pengurusan Pakaian Seragam Tentera")

put("CN-REG-0225",
    "Quy định về kiểm soát việc kiểm tra kinh tế đối với doanh nghiệp",
    "ข้อกำหนดว่าด้วยการควบคุมการตรวจสอบทางเศรษฐกิจต่อวิสาหกิจ",
    "Ketentuan tentang Pengendalian Pemeriksaan Ekonomi terhadap Perusahaan",
    "Peruntukan mengenai Kawalan Pemeriksaan Ekonomi terhadap Syarikat")

put("CN-REG-0236",
    "Biện pháp quản lý an ninh trật tự ngành kinh doanh khách sạn",
    "มาตรการบริหารความสงบเรียบร้อยในธุรกิจโรงแรม",
    "Tindakan Pengelolaan Ketertiban dan Keamanan Usaha Perhotelan",
    "Langkah Pengurusan Ketenteraman dan Keselamatan Perniagaan Perhotelan")

put("CN-REG-0332",
    "Quy định về bảo vệ và sinh sản nguồn lợi thủy sản",
    "ข้อบังคับว่าด้วยการคุ้มครองและการเพาะขยายพันธุ์ทรัพยากรสัตว์น้ำ",
    "Peraturan tentang Perlindungan dan Pengembangbiakan Sumber Daya Perikanan",
    "Peraturan mengenai Perlindungan dan Pembiakan Sumber Perikanan")

put("CN-REG-0387",
    "Quy định về quản lý đường ranh giới địa giới hành chính",
    "ข้อบังคับว่าด้วยการบริหารเส้นเขตการปกครอง",
    "Peraturan tentang Pengelolaan Garis Batas Wilayah Administratif",
    "Peraturan mengenai Pengurusan Garis Sempadan Wilayah Pentadbiran")

put("CN-REG-0389",
    "Quy định về việc cơ quan thực thi pháp luật hành chính chuyển giao vụ việc có dấu hiệu tội phạm",
    "ข้อกำหนดว่าด้วยการส่งมอบคดีที่สงสัยว่าเป็นความผิดอาญาโดยหน่วยงานบังคับใช้กฎหมายทางปกครอง",
    "Ketentuan tentang Pengalihan Perkara yang Diduga Merupakan Tindak Pidana oleh Badan Penegak "
    "Hukum Administratif",
    "Peruntukan mengenai Pemindahan Kes yang Disyaki Kesalahan Jenayah oleh Badan Penguatkuasa "
    "Undang-Undang Pentadbiran")

put("CN-REG-0410",
    "Biện pháp quản lý tạm thời truyền hình cáp",
    "มาตรการบริหารโทรทัศน์เคเบิลชั่วคราว",
    "Tindakan Pengelolaan Sementara Televisi Kabel",
    "Langkah Pengurusan Sementara Televisyen Kabel")

put("CN-REG-0426",
    "Quy định về công tác cố vấn chính phủ",
    "ข้อบังคับว่าด้วยงานที่ปรึกษาราชการ",
    "Peraturan tentang Kerja Penasihat Pemerintah",
    "Peraturan mengenai Kerja Penasihat Kerajaan")

put("CN-REG-0052",
    "Quy định về quản lý đánh giá an toàn động đất",
    "ข้อบังคับว่าด้วยการบริหารการประเมินความปลอดภัยจากแผ่นดินไหว",
    "Peraturan tentang Pengelolaan Penilaian Keamanan Gempa Bumi",
    "Peraturan mengenai Pengurusan Penilaian Keselamatan Gempa Bumi")

put("CN-REG-0091",
    "Quy định về phòng quản lý hành chính công thương",
    "ข้อบังคับว่าด้วยสำนักงานบริหารอุตสาหกรรมและพาณิชย์",
    "Peraturan tentang Kantor Administrasi Industri dan Perdagangan",
    "Peraturan mengenai Pejabat Pentadbiran Industri dan Perdagangan")

put("CN-REG-0096",
    "Quy định về quản lý vệ sinh nơi công cộng",
    "ข้อบังคับว่าด้วยการบริหารสุขอนามัยในที่สาธารณะ",
    "Peraturan tentang Pengelolaan Higiene di Tempat Umum",
    "Peraturan mengenai Pengurusan Kebersihan di Tempat Awam")

put("CN-REG-0114",
    "Biện pháp quản lý việc nhà đầu tư nước ngoài tham gia trục vớt tàu chìm, vật chìm "
    "tại vùng biển ven bờ Trung Quốc",
    "มาตรการบริหารการเข้าร่วมของนักลงทุนต่างชาติในการกู้เรือและวัตถุที่จมในน่านน้ำชายฝั่งจีน",
    "Tindakan Pengelolaan Keikutsertaan Penanam Modal Asing dalam Pengangkatan Kapal dan Benda "
    "Tenggelam di Perairan Pesisir Tiongkok",
    "Langkah Pengurusan Penyertaan Pelabur Asing dalam Pengangkatan Kapal dan Benda Tenggelam "
    "di Perairan Pesisir China")

put("CN-REG-0138",
    "Quy định của Quốc vụ viện về quản lý xuất nhập cảnh",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการบริหารการเข้าเมืองและออกเมือง",
    "Ketentuan Dewan Negara tentang Pengelolaan Keimigrasian",
    "Peruntukan Majlis Negara mengenai Pengurusan Imigresen")

put("CN-REG-0148",
    "Quy định của Quốc vụ viện về việc chuẩn mực hóa hoạt động cung cấp dịch vụ của tổ chức trung gian "
    "cho việc phát hành cổ phiếu ra công chúng của công ty",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการกำหนดมาตรฐานการให้บริการของตัวกลางในการออกหุ้นต่อสาธารณะของบริษัท",
    "Ketentuan Dewan Negara tentang Standardisasi Layanan Lembaga Perantara dalam Penawaran Umum "
    "Saham Perusahaan",
    "Peruntukan Majlis Negara mengenai Penyeragaman Perkhidmatan Perantara dalam Tawaran Awam "
    "Saham Syarikat")

put("CN-REG-0371",
    "Biện pháp xử lý hành vi kinh doanh không giấy phép, không đăng ký",
    "มาตรการสอบสวนดำเนินคดีการประกอบธุรกิจโดยไม่มีใบอนุญาตและไม่จดทะเบียน",
    "Tindakan Penindakan Usaha Tanpa Izin dan Tanpa Pendaftaran",
    "Langkah Penguatkuasaan Perniagaan Tanpa Lesen dan Tanpa Pendaftaran")

doc = {
    "batch": "cn-p1-b20",
    "scope": "CN 按条文数 21–18 条段 60 部（司法解释 40、行政法规 16、法律决定 1、数据合规办法 3）",
    "note": "语义基准 title.zh；主体译名沿用既有批次（国务院 = Quốc vụ viện / คณะรัฐมนตรี / "
            "Dewan Negara / Majlis Negara）。CN-DATA-EXPORT-2022 与 CN-PIA-010 为同一法源的两条记录，"
            "译名保持一致。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "cn-p1-b20.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
