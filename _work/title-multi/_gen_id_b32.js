// b32：ID 长标题族「PENETAPAN HARGA PATOKAN …」（基准价格的确定）23 条全收官。
// 该族 23 条此前五语全空。标题只有 8 种形态，全部为「PENETAPAN HARGA PATOKAN X」的定语变化，
// 故用单一帧 + 8 个定语槽合成，不逐条手写。
//
// 三条口径：
//   ① 标题尾部「_2」「_3」（ID-H3024 / ID-H3023 / ID-H3022）是入库去重后缀，不属法定标题，译名不带。
//   ② HPE（Harga Patokan Ekspor）/ HPP（Harga Patokan Petani）是标题自带的缩称，译名保留并就地展开一次。
//   ③ 「Bea Keluar」统一作「出口税」；「Pungutan Hasil Perikanan」是渔业产品征费，不作「税收」。
'use strict';
const fs = require('fs');
const path = require('path');

// 定语槽：obj 为「基准价格所针对的对象」，四语各自给完整介词短语
const FR = (o) => ({
  zh: o.zhFull || `${o.zh}基准价格的确定`,
  en: `the Determination of ${o.en}`,
  vi: `Việc Xác định ${o.vi}`,
  th: `การกำหนด${o.th}`,
  ms: `Penetapan ${o.ms}`,
});

const OBJ = {
  // 应税出口货物
  barang: {
    zh: '应税出口货物出口',
    en: 'the Export Benchmark Price for Exported Goods Subject to Export Duty',
    vi: 'Giá Chuẩn Xuất khẩu đối với Hàng hóa Xuất khẩu chịu Thuế Xuất khẩu',
    th: 'ราคาอ้างอิงการส่งออกสำหรับสินค้าส่งออกที่ต้องเสียภาษีส่งออก',
    ms: 'Harga Rujukan Eksport bagi Barang Eksport yang Dikenakan Duti Eksport',
  },
  // 应税出口货物，标题尾部另带缩称 (HPE)
  barangHPE: {
    zhFull: '应税出口货物出口基准价格（HPE）的确定',
    zh: '应税出口货物出口',
    en: 'the Export Benchmark Price (HPE) for Exported Goods Subject to Export Duty',
    vi: 'Giá Chuẩn Xuất khẩu (HPE) đối với Hàng hóa Xuất khẩu chịu Thuế Xuất khẩu',
    th: 'ราคาอ้างอิงการส่งออก (HPE) สำหรับสินค้าส่งออกที่ต้องเสียภาษีส่งออก',
    ms: 'Harga Rujukan Eksport (HPE) bagi Barang Eksport yang Dikenakan Duti Eksport',
  },
  // 应税农产品与林产品
  tani: {
    zh: '应税农产品与林产品出口',
    en: 'the Export Benchmark Price for Agricultural and Forestry Products Subject to Export Duty',
    vi: 'Giá Chuẩn Xuất khẩu đối với Sản phẩm Nông nghiệp và Lâm nghiệp chịu Thuế Xuất khẩu',
    th: 'ราคาอ้างอิงการส่งออกสำหรับผลิตภัณฑ์เกษตรและป่าไม้ที่ต้องเสียภาษีส่งออก',
    ms: 'Harga Rujukan Eksport bagi Produk Pertanian dan Perhutanan yang Dikenakan Duti Eksport',
  },
  // 应税矿产品
  tambang: {
    zh: '应税矿产品出口',
    en: 'the Export Benchmark Price for Mining Products Subject to Export Duty',
    vi: 'Giá Chuẩn Xuất khẩu đối với Sản phẩm Khai khoáng chịu Thuế Xuất khẩu',
    th: 'ราคาอ้างอิงการส่งออกสำหรับผลิตภัณฑ์เหมืองแร่ที่ต้องเสียภาษีส่งออก',
    ms: 'Harga Rujukan Eksport bagi Produk Perlombongan yang Dikenakan Duti Eksport',
  },
  // 应税粗棕榈油衍生产品
  cpo: {
    zh: '应税粗棕榈油衍生产品出口',
    en: 'the Export Benchmark Price for Products Derived from Crude Palm Oil Subject to Export Duty',
    vi: 'Giá Chuẩn Xuất khẩu đối với Sản phẩm Dẫn xuất từ Dầu Cọ Thô chịu Thuế Xuất khẩu',
    th: 'ราคาอ้างอิงการส่งออกสำหรับผลิตภัณฑ์ที่ได้จากน้ำมันปาล์มดิบที่ต้องเสียภาษีส่งออก',
    ms: 'Harga Rujukan Eksport bagi Produk Terbitan Minyak Sawit Mentah yang Dikenakan Duti Eksport',
  },
  // 特定出口货物（标题自带缩称 HPE）
  tertentu: {
    zhFull: '特定出口货物出口基准价格（HPE）的确定',
    zh: '特定出口货物的出口',
    en: 'the Export Benchmark Price (HPE) for Certain Exported Goods',
    vi: 'Giá Chuẩn Xuất khẩu (HPE) đối với Hàng hóa Xuất khẩu Nhất định',
    th: 'ราคาอ้างอิงการส่งออก (HPE) สำหรับสินค้าส่งออกบางประเภท',
    ms: 'Harga Rujukan Eksport (HPE) bagi Barang Eksport Tertentu',
  },
  // 鱼类基准价格：用于计算渔业产品征费
  ikan: {
    zh: '渔业产品征费计算用鱼类',
    en: 'the Benchmark Price of Fish for the Calculation of Fisheries Levies',
    vi: 'Giá Chuẩn của Cá để Tính Lệ phí Thủy sản',
    th: 'ราคาอ้างอิงของปลาเพื่อการคำนวณค่าธรรมเนียมผลผลิตประมง',
    ms: 'Harga Rujukan Ikan untuk Pengiraan Pungutan Hasil Perikanan',
  },
  // 白砂糖农民基准价格（HPP）
  gula: {
    zhFull: '白砂糖农民基准价格（HPP）的确定',
    zh: '白砂糖的农民',
    en: 'the Farmer Benchmark Price (HPP) for Plantation White Sugar',
    vi: 'Giá Chuẩn cho Nông dân (HPP) đối với Đường Trắng Tinh luyện từ Mía',
    th: 'ราคาอ้างอิงสำหรับเกษตรกร (HPP) ของน้ำตาลทรายขาว',
    ms: 'Harga Rujukan Petani (HPP) bagi Gula Kristal Putih',
  },
};

// 8 种形态与条目归属（同一形态的多条只在号年上不同，译名一致）
const MAP = {
  barang: ['ID-H1904', 'ID-H2104'],
  barangHPE: ['ID-H2000'],
  tani: [
    'ID-H2658', 'ID-H2733', 'ID-H2829', 'ID-H2915', 'ID-H2916',
    'ID-H3023', 'ID-H3024', 'ID-H3104',
  ],
  tambang: ['ID-H2657', 'ID-H2828', 'ID-H2914', 'ID-H3020', 'ID-H3021', 'ID-H3022', 'ID-H3103'],
  cpo: ['ID-H2105'],
  tertentu: ['ID-H1698'],
  ikan: ['ID-H2001', 'ID-H2106'],
  gula: ['ID-H2107'],
};

const items = {};
for (const [k, ids] of Object.entries(MAP)) {
  const t = FR(OBJ[k]);
  for (const id of ids) items[id] = { ...t };
}

// 自检：数量与五语齐全
const n = Object.keys(items).length;
if (n !== 23) throw new Error('条目数应为 23，实为 ' + n);
for (const [id, t] of Object.entries(items)) {
  for (const k of ['zh', 'en', 'vi', 'th', 'ms']) {
    if (!String(t[k] || '').trim()) throw new Error(id + ' 缺 ' + k);
  }
}

const out = path.join(__dirname, '_id_b32.json');
fs.writeFileSync(out, JSON.stringify({ batch: 'id-p1-b32', items, skip: [] }, null, 2), 'utf8');
console.log('写入 ' + n + ' 条 → ' + out);
