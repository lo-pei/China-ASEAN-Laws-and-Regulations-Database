// 菲律宾常用法名四语对照 · 合并入口
// 键归一：小写、去前导 the、去撇号与句末句点、折叠空白
'use strict';

function akey(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^the\s+/, '')
    .replace(/\s*\.\s*$/, '')
    .trim();
}

const MAP = {};
const BARE = {};
const RAW = [].concat(require('./_ph_acts_a.js'), require('./_ph_acts_b.js'));
for (const [k, vi, th, id, ms] of RAW) {
  const v = { vi, th, id, ms };
  MAP[akey(k)] = v;
  // 括号注（简称）可选：源标题常省略，故同时登记去括号键
  const bare = akey(k.replace(/\([^)]*\)/g, ' '));
  if (!BARE[bare]) BARE[bare] = v;
}

// 兜底：括号注（简称）缺失时再查一次
function lookup(title) {
  const k = akey(title);
  if (MAP[k]) return MAP[k];
  const bare = akey(title.replace(/\([^)]*\)/g, ' '));
  return MAP[bare] || BARE[bare] || null;
}

module.exports = { MAP, BARE, lookup, akey, COUNT: RAW.length };
