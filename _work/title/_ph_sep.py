# -*- coding: utf-8 -*-
import re
from _ph_engine import norm, zh_loc, zh_school, PROV, CITY, place

APPR = r'[Aa]ppr\w*'
KNOWN = r'[Kk]\w{1,6}n\s+[Aa]s\s+'
MAXLEN = 88


def _sp(lat):
    return (' ' + lat) if lat and re.match(r'^[A-Za-z0-9]', lat) else lat


def _annex_type(t):
    t = t.lower()
    if 'extension' in t or 'campus' in t:
        return '分校'
    return '附属校'


def _proper_and_type(name):
    """拆出专名主体与中文校型"""
    zh = zh_school(name)
    m = re.match(r'^(.*?)\s*([\u4e00-\u9fff].*)$', zh)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return '', zh


def split_from(s):
    idx = None
    for m in re.finditer(r'\s+(?:from|From)\s+', s):
        idx = m
    if not idx:
        return None
    return s[:idx.start()], s[idx.end():]


def sep_zh(s):
    s = norm(s)
    body = re.sub(r'^(An Act|Act|Republic Act)\s+[Ss]eparating\s+', '', s)
    body = body.strip().rstrip('.').strip()
    sf = split_from(body)
    if not sf:
        return None
    subj, rest = sf
    lm = re.search(r'\s+(?:in|at|In|At)\s+(.+)$', subj)
    loc = ''
    sch = subj
    if lm:
        loc = lm.group(1)
        sch = subj[:lm.start()]
    sch = sch.strip().strip(',').strip()
    nm = re.search(KNOWN + r'(?:the\s+|The\s+)?(.+?)(?:,?\s*(?:and|And)?\s*' + APPR + r'\s*(?:Fund|funds?|Funds?)\b.*)?$', rest)
    if not nm:
        return None
    new = nm.group(1).strip().strip(',').strip().rstrip('.').strip()
    if not new or len(new) < 3:
        return None
    orig, annex, atype = sch, '', '附属校'
    am = re.search(r'^(.*?)\s*[-–—]\s*(.+?)\s+(Annex|Extension|Campus)\b.*$', sch, re.I)
    if am:
        orig = am.group(1).strip()
        annex = am.group(2).strip()
        atype = _annex_type(am.group(3))
    else:
        am2 = re.search(r'^(.*?)\s+(Annex|Extension|Campus)(\s+II)?\b.*$', sch, re.I)
        if am2:
            orig = am2.group(1).strip()
            atype = _annex_type(am2.group(2))
    o = zh_school(orig)
    npro, ntyp = _proper_and_type(new)
    n = zh_school(new)
    if not n:
        return None
    loczh = zh_loc(loc) if loc else ''
    lowloc = loc.lower()
    lowo = o.lower()
    lowa = annex.lower()
    redundant = bool(annex) and (lowa in lowloc or lowa in lowo)
    same = bool(annex) and npro.lower() == lowa
    tail1 = '，并为此拨款' if re.search(APPR, rest) else ''
    tail2 = '，并拨款' if re.search(APPR, rest) else ''

    def build(keep_annex, use_same, short):
        h = '将'
        h += _sp(loczh) + '的' if loczh else ''
        h += _sp(o)
        if keep_annex and annex and not redundant:
            h += '的' + _sp(annex) + (' ' if re.match(r'^[A-Za-z0-9]', annex) else '') + atype
        else:
            h += atype
        if short:
            h += '分离为独立的'
        else:
            h += '分离，改设为独立的'
        h += ('同名' + ntyp) if use_same else _sp(n)
        return h + (tail2 if short else tail1)

    for ka, us, sh in ((True, False, False), (False, False, False), (True, True, False),
                       (False, True, False), (True, False, True), (False, False, True),
                       (True, True, True), (False, True, True)):
        if us and not same:
            continue
        cand = build(ka, us, sh)
        if len(cand) <= MAXLEN:
            return cand
    return build(False, same, True)
