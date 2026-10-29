# -*- coding: utf-8 -*-
"""通用句式规则：设立类、特许权类"""
import re
from _ph2 import norm, zh_loc, disp, place

TYPE = {
 'national science high school': '国立科学中学',
 'national high school': '国立中学',
 'elementary school': '小学',
 'high school': '中学',
 'school of arts and trades': '工艺学校',
 'trade high school': '职业中学',
 'school of fisheries': '渔业学校',
 'national agricultural school': '国立农业学校',
 'district hospital': '区医院',
 'emergency hospital': '急诊医院',
 'municipal hospital': '市镇医院',
 'provincial hospital': '省立医院',
 'hospital': '医院',
 'fish port': '渔港',
 'breeding station': '繁育站',
 'animal breeding station': '动物繁育站',
 'stock farm and/or breeding station': '畜牧场及繁育站',
 'district engineering office': '区工程办公室',
 'district office': '区办公室',
 'school of fishery': '渔业学校',
 'national school of arts and trades': '国立工艺学校',
}


def _loc(text):
    t = re.sub(r'^[, ]+', '', text.strip())
    t = re.sub(r'[, ]+$', '', t)
    return zh_loc(t)


def rule(en):
    s = norm(en).rstrip('.').strip()
    # 设立类
    m = re.match(r'(?i)^an act (?:establishing|estblishing|to establish|providing for the establishment of)\s+'
                 r'(?:a|an|the)?\s*(.+?)\s+in\s+(?:the\s+)?(.+?)[,]?\s*(?:to be known as|to be known as the|to be known as)\s+(.+?)'
                 r'[,]?\s*(?:and appropriating funds (?:therefor|therefore|thereof))?\.?$', s)
    if m:
        typ, loc, name = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
        tz = TYPE.get(typ.lower())
        if tz:
            lz = _loc(loc)
            nm = disp(name)
            return '在%s设立%s，名称为%s，并为此拨款的法案' % (lz, tz, nm)
    # 设立类（无“to be known as”）
    m = re.match(r'(?i)^an act (?:establishing|estblishing|to establish|providing for the establishment of)\s+'
                 r'(?:a|an|the)?\s*(.+?)\s+in\s+(?:the\s+)?(.+?)'
                 r'[,]?\s*(?:and appropriating funds (?:therefor|therefore|thereof)|and authorizing the appropriation of funds therefor|and appropriating the necessary funds therefor)?\.?$', s)
    if m:
        typ, loc = m.group(1).strip(), m.group(2).strip()
        tz = TYPE.get(typ.lower())
        if tz:
            return '在%s设立%s并为此拨款的法案' % (_loc(loc), tz)
    # 特许权类
    m = re.match(r'(?i)^an act (?:granting|to grant)(?: to)?\s+(.+?)\s+a franchise(?: to operate)? for an? electric light,? heat,? and powers? system'
                 r'(?: in the (?:municipality|city) of\s+(.+?))?(?:,)?\s*(?:province of\s+(.+?))?\.?$', s)
    if m:
        who = m.group(1).strip().strip('"').strip('“').strip('”')
        mun, prov = (m.group(2) or '').strip(), (m.group(3) or '').strip()
        loc = ''
        if mun and prov:
            pz = place(prov) or prov
            loc = '%s%s' % (pz if pz.endswith('省') else pz + '省', mun)
        elif mun:
            loc = mun
        return '授予%s在%s电灯、热力与动力系统特许经营权的法案' % (who, loc)
    return None
