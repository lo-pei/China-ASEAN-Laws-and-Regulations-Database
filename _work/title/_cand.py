# -*- coding: utf-8 -*-
import re
CJK = re.compile(r'[\u4e00-\u9fff]'); LAT = re.compile(r'[A-Za-z]')
C = {
'PH-H10255': '将西米萨米斯省Plaridel市镇Panalsalan描笼涯的Lobog桥正式重新命名为Alfonso Burlat Apdujan桥的法案，原桥名同时废止',
'PH-H9487': '将本格特省Acop、Tublay、Kapangan - Kibungan - Bakun - Sinipsip至Buguias次级公路更名为Bado Dangwa州长国家公路',
'PH-H7715': '将Bulacan National Agricultural State College更名为Bulacan Agricultural State College',
'PH-H7810': '将伊利甘市Sta. Felomina、Bonbonon、Digkilaan与Rogongon描笼涯连接至布基农省Talakag市镇的城市道路改设为国道并自本法案生效之日起施行',
'PH-H7639': '续展并修订依第808号共和国法（经修正）授予Eastern Telecommunications Philippines, Inc.的特许经营权并自本法案生效之日起正式施行',
'PH-H3597': '授予Angel R. Cabatingan在宿务省Santa Fe市镇与同省San Remigio市镇Hagnaya村之间维护与运营渡轮服务的特许经营权的法案，并予公布施行',
'PH-H6429': '宣布每年12月18日为“Araw Ng Laguna”及拉古纳省与San Pablo市特别工作日，以纪念已故州长Felicisimo T. San Luis，并定为年度纪念日',
'PH-H10037': '将南拉瑙省Marawi-Maguing-Bumbaran-Wao公路重新命名为Mamintal M. Adiong Sr.州长国家公路的法案，原公路名称同时废止',
'PH-H2028': '批准San Fernando Electric Light and Power Company将邦板牙省Masantol市镇电灯、热力与动力系统特许经营权售予Felix O. Hernandez',
'PH-H3006': '修订第3247号共和国法（授予Cagayan Electric Power and Light Co., Inc.在卡加延德奥罗市及其郊区的特许经营权）的法案并予施行',
'PH-H349': '延长依第3215号立法法授予Gabriel T. Hernandez、后由Cacho and Hidalgo Co-Partnership承接的电灯热力动力系统特许经营权期限的法案',
'PH-H6627': '进一步延长依第6391号共和国法授予Consuelo D. Borja、现由Iligan Light and Power, Inc.持有的全部特许经营权期限并为其他目的的法案',
}
for k, v in C.items():
    c = len(CJK.findall(v)); l = len(LAT.findall(v)); n = len(v)
    print(('OK  ' if (c >= l and n <= 90) else 'NG  ') + f'{k} c{c} l{l} len{n} r{c/(c+l):.2f}')
