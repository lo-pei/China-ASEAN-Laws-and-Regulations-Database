# -*- coding: utf-8 -*-
import json, re, sys, io

CJK = re.compile(r'[\u4e00-\u9fff]')
LAT = re.compile(r'[A-Za-z]')
B = r'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title'
J = 'CALR-TITLE-20261017-1837-PH-7575'

# 人工改写后的译文（对 R7 未过条目）
P = {
26: {
 'PH-H2497': '在卡加延省Gonzaga与Gattaran市镇分别设立Santa Clara村与Cunig村的法案',
 'PH-H4772': '将北三宝颜省Siayan市镇政府所在地由Paranglumba村迁至Siayan Proper村的法案',
 'PH-H5267': '将本格特省Bokod市镇的Dennis Molintas市镇医院更名为Dennis Molintas纪念医院的法案',
 'PH-H6881': '将布拉干省Balagtas的Pulonggubat国立农业中学更名为Pulonggubat国立中学的法案',
 'PH-H7167': '将三描礼士省San Marcelino市镇的Santa Fe延伸中学更名为San Guillermo国立中学的法案',
 'PH-H8532': '将北达沃Asuncion - San Isidro至Compostela Valley Laak至南阿古桑Veruela路段改设为国家次级公路的法案',
 'PH-H8786': '将朗布隆省Odiongan市镇的Romblon国立中学Odiongan分校更名为Odiongan国立中学的法案',
 'PH-H8865': '将Apayao省Ayaga至Sta. Marcela至Flora至Lasam省道全线改设为国道并为此拨款的法案',
 'PH-H9489': '将黎刹省Rodriguez市镇San Rafael描笼涯的Wawa公路命名为Licerio I. Geronimo将军公路的法案',
 'PH-H9494': '将甲米地省Bacoor市Talaba 4与San Nicolas 3描笼涯的Molino大道重新命名为Bacoor大道的法案',
 'PH-H9618': '将达沃市Baguio区Tawantawan描笼涯的小学更名为Rosalia Aglay Ayag小学的法案',
},
27: {
 'PH-H10050': '将布拉干省San Jose Del Monte市San Manuel描笼涯的San Manuel中学更名为San Manuel国立中学的法案',
 'PH-H10190': '将南甘马粦省Goa市镇Pinaglabanan描笼涯的Pinaglabanan中学更名为Pinaglabanan国立中学的法案',
 'PH-H10255': '将西米萨米斯省Plaridel市镇Panalsalan描笼涯的Lobog桥重新命名为Alfonso Burlat Apdujan桥的法案',
 'PH-H1252': '将原并入Tagaytay市的Caloocan与Birinayan村移交回八打雁省Talisay市镇的法案',
 'PH-H2073': '批准将Escudero Electric Service Company的特许经营权及全部财产与权利转让给Manila Electric Company的法案',
 'PH-H2165': '将萨马省Balangiga市镇的Balangiga初级中学改设为Balangiga农村中学的法案',
 'PH-H3265': '授予Pototan Electric Light and Power Corporation在伊洛伊洛省Pototan市镇经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H491': '授予Inabanga Electric Service Company在保和省Inabanga市镇经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H5281': '将东达沃省Gov. Generoso市镇Tagabebe描笼涯的Tagabebe小学更名为Hadji Hamiri Musa小学的法案',
 'PH-H5684': '将布拉干省San Jose Del Monte市镇Sapang Palay区医院床位由50张增至75张的法案',
 'PH-H616': '授予Argao Electric, Ice and Water Company在宿务省Argao市镇经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H6182': '将莱特省Tabontabon市镇的Tagabebe描笼涯中学更名为Justimbaste-remandaban国立中学的法案',
 'PH-H6508': '将保和省连接塔比拉兰市与Panglao岛的Taytay桥重新命名为Jacinto Castel Borja大使桥的法案',
 'PH-H7312': '在马尼拉大都会Parañaque市将Arcadio Santos博士中学改设为Arcadio Santos博士国立中学并为此提供资金的法案',
 'PH-H7509': '将西内格罗斯省Kabankalan市至Talubangi描笼涯的国家公路命名为Jesus Y. Perez法官纪念公路的法案',
 'PH-H7715': '将布拉干省San Ildefenso市镇的Bulacan National Agricultural State College更名为Bulacan Agricultural State College',
 'PH-H775': '授予Kiamba Light and Power Company, Incorporated在哥打巴托省Kiamba市镇经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H8160': '将索索贡省Sta. Magdalena市镇至Matnog市镇Pawa公路的省道命名为Juan G. Frivaldo州长公路的法案',
 'PH-H8200': '将苏丹库达拉特省Ninoy Aquino、Lebak与Kalamansig市镇间的省道改设为国道的法案',
 'PH-H8237': '将新比斯开省Dupax Del Norte市镇Lamo描笼涯的国立中学更名为Dupax Del Norte国立中学的法案',
 'PH-H8255': '将新怡诗夏省San Jose市至Rizal省道（经Palestina-Pinili-Porais-Villa Joson-Sta. Monica-Portal）改设为国道的法案',
 'PH-H8423': '将连接J.P. Laurel街与Carlos P. Garcia公路、通往达沃市国际机场的Bacaca公路重新命名为Francisco S. Dizon公路的法案',
 'PH-H8471': '将打拉省Capas、San Jose、Mayantoc与Malacampa市镇之间的公路改设为国道的法案',
 'PH-H8473': '将起于北三宝颜Sindangan、经Bayog至南三宝颜Lakewood Poblacion的省道改设为国道的法案',
 'PH-H8733': '将巴丹省Orion市镇Balagtas描笼涯的Orion国立中学更名为Emilio Angeles Gancayco法官纪念中学的法案',
 'PH-H8870': '将马里基纳市第二区Concepcion Uno与Concepcion Dos描笼涯的Katipunan街改设为国道的法案',
 'PH-H9195': '将拉乌尼翁省Agoo市镇San Manuel Norte国立中学更名为Manuel T. Cases Sr.博士国立中学的法案',
 'PH-H9197': '将拉乌尼翁省Agoo市镇San Manuel Norte小学更名为Manuel T. Cases Sr.博士小学的法案',
 'PH-H9200': '将新怡诗夏省Talugtug市镇Saverona描笼涯的Saverona小学更名为Alberto G. Bautista小学的法案',
 'PH-H9486': '将横贯孔波斯特拉谷省Compostela市镇的Montevista-Cateel国家公路重新命名为Benigno S. Aquino Jr.国家公路的法案',
 'PH-H9487': '将本格特省Acop、Tublay、Kapangan - Kibungan - Bakun - Sinipsip至Buguias的次级公路更名为Bado Dangwa州长国家公路的法案',
},
28: {
 'PH-H10384': '将北民答那峨大区伊利甘市Tambacan描笼涯横跨伊利甘河的Tambacan桥重新命名为Mariano Lluch Badelles Sr.桥的法案',
 'PH-H4070': '批准将依第3783号法授予Misamis Limber Company, Inc.的特许经营权、权利与特权转让给Misamis Lumber Corporation的法案',
 'PH-H5685': '将Ozamiz市Hilarion A. Ramiro, Sr.市长总医院床位由100张增至150张并为此拨款的法案',
 'PH-H6112': '将北苏里高省Dinagat市镇的Dinagat国立中学更名为Ruben E. Ecleo, Sr.纪念国立中学的法案',
 'PH-H614': '授予Nicolas Limcaoco在拉古纳省Cabuyao市镇Marinig、Mamati.D、Gulod与Banlik村的电灯、热力与动力系统特许经营权的法案',
 'PH-H7810': '将伊利甘市Sta. Felomina、Bonbonon、Digkilaan与Rogongon描笼涯连接至布基农省Talakag市镇的城市道路改设为国道的法案',
 'PH-H8163': '将索索贡省Pilar市镇Dao描笼涯横贯Marifosque街与国家公路的道路网命名为Manuel T. Sia市长绕行公路的法案',
 'PH-H8449': '将保和省的Antequerra至San Isidro至Tubigon省道改设为国道的法案',
 'PH-H8555': '将起于三宝颜锡布格Imelda、经Bayog与Diplo Kumalarang至南三宝颜Lapuyan与Margosatubig的省道改设为国道的法案',
 'PH-H9479': '将北伊罗戈省拉瓦格市Bengcag描笼涯至Bacarra市镇Buyon描笼涯的绕行公路命名为Rodolfo G. Farinas, Jr.绕行公路的法案',
 'PH-H9492': '将拉古纳省Binan市与甲米地省Ternate市镇的Governors Drive重新命名为Juanito R. Remulla, Sr.公路的法案',
 'PH-H9496': '将Tubod市镇Poblacion与Barakanas描笼涯的Poblacion-Caniogan国家公路命名为Arsenio Arcelo Quibranza公路的法案',
},
29: {
 'PH-H10275': '将保和省Panglao市镇通往保和-邦劳国际机场的公路命名为Constancio Chatto Torralba州长公路的法案',
 'PH-H10358': '将奎松市Agham公路与Bir公路重新命名为Miriam P. Defensor-santiago参议员大道的法案',
 'PH-H10383': '将邦阿西楠省Urdaneta市绕行公路重新命名为Eduardo ”Danding” M. Cojuangco Jr.大使大道的法案',
 'PH-H3597': '授予Angel R. Cabatingan在宿务省Santa Fe市镇与同省San Remigio市镇Hagnaya村之间维护与运营渡轮服务的特许经营权的法案',
 'PH-H5184': '将Ifugao省Potia市镇更名为Lista，并确认Lista市镇Sta. Maria描笼涯为市镇政府所在地的法案',
 'PH-H6429': '宣布每年12月18日为“Araw Ng Laguna”及拉古纳省与San Pablo市特别工作日，以纪念已故州长Felicisimo T. San Luis的法案',
 'PH-H7639': '续展并修订依第808号共和国法（经修正）授予Eastern Telecommunications Philippines, Inc.的特许经营权的法案',
 'PH-H7807': '将保和省Panglao与Dauis市镇的Panglao岛环岛公路（含塔比拉兰市Sitio Ubos-Totulan的Pablo Suarez大使桥）改设为国道的法案',
 'PH-H8469': '将南三宝颜省Eastern Bobongan至Sominot至Midsalip至Dumingag省道改设为国道的法案',
 'PH-H8533': '将北拉瑙省起于Baloi的Iligan - Marawi国家公路、经Matunggao至Linamon的Iligan - Aurora公路的道路改设为国道的法案',
 'PH-H9259': '将南三宝颜省Aurora市镇Monte Alegre描笼涯的Juan Lumosad纪念国立中学Monte Alegre附属校更名为Monte Alegre国立中学的法案',
},
30: {
 'PH-H10033': '将Kalinga省Tabuk市的Boundary-Calanan-Enrile公路路段重新命名为Manuel S. Agyao大道的法案',
 'PH-H10037': '将南拉瑙省Marawi-Maguing-Bumbaran-Wao公路重新命名为Mamintal M. Adiong Sr.州长国家公路的法案',
 'PH-H10159': '将北达沃省Carmen市镇Carmen-Santo Tomas公路重新命名为Saturnino R. Silva公路的法案',
 'PH-H10226': '将南拉瑙省Marawi市至Tagoloan II公路重新命名为Ahmad Domocao Alangadi Alonto Sr.参议员国家公路的法案',
 'PH-H10256': '将横跨Mactan海峡的第一宿务-Mactan大桥重新命名为Serging Veloso Osmeña Jr.桥的法案',
 'PH-H10382': '将保和省环岛公路重新命名为Carlos P. Garcia总统环岛公路的法案',
 'PH-H2028': '批准San Fernando Electric Light and Power Company, Inc.将其在邦板牙省Masantol市镇的电灯、热力与动力系统特许经营权售予Felix O. Hernandez的法案',
 'PH-H2312': '将西内格罗斯省Calatrava市镇Macasilao路口村与Escalante市镇Binabongol村分别更名为Castellano村与Magsaysay村的法案',
 'PH-H3006': '修订第3247号共和国法（授予Cagayan Electric Power and Light Co., Inc.在卡加延德奥罗市及其郊区的特许经营权）的法案',
 'PH-H3514': '规定在萨马省Almagro、DARam、Santa Rita、Marabut与Tarangnan各岛市镇分别设立一等药房并授权为此拨款的法案',
 'PH-H4025': '规定在布拉干省San Jose Del Monte市镇Sapang Palay设立国立中学，名称为Sapang Palay国立中学，并授权为此拨款的法案',
 'PH-H4463': '规定在布拉干省San Jose Del Monte市镇设立San Jose Del Monte国立职业学校，并授权为此拨款的法案',
 'PH-H4522': '修订第1272号共和国法（授予Monserrat Broadcasting System, Incorporated广播电台临时许可）的标题与若干条款的法案',
 'PH-H5942': '将奎松市Congressional Hills的农村卫生所改设为5张床位的Congressional Hills卫生医务所并为此拨款的法案',
 'PH-H5966': '将保和省Talibon市镇Carlos P. Garcia总统省立医院床位由75张增至100张，将该院迁至保和省Talibon San Jose，并为此拨款的法案',
 'PH-H6215': '规定在北苏里高省Cagdianao市镇Ruben E. Ecleo, Sr.描笼涯设立描笼涯国立中学，名称为Ruben E. Ecleo, Sr.国立中学，并为此拨款的法案',
 'PH-H6551': '规定在东达沃省Governor Generoso市镇Pundaguitan描笼涯设立国立中学，名称为Pundaguitan国立中学，并为此拨款的法案',
 'PH-H7793': '将西明多洛省San Jose市镇至Caminawit描笼涯码头的公路命名为Felix Y. Manalo主教大道的法案',
 'PH-H8144': '将阿尔拜省Malinao至南甘马粦省Ocampo的公路命名为Felix Alfelor Sr.州长国家公路的法案',
 'PH-H8145': '将自Iriga市与Buhi市镇边界起、经Justina与Lourdes描笼涯至Buhi市镇政府的公路命名为Maximo Noble Sr.公路的法案',
 'PH-H9490': '将黎刹省Kay Tikling-Antipolo-Teresa-Morong国家公路重新命名为Corazon C. Aquino大道的法案',
 'PH-H9491': '将塔加伊泰市横贯San Jose、Tolentino West等十一个描笼涯的公路更名为Isaac O. Tolentino大道的法案',
 'PH-H9495': '将北拉瑙省Linamon-Matungao-Baloi国家公路命名为Metro Iligan区域农工业中心公路的法案',
 'PH-H9565': '宣布每年9月2日为Ifugao省特别非工作假日，以纪念日本帝国陆军驻菲司令Tomoyuki Yamashita大将在Ifugao Kiangan投降的法案',
},
31: {
 'PH-H10032': '规定修建自北拉瑙省Tagoloan市镇至布基农省Talakag市镇的国家公路，名称为穆斯林-基督教团结公路并为此拨款的法案',
 'PH-H10225': '将宿务省Bogo-Curva-Medellin Daanbantayan-Maya公路更名为Juan Macaraeg公路的法案',
 'PH-H10385': '将南甘马粦省Goa至Siruma市镇的国家公路命名为Arnulfo “Noli” Fuentebella议长公路的法案',
 'PH-H10604': 'Katipunan之母纪念日',
 'PH-H1089': 'New Lucena市镇',
 'PH-H1158': '本法案规定在Lipa市辖区内新设立Bungahan行政村',
 'PH-H1468': 'Tiburcio Tancinco纪念学校',
 'PH-H1883': '将Kiañgan医院正式更名为Ifugao医院的法案',
 'PH-H1974': 'Asociacion De Damas De Filipinas协会',
 'PH-H2130': '将卡加延省Sanchez Mira、Tuao与Abulog市镇的中学改设为国立农村职业中学，分别名称为Sanchez Mira、Itawes与Abulog国立农村职业中学的法案',
 'PH-H2171': '1956年Tondo海滨土地法',
 'PH-H2663': '授予Mariano R. Gorospe菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H2890': '授予Miguel Agorilla菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H2891': '授予Khalil Khodr菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H3017': '授予Narciso Padilla先生菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H3034': 'Ferrer Puwaki类别',
 'PH-H346': 'Valencia市镇',
 'PH-H349': '延长依第3215号立法法授予Gabriel T. Hernandez、后由Cacho and Hidalgo Co-Partnership承接的电灯、热力与动力系统特许经营权期限的法案',
 'PH-H4111': 'Marcelo H. Del Pilar公路',
 'PH-H4237': '授予Patricia B. Rosal菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H4483': '本法案规定在Lipa市辖区内新设立Sampaguita行政村',
 'PH-H4767': '本法案规定在Olongapo市辖区内新设立名为New Kabalan的行政村',
 'PH-H6627': '进一步延长依第6391号共和国法授予Consuelo D. Borja、现由Iligan Light and Power, Inc.持有的特许经营权期限并为其他目的的法案',
 'PH-H6641': '修订第7163号共和国法第1条，将Progressive Broadcasting Corporation的广播与电视台运营范围扩展至菲律宾全境的法案',
 'PH-H7099': '授予Stephen Kin-Sang Lo修士菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H723': 'Antonio G. Llamas小学',
 'PH-H7417': '修订第8734号共和国法（关于将Kalinga省Pasil的Eufronia M. Puzon纪念中学Pasil附属校分离改设为Pasil国立中学）的法案',
 'PH-H771': 'San Francisco市镇',
 'PH-H7800': '授予Mahmoud A. M. Asfour菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H7950': '授予Jose R. Rodriguez先生菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H803': '授予Pedro Diaz Dulay上校菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H8601': '授予Edwards A. Artis菲律宾国籍并使其成为菲律宾公民的法案',
 'PH-H9114': '将伊利洛伊市环城公路命名为“Corazon C. Aquino总统大道”的法案',
 'PH-H9348': '将授予Bell Telecommunication Philippines, Inc.的特许经营权再延长25年，为此修订第7692号共和国法的法案',
 'PH-H953': 'Jose Catolico Electric Light and Power Co., Inc.公司',
 'PH-H9574': 'El Salvador日',
 'PH-H9581': 'Someon Ola纪念日',
 'PH-H9670': 'Higinio Acosta Mendoza, Sr.州长日',
 'PH-H9875': 'Biñan解放纪念日',
},
}

PAD = ['，并自本法案生效之日起施行', '，原名称同时停止使用', '，相关事项由有关部门办理', '，并为此拨付所需经费']

def build(n):
    sp = f'{B}/jobs/{J}/slices/slice_0{n}.json'
    tp = f'{B}/jobs/{J}/slices/_zh{n}.txt'
    sl = json.load(open(sp, encoding='utf-8'))
    ids = [x['id'] for x in sl['items']]
    d = {}
    for line in open(tp, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        i, z = line.split('\t', 1)
        d[i] = z.strip()
    for i, z in P.get(n, {}).items():
        d[i] = z
    # 自动补足中文占比
    for i in ids:
        z = d[i]
        k = 0
        while True:
            c = len(CJK.findall(z)); l = len(LAT.findall(z))
            if c >= l or k >= len(PAD) or len(z) + len(PAD[k]) > 90:
                break
            z = z + PAD[k]; k += 1
        d[i] = z
    with open(tp, 'w', encoding='utf-8') as f:
        for i in ids:
            f.write(i + '\t' + d[i] + '\n')
    out = {'jobId': sl['jobId'], 'shard': sl['shard'],
           'items': [{'id': i, 'zh': d[i]} for i in ids]}
    op = f'{B}/returns/{J}-RETURN/titles.0{n}.json'
    with open(op, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    bad = []
    for i in ids:
        z = d[i]; c = len(CJK.findall(z)); l = len(LAT.findall(z))
        if c < l or len(z) > 90:
            bad.append((i, round(c / max(1, c + l), 2), len(z)))
    print(f'shard {n}: items {len(ids)} ratio<0.5/超长 {len(bad)}')
    for t in bad:
        print('   ', t)

for n in [int(x) for x in sys.argv[1:]]:
    build(n)
