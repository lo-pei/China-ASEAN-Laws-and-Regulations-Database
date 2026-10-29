// b18 批次（buckets.phrase 835..893）：短语类收尾，58 个唯一标题、58 个条目，1:1。
// 口径同 b17：zh 只译主题不带文号；en/vi/th/ms 用 "Law on X" 句式。
const fs = require('fs');
const path = require('path');

const P = (zh, en, vi, th, ms) => ({ zh, en, vi, th, ms });

const items = {};

// ── 预决算类：18 条，年度由正文 Pasal 1 明确 ──
const BUDGET = [
  ['ID-H377', 1969, 1970], ['ID-H378', 1970, 1971], ['ID-H379', 1971, 1972],
  ['ID-H387', 1972, 1973], ['ID-H388', 1973, 1974], ['ID-H403', 1974, 1975],
  ['ID-H404', 1975, 1976], ['ID-H405', 1976, 1977], ['ID-H406', 1977, 1978],
  ['ID-H407', 1978, 1979], ['ID-H413', 1979, 1980], ['ID-H418', 1980, 1981],
  ['ID-H473', 1987, 1988], ['ID-H540', 1988, 1989], ['ID-H622', 1989, 1990],
  ['ID-H664', 1990, 1991], ['ID-H725', 1991, 1992], ['ID-H776', 1992, 1993],
];
for (const [id, a, b] of BUDGET) {
  const y = a + '/' + b;
  items[id] = P(
    y + '年度国家预算决算法',
    'Law on the State Budget Accounts for the ' + y + ' Fiscal Year',
    'Luật về Quyết toán Ngân sách Nhà nước năm tài chính ' + y,
    'พระราชบัญญัติว่าด้วยการปิดบัญชีงบประมาณแผ่นดินปีงบประมาณ ' + y,
    'Akta tentang Perhitungan Anggaran Negara Tahun Anggaran ' + y,
  );
}

Object.assign(items, {
  // ── 战争状态 / 紧急法令 / 升格 ──
  'ID-H138': P(
    '战争状态延长一年法',
    'Law on the One-Year Extension of the State of War',
    'Luật về Việc Kéo dài Tình trạng Chiến tranh thêm Một năm',
    'พระราชบัญญัติว่าด้วยการขยายระยะเวลาสภาวะสงครามออกไปอีกหนึ่งปี',
    'Akta tentang Lanjutan Tempoh Keadaan Perang selama Satu Tahun',
  ),
  'ID-H154': P(
    '1955年第13号紧急法令撤回法',
    'Law on the Withdrawal of Emergency Law No. 13 of 1955',
    'Luật về Việc Rút lại Luật Khẩn cấp số 13 năm 1955',
    'พระราชบัญญัติว่าด้วยการถอนกฎหมายฉุกเฉินฉบับที่ 13 ปี 1955',
    'Akta tentang Penarikan Balik Undang-Undang Darurat No. 13 Tahun 1955',
  ),
  'ID-H193': P(
    '全部紧急法令与政府代法令升格为法律法',
    'Law on the Enactment of All Emergency Laws and Government Regulations in Lieu of Law as Law',
    'Luật về Việc Ban hành Toàn bộ Luật Khẩn cấp và Quy định của Chính phủ Thay thế Luật thành Luật',
    'พระราชบัญญัติว่าด้วยการตรากฎหมายฉุกเฉินและกฎระเบียบรัฐบาลแทนกฎหมายทั้งหมดให้เป็นกฎหมาย',
    'Akta tentang Penggubalan Semua Undang-Undang Darurat dan Peraturan Pemerintah Pengganti Undang-Undang sebagai Undang-Undang',
  ),

  // ── 法院 / 地方 ──
  'ID-H141': P(
    '最高法院组织、职权与程序法',
    'Law on the Organisation, Powers and Procedure of the Supreme Court',
    'Luật về Tổ chức, Thẩm quyền và Thủ tục của Tòa án Tối cao',
    'พระราชบัญญัติว่าด้วยองค์กร อำนาจ และวิธีพิจารณาของศาลฎีกา',
    'Akta tentang Susunan, Kuasa dan Jalan Perbicaraan Mahkamah Agung',
  ),
  'ID-H236': P(
    '雅加达首都特区地位宣告法',
    'Law Declaring the Special Capital Region of Jakarta',
    'Luật Tuyên bố Đặc khu Thủ đô Jakarta',
    'พระราชบัญญัติประกาศเขตเมืองหลวงพิเศษจาการ์ตา',
    'Akta Pengisytiharan Daerah Khas Ibu Kota Jakarta',
  ),
  'ID-H499': P(
    '设立瓦坦波内行政市法',
    'Law on the Establishment of the Watampone Administrative City',
    'Luật về Việc Thành lập Thành phố Hành chính Watampone',
    'พระราชบัญญัติว่าด้วยการจัดตั้งนครบริหารวัดตัมโปเน',
    'Akta tentang Penubuhan Bandar Pentadbiran Watampone',
  ),

  // ── 个案 / 条款修改 ──
  'ID-H152': P(
    '免除苏曼特里还款义务法',
    'Law Exempting R. Soemantri from the Obligation to Repay State Funds',
    'Luật Miễn trừ Nghĩa vụ Hoàn trả Quỹ Nhà nước cho R. Soemantri',
    'พระราชบัญญัติยกเว้นหน้าที่ชดใช้เงินทุนแผ่นดินให้แก่ R. Soemantri',
    'Akta Pengecualian R. Soemantri daripada Kewajipan Membayar Balik Wang Negara',
  ),
  'ID-H166': P(
    '1953年第12号法第4条第1款修改法',
    'Law Amending Article 4 Paragraph (1) of Law No. 12 of 1953',
    'Luật Sửa đổi Khoản (1) Điều 4 Luật số 12 năm 1953',
    'พระราชบัญญัติแก้ไขเพิ่มเติมมาตรา 4 วรรค (1) แห่งกฎหมายฉบับที่ 12 ปี 1953',
    'Akta Meminda Perenggan (1) Seksyen 4 Undang-Undang No. 12 Tahun 1953',
  ),
  'ID-H235': P(
    '土地用途与面积确定法',
    'Law on the Use and Determination of Land Areas',
    'Luật về Việc Sử dụng và Xác định Diện tích Đất',
    'พระราชบัญญัติว่าด้วยการใช้ประโยชน์และการกำหนดเนื้อที่ที่ดิน',
    'Akta tentang Penggunaan dan Penetapan Luas Tanah',
  ),
  'ID-H282': P(
    '重返国际货币基金组织与世界银行成员资格法第2条修改法',
    'Law Amending Article 2 of the Law on the Resumption of Membership in the International Monetary Fund and the International Bank for Reconstruction and Development',
    'Luật Sửa đổi Điều 2 Luật về Việc Khôi phục Tư cách Thành viên tại Quỹ Tiền tệ Quốc tế và Ngân hàng Quốc tế về Tái thiết và Phát triển',
    'พระราชบัญญัติแก้ไขเพิ่มเติมมาตรา 2 แห่งกฎหมายว่าด้วยการกลับเข้าเป็นสมาชิกในกองทุนการเงินระหว่างประเทศและธนาคารระหว่างประเทศเพื่อการบูรณะและพัฒนา',
    'Akta Meminda Seksyen 2 Undang-Undang tentang Penyertaan Semula sebagai Ahli dalam Tabung Kewangan Antarabangsa dan Bank Antarabangsa bagi Pembinaan Semula dan Pembangunan',
  ),
  'ID-H283': P(
    '报业基本条例增补法',
    'Law Supplementing the Basic Provisions on the Press',
    'Luật Bổ sung các Quy định Cơ bản về Báo chí',
    'พระราชบัญญัติเพิ่มเติมบทบัญญัติพื้นฐานว่าด้วยหนังสือพิมพ์',
    'Akta Menambah Peruntukan Asas mengenai Akhbar',
  ),
  'ID-H306': P(
    '《荷属东印度会计法》第7条修改法',
    'Law Amending Article 7 of the Indische Comptabiliteitswet',
    'Luật Sửa đổi Điều 7 của Indische Comptabiliteitswet',
    'พระราชบัญญัติแก้ไขเพิ่มเติมมาตรา 7 แห่ง Indische Comptabiliteitswet',
    'Akta Meminda Seksyen 7 Indische Comptabiliteitswet',
  ),
  'ID-H323': P(
    '禁止官员参加政党法',
    'Law Prohibiting State Officials from Membership of Political Parties',
    'Luật Cấm Công chức Nhà nước Tham gia Đảng Chính trị',
    'พระราชบัญญัติห้ามข้าราชการเป็นสมาชิกพรรคการเมือง',
    'Akta Melarang Pegawai Negeri Menjadi Ahli Parti Politik',
  ),
  'ID-H332': P(
    '退休性质津贴给予法',
    'Law on the Granting of Pension-Type Allowances',
    'Luật về Việc Cấp các Khoản Phụ cấp Mang tính Hưu trí',
    'พระราชบัญญัติว่าด้วยการให้เงินเพิ่มที่มีลักษณะเป็นบำนาญ',
    'Akta tentang Pemberian Elaun yang Bersifat Pencen',
  ),
  'ID-H1830': P(
    '核损害责任限额法',
    'Law on the Limit of Liability for Nuclear Damage',
    'Luật về Giới hạn Trách nhiệm Bồi thường Thiệt hại Hạt nhân',
    'พระราชบัญญัติว่าด้วยวงเงินความรับผิดเพื่อความเสียหายทางนิวเคลียร์',
    'Akta tentang Had Tanggungjawab bagi Kerosakan Nuklear',
  ),
  'ID-H3054': P(
    '证券公司外资持股法',
    'Law on Foreign Capital Ownership in Securities Companies',
    'Luật về Việc Sở hữu Vốn Nước ngoài tại Công ty Chứng khoán',
    'พระราชบัญญัติว่าด้วยการถือหุ้นทุนต่างชาติในบริษัทหลักทรัพย์',
    'Akta tentang Pemilikan Modal Asing pada Syarikat Sekuriti',
  ),
  'ID-H3299': P(
    '财务报告法',
    'Law on Financial Reporting',
    'Luật về Báo cáo Tài chính',
    'พระราชบัญญัติว่าด้วยการรายงานทางการเงิน',
    'Akta tentang Pelaporan Kewangan',
  ),
  'ID-H641': P(
    '商标注册商品或服务分类法',
    'Law on the Classification of Goods or Services for Trademark Registration',
    'Luật về Phân loại Hàng hóa hoặc Dịch vụ cho Đăng ký Nhãn hiệu',
    'พระราชบัญญัติว่าด้วยการจำแนกประเภทสินค้าหรือบริการสำหรับการจดทะเบียนเครื่องหมายการค้า',
    'Akta tentang Kelas Barang atau Perkhidmatan bagi Pendaftaran Cap Dagangan',
  ),

  // ── 条约 / 公约批准 ──
  'ID-H1385': P(
    '印度尼西亚政府与中国香港政府移交逃犯协定批准法',
    'Law on the Ratification of the Agreement between the Government of the Republic of Indonesia and the Government of Hong Kong, China for the Surrender of Fugitive Offenders',
    'Luật về Việc Phê chuẩn Hiệp định giữa Chính phủ Cộng hòa Indonesia và Chính phủ Hồng Kông, Trung Quốc về Việc Dẫn độ Người phạm tội Bỏ trốn',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงระหว่างรัฐบาลสาธารณรัฐอินโดนีเซียกับรัฐบาลฮ่องกง จีน ว่าด้วยการส่งตัวผู้กระทำผิดที่หลบหนี',
    'Akta tentang Pengesahan Perjanjian antara Kerajaan Republik Indonesia dengan Kerajaan Hong Kong, China mengenai Penyerahan Pesalah yang Melarikan Diri',
  ),
  'ID-H1417': P(
    '批准《关于各国探索和利用包括月球和其他天体在内外层空间活动的原则条约》法',
    'Law on the Ratification of the Treaty on Principles Governing the Activities of States in the Exploration and Use of Outer Space, including the Moon and Other Celestial Bodies',
    'Luật về Việc Phê chuẩn Hiệp ước về các Nguyên tắc Điều chỉnh Hoạt động của các Quốc gia trong Việc Thăm dò và Sử dụng Không gian Vũ trụ, bao gồm Mặt Trăng và các Thiên thể Khác',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาว่าด้วยหลักการกำกับกิจกรรมของรัฐในการสำรวจและการใช้อวกาศนอกโลก รวมทั้งดวงจันทร์และเทหวัตถุอื่น',
    'Akta tentang Pengesahan Perjanjian mengenai Prinsip-prinsip yang Mentadbir Aktiviti Negara dalam Penjelajahan dan Penggunaan Angkasa Lepas, termasuk Bulan dan Jasad Cakerawala Lain',
  ),
  'ID-H1561': P(
    '印度尼西亚与中华人民共和国刑事司法协助协定批准法',
    'Law on the Ratification of the Treaty between Indonesia and the People\u2019s Republic of China on Mutual Legal Assistance in Criminal Matters',
    'Luật về Việc Phê chuẩn Hiệp ước giữa Indonesia và Cộng hòa Nhân dân Trung Hoa về Tương trợ Tư pháp trong Các vấn đề Hình sự',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างอินโดนีเซียกับสาธารณรัฐประชาชนจีนว่าด้วยความช่วยเหลือทางกฎหมายซึ่งกันและกันในเรื่องอาญา',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Republik Rakyat China mengenai Bantuan Perundangan Bersama dalam Perkara Jenayah',
  ),
  'ID-H1785': P(
    '批准国际劳工组织第185号海员身份证件公约法',
    'Law on the Ratification of ILO Convention No. 185 concerning the Revision of the Seafarers\u2019 Identity Documents Convention, 1958',
    'Luật về Việc Phê chuẩn Công ước ILO số 185 về Việc Sửa đổi Công ước Thuyền viên về Giấy tờ Tùy thân, 1958',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาไอแอลโอฉบับที่ 185 ว่าด้วยการแก้ไขอนุสัญญาว่าด้วยเอกสารประจำตัวลูกเรือ พ.ศ. 2501',
    'Akta tentang Pengesahan Konvensyen ILO No. 185 mengenai Pengubahan Konvensyen Dokumen Pengenalan Diri Pelaut, 1958',
  ),
  'ID-H1877': P(
    '批准《联合国打击跨国有组织犯罪公约关于预防、禁止和惩治贩运人口特别是妇女和儿童行为的补充议定书》法',
    'Law on the Ratification of the Protocol to Prevent, Suppress and Punish Trafficking in Persons, Especially Women and Children, supplementing the United Nations Convention against Transnational Organized Crime',
    'Luật về Việc Phê chuẩn Nghị định thư về Việc Ngăn ngừa, Trấn áp và Trừng trị Việc Buôn người, Đặc biệt là Phụ nữ và Trẻ em, Bổ sung cho Công ước Liên Hợp Quốc về Chống Tội phạm Có Tổ chức Xuyên quốc gia',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันพิธีสารเพื่อป้องกัน ปราบปราม และลงโทษการค้ามนุษย์ โดยเฉพาะสตรีและเด็ก ซึ่งเพิ่มเติมอนุสัญญาสหประชาชาติว่าด้วยการต่อต้านอาชญากรรมข้ามชาติที่มีการจัดองค์กร',
    'Akta tentang Pengesahan Protokol bagi Mencegah, Membanteras dan Menghukum Pemerdagangan Orang, Terutama Wanita dan Kanak-kanak, yang Menambah Konvensyen Pertubuhan Bangsa-Bangsa Bersatu menentang Jenayah Terancang Transnasional',
  ),
  'ID-H198': P(
    '万国邮政公约及渥太华各项协定批准法',
    'Law on the Ratification of the Universal Postal Convention and the Ottawa Agreements',
    'Luật về Việc Phê chuẩn Công ước Bưu chính Thế giới và các Hiệp định Ottawa',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาไปรษณีย์สากลและความตกลงออตตาวา',
    'Akta tentang Pengesahan Konvensyen Pos Sedunia dan Persetujuan-persetujuan Ottawa',
  ),
  'ID-H313': P(
    '国际电信联盟公约批准法',
    'Law on the Ratification of the International Telecommunication Union Convention',
    'Luật về Việc Phê chuẩn Công ước Liên minh Viễn thông Quốc tế',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหภาพโทรคมนาคมระหว่างประเทศ',
    'Akta tentang Pengesahan Konvensyen Kesatuan Telekomunikasi Antarabangsa',
  ),
  'ID-H350': P(
    '印度尼西亚与马来西亚引渡协定批准法',
    'Law on the Ratification of the Extradition Agreement between Indonesia and Malaysia',
    'Luật về Việc Phê chuẩn Hiệp định Dẫn độ giữa Indonesia và Malaysia',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงส่งตัวผู้กระทำผิดระหว่างอินโดนีเซียกับมาเลเซีย',
    'Akta tentang Pengesahan Perjanjian Ekstradisi antara Indonesia dan Malaysia',
  ),
  'ID-H357': P(
    '批准1963年东京公约、1970年海牙公约与1971年蒙特利尔公约法',
    'Law on the Ratification of the Tokyo Convention 1963, the Hague Convention 1970 and the Montreal Convention 1971',
    'Luật về Việc Phê chuẩn Công ước Tokyo 1963, Công ước La Hay 1970 và Công ước Montreal 1971',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาโตเกียว ค.ศ. 1963 อนุสัญญากรุงเฮก ค.ศ. 1970 และอนุสัญญามอนทรีออล ค.ศ. 1971',
    'Akta tentang Pengesahan Konvensyen Tokyo 1963, Konvensyen Hague 1970 dan Konvensyen Montreal 1971',
  ),
  'ID-H358': P(
    '批准1961年麻醉品单一公约及修正议定书法',
    'Law on the Ratification of the Single Convention on Narcotic Drugs, 1961 and the Protocol Amending It',
    'Luật về Việc Phê chuẩn Công ước Duy nhất về Thuốc gây nghiện, 1961 và Nghị định thư Sửa đổi Công ước này',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาเดียวว่าด้วยยาเสพติด พ.ศ. 2504 และพิธีสารแก้ไขอนุสัญญาดังกล่าว',
    'Akta tentang Pengesahan Konvensyen Tunggal mengenai Dadah Narkotik, 1961 dan Protokol yang Memindanya',
  ),
  'ID-H360': P(
    '印度尼西亚与菲律宾引渡协定及议定书批准法',
    'Law on the Ratification of the Extradition Agreement and Protocol between Indonesia and the Philippines',
    'Luật về Việc Phê chuẩn Hiệp định và Nghị định thư Dẫn độ giữa Indonesia và Philippines',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันความตกลงและพิธีสารส่งตัวผู้กระทำผิดระหว่างอินโดนีเซียกับฟิลิปปินส์',
    'Akta tentang Pengesahan Perjanjian dan Protokol Ekstradisi antara Indonesia dan Filipina',
  ),
  'ID-H361': P(
    '批准《东南亚友好合作条约》法',
    'Law on the Ratification of the Treaty of Amity and Cooperation in Southeast Asia',
    'Luật về Việc Phê chuẩn Hiệp ước Hữu nghị và Hợp tác ở Đông Nam Á',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญามิตรภาพและความร่วมมือในเอเชียตะวันออกเฉียงใต้',
    'Akta tentang Pengesahan Perjanjian Persahabatan dan Kerjasama di Asia Tenggara',
  ),
  'ID-H386': P(
    '批准《取缔伪造货币国际公约》及议定书法',
    'Law on the Ratification of the International Convention for the Suppression of Counterfeiting Currency and the Protocol thereto',
    'Luật về Việc Phê chuẩn Công ước Quốc tế về Trấn áp Việc Làm Tiền Giả và Nghị định thư kèm theo',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาระหว่างประเทศว่าด้วยการปราบปรามการปลอมแปลงเงินตราและพิธีสารท้ายอนุสัญญา',
    'Akta tentang Pengesahan Konvensyen Antarabangsa bagi Membanteras Pemalsuan Mata Wang dan Protokolnya',
  ),
  'ID-H401': P(
    '批准《特别使团公约》法',
    'Law on the Ratification of the Convention on Special Missions',
    'Luật về Việc Phê chuẩn Công ước về Phái đoàn Đặc biệt',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาว่าด้วยคณะผู้แทนพิเศษ',
    'Akta tentang Pengesahan Konvensyen mengenai Misi Khas',
  ),
  'ID-H402': P(
    '批准《维也纳外交关系公约》与《维也纳领事关系公约》及其任择议定书法',
    'Law on the Ratification of the Vienna Convention on Diplomatic Relations and the Vienna Convention on Consular Relations together with their Optional Protocols',
    'Luật về Việc Phê chuẩn Công ước Viên về Quan hệ Ngoại giao và Công ước Viên về Quan hệ Lãnh sự cùng các Nghị định thư Tùy chọn',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญากรุงเวียนนาว่าด้วยความสัมพันธ์ทางการทูตและอนุสัญญากรุงเวียนนาว่าด้วยความสัมพันธ์ทางกงสุลพร้อมพิธีสารเลือกรับ',
    'Akta tentang Pengesahan Konvensyen Vienna mengenai Hubungan Diplomatik dan Konvensyen Vienna mengenai Hubungan Konsular berserta Protokol Pilihan',
  ),
  'ID-H440': P(
    '印度尼西亚与巴布亚新几内亚相互尊重、友好与合作条约批准法',
    'Law on the Ratification of the Treaty of Mutual Respect, Friendship and Cooperation between Indonesia and Papua New Guinea',
    'Luật về Việc Phê chuẩn Hiệp ước Tôn trọng, Hữu nghị và Hợp tác giữa Indonesia và Papua New Guinea',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาการเคารพซึ่งกันและกัน มิตรภาพ และความร่วมมือระหว่างอินโดนีเซียกับปาปัวนิวกินี',
    'Akta tentang Pengesahan Perjanjian Saling Menghormati, Persahabatan dan Kerjasama antara Indonesia dan Papua New Guinea',
  ),
  'ID-H448': P(
    '批准《东南亚友好合作条约》修正议定书法',
    'Law on the Ratification of the Protocol Amending the Treaty of Amity and Cooperation in Southeast Asia',
    'Luật về Việc Phê chuẩn Nghị định thư Sửa đổi Hiệp ước Hữu nghị và Hợp tác ở Đông Nam Á',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันพิธีสารแก้ไขสนธิสัญญามิตรภาพและความร่วมมือในเอเชียตะวันออกเฉียงใต้',
    'Akta tentang Pengesahan Protokol yang Meminda Perjanjian Persahabatan dan Kerjasama di Asia Tenggara',
  ),
  'ID-H533': P(
    '印度尼西亚与澳大利亚东帝汶省与北澳大利亚之间合作区条约批准法',
    'Law on the Ratification of the Treaty between Indonesia and Australia on the Zone of Cooperation in an Area between the Indonesian Province of East Timor and Northern Australia',
    'Luật về Việc Phê chuẩn Hiệp ước giữa Indonesia và Australia về Khu Hợp tác tại Vùng giữa Tỉnh Đông Timor của Indonesia và Bắc Australia',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาระหว่างอินโดนีเซียกับออสเตรเลียว่าด้วยเขตความร่วมมือในพื้นที่ระหว่างจังหวัดติมอร์ตะวันออกของอินโดนีเซียกับออสเตรเลียตอนเหนือ',
    'Akta tentang Pengesahan Perjanjian antara Indonesia dan Australia mengenai Zon Kerjasama di Kawasan antara Wilayah Timor Timur Indonesia dan Australia Utara',
  ),
  'ID-H712': P(
    '批准《联合国生物多样性公约》法',
    'Law on the Ratification of the United Nations Convention on Biological Diversity',
    'Luật về Việc Phê chuẩn Công ước Liên Hợp Quốc về Đa dạng Sinh học',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยความหลากหลายทางชีวภาพ',
    'Akta tentang Pengesahan Konvensyen Pertubuhan Bangsa-Bangsa Bersatu mengenai Kepelbagaian Biologi',
  ),
  'ID-H714': P(
    '批准《联合国气候变化框架公约》法',
    'Law on the Ratification of the United Nations Framework Convention on Climate Change',
    'Luật về Việc Phê chuẩn Công ước Khung của Liên Hợp Quốc về Biến đổi Khí hậu',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาสหประชาชาติว่าด้วยการเปลี่ยนแปลงสภาพภูมิอากาศ',
    'Akta tentang Pengesahan Konvensyen Rangka Kerja Pertubuhan Bangsa-Bangsa Bersatu mengenai Perubahan Iklim',
  ),
  'ID-H909': P(
    '批准《东南亚无核武器区条约》法',
    'Law on the Ratification of the Treaty on the Southeast Asia Nuclear Weapon-Free Zone',
    'Luật về Việc Phê chuẩn Hiệp ước về Khu vực Đông Nam Á Không Vũ khí Hạt nhân',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันสนธิสัญญาว่าด้วยเขตปลอดอาวุธนิวเคลียร์ในเอเชียตะวันออกเฉียงใต้',
    'Akta tentang Pengesahan Perjanjian mengenai Zon Bebas Senjata Nuklear Asia Tenggara',
  ),
  'ID-H978': P(
    '批准《关于禁止发展、生产、储存和使用化学武器及销毁此种武器的公约》法',
    'Law on the Ratification of the Convention on the Prohibition of the Development, Production, Stockpiling and Use of Chemical Weapons and on their Destruction',
    'Luật về Việc Phê chuẩn Công ước về Cấm Phát triển, Sản xuất, Tàng trữ và Sử dụng Vũ khí Hóa học và về Việc Tiêu hủy Chúng',
    'พระราชบัญญัติว่าด้วยการให้สัตยาบันอนุสัญญาว่าด้วยการห้ามการพัฒนา การผลิต การสะสม และการใช้สรรพาวุธเคมี และว่าด้วยการทำลายสรรพาวุธดังกล่าว',
    'Akta tentang Pengesahan Konvensyen mengenai Larangan Pembangunan, Pengeluaran, Penyimpanan dan Penggunaan Senjata Kimia serta mengenai Pemusnahannya',
  ),
});

// ── 校验：buckets.phrase 835..end 全部覆盖、无越界 ──
const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const inScope = new Set();
for (const u of buckets.phrase.slice(835)) for (const id of u.ids) inScope.add(id);
const have = Object.keys(items);
const missing = [...inScope].filter((id) => !have.includes(id));
const extra = have.filter((id) => !inScope.has(id));
console.log('范围内 id', inScope.size, '| 本批写出', have.length);
if (missing.length) console.log('未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

for (const [id, v] of Object.entries(items)) {
  for (const L of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!v[L] || !String(v[L]).trim()) throw new Error('空值 ' + id + ' ' + L);
  }
}

fs.writeFileSync(path.join(__dirname, '_id_b18.json'), JSON.stringify({ items }, null, 1), 'utf8');
console.log('写出 _id_b18.json');
