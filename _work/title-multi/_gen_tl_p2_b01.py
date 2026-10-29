# -*- coding: utf-8 -*-
"""TL 标题多语种批次生成器（第 1 批：TL-CIVIL-2011 … TL-H146，115 部）。

语义基准：laws/<id>.json 的 title.en（东帝汶官方英文本，可靠）。
zh 层存量有系统性损坏（葡中混杂、断词、混入《》书名号），本批按 en 重写；
重写只动明显损坏的条目，正常 zh 不动。

层级词按 docs/07-标题多语种规范.md §5.2：
  Law → vi Luật / th พระราชบัญญัติ / id Undang-Undang / ms Akta
  Code → vi Bộ luật / th ประมวลกฎหมาย / id Kitab Undang-Undang / ms Kanun
  Statute → vi Quy chế / th ข้อกำหนด / id Statuta / ms Statuta
  Organic Law → vi Luật tổ chức / th พระราชบัญญัติประกอบรัฐธรรมนูญ / id Undang-Undang Organik / ms Akta Organik
东帝汶非泰国法域，年份一律 ค.ศ.。泰文层级词与主题词之间不加空格。
"""
import json, io, os

MONTH = {
    "January": ("tháng 1", "มกราคม", "Januari", "Januari"),
    "February": ("tháng 2", "กุมภาพันธ์", "Februari", "Februari"),
    "March": ("tháng 3", "มีนาคม", "Maret", "Mac"),
    "April": ("tháng 4", "เมษายน", "April", "April"),
    "May": ("tháng 5", "พฤษภาคม", "Mei", "Mei"),
    "June": ("tháng 6", "มิถุนายน", "Juni", "Jun"),
    "July": ("tháng 7", "กรกฎาคม", "Juli", "Julai"),
    "August": ("tháng 8", "สิงหาคม", "Agustus", "Ogos"),
    "September": ("tháng 9", "กันยายน", "September", "September"),
    "October": ("tháng 10", "ตุลาคม", "Oktober", "Oktober"),
    "November": ("tháng 11", "พฤศจิกายน", "November", "November"),
    "December": ("tháng 12", "ธันวาคม", "Desember", "Disember"),
}
ORD = {
    "First": ("lần thứ nhất", "ครั้งที่หนึ่ง", "Pertama", "Pertama"),
    "Second": ("lần thứ hai", "ครั้งที่สอง", "Kedua", "Kedua"),
    "Third": ("lần thứ ba", "ครั้งที่สาม", "Ketiga", "Ketiga"),
    "Fourth": ("lần thứ tư", "ครั้งที่สี่", "Keempat", "Keempat"),
    "Fifth": ("lần thứ năm", "ครั้งที่ห้า", "Kelima", "Kelima"),
    "Sixth": ("lần thứ sáu", "ครั้งที่หก", "Keenam", "Keenam"),
    "Seventh": ("lần thứ bảy", "ครั้งที่เจ็ด", "Ketujuh", "Ketujuh"),
}
SEP = {"vi": " ", "th": "", "id": " ", "ms": " "}


def law(term, *suf):
    """Luật / พระราชบัญญัติ / Undang-Undang / Akta + 主题 + 后缀。"""
    pre = {"vi": "Luật", "th": "พระราชบัญญัติ", "id": "Undang-Undang", "ms": "Akta"}
    out = {k: pre[k] + SEP[k] + term[k] for k in pre}
    for s in suf:
        for k in out:
            out[k] += s[k]
    return out


def amend(ordinal, num, day, month, subj):
    """Xn Amendment to Law No. num of day month, subject。"""
    o = ORD[ordinal]
    m = MONTH[month]
    return {
        "vi": "Luật Sửa đổi %s Luật số %s ngày %d %s về %s" % (o[0], num, day, m[0], subj["vi"]),
        "th": "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติฉบับที่ %s ลงวันที่ %d %s (%s) ว่าด้วย%s"
              % (num, day, m[1], o[1], subj["th"]),
        "id": "Undang-Undang Perubahan %s atas Undang-Undang Nomor %s tanggal %d %s tentang %s"
              % (o[2], num, day, m[2], subj["id"]),
        "ms": "Akta Pindaan %s kepada Akta Nombor %s bertarikh %d %s mengenai %s"
              % (o[3], num, day, m[3], subj["ms"]),
    }


def amend_named(ordinal, name):
    """Xn Amendment to the <名称法>（无编号）。"""
    o = ORD[ordinal]
    return {
        "vi": "Luật Sửa đổi %s %s" % (o[0], name["vi"]),
        "th": "พระราชบัญญัติแก้ไขเพิ่มเติม%s (%s)" % (name["th"], o[1]),
        "id": "Undang-Undang Perubahan %s atas %s" % (o[2], name["id"]),
        "ms": "Akta Pindaan %s kepada %s" % (o[3], name["ms"]),
    }


def budget(year_label, kind="plain"):
    """kind: plain | approve | rectify"""
    if kind == "approve":
        return {"vi": "Phê chuẩn Ngân sách nhà nước %s" % year_label["vi"],
                "th": "รับรองงบประมาณแผ่นดิน%s" % year_label["th"],
                "id": "Pengesahan Anggaran Pendapatan dan Belanja Negara %s" % year_label["id"],
                "ms": "Pengesahan Belanjawan Negara %s" % year_label["ms"]}
    if kind == "rectify":
        return {"vi": "Ngân sách điều chỉnh của Ngân sách nhà nước %s" % year_label["vi"],
                "th": "งบประมาณปรับปรุงของงบประมาณแผ่นดิน%s" % year_label["th"],
                "id": "Anggaran Perbaikan atas Anggaran Pendapatan dan Belanja Negara %s" % year_label["id"],
                "ms": "Belanjawan Pembetulan bagi Belanjawan Negara %s" % year_label["ms"]}
    return {"vi": "Ngân sách nhà nước %s" % year_label["vi"],
            "th": "งบประมาณแผ่นดิน%s" % year_label["th"],
            "id": "Anggaran Pendapatan dan Belanja Negara %s" % year_label["id"],
            "ms": "Belanjawan Negara %s" % year_label["ms"]}


def fy(s):
    """年份标签。s 形如 2003/2004 或 2004-2005 或 2008。"""
    if "/" in s:
        return {"vi": "năm tài chính " + s, "th": "ปีงบประมาณ " + s,
                "id": "Tahun Anggaran " + s, "ms": "Tahun Fiskal " + s}
    return {"vi": "năm " + s, "th": " ค.ศ. " + s,
            "id": "Tahun " + s, "ms": s}


def cal(s):
    """公历年份标签（泰语用 ค.ศ.）。"""
    return {"vi": "năm " + s, "th": " ค.ศ. " + s, "id": "Tahun " + s, "ms": s}


TL = "Timor-Leste"
items = {}


def put(lid, vi, th, id_, ms, zh=None):
    d = {"vi": vi, "th": th, "id": id_, "ms": ms}
    if zh:
        d["zh"] = zh
    items[lid] = d


# ================= 基础法 =================
put("TL-CIVIL-2011",
    "Bộ luật Dân sự", "ประมวลกฎหมายแพ่ง",
    "Kitab Undang-Undang Hukum Perdata", "Kanun Undang-Undang Sivil",
    "民法典")

# ================= 宪法 / 主权机关 =================
put("TL-H001",
    "Hiến pháp nước Cộng hòa Dân chủ Timor-Leste",
    "รัฐธรรมนูญแห่งสาธารณรัฐประชาธิปไตยติมอร์-เลสเต",
    "Undang-Undang Dasar Republik Demokratik Timor-Leste",
    "Perlembagaan Republik Demokratik Timor-Leste",
    "东帝汶民主共和国宪法")
put("TL-H059",
    "Quy chế chủ thể các cơ quan chủ quyền",
    "ข้อกำหนดผู้ดำรงตำแหน่งในองค์กรอธิปไตย",
    "Statuta Pemegang Organ Kedaulatan",
    "Statuta Pemegang Organ Kedaulatan",
    "主权机关负责人章程")
put("TL-H103",
    "Luật tổ chức Phủ Tổng thống",
    "พระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยสำนักประธานาธิบดี",
    "Undang-Undang Organik Kepresidenan Republik",
    "Akta Organik Kepresidenan Republik",
    "共和国总统府组织法")
put("TL-H062", "Luật Ủy quyền cho Tổng thống Cộng hòa tuyên bố tình trạng bao vây",
    "พระราชบัญญัติมอบอำนาจให้ประธานาธิบดีประกาศสถานการณ์ล้อม",
    "Undang-Undang Pemberian Wewenang kepada Presiden Republik untuk Menyatakan Keadaan Pengepungan",
    "Akta Pemberian Kuasa kepada Presiden Republik untuk Mengisytiharkan Keadaan Pengepungan",
    "授权共和国总统宣布戒严状态")
_renew = {"vi": "gia hạn tuyên bố tình trạng bao vây",
          "th": "ขยายเวลาการประกาศสถานการณ์ล้อม",
          "id": "memperpanjang Pernyataan Keadaan Pengepungan",
          "ms": "melanjutkan Pengisytiharan Keadaan Pengepungan"}
put("TL-H063",
    "Luật Ủy quyền cho Tổng thống Cộng hòa " + _renew["vi"],
    "พระราชบัญญัติมอบอำนาจให้ประธานาธิบดี" + _renew["th"],
    "Undang-Undang Pemberian Wewenang kepada Presiden Republik untuk " + _renew["id"],
    "Akta Pemberian Kuasa kepada Presiden Republik untuk " + _renew["ms"],
    "授权共和国总统续延戒严状态宣告")
put("TL-H065",
    "Luật Ủy quyền cho Tổng thống Cộng hòa " + _renew["vi"],
    "พระราชบัญญัติมอบอำนาจให้ประธานาธิบดี" + _renew["th"],
    "Undang-Undang Pemberian Wewenang kepada Presiden Republik untuk " + _renew["id"],
    "Akta Pemberian Kuasa kepada Presiden Republik untuk " + _renew["ms"],
    "授权共和国总统续延戒严状态宣告")
put("TL-H066",
    "Luật Ủy quyền cho Tổng thống Cộng hòa " + _renew["vi"] +
    " tại các huyện Aileu, Ermera và Bobonaro",
    "พระราชบัญญัติมอบอำนาจให้ประธานาธิบดี" + _renew["th"] +
    " ในเขตอำเภออาเลอู แอร์เมรา และโบโบนาโร",
    "Undang-Undang Pemberian Wewenang kepada Presiden Republik untuk " + _renew["id"] +
    " di Distrik Aileu, Ermera, dan Bobonaro",
    "Akta Pemberian Kuasa kepada Presiden Republik untuk " + _renew["ms"] +
    " di Daerah Aileu, Ermera dan Bobonaro",
    "授权共和国总统在阿伊莱乌、埃尔梅拉和博博纳罗等区续延戒严状态宣告")
put("TL-H068",
    "Luật Ủy quyền cho Tổng thống Cộng hòa " + _renew["vi"] + " tại huyện Ermera",
    "พระราชบัญญัติมอบอำนาจให้ประธานาธิบดี" + _renew["th"] + " ในเขตอำเภอแอร์เมรา",
    "Undang-Undang Pemberian Wewenang kepada Presiden Republik untuk " + _renew["id"] +
    " di Distrik Ermera",
    "Akta Pemberian Kuasa kepada Presiden Republik untuk " + _renew["ms"] + " di Daerah Ermera",
    "授权共和国总统在埃尔梅拉区续延戒严状态宣告")
put("TL-H064",
    "Chế độ tình trạng bao vây và tình trạng khẩn cấp",
    "ข้อกำหนดสถานการณ์ล้อมและสถานการณ์ฉุกเฉิน",
    "Rezim Keadaan Pengepungan dan Keadaan Darurat",
    "Rejim Keadaan Pengepungan dan Keadaan Darurat",
    "戒严状态与紧急状态制度")

# ================= 公报 / 法源 =================
put("TL-H002",
    "Luật về Công báo (Jornal da República)",
    "พระราชบัญญัติว่าด้วยราชกิจจานุเบกษา (Jornal da República)",
    "Undang-Undang tentang Berita Resmi (Jornal da República)",
    "Akta mengenai Warta Rasmi (Jornal da República)",
    "共和国公报法")
put("TL-H003",
    "Giải thích pháp luật đang có hiệu lực ngày 19 tháng 5 năm 2002",
    "การตีความกฎหมายที่ใช้บังคับ ณ วันที่ 19 พฤษภาคม ค.ศ. 2002",
    "Penafsiran Hukum yang Berlaku pada 19 Mei 2002",
    "Tafsiran Undang-Undang yang Berkuat Kuasa pada 19 Mei 2002",
    "2002年5月19日现行法律的解释")
put("TL-H019",
    "Giải thích Điều 1 Luật số 2/2002 ngày 7 tháng 8 và các nguồn pháp luật",
    "การตีความมาตรา 1 แห่งพระราชบัญญัติฉบับที่ 2/2002 ลงวันที่ 7 สิงหาคม และแหล่งที่มาของกฎหมาย",
    "Penafsiran Pasal 1 Undang-Undang Nomor 2/2002 tanggal 7 Agustus dan Sumber Hukum",
    "Tafsiran Seksyen 1 Akta Nombor 2/2002 bertarikh 7 Ogos dan Sumber Undang-Undang",
    "8月7日第2/2002号法律第1条及法源的解释")
put("TL-H098",
    "Luật về Điều ước quốc tế",
    "พระราชบัญญัติว่าด้วยสนธิสัญญาระหว่างประเทศ",
    "Undang-Undang tentang Perjanjian Internasional",
    "Akta mengenai Perjanjian Antarabangsa",
    "国际条约法")

# ================= 财政 / 预算 =================
BUDGETS = {
    "TL-H016": ("2003/2004", "plain", None, "2003/2004财政年度国家总预算"),
    "TL-H028": ("2004-2005", "plain", None, "2004-2005财政年度国家总预算"),
    "TL-H047": ("2005-2006", "plain", None, "2005-2006财政年度国家总预算"),
    "TL-H061": ("2008", "plain", "Timor-Leste", "2008年东帝汶民主共和国国家总预算"),
    "TL-H078": ("2009", "approve", "Timor-Leste", "核准2009年东帝汶民主共和国国家总预算"),
    "TL-H116": ("2012", "approve", "Timor-Leste", "核准2012年东帝汶民主共和国国家总预算"),
    "TL-H127": ("2013", "plain", None, "2013年国家总预算"),
}
for lid, (y, kind, _tl, zh) in BUDGETS.items():
    body = budget(fy(y), kind)
    items[lid] = {k: ("Luật " if k == "vi" else "พระราชบัญญัติ" if k == "th"
                      else "Undang-Undang " if k == "id" else "Akta ") + body[k]
                  for k in body}
    items[lid]["zh"] = zh
# 泰文年份已在 ค.ศ. 前留空格，避免「พระราชบัญญัติ ค.ศ.」夹空
put("TL-H056",
    "Luật Ngân sách điều chỉnh của Ngân sách nhà nước năm tài chính 2006-2007",
    "พระราชบัญญัติงบประมาณปรับปรุงของงบประมาณแผ่นดินปีงบประมาณ 2006-2007",
    "Undang-Undang Anggaran Perbaikan atas Anggaran Pendapatan dan Belanja Negara Tahun Anggaran 2006-2007",
    "Akta Belanjawan Pembetulan bagi Belanjawan Negara Tahun Fiskal 2006-2007",
    "2006-2007财政年度国家总预算修正预算")
put("TL-H015",
    "Luật Sửa đổi các khoản kinh phí của ngân sách năm tài chính 2002-2003",
    "พระราชบัญญัติแก้ไขเพิ่มเติมงบประมาณรายจ่ายประจำปีงบประมาณ 2002-2003",
    "Undang-Undang Perubahan Alokasi Anggaran Tahun Anggaran 2002-2003",
    "Akta Pindaan Peruntukan Belanjawan Tahun Fiskal 2002-2003",
    "2002-2003财政年度预算拨款修正")
put("TL-H020",
    "Luật Sửa đổi các khoản kinh phí trong ngân sách nhà nước",
    "พระราชบัญญัติแก้ไขเพิ่มเติมงบประมาณรายจ่ายในงบประมาณแผ่นดิน",
    "Undang-Undang Perubahan Alokasi Anggaran dalam Anggaran Pendapatan dan Belanja Negara",
    "Akta Pindaan Peruntukan dalam Belanjawan Negara",
    "总预算所列拨款的修正")
put("TL-H101",
    "Luật về việc sửa đổi thời hạn trình Ngân sách nhà nước năm 2011",
    "พระราชบัญญัติว่าด้วยการแก้ไขกำหนดเวลาการเสนองบประมาณแผ่นดิน ค.ศ. 2011",
    "Undang-Undang tentang Perubahan Tenggat Penyampaian Anggaran Pendapatan dan Belanja Negara Tahun 2011",
    "Akta mengenai Pindaan Tarikh Akhir Pembentangan Belanjawan Negara 2011",
    "关于修改2011年国家总预算提交日期")

# ================= 修正案（带编号） =================
S = {  # 主题短语
    "gsb": {"vi": "việc phê chuẩn Ngân sách nhà nước năm %s",
            "th": "การรับรองงบประมาณแผ่นดิน ค.ศ. %s",
            "id": "Pengesahan Anggaran Pendapatan dan Belanja Negara Tahun %s",
            "ms": "Pengesahan Belanjawan Negara %s"},
}
AMENDS = [
    # id, ordinal, num, day, month, subject(4), zh
    ("TL-H073", "First", "10/2007", 31, "December", "gsb2008",
     "12月31日第10/2007号法律（核准2008年国家总预算）第一次修正"),
    ("TL-H082", "First", "8/2004", 16, "June", "publicservice",
     "6月16日第8/2004号法律（核准公务员章程）第一次修正"),
    ("TL-H086", "First", "3/2006", 12, "April", "combatants",
     "4月12日第3/2006号法律（民族解放战士章程）第一次修正"),
    ("TL-H100", "First", "15/2009", 23, "December", "gsb2010",
     "12月23日第15/2009号法律（核准2010年国家总预算）第一次修正"),
    ("TL-H102", "Second", "3/2006", 12, "April", "combatants",
     "4月12日第3/2006号法律（民族解放战士章程）第二次修正"),
    ("TL-H106", "First", "5/2006", 28, "December", "electadmin",
     "12月28日第5/2006号法律（选举管理机构）第一次修正"),
    ("TL-H107", "Second", "6/2006", 28, "December", "electparl",
     "12月28日第6/2006号法律（国民议会选举法）第二次修正"),
    ("TL-H108", "Second", "7/2006", 28, "December", "electpres",
     "12月28日第7/2006号法律（共和国总统选举法）第二次修正"),
    ("TL-H111", "First", "14/2005", 16, "September", "prosecution",
     "9月16日第14/2005号法律（检察院章程）第一次修正"),
    ("TL-H112", "First", "9/2005", 3, "August", "petrofund",
     "8月3日第9/2005号法律（石油基金法）第一次修正"),
    ("TL-H118", "Third", "6/2006", 28, "December", "electparl",
     "12月28日第6/2006号法律（国民议会选举法）第三次修正"),
    ("TL-H119", "Third", "7/2006", 28, "December", "electpres",
     "12月28日第7/2006号法律（共和国总统选举法）第三次修正"),
    ("TL-H124", "Fourth", "7/2006", 28, "December", "electpres",
     "12月28日第7/2006号法律（共和国总统选举法）第四次修正"),
    ("TL-H125", "First", "16/2011", 21, "December", "gsb2012",
     "12月21日第16/2011号法律（核准2012年国家总预算）第一次修正"),
    ("TL-H129", "First", "9/2011", 17, "August", "courtaccounts",
     "8月17日第9/2011号法律（核准审计法院组织）第一次修正"),
    ("TL-H130", "First", "17/2011", 28, "December", "mlft",
     "12月28日第17/2011号法律（核准反洗钱与反恐融资法律制度）第一次修正"),
    ("TL-H132", "First", "3/2011", 1, "June", "presidency",
     "6月1日第3/2011号法律（共和国总统府组织法）第一次修正"),
    ("TL-H139", "First", "3/2009", 8, "July", "community",
     "7月8日第3/2009号法律（社区领导人与选举）第一次修正"),
    ("TL-H142", "First", "3/2004", 14, "April", "parties",
     "4月14日第3/2004号法律（政党）第一次修正"),
    ("TL-H143", "First", "10/2005", 10, "August", "holidays",
     "8月10日第10/2005号法律（国家假日与官方纪念日）第一次修正"),
    ("TL-H144", "First", "11/2009", 7, "October", "admdiv",
     "对第11/2009号法律的第一次修改"),
]
SUBJ = {
    "publicservice": {"vi": "việc phê chuẩn Quy chế công vụ",
                      "th": "การรับรองข้อกำหนดข้าราชการพลเรือน",
                      "id": "Pengesahan Statuta Layanan Publik",
                      "ms": "Pengesahan Statuta Perkhidmatan Awam"},
    "combatants": {"vi": "Quy chế chiến sĩ giải phóng dân tộc",
                   "th": "ข้อกำหนดทหารผ่านศึกปลดปล่อยชาติ",
                   "id": "Statuta Pejuang Pembebasan Nasional",
                   "ms": "Statuta Pejuang Pembebasan Nasional"},
    "electadmin": {"vi": "Cơ quan quản lý bầu cử",
                   "th": "องค์กรบริหารการเลือกตั้ง",
                   "id": "Badan Penyelenggara Pemilu",
                   "ms": "Badan Pentadbiran Pilihan Raya"},
    "electparl": {"vi": "Luật bầu cử Quốc hội",
                  "th": "กฎหมายการเลือกตั้งรัฐสภาแห่งชาติ",
                  "id": "Undang-Undang Pemilihan Umum Parlemen Nasional",
                  "ms": "Akta Pilihan Raya Parlimen Nasional"},
    "electpres": {"vi": "Luật bầu cử Tổng thống Cộng hòa",
                  "th": "กฎหมายการเลือกตั้งประธานาธิบดี",
                  "id": "Undang-Undang Pemilihan Umum Presiden Republik",
                  "ms": "Akta Pilihan Raya Presiden Republik"},
    "prosecution": {"vi": "Quy chế Bộ Công tố",
                    "th": "ข้อกำหนดองค์กรอัยการ",
                    "id": "Statuta Kejaksaan",
                    "ms": "Statuta Perkhidmatan Pendakwaan Awam"},
    "petrofund": {"vi": "Luật Quỹ Dầu khí",
                  "th": "พระราชบัญญัติกองทุนปิโตรเลียม",
                  "id": "Undang-Undang Dana Perminyakan",
                  "ms": "Akta Dana Petroleum"},
    "courtaccounts": {"vi": "việc phê chuẩn tổ chức Tòa án Kiểm toán",
                      "th": "การรับรององค์กรศาลตรวจเงินแผ่นดิน",
                      "id": "Pengesahan Organisasi Pengadilan Akun",
                      "ms": "Pengesahan Organisasi Mahkamah Akaun"},
    "mlft": {"vi": "việc phê chuẩn chế độ pháp lý về phòng, chống rửa tiền và tài trợ khủng bố",
             "th": "การรับรองข้อกำหนดทางกฎหมายว่าด้วยการป้องกันและปราบปรามการฟอกเงินและการสนับสนุนการก่อการร้าย",
             "id": "Pengesahan Rezim Hukum Pencegahan dan Pemberantasan Pencucian Uang serta Pendanaan Terorisme",
             "ms": "Pengesahan Rejim Undang-Undang Pencegahan dan Pembanterasan Pengubahan Wang Haram serta Pembiayaan Keganasan"},
    "presidency": {"vi": "Luật tổ chức Phủ Tổng thống",
                   "th": "พระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยสำนักประธานาธิบดี",
                   "id": "Undang-Undang Organik Kepresidenan Republik",
                   "ms": "Akta Organik Kepresidenan Republik"},
    "community": {"vi": "Lãnh đạo cộng đồng và bầu cử lãnh đạo cộng đồng",
                  "th": "ผู้นำชุมชนและการเลือกตั้งผู้นำชุมชน",
                  "id": "Kepemimpinan Komunitas dan Pemilihannya",
                  "ms": "Kepimpinan Komuniti dan Pemilihannya"},
    "parties": {"vi": "Đảng chính trị",
                "th": "พรรคการเมือง",
                "id": "Partai Politik",
                "ms": "Parti Politik"},
    "holidays": {"vi": "Ngày lễ quốc gia và ngày kỷ niệm chính thức",
                 "th": "วันหยุดราชการและวันสำคัญทางการ",
                 "id": "Hari Libur Nasional dan Hari Peringatan Resmi",
                 "ms": "Hari Kelepasan Nasional dan Tarikh Peringatan Rasmi"},
    "admdiv": {"vi": "Phân chia hành chính lãnh thổ",
               "th": "การแบ่งเขตการปกครอง",
               "id": "Pembagian Wilayah Administratif",
               "ms": "Pembahagian Wilayah Pentadbiran"},
}
for lid, o, num, d, mo, sk, zh in AMENDS:
    if sk.startswith("gsb"):
        y = sk[3:]
        subj = {k: S["gsb"][k] % y for k in S["gsb"]}
    else:
        subj = SUBJ[sk]
    items[lid] = amend(o, num, d, mo, subj)
    items[lid]["zh"] = zh

# 无编号的修正案
put("TL-H077",
    "Luật Sửa đổi lần thứ nhất Luật Nghĩa vụ quân sự",
    "พระราชบัญญัติแก้ไขเพิ่มเติมพระราชบัญญัติการรับราชการทหาร (ครั้งที่หนึ่ง)",
    "Undang-Undang Perubahan Pertama atas Undang-Undang Wajib Militer",
    "Akta Pindaan Pertama kepada Akta Perkhidmatan Tentera",
    "兵役法第一次修正")
put("TL-H030",
    "Luật Sửa đổi Quy chế thẩm phán",
    "พระราชบัญญัติแก้ไขเพิ่มเติมข้อกำหนดผู้พิพากษา",
    "Undang-Undang Perubahan atas Statuta Hakim",
    "Akta Pindaan kepada Statuta Hakim",
    "法官章程修正")
put("TL-H083",
    "Sửa đổi lần thứ nhất Bộ luật Hình sự theo thẩm định của Quốc hội "
    "(được phê chuẩn bởi Nghị định-Luật số 19/2009 ngày 8 tháng 4)",
    "การแก้ไขเพิ่มเติมประมวลกฎหมายอาญาครั้งที่หนึ่งโดยการพิจารณาของรัฐสภา "
    "(รับรองโดยพระราชกฤษฎีกาฉบับที่ 19/2009 ลงวันที่ 8 เมษายน)",
    "Perubahan Pertama atas Kitab Undang-Undang Hukum Pidana melalui Peninjauan Parlemen "
    "(disahkan oleh Dekret-Undang Nomor 19/2009 tanggal 8 April)",
    "Pindaan Pertama kepada Kanun Keseksaan melalui Semakan Parlimen "
    "(disahkan oleh Dekri-Undang-undang Nombor 19/2009 bertarikh 8 April)",
    "刑法典（4月8日第19/2009号法令核准）经议会审议的第一次修正")

# ================= 一般法 =================
GEN = {
    "TL-H006": (
        "Luật Sửa đổi chế độ thuế",
        "พระราชบัญญัติแก้ไขเพิ่มเติมระบบภาษี",
        "Undang-Undang Perubahan Sistem Perpajakan",
        "Akta Pindaan Sistem Percukaian",
        "税制修正法"),
    "TL-H008": (
        "Ranh giới biển của lãnh thổ nước Cộng hòa Dân chủ Timor-Leste",
        "เขตแดนทางทะเลของดินแดนสาธารณรัฐประชาธิปไตยติมอร์-เลสเต",
        "Batas Maritim Wilayah Republik Demokratik Timor-Leste",
        "Sempadan Maritim Wilayah Republik Demokratik Timor-Leste",
        "东帝汶民主共和国领海边界"),
    "TL-H009": (
        "Quy chế thẩm phán",
        "ข้อกำหนดผู้พิพากษา",
        "Statuta Hakim",
        "Statuta Hakim",
        "法官章程"),
    "TL-H010": (
        "Luật Quốc tịch",
        "พระราชบัญญัติสัญชาติ",
        "Undang-Undang Kewarganegaraan",
        "Akta Kewarganegaraan",
        "国籍法"),
    "TL-H011": (
        "Chế độ pháp lý về bất động sản",
        "ข้อกำหนดทางกฎหมายว่าด้วยอสังหาริมทรัพย์",
        "Rezim Hukum Properti Tak Bergerak",
        "Rejim Undang-Undang Harta Tak Alih",
        "不动产法律制度"),
    "TL-H012": (
        "Sửa đổi Quy định UNTAET số 6/2002 về việc thành lập Dịch vụ Phát thanh Truyền hình Công cộng Đông Timor",
        "การแก้ไขเพิ่มเติมข้อบังคับ UNTAET ฉบับที่ 6/2002 ว่าด้วยการจัดตั้งบริการกระจายเสียงสาธารณะติมอร์ตะวันออก",
        "Perubahan atas Peraturan UNTAET Nomor 6/2002 tentang Pembentukan Layanan Penyiaran Publik Timor Timur",
        "Pindaan kepada Peraturan UNTAET Nombor 6/2002 mengenai Penubuhan Perkhidmatan Penyiatan Awam Timor Timur",
        "修正联合国东帝汶过渡行政当局第6/2002号条例（关于设立东帝汶公共广播服务机构）"),
    "TL-H013": (
        "Luật về thuế đối với các nhà thầu Bayu-Undan",
        "พระราชบัญญัติว่าด้วยการจัดเก็บภาษีจากผู้รับจ้าง Bayu-Undan",
        "Undang-Undang tentang Perpajakan Kontraktor Bayu-Undan",
        "Akta mengenai Percukaian Kontraktor Bayu-Undan",
        "关于Bayu-Undan合同承包商的征税"),
    "TL-H014": (
        "Luật về phát triển dầu khí Biển Timor (ổn định thuế)",
        "พระราชบัญญัติว่าด้วยการพัฒนาปิโตรเลียมทะเลติมอร์ (เสถียรภาพทางภาษี)",
        "Undang-Undang tentang Pengembangan Perminyakan Laut Timor (Stabilitas Pajak)",
        "Akta mengenai Pembangunan Petroleum Laut Timor (Kestabilan Cukai)",
        "关于帝汶海石油开发（税收稳定）"),
    "TL-H017": (
        "Sửa đổi Quy định UNTAET số 2001/10 về việc thành lập Ủy ban Tiếp nhận, Sự thật và Hòa giải",
        "การแก้ไขเพิ่มเติมข้อบังคับ UNTAET ฉบับที่ 2001/10 ว่าด้วยการจัดตั้งคณะกรรมการรับเรื่อง ความจริง และการปรองดอง",
        "Perubahan atas Peraturan UNTAET Nomor 2001/10 tentang Pembentukan Komisi Penerimaan, Kebenaran, dan Rekonsiliasi",
        "Pindaan kepada Peraturan UNTAET Nombor 2001/10 mengenai Penubuhan Suruhanjaya Penerimaan, Kebenaran dan Rekonsiliasi",
        "修正联合国东帝汶过渡行政当局第2001/10号条例（关于设立接待、真相与和解委员会）"),
    "TL-H018": (
        "Luật Nhập cư và Tị nạn",
        "พระราชบัญญัติคนเข้าเมืองและผู้ลี้ภัย",
        "Undang-Undang Keimigrasian dan Suaka",
        "Akta Imigresen dan Suaka",
        "移民与庇护法"),
    "TL-H021": (
        "Bầu cử trưởng thôn (Chefes de Suco) và hội đồng thôn",
        "การเลือกตั้งหัวหน้าหมู่บ้าน (Chefes de Suco) และสภาหมู่บ้าน",
        "Pemilihan Kepala Desa (Chefes de Suco) dan Dewan Desa",
        "Pilihan Raya Ketua Kampung (Chefes de Suco) dan Majlis Kampung",
        "村长与村委员会选举"),
    "TL-H022": (
        "Luật về đảng chính trị",
        "พระราชบัญญัติว่าด้วยพรรคการเมือง",
        "Undang-Undang tentang Partai Politik",
        "Akta mengenai Partai Politik",
        "政党法"),
    "TL-H023": (
        "Luật về công ty thương mại",
        "พระราชบัญญัติว่าด้วยบริษัทพาณิชย์",
        "Undang-Undang tentang Perseroan Komersial",
        "Akta mengenai Syarikat Perdagangan",
        "商业公司法"),
    "TL-H024": (
        "Luật về quy chế nghị sĩ",
        "พระราชบัญญัติว่าด้วยข้อกำหนดสมาชิกรัฐสภา",
        "Undang-Undang tentang Statuta Anggota Parlemen",
        "Akta mengenai Statuta Anggota Parlimen",
        "议员章程"),
    "TL-H026": (
        "Phê chuẩn Quy chế Thanh tra Nhân quyền và Công lý",
        "การรับรองข้อกำหนดผู้ตรวจการแผ่นดินด้านสิทธิมนุษยชนและความยุติธรรม",
        "Pengesahan Statuta Ombudsman Hak Asasi Manusia dan Keadilan",
        "Pengesahan Statuta Ombudsman Hak Asasi Manusia dan Keadilan",
        "核准人权与司法监察专员章程"),
    "TL-H027": (
        "Phê chuẩn Quy chế công vụ",
        "การรับรองข้อกำหนดข้าราชการพลเรือน",
        "Pengesahan Statuta Layanan Publik",
        "Pengesahan Statuta Perkhidmatan Awam",
        "核准公务员章程"),
    "TL-H029": (
        "Luật về hệ thống y tế",
        "พระราชบัญญัติว่าด้วยระบบสุขภาพ",
        "Undang-Undang tentang Sistem Kesehatan",
        "Akta mengenai Sistem Kesihatan",
        "卫生系统法"),
    "TL-H031": (
        "Các tội liên quan đến đánh bắt cá",
        "ความผิดเกี่ยวกับการประมง",
        "Tindak Pidana Terkait Penangkapan Ikan",
        "Kesalahan Berkaitan Penangkapan Ikan",
        "渔业相关犯罪"),
    "TL-H033": (
        "Luật Đầu tư trong nước",
        "พระราชบัญญัติการลงทุนในประเทศ",
        "Undang-Undang Penanaman Modal Dalam Negeri",
        "Akta Pelaburan Dalam Negeri",
        "国内投资法"),
    "TL-H034": (
        "Luật Đầu tư nước ngoài",
        "พระราชบัญญัติการลงทุนต่างประเทศ",
        "Undang-Undang Penanaman Modal Asing",
        "Akta Pelaburan Asing",
        "外国投资法"),
    "TL-H035": (
        "Luật về cấp phép, giám sát và quản lý các công ty bảo hiểm và trung gian bảo hiểm",
        "พระราชบัญญัติว่าด้วยการอนุญาต การกำกับดูแล และการบริหารบริษัทประกันภัยและตัวแทนประกันภัย",
        "Undang-Undang tentang Perizinan, Pengawasan, dan Pengaturan Perusahaan Asuransi serta Perantara Asuransi",
        "Akta mengenai Pelesenan, Penyeliaan dan Pengawalseliaan Syarikat Insurans serta Perantara Insurans",
        "保险公司与保险中介机构的许可、监督与监管法"),
    "TL-H037": (
        "Luật Thuế dầu khí",
        "พระราชบัญญัติภาษีปิโตรเลียม",
        "Undang-Undang Perpajakan Perminyakan",
        "Akta Percukaian Petroleum",
        "石油税法"),
    "TL-H038": (
        "Luật Quỹ Dầu khí",
        "พระราชบัญญัติกองทุนปิโตรเลียม",
        "Undang-Undang Dana Perminyakan",
        "Akta Dana Petroleum",
        "石油基金法"),
    "TL-H039": (
        "Ngày lễ quốc gia và ngày kỷ niệm chính thức",
        "วันหยุดราชการและวันสำคัญทางการ",
        "Hari Libur Nasional dan Hari Peringatan Resmi",
        "Hari Kelepasan Nasional dan Tarikh Peringatan Rasmi",
        "国家假日与官方纪念日"),
    "TL-H040": (
        "Chế độ pháp lý về bất động sản, Phần II: Cho thuê giữa các bên tư nhân",
        "ข้อกำหนดทางกฎหมายว่าด้วยอสังหาริมทรัพย์ ภาคที่ 2: การเช่าระหว่างเอกชน",
        "Rezim Hukum Properti Tak Bergerak, Bagian II: Sewa Menyewa antara Pihak Swasta",
        "Rejim Undang-Undang Harta Tak Alih, Bahagian II: Pajakan antara Pihak Swasta",
        "不动产法律制度第二部分：私人之间的租赁"),
    "TL-H041": (
        "Luật Hoạt động dầu khí",
        "พระราชบัญญัติกิจกรรมปิโตรเลียม",
        "Undang-Undang Kegiatan Perminyakan",
        "Akta Kegiatan Petroleum",
        "石油活动法"),
    "TL-H042": (
        "Quy chế Bộ Công tố",
        "ข้อกำหนดองค์กรอัยการ",
        "Statuta Kejaksaan",
        "Statuta Perkhidmatan Pendakwaan Awam",
        "检察院章程"),
    "TL-H046": (
        "Luật Tự do hội họp và biểu tình",
        "พระราชบัญญัติเสรีภาพในการชุมนุมและการแสดงออก",
        "Undang-Undang Kebebasan Berkumpul dan Berdemonstrasi",
        "Akta Kebebasan Berhimpun dan Berdemonstrasi",
        "集会与示威自由"),
    "TL-H053": (
        "Lương hưu hằng tháng trọn đời và các quyền lợi khác của nghị sĩ",
        "เงินบำนาญรายเดือนตลอดชีพและสิทธิประโยชน์อื่นของสมาชิกรัฐสภา",
        "Pensiun Bulanan Seumur Hidup dan Hak Istimewa Lain Anggota Parlemen",
        "Pencen Bulanan Seumur Hidup dan Keistimewaan Lain Anggota Parlimen",
        "议员终身月退休金及其他待遇"),
    "TL-H055": (
        "Luật Nghĩa vụ quân sự",
        "พระราชบัญญัติการรับราชการทหาร",
        "Undang-Undang Wajib Militer",
        "Akta Perkhidmatan Tentera",
        "兵役法"),
    "TL-H057": (
        "Luật bầu cử Tổng thống Cộng hòa",
        "กฎหมายการเลือกตั้งประธานาธิบดี",
        "Undang-Undang Pemilihan Umum Presiden Republik",
        "Akta Pilihan Raya Presiden Republik",
        "共和国总统选举法"),
    "TL-H067": (
        "Chế độ pháp lý về tài trợ cho các đảng chính trị",
        "ข้อกำหนดทางกฎหมายว่าด้วยการสนับสนุนทางการเงินแก่พรรคการเมือง",
        "Rezim Hukum Pendanaan Partai Politik",
        "Rejim Undang-Undang Pembiayaan Parti Politik",
        "政党筹资法律制度"),
    "TL-H069": (
        "Luật Thuế",
        "พระราชบัญญัติภาษีอากร",
        "Undang-Undang Perpajakan",
        "Akta Percukaian",
        "税法"),
    "TL-H070": (
        "Hệ thống tình báo quốc gia nước Cộng hòa Dân chủ Timor-Leste",
        "ระบบข่าวกรองแห่งชาติของสาธารณรัฐประชาธิปไตยติมอร์-เลสเต",
        "Sistem Intelijen Nasional Republik Demokratik Timor-Leste",
        "Sistem Perisikan Nasional Republik Demokratik Timor-Leste",
        "东帝汶民主共和国国家情报系统"),
    "TL-H071": (
        "Luật về hoạt động võ thuật",
        "พระราชบัญญัติว่าด้วยการฝึกศิลปะการต่อสู้",
        "Undang-Undang tentang Praktik Seni Bela Diri",
        "Akta mengenai Amalan Seni Mempertahankan Diri",
        "武术活动"),
    "TL-H075": (
        "Luật Giáo dục cơ bản",
        "พระราชบัญญัติการศึกษาขั้นพื้นฐาน",
        "Undang-Undang Pendidikan Dasar",
        "Akta Pendidikan Asas",
        "教育基本法"),
    "TL-H076": (
        "Luật về tổ chức và hoạt động của bộ máy hành chính nghị viện",
        "พระราชบัญญัติว่าด้วยการจัดองค์กรและการดำเนินงานของฝ่ายธุรการรัฐสภา",
        "Undang-Undang tentang Organisasi dan Tata Kerja Administrasi Parlemen",
        "Akta mengenai Organisasi dan Tatacara Pentadbiran Parlimen",
        "议会行政组织与运作法"),
    "TL-H079": (
        "Luật Bảo vệ nhân chứng",
        "พระราชบัญญัติการคุ้มครองพยาน",
        "Undang-Undang Perlindungan Saksi",
        "Akta Perlindungan Saksi",
        "证人保护"),
    "TL-H080": (
        "Lãnh đạo cộng đồng và bầu cử lãnh đạo cộng đồng",
        "ผู้นำชุมชนและการเลือกตั้งผู้นำชุมชน",
        "Kepemimpinan Komunitas dan Pemilihannya",
        "Kepimpinan Komuniti dan Pemilihannya",
        "社区领导人与选举"),
    "TL-H081": (
        "Chế độ pháp lý về điều tra nghị viện",
        "ข้อกำหนดทางกฎหมายว่าด้วยการไต่สวนของรัฐสภา",
        "Rezim Hukum Penyelidikan Parlemen",
        "Rejim Undang-Undang Siasatan Parlimen",
        "议会调查法律制度"),
    "TL-H084": (
        "Thành lập Ủy ban Công vụ",
        "การจัดตั้งคณะกรรมการข้าราชการพลเรือน",
        "Pembentukan Komisi Layanan Publik",
        "Penubuhan Suruhanjaya Perkhidmatan Awam",
        "设立公务员委员会"),
    "TL-H085": (
        "Luật về Ủy ban Chống tham nhũng",
        "พระราชบัญญัติว่าด้วยคณะกรรมการต่อต้านการทุจริต",
        "Undang-Undang tentang Komisi Pemberantasan Korupsi",
        "Akta mengenai Suruhanjaya Pencegahan Rasuah",
        "反腐败委员会法"),
    "TL-H087": (
        "Quy chế thù lao của thẩm phán, công tố viên và người bào chữa công",
        "ข้อกำหนดค่าตอบแทนของผู้พิพากษา อัยการ และทนายจำเลยสาธารณะ",
        "Statuta Remunerasi Hakim, Jaksa, dan Penasihat Hukum Publik",
        "Statuta Saraan Hakim, Pendakwa Raya dan Peguam Bela Awam",
        "法官、检察官与公设辩护人薪酬章程"),
    "TL-H088": (
        "Phân chia hành chính lãnh thổ",
        "การแบ่งเขตการปกครอง",
        "Pembagian Wilayah Administratif",
        "Pembahagian Wilayah Pentadbiran",
        "领土行政区划"),
    "TL-H089": (
        "Sử dụng và bảo vệ biểu tượng Chữ thập đỏ tại Timor-Leste",
        "การใช้และการคุ้มครองเครื่องหมายกาชาดในติมอร์-เลสเต",
        "Penggunaan dan Perlindungan Lambang Palang Merah di Timor-Leste",
        "Penggunaan dan Perlindungan Lambang Palang Merah di Timor-Leste",
        "东帝汶红十字标志的使用与保护"),
    "TL-H099": (
        "Luật chống bạo lực gia đình",
        "พระราชบัญญัติต่อต้านความรุนแรงในครอบครัว",
        "Undang-Undang Penanggulangan Kekerasan dalam Rumah Tangga",
        "Akta Menangani Keganasan dalam Rumah Tangga",
        "反家庭暴力法"),
    "TL-H104": (
        "Các tội đầu cơ và tích trữ",
        "ความผิดฐานกักตุนและค้ากำไรเกินควร",
        "Tindak Pidana Penimbunan dan Spekulasi",
        "Kesalahan Penimbunan dan Spekulasi",
        "囤积与投机犯罪"),
    "TL-H105": (
        "Luật tổ chức Ngân hàng Trung ương Timor-Leste",
        "พระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยธนาคารกลางติมอร์-เลสเต",
        "Undang-Undang Organik Bank Sentral Timor-Leste",
        "Akta Organik Bank Pusat Timor-Leste",
        "东帝汶中央银行组织法"),
    "TL-H109": (
        "Tổ chức Tòa án Kiểm toán thuộc Tòa án Hành chính, Thuế và Kiểm toán cấp cao",
        "การจัดองค์กรศาลตรวจเงินแผ่นดินของศาลปกครอง ภาษี และการตรวจเงินแผ่นดินชั้นสูง",
        "Organisasi Pengadilan Akun pada Pengadilan Tinggi Administrasi, Pajak, dan Audit",
        "Organisasi Mahkamah Akaun bagi Mahkamah Tinggi Pentadbiran, Cukai dan Audit",
        "最高行政、税务与审计法院审计庭组织"),
    "TL-H113": (
        "Chế độ nợ công",
        "ข้อกำหนดหนี้สาธารณะ",
        "Rezim Utang Publik",
        "Rejim Hutang Awam",
        "公共债务制度"),
    "TL-H114": (
        "Luật Đầu tư tư nhân",
        "พระราชบัญญัติการลงทุนเอกชน",
        "Undang-Undang Penanaman Modal Swasta",
        "Akta Pelaburan Swasta",
        "私人投资法"),
    "TL-H115": (
        "Luật Hợp tác tư pháp quốc tế trong các vấn đề hình sự",
        "พระราชบัญญัติความร่วมมือทางตุลาการระหว่างประเทศในเรื่องอาญา",
        "Undang-Undang Kerja Sama Peradilan Internasional dalam Perkara Pidana",
        "Akta Kerjasama Kehakiman Antarabangsa dalam Perkara Jenayah",
        "刑事事项国际司法合作法"),
    "TL-H117": (
        "Chế độ pháp lý về phòng, chống rửa tiền và tài trợ khủng bố",
        "ข้อกำหนดทางกฎหมายว่าด้วยการป้องกันและปราบปรามการฟอกเงินและการสนับสนุนการก่อการร้าย",
        "Rezim Hukum Pencegahan dan Pemberantasan Pencucian Uang serta Pendanaan Terorisme",
        "Rejim Undang-Undang Pencegahan dan Pembanterasan Pengubahan Wang Haram serta Pembiayaan Keganasan",
        "反洗钱与反恐融资法律制度"),
    "TL-H122": (
        "Luật về đình công",
        "พระราชบัญญัติว่าด้วยการนัดหยุดงาน",
        "Undang-Undang tentang Pemogokan",
        "Akta mengenai Mogok",
        "罢工法"),
    "TL-H123": (
        "Phê chuẩn chế độ an sinh xã hội chuyển tiếp về tuổi già, tàn tật và tử vong cho công chức nhà nước",
        "การรับรองข้อกำหนดประกันสังคมระยะเปลี่ยนผ่านสำหรับวัยชรา ทุพพลภาพ และการเสียชีวิตของข้าราชการ",
        "Pengesahan Rezim Jaminan Sosial Transisi untuk Usia Lanjut, Cacat, dan Kematian bagi Pegawai Negeri",
        "Pengesahan Rejim Keselamatan Sosial Peralihan bagi Warga Emas, Hilang Upaya dan Kematian Pegawai Awam",
        "核准公共部门工作者年老、残疾与死亡过渡社会保障制度"),
    "TL-H126": (
        "Chế độ pháp lý về hành nghề luật tư nhân và đào tạo luật sư",
        "ข้อกำหนดทางกฎหมายว่าด้วยการประกอบวิชาชีพกฎหมายเอกชนและการฝึกทนายความ",
        "Rezim Hukum Praktik Hukum Swasta dan Pelatihan Advokat",
        "Rejim Undang-Undang Amalan Guaman Swasta dan Latihan Peguam",
        "私人法律执业与律师培养法律制度"),
    "TL-H136": (
        "Luật Truyền thông",
        "พระราชบัญญัติสื่อสารมวลชน",
        "Undang-Undang Media",
        "Akta Media",
        "媒体法"),
    "TL-H138": (
        "Chế độ pháp lý về tổng điều tra dân số và nhà ở",
        "ข้อกำหนดทางกฎหมายว่าด้วยสำมะโนประชากรและเคหะ",
        "Rezim Hukum Sensus Penduduk dan Perumahan",
        "Rejim Undang-Undang Banci Penduduk dan Perumahan",
        "人口与住房普查法律制度"),
    "TL-H140": (
        "Chế độ pháp lý về hành nghề luật tư nhân và đào tạo luật sư",
        "ข้อกำหนดทางกฎหมายว่าด้วยการประกอบวิชาชีพกฎหมายเอกชนและการฝึกทนายความ",
        "Rezim Hukum Praktik Hukum Swasta dan Pelatihan Advokat",
        "Rejim Undang-Undang Amalan Guaman Swasta dan Latihan Peguam",
        "私人法律执业与律师培养法律制度"),
    "TL-H145": (
        "Thủ tục ân xá và giảm án",
        "ขั้นตอนการพระราชทานอภัยโทษและการลดโทษ",
        "Prosedur Pemberian Grasi dan Pengurangan Hukuman",
        "Prosedur Pemberian Pengampunan dan Pengurangan Hukuman",
        "赦免与减刑程序"),
    "TL-H146": (
        "Luật Đăng ký cử tri",
        "พระราชบัญญัติการลงทะเบียนผู้มีสิทธิเลือกตั้ง",
        "Undang-Undang Pendaftaran Pemilih",
        "Akta Pendaftaran Pengundi",
        "选民登记法"),
    "TL-H120": (
        "Luật Ủy quyền lập pháp về các vấn đề môi trường",
        "พระราชบัญญัติการมอบอำนาจนิติบัญญัติในเรื่องสิ่งแวดล้อม",
        "Undang-Undang Pemberian Kuasa Legislatif dalam Hal Lingkungan Hidup",
        "Akta Pemberian Kuasa Perundangan dalam Perkara Alam Sekitar",
        "环境事项立法授权法"),
    "TL-H131": (
        "Luật Ủy quyền lập pháp về thi hành án phạt và các biện pháp tước tự do và không tước tự do",
        "พระราชบัญญัติการมอบอำนาจนิติบัญญัติในเรื่องการบังคับโทษและมาตรการจำกัดเสรีภาพและไม่จำกัดเสรีภาพ",
        "Undang-Undang Pemberian Kuasa Legislatif dalam Hal Pelaksanaan Pidana serta Tindakan Penahanan dan Non-Penahanan",
        "Akta Pemberian Kuasa Perundangan dalam Perkara Pelaksanaan Hukuman serta Langkah Tahanan dan Bukan Tahanan",
        "刑罚执行及剥夺与非剥夺自由措施事项立法授权法"),
    "TL-H043": (
        "Luật Ủy quyền lập pháp về tố tụng hình sự",
        "พระราชบัญญัติการมอบอำนาจนิติบัญญัติในเรื่องวิธีพิจารณาความอาญา",
        "Undang-Undang Pemberian Kuasa Legislatif dalam Hal Hukum Acara Pidana",
        "Akta Pemberian Kuasa Perundangan dalam Perkara Tatacara Jenayah",
        "刑事诉讼事项立法授权法"),
    "TL-H044": (
        "Luật Ủy quyền lập pháp về các vấn đề hình sự",
        "พระราชบัญญัติการมอบอำนาจนิติบัญญัติในเรื่องโทษทางอาญา",
        "Undang-Undang Pemberian Kuasa Legislatif dalam Hal Pidana",
        "Akta Pemberian Kuasa Perundangan dalam Perkara Hukuman Jenayah",
        "刑罚事项立法授权法"),
    "TL-H045": (
        "Luật Ủy quyền lập pháp về tố tụng dân sự",
        "พระราชบัญญัติการมอบอำนาจนิติบัญญัติในเรื่องวิธีพิจารณาความแพ่ง",
        "Undang-Undang Pemberian Kuasa Legislatif dalam Hal Hukum Acara Perdata",
        "Akta Pemberian Kuasa Perundangan dalam Perkara Tatacara Sivil",
        "民事诉讼事项立法授权法"),
}
for lid, (vi, th, id_, ms, zh) in GEN.items():
    put(lid, vi, th, id_, ms, zh)

# 泰文顶层不得出现「พระราชบัญญัติ ค.ศ.」这种夹空——统一收掉层级词后的空格
for lid, d in items.items():
    if "th" in d:
        for w in ("พระราชบัญญัติ", "ประมวลกฎหมาย", "พระราชกฤษฎีกา", "กฎกระทรวง"):
            d["th"] = d["th"].replace(w + " ", w)
        d["th"] = d["th"].replace(" ค.ศ.", " ค.ศ.").strip()

doc = {
    "batch": "tl-p2-b01",
    "scope": "TL 东帝汶法 第 1 批 115 部（TL-CIVIL-2011 … TL-H146）",
    "note": "语义基准 title.en（官方英文本，可靠）；zh 存量有葡中混杂损坏，"
            "本批仅重写明显损坏者；年份一律 ค.ศ.；泰文层级词后不加空格。",
    "items": items,
}

_here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(_here, "batches", "tl-p2-b01.json")
io.open(out, "w", encoding="utf-8", newline="\n").write(
    json.dumps(doc, ensure_ascii=False, indent=1))
print("写出", out, "部数", len(items))
