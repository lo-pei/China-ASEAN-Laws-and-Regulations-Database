# -*- coding: utf-8 -*-
"""对仍无法达到 R7 的条目写入最简译法（保留全部专名，不做音译）。"""
import json, re, sys
CJK = re.compile(r'[\u4e00-\u9fff]'); LAT = re.compile(r'[A-Za-z]')
B = 'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title'
J = 'CALR-TITLE-20261017-1837-PH-7575'
C = {
'PH-H8532': '将北达沃Asuncion - San Isidro至Compostela Valley Laak至南阿古桑Veruela路段改设为国家次级公路的法案',
'PH-H10050': '将布拉干省San Jose Del Monte市San Manuel描笼涯的San Manuel中学更名为San Manuel国立中学的法案',
'PH-H2073': '批准将Escudero Electric Service Company的特许经营权及全部财产与权利转让给Manila Electric Company的法案',
'PH-H8255': '将新怡诗夏省San Jose市至Rizal省道（经Palestina-Pinili-Porais-Villa Joson-Sta. Monica-Portal）改设为国道的法案',
'PH-H8423': '将连接J.P. Laurel街与Carlos P. Garcia公路、通往达沃市国际机场的Bacaca公路重新命名为Francisco S. Dizon公路的法案',
'PH-H3265': '授予Pototan Electric Light and Power Corporation在伊洛伊洛省Pototan市镇经营电灯、热力与动力系统的特许经营权的法案',
'PH-H9486': '将横贯孔波斯特拉谷省Compostela市镇的Montevista-Cateel国家公路重新命名为Benigno S. Aquino Jr.国家公路的法案',
'PH-H775': '授予Kiamba Light and Power Company, Incorporated在哥打巴托省Kiamba市镇经营电灯、热力与动力系统的特许经营权的法案',
'PH-H7715': '将Bulacan National Agricultural State College更名为Bulacan Agricultural State College',
'PH-H9487': '将本格特省Acop、Tublay、Kapangan - Kibungan - Bakun - Sinipsip至Buguias次级公路更名为Bado Dangwa州长国家公路',
'PH-H9492': '将拉古纳省Binan市与甲米地省Ternate市镇的Governors大道重新命名为Juanito R. Remulla, Sr.公路的法案',
'PH-H614': '授予Nicolas Limcaoco在拉古纳省Cabuyao市镇Marinig、Mamati.D、Gulod与Banlik村的电灯、热力与动力系统特许经营权的法案',
'PH-H8555': '将起于三宝颜锡布格Imelda、经Bayog与Diplo Kumalarang至南三宝颜Lapuyan与Margosatubig的省道改设为国道的法案',
'PH-H9496': '将Tubod市镇Poblacion与Barakanas描笼涯的Poblacion-Caniogan国家公路命名为Arsenio Arcelo Quibranza公路的法案',
'PH-H4070': '批准将依第3783号法授予Misamis Limber Company, Inc.的特许经营权、权利与特权转让给Misamis Lumber Corporation的法案',
'PH-H7810': '将伊利甘市Sta. Felomina、Bonbonon、Digkilaan与Rogongon描笼涯连接至布基农省Talakag市镇的城市道路改设为国道的法案',
'PH-H7639': '续展并修订依第808号共和国法（经修正）授予Eastern Telecommunications Philippines, Inc.的特许经营权的法案',
'PH-H8533': '将北拉瑙省起于Baloi的Iligan - Marawi国家公路、经Matunggao至Linamon的Iligan - Aurora公路的道路改设为国道的法案',
'PH-H9259': '将南三宝颜省Aurora市镇Monte Alegre描笼涯的Juan Lumosad纪念国立中学Monte Alegre附属校更名为Monte Alegre国立中学的法案',
'PH-H7807': '将保和省Panglao与Dauis市镇的Panglao岛环岛公路（含塔比拉兰市Sitio Ubos-Totulan的Pablo Suarez大使桥）改设为国道的法案',
'PH-H10255': '将西米萨米斯省Plaridel市镇Panalsalan描笼涯的Lobog桥重新命名为Alfonso Burlat Apdujan桥的法案',
'PH-H6429': '宣布每年12月18日为“Araw Ng Laguna”及拉古纳省与San Pablo市特别工作日，以纪念已故州长Felicisimo T. San Luis的法案',
'PH-H10037': '将南拉瑙省Marawi-Maguing-Bumbaran-Wao公路重新命名为Mamintal M. Adiong Sr.州长国家公路的法案',
'PH-H9490': '将黎刹省Kay Tikling-Antipolo-Teresa-Morong国家公路重新命名为Corazon C. Aquino大道的法案',
'PH-H2312': '将西内格罗斯省Calatrava市镇Macasilao路口村与Escalante市镇Binabongol村分别更名为Castellano村与Magsaysay村的法案',
'PH-H2028': '批准San Fernando Electric Light and Power Company将邦板牙Masantol市镇电灯与动力系统特许经营权售予Felix O. Hernandez',
'PH-H4522': '修订第1272号共和国法（授予Monserrat Broadcasting System, Incorporated广播电台临时许可）的标题与若干条款的法案',
'PH-H10226': '将南拉瑙省Marawi市至Tagoloan II公路重新命名为Ahmad Domocao Alangadi Alonto Sr.参议员国家公路的法案',
'PH-H10033': '将Kalinga省Tabuk市的Boundary-Calanan-Enrile公路路段重新命名为Manuel S. Agyao大道的法案',
'PH-H349': '延长依第3215号立法法授予Gabriel T. Hernandez、后由Cacho and Hidalgo Co-Partnership承接的电灯热力动力系统特许经营权期限的法案',
'PH-H10225': '将宿务省Bogo-Curva-Medellin Daanbantayan-Maya公路更名为Juan Macaraeg公路的法案',
'PH-H2130': '将卡加延省Sanchez Mira、Tuao与Abulog市镇的中学改设为国立农村职业中学，分别名称为Sanchez Mira、Itawes与Abulog国立农村职业中学的法案',
'PH-H953': 'Jose Catolico Electric Light and Power Co., Inc.公司',
}

def main():
    for n in [26, 27, 28, 29, 30, 31]:
        tp = f'{B}/jobs/{J}/slices/_zh{n}.txt'
        sp = f'{B}/jobs/{J}/slices/slice_0{n}.json'
        ids = [x['id'] for x in json.load(open(sp, encoding='utf-8'))['items']]
        d = {}
        for line in open(tp, encoding='utf-8'):
            line = line.rstrip('\n')
            if not line.strip():
                continue
            i, z = line.split('\t', 1)
            d[i] = z.strip()
        hit = 0
        for i in ids:
            if i in C:
                d[i] = C[i]; hit += 1
        with open(tp, 'w', encoding='utf-8') as f:
            for i in ids:
                f.write(i + '\t' + d[i] + '\n')
        out = {'jobId': J, 'shard': n, 'items': [{'id': i, 'zh': d[i]} for i in ids]}
        json.dump(out, open(f'{B}/returns/{J}-RETURN/titles.0{n}.json', 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)
        print(f'shard {n}: wrote {hit} clean texts, items {len(ids)}')

main()
