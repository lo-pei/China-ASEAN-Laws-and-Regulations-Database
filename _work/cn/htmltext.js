'use strict';
/* 极简 HTML -> 纯文本（保留块级换行），用于 gov.cn 静态全文页 */
function decode(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function toText(html) {
  let s = html;
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<head\b[\s\S]*?<\/head>/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n');
  s = s.replace(/<\/div>/gi, '\n');
  s = s.replace(/<\/tr>/gi, '\n');
  s = s.replace(/<\/h[1-6]>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decode(s);
  s = s.replace(/\r\n?/g, '\n');
  s = s.replace(/\u00a0/g, ' ');
  s = s.replace(/[ \t\u3000]+/g, ' ');
  s = s.split('\n').map(l => l.trim()).join('\n');
  s = s.replace(/\n{2,}/g, '\n');
  return s;
}

module.exports = { toText, decode };

if (require.main === module) {
  const fs = require('fs');
  const t = toText(fs.readFileSync(process.argv[2], 'utf8'));
  console.log(t.split('\n').map((l, i) => i + ': ' + JSON.stringify(l)).join('\n'));
}
