# -*- coding: utf-8 -*-
"""PH 批次 1：条文数 >= 100 的核心法 38 部（四语逐条精译）。

口径：
- 层级词：Code -> Bộ luật / ประมวลกฎหมาย / Kitab Undang-Undang / Kanun Undang-Undang
          Act  -> Đạo luật / พระราชบัญญัติ / Undang-Undang / Akta
          Constitution -> Hiến pháp / รัฐธรรมนูญ / Konstitusi / Perlembagaan
- 泰语层级词与主题词之间不加空格；拉丁专名前留一个空格。
- 地名、机构名保留拉丁原文（与 ph-p1-b01/b02 存量一致）。
- 年份：公历；泰语用 ค.ศ.
"""
import io, json, os

ITEMS = {}

ITEMS["PH-H027"] = (
    "Bộ luật Dân sự Philippines",
    "ประมวลกฎหมายแพ่งฟิลิปปินส์",
    "Kitab Undang-Undang Hukum Perdata Filipina",
    "Kanun Undang-Undang Sivil Filipina",
)

ITEMS["PH-H5648"] = (
    "Bộ luật Chính quyền Địa phương năm 1991",
    "ประมวลกฎหมายการปกครองท้องถิ่น ค.ศ. 1991",
    "Kitab Undang-Undang Pemerintahan Daerah Tahun 1991",
    "Kanun Undang-Undang Kerajaan Tempatan 1991",
)

ITEMS["PH-CONSTITUTION-1987"] = (
    "Hiến pháp nước Cộng hòa Philippines năm 1987",
    "รัฐธรรมนูญแห่งสาธารณรัฐฟิลิปปินส์ ค.ศ. 1987",
    "Konstitusi Republik Filipina Tahun 1987",
    "Perlembagaan Republik Filipina 1987",
)

ITEMS["PH-LABOR-1974"] = (
    "Bộ luật Lao động Philippines",
    "ประมวลกฎหมายแรงงานฟิลิปปินส์",
    "Kitab Undang-Undang Ketenagakerjaan Filipina",
    "Kanun Undang-Undang Buruh Filipina",
)

ITEMS["PH-H9311"] = (
    "Đạo luật Hiện đại hóa Quản lý Hải quan và Thuế quan",
    "พระราชบัญญัติการปรับปรุงการบริหารศุลกากรและภาษีศุลกากรให้ทันสมัย",
    "Undang-Undang Modernisasi Administrasi Bea Cukai dan Tarif",
    "Akta Pemodenan Pentadbiran Kastam dan Tarif",
)

ITEMS["PH-H012"] = (
    "Bộ luật Thuế Nội địa Quốc gia",
    "ประมวลกฎหมายภาษีอากรภายในประเทศ",
    "Kitab Undang-Undang Pajak Dalam Negeri",
    "Kanun Undang-Undang Hasil Dalam Negeri",
)

ITEMS["PH-H7980"] = (
    "Bộ luật Hợp tác xã Philippines năm 2008",
    "ประมวลกฎหมายสหกรณ์ฟิลิปปินส์ ค.ศ. 2008",
    "Kitab Undang-Undang Koperasi Filipina Tahun 2008",
    "Kanun Undang-Undang Koperasi Filipina 2008",
)

ITEMS["PH-H011"] = (
    "Đạo luật Cải cách Thuế năm 1997 (sửa đổi Bộ luật Thuế Nội địa Quốc gia)",
    "พระราชบัญญัติปฏิรูปภาษี ค.ศ. 1997 (แก้ไขประมวลกฎหมายภาษีอากรภายในประเทศ)",
    "Undang-Undang Reformasi Perpajakan Tahun 1997 (mengubah Kitab Undang-Undang Pajak Dalam Negeri)",
    "Akta Pembaharuan Cukai 1997 (meminda Kanun Undang-Undang Hasil Dalam Negeri)",
)

ITEMS["PH-H4901"] = (
    "Bộ luật Bầu cử năm 1971",
    "ประมวลกฎหมายการเลือกตั้ง ค.ศ. 1971",
    "Kitab Undang-Undang Pemilihan Tahun 1971",
    "Kanun Undang-Undang Pilihan Raya 1971",
)

ITEMS["PH-H9499"] = (
    "Luật Tổ chức Bangsamoro năm 2019",
    "กฎหมายจัดตั้งบังซาโมโร ค.ศ. 2019",
    "Undang-Undang Organik Bangsamoro Tahun 2019",
    "Undang-Undang Organik Bangsamoro 2019",
)

ITEMS["PH-IP-1997"] = (
    "Bộ luật Sở hữu Trí tuệ Philippines",
    "ประมวลกฎหมายทรัพย์สินทางปัญญาฟิลิปปินส์",
    "Kitab Undang-Undang Kekayaan Intelektual Filipina",
    "Kanun Undang-Undang Harta Intelek Filipina",
)

ITEMS["PH-H7522"] = (
    "Luật Tổ chức Vùng Tự trị Hồi giáo Mindanao (mở rộng)",
    "กฎหมายจัดตั้งเขตปกครองตนเองมุสลิมมินดาเนา (ฉบับขยาย)",
    "Undang-Undang Organik Daerah Otonom Muslim Mindanao (Diperluas)",
    "Undang-Undang Organik Wilayah Autonomi Islam Mindanao (Diperluas)",
)

ITEMS["PH-H5262"] = (
    "Luật Tổ chức Vùng Tự trị Cordillera",
    "กฎหมายจัดตั้งเขตปกครองตนเองคอร์ดิเยรา",
    "Undang-Undang Organik Daerah Otonom Cordillera",
    "Undang-Undang Organik Wilayah Autonomi Cordillera",
)

ITEMS["PH-H274"] = (
    "Bộ luật Bầu cử (sửa đổi)",
    "ประมวลกฎหมายการเลือกตั้ง (ฉบับปรับปรุง)",
    "Kitab Undang-Undang Pemilihan (Revisi)",
    "Kanun Undang-Undang Pilihan Raya (Semakan)",
)

ITEMS["PH-H5231"] = (
    "Luật Tổ chức Vùng Tự trị Hồi giáo Mindanao",
    "กฎหมายจัดตั้งเขตปกครองตนเองมุสลิมมินดาเนา",
    "Undang-Undang Organik Daerah Otonom Muslim Mindanao",
    "Undang-Undang Organik Wilayah Autonomi Islam Mindanao",
)

ITEMS["PH-CORPORATION-2019"] = (
    "Bộ luật Doanh nghiệp (sửa đổi)",
    "ประมวลกฎหมายบริษัท (ฉบับปรับปรุง)",
    "Kitab Undang-Undang Perusahaan (Revisi)",
    "Kanun Undang-Undang Syarikat (Semakan)",
)

ITEMS["PH-H3148"] = (
    "Bộ luật Cải cách Ruộng đất Nông nghiệp",
    "ประมวลกฎหมายปฏิรูปที่ดินเพื่อเกษตรกรรม",
    "Kitab Undang-Undang Reformasi Agraria",
    "Kanun Undang-Undang Pembaharuan Tanah Pertanian",
)

ITEMS["PH-H8479"] = (
    "Đạo luật về Người lao động Di trú và Người Philippines ở Nước ngoài năm 2009 (sửa đổi)",
    "พระราชบัญญัติแรงงานอพยพและชาวฟิลิปปินส์ในต่างประเทศ ค.ศ. 2009 (ฉบับแก้ไข)",
    "Undang-Undang Pekerja Migran dan Warga Filipina di Luar Negeri Tahun 2009 (Perubahan)",
    "Akta Pekerja Migran dan Rakyat Filipina di Luar Negara 2009 (Pindaan)",
)

ITEMS["PH-H1769"] = (
    "Luật Cơ bản về Hợp tác xã",
    "พระราชบัญญัติพื้นฐานสหกรณ์ทั่วไป",
    "Undang-Undang Dasar Koperasi Umum",
    "Akta Asas Koperasi Am",
)

ITEMS["PH-H6912"] = (
    "Đạo luật Thành lập Vùng Tự trị Cordillera",
    "พระราชบัญญัติจัดตั้งเขตปกครองตนเองคอร์ดิเยรา",
    "Undang-Undang Pembentukan Daerah Otonom Cordillera",
    "Akta Penubuhan Wilayah Autonomi Cordillera",
)

ITEMS["PH-H8599"] = (
    "Đạo luật Phục hồi Tài chính và Phá sản năm 2010",
    "พระราชบัญญัติการฟื้นฟูทางการเงินและล้มละลาย ค.ศ. 2010",
    "Undang-Undang Rehabilitasi Keuangan dan Kepailitan Tahun 2010",
    "Akta Pemulihan Kewangan dan Insolvensi 2010",
)

ITEMS["PH-H359"] = (
    "Đạo luật Thành lập Ngân hàng Trung ương Philippines",
    "พระราชบัญญัติจัดตั้งธนาคารกลางฟิลิปปินส์",
    "Undang-Undang Pembentukan Bank Sentral Filipina",
    "Akta Penubuhan Bank Pusat Filipina",
)

ITEMS["PH-H6134"] = (
    "Đạo luật mới về Ngân hàng Trung ương",
    "พระราชบัญญัติธนาคารกลางฉบับใหม่",
    "Undang-Undang Baru Bank Sentral",
    "Akta Baharu Bank Pusat",
)

ITEMS["PH-H7020"] = (
    "Bộ luật Thủy sản Philippines năm 1998",
    "ประมวลกฎหมายการประมงฟิลิปปินส์ ค.ศ. 1998",
    "Kitab Undang-Undang Perikanan Filipina Tahun 1998",
    "Kanun Undang-Undang Perikanan Filipina 1998",
)

ITEMS["PH-H5428"] = (
    "Bộ luật Hợp tác xã Philippines",
    "ประมวลกฎหมายสหกรณ์ฟิลิปปินส์",
    "Kitab Undang-Undang Koperasi Filipina",
    "Kanun Undang-Undang Koperasi Filipina",
)

ITEMS["PH-H6909"] = (
    "Đạo luật Hiện đại hóa Nông nghiệp và Thủy sản năm 1997",
    "พระราชบัญญัติการพัฒนาการเกษตรและการประมงให้ทันสมัย ค.ศ. 1997",
    "Undang-Undang Modernisasi Pertanian dan Perikanan Tahun 1997",
    "Akta Pemodenan Pertanian dan Perikanan 1997",
)

ITEMS["PH-H10403"] = (
    "Đạo luật Cải cách Mua sắm Chính phủ (sửa đổi)",
    "พระราชบัญญัติปฏิรูปการจัดซื้อจัดจ้างภาครัฐ (ฉบับแก้ไข)",
    "Undang-Undang Reformasi Pengadaan Pemerintah (Perubahan)",
    "Akta Pembaharuan Perolehan Kerajaan (Pindaan)",
)

ITEMS["PH-H10700"] = (
    "Đạo luật Phân bổ Ngân sách Hoạt động của Chính phủ năm 2026",
    "พระราชบัญญัติจัดสรรงบประมาณการดำเนินงานของรัฐบาล ค.ศ. 2026",
    "Undang-Undang Pengalokasian Anggaran Penyelenggaraan Pemerintahan Tahun 2026",
    "Akta Peruntukan Wang Pentadbiran Kerajaan 2026",
)

ITEMS["PH-H8052"] = (
    "Đạo luật Du lịch năm 2009",
    "พระราชบัญญัติการท่องเที่ยว ค.ศ. 2009",
    "Undang-Undang Pariwisata Tahun 2009",
    "Akta Pelancongan 2009",
)

ITEMS["PH-H10370"] = (
    "Đạo luật Phân bổ Ngân sách Hoạt động của Chính phủ năm 2024",
    "พระราชบัญญัติจัดสรรงบประมาณการดำเนินงานของรัฐบาล ค.ศ. 2024",
    "Undang-Undang Pengalokasian Anggaran Penyelenggaraan Pemerintahan Tahun 2024",
    "Akta Peruntukan Wang Pentadbiran Kerajaan 2024",
)

ITEMS["PH-H3160"] = (
    "Đạo luật sửa đổi Hiến chương Thành phố Cebu",
    "พระราชบัญญัติแก้ไขกฎบัตรเมือง Cebu",
    "Undang-Undang mengubah Piagam Kota Cebu",
    "Akta meminda Piagam Bandaraya Cebu",
)

ITEMS["PH-H10713"] = (
    "Quy tắc Tố tụng về Các vụ án Sở hữu Trí tuệ (sửa đổi) năm 2020",
    "ข้อกำหนดวิธีพิจารณาคดีทรัพย์สินทางปัญญา (ฉบับปรับปรุง) ค.ศ. 2020",
    "Peraturan Tata Cara Perkara Kekayaan Intelektual (Revisi) Tahun 2020",
    "Kaedah Prosedur Kes Harta Intelek (Semakan) 2020",
)

ITEMS["PH-H2674"] = (
    "Đạo luật sửa đổi Hiến chương Thành phố Tacloban và cho các mục đích khác",
    "พระราชบัญญัติแก้ไขกฎบัตรเมือง Tacloban และเพื่อวัตถุประสงค์อื่น",
    "Undang-Undang mengubah Piagam Kota Tacloban dan untuk tujuan lain",
    "Akta meminda Piagam Bandaraya Tacloban dan untuk tujuan lain",
)

ITEMS["PH-H9398"] = (
    "Đạo luật Điều chỉnh Mức Tiền phạt và Giá trị Tài sản làm Căn cứ Xác định Hình phạt",
    "พระราชบัญญัติปรับปรุงจำนวนค่าปรับและมูลค่าทรัพย์สินที่ใช้เป็นฐานในการกำหนดโทษ",
    "Undang-Undang Penyesuaian Nilai Denda dan Harta sebagai Dasar Penetapan Hukuman",
    "Akta Penyelarasan Nilai Denda dan Harta sebagai Asas Penetapan Hukuman",
)

ITEMS["PH-H390"] = (
    "Đạo luật Tư pháp năm 1948",
    "พระราชบัญญัติตุลาการ ค.ศ. 1948",
    "Undang-Undang Peradilan Tahun 1948",
    "Akta Kehakiman 1948",
)

ITEMS["PH-H4294"] = (
    "Đạo luật thành lập Thành phố Batangas",
    "พระราชบัญญัติจัดตั้งเมือง Batangas",
    "Undang-Undang membentuk Kota Batangas",
    "Akta mewujudkan Bandaraya Batangas",
)

ITEMS["PH-H4644"] = (
    "Đạo luật thành lập Thành phố San Jose",
    "พระราชบัญญัติจัดตั้งเมือง San Jose",
    "Undang-Undang membentuk Kota San Jose",
    "Akta mewujudkan Bandaraya San Jose",
)

ITEMS["PH-H500"] = (
    "Hiến chương Thành phố Manila (sửa đổi)",
    "กฎบัตรเมือง Manila (ฉบับแก้ไข)",
    "Piagam Kota Manila (Revisi)",
    "Piagam Bandaraya Manila (Semakan)",
)

OUT = {
    "batch": "ph-p1-b03",
    "scope": "PH 核心法 38 部（条文数 >= 100，含民法典/宪法/各类法典）",
    "items": {
        k: {"vi": v[0], "th": v[1], "id": v[2], "ms": v[3]}
        for k, v in ITEMS.items()
    },
}

dst = os.path.join(os.path.dirname(__file__), "batches", "ph-p1-b03.json")
io.open(dst, "w", encoding="utf-8", newline="\n").write(
    json.dumps(OUT, ensure_ascii=False, indent=1)
)
print("写入", dst, "部数", len(OUT["items"]))
