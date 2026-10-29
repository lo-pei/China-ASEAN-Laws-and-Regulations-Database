# -*- coding: utf-8 -*-
import json, re, sys, os, importlib
sys.path.insert(0, '.')
from _ph_sep2 import sep

BASE = '../title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%03d.json'
OUT = '../title/returns/CALR-TITLE-20261017-1837-PH-7575-RETURN/titles.%03d.json'


def build(n):
    d = json.load(open(BASE % n, encoding='utf-8'))
    ov = {}
    p = '_ov%02d.py' % n
    if os.path.exists(p):
        ov = importlib.import_module('_ov%02d' % n).OV
    res, prob = [], []
    for it in d['items']:
        z = ov.get(it['id'])
        if z is None:
            from _ph_rule import rule
            z = rule(it['en'])
            m = None if z else re.match(r'(?i)^an act granting (?:philippine|philipine) citizenship to (.+?)\.?$', it['en'].strip())
            if m:
                z = '授予%s菲律宾公民身份、使其归化为菲律宾公民的法案' % m.group(1)
        if z is None:
            if 'eparating' in it['en'][:60]:
                z, ok = sep(it['en'])
            else:
                z, ok = None, False
            if z is None:
                prob.append((it['id'], 'NONE', it['en'][:70]))
                z = 'x'
        z = z.replace('(', '（').replace(')', '）').strip()
        from _ph_sep2 import compact
        z = compact(z, 90)
        if len(z) > 90:
            prob.append((it['id'], 'LEN%d' % len(z), z))
        import re as _re
        _c = len(_re.findall(r'[\u4e00-\u9fff]', z)); _l = len(_re.findall(r'[A-Za-z]', z))
        if _c / max(1, _c + _l) < 0.5:
            prob.append((it['id'], 'RATIO%.2f' % (_c / max(1, _c + _l)), z))
        res.append({'id': it['id'], 'zh': z})
    json.dump({'jobId': d['jobId'], 'shard': d['shard'], 'items': res},
              open(OUT % n, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('shard %d: %d 条，遗留 %d' % (n, len(res), len(prob)))
    for x in prob:
        print('  ', x[0], x[1], x[2])


if __name__ == '__main__':
    for a in sys.argv[1:]:
        build(int(a))
