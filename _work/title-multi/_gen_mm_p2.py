# -*- coding: utf-8 -*-
"""MM 标题多语种批次生成器（缅甸全部 80 部）。

语义基准：laws/<id>.json 的 title.zh 与 title.en。
层级词按 docs/07-标题多语种规范.md §5.2：
  Law            → vi Luật / th พระราชบัญญัติ / id Undang-Undang / ms Akta
  Rules/Regulations → vi Quy chế / th ข้อบังคับ / id Peraturan / ms Peraturan
  Code           → vi Bộ luật / th ประมวลกฎหมาย / id Kitab Undang-Undang / ms Kanun
  Constitution   → vi Hiến pháp / th รัฐธรรมนูญ / id Undang-Undang Dasar / ms Perlembagaan
  Ordinance      → vi Pháp lệnh / th ข้อบัญญัติ / id Peraturan / ms Peraturan
  Notification   → vi Thông báo / th ประกาศ / id Pengumuman / ms Pemberitahuan
  Directive      → vi Chỉ thị / th คำสั่ง / id Arahan / ms Arahan
  Order          → vi Lệnh / th คำสั่ง / id Perintah / ms Perintah
缅甸非泰国法域，年份一律 ค.ศ.（公历）。泰文层级词与主题词之间不加空格。
缩写（IBRD、Hluttaw）不展开、不加括号注释。
"""
import json, io, os

Y = lambda y: {"vi": " năm %d" % y, "th": " ค.ศ. %d" % y,
               "id": " Tahun %d" % y, "ms": " %d" % y}

LAW = {"vi": "Luật", "th": "พระราชบัญญัติ", "id": "Undang-Undang", "ms": "Akta"}
RULE = {"vi": "Quy chế", "th": "ข้อบังคับ", "id": "Peraturan", "ms": "Peraturan"}
CODE = {"vi": "Bộ luật", "th": "ประมวลกฎหมาย", "id": "Kitab Undang-Undang", "ms": "Kanun"}
CONS = {"vi": "Hiến pháp", "th": "รัฐธรรมนูญ", "id": "Undang-Undang Dasar", "ms": "Perlembagaan"}
ORD = {"vi": "Pháp lệnh", "th": "ข้อบัญญัติ", "id": "Peraturan", "ms": "Peraturan"}
NOTI = {"vi": "Thông báo", "th": "ประกาศ", "id": "Pengumuman", "ms": "Pemberitahuan"}
DIR = {"vi": "Chỉ thị", "th": "คำสั่ง", "id": "Arahan", "ms": "Arahan"}
ORDER = {"vi": "Lệnh", "th": "คำสั่ง", "id": "Perintah", "ms": "Perintah"}

SEP = {"vi": " ", "th": "", "id": " ", "ms": " "}


def mk(pre, term, *suf):
    out = {k: pre[k] + SEP[k] + term[k] for k in pre}
    for s in suf:
        for k in out:
            out[k] += s[k]
    return out


def raw(vi, th, id_, ms):
    return {"vi": vi, "th": th, "id": id_, "ms": ms}


items = {}

# ---- 仲裁 / 竞争 / 消费者 ----
items["MM-H001"] = mk(LAW, raw("Trọng tài", "อนุญาโตตุลาการ", "Arbitrase", "Timbang Tara"))
items["MM-H003"] = mk(LAW, raw("Cạnh tranh", "การแข่งขันทางการค้า", "Persaingan Usaha", "Persaingan"))
items["MM-H005"] = mk(LAW, raw("Bảo vệ người tiêu dùng", "คุ้มครองผู้บริโภค",
                               "Perlindungan Konsumen", "Perlindungan Pengguna"))
items["MM-H057"] = mk(LAW, raw("Bảo vệ người tiêu dùng", "คุ้มครองผู้บริโภค",
                               "Perlindungan Konsumen", "Perlindungan Pengguna"), Y(2019))

# ---- 知识产权 ----
items["MM-H006"] = mk(LAW, raw("Quyền tác giả", "ลิขสิทธิ์", "Hak Cipta", "Hak Cipta"))
items["MM-H059"] = mk(LAW, raw("Quyền tác giả", "ลิขสิทธิ์", "Hak Cipta", "Hak Cipta"), Y(2019))
items["MM-H106"] = mk(LAW, raw("Quyền tác giả", "ลิขสิทธิ์", "Hak Cipta", "Hak Cipta"), Y(2019))
items["MM-H017"] = mk(LAW, raw("Sáng chế", "สิทธิบัตร", "Paten", "Paten"))
items["MM-H032"] = mk(LAW, raw("Sáng chế", "สิทธิบัตร", "Paten", "Paten"), Y(2019))
items["MM-H060"] = mk(LAW, raw("Sáng chế", "สิทธิบัตร", "Paten", "Paten"), Y(2019))
items["MM-H020"] = mk(LAW, raw("Nhãn hiệu", "เครื่องหมายการค้า", "Merek", "Cap Dagangan"))
items["MM-H061"] = mk(LAW, raw("Nhãn hiệu", "เครื่องหมายการค้า", "Merek", "Cap Dagangan"), Y(2019))
items["MM-H101"] = mk(LAW, raw("Nhãn hiệu", "เครื่องหมายการค้า", "Merek", "Cap Dagangan"), Y(2019))
items["MM-H102"] = mk(LAW, raw("Kiểu dáng công nghiệp", "การออกแบบอุตสาหกรรม",
                               "Desain Industri", "Reka Bentuk Industri"), Y(2019))

# ---- 电子交易 ----
items["MM-H007"] = mk(LAW, raw("Giao dịch điện tử", "ธุรกรรมทางอิเล็กทรอนิกส์",
                               "Transaksi Elektronik", "Transaksi Elektronik"))

# ---- 破产 ----
items["MM-H009"] = mk(LAW, raw("Phá sản", "ล้มละลาย", "Kepailitan", "Insolvensi"), Y(2020))
items["MM-H105"] = mk(LAW, raw("Phá sản", "ล้มละลาย", "Kepailitan", "Insolvensi"))
items["MM-H010"] = mk(RULE, raw("Phá sản", "การล้มละลาย", "Kepailitan", "Insolvensi"))

# ---- 劳动 ----
items["MM-H012"] = mk(LAW, raw("Tiền lương tối thiểu", "ค่าจ้างขั้นต่ำ",
                               "Upah Minimum", "Upah Minimum"))
items["MM-H089"] = mk(LAW, raw("Tiền lương tối thiểu", "ค่าจ้างขั้นต่ำ",
                               "Upah Minimum", "Upah Minimum"), Y(2013))
items["MM-H058"] = mk(LAW, raw("Tiền lương tối thiểu Myanmar", "ค่าจ้างขั้นต่ำเมียนมา",
                               "Upah Minimum Myanmar", "Upah Minimum Myanmar"), Y(2013))
items["MM-H090"] = mk(RULE, raw("Tiền lương tối thiểu", "ค่าจ้างขั้นต่ำ",
                                "Upah Minimum", "Upah Minimum"),
                      {"vi": " (năm 2013)", "th": " (ค.ศ. 2013)",
                       "id": " (Tahun 2013)", "ms": " (2013)"})
items["MM-H025"] = mk(LAW, raw("Giải quyết tranh chấp lao động", "การระงับข้อพิพาทแรงงาน",
                               "Penyelesaian Perselisihan Perburuhan",
                               "Penyelesaian Pertikaian Buruh"))
items["MM-H087"] = mk(LAW, raw("Giải quyết tranh chấp lao động", "การระงับข้อพิพาทแรงงาน",
                               "Penyelesaian Perselisihan Perburuhan",
                               "Penyelesaian Pertikaian Buruh"), Y(2012))
items["MM-H086"] = mk(RULE, raw("Tổ chức lao động", "องค์กรแรงงาน",
                                "Organisasi Tenaga Kerja", "Pertubuhan Buruh"))

# ---- 公司 / 投资 ----
items["MM-H013"] = mk(LAW, raw("Công ty", "บริษัท", "Perseroan", "Syarikat"))
items["MM-H083"] = mk(LAW, raw("Công ty", "บริษัท", "Perseroan", "Syarikat"), Y(2017))
items["MM-H053"] = raw(
    "Luật Công ty Myanmar (Luật số 29 năm 2017)",
    "พระราชบัญญัติบริษัทเมียนมา (กฎหมายฉบับที่ 29 ค.ศ. 2017)",
    "Undang-Undang Perseroan Myanmar (Undang-Undang Nomor 29 Tahun 2017)",
    "Akta Syarikat Myanmar (Undang-Undang Nombor 29 Tahun 2017)")
items["MM-H036"] = items["MM-H053"]
items["MM-H014"] = mk(LAW, raw("Đầu tư", "การลงทุน", "Investasi", "Pelaburan"))
items["MM-H039"] = raw(
    "Luật Đầu tư (Luật của Pyidaungsu Hluttaw số 40/2016)",
    "พระราชบัญญัติการลงทุน (กฎหมายสภาประชาชนฉบับที่ 40/2016)",
    "Undang-Undang Investasi (Undang-Undang Pyidaungsu Hluttaw Nomor 40/2016)",
    "Akta Pelaburan (Undang-Undang Pyidaungsu Hluttaw Nombor 40/2016)")
items["MM-H093"] = mk(LAW, raw("Đầu tư Myanmar", "การลงทุนเมียนมา",
                               "Investasi Myanmar", "Pelaburan Myanmar"), Y(2016))
items["MM-H054"] = raw(
    "Quy chế Đầu tư Myanmar (Thông báo số 35 năm 2017)",
    "ข้อบังคับการลงทุนเมียนมา (ประกาศฉบับที่ 35 ค.ศ. 2017)",
    "Peraturan Investasi Myanmar (Pengumuman Nomor 35 Tahun 2017)",
    "Peraturan Pelaburan Myanmar (Pemberitahuan Nombor 35 Tahun 2017)")
items["MM-H094"] = raw(
    "Thông báo số 35/2017",
    "ประกาศฉบับที่ 35/2017",
    "Pengumuman Nomor 35/2017",
    "Pemberitahuan Nombor 35/2017")
items["MM-H099"] = raw(
    "Thông báo số 60/2018 về Điều lệ mẫu của công ty",
    "ประกาศฉบับที่ 60/2018 ว่าด้วยข้อบังคับบริษัทต้นแบบ",
    "Pengumuman Nomor 60/2018 tentang Anggaran Dasar Model Perusahaan",
    "Pemberitahuan Nombor 60/2018 tentang Perlembagaan Model Syarikat")
items["MM-H095"] = mk(RULE, raw("Khu kinh tế đặc biệt", "เขตเศรษฐกิจพิเศษ",
                                "Kawasan Ekonomi Khusus", "Zon Ekonomi Khas"))

# ---- 税收 ----
items["MM-H019"] = mk(LAW, raw("Quản lý thuế", "การบริหารภาษี",
                               "Administrasi Perpajakan", "Pentadbiran Cukai"))
items["MM-H021"] = mk(LAW, raw("Thuế Liên bang", "ภาษีสหภาพ",
                               "Perpajakan Kesatuan", "Percukaian Kesatuan"))
items["MM-H028"] = mk(LAW, raw("Thuế thu nhập", "ภาษีเงินได้",
                               "Pajak Penghasilan", "Cukai Pendapatan"))
items["MM-H055"] = mk(LAW, raw("Thuế thu nhập", "ภาษีเงินได้",
                               "Pajak Penghasilan", "Cukai Pendapatan"))

# ---- 争议解决 / 诉讼 ----
items["MM-H018"] = mk(LAW, raw("Giải quyết tranh chấp", "การระงับข้อพิพาท",
                               "Penyelesaian Sengketa", "Penyelesaian Pertikaian"),
                      {"vi": " (bản sửa đổi tháng 9 năm 2014)",
                       "th": " (ฉบับแก้ไข กันยายน ค.ศ. 2014)",
                       "id": " (Revisi September 2014)",
                       "ms": " (Semakan September 2014)"})
items["MM-H023"] = mk(LAW, raw("Trọng tài", "อนุญาโตตุลาการ",
                               "Arbitrase", "Timbang Tara"), Y(2016))
items["MM-H081"] = mk(LAW, raw("Trọng tài", "อนุญาโตตุลาการ",
                               "Arbitrase", "Timbang Tara"), Y(2016))
items["MM-H082"] = mk(CODE, raw("Tố tụng dân sự", "วิธีพิจารณาความแพ่ง",
                                "Hukum Acara Perdata", "Tatacara Sivil"))
items["MM-H111"] = mk(CODE, raw("Hình sự", "อาญา", "Hukum Pidana", "Keseksaan"))

# ---- 宪法 ----
items["MM-H051"] = raw(
    "Hiến pháp nước Cộng hòa Liên bang Myanmar năm 2008",
    "รัฐธรรมนูญแห่งสาธารณรัฐแห่งสหภาพเมียนมา ค.ศ. 2008",
    "Undang-Undang Dasar Republik Persatuan Myanmar Tahun 2008",
    "Perlembagaan Republik Kesatuan Myanmar 2008")
items["MM-H052"] = items["MM-H051"]
items["MM-H119"] = raw(
    "Hiến pháp nước Cộng hòa Liên bang Myanmar",
    "รัฐธรรมนูญแห่งสาธารณรัฐแห่งสหภาพเมียนมา",
    "Undang-Undang Dasar Republik Persatuan Myanmar",
    "Perlembagaan Republik Kesatuan Myanmar")

# ---- 金融 / 保险 ----
items["MM-H066"] = mk(LAW, raw("Bảo hiểm", "การประกันภัย", "Asuransi", "Insurans"), Y(1993))
items["MM-H098"] = mk(LAW, raw("Ngân hàng Trung ương Myanmar", "ธนาคารกลางเมียนมา",
                               "Bank Sentral Myanmar", "Bank Pusat Myanmar"), Y(2013))
items["MM-H065"] = mk(RULE, raw("thi hành Luật Ngân hàng Trung ương Myanmar",
                                "การดำเนินการตามพระราชบัญญัติธนาคารกลางเมียนมา",
                                "Pelaksanaan Undang-Undang Bank Sentral Myanmar",
                                "Pelaksanaan Akta Bank Pusat Myanmar"))
items["MM-H122"] = raw(
    "Chỉ thị IBRD số 1/2020: Chỉ thị về đại lý bảo hiểm",
    "คำสั่ง IBRD ฉบับที่ 1/2020: คำสั่งว่าด้วยตัวแทนประกันภัย",
    "Arahan IBRD Nomor 1/2020: Arahan tentang Agen Asuransi",
    "Arahan IBRD Nombor 1/2020: Arahan mengenai Ejen Insurans")
items["MM-H123"] = raw(
    "Chỉ thị IBRD số 2/2020: Chỉ thị về bảo hiểm qua ngân hàng",
    "คำสั่ง IBRD ฉบับที่ 2/2020: คำสั่งว่าด้วยการประกันภัยผ่านธนาคาร",
    "Arahan IBRD Nomor 2/2020: Arahan tentang Bancassurance",
    "Arahan IBRD Nombor 2/2020: Arahan mengenai Bancassurance")
items["MM-H124"] = raw(
    "Chỉ thị IBRD số 3/2020: Chỉ thị về phê duyệt sản phẩm bảo hiểm",
    "คำสั่ง IBRD ฉบับที่ 3/2020: คำสั่งว่าด้วยการอนุมัติผลิตภัณฑ์ประกันภัย",
    "Arahan IBRD Nomor 3/2020: Arahan tentang Persetujuan Produk Asuransi",
    "Arahan IBRD Nombor 3/2020: Arahan mengenai Kelulusan Produk Insurans")
items["MM-H125"] = raw(
    "Chỉ thị IBRD số 4/2020: Chỉ thị về tái bảo hiểm",
    "คำสั่ง IBRD ฉบับที่ 4/2020: คำสั่งว่าด้วยการประกันภัยต่อ",
    "Arahan IBRD Nomor 4/2020: Arahan tentang Reasuransi",
    "Arahan IBRD Nombor 4/2020: Arahan mengenai Insurans Semula")
items["MM-H126"] = raw(
    "Chỉ thị IBRD số 5/2020: Chỉ thị về các hợp đồng bảo hiểm hiện hữu tại Khu kinh tế đặc biệt Thilawa",
    "คำสั่ง IBRD ฉบับที่ 5/2020: คำสั่งว่าด้วยกรมธรรม์ประกันภัยที่มีอยู่เดิมในเขตเศรษฐกิจพิเศษทิลาวา",
    "Arahan IBRD Nomor 5/2020: Arahan tentang Polis Asuransi yang Ada di Kawasan Ekonomi Khusus Thilawa",
    "Arahan IBRD Nombor 5/2020: Arahan mengenai Polisi Insurans Sedia Ada di Zon Ekonomi Khas Thilawa")

# ---- 资源 / 环境 / 农业 ----
items["MM-H062"] = raw(
    "Luật Bảo tồn đa dạng sinh học và các khu bảo tồn năm 2018",
    "พระราชบัญญัติการอนุรักษ์ความหลากหลายทางชีวภาพและพื้นที่คุ้มครอง ค.ศ. 2018",
    "Undang-Undang Konservasi Keanekaragaman Hayati dan Kawasan Lindung Tahun 2018",
    "Akta Pemuliharaan Kepelbagaian Biologi dan Kawasan Perlindungan 2018")
items["MM-H064"] = mk(LAW, raw("Thủy sản nước ngọt", "การประมงน้ำจืด",
                               "Perikanan Air Tawar", "Perikanan Air Tawar"))
items["MM-H063"] = raw(
    "Luật Hàng hóa và Dịch vụ thiết yếu năm 2012",
    "พระราชบัญญัติสินค้าและบริการจำเป็น ค.ศ. 2012",
    "Undang-Undang Barang dan Jasa Penting Tahun 2012",
    "Akta Barang dan Perkhidmatan Perlu 2012")

# ---- 旅游 / 就业 ----
items["MM-H067"] = mk(LAW, raw("Khách sạn và Du lịch", "โรงแรมและการท่องเที่ยว",
                               "Perhotelan dan Pariwisata", "Hotel dan Pelancongan"), Y(1993))
items["MM-H096"] = mk(LAW, raw("Việc làm ở nước ngoài", "การจ้างงานในต่างประเทศ",
                               "Penempatan Kerja ke Luar Negeri",
                               "Pekerjaan di Luar Negara"),
                      {"vi": " (năm 1999)", "th": " (ค.ศ. 1999)",
                       "id": " (Tahun 1999)", "ms": " (1999)"})

# ---- 议会 / 自治 ----
items["MM-H068"] = raw(
    "Luật về Ủy ban Quản lý Hluttaw năm 2018",
    "พระราชบัญญัติว่าด้วยคณะกรรมการบริหารรัฐสภา ค.ศ. 2018",
    "Undang-Undang tentang Komite Pengelolaan Hluttaw Tahun 2018",
    "Akta mengenai Jawatankuasa Pengurusan Hluttaw 2018")
items["MM-H117"] = raw(
    "Luật về Tiền lương, Phụ cấp và Quyền lợi của Chủ tịch và Ủy viên Ban Chấp hành các Đơn vị tự quản và Khu tự quản",
    "พระราชบัญญัติว่าด้วยเงินเดือน เบี้ยเลี้ยง และสิทธิประโยชน์ของประธานและกรรมการบริหารของเขตปกครองตนเองและเขตปกครองตนเองพิเศษ",
    "Undang-Undang tentang Gaji, Tunjangan, dan Hak Ketua serta Anggota Komite Eksekutif Divisi Otonom dan Zona Otonom",
    "Akta mengenai Gaji, Elaun dan Keistimewaan Pengerusi serta Ahli Jawatankuasa Eksekutif Bahagian Berautonomi dan Zon Berautonomi")
items["MM-H118"] = raw(
    "Luật về Cơ quan lãnh đạo các Đơn vị tự quản và Khu tự quản",
    "พระราชบัญญัติว่าด้วยองค์กรนำของเขตปกครองตนเองและเขตปกครองตนเองพิเศษ",
    "Undang-Undang tentang Badan Pimpinan Divisi Otonom dan Zona Otonom",
    "Akta mengenai Badan Pimpinan Bahagian Berautonomi dan Zon Berautonomi")
items["MM-H114"] = raw(
    "Luật Sửa đổi Luật Đô thị bang Kayah",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติเทศบาลรัฐกะยา",
    "Undang-Undang Perubahan atas Undang-Undang Kotapraja Negara Bagian Kayah",
    "Akta Pindaan kepada Akta Perbandaran Negeri Kayah")
items["MM-H115"] = raw(
    "Luật Sửa đổi Luật các Ủy ban Đô thị bang Kayin",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติคณะกรรมการเทศบาลรัฐกะยิน",
    "Undang-Undang Perubahan atas Undang-Undang Komite Kotapraja Negara Bagian Kayin",
    "Akta Pindaan kepada Akta Jawatankuasa Perbandaran Negeri Kayin")

# ---- 其它单行法 ----
items["MM-H084"] = mk(LAW, raw("Xuất khẩu và Nhập khẩu", "การส่งออกและนำเข้า",
                               "Ekspor dan Impor", "Eksport dan Import"), Y(2012))
items["MM-H085"] = raw(
    "Luật Sửa đổi Luật Nhà máy năm 2016",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติโรงงาน ค.ศ. 2016",
    "Undang-Undang Perubahan atas Undang-Undang Pabrik Tahun 2016",
    "Akta Pindaan kepada Akta Kilang 2016")
items["MM-H088"] = raw(
    "Luật Sửa đổi Luật Nghỉ phép và Ngày lễ năm 1951 (tháng 7 năm 2014)",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติการลาพักผ่อนและวันหยุด ค.ศ. 1951 (กรกฎาคม ค.ศ. 2014)",
    "Undang-Undang Perubahan atas Undang-Undang Cuti dan Hari Libur 1951 (Juli 2014)",
    "Akta Pindaan kepada Akta Cuti dan Hari Kelepasan 1951 (Julai 2014)")
items["MM-H097"] = raw(
    "Luật Sửa đổi Luật Cửa hàng và Nơi làm việc năm 2016",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติร้านค้าและสถานที่ทำงาน ค.ศ. 2016",
    "Undang-Undang Perubahan atas Undang-Undang Toko dan Tempat Kerja Tahun 2016",
    "Akta Pindaan kepada Akta Kedai dan Tempat Kerja 2016")
items["MM-H107"] = mk(ORD, raw("thành lập tòa án để thực thi công lý trong giai đoạn hiện nay",
                               "จัดตั้งศาลเพื่อการบริหารงานยุติธรรมในระยะปัจจุบัน",
                               "Penetapan Pengadilan untuk Penyelenggaraan Keadilan pada Masa Sekarang",
                               "Penubuhan Mahkamah untuk Pentadbiran Keadilan pada Masa Kini"))
items["MM-H108"] = raw(
    "Sửa đổi Phụ lục 1 và 2 của Luật Hộ chiếu Myanmar",
    "การแก้ไขเพิ่มเติมภาคผนวก 1 และ 2 แห่งพระราชบัญญัติหนังสือเดินทางเมียนมา",
    "Perubahan atas Lampiran 1 dan 2 Undang-Undang Paspor Myanmar",
    "Pindaan kepada Jadual 1 dan 2 Akta Pasport Myanmar")
items["MM-H109"] = mk(ORDER, raw("bãi bỏ Luật Bảo vệ đoàn kết dân tộc năm 1964",
                                 "ยกเลิกพระราชบัญญัติคุ้มครองเอกภาพแห่งชาติ ค.ศ. 1964",
                                 "Pencabutan Undang-Undang Perlindungan Persatuan Nasional Tahun 1964",
                                 "Pembatalan Akta Perlindungan Perpaduan Nasional 1964"))
items["MM-H110"] = raw(
    "Luật về Ủy ban Thương mại Nông sản Nhà nước năm 1949",
    "พระราชบัญญัติคณะกรรมการการค้าผลิตผลเกษตรแห่งรัฐ ค.ศ. 1949",
    "Undang-Undang Komisi Perdagangan Hasil Pertanian Negara Tahun 1949",
    "Akta Suruhanjaya Perdagangan Hasil Pertanian Negeri 1949")
items["MM-H112"] = mk(LAW, raw("Đăng ký nuôi con nuôi", "การจดทะเบียนการรับบุตรบุญธรรม",
                               "Pencatatan Pengangkatan Anak",
                               "Pendaftaran Pengambilan Anak Angkat"))
items["MM-H113"] = raw(
    "Luật Liên hợp quốc (Quyền ưu đãi và miễn trừ)",
    "พระราชบัญญัติสหประชาชาติ (เอกสิทธิ์และความคุ้มกัน)",
    "Undang-Undang Perserikatan Bangsa-Bangsa (Hak Istimewa dan Kekebalan)",
    "Akta Pertubuhan Bangsa-Bangsa Bersatu (Keistimewaan dan Kekebalan)")
items["MM-H116"] = mk(LAW, raw("Quyền trẻ em", "สิทธิเด็ก", "Hak Anak", "Hak Kanak-Kanak"))
items["MM-H121"] = raw(
    "Luật Quyền của người khuyết tật",
    "พระราชบัญญัติสิทธิของคนพิการ",
    "Undang-Undang Hak Penyandang Disabilitas",
    "Akta Hak Orang Kurang Upaya")
items["MM-H120"] = raw(
    "Luật Nghỉ phép và Ngày lễ năm 1951",
    "พระราชบัญญัติการลาพักผ่อนและวันหยุด ค.ศ. 1951",
    "Undang-Undang Cuti dan Hari Libur 1951",
    "Akta Cuti dan Hari Kelepasan 1951")
items["MM-H016"] = mk(LAW, raw("Khu kinh tế đặc biệt", "เขตเศรษฐกิจพิเศษ",
                               "Kawasan Ekonomi Khusus", "Zon Ekonomi Khas"))

# ---- 顺带修掉的 zh 缺陷（§5.4 不用书名号） ----
items["MM-H109"]["zh"] = "废止1964年国家统一保护法的命令"

doc = {
    "batch": "mm-p2-b01",
    "scope": "MM 缅甸法全 80 部（四语 vi/th/id/ms 整域清零）",
    "note": "语义基准 title.zh/title.en；缅甸非泰国法域，年份一律 ค.ศ.；"
            "IBRD、Hluttaw 等缩写不展开；另按 §5.4 修 1 处 zh 书名号。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "mm-p2-b01.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
missing = [k for k, v in items.items() if not all(v.get(x) for x in ("vi", "th", "id", "ms"))]
print("四语不齐:", missing)
