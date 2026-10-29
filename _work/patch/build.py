# -*- coding: utf-8 -*-
"""装配补译回执：模块 → _work/patch/out/<lawId>.json

用法：python build.py <lawId> <模块…> [--title "English Title"]
写前断言：条号齐全、换行与原文严格相等、无空行、无空译。
"""
import importlib, io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, '_work', 'patch', 'src')
OUT = os.path.join(ROOT, '_work', 'patch', 'out')
MODEL = 'deepseek-v4.1-flash'
CJK = re.compile(r'[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]')


def load_mods(names):
    T = {}
    for m in names:
        mod = importlib.import_module(m)
        for nm in dir(mod):
            if nm.isupper() and isinstance(getattr(mod, nm), dict):
                d = getattr(mod, nm)
                if d and all(isinstance(k, str) for k in d):
                    T.update(d)
    return T


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    title = None
    for i, a in enumerate(sys.argv):
        if a == '--title':
            title = sys.argv[i + 1]
    lid = args[0]
    mods = [a for a in args[1:] if a != title]
    src = json.load(io.open(os.path.join(SRC, lid + '.json'), encoding='utf-8'))
    T = load_mods(mods)
    arts = src['articles']
    keys = [a['key'] for a in arts]

    miss = [k for k in keys if k not in T]
    assert not miss, '%s 缺译 %d 条: %s' % (lid, len(miss), miss[:10])
    out = []
    for a in arts:
        en = T[a['key']].strip('\n')
        assert en.strip(), '%s %s 空译' % (lid, a['key'])
        assert a['zh'].count('\n') == en.count('\n'), \
            '%s %s 换行 %d != %d' % (lid, a['key'], en.count('\n'), a['zh'].count('\n'))
        assert '\n\n' not in en, '%s %s 含空行' % (lid, a['key'])
        assert not CJK.search(en), '%s %s 含中文' % (lid, a['key'])
        lbl = a['noLabel'].strip()
        m = re.match(r'^第\s*([0-9]+)\s*条$', lbl)
        if m:
            no_label = 'Article %s' % m.group(1)
        else:
            mk = re.match(r'^\s*មាត្រា\s*([\u17E0-\u17E9]+)\s*$', lbl)
            if mk:
                num = ''.join(str(ord(c) - 0x17E0) for c in mk.group(1))
                no_label = 'Article %s' % num
            else:
                no_label = lbl or ''
        out.append({'key': a['key'], 'no': a['no'], 'noLabel': no_label, 'en': en})

    obj = {
        'lawId': lid,
        'pack': src['pack'],
        'sourceLang': src.get('srcLang') or src['language'] or 'zh',
        'targetLang': 'en',
        'titleEn': title or src.get('titleEn') or '',
        'model': MODEL,
        'articles': out,
    }
    fp = os.path.join(OUT, lid + '.json')
    io.open(fp, 'w', encoding='utf-8', newline='\n').write(json.dumps(obj, ensure_ascii=False, indent=1))
    print('写出 out/%s.json  %d 条  %d 字符' % (lid, len(out), sum(len(x['en']) for x in out)))


if __name__ == '__main__':
    main()
