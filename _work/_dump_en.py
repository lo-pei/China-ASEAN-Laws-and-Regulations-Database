# -*- coding: utf-8 -*-
"""导出某部法规的英文缺口条文（原文 + 条号），供补译。"""
import io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = os.path.join(ROOT, 'prototype', 'data', 'laws')


def load(lid):
    return json.load(io.open(os.path.join(L, lid + '.json'), encoding='utf-8-sig'))


def gaps(d):
    out = []
    for a in d.get('articles') or []:
        t = a.get('text') or {}
        if not str(t.get('en') or '').strip():
            out.append(a)
    return out


def main():
    lid = sys.argv[1]
    lo = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    hi = int(sys.argv[3]) if len(sys.argv) > 3 else 10 ** 9
    d = load(lid)
    g = gaps(d)
    print('== %s | %s | 缺口 %d / %d 条' % (lid, (d.get('title') or {}).get('zh', ''), len(g), len(d.get('articles') or [])))
    for i, a in enumerate(g):
        if i < lo or i >= hi:
            continue
        zh = (a.get('text') or {}).get('zh') or ''
        print('#### [%d] no=%s noLabel=%s lines=%d' % (i, a.get('no'), a.get('noLabel'), zh.count('\n') + 1))
        for j, ln in enumerate(zh.split('\n'), 1):
            print('%02d| %s' % (j, ln))


main()
