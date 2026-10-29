# -*- coding: utf-8 -*-
import importlib.util, io, os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tr_009.py')
spec = importlib.util.spec_from_file_location('tr_009', p)
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
D = dict(m.D)
D.pop('PH-H9289', None)
D.update({
"PH-H4727": "授予 Philippine Commercial and Industrial Bank 在菲律宾境内设立并运营私人固定点对点、陆基、陆上移动、航空与海岸至船舶无线电台的临时许可法案",
"PH-H4597": "授予 Cresenciano C. De Castro & Associates 建筑师与工程师事务所建设、运营固定点对点、陆基与陆上移动无线电通信的临时许可法案",
"PH-H4176": "授予 Associated Agricultural Activities 在菲律宾境内建设、设立、运营私人固定点对点、海岸、航空、陆基与陆上移动无线电台的临时许可法案",
"PH-H710": "授予 A. L. Ammen 运输公司及其关联公司与子公司建设、安装、设立和运营私人固定点对点与陆基无线电台的临时许可法案",
"PH-H5717": "批准 Globe Mackay 与 Clavecilla 两家无线电公司合并、移转特许权、延长其期限，并废止第 402 号共和国法若干条款的法案",
"PH-H5130": "授予 Philippine Racing Club 公司在黎刹省运营和维护赛马场的特许经营权法案",
"PH-H6457": "授予 Metro Manila 赛马俱乐部公司在 Kalookan 市建设、运营和维护赛马场的特许经营权法案",
"PH-H4157": "授予 Asiatic Integrated 公司在 Mariveles 港建设、运营和维护私人码头与泊位的特许经营权法案",
"PH-H3400": "授予 Visayas-Mindanao 工会联合会在宿务市安装、维护和运营无线电广播站的特许经营权法案",
"PH-H3278": "授予 Dagupan 电力公司在 Dagupan 市建设、设立和运营私人固定陆基与陆上移动无线电台的许可法案",
"PH-H2126": "授予 Jorge D. Bayona 在 Albay 省 Legaspi 市镇与 Batan、Rapu-Rapu 岛之间经营客货渡轮服务的特许经营权法案",
"PH-H6061": "授予 Ibaan 电力与工程公司在八打雁省 Ibaan 市镇建设、运营和维护电灯、供热与动力系统的特许经营权法案，并为其他目的",
"PH-H1281": "授予 T.H. Valderrama and Sons 公司设立、维护和运营私人固定点对点无线电话站的临时许可法案",
"PH-H8318": "将 Sorsogon 省 Gubat 市镇的 Bicol 大学延伸校区并入 Albay 省 Legaspi 市 Bicol 大学作为正规分校，界定目标并拨款的法案",
"PH-H4543": "授予 Angel Jose 运输公司设立、运营和维护私人固定点对点、陆基与陆上移动无线电台的许可法案",
"PH-H3705": "授予 Philippine Rural Reconstruction Movement 在菲律宾境内建设、维护和运营固定点对点、陆基与陆上移动无线电台的临时许可法案",
"PH-H5010": "授予 Arcadia 农业与开发公司在 Caloocan 市 Bagbaguin 村建设、运营制冰厂与冷库，并在该市及郊区售冰及供应冷库的特许经营权法案",
"PH-H3470": "授予西内格罗斯省 Sagay 的 Pioneer 玻璃制造公司在菲律宾境内建设、维护和运营私人固定点对点与陆基无线电台的临时许可法案",
"PH-H3956": "授予 Island 运输公司在 Lapu-Lapu 市 Pajo 村与宿务省 Mandaue 市镇 Lo-oc 村之间及米沙鄢各贸易枢纽之间经营客货渡轮服务的特许经营权法案",
"PH-H5264": "设立 Balikbayan 归国人员返乡计划法案",
})
with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write('import json, os\nD = {\n')
    for k, v in D.items():
        f.write('"%s": "%s",\n' % (k, v))
    f.write('}\n')
print('rewrite', len(D))
