# -*- coding: utf-8 -*-
"""只替换指定 id 的 zh，其余原样保留；先 dry-run 报告超长/占比不足。"""
import json, re, sys, importlib

CJK = re.compile(r'[\u4e00-\u9fff]')
LAT = re.compile(r'[A-Za-z]')
BASE = '_work/title/'
RET = BASE + 'returns/CALR-TITLE-20261017-1837-PH-7575-RETURN/titles.%s.json'


def load(n, mod):
    sl = json.load(open(BASE + 'jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%s.json' % n, encoding='utf-8'))
    sh = json.load(open(RET % n, encoding='utf-8'))
    src = {x['id']: x['en'] for x in sl['items']}
    fix = importlib.import_module(mod).FIX
    return sh, src, fix


def check(zh, s):
    c = len(CJK.findall(zh)); l = len(LAT.findall(zh))
    r = c / max(1, c + l)
    bad = []
    if len(zh) > 90: bad.append('len=%d' % len(zh))
    if r < 0.5: bad.append('ratio=%.2f' % r)
    low = s.lower()
    for t in re.findall(r"[A-Za-z][A-Za-z0-9&\-'.]*", zh):
        if t.lower() not in ('no', 'inc', 'corp', 'co', 'de', 'del', 'la', 'san', 'santa', 'santo', 'sto') and low.find(t.lower()) < 0:
            bad.append('R8:%s' % t); break
    return bad


def main(n, mod, write):
    sh, src, fix = load(n, mod)
    ids = {it['id'] for it in sh['items']}
    miss = [k for k in fix if k not in ids]
    if miss: print('!! 未在片中:', miss)
    fails = []
    for it in sh['items']:
        if it['id'] in fix:
            it['zh'] = fix[it['id']]
        b = check(it['zh'].strip(), src[it['id']])
        if b: fails.append((it['id'], b, len(it['zh']), it['zh']))
    print('%s: 替换 %d 条，仍有问题 %d 条' % (n, len(fix), len(fails)))
    for f in fails: print('  ', f[0], f[1], f[2], f[3])
    if write and not fails:
        with open(RET % n, 'w', encoding='utf-8', newline='\r\n') as fh:
            fh.write(json.dumps(sh, ensure_ascii=False, indent=1))
        print('  已写入', RET % n)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], len(sys.argv) > 3 and sys.argv[3] == 'w')
