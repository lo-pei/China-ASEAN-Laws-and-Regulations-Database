# -*- coding: utf-8 -*-
"""检查候选译文的长度与中文占比"""
import re, sys, io, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')


def chk(pairs, src=None):
    for pid, zh in pairs:
        c = len(re.findall(r'[\u4e00-\u9fff]', zh))
        l = len(re.findall(r'[A-Za-z]', zh))
        r = c / max(1, c + l)
        flag = 'OK ' if (len(zh) <= 90 and r >= 0.5) else 'BAD'
        extra = ''
        if src and pid in src:
            low = src[pid].lower()
            for t in re.findall(r"[A-Za-z][A-Za-z0-9&\-'.]*", zh):
                if t.lower() not in low:
                    extra = ' R8:' + t
                    break
        print('%s len=%2d cjk=%2d lat=%2d r=%.2f %s%s' % (flag, len(zh), c, l, r, pid, extra))


if __name__ == '__main__':
    ns = {}
    exec(open(sys.argv[1], encoding='utf-8').read(), ns)
    chk(ns['C'])
