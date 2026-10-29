# -*- coding: utf-8 -*-
"""PH 标题中译辅助引擎：模板解析 + 专名保留"""
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
 'metro manila':'马尼拉大都会','calamba':'卡兰巴','sorsogon city':'索索贡市','victorias':'维多利亚斯',
}
# 学校名尾部的通用校型
TYPES = [
 ('national high school of arts and trades','国立工艺中学'),
 ('national school of arts and trades','国立工艺学校'),
 ('national school of arts and trade','国立工艺学校'),
 ('national high school of arts and trade','国立工艺中学'),
 ('school of arts and trades','工艺学校'),
 ('school of arts and trade','工艺学校'),
 ('national agricultural and trade high school','国立农业与贸易中学'),
 ('national agricultural vocational high school','国立农业职业中学'),
 ('national technical-vocational high school','国立技术职业中学'),
 ('national technical vocational high school','国立技术职业中学'),
 ('technical-vocational high school','技术职业中学'),
 ('technical vocational high school','技术职业中学'),
 ('technical–vocational high school','技术职业中学'),
 ('national vocational high school','国立职业中学'),
 ('national science high school','国立科学中学'),
 ('national comprehensive high school','国立综合中学'),
 ('national agricultural school','国立农业学校'),
 ('national trade high school','国立职业中学'),
 ('national high school','国立中学'),
 ('national highschool','国立中学'),
 ('national high schoo','国立中学'),
 ('national hgh school','国立中学'),
 ('senior high school','高级中学'),
 ('junior high school','初级中学'),
 ('elementary school','小学'),
 ('integrated school','综合学校'),
 ('comprehensive high school','综合中学'),
 ('vocational school','职业中学'),
 ('vocational high school','职业中学'),
 ('central school','中央学校'),
 ('high school','中学'),
 ('highschool','中学'),
 ('school of fisheries','渔业学校'),
 ('school of home industries','家庭工业学校'),
 ('school','学校'),
]
PREFIX = [
 ('general comprehensive', '普通综合'),
 ('comprehensive', '综合'),
 ('central', '中央'),
 ('vocational', '职业'),
 ('agricultural', '农业'),
 ('industrial', '工业'),
 ('memorial', '纪念'),
 ('science', '科学'),
 ('integrated', '综合'),
 ('main', '主校'),
 ('national', '国立'),
]


def norm(s):
    s = s.replace('&amp;', '&').replace('\\endash', '–').replace('&Mdash', '—').replace('&mdash', '—')
    s = s.replace('“', '"').replace('”', '"')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def place(name):
    k = re.sub(r'\s+', ' ', name).strip().lower()
    k = k.replace('del ', 'del ')
    if k in PROV:
        return PROV[k]
    if k in CITY:
        return CITY[k]
    return None


def prep_loc(t):
    t = re.sub(r'\.\s+(?=(Province|Municipality|Municipalaty|City)\b)', ', ', t)
    t = re.sub(r'\s+(?=(Province|Municipality|Municipalaty|Municipallty)\s+of\s)', ', ', t, flags=re.I)
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
    m = re.match(r'^(Municipality|Municipalaty|Municipallty|Municipal|Munucipality)\s+of\s+(.+)$', p, re.I)
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
    if zh:
        return zh
    return p


def zh_loc(text):
    text = re.sub(r'\s+', ' ', text).strip().strip(',').strip()
    text = re.sub(r'^(in|at)\s+', '', text, flags=re.I)
    text = re.sub(r'^the\s+', '', text, flags=re.I)
    text = prep_loc(text)
    parts = [x for x in text.split(',') if x.strip()]
    outs = [loc_part(x) for x in parts]
    outs = [o for o in outs if o]
    outs.reverse()
    res = ''
    for o in outs:
        if re.match(r'^[\u4e00-\u9fff]', o):
            res += o
        else:
            res += (' ' if res else '') + o
    return res.strip()


def zh_school(name):
    """校名：通用校型译中文，专名保留英文"""
    n = norm(name)
    n = re.sub(r'^(the|The)\s+', '', n).strip().rstrip('.').strip()
    low = n.lower()
    tail = None
    tail_zh = ''
    for k, v in TYPES:
        if low.endswith(' ' + k) or low == k:
            tail = n[:len(n) - len(k)].strip()
            tail_zh = v
            break
    if tail is None:
        tail, tail_zh = n, ''
        low2 = n.lower()
        for k, v in TYPES:
            if low2.endswith(k):
                tail, tail_zh = n[:len(n) - len(k)].strip(), v
                break
    # 前置通用修饰
    pre = ''
    changed = True
    while changed and tail:
        changed = False
        for k, v in PREFIX:
            if tail.lower().startswith(k + ' '):
                pre += v
                tail = tail[len(k):].strip()
                changed = True
                break
    if tail and tail.lower() in ('annex', 'extension', 'campus', 'main', 'the'):
        tail = ''
    out = (tail + ' ') if tail else ''
    out += pre + tail_zh
    return out.strip()
