# -*- coding: utf-8 -*-
import re, sys
CJK = re.compile(r'[\u4e00-\u9fff]')
cand = {
 'PH-H8598': '将东内格罗斯省Sta. Catalina市镇至Pamplona市镇至Tanjay市之间的省道改设为国道的法案',
 'PH-H2497': '在卡加延省Gonzaga市镇与Gattaran市镇分别设立Santa Clara村与Cunig村的法案',
 'PH-H5593': '将莱特省Tolosa现有的Daniel Z. Romualdez纪念渔业学校正式更名为Leyte州立渔业学校的法案',
 'PH-H8553': '将北苏里高省境内的Socorro至Nueva Estrella至Pamosaingan描笼涯公路路段改设为国家次级公路的法案',
 'PH-H937': '明确划定达沃省Tagum市镇与Doña Alicia及Compostela市镇之间的行政边界线的法案',
 'PH-H9489': '将黎刹省Rodriguez市镇San Rafael描笼涯的Wawa公路重新命名为General Licerio I. Geronimo Highway的法案',
 'PH-H8986': '将高山省Bontoc首府镇的高山省警察办公室驻地正式命名为Camp Lt. Geronimo F. Montes军营的法案',
 'PH-H1256': '将西内格罗斯省Kabankalan市的小学正式更名为Esteban R. Abada纪念小学的法案',
 'PH-H10057': '将高山省Paracelis市镇国立中学正式更名为Serapio Gawan纪念中学的法案',
 'PH-H5175': '将北达沃省第一区的San Mariano市镇更名为Maragusan市镇的法案',
 'PH-H5168': '将甲米地省Maragondon市镇Caputatan描笼涯更名为San Miguel描笼涯并为其他目的的法案',
 'PH-H5325': '将打拉省Bamban市镇的Pacalcal描笼涯更名为De Los Remedios描笼涯并为其他目的的法案',
 'PH-H6881': '将布拉干省Balagtas的Pulonggubat农业中学更名为Pulonggubat国立中学的法案',
 'PH-H9618': '将达沃市Baguio区Tawantawan描笼涯的小学更名为Rosalia Aglay Ayag小学的法案',
 'PH-H308': '向任何找到已故众议员Wenceslao Vinzons与省长Roque Ablan遗骸的人发放奖金的法案',
 'PH-H9617': '将南甘马粦省Bula市镇的Inoyonan中学更名为Felipe P. Panton国立中学的法案',
 'PH-H8786': '将朗布隆省Odiongan市镇的Romblon国立中学-Odiongan更名为Odiongan国立中学的法案',
 'PH-H5267': '将本格特省Bokod市镇的Dennis Molintas医院更名为Dennis Molintas纪念医院的法案',
 'PH-H608': '授予Lumanlan Brothers Company在达沃省Tanabo市镇经营电灯、热力与动力系统的特许经营权的法案',
 'PH-H8865': '将Apayao省境内的Ayaga至Sta. Marcela至Flora至Lasam省道改设为国道并为此拨款的法案',
 'PH-H9494': '将甲米地省Bacoor市横贯Talaba 4与San Nicolas 3描笼涯的Molino Boulevard重新命名为Bacoor Boulevard的法案',
 'PH-H4674': '在Ozamis市设立繁育站，名称为Ozamis Breeding Station，并授权为此拨款的法案',
 'PH-H4772': '将北三宝颜省Siayan市镇政府所在地由Paranglumba村迁至Siayan Proper村的法案',
 'PH-H5434': '将伊洛伊洛省San Enrique市镇的San Enrique农业学院更名为San Enrique理工学院的法案',
 'PH-H7167': '将三描礼士省San Marcelino市镇的Santa Fe延伸中学更名为San Guillermo国立中学的法案',
 'PH-H8532': '将北达沃Asuncion - San Isidro至Compostela Valley Laak至南阿古桑Veruela之间的路段改设为国家次级公路的法案',
}
for k, z in cand.items():
    c = len(CJK.findall(z)); l = len(re.findall(r'[A-Za-z]', z))
    print(f'{k} {c/(c+l):.2f} c{c}/l{l} {z}')
