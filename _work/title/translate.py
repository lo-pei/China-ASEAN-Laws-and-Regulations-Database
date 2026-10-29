# -*- coding: utf-8 -*-
r"""英文法规标题 → 中文：术语表 + 结构模板 + 覆盖率守门

原则（不可编造）：
  · 内容词必须命中术语表；专有名词（地名/人名，首字母大写且非首词）原样保留
  · 单条标题的术语覆盖率 ≥ 阈值才采纳，否则留空并记为待译 —— 宁可不译，绝不猜译
  · 全部译名标记为 machine-term / 未审校，不冒充官方译名
"""
import io, os, json, glob, re, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---------------- 术语表（按分析出的高频词构建） ----------------
TERMS = {
    # 法律形式
    "act": "法", "acts": "法", "law": "法", "laws": "法", "code": "法典", "order": "命令",
    "orders": "命令", "rules": "规则", "regulations": "条例", "regulation": "条例",
    "ordinance": "条例", "ordinances": "条例", "decree": "法令", "decrees": "法令",
    "notification": "公告", "notifications": "公告", "circular": "通函", "circulars": "通函",
    "amendment": "修正", "amendments": "修正", "amending": "修订", "amend": "修订",
    "amended": "修正", "revised": "修订", "revision": "修订", "repealing": "废止",
    "repeal": "废止", "proclamation": "公告", "royal": "王室", "kram": "敕令",
    "act.": "法", "supplement": "补充", "annex": "附件", "annexure": "附件",
    # 立法动作
    "establishing": "设立", "establish": "设立", "established": "设立", "establishment": "设立",
    "creating": "设立", "create": "设立", "constituting": "组建", "constitution": "宪法",
    "converting": "转为", "convert": "转为", "conversion": "转制", "changing": "更改",
    "change": "更改", "renaming": "更名", "naming": "命名", "name": "名称",
    "separating": "分出", "separate": "分离", "consolidation": "合并", "merger": "合并",
    "reorganization": "重组", "reorganizing": "重组", "transferring": "划转", "transfer": "划转",
    "extending": "延长", "extension": "延长", "expanding": "扩大", "increasing": "增加",
    "upgrading": "升级", "improvement": "改善", "improving": "改善", "strengthening": "加强",
    "granting": "授予", "grant": "授予", "granted": "授予", "authorizing": "授权",
    "authorize": "授权", "entitled": "题为", "declaring": "宣布", "delegating": "授权",
    "providing": "规定", "provide": "规定", "prescribing": "规定", "prescribed": "规定",
    "regulating": "规范", "defining": "界定", "declaration": "宣告",
    "appropriating": "拨款", "appropriation": "拨款", "supplemental": "补充",
    # 内容词
    "national": "国家", "province": "省", "provinces": "省", "provincial": "省级",
    "municipality": "市镇", "municipalities": "市镇", "municipal": "市镇",
    "city": "市", "cities": "市", "barangay": "描笼涯", "barrios": "描笼涯", "barrio": "描笼涯",
    "district": "区", "districts": "区", "region": "区域", "regional": "区域",
    "school": "学校", "schools": "学校", "high": "高级", "elementary": "小学",
    "college": "学院", "university": "大学", "institute": "研究所", "institution": "机构",
    "institutions": "机构", "polytechnic": "理工", "vocational": "职业", "technological": "技术",
    "science": "科学", "sciences": "科学", "arts": "文科", "technical": "技术",
    "education": "教育", "educational": "教育", "training": "培训", "research": "研究",
    "funds": "经费", "fund": "基金", "funding": "资金", "therefor": "为此",
    "hospital": "医院", "beds": "床位", "bed": "床位", "health": "卫生", "medical": "医疗",
    "radio": "广播", "television": "电视", "broadcasting": "广播", "stations": "台",
    "station": "台", "communications": "通信", "telecommunications": "电信",
    "telephone": "电话", "wireless": "无线电", "network": "网络", "mobile": "移动",
    "land-based": "陆基", "land-mobile": "陆地移动", "point-to-point": "点对点",
    "reception": "接收", "transmission": "传输", "install": "安装", "operate": "运营",
    "operation": "运营", "maintain": "维护", "maintenance": "维护",
    "construct": "建设", "construction": "建设", "infrastructure": "基础设施", "works": "工程",
    "power": "电力", "electric": "电力", "light": "照明", "ice": "制冰", "plant": "厂",
    "heat": "热力", "cold": "冷藏", "storage": "储存", "supply": "供应",
    "income": "所得", "tax": "税", "taxes": "税", "taxation": "税收", "revenue": "税收",
    "fiscal": "财政", "finance": "财政", "financial": "金融", "currency": "货币",
    "coins": "硬币", "bank": "银行", "insurance": "保险", "provident": "公积金",
    "double": "双重", "avoidance": "避免", "exemption": "豁免", "exempt": "豁免",
    "customs": "海关", "tariff": "关税", "trade": "贸易", "business": "商业",
    "commercial": "商业", "industry": "产业", "industries": "产业", "industrial": "工业",
    "economic": "经济", "development": "发展", "investment": "投资", "company": "公司",
    "companies": "公司", "corporation": "公司", "incorporated": "法人", "inc": "公司",
    "pt e": "私人有限公司", "pte": "私人", "ltd": "有限", "merchant": "商业",
    "shipping": "航运", "maritime": "海事", "navigation": "航行", "transport": "运输",
    "transportation": "运输", "air": "航空", "port": "港口", "highway": "公路",
    "road": "道路", "street": "街道", "land": "土地", "lands": "土地", "estate": "地产",
    "property": "财产", "registration": "登记", "register": "登记",
    "citizenship": "公民身份", "immigration": "移民", "foreign": "外国",
    "public": "公共", "private": "私营", "government": "政府", "state": "国家",
    "commonwealth": "联邦", "republic": "共和国", "national.": "国家",
    "agricultural": "农业", "agriculture": "农业", "fisheries": "渔业", "coastal": "沿海",
    "environmental": "环境", "environment": "环境", "protection": "保护", "protected": "受保护",
    "labour": "劳动", "labor": "劳动", "employment": "就业", "employees": "雇员",
    "worker": "工人", "workers": "工人", "wages": "工资", "salaries": "薪金",
    "compensation": "补偿", "benefits": "福利", "personnel": "人员", "officers": "官员",
    "officials": "官员", "positions": "职位", "members": "成员", "board": "委员会",
    "commission": "委员会", "council": "理事会", "bureau": "局", "office": "办公室",
    "department": "部", "authority": "管理局", "administration": "管理", "management": "管理",
    "court": "法院", "courts": "法院", "judiciary": "司法", "fiscals": "检察官",
    "appeals": "上诉", "criminal": "刑事", "civil": "民事", "penal": "刑事",
    "offences": "罪行", "offense": "罪行", "penalties": "处罚", "penalty": "处罚",
    "procedure": "程序", "evidence": "证据", "arbitration": "仲裁", "mediation": "调解",
    "contract": "合同", "agreement": "协定", "convention": "公约", "treaty": "条约",
    "multilateral": "多边", "bilateral": "双边", "free": "自由",
    "data": "数据", "personal": "个人", "privacy": "隐私", "cyber": "网络",
    "electronic": "电子", "digital": "数字", "technology": "技术", "systems": "系统",
    "system": "系统", "information": "信息", "communications.": "通信",
    "employment.": "就业", "copyright": "著作权", "patent": "专利", "trademark": "商标",
    "intellectual": "知识", "estate.": "地产",
    "general": "一般", "special": "特别", "temporary": "临时", "regular": "常规",
    "independent": "独立", "integrated": "综合", "comprehensive": "综合",
    "administrative": "行政", "constitutional": "宪法", "legislative": "立法",
    "judicial": "司法", "executive": "行政",
    "necessary": "必要", "certain": "特定", "additional": "附加", "otherwise": "其他",
    "common": "共同", "joint": "联合", "united": "联合", "central": "中央",
    "northern": "北部", "southern": "南部", "eastern": "东部", "western": "西部",
    "oriental": "东", "occidental": "西", "mountain": "山区", "valley": "谷地",
    "metro": "大都会", "island": "岛", "area": "地区", "areas": "地区", "places": "地方",
    "local": "地方", "community": "社区", "rural": "农村", "urban": "城市",
    "safety": "安全", "security": "安全", "health.": "卫生", "care": "照护",
    "children": "儿童", "persons": "人", "persons.": "人", "public.": "公共",
    "rights": "权利", "duties": "职责", "obligations": "义务", "powers": "权限",
    "functions": "职能", "service": "服务", "services": "服务", "facilities": "设施",
    "scheme": "计划", "program": "计划", "project": "项目", "projects": "项目",
    "policy": "政策", "measures": "措施", "control": "管制", "licensing": "许可",
    "permit": "许可", "fees": "费用", "fee": "费用", "payments": "支付", "payment": "支付",
    "loans": "贷款", "loan": "贷款", "credit": "信贷", "finance.": "财政",
    "renewing": "续期", "expanding.": "扩大", "franchise": "特许经营权",
    "franchises": "特许经营权", "casino": "赌场", "gaming": "博彩",
    "declaring.": "宣布", "declaring": "宣布", "charter": " Charter",
    "amendment.": "修正", "modifications": "修改", "provisions": "条款",
    "section": "条", "sections": "条", "paragraph": "款", "article": "条",
    "commencement": "生效", "approved": "批准", "approval": "批准",
    "implementation": "实施", "implement": "实施", "compliance": "合规",
    "sale": "销售", "sell": "销售", "goods": "货物", "products": "产品",
    "prices": "价格", "price": "价格", "interest": "利息", "exchange": "交易",
    "investigation": "调查", "inquiry": "调查", "inspection": "检查",
    "holiday": "假日", "nonworking": "非工作日", "day": "日", "date": "日期",
    "period": "期间", "time": "时间", "year": "年", "years": "年",
    "extensions": "延长", "extent": "范围", "extent.": "范围",
    "international": "国际", "national": "国家", "regional.": "区域",
    "development.": "发展", "banking": "银行", "securities": "证券",
    "futures": "期货", "trust": "信托", "trusts": "信托", "funds.": "经费",
}

# 数字词
NUM = {
    "one": "一", "two": "二", "three": "三", "four": "四", "five": "五", "six": "六",
    "seven": "七", "eight": "八", "nine": "九", "ten": "十", "eleven": "十一",
    "twelve": "十二", "thirteen": "十三", "fourteen": "十四", "fifteen": "十五",
    "sixteen": "十六", "seventeen": "十七", "eighteen": "十八", "nineteen": "十九",
    "twenty": "二十", "thirty": "三十", "forty": "四十", "fifty": "五十",
    "sixty": "六十", "seventy": "七十", "eighty": "八十", "ninety": "九十",
    "hundred": "百", "thousand": "千", "million": "百万",
}

# 功能词（不参与覆盖率计算，但要参与拼装）
FUNC = {
    "the": "", "of": "的", "and": "与", "or": "或", "for": "", "to": "", "in": "在",
    "on": "关于", "a": "", "an": "", "by": "", "with": "", "from": "自", "as": "",
    "at": "", "is": "", "are": "", "be": "", "that": "", "this": "", "its": "其",
    "it": "", "their": "其", "not": "", "under": "依据", "into": "转为", "other": "其他",
    "such": "该等", "any": "", "all": "", "shall": "", "may": "", "which": "",
    "thereof": "", "therein": "", "therefor": "为此", "said": "该", "same": "该",
    "every": "每", "another": "另一", "further": "进一步", "throughout": "全境",
    "within": "在", "located": "位于", "known": "称为", "numbered": "编号为",
    "entitled": "题为", "viz": "即", "including": "包括", "etc": "等",
}

PROPER_OK = re.compile(r"^(?:[A-Z][a-z'\-]+|[A-Z]{2,}|[A-Z][a-z]+(?:[A-Z][a-z]+)+)$")


def translate_title(t):
    """返回 (译文, 覆盖率)；覆盖率不足时返回 (None, cov)"""
    s = t.strip()
    if not s:
        return None, 0.0
    # 规范化空白/括号
    s = re.sub(r"\s+", " ", s)
    # 去掉首尾的编号前缀（如 "RG 1 "）
    s = re.sub(r"^(?:RG|S|No\.?)\s*\d+\s+", "", s)

    words = re.findall(r"[A-Za-z][A-Za-z\-']*|\d+", s)
    if not words:
        return None, 0.0

    content, proper, unknown = 0, [], []
    for i, w in enumerate(words):
        wl = w.lower()
        if wl in FUNC:
            continue
        if wl in TERMS or wl in NUM:
            content += 1
            continue
        # 数字
        if re.fullmatch(r"\d+", w):
            content += 1
            continue
        # 专有名词：非首词且首字母大写
        if i > 0 and PROPER_OK.match(w):
            proper.append(w); content += 1
            continue
        unknown.append(w)

    cov = content / max(1, content + len(unknown))
    if cov < 0.9 or len(unknown) > 0:
        return None, cov

    # —— 拼装：按原文顺序做词级替换，专有名词原样保留 ——
    out = []
    for i, w in enumerate(words):
        wl = w.lower()
        if re.fullmatch(r"\d+", w):
            out.append(w)
        elif wl in NUM:
            out.append(NUM[wl])
        elif wl in TERMS:
            out.append(TERMS[wl])
        elif wl in FUNC:
            out.append(FUNC[wl])
        elif i > 0 and PROPER_OK.match(w):
            out.append(w)
        else:
            out.append(w)
    zh = "".join(out)
    # 清理：连续重复、空括号、多余空格
    zh = re.sub(r"(的){2,}", "的", zh)
    zh = re.sub(r"\s{2,}", " ", zh).strip()
    zh = zh.replace("的的", "的")
    if len(zh) < 2:
        return None, cov
    return zh, cov


def main():
    LAWS = "prototype/data/laws"
    files = [f for f in glob.glob(LAWS + "/*.json") if os.path.basename(f) != "index.json"]
    done, skip = [], []
    for f in files:
        o = json.load(io.open(f, encoding="utf-8"))
        t = o.get("title") or {}
        if t.get("zh"):
            continue
        src = t.get("en")
        if not src or re.search(r"[\u0e00-\u0e7f\u1000-\u109f\u1780-\u17ff]", src):
            skip.append((o["id"], "非英文或缺失", src))
            continue
        zh, cov = translate_title(src)
        if zh:
            t["zh"] = zh
            o["title"] = t
            o.setdefault("titleTranslation", {})
            o["titleTranslation"] = {
                "engine": "rule-term", "reviewed": False,
                "source": src, "coverage": round(cov, 3),
                "note": "按术语表与结构规则机械译出，未经人工审校；专有名词（地名/人名）保留原文。",
            }
            done.append((o["id"], src, zh))
        else:
            skip.append((o["id"], "覆盖率不足 %.2f" % cov, src))
        if "--dry" not in sys.argv and zh:
            io.open(f, "w", encoding="utf-8").write(json.dumps(o, ensure_ascii=False, indent=1))

    print("  已译 %d 条 / 未译 %d 条" % (len(done), len(skip)))
    print("")
    print("=== 译出样例（前 18 条）===")
    for i, (lid, src, zh) in enumerate(done[:18], 1):
        print("  %2d) %s" % (i, src[:78]))
        print("      → %s" % zh[:78])
    from collections import Counter
    rc = Counter(r for _, r, _ in skip)
    print("")
    print("=== 未译原因分布 ===")
    for k, v in rc.most_common(8):
        print("  %-24s %5d" % (k, v))
    print("")
    print("=== 未译样例（前 10 条）===")
    for lid, why, src in skip[:10]:
        print("  %-22s %-16s %s" % (lid, why, str(src)[:60]))


if __name__ == "__main__":
    main()
