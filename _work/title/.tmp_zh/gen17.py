# -*- coding: utf-8 -*-
import json, re

PROV = {
 'abra':'阿布拉','agusan del norte':'北阿古桑','agusan del sur':'南阿古桑','aklan':'阿克兰','albay':'阿尔拜',
 'antique':'安蒂克','aurora':'奥罗拉','bataan':'巴丹','batanes':'巴塔内斯','batangas':'八打雁','benguet':'本格特',
 'biliran':'比利兰','bohol':'保和','bukidnon':'布基农','bulacan':'布拉干','cagayan':'卡加延','camarines norte':'北甘马粦',
 'camarines sur':'南甘马粦','camiguin':'卡米金','capiz':'卡皮斯','catanduanes':'卡坦端内斯','cavite':'甲米地','cebu':'宿务',
 'cotabato':'哥打巴托','davao de oro':'金达沃','davao del norte':'北达沃','davao del sur':'南达沃','davao oriental':'东达沃',
 'davao occidental':'西达沃','dinagat islands':'迪纳加特群岛','eastern samar':'东萨马','guimaras':'吉马拉斯','ifugao':'伊富高',
 'ilocos norte':'北伊罗戈','ilocos sur':'南伊罗戈','iloilo':'伊洛伊洛','isabela':'伊莎贝拉','kalinga':'卡林加','la union':'拉乌尼翁',
 'laguna':'拉古纳','lanao del norte':'北拉瑙','lanao del sur':'南拉瑙','leyte':'莱特','maguindanao':'马京达瑙','marinduque':'马林杜克',
 'masbate':'马斯巴特','misamis occidental':'西米萨米斯','misamis oriental':'东米萨米斯','mountain province':'高山省',
 'negros occidental':'西内格罗斯','negros oriental':'东内格罗斯','northern samar':'北萨马','nueva ecija':'新怡诗夏',
 'nueva vizcaya':'新比斯开','occidental mindoro':'西明多洛','oriental mindoro':'东明多洛','palawan':'巴拉望','pampanga':'邦板牙',
 'pangasinan':'邦阿西楠','quezon':'奎松','quirino':'基里诺','rizal':'黎刹','romblon':'朗布隆','samar':'萨马','sarangani':'萨兰加尼',
 'siquijor':'锡基霍尔','sorsogon':'索索贡','south cotabato':'南哥打巴托','southern leyte':'南莱特','sultan kudarat':'苏丹库达拉特',
 'sulu':'苏禄','surigao del norte':'北苏里高','surigao del sur':'南苏里高','tarlac':'打拉','tawi-tawi':'塔威塔威','zambales':'三描礼士',
 'zamboanga del norte':'北三宝颜','zamboanga del sur':'南三宝颜','zamboanga sibugay':'三宝颜锡布格',
}
CITY = {
 'manila':'马尼拉','quezon city':'奎松市','caloocan':'卡洛奥坎','makati':'马卡蒂','pasig':'帕西格','taguig':'达义',
 'parañaque':'帕拉尼亚克','las piñas':'拉斯皮纳斯','muntinlupa':'蒙廷卢帕','marikina':'马里基纳',
 'valenzuela':'巴伦苏埃拉','mandaluyong':'曼达卢永','pasay':'帕赛','malabon':'马拉邦','navotas':'纳沃塔斯','san juan':'圣胡安',
 'antipolo':'安蒂波洛','baguio':'碧瑶','cebu':'宿务','lapu-lapu':'拉普拉普','mandaue':'曼达维','davao':'达沃',
 'zamboanga':'三宝颜','iloilo':'伊洛伊洛','bacolod':'巴科洛德',
 'cagayan de oro':'卡加延-德奥罗','general santos':'桑托斯将军城','tacloban':'塔克洛班','batangas':'八打雁',
 'angeles':'安赫莱斯','naga':'那牙','legazpi':'黎牙实比','dagupan':'达古潘','lucena':'卢塞纳','puerto princesa':'普林塞萨港',
 'butuan':'武端','iligan':'伊利甘','marawi':'马拉维','cotabato':'哥打巴托','tagum':'塔古姆',
 'dumaguete':'杜马格特','roxas':'罗哈斯','ormoc':'奥尔莫克','laoag':'拉瓦格','vigan':'维甘','tuguegarao':'土格加劳',
 'malolos':'马洛洛斯','san jose del monte':'圣何塞德尔蒙特','san fernando':'圣费尔南多','tarlac':'打拉',
}
TYPES = [
 ('national comprehensive high school','国立综合中学'),
 ('national vocational high school','国立职业中学'),
 ('agro-industrial high school','农业工业中学'),
 ('institute of technology','技术学院'),
 ('school of fisheries','渔业学校'),
 ('national high school','国立中学'),
 ('vocational high school','职业中学'),
 ('elementary school','小学'),
 ('vocational school','职业学校'),
 ('national school','国立学校'),
 ('high school','中学'),
 ('school','学校'),
]
TYPERE = re.compile(r'(national comprehensive high school|national vocational high school|agro-industrial high school|institute of technology|school of fisheries|national\s+high\s*school|elementary school|vocational school|national school|high school|school)', re.I)

def sp(t):
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'(?<=[\u4e00-\u9fff])(?=[A-Za-z0-9(])', ' ', t)
    t = re.sub(r'(?<=[A-Za-z0-9).])(?=[\u4e00-\u9fff])', ' ', t)
    t = re.sub(r'(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])', '', t)
    t = re.sub(r'\s+([，。、；：])', r'\1', t)
    return t

def norm(t):
    t = re.sub(r'\s+', ' ', t).strip(' .,;')
    t = re.sub(r'\bHIgh\b', 'High', t)
    t = re.sub(r'\bHlgh\b', 'High', t)
    t = re.sub(r'\bNationalhigh\b', 'National High', t, flags=re.I)
    return t

def split_type(name):
    n = norm(name)
    low = n.lower()
    for en, zh in TYPES:
        if re.search(r'\b' + en.replace(' ', r'\s*') + r'$', low):
            return n[:len(n)-len(en)].strip(' -,–'), zh
    return n, ''

def parse_loc(clause):
    s = re.sub(r'^\s*(in|at|located in)\s+', '', clause.strip(), flags=re.I)
    s = re.sub(r'\bMunicipality\s+if\b', 'Municipality of', s, flags=re.I)
    s = re.sub(r'\.\s+(?=(Province|City|Municipality)\b)', ', ', s)
    s = re.sub(r'\b(Municipality|City) of ([A-Za-z .\'-]+?)\s+(Province of)', r'\1 of \2, \3', s, flags=re.I)
    # "Barangay X in the City of Y" 拆分
    s = re.sub(r'\bin the (City|Municipality) of\b', r', \1 of', s, flags=re.I)
    parts = [p.strip() for p in s.split(',') if p.strip()]
    prov = mun = brgy = None
    kind = 'mun'
    bares = []
    for p in parts:
        low = re.sub(r'munici\s*a?p?ality|municiaplity|munici pality', 'municipality', p.lower())
        if low.startswith('province') or low in PROV:
            prov = re.sub(r'^province of\s+|^province\s+', '', p, flags=re.I)
        elif 'municipality of' in low:
            mun = re.sub(r'.*municipality of\s+', '', low, flags=re.I); kind = 'mun'
            mun = mun.title() if mun.islower() else mun
        elif low.startswith('city of'):
            mun = re.sub(r'^city of\s+', '', low); kind = 'city'
            mun = mun.title() if mun.islower() else mun
        elif low.endswith(' city'):
            mun = p; kind = 'city'
        elif re.search(r'baran\s*gay', low):
            brgy = re.sub(r'^baran\s*gay\s+', '', p, flags=re.I)
        elif low.startswith('sitio') or low.startswith('district') or low.startswith('zone'):
            pass
        else:
            bares.append(p)
    if bares:
        if mun is None:
            mun = bares[-1]; kind = 'mun'
        if brgy is None and len(bares) >= 2:
            brgy = bares[0]
    out = []
    if prov:
        z = prov_zh(prov)
        out.append(z if z.endswith('省') else z + '省')
    if mun:
        m = re.sub(r'\s+city$', '', mun, flags=re.I).strip()
        key = m.lower()
        if key in CITY:
            z = CITY[key]
            out.append(z if z.endswith('市') else z + '市')
        elif kind == 'city':
            out.append(m + '市')
        else:
            out.append(m + '市镇')
    if brgy:
        out.append(brgy + '描笼涯')
    return ' '.join(out)

def prov_zh(name):
    return PROV.get(name.lower().strip(), name.strip())

def build_one(en):
    body = re.sub(r'^An Act\s+', '', en.strip(), flags=re.I)
    m = re.search(r'known\s+as\s+(?:the\s+)?(.+)$', body, re.I)
    if not m:
        return None
    newraw = m.group(1)
    newraw = re.sub(r'[,;.]?\s*(and\s+)?(appropriat\w*|apporiating|appripriating|approp\w*|provid\w*)\b.*$', '', newraw, flags=re.I)
    newname, newtype = split_type(norm(newraw))
    m2 = re.search(r'Separating\s+the\s+(.+?)\s+from\s+the\s+(.+)$', body, re.I)
    if not m2:
        return None
    left, motherraw = m2.group(1), m2.group(2)
    motherraw = re.split(r'[,;.]?\s*(?:and\s+)?Conv\w*', motherraw, maxsplit=1, flags=re.I)[0]
    motherraw = motherraw.strip(' ,;.')
    motherraw = re.sub(r'\s*\(.*?\)', '', motherraw)
    motherraw = re.sub(r'^main\s+', '', motherraw, flags=re.I)
    motherraw = re.sub(r'\s*-?\s*main$', '', motherraw, flags=re.I)
    mname, mtype = split_type(motherraw)
    if not mtype:
        mname, mtype = split_type(motherraw + ' School')
        mtype = mtype or '学校'
    m3 = re.search(r'^(.*?)\s+(in|at|located in)\s+(.+)$', left, re.I)
    locraw = m3.group(3) if m3 else ''
    loc = parse_loc(locraw) if locraw else ''
    return dict(new=newname.strip(), newtype=newtype or '学校', mother=mname.strip(),
                mtype=mtype, loc=loc)

def compose(p, variant):
    new = '%s %s' % (p['new'], p['newtype'])
    if variant == 2:
        s = '将%s一所%s的附属校分离，改设为独立的%s，并为此拨款' % (p['loc'], p['mtype'], new)
    else:
        s = '将%s的%s%s附属校分离，改设为独立的%s，并为此拨款' % (p['loc'], p['mother'], p['mtype'], new)
    return sp(s)

if __name__ == '__main__':
    sl = json.load(open('_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_017.json', encoding='utf-8'))
    CJK = re.compile(r'[\u4e00-\u9fff]')
    out = []
    for it in sl['items']:
        p = build_one(it['en'])
        best = None
        if p:
            for v in (1, 2):
                z = compose(p, v)
                c = len(CJK.findall(z)); l = len(re.findall(r'[A-Za-z]', z))
                if c / max(1, c + l) >= 0.5 and len(z) <= 90:
                    best = z
                    break
        out.append((it['id'], best, it['en']))
    print('生成 %d / %d' % (len([o for o in out if o[1]]), len(out)))
    for i, z, en in out:
        print('%s\t%s' % (i, z or ('MANUAL  ' + en[:110])))
