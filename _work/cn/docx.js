'use strict';
/* 从 flk 下载的 docx 中提取段落文本（自实现 zip 解析，零依赖） */
const fs = require('fs');
const zlib = require('zlib');

function readZipEntries(buf) {
  const eocd = (() => {
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) {
      if (buf.readUInt32LE(i) === 0x06054b50) return i;
    }
    return -1;
  })();
  if (eocd < 0) throw new Error('no EOCD');
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) break;
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.slice(off + 46, off + 46 + nameLen).toString('utf8');
    entries.push({ name, method, compSize, localOff });
    off += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extract(buf, entry) {
  const lo = entry.localOff;
  if (buf.readUInt32LE(lo) !== 0x04034b50) throw new Error('bad local header');
  const nameLen = buf.readUInt16LE(lo + 26);
  const extraLen = buf.readUInt16LE(lo + 28);
  const start = lo + 30 + nameLen + extraLen;
  const data = buf.slice(start, start + entry.compSize);
  if (entry.method === 0) return data;
  return zlib.inflateRawSync(data);
}

function readDocx(file) {
  const buf = fs.readFileSync(file);
  const entries = readZipEntries(buf);
  const doc = entries.find(e => e.name === 'word/document.xml');
  if (!doc) throw new Error('no document.xml in ' + file);
  return extract(buf, doc).toString('utf8');
}

/* 段落数组：w:p -> 文本（w:t），w:tab -> \t，w:br -> \n */
function paragraphs(xml) {
  const paras = [];
  const pRe = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>|<w:p\b[^>]*\/>/g;
  let m;
  while ((m = pRe.exec(xml))) {
    const inner = m[1] || '';
    let text = '';
    const tRe = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>|<w:cr\b[^>]*\/>/g;
    let t;
    while ((t = tRe.exec(inner))) {
      if (t[0].startsWith('<w:tab')) text += '\t';
      else if (t[0].startsWith('<w:br') || t[0].startsWith('<w:cr')) text += '\n';
      else text += decode(t[1]);
    }
    paras.push(text);
  }
  return paras;
}

function decode(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

module.exports = { readDocx, paragraphs, decode };

if (require.main === module) {
  const file = process.argv[2];
  const paras = paragraphs(readDocx(file));
  console.log(paras.length + ' paragraphs');
  paras.slice(0, 40).forEach((p, i) => console.log(i + ': ' + JSON.stringify(p)));
}
