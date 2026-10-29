/* ==========================================================================
   _ph_mt.js —— PH 长散文标题的批量机翻通道
   
   背景：PH 剩 15,726 条，台账已判定「规则引擎不可及」。此前靠手写，
         每轮 20–40 部，按此节奏要几百轮。改用模型批量产出。
   
   通道：环境变量 DASHSCOPE_API_KEY → qwen-plus（OpenAI 兼容协议）。
         直连 OpenAI 在本机 ETIMEDOUT，故只用阿里云国内通道。
   
   用法：
     node _ph_mt.js --plan                 导出待译清单到 _ph_mt_todo.json
     node _ph_mt.js --limit 12             试跑 12 条
     node _ph_mt.js --limit 500 --conc 6   正式跑
   
   产物：
     _ph_mt_out.jsonl   逐条结果（断点续跑：已在文件中的 key 自动跳过）
     _ph_mt_fail.json   失败明细
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const { normalize, check } = require('./_ph_num.js');

const ROOT = path.resolve(__dirname, '../..');
const LAWDIR = path.join(ROOT, 'prototype/data/laws');
const OUT = path.join(__dirname, '_ph_mt_out.jsonl');
const FAIL = path.join(__dirname, '_ph_mt_fail.json');
const TODO = path.join(__dirname, '_ph_mt_todo.json');

const MODEL = process.env.PH_MT_MODEL || 'qwen-plus';
let CONC = +(process.env.PH_MT_CONC || 5);
let BATCH = +(process.env.PH_MT_BATCH || 6);

/* --------------------------------------------------------------------------
   术语表：全部取自库内已完成 7,391 部 PH 的既成译法，不另立新名
   -------------------------------------------------------------------------- */
const GLOSSARY = `
【中文文书类型（按库内既成译法，不得改）】
Republic Act No. N            → 第N号共和国法
Republic Act No. N (简称)      → 第N号共和国法（《简称》）
Commonwealth Act No. N        → 第N号联邦法
Presidential Decree No. N     → 第N号总统令
Executive Order No. N         → 第N号行政命令
Administrative Order No. N    → 第N号行政命令
Batas Pambansa Blg. N         → 第N号国民议会法
Proclamation No. N            → 第N号公告
Memorandum Order No. N        → 第N号备忘录命令
Letter of Instructions No. N  → 第N号指令书
Municipal Ordinance No. N     → 第N号市政条例
Resolution No. N              → 第N号决议

【行政区划与机构】
Barangay            → 描笼涯            Municipality      → 市镇
City                → 市                Province          → 省
Sangguniang Panlalawigan → 省议会        Sangguniang Bayan → 市镇议会
Department of ...   → ...部              National High School → 国立中学
State University / College → 国立大学 / 国立学院

【其他四语的文书类型】
                vi                      th                                id                      ms
Republic Act    Đạo luật                พระราชบัญญัติ                    Undang-Undang           Akta
Commonwealth Act Đạo luật luật chung    พระราชบัญญัติเครือจักรภพ          Undang-Undang Persemakmuran Akta Komanwel
Presidential Decree Sắc lệnh Tổng thống พระราชกฤษฎีกาประธานาธิบดี          Keputusan Presiden      Dekri Presiden
Executive Order Lệnh hành pháp          คำสั่งฝ่ายบริหาร                  Perintah Eksekutif      Perintah Eksekutif
Batas Pambansa  Đạo luật Quốc hội       พระราชบัญญัติรัฐสภา               Undang-Undang Parlemen  Akta Parlimen
Proclamation    Tuyên bố                ประกาศ                            Proklamasi              Pengisytiharan
Barangay        Barangay                บารังไกย์                          Barangay                Barangay
Province        Tỉnh                    จังหวัด                            Provinsi                Wilayah
Municipality    Thành phố trực thuộc tỉnh อำเภอ                           Kotamadya               Perbandaran
City            Thành phố               นคร                               Kota                    Bandar
`.trim();

const SYSTEM = `你是东盟法律数据库的标题译员。任务：把菲律宾法律标题译成中文(zh)、越南语(vi)、泰语(th)、印尼语(idn)、马来语(ms)。

【硬性要求】
1. zh：把标题**完整译出**，成为一句可独立阅读的中文题名句，以「…的法案」「…的法律」收尾。
   ★ 绝对禁止以「一部」「一项」「关于」开头。直接从动词或名词写起。
   ★ 人名一律**音译为中文并用间隔号连接**（Manuel L. Quezon → 曼努埃尔·L·奎松；Fernando Poe Jr. → 小费尔南多·坡）；以人名命名的学校、街道，其中人名同样音译（Tiburcio Tancinco Memorial School → 蒂布尔西奥·坦辛科纪念学校）。
   ★ 公司、机构的原文名称保留拉丁字母（Maynilad Water Services, Inc.、Blockbuster Broadcasting System, Inc.），但其中的通用词照译（Broadcasting System → 广播系统公司）。
   ★ 省、市、镇名译中文；描笼涯（Barangay）与更小的村名可保留拉丁原文。
   库内既成译法（照此风格，不要另创）：
     en: An Act Converting the Abra State Institute of Sciences and Technology in the Municipalities of Lagangilang and Bangued, Province of Abra Into a State University, to Be Known as the University of Abra, and Appropriating Funds Therefor
     zh: 将阿布拉省 Lagangilang 与 Bangued 市镇的阿布拉科学技术国立学院改设为国立大学，名称为阿布拉大学，并为此拨款的法案
     en: An Act Renaming Roosevelt Avenue Located in Legislative District I of Quezon City as Fernando Poe Jr. Avenue
     zh: 将奎松市第一立法区的罗斯福大道更名为 Fernando Poe Jr. 大道的法案
     en: An Act Appropriating Funds for the Operation of the Government of the Commonwealth of the Philippines Beginning July First, Nineteen Hundred and Forty
     zh: 为菲律宾联邦政府自 1940 年 7 月 1 日起运作拨款的法案
2. vi / th / idn / ms：**压缩为题名式短语**，只保留「文书类型 + 核心动作 + 核心对象」，删去 "and Appropriating Funds Therefor"、"for Other Purposes"、"Otherwise Known as ..." 等枝节；机构与公司专名保留拉丁原文。泰国语不空格断词。
   ★ **区划通名必须译出，不得保留英文**：Municipality→市镇/Kotamadya/Perbandaran/เทศบาล，Province→省/Provinsi/Wilayah/จังหวัด，City→市/Kota/Bandar/นคร，Barangay→描笼涯/Barangay/บารังไกย์，Region→大区/Region/Wilayah/ภูมิภาค。只有它属于机构或公司全名的一部分时才保留英文。
   ★ **每句必须有实词**。若原文的专名被整段删去，句子也要重写成通顺的完整句，不允许留下「akan demi di, serta yang oleh」这类只剩虚词的残句。
   ★ th 只能出现泰文、数字与拉丁专名，**绝不能出现汉字**。
3. 文书类型严格按术语表译，不得自创。
4. **数字是硬约束**：输入里 nums= 列出的每个数字，必须原样出现在五语译文中（阿拉伯数字）。年份、编号、Section 号、金额一律照录，禁止换算、禁止改写、禁止省略。泰语若用佛历，可在该数字上加 543。
5. 五语都不得保留英文整句；zh 不得夹杂英文句子（专名除外）。
6. 若标题本身被截断（末尾缺字），照现有内容译，不加省略号、不猜测补全。

【输出格式】只输出 JSON，不加任何解释、不加代码块标记：
{"items":[{"key":"条目id","zh":"...","vi":"...","th":"...","idn":"...","ms":"..."}]}
items 的顺序与数量必须与输入完全一致。

${GLOSSARY}`;

function post(body) {
  return new Promise((resolve) => {
    const d = JSON.stringify(body);
    const req = https.request({
      host: 'dashscope.aliyuncs.com',
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      timeout: 180000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.DASHSCOPE_API_KEY,
        'Content-Length': Buffer.byteLength(d),
      },
    }, (res) => {
      let s = '';
      res.on('data', (c) => (s += c));
      res.on('end', () => resolve({ code: res.statusCode, body: s }));
    });
    req.on('error', (e) => resolve({ code: 'ERR', body: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ code: 'TIMEOUT', body: '' }); });
    req.write(d);
    req.end();
  });
}

function need(d) {
  return ['vi', 'th', 'ms'].some((k) => !String((d.title || {})[k] || '').trim());
}

function buildTodo() {
  const rows = [];
  for (const f of fs.readdirSync(LAWDIR)) {
    if (!f.startsWith('PH-') || !f.endsWith('.json')) continue;
    const d = JSON.parse(fs.readFileSync(path.join(LAWDIR, f), 'utf8'));
    if (!need(d)) continue;
    const t = d.title || {};
    const en = String(t.en || t.orig || '').replace(/\s+/g, ' ').trim();
    if (!en) continue;
    rows.push({ key: f.slice(0, -5), en });
  }
  fs.writeFileSync(TODO, JSON.stringify(rows, null, 0));
  return rows;
}

function doneKeys() {
  const set = new Set();
  if (!fs.existsSync(OUT)) return set;
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const o = JSON.parse(line);
      // 注意：落盘的语种键是 id（不是 idn），idn 只在模型交互层用
      if (o && o.key && o.zh && o.vi && o.th && o.id && o.ms) set.add(o.key);
    } catch (e) { /* 残行跳过 */ }
  }
  return set;
}

function parseJson(text) {
  let s = String(text || '').trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const i = s.indexOf('{');
  const j = s.lastIndexOf('}');
  if (i < 0 || j <= i) return null;
  try { return JSON.parse(s.slice(i, j + 1)); } catch (e) { return null; }
}

async function runBatch(items, tries = 3) {
  // 送译前把英文数词折成阿拉伯数字，并把「必备数字」明示给模型
  const prep = items.map((x) => {
    const nz = normalize(x.en);
    return { key: x.key, en: nz.en, nums: nz.nums };
  });
  const userMsg = '待译标题：\n' + prep
    .map((x) => `- key=${x.key}\n  nums=${x.nums.join(',') || '-'}\n  en=${x.en}`).join('\n');
  for (let t = 1; t <= tries; t++) {
    const r = await post({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userMsg }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });
    if (r.code !== 200) {
      if (t === tries) return { err: `HTTP ${r.code} ${String(r.body).slice(0, 120)}`, items: [] };
      await new Promise((s) => setTimeout(s, 1500 * t));
      continue;
    }
    let payload;
    try { payload = JSON.parse(r.body); } catch (e) { payload = null; }
    const content = payload && payload.choices && payload.choices[0]
      && payload.choices[0].message && payload.choices[0].message.content;
    const obj = parseJson(content);
    if (!obj || !Array.isArray(obj.items)) {
      if (t === tries) return { err: 'JSON 解析失败', items: [] };
      await new Promise((s) => setTimeout(s, 1200 * t));
      continue;
    }
    const valid = [];
    const badNum = [];
    for (const it of obj.items) {
      const k = String(it.key || '').trim();
      const src = prep.find((x) => x.key === k);
      if (!src) continue;
      const ok = ['zh', 'vi', 'th', 'idn', 'ms'].every((f) => String(it[f] || '').trim());
      if (!ok) continue;
      const rec = {
        key: k,
        zh: String(it.zh).trim(),
        vi: String(it.vi).trim(),
        th: String(it.th).trim(),
        id: String(it.idn).trim(),
        ms: String(it.ms).trim(),
      };
      // 数字硬校验：任一语缺号即退回重译，三次仍错则记失败留人工
      const miss = [];
      for (const lang of ['zh', 'vi', 'th', 'id', 'ms']) {
        const m = check(lang, rec[lang], src.nums);
        if (m.length) miss.push(lang + ':' + m.join(','));
      }
      if (miss.length) { badNum.push(k + ' ' + miss.join(' ')); continue; }
      valid.push(rec);
    }
    if (badNum.length && t < tries) {
      // 只把数字对不上的条目再送一次
      const keys = new Set(badNum.map((s) => s.split(' ')[0]));
      const retry = items.filter((x) => keys.has(x.key));
      if (retry.length && retry.length < items.length) {
        const r2 = await runBatch(retry, tries - 1);
        if (!r2.err) valid.push(...r2.items);
        else badNum.push(...retry.map((x) => x.key + ' ' + r2.err));
      }
    }
    if (valid.length || badNum.length) {
      return { err: null, items: valid, badNum };
    }
    if (t === tries) return { err: '条目全部无效', items: [] };
  }
  return { err: '未知', items: [] };
}

(async () => {
  const args = process.argv.slice(2);
  const isPlan = args.includes('--plan');
  const li = args.indexOf('--limit');
  const limit = li >= 0 ? +args[li + 1] : 0;
  const ci = args.indexOf('--conc');
  if (ci >= 0) CONC = +args[ci + 1] || CONC;
  const bti = args.indexOf('--batch');
  if (bti >= 0) BATCH = +args[bti + 1] || BATCH;

  let todo = fs.existsSync(TODO) ? JSON.parse(fs.readFileSync(TODO, 'utf8')) : buildTodo();
  if (isPlan) { console.log('待译', todo.length); return; }

  const done = doneKeys();
  let queue = todo.filter((x) => !done.has(x.key));
  if (limit) queue = queue.slice(0, limit);
  console.log(`总 ${todo.length} | 已完成 ${done.size} | 本轮 ${queue.length} | 并发 ${CONC} | 每批 ${BATCH}`);

  const batches = [];
  for (let i = 0; i < queue.length; i += BATCH) batches.push(queue.slice(i, i + BATCH));

  const fail = [];
  let n = 0, bi = 0;
  const outFd = fs.openSync(OUT, 'a');
  async function worker() {
    while (bi < batches.length) {
      const cur = batches[bi++];
      const r = await runBatch(cur);
      if (r.err) {
        for (const it of cur) fail.push({ key: it.key, err: r.err });
      } else {
        if (r.items.length) {
          fs.writeSync(outFd, r.items.map((o) => JSON.stringify(o)).join('\n') + '\n');
          n += r.items.length;
        }
        if (r.badNum) for (const s of r.badNum) fail.push({ key: s.split(' ')[0], err: '数字不一致 ' + s });
      }
      if ((bi % 20) === 0) console.log(`  进度 ${Math.min(bi * BATCH, queue.length)}/${queue.length} 写 ${n} 失败 ${fail.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.closeSync(outFd);
  fs.writeFileSync(FAIL, JSON.stringify(fail, null, 1));
  console.log(`完成：写 ${n} 条，失败 ${fail.length} 条（见 _ph_mt_fail.json）`);
})();
