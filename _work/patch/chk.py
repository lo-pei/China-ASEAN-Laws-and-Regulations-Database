# -*- coding: utf-8 -*-
"""校验补译稿：条号齐全、换行对等、源语残留、非空、长度比合理。

用法：python chk.py <lawId> [模块…]
模块须导出大写 T = {key: "en text"}，key 为切片里的 key（no 或 no#dup）。
"""
import importlib
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(ROOT, '_work', 'patch', 'src')

CJK = re.compile(r'[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]')
KHMER = re.compile(r'[\u1780-\u17FF\u19E0-\u19FF]')
THAI = re.compile(r'[\u0E00-\u0E7F]')
MYANMAR = re.compile(r'[\u1000-\u109F\uAA60-\uAA7F]')
LAO = re.compile(r'[\u0E80-\u0EFF]')
DEVANAGARI = re.compile(r'[\u0900-\u097F]')
BOILER = re.compile(r'(?i)\b(as an ai|i cannot|here is the translation|translation follows|'
                    r'note:|disclaimer:|please note)\b')

# 各源语的 (残留正则, 长度比下限, 上限)
RESIDUE = {
    'zh': (CJK, 1.0, 6.0),
    'km': (KHMER, 0.6, 4.0),
    'th': (THAI, 0.6, 4.0),
    'lo': (LAO, 0.6, 4.0),
    'my': (MYANMAR, 0.6, 4.0),
    'vi': (None, 0.6, 3.0),
}


def load_mods(names):
    T = {}
    for m in names:
        mod = importlib.import_module(m)
        found = False
        for nm in dir(mod):
            if nm.isupper() and isinstance(getattr(mod, nm), dict):
                d = getattr(mod, nm)
                if d and all(isinstance(k, str) for k in d):
                    T.update(d)
                    found = True
        if not found:
            print('!! 模块 %s 未导出字典' % m)
    return T


def main():
    lid = sys.argv[1]
    mods = sys.argv[2:]
    src = json.load(io.open(os.path.join(SRC, lid + '.json'), encoding='utf-8'))
    T = load_mods(mods)
    arts = src['articles']
    keys = [a['key'] for a in arts]
    lang = src.get('srcLang') or 'zh'
    res_re, lo, hi = RESIDUE.get(lang, (CJK, 0.6, 4.0))
    err = warn = 0
    miss = [k for k in keys if k not in T]
    extra = [k for k in T if k not in keys]
    print('== %s (%s) | 切片 %d 条 / 模块 %d 条' % (lid, lang, len(keys), len(T)))
    if miss:
        print('  [C1] 缺译 %d 条: %s' % (len(miss), ', '.join(miss[:12])))
        err += 1
    if extra:
        print('  [C2] 多余键 %d: %s' % (len(extra), ', '.join(map(str, extra[:8]))))
        err += 1
    for a in arts:
        k = a['key']
        en = T.get(k)
        if en is None:
            continue
        s = a.get('src') or a.get('zh') or ''
        if not en.strip():
            print('  [C5] 空译 %s' % k)
            err += 1
            continue
        n_src = s.count('\n')
        n_en = en.count('\n')
        if n_src != n_en:
            print('  [C6] %s 换行 %d != 原文 %d' % (k, n_en, n_src))
            err += 1
        if '\n\n' in en:
            print('  [C6b] %s 含空行' % k)
            err += 1
        if res_re is not None and res_re.search(en):
            print('  [C10] %s 含源语残留: %s' % (k, res_re.search(en).group()))
            err += 1
        if DEVANAGARI.search(en):
            print('  [C10b] %s 含天城文垃圾: %s' % (k, DEVANAGARI.search(en).group()))
            err += 1
        if BOILER.search(en):
            print('  [C8] %s 含套话' % k)
            err += 1
        r = len(en) / max(1, len(s))
        if not (lo <= r <= hi):
            print('  [C9] %s 长度比 %.2f 异常' % (k, r))
            warn += 1
    print('  结果：错误 %d / 告警 %d' % (err, warn))


if __name__ == '__main__':
    main()
