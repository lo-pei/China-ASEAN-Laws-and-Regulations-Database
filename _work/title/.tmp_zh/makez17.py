# -*- coding: utf-8 -*-
import json, re, sys
sys.path.insert(0, '_work/title/.tmp_zh')
import gen17 as g

CJK = re.compile(r'[\u4e00-\u9fff]')
JOB = 'CALR-TITLE-20261017-1837-PH-7575'
sl = json.load(open('_work/title/jobs/%s/slices/slice_017.json' % JOB, encoding='utf-8'))

OVER = {
 "PH-H6514": "将阿克兰省 Makato 市镇一所描笼涯中学的 Cayangwan 附属校分离，设立独立的 Cayangwan 国立中学并为此拨款",
 "PH-H7058": "将宿务省 Minglanilla 市镇一所国立中学的附属校分离，设立独立的 Lipata Central I 国立中学并为此拨款",
 "PH-H8433": "将 Compostela Valley 省 Monkayo 市镇一所国立中学的附属校分离，设立独立的 Ulip 国立中学并为此拨款",
 "PH-H8337": "将 Compostela Valley 省 Mawab 市镇一所国立中学的附属校分离，设立独立的 Tuboran 国立中学并为此拨款",
 "PH-H8494": "将保和省 Danao 市镇一所国立中学的附属校分离，设立独立的 Francisco Dagohoy 纪念中学并为此拨款",
 "PH-H8666": "将东达沃省 Mati 市一所国立中学的附属校分离，设立 Doña Rosa Garcia Rabat 纪念国立中学并为此拨款",
 "PH-H8416": "将南苏里高省 Carrascal 市镇一所技术学院的 Panikian 附属校分离，设立独立的 Panikian 国立中学并拨款",
 "PH-H9461": "将卡林加省 Tanudan 市镇 Dupligan 描笼涯一所国立中学的附属校分离，设立独立的 Biga 国立中学并为此拨款",
 "PH-H8223": "将高山省 Sadanga 市镇 Belwang 描笼涯的 Sadanga 国立中学附属校分离，设立独立的 Belwang 国立中学并为此拨款",
 "PH-H8538": "将布基农省 Talakag 市镇 Tikalaan 描笼涯的 Talakag 国立中学附属校分离，设立独立的 Tikalaan 国立中学并为此拨款",
 "PH-H3806": "为第十三司法区增设一名法官，主持萨马省初审法院工作，常驻萨马省 Basey 市镇，并为此修订 1948 年《司法法》第五十条、第五十二条与第五十四条",
 "PH-H5013": "为第十二司法区增设一名法官，主持锡基霍尔省初审法院工作，常驻锡基霍尔省 Siquijor 市镇，并为此修订 1948 年《司法法》第四十九条、第五十条、第五十二条与第五十四条",
 "PH-H2702": "进一步修订第一百八十六号联邦法，该法经第六百六十号、第七百二十八号、第一千一百二十三号、第一千三百七十七号、第一千五百七十三号、第一千六百一十六号及第一千八百二十号共和国法修订",
 "PH-H8103": "宣布每年 7 月 27 日为特别全国工作日假日，纪念菲律宾 Iglesia ni Cristo 成立周年，并为此修订第 292 号行政命令第 7 章第 26 条",
 "PH-H4883": "设立十二个助理市检察官职位，调整奎松市第七助理市检察官的薪金，并为此修订该市修订宪章第二十八条与第二十九条",
 "PH-H981": "授权政府按实际成本向稻米和玉米生产者及农民出售化肥，并指定农业与自然资源部为负责化肥销售与分配及执行本法各项规定的机构",
 "PH-H4316": "设立基金，用于向依第二百六十五号共和国法第二十九条被中央银行禁止营业的银行的存款人付款，每位存款人不超过一万比索（P10,000.00）",
 "PH-H1795": "禁止、拆除和/或捣毁在公共通航水域或水道及公共渔场修建的堤坝、围堤或其他工程，规范上述水域、水道及公共渔场内的工程，并规定违反本法的处罚，及其他目的",
 "PH-H1704": "在第一千三百八十七号共和国法（题为“关于在 Dansalan 市设立 Mindanao 大学并授权拨款的法案”）中插入序言，并修订该法第二条、第四条与第十六条及其他目的",
}

ZH = {}
for it in sl['items']:
    i = it['id']
    if i in OVER:
        ZH[i] = OVER[i]
        continue
    p = g.build_one(it['en'])
    z = None
    if p:
        for v in (1, 2):
            c = g.compose(p, v)
            n = len(CJK.findall(c)); l = len(re.findall(r'[A-Za-z]', c))
            if n / max(1, n + l) >= 0.5 and len(c) <= 90:
                z = c
                break
    if not z:
        print('STILL MANUAL', i)
        continue
    ZH[i] = z

bad = []
for i in [x['id'] for x in sl['items']]:
    t = ZH.get(i, '')
    n = len(CJK.findall(t)); l = len(re.findall(r'[A-Za-z]', t))
    r = n / max(1, n + l)
    if not t or len(t) < 2 or len(t) > 90 or r < 0.5:
        bad.append((i, len(t), round(r, 2), t))
print('条目', len(ZH), '异常', len(bad))
for b in bad:
    print(b)

with open('_work/title/.tmp_zh/z17.py', 'w', encoding='utf-8', newline='\n') as f:
    f.write('# -*- coding: utf-8 -*-\nZH17 = {\n')
    for i in [x['id'] for x in sl['items']]:
        if i in ZH:
            f.write('"%s": "%s",\n' % (i, ZH[i].replace('"', '\\"')))
    f.write('}\n')
print('written z17.py')
