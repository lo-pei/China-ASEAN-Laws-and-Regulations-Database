'use strict';
// SG 行政令 / 公告 / 委任状译名：不属于「体裁 + 母法 + 括注」结构的一次性标题
// 语义基准：中文层（title.zh）已人工规范化，四语按 zh 语义对齐，不另生歧义
const p = (vi, th, id, ms) => ({ vi, th, id, ms });

// 母法名（本文件内自用，同时并入 _sg_dict.js 的 parentExtra 以备复用）
const ACT = {
  'Estate Duty Act': p('Luật Thuế Di sản Thừa kế', 'พระราชบัญญัติภาษีมรดก',
    'Undang-Undang Bea Warisan', 'Akta Duti Harta Pusaka'),
  'Motor Vehicles (Third-Party Risks and Compensation) Act': p(
    'Luật Xe cơ giới (Rủi ro và Bồi thường của Bên thứ ba)',
    'พระราชบัญญัติยานยนต์ (ความเสี่ยงและการชดเชยของบุคคลภายนอก)',
    'Undang-Undang Kendaraan Bermotor (Risiko dan Kompensasi Pihak Ketiga)',
    'Akta Kenderaan Bermotor (Risiko dan Pampasan Pihak Ketiga)'),
  'Common Gaming Houses Act': p('Luật Nhà Cờ bạc Công cộng', 'พระราชบัญญัติบ่อนการพนันสาธารณะ',
    'Undang-Undang Rumah Perjudian Umum', 'Akta Rumah Perjudian Awam'),
  'Commission of Inquiry Act': p('Luật Điều tra', 'พระราชบัญญัติการสอบสวน',
    'Undang-Undang Penyelidikan', 'Akta Siasatan'),
};

// 同名但需按公文编号区分者（orig 都是同一个词）
const BY_ID = {
  // 《遗产税法》豁免公告（S xxx/yyyy）5 件 + 《机动车…法》豁免令（N 1）1 件
  'SG-H1442': p('Luật Thuế Di sản Thừa kế — Thông báo Miễn trừ (S 100/1997)',
    'พระราชบัญญัติภาษีมรดก — ประกาศการยกเว้น (S 100/1997)',
    'Undang-Undang Bea Warisan — Pemberitahuan Pembebasan (S 100/1997)',
    'Akta Duti Harta Pusaka — Pemberitahuan Pengecualian (S 100/1997)'),
  'SG-H1443': p('Luật Thuế Di sản Thừa kế — Thông báo Miễn trừ (S 155/1996)',
    'พระราชบัญญัติภาษีมรดก — ประกาศการยกเว้น (S 155/1996)',
    'Undang-Undang Bea Warisan — Pemberitahuan Pembebasan (S 155/1996)',
    'Akta Duti Harta Pusaka — Pemberitahuan Pengecualian (S 155/1996)'),
  'SG-H1444': p('Luật Thuế Di sản Thừa kế — Thông báo Miễn trừ (S 17/1997)',
    'พระราชบัญญัติภาษีมรดก — ประกาศการยกเว้น (S 17/1997)',
    'Undang-Undang Bea Warisan — Pemberitahuan Pembebasan (S 17/1997)',
    'Akta Duti Harta Pusaka — Pemberitahuan Pengecualian (S 17/1997)'),
  'SG-H1445': p('Luật Thuế Di sản Thừa kế — Thông báo Miễn trừ (S 238/1996)',
    'พระราชบัญญัติภาษีมรดก — ประกาศการยกเว้น (S 238/1996)',
    'Undang-Undang Bea Warisan — Pemberitahuan Pembebasan (S 238/1996)',
    'Akta Duti Harta Pusaka — Pemberitahuan Pengecualian (S 238/1996)'),
  'SG-H1446': p('Luật Thuế Di sản Thừa kế — Thông báo Miễn trừ (S 32/1996)',
    'พระราชบัญญัติภาษีมรดก — ประกาศการยกเว้น (S 32/1996)',
    'Undang-Undang Bea Warisan — Pemberitahuan Pembebasan (S 32/1996)',
    'Akta Duti Harta Pusaka — Pemberitahuan Pengecualian (S 32/1996)'),
  'SG-H1447': p('Luật Xe cơ giới (Rủi ro và Bồi thường của Bên thứ ba) — Lệnh Miễn trừ (N 1)',
    'พระราชบัญญัติยานยนต์ (ความเสี่ยงและการชดเชยของบุคคลภายนอก) — คำสั่งการยกเว้น (N 1)',
    'Undang-Undang Kendaraan Bermotor (Risiko dan Kompensasi Pihak Ketiga) — Perintah Pembebasan (N 1)',
    'Akta Kenderaan Bermotor (Risiko dan Pampasan Pihak Ketiga) — Perintah Pengecualian (N 1)'),
  // 《公共赌馆法》彩票公告（N 1）
  'SG-H3048': p('Luật Nhà Cờ bạc Công cộng — Thông báo Xổ số (N 1)',
    'พระราชบัญญัติบ่อนการพนันสาธารณะ — ประกาศสลาก (N 1)',
    'Undang-Undang Rumah Perjudian Umum — Pemberitahuan Lotere (N 1)',
    'Akta Rumah Perjudian Awam — Pemberitahuan Loteri (N 1)'),
};

const M = {
  // ── 委任类 ─────────────────────────────────────────────
  'Accountant-General Appointed to be Accountant for Supreme Court':
    p('Bổ nhiệm Tổng Kế toán trưởng làm Kế toán viên của Tòa án Tối cao',
      'การแต่งตั้งผู้ตรวจเงินแผ่นดินใหญ่ให้เป็นผู้ทำบัญชีของศาลสูง',
      'Pengangkatan Akuntan Jenderal sebagai Akuntan Mahkamah Agung',
      'Pelantikan Ketua Akauntan sebagai Akauntan Mahkamah Agung'),
  'Appointment of Collector of Land Revenue':
    p('Bổ nhiệm Viên chức Thu Thuế Đất',
      'การแต่งตั้งพนักงานจัดเก็บรายได้ที่ดิน',
      'Pengangkatan Pemungut Hasil Tanah',
      'Pelantikan Pemungut Hasil Tanah'),
  'Appointment of Collectors of Land Revenue':
    p('Bổ nhiệm các Viên chức Thu Thuế Đất',
      'การแต่งตั้งพนักงานจัดเก็บรายได้ที่ดิน',
      'Pengangkatan para Pemungut Hasil Tanah',
      'Pelantikan Pemungut-pemungut Hasil Tanah'),
  'Appointment of Commissioner, Deputy Commissioners and Assistant Commissioners for the Maintenance of Parents':
    p('Bổ nhiệm Ủy viên, Phó Ủy viên và Trợ lý Ủy viên về Nuôi dưỡng Cha mẹ',
      'การแต่งตั้งกรรมการ รองกรรมการ และผู้ช่วยกรรมการด้านการเลี้ยงดูบิดามารดา',
      'Pengangkatan Komisaris, Wakil Komisaris dan Asisten Komisaris untuk Pemeliharaan Orang Tua',
      'Pelantikan Pesuruhjaya, Timbalan Pesuruhjaya dan Penolong Pesuruhjaya bagi Penyelenggaraan Ibu Bapa'),
  'Appointment of Competent Authority':
    p('Bổ nhiệm Cơ quan có thẩm quyền',
      'การแต่งตั้งหน่วยงานผู้มีอำนาจ',
      'Pengangkatan Otoritas Berwenang',
      'Pelantikan Pihak Berkuasa Kompeten'),
  'Appointment of Deputy Registrar':
    p('Bổ nhiệm Phó Đăng ký viên',
      'การแต่งตั้งรองนายทะเบียน',
      'Pengangkatan Wakil Pendaftar',
      'Pelantikan Timbalan Pendaftar'),
  'Appointment of Deputy Registrars':
    p('Bổ nhiệm các Phó Đăng ký viên',
      'การแต่งตั้งรองนายทะเบียน',
      'Pengangkatan para Wakil Pendaftar',
      'Pelantikan Timbalan-timbalan Pendaftar'),
  'Appointment of Director, Deputy and Assistant Directors of Sewerage and Drainage':
    p('Bổ nhiệm Giám đốc, Phó Giám đốc và Trợ lý Giám đốc Hệ thống Cống rãnh và Thoát nước',
      'การแต่งตั้งผู้อำนวยการ รองผู้อำนวยการ และผู้ช่วยผู้อำนวยการด้านระบบท่อระบายน้ำและการระบายน้ำ',
      'Pengangkatan Direktur, Wakil Direktur dan Asisten Direktur Bidang Saluran Pembuangan dan Drainase',
      'Pelantikan Pengarah, Timbalan Pengarah dan Penolong Pengarah bagi Pembetungan dan Saliran'),
  'Appointment of Directors':
    p('Bổ nhiệm các Giám đốc',
      'การแต่งตั้งกรรมการ',
      'Pengangkatan Direktur',
      'Pelantikan Pengarah'),
  'Appointment of Licensing Officer':
    p('Bổ nhiệm Viên chức Cấp phép',
      'การแต่งตั้งเจ้าหน้าที่ออกใบอนุญาต',
      'Pengangkatan Pejabat Perizinan',
      'Pelantikan Pegawai Pelesenan'),
  'Appointment of Members of the Pensions Appeal Tribunal':
    p('Bổ nhiệm các Thành viên của Tòa án Phúc thẩm về Lương hưu',
      'การแต่งตั้งสมาชิกของศาลอุทธรณ์ด้านบำเหน็จบำนาญ',
      'Pengangkatan Anggota Tribunal Banding Pensiun',
      'Pelantikan Ahli Tribunal Rayuan Pencen'),
  'Appointment of Pensions Officers':
    p('Bổ nhiệm các Viên chức Lương hưu',
      'การแต่งตั้งเจ้าหน้าที่บำเหน็จบำนาญ',
      'Pengangkatan Pejabat Pensiun',
      'Pelantikan Pegawai Pencen'),
  'Appointment of Registrar and Deputy Registrar of Manufacturers':
    p('Bổ nhiệm Đăng ký viên và Phó Đăng ký viên về Nhà sản xuất',
      'การแต่งตั้งนายทะเบียนและรองนายทะเบียนผู้ผลิต',
      'Pengangkatan Pendaftar dan Wakil Pendaftar Produsen',
      'Pelantikan Pendaftar dan Timbalan Pendaftar Pengilang'),
  'Appointment of Registrar of Patents':
    p('Bổ nhiệm Đăng ký viên Bằng sáng chế',
      'การแต่งตั้งนายทะเบียนสิทธิบัตร',
      'Pengangkatan Pendaftar Paten',
      'Pelantikan Pendaftar Paten'),
  'Appointment of Registrar of Supreme Court to Exercise Jurisdiction in Summonses-in-Chambers':
    p('Bổ nhiệm Đăng ký viên Tòa án Tối cao thực hiện thẩm quyền đối với đơn triệu tập xét tại phiên họp kín',
      'การแต่งตั้งนายทะเบียนศาลสูงให้ใช้อำนาจในคำร้องที่พิจารณาในห้องพิจารณาคดี',
      'Pengangkatan Panitera Mahkamah Agung untuk Menjalankan Yurisdiksi atas Permohonan di Ruang Tertutup',
      'Pelantikan Pendaftar Mahkamah Agung untuk Menjalankan Bidang Kuasa bagi Saman dalam Kamar'),
  'Appointment of Superintendents of Prisons':
    p('Bổ nhiệm các Giám thị Trại giam',
      'การแต่งตั้งผู้บัญชาการเรือนจำ',
      'Pengangkatan Pengawas Lembaga Pemasyarakatan',
      'Pelantikan Penguasa Penjara'),
  'Appointment of Supervision Officers':
    p('Bổ nhiệm các Viên chức Giám sát',
      'การแต่งตั้งเจ้าหน้าที่ควบคุมดูแล',
      'Pengangkatan Pejabat Pengawasan',
      'Pelantikan Pegawai Penyeliaan'),

  // ── 认可 / 指定 / 转授 ─────────────────────────────────
  'Approved Hospitals and Medical Institutions':
    p('Bệnh viện và Cơ sở Y tế được Công nhận',
      'โรงพยาบาลและสถานพยาบาลที่ได้รับอนุมัติ',
      'Rumah Sakit dan Institusi Medis yang Disetujui',
      'Hospital dan Institusi Perubatan yang Diluluskan'),
  'Approved Institution':
    p('Cơ sở được Công nhận',
      'สถาบันที่ได้รับอนุมัติ',
      'Institusi yang Disetujui',
      'Institusi yang Diluluskan'),
  'Approved Tertiary Institution':
    p('Cơ sở Giáo dục Đại học được Công nhận',
      'สถาบันอุดมศึกษาที่ได้รับอนุมัติ',
      'Institusi Pendidikan Tinggi yang Disetujui',
      'Institusi Pengajian Tinggi yang Diluluskan'),
  'Assignment of Function to Land Transport Authority of Singapore':
    p('Chuyển giao Chức năng cho Cơ quan Giao thông Đường bộ Singapore',
      'การมอบหมายหน้าที่ให้แก่องค์การขนส่งทางบกสิงคโปร์',
      'Pelimpahan Fungsi kepada Otoritas Transportasi Darat Singapura',
      'Penyerahan Fungsi kepada Lembaga Pengangkutan Darat Singapura'),
  'Assignment of Function to Maritime and Port Authority of Singapore':
    p('Chuyển giao Chức năng cho Cơ quan Hàng hải và Cảng vụ Singapore',
      'การมอบหมายหน้าที่ให้แก่องค์การทางทะเลและท่าเรือสิงคโปร์',
      'Pelimpahan Fungsi kepada Otoritas Maritim dan Pelabuhan Singapura',
      'Penyerahan Fungsi kepada Lembaga Maritim dan Pelabuhan Singapura'),
  'Assignment of Function to Singapore Land Authority':
    p('Chuyển giao Chức năng cho Cơ quan Quản lý Đất đai Singapore',
      'การมอบหมายหน้าที่ให้แก่องค์การที่ดินสิงคโปร์',
      'Pelimpahan Fungsi kepada Otoritas Pertanahan Singapura',
      'Penyerahan Fungsi kepada Lembaga Tanah Singapura'),
  'Assignment of Functions to National Environment Agency':
    p('Chuyển giao các Chức năng cho Cơ quan Môi trường Quốc gia',
      'การมอบหมายหน้าที่ให้แก่หน่วยงานสิ่งแวดล้อมแห่งชาติ',
      'Pelimpahan Fungsi kepada Badan Lingkungan Nasional',
      'Penyerahan Fungsi kepada Agensi Alam Sekitar Kebangsaan'),
  'Designation of Authorised Persons':
    p('Chỉ định các Cá nhân được Ủy quyền',
      'การกำหนดบุคคลผู้ได้รับอนุญาต',
      'Penunjukan Orang yang Berwenang',
      'Penetapan Orang yang Diberi Kuasa'),

  // ── 宣告 / 指示 / 撤销 ─────────────────────────────────
  'Application of Section 75 to Foreign States':
    p('Áp dụng Điều 75 đối với các Quốc gia nước ngoài',
      'การใช้บังคับมาตรา 75 ต่อรัฐต่างประเทศ',
      'Penerapan Pasal 75 terhadap Negara Asing',
      'Penggunaan Seksyen 75 terhadap Negara Asing'),
  'Bukit Gombak Camp declared to be an Installation':
    p('Trại Bukit Gombak được tuyên bố là Cơ sở Quân sự',
      'ค่ายบูกิตกอมบักได้รับการประกาศให้เป็นฐานทัพ',
      'Kamp Bukit Gombak Dinyatakan sebagai Instalasi',
      'Kem Bukit Gombak Diisytiharkan sebagai Instalasi'),
  'Cancellation of Approved Home Certificate of Appointment':
    p('Hủy bỏ Giấy chứng nhận Bổ nhiệm của Nhà Dưỡng lão được Công nhận',
      'การเพิกถอนหนังสือรับรองการแต่งตั้งของบ้านพักคนชราที่ได้รับอนุมัติ',
      'Pencabutan Sertifikat Pengangkatan Panti Wreda yang Disetujui',
      'Pembatalan Sijil Pelantikan Rumah Orang Tua yang Diluluskan'),
  'Cancellation of Direction under Section 19(1)(d)':
    p('Hủy bỏ Chỉ thị theo Điều 19(1)(d)',
      'การเพิกถอนคำแนะนำตามมาตรา 19(1)(d)',
      'Pencabutan Arahan berdasarkan Pasal 19(1)(d)',
      'Pembatalan Arahan di bawah Seksyen 19(1)(d)'),
  'Cancellation of Direction under Section 27(1)(d)':
    p('Hủy bỏ Chỉ thị theo Điều 27(1)(d)',
      'การเพิกถอนคำแนะนำตามมาตรา 27(1)(d)',
      'Pencabutan Arahan berdasarkan Pasal 27(1)(d)',
      'Pembatalan Arahan di bawah Seksyen 27(1)(d)'),
  'Cancellation of Directions under Section 27(1)(d)':
    p('Hủy bỏ các Chỉ thị theo Điều 27(1)(d)',
      'การเพิกถอนคำแนะนำตามมาตรา 27(1)(d)',
      'Pencabutan Arahan-arahan berdasarkan Pasal 27(1)(d)',
      'Pembatalan Arahan-arahan di bawah Seksyen 27(1)(d)'),
  'Cessation of Auxiliary Police Force':
    p('Chấm dứt Lực lượng Cảnh sát Bổ trợ',
      'การยุติกำลังตำรวจเสริม',
      'Penghentian Pasukan Polisi Auxiliary',
      'Pemberhentian Pasukan Polis Bantuan'),
  'Cessation of Auxiliary Police Forces':
    p('Chấm dứt các Lực lượng Cảnh sát Bổ trợ',
      'การยุติกำลังตำรวจเสริม',
      'Penghentian Pasukan-pasukan Polisi Auxiliary',
      'Pemberhentian Pasukan-pasukan Polis Bantuan'),
  'Creation of PSA Corporation Auxiliary Police Force':
    p('Thành lập Lực lượng Cảnh sát Bổ trợ của Tổng công ty PSA',
      'การจัดตั้งกำลังตำรวจเสริมของบรรษัท PSA',
      'Pembentukan Pasukan Polisi Auxiliary Perusahaan PSA',
      'Penubuhan Pasukan Polis Bantuan Perbadanan PSA'),
  'Declaration of Designated Development Areas':
    p('Tuyên bố về các Khu Phát triển được Chỉ định',
      'การประกาศเขตพัฒนาที่กำหนด',
      'Deklarasi Kawasan Pembangunan yang Ditetapkan',
      'Perisytiharan Kawasan Pembangunan yang Ditentukan'),
  'Declaration That Persons Employed by Statutory Boards Are Not Employees for Purposes of Act':
    p('Tuyên bố rằng người làm việc cho các Ủy ban Pháp định không phải là người lao động theo mục đích của Luật',
      'การประกาศว่าบุคคลที่ได้รับการว่าจ้างโดยคณะกรรมการตามกฎหมายไม่ใช่ลูกจ้างตามวัตถุประสงค์ของพระราชบัญญัติ',
      'Deklarasi bahwa orang yang dipekerjakan oleh Badan Statuter bukan pegawai untuk tujuan Undang-Undang',
      'Perisytiharan bahawa orang yang bekerja dengan Lembaga Berkanun bukan pekerja bagi tujuan Akta'),
  'Declaration under Section 12':
    p('Tuyên bố theo Điều 12',
      'การประกาศตามมาตรา 12',
      'Deklarasi berdasarkan Pasal 12',
      'Perisytiharan di bawah Seksyen 12'),
  'Declarations (Consolidation) in Respect of Automatic Public Level Crossings':
    p('Các Tuyên bố (Hợp nhất) về Đường ngang Công cộng Tự động',
      'การประกาศ (การรวมฉบับ) เกี่ยวกับทางข้ามระดับสาธารณะแบบอัตโนมัติ',
      'Deklarasi (Konsolidasi) sehubungan dengan Perlintasan Sebidang Umum Otomatis',
      'Perisytiharan (Penyatuan) berkenaan Lintasan Sebidang Awam Automatik'),
  'Direction That Register of Criminals be Kept in Kuala Lumpur and Singapore':
    p('Chỉ thị rằng Sổ đăng ký Tội phạm được lưu giữ tại Kuala Lumpur và Singapore',
      'คำแนะนำว่าทะเบียนผู้กระทำผิดให้เก็บรักษาไว้ที่กัวลาลัมเปอร์และสิงคโปร์',
      'Arahan bahwa Daftar Pelaku Kejahatan disimpan di Kuala Lumpur dan Singapura',
      'Arahan bahawa Daftar Penjenayah dijaga di Kuala Lumpur dan Singapura'),
  'Directions under Section 27 (1)(d) — Consolidation':
    p('Các Chỉ thị theo Điều 27(1)(d) — Hợp nhất',
      'คำแนะนำตามมาตรา 27(1)(d) — การรวมฉบับ',
      'Arahan-arahan berdasarkan Pasal 27(1)(d) — Konsolidasi',
      'Arahan-arahan di bawah Seksyen 27(1)(d) — Penyatuan'),

  // ── 豁免 / 权力 ────────────────────────────────────────
  'Exemption from Estate Duty — Toyota Motor Credit Corporation':
    p('Miễn Thuế Di sản Thừa kế — Toyota Motor Credit Corporation',
      'การยกเว้นภาษีมรดก — Toyota Motor Credit Corporation',
      'Pembebasan dari Bea Warisan — Toyota Motor Credit Corporation',
      'Pengecualian daripada Duti Harta Pusaka — Toyota Motor Credit Corporation'),
  'Exemption from Section 4A(1) and (2)':
    p('Miễn trừ Điều 4A(1) và (2)',
      'การยกเว้นมาตรา 4A(1) และ (2)',
      'Pembebasan dari Pasal 4A(1) dan (2)',
      'Pengecualian daripada Seksyen 4A(1) dan (2)'),
  'Exemption of Government and Port of Singapore Authority Vessels':
    p('Miễn trừ đối với tàu của Chính phủ và Cảng vụ Singapore',
      'การยกเว้นสำหรับเรือของรัฐบาลและองค์การท่าเรือสิงคโปร์',
      'Pembebasan bagi Kapal Pemerintah dan Otoritas Pelabuhan Singapura',
      'Pengecualian bagi Kapal Kerajaan dan Lembaga Pelabuhan Singapura'),
  'Delegation of Powers':
    p('Phân cấp Thẩm quyền',
      'การมอบอำนาจ',
      'Pelimpahan Kewenangan',
      'Perwakilan Kuasa'),
  'Authority to Grant Sanctions to Prosecute':
    p('Thẩm quyền Cấp Phép Truy tố',
      'อำนาจในการให้ความเห็นชอบการฟ้องคดี',
      'Kewenangan Memberikan Persetujuan Penuntutan',
      'Kuasa untuk Memberikan Kebenaran Mendakwa'),
  'Authorisation to Extend Expired Certificates':
    p('Ủy quyền Gia hạn các Chứng chỉ đã Hết hạn',
      'การอนุญาตให้ขยายเวลาหนังสือรับรองที่หมดอายุแล้ว',
      'Otorisasi untuk Memperpanjang Sertifikat yang Telah Kedaluwarsa',
      'Kebenaran untuk Melanjutkan Sijil yang Telah Luput'),
  'Authorised Officers':
    p('Các Viên chức được Ủy quyền',
      'เจ้าหน้าที่ผู้ได้รับอนุญาต',
      'Pejabat yang Berwenang',
      'Pegawai yang Diberi Kuasa'),
  'Deputy Registrar to Exercise Powers of Registrar':
    p('Phó Đăng ký viên Thực hiện Quyền hạn của Đăng ký viên',
      'รองนายทะเบียนใช้อำนาจของนายทะเบียน',
      'Wakil Pendaftar untuk Menjalankan Kewenangan Pendaftar',
      'Timbalan Pendaftar untuk Menjalankan Kuasa Pendaftar'),

  // ── 议会决议 ───────────────────────────────────────────
  'Civil List and Gratuity Act 1970 — Resolution Passed at Parliament Meeting':
    p('Luật Danh sách Dân sự và Trợ cấp 1970 — Nghị quyết được Thông qua tại Phiên họp Nghị viện',
      'พระราชบัญญัติบัญชีรายจ่ายพลเรือนและเงินบำเหน็จ 1970 — ข้อมติที่ผ่านการลงมติในการประชุมรัฐสภา',
      'Undang-Undang Daftar Sipil dan Gratifikasi 1970 — Resolusi yang Disahkan pada Rapat Parlemen',
      'Akta Senarai Sivil dan Gratuiti 1970 — Resolusi yang Diluluskan pada Mesyuarat Parlimen'),
  'Civil List and Pension Act - Resolution Passed':
    p('Luật Danh sách Dân sự và Lương hưu — Nghị quyết được Thông qua',
      'พระราชบัญญัติบัญชีรายจ่ายพลเรือนและบำเหน็จบำนาญ — ข้อมติที่ผ่านการลงมติ',
      'Undang-Undang Daftar Sipil dan Pensiun — Resolusi yang Disahkan',
      'Akta Senarai Sivil dan Pencen — Resolusi yang Diluluskan'),
  'Civil List and Pension Act — Resolution Passed':
    p('Luật Danh sách Dân sự và Lương hưu — Nghị quyết được Thông qua',
      'พระราชบัญญัติบัญชีรายจ่ายพลเรือนและบำเหน็จบำนาญ — ข้อมติที่ผ่านการลงมติ',
      'Undang-Undang Daftar Sipil dan Pensiun — Resolusi yang Disahkan',
      'Akta Senarai Sivil dan Pencen — Resolusi yang Diluluskan'),
  'Civil List and Pension Act — Resolution Passed At Parliament Meeting':
    p('Luật Danh sách Dân sự và Lương hưu — Nghị quyết được Thông qua tại Phiên họp Nghị viện',
      'พระราชบัญญัติบัญชีรายจ่ายพลเรือนและบำเหน็จบำนาญ — ข้อมติที่ผ่านการลงมติในการประชุมรัฐสภา',
      'Undang-Undang Daftar Sipil dan Pensiun — Resolusi yang Disahkan pada Rapat Parlemen',
      'Akta Senarai Sivil dan Pencen — Resolusi yang Diluluskan pada Mesyuarat Parlimen'),

  // ── 宪制 / 协定 / 条例 ─────────────────────────────────
  'Constitution of the Republic of Singapore':
    p('Hiến pháp Cộng hòa Singapore',
      'รัฐธรรมนูญแห่งสาธารณรัฐสิงคโปร์',
      'Konstitusi Republik Singapura',
      'Perlembagaan Republik Singapura'),
  'Independence of Singapore Agreement 1965':
    p('Hiệp định Độc lập Singapore 1965',
      'ความตกลงว่าด้วยเอกราชของสิงคโปร์ 1965',
      'Perjanjian Kemerdekaan Singapura 1965',
      'Perjanjian Kemerdekaan Singapura 1965'),
  'Ngee Ann Kongsi (Incorporation) Ordinance 1933':
    p('Pháp lệnh Ngee Ann Kongsi (Thành lập) 1933',
      'ข้อบัญญัติ Ngee Ann Kongsi (การจดทะเบียน) 1933',
      'Ordonansi Ngee Ann Kongsi (Pendirian) 1933',
      'Ordinan Ngee Ann Kongsi (Penubuhan) 1933'),

  // ── 船舶 / 港务 / 危险货物 ─────────────────────────────
  'Anchorages and Fairways':
    p('Bến đậu và Luồng lạch',
      'ที่ทอดสมอและร่องน้ำ',
      'Tempat Berlabuh dan Alur Pelayaran',
      'Tempat Berlabuh dan Alur Pelayaran'),
  'Landing Place for Dangerous Goods (S.p.c. Pte. Ltd.)':
    p('Địa điểm Bốc dỡ Hàng nguy hiểm (S.p.c. Pte. Ltd.)',
      'ท่าขนถ่ายสินค้าอันตราย (S.p.c. Pte. Ltd.)',
      'Tempat Pendaratan Barang Berbahaya (S.p.c. Pte. Ltd.)',
      'Tempat Pendaratan Barang Berbahaya (S.p.c. Pte. Ltd.)'),

  // ── 财政 / 货币 / 税收 ─────────────────────────────────
  'Central Provident Fund Board to Receive and Collect Payroll Tax and Skills Development Levy':
    p('Ủy ban Quỹ Tiết kiệm Trung ương thu và nộp Thuế Tiền lương và Phí Phát triển Kỹ năng',
      'คณะกรรมการกองทุนสำรองเลี้ยงชีพกลางรับและจัดเก็บภาษีเงินเดือนและค่าธรรมเนียมการพัฒนาทักษะ',
      'Dewan Dana Simpanan Wajib Pusat untuk Menerima dan Memungut Pajak Gaji dan Retribusi Pengembangan Keterampilan',
      'Lembaga Dana Simpanan Wajib Pusat untuk Menerima dan Memungut Cukai Gaji dan Levi Pembangunan Kemahiran'),
  'Auditor-General to Audit Accounts':
    p('Tổng Kiểm toán thực hiện Kiểm toán Tài khoản',
      'ผู้ตรวจเงินแผ่นดินตรวจสอบบัญชี',
      'Auditor Jenderal untuk Mengaudit Rekening',
      'Ketua Audit untuk Mengaudit Akaun'),
  'Commissioner of Lands to Direct Proceedings':
    p('Ủy viên Đất đai Chỉ đạo Tố tụng',
      'ข้าหลวงที่ดินเป็นผู้สั่งการดำเนินคดี',
      'Komisaris Pertanahan untuk Mengarahkan Proses Hukum',
      'Pesuruhjaya Tanah untuk Mengarahkan Prosiding'),
  'Commissioner of Public Health to be Director of Food Administration':
    p('Ủy viên Y tế Công cộng giữ chức Giám đốc Cơ quan Quản lý Thực phẩm',
      'ข้าหลวงสาธารณสุขเป็นผู้อำนวยการสำนักบริหารอาหาร',
      'Komisaris Kesehatan Masyarakat menjadi Direktur Administrasi Pangan',
      'Pesuruhjaya Kesihatan Awam menjadi Pengarah Pentadbiran Makanan'),
  'Interest Rate on Money Lodged in Court':
    p('Lãi suất đối với Tiền gửi tại Tòa án',
      'อัตราดอกเบี้ยของเงินที่ฝากไว้ที่ศาล',
      'Suku Bunga atas Uang yang Disimpan di Pengadilan',
      'Kadar Faedah bagi Wang yang Didepositkan di Mahkamah'),
  'Malaysian and Brunei Darussalam Currency to Be Bills':
    p('Tiền tệ Malaysia và Brunei Darussalam được Chuyển thành Giấy bạc',
      'สกุลเงินมาเลเซียและบรูไนดารุสซาลามให้เป็นธนบัตร',
      'Mata Uang Malaysia dan Brunei Darussalam menjadi Uang Kertas',
      'Mata Wang Malaysia dan Brunei Darussalam menjadi Wang Kertas'),
  'Countervailing and Anti-Dumping Duties (Expedited Review of Anti-Dumping Duties) Determination 2000':
    p('Quyết định về Thuế Đối kháng và Thuế Chống bán phá giá (Xem xét Nhanh Thuế Chống bán phá giá) 2000',
      'คำวินิจฉัยเรื่องภาษีตอบโต้การอุดหนุนและภาษีตอบโต้การทุ่มตลาด (การทบทวนภาษีตอบโต้การทุ่มตลาดแบบเร่งด่วน) 2000',
      'Ketetapan Bea Imbalan dan Bea Anti-Dumping (Tinjauan Dipercepat atas Bea Anti-Dumping) 2000',
      'Ketentuan Duti Imbangan dan Duti Anti-Lambakan (Semakan Dipercepat bagi Duti Anti-Lambakan) 2000'),

  // ── 治安 / 监管 / 羁押 ─────────────────────────────────
  'Extradition (Commonwealth Territories) Declaration 2007':
    p('Tuyên bố Dẫn độ (Các Lãnh thổ Khối Thịnh vượng chung) 2007',
      'การประกาศการส่งผู้ร้ายข้ามแดน (ดินแดนเครือจักรภพ) 2007',
      'Deklarasi Ekstradisi (Wilayah Persemakmuran) 2007',
      'Perisytiharan Ekstradisi (Wilayah Komanwel) 2007'),
  'Immigration Officers':
    p('Các Viên chức Nhập cư',
      'เจ้าหน้าที่ตรวจคนเข้าเมือง',
      'Pejabat Imigrasi',
      'Pegawai Imigresen'),
  'Chief Controller and Controllers':
    p('Tổng Kiểm soát viên và các Kiểm soát viên',
      'หัวหน้าผู้ควบคุมและผู้ควบคุม',
      'Kepala Pengendali dan Para Pengendali',
      'Ketua Pengawal dan Pengawal-pengawal'),
  'Investigation Unit, Central Manpower Base Ceased to Be Auxiliary Police Force':
    p('Đơn vị Điều tra, Căn cứ Nhân lực Trung ương không còn là Lực lượng Cảnh sát Bổ trợ',
      'หน่วยสืบสวน ฐานกำลังพลกลาง ยุติการเป็นกำลังตำรวจเสริม',
      'Unit Investigasi, Pangkalan Tenaga Kerja Pusat Berhenti Menjadi Pasukan Polisi Auxiliary',
      'Unit Siasatan, Pangkalan Tenaga Kerja Pusat Berhenti Menjadi Pasukan Polis Bantuan'),
  'Officers to Whom Persons Subject to Police Supervision Shall Report':
    p('Các Viên chức mà người chịu sự Giám sát của Cảnh sát phải Trình diện',
      'เจ้าหน้าที่ที่บุคคลซึ่งอยู่ภายใต้การควบคุมดูแลของตำรวจต้องรายงานตัว',
      'Pejabat yang Kepadanya Orang yang Tunduk pada Pengawasan Polisi Harus Melapor',
      'Pegawai yang Kepadanya Orang yang Tertakluk pada Penyeliaan Polis Mesti Melapor'),
  'List of Touts':
    p('Danh sách Người Môi giới Chèo kéo',
      'รายชื่อผู้ชักชวนลูกค้า',
      'Daftar Calo',
      'Senarai Tukang Temberang'),
  'Place of Detention':
    p('Nơi Giam giữ',
      'สถานที่กักขัง',
      'Tempat Penahanan',
      'Tempat Tahanan'),
  'Mental Hospitals':
    p('Bệnh viện Tâm thần',
      'โรงพยาบาลจิตเวช',
      'Rumah Sakit Jiwa',
      'Hospital Mental'),
  'Instruments and Appliances for Gaming':
    p('Dụng cụ và Thiết bị dùng cho Trò chơi Cá cược',
      'เครื่องมือและอุปกรณ์สำหรับการพนัน',
      'Instrumen dan Peralatan untuk Perjudian',
      'Instrumen dan Perkakas untuk Perjudian'),
  'Occupier Or Owner of Industrial Premises to Appoint Fire Safety Managers':
    p('Người Chiếm hữu hoặc Chủ sở hữu Cơ sở Công nghiệp phải Bổ nhiệm Cán bộ Quản lý An toàn Cháy nổ',
      'ผู้ครอบครองหรือเจ้าของสถานประกอบการอุตสาหกรรมต้องแต่งตั้งผู้จัดการความปลอดภัยอัคคีภัย',
      'Penghuni atau Pemilik Tempat Usaha Industri untuk Mengangkat Manajer Keselamatan Kebakaran',
      'Penghuni atau Pemilik Premis Perindustrian untuk Melantik Pengurus Keselamatan Kebakaran'),

  // ── 军事演习 ───────────────────────────────────────────
  'Military Manoeuvres (Firing Ground) Proclamation':
    p('Tuyên bố Diễn tập Quân sự (Trường Bắn)',
      'การประกาศการซ้อมรบ (สนามยิงปืน)',
      'Proklamasi Manuver Militer (Lapangan Tembak)',
      'Proklamasi Manuver Tentera (Padang Tembak)'),
  'Military Manoeuvres (Firing Ground) Proclamation 2018':
    p('Tuyên bố Diễn tập Quân sự (Trường Bắn) 2018',
      'การประกาศการซ้อมรบ (สนามยิงปืน) 2018',
      'Proklamasi Manuver Militer (Lapangan Tembak) 2018',
      'Proklamasi Manuver Tentera (Padang Tembak) 2018'),
  'Military Manoeuvres (Firing Grounds) (Consolidation) Proclamation':
    p('Tuyên bố Diễn tập Quân sự (Các Trường Bắn) (Hợp nhất)',
      'การประกาศการซ้อมรบ (สนามยิงปืน) (การรวมฉบับ)',
      'Proklamasi Manuver Militer (Lapangan-lapangan Tembak) (Konsolidasi)',
      'Proklamasi Manuver Tentera (Padang-padang Tembak) (Penyatuan)'),
  'Military Manoeuvres (Firing Grounds) (Consolidation) Proclamations':
    p('Các Tuyên bố Diễn tập Quân sự (Các Trường Bắn) (Hợp nhất)',
      'การประกาศการซ้อมรบ (สนามยิงปืน) (การรวมฉบับ)',
      'Proklamasi-proklamasi Manuver Militer (Lapangan-lapangan Tembak) (Konsolidasi)',
      'Proklamasi-proklamasi Manuver Tentera (Padang-padang Tembak) (Penyatuan)'),
  'Military Manoeuvres (Manoeuvring Grounds) (Consolidation) Proclamations':
    p('Các Tuyên bố Diễn tập Quân sự (Các Thao trường) (Hợp nhất)',
      'การประกาศการซ้อมรบ (พื้นที่ซ้อมรบ) (การรวมฉบับ)',
      'Proklamasi-proklamasi Manuver Militer (Lapangan Manuver) (Konsolidasi)',
      'Proklamasi-proklamasi Manuver Tentera (Padang Manuver) (Penyatuan)'),
  'National Cadet Corps under the Command of Singapore Armed Forces Educational Centre':
    p('Đoàn Thiếu sinh Quân Quốc gia dưới Quyền Chỉ huy của Trung tâm Giáo dục Lực lượng Vũ trang Singapore',
      'กองกำลังนักเรียนนายร้อยแห่งชาติภายใต้การบังคับบัญชาของศูนย์การศึกษากองทัพสิงคโปร์',
      'Korps Kadet Nasional di bawah Komando Pusat Pendidikan Angkatan Bersenjata Singapura',
      'Kor Kadet Kebangsaan di bawah Pemerintahan Pusat Pendidikan Angkatan Tentera Singapura'),

  // ── 其他 ───────────────────────────────────────────────
  'Highway (Revision No. 2) Code 2019':
    p('Bộ luật Đường cao tốc (Sửa đổi Số 2) 2019',
      'ประมวลข้อกำหนดทางหลวง (การแก้ไขครั้งที่ 2) 2019',
      'Kode Jalan Raya (Revisi No. 2) 2019',
      'Kod Lebuh Raya (Semakan No. 2) 2019'),
};

module.exports = { M, BY_ID, ACT };
