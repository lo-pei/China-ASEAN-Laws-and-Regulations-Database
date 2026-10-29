# -*- coding: utf-8 -*-
import json, sys, re, importlib.util, os

CJK = re.compile(r'[\u4e00-\u9fff]')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JOB = 'CALR-TITLE-20261017-1837-PH-7575'

def load(path):
    spec = importlib.util.spec_from_file_location('m', path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for k in dir(m):
        if k.startswith('ZH'):
            return getattr(m, k)
    raise SystemExit('no ZH dict')

for s in sys.argv[1:]:
    path = os.path.join(ROOT, '.tmp_zh', 'z%s.py' % s)
    zh = load(path)
    sl = json.load(open(os.path.join(ROOT, 'jobs', JOB, 'slices', 'slice_0%s.json' % s), encoding='utf-8'))
    ids = [x['id'] for x in sl['items']]
    missing = [i for i in ids if i not in zh]
    extra = [i for i in zh if i not in ids]
    if missing: print('  [%s] 缺 %d: %s' % (s, len(missing), missing[:6]))
    if extra: print('  [%s] 多 %d: %s' % (s, len(extra), extra[:6]))
    out = {'jobId': sl['jobId'], 'shard': sl['shard'],
           'items': [{'id': i, 'zh': zh[i]} for i in ids if i in zh]}
    od = os.path.join(ROOT, 'returns', JOB + '-RETURN')
    with open(os.path.join(od, 'titles.0%s.json' % s), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('  [%s] 写入 %d 条' % (s, len(out['items'])))
    for i in ids:
        if i not in zh: continue
        t = zh[i]
        c = len(CJK.findall(t)); l = len(re.findall(r'[A-Za-z]', t))
        if len(t) > 90: print('    LEN %d %s %s' % (len(t), i, t))
        if c / max(1, c + l) < 0.5: print('    RATIO %s %s' % (i, t))
