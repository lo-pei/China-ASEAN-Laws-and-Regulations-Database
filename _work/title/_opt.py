# -*- coding: utf-8 -*-
"""对 R7 未过条目做最小增字搜索：在不超 90 字的前提下提高中文占比。"""
import json, re, itertools, sys
CJK = re.compile(r'[\u4e00-\u9fff]'); LAT = re.compile(r'[A-Za-z]')
B = 'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title/returns/CALR-TITLE-20261017-1837-PH-7575-RETURN'

OPS = [
    ('更名为', '正式更名为'),
    ('重新命名为', '正式重新命名为'),
    ('改设为', '正式改设为'),
    ('命名为', '正式命名为'),
    ('设立', '正式设立'),
    ('进行', '依法进行'),
    ('改为', '正式改为'),
]
TAIL = ['', '并予施行', '并公布施行', '并正式施行', '同时废止原名称', '并自本法案生效之日起施行', '原名称一并废止',
        '并依本法案施行', '并一体适用', '并立即施行', '并按本法案规定执行']

def score(z):
    c = len(CJK.findall(z)); l = len(LAT.findall(z))
    return c, l, len(z)

def variants(z):
    seen = set()
    bases = [z]
    if '，' in z:
        bases.append(z.replace('，', '并', 1))
        bases.append(z.replace('，', ''))
    for b in bases:
        for op in OPS:
            if op[0] in b and op[1] not in b:
                yield b.replace(op[0], op[1], 1)
        for t in TAIL:
            if t:
                yield b + t
        for (a, b1), d2 in itertools.product(OPS, [t for t in TAIL if t]):
            if a in b and b1 not in b and d2 and not b.endswith('法案'):
                yield b.replace(a, b1, 1) + d2

def main(ids):
    for n, lst in ids.items():
        p = f'{B}/titles.0{n}.json'
        d = json.load(open(p, encoding='utf-8'))
        for it in d['items']:
            if it['id'] not in lst:
                continue
            z = it['zh']; c, l, L = score(z)
            if c >= l and L <= 90:
                print(f'PASS {n} {it["id"]}')
                continue
            best = None
            for v in variants(z):
                c2, l2, L2 = score(v)
                if c2 >= l2 and L2 <= 90:
                    best = v
                    break
            if best:
                print(f'FIX  {n} {it["id"]} c{c}/l{l}->c{score(best)[0]}/l{l} len{len(best)}\n     {best}')
            else:
                print(f'DEAD {n} {it["id"]} c{c} l{l} len{L}')

IDS = {k: v for k, v in json.load(open(sys.argv[1], encoding='utf-8')).items()}
main(IDS)
