# -*- coding: utf-8 -*-
"""CN 第 29 批：_cn_rest.json 第 600–659 条（60 部）。"""
import io, json, os

ITEMS = {}
ZH_FIX = {}

ITEMS["CN-JI-0517"] = (
    "Trả lời của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về việc định tội khi trong quá trình phạm tội bắt cóc tống tiền lại có hành vi cướp tài sản đối với cùng một nạn nhân",
    "คำตอบของฝ่ายวิจัยศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดเมื่อในระหว่างการกระทำความผิดฐานลักพาตัวเรียกค่าไถ่มีพฤติการณ์ปล้นทรัพย์ต่อเหยื่อรายเดียวกันด้วย",
    "Jawaban Bagian Penelitian Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana ketika dalam Proses Tindak Pidana Penculikan untuk Pemerasan Terdapat Pula Perbuatan Perampokan terhadap Korban yang Sama",
    "Jawapan Bahagian Penyelidikan Mahkamah Rakyat Agung mengenai Penetapan Kesalahan apabila dalam Proses Kesalahan Penculikan untuk Pemerasan Terdapat Juga Perbuatan Rompakan terhadap Mangsa yang Sama",
)
ITEMS["CN-JI-0518"] = (
    "Trả lời qua điện thoại của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về cách hiểu quy định \"phụ nữ mang thai tại thời điểm xét xử không bị áp dụng hình phạt tử hình\"",
    "คำตอบทางโทรศัพท์ของฝ่ายวิจัยศาลประชาชนสูงสุดว่าด้วยการตีความบทบัญญัติ \"หญิงมีครรภ์ในเวลาพิจารณาคดีไม่ต้องรับโทษประหารชีวิต\"",
    "Jawaban melalui Telepon Bagian Penelitian Mahkamah Rakyat Agung tentang Cara Memahami Ketentuan \"Perempuan Hamil pada Saat Pemeriksaan Perkara Tidak Dikenai Hukuman Mati\"",
    "Jawapan melalui Telefon Bahagian Penyelidikan Mahkamah Rakyat Agung mengenai Cara Memahami Peruntukan \"Wanita Hamil pada Masa Pemeriksaan Kes Tidak Dikenakan Hukuman Mati\"",
)
ITEMS["CN-JI-0519"] = (
    "Trả lời của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về việc viện kiểm sát cấp trên có thể mượn hồ sơ xét xử của tòa án cấp dưới hay không",
    "คำตอบของฝ่ายวิจัยศาลประชาชนสูงสุดว่าสำนักงานอัยการชั้นสูงสามารถขอยืมสำนวนการพิจารณาคดีของศาลชั้นล่างได้หรือไม่",
    "Jawaban Bagian Penelitian Mahkamah Rakyat Agung tentang Apakah Kejaksaan Tingkat Atas Dapat Meminjam Berkas Pemeriksaan Pengadilan Tingkat Bawah",
    "Jawapan Bahagian Penyelidikan Mahkamah Rakyat Agung sama ada Kejaksaan Peringkat Atas Boleh Meminjam Fail Pemeriksaan Mahkamah Peringkat Bawah",
)
ITEMS["CN-JI-0520"] = (
    "Trả lời qua điện thoại của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về cách xác định số tiền lừa đảo trong vụ án Thân Phó Cường phạm tội lừa đảo",
    "คำตอบทางโทรศัพท์ของฝ่ายวิจัยศาลประชาชนสูงสุดว่าด้วยการกำหนดจำนวนเงินฉ้อโกงในคดีเฉินฟู่เฉียงกระทำความผิดฐานฉ้อโกง",
    "Jawaban melalui Telepon Bagian Penelitian Mahkamah Rakyat Agung tentang Cara Menetapkan Jumlah Uang Penipuan dalam Perkara Shen Fuqiang yang Melakukan Tindak Pidana Penipuan",
    "Jawapan melalui Telefon Bahagian Penyelidikan Mahkamah Rakyat Agung mengenai Cara Menetapkan Jumlah Wang Penipuan dalam Kes Shen Fuqiang yang Melakukan Kesalahan Penipuan",
)
ITEMS["CN-JI-0521"] = (
    "Trả lời qua điện thoại của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về việc thời hạn chấp hành án do xét xử oan có được khấu trừ vào hình phạt sau khi bỏ trốn trong thời gian chấp hành án và thực sự phạm tội hay không",
    "คำตอบทางโทรศัพท์ของฝ่ายวิจัยศาลประชาชนสูงสุดว่าระยะเวลารับโทษจากการพิพากษาที่ผิดพลาดสามารถหักกลบกับโทษที่พิพากษาภายหลังได้หรือไม่เมื่อหลบหนีระหว่างรับโทษและกระทำความผิดจริง",
    "Jawaban melalui Telepon Bagian Penelitian Mahkamah Rakyat Agung tentang Apakah Masa Menjalani Pidana akibat Putusan yang Salah Dapat Diperhitungkan terhadap Pidana setelah Kabur selama Menjalani Pidana dan Benar-Benar Melakukan Tindak Pidana",
    "Jawapan melalui Telefon Bahagian Penyelidikan Mahkamah Rakyat Agung sama ada Tempoh Menjalani Hukuman akibat Penghakiman yang Tersalah Boleh Dikira terhadap Hukuman selepas Melarikan Diri semasa Menjalani Hukuman dan Benar-benar Melakukan Kesalahan",
)
ITEMS["CN-JI-0524"] = (
    "Danh mục giải thích tư pháp có liên quan ban hành trước cuối năm 1999 bị Tòa án Nhân dân Tối cao bãi bỏ (đợt thứ ba)",
    "บัญชีคำอธิบายทางตุลาการที่เกี่ยวข้องซึ่งประกาศใช้ก่อนสิ้นปี ค.ศ. 1999 และถูกศาลประชาชนสูงสุดยกเลิก (ชุดที่ 3)",
    "Daftar Penafsiran Yudisial Terkait yang Diterbitkan sebelum Akhir Tahun 1999 dan Dicabut oleh Mahkamah Rakyat Agung (Angkatan Ketiga)",
    "Senarai Tafsiran Kehakiman Berkaitan yang Diterbitkan sebelum Akhir Tahun 1999 dan Dibatal oleh Mahkamah Rakyat Agung (Siri Ketiga)",
)
ITEMS["CN-JI-0525"] = (
    "Danh mục giải thích tư pháp có liên quan ban hành trước cuối năm 2000 bị Tòa án Nhân dân Tối cao bãi bỏ (đợt thứ sáu)",
    "บัญชีคำอธิบายทางตุลาการที่เกี่ยวข้องซึ่งประกาศใช้ก่อนสิ้นปี ค.ศ. 2000 และถูกศาลประชาชนสูงสุดยกเลิก (ชุดที่ 6)",
    "Daftar Penafsiran Yudisial Terkait yang Diterbitkan sebelum Akhir Tahun 2000 dan Dicabut oleh Mahkamah Rakyat Agung (Angkatan Keenam)",
    "Senarai Tafsiran Kehakiman Berkaitan yang Diterbitkan sebelum Akhir Tahun 2000 dan Dibatal oleh Mahkamah Rakyat Agung (Siri Keenam)",
)
ITEMS["CN-JI-0526"] = (
    "Danh mục giải thích tư pháp có liên quan ban hành trước cuối năm 2000 bị Tòa án Nhân dân Tối cao bãi bỏ (đợt thứ tư)",
    "บัญชีคำอธิบายทางตุลาการที่เกี่ยวข้องซึ่งประกาศใช้ก่อนสิ้นปี ค.ศ. 2000 และถูกศาลประชาชนสูงสุดยกเลิก (ชุดที่ 4)",
    "Daftar Penafsiran Yudisial Terkait yang Diterbitkan sebelum Akhir Tahun 2000 dan Dicabut oleh Mahkamah Rakyat Agung (Angkatan Keempat)",
    "Senarai Tafsiran Kehakiman Berkaitan yang Diterbitkan sebelum Akhir Tahun 2000 dan Dibatal oleh Mahkamah Rakyat Agung (Siri Keempat)",
)
ITEMS["CN-JI-0527"] = (
    "Danh mục giải thích tư pháp có liên quan ban hành trước cuối năm 2000 bị Tòa án Nhân dân Tối cao bãi bỏ (đợt thứ năm)",
    "บัญชีคำอธิบายทางตุลาการที่เกี่ยวข้องซึ่งประกาศใช้ก่อนสิ้นปี ค.ศ. 2000 และถูกศาลประชาชนสูงสุดยกเลิก (ชุดที่ 5)",
    "Daftar Penafsiran Yudisial Terkait yang Diterbitkan sebelum Akhir Tahun 2000 dan Dicabut oleh Mahkamah Rakyat Agung (Angkatan Kelima)",
    "Senarai Tafsiran Kehakiman Berkaitan yang Diterbitkan sebelum Akhir Tahun 2000 dan Dibatal oleh Mahkamah Rakyat Agung (Siri Kelima)",
)
ITEMS["CN-JI-0528"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc khi gửi \"Thông báo khởi tố vụ án\" viện kiểm sát nhân dân phải chuyển tài liệu chứng minh cần khởi tố cho cơ quan công an",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าเมื่อส่ง \"หนังสือแจ้งการรับคดี\" สำนักงานอัยการต้องส่งเอกสารที่พิสูจน์ว่าควรรับคดีให้แก่หน่วยงานตำรวจ",
    "Jawaban Kejaksaan Rakyat Agung tentang Kewajiban Kejaksaan Rakyat Menyerahkan Bahan yang Membuktikan Perkara Perlu Disidik kepada Kepolisian ketika Mengirim \"Pemberitahuan Pendaftaran Perkara\"",
    "Jawapan Kejaksaan Rakyat Agung mengenai Kewajipan Kejaksaan Rakyat Menyerahkan Bahan yang Membuktikan Kes Perlu Disiasat kepada Polis ketika Menghantar \"Pemberitahuan Pendaftaran Kes\"",
)
ITEMS["CN-JI-0529"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc \"Danh mục bổ sung các chất ma tuý và chất hướng thần không dùng cho mục đích y tế\" có thể làm căn cứ xác định ma tuý hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่า \"บัญชีเพิ่มเติมประเภทวัตถุเสพติดและวัตถุออกฤทธิ์ต่อจิตประสาทที่ไม่ใช้ทางการแพทย์\" ใช้เป็นหลักฐานยืนยันว่าเป็นวัตถุเสพติดได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah \"Daftar Tambahan Jenis Narkotika dan Psikotropika Nonmedis\" Dapat Menjadi Dasar Penetapan Narkotika",
    "Jawapan Kejaksaan Rakyat Agung sama ada \"Senarai Tambahan Jenis Narkotik dan Psikotropik Bukan Perubatan\" Boleh Menjadi Asas Penetapan Narkotik",
)
ITEMS["CN-JI-0530"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật khi người có liên quan của đơn vị tổ chức, thực hiện hành vi trộm cắp",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายเมื่อผู้เกี่ยวข้องของหน่วยงานจัดระเบียบและดำเนินการกระทำความผิดฐานลักทรัพย์",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum ketika Pihak Terkait pada Suatu Unit Mengorganisasi dan Melaksanakan Perbuatan Pencurian",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang apabila Pihak Berkaitan pada Sesuatu Unit Menganjurkan dan Melaksanakan Perbuatan Kecurian",
)
ITEMS["CN-JI-0531"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc viện khảo sát công trình địa chất và các đơn vị, nhân viên khác thực hiện nhiệm vụ khảo sát có thể là chủ thể tội phạm quy định tại Điều 229 Bộ luật Hình sự hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าสถาบันสำรวจวิศวกรรมธรณีวิทยาและหน่วยงานตลอดจนเจ้าหน้าที่อื่นที่ปฏิบัติหน้าที่สำรวจจะเป็นผู้กระทำความผิดตามมาตรา 229 แห่งประมวลกฎหมายอาญาได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Institut Survei Rekayasa Geologi serta Unit dan Pegawai Lain yang Melaksanakan Tugas Survei Dapat Menjadi Subjek Tindak Pidana menurut Pasal 229 Kitab Undang-Undang Hukum Pidana",
    "Jawapan Kejaksaan Rakyat Agung sama ada Institut Tinjauan Kejuruteraan Geologi serta Unit dan Pegawai Lain yang Melaksanakan Tugas Tinjauan Boleh Menjadi Subjek Kesalahan menurut Seksyen 229 Kanun Keseksaan",
)
ITEMS["CN-JI-0532"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc có thể tiến hành điều tra đối với vụ án đã được trình duyệt yêu cầu phê chuẩn bắt giữ hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าสามารถดำเนินการสอบสวนคดีที่ได้เสนอขออนุมัติจับกุมแล้วได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Penyidikan Dapat Dilakukan terhadap Perkara yang Telah Diajukan untuk Persetujuan Penangkapan",
    "Jawapan Kejaksaan Rakyat Agung sama ada Siasatan Boleh Dijalankan terhadap Kes yang Telah Dikemukakan untuk Kelulusan Penangkapan",
)
ITEMS["CN-JI-0533"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc viện kiểm sát nơi nào thụ lý, thẩm tra khởi tố khi phạm nhân đang chấp hành án được tạm hoãn ngoài trại giam lại phạm tội tại địa phương khác",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าสำนักงานอัยการใดจะเป็นผู้รับและตรวจสอบการฟ้องคดีเมื่อนักโทษที่ได้รับการผ่อนผันให้รับโทษนอกเรือนจำมากระทำความผิดในท้องที่อื่น",
    "Jawaban Kejaksaan Rakyat Agung tentang Kejaksaan Mana yang Menerima dan Memeriksa Penuntutan ketika Terpidana yang Diberi Penangguhan Menjalani Pidana di Luar Lembaga Pemasyarakatan Kembali Melakukan Tindak Pidana di Daerah Lain",
    "Jawapan Kejaksaan Rakyat Agung mengenai Kejaksaan Mana yang Menerima dan Menyemak Pendakwaan apabila Pesalah yang Diberi Penangguhan Menjalani Hukuman di Luar Penjara Kembali Melakukan Kesalahan di Daerah Lain",
)
ITEMS["CN-JI-0534"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng cụ thể Bộ luật Hình sự đối với tội phạm tiếp diễn, tội phạm liên tục và các tội phạm cùng loại khác vắt qua ngày Bộ luật Hình sửa đổi có hiệu lực",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้ประมวลกฎหมายอาญาโดยเฉพาะต่อความผิดที่ต่อเนื่อง ความผิดที่กระทำติดต่อกัน และความผิดหลายกรรมประเภทเดียวกันอื่นที่คาบเกี่ยววันประมวลกฎหมายอาญาฉบับแก้ไขมีผลใช้บังคับ",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Khusus Kitab Undang-Undang Hukum Pidana atas Tindak Pidana Berlanjut, Tindak Pidana Berulang dan Tindak Pidana Sejenis Lainnya yang Melintasi Tanggal Berlakunya Kitab Undang-Undang Hukum Pidana yang Diubah",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Khusus Kanun Keseksaan terhadap Kesalahan Berterusan, Kesalahan Berulang dan Kesalahan Sejenis Lain yang Melangkaui Tarikh Berkuat Kuasanya Kanun Keseksaan yang Dipinda",
)
ITEMS["CN-JI-0535"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi lạm dụng chức vụ, thiếu trách nhiệm của nhân viên cơ quan chủ quản lâm nghiệp ngoài việc cấp giấy phép khai thác gỗ gây thiệt hại nghiêm trọng cho rừng",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการกระทำที่เจ้าหน้าที่หน่วยงานป่าไม้ใช้อำนาจในทางมิชอบหรือละเลยหน้าที่นอกเหนือจากการออกใบอนุญาตตัดไม้จนทำให้ป่าเสียหายร้ายแรง",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Pegawai Badan Kehutanan yang Menyalahgunakan Wewenang atau Lalai dalam Tugas di Luar Penerbitan Izin Penebangan sehingga Menyebabkan Kerusakan Hutan yang Serius",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Pegawai Badan Perhutanan yang Menyalahgunakan Kuasa atau Cuai dalam Tugas di Luar Pengeluaran Lesen Pembalakan sehingga Menyebabkan Kerosakan Hutan yang Serius",
)
ITEMS["CN-JI-0536"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng biện pháp tạm giam hình sự đối với người chưa thành niên dưới mười sáu tuổi bị tình nghi trộm cắp có trái pháp luật hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าการใช้มาตรการควบคุมตัวทางอาญาต่อผู้เยาว์อายุต่ำกว่าสิบหกปีที่ต้องสงสัยลักทรัพย์เป็นความผิดตามกฎหมายหรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Penerapan Penahanan Pidana terhadap Anak di Bawah Enam Belas Tahun yang Disangka Mencuri Merupakan Pelanggaran Hukum",
    "Jawapan Kejaksaan Rakyat Agung sama ada Pengenaan Tahanan Jenayah terhadap Kanak-Kanak Bawah Enam Belas Tahun yang Disyaki Mencuri Merupakan Pelanggaran Undang-Undang",
)
ITEMS["CN-JI-0537"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi kinh doanh trái phép dịch vụ viễn thông quốc tế hoặc dịch vụ viễn thông tại khu vực Hồng Kông, Ma Cao, Đài Loan (Trung Quốc)",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการประกอบธุรกิจบริการโทรคมนาคมระหว่างประเทศหรือบริการโทรคมนาคมในเขตฮ่องกง มาเก๊า และไต้หวัน (จีน) โดยมิชอบ",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Menjalankan Usaha Jasa Telekomunikasi Internasional atau Jasa Telekomunikasi di Wilayah Hong Kong, Makau dan Taiwan (Tiongkok) secara Tidak Sah",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Menjalankan Perniagaan Perkhidmatan Telekomunikasi Antarabangsa atau Perkhidmatan Telekomunikasi di Wilayah Hong Kong, Makau dan Taiwan (China) secara Tidak Sah",
)
ITEMS["CN-JI-0538"] = (
    "Giải thích của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi của công nhân và người không thuộc biên chế cơ quan quản lý giám sát tự ý thả người đang bị giam giữ hoặc thiếu trách nhiệm để người đang bị giam giữ bỏ trốn",
    "การตีความของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการกระทำของกรรมกรและบุคลากรนอกสังกัดหน่วยงานควบคุมที่ปล่อยผู้ถูกควบคุมโดยพลการหรือละเลยหน้าที่จนผู้ถูกควบคุมหลบหนี",
    "Penafsiran Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Pekerja dan Petugas Nonstruktural Badan Pengawasan yang Melepaskan Tahanan secara Sewenang-wenang atau Lalai sehingga Tahanan Kabur",
    "Tafsiran Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Pekerja dan Petugas Bukan Tetap Badan Penyeliaan yang Melepaskan Tahanan secara Sembarangan atau Cuai sehingga Tahanan Melarikan Diri",
)
ITEMS["CN-JI-0539"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật khi công chứng viên cấp giấy chứng nhận công chứng có nội dung sai lệch nghiêm trọng",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายเมื่อทนายรับรองเอกสารออกหนังสือรับรองที่มีเนื้อหาคลาดเคลื่อนอย่างร้ายแรง",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum ketika Notaris Menerbitkan Akta Notaris yang Memuat Isi Sangat Tidak Sesuai Kenyataan",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang apabila Notari Mengeluarkan Akta Notari yang Mengandungi Kandungan Sangat Tidak Tepat",
)
ITEMS["CN-JI-0540"] = (
    "Giải thích của Viện Kiểm sát Nhân dân Tối cao về việc cấu thành tội giao cấu với trẻ em gái chưa thành niên có cần yếu tố chủ quan là biết rõ hay không",
    "การตีความของอัยการประชาชนสูงสุดว่าองค์ประกอบความผิดฐานร่วมประเวณีกับเด็กหญิงผู้เยาว์จำเป็นต้องมีเจตนารู้ข้อเท็จจริงหรือไม่",
    "Penafsiran Kejaksaan Rakyat Agung tentang Apakah Unsur Tindak Pidana Persetubuhan dengan Anak Perempuan di Bawah Umur Memerlukan Unsur Subjektif Berupa Pengetahuan",
    "Tafsiran Kejaksaan Rakyat Agung sama ada Unsur Kesalahan Persetubuhan dengan Kanak-Kanak Perempuan Bawah Umur Memerlukan Unsur Subjektif Berupa Pengetahuan",
)
ITEMS["CN-JI-0541"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc có thể định tội khi nhân viên nhà nước biển thủ vật dụng công không thuộc loại cụ thể hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าสามารถกำหนดความผิดได้หรือไม่เมื่อเจ้าหน้าที่ของรัฐยักยอกสิ่งของของรัฐที่ไม่ใช่ประเภทเฉพาะ",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Tindak Pidana Dapat Ditetapkan ketika Pegawai Negara Menggelapkan Barang Milik Negara yang Bukan Jenis Tertentu",
    "Jawapan Kejaksaan Rakyat Agung sama ada Kesalahan Boleh Ditetapkan apabila Pegawai Negara Menggelapkan Barang Milik Negara yang Bukan Jenis Tertentu",
)
ITEMS["CN-JI-0542"] = (
    "Thông báo của Viện Kiểm sát Nhân dân Tối cao về một số vấn đề áp dụng cụ thể Điều 12 Bộ luật Hình sự sửa đổi trong công tác kiểm sát",
    "ประกาศของอัยการประชาชนสูงสุดว่าด้วยปัญหาหลายประการในการใช้มาตรา 12 แห่งประมวลกฎหมายอาญาฉบับแก้ไขโดยเฉพาะในงานอัยการ",
    "Pemberitahuan Kejaksaan Rakyat Agung tentang Beberapa Masalah Penerapan Khusus Pasal 12 Kitab Undang-Undang Hukum Pidana yang Diubah dalam Pekerjaan Kejaksaan",
    "Pemberitahuan Kejaksaan Rakyat Agung mengenai Beberapa Isu Penggunaan Khusus Seksyen 12 Kanun Keseksaan yang Dipinda dalam Kerja Kejaksaan",
)
ITEMS["CN-JI-0543"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi dùng súng công vụ làm vật thế chấp cho khoản vay nợ",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการนำอาวุธปืนประจำราชการไปค้ำประกันหนี้กู้ยืม",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Menggunakan Senjata Api Dinas sebagai Jaminan Utang",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Menggunakan Senjata Api Tugas sebagai Cagaran Hutang",
)
ITEMS["CN-JI-0544"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc xác định tính chất của hành vi biển thủ trái phiếu kho bạc",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการกำหนดลักษณะของการกระทำยักยอกพันธบัตรคลัง",
    "Jawaban Kejaksaan Rakyat Agung tentang Penetapan Sifat Perbuatan Penggelapan Surat Utang Negara",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penetapan Sifat Perbuatan Penggelapan Bon Perbendaharaan",
)
ITEMS["CN-JI-0545"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi biển thủ quỹ bảo hiểm thất nghiệp và kinh phí bảo đảm đời sống cơ bản của người lao động mất việc",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการกระทำยักยอกกองทุนประกันการว่างงานและเงินประกันการดำรงชีพขั้นพื้นฐานของผู้ใช้แรงงานที่ตกงาน",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Penggelapan Dana Jaminan Pengangguran dan Dana Jaminan Kehidupan Dasar Pekerja yang Kehilangan Pekerjaan",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Penggelapan Dana Jaminan Pengangguran dan Dana Jaminan Kehidupan Asas Pekerja yang Kehilangan Pekerjaan",
)
ITEMS["CN-JI-0546"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc nhân viên của cơ quan công an thuộc doanh nghiệp, đơn vị sự nghiệp trong quá trình cải cách tổ chức có thể là chủ thể tội phạm thiếu trách nhiệm và xâm phạm quyền hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าเจ้าหน้าที่ของหน่วยงานตำรวจสังกัดวิสาหกิจและหน่วยงานราชการพลเรือนในระหว่างการปฏิรูปองค์กรจะเป็นผู้กระทำความผิดฐานละเลยหน้าที่และละเมิดสิทธิได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Pegawai Unit Kepolisian pada Badan Usaha dan Unit Lembaga Publik dalam Proses Reformasi Kelembagaan Dapat Menjadi Subjek Tindak Pidana Kealpaan Tugas dan Pelanggaran Hak",
    "Jawapan Kejaksaan Rakyat Agung sama ada Pegawai Unit Polis pada Perusahaan dan Unit Institusi Awam dalam Proses Reformasi Kelembagaan Boleh Menjadi Subjek Kesalahan Kecuaian Tugas dan Pelanggaran Hak",
)
ITEMS["CN-JI-0547"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi cưỡng bức cho vay",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการกระทำบังคับให้กู้ยืม",
    "Jawaban Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Memaksa Pemberian Pinjaman",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Memaksa Pemberian Pinjaman",
)
ITEMS["CN-JI-0548"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc nhân viên trại cai nghiện bắt buộc có thể là chủ thể tội ngược đãi người bị giám sát hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าเจ้าหน้าที่ศูนย์บำบัดยาเสพติดแบบบังคับจะเป็นผู้กระทำความผิดฐานทารุณกรรมผู้ถูกควบคุมได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Pegawai Panti Rehabilitasi Narkotika Wajib Dapat Menjadi Subjek Tindak Pidana Penganiayaan terhadap Orang yang Diawasi",
    "Jawapan Kejaksaan Rakyat Agung sama ada Pegawai Pusat Pemulihan Narkotik Wajib Boleh Menjadi Subjek Kesalahan Penganiayaan terhadap Orang yang Diselia",
)
ITEMS["CN-JI-0549"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về cách xác định ngày bắt đầu \"trong thời hạn năm năm\" sau khi chấp hành xong hình phạt khi xác định tái phạm",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการกำหนดวันเริ่มต้น \"ภายในห้าปี\" ภายหลังรับโทษครบในการพิจารณาผู้กระทำผิดซ้ำ",
    "Jawaban Kejaksaan Rakyat Agung tentang Cara Menetapkan Hari Mulai \"dalam Jangka Lima Tahun\" setelah Selesai Menjalani Pidana dalam Penetapan Pengulangan Tindak Pidana",
    "Jawapan Kejaksaan Rakyat Agung mengenai Cara Menetapkan Hari Mula \"dalam Tempoh Lima Tahun\" selepas Selesai Menjalani Hukuman dalam Penetapan Pengulangan Kesalahan",
)
ITEMS["CN-JI-0550"] = (
    "Giải thích của Viện Kiểm sát Nhân dân Tối cao về việc áp dụng pháp luật đối với hành vi tự ý bán hàng gia công nhập khẩu đang được bảo thuế",
    "การตีความของอัยการประชาชนสูงสุดว่าด้วยการใช้กฎหมายต่อการจำหน่ายสินค้าที่นำเข้าวัตถุดิบมาแปรรูปและอยู่ในความดูแลทางภาษีโดยพลการ",
    "Penafsiran Kejaksaan Rakyat Agung tentang Penerapan Hukum atas Perbuatan Menjual Barang Olahan Bahan Impor yang Masih Berada dalam Pengawasan Kepabeanan secara Sewenang-wenang",
    "Tafsiran Kejaksaan Rakyat Agung mengenai Penggunaan Undang-Undang atas Perbuatan Menjual Barang Pemprosesan Bahan Import yang Masih Berada dalam Pengawasan Kastam secara Sembarangan",
)
ITEMS["CN-JI-0551"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc truy tố như thế nào khi đơn vị bị tình nghi phạm tội bị giải thể, xóa đăng ký, thu hồi giấy phép kinh doanh hoặc tuyên bố phá sản",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการดำเนินคดีอย่างไรเมื่อหน่วยงานที่ต้องสงสัยว่ากระทำความผิดถูกยุบเลิก เพิกถอนทะเบียน เพิกถอนใบอนุญาตประกอบธุรกิจ หรือถูกประกาศล้มละลาย",
    "Jawaban Kejaksaan Rakyat Agung tentang Cara Penuntutan ketika Badan Usaha yang Disangka Melakukan Tindak Pidana Telah Dibubarkan, Dihapus Pendaftarannya, Dicabut Izin Usahanya atau Dinyatakan Pailit",
    "Jawapan Kejaksaan Rakyat Agung mengenai Cara Pendakwaan apabila Perusahaan yang Disyaki Melakukan Kesalahan Telah Dibubarkan, Dihapus Pendaftarannya, Ditarik Balik Lesen Perniagaannya atau Diisytiharkan Muflis",
)
ITEMS["CN-JI-0553"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc xác định tính chất hành vi nhặt được thẻ tín dụng của người khác và sử dụng tại máy ATM",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการกำหนดลักษณะการกระทำที่เก็บได้ซึ่งบัตรเครดิตของผู้อื่นแล้วนำไปใช้ที่ตู้เอทีเอ็ม",
    "Jawaban Kejaksaan Rakyat Agung tentang Penetapan Sifat Perbuatan Menemukan Kartu Kredit Milik Orang Lain dan Menggunakannya di Mesin ATM",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penetapan Sifat Perbuatan Menjumpai Kad Kredit Milik Orang Lain dan Menggunakannya di Mesin ATM",
)
ITEMS["CN-JI-0554"] = (
    "Ý kiến của Viện Kiểm sát Nhân dân Tối cao về tội danh các tội phạm quy định tại phần riêng Bộ luật Hình sự",
    "ความเห็นของอัยการประชาชนสูงสุดว่าด้วยฐานความผิดของความผิดที่กำหนดในภาคเฉพาะของประมวลกฎหมายอาญา",
    "Pendapat Kejaksaan Rakyat Agung tentang Nama Tindak Pidana yang Diatur dalam Bagian Khusus Kitab Undang-Undang Hukum Pidana",
    "Pendapat Kejaksaan Rakyat Agung mengenai Nama Kesalahan yang Diperuntukkan dalam Bahagian Khas Kanun Keseksaan",
)
ITEMS["CN-JI-0555"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc biển thủ quỹ bảo hiểm xã hội như quỹ hưu trí, quỹ y tế có thể áp dụng khoản 2 Điều 1 Giải thích của Tòa án Nhân dân Tối cao và Viện Kiểm sát Nhân dân Tối cao về xử lý vụ án hình sự tham nhũng, hối lộ hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าการยักยอกกองทุนประกันสังคม เช่น กองทุนบำนาญและกองทุนรักษาพยาบาล จะใช้ความในวรรคสองมาตรา 1 ของการตีความของศาลประชาชนสูงสุดและอัยการประชาชนสูงสุดว่าด้วยการพิจารณาคดีอาญาฐานทุจริตและให้สินบนได้หรือไม่",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Penggelapan Dana Jaminan Sosial seperti Dana Pensiun dan Dana Kesehatan Dapat Menerapkan Ayat (2) Pasal 1 Penafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung tentang Penanganan Perkara Pidana Korupsi dan Suap",
    "Jawapan Kejaksaan Rakyat Agung sama ada Penggelapan Dana Jaminan Sosial seperti Dana Pencen dan Dana Kesihatan Boleh Menggunakan Fasal (2) Seksyen 1 Tafsiran Mahkamah Rakyat Agung dan Kejaksaan Rakyat Agung mengenai Pengendalian Kes Jenayah Rasuah dan Suapan",
)
ZH_FIX["CN-JI-0555"] = "最高人民检察院关于贪污养老、医疗等社会保险基金能否适用《最高人民法院、最高人民检察院关于办理贪污贿赂刑事案件适用法律若干问题的解释》第一条第二款第一项规定的批复"

ITEMS["CN-JI-0556"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về cách tính thời hạn thẩm tra khởi tố khi lần lượt thụ lý vụ án cùng một người bị tình nghi phạm tội về chức vụ và tội phạm khác",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยวิธีนับกำหนดเวลาตรวจสอบการฟ้องคดีเมื่อรับคดีของผู้ต้องสงสัยรายเดียวกันที่ถูกสงสัยว่ากระทำความผิดเกี่ยวกับหน้าที่และความผิดอื่นตามลำดับ",
    "Jawaban Kejaksaan Rakyat Agung tentang Cara Menghitung Tenggang Waktu Pemeriksaan Penuntutan ketika Secara Berurutan Menerima Perkara Tersangka yang Sama atas Dugaan Tindak Pidana Jabatan dan Tindak Pidana Lain",
    "Jawapan Kejaksaan Rakyat Agung mengenai Cara Mengira Tempoh Pemeriksaan Pendakwaan apabila Secara Berturutan Menerima Kes Orang Yang Disyaki yang Sama atas Syak Kesalahan Jawatan dan Kesalahan Lain",
)
ITEMS["CN-JI-0557"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc Viện Kiểm sát Nhân dân Binh đoàn Sản xuất và Xây dựng Tân Cương giám sát pháp luật đối với vụ án do phân hiệu Binh đoàn thuộc Tòa án Nhân dân Cấp cao Khu tự trị Duy Ngô Nhĩ Tân Cương xét xử",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าด้วยการที่อัยการประชาชนกองพลผลิตและก่อสร้างซินเจียงกำกับดูแลทางกฎหมายต่อคดีที่ศาลสาขากองพลในศาลประชาชนสูงแห่งเขตปกครองตนเองอุยกูร์ซินเจียงพิจารณา",
    "Jawaban Kejaksaan Rakyat Agung tentang Pengawasan Hukum oleh Kejaksaan Rakyat Korps Produksi dan Konstruksi Xinjiang atas Perkara yang Diperiksa Cabang Korps pada Pengadilan Rakyat Tinggi Daerah Otonom Uighur Xinjiang",
    "Jawapan Kejaksaan Rakyat Agung mengenai Penyeliaan Undang-Undang oleh Kejaksaan Rakyat Kor Pembangunan dan Pengeluaran Xinjiang atas Kes yang Dibelan Cawangan Kor pada Mahkamah Rakyat Tinggi Wilayah Autonomi Uyghur Xinjiang",
)
ITEMS["CN-JI-0558"] = (
    "Phúc đáp của Viện Kiểm sát Nhân dân Tối cao về việc có thể xử lý người xâm hại theo tội cản trở thi hành công vụ khi dùng vũ lực, đe dọa cản trở nhân viên biên chế sự nghiệp thực hiện nhiệm vụ hành chính theo pháp luật hay không",
    "คำตอบกลับของอัยการประชาชนสูงสุดว่าสามารถดำเนินคดีกับผู้กระทำการตามความผิดฐานขัดขวางการปฏิบัติราชการได้หรือไม่เมื่อใช้กำลังหรือข่มขู่ขัดขวางเจ้าหน้าที่ในสังกัดหน่วยงานราชการพลเรือนมิให้ปฏิบัติหน้าที่ทางปกครองตามกฎหมาย",
    "Jawaban Kejaksaan Rakyat Agung tentang Apakah Pelaku Dapat Diproses dengan Tindak Pidana Penghambatan Pelaksanaan Tugas ketika Menggunakan Kekerasan atau Ancaman untuk Menghambat Pegawai Unit Lembaga Publik Melaksanakan Tugas Administratif menurut Hukum",
    "Jawapan Kejaksaan Rakyat Agung sama ada Pelaku Boleh Diproses di bawah Kesalahan Penghalangan Pelaksanaan Tugas apabila Menggunakan Keganasan atau Ugutan untuk Menghalang Pegawai Unit Institusi Awam Melaksanakan Tugas Pentadbiran menurut Undang-Undang",
)
ITEMS["CN-LAW-0002"] = (
    "Nghị quyết của Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc khóa năm về việc phê chuẩn Quy định tạm thời của Quốc vụ viện về việc cán bộ lão thành nghỉ việc, nghỉ hưu",
    "มติของคณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติชุดที่ 5 ว่าด้วยการให้ความเห็นชอบข้อกำหนดชั่วคราวของคณะรัฐมนตรีเกี่ยวกับการลาออกจากตำแหน่งและการเกษียณอายุของเจ้าหน้าที่อาวุโส",
    "Keputusan Komite Tetap Kongres Rakyat Nasional Masa Kelima tentang Persetujuan Ketentuan Sementara Dewan Negara mengenai Pemberhentian dan Pensiun Pegawai Senior",
    "Keputusan Jawatankuasa Tetap Kongres Rakyat Kebangsaan Penggal Kelima mengenai Kelulusan Peruntukan Sementara Majlis Negara berkenaan Pemberhentian dan Persaraan Pegawai Kanan",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[600:640]]
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
    "batch": "cn-p1-b29",
    "scope": "CN 第 601–640 部（_cn_rest.json 600–639）",
    "note": "语义基准 title.zh；最高人民检察院单独解释统一用 Viện Kiểm sát Nhân dân Tối cao / อัยการประชาชนสูงสุด / Kejaksaan Rakyat Agung。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b29.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部，zh 修正 %d 条" % (dst, len(out), len(ZH_FIX)))
