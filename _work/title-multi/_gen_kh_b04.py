# -*- coding: utf-8 -*-
"""KH 标题多语种批次生成器（第 4 批：末批 44 部，H157–H3906）。"""
import json, io, os

items = {}

items["KH-H157"] = {
    "vi": "Sắc lệnh Hoàng gia số 0819/1302 về việc thành lập Tòa án Phúc thẩm Battambang",
    "th": "พระราชกฤษฎีกาฉบับที่ 0819/1302 ว่าด้วยการจัดตั้งศาลอุทธรณ์พระตะบอง",
    "id": "Dekrit Kerajaan Nomor 0819/1302 tentang Pendirian Pengadilan Banding Battambang",
    "ms": "Dekri Kerajaan Nombor 0819/1302 mengenai Penubuhan Mahkamah Rayuan Battambang",
}
items["KH-H158"] = {
    "vi": "Sắc lệnh Hoàng gia số 0819/1300 về việc thành lập Tòa án Phúc thẩm Phnôm Pênh",
    "th": "พระราชกฤษฎีกาฉบับที่ 0819/1300 ว่าด้วยการจัดตั้งศาลอุทธรณ์พนมเปญ",
    "id": "Dekrit Kerajaan Nomor 0819/1300 tentang Pendirian Pengadilan Banding Phnom Penh",
    "ms": "Dekri Kerajaan Nombor 0819/1300 mengenai Penubuhan Mahkamah Rayuan Phnom Penh",
}
items["KH-H159"] = {
    "vi": "Luật về việc thành lập Bộ Công vụ",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงราชการพลเรือน",
    "id": "Undang-Undang tentang Pembentukan Kementerian Pelayanan Publik",
    "ms": "Akta mengenai Penubuhan Kementerian Perkhidmatan Awam",
}
items["KH-H161"] = {
    "vi": "Quyết định số 1212 về việc cấp Giấy phép thăm dò khoáng sản cho Công ty TNHH Allumina (Campuchia - Việt Nam)",
    "th": "คำสั่งฉบับที่ 1212 ว่าด้วยการออกใบอนุญาตสำรวจแร่ให้แก่บริษัท อัลลูมินา (กัมพูชา-เวียดนาม) จำกัด",
    "id": "Keputusan Nomor 1212 tentang Penerbitan Izin Eksplorasi Mineral kepada Allumina (Kamboja-Vietnam) Co. Ltd",
    "ms": "Perintah Nombor 1212 mengenai Pengeluaran Lesen Cari Gali Mineral kepada Allumina (Kemboja-Vietnam) Co. Ltd",
}
items["KH-H162"] = {
    "vi": "Sắc lệnh Hoàng gia số 0819/1303 về việc thành lập Tòa án Phúc thẩm Preah Sihanouk",
    "th": "พระราชกฤษฎีกาฉบับที่ 0819/1303 ว่าด้วยการจัดตั้งศาลอุทธรณ์พระสีหนุ",
    "id": "Dekrit Kerajaan Nomor 0819/1303 tentang Pendirian Pengadilan Banding Preah Sihanouk",
    "ms": "Dekri Kerajaan Nombor 0819/1303 mengenai Penubuhan Mahkamah Rayuan Preah Sihanouk",
}
items["KH-H163"] = {
    "vi": "Quy định bổ sung đối với Luật Kiểm toán",
    "th": "ข้อกำหนดเพิ่มเติมประกอบพระราชบัญญัติการสอบบัญชี",
    "id": "Ketentuan Tambahan atas Undang-Undang Audit",
    "ms": "Peruntukan Tambahan kepada Akta Audit",
}
items["KH-H164"] = {
    "vi": "Hoàng lệnh số 1021/009 về việc phê chuẩn Hiệp định Thương mại tự do giữa Chính phủ Hoàng gia Vương quốc Campuchia và Chính phủ Cộng hòa Nhân dân Trung Hoa",
    "th": "พระราชบัญญัติฉบับที่ 1021/009 ว่าด้วยการให้ความเห็นชอบความตกลงการค้าเสรีระหว่างรัฐบาลราชอาณาจักรกัมพูชากับรัฐบาลสาธารณรัฐประชาชนจีน",
    "id": "Undang-Undang Nomor 1021/009 tentang Persetujuan Perjanjian Perdagangan Bebas antara Pemerintah Kerajaan Kamboja dan Pemerintah Republik Rakyat Tiongkok",
    "ms": "Akta Nombor 1021/009 tentang Persetujuan Perjanjian Perdagangan Bebas antara Kerajaan Kemboja dan Kerajaan Republik Rakyat China",
}
items["KH-H165"] = {
    "vi": "Hoàng lệnh số 0620/022 ban hành Luật phê chuẩn việc Vương quốc Campuchia gia nhập Công ước Bern về bảo hộ các tác phẩm văn học và nghệ thuật năm 1886 và bản sửa đổi năm 1979",
    "th": "พระราชบัญญัติฉบับที่ 0620/022 ประกาศใช้พระราชบัญญัติให้ความเห็นชอบการที่ราชอาณาจักรกัมพูชาเข้าเป็นภาคีอนุสัญญาเบิร์นว่าด้วยการคุ้มครองวรรณกรรมและศิลปกรรม ค.ศ. 1886 และการแก้ไขเพิ่มเติม ค.ศ. 1979",
    "id": "Undang-Undang Nomor 0620/022 tentang Pengundangan Undang-Undang Persetujuan Kerajaan Kamboja Menjadi Pihak pada Konvensi Bern tentang Pelindungan Karya Sastra dan Seni Tahun 1886 dan Amandemen Tahun 1979",
    "ms": "Akta Nombor 0620/022 tentang Penguatkuasaan Akta Persetujuan Kerajaan Kemboja Menjadi Pihak kepada Konvensyen Bern mengenai Perlindungan Karya Sastera dan Seni Tahun 1886 dan Pindaan Tahun 1979",
}
items["KH-H166"] = {
    "vi": "Luật Sửa đổi Luật Quản lý tài chính năm 2009",
    "th": "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติการบริหารการเงินปี ค.ศ. 2009",
    "id": "Undang-Undang tentang Revisi Undang-Undang Pengelolaan Keuangan Tahun 2009",
    "ms": "Akta mengenai Semakan Akta Pengurusan Kewangan Tahun 2009",
}
items["KH-H167"] = {
    "vi": "Hoàng lệnh số 1021/010 về việc phê chuẩn Hiệp định Đối tác Kinh tế Toàn diện Khu vực",
    "th": "พระราชบัญญัติฉบับที่ 1021/010 ว่าด้วยการให้ความเห็นชอบความตกลงหุ้นส่วนทางเศรษฐกิจระดับภูมิภาค",
    "id": "Undang-Undang Nomor 1021/010 tentang Persetujuan Perjanjian Kemitraan Ekonomi Komprehensif Regional",
    "ms": "Akta Nombor 1021/010 tentang Persetujuan Perjanjian Perkongsian Ekonomi Komprehensif Serantau",
}
items["KH-H168"] = {
    "vi": "Luật về việc thành lập Bộ Phụ nữ và Cựu chiến binh",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงกิจการสตรีและทหารผ่านศึก",
    "id": "Undang-Undang tentang Pembentukan Kementerian Urusan Perempuan dan Veteran",
    "ms": "Akta mengenai Penubuhan Kementerian Hal Ehwal Wanita dan Veteran",
}
items["KH-H169"] = {
    "vi": "Luật về việc thành lập Bộ Xã hội, Cựu chiến binh và Phục hồi Thanh niên",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงกิจการสังคม ทหารผ่านศึกและการฟื้นฟูเยาวชน",
    "id": "Undang-Undang tentang Pembentukan Kementerian Urusan Sosial, Veteran, dan Rehabilitasi Pemuda",
    "ms": "Akta mengenai Penubuhan Kementerian Hal Ehwal Sosial, Veteran dan Pemulihan Belia",
}
items["KH-H170"] = {
    "vi": "Luật về việc thành lập Văn phòng Hội đồng Bộ trưởng",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งสำนักคณะรัฐมนตรี",
    "id": "Undang-Undang tentang Pembentukan Kantor Dewan Menteri",
    "ms": "Akta mengenai Penubuhan Pejabat Majlis Menteri",
}
items["KH-H171"] = {
    "vi": "Luật về việc thành lập Bộ Giáo dục, Thanh niên và Thể thao",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงศึกษาธิการ เยาวชน และกีฬา",
    "id": "Undang-Undang tentang Pembentukan Kementerian Pendidikan, Pemuda, dan Olahraga",
    "ms": "Akta mengenai Penubuhan Kementerian Pendidikan, Belia dan Sukan",
}
items["KH-H173"] = {
    "vi": "Sắc lệnh Hoàng gia về việc điều chỉnh thành phố Kep thành tỉnh Kep",
    "th": "พระราชกฤษฎีกาว่าด้วยการปรับเปลี่ยนเมืองเกบเป็นจังหวัดเกบ",
    "id": "Dekrit Kerajaan tentang Penyesuaian Kota Kep menjadi Provinsi Kep",
    "ms": "Dekri Kerajaan mengenai Penyelarasan Bandar Kep menjadi Wilayah Kep",
}
items["KH-H174"] = {
    "vi": "Luật về việc thành lập Bộ Nội vụ",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงมหาดไทย",
    "id": "Undang-Undang tentang Pembentukan Kementerian Dalam Negeri",
    "ms": "Akta mengenai Penubuhan Kementerian Dalam Negeri",
}
items["KH-H175"] = {
    "vi": "Luật về việc thành lập Ban Thư ký Hàng không Dân dụng",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งสำนักเลขาธิการการบินพลเรือน",
    "id": "Undang-Undang tentang Pembentukan Sekretariat Penerbangan Sipil",
    "ms": "Akta mengenai Penubuhan Sekretariat Penerbangan Awam",
}
items["KH-H176"] = {
    "vi": "Luật về việc thành lập Bộ Quản lý đất đai, Quy hoạch đô thị và Xây dựng",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงการจัดการที่ดิน การผังเมือง และการก่อสร้าง",
    "id": "Undang-Undang tentang Pembentukan Kementerian Pengelolaan Pertanahan, Penataan Ruang, dan Konstruksi",
    "ms": "Akta mengenai Penubuhan Kementerian Pengurusan Tanah, Perancangan Bandar dan Pembinaan",
}
items["KH-H177"] = {
    "vi": "Luật về việc thành lập Bộ Ngoại giao và Hợp tác Quốc tế",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงการต่างประเทศและความร่วมมือระหว่างประเทศ",
    "id": "Undang-Undang tentang Pembentukan Kementerian Luar Negeri dan Kerja Sama Internasional",
    "ms": "Akta mengenai Penubuhan Kementerian Luar Negeri dan Kerjasama Antarabangsa",
}
items["KH-H178"] = {
    "vi": "Luật về việc thành lập Bộ Phát triển Nông thôn",
    "th": "พระราชบัญญัติว่าด้วยการจัดตั้งกระทรวงการพัฒนาชนบท",
    "id": "Undang-Undang tentang Pembentukan Kementerian Pembangunan Desa",
    "ms": "Akta mengenai Penubuhan Kementerian Pembangunan Luar Bandar",
}
items["KH-H1853"] = {
    "vi": "Luật về Nhượng quyền (toàn văn)",
    "th": "พระราชบัญญัติว่าด้วยสัมปทาน (ฉบับเต็ม)",
    "id": "Undang-Undang tentang Konsesi (Teks Lengkap)",
    "ms": "Akta mengenai Konsesi (Teks Penuh)",
}
items["KH-H2265"] = {
    "vi": "Nghị định số 139 ngày 26 tháng 6 năm 2023",
    "th": "พระราชกฤษฎีกาฉบับที่ 139 ลงวันที่ 26 มิถุนายน ค.ศ. 2023",
    "id": "Peraturan Pemerintah Nomor 139 tanggal 26 Juni 2023",
    "ms": "Peraturan Kerajaan Nombor 139 bertarikh 26 Jun 2023",
}
items["KH-H2567"] = {
    "vi": "Luật về việc Thi hành Bộ luật Dân sự",
    "th": "พระราชบัญญัติว่าด้วยการบังคับใช้ประมวลกฎหมายแพ่งและพาณิชย์",
    "id": "Undang-Undang tentang Pelaksanaan Kitab Undang-Undang Hukum Perdata",
    "ms": "Akta mengenai Pelaksanaan Kanun Undang-Undang Sivil",
}
items["KH-H2653"] = {
    "vi": "Hiến pháp",
    "th": "รัฐธรรมนูญ",
    "id": "Undang-Undang Dasar",
    "ms": "Perlembagaan",
}
items["KH-H2668"] = {
    "vi": "Luật Đất đai",
    "th": "พระราชบัญญัติที่ดิน",
    "id": "Undang-Undang Pertanahan",
    "ms": "Akta Tanah",
}
items["KH-H2814"] = {
    "vi": "Luật về An sinh xã hội (Hoàng lệnh NS/RKM/0902/018)",
    "th": "พระราชบัญญัติว่าด้วยความมั่นคงทางสังคม (พระราชบัญญัติฉบับที่ NS/RKM/0902/018)",
    "id": "Undang-Undang tentang Jaminan Sosial (Undang-Undang Nomor NS/RKM/0902/018)",
    "ms": "Akta mengenai Keselamatan Sosial (Akta Nombor NS/RKM/0902/018)",
}
items["KH-H2978"] = {
    "vi": "Luật về Tổ chức và Hoạt động của Ngân hàng Quốc gia Campuchia",
    "th": "พระราชบัญญัติว่าด้วยการจัดองค์กรและการดำเนินงานของธนาคารแห่งชาติกัมพูชา",
    "id": "Undang-Undang tentang Organisasi dan Penyelenggaraan Bank Nasional Kamboja",
    "ms": "Akta mengenai Organisasi dan Pelaksanaan Bank Nasional Kemboja",
}
items["KH-H2980"] = {
    "vi": "Luật về Ngân hàng và Tổ chức tài chính",
    "th": "พระราชบัญญัติว่าด้วยการธนาคารและสถาบันการเงิน",
    "id": "Undang-Undang tentang Perbankan dan Lembaga Keuangan",
    "ms": "Akta mengenai Perbankan dan Institusi Kewangan",
}
items["KH-H2988"] = {
    "vi": "Luật về Bằng độc quyền sáng chế, Chứng nhận giải pháp hữu ích và Kiểu dáng công nghiệp",
    "th": "พระราชบัญญัติว่าด้วยสิทธิบัตร ใบรับรองแบบมีประโยชน์ และการออกแบบอุตสาหกรรม",
    "id": "Undang-Undang tentang Paten, Sertifikat Model Kegunaan, dan Desain Industri",
    "ms": "Akta mengenai Paten, Sijil Model Utiliti dan Reka Bentuk Industri",
}
items["KH-H3494"] = {
    "vi": "Nghị định số 38 về Hợp đồng và các nghĩa vụ khác",
    "th": "พระราชกฤษฎีกาฉบับที่ 38 ว่าด้วยสัญญาและหนี้สินอื่น",
    "id": "Peraturan Pemerintah Nomor 38 tentang Kontrak dan Kewajiban Lain",
    "ms": "Peraturan Kerajaan Nombor 38 mengenai Kontrak dan Liabiliti Lain",
}
items["KH-H3536"] = {
    "vi": "Luật về Quy chế thương mại và Đăng ký thương mại",
    "th": "พระราชบัญญัติว่าด้วยข้อบังคับทางการค้าและทะเบียนพาณิชย์",
    "id": "Undang-Undang tentang Peraturan Komersial dan Daftar Perusahaan",
    "ms": "Akta mengenai Peraturan Perdagangan dan Daftar Perniagaan",
}
items["KH-H3894"] = {
    "vi": "Bộ luật Dân sự Campuchia",
    "th": "ประมวลกฎหมายแพ่งและพาณิชย์กัมพูชา",
    "id": "Kitab Undang-Undang Hukum Perdata Kamboja",
    "ms": "Kanun Undang-Undang Sivil Kemboja",
}
items["KH-H3895"] = {
    "vi": "Bộ luật Tố tụng Dân sự Campuchia",
    "th": "ประมวลกฎหมายวิธีพิจารณาความแพ่งกัมพูชา",
    "id": "Kitab Undang-Undang Hukum Acara Perdata Kamboja",
    "ms": "Kanun Undang-Undang Prosedur Sivil Kemboja",
}
items["KH-H3896"] = {
    "vi": "Luật về Phá sản",
    "th": "พระราชบัญญัติว่าด้วยการล้มละลาย",
    "id": "Undang-Undang tentang Kepailitan",
    "ms": "Akta mengenai Insolvensi",
}
items["KH-H3897"] = {
    "vi": "Luật về Công cụ chuyển nhượng và Giao dịch thanh toán",
    "th": "พระราชบัญญัติว่าด้วยตราสารเปลี่ยนมือและการทำธุรกรรมการชำระเงิน",
    "id": "Undang-Undang tentang Surat Berharga yang Dapat Diperdagangkan dan Transaksi Pembayaran",
    "ms": "Akta mengenai Instrumen Boleh Niaga dan Urus Niaga Pembayaran",
}
items["KH-H3898"] = {
    "vi": "Luật về Công chứng",
    "th": "พระราชบัญญัติว่าด้วยการรับรองเอกสาร",
    "id": "Undang-Undang tentang Notaris",
    "ms": "Akta mengenai Notari",
}
items["KH-H3899"] = {
    "vi": "Luật Thuế năm 2004",
    "th": "พระราชบัญญัติภาษีอากร ค.ศ. 2004",
    "id": "Undang-Undang Perpajakan Tahun 2004",
    "ms": "Akta Cukai Tahun 2004",
}
items["KH-H3900"] = {
    "vi": "Luật Thuế",
    "th": "พระราชบัญญัติภาษีอากร",
    "id": "Undang-Undang Perpajakan",
    "ms": "Akta Cukai",
}
items["KH-H3901"] = {
    "vi": "Luật Đất đai (năm 2001)",
    "th": "พระราชบัญญัติที่ดิน (ค.ศ. 2001)",
    "id": "Undang-Undang Pertanahan (2001)",
    "ms": "Akta Tanah (2001)",
}
items["KH-H3902"] = {
    "vi": "Luật Đầu tư (năm 1994)",
    "th": "พระราชบัญญัติการลงทุน (ค.ศ. 1994)",
    "id": "Undang-Undang Investasi (1994)",
    "ms": "Akta Pelaburan (1994)",
}
items["KH-H3903"] = {
    "vi": "Luật Đầu tư của Vương quốc Campuchia",
    "th": "พระราชบัญญัติการลงทุนแห่งราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang Investasi Kerajaan Kamboja",
    "ms": "Akta Pelaburan Kerajaan Kemboja",
}
items["KH-H3904"] = {
    "vi": "Luật Đầu tư của Vương quốc Campuchia",
    "th": "พระราชบัญญัติการลงทุนแห่งราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang Investasi Kerajaan Kamboja",
    "ms": "Akta Pelaburan Kerajaan Kemboja",
}
items["KH-H3905"] = {
    "vi": "Bộ luật Dân sự Vương quốc Campuchia",
    "th": "ประมวลกฎหมายแพ่งและพาณิชย์แห่งราชอาณาจักรกัมพูชา",
    "id": "Kitab Undang-Undang Hukum Perdata Kerajaan Kamboja",
    "ms": "Kanun Undang-Undang Sivil Kerajaan Kemboja",
}
items["KH-H3906"] = {
    "vi": "Luật Thương mại điện tử",
    "th": "พระราชบัญญัติพาณิชย์อิเล็กทรอนิกส์",
    "id": "Undang-Undang Perdagangan Elektronik",
    "ms": "Akta Perdagangan Elektronik",
}

ZH_FIX = {
    "KH-H165": "第0620/022号王令：颁布关于批准柬埔寨王国加入1886年保护文学和艺术作品伯尔尼公约及其1979年修正案的法律",
}
for k, v in ZH_FIX.items():
    items[k]["zh"] = v

doc = {
    "batch": "kh-p2-b04",
    "scope": "KH 柬埔寨法 末批 44 部（H157–H3906）",
    "note": "语义基准为 title.zh/title.en；Royal Kram 按 Act 处理（Hoàng lệnh／พระราชบัญญัติฉบับที่／Undang-Undang Nomor）。"
            "另按 §2.2 清除既有 zh 书名号 1 处。",
    "items": items,
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batches", "kh-p2-b04.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
