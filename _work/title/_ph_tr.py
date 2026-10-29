# -*- coding: utf-8 -*-
"""PH 标题中译：通用句式模板（21-25 片主力）"""
import re
from _ph2 import PROV, CITY, place, school, disp, norm

PROV['kalinga-apayao'] = '卡林加-阿巴尧'
PROV['kalinga apayao'] = '卡林加-阿巴尧'
CITY['paranaque city'] = '帕拉尼亚克市'

PREP = re.compile(r'^(?:in|at|In|At)\s+', re.I)


def _clean(s):
    s = norm(s).strip().strip(',.;:')
    s = re.sub(r'^(?:the|a|an)\s+', '', s, flags=re.I)
    return s.strip()


def loc_zh(t):
    """'Barangay Tambo, Paranaque City' -> '帕拉尼亚克市Tambo描笼涯'"""
    t = norm(t).strip().strip(',.;: ')
    t = PREP.sub('', t)
    t = re.sub(r'\bin the\b', ',', t, flags=re.I)
    t = re.sub(r'\bin\b', ',', t, flags=re.I)
    t = re.sub(r'\bat\b', ',', t, flags=re.I)
    t = re.sub(r'\.\s*,', ',', t)
    parts = [p.strip(' .') for p in t.split(',') if p.strip(' .')]
    out = []
    for p in reversed(parts):
        out.append(_unit(p))
    s = ''.join([x for x in out if x])
    return s


def _unit(p):
    p = _clean(p)
    low = p.lower()
    m = re.match(r'^(Barangays?|Barrangay|Baran\s*gay)\s+(.+)$', p, re.I)
    if m:
        return _nm(m.group(2)) + '描笼涯'
    m = re.match(r'^(Sitio|Purok)\s+(.+)$', p, re.I)
    if m:
        return _nm(m.group(2)) + '居民点'
    m = re.match(r'^(Zone|Zona)\s+(.+)$', p, re.I)
    if m:
        return _nm(m.group(2)) + '区'
    m = re.match(r'^(Municipality|Municipalaty|Municipallty|Munucipality|Municiaplity|Municipal)\s+of\s+(.+)$', p, re.I)
    if m:
        return _nm(m.group(2)) + '市镇'
    m = re.match(r'^(City)\s+of\s+(.+)$', p, re.I)
    if m:
        z = place(m.group(2))
        return (z if z and z.endswith('市') else ((z or _keep(m.group(2))) + '市'))
    m = re.match(r'^(Province)\s+of\s+(.+)$', p, re.I)
    if m:
        z = place(m.group(2))
        return (z if z and z.endswith('省') else ((z or _keep(m.group(2))) + '省'))
    m = re.match(r'^(.+?)\s+City$', p, re.I)
    if m:
        z = place(m.group(1)) or place(p)
        return (z if z and z.endswith('市') else ((z or _keep(m.group(1))) + '市'))
    m = re.match(r'^(.+?)\s+Province$', p, re.I)
    if m:
        z = place(m.group(1))
        return (z if z and z.endswith('省') else ((z or _keep(m.group(1))) + '省'))
    m = re.match(r'^(.+?)\s+District$', p, re.I)
    if m:
        return _nm(m.group(1)) + '区'
    if low == 'metro manila':
        return '马尼拉大都会'
    z = place(p)
    if z:
        return z
    return _keep(p)


def _keep(s):
    s = s.strip()
    s = re.sub(r'^(?:the)\s+', '', s, flags=re.I)
    return s


def _nm(s):
    """普通地名：查表，命中用中文，未命中保留原文"""
    s = _keep(s)
    z = place(s)
    if z:
        return z
    m = re.match(r'^(.*?)\s+City$', s, re.I)
    if m:
        z = place(m.group(1))
        return (z + '市') if z else s
    return s


def _name(s):
    """机构名：学校走 disp，其余原样"""
    s = _clean(s)
    if re.search(r'(?i)school|college|university|institute|academy', s):
        return disp(s)
    return s


def _ap(x):
    """拨款尾巴"""
    return x


TAILS = ['并为此拨款的法案', '并为此拨付所需经费的法案']


def out(mid, tails=None):
    return [mid + t for t in (tails or TAILS)]


EST = re.compile(
    r'(?is)^an act\s+(?:establishing|providing for the establishment of|providing for the creation of|creating|constituting)\s+'
    r'(?:an?\s+|the\s+)?(?P<what>.+?)\s+(?:in|at)\s+(?P<loc>.+?)'
    r'(?:\s*,?\s*to\s+be\s+known\s+as\s+(?:the\s+)?(?P<name>.+?))?'
    r'\s*,?\s*and\s+(?:appropriating|providing|authorizing the appropriation of|there is hereby appropriated).*$')

CONV = re.compile(
    r'(?is)^an act\s+converting\s+(?:the\s+)?(?P<old>.+?)\s+(?:in|at|situated in)\s+(?P<loc>.+?)'
    r'\s+into\s+(?:an?\s+)?(?P<new>.+?)'
    r'(?:\s*,?\s*to\s+be\s+known\s+as\s+(?:the\s+)?(?P<name>.+?))?'
    r'\s*,?\s*and\s+(?:appropriating|providing|authorizing).*$')

REN = re.compile(
    r'(?is)^an act\s+(?:renaming|changing the name of)\s+(?:the\s+)?(?P<old>.+?)'
    r'(?:\s+(?:situated\s+)?in\s+(?P<loc>[^,]+(?:,[^,]+){0,3}?))?'
    r'\s+(?:to|into|as)\s+(?:the\s+)?(?P<new>.+?)\s*\.?$')

FRAN = re.compile(
    r'(?is)^an act\s+granting\s+(?:to\s+)?(?P<who>.+?)\s*,?\s+a\s+franchise\s+'
    r'(?:for\s+an?\s+)?(?P<what>electric light,?\s*heat\s*(?:and|&)\s*(?:/or\s*)?power system|electric light and power system)'
    r'\s+(?:in|for)\s+(?:the\s+)?(?P<loc>.+?)\s*\.?$')

BED = re.compile(
    r'(?is)^an act\s+(?:increasing|providing for the increase(?:d)? of)\s+(?:the\s+)?bed capacity of\s+(?:the\s+)?'
    r'(?P<who>.+?)\s+(?:in|at)\s+(?P<loc>.+?)\s+from\s+(?P<a>[\w\-\s,()]+?)\s+to\s+(?P<b>[\w\-\s,()]+?)'
    r'\s*(?:,|and)\s*(?:and\s+)?(?:appropriating|providing|authorizing).*$')


def tr(en):
    e = norm(en).strip().rstrip('.')
    m = EST.match(e)
    if m:
        what = _clean(m.group('what'))
        if re.search(r'(?i)district office|engineering district|district engineering', what):
            return out('在%s设立%s，' % (loc_zh(m.group('loc')), what))
        w = _name(what)
        loc = loc_zh(m.group('loc'))
        nm = m.group('name')
        if nm:
            mid = '在%s设立%s，名称为%s，' % (loc, w, _name(nm))
        else:
            mid = '在%s设立%s，' % (loc, w)
        return out(mid)
    m = FRAN.match(e)
    if m:
        who = _clean(m.group('who'))
        loc = loc_zh(m.group('loc'))
        return ['授予%s在%s%s特许经营权的法案' % (who, loc, '电灯、热力与动力系统')]
    m = REN.match(e)
    if m:
        old, loc, new = _clean(m.group('old')), m.group('loc'), _clean(m.group('new'))
        o = _name(old)
        n = _name(new)
        if loc:
            return out('将%s的%s更名为%s，' % (loc_zh(loc), o, n))
        return out('将%s更名为%s，' % (o, n))
    m = CONV.match(e)
    if m:
        old = _name(_clean(m.group('old')))
        loc = loc_zh(m.group('loc'))
        new = _name(_clean(m.group('new')))
        return out('将%s的%s改设为%s，' % (loc, old, new))
    return None
