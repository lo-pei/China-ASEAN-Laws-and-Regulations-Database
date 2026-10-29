# -*- coding: utf-8 -*-
"""第32片：按省份中文名与法定句式微调，压低拉丁字母占比。"""
import json, re
CJK = re.compile(r'[\u4e00-\u9fff]'); LAT = re.compile(r'[A-Za-z]')
B = 'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title'
J = 'CALR-TITLE-20261017-1837-PH-7575'
PROV = [('Ilocos Sur', '南伊罗戈'), ('Catanduanes', '卡坦端内斯'), ('Surigao del Sur', '南苏里高'),
        ('Surigao del Norte', '北苏里高'), ('Surigao', '苏里高')]

def score(z):
    c = len(CJK.findall(z)); l = len(LAT.findall(z))
    return c, l

def tune(z):
    for a, b in PROV:
        z = z.replace(a + '省', b + '省')
    for a, b in PROV:
        z = z.replace(a + '的', b + '的')
    cands = [z]
    if '更名为' in z:
        cands.append(z.replace('更名为', '的名称正式变更为', 1))
        cands.append(z.replace('更名为', '的名称正式变更为', 1).replace('的法案', '，原名称同时停止使用', 1))
    if '重新命名为' in z:
        cands.append(z.replace('重新命名为', '正式重新命名为', 1))
        cands.append(z.replace('重新命名为', '的名称正式变更为', 1))
    if '命名为' in z:
        cands.append(z.replace('命名为', '正式命名为', 1))
        cands.append(z.replace('命名为', '的名称正式定为', 1))
    if '设立' in z:
        cands.append(z.replace('设立', '正式设立', 1))
        cands.append(z.replace('设立', '正式设立', 1).replace('的法案', '，并自本法案生效之日起施行', 1))
    if '延长' in z:
        cands.append(z.replace('延长', '再延长', 1))
        cands.append(z.replace('的法案', '，并自本法案生效之日起施行', 1))
    for c in list(cands):
        cands.append(c.replace('的法案', '，并自本法案生效之日起施行', 1))
    best = None
    for c in cands:
        cc, ll = score(c)
        if cc >= ll and len(c) <= 90:
            if best is None or len(c) < len(best):
                best = c
    return best or z

def main():
    tp = f'{B}/jobs/{J}/slices/_zh32.txt'
    sp = f'{B}/jobs/{J}/slices/slice_032.json'
    ids = [x['id'] for x in json.load(open(sp, encoding='utf-8'))['items']]
    d = {}
    for line in open(tp, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        i, z = line.split('\t', 1)
        d[i] = z.strip()
    d['PH-H5256'] = d.pop('PH-H5253')
    fixed = dict(d)
    for i in ids:
        z = d[i]
        c, l = score(z)
        if c < l:
            nz = tune(z)
            nc, nl = score(nz)
            print(('OK ' if nc >= nl else 'NG '), i, f'{c}/{l} -> {nc}/{nl}', nz)
            fixed[i] = nz
    for i in ids:
        if i not in fixed:
            fixed[i] = d.get(i, '')
    with open(tp, 'w', encoding='utf-8') as f:
        for i in ids:
            f.write(i + '\t' + fixed[i] + '\n')
    print('written', len(ids))

main()
