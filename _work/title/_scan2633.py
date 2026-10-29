#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""列出 026-033 片中不通过的条目（不截断）"""
import json
import re
import sys

CJK = re.compile(r'[\u4e00-\u9fff]')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&\-'.]*")
FORBID = re.compile(r'(免责|仅供参考|翻译说明|待译|TODO|待补充|占位|略|无法翻译|原文见|以下为|说明[:：])')
ALLOW = {
    'no', 'b.e.', 'be', 'reit', 'ppp', 'mas', 'acra', 'mom', 'sgd', 'sdk',
    'llp', 'llps', 'pte', 'ltd', 'inc', 'corp', 'co', 'de', 'del', 'la',
    'san', 'santa', 'santo', 'sto', 'nya',
}
BASE = '_work/title/'
JOB = 'jobs/CALR-TITLE-20261017-1837-PH-7575/slices/slice_%s.json'
RET = 'returns/CALR-TITLE-20261017-1837-PH-7575-RETURN/titles.%s.json'


def problems(s, zh):
    out = []
    zh = (zh or '').strip()
    if not zh:
        return ['R5 空']
    if len(zh) > 90:
        out.append('R5 长%d' % len(zh))
    if zh.lower() == s.strip().lower():
        out.append('R6 照抄')
    cjk = len(CJK.findall(zh))
    lat = len(re.findall(r'[A-Za-z]', zh))
    if cjk < 2:
        out.append('R7 汉字%d' % cjk)
    if cjk / max(1, cjk + lat) < 0.5:
        out.append('R7 占比%.0f%%' % (100 * cjk / max(1, cjk + lat)))
    low = s.lower()
    for t in LATIN.findall(zh):
        if t.lower() in ALLOW:
            continue
        if low.find(t.lower()) < 0:
            out.append('R8 %s' % t)
            break
    if FORBID.search(zh):
        out.append('R9')
    for a, b in (('（', '）'), ('(', ')'), ('《', '》'), ('「', '」')):
        if zh.count(a) != zh.count(b):
            out.append('R10')
            break
    return out


def main():
    res = {}
    for n in ['026', '027', '028', '029', '030', '031', '032', '033']:
        sl = json.load(open(BASE + JOB % n, encoding='utf-8'))
        sh = json.load(open(BASE + RET % n, encoding='utf-8'))
        zh = {x['id']: x.get('zh') for x in sh['items']}
        bad = []
        for it in sl['items']:
            p = problems(it['en'], zh.get(it['id']))
            if p:
                bad.append({'id': it['id'], 'en': it['en'], 'zh': zh.get(it['id']), 'p': p})
        res[n] = bad
        print('%s: %d' % (n, len(bad)))
    json.dump(res, open('_work/title/_bad2633.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('总 %d' % sum(len(v) for v in res.values()))


main()
