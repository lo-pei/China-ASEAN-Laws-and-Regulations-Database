# -*- coding: utf-8 -*-
"""导出某法域英文缺口法规的原文切片（多源语通用）。

源文按 `text.<lang>` 自动探测：en 缺失时，依次取 zh / km / vi / th / lo / my / id / ms / pt。

用法：python mk_slice.py KH-H027 KH-H024 ...
输出：_work/patch/src/<lawId>.json
      {"lawId","pack","language","srcLang","titleZh","titleEn",
       "articles":[{"no","key","noLabel","src","zh","lines"}]}
      `zh` 为 `src` 的兼容别名（旧模块以 a['zh'] 取值）。
"""
import io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
L = os.path.join(ROOT, 'prototype', 'data', 'laws')
OUT = os.path.join(ROOT, '_work', 'patch', 'src')

SRC_ORDER = ['zh', 'km', 'vi', 'th', 'lo', 'my', 'id', 'ms', 'pt', 'en']


def pick_src(t):
    if not isinstance(t, dict):
        return '', None
    for k in SRC_ORDER:
        v = t.get(k)
        if v and str(v).strip():
            return str(v), k
    for k, v in t.items():
        if v and str(v).strip():
            return str(v), k
    return '', None


def main():
    ids = sys.argv[1:]
    if not ids:
        print('用法：python mk_slice.py <lawId> [...]')
        return
    for lid in ids:
        d = json.load(io.open(os.path.join(L, lid + '.json'), encoding='utf-8-sig'))
        arts = []
        seen = {}
        dup = 0
        langs = {}
        for a in d.get('articles') or []:
            t = a.get('text') or {}
            if str(t.get('en') or '').strip():
                continue          # 已有英文，跳过
            no = a.get('no')
            key = str(no)
            if key in seen:
                dup += 1
                key = '%s#%d' % (no, a.get('dupIndex') if a.get('dupIndex') is not None else seen[key] + 1)
            seen[str(no)] = seen.get(str(no), 0) + 1
            s, sl = pick_src(t)
            langs[sl] = langs.get(sl, 0) + 1
            arts.append({
                'no': no,
                'key': key,
                'noLabel': (a.get('noLabel') or {}).get(sl or 'zh') or '',
                'src': s,
                'zh': s,
                'lines': s.count('\n') + 1,
            })
        srcLang = max(langs, key=langs.get) if langs else None
        obj = {
            'lawId': lid,
            'pack': d.get('pack'),
            'language': d.get('language'),
            'srcLang': srcLang,
            'titleZh': (d.get('title') or {}).get('zh', ''),
            'titleEn': (d.get('title') or {}).get('en', ''),
            'articles': arts,
        }
        fp = os.path.join(OUT, lid + '.json')
        io.open(fp, 'w', encoding='utf-8', newline='\n').write(
            json.dumps(obj, ensure_ascii=False, indent=1))
        ch = sum(len(a['src']) for a in arts)
        ln = sum(a['lines'] for a in arts)
        print('%-10s %3d 条 %6d 字 %5d 行  重复no %d  src=%s | %s' %
              (lid, len(arts), ch, ln, dup, srcLang, obj['titleZh'][:34]))


if __name__ == '__main__':
    main()
