# -*- coding: utf-8 -*-
"""PH 标题中译引擎 v2（CALR-TITLE-20261017-1837-PH-7575 · slices 34-40）"""
import json
import re

CJK = re.compile(r'[\u4e00-\u9fff]')


def clean(e):
    e = re.sub(r'<.*$', '', e)
    e = e.replace('\u2019', "'").replace('\u2018', "'")
    e = e.replace('\u201c', '"').replace('\u201d', '"')
    e = e.replace('\u2013', '-').replace('\u2014', '-')
    e = re.sub(r'\s+', ' ', e).strip()
    e = re.sub(r'[\s.;]+$', '', e)
    return e


# ---------------- 数词 ----------------
ONES = {'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
        'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12,
        'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
        'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30, 'forty': 40,
        'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90}
NUMWORDS = set(ONES) | {'hundred', 'thousand', 'million'}


def words2num(s):
    s = s.lower().replace('-', ' ').replace(',', ' ')
    toks = [t for t in s.split() if t != 'and']
    if not toks:
        return None
    total, cur, seen = 0, 0, False
    for t in toks:
        if t in ONES:
            cur += ONES[t]
            seen = True
        elif t == 'hundred':
            cur = (cur or 1) * 100
            seen = True
        elif t == 'thousand':
            total += (cur or 1) * 1000
            cur = 0
            seen = True
        elif t == 'million':
            total += (cur or 1) * 1000000
            cur = 0
            seen = True
        else:
            return None
    return total + cur if seen else None


def is_num_token(t):
    core = t.lower().strip('.,;:')
    if core == 'and':
        return 'and'
    parts = core.replace('-', ' ').split()
    if parts and all(x in NUMWORDS for x in parts):
        return 'num'
    return None


def numify(text):
    toks = text.split(' ')
    out, buf = [], []

    def flushbuf():
        if not buf:
            return
        cleaned, punct = [], ''
        for t in buf:
            m = re.match(r'^([A-Za-z][A-Za-z-]*)([.,;:]?)$', t)
            if m:
                cleaned.append(m.group(1))
                punct = m.group(2) or punct
        v = words2num(' '.join(cleaned)) if cleaned else None
        out.append((str(v) + punct) if v is not None else ' '.join(buf))
        del buf[:]

    for idx, t in enumerate(toks):
        k = is_num_token(t)
        if k == 'and' and buf:
            prev = buf[-1].lower().strip('.,')
            nxt = toks[idx + 1] if idx + 1 < len(toks) else ''
            if prev in ('hundred', 'thousand', 'million') and is_num_token(nxt) == 'num':
                buf.append(t)
                continue
            flushbuf()
            out.append(t)
            continue
        if k == 'num':
            buf.append(t)
        else:
            flushbuf()
            out.append(t)
    flushbuf()
    return ' '.join(out)


# ---------------- 词典 ----------------
PHRASE = [
    ('foundation day', '成立纪念日'), ('charter anniversary', '建市纪念日'),
    ('foundation anniversary', '成立周年纪念日'), ('anniversary day', '周年纪念日'),
    ('anniversary', '周年纪念日'), ('day', '日'),
]

HEAD = [
    ('school of arts and trades', '工艺学校'), ('school of arts and crafts', '工艺美术学校'),
    ('school of fisheries', '渔业学校'), ('school of nursing', '护理学校'),
    ('school of agriculture', '农业学校'),
    ('highway engineering district', '公路工程区'), ('engineering district', '工程区'),
    ('central elementary school', '中央小学'), ('central pilot school', '中央实验学校'),
    ('national high school', '国立中学'), ('provincial high school', '省立中学'),
    ('municipal high school', '市镇中学'), ('city high school', '市立中学'),
    ('barangay high school', '描笼涯中学'), ('barrio high school', '村中学'),
    ('barangay elementary school', '描笼涯小学'), ('central school', '中央学校'),
    ('elementary school', '小学'), ('primary school', '小学'),
    ('preparatory school', '预备学校'), ('high school', '中学'),
    ('national school', '国立学校'), ('community school', '社区学校'),
    ('barrio school', '村学校'), ('barangay school', '描笼涯学校'),
    ('pilot school', '实验学校'), ('municipal school', '市镇学校'),
    ('provincial school', '省立学校'), ('vocational school', '职业学校'),
    ('polytechnic institute', '理工学院'), ('technological institute', '技术学院'),
    ('national college', '国立学院'), ('state college', '州立学院'),
    ('community college', '社区学院'), ('memorial medical center', '纪念医疗中心'),
    ('medical center', '医疗中心'), ('regional hospital', '区域医院'),
    ('provincial hospital', '省立医院'), ('district hospital', '区医院'),
    ('emergency hospital', '急诊医院'), ('memorial hospital', '纪念医院'),
    ('general hospital', '综合医院'), ('training hospital', '培训医院'),
    ('health center', '卫生中心'), ('health office', '卫生办公室'),
    ('regional office', '区域办公室'), ('district office', '区办公室'),
    ('field office', '外地办事处'), ('extension office', '推广办公室'),
    ('national road', '国道'), ('national highway', '国家公路'),
    ('provincial road', '省道'), ('highway', '公路'), ('avenue', '大道'),
    ('boulevard', '大道'), ('street', '街'), ('bridge', '桥'), ('river', '河'),
    ('creek', '溪'), ('park', '公园'), ('plaza', '广场'), ('rotonda', '环形广场'),
    ('dike', '堤'), ('dam', '水坝'), ('reservoir', '水库'),
    ('irrigation system', '灌溉系统'), ('airfield', '机场'), ('airport', '机场'),
    ('landing field', '降落场'), ('wharf', '码头'), ('pier', '码头'),
    ('port', '港口'), ('lighthouse', '灯塔'), ('camp', '营地'),
    ('substation', '变电站'), ('station', '站'), ('building', '大楼'),
    ('gymnasium', '体育馆'), ('stadium', '体育场'), ('monument', '纪念碑'),
    ('shrine', '祠'), ('marker', '标志碑'), ('seminary', '神学院'),
    ('university', '大学'), ('college', '学院'), ('institute', '学院'),
    ('academy', '学院'), ('school', '学校'), ('hospital', '医院'),
    ('center', '中心'), ('centre', '中心'), ('complex', '综合体'),
    ('hall', '礼堂'), ('road', '公路'),
]

ADJ = {
    'north': '北', 'south': '南', 'east': '东', 'west': '西',
    'northern': '北部', 'southern': '南部', 'eastern': '东部', 'western': '西部',
    'central': '中央', 'new': '新', 'old': '旧', 'upper': '上', 'lower': '下',
    'national': '国立', 'provincial': '省立', 'municipal': '市镇', 'city': '市立',
    'regional': '区域', 'district': '区', 'general': '综合', 'special': '特别',
    'public': '公立', 'private': '私立', 'rural': '农村', 'urban': '城市',
    'agricultural': '农业', 'experimental': '实验', 'demonstration': '示范',
    'pilot': '实验', 'integrated': '综合', 'comprehensive': '综合',
    'memorial': '纪念', 'community': '社区', 'vocational': '职业',
    'technical': '技术', 'industrial': '工业', 'commercial': '商业',
    'normal': '师范', 'science': '科学', 'arts': '艺术', 'trade': '贸易',
    'trades': '工艺', 'fisheries': '渔业', 'forestry': '林业', 'agriculture': '农业',
    'engineering': '工程', 'technology': '技术', 'business': '商业',
    'sports': '体育', 'culture': '文化', 'health': '卫生', 'mental': '精神',
    'orthopedic': '骨科', 'training': '培训', 'research': '研究',
    'development': '发展', 'extension': '推广', 'first': '第一', 'second': '第二',
    'third': '第三', 'fourth': '第四', 'fifth': '第五', 'sixth': '第六',
    'seventh': '第七', 'eighth': '第八', 'ninth': '第九', 'tenth': '第十',
    'barangay': '描笼涯', 'barrio': '村', 'sitio': '小村', 'poblacion': '镇中心',
    'certain': '某', 'regular': '正规', 'its': '其', 'sections': '条', 'items': '项', 'their': '其', 'separate': '独立', 'provisions': '规定',
    'congressional': '众议员', 'representative': '众议员', 'legislative': '立法', 'barrios': '村', 'sitios': '小村',
    'barangays': '描笼涯', 'original': '原', 'existing': '现有',
    'main': '主要', 'old': '旧', 'same': '同一', 'said': '该',
}

GAZ = {
    'abra': '阿布拉', 'agusan del norte': '北阿古桑', 'agusan del sur': '南阿古桑',
    'aklan': '阿克兰', 'albay': '阿尔拜', 'antique': '安蒂克', 'aurora': '奥罗拉',
    'bataan': '巴丹', 'batanes': '巴塔内斯', 'batangas': '八打雁', 'benguet': '本格特',
    'biliran': '比利兰', 'bohol': '保和', 'bukidnon': '布基农', 'bulacan': '布拉干',
    'cagayan': '卡加延', 'camarines norte': '北甘马粦', 'camarines sur': '南甘马粦',
    'camiguin': '卡米金', 'capiz': '卡皮斯', 'catanduanes': '卡坦端内斯',
    'cavite': '甲米地', 'cebu': '宿务', 'cotabato': '哥打巴托', 'davao de oro': '金达沃',
    'davao del norte': '北达沃', 'davao del sur': '南达沃', 'davao oriental': '东达沃',
    'davao occidental': '西达沃', 'dinagat islands': '迪纳加特群岛',
    'eastern samar': '东萨马', 'guimaras': '吉马拉斯', 'ifugao': '伊富高',
    'ilocos norte': '北伊罗戈', 'ilocos sur': '南伊罗戈', 'iloilo': '伊洛伊洛',
    'isabela': '伊莎贝拉', 'kalinga': '卡林加', 'la union': '拉乌尼翁',
    'laguna': '拉古纳', 'lanao del norte': '北拉瑙', 'lanao del sur': '南拉瑙',
    'leyte': '莱特', 'maguindanao': '马京达瑙', 'marinduque': '马林杜克',
    'masbate': '马斯巴特', 'misamis occidental': '西米萨米斯',
    'misamis oriental': '东米萨米斯', 'mountain province': '高山省',
    'negros occidental': '西内格罗斯', 'negros oriental': '东内格罗斯',
    'northern samar': '北萨马', 'nueva ecija': '新怡诗夏', 'nueva vizcaya': '新比斯开',
    'occidental mindoro': '西明多洛', 'oriental mindoro': '东明多洛',
    'palawan': '巴拉望', 'pampanga': '邦板牙', 'pangasinan': '邦阿西楠',
    'quezon': '奎松', 'quirino': '基里诺', 'rizal': '黎刹', 'romblon': '朗布隆',
    'samar': '萨马', 'sarangani': '萨兰加尼', 'siquijor': '锡基霍尔',
    'sorsogon': '索索贡', 'south cotabato': '南哥打巴托', 'southern leyte': '南莱特',
    'sultan kudarat': '苏丹库达拉特', 'sulu': '苏禄', 'surigao del norte': '北苏里高',
    'surigao del sur': '南苏里高', 'tarlac': '打拉', 'tawi-tawi': '塔威塔威',
    'zambales': '三描礼士', 'zamboanga del norte': '北三宝颜',
    'zamboanga del sur': '南三宝颜', 'zamboanga sibugay': '三宝颜锡布格',
    'zamboanga': '三宝颜', 'mindanao': '民答那峨', 'visayas': '米沙鄢',
    'manila': '马尼拉', 'quezon city': '奎松市', 'caloocan': '卡洛奥坎',
    'kalookan': '卡洛奥坎', 'makati': '马卡蒂', 'pasig': '帕西格', 'taguig': '达义',
    'paranaque': '帕拉尼亚克', 'las pinas': '拉斯皮纳斯', 'muntinlupa': '蒙廷卢帕',
    'marikina': '马里基纳', 'valenzuela': '巴伦苏埃拉', 'mandaluyong': '曼达卢永',
    'pasay': '帕赛', 'malabon': '马拉邦', 'navotas': '纳沃塔斯', 'antipolo': '安蒂波洛',
    'baguio': '碧瑶', 'lapu-lapu': '拉普拉普', 'mandaue': '曼达维',
    'davao city': '达沃市', 'zamboanga city': '三宝颜市', 'iloilo city': '伊洛伊洛市',
    'bacolod': '巴科洛德', 'cagayan de oro': '卡加延-德奥罗',
    'general santos': '桑托斯将军城', 'tacloban': '塔克洛班',
    'batangas city': '八打雁市', 'angeles': '安赫莱斯', 'naga': '那牙',
    'legazpi': '黎牙实比', 'dagupan': '达古潘', 'lucena': '卢塞纳',
    'puerto princesa': '普林塞萨港', 'butuan': '武端', 'iligan': '伊利甘',
    'marawi': '马拉维', 'cotabato city': '哥打巴托市', 'tagum': '塔古姆',
    'dumaguete': '杜马格特', 'roxas': '罗哈斯', 'ormoc': '奥尔莫克',
    'laoag': '拉瓦格', 'vigan': '维甘', 'tuguegarao': '土格加劳',
    'malolos': '马洛洛斯', 'san jose del monte': '圣何塞德尔蒙特',
    'san fernando': '圣费尔南多', 'tarlac city': '打拉市', 'davao': '达沃',
    'cebu city': '宿务市', 'san juan': '圣胡安',
}

ADMIN = {'province': '省', 'city': '市', 'municipality': '市镇',
         'municipal district': '市镇区', 'subprovince': '次省', 'sub-province': '次省',
         'barrio': '村', 'barangay': '描笼涯', 'sitio': '小村', 'district': '区',
         'region': '大区', 'island': '岛', 'islands': '群岛', 'valley': '谷',
         'poblacion': '镇中心', 'town': '镇', 'municipalities': '市镇',
         'barrios': '村', 'barangays': '描笼涯', 'sitios': '小村', 'cities': '市',
         'provinces': '省', 'districts': '区'}


def jz(a, b):
    a, b = a.strip(), b.strip()
    if not a:
        return b
    if not b:
        return a
    if CJK.match(a[-1]) and CJK.match(b[0]):
        return a + b
    if b[:1] in '第附（':
        return a + b
    return a + ' ' + b


def top_hits(s, word):
    res = []
    for m in re.finditer(r'(?<![A-Za-z])' + re.escape(word) + r'(?![A-Za-z])', s, re.I):
        pre = s[:m.start()]
        if pre.count('"') % 2 == 0 and pre.count('(') == pre.count(')'):
            res.append((m.start(), m.end()))
    return res


def split_last(s, words):
    best = None
    for w in words:
        h = top_hits(s, w)
        if h:
            p = h[-1]
            if best is None or p[0] > best[0]:
                best = p
    if best is None:
        return None
    return s[:best[0]].strip().rstrip(','), s[best[1]:].strip()


def split_top(s):
    out, buf, depth, q = [], [], 0, False
    for ch in s:
        if ch == '"':
            q = not q
        if not q:
            if ch in '([':
                depth += 1
            elif ch in ')]':
                depth -= 1
            elif ch == ',' and depth == 0:
                out.append(''.join(buf).strip())
                buf = []
                continue
        buf.append(ch)
    if ''.join(buf).strip():
        out.append(''.join(buf).strip())
    return out


def is_admin_part(p):
    q = re.sub(r'^(?:the|said)\s+', '', p.strip(), flags=re.I)
    return bool(re.match(r'^(province|city|municipality|municipal district|sub-?province|'
                         r'barrio|barangay|sitio|district|region|town|poblacion|valley|'
                         r'island)\b', q, re.I))


def tr_place(name):
    n = name.strip().rstrip('.')
    k = n.lower()
    if k in ADMIN:
        return ADMIN[k]
    if k in GAZ:
        return GAZ[k]
    m = re.match(r'^(.+?)\s+(City|Province|Municipality|Municipal District|Island)$', n, re.I)
    if m:
        base = GAZ.get(m.group(1).lower(), m.group(1))
        suf = {'city': '市', 'province': '省', 'municipality': '市镇',
               'municipal district': '市镇区', 'island': '岛'}[m.group(2).lower()]
        return base if base.endswith(suf) else base + suf
    n = re.sub(r'\s+and\s+', ' 与 ', n)
    return n


def tr_admin(p):
    q = re.sub(r'^(?:the|said)\s+', '', p.strip(), flags=re.I).rstrip('.')
    m = re.match(r'^(province|city|municipality|municipal district|sub-?province|'
                 r'barrios?|barangays?|sitios?|districts?|region|town|poblacion|valley|'
                 r'islands?|municipalities|cities|provinces)\s+of\s+(.+)$', q, re.I)
    if m:
        kind = re.sub(r'\s+', ' ', m.group(1).lower())
        nm = tr_place(m.group(2).strip())
        suf = ADMIN.get(kind, '')
        if suf and nm.endswith(suf):
            return nm
        return nm + suf
    m = re.match(r'^(barrios?|barangays?|sitios?|poblacion|municipalities|cities|'
                 r'provinces|districts?)\s+(.+)$', q, re.I)
    if m:
        kind = re.sub(r'\s+', ' ', m.group(1).lower())
        nm = tr_place(m.group(2).strip())
        suf = ADMIN.get(kind, '')
        return nm if (suf and nm.endswith(suf)) else nm + suf
    return tr_place(q)


def tr_loc(loc):
    parts = [p for p in split_top(loc) if p.strip()]
    zh = [tr_admin(p) for p in parts]
    zh.reverse()
    return ' '.join(x for x in zh if x)


def tr_mods(pre, gaz=True):
    if not pre:
        return ''
    pre = re.sub(r"\b([A-Z][\w'.-]*(?:\s+[A-Z][\w'.-]*)?)\s+City\b",
                 lambda m: tr_place(m.group(1) + ' City'), pre)
    out = []
    for t in pre.split():
        k = t.lower().strip('.,')
        if k in ('the', 'a', 'an', 'said'):
            continue
        if k == 'and':
            out.append('与')
            continue
        if k in ADJ:
            out.append(ADJ[k])
        elif k in GAZ and gaz:
            out.append(GAZ[k])
        else:
            out.append(t)
    s, prev_cn = '', False
    for t in out:
        is_cn = bool(CJK.match(t))
        if s and not (is_cn and prev_cn):
            s += ' '
        s += t
        prev_cn = is_cn
    return s.strip()


def tr_head(h):
    h = h.strip().rstrip('.').strip()
    h = re.sub(r'^(?:the|a|an|said)\s+', '', h, flags=re.I)
    m = re.match(r'^(barrios?|barangays?|sitios?|poblacion)\s+of\s+(.+)$', h, re.I)
    if m:
        return (tr_mods(m.group(2)) + ADMIN[m.group(1).lower()]).strip()
    if is_admin_part(h):
        return tr_loc(h)
    h2 = re.sub(r'\s*\([^()]*\)\s*$', '', h).strip()
    low = h.lower()
    low2 = h2.lower()
    for suf, zh in PHRASE:
        if low == suf:
            return zh
        if low.endswith(' ' + suf):
            return (tr_mods(h[:len(h) - len(suf) - 1]) + zh).strip()
    for suf, zh in HEAD:
        if low2 == suf or low2.endswith(' ' + suf):
            pre = h2[:len(h2) - len(suf) - 1].strip()
            return jz(tr_mods(pre), zh)
    for suf, zh in HEAD:
        if low == suf or low == suf + 's':
            return zh
        if low.endswith(' ' + suf) or low.endswith(' ' + suf + 's'):
            pre = h[:len(h) - len(suf) - 1].strip()
            return (tr_mods(pre) + zh).strip()
    return tr_mods(h, False)


def tr_np(s):
    s = s.strip().rstrip('.').strip()
    s = re.sub(r'^(?:the|a|an)\s+', '', s, flags=re.I)
    if not s:
        return ''
    for pos in reversed(top_hits(s, 'of')):
        prev = s[:pos[0]].strip().split()
        if prev and prev[-1].lower() in ('province', 'city', 'municipality',
                                         'municipal', 'subprovince', 'sub-province',
                                         'barangay', 'barrio', 'sitio', 'region',
                                         'island', 'town', 'poblacion', 'valley'):
            continue
        cand = s[pos[1]:].strip()
        right = re.sub(r'^(?:the|said)\s+', '', cand, flags=re.I).rstrip('.')
        if (is_admin_part(right) and re.search(r'\bof\b', right, re.I)) \
                or right.lower() in GAZ:
            return jz(tr_loc(cand), tr_np(s[:pos[0]]))
    r = split_last(s, ['in', 'at'])
    if r and r[0] and r[1]:
        head, loc = r
        first = re.sub(r'^(?:the|said)\s+', '', split_top(loc)[0], flags=re.I)
        key = first.lower().rstrip('.')
        if is_admin_part(first) or key in GAZ or key in ADMIN or ',' in loc \
                or (key.split() and key.split()[-1] in ADMIN):
            return jz(tr_loc(loc), tr_np(head))
    if is_admin_part(s):
        return tr_loc(s)
    return tr_head(s)


# ---------------- 法条引用 ----------------
FIXED = {
    'administrative code': '《行政法典》',
    'revised administrative code': '《修订行政法典》',
    'revised penal code': '《修订刑法典》',
    'national internal revenue code': '《国家国内税收法典》',
    'internal revenue code': '《国内税收法典》',
    'rules of court': '《法院规则》',
    'corporation law': '《公司法》',
    'civil service decree': '《公务员法令》',
    'locust act': '《蝗虫法》',
    'rural banks act': '《农村银行法》',
    "rural banks' act": '《农村银行法》',
    'revised charter of quezon city': '《奎松市修订宪章》',
}

REFMAP = [
    (r'^sections?\s+numbered\s+(.+)$', '第%s条'),
    (r'^sections?\s+(.+)$', '第%s条'),
    (r'^sub-?sections?\s+(.+)$', '第%s款'),
    (r'^sub-?paragraphs?\s+(.+)$', '第%s目'),
    (r'^paragraph\s+(.+)$', '第%s款'),
    (r'^article\s+(.+)$', '第%s条'),
    (r'^sub-?items?\s+(.+)$', '第%s项'),
    (r'^item\s+(.+)$', '第%s项'),
    (r'^page\s+(.+)$', '第%s页'),
    (r'^title\s+(.+)$', '%s编'),
    (r'^chapter\s+(.+)$', '第%s章'),
    (r'^group\s+(.+)$', '第%s组'),
    (r'^appendix\s+(.+)$', '附录%s'),
    (r'^rule\s+numbered\s+(.+)$', '第%s号规则'),
    (r'^project\s+numbered\s+(.+)$', '%s 项目'),
    (r'^projects?\s+(.+)$', '%s 项目'),
    (r'^subsection\s+(.+)$', '第%s款'),
]

LAWS = [
    (r'^republic act(?: numbered)?\s+(.+)$', '第%s号共和国法'),
    (r'^republic act$', '共和国法'),
    (r'^commonwealth act(?: numbered)?\s+(.+)$', '第%s号联邦法'),
    (r'^act numbered\s+(.+)$', '第%s号法'),
    (r'^batas pambansa(?: bilang)?\s+(.+)$', 'Batas Pambansa Bilang %s'),
    (r'^presidential decree(?: numbered)?\s+(.+)$', '第%s号总统法令'),
    (r'^executive order(?: numbered)?\s+(.+)$', '第%s号行政命令'),
    (r'^administrative order(?: numbered)?\s+(.+)$', '第%s号行政命令'),
]


ORD = {'first': '1', 'second': '2', 'third': '3', 'fourth': '4', 'fifth': '5',
       'sixth': '6', 'seventh': '7', 'eighth': '8', 'ninth': '9', 'tenth': '10',
       'last': '最后', 'penultimate': '倒数第二'}


def numarg(a):
    m = re.match(r'^([A-Za-z-]+?)-([A-Za-z0-9.]+)$', a)
    if m:
        v = words2num(m.group(1))
        if v is not None:
            return '%s-%s' % (v, m.group(2))
    return a


def tr_refpart(p):
    p = p.strip().rstrip('.').strip()
    p = re.sub(r'^and\s+for\s+[Oo]ther\s+Purposes?$', '其他目的', p)
    p = re.sub(r',?\s*and\s+for\s+[Oo]ther\s+Purposes?\s*$', '', p).strip()
    low = p.lower()
    if low in FIXED:
        return FIXED[low]
    if '\u0001' in p:
        return restore(re.sub(r'^(?:the|said)\s+', '', p, flags=re.I))
    low = re.sub(r'^(?:the|said)\s+', '', low)
    p2 = re.sub(r'^(?:the|said)\s+', '', p, flags=re.I)
    m = re.match(r'^for\s+(.+)$', p2, re.I)
    if m:
        return tr_refpart(m.group(1))
    m = re.match(r'^(under)\s+(.+)$', p2, re.I)
    if m:
        return cn_ref(m.group(2)) + '项下'
    m = re.match(r'^(%s)\s+(paragraph|section|article|item|page|chapter|title|'
                 r'subsection|subparagraph)$' % '|'.join(ORD), low)
    if m:
        unit = m.group(2)
        val = ORD[m.group(1)]
        for pat, fmt in REFMAP:
            if re.match(pat, unit + ' x'):
                return (fmt % val) if val.isdigit() else (fmt % ('%s' % val)).replace('第最后', '最后')
    for pat, fmt in REFMAP:
        m = re.match(pat, low, re.I)
        if m:
            arg = p2[m.start(1):m.end(1)].strip()
            arg = numarg(arg)
            arg = re.sub(r'\s+and\s+', ' 与 ', arg)
            if arg.startswith('（'):
                arg = arg.replace(' 与 ', '与')
            arg = re.sub(r'\(([A-Za-z0-9]+)\)', r'（\1）', arg)
            mm = re.match(r'^(.+?)\s*\(([A-Za-z0-9]+)\)$', arg)
            if mm:
                return (fmt % mm.group(1).strip()) + '（%s）' % mm.group(2)
            arg = re.sub(r'^\(([A-Za-z0-9]+)\)$', r'（\1）', arg)
            return fmt % arg
    for pat, fmt in LAWS:
        m = re.match(pat, low, re.I)
        if m:
            arg = p2[m.start(1):m.end(1)].strip() if m.groups() else ''
            arg = re.sub(r',?\s*and\s+for\s+[Oo]ther\s+Purposes?\s*$', '', arg).strip().rstrip(',')
            if arg.lower() in FIXED:
                return fmt % FIXED[arg.lower()]
            return (fmt % arg) if arg else fmt
    return tr_np(p2)


SENT = {}


def protect(p):
    """把 FIXED 短语替换为哨兵，避免 'of' 误切"""
    out = p
    for k in sorted(FIXED, key=len, reverse=True):
        m = re.search(r'(?<![A-Za-z])' + re.escape(k) + r'(?![A-Za-z])', out, re.I)
        if m:
            key = '\u0001%d\u0001' % len(SENT)
            SENT[key] = FIXED[k]
            out = out[:m.start()] + key + out[m.end():]
    return out


def restore(x):
    for k, v in SENT.items():
        x = x.replace(k, v)
    return x


def ref_one(p):
    p = p.strip().rstrip('.')
    p = re.sub(r'^(?:the|said)\s+', '', p, flags=re.I)
    p = re.sub(r'^of\s+', '', p, flags=re.I)
    if re.match(r'^(for|under)\s+', p, re.I):
        return tr_refpart(p)
    if p.lower() in FIXED:
        return FIXED[p.lower()]
    ps = re.split(r'\s+of\s+', protect(p), flags=re.I)
    out = ''
    for x in reversed(ps):
        piece = restore(tr_refpart(x.strip()))
        out = jz(out, piece) if out else piece
    return out


def cn_ref(s):
    s = numify(s.strip().rstrip('.'))
    s = re.sub(r'^(?:the|said)\s+', '', s, flags=re.I)
    s = re.sub(r'^of\s+', '', s, flags=re.I)
    bylaw = ''
    mb = re.search(r',?\s*as\s+Amended\s+by\s+(.+)$', s, re.I)
    if mb:
        bylaw = '（经%s修正）' % cn_ref(mb.group(1))
        s = s[:mb.start()].rstrip().rstrip(',')
    known = ''
    mk = re.search(r',?\s+[Oo]therwise\s+[Kk]nown\s+as\s+(?:the\s+)?(.+)$', s) or \
        re.search(r',?\s+[Kk]nown\s+as\s+(?:the\s+)?(.+)$', s)
    if mk:
        nm = mk.group(1).strip().rstrip('.')
        known = '（即%s）' % (FIXED[nm.lower()] if nm.lower() in FIXED else tr_np(nm))
        s = s[:mk.start()].rstrip().rstrip(',')
    amended = False
    m = re.search(r',?\s*as\s+Amended\s*$', s, re.I)
    if m:
        amended = True
        s = s[:m.start()].strip()
    s = re.sub(r',?\s*and\s+for\s+[Oo]ther\s+Purposes?\s*$', '', s).strip().rstrip(',')
    parts = [p for p in split_top(s) if p.strip()]
    out = ''
    for p in reversed(parts):
        out += ref_one(p)
    if amended:
        out += '（经修正）'
    return (out + known + bylaw).strip()


# ---------------- 句级 ----------------
CN_NUM = {'one': '一', 'two': '两', 'three': '三', 'four': '四', 'five': '五',
          'six': '六', 'seven': '七', 'eight': '八', 'nine': '九', 'ten': '十',
          'eleven': '十一', 'twelve': '十二'}


def tr_list(s):
    s = s.strip().rstrip('.')
    parts = re.split(r',\s*|\s+and\s+', s)
    parts = [p.strip() for p in parts if p.strip()]
    if not parts:
        return ''
    if len(parts) == 1:
        return tr_np(parts[0])
    return '、'.join(tr_np(p) for p in parts[:-1]) + ' 与 ' + tr_np(parts[-1])


VERB = [
    ('providing for the', '规定'), ('providing for', '规定'), ('provide for', '规定'),
    ('providing', '规定'), ('provide', '规定'),
    ('authorizing', '授权'), ('authorize', '授权'),
    ('reappropriating', '重新划拨'), ('reappropriate', '重新划拨'),
    ('appropriating', '拨款'), ('appropriate', '拨款'),
    ('creating', '设立'), ('create', '设立'),
    ('establishing', '设立'), ('establish', '设立'),
    ('constituting', '组建'), ('constitute', '组建'),
    ('transferring', '移交'), ('transfer', '移交'),
    ('extending', '延长'), ('extend', '延长'),
    ('increasing', '增加'), ('increase', '增加'),
    ('reducing', '减少'), ('reduce', '减少'),
    ('requiring', '要求'), ('require', '要求'),
    ('fixing', '确定'), ('fix', '确定'),
    ('including', '纳入'), ('include', '纳入'),
    ('separating', '分离'), ('separate', '分离'),
    ('dividing', '划分'), ('divide', '划分'),
    ('exempting', '豁免'), ('exempt', '豁免'),
    ('repealing', '废止'), ('repeal', '废止'),
    ('granting', '授予'), ('grant', '授予'),
    ('allowing', '允许'), ('allow', '允许'),
    ('postponing', '推迟'), ('postpone', '推迟'),
    ('adopting', '通过'), ('adopt', '通过'),
    ('formalizing', '正式确定'), ('formalize', '正式确定'),
    ('upgrading', '提升'), ('upgrade', '提升'),
    ('abolishing', '废除'), ('abolish', '废除'),
    ('suspending', '中止'), ('suspend', '中止'),
    ('adjusting', '调整'), ('adjust', '调整'),
    ('deleting', '删除'), ('delete', '删除'),
    ('inserting', '插入'), ('insert', '插入'),
    ('adding', '增列'), ('add', '增列'),
    ('regulating', '规范'), ('regulate', '规范'),
    ('prescribing', '规定'), ('prescribe', '规定'),
    ('prohibiting', '禁止'), ('prohibit', '禁止'),
    ('penalizing', '处罚'), ('penalize', '处罚'),
    ('imposing', '征收'), ('impose', '征收'),
    ('levying', '征收'), ('levy', '征收'),
    ('institutionalizing', '制度化'), ('institutionalize', '制度化'),
    ('strengthening', '加强'), ('strengthen', '加强'),
    ('restructuring', '重组'), ('restructure', '重组'),
    ('reorganizing', '重组'), ('reorganize', '重组'),
    ('consolidating', '合并'), ('consolidate', '合并'),
    ('expanding', '扩大'), ('expand', '扩大'),
    ('restricting', '限制'), ('restrict', '限制'),
    ('declaring', '宣布'), ('declare', '宣布'),
    ('conferring', '授予'), ('confer', '授予'),
    ('merging', '合并'), ('merge', '合并'),
]

MONTHS = {'january': '1', 'february': '2', 'march': '3', 'april': '4', 'may': '5',
          'june': '6', 'july': '7', 'august': '8', 'september': '9', 'october': '10',
          'november': '11', 'december': '12'}

HOLIDAY = [
    ('special nonworking public holiday', '特别非工作公共假日'),
    ('special non-working public holiday', '特别非工作公共假日'),
    ('special nonworking holiday', '特别非工作假日'),
    ('special non-working holiday', '特别非工作假日'),
    ('special public holiday', '特别公共假日'),
    ('special working public holiday', '特别工作公共假日'),
    ('special working holiday', '特别工作假日'),
    ('special holiday', '特别假日'),
    ('legal holiday', '法定假日'),
    ('regular holiday', '常规假日'),
    ('national holiday', '全国假日'),
    ('nonworking holiday', '非工作假日'),
    ('non-working holiday', '非工作假日'),
    ('public holiday', '公共假日'),
    ('local holiday', '地方假日'),
    ('holiday', '假日'),
]


def tr_date(s):
    raw = s.strip().rstrip(',')
    s2 = numify(re.sub(r'\s+of\s+every\s+year', '', raw, flags=re.I)).strip()
    s2 = re.sub(r'^(?:the\s+)', '', s2, flags=re.I)
    m = re.match(r'^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?$', s2)
    if m and m.group(1).lower() in MONTHS:
        out = '%s 月 %s 日' % (MONTHS[m.group(1).lower()], m.group(2))
        if m.group(3):
            out += ' %s 年' % m.group(3)
        if re.search(r'every\s+year', raw, re.I):
            out = '每年 ' + out
        return out
    return s2


def tr_holiday(s):
    low = s.lower().strip().rstrip('.')
    for k, v in HOLIDAY:
        if low == k:
            return v
        if low.endswith(' ' + k):
            return (tr_mods(s[:len(s) - len(k) - 1]) + v).strip()
    return tr_mods(s)


def tr_target(b):
    b = b.strip().rstrip('.')
    m = re.search(r',?\s+[Tt]o\s+[Bb]e\s+[Kk]nown\s+[Aa]s\s+(?:the\s+)?(.+)$', b)
    if m:
        pre = b[:m.start()].strip()
        pre = re.sub(r'^(?:a|an|the)\s+', '', pre, flags=re.I)
        return '名称为%s的%s' % (tr_np(m.group(1)), tr_np(pre)) if pre else '名称为' + tr_np(m.group(1))
    b = re.sub(r'^that\s+of\s+', '', b, flags=re.I)
    b = re.sub(r'^(?:the|a|an|said)\s+', '', b, flags=re.I)
    return tr_np(b)


def tr_tail(rest):
    tail = ''
    m = re.search(r',?\s*[Aa]mending\s+for\s+the\s+Purpose\s+(?:of\s+)?(.+)$', rest)
    if m:
        tail = '，为此修订' + cn_ref(m.group(1))
        rest = rest[:m.start()]
    for pat in (r',\s*[Oo]therwise\s+[Kk]nown\s+as\s+(?:the\s+)?(.+)$',
                r',\s*[Kk]nown\s+as\s+(?:the\s+)?(.+)$',
                r',\s*[Ee]ntitled\s+(.+)$'):
        m = re.search(pat, rest)
        if m:
            nm1 = m.group(1).strip().rstrip('.')
            tail = '（即%s）' % (FIXED[nm1.lower()] if nm1.lower() in FIXED else tr_np(nm1)) + tail
            rest = rest[:m.start()]
    if re.search(r',?\s*and\s+for\s+[Oo]ther\s+Purposes?\s*$', rest):
        tail += '，并为其他目的'
        rest = re.sub(r',?\s*and\s+for\s+[Oo]ther\s+Purposes?\s*$', '', rest).strip().rstrip(',')
    return rest, tail


def _date_head(rest):
    m = re.match(r'^(?:the\s+)?([A-Z][a-z]+\s+\d{1,2}(?:,\s*\d{4})?)'
                 r'(?:\s+of\s+[Ee]very\s+[Yy]ear)?\s*(.*)$', rest)
    if m and m.group(1).split()[0].lower() in MONTHS:
        d = tr_date(m.group(1))
        if re.search(r'of\s+every\s+year', rest, re.I):
            d = '每年 ' + d
        return d, m.group(2).strip()
    return None, rest


def tr_declare(rest):
    date, rest = _date_head(rest)
    if date:
        rest = re.sub(r'^as\s+', '', rest, flags=re.I)
        # 名称 + 假日：  NAME, a HOLIDAY in LOC
        m = re.match(r'^(.+?),\s+(?:a|an|the)\s+(.+?)\s+in\s+(.+)$', rest, re.I)
        if m and not re.search(r'holiday$', m.group(1), re.I):
            return '宣布%s为%s，%s%s' % (date, tr_np(m.group(1)),
                                     tr_holiday(m.group(2)), '，位于' + tr_loc(m.group(3)))
        # NAME and a HOLIDAY in LOC
        m = re.match(r'^(.+?)\s+and\s+(?:a|an|the)\s+(.+?)\s+in\s+(.+)$', rest, re.I)
        if m:
            return '宣布%s为%s及%s，位于%s' % (date, tr_np(m.group(1)),
                                        tr_holiday(m.group(2)), tr_loc(m.group(3)))
        # HOLIDAY in LOC [to be known as NAME] [in commemoration of X]
        m = re.match(r'^(?:a|an|the)?\s*(.+?)\s+in\s+(.+)$', rest, re.I)
        if m:
            hol, tail = m.group(1), m.group(2)
            name, comm = '', ''
            mm = re.search(r',?\s+[Tt]o\s+[Bb]e\s+[Kk]nown\s+[Aa]s\s+(?:the\s+)?'
                           r'("?)([^"]+)\1?(?:,.*)?$', tail, re.I)
            if mm:
                name = mm.group(2).strip()
                tail = tail[:mm.start()]
            mm = re.search(r',?\s+[Ii]n\s+[Cc]ommemoration\s+of\s+(?:its\s+|the\s+)?(.+)$',
                           tail, re.I)
            if mm:
                comm = mm.group(1)
                tail = tail[:mm.start()]
            tail = re.sub(r',?\s+to\s+commemorate.*$', '', tail, flags=re.I)
            out = '宣布%s为%s%s' % (date, tr_loc(tail), tr_holiday(hol))
            if name:
                out += '（名称为%s）' % tr_np(name)
            if comm:
                out += '，以纪念%s' % tr_np(comm)
            return out
        m = re.match(r'^(.+)$', rest, re.I)
        return '宣布%s为%s' % (date, tr_np(rest))
    m = re.match(r'^(.+?)\s+as\s+(.+)$', rest, re.I)
    if m:
        return '宣布将%s定为%s' % (tr_np(m.group(1)), tr_np(m.group(2)))
    return None


def tr_seg(s):
    s = s.strip().rstrip('.').strip()
    s = re.sub(r'^(?:and|that)\s+', '', s, flags=re.I)
    if not s:
        return ''
    low = s.lower()
    for v, zh in VERB:
        if low.startswith(v + ' '):
            return zh + tr_obj(s[len(v) + 1:].strip())
    return tr_np(s)


def tr_obj(rest):
    r = split_last(rest, ['for', 'in'])
    if r and r[0] and r[1]:
        head, loc = r
        first = re.sub(r'^(?:the|said)\s+', '', split_top(loc)[0], flags=re.I)
        key = first.lower().rstrip('.')
        if is_admin_part(first) or key in GAZ:
            hl = tr_np(head)
            return ('为' + tr_loc(loc) + hl) if hl else tr_loc(loc)
    return tr_np(rest)


def tr_body(b):
    b = b.strip().rstrip('.').strip()
    b = re.sub(r'^to\s+', '', b, flags=re.I)
    b = numify(b)
    b, _tail = tr_tail(b)
    res = _tr_main(b)
    return (res + _tail) if _tail else res


def _tr_main(b):
    if re.match(r'^for\s+[Oo]ther\s+Purposes?$', b):
        return '为其他目的'

    # 改名族
    m = re.match(r'^(?:Changing|Change)\s+the\s+Names?\s+of\s+(.+)$', b, re.I)
    if m:
        rest = m.group(1)
        t = split_last(rest, ['to', 'as', 'into'])
        if t:
            return '将%s的名称变更为%s' % (tr_np(t[0]), tr_target(t[1]))
        return '变更%s的名称' % tr_np(rest)

    m = re.match(r'^(Renaming|Rename|Naming|Name)\s+(.+)$', b, re.I)
    if m:
        verb = '重新命名' if m.group(1).lower().startswith('rename') else '命名'
        rest = m.group(2)
        t = split_last(rest, ['as', 'to', 'into'])
        if t:
            return '将%s%s为%s' % (tr_np(t[0]), verb, tr_target(t[1]))
        parts = split_top(rest)
        if len(parts) >= 2 and re.match(r'^(?:the\s+)?[A-Z0-9]', parts[-1]):
            return '将%s%s为%s' % (' '.join(parts[:-1]), verb, tr_np(parts[-1]))
        return '将%s%s' % (tr_np(rest), verb)

    # 改设为
    m = re.match(r'^(?:Converting|Convert)\s+(.+)$', b, re.I)
    if m:
        t = split_last(m.group(1), ['into'])
        if t:
            return '将%s改设为%s' % (tr_np(t[0]), tr_target(t[1]))
        return '改设' + tr_np(m.group(1))

    # 假日
    m = re.match(r'^Declaring\s+(.+)$', b, re.I)
    if m:
        r = tr_declare(m.group(1))
        if r:
            return r

    # 拨款 / 授权族
    m = re.match(r'^(?:Authorizing|Authorize)\s+the\s+Appropriation\s+of\s+(.+?)\s+for\s+(.+)$', b, re.I)
    if m:
        return '授权为%s拨款%s' % (tr_np(m.group(2)), tr_np(m.group(1)))

    m = re.match(r'^(?:Authorizing|Authorize)\s+the\s+Sum\s+of\s+(.+?)\s+for\s+(.+)$', b, re.I)
    if m:
        return '授权为%s拨出%s' % (tr_np(m.group(2)), tr_np(m.group(1)))

    m = re.match(r'^(?:Appropriating|Appropriate|Reappropriating|Reappropriate)\s+(.+?)\s+for\s+(.+)$', b, re.I)
    if m:
        return '为%s拨款%s' % (tr_np(m.group(2)), tr_np(m.group(1)))

    m = re.match(r'^(?:Authorizing|Authorize)\s+(.+?)\s+to\s+(.+)$', b, re.I)
    if m:
        return '授权%s%s' % (tr_np(m.group(1)), tr_seg(m.group(2)))

    m = re.match(r'^(?:Transferring|Transfer)\s+(.+?)\s+to\s+(.+)$', b, re.I)
    if m:
        return '将%s移交给%s' % (tr_np(m.group(1)), tr_np(m.group(2)))

    m = re.match(r'^(?:Increasing|Increase)\s+(.+)$', b, re.I)
    if m:
        r2 = split_last(m.group(1), ['by amending', 'by'])
        if r2:
            return '通过%s提高%s' % (tr_seg(r2[1]), tr_np(r2[0]))
        return '增加' + tr_np(m.group(1))

    m = re.match(r'^(?:Extending|Extend)\s+(.+)$', b, re.I)
    if m:
        return '延长' + tr_np(m.group(1))

    m = re.match(r'^(?:Requiring|Require)\s+(.+)$', b, re.I)
    if m:
        return '要求' + tr_np(m.group(1))

    # 组建 / 分离 / 划定 / 纳入 / 豁免 / 定为
    m = re.match(r'^(?:Constituting|Constitute)\s+(.+)$', b, re.I)
    if m:
        t = split_last(m.group(1), ['into'])
        if t:
            return '将%s组建为%s' % (tr_np(t[0]), tr_target(t[1]))

    m = re.match(r'^(?:Creating|Create|Establishing|Establish)\s+the\s+Barrios?\s+of\s+(.+)$', b, re.I)
    if m:
        t = split_last(m.group(1), ['in'])
        if t:
            lst = tr_list(t[0])
            return '在%s设立%s村' % (tr_loc(t[1]), lst)

    m = re.match(r'^Fixing\s+the\s+Boundar(?:y|ies)\s+of\s+(.+)$', b, re.I)
    if m:
        return '划定%s的边界' % tr_np(m.group(1))

    m = re.match(r'^(?:Including|Include)\s+(.+?)\s+(?:[Ww]ithin|[Ii]n)\s+(.+)$', b, re.I)
    if m:
        return '将%s纳入%s' % (tr_np(m.group(1)), tr_np(m.group(2)))

    m = re.match(r'^(?:Exempting|Exempt)\s+(.+?)\s+from\s+(.+)$', b, re.I)
    if m:
        return '豁免%s的%s' % (tr_np(m.group(1)), tr_np(m.group(2)))

    m = re.match(r'^Making\s+(.+?)\s+the\s+Boundary\s+[Bb]etween\s+(.+?)\s+and\s+(.+)$', b, re.I)
    if m:
        g2, g3 = m.group(2), m.group(3)
        if ',' in g3:
            nm, rest = g3.split(',', 1)
            return '将%s定为%s与%s市镇之间的边界（%s）' % (
                tr_np(m.group(1)), tr_admin(g2), tr_place(nm), tr_loc(rest))
        return '将%s定为%s与%s之间的边界' % (tr_np(m.group(1)), tr_loc(g2), tr_loc(g3))

    m = re.match(r'^Making\s+(.+?)\s+the\s+(.+)$', b, re.I)
    if m:
        return '将%s定为%s' % (tr_np(m.group(1)), tr_np(m.group(2)))

    m = re.match(r'^(?:Providing|Creating|Establishing|Authorizing)\s+(.+?)\s+'
                 r'(?:Additional\s+)?Positions?\s+of\s+(.+?)\s+(?:for|in)\s+the\s+(.+)$',
                 b, re.I)
    if m:
        return '为%s增设%s个%s职位' % (tr_loc(m.group(3)), CN_NUM.get(m.group(1).strip().lower(), m.group(1)),
                                 tr_np(m.group(2)))

    # 修订族
    m = re.match(r'^(?:Further\s+)?(?:Amending|Amend|Revising|Revise)\s+(.+)$', b, re.I)
    if m:
        rest = m.group(1)
        main, tail = tr_tail(rest)
        prefix = ''
        m2 = re.search(r',\s*(Creating|Establishing|Constituting|Providing|Appropriating)\s+(.+)$', main)
        if m2:
            prefix = tr_seg(m2.group(1) + ' ' + m2.group(2)) + '的'
            main = main[:m2.start()]
        return '修订%s%s%s' % (prefix, cn_ref(main), tail)

    m = re.match(r'^Repeal(?:ing)?\s+(.+)$', b, re.I)
    if m:
        main, tail = tr_tail(m.group(1))
        return '废止' + cn_ref(main) + tail

    # 通用：分段
    segs = split_top(b)
    out = []
    for s in segs:
        s = s.strip()
        if not s:
            continue
        if re.match(r'^(?:[Aa]mending\s+for\s+the\s+Purpose|[Oo]therwise\s+[Kk]nown|'
                    r'[Kk]nown\s+as|[Ee]ntitled)\b', s):
            _, tail = tr_tail(', ' + s)
            if tail:
                out.append(tail.lstrip('，'))
            continue
        if re.match(r'^and\s+for\s+[Oo]ther\s+Purposes?$', s, re.I):
            out.append('并为其他目的')
            continue
        out.append(tr_seg(s))
    return '，'.join(x for x in out if x)


def tr_title(en):
    e = clean(en)
    body = re.sub(r'^An\s+Act\s+', '', e, flags=re.I)
    body = re.sub(r'^[Tt]o\s+', '', body).strip()
    zh = tr_body(body).strip().strip('，')
    zh = re.sub(r'\s+', ' ', zh)
    if not zh.endswith('法案'):
        zh += '的法案'
    return zh


if __name__ == '__main__':
    import sys
    p = sys.argv[1] if len(sys.argv) > 1 else \
        '_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_034.json'
    lim = int(sys.argv[2]) if len(sys.argv) > 2 else 40
    off = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    d = json.load(open(p, encoding='utf-8'))
    for it in d['items'][off:off + lim]:
        print(it['id'], '|', clean(it['en'])[:160])
        print('   =>', tr_title(it['en']))


