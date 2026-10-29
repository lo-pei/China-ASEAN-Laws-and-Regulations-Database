# -*- coding: utf-8 -*-
"""LA 标题多语种批次生成器（老挝全部 80 部）。

语义基准：laws/<id>.json 的 title.zh 与 title.en（均已存在，视为可校对底本）。
层级词按 docs/07-标题多语种规范.md §5.2：
  Law            → vi Luật / th พระราชบัญญัติ / id Undang-Undang / ms Akta
  Decree         → vi Nghị định / th พระราชกฤษฎีกา / id Peraturan Pemerintah / ms Peraturan
  Ministerial Instruction → vi Thông tư / th กฎกระทรวง / id Peraturan Menteri / ms Peraturan Menteri
  Civil Code     → vi Bộ luật Dân sự / th ประมวลกฎหมายแพ่งและพาณิชย์ /
                   id Kitab Undang-Undang Hukum Perdata / ms Kanun Undang-Undang Sivil
  Constitution   → vi Hiến pháp / th รัฐธรรมนูญ / id Undang-Undang Dasar / ms Perlembagaan
老挝非泰国法域，年份一律 ค.ศ.（公历），不作佛历换算。
编号（No. 119/PM 等）照录，不用「第…号」中文式语序。
"""
import json, io, os

# ---- 层级词前缀 ----
LAW = {"vi": "Luật", "th": "พระราชบัญญัติ", "id": "Undang-Undang", "ms": "Akta"}
DEC = {"vi": "Nghị định", "th": "พระราชกฤษฎีกา",
       "id": "Peraturan Pemerintah", "ms": "Peraturan"}
MIN = {"vi": "Thông tư", "th": "กฎกระทรวง",
       "id": "Peraturan Menteri", "ms": "Peraturan Menteri"}

# ---- 主题词（不含层级词） ----
T = {
    "econdispute": {
        "vi": "Giải quyết tranh chấp kinh tế",
        "th": "การระงับข้อพิพาททางเศรษฐกิจ",
        "id": "Penyelesaian Sengketa Ekonomi",
        "ms": "Penyelesaian Pertikaian Ekonomi",
    },
    "bank": {
        "vi": "Ngân hàng thương mại",
        "th": "ธนาคารพาณิชย์",
        "id": "Bank Komersial",
        "ms": "Bank Perdagangan",
    },
    "incometax": {
        "vi": "Thuế thu nhập",
        "th": "ภาษีเงินได้",
        "id": "Pajak Penghasilan",
        "ms": "Cukai Pendapatan",
    },
    "fx": {
        "vi": "Quản lý ngoại hối",
        "th": "การบริหารเงินตราต่างประเทศ",
        "id": "Pengelolaan Valuta Asing",
        "ms": "Pengurusan Pertukaran Asing",
    },
    "invest": {
        "vi": "Xúc tiến đầu tư",
        "th": "ส่งเสริมการลงทุน",
        "id": "Promosi Investasi",
        "ms": "Penggalakan Pelaburan",
    },
    "consumer": {
        "vi": "Bảo vệ người tiêu dùng",
        "th": "คุ้มครองผู้บริโภค",
        "id": "Perlindungan Konsumen",
        "ms": "Perlindungan Pengguna",
    },
    "tax": {
        "vi": "Thuế",
        "th": "ภาษีอากร",
        "id": "Perpajakan",
        "ms": "Percukaian",
    },
    "enterprise": {
        "vi": "Doanh nghiệp",
        "th": "วิสาหกิจ",
        "id": "Perusahaan",
        "ms": "Perusahaan",
    },
    "ip": {
        "vi": "Sở hữu trí tuệ",
        "th": "ทรัพย์สินทางปัญญา",
        "id": "Kekayaan Intelektual",
        "ms": "Harta Intelek",
    },
    "labour": {
        "vi": "Lao động",
        "th": "แรงงาน",
        "id": "Ketenagakerjaan",
        "ms": "Buruh",
    },
    "etrans": {
        "vi": "Giao dịch điện tử",
        "th": "ธุรกรรมทางอิเล็กทรอนิกส์",
        "id": "Transaksi Elektronik",
        "ms": "Transaksi Elektronik",
    },
    "ecom": {
        "vi": "Thương mại điện tử",
        "th": "พาณิชย์อิเล็กทรอนิกส์",
        "id": "Perdagangan Elektronik",
        "ms": "Perdagangan Elektronik",
    },
    "inherit": {
        "vi": "Thừa kế",
        "th": "มรดก",
        "id": "Waris",
        "ms": "Pusaka",
    },
    "contract": {
        "vi": "Hợp đồng và quan hệ ngoài hợp đồng",
        "th": "สัญญาและความสัมพันธ์นอกสัญญา",
        "id": "Kontrak dan Hubungan Non-Kontraktual",
        "ms": "Kontrak dan Hubungan Bukan Kontrak",
    },
    "famreg": {
        "vi": "Đăng ký hộ tịch",
        "th": "การจดทะเบียนครอบครัว",
        "id": "Pencatatan Keluarga",
        "ms": "Pendaftaran Keluarga",
    },
    "child": {
        "vi": "Bảo vệ quyền và lợi ích của trẻ em",
        "th": "คุ้มครองสิทธิและประโยชน์ของเด็ก",
        "id": "Perlindungan Hak dan Kepentingan Anak",
        "ms": "Perlindungan Hak dan Kepentingan Kanak-Kanak",
    },
    "courtreg": {
        "vi": "Đăng ký tòa án",
        "th": "การจดทะเบียนศาล",
        "id": "Registrasi Pengadilan",
        "ms": "Pendaftaran Mahkamah",
    },
    "enforce": {
        "vi": "Thi hành bản án của tòa án",
        "th": "การบังคับคดีตามคำพิพากษาของศาล",
        "id": "Pelaksanaan Putusan Pengadilan",
        "ms": "Pelaksanaan Penghakiman Mahkamah",
    },
    "fishery": {
        "vi": "Thủy sản",
        "th": "การประมง",
        "id": "Perikanan",
        "ms": "Perikanan",
    },
    "livestock": {
        "vi": "Chăn nuôi và thú y",
        "th": "การปศุสัตว์และสัตวแพทย์",
        "id": "Peternakan dan Kedokteran Hewan",
        "ms": "Penternakan dan Veterinar",
    },
    "irrigation": {
        "vi": "Thủy lợi",
        "th": "ชลประทาน",
        "id": "Irigasi",
        "ms": "Pengairan",
    },
    "aquatic": {
        "vi": "Động vật thủy sinh và động vật hoang dã",
        "th": "สัตว์น้ำและสัตว์ป่า",
        "id": "Satwa Air dan Satwa Liar",
        "ms": "Hidupan Akuatik dan Hidupan Liar",
    },
    "plant": {
        "vi": "Bảo vệ thực vật",
        "th": "คุ้มครองพืช",
        "id": "Perlindungan Tanaman",
        "ms": "Perlindungan Tanaman",
    },
    "forestry": {
        "vi": "Lâm nghiệp",
        "th": "ป่าไม้",
        "id": "Kehutanan",
        "ms": "Perhutanan",
    },
    "scitech": {
        "vi": "Khoa học và công nghệ",
        "th": "วิทยาศาสตร์และเทคโนโลยี",
        "id": "Ilmu Pengetahuan dan Teknologi",
        "ms": "Sains dan Teknologi",
    },
    "socialsec": {
        "vi": "Bảo hiểm xã hội",
        "th": "ประกันสังคม",
        "id": "Jaminan Sosial",
        "ms": "Keselamatan Sosial",
    },
    "food": {
        "vi": "Thực phẩm",
        "th": "อาหาร",
        "id": "Pangan",
        "ms": "Makanan",
    },
    "drug": {
        "vi": "Dược phẩm và trang thiết bị y tế",
        "th": "ยาและผลิตภัณฑ์ทางการแพทย์",
        "id": "Obat dan Produk Medis",
        "ms": "Ubat dan Produk Perubatan",
    },
    "hygiene": {
        "vi": "Vệ sinh, phòng chống dịch bệnh và nâng cao sức khỏe",
        "th": "สุขาภิบาล การป้องกันโรค และการส่งเสริมสุขภาพ",
        "id": "Higiene, Pencegahan Penyakit, dan Promosi Kesehatan",
        "ms": "Kebersihan, Pencegahan Penyakit dan Promosi Kesihatan",
    },
    "road": {
        "vi": "Đường bộ",
        "th": "ทางหลวง",
        "id": "Jalan",
        "ms": "Jalan Raya",
    },
    "urban": {
        "vi": "Quy hoạch đô thị",
        "th": "การผังเมือง",
        "id": "Penataan Ruang Perkotaan",
        "ms": "Perancangan Bandar",
    },
    "agri": {
        "vi": "Nông nghiệp",
        "th": "เกษตรกรรม",
        "id": "Pertanian",
        "ms": "Pertanian",
    },
    "women": {
        "vi": "Hội Liên hiệp Phụ nữ Lào",
        "th": "สหภาพสตรีลาว",
        "id": "Persatuan Wanita Laos",
        "ms": "Kesatuan Wanita Laos",
    },
    "family": {
        "vi": "Hôn nhân và gia đình",
        "th": "ครอบครัว",
        "id": "Keluarga",
        "ms": "Keluarga",
    },
    "customs": {
        "vi": "Hải quan",
        "th": "ศุลกากร",
        "id": "Kepabeanan",
        "ms": "Kastam",
    },
    "lawyer": {
        "vi": "Luật sư",
        "th": "ทนายความ",
        "id": "Advokat",
        "ms": "Peguam",
    },
    "taxadmin": {
        "vi": "Quản lý thuế",
        "th": "การบริหารภาษี",
        "id": "Administrasi Perpajakan",
        "ms": "Pentadbiran Cukai",
    },
    "constax": {
        "vi": "Thuế tiêu thụ",
        "th": "ภาษีการบริโภค",
        "id": "Pajak Konsumsi",
        "ms": "Cukai Penggunaan",
    },
    "bankoflao": {
        "vi": "Ngân hàng của CHDCND Lào",
        "th": "ธนาคารแห่ง สปป. ลาว",
        "id": "Bank Republik Demokratik Rakyat Laos",
        "ms": "Bank Republik Demokratik Rakyat Laos",
    },
    "environment": {
        "vi": "Bảo vệ môi trường",
        "th": "คุ้มครองสิ่งแวดล้อม",
        "id": "Perlindungan Lingkungan Hidup",
        "ms": "Perlindungan Alam Sekitar",
    },
    "legislation": {
        "vi": "Ban hành văn bản quy phạm pháp luật",
        "th": "การออกกฎหมาย",
        "id": "Pembentukan Peraturan Perundang-Undangan",
        "ms": "Penggubalan Undang-Undang",
    },
}

CIVIL = {"vi": "Bộ luật Dân sự",
         "th": "ประมวลกฎหมายแพ่งและพาณิชย์",
         "id": "Kitab Undang-Undang Hukum Perdata",
         "ms": "Kanun Undang-Undang Sivil"}
CONST = {"vi": "Hiến pháp",
         "th": "รัฐธรรมนูญ",
         "id": "Undang-Undang Dasar",
         "ms": "Perlembagaan"}

# ---- 后缀工具 ----
# 泰文正字法：层级词与主题词、括号后缀之间均不加空格（拉丁字母/数字前才留空格）
SEP = {"vi": " ", "th": "", "id": " ", "ms": " "}

def yr(y):
    return {"vi": " năm %d" % y, "th": " ค.ศ. %d" % y,
            "id": " Tahun %d" % y, "ms": " %d" % y}

def amd(y=None):
    if y:
        return {"vi": " (sửa đổi năm %d)" % y, "th": "(แก้ไขเพิ่มเติม ค.ศ. %d)" % y,
                "id": " (Perubahan Tahun %d)" % y, "ms": " (Pindaan %d)" % y}
    return {"vi": " (sửa đổi)", "th": "(แก้ไขเพิ่มเติม)",
            "id": " (Perubahan)", "ms": " (Pindaan)"}

def no_date(num, d_vi, d_th, d_id, d_ms):
    """编号 + 日期：照录编号体系，不改为「第…号」。"""
    return {"vi": " số %s ngày %s" % (num, d_vi),
            "th": " ฉบับที่ %s ลงวันที่ %s" % (num, d_th),
            "id": " Nomor %s tanggal %s" % (num, d_id),
            "ms": " Nombor %s bertarikh %s" % (num, d_ms)}

def join(*parts):
    """把若干 dict 逐语种拼接。"""
    out = {"vi": "", "th": "", "id": "", "ms": ""}
    for p in parts:
        for k in out:
            out[k] += p[k]
    return out

def head(pre, key):
    """层级词 + 主题词（泰文不加空格）。"""
    return {k: pre[k] + SEP[k] + T[key][k] for k in pre}

def head_of(pre, term):
    return {k: pre[k] + SEP[k] + term[k] for k in pre}

items = {}

# ============ 一、单行法（无年份） ============
SIMPLE = {
    "LA-H001": ("econdispute", LAW),
    "LA-H004": ("bank", LAW),
    "LA-H008": ("incometax", LAW),
    "LA-H015": ("fx", LAW),
    "LA-H016": ("invest", LAW),
    "LA-H017": ("consumer", LAW),
    "LA-H020": ("tax", LAW),
    "LA-H038": ("enterprise", LAW),
    "LA-H039": ("ip", LAW),
    "LA-H041": ("labour", LAW),
    "LA-H058": ("etrans", LAW),
    "LA-H100": ("inherit", LAW),
    "LA-H104": ("child", LAW),
    "LA-H107": ("fishery", LAW),
    "LA-H108": ("livestock", LAW),
    "LA-H109": ("irrigation", LAW),
    "LA-H110": ("aquatic", LAW),
    "LA-H111": ("plant", LAW),
    "LA-H113": ("scitech", LAW),
    "LA-H114": ("socialsec", LAW),
    "LA-H118": ("road", LAW),
    "LA-H119": ("urban", LAW),
    "LA-H120": ("agri", LAW),
    "LA-H121": ("women", LAW),
    "LA-H122": ("etrans", LAW),
    "LA-H430": ("contract", LAW),
    "LA-H434": ("lawyer", LAW),
}
for lid, (key, pre) in SIMPLE.items():
    items[lid] = head(pre, key)

# ============ 二、带修订标记（无年份） ============
AMENDED = {
    "LA-H101": ("contract", LAW),
    "LA-H102": ("famreg", LAW),
    "LA-H103": ("econdispute", LAW),
    "LA-H105": ("courtreg", LAW),
    "LA-H106": ("enforce", LAW),
    "LA-H112": ("forestry", LAW),
    "LA-H115": ("food", LAW),
    "LA-H116": ("drug", LAW),
    "LA-H117": ("hygiene", LAW),
    "LA-H123": ("family", LAW),
    "LA-H435": ("invest", LAW),
    "LA-H436": ("invest", LAW),
    "LA-H444": ("environment", LAW),
    "LA-H447": ("ecom", LAW),
}
for lid, (key, pre) in AMENDED.items():
    items[lid] = join(head(pre, key), amd())

# ============ 三、带修订年份 ============
AMENDED_Y = {
    "LA-H427": ("enterprise", LAW, 2023),
    "LA-H428": ("customs", LAW, 2020),
    "LA-H442": ("customs", LAW, 2011),
    "LA-H448": ("ip", LAW, 2023),
    "LA-H449": ("taxadmin", LAW, 2019),
}
for lid, (key, pre, y) in AMENDED_Y.items():
    items[lid] = join(head(pre, key), amd(y))

# ============ 四、带年份 ============
YEARED = {
    "LA-H036": (CIVIL, 2018),
    "LA-H037": (CIVIL, 2018),
    "LA-H438": (CIVIL, 2018),
    "LA-H440": (CIVIL, 2018),
    "LA-H441": (CIVIL, 2018),
    "LA-H043": (head(LAW, "invest"), 2016),
    "LA-H450": (head(LAW, "invest"), 2016),
    "LA-H429": (head(LAW, "labour"), 2013),
    "LA-H445": (head(LAW, "etrans"), 2012),
    "LA-H416": (head(LAW, "econdispute"), 2018),
    "LA-H451": (head(LAW, "econdispute"), 2010),
    "LA-H040": (head(LAW, "tax"), 2005),
}
for lid, (term, y) in YEARED.items():
    items[lid] = join(term, yr(y))

# ============ 五、宪法 ============
items["LA-H046"] = join(CONST, {"vi": " nước CHDCND Lào (sửa đổi năm 2025)",
                                "th": "แห่ง สปป. ลาว (แก้ไขเพิ่มเติม ค.ศ. 2025)",
                                "id": " Republik Demokratik Rakyat Laos (Perubahan Tahun 2025)",
                                "ms": " Republik Demokratik Rakyat Laos (Pindaan 2025)"})
items["LA-H432"] = join(CONST, {"vi": " nước CHDCND Lào",
                                "th": "แห่ง สปป. ลาว",
                                "id": " Republik Demokratik Rakyat Laos",
                                "ms": " Republik Demokratik Rakyat Laos"})
items["LA-H433"] = join(CONST, {"vi": " nước CHDCND Lào (sửa đổi năm 2025)",
                                "th": "แห่ง สปป. ลาว (แก้ไขเพิ่มเติม ค.ศ. 2025)",
                                "id": " Republik Demokratik Rakyat Laos (Perubahan Tahun 2025)",
                                "ms": " Republik Demokratik Rakyat Laos (Pindaan 2025)"})

# ============ 六、带编号（及日期）的法 ============
# 投资促进法（修订）第 14/NA 号，2016 年 11 月 17 日
items["LA-H042"] = join(head(LAW, "invest"), amd(),
                        no_date("14/NA", "17 tháng 11 năm 2016", "17 พฤศจิกายน ค.ศ. 2016",
                                "17 November 2016", "17 November 2016"))
# 银行法（修订）第 47/NA 号，2018 年 6 月 19 日
items["LA-H424"] = join(head(LAW, "bankoflao"), amd(),
                        no_date("47/NA", "19 tháng 6 năm 2018", "19 มิถุนายน ค.ศ. 2018",
                                "19 Juni 2018", "19 Jun 2018"))
# 消费税法第 68/NA 号，2019 年 6 月 19 日
items["LA-H425"] = join(head(LAW, "constax"),
                        no_date("68/NA", "19 tháng 6 năm 2019", "19 มิถุนายน ค.ศ. 2019",
                                "19 Juni 2019", "19 Jun 2019"))
# 所得税法第 67/NA 号，2019 年 6 月 18 日
items["LA-H426"] = join(head(LAW, "incometax"),
                        no_date("67/NA", "18 tháng 6 năm 2019", "18 มิถุนายน ค.ศ. 2019",
                                "18 Juni 2019", "18 Jun 2019"))
# 税法若干条文修正法第 01/NA 号，2021 年 8 月 7 日
items["LA-H423"] = join(
    {"vi": "Luật Sửa đổi một số điều của Luật Thuế",
     "th": "พระราชบัญญัติแก้ไขเพิ่มเติมบทบัญญัติบางประการแห่งพระราชบัญญัติภาษีอากร",
     "id": "Undang-Undang Perubahan atas Beberapa Pasal Undang-Undang Perpajakan",
     "ms": "Akta Pindaan kepada Beberapa Seksyen Akta Percukaian"},
    no_date("01/NA", "7 tháng 8 năm 2021", "7 สิงหาคม ค.ศ. 2021",
            "7 Agustus 2021", "7 Ogos 2021"))
# 海关法部分条款修正（2014）
items["LA-H443"] = join(
    {"vi": "Luật Sửa đổi một số điều của Luật Hải quan",
     "th": "พระราชบัญญัติแก้ไขเพิ่มเติมบทบัญญัติบางประการแห่งพระราชบัญญัติศุลกากร",
     "id": "Undang-Undang Perubahan atas Beberapa Pasal Undang-Undang Kepabeanan",
     "ms": "Akta Pindaan kepada Beberapa Seksyen Akta Kastam"},
    yr(2014))

# ============ 七、政令 ============
# 投资促进法实施政令（节选，2016）
items["LA-H044"] = {
    "vi": "Nghị định thi hành Luật Xúc tiến đầu tư (trích lục năm 2016)",
    "th": "พระราชกฤษฎีกาเพื่อดำเนินการตามพระราชบัญญัติส่งเสริมการลงทุน (บางส่วน ค.ศ. 2016)",
    "id": "Peraturan Pemerintah tentang Pelaksanaan Undang-Undang Promosi Investasi (Kutipan Tahun 2016)",
    "ms": "Peraturan tentang Pelaksanaan Akta Penggalakan Pelaburan (Petikan 2016)",
}
# 电子商务政令 2021
for lid in ("LA-H050", "LA-H446"):
    items[lid] = join(head(DEC, "ecom"), yr(2021))
# 投资促进法实施法令第 119/PM 号（2011-04-20）
for lid in ("LA-H417", "LA-H420"):
    items[lid] = join(head(DEC, "invest"),
                      no_date("119/PM", "20 tháng 4 năm 2011", "20 เมษายน ค.ศ. 2011",
                              "20 April 2011", "20 April 2011"))
# 电子商务政令第 296/GoL 号（2021-04-12）
items["LA-H418"] = join(head(DEC, "ecom"),
                        no_date("296/GoL", "12 tháng 4 năm 2021", "12 เมษายน ค.ศ. 2021",
                                "12 April 2021", "12 April 2021"))
# 海关法实施政令第 362/PMO 号（2007-10-19）
items["LA-H419"] = join(head(DEC, "customs"),
                        no_date("362/PMO", "19 tháng 10 năm 2007", "19 ตุลาคม ค.ศ. 2007",
                                "19 Oktober 2007", "19 Oktober 2007"))
# 投资法实施条例第 119/PM 号
items["LA-H437"] = join(
    {"vi": "Quy định thi hành Luật Đầu tư",
     "th": "ข้อบังคับการดำเนินการตามพระราชบัญญัติการลงทุน",
     "id": "Peraturan Pelaksanaan Undang-Undang Investasi",
     "ms": "Peraturan Pelaksanaan Akta Pelaburan"},
    no_date("119/PM", "20 tháng 4 năm 2011", "20 เมษายน ค.ศ. 2011",
            "20 April 2011", "20 April 2011"))

# ============ 八、部长指令 ============
# 海关法第 05/NA 号实施部长指令第 0491/MOF 号
items["LA-H421"] = {
    "vi": "Thông tư của Bộ trưởng số 0491/MOF về thi hành Luật Hải quan số 05/NA ngày 20 tháng 5 năm 2005",
    "th": "กฎกระทรวงฉบับที่ 0491/MOF ว่าด้วยการดำเนินการตามพระราชบัญญัติศุลกากร ฉบับที่ 05/NA ลงวันที่ 20 พฤษภาคม ค.ศ. 2005",
    "id": "Peraturan Menteri Nomor 0491/MOF tentang Pelaksanaan Undang-Undang Kepabeanan Nomor 05/NA tanggal 20 Mei 2005",
    "ms": "Peraturan Menteri Nombor 0491/MOF tentang Pelaksanaan Akta Kastam Nombor 05/NA bertarikh 20 Mei 2005",
}
# 知识产权海关保护措施指令第 1970/MOF 号
items["LA-H422"] = join(
    {"vi": "Thông tư về biện pháp hải quan bảo hộ quyền sở hữu trí tuệ",
     "th": "กฎกระทรวงว่าด้วยมาตรการศุลกากรเพื่อคุ้มครองทรัพย์สินทางปัญญา",
     "id": "Peraturan Menteri tentang Tindakan Kepabeanan untuk Perlindungan Kekayaan Intelektual",
     "ms": "Peraturan Menteri tentang Langkah Kastam untuk Perlindungan Harta Intelek"},
    {"vi": " số 1970/MOF", "th": " ฉบับที่ 1970/MOF",
     "id": " Nomor 1970/MOF", "ms": " Nombor 1970/MOF"})

# ============ 九、非规范性条目 ============
# 外国投资者商业活动清单（2015 年 2 月修订）
items["LA-H431"] = {
    "vi": "Danh mục hoạt động kinh doanh dành cho nhà đầu tư nước ngoài (sửa đổi tháng 2 năm 2015)",
    "th": "รายการกิจกรรมทางธุรกิจสำหรับนักลงทุนต่างประเทศ (แก้ไขเพิ่มเติม กุมภาพันธ์ ค.ศ. 2015)",
    "id": "Daftar Kegiatan Usaha bagi Investor Asing (Perubahan Februari 2015)",
    "ms": "Senarai Aktiviti Perniagaan bagi Pelabur Asing (Pindaan Februari 2015)",
}
# 官方公报·决议列表页（第 2 页）
items["LA-H453"] = {
    "vi": "Công báo chính thức của Lào — Danh mục nghị quyết (trang 2)",
    "th": "ราชกิจจานุเบกษาแห่ง สปป. ลาว — รายการมติ (หน้า 2)",
    "id": "Berita Resmi Laos — Daftar Keputusan (Halaman 2)",
    "ms": "Warta Rasmi Laos — Senarai Resolusi (Halaman 2)",
}
# 立法法（2021 年修正）
items["LA-LEGISLATION-2021"] = join(head(LAW, "legislation"), amd(2021))

# ============ 十、顺带修掉的 zh/en 缺陷 ============
ZH_FIX = {
    # 文件名残渣混入标题
    "LA-H042": "投资促进法（修订，第14/NA号，2016年11月17日）",
    # §5.4 不使用书名号
    "LA-LEGISLATION-2021": "立法法（2021年修正版）",
}
for k, v in ZH_FIX.items():
    items[k]["zh"] = v

doc = {
    "batch": "la-p2-b01",
    "scope": "LA 老挝法全 80 部（四语 vi/th/id/ms 整域清零）",
    "note": "语义基准 title.zh/title.en；老挝非泰国法域，年份一律 ค.ศ.；"
            "编号照录（No. 119/PM 等），不改中文「第…号」语序；"
            "另按 §2.2/§5.4 修 2 处 zh 缺陷（文件名残渣、书名号）。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "la-p2-b01.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out)
print("部数", len(items))
print("四语齐备", sum(1 for v in items.values()
                  if all(k in v and v[k] for k in ("vi", "th", "id", "ms"))))
