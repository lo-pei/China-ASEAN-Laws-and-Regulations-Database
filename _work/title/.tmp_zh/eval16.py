import json, re
CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")
C = {
"PH-H6293": "将宿务省 Aloguinsan 市镇 Rosario 描笼涯中学改设为独立的 Rosario 国立中学，并为此拨款",
"PH-H6498": "将 Eulogio Rodriguez 省立纪念医院升格为医疗中心，更名为“Amang”医疗中心并拨款",
"PH-H9182": "将伊洛伊洛市 Jalandoni-Wilson 描笼涯现有的 Andres Bonifacio 小学改设为涵盖小学与中学的综合学校并拨款",
"PH-H10349": "将伊洛伊洛市 La Paz 区 Nabitasan 描笼涯的小学改设为同名的综合学校，并为此拨款",
"PH-H10348": "将伊洛伊洛市 Mandurriao 区 Hibao-an Sur 描笼涯的小学改设为同名的综合学校，并为此拨款",
"PH-H6196": "将宿务省 Asturias 市镇 Looc Norte 描笼涯的中学改设为独立的 Looc Norte 国立中学，并为此拨款",
"PH-H3645": "授予 Visayan 电力公司在 Dumaguete 市及东内格罗斯省三个市镇经营电灯、热力与动力系统的特许权",
"PH-H10091": "将 Sorsogon 市 San Lorenzo 小学改设为同名的综合国立学校，并为此拨款",
"PH-H6438": "将莱特省 Burauen 市镇的农业学院改设为理工学院，命名为 Burauen 理工学院并为此拨款",
"PH-H7070": "将西内格罗斯省 Cauayan 市镇的 Bulata 描笼涯附属中学从 Linaon 中学分离，名为 Bulata 国立中学并为其拨款",
"PH-H7072": "将西内格罗斯省 Cauayan 市镇的 Poblacion 附属班从 Guiljungan 描笼涯中学分离，改设为以该市镇命名的国立中学并拨款",
"PH-H9537": "将 Valenzuela 市 Malanday 描笼涯的 Polo 国立中学附属校分离，设为一所独立中学，命名为 Malanday 国立中学并为此拨款",
"PH-H7042": "将哥打巴托省 Alamada 市镇 Pigcawaran 描笼涯的国立中学附属校分离，设立 Pigcawaran 国立中学并为此拨款",
"PH-H8118": "将 Valenzuela 市 Bignay 描笼涯的国立中学附属校分离，改设为独立的 Bignay 国立中学并为此拨款",
"PH-H7181": "将 Sorsogon 省 Pilar 市镇一所中学的附属校分离，改设为独立的 Salvacion 国立中学并为此拨款",
"PH-H9423": "将 Parañaque 市 Don Bosco 描笼涯的国立中学附属校分离，改设为独立的 Don Bosco 国立中学并为此拨款",
"PH-H8366": "将 Ifugao 省 Lamut 市镇一所国立中学的 Ambasa 附属校分离，改设为独立的 Mongilit Ligmayo 国立中学，并为此拨付所需经费",
"PH-H9433": "将 Parañaque 市一所国立中学的 San Antonio 附属校分离，改设为独立的 San Antonio 国立中学并为此拨款",
"PH-H8964": "将碧瑶市 Quezon Hill 描笼涯的 Pines City 国立中学附属校分离，改设为独立的 Quezon Hill 国立中学并为此拨款",
"PH-H8351": "将碧瑶市 Asin Road 描笼涯一所国立中学的附属校分离，改设为以 Joaquin Smith 命名的独立国立中学并为此拨款",
"PH-H8568": "将 Antipolo 市 San Roque 描笼涯的国立中学附属校分离，改设为独立的 San Roque 国立中学并为此拨款",
"PH-H8377": "将阿布拉省 Lapaz 市镇 Mudeng 描笼涯的 Abra 中学附属校分离，改设为独立的 Marc Ysrael B. Bernos 纪念国立中学并拨款",
}
sl = json.load(open('_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_016.json', encoding='utf-8'))
src = {i['id']: i.get('en') or i.get('title') or '' for i in sl['items']}
for k, v in C.items():
    c = len(CJK.findall(v)); l = len(re.findall(r'[A-Za-z]', v)); r = c/max(1,c+l)
    seg = [s for s in LATIN.findall(v) if s.lower() not in src[k].lower()]
    print("%s len=%d cjk=%d lat=%d ratio=%.0f%% %s" % (k, len(v), c, l, r*100, ('R8BAD:'+str(seg)) if seg else ''))
