# -*- coding: utf-8 -*-
import re
from _ph2 import (norm, zh_loc, disp, disp_split, cjk_ratio, spaced, place, PROV, CITY)

APPR = r'[Aa]ppr\w*'
KNOWN = r'[Kk]\w{1,6}n\s+[Aa]s\s+'
CJK = r'[\u4e00-\u9fff]'


def compact(z, limit=90):
    while len(z) > limit:
        pick = None
        for i, ch in enumerate(z):
            if ch != ' ':
                continue
            a = z[i - 1] if i else ''
            b = z[i + 1] if i + 1 < len(z) else ''
            if not (re.match(CJK, a or ' ') or re.match(CJK, b or ' ')):
                continue
            pick = i
        if pick is None:
            break
        z = z[:pick] + z[pick + 1:]
    return z


def _atype(t):
    return '分校' if re.search(r'extension|campus', t, re.I) else '附属校'


def split_from(s):
    idx = None
    for m in re.finditer(r'\s+(?:from|From)\s+', s):
        idx = m
    return (s[:idx.start()], s[idx.end():]) if idx else None


def sep(s):
    s = norm(s)
    body = re.sub(r'^(An Act|Act|Republic Act)\s+[Ss]eparating\s+', '', s).strip().rstrip('.').strip()
    sf = split_from(body)
    if not sf:
        return None, False
    subj, rest = sf
    lm = re.search(r'\s+(?:in|at|In|At)\s+(.+)$', subj)
    loc, sch = '', subj
    if lm:
        loc, sch = lm.group(1), subj[:lm.start()]
    sch = sch.strip().strip(',').strip()
    nm = re.search(KNOWN + r'(?:the\s+|The\s+)?(.+?)(?:,?\s*(?:and|And)?\s*' + APPR + r'\s*(?:Fund|funds?|Funds?)\b.*)?$', rest)
    if not nm:
        return None, False
    new = nm.group(1).strip().strip(',').strip().rstrip('.').strip()
    if len(new) < 3:
        return None, False
    orig, annex, at = sch, '', '附属校'
    am = re.search(r'^(.*?)\s*[-–—]\s*(.+?)\s+(Annex|Extension|Campus)\b.*$', sch, re.I)
    if am:
        orig, annex, at = am.group(1).strip(), am.group(2).strip(), _atype(am.group(3))
    else:
        am2 = re.search(r'^(.*?)\s+(Annex|Extension|Campus)(\s+II)?\b.*$', sch, re.I)
        if am2:
            orig, at = am2.group(1).strip(), _atype(am2.group(2))
            if am2.group(3):
                at += ' II'
    po, mo, co = disp_split(orig)
    pn, mn, cn = disp_split(new)
    lz = zh_loc(loc) if loc else ''
    lloc = (lz + ' ' + loc).lower()
    o_full, o_short = disp(orig), (mo + co)
    o_v = [o_full]
    if po and po.lower() in lloc:
        o_v.append(o_short)
    n_full = disp(new)
    n_same = '同名' + mn + cn
    same = bool(pn) and bool(annex) and pn.lower() == annex.lower()
    tails = ['，并为此拨款', '，并为此拨付所需经费', '，并为此拨付经费', '，并拨款'] if re.search(APPR, rest) else ['']
    phrases = ['分离，改设为独立的', '分离，单独改设为独立的', '分离为独立的']
    lead = '将' + (lz + '的' if lz else '')
    best = None
    for o in o_v:
        sp = '' if (not o or re.match(CJK, o[:1])) else ' '
        for keep_a in ([True, False] if annex else [False]):
            a = ('的' + spaced(annex) + ' ' + at) if keep_a else at
            nlist = [n_same, n_full] if same else [n_full]
            for n in nlist:
                for ph in phrases:
                    for tl in tails:
                        h = compact(lead + sp + o + a + ph + spaced(n) + tl)
                        r = cjk_ratio(h)
                        if len(h) <= 90 and r >= 0.505:
                            return h, True
                        if best is None or (r, -abs(len(h) - 72)) > (best[0], -abs(len(best[1]) - 72)):
                            best = (r, h)
    return best[1], False
