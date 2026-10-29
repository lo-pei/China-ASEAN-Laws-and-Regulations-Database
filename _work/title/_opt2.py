# -*- coding: utf-8 -*-
"""对 26-31 片残留 R7 条目做句式加长搜索（不删专名、不音译）。"""
import json, re, itertools
CJK = re.compile(r'[\u4e00-\u9fff]'); LAT = re.compile(r'[A-Za-z]')
B = 'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title'
J = 'CALR-TITLE-20261017-1837-PH-7575'

TAILS = ['，原名称同时停止使用', '，并自本法案生效之日起施行', '，原名称即行停止使用',
         '，上述变更自本法案生效之日起施行', '，相关事宜由有关部门办理', '，并予公布施行']

def sc(z):
    return len(CJK.findall(z)), len(LAT.findall(z))

def cands(z):
    out = [z]
    base = [z]
    if '更名为' in z and '的名称正式变更为' not in z:
        base.append(z.replace('更名为', '的名称正式变更为', 1))
    if '重新命名为' in z and '的名称正式变更为' not in z:
        base.append(z.replace('重新命名为', '的名称正式变更为', 1))
    if '命名为' in z and '的名称正式确定为' not in z:
        base.append(z.replace('命名为', '的名称正式确定为', 1))
    for b in base:
        out.append(b)
        for t in TAILS:
            if t in b:
                continue
            if b.endswith('的法案'):
                out.append(b[:-2] + t + '的法案')
            else:
                out.append(b + t)
        for t1, t2 in itertools.combinations(TAILS, 2):
            if t1 in b or t2 in b:
                continue
            if b.endswith('的法案'):
                out.append(b[:-2] + t1 + t2 + '的法案')
    return out

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
        ch = 0
        for i in ids:
            z = d[i]
            c, l = sc(z)
            if c >= l and len(z) <= 90:
                continue
            best = None
            for t in cands(z):
                cc, ll = sc(t)
                if cc >= ll and len(t) <= 90:
                    if best is None or len(t) < len(best):
                        best = t
            if best:
                d[i] = best; ch += 1
        with open(tp, 'w', encoding='utf-8') as f:
            for i in ids:
                f.write(i + '\t' + d[i] + '\n')
        out = {'jobId': J, 'shard': n, 'items': [{'id': i, 'zh': d[i]} for i in ids]}
        json.dump(out, open(f'{B}/returns/{J}-RETURN/titles.0{n}.json', 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)
        bad = [(i, sc(d[i]), len(d[i])) for i in ids if sc(d[i])[0] < sc(d[i])[1] or len(d[i]) > 90]
        print(f'shard {n}: changed {ch}, left {len(bad)}')
        for t in bad:
            print('   ', t)

main()
