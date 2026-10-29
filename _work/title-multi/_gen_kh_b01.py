# -*- coding: utf-8 -*-
"""KH 标题多语种批次生成器（第 1 批：48 部）。

语义基准：laws/<id>.json 的 title.zh（人工译名）与 title.en。
层级词按 docs/07-标题多语种规范.md §5.2 术语表：
  Law        → vi Luật / th พระราชบัญญัติ / id Undang-Undang / ms Akta
  Civil Code → vi Bộ luật Dân sự / th ประมวลกฎหมายแพ่งและพาณิชย์ /
               id Kitab Undang-Undang Hukum Perdata / ms Kanun Undang-Undang Sivil
  宪法        → vi Hiến pháp / th รัฐธรรมนูญ / id Undang-Undang Dasar / ms Perlembagaan
  Royal Kram → vi Hoàng lệnh / th พระราชบัญญัติฉบับที่ / id Undang-Undang Nomor / ms Akta Nombor
非泰国年份一律用 ค.ศ.（公历），不作佛历换算，避免换算错误。
"""
import json, io, os

items = {}

FISCAL = {
    "KH-H037": (2010, "fin"), "KH-H040": (2009, "fin"), "KH-H041": (2008, "fin"),
    "KH-H048": (2006, "fin"), "KH-H049": (2005, "fin"), "KH-H052": (2014, "fin"),
    "KH-H058": (2012, "fin"),
    "KH-H051": (2012, "set"), "KH-H054": (2009, "set"), "KH-H059": (2008, "set"),
}
for kid, (yr, kind) in FISCAL.items():
    if kind == "fin":
        items[kid] = {
            "vi": "Luật Quản lý tài chính năm %d" % yr,
            "th": "พระราชบัญญัติการบริหารการเงินปี ค.ศ. %d" % yr,
            "id": "Undang-Undang Pengelolaan Keuangan Tahun %d" % yr,
            "ms": "Akta Pengurusan Kewangan Tahun %d" % yr,
        }
    else:
        items[kid] = {
            "vi": "Luật Quyết toán ngân sách nhà nước năm %d" % yr,
            "th": "พระราชบัญญัติการชำระบัญชีงบประมาณแผ่นดินประจำปี ค.ศ. %d" % yr,
            "id": "Undang-Undang Pertanggungjawaban Anggaran Pendapatan dan Belanja Negara Tahun %d" % yr,
            "ms": "Akta Penyelesaian Belanjawan Negara Tahun %d" % yr,
        }

items["KH-H001"] = {
    "vi": "Luật Trọng tài thương mại",
    "th": "พระราชบัญญัติอนุญาโตตุลาการทางการค้า",
    "id": "Undang-Undang Arbitrase Komersial",
    "ms": "Akta Timbang Tara Perdagangan",
}
items["KH-H003"] = {
    "vi": "Luật Lao động",
    "th": "พระราชบัญญัติแรงงาน",
    "id": "Undang-Undang Ketenagakerjaan",
    "ms": "Akta Buruh",
}
items["KH-H004"] = {
    "vi": "Luật về Doanh nghiệp thương mại",
    "th": "พระราชบัญญัติว่าด้วยวิสาหกิจการค้า",
    "id": "Undang-Undang tentang Perusahaan Komersial",
    "ms": "Akta mengenai Perusahaan Perdagangan",
}
items["KH-H005"] = {
    "vi": "Luật về Nhãn hiệu, Tên thương mại và Hành vi cạnh tranh không lành mạnh",
    "th": "พระราชบัญญัติว่าด้วยเครื่องหมายการค้า ชื่อทางการค้า และการกระทำอันเป็นการแข่งขันที่ไม่เป็นธรรม",
    "id": "Undang-Undang tentang Merek, Nama Dagang, dan Perbuatan Persaingan Tidak Sehat",
    "ms": "Akta mengenai Cap Dagangan, Nama Dagang dan Perbuatan Persaingan Tidak Adil",
}
items["KH-H007"] = {
    "vi": "Hiến pháp",
    "th": "รัฐธรรมนูญ",
    "id": "Undang-Undang Dasar",
    "ms": "Perlembagaan",
}
items["KH-H008"] = {
    "vi": "Luật Đầu tư",
    "th": "พระราชบัญญัติการลงทุน",
    "id": "Undang-Undang Investasi",
    "ms": "Akta Pelaburan",
}
items["KH-H011"] = {
    "vi": "Bộ luật Dân sự",
    "th": "ประมวลกฎหมายแพ่งและพาณิชย์",
    "id": "Kitab Undang-Undang Hukum Perdata",
    "ms": "Kanun Undang-Undang Sivil",
}
items["KH-H012"] = {
    "vi": "Luật Thương mại điện tử",
    "th": "พระราชบัญญัติพาณิชย์อิเล็กทรอนิกส์",
    "id": "Undang-Undang Perdagangan Elektronik",
    "ms": "Akta Perdagangan Elektronik",
}
items["KH-H014"] = {
    "vi": "Luật về Chỉ dẫn địa lý",
    "th": "พระราชบัญญัติว่าด้วยสิ่งบ่งชี้ทางภูมิศาสตร์",
    "id": "Undang-Undang tentang Indikasi Geografis",
    "ms": "Akta mengenai Petunjuk Geografi",
}
items["KH-H015"] = {
    "vi": "Luật về Quyền tác giả và Quyền liên quan",
    "th": "พระราชบัญญัติว่าด้วยลิขสิทธิ์และสิทธิข้างเคียง",
    "id": "Undang-Undang tentang Hak Cipta dan Hak Terkait",
    "ms": "Akta mengenai Hak Cipta dan Hak Berkaitan",
}
items["KH-H017"] = {
    "vi": "Cơ sở dữ liệu thương mại quốc gia",
    "th": "ฐานข้อมูลการค้าแห่งชาติ",
    "id": "Repositori Perdagangan Nasional",
    "ms": "Repositori Perdagangan Nasional",
}
items["KH-H022"] = {
    "vi": "Luật phê chuẩn Kế hoạch Phát triển Chiến lược Quốc gia giai đoạn 2014-2018",
    "th": "พระราชบัญญัติให้ความเห็นชอบแผนพัฒนายุทธศาสตร์แห่งชาติ ค.ศ. 2014-2018",
    "id": "Undang-Undang tentang Persetujuan Rencana Pembangunan Strategis Nasional 2014-2018",
    "ms": "Akta mengenai Kelulusan Rancangan Pembangunan Strategik Nasional 2014-2018",
}
items["KH-H023"] = {
    "vi": "Luật thông qua Nghị định thư về việc Vương quốc Campuchia tham gia Tổ chức Thương mại Thế giới",
    "th": "พระราชบัญญัติรับรองพิธีสารว่าด้วยการเข้าร่วมองค์การการค้าโลกของราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Pengesahan Protokol Keikutsertaan Kerajaan Kamboja dalam Organisasi Perdagangan Dunia",
    "ms": "Akta tentang Pengesahan Protokol Penyertaan Kerajaan Kemboja dalam Pertubuhan Perdagangan Dunia",
}
items["KH-H024"] = {
    "vi": "Luật về Bảo vệ thực vật và Kiểm dịch",
    "th": "พระราชบัญญัติว่าด้วยการคุ้มครองพันธุ์พืชและการกักกัน",
    "id": "Undang-Undang tentang Perlindungan Tanaman dan Karantina",
    "ms": "Akta mengenai Perlindungan Tanaman dan Kuarantin",
}
items["KH-H025"] = {
    "vi": "Luật phê chuẩn việc Vương quốc Campuchia gia nhập Nghị định thư Cartagena về An toàn sinh học",
    "th": "พระราชบัญญัติให้ความเห็นชอบการเข้าเป็นภาคีพิธีสารคาร์ตาเฮนาว่าด้วยความปลอดภัยทางชีวภาพของราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Persetujuan Kerajaan Kamboja Menjadi Pihak pada Protokol Cartagena tentang Keamanan Hayati",
    "ms": "Akta tentang Persetujuan Kerajaan Kemboja Menjadi Pihak kepada Protokol Cartagena mengenai Keselamatan Biologi",
}
items["KH-H026"] = {
    "vi": "Luật phê chuẩn việc Vương quốc Campuchia gia nhập Công ước về Kiểm soát thuốc lá",
    "th": "พระราชบัญญัติให้ความเห็นชอบการเข้าเป็นภาคีอนุสัญญาว่าด้วยการควบคุมยาสูบของราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Persetujuan Kerajaan Kamboja Menjadi Pihak pada Konvensi Pengendalian Tembakau",
    "ms": "Akta tentang Persetujuan Kerajaan Kemboja Menjadi Pihak kepada Konvensyen Kawalan Tembakau",
}
items["KH-H027"] = {
    "vi": "Luật về Tư pháp người chưa thành niên",
    "th": "พระราชบัญญัติว่าด้วยกระบวนการยุติธรรมสําหรับผู้เยาว์",
    "id": "Undang-Undang tentang Peradilan Anak",
    "ms": "Akta mengenai Keadilan Juvana",
}
items["KH-H028"] = {
    "vi": "Luật Viễn thông",
    "th": "พระราชบัญญัติโทรคมนาคม",
    "id": "Undang-Undang Telekomunikasi",
    "ms": "Akta Telekomunikasi",
}
items["KH-H029"] = {
    "vi": "Luật phê chuẩn việc Vương quốc Campuchia gia nhập Hiệp ước về Cấm vũ khí hạt nhân",
    "th": "พระราชบัญญัติให้ความเห็นชอบการเข้าเป็นภาคีสนธิสัญญาว่าด้วยการห้ามอาวุธนิวเคลียร์ของราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Persetujuan Kerajaan Kamboja Menjadi Pihak pada Traktat Pelarangan Senjata Nuklir",
    "ms": "Akta tentang Persetujuan Kerajaan Kemboja Menjadi Pihak kepada Perjanjian Larangan Senjata Nuklear",
}
items["KH-H030"] = {
    "vi": "Luật về Giao dịch bảo đảm",
    "th": "พระราชบัญญัติว่าด้วยธุรกรรมที่มีหลักประกัน",
    "id": "Undang-Undang tentang Transaksi Jaminan",
    "ms": "Akta mengenai Urus Niaga Bercagar",
}
items["KH-H031"] = {
    "vi": "Luật phê chuẩn việc Vương quốc Campuchia gia nhập Hiệp ước Cấm thử vũ khí hạt nhân toàn diện",
    "th": "พระราชบัญญัติให้ความเห็นชอบการเข้าเป็นภาคีสนธิสัญญาห้ามทดลองอาวุธนิวเคลียร์โดยสมบูรณ์ของราชอาณาจักรกัมพูชา",
    "id": "Undang-Undang tentang Persetujuan Kerajaan Kamboja Menjadi Pihak pada Traktat Pelarangan Menyeluruh Uji Coba Nuklir",
    "ms": "Akta tentang Persetujuan Kerajaan Kemboja Menjadi Pihak kepada Perjanjian Larangan Menyeluruh Ujian Nuklear",
}
items["KH-H032"] = {
    "vi": "Hoàng lệnh số 1222/014 về việc chi ngân sách nhà nước năm 2021",
    "th": "พระราชบัญญัติฉบับที่ 1222/014 ว่าด้วยการจ่ายงบประมาณแผ่นดินประจำปี ค.ศ. 2021",
    "id": "Undang-Undang Nomor 1222/014 tentang Pembayaran Anggaran Negara Tahun 2021",
    "ms": "Akta Nombor 1222/014 mengenai Pembayaran Belanjawan Negara Tahun 2021",
}
items["KH-H033"] = {
    "vi": "Luật Quản lý tài chính năm 2022",
    "th": "พระราชบัญญัติการบริหารการเงิน ค.ศ. 2022",
    "id": "Undang-Undang Pengelolaan Keuangan Tahun 2022",
    "ms": "Akta Pengurusan Kewangan Tahun 2022",
}
items["KH-H034"] = {
    "vi": "Hoàng lệnh số 1121/018 ban hành Luật về Hợp tác công tư",
    "th": "พระราชบัญญัติฉบับที่ 1121/018 ประกาศใช้พระราชบัญญัติว่าด้วยความร่วมมือระหว่างภาครัฐและภาคเอกชน",
    "id": "Undang-Undang Nomor 1121/018 tentang Pengundangan Undang-Undang Kerja Sama Pemerintah dan Badan Usaha",
    "ms": "Akta Nombor 1121/018 tentang Penguatkuasaan Akta Kerjasama Awam-Swasta",
}
items["KH-H035"] = {
    "vi": "Luật về Khu bảo tồn thiên nhiên",
    "th": "พระราชบัญญัติว่าด้วยพื้นที่คุ้มครองธรรมชาติ",
    "id": "Undang-Undang tentang Kawasan Lindung Alam",
    "ms": "Akta mengenai Kawasan Perlindungan Semula Jadi",
}
items["KH-H036"] = {
    "vi": "Luật về Hợp tác công tư",
    "th": "พระราชบัญญัติว่าด้วยความร่วมมือระหว่างภาครัฐและภาคเอกชน",
    "id": "Undang-Undang tentang Kerja Sama Pemerintah dan Badan Usaha",
    "ms": "Akta mengenai Kerjasama Awam-Swasta",
}
items["KH-H038"] = {
    "vi": "Luật về Cộng đồng nông nghiệp",
    "th": "พระราชบัญญัติว่าด้วยชุมชนเกษตรกรรม",
    "id": "Undang-Undang tentang Komunitas Pertanian",
    "ms": "Akta mengenai Komuniti Pertanian",
}
items["KH-H042"] = {
    "vi": "Luật Quyết toán ngân sách nhà nước năm 2021",
    "th": "พระราชบัญญัติการชำระบัญชีงบประมาณแผ่นดินประจำปี ค.ศ. 2021",
    "id": "Undang-Undang Pertanggungjawaban Anggaran Pendapatan dan Belanja Negara Tahun 2021",
    "ms": "Akta Penyelesaian Belanjawan Negara Tahun 2021",
}
items["KH-H043"] = {
    "vi": "Luật Quản lý tài chính năm 2023",
    "th": "พระราชบัญญัติการบริหารการเงิน ค.ศ. 2023",
    "id": "Undang-Undang Pengelolaan Keuangan Tahun 2023",
    "ms": "Akta Pengurusan Kewangan Tahun 2023",
}
items["KH-H044"] = {
    "vi": "Hoàng lệnh số 1224/007 ban hành Luật Quyết toán ngân sách nhà nước năm 2023",
    "th": "พระราชบัญญัติฉบับที่ 1224/007 ประกาศใช้พระราชบัญญัติการชำระบัญชีงบประมาณแผ่นดินประจำปี ค.ศ. 2023",
    "id": "Undang-Undang Nomor 1224/007 tentang Pengundangan Undang-Undang Pertanggungjawaban Anggaran Negara Tahun 2023",
    "ms": "Akta Nombor 1224/007 tentang Penguatkuasaan Akta Penyelesaian Belanjawan Negara Tahun 2023",
}
items["KH-H045"] = {
    "vi": "Luật phê chuẩn Hiệp định bổ sung giữa Vương quốc Campuchia và Cộng hòa Xã hội Chủ nghĩa Việt Nam đối với Hiệp ước hoạch định biên giới quốc gia năm 1985 và Hiệp định bổ sung năm 2005",
    "th": "พระราชบัญญัติให้ความเห็นชอบความตกลงเพิ่มเติมระหว่างราชอาณาจักรกัมพูชากับสาธารณรัฐสังคมนิยมเวียดนามว่าด้วยสนธิสัญญากำหนดเขตแดนแห่งรัฐ ค.ศ. 1985 และความตกลงเพิ่มเติม ค.ศ. 2005",
    "id": "Undang-Undang tentang Persetujuan Perjanjian Tambahan antara Kerajaan Kamboja dan Republik Sosialis Vietnam atas Perjanjian Penetapan Batas Negara Tahun 1985 dan Perjanjian Tambahan Tahun 2005",
    "ms": "Akta tentang Persetujuan Perjanjian Tambahan antara Kerajaan Kemboja dan Republik Sosialis Vietnam bagi Perjanjian Penetapan Sempadan Negara Tahun 1985 dan Perjanjian Tambahan Tahun 2005",
}
items["KH-H046"] = {
    "vi": "Luật về Phát hành và Giao dịch chứng khoán công chúng",
    "th": "พระราชบัญญัติว่าด้วยการออกและการซื้อขายหลักทรัพย์ต่อสาธารณะ",
    "id": "Undang-Undang tentang Penerbitan dan Perdagangan Efek Publik",
    "ms": "Akta mengenai Pengeluaran dan Dagangan Sekuriti Awam",
}
items["KH-H047"] = {
    "vi": "Luật về Nuôi con nuôi giữa các nước",
    "th": "พระราชบัญญัติว่าด้วยการรับบุตรบุญธรรมระหว่างประเทศ",
    "id": "Undang-Undang tentang Pengangkatan Anak Antarnegara",
    "ms": "Akta mengenai Pengambilan Anak Angkat Antara Negara",
}
items["KH-H050"] = {
    "vi": "Luật Bảo vệ người tiêu dùng",
    "th": "พระราชบัญญัติคุ้มครองผู้บริโภค",
    "id": "Undang-Undang Perlindungan Konsumen",
    "ms": "Akta Perlindungan Pengguna",
}
items["KH-H053"] = {
    "vi": "Luật về Phòng, chống rửa tiền và Tài trợ khủng bố",
    "th": "พระราชบัญญัติว่าด้วยการป้องกันและปราบปรามการฟอกเงินและการต่อต้านการสนับสนุนทางการเงินแก่การก่อการร้าย",
    "id": "Undang-Undang tentang Pencegahan dan Pemberantasan Pencucian Uang serta Pendanaan Terorisme",
    "ms": "Akta mengenai Pencegahan dan Pemberantasan Pengubahan Wang Haram serta Pembiayaan Keganasan",
}
items["KH-H055"] = {
    "vi": "Hoàng lệnh số 1225/040 ban hành Luật Quản lý tài chính năm 2026",
    "th": "พระราชบัญญัติฉบับที่ 1225/040 ประกาศใช้พระราชบัญญัติการบริหารการเงิน ค.ศ. 2026",
    "id": "Undang-Undang Nomor 1225/040 tentang Pengundangan Undang-Undang Pengelolaan Keuangan Tahun 2026",
    "ms": "Akta Nombor 1225/040 tentang Penguatkuasaan Akta Pengurusan Kewangan Tahun 2026",
}
items["KH-H056"] = {
    "vi": "Hoàng lệnh số 0620/020 ban hành Luật về Tương trợ tư pháp trong lĩnh vực hình sự",
    "th": "พระราชบัญญัติฉบับที่ 0620/020 ประกาศใช้พระราชบัญญัติว่าด้วยความช่วยเหลือซึ่งกันและกันในทางอาญา",
    "id": "Undang-Undang Nomor 0620/020 tentang Pengundangan Undang-Undang Bantuan Timbal Balik dalam Urusan Pidana",
    "ms": "Akta Nombor 0620/020 tentang Penguatkuasaan Akta Bantuan Bersama dalam Perkara Jenayah",
}
items["KH-H057"] = {
    "vi": "Luật Giáo dục",
    "th": "พระราชบัญญัติการศึกษา",
    "id": "Undang-Undang Pendidikan",
    "ms": "Akta Pendidikan",
}

doc = {
    "batch": "kh-p2-b01",
    "scope": "KH 柬埔寨法 第 1 批 48 部（H001–H057 区段）",
    "note": "语义基准为 title.zh/title.en；非泰国年份用 ค.ศ.；Royal Kram 按 Act 处理。"
            "另按 §2.2 清除既有 zh 书名号 5 处。",
    "items": items,
}

# 按 §2.2「不含书名号《》」，清除既有 zh 译名中的书名号（只去符号，不动词句）
ZH_FIX = {
    "KH-H022": "关于批准2014—2018年国家战略发展规划的法律",
    "KH-H025": "关于批准柬埔寨王国加入卡塔赫纳生物安全议定书的法律",
    "KH-H026": "关于批准柬埔寨王国加入烟草控制公约的法律",
    "KH-H029": "关于批准柬埔寨王国加入禁止核武器条约的法律",
    "KH-H031": "关于批准柬埔寨王国加入全面禁止核试验条约的法律",
}
for k, v in ZH_FIX.items():
    items[k]["zh"] = v
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batches", "kh-p2-b01.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
