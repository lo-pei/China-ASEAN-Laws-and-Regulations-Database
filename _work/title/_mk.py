import json, re, sys, os

CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")

BASE = r'D:/A项目/Database_China–ASEAN Laws and Regulations Database/_work/title'
JOB = 'CALR-TITLE-20261017-1837-PH-7575'


def build(n):
    sp = f'{BASE}/jobs/{JOB}/slices/slice_0{n}.json'
    tp = f'{BASE}/jobs/{JOB}/slices/_zh{n}.txt'
    sl = json.load(open(sp, encoding='utf-8'))
    src = {x['id']: x['en'] for x in sl['items']}
    d = {}
    for line in open(tp, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        i, z = line.split('\t', 1)
        d[i] = z.strip()
    ids = [x['id'] for x in sl['items']]
    miss = [i for i in ids if i not in d]
    extra = [i for i in d if i not in src]
    out = {'jobId': sl['jobId'], 'shard': sl['shard'],
           'items': [{'id': i, 'zh': d[i]} for i in ids if i in d]}
    op = f'{BASE}/returns/{JOB}-RETURN/titles.0{n}.json'
    with open(op, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'shard {n}: lines {len(d)} items {len(ids)} missing {miss} extra {extra}')
    low = []
    for i in ids:
        if i not in d:
            continue
        z = d[i]
        c = len(CJK.findall(z))
        l = len(re.findall(r'[A-Za-z]', z))
        if c / max(1, c + l) < 0.5:
            low.append((i, round(c / max(1, c + l), 2), c, l, z, src[i]))
    if low:
        print(f'  ratio<0.5: {len(low)}')
        for i, r, c, l, z, e in low:
            print(f'   {i} {r} c{c}/l{l} | {e}')
            print(f'      -> {z}')


if __name__ == '__main__':
    build(sys.argv[1])
