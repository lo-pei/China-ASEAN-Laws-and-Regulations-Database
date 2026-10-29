'use strict';
// SG 标题质量闸（共享）：四语非空、无占位符、无英文虚词残留、泰/越必须含本族文字
// 注意：不能用 \b —— 越南语 toàn / toán 里的 to 会被误判成英文虚词；
// 拉丁扩展字母（à á ạ …）也要算作「词内字符」。
const LANGS = ['vi', 'th', 'id', 'ms'];
const L = 'A-Za-z\\u00C0-\\u024F\\u1E00-\\u1EFF';
// 注意：不能含 in —— 越南语 in（印刷）与英文 in 同形（Báo chí và nhà in）
const RESID = new RegExp(`(?<![${L}])(?:the|and|of|for|with|by|its|that|which|shall|from|into|as|to|on|under|other)(?![${L}])`, 'i');
const VI_MARK = /[\u00C0-\u01B0\u1EA0-\u1EF9]/;

// 正式机构名 / 公司名在四语中均保留英文原名，不算残留
const EN_OK = new Set([
  'Bank for International Settlements', 'Enterprise Singapore',
  'Singapore T100', 'AUPE Credit Co-operative Limited', 'Gardens by the Bay',
  'LVMH Fragrances and Cosmetics (Singapore) Pte Ltd',
  'Toyota Motor Credit Corporation', 'S.p.c. Pte. Ltd.', 'Ngee Ann Kongsi',
  'PSA Corporation', 'PSA',
]);

// 专名内部可能含英文虚词（Gardens by the Bay），查残留前先整段摘除
const ESC = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NAME_RE = new RegExp([...EN_OK].map(ESC).join('|'), 'gi');

function gate(t, allow) {
  // 按条白名单（本次合成注入的专名）与全局 EN_OK 合并后再查残留
  let nameRe = NAME_RE;
  if (allow && allow.length) {
    const extra = allow.filter((x) => x && x.length > 2).map(ESC);
    if (extra.length) nameRe = new RegExp(extra.concat([...EN_OK].map(ESC)).sort((a, b) => b.length - a.length).join('|'), 'gi');
  }
  for (const L of LANGS) {
    const s = t[L] || '';
    if (!s) return 'empty';
    if (/\b(TBD|TODO|XXX|\?\?\?)\b/i.test(s)) return 'placeholder';
    // 标题里保留英文原名的括注层先摘掉，再查残留
    const body = s.replace(nameRe, '');
    if (RESID.test(body)) return 'residue:' + L;
    if (L === 'th' && !/[\u0E00-\u0E7F]/.test(s)) return 'nothai';
    if (L === 'vi' && !VI_MARK.test(s)) return 'novi';
    if (s.length > 340) return 'toolong';
  }
  return null;
}

module.exports = { gate, EN_OK, RESID, LANGS };
