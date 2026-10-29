# -*- coding: utf-8 -*-
import json, re, sys, collections
CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")
ALLOW = {'no','b.e.','be','reit','ppp','mas','acra','mom','sgd','sdk','llp','llps','pte','ltd','inc','corp','co','de','del','la','san','santa','santo','sto','nya'}
base = '_work/title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%03d.json'
ret = '_work/title/returns/CALR-TITLE-20261017-1837-PH-7575-RETURN/titles.%03d.json'
rows = []
for n in range(34, 41):
    sl = json.load(open(base % n, encoding='utf-8'))
    sh = json.load(open(ret % n, encoding='utf-8'))
    for it in sh['items']:
        src = next((x['en'] for x in sl['items'] if x['id'] == it['id']), '')
        zh = it['zh']
        cjk = len(CJK.findall(zh)); lat = len(re.findall(r'[A-Za-z]', zh))
        errs = []
        if len(zh) > 90: errs.append('R5')
        if cjk / max(1, cjk + lat) < 0.5: errs.append('R7')
        low = src.lower()
        for t in LATIN.findall(zh):
            if t.lower() in ALLOW: continue
            if low.find(t.lower()) < 0:
                errs.append('R8'); break
        if errs:
            rows.append((n, it['id'], ''.join(errs), round(cjk / max(1, cjk + lat) * 100), zh, src))
print('total', len(rows), collections.Counter(r[2] for r in rows))
json.dump(rows, open('_work/title/_ph34_errs.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
