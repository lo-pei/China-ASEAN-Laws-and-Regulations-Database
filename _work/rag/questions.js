// CALR 检索评测题集（Day 1）
// 每题字段：
//   q        中文提问（模拟真实用户）
//   cc       法域代码（CN/VN/TH/MY/SG/ID/PH/KH/LA/MM/BN/TL）
//   topic    主题
//   zh/en    概念关键词（用于自动标注金标条文）
//   loc      当地语言关键词（可选；来自通用法律常识，未经母语者逐条核验，标注时会单独统计）
//
// 金标口径：该法域内某条文正文包含上述任一关键词 → 视为「可能相关条文」
// （这是机械可复现的弱标注，不是人工精标；报告里会区分 zh/en 命中与 loc 命中）

module.exports = [
  /* ---------------- 中国 CN ---------------- */
  { q: '中国外商投资准入负面清单是怎么规定的？', cc: 'CN', topic: '外商投资', zh: ['负面清单', '准入'], en: ['negative list', 'market access'] },
  { q: '中国公司注册资本认缴期限有什么要求？', cc: 'CN', topic: '公司', zh: ['注册资本', '认缴'], en: ['registered capital', 'subscription'] },
  { q: '中国劳动合同解除需要支付经济补偿吗？', cc: 'CN', topic: '劳动', zh: ['经济补偿', '解除劳动合同'], en: ['severance', 'termination of labor contract'] },
  { q: '中国个人信息出境需要满足什么条件？', cc: 'CN', topic: '数据', zh: ['个人信息', '出境'], en: ['personal information', 'cross-border'] },
  { q: '中国数据分类分级保护制度是什么？', cc: 'CN', topic: '数据', zh: ['数据分类分级', '重要数据'], en: ['data classification', 'important data'] },
  { q: '中国专利侵权的赔偿数额如何确定？', cc: 'CN', topic: '知识产权', zh: ['专利', '赔偿数额'], en: ['patent', 'damages'] },
  { q: '中国外商投资企业可以采取哪些组织形式？', cc: 'CN', topic: '外商投资', zh: ['外商投资企业', '组织形式'], en: ['foreign-invested enterprise', 'form of organization'] },
  { q: '中国劳动争议仲裁的时效期间是多久？', cc: 'CN', topic: '争议解决', zh: ['仲裁', '时效'], en: ['arbitration', 'limitation'] },
  { q: '中国网络安全等级保护制度的要求是什么？', cc: 'CN', topic: '数据', zh: ['网络安全', '等级保护'], en: ['cybersecurity', 'classified protection'] },
  { q: '中国企业境外投资的备案核准程序是什么？', cc: 'CN', topic: '外商投资', zh: ['境外投资', '备案', '核准'], en: ['outbound investment', 'filing', 'approval'] },

  /* ---------------- 越南 VN ---------------- */
  { q: '越南外资企业的最低注册资本要求是什么？', cc: 'VN', topic: '外商投资', zh: ['注册资本', '投资'], en: ['charter capital', 'investment'], loc: ['vốn đầu tư', 'vốn pháp định'] },
  { q: '越南劳动合同终止的条件有哪些？', cc: 'VN', topic: '劳动', zh: ['劳动合同', '终止'], en: ['labour contract', 'termination'], loc: ['hợp đồng lao động', 'chấm dứt'] },
  { q: '越南雇主解雇员工需要提前多久通知？', cc: 'VN', topic: '劳动', zh: ['通知', '解雇'], en: ['notice', 'dismissal'], loc: ['báo trước', 'sa thải'] },
  { q: '越南个人数据保护法对同意规则如何规定？', cc: 'VN', topic: '数据', zh: ['个人数据', '同意'], en: ['personal data', 'consent'], loc: ['dữ liệu cá nhân', 'sự đồng ý'] },
  { q: '越南外商投资享受哪些税收优惠？', cc: 'VN', topic: '税务', zh: ['税收优惠', '企业所得税'], en: ['tax incentive', 'corporate income tax'], loc: ['ưu đãi thuế', 'thuế thu nhập doanh nghiệp'] },
  { q: '越南有限责任公司股东人数有什么限制？', cc: 'VN', topic: '公司', zh: ['有限责任公司', '股东'], en: ['limited liability company', 'member'], loc: ['công ty trách nhiệm hữu hạn', 'thành viên'] },
  { q: '越南土地使用权取得方式有哪些？', cc: 'VN', topic: '土地', zh: ['土地使用权'], en: ['land use right'], loc: ['quyền sử dụng đất'] },
  { q: '越南仲裁裁决的承认与执行如何规定？', cc: 'VN', topic: '争议解决', zh: ['仲裁', '承认与执行'], en: ['arbitration', 'recognition and enforcement'], loc: ['trọng tài'] },
  { q: '越南知识产权侵权救济措施有哪些？', cc: 'VN', topic: '知识产权', zh: ['知识产权', '侵权'], en: ['intellectual property', 'infringement'], loc: ['sở hữu trí tuệ', 'xâm phạm'] },
  { q: '越南外汇管理对资本项目的要求是什么？', cc: 'VN', topic: '金融', zh: ['外汇', '资本项目'], en: ['foreign exchange', 'capital account'] },

  /* ---------------- 泰国 TH ---------------- */
  { q: '泰国劳动法关于经济补偿金怎么规定？', cc: 'TH', topic: '劳动', zh: ['经济补偿', '补偿'], en: ['severance', 'compensation'], loc: ['ค่าชดเชย'] },
  { q: '泰国雇主解雇员工的条件和程序是什么？', cc: 'TH', topic: '劳动', zh: ['解雇', '终止雇佣'], en: ['termination', 'dismissal'], loc: ['เลิกจ้าง'] },
  { q: '泰国外商投资受外商经营法限制的行业有哪些？', cc: 'TH', topic: '外商投资', zh: ['外商经营', '限制'], en: ['foreign business', 'restricted'], loc: ['การประกอบธุรกิจของคนต่างด้าว'] },
  { q: '泰国个人数据保护法对数据控制者的义务是什么？', cc: 'TH', topic: '数据', zh: ['个人数据', '数据控制者'], en: ['personal data', 'data controller'], loc: ['ข้อมูลส่วนบุคคล'] },
  { q: '泰国公司注册资本最低要求是多少？', cc: 'TH', topic: '公司', zh: ['注册资本'], en: ['registered capital'], loc: ['ทุนจดทะเบียน'] },
  { q: '泰国雇佣外籍员工的签证和工作许可要求是什么？', cc: 'TH', topic: '劳动', zh: ['工作许可', '外籍'], en: ['work permit', 'foreigner'], loc: ['ใบอนุญาตทำงาน'] },
  { q: '泰国专利保护期限是多久？', cc: 'TH', topic: '知识产权', zh: ['专利', '保护期限'], en: ['patent', 'term'], loc: ['สิทธิบัตร'] },
  { q: '泰国增值税税率和征收范围是什么？', cc: 'TH', topic: '税务', zh: ['增值税'], en: ['value added tax', 'VAT'], loc: ['ภาษีมูลค่าเพิ่ม'] },
  { q: '泰国土地所有权对外国人的限制是什么？', cc: 'TH', topic: '土地', zh: ['土地', '外国人'], en: ['land', 'alien', 'foreigner'], loc: ['ที่ดิน'] },
  { q: '泰国商业秘密的保护条件是什么？', cc: 'TH', topic: '知识产权', zh: ['商业秘密'], en: ['trade secret'], loc: ['ความลับทางการค้า'] },

  /* ---------------- 马来西亚 MY ---------------- */
  { q: '马来西亚公司法的年度申报要求是什么？', cc: 'MY', topic: '公司', zh: ['年度申报', '年报'], en: ['annual return', 'annual filing'] },
  { q: '马来西亚雇佣合同终止的法定赔偿是什么？', cc: 'MY', topic: '劳动', zh: ['终止', '赔偿'], en: ['termination', 'compensation'], loc: ['kontrak', 'pampasan'] },
  { q: '马来西亚个人数据保护法对数据使用者的义务是什么？', cc: 'MY', topic: '数据', zh: ['个人数据', '数据使用者'], en: ['personal data', 'data user'] },
  { q: '马来西亚外商投资制造业的持股比例限制是什么？', cc: 'MY', topic: '外商投资', zh: ['制造业', '持股'], en: ['manufacturing', 'equity'] },
  { q: '马来西亚最低工资标准是多少？', cc: 'MY', topic: '劳动', zh: ['最低工资'], en: ['minimum wage'] },
  { q: '马来西亚公司董事的资格要求是什么？', cc: 'MY', topic: '公司', zh: ['董事', '资格'], en: ['director', 'qualification'] },
  { q: '马来西亚石油和天然气行业的外资准入要求是什么？', cc: 'MY', topic: '能源', zh: ['石油', '天然气'], en: ['petroleum', 'gas'] },
  { q: '马来西亚知识产权侵权的行政救济途径有哪些？', cc: 'MY', topic: '知识产权', zh: ['知识产权', '救济'], en: ['intellectual property', 'remedy'] },
  { q: '马来西亚环境影响的评估要求是什么？', cc: 'MY', topic: '环境', zh: ['环境影响', '评估'], en: ['environmental impact', 'assessment'] },
  { q: '马来西亚仲裁法对仲裁协议的要求是什么？', cc: 'MY', topic: '争议解决', zh: ['仲裁协议'], en: ['arbitration agreement'] },

  /* ---------------- 新加坡 SG ---------------- */
  { q: '新加坡公司法的年度申报要求是什么？', cc: 'SG', topic: '公司', zh: ['年度申报', '周年申报'], en: ['annual return', 'annual filing'] },
  { q: '新加坡雇佣法对解雇通知期的规定是什么？', cc: 'SG', topic: '劳动', zh: ['通知期', '解雇'], en: ['notice period', 'termination'] },
  { q: '新加坡个人数据保护法的同意例外情形有哪些？', cc: 'SG', topic: '数据', zh: ['个人数据', '同意'], en: ['personal data', 'consent'] },
  { q: '新加坡公司董事的职责和义务是什么？', cc: 'SG', topic: '公司', zh: ['董事', '职责'], en: ['director', 'duty'] },
  { q: '新加坡外商投资需要审批吗？', cc: 'SG', topic: '外商投资', zh: ['外商投资', '审批'], en: ['foreign investment', 'approval'] },
  { q: '新加坡专利侵权的抗辩事由有哪些？', cc: 'SG', topic: '知识产权', zh: ['专利', '抗辩'], en: ['patent', 'defence'] },
  { q: '新加坡雇佣外籍劳工的工作准证类型有哪些？', cc: 'SG', topic: '劳动', zh: ['工作准证', '外籍'], en: ['work pass', 'foreign worker'] },
  { q: '新加坡商品与服务税的税率是多少？', cc: 'SG', topic: '税务', zh: ['商品与服务税', '消费税'], en: ['goods and services tax', 'GST'] },
  { q: '新加坡公司清盘的法定程序是什么？', cc: 'SG', topic: '公司', zh: ['清盘', '清算'], en: ['winding up', 'liquidation'] },
  { q: '新加坡仲裁法与国际仲裁的衔接规则是什么？', cc: 'SG', topic: '争议解决', zh: ['国际仲裁'], en: ['international arbitration'] },

  /* ---------------- 印尼 ID ---------------- */
  { q: '印尼个人数据保护法的主要内容是什么？', cc: 'ID', topic: '数据', zh: ['个人数据'], en: ['personal data'], loc: ['data pribadi'] },
  { q: '印尼外商投资的最低资本要求是多少？', cc: 'ID', topic: '外商投资', zh: ['投资', '资本'], en: ['investment', 'capital'], loc: ['modal', 'penanaman modal'] },
  { q: '印尼劳动合同的类型和期限规定是什么？', cc: 'ID', topic: '劳动', zh: ['劳动合同', '期限'], en: ['employment contract', 'term'], loc: ['perjanjian kerja'] },
  { q: '印尼雇主终止雇佣关系的补偿规定是什么？', cc: 'ID', topic: '劳动', zh: ['终止雇佣', '补偿'], en: ['termination', 'compensation'], loc: ['pemutusan hubungan kerja', 'pesangon'] },
  { q: '印尼有限责任公司的股东责任是什么？', cc: 'ID', topic: '公司', zh: ['有限责任公司', '股东责任'], en: ['limited liability', 'shareholder'] },
  { q: '印尼禁止外商投资负面清单的规定是什么？', cc: 'ID', topic: '外商投资', zh: ['负面清单', '投资'], en: ['negative list', 'investment'] },
  { q: '印尼版权保护期限是多久？', cc: 'ID', topic: '知识产权', zh: ['版权', '保护期限'], en: ['copyright', 'term'] },
  { q: '印尼增值税税率是多少？', cc: 'ID', topic: '税务', zh: ['增值税'], en: ['value added tax', 'VAT'], loc: ['pajak pertambahan nilai'] },
  { q: '印尼土地权利类型有哪些？', cc: 'ID', topic: '土地', zh: ['土地', '权利'], en: ['land', 'right'], loc: ['tanah', 'hak'] },
  { q: '印尼仲裁裁决的执行程序是什么？', cc: 'ID', topic: '争议解决', zh: ['仲裁', '执行'], en: ['arbitration', 'enforcement'], loc: ['arbitrase'] },

  /* ---------------- 菲律宾 PH ---------------- */
  { q: '菲律宾外商投资负面清单的规定是什么？', cc: 'PH', topic: '外商投资', zh: ['负面清单', '外商投资'], en: ['negative list', 'foreign investment'] },
  { q: '菲律宾劳工法关于遣散费的规定是什么？', cc: 'PH', topic: '劳动', zh: ['遣散费', '补偿'], en: ['separation pay', 'severance'], loc: ['kontrata', 'sahod'] },
  { q: '菲律宾数据隐私法对个人信息的保护要求是什么？', cc: 'PH', topic: '数据', zh: ['个人信息', '隐私'], en: ['personal information', 'privacy'] },
  { q: '菲律宾公司法对外资持股比例的限制是什么？', cc: 'PH', topic: '公司', zh: ['外资', '持股'], en: ['foreign equity', 'ownership'] },
  { q: '菲律宾雇佣外籍人士的工作签证要求是什么？', cc: 'PH', topic: '劳动', zh: ['工作签证', '外籍'], en: ['work visa', 'foreign national'] },
  { q: '菲律宾知识产权侵权的处罚规定是什么？', cc: 'PH', topic: '知识产权', zh: ['知识产权', '处罚'], en: ['intellectual property', 'penalty'] },
  { q: '菲律宾税收居民的认定标准是什么？', cc: 'PH', topic: '税务', zh: ['税收居民'], en: ['resident taxpayer'] },
  { q: '菲律宾零售贸易市场对外资的开放规定是什么？', cc: 'PH', topic: '外商投资', zh: ['零售贸易'], en: ['retail trade'] },
  { q: '菲律宾电力行业的投资准入条件是什么？', cc: 'PH', topic: '能源', zh: ['电力'], en: ['electric power', 'power'] },
  { q: '菲律宾环境合规证书的申领要求是什么？', cc: 'PH', topic: '环境', zh: ['环境合规'], en: ['environmental compliance', 'clearance'] },

  /* ---------------- 柬埔寨 KH ---------------- */
  { q: '柬埔寨外商投资的法律形式有哪些？', cc: 'KH', topic: '外商投资', zh: ['外商投资'], en: ['foreign investment'], loc: ['ការវិនិយោគ'] },
  { q: '柬埔寨劳动法对劳动合同期限的规定是什么？', cc: 'KH', topic: '劳动', zh: ['劳动合同', '期限'], en: ['labour contract', 'term'], loc: ['កិច្ចសន្យា'] },
  { q: '柬埔寨土地所有权对外国人的规定是什么？', cc: 'KH', topic: '土地', zh: ['土地', '外国人'], en: ['land', 'foreigner'] },
  { q: '柬埔寨合格投资项目享受哪些优惠？', cc: 'KH', topic: '外商投资', zh: ['投资项目', '优惠'], en: ['qualified investment project', 'incentive'] },
  { q: '柬埔寨最低工资标准是多少？', cc: 'KH', topic: '劳动', zh: ['最低工资'], en: ['minimum wage'] },
  { q: '柬埔寨知识产权保护的法律框架是什么？', cc: 'KH', topic: '知识产权', zh: ['知识产权'], en: ['intellectual property'] },
  { q: '柬埔寨商业注册的登记要求是什么？', cc: 'KH', topic: '公司', zh: ['商业注册', '登记'], en: ['commercial registration'] },
  { q: '柬埔寨仲裁的法律依据是什么？', cc: 'KH', topic: '争议解决', zh: ['仲裁'], en: ['arbitration'] },

  /* ---------------- 老挝 LA ---------------- */
  { q: '老挝外商投资企业的注册程序是什么？', cc: 'LA', topic: '外商投资', zh: ['外商投资', '注册'], en: ['foreign investment', 'registration'] },
  { q: '老挝劳动法关于工作时间的规定是什么？', cc: 'LA', topic: '劳动', zh: ['工作时间'], en: ['working hours'] },
  { q: '老挝土地的使用权规定是什么？', cc: 'LA', topic: '土地', zh: ['土地使用权'], en: ['land use right'] },
  { q: '老挝投资促进法规定的优惠政策有哪些？', cc: 'LA', topic: '外商投资', zh: ['投资促进', '优惠'], en: ['investment promotion', 'incentive'] },
  { q: '老挝雇员终止雇佣的补偿规定是什么？', cc: 'LA', topic: '劳动', zh: ['终止雇佣', '补偿'], en: ['termination', 'compensation'] },
  { q: '老挝公司设立的最低注册资本要求是什么？', cc: 'LA', topic: '公司', zh: ['注册资本'], en: ['registered capital'] },
  { q: '老挝知识产权登记的要求是什么？', cc: 'LA', topic: '知识产权', zh: ['知识产权', '登记'], en: ['intellectual property', 'registration'] },
  { q: '老挝争议解决的方式有哪些？', cc: 'LA', topic: '争议解决', zh: ['争议解决', '仲裁'], en: ['dispute resolution', 'arbitration'] },

  /* ---------------- 缅甸 MM ---------------- */
  { q: '缅甸外商投资法对外资持股的规定是什么？', cc: 'MM', topic: '外商投资', zh: ['外商投资', '持股'], en: ['foreign investment', 'equity'] },
  { q: '缅甸公司法对公司的设立要求是什么？', cc: 'MM', topic: '公司', zh: ['公司', '设立'], en: ['company', 'incorporation'] },
  { q: '缅甸劳动法关于最低工资的规定是什么？', cc: 'MM', topic: '劳动', zh: ['最低工资'], en: ['minimum wage'] },
  { q: '缅甸土地租赁对外国投资者的期限规定是什么？', cc: 'MM', topic: '土地', zh: ['土地租赁', '期限'], en: ['land lease', 'term'] },
  { q: '缅甸知识产权保护的注册程序是什么？', cc: 'MM', topic: '知识产权', zh: ['知识产权', '注册'], en: ['intellectual property', 'registration'] },
  { q: '缅甸税务登记和纳税申报的要求是什么？', cc: 'MM', topic: '税务', zh: ['税务登记', '纳税申报'], en: ['tax registration', 'tax return'] },
  { q: '缅甸劳动合同的解除条件是什么？', cc: 'MM', topic: '劳动', zh: ['劳动合同', '解除'], en: ['labour contract', 'termination'] },
  { q: '缅甸仲裁法的适用范围是什么？', cc: 'MM', topic: '争议解决', zh: ['仲裁'], en: ['arbitration'] },

  /* ---------------- 文莱 BN ---------------- */
  { q: '文莱外商投资的审批要求是什么？', cc: 'BN', topic: '外商投资', zh: ['外商投资', '审批'], en: ['foreign investment', 'approval'] },
  { q: '文莱公司法对董事的要求是什么？', cc: 'BN', topic: '公司', zh: ['公司', '董事'], en: ['company', 'director'] },
  { q: '文莱劳动法关于雇佣合同的规定是什么？', cc: 'BN', topic: '劳动', zh: ['雇佣合同'], en: ['employment contract'], loc: ['kontrak'] },
  { q: '文莱个人所得税的税率是多少？', cc: 'BN', topic: '税务', zh: ['个人所得税'], en: ['income tax'] },
  { q: '文莱土地所有权对外国人的限制是什么？', cc: 'BN', topic: '土地', zh: ['土地', '外国人'], en: ['land', 'foreigner'] },
  { q: '文莱知识产权登记的范围包括哪些？', cc: 'BN', topic: '知识产权', zh: ['知识产权', '登记'], en: ['intellectual property', 'registration'] },
  { q: '文莱雇佣外籍员工的许可要求是什么？', cc: 'BN', topic: '劳动', zh: ['外籍', '许可'], en: ['foreign worker', 'licence'] },
  { q: '文莱商业登记的程序是什么？', cc: 'BN', topic: '公司', zh: ['商业登记'], en: ['business registration'] },

  /* ---------------- 东帝汶 TL ---------------- */
  { q: '东帝汶外商投资的法律框架是什么？', cc: 'TL', topic: '外商投资', zh: ['外商投资'], en: ['foreign investment'], loc: ['investimento'] },
  { q: '东帝汶劳动法关于劳动合同的规定是什么？', cc: 'TL', topic: '劳动', zh: ['劳动合同'], en: ['labour contract'], loc: ['contrato'] },
  { q: '东帝汶土地权利的法律规定是什么？', cc: 'TL', topic: '土地', zh: ['土地'], en: ['land'], loc: ['terra'] },
  { q: '东帝汶公司注册的要求是什么？', cc: 'TL', topic: '公司', zh: ['公司注册'], en: ['company registration'] },
  { q: '东帝汶税务制度的基本规定是什么？', cc: 'TL', topic: '税务', zh: ['税务'], en: ['tax'], loc: ['imposto'] },
  { q: '东帝汶仲裁机制的建立依据是什么？', cc: 'TL', topic: '争议解决', zh: ['仲裁'], en: ['arbitration'] },
  { q: '东帝汶石油资源开发的法律安排是什么？', cc: 'TL', topic: '能源', zh: ['石油'], en: ['petroleum'] },
  { q: '东帝汶投资优惠政策的适用条件是什么？', cc: 'TL', topic: '外商投资', zh: ['投资优惠', '优惠'], en: ['investment incentive'] },
];
