# -*- coding: utf-8 -*-
import json, re, sys, io
sys.path.insert(0, '.')
from _ph_sep import sep_zh

BAD = re.compile(r'(\bof\b|\bthe\b|\band\b|School|High|Level|Program|Department|National|Comprehensive|Memorial|Province|Municipality|Barangay|Annex|Extension|City of|Independent|Secondary|Elementary)')


def run(n, show=False):
    d = json.load(open('../title/jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%03d.json' % n, encoding='utf-8'))
    good, bad = [], []
    for it in d['items']:
        z = sep_zh(it['en']) if 'eparating' in it['en'][:60] else None
        if z is None or len(z) > 88 or BAD.search(z):
            bad.append((it['id'], it['en'], z))
        else:
            good.append((it['id'], it['en'], z))
    print('slice %d good=%d bad=%d' % (n, len(good), len(bad)))
    if show:
        for i, e, z in bad:
            print(i, '|', e[:150])
            print('   ->', z)
    return good, bad


if __name__ == '__main__':
    for n in range(18, 26):
        g, b = run(n, show='-v' in sys.argv)
