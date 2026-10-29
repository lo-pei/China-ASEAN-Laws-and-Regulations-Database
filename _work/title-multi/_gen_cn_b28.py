# -*- coding: utf-8 -*-
"""CN 第 28 批：_cn_rest.json 第 540–599 条（60 部）。"""
import io, json, os

ITEMS = {}

ITEMS["CN-JI-0153"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc bãi bỏ một số giải thích tư pháp ban hành trong giai đoạn 1979–1989",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการยกเลิกคำอธิบายทางตุลาการบางฉบับที่ประกาศใช้ระหว่างปี ค.ศ. 1979–1989",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pencabutan Sebagian Penafsiran Yudisial yang Diterbitkan pada 1979–1989",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Pembatalan Sebahagian Tafsiran Kehakiman yang Diterbitkan pada 1979–1989",
)
ITEMS["CN-JI-0154"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc bãi bỏ một số giải thích tư pháp ban hành trước cuối năm 1993",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการยกเลิกคำอธิบายทางตุลาการบางฉบับที่ประกาศใช้ก่อนสิ้นปี ค.ศ. 1993",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pencabutan Sebagian Penafsiran Yudisial yang Diterbitkan sebelum Akhir Tahun 1993",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Pembatalan Sebahagian Tafsiran Kehakiman yang Diterbitkan sebelum Akhir Tahun 1993",
)
ITEMS["CN-JI-0155"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc thanh lý doanh nghiệp cá nhân có thể áp dụng tương tự thủ tục thanh lý phá sản theo Luật Phá sản doanh nghiệp hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าการชำระบัญชีวิสาหกิจส่วนบุคคลจะใช้ขั้นตอนชำระบัญชีล้มละลายตามกฎหมายล้มละลายวิสาหกิจโดยอนุโลมได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Likuidasi Badan Usaha Perorangan Dapat Menerapkan Secara Analogi Tata Cara Likuidasi Kepailitan menurut Undang-Undang Kepailitan Badan Usaha",
    "Jawapan Mahkamah Rakyat Agung sama ada Pembubaran Perusahaan Persendirian Boleh Menggunakan Secara Analogi Tatacara Pembubaran Kebankrapan menurut Undang-Undang Kebankrapan Perusahaan",
)
ITEMS["CN-JI-0157"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về mức thu phí thụ lý vụ án tranh chấp giải thể công ty",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยอัตราค่าธรรมเนียมการรับคดีข้อพิพาทเรื่องการเลิกบริษัท",
    "Jawaban Mahkamah Rakyat Agung tentang Standar Biaya Pendaftaran Perkara Sengketa Pembubaran Perseroan",
    "Jawapan Mahkamah Rakyat Agung mengenai Standard Fi Pendaftaran Kes Pertikaian Pembubaran Syarikat",
)
ITEMS["CN-JI-0159"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc bên bán giữ quyền sở hữu xe mua trả góp không phải chịu trách nhiệm dân sự khi người mua dùng xe kinh doanh vận tải gây thiệt hại tài sản do tai nạn giao thông",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าผู้ขายที่ยังคงกรรมสิทธิ์รถที่ซื้อด้วยการผ่อนชำระไม่ต้องรับผิดทางแพ่งเมื่อผู้ซื้อนำรถไปประกอบกิจการขนส่งและก่อความเสียหายต่อทรัพย์สินจากอุบัติเหตุจราจร",
    "Jawaban Mahkamah Rakyat Agung tentang Penjual yang Mempertahankan Hak Milik atas Kendaraan yang Dibeli Secara Angsuran Tidak Bertanggung Jawab Perdata ketika Pembeli Menggunakan Kendaraan untuk Usaha Angkutan dan Menimbulkan Kerugian Harta akibat Kecelakaan Lalu Lintas",
    "Jawapan Mahkamah Rakyat Agung mengenai Penjual yang Kekal Memegang Hak Milik atas Kenderaan yang Dibeli Secara Ansuran Tidak Bertanggungjawab Sivil apabila Pembeli Menggunakan Kenderaan untuk Perniagaan Pengangkutan dan Menyebabkan Kerugian Harta akibat Kemalangan Jalan Raya",
)
ITEMS["CN-JI-0160"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý hành vi nhận tài sản sau khi nghỉ hưu của nhân viên nhà nước đã lợi dụng chức vụ để mang lại lợi ích cho người khác",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการต่อการรับทรัพย์สินภายหลังเกษียณอายุของเจ้าหน้าที่ของรัฐซึ่งได้ใช้อำนาจหน้าที่เอื้อประโยชน์แก่ผู้อื่น",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Perbuatan Menerima Harta setelah Pensiun oleh Pegawai Negara yang Menyalahgunakan Jabatan untuk Memberi Keuntungan kepada Pihak Lain",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Perbuatan Menerima Harta selepas Bersara oleh Pegawai Negara yang Menyalahgunakan Jawatan untuk Memberi Faedah kepada Pihak Lain",
)
ITEMS["CN-JI-0163"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật đối với tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất khai hoang thuộc đất nhà nước được dùng vào canh tác",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายในข้อพิพาทสัญญาโอนสิทธิการใช้ที่ดินที่รัฐเป็นเจ้าของซึ่งได้รับการบุกเบิกแล้วนำไปใช้เพาะปลูก",
    "Jawaban Mahkamah Rakyat Agung tentang Penerapan Hukum dalam Sengketa Perjanjian Pengalihan Hak Penggunaan Tanah Milik Negara yang Telah Dibuka dan Digunakan untuk Pertanian",
    "Jawapan Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang dalam Pertikaian Persetujuan Pemindahan Hak Penggunaan Tanah Milik Negara yang Telah Diteroka dan Digunakan untuk Pertanian",
)
ITEMS["CN-JI-0164"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án hành chính về quản lý quyền tài sản nhà nước",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีปกครองเกี่ยวกับการบริหารสิทธิในทรัพย์สินของรัฐ",
    "Penafsiran Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Tata Usaha Negara mengenai Pengelolaan Hak atas Harta Negara",
    "Tafsiran Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Pentadbiran berkenaan Pengurusan Hak atas Harta Negara",
)
ITEMS["CN-JI-0165"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về thẩm quyền xét xử vụ án kiện quyết định xử phạt hành chính của hải quan",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในคดีฟ้องคำวินิจฉัยลงโทษทางปกครองของศุลกากร",
    "Penafsiran Mahkamah Rakyat Agung tentang Kewenangan Mengadili Perkara Gugatan atas Keputusan Sanksi Administratif Bea dan Cukai",
    "Tafsiran Mahkamah Rakyat Agung mengenai Bidang Kuasa Kes Guaman terhadap Keputusan Penalti Pentadbiran Kastam",
)
ITEMS["CN-JI-0166"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về ngày bắt đầu tính thời hiệu khởi kiện khi người bảo hiểm hợp đồng bảo hiểm hàng hải thực hiện quyền yêu cầu bồi thường thay thế",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวันที่เริ่มนับอายุความฟ้องคดีเมื่อผู้รับประกันภัยตามสัญญาประกันภัยทางทะเลใช้สิทธิเรียกร้องค่าชดเชยแทน",
    "Jawaban Mahkamah Rakyat Agung tentang Hari Mulai Penghitungan Tenggang Daluwarsa Gugatan ketika Penanggung Asuransi Laut Melaksanakan Hak Tuntutan Ganti Rugi Subrogasi",
    "Jawapan Mahkamah Rakyat Agung mengenai Hari Mula Pengiraan Tempoh Had Guaman apabila Penanggung Insurans Marin Melaksanakan Hak Tuntutan Pampasan Subrogasi",
)
ITEMS["CN-JI-0167"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án hàng hải có thể áp dụng thủ tục tố tụng theo vụ án nhỏ hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลพาณิชย์นาวีสามารถใช้ขั้นตอนคดีมูลค่าเล็กได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Maritim Dapat Menerapkan Tata Cara Gugatan Nilai Kecil",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Maritim Boleh Menggunakan Tatacara Tuntutan Nilai Kecil",
)
ITEMS["CN-JI-0172"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật đối với điều kiện xin tạm ứng từ quỹ bảo hiểm y tế cơ bản",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายเกี่ยวกับเงื่อนไขการขอเบิกจ่ายล่วงหน้าจากกองทุนประกันสุขภาพขั้นพื้นฐาน",
    "Jawaban Mahkamah Rakyat Agung tentang Penerapan Hukum atas Syarat Permohonan Pembayaran di Muka dari Dana Jaminan Kesehatan Dasar",
    "Jawapan Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang bagi Syarat Permohonan Bayaran Pendahuluan daripada Dana Jaminan Kesihatan Asas",
)
ITEMS["CN-JI-0178"] = (
    "Công hàm trả lời của Tòa án Nhân dân Tối cao về việc tòa án có thụ lý tranh chấp yêu cầu cán bộ quân đội đã nghỉ hưu trả lại nhà thuộc tài sản quân đội hay không",
    "หนังสือตอบกลับของศาลประชาชนสูงสุดว่าศาลจะรับคดีข้อพิพาทที่เรียกร้องให้เจ้าหน้าที่ทหารเกษียณคืนอาคารซึ่งเป็นทรัพย์สินของกองทัพหรือไม่",
    "Surat Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Menerima Sengketa yang Menuntut Pejabat Militer Pensiunan Mengembalikan Rumah Milik Harta Militer",
    "Surat Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Menerima Pertikaian yang Menuntut Pegawai Tentera Bersara Memulangkan Rumah Milik Harta Tentera",
)
ITEMS["CN-JI-0182"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về phạm vi đại diện của người đại diện theo ủy quyền trong tố tụng dân sự tại thủ tục thi hành án",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยขอบเขตอำนาจของตัวแทนรับมอบอำนาจในกระบวนการพิจารณาคดีแพ่งในขั้นตอนการบังคับคดี",
    "Jawaban Mahkamah Rakyat Agung tentang Ruang Lingkup Kuasa Kuasa Hukum dalam Peradilan Perdata pada Tata Cara Pelaksanaan",
    "Jawapan Mahkamah Rakyat Agung mengenai Lingkup Kuasa Wakil Berkuasa dalam Kehakiman Sivil pada Tatacara Pelaksanaan",
)
ITEMS["CN-JI-0197"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có thể định giá quyền sử dụng đất nhà nước để trừ vào nợ cho người nhận thế chấp hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าสามารถตีราคาสิทธิการใช้ที่ดินของรัฐเพื่อหักชำระหนี้ให้แก่ผู้รับจำนองได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Hak Penggunaan Tanah Negara Dapat Dinilai untuk Diperhitungkan sebagai Pelunasan Utang kepada Pemegang Hipotek",
    "Jawapan Mahkamah Rakyat Agung sama ada Hak Penggunaan Tanah Negara Boleh Dinilai untuk Dikira sebagai Penjelasan Hutang kepada Pemegang Gadai Janji",
)
ITEMS["CN-JI-0198"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách tính thời hạn truy cứu đối với tội tham ô, biển thủ công quỹ",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีคำนวณอายุความในการดำเนินคดีฐานยักยอกเงินหลวง",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Penghitungan Tenggang Waktu Penuntutan atas Tindak Pidana Penggelapan Dana Publik",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Pengiraan Tempoh Pendakwaan bagi Kesalahan Penggelapan Dana Awam",
)
ITEMS["CN-JI-0199"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án có thụ lý đơn yêu cầu xét xử lại của người nhận chuyển nhượng quyền yêu cầu sau khi bản án có hiệu lực hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลจะรับคำขอให้พิจารณาคดีใหม่ของผู้รับโอนสิทธิเรียกร้องภายหลังคำพิพากษามีผลใช้บังคับหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Menerima Permohonan Pemeriksaan Ulang oleh Penerima Pengalihan Hak Tuntutan setelah Putusan Berkekuatan Hukum Tetap",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Menerima Permohonan Semakan Semula oleh Penerima Pemindahan Hak Tuntutan selepas Penghakiman Berkuat Kuasa",
)
ITEMS["CN-JI-0200"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có áp dụng nguyên tắc tổng hợp hình phạt khi sau khi tuyên án phát hiện tội phạm cùng loại bị bỏ sót của người bị kết án hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าหลักการลงโทษรวมจะใช้เมื่อภายหลังการอ่านคำพิพากษาพบว่าผู้ถูกพิพากษากระทำความผิดประเภทเดียวกันที่ยังไม่ได้วินิจฉัยหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Prinsip Penggabungan Pidana Diterapkan ketika setelah Pembacaan Putusan Ditemukan Tindak Pidana Sejenis yang Terlewat oleh Terpidana",
    "Jawapan Mahkamah Rakyat Agung sama ada Prinsip Penggabungan Hukuman Digunakan apabila selepas Penghakiman Dibacakan Didapati Kesalahan Sejenis yang Tersalah oleh Pesalah",
)
ITEMS["CN-JI-0201"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý hồ sơ vụ án oan sai đã được cải chính, minh oan",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการจัดการสำนวนคดีที่พิพากษาผิดพลาดและได้รับการแก้ไขและล้างมลทินแล้ว",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Berkas Perkara yang Salah dan Telah Diperbaiki serta Dibersihkan Namanya",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Fail Kes yang Tersalah dan Telah Diperbetulkan serta Dibersihkan Namanya",
)
ITEMS["CN-JI-0203"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc định tội đối với hành vi cố ý giết người trong quá trình cướp tài sản",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดต่อการกระทำฆ่าผู้อื่นโดยเจตนาในระหว่างการปล้นทรัพย์",
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana atas Perbuatan Pembunuhan dengan Sengaja dalam Proses Perampokan",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Kesalahan atas Perbuatan Membunuh dengan Sengaja semasa Proses Rompakan",
)
ITEMS["CN-JI-0213"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc không thụ lý kháng nghị của Viện Kiểm sát chỉ đối với quyết định về nghĩa vụ chịu án phí",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการไม่รับคำคัดค้านของอัยการที่คัดค้านเฉพาะคำสั่งเกี่ยวกับภาระค่าธรรมเนียมศาล",
    "Jawaban Mahkamah Rakyat Agung tentang Tidak Diterimanya Perlawanan Kejaksaan yang Hanya Ditujukan pada Penetapan mengenai Beban Biaya Perkara",
    "Jawapan Mahkamah Rakyat Agung mengenai Tidak Diterimanya Bantahan Kejaksaan yang Hanya Ditujukan pada Penetapan berkenaan Beban Kos Kes",
)
ITEMS["CN-JI-0226"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc áp dụng tiêu chuẩn bồi thường tự do thân thể khi ủy ban bồi thường sửa đổi quyết định đã có hiệu lực theo Điều 30 Luật Bồi thường nhà nước",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการใช้เกณฑ์ชดเชยเสรีภาพของบุคคลเมื่อคณะกรรมการชดเชยแก้ไขคำวินิจฉัยที่มีผลใช้บังคับแล้วตามมาตรา 30 แห่งกฎหมายว่าด้วยการชดเชยแห่งรัฐ",
    "Jawaban Mahkamah Rakyat Agung tentang Penerapan Standar Ganti Rugi Kebebasan Pribadi ketika Komite Ganti Rugi Memperbaiki Keputusan yang Telah Berlaku menurut Pasal 30 Undang-Undang Ganti Rugi Negara",
    "Jawapan Mahkamah Rakyat Agung mengenai Penggunaan Standard Pampasan Kebebasan Diri apabila Jawatankuasa Pampasan Membetulkan Keputusan yang Telah Berkuat Kuasa menurut Seksyen 30 Undang-Undang Pampasan Negara",
)
ITEMS["CN-JI-0241"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án có thụ lý kháng nghị của Viện Kiểm sát đối với quyết định dân sự không hủy phán quyết trọng tài hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลจะรับคำคัดค้านของอัยการต่อคำสั่งทางแพ่งที่ไม่เพิกถอนคำชี้ขาดอนุญาโตตุลาการหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Menerima Perlawanan Kejaksaan atas Penetapan Perdata yang Tidak Membatalkan Putusan Arbitrase",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Menerima Bantahan Kejaksaan terhadap Penetapan Sivil yang Tidak Membatalkan Award Timbang Tara",
)
ITEMS["CN-JI-0242"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý kháng nghị của Viện Kiểm sát đối với quyết định dân sự hủy phán quyết trọng tài",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการต่อคำคัดค้านของอัยการต่อคำสั่งทางแพ่งที่เพิกถอนคำชี้ขาดอนุญาโตตุลาการ",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Perlawanan Kejaksaan atas Penetapan Perdata yang Membatalkan Putusan Arbitrase",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Bantahan Kejaksaan terhadap Penetapan Sivil yang Membatalkan Award Timbang Tara",
)
ITEMS["CN-JI-0243"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có thụ lý kháng nghị lần hai của Viện Kiểm sát đối với vụ án dân sự, kinh tế, hành chính đã được xét xử lại theo thủ tục giám đốc thẩm và giữ nguyên bản án hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลจะรับคำคัดค้านครั้งที่สองของอัยการในคดีแพ่ง เศรษฐกิจ และปกครองที่พิจารณาใหม่ตามกระบวนการกำกับดูแลและคงคำพิพากษาเดิมหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Menerima Perlawanan Kedua Kejaksaan atas Perkara Perdata, Ekonomi dan Tata Usaha Negara yang Telah Diperiksa Ulang menurut Tata Cara Pengawasan Peradilan dan Putusan Tetap Dipertahankan",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Menerima Bantahan Kedua Kejaksaan bagi Kes Sivil, Ekonomi dan Pentadbiran yang Telah Disemak Semula menurut Tatacara Penyeliaan Kehakiman dan Penghakiman Kekal Dikekalkan",
)
ITEMS["CN-JI-0245"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách tính thời hiệu yêu cầu trọng tài trong tranh chấp nhân sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีคำนวณอายุความในการขออนุญาโตตุลาการในข้อพิพาทด้านบุคลากร",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Penghitungan Tenggang Daluwarsa Permohonan Arbitrase dalam Sengketa Kepegawaian",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Pengiraan Tempoh Had Permohonan Timbang Tara dalam Pertikaian Kepegawaian",
)
ITEMS["CN-JI-0249"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý kiến nghị tạm hoãn thi hành án do Viện Kiểm sát đề nghị",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการต่อข้อเสนอให้ระงับการบังคับคดีชั่วคราวที่อัยการเสนอ",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Usulan Penangguhan Pelaksanaan Putusan yang Diajukan Kejaksaan",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Cadangan Penangguhan Pelaksanaan Penghakiman yang Dikemukakan Kejaksaan",
)
ITEMS["CN-JI-0250"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách hiểu quy định tại Điều 272 Bộ luật Hình sự về việc \"sử dụng vốn của đơn vị cho cá nhân hoặc cho người khác vay\"",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการตีความบทบัญญัติมาตรา 272 แห่งประมวลกฎหมายอาญาเรื่อง \"การใช้เงินทุนของหน่วยงานเพื่อประโยชน์ส่วนตัวหรือให้ผู้อื่นกู้ยืม\"",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Memahami Ketentuan Pasal 272 Kitab Undang-Undang Hukum Pidana mengenai \"Penggunaan Dana Unit untuk Kepentingan Pribadi atau Dipinjamkan kepada Pihak Lain\"",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Memahami Peruntukan Seksyen 272 Kanun Keseksaan berkenaan \"Penggunaan Dana Unit untuk Kepentingan Peribadi atau Dipinjamkan kepada Pihak Lain\"",
)
ITEMS["CN-JI-0251"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách xác định thời hiệu của quyền yêu cầu bồi thường trong vận tải hàng hóa ven biển và đường thủy nội địa",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดอายุความของสิทธิเรียกร้องค่าชดเชยในการขนส่งสินค้าทางชายฝั่งและทางน้ำภายในประเทศ",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Penetapan Tenggang Daluwarsa Hak Tuntutan Ganti Rugi dalam Pengangkutan Barang Pesisir dan Perairan Darat",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Penetapan Tempoh Had Hak Tuntutan Pampasan dalam Pengangkutan Barang Pesisir dan Perairan Dalam",
)
ITEMS["CN-JI-0252"] = (
    "Giải thích của Tòa án Nhân dân Tối cao về cách xác định nhân viên của công ty, doanh nghiệp nhà nước trong công ty cổ phần có vốn nhà nước nắm giữ hoặc tham gia góp vốn",
    "การตีความของศาลประชาชนสูงสุดว่าด้วยการกำหนดเจ้าหน้าที่ของบริษัทและวิสาหกิจของรัฐในบริษัทมหาชนจำกัดที่รัฐถือหุ้นควบคุมหรือเข้าร่วมทุน",
    "Penafsiran Mahkamah Rakyat Agung tentang Cara Menetapkan Pegawai Perusahaan Milik Negara dalam Perseroan Terbatas yang Sahamnya Dikuasai atau Disertai Negara",
    "Tafsiran Mahkamah Rakyat Agung mengenai Cara Menetapkan Pegawai Syarikat Milik Negara dalam Syarikat Berhad yang Sahamnya Dikuasai atau Disertai Negara",
)
ITEMS["CN-JI-0266"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc áp dụng pháp luật có liên quan trong xử lý tranh chấp hợp đồng bảo hiểm tín dụng xuất khẩu",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการใช้กฎหมายที่เกี่ยวข้องในการพิจารณาคดีข้อพิพาทสัญญาประกันภัยสินเชื่อการส่งออก",
    "Jawaban Mahkamah Rakyat Agung tentang Penerapan Hukum Terkait dalam Penanganan Sengketa Perjanjian Asuransi Kredit Ekspor",
    "Jawapan Mahkamah Rakyat Agung mengenai Penggunaan Undang-Undang Berkaitan dalam Pengendalian Pertikaian Persetujuan Insurans Kredit Eksport",
)
ITEMS["CN-JI-0271"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có phân biệt người chủ mưu và người giúp sức đối với người phụ trách trực tiếp và người chịu trách nhiệm trực tiếp khác trong vụ án phạm tội do đơn vị",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าจะแยกผู้ก่อการกับผู้สนับสนุนสำหรับผู้รับผิดชอบโดยตรงและผู้รับผิดชอบโดยตรงอื่นในคดีความผิดที่กระทำโดยหน่วยงานหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Dibedakan Pelaku Utama dan Pembantu bagi Penanggung Jawab Langsung dan Penanggung Jawab Langsung Lainnya dalam Perkara Tindak Pidana oleh Korporasi",
    "Jawapan Mahkamah Rakyat Agung sama ada Dibezakan Pelaku Utama dan Pembantu bagi Penanggungjawab Langsung dan Penanggungjawab Langsung Lain dalam Kes Kesalahan Jenayah oleh Korporat",
)
ITEMS["CN-JI-0307"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về đương sự trong vụ án tranh chấp lao động",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยคู่ความในคดีข้อพิพาทแรงงาน",
    "Jawaban Mahkamah Rakyat Agung tentang Para Pihak dalam Perkara Sengketa Tenaga Kerja",
    "Jawapan Mahkamah Rakyat Agung mengenai Para Pihak dalam Kes Pertikaian Buruh",
)
ITEMS["CN-JI-0359"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề áp dụng pháp luật trong xử lý vụ án liên quan đến báo cáo đánh giá quyền sáng chế",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาการใช้กฎหมายในการพิจารณาคดีที่เกี่ยวข้องกับรายงานประเมินสิทธิสิทธิบัตร",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah Penerapan Hukum dalam Penanganan Perkara Terkait Laporan Evaluasi Hak Paten",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Penggunaan Undang-Undang dalam Pengendalian Kes Berkaitan Laporan Penilaian Hak Paten",
)
ITEMS["CN-JI-0402"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc các khoản phí bảo hiểm xã hội phải nộp đến thời điểm nào sau khi doanh nghiệp đã tham gia bảo hiểm xã hội bị phá sản",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าต้องชำระเงินสมทบประกันสังคมต่าง ๆ จนถึงเวลาใดภายหลังวิสาหกิจที่เข้าร่วมประกันสังคมล้มละลาย",
    "Jawaban Mahkamah Rakyat Agung tentang Sampai Kapan Iuran Jaminan Sosial Harus Dibayar setelah Badan Usaha Peserta Jaminan Sosial Pailit",
    "Jawapan Mahkamah Rakyat Agung mengenai Sampai Bila Caruman Jaminan Sosial Perlu Dibayar selepas Perusahaan Peserta Jaminan Sosial Muflis",
)
ITEMS["CN-JI-0403"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề liên quan đến khoản 1 Điều 30 Luật Khiếu nại hành chính",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาที่เกี่ยวข้องกับวรรคหนึ่งมาตรา 30 แห่งกฎหมายว่าด้วยการร้องเรียนทางปกครอง",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah terkait Ayat (1) Pasal 30 Undang-Undang Keberatan Administratif",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Berkaitan Fasal (1) Seksyen 30 Undang-Undang Bantahan Pentadbiran",
)
ITEMS["CN-JI-0440"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về vấn đề liên quan đến Điều 64 Bộ luật Hình sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยปัญหาที่เกี่ยวข้องกับมาตรา 64 แห่งประมวลกฎหมายอาญา",
    "Jawaban Mahkamah Rakyat Agung tentang Masalah terkait Pasal 64 Kitab Undang-Undang Hukum Pidana",
    "Jawapan Mahkamah Rakyat Agung mengenai Isu Berkaitan Seksyen 64 Kanun Keseksaan",
)
ITEMS["CN-JI-0446"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc có thụ lý vụ án yêu cầu xác nhận quyền đòi đối với khoản tiền phạt chậm nộp thuế của doanh nghiệp phá sản do cơ quan thuế khởi kiện hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลจะรับคดีที่หน่วยงานภาษีฟ้องเพื่อยืนยันสิทธิเรียกร้องเงินค่าปรับล่าช้าจากการค้างชำระภาษีของวิสาหกิจที่ล้มละลายหรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Menerima Perkara Gugatan Badan Pajak untuk Mengesahkan Hak Tuntutan atas Denda Keterlambatan Pajak Badan Usaha Pailit",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Menerima Kes Guaman Badan Cukai untuk Mengesahkan Hak Tuntutan atas Denda Kelewatan Cukai Perusahaan Muflis",
)
ITEMS["CN-JI-0455"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc cưỡng chế phá dỡ công trình xây dựng, kết cấu, thiết bị trái pháp luật",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการบังคับรื้อถอนอาคาร สิ่งก่อสร้าง และอุปกรณ์ที่ผิดกฎหมาย",
    "Jawaban Mahkamah Rakyat Agung tentang Pelaksanaan Paksa Pembongkaran Bangunan, Struktur dan Peralatan yang Melanggar Hukum",
    "Jawapan Mahkamah Rakyat Agung mengenai Pelaksanaan Paksa Perobohan Bangunan, Struktur dan Peralatan yang Menyalahi Undang-Undang",
)
ITEMS["CN-JI-0457"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tòa án nhân dân có phải thi hành phán quyết trọng tài khi trọng tài viên không được tiếp tục mời nhiệm đã ký tên trên phán quyết của vụ án mà mình đã tham gia xét xử hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าศาลประชาชนต้องบังคับตามคำชี้ขาดอนุญาโตตุลาการหรือไม่เมื่ออนุญาโตตุลาการที่ไม่ได้ต่อสัญญาจ้างได้ลงนามในคำชี้ขาดของคดีที่ตนได้ร่วมพิจารณา",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Pengadilan Rakyat Harus Melaksanakan Putusan Arbitrase ketika Arbiter yang Tidak Diperpanjang Penugasannya Menandatangani Putusan Perkara yang Pernah Ia Periksa",
    "Jawapan Mahkamah Rakyat Agung sama ada Mahkamah Rakyat Perlu Melaksanakan Award Timbang Tara apabila Penimbang Tara yang Tidak Dilanjutkan Pelantikannya Menandatangani Award Kes yang Pernah Dibelanya",
)
ITEMS["CN-JI-0462"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thời điểm phát sinh hiệu lực pháp luật của bản án, quyết định chung thẩm trong vụ án hình sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยเวลาที่คำพิพากษาและคำสั่งถึงที่สุดในคดีอาญามีผลใช้บังคับตามกฎหมาย",
    "Jawaban Mahkamah Rakyat Agung tentang Saat Timbulnya Kekuatan Hukum Putusan dan Penetapan Tingkat Akhir dalam Perkara Pidana",
    "Jawapan Mahkamah Rakyat Agung mengenai Masa Berkuat Kuasanya Penghakiman dan Penetapan Peringkat Akhir dalam Kes Jenayah",
)
ITEMS["CN-JI-0464"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về cách ghi ngày bắt đầu và ngày kết thúc thời hạn chấp hành hình phạt trong bản án hình sự",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยวิธีระบุวันเริ่มต้นและวันสิ้นสุดระยะเวลารับโทษในคำพิพากษาคดีอาญา",
    "Jawaban Mahkamah Rakyat Agung tentang Cara Mencantumkan Tanggal Mulai dan Tanggal Berakhir Masa Menjalani Pidana dalam Putusan Pidana",
    "Jawapan Mahkamah Rakyat Agung mengenai Cara Mencatat Tarikh Mula dan Tarikh Tamat Tempoh Menjalani Hukuman dalam Penghakiman Jenayah",
)
ITEMS["CN-JI-0476"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý khi không thể tống đạt theo địa chỉ bị đơn do nguyên đơn cung cấp khi khởi kiện",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการเมื่อไม่สามารถส่งหมายตามที่อยู่จำเลยที่โจทก์ให้ไว้เมื่อฟ้องคดี",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan ketika Penyampaian Tidak Dapat Dilakukan pada Alamat Tergugat yang Diberikan Penggugat saat Mengajukan Gugatan",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian apabila Penyampaian Tidak Dapat Dilaksanakan di Alamat Defendan yang Diberikan Plaintif semasa Memfailkan Guaman",
)
ITEMS["CN-JI-0478"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thẩm quyền xét xử tranh chấp trách nhiệm bồi thường thiệt hại do bảo toàn tài sản trong tố tụng gây ra",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยเขตอำนาจศาลในข้อพิพาทความรับผิดชดเชยความเสียหายที่เกิดจากการคุ้มครองทรัพย์สินในกระบวนการพิจารณาคดี",
    "Jawaban Mahkamah Rakyat Agung tentang Kewenangan Mengadili Sengketa Tanggung Jawab Ganti Rugi akibat Penjaminan Harta dalam Peradilan",
    "Jawapan Mahkamah Rakyat Agung mengenai Bidang Kuasa Pertikaian Tanggungjawab Pampasan akibat Pemuliharaan Harta dalam Kehakiman",
)
ITEMS["CN-JI-0479"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc tranh chấp hợp đồng tiền gửi do mật khẩu thẻ tiết kiệm bị lộ dẫn đến tiền gửi bị người khác chiếm đoạt có được thụ lý như vụ án dân sự hay không",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าข้อพิพาทสัญญาเงินฝากอันเนื่องมาจากรหัสบัตรออมทรัพย์รั่วไหลจนเงินฝากถูกผู้อื่นยักยอกจะรับเป็นคดีแพ่งได้หรือไม่",
    "Jawaban Mahkamah Rakyat Agung tentang Apakah Sengketa Perjanjian Simpanan akibat Kebocoran Kata Sandi Kartu Tabungan sehingga Simpanan Diambil Pihak Lain Dapat Diterima sebagai Perkara Perdata",
    "Jawapan Mahkamah Rakyat Agung sama ada Pertikaian Persetujuan Simpanan akibat Kebocoran Kata Laluan Kad Simpanan sehingga Simpanan Diambil Pihak Lain Boleh Diterima sebagai Kes Sivil",
)
ITEMS["CN-JI-0480"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc nên cho phép viện kiểm sát cử thư ký cùng viện trưởng hoặc kiểm sát viên ra tòa ủng hộ công tố",
    "ประกาศของศาลประชาชนสูงสุดว่าควรอนุญาตให้สำนักงานอัยการจัดส่งเลขานุการร่วมกับอัยการสูงหรือพนักงานอัยการเข้าศาลเพื่อสนับสนุนการฟ้องคดี",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Perlunya Mengizinkan Kejaksaan Menugaskan Panitera Mendampingi Kepala Kejaksaan atau Jaksa untuk Menghadiri Sidang Mendukung Penuntutan",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Perlu Membenarkan Kejaksaan Menugaskan Kerani Bersama Ketua Kejaksaan atau Pendakwa Raya untuk Menghadiri Sidang Menyokong Pendakwaan",
)
ITEMS["CN-JI-0482"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc định tội đối với nhân viên làm công tác quản lý trong công ty cổ phần có vốn nhà nước nắm giữ hoặc góp vốn lợi dụng chức vụ chiếm đoạt trái phép tài sản của công ty",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดความผิดต่อเจ้าหน้าที่ฝ่ายบริหารในบริษัทมหาชนจำกัดที่รัฐถือหุ้นควบคุมหรือร่วมทุนซึ่งใช้อำนาจหน้าที่ยักยอกทรัพย์สินของบริษัทโดยมิชอบ",
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Tindak Pidana atas Pegawai Manajerial pada Perseroan Terbatas yang Sahamnya Dikuasai atau Disertai Negara yang Menyalahgunakan Jabatan untuk Mengambil Alih Harta Perseroan secara Tidak Sah",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Kesalahan atas Pegawai Pengurusan dalam Syarikat Berhad yang Sahamnya Dikuasai atau Disertai Negara yang Menyalahgunakan Jawatan untuk Mengambil Alih Harta Syarikat secara Tidak Sah",
)
ITEMS["CN-JI-0488"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xử lý vụ án chủ nợ yêu cầu thanh lý phá sản đối với con nợ không rõ tung tích hoặc không rõ tình trạng tài sản",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการดำเนินการในคดีที่เจ้าหนี้ขอให้ชำระบัญชีล้มละลายต่อลูกหนี้ที่ไม่ทราบที่อยู่หรือไม่ทราบสถานะทรัพย์สิน",
    "Jawaban Mahkamah Rakyat Agung tentang Penanganan Perkara Permohonan Kreditor untuk Likuidasi Kepailitan terhadap Debitur yang Tidak Diketahui Keberadaannya atau Keadaan Hartanya",
    "Jawapan Mahkamah Rakyat Agung mengenai Pengendalian Kes Permohonan Pemiutang untuk Pembubaran Kebankrapan terhadap Penghutang yang Tidak Diketahui Keberadaannya atau Keadaan Hartanya",
)
ITEMS["CN-JI-0489"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về thời điểm bắt đầu tính thời hiệu khởi kiện khi con nợ không thực hiện nghĩa vụ sau khi hết hạn thỏa thuận và cấp giấy nhận nợ không ghi ngày trả",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยเวลาที่เริ่มนับอายุความฟ้องคดีเมื่อลูกหนี้ไม่ชำระหนี้ภายหลังสิ้นสุดกำหนดที่ตกลงและออกใบรับหนี้ที่ไม่ระบุวันชำระ",
    "Jawaban Mahkamah Rakyat Agung tentang Saat Mulai Penghitungan Tenggang Daluwarsa Gugatan ketika Debitur Tidak Melaksanakan Kewajiban setelah Berakhirnya Tenggat yang Disepakati dan Menerbitkan Surat Pengakuan Utang tanpa Tanggal Pembayaran",
    "Jawapan Mahkamah Rakyat Agung mengenai Masa Mula Pengiraan Tempoh Had Guaman apabila Penghutang Tidak Melaksanakan Kewajipan selepas Tamat Tempoh yang Dipersetujui dan Mengeluarkan Surat Pengakuan Hutang tanpa Tarikh Pembayaran",
)
ITEMS["CN-JI-0490"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc xác định đúng bị đơn và thời hạn khởi kiện trong vụ án hành chính về cưỡng chế phá dỡ",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการกำหนดผู้ถูกฟ้องคดีและกำหนดเวลาฟ้องคดีในคดีปกครองเกี่ยวกับการบังคับรื้อถอนอย่างถูกต้อง",
    "Jawaban Mahkamah Rakyat Agung tentang Penetapan Tergugat dan Tenggang Waktu Gugatan secara Tepat dalam Perkara Tata Usaha Negara tentang Pembongkaran Paksa",
    "Jawapan Mahkamah Rakyat Agung mengenai Penetapan Defendan dan Tempoh Guaman secara Tepat dalam Kes Pentadbiran berkenaan Perobohan Paksa",
)
ITEMS["CN-JI-0495"] = (
    "Phúc đáp của Tòa án Nhân dân Tối cao về việc bị đơn trong vụ án xâm phạm sở hữu trí tuệ yêu cầu nguyên đơn bồi thường chi phí hợp lý với lý do nguyên đơn lạm dụng quyền",
    "คำตอบกลับของศาลประชาชนสูงสุดว่าด้วยการที่จำเลยในคดีละเมิดทรัพย์สินทางปัญญาขอให้โจทก์ชดเชยค่าใช้จ่ายที่สมเหตุสมผลโดยอ้างว่าโจทก์ใช้อำนาจเกินขอบเขต",
    "Jawaban Mahkamah Rakyat Agung tentang Permohonan Tergugat dalam Perkara Pelanggaran Kekayaan Intelektual agar Penggugat Mengganti Biaya yang Wajar dengan Alasan Penggugat Menyalahgunakan Hak",
    "Jawapan Mahkamah Rakyat Agung mengenai Permohonan Defendan dalam Kes Pelanggaran Harta Intelek agar Plaintif Memampas Kos yang Munasabah atas Alasan Plaintif Menyalahgunakan Hak",
)
ITEMS["CN-JI-0502"] = (
    "Thông báo của Tòa án Nhân dân Tối cao về việc chấm dứt thỏa thuận tương trợ tư pháp giữa tòa án địa phương Trung Quốc với tòa án địa phương và cơ quan tư pháp nước ngoài",
    "ประกาศของศาลประชาชนสูงสุดว่าด้วยการยุติข้อตกลงความช่วยเหลือทางตุลาการระหว่างศาลท้องถิ่นของจีนกับศาลท้องถิ่นและหน่วยงานตุลาการต่างประเทศ",
    "Pemberitahuan Mahkamah Rakyat Agung tentang Pengakhiran Perjanjian Bantuan Hukum Timbal Balik antara Pengadilan Daerah Tiongkok dengan Pengadilan Daerah dan Badan Yudisial Asing",
    "Pemberitahuan Mahkamah Rakyat Agung mengenai Penamatan Persetujuan Bantuan Kehakiman antara Mahkamah Tempatan China dengan Mahkamah Tempatan dan Badan Kehakiman Asing",
)
ITEMS["CN-JI-0508"] = (
    "Trả lời của Tòa Hành chính Tòa án Nhân dân Tối cao về hiệu lực của Quy định tạm thời về quản lý kim loại phế liệu của thành phố Hô Hòa Hạo Đặc",
    "คำตอบของศาลปกครองประจำศาลประชาชนสูงสุดว่าด้วยผลใช้บังคับของข้อกำหนดชั่วคราวว่าด้วยการบริหารเศษโลหะของนครฮูฮอต",
    "Jawaban Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Kekuatan Berlaku Ketentuan Sementara Pengelolaan Logam Bekas Kota Hohhot",
    "Jawapan Mahkamah Pentadbiran Mahkamah Rakyat Agung mengenai Kuat Kuasa Peruntukan Sementara Pengurusan Logam Terpakai Bandar Hohhot",
)
ITEMS["CN-JI-0510"] = (
    "Trả lời của Tòa Hành chính Tòa án Nhân dân Tối cao về vụ án Công ty Xuất nhập khẩu Giai Mộc Tư chi nhánh hai kiện Ủy ban Quản lý cửa khẩu thành phố Tuy Phân Hà về việc đấu giá tài sản",
    "คำตอบของศาลปกครองประจำศาลประชาชนสูงสุดว่าด้วยคดีที่สาขาที่สองของบริษัทนำเข้าส่งออกเจียมูสีฟ้องคณะกรรมการบริหารด่านชายแดนนครซุยเฟินเหอเกี่ยวกับการขายทอดตลาดทรัพย์สิน",
    "Jawaban Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Perkara Cabang Kedua Perusahaan Ekspor Impor Jiamusi menggugat Komite Pengelola Pelabuhan Kota Suifenhe mengenai Lelang Harta",
    "Jawapan Mahkamah Pentadbiran Mahkamah Rakyat Agung mengenai Kes Cawangan Kedua Syarikat Import Eksport Jiamusi menyaman Jawatankuasa Pengurusan Pelabuhan Bandar Suifenhe berkenaan Lelongan Harta",
)
ITEMS["CN-JI-0511"] = (
    "Trả lời qua điện thoại của Tòa Hành chính Tòa án Nhân dân Tối cao về việc tòa án có thể thụ lý theo vụ án hành chính khi cơ quan công an khám xét nhà ở, thân thể công dân mà không có thủ tục khởi tố, khám xét theo luật định và người bị khám xét khởi kiện hay không",
    "คำตอบทางโทรศัพท์ของศาลปกครองประจำศาลประชาชนสูงสุดว่าศาลจะรับเป็นคดีปกครองได้หรือไม่เมื่อหน่วยงานตำรวจค้นบ้านและร่างกายพลเมืองโดยไม่มีขั้นตอนการดำเนินคดีและการค้นตามกฎหมาย และผู้ถูกค้นฟ้องคดี",
    "Jawaban melalui Telepon Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Apakah Pengadilan Dapat Menerima sebagai Perkara Tata Usaha Negara ketika Kepolisian Menggeledah Rumah dan Tubuh Warga tanpa Prosedur Penyidikan dan Penggeledahan menurut Hukum lalu Warga yang Digeledah Menggugat",
    "Jawapan melalui Telefon Mahkamah Pentadbiran Mahkamah Rakyat Agung sama ada Mahkamah Boleh Menerima sebagai Kes Pentadbiran apabila Polis Menggeledah Rumah dan Tubuh Warganegara tanpa Tatacara Siasatan dan Penggeledahan menurut Undang-Undang lalu Warganegara yang Digeledah Memfailkan Guaman",
)
ITEMS["CN-JI-0512"] = (
    "Trả lời của Tòa Hành chính Tòa án Nhân dân Tối cao về việc áp dụng văn bản số 41 năm 1994 của Quốc vụ viện",
    "คำตอบของศาลปกครองประจำศาลประชาชนสูงสุดว่าด้วยการใช้เอกสารหมายเลข 41 ปี ค.ศ. 1994 ของคณะรัฐมนตรี",
    "Jawaban Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Penerapan Dokumen Dewan Negara Nomor 41 Tahun 1994",
    "Jawapan Mahkamah Pentadbiran Mahkamah Rakyat Agung mengenai Penggunaan Dokumen Majlis Negara Nombor 41 Tahun 1994",
)
ITEMS["CN-JI-0513"] = (
    "Trả lời qua điện thoại của Tòa Hành chính Tòa án Nhân dân Tối cao về việc chính quyền nhân dân xã có phải chịu trách nhiệm về thiệt hại do nhân viên phòng an ninh xã cố ý gây thương tích cho đương sự trong khi thi hành nhiệm vụ hay không",
    "คำตอบทางโทรศัพท์ของศาลปกครองประจำศาลประชาชนสูงสุดว่ารัฐบาลประชาชนตำบลต้องรับผิดต่อความเสียหายที่เจ้าหน้าที่ฝ่ายความสงบเรียบร้อยประจำตำบลทำร้ายคู่ความโดยเจตนาในระหว่างปฏิบัติหน้าที่หรือไม่",
    "Jawaban melalui Telepon Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Apakah Pemerintah Rakyat Kecamatan Bertanggung Jawab atas Kerugian akibat Pegawai Bagian Ketertiban Kecamatan dengan Sengaja Melukai Para Pihak selama Menjalankan Tugas",
    "Jawapan melalui Telefon Mahkamah Pentadbiran Mahkamah Rakyat Agung sama ada Kerajaan Rakyat Mukim Bertanggungjawab atas Kerugian akibat Pegawai Bahagian Ketenteraman Mukim dengan Sengaja Mencederakan Para Pihak semasa Menjalankan Tugas",
)
ITEMS["CN-JI-0514"] = (
    "Ý kiến trả lời của Tòa Hành chính Tòa án Nhân dân Tối cao về việc thụ lý vụ án phát sinh tranh chấp khi thu phí sử dụng có trả tiền đối với công trình thoát nước đô thị",
    "ความเห็นตอบกลับของศาลปกครองประจำศาลประชาชนสูงสุดว่าด้วยการรับคดีที่เกิดข้อพิพาทจากการจัดเก็บค่าบริการใช้งานระบบระบายน้ำในเมือง",
    "Pendapat Jawaban Tòa Tata Usaha Negara pada Mahkamah Rakyat Agung tentang Penerimaan Perkara yang Timbul dari Sengketa Pengenaan Biaya Pemakaian Berbayar Sarana Drainase Perkotaan",
    "Pendapat Jawapan Mahkamah Pentadbiran Mahkamah Rakyat Agung mengenai Penerimaan Kes yang Timbul daripada Pertikaian Pengenaan Caj Penggunaan Berbayar Kemudahan Saliran Bandar",
)
ITEMS["CN-JI-0515"] = (
    "Công hàm trả lời của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về việc xác định tính chất của hành vi sử dụng trái phép tài khoản điện thoại đường dài của người khác",
    "หนังสือตอบกลับของฝ่ายวิจัยศาลประชาชนสูงสุดว่าด้วยการกำหนดลักษณะของการใช้บัญชีโทรศัพท์ทางไกลของผู้อื่นโดยมิชอบ",
    "Surat Jawaban Bagian Penelitian Mahkamah Rakyat Agung tentang Penetapan Sifat Perbuatan Penggunaan Tidak Sah Akun Telepon Jarak Jauh Milik Orang Lain",
    "Surat Jawapan Bahagian Penyelidikan Mahkamah Rakyat Agung mengenai Penetapan Sifat Perbuatan Penggunaan Akaun Telefon Jarak Jauh Milik Orang Lain secara Tidak Sah",
)
ITEMS["CN-JI-0516"] = (
    "Trả lời qua điện thoại của Phòng Nghiên cứu Tòa án Nhân dân Tối cao về việc xác định hình phạt phải chấp hành khi xét xử lại đối với người bị tăng án do phạm tội mới trước khi được sửa án",
    "คำตอบทางโทรศัพท์ของฝ่ายวิจัยศาลประชาชนสูงสุดว่าด้วยการกำหนดโทษที่ต้องรับเมื่อพิจารณาคดีใหม่สำหรับผู้ถูกเพิ่มโทษเพราะกระทำความผิดใหม่ก่อนการแก้ไขคำพิพากษา",
    "Jawaban melalui Telepon Bagian Penelitian Mahkamah Rakyat Agung tentang Penetapan Pidana yang Harus Dijalani pada Pemeriksaan Ulang bagi Terpidana yang Pidananya Ditambah karena Melakukan Tindak Pidana Baru sebelum Putusan Diubah",
    "Jawapan melalui Telefon Bahagian Penyelidikan Mahkamah Rakyat Agung mengenai Penetapan Hukuman yang Perlu Dijalani pada Semakan Semula bagi Pesalah yang Hukumannya Ditambah kerana Melakukan Kesalahan Baharu sebelum Penghakiman Diubah",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[540:600]]
missing = [i for i in want if i not in ITEMS]
extra = [i for i in ITEMS if i not in want]
assert not missing, "缺条目: %s" % missing
assert not extra, "多余条目: %s" % extra

out = {}
for i in want:
    vi, th, iid, ms = ITEMS[i]
    out[i] = {"vi": vi, "th": th, "id": iid, "ms": ms}

doc = {
    "batch": "cn-p1-b28",
    "scope": "CN 第 541–600 部（_cn_rest.json 540–599）",
    "note": "语义基准 title.zh；批复/答复/复函统一句式；地名按通用音译。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b28.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部" % (dst, len(out)))
