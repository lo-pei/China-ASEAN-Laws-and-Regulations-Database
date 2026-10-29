// PH 标题合成引擎 · 共用词表与句法零件
// 用途：把菲律宾法案标题的固定句法（Establishing/Creating/Renaming + 机构名 + 地点链 + 拨款附句）
//       拆成可复用零件，四语合成。只做「句法级重写」，不虚构事实。
'use strict';

// ── 机构核心词（CORE）：四语均为「核心词在前、修饰语在后」 ──────────────
const CORE = [
  ['Medical Center',            'Trung tâm Y tế',            'ศูนย์การแพทย์',        'Pusat Medis',        'Pusat Perubatan'],
  ['Medical Complex',           'Khu phức hợp Y tế',         'ศูนย์การแพทย์ครบวงจร', 'Kompleks Medis',     'Kompleks Perubatan'],
  ['Trauma Center',             'Trung tâm Chấn thương',     'ศูนย์บาดเจ็บ',         'Pusat Trauma',       'Pusat Trauma'],
  ['Regional Hospital',         'Bệnh viện Vùng',            'โรงพยาบาลภูมิภาค',     'Rumah Sakit Regional','Hospital Wilayah'],
  ['Provincial Hospital',       'Bệnh viện Tỉnh',            'โรงพยาบาลจังหวัด',     'Rumah Sakit Provinsi','Hospital Wilayah'],
  ['District Hospital',         'Bệnh viện Huyện',           'โรงพยาบาลอำเภอ',       'Rumah Sakit Distrik','Hospital Daerah'],
  ['Emergency Hospital',        'Bệnh viện Cấp cứu',         'โรงพยาบาลฉุกเฉิน',     'Rumah Sakit Gawat Darurat','Hospital Kecemasan'],
  ['Memorial Hospital',         'Bệnh viện Tưởng niệm',      'โรงพยาบาลอนุสรณ์',     'Rumah Sakit Memorial','Hospital Memorial'],
  ['General Hospital',          'Bệnh viện Đa khoa',         'โรงพยาบาลทั่วไป',      'Rumah Sakit Umum',   'Hospital Besar'],
  ['Special Economic Zone',     'Đặc khu Kinh tế',           'เขตเศรษฐกิจพิเศษ',     'Kawasan Ekonomi Khusus','Zon Ekonomi Khas'],
  ['Economic Zone',             'Khu Kinh tế',               'เขตเศรษฐกิจ',          'Kawasan Ekonomi',    'Zon Ekonomi'],
  ['Water District',            'Cấp nước',                  'การประปา',             'Perusahaan Air',     'Daerah Air'],
  ['Electric Cooperative',      'Hợp tác xã Điện lực',       'สหกรณ์ไฟฟ้า',          'Koperasi Listrik',   'Koperasi Elektrik'],
  ['College of Medicine',       'Khoa Y',                   'คณะแพทยศาสตร์',        'Fakultas Kedokteran', 'Fakulti Perubatan'],
  ['College of Nursing',        'Khoa Điều dưỡng',           'คณะพยาบาลศาสตร์',      'Fakultas Keperawatan', 'Fakulti Kejururawatan'],
  ['College of Engineering',    'Khoa Kỹ thuật',             'คณะวิศวกรรมศาสตร์',    'Fakultas Teknik',     'Fakulti Kejuruteraan'],
  ['College of Education',      'Khoa Giáo dục',             'คณะครุศาสตร์',          'Fakultas Keguruan',   'Fakulti Pendidikan'],
  ['College of Law',            'Khoa Luật',                 'คณะนิติศาสตร์',         'Fakultas Hukum',      'Fakulti Undang-Undang'],
  ['College of Agriculture',    'Khoa Nông nghiệp',           'คณะเกษตรศาสตร์',       'Fakultas Pertanian',  'Fakulti Pertanian'],
  ['College of Fisheries',      'Khoa Thủy sản',             'คณะประมง',              'Fakultas Perikanan',  'Fakulti Perikanan'],
  ['College of Arts and Sciences','Khoa Nghệ thuật và Khoa học','คณะศิลปศาสตร์และวิทยาศาสตร์','Fakultas Seni dan Sains','Fakulti Seni dan Sains'],
  ['College of Veterinary Medicine','Khoa Thú y',            'คณะสัตวแพทยศาสตร์',    'Fakultas Kedokteran Hewan','Fakulti Perubatan Veterinar'],
  ['Rural Health Unit',         'Trạm Y tế Nông thôn',       'สถานีอนามัยชนบท',      'Unit Kesehatan Pedesaan','Unit Kesihatan Luar Bandar'],
  ['Marine Hatchery',           'Trại giống Hải sản',        'ฟาร์มเพาะพันธุ์สัตว์น้ำ','Balai Benih Laut',   'Hatcheri Marin'],
  ['Breeding Station',          'Trạm Nhân giống',            'สถานีเพาะพันธุ์',        'Stasiun Pembibitan',  'Stesen Pembiakan'],
  ['Demonstration Station',     'Trạm Trình diễn',            'สถานีสาธิต',            'Stasiun Percontohan', 'Stesen Demonstrasi'],
  ['Agricultural School',       'Trường Nông nghiệp',         'โรงเรียนเกษตรกรรม',     'Sekolah Pertanian',   'Sekolah Pertanian'],
  ['Community Hospital',        'Bệnh viện Cộng đồng',       'โรงพยาบาลชุมชน',       'Rumah Sakit Komunitas','Hospital Komuniti'],
  ['District Office',           'Văn phòng Khu vực',         'สำนักงานเขต',           'Kantor Distrik',     'Pejabat Daerah'],
  ['Normal College',            'Cao đẳng Sư phạm',          'วิทยาลัยครู',          'Sekolah Tinggi Keguruan','Kolej Perguruan'],
  ['Extension Campuses',        'Cơ sở mở rộng',             'วิทยาเขตขยาย',         'Kampus Perluasan',   'Kampus Lanjutan'],
  ['Extension Campus',          'Cơ sở mở rộng',             'วิทยาเขตขยาย',         'Kampus Perluasan',   'Kampus Lanjutan'],
  ['Extension Office',          'Văn phòng mở rộng',         'สำนักงานขยาย',         'Kantor Perluasan',   'Pejabat Lanjutan'],
  ['Satellite Office',          'Văn phòng vệ tinh',         'สำนักงานดาวเทียม',     'Kantor Satelit',     'Pejabat Satelit'],
  ['Regular Campuses',          'Cơ sở chính quy',           'วิทยาเขตปกติ',         'Kampus Reguler',     'Kampus Biasa'],
  ['Regular Campus',            'Cơ sở chính quy',           'วิทยาเขตปกติ',         'Kampus Reguler',     'Kampus Biasa'],
  ['Satellite Campus',          'Cơ sở vệ tinh',             'วิทยาเขตดาวเทียม',     'Kampus Satelit',     'Kampus Satelit'],
  ['Campus',                    'Cơ sở',                     'วิทยาเขต',             'Kampus',             'Kampus'],
  ['Elementary School',         'Trường Tiểu học',           'โรงเรียนประถมศึกษา',   'Sekolah Dasar',      'Sekolah Rendah'],
  ['Central School',            'Trường Trung tâm',          'โรงเรียนกลาง',         'Sekolah Pusat',      'Sekolah Pusat'],
  ['High School',               'Trường Trung học',          'โรงเรียนมัธยมศึกษา',   'Sekolah Menengah',   'Sekolah Menengah'],
  ['Highschool',                'Trường Trung học',          'โรงเรียนมัธยมศึกษา',   'Sekolah Menengah',   'Sekolah Menengah'],
  ['Secondary School',          'Trường Trung học',          'โรงเรียนมัธยมศึกษา',   'Sekolah Menengah',   'Sekolah Menengah'],
  ['Trade School',              'Trường Thương mại',         'โรงเรียนการค้า',       'Sekolah Perdagangan','Sekolah Perdagangan'],
  ['State University',          'Đại học Bang',              'มหาวิทยาลัยของรัฐ',    'Universitas Negeri', 'Universiti Negeri'],
  ['State College',             'Cao đẳng Bang',             'วิทยาลัยของรัฐ',       'Sekolah Tinggi Negeri','Kolej Negeri'],
  ['Polytechnic University',    'Đại học Bách khoa',         'มหาวิทยาลัยโพลีเทคนิค','Universitas Politeknik','Universiti Politeknik'],
  ['Polytechnic College',       'Cao đẳng Bách khoa',        'วิทยาลัยโพลีเทคนิค',   'Sekolah Tinggi Politeknik','Kolej Politeknik'],
  ['Technological University',  'Đại học Công nghệ',         'มหาวิทยาลัยเทคโนโลยี', 'Universitas Teknologi','Universiti Teknologi'],
  ['University',                'Đại học',                  'มหาวิทยาลัย',          'Universitas',        'Universiti'],
  ['College',                   'Cao đẳng',                 'วิทยาลัย',             'Sekolah Tinggi',     'Kolej'],
  ['Institute',                 'Học viện',                 'สถาบัน',               'Institut',           'Institut'],
  ['Academy',                   'Học viện',                 'สถาบัน',               'Akademi',            'Akademi'],
  ['Hospital',                  'Bệnh viện',                'โรงพยาบาล',           'Rumah Sakit',        'Hospital'],
  ['Health Center',             'Trung tâm Y tế',           'ศูนย์สุขภาพ',          'Pusat Kesehatan',    'Pusat Kesihatan'],
  ['Puericulture Center',       'Trung tâm Nuôi dạy trẻ',   'ศูนย์เลี้ยงดูเด็ก',     'Pusat Puerikultur',  'Pusat Puerikultur'],
  ['Center',                    'Trung tâm',                'ศูนย์',                'Pusat',              'Pusat'],
  ['Centre',                    'Trung tâm',                'ศูนย์',                'Pusat',              'Pusat'],
  ['Authority',                 'Cơ quan',                  'องค์กร',               'Otoritas',           'Pihak Berkuasa'],
  ['Commission',                'Ủy ban',                   'คณะกรรมการ',           'Komisi',             'Suruhanjaya'],
  ['Council',                   'Hội đồng',                 'สภา',                  'Dewan',              'Majlis'],
  ['Bureau',                    'Cục',                      'สำนัก',                'Biro',               'Biro'],
  ['Board',                     'Ủy ban',                   'คณะกรรมการ',           'Dewan',              'Lembaga'],
  ['School',                    'Trường',                   'โรงเรียน',             'Sekolah',            'Sekolah'],
  ['Boulevard',                 'Đại lộ',                   'ถนน',                  'Jalan',              'Lebuh'],
  ['Avenue',                    'Đại lộ',                   'ถนน',                  'Jalan',              'Lebuh'],
  ['Highway',                   'Quốc lộ',                  'ทางหลวง',              'Jalan Raya',         'Lebuh Raya'],
  ['Road',                      'Đường',                    'ถนน',                  'Jalan',              'Jalan'],
  ['Street',                    'Đường',                    'ถนน',                  'Jalan',              'Jalan'],
  ['Bridge',                    'Cầu',                      'สะพาน',                'Jembatan',           'Jambatan'],
  ['Camp',                      'Trại',                     'ค่าย',                 'Kamp',               'Kem'],
  ['Airport',                   'Sân bay',                  'สนามบิน',              'Bandara',            'Lapangan Terbang'],
  ['Port',                      'Cảng',                     'ท่าเรือ',              'Pelabuhan',          'Pelabuhan'],
  ['Primary School',            'Trường Tiểu học',          'โรงเรียนประถมศึกษา',   'Sekolah Dasar',      'Sekolah Rendah'],
  ['Sitio',                     'Sitio',                    'ซิติโอ',                'Sitio',              'Sitio'],
  ['Barrio',                    'Barrio',                   'บาริโอ',               'Barrio',             'Barrio'],
  ['Office',                    'Văn phòng',                'สำนักงาน',             'Kantor',             'Pejabat'],
  // 2026-10-28 转制类补充：疗养院 / 卫生所 / 工程区 / 师范学校
  ['Normal School',             'Trường Sư phạm',           'โรงเรียนครู',          'Sekolah Keguruan',   'Sekolah Perguruan'],
  ['Health Infirmary',          'Bệnh xá',                  'สถานีอนามัย',          'Infirmari Kesehatan','Infirmari Kesihatan'],
  ['Infirmary',                 'Bệnh xá',                  'สถานีอนามัย',          'Infirmari',          'Infirmari'],
  ['Sanitarium',                'Viện điều dưỡng',          'สถานพยาบาล',           'Sanatorium',         'Sanatorium'],
  ['Engineering District',      'Khu Kỹ thuật',             'เขตวิศวกรรม',          'Distrik Teknik',     'Daerah Kejuruteraan'],
  ['Training Center',           'Trung tâm Đào tạo',        'ศูนย์ฝึกอบรม',         'Pusat Pelatihan',    'Pusat Latihan'],
  ['Teachers College',          'Cao đẳng Sư phạm',         'วิทยาลัยครู',          'Sekolah Tinggi Keguruan','Kolej Perguruan'],
  ['Teachers School',           'Trường Sư phạm',           'โรงเรียนครู',          'Sekolah Keguruan',   'Sekolah Perguruan'],

  // ── 2016 年 b27 补充：行政令与院校类高频通名 ───────────────────────
  // Barangay 是菲律宾正式行政单位，四语一律保留原词（与库内既有条目一致）；
  // 泰文按既有条目的音译作「บารังไกย์」。
  ['Cultural Center and Museum','Trung tâm Văn hóa và Bảo tàng','ศูนย์วัฒนธรรมและพิพิธภัณฑ์','Pusat Budaya dan Museum','Pusat Budaya dan Muzium'],
  ['Center and Museum',         'Trung tâm và Bảo tàng',    'ศูนย์และพิพิธภัณฑ์',   'Pusat dan Museum',   'Pusat dan Muzium'],
  ['Heritage Zone',             'Khu Di sản',               'เขตมรดก',              'Kawasan Warisan',    'Zon Warisan'],
  ['Barangay',                  'Barangay',                 'บารังไกย์',             'Barangay',           'Barangay'],
  ['Library',                   'Thư viện',                 'ห้องสมุด',              'Perpustakaan',       'Perpustakaan'],
  ['Museum',                    'Bảo tàng',                 'พิพิธภัณฑ์',            'Museum',             'Muzium'],
  ['Hatchery',                  'Trại giống',               'โรงเพาะฟัก',           'Balai Benih',        'Pusat Penetasan'],
  ['Laboratory',                'Phòng thí nghiệm',         'ห้องปฏิบัติการ',        'Laboratorium',       'Makmal'],
  ['Station',                   'Trạm',                     'สถานี',                 'Stasiun',            'Stesen'],
  ['Tribunal',                  'Tòa án',                   'คณะตุลาการ',            'Tribunal',           'Tribunal'],
  ['Court',                     'Tòa án',                   'ศาล',                   'Pengadilan',         'Mahkamah'],
  ['Corporation',               'Tổng công ty',             'บรรษัท',                'Korporasi',          'Perbadanan'],
  ['Program',                   'Chương trình',             'โครงการ',               'Program',            'Program'],
];

// ── 修饰语（MOD）─────────────────────────────────────────────────────
const MOD = [
  ['Polytechnic',           'Bách khoa',              'โพลีเทคนิค',          'Politeknik',           'Politeknik'],
  // 分校区 / 延伸办学点：不是专名的一部分，必须译出
  ['Extension',             'mở rộng',                'ขยาย',                'Perluasan',            'Lanjutan'],
  ['Technical-Vocational',  'Kỹ thuật - Dạy nghề',    'เทคนิค-อาชีวศึกษา',      'Teknik-Kejuruan',      'Teknikal-Vokasional'],
  ['Technical Vocational',  'Kỹ thuật - Dạy nghề',    'เทคนิค-อาชีวศึกษา',      'Teknik-Kejuruan',      'Teknikal-Vokasional'],
  ['Science and Technology','Khoa học và Công nghệ',  'วิทยาศาสตร์และเทคโนโลยี','Sains dan Teknologi',  'Sains dan Teknologi'],
  ['Arts and Trades',       'Nghệ thuật và Thương mại','ศิลปะและหัตถกรรม',     'Seni dan Keterampilan','Seni dan Pertukangan'],
  ['Arts and Trade',        'Nghệ thuật và Thương mại','ศิลปะและหัตถกรรม',     'Seni dan Keterampilan','Seni dan Pertukangan'],
  ['Home Industries',       'Công nghiệp gia đình',   'อุตสาหกรรมในครัวเรือน',  'Industri Rumah Tangga','Industri Rumah Tangga'],
  ['Agro-Industrial',       'Nông-công nghiệp',       'เกษตรอุตสาหกรรม',        'Agro-Industri',        'Agro-Industri'],
  ['Agro-industrial',       'Nông-công nghiệp',       'เกษตรอุตสาหกรรม',        'Agro-Industri',        'Agro-Industri'],
  ['Agro-Fishery',          'Nông-thủy sản',          'เกษตร-ประมง',            'Agro-Perikanan',       'Agro-Perikanan'],
  ['Agro-fishery',          'Nông-thủy sản',          'เกษตร-ประมง',            'Agro-Perikanan',       'Agro-Perikanan'],
  ['Multi-Species',         'Đa loài',                'หลายชนิด',               'Multi-Spesies',        'Pelbagai Spesies'],
  ['Multi-species',         'Đa loài',                'หลายชนิด',               'Multi-Spesies',        'Pelbagai Spesies'],
  ['Multi-Specialty',       'Đa chuyên khoa',         'หลายสาขา',               'Multi-Spesialisasi',   'Pelbagai Kepakaran'],
  ['Tertiary',              'Tuyến ba',               'ระดับตติยภูมิ',           'Tersier',              'Tersier'],
  ['Regular',               'Chính quy',              'ปกติ',                   'Reguler',              'Biasa'],
  ['Existing',              'Hiện hữu',               'ที่มีอยู่',                'yang Ada',             'Sedia Ada'],
  ['Agricultural',          'Nông nghiệp',            'เกษตรกรรม',              'Pertanian',            'Pertanian'],
  ['Fisheries',             'Thủy sản',               'ประมง',                  'Perikanan',            'Perikanan'],
  ['Forestry',              'Lâm nghiệp',             'ป่าไม้',                  'Kehutanan',            'Perhutanan'],
  ['Vocational',            'Dạy nghề',               'อาชีวศึกษา',             'Kejuruan',             'Vokasional'],
  ['Nationalized',          'Quốc lập hóa',           'โอนเป็นของรัฐ',           'Dinasionalisasi',      'Dinasionalkan'],
  ['Independent',           'Độc lập',                'เอกเทศ',                'Mandiri',              'Bebas'],
  ['Technical',             'Kỹ thuật',               'เทคนิค',                'Teknik',               'Teknikal'],
  ['Laboratory',            'Thực hành',              'ห้องปฏิบัติการ',         'Laboratorium',         'Makmal'],
  ['Model',                 'Kiểu mẫu',               'ต้นแบบ',                'Model',                'Model'],
  ['Pilot',                 'Thí điểm',               'นำร่อง',                'Percontohan',          'Perintis'],
  ['Integrated',            'Tích hợp',               'แบบบูรณาการ',            'Terpadu',              'Bersepadu'],
  ['Comprehensive',         'Toàn diện',              'แบบครบวงจร',             'Terpadu',              'Menyeluruh'],
  ['Special',               'Đặc biệt',               'พิเศษ',                  'Khusus',               'Khas'],
  ['Municipal',             'Đô thị',                 'เทศบาล',                 'Kotamadya',            'Perbandaran'],
  ['City',                  'Thành phố',              'เมือง',                  'Kota',                 'Bandar'],
  ['Central',               'Trung tâm',              'กลาง',                   'Pusat',                'Pusat'],
  ['Station',               'Trạm',                   'สถานี',                  'Stasiun',              'Stesen'],
  ['Science',               'Khoa học',               'วิทยาศาสตร์',            'Sains',                'Sains'],
  ['Sports',                'Thể thao',               'กีฬา',                    'Olahraga',             'Sukan'],
  ['Arts',                  'Nghệ thuật',             'ศิลปะ',                  'Seni',                 'Seni'],
  ['Medicine',              'Y khoa',                 'แพทยศาสตร์',             'Kedokteran',           'Perubatan'],
  ['Maternity',             'Sản khoa',               'สูติกรรม',               'Kebidanan',            'Bidan'],
  ['Agriculture',           'Nông nghiệp',            'เกษตรศาสตร์',            'Pertanian',            'Pertanian'],
  ['Engineering',           'Kỹ thuật',               'วิศวกรรมศาสตร์',          'Teknik',               'Kejuruteraan'],
  ['Midwifery',             'Hộ sinh',                'ผดุงครรภ์',              'Kebidanan',            'Bidan'],
  ['Craftsmen',             'Thợ thủ công',           'ช่างฝีมือ',              'Perajin',              'Tukang'],
  ['Nursing',               'Điều dưỡng',             'พยาบาลศาสตร์',           'Keperawatan',          'Kejururawatan'],
  ['Education',             'Giáo dục',               'การศึกษา',               'Pendidikan',           'Pendidikan'],
  ['Technology',            'Công nghệ',              'เทคโนโลยี',              'Teknologi',            'Teknologi'],
  ['Rural',                 'Nông thôn',              'ชนบท',                   'Pedesaan',             'Luar Bandar'],
  ['Public',                'Công lập',               'สาธารณะ',                'Negeri',               'Awam'],
  ['Private',               'Tư thục',                'เอกชน',                  'Swasta',               'Swasta'],
  ['Senior',                'Phổ thông',              'ระดับมัธยมปลาย',          'Menengah Atas',        'Menengah Atas'],
  ['Demonstration',         'Thực hành',              'สาธิต',                  'Percontohan',          'Demonstrasi'],
  ['Experimental',          'Thực nghiệm',            'ทดลอง',                  'Eksperimental',        'Eksperimen'],
  ['Memorial',              'Tưởng niệm',             'อนุสรณ์',                'Memorial',             'Memorial'],
  ['State',                 'Bang',                   'ของรัฐ',                 'Negeri',               'Negeri'],
  ['National',              'Quốc gia',               'แห่งชาติ',               'Nasional',             'Kebangsaan'],

  // ── b27 补充：机构名前缀里的行政区划与办学层次 ──────────────────────
  ['Technological',         'Công nghệ',              'เทคโนโลยี',              'Teknologi',            'Teknologi'],
  ['Vocational',            'Dạy nghề',               'อาชีวศึกษา',             'Kejuruan',             'Vokasional'],
  ['Provincial',            'Tỉnh',                   'จังหวัด',                'Provinsi',             'Wilayah'],
  ['Municipal',             'Thị trấn',               'เทศบาล',                 'Kotamadya',            'Perbandaran'],
  ['Regional',              'Vùng',                   'ภูมิภาค',                 'Regional',             'Wilayah'],
  ['City',                  'Thành phố',              'เมือง',                  'Kota',                 'Bandaraya'],
];

// 修饰语排序：National/State/City 收尾
const TAIL_MOD = new Set(['National', 'State', 'Nationalized', 'City', 'Provincial', 'Municipal', 'Regional']);

// ── 行政区划 ────────────────────────────────────────────────────────
const ADMIN = {
  'City':         ['Thành phố', 'เมือง',       'Kota',       'Bandar'],
  'Municipality': ['Thị trấn',  'เทศบาล',     'Kotamadya',  'Perbandaran'],
  'Province':     ['Tỉnh',      'จังหวัด',     'Provinsi',   'Wilayah'],
  'Subprovince':  ['Tiểu tỉnh', 'กิ่งจังหวัด', 'Subprovinsi','Subwilayah'],
  'Region':       ['Vùng',      'ภูมิภาค',     'Wilayah',    'Wilayah'],
  'District':     ['Quận',      'เขต',         'Distrik',    'Daerah'],
  'Island':       ['Đảo',       'เกาะ',        'Pulau',      'Pulau'],
  'Barangay':     ['Barangay',  'บารังไกย์',   'Barangay',   'Barangay'],
  'Barrio':       ['Barrio',    'บาริโอ',      'Barrio',     'Barrio'],
  'Sitio':        ['Sitio',     'ซิติโอ',      'Sitio',      'Sitio'],
  'Island Garden City': ['Thành phố Vườn Đảo', 'เมืองสวนเกาะ', 'Kota Taman Pulau', 'Bandar Taman Pulau'],
  'Lone District':['Quận',      'เขต',         'Distrik',    'Daerah'],
};

// ── 动词词头 ────────────────────────────────────────────────────────
const VERB = {
  establish:  ['thành lập',  'จัดตั้ง',      'membentuk',       'menubuhkan'],
  create:     ['thành lập',  'จัดตั้ง',      'membentuk',       'menubuhkan'],
  constitute: ['thành lập',  'จัดตั้ง',      'membentuk',       'menubuhkan'],
  convert:    ['chuyển đổi', 'เปลี่ยนสถานะ', 'mengubah status', 'menukar status'],
  rename:     ['đổi tên',    'เปลี่ยนชื่อ',  'mengganti nama',  'menukar nama'],
  declare:    ['tuyên bố',   'ประกาศ',       'menetapkan',      'mengisytiharkan'],
};

const HEAD = ['Đạo luật', 'พระราชบัญญัติ', 'Undang-Undang', 'Akta'];

// ── 附句 ────────────────────────────────────────────────────────────
const TAIL = {
  funds: ['và phân bổ kinh phí cho mục đích này',
          'และจัดสรรเงินทุนสำหรับการนี้',
          'dan mengalokasikan dana untuk itu',
          'dan memperuntukkan dana untuk itu'],
  other: ['và cho các mục đích khác', 'และเพื่อวัตถุประสงค์อื่น', 'dan untuk tujuan lain', 'dan untuk tujuan lain'],
  at:    ['tại', 'ใน', 'di', 'di'],
  to:    ['thành', 'เป็น', 'menjadi', 'kepada'],
};

// 英文数词 → 床位数字
const NUMW = {
  ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  onehundred: 100, onehundredfifty: 150, twohundred: 200, threehundred: 300,
};

// ── 工具 ────────────────────────────────────────────────────────────
const ENT = (s) => String(s)
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&rsquo;|&#8217;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/Æ/g, "'").replace(/’/g, "'").replace(/‘/g, "'")
  .replace(/“|”/g, '"')
  .replace(/[\u00AD\u200B\u200E\u200F]/g, '')
  .replace(/\s+/g, ' ').trim();

// 专名清理：去英文尾缀、括号缩写、多余标点
function cleanName(s) {
  let x = ENT(s);
  const open = (x.match(/\(/g) || []).length, close = (x.match(/\)/g) || []).length;
  if (open > close) x = x.slice(0, x.lastIndexOf('('));
  x = x.replace(/\s*\((?:[A-Z][A-Za-z.\-]*|[A-Z]{2,}[^)]*)\)\s*$/g, '');
  x = x.replace(/\s*\([A-Z]{2,8}\)/g, '');
  x = x.replace(/\s*,?\s*(?:and|for)\s+(?:Other|the)\s+Purposes?\b.*$/i, '');
  x = x.replace(/\s*,?\s*(?:and\s+)?Amending\s+for\s+(?:This|the)\s+Purpose\b.*$/i, '');
  x = x.replace(/\s*,?\s*(?:and\s+)?(?:Appropriating|Appropriation|Providing|Author\S{0,4}ing|Mandating|Defining|Prescribing|Declaring|Integrating|Abolishing|Repealing|Amending|Converting|Creating|Establishing|Including|Located|Situated|Stretching)\b.*$/i, '');
  x = x.replace(/\s*,?\s*(?:and\s+)?(?:to\s+be\s+known|to\s+be\s+Known|Known)\s+as\b.*$/i, '');
  x = x.replace(/\s*,\s*$/, '').replace(/\s*\.\s*$/, '');
  x = x.replace(/\s+/g, ' ').trim();
  x = x.replace(/^(?:the|a|an)\s+/i, '');
  return x;
}

// 主题短语逐词翻译（未收录的词保留拉丁）
function trTopic(topic, i) {
  if (!topic) return null;
  const t = topic.replace(/^the\s+/i, '');
  const full = MOD.find(m => m[0].toLowerCase() === t.toLowerCase());
  if (full) return full[i + 1];
  const parts = t.split(/\s*,\s*|\s+and\s+/i).map(s => s.trim()).filter(Boolean);
  const out = parts.map(p => {
    const hit = MOD.find(m => m[0].toLowerCase() === p.toLowerCase());
    return hit ? hit[i + 1] : p;
  });
  if (i === 1) return out.join('และ');
  if (i === 0) return out.join(', ');
  return out.length > 1 ? out.slice(0, -1).join(', ') + ' dan ' + out[out.length - 1] : out[0] || '';
}

// 「X of Y」连接词
const OF = [' của ', 'ของ', ' ', ' '];

// 名称 → 目标语（core + 修饰 + 专名 + 主题/嵌套机构）
function trGenus(s, depth) {
  depth = depth || 0;
  const raw = cleanName(s);
  let text = raw;
  let core = null;
  let topic = null;
  // 取最长匹配的 CORE（Primary School 优先于 School）
  let best = null;
  for (const [en, ...t] of CORE) {
    // 复数弹性：Hatcheries ↔ Hatchery、Campuses ↔ Campus、Schools ↔ School
    // 先转义原词，再套后缀，否则 (?:y|ies) 会被当成字面量
    const esc = en.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const flex = /y$/i.test(en) ? esc.replace(/y$/i, '(?:y|ies)') : esc + '(?:s|es)?';
    const re = new RegExp('(^|[\\s\\-])(' + flex + ')(?=$|[\\s,]|\\sof\\b)', 'i');
    const m = text.match(re);
    if (!m) continue;
    const idx = m.index + (m[1] ? m[1].length : 0);
    const post = text.slice(idx + m[2].length).trim();
    if (post && !/^of\b/i.test(post)) continue;
    if (!best || m[2].length > best.len) best = { en, t, idx, post, len: m[2].length };
  }
  if (best) {
    core = { en: best.en, t: best.t };
    text = text.slice(0, best.idx).trim();
    if (best.post) topic = best.post.replace(/^of\s+/i, '').trim();
  }
  // 「Pasay City General Hospital」里的「Pasay City」是整块地名，
  // 不能把 City 当后置修饰语剥出去（否则越南语会拼成「Pasay 城市总医院」）
  let cityHold = null;
  {
    const cm = text.match(/^(.*\S)\s+(City)$/);
    if (cm && /^[A-Z]/.test(cm[1])) { cityHold = cm[2]; text = cm[1] + '\u0001CITYHOLD\u0001'; }
  }
  const mods = [];
  let rest = text;
  let guard = 0;
  while (rest && guard++ < 8) {
    let hit = null;
    for (const [en, ...t] of MOD) {
      const re = new RegExp('(^|[\\s\\-])' + en.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
      if (re.test(rest)) { hit = { en, t }; break; }
    }
    if (!hit) break;
    mods.unshift(hit);
    rest = rest.slice(0, rest.length - hit.en.length).trim();
  }
  let bedN = null;
  const bm = rest.match(/\b([A-Za-z\- ]{3,20})[- ]bed\b/i);
  if (bm) {
    const k = bm[1].toLowerCase().replace(/[^a-z]/g, '');
    if (NUMW[k]) { bedN = NUMW[k]; rest = rest.replace(bm[0], '').trim(); }
  }
  // 「X Research and Medical Center」的 and / of 属连接词，不能留在专名尾部
  let proper = rest.replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/[-\s]+$/, '')
    .replace(/[,\s]+(?:and|of|the|de|del|la)$/i, '').replace(/[,\s]+$/, '')
    // 扫描件带来的孤立撇号（「Judge Guillermo Eleazar'」）必须剥掉
    .replace(/[\u2019']+$/, '').replace(/[,\s]+$/, '');
  if (cityHold) proper = (proper + ' ' + cityHold).replace(/\u0001CITYHOLD\u0001/g, '').trim();
  // 专名尾部的地名后缀按目标语渲染：「Pasay City」→「Thành phố Pasay」/「Kota Pasay」
  const cityName = proper && proper.match(/^(.*\S)\s+City$/);
  const renderCity = (i) => {
    if (!cityName) return proper;
    const a = ADMIN.City;
    return i === 1 ? a[1] + cityName[1] : a[i] + ' ' + cityName[1];
  };

  // 主题：先看能否作为嵌套机构解析，再查修饰语表，最后按拉丁保留
  let topicNested = null, topicMod = null, topicRaw = null;
  if (topic) {
    const t2 = topic.replace(/^the\s+/i, '').trim();
    if (depth < 2) {
      const n = trGenus(t2, depth + 1);
      if (n && n.core && !n.proper) topicNested = n;
    }
    if (!topicNested) {
      const hit = MOD.find(m => m[0].toLowerCase() === t2.toLowerCase());
      if (hit) topicMod = [{ t: hit.slice(1) }];
      else {
        const parts = t2.split(/\s*,\s*|\s+and\s+/i).map(x => x.trim()).filter(Boolean);
        const hits = parts.map(x => MOD.find(m => m[0].toLowerCase() === x.toLowerCase()));
        if (parts.length > 1 && hits.every(Boolean)) topicMod = hits.map(h => ({ t: h.slice(1) }));
        else topicRaw = t2;
      }
    }
  }

  const mk = (i) => {
    const c = core ? core.t[i] : null;
    const head = mods.filter(m => !TAIL_MOD.has(m.en)).map(m => m.t[i]);
    const tail = mods.filter(m => TAIL_MOD.has(m.en)).map(m => m.t[i]);
    const bed = bedN ? (i === 0 ? bedN + ' giường' : i === 1 ? bedN + ' เตียง' : bedN + ' tempat tidur') : null;
    const th = i === 1;
    const tmList = topicMod ? topicMod.map(x => x.t[i]) : [];
    let parts = [c, ...tmList, ...head, renderCity(i)].filter(Boolean);
    let s2 = th ? parts.join('').replace(/\s+/g, ' ').trim() : parts.join(' ');
    if (topicNested) {
      const nt = topicNested[i];
      if (th) s2 = s2 + OF[1] + nt;
      else s2 = s2 + OF[i] + nt;
    } else if (topicRaw) {
      s2 = s2 + ' ' + topicRaw;
    }
    if (bed) s2 = s2 + ' ' + bed;
    if (tail.length) s2 = s2 + (th ? tail.join('') : ' ' + tail.join(' '));
    return s2.replace(/\s+/g, ' ').trim();
  };
  return {
    proper, core: core ? core.en : null, mods: mods.map(m => m.en), topic, bed: bedN,
    topicNested: topicNested ? topicNested.core : null, topicRaw,
    topicKind: topicNested ? 'nested' : topicMod ? 'mod' : topicRaw ? 'raw' : null,
    0: mk(0), 1: mk(1), 2: mk(2), 3: mk(3), raw,
  };
}

// ── 地点链 ──────────────────────────────────────────────────────────
const LOC_UNIT = /\b(Island Garden City|City|Municipality|Province|Subprovince|Region|Lone District|District|Island|Barangay|Barrio)\b\s*(?:of\s+)?/i;

function parseLoc(s) {
  let x = ENT(s).replace(/\s+/g, ' ').trim();
  x = x.replace(/^(?:in|at)\s+/i, '').replace(/^the\s+/i, '');
  const out = [];
  x = x.replace(/\b(?:City|Municipality|Province|Subprovince|Region|District|Island|Barangay|Barrio)\s+of\s+/gi, (m) => m.split(/\s+/)[0] + ' ');
  const segs = x.split(/\s*,\s*/).map(t => t.trim()).filter(Boolean);
  for (const seg of segs) {
    let sg = seg.replace(/^(?:in|at)\s+(?:the\s+)?/i, '').trim();
    const m = sg.match(LOC_UNIT);
    if (m && sg.length > m.index + m[0].length) {
      out.push({ type: m[1].replace(/\b\w/g, c => c.toUpperCase()), name: sg.slice(m.index + m[0].length).replace(/^the\s+/i, '').trim(), inferred: false });
    } else {
      const last = out[out.length - 1];
      let ty = last ? last.type : 'Province';
      if (last && (last.type === 'Barangay' || last.type === 'Barrio')) ty = 'Municipality';
      else if (last && (last.type === 'Municipality' || last.type === 'City')) ty = 'Province';
      let nm2 = seg.replace(/^(?:the\s+)/i, '').trim();
      if (/\bCity$/i.test(nm2)) { nm2 = nm2.replace(/\s*City$/i, '').trim(); ty = 'City'; }
      if (/\bIsland$/i.test(nm2) && ty !== 'Province') ty = 'Island';
      out.push({ type: ty, name: nm2, inferred: true });
    }
  }
  return out;
}

const METRO = { 0: 'Vùng Metro Manila', 1: 'เขตมหานครมะนิลา', 2: 'Wilayah Metropolitan Manila', 3: 'Wilayah Metropolitan Manila' };

function locText(list, i) {
  if (!list.length) return '';
  const parts = [];
  for (const l of list) {
    if (l.name === 'Metro Manila') { parts.push(METRO[i]); continue; }
    const a = ADMIN[l.type] || ADMIN['Province'];
    const nm = l.name;
    if (l.type === 'Barangay' || l.type === 'Barrio') parts.push(i === 1 ? 'บารังไกย์ ' + nm : a[i] + ' ' + nm);
    else if (i === 1) parts.push(a[1] + nm);
    else parts.push(a[i] + ' ' + nm);
  }
  return i === 1 ? parts.join(' ') : parts.join(', ');
}

// 泰文与拉丁专名之间补空格
function thFix(s) {
  let x = String(s).replace(/\s+/g, ' ').trim();
  x = x.replace(/([\u0E00-\u0E7F])([A-Za-z0-9])/g, '$1 $2');
  // 句点、右括号不参与判定：否则泰文缩写「ค.ศ.」会被拆成「ค. ศ.」
  x = x.replace(/([A-Za-z0-9])([\u0E00-\u0E7F])/g, '$1 $2');
  // 介词「ใน」永远紧贴前一个泰文词：บารังไกย์ ในเทศบาล → บารังไกย์ในเทศบาล
  // 只处理 ใน，不动列举型短语之间的空格（กำหนดวัตถุประสงค์ อำนาจ และหน้าที่）
  x = x.replace(/([\u0E00-\u0E7F])\s+(?=ใน)/g, '$1');
  return x.replace(/\s+/g, ' ').trim();
}

function reduceLoc(locRaw) {
  const multi = /\band\s+in\s+the\s+(?:Municipalities|Cities|Provinces|Districts)\b|\bMunicipalities\s+of\b[\s\S]*\band\b|\band\s+the\s+(?:Municipalities|Cities)\b/i.test(locRaw);
  if (!multi) return undefined;
  const p = locRaw.match(/\bProvince\s+of\s+([A-Z][A-Za-z.'\- ]{2,40})/i);
  if (p) return { type: 'Province', name: p[1].replace(/[,\s]+$/, '').trim(), inferred: false };
  const c = locRaw.match(/\bCity\s+of\s+([A-Z][A-Za-z.'\- ]{2,40})/i);
  if (c) return { type: 'City', name: c[1].replace(/[,\s]+$/, '').trim(), inferred: false };
  return null;
}

function trimLoc(locRaw) {
  let x = String(locRaw);
  x = x.replace(/\s*,\s*in\s+the\s+/i, ' in the ');
  x = x.split(/\s+in\s+the\s+/i)[0];
  x = x.split(/\s+in\s+(?=(?:Barangay|Barrio|City|Municipality|Province|Subprovince|Island|Region|District)\b)/i)[0];
  x = x.replace(/\bthe\s+(?=Province|City|Municipality|Barangay|Barrio|District|Region|Island)\b/gi, '');
  const segs = x.split(/\s*,\s*/);
  const keep = [];
  for (const s of segs) {
    if (keep.length && /\b(?:School|College|University|Institute|Hospital|Center|Centre|Authority|Council|Board|Academy|Office|Bureau)\b/i.test(s)) break;
    keep.push(s);
  }
  return keep.join(', ').replace(/[,;\s]+$/, '');
}

module.exports = {
  CORE, MOD, ADMIN, VERB, HEAD, TAIL, ENT, cleanName, trGenus, trTopic,
  parseLoc, locText, TAIL_MOD, thFix, reduceLoc, trimLoc,
};
