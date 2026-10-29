# -*- coding: utf-8 -*-
"""KH 标题多语种批次生成器（第 2 批：48 部，H060–H107）。"""
import json, io, os

items = {}

items["KH-H060"] = {
    "vi": "Sắc lệnh Hoàng gia số 0121/003 về việc thành lập Học viện Công nghệ số Campuchia như một đơn vị sự nghiệp công lập",
    "th": "พระราชกฤษฎีกาฉบับที่ 0121/003 ว่าด้วยการจัดตั้งสถาบันเทคโนโลยีดิจิทัลกัมพูชาเป็นสถาบันบริหารราชการแผ่นดิน",
    "id": "Dekrit Kerajaan Nomor 0121/003 tentang Pendirian Akademi Teknologi Digital Kamboja sebagai Lembaga Administrasi Publik",
    "ms": "Dekri Kerajaan Nombor 0121/003 mengenai Penubuhan Akademi Teknologi Digital Kemboja sebagai Institusi Pentadbiran Awam",
}
items["KH-H061"] = {
    "vi": "Luật Quyết toán ngân sách nhà nước năm 2010",
    "th": "พระราชบัญญัติการชำระบัญชีงบประมาณแผ่นดินประจำปี ค.ศ. 2010",
    "id": "Undang-Undang Pertanggungjawaban Anggaran Pendapatan dan Belanja Negara Tahun 2010",
    "ms": "Akta Penyelesaian Belanjawan Negara Tahun 2010",
}
items["KH-H062"] = {
    "vi": "Luật Quản lý tài chính năm 2024",
    "th": "พระราชบัญญัติการบริหารการเงิน ค.ศ. 2024",
    "id": "Undang-Undang Pengelolaan Keuangan Tahun 2024",
    "ms": "Akta Pengurusan Kewangan Tahun 2024",
}
items["KH-H063"] = {
    "vi": "Luật về Quản lý thiên tai",
    "th": "พระราชบัญญัติว่าด้วยการจัดการภัยพิบัติ",
    "id": "Undang-Undang tentang Penanggulangan Bencana",
    "ms": "Akta mengenai Pengurusan Bencana",
}
items["KH-H064"] = {
    "vi": "Luật về Quy chế chung đối với quân nhân Lực lượng Vũ trang Hoàng gia Campuchia",
    "th": "พระราชบัญญัติว่าด้วยข้อบังคับทั่วไปสำหรับข้าราชการทหารแห่งกองทัพราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Statuta Umum bagi Personel Militer Angkatan Bersenjata Kerajaan Kamboja",
    "ms": "Akta mengenai Statut Am bagi Anggota Tentera Angkatan Bersenjata Diraja Kemboja",
}
items["KH-H065"] = {
    "vi": "Luật về Trại giam",
    "th": "พระราชบัญญัติว่าด้วยเรือนจำ",
    "id": "Undang-Undang tentang Lembaga Pemasyarakatan",
    "ms": "Akta mengenai Penjara",
}
items["KH-H066"] = {
    "vi": "Luật Quyết toán ngân sách nhà nước năm 2011",
    "th": "พระราชบัญญัติการชำระบัญชีงบประมาณแผ่นดินประจำปี ค.ศ. 2011",
    "id": "Undang-Undang Pertanggungjawaban Anggaran Pendapatan dan Belanja Negara Tahun 2011",
    "ms": "Akta Penyelesaian Belanjawan Negara Tahun 2011",
}
items["KH-H067"] = {
    "vi": "Luật về Quản lý và Khai thác tài nguyên khoáng sản",
    "th": "พระราชบัญญัติว่าด้วยการจัดการและการใช้ประโยชน์ทรัพยากรแร่",
    "id": "Undang-Undang tentang Pengelolaan dan Pemanfaatan Sumber Daya Mineral",
    "ms": "Akta mengenai Pengurusan dan Eksploitasi Sumber Mineral",
}
items["KH-H068"] = {
    "vi": "Luật về Trưng thu",
    "th": "พระราชบัญญัติว่าด้วยการเวนคืน",
    "id": "Undang-Undang tentang Pengambilalihan",
    "ms": "Akta mengenai Pengambilan Balik",
}
items["KH-H069"] = {
    "vi": "Luật về Quy tắc xuất xứ hàng hóa",
    "th": "พระราชบัญญัติว่าด้วยกฎถิ่นกำเนิดสินค้า",
    "id": "Undang-Undang tentang Aturan Asal Barang",
    "ms": "Akta mengenai Peraturan Asal Barang",
}
items["KH-H070"] = {
    "vi": "Luật thông qua Nghị định thư 1 của ASEAN về việc chỉ định các tuyến và phương tiện vận tải quá cảnh",
    "th": "พระราชบัญญัติรับรองพิธีสาร 1 ของอาเซียนว่าด้วยการกำหนดเส้นทางและสิ่งอำนวยความสะดวกในการขนส่งผ่านแดน",
    "id": "Undang-Undang tentang Pengesahan Protokol 1 ASEAN tentang Penetapan Jalur dan Fasilitas Angkutan Transit",
    "ms": "Akta tentang Pengesahan Protokol 1 ASEAN mengenai Penetapan Laluan dan Kemudahan Pengangkutan Transit",
}
items["KH-H071"] = {
    "vi": "Thông tư liên tịch số 489 về việc cung cấp dịch vụ công của Bộ Mỏ và Năng lượng",
    "th": "กฎกระทรวงร่วมฉบับที่ 489 ว่าด้วยการให้บริการสาธารณะของกระทรวงเหมืองแร่และพลังงาน",
    "id": "Peraturan Menteri Bersama Nomor 489 tentang Penyelenggaraan Pelayanan Publik oleh Kementerian Pertambangan dan Energi",
    "ms": "Peraturan Menteri Bersama Nombor 489 mengenai Penyediaan Perkhidmatan Awam oleh Kementerian Lombong dan Tenaga",
}
items["KH-H072"] = {
    "vi": "Luật về Bảo vệ di sản văn hóa",
    "th": "พระราชบัญญัติว่าด้วยการคุ้มครองมรดกทางวัฒนธรรม",
    "id": "Undang-Undang tentang Pelindungan Warisan Budaya",
    "ms": "Akta mengenai Perlindungan Warisan Budaya",
}
items["KH-H073"] = {
    "vi": "Luật Sửa đổi Luật Thuế",
    "th": "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติภาษีอากร",
    "id": "Undang-Undang tentang Perubahan atas Undang-Undang Perpajakan",
    "ms": "Akta tentang Pindaan kepada Akta Cukai",
}
items["KH-H074"] = {
    "vi": "Luật về Phòng, chống lừa đảo trực tuyến",
    "th": "พระราชบัญญัติว่าด้วยการปราบปรามการหลอกลวงออนไลน์",
    "id": "Undang-Undang tentang Pemberantasan Penipuan Daring",
    "ms": "Akta mengenai Pembanterasan Penipuan Dalam Talian",
}
items["KH-H075"] = {
    "vi": "Luật về Lĩnh vực bưu chính",
    "th": "พระราชบัญญัติว่าด้วยภาคไปรษณีย์",
    "id": "Undang-Undang tentang Sektor Pos",
    "ms": "Akta mengenai Sektor Pos",
}
items["KH-H076"] = {
    "vi": "Quy chế về điều kiện chung để đấu nối các nguồn phát điện mặt trời vào hệ thống cung cấp điện của lưới điện quốc gia hoặc vào hệ thống điện của khách hàng đã đấu nối với nguồn cung cấp điện của lưới điện quốc gia",
    "th": "ข้อกำหนดว่าด้วยเงื่อนไขทั่วไปในการเชื่อมต่อแหล่งผลิตไฟฟ้าพลังงานแสงอาทิตย์เข้ากับระบบจ่ายไฟฟ้าของโครงข่ายไฟฟ้าแห่งชาติ หรือระบบไฟฟ้าของผู้ใช้ไฟฟ้าที่เชื่อมต่อกับระบบจ่ายไฟฟ้าของโครงข่ายไฟฟ้าแห่งชาติ",
    "id": "Peraturan tentang Persyaratan Umum untuk Penyambungan Sumber Pembangkit Listrik Fotovoltaik Surya ke Sistem Penyediaan Tenaga Listrik Jaringan Nasional atau ke Sistem Kelistrikan Konsumen yang Tersambung pada Penyediaan Tenaga Listrik Jaringan Nasional",
    "ms": "Peraturan mengenai Syarat Am bagi Penyambungan Sumber Penjanaan Fotovoltaik Suria kepada Sistem Bekalan Elektrik Grid Nasional atau kepada Sistem Elektrik Pengguna yang Bersambung dengan Bekalan Elektrik Grid Nasional",
}
items["KH-H077"] = {
    "vi": "Sắc lệnh Hoàng gia về việc thành lập Hội đồng Nha khoa",
    "th": "พระราชกฤษฎีกาว่าด้วยการจัดตั้งสภาวิชาชีพทันตกรรม",
    "id": "Dekrit Kerajaan tentang Pendirian Dewan Kedokteran Gigi",
    "ms": "Dekri Kerajaan mengenai Penubuhan Majlis Pergigian",
}
items["KH-H078"] = {
    "vi": "Nghị định (Kret-Chbab) về Quản lý nghề cá",
    "th": "พระราชกฤษฎีกา (Kret-Chbab) ว่าด้วยการจัดการประมง",
    "id": "Dekrit Kerajaan (Kret-Chbab) tentang Pengelolaan Perikanan",
    "ms": "Dekri Kerajaan (Kret-Chbab) mengenai Pengurusan Perikanan",
}
items["KH-H079"] = {
    "vi": "Luật về Tố tụng về Thân phận cá nhân",
    "th": "พระราชบัญญัติว่าด้วยกระบวนพิจารณาคดีเกี่ยวกับสถานะบุคคล",
    "id": "Undang-Undang tentang Peradilan Status Pribadi",
    "ms": "Akta mengenai Litigasi Status Peribadi",
}
items["KH-H080"] = {
    "vi": "Luật về Hội và Tổ chức phi chính phủ",
    "th": "พระราชบัญญัติว่าด้วยสมาคมและองค์กรพัฒนาเอกชน",
    "id": "Undang-Undang tentang Perkumpulan dan Organisasi Non-Pemerintah",
    "ms": "Akta mengenai Persatuan dan Pertubuhan Bukan Kerajaan",
}
items["KH-H081"] = {
    "vi": "Luật Sửa đổi Luật Đầu tư",
    "th": "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติการลงทุน",
    "id": "Undang-Undang tentang Perubahan atas Undang-Undang Investasi",
    "ms": "Akta tentang Pindaan kepada Akta Pelaburan",
}
items["KH-H082"] = {
    "vi": "Luật thông qua Nghị định thư không bắt buộc của Công ước về Xóa bỏ mọi hình thức phân biệt đối xử với phụ nữ",
    "th": "พระราชบัญญัติรับรองพิธีสารเลือกได้ของอนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติต่อสตรีในทุกรูปแบบ",
    "id": "Undang-Undang tentang Pengesahan Protokol Opsional Konvensi tentang Penghapusan Segala Bentuk Diskriminasi terhadap Perempuan",
    "ms": "Akta tentang Pengesahan Protokol Pilihan kepada Konvensyen mengenai Penghapusan Segala Bentuk Diskriminasi terhadap Wanita",
}
items["KH-H083"] = {
    "vi": "Luật thông qua Công ước về Xóa bỏ mọi hình thức phân biệt đối xử với phụ nữ",
    "th": "พระราชบัญญัติรับรองอนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติต่อสตรีในทุกรูปแบบ",
    "id": "Undang-Undang tentang Pengesahan Konvensi tentang Penghapusan Segala Bentuk Diskriminasi terhadap Perempuan",
    "ms": "Akta tentang Pengesahan Konvensyen mengenai Penghapusan Segala Bentuk Diskriminasi terhadap Wanita",
}
items["KH-H084"] = {
    "vi": "Luật về Tổ chức và Hoạt động của Hội đồng Thẩm phán Tối cao",
    "th": "พระราชบัญญัติว่าด้วยการจัดองค์กรและการดำเนินงานของสภาตุลาการสูงสุด",
    "id": "Undang-Undang tentang Organisasi dan Tata Kerja Dewan Kehakiman Agung",
    "ms": "Akta mengenai Organisasi dan Fungsi Majlis Kehakiman Agung",
}
items["KH-H085"] = {
    "vi": "Luật về Tổ chức và Hoạt động của Cơ quan Dịch vụ Tài chính Phi ngân hàng",
    "th": "พระราชบัญญัติว่าด้วยการจัดองค์กรและการดำเนินงานขององค์กรบริการการเงินนอกระบบธนาคาร",
    "id": "Undang-Undang tentang Organisasi dan Tata Kerja Otoritas Jasa Keuangan Non-Bank",
    "ms": "Akta mengenai Organisasi dan Fungsi Pihak Berkuasa Perkhidmatan Kewangan Bukan Bank",
}
items["KH-H086"] = {
    "vi": "Luật phê chuẩn việc Vương quốc Campuchia trở thành thành viên Công ước về Chống bắt cóc con tin",
    "th": "พระราชบัญญัติให้ความเห็นชอบการที่ราชอาณาจักรกัมพูชาเข้าเป็นภาคีอนุสัญญาว่าด้วยการต่อต้านการจับตัวประกัน",
    "id": "Undang-Undang tentang Persetujuan Kerajaan Kamboja Menjadi Anggota Konvensi tentang Penindasan Penculikan Sandera",
    "ms": "Akta tentang Persetujuan Kerajaan Kemboja Menjadi Anggota Konvensyen mengenai Pembasmian Penculikan Tebusan",
}
items["KH-H087"] = {
    "vi": "Luật về Phòng ngừa và Đấu tranh phòng, chống lây nhiễm HIV/AIDS",
    "th": "พระราชบัญญัติว่าด้วยการป้องกันและการต่อสู้เพื่อป้องกันการแพร่ระบาดของเอชไอวี/เอดส์",
    "id": "Undang-Undang tentang Pencegahan dan Pemberantasan Penyebaran HIV/AIDS",
    "ms": "Akta mengenai Pencegahan dan Pembanterasan Penyebaran HIV/AIDS",
}
items["KH-H088"] = {
    "vi": "Luật Báo chí",
    "th": "พระราชบัญญัติสื่อสิ่งพิมพ์",
    "id": "Undang-Undang Pers",
    "ms": "Akta Akhbar",
}
items["KH-H089"] = {
    "vi": "Luật về Cấp phép bắt buộc vì mục tiêu sức khỏe cộng đồng",
    "th": "พระราชบัญญัติว่าด้วยการอนุญาตโดยบังคับเพื่อสุขภาพสาธารณะ",
    "id": "Undang-Undang tentang Lisensi Wajib untuk Kesehatan Publik",
    "ms": "Akta mengenai Pelesenan Wajib untuk Kesihatan Awam",
}
items["KH-H090"] = {
    "vi": "Luật phê chuẩn Hiệp định giữa Chính phủ Vương quốc Campuchia và Chính phủ Cộng hòa Nhân dân Trung Hoa về Khuyến khích và Bảo hộ đầu tư",
    "th": "พระราชบัญญัติให้ความเห็นชอบความตกลงระหว่างรัฐบาลราชอาณาจักรกัมพูชากับรัฐบาลสาธารณรัฐประชาชนจีนว่าด้วยการส่งเสริมและการคุ้มครองการลงทุน",
    "id": "Undang-Undang tentang Persetujuan Perjanjian antara Pemerintah Kerajaan Kamboja dan Pemerintah Republik Rakyat Tiongkok tentang Promosi dan Perlindungan Investasi",
    "ms": "Akta tentang Persetujuan Perjanjian antara Kerajaan Kemboja dan Kerajaan Republik Rakyat China mengenai Penggalakan dan Perlindungan Pelaburan",
}
items["KH-H091"] = {
    "vi": "Luật về Tiền lương tối thiểu",
    "th": "พระราชบัญญัติว่าด้วยค่าจ้างขั้นต่ำ",
    "id": "Undang-Undang tentang Upah Minimum",
    "ms": "Akta mengenai Upah Minimum",
}
items["KH-H092"] = {
    "vi": "Luật về Án phí",
    "th": "พระราชบัญญัติว่าด้วยค่าธรรมเนียมศาล",
    "id": "Undang-Undang tentang Biaya Peradilan",
    "ms": "Akta mengenai Fi Mahkamah",
}
items["KH-H093"] = {
    "vi": "Luật về Quản lý vũ khí, vật liệu nổ và đạn dược",
    "th": "พระราชบัญญัติว่าด้วยการจัดการอาวุธ วัตถุระเบิด และกระสุน",
    "id": "Undang-Undang tentang Pengelolaan Senjata, Bahan Peledak, dan Amunisi",
    "ms": "Akta mengenai Pengurusan Senjata, Bahan Letupan dan Peluru",
}
items["KH-H094"] = {
    "vi": "Thông tư liên tịch số 490 về Xử phạt trong phạm vi thẩm quyền của Bộ Mỏ và Năng lượng",
    "th": "กฎกระทรวงร่วมฉบับที่ 490 ว่าด้วยการลงโทษภายในอำนาจหน้าที่ของกระทรวงเหมืองแร่และพลังงาน",
    "id": "Peraturan Menteri Bersama Nomor 490 tentang Sanksi dalam Kewenangan Kementerian Pertambangan dan Energi",
    "ms": "Peraturan Menteri Bersama Nombor 490 mengenai Penalti dalam Bidang Kuasa Kementerian Lombong dan Tenaga",
}
items["KH-H095"] = {
    "vi": "Luật thông qua Nghị định thư 5 của ASEAN về Nghĩa vụ bảo hiểm xe cơ giới",
    "th": "พระราชบัญญัติรับรองพิธีสาร 5 ของอาเซียนว่าด้วยหน้าที่การประกันภัยยานพาหนะ",
    "id": "Undang-Undang tentang Pengesahan Protokol 5 ASEAN tentang Kewajiban Asuransi Kendaraan",
    "ms": "Akta tentang Pengesahan Protokol 5 ASEAN mengenai Kewajipan Insurans Kenderaan",
}
items["KH-H096"] = {
    "vi": "Luật về Trái phiếu Chính phủ",
    "th": "พระราชบัญญัติว่าด้วยหลักทรัพย์รัฐบาล",
    "id": "Undang-Undang tentang Surat Berharga Negara",
    "ms": "Akta mengenai Sekuriti Kerajaan",
}
items["KH-H097"] = {
    "vi": "Luật về Quản lý cán bộ y tế",
    "th": "พระราชบัญญัติว่าด้วยการจัดการบุคลากรสาธารณสุข",
    "id": "Undang-Undang tentang Pengelolaan Tenaga Kesehatan",
    "ms": "Akta mengenai Pengurusan Profesional Kesihatan",
}
items["KH-H098"] = {
    "vi": "Luật về Quản lý đất đai, Quy hoạch đô thị và Xây dựng",
    "th": "พระราชบัญญัติว่าด้วยการจัดการที่ดิน การผังเมือง และการก่อสร้าง",
    "id": "Undang-Undang tentang Pengelolaan Pertanahan, Penataan Ruang, dan Konstruksi",
    "ms": "Akta mengenai Pengurusan Tanah, Perancangan Bandar dan Pembinaan",
}
items["KH-H100"] = {
    "vi": "Luật về Chế độ tài chính và Tài sản của tỉnh, thành phố",
    "th": "พระราชบัญญัติว่าด้วยระเบียบการคลังและทรัพย์สินของจังหวัดและเมือง",
    "id": "Undang-Undang tentang Rezim Keuangan dan Kekayaan Provinsi dan Kota",
    "ms": "Akta mengenai Rejim Kewangan dan Harta Provinsi dan Bandar",
}
items["KH-H101"] = {
    "vi": "Luật về Ngoại hối",
    "th": "พระราชบัญญัติว่าด้วยการแลกเปลี่ยนเงินตราต่างประเทศ",
    "id": "Undang-Undang tentang Valuta Asing",
    "ms": "Akta mengenai Pertukaran Asing",
}
items["KH-H102"] = {
    "vi": "Luật về Kiểm soát axit mạnh",
    "th": "พระราชบัญญัติว่าด้วยการควบคุมกรดแก่",
    "id": "Undang-Undang tentang Pengendalian Asam Kuat",
    "ms": "Akta mengenai Kawalan Asid Kuat",
}
items["KH-H103"] = {
    "vi": "Luật Đầu tư của Vương quốc Campuchia",
    "th": "พระราชบัญญัติการลงทุนแห่งราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang Investasi Kerajaan Kamboja",
    "ms": "Akta Pelaburan Kerajaan Kemboja",
}
items["KH-H104"] = {
    "vi": "Luật về Lưu trữ",
    "th": "พระราชบัญญัติว่าด้วยจดหมายเหตุ",
    "id": "Undang-Undang tentang Arsip",
    "ms": "Akta mengenai Arkib",
}
items["KH-H105"] = {
    "vi": "Sắc lệnh Hoàng gia về Nguyên tắc tổ chức dịch vụ công",
    "th": "พระราชกฤษฎีกาว่าด้วยหลักการจัดบริการสาธารณะ",
    "id": "Dekrit Kerajaan tentang Prinsip Penyelenggaraan Pelayanan Publik",
    "ms": "Dekri Kerajaan mengenai Prinsip Penyelenggaraan Perkhidmatan Awam",
}
items["KH-H106"] = {
    "vi": "Luật về các biện pháp phòng, chống lây lan COVID-19 và các bệnh truyền nhiễm nguy hiểm chết người khác",
    "th": "พระราชบัญญัติว่าด้วยมาตรการป้องกันการแพร่ระบาดของโควิด-19 และโรคติดเชื้อร้ายแรงอื่น ๆ",
    "id": "Undang-Undang tentang Langkah-Langkah Pencegahan Penyebaran COVID-19 dan Penyakit Menular Mematikan Lainnya",
    "ms": "Akta mengenai Langkah-Langkah Pencegahan Penyebaran COVID-19 dan Penyakit Berjangkit Maut Lain",
}
items["KH-H107"] = {
    "vi": "Luật Sửa đổi Luật Tài chính năm 1995",
    "th": "พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายการคลัง ค.ศ. 1995",
    "id": "Undang-Undang tentang Revisi Undang-Undang Keuangan Tahun 1995",
    "ms": "Akta mengenai Semakan Akta Kewangan Tahun 1995",
}

ZH_FIX = {
    "KH-H070": "关于通过东盟过境运输路线与设施指定议定书的法律",
    "KH-H082": "关于通过消除对妇女一切形式歧视公约任择议定书的法律",
    "KH-H083": "关于通过消除对妇女一切形式歧视公约的法律",
    "KH-H086": "关于批准柬埔寨王国成为反对劫持人质公约成员的法律",
    "KH-H090": "关于批准柬埔寨王国政府与中华人民共和国政府促进和保护投资协定的法律",
    "KH-H095": "关于通过东盟机动车辆保险义务议定书（第5号）的法律",
}
for k, v in ZH_FIX.items():
    items[k]["zh"] = v

doc = {
    "batch": "kh-p2-b02",
    "scope": "KH 柬埔寨法 第 2 批 48 部（H060–H107）",
    "note": "语义基准为 title.zh/title.en；Royal decree 译 Sắc lệnh Hoàng gia／พระราชกฤษฎีกา／Dekrit Kerajaan；"
            "Inter-Ministerial Prakas 译 Thông tư liên tịch／กฎกระทรวงร่วม／Peraturan Menteri Bersama。"
            "另按 §2.2 清除既有 zh 书名号 6 处。",
    "items": items,
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batches", "kh-p2-b02.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
