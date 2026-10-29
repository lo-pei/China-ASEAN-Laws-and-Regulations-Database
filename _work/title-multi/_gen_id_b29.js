// b29：ID 长标题族「PERUBAHAN KEDUA ATAS …」（第二次修改）40 条全收官。
// 与 b24–b26（PERUBAHAN ATAS）同源，仅多一层序数「第二次」，故沿用同一套四语句框，
// 只在助词处加「for the Second Time / lần thứ hai / ครั้งที่สอง / bagi Kali Kedua」。
// 主题译法优先复用已入库的原条例译名（ID-H2586/H1801/H2641/H2282/H1284 等），保证跨条目一致。
const fs = require('fs');
const path = require('path');

const FRAME = {
  PP: (no, yr, z) => ({
    zh: '第二次修改' + yr + '年第' + no + '号' + z[0] + '政府条例法',
    en: 'Law Amending for the Second Time Government Regulation No. ' + no + ' of ' + yr + ' on ' + z[1],
    vi: 'Luật Sửa đổi lần thứ hai Quy định của Chính phủ số ' + no + ' năm ' + yr + ' về ' + z[2],
    th: 'พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สองกฎระเบียบรัฐบาลฉบับที่ ' + no + ' ปี ' + yr + ' ว่าด้วย' + z[3],
    ms: 'Akta Meminda bagi Kali Kedua Peraturan Pemerintah No. ' + no + ' Tahun ' + yr + ' tentang ' + z[4],
  }),
  UU: (no, yr, z) => ({
    zh: '第二次修改' + yr + '年第' + no + '号' + z[0] + '法',
    en: 'Law Amending for the Second Time Law No. ' + no + ' of ' + yr + ' on ' + z[1],
    vi: 'Luật Sửa đổi lần thứ hai Luật số ' + no + ' năm ' + yr + ' về ' + z[2],
    th: 'พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สองกฎหมายฉบับที่ ' + no + ' ปี ' + yr + ' ว่าด้วย' + z[3],
    ms: 'Akta Meminda bagi Kali Kedua Undang-Undang No. ' + no + ' Tahun ' + yr + ' tentang ' + z[4],
  }),
  PM: (no, yr, z) => ({
    zh: '第二次修改商务部' + yr + '年第' + no + '号' + z[0] + '条例法',
    en: 'Law Amending for the Second Time Minister of Trade Regulation No. ' + no + ' of ' + yr + ' on ' + z[1],
    vi: 'Luật Sửa đổi lần thứ hai Quy định của Bộ trưởng Bộ Thương mại số ' + no + ' năm ' + yr + ' về ' + z[2],
    th: 'พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สองกฎระเบียบรัฐมนตรีว่าการกระทรวงการค้าฉบับที่ ' + no + ' ปี ' + yr + ' ว่าด้วย' + z[3],
    ms: 'Akta Meminda bagi Kali Kedua Peraturan Menteri Perdagangan No. ' + no + ' Tahun ' + yr + ' tentang ' + z[4],
  }),
  // M-DAGPER / M-DAG 编码串无法拆号年，只写主题
  PMC: (no, yr, z) => ({
    zh: '第二次修改商务部' + z[0] + '条例法',
    en: 'Law Amending for the Second Time the Minister of Trade Regulation on ' + z[1],
    vi: 'Luật Sửa đổi lần thứ hai Quy định của Bộ trưởng Bộ Thương mại về ' + z[2],
    th: 'พระราชบัญญัติแก้ไขเพิ่มเติมครั้งที่สองกฎระเบียบรัฐมนตรีว่าการกระทรวงการค้าว่าด้วย' + z[3],
    ms: 'Akta Meminda bagi Kali Kedua Peraturan Menteri Perdagangan tentang ' + z[4],
  }),
};

// [id, kind, no, yr, [zh, en, vi, th, ms]]
const ROWS = [
  ['ID-H3385', 'PP', 99, 2013, [
    '就业社会保障资产管理',
    'the Management of Employment Social Security Assets',
    'Quản lý Tài sản Bảo hiểm Xã hội Việc làm',
    'การบริหารสินทรัพย์ประกันสังคมการจ้างงาน',
    'Pengurusan Aset Jaminan Sosial Pekerjaan']],
  ['ID-H3325', 'PP', 36, 2021, [
    '工资',
    'Wages',
    'Tiền lương',
    'ค่าจ้าง',
    'Pengupahan']],
  ['ID-H3014', 'UU', 21, 2001, [
    '巴布亚省特别自治',
    'Special Autonomy for the Province of Papua',
    'Quyền Tự trị Đặc biệt cho Tỉnh Papua',
    'การปกครองตนเองพิเศษของจังหวัดปาปัว',
    'Autonomi Khas bagi Wilayah Papua']],
  ['ID-H3265', 'PM', 36, 2023, [
    '进口政策与规范',
    'Import Policy and Regulation',
    'Chính sách và Quy định Nhập khẩu',
    'นโยบายและข้อกำหนดการนำเข้า',
    'Dasar dan Peraturan Import']],
  ['ID-H2726', 'PP', 87, 2013, [
    '卫生社会保障资产管理',
    'the Management of Health Social Security Assets',
    'Quản lý Tài sản Bảo hiểm Xã hội Y tế',
    'การบริหารสินทรัพย์ประกันสังคมสุขภาพ',
    'Pengurusan Aset Jaminan Sosial Kesihatan']],
  ['ID-H3382', 'PP', 36, 2023, [
    '自然资源开发、管理和/或加工活动出口所得外汇',
    'Export Proceeds from Activities of Exploitation, Management and/or Processing of Natural Resources',
    'Ngoại hối từ Xuất khẩu trong Hoạt động Khai thác, Quản lý và/hoặc Chế biến Tài nguyên Thiên nhiên',
    'เงินตราต่างประเทศจากผลการส่งออกจากกิจกรรมการใช้ประโยชน์ การบริหาร และ/หรือการแปรรูปทรัพยากรธรรมชาติ',
    'Hasil Eksport Devisa daripada Kegiatan Pengusahaan, Pengurusan dan/atau Pemprosesan Sumber Alam']],
  ['ID-H2745', 'PMC', null, null, [
    '资本货物进口',
    'the Import of Capital Goods',
    'Nhập khẩu Hàng hóa Tư bản',
    'การนำเข้าสินค้าทุน',
    'Import Barang Modal']],
  ['ID-H2746', 'PMC', null, null, [
    '使用海运与国家保险',
    'the Use of Sea Transport and National Insurance',
    'Sử dụng Vận tải Biển và Bảo hiểm Quốc gia',
    'การใช้การขนส่งทางทะเลและการประกันภัยแห่งชาติ',
    'Penggunaan Pengangkutan Laut dan Insurans Nasional']],
  ['ID-H3163', 'PP', 44, 2015, [
    '工伤事故保险与死亡保险计划实施',
    'the Implementation of the Work Accident Insurance and Death Insurance Programme',
    'Thực hiện Chương trình Bảo hiểm Tai nạn Lao động và Bảo hiểm Tử vong',
    'การดำเนินโครงการประกันอุบัติเหตุจากการทำงานและการประกันเสียชีวิต',
    'Pelaksanaan Program Jaminan Kecelakaan Kerja dan Jaminan Kematian']],
  ['ID-H1897', 'UU', 2, 1986, [
    '普通法院',
    'General Courts',
    'Tòa án Thường',
    'ศาลทั่วไป',
    'Mahkamah Umum']],
  ['ID-H1898', 'UU', 7, 1989, [
    '宗教法院',
    'Religious Courts',
    'Tòa án Tôn giáo',
    'ศาลศาสนา',
    'Mahkamah Agama']],
  ['ID-H2589', 'PP', 60, 2014, [
    '源自国家收支预算的乡村资金',
    'Village Funds Sourced from the State Budget',
    'Quỹ Làng từ Ngân sách Nhà nước',
    'กองทุนหมู่บ้านจากงบประมาณรายได้และรายจ่ายของรัฐ',
    'Dana Desa daripada Anggaran Pendapatan dan Belanja Negara']],
  ['ID-H2647', 'PP', 14, 2015, [
    '国家/地方债权核销程序',
    'the Procedure for Writing Off State/Regional Receivables',
    'Thủ tục Xóa nợ Phải thu của Nhà nước/Địa phương',
    'วิธีการตัดจำหน่ายหนี้ค้างชำระของรัฐ/ท้องถิ่น',
    'Tata Cara Penghapusan Piutang Negara/Daerah']],
  ['ID-H2648', 'PP', 8, 2005, [
    '三方合作机构的工作程序与组织结构',
    'the Working Procedure and Organisational Structure of the Tripartite Cooperation Institution',
    'Quy trình Làm việc và Cơ cấu Tổ chức của Cơ quan Hợp tác Ba bên',
    'วิธีปฏิบัติงานและโครงสร้างองค์กรของสถาบันความร่วมมือไตรภาคี',
    'Tata Kerja dan Susunan Organisasi Lembaga Kerja Sama Tripartit']],
  ['ID-H1579', 'PP', 24, 2004, [
    '地方人民代表理事会领导与成员的礼仪地位与财务地位',
    'the Protocolary and Financial Position of the Leadership and Members of the Regional People\u2019s Representative Council',
    'Địa vị Lễ tân và Tài chính của Lãnh đạo và Thành viên Hội đồng Đại diện Nhân dân Địa phương',
    'ฐานะพิธีการและการเงินของผู้นำและสมาชิกสภาผู้แทนราษฎรระดับท้องถิ่น',
    'Kedudukan Protokoler dan Kewangan Pimpinan dan Anggota Dewan Perwakilan Rakyat Daerah']],
  ['ID-H1805', 'PP', 73, 1992, [
    '保险业务经营',
    'the Operation of Insurance Business',
    'Kinh doanh Bảo hiểm',
    'การประกอบธุรกิจประกันภัย',
    'Penyelenggaraan Usaha Perasuransian']],
  ['ID-H2197', 'PP', 48, 2005, [
    '聘任荣誉人员为公务员候选人',
    'the Appointment of Honorary Staff as Candidate Civil Servants',
    'Bổ nhiệm Nhân viên Hợp đồng làm Ứng viên Công chức',
    'การแต่งตั้งเจ้าหน้าที่กิติมศักดิ์เป็นผู้สมัครข้าราชการ',
    'Pelantikan Tenaga Honoror sebagai Calon Pegawai Negeri Sipil']],
  ['ID-H3093', 'PP', 51, 2008, [
    '建筑服务业所得所得税',
    'Income Tax on Income from the Construction Services Business',
    'Thuế Thu nhập đối với Thu nhập từ Kinh doanh Dịch vụ Xây dựng',
    'ภาษีเงินได้จากรายได้จากธุรกิจบริการก่อสร้าง',
    'Cukai Pendapatan atas Pendapatan daripada Usaha Perkhidmatan Pembinaan']],
  ['ID-H3247', 'UU', 11, 2008, [
    '电子信息和交易',
    'Electronic Information and Transactions',
    'Thông tin và Giao dịch Điện tử',
    'ข้อมูลข่าวสารและการทำธุรกรรมทางอิเล็กทรอนิกส์',
    'Maklumat dan Transaksi Elektronik']],
  ['ID-H3326', 'PP', 4, 2016, [
    '特定情形下自某国或某国境内区域输入的牲畜和/或动物产品',
    'the Entry of Livestock and/or Animal Products in Certain Cases Originating from a Country or a Zone within a Country of Entry',
    'Việc Nhập khẩu Vật nuôi và/hoặc Sản phẩm Động vật trong Trường hợp Nhất định từ Một nước hoặc Vùng trong Một nước Nhập khẩu',
    'การนำเข้าปศุสัตว์และ/หรือผลิตภัณฑ์สัตว์ในบางกรณีจากประเทศหรือเขตในประเทศต้นทาง',
    'Kemasukan Ternakan dan/atau Produk Haiwan dalam Hal Tertentu daripada Negara atau Zon dalam Sesuatu Negara Asal Kemasukan']],
  ['ID-H3401', 'PM', 18, 2025, [
    '进口政策与规范',
    'Import Policy and Regulation',
    'Chính sách và Quy định Nhập khẩu',
    'นโยบายและข้อกำหนดการนำเข้า',
    'Dasar dan Peraturan Import']],
  ['ID-H1896', 'PP', 35, 2009, [
    '为设立基础设施担保领域公营有限公司投入印度尼西亚共和国国家资本参与',
    'the State Capital Participation of the Republic of Indonesia for the Establishment of a Limited Liability State Company in the Field of Infrastructure Guarantee',
    'Vốn Góp Nhà nước của Cộng hòa Indonesia để Thành lập Công ty Trách nhiệm Hữu hạn Nhà nước trong Lĩnh vực Bảo lãnh Cơ sở Hạ tầng',
    'การร่วมทุนของรัฐแห่งสาธารณรัฐอินโดนีเซียเพื่อจัดตั้งรัฐวิสาหกิจในด้านการค้ำประกันโครงสร้างพื้นฐาน',
    'Penyertaan Modal Negara Republik Indonesia untuk Pendirian Perusahaan Perseroan dalam Bidang Penjaminan Infrastruktur']],
  ['ID-H2099', 'PP', 1, 2007, [
    '特定商业领域和/或特定地区投资的所得税优惠',
    'Income Tax Facilities for Investment in Certain Business Fields and/or in Certain Regions',
    'Ưu đãi Thuế Thu nhập cho Đầu tư vào Một số Lĩnh vực Kinh doanh và/hoặc tại Một số Vùng nhất định',
    'สิทธิประโยชน์ทางภาษีเงินได้สำหรับการลงทุนในบางสาขาธุรกิจและ/หรือในบางพื้นที่',
    'Kemudahan Cukai Pendapatan untuk Pelaburan dalam Bidang-bidang Usaha Tertentu dan/atau di Daerah-daerah Tertentu']],
  ['ID-H2121', 'PMC', null, null, [
    '进口商识别码',
    'the Importer Identification Number',
    'Mã số Nhận diện Nhà nhập khẩu',
    'หมายเลขประจำตัวผู้นำเข้า',
    'Angka Pengenal Importir']],
  ['ID-H2725', 'PP', 5, 2009, [
    '对政党的财政援助',
    'Financial Assistance to Political Parties',
    'Hỗ trợ Tài chính cho Các Đảng Chính trị',
    'ความช่วยเหลือทางการเงินแก่พรรคการเมือง',
    'Bantuan Kewangan kepada Parti Politik']],
  ['ID-H3400', 'PMC', null, null, [
    '印度尼西亚贸易与经济办事处（KDEI）的组织与工作规程',
    'the Organisation and Working Procedure of the Indonesian Trade and Economic Office (KDEI)',
    'Tổ chức và Quy trình Làm việc của Văn phòng Thương mại và Kinh tế Indonesia (KDEI)',
    'โครงสร้างองค์กรและวิธีปฏิบัติงานของสำนักงานการค้าและเศรษฐกิจอินโดนีเซีย (KDEI)',
    'Organisasi dan Tata Kerja Kantor Dagang dan Ekonomi Indonesia (KDEI)']],
  ['ID-H3402', 'PMC', null, null, [
    '香蕉与菠萝出口',
    'the Export of Bananas and Pineapples',
    'Xuất khẩu Chuối và Dứa',
    'การส่งออกกล้วยและสับปะรด',
    'Eksport Pisang dan Nanas']],
  ['ID-H1578', 'PP', 10, 1989, [
    '电力供应与利用',
    'the Supply and Utilisation of Electric Power',
    'Cung cấp và Sử dụng Điện lực',
    'การจัดหาและการใช้พลังงานไฟฟ้า',
    'Penyediaan dan Pemanfaatan Tenaga Listrik']],
  ['ID-H1580', 'PP', 34, 1985, [
    '向退伍军人发放退伍军人津贴',
    'the Granting of Veterans\u2019 Allowances to Veterans',
    'Cấp Phụ cấp Cựu chiến binh cho Cựu chiến binh',
    'การให้เงินเพิ่มแก่ทหารผ่านศึก',
    'Pemberian Elaun Veteran kepada Veteran']],
  ['ID-H2120', 'PMC', null, null, [
    '基准价格的确定程序',
    'the Procedure for Setting Benchmark Prices',
    'Thủ tục Xác định Giá Chuẩn',
    'วิธีการกำหนดราคาอ้างอิง',
    'Tata Cara Penetapan Harga Patokan']],
  ['ID-H2290', 'PP', 98, 1999, [
    '财政部长作为公营有限公司与部分国有的有限公司股东大会或股东之地位、职责与职权向国家投资协调与国营企业辅导部长的移交',
    'the Transfer to the State Minister for Investment Coordination and State-Owned Enterprise Development of the Position, Duties and Authority of the Minister of Finance as General Meeting of Shareholders or Shareholder in State-Owned Limited Companies and Partially State-Owned Limited Liability Companies',
    'Chuyển giao cho Bộ trưởng Nhà nước phụ trách Điều phối Đầu tư và Phát triển Doanh nghiệp Nhà nước Vị trí, Nhiệm vụ và Thẩm quyền của Bộ trưởng Tài chính với tư cách Đại hội đồng Cổ đông hoặc Cổ đông tại Công ty Trách nhiệm Hữu hạn Nhà nước và Công ty có Vốn Nhà nước một phần',
    'การโอนฐานะ หน้าที่ และอำนาจของรัฐมนตรีว่าการกระทรวงการคลังในฐานะที่ประชุมผู้ถือหุ้นหรือผู้ถือหุ้นในรัฐวิสาหกิจและบริษัทจำกัดที่มีทุนของรัฐบางส่วน ให้แก่รัฐมนตรีประจำกระทรวงประสานการลงทุนและการกำกับดูแลรัฐวิสาหกิจ',
    'Pemindahan Kedudukan, Tugas dan Wewenang Menteri Kewangan selaku Rapat Umum Pemegang Saham atau Pemegang Saham pada Perusahaan Perseroan dan Perseroan Terbatas yang Sebahagian Sahamnya Milik Negara kepada Menteri Negara Penanaman Modal dan Pembinaan Badan Usaha Milik Negara']],
  ['ID-H2588', 'PP', 55, 2014, [
    '最高法院法官与宪法法院法官的财务权利与便利',
    'the Financial Rights and Facilities of Judges of the Supreme Court and Judges of the Constitutional Court',
    'Quyền Tài chính và Tiện nghi của Thẩm phán Tòa án Tối cao và Thẩm phán Tòa án Hiến pháp',
    'สิทธิทางการเงินและสิ่งอำนวยความสะดวกของผู้พิพากษาศาลฎีกาและผู้พิพากษาศาลรัฐธรรมนูญ',
    'Hak Kewangan dan Kemudahan Hakim Mahkamah Agung dan Hakim Mahkamah Perlembagaan']],
  ['ID-H2724', 'PP', 19, 2016, [
    '向公务员、国民军军人、警察、国家官员及养老金或津贴领取人发放工资、养老金或第十三薪',
    'the Granting of Salary, Pension or the Thirteenth Allowance to Civil Servants, Soldiers of the Indonesian National Armed Forces, Members of the Indonesian National Police, State Officials and Pension or Allowance Recipients',
    'Cấp Lương, Lương hưu hoặc Phụ cấp tháng thứ mười ba cho Công chức, Quân nhân, Cảnh sát, Quan chức Nhà nước và Người hưởng Lương hưu hoặc Phụ cấp',
    'การให้เงินเดือน บำนาญ หรือเงินเพิ่มเดือนที่สิบสามแก่ข้าราชการ กำลังพลกองทัพ เจ้าหน้าที่ตำรวจ ข้าราชการการเมือง และผู้รับบำนาญหรือเงินเพิ่ม',
    'Pemberian Gaji, Pencen atau Elaun Ketiga Belas kepada Pegawai Negeri Sipil, Anggota Tentera Nasional Indonesia, Anggota Polis Negara, Pegawai Negara dan Penerima Pencen atau Elaun']],
  ['ID-H2817', 'PP', 16, 2009, [
    '债券利息所得税',
    'Income Tax on Income in the Form of Bond Interest',
    'Thuế Thu nhập đối với Thu nhập dưới dạng Lãi Trái phiếu',
    'ภาษีเงินได้จากรายได้ในรูปดอกเบี้ยพันธบัตร',
    'Cukai Pendapatan atas Pendapatan berupa Faedah Bon']],
  ['ID-H2911', 'PP', 66, 2007, [
    '为设立基础设施融资领域公营有限公司投入印度尼西亚共和国国家资本参与',
    'the State Capital Participation of the Republic of Indonesia for the Establishment of a Limited Liability State Company in the Field of Infrastructure Financing',
    'Vốn Góp Nhà nước của Cộng hòa Indonesia để Thành lập Công ty Trách nhiệm Hữu hạn Nhà nước trong Lĩnh vực Tài trợ Cơ sở Hạ tầng',
    'การร่วมทุนของรัฐแห่งสาธารณรัฐอินโดนีเซียเพื่อจัดตั้งรัฐวิสาหกิจในด้านการเงินโครงสร้างพื้นฐาน',
    'Penyertaan Modal Negara Republik Indonesia untuk Pendirian Perusahaan Perseroan dalam Bidang Pembiayaan Infrastruktur']],
  ['ID-H3094', 'PP', 94, 2012, [
    '最高法院下属法官的财务权利与便利',
    'the Financial Rights and Facilities of Judges under the Supreme Court',
    'Quyền Tài chính và Tiện nghi của Thẩm phán thuộc Tòa án Tối cao',
    'สิทธิทางการเงินและสิ่งอำนวยความสะดวกของผู้พิพากษาในศาลฎีกา',
    'Hak Kewangan dan Kemudahan Hakim di Bawah Mahkamah Agung']],
  ['ID-H3264', 'PM', 22, 2023, [
    '禁止出口的货物',
    'Goods Prohibited from Being Exported',
    'Hàng hóa Bị Cấm Xuất khẩu',
    'สินค้าที่ห้ามส่งออก',
    'Barang yang Dilarang untuk Dieksport']],
  ['ID-H3383', 'PP', 38, 2002, [
    '印度尼西亚群岛基线点地理坐标表',
    'the List of Geographical Coordinates of the Baseline Points of the Indonesian Archipelago',
    'Danh mục Tọa độ Địa lý các Điểm Đường cơ sở Quần đảo Indonesia',
    'รายการพิกัดภูมิศาสตร์ของจุดเส้นฐานหมู่เกาะอินโดนีเซีย',
    'Senarai Koordinat Geografi Titik-titik Garis Pangkal Kepulauan Indonesia']],
  ['ID-H3384', 'PP', 5, 1996, [
    '特命全权大使与前任特命全权大使及其遗孀或鳏夫的财务与行政权利',
    'the Financial and Administrative Rights of Ambassadors Extraordinary and Plenipotentiary, Former Ambassadors Extraordinary and Plenipotentiary and Their Widows or Widowers',
    'Quyền Tài chính và Hành chính của Đại sứ Đặc mệnh Toàn quyền, Cựu Đại sứ Đặc mệnh Toàn quyền và Người vợ hoặc Người chồng góa của họ',
    'สิทธิทางการเงินและการบริหารของเอกอัครราชทูตวิสามัญผู้มีอำนาจเต็ม อดีตเอกอัครราชทูตวิสามัญผู้มีอำนาจเต็ม และม่ายของบุคคลดังกล่าว',
    'Hak Kewangan dan Pentadbiran Duta Besar Luar Biasa dan Berkuasa Penuh, Bekas Duta Besar Luar Biasa dan Berkuasa Penuh serta Balu atau Duda Mereka']],
  ['ID-H3403', 'PM', 32, 2019, [
    '国家官员财产报告',
    'the Wealth Report of State Officials',
    'Báo cáo Tài sản của Quan chức Nhà nước',
    'รายงานทรัพย์สินของเจ้าหน้าที่รัฐ',
    'Laporan Harta Kekayaan Penyelenggara Negara']],
];

const items = {};
for (const [id, kind, no, yr, z] of ROWS) {
  if (items[id]) throw new Error('重复 id ' + id);
  items[id] = FRAME[kind](no, yr, z);
}

const buckets = JSON.parse(fs.readFileSync(path.join(__dirname, '_id_buckets.json'), 'utf8'));
const RE = /^PERUBAHAN KEDUA ATAS/i;
const lawdir = path.join(__dirname, '..', '..', 'prototype', 'data', 'laws');
const scope = new Set();
for (const u of buckets.long.filter((u) => RE.test(u.s))) {
  for (const id of u.ids) {
    const d = JSON.parse(fs.readFileSync(path.join(lawdir, id + '.json'), 'utf8'));
    if (['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim())) scope.add(id);
  }
}
const missing = [...scope].filter((id) => !items[id]);
const extra = Object.keys(items).filter((id) => !scope.has(id));
console.log('族内待译', scope.size, '| 写出', Object.keys(items).length);
if (missing.length) console.log('✗ 未覆盖', missing.length, missing.join(','));
if (extra.length) console.log('✗ 越界', extra.length, extra.join(','));
if (missing.length || extra.length) process.exit(1);

fs.writeFileSync(path.join(__dirname, '_id_b29.json'), JSON.stringify({ batch: 'id-p1-b29', items }, null, 1), 'utf8');
console.log('写出 _id_b29.json');
