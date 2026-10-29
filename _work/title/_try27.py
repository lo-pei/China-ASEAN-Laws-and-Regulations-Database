# -*- coding: utf-8 -*-
import re
CJK = re.compile(r'[\u4e00-\u9fff]')
cand = {
 'PH-H8556': '将伊洛伊洛省New Lucena与Sta. Barbara市镇之间的省道改设为国道的法案',
 'PH-H8468': '将索索贡省的Bacon至Sawanga至Prieto Diaz公路路段全线改设为国道的法案',
 'PH-H9198': '将拉乌尼翁省Agoo市镇现有的Baybay小学正式更名为San Manuel Sur小学的法案',
 'PH-H9425': '将比里兰省Caibiran市镇Manlabang描笼涯的国立中学更名为Caibiran国立中学的法案',
 'PH-H8497': '将保和省Balilihan、Hanopol与Batuan市镇之间的省道全线改设为国道的法案',
 'PH-H3588': '将高山省Apayao、Bontoc、Ifugao与Kalinga各副省划为两个独立正式公路工程区的法案',
 'PH-H3760': '将朗布隆省纳入Panay Development Authority的服务区域，为此修订第3856号共和国法的法案',
 'PH-H8960': '将八打雁省八打雁市Malalim描笼涯小学正式更名为Eulalia Talban Ebora纪念小学的法案',
 'PH-H8237': '将新比斯开省Dupax Del Norte市镇Lamo描笼涯的中学正式更名为Dupax Del Norte国立中学的法案',
 'PH-H6281': '在达沃市Tugbok区Manambulan描笼涯设立一所国立中学，其名称为Optaciano Hilay中学，并为此拨款的法案',
 'PH-H2165': '将萨马省Balangiga市镇现有的Balangiga初级中学改设为Balangiga农村中学的法案',
 'PH-H5684': '将布拉干省San Jose Del Monte市镇的Sapang Palay区医院床位由50张增至75张的法案',
 'PH-H8473': '将起于北三宝颜Sindangan、途经Bayog至南三宝颜Lakewood Poblacion的省道改设为国道的法案',
 'PH-H8471': '将打拉省Capas、San Jose、Mayantoc与Malacampa等市镇之间的公路全线改设为国道的法案',
 'PH-H8870': '将马里基纳市第二区Concepcion Uno与Dos描笼涯的Katipunan街改设为国道的法案',
 'PH-H10190': '将南甘马粦省Goa市镇Pinaglabanan描笼涯的中学更名为Pinaglabanan国立中学的法案',
 'PH-H8959': '将巴拉望省Linapacan市镇Bulawit描笼涯的国立中学更名为Bulawit国立中学的法案',
 'PH-H6182': '将莱特省Tabontabon市镇描笼涯中学正式更名为Justimbaste-remandaban国立中学的法案',
 'PH-H8200': '将苏丹库达拉特省Senator Ninoy Aquino、Lebak与Kalamansig等市镇间的省道改设为国道的法案',
 'PH-H6508': '将保和省连接塔比拉兰市与Panglao岛的Taytay桥正式重新命名为Ambassador Jacinto Castel Borja桥并为其他目的的法案',
 'PH-H9486': '将横贯孔波斯特拉谷省Compostela市镇的Montevista-Cateel国家公路重新命名为Benigno S. Aquino Jr.公路的法案',
 'PH-H3265': '授予Pototan Electric Light and Power Corporation在伊洛伊洛省Pototan市镇当地经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H775': '授予Kiamba Light and Power Company, Incorporated在哥打巴托省Kiamba市镇当地经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H491': '授予Inabanga Electric Service Company在保和省Inabanga市镇当地经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H616': '授予Argao Electric, Ice and Water Company在宿务省Argao市镇当地经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H7312': '在马尼拉大都会Parañaque市将Dr. Arcadio Santos中学改设为Dr. Arcadio Santos国立中学并为此拨付资金的法案',
 'PH-H2073': '批准将Escudero Electric Service Company的特许经营权及全部财产与权利转让给Manila Electric Company，并为其他目的的法案',
 'PH-H8423': '将连接J.P. Laurel街与Carlos P. Garcia公路并通往达沃市国际机场的Bacaca公路重新命名为Francisco S. Dizon Road的法案',
 'PH-H8160': '将索索贡省Sta. Magdalena市镇至Matnog市镇Pawa公路的省道正式命名为Gov. Juan G. Frivaldo Highway的法案',
 'PH-H8733': '将巴丹省Orion市镇Balagtas描笼涯的Orion国立中学正式更名为Justice Emilio Angeles Gancayco纪念中学的法案',
 'PH-H5281': '将东达沃省Gov. Generoso市镇Tagabebe描笼涯的小学更名为Hadji Hamiri Musa小学的法案',
 'PH-H9200': '将新怡诗夏省Talugtug市镇Saverona描笼涯的小学更名为Alberto G. Bautista小学的法案',
 'PH-H10255': '将西米萨米斯省Plaridel市镇Panalsalan描笼涯的Lobog桥正式重新命名为Alfonso Burlat Apdujan桥的法案',
}
for k, z in cand.items():
    c = len(CJK.findall(z)); l = len(re.findall(r'[A-Za-z]', z))
    print(f'{k} {c/(c+l):.2f} c{c}/l{l} len{len(z)}')
