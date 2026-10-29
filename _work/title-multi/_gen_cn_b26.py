# -*- coding: utf-8 -*-
"""CN 第 26 批：_cn_rest.json 第 420–479 条（60 部）。"""
import io, json, os

ITEMS = {}
ZH_FIX = {}

ITEMS["CN-JI-0264"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý vụ án hình sự về việc bịa đặt, cố ý lan truyền thông tin khủng bố giả",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการกุข้อมูลข่าวสารก่อการร้ายอันเป็นเท็จและการจงใจเผยแพร่ข้อมูลดังกล่าว",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Perkara Pidana Perbuatan Mengarang dan Sengaja Menyebarkan Informasi Terorisme Palsu",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perbuatan Mengada-adakan dan Sengaja Menyebarkan Maklumat Keganasan Palsu",
)
ITEMS["CN-JI-0329"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về tội cướp tài sản",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับความผิดฐานปล้นทรัพย์",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perampokan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Rompakan",
)
ITEMS["CN-JI-0376"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về làm giả tiền tệ (Phần hai)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการปลอมแปลงเงินตรา (ฉบับที่ 2)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Pemalsuan Mata Uang (Bagian Kedua)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Pemalsuan Mata Wang (Bahagian Kedua)",
)
ITEMS["CN-JI-0393"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý tranh chấp về giống cây trồng mới",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทเกี่ยวกับพันธุ์พืชใหม่",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Sengketa Varietas Tanaman Baru",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Pertikaian Varieti Tanaman Baharu",
)
ITEMS["CN-JI-0407"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Bảo hiểm nước Cộng hòa Nhân dân Trung Hoa (Phần một)",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายประกันภัยแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Asuransi Republik Rakyat Tiongkok (Bagian Pertama)",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang Insurans Republik Rakyat China (Bahagian Pertama)",
)
ITEMS["CN-JI-0412"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Công ty nước Cộng hòa Nhân dân Trung Hoa (Phần năm)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้พระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 5)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Perseroan Republik Rakyat Tiongkok (Bagian Kelima)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Akta Syarikat Republik Rakyat China (Bahagian Kelima)",
)
ITEMS["CN-JI-0413"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng Luật Công ty nước Cộng hòa Nhân dân Trung Hoa (Phần một)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้พระราชบัญญัติบริษัทแห่งสาธารณรัฐประชาชนจีน (ฉบับที่ 1)",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Undang-Undang Perseroan Republik Rakyat Tiongkok (Bagian Pertama)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Akta Syarikat Republik Rakyat China (Bagian Pertama)",
)
ITEMS["CN-JI-0453"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về tiêu chuẩn tính lãi đối với khoản thanh toán chậm bằng ngoại tệ và tiền tệ của Hồng Kông, Ma Cao, Đài Loan (Trung Quốc)",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยเกณฑ์การคำนวณดอกเบี้ยสำหรับการชำระล่าช้าด้วยเงินตราต่างประเทศและเงินตราของฮ่องกง มาเก๊า และไต้หวัน (จีน)",
    "Jawaban Mahkamah Rakyat Agung tentang Standar Penghitungan Bunga atas Pembayaran Terlambat dalam Valuta Asing dan Mata Uang Hong Kong, Makau serta Taiwan (Tiongkok)",
    "Jawapan Mahkamah Rakyat Agung mengenai Standard Pengiraan Faedah bagi Pembayaran Lewat dalam Mata Wang Asing dan Mata Wang Hong Kong, Makau serta Taiwan (China)",
)
ITEMS["CN-LAW-0007"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về một số vấn đề khi áp dụng Luật Quốc tịch nước Cộng hòa Nhân dân Trung Hoa tại Đặc khu Hành chính Hồng Kông",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยปัญหาหลายประการในการใช้กฎหมายสัญชาติแห่งสาธารณรัฐประชาชนจีนในเขตบริหารพิเศษฮ่องกง",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Beberapa Masalah dalam Penerapan Undang-Undang Kewarganegaraan Republik Rakyat Tiongkok di Daerah Administratif Khusus Hong Kong",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Beberapa Isu dalam Penggunaan Undang-Undang Kewarganegaraan Republik Rakyat China di Wilayah Pentadbiran Khas Hong Kong",
)
ITEMS["CN-JI-0110"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý khi người thân của bị cáo tự nguyện nộp thay tiền phạm tội cho bị cáo",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการเมื่อญาติของจำเลยสมัครใจนำเงินที่ได้จากการกระทำความผิดมาชำระแทนจำเลย",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan ketika Kerabat Terdakwa Secara Sukarela Menyetorkan Uang Hasil Tindak Pidana atas Nama Terdakwa",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian apabila Waris Tertuduh Secara Sukarela Menyetorkan Wang Hasil Jenayah bagi Pihak Tertuduh",
)
ITEMS["CN-JI-0112"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc áp dụng pháp luật về thẩm quyền xét xử một số vụ án dân sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการที่เกี่ยวข้องกับการใช้กฎหมายเกี่ยวกับเขตอำนาจศาลในคดีแพ่งบางประเภท",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penerapan Hukum mengenai Kewenangan Mengadili Sebagian Perkara Perdata",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Penggunaan Undang-Undang tentang Bidang Kuasa Sebahagian Kes Sivil",
)
ITEMS["CN-JI-0134"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc xử lý khiếu nại đối với vụ án hình sự đã được xét xử trước thời kỳ Cách mạng Văn hóa",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการดำเนินการต่อคำร้องเรียนเกี่ยวกับคดีอาญาที่พิพากษาไว้ก่อนยุคปฏิวัติวัฒนธรรม",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Penanganan Permohonan terhadap Perkara Pidana yang Telah Diputus sebelum Masa Revolusi Kebudayaan",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Pengendalian Permohonan terhadap Kes Jenayah yang Telah Dihukum sebelum Zaman Revolusi Kebudayaan",
)
ITEMS["CN-JI-0196"] = (
    "Thỏa thuận bổ sung giữa nội địa Trung Quốc và Đặc khu Hành chính Hồng Kông về việc thi hành lẫn nhau phán quyết trọng tài",
    "ความตกลงเพิ่มเติมระหว่างจีนแผ่นดินใหญ่กับเขตบริหารพิเศษฮ่องกงว่าด้วยการบังคับตามคำชี้ขาดอนุญาโตตุลาการซึ่งกันและกัน",
    "Kesepakatan Tambahan antara Tiongkok Daratan dan Daerah Administratif Khusus Hong Kong tentang Saling Pelaksanaan Putusan Arbitrase",
    "Persetujuan Tambahan antara Tanah Besar China dan Wilayah Pentadbiran Khas Hong Kong mengenai Saling Pelaksanaan Award Timbang Tara",
)
ITEMS["CN-JI-0320"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể áp dụng pháp luật trong xử lý vụ án hình sự về phá hoại công trình viễn thông công cộng",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการใช้กฎหมายในการดำเนินคดีอาญาเกี่ยวกับการทำลายสิ่งอำนวยความสะดวกด้านโทรคมนาคมสาธารณะ",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus Penerapan Hukum dalam Penanganan Perkara Pidana Perusakan Sarana Telekomunikasi Publik",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah Perosakan Kemudahan Telekomunikasi Awam",
)
ITEMS["CN-JI-0380"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề áp dụng pháp luật trong xử lý tranh chấp về dịch vụ quản lý nhà ở",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้กฎหมายในการพิจารณาคดีข้อพิพาทเกี่ยวกับบริการบริหารอาคารที่พักอาศัย",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah Penerapan Hukum dalam Penanganan Sengketa Jasa Pengelolaan Properti",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Penggunaan Undang-Undang dalam Pengendalian Pertikaian Perkhidmatan Pengurusan Harta Tanah",
)
ITEMS["CN-LAW-0006"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về một số vấn đề khi áp dụng Luật Quốc tịch nước Cộng hòa Nhân dân Trung Hoa tại Đặc khu Hành chính Ma Cao",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยปัญหาหลายประการในการใช้กฎหมายสัญชาติแห่งสาธารณรัฐประชาชนจีนในเขตบริหารพิเศษมาเก๊า",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Beberapa Masalah dalam Penerapan Undang-Undang Kewarganegaraan Republik Rakyat Tiongkok di Daerah Administratif Khusus Makau",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Beberapa Isu dalam Penggunaan Undang-Undang Kewarganegaraan Republik Rakyat China di Wilayah Pentadbiran Khas Makau",
)
ITEMS["CN-REG-0005"] = (
    "Quy định về bảo vệ cáp ngầm dưới biển",
    "ข้อกำหนดว่าด้วยการคุ้มครองสายเคเบิลใต้ทะเล",
    "Ketentuan tentang Perlindungan Kabel Bawah Laut",
    "Peruntukan tentang Perlindungan Kabel Dasar Laut",
)
ITEMS["CN-JI-0011"] = (
    "Công hàm trả lời của Tòa án Nhân dân Tối cao và Cục Công tác Tôn giáo Quốc vụ viện về vấn đề xác định quyền sở hữu nhà của chùa, đền đạo",
    "หนังสือตอบกลับของศาลประชาชนสูงสุดและสำนักกิจการศาสนาแห่งคณะรัฐมนตรีว่าด้วยปัญหาการกำหนดกรรมสิทธิ์ในอาคารของวัดและศาลเจ้าเต๋า",
    "Surat Jawaban Mahkamah Rakyat Agung dan Biro Urusan Agama Dewan Negara tentang Masalah Penetapan Kepemilikan Bangunan Kuil dan Kelenteng Tao",
    "Surat Jawapan Mahkamah Rakyat Agung dan Biro Hal Ehwal Agama Majlis Negara mengenai Isu Penetapan Pemilikan Bangunan Tokong dan Kuil Tao",
)
ZH_FIX["CN-JI-0011"] = "最高人民法院、国务院宗教事务局关于寺庙、道观房屋产权归属问题的复函"

ITEMS["CN-JI-0077"] = (
    "Quy định của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về vấn đề hiệu lực về thời gian của giải thích tư pháp hình sự",
    "ข้อกำหนดของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยปัญหาผลใช้บังคับด้านเวลาของคำอธิบายทางตุลาการทางอาญา",
    "Ketentuan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Masalah Kekuatan Berlaku Menurut Waktu Penafsiran Yudisial Pidana",
    "Peruntukan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Isu Kuat Kuasa Mengikut Masa Tafsiran Kehakiman Jenayah",
)
ITEMS["CN-JI-0097"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về hiệu lực hồi tố của Luật Bồi thường nhà nước nước Cộng hòa Nhân dân Trung Hoa và phạm vi thụ lý của ủy ban bồi thường tòa án nhân dân",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยผลย้อนหลังของกฎหมายว่าด้วยการชดเชยแห่งรัฐแห่งสาธารณรัฐประชาชนจีนและขอบเขตการรับคดีของคณะกรรมการชดเชยประจำศาลประชาชน",
    "Jawaban Mahkamah Rakyat Agung tentang Kekuatan Berlaku Surut Undang-Undang Ganti Rugi Negara Republik Rakyat Tiongkok dan Ruang Lingkup Penerimaan Perkara oleh Komite Ganti Rugi Pengadilan Rakyat",
    "Jawapan Mahkamah Rakyat Agung mengenai Kuat Kuasa Kebelakangan Undang-Undang Pampasan Negara Republik Rakyat China dan Lingkup Penerimaan Kes oleh Jawatankuasa Pampasan Mahkamah Rakyat",
)
ITEMS["CN-JI-0144"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề xin ý kiến của Tòa án Nhân dân Cấp cao Thượng Hải và các tòa án khác liên quan đến vụ án giám sát tư pháp đối với phán quyết trọng tài của Ủy ban Trọng tài Kinh tế và Thương mại Quốc tế Trung Quốc cùng các chi hội cũ của ủy ban này",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาการขอคำวินิจฉัยของศาลประชาชนสูงนครเซี่ยงไฮ้และศาลอื่น ๆ เกี่ยวกับคดีกำกับดูแลทางตุลาการต่อคำชี้ขาดอนุญาโตตุลาการของคณะอนุญาโตตุลาการเศรษฐกิจและการค้าระหว่างประเทศจีนและสาขาเดิมของคณะดังกล่าว",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah Permohonan Petunjuk dari Pengadilan Rakyat Tinggi Shanghai dan Pengadilan Lainnya mengenai Perkara Pengawasan Yudisial atas Putusan Arbitrase Komisi Arbitrase Ekonomi dan Perdagangan Internasional Tiongkok serta Cabang Lamanya",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Permohonan Panduan daripada Mahkamah Rakyat Tinggi Shanghai dan Mahkamah Lain Berkaitan Kes Penyeliaan Kehakiman atas Award Timbang Tara Suruhanjaya Timbang Tara Ekonomi dan Perdagangan Antarabangsa China serta Cawangan Lamanya",
)
ITEMS["CN-JI-0170"] = (
    "Quy định của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án của tòa án internet",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีของศาลอินเทอร์เน็ต",
    "Ketentuan Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Pengadilan Internet",
    "Peruntukan Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Mahkamah Internet",
)
ITEMS["CN-JI-0205"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề trong việc xác nhận hiệu lực của thỏa thuận trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการรับรองผลใช้บังคับของข้อตกลงอนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Pengesahan Kekuatan Berlaku Perjanjian Arbitrase",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengesahan Kuat Kuasa Perjanjian Timbang Tara",
)
ITEMS["CN-JI-0244"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề thủ tục liên quan đến vụ án lệnh bảo vệ an toàn thân thể",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการทางขั้นตอนเกี่ยวกับคดีคำสั่งคุ้มครองความปลอดภัยของบุคคล",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah Tata Cara terkait Perkara Perintah Perlindungan Keselamatan Pribadi",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Tatacara Berkaitan Kes Perintah Perlindungan Keselamatan Diri",
)
ITEMS["CN-JI-0395"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong xử lý tranh chấp dân sự về xung đột giữa nhãn hiệu đã đăng ký, tên doanh nghiệp và quyền có trước",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีแพ่งข้อพิพาทเรื่องความขัดแย้งระหว่างเครื่องหมายการค้าที่จดทะเบียนแล้ว ชื่อวิสาหกิจ กับสิทธิที่มีอยู่ก่อน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Sengketa Perdata Pertentangan antara Merek Terdaftar, Nama Perusahaan dan Hak yang Telah Ada Sebelumnya",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Pertikaian Sivil Pertelingkahan antara Cap Dagangan Berdaftar, Nama Perusahaan dan Hak yang Sedia Ada Terdahulu",
)
ITEMS["CN-JI-0459"] = (
    "Công hàm trả lời của Tòa án Nhân dân Tối cao về vấn đề tống đạt văn bản tư pháp cho công dân Trung Quốc cư trú tại nước ngoài",
    "หนังสือตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาการส่งหมายเอกสารทางตุลาการให้แก่พลเมืองจีนที่พำนักอยู่ในต่างประเทศ",
    "Surat Jawaban Mahkamah Rakyat Agung tentang Masalah Penyampaian Dokumen Yudisial kepada Warga Negara Tiongkok yang Berdomisili di Luar Negeri",
    "Surat Jawapan Mahkamah Rakyat Agung mengenai Isu Penyampaian Dokumen Kehakiman kepada Warganegara China yang Bermastautin di Luar Negara",
)
ITEMS["CN-JI-0500"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc thi hành Công ước về Công nhận và Thi hành phán quyết trọng tài nước ngoài mà Trung Quốc đã gia nhập",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการบังคับใช้อนุสัญญาว่าด้วยการรับรองและการบังคับตามคำชี้ขาดอนุญาโตตุลาการต่างประเทศที่จีนเข้าร่วม",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pelaksanaan Konvensi tentang Pengakuan dan Pelaksanaan Putusan Arbitrase Asing yang Telah Diikuti Tiongkok",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Pelaksanaan Konvensyen tentang Pengiktirafan dan Pelaksanaan Award Timbang Tara Asing yang Telah Disertai China",
)
ITEMS["CN-JI-0505"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc chuyển tiếp Thông báo của Bộ Tư pháp về việc tiếp tục ủy thác 23 luật sư Hồng Kông thực hiện công chứng và thay đổi cách thức cấp chứng thư",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการส่งต่อประกาศของกระทรวงยุติธรรมเกี่ยวกับการมอบหมายทนายความฮ่องกงอีก 23 คนให้ดำเนินการรับรองเอกสารและเปลี่ยนวิธีการออกหนังสือรับรอง",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Penerusan Pemberitahuan Kementerian Kehakiman mengenai Penugasan Kembali 23 Pengacara Hong Kong untuk Melakukan Notarisasi dan Perubahan Cara Penerbitan Akta",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Penghantaran Pemberitahuan Kementerian Kehakiman berkenaan Penugasan Semula 23 Peguam Hong Kong untuk Melaksanakan Notari dan Perubahan Cara Pengeluaran Akta",
)
ITEMS["CN-LAW-0009"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về khoản 1 Điều 13 và Điều 19 Luật Cơ bản Đặc khu Hành chính Hồng Kông nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยวรรคหนึ่งของมาตรา 13 และมาตรา 19 แห่งกฎหมายพื้นฐานเขตบริหารพิเศษฮ่องกงแห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Ayat (1) Pasal 13 dan Pasal 19 Undang-Undang Dasar Daerah Administratif Khusus Hong Kong Republik Rakyat Tiongkok",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Fasal (1) Seksyen 13 dan Seksyen 19 Undang-Undang Asas Wilayah Pentadbiran Khas Hong Kong Republik Rakyat China",
)
ITEMS["CN-LAW-0043"] = (
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về việc thành lập tòa án hàng hải tại các thành phố cảng ven biển",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยการจัดตั้งศาลพาณิชย์นาวีในเมืองท่าริมชายฝั่ง",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Pembentukan Pengadilan Maritim di Kota Pelabuhan Pesisir",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Penubuhan Mahkamah Maritim di Bandar Pelabuhan Pesisir",
)
ITEMS["CN-REG-0162"] = (
    "Lệnh của Quốc vụ viện về việc thống nhất thực hiện đơn vị đo lường pháp định tại Trung Quốc",
    "คำสั่งของคณะรัฐมนตรีว่าด้วยการใช้อำนาจทางกฎหมายของหน่วยวัดอย่างเป็นเอกภาพในประเทศจีน",
    "Perintah Dewan Negara tentang Penyelenggaraan Seragam Satuan Ukuran Hukum di Tiongkok",
    "Perintah Majlis Negara mengenai Pelaksanaan Seragam Unit Ukuran Perundangan di China",
)
ITEMS["CN-JI-0012"] = (
    "Thông báo của Tòa án Nhân dân Tối cao và Bộ Công an về vấn đề thẩm phán tòa án hàng hải và các chức danh liên quan lên tàu nước ngoài khi xử lý vụ án hàng hải",
    "ประกาศของศาลประชาชนสูงสุดและกระทรวงความมั่นคงสาธารณะว่าด้วยปัญหาการที่ผู้พิพากษาศาลพาณิชย์นาวีและเจ้าหน้าที่ที่เกี่ยวข้องขึ้นเรือต่างประเทศเมื่อดำเนินคดีพาณิชย์นาวี",
    "Pemberitahuan Mahkamah Rakyat Agung dan Kementerian Keamanan Publik tentang Masalah Hakim Pengadilan Maritim dan Pejabat Terkait Naik ke Kapal Asing ketika Menangani Perkara Maritim",
    "Pemberitahuan Mahkamah Rakyat Agung dan Kementerian Keselamatan Awam mengenai Isu Hakim Mahkamah Maritim dan Pegawai Berkaitan Menaiki Kapal Asing ketika Mengendalikan Kes Maritim",
)
ITEMS["CN-JI-0067"] = (
    "Thông cáo của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc không truy cứu nữa đối với hành vi phạm tội của những người đã đi sang Đài Loan trước khi chính quyền nhân dân địa phương được thành lập sau khi nước Cộng hòa Nhân dân Trung Hoa ra đời",
    "ประกาศของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการไม่ดำเนินคดีต่อไปสำหรับการกระทำความผิดของผู้ที่ไปยังไต้หวันก่อนการจัดตั้งรัฐบาลประชาชนท้องถิ่นภายหลังการสถาปนาสาธารณรัฐประชาชนจีน",
    "Pengumuman Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Tidak Lagi Menuntut Perbuatan Pidana Orang yang Telah Pergi ke Taiwan sebelum Terbentuknya Pemerintahan Rakyat Daerah setelah Berdirinya Republik Rakyat Tiongkok",
    "Pengumuman Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Tidak Lagi Mendakwa Perbuatan Jenayah Orang yang Telah Pergi ke Taiwan sebelum Penubuhan Kerajaan Rakyat Tempatan selepas Penubuhan Republik Rakyat China",
)
ITEMS["CN-JI-0129"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc liệu tòa án cấp phúc thẩm có thể trực tiếp xử phạt hành vi vi phạm pháp luật của đương sự trong quá trình xét xử hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลชั้นอุทธรณ์จะลงโทษการกระทำที่ฝ่าฝืนกฎหมายของคู่ความในระหว่างการพิจารณาคดีได้โดยตรงหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Tingkat Banding Dapat Secara Langsung Menghukum Perbuatan Melanggar Hukum Para Pihak selama Pemeriksaan",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Peringkat Rayuan Boleh Secara Terus Menghukum Perbuatan Melanggar Undang-Undang Para Pihak semasa Perbicaraan",
)
ITEMS["CN-JI-0177"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc liệu đơn vị quân đội với tư cách đương sự trong vụ án tranh chấp kinh tế có thể bị áp dụng biện pháp bảo toàn tố tụng đối với tiền gửi tại ngân hàng và kinh phí quân đội có thể bị cưỡng chế trích chuyển để trả nợ hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าหน่วยทหารในฐานะคู่ความในคดีข้อพิพาททางเศรษฐกิจอาจถูกใช้มาตรการคุ้มครองในกระบวนการพิจารณาคดีต่อเงินฝากในธนาคาร และเงินงบประมาณทหารอาจถูกบังคับโอนเพื่อชำระหนี้ได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Satuan Militer sebagai Pihak dalam Perkara Sengketa Ekonomi Dapat Dikenai Penetapan Penjaminan terhadap Simpanan di Bank dan Apakah Anggaran Militer Dapat Dipindahbukukan Secara Paksa untuk Melunasi Utang",
    "Jawapan Mahkamah Rakyat Agung sama ada Unit Tentera sebagai Pihak dalam Kes Pertikaian Ekonomi Boleh Dikenakan Pemuliharaan Tatacara terhadap Simpanan di Bank dan sama ada Anggaran Tentera Boleh Dipindahkan Secara Paksa untuk Menjelaskan Hutang",
)
ITEMS["CN-JI-0202"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc quyền sử dụng đất được nhà nước giao có thu tiền của doanh nghiệp phá sản có phải đưa vào tài sản phá sản hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าสิทธิการใช้ที่ดินที่รัฐจัดสรรโดยเรียกเก็บค่าตอบแทนของวิสาหกิจที่ล้มละลายต้องรวมอยู่ในทรัพย์สินล้มละลายหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Hak Penggunaan Tanah yang Dialokasikan Negara dengan Pembayaran oleh Badan Usaha Pailit Harus Dimasukkan ke dalam Harta Pailit",
    "Jawapan Mahkamah Rakyat Agung sama ada Hak Penggunaan Tanah yang Diperuntukkan Negara dengan Bayaran oleh Perusahaan Muflis Perlu Dimasukkan dalam Harta Muflis",
)
ITEMS["CN-JI-0215"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về thời điểm có hiệu lực của phán quyết trọng tài tranh chấp lao động sau khi tòa án nhân dân cho phép rút đơn hoặc bác đơn khởi kiện",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยเวลาที่คำชี้ขาดอนุญาโตตุลาการข้อพิพาทแรงงานมีผลใช้บังคับภายหลังศาลประชาชนอนุญาตให้ถอนฟ้องหรือมีคำสั่งยกฟ้อง",
    "Penafsiran Mahkamah Rakyat Agung tentang Saat Mulai Berlakunya Putusan Arbitrase Sengketa Tenaga Kerja setelah Pengadilan Rakyat Mengabulkan Pencabutan Gugatan atau Menolak Gugatan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Masa Berkuat Kuasanya Award Timbang Tara Pertikaian Buruh selepas Mahkamah Rakyat Membenarkan Pengunduran Guaman atau Menolak Guaman",
)
ITEMS["CN-JI-0216"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về việc tòa án nhân dân áp dụng biện pháp bảo toàn tài sản đối với quyền nhãn hiệu đã đăng ký",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการที่ศาลประชาชนใช้มาตรการคุ้มครองทรัพย์สินต่อสิทธิในเครื่องหมายการค้าที่จดทะเบียนแล้ว",
    "Penafsiran Mahkamah Rakyat Agung tentang Penerapan Penetapan Penjaminan Harta oleh Pengadilan Rakyat terhadap Hak Merek Terdaftar",
    "Tafsiran Mahkamah Rakyat Agung mengenai Penggunaan Pemuliharaan Harta oleh Mahkamah Rakyat terhadap Hak Cap Dagangan Berdaftar",
)
ITEMS["CN-JI-0223"] = (
    "Quy định của Tòa án Nhân dân Tối cao về việc tòa án nhân dân có thể áp dụng biện pháp phong tỏa và trích chuyển đối với tiền ký quỹ mở thư tín dụng hay không",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าศาลประชาชนสามารถใช้มาตรการอายัดและโอนเงินหลักประกันการเปิดเลตเตอร์ออฟเครดิตได้หรือไม่",
    "Ketentuan Mahkamah Rakyat Agung tentang Apakah Pengadilan Rakyat Dapat Menerapkan Pembekuan dan Pemindahbukuan atas Jaminan Pembukaan Surat Kredit",
    "Peruntukan Mahkamah Rakyat Agung sama ada Mahkamah Rakyat Boleh Mengenakan Pembekuan dan Pemindahan terhadap Wang Jaminan Pembukaan Surat Kredit",
)
ITEMS["CN-JI-0229"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề trong việc tòa án nhân dân xét xử vụ án tranh chấp nhân sự tại đơn vị sự nghiệp",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการพิจารณาคดีข้อพิพาทด้านบุคลากรในหน่วยงานราชการพลเรือนโดยศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penanganan Perkara Sengketa Kepegawaian pada Unit Lembaga Publik oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Pengendalian Kes Pertikaian Kepegawaian di Unit Institusi Awam oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0230"] = (
    "Quy định của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc tòa án nhân dân thụ lý vụ án yêu cầu công nhận phán quyết ly hôn của tòa án nước ngoài",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการเกี่ยวกับการรับคดีคำขอรับรองคำพิพากษาหย่าของศาลต่างประเทศโดยศาลประชาชน",
    "Ketentuan Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penerimaan Perkara Permohonan Pengakuan Putusan Perceraian Pengadilan Asing oleh Pengadilan Rakyat",
    "Peruntukan Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Penerimaan Kes Permohonan Pengiktirafan Penghakiman Perceraian Mahkamah Asing oleh Mahkamah Rakyat",
)
ITEMS["CN-JI-0254"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề bảo vệ quyền của người tiêu dùng mua nhà ở thương mại",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาการคุ้มครองสิทธิของผู้บริโภคที่ซื้อที่อยู่อาศัยเพื่อการพาณิชย์",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah Perlindungan Hak Konsumen Pembeli Rumah Komersial",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Perlindungan Hak Pengguna Pembeli Rumah Komersial",
)
ITEMS["CN-JI-0272"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc áp dụng pháp luật trong xử lý vụ án phạm tội do đơn vị",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการที่เกี่ยวข้องกับการใช้กฎหมายในการพิจารณาคดีความผิดที่กระทำโดยหน่วยงาน",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penerapan Hukum dalam Penanganan Perkara Tindak Pidana oleh Korporasi",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Penggunaan Undang-Undang dalam Pengendalian Kes Jenayah oleh Korporat",
)
ITEMS["CN-JI-0273"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về một số vấn đề cụ thể trong việc xử lý vụ án đương sự yêu cầu hủy phán quyết trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการโดยเฉพาะในการพิจารณาคดีที่คู่ขอให้เพิกถอนคำชี้ขาดอนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Beberapa Masalah Khusus dalam Penanganan Perkara Permohonan Pembatalan Putusan Arbitrase oleh Para Pihak",
    "Jawapan Mahkamah Rakyat Agung mengenai Beberapa Isu Khusus dalam Pengendalian Kes Permohonan Pembatalan Award Timbang Tara oleh Para Pihak",
)
ITEMS["CN-JI-0288"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề liên quan đến việc áp dụng pháp luật trong xử lý vụ án mua bán phụ nữ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการที่เกี่ยวข้องกับการใช้กฎหมายในการพิจารณาคดีค้ามนุษย์หญิง",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah terkait Penerapan Hukum dalam Penanganan Perkara Perdagangan Perempuan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu Berkaitan Penggunaan Undang-Undang dalam Pengendalian Kes Pemerdagangan Wanita",
)
ITEMS["CN-JI-0356"] = (
    "Quy định của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật đối với vụ án dân sự và thương mại liên quan đến Đài Loan (Trung Quốc)",
    "ข้อกำหนดของศาลประชาชนสูงสุดว่าด้วยปัญหาการใช้กฎหมายในคดีแพ่งและพาณิชย์ที่เกี่ยวข้องกับไต้หวัน (จีน)",
    "Ketentuan Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Perkara Perdata dan Dagang yang Berkaitan dengan Taiwan (Tiongkok)",
    "Peruntukan Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Kes Sivil dan Perdagangan yang Berkaitan dengan Taiwan (China)",
)
ITEMS["CN-JI-0369"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề trong việc xác định đồng phạm trong vụ án tham ô, chiếm đoạt tài sản chức vụ",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการกำหนดผู้ร่วมกระทำความผิดในคดียักยอกทรัพย์และฉ้อฉลทรัพย์สินในตำแหน่งหน้าที่",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penetapan Penyertaan Bersama dalam Perkara Penggelapan dan Pengambilalihan Harta Jabatan",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Penetapan Penyertaan Bersama dalam Kes Penyelewengan dan Pengambilan Harta Jawatan",
)
ITEMS["CN-JI-0441"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về một số vấn đề trong việc áp dụng Điều 12 Bộ luật Hình sự",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้มาตรา 12 แห่งประมวลกฎหมายอาญา",
    "Penafsiran Mahkamah Rakyat Agung tentang Beberapa Masalah dalam Penerapan Pasal 12 Kitab Undang-Undang Hukum Pidana",
    "Tafsiran Mahkamah Rakyat Agung mengenai Beberapa Isu dalam Penggunaan Seksyen 12 Kanun Keseksaan",
)
ITEMS["CN-JI-0461"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về phạm vi áp dụng của giải thích tư pháp mới về cho vay nặng lãi dân sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยขอบเขตการใช้คำอธิบายทางตุลาการฉบับใหม่เกี่ยวกับการกู้ยืมเงินระหว่างบุคคล",
    "Jawaban Mahkamah Rakyat Agung tentang Ruang Lingkup Penerapan Penafsiran Yudisial Baru mengenai Pinjam Meminjam Uang Antarperseorangan",
    "Jawapan Mahkamah Rakyat Agung mengenai Lingkup Penggunaan Tafsiran Kehakiman Baharu berkenaan Pinjam-Meminjam Wang Antara Individu",
)
ITEMS["CN-JI-0485"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về hiệu lực của việc doanh nghiệp đầu tư Hồng Kông, Ma Cao đăng ký thành lập tại nội địa Khu vực Vịnh Lớn Quảng Đông – Hồng Kông – Ma Cao thỏa thuận chọn pháp luật Hồng Kông, Ma Cao làm pháp luật áp dụng cho hợp đồng hoặc thỏa thuận chọn Hồng Kông, Ma Cao làm nơi trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยผลใช้บังคับของการที่วิสาหกิจที่ลงทุนจากฮ่องกงและมาเก๊าซึ่งจดทะเบียนจัดตั้งในจีนแผ่นดินใหญ่ของเขตอ่าวกวางตุ้ง–ฮ่องกง–มาเก๊าตกลงเลือกกฎหมายฮ่องกงหรือมาเก๊าเป็นกฎหมายที่ใช้กับสัญญา หรือตกลงให้ฮ่องกงหรือมาเก๊าเป็นสถานที่อนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Kekuatan Berlaku Persetujuan Badan Usaha Penanaman Modal Hong Kong dan Makau yang Terdaftar di Tiongkok Daratan Kawasan Teluk Guangdong–Hong Kong–Makau untuk Memilih Hukum Hong Kong atau Makau sebagai Hukum yang Berlaku bagi Kontrak atau Menetapkan Hong Kong atau Makau sebagai Tempat Arbitrase",
    "Jawapan Mahkamah Rakyat Agung mengenai Kuat Kuasa Persetujuan Perusahaan Pelaburan Hong Kong dan Makau yang Berdaftar di Tanah Besar China Wilayah Teluk Guangdong–Hong Kong–Makau untuk Memilih Undang-Undang Hong Kong atau Makau sebagai Undang-Undang yang Terpakai bagi Kontrak atau Menetapkan Hong Kong atau Makau sebagai Tempat Timbang Tara",
)
ITEMS["CN-JI-0486"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý khi phạm tội mới trong thời gian thi hành hình phạt bổ sung tước quyền chính trị",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการเมื่อกระทำความผิดใหม่ระหว่างการบังคับโทษเพิ่มเติมฐานตัดสิทธิทางการเมือง",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan ketika Melakukan Tindak Pidana Baru selama Menjalani Hukuman Tambahan Pencabutan Hak Politik",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian apabila Melakukan Jenayah Baharu semasa Menjalani Hukuman Tambahan Perampasan Hak Politik",
)
ITEMS["CN-LAW-0005"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về Điều 7 Phụ lục một và Điều 3 Phụ lục hai Luật Cơ bản Đặc khu Hành chính Ma Cao nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยข้อ 7 ของภาคผนวกหนึ่งและข้อ 3 ของภาคผนวกสองแห่งกฎหมายพื้นฐานเขตบริหารพิเศษมาเก๊าแห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Butir 7 Lampiran Satu dan Butir 3 Lampiran Dua Undang-Undang Dasar Daerah Administratif Khusus Makau Republik Rakyat Tiongkok",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Butiran 7 Lampiran Satu dan Butiran 3 Lampiran Dua Undang-Undang Asas Wilayah Pentadbiran Khas Makau Republik Rakyat China",
)
ITEMS["CN-LAW-0012"] = (
    "Giải thích của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về Điều 14 và Điều 47 Luật Bảo vệ an ninh quốc gia tại Đặc khu Hành chính Hồng Kông nước Cộng hòa Nhân dân Trung Hoa",
    "การตีความของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยมาตรา 14 และมาตรา 47 แห่งกฎหมายว่าด้วยการรักษาความมั่นคงแห่งชาติในเขตบริหารพิเศษฮ่องกงแห่งสาธารณรัฐประชาชนจีน",
    "Penafsiran Komite Tetap Kongres Rakyat Nasional tentang Pasal 14 dan Pasal 47 Undang-Undang Penjagaan Keamanan Nasional di Daerah Administratif Khusus Hong Kong Republik Rakyat Tiongkok",
    "Tafsiran Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Seksyen 14 dan Seksyen 47 Undang-Undang Penjagaan Keselamatan Negara di Wilayah Pentadbiran Khas Hong Kong Republik Rakyat China",
)
ITEMS["CN-LAW-0036"] = (
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về việc ủy quyền cho Đặc khu Hành chính Hồng Kông thực hiện quyền tài phán đối với khu vực cửa khẩu phía Hồng Kông của cửa khẩu Hoàng Cương và khu vực mở rộng liên quan",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยการมอบอำนาจให้เขตบริหารพิเศษฮ่องกงมีเขตอำนาจเหนือพื้นที่ฝั่งฮ่องกงของด่านหวงกังและพื้นที่ขยายที่เกี่ยวข้อง",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Pemberian Wewenang kepada Daerah Administratif Khusus Hong Kong untuk Melaksanakan Yurisdiksi atas Kawasan Pelabuhan Sisi Hong Kong di Pelabuhan Huanggang dan Kawasan Perluasan Terkait",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Pemberian Kuasa kepada Wilayah Pentadbiran Khas Hong Kong untuk Melaksanakan Bidang Kuasa atas Kawasan Pelabuhan Bahagian Hong Kong di Pelabuhan Huanggang dan Kawasan Lanjutan Berkaitan",
)
ITEMS["CN-LAW-0037"] = (
    "Quyết định của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc về việc áp dụng các quy định tạm thời về thuế giá trị gia tăng, thuế tiêu thụ đặc biệt và thuế doanh thu đối với doanh nghiệp có vốn đầu tư nước ngoài và doanh nghiệp nước ngoài",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติว่าด้วยการใช้ข้อกำหนดชั่วคราวเรื่องภาษีมูลค่าเพิ่ม ภาษีบริโภคพิเศษ และภาษีธุรกิจสำหรับวิสาหกิจที่ลงทุนจากต่างประเทศและวิสาหกิจต่างประเทศ",
    "Keputusan Komite Tetap Kongres Rakyat Nasional tentang Penerapan Ketentuan Sementara Pajak Pertambahan Nilai, Pajak Barang Mewah dan Pajak Usaha bagi Badan Usaha Penanaman Modal Asing dan Badan Usaha Asing",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan mengenai Penggunaan Peruntukan Sementara Cukai Nilai Tambah, Cukai Barangan Mewah dan Cukai Perniagaan bagi Perusahaan Pelaburan Asing dan Perusahaan Asing",
)
ITEMS["CN-REG-0164"] = (
    "Quy định của Quốc vụ viện về việc đồng thời treo và sử dụng quốc kỳ và khu kỳ tại Đặc khu Hành chính Hồng Kông",
    "ข้อกำหนดของคณะรัฐมนตรีว่าด้วยการชักและใช้ธงชาติและธงเขตพร้อมกันในเขตบริหารพิเศษฮ่องกง",
    "Ketentuan Dewan Negara tentang Pengibaran dan Penggunaan Bersamaan Bendera Negara dan Bendera Daerah di Daerah Administratif Khusus Hong Kong",
    "Peruntukan Majlis Negara mengenai Pengibaran dan Penggunaan Serentak Bendera Negara dan Bendera Wilayah di Wilayah Pentadbiran Khas Hong Kong",
)
ITEMS["CN-REG-0430"] = (
    "Biện pháp của Hội đồng Chính vụ về việc các cơ quan trực thuộc Chính phủ Nhân dân Trung ương công bố công báo và văn bản mang tính thông cáo",
    "มาตรการของสภาบริหารการปกครองว่าด้วยการประกาศจดหมายเหตุราชการและเอกสารประเภทประกาศของหน่วยงานในสังกัดรัฐบาลประชาชนกลาง",
    "Tata Cara Dewan Administrasi Pemerintahan tentang Penerbitan Berita Resmi dan Dokumen Bersifat Pengumuman oleh Instansi di Bawah Pemerintah Rakyat Pusat",
    "Tatacara Majlis Pentadbiran Kerajaan mengenai Penerbitan Warta Rasmi dan Dokumen Bersifat Pengumuman oleh Agensi di Bawah Kerajaan Rakyat Pusat",
)
ITEMS["CN-JI-0015"] = (
    "Thông báo của Tòa án Nhân dân Tối cao, Viện Kiểm sát Nhân dân Tối cao và Bộ Công an về việc tăng cường giám sát hoạt động thi hành pháp luật trong việc phong tỏa, trích chuyển tiền gửi của doanh nghiệp, đơn vị sự nghiệp, cơ quan, đoàn thể tại ngân hàng và tổ chức tài chính phi ngân hàng",
    "ประกาศของศาลประชาชนสูงสุด อัยการประชาชนสูงสุด และกระทรวงความมั่นคงสาธารณะว่าด้วยการเสริมสร้างการกำกับดูแลการบังคับใช้กฎหมายในการอายัดและโอนเงินฝากของวิสาหกิจ หน่วยงานราชการพลเรือน องค์กร และสมาคมในธนาคารและสถาบันการเงินที่ไม่ใช่ธนาคาร",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung dan Kementerian Keamanan Publik tentang Penguatan Pengawasan Kegiatan Penegakan Hukum dalam Pembekuan dan Pemindahbukuan Simpanan Badan Usaha, Unit Lembaga Publik, Instansi dan Organisasi di Bank serta Lembaga Keuangan Bukan Bank",
    "Pemberitahuan Mahkamah Rakyat Agung, Kejaksaan Rakyat Agung dan Kementerian Keselamatan Awam mengenai Pengukuhan Penyeliaan Kegiatan Penguatkuasaan Undang-Undang dalam Pembekuan dan Pemindahan Simpanan Perusahaan, Unit Institusi Awam, Agensi dan Pertubuhan di Bank serta Institusi Kewangan Bukan Bank",
)
ITEMS["CN-JI-0073"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc định tội và lượng hình đối với hành vi sử dụng ổ đĩa đám mây trên mạng để sản xuất, sao chép, buôn bán, truyền bá thông tin điện tử khiêu dâm nhằm mục đích thu lợi",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการกำหนดฐานความผิดและการกำหนดโทษสำหรับการใช้อุปกรณ์จัดเก็บข้อมูลบนคลาวด์ผ่านเครือข่ายเพื่อผลิต ทำซ้ำ ค้าขาย และเผยแพร่ข้อมูลอิเล็กทรอนิกส์ลามกอนาจารเพื่อแสวงหาผลประโยชน์",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penetapan Tindak Pidana dan Penjatuhan Pidana atas Penggunaan Penyimpanan Awan di Jaringan untuk Memproduksi, Menggandakan, Memperdagangkan dan Menyebarluaskan Informasi Elektronik Cabul untuk Memperoleh Keuntungan",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penetapan Kesalahan dan Penjatuhan Hukuman bagi Penggunaan Storan Awan di Rangkaian untuk Menghasilkan, Menyalin, Menjual dan Menyebarkan Maklumat Elektronik Lucah bagi Mendapatkan Keuntungan",
)
ITEMS["CN-JI-0074"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về việc định tội và lượng hình đối với vụ án hình sự liên quan đến súng hoạt động bằng khí nén và đạn chì của súng hơi",
    "คำตอบกลับของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการกำหนดฐานความผิดและการกำหนดโทษในคดีอาญาที่เกี่ยวข้องกับอาวุธปืนที่ใช้แรงอัดอากาศและลูกปืนตะกั่วของปืนลม",
    "Jawaban Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penetapan Tindak Pidana dan Penjatuhan Pidana dalam Perkara Pidana Terkait Senjata Api Berpenggerak Gas Terkompresi dan Peluru Timah Senapan Angin",
    "Jawapan Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Penetapan Kesalahan dan Penjatuhan Hukuman dalam Kes Jenayah Berkaitan Senjata Api Berpenggerak Gas Mampat dan Peluru Plumbum Senapang Angin",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[420:480]]
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
    "batch": "cn-p1-b26",
    "scope": "CN 第 421–480 部（_cn_rest.json 420–479）",
    "note": "语义基准 title.zh；港澳台一律表述为中国香港、中国澳门、中国台湾（行文用 Hồng Kông (Trung Quốc) 等）。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b26.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部，zh 修正 %d 条" % (dst, len(out), len(ZH_FIX)))
