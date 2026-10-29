# -*- coding: utf-8 -*-
"""MY 标题多语种批次生成器（马来西亚剩余 60 部）。

语义基准：title.en（英文官方名）与 title.zh。
**马来语（ms）是马来西亚官方语言**，优先采用法律本身的官方马来语简称
（英文名括号内已给出者照录，如 `Companies Act 2016 (Akta Syarikat 2016)`），
不自造译名；vi/th/id 由英文名转译。
年份照录；泰国以外法域一律 ค.ศ.。
"""
import json, io, os

items = {}

# key: (vi, th, id, ms)
B = {
    "companies2016": ("Luật Công ty 2016", "พระราชบัญญัติบริษัท ค.ศ. 2016",
                      "Undang-Undang Perusahaan 2016", "Akta Syarikat 2016"),
    "cmsa2007": ("Luật Thị trường vốn và Dịch vụ 2007",
                 "พระราชบัญญัติตลาดทุนและบริการ ค.ศ. 2007",
                 "Undang-Undang Pasar Modal dan Jasa 2007",
                 "Akta Pasaran Modal dan Perkhidmatan 2007"),
    "constitution": ("Hiến pháp Liên bang", "รัฐธรรมนูญสหพันธ์",
                     "Undang-Undang Dasar Federal", "Perlembagaan Persekutuan"),
    "fsa2013": ("Luật Dịch vụ tài chính 2013", "พระราชบัญญัติบริการทางการเงิน ค.ศ. 2013",
                "Undang-Undang Jasa Keuangan 2013", "Akta Perkhidmatan Kewangan 2013"),
    "tm2019": ("Luật Nhãn hiệu 2019", "พระราชบัญญัติเครื่องหมายการค้า ค.ศ. 2019",
               "Undang-Undang Merek 2019", "Akta Cap Dagangan 2019"),
    "pdpa2010": ("Luật Bảo vệ dữ liệu cá nhân 2010",
                 "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ค.ศ. 2010",
                 "Undang-Undang Perlindungan Data Pribadi 2010",
                 "Akta Perlindungan Data Peribadi 2010"),
    "contract1950": ("Luật Hợp đồng 1950", "พระราชบัญญัติสัญญา ค.ศ. 1950",
                     "Undang-Undang Kontrak 1950", "Akta Kontrak 1950"),
    "epf1991": ("Luật Quỹ Tiết kiệm Người lao động 1991",
                "พระราชบัญญัติกองทุนสำรองเลี้ยงชีพลูกจ้าง ค.ศ. 1991",
                "Undang-Undang Dana Simpanan Pekerja 1991",
                "Akta Kumpulan Wang Simpanan Pekerja 1991"),
    "osha1994": ("Luật An toàn và Sức khỏe nghề nghiệp 1994",
                 "พระราชบัญญัติความปลอดภัยและอาชีวอนามัย ค.ศ. 1994",
                 "Undang-Undang Keselamatan dan Kesehatan Kerja 1994",
                 "Akta Keselamatan dan Kesihatan Pekerjaan 1994"),
    "bnm2009": ("Luật Ngân hàng Trung ương Malaysia 2009",
                "พระราชบัญญัติธนาคารกลางมาเลเซีย ค.ศ. 2009",
                "Undang-Undang Bank Sentral Malaysia 2009", "Akta Bank Negara Malaysia 2009"),
    "patents1983": ("Luật Sáng chế 1983", "พระราชบัญญัติสิทธิบัตร ค.ศ. 1983",
                    "Undang-Undang Paten 1983", "Akta Paten 1983"),
    "courts1964": ("Luật Tổ chức Tòa án 1964", "พระราชบัญญัติศาลยุติธรรม ค.ศ. 1964",
                   "Undang-Undang Pengadilan 1964", "Akta Mahkamah Kehakiman 1964"),
    "awards2017": ("Luật về các tội liên quan đến tước hiệu 2017",
                   "พระราชบัญญัติความผิดเกี่ยวกับเครื่องราชอิสริยาภรณ์ ค.ศ. 2017",
                   "Undang-Undang Tindak Pidana Terkait Penghargaan 2017",
                   "Akta Kesalahan Berhubung dengan Anugerah 2017"),
    "invest1986": ("Luật Xúc tiến đầu tư 1986", "พระราชบัญญัติส่งเสริมการลงทุน ค.ศ. 1986",
                   "Undang-Undang Promosi Investasi 1986", "Akta Penggalakan Pelaburan 1986"),
    "digsig1997": ("Luật Chữ ký số 1997", "พระราชบัญญัติลายมือชื่อดิจิทัล ค.ศ. 1997",
                   "Undang-Undang Tanda Tangan Digital 1997", "Akta Tandatangan Digital 1997"),
    "llp2012": ("Luật Hợp danh trách nhiệm hữu hạn 2012",
                "พระราชบัญญัติห้างหุ้นส่วนจำกัดความรับผิด ค.ศ. 2012",
                "Undang-Undang Persekutuan Komanditer Terbatas 2012",
                "Akta Perkongsian Liabiliti Terhad 2012"),
    "arb2005": ("Luật Trọng tài 2005", "พระราชบัญญัติอนุญาโตตุลาการ ค.ศ. 2005",
                "Undang-Undang Arbitrase 2005", "Akta Timbangtara 2005"),
    "comp2010": ("Luật Cạnh tranh 2010", "พระราชบัญญัติการแข่งขันทางการค้า ค.ศ. 2010",
                 "Undang-Undang Persaingan Usaha 2010", "Akta Persaingan 2010"),
    "ida1996": ("Luật Kiểu dáng công nghiệp 1996",
                "พระราชบัญญัติการออกแบบอุตสาหกรรม ค.ศ. 1996",
                "Undang-Undang Desain Industri 1996", "Akta Reka Bentuk Perindustrian 1996"),
    "soga1957": ("Luật Mua bán hàng hóa 1957", "พระราชบัญญัติการซื้อขายสินค้า ค.ศ. 1957",
                 "Undang-Undang Jual Beli Barang 1957", "Akta Jualan Barang 1957"),
    "freezone1990": ("Luật Khu vực tự do 1990", "พระราชบัญญัติเขตเสรี ค.ศ. 1990",
                     "Undang-Undang Kawasan Bebas 1990", "Akta Zon Bebas 1990"),
    "eca2006": ("Luật Thương mại điện tử 2006",
                "พระราชบัญญัติพาณิชย์อิเล็กทรอนิกส์ ค.ศ. 2006",
                "Undang-Undang Perdagangan Elektronik 2006",
                "Akta Perdagangan Elektronik 2006"),
    "eez1984": ("Luật Vùng đặc quyền kinh tế 1984",
                "พระราชบัญญัติเขตเศรษฐกิจจำเพาะ ค.ศ. 1984",
                "Undang-Undang Zona Ekonomi Eksklusif 1984", "Akta Zon Ekonomi Eksklusif 1984"),
    "terror2015": ("Luật Phòng chống khủng bố 2015",
                   "พระราชบัญญัติป้องกันการก่อการร้าย ค.ศ. 2015",
                   "Undang-Undang Pencegahan Terorisme 2015", "Akta Pencegahan Keganasan 2015"),
    "itax1967": ("Luật Thuế thu nhập 1967", "พระราชบัญญัติภาษีเงินได้ ค.ศ. 1967",
                 "Undang-Undang Pajak Penghasilan 1967", "Akta Cukai Pendapatan 1967"),
    "stax2018": ("Luật Thuế bán hàng 2018", "พระราชบัญญัติภาษีขาย ค.ศ. 2018",
                 "Undang-Undang Pajak Penjualan 2018", "Akta Cukai Jualan 2018"),
    "svctax2018": ("Luật Thuế dịch vụ 2018", "พระราชบัญญัติภาษีบริการ ค.ศ. 2018",
                   "Undang-Undang Pajak Jasa 2018", "Akta Cukai Perkhidmatan 2018"),
    "civil1956": ("Luật Dân sự 1956", "พระราชบัญญัติกฎหมายแพ่ง ค.ศ. 1956",
                  "Undang-Undang Hukum Perdata 1956", "Akta Undang-Undang Sivil 1956"),
    "cvd1993": ("Luật Thuế đối kháng và chống bán phá giá 1993",
                "พระราชบัญญัติอากรตอบโต้การทุ่มตลาดและการอุดหนุน ค.ศ. 1993",
                "Undang-Undang Bea Imbalan dan Anti-Dumping 1993",
                "Akta Duti Penyeimbang dan Anti-Lambakan 1993"),
    "copy1987": ("Luật Quyền tác giả 1987", "พระราชบัญญัติลิขสิทธิ์ ค.ศ. 1987",
                 "Undang-Undang Hak Cipta 1987", "Akta Hak Cipta 1987"),
    "cca1997": ("Luật Tội phạm máy tính 1997", "พระราชบัญญัติอาชญากรรมคอมพิวเตอร์ ค.ศ. 1997",
                "Undang-Undang Kejahatan Komputer 1997", "Akta Jenayah Komputer 1997"),
    "rpg1976": ("Luật Thuế thu nhập từ bất động sản 1976",
                "พระราชบัญญัติภาษีกำไรอสังหาริมทรัพย์ ค.ศ. 1976",
                "Undang-Undang Pajak Keuntungan Harta Tanah 1976",
                "Akta Cukai Keuntungan Harta Tanah 1976"),
    "tm1976": ("Luật Nhãn hiệu 1976", "พระราชบัญญัติเครื่องหมายการค้า ค.ศ. 1976",
               "Undang-Undang Merek 1976", "Akta Cap Dagangan 1976"),
    "strata1985": ("Luật Chứng thư phân tầng 1985 (Luật 318)",
                   "พระราชบัญญัติกรรมสิทธิ์ห้องชุด ค.ศ. 1985 (พระราชบัญญัติ 318)",
                   "Undang-Undang Sertifikat Stratum 1985 (Undang-Undang 318)",
                   "Akta Hakmilik Strata 1985 (Akta 318)"),
    "land1965": ("Bộ luật Đất đai 1965", "ประมวลกฎหมายที่ดิน ค.ศ. 1965",
                 "Kitab Undang-Undang Tanah 1965", "Kanun Tanah Negara 1965"),
    "arbamd2018": ("Luật Trọng tài (Sửa đổi) 2018",
                   "พระราชบัญญัติอนุญาโตตุลาการ (แก้ไขเพิ่มเติม) ค.ศ. 2018",
                   "Undang-Undang Arbitrase (Perubahan) 2018",
                   "Akta Timbangtara (Pindaan) 2018"),
}

# 后缀
EXTRACT = {"vi": " (trích lục)", "th": " (บางส่วน)",
           "id": " (Kutipan)", "ms": " (Petikan)"}


def add(lid, key, suffix=None, zh=None):
    v, t, i, m = B[key]
    d = {"vi": v, "th": t, "id": i, "ms": m}
    if suffix:
        for k in d:
            d[k] += suffix[k]
    if zh:
        d["zh"] = zh
    items[lid] = d


MAP = [
    ("MY-H115", "companies2016", None),
    ("MY-H072", "companies2016", EXTRACT),
    ("MY-H118", "cmsa2007", None),
    ("MY-H119", "cmsa2007", None),
    ("MY-H129", "constitution", None),
    ("MY-H029", "constitution", None),
    ("MY-H125", "fsa2013", None),
    ("MY-H112", "tm2019", None),
    ("MY-TRADEMARKS-2019", "tm2019", None),
    ("MY-H130", "pdpa2010", None),
    ("MY-H114", "pdpa2010", None),
    ("MY-PDPA-2010", "pdpa2010", None),
    ("MY-H075", "pdpa2010", None),
    ("MY-H134", "pdpa2010", None),
    ("MY-CONTRACT-1950", "contract1950", None),
    ("MY-H013", "epf1991", None),
    ("MY-H124", "osha1994", None),
    ("MY-H120", "bnm2009", None),
    ("MY-PATENTS-1983", "patents1983", None),
    ("MY-H074", "patents1983", None),
    ("MY-H009", "patents1983", None),
    ("MY-H005", "courts1964", None),
    ("MY-H068", "awards2017", {"vi": " (bản cập nhật đến ngày 26 tháng 6 năm 2024)",
                               "th": " (ปรับปรุงถึง 26 มิถุนายน ค.ศ. 2024)",
                               "id": " (per 26 Juni 2024)",
                               "ms": " (setakat 26 Jun 2024)"}),
    ("MY-H127", "awards2017", None),
    ("MY-INVESTMENT-1986", "invest1986", None),
    ("MY-H067", "invest1986", None),
    ("MY-H122", "digsig1997", None),
    ("MY-H026", "digsig1997", None),
    ("MY-H018", "llp2012", None),
    ("MY-H117", "arb2005", {"vi": " (bản cập nhật đến ngày 1 tháng 11 năm 2018)",
                            "th": " (ปรับปรุงถึง 1 พฤศจิกายน ค.ศ. 2018)",
                            "id": " (per 1 November 2018)",
                            "ms": " (setakat 1 November 2018)"}),
    ("MY-ARBITRATION-2005", "arb2005", None),
    ("MY-H116", "arb2005", None),
    ("MY-H082", "arb2005", None),
    ("MY-H015", "arb2005", None),
    ("MY-H095", "arbamd2018", None),
    ("MY-H080", "comp2010", None),
    ("MY-H030", "ida1996", None),
    ("MY-H083", "ida1996", {"vi": " (bản cập nhật đến ngày 1 tháng 1 năm 2013)",
                            "th": " (ปรับปรุงถึง 1 มกราคม ค.ศ. 2013)",
                            "id": " (per 1 Januari 2013)",
                            "ms": " (setakat 1 Januari 2013)"}),
    ("MY-SALEGOODS-1957", "soga1957", None),
    ("MY-H004", "soga1957", None),
    ("MY-H077", "freezone1990", None),
    ("MY-H113", "eca2006", None),
    ("MY-H123", "eca2006", None),
    ("MY-H016", "eca2006", None),
    ("MY-H087", "eca2006", None),
    ("MY-H084", "eez1984", None),
    ("MY-H085", "terror2015", None),
    ("MY-H007", "itax1967", None),
    ("MY-H078", "itax1967", EXTRACT),
    ("MY-H021", "stax2018", None),
    ("MY-H020", "svctax2018", None),
    ("MY-H073", "civil1956", None),
    ("MY-H039", "civil1956", None),
    ("MY-H086", "cvd1993", None),
    ("MY-H012", "copy1987", None),
    ("MY-H024", "cca1997", None),
    ("MY-H032", "rpg1976", None),
    ("MY-H008", "tm1976", None),
    ("MY-H070", "strata1985", None),
    ("MY-H081", "land1965", EXTRACT),
]
for lid, key, suf in MAP:
    add(lid, key, suf)

# ---- 顺带修掉的 zh 缺陷（§5.4 不用书名号；文件名残渣）----
ZH_FIX = {
    "MY-H073": "民法 1956",
    "MY-H070": "分层地契法（1985年第318号法令）",
    "MY-TRADEMARKS-2019": "2019年商标法",
    "MY-PATENTS-1983": "1983年专利法",
    "MY-SALEGOODS-1957": "1957年货物买卖法",
    "MY-ARBITRATION-2005": "2005年仲裁法",
}
for k, v in ZH_FIX.items():
    items[k]["zh"] = v

doc = {
    "batch": "my-p2-b01",
    "scope": "MY 马来西亚剩余 60 部（四语清零，ms 用官方马来语简称）",
    "note": "ms 为马来西亚官方语言，采用法律本身的官方马来语简称（如 Akta Syarikat 2016），"
            "不自造；vi/th/id 由英文名转译。另按 §5.4 修 6 处 zh（书名号、文件名残渣）。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "my-p2-b01.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
