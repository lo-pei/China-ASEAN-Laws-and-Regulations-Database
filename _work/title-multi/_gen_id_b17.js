// b17 批次（buckets.phrase 785..835）：按条目 id 直接落「id → 五语」。
// 与 b01..b16 口径一致：zh 只译主题不带文号；en/vi/th/ms 用 "Law on X" 句式。
// 一标题多 id 的（PENETAPAN PERPPU 11 条、PEMBUATAN PERJANJIAN 2 条）逐 id 定制，
// 故不走 _id_expand.js（它按标题展开，会给出 11 个同义标题）。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const P = (zh, en, vi, th, ms) => ({ zh, en, vi, th, ms });

const items = {
  // ── 汽油消费税附加税 ──
  'ID-H096': P(
    '汽油消费税附加征收法',
    'Law on the Imposition of an Opcenten on the Petrol Excise',
    'Luật về Việc Áp dụng Phụ thu đối với Thuế Tiêu thụ Đặc biệt Xăng',
    'พระราชบัญญัติว่าด้วยการจัดเก็บภาษีเพิ่มเติมจากภาษีสรรพสามิตน้ำมันเบนซิน',
    'Akta tentang Pengenaan Cukai Tambahan ke atas Duti Eksais Petrol',
  ),

  // ── 预算修正 / 决算 ──
  'ID-H1146': P(
    '对1998年第3号1998/1999年度国家收支预算法的修正法',
    'Law Amending Law No. 3 of 1998 on the State Budget for the 1998/1999 Fiscal Year',
    'Luật Sửa đổi Luật số 3 năm 1998 về Ngân sách Nhà nước Năm ngân sách 1998/1999',
    'พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายฉบับที่ 3 ปี 1998 ว่าด้วยงบประมาณรายรับรายจ่ายแผ่นดินปีงบประมาณ 1998/1999',
    'Akta Meminda Undang-Undang No. 3 Tahun 1998 tentang Anggaran Pendapatan dan Belanja Negara Tahun Anggaran 1998/1999',
  ),
  'ID-H1288': P(
    '对1999年第7号1999/2000年度国家收支预算法的修正法',
    'Law Amending Law No. 7 of 1999 on the State Budget for the 1999/2000 Fiscal Year',
    'Luật Sửa đổi Luật số 7 năm 1999 về Ngân sách Nhà nước Năm ngân sách 1999/2000',
    'พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายฉบับที่ 7 ปี 1999 ว่าด้วยงบประมาณรายรับรายจ่ายแผ่นดินปีงบประมาณ 1999/2000',
    'Akta Meminda Undang-Undang No. 7 Tahun 1999 tentang Anggaran Pendapatan dan Belanja Negara Tahun Anggaran 1999/2000',
  ),
  'ID-H437': P(
    '1982/1983年度国家预算决算法',
    'Law on the State Budget Accounts for the 1982/1983 Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính 1982/1983',
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ 1982/1983',
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran 1982/1983',
  ),
  'ID-H442': P(
    '1984/1985年度国家预算决算法',
    'Law on the State Budget Accounts for the 1984/1985 Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính 1984/1985',
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ 1984/1985',
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran 1984/1985',
  ),
  'ID-H449': P(
    '1985/1986年度国家预算决算法',
    'Law on the State Budget Accounts for the 1985/1986 Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính 1985/1986',
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ 1985/1986',
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran 1985/1986',
  ),
  'ID-H456': P(
    '1986/1987年度国家预算决算法',
    'Law on the State Budget Accounts for the 1986/1987 Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính 1986/1987',
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ 1986/1987',
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran 1986/1987',
  ),
  'ID-H777': P(
    '1993/1994年度国家预算决算法',
    'Law on the State Budget Accounts for the 1993/1994 Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính 1993/1994',
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ 1993/1994',
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran 1993/1994',
  ),

  // ── 破产 / 刑法 / 货币 / 印章税 ──
  'ID-H1282': P(
    '为公共利益申请破产宣告法',
    'Law on the Application for a Declaration of Bankruptcy in the Public Interest',
    'Luật về Việc Yêu cầu Tuyên bố Phá sản vì Lợi ích Công cộng',
    'พระราชบัญญัติว่าด้วยการยื่นคำขอให้ประกาศล้มละลายเพื่อประโยชน์สาธารณะ',
    'Akta tentang Permohonan Pernyataan Muflis untuk Kepentingan Awam',
  ),
  'ID-H133': P(
    '1953年货币法修改法',
    'Law Amending the 1953 Currency Law',
    'Luật Sửa đổi Luật Tiền tệ năm 1953',
    'พระราชบัญญัติแก้ไขเพิ่มเติมกฎหมายเงินตราปี 1953',
    'Akta Meminda Undang-Undang Mata Wang Tahun 1953',
  ),
  'ID-H1149': P(
    '刑法典修改法',
    'Law Amending the Criminal Code',
    'Luật Sửa đổi Bộ luật Hình sự',
    'พระราชบัญญัติแก้ไขเพิ่มเติมประมวลกฎหมายอาญา',
    'Akta Meminda Kanun Keseksaan',
  ),
  'ID-H238': P(
    '印花税法修改与补充法',
    'Law Amending and Supplementing the Stamp Duty Regulations',
    'Luật Sửa đổi và Bổ sung Quy định Thuế Tem',
    'พระราชบัญญัติแก้ไขเพิ่มเติมและเพิ่มเติมข้อบังคับอากรแสตมป์',
    'Akta Meminda dan Menambah Peraturan Duti Setem',
  ),
  'ID-H640': P(
    '专利证书格式与内容法',
    'Law on the Form and Content of Letters Patent',
    'Luật về Hình thức và Nội dung của Bằng Độc quyền Sáng chế',
    'พระราชบัญญัติว่าด้วยรูปแบบและเนื้อหาของหนังสือสำคัญสิทธิบัตร',
    'Akta tentang Bentuk dan Kandungan Surat Paten',
  ),
  'ID-H124': P(
    '港口费费率提高法',
    'Law on the Increase of Harbour Dues',
    'Luật về Việc Tăng Lệ phí Cảng',
    'พระราชบัญญัติว่าด้วยการเพิ่มอัตราค่าธรรมเนียมท่าเรือ',
    'Akta tentang Kenaikan Tarif Wang Labuhan',
  ),
  'ID-H125': P(
    '重货港税法修改与补充法',
    'Law Amending and Supplementing the Heavy Goods Port Duty Law',
    'Luật Sửa đổi và Bổ sung Luật Thuế Cảng Hàng nặng',
    'พระราชบัญญัติแก้ไขเพิ่มเติมและเพิ่มเติมกฎหมายอากรท่าเรือสินค้าหนัก',
    'Akta Meminda dan Menambah Undang-Undang Duti Pelabuhan Barang Berat',
  ),
  'ID-H087': P(
    '出生证明与死亡证明收费法',
    'Law on the Fees for Birth Certificates and Death Certificates',
    'Luật về Lệ phí Giấy Khai sinh và Giấy Khai tử',
    'พระราชบัญญัติว่าด้วยค่าธรรมเนียมใบรับรองการเกิดและใบรับรองการตาย',
    'Akta tentang Fi Surat Kenal Lahir dan Surat Kenal Mati',
  ),
  'ID-H090': P(
    '授予财政部长透支权法',
    'Law on the Granting of Authority to the Minister of Finance to Obtain Advances',
    'Luật về Việc Trao quyền cho Bộ trưởng Tài chính trong Việc Vay Ứng trước',
    'พระราชบัญญัติว่าด้วยการมอบอำนาจให้รัฐมนตรีว่าการกระทรวงการคลังในการเบิกเงินเกินบัญชี',
    'Akta tentang Pemberian Kuasa kepada Menteri Kewangan untuk Mendapatkan Wang Pendahuluan',
  ),

  // ── 条约 / 协定批准 ──
  'ID-H136': P(
    '印度尼西亚与日本和平协定及赔偿协定批准法',
    'Law on the Ratification of the Peace Agreement and the Reparations Agreement between Indonesia and Japan',
    'Luật về Việc Phê chuẩn Hiệp định Hòa bình và Hiệp định Bồi thường giữa Indonesia và Nhật Bản',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงสันติภาพและความตกลงค่าชดเชยระหว่างอินโดนีเซียกับญี่ปุ่น',
    'Akta tentang Pengesahan Perjanjian Damai dan Perjanjian Pampasan antara Indonesia dan Jepun',
  ),
  'ID-H139': P(
    '印度尼西亚与中华人民共和国双重国籍条约批准法',
    'Law on the Ratification of the Treaty between Indonesia and the People\u2019s Republic of China on Dual Nationality',
    'Luật về Việc Phê chuẩn Hiệp ước giữa Indonesia và Cộng hòa Nhân dân Trung Hoa về Hai Quốc tịch',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างอินโดนีเซียกับสาธารณรัฐประชาชนจีนว่าด้วยสองสัญชาติ',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Republik Rakyat China mengenai Dwikewarganegaraan',
  ),
  'ID-H168': P(
    '印度尼西亚与伊朗友好条约批准法',
    'Law on the Ratification of the Treaty of Friendship between Indonesia and Iran',
    'Luật về Việc Phê chuẩn Hiệp ước Hữu nghị giữa Indonesia và Iran',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญามิตรภาพระหว่างอินโดนีเซียกับอิหร่าน',
    'Akta tentang Pengesahan Perjanjian Persahabatan antara Indonesia dan Iran',
  ),
  'ID-H281': P(
    '印度尼西亚与荷兰未结财务问题协定批准法',
    'Law on the Ratification of the Agreement between the Netherlands and Indonesia on Outstanding Financial Matters',
    'Luật về Việc Phê chuẩn Hiệp định giữa Hà Lan và Indonesia về Các Vấn đề Tài chính Chưa được Giải quyết',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างเนเธอร์แลนด์กับอินโดนีเซียว่าด้วยเรื่องการเงินที่ยังไม่ยุติ',
    'Akta tentang Pengesahan Perjanjian antara Belanda dan Indonesia mengenai Soal-soal Kewangan yang Belum Diselesaikan',
  ),
  'ID-H344': P(
    '印度尼西亚与澳大利亚特定边界线协定批准法',
    'Law on the Ratification of the Agreement between Indonesia and Australia on Certain Boundary Lines',
    'Luật về Việc Phê chuẩn Hiệp định giữa Indonesia và Australia về Các Đường Biên giới Nhất định',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างอินโดนีเซียกับออสเตรเลียว่าด้วยเส้นเขตแดนบางเส้น',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Australia mengenai Garis-garis Sempadan Tertentu',
  ),
  'ID-H345': P(
    '印度尼西亚与新加坡新加坡海峡领海划界协定批准法',
    'Law on the Ratification of the Agreement between Indonesia and Singapore on the Delimitation of the Territorial Seas of the Two Countries in the Strait of Singapore',
    'Luật về Việc Phê chuẩn Hiệp định giữa Indonesia và Singapore về Việc Phân định Lãnh hải của Hai Nước tại Eo biển Singapore',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างอินโดนีเซียกับสิงคโปร์ว่าด้วยการกำหนดเส้นแบ่งน่านน้ำอาณาเขตของทั้งสองประเทศในช่องแคบสิงคโปร์',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Singapura mengenai Penetapan Sempadan Laut Wilayah Kedua Negara di Selat Singapura',
  ),
  'ID-H334': P(
    '印度尼西亚与马来西亚马六甲海峡领海划界协定批准法',
    'Law on the Ratification of the Agreement between Indonesia and Malaysia on the Delimitation of the Territorial Seas of the Two Countries in the Strait of Malacca',
    'Luật về Việc Phê chuẩn Hiệp định giữa Indonesia và Malaysia về Việc Phân định Lãnh hải của Hai Nước tại Eo biển Malacca',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างอินโดนีเซียกับมาเลเซียว่าด้วยการกำหนดเส้นแบ่งน่านน้ำอาณาเขตของทั้งสองประเทศในช่องแคบมะละกา',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Malaysia mengenai Penetapan Sempadan Laut Wilayah Kedua Negara di Selat Melaka',
  ),
  'ID-H1976': P(
    '印度尼西亚与新加坡新加坡海峡西部领海划界条约批准法',
    'Law on the Ratification of the Treaty between Indonesia and Singapore on the Delimitation of the Territorial Seas of the Two Countries in the Western Part of the Strait of Singapore',
    'Luật về Việc Phê chuẩn Hiệp ước giữa Indonesia và Singapore về Việc Phân định Lãnh hải của Hai Nước tại Phần phía Tây Eo biển Singapore',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างอินโดนีเซียกับสิงคโปร์ว่าด้วยการกำหนดเส้นแบ่งน่านน้ำอาณาเขตของทั้งสองประเทศในส่วนตะวันตกของช่องแคบสิงคโปร์',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Singapura mengenai Penetapan Sempadan Laut Wilayah Kedua Negara di Bahagian Barat Selat Singapura',
  ),
  'ID-H1117': P(
    '印度尼西亚与澳大利亚刑事司法协助协定批准法',
    'Law on the Ratification of the Treaty between Indonesia and Australia on Mutual Assistance in Criminal Matters',
    'Luật về Việc Phê chuẩn Hiệp ước giữa Indonesia và Australia về Tương trợ Tư pháp trong Các Vấn đề Hình sự',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างอินโดนีเซียกับออสเตรเลียว่าด้วยความช่วยเหลือซึ่งกันและกันในเรื่องอาญา',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Australia mengenai Bantuan Bersama dalam Perkara Jenayah',
  ),
  'ID-H210': P(
    '印度尼西亚与捷克斯洛伐克友好合作条约缔结法',
    'Law on the Conclusion of the Treaty of Friendship and Cooperation between Indonesia and Czechoslovakia',
    'Luật về Việc Ký kết Hiệp ước Hữu nghị và Hợp tác giữa Indonesia và Tiệp Khắc',
    'พระราชบัญญัติว่าด้วยการทำสนธิสัญญามิตรภาพและความร่วมมือระหว่างอินโดนีเซียกับเชโกสโลวาเกีย',
    'Akta tentang Penggubalan Perjanjian Persahabatan dan Kerjasama antara Indonesia dan Czechoslovakia',
  ),
  'ID-H211': P(
    '印度尼西亚与匈牙利友好合作条约缔结法',
    'Law on the Conclusion of the Treaty of Friendship and Cooperation between Indonesia and Hungary',
    'Luật về Việc Ký kết Hiệp ước Hữu nghị và Hợp tác giữa Indonesia và Hungary',
    'พระราชบัญญัติว่าด้วยการทำสนธิสัญญามิตรภาพและความร่วมมือระหว่างอินโดนีเซียกับฮังการี',
    'Akta tentang Penggubalan Perjanjian Persahabatan dan Kerjasama antara Indonesia dan Hungary',
  ),
  'ID-H224': P(
    '国家石油公司与外国石油公司产量分成合同批准法',
    'Law on the Ratification of Production Sharing Contracts between State Oil Companies and Foreign Oil Companies',
    'Luật về Việc Phê chuẩn Hợp đồng Chia Sản lượng giữa Các Công ty Dầu khí Nhà nước và Các Công ty Dầu khí Nước ngoài',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสัญญาแบ่งปันผลผลิตระหว่างบริษัทน้ำมันแห่งรัฐกับบริษัทน้ำมันต่างประเทศ',
    'Akta tentang Pengesahan Kontrak Perkongsian Pengeluaran antara Syarikat Minyak Negara dengan Syarikat Minyak Asing',
  ),

  // ── 国际公约批准 ──
  'ID-H1564': P(
    '批准《联合国反腐败公约》法',
    'Law on the Ratification of the United Nations Convention against Corruption',
    'Luật về Việc Phê chuẩn Công ước Liên Hợp Quốc về Chống Tham nhũng',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านการทุจริต',
    'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu menentang Rasuah',
  ),
  'ID-H1881': P(
    '批准《联合国打击跨国有组织犯罪公约》法',
    'Law on the Ratification of the United Nations Convention against Transnational Organized Crime',
    'Luật về Việc Phê chuẩn Công ước Liên Hợp Quốc về Chống Tội phạm Có Tổ chức Xuyên quốc gia',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านอาชญากรรมข้ามชาติที่มีการจัดองค์กร',
    'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu menentang Jenayah Terancang Transnasional',
  ),
  'ID-H911': P(
    '批准《联合国禁止非法贩运麻醉药品和精神药物公约》法',
    'Law on the Ratification of the United Nations Convention against Illicit Traffic in Narcotic Drugs and Psychotropic Substances',
    'Luật về Việc Phê chuẩn Công ước Liên Hợp Quốc về Chống Buôn bán Bất hợp pháp Thuốc gây nghiện và Chất hướng thần',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านการลักลอบค้ายาเสพติดและวัตถุออกฤทธิ์ต่อจิตประสาท',
    'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu menentang Penyeludupan Haram Dadah Narkotik dan Bahan Psikotropik',
  ),
  'ID-H1114': P(
    '批准国际劳工组织第138号最低就业年龄公约法',
    'Law on the Ratification of ILO Convention No. 138 concerning Minimum Age for Admission to Employment',
    'Luật về Việc Phê chuẩn Công ước ILO số 138 về Tuổi tối thiểu được Nhận vào Làm việc',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาไอแอลโอฉบับที่ 138 ว่าด้วยอายุขั้นต่ำในการรับเข้าทำงาน',
    'Akta tentang Pengesahan Konvensyen ILO No. 138 mengenai Umur Minimum untuk Diterima Bekerja',
  ),

  // ── 政府代法令升格（11 条，逐条定制） ──
  'ID-H1867': P(
    '税收通则与程序法第四次修正代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 5 of 2008 on the Fourth Amendment to the General Provisions and Procedures of Taxation',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 5 năm 2008 về Sửa đổi lần thứ tư Luật Quy định Chung và Thủ tục Thuế thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 5 ปี 2008 ว่าด้วยการแก้ไขเพิ่มเติมบทบัญญัติทั่วไปและวิธีปฏิบัติทางภาษีอากรครั้งที่สี่ ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 5 Tahun 2008 tentang Pindaan Keempat Undang-Undang Peruntukan Am dan Prosedur Cukai sebagai Undang-Undang',
  ),
  'ID-H974': P(
    '破产法修正代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 1 of 1998 on the Amendment to the Bankruptcy Law',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 1998 về Sửa đổi Luật Phá sản thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 1998 ว่าด้วยการแก้ไขเพิ่มเติมกฎหมายล้มละลาย ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 1998 tentang Pindaan Undang-Undang Kebankrapan sebagai Undang-Undang',
  ),
  'ID-H1255': P(
    '沙璜自由贸易区与自由港代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 2 of 2000 on the Sabang Free Trade Zone and Free Port',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 2 năm 2000 về Khu Thương mại Tự do và Cảng Tự do Sabang thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 2 ปี 2000 ว่าด้วยเขตการค้าเสรีและท่าเรือเสรีซาบัง ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 2 Tahun 2000 tentang Wilayah Perdagangan Bebas dan Pelabuhan Bebas Sabang sebagai Undang-Undang',
  ),
  'ID-H1429': P(
    '恐怖主义犯罪惩治代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 1 of 2002 on the Eradication of Criminal Acts of Terrorism',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2002 về Trấn áp Tội phạm Khủng bố thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2002 ว่าด้วยการปราบปรามอาชญากรรมก่อการร้าย ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2002 tentang Pembanterasan Jenayah Keganasan sebagai Undang-Undang',
  ),
  'ID-H1430': P(
    '巴厘岛爆炸事件适用反恐代法令的代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 2 of 2002 on the Application of the Anti-Terrorism Regulation to the Bali Bombing',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 2 năm 2002 về Việc Áp dụng Quy định Chống Khủng bố đối với Vụ Đánh bom Bali thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 2 ปี 2002 ว่าด้วยการใช้บังคับกฎระเบียบต่อต้านการก่อการร้ายในเหตุระเบิดบาหลี ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 2 Tahun 2002 tentang Penggunaan Peraturan Antikeganasan bagi Peristiwa Pengeboman Bali sebagai Undang-Undang',
  ),
  'ID-H1453': P(
    '大选法修正代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 2 of 2004 on the Amendment to Law No. 12 of 2003 on the General Election of Members of the House of Representatives, the Regional Representative Council and the Regional Legislative Councils',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 2 năm 2004 về Sửa đổi Luật số 12 năm 2003 về Bầu cử Thành viên Hạ viện, Hội đồng Đại diện Khu vực và Hội đồng Lập pháp Khu vực thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 2 ปี 2004 ว่าด้วยการแก้ไขเพิ่มเติมกฎหมายฉบับที่ 12 ปี 2003 ว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร สภาผู้แทนเขต และสภาบัญญัติเขต ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 2 Tahun 2004 tentang Pindaan Undang-Undang No. 12 Tahun 2003 tentang Pilihan Raya Umum Anggota Dewan Perwakilan Rakyat, Dewan Perwakilan Daerah dan Dewan Perwakilan Rakyat Daerah sebagai Undang-Undang',
  ),
  'ID-H1498': P(
    '劳动关系争议解决法延期施行代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 1 of 2005 on the Postponement of the Entry into Force of Law No. 2 of 2004 on the Settlement of Industrial Relations Disputes',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2005 về Việc Hoãn Hiệu lực của Luật số 2 năm 2004 về Giải quyết Tranh chấp Quan hệ Lao động thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2005 ว่าด้วยการเลื่อนการบังคับใช้กฎหมายฉบับที่ 2 ปี 2004 ว่าด้วยการระงับข้อพิพาทแรงงานสัมพันธ์ ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2005 tentang Penangguhan Permulaan Berkuatkuasa Undang-Undang No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Perindustrian sebagai Undang-Undang',
  ),
  'ID-H1661': P(
    '巴淡自由贸易区与自由港法修正代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 1 of 2007 on the Amendment to Law No. 36 of 2000 on the Batam Free Trade Zone and Free Port',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2007 về Sửa đổi Luật số 36 năm 2000 về Khu Thương mại Tự do và Cảng Tự do Batam thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2007 ว่าด้วยการแก้ไขเพิ่มเติมกฎหมายฉบับที่ 36 ปี 2000 ว่าด้วยเขตการค้าเสรีและท่าเรือเสรีบาตัม ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2007 tentang Pindaan Undang-Undang No. 36 Tahun 2000 tentang Wilayah Perdagangan Bebas dan Pelabuhan Bebas Batam sebagai Undang-Undang',
  ),
  'ID-H1663': P(
    '亚齐与尼亚斯重建法律问题处理代法令升格法',
    'Law on the Enactment of the Government Regulation in Lieu of Law on the Handling of Legal Issues in the Rehabilitation and Reconstruction of Aceh and Nias',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật về Việc Xử lý Vấn đề Pháp lý trong Phục hồi và Tái thiết Aceh và Nias thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายว่าด้วยการจัดการปัญหากฎหมายในการฟื้นฟูและบูรณะอาเจะห์และนีอัส ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang tentang Pengendalian Isu Perundangan dalam Pemulihan dan Pembinaan Semula Aceh dan Nias sebagai Undang-Undang',
  ),
  'ID-H1779': P(
    '巴布亚特别自治法修正代法令升格法',
    'Law on the Enactment of Government Regulation in Lieu of Law No. 1 of 2008 on the Amendment to Law No. 21 of 2001 on Special Autonomy for the Province of Papua',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật số 1 năm 2008 về Sửa đổi Luật số 21 năm 2001 về Quyền Tự trị Đặc biệt cho Tỉnh Papua thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายฉบับที่ 1 ปี 2008 ว่าด้วยการแก้ไขเพิ่มเติมกฎหมายฉบับที่ 21 ปี 2001 ว่าด้วยการปกครองตนเองพิเศษของจังหวัดปาปัว ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang No. 1 Tahun 2008 tentang Pindaan Undang-Undang No. 21 Tahun 2001 tentang Autonomi Khas bagi Wilayah Papua sebagai Undang-Undang',
  ),
  'ID-H417': P(
    '增值税法延期施行代法令升格法',
    'Law on the Enactment of the Government Regulation in Lieu of Law on the Postponement of the Entry into Force of the 1984 Value Added Tax Law',
    'Luật về Việc Ban hành Quy định của Chính phủ thay thế Luật về Việc Hoãn Hiệu lực của Luật Thuế Giá trị Gia tăng năm 1984 thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายว่าด้วยการเลื่อนการบังคับใช้กฎหมายภาษีมูลค่าเพิ่มปี 1984 ให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Peraturan Pemerintah Pengganti Undang-Undang tentang Penangguhan Permulaan Berkuatkuasa Undang-Undang Cukai Nilai Tambah 1984 sebagai Undang-Undang',
  ),
  'ID-H314': P(
    '若干政府代法令升格为法律法',
    'Law on the Enactment of Various Government Regulations in Lieu of Law as Law',
    'Luật về Việc Ban hành Nhiều Quy định của Chính phủ Thay thế Luật thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎระเบียบรัฐบาลแทนกฎหมายหลายฉบับให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Pelbagai Peraturan Pemerintah Pengganti Undang-Undang sebagai Undang-Undang',
  ),

  // ── 经济特区 ──
  'ID-H1602': P(
    '巴淡自由贸易区与自由港法',
    'Law on the Batam Free Trade Zone and Free Port',
    'Luật về Khu Thương mại Tự do và Cảng Tự do Batam',
    'พระราชบัญญัติว่าด้วยเขตการค้าเสรีและท่าเรือเสรีบาตัม',
    'Akta tentang Wilayah Perdagangan Bebas dan Pelabuhan Bebas Batam',
  ),
  'ID-H2617': P(
    '亚伦洛克苏马韦经济特区法',
    'Law on the Arun Lhokseumawe Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Arun Lhokseumawe',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษอารุนโละเซอูมาเว',
    'Akta tentang Wilayah Ekonomi Khas Arun Lhokseumawe',
  ),
  'ID-H2618': P(
    '加朗巴唐经济特区法',
    'Law on the Galang Batang Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Galang Batang',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษกาลังบาตัง',
    'Akta tentang Wilayah Ekonomi Khas Galang Batang',
  ),
  'ID-H2777': P(
    '肯达尔经济特区法',
    'Law on the Kendal Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Kendal',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษเกนดัล',
    'Akta tentang Wilayah Ekonomi Khas Kendal',
  ),
  'ID-H2778': P(
    '利库庞经济特区法',
    'Law on the Likupang Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Likupang',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษลีกูปัง',
    'Akta tentang Wilayah Ekonomi Khas Likupang',
  ),
  'ID-H2779': P(
    '辛哈萨里经济特区法',
    'Law on the Singhasari Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Singhasari',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษสิงหะส่าหรี',
    'Akta tentang Wilayah Ekonomi Khas Singhasari',
  ),
  'ID-H3131': P(
    '库拉库拉巴厘经济特区法',
    'Law on the Kura Kura Bali Special Economic Zone',
    'Luật về Khu Kinh tế Đặc biệt Kura Kura Bali',
    'พระราชบัญญัติว่าด้วยเขตเศรษฐกิจพิเศษกูรากูราบาหลี',
    'Akta tentang Wilayah Ekonomi Khas Kura Kura Bali',
  ),

  // ── 机构资本 / 成员资格 / 荣誉 / 地方 ──
  'ID-H1481': P(
    '存款保险机构初始资本法',
    'Law on the Initial Capital of the Deposit Insurance Agency',
    'Luật về Vốn Ban đầu của Cơ quan Bảo hiểm Tiền gửi',
    'พระราชบัญญัติว่าด้วยทุนเริ่มต้นขององค์การประกันเงินฝาก',
    'Akta tentang Modal Permulaan Lembaga Penjamin Simpanan',
  ),
  'ID-H2877': P(
    '投资管理机构初始资本法',
    'Law on the Initial Capital of the Investment Management Agency',
    'Luật về Vốn Ban đầu của Cơ quan Quản lý Đầu tư',
    'พระราชบัญญัติว่าด้วยทุนเริ่มต้นขององค์การบริหารการลงทุน',
    'Akta tentang Modal Permulaan Lembaga Pengelola Pelaburan',
  ),
  'ID-H274': P(
    '印度尼西亚重返国际货币基金组织与世界银行成员资格法',
    'Law on the Resumption of Indonesia\u2019s Membership in the International Monetary Fund and the International Bank for Reconstruction and Development',
    'Luật về Việc Khôi phục Tư cách Thành viên của Indonesia tại Quỹ Tiền tệ Quốc tế và Ngân hàng Quốc tế về Tái thiết và Phát triển',
    'พระราชบัญญัติว่าด้วยการกลับเข้าเป็นสมาชิกของอินโดนีเซียในกองทุนการเงินระหว่างประเทศและธนาคารระหว่างประเทศเพื่อการบูรณะและพัฒนา',
    'Akta tentang Penyertaan Semula Indonesia sebagai Ahli dalam Tabung Kewangan Antarabangsa dan Bank Antarabangsa bagi Pembinaan Semula dan Pembangunan',
  ),
  'ID-H341': P(
    '勋章种类等级序列法',
    'Law on the Order of Grades and Types of Decorations',
    'Luật về Thứ tự Cấp bậc và Loại Huân chương',
    'พระราชบัญญัติว่าด้วยลำดับชั้นและประเภทของเครื่องราชอิสริยาภรณ์',
    'Akta tentang Urutan Darjat dan Jenis Bintang Kebesaran',
  ),
  'ID-H629': P(
    '克隆孔二级行政区县首府改名法',
    'Law on the Change of the Name of the Capital of Klungkung Second-Level Regency',
    'Luật về Việc Đổi tên Thủ phủ Huyện Cấp hai Klungkung',
    'พระราชบัญญัติว่าด้วยการเปลี่ยนชื่อเมืองหลวงของอำเภอระดับสองกลุงกุง',
    'Akta tentang Perubahan Nama Ibu Pejabat Kabupaten Daerah Tingkat II Klungkung',
  ),
  'ID-H185': P(
    '国家公务员任免权法',
    'Law on the Power to Appoint and Dismiss Civil Servants',
    'Luật về Quyền Bổ nhiệm và Miễn nhiệm Công chức Nhà nước',
    'พระราชบัญญัติว่าด้วยอำนาจแต่งตั้งและถอดถอนข้าราชการพลเรือน',
    'Akta tentang Hak Melantik dan Memberhentikan Pegawai Negeri',
  ),
  'ID-H359': P(
    '东帝汶并入印度尼西亚共和国法',
    'Law on the Integration of East Timor into the Unitary State of the Republic of Indonesia',
    'Luật về Việc Sáp nhập Đông Timor vào Nhà nước Thống nhất Cộng hòa Indonesia',
    'พระราชบัญญัติว่าด้วยการรวมติมอร์ตะวันออกเข้าเป็นส่วนหนึ่งของรัฐเอกภาพสาธารณรัฐอินโดนีเซีย',
    'Akta tentang Penyatuan Timor Timur ke dalam Negara Kesatuan Republik Indonesia',
  ),
};

// ── 校验：本次范围（buckets.phrase 785..835）内的每个 id 必须被覆盖 ──
// 跳译两条：标题与正文错配（见 LEDGER 第七批判据）。
const SKIP = ['ID-H262', 'ID-H428'];
const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const inScope = new Set();
for (const u of buckets.phrase.slice(785, 835)) for (const id of u.ids) inScope.add(id);
const wanted = [...inScope].filter((id) => !SKIP.includes(id));
const have = Object.keys(items);
const missing = wanted.filter((id) => !have.includes(id));
const extra = have.filter((id) => !inScope.has(id));
console.log('范围内 id', inScope.size, '| 本批写出', have.length);
if (missing.length) console.log('未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

const LANGS = ['zh', 'en', 'vi', 'th', 'ms'];
for (const [id, v] of Object.entries(items)) {
  for (const L of LANGS) if (!v[L] || !String(v[L]).trim()) throw new Error('空值 ' + id + ' ' + L);
}

fs.writeFileSync(path.join(__dirname, '_id_b17.json'), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出 _id_b17.json');
