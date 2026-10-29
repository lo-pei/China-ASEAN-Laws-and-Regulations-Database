import json, sys, os, re, importlib

CJK = re.compile(r'[\u4e00-\u9fff]')
n = sys.argv[1]
root = os.path.dirname(os.path.abspath(__file__))
sl = json.load(open(os.path.join(root, 'jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%s.json' % n), encoding='utf-8'))
mod = importlib.import_module('tr_%s' % n)
D = mod.D
out = os.path.join(root, 'returns/CALR-TITLE-20261017-1837-PH-7575-RETURN/titles.%s.json' % n)
os.makedirs(os.path.dirname(out), exist_ok=True)
items = []
bad = []
for it in sl['items']:
    zh = D.get(it['id'])
    if zh is None:
        bad.append('缺: ' + it['id'] + ' | ' + it['en'][:60])
        continue
    items.append({'id': it['id'], 'zh': zh})
    cjk = len(CJK.findall(zh)); lat = len(re.findall(r'[A-Za-z]', zh))
    if len(zh) > 90 or cjk / max(1, cjk + lat) < 0.5:
        bad.append('%s len=%d ratio=%.0f%% | %s' % (it['id'], len(zh), 100 * cjk / max(1, cjk + lat), zh))
extra = [k for k in D if k not in {x['id'] for x in sl['items']}]
json.dump({'jobId': sl['jobId'], 'shard': sl['shard'], 'items': items}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('写入', out, len(items))
for b in bad:
    print(b)
for e in extra:
    print('多余 id:', e)
