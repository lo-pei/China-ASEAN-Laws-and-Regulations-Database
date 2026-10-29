# -*- coding: utf-8 -*-
"""CN 第 30 批：_cn_rest.json 第 640–666 条（27 部，CN 收尾）。"""
import io, json, os

ITEMS = {}

NPC = {
    "vi": "Ủy ban Thường vụ Đại hội Đại biểu Nhân dân Toàn quốc",
    "th": "คณะกรรมาธิการสามัญประจำสภาผู้แทนประชาชนแห่งชาติ",
    "id": "Komite Tetap Kongres Rakyat Nasional",
    "ms": "Jawatankuasa Tetap Kongres Rakyat Kebangsaan",
}
BL = {
    "vi": "Bộ luật Hình sự nước Cộng hòa Nhân dân Trung Hoa",
    "th": "ประมวลกฎหมายอาญาแห่งสาธารณรัฐประชาชนจีน",
    "id": "Kitab Undang-Undang Hukum Pidana Republik Rakyat Tiongkok",
    "ms": "Kanun Keseksaan Republik Rakyat China",
}
CPL = {
    "vi": "Bộ luật Tố tụng Hình sự nước Cộng hòa Nhân dân Trung Hoa",
    "th": "ประมวลกฎหมายวิธีพิจารณาความอาญาแห่งสาธารณรัฐประชาชนจีน",
    "id": "Kitab Undang-Undang Hukum Acara Pidana Republik Rakyat Tiongkok",
    "ms": "Kanun Undang-Undang Prosedur Jenayah Republik Rakyat China",
}
HKBL = {
    "vi": "Luật Cơ bản Đặc khu Hành chính Hồng Kông nước Cộng hòa Nhân dân Trung Hoa",
    "th": "กฎหมายพื้นฐานเขตบริหารพิเศษฮ่องกงแห่งสาธารณรัฐประชาชนจีน",
    "id": "Undang-Undang Dasar Daerah Administratif Khusus Hong Kong Republik Rakyat Tiongkok",
    "ms": "Undang-Undang Asas Wilayah Pentadbiran Khas Hong Kong Republik Rakyat China",
}


def interp(law, art_vi, art_th, art_id, art_ms):
    return (
        "Giải thích của %s về %s %s" % (NPC["vi"], art_vi, law["vi"]),
        "การตีความของ%sว่าด้วย%s %s" % (NPC["th"], art_th, law["th"]),
        "Penafsiran %s tentang %s %s" % (NPC["id"], art_id, law["id"]),
        "Tafsiran %s mengenai %s %s" % (NPC["ms"], art_ms, law["ms"]),
    )


ITEMS["CN-LAW-0003"] = (
    "Nghị quyết của %s khóa năm về việc phê chuẩn Quy định của Quốc vụ viện về chế độ đãi ngộ thăm thân của người lao động" % NPC["vi"],
    "มติของ%sชุดที่ 5 ว่าด้วยการให้ความเห็นชอบข้อกำหนดของคณะรัฐมนตรีเกี่ยวกับสิทธิประโยชน์การเยี่ยมญาติของลูกจ้าง" % NPC["th"],
    "Keputusan %s Masa Kelima tentang Persetujuan Ketentuan Dewan Negara mengenai Tunjangan Kunjungan Keluarga bagi Pekerja" % NPC["id"],
    "Keputusan %s Penggal Kelima mengenai Kelulusan Peruntukan Majlis Negara berkenaan Elaun Melawat Keluarga bagi Pekerja" % NPC["ms"],
)
ITEMS["CN-LAW-0008"] = interp(
    HKBL,
    "khoản 4 Điều 22 và mục (3) khoản 2 Điều 24",
    "วรรคสี่ของมาตรา 22 และข้อ (3) ของวรรคสองมาตรา 24 แห่ง",
    "Ayat (4) Pasal 22 dan butir (3) Ayat (2) Pasal 24",
    "Fasal (4) Seksyen 22 dan butiran (3) Fasal (2) Seksyen 24",
)
ITEMS["CN-LAW-0010"] = interp(
    HKBL, "khoản 2 Điều 53", "วรรคสองของมาตรา 53 แห่ง",
    "Ayat (2) Pasal 53", "Fasal (2) Seksyen 53",
)
ITEMS["CN-LAW-0011"] = interp(
    HKBL, "Điều 104", "มาตรา 104 แห่ง", "Pasal 104", "Seksyen 104",
)
ITEMS["CN-LAW-0013"] = interp(
    BL, "Điều 228, Điều 342 và Điều 410", "มาตรา 228 มาตรา 342 และมาตรา 410 แห่ง",
    "Pasal 228, Pasal 342 dan Pasal 410", "Seksyen 228, Seksyen 342 dan Seksyen 410",
)
ITEMS["CN-LAW-0014"] = interp(
    BL, "khoản 1 Điều 294", "วรรคหนึ่งของมาตรา 294 แห่ง",
    "Ayat (1) Pasal 294", "Fasal (1) Seksyen 294",
)
ITEMS["CN-LAW-0015"] = interp(
    BL, "Điều 266", "มาตรา 266 แห่ง", "Pasal 266", "Seksyen 266",
)
ITEMS["CN-LAW-0017"] = interp(
    BL, "vấn đề áp dụng chủ thể của tội phạm về chức vụ tại Chương IX",
    "ปัญหาการใช้บังคับเกี่ยวกับผู้กระทำความผิดฐานความผิดเกี่ยวกับหน้าที่ในภาคที่ 9 แห่ง",
    "Masalah Penerapan Subjek Tindak Pidana Jabatan pada Bab IX",
    "Isu Penggunaan Subjek Kesalahan Jawatan pada Bab IX",
)
ITEMS["CN-LAW-0018"] = interp(
    BL, "Điều 341 và Điều 312", "มาตรา 341 และมาตรา 312 แห่ง",
    "Pasal 341 dan Pasal 312", "Seksyen 341 dan Seksyen 312",
)
ITEMS["CN-LAW-0019"] = interp(
    BL, "Điều 313", "มาตรา 313 แห่ง", "Pasal 313", "Seksyen 313",
)
ITEMS["CN-LAW-0020"] = interp(
    BL, "Điều 30", "มาตรา 30 แห่ง", "Pasal 30", "Seksyen 30",
)
ITEMS["CN-LAW-0021"] = interp(
    BL, "Điều 158 và Điều 159", "มาตรา 158 และมาตรา 159 แห่ง",
    "Pasal 158 dan Pasal 159", "Seksyen 158 dan Seksyen 159",
)
ITEMS["CN-LAW-0022"] = interp(
    BL, "quy định về các loại hoá đơn khác dùng cho hoàn thuế xuất khẩu và khấu trừ thuế",
    "บทบัญญัติเกี่ยวกับใบกำกับภาษีประเภทอื่นที่ใช้สำหรับการคืนภาษีส่งออกและการหักภาษี",
    "ketentuan tentang Faktur Pajak Jenis Lain untuk Pengembalian Pajak Ekspor dan Pengkreditan Pajak",
    "peruntukan tentang Invois Cukai Jenis Lain bagi Pemulangan Cukai Eksport dan Kredit Cukai",
)
ITEMS["CN-LAW-0023"] = interp(
    BL, "việc áp dụng quy định về cổ vật đối với hoá thạch động vật có xương sống cổ và hoá thạch người cổ có giá trị khoa học",
    "การใช้บทบัญญัติเกี่ยวกับโบราณวัตถุกับซากดึกดำบรรพ์สัตว์มีกระดูกสันหลังโบราณและซากดึกดำบรรพ์มนุษย์โบราณที่มีคุณค่าทางวิทยาศาสตร์",
    "penerapan ketentuan tentang benda purbakala terhadap fosil vertebrata purba dan fosil manusia purba yang bernilai ilmiah",
    "penggunaan peruntukan tentang artifak purba terhadap fosil vertebrata purba dan fosil manusia purba yang bernilai saintifik",
)
ITEMS["CN-LAW-0024"] = interp(
    BL, "quy định về thẻ tín dụng", "บทบัญญัติเกี่ยวกับบัตรเครดิต",
    "ketentuan tentang Kartu Kredit", "peruntukan tentang Kad Kredit",
)
ITEMS["CN-LAW-0025"] = interp(
    CPL, "Điều 292", "มาตรา 292 แห่ง", "Pasal 292", "Seksyen 292",
)
ITEMS["CN-LAW-0026"] = interp(
    CPL, "khoản 2 Điều 271", "วรรคสองของมาตรา 271 แห่ง",
    "Ayat (2) Pasal 271", "Fasal (2) Seksyen 271",
)
ITEMS["CN-LAW-0027"] = interp(
    CPL, "khoản 5 Điều 254 và khoản 2 Điều 257", "วรรคห้าของมาตรา 254 และวรรคสองของมาตรา 257 แห่ง",
    "Ayat (5) Pasal 254 dan Ayat (2) Pasal 257", "Fasal (5) Seksyen 254 dan Fasal (2) Seksyen 257",
)
ITEMS["CN-LAW-0028"] = interp(
    CPL, "khoản 3 Điều 79", "วรรคสามของมาตรา 79 แห่ง",
    "Ayat (3) Pasal 79", "Fasal (3) Seksyen 79",
)
ITEMS["CN-LAW-0030"] = (
    "Quyết định của %s về việc thực hiện quyền tài phán hình sự đối với các tội phạm quy định trong điều ước quốc tế mà nước Cộng hòa Nhân dân Trung Hoa ký kết hoặc tham gia" % NPC["vi"],
    "มติของ%sว่าด้วยการใช้เขตอำนาจทางอาญาต่อความผิดที่กำหนดในสนธิสัญญาระหว่างประเทศซึ่งสาธารณรัฐประชาชนจีนได้ลงนามหรือเข้าร่วม" % NPC["th"],
    "Keputusan %s tentang Pelaksanaan Yurisdiksi Pidana atas Tindak Pidana yang Diatur dalam Perjanjian Internasional yang Ditandatangani atau Diikuti Republik Rakyat Tiongkok" % NPC["id"],
    "Keputusan %s mengenai Pelaksanaan Bidang Kuasa Jenayah atas Kesalahan yang Diperuntukkan dalam Perjanjian Antarabangsa yang Ditandatangani atau Disertai Republik Rakyat China" % NPC["ms"],
)
ITEMS["CN-LAW-0031"] = (
    "Nghị quyết của %s về việc phê chuẩn Biện pháp tạm thời của Quốc vụ viện về bố trí cán bộ lão thành, yếu, tàn tật" % NPC["vi"],
    "มติของ%sว่าด้วยการให้ความเห็นชอบมาตรการชั่วคราวของคณะรัฐมนตรีเกี่ยวกับการจัดที่อยู่ให้เจ้าหน้าที่สูงอายุ อ่อนแอ หรือทุพพลภาพ" % NPC["th"],
    "Keputusan %s tentang Persetujuan Tata Cara Sementara Dewan Negara mengenai Penempatan Pegawai Lanjut Usia, Lemah dan Cacat" % NPC["id"],
    "Keputusan %s mengenai Kelulusan Tatacara Sementara Majlis Negara berkenaan Penempatan Pegawai Warga Emas, Lemah dan Cacat" % NPC["ms"],
)
ITEMS["CN-LAW-0032"] = (
    "Nghị quyết của %s về việc phê chuẩn Biện pháp tạm thời của Quốc vụ viện về nghỉ hưu, thôi việc của công nhân" % NPC["vi"],
    "มติของ%sว่าด้วยการให้ความเห็นชอบมาตรการชั่วคราวของคณะรัฐมนตรีเกี่ยวกับการเกษียณอายุและการลาออกจากงานของกรรมกร" % NPC["th"],
    "Keputusan %s tentang Persetujuan Tata Cara Sementara Dewan Negara mengenai Pensiun dan Pemberhentian Pekerja" % NPC["id"],
    "Keputusan %s mengenai Kelulusan Tatacara Sementara Majlis Negara berkenaan Persaraan dan Pemberhentian Pekerja" % NPC["ms"],
)
ITEMS["CN-LAW-0034"] = (
    "Quyết định của %s về việc phê chuẩn Quy định của Quân ủy Trung ương về trao Huân chương Công trạng và Vinh dự của Quân Giải phóng Nhân dân Trung Quốc cho cán bộ quân đội nghỉ hưu" % NPC["vi"],
    "มติของ%sว่าด้วยการให้ความเห็นชอบข้อกำหนดของคณะกรรมาธิการการทหารกลางเกี่ยวกับการมอบเหรียญเกียรติคุณและเกียรติยศของกองทัพปลดปล่อยประชาชนจีนแก่เจ้าหน้าที่ทหารเกษียณอายุ" % NPC["th"],
    "Keputusan %s tentang Persetujuan Ketentuan Komisi Militer Pusat mengenai Penganugerahan Medali Jasa dan Kehormatan Tentara Pembebasan Rakyat Tiongkok kepada Pejabat Militer Pensiunan" % NPC["id"],
    "Keputusan %s mengenai Kelulusan Peruntukan Suruhanjaya Ketenteraan Pusat berkenaan Penganugerahan Pingat Jasa dan Kehormatan Tentera Pembebasan Rakyat China kepada Pegawai Tentera Bersara" % NPC["ms"],
)
ITEMS["CN-LAW-0035"] = (
    "Quyết định của %s về việc lập Ngày kỷ niệm Phục hồi Đài Loan" % NPC["vi"],
    "มติของ%sว่าด้วยการกำหนดวันครบรอบการฟื้นฟูไต้หวัน" % NPC["th"],
    "Keputusan %s tentang Penetapan Hari Peringatan Pemulihan Taiwan" % NPC["id"],
    "Keputusan %s mengenai Penetapan Hari Peringatan Pemulihan Taiwan" % NPC["ms"],
)
ITEMS["CN-LAW-0040"] = (
    "Quyết định của %s về việc sửa đổi Luật Thuế bảo vệ môi trường nước Cộng hòa Nhân dân Trung Hoa" % NPC["vi"],
    "มติของ%sว่าด้วยการแก้ไขเพิ่มเติมพระราชบัญญัติภาษีสิ่งแวดล้อมแห่งสาธารณรัฐประชาชนจีน" % NPC["th"],
    "Keputusan %s tentang Perubahan atas Undang-Undang Pajak Perlindungan Lingkungan Republik Rakyat Tiongkok" % NPC["id"],
    "Keputusan %s mengenai Pindaan Undang-Undang Cukai Perlindungan Alam Sekitar Republik Rakyat China" % NPC["ms"],
)
ITEMS["CN-PIA-013"] = (
    "Phương pháp xác định hành vi vi phạm pháp luật trong thu thập, sử dụng thông tin cá nhân của ứng dụng di động",
    "วิธีการกำหนดพฤติกรรมการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของแอปพลิเคชันที่ฝ่าฝืนกฎหมาย",
    "Metode Penetapan Perbuatan Aplikasi yang Melanggar Hukum dalam Pengumpulan dan Penggunaan Informasi Pribadi",
    "Kaedah Penetapan Perbuatan Aplikasi yang Menyalahi Undang-Undang dalam Pengumpulan dan Penggunaan Maklumat Peribadi",
)
ITEMS["CN-REG-0142"] = (
    "Quy định bổ sung của Quốc vụ viện về vấn đề nghỉ hưu của chuyên gia cao cấp",
    "ข้อกำหนดเพิ่มเติมของคณะรัฐมนตรีว่าด้วยปัญหาการเกษียณอายุของผู้เชี่ยวชาญระดับสูง",
    "Ketentuan Tambahan Dewan Negara tentang Masalah Pensiun Pakar Senior",
    "Peruntukan Tambahan Majlis Negara mengenai Isu Persaraan Pakar Kanan",
)

with io.open(os.path.join("_work", "title-multi", "_cn_rest.json"), encoding="utf-8") as f:
    rest = json.load(f)
want = [r["id"] for r in rest[640:667]]
missing = [i for i in want if i not in ITEMS]
extra = [i for i in ITEMS if i not in want]
assert not missing, "缺条目: %s" % missing
assert not extra, "多余条目: %s" % extra

out = {}
for i in want:
    vi, th, iid, ms = ITEMS[i]
    out[i] = {"vi": vi, "th": th, "id": iid, "ms": ms}

doc = {
    "batch": "cn-p1-b30",
    "scope": "CN 收尾 27 部（_cn_rest.json 640–666）",
    "note": "语义基准 title.zh；常委会法律解释统一「Giải thích của Ủy ban Thường vụ …」句式；台湾表述为 Đài Loan (Trung Quốc) 语境下的「Phục hồi Đài Loan」。",
    "items": out,
}
dst = os.path.join("_work", "title-multi", "batches", "cn-p1-b30.json")
with io.open(dst, "w", encoding="utf-8", newline="\n") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)
print("写入 %s：%d 部" % (dst, len(out)))
