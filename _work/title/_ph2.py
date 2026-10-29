# -*- coding: utf-8 -*-
"""PH 标题中译引擎 v2"""
import re

PROV = {
 'abra':'阿布拉','agusan del norte':'北阿古桑','agusan del sur':'南阿古桑','aklan':'阿克兰','albay':'阿尔拜',
 'antique':'安蒂克','aurora':'奥罗拉','bataan':'巴丹','batanes':'巴塔内斯','batangas':'八打雁','benguet':'本格特',
 'biliran':'比利兰','bohol':'保和','bukidnon':'布基农','bulacan':'布拉干','cagayan':'卡加延',
 'camarines norte':'北甘马粦','camarines sur':'南甘马粦','camiguin':'卡米金','capiz':'卡皮斯',
 'catanduanes':'卡坦端内斯','cavite':'甲米地','cebu':'宿务','cotabato':'哥打巴托','davao de oro':'金达沃',
 'davao del norte':'北达沃','davao del sur':'南达沃','davao oriental':'东达沃','davao occidental':'西达沃',
 'dinagat islands':'迪纳加特群岛','eastern samar':'东萨马','guimaras':'吉马拉斯','ifugao':'伊富高',
 'ilocos norte':'北伊罗戈','ilocos sur':'南伊罗戈','iloilo':'伊洛伊洛','isabela':'伊莎贝拉','kalinga':'卡林加',
 'la union':'拉乌尼翁','laguna':'拉古纳','lanao del norte':'北拉瑙','lanao del sur':'南拉瑙','leyte':'莱特',
 'maguindanao':'马京达瑙','marinduque':'马林杜克','masbate':'马斯巴特','misamis occidental':'西米萨米斯',
 'misamis oriental':'东米萨米斯','mountain province':'高山省','negros occidental':'西内格罗斯',
 'negros oriental':'东内格罗斯','northern samar':'北萨马','nueva ecija':'新怡诗夏','nueva vizcaya':'新比斯开',
 'occidental mindoro':'西明多洛','oriental mindoro':'东明多洛','palawan':'巴拉望','pampanga':'邦板牙',
 'pangasinan':'邦阿西楠','quezon':'奎松','quirino':'基里诺','rizal':'黎刹','romblon':'朗布隆','samar':'萨马',
 'sarangani':'萨兰加尼','siquijor':'锡基霍尔','sorsogon':'索索贡','south cotabato':'南哥打巴托',
 'southern leyte':'南莱特','sultan kudarat':'苏丹库达拉特','sulu':'苏禄','surigao del norte':'北苏里高',
 'surigao del sur':'南苏里高','tarlac':'打拉','tawi-tawi':'塔威塔威','zambales':'三描礼士',
 'zamboanga del norte':'北三宝颜','zamboanga del sur':'南三宝颜','zamboanga sibugay':'三宝颜锡布格',
 'north cotabato':'北哥打巴托','compostela valley':'孔波斯特拉谷','compostella valley':'孔波斯特拉谷',
}
CITY = {
 'manila':'马尼拉','quezon city':'奎松市','caloocan':'卡洛奥坎','makati':'马卡蒂','pasig':'帕西格',
 'taguig':'达义','parañaque':'帕拉尼亚克','paranaque':'帕拉尼亚克','las piñas':'拉斯皮纳斯',
 'las pinas':'拉斯皮纳斯','muntinlupa':'蒙廷卢帕','marikina':'马里基纳','valenzuela':'巴伦苏埃拉',
 'mandaluyong':'曼达卢永','pasay':'帕赛','malabon':'马拉邦','navotas':'纳沃塔斯','san juan':'圣胡安',
 'antipolo':'安蒂波洛','baguio':'碧瑶','cebu city':'宿务市','lapu-lapu':'拉普拉普','mandaue':'曼达维',
 'davao city':'达沃市','davao':'达沃','zamboanga city':'三宝颜市','iloilo city':'伊洛伊洛市',
 'bacolod':'巴科洛德','cagayan de oro':'卡加延-德奥罗','general santos':'桑托斯将军城','tacloban':'塔克洛班',
 'batangas city':'八打雁市','angeles':'安赫莱斯','naga':'那牙','legazpi':'黎牙实比','dagupan':'达古潘',
 'lucena':'卢塞纳','puerto princesa':'普林塞萨港','butuan':'武端','iligan':'伊利甘','marawi':'马拉维',
 'cotabato city':'哥打巴托市','tagum':'塔古姆','dumaguete':'杜马格特','roxas':'罗哈斯','ormoc':'奥尔莫克',
 'laoag':'拉瓦格','vigan':'维甘','tuguegarao':'土格加劳','malolos':'马洛洛斯',
 'san jose del monte':'圣何塞德尔蒙特','san fernando':'圣费尔南多','tarlac city':'打拉市',
 'metro manila':'马尼拉大都会','calamba':'卡兰巴','sorogon city':'索索贡市',
}
TYPES = [
 ('national high school of arts and trades','国立','工艺中学'),
 ('national school of arts and trades','国立','工艺学校'),
 ('national school of arts and trade','国立','工艺学校'),
 ('national high school of arts and trade','国立','工艺中学'),
 ('school of arts and trades','','工艺学校'),
 ('school of arts and trade','','工艺学校'),
 ('national agricultural and trade high school','国立','农业与贸易中学'),
 ('national agricultural vocational high school','国立','农业职业中学'),
 ('national technical-vocational high school','国立','技术职业中学'),
 ('national technical vocational high school','国立','技术职业中学'),
 ('technical-vocational high school','','技术职业中学'),
 ('technical vocational high school','','技术职业中学'),
 ('technical–vocational high school','','技术职业中学'),
 ('national vocational high school','国立','职业中学'),
 ('national science high school','国立','科学中学'),
 ('national comprehensive high school','国立','综合中学'),
 ('national agricultural school','国立','农业学校'),
 ('national trade high school','国立','贸易中学'),
 ('national high school','国立','中学'),
 ('national highschool','国立','中学'),
 ('national high schoo','国立','中学'),
 ('national hgh school','国立','中学'),
 ('senior high school','','高级中学'),
 ('junior high school','','初级中学'),
 ('elementary school','','小学'),
 ('integrated school','','综合学校'),
 ('comprehensive high school','','综合中学'),
 ('vocational school','','职业中学'),
 ('vocational high school','','职业中学'),
 ('central school','','中央学校'),
 ('high school','','中学'),
 ('highschool','','中学'),
 ('school of fisheries','','渔业学校'),
 ('school of home industries','','家庭工业学校'),
 ('school','','学校'),
]
GEN = {
 'national':'国立','central':'中央','comprehensive':'综合','memorial':'纪念','vocational':'职业',
 'technical':'技术','agricultural':'农业','industrial':'工业','science':'科学','integrated':'综合',
 'senior':'高级','junior':'初级','city':'市','barangay':'描笼涯','annex':'附属','extension':'分校',
 'east':'东','eastern':'东','west':'西','western':'西','north':'北','northern':'北','south':'南',
 'southern':'南','upper':'上','lower':'下','new':'新','general':'普通','trade':'贸易','arts':'工艺',
 'of':'','the':'','and':'与',
}


def norm(s):
    s = s.replace('&amp;', '&').replace('\\endash', '–').replace('&Mdash', '—').replace('&mdash', '—')
    s = s.replace('“', '"').replace('”', '"').replace('’', "'")
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def place(name):
    k = re.sub(r'\s+', ' ', name).strip().lower()
    return PROV.get(k) or CITY.get(k)


def prep_loc(t):
    t = re.sub(r'\.\s+(?=(Province|Municipality|Municipalaty|City)\b)', ', ', t)
    t = re.sub(r'\s+(?=(Province|Municipality|Municipalaty|Municipallty|Municiaplity)\s+of\s)', ', ', t, flags=re.I)
    t = re.sub(r'\s+(?=Barangay\s)', ', ', t, flags=re.I)
    t = re.sub(r',\s*,', ',', t)
    return t


def loc_part(p):
    p = p.strip().strip(',').strip()
    p = re.sub(r'^(in|at|In|At)\s+', '', p)
    p = re.sub(r'^the\s+', '', p, flags=re.I)
    m = re.match(r'^Island Garden City of (.+)$', p, re.I)
    if m:
        return m.group(1) + ' 市'
    m = re.match(r'^(Barangays?|Barrangay|Baran Gay)\s+(.+)$', p, re.I)
    if m:
        x = re.sub(r'\s+and\s+', ' 与 ', m.group(2))
        return x + ' 描笼涯'
    m = re.match(r'^(Sitio)\s+(.+)$', p, re.I)
    if m:
        return m.group(2) + ' 村落'
    m = re.match(r'^(Municipality|Municipalaty|Municipallty|Municipal|Munucipality|Municiaplity)\s+of\s+(.+)$', p, re.I)
    if m:
        return m.group(2) + ' 市镇'
    m = re.match(r'^(City)\s+of\s+(.+)$', p, re.I)
    if m:
        zh = place(m.group(2))
        return (zh + '市') if zh and not zh.endswith('市') else (zh or (m.group(2) + ' 市'))
    m = re.match(r'^(.+?)\s+City$', p, re.I)
    if m:
        zh = place(m.group(1))
        return (zh if zh and zh.endswith('市') else (zh + '市' if zh else m.group(1) + ' 市'))
    m = re.match(r'^Province\s+of\s+(.+)$', p, re.I)
    if m:
        zh = place(m.group(1))
        return (zh + '省') if zh and not zh.endswith('省') else (zh or (m.group(1) + ' 省'))
    m = re.match(r'^(.+?)\s+Province$', p, re.I)
    if m:
        zh = place(m.group(1) + ' Province')
        if zh:
            return zh if zh.endswith('省') else zh + '省'
        zh = place(m.group(1))
        return (zh if zh and zh.endswith('省') else (zh + '省' if zh else m.group(1) + ' 省'))
    m = re.match(r'^(.+?)\s+District$', p, re.I)
    if m:
        return m.group(1) + ' 区'
    if p.lower() == 'metro manila':
        return '马尼拉大都会'
    zh = place(p)
    return zh or p


def zh_loc(text):
    text = re.sub(r'\s+', ' ', text).strip().strip(',').strip()
    text = re.sub(r'^(in|at)\s+', '', text, flags=re.I)
    text = re.sub(r'^the\s+', '', text, flags=re.I)
    text = prep_loc(text)
    outs = [loc_part(x) for x in text.split(',') if x.strip()]
    outs = [o for o in outs if o]
    outs.reverse()
    res = ''
    for o in outs:
        if re.match(r'^[\u4e00-\u9fff]', o):
            res += o
        else:
            res += (' ' if res else '') + o
    return res.strip()


def school(name):
    """返回 (专名, 前置修饰中文, 尾置修饰中文, 国立, 校型)"""
    n = norm(name).strip().rstrip('.').strip()
    n = re.sub(r'^(the|The)\s+', '', n)
    n = n.strip('"').strip()
    low = n.lower()
    rest, pre, core = n, '', ''
    for k, a, b in TYPES:
        if low.endswith(' ' + k) or low == k:
            idx = len(n) - len(k)
            rest = n[:idx].strip()
            pre, core = a, b
            break
    if not core:
        for k, a, b in TYPES:
            if low.endswith(k):
                rest = n[:len(n) - len(k)].strip()
                pre, core = a, b
                break
    if not core:
        rest, pre, core = n, '', ''
    toks = rest.split()
    lead = []
    while toks and toks[0].lower().strip(',') in ('central', 'comprehensive', 'national', 'vocational',
                                                  'technical', 'agricultural', 'industrial', 'integrated'):
        lead.append(GEN[toks[0].lower()])
        toks.pop(0)
    tail = []
    while toks and toks[-1].lower() in ('memorial', 'central', 'comprehensive', 'vocational',
                                        'technical', 'agricultural', 'industrial', 'science',
                                        'integrated', 'city', 'national'):
        tail.insert(0, GEN[toks[-1].lower()])
        toks.pop()
    if len(toks) >= 2 and toks[-2].lower() == 'general' and toks[-1].lower() == 'comprehensive':
        tail.insert(0, '普通综合')
        toks = toks[:-2]
    if len(toks) >= 2 and toks[0].lower() == 'general' and toks[1].lower() == 'comprehensive':
        lead.append('普通综合')
        toks = toks[2:]
    proper = ' '.join(toks).strip().strip(',')
    pz = place(proper)
    if pz and not re.search(r'[A-Z][a-z]+\s+[A-Z]', proper):
        pass
    if pz:
        proper = pz
    return proper, ''.join(lead), ''.join(tail), pre, core


TITLE = [('Rep.', '众议员'), ('Governor', '州长'), ('President', '总统'), ('Dr.', '博士'),
         ('Kapitan', '村长'), ('Mayor', '市长'), ('General', '将军')]


def _title(p):
    for en, zh in TITLE:
        if p.startswith(en + ' '):
            return zh + p[len(en):]
    return p


def disp(name):
    p, lead, tail, pre, core = school(name)
    s = ''
    if p:
        s += _title(p) + ' '
    s += lead + tail
    if pre and not s.endswith('国立'):
        s += pre
    return (s + core).strip()


def disp_split(name):
    p, lead, tail, pre, core = school(name)
    mid = lead + tail + pre
    return p, mid, core


def cjk_ratio(s):
    c = len(re.findall(r'[\u4e00-\u9fff]', s))
    l = len(re.findall(r'[A-Za-z]', s))
    return c / max(1, c + l)


def spaced(lat):
    return (' ' + lat) if lat and re.match(r'^[A-Za-z0-9]', lat) else lat
