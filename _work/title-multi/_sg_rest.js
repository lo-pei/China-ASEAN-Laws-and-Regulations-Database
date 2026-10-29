/** 按数据库现状重算 SG 剩余缺口（不依赖 _gap.json 快照） */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const DIR = path.join(ROOT, 'prototype', 'data', 'laws');
const { splitZh } = require('./_sg_mem.js');

const SYL = /条(?:项)?下的(?:命令|公告|各项公告|豁免命令)|下的豁免命令|一般命令|借用命令|使.*生效的命令|活页修订页/;
const out = [];
for (const f of fs.readdirSync(DIR)) {
  if (!f.startsWith('SG-') || !f.endsWith('.json')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const t = j.title || {};
  if (t.vi && t.th && t.id && t.ms) continue;
  const z = splitZh(t.zh);
  out.push({ id: f.replace(/\.json$/, ''), zh: t.zh, en: t.en || '', nomod: !!(z && !z.mod), syl: SYL.test(t.zh || '') });
}
const nomod = out.filter((x) => x.nomod && !x.syl);
console.log('SG 缺口合计', out.length, '｜无附注主法余', nomod.length, '｜条文号类余', out.filter((x) => x.syl).length);
const N = Number(process.argv[2] || 0);
nomod.slice(N, N + 90).forEach((x, i) => console.log(N + i + 1 + '|' + x.id + '|' + x.zh + '|' + x.en.slice(0, 95)));
