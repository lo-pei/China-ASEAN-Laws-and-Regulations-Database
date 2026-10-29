# -*- coding: utf-8 -*-
import json, re, os, sys
CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")
ALLOW = {'no','b.e.','be','reit','ppp','mas','acra','mom','sgd','sdk','llp','llps','pte','ltd','inc','corp','co','de','del','la','san','santa','santo','sto','nya'}
sys.path.insert(0, '_work/title')
src = {}
for n in range(34, 41):
    for x in json.load(open('_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%03d.json' % n, encoding='utf-8'))['items']:
        src[x['id']] = x['en']
mods = ['_ph34_over', '_ph34_over2'] + ['_ph34_b%d' % i for i in range(1, 12)]
tot, bad = 0, []
for m in mods:
    if not os.path.exists('_work/title/%s.py' % m):
        continue
    ns = {}
    exec(open('_work/title/%s.py' % m, encoding='utf-8').read(), ns)
    for k, v in ns.items():
        if not k.startswith('OV') or not isinstance(v, dict):
            continue
        for i, zh in v.items():
            tot += 1
            e = src.get(i, '')
            c = len(CJK.findall(zh)); l = len(re.findall(r'[A-Za-z]', zh))
            msg = []
            if len(zh) > 90: msg.append('LEN%d' % len(zh))
            if c / max(1, c + l) < 0.5: msg.append('R7')
            for t in LATIN.findall(zh):
                if t.lower() in ALLOW: continue
                if e.lower().find(t.lower()) < 0:
                    msg.append('R8:' + t); break
            if msg: bad.append((i, ' '.join(msg), zh))
print('overrides', tot, 'bad', len(bad))
for b in bad: print(b[0], b[1], '|', b[2][:70])
