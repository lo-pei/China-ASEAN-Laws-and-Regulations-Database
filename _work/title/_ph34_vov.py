# -*- coding: utf-8 -*-
import json, re, sys
CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")
ALLOW = {'no','b.e.','be','reit','ppp','mas','acra','mom','sgd','sdk','llp','llps','pte','ltd','inc','corp','co','de','del','la','san','santa','santo','sto','nya'}
src = {}
for n in range(34, 41):
    sl = json.load(open('_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%03d.json' % n, encoding='utf-8'))
    for x in sl['items']:
        src[x['id']] = x['en']
d = sys.argv[1] if len(sys.argv) > 1 else '_work/title/_ph34_over2.py'
ns = {}
exec(open(d, encoding='utf-8').read(), ns)
OV = ns['OV2'] if 'OV2' in ns else ns['OV']
bad = 0
for k, zh in OV.items():
    e = src.get(k, '')
    c = len(CJK.findall(zh)); l = len(re.findall(r'[A-Za-z]', zh))
    r = c / max(1, c + l)
    msgs = []
    if len(zh) > 90: msgs.append('LEN%d' % len(zh))
    if r < 0.5: msgs.append('R7-%d%%' % (r * 100))
    for t in LATIN.findall(zh):
        if t.lower() in ALLOW: continue
        if e.lower().find(t.lower()) < 0:
            msgs.append('R8:%s' % t); break
    if zh.count('（') != zh.count('）'): msgs.append('PAREN')
    if msgs:
        bad += 1
        print(k, ' '.join(msgs), '|', zh[:60])
print('--', len(OV), 'bad', bad)
