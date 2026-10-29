#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CALR · 单片标题中译自检（与 tools/verify-title-return.js 同口径）

用法：python check_zh.py <slice.json> <shard.json>
退出码 0 = 无错误（可能有警告）；1 = 有错误
"""
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


def main():
    slice_p, shard_p = sys.argv[1], sys.argv[2]
    sl = json.load(open(slice_p, encoding='utf-8'))
    sh = json.load(open(shard_p, encoding='utf-8'))
    src = {x['id']: x['en'] for x in sl['items']}
    items = sh.get('items') or []
    errs, warns = [], []

    if sh.get('jobId') != sl.get('jobId'):
        errs.append('jobId 不一致: %r != %r' % (sh.get('jobId'), sl.get('jobId')))
    if sh.get('shard') != sl.get('shard'):
        errs.append('shard 不一致: %r != %r' % (sh.get('shard'), sl.get('shard')))

    seen = {}
    for it in items:
        i = it.get('id')
        seen[i] = seen.get(i, 0) + 1
        if i not in src:
            errs.append('多余 id: %s' % i)
    for i, n in seen.items():
        if n > 1:
            errs.append('id 重复 %d 次: %s' % (n, i))
    missing = [i for i in src if i not in seen]
    if missing:
        errs.append('缺少 %d 条，前 5: %s' % (len(missing), ', '.join(missing[:5])))

    for it in items:
        i = it.get('id')
        if i not in src:
            continue
        s = src[i]
        zh = (it.get('zh') or '').strip()
        tag = '%s %s' % (i, s[:50])
        if not zh:
            errs.append('R5 空译文: ' + tag)
            continue
        if len(zh) < 2:
            errs.append('R5 过短: ' + tag)
            continue
        if len(zh) > 90:
            errs.append('R5 过长(%d): %s | %s' % (len(zh), tag, zh))
        if zh.lower() == s.strip().lower():
            errs.append('R6 照抄原文: ' + tag)
            continue
        cjk = len(CJK.findall(zh))
        lat = len(re.findall(r'[A-Za-z]', zh))
        if cjk < 2:
            errs.append('R7 中文字符过少(%d): %s | %s' % (cjk, tag, zh))
        ratio = cjk / max(1, cjk + lat)
        if ratio < 0.5:
            errs.append('R7 中文占比过低(%.0f%%): %s | %s' % (ratio * 100, tag, zh))
        low = s.lower()
        for t in LATIN.findall(zh):
            if t.lower() in ALLOW:
                continue
            if low.find(t.lower()) < 0:
                errs.append('R8 原文无此拉丁片段「%s」: %s | %s' % (t, tag, zh))
                break
        if FORBID.search(zh):
            errs.append('R9 含套话/占位: %s | %s' % (tag, zh))
        for a, b in (('（', '）'), ('(', ')'), ('《', '》'), ('「', '」')):
            if zh.count(a) != zh.count(b):
                warns.append('R10 括号不配对 %s%s: %s' % (a, b, zh))

    print('片 %s：条目 %d / 应译 %d' % (sh.get('shard'), len(items), len(src)))
    if warns:
        print('  警告 %d 条：' % len(warns))
        for w in warns[:10]:
            print('    - ' + w)
    if errs:
        print('  错误 %d 条：' % len(errs))
        for e in errs[:40]:
            print('    - ' + e)
        print('  结果：不通过')
        return 1
    print('  结果：通过')
    return 0


if __name__ == '__main__':
    sys.exit(main())
