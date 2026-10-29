// 生成「规范化解析源」：剥掉著录前缀与文号前缀后的正文，供 _ph_all.js 解析。
// 只写 _ph_norm_src.json（工作文件），不改任何 title.en。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, '_work/title-multi/_ph_rest.json'), 'utf8'));

const RE_ARCH = /^(?:MALACA[NÑ]AN\s+PALACE|BY\s+THE\s+PRESIDENT|THE\s+PRESIDENT(?:'S)?\s+OFFICE|OFFICE\s+OF\s+THE\s+PRESIDENT)/i;
const RE_NUM = /^(?:(?:BATAS(?:ANG)?\s+PAMBANSA|REPUBLIC\s+ACT|COMMONWEALTH\s+ACT|ACT|EXECUTIVE\s+ORDER|PRESIDENTIAL\s+DECREE|PROCLAMATION|ADMINISTRATIVE\s+ORDER|MEMORANDUM\s+(?:ORDER|CIRCULAR))\s*(?:BLG\.?|BILANG|NO\.?)?\s*\d+[A-Z\-]*)\s*[,:]?\s*/i;
const RE_ANACT = /^AN?\s+ACT\b/i;

function norm(t) {
  let body = t;
  const flags = [];
  if (RE_ARCH.test(body)) {
    const m = body.match(RE_ANACT);
    if (m) { body = body.slice(m.index); flags.push('arch'); }
  }
  if (RE_NUM.test(body)) {
    const nm = body.match(RE_NUM);
    const rest = body.slice(nm[0].length);
    if (RE_ANACT.test(rest)) { body = rest; flags.push('num'); }
  }
  body = body.replace(/\s+/g, ' ').trim();
  return { body, flags };
}

const out = [];
let changed = 0;
for (const x of src) {
  const en = ((x.title && x.title.en) || '').replace(/\s+/g, ' ').trim();
  if (!en) continue;
  const { body, flags } = norm(en);
  if (flags.length && body !== en) changed++;
  out.push({ ...x, title: { ...x.title, en: body }, _enOrig: flags.length ? en : undefined, _normFlags: flags });
}
fs.writeFileSync(path.join(__dirname, '_ph_norm_src.json'), JSON.stringify(out), 'utf8');
console.log('源', out.length, '| 被规范化', changed);
const fc = {};
out.forEach((x) => { if (x._normFlags && x._normFlags.length) fc[x._normFlags.join('+')] = (fc[x._normFlags.join('+')] || 0) + 1; });
console.log(fc);
