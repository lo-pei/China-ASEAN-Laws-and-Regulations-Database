// Day3：构建跨语言法律术语桥
//
// 数据来源两条路，严格区分（不混为一谈）：
//   A. 【语料挖掘】中↔英：用 prototype/data/trans/ 的 6,841 条中英平行条目，
//      按「同一译文对里中文词与英文词共现」统计 PMI，得到有数据支撑的词对。
//   B. 【人工整理】中↔英 基础法律术语 + 英↔泰/越/印尼/马来 常用法律术语。
//      这部分来自通用法律常识，**未经母语者逐条核验**，单独标记 source:"curated"。
//
// 输出：prototype/data/terms-bridge.js
//   root.CALR_TERMS_BRIDGE = { <term>: { zh:[], en:[], th:[], vi:[], id:[], ms:[], src:{} } }
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const PROTO = path.join(ROOT, 'prototype');
const LAWS = path.join(PROTO, 'data/laws');
const TRANS = path.join(PROTO, 'data/trans');

// ---------------- 分词（与 util.tokenizeStrict 一致） ----------------
const CJK = /[\u3400-\u9fff\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff\u0e80-\u0eff]/g;
function tokStrict(text) {
  if (!text) return [];
  const s = String(text).toLowerCase();
  const out = [];
  const cjk = s.match(CJK);
  if (cjk) for (let i = 0; i < cjk.length - 1; i++) out.push(cjk[i] + cjk[i + 1]);
  const latin = s.replace(/[^\w\u00c0-\u024f]+/g, ' ').split(' ');
  for (const w of latin) if (w && w.length > 1) out.push(w);
  return out;
}
const STOP_EN = new Set(('the and or of to in for by with as on at from that this which shall may must any all such other ' +
  'be is are was were has have had not no if then than under into its it their his her they them we our you your ' +
  'provided accordance section article paragraph act law regulation rule order case person persons where there ' +
  'been being doing made make has have within without upon during before after').split(' '));
const STOP_ZH = new Set(('的', '了', '是', '在', '和', '与', '及', '或', '对', '我', '有', '本条', '本法', '规定', '应当', '可以', '不得', '以及', '其他', '以下', '关于', '根据', '按照', '的第', '一条', '第二').split(','));

// ---------------- 载入 trans 层 ----------------
console.log('  载入译文层...');
const sb = { window: {} }; sb.window = sb; sb.self = sb; vm.createContext(sb);
for (const f of fs.readdirSync(TRANS).filter(x => x.endsWith('.js'))) {
  try { vm.runInContext(fs.readFileSync(path.join(TRANS, f), 'utf8'), sb, { filename: f }); } catch (e) { }
}
const TRANS_OBJ = sb.CALR_TRANS || {};

// ---------------- 载入中文原文，与译文按 (lawId, no) 配对 ----------------
console.log('  配对中英条文...');
const coMap = new Map();     // "zh|en" -> count
const dfZh = new Map(), dfEn = new Map();
let pairs = 0;

for (const lawId of Object.keys(TRANS_OBJ)) {
  const tr = TRANS_OBJ[lawId];
  const trArts = (tr && tr.articles) || [];
  if (!trArts.length) continue;
  let law = null;
  try { law = JSON.parse(fs.readFileSync(path.join(LAWS, lawId + '.json'), 'utf8')); } catch (e) { continue; }
  const byNo = new Map();
  for (const a of (law.articles || [])) byNo.set(String(a.no), a);
  for (const ta of trArts) {
    const src = byNo.get(String(ta.no));
    if (!src) continue;
    const zhText = src.text && (src.text.zh || Object.values(src.text).filter(Boolean)[0]);
    /* trans 的 text 是 {en:"..."} 对象，不是字符串 */
    const enText = (ta.text && typeof ta.text === 'object') ? (ta.text[tr.targetLang] || ta.text.en || '') : ta.text;
    if (!zhText || !enText) continue;
    /* 限流：每条条文最多取 22 个中文词 × 22 个英文词，否则共现矩阵会超过 Map 容量上限 */
    const zhToks = [...new Set(tokStrict(zhText).filter(t => t.length === 2 && /[\u3400-\u9fff]/.test(t) && !STOP_ZH.has(t)))].slice(0, 22);
    const enToks = [...new Set(tokStrict(enText).filter(t => /^[a-z]+$/.test(t) && t.length > 3 && !STOP_EN.has(t)))].slice(0, 22);
    if (!zhToks.length || !enToks.length) continue;
    pairs++;
    for (const z of zhToks) {
      dfZh.set(z, (dfZh.get(z) || 0) + 1);
      for (const e of enToks) {
        const k = z + '|' + e;
        coMap.set(k, (coMap.get(k) || 0) + 1);
      }
    }
    for (const e of enToks) dfEn.set(e, (dfEn.get(e) || 0) + 1);
  }
}
console.log('  配对条文 ' + pairs + ' 组 / 共现组合 ' + coMap.size);

// ---------------- PMI 筛选（限定高强度、低歧义） ----------------
const mined = [];
for (const [k, c] of coMap.entries()) {
  if (c < 8) continue;
  const [z, e] = k.split('|');
  const dz = dfZh.get(z) || 1, de = dfEn.get(e) || 1;
  const pmi = Math.log((c / pairs) / ((dz / pairs) * (de / pairs)));
  /* 收紧：共现≥8 次 + PMI≥5.5 + 一对一清洗。抽取质量实测约 50-60%，收紧后应显著提高 */
  if (pmi < 5.5) continue;
  mined.push({ zh: z, en: e, c, pmi: +pmi.toFixed(2) });
}
mined.sort((a, b) => b.pmi - a.pmi);
console.log('  PMI≥4.0 的候选词对: ' + mined.length);

// 每个中文词只保留最强的一个英文词（避免一对多造成噪声扩散）
const bestByZh = new Map();
for (const p of mined) if (!bestByZh.has(p.zh)) bestByZh.set(p.zh, p);
// 每个英文词也只保留最强的一个中文词
const bestByEn = new Map();
for (const p of mined) if (!bestByEn.has(p.en)) bestByEn.set(p.en, p);
const curatedMined = [...bestByZh.values()].filter(p => bestByEn.get(p.en) === p);
console.log('  一对一清洗后: ' + curatedMined.length + ' 对');

// ---------------- 人工整理：中↔英 基础法律术语 ----------------
const MANUAL_ZH_EN = [
  ['外商投资', 'foreign investment'], ['外资企业', 'foreign-invested enterprise'], ['注册资本', 'registered capital'],
  ['最低资本', 'minimum capital'], ['营业执照', 'business licence'], ['公司章程', 'articles of association'],
  ['股东', 'shareholder'], ['董事', 'director'], ['董事会', 'board of directors'], ['监事会', 'board of supervisors'],
  ['法定代表人', 'legal representative'], ['有限责任公司', 'limited liability company'], ['股份公司', 'joint stock company'],
  ['并购', 'merger and acquisition'], ['股权转让', 'transfer of equity'], ['清算', 'liquidation'], ['破产', 'bankruptcy'],
  ['劳动合同', 'labour contract'], ['劳动关系', 'labour relationship'], ['试用期', 'probation'], ['工资', 'wage'],
  ['加班', 'overtime'], ['经济补偿', 'severance pay'], ['遣散费', 'severance pay'], ['赔偿金', 'compensation'],
  ['社会保险', 'social insurance'], ['工伤', 'work injury'], ['解雇', 'dismissal'], ['解除劳动合同', 'termination of employment contract'],
  ['竞业限制', 'non-compete'], ['最低工资', 'minimum wage'], ['工作时间', 'working hours'], ['年休假', 'annual leave'],
  ['个人所得税', 'individual income tax'], ['企业所得税', 'corporate income tax'], ['增值税', 'value added tax'],
  ['关税', 'customs duty'], ['税收优惠', 'tax incentive'], ['纳税申报', 'tax return'], ['税务登记', 'tax registration'],
  ['转让定价', 'transfer pricing'], ['预提税', 'withholding tax'],
  ['知识产权', 'intellectual property'], ['专利', 'patent'], ['商标', 'trademark'], ['版权', 'copyright'],
  ['著作权', 'copyright'], ['商业秘密', 'trade secret'], ['侵权', 'infringement'], ['赔偿数额', 'amount of damages'],
  ['许可使用', 'licensing'], ['在先权利', 'prior right'],
  ['个人数据', 'personal data'], ['个人信息', 'personal information'], ['数据处理', 'data processing'],
  ['数据控制者', 'data controller'], ['数据处理者', 'data processor'], ['同意', 'consent'], ['跨境传输', 'cross-border transfer'],
  ['数据出境', 'cross-border data transfer'], ['数据分类分级', 'data classification'], ['重要数据', 'important data'],
  ['网络安全', 'cybersecurity'], ['等级保护', 'classified protection'], ['数据泄露', 'data breach'],
  ['土地使用权', 'land use right'], ['土地租赁', 'land lease'], ['征收', 'expropriation'], ['抵押', 'mortgage'],
  ['不动产', 'real property'], ['租赁', 'lease'],
  ['合同', 'contract'], ['违约', 'breach of contract'], ['不可抗力', 'force majeure'], ['定金', 'deposit'],
  ['要约', 'offer'], ['承诺', 'acceptance'], ['代理', 'agency'], ['担保', 'guarantee'],
  ['仲裁', 'arbitration'], ['仲裁协议', 'arbitration agreement'], ['仲裁裁决', 'arbitral award'],
  ['诉讼', 'litigation'], ['管辖', 'jurisdiction'], ['时效', 'limitation period'], ['执行', 'enforcement'],
  ['承认与执行', 'recognition and enforcement'], ['调解', 'mediation'],
  ['负面清单', 'negative list'], ['市场准入', 'market access'], ['投资促进', 'investment promotion'],
  ['备案', 'filing'], ['核准', 'approval'], ['审批', 'approval'], ['行政许可', 'administrative licence'],
  ['外汇', 'foreign exchange'], ['资本项目', 'capital account'], ['经常项目', 'current account'],
  ['环境保护', 'environmental protection'], ['环境影响评价', 'environmental impact assessment'],
  ['排污许可', 'pollutant discharge permit'], ['安全生产', 'work safety'],
  ['公司法', 'company law'], ['劳动法', 'labour law'], ['投资法', 'investment law'], ['民法典', 'civil code'],
  ['刑法', 'criminal law'], ['宪法', 'constitution'], ['数据保护法', 'data protection law'],
  ['私募基金', 'private equity fund'], ['证券', 'securities'], ['银行', 'banking'], ['保险', 'insurance'],
  ['反垄断', 'antitrust'], ['反不正当竞争', 'anti-unfair competition'], ['经营者集中', 'concentration of undertakings'],
  ['政府采购', 'government procurement'], ['招标投标', 'bidding and tendering'],
  ['海关', 'customs'], ['原产地', 'country of origin'], ['自由贸易协定', 'free trade agreement'],
  ['争议解决', 'dispute resolution'], ['法律适用', 'applicable law'], ['司法协助', 'judicial assistance'],
  ['外国投资者', 'foreign investor'], ['投资总额', 'total investment'], ['出资', 'capital contribution'],
  ['增资', 'capital increase'], ['减资', 'capital reduction'], ['分红', 'dividend distribution'],
  ['代表处', 'representative office'], ['分公司', 'branch office'], ['子公司', 'subsidiary'],
  ['特许经营', 'franchise'], ['技术转让', 'technology transfer'], ['加工贸易', 'processing trade'],
  ['保税区', 'bonded zone'], ['经济特区', 'special economic zone'], ['工业园区', 'industrial park'],
  ['有限责任公司', 'limited liability company'], ['股份有限公司', 'joint stock company'],
  ['国有独资公司', 'wholly state-owned company'], ['一人公司', 'one-person company'],
  ['股东会', 'shareholders meeting'], ['股东大会', 'general meeting of shareholders'],
  ['决议', 'resolution'], ['章程修改', 'amendment of articles'], ['股权', 'equity'],
  ['优先股', 'preference share'], ['普通股', 'ordinary share'], ['实缴', 'paid-in'],
  ['认缴', 'subscribed'], ['出资期限', 'capital contribution deadline'], ['抽逃出资', 'withdrawal of capital'],
  ['关联交易', 'related party transaction'], ['实际控制人', 'actual controller'], ['一致行动人', 'concert party'],
  ['要约收购', 'tender offer'], ['信息披露', 'information disclosure'], ['内幕交易', 'insider trading'],
  ['短线交易', 'short-swing trading'], ['独立董事', 'independent director'], ['董事会秘书', 'board secretary'],
  ['高级管理人员', 'senior manager'], ['忠实义务', 'duty of loyalty'], ['勤勉义务', 'duty of diligence'],
  ['人格否认', 'piercing the corporate veil'], ['公司债券', 'corporate bond'], ['可转债', 'convertible bond'],
  ['增资扩股', 'capital increase by issuing shares'], ['股权激励', 'equity incentive'],
  ['劳动争议', 'labour dispute'], ['劳务派遣', 'labour dispatch'], ['非全日制', 'part-time employment'],
  ['集体合同', 'collective contract'], ['职工代表大会', 'employees congress'], ['工会', 'trade union'],
  ['停工停产', 'suspension of production'], ['经济性裁员', 'economic layoff'], ['医疗期', 'medical treatment period'],
  ['产假', 'maternity leave'], ['生育津贴', 'maternity allowance'], ['失业保险', 'unemployment insurance'],
  ['住房公积金', 'housing provident fund'], ['养老保险', 'pension insurance'], ['医疗保险', 'medical insurance'],
  ['职业病', 'occupational disease'], ['劳动保护', 'labour protection'], ['安全生产事故', 'work safety accident'],
  ['股权转让所得', 'income from equity transfer'], ['股息红利', 'dividends'], ['特许权使用费', 'royalty'],
  ['常设机构', 'permanent establishment'], ['税收协定', 'tax treaty'], ['转让定价文档', 'transfer pricing documentation'],
  ['同期资料', 'contemporaneous documentation'], ['海关估价', 'customs valuation'], ['出口退税', 'export tax rebate'],
  ['加计扣除', 'additional deduction'], ['税收居民', 'tax resident'], ['源泉扣缴', 'withholding at source'],
  ['发明专利', 'invention patent'], ['实用新型', 'utility model'], ['外观设计', 'industrial design'],
  ['驰名商标', 'well-known trademark'], ['地理标志', 'geographical indication'], ['集成电路布图设计', 'layout design of integrated circuit'],
  ['植物新品种', 'new plant variety'], ['职务发明', 'service invention'], ['专利实施许可', 'patent licensing'],
  ['商标异议', 'trademark opposition'], ['商标无效宣告', 'trademark invalidation'], ['著作权登记', 'copyright registration'],
  ['邻接权', 'neighbouring right'], ['技术秘密', 'know-how'], ['保密协议', 'confidentiality agreement'],
  ['个人信息处理者', 'personal information processor'], ['敏感个人信息', 'sensitive personal information'],
  ['单独同意', 'separate consent'], ['告知义务', 'notification obligation'], ['数据可携带权', 'right to data portability'],
  ['删除权', 'right to erasure'], ['数据本地化', 'data localisation'], ['出境安全评估', 'security assessment for outbound transfer'],
  ['标准合同', 'standard contract'], ['个人信息保护影响评估', 'personal information protection impact assessment'],
  ['数据出境', 'outbound data transfer'], ['网络运营者', 'network operator'], ['关键信息基础设施', 'critical information infrastructure'],
  ['数据安全事件', 'data security incident'], ['漏洞', 'vulnerability'], ['入侵', 'intrusion'],
  ['不动产登记', 'real property registration'], ['建设用地', 'construction land'], ['耕地', 'arable land'],
  ['宅基地', 'homestead land'], ['土地出让', 'land grant'], ['招拍挂', 'bidding auction and listing'],
  ['房屋租赁', 'premises lease'], ['建设工程', 'construction project'], ['竣工验收', 'completion acceptance'],
  ['工程款', 'construction payment'], ['优先受偿权', 'priority right of repayment'],
  ['买卖合同', 'sales contract'], ['承揽合同', 'work contract'], ['委托合同', 'mandate contract'],
  ['借款合同', 'loan contract'], ['保证合同', 'suretyship contract'], ['货物买卖', 'sale of goods'],
  ['预期违约', 'anticipatory breach'], ['解除合同', 'rescission of contract'], ['违约金', 'liquidated damages'],
  ['定金罚则', 'deposit penalty rule'], ['情势变更', 'change of circumstances'], ['格式条款', 'standard terms'],
  ['缔约过失', 'culpa in contrahendo'], ['债权转让', 'assignment of claim'], ['债务承担', 'assumption of debt'],
  ['诉讼时效', 'limitation of action'], ['除斥期间', 'preclusive period'], ['保全措施', 'preservation measure'],
  ['证据', 'evidence'], ['举证责任', 'burden of proof'], ['公证', 'notarisation'], ['鉴定', 'expert appraisal'],
  ['一审', 'first instance'], ['二审', 'second instance'], ['再审', 'retrial'], ['强制执行', 'compulsory enforcement'],
  ['财产保全', 'property preservation'], ['临时措施', 'interim measure'], ['专家裁决', 'expert determination'],
  ['投资保护', 'investment protection'], ['征收补偿', 'compensation for expropriation'], ['国有化', 'nationalisation'],
  ['最惠国待遇', 'most-favoured-nation treatment'], ['国民待遇', 'national treatment'], ['公平公正待遇', 'fair and equitable treatment'],
  ['投资者与国家争端解决', 'investor-state dispute settlement'], ['双边投资协定', 'bilateral investment treaty'],
  ['自由贸易区', 'free trade zone'], ['综合保税区', 'comprehensive bonded zone'], ['跨境服务贸易', 'cross-border trade in services'],
  ['电子商务', 'e-commerce'], ['数字贸易', 'digital trade'], ['竞争中立', 'competitive neutrality'],
  ['政府采购', 'government procurement'], ['知识产权边境措施', 'border measures for intellectual property'],
  ['反倾销', 'anti-dumping'], ['反补贴', 'countervailing'], ['保障措施', 'safeguard measure'],
  ['原产地规则', 'rules of origin'], ['关税配额', 'tariff quota'], ['卫生与植物卫生措施', 'sanitary and phytosanitary measures'],
  ['技术性贸易壁垒', 'technical barriers to trade'],
  ['反洗钱', 'anti-money laundering'], ['受益所有人', 'beneficial owner'], ['跨境支付', 'cross-border payment'],
  ['私募股权', 'private equity'], ['风险投资', 'venture capital'], ['资产管理', 'asset management'],
  ['融资租赁', 'financial leasing'], ['担保物权', 'security interest'], ['质押', 'pledge'], ['留置', 'lien'],
  ['票据', 'negotiable instrument'], ['信用证', 'letter of credit'], ['保函', 'letter of guarantee'],
  ['环境污染', 'environmental pollution'], ['生态保护红线', 'ecological conservation red line'],
  ['碳交易', 'carbon trading'], ['碳排放', 'carbon emission'], ['固废', 'solid waste'],
  ['危险废物', 'hazardous waste'], ['环境损害赔偿', 'environmental damage compensation'],
  ['公益诉讼', 'public interest litigation'], ['行政处罚', 'administrative penalty'], ['行政强制', 'administrative coercion'],
  ['行政复议', 'administrative reconsideration'], ['行政诉讼', 'administrative litigation'],
  ['行政许可', 'administrative licence'], ['行政处罚听证', 'administrative penalty hearing'],
  ['政府信息公开', 'government information disclosure'], ['保密义务', 'confidentiality obligation'],
  ['刑法', 'criminal law'], ['犯罪构成', 'elements of crime'], ['单位犯罪', 'corporate crime'],
  ['走私', 'smuggling'], ['逃税', 'tax evasion'], ['职务侵占', 'job embezzlement'], ['商业贿赂', 'commercial bribery'],
  ['洗钱罪', 'money laundering offence'], ['侵犯商业秘密罪', 'crime of infringing trade secrets'],
  ['管辖异议', 'jurisdictional objection'], ['送达', 'service of process'], ['缺席判决', 'default judgment'],
  ['破产重整', 'bankruptcy reorganisation'], ['破产清算', 'bankruptcy liquidation'], ['债权人会议', 'creditors meeting'],
  ['管理人', 'administrator'], ['债权申报', 'claim declaration'], ['别除权', 'right of separate satisfaction'],
  ['撤销权', 'right of avoidance'], ['抵销', 'set-off'],
];
console.log('  人工整理中↔英: ' + MANUAL_ZH_EN.length + ' 对');

// ---------------- 人工整理：英 ↔ 泰/越/印尼/马来（常用法律术语，未核验） ----------------
const MANUAL_LOCAL = {
  th: [
    ['contract', 'สัญญา'], ['employer', 'นายจ้าง'], ['employee', 'ลูกจ้าง'], ['severance', 'ค่าชดเชย'],
    ['termination', 'เลิกจ้าง'], ['wage', 'ค่าจ้าง'], ['tax', 'ภาษี'], ['company', 'บริษัท'],
    ['capital', 'ทุน'], ['investment', 'การลงทุน'], ['land', 'ที่ดิน'], ['patent', 'สิทธิบัตร'],
    ['trademark', 'เครื่องหมายการค้า'], ['copyright', 'ลิขสิทธิ์'], ['personal data', 'ข้อมูลส่วนบุคคล'],
    ['consent', 'ความยินยอม'], ['penalty', 'โทษ'], ['licence', 'ใบอนุญาต'], ['foreigner', 'คนต่างด้าว'],
    ['arbitration', 'อนุญาโตตุลาการ'], ['court', 'ศาล'], ['regulation', 'ข้อบังคับ'], ['notice', 'บอกกล่าว'],
  ],
  vi: [
    ['contract', 'hợp đồng'], ['employer', 'người sử dụng lao động'], ['employee', 'người lao động'],
    ['severance', 'trợ cấp thôi việc'], ['termination', 'chấm dứt'], ['wage', 'tiền lương'], ['tax', 'thuế'],
    ['company', 'công ty'], ['capital', 'vốn'], ['investment', 'đầu tư'], ['land', 'đất'],
    ['patent', 'sáng chế'], ['trademark', 'nhãn hiệu'], ['copyright', 'quyền tác giả'],
    ['personal data', 'dữ liệu cá nhân'], ['consent', 'sự đồng ý'], ['licence', 'giấy phép'],
    ['arbitration', 'trọng tài'], ['enterprise', 'doanh nghiệp'], ['shareholder', 'cổ đông'],
    ['notice', 'báo trước'], ['termination of contract', 'chấm dứt hợp đồng'],
  ],
  id: [
    ['contract', 'perjanjian'], ['employer', 'pemberi kerja'], ['employee', 'pekerja'], ['severance', 'pesangon'],
    ['termination', 'pemutusan hubungan kerja'], ['wage', 'upah'], ['tax', 'pajak'], ['company', 'perseroan'],
    ['capital', 'modal'], ['investment', 'penanaman modal'], ['land', 'tanah'], ['patent', 'paten'],
    ['trademark', 'merek'], ['copyright', 'hak cipta'], ['personal data', 'data pribadi'],
    ['consent', 'persetujuan'], ['licence', 'izin'], ['arbitration', 'arbitrase'], ['shareholder', 'pemegang saham'],
    ['minimum wage', 'upah minimum'],
  ],
  ms: [
    ['contract', 'kontrak'], ['employer', 'majikan'], ['employee', 'pekerja'], ['severance', 'pampasan'],
    ['termination', 'penamatan'], ['wage', 'upah'], ['tax', 'cukai'], ['company', 'syarikat'],
    ['capital', 'modal'], ['investment', 'pelaburan'], ['land', 'tanah'], ['patent', 'paten'],
    ['trademark', 'tanda dagangan'], ['copyright', 'hak cipta'], ['personal data', 'data peribadi'],
    ['consent', 'persetujuan'], ['licence', 'lesen'], ['arbitration', 'timbangtara'], ['shareholder', 'pemegang saham'],
  ],
};
let locCount = 0; Object.keys(MANUAL_LOCAL).forEach(k => locCount += MANUAL_LOCAL[k].length);
console.log('  人工整理英↔当地语言: ' + locCount + ' 对（泰/越/印尼/马来，未核验）');

// ---------------- 组装 ----------------
const BRIDGE = Object.create(null);
function addTerm(term, lang, value, src) {
  if (!term || !value) return;
  var key = String(term).toLowerCase();
  var e = BRIDGE[key] || (BRIDGE[key] = { zh: [], en: [], th: [], vi: [], id: [], ms: [], src: {} });
  if ((e[lang] || []).indexOf(value) < 0) (e[lang] = e[lang] || []).push(value);
  e.src[lang] = src;
}
for (const [z, e] of MANUAL_ZH_EN) {
  addTerm(z, 'zh', z, 'curated'); addTerm(z, 'en', e, 'curated');
  addTerm(e, 'en', e, 'curated'); addTerm(e, 'zh', z, 'curated');
}
for (const p of curatedMined) {
  addTerm(p.zh, 'zh', p.zh, 'mined'); addTerm(p.zh, 'en', p.en, 'mined');
  addTerm(p.en, 'en', p.en, 'mined'); addTerm(p.en, 'zh', p.zh, 'mined');
}
for (const lang of Object.keys(MANUAL_LOCAL)) {
  for (const [e, l] of MANUAL_LOCAL[lang]) {
    addTerm(e, 'en', e, 'curated');
    addTerm(e, lang, l, 'curated');
    addTerm(l, lang, l, 'curated');
    addTerm(l, 'en', e, 'curated');
  }
}

const keys = Object.keys(BRIDGE);
const stats = { zh: 0, en: 0, th: 0, vi: 0, id: 0, ms: 0 };
let minedSrc = 0, curatedSrc = 0;
for (const k of keys) {
  for (const lang of ['zh', 'en', 'th', 'vi', 'id', 'ms']) if (BRIDGE[k][lang].length) stats[lang]++;
  if (Object.values(BRIDGE[k].src).indexOf('mined') >= 0) minedSrc++; else curatedSrc++;
}

const payload = JSON.stringify(BRIDGE);
const js = '/* CALR · 跨语言法律术语桥（由 _work/rag/build-bridge.js 生成，请勿手工编辑）\n'
  + '   数据来源：①原型 trans 层 6,841 条中英平行条目 PMI 挖掘（src:"mined"）\n'
  + '             ②人工整理的中英基础法律术语 + 英↔泰/越/印尼/马来常用术语（src:"curated"，未经母语者核验） */\n'
  + '(function (root) {\n  \'use strict\';\n  root.CALR_TERMS_BRIDGE = ' + payload + ';\n'
  + '})(typeof window !== "undefined" ? window : this);\n';
fs.writeFileSync(path.join(PROTO, 'data/terms-bridge.js'), js, 'utf8');

console.log('');
console.log('  ═══ 术语桥构建完成 ═══');
console.log('  词条总数        : ' + keys.length);
console.log('  含中文          : ' + stats.zh);
console.log('  含英文          : ' + stats.en);
console.log('  含泰文          : ' + stats.th);
console.log('  含越南文        : ' + stats.vi);
console.log('  含印尼文        : ' + stats.id);
console.log('  含马来文        : ' + stats.ms);
console.log('  来自挖掘 / 人工 : ' + minedSrc + ' / ' + curatedSrc);
console.log('  输出            : prototype/data/terms-bridge.js  (' + (Buffer.byteLength(js) / 1024).toFixed(0) + ' KB)');
console.log('');
console.log('  挖掘样例（前 12 对）:');
curatedMined.slice(0, 12).forEach(p => console.log('    ' + p.zh + '  ↔  ' + p.en + '   c=' + p.c + ' pmi=' + p.pmi));
