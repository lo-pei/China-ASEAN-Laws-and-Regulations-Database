# -*- coding: utf-8 -*-
"""柬埔寨（KH）缺口法规的语种实测审计。

用途：`text.km` 字段未必真是高棉文 —— KH-H007 宪法的 `text.km` 里装的是英文。
按「高棉文/拉丁字母占比」逐部实测，避免把已含英文的法规重复翻译。

用法：python audit_kh.py [--json]
"""
import glob
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LAWS = os.path.join(ROOT, 'prototype', 'data', 'laws')

KHMER = re.compile(r'[\u1780-\u17FF\u19E0-\u19FF]')
LATIN = re.compile(r'[A-Za-z]')
CJK = re.compile(r'[\u4e00-\u9fff]')


def classify(s):
    k = len(KHMER.findall(s))
    l = len(LATIN.findall(s))
    c = len(CJK.findall(s))
    if not s.strip():
        return 'empty', k, l, c
    tot = k + l + c
    if tot == 0:
        return 'other', k, l, c
    if k / tot >= 0.5:
        return 'km', k, l, c
    if l / tot >= 0.5:
        return 'en', k, l, c
    if c / tot >= 0.5:
        return 'zh', k, l, c
    return 'mixed', k, l, c


def main():
    as_json = '--json' in sys.argv
    rows = []
    for fp in sorted(glob.glob(os.path.join(LAWS, 'KH-*.json'))):
        d = json.load(io.open(fp, encoding='utf-8-sig'))
        if d.get('duplicateOf'):
            continue
        lid = os.path.basename(fp)[:-5]
        arts = d.get('articles') or []
        gap = []
        for a in arts:
            t = a.get('text') or {}
            if str(t.get('en') or '').strip():
                continue
            src = t.get('km') or t.get('zh') or ''
            gap.append((a, src))
        if not gap:
            continue
        # 整部按字符量判定
        alls = ''.join(s for _, s in gap)
        kind, k, l, c = classify(alls)
        rows.append({
            'id': lid, 'pack': d.get('pack'), 'gap': len(gap), 'n': len(arts),
            'kind': kind, 'kmCh': k, 'latCh': l, 'cjkCh': c,
            'titleZh': (d.get('title') or {}).get('zh', ''),
            'titleEn': (d.get('title') or {}).get('en', ''),
        })
    if as_json:
        io.open(os.path.join(ROOT, '_work', '_kh_audit.json'), 'w', encoding='utf-8').write(
            json.dumps(rows, ensure_ascii=False, indent=1))
    from collections import Counter
    by = Counter(r['kind'] for r in rows)
    print('缺口法规 %d 部 / %d 条' % (len(rows), sum(r['gap'] for r in rows)))
    print('语种分布:', dict(by))
    print()
    for kind in ['en', 'mixed', 'zh', 'km', 'other', 'empty']:
        sub = [r for r in rows if r['kind'] == kind]
        if not sub:
            continue
        print('--- %s: %d 部 / %d 条 ---' % (kind, len(sub), sum(r['gap'] for r in sub)))
        for r in sorted(sub, key=lambda x: -x['gap'])[:14]:
            print('  %4d/%-4d %-11s km=%-6d lat=%-6d %s' % (
                r['gap'], r['n'], r['id'], r['kmCh'], r['latCh'], r['titleZh'][:26]))
        print()


main()
