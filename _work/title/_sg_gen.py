# -*- coding: utf-8 -*-
"""SG 标题中译生成器（临时脚本）"""
import json, re

COUNTRY = {
    'Brazil': '巴西', 'Brunei': '文莱', 'Brunei Darussalam': '文莱',
    'Cyprus': '塞浦路斯', 'Greece': '希腊', 'Israel': '以色列', 'Italy': '意大利',
    'Jersey': '泽西', 'Jordan': '约旦', 'Korea': '韩国', 'Latvia': '拉脱维亚',
    'Libya': '利比亚', 'Mexico': '墨西哥', 'Norway': '挪威', 'Panama': '巴拿马',
    'Poland': '波兰', 'Russia': '俄罗斯', 'Rwanda': '卢旺达', 'Serbia': '塞尔维亚',
    'Turkey': '土耳其', 'Malaysia': '马来西亚', 'Belgium': '比利时', 'Canada': '加拿大',
    'Denmark': '丹麦', 'Ecuador': '厄瓜多尔', 'Estonia': '爱沙尼亚', 'Finland': '芬兰',
    'France': '法国', 'Georgia': '格鲁吉亚', 'Germany': '德国', 'Hungary': '匈牙利',
    'Ireland': '爱尔兰', 'Morocco': '摩洛哥', 'Nigeria': '尼日利亚', 'Romania': '罗马尼亚',
    'Sweden': '瑞典', 'Tunisia': '突尼斯', 'Ukraine': '乌克兰', 'Uruguay': '乌拉圭',
    'Vietnam': '越南', 'Bahrain': '巴林', 'Bulgaria': '保加利亚', 'Cambodia': '柬埔寨',
    'Ethiopia': '埃塞俄比亚', 'Guernsey': '根西', 'Mongolia': '蒙古', 'Pakistan': '巴基斯坦',
    'Portugal': '葡萄牙', 'Slovenia': '斯洛文尼亚', 'Thailand': '泰国', 'Indonesia': '印度尼西亚',
    'Lithuania': '立陶宛', 'Mauritius': '毛里求斯', 'Sri Lanka': '斯里兰卡',
    'Kazakhstan': '哈萨克斯坦', 'Luxembourg': '卢森堡', 'San Marino': '圣马力诺',
    'Seychelles': '塞舌尔', 'Uzbekistan': '乌兹别克斯坦', 'Isle of Man': '马恩岛',
    'New Zealand': '新西兰', 'Switzerland': '瑞士', 'Netherlands': '荷兰',
    'Philippines': '菲律宾', 'Saudi Arabia': '沙特阿拉伯', 'South Africa': '南非',
    'Turkmenistan': '土库曼斯坦', 'Liechtenstein': '列支敦士登', 'Czech Republic': '捷克',
    'United Kingdom': '英国', 'Slovak Republic': '斯洛伐克',
    'Papua New Guinea': '巴布亚新几内亚', 'Bermuda': '百慕大',
    'Lao People\u2019s Democratic Republic': '老挝人民民主共和国',
    'Hong Kong Special Administrative Region of the People\u2019s Republic of China': '中华人民共和国香港特别行政区',
    'Republic of China': '中国台湾地区',
    'Republic of Kenya': '肯尼亚共和国',
    'People\u2019s Republic of China': '中华人民共和国',
    'United Arab Emirates': '阿拉伯联合酋长国',
    'United States of America': '美国',
    'Separate Customs Territory of Taiwan, Penghu, Kinmen and Matsu': '台湾、澎湖、金门、马祖单独关税区',
}

CO = {
    'Lendlease Global Commercial REIT': 'Lendlease 全球商业房地产投资信托',
    'CapitaLand Commercial Trust, etc.': 'CapitaLand 商业信托等',
    'Grace Ocean Private Limited': 'Grace Ocean 私人有限公司',
    'Hebsteel Global Holding Pte. Ltd.': 'Hebsteel 全球控股私人有限公司',
    'Minerva Bunkering Pte. Ltd.': 'Minerva 船用燃料私人有限公司',
    'SK Energy International Pte. Ltd.': 'SK Energy 国际私人有限公司',
    'Asia Liberty Pte. Ltd., etc.': 'Asia Liberty 私人有限公司等',
    'Concerto Singapore Pte. Ltd.': 'Concerto 新加坡私人有限公司',
    'Hevilift Group Pte Ltd, etc.': 'Hevilift Group 私人有限公司等',
    'Ennovi Plastic Industries Pte. Ltd.': 'Ennovi 塑料工业私人有限公司',
    'Singapore Investments (Pte) Limited': '新加坡投资私人有限公司',
    'Suntec Real Estate Investment Trust': 'Suntec 房地产投资信托',
    'Agrocorp International Pte Ltd': 'Agrocorp 国际私人有限公司',
    'Frasers Logistics & Industrial Trust': 'Frasers 物流与工业信托',
    'Keystone Holdings (Global) Pte. Ltd.': 'Keystone 控股（全球）私人有限公司',
    'Trafigura Group Pte Ltd': 'Trafigura Group 私人有限公司',
    'Trafigura Group Pte. Ltd., etc.': 'Trafigura Group 私人有限公司等',
    'CapitaLand Integrated Commercial Trust': 'CapitaLand 综合商业信托',
    'Accuron Industrial Technologies Limited': 'Accuron 工业科技有限公司',
    'Baohua Steel International Pte. Limited': '宝华钢铁国际私人有限公司',
    'Smit Lamnalco Singapore Pte. Ltd.': 'Smit Lamnalco 新加坡私人有限公司',
    'Wanhua Chemical International Pte. Ltd.': '万华化学国际私人有限公司',
    'Hong Leong Investment Holdings Pte. Ltd.': '丰隆投资控股私人有限公司',
    'Zebra Technologies Asia Pacific Pte. Ltd.': 'Zebra 科技亚太私人有限公司',
    'Neptune1 Infrastructure Holdings Pte. Ltd.': 'Neptune1 基础设施控股私人有限公司',
    'Applied Materials South East Asia Pte Ltd': 'Applied Materials 东南亚私人有限公司',
    'Mapletree North Asia Commercial Trust, etc.': 'Mapletree 北亚商业信托等',
    'Sinochem International (Overseas) Pte. Ltd.': '中化国际（海外）私人有限公司',
    'Azure Sky Investments 10 Pte Ltd, etc.': 'Azure Sky 投资 10 私人有限公司等',
    'Dreymoor Fertilizers Overseas Pte. Ltd.': 'Dreymoor 肥料海外私人有限公司',
    'Total Engine Asset Management Pte. Ltd.': 'Total Engine 资产管理私人有限公司',
    'Cromwell European Real Estate Investment Trust': 'Cromwell 欧洲房地产投资信托',
    'LVMH Fragrances and Cosmetics (Singapore) Pte Ltd': 'LVMH 香水与化妆品（新加坡）私人有限公司',
    'Singapore Aerospace Manufacturing Private Limited': '新加坡航空制造私人有限公司',
    'APTIV Safety & Mobility Services Singapore Pte Ltd': 'APTIV 安全与移动服务新加坡私人有限公司',
    'Frasers Commercial Investments No. 1 Pte. Ltd., etc.': 'Frasers 商业投资第 1 号私人有限公司等',
    'ST Engineering Aerospace Resources Pte. Ltd.': 'ST Engineering 航空资源私人有限公司',
    'Cromwell SG SPV 5 Pte Ltd': 'Cromwell 新加坡第 5 号特殊目的公司',
    'Visvanathapuram Mariadoss Jagadisa Raju, Deceased': 'Raju（已故）',
    'Lem Chu Kem also known as Lem Chu Kem Theresa, Deceased': 'Lem（已故）',
}

AGENCY = {
    'Singapore Tourism Board': '新加坡旅游局',
    'Economic Development Board': '经济发展局',
    'Enterprise Singapore Board': '新加坡企业发展局',
    'Monetary Authority of Singapore': '新加坡金融管理局',
    'Building and Construction Authority': '建设局',
    'Maritime and Port Authority of Singapore': '新加坡海事及港务管理局',
}

ACTNAME = {
    'Central Provident Fund': '中央公积金',
    'Constitution of the Republic of Singapore': '新加坡共和国宪法',
    'Civil Aviation Authority of Singapore': '新加坡民航局',
    'Info-communications Media Development Authority': '资讯通信媒体发展局',
    'National Council of Social Service': '全国社会服务理事会',
    'Criminal Procedure': '刑事程序',
    'Criminal Law': '刑法',
    'Administration of Muslim Law': '穆斯林法管理',
    'Coastal Protection and Other Amendments': '海岸保护及其他修正',
    'Corporate and Accounting Laws': '公司与会计法',
    'Community Disputes Resolution': '社区纠纷解决',
    'Insolvency, Restructuring and Dissolution': '破产、重组与解散',
    'Cross-Border Railways': '跨境铁路',
    'Casino Control': '赌场管制',
    'Energy Conservation': '节能',
    'Land Transport and Related Matters': '陆路交通及相关事项',
}

EXPLICIT = {
    'SG-H2558': '所得税（银行或金融公司转让业务）（第 10 号）命令 2000',
    'SG-H3075': '新加坡海事及港务管理局（复合罪行）条例 2021',
    'SG-H3261': '多层次营销与金字塔销售（除外计划与安排）命令',
    'SG-H3280': '刑事事项相互协助（老挝人民民主共和国）命令 2007',
    'SG-H3388': '网络安全（救济与问责）（责任免除）条例 2026',
    'SG-H3389': '网络安全（救济与问责）（出庭通知）条例 2026',
    'SG-H3385': '网络安全（救济与问责）（复合罪行）条例 2026',
    'SG-H1341': '环境保护与管理（禁止露天用火）命令',
    'SG-H1348': '环境保护与管理（美国使馆车辆——豁免）命令 2020',
    'SG-H2620': '基础设施保护（自动道路缺陷检测——豁免）命令 2023',
    'SG-H2971': '陆路交通及相关事项法 2026（过渡规定）条例 2026',
    'SG-H370': '建筑管制（第 42AA 条规定的电子服务）公告 2023',
    'SG-H810': '领事公约（无线电执照费减免）（废止）指示 2005',
    'SG-H935': '刑事程序法典（规定执法机构）（第 2 号）公告 2011',
    'SG-H1416': '遗产税（Raju，已故）（减免）命令 1997',
    'SG-H2796': '破产、重组与解散（破产法废止）公告 2020',
    'SG-H3000': '律师专业（规定的法定机构与公共服务法律事务所）规则',
    'SG-H3512': '功绩服务奖章（军事）规则 1981',
    'SG-H3509': '卓越英勇奖章（军事）规则 1981',
    'SG-H3519': '公共行政奖章（军事）规则 1981',
    'SG-H3521': '马来西亚制服部队奖章规则 1964',
    'SG-H1079': '卓越服务勋章（军事）规则 1981',
    'SG-H389': '建筑维护与分层管理（过渡与保留规定）命令',
    'SG-H758': '社区纠纷解决（第 2A 部复合罪行）条例 2025',
    'SG-H1222': '教育捐赠与储蓄计划（教育储蓄学生基金拨款）条例 2015',
    'SG-H1223': '教育捐赠与储蓄计划（教育储蓄学生基金拨款）条例 2019',
    'SG-H1224': '教育捐赠与储蓄计划（教育储蓄学生基金拨款）条例 2020',
    'SG-H1225': '教育捐赠与储蓄计划（教育储蓄学生基金拨款）条例 2021',
    'SG-H1291': '濒危物种（进出口）（第 2A 条规定文件）规则 2022',
    'SG-H3080': '新加坡海事及港务管理局（指定公共持牌人）公告 2018',
    'SG-H3340': '新加坡国立大学（公司化）（解散日期）公告 2008',
    'SG-H512': '中央公积金（家庭保障保险计划——豁免）公告 1985',
    'SG-H767': '公司（认可清盘人）（过渡与保留规定）条例 2004',
    'SG-H050': '会计与企业管制局（职能转授）公告 2008',
    'SG-H1872': '人体生物医学研究（组织库与通报——豁免）条例 2019',
    'SG-H2252': '所得税（就业奖励特别补助豁免——第 13(1)(zp) 条）公告 2020',
    'SG-H2548': '所得税（Trafigura Group 私人有限公司——第 13(4) 条豁免）（第 2 号）公告 2020',
    'SG-H465': '赌场管制（主要股东——圣淘沙名胜世界私人有限公司）公告 2010',
    'SG-H933': '刑事程序法典（规定执法机构——计算机访问）命令 2022',
    'SG-H108': '主动出行（骑乘可登记个人代步工具——生效日期）命令 2019',
    'SG-H2008': '所得税（与 COVID-19 活动有关的福利豁免）规则 2022',
    'SG-H2750': '新加坡国内税务局（职能转授）（第 2 号）公告 2020',
    'SG-H2751': '新加坡国内税务局（职能转授）（第 2 号）公告 2021',
    'SG-H2752': '新加坡国内税务局（职能转授）（第 3 号）公告 2020',
    'SG-H2782': '破产、重组与解散（优先偿付最高款额）命令 2020',
    'SG-H3106': '新加坡媒体发展局（业务守则）（豁免）公告 2003',
    'SG-H3155': '心理卫生（护理与治疗）（指定精神病院）公告 2010',
    'SG-H3175': '商船（海事劳工公约）（复合罪行）条例 2014',
    'SG-H359': '建筑管制（第 2 类一般建筑商执照的估计最终价格）命令 2008',
    'SG-H522': '中央公积金（为设计—建造—销售计划对本法所作的修改）命令 2006',
    'SG-H1150': '存款保险与保单持有人保障计划（生效日期）公告 2011',
    'SG-H1321': '新加坡企业发展局（费用——代表处注册）条例 2025',
    'SG-H2291': '所得税（国际税务合规协定）（美国）命令 2015',
    'SG-H2292': '所得税（国际税务合规协定）（美国）命令 2020',
    'SG-H2311': '所得税（Minerva 船用燃料私人有限公司等——第 13(4) 条豁免）公告 2024',
    'SG-H3147': '终身健保计划（向适当索偿人支付的指明款额）公告 2015',
    'SG-H3526': '建国一代与立国一代基金（复合罪行）条例 2015',
    'SG-H689': '合作社（第 71(2)(a) 条规定缴款率）规则 2025',
    'SG-H690': '合作社（第 71(2)(b) 条规定缴款率）规则 2026',
    'SG-H1191': '幼儿发展中心（婴儿托育试点——豁免）命令 2024',
    'SG-H3269': '跨国企业（最低税）法 2024（第 1(3) 条下的宣告）命令 2024',
    'SG-H3553': '规划（建屋发展局户外茶座区）（豁免）公告',
    'SG-H431': '终身护保与长期护理（第 6(1)(c)(ii) 条规定期间）命令 2021',
    'SG-H432': '终身护保与长期护理（第 15(3) 条指明款额）公告 2020',
    'SG-H1409': '遗产税（Lem，已故）（减免）命令 2000',
    'SG-H1197': '经济扩展奖励（先驱工业与先驱产品）（合并）命令',
    'SG-H1727': '医疗服务（国立大学医院（新加坡）私人有限公司——豁免）命令 2023',
    'SG-H2536': '所得税（飞机包机付款预扣税的替代税率）规则 2018',
    'SG-H2789': '破产、重组与解散（第 440 条规定公司）命令 2020',
    'SG-H2955': '土地业权（分层）（第 84E 与 84F 条对其他产业适用）公告 2005',
    'SG-H3226': '杂项罪行（公共秩序与妨扰）（复合罪行）条例 2015',
    'SG-H3332': '全国疾病登记处（慢性肾功能衰竭指明实体）公告 2011',
    'SG-H942': '刑事程序法典（强制治疗令规定罪行）条例 2018',
    'SG-H3077': '新加坡海事及港务管理局（指定股权持有人）公告 2018',
    'SG-H3349': '报章与印刷机（豁免——星洲日报（新加坡）有限公司）公告',
    'SG-H955': '跨境铁路（边境管制联合设站）（马来西亚管制物品）条例 2026',
    'SG-H2759': '新加坡国内税务局（第 17D 条规定利率）条例 2024',
    'SG-H657': '合作社（AUPE 信用合作社有限公司——第 97 条豁免）命令 2022',
    'SG-H680': '合作社（依第 97 条对合作社规则所作的修改）命令 2014',
    'SG-H3330': '全国疾病登记处（急性心肌梗塞指明实体）公告 2012',
    'SG-H518': '中央公积金（保健储蓄户头提款——医疗保险保费）条例 2015',
    'SG-H1146': '存款保险与保单持有人保障计划（额外保费缴款）命令 2011',
    'SG-H687': '合作社（NTUC Enterprise 合作社有限公司——第 97 条豁免）命令 2021',
    'SG-H949': '刑事程序法典（过渡规定——被收容的精神不健全者）条例 2011',
    'SG-H1945': '所得税（初创公司研发开支现金补助）条例 2010',
    'SG-H2324': '所得税（新加坡——百慕大）（税务事项信息交换协定）命令 2012',
    'SG-H1434': '交易所（非互助化与合并）（受让控股公司股份价值）公告 1999',
    'SG-H3228': '杂项罪行（公共秩序与妨扰）（规定武器与装备）公告 2009',
    'SG-H1994': '所得税（雇佣收益或利润——住所内的家具与装置）条例 2015',
    'SG-H1487': '费用（中央肃毒局）（陈述、报告、资料、文件与记录的副本）命令',
    'SG-H1549': '财务顾问（保险经纪保费账户）（过渡与保留规定）条例',
    'SG-H1973': '所得税（Cromwell 欧洲房地产投资信托——第 13(12) 条豁免）（第 2 号）命令 2024',
    'SG-H388': '建筑维护与分层管理（管理法团终止——豁免）命令 2012',
    'SG-H934': '刑事程序法典（规定执法机构——合法羁押人员）公告 2024',
    'SG-H2795': '破产、重组与解散（官方破产管理人相互承认）公告 2020',
    'SG-H688': '合作社（NTUC Income 保险合作社有限公司——第 88 条豁免）命令 2023',
    'SG-H2615': '资讯通信媒体发展局（第 65 条规定交易）条例 2026',
    'SG-H880': 'COVID-19（婚礼主持与婚姻登记的临时措施）（指明期间）命令 2023',
    'SG-H1304': '节能（受燃油经济性与车辆排放要求约束的机动车）命令 2012',
    'SG-H056': '会计与企业管制局（新加坡会计委员会移交日期）命令 2023',
    'SG-H430': '终身护保与长期护理（长期护理支持基金——规定公共计划）条例 2019',
    'SG-H3367': '关于经济发展与技术开发贷款利息、特许权使用费等免税的公告',
    'SG-H3366': '关于经济发展与技术开发贷款利息、特许权使用费等免税的公告',
    'SG-H768': '公司（英联邦战争公墓委员会（新加坡分会）——第 379 条豁免）条例 2023',
    'SG-H3391': '网络安全（救济与问责）（规定在线服务提供者）（第 10 至 14 部）条例 2026',
    'SG-H1979': '所得税（向公益机构提供服务或借调人员的开支扣除）规则 2019',
    'SG-H364': '建筑管制（在建建筑物用作工人宿舍的第 12 条豁免）命令 2008',
    'SG-H381': '建筑维护与分层管理（某些管理法团第 27(1) 条豁免）命令',
    'SG-H683': '合作社（就 NTUC Eldercare 乐龄护理合作社有限公司对第 66(1) 条所作的修改）命令 1998',
    'SG-H3361': '关于发布附属法例活页修订页（第 1/99 期）的第 10(6) 与 17(6) 条公告',
    'SG-H3359': '关于发布附属法例活页修订页（第 1/97 期）的第 10(6) 与 17(6) 条公告',
    'SG-H3360': '关于发布附属法例活页修订页（第 1/2001 期）的第 10(6) 与 17(6) 条公告',
    'SG-H1147': '存款保险与保单持有人保障计划（存款保险）（复合罪行）条例 2011',
    'SG-H2286': '所得税（国际税务合规协定）（主管当局协定——美国）命令 2021',
    'SG-H868': '贪污、贩毒及其他严重罪行（利益没收）（复合罪行）条例 2019',
    'SG-H3275': '刑事事项相互协助（中华人民共和国香港特别行政区）命令 2004',
    'SG-H1199': '经济扩展奖励（所得税减免）（依第 3A 条转授职能与权力）公告 2024',
    'SG-H1198': '经济扩展奖励（所得税减免）（依第 3A 条转授职能与权力）（第 2 号）公告 2024',
    'SG-H1620': '商品与服务税（海关法 1960 的适用）（关于审讯、程序、罪行与罚则的规定）命令 1994',
    'SG-H376': '建筑管制（须经认可审查机构认可审查员审查的建筑工程价值）公告 2008',
    'SG-H870': '贪污、贩毒及其他严重罪行（利益没收）（规定国际组织）条例 2019',
    'SG-H3258': '机动车（第三方风险与赔偿）（南洋理工大学电动助力自行车试验）（豁免）公告 2011',
    'SG-H1149': '存款保险与保单持有人保障计划（存款保险与保单持有人保障基金机构的指定）公告 2011',
    'SG-H2325': '所得税（新加坡——巴西）（关于国际航空与海运运输所得利润避免双重征税的协定）命令 2013',
    'SG-H2336': '所得税（新加坡——智利）（关于国际船舶经营所得收入税收相互豁免的协定）命令 1993',
    'SG-H2467': '所得税（新加坡——沙特阿拉伯）（关于国际航空运输业务所得收入税收相互豁免的协定）命令 1992',
    'SG-H2504': '所得税（新加坡——阿拉伯联合酋长国）（关于国际航空运输业务所得收入税收相互豁免的协定）命令 1991',
    'SG-H2372': '所得税（新加坡——中华人民共和国香港特别行政区）（关于在国际运输中经营船舶或飞机的企业所得避免双重征税的协定）命令 2004',
    'SG-H1609': '一般命令',
    'SG-H3044': '拉客者名单',
    'SG-H3158': '精神病院',
    'SG-H3529': '拘留场所',
    'SG-H275': '受权人员',
    'SG-H1099': '权力转授',
    'SG-H1901': '移民局官员',
    'SG-H245': '认可机构',
    'SG-H246': '认可机构',
    'SG-H3456': '第 74 条下的命令',
    'SG-H229': '董事的委任',
    'SG-H3458': '第 9(3) 条下的命令',
    'SG-H3429': '第 11(3) 条下的命令',
    'SG-H3430': '第 11(3) 条下的命令',
    'SG-H3444': '第 11(3) 条下的命令',
    'SG-H3446': '第 11(3) 条下的命令',
    'SG-H3447': '第 11(3) 条下的命令',
    'SG-H3455': '第 18(3) 条下的命令',
    'SG-H1091': '第 12 条下的宣告',
    'SG-H1092': '第 12 条下的宣告',
    'SG-H248': '认可大专学府',
    'SG-H270': '人员借用命令',
    'SG-H554': '荣誉证书规则',
    'SG-H336': '广播（豁免）命令',
    'SG-H220': '副注册官的委任',
    'SG-H221': '副注册官的委任',
    'SG-H3365': '第 6(3) 条下的公告',
    'SG-H1451': '第 97 条下的豁免命令',
    'SG-H1452': '第 97 条下的豁免命令',
    'SG-H1453': '第 97 条下的豁免命令',
    'SG-H222': '各副注册官的委任',
    'SG-H223': '各副注册官的委任',
    'SG-H224': '各副注册官的委任',
    'SG-H225': '各副注册官的委任',
    'SG-H226': '各副注册官的委任',
    'SG-H227': '各副注册官的委任',
    'SG-H230': '发牌官的委任',
    'SG-H232': '各养老金官员的委任',
    'SG-H3368': '第 6(3) 条下的各项公告',
    'SG-H580': '总控制官与各控制官',
    'SG-H1158': '受权人士的指定',
    'SG-H273': '审计长审计账目',
    'SG-H218': '主管当局的委任',
    'SG-H219': '主管当局的委任',
    'SG-H234': '专利注册官的委任',
    'SG-H237': '各监督官员的委任',
    'SG-H555': '辅助警察部队的撤销',
    'SG-H556': '辅助警察部队的撤销',
    'SG-H557': '各辅助警察部队的撤销',
    'SG-H1449': '第 4A(1) 与 (2) 条豁免',
    'SG-H2832': '交存法院款项的利率',
    'SG-H3362': '第 4(1)(a)(i) 条下的公告',
    'SG-H215': '土地税收官的委任',
    'SG-H216': '各土地税收官的委任',
    'SG-H2595': '新加坡独立协定 1965',
    'SG-H276': '授予起诉许可的权力',
    'SG-H244': '认可医院与医疗机构',
    'SG-H2919': '司法委员会（刑事上诉）规则',
    'SG-H739': '土地专员指示进行诉讼',
    'SG-H1913': '所得税（认可银行）（第 2 号）命令 1996',
    'SG-H1914': '所得税（认可银行）（第 3 号）命令 1996',
    'SG-H1915': '所得税（认可银行）（第 6 号）命令 1996',
    'SG-H653': '民事清单与养老金法——通过的决议',
    'SG-H654': '民事清单与养老金法——通过的决议',
    'SG-H1157': '副注册官行使注册官权力',
    'SG-H1865': '房屋开发商（豁免）公告 1996',
    'SG-H298': '银行（专业关系）公告',
    'SG-H391': '宣告武吉甘柏军营为设施',
    'SG-H415': '第 19(1)(d) 条下指示的撤销',
    'SG-H416': '第 27(1)(d) 条下指示的撤销',
    'SG-H417': '第 27(1)(d) 条下指示的撤销',
    'SG-H418': '第 27(1)(d) 条下各项指示的撤销',
    'SG-H3199': '商船（安全公约）条例',
    'SG-H1185': '第 27(1)(d) 条下的指示——合并',
    'SG-H158': '航空导航（权力转授）公告',
    'SG-H267': '向新加坡土地管理局转授职能',
    'SG-H906': 'PSA 公司辅助警察部队的设立',
    'SG-H3070': '马来西亚与文莱货币转为纸币',
    'SG-H3405': '使法律修订版生效的命令',
    'SG-H231': '养老金上诉审裁处成员的委任',
    'SG-H269': '向国家环境局转授职能',
    'SG-H414': '认可安老院委任证书的撤销',
    'SG-H3190': '商船（非公约船舶）安全条例',
    'SG-H488': '人口与农业普查（合并）命令',
    'SG-H686': '合作社（修改）（合并）命令',
    'SG-H1448': '遗产税豁免——丰田汽车信贷公司',
    'SG-H3171': '商船（第 222 条豁免）公告',
    'SG-H1159': '贫困者（福利院）（合并）公告',
    'SG-H2015': '所得税（外国收入豁免）（合并）命令',
    'SG-H2016': '所得税（外国收入豁免）（合并）命令',
    'SG-H2017': '所得税（外国收入豁免）（合并）命令',
    'SG-H2018': '所得税（外国收入豁免）（合并）命令',
    'SG-H2014': '所得税（外国收入豁免）（合并）（第 2 号）命令',
    'SG-H233': '制造商注册官与副注册官的委任',
    'SG-H043': '委任会计长为最高法院会计师',
    'SG-H264': '向陆路交通管理局转授职能',
    'SG-H265': '向陆路交通管理局转授职能',
    'SG-H266': '向新加坡海事及港务管理局转授职能',
    'SG-H2961': '土地业权（分层）（初始期间变更）条例 1996',
    'SG-H3377': '受警察监管者须向其报到的官员',
    'SG-H740': '公共卫生专员兼任食品管理局局长',
    'SG-H655': '民事清单与养老金法——议会会议通过的决议',
    'SG-H3350': '报章与印刷机（豁免）（合并）公告',
    'SG-H1184': '关于在吉隆坡与新加坡保存罪犯登记册的指示',
    'SG-H1421': '遗产税豁免——亚洲美元债券——（合并）公告',
    'SG-H1422': '遗产税豁免——亚洲美元债券——（合并）公告',
    'SG-H1423': '遗产税豁免——亚洲美元债券——（合并）公告',
    'SG-H1424': '遗产税豁免——亚洲美元债券——（合并）公告',
    'SG-H1425': '遗产税豁免——亚洲美元债券——（合并）公告',
    'SG-H651': '民事清单与酬金法 1970——议会会议通过的决议',
    'SG-H652': '民事清单与酬金法 1970——议会会议通过的决议',
    'SG-H1093': '关于自动公共平交道口的宣告（合并）',
    'SG-H238': '注册官与副注册官的委任（合并）公告',
    'SG-H247': '兽医认可资格（合并）公告',
    'SG-H282': '银行（第 4A(1) 与 (2) 条豁免）（合并）公告',
    'SG-H3404': '使 1990 年附属法例修订版生效的命令',
    'SG-H2914': '中央人力基地调查组不再作为辅助警察部队',
    'SG-H228': '排污与排水局长、副局长及助理局长的委任',
    'SG-H2749': '新加坡国内税务局（职能转授）公告 2013',
    'SG-H3173': '商船（责任限制）（新加坡货币等值）命令',
    'SG-H1426': '遗产税豁免——政府债券与股票——（合并）公告',
    'SG-H1862': '房屋开发商（管制与发牌）（豁免）（合并）公告',
    'SG-H3302': '由新加坡武装部队教育中心指挥的全国学生军团',
    'SG-H2557': '所得税（银行或金融公司转让业务）（合并）命令',
    'SG-H268': '向建屋发展局转授职能（合并）公告',
    'SG-H1090': '宣告法定机构雇用的人员就本法而言不属雇员',
    'SG-H235': '委任最高法院注册官在内庭传票中行使管辖权',
    'SG-H550': '中央公积金局收取薪金税与技能发展税',
    'SG-H217': '赡养父母专员、副专员及助理专员的委任',
}


def fam_income_dta(s):
    m = re.match(r'^Income Tax \(Singapore\s*[—─-]\s*(.+?)\) \((?:Supplementa\w+\) \()?(?:Avoidance [Oo]f Double Taxation) (Agreement|Convention)\)(?: \(Supplementary\))?(?: \(No\. (\d+)\))? Order (\d{4})$', s)
    if not m:
        return None
    c, kind = m.group(1), m.group(2)
    cn = COUNTRY.get(c)
    if cn is None:
        return None
    kind_zh = '避免双重征税协定' if kind == 'Agreement' else '避免双重征税公约'
    out = '所得税（新加坡——%s）（%s）' % (cn, kind_zh)
    if '(Supplementary)' in s:
        out += '（补充）'
    if m.group(3):
        out += '（第 %s 号）' % m.group(3)
    return out + '命令 %s' % m.group(4)


def fam_sec_exempt(s):
    m = re.match(r'^Income Tax \((.+?) — Section (13\(12\)|13\(4\)|19B\(10B\)) Exemption\) (Order|Notification) (\d{4})$', s)
    if not m:
        return None
    co = CO.get(m.group(1))
    if co is None:
        return None
    return '所得税（%s——第 %s 条豁免）%s %s' % (co, m.group(2), '命令' if m.group(3) == 'Order' else '公告', m.group(4))


def fam_interest(s):
    m = re.match(r'^Income Tax \(Exemption of Interest and Other Payments (for|on) Economic and Technological Development( Loans)?\)'
                 r'(?:( \(No\. (\d+)\)))?(?: \(Consolidation\))? Notification(?: (\d{4}))?$', s)
    if not m:
        return None
    base = '所得税（经济发展与技术开发%s利息及其他付款豁免）' % ('贷款' if m.group(2) else '')
    if m.group(4):
        base += '（第 %s 号）' % m.group(4)
    if '(Consolidation)' in s:
        base += '（合并）'
    return base + '公告' + (' ' + m.group(5) if m.group(5) else '')


def fam_interest2(s):
    m = re.match(r'^Income Tax \(Exemption of Interest on Economic and Technological Development Loans\)'
                 r'(?: \(Consolidation\))? Notification(?: (\d{4}))?$', s)
    if not m:
        return None
    base = '所得税（经济发展与技术开发贷款利息豁免）'
    if '(Consolidation)' in s:
        base += '（合并）'
    return base + '公告' + (' ' + m.group(1) if m.group(1) else '')


def fam_royalty(s):
    m = re.match(r'^Income Tax \(Exemption of Royalties and Other Payments for Economic and Technological Development\)'
                 r'(?: \(No\. (\d+)\))? Notification(?: (\d{4}))?$', s)
    if not m:
        return None
    base = '所得税（经济发展与技术开发特许权使用费及其他付款豁免）'
    if m.group(1):
        base += '（第 %s 号）' % m.group(1)
    return base + '公告' + (' ' + m.group(2) if m.group(2) else '')


def fam_payment(s):
    m = re.match(r'^Income Tax \(Exemption of Payments for Economic and Technological Development\)'
                 r'(?: \(No\. (\d+)\))? Notification(?: (\d{4}))?$', s)
    if not m:
        return None
    base = '所得税（经济发展与技术开发付款豁免）'
    if m.group(1):
        base += '（第 %s 号）' % m.group(1)
    return base + '公告' + (' ' + m.group(2) if m.group(2) else '')


def fam_3a(s):
    m = re.match(r'^Income Tax \(Assignment of Functions under Section 3A — (.+?)\) Notification (\d{4})$', s)
    if not m:
        return None
    a = AGENCY.get(m.group(1))
    if a is None:
        return None
    return '所得税（依第 3A 条转授职能——%s）公告 %s' % (a, m.group(2))


def fam_commence(s):
    m = re.match(r'^(.+?) Act (\d{4}) \(Commencement\)( \(No\. (\d+)\))? Notification (\d{4})$', s)
    if not m:
        return None
    t = m.group(1)
    suffix = ''
    for pat, zh in ((' (Miscellaneous Amendments)', '（杂项修正）'), (' (Amendment)', '（修正）')):
        if t.endswith(pat):
            t, suffix = t[:-len(pat)], zh
            break
    t = ACTNAME.get(t, t) + suffix
    out = '%s法 %s（生效）' % (t, m.group(2))
    if m.group(4):
        out += '（第 %s 号）' % m.group(4)
    return out + '公告 %s' % m.group(5)


def tr(i, s):
    if i in EXPLICIT:
        return EXPLICIT[i]
    for f in (fam_income_dta, fam_sec_exempt, fam_interest, fam_interest2, fam_royalty,
              fam_payment, fam_3a, fam_commence):
        r = f(s)
        if r:
            return r
    if s == 'Commission':
        return '委员会'
    if s == 'Exemption':
        return '豁免'
    return None


if __name__ == '__main__':
    import glob
    left = []
    total = 0
    for n in ('011', '012', '013'):
        d = json.load(open('_work/title/jobs/CALR-TITLE-20261017-1818-SG-2467/slices/slice_%s.json' % n, encoding='utf-8'))
        for it in d['items']:
            total += 1
            if tr(it['id'], it['en']) is None:
                left.append(it['id'] + ' | ' + it['en'])
    print('total', total, 'left', len(left))
    open('_work/title/_sg_left.txt', 'w', encoding='utf-8').write('\n'.join(left))
