/* 真实数据样本：从 prototype/data/laws/index.json 与权威 JSON 抽取（2026-10-25）。
   用途：solution Demo 的检索/比对/问答演示；不改写、不编造法规内容。 */
window.CALR_SOLUTION_DATA = {
  "meta": {
    "jurisdictions": 12,
    "laws": 18785,
    "articles": 339351,
    "chars": 270627557,
    "translatedLaws": 1566,
    "translatedArticles": 60084,
    "titleZh": 18746,
    "titleZhPct": "99.79",
    "i18nKeys": 870,
    "dbSize": "1.22 GB",
    "vectors": "18,861 / 334,779",
    "p3": "16.7%",
    "countryAccuracy": "99.1%",
    "latency": "0.3–0.6 s",
    "firstScreen": "0.68 s",
    "generatedAt": "2026-10-24"
  },
  "countryCounts": {
    "文莱": 1275,
    "中国": 1586,
    "印度尼西亚": 36,
    "柬埔寨": 187,
    "老挝": 80,
    "缅甸": 80,
    "马来西亚": 74,
    "菲律宾": 10619,
    "新加坡": 3714,
    "泰国": 816,
    "东帝汶": 230,
    "越南": 88
  },
  "laws": [
    {
      "id": "CN-CIVILCODE-2020",
      "country": "CN",
      "countryName": "中国",
      "title": "中华人民共和国民法典",
      "titleEn": "Civil Code of the People's Republic of China",
      "level": "law",
      "status": "active",
      "date": "2020-05-28",
      "articles": 1260,
      "pack": "cn"
    },
    {
      "id": "CN-DATA-2021",
      "country": "CN",
      "countryName": "中国",
      "title": "中华人民共和国数据安全法",
      "titleEn": "Data Security Law of the People's Republic of China",
      "level": "law",
      "status": "active",
      "date": "2021-06-10",
      "articles": 55,
      "pack": "cn"
    },
    {
      "id": "CN-LAW-0277",
      "country": "CN",
      "countryName": "中国",
      "title": "中华人民共和国网络安全法",
      "titleEn": "",
      "level": "law",
      "status": "active",
      "date": "2016-11-07",
      "articles": 79,
      "pack": "cn-p04"
    },
    {
      "id": "SG-H002",
      "country": "SG",
      "countryName": "新加坡",
      "title": "个人数据保护法 2012",
      "titleEn": "Personal Data Protection Act 2012",
      "level": "law",
      "status": "active",
      "date": "2012",
      "articles": 106,
      "pack": "sg-p01"
    },
    {
      "id": "SG-H004",
      "country": "SG",
      "countryName": "新加坡",
      "title": "公司法 1967",
      "titleEn": "Companies Act 1967",
      "level": "law",
      "status": "active",
      "date": "1967",
      "articles": 703,
      "pack": "sg-p01"
    },
    {
      "id": "MY-H075",
      "country": "MY",
      "countryName": "马来西亚",
      "title": "个人数据保护法",
      "titleEn": "PERSONAL DATA PROTECTION ACT 2010",
      "level": "law",
      "status": "active",
      "date": "2010",
      "articles": 146,
      "pack": "my-p04"
    },
    {
      "id": "MY-CONTRACT-1950",
      "country": "MY",
      "countryName": "马来西亚",
      "title": "1950年合同法",
      "titleEn": "Contracts Act 1950",
      "level": "law",
      "status": "active",
      "date": "1950-05-31",
      "articles": 192,
      "pack": "my-2"
    },
    {
      "id": "TH-H031",
      "country": "TH",
      "countryName": "泰国",
      "title": "个人数据保护法（英文本）",
      "titleEn": "Personal Data Protection Act, B.E. 2562 (2019)",
      "level": "law",
      "status": "active",
      "date": "2019",
      "articles": 97,
      "pack": "th-p03"
    },
    {
      "id": "TH-H004",
      "country": "TH",
      "countryName": "泰国",
      "title": "民商法典",
      "titleEn": "Civil and Commercial Code",
      "level": "code",
      "status": "active",
      "date": "1925-11-11",
      "articles": 1849,
      "pack": "th-p01"
    },
    {
      "id": "VN-H091",
      "country": "VN",
      "countryName": "越南",
      "title": "网络安全法（2025年）",
      "titleEn": "Law on Cybersecurity 2025",
      "level": "law",
      "status": "active",
      "date": "2025-12-10",
      "articles": 45,
      "pack": "vn-p04"
    },
    {
      "id": "VN-H117",
      "country": "VN",
      "countryName": "越南",
      "title": "投资法",
      "titleEn": "",
      "level": "",
      "status": "",
      "date": "",
      "articles": 160,
      "pack": "vn-p05"
    },
    {
      "id": "PH-DPA-2012",
      "country": "PH",
      "countryName": "菲律宾",
      "title": "2012年数据隐私法",
      "titleEn": "Data Privacy Act of 2012",
      "level": "law",
      "status": "active",
      "date": "2012-08-15",
      "articles": 45,
      "pack": "ph"
    },
    {
      "id": "PH-CORPORATION-2019",
      "country": "PH",
      "countryName": "菲律宾",
      "title": "修订公司法",
      "titleEn": "Revised Corporation Code of the Philippines",
      "level": "law",
      "status": "active",
      "date": "2019-02-20",
      "articles": 187,
      "pack": "ph"
    },
    {
      "id": "BN-H002",
      "country": "BN",
      "countryName": "文莱",
      "title": "2025年个人数据保护令",
      "titleEn": "PERSONAL DATA PROTECTION ORDER, 2025",
      "level": "regulation",
      "status": "active",
      "date": "2025",
      "articles": 111,
      "pack": "bn-p01"
    },
    {
      "id": "BN-COMPANIES-CAP39",
      "country": "BN",
      "countryName": "文莱",
      "title": "公司法》（第39章）",
      "titleEn": "Companies Act (Chapter 39)",
      "level": "law",
      "status": "active",
      "date": "1956-01-01",
      "articles": 384,
      "pack": "bn"
    },
    {
      "id": "KH-H011",
      "country": "KH",
      "countryName": "柬埔寨",
      "title": "民法典",
      "titleEn": "Civil Code",
      "level": "code",
      "status": "active",
      "date": "2007-12-08",
      "articles": 37,
      "pack": "kh-p01"
    },
    {
      "id": "KH-H017",
      "country": "KH",
      "countryName": "柬埔寨",
      "title": "投资法实施次法令88号",
      "titleEn": "Document - National Trade Repository",
      "level": "law",
      "status": "active",
      "date": "1997",
      "articles": 136,
      "pack": "kh-p01"
    },
    {
      "id": "LA-H438",
      "country": "LA",
      "countryName": "老挝",
      "title": "民法典",
      "titleEn": "",
      "level": "",
      "status": "",
      "date": "",
      "articles": 721,
      "pack": "la-p02"
    },
    {
      "id": "LA-H435",
      "country": "LA",
      "countryName": "老挝",
      "title": "投资促进法",
      "titleEn": "",
      "level": "",
      "status": "",
      "date": "",
      "articles": 182,
      "pack": "la-p02"
    },
    {
      "id": "MM-H001",
      "country": "MM",
      "countryName": "缅甸",
      "title": "仲裁法",
      "titleEn": "Arbitration Law",
      "level": "law",
      "status": "active",
      "date": "2016-01-05",
      "articles": 53,
      "pack": "mm-p01"
    },
    {
      "id": "MM-H039",
      "country": "MM",
      "countryName": "缅甸",
      "title": "投资法（2016年联邦议会第40号法律）",
      "titleEn": "Investment Law (Pyidaungsu Hluttaw Law No. 40/2016)",
      "level": "law",
      "status": "active",
      "date": "2016-10-18",
      "articles": 65,
      "pack": "mm-p02"
    },
    {
      "id": "TL-CIVIL-2011",
      "country": "TL",
      "countryName": "东帝汶",
      "title": "民法典",
      "titleEn": "Civil Code",
      "level": "law",
      "status": "active",
      "date": "2011-01-01",
      "articles": 2195,
      "pack": "tl-2"
    },
    {
      "id": "TL-INVESTMENT-2017",
      "country": "TL",
      "countryName": "东帝汶",
      "title": "私人投资法",
      "titleEn": "Private Investment Law",
      "level": "law",
      "status": "active",
      "date": "2017-01-24",
      "articles": 54,
      "pack": "tl"
    },
    {
      "id": "ID-H012",
      "country": "ID",
      "countryName": "印度尼西亚",
      "title": "就业创造法",
      "titleEn": "Law No. 6 of 2023 (Job Creation)",
      "level": "law",
      "status": "active",
      "date": "2023",
      "articles": 2705,
      "pack": "id-p01"
    },
    {
      "id": "ID-H016",
      "country": "ID",
      "countryName": "印度尼西亚",
      "title": "民法典",
      "titleEn": "",
      "level": "",
      "status": "",
      "date": "",
      "articles": 1972,
      "pack": "id-p05"
    }
  ],
  "qa": [
    {
      "q": "《民法典》的立法目的是什么？",
      "lawId": "CN-CIVILCODE-2020",
      "lawTitle": "中华人民共和国民法典",
      "articleNo": 1,
      "noLabel": "第一条",
      "chapter": "第一章 基本规定",
      "quote": "为了保护民事主体的合法权益，调整民事关系，维护社会和经济秩序，适应中国特色社会主义发展要求，弘扬社会主义核心价值观，根据宪法，制定本法。",
      "translation": "This Code is enacted in accordance with the Constitution to protect the lawful rights and interests of civil subjects, regulate civil relations, maintain social and economic order, meet the requirements for the development of socialism with Chinese characteristics, and promote the core socialist values.",
      "translationMeta": {
        "engine": "llm",
        "model": "deepseek-v4.1-flash",
        "reviewed": "machine"
      }
    },
    {
      "q": "中国《数据安全法》适用于哪些数据处理活动？",
      "lawId": "CN-DATA-2021",
      "lawTitle": "中华人民共和国数据安全法",
      "articleNo": 2,
      "noLabel": "第二条",
      "chapter": "第一章 总则",
      "quote": "在中华人民共和国境内开展数据处理活动及其安全监管，适用本法。 在中华人民共和国境外开展数据处理活动，损害中华人民共和国国家安全、公共利益或者公民、组织合法权益的，依法追究法律责任。",
      "translation": "",
      "translationMeta": null
    }
  ],
  "compare": {
    "dimensions": [
      "适用范围",
      "核心概念",
      "法律后果",
      "程序与期限",
      "门槛与标准"
    ],
    "left": {
      "country": "中国",
      "lawTitle": "中华人民共和国数据安全法",
      "lawId": "CN-DATA-2021",
      "noLabel": "第二条",
      "lang": "中文原文",
      "text": "在中华人民共和国境内开展数据处理活动及其安全监管，适用本法。 在中华人民共和国境外开展数据处理活动，损害中华人民共和国国家安全、公共利益或者公民、组织合法权益的，依法追究法律责任。",
      "source": "中国国家法律法规数据库"
    },
    "right": {
      "country": "越南",
      "lawTitle": "网络安全法（2025年）",
      "lawId": "VN-H091",
      "noLabel": "Điều 1",
      "lang": "越南文原文",
      "text": "1. Luật này quy định về an ninh mạng, bảo vệ an ninh mạng; quyền, nghĩa vụ, trách nhiệm của cơ quan, tổ chức, cá nhân có liên quan. 2. Luật này áp dụng đối với: a) Cơ quan, tổ chức, cá nhân Việt Nam; b) Cơ quan, tổ chức, cá nhân nước ngoài tại Việt Nam và người gốc Việt Nam chưa xác định được quốc tịch đang sinh sống tại Việt Nam đã được cấp giấy chứng nhận căn cước; c) Cơ quan, tổ chức, cá nhân nước ngoài trực tiếp tham gia hoặc có liên quan đến hoạt động bảo vệ an ninh mạng, kinh doanh sản phẩm, dịch vụ an ninh mạng tại Việt Nam.",
      "source": "越南政府公报（congbao.chinhphu.vn）"
    }
  },
  "sampleQueries": [
    "民法典",
    "个人数据保护",
    "数据安全",
    "外商投资",
    "仲裁",
    "公司法"
  ],
  "terms": [
    {
      "zh": "外商投资",
      "en": "foreign investment"
    },
    {
      "zh": "注册资本",
      "en": "registered capital"
    },
    {
      "zh": "营业执照",
      "en": "business licence"
    },
    {
      "zh": "不可抗力",
      "en": "force majeure"
    },
    {
      "zh": "仲裁裁决",
      "en": "arbitral award"
    }
  ]
};
