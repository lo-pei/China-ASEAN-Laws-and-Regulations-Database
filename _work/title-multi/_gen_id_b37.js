// b37：ID 长标题族「PENCABUTAN PERATURAN PEMERINTAH …」（撤销政府条例）17 条全收官。
// 该族 17 条此前五语全空。
//
// 句式：
//   zh  撤销{年}年第{号}号关于{主题}的{文书}
//   en  Law on the Revocation of {instrument} No. {号} of {年} on {主题}
//   vi  Luật về Việc Bãi bỏ {instrument} số {号} năm {年} về {主题}
//   th  พระราชบัญญัติว่าด้วยการเพิกถอน{instrument}ฉบับที่ {号} ปี {年} ว่าด้วย{主题}
//   ms  Akta tentang Pembatalan {instrument} No. {号} Tahun {年} tentang {主题}
//
// 三处必须逐条核对，不能按标题头套：
//   ① ID-H1101 一次撤销 3 份（70/1992 商业银行、71/1992 乡村信贷银行、72/1992 利润分享原则银行），
//      标题在 110 字符处截断，第三份只见于 Pasal 1 第 c 项；
//   ② ID-H2890 一次撤销 2 份（34/1991 专利申请程序、11/1993 专利证书形式与内容）；
//   ③ ID-H1227 带「 sebagaimana telah beberapa kali diubah terakhir dengan PP 48/2000」，作括注保留。
//   另 ID-H1101 的第 a 项自身带「经 73/1998 最近修改」，同作括注，不并入文书名。
'use strict';
const fs = require('fs');
const path = require('path');

const INS = {
  pp: { zh: '政府条例', en: 'Government Regulation', vi: 'Quy định của Chính phủ', th: 'กฎระเบียบรัฐบาล', ms: 'Peraturan Pemerintah' },
  perppu: { zh: '代替法律的政府条例', en: 'Government Regulation in Lieu of Law', vi: 'Quy định của Chính phủ thay thế Luật', th: 'กฎระเบียบรัฐบาลแทนกฎหมาย', ms: 'Peraturan Pemerintah Pengganti Undang-Undang' },
};

// 单份文书
function one(kind, no, year, s) {
  const i = INS[kind];
  return {
    zh: `${year}年第${no}号关于${s.zh}的${i.zh}`,
    en: `${i.en} No. ${no} of ${year} on ${s.en}`,
    vi: `${i.vi} số ${no} năm ${year} về ${s.vi}`,
    th: `${i.th}ฉบับที่ ${no} ปี ${year} ว่าด้วย${s.th}`,
    ms: `${i.ms} No. ${no} Tahun ${year} tentang ${s.ms}`,
  };
}

const JOIN = {
  zh: (a) => a.length === 1 ? a[0] : a.slice(0, -1).join('、') + '及' + a[a.length - 1],
  en: (a) => a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1],
  vi: (a) => a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' và ' + a[a.length - 1],
  th: (a) => a.length === 1 ? a[0] : a.slice(0, -1).join(' ') + ' และ' + a[a.length - 1],
  ms: (a) => a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1],
};

// parts: [[kind, no, year, subject, suffix?], ...]；suffix 为「最近经修改」类从句
function FR(parts) {
  const out = {};
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    const seg = parts.map(([kind, no, year, s, sfx]) => one(kind, no, year, s)[k] + (sfx ? sfx[k] : ''));
    out[k] = (k === 'zh' ? '撤销' : {
      en: 'Law on the Revocation of ',
      vi: 'Luật về Việc Bãi bỏ ',
      th: 'พระราชบัญญัติว่าด้วยการเพิกถอน',
      ms: 'Akta tentang Pembatalan ',
    }[k]) + JOIN[k](seg);
  }
  return out;
}

const ROWS = [
  ['ID-H1373', [['pp', 25, 1993, {
    zh: '洛克南塔国家公司改制为公营有限公司及洛克南塔国家公司解散',
    en: 'the Conversion of the State Company Lokananta into a State-Owned Limited Liability Company (PERSERO) and the Dissolution of the State Company Lokananta',
    vi: 'Việc Chuyển đổi Công ty Nhà nước Lokananta thành Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO) và Giải thể Công ty Nhà nước Lokananta',
    th: 'การเปลี่ยนรูปแบบบริษัทของรัฐโลกานันตาเป็นบริษัทจำกัดของรัฐ (PERSERO) และการยุบบริษัทของรัฐโลกานันตา',
    ms: 'Pengalihan Bentuk Perusahaan Negara Lokananta menjadi Syarikat Sendirian Berhad Milik Negara (PERSERO) dan Pembubaran Perusahaan Negara Lokananta',
  }]]],
  ['ID-H1227', [['pp', 98, 1999, {
    zh: '将财政部长作为公营公司与部分国有股份有限责任公司股东大会或股东的职位、任务与权限移交国家投资与国营企业培育部长',
    en: 'the Transfer of the Position, Duties and Authority of the Minister of Finance as the General Meeting of Shareholders or Shareholder in State-Owned Limited Liability Companies (PERSERO) and Limited Liability Companies Partly Owned by the State to the State Minister for Investment and the Development of State-Owned Enterprises',
    vi: 'Việc Chuyển giao Vị trí, Nhiệm vụ và Thẩm quyền của Bộ trưởng Tài chính với tư cách Đại hội đồng Cổ đông hoặc Cổ đông tại Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO) và Công ty Trách nhiệm Hữu hạn có một phần vốn Nhà nước cho Bộ trưởng Nhà nước phụ trách Đầu tư và Phát triển Doanh nghiệp Nhà nước',
    th: 'การโอนตำแหน่ง หน้าที่ และอำนาจของรัฐมนตรีว่าการกระทรวงการคลังในฐานะที่ประชุมผู้ถือหุ้นหรือผู้ถือหุ้นในบริษัทจำกัดของรัฐ (PERSERO) และบริษัทจำกัดที่มีหุ้นบางส่วนเป็นของรัฐให้แก่รัฐมนตรีประจำกระทรวงการลงทุนและการพัฒนารัฐวิสาหกิจ',
    ms: 'Pengalihan Kedudukan, Tugas dan Kewenangan Menteri Kewangan selaku Rapat Umum Pemegang Saham (RUPS) atau Pemegang Saham pada Syarikat Sendirian Berhad Milik Negara (PERSERO) dan Syarikat Sendirian Berhad yang Sebahagian Sahamnya Dimiliki oleh Negara kepada Menteri Negara Pelaburan dan Pembinaan Badan Usaha Milik Negara',
  }, {
    zh: '（最近经2000年第48号政府条例修改）',
    en: ' as last amended by Government Regulation No. 48 of 2000',
    vi: ' đã được sửa đổi lần cuối bởi Quy định của Chính phủ số 48 năm 2000',
    th: ' ซึ่งแก้ไขเพิ่มเติมครั้งล่าสุดโดยกฎระเบียบรัฐบาลฉบับที่ 48 ปี 2000',
    ms: ' sebagaimana telah diubah terakhir dengan Peraturan Pemerintah No. 48 Tahun 2000',
  }]]],
  ['ID-H1964', [['perppu', 4, 2009, {
    zh: '修改2002年第30号《腐败犯罪根除委员会法》',
    en: 'the Amendment to Law No. 30 of 2002 on the Corruption Eradication Commission',
    vi: 'Sửa đổi Luật số 30 năm 2002 về Ủy ban Xóa bỏ Tội phạm Tham nhũng',
    th: 'การแก้ไขเพิ่มเติมกฎหมายฉบับที่ 30 ปี 2002 ว่าด้วยคณะกรรมการปราบปรามอาชญากรรมทุจริต',
    ms: 'Pindaan kepada Undang-Undang No. 30 Tahun 2002 tentang Komisi Pemberantasan Tindak Pidana Korupsi',
  }]]],
  // 一次撤销 3 份：第三份（72/1992）标题已截断，只见于 Pasal 1 第 c 项
  ['ID-H1101', [
    ['pp', 70, 1992, {
      zh: '商业银行',
      en: 'Commercial Banks',
      vi: 'Ngân hàng Thương mại',
      th: 'ธนาคารพาณิชย์',
      ms: 'Bank Umum',
    }, {
      zh: '（最近经1998年第73号政府条例修改）',
      en: ' as last amended by Government Regulation No. 73 of 1998',
      vi: ' đã được sửa đổi lần cuối bởi Quy định của Chính phủ số 73 năm 1998',
      th: ' ซึ่งแก้ไขเพิ่มเติมครั้งล่าสุดโดยกฎระเบียบรัฐบาลฉบับที่ 73 ปี 1998',
      ms: ' sebagaimana telah diubah terakhir dengan Peraturan Pemerintah No. 73 Tahun 1998',
    }],
    ['pp', 71, 1992, {
      zh: '乡村信贷银行',
      en: 'Rural Credit Banks',
      vi: 'Ngân hàng Tín dụng Nông thôn',
      th: 'ธนาคารสินเชื่อชนบท',
      ms: 'Bank Perkreditan Rakyat',
    }],
    ['pp', 72, 1992, {
      zh: '利润分享原则银行',
      en: 'Banks Based on the Profit-Sharing Principle',
      vi: 'Ngân hàng Dựa trên Nguyên tắc Chia sẻ Lợi nhuận',
      th: 'ธนาคารตามหลักการแบ่งผลกำไร',
      ms: 'Bank Berdasarkan Prinsip Bagi Hasil',
    }],
  ]],
  ['ID-H2261', [['pp', 28, 2003, {
    zh: '公务员与养老金领取人医疗保险举办中的政府补贴与缴费',
    en: 'Government Subsidies and Contributions in the Provision of Health Insurance for Civil Servants and Pension Recipients',
    vi: 'Trợ cấp và Khoản đóng góp của Chính phủ trong Việc Cung cấp Bảo hiểm Y tế cho Công chức và Người nhận Lương hưu',
    th: 'เงินอุดหนุนและเงินสมทบของรัฐในการจัดให้มีประกันสุขภาพสำหรับข้าราชการและผู้รับบำนาญ',
    ms: 'Subsidi dan Iuran Pemerintah dalam Penyelenggaraan Asuransi Kesehatan bagi Pegawai Negeri Sipil dan Penerima Pencen',
  }]]],
  ['ID-H2470', [['perppu', 4, 2008, {
    zh: '金融体系安全网',
    en: 'the Financial System Safety Net',
    vi: 'Mạng lưới An toàn Hệ thống Tài chính',
    th: 'ตาข่ายความปลอดภัยของระบบการเงิน',
    ms: 'Jaring Pengaman Sistem Kewangan',
  }]]],
  ['ID-H514', [['pp', 33, 1985, {
    zh: '国立伊斯兰宗教学院组织纲要',
    en: 'the Main Organisation of the State Islamic Religious Institute',
    vi: 'Tổ chức Chính của Học viện Tôn giáo Hồi giáo Nhà nước',
    th: 'โครงสร้างหลักของสถาบันศาสนาอิสลามแห่งรัฐ',
    ms: 'Pokok-pokok Organisasi Institut Agama Islam Negeri',
  }]]],
  ['ID-H1226', [['pp', 33, 1997, {
    zh: '中央政府与地方之间土地与建筑物权利取得税收入的分配',
    en: 'the Sharing of Revenue from the Duty on the Acquisition of Rights over Land and Buildings between the Central Government and the Regions',
    vi: 'Việc Phân chia Nguồn thu từ Thuế Chuyển nhượng Quyền Đối với Đất đai và Nhà cửa giữa Chính quyền Trung ương và Địa phương',
    th: 'การแบ่งปันรายได้จากภาษีการได้มาซึ่งสิทธิในที่ดินและอาคารระหว่างรัฐบาลกลางและท้องถิ่น',
    ms: 'Pembahagian Hasil Penerimaan Duti Perolehan Hak atas Tanah dan Bangunan antara Pemerintah Pusat dan Daerah',
  }]]],
  ['ID-H1372', [['pp', 18, 1998, {
    zh: '印尼盾货币的输出与输入',
    en: 'the Export and Import of Rupiah Currency',
    vi: 'Việc Xuất khẩu hoặc Nhập khẩu Tiền tệ Rupiah',
    th: 'การนำออกหรือนำเข้าเงินตรารูเปียห์',
    ms: 'Pengeluaran atau Pemasukan Mata Uang Rupiah',
  }]]],
  ['ID-H1773', [['pp', 2, 2000, {
    zh: '印尼纯碱工业公司（PERSERO）并入盐业公司（PERSERO）',
    en: 'the Merger of PT Industri Soda Indonesia (PERSERO) into PT Garam (PERSERO)',
    vi: 'Việc Sáp nhập PT Industri Soda Indonesia (PERSERO) vào PT Garam (PERSERO)',
    th: 'การควบรวม PT Industri Soda Indonesia (PERSERO) เข้ากับ PT Garam (PERSERO)',
    ms: 'Penggabungan PT Industri Soda Indonesia (PERSERO) ke dalam PT Garam (PERSERO)',
  }]]],
  ['ID-H2260', [['pp', 11, 2000, {
    zh: '向莱塞斯纸业公司（PERSERO）增加国家资本参与',
    en: 'the Addition of State Capital Participation in PT Kertas Leces (PERSERO)',
    vi: 'Việc Bổ sung Vốn Góp Nhà nước vào PT Kertas Leces (PERSERO)',
    th: 'การเพิ่มทุนร่วมของรัฐใน PT Kertas Leces (PERSERO)',
    ms: 'Penambahan Penyertaan Modal Negara dalam PT Kertas Leces (PERSERO)',
  }]]],
  ['ID-H2262', [['pp', 69, 1991, {
    zh: '公务员、养老金领取人、退伍军人、独立先驱及其家属的医疗保健',
    en: 'the Health Care of Civil Servants, Pension Recipients, Veterans, Pioneers of Independence and Their Families',
    vi: 'Việc Chăm sóc Sức khỏe cho Công chức, Người nhận Lương hưu, Cựu quân nhân, Người Tiên phong Độc lập và Gia đình của họ',
    th: 'การดูแลสุขภาพของข้าราชการ ผู้รับบำนาญ ทหารผ่านศึก ผู้บุกเบิกเอกราชและครอบครัว',
    ms: 'Pemeliharaan Kesihatan Pegawai Negeri Sipil, Penerima Pencen, Veteran, Perintis Kemerdekaan berserta Keluarganya',
  }]]],
  ['ID-H2263', [['pp', 9, 1991, {
    zh: '疏浚公营公司（PERUM）改制为公营有限公司（PERSERO）',
    en: 'the Conversion of the Public Corporation (PERUM) for Dredging into a State-Owned Limited Liability Company (PERSERO)',
    vi: 'Việc Chuyển đổi Công ty Công ích (PERUM) Pengerukan thành Công ty Trách nhiệm Hữu hạn Nhà nước (PERSERO)',
    th: 'การเปลี่ยนรูปแบบรัฐวิสาหกิจ (PERUM) ด้านการขุดลอกเป็นบริษัทจำกัดของรัฐ (PERSERO)',
    ms: 'Pengalihan Bentuk Perusahaan Umum (PERUM) Pengerukan menjadi Syarikat Sendirian Berhad Milik Negara (PERSERO)',
  }]]],
  ['ID-H2363', [['pp', 98, 2013, {
    zh: '向国际橡胶联盟有限公司进行国家资本参与',
    en: 'the State Capital Participation in International Rubber Consortium Limited',
    vi: 'Việc Góp Vốn Nhà nước vào International Rubber Consortium Limited',
    th: 'การร่วมทุนของรัฐใน International Rubber Consortium Limited',
    ms: 'Penyertaan Modal Negara dalam International Rubber Consortium Limited',
  }]]],
  ['ID-H2889', [['pp', 27, 2004, {
    zh: '政府实施专利的程序',
    en: 'the Procedure for the Implementation of Patents by the Government',
    vi: 'Thủ tục Thực hiện Sáng chế của Chính phủ',
    th: 'ขั้นตอนการดำเนินการตามสิทธิบัตรโดยรัฐบาล',
    ms: 'Tata Cara Pelaksanaan Paten oleh Pemerintah',
  }]]],
  // 一次撤销 2 份
  ['ID-H2890', [
    ['pp', 34, 1991, {
      zh: '专利申请程序',
      en: 'the Procedure for Filing a Patent Application',
      vi: 'Thủ tục Yêu cầu Cấp Sáng chế',
      th: 'ขั้นตอนการยื่นคำขอสิทธิบัตร',
      ms: 'Tata Cara Permintaan Paten',
    }],
    ['pp', 11, 1993, {
      zh: '专利证书的形式与内容',
      en: 'the Form and Content of Patent Certificates',
      vi: 'Hình thức và Nội dung của Giấy chứng nhận Sáng chế',
      th: 'รูปแบบและเนื้อหาของหนังสือสิทธิบัตร',
      ms: 'Bentuk dan Isi Surat Paten',
    }],
  ]],
  ['ID-H2891', [['pp', 40, 2005, {
    zh: '专利上诉委员会的组织结构、任务与职能',
    en: 'the Organisational Structure, Duties and Functions of the Patent Appeal Commission',
    vi: 'Cơ cấu Tổ chức, Nhiệm vụ và Chức năng của Ủy ban Kháng nghị Sáng chế',
    th: 'โครงสร้างองค์กร หน้าที่ และภารกิจของคณะกรรมการอุทธรณ์สิทธิบัตร',
    ms: 'Susunan Organisasi, Tugas dan Fungsi Komisi Banding Paten',
  }]]],
];

const items = {};
const over = [];
for (const [id, parts] of ROWS) {
  const t = FR(parts);
  items[id] = t;
  for (const [k, v] of Object.entries(t)) if (v.length > 610) over.push(id + '/' + k + '=' + v.length);
}
const n = Object.keys(items).length;
if (n !== 17) throw new Error('条目数应为 17，实为 ' + n);
if (over.length) throw new Error('超长：' + over.join(', '));

const out = path.join(__dirname, '_id_b37.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b37', items, skip: [] }, null, 2), 'utf8');
const maxLen = Math.max(...Object.values(items).flatMap((t) => Object.values(t).map((x) => x.length)));
console.log('写入 ' + n + ' 条 → ' + out + '（最长 ' + maxLen + ' 字符）');
