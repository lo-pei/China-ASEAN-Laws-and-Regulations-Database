# -*- coding: utf-8 -*-
"""CN 第 31 批：补齐此前跳过的 60 部（_cn_last60.json）。"""
import io, json, os

ITEMS = {}

ITEMS["CN-JI-0029"] = (
    "Quy định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án chiếm dụng trái phép đất canh tác",
    "ข้อกำหนดของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีการครอบครองที่ดินทำกินโดยมิชอบ",
    "Ketentuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Penguasaan Lahan Pertanian secara Tidak Sah",
    "Peruntukan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Penguasaan Tanah Pertanian secara Tidak Sah",
)
ITEMS["CN-JI-0052"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về vi phạm quản lý thu thuế",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการฝ่าฝืนการบริหารการจัดเก็บภาษี",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Pelanggaran Pengelolaan Pemungutan Pajak",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pelanggaran Pengurusan Pemungutan Cukai",
)
ITEMS["CN-JI-0053"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về vi phạm an toàn dược phẩm",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการฝ่าฝืนความปลอดภัยของยาและเวชภัณฑ์",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Pelanggaran Keamanan Obat dan Alat Kesehatan",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pelanggaran Keselamatan Ubat dan Alat Kesihatan",
)
ITEMS["CN-JI-0057"] = (
    "Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án bồi thường hình sự",
    "การตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีชดเชยทางอาญา",
    "Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Ganti Rugi Pidana",
    "Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pampasan Jenayah",
)
ITEMS["CN-JI-0076"] = (
    "Quy định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng thủ tục xét xử vắng mặt trong tố tụng hình sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ขั้นตอนการพิจารณาคดีโดยที่จำเลยไม่มาศาลในกระบวนการอาญา",
    "Ketentuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Tata Cara Pemeriksaan Perkara secara In Absentia dalam Peradilan Pidana",
    "Peruntukan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Tatacara Pemeriksaan Kes secara In Absentia dalam Kehakiman Jenayah",
)
ITEMS["CN-JI-0171"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án của tòa án internet",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีของศาลอินเทอร์เน็ต",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara oleh Pengadilan Internet",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes oleh Mahkamah Internet",
)
ITEMS["CN-JI-0174"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thủ tục xét xử vụ án giảm án, tạm tha",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการพิจารณาคดีลดโทษและการพักการลงโทษ",
    "Ketentuan Mahkamah Rakyat Agung tentang Tata Cara Pemeriksaan Perkara Pengurangan Pidana dan Pembebasan Bersyarat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Tatacara Pemeriksaan Kes Pengurangan Hukuman dan Pelepasan Bersyarat",
)
ITEMS["CN-JI-0187"] = (
    "Thỏa thuận giữa nội địa Trung Quốc và Đặc khu Hành chính Ma Cao về công nhận và thi hành lẫn nhau phán quyết dân sự và thương mại",
    "ความตกลงระหว่างจีนแผ่นดินใหญ่กับเขตบริหารพิเศษมาเก๊าว่าด้วยการรับรองและการบังคับตามคำพิพากษาแพ่งและพาณิชย์ซึ่งกันและกัน",
    "Kesepakatan antara Tiongkok Daratan dan Daerah Administratif Khusus Makau tentang Saling Pengakuan dan Pelaksanaan Putusan Perdata dan Dagang",
    "Persetujuan antara Tanah Besar China dan Wilayah Pentadbiran Khas Makau mengenai Saling Pengiktirafan dan Pelaksanaan Penghakiman Sivil dan Perdagangan",
)
ITEMS["CN-JI-0192"] = (
    "Thỏa thuận giữa tòa án nội địa Trung Quốc và tòa án Đặc khu Hành chính Hồng Kông về công nhận và thi hành lẫn nhau phán quyết trong vụ án dân sự về hôn nhân và gia đình",
    "ความตกลงระหว่างศาลจีนแผ่นดินใหญ่กับศาลเขตบริหารพิเศษฮ่องกงว่าด้วยการรับรองและการบังคับตามคำพิพากษาในคดีแพ่งด้านการสมรสและครอบครัวซึ่งกันและกัน",
    "Kesepakatan antara Pengadilan Tiongkok Daratan dan Pengadilan Daerah Administratif Khusus Hong Kong tentang Saling Pengakuan dan Pelaksanaan Putusan dalam Perkara Perdata Perkawinan dan Keluarga",
    "Persetujuan antara Mahkamah Tanah Besar China dan Mahkamah Wilayah Pentadbiran Khas Hong Kong mengenai Saling Pengiktirafan dan Pelaksanaan Penghakiman dalam Kes Sivil Perkahwinan dan Keluarga",
)
ITEMS["CN-JI-0211"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong việc tòa án nhân dân xử lý vụ án thi hành phán quyết trọng tài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการที่ศาลประชาชนพิจารณาคดีบังคับตามคำชี้ขาดอนุญาโตตุลาการ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Pelaksanaan Putusan Arbitrase oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pelaksanaan Award Timbang Tara oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0224"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thủ tục xét xử vụ án bồi thường nhà nước của ủy ban bồi thường tòa án nhân dân",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการพิจารณาคดีชดเชยแห่งรัฐของคณะกรรมการชดเชยประจำศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Tata Cara Pemeriksaan Perkara Ganti Rugi Negara oleh Komite Ganti Rugi Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Tatacara Pemeriksaan Kes Pampasan Negara oleh Jawatankuasa Pampasan Mahkamah Rakyat",
)
ITEMS["CN-JI-0247"] = (
    "Quy định của Tòa án Nhân dân Tối cao về công nhận và thi hành phán quyết trọng tài của khu vực Đài Loan (Trung Quốc)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยการรับรองและการบังคับตามคำชี้ขาดอนุญาโตตุลาการของเขตไต้หวัน (จีน)",
    "Ketentuan Mahkamah Rakyat Agung tentang Pengakuan dan Pelaksanaan Putusan Arbitrase Wilayah Taiwan (Tiongkok)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Pengiktirafan dan Pelaksanaan Award Timbang Tara Wilayah Taiwan (China)",
)
ITEMS["CN-JI-0294"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử các tranh chấp liên quan đến giới hạn trách nhiệm bồi thường hàng hải",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีข้อพิพาทที่เกี่ยวข้องกับขีดจำกัดความรับผิดชดเชยทางทะเล",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Sengketa Terkait Pembatasan Tanggung Jawab Ganti Rugi Maritim",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Pertikaian Berkaitan Had Tanggungjawab Pampasan Maritim",
)
ITEMS["CN-JI-0304"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp tài nguyên khoáng sản",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาททรัพยากรแร่ธาตุ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Sumber Daya Mineral",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Sumber Mineral",
)
ITEMS["CN-JI-0310"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp du lịch",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทด้านการท่องเที่ยว",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Pariwisata",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Pelancongan",
)
ITEMS["CN-JI-0313"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án bồi thường tư pháp trong tố tụng dân sự và hành chính",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีชดเชยทางตุลาการในกระบวนการพิจารณาคดีแพ่งและคดีปกครอง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Ganti Rugi Yudisial dalam Peradilan Perdata dan Tata Usaha Negara",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pampasan Kehakiman dalam Kehakiman Sivil dan Pentadbiran",
)
ITEMS["CN-JI-0339"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án bồi thường thiệt hại về thân thể",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีชดเชยความเสียหายต่อร่างกาย",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Ganti Rugi Kerusakan Fisik",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Pampasan Kerosakan Fizikal",
)
ITEMS["CN-JI-0341"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp dân sự về tài nguyên rừng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีแพ่งข้อพิพาทเกี่ยวกับทรัพยากรป่าไม้",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Perdata Sumber Daya Hutan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Sivil Sumber Hutan",
)
ITEMS["CN-JI-0343"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp dân sự về nhãn hiệu",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีแพ่งข้อพิพาทเกี่ยวกับเครื่องหมายการค้า",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Perdata Merek",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Sivil Cap Dagangan",
)
ITEMS["CN-JI-0345"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp hợp đồng mua bán nhà ở thương mại",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทสัญญาซื้อขายที่อยู่อาศัยเพื่อการพาณิชย์",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Perjanjian Jual Beli Rumah Komersial",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Persetujuan Jual Beli Rumah Komersial",
)
ITEMS["CN-JI-0363"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc xét xử vụ án bồi thường thiệt hại môi trường sinh thái (áp dụng thí điểm)",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการพิจารณาคดีชดเชยความเสียหายต่อสิ่งแวดล้อมเชิงนิเวศ (ทดลองใช้)",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Penanganan Perkara Ganti Rugi Kerusakan Lingkungan Ekologi (Uji Coba)",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pengendalian Kes Pampasan Kerosakan Alam Sekitar Ekologi (Percubaan)",
)
ITEMS["CN-JI-0372"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án tranh chấp doanh nghiệp có vốn đầu tư nước ngoài (Phần một)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทของวิสาหกิจที่ลงทุนจากต่างประเทศ (ฉบับที่ 1)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Sengketa Badan Usaha Penanaman Modal Asing (Bagian Pertama)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pertikaian Perusahaan Pelaburan Asing (Bahagian Pertama)",
)
ITEMS["CN-JI-0392"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong xử lý vụ án kiện về kháng nghị thi hành án",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาการใช้กฎหมายในการพิจารณาคดีฟ้องคดีคัดค้านการบังคับคดี",
    "Penafsiran Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Penanganan Perkara Gugatan atas Keberatan Pelaksanaan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Pengendalian Kes Guaman atas Bantahan Pelaksanaan",
)
ITEMS["CN-JI-0394"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý vụ án giám sát tư pháp về trọng tài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีกำกับดูแลทางตุลาการเกี่ยวกับอนุญาโตตุลาการ",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Pengawasan Yudisial atas Arbitrase",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Penyeliaan Kehakiman atas Timbang Tara",
)
ITEMS["CN-JI-0409"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Công ty nước Cộng hòa Nhân dân Trung Hoa (Phần hai)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้พระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 2)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Perseroan Republik Rakyat Tiongkok (Bagian Kedua)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Akta Syarikat Republik Rakyat China (Bahagian Kedua)",
)
ITEMS["CN-JI-0419"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Quyển Hôn nhân và Gia đình của Bộ luật Dân sự nước Cộng hòa Nhân dân Trung Hoa (Phần hai)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้ภาคว่าด้วยการสมรสและครอบครัวแห่งประมวลกฎหมายแพ่งและพาณิชย์แห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Buku Perkawinan dan Keluarga Kitab Undang-Undang Hukum Perdata Republik Rakyat Tiongkok (Bagian Kedua)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Buku Perkahwinan dan Keluarga Kanun Undang-Undang Sivil Republik Rakyat China (Bahagian Kedua)",
)
ITEMS["CN-JI-0474"] = (
    "Một số quy định của Tòa án Nhân dân Tối cao về việc thực hiện nghiêm chế độ thời hạn xét xử vụ án",
    "ข้อกำหนดหลายประการของศาลประชาชนสูงสุดว่าด้วยการบังคับใช้ระบบกำหนดเวลาพิจารณาคดีอย่างเคร่งครัด",
    "Beberapa Ketentuan Mahkamah Rakyat Agung tentang Pelaksanaan Secara Ketat Sistem Tenggang Waktu Pemeriksaan Perkara",
    "Beberapa Peruntukan Mahkamah Rakyat Agung mengenai Pelaksanaan Secara Ketat Sistem Tempoh Pemeriksaan Kes",
)
ITEMS["CN-JI-0501"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thủ tục công dân Trung Quốc xin công nhận phán quyết ly hôn của tòa án nước ngoài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยขั้นตอนการที่พลเมืองจีนขอรับรองคำพิพากษาหย่าของศาลต่างประเทศ",
    "Ketentuan Mahkamah Rakyat Agung tentang Tata Cara Warga Negara Tiongkok Memohon Pengakuan Putusan Perceraian Pengadilan Asing",
    "Peruntukan Mahkamah Rakyat Agung mengenai Tatacara Warganegara China Memohon Pengiktirafan Penghakiman Perceraian Mahkamah Asing",
)
ITEMS["CN-PIA-015"] = (
    "Quy định về biện pháp đơn giản hoá bảo vệ thông tin cá nhân đối với chủ thể xử lý thông tin cá nhân quy mô nhỏ",
    "ข้อกำหนดว่าด้วยมาตรการลดความซับซ้อนในการคุ้มครองข้อมูลส่วนบุคคลของผู้ประมวลผลข้อมูลส่วนบุคคลรายเล็ก",
    "Ketentuan tentang Tata Cara Penyederhanaan Perlindungan Informasi Pribadi bagi Pemroses Informasi Pribadi Skala Kecil",
    "Peruntukan tentang Tatacara Permudahan Perlindungan Maklumat Peribadi bagi Pemproses Maklumat Peribadi Berskala Kecil",
)
ITEMS["CN-PIA-020"] = (
    "Biện pháp quản lý tạm thời đối với dịch vụ trí tuệ nhân tạo tạo sinh",
    "มาตรการบริหารชั่วคราวสำหรับบริการปัญญาประดิษฐ์เชิงกำเนิด",
    "Tata Cara Pengelolaan Sementara Jasa Kecerdasan Artifisial Generatif",
    "Tatacara Pengurusan Sementara Perkhidmatan Kecerdasan Buatan Generatif",
)
ITEMS["CN-REG-0002"] = (
    "Điều lệ về giấy phép an toàn sản xuất",
    "ข้อบังคับว่าด้วยใบอนุญาตความปลอดภัยในการผลิต",
    "Peraturan tentang Izin Keselamatan Produksi",
    "Peraturan mengenai Lesen Keselamatan Pengeluaran",
)
ITEMS["CN-REG-0011"] = (
    "Điều lệ quản lý mai táng, tang lễ",
    "ข้อบังคับว่าด้วยการบริหารการฝังศพและพิธีศพ",
    "Peraturan tentang Pengelolaan Pemakaman dan Upacara Kematian",
    "Peraturan mengenai Pengurusan Pengebumian dan Upacara Kematian",
)
ITEMS["CN-REG-0028"] = (
    "Quy định về quản lý tiết kiệm nước đô thị",
    "ข้อกำหนดว่าด้วยการบริหารการประหยัดน้ำในเขตเมือง",
    "Ketentuan tentang Pengelolaan Penghematan Air Perkotaan",
    "Peruntukan tentang Pengurusan Penjimatan Air Bandar",
)
ITEMS["CN-REG-0042"] = (
    "Điều lệ bảo hiểm tiền gửi",
    "ข้อบังคับว่าด้วยการประกันเงินฝาก",
    "Peraturan tentang Asuransi Simpanan",
    "Peraturan mengenai Insurans Simpanan",
)
ITEMS["CN-REG-0048"] = (
    "Điều lệ công tác địa chí",
    "ข้อบังคับว่าด้วยงานจดหมายเหตุท้องถิ่น",
    "Peraturan tentang Pekerjaan Kronik Daerah",
    "Peraturan mengenai Kerja Kronikel Daerah",
)
ITEMS["CN-REG-0054"] = (
    "Điều lệ quản lý dự báo động đất",
    "ข้อบังคับว่าด้วยการบริหารการพยากรณ์แผ่นดินไหว",
    "Peraturan tentang Pengelolaan Peramalan Gempa Bumi",
    "Peraturan mengenai Pengurusan Ramalan Gempa Bumi",
)
ITEMS["CN-REG-0118"] = (
    "Điều lệ quản lý quảng cáo",
    "ข้อบังคับว่าด้วยการบริหารโฆษณา",
    "Peraturan tentang Pengelolaan Periklanan",
    "Peraturan mengenai Pengurusan Pengiklanan",
)
ITEMS["CN-REG-0144"] = (
    "Quy định của Quốc vụ viện về khuyến khích đầu tư của đồng bào Hoa kiều và đồng bào Hồng Kông, Ma Cao (Trung Quốc)",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการส่งเสริมการลงทุนของชาวจีนโพ้นทะเลและชาวฮ่องกง มาเก๊า (จีน)",
    "Ketentuan Dewan Negara tentang Dorongan Penanaman Modal oleh Warga Tionghoa Perantauan serta Warga Hong Kong dan Makau (Tiongkok)",
    "Peruntukan Majlis Negara mengenai Galakan Pelaburan oleh Warga China Perantauan serta Warga Hong Kong dan Makau (China)",
)
ITEMS["CN-REG-0145"] = (
    "Quy định của Quốc vụ viện về khuyến khích đầu tư của đồng bào Đài Loan (Trung Quốc)",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการส่งเสริมการลงทุนของชาวไต้หวัน (จีน)",
    "Ketentuan Dewan Negara tentang Dorongan Penanaman Modal oleh Warga Taiwan (Tiongkok)",
    "Peruntukan Majlis Negara mengenai Galakan Pelaburan oleh Warga Taiwan (China)",
)
ITEMS["CN-REG-0146"] = (
    "Quy định của Quốc vụ viện về khuyến khích đầu tư, khai thác đảo Hải Nam",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการส่งเสริมการลงทุนและการพัฒนาเกาะไหหลำ",
    "Ketentuan Dewan Negara tentang Dorongan Penanaman Modal dan Pengembangan Pulau Hainan",
    "Peruntukan Majlis Negara mengenai Galakan Pelaburan dan Pembangunan Pulau Hainan",
)
ITEMS["CN-REG-0147"] = (
    "Quy định của Quốc vụ viện về khuyến khích đầu tư nước ngoài",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการส่งเสริมการลงทุนจากต่างประเทศ",
    "Ketentuan Dewan Negara tentang Dorongan Penanaman Modal Asing",
    "Peruntukan Majlis Negara mengenai Galakan Pelaburan Asing",
)
ITEMS["CN-REG-0159"] = (
    "Quy định của Quốc vụ viện về truy cứu trách nhiệm hành chính đối với tai nạn an toàn đặc biệt nghiêm trọng",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการสอบสวนความรับผิดทางปกครองกรณีอุบัติเหตุด้านความปลอดภัยที่ร้ายแรงเป็นพิเศษ",
    "Ketentuan Dewan Negara tentang Penuntutan Tanggung Jawab Administratif atas Kecelakaan Keselamatan yang Sangat Berat",
    "Peruntukan Majlis Negara mengenai Penuntutan Tanggungjawab Pentadbiran bagi Kemalangan Keselamatan yang Amat Berat",
)
ITEMS["CN-REG-0202"] = (
    "Điều lệ về tư cách giáo viên",
    "ข้อบังคับว่าด้วยคุณสมบัติของครู",
    "Peraturan tentang Kualifikasi Guru",
    "Peraturan mengenai Kelayakan Guru",
)
ITEMS["CN-REG-0215"] = (
    "Điều lệ tạm thời về giấy phép cư trú",
    "ข้อบังคับชั่วคราวว่าด้วยใบอนุญาตพำนัก",
    "Peraturan Sementara tentang Izin Tinggal",
    "Peraturan Sementara mengenai Permit Tinggal",
)
ITEMS["CN-REG-0227"] = (
    "Quy định về quản lý thu phí bồi hoàn tài nguyên khoáng sản",
    "ข้อกำหนดว่าด้วยการบริหารการจัดเก็บค่าชดเชยทรัพยากรแร่ธาตุ",
    "Ketentuan tentang Pengelolaan Pemungutan Biaya Kompensasi Sumber Daya Mineral",
    "Peruntukan tentang Pengurusan Pemungutan Bayaran Pampasan Sumber Mineral",
)
ITEMS["CN-REG-0251"] = (
    "Điều lệ về công tác hành chính của hương dân tộc",
    "ข้อบังคับว่าด้วยงานปกครองของตำบลชนชาติ",
    "Peraturan tentang Pekerjaan Administrasi Kecamatan Etnis",
    "Peraturan mengenai Kerja Pentadbiran Mukim Etnik",
)
ITEMS["CN-REG-0259"] = (
    "Điều lệ bảo hộ hành chính đối với sản phẩm hoá chất nông nghiệp",
    "ข้อบังคับว่าด้วยการคุ้มครองทางปกครองสำหรับผลิตภัณฑ์เคมีเกษตร",
    "Peraturan tentang Perlindungan Administratif bagi Produk Bahan Kimia Pertanian",
    "Peraturan mengenai Perlindungan Pentadbiran bagi Produk Bahan Kimia Pertanian",
)
ITEMS["CN-REG-0275"] = (
    "Điều lệ về bảo vệ an ninh trật tự nội bộ doanh nghiệp, đơn vị sự nghiệp",
    "ข้อบังคับว่าด้วยการรักษาความสงบเรียบร้อยภายในวิสาหกิจและหน่วยงานราชการพลเรือน",
    "Peraturan tentang Penjagaan Ketertiban Internal Badan Usaha dan Unit Lembaga Publik",
    "Peraturan mengenai Penjagaan Ketenteraman Dalaman Perusahaan dan Unit Institusi Awam",
)
ITEMS["CN-REG-0276"] = (
    "Điều lệ quản lý phê duyệt và đăng ký đầu tư dự án của doanh nghiệp",
    "ข้อบังคับว่าด้วยการบริหารการอนุมัติและการจดทะเบียนโครงการลงทุนของวิสาหกิจ",
    "Peraturan tentang Pengelolaan Persetujuan dan Pendaftaran Proyek Penanaman Modal Badan Usaha",
    "Peraturan mengenai Pengurusan Kelulusan dan Pendaftaran Projek Pelaburan Perusahaan",
)
ITEMS["CN-REG-0293"] = (
    "Điều lệ quản lý việc tác động nhân tạo đến thời tiết",
    "ข้อบังคับว่าด้วยการบริหารการดัดแปรสภาพอากาศโดยมนุษย์",
    "Peraturan tentang Pengelolaan Modifikasi Cuaca Buatan",
    "Peraturan mengenai Pengurusan Pengubahsuaian Cuaca Buatan",
)
ITEMS["CN-REG-0321"] = (
    "Quy định về việc thực hiện Luật Chống biện pháp trừng phạt nước ngoài nước Cộng hòa Nhân dân Trung Hoa",
    "ข้อกำหนดว่าด้วยการดำเนินการตามพระราชบัญญัติต่อต้านมาตรการลงโทษจากต่างประเทศแห่งสาธารณรัฐประชาชนจีน",
    "Ketentuan tentang Pelaksanaan Undang-Undang Anti-Sanksi Asing Republik Rakyat Tiongkok",
    "Peruntukan tentang Pelaksanaan Undang-Undang Anti-Sanksi Asing Republik Rakyat China",
)
ITEMS["CN-REG-0322"] = (
    "Quy định về việc thực hiện các điều ước quốc tế về quyền tác giả",
    "ข้อกำหนดว่าด้วยการดำเนินการตามสนธิสัญญาระหว่างประเทศว่าด้วยลิขสิทธิ์",
    "Ketentuan tentang Pelaksanaan Perjanjian Internasional tentang Hak Cipta",
    "Peruntukan tentang Pelaksanaan Perjanjian Antarabangsa mengenai Hak Cipta",
)
ITEMS["CN-REG-0328"] = (
    "Điều lệ tạm thời về quản lý đăng ký đơn vị sự nghiệp",
    "ข้อบังคับชั่วคราวว่าด้วยการบริหารการจดทะเบียนหน่วยงานราชการพลเรือน",
    "Peraturan Sementara tentang Pengelolaan Pendaftaran Unit Lembaga Publik",
    "Peraturan Sementara mengenai Pengurusan Pendaftaran Unit Institusi Awam",
)
ITEMS["CN-REG-0340"] = (
    "Điều lệ quản lý các dấu hiệu đặc biệt",
    "ข้อบังคับว่าด้วยการบริหารเครื่องหมายพิเศษ",
    "Peraturan tentang Pengelolaan Tanda Khusus",
    "Peraturan mengenai Pengurusan Tanda Khas",
)
ITEMS["CN-REG-0364"] = (
    "Quy định tạm thời về kỷ luật hành chính đối với hành vi vi phạm chế độ quản lý hai tuyến thu chi các khoản phí hành chính, sự nghiệp và tiền phạt, tiền tịch thu",
    "ข้อกำหนดชั่วคราวว่าด้วยการลงโทษทางปกครองสำหรับการฝ่าฝืนระบบบริหารการรับจ่ายแยกสองทางของค่าธรรมเนียมราชการและรายได้จากการปรับและริบ",
    "Ketentuan Sementara tentang Sanksi Administratif atas Pelanggaran Sistem Pengelolaan Dua Jalur Penerimaan dan Pengeluaran Biaya Administratif serta Denda dan Rampasan",
    "Peruntukan Sementara mengenai Hukuman Pentadbiran bagi Pelanggaran Sistem Pengurusan Dua Laluan Penerimaan dan Perbelanjaan Caj Pentadbiran serta Denda dan Rampasan",
)
ITEMS["CN-REG-0386"] = (
    "Điều lệ xử lý tranh chấp ranh giới địa giới hành chính",
    "ข้อบังคับว่าด้วยการระงับข้อพิพาทเขตแดนทางการปกครอง",
    "Peraturan tentang Penyelesaian Sengketa Batas Wilayah Administratif",
    "Peraturan mengenai Penyelesaian Pertikaian Sempadan Wilayah Pentadbiran",
)
ITEMS["CN-REG-0433"] = (
    "Điều lệ kiểm dịch thực vật",
    "ข้อบังคับว่าด้วยการกักกันพืช",
    "Peraturan tentang Karantina Tumbuhan",
    "Peraturan mengenai Kuarantin Tumbuhan",
)
ITEMS["CN-REG-0443"] = (
    "Biện pháp của Quân Giải phóng Nhân dân Trung Quốc về việc thực hiện Luật Hành nghề y nước Cộng hòa Nhân dân Trung Hoa",
    "มาตรการของกองทัพปลดปล่อยประชาชนจีนว่าด้วยการดำเนินการตามพระราชบัญญัติการประกอบวิชาชีพเวชกรรมแห่งสาธารณรัฐประชาชนจีน",
    "Tata Cara Tentara Pembebasan Rakyat Tiongkok tentang Pelaksanaan Undang-Undang Praktik Kedokteran Republik Rakyat Tiongkok",
    "Tatacara Tentera Pembebasan Rakyat China mengenai Pelaksanaan Undang-Undang Amalan Perubatan Republik Rakyat China",
)
ITEMS["CN-REG-0447"] = (
    "Biện pháp cụ thể của Lực lượng Cảnh sát Vũ trang Nhân dân Trung Quốc về thực hiện chế độ cấp hàm sĩ quan cảnh sát",
    "มาตรการโดยเฉพาะของกองกำลังตำรวจติดอาวุธประชาชนจีนว่าด้วยการใช้ระบบชั้นยศนายตำรวจ",
    "Tata Cara Khusus Kepolisian Bersenjata Rakyat Tiongkok tentang Penerapan Sistem Kepangkatan Perwira Polisi",
    "Tatacara Khas Pasukan Polis Bersenjata Rakyat China mengenai Pelaksanaan Sistem Pangkat Pegawai Polis",
)
ITEMS["CN-REG-0623"] = (
    "Điều lệ về kế toán trưởng",
    "ข้อบังคับว่าด้วยหัวหน้าฝ่ายบัญชี",
    "Peraturan tentang Akuntan Kepala",
    "Peraturan mengenai Akauntan Ketua",
)

with io.open(os.path.join("_work", "title-multi", "_cn_last60.json"), encoding="utf-8") as f:
    rows = json.load(f)
want = [r["id"] for r in rows]
missing = [i for i in want if i not in ITEMS]
extra = [i for i in ITEMS if i not in want]
assert not missing, "缺条目: %s" % missing
assert not extra, "多余条目: %s" % extra

out = {}
for i in want:
    vi, th, iid, ms = ITEMS[i]
    out[i] = {"vi": vi, "th": th, "id": iid, "ms": ms}

doc = {
    "batch": "cn-p1-b31",
    "scope": "CN 补齐 60 部（此前 _cn_rest 区间跳号遗漏）",
    "note": "语义基准 title.zh；港澳台按中国表述；条例=Điều lệ/ข้อบังคับ/Peraturan。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b31.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部" % (dst, len(out)))
