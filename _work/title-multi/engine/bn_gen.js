// BN 标题合成器：词表（主体名）＋ 类型词 → 四语标题
// 用法：
//   node bn_gen.js --emit 批次名       生成批次 JSON 到 batches/<批次名>.json
//   node bn_gen.js --stat              只统计可生成量
// 依赖：_gap.json（最新缺口）、_bn_map.json（主体名词表）
'use strict';
const fs = require('fs');
const path = require('path');
const { parseTitle } = require('./bn_parse.js');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const GAP = path.join(ROOT, '_work', 'title-multi', '_gap.json');
const MAP = path.join(__dirname, '_bn_map.json');
const OUTDIR = path.join(ROOT, '_work', 'title-multi', 'batches');

// 类型词：{vi, th, id, ms}
const TYPE = {
  ACT: { vi: 'Luật', th: 'พระราชบัญญัติ', id: 'Undang-Undang', ms: 'Akta' },
  ORDER: { vi: 'Sắc lệnh', th: 'คำสั่ง', id: 'Perintah', ms: 'Perintah' },
  REG: { vi: 'Quy định', th: 'ข้อบังคับ', id: 'Peraturan', ms: 'Peraturan' },
  RULES: { vi: 'Quy tắc', th: 'ข้อกำหนด', id: 'Peraturan', ms: 'Kaedah' },
  CODE: { vi: 'Bộ luật', th: 'ประมวลกฎหมาย', id: 'Kitab Undang-Undang', ms: 'Kanun' },
  NOTICE: { vi: 'Thông báo', th: 'ประกาศ', id: 'Pemberitahuan', ms: 'Pemberitahuan' },
  PROC: { vi: 'Công bố', th: 'ประกาศ', id: 'Proklamasi', ms: 'Pengisytiharan' },
  CONST: { vi: 'Hiến pháp', th: 'รัฐธรรมนูญ', id: 'Konstitusi', ms: 'Perlembagaan' },
  CONV: { vi: 'Công ước', th: 'อนุสัญญา', id: 'Konvensi', ms: 'Konvensyen' },
  ARR: { vi: 'Thỏa thuận', th: 'ข้อตกลง', id: 'Kesepakatan', ms: 'Persetujuan' },
  RES: { vi: 'Nghị quyết', th: 'มติ', id: 'Resolusi', ms: 'Resolusi' },
  DEC: { vi: 'Quyết định', th: 'คำวินิจฉัย', id: 'Keputusan', ms: 'Keputusan' },
  GUIDE: { vi: 'Hướng dẫn', th: 'แนวทาง', id: 'Pedoman', ms: 'Garis Panduan' },
  CIRC: { vi: 'Thông tư', th: 'หนังสือเวียน', id: 'Surat Edaran', ms: 'Pekeliling' },
  MEAS: { vi: 'Biện pháp', th: 'มาตรการ', id: 'Tindakan', ms: 'Langkah' },
  REPLY: { vi: 'Trả lời', th: 'คำตอบ', id: 'Jawaban', ms: 'Jawapan' },
  ANN: { vi: 'Thông cáo', th: 'ประกาศ', id: 'Pengumuman', ms: 'Pengumuman' },
  CAT: { vi: 'Danh mục', th: 'รายการ', id: 'Katalog', ms: 'Katalog' },
};

// 「修订」词：vi/th 后置修饰，id/ms 前置
const AMD = { vi: 'sửa đổi', th: 'แก้ไขเพิ่มเติม', id: 'Perubahan', ms: 'Pindaan' };
// 类型词与主体之间的连接
const SEP = { vi: ' ', th: '', id: ' ', ms: ' ' };
const YEAR = {
  vi: y => ' năm ' + y,
  th: y => ' พ.ศ. ' + (Number(y) + 543),
  id: y => ' Tahun ' + y,
  ms: y => ' ' + y,
};
const CAP = { vi: c => ' (Chương ' + c + ')', th: c => ' (บทที่ ' + c + ')', id: c => ' (Bab ' + c + ')', ms: c => ' (Bab ' + c + ')' };
// 条级条目（SEC N OF X）保留条号，与中文层「第 N 条」对齐
const SEC = { vi: n => ' (Điều ' + n + ')', th: n => ' (มาตรา ' + n + ')', id: n => ' (Pasal ' + n + ')', ms: n => ' (Seksyen ' + n + ')' };
const NO2 = {
  vi: n => ' số ' + n,
  th: n => ' ฉบับที่ ' + n,
  id: n => ' Nomor ' + n,
  ms: n => ' Bilangan ' + n,
};

function cleanBase(b) {
  let s = b;
  s = s.replace(/^\d+\s+\d{4}\s+ED\s+/, '').replace(/^\d+\s+ED\s+/, '').replace(/^\d{2,4}\s+ED\s+/, '');
  s = s.replace(/^N\s+\d+\s+/, '');
  s = s.replace(/^[A-Z]\s+(?=[A-Z]{4,})/, '');
  s = s.replace(/EDEDUCATION/g, 'EDUCATION');
  s = s.replace(/^MERGENCY\b/, 'EMERGENCY');
  s = s.replace(/DARUSALAM/g, 'DARUSSALAM');
  s = s.replace(/^EEXCISE\b/, 'EXCISE');
  s = s.replace(/^FIRSHERIES\b/, 'FISHERIES');
  s = s.replace(/TRANSATIONS/g, 'TRANSACTIONS');
  s = s.replace(/INSOLVENCYJUDICIAL/g, 'INSOLVENCY JUDICIAL');
  s = s.replace(/POLUTION/g, 'POLLUTION');
  // OCR 词内损坏（逐个列，不用通用规则猜）
  s = s.replace(/PROVEEDS/g, 'PROCEEDS');
  s = s.replace(/EEDUCATION/g, 'EDUCATION');
  s = s.replace(/EMENERGENCY/g, 'EMERGENCY');
  s = s.replace(/PROBIHITION/g, 'PROHIBITION');
  s = s.replace(/AGREMENT/g, 'AGREEMENT');
  s = s.replace(/PREFENTIAL/g, 'PREFERENTIAL');
  s = s.replace(/VARITIES/g, 'VARIETIES');
  s = s.replace(/PRIVELEGES/g, 'PRIVILEGES');
  s = s.replace(/IAMENDMENT/g, 'AMENDMENT');
  s = s.replace(/SUCCESSOR/g, 'SUCCESSOR');
  s = s.replace(/\s+NO\.?\s*(\d+)$/, ' NO. $1');
  s = s.replace(/\s+ENACTMENT$/, '');
  s = s.replace(/\s+AM$/, '');
  s = s.replace(/ORDER(\d)$/, 'ORDER');
  s = s.replace(/\.$/, '');
  s = s.replace(/\s+\d$/, '');
  return s.replace(/\s+/g, ' ').trim();
}

function compose(p, term) {
  const out = {};
  const base = cleanBase(p.base);
  const mNo = p.no ? [null, p.no] : base.match(/\s+NO\.\s*(\d+)$/);
  for (const L of ['vi', 'th', 'id', 'ms']) {
    let s;
    if (term.full && term.full[L]) {
      s = term.full[L];
    } else {
      const subj = (term[L] || '').trim();
      if (!subj) return null; // 未译，跳过
      // 解析不出类型词时回落到 ORDER：文莱附属立法几乎都是 Order 系列，
      // 回落到 ACT 会把公告/声明误作成「法」
      const instr = TYPE[p.instr || 'ORDER'][L];
      s = instr + SEP[L] + subj;
      let wraps = p.wrap.slice();
      const amd = p.amd;
      if (amd && wraps.length === 0) wraps = [p.instr || 'ACT'];
      if (amd) {
        // 外层包裹：WRAP + AMD + INSTR + subj
        s = TYPE[wraps[0]][L] + SEP[L] + AMD[L] + SEP[L] + instr + SEP[L] + subj;
      }
      if (mNo) s = s + NO2[L](mNo[1]);
    }
    if (p.year) s = s + YEAR[L](p.year);
    if (p.cap) s = s + CAP[L](p.cap);
    if (p.sec) s = s + SEC[L](p.sec);
    out[L] = s.replace(/\s+/g, ' ').trim();
  }
  return out;
}

function loadTerms() {
  const terms = {};
  const dir = __dirname;
  for (const f of fs.readdirSync(dir)) {
    if (!/^_bn_map.*\.json$/.test(f)) continue;
    const part = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    Object.assign(terms, part.terms || {});
  }
  return terms;
}

function main() {
  const g = JSON.parse(fs.readFileSync(GAP, 'utf8'));
  const map = loadTerms();
  const bn = g.gaps.filter(x => x.country === 'BN');
  const items = {};
  const skipped = {};
  let covered = 0;
  for (const it of bn) {
    const p = parseTitle(it.title.en);
    const key = cleanBase(p.base);
    const term = map[key];
    if (!term) { skipped[key] = (skipped[key] || 0) + 1; continue; }
    const t = compose(p, term);
    if (!t) { skipped[key] = (skipped[key] || 0) + 1; continue; }
    items[it.id] = t;
    covered++;
  }
  const emitIdx = process.argv.indexOf('--emit');
  const stat = `BN 缺口 ${bn.length}｜可生成 ${covered}｜未覆盖主体词 ${Object.keys(skipped).length} 类`;
  if (emitIdx > 0) {
    const name = process.argv[emitIdx + 1];
    const doc = { batch: name, scope: 'BN', generatedAt: new Date().toISOString(), engine: 'bn_gen', items };
    fs.writeFileSync(path.join(OUTDIR, name + '.json'), JSON.stringify(doc, null, 1), 'utf8');
    console.log(stat);
    console.log('已写出', path.join(OUTDIR, name + '.json'));
  } else {
    console.log(stat);
  }
  if (process.argv.includes('--todo')) {
    const arr = Object.entries(skipped).sort((a, b) => b[1] - a[1]);
    fs.writeFileSync(path.join(__dirname, '_bn_map_todo.txt'), arr.map(([k, v]) => String(v).padStart(3) + ' ' + k).join('\n'), 'utf8');
    console.log('未覆盖清单 → engine/_bn_map_todo.txt（' + arr.length + ' 类）');
  }
}

if (require.main === module) main();
module.exports = { compose, cleanBase, TYPE };
