/* ==========================================================================
   _id_penj.js —— 从正文文末的 PENJELASAN 复述里抽取被截断标题的全称
   
   背景：156 条的 orig 是「Peraturan Perundang-undangan 96 …」这类元数据拼接后
         在 110 字符处硬截断的残题，凭标题判不出类型与主题。
         但正文末尾的「PENJELASAN ATAS PERATURAN … NOMOR … TAHUN … TENTANG …」
         完整复述了本条的文书类型、号年与主题。
   
   用法：node _id_penj.js [--all]
         默认只处理 orig 以 PERATURAN PERUNDANG 开头的；--all 处理全部待译 ID。
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LAWDIR = path.join(ROOT, 'prototype/data/laws');
const ALL = process.argv.includes('--all');

const need = (d) => ['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim());

const TYPE = [
  [/PERATURAN\s+PEMERINTAH/i, 'PP', '政府条例'],
  [/PERATURAN\s+PRESIDEN/i, 'PERPRES', '总统条例'],
  [/PERATURAN\s+MENTERI|PERATURAN\s+BADAN|PERATURAN\s+KEPALA/i, 'PERMEN', '部长条例'],
  [/PERATURAN\s+DAERAH/i, 'PERDA', '地方条例'],
  [/PERATURAN\s+BANK\s+INDONESIA/i, 'PBI', '印度尼西亚银行条例'],
  [/UNDANG-?UNDANG/i, 'UU', '法'],
  [/KEPUTUSAN\s+PRESIDEN/i, 'KEPPRES', '总统决定'],
  [/KEPUTUSAN\s+MENTERI/i, 'KEPMEN', '部长决定'],
];

const out = [];
for (const f of fs.readdirSync(LAWDIR)) {
  if (!f.startsWith('ID-') || !f.endsWith('.json')) continue;
  const d = JSON.parse(fs.readFileSync(path.join(LAWDIR, f), 'utf8'));
  if (!need(d)) continue;
  const t = d.title || {};
  const orig = String(t.orig || '').replace(/\s+/g, ' ').trim();
  if (!ALL && !/^PERATURAN PERUNDANG/i.test(orig)) continue;

  let txt = '';
  for (const a of d.articles || []) txt += (a.text && a.text.id || '') + ' ';
  txt = txt.replace(/\s+/g, ' ');

  // PENJELASAN ATAS <文书类型> REPUBLIK INDONESIA NOMOR <号> TAHUN <年> TENTANG <主题>
  // 终止符实测是「 UMUM 」（PENJELASAN 的正文小标题），偶尔带 I. 前缀；
  // OCR 会把 PERATURAN 拼成 PERATURAAN，类型段用宽松词形。
  const re = /PENJELASAN\s+ATAS\s+((?:PERATUR|UNDANG|KEPUTUSAN)[A-Z \-]{0,60}?REPUBLIK\s+INDONESIA)\s*NOMOR\s+([0-9IVXLC]+)\s*TAHUN\s+([0-9]{4}|2O[0-9]{2})\s*TENTANG\s+([\s\S]{10,600}?)(?:\s+(?:I\.\s*)?UMUM\b|\s+PENJELASAN\b|$)/i;
  const m = txt.match(re);

  let full = '', type = '', typeZh = '', num = '', year = '', topic = '', ev = '';
  if (m) {
    const kindRaw = m[1].trim();
    for (const [rx, code, zh] of TYPE) if (rx.test(kindRaw)) { type = code; typeZh = zh; break; }
    num = (m[2] || '').trim();
    year = (m[3] || '').trim();
    topic = (m[4] || '').trim().replace(/\s+/g, ' ');
    full = [kindRaw, num ? 'NOMOR ' + num : '', year ? 'TAHUN ' + year : '', topic ? 'TENTANG ' + topic : '']
      .filter(Boolean).join(' ');
    ev = 'PENJELASAN 命中';
  }

  // 备用：正文抬头自称「PERATURAN PEMERINTAH REPUBLIK INDONESIA NOMOR … TAHUN … TENTANG …」
  if (!topic) {
    const m2 = txt.match(/(PERATURAN\s+(?:PEMERINTAH|PRESIDEN)[A-Z ]{0,30}REPUBLIK\s+INDONESIA)\s*NOMOR\s+([0-9IVXLC]+)\s*TAHUN\s+([0-9]{4}|2O[0-9]{2})\s*TENTANG\s+([\s\S]{10,300}?)(?:\s+Pasal|\s+I\.\s)/i);
    if (m2) {
      const kindRaw = m2[1].trim();
      for (const [rx, code, zh] of TYPE) if (rx.test(kindRaw)) { type = code; typeZh = zh; break; }
      num = m2[2]; year = m2[3]; topic = m2[4].replace(/\s+/g, ' ').trim();
      full = `${kindRaw} NOMOR ${num} TAHUN ${year} TENTANG ${topic}`;
      ev = '抬头命中';
    }
  }

  out.push({ id: f.slice(0, -5), orig, type, typeZh, num, year, topic, full, ev });
}

fs.writeFileSync(path.join(__dirname, '_id_penj.json'), JSON.stringify(out, null, 0));
const ok = out.filter((x) => x.topic);
console.log(`候选 ${out.length} | 抽到全称 ${ok.length} | 未抽到 ${out.length - ok.length}`);
const byType = {};
for (const x of ok) byType[x.type || '?'] = (byType[x.type || '?'] || 0) + 1;
console.log('类型分布', JSON.stringify(byType));
for (const x of ok.slice(0, 10)) console.log(`${x.id} | ${x.type} ${x.num}/${x.year} | ${x.topic.slice(0, 90)}`);
console.log('--- 未抽到（抽样） ---');
for (const x of out.filter((y) => !y.topic).slice(0, 6)) console.log(`${x.id} | ${x.orig.slice(0, 90)}`);
