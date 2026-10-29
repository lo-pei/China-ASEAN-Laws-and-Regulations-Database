# -*- coding: utf-8 -*-
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _ph34_engine as E

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JOBS = os.path.join(ROOT, '_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices')
OUT = os.path.join(ROOT, '_work/title/returns/CALR-TITLE-20261017-1837-PH-7575-RETURN')

OV = {}
for mod in ['_ph34_over', '_ph34_over2'] + ['_ph34_b%d' % i for i in range(1, 12)]:
    try:
        m = __import__(mod)
    except Exception:
        continue
    for k, v in vars(m).items():
        if k.startswith('OV') and isinstance(v, dict):
            OV.update(v)

if __name__ == '__main__':
    print('merged', len(OV))
    for n in range(34, 41):
        sl = json.load(open(os.path.join(JOBS, 'slice_%03d.json' % n), encoding='utf-8'))
        items = []
        for it in sl['items']:
            zh = OV.get(it['id']) or E.tr_title(it['en'])
            items.append({'id': it['id'], 'zh': zh})
        out = {'jobId': sl['jobId'], 'shard': sl['shard'], 'items': items}
        os.makedirs(OUT, exist_ok=True)
        with open(os.path.join(OUT, 'titles.%03d.json' % n), 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=1)
        print('slice', n, len(items))
