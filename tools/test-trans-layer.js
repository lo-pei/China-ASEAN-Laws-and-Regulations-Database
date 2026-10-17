/* 译文层端到端自测：验证 transPackFor / mergeTrans / 条号对齐 是否按 SKILL.md 契约工作 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.cwd();

function newCtx() { const c = { window: {}, document: {} }; c.window = c; vm.createContext(c); return c; }

// 1) 原始条文层（泰国专利法）
const ctx = newCtx();
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/data/intl/th-p01.js'), 'utf8'), ctx, { filename: 'th-p01' });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'prototype/assets/js/core/fulltext.js'), 'utf8'), ctx, { filename: 'fulltext' });
const FT = ctx.CALR_FULLTEXT, api = ctx.CALR.fulltext;

const lawId = 'TH-H001';
const law = FT[lawId];
console.log('原文：' + lawId + '  language=' + law.language + '  条文 ' + law.articles.length + ' 条');
const before = Object.keys(law.articles[0].text);
console.log('  合并前 条文1 的 text 键: ' + JSON.stringify(before));

// 2) 模拟一份译文分卷（完全按 SKILL.md §6.3 契约组装；仅内存，不落盘）
ctx.CALR_TRANS = {};
ctx.CALR_TRANS[lawId] = {
  lawId: lawId, sourceLang: law.language, targetLang: 'zh',
  engine: 'llm', model: 'self-test', promptVersion: 'calr-trans-v1',
  translatedAt: '2026-10-06', reviewed: 'machine',
  completenessNote: '自测用',
  articles: law.articles.map(a => ({ no: a.no, noLabel: { zh: '第 ' + a.no + ' 条' }, text: { zh: '［自测译文］' } }))
};

// 3) 注册索引并走 packFor
ctx.CALR_TRANS_MANIFEST = { version: '1.0.0', updatedAt: '2026-10-06', files: [], byLaw: { [lawId]: { zh: 'th-p01.zh' } } };
console.log('  transPackFor(TH-H001, zh) = ' + api.transPackFor(lawId, 'zh'));
console.log('  transPackFor(TH-H001, vi) = ' + api.transPackFor(lawId, 'vi') + '  （未翻译的语言应为 null）');

// 4) 合并
const n = api.mergeTrans(lawId, 'zh');
console.log('  合并条数 = ' + n);

// 5) 断言
let pass = true;
function chk(cond, msg) { console.log('  ' + (cond ? '✓' : '✗') + ' ' + msg); if (!cond) pass = false; }
chk(n === law.articles.length, '全部 ' + law.articles.length + ' 条都合并成功');
const src = law.language;
chk(!!law.articles[0].text[src], '官方原文语言键 ' + src + ' 未被破坏（仍为原文）');
chk(!!law.articles[0].text.zh, '译文语言键 zh 已并入内存对象');
chk(Object.keys(law.articles[0].text).length === 2, 'text 内恰好两个语言键（原文 ' + src + ' ＋ 译文 zh）');
chk(api.transMerged(lawId, 'zh') === true, 'transMerged 标记正确');
const st = api.transStats;
chk(typeof st === 'function', 'transStats 可用');

// 6) 磁盘未被改动
//    注意：不能用「文件里是否出现 "zh"」判断——原文分卷本身可能合法含有 title.zh / noLabel.zh 等字段。
//    只检查自测标记是否落盘，并逐条比对原文语言的正文是否与加载时一致。
const disk = fs.readFileSync(path.join(ROOT, 'prototype/data/intl/th-p01.js'), 'utf8');
chk(disk.indexOf('［自测译文］') < 0, '磁盘上的原文文件未被写入译文（分离存储成立）');
const diskCtx = newCtx();
vm.runInContext(disk, diskCtx, { filename: 'th-p01-disk' });
const diskLaw = diskCtx.CALR_FULLTEXT[lawId];
const srcKey = law.language;
const sameText = diskLaw.articles.every((a, i) =>
  (a.text[srcKey] || '') === (law.articles[i].text[srcKey] || ''));
chk(sameText, '磁盘上 ' + law.articles.length + ' 条原文正文与合并前逐条一致（未被译文污染）');
chk(!diskLaw.articles[0].text.zh, '磁盘上原文条文不含 zh 语言键（译文只在内存）');

console.log('\n===== 译文层自测：' + (pass ? '全部通过' : '存在失败') + ' =====');
process.exit(pass ? 0 : 1);
